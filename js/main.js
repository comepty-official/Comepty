/* ==========================================================================
   COMEPTY — main.js
   Shared behaviour: header state, mobile menu, scroll reveals, parallax,
   footer year. Every effect is skipped when reduced motion is requested.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------------
     Header scrolled state
     ------------------------------------------------------------------------ */

  var header = document.querySelector(".site-header");
  var lastScrolled = false;

  function syncHeader() {
    if (!header) return;
    var scrolled = window.scrollY > 12;
    if (scrolled !== lastScrolled) {
      header.classList.toggle("is-scrolled", scrolled);
      lastScrolled = scrolled;
    }
  }

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */

  var toggle = document.querySelector(".menu-toggle");
  var panel = document.getElementById("menu-panel");

  function setMenu(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("menu-open", open);
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });

    panel.addEventListener("click", function (event) {
      if (event.target === panel) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1000) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------------
     Scroll reveals
     Targets are declared here so the HTML stays free of animation noise.
     ------------------------------------------------------------------------ */

  var revealSelectors = [
    "[data-reveal]",
    ".section-head > div > *",
    ".capability-strip__cell",
    ".featured-row",
    ".process__step",
    ".hair-grid > *",
    ".philosophy__block",
    ".statement > *",
    ".service-block > *",
    ".project-card__body > *",
    ".project-card__media",
    ".lab-entry > *",
    ".principle",
    ".def-grid__item",
    ".contact-aside__block",
    ".info-row",
    ".form > *",
    ".page-cta > *"
  ];

  var staggerSelectors = ["[data-stagger]", ".project-list", ".lab-list", ".service-block"];

  function tagRevealTargets() {
    var seen = new Set();

    revealSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (seen.has(el)) return;
        seen.add(el);
        if (!el.hasAttribute("data-reveal")) {
          el.setAttribute("data-reveal", "");
        }
      });
    });

    // Staggered children get an index variable consumed by CSS.
    staggerSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, index) {
          child.style.setProperty("--i", String(index));
        });
      });
    });
  }

  tagRevealTargets();

  var revealTargets = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal]")
  );

  function revealAll() {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Light parallax
     Only on elements carrying [data-parallax]. Speed comes from data-speed.
     ------------------------------------------------------------------------ */

  var parallaxTargets = Array.prototype.slice.call(
    document.querySelectorAll("[data-parallax]")
  );

  if (!reduceMotion && parallaxTargets.length) {
    var ticking = false;

    function applyParallax() {
      var viewport = window.innerHeight;

      parallaxTargets.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewport + 200) return;

        var speed = parseFloat(el.getAttribute("data-speed")) || 0.08;
        var progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        var offset = -progress * speed * 160;

        el.style.setProperty("--parallax", offset.toFixed(2) + "px");
      });

      ticking = false;
    }

    function requestParallax() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(applyParallax);
    }

    applyParallax();
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax);
  }

  /* ------------------------------------------------------------------------
     Current page marker for the primary navigation
     ------------------------------------------------------------------------ */

  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav__link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === path) {
      link.setAttribute("aria-current", "page");
    } else if (href !== "index.html" || path !== "index.html") {
      link.removeAttribute("aria-current");
    }
  });
})();