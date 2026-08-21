/* ═══════════════════════════════════════════════════════════════
   Shared shapes. Everything the page renders from a list is typed
   here, so a typo in a data file is a build error rather than a
   blank card.
   ═══════════════════════════════════════════════════════════════ */

/** Every `id` in the inline SVG sprite, minus its `ic-` prefix. */
export type IconName =
  | 'arrow-ur'
  | 'atom'
  | 'box'
  | 'braces'
  | 'branch'
  | 'cap'
  | 'chat'
  | 'code'
  | 'external'
  | 'file'
  | 'filecode'
  | 'folder'
  | 'github'
  | 'lang'
  | 'layers'
  | 'left'
  | 'linkedin'
  | 'mail'
  | 'menu'
  | 'msgsq'
  | 'palette'
  | 'pin'
  | 'plus'
  | 'pointer'
  | 'right'
  | 'rocket'
  | 'route'
  | 'sparkles'
  | 'wind'
  | 'wrench'
  | 'x'
  | 'zap';

/** The sizes `.i` and its variants expose in utilities.css. */
export type IconSize = 13 | 14 | 16 | 18 | 20 | 22 | 26;

export interface NavItem {
  /** Section element id, without the leading `#`. */
  id: string;
  label: string;
}

export interface HeroStat {
  id: string;
  label: string;
  /** Rendered before the value — the `<` in `<4h`. */
  prefix?: string;
  /** Counts up from 0 when the stat scrolls into view. */
  countTo?: number;
  /** A literal value, used instead of `countTo`. */
  text?: string;
  /** Renders `text` in amber, as the original's `<em>` did. */
  accentText?: boolean;
  /** `text` is a word, not a numeral: fluid size and wrap guard. */
  long?: boolean;
  /** Zero-width break opportunity inside `text`, e.g. before `.com`. */
  breakAt?: number;
  /** Rendered after the value. */
  suffix?: string;
  /** Renders `suffix` in amber, as the original's `<em>` did. */
  accentSuffix?: boolean;
}

export interface MarqueeItem {
  icon: IconName;
  label: string;
}

export interface Fact {
  icon: IconName;
  key: string;
  value: string;
  sub: string;
}

export interface SkillGroup {
  id: string;
  icon: IconName;
  title: string;
  kind: string;
  chips: string[];
  /** Renders the chip in ice blue — the "also familiar" group. */
  ice?: boolean;
}

export type ProjectBadgeTone = 'live' | 'paid' | 'neutral';

export interface ProjectLink {
  href: string;
  label: string;
  icon: IconName;
  /** Filled amber rather than outlined. */
  solid?: boolean;
}

export interface Project {
  id: string;
  title: string;
  meta: string;
  tagline: string;
  stack: string[];
  badge: { label: string; tone: ProjectBadgeTone };
  image: { src: string; alt: string; width: number; height: number };
  links: ProjectLink[];
}

export interface ProcessStep {
  n: string;
  icon: IconName;
  title: string;
  body: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export interface ContactCard {
  id: string;
  /** Drives the per-card accent colour in contact.css. */
  tone: 'wa' | 'mail' | 'li' | 'gh';
  icon: IconName;
  key: string;
  value: string;
  href: string;
  external: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
  external: boolean;
}
