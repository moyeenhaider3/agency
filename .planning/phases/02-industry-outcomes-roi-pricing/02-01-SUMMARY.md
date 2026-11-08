---
phase: 02-industry-outcomes-roi-pricing
plan: 01
subsystem: static-frontend
tags: [html, css, javascript, roi, pricing, currency]
requires: [executive-proposition, static-site-shell]
provides: [industry-playbooks, roi-calculator, currency-switcher, pricing-comparison]
affects: [phase-3-conversion]
tech-stack:
  added: []
  patterns: [centralized-phase2-content, shared-roi-calculation, browser-native-controls]
key-files:
  created: [site/content/phase2.js, tests/phase2.test.js]
  modified: [site/index.html, site/main.js, site/styles.css]
decisions:
  - "Keep visitor-entered calculator assumptions blank until supplied rather than inventing a coefficient."
  - "Retain authoritative source-currency labels for case figures without a supplied counterpart."
  - "Use one shared calculation function and one renderer for all five playbooks."
metrics:
  duration: "under 1 hour"
  completed: 2026-11-08
  commits: 4
  plan_head_before: 124c4cc6ae0f2d86c7e571fd055ecca1d3d7a20b
  plan_head_after: 90c5ca2
status: complete
actuals:
  tokens: 9217
  tasks: 3
  commits: 4
---

# Phase 2 Plan 1: Industry Outcomes, ROI & Pricing Summary

Phase 2 replaces the Phase 1 destination placeholders with a dependency-free, currency-aware business-case experience. Visitors can select all five supplied industry playbooks, enter their own operating assumptions, and compare transparent plans without confusing estimates with guarantees.

## What Was Built

- Five keyboard-operable industry tabs with each supplied costly problem, day-one change, financial proof, and source-currency qualifier.
- India/INR and Global/USD controls that preserve industry, volume, calculator inputs, and selected pricing plan.
- Shared ROI calculation contract: current input × recoverable share ÷ 100; eliminated hours = manual hours × recoverable share ÷ 100; setup fee ÷ estimated monthly value for payback.
- Instructional empty state requiring visitor assumptions instead of manufacturing a coefficient.
- Estimated monthly value, eliminated hours, payback, and assumption breakdown with explicit estimate labels.
- Starter Growth System, Growth Department Fleet, and Complete Digital Operations Suite cards with supplied pricing, expected value, payback, wholesale usage promise, and founding-partner guarantee.
- Responsive layouts using the existing alabaster, obsidian, emerald, and amber visual system.

## Requirement Evidence

| Requirement | Evidence |
|---|---|
| PROP-03 | Shared currency state updates calculator and pricing while preserving context. |
| IND-01 | `phase2.js` contains exactly five named playbooks and tabs render them. |
| IND-02 | Each playbook renders problem, day-one change, supplied proof, and assumptions. |
| ROI-01 | Industry-specific volume labels/ranges and current-input controls are rendered from centralized data. |
| ROI-02 | Shared calculation renders estimated value, hours eliminated, and payback in selected currency. |
| PRICE-01 | Three pricing cards render setup, recurring price, deliverable, expected value, and payback. |
| PRICE-02 | Wholesale zero-markup promise and exact 14-day founding-partner guarantee are visible. |

## Verification

Passed:

- `node --check site/main.js`
- `node --check site/content/phase2.js`
- Phase 2 content/calculation smoke: exactly five industries and finite positive populated ROI result.
- `node --test tests/phase2.test.js` (TDD GREEN).
- Direct static server smoke on port 4173 with `#roi-calculator` served.
- Stable anchor and Phase 1 proof-marker checks.
- Stub scan for TODO/FIXME/placeholder/coming-soon markers found none in Phase 2 files.

Manual browser review remains for visual breakpoint and keyboard traversal confirmation.

## TDD Gate Compliance

- **RED:** `tests/phase2.test.js` intentionally failed because the founding-partner guarantee was not yet present.
- **GREEN:** Centralized `pilot.guarantee` content was added; the target test passed.
- **REFACTOR:** Source-currency labeling and plan-select synchronization were kept in shared render paths rather than duplicated per industry.

## Deviations from Plan

None. The implementation stayed dependency-free, used only the authoritative figures in the plan, and added no integrations or secrets.

## Self-Check: PASSED

- Found `site/content/phase2.js`, `site/index.html`, `site/main.js`, `site/styles.css`, and `tests/phase2.test.js`.
- Plan commits are ancestors of `90c5ca2`: `e1755f8`, `48d94b6`, `aec143b`, `90c5ca2`.
- Commit ledger measured 4 commits from `124c4cc6ae0f2d86c7e571fd055ecca1d3d7a20b` to `90c5ca2`.
