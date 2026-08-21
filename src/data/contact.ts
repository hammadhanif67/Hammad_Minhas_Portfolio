import type { ContactCard } from '../types';
import { mailLink, profile, waLink, waMessages } from './site';

export const contactCards: readonly ContactCard[] = [
  {
    id: 'whatsapp',
    tone: 'wa',
    icon: 'chat',
    key: 'WhatsApp',
    value: profile.whatsappDisplay,
    href: waLink(waMessages.project),
    external: true,
  },
  {
    id: 'email',
    tone: 'mail',
    icon: 'mail',
    key: 'Email',
    value: profile.email,
    href: mailLink,
    external: false,
  },
  {
    id: 'linkedin',
    tone: 'li',
    icon: 'linkedin',
    key: 'LinkedIn',
    value: profile.linkedinHandle,
    href: profile.linkedin,
    external: true,
  },
  {
    id: 'github',
    tone: 'gh',
    icon: 'github',
    key: 'GitHub',
    value: profile.githubHandle,
    href: profile.github,
    external: true,
  },
];
