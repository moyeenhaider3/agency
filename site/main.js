(function () {
  "use strict";
  const phase1 = window.PHASE1_CONTENT;
  const content = window.PHASE2_CONTENT;
  if (!phase1 || !content) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
  const list = (selector, items, render) => { const node = $(selector); if (node) node.innerHTML = items.map(render).join(""); };
  const state = { industry: content.industries[0].id, currency: "INR", volume: "", currentInput: "", recoverableShare: "", manualHours: "", planId: "starter" };
  const getIndustry = () => content.industries.find(item => item.id === state.industry) || content.industries[0];

  list("[data-nav-links]", phase1.nav, item => `<a href="${item.href}">${item.label}</a>`);
  setText("[data-hero-eyebrow]", phase1.eyebrow); setText("[data-hero-title]", phase1.hero.title); setText("[data-hero-intro]", phase1.hero.intro);
  setText("[data-hero-promise]", phase1.hero.promise); setText("[data-primary-action]", phase1.hero.primaryAction); setText("[data-secondary-action]", phase1.hero.secondaryAction);
  list("[data-metrics]", phase1.metrics, item => `<div class="metric"><strong>${item.value}</strong><span>${item.label}</span><small>${item.note}</small></div>`);
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
    const proof = item.proof.map(entry => `<div class="proof-stat"><strong>${entry.value}</strong><span>${entry.label}</span><small>${entry.source}</small></div>`).join("");
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

  $$("[data-currency]").forEach(button => button.addEventListener("click", () => { state.currency = button.dataset.currency; renderAll(); }));
  ["volume", "currentInput", "recoverableShare", "manualHours"].forEach(key => $(`[data-roi-${key === "currentInput" ? "input" : key}]`).addEventListener("input", event => { state[key] = event.target.value; renderRoi(); }));
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
