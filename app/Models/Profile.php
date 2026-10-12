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
