import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync("site/index.html", "utf8");
const svg = fs.readFileSync("site/social-card.svg", "utf8");
const robots = fs.readFileSync("site/robots.txt", "utf8");
const sitemap = fs.readFileSync("site/sitemap.xml", "utf8");

test("public metadata uses the confirmed canonical origin", () => {
  for (const value of [
    'rel="canonical" href="https://agenticera.in/"',
    'property="og:title"', 'property="og:description"', 'property="og:url"',
    'property="og:type" content="website"', 'property="og:image" content="https://agenticera.in/social-card.svg"',
    'property="og:image:width" content="1200"', 'property="og:image:height" content="630"',
    'name="twitter:card" content="summary_large_image"'
  ]) assert.match(html, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<html lang="en-IN">/);
  assert.match(html, /name="viewport"/);
});

test("social card is real, sized, and claim-qualified", () => {
  assert.match(svg, /<svg[^>]+width="1200"[^>]+height="630"/);
  assert.match(svg, /<title[^>]*>AgenticeEra Solution/);
  assert.match(svg, /<desc id="description">/);
  assert.match(svg, /90% routine work handled automatically/);
  assert.doesNotMatch(svg, /rating|testimonial|review|guarantee|placeholder/i);
});

test("crawl controls expose only the public page", () => {
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/agenticera\.in\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/agenticera\.in\/<\/loc>/);
  assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
  for (const source of [html, robots, sitemap]) assert.doesNotMatch(source, /\.planning|tests\/|script\.google\.com|PHASE4_EVENTS|debug/i);
});

test("structured data stays omitted until verifiable claims exist", () => {
  assert.doesNotMatch(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|testimonial|ratingValue/i);
});
