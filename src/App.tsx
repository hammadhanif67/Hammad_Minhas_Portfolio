import { useCallback, useState } from 'react';
import { Backdrop } from './components/background/Backdrop';
import { AnchorLink } from './components/common/AnchorLink';
import { IconSprite } from './components/common/IconSprite';
import { Footer } from './components/layout/Footer';
import { Loader } from './components/layout/Loader';
import { SiteHeader } from './components/layout/SiteHeader';
import { ContactDock } from './components/layout/ContactDock';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Faq } from './components/sections/Faq';
import { Hero } from './components/sections/Hero';
import { Marquee } from './components/sections/Marquee';
import { Process } from './components/sections/Process';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { RevealArmedContext } from './hooks/useReveal';

export default function App() {
  /* Reveals stay disarmed until the loader begins to fade, so the
     staggered entrance the hero was authored with actually plays in
     front of the visitor instead of behind the loading screen. */
  const [revealArmed, setRevealArmed] = useState(false);
  const armReveals = useCallback(() => setRevealArmed(true), []);

  return (
    <>
      <IconSprite />

      <AnchorLink to="home" className="skip">
        Skip to content
      </AnchorLink>

      <Loader onDone={armReveals} />
      <SiteHeader />
      <Backdrop />

      <RevealArmedContext.Provider value={revealArmed}>
        <div className="shell">
          <main>
            <Hero />
            <Marquee />
            <About />
            <Skills />
            <Projects />
            <Process />
            <Faq />
            <Contact />
          </main>
          <Footer />
        </div>
      </RevealArmedContext.Provider>

      <ContactDock />
    </>
  );
}
