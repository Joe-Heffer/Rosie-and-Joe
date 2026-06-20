# Rosie &amp; Joe — Wedding Website

A static, mobile-first wedding website built with **vanilla HTML, CSS and JavaScript**.
No frameworks, no build tools, no server-side processing — it runs anywhere static
files can be hosted, including GitHub Pages.

- **Couple:** Rosie &amp; Joe
- **Date:** Saturday 17 April 2027
- **Venue:** Eyam Hall, Eyam, Derbyshire

## Project structure

```
wedding-site/
├── index.html        # Home — hero, welcome, CTAs
├── details.html      # The Day — ceremony, reception, dress code
├── rsvp.html         # RSVP — intro + Google Form embed placeholder
├── travel.html       # Getting Here — by car, public transport, map placeholder
├── css/
│   └── style.css     # Design system (CSS custom properties) + all styles
├── js/
│   └── main.js       # Mobile nav toggle, smooth scroll, active nav link
├── images/
│   └── .gitkeep      # Drop hero / gallery images here
└── README.md
```

### Design system

All colours, fonts and spacing live as CSS custom properties at the top of
`css/style.css` (the `:root` block) so the whole look can be re-themed in one place:

- **Fonts:** Cormorant Garamond (serif headings) + Montserrat (sans-serif body), loaded from Google Fonts.
- **Palette** ("Walled Garden in Winter Light"):

  | Name | Hex | Use |
  |---|---|---|
  | Ivory | `#F6F2EA` | Canvas/background (not pure white) |
  | Stone | `#352F28` | Body text (warm near-black) |
  | Sage | `#7E9178` | Botanical accents, fine rules |
  | Terra | `#A8573D` | Single warm accent — date, one button, link hovers, active nav |
  | Taupe | `#9A8F82` | Secondary text, section labels |
  | Limestone | `#EAE5DC` | Inset surfaces (RSVP band, hero/map placeholders) |

  There's also `--rule`, Sage at ~35% opacity, used for hairline dividers.
- **Spacing:** a consistent `--space-*` scale.
- **Responsive:** mobile-first with a single breakpoint at `768px`.
- **Utilities:** `.container`, `.section`, `.btn` (and `.btn--outline`).

Placeholder copy throughout the pages is marked with `<!-- TODO -->` comments — search for `TODO` to find everything that still needs real content.

## How to swap in the Google Form (RSVP)

1. In Google Forms, open your RSVP form and click **Send → `< >` (embed HTML)**.
2. Copy the `<iframe …>` snippet Google gives you (or just the `src` URL).
3. Open `rsvp.html` and find the block marked:
   ```html
   <!-- GOOGLE FORM EMBED: replace src with your form URL -->
   ```
4. **Uncomment** the `<iframe>` and replace the placeholder `src` with your form URL.
5. **Delete** the `<div class="embed__placeholder">…</div>` block directly below it.

The surrounding `.embed` section is already styled, so the form will sit naturally
on the page at `width="100%"` and `height="900"`.

## How to swap in the Google Map (Getting Here)

The same pattern applies in `travel.html`:

1. In Google Maps, search your venue, click **Share → Embed a map**, and copy the `<iframe>` HTML.
2. Find the block marked `<!-- GOOGLE MAPS EMBED: replace src with your Google Maps embed URL -->`.
3. Uncomment the `<iframe>` (swap in your `src`) and delete the placeholder `<div>` below it.

## Adding a hero image

The home-page hero currently uses a placeholder colour. To use a full-bleed photo:

1. Add your image to `images/` (e.g. `images/hero.jpg`).
2. In `css/style.css`, find the `.hero` rule and replace the placeholder
   `background-color` with the commented-out `background` line, pointing at your image.

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
