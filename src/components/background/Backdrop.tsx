/**
 * The two fixed layers behind the whole page.
 *
 * The animated WebGL field is no longer one of them — it belongs to
 * the hero now and is mounted inside that section, so it ends where
 * the hero ends. What remains here is what every section shares: the
 * base gradient and the grain over it.
 *
 * The gradient is painted unconditionally. A device without WebGL, a
 * visitor with motion reduced and a slow three.js chunk all land on it
 * rather than on a flat black page.
 */
export function Backdrop() {
  return (
    <>
      <div className="gl-fallback" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
