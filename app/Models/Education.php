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
