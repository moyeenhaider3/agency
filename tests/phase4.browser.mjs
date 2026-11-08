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
  try {
    await waitForServer();
    return await chromium.launch({ headless: true });
  } catch (error) {
    server.kill();
    throw error;
  }
})();

try {
  for (const viewport of [{ width: 375, height: 844 }, { width: 1440, height: 900 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    for (const selector of ["[data-hero-title]", "[data-open-demo][data-primary-action]", "[data-secondary-action]", ".hero-proof"]) {
      const box = await page.locator(selector).first().boundingBox();
      if (!box || box.x < 0 || box.x + box.width > viewport.width || box.y < 0 || box.y + box.height > viewport.height) throw new Error(`${selector} is outside ${viewport.width}x${viewport.height}`);
    }
    const events = await page.evaluate(() => window.__PHASE4_EVENTS);
    if (events.filter(event => event.name === "hero_exposure").length !== 1) throw new Error("expected one hero exposure");
    await page.locator("[data-open-demo][data-primary-action]").click();
    await page.locator("[data-demo-form]").evaluate(form => form.requestSubmit());
    if (!await page.locator("[data-demo-status]").textContent()) throw new Error("demo validation feedback missing");
    await page.locator("[data-demo-name]").fill("Browser proof");
    await page.locator("[data-demo-phone]").fill("9876543210");
    await page.locator("[data-demo-consent]").check();
    await page.locator("[data-demo-form]").evaluate(form => form.requestSubmit());
    await page.locator("[data-close-demo]").click();
    await page.locator("[data-secondary-action]").click();
    await page.locator("[data-audit-name]").fill("Browser proof");
    await page.locator("[data-audit-company]").fill("Local test company");
    await page.locator("[data-audit-phone]").fill("9876543210");
    await page.locator("[data-audit-bottleneck]").fill("Follow-up delay");
    await page.locator("[data-audit-consent]").check();
    await page.locator("[data-audit-form]").evaluate(form => form.requestSubmit());
    await page.locator("[data-faq-trigger]").first().click();
    await page.locator("[data-roi-input]").fill("10000");
    await page.locator("[data-currency=\"USD\"]").click();
    if (await page.locator(".nav-toggle").isVisible()) await page.locator(".nav-toggle").click();
    const finalEvents = await page.evaluate(() => window.__PHASE4_EVENTS);
    const ctas = finalEvents.filter(event => event.name === "cta_click");
    if (!ctas.some(event => event.journey === "demo") || !ctas.some(event => event.journey === "audit")) throw new Error("both CTA seams missing");
    const submits = finalEvents.filter(event => event.name === "form_submit_attempt");
    if (!submits.some(event => event.journey === "demo") || !submits.some(event => event.journey === "audit")) throw new Error("both form seams missing");
    if (new Set(finalEvents.map(event => event.variant)).size !== 1) throw new Error("variant identity changed");
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
