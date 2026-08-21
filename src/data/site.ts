import type { NavItem, SocialLink } from '../types';

/* ═══════════════════════════════════════════════════════════════
   One source of truth for the identity details that appear in a
   dozen places — the WhatsApp number alone was written out five
   times in the original file, each with its own URL-encoded message.
   ═══════════════════════════════════════════════════════════════ */

export const profile = {
  name: 'Hammad Minhas',
  role: 'Front-End Developer',
  email: 'adalhammad556@gmail.com',
  whatsapp: '923281933287',
  whatsappDisplay: '0328 1933287',
  github: 'https://github.com/hammadhanif67',
  githubHandle: 'hammadhanif67',
  linkedin: 'https://linkedin.com/in/hammad-minhas-ab9109402',
  linkedinHandle: 'hammad-minhas',
  location: 'Faisalabad, Pakistan',
} as const;

/** Builds a wa.me deep link with the greeting already typed out. */
export const waLink = (message?: string): string =>
  `https://wa.me/${profile.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const waMessages = {
  portfolio: "Hi Hammad, I saw your portfolio and I'd like to talk about a project.",
  project: "Hi Hammad, I'd like to talk about a project.",
} as const;

export const mailLink = `mailto:${profile.email}?subject=${encodeURIComponent('Project enquiry')}`;

/** Cycled through by the scrambling line under the headline. */
export const roles: readonly string[] = [
  'React JS Developer',
  'Front-End Engineer',
  'TypeScript Developer',
  'UI Animation Developer',
  'WebGL Enthusiast',
];

export const navItems: readonly NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

export const socialLinks: readonly SocialLink[] = [
  { label: 'GitHub', href: profile.github, icon: 'github', external: true },
  { label: 'LinkedIn', href: profile.linkedin, icon: 'linkedin', external: true },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail', external: false },
  { label: 'WhatsApp', href: waLink(), icon: 'chat', external: true },
];
