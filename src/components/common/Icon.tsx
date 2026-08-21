import type { IconName, IconSize } from '../../types';
import { cx } from '../../utils/dom';

interface IconProps {
  name: IconName;
  /** Maps to the `.i-<n>` classes in utilities.css. 20 is the base `.i`. */
  size?: IconSize;
  className?: string;
}

/**
 * Points a `<use>` at the sprite rendered once at the root of the app.
 * Always decorative: every icon on this page sits next to a text label
 * or inside a control that carries its own accessible name, so exposing
 * it to a screen reader would only add noise.
 */
export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg className={cx('i', size !== 20 && `i-${size}`, className)} aria-hidden="true" focusable="false">
      <use href={`#ic-${name}`} />
    </svg>
  );
}
