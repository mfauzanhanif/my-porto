# Milestone 1 Explorer 2 Handoff Report: Models, Enums, Casts & Relations

## 1. Observation

Direct observations from codebase inspection, architectural documents, and authoritative specifications:

1. **Enum Specifications (`docs/DATABASE.md`, lines 19–39)**:
   - `CategoryType`: Backed string enum with cases `Article = 'article'` and `Project = 'project'`.
   - `ArticleStatus`: Backed string enum with cases `Draft = 'draft'` and `Published = 'published'`.
   - Enums are located under namespace `App\Enums`.
   - Per project PHP rules (`AGENTS.md` line 77): *"Use TitleCase for Enum keys: FavoritePerson, BestLake, Monthly."*

2. **Frontend Type Contract (`resources/js/types/portfolio.ts`, lines 1–116)**:
   - `export type ArticleStatus = 'draft' | 'published';`
   - `export type CategoryType = 'article' | 'project';`
   - `Profile`: Attributes `id`, `name`, `headline`, `about`, `photo`, `email`, `sosmed` (`Record<string, string> | null`).
   - `Skill`: Attributes `id`, `name`, `category`, `level`, `icon`, `is_featured` (`boolean`).
   - `Education`: Attributes `id`, `institution`, `degree`, `start_year` (`number`), `end_year` (`number | null`), `description`.
   - `Experience`: Attributes `id`, `company`, `role`, `start_date` (`string`), `end_date` (`string | null`), `description`.
   - `Certification`: Attributes `id`, `name`, `issuer`, `issued_at` (`string`), `image` (`string | null`), `credential_url`.
   - `Category`: Attributes `id`, `name`, `slug`, `type` (`CategoryType`).
   - `Tag`: Attributes `id`, `name`, `slug`.
   - `Article`: Attributes `id`, `title`, `slug`, `excerpt`, `content`, `cover_image`, `status` (`ArticleStatus`), `is_featured` (`boolean`), `published_at` (`string | null`), `categories?: Category[]`, `tags?: Tag[]`.
   - `Project`: Attributes `id`, `title`, `slug`, `description`, `tech_stack` (`string[] | string | null`), `image`, `project_url`, `is_featured` (`boolean`), `categories?: Category[]`.
   - `PortfolioHomeProps`: Aggregates `profile`, `skills`, `experiences`, `educations`, `certifications`, `featuredProjects`, `featuredArticles`.

3. **Database Schema & Pivot Names (`docs/DATABASE.md`, lines 43–225; `spec_miner_data_1/handoff.md`, lines 7–19)**:
   - `profiles`: columns `id`, `name`, `headline`, `about`, `photo`, `email`, `sosmed` (JSON), timestamps.
   - `categories`: columns `id`, `name`, `slug` (UNIQUE), `type` (ENUM 'article','project'), timestamps.
   - `tags`: columns `id`, `name`, `slug` (UNIQUE), timestamps.
   - `skills`: columns `id`, `name`, `category` (INDEX), `level`, `icon`, `is_featured` (BOOLEAN DEFAULT false), timestamps.
   - `projects`: columns `id`, `title`, `slug` (UNIQUE), `description` (TEXT), `tech_stack` (JSON), `image`, `project_url`, `is_featured` (BOOLEAN DEFAULT false), timestamps.
   - `articles`: columns `id`, `title`, `slug` (UNIQUE), `excerpt` (TEXT), `content` (LONGTEXT), `cover_image`, `status` (ENUM 'draft','published' DEFAULT 'draft'), `is_featured` (BOOLEAN DEFAULT false), `published_at` (TIMESTAMP NULLABLE), timestamps.
   - `educations`: columns `id`, `institution`, `degree`, `start_year` (INT), `end_year` (INT NULLABLE), `description` (TEXT), timestamps.
   - `experiences`: columns `id`, `company`, `role`, `start_date` (DATE), `end_date` (DATE NULLABLE), `description` (TEXT), timestamps.
   - `certifications`: columns `id`, `name`, `issuer`, `issued_at` (DATE), `image`, `credential_url`, timestamps.
   - Pivot table names:
     - `project_category` (`project_id`, `category_id`)
     - `article_category` (`article_id`, `category_id`)
     - `article_tag` (`article_id`, `tag_id`)

4. **Installed Framework & Dependencies (`composer.json`, lines 12–20)**:
   - `"php": "^8.3"`
   - `"laravel/framework": "^13.17"` (Laravel 13)
   - `"spatie/laravel-medialibrary": "^11.23"` (Media Library v11)
   - `"larastan/larastan": "^3.9"`
   - Media Library migration `2026_10_12_070640_create_media_table.php` is already committed in `database/migrations/`.

5. **CarbonImmutable Date Handling (`app/Providers/AppServiceProvider.php`, line 34)**:
   - Configured: `Date::use(CarbonImmutable::class);`
   - All Eloquent `date` and `datetime` casts produce `\Carbon\CarbonImmutable` instances.

6. **Existing Model Pattern (`app/Models/User.php`, lines 26–44)**:
   - Demonstrates Laravel 11/13 style attribute promotion / properties, standard casts method `protected function casts(): array`, and typed PHPDoc block annotations for static analysis.

---

## 2. Logic Chain

1. **Enum Architecture & Consistency (Obs. 1 & 2)**:
   - `CategoryType` must be backed by `string` with values `'article'` and `'project'`. TitleCase cases `Article` and `Project` strictly fulfill AGENTS.md rules. Adding helper method `label(): string` ensures clean UI representation in CMS forms.
   - `ArticleStatus` must be backed by `string` with values `'draft'` and `'published'`. TitleCase cases `Draft` and `Published` strictly fulfill rules. Adding helper methods `label(): string` and `isPublished(): bool` simplifies conditional rendering and status filtering.

2. **Casting Method Selection (Obs. 4 & 6)**:
   - Laravel 11 and 13 prioritize the `protected function casts(): array` method over the legacy `$casts = []` property.
   - The method approach supports dynamic instantiation, ensures consistency with `User.php`, and enables tight typing for static analysis (Larastan).
   - Cast mappings:
     - `Profile`: `'sosmed' => 'array'`
     - `Category`: `'type' => CategoryType::class`
     - `Skill`: `'is_featured' => 'boolean'`
     - `Project`: `'tech_stack' => 'array'`, `'is_featured' => 'boolean'`
     - `Article`: `'status' => ArticleStatus::class`, `'is_featured' => 'boolean'`, `'published_at' => 'datetime'`
     - `Education`: `'start_year' => 'integer'`, `'end_year' => 'integer'`
     - `Experience`: `'start_date' => 'date'`, `'end_date' => 'date'`
     - `Certification`: `'issued_at' => 'date'`

3. **Relationship Mapping & Explicit Pivot Parameters (Obs. 2 & 3)**:
   - In `Project` ↔ `Category`: The pivot table is named `project_category`. By default, Laravel expects alphabetical order `category_project`. Therefore, the relationship MUST explicitly supply the second argument:
     ```php
     public function categories(): BelongsToMany
     {
         return $this->belongsToMany(Category::class, 'project_category');
     }
     ```
     And conversely in `Category`:
     ```php
     public function projects(): BelongsToMany
     {
         return $this->belongsToMany(Project::class, 'project_category');
     }
     ```
   - In `Article` ↔ `Category`: The pivot table is `article_category`.
     ```php
     public function categories(): BelongsToMany
     {
         return $this->belongsToMany(Category::class, 'article_category');
     }
     ```
     And conversely in `Category`:
     ```php
     public function articles(): BelongsToMany
     {
         return $this->belongsToMany(Article::class, 'article_category');
     }
     ```
   - In `Article` ↔ `Tag`: The pivot table is `article_tag`.
     ```php
     public function tags(): BelongsToMany
     {
         return $this->belongsToMany(Tag::class, 'article_tag');
     }
     ```
     And conversely in `Tag`:
     ```php
     public function articles(): BelongsToMany
     {
         return $this->belongsToMany(Article::class, 'article_tag');
     }
     ```
   - Note on `Category`: Categories do NOT use `hasMany(Project::class)` or `hasMany(Article::class)` because neither `projects` nor `articles` contain a `category_id` foreign key column. All relations are strictly `belongsToMany` via their dedicated pivot tables.

4. **Spatie Media Library Integration (`HasMedia`, `InteractsWithMedia`) (Obs. 4)**:
   - Four models require Media Library capabilities: `Profile`, `Project`, `Article`, and `Certification`.
   - Each model implements `Spatie\MediaLibrary\HasMedia` and uses `Spatie\MediaLibrary\InteractsWithMedia`.
   - Media collections are defined in `registerMediaCollections()` with `singleFile()` on avatar/cover images.
   - Conversions are registered in `registerMediaConversions(?Media $media = null)` using `Spatie\Image\Enums\Fit::Crop` and `->nonQueued()` so transformations run synchronously without needing an active queue worker during testing, seeding, or development.

5. **Serialization Compatibility with Frontend TypeScript Interfaces (Obs. 2 & 3)**:
   - `portfolio.ts` expects raw string fields: `Profile.photo`, `Project.image`, `Article.cover_image`, `Certification.image`.
   - If media is uploaded via Spatie Media Library, the media record is stored in `media` table, but the raw model column might be null or hold an initial seeded string (e.g. `/images/profile.jpg`).
   - By creating accessors using `Illuminate\Database\Eloquent\Casts\Attribute` on these exact attribute names:
     `Attribute::make(get: fn (?string $value): ?string => $this->getFirstMediaUrl('collection_name') ?: $value)`
     the model seamlessly serializes the Spatie media URL if present, or falls back to the database column value. This provides 100% transparent backwards and forwards compatibility between database seeding, manual uploads, and Inertia serialization!

6. **Route Model Binding by Slug (Obs. 3)**:
   - Public routing (`PROJECT.md`) resolves articles via `/articles/{slug}`.
   - Defining `public function getRouteKeyName(): string { return 'slug'; }` on `Article` and `Project` enables clean implicit route-model binding across all public and admin controllers.

7. **Local Query Scopes for Fast Composition (Obs. 2 & 3)**:
   - Reusable query scopes prevent duplication:
     - `Article::published()` (`where('status', ArticleStatus::Published)`)
     - `Article::featured()` (`where('is_featured', true)`)
     - `Project::featured()` (`where('is_featured', true)`)
     - `Skill::featured()` (`where('is_featured', true)`)
     - `Skill::byCategory(string $cat)` (`where('category', $cat)`)
     - `Category::article()` (`where('type', CategoryType::Article)`)
     - `Category::project()` (`where('type', CategoryType::Project)`)
     - `Education::chronological()` (`orderByDesc('start_year')`)
     - `Experience::chronological()` (`orderByDesc('start_date')`)
     - `Certification::chronological()` (`orderByDesc('issued_at')`)

---

## 3. Caveats

1. **Explicit Pivot Table Name Requirement**:
   - `Category` ↔ `Project` pivot is named `project_category`. Failing to supply `'project_category'` to `belongsToMany()` would trigger SQL errors because Laravel's alphabetical default is `category_project`. The second parameter is strictly required.
2. **Plural Table Name on Education**:
   - `Education` maps to table `educations`. In English, "education" is uncountable, so Laravel's pluralizer might infer `education`. Explicitly declaring `protected $table = 'educations';` on the model prevents table resolution failures.
3. **Category Slug Global Uniqueness**:
   - The `categories` table has a single global unique index on `slug`. An article category and a project category cannot share identical slugs (e.g., cannot both have slug `general`).
4. **No Direct `user_id` Foreign Keys**:
   - The application is a personal portfolio with a single administrator. None of the content models (`projects`, `articles`, etc.) have a `user_id` column. `User` acts purely as the Fortify authentication principal.
5. **Read-Only Scope Compliance**:
   - Per explorer role boundaries, no files in `app/` or `database/` have been created or modified during this investigation.

---

## 4. Conclusion & Concrete Worker Instructions

The Worker agent should implement the following files in `app/Enums/` and `app/Models/` exactly as specified below.

### 4.1. Enum Definitions

#### 1. `app/Enums/CategoryType.php`
```php
<?php

namespace App\Enums;

enum CategoryType: string
{
    case Article = 'article';
    case Project = 'project';

    /**
     * Get the human-readable display label.
     */
    public function label(): string
    {
        return match ($this) {
            self::Article => 'Article',
            self::Project => 'Project',
        };
    }
}
```

#### 2. `app/Enums/ArticleStatus.php`
```php
<?php

namespace App\Enums;

enum ArticleStatus: string
{
    case Draft = 'draft';
    case Published = 'published';

    /**
     * Get the human-readable display label.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Published => 'Published',
        };
    }

    /**
     * Check if the article is published.
     */
    public function isPublished(): bool
    {
        return $this === self::Published;
    }
}
```

---

### 4.2. Model Definitions

#### 1. `app/Models/Profile.php`
```php
<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ProfileFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property string $name
 * @property string|null $headline
 * @property string|null $about
 * @property string|null $photo
 * @property string $email
 * @property array<string, string>|null $sosmed
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
class Profile extends Model implements HasMedia
{
    /** @use HasFactory<ProfileFactory> */
    use HasFactory, InteractsWithMedia;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'profiles';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'headline',
        'about',
        'photo',
        'email',
        'sosmed',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sosmed' => 'array',
        ];
    }

    /**
     * Register Spatie media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')
            ->singleFile();
    }

    /**
     * Register Spatie media conversions.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 300, 300)
            ->nonQueued();
    }

    /**
     * Accessor for photo attribute, prioritizing Spatie Media URL.
     *
     * @return Attribute<string|null, never>
     */
    protected function photo(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?string => $this->getFirstMediaUrl('photo') ?: $value,
        );
    }
}
```

#### 2. `app/Models/Category.php`
```php
<?php

namespace App\Models;

use App\Enums\CategoryType;
use Carbon\CarbonImmutable;
use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property CategoryType $type
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, Project> $projects
 * @property-read Collection<int, Article> $articles
 */
class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'type',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => CategoryType::class,
        ];
    }

    /**
     * Projects associated with this category.
     *
     * @return BelongsToMany<Project, $this>
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_category');
    }

    /**
     * Articles associated with this category.
     *
     * @return BelongsToMany<Article, $this>
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_category');
    }

    /**
     * Scope a query to only include article categories.
     *
     * @param  Builder<Category>  $query
     * @return Builder<Category>
     */
    public function scopeArticle(Builder $query): Builder
    {
        return $query->where('type', CategoryType::Article);
    }

    /**
     * Scope a query to only include project categories.
     *
     * @param  Builder<Category>  $query
     * @return Builder<Category>
     */
    public function scopeProject(Builder $query): Builder
    {
        return $query->where('type', CategoryType::Project);
    }
}
```

#### 3. `app/Models/Tag.php`
```php
<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\TagFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, Article> $articles
 */
class Tag extends Model
{
    /** @use HasFactory<TagFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tags';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Articles associated with this tag.
     *
     * @return BelongsToMany<Article, $this>
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_tag');
    }
}
```

#### 4. `app/Models/Skill.php`
```php
<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\SkillFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string|null $category
 * @property string|null $level
 * @property string|null $icon
 * @property bool $is_featured
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
class Skill extends Model
{
    /** @use HasFactory<SkillFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'skills';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'category',
        'level',
        'icon',
        'is_featured',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
        ];
    }

    /**
     * Scope a query to only include featured skills.
     *
     * @param  Builder<Skill>  $query
     * @return Builder<Skill>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to filter skills by category domain.
     *
     * @param  Builder<Skill>  $query
     * @param  string  $category
     * @return Builder<Skill>
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }
}
```

#### 5. `app/Models/Project.php`
```php
<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property array<string>|null $tech_stack
 * @property string|null $image
 * @property string|null $project_url
 * @property bool $is_featured
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, Category> $categories
 */
class Project extends Model implements HasMedia
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory, InteractsWithMedia;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'projects';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'tech_stack',
        'image',
        'project_url',
        'is_featured',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tech_stack' => 'array',
            'is_featured' => 'boolean',
        ];
    }

    /**
     * Route model binding key name.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Register Spatie media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile();
    }

    /**
     * Register Spatie media conversions.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 600, 400)
            ->nonQueued();
    }

    /**
     * Accessor for image attribute, prioritizing Spatie Media URL.
     *
     * @return Attribute<string|null, never>
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?string => $this->getFirstMediaUrl('image') ?: $value,
        );
    }

    /**
     * Categories associated with this project.
     *
     * @return BelongsToMany<Category, $this>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'project_category');
    }

    /**
     * Scope a query to only include featured projects.
     *
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }
}
```

#### 6. `app/Models/Article.php`
```php
<?php

namespace App\Models;

use App\Enums\ArticleStatus;
use Carbon\CarbonImmutable;
use Database\Factories\ArticleFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $excerpt
 * @property string $content
 * @property string|null $cover_image
 * @property ArticleStatus $status
 * @property bool $is_featured
 * @property CarbonImmutable|null $published_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, Category> $categories
 * @property-read Collection<int, Tag> $tags
 */
class Article extends Model implements HasMedia
{
    /** @use HasFactory<ArticleFactory> */
    use HasFactory, InteractsWithMedia;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'articles';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'status',
        'is_featured',
        'published_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ArticleStatus::class,
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Route model binding key name.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Register Spatie media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover_image')
            ->singleFile();

        $this->addMediaCollection('content_images');
    }

    /**
     * Register Spatie media conversions.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 800, 450)
            ->nonQueued();
    }

    /**
     * Accessor for cover_image attribute, prioritizing Spatie Media URL.
     *
     * @return Attribute<string|null, never>
     */
    protected function coverImage(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?string => $this->getFirstMediaUrl('cover_image') ?: $value,
        );
    }

    /**
     * Categories associated with this article.
     *
     * @return BelongsToMany<Category, $this>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'article_category');
    }

    /**
     * Tags associated with this article.
     *
     * @return BelongsToMany<Tag, $this>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'article_tag');
    }

    /**
     * Scope a query to only include published articles.
     *
     * @param  Builder<Article>  $query
     * @return Builder<Article>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ArticleStatus::Published);
    }

    /**
     * Scope a query to only include featured articles.
     *
     * @param  Builder<Article>  $query
     * @return Builder<Article>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Check if article is published.
     */
    public function isPublished(): bool
    {
        return $this->status === ArticleStatus::Published;
    }
}
```

#### 7. `app/Models/Education.php`
```php
<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\EducationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $institution
 * @property string $degree
 * @property int $start_year
 * @property int|null $end_year
 * @property string|null $description
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
class Education extends Model
{
    /** @use HasFactory<EducationFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'educations';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'institution',
        'degree',
        'start_year',
        'end_year',
        'description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_year' => 'integer',
            'end_year' => 'integer',
        ];
    }

    /**
     * Scope a query to order records chronologically descending.
     *
     * @param  Builder<Education>  $query
     * @return Builder<Education>
     */
    public function scopeChronological(Builder $query): Builder
    {
        return $query->orderByDesc('start_year');
    }
}
```

#### 8. `app/Models/Experience.php`
```php
<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ExperienceFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $company
 * @property string $role
 * @property CarbonImmutable $start_date
 * @property CarbonImmutable|null $end_date
 * @property string|null $description
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
class Experience extends Model
{
    /** @use HasFactory<ExperienceFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'experiences';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'company',
        'role',
        'start_date',
        'end_date',
        'description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * Scope a query to order records chronologically descending.
     *
     * @param  Builder<Experience>  $query
     * @return Builder<Experience>
     */
    public function scopeChronological(Builder $query): Builder
    {
        return $query->orderByDesc('start_date');
    }

    /**
     * Determine if this experience represents the current active employment.
     */
    public function isCurrent(): bool
    {
        return $this->end_date === null;
    }
}
```

#### 9. `app/Models/Certification.php`
```php
<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\CertificationFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property string $name
 * @property string $issuer
 * @property CarbonImmutable $issued_at
 * @property string|null $image
 * @property string|null $credential_url
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
class Certification extends Model implements HasMedia
{
    /** @use HasFactory<CertificationFactory> */
    use HasFactory, InteractsWithMedia;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'certifications';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'issuer',
        'issued_at',
        'image',
        'credential_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'issued_at' => 'date',
        ];
    }

    /**
     * Register Spatie media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile();
    }

    /**
     * Register Spatie media conversions.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 400, 300)
            ->nonQueued();
    }

    /**
     * Accessor for image attribute, prioritizing Spatie Media URL.
     *
     * @return Attribute<string|null, never>
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?string => $this->getFirstMediaUrl('image') ?: $value,
        );
    }

    /**
     * Scope a query to order records chronologically descending.
     *
     * @param  Builder<Certification>  $query
     * @return Builder<Certification>
     */
    public function scopeChronological(Builder $query): Builder
    {
        return $query->orderByDesc('issued_at');
    }
}
```

---

### 4.3. Factory Blueprint Recommendations for Worker

When creating models, corresponding factories should be generated in `database/factories/`:
1. `ProfileFactory`:
   - `name`: fake()->name()
   - `headline`: fake()->jobTitle()
   - `about`: fake()->paragraph()
   - `email`: fake()->safeEmail()
   - `photo`: null
   - `sosmed`: `['github' => 'https://github.com/example', 'linkedin' => 'https://linkedin.com/in/example']`
2. `CategoryFactory`:
   - `name`: fake()->unique()->word()
   - `slug`: `Str::slug($name)`
   - `type`: `fake()->randomElement([CategoryType::Article, CategoryType::Project])`
3. `TagFactory`:
   - `name`: fake()->unique()->word()
   - `slug`: `Str::slug($name)`
4. `SkillFactory`:
   - `name`: fake()->word()
   - `category`: `fake()->randomElement(['Backend', 'Frontend', 'Tools'])`
   - `level`: 'Advanced'
   - `icon`: 'code'
   - `is_featured`: fake()->boolean()
5. `ProjectFactory`:
   - `title`: fake()->sentence(3)
   - `slug`: `Str::slug($title)`
   - `description`: fake()->paragraph()
   - `tech_stack`: `['Laravel', 'React', 'Tailwind']`
   - `image`: null
   - `project_url`: fake()->url()
   - `is_featured`: fake()->boolean()
6. `ArticleFactory`:
   - `title`: fake()->sentence(5)
   - `slug`: `Str::slug($title)`
   - `excerpt`: fake()->sentence(10)
   - `content`: '<p>' . fake()->paragraphs(3, true) . '</p>'
   - `cover_image`: null
   - `status`: `fake()->randomElement([ArticleStatus::Draft, ArticleStatus::Published])`
   - `is_featured`: fake()->boolean()
   - `published_at`: now()
7. `EducationFactory`:
   - `institution`: fake()->company() . ' University'
   - `degree`: 'Bachelor of Computer Science'
   - `start_year`: 2019
   - `end_year`: 2023
   - `description`: fake()->sentence()
8. `ExperienceFactory`:
   - `company`: fake()->company()
   - `role`: fake()->jobTitle()
   - `start_date`: '2022-01-01'
   - `end_date`: '2023-12-31'
   - `description`: fake()->paragraph()
9. `CertificationFactory`:
   - `name`: fake()->sentence(3)
   - `issuer`: fake()->company()
   - `issued_at`: '2024-01-15'
   - `image`: null
   - `credential_url`: fake()->url()

---

## 5. Verification Method

To independently verify this specification and any downstream implementation:

1. **Syntax and Code Quality Verification**:
   - Run Pint formatter: `vendor/bin/pint --format agent`
   - Run static analysis: `composer types:check` (or `vendor/bin/phpstan analyse`)

2. **Model Instantiation and Casts Verification via Tinker**:
   - `php artisan tinker --execute 'echo App\Enums\CategoryType::Article->value;'` (expects `'article'`)
   - `php artisan tinker --execute 'echo App\Enums\ArticleStatus::Published->value;'` (expects `'published'`)
   - Verify casts on fresh model instances:
     - `php artisan tinker --execute '$c = new App\Models\Category(["type" => "article"]); echo get_class($c->type);'` (expects `App\Enums\CategoryType`)
     - `php artisan tinker --execute '$a = new App\Models\Article(["status" => "published"]); echo get_class($a->status);'` (expects `App\Enums\ArticleStatus`)
     - `php artisan tinker --execute '$p = new App\Models\Project(["tech_stack" => ["PHP"]]); echo is_array($p->tech_stack) ? "array" : "not array";'` (expects `'array'`)

3. **Relationship Verification via Tinker (after migrations and seeding)**:
   - Check pivot linkage:
     - `php artisan tinker --execute '$p = App\Models\Project::with("categories")->first(); echo $p?->categories?->count();'`
     - `php artisan tinker --execute '$a = App\Models\Article::with(["categories", "tags"])->first(); echo $a?->categories?->count();'`

4. **Spatie Media Library Interface Verification**:
   - Verify `implements Spatie\MediaLibrary\HasMedia`:
     - `php artisan tinker --execute 'echo (new App\Models\Profile) instanceof Spatie\MediaLibrary\HasMedia ? "true" : "false";'` (expects `'true'`)
     - `php artisan tinker --execute 'echo (new App\Models\Project) instanceof Spatie\MediaLibrary\HasMedia ? "true" : "false";'` (expects `'true'`)
     - `php artisan tinker --execute 'echo (new App\Models\Article) instanceof Spatie\MediaLibrary\HasMedia ? "true" : "false";'` (expects `'true'`)
     - `php artisan tinker --execute 'echo (new App\Models\Certification) instanceof Spatie\MediaLibrary\HasMedia ? "true" : "false";'` (expects `'true'`)

5. **Invalidation Conditions**:
   - If `Category` attempts to define `hasMany(Project::class)` or `hasMany(Article::class)` without foreign key columns on parent tables, query execution will fail with `Unknown column 'category_id'`.
   - If `Project::categories()` omits `'project_category'`, Eloquent will query non-existent table `category_project`.
