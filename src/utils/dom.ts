import type { CSSProperties } from 'react';

/** Joins class names, dropping anything falsy. */
export const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');

/** 3 → "03". Used by the carousel counter. */
export const pad2 = (n: number): string => String(n).padStart(2, '0');

/**
 * React's CSSProperties has no slot for custom properties, so this is
 * the one cast the project makes — narrowed to exactly that use.
 */
export const cssVars = (vars: Record<`--${string}`, string | number>): CSSProperties =>
  vars as CSSProperties;

/**
 * Scrolls an in-page anchor into view and hands it keyboard focus, so
 * the next Tab continues from the new section rather than from the
 * link that was just clicked. `scroll-margin-top` on the target keeps
 * it clear of the floating nav.
 */
export function scrollToSection(id: string, smooth: boolean): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });

  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return true;
}

/** Attributes every outbound link needs, in one place. */
export const externalLink = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;
