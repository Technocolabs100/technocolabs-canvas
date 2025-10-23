import React from "react";

export function PageShell(props: {
  title: string; subtitle: string; icon: string;
  ctaLabel: string; ctaHref: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <header className="border-b border-slate-200 bg-gradient-to-b from-sky-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50">
              <img src={props.icon} alt="" className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">{props.title}</h1>
              <p className="mt-1 text-slate-600">{props.subtitle}</p>
              <a
                href={props.ctaHref}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
              >
                {props.ctaLabel}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-12">{props.children}</main>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white/60 p-5 shadow-sm">{children}</div>
    </section>
  );
}

export function BulletGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2">
          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-500" />
          <span className="text-slate-700">{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
          {t}
        </span>
      ))}
    </div>
  );
}

export function Pricing({ tiers }: {
  tiers: { name: string; price: string; blurb: string; features: string[]; highlight?: boolean }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tiers.map((t) => (
        <div key={t.name} className={`rounded-2xl border p-5 shadow-sm ${t.highlight ? "border-sky-300 ring-1 ring-sky-200/60 bg-sky-50/30" : "border-slate-200 bg-white"}`}>
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold text-slate-900">{t.name}</h3>
            <div className="text-lg font-semibold text-slate-900">{t.price}</div>
          </div>
          <p className="mt-1 text-sm text-slate-600">{t.blurb}</p>
          <ul className="mt-3 space-y-2">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Steps({ steps }: { steps: [string, string][] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-5">
      {steps.map(([t, d]) => (
        <li key={t} className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <div className="font-semibold text-slate-900">{t}</div>
          <div className="mt-1 text-slate-600">{d}</div>
        </li>
      ))}
    </ol>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12.5px] leading-relaxed text-slate-800">
      {code}
    </pre>
  );
}

export function FAQ({ items }: { items: [string, string][] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {items.map(([q, a]) => (
        <details key={q} className="group p-4 open:bg-sky-50/40">
          <summary className="cursor-pointer list-none font-medium text-slate-900">
            {q}
          </summary>
          <p className="mt-2 text-slate-700">{a}</p>
        </details>
      ))}
    </div>
  );
}

export function StickyCTA({ href }: { href: string }) {
  return (
    <div className="sticky bottom-4 z-10 mx-auto max-w-6xl px-4">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-700">
            Ready to turn AI ideas into shipped outcomes?
          </div>
          <a href={href} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">
            Talk to an expert
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
