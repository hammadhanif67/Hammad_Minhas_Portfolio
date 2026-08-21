import { useEffect, useRef } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#';

/**
 * The decoding-text effect on the role line under the headline.
 *
 * Each character gets a random frame to start scrambling and a random
 * frame to settle, so the word resolves left-to-right-ish rather than
 * all at once. Text is written to the node directly — this runs at
 * 60fps for about half a second and has no business re-rendering the
 * hero forty times to do it.
 */
export function useScramble(words: readonly string[], intervalMs: number, enabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || words.length < 2) return;

    let frame = 0;
    let index = 0;

    const scrambleTo = (next: string) => {
      const from = el.textContent ?? '';
      const len = Math.max(from.length, next.length);
      const plan = Array.from({ length: len }, (_, i) => ({
        a: from[i] ?? '',
        b: next[i] ?? '',
        start: (Math.random() * 20) | 0,
        end: ((Math.random() * 20) | 0) + 20,
      }));

      let f = 0;
      const run = () => {
        let out = '';
        let done = 0;
        for (const c of plan) {
          if (f >= c.end) {
            done += 1;
            out += c.b;
          } else if (f >= c.start) {
            out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          } else {
            out += c.a;
          }
        }
        el.textContent = out;
        f += 1;
        if (done < plan.length) frame = requestAnimationFrame(run);
      };
      cancelAnimationFrame(frame);
      run();
    };

    const timer = window.setInterval(() => {
      index = (index + 1) % words.length;
      scrambleTo(words[index]);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
    };
  }, [words, intervalMs, enabled]);

  return ref;
}
