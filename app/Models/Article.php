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
