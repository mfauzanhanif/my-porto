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
