import { useId } from 'react';

import { cn } from '@/lib/utils';

interface PlaceholderPatternProps {
    className?: string;
}

function PlaceholderPattern({ className }: PlaceholderPatternProps) {
    const patternId = useId();

    return (
        <svg className={cn('text-border', className)} fill="none">
            <defs>
                <pattern
                    id={patternId}
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </pattern>
            </defs>
            <rect
                stroke="none"
                fill={`url(#${patternId})`}
                width="100%"
                height="100%"
            />
        </svg>
    );
}

export { PlaceholderPattern };
