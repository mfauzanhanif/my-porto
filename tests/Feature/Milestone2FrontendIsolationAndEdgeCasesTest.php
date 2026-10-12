<?php

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use Inertia\Testing\AssertableInertia as Assert;

/*
|--------------------------------------------------------------------------
| Milestone 2: Frontend Layout Isolation, Empty State, and Edge Cases
|--------------------------------------------------------------------------
| Author: Challenger 2 (Milestone 2)
| Scope:
|  1. Public layout isolation: public pages render dedicated components,
|     admin dashboard strictly redirects to login for guests.
|  2. Complete empty state resilience: when all database tables are empty,
|     all public endpoints return 200 OK with safe array/null props.
|  3. TipTap HTML payload integrity & styling tokens contract.
|  4. Edge cases: Unicode, null images, malformed tech stacks, missing relations.
|--------------------------------------------------------------------------
*/

describe('Milestone 2 Frontend Isolation, Empty States & Edge Cases', function () {

    describe('1. Layout Isolation & Route Separation', function () {
        test('public pages render isolated components without admin layout leaking', function () {
            // Seed minimum records for detail routes
            $project = Project::create([
                'title' => 'Isolation Probe Project',
                'slug' => 'isolation-probe-project',
                'description' => 'Testing public isolation',
            ]);

            $article = Article::create([
                'title' => 'Isolation Probe Article',
                'slug' => 'isolation-probe-article',
                'excerpt' => 'Probe excerpt',
                'content' => '<p>Probe content</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            // Test 1: Home
            $this->get('/')
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('welcome', false)
                );

            // Test 2: Projects Index
            $this->get('/projects')
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('projects', false)
                );

            // Test 3: Projects Detail
            $this->get("/projects/{$project->slug}")
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('projects/show', false)
                );

            // Test 4: Articles Index
            $this->get('/articles')
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('articles', false)
                );

            // Test 5: Articles Detail
            $this->get("/articles/{$article->slug}")
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('articles/show', false)
                );
        });

        test('admin dashboard is strictly isolated and protected from public guests', function () {
            $this->assertGuest();

            $response = $this->get('/dashboard');

            // Must redirect guests away from CMS admin
            $response->assertRedirect('/login');
        });
    });

    describe('2. Empty State Resilience & Graceful Fallbacks', function () {
        test('landing page renders gracefully with 0 records in all tables', function () {
            // Zero records exist
            expect(Profile::count())->toBe(0)
                ->and(Skill::count())->toBe(0)
                ->and(Project::count())->toBe(0)
                ->and(Article::count())->toBe(0)
                ->and(Experience::count())->toBe(0)
                ->and(Education::count())->toBe(0)
                ->and(Certification::count())->toBe(0);

            $response = $this->get('/');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('welcome', false)
                ->where('profile.name', 'M FAUZAN HANIF') // Default fallback profile
                ->where('profile.email', 'fauzanhanif2112@gmail.com')
                ->where('skills', [])
                ->where('experiences', [])
                ->where('educations', [])
                ->where('certifications', [])
                ->where('featuredProjects', [])
                ->where('featuredArticles', [])
            );
        });

        test('projects index returns 200 OK with empty collections', function () {
            expect(Project::count())->toBe(0);

            $response = $this->get('/projects');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('projects', false)
                ->where('projects', [])
                ->where('categories', [])
                ->where('selectedCategory', null)
            );
        });

        test('articles index returns 200 OK with empty collections', function () {
            expect(Article::count())->toBe(0);

            $response = $this->get('/articles');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('articles', false)
                ->where('articles', [])
                ->where('categories', [])
                ->where('search', null)
            );
        });

        test('landing page gracefully hides featured sections when projects and articles exist but none are featured', function () {
            // Non-featured project
            Project::create([
                'title' => 'Hidden Project',
                'slug' => 'hidden-project',
                'description' => 'Not featured',
                'is_featured' => false,
            ]);

            // Non-featured article
            Article::create([
                'title' => 'Hidden Article',
                'slug' => 'hidden-article',
                'excerpt' => 'Hidden excerpt',
                'content' => '<p>Hidden content</p>',
                'status' => ArticleStatus::Published,
                'is_featured' => false,
                'published_at' => now(),
            ]);

            $response = $this->get('/');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('welcome', false)
                ->where('featuredProjects', [])
                ->where('featuredArticles', [])
            );
        });
    });

    describe('3. TipTap HTML Content Contract & Rendering', function () {
        test('article show delivers complex TipTap HTML payloads intact without escaping or stripping', function () {
            $richHtml = <<<'HTML'
<h2>1. Arsitektur Neobrutalism</h2>
<p>Implementasi sistem berbasis Neobrutalism mengutamakan <strong>kontras tinggi</strong> dan <em>estetika tegas</em>.</p>
<blockquote>
  <p>Design is not just what it looks like, it is how it works.</p>
</blockquote>
<pre><code>function testTipTap(): void {
    console.log("Neobrutalism Reader OK");
}</code></pre>
<ul>
  <li>Border 2px tebal</li>
  <li>Hard shadow 2px</li>
  <li>Corner radius 10px</li>
</ul>
<ol>
  <li>Langkah pertama</li>
  <li>Langkah kedua</li>
</ol>
<p>Kunjungi <a href="https://example.com">Tautan Eksternal</a> untuk dokumentasi lebih lanjut.</p>
<img src="/uploads/sample-diagram.png" alt="Arsitektur Diagram" />
HTML;

            $article = Article::create([
                'title' => 'Deep Dive TipTap Rich Text',
                'slug' => 'deep-dive-tiptap-rich-text',
                'excerpt' => 'Eksplorasi rendering HTML WYSIWYG',
                'content' => $richHtml,
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            $response = $this->get('/articles/deep-dive-tiptap-rich-text');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('articles/show', false)
                ->where('article.content', $richHtml)
                ->where('article.slug', 'deep-dive-tiptap-rich-text')
            );
        });
    });

    describe('4. Edge Cases: Malformed Data & Boundary Conditions', function () {
        test('handles projects with null image, null tech stack, or string tech stack gracefully', function () {
            $pNulls = Project::create([
                'title' => 'Project with Null Attributes',
                'slug' => 'project-null-attributes',
                'description' => 'Testing edge cases with null image and empty stack',
                'image' => null,
                'tech_stack' => null,
                'project_url' => null,
            ]);

            $pStringStack = Project::create([
                'title' => 'Project with Comma Delimited Tech Stack',
                'slug' => 'project-comma-stack',
                'description' => 'Testing fallback tech stack parsing',
                'image' => 'https://example.com/cover.jpg',
                'tech_stack' => 'Laravel, React, Tailwind, Docker',
                'project_url' => 'https://github.com/example/repo',
            ]);

            // Index
            $this->get('/projects')
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('projects', false)
                    ->has('projects', 2)
                );

            // Detail 1
            $this->get('/projects/project-null-attributes')
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('projects/show', false)
                    ->where('project.image', null)
                    ->where('project.project_url', null)
                );

            // Detail 2
            $this->get('/projects/project-comma-stack')
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('projects/show', false)
                    ->where('project.title', 'Project with Comma Delimited Tech Stack')
                );
        });

        test('handles articles with unicode emojis and missing excerpt gracefully', function () {
            $emojiArticle = Article::create([
                'title' => '🚀 Eksplorasi Laravel 13 & React 19 🔥 [Update 2026] ⚡',
                'slug' => 'eksplorasi-laravel-13-react-19-update-2026',
                'excerpt' => null, // null excerpt
                'content' => '<p>Konten artikel dengan emoji 🎉 dan karakter spesial &amp; &lt;&gt;.</p>',
                'status' => ArticleStatus::Published,
                'published_at' => now(),
            ]);

            // Index
            $this->get('/articles')
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('articles', false)
                    ->has('articles', 1)
                    ->where('articles.0.excerpt', null)
                );

            // Detail
            $this->get('/articles/eksplorasi-laravel-13-react-19-update-2026')
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('articles/show', false)
                    ->where('article.title', '🚀 Eksplorasi Laravel 13 & React 19 🔥 [Update 2026] ⚡')
                    ->where('article.excerpt', null)
                );
        });

        test('handles profile with null sosmed and null photo gracefully on landing page', function () {
            Profile::create([
                'name' => 'Minimal Profile',
                'headline' => null,
                'about' => null,
                'photo' => null,
                'email' => 'minimal@example.com',
                'sosmed' => null,
            ]);

            $response = $this->get('/');

            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page
                ->component('welcome', false)
                ->where('profile.name', 'Minimal Profile')
                ->where('profile.headline', null)
                ->where('profile.photo', null)
                ->where('profile.sosmed', null)
            );
        });
    });
});
