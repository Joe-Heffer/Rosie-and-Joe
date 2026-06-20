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

- `index.html` — Home (hero, welcome, CTAs)
- `details.html` — The Day (ceremony, reception, dress code)
- `rsvp.html` — RSVP (intro + Google Form embed)
- `travel.html` — Getting Here (directions + Google Maps embed)
- `css/style.css` — entire design system and all styles
- `js/main.js` — mobile nav toggle, smooth scroll, active-nav-link highlighting
- `images/` — drop hero/gallery images here (currently empty aside from `.gitkeep`)

### Design system

All colours, fonts and spacing are CSS custom properties in the `:root` block at the top of `css/style.css`, so the whole look is re-themed from one place:

- **Fonts:** Cormorant Garamond (serif headings) + Montserrat (sans-serif body), loaded from Google Fonts.
- **Palette:** cream background, charcoal text, dusty-rose accent.
- **Spacing:** a `--space-*` scale.
- **Responsive:** mobile-first, single breakpoint at `768px`.
- **Utilities:** `.container`, `.section`, `.btn` / `.btn--outline`.

### Placeholder content

Placeholder copy throughout the pages is marked with `<!-- TODO -->` comments — search for `TODO` to find everything that still needs real content (e.g. hero tagline, welcome copy, hero background image).

### Embedding the Google Form (RSVP)

In `rsvp.html`, find the block marked `<!-- GOOGLE FORM EMBED: replace src with your form URL -->`. Uncomment the `<iframe>`, replace the placeholder `src` with the form URL, and delete the `.embed__placeholder` div directly below it. The surrounding `.embed` section is already styled for `width="100%" height="900"`.

### Embedding the Google Map (Getting Here)

Same pattern in `travel.html`: find `<!-- GOOGLE MAPS EMBED: replace src with your Google Maps embed URL -->`, uncomment the `<iframe>` with the real `src`, and delete the placeholder div below it.

### Adding a hero image

Add the image to `images/` (e.g. `images/hero.jpg`), then in `css/style.css` find the `.hero` rule and swap the placeholder `background-color` for the commented-out `background: url(...)` line.

## Deployment

Designed to be deployed via GitHub Pages with the site files at the repo root (already the case after the `chore: move files to root` commit) — Settings → Pages → Deploy from branch → `main` → `/ (root)`.
