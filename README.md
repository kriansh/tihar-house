# Tihar House

A cinematic, presentation-style site about Tihar (the Nepali festival of lights), moving through a traditional house: roof → attic → puja room → kitchen → carved doorway → garden. The deck uses sourced photographs, original SVG overlays, and warm-light motion rather than a long scroll. The garden closes with a self-drawing rangoli over the source photograph, and the finale gathers the credits and the wide, lamp-lit view.

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
```

Pinned: Vite 8.3.7, TypeScript 5.9.3, GSAP 3.15.1, Lenis 1.3.27, Howler 2.2.4, Fontsource 5.3.0.

## What is here

- `index.html` — deck shell, header, chapter rail, guide shell, no-JS fallback.
- `src/main.ts` — boot, sound, language, today's date.
- `src/deck.ts` — slide rendering, keyboard/swipe/wheel navigation, crossfade and camera transitions, SVG overlays.
- `src/deck-data.ts` — slide order, photo paths, alt text, and Wikimedia Commons credits.
- `src/guide.ts` — the Quick Guide tabs and all guide content rendering.
- `src/i18n/` — English and Nepali dictionaries (149 matching keys).
- `src/art/` — original SVG gradients/patterns, diyas, crows, and the garden rangoli overlay.
- `public/images/` — the sourced photographs in 2400w, 1600w, and portrait WebP variants.
- `src/styles/main.css` — tokens, deck layout, per-scene compositions, ornaments, guide, responsive, print, reduced motion.
- `public/audio/` — synthesized room tone and chime (OGG + MP3), muted by default.
- `public/tihar-2083.ics` — all five days for calendar apps.

## The deck

Eight full-screen slides, each with its own composition:

1. **Cover** — marigold garland photograph, title, dates, and the two entry actions.
2. **Roof** — left editorial column, oversized headline, a crow line, and the first diya to light.
3. **Attic** — right-hand column under a marigold garland; the dog portrait holds the left.
4. **Puja** — centred altar copy with a row of lamps that light when the slide arrives.
5. **Kitchen** — a full-width two-column band over the hearth photograph, with sel-roti rings.
6. **Doorway** — narrow left column beside the carved door, a lit rule, and a hanging garland.
7. **Garden** — a glass card on the right, self-drawing rangoli on the left.
8. **Finale** — centred close, replay, and an expandable photo-credit list.

Navigate with the arrows, the bottom-right next control, the chapter dots, `←`/`→`, `Home`/`End`, the wheel, or a horizontal swipe. The URL hash tracks the current slide.

## Dates

Tihar 2083 BS / 2026:

| Date | Day |
| --- | --- |
| Sat 7 Nov 2026 | Kag Tihar |
| Sun 8 Nov 2026 | Kukur Tihar + Laxmi Puja |
| Mon 9 Nov 2026 | Gai Tihar |
| Tue 10 Nov 2026 | Govardhan Puja + Mha Puja |
| Wed 11 Nov 2026 | Bhai Tika |

Checked against Hamro Patro 2083 and Nepali Calendar 2083. At least one international calendar lists Bhai Tika a day earlier; the site follows the Nepali sources and explains the discrepancy in the guide.

## Cultural accuracy

Ritual details are deliberately conservative. Anything that needs confirmation is marked with a subtle **○ “to confirm”** marker in the guide (and a note in the garden). The source copy uses `TODO(verify):` fields for exact offerings, tika colour order, footprint direction, rangoli motif, and household variations. These are placeholders, not rules.

## Accessibility & behaviour

- English / Nepali toggle; choice is remembered in `localStorage`.
- Sound is off by default; nothing is fetched until the visitor enables it.
- `prefers-reduced-motion` disables camera pushes, image drift, flicker, and the rangoli draw, while keeping every slide readable and the guide fully functional.
- The Quick Guide is a focus-trapped dialog, opens from the header, the today chip, chapter links, and the finale, and closes with Escape.
- Print stylesheet prints all five guide tabs, not just the active one.
- Slide imagery is sourced from Wikimedia Commons; photographers and licences are credited on each slide and in the final slide's credit list. SVG overlays, motion, and styling are original.

## Screenshots

With a dev server running on port 5173:

```bash
npx playwright install chromium   # once
npm run smoke                     # checks slides, guide, language, sound, rangoli, print
npm run shots                     # writes screenshots
```

Uses Playwright Chromium by default (with a Firefox fallback) and writes to `/tmp/opencode/tihar-shots`.
