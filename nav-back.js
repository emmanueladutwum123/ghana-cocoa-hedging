/*
 * nav-back.js — the back control, and the active-tab highlight.
 *
 * This exists because the site is usable in full screen and as an installed
 * PWA (manifest.json declares it), and in both of those there is no browser
 * chrome: no back arrow, no address bar. Two of the pages were also complete
 * dead ends -- calculator.html and research.html shipped with a placeholder
 * comment where the navigation should have been and contained no link to
 * anywhere -- so a visitor who opened the calculator could not leave it.
 */
(function () {
  'use strict';

  function sameOriginReferrer() {
    if (!document.referrer) return false;
    try {
      return new URL(document.referrer).origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function init() {
    var btn = document.getElementById('navBack');
    if (!btn) return;

    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var isHome = here === '' || here === 'index.html';

    // On the home page there is nowhere to go back to, so the control stays
    // hidden rather than sitting there doing nothing.
    if (isHome) return;
    btn.hidden = false;

    btn.addEventListener('click', function () {
      // Prefer real history so the back button behaves the way the browser's
      // would. Fall back to the home page when the visitor arrived directly,
      // from a bookmark, or from an external link -- history.back() would
      // otherwise leave the site entirely or do nothing at all.
      if (window.history.length > 1 && sameOriginReferrer()) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });

    // Alt+Left as a keyboard equivalent, matching the browser shortcut.
    document.addEventListener('keydown', function (e) {
      if (e.altKey && e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        btn.click();
      }
    });
  }

  // Mark the current page in the nav, so the highlight cannot drift out of
  // sync with the file it is copied into.
  function markActive() {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
      var target = a.getAttribute('href').split('/').pop().toLowerCase();
      var match = target === here || (here === '' && target === 'index.html');
      a.classList.toggle('active', match);
      if (match) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); markActive(); });
  } else {
    init(); markActive();
  }
}());
