import type { SkillGroup } from '../types';

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'languages',
    icon: 'braces',
    title: 'Languages',
    kind: 'Core',
    chips: ['JavaScript ES6+', 'TypeScript', 'HTML5', 'CSS3'],
  },
  {
    id: 'react',
    icon: 'atom',
    title: 'React ecosystem',
    kind: 'Primary',
    chips: ['React JS', 'Hooks', 'Context API', 'React Router v6', 'Vite'],
  },
  {
    id: 'styling',
    icon: 'palette',
    title: 'Styling & motion',
    kind: 'Craft',
    chips: [
      'Tailwind CSS',
      'GSAP',
      'CSS Animations',
      'Custom Properties',
      'Glassmorphism',
      'Mobile-First',
    ],
  },
  {
    id: 'architecture',
    icon: 'layers',
    title: 'Architecture',
    kind: 'Concepts',
    chips: [
      'Component Architecture',
      'State Management',
      'Responsive UI',
      'Performance Optimization',
    ],
  },
  {
    id: 'tooling',
    icon: 'wrench',
    title: 'Tooling',
    kind: 'Workflow',
    chips: ['Git', 'GitHub', 'npm', 'REST API Integration', 'Browser DevTools'],
  },
  {
    id: 'familiar',
    icon: 'sparkles',
    title: 'Also familiar',
    kind: 'Supporting',
    ice: true,
    chips: ['Python (scripting)', 'C++ (fundamentals)', 'File & Blob APIs'],
  },
];
