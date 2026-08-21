import { useEffect, useRef, useState } from 'react';

/** Progress ticks at roughly this rate, matching the original. */
const TICK_MS = 85;
/** Longest the loader is allowed to hold the screen. */
const FAILSAFE_MS = 3400;
/** Beat between hitting 100% and fading out. */
const SETTLE_MS = 300;

interface LoaderProps {
  /** Fires once, when the loader starts fading — arms the reveals. */
  onDone: () => void;
}

/**
 * The opening progress screen.
 *
 * Progress is written straight to the DOM: this ticks twelve times a
 * second for a second and a half, and none of it belongs in React
 * state where it would re-render the whole tree for a number nothing
 * else reads.
 *
 * Marked aria-hidden throughout — the real page is already mounted
 * underneath, so a screen reader should be reading that rather than a
 * counter that means nothing.
 */
export function Loader({ onDone }: LoaderProps) {
  const [done, setDone] = useState(false);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLParagraphElement>(null);

  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    let progress = 0;
    let closed = false;
    let settle = 0;

    const shut = () => {
      if (closed) return;
      closed = true;
      setDone(true);
      onDoneRef.current();
    };

    const tick = window.setInterval(() => {
      progress = Math.min(progress + Math.random() * 15, 100);

      if (fillRef.current) fillRef.current.style.width = `${progress}%`;
      if (numRef.current) numRef.current.textContent = String(Math.floor(progress)).padStart(3, '0');

      if (progress >= 100) {
        window.clearInterval(tick);
        settle = window.setTimeout(shut, SETTLE_MS);
      }
    }, TICK_MS);

    const failsafe = window.setTimeout(shut, FAILSAFE_MS);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(settle);
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div className="loader" data-done={done ? 'true' : 'false'} aria-hidden="true">
      <p className="ld-name">
        <b>const</b> dev <i>=</i> &quot;HAMMAD&quot;<b>;</b>
      </p>
      <div className="ld-track">
        <div className="ld-fill" ref={fillRef} />
      </div>
      <p className="ld-num" ref={numRef}>
        000
      </p>
    </div>
  );
}
