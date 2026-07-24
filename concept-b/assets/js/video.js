/* Concept B — video hero playback control (CONB-01, CONB-04)
   Vanilla JS, no libraries. attemptPlay(userInitiated) gates ambient
   autoplay behind prefers-reduced-motion but always allows an explicit
   user-initiated play(); toggle state is driven off the video element's
   own play/pause events. This plan (03-03) extends the 03-01 baseline
   with: a userPaused guard (never auto-resume over an explicit user
   pause — WCAG 2.2.2), visibilitychange pausing (battery), an
   IntersectionObserver on .hero-stage (pause when scrolled mostly out of
   view), and hardened iOS play()-rejection handling (poster + working
   Play control, never a broken state, no scheduled retries). */
(function () {
  "use strict";

  var video = document.querySelector(".hero-stage__video");
  var toggle = document.querySelector(".video-toggle");
  var heroStage = document.querySelector(".hero-stage");
  if (!video || !toggle) return;

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set true only when the user explicitly pauses via the toggle; cleared
  // only when the user explicitly plays via the toggle. Every programmatic
  // resume path below (visibilitychange, IntersectionObserver) checks this
  // flag first and must never override an explicit user pause.
  var userPaused = false;

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
        // Rejection = iOS Low Power Mode / browser autoplay policy (can't
        // be exercised on this Mac — verified by code review). The poster
        // is already the video's own fallback frame, so never surface an
        // error — just reflect the paused state on the toggle. The ONLY
        // retry path is the user's own toggle press: a gesture is exactly
        // what iOS accepts, and nothing here schedules an automatic retry.
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
  // programmatic pause/play below updates the button for free.
  video.addEventListener("play", function () {
    setToggleState(true);
  });
  video.addEventListener("pause", function () {
    setToggleState(false);
  });

  // Battery guard 1: pause when the tab is hidden; resume only if the
  // user hasn't explicitly paused.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      video.pause();
    } else if (!userPaused) {
      attemptPlay(false);
    }
  });

  // Battery guard 2: pause when the hero scrolls mostly out of view
  // (possible on small screens where content overflows); resume only if
  // the user hasn't explicitly paused.
  if (heroStage && "IntersectionObserver" in window) {
    var heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!userPaused) attemptPlay(false);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    heroObserver.observe(heroStage);
  }

  attemptPlay(false);
})();
