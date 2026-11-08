import { defineConfig } from "playwright";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: { browserName: "chromium", baseURL: "http://127.0.0.1:4173" }
});
