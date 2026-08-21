import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a media query. `useSyncExternalStore` gives the right
 * answer on the very first render rather than after an effect, so the
 * UI never flashes the wrong branch.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * True when the visitor has asked their OS to reduce motion. Every
 * animation in the app reads this: the WebGL field never boots, the
 * carousel stops advancing on its own, and the role line stops
 * scrambling — all of them still work, they just stop moving.
 */
export const useReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

/** True on a device with a real cursor, matching the CSS hover gates. */
export const useHasHover = (): boolean => useMediaQuery('(hover: hover) and (pointer: fine)');
