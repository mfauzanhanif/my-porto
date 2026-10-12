import * as React from 'react';

import { cn } from '@/lib/utils';

interface PlaceholderSvgProps extends React.SVGAttributes<SVGElement> {
    /** Original image width for viewBox */
    originalWidth: number;
    /** Original image height for viewBox */
    originalHeight: number;
    /** Base64-encoded tiny placeholder image */
    tinyImageBase64?: string;
}

function PlaceholderSvg({
    originalWidth,
    originalHeight,
    tinyImageBase64,
    className,
    ...props
}: PlaceholderSvgProps) {
    return (
        <svg
            data-slot="placeholder-svg"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlSpace="preserve"
            x="0"
            y="0"
            viewBox={`0 0 ${originalWidth} ${originalHeight}`}
            className={cn('rounded-base border-2 border-border', className)}
            {...props}
        >
            {tinyImageBase64 ? (
                <image
                    width={originalWidth}
                    height={originalHeight}
                    xlinkHref={tinyImageBase64}
                />
            ) : (
                <rect
                    width={originalWidth}
                    height={originalHeight}
                    fill="var(--secondary-background, #f5f5f5)"
                />
            )}
        </svg>
    );
}

export { PlaceholderSvg };
export type { PlaceholderSvgProps };
