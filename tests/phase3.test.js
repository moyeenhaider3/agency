import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync("site/index.html", "utf8");
const main = fs.readFileSync("site/main.js", "utf8");
const css = fs.readFileSync("site/styles.css", "utf8");

function phase3() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync("site/content/phase3.js", "utf8"), context);
  return context.window.PHASE3_CONTENT;
}

test("centralized conversion content covers both simulated paths and four objections", () => {
  const content = phase3();
  assert.equal(content.demo.labels.name, "Your name");
  assert.equal(content.demo.labels.industry, "Your industry");
  assert.equal(content.demo.labels.phone, "Phone number");
  assert.match(content.demo.success, /No real call was placed/);
  assert.equal(content.audit.labels.company, "Company name");
  assert.equal(content.audit.labels.bottleneck, "Primary bottleneck");
  assert.match(content.audit.success, /not sent|external submission/i);
  assert.equal(content.faq.items.length, 4);
  assert.match(content.faq.items.map(item => item.question).join(" "), /voice/i);
  assert.match(content.faq.items.map(item => item.question).join(" "), /software/i);
  assert.match(content.faq.items.map(item => item.question).join(" "), /risky|high-stakes/i);
  assert.match(content.faq.items.map(item => item.question).join(" "), /guarantee/i);
});

test("conversion markup has labeled required fields, stable targets, and local-only markers", () => {
  for (const marker of ["data-demo-form", "data-demo-name", "data-demo-industry", "data-demo-phone", "data-demo-consent", "data-audit-form", "data-audit-name", "data-audit-company", "data-audit-phone", "data-audit-bottleneck", "data-audit-consent", "data-demo-status", "data-audit-status"]) assert.match(html, new RegExp(marker));
  assert.match(html, /id="revenue-audit"/);
  assert.match(html, /data-open-demo/);
  assert.match(html, /data-persistent-audit/);
  assert.match(html, /<dialog[^>]+data-demo-dialog/);
  assert.match(html, /required[^>]+data-demo-name|data-demo-name[^>]+required/);
  assert.match(main, /\bfetch\b/);
  assert.match(html, /content\/integrations\.js/);
  assert.doesNotMatch(main, /(twilio|telephony|crm|calendar|whatsapp\.com)/i);
});

test("FAQ relationships, focus behavior, and responsive safeguards are present", () => {
  assert.match(main, /aria-controls/);
  assert.match(main, /aria-expanded/);
  assert.match(main, /getElementById\(button\.getAttribute\("aria-controls"\)\)/);
  assert.match(main, /event\.key === "Escape"/);
  assert.match(main, /lastDemoTrigger\?\.focus/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /persistent-actions/);
  assert.match(css, /conversion-layout/);
  for (const anchor of ["#industry-results", "#operating-model", "#roi-calculator", "#pricing", "#faqs"]) assert.match(html, new RegExp(`id="${anchor.slice(1)}"`));
});

test("Phase 1/2 runtime contract remains executable without a browser dependency", () => {
  const context = { window: {}, Intl };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync("site/content/phase2.js", "utf8"), context);
  const content = context.window.PHASE2_CONTENT;
  const result = content.calculateRoi(content.industries[0], { currentInput: 10000, recoverableShare: 20, manualHours: 40, planId: "starter" }, "INR");
  assert.equal(result.monthlyValue, 2000);
  assert.equal(result.eliminatedHours, 8);
  assert.equal(content.formatMoney(2000, "USD"), "$2,000");
  assert.equal(content.plans.length, 3);
  assert.equal(content.industries.length, 5);
});
