import type { Project } from '../types';

/* ═══════════════════════════════════════════════════════════════
   The five carousel cards.

   TODO — carried over from the original file, still unverified:
     · the repo slugs below were guessed from the project names
     · live URLs for the four builds that are not vistechbot
     · public/projects/*.webp screenshots, 1600×1000, under 200KB
   Until the screenshots land, ProjectCard hides the broken <img>
   and lets the card's own gradient stand in, so a missing file
   never shows a torn-image icon.
   ═══════════════════════════════════════════════════════════════ */
export const projects: readonly Project[] = [
  {
    id: 'vistechbot',
    title: 'VistechBot',
    meta: 'Client work · 2025',
    tagline: 'SaaS front end for an AI voice agent product, live on its own domain.',
    stack: ['React JS', 'TypeScript', 'GSAP', 'Tailwind'],
    badge: { label: 'Live', tone: 'live' },
    image: {
      src: '/projects/vistechbot.webp',
      alt: 'VistechBot AI voice agent platform interface',
      width: 1600,
      height: 850,
    },
    links: [
      {
        href: 'https://vistechbot.vercel.app/',
        label: 'Live site',
        icon: 'external',
        solid: true,
      },
      { href: 'https://github.com/hammadhanif67/vistechbot', label: 'Source', icon: 'github' },
    ],
  },
  {
    id: 'ai-resume-analyzer',
    title: 'AI Resume Analyzer',
    meta: 'University project · AI',
    tagline: 'Upload a resume, get a match score and a keyword-gap breakdown.',
    stack: ['React JS', 'REST API', 'Tailwind'],
    badge: { label: 'University', tone: 'neutral' },
    image: {
      src: '/projects/ai-resume-analyzer.webp',
      alt: 'AI Resume Analyzer landing page — ATS score, skill gaps and job match',
      width: 1600,
      height: 850,
    },
    links: [
      {
        href: 'https://github.com/hammadhanif67/ai-resume-analyzer',
        label: 'Source',
        icon: 'github',
      },
    ],
  },
  {
    id: 'velora',
    title: 'Velora',
    meta: 'Personal build · E-commerce',
    tagline: 'A fashion storefront — catalogue, cart and wishlist, on a fake product API.',
    stack: ['React JS', 'GSAP', 'FakeStore API'],
    badge: { label: 'E-commerce', tone: 'neutral' },
    image: {
      src: '/projects/velora.webp',
      alt: 'Velora storefront hero with product cards and a new collection banner',
      width: 1600,
      height: 850,
    },
    links: [{ href: 'https://github.com/hammadhanif67/velora', label: 'Source', icon: 'github' }],
  },
  {
    id: 'linkaura',
    title: 'LinkAura',
    meta: 'Personal build · Product',
    tagline: 'One link that holds everything else, on a single presentable profile.',
    stack: ['React JS', 'JavaScript', 'Tailwind'],
    badge: { label: 'Web product', tone: 'neutral' },
    image: {
      src: '/projects/linkaura.webp',
      alt: 'LinkAura profile page with organised link cards',
      width: 1600,
      height: 850,
    },
    links: [{ href: 'https://github.com/hammadhanif67/linkaura', label: 'Source', icon: 'github' }],
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    meta: 'Personal build · WebGL',
    // The only copy edit in the whole port. This card describes the
    // site you are looking at, and the site is React now, so the
    // stack line and the words "no framework" had to follow it.
    // Original: stack ended in "Vanilla JS"; the tagline read
    // "…hand-written CSS system with no framework anywhere in it."
    tagline: "The site you're on. A Three.js particle field over hand-written CSS.",
    stack: ['React', 'Three.js', 'WebGL / GLSL', 'CSS 3D'],
    badge: { label: 'This site', tone: 'paid' },
    image: {
      src: '/projects/portfolio.webp',
      alt: 'This portfolio — hero headline over the animated tubes field',
      width: 1600,
      height: 850,
    },
    links: [{ href: 'https://github.com/hammadhanif67/portfolio', label: 'Source', icon: 'github' }],
  },
];
