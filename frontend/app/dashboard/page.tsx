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
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface DashboardStats {
  total_volunteers: number;
  active_tasks: number;
  completed_tasks: number;
  open_tasks: number;
  top_problems: string[];
  recent_surveys: string[];
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
        const res = await fetch(`${API_URL}/api/dashboard/default-ngo`, {
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
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
      <PageHeader
        title={`Welcome back${profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}`}
        description="A trusted operational snapshot of volunteer mobilization and community needs."
      />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} tone={card.tone} />
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Problems */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              Top Community Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
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

        {/* Recent Surveys + Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-indigo-500" />
                Recent Surveys
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recent_surveys && stats.recent_surveys.length > 0 ? (
                <div className="space-y-2">
                  {stats.recent_surveys.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5"
                    >
                      <FileText className="h-4 w-4 text-slate-400" />
                      <p className="text-sm text-slate-700 truncate">{name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-4 text-center">
                  No surveys uploaded yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-amber-50">
            <CardContent className="pt-5">
              <h3 className="font-semibold text-slate-900">Quick Actions</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/upload">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-primary/20 bg-white text-sm"
                  >
                    <Upload className="mr-2 h-4 w-4 text-primary" />
                    Upload Survey
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-primary/20 bg-white text-sm"
                  >
                    <ClipboardList className="mr-2 h-4 w-4 text-primary" />
                    Manage Tasks
                  </Button>
                </Link>
                <Link href="/volunteers">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-primary/20 bg-white text-sm"
                  >
                    <Users2 className="mr-2 h-4 w-4 text-primary" />
                    View Volunteers
                  </Button>
                </Link>
                <Link href="/volunteer/profile">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-primary/20 bg-white text-sm"
                  >
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    My Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
