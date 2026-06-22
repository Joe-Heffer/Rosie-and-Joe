/* ==========================================================================
   Rosie & Joe — Wedding Site
   components.js
   - <site-header> / <site-footer> custom elements, shared across pages
   - No build step: include this script (un-deferred) before the elements
     are parsed so they upgrade synchronously and the rest of the page
     (including js/main.js) sees real markup, not an empty tag.
   ========================================================================== */
(function () {
  "use strict";

  var HEADER_HTML =
    '<header class="site-header">' +
    '<div class="container">' +
    '<nav class="nav" aria-label="Primary">' +
    '<a class="nav__logo" href="/">{{LOGO}}</a>' +
    '<button class="nav__toggle" type="button" aria-label="Toggle navigation menu" aria-controls="primary-menu" aria-expanded="false">' +
    "<span></span><span></span><span></span>" +
    "</button>" +
    '<ul class="nav__links" id="primary-menu">' +
    '<li><a class="nav__link" href="/"><svg class="icon"><use href="images/icons.svg#icon-home"></use></svg>Home</a></li>' +
    '<li><a class="nav__link" href="details.html"><svg class="icon"><use href="images/icons.svg#icon-calendar"></use></svg>The Day</a></li>' +
    '<li><a class="nav__link" href="rsvp.html"><svg class="icon"><use href="images/icons.svg#icon-envelope"></use></svg>RSVP</a></li>' +
    '<li><a class="nav__link" href="travel.html"><svg class="icon"><use href="images/icons.svg#icon-compass"></use></svg>Getting Here</a></li>' +
    '<li><a class="nav__link" href="accommodation.html"><svg class="icon"><use href="images/icons.svg#icon-bed"></use></svg>Stay</a></li>' +
    '<li><a class="nav__link" href="gift.html"><svg class="icon"><use href="images/icons.svg#icon-gift"></use></svg>Gifts</a></li>' +
    "</ul>" +
    "</nav>" +
    "</div>" +
    "</header>";

  var FOOTER_HTML =
    '<footer class="site-footer">' +
    '<svg class="botanical site-footer__ornament" viewBox="0 0 40 72" aria-hidden="true" focusable="false">' +
    '<path d="M20 71 C20 50 19 28 20 6" />' +
    '<path d="M20 14 C24 10 28 9 31 6" />' +
    '<path d="M20 14 C16 10 12 9 9 6" />' +
    '<path d="M20 24 C24 20 28 19 31 16" />' +
    '<path d="M20 24 C16 20 12 19 9 16" />' +
    '<path d="M20 44 C23 41 26 40 29 38" />' +
    '<path d="M20 44 C17 41 14 40 11 38" />' +
    "</svg>" +
    '<p class="site-footer__date">Saturday 17 April 2027</p>' +
    '<p class="site-footer__note">Eyam Hall &middot; Eyam, Derbyshire</p>' +
    '<p class="site-footer__contact"><a href="mailto:hello@rosieandjoe.uk">hello@rosieandjoe.uk</a></p>' +
    "</footer>";

  customElements.define(
    "site-header",
    class extends HTMLElement {
      connectedCallback() {
        var logo = this.getAttribute("logo") || "Rosie & Joe";
        this.innerHTML = HEADER_HTML.replace("{{LOGO}}", logo);
      }
    }
  );

  customElements.define(
    "site-footer",
    class extends HTMLElement {
      connectedCallback() {
        this.innerHTML = FOOTER_HTML;
      }
    }
  );
})();
