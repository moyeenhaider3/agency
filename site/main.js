(function () {
  "use strict";
  const content = window.PHASE1_CONTENT;
  if (!content) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const setText = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
  const list = (selector, items, render) => { const node = $(selector); if (node) node.innerHTML = items.map(render).join(""); };

  list("[data-nav-links]", content.nav, item => `<a href="${item.href}">${item.label}</a>`);
  setText("[data-hero-eyebrow]", content.eyebrow);
  setText("[data-hero-title]", content.hero.title);
  setText("[data-hero-intro]", content.hero.intro);
  setText("[data-hero-promise]", content.hero.promise);
  setText("[data-primary-action]", content.hero.primaryAction);
  setText("[data-secondary-action]", content.hero.secondaryAction);
  list("[data-metrics]", content.metrics, item => `<div class="metric"><strong>${item.value}</strong><span>${item.label}</span><small>${item.note}</small></div>`);
  setText("[data-comparison-title]", content.comparison.title);
  setText("[data-comparison-intro]", content.comparison.intro);
  setText("[data-old-label]", content.comparison.old.label);
  setText("[data-new-label]", content.comparison.new.label);
  list("[data-old-points]", content.comparison.old.points, item => `<li>${item}</li>`);
  list("[data-new-points]", content.comparison.new.points, item => `<li>${item}</li>`);
  list("[data-metrics-secondary]", content.metrics, item => `<div><strong>${item.value}</strong><span>${item.label}</span></div>`);
  list("[data-workflow]", content.workflow, item => `<article class="workflow-step"><span class="step-number">${item.number}</span><h3>${item.title}</h3><p>${item.text}</p></article>`);
  list("[data-assurances]", content.assurances, item => `<article class="assurance"><span class="assurance-icon" aria-hidden="true">✓</span><div><h3>${item.title}</h3><p>${item.text}</p></div></article>`);
  setText("[data-evidence-title]", content.evidence.title);
  setText("[data-evidence-text]", content.evidence.text);
  const destinations = [["industry", "industry-results"], ["roi", "roi-calculator"], ["pricing", "pricing"], ["faqs", "faqs"]];
  destinations.forEach(([key]) => {
    const data = content.futureSections[key];
    setText(`[data-${key}-kicker]`, data.kicker);
    setText(`[data-${key}-title]`, data.title);
    setText(`[data-${key}-text]`, data.text);
  });

  const header = $("[data-header]");
  const navToggle = $(".nav-toggle");
  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    header.classList.toggle("nav-open", !open);
  });
  $$("a[href^='#']").forEach(link => link.addEventListener("click", event => {
    const target = $(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    navToggle?.setAttribute("aria-expanded", "false");
    header?.classList.remove("nav-open");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }));
  const sectionLinks = $$("nav a[href^='#']");
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
  }), { rootMargin: "-25% 0px -65% 0px" });
  $$("[data-section], #top").forEach(section => observer.observe(section));

  window.runPhase1ClaimAudit = function () {
    const required = ["#industry-results", "#operating-model", "#roi-calculator", "#pricing", "#faqs", "#trust"];
    const text = document.body.textContent.toLowerCase();
    return { sections: required.every(id => $(id)), qualifiers: ["90/10", "20 sec", "illustrative", "estimate"].every(marker => text.includes(marker.toLowerCase())) };
  };
})();
