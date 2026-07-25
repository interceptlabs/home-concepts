/* Concept D — work-reel visibility-gated playback (ITER-06)
   Vanilla JS, no libraries. The reel video sits below the fold inside
   #work-reel, `preload="none"` so no video bytes download until an
   IntersectionObserver confirms the section is actually in view. Ports
   hero-video.js's guards (07-RESEARCH.md §6): prefersReducedMotion never
   auto-plays, userPaused (WCAG 2.2.2) means no programmatic resume path
   ever overrides an explicit user pause, toggle state is driven off the
   video element's own play/pause events, and play() rejection is caught
   silently (the poster is the fallback frame either way). */
(function () {
  "use strict";

  var video = document.querySelector(".reel-video");
  var section = document.getElementById("work-reel");
  var toggle = document.querySelector(".reel-toggle");
  if (!video || !section || !toggle) return;

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set true only when the user explicitly pauses via the toggle; cleared
  // only when the user explicitly plays via the toggle. The IntersectionObserver
  // resume path below checks this flag first and must never override an
  // explicit user pause.
  var userPaused = false;

  function setToggleState(playing) {
    toggle.setAttribute("aria-pressed", playing ? "true" : "false");
    toggle.textContent = playing ? "Pause" : "Play";
  }

  // No autoplay attribute in markup — reduced-motion visitors simply never
  // get an attemptPlay() call, so the poster (preload="none") is all they
  // ever see. Sync the toggle up front regardless.
  setToggleState(false);

  function attemptPlay(userInitiated) {
    if (prefersReducedMotion && !userInitiated) return;

    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function () {
        // Rejection = autoplay policy / low power mode. Poster is already
        // the fallback frame; the only retry path is the user's own toggle.
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

  video.addEventListener("play", function () {
    setToggleState(true);
  });
  video.addEventListener("pause", function () {
    setToggleState(false);
  });

  // Battery/bandwidth guard: pause when the tab is hidden; resume only if
  // the section is still in view AND the user hasn't explicitly paused.
  var inView = false;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      video.pause();
    } else if (inView && !userPaused) {
      attemptPlay(false);
    }
  });

  if ("IntersectionObserver" in window) {
    var reelObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          inView = entry.isIntersecting;
          if (inView) {
            if (!userPaused) attemptPlay(false);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    reelObserver.observe(section);
  }
  // No IntersectionObserver support: the video stays paused on its poster
  // forever (preload="none" means zero bytes are ever fetched) — an
  // acceptable, non-broken degradation, not a missing feature.
})();
