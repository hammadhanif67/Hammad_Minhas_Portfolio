import type { ReactNode } from 'react';
import type { HeroStat } from '../../types';
import { heroStats } from '../../data/hero';
import { profile, roles, waLink, waMessages } from '../../data/site';
import { useCountUp } from '../../hooks/useCountUp';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { useReveal } from '../../hooks/useReveal';
import { useScramble } from '../../hooks/useScramble';
import { cx, externalLink } from '../../utils/dom';
import { HeroField } from '../background/HeroField';
import { AnchorLink } from '../common/AnchorLink';
import { Icon } from '../common/Icon';

const ROLE_INTERVAL_MS = 3000;

/** Inserts a zero-width break opportunity at a chosen index. */
function withBreak(text: string, at?: number): ReactNode {
  if (at === undefined) return text;
  return (
    <>
      {text.slice(0, at)}
      <wbr />
      {text.slice(at)}
    </>
  );
}

function StatValue({ stat, animate }: { stat: HeroStat; animate: boolean }) {
  const countRef = useCountUp(stat.countTo ?? 0, animate);
  const body = stat.text !== undefined ? withBreak(stat.text, stat.breakAt) : null;

  return (
    <p className={cx('stat-n', stat.long && 'stat-n--text')}>
      {stat.prefix}
      {stat.countTo !== undefined ? <span ref={countRef}>0</span> : null}
      {stat.accentText ? <em>{body}</em> : body}
      {stat.suffix ? stat.accentSuffix ? <em>{stat.suffix}</em> : stat.suffix : null}
    </p>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const roleRef = useScramble(roles, ROLE_INTERVAL_MS, !reduced);

  /* The hero is what a reload lands on, so its entrance is tied to the
     page arriving rather than to a scroll. On a phone this section is
     ~1000px tall, which puts the buttons and stats below the fold —
     with a scroll observer they simply were not there until you moved,
     which is the one thing a first-time visitor has no reason to do. */
  const pill = useReveal<HTMLDivElement>(undefined, true);
  const heading = useReveal<HTMLHeadingElement>(0.08, true);
  const role = useReveal<HTMLParagraphElement>(0.14, true);
  const lede = useReveal<HTMLParagraphElement>(0.2, true);
  const buttons = useReveal<HTMLDivElement>(0.26, true);
  const stats = useReveal<HTMLDivElement>(0.32, true);

  return (
    <section className="hero" id="home" aria-labelledby="home-title">
      {/* Sits behind the copy and is clipped to this section. */}
      <HeroField />

      <div className="wrap">
        <div className="pill rv" {...pill}>
          <span className="dot" aria-hidden="true">
            <i />
            <i />
          </span>
          Open to freelance &amp; internship roles
          <span className="pill-div" aria-hidden="true" />
          <span className="pill-mono">FAISALABAD · PKT</span>
        </div>

        <h1 className="rv" id="home-title" {...heading}>
          <span className="grad">Front-end developer who</span>{' '}
          <span className="hl">
            ships
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 6 Q 50 11 100 5" />
            </svg>
          </span>
        </h1>

        <p className="role rv" {...role}>
          <span ref={roleRef}>{roles[0]}</span>
          <span className="caret" aria-hidden="true">
            _
          </span>
        </p>

        <p className="hero-lede rv" {...lede}>
          I&rsquo;m <b>{profile.name}</b>, a Software Engineering student at GCUF building
          production-style interfaces with <b>React, TypeScript and Tailwind</b>. Component
          architecture, state management and animation that stays smooth on a mid-range phone.
        </p>

        <div className="btn-row rv" {...buttons}>
          <a className="btn btn-wa" href={waLink(waMessages.portfolio)} {...externalLink}>
            <Icon name="chat" size={18} />
            WhatsApp me
          </a>
          <AnchorLink to="projects" className="btn btn-ghost">
            <Icon name="folder" size={18} />
            View projects
          </AnchorLink>
          <a className="btn btn-ghost" href={profile.github} {...externalLink}>
            <Icon name="github" size={18} />
            GitHub
          </a>
        </div>

        <div className="stats rv" {...stats}>
          {heroStats.map((stat) => (
            <div className="stat" key={stat.id}>
              <StatValue stat={stat} animate={!reduced} />
              <p className="stat-l">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
