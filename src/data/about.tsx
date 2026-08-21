import type { ReactNode } from 'react';
import type { Fact } from '../types';

/* The prose carries inline emphasis, so it lives as JSX rather than
   as strings that a component would have to parse back into markup. */
export const aboutParagraphs: readonly ReactNode[] = [
  <>
    I&rsquo;m a Software Engineering student at <b>Govt. College University Faisalabad</b>, and a
    front-end developer who validates every new skill by building something real with it. No
    tutorial folders, no half-finished experiments &mdash; if I learned it, there&rsquo;s a project
    proving it.
  </>,
  <>
    My work sits firmly on the <b>front end</b>: component architecture, state management with
    Context API and Hooks, React Router, REST API integration, and interfaces that stay responsive
    from 320px upward. I care about the parts users actually feel &mdash; how fast the first paint
    lands, whether an animation stutters on a mid-range Android, whether a layout survives a very
    long product name.
  </>,
  <>
    The largest thing I&rsquo;ve shipped is <b>VistechBot</b>, a complete SaaS platform front end
    for an AI voice agent product, live on its own domain. It taught me what matters at scale:
    naming things properly, keeping CSS from turning into a swamp, and shipping on a date somebody
    else picked.
  </>,
];

export const facts: readonly Fact[] = [
  {
    icon: 'cap',
    key: 'Education',
    value: 'BS Software Engineering',
    sub: 'GCUF, Faisalabad · 2024–2028',
  },
  {
    icon: 'pin',
    key: 'Based in',
    value: 'Faisalabad, Pakistan',
    sub: 'PKT · UTC+5 — overlaps EU, Gulf & AU',
  },
  {
    icon: 'code',
    key: 'Focus',
    value: 'Front-end only',
    sub: 'React · TypeScript · Tailwind · GSAP',
  },
  {
    icon: 'lang',
    key: 'Languages',
    value: 'Urdu · Punjabi · English',
    sub: 'Native · Native · Proficient',
  },
];
