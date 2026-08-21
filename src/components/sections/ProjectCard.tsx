import { useState } from 'react';
import type { Project } from '../../types';
import { cardStyle } from '../../hooks/useCarousel';
import { cx, externalLink } from '../../utils/dom';
import { Icon } from '../common/Icon';

/** Tech tags shown on a card before the overflow count. */
const STACK_SHOWN = 3;

interface ProjectCardProps {
  project: Project;
  /** Distance from the active card, the short way around the ring. */
  offset: number;
  /** 1-based, for the slide's accessible name. */
  position: number;
  total: number;
  /** False on phones, where the section is a plain stack of cards. */
  coverflow: boolean;
}

export function ProjectCard({ project, offset, position, total, coverflow }: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isActive = coverflow && offset === 0;

  /* Stacked, a card is just a card: no transform, no slide role, and
     nothing hidden from anyone. The carousel semantics below only
     make sense when four of the five are actually behind the front
     one — applying them to a plain column would hide four projects
     from a screen reader for no reason. */
  const carouselProps = coverflow
    ? ({
        style: cardStyle(offset),
        role: 'group',
        'aria-roledescription': 'slide',
        'aria-label': `${position} of ${total}: ${project.title}`,
        /* Visible but not reachable: `inert` takes the neighbours'
           links out of the tab order, which is what makes the
           aria-hidden beside it honest. The original left five cards'
           worth of links tabbable behind a pointer-events:none. */
        inert: !isActive,
        'aria-hidden': !isActive,
      } as const)
    : null;

  return (
    <article className="card" data-active={isActive ? 'true' : 'false'} {...carouselProps}>
      <div className="card-in">
        <div className="card-media">
          <span className={cx('badge', project.badge.tone !== 'neutral' && project.badge.tone)}>
            {project.badge.tone === 'live' ? <i aria-hidden="true" /> : null}
            {project.badge.label}
          </span>

          {/* Until the screenshots land, a missing file falls back to the
              media panel's own gradient rather than a torn-image icon. */}
          {imageFailed ? null : (
            <img
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>

        <div className="card-body">
          <p className="card-meta">{project.meta}</p>
          <h3>{project.title}</h3>
          <p className="card-tag">{project.tagline}</p>

          {/* Three tags, then a count. A card is a glance — the full
              stack is on the repo it links to. */}
          <div className="card-stack">
            {project.stack.slice(0, STACK_SHOWN).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
            {project.stack.length > STACK_SHOWN ? (
              <span
                className="card-stack__more"
                title={project.stack.slice(STACK_SHOWN).join(', ')}
              >
                +{project.stack.length - STACK_SHOWN}
              </span>
            ) : null}
          </div>

          <div className="card-links">
            {project.links.map((link) => (
              <a
                key={link.href}
                className={cx('plink', link.solid ? 'solid' : 'line')}
                href={link.href}
                aria-label={`${link.label} — ${project.title}`}
                {...externalLink}
              >
                <Icon name={link.icon} size={13} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
