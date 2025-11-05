import React, { useMemo, useState, useContext, useEffect } from "react";
import AIServicePremiumGrid from "./AIServicePremiumGrid";
import TechCluster from "./TechCluster";
import ChatbotWidget from "./ChatbotWidget";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Info } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo"; // (not used here but fine if you keep it)
// If TS complains about missing types, add src/react-simple-maps.d.ts with `declare module "react-simple-maps";`


import {
  ArrowRight,
  Brain,
  BarChart3,
  GraduationCap,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Instagram,
  Github,
  Smartphone,
  PieChart,
  Rocket,
  Cloud,
  Settings2,
  Cpu,
  ArrowUpRight,
  Database,
  Sparkles,
  MessageSquareText,
  Twitter,
  Youtube,
  Facebook,
  Phone,
  Camera,
  Shield,
  FileText,
  
  Handshake,
  Star,
  BadgeCheck,
  Coins,
  Truck,
  Factory,
  ShoppingBag,
  Gamepad2,
  ShoppingCart,
  HeartPulse,
  Megaphone
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

// --------------------------- ROUTING & CONTEXT ------------------------------
type Tab = 'home' | 'services' | 'service' | 'svc' | 'careers' | 'contact' | 'apply' | 'privacy' | 'terms' | 'cookies'| 'bigdata' | 'data-architecture' | 'data-warehouse'| 'bi-visualization' | 'predictive-analytics-bd' | 'cloud-services'| 'about' | 'success-stories' | 'blog' | 'write-for-us'|'verify'|'applications-closed'|'apply-form'|'spotlight' |'spotlight-apply';
const NavContext = React.createContext<(t: Tab) => void>(() => {});
const ServiceDetailContext = React.createContext<(slug: string | null) => void>(() => {});
const ActiveServiceContext = React.createContext<string | null>(null);
const ApplyRoleSetterContext = React.createContext<(role: string) => void>(() => {});
const ActiveApplyRoleContext = React.createContext<string>('Data Science Internship');
const CurrentTabContext = React.createContext<Tab>('home');
// Standalone service pages routing (single source of truth)
const ServicePageSetterContext = React.createContext<(slug: string) => void>(() => {});
const ActiveServicePageContext = React.createContext<string | null>(null);
// Ensure contexts for standalone service pages exist
// New contexts for standalone service pages

// Brand palette
// Navy: #0a2540  | Sky: #1e90ff  | White: #ffffff

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// --------------------------- BRAND LOGO (SVG) ------------------------------
function Logo({ size = 1000 }: { size?: number }) {
  return (
    <img
      src="/logo.svg"
      alt="Technocolabs Logo"
      style={{ width: size, height: size }}
    />
  );
}

// --------------------------- CONSTANTS -------------------------------------
const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/technocolabs/",
  github: "https://github.com/Technocolabs100/",
  twitter: "https://x.com/technocolabs",
  instagram: "https://www.instagram.com/technocolabs",
  facebook: "https://www.facebook.com/technocolabs",
} as const;

// --------------------------- DATA ------------------------------------------
const SERVICES_DATA = [
  { id: "ai", title: "AI & Data Science Solutions", icon: Brain, blurb: "End-to-end ML lifecycle: problem framing, model development, MLOps, and continuous improvement.", bullets: ["Predictive & prescriptive analytics","NLP, CV, LLM integration","MLOps & monitoring (CI/CD)"], tags: ["AI","Data","ML"],
    overview: "We design, train, and deploy machine learning systems that deliver measurable business impact - from experimentation to scalable MLOps.",
    benefits: ["Faster time-to-value","Production-grade reliability","Actionable insights for teams"],
    tech: ["Python","TensorFlow","PyTorch","Airflow","dbt","AWS","GCP","Azure"] },
  { id: "apps", title: "Web & Mobile App Development", icon: Smartphone, blurb: "Responsive, secure apps using modern stacks with cloud-native backends.", bullets: ["React/Next.js, Node.js","Android/iOS cross-platform","API-first architecture"], tags: ["Apps","Web","Mobile"],
    overview: "Full-stack engineering from UX to launch. We ship performant apps with modern CI/CD and observability.",
    benefits: ["Pixel-perfect UX","Secure by design","Maintainable codebases"], tech: ["React","Next.js","Node.js","PostgreSQL","Docker"] },
  { id: "bi", title: "Business Intelligence & Analytics", icon: PieChart, blurb: "Interactive dashboards and data storytelling that drive decisions.", bullets: ["Power BI, Tableau","ELT/ETL pipelines","KPI design & governance"], tags: ["Analytics","BI"],
    overview: "Turn raw data into executive-ready dashboards and guided analytics for every business function.",
    benefits: ["Single source of truth","Self-serve analytics","Trusted KPIs"], tech: ["Power BI","Tableau","BigQuery","Snowflake","Looker"] },
  { id: "deploy", title: "ML Model Deployment", icon: Rocket, blurb: "From notebooks to production with scalable inference and A/B testing.", bullets: ["Docker & Kubernetes","Realtime & batch serving","Feature stores"], tags: ["AI","ML","MLOps"],
    overview: "We productionize models with feature stores, CI/CD, canary rollouts, and robust monitoring.",
    benefits: ["Low-latency inference","Safe experiments","Fewer regressions"], tech: ["Kubernetes","Docker","Seldon","Ray","MLflow"] },
  { id: "cloud", title: "Cloud Infrastructure & Automation", icon: Cloud, blurb: "Secure, cost-optimized infra with IaC and GitOps workflows.", bullets: ["AWS/GCP/Azure","Terraform, Ansible","Observability & SRE"], tags: ["Cloud","DevOps"],
    overview: "Design and run cloud platforms with IaC, zero-downtime deployments, and strong security baselines.",
    benefits: ["Lower cloud spend","Higher reliability","Audit-ready ops"], tech: ["AWS","GCP","Azure","Terraform","Ansible","ArgoCD","Prometheus"] },
  { id: "custom", title: "Custom Software Development", icon: Settings2, blurb: "Tailored platforms, integrations, and microservices for complex needs.", bullets: ["Domain-driven design","Event-driven systems","Quality engineering"], tags: ["Software"],
    overview: "We build robust systems around your domain with clean contracts and testable services.",
    benefits: ["Fits your workflows","Scales with demand","Lower TCO"], tech: ["Java","Go","Node.js","Kafka","PostgreSQL"] },
  { id: "dx", title: "Digital Transformation & Tech Consulting", icon: Cpu, blurb: "Roadmaps, solution architecture, and change enablement to scale.", bullets: ["Discovery & strategy","Architecture reviews","Security & compliance"], tags: ["Consulting"],
    overview: "Clarity first: we co-create transformation roadmaps and align stakeholders to outcomes.",
    benefits: ["Aligned strategy","Lower delivery risk","Faster adoption"], tech: ["Architecture","Workshops","Audits"] },
  { id: "training", title: "Corporate Training & Internship Programs", icon: GraduationCap, blurb: "Job-ready training and mentored internships for teams & individuals.", bullets: ["Customized curricula","Capstone projects","Assessments & badges"], tags: ["Training","Internships"],
    overview: "Upskill teams with practical programs that end in demonstrable projects and certifications.",
    benefits: ["Hands-on learning","Mentor support","Portfolio outcomes"], tech: ["Python","Power BI","React","AWS"] },
];

const TAGS = ["All","AI","ML","Data","Analytics","BI","Cloud","DevOps","Apps","Web","Mobile","Software","Consulting","Training","Internships"];

function TrustedBySection() {
  return (
    <section className="bg-white text-[#0a2540] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Approved & Trusted By
        </h2>
        <p className="mt-3 text-[#0a2540]/60 text-sm sm:text-base">
          Recognized by India’s leading government authorities
        </p>

        {/* Logo Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">

          {/* Startup India */}
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white shadow-sm 
                          p-6 flex flex-col items-center justify-center hover:shadow-md transition">
            <img
              src="startup.png"
              alt="Startup India"
              className="h-20 sm:h-24 w-auto object-contain"
            />
            <p className="mt-4 font-semibold text-sm sm:text-base text-[#0a2540]">
              Startup India Recognized
            </p>
          </div>

          {/* MSME */}
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white shadow-sm 
                          p-6 flex flex-col items-center justify-center hover:shadow-md transition">
            <img
              src="msme-1.png"
              alt="MSME Registered"
              className="h-20 sm:h-24 w-auto object-contain"
            />
            <p className="mt-4 font-semibold text-sm sm:text-base text-[#0a2540]">
              MSME Registered
            </p>
          </div>

          {/* MCA */}
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white shadow-sm 
                          p-6 flex flex-col items-center justify-center hover:shadow-md transition">
            <img
              src="mca.png"
              alt="MCA Govt. of India"
              className="h-20 sm:h-24 w-auto object-contain"
            />
            <p className="mt-4 font-semibold text-sm sm:text-base text-[#0a2540]">
              MCA (Ministry of Corporate Affairs)
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

// ---- VerifyInternshipPage (inline) ----

function VerifyInternshipPage() {
  return (
    <section className="relative min-h-[100vh] bg-[#061427] text-white">
      {/* Background Accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-16 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute -left-24 bottom-24 h-40 w-40 rounded-full bg-[#1e90ff]/15 blur-2xl" />
        <div className="absolute -right-24 top-40 h-44 w-44 rounded-full bg-blue-300/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
          <Shield className="h-3.5 w-3.5" /> Technocolabs Verification Portal
        </div>

        {/* Success Panel */}
        <div className="mt-8 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15">
              <CheckCircle2 className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-emerald-200">Certificate Verified Successfully</h1>
              <p className="mt-2 text-sm sm:text-base text-emerald-100/90">
                This internship credential is valid and issued by
                <span className="font-medium text-white"> Technocolabs Softwares Inc.</span>
              </p>
            </div>
          </div>

          {/* Watermark */}
          <div className="mt-6 select-none text-center text-5xl sm:text-6xl font-black tracking-widest text-white/5">
            VERIFIED
          </div>
        </div>

        {/* Info Trio */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/80"><Info className="h-4 w-4" /> About this credential</div>
            <ul className="list-disc pl-5 text-sm text-white/80 space-y-2">
              <li>Issued officially by Technocolabs Softwares Inc.</li>
              <li>Represents completion of a mentored internship program.</li>
              <li>Each certificate contains a unique secure ID.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/80"><FileText className="h-4 w-4" /> For employers & universities</div>
            <ul className="list-disc pl-5 text-sm text-white/80 space-y-2">
              <li>Matches candidate’s official internship completion.</li>
              <li>Verification link is unique and tamper-proof.</li>
              <li>Contact us for official confirmation letters.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/80"><BadgeCheck className="h-4 w-4" /> Integrity & tips</div>
            <ul className="list-disc pl-5 text-sm text-white/80 space-y-2">
              <li>All genuine certificates contain QR verification.</li>
              <li>Use browser’s print option if you need a hard copy.</li>
              <li>Report suspicious certificates immediately.</li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 rounded-3xl border border-white/15 bg-white/5 p-6">
          <div className="text-sm text-white/80 mb-3">Need help or official confirmation?</div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> contact@technocolabs.com</span>
            <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> technocollabs@gmail.com</span>
            <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> +91-8319291391</span>
            <a href="/" className="inline-flex items-center gap-2 hover:underline"><Globe className="h-4 w-4" /> www.technocolabs.com</a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Technocolabs Softwares Inc. • Credential Verification Portal
        </div>
      </div>
    </section>
  );
}

// --------------------------- Animated Network BG ----------------------------
function MissionNetworkBG(
  {
    count = 35,          // fewer dots (was 70)
    linkDistance = 95,   // shorter link range (was 140)
    speed = 0.18,        // calmer movement (was 0.25)
    dotRadius = 1.8      // smaller dots (was 2)
  }: {
    count?: number; linkDistance?: number; speed?: number; dotRadius?: number;
  }
) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const pausedRef = React.useRef<boolean>(false);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  React.useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let h = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    type P = { x: number; y: number; vx: number; vy: number };
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const pts: P[] = Array.from({ length: count }, () => ({
      x: rand(0, w / (window.devicePixelRatio || 1)),
      y: rand(0, h / (window.devicePixelRatio || 1)),
      vx: rand(-speed, speed),
      vy: rand(-speed, speed),
    }));

    const draw = () => {
      if (pausedRef.current) return;

      const pixelRatio = window.devicePixelRatio || 1;
      w = canvas.width = canvas.offsetWidth * pixelRatio;
      h = canvas.height = canvas.offsetHeight * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move points
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width / pixelRatio) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height / pixelRatio) p.vy *= -1;
      }

      // Lines — light blue, fewer/shorter due to linkDistance
      ctx.lineWidth = 0.9;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDistance) {
            const alpha = 1 - d / linkDistance;
            ctx.strokeStyle = `rgba(102,178,255,${0.55 * alpha})`; // light blue
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Dots — light blue with soft glow
      for (const p of pts) {
        ctx.save();
        ctx.fillStyle = 'rgba(153,204,255,1)';     // light blue dot
        ctx.shadowColor = 'rgba(153,204,255,0.45)'; // soft blue glow
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      pausedRef.current = document.hidden;
      if (!document.hidden && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // Reduced motion: static dots, same light-blue color
      ctx.fillStyle = 'rgba(153,204,255,1)';
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const onResize = () => {};
    window.addEventListener('resize', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, linkDistance, speed, dotRadius, prefersReduced]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
      <canvas ref={ref} className="w-full h-full" />
    </div>
  );
}

// --------------------------- HOME PAGE --------------------------------------
function HomePage() {
  const navigate = useContext(NavContext);
  const stats = [
    { label: "Developers Trained", value: "10,000+" },
    { label: "Engineers Working", value: "250+" },
    { label: "Projects Completed", value: "100+" },
    { label: "Partner Companies", value: "50+" },
  ];
  const featured = [
    { icon: Brain, title: "AI & Data Science", desc: "Production-grade ML & analytics that drive impact." },
    { icon: BarChart3, title: "Business Intelligence", desc: "Dashboards and data storytelling for decisions." },
    { icon: GraduationCap, title: "Internships & Training", desc: "Mentored, hands-on programs with real projects." },
  ];
  return (
    <div className="bg-[#0a2540] text-white" id="home">
      {/* Hero */}
      <section className="relative overflow-clip">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#1e90ff]/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        </div>

        {/* tightened padding on mobile; desktop unchanged */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-28 lg:pb-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* LEFT — original content */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                Central India’s AI Solutions & Strategic Consulting Company
              </span>
              <p className="text-sm md:text-base font-medium text-blue-300 mt-4 flex items-center gap-2">
                <span role="img" aria-label="award">🏆</span>
                Proudly ranked #1 in Indore, India & awarded HackerNoon’s Startup of the Year 2024
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Empowering the Next Generation of Innovators
              </h1>
              <p className="mt-5 text-lg text-white/80">
                We are Central India's leading IT Development and Consulting Company - building AI, Data Science, and Software solutions that transform industries.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('services')}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold shadow-sm hover:shadow-lg"
                >
                  Explore Our Services <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('careers')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
                >
                  Join Our Internship
                </button>
              </div>
            </motion.div>

            {/* RIGHT — TechCluster responsive (mobile compact, desktop full) */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-10 flex justify-center lg:mt-0 lg:justify-end"
            >
              {/* mobile/tablet */}
              <div className="block lg:hidden [transform:none]">
                <TechCluster size={300} centerSize={64} badge={44} />
              </div>
              {/* desktop */}
              <div className="hidden lg:block [transform:none]">
                <TechCluster size={440} centerSize={84} badge={56} />
              </div>
            </motion.div>
          </div>

          {/* STATS — unchanged */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-sm">
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-white/70">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

     {/* Leadership quote (3-line, author centered) */}
<section className="bg-white text-[#0a2540]">
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
    <div className="max-w-4xl mx-auto relative flex justify-center">
      <blockquote
        className="
          max-w-3xl mx-auto
          text-center text-lg sm:text-xl leading-relaxed font-medium
          pr-0 sm:pr-24  /* ✅ no right padding on mobile; add on sm+ for the SVG */
        "
      >
        “AI is transforming how modern businesses learn, adapt, and innovate.
        It empowers organizations to turn data into intelligence, deliver
        personalized experiences, and drive meaningful change across every
        function.”
      </blockquote>

      {/* Decorative quote marks (only show on sm+) */}
      <div
        className="hidden sm:block absolute -top-2 right-3 text-[#1e90ff]/20 select-none pointer-events-none transform scale-x-[-1]"
        aria-hidden
      >
        <svg width="65" height="55" viewBox="0 0 120 100" fill="none">
          <path d="M30 10h30v30H40c0 11 9 20 20 20v30C37 90 20 70 20 45V10h10Z" fill="currentColor"/>
          <path d="M80 10h30v30H90c0 11 9 20 20 20v30C87 90 70 70 70 45V10h10Z" fill="currentColor"/>
        </svg>
      </div>
    </div>

    <div className="mt-6 mx-auto max-w-4xl flex items-center gap-4 justify-center relative">
      {/* Left decorative quotes (desktop only) */}
      <div
        className="pointer-events-none absolute -left-12 bottom-0 hidden select-none text-[#1e90ff]/20 lg:block"
        aria-hidden
      >
        <svg width="65" height="115" viewBox="0 0 120 100" fill="none">
          <path d="M30 10h30v30H40c0 11 9 20 20 20v30C37 90 20 70 20 45V10h10Z" fill="currentColor"/>
          <path d="M80 10h30v30H90c0 11 9 20 20 20v30C87 90 70 70 70 45V10h10Z" fill="currentColor"/>
        </svg>
      </div>

      <img
        src="/yasin-profile.png"
        alt="Yasin Shah"
        className="h-14 w-14 rounded-full object-cover ring-2 ring-[#1e90ff]"
      />
      <div className="text-center sm:text-left"> {/* ✅ center on mobile, left on sm+ */}
        <div className="text-base font-semibold">Yasin Shah</div>
        <div className="text-sm text-[#0a2540]/70">
          Director and CEO, Technocolabs Softwares Inc.
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Mission */}
      <section className="relative overflow-hidden bg-[#06213C]">
        <MissionNetworkBG count={100} linkDistance={95} speed={0.18} dotRadius={1.8} />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Our Mission is to Bring the Power of AI to Every Business</h2>
          <p className="mt-5 text-base sm:text-lg text-white/85">
            We are a data science and analytics consulting firm delivering AI-powered solutions to companies that want to
            leverage data and machine learning algorithms for business value.
          </p>
          <p className="mt-4 text-base sm:text-lg text-white/85">
            As an artificial intelligence company, we focus on AI and Big Data software development. We help businesses
            innovate with AI, enrich customer insights, automate processes, and operate more cost-efficiently.
          </p>
        </div>
      </section>

      {/* How We Can Help You */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">How We Can Help You</h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-[#0a2540]/70">
            We welcome opportunities to work alongside different teams over projects of any complexity. By working together, we will develop new systems, solutions, and products to separate you from your competition.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Cards unchanged */}
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><MessageSquareText className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">AI/ML Strategy & Consulting</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">Have a project idea and need help implementing it? We're here to consult you and share our knowledge to help you avoid all unnecessary pitfalls.</p>
            </div>

            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-500"><Sparkles className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">PoC of AI-Based Solution</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">POC is an essential step before adopting any AI solution. If you have a project idea, our data science consultants will verify that your concept has potential.</p>
            </div>

            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600"><Rocket className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">MVP of AI-Based Product</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">Need a breakthrough AI product? We'll start with a version of just enough features to satisfy early customers and provide feedback for product development.</p>
            </div>

            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600"><Database className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">Custom Model Development</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">We can build and train custom models for your business needs, or retrain your existing ones (open-source and proprietary) for better efficiency and scalability.</p>
            </div>

            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><Settings2 className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">AI Software Development</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">If you need to develop an innovative web application from scratch, or empower the existing one with AI capabilities, let our experts help you.</p>
            </div>

            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Smartphone className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">AI-Driven Mobile App Development</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">Our experts are here to help you build your innovative mobile app from scratch and power it with AI capabilities that your users will love.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficial Results / Impact Stats */}
      <section className="relative bg-white text-[#0a2540]">
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            backgroundImage: 'radial-gradient(rgba(255,163,77,0.25) 1.6px, transparent 1.6px)',
            backgroundSize: '20px 20px',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0) 100%)'
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Beneficial Results of Artificial Intelligence in Business</h2>
          <p className="mt-3 max-w-3xl mx-auto text-center text-[#0a2540]/70">Real outcomes teams see after adopting AI and data-driven workflows.</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { value: '83%', label: 'of companies claim AI as a strategic business priority' },
              { value: '85%', label: 'of customer service interactions are responded to by chatbots' },
              { value: '40%', label: 'improvement in business efficiency with AI' }
            ].map((item) => (
              <div key={item.value} className="group rounded-2xl border border-[#0a2540]/10 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="text-5xl font-semibold text-[#1e90ff] tracking-tight text-center">{item.value}</div>
                <div className="mx-auto mt-3 h-[2px] w-20 bg-[#1e90ff]/50" />
                <p className="mt-4 text-center text-sm sm:text-base text-[#0a2540]/80 leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ New Orbit Section */}
      <AIServicePremiumGrid />

      {/* Why Partner With Us */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Why Partner with Technocolabs</h2>
          <p className="mt-4 max-w-4xl mx-auto text-center text-[#0a2540]/70">
            With years of AI software development behind us, we keep learning and strengthening our expertise. We’re innovation-driven and help our clients adopt disruptive technologies that create real business value.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Brain className="h-7 w-7"/></div>
              <div className="mt-4 text-base font-semibold">Strong AI Service Company</div>
              <p className="mt-2 text-sm text-[#0a2540]/70">Broad experience in AI development services and a diverse portfolio.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><BadgeCheck className="h-7 w-7"/></div>
              <div className="mt-4 text-base font-semibold">Utmost Quality</div>
              <p className="mt-2 text-sm text-[#0a2540]/70">Focused on quality, intended to create exceptional value for our clients.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Star className="h-7 w-7"/></div>
              <div className="mt-4 text-base font-semibold">Customer Orientation</div>
              <p className="mt-2 text-sm text-[#0a2540]/70">Meeting your needs and suggesting improvements that move the project forward.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Handshake className="h-7 w-7"/></div>
              <div className="mt-4 text-base font-semibold">Transparency & Accountability</div>
              <p className="mt-2 text-sm text-[#0a2540]/70">Open communication on strategy and implementation at all levels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries section */}
      <IndustriesSection />

      {/* Trusted preview */}
      <TrustedBySection />
       
      {/* Contact preview */}
      <ContactPreview />

      {/* ✅ Floating Chatbot Widget (Home page only) */}
      <ChatbotWidget />
    </div>
  );
}
  
function IndustriesSection() {
  const navigate = useContext(NavContext);
  return (
    <section className="bg-white text-[#0a2540]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 select-none lg:block">
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full border border-[#1e90ff]/20" />
          <div className="absolute right-14 top-20 h-96 w-96 rounded-full border border-[#1e90ff]/15" />
          <div className="absolute right-24 top-32 h-[28rem] w-[28rem] rounded-full border border-[#1e90ff]/10" />
        </div>
        <div className="rounded-3xl border border-[#0a2540]/10 bg-blue-50/60 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Industries We Are Transforming</h2>
          <p className="mt-3 max-w-3xl text-[#0a2540]/70">
            Take a look at examples of our work and learn how our clients from different industries have benefited from our
            <button onClick={() => navigate('services')} className="ml-1 inline-flex items-center gap-1 font-medium text-[#1e90ff] hover:underline">data science consulting services <ArrowUpRight className="h-3.5 w-3.5" /></button>.
          </p>
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {[{title:'Advertising',desc:'Improve your advertising capabilities through AI and advanced customer behavior analytics.'},{title:'FinTech',desc:'Optimize your processes and improve safety and security through custom AI solutions.'},{title:'Retail & E-commerce',desc:"The entire industry is using AI to make strategic decisions. Don't get left behind! Let our data scientists help you."},{title:'Entertainment',desc:'Reduce customer churn and analyze enormous amounts of data to become more productive and provide outstanding services.'},{title:'Logistics & Supply Chain',desc:'Enable greater operational efficiency by introducing disruptive logistic solutions that solve your business challenges.'},{title:'Your Industry',desc:'From a different industry? Contact us to learn how our AI company can add value to your business.'}].map((it) => (
              <div key={it.title} className="rounded-2xl p-2">
                <div className="flex items-start gap-2"><h3 className="text-base font-semibold">{it.title}</h3><ArrowUpRight className="mt-0.5 h-4 w-4 text-[#1e90ff]" /></div>
                <p className="mt-2 text-sm text-[#0a2540]/70">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------------------- CONTACT PREVIEW (wired up) ----------------------
function ContactPreview() {
  // TODO: replace with your deployed Apps Script Web App URL or a form backend
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbyAiUMKK7GqNrVfM8jDgfrAEvIDM6lVmaCVHqLfm99bE9Zpo2G6YB2qa-3CMkmHJQDnDA/exec";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [note, setNote] = React.useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [sentOnceAt, setSentOnceAt] = React.useState<number>(0);

  // Honeypot (bots fill it, humans won't)
  const [website, setWebsite] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNote(null);

    // very simple checks
    if (!name.trim() || !email.trim() || !message.trim()) {
      setNote({ type: "err", text: "Please fill in all fields." });
      return;
    }
    // Honeypot: if filled, silently succeed (or just return)
    if (website.trim()) {
      setNote({ type: "ok", text: "Thanks! Your message has been sent." });
      setName(""); setEmail(""); setMessage("");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      // extra meta (optional, handy in your Sheet)
      formData.append("ua", navigator.userAgent);
      formData.append("page", window.location.href);

      // ---- Option A: read JSON reply (if your endpoint supports CORS) ----
      const res = await fetch(ENDPOINT, { method: "POST", body: formData });
      const text = await res.text(); // Apps Script sometimes returns text/plain
      let data: any = {};
      try { data = JSON.parse(text || "{}"); } catch {}
      if (res.ok && (data.ok === true || Object.keys(data).length === 0)) {
        setNote({ type: "ok", text: "Thanks! Your message has been sent." });
        setName(""); setEmail(""); setMessage("");
        setSentOnceAt(Date.now());
      } else {
        throw new Error(data.error || "Could not send. Please try again.");
      }

      // ---- Option B: if your endpoint blocks CORS, use no-cors and assume success ----
      // await fetch(ENDPOINT, { method: "POST", body: formData, mode: "no-cors" });
      // setNote({ type: "ok", text: "Thanks! Your message has been sent." });
      // setName(""); setEmail(""); setMessage("");
      // setSentOnceAt(Date.now());

    } catch (err) {
      setNote({ type: "err", text: "Could not send. Please try again in a moment." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="bg-white text-[#0a2540]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">Let's build something great</h3>
            <p className="mt-3 text-[#0a2540]/70">
              We combine learning and real-world projects to nurture future-ready professionals and deliver cutting-edge AI and ML products to clients worldwide. Tell us about your project or training needs. Our team will get back within 1-2 business days.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a href="mailto:contact@technocolabs.com" className="inline-flex items-center gap-2 hover:underline">
                <Mail className="h-4 w-4" /> contact@technocolabs.com
              </a>
              <div className="flex items-center gap-4 mt-2">
                <a aria-label="LinkedIn" href={SOCIAL_LINKS.linkedin} className="hover:text-[#1e90ff]"><Linkedin className="h-5 w-5" /></a>
                <a aria-label="Instagram" href={SOCIAL_LINKS.instagram} className="hover:text-[#1e90ff]"><Instagram className="h-5 w-5" /></a>
                <a aria-label="Facebook" href={SOCIAL_LINKS.facebook} className="hover:text-[#1e90ff]"><Facebook className="h-5 w-5" /></a>
                <a aria-label="GitHub" href={SOCIAL_LINKS.github} className="hover:text-[#1e90ff]"><Github className="h-5 w-5" /></a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              {/* Honeypot (hidden) */}
              <input
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg ${
                  loading ? "bg-[#1e90ff]/70" : "bg-[#1e90ff]"
                }`}
              >
                {loading ? "Sending..." : "Send Message"} <ArrowRight className="h-4 w-4" />
              </button>

              {note && (
                <p
                  className={`text-sm ${
                    note.type === "ok" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {note.text}
                </p>
              )}

              {sentOnceAt > 0 && (
                <p className="text-xs text-[#0a2540]/60">
                  Reference: {new Date(sentOnceAt).toLocaleString()}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// --------------------------- STANDALONE SERVICE PAGES ----------------------

type ServiceSlug = 'ai-consulting' | 'machine-learning' | 'computer-vision' | 'nlp-chatbots' | 'predictive-analytics' | 'generative-ai' | 'data-engineering' | 'mlops' | 'ai-integration' | 'marketing-ai' | 'fraud-analytics' | 'intelligent-document-processing' |
  // New sub-service slugs across all categories
  'frontend-engineering' | 'backend-apis' | 'mobile-apps' | 'ui-ux-engineering' | 'fullstack-dev' |
  'power-bi-dashboards' | 'tableau-analytics' | 'data-governance-kpis' | 'self-serve-bi' |
  'realtime-inference' | 'ab-testing-platform' | 'feature-store-engineering' |
  'infrastructure-as-code' | 'cloud-cost-optimization' | 'observability-and-sre' | 'ci-cd-pipelines' |
  'system-integration' | 'microservices-platform' | 'qa-test-automation' |
  'architecture-review' | 'security-compliance-audit' | 'tech-roadmapping' |
  'corporate-ai-training' | 'internship-programs' | 'capstone-projects';

type ServicePageData = {
  seoTitle: string;
  metaDescription: string;
  title: string;
  tagline: string;
  about: string;
  features: string[];
  useCases: string[];
  industries: string[];
  process: string[];
  tools: string[];
  whyUs: string[];
  cta: string;
  imageHint?: string;
};

const SERVICE_PAGES: Record<ServiceSlug, ServicePageData> = {
  'ai-consulting': {
    seoTitle: 'AI Consulting & Strategy | Technocolabs — Roadmaps that Ship ROI',
    metaDescription: 'Pragmatic AI strategy, portfolio roadmaps, and executive alignment. We translate AI ambition into prioritized initiatives that deliver measurable impact.',
    title: 'AI Consulting & Strategy',
    tagline: 'From vision to value—fast, focused, accountable.',
    about: 'We align leadership, data, and delivery. Our consultants map opportunities, build business cases, and de-risk execution with pilots, KPIs, and governance.',
    features: ['Opportunity discovery workshops','AI portfolio & business case modeling','Readiness assessment (data, people, tech)','Risk & compliance framing','Value-first pilot design & success metrics'],
    useCases: ['12–18 month AI portfolio planning','Buy vs. build vs. partner decisions','Executive enablement & AI operating model setup'],
    industries: ['Finance','Retail','Manufacturing','Healthcare','Logistics','Energy','EdTech'],
    process: ['Discovery','Value Modeling','Capability Assessment','Pilot Plan','Governance & KPIs','Scale Roadmap'],
    tools: ['Miro','Notion','Cloud audits (AWS/GCP/Azure)','dbt/BI inputs'],
    whyUs: ['Operators first: shipped AI in production','KPI-driven, board-ready artifacts','Clear glidepath from POC to scale'],
    cta: 'Book a 45‑min strategy session',
    imageHint: 'Executive workshop / roadmap infographic'
  },
  'machine-learning': {
    seoTitle: 'Machine Learning Solutions | Technocolabs — Models that Move Metrics',
    metaDescription: 'End-to-end ML: feature engineering, training, evaluation, deployment, and monitoring for measurable business impact.',
    title: 'Machine Learning Solutions',
    tagline: 'Production ML built around your KPIs.',
    about: 'We build performant, maintainable ML systems—forecasting, classification, optimization—with a strong MLOps backbone.',
    features: ['Feature stores & reusable pipelines','Robust validation & drift tests','Real-time & batch inference','Experiment tracking & A/B testing'],
    useCases: ['Demand forecasting','Risk scoring','Churn prediction','Inventory optimization'],
    industries: ['Retail','FinTech','SaaS','Supply Chain','Energy'],
    process: ['Business goals','Data prep','Baselines','Iteration','Deployment','Monitoring'],
    tools: ['Python','scikit-learn','XGBoost','PyTorch/TensorFlow','MLflow','Airflow','Feast','Docker/K8s'],
    whyUs: ['Proven lift on business metrics','Transparent docs & handover','Designed for scale & reliability'],
    cta: 'Get a free feasibility review',
    imageHint: 'Model pipeline diagram with KPIs'
  },
  'computer-vision': {
    seoTitle: 'Computer Vision Services | Detection, OCR & Visual QA',
    metaDescription: 'Vision systems for detection, segmentation, OCR, visual search, and inspection—edge or cloud.',
    title: 'Computer Vision',
    tagline: 'Vision systems that inspect, read, and understand.',
    about: 'From image pipelines to edge inference, we deliver robust CV for manufacturing, retail, and logistics.',
    features: ['Object detection & instance segmentation','OCR & document vision','Visual search & similarity','Edge deployment with low latency'],
    useCases: ['Quality inspection','Shelf analytics','ID verification','Warehouse safety'],
    industries: ['Manufacturing','Retail','Logistics','Public Sector'],
    process: ['Data labeling','Model selection/tuning','Evaluation','Edge/Cloud deployment','Monitoring'],
    tools: ['PyTorch','YOLO/Detectron','OpenCV','ONNX/TensorRT','AWS Panorama','Vertex AI'],
    whyUs: ['High-accuracy models on real data','Optimized for cost and speed in production'],
    cta: 'Book a vision demo',
    imageHint: 'Bounding boxes on sample images'
  },
  'nlp-chatbots': {
    seoTitle: 'NLP & AI Chatbots | Search, Summarization, Support Automation',
    metaDescription: 'NLP for semantic search, summarization, classification, and multilingual chat with RAG.',
    title: 'NLP & Chatbots',
    tagline: 'From documents to decisions—instantly.',
    about: 'We build NLP stacks that surface knowledge, summarize content, and automate support across channels.',
    features: ['Semantic search & retrieval','Summarization','Classification, NER, sentiment','Omnichannel chatbots with handoff'],
    useCases: ['Knowledge bases','Policy search','Ticket triage','Compliance screening'],
    industries: ['SaaS','Telecom','Healthcare','Legal & Compliance'],
    process: ['Corpus audit','Taxonomy & intents','Models & RAG','Evaluation','Deploy'],
    tools: ['spaCy','Transformers','FAISS/PGVector','OpenAI/HF','LangChain/LlamaIndex'],
    whyUs: ['Measurable deflection & time‑to‑answer reductions','Secure, enterprise‑grade implementations'],
    cta: 'Start with a pilot',
    imageHint: 'RAG architecture / chatbot flow'
  },
  'predictive-analytics': {
    seoTitle: 'Predictive Analytics & Forecasting | Technocolabs',
    metaDescription: 'Time-series and predictive modeling to anticipate demand, risk, and revenue.',
    title: 'Predictive Analytics & Forecasting',
    tagline: 'Forecasts that drive planning and profitability.',
    about: 'We turn historical and external signals into forecasts that improve inventory, staffing, and revenue.',
    features: ['Hierarchical forecasting','Scenario planning & what‑if','External signal enrichment','KPI dashboards with alerts'],
    useCases: ['Demand & staffing forecasting','Cash‑flow prediction','Capacity planning'],
    industries: ['Retail','QSR','Travel','Energy','SaaS'],
    process: ['Signal audit','Feature engineering','Model selection','Backtesting','Rollout'],
    tools: ['Prophet','LightGBM/XGBoost','Statsmodels','Ray','BigQuery/Snowflake'],
    whyUs: ['Forecasts tied to operational decisions','Governance & explainability built in'],
    cta: 'Get a forecast audit',
    imageHint: 'Forecast with confidence bands'
  },
  'generative-ai': {
    seoTitle: 'Generative AI Solutions | RAG, Agents & Fine‑Tuning',
    metaDescription: 'GenAI apps that reduce manual work and accelerate decisions—grounded in your data and workflows.',
    title: 'Generative AI Applications',
    tagline: 'Grounded, safe, and measurable.',
    about: 'We design GenAI apps that reduce manual work, boost creativity, and accelerate decision‑making—using retrieval and guardrails.',
    features: ['RAG over private data','Agent workflows & tool use','Fine‑tuning & embeddings','Evaluation & safety guardrails'],
    useCases: ['Sales co‑pilot','Policy Q&A','Proposal drafting','Research assistant'],
    industries: ['Consulting','SaaS','Legal','Marketing','Healthcare'],
    process: ['Use‑case scoping','Data prep & retrieval','Prototype','Eval harness','Production'],
    tools: ['OpenAI/Anthropic/HF','LangChain/LlamaIndex','Weaviate/PGVector','Guardrails','Vertex/Azure OpenAI'],
    whyUs: ['Measurable ROI with eval dashboards','Secure deployment with PII controls'],
    cta: 'See a GenAI demo',
    imageHint: 'Agent calling external tools'
  },
  'data-engineering': {
    seoTitle: 'Data Engineering & Warehousing | Pipelines, Quality & Governance',
    metaDescription: 'Reliable data foundations—ETL/ELT, modeling, governance, and cost‑efficient architectures.',
    title: 'Data Engineering & Warehousing',
    tagline: 'Fast, governed, and analytics‑ready.',
    about: 'We design scalable pipelines and models that feed analytics and ML—monitoring quality and cost.',
    features: ['Batch & streaming pipelines','Data modeling (star/snowflake)','Quality checks & lineage','Cost & performance optimization'],
    useCases: ['360° customer views','Unified metrics','ML feature pipes'],
    industries: ['Finance','SaaS','Retail','Manufacturing','Healthcare'],
    process: ['Discovery','Architecture','Build','Orchestrate','Monitor','Handover'],
    tools: ['dbt','Airflow','Kafka','Fivetran/Glue','BigQuery/Snowflake/Redshift','Great Expectations'],
    whyUs: ['Practical, vendor‑neutral engineering','Documentation your team will use'],
    cta: 'Request a data architecture review',
    imageHint: 'Modern data stack diagram'
  },
  'mlops': {
    seoTitle: 'MLOps & Model Deployment | CI/CD, Monitoring & Governance',
    metaDescription: 'Productionize ML with CI/CD, feature stores, canary rollouts, and model observability.',
    title: 'MLOps & Model Deployment',
    tagline: 'Safe rollouts. Zero‑downtime. Full visibility.',
    about: 'We streamline delivery with CI/CD for ML, model registries, performance SLOs, and drift monitoring.',
    features: ['CI/CD for data & models','Feature store & registry','Canary & shadow deployments','Monitoring (latency, drift, bias)'],
    useCases: ['High‑traffic inference','Audit‑ready ML governance'],
    industries: ['Finance','Healthcare','E‑commerce','SaaS'],
    process: ['Assess','Pipeline/Infra setup','Rollout','SRE & Observability'],
    tools: ['MLflow','Feast','BentoML/Seldon','Docker/K8s','Prometheus/Grafana','Datadog'],
    whyUs: ['Reduced incidents & faster iteration','Lower infra cost per prediction'],
    cta: 'Audit my ML deployment',
    imageHint: 'CI/CD pipeline; canary rollout sketch'
  },
  'ai-integration': {
    seoTitle: 'AI Integration & Automation | Orchestrate Work with AI',
    metaDescription: 'Connect AI with apps, CRMs, ERPs, and RPA to reduce manual steps and cycle times.',
    title: 'AI Integration & Workflow Automation',
    tagline: 'AI in the flow of work.',
    about: 'We embed AI into core workflows—AP/AR, support, sales ops—driving higher throughput with fewer errors.',
    features: ['API integration with CRMs/ERPs','Orchestrations & human‑in‑the‑loop','Document automation & approvals','Event‑driven automations'],
    useCases: ['Invoice processing','Lead qualification','Claims intake'],
    industries: ['FinOps','Insurance','Manufacturing','Professional Services'],
    process: ['Process mapping','Automation design','Connectors','HIL controls','Analytics'],
    tools: ['Zapier/Workato/Make','Custom Node/Python services','RPA','Webhooks'],
    whyUs: ['Measurable cycle‑time reductions','Secure, audited automations'],
    cta: 'Map my workflow',
    imageHint: 'Flow diagram with AI decision nodes'
  },
  'marketing-ai': {
    seoTitle: 'Marketing AI & Personalization | Segmentation, Content & CRO',
    metaDescription: 'Intelligent segmentation, next‑best‑action, and AI‑generated content for growth.',
    title: 'Marketing AI & Personalization',
    tagline: 'Right message, right moment.',
    about: 'We combine predictive models and GenAI to craft journeys that convert—without spamming.',
    features: ['Customer segmentation & LTV modeling','Next‑best‑action/recommendations','AI content generation with guardrails','Experimentation & CRO analytics'],
    useCases: ['Lifecycle automation','Cart recovery','Content ops scale'],
    industries: ['Retail','D2C','SaaS','Media'],
    process: ['Data unification','Segments','Journeys','Content','Experiments'],
    tools: ['Braze/Iterable/Klaviyo','CDP','GA4','Optimizely','OpenAI/HF'],
    whyUs: ['Brand‑safe, on‑message content','Clear uplift measurement'],
    cta: 'Request a growth plan',
    imageHint: 'Journey map; uplift chart'
  },
  'fraud-analytics': {
    seoTitle: 'Fraud Detection & Risk Analytics | Real‑Time Protection',
    metaDescription: 'ML for fraud prevention, anomaly detection, and compliance scoring with real‑time decisions.',
    title: 'Fraud Detection & Risk Analytics',
    tagline: 'Smarter defense, fewer false positives.',
    about: 'We deploy high‑precision scoring engines with explainability and case‑management tooling.',
    features: ['Ensemble models & rules blending','Real‑time scoring APIs','Case clustering & triage','Explainability & audit trails'],
    useCases: ['Payments fraud','Application fraud','AML alerts','Account takeover'],
    industries: ['FinTech','Banking','iGaming','Marketplaces'],
    process: ['Label strategy','Model stack','Thresholding','Human review loop','Reporting'],
    tools: ['LightGBM','Graph features','Kafka/Kinesis','Elasticsearch'],
    whyUs: ['Balance catch rate with customer experience','Compliance‑ready documentation'],
    cta: 'Assess my risk stack',
    imageHint: 'Decision graph; alert pipeline'
  },
  'intelligent-document-processing': {
    seoTitle: 'Intelligent Document Processing | OCR, Extraction & Validation',
    metaDescription: 'Automate documents—extract, validate, and route data from invoices, IDs, forms, and PDFs.',
    title: 'Intelligent Document Processing (IDP/OCR)',
    tagline: 'Accurate extraction, faster cycles.',
    about: 'We combine CV, OCR, and NLP to reliably read structured and unstructured docs, then validate against systems.',
    features: ['OCR + key‑value extraction','Table understanding & line‑item capture','Validation against master data','Exceptions & human review'],
    useCases: ['AP automation','KYC','Claims processing','Logistics docs'],
    industries: ['Finance','Insurance','Healthcare','Logistics','Government'],
    process: ['Sample analysis','Template/free‑form mix','Extraction model','Validation rules','HIL','Exports'],
    tools: ['Tesseract/TrOCR','LayoutLM/DocLM','OpenCV','Airflow','Snowflake'],
    whyUs: ['Production accuracy with continuous learning','Integrates with ERPs/CRMs for closed‑loop quality'],
    cta: 'See an IDP demo',
    imageHint: 'Invoice extraction view; validation screen'
    },
  // ---------------- Additional Sub-Service Pages ----------------
  'frontend-engineering': { seoTitle: 'Frontend Engineering | React/Next.js UI at Scale', metaDescription: 'High-performance React/Next.js front-ends with design systems, accessibility, and SEO baked in.', title: 'Frontend Engineering', tagline: 'Delightful UX. Bulletproof performance.', about: 'We ship accessible, fast, and maintainable front-ends using React/Next.js with modern design systems and CI.', features: ['Design systems & component libraries','SSR/ISR with Next.js','Accessibility (WCAG) & i18n','Core Web Vitals & performance budgets'], useCases: ['Marketing sites & docs','Customer portals','Admin consoles','Design system builds'], industries: ['SaaS','E‑commerce','FinTech','EdTech'], process: ['UX & IA','Component library','API contracts','CI/preview envs','Perf & a11y gates'], tools: ['React','Next.js','Storybook','Playwright','Lighthouse'], whyUs: ['Design + engineering under one roof','CI checks for quality at scale'], cta: 'Review my front-end architecture' },
  'backend-apis': { seoTitle: 'Backend APIs | Secure, Observable Services', metaDescription: 'Resilient APIs with auth, rate limits, caching, and observability.', title: 'Backend APIs', tagline: 'Reliable services that scale with you.', about: 'We build typed, documented, and observable APIs with secure auth and predictable SLAs.', features: ['OpenAPI-first design','AuthZ/AuthN & rate limiting','Caching & queues','Zero-downtime deploys'], useCases: ['Partner integrations','Data ingestion','Public developer APIs'], industries: ['SaaS','FinTech','Logistics'], process: ['Contracts','Scaffold','Implement','Harden','Observe'], tools: ['Node.js','FastAPI','PostgreSQL','Redis','Kafka'], whyUs: ['Battle-tested playbooks','Clear docs and runbooks'], cta: 'Get an API review' },
  'mobile-apps': { seoTitle: 'Mobile Apps | Cross‑Platform with Native Quality', metaDescription: 'iOS/Android apps with modern tooling and analytics.', title: 'Mobile App Development', tagline: 'Native feel, cross‑platform velocity.', about: 'We design and deliver mobile apps with analytics, A/B testing, and CI‑based releases.', features: ['Cross-platform stacks','Offline-first','Crash & perf analytics','Experimentation'], useCases: ['Consumer apps','Field ops','CX apps'], industries: ['Retail','Healthcare','Logistics'], process: ['Discovery','Design','MVP','Iterate','Release'], tools: ['React Native','Flutter','Firebase','Expo'], whyUs: ['Fast iterations with safety rails','Strong DX & analytics'], cta: 'Scope my mobile MVP' },
  'ui-ux-engineering': { seoTitle: 'UI/UX Engineering | Design Systems & Prototyping', metaDescription: 'Design systems, accessible components, and prototyping that translate into production.', title: 'UI/UX Engineering', tagline: 'Design that ships.', about: 'We bridge design and engineering with tokens, components, and accessible patterns that teams adopt.', features: ['Design tokens & theming','Component libraries','Prototyping → production','Accessibility reviews'], useCases: ['Design system rebuilds','App redesigns','New products'], industries: ['SaaS','E‑commerce','FinTech'], process: ['Audit','Systemize','Prototype','Build','Adopt'], tools: ['Figma','Storybook','Tailwind','Framer'], whyUs: ['Consistent UI','Faster feature delivery'], cta: 'Plan my design system' },
  'fullstack-dev': { seoTitle: 'Full‑Stack Development | From UI to Cloud', metaDescription: 'Product teams that deliver UI, APIs, and data layers together.', title: 'Full‑Stack Development', tagline: 'One team, end‑to‑end.', about: 'We ship features across UI + API + data, keeping contracts clean and iterations fast.', features: ['Vertical slice delivery','API-first contracts','Observability & testing','Secure auth'], useCases: ['New products','Platform modules','Internal tools'], industries: ['SaaS','Health','FinTech'], process: ['Discovery','Deliver slices','Harden','Scale'], tools: ['Next.js','Node.js','Postgres','Redis'], whyUs: ['Tight feedback loops','Quality baked-in'], cta: 'Discuss a build plan' },

  'power-bi-dashboards': { seoTitle: 'Power BI Dashboards | Executive-Ready Analytics', metaDescription: 'Actionable, governance-ready dashboards on Power BI.', title: 'Power BI Dashboards', tagline: 'Trusted KPIs. Clear decisions.', about: 'We model data and build Power BI dashboards with governance and refresh reliability.', features: ['Data modeling (star/snowflake)','Row-level security','Refresh SLAs','Design for adoption'], useCases: ['Executive scorecards','Ops command centers','Self-serve analytics'], industries: ['Retail','Manufacturing','Finance'], process: ['Metric catalog','Modeling','Visuals','Deploy','Enablement'], tools: ['Power BI','DAX','Power Query','Snowflake/BigQuery'], whyUs: ['Adoption-focused design','Maintainable models'], cta: 'Audit my dashboards' },
  'tableau-analytics': { seoTitle: 'Tableau Analytics | Fast Insights for Teams', metaDescription: 'High-utility Tableau workbooks with performance tuning and permissions.', title: 'Tableau Analytics', tagline: 'From raw data to clear stories.', about: 'We build performant Tableau assets with consistent metrics and role-based access.', features: ['Workbook performance','Parameterized analysis','Role-based access','Clear storytelling'], useCases: ['Revenue ops','Supply chain analytics','Customer insights'], industries: ['SaaS','Retail','Logistics'], process: ['KPI design','Data prep','Workbook build','QA & perf','Training'], tools: ['Tableau','Hyper','Snowflake','dbt'], whyUs: ['Clarity first, no chart soup','Operational SLAs'], cta: 'Plan a Tableau revamp' },
  'data-governance-kpis': { seoTitle: 'Data Governance & KPI Design', metaDescription: 'Consistent definitions, ownership, and lineage for trusted decisions.', title: 'Data Governance & KPI Design', tagline: 'Metrics everyone trusts.', about: 'We set up semantic layers and governance so teams use the same numbers everywhere.', features: ['Metric catalog & ownership','Lineage & quality checks','Access controls','Review rituals'], useCases: ['Board reporting','Team scorecards','Compliance'], industries: ['Finance','Healthcare','SaaS'], process: ['Discovery','Definitions','Controls','Enablement'], tools: ['dbt','Great Expectations','Data Catalogs'], whyUs: ['Reduce “dueling dashboards”','Traceable KPIs'], cta: 'Design my KPI catalog' },
  'self-serve-bi': { seoTitle: 'Self‑Serve BI Enablement', metaDescription: 'Empower teams with governed, reliable self-serve analytics.', title: 'Self‑Serve BI Enablement', tagline: 'Insights for everyone.', about: 'We equip teams to explore and answer questions safely, using governed semantic layers and training.', features: ['Semantic layer','Role-based access','Templates & training','Adoption metrics'], useCases: ['Product analytics','Ops insights','Finance reporting'], industries: ['SaaS','Retail','Manufacturing'], process: ['Assess','Enable','Measure','Iterate'], tools: ['Looker','Power BI','Tableau'], whyUs: ['Adoption, not just dashboards','Governed freedom'], cta: 'Enable self‑serve BI' },

  'realtime-inference': { seoTitle: 'Real‑Time Inference Services', metaDescription: 'Low-latency online prediction services with canary rollouts.', title: 'Real‑Time Inference', tagline: 'Milliseconds matter.', about: 'We deploy scalable online inference with autoscaling, caching, and safe rollouts.', features: ['Autoscaling','Caching & batching','Canary/shadow','SLO monitoring'], useCases: ['Personalization','Fraud checks','Recommendations'], industries: ['E‑commerce','FinTech','SaaS'], process: ['Containerize','Serve','Scale','Observe'], tools: ['BentoML','Seldon','K8s','Prometheus'], whyUs: ['Latency + reliability balance','Predictable ops cost'], cta: 'Assess my inference path' },
  'ab-testing-platform': { seoTitle: 'A/B Testing & Experimentation', metaDescription: 'Experimentation frameworks, guardrails, and reporting.', title: 'A/B Testing & Experimentation', tagline: 'Ship changes with confidence.', about: 'We implement experimentation platforms with stats guardrails and auto-reporting.', features: ['Exposure rules','Stats guardrails','Holdouts','Automated reports'], useCases: ['Feature flags','Pricing tests','UX experiments'], industries: ['SaaS','Retail','Media'], process: ['Design','Implement','Educate','Iterate'], tools: ['Optimizely','LaunchDarkly','In-house libs'], whyUs: ['Accelerate learning cycles','Reduce risk of launches'], cta: 'Set up my experimentation' },
  'feature-store-engineering': { seoTitle: 'Feature Store Engineering', metaDescription: 'Reusable features for batch and real-time ML, with lineage.', title: 'Feature Store Engineering', tagline: 'Reusable features, faster models.', about: 'We design feature stores for consistency across training and serving.', features: ['Materialization strategies','Backfills & point-in-time','Access controls','Docs & lineage'], useCases: ['Fraud features','Recommendations','Risk scoring'], industries: ['FinTech','E‑commerce','SaaS'], process: ['Audit','Modeling','Pipelines','Access & docs'], tools: ['Feast','Hopsworks','BigQuery/Snowflake'], whyUs: ['Improve velocity & quality of ML','Lower tech debt'], cta: 'Plan my feature store' },

  'infrastructure-as-code': { seoTitle: 'Infrastructure as Code (IaC)', metaDescription: 'Terraform-first infra with GitOps, reviews, and policy.', title: 'Infrastructure as Code', tagline: 'Repeatable, reviewable, reliable.', about: 'We codify cloud with Terraform and GitOps so changes are safe, reviewable, and auditable.', features: ['Module libraries','GitOps workflows','Policy-as-code','Environments & DR'], useCases: ['New cloud foundations','Environment drift control'], industries: ['SaaS','Finance','GovTech'], process: ['Plan','Modules','Pipelines','Policies'], tools: ['Terraform','ArgoCD','Atlantis'], whyUs: ['Operate with confidence','Lower toil'], cta: 'Codify my cloud' },
  'cloud-cost-optimization': { seoTitle: 'Cloud Cost Optimization', metaDescription: 'Right-size resources, reduce waste, and set budgets/alerts.', title: 'Cloud Cost Optimization', tagline: 'More value, less spend.', about: 'We analyze usage and redesign architectures to cut cost without hurting reliability.', features: ['Sizing & commitments','Storage & egress planning','Observability-informed savings'], useCases: ['FinOps','Budgeting','SaaS margins'], industries: ['SaaS','Media','AI/ML'], process: ['Usage analysis','Opportunity map','Remediation','Guardrails'], tools: ['Cloud native tools','OpenCost'], whyUs: ['Real savings, not slideware','Metrics before/after'], cta: 'Get a cost audit' },
  'observability-and-sre': { seoTitle: 'Observability & SRE', metaDescription: 'Dashboards, alerts, tracing, and SLOs for reliable ops.', title: 'Observability & SRE', tagline: 'Know when, why, and what to fix.', about: 'We design observability and SRE practices with actionable SLOs and runbooks.', features: ['Metrics/logs/traces','SLOs & error budgets','On-call playbooks','Postmortems'], useCases: ['High-availability apps','Data platforms','ML services'], industries: ['SaaS','FinTech','Health'], process: ['Assess','Instrument','Dashboards','SLOs & alerts'], tools: ['Prometheus','Grafana','OpenTelemetry','Datadog'], whyUs: ['Operational maturity fast','No vendor lock-in'], cta: 'Instrument my platform' },
  'ci-cd-pipelines': { seoTitle: 'CI/CD Pipelines', metaDescription: 'Fast, safe delivery with automated testing and rollouts.', title: 'CI/CD Pipelines', tagline: 'Ship quickly, safely.', about: 'We set up pipelines with quality gates, env promotion, and rollback safety.', features: ['Build/test/deploy automation','Preview envs','Release strategies','Quality gates'], useCases: ['Product teams','Data & ML teams','Platform'], industries: ['SaaS','E‑commerce','AI'], process: ['Assess','Pipeline design','Implement','Measure'], tools: ['GitHub Actions','GitLab CI','ArgoCD'], whyUs: ['Developer happiness','Release confidence'], cta: 'Design my pipeline' },

  'system-integration': { seoTitle: 'System Integration', metaDescription: 'Connect CRMs/ERPs and bespoke systems for unified workflows.', title: 'System Integration', tagline: 'Everything works together.', about: 'We integrate platforms with robust error handling and observability.', features: ['Connector development','Mapping & transforms','Retries & DLQs','Monitoring & alerts'], useCases: ['Order sync','Finance handoffs','Ops automation'], industries: ['Retail','Manufacturing','Services'], process: ['Map','Build','Validate','Operate'], tools: ['Workato','Make','Custom services'], whyUs: ['Stable data flow','Lower swivel-chair ops'], cta: 'Plan my integrations' },
  'microservices-platform': { seoTitle: 'Microservices Platform', metaDescription: 'Service templates, contracts, and platform tooling for teams.', title: 'Microservices Platform', tagline: 'Velocity without chaos.', about: 'We set up service templates, platform contracts, and paved roads so teams move quickly.', features: ['Templates & scaffolding','Contracts & discovery','Security controls','Release pipelines'], useCases: ['Domain-driven systems','Team onboarding','Modernization'], industries: ['SaaS','FinTech','Logistics'], process: ['Platform blueprint','Paved roads','Pilot teams','Rollout'], tools: ['Backstage','OpenAPI','K8s','GitHub Actions'], whyUs: ['Reduce cognitive load','Consistent quality'], cta: 'Define my platform' },
  'qa-test-automation': { seoTitle: 'QA & Test Automation', metaDescription: 'Reliable CI testing with UI/API/e2e suites and quality gates.', title: 'QA & Test Automation', tagline: 'Ship faster with confidence.', about: 'We implement pragmatic automated testing that fits delivery speed and risk.', features: ['Unit/integration/API/e2e','Data seeding','Quality gates in CI','Reports & ownership'], useCases: ['Release safety','Regressions prevention','Compliance'], industries: ['SaaS','Finance','Healthcare'], process: ['Risk profile','Test strategy','Automation','Dashboards'], tools: ['Jest','Playwright','Cypress','Postman'], whyUs: ['Balance coverage & speed','Actionable reporting'], cta: 'Audit my test strategy' },

  'architecture-review': { seoTitle: 'Architecture Review', metaDescription: 'Independent review of scalability, security, and cost.', title: 'Architecture Review', tagline: 'Clarity before investment.', about: 'We review systems against goals and recommend a realistic path forward.', features: ['Workload analysis','Bottlenecks & risks','Right-sizing & roadmap'], useCases: ['Modernization','Pre‑migration','Scaling'], industries: ['SaaS','Retail','FinTech'], process: ['Discovery','Deep dive','Findings','Roadmap'], tools: ['ADR docs','Diagrams','Benchmarks'], whyUs: ['Hard truths + practical steps','Operator mindset'], cta: 'Request a review' },
  'security-compliance-audit': { seoTitle: 'Security & Compliance Audit', metaDescription: 'Security baselines, reviews, and compliance prep.', title: 'Security & Compliance Audit', tagline: 'Reduce risk without slowing teams.', about: 'We set baselines and processes to keep teams secure and compliant.', features: ['Threat modeling','Least-privilege access','Data protection','Compliance checklists'], useCases: ['SOC2 readiness','PII handling','Vendor audits'], industries: ['FinTech','Health','Public'], process: ['Assess','Harden','Policies','Training'], tools: ['CIS Benchmarks','OpenSCAP','Secret scanners'], whyUs: ['Practical controls','Documentation included'], cta: 'Plan my audit' },
  'tech-roadmapping': { seoTitle: 'Tech Roadmapping', metaDescription: 'Pragmatic multi-quarter plans aligned to business value.', title: 'Tech Roadmapping', tagline: 'Do the right things in the right order.', about: 'We co-create a clear, prioritized delivery plan across teams and capabilities.', features: ['Outcome-based planning','Capacity mapping','Dependencies & risks'], useCases: ['Scale-ups','Turnarounds','Product lines'], industries: ['SaaS','Retail','Manufacturing'], process: ['Discovery','Prioritization','Plan & KPIs'], tools: ['Notion','Miro','Jira'], whyUs: ['Board-friendly plan','Realistic staffing'], cta: 'Create my roadmap' },

  'corporate-ai-training': { seoTitle: 'Corporate AI Training', metaDescription: 'Hands-on training programs tailored to roles and domains.', title: 'Corporate AI Training', tagline: 'From awareness to mastery.', about: 'We deliver role-based curricula with labs and capstones to drive adoption.', features: ['Role-based tracks','Hands-on labs','Tooling of your stack','Certificates'], useCases: ['Data upskilling','Product teams','Leadership enablement'], industries: ['Finance','Retail','Energy','SaaS'], process: ['Baseline','Curriculum','Delivery','Projects'], tools: ['Python','Power BI','Cloud AI'], whyUs: ['Practical, vendor-neutral','Measured outcomes'], cta: 'Design my training plan' },
  'internship-programs': { seoTitle: 'Internship Programs', metaDescription: 'Mentored internships with real projects and reviews.', title: 'Internship Programs', tagline: 'Experience that counts.', about: 'We run selective internships with mentorship, reviews, and resume-ready outcomes.', features: ['Mentor pairing','Weekly reviews','Capstone deliverables'], useCases: ['University cohorts','Early career','Returnships'], industries: ['EdTech','SaaS','Analytics'], process: ['Select','Mentor','Build','Showcase'], tools: ['GitHub','Notion','Cloud'], whyUs: ['Portfolio outcomes','High signal'], cta: 'Host or join a cohort' },
  'capstone-projects': { seoTitle: 'Capstone Projects', metaDescription: 'Industry-grade capstones to demonstrate capability.', title: 'Capstone Projects', tagline: 'Proof of skill, not just theory.', about: 'We scope capstones that resemble real work, with reviews and feedback loops.', features: ['Business framing','Data/UX constraints','Milestone reviews'], useCases: ['Hiring funnels','Training outcomes','Portfolio'], industries: ['SaaS','Analytics','AI'], process: ['Scope','Build','Review','Publish'], tools: ['Python','BI','Cloud'], whyUs: ['Signal > certificates','Reusable assets'], cta: 'Pick a capstone' }
};

function StandaloneServicePage() {
  const navigate = useContext(NavContext);
  const slug = useContext(ActiveServicePageContext) as ServiceSlug | null;
  const key: ServiceSlug = (slug && (Object.keys(SERVICE_PAGES) as ServiceSlug[]).includes(slug as ServiceSlug) ? slug as ServiceSlug : 'ai-consulting');
  const data = SERVICE_PAGES[key];

  useEffect(()=>{
    if (typeof document !== 'undefined') {
      document.title = data.seoTitle;
      const m = document.querySelector('meta[name="description"]') || (()=>{ const x = document.createElement('meta'); x.setAttribute('name','description'); document.head.appendChild(x); return x; })();
      m.setAttribute('content', data.metaDescription);
    }
  }, [key]);

  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-gradient-to-b from-white to-blue-50/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <button onClick={()=>navigate('services')} className="text-sm font-semibold text-[#1e90ff] hover:underline">← Back to Services</button>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{data.title}</h1>
          <p className="mt-2 max-w-3xl text-[#0a2540]/70">{data.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10">
        <div>
          <h2 className="text-xl font-semibold">About the Service</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-5 shadow-sm relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#1e90ff]/10 text-[#1e90ff]"><Brain className="h-4 w-4"/></span>
                <div className="text-sm font-semibold">Overview</div>
              </div>
              <p className="mt-1 text-[#0a2540]/80">{data.about}</p>
            </div>
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-5 shadow-sm relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#1e90ff]/10 text-[#1e90ff]"><Sparkles className="h-4 w-4"/></span>
                <div className="text-sm font-semibold">Where it helps</div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {data.useCases.slice(0,6).map((x,i)=> (
                  <span key={i} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-5 shadow-sm relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#1e90ff]/10 text-[#1e90ff]"><BarChart3 className="h-4 w-4"/></span>
                <div className="text-sm font-semibold">Business outcomes</div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {data.whyUs.slice(0,6).map((x,i)=> (
                  <span key={i} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Settings2 className="h-4 w-4"/></span>
              <h3 className="text-base font-semibold">Key Features</h3>
            </div>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">{data.features.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
          </div>
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Sparkles className="h-4 w-4"/></span>
              <h3 className="text-base font-semibold">Use Cases</h3>
            </div>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">{data.useCases.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
          </div>
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Cpu className="h-4 w-4"/></span>
              <h3 className="text-base font-semibold">Industries We Serve</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">{data.industries.map(x=> (<span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>))}</div>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Rocket className="h-4 w-4"/></span>
              <h3 className="text-base font-semibold">Our Approach</h3>
            </div>
            <ol className="mt-3 list-decimal pl-5 space-y-1 text-sm text-[#0a2540]/80">{data.process.map((x,i)=>(<li key={i}>{x}</li>))}</ol>
          </div>
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Database className="h-4 w-4"/></span>
              <h3 className="text-base font-semibold">Tools & Technologies</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">{data.tools.map(x=> (<span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>))}</div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1e90ff]" />
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Shield className="h-4 w-4"/></span>
            <h3 className="text-base font-semibold">Why Choose Technocolabs</h3>
          </div>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">{data.whyUs.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
        </div>
        <div className="rounded-2xl bg-[#0a2540] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">{data.cta}</div>
            <div className="text-white/80">We’ll review your goals and recommend a path to impact.</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>navigate('contact')} className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white">Contact Us</button>
            <button onClick={()=>navigate('careers')} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold">See Team Expertise</button>
          </div>
        </div>
        {data.imageHint && (
          <div className="text-xs text-[#0a2540]/60">Image suggestion: {data.imageHint}</div>
        )}
      </section>
    </div>
  );
}

// --------------------------- SERVICES (Premium) ----------------------------
function ServicesPage() {
  const navigate = useContext(NavContext);
  const openDetail = useContext(ServiceDetailContext);
  const openServicePage = useContext(ServicePageSetterContext);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES_DATA.filter((s) => {
      const matchesTag = activeTag === "All" || s.tags.includes(activeTag);
      const matchesQuery = !q || s.title.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q) || s.bullets.some((b) => b.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [query, activeTag]);

  return (
    <div className="bg-[#0a2540] text-white" id="services">
      {/* Hero */}
      <section className="relative overflow-clip">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#1e90ff]/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" className="text-4xl font-bold tracking-tight sm:text-5xl">Services</motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" className="mt-3 max-w-3xl text-white/80">From discovery to deployment, Technocolabs delivers AI, Data, Cloud, and Software solutions that move the needle.</motion.p>
          {/* Tools */}
          <div className="mt-8 grid gap-4">
            <div className="flex items-center gap-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services, e.g. 'LLM', 'dashboard', 'Terraform'" className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#1e90ff]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button key={t} onClick={() => setActiveTag(t)} className={`rounded-full border px-3 py-1.5 text-xs transition ${activeTag === t ? 'border-[#1e90ff] bg-[#1e90ff] text-white' : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="relative bg-[#081a2f] text-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-2xl sm:text-3xl font-semibold tracking-tight">Our Mission is to Bring the <span className="text-[#1e90ff]">Power of AI</span> to Every Business</motion.h2>
          <div className="mt-3">
            <button onClick={()=>openServicePage('ai-consulting')} className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-4 py-2 text-sm font-semibold text-white">Browse Full AI Services Catalog</button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((s) => (
              <motion.button key={s.id} onClick={() => openDetail(s.id)} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="group text-left rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm hover:shadow-lg">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><s.icon className="h-6 w-6" /></div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/80">{s.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.bullets.slice(0,3).map((b, i) => (
                    <span key={i} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px]">{b}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">AI Capabilities We Deliver</h2>
          <p className="mt-3 max-w-3xl mx-auto text-center text-[#0a2540]/70">From strategy to production — we cover the full spectrum of AI/ML engineering.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#0a2540]/10 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Sparkles className="h-5 w-5"/></div>
              <div className="mt-3 font-semibold">Generative AI</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#0a2540]/80">
                {['RAG','LLM fine‑tuning','Agents','Prompt engineering','Evaluation'].map(x=> <span key={x} className="rounded-full bg-[#0a2540]/5 px-2.5 py-1">{x}</span>)}
              </div>
            </div>
            <div className="rounded-2xl border border-[#0a2540]/10 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Brain className="h-5 w-5"/></div>
              <div className="mt-3 font-semibold">Machine Learning</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#0a2540]/80">
                {['Forecasting','Recommenders','Anomaly detection','Optimization','AutoML'].map(x=> <span key={x} className="rounded-full bg-[#0a2540]/5 px-2.5 py-1">{x}</span>)}
              </div>
            </div>
            <div className="rounded-2xl border border-[#0a2540]/10 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Smartphone className="h-5 w-5"/></div>
              <div className="mt-3 font-semibold">Computer Vision</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#0a2540]/80">
                {['OCR','Object detection','Segmentation','Visual search','Face/activity'].map(x=> <span key={x} className="rounded-full bg-[#0a2540]/5 px-2.5 py-1">{x}</span>)}
              </div>
            </div>
            <div className="rounded-2xl border border-[#0a2540]/10 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><PieChart className="h-5 w-5"/></div>
              <div className="mt-3 font-semibold">NLP</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#0a2540]/80">
                {['Summarization','Classification','NER','Speech‑to‑Text','Translation'].map(x=> <span key={x} className="rounded-full bg-[#0a2540]/5 px-2.5 py-1">{x}</span>)}
              </div>
            </div>
            <div className="rounded-2xl border border-[#0a2540]/10 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Cpu className="h-5 w-5"/></div>
              <div className="mt-3 font-semibold">MLOps & Deployment</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#0a2540]/80">
                {['CI/CD','Monitoring','Feature stores','A/B rollout','Batch & realtime'].map(x=> <span key={x} className="rounded-full bg-[#0a2540]/5 px-2.5 py-1">{x}</span>)}
              </div>
            </div>
            <div className="rounded-2xl border border-[#0a2540]/10 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><Cloud className="h-5 w-5"/></div>
              <div className="mt-3 font-semibold">Cloud AI</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#0a2540]/80">
                {['AWS','GCP','Azure','Data lakes','Auto‑scaling inference'].map(x=> <span key={x} className="rounded-full bg-[#0a2540]/5 px-2.5 py-1">{x}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="bg-[#081a2f] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">How We Deliver</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ['Discovery', 'Goals, scope, success metrics'],
              ['Data Eng', 'Pipelines, quality, governance'],
              ['Modeling', 'Baseline → SOTA experiments'],
              ['Validation', 'Offline + business evaluation'],
              ['Deployment', 'Realtime & batch, observability'],
              ['Monitoring', 'Drift, alerts, iteration']
            ].map(([t,s],i)=> (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm opacity-80">Step {i+1}</div>
                <div className="mt-1 font-semibold">{t}</div>
                <div className="mt-1 text-sm text-white/80">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Work With (icon version) */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Industries We Work With</h2>
          <p className="mt-3 max-w-4xl mx-auto text-center text-[#0a2540]/70">Since 2019, we’ve been working with businesses from various industries, helping them adopt AI into their businesses.</p>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Coins className="h-8 w-8"/></div>
              <div className="mt-3 font-semibold">Finance</div>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Truck className="h-8 w-8"/></div>
              <div className="mt-3 font-semibold">Logistics & Transportation</div>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Factory className="h-8 w-8"/></div>
              <div className="mt-3 font-semibold">Manufacturing & Automotive</div>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><ShoppingBag className="h-8 w-8"/></div>
              <div className="mt-3 font-semibold">E‑commerce</div>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><HeartPulse className="h-8 w-8"/></div>
              <div className="mt-3 font-semibold">Pharma & Healthcare</div>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Megaphone className="h-8 w-8"/></div>
              <div className="mt-3 font-semibold">Marketing</div>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Gamepad2 className="h-8 w-8"/></div>
              <div className="mt-3 font-semibold">Gaming & Entertainment</div>
            </div>
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><ShoppingCart className="h-8 w-8"/></div>
              <div className="mt-3 font-semibold">Retail</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="bg-[#081a2f] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Success Metrics We Deliver</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[['95%+','model accuracy'],['60%','lower cloud cost'],['99.5%','uptime'],['10x','faster insights']].map(([n,l])=> (
              <div key={n} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-3xl font-semibold">{n}</div>
                <div className="mt-1 text-white/80">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for Services */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Why Choose Technocolabs</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Faster time to production', <Rocket key="r" className="h-5 w-5"/>],
              ['Realtime MLOps & monitoring', <Cpu key="c" className="h-5 w-5"/>],
              ['Certified engineering teams', <BadgeCheck key="b" className="h-5 w-5"/>],
              ['NDA & full IP rights', <Handshake key="h" className="h-5 w-5"/>],
              ['Dedicated delivery manager', <BarChart3 key="m" className="h-5 w-5"/>],
              ['24/7 SLA support', <Phone key="p" className="h-5 w-5"/>]
            ].map(([t,icon]: any)=> (
              <div key={t as string} className="rounded-2xl border border-[#0a2540]/10 p-6 flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]">{icon as React.ReactNode}</div>
                <div className="font-semibold">{t as string}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-[#081a2f] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Tech Stack</h2>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {['OpenAI','HuggingFace','LangChain','LlamaIndex','PyTorch','TensorFlow','scikit‑learn','Airflow','MLflow','Docker','Kubernetes','Ray','AWS','GCP','Azure','PostgreSQL','Snowflake'].map(x=> (
              <span key={x} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">{x}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Selected Case Studies</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {t:'Retail Demand Forecasting', p:'High stockouts across stores', s:'Built hierarchical forecasting with feature store', r:'↓ stockouts 32%, ↑ revenue 9%'},
              {t:'Support Chat with RAG', p:'Slow knowledge discovery for agents', s:'RAG over SOPs + product docs', r:'↓ handling time 40%, ↑ CSAT 18%'},
              {t:'Vision Quality Inspection', p:'Manual defect detection', s:'Realtime CV inference on edge', r:'↓ inspection time 55%, ↑ accuracy 22%'}
            ].map((c)=> (
              <div key={c.t} className="rounded-2xl border border-[#0a2540]/10 p-6">
                <div className="font-semibold">{c.t}</div>
                <div className="mt-2 text-sm"><span className="font-medium">Problem:</span> {c.p}</div>
                <div className="mt-1 text-sm"><span className="font-medium">Solution:</span> {c.s}</div>
                <div className="mt-1 text-sm"><span className="font-medium">Result:</span> {c.r}</div>
              </div>
            ))}
          </div>

          {/* CTA Strip */}
          <div className="mt-10 rounded-2xl bg-[#0a2540] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Have a project in mind?</div>
              <div className="text-white/80">Book a free AI consultation or talk to an engineer now.</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white shadow-sm">Book Consultation <ArrowRight className="h-4 w-4"/></button>
              <a href="https://wa.me/918319291391?text=Hello%20I%20am%20interested%20in%20your%20services." className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold">Talk on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --------------------------- SERVICE DETAIL (Premium) ----------------------
function ServiceDetailPage() {
  const openServicePage = useContext(ServicePageSetterContext);
  const navigate = useContext(NavContext);
  const openDetail = useContext(ServiceDetailContext);
  const active = useContext(ActiveServiceContext);
  const idx = SERVICES_DATA.findIndex((x) => x.id === active);
  const service = idx >= 0 ? SERVICES_DATA[idx] : SERVICES_DATA[0];
  const prev = idx > 0 ? SERVICES_DATA[idx - 1] : null;
  const next = idx >= 0 && idx < SERVICES_DATA.length - 1 ? SERVICES_DATA[idx + 1] : null;

  return (
    <div className="bg-white text-[#0a2540]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-blue-50/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <button onClick={() => navigate('services')} className="text-sm font-semibold text-[#1e90ff] hover:underline">← Back to Services</button>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{service.title}</h1>
          <p className="mt-2 max-w-3xl text-[#0a2540]/70">{service.overview}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.tags.map((t) => (
              <span key={t} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5 text-xs font-medium">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Category sub-services (cards) */}
            {service.id === 'ai' && (
              <div className="mb-8 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold">AI & Data Science — Sub-services</h3>
                <p className="mt-1 text-sm text-[#0a2540]/70">Explore specialized offerings under AI & Data Science. Click to view full pages.</p>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[{label:'AI Consulting', slug:'ai-consulting', icon: Brain},{label:'AI Product Development', slug:'generative-ai', icon: Sparkles},{label:'AI Software Development', slug:'ai-integration', icon: Settings2},{label:'Data Science Services', slug:'predictive-analytics', icon: BarChart3},{label:'Machine Learning Consulting', slug:'machine-learning', icon: Brain},{label:'Customer Experience Consulting', slug:'marketing-ai', icon: Megaphone}].map(item => (
                    <li key={item.label}>
                      <button onClick={()=>openServicePage(item.slug)} className="group w-full text-left rounded-2xl border border-[#0a2540]/10 bg-white p-4 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><item.icon className="h-5 w-5"/></span>
                          <span className="text-sm font-medium text-[#0a2540]">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.id === 'apps' && (
              <div className="mb-8 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold">Web & Mobile — Sub-services</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[{label:'Frontend Engineering', slug:'frontend-engineering', icon: Settings2},{label:'Backend APIs', slug:'backend-apis', icon: Database},{label:'Mobile App Development', slug:'mobile-apps', icon: Smartphone},{label:'UI/UX Engineering', slug:'ui-ux-engineering', icon: Sparkles},{label:'Full‑Stack Development', slug:'fullstack-dev', icon: Cpu}].map(item => (
                    <li key={item.label}>
                      <button onClick={()=>openServicePage(item.slug)} className="group w-full text-left rounded-2xl border border-[#0a2540]/10 bg-white p-4 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><item.icon className="h-5 w-5"/></span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.id === 'bi' && (
              <div className="mb-8 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold">BI & Analytics — Sub-services</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[{label:'Power BI Dashboards', slug:'power-bi-dashboards', icon: BarChart3},{label:'Tableau Analytics', slug:'tableau-analytics', icon: PieChart},{label:'Data Governance & KPI Design', slug:'data-governance-kpis', icon: FileText},{label:'Self‑Serve BI Enablement', slug:'self-serve-bi', icon: PieChart}].map(item => (
                    <li key={item.label}>
                      <button onClick={()=>openServicePage(item.slug)} className="group w-full text-left rounded-2xl border border-[#0a2540]/10 bg-white p-4 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><item.icon className="h-5 w-5"/></span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.id === 'deploy' && (
              <div className="mb-8 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold">ML Deployment — Sub-services</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[{label:'Real‑Time Inference', slug:'realtime-inference', icon: Rocket},{label:'A/B Testing & Experimentation', slug:'ab-testing-platform', icon: BarChart3},{label:'Feature Store Engineering', slug:'feature-store-engineering', icon: Database}].map(item => (
                    <li key={item.label}>
                      <button onClick={()=>openServicePage(item.slug)} className="group w-full text-left rounded-2xl border border-[#0a2540]/10 bg-white p-4 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><item.icon className="h-5 w-5"/></span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.id === 'cloud' && (
              <div className="mb-8 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold">Cloud & DevOps — Sub-services</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[{label:'Infrastructure as Code', slug:'infrastructure-as-code', icon: Cloud},{label:'Cloud Cost Optimization', slug:'cloud-cost-optimization', icon: Coins},{label:'Observability & SRE', slug:'observability-and-sre', icon: Shield},{label:'CI/CD Pipelines', slug:'ci-cd-pipelines', icon: Settings2}].map(item => (
                    <li key={item.label}>
                      <button onClick={()=>openServicePage(item.slug)} className="group w-full text-left rounded-2xl border border-[#0a2540]/10 bg-white p-4 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><item.icon className="h-5 w-5"/></span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.id === 'custom' && (
              <div className="mb-8 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold">Custom Software — Sub-services</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[{label:'System Integration', slug:'system-integration', icon: Settings2},{label:'Microservices Platform', slug:'microservices-platform', icon: Cpu},{label:'QA & Test Automation', slug:'qa-test-automation', icon: Shield}].map(item => (
                    <li key={item.label}>
                      <button onClick={()=>openServicePage(item.slug)} className="group w-full text-left rounded-2xl border border-[#0a2540]/10 bg-white p-4 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><item.icon className="h-5 w-5"/></span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.id === 'dx' && (
              <div className="mb-8 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold">Tech Consulting — Sub-services</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[{label:'Architecture Review', slug:'architecture-review', icon: FileText},{label:'Security & Compliance Audit', slug:'security-compliance-audit', icon: Shield},{label:'Tech Roadmapping', slug:'tech-roadmapping', icon: Brain}].map(item => (
                    <li key={item.label}>
                      <button onClick={()=>openServicePage(item.slug)} className="group w-full text-left rounded-2xl border border-[#0a2540]/10 bg-white p-4 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><item.icon className="h-5 w-5"/></span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.id === 'training' && (
              <div className="mb-8 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold">Training & Internships — Sub-services</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[{label:'Corporate AI Training', slug:'corporate-ai-training', icon: GraduationCap},{label:'Internship Programs', slug:'internship-programs', icon: GraduationCap},{label:'Capstone Projects', slug:'capstone-projects', icon: FileText}].map(item => (
                    <li key={item.label}>
                      <button onClick={()=>openServicePage(item.slug)} className="group w-full text-left rounded-2xl border border-[#0a2540]/10 bg-white p-4 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><item.icon className="h-5 w-5"/></span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            <h2 className="text-xl font-semibold">Benefits</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {service.benefits.map((b) => (
                <li key={b} className="rounded-xl border border-[#0a2540]/10 bg-white p-4">{b}</li>
              ))}
            </ul>

            {/* Tech */}
            <h2 className="mt-8 text-xl font-semibold">Tech</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {service.tech.map((t) => (
                <span key={t} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5 text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-3">
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">Ready to start?</div>
              <p className="mt-1 text-sm text-[#0a2540]/70">Talk to our engineers about {service.title} for your use case.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => navigate('contact')} className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-4 py-2 text-sm font-semibold text-white">Contact Us <ArrowRight className="h-4 w-4" /></button>
                <button onClick={() => navigate('careers')} className="inline-flex items-center gap-2 rounded-xl border border-[#0a2540]/15 px-4 py-2 text-sm font-semibold">Internships</button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Next / Previous services */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <button disabled={!prev} onClick={() => prev && openDetail(prev.id)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${prev ? 'border-[#0a2540]/15 hover:bg-[#0a2540]/5' : 'border-[#0a2540]/10 opacity-50 cursor-not-allowed'}`}>← {prev ? prev.title : 'No previous'}</button>
            <button onClick={() => navigate('services')} className="text-sm font-semibold text-[#1e90ff] hover:underline">Back to Services</button>
            <button disabled={!next} onClick={() => next && openDetail(next.id)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${next ? 'border-[#0a2540]/15 hover:bg-[#0a2540]/5' : 'border-[#0a2540]/10 opacity-50 cursor-not-allowed'}`}>{next ? next.title : 'No next'} →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
// ---------- ADD THESE IMPORTS AT THE TOP OF App.tsx ----------

// ---------- CAREERS PAGE (with Internships, Open Roles, Full-Time, Spotlight) ----------
function CareersPage() {
  const navigate = useContext(NavContext);
  const setApplyRoleCtx = useContext(ApplyRoleSetterContext);

  // restore last sub-tab (default: internships). Guard window for SSR.
  const saved =
    typeof window !== "undefined"
      ? window.localStorage.getItem("careers-subtab")
      : null;

  const [sub, setSub] = useState<'internships' | 'openroles' | 'fulltime'>(
    saved === "openroles" ? "openroles" : "internships"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("careers-subtab", sub);
    }
  }, [sub]);

  // ------- Types -------
  type RoleId =
    | 'genai' | 'py' | 'dl' | 'cv' | 'ba'
    | 'ds' | 'ml' | 'web' | 'da' | 'bi'
    | 'ai' | 'se' | 'cyber';

  type Role = {
    id: RoleId;
    title: string;
    domain: string;
    duration: string;
    mode: string;
    jd: string;
    responsibilities: string[];
    requirements: string[];
  };

  // ------- Form links ( "#" = closed -> Applications Closed ) -------
  const APPLY_FORM_BY_ID: Record<RoleId, string> = {
    genai: "#", // still closed
    py: "#",
    dl: "#",
    cv: "/apply-form/cv",
    ba: "#",
    ds: "/apply-form/ds",
    ml: "/apply-form/ml",
    web: "/apply-form/web",
    da: "/apply-form/da",
    bi: "/apply-form/bi",
    ai: "/apply-form/ai",
    se: "#",
    cyber: "/apply-form/cyber",
  };

  // ------- Roles -------
  const ROLES: Role[] = [
    { id: 'genai', title: 'Generative AI Engineer Intern', domain: 'Generative AI', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Work on LLM-powered features: prompt engineering, embeddings, RAG pipelines, and evaluation. You will prototype, measure, and iterate with mentors to ship features into real apps.', responsibilities: ['Build and evaluate LLM pipelines (chat, Q&A, summarization)','Implement retrieval with vector stores and embeddings','Design/evaluate prompts; collect feedback and improve outputs','Integrate models with web backends/APIs','Document experiments and results'], requirements: ['Strong Python; basics of JS/TypeScript a plus','NLP/LLM concepts (tokenization, embeddings, context windows)','Hands-on with HuggingFace/LangChain/LlamaIndex (any)','Familiar with OpenAI/transformer models; basic CI/Git','Good communication and curiosity to experiment'] },
    { id: 'py', title: 'Python Developer Intern', domain: 'Software Development', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Contribute to backend services, APIs, automation scripts, and internal tools built with Python. Focus on clean code, testing, and shipping maintainable features.', responsibilities: ['Build REST APIs and background jobs','Write reusable, tested modules and CLI tools','Work with databases (SQL/ORM) and caching','Instrument logging and basic monitoring','Participate in code reviews and sprint rituals'], requirements: ['Solid Python fundamentals (typing, packaging, venv)','Experience with FastAPI/Flask or Django (any one)','SQL knowledge (Postgres/MySQL) and Git','Basics of Docker and HTTP/REST','Clear communication and documentation'] },
    { id: 'dl', title: 'Deep Learning Engineer Intern', domain: 'Machine Learning', duration: '8–12 weeks', mode: 'Remote', jd: 'Prototype and train deep learning models for CV/NLP tasks. You will run experiments, tune models, and profile/optimize inference.', responsibilities: ['Prepare datasets; implement training loops and evaluation','Experiment with CNNs/Transformers; track metrics','Optimize models (quantization/distillation) for deployment','Create clear experiment reports and dashboards','Collaborate with MLOps for reproducibility'], requirements: ['Python + PyTorch or TensorFlow','Linear algebra, optimization, and DL basics','GPU workflows (Colab/Kaggle/Local CUDA) basics','Version control with Git; clean coding habits','Good math/analysis and curiosity'] },
    { id: 'cv', title: 'Computer Vision Engineer Intern', domain: 'Computer Vision', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Build CV pipelines: detection, segmentation, OCR, and visual search. You will work with datasets, augmentations, training, and deployment.', responsibilities: ['Collect/clean/augment image/video datasets','Train and evaluate models (YOLO/Detectron/Segmentation)','Deploy inference services and measure accuracy/latency','Write reusable preprocessing and visualization tools','Document results and share learnings with the team'], requirements: ['Python; PyTorch/TensorFlow; OpenCV basics','Understanding of CNNs and metrics (mAP/IoU)','Experience with one CV framework (e.g., YOLO family)','Basics of Docker; comfort with Linux/CLI','Strong problem-solving and communication'] },
    { id: 'ba', title: 'Business Analyst Intern', domain: 'Analytics', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Translate business questions into analysis plans, build dashboards, and communicate insights that drive decisions.', responsibilities: ['Gather requirements and define KPIs','Explore and clean data; build analyses and reports','Create dashboards (Power BI/Tableau) for stakeholders','Write concise docs: findings, risks, recommendations','Collaborate with engineering to instrument events'], requirements: ['SQL proficiency; spreadsheet skills','Experience with Power BI/Tableau/Looker (any)','Comfort with basic statistics and A/B testing concepts','Clear written/verbal communication','Attention to detail and business empathy'] },
    { id: 'ds', title: 'Data Science Intern', domain: 'Data Science', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Explore data, build features, and deliver predictive insights with robust evaluation and reporting.', responsibilities: ['EDA and feature engineering','Train/evaluate baseline models','Visualize and communicate insights','Write clean notebooks and reports','Collaborate with cross-functional teams'], requirements: ['Python & pandas/scikit-learn','Statistics & ML basics','Data visualization (Matplotlib/Plotly)','SQL fundamentals','Git & documentation'] },
    { id: 'ml', title: 'Machine Learning Intern', domain: 'Machine Learning', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Implement ML pipelines from data prep to model evaluation and iterate to improve performance.', responsibilities: ['Feature pipelines & model training','Hyperparameter tuning','Model evaluation and reporting','Collaborate on deployment readiness','Maintain experiment logs'], requirements: ['Python, scikit-learn','Basic ML theory','Version control (Git)','Jupyter/Notebooks','Clear communication'] },
    { id: 'web', title: 'Web Development Intern', domain: 'Web Development', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Build responsive frontends and simple backends using modern JavaScript frameworks and REST APIs.', responsibilities: ['Implement UI from designs','Connect to REST APIs','Write reusable components','Fix bugs and improve UX','Participate in reviews'], requirements: ['HTML/CSS/JavaScript','React basics','Git & npm','Understanding of HTTP/REST','Attention to UI detail'] },
    { id: 'da', title: 'Data Analytics Intern', domain: 'Analytics', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Turn raw data into insight with SQL, dashboards, and clear narratives for stakeholders.', responsibilities: ['Clean/transform datasets','Create reports & dashboards','Define and track KPIs','Present findings to teams','Document data sources'], requirements: ['SQL proficiency','Power BI/Tableau','Spreadsheet skills','Basic statistics','Communication'] },
    { id: 'bi', title: 'Business Intelligence Intern', domain: 'BI & Reporting', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Build and maintain BI models and dashboards for self-serve analytics and decision-making.', responsibilities: ['Model data for BI','Build reports/dashboards','Ensure data quality','Optimize refresh & performance','Write documentation'], requirements: ['Power BI/Tableau/Looker (any)','SQL & data modeling','DAX/LookML basics (any)','Versioning & governance','Stakeholder comms'] },
    { id: 'ai', title: 'Artificial Intelligence Intern', domain: 'AI', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Research and prototype AI solutions across NLP/CV/recommendation tasks with mentorship.', responsibilities: ['Literature review & baselines','Train & evaluate models','Data preparation and labeling','Write experiment reports','Share demos with team'], requirements: ['Python + ML libraries','NLP/CV basics','Math for ML (probability)','Git & notebooks','Curiosity to learn'] },
    { id: 'se', title: 'Software Engineering Intern', domain: 'Software Engineering', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Assist with backend/frontend tasks, tests, CI and documentation on production projects.', responsibilities: ['Implement features/bugfixes','Write unit/integration tests','Participate in code reviews','Improve app performance','Document changes clearly'], requirements: ['One backend or frontend stack','Git & testing basics','Clean code habits','Understanding of CI/CD','Team communication'] },
    { id: 'cyber', title: 'CyberSecurity Engineer Intern', domain: 'Security', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Support security reviews, vulnerability scanning, and secure-by-design practices.', responsibilities: ['Run vulnerability scans','Assist in threat modeling','Fix/track security issues','Document security policies','Raise security awareness'], requirements: ['Security fundamentals (OWASP)','Scripting (Python/JS) basics','Linux/Networking basics','Understanding of auth/identity','Attention to detail'] },
  ];

  return (
    <div className="bg-[#0a2540] text-white">
      {/* Hero + Sub-tabs */}
      <section className="relative overflow-clip">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Careers</h1>

          {/* Tabs + Spotlight (scrollable on mobile) */}
          <div className="mt-6 inline-flex rounded-xl bg-white/10 p-1 max-w-full overflow-x-auto no-scrollbar">
            <div className="flex gap-1">
              <button
                onClick={() => setSub('internships')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                  sub === 'internships' ? 'bg-white text-[#0a2540]' : 'text-white hover:bg-white/10'
                }`}
              >
                Internships
              </button>

              <button
                onClick={() => setSub('openroles')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                  sub === 'openroles' ? 'bg-white text-[#0a2540]' : 'text-white hover:bg-white/10'
                }`}
              >
                Open Roles
              </button>

              <button
                onClick={() => setSub('fulltime')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                  sub === 'fulltime' ? 'bg-white text-[#0a2540]' : 'text-white hover:bg-white/10'
                }`}
              >
                Full-Time (Coming Soon)
              </button>

              {/* ⭐ Intern Spotlight – navigates to standalone page */}
              <button
                onClick={() => navigate('spotlight')}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white hover:bg-white/10"
                title="See standout intern projects and profiles"
              >
                ⭐ Intern Spotlight
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {sub === 'internships' && (
            <div className="rounded-2xl overflow-hidden border border-[#0a2540]/10">
              <InternshipShowcaseInline />
            </div>
          )}

          {sub === 'openroles' && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Open Internship Roles</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {ROLES.map((r) => (
                  <div key={r.id} id={`intern-${r.id}`} className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg">
                    <div className="text-sm font-semibold text-[#1e90ff]">{r.domain}</div>
                    <h3 className="mt-1 text-lg font-semibold">{r.title}</h3>
                    <p className="mt-2 text-sm text-[#0a2540]/70">{r.jd}</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-sm font-semibold">Responsibilities</div>
                        <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">
                          {r.responsibilities.map((x, i) => (<li key={i}>{x}</li>))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Requirements</div>
                        <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">
                          {r.requirements.map((x, i) => (<li key={i}>{x}</li>))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="inline-flex items-center rounded-xl bg-[#0a2540]/5 px-3 py-1 text-xs font-medium">Duration: {r.duration}</span>
                      <span className="inline-flex items-center rounded-xl bg-[#0a2540]/5 px-3 py-1 text-xs font-medium">Mode: {r.mode}</span>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      {(() => {
                        const link = APPLY_FORM_BY_ID[r.id];
                        const isOpen = !!link && link.trim() !== "#";

                        if (!isOpen) {
                          return (
                            <a
                              href={`/applications-closed?role=${encodeURIComponent(r.title)}`}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                            >
                              Applications Closed
                            </a>
                          );
                        }

                        return (
                          <a
                            href={`/apply-form/${r.id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                          >
                            Apply Now
                          </a>
                        );
                      })()}

                      <button
                        onClick={() => {
                          const subject = encodeURIComponent(`Application: ${r.title}`);
                          const body = encodeURIComponent(`Hello Technocolabs Team,

I would like to apply for the ${r.title} internship.

Name:
Email:
Phone:
Country:
University:
Location/Time zone:
Portfolio/GitHub/LinkedIn:
Resume link:
Start date & availability:

About me:

Thanks,`);
                          window.location.href = `mailto:technocolabs@gmail.com?subject=${subject}&body=${body}`;
                        }}
                        className="text-sm font-medium text-[#1e90ff] hover:underline"
                      >
                        Email Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sub === 'fulltime' && (
            <div className="rounded-2xl border border-[#0a2540]/10 bg-[#f8fafc] p-8 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Full-Time Opportunities</h2>
              <p className="mt-3 text-[#0a2540]/80 max-w-2xl">
                We’ll publish full-time roles here soon. Meanwhile, share your resume at{" "}
                <a className="text-[#1e90ff] underline" href="mailto:contact@technocolabs.com">contact@technocolabs.com</a>.
              </p>
              <div className="mt-6">
                <a
                  href="mailto:contact@technocolabs.com?subject=Full-Time%20Application%20-%20Technocolabs&body=Hello%20Technocolabs%20Team,%0D%0A%0D%0APlease%20find%20my%20resume%20attached.%0D%0A%0D%0AName:%0D%0AEmail:%0D%0APhone:%0D%0ALocation:%0D%0AExperience:%0D%0AInterested%20Role:%0D%0A%0D%0AThanks!"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                >
                  Email Your Resume
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ---------- INLINE: Internship showcase (map + logos etc.) ----------
function InternshipShowcaseInline() {
  const stats = [
    ["20+", "Countries"],
    ["10000+", "Alumni"],
    ["500+", "Live Projects"],
    ["92%", "Recommend"],
  ];
  const tracks = [
    { t: "Generative AI & LLMs", s: "RAG, embeddings, prompt engineering, evals" },
    { t: "Machine Learning", s: "Feature pipelines, model tuning, MLOps basics" },
    { t: "Data Science & Analytics", s: "EDA, dashboards, BI, KPI storytelling" },
    { t: "Computer Vision", s: "Detection, OCR, segmentation, real-time inference" },
    { t: "Web Development", s: "React front-ends, APIs, auth, performance" },
    { t: "Cybersecurity", s: "VAPT, OWASP, secure coding, automation" },
    { t: "Software Engineering", s: "Clean code, tests, CI/CD, code reviews" },
  ];
  const tools = ["Python","PyTorch","TensorFlow","scikit-learn","LangChain","OpenAI APIs","HuggingFace","FastAPI","React","TypeScript","Vite","Tailwind","PostgreSQL","MongoDB","Docker","Git/GitHub","AWS","GCP","Azure","Power BI","Tableau"];
  const projects = [
    { h: "RAG Knowledge Assistant", s: "Enterprise FAQ/chat over docs using embeddings, vector DB, and evaluation harness." },
    { h: "Demand Forecasting", s: "End-to-end ML pipeline (ETL → features → model → dashboard) with MAPE tracking." },
    { h: "Real-time OCR + Search", s: "Computer vision service for document OCR and semantic search over extracted text." },
    { h: "Full-stack Issue Tracker", s: "React + API + auth + role-based access & CI; deployed to cloud." },
    { h: "Security Posture Scan", s: "OWASP checks + auto reports; secure coding fixes." },
    { h: "BI Analytics Workspace", s: "Data model + KPIs + interactive dashboards." },
  ];
  const differentiators = [
    { title: "🌍 International Industry Network", bullets: ["Mentors across USA/Europe/India/UAE","Research collaborations","10k+ alumni community","Cross-border project teams"]},
    { title: "🚀 Real Project Delivery", bullets: ["Live APIs","AI/ML in production-like flows","Cloud dashboards","End-to-end SDLC"]},
    { title: "🧑‍🏫 1:1 Mentorship", bullets: ["Personal mentor","Weekly office hours","Code reviews","Career consultations"]},
    { title: "🥇 Guaranteed Work Showcase", bullets: ["Portfolio case studies","GitHub repos","Demo videos & slides"]},
  ];
  const achievements = [
    "✅ 10000+ interns trained globally",
    "✅ Open-source AI contributions",
    "✅ Trusted by startups and SMBs",
  ];
  const companies = [
    { name: "google",     url: "https://logo.clearbit.com/google.com" },
    { name: "meta",       url: "https://logo.clearbit.com/meta.com" },
    { name: "amazon",     url: "https://logo.clearbit.com/amazon.com" },
    { name: "microsoft",  url: "https://logo.clearbit.com/microsoft.com" },
    { name: "nvidia",     url: "https://logo.clearbit.com/nvidia.com" },
    { name: "openai",     url: "https://logo.clearbit.com/openai.com" },
    { name: "salesforce", url: "https://logo.clearbit.com/salesforce.com" },
    { name: "apple",        url: "https://logo.clearbit.com/apple.com" },
    { name: "deloitte",   url: "https://logo.clearbit.com/deloitte.com" },
    { name: "accenture",  url: "https://logo.clearbit.com/accenture.com" },
    { name: "tcs",        url: "https://logo.clearbit.com/tcs.com" },
    { name: "infosys",    url: "https://logo.clearbit.com/infosys.com" },
    { name: "swiggy",    url: "https://logo.clearbit.com/swiggy.com" },
    { name: "ey",    url: "https://logo.clearbit.com/ey.com" },
    { name: "wipro",    url: "https://logo.clearbit.com/wipro.com" },
    { name: "wallmart",    url: "https://logo.clearbit.com/wallmart.com" },
    { name: "capgemini",    url: "https://logo.clearbit.com/capgemini.com" },
    { name: "flipkart",    url: "https://logo.clearbit.com/flipkart.com" },
    { name: "hdfc",    url: "https://logo.clearbit.com/hdfc.com" },
    { name: "zomato",    url: "https://logo.clearbit.com/zomato.com" },
    { name: "facebook",    url: "https://logo.clearbit.com/facebook.com" },
    { name: "spinny",    url: "https://logo.clearbit.com/spinny.com" },
    { name: "hsbc",    url: "https://logo.clearbit.com/hsbc.com" },
    { name: "twitter",    url: "https://logo.clearbit.com/twitter.com" },
  ];

  return (
    <div className="bg-white text-[#0a2540]">
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#0a2540] to-[#0d325a] text-white px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Global Internship Program</h2>
          <p className="mt-3 max-w-2xl text-white/80">Hands-on, mentor-led internships in AI, Data, and Software. Build real products and a portfolio that gets you hired.</p>
          <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
            {stats.map(([n, k]) => (
              <div key={k} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <div className="text-3xl font-bold">{n}</div>
                <div className="text-white/80">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="px-6 sm:px-8 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map(({ t, s }) => (
            <div key={t} className="rounded-2xl border border-[#0a2540]/10 p-6 hover:shadow-sm">
              <div className="font-semibold">{t}</div>
              <div className="mt-1 text-sm text-[#0a2540]/70">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="px-6 sm:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {tools.map((t) => (
            <div key={t} className="rounded-xl border border-[#0a2540]/10 px-4 py-3 text-sm text-center">{t}</div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-6 sm:px-8 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(({ h, s }) => (
            <div key={h} className="rounded-2xl border border-[#0a2540]/10 p-6">
              <div className="font-semibold">{h}</div>
              <div className="mt-1 text-sm text-[#0a2540]/70">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="px-6 sm:px-8 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2">
          {differentiators.map((d) => (
            <div key={d.title} className="rounded-2xl border border-[#0a2540]/10 p-6">
              <div className="font-semibold">{d.title}</div>
              <ul className="mt-2 text-sm text-[#0a2540]/80 list-disc pl-5 space-y-1">
                {d.bullets.map((b) => (<li key={b}>{b}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="px-6 sm:px-8 lg:px-12 py-10 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <div key={a} className="rounded-2xl border border-[#0a2540]/10 bg-white p-5 text-sm">{a}</div>
          ))}
        </div>
      </section>

      {/* WORLD MAP (blue land + white labels) */}
      <section className="px-6 sm:px-8 lg:px-12 py-12 bg-[#0a2540] text-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Global Intern Presence</h3>
          <p className="text-center mt-2 text-white/80 max-w-3xl mx-auto">Countries where interns have participated. Click/drag to pan; use buttons to zoom.</p>
          <RealWorldMapInline />
        </div>
      </section>

      {/* COMPANIES (logos via Clearbit) */}
      <section className="px-6 sm:px-8 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Where Our Alumni Work</h3>
        </div>
        <div className="max-w-6xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
          {companies.map((logo) => (
            <div key={logo.name} className="opacity-80 hover:opacity-100 transition">
              <img src={logo.url} alt={`${logo.name} logo`} className="h-10 w-auto object-contain" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- INLINE: Sky-blue land on dark-blue background ----------
function RealWorldMapInline({ dataUrl = "/intern-locations.json" }: { dataUrl?: string }) {
  const [locations, setLocations] = React.useState<Array<{country: string; lat: number; lon: number}>>([]);
  const [position, setPosition] = React.useState<{coordinates: [number, number]; zoom: number}>({ coordinates: [0, 0], zoom: 1 });
  const [isSmall, setIsSmall] = React.useState<boolean>(typeof window !== "undefined" ? window.innerWidth < 640 : false);

  // Fallback points if JSON not available
  const DEFAULT_LOCATIONS = [
    { country: "USA", lat: 38.9072, lon: -77.0369 },
    { country: "Brazil", lat: -15.8267, lon: -47.9218 },
    { country: "UK", lat: 51.5074, lon: -0.1278 },
    { country: "France", lat: 48.8566, lon: 2.3522 },
    { country: "Germany", lat: 52.52, lon: 13.405 },
    { country: "Morocco", lat: 34.0209, lon: -6.8416 },
    { country: "Algeria", lat: 36.7538, lon: 3.0588 },
    { country: "Tunisia", lat: 36.8065, lon: 10.1815 },
    { country: "Egypt", lat: 30.0444, lon: 31.2357 },
    { country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
    { country: "Qatar", lat: 25.2854, lon: 51.531 },
    { country: "UAE", lat: 24.4539, lon: 54.3773 },
    { country: "Pakistan", lat: 33.6844, lon: 73.0479 },
    { country: "India", lat: 28.6139, lon: 77.209 },
    { country: "Bangladesh", lat: 23.8103, lon: 90.4125 },
    { country: "Nepal", lat: 27.7172, lon: 85.324 },
    { country: "Sri Lanka", lat: 6.9271, lon: 79.8612 },
    { country: "Indonesia", lat: -6.2088, lon: 106.8456 },
  ];

  React.useEffect(() => {
    let cancelled = false;
    fetch(dataUrl)
      .then(async (res) => {
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) throw new Error("not json");
        return res.json();
      })
      .then((d) => {
        if (!cancelled) {
          const clean = Array.isArray(d) ? d.filter((x) => isFinite(+x.lat) && isFinite(+x.lon)) : [];
          setLocations(clean.length ? (clean as any) : DEFAULT_LOCATIONS);
        }
      })
      .catch(() => { if (!cancelled) setLocations(DEFAULT_LOCATIONS); });
    return () => { cancelled = true; };
  }, [dataUrl]);

  React.useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ABBR: Record<string, string> = { "United States": "USA", USA: "USA", "United Kingdom": "UK", UK: "UK", "United Arab Emirates": "UAE", UAE: "UAE", "Saudi Arabia": "Saudi" };
  const labelFor = (name: string) => (isSmall && ABBR[name]) ? ABBR[name] : name;

  const handleZoomIn  = () => setPosition((p) => ({ ...p, zoom: Math.min(8, p.zoom * 1.6) }));
  const handleZoomOut = () => setPosition((p) => ({ ...p, zoom: Math.max(1, p.zoom / 1.6) }));
  const handleMoveEnd = (p: any) => setPosition(p);

  // 🎨 Colors: dark section background already #0a2540.
  const LAND      = "#cfe8ff";   // sky-blue land
  const LAND_H    = "#b9dcff";   // hover
  const STROKE    = "#9dc3f9";   // borders
  const LABEL_OUT = "#0a2540";   // outline color behind white text for readability

  return (
    <div className="mt-6">
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={handleZoomIn}  className="px-3 py-1 bg-white/10 text-white rounded">Zoom In</button>
        <button onClick={handleZoomOut} className="px-3 py-1 bg-white/10 text-white rounded">Zoom Out</button>
      </div>

      {/* Map background is transparent so the section's dark blue shows through */}
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 150 }} style={{ width: "100%", height: "480px", background: "transparent" }}>
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={handleMoveEnd}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: LAND, stroke: STROKE, strokeWidth: 0.5, outline: "none" },
                    hover:   { fill: LAND_H, stroke: STROKE, strokeWidth: 0.5, outline: "none", cursor: "pointer" },
                    pressed: { fill: LAND_H, stroke: STROKE, strokeWidth: 0.5, outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {locations.map((loc) => (
            <Marker key={`${loc.country}-${loc.lat}-${loc.lon}`} coordinates={[+loc.lon, +loc.lat]}>
              <circle r={4.5} fill="#ffffff" />
              {/* white label with dark outline to pop on sky-blue */}
              <text x={8} y={4} style={{ fontSize: "11px", fontWeight: 700, fill: "#ffffff", stroke: LABEL_OUT, strokeWidth: 2, paintOrder: "stroke" }}>
                {labelFor(String(loc.country))}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}


// --------------------------- CONTACT PAGE ----------------------------------

function ContactPage() {
  // ⬅️ Your deployed Apps Script /exec URL
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyBgK7FNCJ5M_KrNhlJlmkLreQDkfgWvlhEBEHZUJcKNvBVr6hWn2HphpoBZpnOHT598Q/exec";

  const [budget, setBudget] = React.useState<number>(10000);
  const [hear, setHear] = React.useState<string>("Referral");
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setOkMsg(null);

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    fd.set("page", window.location.href);
    fd.set("ua", navigator.userAgent);

    try {
      // IMPORTANT: Apps Script must be called with no-cors.
      // The request will succeed server-side, but the browser
      // cannot read the JSON response due to Google infra.
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: fd,
        mode: "no-cors",
      });

      // If fetch didn't throw, assume success.
      setOkMsg("✅ Thanks! We received your message and will reply shortly.");
      form.reset();
      setBudget(10000);
      setHear("Referral");

      // Auto-hide success after 5s
      window.setTimeout(() => setOkMsg(null), 5000);
    } catch (err: any) {
      console.error("Submit error:", err);
      setErrorMsg(`Submit failed: ${err?.message || String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-[#0a2540]">
      {/* HERO SECTION */}
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Contact Us
          </h1>
          <p className="mt-2 text-white/80">
            Tell us about your project or training needs. You can also reach us
            at <span className="font-semibold">contact@technocolabs.com</span>{" "}
            or <span className="font-semibold">+91 8319291391</span>.
          </p>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 lg:grid-cols-2">
        {/* LEFT SIDE - MAP & OFFICE INFO */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-[#0a2540]/10 shadow-sm">
            <iframe
              title="Technocolabs location"
              width="100%"
              height="360"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=J.P.+Tower+First+Floor+P1,+Indore,+452002&output=embed"
            />
          </div>

          <div className="rounded-2xl border border-[#0a2540]/10 p-6 shadow-sm">
            <div className="text-base font-semibold">Our Office</div>
            <div className="mt-2 text-sm text-[#0a2540]/80">
              J.P. Tower First Floor P1, Indore, India, 452002.
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <a className="hover:underline" href="mailto:contact@technocolabs.com">
                contact@technocolabs.com
              </a>
              <a className="hover:underline" href="tel:+918319291391">
                +91 8319291391
              </a>
            </div>
            <div className="mt-4 text-xs text-[#0a2540]/60">
              Open: Mon–Sat, 10:00–18:00 IST
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - CONTACT FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm"
        >
          {/* Alerts */}
          {okMsg && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {okMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMsg}
            </div>
          )}

          <div className="grid gap-4">
            {/* Name + Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name*</label>
                <input
                  name="name"
                  required
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Company</label>
                <input
                  name="company"
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="Your company"
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Business email*</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  name="phone"
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="+91 ..."
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium">How can we help?</label>
              <textarea
                name="message"
                rows={4}
                className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                placeholder="Tell us about your project or training needs…"
              />
            </div>

            {/* Hear + Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  How did you hear about us?
                </label>
                <select
                  name="hear"
                  value={hear}
                  onChange={(e) => setHear(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2"
                >
                  <option>Referral</option>
                  <option>LinkedIn</option>
                  <option>Instagram</option>
                  <option>Twitter/X</option>
                  <option>Google Search</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Budget (estimate)</label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    name="budget"
                    min={1000}
                    max={50000}
                    step={1000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm whitespace-nowrap">
                    ${Intl.NumberFormat().format(budget)}
                  </span>
                </div>
              </div>
            </div>

            {/* File URL instead of upload */}
            <div>
              <label className="block text-sm font-medium">File URL (optional)</label>
              <input
                type="url"
                name="fileurl"
                placeholder="https://drive.google.com/file/d/... or https://wetransfer.com/..."
                className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
              />
              <div className="mt-1 text-xs text-[#0a2540]/60">
                Paste a public file link (Google Drive, Dropbox, etc.)
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg ${
                submitting ? "bg-[#1e90ff]/60 cursor-not-allowed" : "bg-[#1e90ff]"
              }`}
            >
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}


// --------------------------- Top Bar Site--------------------------------------
// --------------------------- CONTENT PAGES (ABOUT SECTION) --------------------
function SuccessStoriesPage(){
  useEffect(()=>{
    if (typeof document !== 'undefined') {
      document.title = 'Success Stories | Technocolabs Softwares Inc.';
      const m = document.querySelector('meta[name="description"]') || (()=>{ const x=document.createElement('meta'); x.setAttribute('name','description'); document.head.appendChild(x); return x; })();
      m.setAttribute('content','Read how Technocolabs delivered measurable outcomes with AI, analytics, and software in production.');
    }
  },[]);
  const stories = [
    {t:'Retail Demand Forecasting', p:'High stockouts across stores', s:'Hierarchical forecasting + feature store', r:'↓ stockouts 32%, ↑ revenue 9%'},
    {t:'Support Knowledge RAG', p:'Slow agent answers', s:'RAG over SOPs + product docs', r:'↓ handling time 40%, ↑ CSAT 18%'},
    {t:'Vision Quality Inspection', p:'Manual defect detection', s:'Realtime CV inference on edge', r:'↓ inspection time 55%, ↑ accuracy 22%'}
  ];
  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Success Stories</h1>
          <p className="mt-2 text-white/80 max-w-3xl">Selected case studies demonstrating real business impact from our AI, analytics, and engineering work.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((c)=> (
            <div key={c.t} className="rounded-2xl border border-[#0a2540]/10 p-6 bg-white shadow-sm">
              <div className="font-semibold">{c.t}</div>
              <div className="mt-2 text-sm"><span className="font-medium">Problem:</span> {c.p}</div>
              <div className="mt-1 text-sm"><span className="font-medium">Solution:</span> {c.s}</div>
              <div className="mt-1 text-sm"><span className="font-medium">Result:</span> {c.r}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-[#0a2540] text-white p-6 sm:p-8 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Have a similar challenge?</div>
            <div className="text-white/80">We’ll map a path to outcomes aligned to your KPIs.</div>
          </div>
          <a href="mailto:contact@technocolabs.com?subject=Project%Discussion%20Enquiry" className="rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold">Contact Us</a>
        </div>
      </section>
    </div>
  );
}

function BlogPage(){
  useEffect(()=>{
    if (typeof document !== 'undefined') {
      document.title = 'Blog | Technocolabs Softwares Inc.';
      const m = document.querySelector('meta[name="description"]') || (()=>{ const x=document.createElement('meta'); x.setAttribute('name','description'); document.head.appendChild(x); return x; })();
      m.setAttribute('content','Insights on AI, data engineering, BI, and cloud from Technocolabs engineers.');
    }
  },[]);
  const posts = [
    {title:'Designing Lakehouse Architectures with Governance', date:'Oct 2025', excerpt:'How we combine Delta/Iceberg with semantic layers and tests.'},
    {title:'From POC to Production: A GenAI Checklist', date:'Sep 2025', excerpt:'Guardrails, evals, and data privacy you actually need.'},
    {title:'Feature Stores: When and Why', date:'Aug 2025', excerpt:'Balancing reuse, lineage, and latency trade-offs.'}
  ];
  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-2 text-white/80 max-w-3xl">Practitioner notes on building reliable AI and data platforms.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p)=> (
            <article key={p.title} className="rounded-2xl border border-[#0a2540]/10 p-6 bg-white shadow-sm">
              <div className="text-xs text-[#0a2540]/60">{p.date}</div>
              <h3 className="mt-1 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-[#0a2540]/80">{p.excerpt}</p>
              <button className="mt-3 text-sm font-semibold text-[#1e90ff] hover:underline" onClick={()=>alert('Hook this to your CMS or MDX routing later.')}>Read</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function WriteForUsPage(){
  useEffect(()=>{
    if (typeof document !== 'undefined') {
      document.title = 'Write for Us | Technocolabs Softwares Inc.';
      const m = document.querySelector('meta[name="description"]') || (()=>{ const x=document.createElement('meta'); x.setAttribute('name','description'); document.head.appendChild(x); return x; })();
      m.setAttribute('content','Pitch engineering articles to Technocolabs: topics, guidelines, and how to submit.');
    }
  },[]);
  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Write for Us</h1>
          <p className="mt-2 text-white/80 max-w-3xl">Share practical insights on AI, data, BI, and cloud with our audience.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8">
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Topics we love</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {['GenAI & RAG','Feature stores','Lakehouse patterns','MLOps','Experimentation','Observability','Data governance','Case studies'].map(x=> (<span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>))}
          </div>
          <h3 className="mt-6 font-semibold">Editorial guidelines</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Original, practical, and technically accurate content</li>
            <li>Code snippets, diagrams, and measurable outcomes where possible</li>
            <li>Clear attribution for quotes, datasets, and images</li>
            <li>Length: 1,000–2,000 words; include a short author bio</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">How to submit</h3>
          <p className="mt-2 text-sm text-[#0a2540]/80">Email your pitch or draft to <a className="text-[#1e90ff]" href="mailto:contact@technocolabs.com?subject=Write%20for%20Us%20Pitch">contact@technocolabs.com</a> with:</p>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Working title and 3–5 bullet outline</li>
            <li>Intended audience and key takeaways</li>
            <li>Links to prior writing or GitHub</li>
          </ul>
          <button className="mt-4 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white" onClick={()=>window.location.href='mailto:contact@technocolabs.com?subject=Write%20for%20Us%20Pitch'}>Submit a Pitch</button>
        </div>
      </section>
    </div>
  );
}

// --------------------------- ABOUT PAGE ---------------------------------------
function AboutPage(){
  const navigate = useContext(NavContext);
  useEffect(()=>{
    if (typeof document !== 'undefined') {
      document.title = 'About Us | Technocolabs Softwares Inc.';
      const m = document.querySelector('meta[name="description"]') || (()=>{ 
        const x=document.createElement('meta'); 
        x.setAttribute('name','description'); 
        document.head.appendChild(x); 
        return x; 
      })();
      m.setAttribute('content','About Technocolabs Softwares Inc: mission, leadership, values, culture, and how we deliver reliable outcomes in AI, data, and cloud.');
    }
  },[]);

  return (
    <div className="bg-white text-[#0a2540]">
      {/* Hero */}
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">About Technocolabs</h1>
          <p className="mt-2 text-white/80 max-w-3xl">
            We are an engineering-first company delivering AI, analytics, automation, and cloud solutions
            with measurable business outcomes — not just dashboards or prototypes.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Who we are</h2>
            <p className="mt-2 text-sm text-[#0a2540]/80">
              Founded in Central India, Technocolabs Softwares Inc. partners with organizations to design,
              build, and operate production-grade AI and data systems. We align architecture, engineering,
              and business goals into one measurable roadmap.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ['10,000+','Interns Trained'],
                ['100+','Projects Delivered'],
                ['50+','Partner Companies']
              ].map(([n,l])=> (
                <div key={l} className="rounded-xl border border-[#0a2540]/10 p-4 text-center">
                  <div className="text-2xl font-semibold">{n}</div>
                  <div className="text-xs mt-1 text-[#0a2540]/70">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
            <h3 className="font-semibold">Leadership</h3>
            <div className="mt-3 flex items-center gap-3">
              <img src="/yasin-profile.png" alt="Yasin Shah" className="h-12 w-12 rounded-full object-cover ring-2 ring-[#1e90ff]"/>
              <div>
                <div className="text-sm font-semibold">Yasin Shah</div>
                <div className="text-xs text-[#0a2540]/70">Director & CEO</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#0a2540]/80">
              "We operate with an owner’s mindset: reliability first, clarity in communication, and execution without excuses."
            </p>
          </div>
        </div>

        {/* Values + Delivery */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
            <h3 className="font-semibold">Our Values</h3>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
              <li>Outcomes over outputs</li>
              <li>Security and governance by default</li>
              <li>Transparency and accountability</li>
              <li>Documentation and knowledge transfer</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
            <h3 className="font-semibold">How We Deliver</h3>
            <ol className="mt-2 list-decimal pl-5 text-sm space-y-1 text-[#0a2540]/80">
              <li>Discovery & measurable KPI alignment</li>
              <li>Architecture & data foundations</li>
              <li>Iterative development with quality gates</li>
              <li>Deployment, observability & SLAs</li>
            </ol>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-[#0a2540] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Want to work with us?</div>
            <div className="text-white/80">Book a consultation or reach us at contact@technocolabs.com</div>
          </div>
          <div className="flex items-center gap-3">
           <button onClick={()=>navigate('contact')} className="rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold">Book Consultation</button>
           <button onClick={()=>navigate('careers')} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10">Join Us</button>
          </div>
        </div>
      </section>
    </div>
  );
}
// --------------------------- LEGAL PAGES --------------------------------------
function PrivacyPolicyPage() {
  useEffect(() => { if (typeof document !== 'undefined') document.title = 'Privacy Policy | Technocolabs Softwares Inc.'; }, []);
  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-white/80">Last updated: October 23, 2025</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-sm leading-6">
        <p>
          This Privacy Policy explains how <strong>Technocolabs Softwares Inc.</strong> ("Technocolabs", "we", "us") collects, uses, and protects your information when you visit <strong>https://technocolabs.com</strong>, use our apps, or engage our services. By using our website or services, you agree to this Policy.
        </p>
        <h2 className="text-lg font-semibold">1. Information we collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Contact data</strong> (name, email, phone, company) when you submit forms or contact us.</li>
          <li><strong>Usage data</strong> (pages viewed, clicks, device, approximate location) for analytics and security.</li>
          <li><strong>Technical data</strong> (IP address, cookies, browser/OS) for functionality and fraud prevention.</li>
          <li><strong>Application data</strong> for internships (resume links, portfolio, availability) only when you submit the form.</li>
        </ul>
        <h2 className="text-lg font-semibold">2. How we use information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide and improve our services, website, and customer support.</li>
          <li>Respond to inquiries, proposals, and internship applications.</li>
          <li>Security, fraud prevention, debugging, and compliance with legal obligations.</li>
          <li>Analytics to understand site performance and interest in our offerings.</li>
        </ul>
        <h2 className="text-lg font-semibold">3. Legal bases (GDPR)</h2>
        <p>We process personal data on the basis of <em>legitimate interests</em>, <em>contract</em>, and <em>consent</em> (where required).</p>
        <h2 className="text-lg font-semibold">4. Sharing</h2>
        <p>We do not sell personal data. We may share with trusted processors (e.g., hosting, analytics, email providers) under contracts that protect your data, or when required by law.</p>
        <h2 className="text-lg font-semibold">5. Data retention</h2>
        <p>We keep personal data only as long as necessary for the purposes above, then delete or anonymize it.</p>
        <h2 className="text-lg font-semibold">6. Your rights</h2>
        <p>You may request access, correction, deletion, or restriction of your personal data. EU/UK/EEA residents may also object to processing or request data portability. To exercise rights, contact us at <a className="text-[#1e90ff]" href="mailto:contact@technocolabs.com">contact@technocolabs.com</a>.</p>
        <h2 className="text-lg font-semibold">7. International transfers</h2>
        <p>We operate globally. Where data is transferred across borders, we use appropriate safeguards as required by law.</p>
        <h2 className="text-lg font-semibold">8. Security</h2>
        <p>We use reasonable administrative, technical, and physical safeguards. No method is 100% secure; please use the site responsibly.</p>
        <h2 className="text-lg font-semibold">9. Children</h2>
        <p>Our services are not directed to children under 13 (or 16 where applicable). We do not knowingly collect data from children.</p>
        <h2 className="text-lg font-semibold">10. Contact</h2>
        <p><strong>Technocolabs Softwares Inc.</strong><br/>J.P. Tower First Floor P1, Indore, India, 452002<br/>Email: <a className="text-[#1e90ff]" href="mailto:contact@technocolabs.com">contact@technocolabs.com</a></p>
      </section>
    </div>
  );
}

function CookiePolicyPage() {
  useEffect(() => { if (typeof document !== 'undefined') document.title = 'Cookie Policy | Technocolabs Softwares Inc.'; }, []);
  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="mt-2 text-white/80">Last updated: October 23, 2025</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-sm leading-6">
        <p>
          This Cookie Policy explains how <strong>Technocolabs Softwares Inc.</strong> uses cookies and similar technologies on <strong>https://technocolabs.com</strong>.
        </p>
        <h2 className="text-lg font-semibold">1. What are cookies?</h2>
        <p>Cookies are small text files stored on your device to make websites work, improve user experience, and provide analytics.</p>
        <h2 className="text-lg font-semibold">2. Types of cookies we use</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Strictly necessary</strong>: essential for core functionality (e.g., page navigation, form submissions).</li>
          <li><strong>Performance/analytics</strong>: help us understand usage to improve the site.</li>
          <li><strong>Functional</strong>: remember choices (e.g., preferences).</li>
        </ul>
        <h2 className="text-lg font-semibold">3. Managing cookies</h2>
        <p>You can set your browser to block or alert you about cookies, but some parts of the site may not work then.</p>
        <h2 className="text-lg font-semibold">4. Third-party cookies</h2>
        <p>Some third parties (e.g., analytics providers) may set cookies to deliver services. We do not control their cookies.</p>
        <h2 className="text-lg font-semibold">5. Changes</h2>
        <p>We may update this policy. Material changes will be posted on this page with an updated date.</p>
        <h2 className="text-lg font-semibold">6. Contact</h2>
        <p>Questions? Email us at <a className="text-[#1e90ff]" href="mailto:contact@technocolabs.com">contact@technocolabs.com</a>.</p>
      </section>
    </div>
  );
}

function TermsPage() {
  useEffect(() => { if (typeof document !== 'undefined') document.title = 'Terms of Use | Technocolabs Softwares Inc.'; }, []);
  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms of Use</h1>
          <p className="mt-2 text-white/80">Last updated: October 23, 2025</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-sm leading-6">
        <p>
          These Terms of Use ("Terms") govern your access to and use of <strong>https://technocolabs.com</strong> and services provided by <strong>Technocolabs Softwares Inc.</strong> By using the Site or Services, you agree to these Terms.
        </p>
        <h2 className="text-lg font-semibold">1. Use of the site</h2>
        <p>You agree not to misuse the Site, attempt unauthorized access, or interfere with its operation.</p>
        <h2 className="text-lg font-semibold">2. Intellectual property</h2>
        <p>All content, trademarks, and logos are the property of Technocolabs or its licensors. You may not copy, modify, or distribute content without permission.</p>
        <h2 className="text-lg font-semibold">3. User content</h2>
        <p>If you share or upload content (e.g., via forms), you represent you have the right to do so and grant us the necessary rights to use it to provide services.</p>
        <h2 className="text-lg font-semibold">4. Disclaimers</h2>
        <p>The site is provided "as is" without warranties of any kind. We disclaim implied warranties to the extent permitted by law.</p>
        <h2 className="text-lg font-semibold">5. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, Technocolabs shall not be liable for indirect, incidental, special, or consequential damages, or lost profits arising from your use of the site.</p>
        <h2 className="text-lg font-semibold">6. Third-party links</h2>
        <p>The site may contain links to third-party websites. We are not responsible for their content or practices.</p>
        <h2 className="text-lg font-semibold">7. Governing law</h2>
        <p>These Terms are governed by the laws of India, without regard to conflict of law rules. Venue lies in Indore, India.</p>
        <h2 className="text-lg font-semibold">8. Changes</h2>
        <p>We may update these Terms. Continued use after changes constitutes acceptance.</p>
        <h2 className="text-lg font-semibold">9. Contact</h2>
        <p>Questions about these Terms? Contact <a className="text-[#1e90ff]" href="mailto:contact@technocolabs.com">contact@technocolabs.com</a>.</p>
      </section>
    </div>
  );
}
// --------------------------- TOP BAR (site-wide) ---------------------------
// --------------------------- BIG DATA PAGES -----------------------------------
function SectionShell({title, subtitle, children}:{title:string; subtitle:string; children:React.ReactNode}){
  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-white/80">{subtitle}</p>}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8">
        {children}
      </section>
    </div>
  );
}

function BigDataDevelopmentPage(){
  useEffect(()=>{ if (typeof document!== 'undefined') document.title='Big Data Development | Technocolabs'; },[]);
  return (
    <SectionShell title="Big Data Development" subtitle="Enterprise-grade data platforms engineered for scale and reliability.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="mt-2 text-sm text-[#0a2540]/80">We design and implement distributed data systems—batch and streaming—that ingest, process, and serve data with predictable SLAs. Our focus: durability, cost efficiency, and operational simplicity.</p>
          <h3 className="mt-6 font-semibold">Capabilities</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Streaming ingestion (Kafka/Kinesis), micro-batch, CDC pipelines</li>
            <li>Lakehouse architectures (Delta/Apache Iceberg/Hudi)</li>
            <li>Quality, lineage, and governance built-in</li>
            <li>Security, access controls, secrets management</li>
          </ul>
          <h3 className="mt-6 font-semibold">Use Cases</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Real-time analytics and observability</li>
            <li>Customer 360 and product telemetry</li>
            <li>Marketing attribution and campaign performance</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Tech Stack</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {['Kafka','Spark','Flink','dbt','Airflow','Delta','Iceberg','Hudi','Snowflake','BigQuery','S3/GCS','Terraform'].map(x=> (
              <span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>
            ))}
          </div>
          <div className="mt-6 font-semibold">Why Technocolabs</div>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Operator mindset: SLAs, cost, reliability</li>
            <li>Clear documentation and handover</li>
            <li>Security-first implementation</li>
          </ul>
        </div>
      </div>
      <div className="rounded-2xl bg-[#0a2540] text-white p-6 flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <div className="text-lg font-semibold">Discuss your data platform roadmap</div>
          <div className="text-white/80">We’ll map current state → target architecture with milestones.</div>
        </div>
        <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold">Book Consultation</button>
      </div>
    </SectionShell>
  );
}

function DataArchitecturePage(){
  useEffect(()=>{ if (typeof document!== 'undefined') document.title='Data Architecture Engineering | Technocolabs'; },[]);
  return (
    <SectionShell title="Data Architecture Engineering" subtitle="Blueprints for scalable, governed, and cost-aware analytics.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Approach</h2>
          <p className="mt-2 text-sm text-[#0a2540]/80">We define reference architectures, data models, and integration contracts that keep teams productive as data grows.</p>
          <h3 className="mt-6 font-semibold">Deliverables</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Current-state assessment and risk register</li>
            <li>Target architecture diagrams and ADRs</li>
            <li>Data modeling (star/snowflake/semantic layer)</li>
            <li>Security, RBAC, and compliance guardrails</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Tools</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {['dbt','Great Expectations','OpenLineage','Looker/Power BI','Terraform','GitHub Actions'].map(x=> (<span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>))}
          </div>
          <div className="mt-6 font-semibold">Outcomes</div>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Consistent, trusted KPIs</li>
            <li>Lower time-to-insight and change risk</li>
            <li>Predictable costs and performance</li>
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

function DataWarehousePage(){
  useEffect(()=>{ if (typeof document!== 'undefined') document.title='Data Warehouse Engineering | Technocolabs'; },[]);
  return (
    <SectionShell title="Data Warehouse Engineering" subtitle="Design, build, and operate modern lakehouse/warehouse stacks.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">What we build</h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>ELT/ETL pipelines with reliability SLAs</li>
            <li>Semantic layers and governed access</li>
            <li>Performance tuning and cost optimization</li>
          </ul>
          <h3 className="mt-6 font-semibold">Migration & Modernization</h3>
          <p className="mt-2 text-sm text-[#0a2540]/80">From legacy warehouses to Snowflake/BigQuery/Databricks with minimal downtime and audited cutover.</p>
        </div>
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Platforms</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {['Snowflake','BigQuery','Redshift','Databricks','PostgreSQL'].map(x=> (<span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>))}
          </div>
          <div className="mt-6 font-semibold">Quality & Governance</div>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Tests, lineage, and documentation automated</li>
            <li>Row-level security and PII protection</li>
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

function BIVisualizationPage(){
  useEffect(()=>{ if (typeof document!== 'undefined') document.title='BI & Data Visualizations | Technocolabs'; },[]);
  return (
    <SectionShell title="BI & Data Visualizations" subtitle="Executive-ready dashboards with adoption-focused design.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Approach</h2>
          <p className="mt-2 text-sm text-[#0a2540]/80">We prioritize clarity, consistent metrics, and performance. Every dashboard has an owner, refresh SLA, and documented KPIs.</p>
          <h3 className="mt-6 font-semibold">Workstreams</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Metric catalog and governance</li>
            <li>Role-based dashboards and permissions</li>
            <li>Performance tuning and adoption training</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Tools</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {['Power BI','Tableau','Looker','Metabase','Superset'].map(x=> (<span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>))}
          </div>
          <div className="mt-6 font-semibold">Outcomes</div>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Single source of truth for decisions</li>
            <li>Self-serve analytics without chaos</li>
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

function PredictiveAnalyticsBDPage(){
  useEffect(()=>{ if (typeof document!== 'undefined') document.title='Predictive Analytics | Technocolabs'; },[]);
  return (
    <SectionShell title="Predictive Analytics" subtitle="Forecasts and scoring models integrated with your operations.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Scope</h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Time-series forecasting (hierarchical, multivariate)</li>
            <li>Risk/churn/propensity scoring</li>
            <li>What-if analysis and scenario planning</li>
          </ul>
          <h3 className="mt-6 font-semibold">Process</h3>
          <ol className="mt-2 list-decimal pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Business goal alignment and KPI definition</li>
            <li>Feature engineering and baseline models</li>
            <li>Backtesting, monitoring, and continuous improvement</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Tech</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {['Python','scikit-learn','XGBoost','LightGBM','Statsmodels','MLflow'].map(x=> (<span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>))}
          </div>
          <div className="mt-6 font-semibold">Business Outcomes</div>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Inventory, staffing, and revenue improvements</li>
            <li>Reduced manual effort with governed models</li>
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

function CloudServicesPage(){
  useEffect(()=>{ if (typeof document!== 'undefined') document.title='Cloud Services | Technocolabs'; },[]);
  return (
    <SectionShell title="Cloud Services" subtitle="Cost-optimized, secure cloud foundations for data and AI.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">What we deliver</h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Landing zones, networking, and IAM</li>
            <li>Data platforms with IaC and GitOps</li>
            <li>Observability, SLOs, and cost guardrails</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Clouds & Tools</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {['AWS','GCP','Azure','Terraform','ArgoCD','OpenCost'].map(x=> (<span key={x} className="rounded-full bg-[#0a2540]/5 px-3 py-1.5">{x}</span>))}
          </div>
          <div className="mt-6 font-semibold">Why Us</div>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-[#0a2540]/80">
            <li>Security baselines without slowing teams</li>
            <li>Real savings with before/after metrics</li>
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

// --------------------------- TOP BAR (site-wide) ---------------------------
function TopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-white text-[#0a2540] border-b border-[#0a2540]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-auto py-2
                      flex flex-wrap items-center gap-2 text-sm">

        {/* LEFT: address hidden on phones, email always visible but truncated */}
        <div className="flex items-center gap-4 min-w-0">
          <span className="hidden md:inline-flex items-center gap-1 whitespace-nowrap">
            <MapPin className="h-4 w-4" />
            J.P. Tower First Floor P1, Indore, India
          </span>
          <span className="hidden md:inline h-4 w-px bg-[#0a2540]/15" />
          <a
            href="mailto:contact@technocolabs.com"
            className="inline-flex items-center gap-2 min-w-0 max-w-[60vw]"
          >
            <Mail className="h-4 w-4" />
            <span className="truncate">contact@technocolabs.com</span>
          </a>
        </div>

        {/* RIGHT: phone floats right; show icon + 'Call' on xs, full number from sm+ */}
        <div className="ml-auto flex items-center gap-4">
          <a
            href="tel:+918319291391"
            className="inline-flex items-center gap-2 rounded-full border border-[#0a2540]/15 px-3 py-1 hover:bg-[#0a2540]/5"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">+91&nbsp;8319291391</span>
            <span className="sm:hidden">Call</span>
          </a>

          {/* Socials hidden on phones to avoid crowding */}
          <span className="hidden md:flex items-center gap-3">
            <a aria-label="Facebook" href={SOCIAL_LINKS.facebook} className="hover:text-[#1e90ff]"><Facebook className="h-4 w-4" /></a>
            <a aria-label="Twitter"  href={SOCIAL_LINKS.twitter}  className="hover:text-[#1e90ff]"><Twitter  className="h-4 w-4" /></a>
            <a aria-label="LinkedIn"  href={SOCIAL_LINKS.linkedin} className="hover:text-[#1e90ff]"><Linkedin  className="h-4 w-4" /></a>
          </span>
        </div>
      </div>
    </div>
  );
}

// --------------------------- NAV & FOOTER ----------------------------------
function NavBar() {
  const navigate = useContext(NavContext);
  const tab = useContext(CurrentTabContext);

  const TABS = ['home', 'services', 'careers', 'contact', 'about'] as const;

  return (
    <header className="fixed inset-x-0 top-10 z-50 bg-[#0a2540] text-white border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===== DESKTOP (md+) — single row ===== */}
        <div className="hidden md:flex h-14 items-center justify-between">
          {/* Brand */}
          <button onClick={() => navigate('home')} className="flex items-center min-w-0">
            <div className="h-8 w-8 flex items-center justify-center shrink-0">
              <Logo size={28} />
            </div>
            <span className="ml-2 font-semibold whitespace-nowrap">
              Technocolabs Softwares Inc.
            </span>
          </button>

          {/* Tabs */}
          <nav className="flex items-center gap-3 text-sm">
            {TABS.map((t) => (
              <Link
                key={t}
                to={t === 'home' ? '/' : `/${t}`}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  tab === t ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                aria-current={tab === t ? 'page' : undefined}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </Link>
            ))}
          </nav>
        </div>

        {/* ===== MOBILE (< md) — two rows ===== */}
        <div className="md:hidden py-2">
          {/* Row 1: brand */}
          <div className="flex items-center min-w-0">
            <div className="h-8 w-8 flex items-center justify-center shrink-0">
              <Logo size={24} />
            </div>
            {/* Short name on very small screens; longer from sm+ */}
            <span className="ml-2 font-semibold whitespace-nowrap truncate max-w-[80vw]">
              <span className="block sm:hidden">Technocolabs Softwares Inc.</span>
              <span className="hidden sm:block">Technocolabs Softwares Inc.</span>
            </span>
          </div>

          {/* Row 2: tabs (full-width, scrollable) */}
          <nav className="mt-2 -mx-4 px-4">
            <div className="flex overflow-x-auto no-scrollbar gap-2 py-1 whitespace-nowrap">
              {TABS.map((t) => (
                <Link
                  key={t}
                  to={t === 'home' ? '/' : `/${t}`}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    tab === t ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  aria-current={tab === t ? 'page' : undefined}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </Link>
              ))}
            </div>
          </nav>
        </div>

      </div>
    </header>
  );
}

function Footer() {
  const navigate = useContext(NavContext);
  return (
    <footer className="bg-[#0a2540] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4 items-start">
          {/* Columns */}
          <div>
            <div className="text-base font-semibold">Expertise & Services</div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><button onClick={()=>navigate('services')} className="hover:underline">Data Science & AI</button></li>
              <li><button onClick={()=>navigate('services')} className="hover:underline">Machine Learning</button></li>
              <li><button onClick={()=>navigate('services')} className="hover:underline">AI Software Development</button></li>
              <li><button onClick={()=>navigate('services')} className="hover:underline">AI Mobile Apps Development</button></li>
              <li><button onClick={()=>navigate('services')} className="hover:underline">Natural Language Processing</button></li>
              <li><button onClick={()=>navigate('services')} className="hover:underline">Data Capture & OCR</button></li>
            </ul>
          </div>
          <div>
            <div className="text-base font-semibold">Big Data Solutions</div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><button onClick={()=>navigate('bigdata')} className="hover:underline">Big Data Development</button></li>
              <li><button onClick={()=>navigate('data-architecture')} className="hover:underline">Data Architecture Engineering</button></li>
              <li><button onClick={()=>navigate('data-warehouse')} className="hover:underline">Data Warehouse Engineering</button></li>
              <li><button onClick={()=>navigate('bi-visualization')} className="hover:underline">BI & Data Visualizations</button></li>
              <li><button onClick={()=>navigate('predictive-analytics-bd')} className="hover:underline">Predictive Analytics</button></li>
              <li><button onClick={()=>navigate('cloud-services')} className="hover:underline">Cloud Services</button></li>
            </ul>
          </div>
          <div>
            <div className="text-base font-semibold">About Us</div>
<ul className="mt-4 space-y-2 text-sm text-white/80">
  <li><button onClick={()=>navigate('success-stories')} className="hover:underline">Success Stories</button></li>
  <li><button onClick={()=>navigate('blog')} className="hover:underline">Blog</button></li>
  <li><button onClick={()=>navigate('careers')} className="hover:underline">Careers</button></li>
  <li><button onClick={()=>navigate('about')} className="hover:underline">About</button></li>
  <li><button onClick={()=>navigate('write-for-us')} className="hover:underline">Write for Us</button></li>
</ul>
          </div>
          {/* Contact + Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <a aria-label="LinkedIn" href={SOCIAL_LINKS.linkedin} className="hover:opacity-80"><Linkedin /></a>
              <a aria-label="Facebook" href={SOCIAL_LINKS.facebook} className="hover:opacity-80"><Facebook /></a>
              <a aria-label="Instagram" href={SOCIAL_LINKS.instagram}className="hover:opacity-80"><Instagram /></a>
              <a aria-label="X" href={SOCIAL_LINKS.twitter} className="hover:opacity-80"><Twitter /></a>
            </div>
            <div className="text-sm text-white/80 max-w-xs leading-relaxed">
              J.P. Tower First Floor P1, Indore, India, 452002.
            </div>
            <a href="mailto:info@technocolabssoftware.com" className="block text-sm hover:underline">contact@technocolabs.com</a>
            <a href="tel:+918319291391" className="block text-sm hover:underline">+91 8319291391</a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px w-full bg-white/20" />

        {/* Bottom bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/70">
          <div>© {new Date().getFullYear()} Technocolabs Softwares — All Rights Reserved</div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('privacy')} className="hover:underline">Privacy Policy</button>
        <button onClick={() => navigate('terms')} className="hover:underline">Terms of Use</button>
        <button onClick={() => navigate('cookies')} className="hover:underline">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --------------------------- Floating CTA (site‑wide) ----------------------
function FloatingCTA() {
  const navigate = useContext(NavContext);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open && (
        <div className="mb-3 space-y-2">
          <button onClick={() => { setOpen(false); navigate('contact'); }} className="block w-full rounded-xl bg-[#1e90ff] text-white text-sm font-semibold px-4 py-2 shadow">Book Consultation</button>
          <button onClick={() => { setOpen(false); navigate('careers'); }} className="block w-full rounded-xl bg-white text-[#0a2540] text-sm font-semibold px-4 py-2 shadow">Apply for Internship</button>
          <a href="https://wa.me/918319291391?text=Hello%20I%20am%20interested%20in%20your%20services." className="block w-full text-center rounded-xl bg-[#25D366] text-white text-sm font-semibold px-4 py-2 shadow">WhatsApp</a>
        </div>
      )}
      <button aria-label="Open quick actions" onClick={() => setOpen(v => !v)} className="rounded-full h-14 w-14 shadow-lg bg-[#0a2540] text-white flex items-center justify-center border border-white/10">
        <ArrowUpRight className={`h-6 w-6 transition-transform ${open ? 'rotate-45' : ''}`} />
      </button>
    </div>
  );
}

// --------------------------- APPLICATIONS CLOSED PAGE ----------------------------
function ApplicationsClosedPage() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || "this position";

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-red-600">Applications Closed</h1>

      <p className="mt-4 text-lg text-gray-700 max-w-xl">
        The <strong>{role}</strong> role is currently not accepting applications.
      </p>

      <p className="mt-3 text-gray-700 max-w-xl">
        You may send your resume to{" "}
        <a href="mailto:technocollabs@gmail.com" className="text-blue-600 underline">
          technocollabs@gmail.com
        </a>
        {" "} and 
        <a href="mailto:contact@technocolabs.com" className="text-blue-600 underline">
         {" "} contact@technocolabs.com
        </a>
        . We will notify you when this position opens again.
      </p>

      <a
        href="/careers"
        className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow"
      >
        Back to Careers
      </a>
    </div>
  );
}


// ---------- APPLY FORM (embedded) with role name + details + Back button ----------
type ApplyFormEmbedPageProps = { roleId?: string };

function ApplyFormEmbedPage({ roleId = "" }: ApplyFormEmbedPageProps) {
  const navigate = useContext(NavContext);

  // 1) Short-code → Full Title
  const ROLE_NAME: Record<string, string> = {
    genai: "Generative AI Engineer Intern",
    py: "Python Developer Intern",
    dl: "Deep Learning Engineer Intern",
    cv: "Computer Vision Engineer Intern",
    ba: "Business Analyst Intern",
    ds: "Data Science Intern",
    ml: "Machine Learning Intern",
    web: "Web Development Intern",
    da: "Data Analytics Intern",
    bi: "Business Intelligence Intern",
    ai: "Artificial Intelligence Intern",
    se: "Software Engineering Intern",
    cyber: "CyberSecurity Engineer Intern",
  };

  // 2) Role details (from your ApplyPage content)
  const ROLE_CONTENT: Record<
    string,
    { jd: string; responsibilities: string[]; requirements: string[] }
  > = {
    genai: {
      jd: "Work on LLMs, embeddings, RAG and evaluation; prototype chat and knowledge features and integrate them into apps.",
      responsibilities: [
        "Build/evaluate LLM pipelines",
        "RAG with vector stores",
        "Prompt design & evaluation",
        "Integrate with APIs/backends",
        "Document experiments",
      ],
      requirements: [
        "Python proficiency",
        "HuggingFace/LangChain experience",
        "NLP/LLM basics",
        "Git, basics of Docker",
        "Clear communication",
      ],
    },
    py: {
      jd: "Develop APIs, automation scripts and internal tools using Python — with a strong focus on quality and tests.",
      responsibilities: [
        "Build REST APIs",
        "Write reusable modules",
        "Work with SQL/ORM",
        "Add logging/monitoring",
        "Participate in reviews",
      ],
      requirements: [
        "Python fundamentals",
        "FastAPI/Flask or Django",
        "SQL & Git",
        "Basics of Docker",
        "Good documentation",
      ],
    },
    dl: {
      jd: "Train and evaluate DL models for CV/NLP, optimize inference and create clear experiment reports.",
      responsibilities: [
        "Dataset prep and training",
        "Experiment with CNN/Transformers",
        "Optimize models for inference",
        "Track metrics & visualize",
        "Share results with team",
      ],
      requirements: [
        "PyTorch/TensorFlow",
        "DL theory basics",
        "GPU workflows",
        "Git proficiency",
        "Analytical mindset",
      ],
    },
    cv: {
      jd: "Implement CV pipelines (detection/segmentation/OCR) and deploy reliable inference services.",
      responsibilities: [
        "Collect/clean/augment data",
        "Train/evaluate CV models",
        "Deploy inference services",
        "Write preprocessing tools",
        "Document results",
      ],
      requirements: [
        "Python + OpenCV",
        "PyTorch/TensorFlow",
        "YOLO/Detectron experience",
        "Docker basics",
        "Problem-solving",
      ],
    },
    ba: {
      jd: "Turn data into decisions: gather requirements, build dashboards and communicate insights.",
      responsibilities: [
        "Define KPIs and questions",
        "Prepare/clean data",
        "Build dashboards in BI tools",
        "Write concise reports",
        "Collaborate with engineers",
      ],
      requirements: [
        "SQL + spreadsheets",
        "Power BI/Tableau/Looker",
        "Basic stats/A-B testing",
        "Strong communication",
        "Attention to detail",
      ],
    },
    ds: {
      jd: "Explore data, build features and predictive models, and communicate insights clearly to stakeholders.",
      responsibilities: [
        "EDA and feature engineering",
        "Model training and evaluation",
        "Visualize results and KPIs",
        "Write reports and docs",
        "Collaborate across teams",
      ],
      requirements: [
        "Python & pandas/sklearn",
        "Statistics basics",
        "Data viz tools",
        "SQL",
        "Git",
      ],
    },
    ml: {
      jd: "Implement ML pipelines and experiment with models to improve accuracy and robustness.",
      responsibilities: [
        "Features & training",
        "Model selection/tuning",
        "Cross-validation & metrics",
        "Report results",
        "Contribute to deployment readiness",
      ],
      requirements: [
        "Python, sklearn",
        "ML theory basics",
        "Experiment tracking",
        "Git",
        "Communication",
      ],
    },
    web: {
      jd: "Build responsive UI and connect to APIs in a modern JS stack.",
      responsibilities: [
        "Implement pages/components",
        "Fetch from REST APIs",
        "Fix UI bugs",
        "Write clean code",
        "Participate in reviews",
      ],
      requirements: [
        "HTML/CSS/JS",
        "React basics",
        "Git",
        "HTTP/REST",
        "Attention to detail",
      ],
    },
    da: {
      jd: "Create dashboards and analyses that guide decisions.",
      responsibilities: [
        "Clean/transform data",
        "Create visuals & dashboards",
        "Define KPIs",
        "Share insights",
        "Document sources",
      ],
      requirements: ["SQL", "Power BI/Tableau", "Spreadsheets", "Statistics basics", "Comms"],
    },
    bi: {
      jd: "Model data and build BI dashboards with good governance.",
      responsibilities: [
        "Model for BI",
        "Build/maintain reports",
        "Monitor refresh & quality",
        "Optimize performance",
        "Write docs",
      ],
      requirements: [
        "Power BI/Tableau/Looker",
        "SQL",
        "DAX/LookML (any)",
        "Versioning",
        "Stakeholder comms",
      ],
    },
    ai: {
      jd: "Assist across AI tasks, from research to prototypes in NLP/CV.",
      responsibilities: [
        "Review papers & baselines",
        "Train simple models",
        "Prepare data",
        "Write notebooks",
        "Demo findings",
      ],
      requirements: ["Python & ML libs", "NLP/CV basics", "Math basics", "Git", "Curiosity"],
    },
    se: {
      jd: "Support full-stack development with tests and clean code.",
      responsibilities: [
        "Feature work & bug fixes",
        "Unit/integration tests",
        "Reviews and CI",
        "Perf improvements",
        "Documentation",
      ],
      requirements: [
        "One stack (frontend/backend)",
        "Git & tests",
        "Clean code",
        "CI/CD basics",
        "Teamwork",
      ],
    },
    cyber: {
      jd: "Assist security reviews, fix issues, and promote best practices.",
      responsibilities: [
        "Run scans",
        "Threat modeling assistance",
        "Track fixes",
        "Document policies",
        "Awareness training",
      ],
      requirements: ["OWASP basics", "Scripting basics", "Linux/Networking", "Auth/Identity basics", "Detail oriented"],
    },
  };

  // 3) Short-code → Google Form URL (embed)
  const FORM_URL: Record<string, string> = {
    cv: "https://forms.gle/w2gzpJQxhGntAnBj6",
    ds: "https://forms.gle/xT9md6t87N4sgEWV8",
    ml: "https://forms.gle/6UVG5Tf76zd3XXyE6",
    web: "https://forms.gle/8zJMG4c67pe16MU18",
    da: "https://forms.gle/muHWYbDiy173X4Ms8",
    bi: "https://forms.gle/CNjoeciZSytGakNX8",
    ai: "https://forms.gle/oMSF6u716nehhdke6",
    py: "<put python form here if you open it>",
    ba: "<put BA form here if you open it>",
    se: "<put SE form here if you open it>",
    cyber: "https://forms.gle/PFV39TtRkabKGTEW7",
  };

  const fullRoleName = ROLE_NAME[roleId] || "Internship";
  const details = ROLE_CONTENT[roleId];
  const url = FORM_URL[roleId];

  return (
    <div className="bg-white text-[#0a2540]">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-6">

        {/* BACK BUTTON → Careers (Open Roles) */}
        <button
          onClick={() => {
            try { window.localStorage.setItem("careers-subtab", "openroles"); } catch {}
            navigate("careers"); // your NavContext updates URL to /careers
          }}
          className="mb-4 inline-flex items-center gap-2 text-sm text-[#1e90ff] hover:underline"
        >
          ← Back to Open Positions
        </button>

        <h1 className="text-3xl font-bold">
          Apply — <span className="text-[#1e90ff]">{fullRoleName}</span>
        </h1>

        {/* Role summary above the form */}
        {details ? (
          <div className="mt-4 rounded-2xl border border-[#0a2540]/10 bg-[#f8fafc] p-6">
            <div className="text-sm text-[#0a2540]/80">
              <div className="font-semibold text-[#0a2540]">About the role</div>
              <p className="mt-1">{details.jd}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mt-4">
              <div>
                <div className="text-sm font-semibold text-[#0a2540]">Responsibilities</div>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">
                  {details.responsibilities.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0a2540]">Requirements</div>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">
                  {details.requirements.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-[#0a2540]/10 bg-[#fff6e5] p-6">
            <p className="text-[#7a4d00] text-sm">
              Role details will be published soon. You can still submit the form below.
            </p>
          </div>
        )}

        {/* Form (embedded) – scrolls natively inside iframe */}
        {!url ? (
          <div className="mt-6 rounded-2xl border border-[#0a2540]/10 bg-[#fff6f6] p-6">
            <p className="text-[#8a1f1f] text-sm">
              This role is currently closed or the form isn’t configured yet. Please check back later.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl overflow-hidden border border-[#0a2540]/10">
            <iframe
              title={`${fullRoleName} — Application`}
              src={url}
              style={{ width: "100%", height: "1800px", border: 0 }}
              scrolling="yes"
              loading="lazy"
            />
          </div>
        )}
      </section>
    </div>
  );
}

// // -------------------------------- INTERN SPOTLIGHT (inline) ------------------
// const INTERN_SPOTLIGHT_ENDPOINT =
//   "https://script.google.com/macros/s/AKfycby_qM3TelGESa5rDvgTril1G3PxDOkhzlDKm5AWdbECT0K6raFD-tXCbJzmXMp4QcVB/exec";
// // ^ replace with your Apps Script "exec" URL if different

// type SpotlightItem = {
//   name: string;
//   role: string;
//   country?: string;
//   cohort?: string;
//   linkedin?: string;
//   github?: string;
//   project?: string;
//   quote?: string;
//   photo?: string; // full URL to image
// };

// --------------------------- INTERN SPOTLIGHT (standalone page) ---------------------------
function InternSpotlightPage() {
  // Allow override via ?csv=...
  const CSV_URL_DEFAULT =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2Gmqh_aLTJR1WnCQkzjuFrWXh1e7ax33nZJI3eT1LP8T4Uladb-BbotNtYjlMnxqFZVBlVtXqq6PM/pub?gid=1261158396&single=true&output=csv";
  const csvParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("csv")
      : null;
  const CSV_URL = csvParam || CSV_URL_DEFAULT;

  type Row = {
    name: string;
    role: string;
    experience: string;
    country: string;
    linkedin: string;
    github: string;
  };

  const [all, setAll] = React.useState<Row[]>([]);
  const [filtered, setFiltered] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("All");
  const [country, setCountry] = React.useState("All");

  // ---- CSV Parser (handles quotes properly) ----
  function parseCSV(text: string): string[][] {
    const rows: string[][] = [];
    let cur = "";
    let row: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        row.push(cur);
        cur = "";
      } else if ((c === "\n" || c === "\r") && !inQuotes) {
        if (cur.length || row.length) {
          row.push(cur);
          rows.push(row);
        }
        cur = "";
        row = [];
        if (c === "\r" && text[i + 1] === "\n") i++;
      } else {
        cur += c;
      }
    }
    if (cur.length || row.length) {
      row.push(cur);
      rows.push(row);
    }
    return rows;
  }

  // ---- Load CSV ----
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(CSV_URL)
      .then((r) => {
        const ct = r.headers.get("content-type") || "";
        if (!r.ok || !ct.includes("text/csv")) throw new Error("CSV not accessible");
        return r.text();
      })
      .then((txt) => {
        if (cancelled) return;
        const rows = parseCSV(txt);
        if (!rows.length) {
          setAll([]);
          setLoading(false);
          return;
        }

        const header = (rows[0] || []).map((h) => h.trim().toLowerCase());
        const find = (key: string) =>
          header.findIndex((h) => h.includes(key) || h.startsWith(key));

        // Columns present:
        // Timestamp | Full Name | Email ID | Contact Number | Role | Experience | Photo URL | Linkedin Profile Link | Country
        const idxName = find("full name");
        const idxRole = find("role");
        const idxExp = find("experience");
        const idxLinked = find("linkedin");
        const idxCountry = find("country");
        const idxGit = find("github"); // optional, if you add a GitHub column later

        const out: Row[] = rows
          .slice(1)
          .map((r) => ({
            name: (r[idxName] || "").trim(),
            role: (r[idxRole] || "").trim(),
            experience: (r[idxExp] || "").trim(),
            country: (r[idxCountry] || "").trim(),
            linkedin: (r[idxLinked] || "").trim(),
            github: idxGit >= 0 ? (r[idxGit] || "").trim() : "",
          }))
          .filter((x) => x.name || x.role || x.linkedin);

        setAll(out);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load spotlight data");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [CSV_URL]);

  // ---- Filters ----
  React.useEffect(() => {
    const term = q.trim().toLowerCase();
    setFiltered(
      all.filter((x) => {
        const blob = [x.name, x.role, x.experience, x.country].join(" ").toLowerCase();
        const matchText = !term || blob.includes(term);
        const matchRole = role === "All" || x.role === role;
        const matchCountry = country === "All" || x.country === country;
        return matchText && matchRole && matchCountry;
      })
    );
  }, [all, q, role, country]);

  // ---- Helpers ----
  const unique = (arr: string[]) => Array.from(new Set(arr.filter(Boolean))).sort();
  const roles = ["All", ...unique(all.map((x) => x.role))];
  const countries = ["All", ...unique(all.map((x) => x.country))];

  // ---- Big story slider state (uses filtered -> falls back to all) ----
  const stories = filtered.length ? filtered : all;
  const [slide, setSlide] = React.useState(0);
  const go = (n: number) => {
    if (!stories.length) return;
    const m = (n + stories.length) % stories.length;
    setSlide(m);
  };

  // Auto-advance on md+ only (mobile swipe instead)
  React.useEffect(() => {
    if (!stories.length) return;
    if (typeof window !== "undefined" && window.innerWidth < 640) return; // disable auto play on mobile
    const id = setInterval(() => go(slide + 1), 4800);
    return () => clearInterval(id);
  }, [slide, stories.length]);

  // ---- Touch swipe for big slider (mobile) ----
  const touchStartX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    // threshold
    if (delta > 40) go(slide - 1);
    if (delta < -40) go(slide + 1);
    touchStartX.current = null;
  };

  // ---- Auto slider (small cards, no photos) ----
  const autoList = stories.slice(0, Math.max(10, Math.min(24, stories.length)));
  const [autoIndex, setAutoIndex] = React.useState(0);

  // Auto scroll for md+; on mobile it's scroll-snap by drag
  React.useEffect(() => {
    if (!autoList.length) return;
    if (typeof window !== "undefined" && window.innerWidth < 640) return;
    const id = setInterval(() => setAutoIndex((i) => (i + 1) % autoList.length), 2800);
    return () => clearInterval(id);
  }, [autoList.length]);

  return (
    <div className="bg-[#0a2540] text-white">
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#0a2540] to-[#0d325a] px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold">From Interns to Innovators</h1>
          <p className="mt-1 sm:mt-2 text-white/80 text-sm sm:text-base">
            Discover inspiring journeys and real experiences from Technocolabs talent across the globe.
          </p>
        </div>
      </section>

      {/* FILTERS (above big slider) */}
      <section className="px-5 sm:px-8 lg:px-12 pt-5 pb-6">
        <div className="max-w-7xl mx-auto grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {/* Search */}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, role, country…"
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/50 text-sm sm:text-base"
          />

          {/* Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm sm:text-base"
          >
            <option value="All" style={{ color: "#1E90FF", backgroundColor: "#0a2540" }}>
              Roles
            </option>
            {roles
              .filter((r) => r !== "All")
              .map((r) => (
                <option
                  key={r}
                  value={r}
                  style={{ color: "#f7f7f7", backgroundColor: "#0a2540" }}
                >
                  {r}
                </option>
              ))}
          </select>

          {/* Country */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm sm:text-base"
          >
            <option value="All" style={{ color: "#1E90FF", backgroundColor: "#0a2540" }}>
              Country
            </option>
            {countries
              .filter((c) => c !== "All")
              .map((c) => (
                <option
                  key={c}
                  value={c}
                  style={{ color: "#f7f7f7", backgroundColor: "#0a2540" }}
                >
                  {c}
                </option>
              ))}
          </select>

          {/* Reset */}
          <button
            onClick={() => {
              setQ("");
              setRole("All");
              setCountry("All");
            }}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white hover:bg-white/10 text-sm sm:text-base"
          >
            Reset
          </button>
        </div>
      </section>

      {/* BIG STORY SLIDER (mobile swipe) */}
      <section className="px-5 sm:px-8 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-24 mb-3" />
              <div className="h-3 bg-white/10 rounded w-full mb-2" />
              <div className="h-3 bg-white/10 rounded w-3/4 mb-6" />
              <div className="h-5 bg-white/10 rounded w-40" />
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-900/20 p-4 text-sm">
              Failed to load data: {error}
            </div>
          )}

          {!loading && !error && stories.length > 0 && (
            <div
              className="rounded-2xl bg-white/5 border border-white/10 p-5 sm:p-6"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {/* Chips */}
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                {stories[slide].country && (
                  <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1">
                    {stories[slide].country}
                  </span>
                )}
                {stories[slide].role && (
                  <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1">
                    {stories[slide].role}
                  </span>
                )}
              </div>

              {/* Paragraph */}
              <p className="mt-3 sm:mt-4 text-white/90 text-sm sm:text-base leading-relaxed">
                {stories[slide].experience}
              </p>

              {/* Name */}
              <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-bold">
                {stories[slide].name}
              </h2>

              {/* CTA */}
              <div className="mt-4 sm:mt-5">
                {!!stories[slide].linkedin && (
                  <a
                    href={stories[slide].linkedin}
                    target="_blank"
                    className="inline-block bg-white text-[#0a2540] font-semibold px-4 py-2 rounded-xl text-sm"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              {/* Dots (mobile) */}
              <div className="mt-5 flex sm:hidden items-center gap-1.5">
                {stories.slice(0, 6).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide ? "w-6 bg-white" : "w-2 bg-white/30"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Controls (desktop) */}
              <div className="mt-5 hidden sm:flex items-center gap-2">
                <button
                  onClick={() => go(slide - 1)}
                  className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/15"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-white/60 transition-[width]"
                    style={{ width: `${((slide + 1) / stories.length) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => go(slide + 1)}
                  className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/15"
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AUTO SPOTLIGHT (scroll-snap on mobile, auto on md+) */}
      <section className="px-5 sm:px-8 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3">Global Interns Stories</h3>

          {/* MOBILE: scroll-snap - DESKTOP: auto-translate */}
          <div className="relative">
            <div
              className={`
                sm:hidden overflow-x-auto no-scrollbar snap-x snap-mandatory
                flex gap-3 pb-1
              `}
            >
              {autoList.map((x, i) => (
                <div
                  key={i}
                  className="snap-start w-64 shrink-0 rounded-xl bg-white/5 border border-white/10 p-4"
                >
                  <div className="font-semibold truncate">{x.name}</div>
                  <div className="text-xs text-white/70 truncate">
                    {x.role} · {x.country}
                  </div>
                  {!!x.linkedin && (
                    <a
                      href={x.linkedin}
                      target="_blank"
                      className="mt-3 inline-block text-xs bg-white text-[#0a2540] px-2 py-1 rounded-lg"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* md+ auto slide */}
            <div className="hidden sm:block rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${autoIndex * 260}px)`,
                  width: `${autoList.length * 260}px`,
                }}
              >
                {autoList.map((x, i) => (
                  <div
                    key={i}
                    className="w-60 shrink-0 rounded-xl bg-white/5 border border-white/10 p-4"
                  >
                    <div className="font-semibold truncate">{x.name}</div>
                    <div className="text-xs text-white/70 truncate">
                      {x.role} · {x.country}
                    </div>
                    {!!x.linkedin && (
                      <a
                        href={x.linkedin}
                        target="_blank"
                        className="mt-3 inline-block text-xs bg-white text-[#0a2540] px-2 py-1 rounded-lg"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="px-5 sm:px-8 lg:px-12 pb-12">
        <div className="max-w-7xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((x, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 hover:bg-white/10 transition"
            >
              <div className="text-lg sm:text-xl font-semibold truncate">{x.name}</div>
              <div className="text-xs sm:text-sm text-white/70 truncate">
                {x.role} · {x.country}
              </div>
              <p className="mt-3 text-sm text-white/80 line-clamp-3">{x.experience}</p>

              <div className="mt-3 flex gap-2">
                {!!x.linkedin && (
                  <a
                    href={x.linkedin}
                    target="_blank"
                    className="inline-block bg-white text-[#0a2540] px-3 py-1.5 rounded-lg text-xs sm:text-sm"
                  >
                    LinkedIn
                  </a>
                )}
                {!!x.github && (
                  <a
                    href={x.github}
                    target="_blank"
                    className="inline-block bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg text-xs sm:text-sm"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


// --------------------------- SPOTLIGHT APPLY (inline page) ---------------------------
function SpotlightApplyPage() {
  // ✅ Use your deployed Apps Script /exec URL (not /dev)
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby7BRgIEN7kFIiFgS_I1gznFi3ursCnUrthlY4HBy15Aa_wzS0K7f5Q963SekKXqIJ8IA/exec";

  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false); // 👈 show blue tick screen
  const [wordCount, setWordCount] = React.useState(0);

  // Keep in sync with your Google Form options
  const roles = [
    "Data Scientist",
    "Data Analyst",
    "Machine Learning Engineer",
    "Business Intelligence Developer",
    "Python Developer",
    "AI Engineer",
    "Deep Learning Engineer",
    "Computer Vision Engineer",
    "Full Stack Developer",
  ];

  // Normalize Google Drive “share” links
  const normalizeDriveUrl = (url: string) => {
    try {
      const u = new URL(url);
      const m1 = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (m1 && m1[1]) return `https://drive.google.com/file/d/${m1[1]}/view`;
      const id = u.searchParams.get("id");
      if (id) return `https://drive.google.com/file/d/${id}/view`;
      return url;
    } catch {
      return url;
    }
  };

  const countWords = (v: string) => (v.trim().match(/\S+/g) || []).length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Soft min length
    const exp = String(fd.get("experience") || "");
    const words = countWords(exp);
    setWordCount(words);
    if (words < 20) {
      setSubmitting(false);
      setErrorMsg("Please write at least ~20 words so we can feature you properly.");
      return;
    }

    // Normalize Google Drive link if possible
    const photo = String(fd.get("photoUrl") || "");
    if (photo) fd.set("photoUrl", normalizeDriveUrl(photo));

    // Helpful context (optional)
    fd.append("page", window.location.href);
    fd.append("ua", navigator.userAgent);

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: fd,
        mode: "cors",
        headers: { Accept: "application/json" },
        credentials: "omit",
      });

      // Prefer JSON, but fall back to text
      let data: any = {};
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try { data = JSON.parse(text || "{}"); } catch { data = {}; }
      }

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      // ✅ Success
      setSubmitted(true);
      form.reset();
      setWordCount(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg("❌ Submit failed: " + (err?.message || String(err)));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white text-[#0a2540] min-h-screen">
      {/* HERO */}
      <section className="bg-[#0a2540] text-white py-10 sm:py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Technocolabs Intern Spotlight — Submit Your Profile
          </h1>
          <p className="mt-3 text-white/80">
            Share your achievements of your internship journey so we can feature you on our official Spotlight page.
          </p>
        </div>
      </section>

      {/* SUCCESS SCREEN (blue tick) */}
      {submitted ? (
        <section className="max-w-3xl mx-auto px-6 py-10">
          <div className="rounded-2xl border border-[#1e90ff33] bg-[#1e90ff0d] p-8 text-center">
            {/* Blue tick */}
            <div className="mx-auto mb-4 h-14 w-14 rounded-full border-4 border-[#1e90ff] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="#1e90ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#0a2540]">Successfully submitted</h2>
            <p className="mt-2 text-sm text-[#0a2540]/70">
              You can check your spotlight in 1–2 days on our Intern Spotlight official page.
            </p>
            <div className="mt-6">
              <a
                href="/spotlight"
                className="inline-flex items-center justify-center rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg"
              >
                Go to Intern Spotlight
              </a>
            </div>
          </div>
        </section>
      ) : (
        // FORM
        <section className="max-w-3xl mx-auto px-6 py-8">
          {errorMsg && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200"
            >
              {errorMsg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium">Full Name*</label>
                <input
                  name="fullName"
                  required
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="Your full name"
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Email ID*</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Contact Number</label>
                  <input
                    name="phone"
                    className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                    placeholder="+91 ..."
                  />
                </div>
              </div>

              {/* Role (radio list) */}
              <div>
                <div className="block text-sm font-medium mb-2">Role*</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <label
                      key={r}
                      className="inline-flex items-center gap-3 rounded-xl border border-[#0a2540]/20 px-3 py-2 hover:bg-[#0a2540]/[0.03] cursor-pointer"
                    >
                      <input type="radio" name="role" value={r} required className="accent-[#1e90ff]" />
                      <span className="text-sm">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium">
                  Write about your internship domain, the tech stack you’ll be working with, and what excites you most
                  about this opportunity. (≈150 words)*
                </label>
                <textarea
                  name="experience"
                  required
                  rows={6}
                  onChange={(e) => setWordCount(countWords(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="Example: During my internship at Technocolabs, I will be working in Data Analytics, using Python, pandas, SQL, Power BI/Tableau..."
                />
                <div className="mt-1 text-xs text-[#0a2540]/60">Word count: {wordCount} (soft target ≈150)</div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium">Photo URL*</label>
                <input
                  name="photoUrl"
                  type="url"
                  required
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="https://drive.google.com/file/d/.../view"
                />
                <p className="text-xs text-[#0a2540]/60 mt-1">
                  Make sure the link is public (Google Drive/Dropbox/etc.). We’ll normalize Google Drive links
                  automatically.
                </p>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium">LinkedIn Profile*</label>
                <input
                  name="linkedin"
                  type="url"
                  required
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium">Country*</label>
                <input
                  name="country"
                  required
                  className="mt-1 w-full rounded-xl border border-[#0a2540]/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"
                  placeholder="India, USA, UAE, etc."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`mt-2 inline-flex items-center justify-center rounded-xl w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white shadow-sm ${
                  submitting ? "bg-[#1e90ff]/60 cursor-not-allowed" : "bg-[#1e90ff] hover:shadow-lg"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Spotlight"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}


/// --------------------------- APP -------------------------------------------
// read optional slug after "/:tab"
const roleSlug =
  typeof window !== "undefined"
    ? (window.location.pathname.split("/")[2] || "")
    : "";

// --------------------------- APP -------------------------------------------
export default function App() {
  // 🔗 Read params from the URL
  const { tab: tabParam, roleId } = useParams();
  const routerNavigate = useNavigate();

  const VALID_TABS = new Set<Tab>([
    'home','services','service','careers','contact','apply','svc','privacy','terms','cookies',
    'bigdata','data-architecture','data-warehouse','bi-visualization','predictive-analytics-bd',
    'cloud-services','about','success-stories','blog','write-for-us','verify',
    'applications-closed','apply-form','spotlight','spotlight-apply' // ✅ spotlight included
  ]);

  // ✅ If roleId exists (route is /apply-form/:roleId), force 'apply-form'
  const routeTab: Tab = roleId
    ? 'apply-form'
    : (tabParam && VALID_TABS.has(tabParam as Tab))
      ? (tabParam as Tab)
      : 'home';

  // 🧠 State stays the same, but initializes from the URL
  const [tab, setTab] = useState<Tab>(routeTab);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [activeServicePage, setActiveServicePage] = useState<string | null>(null);
  const [applyRole, setApplyRole] = useState<string>('Data Science Internship');

  // 🔁 Keep state in sync if user changes the URL (or clicks a Link)
  useEffect(() => {
    if (tab !== routeTab) setTab(routeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeTab]);

  // 🧭 Navigate + update URL
  const navigate = (t: Tab) => {
    setTab(t);
    routerNavigate(t === 'home' ? '/' : `/${t}`);
  };

  // Keep your originals (no URL change)
  const openDetail = (slug: string | null) => { setActiveService(slug); setTab('service'); };
  const openServicePage = (slug: string) => { setActiveServicePage(slug); setTab('svc'); };

  // ✅ Map roleId → human-readable role title for /apply-form/:roleId
  const ROLE_ID_TO_TITLE: Record<string, string> = {
    genai: 'Generative AI Engineer Intern',
    py: 'Python Developer Intern',
    dl: 'Deep Learning Engineer Intern',
    cv: 'Computer Vision Engineer Intern',
    ba: 'Business Analyst Intern',
    ds: 'Data Science Intern',
    ml: 'Machine Learning Intern',
    web: 'Web Development Intern',
    da: 'Data Analytics Intern',
    bi: 'Business Intelligence Intern',
    ai: 'Artificial Intelligence Intern',
    se: 'Software Engineering Intern',
    cyber: 'CyberSecurity Engineer Intern',
  };

  useEffect(() => {
    if (routeTab === 'apply-form') {
      const title = roleId ? ROLE_ID_TO_TITLE[roleId] : undefined;
      if (title) setApplyRole(title);
    }
  }, [routeTab, roleId]);

  // --------- render current tab ----------
  let content: React.ReactNode = null;
  if (tab === 'home') content = <HomePage />;
  if (tab === 'services') content = <ServicesPage />;
  if (tab === 'service') content = <ServiceDetailPage />;
  if (tab === 'careers') content = <CareersPage />;
  if (tab === 'contact') content = <ContactPage />;
  // if (tab === 'apply') content = <ApplyPage />;
  if (tab === 'svc') content = <StandaloneServicePage />;
  if (tab === 'privacy') content = <PrivacyPolicyPage />;
  if (tab === 'terms') content = <TermsPage />;
  if (tab === 'cookies') content = <CookiePolicyPage />;
  if (tab === 'bigdata') content = <BigDataDevelopmentPage />;
  if (tab === 'data-architecture') content = <DataArchitecturePage />;
  if (tab === 'data-warehouse') content = <DataWarehousePage />;
  if (tab === 'bi-visualization') content = <BIVisualizationPage />;
  if (tab === 'predictive-analytics-bd') content = <PredictiveAnalyticsBDPage />;
  if (tab === 'cloud-services') content = <CloudServicesPage />;
  if (tab === 'about') content = <AboutPage />;
  if (tab === 'success-stories') content = <SuccessStoriesPage />;
  if (tab === 'blog') content = <BlogPage />;
  if (tab === 'write-for-us') content = <WriteForUsPage />;
  if (tab === 'verify') content = <VerifyInternshipPage />;
  if (tab === 'applications-closed') content = <ApplicationsClosedPage />;
  if (tab === 'spotlight-apply') content = <SpotlightApplyPage />;


  // ✅ FIX: pass roleId (not roleSlug)
  if (tab === 'apply-form') content = <ApplyFormEmbedPage roleId={roleId} />;

  // ✅ Spotlight standalone page
  if (tab === 'spotlight') content = <InternSpotlightPage />;

  return (
    <CurrentTabContext.Provider value={tab}>
      <NavContext.Provider value={navigate}>
        <ServicePageSetterContext.Provider value={openServicePage}>
          <ServiceDetailContext.Provider value={openDetail}>
            <ApplyRoleSetterContext.Provider value={setApplyRole}>
              <ActiveApplyRoleContext.Provider value={applyRole}>
                <ActiveServicePageContext.Provider value={activeServicePage}>
                  <ActiveServiceContext.Provider value={activeService}>
                    <div className="min-h-screen bg-white">
                      <TopBar />
                      <NavBar />
                      <main className="pt-24">{content}</main>
                      <Footer />
                      <FloatingCTA />
                    </div>
                  </ActiveServiceContext.Provider>
                </ActiveServicePageContext.Provider>
              </ActiveApplyRoleContext.Provider>
            </ApplyRoleSetterContext.Provider>
          </ServiceDetailContext.Provider>
        </ServicePageSetterContext.Provider>
      </NavContext.Provider>
    </CurrentTabContext.Provider>
  );
}

// --------------------------- ROUTER MOUNT ---------------------------

