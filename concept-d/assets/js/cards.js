/* Concept D — card-to-module-dialog wiring (COND-03, COND-04, COND-07)
   Vanilla JS, no libraries. Opens/closes the 8 statically-authored
   <dialog class="module-modal"> elements already present in index.html
   (each carrying one complete, unmodified ported deployed section) and
   restores focus to the invoking card on close. deployed.js is never
   edited — this file only wires interaction around it.

   Native <dialog>.showModal() already gives us, for free: focus moved
   into the dialog, Esc-to-close (fires a native 'close' event), a focus
   trap, and `inert` on everything outside the dialog (see
   concept-b/assets/js/panels.js precedent, 03-RESEARCH.md "Don't
   Hand-Roll"). Two things are NOT automatic and are handled explicitly
   below (05-RESEARCH.md Pitfalls 4 & 5):

   1. Top-layer stacking: the deployed drawer scaffold (#scrim/#convoDrawer/
      #pitchLabs) is position:fixed, siblings at the end of
      <body>. A dialog in the browser's top layer renders ABOVE the normal
      stacking context regardless of z-index, so a drawer opened from
      inside a module dialog would render invisibly underneath it. Fix:
      reparent the single scaffold instances INTO the opening dialog on
      open, and back to document.body on close — ids stay unique, deployed
      drawer JS logic is untouched, event listeners survive reparenting.
   2. Hidden-canvas zero-dimension: the fritz-bg canvases inside Problems/
      Agents/Insights/Convert measure 0x0 while sitting inside a closed
      (display:none) dialog, so their frame-draw bails forever. Fix:
      dispatch a synthetic window resize event right after showModal() —
      the ported fritz-bg IIFE already has a debounced resize listener that
      re-measures every canvas.fritz-bg. */
(function () {
  "use strict";

  var lastInvoker = null;

  var SCAFFOLD_IDS = ["scrim", "convoDrawer", "pitchLabs"];
  var scaffoldNodes = SCAFFOLD_IDS.map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  function reparentInto(target) {
    scaffoldNodes.forEach(function (node) {
      target.appendChild(node);
    });
  }

  function openModal(dialog, invoker) {
    if (!dialog) return;
    lastInvoker = invoker || lastInvoker;
    // Landmine fix 1: move the drawer scaffold inside the dialog so it
    // renders above the dialog's own top-layer content, not underneath it.
    reparentInto(dialog);
    dialog.showModal();
    // Landmine fix 2: re-fire the ported fritz-bg IIFE's resize listener so
    // any canvas.fritz-bg inside this dialog measures its real, now-visible
    // dimensions instead of the 0x0 it read while hidden.
    window.dispatchEvent(new Event('resize'));
  }

  // Every real <button class="card" data-modal="dlg-...">: click opens its
  // matching dialog and remembers itself as the invoker for focus-return.
  var cardButtons = document.querySelectorAll("button.card[data-modal]");
  for (var i = 0; i < cardButtons.length; i++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        var dialog = document.getElementById(btn.getAttribute("data-modal"));
        openModal(dialog, btn);
      });
    })(cardButtons[i]);
  }

  // Every module dialog: the close button, and focus-return-on-close
  // (Esc and the close button both fire the dialog's native 'close' event,
  // so one listener covers both dismissal paths).
  var dialogs = document.querySelectorAll("dialog.module-modal");
  for (var d = 0; d < dialogs.length; d++) {
    (function (dialog) {
      var closeBtn = dialog.querySelector("[data-modal-close]");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          dialog.close();
        });
      }

      dialog.addEventListener("close", function () {
        // Close any drawer left open inside this dialog (deployed.js
        // global) before moving the scaffold back out.
        if (typeof window.closeAll === "function") window.closeAll();
        // Guard against the InterceptOS->Agents bridge race: a dialog's
        // native 'close' event fires via a QUEUED task, not synchronously
        // with .close() — so by the time this listener runs, the bridge
        // below may have already reparented the scaffold into a DIFFERENT
        // dialog that opened in the meantime (dlg-os closes, dlg-agents
        // opens, both synchronously; dlg-os's belated close event must not
        // then yank the scaffold back out of the now-active dlg-agents).
        // Only move the scaffold home if it's still parented inside THIS
        // dialog — otherwise leave it with its new, current owner.
        var stillOwnsScaffold = scaffoldNodes.some(function (node) {
          return node.parentElement === dialog;
        });
        if (stillOwnsScaffold) reparentInto(document.body);
        if (lastInvoker) lastInvoker.focus();
      });
    })(dialogs[d]);
  }

  // InterceptOS -> Agents bridge (05-RESEARCH.md port-map note): renderFlow()
  // generates an in-page anchor `<a href="#agents">` inside #dlg-os that
  // worked as a same-page scroll on the deployed site. In concept-d's modal
  // architecture that anchor does nothing on its own, so a delegated
  // listener on #dlg-os intercepts it, closes InterceptOS, and opens Agents.
  var dlgOs = document.getElementById("dlg-os");
  var dlgAgents = document.getElementById("dlg-agents");
  if (dlgOs && dlgAgents) {
    dlgOs.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest('a[href="#agents"]');
      if (!link) return;
      e.preventDefault();
      dlgOs.close();
      openModal(dlgAgents, lastInvoker);
    });
  }
})();
