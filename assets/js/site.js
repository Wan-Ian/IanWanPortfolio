// Ian Wan Portfolio — shared site behavior:
// loading spinner, gear cursor trail, and the Projects nav dropdown.
//
// Everything here is progressive enhancement. If this file fails to load,
// the <noscript> rule in each page hides the loader overlay and the site
// still renders and navigates normally.

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var GEAR_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>' +
    '<path d="M19.4 13.5c.06-.49.1-.99.1-1.5s-.04-1.01-.1-1.5l1.9-1.48a.76.76 0 0 0 .18-.96l-1.8-3.12a.76.76 0 0 0-.92-.33l-2.24.9a7.4 7.4 0 0 0-1.3-.75l-.34-2.38A.75.75 0 0 0 14.1 2h-3.6a.75.75 0 0 0-.74.65l-.34 2.38c-.47.2-.9.45-1.3.75l-2.24-.9a.76.76 0 0 0-.92.33L2.86 8.33a.76.76 0 0 0 .18.96L4.94 10.77c-.06.49-.1.99-.1 1.5s.04 1.01.1 1.5l-1.9 1.48a.76.76 0 0 0-.18.96l1.8 3.12c.19.33.59.47.92.33l2.24-.9c.4.3.83.55 1.3.75l.34 2.38c.06.36.37.65.74.65h3.6c.37 0 .68-.29.74-.65l.34-2.38c.47-.2.9-.45 1.3-.75l2.24.9c.33.14.73 0 .92-.33l1.8-3.12a.76.76 0 0 0-.18-.96L19.4 13.5Z"></path>' +
    '</svg>';

  /* ---------- Loading spinner ----------
     Hidden as soon as the document is parsed, NOT on window.load. Waiting for
     window.load gates first paint on every image on the page (1.4 MB on the
     gallery), so a visitor on a slow connection stared at a white screen until
     the 4s timeout fired. DOMContentLoaded means the overlay lifts the moment
     there is something to read; images then arrive in place. */
  function hideLoader() {
    var loader = document.getElementById("site-loader");
    if (!loader || loader.classList.contains("is-hidden")) return;
    loader.classList.add("is-hidden");
    window.setTimeout(function () {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 400);
  }

  if (document.readyState === "interactive" || document.readyState === "complete") {
    hideLoader();
  } else {
    document.addEventListener("DOMContentLoaded", hideLoader);
    window.addEventListener("load", hideLoader);
    // Safety net: never let a slow asset block the site forever.
    window.setTimeout(hideLoader, 4000);
  }

  /* ---------- Gear cursor trail ----------
     Pure decoration layered on top of the real cursor, which is never hidden.
     Skipped on touch and when the visitor has asked for reduced motion. */
  var supportsHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  if (supportsHover && !reduceMotion) {
    var lastSpawn = 0;
    var SPAWN_INTERVAL_MS = 55; // throttle so the trail isn't overwhelming
    var LIFETIME_MS = 320;

    document.addEventListener("mousemove", function (e) {
      var now = Date.now();
      if (now - lastSpawn < SPAWN_INTERVAL_MS) return;
      lastSpawn = now;

      var x = e.clientX - 8;
      var y = e.clientY - 8;
      var spin = Math.round(Math.random() * 360);

      var gear = document.createElement("span");
      gear.className = "iw-cursor-gear";
      gear.setAttribute("aria-hidden", "true");
      gear.innerHTML = GEAR_SVG;
      gear.style.transform =
        "translate(" + x + "px, " + y + "px) rotate(" + spin + "deg) scale(1)";
      document.body.appendChild(gear);

      // Kick off the fade/shrink on the next frame so the transition fires.
      // Same origin and a fixed +90deg, so the gear spins rather than jumping
      // to an unrelated angle the way a second random value did.
      requestAnimationFrame(function () {
        gear.style.opacity = "0";
        gear.style.transform =
          "translate(" + x + "px, " + y + "px) rotate(" + (spin + 90) + "deg) scale(0.4)";
      });

      window.setTimeout(function () {
        if (gear.parentNode) gear.parentNode.removeChild(gear);
      }, LIFETIME_MS);
    });
  }

  /* ---------- "Projects" nav dropdown ----------
     A disclosure widget: a real <button> toggling a panel of ordinary links.
     No aria-haspopup, because that announces a menu whose roles and arrow-key
     handling this markup does not implement. */
  function initProjectsDropdown() {
    var trigger = document.querySelector("[data-projects-trigger]");
    var dropdown = document.querySelector("[data-projects-dropdown]");
    if (!trigger || !dropdown) return;

    function open() {
      dropdown.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }

    function close(returnFocus) {
      if (!dropdown.classList.contains("is-open")) return;
      dropdown.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      if (returnFocus) trigger.focus();
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (dropdown.classList.contains("is-open")) close(false);
      else open();
    });

    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target) && e.target !== trigger) close(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Esc") close(true);
    });

    // Tabbing past the last link should close the panel rather than leave it
    // hanging open over the page.
    document.addEventListener("focusin", function (e) {
      if (!dropdown.contains(e.target) && e.target !== trigger) close(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectsDropdown);
  } else {
    initProjectsDropdown();
  }
})();
