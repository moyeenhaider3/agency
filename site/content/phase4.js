(function () {
  "use strict";

  const control = {
    eyebrow: "For traditional-business owners and founders",
    title: "Recover revenue and staff time from the work that keeps repeating.",
    intro: "AgenticeEra Solution installs custom AI departments for traditional businesses so leads, follow-ups, and routine operations move 24/7 while you keep the final say on important decisions.",
    promise: "90% of routine work handled automatically. 10% of high-stakes control stays with you.",
    primaryAction: "See the 20-second operating demo",
    secondaryAction: "Start a 15-minute revenue audit",
    proof: [
      { value: "20 sec", label: "response example", qualifier: "Illustrative proof point", source: "Phase 1 supplied content" },
      { value: "90 / 10", label: "control model", qualifier: "Routine work / final say", source: "Service promise" },
      { value: "14–19 days", label: "payback examples", qualifier: "Illustrative estimates", source: "Phase 1 supplied content" }
    ]
  };

  const alternative = {
    ...control,
    title: "Turn trapped revenue and wasted hours into an always-on operating advantage.",
    intro: "Built for owners and founders in traditional businesses: a custom AI department handles repeatable work around the clock, while people stay in charge of the decisions that matter.",
    primaryAction: "Watch the 20-second demo",
    proof: control.proof
  };

  const PHASE4_CONTENT = {
    version: "2026-11-hero-01",
    experiment: {
      key: "hero-message-2026-11",
      enabled: true,
      alternativeShare: 10,
      controlId: "control",
      variants: { control, alternative: { ...alternative, id: "outcome-owner" } }
    },
    control,
    alternative: { ...alternative, id: "outcome-owner" },
    resolveVariant(config = PHASE4_CONTENT.experiment, seed = "") {
      const experiment = config && typeof config === "object" ? config : {};
      const variants = experiment.variants && typeof experiment.variants === "object" ? experiment.variants : {};
      const controlId = typeof experiment.controlId === "string" ? experiment.controlId : "control";
      if (!experiment.enabled || !variants[controlId]) return { id: "control-no-test", content: variants[controlId] || control, enabled: false };
      const share = Number(experiment.alternativeShare);
      if (!Number.isInteger(share) || share < 0 || share > 100) return { id: "control-no-test", content: variants[controlId], enabled: false };
      const alternativeId = Object.keys(variants).find(id => id !== controlId && variants[id]);
      if (!alternativeId || !seed) return { id: controlId, content: variants[controlId], enabled: Boolean(experiment.enabled) };
      let hash = 0;
      for (const char of `${experiment.key || ""}:${seed}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
      return hash % 100 < share
        ? { id: alternativeId, content: variants[alternativeId], enabled: true }
        : { id: controlId, content: variants[controlId], enabled: true };
    }
  };

  window.PHASE4_CONTENT = PHASE4_CONTENT;
})();
