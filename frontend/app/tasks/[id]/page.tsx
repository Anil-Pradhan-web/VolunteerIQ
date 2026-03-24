 "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  MapPin,
  Users2
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  status: string;
  assignedTo: string[];
}

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        let headers: Record<string, string> = {};
        if (user) {
          const token = await user.getIdToken();
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/api/tasks`, { headers });
        if (res.ok) {
          const data = await res.json();
          const found = Array.isArray(data)
            ? data.find((item: Task) => item.id === params.id)
            : null;
          setTask(found || null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [params.id, user]);

  if (loading) {
    return <div className="py-12 text-sm text-muted-foreground">Loading task details...</div>;
  }

  if (!task) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Task not found"
        description="The requested task does not exist or has been removed."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        description="Detailed task view for transparent assignment and completion tracking."
      />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <StatusBadge status={task.status} />
          <CardTitle>{task.title}</CardTitle>
          <CardDescription>
            Core task information used for assignment and progress tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-[24px] bg-amber-50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-700">
              Required skills
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {task.requiredSkills?.length ? task.requiredSkills.join(", ") : "No skills specified"}
            </p>
          </div>
          <div className="rounded-[24px] bg-white/80 p-5">
            <p className="text-sm text-slate-600">{task.description || "No description provided."}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Summary</CardTitle>
          <CardDescription>Reliable staffing information for this field task.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-[22px] border border-border/70 bg-white/80 p-4">
            <p className="font-semibold text-slate-900">Location</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4" />
              {task.location || "No location set"}
            </p>
          </div>
          <div className="rounded-[22px] border border-border/70 bg-white/80 p-4">
            <p className="font-semibold text-slate-900">Assigned Volunteers</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <Users2 className="h-4 w-4" />
              {task.assignedTo?.length || 0} assigned
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
