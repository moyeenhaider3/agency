# Requirements: AgenticeEra Solution v1.1 Conversion Optimization

**Status:** Active  
**Milestone:** v1.1 Conversion Optimization  
**Source:** v1.0 shipped site, v1.0 requirements/roadmap, v1.0 audit, and live files in `site/`

## Milestone Outcome

Improve the existing marketing frontend so the right visitor understands the promise faster, reaches a low-friction enquiry path, and gives the team trustworthy evidence about which messages and actions produce qualified interest—without turning the site into a production operations platform.

## Acceptance Conventions

- “Visitor can” means verifiable in a browser at mobile and desktop widths.
- “Event” means a documented, privacy-safe event name with a defined trigger and payload; no direct personal data is included.
- Performance measurements use a production-like deployment over HTTPS with a cold-cache mobile run and a repeat desktop run. Thresholds below are release gates, not lab-only aspirations.
- Conversion numbers must remain labeled as estimates, examples, or observed site events; they must not become business guarantees.

## v1.1 Requirements

### Hero Messaging

- [x] **HERO-01:** The hero communicates, in its first viewport, (1) the business outcome, (2) who the service is for, and (3) the controlled 90/10 operating promise in plain executive language.
  - **Acceptance:** On a 375px-wide viewport and a 1440px-wide viewport, a reviewer can identify all three points without opening a modal, scrolling past the first viewport, or reading more than the hero heading, supporting copy, and proof block.
- [x] **HERO-02:** The hero presents one primary conversion action and one secondary revenue-audit action with copy that states the expected time or next step.
  - **Acceptance:** The primary action opens the existing 20-second demo path; the secondary action reaches the audit form; both actions remain visible and keyboard-operable in the first viewport at both target widths.
- [x] **HERO-03:** Hero proof points and claims preserve their source, qualifier, and estimate/guarantee distinction while making the strongest reason to continue visually scannable.
  - **Acceptance:** Every hero metric has an adjacent qualifier or traceable content source, and automated content checks find no unsupported new case-study, savings, or guarantee claim.

### CTA and Form UX

- [ ] **FORM-01:** The demo and revenue-audit paths use a consistent, low-friction form pattern with clear required fields, input purpose, consent/privacy language, and inline validation.
  - **Acceptance:** A keyboard-only user can reach every field, trigger validation, understand each error next to the relevant field, correct it without losing entered values, and reach a success or failure status announced through an accessible live region.
- [ ] **FORM-02:** Conversion actions preserve visitor context and prevent accidental duplicate submissions while the existing simulated/local and configured lead-capture behaviors complete.
  - **Acceptance:** Submitting twice rapidly results in at most one captured conversion attempt per form submission state; selected industry, currency, ROI assumptions, and source/variant context remain available to the success or failure handling without collecting them as free-form personal data.
- [ ] **FORM-03:** CTA placement and labels provide a clear next action at the hero, after quantified value/pricing, and in the persistent mobile/desktop action bar without obscuring content or controls.
  - **Acceptance:** A reviewer can reach either conversion path from each of those three journey points; the persistent bar does not cover focused fields, modal actions, or essential text at 375px, 768px, and 1440px widths.
- [ ] **FORM-04:** The forms communicate what happens after submission and set expectations that the current site does not provide production calling, WhatsApp, calendar, CRM, or customer-portal workflows.
  - **Acceptance:** Success and failure states explain the next human follow-up or retry path without implying an automated appointment, voice callback, WhatsApp message, or portal account has been created.

### Conversion Analytics

- [ ] **ANALYTICS-01:** The site emits a documented, privacy-safe funnel event set for page view, CTA view/click, form start, validation failure, form submit attempt, and form outcome.
  - **Acceptance:** Each event has a stable name, trigger, and versioned payload documented in the requirements or implementation-facing contract; payloads exclude name, phone, email, free-text messages, and full form values.
- [ ] **ANALYTICS-02:** Funnel events distinguish the demo and audit journeys and retain non-personal context needed to compare conversion quality.
  - **Acceptance:** An event record can identify journey, page/section, device class, industry selection, currency, CTA placement, and active experiment variant when present, while omitting direct identifiers and raw contact fields.
- [ ] **ANALYTICS-03:** Analytics instrumentation is disabled or safely no-ops when no approved collection destination is configured, and the conversion experience remains fully usable.
  - **Acceptance:** With analytics configuration absent or blocked, forms, navigation, ROI, and success/failure states still work; no console error or unhandled promise is produced by tracking failure.
- [ ] **ANALYTICS-04:** The project provides a repeatable way to verify the funnel event contract locally without sending visitor data to an external analytics service.
  - **Acceptance:** A local test or debug sink can assert event names, required non-personal fields, and journey ordering for both conversion paths.

### A/B-Test-Ready Structure

- [x] **EXPERIMENT-01:** Hero message, primary CTA label, and supporting proof can be selected from a versioned variant configuration without duplicating page structure or changing the default experience accidentally.
  - **Acceptance:** A reviewer can identify one canonical control variant and at least one alternative configuration in data/configuration, with a single documented switch determining the rendered variant.
- [x] **EXPERIMENT-02:** Variant assignment is deterministic for a visitor/session, defaults safely, and exposes the assigned variant to conversion analytics.
  - **Acceptance:** Reloading within the same supported session preserves the assigned variant; an unavailable, malformed, or unapproved variant resolves to control; no personal identifier is required for assignment.
- [x] **EXPERIMENT-03:** Experiment exposure and conversion events use stable experiment/variant identifiers and prevent a visitor from being counted as exposed repeatedly during ordinary page interaction.
  - **Acceptance:** One page session produces at most one exposure event per experiment, and subsequent CTA/form events carry the same approved variant identifier.
- [x] **EXPERIMENT-04:** Experiment structure supports disabling a test and returning to the control copy without a code-path fork in the form or analytics behavior.
  - **Acceptance:** Turning the experiment off renders control content and continues emitting the same funnel event schema with an explicit control/no-test value.

### Performance and Core Web Vitals

- [ ] **PERF-01:** The landing page meets the v1.1 performance budget on a production-like deployment: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, and total transferred page resources ≤ 500KB before visitor interaction.
  - **Acceptance:** A documented Lighthouse or equivalent run records all four thresholds on mobile and desktop test profiles; any exception names the measured resource and approved reason.
- [ ] **PERF-02:** The critical hero render does not depend on delayed JavaScript for meaningful heading, supporting copy, primary CTA, or essential metadata.
  - **Acceptance:** With JavaScript disabled or delayed, the hero still exposes readable outcome copy, both conversion destinations, document title/description, and no blank content shell.
- [ ] **PERF-03:** Responsive interaction and motion remain usable under reduced-motion preferences and on constrained mobile hardware/network conditions.
  - **Acceptance:** Reduced-motion mode removes nonessential animation/scroll behavior, and a throttled mobile run has no blocked controls, horizontal overflow, or interaction delay over 200ms for primary actions.

### SEO and Social Sharing

- [x] **SEO-01:** The page has a search-intent-aligned title, unique description, canonical URL, correct language/viewport metadata, and a crawlable heading/landmark structure for the public marketing page.
  - **Acceptance:** Metadata is present in the rendered source, the canonical points to the intended public URL, exactly one meaningful H1 is present, and navigation/content landmarks remain available without JavaScript.
- [x] **SEO-02:** Social sharing metadata provides a coherent title, description, canonical/share URL, and image dimensions/alt guidance for Open Graph and supported social preview consumers.
  - **Acceptance:** A metadata inspection or preview validator finds complete `og:title`, `og:description`, `og:url`, `og:type`, and image metadata, with copy matching the approved positioning and no placeholder asset path.
- [x] **SEO-03:** Public crawl and indexing behavior is intentional and does not expose internal planning, test, or configuration artifacts.
  - **Acceptance:** The deployment includes reviewed robots/sitemap behavior for the public page, and no `.planning`, test, endpoint-secret, or debug artifact is linked or indexed from the site.
- [x] **SEO-04:** Structured data, if used, describes only verifiable organization/service information and does not turn illustrative ROI figures into review, financial, or outcome claims.
  - **Acceptance:** Any JSON-LD passes syntax validation and contains no unsupported ratings, testimonials, guaranteed savings, or fabricated reviews; omitting structured data is acceptable if these conditions cannot be met.

## Non-Goals / Explicit Deferrals

The following are intentionally not v1.1 deliverables:

- Production CRM, lead-routing, or sales-workflow integration.
- Voice calling, WhatsApp/messaging, or calendar booking integrations.
- Authenticated customer portal, dashboards, customer accounts, or approval workflows.
- Production analytics vendor setup, ad-platform pixels, user-level tracking, or selling/retaining personal data. v1.1 only defines and verifies a privacy-safe event contract and an adapter-ready/no-op implementation.
- New industry case studies, unsupported financial results, additional guarantees, or actual financial/healthcare/tax/legal advice.
- A production experimentation platform, remote feature-management service, statistical significance engine, or automated winner rollout. v1.1 makes the frontend test-ready only.
- Replacing the existing dependency-free/static architecture with a framework or broad visual redesign unrelated to conversion evidence.

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| HERO-01 | Phase 4 | Complete |
| HERO-02 | Phase 4 | Complete |
| HERO-03 | Phase 4 | Complete |
| FORM-01 | Phase 5 | Complete |
| FORM-02 | Phase 5 | Complete |
| FORM-03 | Phase 5 | Complete |
| FORM-04 | Phase 5 | Complete |
| ANALYTICS-01 | Phase 5 | Complete |
| ANALYTICS-02 | Phase 5 | Complete |
| ANALYTICS-03 | Phase 5 | Complete |
| ANALYTICS-04 | Phase 5 | Complete |
| EXPERIMENT-01 | Phase 4 | Complete |
| EXPERIMENT-02 | Phase 4 | Complete |
| EXPERIMENT-03 | Phase 4 | Complete |
| EXPERIMENT-04 | Phase 4 | Complete |
| PERF-01 | Phase 6 | Complete |
| PERF-02 | Phase 6 | Complete |
| PERF-03 | Phase 6 | Complete |
| SEO-01 | Phase 7 | Complete |
| SEO-02 | Phase 7 | Complete |
| SEO-03 | Phase 7 | Complete |
| SEO-04 | Phase 7 | Complete |

**Coverage:** 22/22 v1.1 requirements mapped exactly once across Phases 4-7.
