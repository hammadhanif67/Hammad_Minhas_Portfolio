import { useEffect } from 'react';

/**
 * Freezes page scrolling while an overlay owns the screen, and puts
 * the previous value back rather than assuming it was empty.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
