/* Concept D — quiet module reskin (07-02, ITER-05/ITER-06).

   Vanilla JS, no libraries, one IIFE. Loaded AFTER deployed.js and cards.js.
   Renders new, quieter DOM for the homepage's dialog windows by reading
   deployed.js's own untouched data objects (PROBLEMS_RR, PROBLEM_FLOWS,
   CASES — all top-level `const` bindings in an earlier classic <script>,
   which stay reachable as bare identifiers by any later classic <script> in
   the same document/realm) AT RENDER TIME. This file never hard-codes a
   copy string pulled out of those objects — every render function reads
   the live global directly, which is what keeps qa/concept-d-script-diff.py
   (byte-identical on the SOURCE objects) a sufficient verbatim guarantee
   even though this file's renders are new (07-RESEARCH.md Pitfall 4).

   deployed.js is never edited. Its own buildSolve()/renderFlow() calls at
   load time now target #solveDetail/#probFlow, both of which no longer
   exist inside index.html's dialogs (05-03's null guards make those calls a
   silent no-op here) — pages/os.html keeps its own #probFlow untouched, so
   the standalone page is unaffected. */
(function () {
  "use strict";

  var MORE_LABEL = "More +";

  /* ============ Problems (#dlg-problems) — one problem at a time ============ */

  var problemsTabs = document.getElementById("qProblemsTabs");
  var quietSolveEl = document.getElementById("quietSolve");

  function renderProblem(key) {
    if (!quietSolveEl || typeof PROBLEMS_RR === "undefined") return;
    var p = PROBLEMS_RR[key];
    if (!p) return;

    var signalBlock = p.signalNum
      ? '<div class="q-signal-num">' + p.signalNum + "</div>"
      : "";
    var tellsHtml = p.tells.map(function (t) { return "<li>" + t + "</li>"; }).join("");

    quietSolveEl.innerHTML =
      '<div class="q-problem">' +
        '<p class="q-quote">&ldquo;' + p.quote + '&rdquo;</p>' +
        '<p class="q-attrib">' + p.attrib + "</p>" +
        '<details class="q-more">' +
          "<summary>" + MORE_LABEL + "</summary>" +
          '<ul class="q-tells">' + tellsHtml + "</ul>" +
        "</details>" +
        '<div class="q-signal' + (p.signalNum ? "" : " q-signal--q") + '">' +
          signalBlock +
          '<div class="q-signal-lbl">' + p.signalLbl + "</div>" +
        "</div>" +
        '<p class="q-bridge">' + p.bridge + "</p>" +
      "</div>";
  }

  function activateProblemTab(key) {
    if (!problemsTabs) return;
    problemsTabs.querySelectorAll(".q-tab").forEach(function (t) {
      var on = t.dataset.qProblem === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    renderProblem(key);
  }

  if (problemsTabs) {
    problemsTabs.querySelectorAll(".q-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateProblemTab(tab.dataset.qProblem);
      });
    });
    activateProblemTab("intelligence");
  }

  /* ============ InterceptOS (#dlg-os) — one stage at a time, stepper ============ */

  var osTabs = document.getElementById("qOsTabs");
  var quietFlowEl = document.getElementById("quietFlow");
  var osState = { flow: "intelligence", stageIdx: 0 };

  function renderFlowStage() {
    if (!quietFlowEl || typeof PROBLEM_FLOWS === "undefined") return;
    var f = PROBLEM_FLOWS[osState.flow];
    if (!f) return;
    var stages = f.stages;
    var idx = Math.max(0, Math.min(osState.stageIdx, stages.length - 1));
    var stage = stages[idx];

    var railHtml = stages
      .map(function (s, i) {
        var cls = "q-step" + (i === idx ? " is-active" : "") + (i < idx ? " is-done" : "");
        return (
          '<button type="button" class="' + cls + '" data-stage-idx="' + i + '" ' +
          'aria-current="' + (i === idx ? "step" : "false") + '">' + s.tag + "</button>"
        );
      })
      .join("");

    var agentsHtml = stage.agents.length
      ? '<div class="q-stepper-agents">' +
          stage.agents.map(function (a) { return '<span class="agent-chip">' + a + "</span>"; }).join("") +
        "</div>"
      : "";

    quietFlowEl.innerHTML =
      '<div class="q-flow-head">' +
        '<p class="q-flow-job"><b>The job:</b> ' + f.job + "</p>" +
        '<span class="q-flow-chip">Runs on <b>' + f.layer + "</b></span>" +
      "</div>" +
      '<div class="q-stepper" role="group" aria-label="Workflow stage">' +
        '<div class="q-stepper-rail">' + railHtml + "</div>" +
        '<div class="q-stepper-body">' +
          '<span class="q-stepper-tag">' + stage.tag + "</span>" +
          '<div class="q-stepper-name">' + stage.name + "</div>" +
          agentsHtml +
          '<p class="q-stepper-desc">' + stage.desc + "</p>" +
        "</div>" +
        '<div class="q-stepper-nav">' +
          '<button type="button" class="q-step-prev"' + (idx === 0 ? " disabled" : "") + '>&larr; Prev</button>' +
          '<button type="button" class="q-step-next"' + (idx === stages.length - 1 ? " disabled" : "") + '>Next &rarr;</button>' +
        "</div>" +
      "</div>" +
      '<div class="q-flow-bridge">' +
        '<a href="#agents">Meet the agents that compose this work <span class="arrow">&darr;</span></a>' +
      "</div>";

    var prevBtn = quietFlowEl.querySelector(".q-step-prev");
    var nextBtn = quietFlowEl.querySelector(".q-step-next");
    if (prevBtn) prevBtn.addEventListener("click", function () { setStage(osState.stageIdx - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { setStage(osState.stageIdx + 1); });
    quietFlowEl.querySelectorAll(".q-step").forEach(function (btn) {
      btn.addEventListener("click", function () { setStage(parseInt(btn.dataset.stageIdx, 10)); });
    });
  }

  function setStage(idx) {
    osState.stageIdx = idx;
    renderFlowStage();
  }

  function activateOsTab(flow) {
    if (!osTabs) return;
    osTabs.querySelectorAll(".q-tab").forEach(function (t) {
      var on = t.dataset.qFlow === flow;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    osState.flow = flow;
    osState.stageIdx = 0;
    renderFlowStage();
  }

  if (osTabs) {
    osTabs.querySelectorAll(".q-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateOsTab(tab.dataset.qFlow);
      });
    });
    activateOsTab("intelligence");
  }
})();
