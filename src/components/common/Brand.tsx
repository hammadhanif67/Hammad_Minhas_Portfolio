import { profile } from '../../data/site';
import { AnchorLink } from './AnchorLink';

/**
 * The logo and the name, linked back to the top.
 *
 * Used identically in the nav and the footer. The image is `alt=""`
 * on purpose: the words beside it already give the link its accessible
 * name, and a second "Hammad Minhas" from the image would make a
 * screen reader read the same thing twice.
 *
 * `width`/`height` are the file's intrinsic pixels, so the row reserves
 * its space before the PNG decodes and the nav never reflows.
 */
export function Brand() {
  return (
    <AnchorLink to="home" className="brand">
      <img className="brand-mark" src="/brand/logo.png" alt="" width={125} height={128} decoding="async" />
      <span className="brand-txt">{profile.name}</span>
    </AnchorLink>
  );
}
