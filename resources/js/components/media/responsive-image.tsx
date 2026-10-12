import * as React from 'react';

import { cn } from '@/lib/utils';

interface ResponsiveImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** The primary image URL (fallback src) */
    src: string;
    /** Srcset string for responsive images */
    srcSet?: string;
    /** Sizes attribute for responsive rendering */
    sizes?: string;
    /** Alt text for accessibility */
    alt: string;
    /** Intrinsic width of the image */
    width?: number;
    /** Intrinsic height of the image */
    height?: number;
    /** Lazy loading behavior */
    loading?: 'lazy' | 'eager';
}

function ResponsiveImage({
    src,
    srcSet,
    sizes,
    alt,
    width,
    height,
    loading = 'lazy',
    className,
    ...props
}: ResponsiveImageProps) {
    return (
        <img
            data-slot="responsive-image"
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            className={cn(
                'rounded-base border-2 border-border object-cover',
                className,
            )}
            {...props}
        />
    );
}

export { ResponsiveImage };
export type { ResponsiveImageProps };
