/* ═══════════════════════════════════════════════════════════════
   A pool of IntersectionObservers, one per distinct set of options.

   Roughly forty elements on this page want to know when they come
   into view. Giving each its own observer would mean forty separate
   callbacks for the browser to service on every scroll; sharing one
   per options set means two.
   ═══════════════════════════════════════════════════════════════ */

type Entry = { fire: () => void };

const pools = new Map<string, { io: IntersectionObserver; targets: Map<Element, Entry> }>();

function poolFor(options: IntersectionObserverInit) {
  const key = `${options.root ? 'r' : ''}|${options.rootMargin ?? ''}|${String(options.threshold ?? '')}`;
  let pool = pools.get(key);
  if (pool) return pool;

  const targets = new Map<Element, Entry>();
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = targets.get(entry.target);
      if (!target) continue;
      targets.delete(entry.target);
      io.unobserve(entry.target);
      target.fire();
    }
  }, options);

  pool = { io, targets };
  pools.set(key, pool);
  return pool;
}

/**
 * Calls `fire` the first time `el` intersects, then stops watching it.
 * Returns an unsubscribe for the case where the element unmounts
 * before it is ever seen.
 */
export function observeOnce(
  el: Element,
  fire: () => void,
  options: IntersectionObserverInit,
): () => void {
  const { io, targets } = poolFor(options);
  targets.set(el, { fire });
  io.observe(el);

  return () => {
    if (!targets.delete(el)) return;
    io.unobserve(el);
  };
}

/** Reveal animations: matches the original's threshold and margin. */
export const REVEAL_OPTIONS: IntersectionObserverInit = {
  threshold: 0.14,
  rootMargin: '0px 0px -6% 0px',
};

/** Count-up: waits until the stat is properly on screen. */
export const COUNT_OPTIONS: IntersectionObserverInit = { threshold: 0.6 };
