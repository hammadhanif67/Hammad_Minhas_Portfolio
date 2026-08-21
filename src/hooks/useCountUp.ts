import { useEffect, useRef } from 'react';
import { COUNT_OPTIONS, observeOnce } from '../utils/intersect';

const DURATION = 1100;
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

/**
 * Counts a number up from zero the first time it scrolls into view.
 *
 * The value is written straight to the node rather than held in state:
 * a 1.1s count at 60fps would otherwise be ~66 renders of the hero for
 * a single digit changing.
 *
 * With motion reduced the final number is printed immediately — the
 * information survives, only the animation goes.
 */
export function useCountUp(to: number, animate: boolean) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!animate) {
      el.textContent = String(to);
      return;
    }

    let frame = 0;
    const stop = observeOnce(
      el,
      () => {
        let start = 0;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / DURATION, 1);
          el.textContent = String(Math.floor(easeOutCubic(p) * to));
          if (p < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      COUNT_OPTIONS,
    );

    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, [to, animate]);

  return ref;
}
