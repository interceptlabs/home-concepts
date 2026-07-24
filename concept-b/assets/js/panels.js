/* Concept B — chapter-panel interaction (CONB-03)
   Vanilla JS, no libraries. Opens/closes/swaps the six statically-authored
   <dialog class="chapter-panel"> elements already present in index.html
   and restores focus to the invoking hotspot on close. This file drives
   interaction ONLY — it never assigns copy (no DOM-text-write API is
   used anywhere below to set canonical text); every dialog's content is
   already in the markup, annotated with data-copy, so copy-diff can
   verify it directly.

   Native <dialog>.showModal() already gives us, for free: focus moved
   into the dialog, Esc-to-close (fires a native 'close' event), a focus
   trap, and `inert` on everything outside the dialog — none of that is
   hand-rolled here (see 03-RESEARCH.md "Don't Hand-Roll"). The one piece
   that is NOT automatic is returning focus to the element that opened
   the dialog — that's the one manual wire-up below. */
(function () {
  "use strict";

  var lastInvoker = null;

  function dialogFor(id) {
    return document.getElementById("panel-" + id);
  }

  function openDialog(dialog, invoker) {
    if (!dialog) return;
    lastInvoker = invoker || lastInvoker;
    dialog.showModal();
  }

  // Every [data-panel] element (6 hotspots + the topbar CTA) opens its
  // matching dialog and remembers itself as the invoker for focus-return.
  var openers = document.querySelectorAll("[data-panel]");
  for (var i = 0; i < openers.length; i++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        openDialog(dialogFor(btn.getAttribute("data-panel")), btn);
      });
    })(openers[i]);
  }

  // Every chapter panel: focus-return-on-close (Esc or the close button
  // both fire the dialog's native 'close' event, so one listener covers
  // both dismissal paths), the close button itself, and close-before-
  // navigate on any full-page CTA anchor inside it.
  var panels = document.querySelectorAll(".chapter-panel");
  for (var p = 0; p < panels.length; p++) {
    (function (dialog) {
      dialog.addEventListener("close", function () {
        if (lastInvoker) lastInvoker.focus();
      });

      var closeBtn = dialog.querySelector(".chapter-panel__close");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          dialog.close();
        });
      }

      // Close-before-navigate (locked call): synchronously close the
      // dialog on click, then let the anchor's default navigation
      // proceed — the cheap mitigation for the open-dialog/view-
      // transition snapshot interaction 03-RESEARCH.md flags as an
      // open question.
      var pageCtas = dialog.querySelectorAll("a.panel-cta");
      for (var c = 0; c < pageCtas.length; c++) {
        pageCtas[c].addEventListener("click", function () {
          dialog.close();
        });
      }
    })(panels[p]);
  }

  // Panel swap: Labs' "Build with Labs" CTA closes Labs and opens Contact
  // in one step, but keeps `lastInvoker` pointing at the original Labs
  // hotspot (never reassigned to the swap button itself) so that closing
  // Contact afterward returns focus to the Labs hotspot, not into thin
  // air where a closed dialog used to be.
  var swapButtons = document.querySelectorAll("[data-panel-swap]");
  for (var s = 0; s < swapButtons.length; s++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        var currentDialog = btn.closest(".chapter-panel");
        var targetDialog = dialogFor(btn.getAttribute("data-panel-swap"));
        if (currentDialog) currentDialog.close();
        if (targetDialog) targetDialog.showModal();
      });
    })(swapButtons[s]);
  }
})();
