/* Concept D — hero video playback control (COND-02)
   Vanilla JS, no libraries. Adapted from concept-b/assets/js/video.js:
   attemptPlay(userInitiated) gates ambient autoplay behind
   prefers-reduced-motion but always allows an explicit user-initiated
   play(); toggle state is driven off the video element's own play/pause
   events (not manually tracked). A userPaused guard (WCAG 2.2.2) means no
   programmatic resume path below ever overrides an explicit user pause.

   Deviation from concept-b's video.js: no IntersectionObserver hero-exit
   pause here. Concept B's hero video sits in the normal page flow and can
   scroll out of view; Concept D's .hero-video-layer is position:fixed and
   covers the full viewport for the entire lifetime of the page, so there is
   no "scrolled mostly out of view" state to observe — visibilitychange
   (tab hidden) is the only battery guard this context needs. */
(function () {
  "use strict";

  var video = document.querySelector(".hero-video");
  var toggle = document.querySelector(".video-toggle");
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

  // The <video> tag carries the `autoplay` attribute in markup (required so
  // non-reduced-motion visitors get an immediate first frame with no JS
  // round-trip). That attribute plays the element natively, independent of
  // any of the JS gating below (the 03-03 lesson) — attemptPlay()'s
  // reduced-motion check only stops OUR code from calling play(), it can't
  // stop the browser's own native autoplay from having already started it.
  // So: explicitly pause immediately for reduced-motion visitors to
  // override the attribute, and sync the toggle by hand, BEFORE the
  // play/pause listeners are wired below — pausing an element that never
  // actually started playing yet won't reliably fire a native 'pause'
  // event, so the toggle listeners can't be trusted alone to catch this.
  if (prefersReducedMotion) {
    video.pause();
    setToggleState(false);
  }

  function attemptPlay(userInitiated) {
    // Reduced-motion visitors never get an autoplay attempt — CSS/poster
    // shows the static frame. An explicit user click (userInitiated = true)
    // is still allowed: WCAG gates AUTOplay, not an explicit user request.
    if (prefersReducedMotion && !userInitiated) return;

    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function () {
        // Rejection = iOS Low Power Mode / browser autoplay policy. The
        // poster is already the video's own fallback frame, so never
        // surface an error — just reflect the paused state on the toggle.
        // The ONLY retry path is the user's own toggle press: a gesture is
        // exactly what iOS accepts, and nothing here schedules an
        // automatic retry.
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
