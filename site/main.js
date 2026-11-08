(function () {
  "use strict";
  const phase1 = window.PHASE1_CONTENT;
  const content = window.PHASE2_CONTENT;
  const phase3 = window.PHASE3_CONTENT;
  const phase4 = window.PHASE4_CONTENT;
  if (!phase1 || !content || !phase3 || !phase4) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
  const list = (selector, items, render) => { const node = $(selector); if (node) node.innerHTML = items.map(render).join(""); };
  const safeSession = () => { try { return window.sessionStorage; } catch { return null; } };
  const session = safeSession();
  const variantKey = `agenticeera-phase4-variant:${phase4.experiment.key}`;
  const storedVariant = session?.getItem(variantKey);
  const allowedStoredVariant = storedVariant && (
    storedVariant === phase4.experiment.controlId ||
    Object.prototype.hasOwnProperty.call(phase4.experiment.variants || {}, storedVariant) ||
    storedVariant === "control-no-test"
  ) ? storedVariant : null;
  const calculatedAssignment = phase4.resolveVariant(phase4.experiment, location.pathname || "home");
  const assignment = allowedStoredVariant
    ? { id: allowedStoredVariant, content: allowedStoredVariant === "control-no-test" ? phase4.control : phase4.experiment.variants[allowedStoredVariant], enabled: calculatedAssignment.enabled }
    : calculatedAssignment;
  try { session?.setItem(variantKey, assignment.id); } catch { /* control remains usable without storage */ }
  const activeVariant = assignment.content;
  const variantContext = { experiment: phase4.experiment.key, version: phase4.version, variant: assignment.id };
  const state = { industry: content.industries[0].id, currency: "INR", volume: "", currentInput: "", recoverableShare: "", manualHours: "", planId: "starter" };
  const deviceClass = () => window.matchMedia?.("(max-width: 767px)").matches ? "mobile" : window.matchMedia?.("(max-width: 1023px)").matches ? "tablet" : "desktop";
  const safeContext = () => ({ section: location.hash || "#top", device: deviceClass(), industry: state?.industry || content.industries[0].id, currency: state?.currency || "INR" });
  const emit = (name, details = {}) => {
    const payload = { name, contract: phase3.eventContract.version, ...variantContext, ...safeContext(), ...details };
    if (!Array.isArray(window.__PHASE4_EVENTS)) window.__PHASE4_EVENTS = [];
    window.__PHASE4_EVENTS.push(payload);
    if (typeof window.PHASE4_EVENT_SINK === "function") window.PHASE4_EVENT_SINK(payload);
    window.dispatchEvent(new CustomEvent(`phase4:${name}`, { detail: payload }));
  };
  emit("page_view", { journey: "page", placement: "page" });
  const exposureKey = `agenticeera-phase4-exposure:${phase4.experiment.key}`;
  if (!session?.getItem(exposureKey)) {
    emit("hero_exposure", { placement: "hero" });
    try { session?.setItem(exposureKey, assignment.id); } catch { /* control fallback remains local */ }
  }
  const getIndustry = () => content.industries.find(item => item.id === state.industry) || content.industries[0];

  list("[data-nav-links]", phase1.nav, item => `<a href="${item.href}">${item.label}</a>`);
  setText("[data-hero-eyebrow]", activeVariant.eyebrow); setText("[data-hero-title]", activeVariant.title); setText("[data-hero-intro]", activeVariant.intro);
  setText("[data-hero-promise]", activeVariant.promise); setText("[data-primary-action]", activeVariant.primaryAction);
  setText("[data-secondary-action]", activeVariant.secondaryAction);
  list("[data-metrics]", activeVariant.proof, item => `<div class="metric"><strong>${item.value}</strong><span>${item.label}</span><small>${item.qualifier} · ${item.source}</small></div>`);
  setText("[data-comparison-title]", phase1.comparison.title); setText("[data-comparison-intro]", phase1.comparison.intro); setText("[data-old-label]", phase1.comparison.old.label); setText("[data-new-label]", phase1.comparison.new.label);
  list("[data-old-points]", phase1.comparison.old.points, item => `<li>${item}</li>`); list("[data-new-points]", phase1.comparison.new.points, item => `<li>${item}</li>`);
  const cost = phase1.comparison.costComparison;
  list("[data-cost-comparison]", [cost], item => `<div class="cost-heading"><p class="card-label">${item.label}</p><p>${item.note}</p></div><div class="cost-items"><div><strong>${item.manual.value}</strong><span>${item.manual.text}</span></div><div><strong>${item.digital.value}</strong><span>${item.digital.text}</span></div><div><strong>${item.recovered.value}</strong><span>${item.recovered.text}</span></div></div>`);
  list("[data-metrics-secondary]", phase1.metrics, item => `<div><strong>${item.value}</strong><span>${item.label}</span></div>`);
  list("[data-workflow]", phase1.workflow, item => `<article class="workflow-step"><span class="step-number">${item.number}</span><h3>${item.title}</h3><p>${item.text}</p></article>`);
  list("[data-assurances]", phase1.assurances, item => `<article class="assurance"><span class="assurance-icon" aria-hidden="true">✓</span><div><h3>${item.title}</h3><p>${item.text}</p></div></article>`);
  setText("[data-evidence-title]", phase1.evidence.title); setText("[data-evidence-text]", phase1.evidence.text);

  function renderTabs() {
    list("[data-industry-tabs]", content.industries, item => `<button type="button" role="tab" id="tab-${item.id}" aria-controls="panel-${item.id}" aria-selected="${item.id === state.industry}" class="${item.id === state.industry ? "is-selected" : ""}" data-industry="${item.id}">${item.name}<span>${item.audience}</span></button>`);
    $$("[data-industry]").forEach(button => button.addEventListener("click", () => { state.industry = button.dataset.industry; renderAll(); }));
  }
  function renderPlaybook() {
    const item = getIndustry();
    const proof = item.proof.map(entry => {
      const sourceCurrency = entry.value.includes("₹") && entry.value.includes("$") ? "Source currencies: INR and USD" : entry.value.includes("₹") ? "Source currency: INR" : entry.value.includes("$") ? "Source currency: USD" : "Source currency: not applicable";
      return `<div class="proof-stat"><strong>${entry.value}</strong><span>${entry.label}</span><small>${entry.source} · ${sourceCurrency}</small></div>`;
    }).join("");
    $("[data-industry-playbook]").innerHTML = `<article id="panel-${item.id}" role="tabpanel" aria-labelledby="tab-${item.id}" class="playbook-panel"><div class="playbook-copy"><p class="eyebrow">${item.shortName}</p><h3>${item.problem}</h3><p><strong>Day one:</strong> ${item.change}</p><p class="assumption-note">${item.assumption}</p></div><div class="proof-stats">${proof}</div></article>`;
  }
  function renderCurrency() {
    $$("[data-currency]").forEach(button => { const selected = button.dataset.currency === state.currency; button.classList.toggle("is-active", selected); button.setAttribute("aria-pressed", String(selected)); });
  }
  function renderRoi() {
    const item = getIndustry();
    setText("[data-volume-label]", item.inputs.volumeLabel);
    const volume = $("[data-roi-volume]"), input = $("[data-roi-input]"), share = $("[data-roi-share]"), hours = $("[data-roi-hours]");
    volume.min = item.inputs.min; volume.max = item.inputs.max; volume.value = state.volume; input.value = state.currentInput; share.value = state.recoverableShare; hours.value = state.manualHours;
    const planSelect = $("[data-plan-select]");
    if (planSelect) planSelect.value = state.planId;
    const result = content.calculateRoi(item, { volume: state.volume, currentInput: state.currentInput, recoverableShare: state.recoverableShare, manualHours: state.manualHours, planId: state.planId }, state.currency);
    const output = $("[data-roi-output]");
    if (!result) { output.innerHTML = `<div class="roi-empty"><p class="card-label">Waiting for your assumptions</p><h3>Enter the four operating inputs to see an estimate.</h3><p>Your current input × recoverable share ÷ 100 becomes estimated monthly value. We do not invent a coefficient for you.</p></div>`; return; }
    output.innerHTML = `<p class="card-label">Estimate for ${item.name}</p><div class="roi-results"><div><strong>${content.formatMoney(result.monthlyValue, state.currency)}</strong><span>Estimated monthly savings / recovered revenue</span></div><div><strong>${result.eliminatedHours.toFixed(1)} hours</strong><span>Estimated manual hours eliminated</span></div><div><strong>${Math.max(1, Math.round(result.paybackDays))} days</strong><span>Estimated payback on setup fee</span></div></div><div class="assumption-breakdown"><strong>Assumptions used</strong><span>Current input: ${content.formatMoney(Number(state.currentInput), state.currency)}</span><span>Recoverable share: ${state.recoverableShare}%</span><span>Manual hours: ${state.manualHours}</span><span>Setup fee: ${content.formatMoney(result.setupFee, state.currency)}</span><small>Formula: current input × recoverable share ÷ 100; setup fee ÷ estimated monthly value. Estimate only.</small></div>`;
  }
  function renderPricing() {
    const market = state.currency === "USD" ? "global" : "india";
    list("[data-pricing]", content.plans, plan => `<article class="pricing-card ${plan.popular ? "is-popular" : ""}"><p class="card-label">${plan.popular ? "Most popular" : "Starting path"}</p><h3>${plan.name}</h3><p>${plan.deliverable}</p><div class="price-line"><strong>${content.formatMoney(plan[market].setup, state.currency)}</strong><span>setup</span></div><div class="price-line"><strong>${content.formatMoney(plan[market].monthly, state.currency)}</strong><span>per month</span></div><p class="value-note">Expected value: ~${content.formatMoney(plan[market].value, state.currency)} / month · ${plan.payback}</p><button type="button" class="plan-choice" data-plan="${plan.id}">Use for ROI estimate</button></article>`);
    $$("[data-plan]").forEach(button => button.addEventListener("click", () => { state.planId = button.dataset.plan; renderRoi(); document.querySelector("#roi-calculator").scrollIntoView({ behavior: "smooth" }); }));
    const usage = state.currency === "USD" ? content.usage.global : content.usage.india;
    $("[data-usage-promise]").innerHTML = `<p class="card-label">Wholesale usage promise</p><p>Connect phone, WhatsApp, and software accounts directly at wholesale cost, typically <strong>${usage}</strong>. <strong>Zero hidden markups.</strong></p>`;
    $("[data-pilot]").innerHTML = `<p class="card-label">Founding Partner pilot</p><p><strong>50% off setup</strong>, ${state.currency === "USD" ? content.pilot.global : content.pilot.india}. ${content.pilot.guarantee}</p>`;
  }
  function renderAll() { renderTabs(); renderPlaybook(); renderCurrency(); renderRoi(); renderPricing(); }
  renderAll();

  function renderConversionCopy() {
    const demo = phase3.demo, audit = phase3.audit;
    setText("[data-secondary-action]", activeVariant.secondaryAction); setText("[data-demo-title]", demo.title); setText("[data-demo-intro]", demo.intro); setText("[data-demo-privacy]", demo.privacy);
    $$("[data-demo-privacy]").forEach(node => { node.textContent = demo.privacy; });
    $$("[data-consent-label]").forEach(node => { node.textContent = demo.consent; });
    setText("[data-demo-name-label]", demo.labels.name); setText("[data-demo-industry-label]", demo.labels.industry); setText("[data-demo-phone-label]", demo.labels.phone); setText("[data-demo-submit]", demo.submit);
    setText("[data-audit-title]", audit.title); setText("[data-audit-intro]", audit.intro); setText("[data-audit-privacy]", audit.privacy);
    const auditConsent = $("[data-audit-form] [data-consent-label]");
    if (auditConsent) auditConsent.textContent = audit.consent;
    setText("[data-audit-name-label]", audit.labels.name); setText("[data-audit-company-label]", audit.labels.company); setText("[data-audit-phone-label]", audit.labels.phone); setText("[data-audit-bottleneck-label]", audit.labels.bottleneck); setText("[data-audit-submit]", audit.submit);
    $$("[data-demo-industry]").forEach(select => { select.innerHTML = content.industries.map(item => `<option value="${item.id}">${item.name}</option>`).join(""); });
    setText("[data-persistent-demo]", phase3.actions.demo); setText("[data-persistent-audit]", phase3.actions.audit);
    setText("[data-faqs-kicker]", phase3.faq.kicker); setText("[data-faqs-title]", phase3.faq.title); setText("[data-faqs-text]", phase3.faq.intro);
    list("[data-faq-list]", phase3.faq.items, (item, index) => `<article class="faq-item"><h3><button type="button" class="faq-trigger" aria-expanded="false" aria-controls="faq-answer-${index}" data-faq-trigger>${item.question}<span aria-hidden="true">+</span></button></h3><div id="faq-answer-${index}" class="faq-answer" hidden><p>${item.answer}</p></div></article>`);
  }
  renderConversionCopy();
  function validPhone(value) { return String(value || "").replace(/\D/g, "").length >= 7; }
  async function submitLead(payload) {
    const endpoint = window.LEAD_CAPTURE_CONFIG?.endpoint;
    if (!endpoint) return false;
    await fetch(endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(payload) });
    return true;
  }
  function setStatus(selector, message, valid) {
    const node = $(selector);
    if (node) { node.textContent = message; node.classList.toggle("is-success", Boolean(valid)); node.classList.toggle("is-error", !valid); }
  }
  const formState = {
    demo: { started: false, submitting: false, lastKey: "" },
    audit: { started: false, submitting: false, lastKey: "" }
  };
  function markField(field, errorNode, message) {
    if (!field || !errorNode) return;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    errorNode.textContent = message || "";
  }
  function clearFields(prefix) {
    $$(`[data-${prefix}-form] [aria-invalid="true"]`).forEach(field => field.setAttribute("aria-invalid", "false"));
    $$(`[data-${prefix}-form] .field-error`).forEach(node => { node.textContent = ""; });
  }
  function beginForm(journey, placement) {
    if (!formState[journey].started) {
      formState[journey].started = true;
      emit("form_start", { journey, placement });
    }
  }
  function validateDemo() {
    const name = $("[data-demo-name]"), industry = $("[data-demo-industry]"), phone = $("[data-demo-phone]"), consent = $("[data-demo-consent]");
    const fields = [
      [name, $("[data-demo-name-error]"), name.value.trim() ? "" : "Enter your name."],
      [industry, $("[data-demo-industry-error]"), industry.value ? "" : "Choose your industry."],
      [phone, $("[data-demo-phone-error]"), phone.value.trim() ? (validPhone(phone.value) ? "" : phase3.demo.errors.phone) : "Enter your phone number."],
      [consent, $("[data-demo-consent-error]"), consent.checked ? "" : "Consent is required before we can follow up."]
    ];
    const invalid = fields.filter(([, , message]) => message);
    fields.forEach(([field, error, message]) => markField(field, error, message));
    if (invalid.length) {
      const [field] = invalid[0];
      emit("validation_failure", { journey: "demo", placement: "demo-modal", field: field?.dataset ? Object.keys(field.dataset).find(key => key.startsWith("demo")) || "field" : "field" });
      setStatus("[data-demo-status]", invalid[0][2], false);
      field?.focus();
      return false;
    }
    return true;
  }
  function validateAudit() {
    const fields = [
      [$("[data-audit-name]"), $("[data-audit-name-error]"), $("[data-audit-name]").value.trim() ? "" : "Enter your name."],
      [$("[data-audit-company]"), $("[data-audit-company-error]"), $("[data-audit-company]").value.trim() ? "" : "Enter your company name."],
      [$("[data-audit-phone]"), $("[data-audit-phone-error]"), $("[data-audit-phone]").value.trim() ? (validPhone($("[data-audit-phone]").value) ? "" : phase3.audit.errors.phone) : "Enter your WhatsApp number."],
      [$("[data-audit-bottleneck]"), $("[data-audit-bottleneck-error]"), $("[data-audit-bottleneck]").value.trim() ? "" : "Describe the primary bottleneck."],
      [$("[data-audit-consent]"), $("[data-audit-consent-error]"), $("[data-audit-consent]").checked ? "" : "Consent is required before we can follow up."]
    ];
    const invalid = fields.filter(([, , message]) => message);
    fields.forEach(([field, error, message]) => markField(field, error, message));
    if (invalid.length) {
      const [field] = invalid[0];
      emit("validation_failure", { journey: "audit", placement: "audit-form", field: field?.dataset ? Object.keys(field.dataset).find(key => key.startsWith("audit")) || "field" : "field" });
      setStatus("[data-audit-status]", invalid[0][2], false);
      field?.focus();
      return false;
    }
    return true;
  }
  const demoDialog = $("[data-demo-dialog]");
  let lastDemoTrigger = null;
  function openDemo(event) {
    lastDemoTrigger = event?.currentTarget || document.activeElement;
    emit("cta_click", { journey: "demo", placement: lastDemoTrigger?.dataset?.persistentDemo !== undefined ? "persistent" : "hero" });
    setStatus("[data-demo-status]", "", true);
    if (typeof demoDialog.showModal === "function") demoDialog.showModal();
    else demoDialog.setAttribute("open", "");
    $("[data-demo-name]")?.focus();
  }
  function closeDemo() {
    if (typeof demoDialog.close === "function") demoDialog.close();
    else demoDialog.removeAttribute("open");
    lastDemoTrigger?.focus?.();
  }
  $$("[data-open-demo]").forEach(button => button.addEventListener("click", openDemo));
  $$("[data-secondary-action], [data-persistent-audit]").forEach(link => link.addEventListener("click", () => emit("cta_click", { journey: "audit", placement: link.hasAttribute("data-persistent-audit") ? "persistent" : "hero" })));
  $$("[data-demo-form] input, [data-demo-form] select").forEach(field => field.addEventListener("focus", () => beginForm("demo", "demo-modal"), { once: true }));
  $$("[data-audit-form] input, [data-audit-form] textarea").forEach(field => field.addEventListener("focus", () => beginForm("audit", "audit-form"), { once: true }));
  $("[data-close-demo]")?.addEventListener("click", closeDemo);
  demoDialog?.addEventListener("click", event => { if (event.target === demoDialog) closeDemo(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && demoDialog?.open) closeDemo(); });
  $("[data-demo-form]")?.addEventListener("submit", event => {
    event.preventDefault();
    beginForm("demo", "demo-modal");
    clearFields("demo");
    if (!validateDemo()) return;
    const name = $("[data-demo-name]"), industry = $("[data-demo-industry]"), phone = $("[data-demo-phone]"), consent = $("[data-demo-consent]");
    const submitButton = $("[data-demo-submit]");
    const stateKey = JSON.stringify([name.value.trim(), industry.value, phone.value.trim(), consent.checked]);
    if (formState.demo.submitting || formState.demo.lastKey === stateKey) return;
    formState.demo.submitting = true; formState.demo.lastKey = stateKey; submitButton.disabled = true;
    emit("form_submit_attempt", { journey: "demo", placement: "demo-modal" });
    submitLead({ enquiryType: "live-demo", name: name.value, industry: industry.value, phone: phone.value, consent: consent.checked, variant: variantContext.variant })
      .then(sent => { const outcome = sent ? "captured" : "simulated"; emit("form_outcome", { journey: "demo", placement: "demo-modal", outcome }); setStatus("[data-demo-status]", sent ? phase3.demo.captured : phase3.demo.success, true); })
      .catch(() => { emit("form_outcome", { journey: "demo", placement: "demo-modal", outcome: "retry" }); formState.demo.lastKey = ""; setStatus("[data-demo-status]", phase3.demo.failure, false); })
      .finally(() => { formState.demo.submitting = false; submitButton.disabled = false; });
  });
  $("[data-audit-form]")?.addEventListener("submit", event => {
    event.preventDefault();
    beginForm("audit", "audit-form");
    clearFields("audit");
    if (!validateAudit()) return;
    const name = $("[data-audit-name]"), company = $("[data-audit-company]"), phone = $("[data-audit-phone]"), bottleneck = $("[data-audit-bottleneck]"), consent = $("[data-audit-consent]");
    const submitButton = $("[data-audit-submit]");
    const stateKey = JSON.stringify([name.value.trim(), company.value.trim(), phone.value.trim(), bottleneck.value.trim(), consent.checked, state.currency, state.industry]);
    if (formState.audit.submitting || formState.audit.lastKey === stateKey) return;
    formState.audit.submitting = true; formState.audit.lastKey = stateKey; submitButton.disabled = true;
    emit("form_submit_attempt", { journey: "audit", placement: "audit-form" });
    submitLead({ enquiryType: "revenue-audit", name: name.value, company: company.value, whatsapp: phone.value, bottleneck: bottleneck.value, currency: state.currency, selectedIndustry: state.industry, consent: consent.checked, variant: variantContext.variant })
      .then(sent => { const outcome = sent ? "captured" : "simulated"; emit("form_outcome", { journey: "audit", placement: "audit-form", outcome }); setStatus("[data-audit-status]", sent ? phase3.audit.captured : phase3.audit.success, true); event.currentTarget.reset(); })
      .catch(() => { emit("form_outcome", { journey: "audit", placement: "audit-form", outcome: "retry" }); formState.audit.lastKey = ""; setStatus("[data-audit-status]", phase3.audit.failure, false); })
      .finally(() => { formState.audit.submitting = false; submitButton.disabled = false; });
  });
  $$("[data-faq-trigger]").forEach(button => button.addEventListener("click", () => {
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;
    button.parentElement?.parentElement?.classList.toggle("is-open", !expanded);
  }));

  $$("[data-currency]").forEach(button => button.addEventListener("click", () => { state.currency = button.dataset.currency; renderAll(); }));
  const roiInputSelectors = { volume: "[data-roi-volume]", currentInput: "[data-roi-input]", recoverableShare: "[data-roi-share]", manualHours: "[data-roi-hours]" };
  Object.entries(roiInputSelectors).forEach(([key, selector]) => $(selector)?.addEventListener("input", event => { state[key] = event.target.value; renderRoi(); }));
  $("[data-plan-select]").innerHTML = content.plans.map(plan => `<option value="${plan.id}">${plan.name}</option>`).join("");
  $("[data-plan-select]").addEventListener("change", event => { state.planId = event.target.value; renderRoi(); });

  const header = $("[data-header]"), navToggle = $(".nav-toggle");
  navToggle?.addEventListener("click", () => { const open = navToggle.getAttribute("aria-expanded") === "true"; navToggle.setAttribute("aria-expanded", String(!open)); header.classList.toggle("nav-open", !open); });
  $$("a[href^='#']").forEach(link => link.addEventListener("click", event => { const target = $(link.getAttribute("href")); if (!target) return; event.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); navToggle?.setAttribute("aria-expanded", "false"); header?.classList.remove("nav-open"); target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }));
  const sectionLinks = $$("nav a[href^='#']");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; sectionLinks.forEach(link => { const active = link.getAttribute("href") === `#${entry.target.id}`; link.classList.toggle("is-active", active); if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); }); }), { rootMargin: "-25% 0px -65% 0px" });
    $$("[data-section], #top").forEach(section => observer.observe(section));
  }
  window.runPhase1ClaimAudit = function () { const required = ["#industry-results", "#operating-model", "#roi-calculator", "#pricing", "#faqs", "#trust"]; const text = document.body.textContent.toLowerCase(); return { sections: required.every(id => $(id)), qualifiers: ["90/10", "20 sec", "illustrative", "estimate"].every(marker => text.includes(marker.toLowerCase())) }; };
})();
