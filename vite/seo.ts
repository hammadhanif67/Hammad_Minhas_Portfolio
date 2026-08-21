import type { Plugin } from 'vite';
import { DEFAULT_SITE_URL, seo } from '../src/data/seo';
import { faqEntries } from '../src/data/faq';
import { profile } from '../src/data/site';
import { projects } from '../src/data/projects';
import { skillGroups } from '../src/data/skills';

/* ═══════════════════════════════════════════════════════════════
   Build-time SEO injection.

   This site renders on the client, so a crawler that does not execute
   JavaScript sees an empty <div id="root">. Google does execute it,
   but nothing else reliably does — and even Google indexes the static
   head first. Everything a crawler needs to understand the page
   without running a line of script therefore goes into index.html at
   build time: canonical, Open Graph, Twitter, and the structured data.

   It is generated from the same data files the components render, so
   the FAQ schema cannot drift from the FAQ on screen. Adding a
   question to `faq.ts` adds it to the rich result too, with nothing
   else to remember.
   ═══════════════════════════════════════════════════════════════ */

const trimSlash = (url: string) => url.replace(/\/+$/, '');

/** Escapes the five characters that would break out of markup. */
const attr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * `</script>` inside a JSON string would close the surrounding tag, so
 * the slash is escaped. JSON parsers read `\/` as `/`.
 */
const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export function seoPlugin(): Plugin {
  let siteUrl = DEFAULT_SITE_URL;

  return {
    name: 'portfolio-seo',

    configResolved(config) {
      siteUrl = trimSlash(config.env.VITE_SITE_URL || DEFAULT_SITE_URL);
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const abs = (path: string) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
        const ogImage = abs(seo.ogImage);

        const person = {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: profile.name,
          jobTitle: profile.role,
          description: seo.description,
          url: siteUrl,
          image: ogImage,
          email: `mailto:${profile.email}`,
          telephone: `+${profile.whatsapp}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Faisalabad',
            addressRegion: 'Punjab',
            addressCountry: 'PK',
          },
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: 'Govt. College University Faisalabad',
          },
          knowsAbout: [...new Set(skillGroups.flatMap((group) => group.chips))],
          knowsLanguage: ['Urdu', 'Punjabi', 'English'],
          sameAs: [profile.github, profile.linkedin],
        };

        const website = {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          url: siteUrl,
          name: seo.siteName,
          description: seo.description,
          inLanguage: seo.lang,
          publisher: { '@id': `${siteUrl}/#person` },
        };

        const profilePage = {
          '@type': 'ProfilePage',
          '@id': `${siteUrl}/#webpage`,
          url: siteUrl,
          name: seo.title,
          description: seo.description,
          isPartOf: { '@id': `${siteUrl}/#website` },
          about: { '@id': `${siteUrl}/#person` },
          inLanguage: seo.lang,
          primaryImageOfPage: ogImage,
        };

        /* The five questions already on the page, in the shape Google
           needs for an FAQ rich result. */
        const faqPage = {
          '@type': 'FAQPage',
          '@id': `${siteUrl}/#faq`,
          isPartOf: { '@id': `${siteUrl}/#webpage` },
          mainEntity: faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: { '@type': 'Answer', text: entry.answer },
          })),
        };

        /* Each project as a CreativeWork, so the work itself is
           described rather than just being five more outbound links. */
        const projectList = {
          '@type': 'ItemList',
          '@id': `${siteUrl}/#projects`,
          name: 'Selected projects',
          numberOfItems: projects.length,
          itemListElement: projects.map((project, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'CreativeWork',
              name: project.title,
              description: project.tagline,
              url: project.links[0]?.href,
              image: abs(project.image.src),
              keywords: project.stack.join(', '),
              author: { '@id': `${siteUrl}/#person` },
            },
          })),
        };

        const head = [
          `<link rel="canonical" href="${attr(siteUrl)}" />`,
          '',
          `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
          `<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
          '',
          `<meta property="og:url" content="${attr(siteUrl)}" />`,
          `<meta property="og:site_name" content="${attr(seo.siteName)}" />`,
          `<meta property="og:image" content="${attr(ogImage)}" />`,
          `<meta property="og:image:secure_url" content="${attr(ogImage)}" />`,
          `<meta property="og:image:type" content="image/png" />`,
          `<meta property="og:image:width" content="${seo.ogImageWidth}" />`,
          `<meta property="og:image:height" content="${seo.ogImageHeight}" />`,
          `<meta property="og:image:alt" content="${attr(seo.ogImageAlt)}" />`,
          '',
          `<meta name="twitter:image" content="${attr(ogImage)}" />`,
          `<meta name="twitter:image:alt" content="${attr(seo.ogImageAlt)}" />`,
          '',
          jsonLd({
            '@context': 'https://schema.org',
            '@graph': [person, website, profilePage, faqPage, projectList],
          }),
        ].join('\n');

        /* The hand-written Person block in index.html is superseded by
           the @graph above — two Person nodes would make a crawler pick
           one arbitrarily. */
        const withoutOldLd = html.replace(
          /<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/,
          '',
        );

        return withoutOldLd.replace('</head>', `${head}\n</head>`);
      },
    },

    /** robots.txt and sitemap.xml, written with the resolved domain. */
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: [
          'User-agent: *',
          'Allow: /',
          '',
          '# One page, no crawl traps, nothing private.',
          `Sitemap: ${siteUrl}/sitemap.xml`,
          '',
        ].join('\n'),
      });

      /* A single-page site, so the sitemap is the page itself. The
         in-page anchors are deliberately not listed: #about and #skills
         are the same URL, and listing them would be five duplicate
         entries for one document. */
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          `    <loc>${siteUrl}/</loc>`,
          `    <lastmod>${today}</lastmod>`,
          '    <changefreq>monthly</changefreq>',
          '    <priority>1.0</priority>',
          '  </url>',
          '</urlset>',
          '',
        ].join('\n'),
      });
    },
  };
}
