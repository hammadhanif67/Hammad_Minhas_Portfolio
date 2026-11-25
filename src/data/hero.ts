import type { HeroStat, MarqueeItem } from '../types';

export const heroStats: readonly HeroStat[] = [
  { id: 'projects', countTo: 5, label: 'Projects built' },
  {
    id: 'domain',
    text: 'VistechBot',
    accentText: true,
    long: true,
    label: 'Live SaaS site on Vercel',
  },
  { id: 'reply', prefix: '<', countTo: 4, suffix: 'h', label: 'Reply time' },
  { id: 'focus', text: '100', suffix: '%', accentSuffix: true, label: 'Front-end focused' },
];

export const marqueeItems: readonly MarqueeItem[] = [
  { icon: 'atom', label: 'React JS' },
  { icon: 'filecode', label: 'TypeScript' },
  { icon: 'braces', label: 'JavaScript ES6+' },
  { icon: 'wind', label: 'Tailwind CSS' },
  { icon: 'zap', label: 'GSAP' },
  { icon: 'route', label: 'React Router v6' },
  { icon: 'box', label: 'Vite' },
  { icon: 'branch', label: 'Git' },
];
