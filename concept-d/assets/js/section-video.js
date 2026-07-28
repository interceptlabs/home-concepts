/* Concept D — explore-page background video guards (Iteration 5, 10-01;
   IT6 round 10). Vanilla JS, no libraries. The visible pause chip was
   removed at Jon's direction (the Pause control now lives ONLY on the
   work reel), so this file carries just the non-UI guards, same shape as
   hero-video.js: prefers-reduced-motion never lets the ambient loop run
   (the poster is the experience), and visibilitychange pauses the loop
   while the tab is hidden. play() rejection is caught silently — the
   poster is the fallback frame.

   The <video> tag carries the `autoplay` attribute in markup (immediate
   first frame with no JS round-trip). That attribute plays the element
   natively, independent of any JS gating (the 03-03 lesson) — so
   reduced-motion visitors get an explicit pause() call to override it. */
(function () {
  "use strict";

  var video = document.querySelector(".section-video");
  if (!video) return;

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    video.pause();
    return; // poster only — no resume path exists without the toggle
  }

  function attemptPlay() {
    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function () {
        // Rejection = iOS Low Power Mode / browser autoplay policy. The
        // poster is already the video's own fallback frame.
      });
    }
  }

  // Battery guard: pause when the tab is hidden, resume when it returns.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      video.pause();
    } else {
      attemptPlay();
    }
  });

  attemptPlay();
})();
