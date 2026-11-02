/* ==========================================================================
   Rosie & Joe — Wedding Site
   main.js
   - Hamburger menu toggle for mobile nav
   - Smooth scroll for in-page anchor links
   - Highlight the current page's nav link
   - Gentle scroll reveal for sections (respects reduced-motion)
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

  /* ---- Gentle scroll reveal --------------------------------------------- */
  function initScrollReveal() {
    var revealed = document.querySelectorAll(".reveal");
    if (!revealed.length) return;

    var prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No motion (by preference or lack of support): show everything at once.
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealed.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    revealed.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initSmoothScroll();
    initActiveLink();
    initScrollReveal();
  });
})();
