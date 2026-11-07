# Zeotrope

Website for **Zeotrope**, a Cincinnati progressive bluegrass band.

Plain HTML, CSS and JavaScript. There is no build step, so every file here is served as-is by GitHub Pages.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Home page |
| `tour.html`, `bio.html`, `gallery.html` | Pages, served as `/tour`, `/bio`, `/gallery` (GitHub Pages drops the `.html`) |
| `pages/`, `epk/` | Only small redirect stubs for old links; safe to ignore |
| `epk.html` | Press kit, served at `/epk`. Unlisted: it is not in the menu, so send the `/epk` link directly |
| `css/` | `site.css` is shared; every other file is for one page |
| `js/nav.js` | The shared header and menu. Edit it once to change every page |
| `js/tour.js` | Builds the Tour page from `data/shows.csv` |
| `js/gallery.js` | Photo viewer |
| `data/shows.csv` | **Tour dates.** This is the file to edit; see `data/README.md` |
| `assets/` | Images, posters and downloads |
| `favicon.svg` | Browser tab icon |

## Updating tour dates

Edit `data/shows.csv` (column guide in `data/README.md`) and commit. Shows move from Upcoming to Past by themselves.
`data/shows.js` is a generated copy used only for previewing from disk. Run `update-shows.bat` after editing the CSV
and commit both files.

## Previewing locally

Double-click `index.html`. Some features (the YouTube embed) only work once the site is online or served locally:
`python -m http.server` in this folder, then open http://localhost:8000.

## Publishing

Pushing to the `main` branch publishes the site through GitHub Pages (usually live within a minute or two).
