// Run with:  node --test        (Node 18+; nothing to install)
const test = require('node:test');
const assert = require('node:assert');
const { parseCSV, rowsToRecords, parseDate, formatDate, splitShows } = require('../js/tour.js');

test('parseCSV handles quoted commas, CRLF and a BOM', () => {
  const rows = parseCSV('﻿a,b\r\n"Cincinnati, OH",x\r\n');
  assert.deepStrictEqual(rows, [['a', 'b'], ['Cincinnati, OH', 'x']]);
});

test('parseDate accepts real dates only', () => {
  assert.ok(parseDate('2026-03-21'));
  assert.strictEqual(parseDate('2026-02-30'), null);
  assert.strictEqual(parseDate('03/21/2026'), null);
  assert.strictEqual(parseDate(''), null);
});

test('formatDate zero-pads the day', () => {
  assert.strictEqual(formatDate(new Date(2026, 2, 5)), 'Mar 05, 2026');
});

test('splitShows sorts upcoming/past/residency and skips bad dates', () => {
  const today = new Date(2026, 5, 1);
  const csv = [
    'type,date,date_label,venue',
    'show,2026-06-01,,Today',
    'show,2026-07-01,,Later',
    'show,2026-05-31,,Yesterday',
    'show,2026-01-01,,Older',
    'show,not-a-date,,Broken',
    'residency,,First Tuesdays,Hi-Mark'
  ].join('\n');
  const warn = console.warn; console.warn = () => {};
  const out = splitShows(rowsToRecords(parseCSV(csv)), today);
  console.warn = warn;
  assert.deepStrictEqual(out.upcoming.map(r => r.venue), ['Today', 'Later']);
  assert.deepStrictEqual(out.past.map(r => r.venue), ['Yesterday', 'Older']);
  assert.deepStrictEqual(out.residency.map(r => r.venue), ['Hi-Mark']);
});
