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
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 844 } });
  const noScriptPage = await noScript.newPage();
  await noScriptPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  if (!await noScriptPage.locator("h1").isVisible()) throw new Error("hero heading is not visible without JavaScript");
  if (!await noScriptPage.locator("[data-open-demo][data-primary-action]").isVisible()) throw new Error("demo destination is missing without JavaScript");
  if (!await noScriptPage.locator("[data-secondary-action]").isVisible()) throw new Error("audit destination is missing without JavaScript");
  if (!await noScriptPage.locator("meta[name=description]").getAttribute("content")) throw new Error("description metadata is missing without JavaScript");
  await noScript.close();

  for (const viewport of [{ width: 375, height: 844 }, { width: 768, height: 900 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    await context.addInitScript(() => {
      window.__phase6 = { lcp: null, cls: 0 };
      if ("PerformanceObserver" in window) {
        try {
          new PerformanceObserver(list => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            if (last) window.__phase6.lcp = last.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
        } catch {}
        try {
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__phase6.cls += entry.value;
          }).observe({ type: "layout-shift", buffered: true });
        } catch {}
      }
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.waitForTimeout(100);
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bytes: performance.getEntriesByType("resource").reduce((total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0), 0),
      lcp: window.__phase6?.lcp,
      cls: window.__phase6?.cls,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior
    }));
    if (metrics.scrollWidth > metrics.width) throw new Error(`horizontal overflow at ${viewport.width}px`);
    if (metrics.bytes > 500000) throw new Error(`pre-interaction resource budget exceeded: ${metrics.bytes} bytes`);
    if (metrics.lcp !== null && metrics.lcp > 2500) throw new Error(`LCP exceeded budget: ${metrics.lcp}ms`);
    if (metrics.cls > 0.1) throw new Error(`CLS exceeded budget: ${metrics.cls}`);
    if (metrics.scrollBehavior !== "auto") throw new Error("reduced-motion scroll behavior was not disabled");
    const clickStart = await page.evaluate(() => performance.now());
    await page.locator("[data-open-demo][data-primary-action]").click();
    await page.locator("[data-demo-name]").waitFor({ state: "visible" });
    const clickDuration = await page.evaluate(start => performance.now() - start, clickStart);
    if (clickDuration > 200) throw new Error(`primary action interaction exceeded 200ms: ${clickDuration}ms`);
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}
