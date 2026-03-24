"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  MapPin,
  CalendarClock,
  Users2,
  Search,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { FilterChips } from "@/components/common/filter-chips";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { StatusBadge } from "@/components/common/status-badge";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const SKILLS = [
  "Medical", "First Aid", "Teaching", "Driving", "Logistics",
  "Cooking", "Construction", "IT Support", "Counseling", "Translation",
];

interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  status: string;
  assignedTo: string[];
  createdAt: string;
}

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    requiredSkills: [] as string[],
    location: "",
  });
  const [creating, setCreating] = useState(false);

  const fetchTasks = async () => {
    try {
      let headers: Record<string, string> = {};
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_URL}/api/tasks`, { headers });
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleCreate = async () => {
    if (!newTask.title) return;
    setCreating(true);
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ngoId: "default-ngo",
          title: newTask.title,
          description: newTask.description,
          requiredSkills: newTask.requiredSkills,
          location: newTask.location,
          status: "open",
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewTask({ title: "", description: "", requiredSkills: [], location: "" });
        await fetchTasks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setNewTask((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Operations"
        description="Define, assign, and track field tasks with clear ownership."
        action={
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add required details so volunteers can be matched reliably.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Title *</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g., Mobile health camp setup"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Description *</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="What needs to be done..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Location *</label>
                  <Input
                    value={newTask.location}
                    onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                    placeholder="e.g., Bhubaneswar"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Required Skills</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-full border px-3 py-1 text-sm transition ${
                          newTask.requiredSkills.includes(skill)
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCreate(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!newTask.title || !newTask.description || !newTask.location || creating}
                  >
                    {creating ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                    ) : (
                      <><Plus className="mr-2 h-4 w-4" /> Create Task</>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <FilterChips options={["all", "open", "assigned", "completed"]} selected={filter} onSelect={setFilter} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Open" value={tasks.filter((t) => t.status === "open").length} icon={AlertCircle} tone="danger" />
        <StatCard label="Assigned" value={tasks.filter((t) => t.status === "assigned").length} icon={Clock} tone="warning" />
        <StatCard label="Completed" value={tasks.filter((t) => t.status === "completed").length} icon={CheckCircle2} tone="success" />
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No tasks found"
          description="Create your first task to begin volunteer coordination."
          action={<Button onClick={() => setShowCreate(true)}><Plus className="mr-2 h-4 w-4" /> Create Task</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{task.title}</CardTitle>
                  <StatusBadge status={task.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {task.description && (
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {task.location || "No location set"}
                </div>
                {task.requiredSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {task.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                {task.assignedTo?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Users2 className="h-3.5 w-3.5" />
                    {task.assignedTo.length} assigned
                  </div>
                )}
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
