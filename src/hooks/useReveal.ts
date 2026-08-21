import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { REVEAL_OPTIONS, observeOnce } from '../utils/intersect';

/**
 * Reveal is armed once the loader starts fading.
 *
 * In the original this observer began watching the moment the script
 * ran, so everything above the fold had already finished revealing
 * behind the loading screen — the staggered transition-delays on the
 * hero (.08s, .14s, .2s, .26s, .32s) were authored but never seen.
 * Holding the observer until the loader lifts costs nothing and lets
 * that stagger play where the visitor can watch it.
 */
export const RevealArmedContext = createContext(true);

/**
 * Spread the result onto any element that also carries the `rv` class:
 *
 *   const head = useReveal<HTMLDivElement>(0.1);
 *   <div className="sec-head rv" {...head}>…</div>
 *
 * `immediate` skips the scroll observer entirely: the element reveals
 * as soon as the loader lifts, wherever it happens to sit.
 *
 * The hero uses it. Waiting for an intersection is right for a section
 * the visitor scrolls down to, and wrong for the one they land on — a
 * tall hero pushes its own buttons and stats below the fold on a phone,
 * so with the observer they stayed invisible until you scrolled, which
 * is not something a first-time visitor knows to do. They arrive with
 * the page now, keeping their stagger.
 */
export function useReveal<T extends HTMLElement>(delaySeconds?: number, immediate = false) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  const armed = useContext(RevealArmedContext);

  useEffect(() => {
    if (!armed || shown) return;

    if (immediate) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setShown(true), REVEAL_OPTIONS);
  }, [armed, shown, immediate]);

  return {
    ref,
    ...(shown ? ({ 'data-in': 'true' } as const) : null),
    ...(delaySeconds ? { style: { transitionDelay: `${delaySeconds}s` } } : null),
  };
}
