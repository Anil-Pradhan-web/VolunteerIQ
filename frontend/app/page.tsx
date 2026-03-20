import Link from "next/link";
import { ArrowRight, BarChart3, Globe2, HeartHandshake, Sparkles, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#fafafa] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="VolunteerIQ Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-slate-900/5" />
          <span className="font-display text-xl font-bold tracking-tight">VolunteerIQ</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block transition-colors">
            Dashboard
          </Link>
          <Button variant="outline" className="rounded-full border-slate-200 bg-white/50 text-slate-700 backdrop-blur-md hover:bg-slate-50 transition-colors">
            Sign In
          </Button>
          <Link href="/dashboard">
            <Button className="rounded-full bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-700 transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative mx-auto w-full max-w-[1400px] flex-1 px-6 pb-20 pt-16 sm:pb-32 lg:flex lg:px-8 lg:pt-32">
        {/* Abstract Background glow */}
        <div className="absolute left-[50%] top-[-20%] -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px] lg:left-[80%] lg:w-[1000px] lg:-translate-x-0" />

        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8 relative z-10">
          <Badge className="mb-6 inline-flex rounded-full border border-indigo-100 bg-white px-4 py-1.5 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50/50">
            <Sparkles className="mr-2 h-4 w-4" /> Solution Challenge 2026
          </Badge>

          <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl leading-[1.1]">
            Smart resource <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
              allocation for NGOs.
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-600 max-w-lg">
            Empower your social impact missions with AI-driven insights. Turn scattered field data into immediate, targeted action through intelligent volunteer coordination.
          </p>

          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 rounded-full bg-indigo-600 px-8 text-base shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-[1.03] transition-all">
                Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features" className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-20">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            {/* Fake Dashboard Preview Wrapper */}
            <div className="relative w-[700px] xl:w-[800px] rounded-bl-[40px] rounded-tl-[40px] border-y border-l border-slate-200/50 bg-white/60 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:rounded-bl-[48px] lg:rounded-tl-[48px] lg:border-white/20 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(79,70,229,0.15)] group">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-emerald-200" />
              
              {/* Inner Mockup Window */}
              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-transform duration-700 group-hover:scale-[1.01]">
                {/* Window Controls */}
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-slate-200" />
                    <div className="h-3 w-3 rounded-full bg-slate-200" />
                    <div className="h-3 w-3 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-5 w-32 rounded-full bg-slate-50" />
                </div>
                
                {/* Mockup Content */}
                <div className="mt-6 flex gap-6">
                  {/* Mockup Left Column */}
                  <div className="w-1/3 space-y-4">
                    <div className="h-28 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100/50 animate-pulse">
                       <div className="h-3 w-20 rounded-full bg-indigo-200" />
                       <div className="mt-4 h-8 w-16 rounded-lg bg-indigo-300/40" />
                       <div className="mt-4 h-1.5 w-full rounded-full bg-indigo-200" />
                    </div>
                    <div className="h-28 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100/50 animate-pulse" style={{ animationDelay: '150ms' }}>
                       <div className="h-3 w-20 rounded-full bg-emerald-200" />
                       <div className="mt-4 h-8 w-16 rounded-lg bg-emerald-300/40" />
                       <div className="mt-4 h-1.5 w-full rounded-full bg-emerald-200" />
                    </div>
                  </div>
                  {/* Mockup Right Column */}
                  <div className="w-2/3 rounded-[20px] border border-slate-100 bg-slate-50/50 p-5">
                    <div className="h-4 w-32 rounded-full bg-slate-200" />
                    <div className="mt-5 space-y-2.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm border border-slate-100/60 animate-pulse`} style={{ animationDelay: `${i * 150}ms` }}>
                          <div className="h-8 w-8 rounded-full bg-slate-100" />
                          <div className="space-y-2 flex-1">
                            <div className="h-2 w-24 rounded-full bg-slate-200" />
                            <div className="h-1.5 w-32 rounded-full bg-slate-100" />
                          </div>
                          <div className={`h-6 w-16 rounded-md ${i % 2 === 0 ? 'bg-indigo-50' : 'bg-emerald-50'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-white py-24 sm:py-32 overflow-hidden border-t border-slate-100">
        <div className="absolute left-[10%] top-0 -z-10 h-[400px] w-[600px] -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">Faster Deployment</h2>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to coordinate relief.
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Streamline surveys, discover urgent community needs, and assign the best volunteers in seconds using our integrated AI tools.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
              {[
                { 
                  title: 'Survey analysis', 
                  desc: 'Upload community reports and let Gemini automatically extract top problems and urgencies.',
                  icon: BarChart3,
                  color: 'text-indigo-600',
                  bg: 'bg-indigo-50',
                  border: 'border-indigo-100/50'
                },
                { 
                  title: 'Volunteer matching', 
                  desc: 'Match the best people to critical tasks based on real-time location, skills, and availability schedules.',
                  icon: Users2,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                  border: 'border-emerald-100/50'
                },
                { 
                  title: 'Live operations board', 
                  desc: 'Keep NGO admins up to date with a comprehensive dashboard showing deployment health worldwide.',
                  icon: Globe2,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                  border: 'border-purple-100/50'
                }
              ].map((feature) => (
                <div key={feature.title} className={`flex flex-col rounded-3xl border ${feature.border} bg-white p-8 shadow-sm transition hover:shadow-md hover:-translate-y-1 duration-300`}>
                  <dt className="flex items-center gap-x-4 font-display text-xl font-semibold leading-7 text-slate-900">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">{feature.desc}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      {/* Impact Stats Banner */}
      <div className="bg-slate-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {[
              { id: 1, name: 'Faster response times', value: '3x', color: 'text-indigo-400' },
              { id: 2, name: 'Volunteers deployed instantly', value: '10,000+', color: 'text-emerald-400' },
              { id: 3, name: 'AI accuracy in need detection', value: '98%', color: 'text-amber-400' },
            ].map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-slate-300">{stat.name}</dt>
                <dd className={`order-first text-5xl font-semibold tracking-tight ${stat.color} sm:text-6xl font-display`}>
                  {stat.value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
