/* ==========================================================================
   Rosie & Joe — Wedding Site
   book-intro.js
   - Home-page entrance: a clothbound book opens, a few leaves turn, then
     the page dissolves into the site.
   - Loaded synchronously in <head> so the html class is set before first
     paint (no flash of the page underneath).
   - Plays once per browser session; skipped under prefers-reduced-motion;
     any click, tap or key press skips straight to the fade.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "rj-book-intro-seen";
  var LEAVE_AT = 3300; // ms after load: begin dissolving into the site
  var LEAVE_FOR = 1100; // ms: matches the .book-intro fade in style.css

  var root = document.documentElement;

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch (e) {
    // Storage blocked: play the intro anyway, it's short.
  }

  root.classList.add("book-intro-play");

  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.querySelector(".book-intro");
    if (!overlay) {
      root.classList.remove("book-intro-play");
      return;
    }

    var leaving = false;
    var timer = window.setTimeout(leave, LEAVE_AT);

    function leave() {
      if (leaving) return;
      leaving = true;
      window.clearTimeout(timer);
      document.removeEventListener("keydown", leave);
      root.classList.add("book-intro-leaving");
      window.setTimeout(function () {
        root.classList.remove("book-intro-play", "book-intro-leaving");
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, LEAVE_FOR);
    }

    overlay.addEventListener("click", leave);
    document.addEventListener("keydown", leave);
  });
})();
