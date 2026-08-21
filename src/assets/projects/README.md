# Project screenshots

The full-resolution sources. `npm run images` turns these into the
WebP files the cards load, in `public/projects/`.

To add or replace one: drop a screenshot in here named after the
project's `id` in `src/data/projects.ts`, then run `npm run images`.

| `id` in projects.ts  | Source file                | Status |
| -------------------- | -------------------------- | ------ |
| `vistechbot`         | `vistechbot.png`           | ✅     |
| `ai-resume-analyzer` | `ai-resume-analyzer.png`   | ✅     |
| `velora`             | `velora.png`               | ✅     |
| `linkaura`           | `linkaura.png`             | ✅     |
| `portfolio`          | `portfolio.png`            | ✅     |

A project with no source here still renders: `ProjectCard` catches the
load error and drops the `<img>`, so the card falls back to its own
gradient rather than showing a torn-image icon.

## What the pipeline does

Encodes **WebP at quality 82**, which takes a 1.1–1.4MB PNG down to
about 55KB, and crops to **1600×900**.

### Why 16:9, and why a centre crop

Every screenshot here is a browser window, and browser windows land
around **1.88** — measured across the five, 1.878 to 1.894.

The card's media box was originally 16:10 (1.60), which meant cutting
**15%** off the width of each one. That is enough to lose half a
layout, and it did: the Resume Analyzer puts its headline and buttons
on the *right*, so a left-anchored crop kept the decorative waves and
threw the page away. Anchoring right instead would have done the same
to Velora and VistechBot, which are left-heavy. At 16:10 there is no
single anchor that works for all of them.

So the box moved to **16:9 (1.778)** — what a browser window nearly is.
The crop is 5.6%, split evenly, 2.8% off each edge. At that size no
layout loses anything it needs, and `center` is right for every
screenshot regardless of which side its content sits on.

If a future source is not ~1.88, check it still frames well before
assuming the centre crop suits it.
