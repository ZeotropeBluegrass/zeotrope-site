# Zeotrope

Website for **Zeotrope**, a Cincinnati progressive bluegrass band.

Plain HTML, CSS and JavaScript. There is no build step, so every file here is served as-is by GitHub Pages.

## Structure

```
index.html  tour.html  bio.html  gallery.html  epk.html   the pages
README.md   TODO.md                                        docs and private notes (TODO.md is gitignored)
CNAME  .nojekyll  .gitignore                               config files that must stay at the root (see below)
css/      site.css is shared (colours are variables at the top); every other file is for one page
js/       nav.js (shared header, footer, social icons), tour.js (builds the Tour page), gallery.js (photo viewer)
data/     shows.csv is the tour dates: this is the file to edit (see data/README.md)
assets/   images, icons, posters and downloads (see below)
scripts/  serve.py, the local preview server
tests/    small tests for the tour-date logic
```

Pages are served as `/tour`, `/bio`, `/gallery` and `/epk` (GitHub Pages drops the `.html`). `epk.html` is unlisted: it is
not in the menu, so send the `/epk` link directly.

Why a few files stay at the root: GitHub Pages only reads `CNAME` (the custom domain `zeotropebluegrass.com`) and
`.nojekyll` (turns off Jekyll processing) from the top folder, and `.gitignore` must sit at the top of the repo.

### Assets

| Folder | What goes in it |
|---|---|
| `assets/favicons/` | Browser tab and phone home-screen icons (linked in each page's `<head>`) |
| `assets/brand/` | Logos, the page-title graphics and the social-share image (`og-logo.jpg`) |
| `assets/social/` | Facebook / Instagram / YouTube icons (see its README) |
| `assets/backgrounds/` | Full-page background photos |
| `assets/photos/` | Gallery and press photos. Full-size files here; ~720px copies in `thumbs/` with the same file name |
| `assets/posters/` | Show posters, same `thumbs/` layout |
| `assets/downloads/` | Stage plot PDFs |

File names are lowercase with dashes, no spaces. Posters are named `venue-YYYY-MM-DD.jpg`.

**Adding a photo or poster:** save the full-size file in `photos/` or `posters/`, make a ~720px-wide copy with the same
name in the `thumbs/` folder next to it, then copy one `<li>` block in `gallery.html`. The grid shows the thumbnail;
clicking opens the full-size file. Files must be real JPEGs (not renamed AVIF/WebP).

## Updating tour dates

Edit `data/shows.csv` (column guide in `data/README.md`) and commit. Shows move from Upcoming to Past by themselves.

## Previewing locally

You need Python 3 (nothing else to install). In this folder run:

```
python scripts/serve.py
```

then open http://localhost:8000. Stop it with Ctrl+C. Double-clicking `index.html` no longer works, because the tour
page has to fetch `data/shows.csv` and the menu uses clean addresses like `/tour`.

To run the tests (Node 18+): `node --test`

## Publishing

Pushing to the `main` branch publishes the site through GitHub Pages (usually live within a minute or two).
