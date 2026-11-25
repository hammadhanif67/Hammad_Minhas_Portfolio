import { useCallback } from 'react';
import { projects } from '../../data/projects';
import { shortestOffset, useCarousel } from '../../hooks/useCarousel';
import { useHasHover, useMediaQuery, useReducedMotion } from '../../hooks/useMediaQuery';
import { useReveal } from '../../hooks/useReveal';
import { pad2 } from '../../utils/dom';
import { Icon } from '../common/Icon';
import { Section, SectionHead } from '../common/Section';
import { ProjectCard } from './ProjectCard';

/** Matches the coverflow breakpoint in carousel.css. */
const COVERFLOW_AT = '(min-width: 768px)';

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
/** "Eight builds" while the list is short enough to spell out, digits after that. */
const countWord = (n: number) => COUNT_WORDS[n] ?? String(n);

export function Projects() {
  const { ref: revealRef, ...revealProps } = useReveal<HTMLDivElement>();
  const reduced = useReducedMotion();
  const hasHover = useHasHover();

  /* Below 768px the projects render as a plain column, so there
     is no rotation to drive: no timer, no arrows, no dots, no swipe,
     and no arrow-key listener on the window. Scrolling is the whole
     interface. */
  const coverflow = useMediaQuery(COVERFLOW_AT);

  const { active, paused, runId, rootRef, goTo, next, prev, setHoverPaused, stageHandlers } =
    useCarousel({
      count: projects.length,
      enabled: coverflow,
      autoplay: !reduced,
    });

  // A tap on a phone can fire mouseenter and leave the stack paused for
  // good, so only real cursors get to pause it.
  const pauseOn = useCallback(() => hasHover && setHoverPaused(true), [hasHover, setHoverPaused]);
  const pauseOff = useCallback(() => hasHover && setHoverPaused(false), [hasHover, setHoverPaused]);

  // One node, two owners: the reveal observer watches it, and the
  // keyboard handler measures it to know whether it is on screen.
  const attachRoot = useCallback(
    (node: HTMLDivElement | null) => {
      revealRef.current = node;
      rootRef.current = node;
    },
    [revealRef, rootRef],
  );

  const autoRunning = coverflow && !reduced && !paused;
  const current = projects[active];

  return (
    <Section id="projects">
      <SectionHead
        id="projects"
        center
        eyebrow="Projects"
        title={`${countWord(projects.length)} builds, all mine`}
        lede={
          <>
            Client work, a university project and tools I built to solve a problem I actually had.
            {coverflow
              ? ' The stack advances on its own — or drag it, click the arrows, or use the arrow keys.'
              : null}
          </>
        }
      />

      <div
        className="carousel rv"
        {...(coverflow
          ? { 'aria-roledescription': 'carousel', 'aria-label': 'Selected projects' }
          : null)}
        onMouseEnter={pauseOn}
        onMouseLeave={pauseOff}
        onFocus={() => setHoverPaused(true)}
        onBlur={() => setHoverPaused(false)}
        ref={attachRoot}
        {...revealProps}
      >
        <div className="stage" {...(coverflow ? stageHandlers : null)}>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              offset={shortestOffset(i, active, projects.length)}
              position={i + 1}
              total={projects.length}
              coverflow={coverflow}
            />
          ))}
        </div>

        {coverflow ? (
          <>
            <div className="ctrls">
              <button
                type="button"
                className="nav-btn"
                onClick={prev}
                aria-label="Previous project"
              >
                <Icon name="left" size={22} />
              </button>

              <div className="dots">
                {projects.map((project, i) => (
                  <button
                    key={project.id}
                    type="button"
                    className="dotbtn"
                    data-on={i === active ? 'true' : 'false'}
                    aria-label={`Show ${project.title}`}
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>

              <button type="button" className="nav-btn" onClick={next} aria-label="Next project">
                <Icon name="right" size={22} />
              </button>
            </div>

            {/* Remounted on every change so the CSS fill animation replays —
                the original forced a reflow to achieve the same thing. */}
            <div className="timer" data-run={autoRunning ? 'true' : 'false'} aria-hidden="true">
              <i key={runId} />
            </div>

            <p className="counter">
              <b>{pad2(active + 1)}</b> / <span>{pad2(projects.length)}</span>
              <span className="pause-hint">
                <Icon name="pointer" size={13} />
                <span className="hint-hover">hover to pause</span>
                <span className="hint-touch">swipe to browse</span>
              </span>
            </p>

            {/* Silent while the stack is rotating on its own, per the APG
                carousel guidance; it starts speaking as soon as focus or a
                cursor stops the rotation. */}
            <p className="sr-only" aria-live={autoRunning ? 'off' : 'polite'}>
              {`${current.title}, ${active + 1} of ${projects.length}`}
            </p>
          </>
        ) : null}
      </div>
    </Section>
  );
}
