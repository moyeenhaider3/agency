# Roadmap: AgenticeEra Solution

## Shipped Milestones

- [x] **v1.0 — AgenticeEra Solution Marketing Frontend** — [archived roadmap](./milestones/v1.0-ROADMAP.md), [archived requirements](./milestones/v1.0-REQUIREMENTS.md)

## v1.1 — Conversion Optimization

**Milestone outcome:** Improve the shipped marketing frontend so the right visitor understands the promise faster, reaches a low-friction enquiry path, and gives the team trustworthy evidence about which messages and actions produce qualified interest—without creating production operations infrastructure.

## Phases

- [x] **Phase 4: Hero Messaging & Experiment Foundation** - Make the first viewport outcome-led, scannable, and ready for controlled message variants.
- [x] **Phase 5: Conversion UX & Privacy-Safe Measurement** - Reduce enquiry friction and instrument both journeys with a local-verifiable, no-op-safe event contract.
- [ ] **Phase 6: Performance & Core Web Vitals** - Keep the conversion path fast, stable, and usable on constrained devices and networks.
- [ ] **Phase 7: SEO & Social Discoverability** - Make the public page intentional for search crawlers and social previews without exposing internal artifacts.

## Phase Details

### Phase 4: Hero Messaging & Experiment Foundation
**Goal**: Visitors understand the business outcome, intended audience, and controlled 90/10 promise in the first viewport, while approved hero and CTA alternatives can be evaluated without duplicating page behavior.
**Depends on**: Phase 3
**Requirements**: HERO-01, HERO-02, HERO-03, EXPERIMENT-01, EXPERIMENT-02, EXPERIMENT-03, EXPERIMENT-04
**Success Criteria** (what must be TRUE):
  1. At 375px and 1440px widths, the first viewport makes the outcome, audience, 90/10 promise, primary demo action, and secondary audit action clear without opening a modal or scrolling.
  2. Hero proof points retain adjacent qualifiers or traceable sources, and the strongest reason to continue is scannable without introducing unsupported claims.
  3. A canonical hero/CTA/proof variant and at least one approved alternative can be selected from versioned configuration through one documented switch, with no duplicated page structure.
  4. Variant assignment is deterministic and safely falls back to control; one session records at most one exposure and carries the same approved variant identifier into later conversion events.
  5. Disabling the experiment restores control content while preserving the same conversion behavior and an explicit control/no-test value.
**Plans**: 1/1 plans executed

Plans:
- [x] 04-01-PLAN.md — Deliver the qualified outcome-led hero and deterministic local experiment foundation
**UI hint**: yes

### Phase 5: Conversion UX & Privacy-Safe Measurement
**Goal**: Visitors can complete either enquiry path with minimal, understandable effort, and the project can verify a privacy-safe funnel without requiring a production analytics destination.
**Depends on**: Phase 4
**Requirements**: FORM-01, FORM-02, FORM-03, FORM-04, ANALYTICS-01, ANALYTICS-02, ANALYTICS-03, ANALYTICS-04
**Success Criteria** (what must be TRUE):
  1. Keyboard and touch users can complete demo and audit forms with clear labels, inline errors, preserved values, accessible status announcements, and an understandable success or retry outcome.
  2. Rapid repeat submission produces at most one captured attempt per form state, while industry, currency, ROI, source, and variant context remain available without collecting raw personal fields as context.
  3. Users can reach an appropriate next action from the hero, after quantified value/pricing, and the persistent action bar at 375px, 768px, and 1440px without obscured content or controls.
  4. Submission messaging explains the human follow-up or retry path and does not imply that calling, WhatsApp, calendar, CRM, or portal workflows were created.
  5. Both journeys emit a documented event sequence for view, CTA, start, validation failure, submit attempt, and outcome; records distinguish journey and approved non-personal context while excluding contact fields.
  6. With analytics configuration absent or blocked, the site remains fully usable with no tracking error; a local sink or test can verify event names, fields, and ordering without external transmission.
**Plans**: 1/1 plans executed
- [x] 05-01-PLAN.md — Complete both enquiry journeys and verify the privacy-safe local funnel contract
**UI hint**: yes

### Phase 6: Performance & Core Web Vitals
**Goal**: The public conversion path loads quickly, remains visually stable, and preserves responsive interaction quality on production-like mobile and desktop conditions.
**Depends on**: Phase 5
**Requirements**: PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. A documented production-like HTTPS run meets LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, and ≤ 500KB transferred before interaction on both mobile and desktop profiles.
  2. With JavaScript disabled or delayed, visitors still see readable hero outcome copy, both conversion destinations, title/description metadata, and no blank content shell.
  3. Reduced-motion visitors and constrained mobile users can use primary actions without nonessential animation, horizontal overflow, blocked controls, or interaction delay over 200ms.
**Plans**: TBD

### Phase 7: SEO & Social Discoverability
**Goal**: Search engines and social platforms receive accurate, intentional public-page signals while internal planning, test, and configuration artifacts remain undiscoverable.
**Depends on**: Phase 4 and Phase 6
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. Rendered source exposes an intent-aligned title, unique description, canonical public URL, correct language/viewport metadata, exactly one meaningful H1, and usable landmarks without JavaScript.
  2. Open Graph and supported social preview metadata provides coherent title, description, URL, type, image dimensions, and alt guidance with no placeholder asset path.
  3. Reviewed robots/sitemap behavior makes public indexing intentional and does not link or expose `.planning`, tests, secrets/endpoints, or debug artifacts.
  4. Any structured data validates and describes only verifiable organization/service information; unsupported ratings, testimonials, guaranteed savings, and fabricated reviews are absent, or structured data is omitted.
**Plans**: TBD

## Execution Order

1. **Phase 4** establishes the canonical hero message, experiment controls, and stable variant context.
2. **Phase 5** builds the conversion experience and event contract on top of those stable actions and variants.
3. **Phase 6** verifies and hardens the complete conversion path against release performance gates.
4. **Phase 7** finalizes public metadata and crawl/share behavior after the message and shipped page surface are stable.

Production CRM, lead routing, voice calling, WhatsApp/messaging, calendar, customer portal, authenticated operations, production analytics vendors, and automated experimentation remain explicitly deferred beyond v1.1.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Hero Messaging & Experiment Foundation | 1/1 | Complete | 2026-11-08 |
| 5. Conversion UX & Privacy-Safe Measurement | 1/1 | Complete | 2026-11-08 |
| 6. Performance & Core Web Vitals | 0/TBD | Not started | - |
| 7. SEO & Social Discoverability | 0/TBD | Not started | - |

## Project History

v1.0 phase details and progress remain preserved in the [archived v1.0 roadmap](./milestones/v1.0-ROADMAP.md). Its 21 completed requirements remain in the [archived v1.0 requirements](./milestones/v1.0-REQUIREMENTS.md).
