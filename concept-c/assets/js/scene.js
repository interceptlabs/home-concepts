// Concept C — the "topic field" three.js scene (CONC-01, CONC-02, CONC-03,
// and the foundational halves of CONC-04/CONC-05). Vendored three.js only
// (assets/vendor/three.module.js + its required sibling three.core.js) —
// no CDN, no build step. Every DOM/WebGL side effect lives behind
// `if (typeof document !== 'undefined') boot();` at the bottom of this file
// so the module can be imported headlessly (`node --input-type=module`) to
// prove the vendor import chain resolves without ever touching a browser API.
import * as THREE from '../vendor/three.module.js';

// ─── Capability probe (Pattern 1) ──────────────────────────────────────────
// Strictly before any renderer/canvas is constructed. `?nowebgl=1` is a
// deliberate test hook that forces the no-webgl path regardless of real
// capability.
function hasWebGL2() {
  if (new URLSearchParams(location.search).has('nowebgl')) return false;
  try {
    const probe = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && probe.getContext('webgl2'));
  } catch (e) {
    return false;
  }
}

// ─── Token helper — materials/clear-color/accent colors ONLY come from
// shared/tokens.css custom properties, never a raw hex or 0x literal. ──────
function readToken(name) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value);
}

// ─── Toon step-gradient map (Pattern 6) — NearestFilter is REQUIRED or the
// hard steps silently degrade into the smooth gradient Fritz forbids. ──────
function makeStepGradientMap(steps = 4) {
  const size = steps;
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.round((i / (size - 1)) * 255);
  }
  const gradientMap = new THREE.DataTexture(data, size, 1, THREE.RedFormat);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.needsUpdate = true;
  return gradientMap;
}

// ─── Device tier heuristic (RESEARCH Pitfall 3) — decided BEFORE any
// renderer/material is constructed. hardwareConcurrency is the primary,
// broadly-supported signal (Safari + Firefox included); deviceMemory is a
// Chromium-only bonus signal used only when present — never the sole gate;
// the narrow-viewport check is the Safari/Firefox fallback for devices that
// expose neither API. Returns 'low' | 'full'. ────────────────────────────
function deviceTier() {
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === 'number' && cores <= 4) return 'low';
  const mem = navigator.deviceMemory;
  if (typeof mem === 'number' && mem <= 4) return 'low';
  if (matchMedia('(max-width: 768px)').matches) return 'low';
  return 'full';
}

// ─── Apex-up right-triangle prism geometry — right angle at (0,0)/(w,0),
// apex at (0,h). Fritz rule: apex up, right angle at base, lean via
// rotation.z only (never inverted). ─────────────────────────────────────────
function makePrismGeometry(w, h, depth) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(w, 0);
  shape.lineTo(0, h);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geometry.center();
  return geometry;
}

// ─── The 6-object field — one per topic, spread along -Z so the dolly
// passes each in sequence. 3 prisms (InterceptOS/Labs/Contact) + 3 box
// slabs/cubes (Problems/Work/Insights), per the plan's discretion mapping.
// Tones cycle through the shared surface ramp for depth, never a raw hex.
// `standoff` is the per-topic camera distance multiplier (on that object's
// own bounding-sphere radius) buildDollyRig() below derives the dolly from —
// hard floor 2.5x, tuned per object within ~2.8-3.8 (04-VERIFICATION.md: the
// only two waypoints that already read well, Problems and Contact, sit at
// 3.8x and 2.9x respectively — kept as anchors here). ──────────────────────
const OBJECT_DEFS = [
  { topic: 'problems', kind: 'box', size: [1.1, 3.2, 1.1], pos: [-2.4, 0.2, 0], tone: '--surface-2', standoff: 3.8 },
  { topic: 'interceptos', kind: 'prism', size: [2.4, 3.0, 1.6], pos: [2.2, 0.6, -8], tone: '--surface-3', leanDeg: 6, standoff: 3.2 },
  { topic: 'work', kind: 'box', size: [2.1, 2.1, 2.1], pos: [-2.0, 0.2, -16], tone: '--surface-2', standoff: 3.4 },
  { topic: 'labs', kind: 'prism', size: [1.1, 1.4, 1.0], pos: [2.4, -0.1, -24], tone: '--surface-3', leanDeg: -9, standoff: 3.6 },
  { topic: 'insights', kind: 'box', size: [3.6, 1.1, 1.1], pos: [-2.2, 0.3, -32], tone: '--surface-2', standoff: 3.0 },
  { topic: 'contact', kind: 'prism', size: [1.8, 2.2, 1.4], pos: [1.8, 0.2, -40], tone: '--surface-3', leanDeg: 8, standoff: 2.9 },
];

// ─── Derived camera dolly rig (Pattern 3, gap-closure) — the camera path is
// no longer hand-tuned; it is computed FROM the object field. For each
// topic: construct its actual geometry, take its real bounding-sphere
// radius, and place the camera at `standoff * radius` along a diagonal
// offset from that object's position, looking straight at it. The offset
// direction always has a positive z-component (camera sits in FRONT of the
// object relative to the dolly's -Z travel direction — it only ever looks
// forward, never back up the tunnel), a non-zero x-component (diagonal, so
// the prisms' apex-up triangular profile stays readable — a pure
// down-the-tunnel view flattens it), and a small positive y (slightly above
// center, for a calm framing). `sideSign` is derived from the object's own
// x position (opposite sign) so the camera weaves side to side across the
// field exactly as the object placement itself already alternates.
//
// cameraPosCurve and lookTargetCurve are built with the SAME point count
// (6) and the SAME CatmullRomCurve3 construction args, so `getPoint(t)`
// (uniform per-segment parametrization — NOT the arc-length-reparametrized
// sibling method the old code used) samples both curves at the identical
// segment position for any t, and lands exactly on keyframe i at t = i/5.
// This is the fix for the two-independently-shaped-curves desync the gap
// report identified.
//
// Pure geometry math — no DOM, no getComputedStyle/readToken, no renderer —
// so this is safe to import and call headlessly (qa/camera-framing-check.mjs
// does exactly that against this same exported function).
export function buildDollyRig() {
  const keyframes = OBJECT_DEFS.map((def) => {
    const [w, h, d] = def.size;
    const geometry = def.kind === 'prism' ? makePrismGeometry(w, h, d) : new THREE.BoxGeometry(w, h, d);
    geometry.computeBoundingSphere();
    const radius = geometry.boundingSphere.radius;
    const lookAt = new THREE.Vector3(def.pos[0], def.pos[1], def.pos[2]);
    const sideSign = def.pos[0] > 0 ? -1 : 1;
    const offsetDir = new THREE.Vector3(sideSign * 1.0, 0.45, 1.5).normalize();
    const standoff = def.standoff;
    const cameraPos = lookAt.clone().addScaledVector(offsetDir, standoff * radius);
    return { topic: def.topic, lookAt, cameraPos, radius, standoff };
  });

  const cameraPosCurve = new THREE.CatmullRomCurve3(
    keyframes.map((k) => k.cameraPos),
    false,
    'catmullrom',
    0.5
  );
  const lookTargetCurve = new THREE.CatmullRomCurve3(
    keyframes.map((k) => k.lookAt),
    false,
    'catmullrom',
    0.5
  );

  return { keyframes, cameraPosCurve, lookTargetCurve };
}

function initScene({ animated, tier }) {
  const mount = document.querySelector('.scene-mount');
  if (!mount) return;

  const lowTier = tier === 'low';

  const canvas = document.createElement('canvas');
  mount.appendChild(canvas);

  // Tier decided by the caller, before this renderer is ever constructed —
  // low tier drops antialiasing outright (RESEARCH Pitfall 3 / CONC-05).
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowTier, powerPreference: 'low-power' });
  if (animated) {
    if (lowTier) {
      renderer.setPixelRatio(1);
    } else {
      const isSmallScreen = matchMedia('(max-width: 768px)').matches;
      renderer.setPixelRatio(isSmallScreen ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    }
  } else {
    // static-scene: DPR forced to 1 regardless of tier, no rAF loop, no
    // parallax (Open Questions recommendation — a frozen real scene, not
    // the flat backdrop).
    renderer.setPixelRatio(1);
  }
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.background = readToken('--page');

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
  const cameraRig = new THREE.Group();
  cameraRig.add(camera);
  scene.add(cameraRig);

  // Light rig: one directional key + a low ambient fill. Colors left at
  // the THREE.Color default (white) via an explicit `undefined` arg —
  // never a raw numeric color literal — since illumination color is not
  // a brand surface token.
  const directional = new THREE.DirectionalLight(undefined, 2.4);
  directional.position.set(-4, 6, 6);
  scene.add(directional);
  const ambient = new THREE.AmbientLight(undefined, 0.35);
  scene.add(ambient);

  // Low tier: 3 hard steps (still within the locked 3-5 range); full tier: 4.
  const gradientMap = makeStepGradientMap(lowTier ? 3 : 4);
  const meshes = OBJECT_DEFS.map((def) => {
    const [w, h, d] = def.size;
    const geometry = def.kind === 'prism' ? makePrismGeometry(w, h, d) : new THREE.BoxGeometry(w, h, d);
    const baseColor = readToken(def.tone);
    const material = new THREE.MeshToonMaterial({ color: baseColor, gradientMap });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
    if (def.leanDeg) {
      mesh.rotation.z = THREE.MathUtils.degToRad(def.leanDeg);
    }
    mesh.userData.topic = def.topic;
    mesh.userData.baseColor = baseColor.clone();
    mesh.userData.baseRotationY = mesh.rotation.y;
    scene.add(mesh);
    return mesh;
  });

  // ─── Projected labels (Pattern 4) — bind each `.topic-label` DOM element
  // to its matching mesh via `data-topic`. ──────────────────────────────────
  const labelBindings = [];
  document.querySelectorAll('.topic-label').forEach((el) => {
    const mesh = meshes.find((m) => m.userData.topic === el.dataset.topic);
    if (mesh) labelBindings.push({ mesh, el });
  });

  const tempV = new THREE.Vector3();
  function updateLabels() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    for (const { mesh, el } of labelBindings) {
      tempV.setFromMatrixPosition(mesh.matrixWorld);
      tempV.project(camera);
      if (Math.abs(tempV.z) > 1) {
        // Behind the camera or past the far plane — never display:none an
        // element that may hold keyboard focus (Pitfall 5).
        el.classList.add('is-hidden');
        continue;
      }
      el.classList.remove('is-hidden');
      const x = (tempV.x * 0.5 + 0.5) * w;
      const y = (tempV.y * -0.5 + 0.5) * h;
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
      el.style.zIndex = String(((-tempV.z * 0.5 + 0.5) * 100000) | 0);
    }
  }

  // ─── Flarepop accent — one object at a time, triggered by its label. ─────
  let accentedMesh = null;
  function setAccent(mesh) {
    if (accentedMesh && accentedMesh !== mesh) {
      accentedMesh.material.color.copy(accentedMesh.userData.baseColor);
    }
    mesh.material.color.copy(readToken('--flarepop'));
    accentedMesh = mesh;
  }
  function clearAccent(mesh) {
    if (accentedMesh === mesh) {
      mesh.material.color.copy(mesh.userData.baseColor);
      accentedMesh = null;
    }
  }
  labelBindings.forEach(({ mesh, el }) => {
    el.addEventListener('mouseenter', () => setAccent(mesh));
    el.addEventListener('focusin', () => setAccent(mesh));
    el.addEventListener('mouseleave', () => clearAccent(mesh));
    el.addEventListener('focusout', () => clearAccent(mesh));
  });

  function runwayEl() {
    return document.querySelector('.scroll-runway');
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (!animated) {
      // render() first — it's what actually updates mesh/camera
      // matrixWorld; projecting before the first-ever render call would
      // read stale (identity) matrices and collapse every label onto the
      // same point.
      renderer.render(scene, camera);
      updateLabels();
    }
  }
  window.addEventListener('resize', resize);
  // Belt-and-braces alongside 'resize' — some browsers fire orientation
  // changes without a corresponding resize event on the same tick.
  window.addEventListener('orientationchange', resize);

  if (!animated) {
    // One-shot overview framing showing all 6 objects; re-projected +
    // re-rendered on resize only (handled in resize() above) — no rAF loop,
    // no cursor parallax, no scroll-driven lerp. Diagonal (not a pure
    // down-the-tunnel or pure side view) so the field's 40-unit depth
    // spread doesn't converge all 6 labels onto the same screen point
    // (pure tunnel) while still keeping enough forward component to read
    // the prisms' triangular profile (pure side view flattens it to a
    // rectangle).
    camera.position.set(26, 6, 6);
    camera.lookAt(-2, 0.5, -20);
    renderer.render(scene, camera);
    updateLabels();
    document.documentElement.dataset.sceneReady = '1';
    return;
  }

  // ─── Animated path: scroll-driven dolly, projected labels every frame,
  // topic-index highlight, idle rotation, cursor parallax, gated rAF loop. ──
  const { cameraPosCurve, lookTargetCurve } = buildDollyRig();

  const smoothPos = new THREE.Vector3().copy(cameraPosCurve.getPoint(0));
  const smoothLook = new THREE.Vector3().copy(lookTargetCurve.getPoint(0));
  const targetPos = new THREE.Vector3();
  const targetLook = new THREE.Vector3();

  const topicIndexItems = Array.from(document.querySelectorAll('.topic-index a'));
  let lastTopicIndex = -1;
  function updateTopicIndex(t) {
    const idx = Math.round(t * (OBJECT_DEFS.length - 1));
    if (idx === lastTopicIndex) return;
    lastTopicIndex = idx;
    topicIndexItems.forEach((el, i) => {
      if (i === idx) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
  }

  function updateCameraFromScroll(scrollY) {
    const runway = runwayEl();
    const denom = runway ? Math.max(runway.offsetHeight - window.innerHeight, 1) : 1;
    const t = THREE.MathUtils.clamp(scrollY / denom, 0, 1);
    cameraPosCurve.getPoint(t, targetPos);
    smoothPos.lerp(targetPos, 0.08);
    lookTargetCurve.getPoint(t, targetLook);
    smoothLook.lerp(targetLook, 0.08);
    camera.position.copy(smoothPos);
    camera.lookAt(smoothLook);
    updateTopicIndex(t);
  }

  // Calm idle: the scroll-focused object only, slow sine y-rotation,
  // long period, +/-5 degrees.
  const clock = new THREE.Clock();
  function applyIdleRotation() {
    const mesh = meshes[lastTopicIndex];
    if (!mesh) return;
    const period = 12;
    const amp = THREE.MathUtils.degToRad(5);
    const elapsed = clock.getElapsedTime();
    mesh.rotation.y = mesh.userData.baseRotationY + Math.sin((elapsed / period) * Math.PI * 2) * amp;
  }

  // Cursor parallax — pointer-fine + non-reduced-motion only, never on touch,
  // never on a low-tier device (CONC-05: parallax never registered on low tier).
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parallaxEnabled = !lowTier && matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion;
  const parallaxTarget = new THREE.Vector2(0, 0);
  if (parallaxEnabled) {
    window.addEventListener('pointermove', (event) => {
      parallaxTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1
      );
    });
  }
  function updateParallax() {
    if (!parallaxEnabled) return;
    const maxTilt = THREE.MathUtils.degToRad(3);
    cameraRig.rotation.y += (parallaxTarget.x * maxTilt - cameraRig.rotation.y) * 0.05;
    cameraRig.rotation.x += (-parallaxTarget.y * maxTilt - cameraRig.rotation.x) * 0.05;
  }

  // ─── Render-loop gating (Pattern 2) — reuses the same scrollY read the
  // camera already needs; NOT an IntersectionObserver (geometrically
  // meaningless on a position:fixed, full-viewport canvas). ─────────────────
  let rafId = null;
  let running = false;

  function shouldRun() {
    const runway = runwayEl();
    const runwayHeight = runway ? runway.offsetHeight : 0;
    return !document.hidden && window.scrollY < runwayHeight + 200;
  }

  function tick() {
    updateCameraFromScroll(window.scrollY);
    applyIdleRotation();
    updateParallax();
    // render() first — updates mesh/camera matrixWorld that updateLabels()
    // depends on; projecting first would read stale matrices on frame 1
    // (every label collapsing onto the same point until a second frame
    // happened to catch up).
    renderer.render(scene, camera);
    updateLabels();
    if (document.documentElement.dataset.sceneReady !== '1') {
      document.documentElement.dataset.sceneReady = '1';
    }
    if (shouldRun()) {
      rafId = requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  function ensureRunning() {
    if (!running && shouldRun()) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }
  }

  window.addEventListener('scroll', ensureRunning, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      running = false;
    } else {
      ensureRunning();
    }
  });
  window.addEventListener('pageshow', ensureRunning);

  ensureRunning();
}

function boot() {
  // Decision tree order (locked): no-webgl check first, then reduced-motion,
  // then device tier — tier is computed before ANY renderer construction and
  // applies inside both the animated and static-scene paths below.
  if (!hasWebGL2()) {
    document.documentElement.classList.add('no-webgl');
    return;
  }
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tier = deviceTier();
  // Logged for the capture rig / SUMMARY — never gates styling on its own.
  document.documentElement.dataset.sceneTier = tier;
  if (prefersReducedMotion) {
    document.documentElement.classList.add('webgl', 'static-scene');
    initScene({ animated: false, tier });
  } else {
    document.documentElement.classList.add('webgl');
    initScene({ animated: true, tier });
  }
}

if (typeof document !== 'undefined') boot();
