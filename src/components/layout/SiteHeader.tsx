import { useCallback, useEffect, useMemo, useState } from 'react';
import { navItems } from '../../data/site';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollChrome } from '../../hooks/useScrollChrome';
import { MobileDrawer } from './MobileDrawer';
import { Navbar } from './Navbar';

/**
 * Owns everything that reacts to scroll position: the progress bar
 * across the top, the nav pill's "stuck" state, and which link is lit.
 * One scroll listener for all three.
 */
export function SiteHeader() {
  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);
  const { barRef, activeId, stuck } = useScrollChrome(sectionIds);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setDrawerOpen((open) => !open), []);

  // Rotating a phone into landscape can cross the desktop breakpoint
  // with the drawer still open, leaving two navigations on screen.
  const wide = useMediaQuery('(min-width: 980px)');
  useEffect(() => {
    if (wide) setDrawerOpen(false);
  }, [wide]);

  return (
    <>
      <div className="scroll-bar" ref={barRef} aria-hidden="true" />
      <Navbar
        items={navItems}
        activeId={activeId}
        stuck={stuck}
        drawerOpen={drawerOpen}
        onToggleDrawer={toggleDrawer}
      />
      <MobileDrawer
        items={navItems}
        activeId={activeId}
        open={drawerOpen}
        onClose={closeDrawer}
      />
    </>
  );
}
