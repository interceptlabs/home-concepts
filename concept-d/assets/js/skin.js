/* Concept D — skin switcher (COND-SKINS): two independent axes.
   Vanilla JS, no libraries.

     · palette (data-palette / ig_palette): Fritz channel colour + the
       matching hero / section-page background video. The palette is pure
       CSS except the <video> source, which this file swaps.
     · layout  (data-layout / ig_layout): hero composition — pure CSS, no
       video involved.

   Both are set pre-paint by the inline head script and can be changed live
   from the top-right switcher (a Colour section + a Layout section in one
   dropdown). Loaded in the body BEFORE hero-video.js / section-video.js so
   the palette's video swap lands before those scripts call play(). The
   default palette (flarepop) is a no-op swap, so it never reloads its video
   and renders byte-identical to the approved build. */
(function () {
  "use strict";

  var PAL_OK = { flarepop: 1, coolsweep: 1, wiretree: 1 };
  var LAY_OK = { stack: 1, split: 1, expand: 1 };

  var PALETTES = [
    { id: "flarepop",  name: "Flarepop",  channel: "Magenta", dot: "#ff00e5" },
    { id: "coolsweep", name: "Coolsweep", channel: "Blue",    dot: "#1a7aff" },
    { id: "wiretree",  name: "Wiretree",  channel: "Green",   dot: "#00d862" }
  ];
  var LAYOUTS = [
    { id: "stack",  name: "Stacked",  note: "Copy above a row of cards",
      glyph: '<rect x="3" y="3" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="4" height="4" rx="1"/><rect x="10" y="11" width="4" height="4" rx="1"/><rect x="17" y="11" width="4" height="4" rx="1"/>' },
    { id: "split",  name: "Split",    note: "Copy left, index right",
      glyph: '<rect x="3" y="4" width="9" height="16" rx="1.5"/><rect x="15" y="4" width="6" height="4" rx="1"/><rect x="15" y="10" width="6" height="4" rx="1"/><rect x="15" y="16" width="6" height="4" rx="1"/>' },
    { id: "expand", name: "Centered", note: "Cards expand on hover",
      glyph: '<rect x="6" y="3" width="12" height="4" rx="1.5"/><rect x="3" y="11" width="4" height="8" rx="1"/><rect x="10" y="11" width="4" height="8" rx="1"/><rect x="17" y="11" width="4" height="8" rx="1"/>' }
  ];

  /* Non-default palettes use a light, continuously-drifting Fritz background
     (mostly-white field, channel-tinted motif) for BOTH the hero and the
     explore-page section layer — coolsweep = cubic (isometric blocks),
     wiretree = organic (drifting contours). Flarepop keeps each page's own
     default footage (the pink waves), captured on load. */
  var VID = {
    hero:    { coolsweep: "bg-shoal-coolsweep-light", wiretree: "bg-organic-wiretree" },
    section: { coolsweep: "bg-shoal-coolsweep",       wiretree: "bg-organic-wiretree" }
  };
  var POSTER = {
    hero:    { coolsweep: "bg-shoal-coolsweep-light-poster.jpg", wiretree: "bg-organic-wiretree-poster.jpg" },
    section: { coolsweep: "bg-shoal-coolsweep-poster.jpg",       wiretree: "bg-organic-wiretree-poster.jpg" }
  };

  var prm = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function curPalette() {
    var p = document.documentElement.getAttribute("data-palette");
    return PAL_OK[p] ? p : "flarepop";
  }

  /* ---- video source swap (palette only) ---- */
  function parseSrc(src) {
    src = src || "";
    var q = "", qi = src.indexOf("?");
    if (qi >= 0) { q = src.slice(qi); src = src.slice(0, qi); }
    var slash = src.lastIndexOf("/");
    var dir = slash >= 0 ? src.slice(0, slash + 1) : "";
    var file = slash >= 0 ? src.slice(slash + 1) : src;
    var dot = file.lastIndexOf(".");
    var name = dot >= 0 ? file.slice(0, dot) : file;
    var ext = dot >= 0 ? file.slice(dot) : "";
    return { dir: dir, name: name, ext: ext, q: q };
  }

  function swap(kind, selector, palette) {
    var video = document.querySelector(selector);
    if (!video) return;
    if (!video._skinCap) {
      var first = video.querySelector("source");
      var p = parseSrc(first ? first.getAttribute("src") : "");
      video._skinCap = { dir: p.dir, stem: p.name, poster: video.getAttribute("poster") || "" };
    }
    var cap = video._skinCap;
    var stem = palette === "flarepop" ? cap.stem : VID[kind][palette];
    var poster = palette === "flarepop" ? cap.poster : (cap.dir + POSTER[kind][palette]);

    var changed = false;
    var sources = video.querySelectorAll("source");
    for (var i = 0; i < sources.length; i++) {
      var ps = parseSrc(sources[i].getAttribute("src"));
      var next = ps.dir + stem + ps.ext + ps.q;
      if (sources[i].getAttribute("src") !== next) { sources[i].setAttribute("src", next); changed = true; }
    }
    if (poster && video.getAttribute("poster") !== poster) { video.setAttribute("poster", poster); }
    if (changed) {
      try { video.load(); } catch (e) {}
      if (!prm) { var r = video.play(); if (r && typeof r.catch === "function") { r.catch(function () {}); } }
    }
  }

  function applyVideos(palette) {
    swap("hero", ".hero-video", palette);
    swap("section", ".section-video", palette);
  }

  /* ---- switcher UI ---- */
  var menu, btn, palOpts = [], layOpts = [];

  function closeMenu() { if (menu) { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); } }
  function openMenu()  { if (menu) { menu.hidden = false; btn.setAttribute("aria-expanded", "true"); } }
  function toggleMenu(){ (menu && menu.hidden) ? openMenu() : closeMenu(); }

  function mark(opts, attr, val) {
    for (var i = 0; i < opts.length; i++) {
      opts[i].setAttribute("aria-checked", opts[i].getAttribute(attr) === val ? "true" : "false");
    }
  }

  function setPalette(p) {
    if (!PAL_OK[p]) p = "flarepop";
    try { localStorage.setItem("ig_palette", p); } catch (e) {}
    document.documentElement.setAttribute("data-palette", p);
    applyVideos(p);
    mark(palOpts, "data-palette", p);
  }
  function setLayout(l) {
    if (!LAY_OK[l]) l = "stack";
    try { localStorage.setItem("ig_layout", l); } catch (e) {}
    document.documentElement.setAttribute("data-layout", l);
    mark(layOpts, "data-layout", l);
  }

  function buildSwitcher() {
    var nav = document.querySelector(".topbar .nav");
    if (!nav || nav.querySelector("[data-skin-switch]")) return;

    var wrap = document.createElement("div");
    wrap.className = "skin-switch";
    wrap.setAttribute("data-skin-switch", "");

    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "skin-switch-btn";
    btn.id = "skinSwitch";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Switch colour and layout");
    btn.setAttribute("title", "Colour & layout");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/>' +
      '<rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>';

    menu = document.createElement("div");
    menu.className = "skin-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-labelledby", "skinSwitch");
    menu.hidden = true;

    var curP = curPalette();
    var curL = LAY_OK[document.documentElement.getAttribute("data-layout")]
      ? document.documentElement.getAttribute("data-layout") : "stack";

    var pLbl = document.createElement("p");
    pLbl.className = "skin-menu-lbl";
    pLbl.textContent = "Colour";
    menu.appendChild(pLbl);
    palOpts = [];
    PALETTES.forEach(function (s) {
      var o = document.createElement("button");
      o.type = "button"; o.className = "skin-opt";
      o.setAttribute("role", "menuitemradio");
      o.setAttribute("data-palette", s.id);
      o.setAttribute("aria-checked", s.id === curP ? "true" : "false");
      o.innerHTML = '<span class="skin-dot" style="background:' + s.dot + '"></span>' +
        '<span class="skin-opt-txt"><b>' + s.name + '</b><i>' + s.channel + '</i></span>';
      o.addEventListener("click", function () { setPalette(s.id); });
      menu.appendChild(o);
      palOpts.push(o);
    });

    var lLbl = document.createElement("p");
    lLbl.className = "skin-menu-lbl skin-menu-sep";
    lLbl.textContent = "Layout";
    menu.appendChild(lLbl);
    layOpts = [];
    LAYOUTS.forEach(function (s) {
      var o = document.createElement("button");
      o.type = "button"; o.className = "skin-opt";
      o.setAttribute("role", "menuitemradio");
      o.setAttribute("data-layout", s.id);
      o.setAttribute("aria-checked", s.id === curL ? "true" : "false");
      o.innerHTML = '<span class="skin-glyph"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + s.glyph + '</svg></span>' +
        '<span class="skin-opt-txt"><b>' + s.name + '</b><i>' + s.note + '</i></span>';
      o.addEventListener("click", function () { setLayout(s.id); });
      menu.appendChild(o);
      layOpts.push(o);
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);

    var themeToggle = nav.querySelector("#themeToggle");
    var ctaNav = nav.querySelector(".cta-nav");
    if (themeToggle) nav.insertBefore(wrap, themeToggle);
    else if (ctaNav) nav.insertBefore(wrap, ctaNav);
    else nav.appendChild(wrap);

    btn.addEventListener("click", function (e) { e.stopPropagation(); toggleMenu(); });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !wrap.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { closeMenu(); btn.focus(); }
    });
  }

  // Swap footage to the persisted palette as early as possible.
  applyVideos(curPalette());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildSwitcher);
  } else {
    buildSwitcher();
  }
})();
