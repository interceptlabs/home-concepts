/* Concept B — video hero playback control (CONB-01, CONB-04 autoplay-gate half)
   Vanilla JS, no libraries. Scope for THIS plan: reduced-motion-gated
   attemptPlay() + a visible pause/play toggle kept in sync via the
   video's own play/pause events. 03-03 extends this file with
   visibilitychange/IntersectionObserver pausing and the full iOS
   play()-rejection fallback — attemptPlay is already shaped so those
   bolt on without a rewrite. */
(function () {
  "use strict";

  var video = document.querySelector(".hero-stage__video");
  var toggle = document.querySelector(".video-toggle");
  if (!video || !toggle) return;

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setToggleState(playing) {
    toggle.setAttribute("aria-pressed", playing ? "true" : "false");
    toggle.textContent = playing ? "Pause" : "Play";
  }

  function attemptPlay(userInitiated) {
    // Reduced-motion visitors never get an autoplay attempt — CSS/poster
    // shows the static frame. An explicit user click (userInitiated =
    // true) is still allowed: WCAG gates AUTOplay, not an explicit
    // user request to play.
    if (prefersReducedMotion && !userInitiated) return;

    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function () {
        // Rejection = iOS Low Power Mode / browser autoplay policy.
        // The poster is already the video's own fallback frame — never
        // surface an error, just reflect the paused state on the toggle.
        setToggleState(false);
      });
    }
  }

  toggle.addEventListener("click", function () {
    if (video.paused) {
      attemptPlay(true);
    } else {
      video.pause();
    }
  });

  // Keep the toggle in sync with the video's own playback state so any
  // future programmatic pause/play (03-03's visibility handling) updates
  // the button for free, with no extra wiring.
  video.addEventListener("play", function () {
    setToggleState(true);
  });
  video.addEventListener("pause", function () {
    setToggleState(false);
  });

  attemptPlay(false);
})();
