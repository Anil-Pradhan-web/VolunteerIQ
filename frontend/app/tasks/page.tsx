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
  const [createError, setCreateError] = useState("");

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
    const title = newTask.title.trim();
    const description = newTask.description.trim();
    const location = newTask.location.trim();

    if (!title) {
      setCreateError("Title is required.");
      return;
    }
    if (!description) {
      setCreateError("Description is required.");
      return;
    }
    if (!location) {
      setCreateError("Location is required.");
      return;
    }

    setCreateError("");
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
          title,
          description,
          requiredSkills: newTask.requiredSkills,
          location,
          status: "open",
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewTask({ title: "", description: "", requiredSkills: [], location: "" });
        setCreateError("");
        await fetchTasks();
      } else {
        setCreateError("Failed to create task. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setCreateError("Network error while creating the task.");
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
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <PageHeader
          title="Task Operations"
          description="Create and monitor assignments with clear accountability."
          className="pb-0"
        />
      </div>

      {/* Main Banner Card */}
      <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Task Operations</h2>
            <p className="text-slate-500 max-w-md">Define, assign, and track field tasks with clear ownership.</p>
          </div>
          
          <Dialog
            open={showCreate}
            onOpenChange={(open) => {
              setShowCreate(open);
              if (!open) setCreateError("");
            }}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-2xl bg-[#E45D17] hover:bg-[#D44D07] text-white px-8 h-12 shadow-md transition-all active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
               <div className="bg-slate-900 p-8 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create New Task</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Add required details so volunteers can be matched reliably.
                    </DialogDescription>
                  </DialogHeader>
               </div>
               <div className="p-8 space-y-6">
                 {createError ? (
                   <div
                     role="alert"
                     className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-semibold text-rose-700"
                   >
                     {createError}
                   </div>
                 ) : null}
                 <div className="space-y-2 text-sm">
                   <label className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">Title *</label>
                   <Input
                     value={newTask.title}
                     onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                     placeholder="e.g., Mobile health camp setup"
                     className="rounded-xl border-slate-200 focus:border-indigo-500 transition-colors"
                   />
                 </div>
                 <div className="space-y-2 text-sm">
                   <label className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">Description *</label>
                   <Textarea
                     value={newTask.description}
                     onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                     placeholder="What needs to be done..."
                     className="rounded-xl border-slate-200 focus:border-indigo-500 min-h-[100px]"
                   />
                 </div>
                 <div className="space-y-2 text-sm">
                   <label className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">Location *</label>
                   <Input
                     value={newTask.location}
                     onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                     placeholder="e.g., Bhubaneswar"
                     className="rounded-xl border-slate-200 focus:border-indigo-500"
                   />
                 </div>
                 <div className="space-y-2 text-sm">
                   <label className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">Required Skills</label>
                   <div className="mt-2 flex flex-wrap gap-2">
                     {SKILLS.map((skill) => (
                       <button
                         key={skill}
                         onClick={() => toggleSkill(skill)}
                         className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                           newTask.requiredSkills.includes(skill)
                             ? "bg-slate-900 text-white shadow-md scale-105"
                             : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                         }`}
                       >
                         {skill}
                       </button>
                     ))}
                   </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                   <Button variant="ghost" onClick={() => setShowCreate(false)} className="rounded-xl">
                     Cancel
                   </Button>
                   <Button
                     onClick={handleCreate}
                     disabled={!newTask.title || !newTask.description || !newTask.location || creating}
                     className="rounded-xl bg-slate-900 text-white px-8"
                   >
                     {creating ? (
                       <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                     ) : (
                       <><Plus className="mr-2 h-4 w-4" /> Finalize Task</>
                     )}
                   </Button>
                 </div>
               </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-[22px] border-none bg-white shadow-sm font-medium focus-visible:ring-indigo-500"
          />
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[22px] border border-white/20 shadow-sm overflow-x-auto no-scrollbar">
            {["all", "open", "assigned", "completed"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-6 py-2 rounded-[18px] text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === opt 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {opt}
              </button>
            ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Open", val: tasks.filter((t) => t.status === "open").length, icon: AlertCircle, tone: 'rose' },
          { label: "Assigned", val: tasks.filter((t) => t.status === "assigned").length, icon: Clock, tone: 'amber' },
          { label: "Completed", val: tasks.filter((t) => t.status === "completed").length, icon: CheckCircle2, tone: 'emerald' }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white rounded-[32px] p-6 group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <p className="text-4xl font-bold text-slate-900 leading-none">{stat.val}</p>
              </div>
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner ${
                stat.tone === 'rose' ? 'bg-rose-50 text-rose-500' :
                stat.tone === 'amber' ? 'bg-amber-50 text-amber-500' :
                'bg-emerald-50 text-emerald-500'
              }`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Task List Section */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No tasks found"
          description={filter === 'all' ? "Every community starts somewhere. Create your first task to begin." : `No tasks matching '${filter.toUpperCase()}' criteria.`}
          action={<Button variant="outline" onClick={() => setShowCreate(true)} className="rounded-xl border-slate-200">Start with a New Task</Button>}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task, i) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <Card 
                className={`group border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-[32px] overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="space-y-5">
                   <div className="flex items-center justify-between">
                     <StatusBadge status={task.status} />
                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Users2 className="h-3 w-3" />
                        {task.assignedTo?.length || 0} Found
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1">{task.title}</h3>
                     <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-10">{task.description}</p>
                   </div>
                   
                   <div className="pt-4 border-t border-slate-50 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                         <MapPin className="h-3.5 w-3.5 text-slate-300" />
                         {task.location}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {task.requiredSkills?.slice(0, 3).map((skill, si) => (
                          <span key={si} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] uppercase font-bold tracking-wider border border-slate-100">
                            {skill}
                          </span>
                        ))}
                        {task.requiredSkills?.length > 3 && (
                          <span className="px-2 py-1 text-[10px] font-bold text-slate-300">+{task.requiredSkills.length - 3}</span>
                        )}
                      </div>
                   </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
