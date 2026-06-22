[![CI](https://github.com/Joe-Heffer/Rosie-and-Joe/actions/workflows/ci.yml/badge.svg)](https://github.com/Joe-Heffer/Rosie-and-Joe/actions/workflows/ci.yml)
[![pages-build-deployment](https://github.com/Joe-Heffer/Rosie-and-Joe/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Joe-Heffer/Rosie-and-Joe/actions/workflows/pages/pages-build-deployment)

# Rosie &amp; Joe — Wedding Website

A static, mobile-first wedding website built with **vanilla HTML, CSS and JavaScript**.
No frameworks, no build tools, no server-side processing — it runs anywhere static
files can be hosted, including GitHub Pages.

- **Couple:** Rosie &amp; Joe
- **Date:** Saturday 17 April 2027
- **Venue:** Eyam Hall, Eyam, Derbyshire

## Project structure

```
.
├── index.html              # Home — hero, welcome, CTAs
├── details.html            # The Day — ceremony, reception, dress code, schedule
├── rsvp.html                # RSVP — intro + Google Form embed
├── travel.html              # Getting Here — by car, public transport, map
├── accommodation.html       # Where to stay near the venue
├── gift.html                 # Gift / honeymoon fund info
├── evening/index.html        # Evening-only guests page
├── save-the-date/index.html  # Standalone save-the-date card
├── css/
│   └── style.css     # Design system (CSS custom properties) + all styles
├── js/
│   ├── main.js        # Mobile nav toggle, smooth scroll, active nav link, scroll reveal
│   └── components.js  # <site-header> / <site-footer> custom elements, shared markup
├── images/
│   ├── icons.svg      # Shared SVG icon sprite, referenced via <use> on every page
│   └── …              # Hero / gallery photos
├── favicon.svg
└── README.md
```

### Design system

All colours, fonts and spacing live as CSS custom properties at the top of
`css/style.css` (the `:root` block) so the whole look can be re-themed in one place:

- **Fonts** (Google Fonts): **Cormorant** 300 italic for display (hero names, headings, date), **Cormorant SC** for small-caps section labels, **Spectral** 300 for body prose, **Jost** 200/300 for utility text (nav, buttons, times).
- **Palette** ("Walled Garden in Winter Light"):

  | Name      | Hex       | Use                                                            |
  | --------- | --------- | -------------------------------------------------------------- |
  | Ivory     | `#F6F2EA` | Canvas/background (not pure white)                             |
  | Stone     | `#352F28` | Body text (warm near-black)                                    |
  | Sage      | `#7E9178` | Botanical accents, fine rules                                  |
  | Terra     | `#A8573D` | Single warm accent — date, one button, link hovers, active nav |
  | Taupe     | `#9A8F82` | Secondary text, section labels                                 |
  | Limestone | `#EAE5DC` | Inset surfaces (RSVP band)              |

  There's also `--rule`, Sage at ~35% opacity, used for hairline dividers.

- **Spacing:** a consistent `--space-*` scale.
- **Responsive:** mobile-first with a single breakpoint at `768px`.
- **Utilities:** `.container`, `.section` / `.section--alt`, `.btn` (and `.btn--outline`), `.detail`, `.timeline`, `.link-list`, `.embed`.

### Shared header/footer markup

There's no build step or templating engine, so `index.html`, `details.html`,
`rsvp.html`, `travel.html`, `accommodation.html` and `gift.html` each include
`js/components.js`, which defines two custom elements:

```html
<site-header></site-header>
<!-- … -->
<site-footer></site-footer>
```

`js/components.js` is loaded synchronously in `<head>` (not deferred), so the
elements render their markup before the parser reaches their tags in
`<body>` — there's no flash of empty content, and `js/main.js`'s
`DOMContentLoaded` handlers see fully-rendered nav/footer markup. The
`evening/index.html` page keeps its own simplified inline header instead,
since its nav has no links (the page lives one directory below the root and
the shared header's links are root-relative).

Icons are defined once in `images/icons.svg` and referenced from every page via
`<svg class="icon"><use href="images/icons.svg#icon-name"></use></svg>`.

## How to swap in the Google Form (RSVP)

`rsvp.html` already embeds a live Google Form. To point it at a different
form: in Google Forms, open **Send → `< >` (embed HTML)**, copy the `src` URL,
and replace the existing `<iframe src="…">` in `rsvp.html`.

## How to swap in the Google Map (Getting Here)

`travel.html` already embeds a live Google Map. To change the location,
generate a new embed URL via **Share → Embed a map** in Google Maps and
replace the existing `<iframe src="…">` in `travel.html`.

## Adding a hero image

The hero background image is set in `css/style.css` on the `.hero__bg` rule.
To swap it, add the new image to `images/` and update the `background-image`
(or `background`) value there — for the Ektar/35mm look the design calls
for, keep `filter: contrast(1.03) saturate(0.92) sepia(0.06);` and crop
landscape/letterbox, never square. The `.hero-grain` overlay already sits
above the image and makes photographs feel shot on film.

## Continuous integration

`.github/workflows/ci.yml` runs on every push/PR:

- **html-proofer** — checks links, images and HTML validity across the site (`cake/index.html` is excluded — see below).
- **js-syntax** — `node --check js/main.js`.

### A note on `cake/`

`cake/index.html` is a large (~26 MB) bundled artifact, not hand-authored
like the rest of the site, and is deliberately excluded from CI. It's left
as-is and out of scope for the templating/cleanup work described above.

## Deploying to GitHub Pages

1. Commit and push this project to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select your branch (e.g. `main`) and a folder:
   - If the site lives in a `wedding-site/` subfolder, either choose the
     **`/docs`** option after renaming the folder to `docs/`, **or** move the
     contents of `wedding-site/` to the repository root, **or** use a Pages
     workflow. The simplest route is to host the site files at the repo root.
5. Click **Save**. GitHub will publish the site at
   `https://<username>.github.io/<repository>/` within a minute or two.

> **Tip:** Because everything is static and uses relative paths, the site also
> works by simply opening `index.html` in a browser, or via any static file
> host (Netlify, Cloudflare Pages, etc.).

## AI usage

This repository's code, markup and styling were developed with assistance
from [Claude Code](https://claude.com/claude-code), Anthropic's AI coding
assistant. All AI-assisted changes are reviewed by a human before being
committed. Wedding-specific content — copy, schedule, venue details and the
like — is authored and approved by Rosie &amp; Joe.
