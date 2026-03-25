 "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  MapPin,
  Users2,
  Sparkles,
  Loader2,
  CheckCircle2,
  Edit3,
  Trash2,
  Save,
  X,
  ChevronDown
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState<any[] | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [provider, setProvider] = useState<"gemini" | "groq">("gemini");
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    requiredSkills: [] as string[],
    status: ""
  });
  const [updating, setUpdating] = useState(false);

  const fetchTaskAndVolunteers = async () => {
    try {
      let headers: Record<string, string> = {};
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const [tasksRes, volunteersRes] = await Promise.all([
        fetch(`${API_URL}/api/tasks`, { headers }),
        fetch(`${API_URL}/api/volunteers`, { headers })
      ]);

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        const found = Array.isArray(data)
          ? data.find((item: Task) => String(item.id) === String(params.id))
          : null;
        setTask(found || null);
      }

      if (volunteersRes.ok) {
        const data = await volunteersRes.json();
        setVolunteers(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskAndVolunteers();
  }, [params.id, user]);

  useEffect(() => {
    if (task) {
      setEditForm({
        title: task.title,
        description: task.description,
        location: task.location,
        requiredSkills: task.requiredSkills || [],
        status: task.status
      });
    }
  }, [task]);

  const handleMatchVolunteers = async () => {
    if (!task) return;
    setMatching(true);
    setMatches(null);
    setActionError("");
    setActionMessage("");
    try {
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Fetch all volunteers
      const volRes = await fetch(`${API_URL}/api/volunteers`, { headers });
      const volunteers = volRes.ok ? await volRes.json() : [];
      
      // Request matches
      const matchRes = await fetch(`${API_URL}/api/match-volunteers`, {
        method: "POST",
        headers,
        body: JSON.stringify({ task, volunteers, provider })
      });
      if (matchRes.ok) {
        const data = await matchRes.json();
        const matchesWithPhotos = data.map((m: any) => {
          const vol = volunteers.find((v: any) => String(v.id) === String(m.volunteer_id));
          return { ...m, photoURL: vol?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.volunteer_id}` };
        });
        setMatches(matchesWithPhotos);
      } else {
        setActionError(
          `Failed to get matches from ${
            provider === "gemini" ? "Gemini" : "Groq (Llama 3)"
          }. Please try again.`
        );
      }
    } catch (e) {
      console.error(e);
      setActionError("Error finding matches. Please try again.");
    } finally {
      setMatching(false);
    }
  };

  const handleAssign = async (volunteerId: string) => {
    if (!task) return;
    setAssigningId(volunteerId);
    setActionError("");
    setActionMessage("");
    try {
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${API_URL}/api/assign`, {
        method: "POST",
        headers,
        body: JSON.stringify({ task_id: Number(params.id), volunteer_id: volunteerId })
      });
      if (res.ok) {
        setActionMessage("Volunteer assigned successfully.");
        setMatches(null);
        await fetchTaskAndVolunteers(); // refresh task details
      } else {
        setActionError("Failed to assign volunteer. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setActionError("Error assigning volunteer. Please try again.");
    } finally {
      setAssigningId(null);
    }
  };

  const handleUpdateTask = async () => {
    if (!task) return;
    setUpdating(true);
    setActionError("");
    setActionMessage("");
    try {
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${API_URL}/api/tasks/${params.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setActionMessage("Task updated successfully.");
        setShowEditDialog(false);
        await fetchTaskAndVolunteers();
      } else {
        setActionError("Failed to update task details.");
      }
    } catch (e) {
      console.error(e);
      setActionError("Error updating task.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUnassign = async (volunteerId: string) => {
    if (!task) return;
    setActionError("");
    setActionMessage("");
    try {
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${API_URL}/api/unassign`, {
        method: "POST",
        headers,
        body: JSON.stringify({ task_id: Number(params.id), volunteer_id: volunteerId })
      });
      if (res.ok) {
        setActionMessage("Volunteer unassigned.");
        await fetchTaskAndVolunteers();
      } else {
        setActionError("Failed to unassign volunteer.");
      }
    } catch (e) {
      console.error(e);
      setActionError("Error unassigning.");
    }
  };

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
     <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title={task.title}
          description="Detailed task view for transparent assignment and completion tracking."
          className="pb-0"
        />
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-sm">
          <div className="flex flex-col px-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Provider</span>
            <Select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value as any)}
              className="h-8 border-none bg-transparent font-semibold text-indigo-600 focus-visible:ring-0 px-0 cursor-pointer"
            >
              <option value="gemini">Google Gemini 1.5</option>
              <option value="groq">Groq (Llama 3.3)</option>
            </Select>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <Button 
            onClick={handleMatchVolunteers} 
            disabled={matching}
            className="rounded-[14px] bg-slate-900 text-white hover:bg-slate-800 transition-all px-6"
          >
            {matching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
                Find Best Match
              </>
            )}
          </Button>
        </div>
      </div>

      {actionError ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50/70 px-5 py-4 text-sm font-semibold text-rose-700"
        >
          {actionError}
        </div>
      ) : null}

      {actionMessage ? (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 text-sm font-semibold text-emerald-700"
        >
          {actionMessage}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-xl rounded-[32px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusBadge status={task.status} />
                <div className="flex items-center gap-2">
                   <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                      <DialogTrigger asChild>
                         <Button variant="ghost" className="h-8 w-8 rounded-lg p-0 hover:bg-slate-100 transition-all text-slate-400 hover:text-indigo-600">
                            <Edit3 className="h-4 w-4" />
                         </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white">
                         <div className="bg-slate-900 p-8 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                               <Edit3 className="h-20 w-20" />
                            </div>
                            <DialogHeader>
                               <DialogTitle className="text-3xl font-black tracking-tight">Modify Directive</DialogTitle>
                               <DialogDescription className="text-slate-400">Update task parameters for the field team.</DialogDescription>
                            </DialogHeader>
                         </div>
                         <div className="p-8 space-y-6 max-h-[min(70vh,600px)] overflow-y-auto custom-scrollbar tracking-tight">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2 md:col-span-2">
                                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Mission Title</label>
                                  <Input 
                                    value={editForm.title} 
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    className="rounded-2xl border-slate-100 bg-slate-50/50 h-12 focus:ring-indigo-500 font-bold"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Logistics (Location)</label>
                                  <Input 
                                    value={editForm.location} 
                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                    className="rounded-2xl border-slate-100 bg-slate-50/50 h-12 focus:ring-indigo-500 font-semibold"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Mission Status</label>
                                  <div className="relative">
                                    <select 
                                      value={editForm.status} 
                                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                      className="w-full rounded-2xl border-slate-100 bg-slate-50/50 h-12 px-4 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
                                    >
                                       <option value="open">Open (Field Search)</option>
                                       <option value="assigned">Assigned (Active Duty)</option>
                                       <option value="completed">Completed (Mission Success)</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                      <ChevronDown className="h-4 w-4 text-slate-900" />
                                    </div>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Required Expertise (Comma separated)</label>
                               <Input 
                                 value={editForm.requiredSkills.join(", ")} 
                                 onChange={(e) => setEditForm({...editForm, requiredSkills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                                 className="rounded-2xl border-slate-100 bg-slate-50/50 h-12 focus:ring-indigo-500 font-medium"
                                />
                             </div>
                             
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Field Briefing & Objectives</label>
                                <Textarea 
                                  value={editForm.description} 
                                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                  className="rounded-[28px] border-slate-100 bg-slate-50/50 min-h-[120px] focus:ring-indigo-500 leading-relaxed text-slate-600 p-6"
                                />
                             </div>
                          </div>
                          <div className="p-8 pt-6 border-t border-slate-50 flex gap-3">
                             <Button variant="ghost" onClick={() => setShowEditDialog(false)} className="rounded-2xl px-6 h-14 font-bold text-slate-400 hover:text-slate-600">
                                Cancel
                             </Button>
                             <Button onClick={handleUpdateTask} disabled={updating} className="flex-1 rounded-[24px] bg-slate-900 hover:bg-indigo-600 text-white shadow-xl h-14 font-black transition-all">
                                {updating ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="mr-2 h-5 w-5" /> Synchronize Changes</>}
                             </Button>
                          </div>
                       </DialogContent>
                   </Dialog>
                   <Badge variant="outline" className="rounded-full bg-slate-50 border-slate-200">Task ID: {task.id.slice(0, 8)}</Badge>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 mt-4">{task.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-[28px] bg-amber-50/50 p-6 border border-amber-100/50">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber-600/80 mb-3">
                    Required skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {task.requiredSkills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] bg-indigo-50/50 p-6 border border-indigo-100/50">
                   <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-indigo-600/80 mb-3">Location</p>
                   <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                      <MapPin className="h-4 w-4" />
                      {task.location}
                   </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Description</p>
                <div className="rounded-[28px] bg-slate-50/50 p-8 border border-slate-100 leading-relaxed text-slate-600">
                  {task.description || "No description provided."}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[32px] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Users2 className="h-24 w-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Assignment Status</CardTitle>
              <CardDescription className="text-slate-400 italic">Live tracking from the field</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-sm text-slate-300">Staffing Level</span>
                  <span className="text-2xl font-bold text-white tracking-tighter">
                    {task.assignedTo?.length || 0} <span className="text-xs font-normal text-slate-500 uppercase tracking-widest ml-1">Volunteers</span>
                  </span>
               </div>
               
                <div className="flex items-center gap-4 text-xs text-slate-400 px-2 leading-tight">
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  System ready for AI matching and field deployment.
               </div>

               {task.assignedTo?.length > 0 && (
                 <div className="pt-4 border-t border-white/10 space-y-3">
                   <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest">Assigned Personnel</p>
                   <div className="space-y-2">
                     {volunteers
                       .filter(v => task.assignedTo.includes(v.id))
                       .map(vol => (
                         <div key={vol.id} className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <img 
                              src={vol.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${vol.id}`} 
                              className="h-8 w-8 rounded-lg object-cover border border-white/10" 
                              alt={vol.name}
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                               <p className="text-sm font-bold truncate">{vol.name}</p>
                               <p className="text-[10px] text-slate-500 font-medium">#{vol.id.slice(0, 8)}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleUnassign(vol.id)}
                              className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                       ))}
                   </div>
                 </div>
               )}

               <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-4 tracking-widest">Selected AI Analysis</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{provider === 'gemini' ? 'Gemini 1.5 Pro' : 'Groq Llama 3'}</p>
                      <p className="text-xs text-slate-500">{provider === 'gemini' ? 'Multimodal reasoning' : 'Fast inference intelligence'}</p>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {matches && matches.length > 0 && (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between px-2">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                 Top AI Recommended Matches
              </h3>
              <p className="text-slate-500 text-sm pl-11">Based on location proximity, skill alignment, and historical performance.</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border-indigo-100">
                Sorted by {provider.toUpperCase()} Confidence
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match, i) => (
              <Card key={i} className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-[32px] overflow-hidden flex flex-col border-b-4 border-b-transparent hover:border-b-indigo-500">
                <CardHeader className="pb-4 relative">
                  <div className="absolute top-6 right-6 z-10">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-1.5">
                       <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{match.match_score}% MATCH</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <img 
                      src={match.photoURL} 
                      alt={match.name} 
                      className="h-20 w-20 rounded-3xl border-4 border-slate-50 object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">{match.name || "Volunteer"}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-indigo-600 font-medium">
                        ID: {match.volunteer_id.slice(0, 8)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-grow flex flex-col">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 relative">
                    <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Reasoning</div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{match.match_reason}"
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 flex gap-3">
                    <Button 
                      onClick={() => handleAssign(match.volunteer_id)}
                      disabled={assigningId === match.volunteer_id || task.assignedTo?.includes(match.volunteer_id)}
                      className={`w-full h-12 rounded-[18px] transition-all font-bold ${
                        task.assignedTo?.includes(match.volunteer_id) 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]'
                      }`}
                    >
                      {assigningId === match.volunteer_id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : task.assignedTo?.includes(match.volunteer_id) ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Assigned
                        </>
                      ) : (
                        "Confirm Assignment"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
