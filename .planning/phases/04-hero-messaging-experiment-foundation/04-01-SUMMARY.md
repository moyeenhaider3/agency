---
phase: 04-hero-messaging-experiment-foundation
plan: 01
subsystem: static-frontend
tags: [hero, experimentation, playwright, conversion, privacy]
requires: [phase-03-conversion-experience-readiness]
provides: [qualified-hero-variants, deterministic-session-assignment, variant-aware-conversion-seams]
affects: [phase-05-conversion-ux-and-privacy-safe-measurement]
tech-stack:
  added: [playwright@1.56.1]
  patterns: [versioned-content-contract, allowlisted-session-variant, local-event-seam, owned-browser-server]
key-files:
  created: [site/content/phase4.js, tests/phase4.test.js, tests/phase4.browser.mjs, package.json, package-lock.json, playwright.config.js]
  modified: [site/index.html, site/main.js, site/styles.css]
decisions:
  - "Keep control as the safe default and store only experiment/approved variant identifiers in session storage."
  - "Use local window event seams with no analytics transport; conversion behavior remains Phase 3 local/simulated."
  - "Use a pinned Playwright browser proof with an owned Python HTTP server lifecycle."
metrics:
  duration: "under 1 hour"
  completed: 2026-11-08
  commits: 5
  plan_head_before: 14b75f1d25aad37d61688a2e6e1b7e24aab7f638
  plan_head_after: 3a1d7d2
status: complete
actuals:
  tokens: 2900
  tasks: 3
  commits: 3
---

# Phase 4 Plan 1: Hero Messaging & Experiment Foundation Summary

The first viewport now presents a stronger qualified business outcome for traditional-business owners and founders, while the shipped Phase 3 conversion paths retain their existing behavior and gain stable local experiment seams.

## What Was Built

- Added centralized versioned control and approved alternative hero copy, CTA labels, qualified proof, and a single experiment switch.
- Rendered hero fields and proof through shared existing markup selectors without duplicating page structure.
- Added deterministic allowlisted assignment, control/no-test fallback, session-stable approved variant storage, and one exposure guard.
- Added privacy-safe local `hero_exposure`, `cta_click`, and `form_submit_attempt` seams carrying journey, placement, experiment, version, and variant only.
- Added the exact `playwright@1.56.1` dev dependency, browser config, static contract tests, and an owned-server Playwright proof covering both target viewports and preserved Phase 3 interactions.
- Added a repository ignore for generated `node_modules/`.

## Requirement Evidence

| Requirement | Evidence |
|---|---|
| HERO-01 | Centralized hero states the recoverable revenue/staff-time outcome, audience, and 90/10 promise; browser proof checks 375px and 1440px first-viewport bounds. |
| HERO-02 | Primary 20-second demo and secondary 15-minute audit remain visible, keyboard-operable destinations. |
| HERO-03 | Each hero proof item carries adjacent qualifier and source text from supplied Phase 1 metrics. |
| EXPERIMENT-01 | `PHASE4_CONTENT` contains one control, one approved alternative, version/key metadata, and one enabled switch. |
| EXPERIMENT-02 | Assignment uses a stable non-personal page seed, allowlist validation, safe fallback, and session reuse. |
| EXPERIMENT-03 | Exposure is guarded by experiment session state and later CTA/form seams carry the same variant. |
| EXPERIMENT-04 | Disabled experiments resolve to `control-no-test` while using the unchanged conversion handlers and event schema. |

## Verification

Passed:

- `npm install`
- `npx playwright install chromium`
- `node --test tests/phase3.test.js tests/phase4.test.js`
- All required `node --check` commands for Phase 1–4 content and main script
- `node tests/phase4.browser.mjs`
- `git diff --check`

The browser runner starts `python3 -m http.server 4173 --directory site`, waits for readiness, runs viewport and interaction assertions, and terminates the child server in `finally`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Made the browser proof responsive to desktop navigation visibility**
- **Found during:** Task 3 browser verification
- **Issue:** The runner attempted to click the mobile navigation toggle at the 1440px viewport where it is intentionally hidden.
- **Fix:** Click the toggle only when visible; mobile coverage still clicks it at 375px.
- **Files modified:** `tests/phase4.browser.mjs`
- **Commit:** `c8795d9`

**2. [Rule 2 - Critical hygiene] Ignored generated Playwright installation output**
- **Found during:** Task 1 dependency installation
- **Issue:** `node_modules/` is generated runtime output and must not remain untracked.
- **Fix:** Added `node_modules/` to `.gitignore`.
- **Files modified:** `.gitignore`
- **Commit:** `abb8e62`

## Self-Check: PASSED

- Found all implementation, test, dependency, and summary files.
- Commits `abb8e62`, `ccb54aa`, and `c8795d9` are ancestors of `HEAD`.
- Ledger measured 3 commits from `14b75f1d25aad37d61688a2e6e1b7e24aab7f638` to `c8795d9`.
