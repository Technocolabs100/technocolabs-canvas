import React, { useMemo, useState, useContext, useEffect } from "react";
import AIServicePremiumGrid from "./AIServicePremiumGrid";

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
type Tab = 'home' | 'services' | 'service' | 'svc' | 'careers' | 'contact' | 'apply' | 'privacy' | 'terms' | 'cookies'| 'bigdata' | 'data-architecture' | 'data-warehouse'| 'bi-visualization' | 'predictive-analytics-bd' | 'cloud-services'| 'about' | 'success-stories' | 'blog' | 'write-for-us';
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="max-w-3xl">
            
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">Central India’s AI Solutions & Strategic Consulting Company</span>
            <p className="text-sm md:text-base font-medium text-blue-300 mt-4 flex items-center gap-2">
  <span role="img" aria-label="award">🏆</span>
  Proudly ranked #1 in Indore, India & awarded HackerNoon’s Startup of the Year 2024</p>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Empowering the Next Generation of Innovators 🚀</h1>
            <p className="mt-5 text-lg text-white/80">We are Central India's leading IT Development and Consulting Company - building AI, Data Science, and Software solutions that transform industries.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={() => navigate('services')} className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold shadow-sm hover:shadow-lg">Explore Our Services <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => navigate('careers')} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10">Join Our Internship</button>
              
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
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

    {/* Quote + Top icon aligned to end of first line */}
    <div className="max-w-4xl mx-auto relative flex justify-center">
      {/* Add right padding so the icon doesn't overlap the text */}
      <blockquote className="text-lg sm:text-xl leading-relaxed font-medium text-center pr-20 sm:pr-24">
        “AI is transforming how modern businesses learn, adapt, and innovate. It empowers organizations to turn data into intelligence, deliver personalized experiences, and drive meaningful change across every function.”
      </blockquote>

      {/* Top quote icon: slightly above, small gap from text, near end of first line */}
      <div
        className="hidden sm:block absolute -top-2 right-3 text-[#1e90ff]/20 select-none pointer-events-none"
        aria-hidden
      >
        <svg width="65" height="55" viewBox="0 0 120 100" fill="none">
          <path d="M30 10h30v30H40c0 11 9 20 20 20v30C37 90 20 70 20 45V10h10Z" fill="currentColor"/>
          <path d="M80 10h30v30H90c0 11 9 20 20 20v30C87 90 70 70 70 45V10h10Z" fill="currentColor"/>
        </svg>
      </div>
    </div>

    {/* Author Row + Bottom-left Quote Icon */}
    <div className="mt-6 mx-auto max-w-4xl flex items-center gap-4 justify-center relative">
      {/* Bottom-left icon (kept) */}
      <div className="pointer-events-none absolute -left-12 bottom-0 hidden select-none text-[#1e90ff]/20 lg:block" aria-hidden>
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
      <div className="text-left">
        <div className="text-base font-semibold">Yasin Shah</div>
        <div className="text-sm text-[#0a2540]/70">
          Director and CEO, Technocolabs Softwares Inc.
        </div>
      </div>
    </div>
  </div>
</section>
     
       {/* Insert Mission Section */}
<section className="relative overflow-hidden bg-[#06213C]">
  <MissionNetworkBG count={100} linkDistance={95} speed={0.18} dotRadius={1.8} />
 <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Our Mission is to Bring the Power of AI to Every Business</h2>
<p className="mt-5 text-base sm:text-lg text-white/85">
We are a data science and analytics consulting firm delivering AI‑powered solutions to companies that want to
leverage data and machine learning algorithms for business value.
</p>
<p className="mt-4 text-base sm:text-lg text-white/85">
As an artificial intelligence company, we focus on AI and Big Data software development. We help businesses
innovate with AI, enrich customer insights, automate processes, and operate more cost‑efficiently.
</p>
</div>
</section>

      {/* How We Can Help You (replaces Featured Services) */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">How We Can Help You</h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-[#0a2540]/70">We welcome opportunities to work alongside different teams over projects of any complexity. By working together, we will develop new systems, solutions, and products to separate you from your competition.</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e90ff]/10 text-[#1e90ff]"><MessageSquareText className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">AI/ML Strategy & Consulting</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">Have a project idea and need help implementing it? We're here to consult you and share our knowledge to help you avoid all unnecessary pitfalls.</p>
            </div>
            {/* Card 2 */}
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-500"><Sparkles className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">PoC of AI-Based Solution</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">POC is an essential step before adopting any AI solution. If you have a project idea, our data science consultants will verify that your concept has potential.</p>
            </div>
            {/* Card 3 */}
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600"><Rocket className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">MVP of AI-Based Product</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">Need a breakthrough AI product? We'll start with a version of just enough features to satisfy early customers and provide feedback for product development.</p>
            </div>
            {/* Card 4 */}
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600"><Database className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">Custom Model Development</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">We can build and train custom models for your business needs, or retrain your existing ones (open-source and proprietary) for better efficiency and scalability.</p>
            </div>
            {/* Card 5 */}
            <div className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><Settings2 className="h-6 w-6" /></div>
              <h3 className="mt-4 text-lg font-semibold">AI Software Development</h3>
              <p className="mt-2 text-sm text-[#0a2540]/70">If you need to develop an innovative web application from scratch, or empower the existing one with AI capabilities, let our experts help you.</p>
            </div>
            {/* Card 6 */}
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
{/* dotted decorative background */}
<div
className="absolute inset-0 -z-10"
aria-hidden
style={{
backgroundImage:
'radial-gradient(rgba(255,163,77,0.25) 1.6px, transparent 1.6px)',
backgroundSize: '20px 20px',
maskImage:
'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0) 100%)'
}}
/>
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Beneficial Results of Artificial Intelligence in Business</h2>
<p className="mt-3 max-w-3xl mx-auto text-center text-[#0a2540]/70">Real outcomes teams see after adopting AI and data-driven workflows.</p>


<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{[{
value:'83%',
label:'of companies claim AI as a strategic business priority'
},{
value:'85%',
label:'of customer service interactions are responded to by chatbots'
},{
value:'40%',
label:'improvement in business efficiency with AI'
}].map((item)=> (
<div key={item.value} className="group rounded-2xl border border-[#0a2540]/10 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300">
<div className="text-5xl font-semibold text-[#1e90ff] tracking-tight text-center">{item.value}</div>
<div className="mx-auto mt-3 h-[2px] w-20 bg-[#1e90ff]/50" />
<p className="mt-4 text-center text-sm sm:text-base text-[#0a2540]/80 leading-relaxed">{item.label}</p>
</div>
))}
</div>


{/* extra row (optional) — easy to enable later */}
{/* <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
{['↓ time-to-insight','↑ revenue per user','↓ operational cost','↑ CSAT'].map((b)=> (
<div key={b} className="rounded-xl border border-[#0a2540]/10 bg-white/80 backdrop-blur p-4 text-center text-sm">{b}</div>
))}
</div> */}
</div>
</section>
  
       {/* ✅ New Orbit Section */}
<AIServicePremiumGrid />

      {/* Why Partner With Us */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Why Partner with Technocolabs</h2>
          <p className="mt-4 max-w-4xl mx-auto text-center text-[#0a2540]/70">With years of AI software development behind us, we keep learning and strengthening our expertise. We’re innovation‑driven and help our clients adopt disruptive technologies that create real business value.</p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1 */}
            <div className="text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Brain className="h-7 w-7"/></div>
              <div className="mt-4 text-base font-semibold">Strong AI Service Company</div>
              <p className="mt-2 text-sm text-[#0a2540]/70">Broad experience in AI development services and a diverse portfolio.</p>
            </div>
            {/* 2 */}
            <div className="text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><BadgeCheck className="h-7 w-7"/></div>
              <div className="mt-4 text-base font-semibold">Utmost Quality</div>
              <p className="mt-2 text-sm text-[#0a2540]/70">Focused on quality, intended to create exceptional value for our clients.</p>
            </div>
            {/* 3 */}
            <div className="text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e90ff]/10 text-[#1e90ff]"><Star className="h-7 w-7"/></div>
              <div className="mt-4 text-base font-semibold">Customer Orientation</div>
              <p className="mt-2 text-sm text-[#0a2540]/70">Meeting your needs and suggesting improvements that move the project forward.</p>
            </div>
            {/* 4 */}
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

      {/* Contact preview (kept on Home) */}
      <ContactPreview />
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

// --------------------------- CONTACT PREVIEW -------------------------------
function ContactPreview() {
  return (
    <section id="contact" className="bg-white text-[#0a2540]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">Let's build something great</h3>
            <p className="mt-3 text-[#0a2540]/70">We combine learning and real-world projects to nurture future-ready professionals and deliver cutting-edge AI and ML products to clients worldwide. Tell us about your project or training needs. Our team will get back within 1-2 business days.</p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a href="mailto:contact@technocolabs.com" className="inline-flex items-center gap-2 hover:underline"><Mail className="h-4 w-4" /> contact@technocolabs.com</a>
              <div className="flex items-center gap-4 mt-2">
                <a aria-label="LinkedIn" href={SOCIAL_LINKS.linkedin} className="hover:text-[#1e90ff]"><Linkedin className="h-5 w-5" /></a>
                <a aria-label="Instagram" href={SOCIAL_LINKS.instagram} className="hover:text-[#1e90ff]"><Instagram className="h-5 w-5" /></a>
                <a aria-label="Facebook" href={SOCIAL_LINKS.facebook} className="hover:text-[#1e90ff]"><Facebook className="h-5 w-5" /></a>
                <a aria-label="GitHub" href={SOCIAL_LINKS.github} className="hover:text-[#1e90ff]"><Github className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
          <form className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea rows={4} className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]" placeholder="How can we help?" />
              </div>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg">Send Message <ArrowRight className="h-4 w-4" /></button>
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

// --------------------------- CAREERS (upgraded) ----------------------------
function CareersPage() {
  const navigate = useContext(NavContext);
  const setApplyRoleCtx = useContext(ApplyRoleSetterContext);

  type Role = {
    id: string;
    title: string;
    domain: string;
    duration: string;
    mode: string;
    jd: string;
    responsibilities: string[];
    requirements: string[];
  };

  const ROLES: Role[] = [
    { id: 'genai', title: 'Generative AI Engineer Intern', domain: 'Generative AI', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Work on LLM-powered features: prompt engineering, embeddings, RAG pipelines, and evaluation. You will prototype, measure, and iterate with mentors to ship features into real apps.', responsibilities: ['Build and evaluate LLM pipelines (chat, Q&A, summarization)','Implement retrieval with vector stores and embeddings','Design/evaluate prompts; collect feedback and improve outputs','Integrate models with web backends/APIs','Document experiments and results'], requirements: ['Strong Python; basics of JS/TypeScript a plus','NLP/LLM concepts (tokenization, embeddings, context windows)','Hands-on with HuggingFace/LangChain/LlamaIndex (any)','Familiar with OpenAI/transformer models; basic CI/Git','Good communication and curiosity to experiment'] },
    { id: 'py', title: 'Python Developer Intern', domain: 'Software Development', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Contribute to backend services, APIs, automation scripts, and internal tools built with Python. Focus on clean code, testing, and shipping maintainable features.', responsibilities: ['Build REST APIs and background jobs','Write reusable, tested modules and CLI tools','Work with databases (SQL/ORM) and caching','Instrument logging and basic monitoring','Participate in code reviews and sprint rituals'], requirements: ['Solid Python fundamentals (typing, packaging, venv)','Experience with FastAPI/Flask or Django (any one)','SQL knowledge (Postgres/MySQL) and Git','Basics of Docker and HTTP/REST','Clear communication and documentation'] },
    { id: 'dl', title: 'Deep Learning Engineer Intern', domain: 'Machine Learning', duration: '8–12 weeks', mode: 'Remote', jd: 'Prototype and train deep learning models for CV/NLP tasks. You will run experiments, tune models, and profile/optimize inference.', responsibilities: ['Prepare datasets; implement training loops and evaluation','Experiment with CNNs/Transformers; track metrics','Optimize models (quantization/distillation) for deployment','Create clear experiment reports and dashboards','Collaborate with MLOps for reproducibility'], requirements: ['Python + PyTorch or TensorFlow','Linear algebra, optimization, and DL basics','GPU workflows (Colab/Kaggle/Local CUDA) basics','Version control with Git; clean coding habits','Good math/analysis and curiosity'] },
    { id: 'cv', title: 'Computer Vision Engineer Intern', domain: 'Computer Vision', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Build CV pipelines: detection, segmentation, OCR, and visual search. You will work with datasets, augmentations, training, and deployment.', responsibilities: ['Collect/clean/augment image/video datasets','Train and evaluate models (YOLO/Detectron/Segmentation)','Deploy inference services and measure accuracy/latency','Write reusable preprocessing and visualization tools','Document results and share learnings with the team'], requirements: ['Python; PyTorch/TensorFlow; OpenCV basics','Understanding of CNNs and metrics (mAP/IoU)','Experience with one CV framework (e.g., YOLO family)','Basics of Docker; comfort with Linux/CLI','Strong problem-solving and communication'] },
    { id: 'ba', title: 'Business Analyst Intern', domain: 'Analytics', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Translate business questions into analysis plans, build dashboards, and communicate insights that drive decisions.', responsibilities: ['Gather requirements and define KPIs','Explore and clean data; build analyses and reports','Create dashboards (Power BI/Tableau) for stakeholders','Write concise docs: findings, risks, recommendations','Collaborate with engineering to instrument events'], requirements: ['SQL proficiency; spreadsheet skills','Experience with Power BI/Tableau/Looker (any)','Comfort with basic statistics and A/B testing concepts','Clear written/verbal communication','Attention to detail and business empathy'] },

    // Previous roles
    { id: 'ds', title: 'Data Science Intern', domain: 'Data Science', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Explore data, build features, and deliver predictive insights with robust evaluation and reporting.', responsibilities: ['EDA and feature engineering','Train/evaluate baseline models','Visualize and communicate insights','Write clean notebooks and reports','Collaborate with cross‑functional teams'], requirements: ['Python & pandas/scikit-learn','Statistics & ML basics','Data visualization (Matplotlib/Plotly)','SQL fundamentals','Git & documentation'] },
    { id: 'ml', title: 'Machine Learning Intern', domain: 'Machine Learning', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Implement ML pipelines from data prep to model evaluation and iterate to improve performance.', responsibilities: ['Feature pipelines & model training','Hyperparameter tuning','Model evaluation and reporting','Collaborate on deployment readiness','Maintain experiment logs'], requirements: ['Python, scikit-learn','Basic ML theory','Version control (Git)','Jupyter/Notebooks','Clear communication'] },
    { id: 'web', title: 'Web Development Intern', domain: 'Web Development', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Build responsive frontends and simple backends using modern JavaScript frameworks and REST APIs.', responsibilities: ['Implement UI from designs','Connect to REST APIs','Write reusable components','Fix bugs and improve UX','Participate in reviews'], requirements: ['HTML/CSS/JavaScript','React basics','Git & npm','Understanding of HTTP/REST','Attention to UI detail'] },
    { id: 'da', title: 'Data Analytics Intern', domain: 'Analytics', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Turn raw data into insight with SQL, dashboards, and clear narratives for stakeholders.', responsibilities: ['Clean/transform datasets','Create reports & dashboards','Define and track KPIs','Present findings to teams','Document data sources'], requirements: ['SQL proficiency','Power BI/Tableau','Spreadsheet skills','Basic statistics','Communication'] },
    { id: 'bi', title: 'Business Intelligence Intern', domain: 'BI & Reporting', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Build and maintain BI models and dashboards for self‑serve analytics and decision‑making.', responsibilities: ['Model data for BI','Build reports/dashboards','Ensure data quality','Optimize refresh & performance','Write documentation'], requirements: ['Power BI/Tableau/Looker (any)','SQL & data modeling','DAX/LookML basics (any)','Versioning & governance','Stakeholder comms'] },
    { id: 'ai', title: 'Artificial Intelligence Intern', domain: 'AI', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Research and prototype AI solutions across NLP/CV/recommendation tasks with mentorship.', responsibilities: ['Literature review & baselines','Train & evaluate models','Data preparation and labeling','Write experiment reports','Share demos with team'], requirements: ['Python + ML libraries','NLP/CV basics','Math for ML (probability)','Git & notebooks','Curiosity to learn'] },
    { id: 'se', title: 'Software Engineering Intern', domain: 'Software Engineering', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Assist with backend/frontend tasks, tests, CI and documentation on production projects.', responsibilities: ['Implement features/bugfixes','Write unit/integration tests','Participate in code reviews','Improve app performance','Document changes clearly'], requirements: ['One backend or frontend stack','Git & testing basics','Clean code habits','Understanding of CI/CD','Team communication'] },
    { id: 'cyber', title: 'CyberSecurity Engineer Intern', domain: 'Security', duration: '8–12 weeks', mode: 'Remote/On-site', jd: 'Support security reviews, vulnerability scanning, and secure‑by‑design practices.', responsibilities: ['Run vulnerability scans','Assist in threat modeling','Fix/track security issues','Document security policies','Raise security awareness'], requirements: ['Security fundamentals (OWASP)','Scripting (Python/JS) basics','Linux/Networking basics','Understanding of auth/identity','Attention to detail'] },
  ];

  return (
    <div className="bg-[#0a2540] text-white">
      {/* Hero */}
      <section className="relative overflow-clip">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Careers & Internships</h1>
          <p className="mt-3 max-w-3xl text-white/80">Explore open Positions for Full-Time and internship domains and kickstart your tech career with Technocolabs.</p>
        </div>
      </section>

      {/* Why Join Technocolabs */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Why Join Technocolabs?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[['Real Industry Projects','Work on production‑grade problems that ship.'],['Mentorship Culture','1:1 guidance from experienced engineers.'],['Career Fast‑Track','Portfolio, certificates and referrals.'],['Innovation‑Driven','Hands‑on with GenAI, ML, MLOps & Cloud.'],['Global Community','Collaborate with peers across countries.'],['Flexible & Remote','Work from anywhere, async‑friendly.']].map(([t,s]) => (
              <div key={t} className="rounded-2xl border border-[#0a2540]/10 p-6">
                <div className="font-semibold">{t}</div>
                <div className="mt-1 text-sm text-[#0a2540]/70">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="bg-[#081a2f] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Perks & Benefits</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {['Flexible hours','Remote friendly','Certificate of completion','Letter of recommendation','Live project experience','Resume/LinkedIn support','GitHub portfolio building','Mock interview support','Mentor office hours'].map((p)=>(
              <div key={p} className="rounded-2xl border border-white/10 bg-white/5 p-5">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Roadmap */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">Career Growth Roadmap</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-5">
            {['Intern','Trainee Engineer','Junior Engineer','Associate','Senior Engineer'].map((t,i)=> (
              <div key={t} className="rounded-2xl border border-[#0a2540]/10 p-5 text-center">
                <div className="text-sm opacity-70">Stage {i+1}</div>
                <div className="mt-1 font-semibold">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Internships */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
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
                    <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">{r.responsibilities.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Requirements</div>
                    <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-[#0a2540]/80">{r.requirements.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-xl bg-[#0a2540]/5 px-3 py-1 text-xs font-medium">Duration: {r.duration}</span>
                  <span className="inline-flex items-center rounded-xl bg-[#0a2540]/5 px-3 py-1 text-xs font-medium">Mode: {r.mode}</span>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <button onClick={() => { setApplyRoleCtx(r.title); navigate('apply'); }} className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">Apply Now</button>
                  <button onClick={() => { const subject = encodeURIComponent(`Application: ${r.title}`); const body = encodeURIComponent(`Hello Technocolabs Team,

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

Thanks,`); window.location.href = `mailto:technocollabs@gmail.com?subject=${subject}&body=${body}`; }} className="text-sm font-medium text-[#1e90ff] hover:underline">Email Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="bg-[#081a2f] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Hiring Process</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {['Apply Online','Screening','Assignment / Interview','Final Selection','Offer & Onboarding'].map((t,i)=> (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm opacity-80">Step {i+1}</div>
                <div className="mt-1 font-semibold">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">What Our Interns Say</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['“I shipped a GenAI chatbot to production during my internship.”','— Priya S., GenAI Intern'],
              ['“The mentorship here is top‑tier. I learned more in 10 weeks than in a year.”','— Arjun M., Python Intern'],
              ['“My CV models now run realtime on edge thanks to the team.”','— Aisha K., CV Intern']
            ].map(([q,a])=> (
              <div key={a} className="rounded-2xl border border-[#0a2540]/10 p-6">
                <div className="text-sm">{q}</div>
                <div className="mt-3 text-xs text-[#0a2540]/70">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white text-[#0a2540]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">FAQ</h2>
          <div className="mt-6 space-y-3">
            {[
              ['Who can apply?','Students, recent grads, and early‑career professionals with passion for tech.'],
              ['Is it remote?','Yes. Roles are remote‑friendly unless a project needs on‑site presence.'],
              ['What is the duration?','Typically 8–12 weeks.'],
              ['Is there a registration fee?','Only after selection: 15 USD / 1150 INR (shared by email).'],
              ['Do I get a certificate?','Yes, plus a letter of recommendation for top performers.'],
              ['Is there a PPO?','Outstanding interns may be offered extended roles/PPO based on performance.']
            ].map(([q,a])=> (
              <details key={q} className="rounded-2xl border border-[#0a2540]/10 p-4">
                <summary className="font-semibold cursor-pointer">{q}</summary>
                <p className="mt-2 text-sm text-[#0a2540]/80">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Ready to start your journey?</div>
            <div className="text-white/80">View open roles or talk to our recruiter.</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white">View Roles</button>
            <button onClick={()=>navigate('contact')} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold">Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// --------------------------- APPLY ----------------------------------------- -----------------------------------------
function ApplyPage() {
  const navigate = useContext(NavContext);
  const role = useContext(ActiveApplyRoleContext);

  // Content to render for the selected role
  const ROLE_DETAILS: Record<string, { jd: string; responsibilities: string[]; requirements: string[]; }> = {
    'Generative AI Engineer Intern': { jd: 'Work on LLMs, embeddings, RAG and evaluation; prototype chat and knowledge features and integrate them into apps.', responsibilities: ['Build/evaluate LLM pipelines','RAG with vector stores','Prompt design & evaluation','Integrate with APIs/backends','Document experiments'], requirements: ['Python proficiency','HuggingFace/LangChain experience','NLP/LLM basics','Git, basics of Docker','Clear communication'] },
    'Python Developer Intern': { jd: 'Develop APIs, automation scripts and internal tools using Python — with a strong focus on quality and tests.', responsibilities: ['Build REST APIs','Write reusable modules','Work with SQL/ORM','Add logging/monitoring','Participate in reviews'], requirements: ['Python fundamentals','FastAPI/Flask or Django','SQL & Git','Basics of Docker','Good documentation'] },
    'Deep Learning Engineer Intern': { jd: 'Train and evaluate DL models for CV/NLP, optimize inference and create clear experiment reports.', responsibilities: ['Dataset prep and training','Experiment with CNN/Transformers','Optimize models for inference','Track metrics & visualize','Share results with team'], requirements: ['PyTorch/TensorFlow','DL theory basics','GPU workflows','Git proficiency','Analytical mindset'] },
    'Computer Vision Engineer Intern': { jd: 'Implement CV pipelines (detection/segmentation/OCR) and deploy reliable inference services.', responsibilities: ['Collect/clean/augment data','Train/evaluate CV models','Deploy inference services','Write preprocessing tools','Document results'], requirements: ['Python + OpenCV','PyTorch/TensorFlow','YOLO/Detectron experience','Docker basics','Problem-solving'] },
    'Business Analyst Intern': { jd: 'Turn data into decisions: gather requirements, build dashboards and communicate insights.', responsibilities: ['Define KPIs and questions','Prepare/clean data','Build dashboards in BI tools','Write concise reports','Collaborate with engineers'], requirements: ['SQL + spreadsheets','Power BI/Tableau/Looker','Basic stats/A-B testing','Strong communication','Attention to detail'] },
    'Data Science Intern': { jd: 'Explore data, build features and predictive models, and communicate insights clearly to stakeholders.', responsibilities: ['EDA and feature engineering','Model training and evaluation','Visualize results and KPIs','Write reports and docs','Collaborate across teams'], requirements: ['Python & pandas/sklearn','Statistics basics','Data viz tools','SQL','Git'] },
    'Machine Learning Intern': { jd: 'Implement ML pipelines and experiment with models to improve accuracy and robustness.', responsibilities: ['Features & training','Model selection/tuning','Cross-validation & metrics','Report results','Contribute to deployment readiness'], requirements: ['Python, sklearn','ML theory basics','Experiment tracking','Git','Communication'] },
    'Web Development Intern': { jd: 'Build responsive UI and connect to APIs in a modern JS stack.', responsibilities: ['Implement pages/components','Fetch from REST APIs','Fix UI bugs','Write clean code','Participate in reviews'], requirements: ['HTML/CSS/JS','React basics','Git','HTTP/REST','Attention to detail'] },
    'Data Analytics Intern': { jd: 'Create dashboards and analyses that guide decisions.', responsibilities: ['Clean/transform data','Create visuals & dashboards','Define KPIs','Share insights','Document sources'], requirements: ['SQL','Power BI/Tableau','Spreadsheets','Statistics basics','Comms'] },
    'Business Intelligence Intern': { jd: 'Model data and build BI dashboards with good governance.', responsibilities: ['Model for BI','Build/maintain reports','Monitor refresh & quality','Optimize performance','Write docs'], requirements: ['Power BI/Tableau/Looker','SQL','DAX/LookML (any)','Versioning','Stakeholder comms'] },
    'Artificial Intelligence Intern': { jd: 'Assist across AI tasks, from research to prototypes in NLP/CV.', responsibilities: ['Review papers & baselines','Train simple models','Prepare data','Write notebooks','Demo findings'], requirements: ['Python & ML libs','NLP/CV basics','Math basics','Git','Curiosity'] },
    'Software Engineering Intern': { jd: 'Support full‑stack development with tests and clean code.', responsibilities: ['Feature work & bug fixes','Unit/integration tests','Reviews and CI','Perf improvements','Documentation'], requirements: ['One stack (frontend/backend)','Git & tests','Clean code','CI/CD basics','Teamwork'] },
    'CyberSecurity Engineer Intern': { jd: 'Assist security reviews, fix issues, and promote best practices.', responsibilities: ['Run scans','Threat modeling assistance','Track fixes','Document policies','Awareness training'], requirements: ['OWASP basics','Scripting basics','Linux/Networking','Auth/Identity basics','Detail oriented'] },
  };

  const details = ROLE_DETAILS[role as keyof typeof ROLE_DETAILS];

  // Submit handler with API attempt + email fallback
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      role,
      country: String(fd.get('country') || ''),
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      university: String(fd.get('university') || ''),
      location: String(fd.get('location') || ''),
      portfolio: String(fd.get('portfolio') || ''),
      resume: String(fd.get('resume') || ''),
      availability: String(fd.get('availability') || ''),
      about: String(fd.get('about') || ''),
      agree: fd.get('agree') ? 'Yes' : 'No',
    };

    try {
      const res = await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        alert('Application submitted successfully! Our team will contact you soon.');
        form.reset();
        return;
      }
    } catch (err) { /* fall through to mailto */ }

    const subject = encodeURIComponent(`Internship Application: ${role}`);
    const body = encodeURIComponent(
`Hello Technocolabs Team,

I would like to apply for the ${role} internship.

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}
Country: ${payload.country}
University: ${payload.university}
Location/Time zone: ${payload.location}
Portfolio/GitHub/LinkedIn: ${payload.portfolio}
Resume link: ${payload.resume}
Start date & availability: ${payload.availability}
Agreement to registration fee (15 USD / 1150 INR): ${payload.agree}

About me:
${payload.about}

Thanks,
${payload.name}`);
    window.location.href = `mailto:technocollabs@gmail.com?subject=${subject}&body=${body}`;
  };

  return (<div className="bg-white text-[#0a2540]">
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-20 pb-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Apply for <span className="text-[#1e90ff]">{role}</span></h1>
        <p className="mt-2 text-[#0a2540]/70">Fill the form below to apply for the position. We will attempt to submit to the <code> Hiring Department</code>. If that's not submitted properly, your email app will open with all details, addressed to <strong>technocollabs@gmail.com</strong>.</p>
      </section>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Internship*</label><input name="role" readOnly value={role} className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-[#0a2540]/5 px-3 py-2"/></div>
            <div><label className="block text-sm font-medium">Country*</label><select name="country" required className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"><option value="">Select country</option><option value="AF">🇦🇫 Afghanistan</option>
<option value="AL">🇦🇱 Albania</option>
<option value="DZ">🇩🇿 Algeria</option>
<option value="AD">🇦🇩 Andorra</option>
<option value="AO">🇦🇴 Angola</option>
<option value="AG">🇦🇬 Antigua and Barbuda</option>
<option value="AR">🇦🇷 Argentina</option>
<option value="AM">🇦🇲 Armenia</option>
<option value="AU">🇦🇺 Australia</option>
<option value="AT">🇦🇹 Austria</option>
<option value="AZ">🇦🇿 Azerbaijan</option>
<option value="BS">🇧🇸 Bahamas</option>
<option value="BH">🇧🇭 Bahrain</option>
<option value="BD">🇧🇩 Bangladesh</option>
<option value="BB">🇧🇧 Barbados</option>
<option value="BY">🇧🇾 Belarus</option>
<option value="BE">🇧🇪 Belgium</option>
<option value="BZ">🇧🇿 Belize</option>
<option value="BJ">🇧🇯 Benin</option>
<option value="BT">🇧🇹 Bhutan</option>
<option value="BO">🇧🇴 Bolivia</option>
<option value="BA">🇧🇦 Bosnia and Herzegovina</option>
<option value="BW">🇧🇼 Botswana</option>
<option value="BR">🇧🇷 Brazil</option>
<option value="BN">🇧🇳 Brunei Darussalam</option>
<option value="BG">🇧🇬 Bulgaria</option>
<option value="BF">🇧🇫 Burkina Faso</option>
<option value="BI">🇧🇮 Burundi</option>
<option value="CV">🇨🇻 Cabo Verde</option>
<option value="KH">🇰🇭 Cambodia</option>
<option value="CM">🇨🇲 Cameroon</option>
<option value="CA">🇨🇦 Canada</option>
<option value="CF">🇨🇫 Central African Republic</option>
<option value="TD">🇹🇩 Chad</option>
<option value="CL">🇨🇱 Chile</option>
<option value="CN">🇨🇳 China</option>
<option value="CO">🇨🇴 Colombia</option>
<option value="KM">🇰🇲 Comoros</option>
<option value="CG">🇨🇬 Congo</option>
<option value="CD">🇨🇩 Congo (Democratic Republic)</option>
<option value="CR">🇨🇷 Costa Rica</option>
<option value="CI">🇨🇮 Côte d'Ivoire</option>
<option value="HR">🇭🇷 Croatia</option>
<option value="CU">🇨🇺 Cuba</option>
<option value="CY">🇨🇾 Cyprus</option>
<option value="CZ">🇨🇿 Czech Republic</option>
<option value="DK">🇩🇰 Denmark</option>
<option value="DJ">🇩🇯 Djibouti</option>
<option value="DM">🇩🇲 Dominica</option>
<option value="DO">🇩🇴 Dominican Republic</option>
<option value="EC">🇪🇨 Ecuador</option>
<option value="EG">🇪🇬 Egypt</option>
<option value="SV">🇸🇻 El Salvador</option>
<option value="GQ">🇬🇶 Equatorial Guinea</option>
<option value="ER">🇪🇷 Eritrea</option>
<option value="EE">🇪🇪 Estonia</option>
<option value="SZ">🇸🇿 Eswatini</option>
<option value="ET">🇪🇹 Ethiopia</option>
<option value="FJ">🇫🇯 Fiji</option>
<option value="FI">🇫🇮 Finland</option>
<option value="FR">🇫🇷 France</option>
<option value="GA">🇬🇦 Gabon</option>
<option value="GM">🇬🇲 Gambia</option>
<option value="GE">🇬🇪 Georgia</option>
<option value="DE">🇩🇪 Germany</option>
<option value="GH">🇬🇭 Ghana</option>
<option value="GR">🇬🇷 Greece</option>
<option value="GD">🇬🇩 Grenada</option>
<option value="GT">🇬🇹 Guatemala</option>
<option value="GN">🇬🇳 Guinea</option>
<option value="GW">🇬🇼 Guinea-Bissau</option>
<option value="GY">🇬🇾 Guyana</option>
<option value="HT">🇭🇹 Haiti</option>
<option value="HN">🇭🇳 Honduras</option>
<option value="HU">🇭🇺 Hungary</option>
<option value="IS">🇮🇸 Iceland</option>
<option value="IN">🇮🇳 India</option>
<option value="ID">🇮🇩 Indonesia</option>
<option value="IR">🇮🇷 Iran</option>
<option value="IQ">🇮🇶 Iraq</option>
<option value="IE">🇮🇪 Ireland</option>
<option value="IL">🇮🇱 Israel</option>
<option value="IT">🇮🇹 Italy</option>
<option value="JM">🇯🇲 Jamaica</option>
<option value="JP">🇯🇵 Japan</option>
<option value="JO">🇯🇴 Jordan</option>
<option value="KZ">🇰🇿 Kazakhstan</option>
<option value="KE">🇰🇪 Kenya</option>
<option value="KI">🇰🇮 Kiribati</option>
<option value="KW">🇰🇼 Kuwait</option>
<option value="KG">🇰🇬 Kyrgyzstan</option>
<option value="LA">🇱🇦 Lao People's Democratic Republic</option>
<option value="LV">🇱🇻 Latvia</option>
<option value="LB">🇱🇧 Lebanon</option>
<option value="LS">🇱🇸 Lesotho</option>
<option value="LR">🇱🇷 Liberia</option>
<option value="LY">🇱🇾 Libya</option>
<option value="LI">🇱🇮 Liechtenstein</option>
<option value="LT">🇱🇹 Lithuania</option>
<option value="LU">🇱🇺 Luxembourg</option>
<option value="MG">🇲🇬 Madagascar</option>
<option value="MW">🇲🇼 Malawi</option>
<option value="MY">🇲🇾 Malaysia</option>
<option value="MV">🇲🇻 Maldives</option>
<option value="ML">🇲🇱 Mali</option>
<option value="MT">🇲🇹 Malta</option>
<option value="MH">🇲🇭 Marshall Islands</option>
<option value="MR">🇲🇷 Mauritania</option>
<option value="MU">🇲🇺 Mauritius</option>
<option value="MX">🇲🇽 Mexico</option>
<option value="FM">🇫🇲 Micronesia</option>
<option value="MD">🇲🇩 Moldova</option>
<option value="MC">🇲🇨 Monaco</option>
<option value="MN">🇲🇳 Mongolia</option>
<option value="ME">🇲🇪 Montenegro</option>
<option value="MA">🇲🇦 Morocco</option>
<option value="MZ">🇲🇿 Mozambique</option>
<option value="MM">🇲🇲 Myanmar</option>
<option value="NA">🇳🇦 Namibia</option>
<option value="NR">🇳🇷 Nauru</option>
<option value="NP">🇳🇵 Nepal</option>
<option value="NL">🇳🇱 Netherlands</option>
<option value="NZ">🇳🇿 New Zealand</option>
<option value="NI">🇳🇮 Nicaragua</option>
<option value="NE">🇳🇪 Niger</option>
<option value="NG">🇳🇬 Nigeria</option>
<option value="KP">🇰🇵 North Korea</option>
<option value="MK">🇲🇰 North Macedonia</option>
<option value="NO">🇳🇴 Norway</option>
<option value="OM">🇴🇲 Oman</option>
<option value="PK">🇵🇰 Pakistan</option>
<option value="PW">🇵🇼 Palau</option>
<option value="PS">🇵🇸 State of Palestine</option>
<option value="PA">🇵🇦 Panama</option>
<option value="PG">🇵🇬 Papua New Guinea</option>
<option value="PY">🇵🇾 Paraguay</option>
<option value="PE">🇵🇪 Peru</option>
<option value="PH">🇵🇭 Philippines</option>
<option value="PL">🇵🇱 Poland</option>
<option value="PT">🇵🇹 Portugal</option>
<option value="QA">🇶🇦 Qatar</option>
<option value="RO">🇷🇴 Romania</option>
<option value="RU">🇷🇺 Russia</option>
<option value="RW">🇷🇼 Rwanda</option>
<option value="KN">🇰🇳 Saint Kitts and Nevis</option>
<option value="LC">🇱🇨 Saint Lucia</option>
<option value="VC">🇻🇨 Saint Vincent and the Grenadines</option>
<option value="WS">🇼🇸 Samoa</option>
<option value="SM">🇸🇲 San Marino</option>
<option value="ST">🇸🇹 São Tomé and Príncipe</option>
<option value="SA">🇸🇦 Saudi Arabia</option>
<option value="SN">🇸🇳 Senegal</option>
<option value="RS">🇷🇸 Serbia</option>
<option value="SC">🇸🇨 Seychelles</option>
<option value="SL">🇸🇱 Sierra Leone</option>
<option value="SG">🇸🇬 Singapore</option>
<option value="SK">🇸🇰 Slovakia</option>
<option value="SI">🇸🇮 Slovenia</option>
<option value="SB">🇸🇧 Solomon Islands</option>
<option value="SO">🇸🇴 Somalia</option>
<option value="ZA">🇿🇦 South Africa</option>
<option value="SS">🇸🇸 South Sudan</option>
<option value="ES">🇪🇸 Spain</option>
<option value="LK">🇱🇰 Sri Lanka</option>
<option value="SD">🇸🇩 Sudan</option>
<option value="SR">🇸🇷 Suriname</option>
<option value="SE">🇸🇪 Sweden</option>
<option value="CH">🇨🇭 Switzerland</option>
<option value="SY">🇸🇾 Syria</option>
<option value="TJ">🇹🇯 Tajikistan</option>
<option value="TZ">🇹🇿 Tanzania</option>
<option value="TH">🇹🇭 Thailand</option>
<option value="TL">🇹🇱 Timor-Leste</option>
<option value="TG">🇹🇬 Togo</option>
<option value="TO">🇹🇴 Tonga</option>
<option value="TT">🇹🇹 Trinidad and Tobago</option>
<option value="TN">🇹🇳 Tunisia</option>
<option value="TR">🇹🇷 Turkey</option>
<option value="TM">🇹🇲 Turkmenistan</option>
<option value="TV">🇹🇻 Tuvalu</option>
<option value="UG">🇺🇬 Uganda</option>
<option value="UA">🇺🇦 Ukraine</option>
<option value="AE">🇦🇪 United Arab Emirates</option>
<option value="GB">🇬🇧 United Kingdom</option>
<option value="US">🇺🇸 United States</option>
<option value="UY">🇺🇾 Uruguay</option>
<option value="UZ">🇺🇿 Uzbekistan</option>
<option value="VU">🇻🇺 Vanuatu</option>
<option value="VE">🇻🇪 Venezuela</option>
<option value="VN">🇻🇳 Vietnam</option>
<option value="VA">🇻🇦 Holy See</option>
<option value="YE">🇾🇪 Yemen</option>
<option value="ZM">🇿🇲 Zambia</option>
<option value="ZW">🇿🇼 Zimbabwe</option>
</select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Full Name*</label><input name="name" required className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
            <div><label className="block text-sm font-medium">Email*</label><input name="email" required type="email" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Phone*</label><input name="phone" required className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
            <div><label className="block text-sm font-medium">University / College*</label><input name="university" required className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Location / Time zone</label><input name="location" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
            <div><label className="block text-sm font-medium">GitHub*</label><input name="portfolio" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Graduation Year</label><input name="Graduation" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
            <div><label className="block text-sm font-medium">LinkedIn*</label><input name="portfolio" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Resume link*</label><input name="resume" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
            <div><label className="block text-sm font-medium">Start date & availability</label><input name="availability" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
          </div>
          <div><label className="block text-sm font-medium">About you</label><textarea name="about" rows={5} className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2"/></div>
          <div className="flex items-start gap-2 bg-[#0a2540]/5 rounded-xl p-3">
            <input id="agree" name="agree" type="checkbox" className="mt-1"/>
            <label htmlFor="agree" className="text-sm">I agree that if selected after the interview, a <span className="font-semibold">registration fee of 15 USD / 1150 INR</span> must be paid (instructions will be sent by email post interview.</label>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg">Submit Application</button>
            <button type="button" onClick={()=>{ window.location.href = 'mailto:technocollabs@gmail.com?subject=Internship%20Application'; }} className="text-sm font-medium text-[#1e90ff] hover:underline">Open in Email</button>
          </div>
        </form>
      </section>
    </div>
  );
}

// --------------------------- CONTACT PAGE ---------------------------------- ----------------------------------
function ContactPage() {
  const [budget, setBudget] = useState<number>(10000);
  const [hear, setHear] = useState<string>("Referral");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name')||''),
      company: String(fd.get('company')||''),
      email: String(fd.get('email')||''),
      phone: String(fd.get('phone')||''),
      message: String(fd.get('message')||''),
      hear: String(fd.get('hear')||''),
      budget: String(fd.get('budget')||'')
    };
    const subject = encodeURIComponent(`New inquiry from ${payload.name}`);
    const body = encodeURIComponent(`Name: ${payload.name}
Company: ${payload.company}
Email: ${payload.email}
Phone: ${payload.phone}
Heard via: ${payload.hear}
Budget: ${payload.budget}

Message:
${payload.message}`);
    window.location.href = `mailto:contact@technocolabs.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white text-[#0a2540]">
      <section className="bg-[#0a2540] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-2 text-white/80">Tell us about your project or training needs. You can also reach us at <span className="font-semibold">contact@technocolabs.com</span> or <span className="font-semibold">+91 8319291391</span>.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 lg:grid-cols-2">
        {/* Map + Offices */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-[#0a2540]/10 shadow-sm">
            <iframe
              title="Technocolabs location"
              width="100%"
              height="360"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=J.P.+Tower+First+Floor+P1,+Indore,+452002&output=embed"></iframe>
          </div>
          <div className="rounded-2xl border border-[#0a2540]/10 p-6 shadow-sm">
            <div className="text-base font-semibold">Our Office</div>
            <div className="mt-2 text-sm text-[#0a2540]/80">J.P. Tower First Floor P1, Indore, India, 452002.</div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <a className="hover:underline" href="mailto:contact@technocolabs.com">contact@technocolabs.com</a>
              <a className="hover:underline" href="tel:+918319291391">+91 8319291391</a>
            </div>
            <div className="mt-4 text-xs text-[#0a2540]/60">Open: Mon–Sat, 10:00–18:00 IST</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#0a2540]/10 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name*</label>
                <input name="name" required className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"/>
              </div>
              <div>
                <label className="block text-sm font-medium">Company</label>
                <input name="company" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"/>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Business email*</label>
                <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"/>
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input name="phone" className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">How can we help?</label>
              <textarea name="message" rows={4} className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e90ff]"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">How did you hear about us?</label>
                <select name="hear" value={hear} onChange={(e)=>setHear(e.target.value)} className="mt-1 w-full rounded-xl border border-[#0a2540]/20 bg-white px-3 py-2">
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
                  <input type="range" name="budget" min={1000} max={50000} step={1000} value={budget} onChange={(e)=>setBudget(Number(e.target.value))} className="w-full"/>
                  <span className="text-sm whitespace-nowrap">${'{'}{Intl.NumberFormat().format(budget)}{'}'}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Attach a file (optional)</label>
              <input type="file" className="mt-1 block w-full text-sm"/>
              <div className="mt-1 text-xs text-[#0a2540]/60">Max 2MB. Allowed: doc, xls, pdf, png, jpg.</div>
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e90ff] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg">Send Message</button>
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

// --------------------------- TOP BAR (site‑wide) ---------------------------
function TopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-white text-[#0a2540] border-b border-[#0a2540]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 min-w-0">
          <span className="hidden sm:inline-flex items-center gap-1 whitespace-nowrap"><MapPin className="h-4 w-4"/> J.P. Tower First Floor P1, Indore, India</span>
          <span className="hidden sm:inline h-4 w-px bg-[#0a2540]/15"/>
          <a href="mailto:contact@technocolabs.com" className="inline-flex items-center gap-2 hover:underline"><Mail className="h-4 w-4"/> contact@technocolabs.com</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+918319291391" className="inline-flex items-center gap-2 rounded-full border border-[#0a2540]/15 px-3 py-1 hover:bg-[#0a2540]/5"><Phone className="h-4 w-4"/> +91 8319291391</a>
          <span className="hidden sm:flex items-center gap-3">
            <a aria-label="Facebook" href={SOCIAL_LINKS.facebook} className="hover:text-[#1e90ff]"><Facebook className="h-4 w-4"/></a>
            <a aria-label="Twitter" href={SOCIAL_LINKS.twitter} className="hover:text-[#1e90ff]"><Twitter className="h-4 w-4"/></a>
            <a aria-label="LinkedIn" href={SOCIAL_LINKS.linkedin} className="hover:text-[#1e90ff]"><Linkedin className="h-4 w-4"/></a>
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
  return (
    <header className="fixed inset-x-0 top-10 z-50 bg-[#0a2540] text-white border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <button onClick={() => navigate('home')} className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-semibold hidden sm:inline">Technocolabs Softwares Inc.</span>
        </button>
        <nav className="flex items-center gap-4 text-sm">
          {(['home','services','careers','contact'] as Tab[]).map((t) => (
            <button key={t} onClick={() => navigate(t)}
              className={`px-3 py-1.5 rounded-lg ${tab===t?'bg-white/10':'hover:bg-white/5'}`}
            >{t[0].toUpperCase()+t.slice(1)}</button>
          ))}
        </nav>
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

// --------------------------- APP -------------------------------------------
export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [activeService, setActiveService] = useState<string | null>(null);
  const [activeServicePage, setActiveServicePage] = useState<string | null>(null);
      const [applyRole, setApplyRole] = useState<string>('Data Science Internship');

  const navigate = (t: Tab) => setTab(t);
  const openDetail = (slug: string | null) => { setActiveService(slug); setTab('service'); };
  const openServicePage = (slug: string) => { setActiveServicePage(slug); setTab('svc'); };
  
  

  let content: React.ReactNode = null;
  if (tab === 'home') content = <HomePage />;
  if (tab === 'services') content = <ServicesPage />;
  if (tab === 'service') content = <ServiceDetailPage />;
  if (tab === 'careers') content = <CareersPage />;
  if (tab === 'contact') content = <ContactPage />;
  if (tab === 'apply') content = <ApplyPage />;
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

