/* Concept D — work case cards NAVIGATE to full case-study pages
   (Jon 07-27, replaces the centered modal). The three work-page cards are
   `<button data-case="…">`; deployed.js binds its own drawer handler to them,
   so this intercepts the click in the CAPTURE phase (before the target-phase
   drawer handler runs) and routes to the full page instead. The data-case
   slug maps 1:1 to the page name: hp-abx -> explore/case-hp-abx.html. */
(function () {
  "use strict";
  document.addEventListener(
    "click",
    function (e) {
      var card = e.target && e.target.closest && e.target.closest("[data-case]");
      if (!card) return;
      var key = card.dataset.case;
      if (!key) return;
      e.preventDefault();
      e.stopPropagation(); // capture phase: deployed.js's drawer never fires
      window.location.href = "explore/case-" + key + ".html";
    },
    true
  );
})();
