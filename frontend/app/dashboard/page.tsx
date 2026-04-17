"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users2,
  ClipboardList,
  CheckCircle2,
  CircleDashed,
  Upload,
  AlertTriangle,
  Loader2,
  ArrowRight,
  FileText,
  Globe2,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { LiveMap } from "@/components/common/live-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildApiUrl } from "@/lib/api";

interface DashboardStats {
  total_volunteers: number;
  active_tasks: number;
  completed_tasks: number;
  open_tasks: number;
  top_problems: string[];
  recent_surveys: string[];
  map_tasks: any[];
}

export default function DashboardPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force a profile refresh in case backend role changed (e.g. from volunteer to admin)
    if (user) refreshProfile();
    
    const fetchStats = async () => {
      try {
        let headers: Record<string, string> = {};
        if (user) {
          const token = await user.getIdToken();
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(buildApiUrl("/api/dashboard/default-ngo"), {
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2 pb-4">
          <div className="h-8 w-1/3 rounded-xl bg-slate-200/60" />
          <div className="h-4 w-1/2 rounded-lg bg-slate-100/60" />
        </div>
        {/* Stat Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-full">
                  <div className="h-4 w-24 rounded bg-slate-100" />
                  <div className="h-8 w-16 rounded-lg bg-slate-200" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
        {/* Bottom Row Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[300px] rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="h-6 w-1/3 rounded bg-slate-200 mb-6" />
            <div className="space-y-4">
               <div className="h-12 w-full rounded-xl bg-slate-50" />
               <div className="h-12 w-full rounded-xl bg-slate-50" />
               <div className="h-12 w-full rounded-xl bg-slate-50" />
            </div>
          </div>
          <div className="h-[300px] rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="h-6 w-1/3 rounded bg-slate-200 mb-6" />
            <div className="space-y-4">
               <div className="h-10 w-full rounded-xl bg-slate-50" />
               <div className="h-10 w-full rounded-xl bg-slate-50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Volunteers", value: stats?.total_volunteers ?? 0, icon: Users2, tone: "primary" as const },
    { label: "Active Tasks", value: stats?.active_tasks ?? 0, icon: ClipboardList, tone: "warning" as const },
    { label: "Completed Tasks", value: stats?.completed_tasks ?? 0, icon: CheckCircle2, tone: "success" as const },
    { label: "Open Tasks", value: stats?.open_tasks ?? 0, icon: CircleDashed, tone: "danger" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <PageHeader
           title={`Welcome back${profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}`}
           description="A trusted operational snapshot of volunteer mobilization and community needs."
         />
         <div className="flex items-center gap-2">
            <Link href="/upload">
               <Button className="rounded-full shadow-sm bg-indigo-600 hover:bg-indigo-700">
                  <Upload className="w-4 h-4 mr-2" /> New Survey
               </Button>
            </Link>
            <Link href="/tasks">
               <Button variant="outline" className="rounded-full bg-white shadow-sm border-slate-200 hover:bg-slate-50">
                  <ClipboardList className="w-4 h-4 mr-2" /> View Tasks
               </Button>
            </Link>
         </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} tone={card.tone} />
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Problems & Surveys */}
        <Card className="border-indigo-100/50 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                Urgent Community Problems
              </CardTitle>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100">AI Extracted</Badge>
            </div>
            <CardDescription className="text-xs">Based on most recent survey analysis</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {stats?.top_problems && stats.top_problems.length > 0 ? (
              <div className="space-y-3">
                {stats.top_problems.map((problem, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-700">
                      {problem}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Upload}
                title="No problem analysis yet"
                description="Upload a survey to generate AI-prioritized community issues."
                action={
                  <Link href="/upload">
                    <Button variant="outline" size="sm">
                      Upload Survey <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Surveys */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-3 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-indigo-500" />
                Recent Survey Scans
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {stats?.recent_surveys && stats.recent_surveys.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_surveys.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-500 flex items-center justify-center">
                          <FileText className="h-4 w-4" />
                       </div>
                       <p className="text-sm font-medium text-slate-700 truncate max-w-[150px] sm:max-w-xs">{name}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Analyzed</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">
                No surveys uploaded yet.
              </p>
            )}
            
            {/* Quick stats visualization */}
            {stats && (stats.completed_tasks + stats.active_tasks + stats.open_tasks) > 0 && (
               <div className="mt-6 pt-6 border-t border-slate-50">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Task Health Overview</h4>
                  <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
                     <div className="bg-emerald-500 h-full" style={{ width: `${(stats.completed_tasks / (stats.completed_tasks + stats.active_tasks + stats.open_tasks)) * 100}%` }} />
                     <div className="bg-amber-500 h-full" style={{ width: `${(stats.active_tasks / (stats.completed_tasks + stats.active_tasks + stats.open_tasks)) * 100}%` }} />
                     <div className="bg-rose-500 h-full" style={{ width: `${(stats.open_tasks / (stats.completed_tasks + stats.active_tasks + stats.open_tasks)) * 100}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-medium">
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed</span>
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Active</span>
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Open</span>
                  </div>
               </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Map & Activity Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map takes 2 cols on Large displays */}
        <Card className="lg:col-span-2 shadow-sm border-slate-100">
          <CardHeader className="pb-3 border-b border-slate-50">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="relative flex h-3 w-3 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Operations Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-1">
               <LiveMap tasks={stats?.map_tasks || []} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Field Activity (1 col) */}
        <Card className="shadow-sm border-slate-100 flex flex-col h-full">
           <CardHeader className="pb-3 border-b border-slate-50">
             <CardTitle className="text-base">Recent Field Deployments</CardTitle>
             <CardDescription className="text-xs">Timeline of generated tasks</CardDescription>
           </CardHeader>
           <CardContent className="flex-1 p-0 overflow-y-auto max-h-[450px]">
              {stats?.map_tasks && stats.map_tasks.length > 0 ? (
                 <div className="flex flex-col">
                    {stats.map_tasks.slice(0, 5).map((task: any, i: number) => (
                       <div key={i} className="flex gap-3 p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0 relative">
                           {i !== stats.map_tasks.slice(0, 5).length - 1 && (
                              <div className="absolute left-[27px] top-[36px] bottom-[-16px] w-[2px] bg-slate-100" />
                           )}
                           <div className={`mt-0.5 w-6 h-6 rounded-full flex shrink-0 items-center justify-center shrink-0 z-10 ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : task.status === 'open' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Globe2 className="w-3 h-3" /> {task.location.split(",")[0]}
                                 </span>
                              </div>
                           </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="p-8 text-center text-sm text-slate-500">
                    No active field deployments yet.
                 </div>
              )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
