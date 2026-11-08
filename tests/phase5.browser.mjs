import { chromium } from "playwright";
import { spawn } from "node:child_process";

const server = spawn("python3", ["-m", "http.server", "4173", "--directory", "site"], { stdio: "ignore" });
const waitForServer = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch("http://127.0.0.1:4173/")).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error("local HTTP server did not respond");
};
const browser = await (async () => {
  try { await waitForServer(); return await chromium.launch({ headless: true }); }
  catch (error) { server.kill(); throw error; }
})();

try {
  for (const viewport of [{ width: 375, height: 844 }, { width: 768, height: 900 }, { width: 1440, height: 900 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.evaluate(() => { window.LEAD_CAPTURE_CONFIG = { endpoint: "" }; });
    await page.locator("[data-open-demo][data-primary-action]").click();
    await page.locator("[data-demo-form]").evaluate(form => form.requestSubmit());
    if (!await page.locator("[data-demo-name]").getAttribute("aria-invalid")) throw new Error("demo field validation missing");
    await page.locator("[data-demo-name]").fill("Browser proof");
    await page.locator("[data-demo-phone]").fill("9876543210");
    await page.locator("[data-demo-consent]").check();
    await page.locator("[data-demo-form]").evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
    await page.locator("[data-demo-status]").waitFor({ state: "visible" });
    await page.locator("[data-close-demo]").click();
    await page.locator("[data-secondary-action]").click();
    await page.locator("[data-audit-name]").fill("Browser proof");
    await page.locator("[data-audit-company]").fill("Local test company");
    await page.locator("[data-audit-phone]").fill("9876543210");
    await page.locator("[data-audit-bottleneck]").fill("Follow-up delay");
    await page.locator("[data-audit-consent]").check();
    await page.locator("[data-audit-form]").evaluate(form => form.requestSubmit());
    await page.waitForTimeout(25);
    const events = await page.evaluate(() => window.__PHASE4_EVENTS);
    const names = events.map(event => event.name);
    for (const event of ["page_view", "hero_exposure", "cta_click", "form_start", "validation_failure", "form_submit_attempt", "form_outcome"]) {
      if (!names.includes(event)) throw new Error(`missing ${event}`);
    }
    if (events.filter(event => event.name === "form_submit_attempt" && event.journey === "demo").length !== 1) throw new Error("demo duplicate submit was captured");
    for (const event of events) {
      for (const forbidden of ["phone", "email", "company", "bottleneck", "whatsapp", "contact"]) {
        if (Object.hasOwn(event, forbidden)) throw new Error(`private field leaked into ${event.name}`);
      }
    }
    if (viewport.width === 375 && await page.locator(".persistent-actions").boundingBox() === null) throw new Error("persistent actions missing on mobile");
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
