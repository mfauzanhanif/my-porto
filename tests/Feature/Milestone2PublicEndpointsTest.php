<?php

use App\Enums\ArticleStatus;
use App\Enums\CategoryType;
use App\Models\Article;
use App\Models\Category;
use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Tag;
use Database\Seeders\PortfolioDatabaseSeeder;
use Inertia\Testing\AssertableInertia as Assert;

/*
|--------------------------------------------------------------------------
| Milestone 2: Public HTTP Endpoints & Routing Adversarial Stress Tests
|--------------------------------------------------------------------------
| Author: Challenger 1 (Milestone 2)
| Scope:
|  1. GET /: 200 OK, 'welcome', all 7 PortfolioHomeProps keys, empty fallback & limits
|  2. GET /projects: 200 OK, category filtering, detail route 200, invalid slug 404
|  3. GET /articles: 200 OK, published scoping, keyword search filtering, show route 200
|  4. Draft article protection: draft slug strictly yields HTTP 404
|  5. Adversarial input resistance (SQL injection patterns, wildcards, empty strings)
|  6. Database seeder integration verification
|--------------------------------------------------------------------------
*/

describe('Milestone 2 Public Endpoints Stress Tests', function () {

    describe('1. Landing Page (GET /) & PortfolioHomeProps Contract', function () {
        test('GET / returns 200 OK and renders welcome Inertia component', function () {
            $response = $this->get('/');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('welcome', false)
            );
        });

        test('GET / contains all 7 keys of PortfolioHomeProps contract on empty database', function () {
            $response = $this->get('/');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('welcome', false)
                ->has('profile')
                ->has('skills')
                ->has('experiences')
                ->has('educations')
                ->has('certifications')
                ->has('featuredProjects')
                ->has('featuredArticles')
                ->where('profile.name', 'M FAUZAN HANIF')
                ->where('featuredProjects', [])
                ->where('featuredArticles', [])
                ->where('skills', [])
                ->where('experiences', [])
                ->where('educations', [])
                ->where('certifications', [])
            );
        });

        test('GET / with populated records respects featured limits, eager loading, and ordering', function () {
            Profile::create([
                'name' => 'Custom Engineer',
                'headline' => 'Lead Architect',
                'about' => 'Bio content',
                'email' => 'custom@example.com',
                'sosmed' => ['github' => 'https://github.com/custom'],
            ]);

            Skill::create(['name' => 'PHP', 'category' => 'Backend', 'proficiency_level' => 'expert', 'is_featured' => true]);
            Skill::create(['name' => 'Docker', 'category' => 'Tools', 'proficiency_level' => 'advanced', 'is_featured' => true]);
            Skill::create(['name' => 'AWS', 'category' => 'Tools', 'proficiency_level' => 'intermediate', 'is_featured' => false]);

            Experience::create([
                'company' => 'Acme Corp',
                'role' => 'Senior Engineer',
                'start_date' => '2023-01-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Building cloud APIs',
            ]);

            Education::create([
                'institution' => 'Tech University',
                'degree' => 'B.S. Computer Science',
                'field_of_study' => 'Informatics',
                'start_year' => 2018,
                'end_year' => 2022,
            ]);

            Certification::create([
                'name' => 'Solutions Architect',
                'issuer' => 'AWS',
                'issued_at' => '2023-06-01',
                'credential_url' => 'https://aws.amazon.com/verify/123',
            ]);

            $catProj = Category::create(['name' => 'Web Apps', 'slug' => 'web-apps', 'type' => CategoryType::Project]);
            $catArt = Category::create(['name' => 'DevOps', 'slug' => 'devops', 'type' => CategoryType::Article]);
            $tag = Tag::create(['name' => 'Cloud', 'slug' => 'cloud']);

            // Create 5 featured projects: only 3 should be returned on home
            for ($i = 1; $i <= 5; $i++) {
                $p = Project::create([
                    'title' => "Featured Project $i",
                    'slug' => "featured-project-$i",
                    'description' => "Description $i",
                    'is_featured' => true,
                ]);
                $p->categories()->attach($catProj->id);
            }
            // Create 1 non-featured project
            Project::create([
                'title' => 'Non-Featured Project',
                'slug' => 'non-featured-project',
                'description' => 'Not featured',
                'is_featured' => false,
            ]);

            // Create 4 featured published articles: only 3 should be returned
            for ($i = 1; $i <= 4; $i++) {
                $a = Article::create([
                    'title' => "Featured Published Article $i",
                    'slug' => "featured-pub-article-$i",
                    'excerpt' => "Excerpt $i",
                    'content' => "<p>Content $i</p>",
                    'status' => ArticleStatus::Published,
                    'is_featured' => true,
                    'published_at' => now()->subDays($i),
                ]);
                $a->categories()->attach($catArt->id);
                $a->tags()->attach($tag->id);
            }

            // Create 1 featured DRAFT article: MUST NOT appear on home
            $draftFeatured = Article::create([
                'title' => 'Featured Draft Article (Secret)',
                'slug' => 'featured-draft-article-secret',
                'excerpt' => 'Draft excerpt',
                'content' => '<p>Secret content</p>',
                'status' => ArticleStatus::Draft,
                'is_featured' => true,
                'published_at' => null,
            ]);
            $draftFeatured->categories()->attach($catArt->id);

            $response = $this->get('/');
            $response->assertOk();

            $response->assertInertia(fn (Assert $page) => $page
                ->component('welcome', false)
                ->where('profile.name', 'Custom Engineer')
                ->has('skills', 3)
                ->has('experiences', 1)
                ->has('educations', 1)
                ->has('certifications', 1)
                ->has('featuredProjects', 3) // max 3
                ->has('featuredArticles', 3) // max 3, strictly published
                ->where('featuredProjects.0.categories.0.slug', 'web-apps') // eager loaded
                ->where('featuredArticles.0.categories.0.slug', 'devops') // eager loaded
                ->where('featuredArticles.0.tags.0.slug', 'cloud') // eager loaded
            );
        });
    });

    describe('2. Public Projects (GET /projects & GET /projects/{slug})', function () {
        test('GET /projects returns 200 OK, renders projects, and returns full list without filter', function () {
            $cat = Category::create(['name' => 'Fullstack', 'slug' => 'fullstack', 'type' => CategoryType::Project]);
            $p1 = Project::create(['title' => 'Alpha App', 'slug' => 'alpha-app', 'description' => 'Alpha desc']);
            $p2 = Project::create(['title' => 'Beta App', 'slug' => 'beta-app', 'description' => 'Beta desc']);
            $p1->categories()->attach($cat->id);

            $response = $this->get('/projects');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('projects', false)
                ->has('projects', 2)
                ->has('categories', 1)
                ->where('selectedCategory', null)
            );
        });

        test('GET /projects?category={slug} filters strictly by category slug', function () {
            $catMobile = Category::create(['name' => 'Mobile', 'slug' => 'mobile', 'type' => CategoryType::Project]);
            $catWeb = Category::create(['name' => 'Web', 'slug' => 'web', 'type' => CategoryType::Project]);

            $pMobile = Project::create(['title' => 'Flutter App', 'slug' => 'flutter-app', 'description' => 'Mobile']);
            $pMobile->categories()->attach($catMobile->id);

            $pWeb = Project::create(['title' => 'Next App', 'slug' => 'next-app', 'description' => 'Web']);
            $pWeb->categories()->attach($catWeb->id);

            $response = $this->get('/projects?category=mobile');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('projects', false)
                ->has('projects', 1)
                ->where('projects.0.slug', 'flutter-app')
                ->where('selectedCategory', 'mobile')
            );
        });

        test('GET /projects?category={unknown} returns empty projects list', function () {
            Category::create(['name' => 'Web', 'slug' => 'web', 'type' => CategoryType::Project]);
            Project::create(['title' => 'Web App', 'slug' => 'web-app', 'description' => 'Desc']);

            $response = $this->get('/projects?category=non-existent-category');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('projects', false)
                ->has('projects', 0)
                ->where('selectedCategory', 'non-existent-category')
            );
        });

        test('GET /projects with blank category query treats filter as null', function () {
            Project::create(['title' => 'Any Project', 'slug' => 'any-project', 'description' => 'Desc']);

            $response = $this->get('/projects?category='.urlencode('   '));

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('projects', false)
                ->has('projects', 1)
                ->where('selectedCategory', null)
            );
        });

        test('GET /projects/{slug} with valid slug returns 200 OK and eager loads categories and related projects', function () {
            $cat = Category::create(['name' => 'Backend', 'slug' => 'backend', 'type' => CategoryType::Project]);

            $main = Project::create(['title' => 'Main Project', 'slug' => 'main-project', 'description' => 'Main desc']);
            $main->categories()->attach($cat->id);

            $related = Project::create(['title' => 'Related Project', 'slug' => 'related-project', 'description' => 'Related desc']);
            $related->categories()->attach($cat->id);

            $response = $this->get('/projects/main-project');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('projects/show', false)
                ->where('project.slug', 'main-project')
                ->has('project.categories', 1)
                ->where('project.categories.0.slug', 'backend')
                ->has('relatedProjects', 1)
                ->where('relatedProjects.0.slug', 'related-project')
            );
        });

        test('GET /projects/{slug} with invalid slug returns HTTP 404 Not Found', function () {
            $response = $this->get('/projects/non-existent-slug-xyz');

            $response->assertNotFound();
        });
    });

    describe('3. Public Articles (GET /articles & GET /articles/{slug})', function () {
        test('GET /articles returns 200 OK, renders articles, and strictly excludes draft articles', function () {
            $published = Article::create([
                'title' => 'Published Guide',
                'slug' => 'published-guide',
                'excerpt' => 'Guide excerpt',
                'content' => '<p>Public content</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            $draft = Article::create([
                'title' => 'Draft Secret Guide',
                'slug' => 'draft-secret-guide',
                'excerpt' => 'Draft excerpt',
                'content' => '<p>Secret draft content</p>',
                'status' => ArticleStatus::Draft,
                'published_at' => null,
            ]);

            $response = $this->get('/articles');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('articles', false)
                ->has('articles', 1)
                ->where('articles.0.slug', 'published-guide')
                ->where('search', null)
            );
        });

        test('GET /articles?search={term} filters published articles by title', function () {
            Article::create([
                'title' => 'Mastering Laravel 13',
                'slug' => 'mastering-laravel-13',
                'excerpt' => 'Framework tutorial',
                'content' => '<p>Content</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            Article::create([
                'title' => 'Learning Python Fast',
                'slug' => 'learning-python-fast',
                'excerpt' => 'Python tutorial',
                'content' => '<p>Content</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            $response = $this->get('/articles?search=Laravel');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('articles', false)
                ->has('articles', 1)
                ->where('articles.0.slug', 'mastering-laravel-13')
                ->where('search', 'Laravel')
            );
        });

        test('GET /articles?search={term} filters published articles by excerpt and content', function () {
            Article::create([
                'title' => 'Microservices Architecture',
                'slug' => 'microservices-architecture',
                'excerpt' => 'Discussing event-driven distributed nodes',
                'content' => '<p>Standard text</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            Article::create([
                'title' => 'Database Indexing',
                'slug' => 'database-indexing',
                'excerpt' => 'Performance tips',
                'content' => '<p>Detailed discussion about B-Tree algorithms inside storage engines</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            // Match excerpt
            $resExcerpt = $this->get('/articles?search=event-driven');
            $resExcerpt->assertOk();
            $resExcerpt->assertInertia(fn (Assert $page) => $page
                ->has('articles', 1)
                ->where('articles.0.slug', 'microservices-architecture')
            );

            // Match content
            $resContent = $this->get('/articles?search=B-Tree');
            $resContent->assertOk();
            $resContent->assertInertia(fn (Assert $page) => $page
                ->has('articles', 1)
                ->where('articles.0.slug', 'database-indexing')
            );
        });

        test('GET /articles?search={term} never reveals draft articles even if query matches title or content', function () {
            Article::create([
                'title' => 'Top Secret Unreleased Roadmap',
                'slug' => 'top-secret-unreleased-roadmap',
                'excerpt' => 'Confidential internal memo',
                'content' => '<p>Top secret vulnerability patch disclosures</p>',
                'status' => ArticleStatus::Draft,
                'published_at' => null,
            ]);

            $response = $this->get('/articles?search=Secret');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('articles', false)
                ->has('articles', 0)
                ->where('search', 'Secret')
            );
        });

        test('GET /articles with empty or whitespace search query string treats search as null', function () {
            Article::create([
                'title' => 'General Topic',
                'slug' => 'general-topic',
                'excerpt' => 'Topic excerpt',
                'content' => '<p>Topic content</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            $response = $this->get('/articles?search='.urlencode('   '));

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('articles', false)
                ->has('articles', 1)
                ->where('search', null)
            );
        });

        test('GET /articles/{slug} with valid published slug returns 200 OK and eager loads categories and tags', function () {
            $cat = Category::create(['name' => 'PHP', 'slug' => 'php', 'type' => CategoryType::Article]);
            $tag = Tag::create(['name' => 'Backend', 'slug' => 'backend']);

            $article = Article::create([
                'title' => 'Clean Code Principles',
                'slug' => 'clean-code-principles',
                'excerpt' => 'Writing readable code',
                'content' => '<article>Clean code content</article>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);
            $article->categories()->attach($cat->id);
            $article->tags()->attach($tag->id);

            $related = Article::create([
                'title' => 'Refactoring Patterns',
                'slug' => 'refactoring-patterns',
                'excerpt' => 'Refactoring legacy systems',
                'content' => '<article>Refactoring content</article>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);
            $related->categories()->attach($cat->id);

            $response = $this->get('/articles/clean-code-principles');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('articles/show', false)
                ->where('article.slug', 'clean-code-principles')
                ->has('article.categories', 1)
                ->where('article.categories.0.slug', 'php')
                ->has('article.tags', 1)
                ->where('article.tags.0.slug', 'backend')
                ->has('relatedArticles', 1)
                ->where('relatedArticles.0.slug', 'refactoring-patterns')
            );
        });

        test('GET /articles/{slug} on draft article strictly returns HTTP 404 Not Found', function () {
            Article::create([
                'title' => 'Unpublished Draft Article',
                'slug' => 'unpublished-draft-article',
                'excerpt' => 'Draft excerpt',
                'content' => '<p>Draft secret body</p>',
                'status' => ArticleStatus::Draft,
                'published_at' => null,
            ]);

            $response = $this->get('/articles/unpublished-draft-article');

            $response->assertNotFound();
        });

        test('GET /articles/{slug} on non-existent slug returns HTTP 404 Not Found', function () {
            $response = $this->get('/articles/completely-non-existent-article-slug');

            $response->assertNotFound();
        });
    });

    describe('4. Adversarial Input Stress & SQL Injection Resistance', function () {
        test('GET /projects with SQL injection payloads in category parameter executes safely', function () {
            $payloads = [
                "' OR '1'='1",
                '1; DROP TABLE projects; --',
                '../../etc/passwd',
                "admin'--",
            ];

            foreach ($payloads as $payload) {
                $response = $this->get('/projects?category='.urlencode($payload));
                $response->assertOk();
                $response->assertInertia(fn (Assert $page) => $page
                    ->component('projects', false)
                    ->where('selectedCategory', trim($payload))
                );
            }
        });

        test('GET /articles with SQL injection and wildcard payloads in search parameter executes safely', function () {
            Article::create([
                'title' => 'Standard Article',
                'slug' => 'standard-article',
                'excerpt' => 'Standard excerpt',
                'content' => '<p>Standard content</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            $payloads = [
                "' OR '1'='1",
                '%',
                '_.',
                "'; SLEEP(5); --",
                '<script>alert(1)</script>',
            ];

            foreach ($payloads as $payload) {
                $response = $this->get('/articles?search='.urlencode($payload));
                $response->assertOk();
                $response->assertInertia(fn (Assert $page) => $page
                    ->component('articles', false)
                    ->where('search', trim($payload))
                );
            }
        });
    });

    describe('5. Database Seeder Real-World Endpoints Verification', function () {
        test('Seeded database serves all public endpoints with 200 OK and realistic counts', function () {
            $this->seed(PortfolioDatabaseSeeder::class);

            // 1. Home
            $resHome = $this->get('/');
            $resHome->assertOk();
            $resHome->assertInertia(fn (Assert $page) => $page
                ->component('welcome', false)
                ->where('profile.name', 'M FAUZAN HANIF')
                ->has('skills')
                ->has('experiences')
                ->has('educations')
                ->has('certifications')
                ->has('featuredProjects')
                ->has('featuredArticles')
            );

            // 2. Projects Archive
            $resProjects = $this->get('/projects');
            $resProjects->assertOk();
            $resProjects->assertInertia(fn (Assert $page) => $page
                ->component('projects', false)
                ->has('projects')
                ->has('categories')
            );

            // 3. Articles Archive
            $resArticles = $this->get('/articles');
            $resArticles->assertOk();
            $resArticles->assertInertia(fn (Assert $page) => $page
                ->component('articles', false)
                ->has('articles')
                ->has('categories')
            );

            // 4. Seeded Project Detail
            $firstProject = Project::firstOrFail();
            $resProjectDetail = $this->get("/projects/{$firstProject->slug}");
            $resProjectDetail->assertOk();
            $resProjectDetail->assertInertia(fn (Assert $page) => $page
                ->component('projects/show', false)
                ->where('project.slug', $firstProject->slug)
            );

            // 5. Seeded Published Article Detail
            $firstPublishedArticle = Article::published()->firstOrFail();
            $resArticleDetail = $this->get("/articles/{$firstPublishedArticle->slug}");
            $resArticleDetail->assertOk();
            $resArticleDetail->assertInertia(fn (Assert $page) => $page
                ->component('articles/show', false)
                ->where('article.slug', $firstPublishedArticle->slug)
            );
        });
    });
});
