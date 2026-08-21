/* ═══════════════════════════════════════════════════════════════
   SEO configuration — one source for every absolute URL on the site.

   The canonical tag, the Open Graph URLs, the sitemap and the JSON-LD
   all read from here, so the domain is stated once. Get it wrong and
   you get it wrong consistently, which is far easier to spot than four
   files quietly disagreeing.

   Consumed by `vite/seo.ts` at build time, which writes the result
   into index.html. Nothing here ships to the browser as data — it ends
   up as static markup in the head, which is where a crawler that does
   not run scripts can still find it.
   ═══════════════════════════════════════════════════════════════ */

/**
 * The live origin, no trailing slash.
 *
 * Override it at build time and nothing here needs editing:
 *
 *   VITE_SITE_URL=https://hammadminhas.com npm run build
 *
 * Vercel and Netlify both expose their own deploy URL, so a build
 * command of `VITE_SITE_URL=https://$VERCEL_URL npm run build` works
 * without hardcoding anything.
 *
 * TODO — point this at the real domain. It is the one value on the
 * page that cannot be inferred from the content, and a wrong canonical
 * is worse than none: it tells Google the real page lives at an
 * address that does not serve it.
 */
export const DEFAULT_SITE_URL = 'https://hammadminhas.vercel.app';

export const seo = {
  title: 'Hammad Minhas — Front-End Developer | React & TypeScript',
  /* 141 characters. Google truncates around 155–160 on desktop, so the
     sentence that matters comes first and the project names last. */
  description:
    'Front-end developer in Faisalabad, Pakistan. React, TypeScript and Tailwind. Interfaces that ship — VistechBot, Velora, LinkAura and more.',
  shortTitle: 'Hammad Minhas — Front-End Developer',
  shortDescription: 'React, TypeScript, Tailwind. Interfaces that ship.',
  siteName: 'Hammad Minhas',
  locale: 'en_US',
  lang: 'en',
  ogImage: '/brand/og-image.png',
  ogImageAlt: 'Hammad Minhas — Front-End Developer. React, TypeScript, Tailwind.',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  themeColor: '#07080d',
} as const;
