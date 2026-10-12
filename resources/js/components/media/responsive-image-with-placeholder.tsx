import * as React from 'react';
import { useCallback, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { PlaceholderSvg } from './placeholder-svg';

interface ResponsiveImageWithPlaceholderProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** The primary image URL (fallback src) */
    src: string;
    /** Srcset string for responsive images */
    srcSet?: string;
    /** Alt text for accessibility */
    alt: string;
    /** Intrinsic width of the image */
    width: number;
    /** Intrinsic height of the image */
    height: number;
    /** Base64-encoded tiny placeholder image */
    tinyImageBase64?: string;
    /** Lazy loading behavior */
    loading?: 'lazy' | 'eager';
}

function ResponsiveImageWithPlaceholder({
    src,
    srcSet,
    alt,
    width,
    height,
    tinyImageBase64,
    loading = 'lazy',
    className,
    ...props
}: ResponsiveImageWithPlaceholderProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleLoad = useCallback(() => {
        const img = imgRef.current;
        if (!img) {
            return;
        }

        const size = img.getBoundingClientRect().width;
        if (size) {
            img.sizes = `${Math.ceil((size / window.innerWidth) * 100)}vw`;
        }

        setIsLoaded(true);
    }, []);

    return (
        <div
            data-slot="responsive-image-with-placeholder"
            className={cn('relative overflow-hidden', className)}
        >
            {!isLoaded && tinyImageBase64 && (
                <PlaceholderSvg
                    originalWidth={width}
                    originalHeight={height}
                    tinyImageBase64={tinyImageBase64}
                    className="absolute inset-0 size-full border-0"
                />
            )}
            <img
                ref={imgRef}
                src={src}
                srcSet={srcSet}
                sizes="1px"
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                onLoad={handleLoad}
                className={cn(
                    'rounded-base border-2 border-border object-cover transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                )}
                {...props}
            />
        </div>
    );
}

export { ResponsiveImageWithPlaceholder };
export type { ResponsiveImageWithPlaceholderProps };
