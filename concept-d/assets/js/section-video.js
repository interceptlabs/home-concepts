/* Concept D — explore-page background video control (Iteration 5, 10-01)
   Vanilla JS, no libraries. Adapted from assets/js/hero-video.js (the
   homepage hero idiom): attemptPlay(userInitiated) gates ambient autoplay
   behind prefers-reduced-motion but always allows an explicit
   user-initiated play(); toggle state is driven off the video element's
   own play/pause events (not manually tracked). A userPaused guard
   (WCAG 2.2.2) means no programmatic resume path below ever overrides an
   explicit user pause.

   Differences from hero-video.js: targets .section-video /
   .section-video-toggle, and the toggle button lives OUTSIDE the
   aria-hidden fixed layer (as a sibling), so it is exposed to assistive
   tech and sits above the page's stacked content (the fixed layer is
   z-index:0 below main, so a button inside it would be unreachable).
   Like the hero layer, .section-video-layer is position:fixed and covers
   the viewport for the page's whole lifetime, so visibilitychange (tab
   hidden) is the only battery guard this context needs. */
(function () {
  "use strict";

  var video = document.querySelector(".section-video");
  var toggle = document.querySelector(".section-video-toggle");
  if (!video || !toggle) return;

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set true only when the user explicitly pauses via the toggle; cleared
  // only when the user explicitly plays via the toggle. Every programmatic
  // resume path below (visibilitychange) checks this flag first and must
  // never override an explicit user pause.
  var userPaused = false;

  function setToggleState(playing) {
    toggle.setAttribute("aria-pressed", playing ? "true" : "false");
    toggle.textContent = playing ? "Pause" : "Play";
  }

  // The <video> tag carries the `autoplay` attribute in markup (immediate
  // first frame with no JS round-trip). That attribute plays the element
  // natively, independent of the JS gating below (the 03-03 lesson) — so
  // explicitly pause immediately for reduced-motion visitors to override
  // the attribute (poster-only state), and sync the toggle by hand BEFORE
  // the play/pause listeners are wired.
  if (prefersReducedMotion) {
    video.pause();
    setToggleState(false);
  }

  function attemptPlay(userInitiated) {
    // Reduced-motion visitors never get an autoplay attempt — the poster
    // shows the static frame. An explicit user click (userInitiated =
    // true) is still allowed: WCAG gates AUTOplay, not a user request.
    if (prefersReducedMotion && !userInitiated) return;

    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function () {
        // Rejection = iOS Low Power Mode / browser autoplay policy. The
        // poster is already the fallback frame — never surface an error;
        // just reflect the paused state. The ONLY retry path is the
        // user's own toggle press.
        setToggleState(false);
      });
    }
  }

  toggle.addEventListener("click", function () {
    if (video.paused) {
      userPaused = false;
      attemptPlay(true);
    } else {
      userPaused = true;
      video.pause();
    }
  });

  // Keep the toggle in sync with the video's own playback state so any
  // programmatic pause/play elsewhere updates the button for free.
  video.addEventListener("play", function () {
    setToggleState(true);
  });
  video.addEventListener("pause", function () {
    setToggleState(false);
  });

  // Battery guard: pause when the tab is hidden; resume only if the user
  // hasn't explicitly paused.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      video.pause();
    } else if (!userPaused) {
      attemptPlay(false);
    }
  });

  attemptPlay(false);
})();
