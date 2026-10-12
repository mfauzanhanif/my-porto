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
