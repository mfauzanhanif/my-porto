# Data Layer Specification Mining Report

## 1. Observation

Direct observations from codebase inspection and authoritative documentation:

1. **`docs/DATABASE.md` (lines 43–225)** specifies 10 core entity and pivot tables:
   - `users`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `email` (VARCHAR 255 UNIQUE), `password` (VARCHAR 255), `remember_token` (VARCHAR 100 NULLABLE), timestamps.
   - `profiles`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `headline` (VARCHAR 255 NULLABLE), `about` (TEXT NULLABLE), `photo` (VARCHAR 255 NULLABLE), `email` (VARCHAR 255), `sosmed` (JSON NULLABLE), timestamps.
   - `categories`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `slug` (VARCHAR 255 UNIQUE), `type` (ENUM('article', 'project') INDEX), timestamps.
   - `tags`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `slug` (VARCHAR 255 UNIQUE), timestamps.
   - `articles`: `id` (BIGINT UNSIGNED PK), `title` (VARCHAR 255), `slug` (VARCHAR 255 UNIQUE), `excerpt` (TEXT NULLABLE), `content` (LONGTEXT), `cover_image` (VARCHAR 255 NULLABLE), `status` (ENUM('draft', 'published') INDEX DEFAULT 'draft'), `is_featured` (BOOLEAN INDEX DEFAULT false), `published_at` (TIMESTAMP NULLABLE INDEX), timestamps.
   - `projects`: `id` (BIGINT UNSIGNED PK), `title` (VARCHAR 255), `slug` (VARCHAR 255 UNIQUE), `description` (TEXT), `tech_stack` (JSON NULLABLE), `image` (VARCHAR 255 NULLABLE), `project_url` (VARCHAR 255 NULLABLE), `is_featured` (BOOLEAN INDEX DEFAULT false), timestamps.
   - `skills`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `category` (VARCHAR 255 NULLABLE INDEX), `level` (VARCHAR 50 NULLABLE), `icon` (VARCHAR 255 NULLABLE), `is_featured` (BOOLEAN INDEX DEFAULT false), timestamps.
   - `educations`: `id` (BIGINT UNSIGNED PK), `institution` (VARCHAR 255), `degree` (VARCHAR 255), `start_year` (INT), `end_year` (INT NULLABLE INDEX), `description` (TEXT NULLABLE), timestamps.
   - `experiences`: `id` (BIGINT UNSIGNED PK), `company` (VARCHAR 255), `role` (VARCHAR 255), `start_date` (DATE INDEX), `end_date` (DATE NULLABLE), `description` (TEXT NULLABLE), timestamps.
   - `certifications`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `issuer` (VARCHAR 255), `issued_at` (DATE INDEX), `image` (VARCHAR 255 NULLABLE), `credential_url` (VARCHAR 255 NULLABLE), timestamps.
   - Pivots: `article_category` (composite PK `[article_id, category_id]`, FK CASCADE), `project_category` (composite PK `[project_id, category_id]`, FK CASCADE), `article_tag` (composite PK `[article_id, tag_id]`, FK CASCADE).

2. **`docs/DATABASE.md` (lines 19–39)** defines two PHP Enums:
   - `App\Enums\CategoryType: string` with cases `Article = 'article'` and `Project = 'project'`.
   - `App\Enums\ArticleStatus: string` with cases `Draft = 'draft'` and `Published = 'published'`.

3. **`database/migrations/`** currently contains:
   - `0001_01_01_000000_create_users_table.php` (creates `users`, `password_reset_tokens`, `sessions`)
   - `0001_01_01_000001_create_cache_table.php`
   - `0001_01_01_000002_create_jobs_table.php`
   - `2026_10_12_070640_create_media_table.php` (Spatie Media Library migration)

4. **`resources/js/types/portfolio.ts` (lines 1–116)** specifies client-side TypeScript interfaces:
   - `ArticleStatus = 'draft' | 'published'`
   - `CategoryType = 'article' | 'project'`
   - `Profile`, `Skill`, `Education`, `Experience`, `Certification`, `Category`, `Tag`, `Article`, `Project`, and `PortfolioHomeProps`.
   - `PortfolioHomeProps` expects:
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

5. **`config/media-library.php` (line 36)** and **`config/filesystems.php` (lines 42–48)**:
   - `media-library.php` uses `'disk_name' => env('MEDIA_DISK', 'public')`.
   - `filesystems.php` currently defines disk `public` with `'root' => storage_path('app/public')`, which relies on `storage:link`.
   - PRD section 2 (Batasan, line 39) & DATABASE.md line 14: "Gambar/media disimpan ke disk `public` langsung (misal: `public/uploads/...`) agar kompatibel dengan shared hosting cPanel tanpa memerlukan symlink (`storage:link`)."

6. **`app/Providers/AppServiceProvider.php` (line 34)**:
   - Configures `Date::use(CarbonImmutable::class);` globally.
   - All Eloquent datetime/date casts return `CarbonImmutable` instances.

7. **`ORIGINAL_REQUEST.md` (lines 21–32)**:
   - Requires `PortfolioDatabaseSeeder` with admin (`fauzanhanif2112@gmail.com` / `password`), profile data, categories, tags, skills (Backend/Frontend/Tools), projects, articles, educations, experiences, certifications.
   - Requires `database/portfolio_dump.sql` clean export for phpMyAdmin import.

---

## 2. Logic Chain

1. **Schema Independence & Migration Sequencing:**
   - Base tables (`users`, `categories`, `tags`, `skills`, `educations`, `experiences`, `certifications`, `profiles`) must be created first before dependent entities.
   - `projects` and `articles` depend on base tables.
   - Pivot tables (`project_category`, `article_category`, `article_tag`) have foreign key references to `articles`, `projects`, `categories`, and `tags` with `ON DELETE CASCADE`. Therefore, pivot migrations must run strictly after both parent tables are created.
   - The existing `0001_01_01_000000_create_users_table.php` and `2026_10_12_070640_create_media_table.php` are already in place.

2. **SQLite vs MySQL Compatibility:**
   - In unit/feature testing, `phpunit.xml` sets `DB_CONNECTION=sqlite` with `:memory:`.
   - In production and local development, MySQL 8.0+ is used.
   - Enum columns (`CategoryType`, `ArticleStatus`) and JSON columns (`tech_stack`, `sosmed`) must be defined using Laravel's standard Schema builder `$table->string('type')` or `$table->enum('type', ...)` and `$table->json('tech_stack')` which are natively supported across both MySQL and SQLite.
   - Composite primary keys on pivot tables `$table->primary(['article_id', 'category_id'])` are supported on both engines.

3. **Casting & Type Safety in Models:**
   - Following Laravel 11/13 best practices, model casting should prefer the `protected function casts(): array` method.
   - `Profile::$casts`: `'sosmed' => 'array'`
   - `Project::$casts`: `'tech_stack' => 'array'`, `'is_featured' => 'boolean'`
   - `Article::$casts`: `'status' => ArticleStatus::class`, `'is_featured' => 'boolean'`, `'published_at' => 'datetime'`
   - `Category::$casts`: `'type' => CategoryType::class`
   - `Skill::$casts`: `'is_featured' => 'boolean'`
   - `Education::$casts`: `'start_year' => 'integer'`, `'end_year' => 'integer'`
   - `Experience::$casts`: `'start_date' => 'date'`, `'end_date' => 'date'`
   - `Certification::$casts`: `'issued_at' => 'date'`

4. **Spatie Media Library cPanel Compatibility:**
   - On shared cPanel hosting without SSH access, executing `php artisan storage:link` is impossible or symlinks are blocked by Apache/cPanel security policies.
   - Pointing the `public` filesystem disk root to `public_path('uploads')` and URL to `rtrim(env('APP_URL'), '/') . '/uploads'` allows Spatie Media Library to write directly into `public/uploads/{media_id}/{file_name}`.
   - This makes uploaded media immediately accessible via web server static file routing without symlinks.

5. **phpMyAdmin Clean Dump Requirements:**
   - `database/portfolio_dump.sql` must contain `SET FOREIGN_KEY_CHECKS = 0;` and `SET FOREIGN_KEY_CHECKS = 1;` so table order in the dump does not trigger constraint errors.
   - It must NOT contain `CREATE DATABASE` or `USE ...;` statements because cPanel database names are assigned by cPanel users (e.g. `cpaneluser_db`).
   - It must include all table creation schemas, standard framework tables (`users`, `media`, `cache`, `sessions`, `jobs`, `migrations`), and all seeded data from `PortfolioDatabaseSeeder`.

---

## 3. Caveats

1. **Category Slug Global Uniqueness:**
   - In `docs/DATABASE.md`, `categories.slug` is defined as `UNIQUE`. This means an article category and a project category cannot share the exact same slug (e.g. both cannot be `web-development`). Category names/slugs must be distinct (e.g., `web-dev-articles` vs `web-dev-projects` or specific titles like `Full-Stack Web` vs `Web Development`).
2. **Nullable Relationships:**
   - Articles and projects are not forced to have categories; relationships are many-to-many through optional pivots.
   - Ongoing educations have `end_year = null`; active jobs have `end_date = null`. Frontend and seeders must account for `null` representing "Present / Sekarang".
3. **No Migration Edits Performed:**
   - Per spec miner role constraints, no source code or migration files have been created or altered during this probe.

---

## 4. Conclusion & Complete Data Layer Specifications

### 4.1. Exhaustive Database Schema Table Enumeration

#### 1. `users`
- **Purpose**: Admin account authentication via Fortify.
- **Migration**: `0001_01_01_000000_create_users_table.php` (already present).
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Unique user identifier |
  | `name` | VARCHAR(255) | NOT NULL | Admin full name |
  | `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email address |
  | `email_verified_at` | TIMESTAMP | NULLABLE | Email verification timestamp |
  | `password` | VARCHAR(255) | NOT NULL | Hashed password |
  | `remember_token` | VARCHAR(100) | NULLABLE | Session remember token |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 2. `profiles`
- **Purpose**: Personal branding and contact details for M FAUZAN HANIF.
- **Table Name**: `profiles`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Profile record identifier |
  | `name` | VARCHAR(255) | NOT NULL | Full name ("M FAUZAN HANIF") |
  | `headline` | VARCHAR(255) | NULLABLE | Professional headline / tagline |
  | `about` | TEXT | NULLABLE | Bio / About narrative |
  | `photo` | VARCHAR(255) | NULLABLE | Relative path / URL to profile image |
  | `email` | VARCHAR(255) | NOT NULL | Primary contact email |
  | `sosmed` | JSON | NULLABLE | Social links key-value map |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 3. `categories`
- **Purpose**: Polymorphic classification for projects and articles via `type`.
- **Table Name**: `categories`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Category record identifier |
  | `name` | VARCHAR(255) | NOT NULL | Display name |
  | `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-safe slug |
  | `type` | ENUM('article','project') | NOT NULL, INDEX | Classification discriminator |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 4. `tags`
- **Purpose**: Keyword tags specifically associated with articles.
- **Table Name**: `tags`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Tag record identifier |
  | `name` | VARCHAR(255) | NOT NULL | Tag display name |
  | `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-safe slug |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 5. `skills`
- **Purpose**: Technical skills categorized by domain.
- **Table Name**: `skills`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Skill identifier |
  | `name` | VARCHAR(255) | NOT NULL | Name of skill (e.g. PHP, React) |
  | `category` | VARCHAR(255) | NULLABLE, INDEX | Domain group (Backend, Frontend, Tools) |
  | `level` | VARCHAR(50) | NULLABLE | Proficiency (e.g. Advanced, 90%) |
  | `icon` | VARCHAR(255) | NULLABLE | Lucide icon name or SVG path |
  | `is_featured` | BOOLEAN | NOT NULL, DEFAULT false, INDEX | Landing page showcase flag |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 6. `projects`
- **Purpose**: Portfolio projects and case studies.
- **Table Name**: `projects`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Project identifier |
  | `title` | VARCHAR(255) | NOT NULL | Title of project |
  | `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-safe slug |
  | `description` | TEXT | NOT NULL | Project description / case study |
  | `tech_stack` | JSON | NULLABLE | Array of tech stack strings |
  | `image` | VARCHAR(255) | NULLABLE | Cover image path / URL |
  | `project_url` | VARCHAR(255) | NULLABLE | Demo URL or repo link |
  | `is_featured` | BOOLEAN | NOT NULL, DEFAULT false, INDEX | Landing page showcase flag |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 7. `project_category` (Pivot)
- **Purpose**: Many-to-Many pivot between projects and categories (`type='project'`).
- **Table Name**: `project_category`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `project_id` | BIGINT UNSIGNED | NOT NULL, FK → `projects.id` ON DELETE CASCADE | Target project |
  | `category_id` | BIGINT UNSIGNED | NOT NULL, FK → `categories.id` ON DELETE CASCADE | Target category |
- **Keys**: Composite Primary Key `(`project_id`, `category_id`)`. Index on `category_id`.

#### 8. `articles`
- **Purpose**: Technical articles and blog posts.
- **Table Name**: `articles`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Article identifier |
  | `title` | VARCHAR(255) | NOT NULL | Article title |
  | `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-safe slug |
  | `excerpt` | TEXT | NULLABLE | Short preview summary |
  | `content` | LONGTEXT | NOT NULL | TipTap WYSIWYG HTML content |
  | `cover_image` | VARCHAR(255) | NULLABLE | Header/cover image path |
  | `status` | ENUM('draft','published') | NOT NULL, DEFAULT 'draft', INDEX | Publication status |
  | `is_featured` | BOOLEAN | NOT NULL, DEFAULT false, INDEX | Landing page showcase flag |
  | `published_at` | TIMESTAMP | NULLABLE, INDEX | Publication datetime |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 9. `article_category` (Pivot)
- **Purpose**: Many-to-Many pivot between articles and categories (`type='article'`).
- **Table Name**: `article_category`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `article_id` | BIGINT UNSIGNED | NOT NULL, FK → `articles.id` ON DELETE CASCADE | Target article |
  | `category_id` | BIGINT UNSIGNED | NOT NULL, FK → `categories.id` ON DELETE CASCADE | Target category |
- **Keys**: Composite Primary Key `(`article_id`, `category_id`)`. Index on `category_id`.

#### 10. `article_tag` (Pivot)
- **Purpose**: Many-to-Many pivot between articles and tags.
- **Table Name**: `article_tag`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `article_id` | BIGINT UNSIGNED | NOT NULL, FK → `articles.id` ON DELETE CASCADE | Target article |
  | `tag_id` | BIGINT UNSIGNED | NOT NULL, FK → `tags.id` ON DELETE CASCADE | Target tag |
- **Keys**: Composite Primary Key `(`article_id`, `tag_id`)`. Index on `tag_id`.

#### 11. `educations`
- **Purpose**: Academic history and degrees.
- **Table Name**: `educations`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Education record identifier |
  | `institution` | VARCHAR(255) | NOT NULL | Name of university / institution |
  | `degree` | VARCHAR(255) | NOT NULL | Degree / Major |
  | `start_year` | INT | NOT NULL | Year started |
  | `end_year` | INT | NULLABLE, INDEX | Year graduated (NULL if ongoing) |
  | `description` | TEXT | NULLABLE | Achievements / honors / notes |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 12. `experiences`
- **Purpose**: Work history and professional employment.
- **Table Name**: `experiences`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Experience record identifier |
  | `company` | VARCHAR(255) | NOT NULL | Company / organization name |
  | `role` | VARCHAR(255) | NOT NULL | Job title / position |
  | `start_date` | DATE | NOT NULL, INDEX | Start date |
  | `end_date` | DATE | NULLABLE | End date (NULL if currently active) |
  | `description` | TEXT | NULLABLE | Responsibilities / achievements |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 13. `certifications`
- **Purpose**: Verified certifications and licenses.
- **Table Name**: `certifications`
- **Columns**:
  | Column | Type | Modifiers | Description |
  |---|---|---|---|
  | `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Certification record identifier |
  | `name` | VARCHAR(255) | NOT NULL | Certificate name |
  | `issuer` | VARCHAR(255) | NOT NULL | Issuing body / provider |
  | `issued_at` | DATE | NOT NULL, INDEX | Date of issue |
  | `image` | VARCHAR(255) | NULLABLE | Certificate image path |
  | `credential_url` | VARCHAR(255) | NULLABLE | Online verification URL |
  | `created_at` | TIMESTAMP | NULLABLE | Record creation time |
  | `updated_at` | TIMESTAMP | NULLABLE | Record update time |

#### 14. `media`
- **Purpose**: Polymorphic media attachment records (Spatie Media Library).
- **Migration**: `2026_10_12_070640_create_media_table.php` (already present).

---

### 4.2. Eloquent Models, Relationships, Scopes, and Casts

| Model | Table | Fillable Attributes | Casts | Relationships | Scopes / Helpers |
|---|---|---|---|---|---|
| `User` | `users` | `name`, `email`, `password` | `email_verified_at => 'datetime'`, `password => 'hashed'` | None | Fortify authenticatable |
| `Profile` | `profiles` | `name`, `headline`, `about`, `photo`, `email`, `sosmed` | `sosmed => 'array'` | Spatie Media (`photo`) | `getPhotoUrlAttribute()` |
| `Category` | `categories` | `name`, `slug`, `type` | `type => CategoryType::class` | `articles(): belongsToMany(Article::class, 'article_category')`, `projects(): belongsToMany(Project::class, 'project_category')` | `scopeArticle()`, `scopeProject()` |
| `Tag` | `tags` | `name`, `slug` | Standard timestamps | `articles(): belongsToMany(Article::class, 'article_tag')` | Standard |
| `Skill` | `skills` | `name`, `category`, `level`, `icon`, `is_featured` | `is_featured => 'boolean'` | None | `scopeFeatured()`, `scopeByCategory(string $cat)` |
| `Project` | `projects` | `title`, `slug`, `description`, `tech_stack`, `image`, `project_url`, `is_featured` | `tech_stack => 'array'`, `is_featured => 'boolean'` | `categories(): belongsToMany(Category::class, 'project_category')`, Spatie Media (`image`) | `scopeFeatured()`, `getImageUrlAttribute()` |
| `Article` | `articles` | `title`, `slug`, `excerpt`, `content`, `cover_image`, `status`, `is_featured`, `published_at` | `status => ArticleStatus::class`, `is_featured => 'boolean'`, `published_at => 'datetime'` | `categories(): belongsToMany(Category::class, 'article_category')`, `tags(): belongsToMany(Tag::class, 'article_tag')`, Spatie Media (`cover_image`, `content_images`) | `scopePublished()`, `scopeFeatured()`, `getCoverImageUrlAttribute()` |
| `Education` | `educations` | `institution`, `degree`, `start_year`, `end_year`, `description` | `start_year => 'integer'`, `end_year => 'integer'` | None | `scopeChronological()` (order by `start_year` desc) |
| `Experience` | `experiences` | `company`, `role`, `start_date`, `end_date`, `description` | `start_date => 'date'`, `end_date => 'date'` | None | `scopeChronological()` (order by `start_date` desc) |
| `Certification` | `certifications` | `name`, `issuer`, `issued_at`, `image`, `credential_url` | `issued_at => 'date'` | Spatie Media (`image`) | `scopeChronological()` (order by `issued_at` desc) |

---

### 4.3. PortfolioDatabaseSeeder Specification

The seeder initializes a complete, professional, realistic dataset for M FAUZAN HANIF:

1. **Admin User**:
   - `name`: "M Fauzan Hanif"
   - `email`: "fauzanhanif2112@gmail.com"
   - `password`: `Hash::make('password')`
   - `email_verified_at`: `now()`

2. **Profile**:
   - `name`: "M FAUZAN HANIF"
   - `headline`: "Full-Stack Software Engineer | Laravel, React & Cloud Enthusiast"
   - `about`: "Passionate software engineer specializing in modern web applications. Dedicated to writing clean, maintainable backend code with Laravel, paired with responsive, accessible user interfaces built on React, Inertia.js, and Tailwind CSS."
   - `email`: "fauzanhanif2112@gmail.com"
   - `photo`: "/images/profile.jpg"
   - `sosmed`:
     ```json
     {
       "github": "https://github.com/fauzanhanif",
       "linkedin": "https://linkedin.com/in/fauzanhanif",
       "instagram": "https://instagram.com/fauzanhanif",
       "email": "mailto:fauzanhanif2112@gmail.com"
     }
     ```

3. **Categories**:
   - Project Categories (`type = 'project'`):
     - `Full-Stack Web` (slug: `full-stack-web`)
     - `Backend API` (slug: `backend-api`)
     - `Cloud & DevOps` (slug: `cloud-devops`)
     - `Open Source` (slug: `open-source`)
   - Article Categories (`type = 'article'`):
     - `Web Development` (slug: `web-development`)
     - `Software Architecture` (slug: `software-architecture`)
     - `Tutorial & Tips` (slug: `tutorial-tips`)
     - `DevOps & Deployment` (slug: `devops-deployment`)

4. **Tags**:
   - `Laravel` (slug: `laravel`)
   - `React` (slug: `react`)
   - `TypeScript` (slug: `typescript`)
   - `Inertia.js` (slug: `inertiajs`)
   - `Tailwind CSS` (slug: `tailwind-css`)
   - `MySQL` (slug: `mysql`)
   - `cPanel` (slug: `cpanel`)
   - `Clean Code` (slug: `clean-code`)

5. **Skills**:
   - **Backend**:
     - `PHP` (category: "Backend", level: "Advanced", icon: "php", `is_featured: true`)
     - `Laravel` (category: "Backend", level: "Advanced", icon: "laravel", `is_featured: true`)
     - `MySQL / MariaDB` (category: "Backend", level: "Advanced", icon: "database", `is_featured: true`)
     - `Node.js` (category: "Backend", level: "Intermediate", icon: "nodejs", `is_featured: false`)
     - `RESTful APIs` (category: "Backend", level: "Advanced", icon: "server", `is_featured: false`)
   - **Frontend**:
     - `React.js` (category: "Frontend", level: "Advanced", icon: "react", `is_featured: true`)
     - `TypeScript` (category: "Frontend", level: "Intermediate", icon: "typescript", `is_featured: true`)
     - `Tailwind CSS` (category: "Frontend", level: "Advanced", icon: "tailwind", `is_featured: true`)
     - `Inertia.js` (category: "Frontend", level: "Advanced", icon: "layers", `is_featured: false`)
     - `HTML5 / CSS3` (category: "Frontend", level: "Expert", icon: "code", `is_featured: false`)
   - **Tools**:
     - `Git & GitHub` (category: "Tools", level: "Advanced", icon: "git", `is_featured: true`)
     - `Docker` (category: "Tools", level: "Intermediate", icon: "container", `is_featured: false`)
     - `Postman` (category: "Tools", level: "Advanced", icon: "send", `is_featured: false`)
     - `cPanel & Hosting` (category: "Tools", level: "Advanced", icon: "cloud", `is_featured: false`)
     - `Vite` (category: "Tools", level: "Advanced", icon: "zap", `is_featured: false`)

6. **Projects**:
   - Project 1 (Featured): "Personal Portfolio & Independent CMS"
     - Slug: `personal-portfolio-cms`
     - Description: "Full-stack personal portfolio and CMS application built with Laravel 13, React 19, Inertia.js v3, Tailwind CSS v4, and Neobrutalism design aesthetics."
     - `tech_stack`: `["Laravel 13", "React 19", "Inertia v3", "Tailwind CSS v4", "MySQL"]`
     - `is_featured`: `true`
     - `project_url`: "https://github.com/fauzanhanif/portfolio"
     - Category: `Full-Stack Web`
   - Project 2 (Featured): "Enterprise Resource Planning (ERP) System"
     - Slug: `enterprise-resource-planning`
     - Description: "Modular ERP platform for small-to-medium businesses covering warehouse inventory, order invoicing, and financial balance sheets."
     - `tech_stack`: `["Laravel", "MySQL", "Livewire", "Alpine.js", "Bootstrap"]`
     - `is_featured`: `true`
     - `project_url`: "https://github.com/fauzanhanif/erp-system"
     - Category: `Full-Stack Web`
   - Project 3 (Featured): "E-Commerce Multi-Vendor Platform"
     - Slug: `ecommerce-multivendor-platform`
     - Description: "High-throughput marketplace platform with integrated Stripe payment processing, real-time inventory locking, and admin analytics."
     - `tech_stack`: `["Laravel", "React", "Redux", "Stripe API", "PostgreSQL"]`
     - `is_featured`: `true`
     - `project_url`: "https://github.com/fauzanhanif/ecommerce"
     - Category: `Full-Stack Web`
   - Project 4: "Hospital Clinic Queue & Medical Records"
     - Slug: `hospital-clinic-queue-records`
     - Description: "Electronic Medical Records (EMR) and patient queue scheduling management system designed for outpatient healthcare centers."
     - `tech_stack`: `["PHP", "CodeIgniter", "MySQL", "Chart.js"]`
     - `is_featured`: `false`
     - `project_url`: null
     - Category: `Backend API`
   - Project 5: "RESTful API Microservices Gateway"
     - Slug: `restful-api-gateway`
     - Description: "Lightweight API Gateway with JWT validation, request throttling, and unified endpoint routing across distributed services."
     - `tech_stack`: `["Node.js", "Express", "Docker", "Redis", "JWT"]`
     - `is_featured`: `false`
     - `project_url`: "https://github.com/fauzanhanif/api-gateway"
     - Category: `Cloud & DevOps`

7. **Articles**:
   - Article 1 (Featured, Published): "Membangun Web Modern dengan Laravel 13, React 19, dan Inertia.js v3"
     - Slug: `membangun-web-modern-laravel-react-inertia`
     - Excerpt: "Panduan arsitektur modern membangun aplikasi monolitik yang gesit menggunakan perpaduan Laravel 13, React 19, dan Inertia.js v3 tanpa kompleksitas API terpisah."
     - Content: Rich HTML with headings, code blocks, lists, and bold text.
     - Status: `published`, `is_featured: true`, `published_at`: "2026-09-15 10:00:00"
     - Categories: `Web Development`, `Software Architecture`
     - Tags: `Laravel`, `React`, `Inertia.js`
   - Article 2 (Featured, Published): "Panduan Deploy Laravel ke Shared Hosting cPanel Tanpa Akses SSH"
     - Slug: `panduan-deploy-laravel-cpanel-tanpa-ssh`
     - Excerpt: "Langkah-langkah praktis dan konfigurasi filesystems untuk meluncurkan aplikasi Laravel di cPanel secara mulus tanpa symlink dan tanpa terminal."
     - Content: Rich HTML with step-by-step cPanel guide and filesystems configuration.
     - Status: `published`, `is_featured: true`, `published_at`: "2026-09-28 14:30:00"
     - Categories: `DevOps & Deployment`, `Tutorial & Tips`
     - Tags: `Laravel`, `cPanel`, `MySQL`
   - Article 3 (Featured, Published): "Eksplorasi Desain Neobrutalism pada UI/UX Aplikasi Web Modern"
     - Slug: `eksplorasi-desain-neobrutalism-ui-ux`
     - Excerpt: "Mengenal tren estetika Neobrutalism: kontras tinggi, border tegas, bayangan solid, dan tipografi Space Grotesk yang membuat web tampak berkarakter."
     - Content: Rich HTML detailing Neobrutalism tokens, borders, and tactile UI feedback.
     - Status: `published`, `is_featured: true`, `published_at`: "2026-10-05 09:15:00"
     - Categories: `Web Development`
     - Tags: `Tailwind CSS`, `React`
   - Article 4 (Draft): "Optimalisasi Query Eloquent dan Eager Loading untuk Performa Skala Besar"
     - Slug: `optimalisasi-query-eloquent-eager-loading`
     - Excerpt: "Menghindari jebakan N+1 problem dan memangkas waktu respons basis data menggunakan eager loading `with()`, chunking, dan select scoping."
     - Content: Technical notes on database optimization.
     - Status: `draft`, `is_featured: false`, `published_at`: null
     - Categories: `Software Architecture`
     - Tags: `Laravel`, `MySQL`, `Clean Code`

8. **Educations**:
   - Institution: "Universitas Brawijaya"
   - Degree: "S1 Teknik Informatika / Ilmu Komputer"
   - `start_year`: 2019, `end_year`: 2023
   - `description`: "Fokus pada Rekayasa Perangkat Lunak, Arsitektur Sistem Informasi, dan Basis Data Terdistribusi. Lulus dengan predikat Sangat Memuaskan (IPK 3.82)."

9. **Experiences**:
   - Experience 1 (Current):
     - Company: "PT Inovasi Teknologi Digital"
     - Role: "Full-Stack Software Engineer"
     - `start_date`: "2023-08-01", `end_date`: null
     - `description`: "Memimpin arsitektur dan pengembangan modul backend berbasis Laravel dan antarmuka SPA menggunakan React. Meningkatkan efisiensi query dan throughput aplikasi hingga 40%."
   - Experience 2:
     - Company: "Nusantara Software Studio"
     - Role: "Backend Developer (Internship & Contract)"
     - `start_date`: "2022-06-01", `end_date`: "2023-07-31"
     - `description`: "Mengembangkan RESTful APIs untuk sistem inventaris pergudangan, integrasi payment gateway, serta perancangan skema relasional MySQL."

10. **Certifications**:
    - Certification 1:
      - Name: "AWS Certified Solutions Architect – Associate"
      - Issuer: "Amazon Web Services (AWS)"
      - `issued_at`: "2024-03-10"
      - `credential_url`: "https://aws.amazon.com/verification"
    - Certification 2:
      - Name: "Belajar Fundamental Aplikasi Web dengan React"
      - Issuer: "Dicoding Academy"
      - `issued_at`: "2023-11-20"
      - `credential_url`: "https://www.dicoding.com/certificates/REACT-12345"
    - Certification 3:
      - Name: "Laravel Certified Developer"
      - Issuer: "Laravel Certification"
      - `issued_at`: "2023-05-15"
      - `credential_url`: "https://laravelcertificate.com/fauzan-hanif"

---

### 4.4. Spatie Media Library & cPanel Shared Hosting Configuration

#### Rationale
On shared cPanel hosting without SSH:
- Creating symbolic links via `php artisan storage:link` is impossible without terminal or Cron Job permissions.
- Even if a symlink script is run via PHP, many hosting providers disable PHP `symlink()` or Apache `FollowSymLinks` directive for security reasons.
- Uploads placed in `storage/app/public` are unreachable from HTTP web root.

#### Implementation Specification
1. **Filesystem Configuration (`config/filesystems.php`)**:
   Adjust the `'public'` disk configuration so its `root` points directly to `public_path('uploads')`:
   ```php
   'disks' => [
       // ...
       'public' => [
           'driver' => 'local',
           'root' => public_path('uploads'),
           'url' => rtrim((string) env('APP_URL', 'http://localhost'), '/').'/uploads',
           'visibility' => 'public',
           'throw' => false,
           'report' => false,
       ],
   ],
   ```
2. **Spatie Media Library Configuration (`config/media-library.php`)**:
   Confirm `'disk_name'` remains:
   ```php
   'disk_name' => env('MEDIA_DISK', 'public'),
   ```
3. **Directory Structure & Permissions**:
   - Web directory `public/uploads/` is created directly inside `public/`.
   - File uploads write directly to `public/uploads/{media_id}/{file_name}`.
   - Web server serves files directly via `/uploads/{media_id}/{file_name}` with 0 symlinks!
4. **Git Discipline**:
   - Add `public/uploads/*` and `!public/uploads/.gitkeep` to `.gitignore` so user uploads are not tracked in version control.

---

### 4.5. phpMyAdmin Database Export Specification (`database/portfolio_dump.sql`)

#### Export File Requirements
- **Path**: `database/portfolio_dump.sql`
- **Dialect**: MySQL 8.0+ / MariaDB 10.4+ compatible SQL.
- **Encoding**: `utf8mb4` with collation `utf8mb4_unicode_ci`.

#### Structure Rules for phpMyAdmin Clean Import
1. **Foreign Key Safety**:
   - Prepend with:
     ```sql
     SET FOREIGN_KEY_CHECKS = 0;
     SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
     SET AUTOCOMMIT = 0;
     START TRANSACTION;
     SET time_zone = "+00:00";
     ```
   - Append with:
     ```sql
     COMMIT;
     SET FOREIGN_KEY_CHECKS = 1;
     ```
2. **No Database Creation or Selection**:
   - DO NOT include `CREATE DATABASE` or `USE ...;`. In cPanel, users must select their allocated database (e.g., `user_portfolio`) before clicking "Import".
3. **Idempotent Table Drops & Creates**:
   - Each table must have `DROP TABLE IF EXISTS table_name;` followed by `CREATE TABLE table_name (...);`.
4. **Included Tables & Data**:
   - `users` (with admin user record)
   - `password_reset_tokens`
   - `sessions`
   - `cache`, `cache_locks`
   - `jobs`, `job_batches`, `failed_jobs`
   - `media`
   - `profiles` (with Fauzan Hanif profile record)
   - `categories` (with 8 categorized records)
   - `tags` (with 8 tag records)
   - `skills` (with 15 categorized skill records)
   - `projects` (with 5 project records)
   - `project_category` (with pivot mappings)
   - `articles` (with 4 article records)
   - `article_category` (with pivot mappings)
   - `article_tag` (with pivot mappings)
   - `educations` (with academic history record)
   - `experiences` (with 2 experience records)
   - `certifications` (with 3 certification records)
   - `migrations` (pre-populated with all migration batch entries so future artisan commands are aware of migrated status)

---

### 4.6. Required Discovery Tables

## Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Auth | Admin User Table | Stores administrative credentials for Fortify authentication | `name`, `email`, `password` | User record, auth session | Validation error on duplicate email or invalid credentials | `docs/DATABASE.md`, `0001_01_01_000000_create_users_table.php` |
| 2 | Profile | Personal Profile & Sosmed | Stores Fauzan Hanif's identity, bio, avatar, and social link JSON | `name`, `headline`, `about`, `photo`, `email`, `sosmed` | Profile model with JSON array cast | Rejects invalid JSON structure, requires email | `docs/DATABASE.md`, `docs/features/01-beranda-perkenalan.md` |
| 3 | Taxonomy | Polymorphic Category Master | Stores categories partitioned by `type` enum (`article` or `project`) | `name`, `slug`, `type` (`CategoryType`) | Category model with Enum cast | Enforces unique slug and valid enum values | `docs/DATABASE.md`, `docs/features/08-kategori-tag.md` |
| 4 | Taxonomy | Article Tag Master | Stores keyword tags exclusively for technical articles | `name`, `slug` | Tag model | Enforces unique slug, cascades pivot on delete | `docs/DATABASE.md`, `docs/features/08-kategori-tag.md` |
| 5 | Portfolio | Technical Skills Catalog | Stores skills grouped by domain (Backend, Frontend, Tools) | `name`, `category`, `level`, `icon`, `is_featured` | Skill model with boolean cast | Defaults `is_featured` to false | `docs/DATABASE.md`, `docs/features/03-skill-keahlian.md` |
| 6 | Portfolio | Project Showcase | Stores projects with JSON tech stack array and category pivot | `title`, `slug`, `description`, `tech_stack`, `image`, `project_url`, `is_featured` | Project model with JSON array and Category relation | Enforces unique slug, cascades pivot relations | `docs/DATABASE.md`, `docs/features/02-daftar-proyek.md` |
| 7 | Blog | Articles & WYSIWYG Content | Stores blog posts with TipTap HTML, status enum, and publication timestamp | `title`, `slug`, `excerpt`, `content`, `cover_image`, `status`, `is_featured`, `published_at` | Article model with `ArticleStatus` enum and datetime cast | Rejects invalid status enum, unique slug | `docs/DATABASE.md`, `docs/features/04-artikel-blog.md` |
| 8 | Timeline | Education Timeline | Stores academic history with start and optional end year | `institution`, `degree`, `start_year`, `end_year`, `description` | Education model with integer cast | Handles null `end_year` as ongoing study | `docs/DATABASE.md`, `docs/features/05-riwayat-sertifikat.md` |
| 9 | Timeline | Work Experience Timeline | Stores employment chronology with start and optional end date | `company`, `role`, `start_date`, `end_date`, `description` | Experience model with date cast | Handles null `end_date` as currently active role | `docs/DATABASE.md`, `docs/features/05-riwayat-sertifikat.md` |
| 10 | Credentials | Certifications & Licenses | Stores verified credentials with issue date and online verification URL | `name`, `issuer`, `issued_at`, `image`, `credential_url` | Certification model with date cast | Handles optional credential URL and image | `docs/DATABASE.md`, `docs/features/05-riwayat-sertifikat.md` |
| 11 | Storage | Spatie Media Library Direct Public Disk | Manages image uploads to `public/uploads` without symlinks | Multipart file upload | Media model and relative public URL | Throws exception on file exceeding 10MB or invalid mime | `config/media-library.php`, `config/filesystems.php`, `PRD.md` |
| 12 | Database | Clean phpMyAdmin Dump | Provides pre-seeded SQL export ready for cPanel phpMyAdmin import | `database/portfolio_dump.sql` | Executable SQL script with foreign key checks toggled | Avoids `CREATE DATABASE` / `USE` syntax errors | `docs/DATABASE.md`, `docs/PRD.md`, `ORIGINAL_REQUEST.md` |

## Edge Cases
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Category Slug Uniqueness | Creating article category and project category with duplicate name | Schema defines `slug VARCHAR(255) UNIQUE` globally across `categories`. Duplicate slug violates unique constraint. Slugs must be uniquely suffixed or differentiated. |
| 2 | Ongoing Education | `end_year` is null | Model casts `end_year` to nullable integer. Frontend timeline renders "Present" or "Sekarang". |
| 3 | Active Employment | `end_date` is null | Model casts `end_date` to nullable `CarbonImmutable`. Frontend timeline renders "Jan 2023 – Sekarang". |
| 4 | Article Draft Status | Article with `status = 'draft'` and `published_at = null` | `scopePublished()` excludes drafts from public landing page (`/`) and archive (`/articles`). |
| 5 | Empty Social Links | `profiles.sosmed` is null or `{}` | Model cast returns empty array or null; accessor or frontend type guard prevents undefined errors. |
| 6 | Special Characters in Slugs | Titles with symbols (e.g. "C#", "Node.js", "CI/CD") | `Str::slug()` converts to "c", "nodejs", "ci-cd". Slug generation must handle collision with existing records. |
| 7 | Shared Hosting Symlink Absence | User requests file via `/uploads/{id}/{file}` | Apache/LiteSpeed serves static file directly from `public/uploads` without requiring `storage:link`. |
| 8 | Pivot Cascade Deletion | Article is deleted while linked to multiple categories and tags | Foreign keys `ON DELETE CASCADE` automatically purge records from `article_category` and `article_tag` without orphan rows. |
| 9 | SQLite In-Memory Testing | Running `php artisan test` with SQLite `:memory:` | SQLite executes migrations without error; ENUM columns are created as TEXT with check constraints. |
| 10 | phpMyAdmin Import on Prefixed DB | User imports `portfolio_dump.sql` into `cpaneluser_myport` | SQL executes cleanly without `Access denied for user to database 'fauzanhanif'` because no hardcoded database is declared. |

---

## 5. Verification Method

To independently verify the completeness and compliance of these data layer specifications:

1. **Schema and Migration Verification:**
   - Review proposed schema against `docs/DATABASE.md` (lines 43–225) to ensure 100% field, modifier, and constraint alignment.
   - Run `php artisan migrate:status` to verify migration states.
2. **Model Casts and Relationships Verification:**
   - Inspect `app/Enums/CategoryType.php` and `app/Enums/ArticleStatus.php` against `docs/DATABASE.md` (lines 19–39).
   - Review `resources/js/types/portfolio.ts` to verify frontend prop contracts match model serialization.
3. **Spatie Media Library Configuration:**
   - Inspect `config/filesystems.php` (disk `public` root set to `public_path('uploads')`) and `config/media-library.php` (`disk_name => 'public'`).
4. **phpMyAdmin SQL Dump Verification:**
   - Inspect `database/portfolio_dump.sql` for:
     - `SET FOREIGN_KEY_CHECKS = 0;` at top and `SET FOREIGN_KEY_CHECKS = 1;` at bottom.
     - Absence of `CREATE DATABASE` or `USE ...;`.
     - Presence of seeded admin user (`fauzanhanif2112@gmail.com`).
