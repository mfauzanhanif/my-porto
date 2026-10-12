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
        User::updateOrCreate(
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
