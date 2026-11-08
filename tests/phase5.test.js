import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync("site/index.html", "utf8");
const main = fs.readFileSync("site/main.js", "utf8");
const phase3 = fs.readFileSync("site/content/phase3.js", "utf8");

test("Phase 5 defines a versioned privacy-safe event contract", () => {
  for (const event of ["page_view", "cta_click", "form_start", "validation_failure", "form_submit_attempt", "form_outcome"]) {
    assert.match(phase3, new RegExp(`${event}:`));
    assert.match(main, new RegExp(`emit\\("${event}"`));
  }
  assert.match(main, /contract: phase3\.eventContract\.version/);
  assert.match(main, /deviceClass/);
  assert.match(main, /section: location\.hash/);
  assert.doesNotMatch(main, /emit\([^)]*\b(name|phone|email|company|bottleneck|consent)\b/);
});

test("forms expose field-level error relationships and duplicate-safe controls", () => {
  for (const marker of [
    "aria-describedby=\"demo-name-error\"", "data-demo-name-error", "aria-describedby=\"demo-consent-error\"",
    "aria-describedby=\"audit-name-error\"", "data-audit-bottleneck-error", "aria-describedby=\"audit-consent-error"
  ]) assert.match(html, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(main, /aria-invalid/);
  assert.match(main, /formState/);
  assert.match(main, /submitting/);
  assert.match(main, /\.disabled = true/);
  assert.match(main, /stateKey/);
});

test("copy distinguishes configured capture, local simulation, and retry", () => {
  assert.match(phase3, /member of our team will contact you shortly/);
  assert.match(phase3, /No real call was placed/);
  assert.match(phase3, /No external submission was made/);
  assert.match(phase3, /Please check your details and try again/);
  assert.doesNotMatch(main, /(twilio|telephony|crm|calendar|whatsapp\.com|portal)/i);
});

test("analytics sink remains optional and local", () => {
  assert.match(main, /window\.__PHASE4_EVENTS/);
  assert.match(main, /typeof window\.PHASE4_EVENT_SINK === "function"/);
  assert.match(main, /if \(!endpoint\) return false/);
  assert.doesNotMatch(main, /PHASE4_EVENT_SINK.*fetch|fetch.*PHASE4_EVENT_SINK/);
});
