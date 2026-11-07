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

  // Home links point at the site root ("/") so the address bar never shows /index.html.
  // Opened straight from disk (file://) there is no web server to pick the index file, so use index.html there.
  var homePath = location.protocol === 'file:' ? 'index.html' : '';

  var NAV_LINKS = [
    { label: 'Home', path: homePath },
    { label: 'Tour', path: 'pages/tour.html' },
    { label: 'Bio',  path: 'pages/about.html' },
    { label: 'Gallery', path: 'pages/gallery.html' }
    // Contact info (booking email + social links) lives in the footer (see FOOTER below), not the menu.
    // EPK is intentionally unlisted. It lives at /epk/ (epk/index.html); share that URL directly.
    // { label: 'EPK', path: 'epk/index.html' },
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
        '<a href="' + root + homePath + '" class="nav-logo">' +
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

  // FOOTER: added to the end of every page. Edit the links/text here.
  function addFooter() {
    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<p class="footer-links">' +
        '<a href="mailto:booking@zeotropebluegrass.com">booking@zeotropebluegrass.com</a>' +
      '</p>' +
      '<p class="footer-links">' +
        '<a href="https://www.facebook.com/p/Zeotrope-61574275161086/" target="_blank" rel="noopener noreferrer">Facebook</a>' +
        '<span aria-hidden="true"> &middot; </span>' +
        '<a href="https://www.instagram.com/zeotropeband/" target="_blank" rel="noopener noreferrer">Instagram</a>' +
        '<span aria-hidden="true"> &middot; </span>' +
        '<a href="https://www.youtube.com/@ZeotropeBluegrass" target="_blank" rel="noopener noreferrer">YouTube</a>' +
      '</p>' +
      '<p class="footer-copy">&copy; ' + new Date().getFullYear() + ' Zeotrope</p>';
    document.body.appendChild(footer);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFooter);
  } else {
    addFooter();
  }
})();
