(function () {
  "use strict";

  const plans = [
    { id: "starter", name: "Starter Growth System", india: { setup: 45000, monthly: 22000, value: 85000 }, global: { setup: 1800, monthly: 750, value: 1000 }, payback: "19-day payback", deliverable: "Routine follow-through with the 90/10 control model." },
    { id: "fleet", name: "Growth Department Fleet", popular: true, india: { setup: 95000, monthly: 55000, value: 240000 }, global: { setup: 4500, monthly: 2000, value: 2825 }, payback: "17-day payback", deliverable: "Multiple operating departments with visible handoffs and control." },
    { id: "suite", name: "Complete Digital Operations Suite", india: { setup: 275000, monthly: 185000, value: 780000 }, global: { setup: 9500, monthly: 4500, value: 9175 }, payback: "14-day payback", deliverable: "A broader always-on operating partner for the agreed routine work." }
  ];

  const industries = [
    {
      id: "real-estate", name: "Real estate", shortName: "Real estate", audience: "NCR & Dubai",
      problem: "Paid enquiries arrive, but weekend demand waits for the next available person.",
      change: "Respond to and organise incoming interest while the team is away, so high-intent visits do not disappear.",
      inputs: { volumeLabel: "Monthly ad spend (₹)", min: 0, max: 10000000 }, defaultVolume: 480000, defaultInput: 480000,
      proof: [
        { value: "₹4.8L/month", label: "Gurugram brokerage ad spend", source: "Supplied case example" },
        { value: "36 → 78", label: "weekend site visits (+116%)", source: "Supplied case example" },
        { value: "₹6L–₹12L/month", label: "additional brokerage commission", source: "Supplied outcome; not independently verified" },
        { value: "15x–30x", label: "stated return", source: "Supplied case example" }
      ],
      assumption: "Use your monthly ad spend as the current input and choose the share you believe can be recovered after validation."
    },
    {
      id: "healthcare", name: "Healthcare", shortName: "Healthcare clinics / IVF / dental / aesthetic", audience: "Clinics, IVF, dental & aesthetic chains",
      problem: "No-shows and unanswered enquiries leave valuable evening capacity unused.",
      change: "Keep appointment follow-through moving and surface exceptions for the front desk to handle.",
      inputs: { volumeLabel: "Monthly appointments / enquiries", min: 0, max: 100000 },
      proof: [
        { value: "28% → 9%", label: "no-shows", source: "Supplied case example" },
        { value: "25", label: "extra evening bookings", source: "Supplied case example" },
        { value: "₹3.2L+ monthly", label: "South Delhi clinic revenue recovered", source: "Supplied outcome; not independently verified" },
        { value: "14x", label: "stated return", source: "Supplied case example" }
      ],
      assumption: "Use your monthly appointment or enquiry volume and your own current revenue input; the supplied outcome remains a separate reference."
    },
    {
      id: "d2c", name: "D2C / e-commerce", shortName: "D2C / e-commerce", audience: "Online stores",
      problem: "Cash-on-delivery friction, returns, and abandoned carts quietly erode order economics.",
      change: "Keep customer follow-through consistent across the order journey without adding another shift.",
      inputs: { volumeLabel: "Monthly orders", min: 0, max: 1000000 },
      proof: [
        { value: "6,000/month", label: "orders processed", source: "Supplied case example" },
        { value: "22%", label: "COD → prepaid shift", source: "Supplied case example" },
        { value: "30% → 18%", label: "RTO rate", source: "Supplied case example" },
        { value: "90", label: "abandoned carts recovered", source: "Supplied case example" },
        { value: "₹2.55L/month", label: "net profit", source: "Supplied outcome; not independently verified" },
        { value: "7.4x", label: "stated return", source: "Supplied case example" }
      ],
      assumption: "Use orders as volume and enter the current monthly cost or revenue base you want to test."
    },
    {
      id: "sme", name: "SMEs", shortName: "CA / manufacturing / wholesale SMEs", audience: "CA firms, manufacturers & wholesalers",
      problem: "Bills, quotes, follow-ups, and collections compete with the work that actually moves the business forward.",
      change: "Make routine records and next steps visible so fewer clerk hours disappear into chasing and checking.",
      inputs: { volumeLabel: "Monthly bills / transactions", min: 0, max: 1000000 },
      proof: [
        { value: "1,800/month", label: "Okhla manufacturer bills processed", source: "Supplied case example" },
        { value: "160 hours", label: "clerk time saved", source: "Supplied outcome; not independently verified" },
        { value: "₹1.25L+/month", label: "GST credit recovered", source: "Supplied outcome; not independently verified" },
        { value: "4.3x", label: "stated return", source: "Supplied case example" }
      ],
      assumption: "Use monthly bills or transactions as volume and enter the current monthly input you want to assess."
    },
    {
      id: "b2b", name: "B2B teams", shortName: "Global B2B SaaS / staffing / consulting agencies", audience: "SaaS, staffing & consulting agencies",
      problem: "Manual prospecting consumes expensive team time before a qualified conversation is even booked.",
      change: "Research and organise the next accounts consistently, leaving people to handle judgement and live conversations.",
      inputs: { volumeLabel: "Monthly accounts researched", min: 0, max: 1000000 },
      proof: [
        { value: "$14,000/month", label: "manual prospecting overhead", source: "Supplied case example" },
        { value: "$2,450/month", label: "automated growth engine", source: "Supplied case example" },
        { value: "3,500/month", label: "accounts researched", source: "Supplied case example" },
        { value: "$11,550/month (~₹9.8L)", label: "monthly saving", source: "Supplied outcome; source currencies shown" },
        { value: "2×", label: "booked calls", source: "Supplied case example" }
      ],
      assumption: "Use accounts researched as volume and enter the current monthly prospecting input in the selected currency."
    }
  ];

  const currencies = {
    INR: { locale: "en-IN", code: "INR", symbol: "₹" },
    USD: { locale: "en-US", code: "USD", symbol: "$" }
  };

  function formatMoney(value, currency) {
    return new Intl.NumberFormat(currencies[currency].locale, { style: "currency", currency: currencies[currency].code, maximumFractionDigits: 0 }).format(value);
  }

  function calculateRoi(playbook, inputs, currency) {
    // The positional form keeps the content smoke check backwards-compatible; the UI uses the explicit contract below.
    if (typeof inputs === "number") {
      inputs = { volume: inputs, currentInput: Number.isFinite(arguments[2]) ? arguments[2] : playbook.defaultInput, recoverableShare: 100, manualHours: 1, planId: "starter" };
      currency = arguments[3] || currency;
    }
    const data = inputs || {};
    const currentInput = Number(data.currentInput);
    const recoverableShare = Number(data.recoverableShare);
    const manualHours = Number(data.manualHours);
    const plan = plans.find(item => item.id === data.planId) || plans[0];
    const setup = plan[currency === "USD" ? "global" : "india"].setup;
    if (![currentInput, recoverableShare, manualHours, setup].every(Number.isFinite) || currentInput <= 0 || recoverableShare <= 0 || manualHours <= 0 || recoverableShare > 100) return null;
    const value = currentInput * recoverableShare / 100;
    return { monthlyValue: value, eliminatedHours: manualHours * recoverableShare / 100, paybackDays: setup / value * 30, setupFee: setup, currency };
  }

  window.PHASE2_CONTENT = {
    industries, plans, currencies, formatMoney, calculateRoi,
    usage: { india: "₹3,000–₹14,000/month", global: "$35–$165/month" },
    pilot: { india: "₹25,000", global: "$1,250", guarantee: "14-day guarantee to call 100% of test leads under 30 seconds or accurately read 98% of sample invoices, otherwise refund setup fee." }
  };
})();
