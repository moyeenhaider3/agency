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
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  const metadata = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    h1: document.querySelectorAll("h1").length,
    main: Boolean(document.querySelector("main#main-content")),
    nav: Boolean(document.querySelector("nav")),
    hero: document.querySelector("h1")?.textContent.trim()
  }));
  if (metadata.canonical !== "https://agenticera.in/") throw new Error(`unexpected canonical: ${metadata.canonical}`);
  if (!metadata.description || metadata.h1 !== 1 || !metadata.main || !metadata.nav || !metadata.hero) throw new Error("public source landmarks or metadata missing");
  if (!await page.locator("[data-secondary-action]").isVisible()) throw new Error("audit destination missing from public source");
  await context.close();
} finally {
  await browser.close();
  server.kill();
}
