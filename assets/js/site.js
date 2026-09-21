// Ian Wan Portfolio — shared site behavior:
// loading spinner, gear cursor trail, and the Projects nav dropdown.
//
// Everything here is progressive enhancement. If this file fails to load,
// the <noscript> rule in each page hides the loader overlay and the site
// still renders and navigates normally.

(function () {
  "use strict";

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

  /* ---------- Gear cursor ----------
     The gear REPLACES the native pointer, and it is repositioned every frame
     from the latest pointer coordinates, so a cursor is always visible even
     when the mouse is completely still. Behind it, short-lived ghosts fade out
     in well under a second.

     Accessibility rules this obeys:
       - `cursor: none` is set from here, never from the stylesheet, so if this
         script fails to load the native pointer is untouched.
       - It never starts on touch or coarse pointers.
       - It never starts under prefers-reduced-motion or forced-colors, and it
         tears itself down if either becomes true while the page is open.
       - The gear grows over links and buttons, replacing the affordance the
         native pointer-hand would have given.
       - A real touch on a hybrid laptop tears it down too.
       - The OS pointer is restored whenever the pointer leaves the window. */

  var cursor = (function () {
    var mqFine    = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)") : null;
    var mqMotion  = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var mqColors  = window.matchMedia ? window.matchMedia("(forced-colors: active)") : null;

    var GHOST_LIFETIME_MS = 420;   // well under one second
    var GHOST_INTERVAL_MS = 34;    // ~2 ghosts per 60fps frame pair

    var root, ghostLayer, raf = null, running = false;
    var x = -100, y = -100, lastGhost = 0, lastGx = -999, lastGy = -999;

    function allowed() {
      if (!mqFine || !mqFine.matches) return false;
      if (mqMotion && mqMotion.matches) return false;
      if (mqColors && mqColors.matches) return false;
      return true;
    }

    function frame() {
      if (!running) return;
      root.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      raf = requestAnimationFrame(frame);
    }

    function spawnGhost(now) {
      if (now - lastGhost < GHOST_INTERVAL_MS) return;
      // Only trail when the pointer has actually travelled, so a resting mouse
      // does not pile up invisible nodes.
      var dx = x - lastGx, dy = y - lastGy;
      if (dx * dx + dy * dy < 36) return;
      lastGhost = now; lastGx = x; lastGy = y;

      var g = document.createElement("span");
      g.className = "iw-cursor-ghost";
      g.setAttribute("aria-hidden", "true");
      g.innerHTML = GEAR_SVG;
      var spin = Math.round(Math.random() * 360);
      g.style.transform = "translate3d(" + x + "px," + y + "px,0) rotate(" + spin + "deg) scale(1)";
      ghostLayer.appendChild(g);

      requestAnimationFrame(function () {
        g.style.opacity = "0";
        g.style.transform =
          "translate3d(" + x + "px," + y + "px,0) rotate(" + (spin + 70) + "deg) scale(0.35)";
      });
      window.setTimeout(function () {
        if (g.parentNode) g.parentNode.removeChild(g);
      }, GHOST_LIFETIME_MS);
    }

    function onMove(e) {
      x = e.clientX; y = e.clientY;
      if (root.classList.contains("is-hidden")) root.classList.remove("is-hidden");
      var el = e.target;
      var interactive = el && el.closest &&
        el.closest('a[href], button, [role="button"], input, select, textarea, summary');
      root.classList.toggle("is-over-link", !!interactive);
      spawnGhost(e.timeStamp || Date.now());
    }

    function onLeave() { root.classList.add("is-hidden"); }

    function start() {
      if (running || !allowed()) return;
      running = true;

      root = document.createElement("span");
      root.className = "iw-cursor is-hidden";
      root.setAttribute("aria-hidden", "true");
      root.innerHTML = GEAR_SVG;

      ghostLayer = document.createElement("span");
      ghostLayer.setAttribute("aria-hidden", "true");

      document.body.appendChild(ghostLayer);
      document.body.appendChild(root);
      document.documentElement.classList.add("iw-gear-cursor");

      document.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (!running) return;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.documentElement.classList.remove("iw-gear-cursor");
      if (root && root.parentNode) root.parentNode.removeChild(root);
      if (ghostLayer && ghostLayer.parentNode) ghostLayer.parentNode.removeChild(ghostLayer);
    }

    function sync() { if (allowed()) start(); else stop(); }

    [mqFine, mqMotion, mqColors].forEach(function (mq) {
      if (!mq) return;
      if (mq.addEventListener) mq.addEventListener("change", sync);
      else if (mq.addListener) mq.addListener(sync);
    });

    // A hybrid laptop reports a fine pointer but may still be touched. One real
    // touch and the native cursor comes back for good.
    window.addEventListener("touchstart", function () { stop(); }, { passive: true, once: true });

    return { start: start, stop: stop, sync: sync };
  })();

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

  function init() {
    initProjectsDropdown();
    cursor.start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
