import Link from "next/link";
import { ArrowRight, BarChart3, Globe2, HeartHandshake, Sparkles, Users2, FileText, ClipboardList } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#fafafa] font-sans text-slate-900 selection:bg-primary/20 selection:text-slate-900">
      {/* Navbar */}
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="VolunteerIQ Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-slate-900/5" />
          <span className="font-display text-xl font-bold tracking-tight">VolunteerIQ</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="rounded-full border-slate-200 bg-white/50 text-slate-700 backdrop-blur-md hover:bg-slate-50 transition-colors">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="rounded-full">
              Start Coordinating
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
            <span className="bg-gradient-to-r from-primary via-amber-500 to-emerald-500 bg-clip-text text-transparent">
              allocation for NGOs.
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-600 max-w-lg">
            Empower your social impact missions with AI-driven insights. Turn scattered field data into immediate, targeted action through intelligent volunteer coordination.
          </p>

          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/login">
              <Button size="lg" className="h-14 rounded-full px-8 text-base">
                Continue to Workspace <ArrowRight className="ml-2 h-5 w-5" />
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
      {/* How it Works Section */}
      <div className="relative bg-slate-900 py-32 overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Intelligent Workflow</h2>
            <p className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              From data to deployment in minutes.
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Stop manually sifting through paperwork. Let our AI pipeline process your field data and recommend the best allocation of your resources.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {[
                { 
                  step: '01',
                  title: 'Upload Field Data', 
                  desc: 'Simply drag and drop community survey reports, PDFs, or handwritten notes from the ground.',
                  icon: FileText
                },
                { 
                  step: '02',
                  title: 'AI Analysis', 
                  desc: 'Gemini instantly extracts key demographics, top problems, and urgency scores from raw text.',
                  icon: Sparkles
                },
                { 
                  step: '03',
                  title: 'Auto-Task Generation', 
                  desc: 'Actionable relief tasks are automatically generated with required skills and location metadata.',
                  icon: ClipboardList
                },
                { 
                  step: '04',
                  title: 'Smart Matching', 
                  desc: 'Volunteers are ranked and notified based on proximity, availability, and specific skillsets.',
                  icon: HeartHandshake
                }
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col">
                  <dt className="flex flex-col gap-y-4 font-display text-xl font-semibold leading-7 text-white">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                      <span className="text-indigo-300 font-bold text-lg">{feature.step}</span>
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                    <p className="flex-auto">{feature.desc}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Global Impact map banner */}
      <div className="bg-white py-24 sm:py-32 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
           <svg width="1000" height="1000" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="49" stroke="black" strokeWidth="0.5" strokeDasharray="2 2" /><circle cx="50" cy="50" r="35" stroke="black" strokeWidth="0.5" strokeDasharray="2 2" /><circle cx="50" cy="50" r="20" stroke="black" strokeWidth="0.5" strokeDasharray="2 2" /></svg>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display mb-10">Real-world Application Scenarios</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
               <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Globe2 /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Disaster Relief</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">During floods or cyclones, NGOs receive thousands of chaotic SOS messages. VolunteerIQ structure these into urgent tasks, mapping rescue volunteers instantly.</p>
               </div>
               <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><HeartHandshake /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Health Camps</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Medical surveys often take weeks to analyze. Our AI processes patient data overnight to deploy doctors with the right supplies to high-density zones.</p>
               </div>
               <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-amber-200 transition-colors">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><Users2 /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Education Drives</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Identify community schooling gaps. Automatically match teachers proficient in local languages with temporary slum education centers.</p>
               </div>
            </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-slate-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to scale your impact?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Join leading NGOs making data-driven decisions. Transform your scattered volunteer force into a highly coordinated response team.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/login">
                <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100 h-14 px-8 font-semibold">
                  Get Started for Free
                </Button>
              </Link>
            </div>
            <svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-[20%] [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
              <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.7"></circle>
              <defs>
                <radialGradient id="gradient">
                  <stop stopColor="#6366f1"></stop>
                  <stop offset="1" stopColor="#10b981"></stop>
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 text-center text-slate-500">
         <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 grayscale opacity-60 rounded-md" />
            <span className="font-semibold text-slate-700">VolunteerIQ</span>
         </div>
         <p className="text-sm">Built for Google Solution Challenge 2026. Empowering NGOs with AI.</p>
      </footer>
    </main>
  );
}
