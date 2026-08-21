import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/* ═══════════════════════════════════════════════════════════════
   Every image the site serves, generated from committed sources.

     npm run images

   WHERE THINGS LIVE

     src/assets/                 sources — never served
       logo-source.png             the supplied logo, untouched
       projects/*.png              full-resolution screenshots

     public/                     served
       favicon-32/48.png           root by convention
       apple-touch-icon.png        root by convention (iOS fallback)
       site.webmanifest            root by convention
       brand/                      logo, app icons, share card
       projects/                   card screenshots, WebP

   Sources stay out of public/ because they are large: the three
   screenshots are 3.2MB between them and the logo master is 654KB.
   Only the derivatives ship, and all of them are committed, so a
   deploy never needs sharp — it is a devDependency and a one-off tool.
   ═══════════════════════════════════════════════════════════════ */

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const PUBLIC = join(ROOT, 'public');
const ASSETS = join(ROOT, 'src', 'assets');

const INK = '#07080d';
const AMBER = '#ffb020';
const PAPER = '#f2f4f8';
const MUTED = '#a8aec0';
const SANS = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";

/** Alpha below this is export halo, not artwork. */
const ALPHA_FLOOR = 24;

/** The aspect ratio `.card-media` is locked to. */
const CARD_W = 1600;
const CARD_H = 850;

const kb = (b) => `${(b.length / 1024).toFixed(1)} KB`;

/* ── Logo ───────────────────────────────────────────────────────── */

/**
 * Cleans the master's halo, then trims to the real bounding box.
 *
 * 4.13% of the supplied file's pixels sit at alpha 1–31 — an export
 * artifact carrying ~26,000 reddish pixels that are not in the logo's
 * palette, and against this site's near-black they read as a dirty red
 * edge. The trim has to come second: the halo reaches the file's own
 * border, so trimming first finds nothing to remove.
 */
async function cleanLogo() {
  const src = join(ASSETS, 'logo-source.png');
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < ALPHA_FLOOR) {
      data[i] = 0;
      data[i - 3] = 0;
      data[i - 2] = 0;
      data[i - 1] = 0;
    }
  }

  const cleaned = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return sharp(cleaned).trim({ threshold: 1 }).png().toBuffer();
}

/**
 * Fits the logo inside a square tile.
 *
 * `background` is for the icons iOS and Android composite onto their
 * own surface — a transparent mark on an unknown home screen is a
 * gamble, the site's near-black is not. `padding` is the share of the
 * tile left empty; maskable icons need their art inside the middle 80%
 * or Android's circle crop eats the corners.
 */
async function squareTile(logo, size, { background, padding = 0.12 } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const art = await sharp(logo)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: art, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** 1200×630 — the size every social scraper crops from. */
async function shareCard(logo) {
  const art = await sharp(logo).resize({ height: 250 }).toBuffer();

  const backdrop = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#0a0c14"/><stop offset="0.6" stop-color="${INK}"/><stop offset="1" stop-color="#050609"/>
    </linearGradient>
    <radialGradient id="warm" cx="0.16" cy="0.12" r="0.75">
      <stop offset="0" stop-color="${AMBER}" stop-opacity="0.2"/><stop offset="1" stop-color="${AMBER}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cool" cx="0.95" cy="1" r="0.6">
      <stop offset="0" stop-color="#8ab4ff" stop-opacity="0.14"/><stop offset="1" stop-color="#8ab4ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ground)"/>
  <rect width="1200" height="630" fill="url(#warm)"/>
  <rect width="1200" height="630" fill="url(#cool)"/>
</svg>`);

  const type = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <text x="80" y="424" font-family="${SANS}" font-size="82" font-weight="700"
        letter-spacing="2" fill="${PAPER}">HAMMAD MINHAS</text>
  <rect x="82" y="456" width="124" height="6" fill="${AMBER}"/>
  <text x="80" y="524" font-family="${SANS}" font-size="40" font-weight="600"
        letter-spacing="-0.5" fill="${AMBER}">Front-End Developer</text>
  <text x="80" y="578" font-family="${SANS}" font-size="25" font-weight="400"
        fill="${MUTED}">React · TypeScript · Tailwind · Three.js · Faisalabad, PK</text>
</svg>`);

  return sharp(backdrop)
    .composite([
      { input: art, left: 80, top: 82 },
      { input: type, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/* ── Project screenshots ────────────────────────────────────────── */

/**
 * Nothing is cropped. `contain`, not `cover`.
 *
 * Every screenshot here is a browser window, and browser windows land
 * around 1.88 — measured across the five, 1.878 to 1.894. The card's
 * media box is 1600×850 (1.882), sat in the middle of that range, so
 * fitting each one whole leaves at most a 2–3px transparent sliver on
 * one axis. That sliver is 0.3% of the frame and the card's own
 * gradient shows through it, because the background here is
 * transparent rather than a colour.
 *
 * The earlier 16:10 box cut 15% off the width and 16:9 cut 5.6%. Both
 * were a judgement about which edge mattered least, and on the Resume
 * Analyzer — whose headline and buttons sit on the right — the answer
 * was wrong. Matching the box to the source removes the judgement.
 */
const projectShot = (file) =>
  sharp(file)
    .resize(CARD_W, CARD_H, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 82, effort: 6, alphaQuality: 100 })
    .toBuffer();

/* ── Run ────────────────────────────────────────────────────────── */

async function main() {
  await mkdir(join(PUBLIC, 'brand'), { recursive: true });
  await mkdir(join(PUBLIC, 'projects'), { recursive: true });

  const log = [];
  const write = async (path, buffer, note) => {
    await writeFile(join(PUBLIC, path), buffer);
    log.push(path.padEnd(34) + note.padEnd(15) + kb(buffer));
  };

  const logo = await cleanLogo();
  const { width, height } = await sharp(logo).metadata();
  log.push(`logo master cleaned + trimmed  ->  ${width}×${height}`, '');

  const ink = { r: 7, g: 8, b: 13, alpha: 1 };

  // Root, by convention. Tab icons stay transparent so the mark reads
  // on a light or a dark tab strip.
  await write('favicon-32.png', await squareTile(logo, 32, { padding: 0.04 }), '32×32');
  await write('favicon-48.png', await squareTile(logo, 48, { padding: 0.04 }), '48×48');
  await write(
    'apple-touch-icon.png',
    await squareTile(logo, 180, { background: ink, padding: 0.14 }),
    '180×180',
  );

  await write(
    'brand/logo.png',
    await sharp(logo).resize({ height: 128 }).png({ compressionLevel: 9 }).toBuffer(),
    '128 tall',
  );
  await write(
    'brand/icon-192.png',
    await squareTile(logo, 192, { background: ink, padding: 0.14 }),
    '192×192',
  );
  await write(
    'brand/icon-512.png',
    await squareTile(logo, 512, { background: ink, padding: 0.14 }),
    '512×512',
  );
  await write(
    'brand/icon-maskable-512.png',
    await squareTile(logo, 512, { background: ink, padding: 0.2 }),
    '512 maskable',
  );
  await write('brand/og-image.png', await shareCard(logo), '1200×630');

  log.push('');

  const shotsDir = join(ASSETS, 'projects');
  const shots = (await readdir(shotsDir).catch(() => [])).filter((f) => /\.(png|jpe?g)$/i.test(f));

  for (const file of shots.sort()) {
    const id = file.replace(/\.[^.]+$/, '');
    await write(`projects/${id}.webp`, await projectShot(join(shotsDir, file)), `${CARD_W}×${CARD_H}`);
  }

  console.log(log.join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
