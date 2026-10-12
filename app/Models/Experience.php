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
