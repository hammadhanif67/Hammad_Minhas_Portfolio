import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, TouchEvent as ReactTouchEvent } from 'react';
import { cssVars } from '../utils/dom';
import { useDocumentHidden } from './useDocumentHidden';

/** How long a card holds the front of the stack. */
export const SLIDE_MS = 5000;
/** Horizontal travel a touch needs before it counts as a swipe. */
const SWIPE_MIN = 48;

/**
 * Depth ladder — index is the absolute distance from the active card.
 *
 * The horizontal offsets are not here: they live in carousel.css as
 * --x-1 and --x-2, expressed as a percentage of each card's own width,
 * so the browser rescales them at every viewport instead of JS
 * recomputing pixels on a resize listener.
 */
const LADDER = [
  { z: 0, ry: 0, s: 1, o: 1 },
  { z: -200, ry: 26, s: 0.855, o: 0.62 },
  { z: -380, ry: 34, s: 0.715, o: 0.24 },
] as const;

/**
 * Distance from the active card measured the short way around the
 * ring, so advancing from the last card to the first slides forward
 * instead of rewinding through the whole stack.
 */
export function shortestOffset(index: number, active: number, count: number): number {
  let offset = index - active;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
}

/** Turns an offset into the custom properties `.card` reads. */
export function cardStyle(offset: number): CSSProperties {
  const distance = Math.abs(offset);
  const rung = LADDER[Math.min(distance, LADDER.length - 1)];
  const sign = offset < 0 ? -1 : 1;
  const rail = `var(--x-${Math.min(distance, LADDER.length - 1)})`;

  return cssVars({
    '--x': distance === 0 ? '0%' : sign < 0 ? `calc(${rail} * -1)` : rail,
    '--z': `${rung.z}px`,
    '--ry': `${-rung.ry * sign}deg`,
    '--s': rung.s,
    '--o': distance > 2 ? 0 : rung.o,
    '--zi': 10 - distance,
    '--pe': offset === 0 ? 'auto' : 'none',
  });
}

interface Options {
  count: number;
  /**
   * False below the coverflow breakpoint, where the section renders as
   * a plain stack. Nothing rotates, so nothing should be listening:
   * no timer, and no window-level arrow keys either.
   */
  enabled: boolean;
  /** False when motion is reduced: manual control only, no timer. */
  autoplay: boolean;
}

export function useCarousel({ count, enabled, autoplay }: Options) {
  const [active, setActive] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  /** Bumped on every change so the progress bar can remount and replay. */
  const [runId, setRunId] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const touch = useRef({ x: 0, y: 0, live: false });

  const hidden = useDocumentHidden();
  const paused = hoverPaused || hidden;

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);
      setRunId((n) => n + 1);
    },
    [count],
  );

  const step = useCallback(
    (delta: number) => {
      setActive((prev) => (((prev + delta) % count) + count) % count);
      setRunId((n) => n + 1);
    },
    [count],
  );

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  /* ── Autoplay ────────────────────────────────────────────────────
     A timeout keyed on runId rather than a free-running interval: in
     the original the interval kept its own phase while the progress
     bar was restarted independently, so after a hover the bar and the
     actual swap drifted apart. One timer now drives both. */
  useEffect(() => {
    if (!enabled || !autoplay || paused) return;
    const id = window.setTimeout(next, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [enabled, autoplay, paused, runId, next]);

  /* ── Keyboard ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!enabled) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Only while the carousel is actually on screen.
      if (!rect.height || rect.bottom < 0 || rect.top > window.innerHeight) return;

      step(e.key === 'ArrowLeft' ? -1 : 1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, step]);

  /* ── Touch ────────────────────────────────────────────────────── */
  const onTouchStart = useCallback((e: ReactTouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, live: true };
  }, []);

  const onTouchEnd = useCallback(
    (e: ReactTouchEvent<HTMLElement>) => {
      if (!touch.current.live) return;
      touch.current.live = false;

      const t = e.changedTouches[0];
      const dx = t.clientX - touch.current.x;
      const dy = t.clientY - touch.current.y;

      // Horizontal intent only, so vertical page scrolling still works.
      if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    },
    [step],
  );

  return {
    active,
    paused,
    runId,
    rootRef,
    goTo,
    next,
    prev,
    setHoverPaused,
    stageHandlers: { onTouchStart, onTouchEnd },
  };
}
