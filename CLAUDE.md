# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static, mobile-first wedding website for Rosie & Joe, built with vanilla HTML, CSS and JavaScript — no frameworks, no build tools, no server-side processing. It runs anywhere static files can be hosted, including GitHub Pages.

- **Date:** Saturday 17 April 2027
- **Venue:** Eyam Hall, Eyam, Derbyshire

## Running locally

There is no build step. Open any `.html` file directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`). All paths are relative, so both approaches work.

There are no tests, linters, or package manifests in this repo. `.github/workflows/ci.yml` runs `html-proofer` (link/image/HTML validity checks, with `cake/index.html` excluded) and `node --check js/main.js` on every push/PR.

## Architecture

Eight pages share a common header/footer markup pattern (via custom elements, see below) and a single stylesheet/script:

- `index.html` — Home (hero with grain + botanical mark, welcome note, CTAs)
- `details.html` — The Day (ceremony, reception, dress code, schedule timeline)
- `rsvp.html` — RSVP (intro + live Google Form embed, on a limestone band)
- `travel.html` — Getting Here (directions + live Google Maps embed)
- `accommodation.html` — Where to stay near the venue
- `gift.html` — Gift / honeymoon fund info
- `evening/index.html` — Evening-only guests page (one directory deep; keeps its own simplified inline header instead of `<site-header>`, since its nav has no links and the shared header's links are root-relative)
- `save-the-date/index.html` — standalone save-the-date card; fully self-contained with inline `<style>` and no shared header/footer/nav — not part of the templating system below
- `css/style.css` — entire design system and all styles
- `js/main.js` — mobile nav toggle, smooth scroll, active-nav-link highlighting, scroll reveal
- `js/components.js` — defines the `<site-header>` / `<site-footer>` custom elements (see "Shared header/footer" below)
- `images/icons.svg` — shared SVG icon sprite; pages reference icons via `<svg class="icon"><use href="images/icons.svg#icon-name"></use></svg>` instead of duplicating `<symbol>` defs inline
- `images/` — hero/gallery images
- `cake/index.html` — a large (~26 MB) bundled artifact, not hand-authored like the rest of the site; deliberately excluded from CI and out of scope for site maintenance

### Shared header/footer markup (no build step)

There's no templating engine or build step, so duplication across pages is handled with light-DOM custom elements instead. `js/components.js` defines `<site-header>` and `<site-footer>`, which render their real `<header>`/`<footer>` markup into themselves via `innerHTML` in `connectedCallback()` — no Shadow DOM, so the existing global stylesheet still applies via ordinary class selectors. Pages include it as `<script src="js/components.js"></script>` **synchronously in `<head>`** (not deferred), so the elements are defined and upgraded before the parser reaches their tags in `<body>` — by the time `js/main.js`'s `DOMContentLoaded` handlers run, the nav/footer markup is already real. `css/style.css` sets `site-header, site-footer { display: contents; }` so the wrapper element doesn't break the header's `position: sticky` behaviour. Usage:

```html
<site-header logo="Rosie &amp; Joe's Wedding"></site-header>
<!-- … -->
<site-footer></site-footer>
```

The `logo` attribute is optional (defaults to "Rosie & Joe"). `evening/index.html` is the one exception — it keeps an inline simplified `<header>` rather than `<site-header>`.

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

### Content status

There are no remaining `<!-- TODO -->` placeholder comments — all copy, the Google Form embed, and the Google Maps embed are live. Two narrower placeholders remain in `evening/index.html`: an `[RSVP DEADLINE]` placeholder in the RSVP section copy, and a `<!-- PARKING: confirm with venue -->` comment ahead of the transport paragraph — both need real information from the couple/venue rather than invented content.

### Embedding the Google Form (RSVP)

`rsvp.html` already embeds a live Google Form (`<iframe src="https://docs.google.com/forms/...">`). To point it at a different form, replace that `src` with the new form's embed URL. The surrounding `.embed` section is already styled for `width="100%" height="900"`.

### Embedding the Google Map (Getting Here)

`travel.html` already embeds a live Google Map (`<iframe src="https://maps.google.com/maps?q=...">`). To change the location, replace that `src` with a new embed URL from Google Maps' **Share → Embed a map**.

### Adding a hero image

The hero background image is already wired in via `.hero__bg` in `css/style.css` (around line 391; there's also a `.hero--evening` variant used on `evening/index.html`). To swap the photo, add the new image to `images/` and update the `background-image` value there. For the Ektar/35mm look the concept calls for, keep `filter: contrast(1.03) saturate(0.92) sepia(0.06);` and crop landscape/letterbox — never square. The `.hero-grain` overlay already sits above the image and makes photographs feel shot on film.

## Deployment

Designed to be deployed via GitHub Pages with the site files at the repo root (already the case after the `chore: move files to root` commit) — Settings → Pages → Deploy from branch → `main` → `/ (root)`.
