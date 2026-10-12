# Milestone 1 Database Migrations Architecture Report

## 1. Observation

Direct observations from codebase inspection, configuration files, and authoritative specifications:

1. **`docs/DATABASE.md` (lines 43–225)** specifies the relational schema:
   - Base entity tables:
     - `profiles`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `headline` (VARCHAR 255 NULLABLE), `about` (TEXT NULLABLE), `photo` (VARCHAR 255 NULLABLE), `email` (VARCHAR 255), `sosmed` (JSON NULLABLE), `timestamps`.
     - `categories`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `slug` (VARCHAR 255 UNIQUE), `type` (ENUM('article', 'project') INDEX), `timestamps`.
     - `tags`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `slug` (VARCHAR 255 UNIQUE), `timestamps`.
     - `skills`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `category` (VARCHAR 255 NULLABLE INDEX), `level` (VARCHAR 50 NULLABLE), `icon` (VARCHAR 255 NULLABLE), `is_featured` (BOOLEAN DEFAULT false INDEX), `timestamps`.
     - `projects`: `id` (BIGINT UNSIGNED PK), `title` (VARCHAR 255), `slug` (VARCHAR 255 UNIQUE), `description` (TEXT), `tech_stack` (JSON NULLABLE), `image` (VARCHAR 255 NULLABLE), `project_url` (VARCHAR 255 NULLABLE), `is_featured` (BOOLEAN DEFAULT false INDEX), `timestamps`.
     - `articles`: `id` (BIGINT UNSIGNED PK), `title` (VARCHAR 255), `slug` (VARCHAR 255 UNIQUE), `excerpt` (TEXT NULLABLE), `content` (LONGTEXT), `cover_image` (VARCHAR 255 NULLABLE), `status` (ENUM('draft', 'published') DEFAULT 'draft' INDEX), `is_featured` (BOOLEAN DEFAULT false INDEX), `published_at` (TIMESTAMP NULLABLE INDEX), `timestamps`.
     - `educations`: `id` (BIGINT UNSIGNED PK), `institution` (VARCHAR 255), `degree` (VARCHAR 255), `start_year` (INT), `end_year` (INT NULLABLE INDEX), `description` (TEXT NULLABLE), `timestamps`.
     - `experiences`: `id` (BIGINT UNSIGNED PK), `company` (VARCHAR 255), `role` (VARCHAR 255), `start_date` (DATE INDEX), `end_date` (DATE NULLABLE), `description` (TEXT NULLABLE), `timestamps`.
     - `certifications`: `id` (BIGINT UNSIGNED PK), `name` (VARCHAR 255), `issuer` (VARCHAR 255), `issued_at` (DATE INDEX), `image` (VARCHAR 255 NULLABLE), `credential_url` (VARCHAR 255 NULLABLE), `timestamps`.
   - Pivot tables:
     - `project_category`: `project_id` (BIGINT UNSIGNED FK → `projects.id` ON DELETE CASCADE), `category_id` (BIGINT UNSIGNED FK → `categories.id` ON DELETE CASCADE), Composite PK `(project_id, category_id)`.
     - `article_category`: `article_id` (BIGINT UNSIGNED FK → `articles.id` ON DELETE CASCADE), `category_id` (BIGINT UNSIGNED FK → `categories.id` ON DELETE CASCADE), Composite PK `(article_id, category_id)`.
     - `article_tag`: `article_id` (BIGINT UNSIGNED FK → `articles.id` ON DELETE CASCADE), `tag_id` (BIGINT UNSIGNED FK → `tags.id` ON DELETE CASCADE), Composite PK `(article_id, tag_id)`.

2. **`PROJECT.md` (lines 18–20, 117)**:
   - Migration convention specifies target timestamp pattern: `database/migrations/2026_10_12_080000_*.php`.
   - Feature 1: Database Migrations covers all 10 entity and pivot tables (`profiles`, `categories`, `tags`, `skills`, `projects`, `articles`, `educations`, `experiences`, `certifications`, `project_category`, `article_category`, `article_tag`).

3. **`phpunit.xml` (lines 26–27)**:
   - Testing environment is configured with:
     ```xml
     <env name="DB_CONNECTION" value="sqlite"/>
     <env name="DB_DATABASE" value=":memory:"/>
     ```
   - Running `php artisan test --compact` executes in-memory SQLite migrations before running tests.

4. **`database/migrations/` inspection**:
   - Current migrations present:
     - `0001_01_01_000000_create_users_table.php` (contains `users`, `password_reset_tokens`, `sessions`)
     - `0001_01_01_000001_create_cache_table.php`
     - `0001_01_01_000002_create_jobs_table.php`
     - `2026_10_12_070640_create_media_table.php` (Spatie Media Library)

5. **`ORIGINAL_REQUEST.md` (lines 21–32, 72)**:
   - "Implementasikan migration dan Eloquent models lengkap dengan casting dan relasi"
   - Acceptance criteria: "Migrasi berhasil dieksekusi tanpa error (`php artisan migrate:fresh`)."

---

## 2. Logic Chain

1. **Dependency Ordering & Timestamp Resolution (supporting Observation 1 & 2)**:
   - Tables without foreign key dependencies (`profiles`, `categories`, `tags`, `skills`, `educations`, `experiences`, `certifications`) can be created in any relative order among themselves, but must exist before foreign keys reference them.
   - `projects` and `articles` have no outgoing foreign keys in their own tables, but are referenced by pivots.
   - Pivot tables (`project_category`, `article_category`, `article_tag`) have foreign key constraints pointing to `projects`, `articles`, `categories`, and `tags`.
   - If migrations run alphabetically by timestamp, assigning sequential timestamps from `2026_10_12_080001` through `2026_10_12_080009` to the 9 base entity tables, and `2026_10_12_080010` through `2026_10_12_080012` to the 3 pivot tables guarantees that parent tables always exist prior to pivot table creation.
   - Furthermore, during `php artisan migrate:rollback`, migrations execute in reverse order. Dropping `article_tag`, `article_category`, and `project_category` before dropping `articles`, `projects`, `categories`, and `tags` guarantees zero foreign key constraint violations in MySQL 8.0+.

2. **SQLite In-Memory Compatibility (supporting Observation 3)**:
   - In SQLite `:memory:`:
     - `$table->longText('content')` maps to SQLite `TEXT` (supports up to 1GB storage).
     - `$table->json('tech_stack')` and `$table->json('sosmed')` map to SQLite `TEXT` (Eloquent JSON casting handles serialization).
     - `$table->enum('type', ['article', 'project'])` maps to `VARCHAR` with `CHECK (type IN ('article', 'project'))`.
     - `$table->enum('status', ['draft', 'published'])->default('draft')` maps to `VARCHAR` with default `'draft'` and check constraint.
     - `$table->primary(['project_id', 'category_id'])` is natively supported in SQLite table definitions.
     - All column modifiers (`nullable()`, `default()`, `unique()`, `index()`) are fully supported by Laravel SQLite grammar.

3. **MySQL 8.0+ Performance & Index Optimization**:
   - In pivot tables, the composite primary key `PRIMARY KEY (project_id, category_id)` automatically creates a clustered index indexed on the first column (`project_id`).
   - However, queries looking up by the second column (e.g. `$category->projects` or `$tag->articles`) require a separate index on `category_id` and `tag_id`.
   - Adding `$table->index('category_id')` and `$table->index('tag_id')` prevents full table scans on pivot lookups.
   - Explicit table references in `$table->foreignId('category_id')->constrained('categories')->cascadeOnDelete()` eliminate pluralization ambiguities.

---

## 3. Caveats

1. **Category Slug Uniqueness Across Types**:
   - `categories.slug` is globally unique. An article category and a project category cannot share the identical slug. E.g., if "Web Development" is a project category with slug `web-development`, an article category must have a distinct slug such as `web-development-articles` or use distinct category names.
2. **Nullable Date & Year Handling**:
   - `educations.end_year` and `experiences.end_date` are nullable to represent ongoing academic studies or current employment. Application logic, seeders, and UI components must treat `null` as "Present" / "Sekarang".
3. **No Modification of Application Source Code**:
   - In strict compliance with the Explorer role boundary, no files in `database/migrations/` or `app/` have been written or modified during this investigation.

---

## 4. Conclusion & Implementation Plan

### 4.1. Ordered Migration Inventory

| # | Migration Filename | Target Table | Dependencies |
|---|---|---|---|
| 1 | `database/migrations/2026_10_12_080001_create_profiles_table.php` | `profiles` | None |
| 2 | `database/migrations/2026_10_12_080002_create_categories_table.php` | `categories` | None |
| 3 | `database/migrations/2026_10_12_080003_create_tags_table.php` | `tags` | None |
| 4 | `database/migrations/2026_10_12_080004_create_skills_table.php` | `skills` | None |
| 5 | `database/migrations/2026_10_12_080005_create_projects_table.php` | `projects` | None |
| 6 | `database/migrations/2026_10_12_080006_create_articles_table.php` | `articles` | None |
| 7 | `database/migrations/2026_10_12_080007_create_educations_table.php` | `educations` | None |
| 8 | `database/migrations/2026_10_12_080008_create_experiences_table.php` | `experiences` | None |
| 9 | `database/migrations/2026_10_12_080009_create_certifications_table.php` | `certifications` | None |
| 10 | `database/migrations/2026_10_12_080010_create_project_category_table.php` | `project_category` | `projects`, `categories` |
| 11 | `database/migrations/2026_10_12_080011_create_article_category_table.php` | `article_category` | `articles`, `categories` |
| 12 | `database/migrations/2026_10_12_080012_create_article_tag_table.php` | `article_tag` | `articles`, `tags` |

---

### 4.2. Exact Blueprints and Migration Code Snippets for Worker

#### 1. `database/migrations/2026_10_12_080001_create_profiles_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('headline')->nullable();
            $table->text('about')->nullable();
            $table->string('photo')->nullable();
            $table->string('email');
            $table->json('sosmed')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
```

#### 2. `database/migrations/2026_10_12_080002_create_categories_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('type', ['article', 'project'])->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

#### 3. `database/migrations/2026_10_12_080003_create_tags_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
```

#### 4. `database/migrations/2026_10_12_080004_create_skills_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable()->index();
            $table->string('level', 50)->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
```

#### 5. `database/migrations/2026_10_12_080005_create_projects_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->json('tech_stack')->nullable();
            $table->string('image')->nullable();
            $table->string('project_url')->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
```

#### 6. `database/migrations/2026_10_12_080006_create_articles_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('cover_image')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft')->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
```

#### 7. `database/migrations/2026_10_12_080007_create_educations_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->string('institution');
            $table->string('degree');
            $table->integer('start_year');
            $table->integer('end_year')->nullable()->index();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educations');
    }
};
```

#### 8. `database/migrations/2026_10_12_080008_create_experiences_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('role');
            $table->date('start_date')->index();
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
```

#### 9. `database/migrations/2026_10_12_080009_create_certifications_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('issuer');
            $table->date('issued_at')->index();
            $table->string('image')->nullable();
            $table->string('credential_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certifications');
    }
};
```

#### 10. `database/migrations/2026_10_12_080010_create_project_category_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_category', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->primary(['project_id', 'category_id']);
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_category');
    }
};
```

#### 11. `database/migrations/2026_10_12_080011_create_article_category_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_category', function (Blueprint $table) {
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->primary(['article_id', 'category_id']);
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_category');
    }
};
```

#### 12. `database/migrations/2026_10_12_080012_create_article_tag_table.php`
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_tag', function (Blueprint $table) {
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->primary(['article_id', 'tag_id']);
            $table->index('tag_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_tag');
    }
};
```

---

### 4.3. Step-by-Step Instructions for Worker

1. **Create Migrations**:
   Write the 12 migration files above into `database/migrations/` using the exact timestamps specified (`2026_10_12_080001` to `2026_10_12_080012`).
2. **Execute Migrations in Test Runner**:
   Verify that running in-memory SQLite migrations works without any syntax or constraint errors:
   `php artisan test --filter=ExampleTest --compact`
3. **Verify Status**:
   Verify that all 12 migration classes are recognized and listed by Laravel:
   `php artisan migrate:status`
4. **Code Style Formatting**:
   Ensure Pint formatting compliance:
   `vendor/bin/pint --format agent`

---

## 5. Verification Method

To verify the migrations architecture:

1. **Ordering Check**:
   Ensure timestamps sort base tables before pivot tables:
   ```powershell
   Get-ChildItem database/migrations/ | Select-Object Name
   ```
   Verification criteria:
   - `080001` through `080009` are created before `080010`, `080011`, and `080012`.
2. **Schema & Constraint Compatibility**:
   Run in SQLite environment:
   ```powershell
   php artisan test --filter=ExampleTest --compact
   ```
   Ensures composite primary keys, check constraints on ENUMs, foreign keys, and indexes compile cleanly in SQLite.
3. **Rollback Verification**:
   When run against MySQL or SQLite database:
   ```powershell
   php artisan migrate:fresh
   php artisan migrate:rollback
   ```
   Confirms foreign key constraints permit clean forward execution and backward deletion without cascade deadlocks.
