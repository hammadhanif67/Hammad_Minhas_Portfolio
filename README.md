# Hammad Minhas — Portfolio

The v6 single-file HTML portfolio, rebuilt as a React + TypeScript
application. Same design, same copy, same animations; a component
architecture underneath and a responsive layer that holds from 320px to
2560px.

```bash
npm install
npm run dev        # vite dev server
npm run build      # tsc -b && vite build
npm run preview    # serve the production build
npm run typecheck
npm run images     # regenerate the favicon set + OG card
```

Node 20.19+ (Vite 8). No CDN dependencies at runtime: the original
pulled three.js from cdnjs and the hero effect was supplied as a
jsDelivr import — both are npm packages now, bundled and versioned.

---

## Architecture

```
src/
├── components/
│   ├── background/   Backdrop (gradient + grain), HeroField (tubes cursor)
│   ├── common/       Icon, IconSprite, AnchorLink, Section
│   ├── layout/       Loader, SiteHeader, Navbar, MobileDrawer, Footer, ContactDock
│   └── sections/     Hero, Marquee, About, Skills, Projects, Process, Faq, Contact
├── data/             Every list the page renders from — one file per section
├── hooks/            useCarousel, useReveal, useCountUp, useScramble,
│                     useScrollChrome, useMediaQuery, useFocusTrap, …
├── styles/           tokens · reset · typography · layout · utilities
│                     + one stylesheet per section
├── types/            Shapes for everything in data/
└── utils/            dom, intersect, three
```

Content lives in `src/data/`. Adding a project is one object in
`projects.ts`; adding a skill group, an FAQ, a process step or a
contact card is the same. Nothing in `components/` hardcodes copy.

`src/data/site.ts` holds the identity details — the WhatsApp number was
written out five times in the original, each with its own URL-encoded
greeting; it is `waLink(waMessages.project)` now.

## Styling

Plain CSS, no framework, no CSS-in-JS. Load order is cascade order:
tokens → reset → typography → layout → utilities → one file per
section. `!important` appears exactly once, in the reduced-motion
floor, where overriding author styles is the point.

**Design tokens** live in `src/styles/tokens.css`. Every value used in
more than one place is there, and every token in the file is referenced
by something — there is no unused-token layer.

**Shadows are restrained.** All eight shadow rules on the site resolve
through five tokens in `tokens.css`, and a shadow's job is to say a
thing sits slightly above the page rather than to draw a cloud under
it. Card blur is 16px, the lifted card 20px, and no hover goes past
10px  roughly a quarter of the original blur at a little over half
the opacity. Wide soft shadows were built for the rounded design; at
square corners the same blur reads as smudge.

**Corners are square.** All four radius tokens are `0`, and no
stylesheet writes a literal `border-radius`. The original v6 values are
recorded in the comment beside them, so restoring the rounded design is
four edits rather than a search across nineteen files.

## Responsive

Mobile-first. Sizes are `clamp()` expressions rather than
breakpoint-stepped values wherever the design allows, with the upper
bound of each clamp set to the exact pixel value the original shipped —
so the desktop composition is unchanged and only the phone range gains
headroom.

Verified at 320, 360, 375, 390, 393, 414, 430, 480, 576, 640, 768, 820,
900, 1024, 1280, 1440, 1536, 1920 and 2560px: no horizontal page
overflow, nothing painted outside the viewport, and no box whose
content exceeds it.

**iPhone.** `viewport-fit=cover` in `index.html` plus `env(safe-area-inset-*)`
folded into the container gutter, the nav, the drawer, the hero's lower
padding, the footer and the floating contact dock. `svh`/`dvh` where
the iOS address bar would otherwise cause a jump.

## SEO

The head is written at build time by `vite/seo.ts` from the same data
files the components render, so the FAQ schema cannot drift from the
FAQ on screen — adding a question to `faq.ts` adds it to the rich
result too.

**Set the domain before deploying.** It is the one value that cannot be
inferred, and a wrong canonical is worse than none:

```bash
VITE_SITE_URL=https://your-domain.com npm run build
```

It propagates to the canonical tag, `og:url`, every JSON-LD `@id`,
`robots.txt` and `sitemap.xml` together. The fallback lives in
`src/data/seo.ts`.

**In the static HTML**, before a line of JavaScript runs: title,
description, canonical, robots directives, full Open Graph and Twitter
cards with a real 1200×630 image, and 6KB of JSON-LD.

**Structured data** — one `@graph`, five nodes:

| Node | Why |
| --- | --- |
| `Person` | Name, role, location, school, 27 skills, verified profiles |
| `WebSite` | Site-level identity |
| `ProfilePage` | Ties the page to the person |
| `FAQPage` | 5 questions — eligible for an FAQ rich result |
| `ItemList` | 5 projects as `CreativeWork`, with stack and links |

**Generated assets.** Every image the site serves is produced by
`npm run images` from committed sources, and the outputs are committed
too, so a deploy never needs sharp.

```
src/assets/                sources — never served
  logo-source.png            the supplied logo, untouched (654KB)
  projects/*.png             full-resolution screenshots (~1.2MB each)

public/
  favicon-32/48.png          root by convention
  apple-touch-icon.png       root by convention (iOS fallback)
  site.webmanifest           root by convention
  brand/                     logo.png, icon-192/512, maskable, og-image
  projects/                  card screenshots, WebP
```

Sources stay out of `public/` because Vite copies that folder verbatim:
the three screenshots and the logo master are ~3.9MB that would ship
untouched. Only derivatives are served — 632KB for the whole set.

*Project screenshots* are fitted to **1600×850** and encoded WebP at
q82 — about 52KB each, 260KB for all five.

**Nothing is cropped.** The pipeline uses `contain`, and so does
`object-fit`. Every screenshot is a browser window, and browser windows
land around 1.88 (measured across the five: 1.878–1.894); the media box
is 1.882, sat in the middle of that range, so fitting each one whole
leaves at most a 2–5px transparent sliver on one axis — 0.6% of the
frame at worst, filled by the card's own gradient.

Earlier passes cropped to 16:10 (15% off the width) and then 16:9
(5.6%). Both were a judgement about which edge mattered least, and on
the Resume Analyzer — whose headline and buttons sit on the right — the
answer was wrong. Matching the box to the source removes the judgement
entirely.

*The logo master* gets two fixes on the way through:

- **A halo.** 4.13% of its pixels sat at alpha 1–31 — an export
  artifact carrying ~26,000 reddish pixels not in the logo's palette,
  which against this site's near-black read as a dirty red edge.
  Anything under alpha 24 is cut to fully transparent, taking the
  fringe from 25,787 pixels to 254.
- **Uncropped canvas.** That halo reached the master's own border, so
  `trim()` found nothing. Trimming after the cleanup crops 1312×1199
  to the artwork's real 1075×1099.

Tab icons stay transparent so the mark reads on a light or dark tab
strip. Home-screen icons get the site's near-black tile, because iOS
and Android composite onto a surface the page does not control.

**On-page, audited on the rendered DOM:** one `h1`, 27 headings with no
level skipped, `main`/`nav`/`footer` landmarks, all 5 images with alt
text and intrinsic dimensions, all 18 external links with
`rel="noopener"`, no generic anchor text, ~5,960 characters of real
copy.

### The two things SEO cannot fix from here

**1. It renders on the client.** A crawler that does not execute
JavaScript sees the head and the `<noscript>` line — not the ~5,960
characters of copy. Google executes JS and will index it; most other
crawlers and several social scrapers do not. The fix is prerendering
(`vite-plugin-prerender`, or moving to Next/Astro), which for a static
single-page portfolio is a contained change and the single largest SEO
win available.

**2. The loader delays LCP.** The opening progress screen holds the
viewport for up to 3.4s before the hero paints, and Largest Contentful
Paint is a ranking signal. The loader is a deliberate design choice, so
it is still here — but if Core Web Vitals matter more than the
entrance, cutting `FAILSAFE_MS` in `Loader.tsx`, or showing it only on
a first visit, buys most of it back.

## What changed from the original, and why

Everything below is a bug fix or an explicit request, not a redesign.
Each one is commented at the site of the change.

> **Hero palette.** The tubes run the full spread — pink, purple,
> cyan, ice and amber — rather than one warm family. The two arrays
> are consumed differently and it matters when editing them:
> `TUBE_COLORS` is a gradient ramp sampled once per tube, so any
> length works; `LIGHT_COLORS` must be **exactly four**, because the
> build loops `for (i = 0; i < 4; i++)` over it. A fifth is silently
> dropped and a missing fourth sets a light to `undefined`, so it is
> typed as a 4-tuple and the compiler enforces it.

| Change | Reason |
| --- | --- |
| **The hero background is the tubes cursor** | Requested, with a supplied snippet. `threejs-components`' tubes1 build — four glowing tubes chasing the pointer, with coloured lights riding them. It bundles its own three.js, so the project's direct `three` dependency is gone. |
| **The field is the hero's, and only the hero's** | Requested. The canvas is a child of `<section class="hero">`. The build sizes itself from `canvas.parentNode` and keeps a ResizeObserver on it, so putting it there is the whole containment story — measured, the canvas box equals the hero box to the pixel at 320, 375 and 1440. The previous site-wide code-glyph tunnel is gone. |
| Installed from npm, not jsDelivr | The snippet imported from a CDN URL. That is a third-party origin the page has to reach on every visit; the one thing this portfolio no longer has is a runtime dependency on somebody else's uptime. Same version, `threejs-components@0.0.19`, now a lazy chunk. |
| Pixel ratio capped on touch | The build pins **both** `minPixelRatio` and `maxPixelRatio` to 2, forcing a 2× buffer on a phone that never asked for one. The hero is ~1100px tall on a phone, so that is a 1.5-megapixel buffer every frame; coarse pointers get 1.5 instead. |
| The canvas is click-through on touch | A full-hero element accepting pointer events is a good way to lose a scroll gesture. `pointer-events` is `none` below a fine pointer — touch gets the idle orbit the build falls back to, a mouse gets the tubes following it. |
| The random-colour click handler was left out | It is demo scaffolding from the library's example page: it sets three random hex values, which on a portfolio means one stray click turns the hero into whatever colours came up. Say the word and it goes back in. |
| **The page glow scrolls away instead of following you** | Bug. `.gl-fallback` was `position: fixed` with an amber radial anchored at `50% 0%` — the top of the *viewport* — so the glow rode down the screen and sat over About, Skills and everything after. The old full-page glyph field used to blend it away; once the field was scoped to the hero there was nothing left hiding it. It is `position: absolute` across `#root` now, so the amber sits at the top of the *document*, behind the hero, and is gone once you scroll past. Measured: after a 3000px scroll the glow is at `-3000`, the same as the hero. The grain stays fixed — uniform noise, so pinning it is both correct and cheaper. |
| Glow sizes moved from `%` to `vh` | Consequence of the above. A percentage in a radial-gradient resolves against the element, which is now the full document, so a 450px glow would have stretched into a 3000px one. |
| Hero lighting brought down | The snippet shipped `intensity: 180`, which with additive blending blew out the middle of the hero. It is 100, and the scrim no longer clears to transparent at the right edge — it bottoms out at 0.55, so the whole hero sits at the settled level instead of being loud on one side and calm on the other. |
| **Project cards are opaque, not glass** | The cards overlap each other in the coverflow, and at `rgba(11,13,21,0.82)` the card behind showed its content straight through the one in front. They get their own `--card-surface`, fully opaque, and lose their `backdrop-filter` — which was also buying nothing, since the WebGL field is scoped to the hero and below it there is only a flat gradient to blur. Five fewer blurred layers per scrolled frame. |
| **Screenshots stopped being cropped** | Three things were cutting them: a `cover` fit in the pipeline, `object-fit: cover` on the image, and a `scale(1.04)` zoom on the active card inside an `overflow:hidden` box. All three are gone — the box now matches the source ratio and both fits are `contain`. |
| **FileForge replaced by Velora** | Requested. A React + GSAP fashion storefront on a fake product API, with the supplied screenshot. The meta description, which named FileForge, follows it. |
| **The floating dock stopped looking like a second WhatsApp button** | Bug. Its trigger wore `ic-chat` — the round bubble this site uses for WhatsApp specifically, on the hero button, in the footer, and on the WhatsApp row inside the dock itself. On a phone both were on screen at once, so the page appeared to offer WhatsApp twice. The dock opens four channels, so it takes `ic-msgsq`, a mark that belongs to none of them. It also hides itself over the Contact section, which already lists all four plus a "Start the conversation" button. |
| **A scrim sits between the field and the copy** | Requested. The tubes chase the cursor, so moving the mouse toward the headline dragged a bright, additively-blended light straight onto gradient-filled text with no shadow to fall back on. A `pointer-events: none` layer at z-index 1 — canvas 0, scrim 1, copy 2 — holds a settled ground under the words while the field keeps full brightness at the edges. Below 900px it is a centred veil; above, it follows the copy into the left column and clears by the right edge. |
| **The hero reveals on load, not on scroll** | Requested. The hero is what a reload lands on, and at ~1100px tall on a phone it pushes its own buttons and stats below the fold — with a scroll observer they were simply not there until you moved, which is the one thing a first-time visitor has no reason to do. `useReveal(delay, immediate)` skips the observer for the hero only; everything below it still waits for an intersection. Measured at `scrollY: 0`: hero 6/6 revealed, the other 29 still hidden. |
| The carousel's WebGL "burst" bridge was removed | With the field scoped to the hero, a burst fired from the projects section further down the page had nothing left to ripple. `BurstProvider`, `useBurst` and the carousel's `onChange` all went with it rather than staying as a provider nothing subscribes to. |
| **Projects are a plain stack below 768px** | Requested. The coverflow is a desktop control — on a phone it showed one card at 80vw with two neighbours bleeding off both edges and hid four of five projects behind a timer. Below 768px it is five full-width cards in a column: all visible, in order, no autoplay, no arrows, no dots. The coverflow returns unchanged at 768px and up. |
| **No border radius anywhere** | Requested. |
| **Hire me moved into the drawer below 980px** | Requested. The bar now carries the brand and the menu button only; the CTA gets a full-width target inside the menu instead of competing with the burger for a 320px row. |
| **The WhatsApp button became a contact dock** | Requested. It was a 54px button committing the corner of every page to one channel. It is a 46px square now that opens every channel in `contactCards` — WhatsApp, email, LinkedIn, GitHub — and collapses back to exactly its original state on Escape, an outside click, picking a channel, or the button itself. |
| **Drawer raised above the nav** | Bug. `.drawer` was `z-index: 99` against the nav’s `100`, so the nav painted over the panel and swallowed the close button in the top-right corner — the one control the drawer cannot do without. |
| **Project card copy trimmed** | Requested. Taglines are one line each (~69 chars, down from ~130) and the tech tags cap at three with a `+N` for the rest. A card is a glance; the detail is on the repo it links to. |
| Carousel cards share one grid cell instead of being absolutely positioned in a fixed-height stage | The stage locked at its 452px floor on short phones while the tallest card needed ~492px, and `.card-in`'s `overflow:hidden` cut the "Live site" and "Source" buttons off. The row grows to the tallest card now; desktop keeps its 510px proportion. |
| Neighbour offsets are percentages of card width (`--x-1`, `--x-2`) | They were pixel constants recomputed by a JS resize handler. The browser rescales them now, and the resize listener is gone. |
| Nav bar's inline padding is fluid | At 320px the brand, CTA and burger needed ~250px inside a 245px box, so flexbox shrank the brand and the name lost its last letter. |
| Hero stats: `minmax(0,1fr)`, four-up at 1000px not 760px, `<wbr>` before `.com`, container-query sizing | `vistechbot.com` could not fit its cell and forced its grid column 58px wider than its three siblings. |
| The availability pill wraps below 34em | Its two halves need ~380px against a phone's ~284px. |
| One shared `IntersectionObserver` per options set | Forty elements had forty observers. |
| Autoplay is a timeout keyed to the slide, not a free-running interval | The progress bar was restarted independently of the interval, so after a hover the bar and the actual swap drifted apart. |
| Reveals wait for the loader to finish | The observer used to start immediately, so the hero's staggered `transition-delay`s (.08s → .32s) played behind the loading screen and were never seen. |
| `inert` on the four non-active cards | They were `pointer-events:none` but still in the tab order, and `aria-hidden` was on them anyway. |
| Focus trap + `Escape` + focus restore on the drawer | It had none: opening it left focus on the burger and Tab walked into the hidden page behind. |
| Hover effects gated behind `@media (hover: hover)` | A tap left cards stuck in their hover state. Touch gets a static wash on skill cards instead of the cursor spotlight. |
| Touch targets grown with transparent `::after` boxes | A 9px carousel dot is not a thumb target. The painted controls are unchanged; only the hit areas grow, and only on coarse pointers. |
| `scroll-margin-top` on sections | Anchor jumps landed behind the fixed nav. |
| WebGL sizes from the canvas box via `ResizeObserver` | It read `window.innerHeight`, which disagrees with a fixed `inset:0` canvas the whole time the iOS address bar is collapsing. |
| `three.js` loads via `import('three')` after first paint | It was a CDN `<script>`. It is a separate chunk now, fetched only on a device that has WebGL and has not asked for reduced motion. |
| `ColorManagement.enabled = false`, `outputColorSpace = LinearSRGBColorSpace` | r152 turned on sRGB output by default, which would shift every additive blend away from what these r128-era shaders were tuned to look like. |

### One copy edit

The Portfolio card describes this site, and this site is React now:

- stack: `Vanilla JS` → `React` (moved to the front of the list)
- tagline: "…no framework anywhere in it" → "…no **UI** framework anywhere in it"

Both are in `src/data/projects.ts` with the original text in a comment.

### Still open

The `TODO`s from the original are carried over verbatim in
`src/data/projects.ts`: the four non-VistechBot repo slugs are guesses
from the project names, and the live URLs for those four are unknown.
The five screenshots are not in the repo — see
`public/projects/README.md`.

## Accessibility

Semantic landmarks, one `h1`, heading order preserved. Skip link,
visible focus rings, `aria-current` on the active nav link, FAQ
questions as headings that are also buttons, APG carousel semantics
with a live region that stays silent while the stack auto-rotates, and
`prefers-reduced-motion` honoured everywhere — the WebGL field never
boots, the carousel stops advancing, the marquee parks, and the role
line stops scrambling. Nothing stops working; it stops moving.
