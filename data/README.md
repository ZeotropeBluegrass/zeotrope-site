# Editing the tour dates (`shows.csv`)

The Tour page reads this file every time it loads. Add a row, save, refresh -- no HTML to touch.
Shows move from **Upcoming** to **Past** on their own the day after their date.

| Column | What to put | Required? |
|---|---|---|
| `type` | `show` (default) or `residency` | yes |
| `date` | `YYYY-MM-DD`, e.g. `2026-03-21` | yes for shows |
| `date_label` | Text shown instead of the date, e.g. `First Tuesdays 2026` (used for residencies) | no |
| `venue` | Venue name | no |
| `city` | e.g. `Cincinnati, OH` (wrap in quotes because of the comma) | no |
| `event` | e.g. `supporting Dead Revival Band` | no |
| `link_url` | Full web address starting with `http://` or `https://`. Leave blank for no button. | no |
| `link_label` | Button text. Blank = `Tickets/Info` for upcoming shows, `Event Details` for past ones. | no |

Notes
- Residency rows always appear in the Residency section, in file order. Change `type` to `show` (and give it a `date`) once a residency ends if you want it to move to Past.
- Row order doesn't matter for shows; the page sorts them (upcoming soonest-first, past newest-first).
- Editing in Excel/Sheets is fine: save/export as **CSV (UTF-8)**.
- A row with a missing or malformed date is skipped (a warning appears in the browser console).
## Previewing on your computer (double-clicking `tour.html`)
Browsers won't let a page opened from your hard drive read `shows.csv`, so for local previews the page reads
`data/shows.js` instead -- an automatic copy of the CSV.

1. Edit and save `data/shows.csv`.
2. Double-click **`update-shows.bat`** (in the main site folder). It rebuilds `data/shows.js`.
3. Refresh `tour.html`.

Once the site is online (e.g. GitHub Pages) the page reads `shows.csv` directly, so step 2 is only for local
previews. Commit both files anyway so they stay in step. Never edit `shows.js` by hand; it gets overwritten.
