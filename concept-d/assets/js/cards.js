/* Concept D — card-to-module-dialog wiring (COND-03, COND-04, COND-07) plus the
   07-02 scaling card->window transition (ITER-04). Vanilla JS, no libraries.
   Opens/closes the 8 statically-authored <dialog class="module-modal">
   elements already present in index.html and restores focus to the invoking
   card on close. deployed.js is never edited — this file only wires
   interaction around it.

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
      re-measures every canvas.fritz-bg.

   07-02 addition — scaling card->window transition (ITER-04): the browser's
   View Transitions API is the primary mechanism (07-RESEARCH.md, verified
   against medienbaecker.com + web-standards.dev): a single reused
   view-transition-name ("modal-morph") is handed off card->dialog on open
   and dialog->card on close, so the browser's own snapshot-pseudo-element
   morph reads as "the card grows into the window" at sine/600ms (tuned in
   concept-d.css). Esc fires the dialog's native 'cancel' event BEFORE
   'close' — intercepted here with preventDefault() so the close can also
   be wrapped in a transition (both source articles flag this as the one
   non-obvious gotcha). Reduced-motion or unsupported browsers: the ORIGINAL
   instant showModal()/close() path runs unchanged, never a fade. A FLIP
   fallback on `.modal-body` (NEVER on dialog.module-modal — the Phase-5
   no-transform invariant) covers browsers with transitions unsupported but
   motion allowed. */
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

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function vtSupported() {
    return typeof document.startViewTransition === "function";
  }

  // Drawer-first Esc bookkeeping: a drawer/overlay opened from inside a
  // dialog (convoDrawer/pitchLabs/agent-detail) is a plain reparented div,
  // not a nested native <dialog> — the SAME physical Esc keypress that
  // deployed.js's own document-level `keydown` listener uses to close it
  // (closeAll()) also reaches this dialog's native 'cancel' event, since
  // nothing about the drawer suppresses it. A capture-phase listener here
  // runs BEFORE deployed.js's bubble-phase listener (capture always
  // precedes bubble, regardless of script/registration order), so it can
  // snapshot "was a drawer open at the moment Escape was pressed" before
  // closeAll() strips the .open class — the dialog's later 'cancel' handler
  // reads that snapshot to decide whether THIS Esc should also close the
  // dialog, or just the drawer (deferring the dialog close to the NEXT Esc).
  var overlayOpenAtEscape = false;
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key === "Escape") {
        overlayOpenAtEscape = !!document.querySelector(".drawer.open, .agent-detail-overlay.is-open");
      }
    },
    true
  );

  var MORPH_NAME = "modal-morph";
  var FLIP_MS = 600;
  var FLIP_EASE = "cubic-bezier(0.37, 0, 0.63, 1)";

  function doOpen(dialog) {
    // Landmine fix 1: move the drawer scaffold inside the dialog so it
    // renders above the dialog's own top-layer content, not underneath it.
    reparentInto(dialog);
    dialog.showModal();
    // Landmine fix 2: re-fire the ported fritz-bg IIFE's resize listener so
    // any canvas.fritz-bg inside this dialog measures its real, now-visible
    // dimensions instead of the 0x0 it read while hidden.
    window.dispatchEvent(new Event("resize"));
  }

  // FLIP-on-inner-body fallback (locked: transform lands on .modal-body,
  // NEVER on dialog.module-modal itself — a transform there would create a
  // containing block that traps the reparented position:fixed drawer
  // scaffold inside the dialog's own box, the exact Phase-5 landmine).
  // Runs only when startViewTransition is unsupported AND reduced-motion is
  // off; otherwise doOpen()/dialog.close() run instantly, no morph at all.
  function flipOpen(dialog, invoker) {
    var invokerRect = invoker.getBoundingClientRect();
    doOpen(dialog);
    var body = dialog.querySelector(".modal-body");
    if (!body) return;
    var bodyRect = body.getBoundingClientRect();
    var scaleX = invokerRect.width / bodyRect.width;
    var scaleY = invokerRect.height / bodyRect.height;
    var dx = invokerRect.left - bodyRect.left;
    var dy = invokerRect.top - bodyRect.top;
    body.style.transformOrigin = "top left";
    body.style.transition = "none";
    body.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + scaleX + "," + scaleY + ")";
    // Force reflow so the starting transform paints before animating away.
    // eslint-disable-next-line no-unused-expressions
    body.offsetHeight;
    body.style.transition = "transform " + FLIP_MS + "ms " + FLIP_EASE;
    body.style.transform = "none";
    body.addEventListener(
      "transitionend",
      function onEnd() {
        body.style.transition = "";
        body.style.transform = "";
        body.style.transformOrigin = "";
      },
      { once: true }
    );
  }

  function openModal(dialog, invoker) {
    if (!dialog) return;
    lastInvoker = invoker || lastInvoker;

    var reduced = reducedMotion();

    if (reduced) {
      doOpen(dialog);
      return;
    }

    if (vtSupported()) {
      var card = invoker;
      if (card) card.style.viewTransitionName = MORPH_NAME;
      var transition = document.startViewTransition(function () {
        if (card) card.style.viewTransitionName = "";
        dialog.style.viewTransitionName = MORPH_NAME;
        doOpen(dialog);
      });
      transition.finished.finally(function () {
        dialog.style.viewTransitionName = "";
      });
      return;
    }

    if (invoker) {
      flipOpen(dialog, invoker);
      return;
    }

    doOpen(dialog);
  }

  // Transitioned close: hands the view-transition-name back to the
  // invoking card (or runs the FLIP fallback in reverse) before running the
  // dialog's real .close() — which still fires the untouched 'close'
  // listener below (closeAll -> ownership-guarded reparent home -> focus
  // return). Reduced-motion/unsupported: dialog.close() runs natively,
  // unchanged.
  function transitionedClose(dialog) {
    var reduced = reducedMotion();

    if (reduced) {
      dialog.close();
      return;
    }

    if (vtSupported()) {
      var invoker = lastInvoker;
      dialog.style.viewTransitionName = MORPH_NAME;
      var transition = document.startViewTransition(function () {
        dialog.style.viewTransitionName = "";
        if (invoker) invoker.style.viewTransitionName = MORPH_NAME;
        dialog.close();
      });
      transition.finished.finally(function () {
        if (invoker) invoker.style.viewTransitionName = "";
      });
      return;
    }

    // FLIP-unsupported-transitions-but-motion-allowed path: no stored
    // "open" rect to reverse-animate reliably once the dialog is already
    // closing (close() immediately hides the dialog's rendered box), so
    // this population gets an instant close — still never a fade, and the
    // open morph above already covered the same population on the way in.
    dialog.close();
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

  // Every module dialog: the close button (routed through the transitioned
  // close), the native 'cancel' event (Esc — intercepted so Esc also gets
  // the transition instead of skipping straight to an instant close), and
  // focus-return-on-close (the dialog's native 'close' event, which both
  // paths above still end in).
  var dialogs = document.querySelectorAll("dialog.module-modal");
  for (var d = 0; d < dialogs.length; d++) {
    (function (dialog) {
      var closeBtn = dialog.querySelector("[data-modal-close]");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          transitionedClose(dialog);
        });
      }

      // Esc fires 'cancel' BEFORE 'close' — prevent the default (which
      // would immediately proceed to an untransitioned close) and run the
      // transitioned close ourselves so Esc gets the same morph as the
      // close button. Only intercept when the morph path is actually
      // active (View Transitions supported and motion allowed); otherwise
      // let the native cancel/close proceed exactly as before.
      //
      // Drawer-first Esc: a drawer opened from inside this dialog (e.g.
      // convoDrawer/pitchLabs, or the agents detail overlay) is a plain
      // reparented div, not a nested native dialog — the SAME physical Esc
      // keypress that deployed.js's own document-level keydown listener
      // uses to close that drawer (closeAll()) also reaches this dialog's
      // native 'cancel' event, since nothing about the drawer suppresses
      // it. Without this guard, one Esc would close the drawer AND the
      // dialog together. Preserve the expected "Esc closes the drawer,
      // then Esc closes the dialog" two-step semantics by preventing the
      // dialog's own close on any Esc where a drawer/overlay is still open,
      // leaving the dialog to close on the NEXT Esc once nothing remains
      // open inside it.
      dialog.addEventListener("cancel", function (e) {
        if (overlayOpenAtEscape) {
          e.preventDefault();
          return;
        }
        if (vtSupported() && !reducedMotion()) {
          e.preventDefault();
          transitionedClose(dialog);
        }
      });

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
  // Per 07-02's plan: keep dlg-os's own close INSTANT (no morph) here and let
  // openModal(dlgAgents, ...) run its own transition — no dual-transition
  // juggling between two dialogs at once.
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
