/* Concept A — kinetic layer (CONA-05)
   Vanilla JS, no libraries. Sparing scroll-reveal only: one
   IntersectionObserver adds `.is-visible` to [data-reveal] elements once,
   then stops observing them (reveal-once, not scroll-scrubbed/continuous).
   The hero's load-in stagger is pure CSS (see concept-a.css) and needs no
   JS — this file only needs to handle the reduced-motion belt-and-braces
   check and the scroll reveals. */
(function () {
  "use strict";

  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Belt-and-braces: CSS already forces the visible state under
    // `@media (prefers-reduced-motion: reduce)`, but skip observing
    // entirely and mark everything visible so no code path animates.
    for (var i = 0; i < revealEls.length; i++) {
      revealEls[i].classList.add("is-visible");
    }
    return;
  }

  if (!("IntersectionObserver" in window)) {
    // No observer support: show everything rather than hiding it forever.
    for (var j = 0; j < revealEls.length; j++) {
      revealEls[j].classList.add("is-visible");
    }
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
    { threshold: 0.15 }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
