/*
 * Click-to-enlarge viewer for every .gallery-grid on a page (Gallery page, EPK press photos).
 *
 * - Each grid is its own set: the arrows / left-right keys move within that grid only.
 * - Esc, the X, or clicking the dark area closes it.
 * - A link with a "download" attribute also gets a Download link inside the viewer.
 * - A link can set data-caption="..." to override the caption text shown in the viewer.
 *
 * Progressive enhancement: without JavaScript, each image is simply a link to the
 * full-size file, so nothing breaks.
 */
(function () {
  'use strict';

  var grids = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid'));
  if (!grids.length || typeof HTMLDialogElement === 'undefined') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML =
    '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lb-prev" aria-label="Previous image">&#8249;</button>' +
    '<figure><img alt=""><figcaption></figcaption><a class="lb-download" download hidden>Download full-size</a></figure>' +
    '<button type="button" class="lb-next" aria-label="Next image">&#8250;</button>';
  document.body.appendChild(dialog);

  var img = dialog.querySelector('img');
  var caption = dialog.querySelector('figcaption');
  var download = dialog.querySelector('.lb-download');
  var links = [];   // the set currently open
  var current = 0;

  // Caption text for the viewer: drops the Download link and puts " · " before photo credits
  function captionText(fig) {
    var c = fig.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll('.dl'), function (n) { n.remove(); });
    Array.prototype.forEach.call(c.querySelectorAll('.credit'), function (n) { n.textContent = ' \u00b7 ' + n.textContent; });
    return c.textContent;
  }

  function show(index) {
    current = (index + links.length) % links.length;
    var link = links[current];
    var thumb = link.querySelector('img');
    var figcaption = link.parentNode.querySelector('figcaption');

    img.src = link.href;
    img.alt = thumb ? thumb.alt : '';
    caption.textContent = link.hasAttribute('data-caption')
      ? link.getAttribute('data-caption')
      : (figcaption ? captionText(figcaption) : '');

    if (link.hasAttribute('download')) {
      download.href = link.href;
      download.hidden = false;
    } else {
      download.hidden = true;
    }
  }

  grids.forEach(function (grid) {
    var set = Array.prototype.slice.call(grid.querySelectorAll('a[data-lightbox]'));
    set.forEach(function (link, i) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        links = set;
        show(i);
        document.body.style.overflow = 'hidden';
        dialog.showModal();
      });
    });
  });

  dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });

  // Click on the dark area (not the image, caption or buttons) to close
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog || event.target.tagName === 'FIGURE') dialog.close();
  });

  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { show(current - 1); }
    else if (event.key === 'ArrowRight') { show(current + 1); }
  });

  // Fires for Esc, the X, and backdrop clicks alike
  dialog.addEventListener('close', function () {
    document.body.style.overflow = '';
    img.removeAttribute('src');
  });
})();
