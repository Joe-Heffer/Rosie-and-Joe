# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static, mobile-first wedding website for Rosie & Joe, built with vanilla HTML, CSS and JavaScript — no frameworks, no build tools, no server-side processing. It runs anywhere static files can be hosted, including GitHub Pages.

- **Date:** Saturday 17 April 2027
- **Venue:** Eyam Hall, Eyam, Derbyshire

## Running locally

There is no build step. Open any `.html` file directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`). All paths are relative, so both approaches work.

There are no tests, linters, or package manifests in this repo. `.github/workflows/ci.yml` runs `html-proofer` (link/image/HTML validity checks, with `cake/index.html` excluded), `node --check` on `js/main.js` and `js/book-intro.js`, and `scripts/check-unused-files.py` (fails if any tracked file under `images/`, `css/`, or `js/` isn't referenced by filename from any tracked HTML/CSS/JS source) on every push/PR.

## Architecture

Eight pages share a common header/footer markup pattern (via custom elements, see below) and a single stylesheet/script, plus one unlinked private page:

- `index.html` — Home (hero with grain + botanical mark, welcome note, CTAs)
- `details.html` — The Day (ceremony, reception, dress code, schedule timeline)
- `rsvp.html` — RSVP (intro + live Google Form embed, on a limestone band)
- `travel.html` — Getting Here (directions + live Google Maps embed)
- `accommodation.html` — Where to stay near the venue
- `gift.html` — Gift / honeymoon fund info
- `evening/index.html` — Evening-only guests page (one directory deep; keeps its own simplified inline header instead of `<site-header>`, since its nav has no links and the shared header's page links are relative to the site root)
- `save-the-date/index.html` — standalone save-the-date card; fully self-contained with inline `<style>` and no shared header/footer/nav — not part of the templating system below
- `table-plan.html` — private seating/table-plan page, `<meta name="robots" content="noindex, nofollow">` like `evening/index.html`; not linked from any nav or other page, uses the shared header/footer and design system
- `css/style.css` — entire design system and all styles
- `js/main.js` — mobile nav toggle, smooth scroll, active-nav-link highlighting, scroll reveal
- `js/book-intro.js` — home-page-only entrance animation: sets `html.book-intro-play` from `<head>` so the `.book-intro` overlay in `index.html` shows before first paint, then a clothbound book opens, two leaves turn onto a two-page spread of `images/eyam-hall-watercolour.jpg` (edges pre-feathered to `--ivory`) and the overlay fades into the site (~4.4s). Plays once per browser session (`sessionStorage`), skipped under `prefers-reduced-motion`, and any click or key press skips to the fade. Styles live in the "Book intro" section of `css/style.css`
- `js/components.js` — defines the `<site-header>` / `<site-footer>` custom elements (see "Shared header/footer" below)
- `images/icons.svg` — shared SVG icon sprite; pages reference icons via `<svg class="icon"><use href="images/icons.svg#icon-name"></use></svg>` instead of duplicating `<symbol>` defs inline
- `images/` — hero/gallery images
- `cake/index.html` — a large (~26 MB) bundled artifact, not hand-authored like the rest of the site; deliberately excluded from CI and out of scope for site maintenance

### Shared header/footer markup (no build step)

There's no templating engine or build step, so duplication across pages is handled with light-DOM custom elements instead. `js/components.js` defines `<site-header>` and `<site-footer>`, which render their real `<header>`/`<footer>` markup into themselves via `innerHTML` in `connectedCallback()` — no Shadow DOM, so the existing global stylesheet still applies via ordinary class selectors. Pages include it as `<script src="js/components.js"></script>` **synchronously in `<head>`** (not deferred), so the elements are defined and upgraded before the parser reaches their tags in `<body>` — by the time `js/main.js`'s `DOMContentLoaded` handlers run, the nav/footer markup is already real. `css/style.css` sets `site-header, site-footer { display: contents; }` so the wrapper element doesn't break the header's `position: sticky` behaviour. Usage:

```html
<site-header></site-header>
<!-- … -->
<site-footer></site-footer>
```

The header/footer's home link and images are built from `ROOT`, the site root worked out from `components.js`'s own URL, so they resolve both on the live domain and under a PR preview sub-path. Avoid root-relative (`/…`) paths anywhere in the site for the same reason. The `logo` attribute is optional (defaults to "Rosie & Joe"). `evening/index.html` is the one exception — it keeps an inline simplified `<header>` rather than `<site-header>`.

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

There are no remaining `<!-- TODO -->` or bracketed placeholders anywhere in the site — all copy, the Google Form embeds (main and evening RSVP), and the Google Maps embed are live.

### Embedding the Google Form (RSVP)

`rsvp.html` already embeds a live Google Form (`<iframe src="https://docs.google.com/forms/...">`). To point it at a different form, replace that `src` with the new form's embed URL. The surrounding `.embed` section is already styled for `width="100%" height="900"`.

### Embedding the Google Map (Getting Here)

`travel.html` already embeds a live Google Map (`<iframe src="https://maps.google.com/maps?q=...">`). To change the location, replace that `src` with a new embed URL from Google Maps' **Share → Embed a map**.

### Adding a hero image

The hero background image is already wired in via `.hero__bg` in `css/style.css` (around line 391; there's also a `.hero--evening` variant used on `evening/index.html`). To swap the photo, add the new image to `images/` and update the `background-image` value there. For the Ektar/35mm look the concept calls for, keep `filter: contrast(1.03) saturate(0.92) sepia(0.06);` and crop landscape/letterbox — never square. The `.hero-grain` overlay already sits above the image and makes photographs feel shot on film.

The home hero has two light motion layers. `.hero__life` uses `images/eyam-hall-life.svg`, which adds smoke rising from two chimney pots, pink petals drifting down from the blossom tree, the shrub below the door and the climbing roses, and a butterfly flitting about the roses by the door in `images/eyam-hall-sketch.jpg`. It is drawn in that image's pixel coordinates (816×1301) with the same `center 62% / cover` geometry and edge mask as `.hero__bg`. If the home image or its `background-position` changes, move the smoke, petal and butterfly positions to match. On wide, short viewports the cover crop cuts off the top of the sketch, so the chimney smoke shows only on taller screens such as phones. `.hero__birds` holds three `.hero__bird` spans, each carrying a small inline SVG bird silhouette across the sky every 52s. The birds flap in short bursts and glide, each on its own rhythm; the SVGs are inline in `index.html` (not a shared image) so every bird can have its own animation timing. Both are hidden under `prefers-reduced-motion` and in print.

The evening hero also has a `.hero__lights` layer: `images/fairy-lights.svg` places a twinkling golden glow, with a soft amber shadow behind it, over each fairy-light bulb in `images/barn-hall-watercolour.jpg`, using that image's pixel coordinates (1376×768) and the same `center 62% / cover` background geometry so it stays aligned. If the evening image or its `background-position` changes, regenerate the bulb positions or update the layer to match. The layer is hidden under `prefers-reduced-motion` and in print.

## Deployment

GitHub Pages serves the `gh-pages` branch (Settings → Pages → Deploy from branch → `gh-pages` → `/ (root)`), on the custom domain in `CNAME`.

* `.github/workflows/deploy.yml` publishes `main` to the root of `gh-pages` on every push to `main` (or by hand via **Run workflow**).
* `.github/workflows/pr-preview.yml` publishes each same-repo pull request to `https://rosieandjoe.uk/pr-preview/pr-<n>/` using `rossjrw/pr-preview-action`, comments the link on the PR, and removes the preview when the PR closes. On its first run it also seeds the `gh-pages` root with `main` if the live site isn't there yet.
