import * as React from 'react';

import { cn } from '@/lib/utils';

interface MediaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** The URL of the image */
    src: string;
    /** Alt text for accessibility */
    alt: string;
    /** Optional conversion suffix for media library */
    conversion?: string;
    /** Lazy loading behavior */
    loading?: 'lazy' | 'eager';
}

function MediaImage({
    src,
    alt,
    conversion,
    loading = 'lazy',
    className,
    ...props
}: MediaImageProps) {
    return (
        <img
            data-slot="media-image"
            src={src}
            alt={alt}
            loading={loading}
            className={cn(
                'rounded-base border-2 border-border object-cover',
                className,
            )}
            {...props}
        />
    );
}

export { MediaImage };
export type { MediaImageProps };
