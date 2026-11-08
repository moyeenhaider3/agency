import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync("site/index.html", "utf8");
const main = fs.readFileSync("site/main.js", "utf8");
const phase4Source = fs.readFileSync("site/content/phase4.js", "utf8");

function phase4() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(phase4Source, context);
  return context.window.PHASE4_CONTENT;
}

test("centralized variants carry outcome, audience, promise, and qualified proof", () => {
  const content = phase4();
  assert.equal(content.experiment.controlId, "control");
  assert.equal(content.experiment.variants.control.title, content.control.title);
  assert.match(content.control.title, /revenue|staff time/i);
  assert.match(content.control.eyebrow, /owners|founders/i);
  assert.match(content.control.promise, /90%.*10%/);
  assert.equal(content.control.proof.length, 3);
  for (const proof of content.control.proof) {
    assert.ok(proof.qualifier);
    assert.ok(proof.source);
  }
  assert.notEqual(content.alternative.title, content.control.title);
});

test("hero uses shared selectors and preserves both Phase 3 destinations", () => {
  for (const marker of ["data-hero-field=\"title\"", "data-hero-field=\"proof\"", "data-open-demo", "href=\"#revenue-audit\"", "content/phase4.js"]) assert.match(html, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(main, /activeVariant/);
  assert.match(main, /data-hero-promise/);
  assert.match(main, /data-hero-title/);
});

test("assignment is deterministic, allowlisted, and safely falls back", () => {
  const content = phase4();
  const first = content.resolveVariant(content.experiment, "stable-session-seed");
  const second = content.resolveVariant(content.experiment, "stable-session-seed");
  assert.equal(first.id, second.id);
  assert.ok(["control", "alternative"].includes(first.id));
  assert.equal(content.resolveVariant({ ...content.experiment, enabled: false }, "seed").id, "control-no-test");
  assert.equal(content.resolveVariant({ ...content.experiment, alternativeShare: "bad" }, "seed").id, "control-no-test");
  assert.equal(content.resolveVariant({ enabled: true, controlId: "unknown", variants: {} }, "seed").id, "control-no-test");
});

test("exposure and conversion seams are session-safe and privacy-safe", () => {
  assert.match(main, /hero_exposure/);
  assert.match(main, /exposureKey/);
  assert.match(main, /cta_click/);
  assert.match(main, /form_submit_attempt/);
  assert.match(main, /variant: variantContext\.variant/);
  assert.doesNotMatch(main, /emit\([^)]*\b(name|phone|email|company|bottleneck)\b/);
  assert.doesNotMatch(main, /PHASE4_EVENT_SINK.*fetch|fetch.*PHASE4_EVENT_SINK/);
});

test("Phase 3 behavior remains local and browser-native", () => {
  assert.match(main, /showModal/);
  assert.match(main, /aria-expanded/);
  assert.match(main, /IntersectionObserver/);
  assert.match(main, /data-roi-input/);
  assert.match(main, /event\.key === "Escape"/);
  assert.match(main, /\bfetch\b/);
});
