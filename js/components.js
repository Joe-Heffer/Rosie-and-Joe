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

  var NAV_LINKS = [
    { href: "/", icon: "home", label: "Home" },
    { href: "details.html", icon: "calendar", label: "The Day" },
    { href: "rsvp.html", icon: "envelope", label: "RSVP" },
    { href: "travel.html", icon: "compass", label: "Getting Here" },
    { href: "accommodation.html", icon: "bed", label: "Stay" },
    { href: "gift.html", icon: "gift", label: "Gifts" },
  ];

  function navIcon(name) {
    return (
      '<svg class="icon"><use href="images/icons.svg#icon-' +
      name +
      '"></use></svg>'
    );
  }

  function navLinkItem(link) {
    return (
      '<li><a class="nav__link" href="' +
      link.href +
      '">' +
      navIcon(link.icon) +
      link.label +
      "</a></li>"
    );
  }

  var NAV_LINKS_HTML = NAV_LINKS.map(navLinkItem).join("");

  var HEADER_HTML =
    '<header class="site-header">' +
    '<div class="container">' +
    '<nav class="nav" aria-label="Primary">' +
    '<a class="nav__logo" href="/" aria-label="{{LOGO}}">' +
    '<img class="nav__monogram" src="/images/rj-monogram.png" alt="" aria-hidden="true" />' +
    "</a>" +
    '<button class="nav__toggle" type="button" aria-label="Toggle navigation menu" aria-controls="primary-menu" aria-expanded="false">' +
    "<span></span><span></span><span></span>" +
    "</button>" +
    '<ul class="nav__links" id="primary-menu">' +
    NAV_LINKS_HTML +
    "</ul>" +
    "</nav>" +
    "</div>" +
    "</header>";

  var FOOTER_HTML =
    '<footer class="site-footer">' +
    '<div class="site-footer__content">' +
    '<img class="site-footer__monogram" src="/images/rj-monogram.png" alt="" aria-hidden="true" loading="lazy" />' +
    '<p class="site-footer__date">Saturday 17 April 2027</p>' +
    '<p class="site-footer__note">Eyam Hall &middot; Eyam, Derbyshire</p>' +
    '<p class="site-footer__contact"><a href="mailto:hello@rosieandjoe.uk">hello@rosieandjoe.uk</a></p>' +
    "</div>" +
    '<img class="site-footer__arch" src="/images/flower-arch.png" alt="" aria-hidden="true" loading="lazy" />' +
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
