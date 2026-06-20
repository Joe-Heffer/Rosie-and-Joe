/* ==========================================================================
   Rosie & Joe — Wedding Site
   main.js
   - Hamburger menu toggle for mobile nav
   - Smooth scroll for in-page anchor links
   - Highlight the current page's nav link
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ------------------------------------------------ */
  function initNavToggle() {
    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelector(".nav__links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu when a link is tapped (useful on mobile).
    links.addEventListener("click", function (event) {
      if (event.target.classList.contains("nav__link")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Smooth scroll for anchor links ----------------------------------- */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        var id = anchor.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---- Active nav link based on current page ---------------------------- */
  function initActiveLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".nav__link");
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initSmoothScroll();
    initActiveLink();
  });
})();
