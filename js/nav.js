/*
 * Shared site header (logo + navigation), footer, and social-link icons.
 *
 * Every page loads this with a <script> tag placed right after <body>, so the
 * header is identical everywhere and lives in exactly one place.
 *   - To add or remove a nav item, edit NAV_LINKS below.
 *   - To change a social link, edit SOCIAL_LINKS below (used by the footer and the home page).
 */
(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;

  // Site root, worked out from where this file was loaded (works from any page depth,
  // from a local server, or a GitHub Pages sub-path).
  var root = script.src.replace(/js\/nav\.js(?:\?.*)?$/, '');

  // Pages are linked with clean addresses: /tour, /bio, /gallery (no ".html").
  // GitHub Pages and serve.py both map those to the .html files.
  var NAV_LINKS = [
    { label: 'Home', path: '' },
    { label: 'Tour', path: 'tour' },
    { label: 'Bio', path: 'bio' },
    { label: 'Gallery', path: 'gallery' }
    // Contact info (booking email + social links) lives in the footer, not the menu.
    // The press kit is intentionally unlisted. It lives at /epk (epk.html); share that URL directly.
  ];

  var SOCIAL_LINKS = [
    { label: 'Facebook', href: 'https://www.facebook.com/p/Zeotrope-61574275161086/', icon: 'assets/social/facebook.png' },
    { label: 'Instagram', href: 'https://www.instagram.com/zeotropeband/', icon: 'assets/social/instagram.png' },
    { label: 'YouTube', href: 'https://www.youtube.com/@ZeotropeBluegrass', icon: 'assets/social/youtube.png' }
  ];

  var BOOKING_EMAIL = 'booking@zeotropebluegrass.com';

  // Opened by double-clicking a file? Clean addresses can't work there, so say how to preview properly.
  if (location.protocol === 'file:') {
    console.warn('Zeotrope: run "python scripts/serve.py" in the site folder and open http://localhost:8000 (see README).');
    document.addEventListener('DOMContentLoaded', function () {
      var note = document.createElement('p');
      note.textContent = 'Preview mode: links only work when the site is served. Run "python scripts/serve.py" (see README).';
      note.style.cssText = 'background:#aa2222;color:#fff;padding:8px 12px;margin:0;text-align:center;';
      document.body.insertBefore(note, document.body.firstChild);
    });
  } else if (/\.html$/.test(location.pathname)) {
    // Someone landed on /tour.html: quietly show /tour instead.
    history.replaceState(null, '', location.pathname.replace(/\.html$/, '') + location.search + location.hash);
  }

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
        '<a href="' + root + '" class="nav-logo">' +
          '<img src="' + root + 'assets/brand/logo.svg" alt="Zeotrope Logo" class="nav-logo-img">' +
        '</a>' +
        '<ul class="nav-links">' + items + '</ul>' +
      '</nav>' +
    '</header>';

  // The home page has no ribbon: it shows its own large logo and big buttons instead.
  if (document.body.classList.contains('home')) html = '';

  script.insertAdjacentHTML('afterend', html);

  // ---- Social icons ----
  // Fills every <ul data-social-links> (home page) and the footer list from SOCIAL_LINKS.
  // Add class "social-links--small" to the <ul> for the smaller footer-size icons.
  function fillSocialLinks(list) {
    var iconHeight = list.classList.contains('social-links--small') ? 24 : 32;
    list.innerHTML = SOCIAL_LINKS.map(function (s) {
      return '<li><a class="social-btn" href="' + s.href + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + root + s.icon + '" alt="" height="' + iconHeight + '"><span>' + s.label + '</span></a></li>';
    }).join('');
  }

  // If an icon file is missing, remove it so the text label shows instead.
  document.addEventListener('error', function (event) {
    var target = event.target;
    if (target && target.tagName === 'IMG' && target.closest('.social-btn')) target.remove();
  }, true);

  // ---- Footer: added to the end of every page ----
  function addFooter() {
    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<p class="footer-links"><a href="mailto:' + BOOKING_EMAIL + '">' + BOOKING_EMAIL + '</a></p>' +
      '<ul class="social-links social-links--icons social-links--small" data-social-links></ul>' +
      '<p class="footer-copy">&copy; ' + new Date().getFullYear() + ' Zeotrope</p>';
    document.body.appendChild(footer);
  }

  function init() {
    addFooter();
    Array.prototype.forEach.call(document.querySelectorAll('[data-social-links]'), fillSocialLinks);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
