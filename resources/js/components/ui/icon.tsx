import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IconProps {
    iconNode?: LucideIcon | null;
    className?: string;
}

function Icon({ iconNode: IconComponent, className }: IconProps) {
    if (!IconComponent) {
        return null;
    }

    return (
        <IconComponent
            className={cn(
                'size-4 shrink-0 text-foreground [&_svg]:pointer-events-none',
                className,
            )}
        />
    );
}

export { Icon };
