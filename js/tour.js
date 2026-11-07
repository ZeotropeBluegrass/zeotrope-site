/*
 * Tour page: loads data/shows.csv and sorts every show into
 *   - Upcoming  (today or later, soonest first)
 *   - Past      (before today, newest first)
 *   - Residency (rows with type "residency", shown in file order)
 *
 * A show flips from Upcoming to Past automatically the day after its date.
 * Nothing here needs editing to add shows -- edit data/shows.csv instead.
 *
 * The CSV is fetched, so the page must be served (GitHub Pages, or "python scripts/serve.py" locally).
 */
(function () {
  'use strict';

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var INSTAGRAM_URL = 'https://www.instagram.com/zeotropeband/';

  // ---- CSV parsing (handles quoted fields, commas inside quotes, CRLF, Excel's BOM) ----
  function parseCSV(text) {
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;

    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field);
        field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field);
        field = '';
        rows.push(row);
        row = [];
      } else {
        field += c;
      }
    }
    if (field !== '' || row.length) {
      row.push(field);
      rows.push(row);
    }

    // drop completely blank lines
    return rows.filter(function (r) {
      return r.some(function (f) { return f.trim() !== ''; });
    });
  }

  // First row = column names; returns one object per remaining row.
  function rowsToRecords(rows) {
    if (!rows.length) return [];
    var header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (r) {
      var rec = {};
      header.forEach(function (name, i) { rec[name] = (r[i] || '').trim(); });
      return rec;
    });
  }

  // "2026-03-21" -> local Date at midnight, or null if it isn't a real date.
  function parseDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '');
    if (!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = +m[3];
    var date = new Date(y, mo, d);
    var real = date.getFullYear() === y && date.getMonth() === mo && date.getDate() === d;
    return real ? date : null;
  }

  // Date -> "Mar 21, 2026" (days under 10 are zero-padded: "Mar 05, 2026")
  function formatDate(date) {
    var day = String(date.getDate());
    if (day.length < 2) day = '0' + day;
    return MONTHS[date.getMonth()] + ' ' + day + ', ' + date.getFullYear();
  }

  // Sort records into upcoming / past / residency relative to `today` (a Date at midnight).
  function splitShows(records, today) {
    var out = { upcoming: [], past: [], residency: [] };

    records.forEach(function (rec) {
      var type = (rec.type || 'show').toLowerCase();

      if (type === 'residency') {
        rec._date = parseDate(rec.date);
        out.residency.push(rec);
        return;
      }

      var date = parseDate(rec.date);
      if (!date) {
        if (typeof console !== 'undefined') {
          console.warn('shows.csv: skipping row with missing/invalid date (use YYYY-MM-DD):', rec);
        }
        return;
      }
      rec._date = date;
      (date >= today ? out.upcoming : out.past).push(rec);
    });

    out.upcoming.sort(function (a, b) { return a._date - b._date; });
    out.past.sort(function (a, b) { return b._date - a._date; });
    return out;
  }

  // Only allow normal web links on buttons.
  function safeUrl(url) {
    return /^https?:\/\//i.test(url || '') ? url : '';
  }

  // ---- Rendering (built with textContent, so CSV text can never inject HTML) ----
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderEntry(rec, isUpcoming) {
    var entry = el('div', 'tour-entry');
    var info = el('div', 'tour-info');

    var dateText = rec.date_label || (rec._date ? formatDate(rec._date) : '');
    if (dateText) info.appendChild(el('span', 'date', dateText));
    if (rec.venue) info.appendChild(el('span', 'location', rec.venue));
    if (rec.city) info.appendChild(el('span', 'city', rec.city));
    if (rec.event) info.appendChild(el('span', 'event', rec.event));
    entry.appendChild(info);

    var url = safeUrl(rec.link_url);
    if (url) {
      var label = rec.link_label || (isUpcoming ? 'Tickets/Info' : 'Event Details');
      var link = el('a', 'tour-btn', label);
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      entry.appendChild(link);
    }
    return entry;
  }

  function fillList(container, records, isUpcoming) {
    container.textContent = '';
    records.forEach(function (rec) {
      container.appendChild(renderEntry(rec, isUpcoming));
    });
  }

  function showMessage(container, text, withInstagramLink) {
    container.textContent = '';
    var p = el('p', 'tour-empty', text);
    if (withInstagramLink) {
      var a = el('a', '', 'Instagram');
      a.href = INSTAGRAM_URL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      p.appendChild(a);
      p.appendChild(document.createTextNode('.'));
    }
    container.appendChild(p);
  }

  function render(groups) {
    var upcomingList = document.getElementById('upcoming-list');
    var residencySection = document.getElementById('residency-section');
    var residencyList = document.getElementById('residency-list');
    var pastSection = document.getElementById('past-section');
    var pastList = document.getElementById('past-list');

    if (groups.upcoming.length) {
      fillList(upcomingList, groups.upcoming, true);
    } else {
      showMessage(upcomingList, 'No upcoming shows right now — follow us on ', true);
    }

    residencySection.hidden = groups.residency.length === 0;
    if (groups.residency.length) fillList(residencyList, groups.residency, true);

    pastSection.hidden = groups.past.length === 0;
    if (groups.past.length) fillList(pastList, groups.past, false);
  }

  // ---- Getting the CSV text ----
  function loadCsv(csvUrl) {
    return fetch(csvUrl, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + csvUrl);
      return res.text();
    });
  }

  // ---- Start-up (browser only) ----
  function init(scriptSrc) {
    var upcomingList = document.getElementById('upcoming-list');
    if (!upcomingList) return;

    // Browsers refuse to fetch() other files when a page is opened by double-clicking it.
    if (location.protocol === 'file:') {
      showMessage(upcomingList, 'Preview mode: run "python scripts/serve.py" in the site folder, then open http://localhost:8000.', false);
      return;
    }

    loadCsv(new URL('../data/shows.csv', scriptSrc).href)
      .then(function (text) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        render(splitShows(rowsToRecords(parseCSV(text)), today));
      })
      .catch(function (err) {
        console.error('Could not load the show dates:', err);
        showMessage(upcomingList, 'Show dates could not be loaded right now. Please check back soon.', false);
      });
  }

  if (typeof document !== 'undefined' && document.currentScript) {
    init(document.currentScript.src);
  }

  // Lets the date logic be tested outside a browser.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      parseCSV: parseCSV,
      rowsToRecords: rowsToRecords,
      parseDate: parseDate,
      formatDate: formatDate,
      splitShows: splitShows
    };
  }
})();
