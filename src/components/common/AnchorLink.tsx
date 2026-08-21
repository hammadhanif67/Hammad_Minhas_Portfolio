import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { scrollToSection } from '../../utils/dom';

interface AnchorLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Section id without the `#`. */
  to: string;
  children: ReactNode;
  /** Runs after a successful in-page jump — the drawer closes on this. */
  onNavigate?: () => void;
}

/**
 * Every in-page jump on the site.
 *
 * The original bound a click handler to `a[href^="#"]` across the whole
 * document at startup, which quietly missed anything added later. As a
 * component the behaviour travels with the link instead.
 *
 * The href stays real, so middle-click, ctrl-click and "copy link
 * address" all keep working — the handler bails out on those rather
 * than swallowing them.
 */
export function AnchorLink({ to, children, onNavigate, onClick, ...rest }: AnchorLinkProps) {
  const reduced = useReducedMotion();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    if (scrollToSection(to, !reduced)) {
      e.preventDefault();
      onNavigate?.();
    }
  };

  return (
    <a href={`#${to}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
