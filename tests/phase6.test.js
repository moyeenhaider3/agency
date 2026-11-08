import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync("site/index.html", "utf8");
const css = fs.readFileSync("site/styles.css", "utf8");

test("critical hero content and conversion destinations exist in raw HTML", () => {
  assert.match(html, /<h1[^>]*>Recover revenue and staff time/);
  assert.match(html, /For traditional-business owners and founders/);
  assert.match(html, /90% of routine work handled automatically/);
  assert.match(html, /data-open-demo[^>]*>See the 20-second operating demo/);
  assert.match(html, /href="#revenue-audit"/);
  assert.match(html, /name="description"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<main\b/);
  assert.match(html, /<noscript>/);
});

test("page remains dependency-light and reduced-motion safe", () => {
  assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com|https?:\/\/[^"]+\.(woff2?|ttf|png|jpe?g|webp)/i);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /scroll-behavior: auto !important/);
  assert.match(css, /hero-proof\s*\{\s*min-height/);
  assert.match(css, /overflow-x:\s*hidden|overflow-wrap|word-break/);
});
