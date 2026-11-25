import type { Project } from '../types';

/* ═══════════════════════════════════════════════════════════════
   The carousel cards, in display order. Every link here was checked
   against GitHub and the live site; private repositories get a live
   link only, so no card points at a 404.
   Screenshots live in public/projects/*.webp at 1600×850, under 200KB.
   ═══════════════════════════════════════════════════════════════ */
export const projects: readonly Project[] = [
  {
    id: 'chariotclaims',
    title: 'ChariotClaims',
    meta: 'Client work · Next.js',
    tagline: 'Next.js rebuild of a claims-recovery site, with Playwright and WCAG 2.2 AA checks on every build.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Playwright'],
    badge: { label: 'Live', tone: 'live' },
    image: {
      src: '/projects/chariotclaims.webp',
      alt: 'ChariotClaims home page — Illuminating Injustice, Delivering Compensation',
      width: 1600,
      height: 850,
    },
    links: [
      {
        href: 'https://chariotclaims.vercel.app/',
        label: 'Live site',
        icon: 'external',
        solid: true,
      },
    ],
  },
  {
    id: 'trenvo-media',
    title: 'Trenvo Media',
    meta: 'My agency · trenvomedia.com',
    tagline: 'Site for my performance-marketing studio, pre-rendered for SEO with a per-page CSP.',
    stack: ['React 19', 'TypeScript', 'Vite SSG', 'GSAP'],
    badge: { label: 'Live', tone: 'live' },
    image: {
      src: '/projects/trenvo-media.webp',
      alt: 'Trenvo Media home page — paid media and creative production, run as one system',
      width: 1600,
      height: 850,
    },
    links: [
      {
        href: 'https://www.trenvomedia.com/',
        label: 'Live site',
        icon: 'external',
        solid: true,
      },
    ],
  },
  {
    id: 'campusfind',
    title: 'CampusFind',
    meta: 'Full stack · University',
    tagline: 'Campus lost-and-found: report an item, claim it with proof and follow it back to its owner.',
    stack: ['React 19', 'Express', 'MySQL', 'Vercel'],
    badge: { label: 'Live', tone: 'live' },
    image: {
      src: '/projects/campusfind.webp',
      alt: 'CampusFind home page — Lost something on campus? It might already be here.',
      width: 1600,
      height: 850,
    },
    links: [
      {
        href: 'https://campusfind-ruby-zeta.vercel.app/',
        label: 'Live site',
        icon: 'external',
        solid: true,
      },
    ],
  },
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
        href: 'https://vistechbotaipk.vercel.app/',
        label: 'Live site',
        icon: 'external',
        solid: true,
      },
      { href: 'https://github.com/hammadhanif67/VistechBot', label: 'Source', icon: 'github' },
    ],
  },
  {
    id: 'ai-resume-analyzer',
    title: 'AI Resume Analyzer',
    meta: 'University project · AI',
    tagline: 'Upload a resume, get an ATS score, a keyword-gap breakdown and a job match.',
    stack: ['React', 'TypeScript', 'FastAPI', 'Python'],
    badge: { label: 'University', tone: 'neutral' },
    image: {
      src: '/projects/ai-resume-analyzer.webp',
      alt: 'AI Resume Analyzer landing page — ATS score, skill gaps and job match',
      width: 1600,
      height: 850,
    },
    links: [
      {
        href: 'https://ai-resume-analyzer-app-mocha.vercel.app/',
        label: 'Live site',
        icon: 'external',
        solid: true,
      },
      {
        href: 'https://github.com/hammadhanif67/AI-Resume-Analyzer',
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
    links: [],
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
    links: [
      { href: 'https://link-aura-ruby.vercel.app/', label: 'Live site', icon: 'external', solid: true },
      { href: 'https://github.com/hammadhanif67/LinkAura', label: 'Source', icon: 'github' },
    ],
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
    links: [
      { href: 'https://github.com/hammadhanif67/Hammad_Minhas_Portfolio', label: 'Source', icon: 'github' },
    ],
  },
];
