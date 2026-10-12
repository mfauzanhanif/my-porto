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
