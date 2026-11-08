import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

function content() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync("site/content/phase2.js", "utf8"), context);
  return context.window.PHASE2_CONTENT;
}

test("phase 2 content includes the founding-partner guarantee", () => {
  assert.match(content().pilot.guarantee, /100% of test leads under 30 seconds/);
});
