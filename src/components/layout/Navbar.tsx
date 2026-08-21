import type { NavItem } from '../../types';
import { AnchorLink } from '../common/AnchorLink';
import { Brand } from '../common/Brand';
import { Icon } from '../common/Icon';

interface NavbarProps {
  items: readonly NavItem[];
  activeId: string;
  stuck: boolean;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
}

export function Navbar({ items, activeId, stuck, drawerOpen, onToggleDrawer }: NavbarProps) {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner" data-stuck={stuck ? 'true' : 'false'}>
        <Brand />

        <div className="nav-links">
          {items.map((item) => (
            <AnchorLink
              key={item.id}
              to={item.id}
              data-active={item.id === activeId ? 'true' : 'false'}
              aria-current={item.id === activeId ? 'true' : undefined}
            >
              {item.label}
            </AnchorLink>
          ))}
        </div>

        <div className="nav-right">
          <AnchorLink to="contact" className="nav-cta">
            Hire me
            <Icon name="arrow-ur" size={14} />
          </AnchorLink>

          <button
            type="button"
            className="burger"
            onClick={onToggleDrawer}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>
    </nav>
  );
}
