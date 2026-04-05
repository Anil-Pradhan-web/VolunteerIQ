"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, BarChart3, Globe2, HeartHandshake, Sparkles, Users2,
  FileText, ClipboardList, Brain, Shield, Zap, MessageSquare,
  MapPin, CheckCircle2, ChevronDown, Star, AlertTriangle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Animated Counter ───────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: "AI Survey Analysis",
    desc: "Upload CSV, PDF, DOCX, or TXT field reports. Gemini 1.5 Pro extracts the top 3 urgent community problems, urgency scores, an executive summary, and suggested interventions — in seconds.",
    color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100",
    badge: "Powered by Gemini",
  },
  {
    icon: ClipboardList,
    title: "Auto Task Generation",
    desc: "Each survey scan automatically produces 3 ready-to-launch field tasks with skill tags, location metadata, and full descriptions. One click to deploy them into the system.",
    color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100",
    badge: "Zero Manual Work",
  },
  {
    icon: Users2,
    title: "Smart Volunteer Matching",
    desc: "AI ranks volunteers for every task by skill match, location proximity, and availability — with a 0–100 score and a one-sentence explanation for every recommendation.",
    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100",
    badge: "Data-Driven",
  },
  {
    icon: Globe2,
    title: "Live Operations Map",
    desc: "Mapbox-powered geospatial map showing all tasks as colored pins. Open, active, and completed deployments visualized in real time across entire regions.",
    color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100",
    badge: "Real-Time",
  },
  {
    icon: MessageSquare,
    title: "Contextual AI Chat",
    desc: "An intelligent assistant that reads your live NGO data — volunteers, tasks, surveys — and answers plain-English questions about your operations instantly.",
    color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100",
    badge: "Gemini + Groq",
  },
  {
    icon: Shield,
    title: "Secure & Scalable",
    desc: "Firebase Google Auth with server-side token verification on every request. SQLite for development, ready to switch to PostgreSQL for full production scale.",
    color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100",
    badge: "Enterprise Ready",
  },
];

const WORKFLOW = [
  { step: "01", icon: FileText, title: "Upload Field Survey", desc: "Drag & drop a community report — CSV, PDF, DOCX, or TXT. Our parser handles everything automatically.", color: "from-indigo-500 to-indigo-600" },
  { step: "02", icon: Sparkles, title: "Gemini AI Scans It", desc: "Gemini 1.5 Pro extracts top problems, urgency levels, a summary, and 3 actionable relief tasks.", color: "from-violet-500 to-violet-600" },
  { step: "03", icon: ClipboardList, title: "Tasks Auto-Created", desc: "Launch AI-generated tasks directly into the system with one click. Skills and location pre-filled.", color: "from-emerald-500 to-emerald-600" },
  { step: "04", icon: HeartHandshake, title: "Best Match Deployed", desc: "AI scores and ranks your volunteers. Assign the top match instantly. Task status updates in real time.", color: "from-rose-500 to-rose-600" },
];

const USE_CASES = [
  {
    emoji: "🌊", title: "Disaster Relief", color: "hover:border-blue-200 hover:bg-blue-50/30",
    icon_bg: "bg-blue-100", icon_color: "text-blue-600",
    desc: "During floods or cyclones, NGOs receive thousands of chaotic SOS messages. VolunteerIQ structures them into geocoded urgent tasks — mapping rescue volunteers to affected zones within minutes.",
    tags: ["Flood Response", "Rescue Teams", "Logistics"],
  },
  {
    emoji: "🏥", title: "Mobile Health Camps", color: "hover:border-emerald-200 hover:bg-emerald-50/30",
    icon_bg: "bg-emerald-100", icon_color: "text-emerald-600",
    desc: "Medical surveys take weeks to analyze manually. Our AI processes patient data to prioritize villages and match doctors with the right specializations to high-density areas — overnight.",
    tags: ["Healthcare", "Rural Outreach", "Medical Teams"],
  },
  {
    emoji: "📚", title: "Education Drives", color: "hover:border-amber-200 hover:bg-amber-50/30",
    icon_bg: "bg-amber-100", icon_color: "text-amber-600",
    desc: "Identify schooling gaps from community surveys. Match teachers proficient in local languages with temporary rural education centers. Track impact with real-time task completion.",
    tags: ["Education", "Language Skills", "Rural Centers"],
  },
];

const TECH_STACK = [
  { name: "Next.js 14", role: "Frontend Framework", logo: "https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.png", color: "bg-black" },
  { name: "FastAPI", role: "Backend API", logo: "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png", color: "bg-teal-500/10" },
  { name: "Gemini 1.5 Pro", role: "Primary AI Engine", color: "bg-blue-500/10", emoji: "🤖" },
  { name: "Groq Llama 3", role: "Fallback AI", color: "bg-orange-500/10", emoji: "⚡" },
  { name: "Firebase Auth", role: "Authentication", color: "bg-yellow-500/10", emoji: "🔐" },
  { name: "Mapbox GL", role: "Geo Visualization", color: "bg-indigo-500/10", emoji: "🗺️" },
  { name: "SQLAlchemy", role: "ORM + Database", color: "bg-red-500/10", emoji: "🗄️" },
  { name: "Tailwind CSS", role: "Design System", color: "bg-cyan-500/10", emoji: "🎨" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#fafafa] text-slate-900 antialiased">

      {/* ── STICKY NAVBAR ─────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100" : "bg-transparent"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="VolunteerIQ Logo" className="h-9 w-9 rounded-xl object-cover shadow-sm ring-1 ring-slate-900/5" />
            <span className="text-xl font-bold tracking-tight text-slate-900">VolunteerIQ</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#workflow" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
            <a href="#use-cases" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Use Cases</a>
            <a href="#tech" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Tech Stack</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="rounded-full text-sm font-medium text-slate-600 hover:text-slate-900">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-700 shadow-sm text-sm">
                Launch Platform <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-white pt-20">
        {/* Background blobs */}
        <div className="absolute -top-40 -right-40 h-[800px] w-[800px] rounded-full bg-indigo-500/8 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-500/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm mb-10 animate-in fade-in slide-in-from-bottom-4" style={{ animationDuration: "600ms" }}>
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Google Solution Challenge 2026 · Team ClutchCode
            </div>

            {/* Headline */}
            <h1 className="text-6xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl leading-[1.05] animate-in fade-in slide-in-from-bottom-4" style={{ animationDuration: "700ms", animationDelay: "100ms" }}>
              Smart resource
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
                allocation for NGOs.
              </span>
            </h1>

            {/* Sub */}
            <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-slate-500 animate-in fade-in slide-in-from-bottom-4 font-medium" style={{ animationDuration: "700ms", animationDelay: "200ms" }}>
              Upload raw field surveys → Gemini AI extracts urgent problems → tasks auto-generated → best volunteers matched and deployed. <span className="text-slate-700 font-semibold">In minutes, not days.</span>
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDuration: "700ms", animationDelay: "300ms" }}>
              <Link href="/login">
                <Button size="lg" className="h-14 rounded-full bg-slate-900 px-10 text-base font-bold text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
                  Enter Workspace <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features" className="flex items-center gap-2 h-14 px-6 rounded-full border border-slate-200 bg-white text-slate-700 text-base font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                Explore Features <ChevronDown className="h-4 w-4 text-slate-400" />
              </a>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4 animate-in fade-in" style={{ animationDuration: "1000ms", animationDelay: "500ms" }}>
              {[
                { label: "AI Models Integrated", value: 2, suffix: "" },
                { label: "File Formats Parsed", value: 4, suffix: "" },
                { label: "API Endpoints", value: 19, suffix: "+" },
                { label: "Days to Build", value: 30, suffix: "" },
              ].map((s) => (
                <div key={s.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <p className="text-4xl font-black text-slate-900"><Counter target={s.value} suffix={s.suffix} /></p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Mockup Preview */}
          <div className="mx-auto mt-20 max-w-5xl animate-in fade-in slide-in-from-bottom-8" style={{ animationDuration: "900ms", animationDelay: "400ms" }}>
            <div className="relative rounded-[40px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60 hover:shadow-slate-300/60 hover:-translate-y-1 transition-all duration-700 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-emerald-300" />
              {/* Fake window bar */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="ml-4 h-7 w-64 rounded-full bg-slate-100 flex items-center px-3">
                  <div className="h-2 w-32 rounded-full bg-slate-200" />
                </div>
              </div>
              {/* Mockup content */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Total Volunteers", val: "24", color: "bg-indigo-50", bar: "bg-indigo-400", w: "75%" },
                  { label: "Active Tasks", val: "8", color: "bg-amber-50", bar: "bg-amber-400", w: "50%" },
                  { label: "Completed", val: "31", color: "bg-emerald-50", bar: "bg-emerald-400", w: "90%" },
                  { label: "Open Tasks", val: "5", color: "bg-rose-50", bar: "bg-rose-400", w: "35%" },
                ].map((card) => (
                  <div key={card.label} className={`${card.color} rounded-2xl p-4`}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{card.val}</p>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-white/50">
                      <div className={`h-full rounded-full ${card.bar} animate-pulse`} style={{ width: card.w }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="h-3 w-32 rounded-full bg-slate-200 mb-3" />
                  {["Medical Aid Camp · Bhubaneswar", "Food Distribution · Cuttack", "Shelter Setup · Puri", "Teacher Volunteer · Khurda"].map((t, i) => (
                    <div key={t} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-slate-50 mb-2 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                      <div className={`h-7 w-7 rounded-full ${i % 2 === 0 ? "bg-indigo-100" : "bg-emerald-100"}`} />
                      <div className="flex-1">
                        <div className="h-2.5 rounded-full bg-slate-200 w-3/4" />
                      </div>
                      <div className={`h-5 w-16 rounded-md text-[9px] flex items-center justify-center font-black ${i === 0 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}>
                        {i === 0 ? "OPEN" : "ASSIGNED"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="h-3 w-24 rounded-full bg-slate-200 mb-3" />
                  <div className="space-y-2">
                    {["AI Analysis", "Volunteer Match", "Task Deploy", "Chat Active"].map((item, i) => (
                      <div key={item} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-slate-600 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl bg-indigo-600 p-3 text-center">
                    <p className="text-[11px] font-black text-indigo-200 uppercase tracking-wider">Gemini Active</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {[1,2,3,4,5].map(i => <div key={i} className="h-4 w-1 rounded-full bg-indigo-300 animate-pulse" style={{ animationDelay: `${i * 100}ms`, height: `${8 + i * 4}px` }} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" className="relative bg-[#fafafa] py-32 overflow-hidden border-t border-slate-100">
        <div className="absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4 rounded-full border border-indigo-100 bg-white px-4 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm">
              <Zap className="mr-2 h-4 w-4" />Platform Capabilities
            </Badge>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Everything to coordinate relief.
            </h2>
            <p className="mt-5 text-lg text-slate-500 font-medium leading-relaxed">
              From raw survey data to deployed field teams — every step is powered by AI and designed for speed.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={`group relative flex flex-col rounded-[32px] border ${feature.border} bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ring-1 ${feature.border}`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">{feature.title}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${feature.bg} ${feature.color}`}>
                    {feature.badge}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-500 flex-1">{feature.desc}</p>
                <div className={`mt-6 h-0.5 w-full rounded-full bg-gradient-to-r from-transparent ${feature.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ──────────────────────────────────────────────────────── */}
      <section id="workflow" className="relative overflow-hidden bg-slate-950 py-32">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <p className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-4">Intelligent Workflow</p>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              From data to deployment
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">in minutes.</span>
            </h2>
            <p className="mt-6 text-lg text-slate-400 font-medium leading-relaxed">
              Stop spending days on paperwork. Let our AI pipeline process field data and coordinate your volunteer force automatically.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent hidden lg:block" />

            <div className="grid gap-8 lg:grid-cols-4">
              {WORKFLOW.map((step, i) => (
                <div key={step.step} className="relative flex flex-col gap-6">
                  <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-xl ring-1 ring-white/10`}>
                    <step.icon className="h-9 w-9 text-white" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-900 shadow-sm">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-2">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
                  </div>
                  {i < WORKFLOW.length - 1 && (
                    <div className="absolute top-10 left-[5.5rem] hidden items-center lg:flex text-slate-700">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Providers Banner */}
          <div className="mt-20 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">🤖</div>
                <div>
                  <p className="font-black text-white">Google Gemini 1.5 Pro</p>
                  <p className="text-sm text-slate-400 mt-1">Primary intelligence engine. Handles survey analysis, contextual matching, and multi-turn NGO chat with deep reasoning.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-2xl">⚡</div>
                <div>
                  <p className="font-black text-white">Groq Llama 3</p>
                  <p className="text-sm text-slate-400 mt-1">Ultra-fast fallback provider. Switch any AI operation to Groq with a single toggle — <strong className="text-white">rate-limit-aware</strong> with stub fallbacks throughout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ─────────────────────────────────────────────────────── */}
      <section id="use-cases" className="bg-white py-32 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <svg width="900" height="900" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="49" stroke="black" strokeWidth="0.3" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="35" stroke="black" strokeWidth="0.3" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="20" stroke="black" strokeWidth="0.3" strokeDasharray="2 3" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
              Real-World Impact
            </Badge>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Built for the field.</h2>
            <p className="mt-5 text-lg text-slate-500 font-medium">VolunteerIQ is designed for real crisis response scenarios across India and beyond.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className={`relative rounded-[32px] border border-slate-100 bg-slate-50 p-8 transition-all duration-300 ${uc.color} hover:shadow-lg hover:-translate-y-1`}>
                <div className="text-4xl mb-4">{uc.emoji}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{uc.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{uc.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {uc.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-white rounded-lg text-slate-600 border border-slate-100 shadow-sm">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Impact Numbers */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { icon: "🕐", stat: "< 30s", label: "Survey to Action" },
              { icon: "🎯", stat: "100pt", label: "Match Score System" },
              { icon: "🌐", stat: "4+", label: "File Formats" },
              { icon: "🛡️", stat: "100%", label: "Auth Protected" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-900 p-6 text-center text-white">
                <p className="text-2xl mb-1">{item.icon}</p>
                <p className="text-3xl font-black">{item.stat}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────────────────────────────── */}
      <section id="tech" className="bg-[#fafafa] py-32 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
              Modern Architecture
            </Badge>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Built with the best stack.</h2>
            <p className="mt-5 text-lg text-slate-500 font-medium">Production-grade tools selected for performance, developer velocity, and AI integration.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className={`rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                <div className={`h-12 w-12 rounded-2xl ${tech.color} flex items-center justify-center text-2xl mb-4`}>
                  {tech.emoji || "⚙️"}
                </div>
                <p className="font-black text-slate-900">{tech.name}</p>
                <p className="text-sm text-slate-400 font-medium mt-0.5">{tech.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-[48px] bg-slate-950 px-10 py-28 text-center shadow-2xl">
            {/* Glow */}
            <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/30 blur-[100px]" />
            <div className="absolute right-0 bottom-0 -z-10 h-[300px] w-[500px] rounded-full bg-emerald-600/20 blur-[80px]" />

            <div className="flex items-center justify-center gap-2 mb-6">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Google Solution Challenge 2026</span>
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>

            <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.1]">
              Ready to scale your
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent"> social impact?</span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-slate-400 font-medium">
              Join VolunteerIQ — where AI and compassion combine to turn scattered field data into coordinated, life-changing relief operations.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/login">
                <Button size="lg" className="h-16 rounded-full bg-white text-slate-900 hover:bg-slate-100 px-12 text-lg font-black shadow-xl hover:-translate-y-0.5 transition-all">
                  Enter Workspace <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features" className="flex items-center gap-2 h-16 px-8 rounded-full border border-white/20 text-white text-base font-semibold hover:bg-white/10 transition-all">
                <Sparkles className="h-4 w-4 text-indigo-400" /> Explore Features
              </a>
            </div>

            {/* Tech Pills */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
              {["Gemini 1.5 Pro", "FastAPI", "Next.js 14", "Firebase Auth", "Mapbox GL", "Groq Llama 3"].map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-400 backdrop-blur-sm">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-xl object-cover opacity-80" />
              <div>
                <p className="font-black text-slate-900">VolunteerIQ</p>
                <p className="text-xs text-slate-400 font-medium">AI-Powered Humanitarian Platform</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Features</a>
              <a href="#workflow" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Workflow</a>
              <a href="#tech" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tech Stack</a>
              <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">Launch →</Link>
            </div>

            {/* Credits */}
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">Team ClutchCode</p>
              <p className="text-xs text-slate-400 font-medium">Google Solution Challenge 2026</p>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-50 pt-8 text-center">
            <p className="text-sm text-slate-400">
              Built with ❤️ for social good · Powered by{" "}
              <span className="font-semibold text-slate-600">Google Gemini</span>,{" "}
              <span className="font-semibold text-slate-600">Firebase</span> &{" "}
              <span className="font-semibold text-slate-600">Mapbox</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
