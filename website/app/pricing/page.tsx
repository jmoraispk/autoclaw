"use client";

import React, { useMemo, useState, useEffect, useId } from "react";

// --- Small UI primitives ---

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function InfoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ArrowIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "red" | "teal";
}) {
  const styles =
    tone === "red"
      ? "bg-red-500/10 text-red-300 border-red-500/20"
      : tone === "teal"
        ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
        : "bg-slate-500/10 text-slate-300 border-slate-500/20";

  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border", styles)}>
      {children}
    </span>
  );
}

// --- Modal with focus/ESC/outside close ---

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    // Basic focus placement
    const t = window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>("[data-modal-close]");
      el?.focus?.();
    }, 0);
    return () => {
      window.clearTimeout(t);
      prev?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-800">
            <div>
              <h3 id={titleId} className="text-lg font-semibold text-white">
                {title}
              </h3>
              <p className="text-sm text-slate-400 mt-1">Preview</p>
            </div>
            <button
              data-modal-close
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/40"
            >
              Close
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

// --- FAQ Accordion ---

function FAQItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30">
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <span className={cn("text-slate-400 transition-transform", open && "rotate-45")}>+</span>
      </button>
      {open && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-5 text-sm text-slate-400">
          {a}
        </div>
      )}
    </div>
  );
}

// --- Comparison Table ---

function ComparisonTable({
  rows,
  cols,
}: {
  cols: string[];
  rows: Array<{ label: string; values: string[] }>;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/20">
      <div className="grid grid-cols-4 gap-px bg-slate-800">
        <div className="bg-slate-950/60 p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Compare</div>
        {cols.map((c) => (
          <div key={c} className="bg-slate-950/60 p-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            {c}
          </div>
        ))}
      </div>

      <div className="divide-y divide-slate-800">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-4">
            <div className="p-4 text-sm text-slate-300 bg-slate-950/20">{r.label}</div>
            {r.values.map((v, i) => (
              <div key={i} className="p-4 text-sm text-slate-200 bg-slate-950/10">
                {v}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Page ---

export default function PricingPage() {
  const [preview, setPreview] = useState<null | "dashboard" | "memory">(null);

  const plans = useMemo(
    () => [
      {
        key: "diy",
        badge: { text: "Best for hackers", tone: "slate" as const },
        title: "DIY (Open Source)",
        tagline: "Run it yourself.",
        price: "$0",
        priceNote: "/ forever",
        description:
          "Use our scripts and docs to deploy OpenClaw yourself. Full control, but you own the setup tax.",
        features: [
          "No account required",
          "Scripts + battle-tested instructions",
          "Bring your own API keys",
          "Run locally or on your infra",
          "Community support",
          "No hosted dashboard",
        ],
        ctaPrimary: { label: "View Repos", href: "https://github.com/openclaw/openclaw" },
        ctaSecondary: { label: "Read install guide", href: "#" },
        highlight: false,
        accent: "slate" as const,
      },
      {
        key: "selfhost",
        badge: { text: "Max privacy", tone: "teal" as const },
        title: "Self-host (Assisted)",
        tagline: "You host it; we deploy + keep it running.",
        price: "$X",
        priceNote: "/ mo",
        description:
          "Fast deploy to your server via SSH. You bring keys. You get the hosted & maintained dashboard and automatic updates.",
        features: [
          "Account required",
          "Guided deploy via SSH to your server",
          "Battle-tested configs + secure defaults",
          "Hosted & maintained web dashboard (paid differentiator)",
          "Automatic updates + security patches",
          "Curated safe skill updates (skills are an attack surface)",
          "Email support + guided fixes",
          "BYOK (you manage provider keys)",
        ],
        ctaPrimary: { label: "Start self-host", href: "/signup" },
        ctaSecondary: { label: "See what we deploy", href: "#" },
        highlight: false,
        accent: "teal" as const,
      },
      {
        key: "managed",
        badge: { text: "Most popular", tone: "red" as const },
        title: "Managed (We host)",
        tagline: "Fastest path to “it works” — no server, no keys setup.",
        price: "$X",
        priceNote: "/ mo",
        description:
          "We host and operate everything end-to-end. Keys included by default. Transparent usage billed at cost.",
        features: [
          "Account required",
          "We host agent + dashboard + ops",
          "Keys included (fastest setup)",
          "Usage billed transparently (at cost)",
          "Hosted dashboard + updates + monitoring",
          "Priority support",
          "Memory Graph (coming soon)",
          "Prefer BYOK? Optional in onboarding",
        ],
        ctaPrimary: { label: "Start managed", href: "/signup" },
        ctaSecondary: { label: "Learn about keys", href: "#faq-keys" },
        highlight: true,
        accent: "red" as const,
      },
    ],
    []
  );

  const compareCols = ["DIY", "Self-host", "Managed"];
  const compareRows = useMemo(
    () => [
      { label: "Hosting location", values: ["Yours", "Yours", "Ours"] },
      { label: "Setup time", values: ["Longest", "Minutes", "Fastest"] },
      { label: "Hosted web dashboard", values: ["—", "✓", "✓"] },
      { label: "Updates & maintenance", values: ["Manual", "Automatic", "Fully handled"] },
      { label: "Keys & billing", values: ["BYOK", "BYOK", "Keys included + at-cost usage (BYOK optional)"] },
      { label: "Privacy & control", values: ["You control everything", "Runs on your server", "Hosted container (isolated tenancy)"] },
      { label: "Support", values: ["Community", "Email support", "Priority support"] },
    ],
    []
  );

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl">
        {/* Faint section background */}
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-[420px] rounded-[48px] bg-gradient-to-b from-red-500/10 via-slate-900/10 to-transparent blur-2xl" />

        {/* Header */}
        <div className="relative text-center mb-14 space-y-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight">
            Pricing that removes the <span className="text-red-500">setup tax</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto">
            Get an OpenClaw agent running in minutes — hosted & maintained dashboard, secure defaults, and curated updates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Badge tone="slate">hosted &amp; maintained</Badge>
            <Badge tone="slate">battle-tested configs</Badge>
            <Badge tone="slate">secure defaults</Badge>
          </div>
        </div>

        {/* Plans */}
        <section className="relative">
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((p) => (
              <div
                key={p.key}
                className={cn(
                  "relative rounded-3xl border bg-slate-950/35 backdrop-blur-xl p-8 flex flex-col overflow-hidden",
                  p.highlight ? "border-red-500/30 shadow-2xl shadow-red-500/10" : "border-slate-800",
                  p.highlight ? "lg:-mt-2 lg:mb-2" : ""
                )}
              >
                {/* subtle overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-800/10 to-transparent" />
                {/* top accent */}
                {p.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-600" />
                )}

                <div className="relative mb-6">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone={p.badge.tone}>{p.badge.text}</Badge>

                    {/* Inline preview affordances: show only where relevant */}
                    <div className="flex items-center gap-2">
                      {(p.key === "selfhost" || p.key === "managed") && (
                        <button
                          onClick={() => setPreview("dashboard")}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
                        >
                          <InfoIcon />
                          Dashboard preview
                        </button>
                      )}
                      {p.key === "managed" && (
                        <button
                          onClick={() => setPreview("memory")}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
                        >
                          <InfoIcon />
                          Memory Graph
                        </button>
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mt-4">{p.title}</h2>
                  <p className="text-slate-400 mt-2 text-sm">{p.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span className={cn("text-4xl font-bold", p.highlight ? "text-red-300" : "text-white")}>
                      {p.price}
                    </span>
                    <span className="text-slate-500 font-medium">{p.priceNote}</span>
                  </div>

                  <p className="text-slate-400 text-sm mt-4 leading-relaxed">{p.description}</p>
                </div>

                <div className="relative space-y-3 mb-8 flex-1">
                  {p.features.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-slate-300">
                      <CheckIcon className={cn("w-5 h-5 mt-0.5 shrink-0", p.highlight ? "text-red-400/70" : "text-slate-500")} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-auto space-y-3">
                  <a
                    href={p.ctaPrimary.href}
                    className={cn(
                      "w-full inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold transition-all",
                      p.highlight
                        ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    )}
                  >
                    {p.ctaPrimary.label}
                    <ArrowIcon className="ml-2" />
                  </a>
                  <a
                    href={p.ctaSecondary.href}
                    className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-slate-300 hover:text-white border border-slate-800 bg-slate-950/20 hover:bg-slate-900/40 transition-colors"
                  >
                    {p.ctaSecondary.label}
                  </a>

                  {p.key === "managed" && (
                    <p className="text-xs text-slate-500 text-center pt-1">
                      Default: <span className="text-slate-300 font-semibold">keys included (fastest setup)</span>.{" "}
                      <span className="text-slate-400">Prefer BYOK?</span> available in onboarding.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-6 mb-5">
            <div>
              <h3 className="text-xl font-bold text-white">Compare plans</h3>
              <p className="text-sm text-slate-400 mt-1">Keep it simple: hosting, speed, dashboard, updates, keys, privacy, support.</p>
            </div>
          </div>
          <ComparisonTable cols={compareCols} rows={compareRows} />
        </section>

        {/* What you get */}
        <section className="mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/25 p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Hosted Dashboard</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Access anywhere, no terminal, always current. We host and maintain it so you don’t have to.
                  </p>
                </div>
                <button
                  onClick={() => setPreview("dashboard")}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
                >
                  <InfoIcon />
                  Preview
                </button>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <span>Agent health, logs, skills, and configuration in one place</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <span>Battle-tested defaults + automatic updates</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <span>Optional cost visibility and usage breakdowns</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/25 p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Memory Graph</h3>
                    <Badge tone="slate">Coming soon</Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    See and control what your agent remembers — transparency and autonomy over long-term context.
                  </p>
                </div>
                <button
                  onClick={() => setPreview("memory")}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
                >
                  <InfoIcon />
                  Preview
                </button>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <span>Inspect clusters/topics and where they came from</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <span>Delete / export / pin memories (user-controlled)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <span>Designed for Managed; optional later for Self-host</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-6 mb-5">
            <div>
              <h3 className="text-xl font-bold text-white">FAQ</h3>
              <p className="text-sm text-slate-400 mt-1">Short answers. No surprises.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FAQItem
              q="Isn’t this open source?"
              a={
                <span>
                  Yes. The code is open. The paid plans include the <span className="text-slate-200 font-semibold">hosted &amp; maintained</span>{" "}
                  experience: uptime, updates, secure defaults, and support.
                </span>
              }
              defaultOpen
            />
            <FAQItem
              q="Why is the dashboard paid if it’s open source?"
              a={
                <span>
                  You’re paying for hosting and maintenance: an always-on dashboard, upgrades, monitoring, and curated updates without you running infra.
                </span>
              }
            />
            <FAQItem
              q="Do I have to use your keys?"
              a={
                <span id="faq-keys">
                  Managed defaults to <span className="text-slate-200 font-semibold">keys included (fastest setup)</span>. If you prefer, you can bring your own
                  keys (BYOK) so billing stays with you.
                </span>
              }
            />
            <FAQItem
              q="How does usage billing work?"
              a={<span>Usage is billed transparently (at cost). We show a clear breakdown by provider and what it cost us.</span>}
            />
            <FAQItem
              q="What data do you store?"
              a={
                <span>
                  Only what’s needed to provide the service and dashboard. We don’t sell data. Self-host runs on your server; Managed runs in a hosted container
                  (isolated tenancy).
                </span>
              }
            />
            <FAQItem
              q="What if something breaks?"
              a={
                <span>
                  Self-host: email support + guided fixes (we may need SSH again if you revoked it). Managed: we fix it as part of ops.
                </span>
              }
            />
          </div>
        </section>

        {/* Billing Principles (kept, tightened wording) */}
        <section className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              How we <span className="text-teal-400">bill</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Transparent, fair, and designed to keep you in control.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Usage at cost",
                description: "Usage is billed transparently (at cost). Clear breakdowns by provider. No surprises.",
              },
              {
                title: "Itemized receipts",
                description: "Monthly receipts show what you used and what it cost — plus the subscription line item.",
              },
              {
                title: "Subscription covers ops",
                description: "Hosted dashboard, monitoring, updates, and support. (Self-host includes deploy + updates + dashboard.)",
              },
              {
                title: "Keys control",
                description: "Managed defaults to keys included. Prefer BYOK? Use your own keys and keep billing with you.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy Section (rewrite to avoid over-claims) */}
        <section className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Privacy, <span className="text-red-500">by design</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Different deployment options, same privacy posture: we don’t sell data.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Self-host / DIY */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">DIY / Self-host</h3>
                  <p className="text-sm text-slate-500">Runs on your machine or your server</p>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <p className="text-slate-300 leading-relaxed">
                  Your runtime stays in your environment. If you use Self-host (Assisted), you can revoke SSH access at any time.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-teal-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Max privacy &amp; control</span>
              </div>
            </div>

            {/* Managed */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-red-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Managed</h3>
                  <p className="text-sm text-slate-500">Hosted container (isolated tenancy)</p>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <p className="text-slate-300 leading-relaxed">
                  We operate the infrastructure. We don’t sell data. Access is limited to what’s required to run and support the service.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>Operational controls + auditability (as implemented)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust line */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">Powered by OpenClaw · Open source code · Hosted &amp; maintained experience</p>
        </div>
      </div>

      {/* Previews */}
      <Modal
        open={preview === "dashboard"}
        onClose={() => setPreview(null)}
        title="Hosted Dashboard"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
            <div className="aspect-[16/10] rounded-xl bg-gradient-to-b from-slate-800/40 to-slate-900/20 border border-slate-700/50 flex items-center justify-center">
              <span className="text-xs text-slate-500">Screenshot placeholder: Overview</span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-4">Overview</h4>
            <p className="text-sm text-slate-400 mt-1">One place to see agent health, uptime, skills, and recent activity.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
            <div className="aspect-[16/10] rounded-xl bg-gradient-to-b from-slate-800/40 to-slate-900/20 border border-slate-700/50 flex items-center justify-center">
              <span className="text-xs text-slate-500">Screenshot placeholder: Agent detail</span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-4">Agent detail</h4>
            <p className="text-sm text-slate-400 mt-1">Logs, configuration, skills, and safe update controls.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
          <h4 className="text-sm font-semibold text-white">What you can do</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
              <span>View health and status without running commands</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
              <span>Apply updates safely (security patches, curated skills)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
              <span>See usage and cost visibility (where enabled)</span>
            </li>
          </ul>
        </div>
      </Modal>

      <Modal
        open={preview === "memory"}
        onClose={() => setPreview(null)}
        title="Memory Graph (Coming soon)"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 md:col-span-2">
            <div className="aspect-[21/9] rounded-xl bg-gradient-to-b from-slate-800/40 to-slate-900/20 border border-slate-700/50 flex items-center justify-center">
              <span className="text-xs text-slate-500">Screenshot placeholder: Memory graph view</span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-4">Inspect + control</h4>
            <p className="text-sm text-slate-400 mt-1">
              A visual map of what the agent remembers. Designed to make memory transparent and user-controlled.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
          <h4 className="text-sm font-semibold text-white">Planned capabilities</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
              <span>View clusters/topics and their sources</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
              <span>Delete/export/pin memories for full autonomy</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-slate-500 mt-0.5" />
              <span>Clear controls around what’s stored and why</span>
            </li>
          </ul>
        </div>
      </Modal>
    </main>
  );
}
