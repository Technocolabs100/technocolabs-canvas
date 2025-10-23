import React, { useRef } from "react";
import { Link } from "react-router-dom";


type Service = { title: string; desc: string; iconSrc: string };

const CORE: Service[] = [
  { title: "AI Strategy Consulting", desc: "Roadmaps & capability audits.", iconSrc: "/icons/ai-strategy.svg" },
  { title: "Generative AI",          desc: "RAG, guardrails, fine-tuning.", iconSrc: "/icons/generative-ai.svg" },
  { title: "AI Chatbot Development", desc: "Support, lead-gen, assistants.", iconSrc: "/icons/chatbot.svg" },
];

const CAPABILITIES = [
  { title: "Machine Learning", iconSrc: "/icons/machine-learning.svg" },
  { title: "Data Science", iconSrc: "/icons/data-science.svg" },
  { title: "Data Engineering", iconSrc: "/icons/data-engineering.svg" },
  { title: "Business Intelligence", iconSrc: "/icons/business-intelligence.svg" },
  { title: "DevOps Services", iconSrc: "/icons/devops.svg" },
  { title: "AI Strategy", iconSrc: "/icons/ai-strategy.svg" },
  { title: "Generative AI", iconSrc: "/icons/generative-ai.svg" },
  { title: "Chatbots", iconSrc: "/icons/chatbot.svg" },
];

export default function AIServiceShowcase() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* soft background beams */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="tc-beam absolute left-1/2 top-1/3 h-80 w-[36rem] -translate-x-1/2 opacity-60" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
        {/* LEFT: headline + marquee */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/60 px-3 py-1 text-xs font-medium text-sky-700">
            Trusted AI partner • Ranked #1 in Indore
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Ship AI that users love — from idea to production.
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            We design, build, and scale AI experiences that deliver measurable business impact—
            not just demos. Strategy, data, and engineering under one roof.
          </p>

          {/* Marquee: capabilities */}
          <div className="mt-8 overflow-hidden">
  {/* optional: subtle fade at edges */}
  <div className="pointer-events-none absolute inset-x-0 h-10 -translate-y-1/2 bg-gradient-to-r from-white via-transparent to-white opacity-70"></div>

  <div className="tc-marquee-track flex w-[200%] gap-0">
    {/* duplicate once for seamless loop */}
    {[...Array(2)].map((_, pass) => (
      <div key={pass} className="flex w-max items-center">
        {CAPABILITIES.map((c, i) => (
          <Pill key={`${pass}-${i}-${c.title}`} title={c.title} iconSrc={c.iconSrc} />
        ))}
        {/* spacer at the end so the seam never touches */}
        <div className="shrink-0 w-8" />
      </div>
    ))}
  </div>
</div>


          {/* small reassurance line */}
          <div className="mt-4 text-sm text-slate-500">
            Used for product support, analytics, personalization, and automation.
          </div>
        </div>

        {/* RIGHT: diagonal stacked cards with parallax tilt */}
        <div className="relative">
          <StackCard index={0} accent="sky" service={CORE[0]} styleClass="rotate-[-3deg] -translate-y-1" />
          <StackCard index={1} accent="indigo" service={CORE[1]} styleClass="rotate-[3deg] -translate-y-8" />
          <StackCard index={2} accent="violet" service={CORE[2]} styleClass="rotate-[-1deg] -translate-y-16" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Small components ---------- */

function Pill({ title, iconSrc }: { title: string; iconSrc: string }) {
  return (
    <span className="shrink-0 mr-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700 shadow-sm backdrop-blur">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-sky-100 bg-sky-50">
        <img src={iconSrc} alt="" className="h-3.5 w-3.5" />
      </span>
      {title}
    </span>
  );
}

function StackCard({
  service,
  index,
  accent = "sky",
  styleClass = "",
}: {
  service: Service;
  index: number;
  accent?: "sky" | "indigo" | "violet";
  styleClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // simple parallax tilt on hover (no libs)
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 6; // tilt up/down
    const rotateY = (x / rect.width) * 6;   // tilt left/right
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg)`;
  };

  const ring =
    accent === "sky"
      ? "ring-sky-200/70"
      : accent === "indigo"
      ? "ring-indigo-200/70"
      : "ring-violet-200/70";

  const badgeBg =
    accent === "sky"
      ? "bg-sky-50 border-sky-100"
      : accent === "indigo"
      ? "bg-indigo-50 border-indigo-100"
      : "bg-violet-50 border-violet-100";

  return (
    <div className={`tc-float relative ${styleClass}`}>
      {/* glow plate behind each card */}
      <div aria-hidden className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl"
           style={{ background: "radial-gradient(120px 80px at 50% 40%, rgba(56,189,248,0.25), transparent 60%)" }} />
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={[
          "relative rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-xl backdrop-blur-md transition-transform",
          "ring-1", ring,
        ].join(" ")}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex items-start gap-4">
          <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${badgeBg}`}>
            <img src={service.iconSrc} alt="" className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{service.desc}</p>
          </div>
        </div>

        {/* tiny bottom CTA */}
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-700">
          <span>Explore service</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
