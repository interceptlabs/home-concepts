#!/usr/bin/env node
// qa/camera-framing-check.mjs — permanent headless camera-framing math gate
// for concept-c's scroll dolly (04-04 gap closure).
//
// Imports the SAME buildDollyRig() production runs — never a reimplementation
// of the derivation. Validates the exact three failure modes 04-VERIFICATION.md
// measured against the pre-fix scene:
//   - t=0.4 (Work):        camera-to-object distance 1.70 vs bounding radius 1.82
//   - t=0.6 (Labs):        camera-to-object distance 1.37 vs bounding radius 1.02
//   - t=0.45 (mid-transit): look direction 79.5 degrees off every object
//
// Run: node qa/camera-framing-check.mjs (exits 0 on pass, 1 on any failure).

import { buildDollyRig } from '../concept-c/assets/js/scene.js';

const EPS = 1e-6;
const STANDOFF_FLOOR = 2.5; // locked hard floor per 04-VERIFICATION.md
const SWEEP_CLEARANCE = 1.15; // never inside/grazing a bounding sphere, sweep-wide
const SWEEP_ANGLE_DEG = 30; // half-FOV-adjacent "meaningfully in frame" threshold
const SWEEP_NEAR_RANGE = 30; // only objects within this distance count for the "something in frame" check
const SWEEP_SAMPLES = 101; // t = 0, 0.01, ..., 1.00

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

function angleBetween(a, b) {
  // a, b: {x,y,z} unit-ish vectors — angle in degrees via clamped dot product
  const dot = a.x * b.x + a.y * b.y + a.z * b.z;
  const clamped = Math.max(-1, Math.min(1, dot));
  return toDeg(Math.acos(clamped));
}

function normalize(v) {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

const rig = buildDollyRig();
const { keyframes, cameraPosCurve, lookTargetCurve } = rig;

let failures = [];
const waypointRows = [];

// ─── A. Waypoint invariants ────────────────────────────────────────────────
for (let i = 0; i < keyframes.length; i++) {
  const t = i / 5;
  const kf = keyframes[i];

  const camAtT = cameraPosCurve.getPoint(t);
  const lookAtT = lookTargetCurve.getPoint(t);

  const camErr = distance(camAtT, kf.cameraPos);
  const lookErr = distance(lookAtT, kf.lookAt);

  const dist = distance(kf.cameraPos, kf.lookAt);
  const multiplier = dist / kf.radius;

  const lookDir = normalize(sub(kf.lookAt, kf.cameraPos));
  const bearing = normalize(sub(kf.lookAt, kf.cameraPos)); // bearing to the object IS the look direction at an exact waypoint
  const lookAngle = angleBetween(lookDir, bearing);

  waypointRows.push({
    topic: kf.topic,
    t,
    distance: dist,
    radius: kf.radius,
    multiplier,
    lookAngle,
  });

  if (camErr > EPS) {
    failures.push(
      `[A1] ${kf.topic} (t=${t}): cameraPosCurve.getPoint(t) does not match keyframe cameraPos (err=${camErr.toExponential(3)})`
    );
  }
  if (lookErr > EPS) {
    failures.push(
      `[A1] ${kf.topic} (t=${t}): lookTargetCurve.getPoint(t) does not match keyframe lookAt (err=${lookErr.toExponential(3)})`
    );
  }
  if (multiplier < STANDOFF_FLOOR) {
    failures.push(
      `[A2] ${kf.topic} (t=${t}): standoff multiplier ${multiplier.toFixed(3)}x < floor ${STANDOFF_FLOOR}x (distance=${dist.toFixed(3)}, radius=${kf.radius.toFixed(3)})`
    );
  }
  if (lookAngle > 1) {
    failures.push(`[A3] ${kf.topic} (t=${t}): look-angle ${lookAngle.toFixed(3)} degrees exceeds 1 degree`);
  }
}

// ─── B. Continuous sweep ───────────────────────────────────────────────────
let worstClearanceMultiplier = Infinity;
let worstClearanceSample = null;
let worstMinAngle = -Infinity;
let worstMinAngleSample = null;

for (let s = 0; s < SWEEP_SAMPLES; s++) {
  const t = s / (SWEEP_SAMPLES - 1);
  const camPos = cameraPosCurve.getPoint(t);
  const lookAtPos = lookTargetCurve.getPoint(t);
  const lookDir = normalize(sub(lookAtPos, camPos));

  let minAngleAmongNear = Infinity;
  let anyNear = false;

  for (const kf of keyframes) {
    const d = distance(camPos, kf.lookAt);
    const clearanceMultiplier = d / kf.radius;

    if (clearanceMultiplier < worstClearanceMultiplier) {
      worstClearanceMultiplier = clearanceMultiplier;
      worstClearanceSample = { t, topic: kf.topic, distance: d, radius: kf.radius, clearanceMultiplier };
    }
    if (clearanceMultiplier <= SWEEP_CLEARANCE) {
      failures.push(
        `[B1] t=${t.toFixed(2)}: camera clearance from ${kf.topic} is ${clearanceMultiplier.toFixed(3)}x radius (<= ${SWEEP_CLEARANCE}x floor) — distance=${d.toFixed(3)}, radius=${kf.radius.toFixed(3)}`
      );
    }

    if (d <= SWEEP_NEAR_RANGE) {
      anyNear = true;
      const bearing = normalize(sub(kf.lookAt, camPos));
      const angle = angleBetween(lookDir, bearing);
      if (angle < minAngleAmongNear) minAngleAmongNear = angle;
    }
  }

  if (!anyNear) {
    failures.push(`[B2] t=${t.toFixed(2)}: no object within ${SWEEP_NEAR_RANGE} units of the camera`);
    minAngleAmongNear = Infinity;
  }

  if (minAngleAmongNear > worstMinAngle) {
    worstMinAngle = minAngleAmongNear;
    worstMinAngleSample = { t, minAngle: minAngleAmongNear };
  }

  if (anyNear && minAngleAmongNear > SWEEP_ANGLE_DEG) {
    failures.push(
      `[B2] t=${t.toFixed(2)}: nearest look-angle to any in-range object is ${minAngleAmongNear.toFixed(1)} degrees (> ${SWEEP_ANGLE_DEG} degree threshold) — empty frame`
    );
  }
}

// ─── Output ─────────────────────────────────────────────────────────────────
console.log('Waypoint table:');
console.log('topic          t     distance   radius   multiplier   look-angle(deg)');
for (const row of waypointRows) {
  console.log(
    `${row.topic.padEnd(14)} ${row.t.toFixed(2)}  ${row.distance.toFixed(3).padStart(8)}  ${row.radius.toFixed(3).padStart(7)}  ${row.multiplier.toFixed(3).padStart(10)}x  ${row.lookAngle.toFixed(4)}`
  );
}

console.log('');
console.log(
  `Worst sweep clearance: ${worstClearanceMultiplier.toFixed(3)}x radius at t=${worstClearanceSample.t.toFixed(2)} (${worstClearanceSample.topic}, distance=${worstClearanceSample.distance.toFixed(3)}, radius=${worstClearanceSample.radius.toFixed(3)})`
);
console.log(
  `Worst sweep min-angle (largest "nearest object" angle across the sweep): ${worstMinAngle.toFixed(2)} degrees at t=${worstMinAngleSample.t.toFixed(2)}`
);

if (failures.length > 0) {
  console.error('');
  console.error(`FAIL — ${failures.length} invariant violation(s):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log('');
console.log('PASS — all waypoint and sweep invariants hold.');
process.exit(0);
