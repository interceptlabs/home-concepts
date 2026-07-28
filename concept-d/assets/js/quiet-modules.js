/* Concept D — quiet module reskin (07-02, ITER-05/ITER-06; retargeted 08-01
   for the standalone quiet explore pages; IT6 round 11 rebuilds three pages
   to Jon's chosen rethink concepts: P-B "Problem / Answer" (problems),
   OS-A "The Assembly Line" (interceptos), R-C "Sorted by Problem" (agents).

   Vanilla JS, no libraries, one IIFE. Loaded AFTER deployed.js on each of
   concept-d/pages/explore/{problems,interceptos,agents,insights,
   case-*}.html. Renders new, quieter DOM by reading deployed.js's own
   untouched data objects (PROBLEMS_RR, PROBLEM_FLOWS, AGENTS, CAT_LABELS,
   CASES — all top-level bindings in an earlier classic <script>, reachable
   as bare identifiers by any later classic <script> in the same document)
   AT RENDER TIME. This file never hard-codes a copy string pulled out of
   those objects — every render function reads the live global directly,
   which is what keeps qa/concept-d-script-diff.py (byte-identical on the
   SOURCE objects) a sufficient verbatim guarantee even though this file's
   renders are new (07-RESEARCH.md Pitfall 4).

   deployed.js is never edited. Its own buildSolve()/renderFlow()/
   renderAgents() calls at load time target #solveDetail/#probFlow/
   #agentsGrid, none of which exists on any explore page (null guards make
   those calls silent no-ops here) — pages/os.html keeps its own #probFlow
   untouched. The agents page reuses deployed.js's own openAgent(k) (a
   top-level classic-script function, reachable here) so the R-C cards open
   the round-8 detail modal with its focus trap intact. */
(function () {
  "use strict";

  /* Shared: the trilogy's chapter navigation (round 11b — Jon: the modules
     must NAVIGATE, not just display). The selected problem is URL state
     (#intelligence … #activation): tabs write it, loads read it, and each
     page bridges FORWARD to the next chapter carrying the same problem —
     problems#K -> interceptos#K -> agents#K. Back/forward re-activate via
     hashchange. */
  function problemKeyFromHash() {
    var h = (location.hash || "").slice(1);
    return typeof PROBLEMS_RR !== "undefined" && PROBLEMS_RR[h] ? h : null;
  }
  function setProblemHash(k) {
    try { history.replaceState(null, "", "#" + k); } catch (e) { /* file:// etc. */ }
  }

  /* The four problems, in deployed.js's own order, rendered as the
     trilogy's common tab anatomy — the problem name in a quiet container
     (round 14: numerals removed at Jon's direction). Used verbatim on the
     problems page and the InterceptOS page. */
  function buildProblemTabs(container, onPick) {
    if (!container || typeof PROBLEMS_RR === "undefined") return null;
    container.innerHTML = Object.keys(PROBLEMS_RR)
      .map(function (k) {
        var p = PROBLEMS_RR[k];
        return (
          '<button class="pb-tab" role="tab" aria-selected="false" data-k="' + k + '">' +
            p.name +
          "</button>"
        );
      })
      .join("");
    container.querySelectorAll(".pb-tab").forEach(function (tab) {
      tab.addEventListener("click", function () { onPick(tab.dataset.k); });
    });
    return function markActive(key) {
      container.querySelectorAll(".pb-tab").forEach(function (t) {
        var on = t.dataset.k === key;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
    };
  }

  /* ============ Problems — P-B "Problem / Answer" ============ */
  /* One composition: quote + attribution + all three tells on the left
     (the problem, in the buyer's words); the stat and the bridge on the
     right in the deep blue (the evidence and our answer). No disclosure. */

  var problemsTabs = document.getElementById("qProblemsTabs");
  var quietSolveEl = document.getElementById("quietSolve");

  if (problemsTabs && quietSolveEl && typeof PROBLEMS_RR !== "undefined") {
    var markProblem = buildProblemTabs(problemsTabs, function (k) {
      renderProblem(k);
      setProblemHash(k);
    });

    var renderProblemView = function (key, p) {
      var tellsHtml = p.tells
        .map(function (t) {
          return "<li>" + t + "</li>";
        })
        .join("");
      var sig = p.signalNum
        ? '<div class="pb-sig"><div class="n">' + p.signalNum + '</div><div class="l">' + p.signalLbl + "</div></div>"
        : '<div class="pb-sig pb-sig--q"><div class="l">' + p.signalLbl + "</div></div>";
      return (
        '<div class="pb-view">' +
          '<div class="pb-main">' +
            '<p class="q-quote">&ldquo;' + p.quote + '&rdquo;</p>' +
            '<p class="q-attrib">' + p.attrib + "</p>" +
            '<ul class="pb-tells">' + tellsHtml + "</ul>" +
          "</div>" +
          '<div class="pb-side">' + sig +
            '<p class="pb-bridge"><b>What we do about it</b>' + p.bridge + "</p>" +
            '<p class="pb-next"><a href="interceptos.html#' + key + '">See how InterceptOS runs this problem <span class="arrow">&rarr;</span></a></p>' +
          "</div>" +
        "</div>"
      );
    };

    function renderProblem(key) {
      var p = PROBLEMS_RR[key];
      if (!p) return;
      markProblem(key);
      quietSolveEl.innerHTML = renderProblemView(key, p);
    }

    renderProblem(problemKeyFromHash() || "intelligence");
    window.addEventListener("hashchange", function () {
      var k = problemKeyFromHash();
      if (k) renderProblem(k);
    });
  }

  /* ============ InterceptOS — OS-A "The Assembly Line" ============ */
  /* The whole four-stage line visible at once, connectors between stages,
     Outcome staged in blue as the payoff. No stepper, no prev/next. */

  var osTabs = document.getElementById("qOsTabs");
  var quietFlowEl = document.getElementById("quietFlow");

  if (osTabs && quietFlowEl && typeof PROBLEM_FLOWS !== "undefined") {
    var markFlow = buildProblemTabs(osTabs, function (k) {
      renderLine(k);
      setProblemHash(k);
    });

    function renderLine(key) {
      var f = PROBLEM_FLOWS[key];
      if (!f) return;
      markFlow(key);

      var stagesHtml = f.stages
        .map(function (s, i) {
          var out = s.tag === "Outcome";
          var agents = s.agents.length
            ? '<span class="agents">' + s.agents.map(function (a) { return '<span class="agent-chip">' + a + "</span>"; }).join("") + "</span>"
            : "";
          var conn = i < f.stages.length - 1 ? '<span class="osa-conn" aria-hidden="true">&rarr;</span>' : "";
          return (
            '<div class="osa-stage' + (out ? " out" : "") + '">' +
              '<span class="tag">' + s.tag + "</span>" +
              '<span class="nm">' + s.name + "</span>" +
              agents +
              '<span class="ds">' + s.desc + "</span>" +
            "</div>" + conn
          );
        })
        .join("");

      quietFlowEl.innerHTML =
        '<div class="osa-flow">' +
          '<div class="osa-head">' +
            '<p class="osa-job"><b>The job:</b> ' + f.job + "</p>" +
            '<span class="q-flow-chip">Runs on <b>' + f.layer + "</b></span>" +
          "</div>" +
          '<div class="osa-line">' + stagesHtml + "</div>" +
          '<div class="q-flow-bridge">' +
            '<a href="agents.html#' + key + '">Meet the agents that compose this work <span class="arrow">&rarr;</span></a>' +
          "</div>" +
        "</div>";
    }

    renderLine(problemKeyFromHash() || "intelligence");
    window.addEventListener("hashchange", function () {
      var k = problemKeyFromHash();
      if (k) renderLine(k);
    });
  }

  /* ============ Agents — R-C "Sorted by Problem" ============ */
  /* The roster organized by the four problems: each band lists every agent
     whose `solves` includes that problem (agents repeat across bands — the
     point). Clicking an agent calls deployed.js's own openAgent(k), which
     fills and opens the round-8 detail modal. */

  var agentsByProblem = document.getElementById("agentsByProblem");

  if (agentsByProblem && typeof AGENTS !== "undefined" && typeof PROBLEMS_RR !== "undefined") {
    agentsByProblem.innerHTML =
      '<div class="rc-bands">' +
      Object.keys(PROBLEMS_RR)
        .map(function (pk) {
          var p = PROBLEMS_RR[pk];
          var squad = Object.keys(AGENTS).filter(function (ak) {
            return AGENTS[ak].solves.indexOf(p.name) !== -1;
          });
          var cards = squad
            .map(function (ak) {
              var a = AGENTS[ak];
              return (
                '<button class="rc-agent" data-agent="' + ak + '" aria-haspopup="dialog">' +
                  '<span class="nm">' + a.name + "</span>" +
                  '<span class="ty">' + a.type + "</span>" +
                "</button>"
              );
            })
            .join("");
          return (
            '<div class="rc-band" data-k="' + pk + '">' +
              '<div class="rc-ph">' +
                '<span class="t">' + p.name + "</span>" +
                '<p class="j">&ldquo;' + p.quote + '&rdquo;</p>' +
                '<a class="rc-how" href="interceptos.html#' + pk + '">How InterceptOS runs this <span class="arrow">&rarr;</span></a>' +
              "</div>" +
              '<div class="rc-agents">' + cards + "</div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>";

    agentsByProblem.querySelectorAll(".rc-agent").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (typeof openAgent === "function") openAgent(btn.dataset.agent);
      });
    });

    /* Arriving with a problem in the URL (from the OS page's bridge, or a
       shared link): scroll that band into view and pulse it. */
    var focusBand = function () {
      var k = problemKeyFromHash();
      if (!k) return;
      var band = agentsByProblem.querySelector('.rc-band[data-k="' + k + '"]');
      if (!band) return;
      band.scrollIntoView({ block: "start", behavior: "smooth" });
      band.classList.remove("is-target");
      void band.offsetWidth; /* restart the pulse animation */
      band.classList.add("is-target");
    };
    focusBand();
    window.addEventListener("hashchange", focusBand);
  }

  /* ============ Case windows (.q-case-detail) — single-open C/A/R ============ */
  /* The always-visible stat/name/client/summary layer lives in the static
     07-01 shell above this hook — this only fills the progressive-disclosure
     Challenge/Approach/Results section + the agents credit line, reading
     CASES[key] (untouched, script-diff-gated data) at render time. */

  var CASE_FIELDS = [
    { key: "challenge", label: "Challenge" },
    { key: "approach", label: "Approach" },
    { key: "results", label: "Results" },
  ];

  function renderCaseField(root, key, field) {
    var c = typeof CASES !== "undefined" ? CASES[key] : null;
    if (!c) return;
    var body = root.querySelector(".q-case-body");
    if (!body) return;

    if (field === "results") {
      body.innerHTML = '<ul class="q-case-results">' +
        c.results.map(function (r) { return "<li>" + r + "</li>"; }).join("") +
        "</ul>";
    } else {
      body.innerHTML = '<p class="q-case-text">' + c[field] + "</p>";
    }
  }

  function buildCaseDetail(root) {
    var key = root.dataset.key;
    var c = typeof CASES !== "undefined" ? CASES[key] : null;
    if (!c) return;

    var tabsHtml = CASE_FIELDS
      .map(function (f, i) {
        return (
          '<button type="button" class="q-tab' + (i === 0 ? " is-active" : "") + '" role="tab" ' +
          'aria-selected="' + (i === 0 ? "true" : "false") + '" data-q-case-field="' + f.key + '">' +
          f.label + "</button>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="q-tabs q-case-tabs" role="tablist" aria-label="Case detail section">' + tabsHtml + "</div>" +
      '<div class="q-case-body"></div>' +
      '<p class="q-case-agents"><b>Agents:</b> ' + c.agents + "</p>";

    renderCaseField(root, key, CASE_FIELDS[0].key);

    root.querySelectorAll(".q-case-tabs .q-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        root.querySelectorAll(".q-case-tabs .q-tab").forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderCaseField(root, key, tab.dataset.qCaseField);
      });
    });
  }

  document.querySelectorAll(".q-case-detail[data-key]").forEach(buildCaseDetail);

  /* ===== Full-page case study body (.case-cad[data-key]) — Jon 07-27 =====
     Renders Challenge / Approach / Results as STACKED sections (full read,
     not tabbed) + the agents credit, from the same CASES data. */
  function buildCasePage(root) {
    var key = root.getAttribute("data-key");
    var c = typeof CASES !== "undefined" ? CASES[key] : null;
    if (!c) return;
    var secs = [
      { lbl: "Challenge", html: "<p>" + c.challenge + "</p>" },
      { lbl: "Approach", html: "<p>" + c.approach + "</p>" },
      {
        lbl: "Results",
        html: '<ul class="cad-results">' +
          c.results.map(function (r) { return "<li>" + r + "</li>"; }).join("") +
          "</ul>"
      }
    ];
    root.innerHTML = secs.map(function (s) {
      return '<section class="cad-sec"><div class="cad-eyebrow">' + s.lbl +
        "</div>" + s.html + "</section>";
    }).join("") + '<p class="cad-agents"><b>Agents:</b> ' + c.agents + "</p>";
  }

  document.querySelectorAll(".case-cad[data-key]").forEach(buildCasePage);
})();
