# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static, mobile-first wedding website for Rosie & Joe, built with vanilla HTML, CSS and JavaScript — no frameworks, no build tools, no server-side processing. It runs anywhere static files can be hosted, including GitHub Pages.

- **Date:** Saturday 17 April 2027
- **Venue:** Eyam Hall, Eyam, Derbyshire

## Running locally

There is no build step. Open any `.html` file directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`). All paths are relative, so both approaches work.

There are no tests, linters, or package manifests in this repo.

## Architecture

Four pages share a common header/footer markup pattern and a single stylesheet/script:

- `index.html` — Home (hero with grain + botanical mark, welcome note, CTAs)
- `details.html` — The Day (ceremony, reception, dress code, **Schedule timeline**)
- `rsvp.html` — RSVP (intro + Google Form embed, on a limestone band)
- `travel.html` — Getting Here (directions + Google Maps embed, **Accommodation block**)
- `css/style.css` — entire design system and all styles
- `js/main.js` — mobile nav toggle, smooth scroll, active-nav-link highlighting, scroll reveal
- `images/` — drop hero/gallery images here (currently empty aside from `.gitkeep`)

### Design system — "Walled Garden in Winter Light"

A warm, restrained "keepsake" theme. All colours, fonts and rhythm are CSS custom properties in the `:root` block at the top of `css/style.css`, so the whole look is re-themed from one place.

- **Palette** (named for what they evoke): `--ivory #F6F2EA` (canvas — not pure white), `--stone #352F28` (warm near-black body text), `--sage #7E9178` (botanical accent + fine rules; `--rule` is sage at ~35% opacity), `--terra #A8573D` (the single warm accent — used sparingly for the date, one button, link hovers, active nav), `--taupe #9A8F82` (secondary text + section labels), `--limestone #EAE5DC` (inset surfaces: RSVP band, hero/map placeholders).
- **Fonts** (Google Fonts): **Cormorant** at weight 300 *italic* for display (hero names, headings, date) — its high contrast comes from size, never bold; **Cormorant SC** for small-caps section labels (`.eyebrow`, always `--taupe`); **Spectral** 300 for body prose; **Jost** 200/300 for utility text (nav, buttons, times).
- **Layout:** reads like a letter — single column, left-aligned by default. Centre-alignment is reserved for the hero names + date only. Body measure capped at `--text-max` (680px); vertical rhythm via `--section-gap`.
- **Motifs:** a film-grain overlay on the hero (`.hero-grain`, an `feTurbulence` SVG at ~8% opacity — the signature element); thin single-stroke `--sage` botanical SVG marks (`.botanical`, used sparingly beside the names and in the footer); fine sage hairlines (`--rule`) between passages.
- **Motion:** sections fade up on scroll via `.reveal` → `.is-visible` (IntersectionObserver in `main.js`); disabled under `prefers-reduced-motion`. Links reveal a `--terra` underline on hover (text colour unchanged).
- **Responsive:** mobile-first, single breakpoint at `768px`.
- **Utilities/components:** `.container`, `.section` / `.section--alt` (limestone band), `.btn` / `.btn--outline`, `.eyebrow`, `.note` / `.note__lead`, `.detail`, `.timeline`, `.link-list`, `.embed`.
- **Avoid** (per the concept): drop shadows, rounded cards, gold, watercolour florals, pure-white backgrounds, font-weight 700, countdown timers, centring everything.

### Placeholder content

Placeholder copy throughout the pages is marked with `<!-- TODO -->` comments — search for `TODO` to find everything that still needs real content (e.g. hero tagline, welcome copy, schedule timings, accommodation list, hero background image).

### Embedding the Google Form (RSVP)

In `rsvp.html`, find the block marked `<!-- GOOGLE FORM EMBED: replace src with your form URL -->`. Uncomment the `<iframe>`, replace the placeholder `src` with the form URL, and delete the `.embed__placeholder` div directly below it. The surrounding `.embed` section is already styled for `width="100%" height="900"`.

### Embedding the Google Map (Getting Here)

Same pattern in `travel.html`: find `<!-- GOOGLE MAPS EMBED: replace src with your Google Maps embed URL -->`, uncomment the `<iframe>` with the real `src`, and delete the placeholder div below it.

### Adding a hero image

Add the image to `images/` (e.g. `images/hero.jpg`), then in `css/style.css` find the `.hero` rule and replace the placeholder `background-color: var(--limestone)` (and its inset border) with a full-bleed image, e.g. `background: url("../images/hero.jpg") center / cover no-repeat;`. For the Ektar/35mm look the concept calls for, also add `filter: contrast(1.03) saturate(0.92) sepia(0.06);` and crop landscape/letterbox — never square. The `.hero-grain` overlay already sits above the image and makes photographs feel shot on film.

## Deployment

Designed to be deployed via GitHub Pages with the site files at the repo root (already the case after the `chore: move files to root` commit) — Settings → Pages → Deploy from branch → `main` → `/ (root)`.
