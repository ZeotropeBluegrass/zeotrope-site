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

## Previewing your changes

Run `python scripts/serve.py` in the main site folder, open http://localhost:8000/tour, edit and save `shows.csv`, then refresh.
(Browsers won't let a page opened by double-clicking read `shows.csv`, which is why the local server is needed.)
