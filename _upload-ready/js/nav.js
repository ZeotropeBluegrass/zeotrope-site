/*
 * Shared site header (logo + navigation).
 *
 * Every page loads this with a <script> tag placed right after <body>, so the
 * header is identical everywhere and lives in exactly one place.
 * To add or remove a nav item, edit NAV_LINKS below -- nothing else.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;

  // Site root, worked out from where this file was loaded (works from any page depth,
  // from a local file, a local server, or a GitHub Pages sub-path).
  var root = script.src.replace(/js\/nav\.js(?:\?.*)?$/, '');

  var NAV_LINKS = [
    { label: 'Home', path: 'index.html' },
    { label: 'Tour', path: 'pages/tour.html' },
    { label: 'Bio',  path: 'pages/about.html' },
    { label: 'Gallery', path: 'pages/gallery.html' },
    // EPK is intentionally unlisted. It lives at /epk/ (epk/index.html); share that URL directly.
    // { label: 'EPK', path: 'epk/index.html' },
    { label: 'Contact', path: 'pages/contact.html' }
    // { label: 'Media', path: 'pages/media.html' }
  ];

  // Treat "/", "/index", "/index.html" (and "/tour" vs "/tour.html") as the same page.
  function normalize(pathname) {
    return pathname.replace(/\/$/, '/index').replace(/\.html$/, '');
  }

  var current = normalize(location.pathname);

  var items = NAV_LINKS.map(function (link) {
    var href = root + link.path;
    var isActive = normalize(new URL(href, location.href).pathname) === current;
    return '<li><a href="' + href + '"' +
      (isActive ? ' class="active" aria-current="page"' : '') +
      '>' + link.label + '</a></li>';
  }).join('');

  var html =
    '<header class="site-header">' +
      '<nav class="nav-bar" aria-label="Main">' +
        '<a href="' + root + 'index.html" class="nav-logo">' +
          '<img src="' + root + 'assets/images/logo.svg" alt="Zeotrope Logo" class="nav-logo-img">' +
        '</a>' +
        '<ul class="nav-links">' + items + '</ul>' +
      '</nav>' +
    '</header>';

  // Favicon (tab icon) on every page that uses this header
  if (!document.querySelector('link[rel~="icon"]')) {
    var icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/svg+xml';
    icon.href = root + 'favicon.svg';
    document.head.appendChild(icon);
  }

  script.insertAdjacentHTML('afterend', html);
})();
