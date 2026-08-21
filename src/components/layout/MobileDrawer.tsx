import { useEffect, useRef } from 'react';
import type { NavItem } from '../../types';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { AnchorLink } from '../common/AnchorLink';
import { Icon } from '../common/Icon';

interface MobileDrawerProps {
  items: readonly NavItem[];
  activeId: string;
  open: boolean;
  onClose: () => void;
}

/**
 * The full-screen menu below 980px.
 *
 * Kept mounted so the fade works in both directions; `inert` while
 * closed is what stops a hidden-but-present menu from collecting Tab
 * stops, which the original had no answer for.
 */
export function MobileDrawer({ items, activeId, open, onClose }: MobileDrawerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useFocusTrap(ref, open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      id="mobile-drawer"
      className="drawer"
      ref={ref}
      data-open={open ? 'true' : 'false'}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
    >
      <button type="button" className="drawer-close" onClick={onClose} aria-label="Close menu">
        <Icon name="x" size={22} />
      </button>

      {items.map((item) => (
        <AnchorLink
          key={item.id}
          to={item.id}
          onNavigate={onClose}
          data-active={item.id === activeId ? 'true' : 'false'}
          aria-current={item.id === activeId ? 'true' : undefined}
        >
          {item.label}
        </AnchorLink>
      ))}

      {/* The bar's CTA lives here below 980px. */}
      <AnchorLink to="contact" className="drawer-cta" onNavigate={onClose}>
        Hire me
        <Icon name="arrow-ur" size={16} />
      </AnchorLink>
    </div>
  );
}
