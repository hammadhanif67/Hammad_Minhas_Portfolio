import { useEffect, useRef } from 'react';
import { useMediaQuery, useReducedMotion } from '../../hooks/useMediaQuery';

/* ═══════════════════════════════════════════════════════════════
   HERO FIELD — the tubes cursor

   `threejs-components`' tubes1 build: four glowing tubes that chase
   the pointer, with coloured lights riding along them. It bundles its
   own three.js, so this project no longer depends on `three` directly.

   Scoped to the hero for free: the build sizes itself from
   `canvas.parentNode` and keeps a ResizeObserver on it, so putting the
   canvas inside <section class="hero"> is the whole containment story.
   It also runs its own IntersectionObserver and visibilitychange
   handling, so it stops when the hero scrolls away or the tab is
   backgrounded — no help needed from us.

   Loaded from npm rather than the jsDelivr URL in the source snippet.
   A CDN <script> is a third-party origin the page has to reach on every
   visit, and the one thing this portfolio does not have any more is a
   runtime dependency on somebody else's uptime.
   ═══════════════════════════════════════════════════════════════ */

/**
 * A full spread of hues rather than one warm family.
 *
 * An earlier pass mapped these onto the site's amber, which made the
 * whole field read as a single orange wash — the variety is the point
 * of the effect, so it is back. Amber and ice are still in the set,
 * which keeps a thread to the rest of the page, and the pink, purple
 * and cyan from the original snippet do the rest.
 *
 * The two arrays are consumed differently, which is worth knowing
 * before editing them:
 *
 *   TUBE_COLORS  a gradient ramp. The build interpolates it and
 *                samples one colour per tube, so any length works and
 *                more stops just means a smoother spread.
 *
 *   LIGHT_COLORS exactly four, one per light — `setLightsColors` loops
 *                `for (i = 0; i < 4; i++)`. A fifth is silently
 *                dropped; a fourth that is missing sets a light to
 *                `undefined`.
 */
const TUBE_COLORS = ['#ff245c', '#7c4dff', '#00d4ff', '#8ab4ff', '#ffb020'];
const LIGHT_COLORS: [string, string, string, string] = [
  '#ff1744',
  '#8b5cf6',
  '#00e5ff',
  '#ffb020',
];

/**
 * The snippet shipped 180, which with additive blending blew out the
 * middle of the hero. 100 lands the field at roughly the brightness it
 * already had under the heaviest part of the scrim — which is the part
 * that read as calm rather than loud.
 */
const LIGHT_INTENSITY = 100;

/** Cheap capability check on a throwaway canvas. */
function hasWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl =
      (probe.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (probe.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const coarse = useMediaQuery('(pointer: coarse)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced || !hasWebGL()) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    /* The bundle is ~775KB with three.js inside it, and nothing above
       the fold needs it, so it arrives as its own chunk after paint. */
    void import('threejs-components/build/cursors/tubes1.min.js')
      .then(({ default: TubesCursor }) => {
        if (cancelled) return;

        const app = TubesCursor(canvas, {
          tubes: {
            colors: TUBE_COLORS,
            lights: { intensity: LIGHT_INTENSITY, colors: LIGHT_COLORS },
          },
        });

        /* The build pins both pixel-ratio bounds to exactly 2, which
           forces a 2× buffer even on a phone that never asked for one.
           A hero is ~1000px tall on a phone, so that is the difference
           between a 1.6M-pixel buffer and a 900k one, every frame. */
        if (coarse) {
          app.three.minPixelRatio = 1;
          app.three.maxPixelRatio = 1.5;
          app.three.resize();
        }

        dispose = app.dispose;
      })
      .catch(() => {
        /* The page gradient behind it is the fallback. */
      });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [reduced, coarse]);

  return <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />;
}
