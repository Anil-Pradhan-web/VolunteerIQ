"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  Sparkles,
  Check,
  AlertTriangle,
  Loader2,
  X,
  MapPin,
  Plus,
  Brain,
  TrendingUp,
  Target,
  Clock,
  ClipboardList,
  Users2,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type UploadStatus = "idle" | "uploading" | "analyzing" | "done" | "error";

interface RecommendedTask {
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
}

interface AnalysisResult {
  topProblems?: string[];
  urgencyScores?: Record<string, string>;
  summary?: string;
  recommendedActions?: string[];
  recommendedTasks?: RecommendedTask[];
  totalResponses?: number;
}

export default function UploadPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [aiProvider, setAiProvider] = useState<"gemini" | "groq">("gemini");
  const [createdTaskIndices, setCreatedTaskIndices] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "text/csv",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const handleFile = (f: File) => {
    if (
      allowedTypes.includes(f.type) ||
      f.name.endsWith(".csv") ||
      f.name.endsWith(".pdf") ||
      f.name.endsWith(".docx") ||
      f.name.endsWith(".txt")
    ) {
      setFile(f);
      setStatus("idle");
      setAnalysis(null);
      setError("");
      setTaskError("");
    } else {
      setError("Only CSV, PDF, DOCX, TXT files are supported.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setError("");
    setTaskError("");
    setCreatedTaskIndices([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate brief upload delay for UX
      setStatus("analyzing");

      let headers: Record<string, string> = {};
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/upload-survey?ngoId=default-ngo&provider=${aiProvider}`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      setAnalysis(data.analysis);
      setStatus("done");
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setStatus("error");
    }
  };

  const createTask = async (taskData: RecommendedTask, index: number) => {
    setTaskError("");
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
          ...taskData,
          status: "open",
        }),
      });

      if (res.ok) {
        setCreatedTaskIndices((prev) => [...prev, index]);
      } else {
        setTaskError("Failed to create task. Please try again.");
      }
    } catch (err) {
      console.error("Task creation error:", err);
      setTaskError("Error creating task. Please try again.");
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatCards = [
    {
      icon: FileSpreadsheet,
      title: "CSV Surveys",
      desc: "Structured response data with issue, location, and demographic columns.",
      classes: "bg-amber-50",
      iconClass: "text-amber-600"
    },
    {
      icon: FileText,
      title: "PDF Reports",
      desc: "Field assessments, compiled forms, and report-style submissions.",
      classes: "bg-emerald-50",
      iconClass: "text-emerald-600"
    },
    {
      icon: FileText,
      title: "DOCX / TXT",
      desc: "Text summaries and field notes prepared by on-ground teams.",
      classes: "bg-sky-50",
      iconClass: "text-sky-600"
    }
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-16 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <PageHeader
          title="Social Impact Intelligence"
          description="Turn raw community signals into precise, actionable interventions."
          className="pb-0"
        />
      </div>

      {(error || taskError) && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50/70 px-5 py-4 text-sm font-semibold text-rose-700"
        >
          {error || taskError}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Main Interaction Zone */}
        <div className="space-y-8">
           <Card className="border-none shadow-2xl bg-white rounded-[40px] overflow-hidden p-2">
             <div
                className={`relative group flex min-h-[450px] flex-col items-center justify-center rounded-[36px] border-4 border-dashed transition-all duration-500 ${
                  dragActive
                  ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                  : file
                    ? "border-emerald-500/30 bg-emerald-50/20"
                    : "border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                   <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[100px]" />
                   <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-400 rounded-full blur-[100px]" />
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,.pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                />

                {file ? (
                  <div className="relative z-10 text-center space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="relative mx-auto h-24 w-24">
                       <div className="absolute inset-0 bg-emerald-500 rounded-3xl blur-xl opacity-20 animate-pulse" />
                       <div className="relative flex h-full w-full items-center justify-center rounded-3xl bg-white shadow-xl border border-emerald-100">
                          {file.name.endsWith(".pdf") ? (
                            <FileText className="h-10 w-10 text-emerald-600" />
                          ) : (
                            <FileSpreadsheet className="h-10 w-10 text-emerald-600" />
                          )}
                       </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{file.name}</h3>
                      <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1">
                        {(file.size / 1024).toFixed(1)} KB • Ready for Intelligence Scan
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => { setFile(null); setAnalysis(null); setStatus("idle"); }}
                        className="rounded-2xl text-slate-400 hover:text-rose-500"
                      >
                        <X className="mr-2 h-4 w-4" /> Discard
                      </Button>
                      {status === "idle" && (
                         <div className="h-10 w-px bg-slate-100 mx-2" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 text-center space-y-8 max-w-sm px-6">
                    <div className="relative mx-auto h-24 w-24 group-hover:scale-110 transition-transform duration-500">
                       <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                       <div className="relative flex h-full w-full items-center justify-center rounded-3xl bg-white shadow-xl border border-indigo-50">
                          <Upload className="h-10 w-10 text-indigo-600" />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Feed the Intelligence</h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Drag & drop community surveys (CSV, PDF, TXT) to identify urgent problems.
                      </p>
                    </div>
                    <Button
                      onClick={() => inputRef.current?.click()}
                      className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white px-10 h-14 shadow-xl transition-all active:scale-95 text-lg font-bold"
                    >
                      Browse Local Files
                    </Button>
                  </div>
                )}
              </div>
           </Card>

           {/* Analysis Controls */}
           {file && status !== "done" && status !== "analyzing" && (
             <Card className="border-none shadow-xl bg-slate-900 rounded-[40px] p-8 text-white animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5">
                            <Brain className="h-5 w-5 text-indigo-400" />
                         </div>
                         <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Engine Selection</p>
                            <div className="flex items-center gap-1 cursor-pointer group">
                                <Select
                                  value={aiProvider}
                                  onChange={(e) => setAiProvider(e.target.value as "gemini" | "groq")}
                                  className="border-none bg-transparent p-0 h-auto font-bold text-lg text-white focus:ring-0 w-auto min-w-[120px]"
                                >
                                  <option value="gemini">Gemini 1.5 Pro</option>
                                  <option value="groq">Groq Llama 3</option>
                                </Select>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <Button
                    onClick={handleUpload}
                    className="w-full md:w-auto h-16 rounded-[28px] bg-indigo-500 hover:bg-indigo-400 text-white px-12 shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all font-black text-xl"
                  >
                    <Sparkles className="mr-3 h-6 w-6" />
                    Begin AI Scan
                  </Button>
                </div>
             </Card>
           )}

           {/* Results Preview (Placeholder/Brief) */}
           {status === "analyzing" && (
             <div className="py-20 flex flex-col items-center justify-center animate-pulse">
                <div className="relative">
                   <div className="h-32 w-32 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                   <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-indigo-600" />
                </div>
                <h4 className="mt-8 text-2xl font-black text-slate-900 tracking-tight">Intelligence Scan in Progress...</h4>
                <p className="mt-2 text-slate-400 font-bold uppercase tracking-widest text-xs">Parsing community signals with {aiProvider.toUpperCase()}</p>
             </div>
           )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-white rounded-[40px] p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Ingestion Standards</h3>
              <div className="space-y-4">
                 {[
                    { icon: FileSpreadsheet, label: "Structured Data", desc: "CSV files with tab-delimited columns.", color: "bg-amber-50 text-amber-600" },
                    { icon: FileText, label: "Narrative Docs", desc: "PDF or Word notes from the field.", color: "bg-emerald-50 text-emerald-600" },
                    { icon: Target, label: "Raw Signals", desc: "Unstructured text fragments.", color: "bg-sky-50 text-sky-600" }
                 ].map((standard, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                       <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${standard.color}`}>
                          <standard.icon className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">{standard.label}</p>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{standard.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>

           <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[40px] p-8 text-white relative overflow-hidden">
             <div className="relative z-10 space-y-4">
               <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-indigo-100" />
               </div>
               <h3 className="text-xl font-bold tracking-tight">Advanced Reasoning</h3>
               <p className="text-sm text-indigo-100/70 leading-relaxed font-medium">
                 Our system uses Large Language Models to interpret local nuance, linguistic patterns, and geographic urgency within your survey text.
               </p>
             </div>
             <div className="absolute bottom-[-20px] right-[-20px] opacity-10">
                <Brain className="h-40 w-40" />
             </div>
           </Card>
        </div>
      </div>

      {/* Full Width Analysis Results */}
      {status === "done" && analysis && (
        <div className="pt-8 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs">
                  <Check className="h-4 w-4" /> Scan Successful
               </div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Briefing</h2>
            </div>
            <div className="flex items-center gap-4 bg-white shadow-sm p-4 rounded-3xl border border-slate-100">
               <div className="h-10 w-10 flex items-center justify-center bg-indigo-50 rounded-xl text-indigo-600">
                  <TrendingUp className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Confidence Level</p>
                  <p className="text-lg font-bold text-slate-900">High Score</p>
               </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {/* Problem Card */}
             <Card className="border-none shadow-xl bg-white rounded-[40px] p-8 lg:col-span-2">
                <div className="flex items-center gap-3 mb-8">
                   <Target className="h-6 w-6 text-rose-500" />
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Urgent Directives</h3>
                </div>
                <div className="space-y-4">
                   {analysis.topProblems?.map((prob, i) => (
                      <div key={i} className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[32px] bg-slate-50/50 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md">
                         <div className="flex items-center gap-4">
                            <span className="h-10 w-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-slate-900 text-lg">{i+1}</span>
                            <p className="text-lg font-bold text-slate-800">{prob}</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 shadow-sm ${getUrgencyColor(analysis.urgencyScores?.[prob] || 'low')}`}>
                               {analysis.urgencyScores?.[prob] || "Low"} Urgency
                            </span>
                         </div>
                      </div>
                   ))}
                </div>
             </Card>

             {/* Narrative Card */}
             <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[40px] overflow-hidden">
                <div className="p-8 space-y-6">
                   <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-indigo-400" />
                      <h3 className="text-xl font-bold tracking-tight">Executive Summary</h3>
                   </div>
                   <p className="text-lg leading-relaxed text-slate-300 italic font-medium">"{analysis.summary}"</p>
                   <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                         <Users2 className="h-6 w-6 text-slate-500" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Response Pool</p>
                         <p className="text-2xl font-bold">{analysis.totalResponses || 0} Citizens</p>
                      </div>
                   </div>
                </div>
             </Card>
          </div>

          {/* Actionable Tasks Header */}
          <div className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-[20px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                      <ClipboardList className="h-6 w-6 text-white" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight">Deployment Roadmap</h3>
                </div>
             </div>

             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
               {analysis.recommendedTasks?.map((task, i) => (
                  <Card key={i} className="group flex flex-col border-none shadow-sm hover:shadow-2xl transition-all duration-700 bg-white rounded-[40px] overflow-hidden p-8 border-b-[8px] border-b-transparent hover:border-b-indigo-500">
                    <div className="space-y-6 flex-grow">
                       <div className="space-y-2">
                          <h4 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">{task.title}</h4>
                          <div className="flex flex-wrap gap-2">
                             {task.requiredSkills.map(s => (
                                <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{s}</span>
                             ))}
                          </div>
                       </div>
                       
                       <p className="text-slate-500 leading-relaxed font-medium line-clamp-3">{task.description}</p>
                       
                       <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                          <MapPin className="h-4 w-4 text-indigo-300" />
                          {task.location}
                       </div>
                    </div>
                    
                    <div className="pt-8 flex gap-3">
                      <Button
                        variant={createdTaskIndices.includes(i) ? "secondary" : "default"}
                        disabled={createdTaskIndices.includes(i)}
                        className={`w-full h-14 rounded-2xl font-bold transition-all shadow-md group-hover:shadow-xl ${
                          createdTaskIndices.includes(i)
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                        onClick={() => createTask(task, i)}
                      >
                        {createdTaskIndices.includes(i) ? (
                          <>
                            <Check className="mr-2 h-5 w-5" /> In Operations
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-5 w-5" /> Launch Task
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
