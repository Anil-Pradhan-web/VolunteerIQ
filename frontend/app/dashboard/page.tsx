import { BarChart2, ChevronDown, MoreHorizontal, Plus, TrendingUp, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top row - 4 Cards */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <h3 className="text-[15px] font-medium text-slate-600">Total Volunteers Deployed</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
              <BarChart2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 font-display text-[40px] font-bold leading-none text-slate-800">1,308</p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
              Trend <TrendingUp className="h-3 w-3" /> .6%
            </div>
            {/* Fake SVG Line chart */}
            <svg width="120" height="40" viewBox="0 0 120 40" className="opacity-80">
              <path d="M0 35 Q 20 20, 40 30 T 80 15 T 120 5" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <h3 className="text-[15px] font-medium text-slate-600">Active Tasks</h3>
            <div className="flex h-8 w-8 gap-0.5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              <TrendingUp className="h-3 w-3" />
            </div>
          </div>
          <p className="mt-4 font-display text-[40px] font-bold leading-none text-slate-800">43</p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
              Trend <TrendingUp className="h-3 w-3" /> .35
            </div>
            {/* Fake SVG Line chart */}
            <svg width="120" height="40" viewBox="0 0 120 40" className="opacity-80">
              <path d="M0 30 Q 20 40, 40 20 T 80 25 T 120 10" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3 - Gradient Survey Analysis */}
        <div className="relative overflow-hidden rounded-[24px] border border-slate-100 bg-gradient-to-br from-[#eff6ff] to-[#f5f3ff] p-6 shadow-sm">
          <div className="flex items-start justify-between relative z-10">
            <h3 className="text-[15px] font-medium text-slate-800">AI Survey Analysis</h3>
            <div className="flex h-8 w-8 items-center justify-center text-indigo-400">
              <MoreHorizontal className="h-5 w-5" />
            </div>
          </div>
          {/* Fake Bar Chart */}
          <div className="mt-8 flex h-[60px] items-end justify-between gap-2 relative z-10 px-2">
            {[40, 70, 45, 90, 60, 85, 50, 75, 100, 65].map((height, i) => (
              <div 
                key={i} 
                className={`w-3.5 rounded-full ${i % 2 === 0 ? 'bg-indigo-400/80 shadow-[0_0_10px_rgba(129,140,248,0.4)]' : 'bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.4)]'}`} 
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Card 4 - Top Community Problems */}
        <div className="rounded-[24px] border border-slate-100 bg-[#ebfbf5] p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <h3 className="text-[15px] font-medium text-slate-800">Top Community Problems</h3>
            <div className="flex h-8 w-8 items-center justify-center text-emerald-600">
              <Users2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <ul className="space-y-2.5 text-sm font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span> Social issues
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span> Resource Gaps
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Medical Needs
              </li>
            </ul>
            <svg width="70" height="40" viewBox="0 0 70 40" className="opacity-80">
              <path d="M0 30 Q 15 10, 35 25 T 70 10" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom row - 2 Large Cards */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1.1fr_0.9fr]">
        
        {/* Volunteer Matchmaker */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm xl:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Volunteer Matchmaker</h2>
              <p className="mt-1 text-sm text-slate-500">Beautifully profile based assignments in new tasks</p>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              Inrieo Tasks <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 border-t border-slate-100">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-4 pt-4 font-medium">Name</th>
                  <th className="pb-4 pt-4 font-medium">Skills</th>
                  <th className="pb-4 pt-4 font-medium">Availability</th>
                  <th className="pb-4 pt-4 text-center font-medium">Active Assignments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: "Sanra Smith", email: "sanra@volunteer", status: "Availability", statusBg: "bg-indigo-50", statusDot: "bg-indigo-500", action: "Assign new task", active: true },
                  { name: "Aliax Olva", email: "aliax@volunteer", status: "Availability", statusBg: "bg-white", statusDot: "bg-indigo-500", action: "Ready for Match", actionStyle: "bg-cyan-50 text-cyan-700" },
                  { name: "Janes Moran", email: "janes@volunteer", status: "Complete", statusBg: "bg-white", statusDot: "bg-emerald-500", action: "Assign new task" },
                  { name: "Eoiira Berron", email: "eoiira@volunteer", status: "Availability", statusBg: "bg-white", statusDot: "bg-indigo-500", action: "Ready for Match", actionStyle: "bg-cyan-50 text-cyan-700" },
                ].map((user, i) => (
                  <tr key={i} className={`group transition-colors hover:bg-slate-50/50 ${user.active ? 'bg-gradient-to-r from-indigo-50/50 to-transparent' : ''}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}&backgroundColor=e2e8f0`} className="h-11 w-11 rounded-xl bg-slate-100 object-cover" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">Skills, Course, Skill...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">Availability</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className={`h-2 w-2 rounded-full ${user.statusDot}`}></span> {user.status}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <button className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${user.actionStyle ? user.actionStyle : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        {user.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global NGO Projects Map */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm xl:p-8 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-xl font-semibold text-slate-900">Global NGO Projects</h2>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition">
              Project Status <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Fake Map SVG/Illustration container */}
          <div className="mt-6 flex-1 relative min-h-[250px] w-full bg-slate-100/50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
            {/* World Map SVG Abstract Shapes */}
            <svg viewBox="0 0 800 400" className="absolute inset-0 h-full w-full object-cover opacity-[0.14]" fill="#94a3b8">
              <path d="M150 150 Q180 120 200 160 T250 140 T300 180 T280 220 T200 240 T150 200 Z" />
              <path d="M400 100 Q450 80 500 120 T550 180 T500 240 T420 200 Z" />
              <path d="M600 180 Q650 150 700 200 T680 280 T600 250 Z" />
              <path d="M100 250 Q130 220 160 260 T140 300 Z" />
              <path d="M350 280 Q400 250 450 300 T420 350 T330 320 Z" />
            </svg>
            
            {/* Control buttons */}
            <div className="absolute left-4 top-4 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white/80 p-1 shadow-sm mix-blend-multiply backdrop-blur-md">
              <button className="p-1 text-slate-600 hover:text-slate-900"><Plus className="h-4 w-4" /></button>
              <div className="h-px bg-slate-200 mx-1"></div>
              <button className="p-1 pb-1.5 text-slate-600 hover:text-slate-900 leading-none text-lg font-bold">-</button>
            </div>

            {/* Map Pins */}
            <div className="absolute left-[25%] top-[40%] flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            </div>
            <div className="absolute left-[35%] top-[60%] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            </div>
            <div className="absolute left-[55%] top-[35%] flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            </div>
            <div className="absolute left-[65%] top-[55%] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            </div>
            <div className="absolute left-[80%] top-[70%] flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500 mb-2">Projects</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span> Now
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span> High
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col justify-end">
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-semibold text-slate-700">Volunteers by</p>
                <div className="text-right">
                  <p className="font-display text-xl font-bold leading-none text-slate-900">128</p>
                  <p className="text-[10px] text-slate-500">Volunteers</p>
                </div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden flex">
                <div className="h-full w-[45%] bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="h-full w-[25%] bg-emerald-400"></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
