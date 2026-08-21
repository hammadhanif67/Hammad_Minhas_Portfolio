import { marqueeItems } from '../../data/hero';
import { Icon } from '../common/Icon';

/**
 * The scrolling stack strip.
 *
 * Two identical sets side by side, translated by exactly -50%, so the
 * second set arrives where the first began and the loop has no seam.
 * The duplicate is aria-hidden — a screen reader should hear the list
 * once, not twice.
 */
export function Marquee() {
  const set = (duplicate: boolean) => (
    <div className="marq-set" aria-hidden={duplicate || undefined}>
      {marqueeItems.map((item) => (
        <span className="marq-item" key={item.label}>
          <Icon name={item.icon} size={18} />
          {item.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="marq" aria-label="Technologies I work with">
      <div className="marq-track">
        {set(false)}
        {set(true)}
      </div>
    </div>
  );
}
