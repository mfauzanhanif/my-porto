import { useCallback, useSyncExternalStore } from 'react';

export const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport matches mobile width.
 * Uses useSyncExternalStore for SSR hydration safety and tear-free updates.
 *
 * @param breakpoint Max width in pixels (default: 768)
 * @returns boolean indicating if window width is smaller than the breakpoint
 */
export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            if (typeof window === 'undefined') {
                return () => {};
            }

            const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
            mql.addEventListener('change', onStoreChange);

            return () => {
                mql.removeEventListener('change', onStoreChange);
            };
        },
        [breakpoint],
    );

    const getSnapshot = useCallback(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
    }, [breakpoint]);

    const getServerSnapshot = useCallback(() => false, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useIsMobile;
