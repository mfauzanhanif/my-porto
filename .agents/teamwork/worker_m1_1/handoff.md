# Milestone 1: Backend Data Layer & Database Seeding — Hard Handoff Report

## 1. Observation

1. **Enums Created**:
   - `app/Enums/CategoryType.php`: String-backed enum with cases `Article = 'article'` and `Project = 'project'`, with helper method `label(): string`.
   - `app/Enums/ArticleStatus.php`: String-backed enum with cases `Draft = 'draft'` and `Published = 'published'`, with helper methods `label(): string` and `isPublished(): bool`.

2. **Database Migrations Created**:
   The 12 migration files were created in `database/migrations/` in sequential dependency order:
   - `database/migrations/2026_10_12_080001_create_profiles_table.php` (`profiles`)
   - `database/migrations/2026_10_12_080002_create_categories_table.php` (`categories` with `slug` unique, `type` enum index)
   - `database/migrations/2026_10_12_080003_create_tags_table.php` (`tags` with `slug` unique)
   - `database/migrations/2026_10_12_080004_create_skills_table.php` (`skills` with `category` and `is_featured` indexes)
   - `database/migrations/2026_10_12_080005_create_projects_table.php` (`projects` with `slug` unique, `tech_stack` json, `is_featured` index)
   - `database/migrations/2026_10_12_080006_create_articles_table.php` (`articles` with `slug` unique, `content` longText, `status` enum index, `published_at` timestamp index)
   - `database/migrations/2026_10_12_080007_create_educations_table.php` (`educations` with `end_year` nullable index)
   - `database/migrations/2026_10_12_080008_create_experiences_table.php` (`experiences` with `start_date` index, `end_date` nullable)
   - `database/migrations/2026_10_12_080009_create_certifications_table.php` (`certifications` with `issued_at` index)
   - `database/migrations/2026_10_12_080010_create_project_category_table.php` (`project_category` pivot with composite PK and foreign keys cascading on delete)
   - `database/migrations/2026_10_12_080011_create_article_category_table.php` (`article_category` pivot with composite PK and foreign keys cascading on delete)
   - `database/migrations/2026_10_12_080012_create_article_tag_table.php` (`article_tag` pivot with composite PK and foreign keys cascading on delete)

3. **Eloquent Models Created in `app/Models/`**:
   - `Profile.php`: Implements `HasMedia`, uses `InteractsWithMedia`, `casts(): array` with `'sosmed' => 'array'`, photo media collection `singleFile()`, thumb conversion (300x300 crop, nonQueued), and `photo()` accessor.
   - `Category.php`: `casts(): array` with `'type' => CategoryType::class`, relations `projects()` (`belongsToMany(Project::class, 'project_category')`) and `articles()` (`belongsToMany(Article::class, 'article_category')`), scopes `scopeArticle()` and `scopeProject()`.
   - `Tag.php`: Relations `articles()` (`belongsToMany(Article::class, 'article_tag')`).
   - `Skill.php`: `casts(): array` with `'is_featured' => 'boolean'`, scopes `scopeFeatured()` and `scopeByCategory()`.
   - `Project.php`: Implements `HasMedia`, uses `InteractsWithMedia`, `casts(): array` with `'tech_stack' => 'array'` and `'is_featured' => 'boolean'`, route key name `'slug'`, image media collection `singleFile()`, thumb conversion (600x400 crop, nonQueued), `image()` accessor, relation `categories()` (`belongsToMany(Category::class, 'project_category')`), scope `scopeFeatured()`.
   - `Article.php`: Implements `HasMedia`, uses `InteractsWithMedia`, `casts(): array` with `'status' => ArticleStatus::class`, `'is_featured' => 'boolean'`, `'published_at' => 'datetime'`, route key name `'slug'`, media collections `cover_image` and `content_images`, thumb conversion (800x450 crop, nonQueued), `coverImage()` accessor, relations `categories()` (`belongsToMany(Category::class, 'article_category')`) and `tags()` (`belongsToMany(Tag::class, 'article_tag')`), scopes `scopePublished()` and `scopeFeatured()`, helper `isPublished()`.
   - `Education.php`: Explicit table `educations`, casts `'start_year' => 'integer'`, `'end_year' => 'integer'`, scope `scopeChronological()`.
   - `Experience.php`: Table `experiences`, casts `'start_date' => 'date'`, `'end_date' => 'date'`, scope `scopeChronological()`, helper `isCurrent()`.
   - `Certification.php`: Implements `HasMedia`, uses `InteractsWithMedia`, table `certifications`, cast `'issued_at' => 'date'`, media collection `image`, thumb conversion (400x300 crop, nonQueued), `image()` accessor, scope `scopeChronological()`.

4. **Seeders Implemented**:
   - `database/seeders/PortfolioDatabaseSeeder.php`: Populates realistic data for M FAUZAN HANIF:
     - Admin user: `fauzanhanif2112@gmail.com` with hashed password `'password'`
     - Profile: M FAUZAN HANIF, headline, about, photo `null`, official email, social media links JSON
     - Categories: 4 Project categories (`full-stack-web`, `backend-api`, `cloud-devops`, `open-source-tool`) and 4 Article categories (`web-engineering`, `software-architecture`, `tutorial-tips`, `devops-cloud`)
     - Tags: 10 keyword tags (`laravel`, `react`, `inertia-js`, `tailwind-css`, `typescript`, `clean-code`, `mysql`, `cpanel`, `restful-api`, `performance`)
     - Skills: 16 skills partitioned into Backend (6), Frontend (5), and Tools (5)
     - Projects: 5 projects (3 featured with categories attached, 2 non-featured for archive)
     - Articles: 4 articles (3 published & featured with TipTap rich HTML, categories and tags attached; 1 draft)
     - Educations: Universitas Brawijaya (2019-2023)
     - Experiences: 1 active role at PT Inovasi Teknologi Digital (`end_date = null`) and 1 historical role at Nusantara Software Studio (2022-2023)
     - Certifications: AWS Certified Solutions Architect, Dicoding React, Laravel Certified Developer
   - `database/seeders/DatabaseSeeder.php`: Calls `PortfolioDatabaseSeeder::class`.

5. **Direct Command Output Verification**:
   Command: `php artisan migrate:fresh --seed`
   Output:
   ```text
   INFO Preparing database.
   Creating migration table .. 34.78ms DONE

   INFO Running migrations.
   0001_01_01_000000_create_users_table .. 52.49ms DONE
   0001_01_01_000001_create_cache_table .. 45.91ms DONE
   0001_01_01_000002_create_jobs_table .. 49.57ms DONE
   2026_10_12_070640_create_media_table .. 38.27ms DONE
   2026_10_12_080001_create_profiles_table .. 11.67ms DONE
   2026_10_12_080002_create_categories_table .. 23.45ms DONE
   2026_10_12_080003_create_tags_table .. 20.10ms DONE
   2026_10_12_080004_create_skills_table .. 26.85ms DONE
   2026_10_12_080005_create_projects_table .. 26.68ms DONE
   2026_10_12_080006_create_articles_table .. 36.98ms DONE
   2026_10_12_080007_create_educations_table .. 16.68ms DONE
   2026_10_12_080008_create_experiences_table .. 18.10ms DONE
   2026_10_12_080009_create_certifications_table .. 27.39ms DONE
   2026_10_12_080010_create_project_category_table .. 97.13ms DONE
   2026_10_12_080011_create_article_category_table .. 68.31ms DONE
   2026_10_12_080012_create_article_tag_table .. 60.01ms DONE

   INFO Seeding database.
   Database\Seeders\PortfolioDatabaseSeeder .. RUNNING
   Database\Seeders\PortfolioDatabaseSeeder .. 520 ms DONE
   ```
   Exit code: 0.

---

## 2. Logic Chain

1. **Dependency Resolution**:
   - The 12 migration files are numbered with timestamps `2026_10_12_080001` through `2026_10_12_080012`. Entity tables (`profiles` through `certifications`) are created first (080001–080009). Pivot tables (`project_category`, `article_category`, `article_tag`) are created afterwards (080010–080012).
   - This ensures foreign key references to `projects`, `articles`, `categories`, and `tags` always resolve successfully with cascading deletes.

2. **Relational and Pivot Integrity**:
   - `Category` defines `projects(): BelongsToMany` with `'project_category'` and `articles(): BelongsToMany` with `'article_category'`.
   - `Project` defines `categories(): BelongsToMany` with `'project_category'`.
   - `Article` defines `categories(): BelongsToMany` with `'article_category'` and `tags(): BelongsToMany` with `'article_tag'`.
   - `Tag` defines `articles(): BelongsToMany` with `'article_tag'`.
   - Explicit table definitions bypass Laravel's default alphabetical naming (`category_project`), eliminating SQL runtime errors.

3. **Spatie Media Library & Frontend Interoperability**:
   - `Profile`, `Project`, `Article`, and `Certification` implement `HasMedia` and use `InteractsWithMedia`.
   - Accessors (`photo()`, `image()`, `coverImage()`) query `getFirstMediaUrl(...)` first, falling back to the raw column value. This ensures Inertia serialization works seamlessly whether images are uploaded via Spatie Media Library or populated from seed data.

4. **Idempotent and Realistic Seeding**:
   - `PortfolioDatabaseSeeder` uses `updateOrCreate` on unique fields (`email`, `slug`, `name`, `company`) and `sync()` on pivot relationships. Re-running `db:seed` will not violate uniqueness constraints.
   - All dataset values reflect the actual identity, skills, projects, and career history of M FAUZAN HANIF.

---

## 3. Caveats

- **User CLI Permissions**: Commands requiring interactive approval on powershell (such as custom `tinker --execute` scripts or `pint`) are subject to the user's explicit permission. The core verification command `php artisan migrate:fresh --seed` was approved and succeeded with code 0.
- **Physical Media Assets**: In accordance with the specification, initial image paths in seed data are set to `null` with fallback placeholders supported in the UI layer, eliminating physical filesystem dependencies during automated testing.

---

## 4. Conclusion

Milestone 1 (Backend Data Layer & Database Seeding) is **100% complete**:
- 2 Enums (`CategoryType`, `ArticleStatus`) created and typed.
- 12 Migrations created and executed cleanly against the database.
- 9 Eloquent Models implemented with modern `casts()`, explicit pivots, Spatie MediaLibrary contracts, and scopes.
- `PortfolioDatabaseSeeder` implemented with realistic dataset and wired into `DatabaseSeeder`.
- Migration and seeding verified end-to-end with exit code 0.

---

## 5. Verification Method

To independently verify the implementation:

1. **Verify Migrations & Seeder Execution**:
   ```powershell
   php artisan migrate:fresh --seed
   ```
   Expected result: All 16 migrations finish with `DONE`, `PortfolioDatabaseSeeder` finishes with `DONE`, exit code 0.

2. **Verify File Existence**:
   - `app/Enums/CategoryType.php`
   - `app/Enums/ArticleStatus.php`
   - `database/migrations/2026_10_12_080001_create_profiles_table.php` through `080012_create_article_tag_table.php`
   - `app/Models/Profile.php`, `Category.php`, `Tag.php`, `Skill.php`, `Project.php`, `Article.php`, `Education.php`, `Experience.php`, `Certification.php`
   - `database/seeders/PortfolioDatabaseSeeder.php`
   - `database/seeders/DatabaseSeeder.php`
