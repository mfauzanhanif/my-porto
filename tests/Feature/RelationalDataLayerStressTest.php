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
use App\Models\User;
use Database\Seeders\PortfolioDatabaseSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Milestone 1: Relational Data Layer & Database Seeding Stress Tests
|--------------------------------------------------------------------------
*/

describe('Milestone 1 Relational Data Layer Stress Test', function () {

    describe('Relationship Definitions & Bidirectional Traversal', function () {
        test('Project <-> Category bidirectional many-to-many relationship', function () {
            $project = Project::create([
                'title' => 'Project Alpha',
                'slug' => 'project-alpha',
                'description' => 'Test project alpha',
                'tech_stack' => ['Laravel', 'Vue'],
                'is_featured' => true,
            ]);

            $category = Category::create([
                'name' => 'Backend API',
                'slug' => 'backend-api',
                'type' => CategoryType::Project,
            ]);

            $project->categories()->attach($category->id);

            // Forward traversal
            $projectFresh = $project->fresh(['categories']);
            expect($projectFresh->categories)->toHaveCount(1)
                ->and($projectFresh->categories->first()->id)->toBe($category->id)
                ->and($projectFresh->categories->first()->slug)->toBe('backend-api');

            // Backward traversal
            $categoryFresh = $category->fresh(['projects']);
            expect($categoryFresh->projects)->toHaveCount(1)
                ->and($categoryFresh->projects->first()->id)->toBe($project->id)
                ->and($categoryFresh->projects->first()->slug)->toBe('project-alpha');
        });

        test('Article <-> Category bidirectional many-to-many relationship', function () {
            $article = Article::create([
                'title' => 'Article One',
                'slug' => 'article-one',
                'excerpt' => 'Article one summary',
                'content' => '<p>Article one content</p>',
                'status' => ArticleStatus::Published,
                'is_featured' => true,
                'published_at' => now(),
            ]);

            $category = Category::create([
                'name' => 'Web Engineering',
                'slug' => 'web-engineering',
                'type' => CategoryType::Article,
            ]);

            $article->categories()->attach($category->id);

            // Forward traversal
            $articleFresh = $article->fresh(['categories']);
            expect($articleFresh->categories)->toHaveCount(1)
                ->and($articleFresh->categories->first()->id)->toBe($category->id)
                ->and($articleFresh->categories->first()->slug)->toBe('web-engineering');

            // Backward traversal
            $categoryFresh = $category->fresh(['articles']);
            expect($categoryFresh->articles)->toHaveCount(1)
                ->and($categoryFresh->articles->first()->id)->toBe($article->id)
                ->and($categoryFresh->articles->first()->slug)->toBe('article-one');
        });

        test('Article <-> Tag bidirectional many-to-many relationship', function () {
            $article = Article::create([
                'title' => 'Article Two',
                'slug' => 'article-two',
                'excerpt' => 'Article two summary',
                'content' => '<p>Article two content</p>',
                'status' => ArticleStatus::Published,
                'is_featured' => false,
                'published_at' => now(),
            ]);

            $tag = Tag::create([
                'name' => 'Laravel 13',
                'slug' => 'laravel-13',
            ]);

            $article->tags()->attach($tag->id);

            // Forward traversal
            $articleFresh = $article->fresh(['tags']);
            expect($articleFresh->tags)->toHaveCount(1)
                ->and($articleFresh->tags->first()->id)->toBe($tag->id)
                ->and($articleFresh->tags->first()->slug)->toBe('laravel-13');

            // Backward traversal
            $tagFresh = $tag->fresh(['articles']);
            expect($tagFresh->articles)->toHaveCount(1)
                ->and($tagFresh->articles->first()->id)->toBe($article->id)
                ->and($tagFresh->articles->first()->slug)->toBe('article-two');
        });
    });

    describe('Attaching, Detaching, and Sync Operations', function () {
        test('Attaching and detaching categories on Project', function () {
            $project = Project::create([
                'title' => 'Project Beta',
                'slug' => 'project-beta',
                'description' => 'Beta description',
                'tech_stack' => ['React', 'TypeScript'],
                'is_featured' => false,
            ]);

            $cat1 = Category::create(['name' => 'Cat 1', 'slug' => 'cat-1', 'type' => CategoryType::Project]);
            $cat2 = Category::create(['name' => 'Cat 2', 'slug' => 'cat-2', 'type' => CategoryType::Project]);

            // Sync multiple
            $project->categories()->sync([$cat1->id, $cat2->id]);
            expect($project->fresh()->categories)->toHaveCount(2);

            // Detach one
            $project->categories()->detach($cat1->id);
            expect($project->fresh()->categories)->toHaveCount(1)
                ->and($project->fresh()->categories->first()->id)->toBe($cat2->id);

            // Detach all
            $project->categories()->detach();
            expect($project->fresh()->categories)->toHaveCount(0);

            // Ensure categories still exist
            expect(Category::whereIn('id', [$cat1->id, $cat2->id])->count())->toBe(2);
        });

        test('Attaching and detaching tags and categories on Article', function () {
            $article = Article::create([
                'title' => 'Article Beta',
                'slug' => 'article-beta',
                'excerpt' => 'Beta summary',
                'content' => '<p>Beta content</p>',
                'status' => ArticleStatus::Draft,
                'is_featured' => false,
            ]);

            $cat = Category::create(['name' => 'Architecture', 'slug' => 'architecture', 'type' => CategoryType::Article]);
            $tag1 = Tag::create(['name' => 'TDD', 'slug' => 'tdd']);
            $tag2 = Tag::create(['name' => 'Pest', 'slug' => 'pest']);

            $article->categories()->attach($cat->id);
            $article->tags()->attach([$tag1->id, $tag2->id]);

            expect($article->fresh()->categories)->toHaveCount(1)
                ->and($article->fresh()->tags)->toHaveCount(2);

            $article->tags()->detach($tag1->id);
            expect($article->fresh()->tags)->toHaveCount(1)
                ->and($article->fresh()->tags->first()->id)->toBe($tag2->id);
        });

        test('Duplicate attachment rejected by composite primary key constraint', function () {
            $project = Project::create([
                'title' => 'Duplicate Test Project',
                'slug' => 'duplicate-test-project',
                'description' => 'Duplicate test',
                'tech_stack' => ['PHP'],
                'is_featured' => false,
            ]);

            $cat = Category::create(['name' => 'Unique Cat', 'slug' => 'unique-cat', 'type' => CategoryType::Project]);

            $project->categories()->attach($cat->id);

            // Attempting to insert duplicate pivot row should throw QueryException
            expect(fn () => DB::table('project_category')->insert([
                'project_id' => $project->id,
                'category_id' => $cat->id,
            ]))->toThrow(QueryException::class);
        });
    });

    describe('Cascading Deletions & Referential Integrity', function () {
        test('Deleting a Project deletes pivot records but preserves Categories', function () {
            $project = Project::create([
                'title' => 'Cascade Project',
                'slug' => 'cascade-project',
                'description' => 'Cascade test',
                'tech_stack' => ['PHP'],
                'is_featured' => true,
            ]);

            $category = Category::create([
                'name' => 'Cloud',
                'slug' => 'cloud',
                'type' => CategoryType::Project,
            ]);

            $project->categories()->attach($category->id);

            $this->assertDatabaseHas('project_category', [
                'project_id' => $project->id,
                'category_id' => $category->id,
            ]);

            // Delete project
            $project->delete();

            // Project gone
            $this->assertDatabaseMissing('projects', ['id' => $project->id]);

            // Pivot record cascade-deleted
            $this->assertDatabaseMissing('project_category', [
                'project_id' => $project->id,
            ]);

            // Category MUST still exist
            $this->assertDatabaseHas('categories', ['id' => $category->id]);
        });

        test('Deleting a Category deletes pivot records without deleting Projects or Articles', function () {
            $project = Project::create([
                'title' => 'Survivor Project',
                'slug' => 'survivor-project',
                'description' => 'Should survive category deletion',
                'tech_stack' => ['Go'],
                'is_featured' => false,
            ]);

            $article = Article::create([
                'title' => 'Survivor Article',
                'slug' => 'survivor-article',
                'excerpt' => 'Should survive category deletion',
                'content' => '<p>Surviving</p>',
                'status' => ArticleStatus::Published,
                'is_featured' => false,
            ]);

            $category = Category::create([
                'name' => 'Shared Category',
                'slug' => 'shared-category',
                'type' => CategoryType::Project,
            ]);

            $project->categories()->attach($category->id);
            $article->categories()->attach($category->id);

            $this->assertDatabaseHas('project_category', ['category_id' => $category->id]);
            $this->assertDatabaseHas('article_category', ['category_id' => $category->id]);

            // Delete category
            $category->delete();

            // Category gone
            $this->assertDatabaseMissing('categories', ['id' => $category->id]);

            // Both pivot records cascade-deleted
            $this->assertDatabaseMissing('project_category', ['category_id' => $category->id]);
            $this->assertDatabaseMissing('article_category', ['category_id' => $category->id]);

            // Both Project and Article MUST survive
            $this->assertDatabaseHas('projects', ['id' => $project->id]);
            $this->assertDatabaseHas('articles', ['id' => $article->id]);
        });

        test('Deleting an Article deletes pivot records but preserves Categories and Tags', function () {
            $article = Article::create([
                'title' => 'Cascade Article',
                'slug' => 'cascade-article',
                'excerpt' => 'Cascade article',
                'content' => '<p>Article</p>',
                'status' => ArticleStatus::Published,
                'is_featured' => true,
            ]);

            $category = Category::create([
                'name' => 'Article Cat',
                'slug' => 'article-cat',
                'type' => CategoryType::Article,
            ]);

            $tag = Tag::create([
                'name' => 'Article Tag',
                'slug' => 'article-tag',
            ]);

            $article->categories()->attach($category->id);
            $article->tags()->attach($tag->id);

            $this->assertDatabaseHas('article_category', ['article_id' => $article->id]);
            $this->assertDatabaseHas('article_tag', ['article_id' => $article->id]);

            // Delete article
            $article->delete();

            $this->assertDatabaseMissing('articles', ['id' => $article->id]);
            $this->assertDatabaseMissing('article_category', ['article_id' => $article->id]);
            $this->assertDatabaseMissing('article_tag', ['article_id' => $article->id]);

            // Category and Tag survive
            $this->assertDatabaseHas('categories', ['id' => $category->id]);
            $this->assertDatabaseHas('tags', ['id' => $tag->id]);
        });

        test('Deleting a Tag deletes pivot records without deleting Articles', function () {
            $article = Article::create([
                'title' => 'Tag Survivor Article',
                'slug' => 'tag-survivor-article',
                'excerpt' => 'Survivor',
                'content' => '<p>Survivor</p>',
                'status' => ArticleStatus::Published,
                'is_featured' => false,
            ]);

            $tag = Tag::create([
                'name' => 'Doomed Tag',
                'slug' => 'doomed-tag',
            ]);

            $article->tags()->attach($tag->id);
            $this->assertDatabaseHas('article_tag', ['tag_id' => $tag->id]);

            // Delete tag
            $tag->delete();

            $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
            $this->assertDatabaseMissing('article_tag', ['tag_id' => $tag->id]);
            $this->assertDatabaseHas('articles', ['id' => $article->id]);
        });
    });

    describe('Enum Casting and Query Scopes', function () {
        test('Article status enum casting and published / featured scopes', function () {
            $published = Article::create([
                'title' => 'Published One',
                'slug' => 'published-one',
                'excerpt' => 'Excerpt',
                'content' => '<p>Content</p>',
                'status' => ArticleStatus::Published,
                'is_featured' => true,
                'published_at' => now(),
            ]);

            $draft = Article::create([
                'title' => 'Draft One',
                'slug' => 'draft-one',
                'excerpt' => 'Excerpt',
                'content' => '<p>Draft</p>',
                'status' => ArticleStatus::Draft,
                'is_featured' => false,
                'published_at' => null,
            ]);

            // Cast verification
            expect($published->status)->toBeInstanceOf(ArticleStatus::class)
                ->and($published->status)->toBe(ArticleStatus::Published)
                ->and($published->status->value)->toBe('published')
                ->and($published->status->label())->toBe('Published')
                ->and($published->isPublished())->toBeTrue()
                ->and($draft->status)->toBe(ArticleStatus::Draft)
                ->and($draft->status->value)->toBe('draft')
                ->and($draft->status->label())->toBe('Draft')
                ->and($draft->isPublished())->toBeFalse();

            // Scope Article::published()
            $publishedArticles = Article::published()->get();
            expect($publishedArticles->pluck('id'))->toContain($published->id)
                ->and($publishedArticles->pluck('id'))->not->toContain($draft->id);

            // Scope Article::featured()
            $featuredArticles = Article::featured()->get();
            expect($featuredArticles->pluck('id'))->toContain($published->id)
                ->and($featuredArticles->pluck('id'))->not->toContain($draft->id);
        });

        test('Project featured scope, casting, and route key', function () {
            $featured = Project::create([
                'title' => 'Featured Proj',
                'slug' => 'featured-proj',
                'description' => 'Featured desc',
                'tech_stack' => ['Laravel', 'PostgreSQL', 'Tailwind'],
                'is_featured' => true,
            ]);

            $nonFeatured = Project::create([
                'title' => 'Archived Proj',
                'slug' => 'archived-proj',
                'description' => 'Archived desc',
                'tech_stack' => ['HTML', 'CSS'],
                'is_featured' => false,
            ]);

            // Cast verification
            expect($featured->is_featured)->toBeTrue()
                ->and($featured->tech_stack)->toBe(['Laravel', 'PostgreSQL', 'Tailwind'])
                ->and($nonFeatured->is_featured)->toBeFalse()
                ->and($featured->getRouteKeyName())->toBe('slug');

            // Scope Project::featured()
            $featuredProjects = Project::featured()->get();
            expect($featuredProjects->pluck('id'))->toContain($featured->id)
                ->and($featuredProjects->pluck('id'))->not->toContain($nonFeatured->id);
        });

        test('Skill featured and category scopes', function () {
            $backend = Skill::create([
                'name' => 'PHP',
                'category' => 'Backend',
                'level' => 'Advanced',
                'icon' => 'php-icon',
                'is_featured' => true,
            ]);

            $frontend = Skill::create([
                'name' => 'CSS',
                'category' => 'Frontend',
                'level' => 'Intermediate',
                'icon' => 'css-icon',
                'is_featured' => false,
            ]);

            // Scope Skill::featured()
            $featuredSkills = Skill::featured()->get();
            expect($featuredSkills->pluck('id'))->toContain($backend->id)
                ->and($featuredSkills->pluck('id'))->not->toContain($frontend->id);

            // Scope Skill::byCategory()
            $backendSkills = Skill::byCategory('Backend')->get();
            expect($backendSkills->pluck('id'))->toContain($backend->id)
                ->and($backendSkills->pluck('id'))->not->toContain($frontend->id);
        });

        test('Category type enum casting and type scopes', function () {
            $articleCat = Category::create([
                'name' => 'Tutorials',
                'slug' => 'tutorials',
                'type' => CategoryType::Article,
            ]);

            $projectCat = Category::create([
                'name' => 'Fullstack',
                'slug' => 'fullstack',
                'type' => CategoryType::Project,
            ]);

            expect($articleCat->type)->toBeInstanceOf(CategoryType::class)
                ->and($articleCat->type)->toBe(CategoryType::Article)
                ->and($articleCat->type->label())->toBe('Article')
                ->and($projectCat->type)->toBe(CategoryType::Project)
                ->and($projectCat->type->label())->toBe('Project');

            $articleCats = Category::article()->get();
            expect($articleCats->pluck('id'))->toContain($articleCat->id)
                ->and($articleCats->pluck('id'))->not->toContain($projectCat->id);

            $projectCats = Category::project()->get();
            expect($projectCats->pluck('id'))->toContain($projectCat->id)
                ->and($projectCats->pluck('id'))->not->toContain($articleCat->id);
        });

        test('Profile sosmed json casting', function () {
            $profile = Profile::create([
                'name' => 'M FAUZAN HANIF',
                'headline' => 'Software Engineer',
                'about' => 'Bio',
                'email' => 'fauzan@example.com',
                'sosmed' => [
                    'github' => 'https://github.com/test',
                    'linkedin' => 'https://linkedin.com/in/test',
                ],
            ]);

            expect($profile->sosmed)->toBeArray()
                ->and($profile->sosmed['github'])->toBe('https://github.com/test');
        });

        test('Experience, Education, and Certification chronological scopes and helpers', function () {
            $expPast = Experience::create([
                'company' => 'Old Corp',
                'role' => 'Junior Dev',
                'start_date' => '2020-01-01',
                'end_date' => '2021-12-31',
            ]);

            $expCurrent = Experience::create([
                'company' => 'New Corp',
                'role' => 'Senior Dev',
                'start_date' => '2022-01-01',
                'end_date' => null,
            ]);

            expect($expCurrent->isCurrent())->toBeTrue()
                ->and($expPast->isCurrent())->toBeFalse();

            $orderedExp = Experience::chronological()->get();
            // Current / latest start_date comes first
            expect($orderedExp->first()->id)->toBe($expCurrent->id);

            $eduPast = Education::create([
                'institution' => 'High School',
                'degree' => 'Diploma',
                'start_year' => 2015,
                'end_year' => 2018,
            ]);

            $eduRecent = Education::create([
                'institution' => 'University',
                'degree' => 'BSc',
                'start_year' => 2019,
                'end_year' => 2023,
            ]);

            $orderedEdu = Education::chronological()->get();
            expect($orderedEdu->first()->id)->toBe($eduRecent->id);

            $certOld = Certification::create([
                'name' => 'Old Cert',
                'issuer' => 'Org A',
                'issued_at' => '2021-06-01',
            ]);

            $certNew = Certification::create([
                'name' => 'New Cert',
                'issuer' => 'Org B',
                'issued_at' => '2024-06-01',
            ]);

            $orderedCert = Certification::chronological()->get();
            expect($orderedCert->first()->id)->toBe($certNew->id);
        });
    });

    describe('PortfolioDatabaseSeeder Empirical Execution & Data Integrity', function () {
        test('Seeder populates all required entities with correct relations and properties', function () {
            $this->seed(PortfolioDatabaseSeeder::class);

            // 1. Admin user verification
            $admin = User::where('email', 'fauzanhanif2112@gmail.com')->first();
            expect($admin)->not->toBeNull()
                ->and($admin->name)->toBe('M FAUZAN HANIF');

            // 2. Profile verification
            $profile = Profile::first();
            expect($profile)->not->toBeNull()
                ->and($profile->email)->toBe('fauzanhanif2112@gmail.com')
                ->and($profile->sosmed)->toBeArray()
                ->and($profile->sosmed)->toHaveKey('github')
                ->and($profile->sosmed)->toHaveKey('linkedin');

            // 3. Categories count and types
            $projectCategories = Category::project()->get();
            $articleCategories = Category::article()->get();
            expect($projectCategories->count())->toBeGreaterThanOrEqual(4)
                ->and($articleCategories->count())->toBeGreaterThanOrEqual(4);

            // 4. Tags count
            expect(Tag::count())->toBeGreaterThanOrEqual(10);

            // 5. Skills count and featured scope
            expect(Skill::count())->toBeGreaterThanOrEqual(16)
                ->and(Skill::featured()->count())->toBeGreaterThan(0)
                ->and(Skill::byCategory('Backend')->count())->toBeGreaterThan(0)
                ->and(Skill::byCategory('Frontend')->count())->toBeGreaterThan(0)
                ->and(Skill::byCategory('Tools')->count())->toBeGreaterThan(0);

            // 6. Projects and their categories
            $featuredProjects = Project::featured()->with('categories')->get();
            expect($featuredProjects->count())->toBe(3);
            foreach ($featuredProjects as $p) {
                expect($p->categories)->not->toBeEmpty();
            }

            // 7. Articles and their categories & tags
            $publishedArticles = Article::published()->with(['categories', 'tags'])->get();
            expect($publishedArticles->count())->toBe(3);
            foreach ($publishedArticles as $a) {
                expect($a->categories)->not->toBeEmpty()
                    ->and($a->tags)->not->toBeEmpty()
                    ->and($a->isPublished())->toBeTrue();
            }

            // 8. Draft article exists and is excluded from published scope
            $draftArticles = Article::where('status', ArticleStatus::Draft)->get();
            expect($draftArticles->count())->toBe(1);
            expect($publishedArticles->pluck('id'))->not->toContain($draftArticles->first()->id);

            // 9. Educations, Experiences, Certifications exist
            expect(Education::count())->toBeGreaterThanOrEqual(1)
                ->and(Experience::count())->toBeGreaterThanOrEqual(2)
                ->and(Certification::count())->toBeGreaterThanOrEqual(3);
        });
    });
});
