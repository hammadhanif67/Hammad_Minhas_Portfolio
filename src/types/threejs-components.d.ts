/**
 * Minimal typings for the one build we import.
 *
 * `threejs-components` ships no `.d.ts`, so this declares exactly the
 * surface HeroField touches — enough that a typo is a build error
 * rather than a blank hero. Everything here was read off the shipped
 * bundle, not guessed.
 */
declare module 'threejs-components/build/cursors/tubes1.min.js' {
  interface TubesLightsOptions {
    intensity?: number;
    /**
     * Exactly four — `setLightsColors` loops `for (i = 0; i < 4; i++)`.
     * The tuple makes a short array a build error instead of a light
     * whose colour is set to `undefined` at runtime.
     */
    colors?: [string, string, string, string];
  }

  interface TubesOptions {
    /** A gradient ramp, sampled once per tube. Any length. */
    colors?: string[];
    lights?: TubesLightsOptions;
  }

  interface TubesCursorOptions {
    tubes?: TubesOptions;
    /** Idle orbit the tubes trace while the pointer is elsewhere. */
    sleepRadiusX?: number;
    sleepRadiusY?: number;
    sleepTimeScale1?: number;
    sleepTimeScale2?: number;
    bloom?: { strength?: number; radius?: number; threshold?: number };
  }

  interface TubesCursorApp {
    /**
     * The renderer wrapper. It sizes itself from `canvas.parentNode`
     * and pins both pixel-ratio bounds to 2; both are writable, and
     * `resize()` applies a change.
     */
    three: {
      maxPixelRatio: number;
      minPixelRatio: number;
      resize: () => void;
    };
    tubes: {
      setColors: (colors: string[]) => void;
      setLightsColors: (colors: string[]) => void;
    };
    dispose: () => void;
  }

  export default function TubesCursor(
    canvas: HTMLCanvasElement,
    options?: TubesCursorOptions,
  ): TubesCursorApp;
}
