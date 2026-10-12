# Milestone 1 Seeding & Verification Architecture Report

## 1. Observation

Direct observations from codebase inspection, architecture documentation, and data layer specifications:

1. **`ORIGINAL_REQUEST.md` (lines 21–32, 71–75)**:
   - "R1. Backend Data Layer & Database Seeding (Fase 1 & Fase 2)" mandates:
     - `users`: Akun admin (`fauzanhanif2112@gmail.com` / `password`).
     - `profiles`: Data diri pemilik (M FAUZAN HANIF), headline, about, photo, email, JSON sosmed (LinkedIn, GitHub, dll).
     - `categories`: Master kategori dengan enum `type` (`article`, `project`).
     - `tags`: Master tag kata kunci khusus artikel.
     - `skills`: Keahlian teknis, bidang kategori (Backend, Frontend, Tools), level kemahiran, icon, `is_featured`.
     - `projects`: Judul, slug unik, deskripsi, `tech_stack` (JSON), image, `project_url`, `is_featured`, dan pivot `project_category`.
     - `articles`: Judul, slug unik, excerpt, `content` (LONGTEXT HTML dari WYSIWYG), `cover_image`, status enum (`draft`, `published`), `is_featured`, `published_at`, dan pivot `article_category` & `article_tag`.
     - `educations`, `experiences`, `certifications`: Riwayat pendidikan, pengalaman kerja kronologis, dan sertifikat berlisensi.
     - "Buat `PortfolioDatabaseSeeder` yang menginisialisasi seluruh data di atas secara realistis dan komprehensif."
   - Acceptance criteria line 73: "`PortfolioDatabaseSeeder` berhasil mengisi data akun admin (`fauzanhanif2112@gmail.com`), profil, skill, pengalaman, pendidikan, proyek, sertifikat, dan artikel."

2. **`PROJECT.md` (lines 72–95)**:
   - Documents the interface contract for `PortfolioHomeProps` served to `resources/js/pages/welcome.tsx`:
     ```ts
     export interface PortfolioHomeProps {
         profile: Profile;
         skills: Skill[];
         experiences: Experience[];
         educations: Education[];
         certifications: Certification[];
         featuredProjects: Project[];
         featuredArticles: Article[];
     }
     ```
   - Specifies exact query shapes in `HomeController@index`:
     - `profile`: `Profile::first()`
     - `skills`: `Skill::orderBy('category')->get()`
     - `experiences`: `Experience::orderByDesc('start_date')->get()`
     - `educations`: `Education::orderByDesc('start_year')->get()`
     - `certifications`: `Certification::orderByDesc('issued_at')->get()`
     - `featuredProjects`: `Project::where('is_featured', true)->with('categories')->take(3)->get()`
     - `featuredArticles`: `Article::where('status', ArticleStatus::Published)->where('is_featured', true)->with(['categories', 'tags'])->take(3)->get()`

3. **`docs/DATABASE.md` (lines 77–88, 367–414)**:
   - `categories.slug` has a `UNIQUE` constraint across the entire table. Therefore, article and project categories must have globally unique slugs.
   - Enums:
     - `App\Enums\CategoryType: string` with cases `Article = 'article'`, `Project = 'project'`.
     - `App\Enums\ArticleStatus: string` with cases `Draft = 'draft'`, `Published = 'published'`.
   - Cast definitions:
     - `Profile`: `'sosmed' => 'array'`
     - `Project`: `'tech_stack' => 'array'`, `'is_featured' => 'boolean'`
     - `Article`: `'status' => ArticleStatus::class`, `'is_featured' => 'boolean'`, `'published_at' => 'datetime'`
     - `Category`: `'type' => CategoryType::class`
     - `Skill`: `'is_featured' => 'boolean'`
     - `Education`: `'start_year' => 'integer'`, `'end_year' => 'integer'`
     - `Experience`: `'start_date' => 'date'`, `'end_date' => 'date'`
     - `Certification`: `'issued_at' => 'date'`

4. **`database/seeders/DatabaseSeeder.php` (lines 1–26)**:
   - Currently contains default Laravel boilerplate:
     ```php
     User::factory()->create([
         'name' => 'Test User',
         'email' => 'test@example.com',
     ]);
     ```
   - Needs to be replaced with a clean delegation call:
     ```php
     $this->call([
         PortfolioDatabaseSeeder::class,
     ]);
     ```

5. **`docs/features/` Specifications**:
   - `01-beranda-perkenalan.md`: Profile requires name, headline, about, photo, official contact email, social links JSON. Fallback placeholder must be supported if photo is not yet uploaded.
   - `02-daftar-proyek.md`: Needs at least 3 featured projects for the landing showcase (`take(3)`), plus additional projects to populate the full `/projects` archive. Requires `tech_stack` as JSON list.
   - `03-skill-keahlian.md`: Skills grouped into 3 distinct categories (`Backend`, `Frontend`, `Tools`), with proficiency levels, Lucide icon references, and `is_featured` flags.
   - `04-artikel-blog.md`: TipTap WYSIWYG rich HTML content with headings, code blocks, lists, and quotes. Requires 3 featured published articles for landing page showcase, plus draft articles that must remain hidden from public views.
   - `05-riwayat-sertifikat.md`: Education timeline with start/end years; work experiences with start/end dates (active role has `end_date = null`); certifications with issuer and online verification URLs.
   - `08-kategori-tag.md`: Categories partitioned strictly by `type` (`article` vs `project`). Tags attached exclusively to articles.

---

## 2. Logic Chain

1. **Seeder Architecture & Idempotency:**
   - When developers or workers run `php artisan migrate:fresh --seed`, the database tables are recreated from scratch. However, if a developer runs `php artisan db:seed` on an existing database, raw `create()` calls on unique columns (`users.email`, `categories.slug`, `tags.slug`, `articles.slug`, `projects.slug`) would throw SQL integrity constraint violation exceptions.
   - By employing `updateOrCreate` and Eloquent relationship `sync()` calls, `PortfolioDatabaseSeeder` becomes completely idempotent and robust against re-runs.

2. **Category Slug Disambiguation:**
   - Because `categories.slug` is globally unique across the `categories` table (Observation 3), we cannot create an article category named "Web Development" (slug: `web-development`) and a project category named "Web Development" (slug: `web-development`).
   - We systematically partition them into:
     - Project Categories: `full-stack-web` ("Full-Stack Web"), `backend-api` ("Backend API"), `cloud-devops` ("Cloud & DevOps"), `open-source-tool` ("Open Source Tool").
     - Article Categories: `web-engineering` ("Web Engineering"), `software-architecture` ("Software Architecture"), `tutorial-tips` ("Tutorial & Tips"), `devops-cloud` ("DevOps & Cloud").

3. **TipTap WYSIWYG Rich HTML Emulation:**
   - The CMS article editor uses TipTap WYSIWYG which outputs semantic HTML (`<h2>`, `<p>`, `<code>`, `<pre>`, `<ul>`, `<li>`, `<blockquote>`).
   - In Milestone 2 and Milestone 4, the public reader at `/articles/{slug}` renders this HTML using Neobrutalism typography styling.
   - Therefore, article seed data must contain authentic, well-structured HTML markup rather than plain text strings or lorem ipsum, providing immediate visual verification.

4. **Testing & Public Contract Alignment:**
   - `HomeController@index` queries `featuredProjects` with `.take(3)` and `featuredArticles` with `.take(3)` where `status = ArticleStatus::Published`.
   - Seeding exactly 3 featured projects and 3 featured published articles (plus 2 archive-only projects and 1 draft article) perfectly satisfies:
     - The landing page limit of 3 featured items.
     - The archive page requirements for filtering and pagination.
     - The negative test assertion that `draft` articles are never exposed on public endpoints.

5. **Shared Hosting & Media Independence:**
   - The seeder should not require physical file assets on disk to run without errors. By leaving file paths as `null` or valid default relative asset paths, the seeder executes instantly in local development, CI/CD in-memory SQLite, and production deployment environments.

---

## 3. Caveats

1. **Password Hashing:**
   - If the `User` model defines `'password' => 'hashed'` in its `casts()` method, `Hash::make('password')` in the seeder will still evaluate properly because Laravel's `HashedCast` inspects `Hash::needsRehash($value)` before applying a double hash. However, passing `Hash::make('password')` explicitly is required by the original project prompt and ensures compatibility regardless of whether the cast is loaded.
2. **Carbon Date Representation:**
   - In `AppServiceProvider.php`, the application registers `Date::use(CarbonImmutable::class);`. Date strings seeded via Eloquent attributes will be returned as `CarbonImmutable` instances on retrieval. The seeder can safely pass standard ISO date strings (`YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`) which Eloquent parses automatically.
3. **No Code Modification Undertaken:**
   - Consistent with the Explorer role boundary, no files in `database/seeders/` or application source code have been modified. This report delivers the exact blueprints for the Worker agent.

---

## 4. Conclusion & Complete Implementation Plan

### 4.1. Implementation of `database/seeders/DatabaseSeeder.php`

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PortfolioDatabaseSeeder::class,
        ]);
    }
}
```

---

### 4.2. Implementation of `database/seeders/PortfolioDatabaseSeeder.php`

The complete, production-ready implementation with realistic dataset for **M FAUZAN HANIF**:

```php
<?php

namespace Database\Seeders;

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
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PortfolioDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // =========================================================================
        // 1. Admin User Authentication
        // =========================================================================
        $admin = User::updateOrCreate(
            ['email' => 'fauzanhanif2112@gmail.com'],
            [
                'name' => 'M FAUZAN HANIF',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // =========================================================================
        // 2. Personal Profile & Contact Information
        // =========================================================================
        Profile::updateOrCreate(
            ['email' => 'fauzanhanif2112@gmail.com'],
            [
                'name' => 'M FAUZAN HANIF',
                'headline' => 'Full-Stack Software Engineer | Laravel, React & Cloud Enthusiast',
                'about' => 'Passionate software engineer specializing in building high-performance web applications and maintainable systems. Dedicated to clean code, domain-driven design, and performant backends with Laravel, paired with responsive, accessible user interfaces built on React, Inertia.js, and Tailwind CSS. Enthusiastic about continuous learning, open source contribution, and solving complex architectural challenges.',
                'photo' => null,
                'email' => 'fauzanhanif2112@gmail.com',
                'sosmed' => [
                    'github' => 'https://github.com/fauzanhanif',
                    'linkedin' => 'https://linkedin.com/in/fauzanhanif',
                    'instagram' => 'https://instagram.com/fauzanhanif',
                    'x' => 'https://x.com/fauzanhanif',
                    'email' => 'mailto:fauzanhanif2112@gmail.com',
                ],
            ]
        );

        // =========================================================================
        // 3. Categories (Project & Article Partitioned)
        // =========================================================================
        $categoryDefinitions = [
            // Project Categories (type = CategoryType::Project)
            [
                'name' => 'Full-Stack Web',
                'slug' => 'full-stack-web',
                'type' => CategoryType::Project,
            ],
            [
                'name' => 'Backend API',
                'slug' => 'backend-api',
                'type' => CategoryType::Project,
            ],
            [
                'name' => 'Cloud & DevOps',
                'slug' => 'cloud-devops',
                'type' => CategoryType::Project,
            ],
            [
                'name' => 'Open Source Tool',
                'slug' => 'open-source-tool',
                'type' => CategoryType::Project,
            ],
            // Article Categories (type = CategoryType::Article)
            [
                'name' => 'Web Engineering',
                'slug' => 'web-engineering',
                'type' => CategoryType::Article,
            ],
            [
                'name' => 'Software Architecture',
                'slug' => 'software-architecture',
                'type' => CategoryType::Article,
            ],
            [
                'name' => 'Tutorial & Tips',
                'slug' => 'tutorial-tips',
                'type' => CategoryType::Article,
            ],
            [
                'name' => 'DevOps & Cloud',
                'slug' => 'devops-cloud',
                'type' => CategoryType::Article,
            ],
        ];

        $categoryMap = [];
        foreach ($categoryDefinitions as $catData) {
            $categoryMap[$catData['slug']] = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );
        }

        // =========================================================================
        // 4. Tags (Keywords for Articles)
        // =========================================================================
        $tagDefinitions = [
            ['name' => 'Laravel', 'slug' => 'laravel'],
            ['name' => 'React', 'slug' => 'react'],
            ['name' => 'Inertia.js', 'slug' => 'inertia-js'],
            ['name' => 'Tailwind CSS', 'slug' => 'tailwind-css'],
            ['name' => 'TypeScript', 'slug' => 'typescript'],
            ['name' => 'Clean Code', 'slug' => 'clean-code'],
            ['name' => 'MySQL', 'slug' => 'mysql'],
            ['name' => 'cPanel', 'slug' => 'cpanel'],
            ['name' => 'RESTful API', 'slug' => 'restful-api'],
            ['name' => 'Performance', 'slug' => 'performance'],
        ];

        $tagMap = [];
        foreach ($tagDefinitions as $tagData) {
            $tagMap[$tagData['slug']] = Tag::updateOrCreate(
                ['slug' => $tagData['slug']],
                $tagData
            );
        }

        // =========================================================================
        // 5. Skills (Grouped across Backend, Frontend, and Tools)
        // =========================================================================
        $skills = [
            // Backend Skills
            [
                'name' => 'PHP',
                'category' => 'Backend',
                'level' => 'Advanced',
                'icon' => 'code',
                'is_featured' => true,
            ],
            [
                'name' => 'Laravel',
                'category' => 'Backend',
                'level' => 'Advanced',
                'icon' => 'layers',
                'is_featured' => true,
            ],
            [
                'name' => 'MySQL / MariaDB',
                'category' => 'Backend',
                'level' => 'Advanced',
                'icon' => 'database',
                'is_featured' => true,
            ],
            [
                'name' => 'RESTful API & GraphQL',
                'category' => 'Backend',
                'level' => 'Advanced',
                'icon' => 'server',
                'is_featured' => false,
            ],
            [
                'name' => 'Node.js',
                'category' => 'Backend',
                'level' => 'Intermediate',
                'icon' => 'cpu',
                'is_featured' => false,
            ],
            [
                'name' => 'Redis',
                'category' => 'Backend',
                'level' => 'Intermediate',
                'icon' => 'zap',
                'is_featured' => false,
            ],

            // Frontend Skills
            [
                'name' => 'React.js',
                'category' => 'Frontend',
                'level' => 'Advanced',
                'icon' => 'component',
                'is_featured' => true,
            ],
            [
                'name' => 'TypeScript',
                'category' => 'Frontend',
                'level' => 'Intermediate',
                'icon' => 'file-code',
                'is_featured' => true,
            ],
            [
                'name' => 'Tailwind CSS',
                'category' => 'Frontend',
                'level' => 'Advanced',
                'icon' => 'palette',
                'is_featured' => true,
            ],
            [
                'name' => 'Inertia.js',
                'category' => 'Frontend',
                'level' => 'Advanced',
                'icon' => 'network',
                'is_featured' => false,
            ],
            [
                'name' => 'HTML5 & Modern CSS',
                'category' => 'Frontend',
                'level' => 'Expert',
                'icon' => 'layout',
                'is_featured' => false,
            ],

            // Tools & DevOps Skills
            [
                'name' => 'Git & GitHub',
                'category' => 'Tools',
                'level' => 'Advanced',
                'icon' => 'git-branch',
                'is_featured' => true,
            ],
            [
                'name' => 'Docker',
                'category' => 'Tools',
                'level' => 'Intermediate',
                'icon' => 'container',
                'is_featured' => false,
            ],
            [
                'name' => 'Postman',
                'category' => 'Tools',
                'level' => 'Advanced',
                'icon' => 'send',
                'is_featured' => false,
            ],
            [
                'name' => 'cPanel & Shared Hosting',
                'category' => 'Tools',
                'level' => 'Advanced',
                'icon' => 'globe',
                'is_featured' => false,
            ],
            [
                'name' => 'Vite',
                'category' => 'Tools',
                'level' => 'Advanced',
                'icon' => 'zap',
                'is_featured' => false,
            ],
        ];

        foreach ($skills as $skillData) {
            Skill::updateOrCreate(
                ['name' => $skillData['name']],
                $skillData
            );
        }

        // =========================================================================
        // 6. Projects (Featured & Archive Showcase with Categories)
        // =========================================================================
        $projects = [
            [
                'title' => 'Personal Portfolio & Independent CMS',
                'slug' => 'personal-portfolio-cms',
                'description' => 'A production-grade personal portfolio and self-hosted content management system built with Laravel 13, React 19, Inertia.js v3, and Tailwind CSS v4. Features a bold Neobrutalism design system, custom WYSIWYG TipTap editor, Fortify authentication, and shared-hosting-ready direct disk file management.',
                'tech_stack' => ['Laravel 13', 'React 19', 'Inertia.js v3', 'Tailwind CSS v4', 'TypeScript', 'MySQL'],
                'image' => null,
                'project_url' => 'https://github.com/fauzanhanif/portfolio',
                'is_featured' => true,
                'categories' => ['full-stack-web', 'open-source-tool'],
            ],
            [
                'title' => 'Enterprise Resource Planning (ERP) Multi-Branch Platform',
                'slug' => 'enterprise-resource-planning-platform',
                'description' => 'Integrated multi-tenant ERP suite for medium enterprises covering real-time warehouse inventory synchronization, automated purchase order procurement, point-of-sale invoicing, and comprehensive double-entry accounting ledgers.',
                'tech_stack' => ['Laravel', 'MySQL', 'Livewire', 'Alpine.js', 'Tailwind CSS', 'Redis'],
                'image' => null,
                'project_url' => 'https://github.com/fauzanhanif/enterprise-erp',
                'is_featured' => true,
                'categories' => ['full-stack-web'],
            ],
            [
                'title' => 'Multi-Vendor E-Commerce & Marketplace Ecosystem',
                'slug' => 'multivendor-ecommerce-marketplace',
                'description' => 'Scalable marketplace platform supporting vendor sub-stores, real-time inventory reservation, automated commission settlement, Midtrans/Stripe payment gateway webhooks, and comprehensive order tracking.',
                'tech_stack' => ['Laravel', 'React', 'TypeScript', 'Inertia.js', 'PostgreSQL', 'Stripe'],
                'image' => null,
                'project_url' => 'https://github.com/fauzanhanif/ecommerce-marketplace',
                'is_featured' => true,
                'categories' => ['full-stack-web'],
            ],
            [
                'title' => 'Healthcare Outpatient Queue & Electronic Medical Records (EMR)',
                'slug' => 'healthcare-emr-queue-system',
                'description' => 'Digital medical record administration and kiosk-based patient queue dispatching system designed for clinical healthcare networks. Fully compliant with ICD-10 diagnostic nomenclature and doctor prescription auditing.',
                'tech_stack' => ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'Chart.js'],
                'image' => null,
                'project_url' => null,
                'is_featured' => false,
                'categories' => ['backend-api'],
            ],
            [
                'title' => 'High-Performance RESTful Microservices API Gateway',
                'slug' => 'high-performance-api-gateway',
                'description' => 'Lightweight reverse proxy and API routing gateway providing centralized JWT authentication, rate limiting token bucket algorithms, distributed request telemetry, and upstream circuit breaking.',
                'tech_stack' => ['Node.js', 'Express', 'Docker', 'Redis', 'JWT'],
                'image' => null,
                'project_url' => 'https://github.com/fauzanhanif/microservices-gateway',
                'is_featured' => false,
                'categories' => ['cloud-devops', 'open-source-tool'],
            ],
        ];

        foreach ($projects as $projData) {
            $catSlugs = $projData['categories'];
            unset($projData['categories']);

            $project = Project::updateOrCreate(
                ['slug' => $projData['slug']],
                $projData
            );

            $catIds = collect($catSlugs)
                ->map(fn ($slug) => $categoryMap[$slug]->id ?? null)
                ->filter()
                ->all();

            $project->categories()->sync($catIds);
        }

        // =========================================================================
        // 7. Articles (Technical Posts with TipTap HTML, Categories & Tags)
        // =========================================================================
        $articles = [
            [
                'title' => 'Membangun Web Modern dengan Laravel 13, React 19, dan Inertia.js v3',
                'slug' => 'membangun-web-modern-laravel-13-react-19-inertia-3',
                'excerpt' => 'Panduan arsitektur modern membangun aplikasi monolitik yang gesit menggunakan perpaduan Laravel 13, React 19, dan Inertia.js v3 tanpa kompleksitas API terpisah.',
                'content' => '<h2>Menghilangkan Kesenjangan Antara Backend dan Frontend</h2><p>Dalam beberapa tahun terakhir, ekosistem pengembangan web kerap terpecah menjadi dua kubu: SPA terpisah dengan REST/GraphQL API, atau aplikasi server-rendered konvensional. <strong>Inertia.js v3</strong> hadir sebagai jembatan yang menyatukan kedua keunggulan ini tanpa friksi.</p><h2>Keunggulan Utama Stack Monolitik Modern</h2><p>Dengan menggabungkan <strong>Laravel 13</strong> sebagai backend yang kokoh dan <strong>React 19</strong> di sisi frontend, kita memperoleh sejumlah manfaat nyata:</p><ul><li><strong>Single Round-Trip Navigation:</strong> Navigasi antar halaman terasa instan layaknya SPA murni tanpa memicu page reload penuh.</li><li><strong>Type Safety yang Andal:</strong> Integrasi Wayfinder memungkinkan pemanggilan rute backend langsung dengan typed functions di frontend.</li><li><strong>Zero API Boilerplate:</strong> Tidak perlu membuat route API terpisah, serialization manual, atau manajemen token JWT yang rumit.</li></ul><h2>Contoh Integrasi Inertia v3</h2><p>Berikut adalah contoh bagaimana controller Laravel mengirimkan data ke komponen React secara langsung:</p><pre><code class="language-php">public function index(): Response
{
    return Inertia::render(\'welcome\', [
        \'profile\' =&gt; Profile::first(),
        \'featuredProjects\' =&gt; Project::where(\'is_featured\', true)-&gt;take(3)-&gt;get(),
    ]);
}</code></pre><blockquote>Arsitektur monolitik modern tidak lagi identik dengan teknologi usang. Perpaduan Laravel dan Inertia membuktikan bahwa kecepatan pengembangan dan pengalaman pengguna kelas atas dapat diraih secara harmonis.</blockquote>',
                'cover_image' => null,
                'status' => ArticleStatus::Published,
                'is_featured' => true,
                'published_at' => CarbonImmutable::parse('2026-09-15 10:00:00'),
                'categories' => ['web-engineering', 'software-architecture'],
                'tags' => ['laravel', 'react', 'inertia-js', 'clean-code'],
            ],
            [
                'title' => 'Panduan Deploy Laravel ke Shared Hosting cPanel Tanpa Symlink',
                'slug' => 'panduan-deploy-laravel-cpanel-tanpa-symlink',
                'excerpt' => 'Langkah-langkah praktis dan konfigurasi filesystems untuk meluncurkan aplikasi Laravel di cPanel secara mulus tanpa akses SSH dan tanpa storage:link.',
                'content' => '<h2>Tantangan Shared Hosting cPanel</h2><p>Shared hosting berbasis cPanel masih menjadi pilihan utama bagi banyak pemilik portofolio dan bisnis skala menengah di Indonesia karena efisiensi biaya. Namun, salah satu tantangan terbesar bagi developer Laravel adalah batasan akses terminal SSH untuk menjalankan perintah <code>php artisan storage:link</code>.</p><h2>Solusi Arsitektur: Direct Public Disk</h2><p>Untuk mengatasi kendala ini tanpa mengorbankan keamanan, kita dapat mengonfigurasi disk media Spatie agar menulis berkas unggahan langsung ke dalam direktori <code>public/uploads</code>:</p><pre><code class="language-php">\'disks\' =&gt; [
    \'public\' =&gt; [
        \'driver\' =&gt; \'local\',
        \'root\' =&gt; public_path(\'uploads\'),
        \'url\' =&gt; rtrim(env(\'APP_URL\'), \'/\') . \'/uploads\',
        \'visibility\' =&gt; \'public\',
    ],
],</code></pre><h2>Keuntungan Pendekatan Ini</h2><ul><li><strong>Kompatibilitas Maksimal:</strong> Apache dan LiteSpeed di cPanel dapat langsung melayani aset statis tanpa memerlukan flag <code>FollowSymLinks</code>.</li><li><strong>Zero SSH Dependency:</strong> Tidak memerlukan terminal atau Cron Job tambahan untuk membuat symlink.</li><li><strong>Kemudahan Migrasi:</strong> Berkas database yang diekspor via <code>portfolio_dump.sql</code> dapat langsung diimpor melalui antarmuka phpMyAdmin.</li></ul><blockquote>Dengan konfigurasi direct disk yang tepat, aplikasi Laravel modern dapat berjalan dengan stabilitas 100% pada lingkungan shared hosting murah sekalipun.</blockquote>',
                'cover_image' => null,
                'status' => ArticleStatus::Published,
                'is_featured' => true,
                'published_at' => CarbonImmutable::parse('2026-09-28 14:30:00'),
                'categories' => ['devops-cloud', 'tutorial-tips'],
                'tags' => ['laravel', 'cpanel', 'mysql'],
            ],
            [
                'title' => 'Eksplorasi Desain Neobrutalism pada UI/UX Aplikasi Web Kontemporer',
                'slug' => 'eksplorasi-desain-neobrutalism-ui-ux',
                'excerpt' => 'Mengenal tren estetika Neobrutalism: kontras tinggi, border tegas, bayangan solid, dan tipografi Space Grotesk yang membuat portofolio berkarakter.',
                'content' => '<h2>Karakteristik Visual Neobrutalism</h2><p>Di tengah maraknya desain web minimalis yang seragam dengan sudut membulat halus dan gradien lembut, <strong>Neobrutalism</strong> muncul sebagai antitesis yang menyegarkan. Gaya ini memadukan ketegasan desain brutalist era 1950-an dengan palet warna ceria dan interaktivitas modern.</p><h2>Pilar Desain dalam Tailwind CSS v4</h2><p>Dalam implementasi portofolio ini, sistem desain Neobrutalism ditegakkan melalui sejumlah aturan baku:</p><ul><li><strong>Solid Hard Borders:</strong> Setiap kartu dan tombol menggunakan <code>border-2 border-border</code> dengan garis hitam pekat yang tegas.</li><li><strong>Hard 2px Drop Shadows:</strong> Menghindari bayangan blur, Neobrutalism mengandalkan bayangan padat <code>shadow-shadow</code> dengan offset nyata.</li><li><strong>Sudut Terukur (Rounded-Base):</strong> Sudut kartu distandarisasi pada 10px untuk menjaga keseimbangan antara ketegasan dan ergonomi visual.</li><li><strong>Tipografi Space Grotesk:</strong> Memberikan nuansa industrial modern yang mudah dibaca pada berbagai ukuran layar.</li></ul><h2>Interaktivitas &amp; Tactile Feedback</h2><p>Neobrutalism tidak hanya tentang estetika statis, tetapi juga responsivitas fisik. Saat pengguna menekan tombol, tombol tersebut berpindah secara tactile ke arah bayangannya (<code>translate-x-0.5 translate-y-0.5</code>) memberikan umpan balik mekanis yang memuaskan.</p>',
                'cover_image' => null,
                'status' => ArticleStatus::Published,
                'is_featured' => true,
                'published_at' => CarbonImmutable::parse('2026-10-05 09:15:00'),
                'categories' => ['web-engineering'],
                'tags' => ['tailwind-css', 'react'],
            ],
            [
                'title' => 'Optimalisasi Query Eloquent dan Eager Loading untuk Performa Skala Besar',
                'slug' => 'optimalisasi-query-eloquent-eager-loading',
                'excerpt' => 'Menghindari jebakan N+1 problem dan memangkas waktu respons basis data menggunakan eager loading with(), chunking, dan select scoping.',
                'content' => '<h2>Memahami Masalah N+1</h2><p>Salah satu kesalahan paling lazim dalam penggunaan ORM seperti Eloquent adalah pemanggilan query relasi di dalam perulangan loop. Hal ini menyebabkan jumlah kueri basis data membengkak seiring bertambahnya jumlah data record.</p><h2>Menggunakan Eager Loading with()</h2><p>Dengan menerapkan eager loading sejak awal query dijalankan di controller, kita mereduksi puluhan query menjadi hanya 2 kueri SQL yang efisien:</p><pre><code class="language-php">$articles = Article::with([\'categories\', \'tags\'])-&gt;get();</code></pre><p>Draf tulisan ini akan terus diperbarui dengan studi kasus mendalam mengenai index optimization dan composite foreign keys.</p>',
                'cover_image' => null,
                'status' => ArticleStatus::Draft,
                'is_featured' => false,
                'published_at' => null,
                'categories' => ['software-architecture'],
                'tags' => ['laravel', 'mysql', 'clean-code', 'performance'],
            ],
        ];

        foreach ($articles as $artData) {
            $catSlugs = $artData['categories'];
            $tagSlugs = $artData['tags'];
            unset($artData['categories'], $artData['tags']);

            $article = Article::updateOrCreate(
                ['slug' => $artData['slug']],
                $artData
            );

            $catIds = collect($catSlugs)
                ->map(fn ($slug) => $categoryMap[$slug]->id ?? null)
                ->filter()
                ->all();

            $tagIds = collect($tagSlugs)
                ->map(fn ($slug) => $tagMap[$slug]->id ?? null)
                ->filter()
                ->all();

            $article->categories()->sync($catIds);
            $article->tags()->sync($tagIds);
        }

        // =========================================================================
        // 8. Education History
        // =========================================================================
        Education::updateOrCreate(
            [
                'institution' => 'Universitas Brawijaya',
                'degree' => 'Sarjana Komputer (S.Kom) - Teknik Informatika',
            ],
            [
                'start_year' => 2019,
                'end_year' => 2023,
                'description' => 'Fokus pada Rekayasa Perangkat Lunak, Arsitektur Sistem Terdistribusi, dan Manajemen Basis Data. Menyelesaikan skripsi dengan predikat Sangat Memuaskan (IPK 3.82 / 4.00).',
            ]
        );

        // =========================================================================
        // 9. Professional Work Experiences
        // =========================================================================
        $experiences = [
            [
                'company' => 'PT Inovasi Teknologi Digital',
                'role' => 'Lead Full-Stack Software Engineer',
                'start_date' => '2023-08-01',
                'end_date' => null, // null represents active / ongoing role ("Sekarang")
                'description' => 'Memimpin perancangan arsitektur backend berbasis Laravel 11/13 dan antarmuka SPA menggunakan React dan Inertia. Mengoptimalkan query basis data dan indexing MySQL sehingga meningkatkan responsivitas API hingga 40%. Mengorkestrasi pipeline deployment berkelanjutan dan mentoring tim engineer junior.',
            ],
            [
                'company' => 'Nusantara Software Studio',
                'role' => 'Backend Developer',
                'start_date' => '2022-06-01',
                'end_date' => '2023-07-31',
                'description' => 'Mengembangkan RESTful microservices untuk sistem pergudangan enterprise, mengintegrasikan payment gateway pihak ketiga, serta merancang skema relasional teroptimasi untuk transaksi bervolume tinggi.',
            ],
        ];

        foreach ($experiences as $expData) {
            Experience::updateOrCreate(
                [
                    'company' => $expData['company'],
                    'role' => $expData['role'],
                ],
                $expData
            );
        }

        // =========================================================================
        // 10. Certifications & Credentials
        // =========================================================================
        $certifications = [
            [
                'name' => 'AWS Certified Solutions Architect – Associate',
                'issuer' => 'Amazon Web Services (AWS)',
                'issued_at' => '2024-03-10',
                'image' => null,
                'credential_url' => 'https://aws.amazon.com/verification',
            ],
            [
                'name' => 'Belajar Fundamental Aplikasi Web dengan React',
                'issuer' => 'Dicoding Academy',
                'issued_at' => '2023-11-20',
                'image' => null,
                'credential_url' => 'https://www.dicoding.com/certificates/REACT-12345',
            ],
            [
                'name' => 'Laravel Certified Developer',
                'issuer' => 'Laravel Certification',
                'issued_at' => '2023-05-15',
                'image' => null,
                'credential_url' => 'https://laravelcertificate.com/fauzan-hanif',
            ],
        ];

        foreach ($certifications as $certData) {
            Certification::updateOrCreate(
                [
                    'name' => $certData['name'],
                    'issuer' => $certData['issuer'],
                ],
                $certData
            );
        }
    }
}
```

---

### 4.3. Detailed Dataset Summary Table

| Entity | Primary Key / Identifier | Total Records | Key Attributes / Flags |
|---|---|---|---|
| **Users** | `email: fauzanhanif2112@gmail.com` | 1 | `name`: "M FAUZAN HANIF", `password`: Hash of "password" |
| **Profiles** | `email: fauzanhanif2112@gmail.com` | 1 | `sosmed`: JSON with GitHub, LinkedIn, Instagram, X, email |
| **Categories** | `type: project` | 4 | Slugs: `full-stack-web`, `backend-api`, `cloud-devops`, `open-source-tool` |
| **Categories** | `type: article` | 4 | Slugs: `web-engineering`, `software-architecture`, `tutorial-tips`, `devops-cloud` |
| **Tags** | `slug` (unique) | 10 | Laravel, React, Inertia.js, Tailwind CSS, TypeScript, Clean Code, MySQL, cPanel, RESTful API, Performance |
| **Skills** | Grouped by `category` | 16 | Backend (6, 3 featured), Frontend (5, 3 featured), Tools (5, 1 featured) |
| **Projects** | `slug` (unique) | 5 | 3 Featured (for landing page), 2 Non-featured (archive catalog); JSON `tech_stack` |
| **Articles** | `slug` (unique) | 4 | 3 Published & Featured (TipTap rich HTML); 1 Draft (unfeatured, unpublished) |
| **Educations** | `institution` + `degree` | 1 | Universitas Brawijaya (2019 – 2023) |
| **Experiences** | `company` + `role` | 2 | 1 Active (`end_date = null`), 1 Historical (2022 – 2023) |
| **Certifications** | `name` + `issuer` | 3 | AWS, Dicoding React, Laravel Certification with credential URLs |

---

## 5. Verification Method

To independently verify the seeding architecture and database integrity:

### Step 1: Execute Fresh Migrations and Seeding
```bash
php artisan migrate:fresh --seed
```
**Assertion criteria**:
- Output displays `Database seeding completed successfully.`
- Exit code is 0 with zero foreign key constraint violations or duplicate key exceptions.

### Step 2: Automated Schema & Entity Integrity Check via Tinker
Execute the following verification script in PowerShell:
```bash
php artisan tinker --execute '
$failures = [];

// 1. Admin Auth
$admin = \App\Models\User::where("email", "fauzanhanif2112@gmail.com")->first();
if (!$admin || !\Illuminate\Support\Facades\Hash::check("password", $admin->password)) {
    $failures[] = "Admin user authentication check failed";
}

// 2. Profile
$profile = \App\Models\Profile::first();
if (!$profile || $profile->name !== "M FAUZAN HANIF" || !is_array($profile->sosmed) || !isset($profile->sosmed["github"])) {
    $failures[] = "Profile or sosmed JSON array check failed";
}

// 3. Categories & Tags
if (\App\Models\Category::where("type", \App\Enums\CategoryType::Project)->count() !== 4) {
    $failures[] = "Project categories count expected 4";
}
if (\App\Models\Category::where("type", \App\Enums\CategoryType::Article)->count() !== 4) {
    $failures[] = "Article categories count expected 4";
}
if (\App\Models\Tag::count() < 10) {
    $failures[] = "Tags count expected at least 10";
}

// 4. Skills
if (\App\Models\Skill::where("category", "Backend")->count() < 5 ||
    \App\Models\Skill::where("category", "Frontend")->count() < 5 ||
    \App\Models\Skill::where("category", "Tools")->count() < 5) {
    $failures[] = "Skills distribution across Backend, Frontend, and Tools failed";
}

// 5. Projects
$featuredProjects = \App\Models\Project::where("is_featured", true)->with("categories")->get();
if ($featuredProjects->count() !== 3) {
    $failures[] = "Featured projects count expected exactly 3, got " . $featuredProjects->count();
}
if (!is_array($featuredProjects->first()->tech_stack)) {
    $failures[] = "Project tech_stack casting check failed";
}

// 6. Articles & WYSIWYG
$featuredArticles = \App\Models\Article::where("status", \App\Enums\ArticleStatus::Published)
    ->where("is_featured", true)
    ->with(["categories", "tags"])
    ->get();
if ($featuredArticles->count() !== 3) {
    $failures[] = "Featured published articles count expected exactly 3, got " . $featuredArticles->count();
}
$draftArticle = \App\Models\Article::where("status", \App\Enums\ArticleStatus::Draft)->first();
if (!$draftArticle || $draftArticle->published_at !== null) {
    $failures[] = "Draft article status or published_at null check failed";
}
if (!str_contains($featuredArticles->first()->content, "<h2>") || !str_contains($featuredArticles->first()->content, "<pre>")) {
    $failures[] = "Article TipTap WYSIWYG HTML structure check failed";
}

// 7. Timeline & Certifications
$ongoingExp = \App\Models\Experience::whereNull("end_date")->first();
if (!$ongoingExp) {
    $failures[] = "Active employment record with null end_date missing";
}
if (\App\Models\Certification::count() < 3) {
    $failures[] = "Certifications count expected at least 3";
}

if (empty($failures)) {
    echo "=== SEEDING VERIFICATION PASSED: ALL 7 AUDITS SUCCEEDED ===" . PHP_EOL;
} else {
    echo "=== SEEDING VERIFICATION FAILED ===" . PHP_EOL;
    foreach ($failures as $f) {
        echo " - " . $f . PHP_EOL;
    }
}
'
```

### Step 3: Verify Code Style & Quality
```bash
vendor/bin/pint --format agent
```
Ensure all created PHP seeders comply 100% with Laravel Pint rules.

### Step 4: Verify Test Runner Compatibility
```bash
php artisan test --compact
```
Confirm in-memory SQLite executes fresh schema migrations and database configurations cleanly without throwing syntax or compatibility errors.
