import { useEffect, useRef, useState } from 'react';

/** Fraction of the viewport height at which a section takes over. */
const ACTIVE_LINE = 0.35;
/** Scroll distance after which the nav pill tightens up. */
const STUCK_AT = 30;

/**
 * Drives the three things the page chrome needs from the scroll
 * position: the progress bar's width, whether the nav is "stuck", and
 * which section the nav should be highlighting.
 *
 * The bar is written through a ref because it changes every frame;
 * the other two are state because they change a handful of times per
 * page and React bails out when the value is unchanged.
 */
export function useScrollChrome(sectionIds: readonly string[]) {
  const barRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let queued = false;

    const read = () => {
      queued = false;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${progress}%`;

      setStuck(window.scrollY > STUCK_AT);

      const line = window.innerHeight * ACTIVE_LINE;
      let current = 0;
      sectionIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActiveId(sectionIds[current] ?? '');
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    read();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds]);

  return { barRef, activeId, stuck };
}
