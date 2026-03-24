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
  Brain,
  TrendingUp,
  Target,
  Clock,
  ClipboardList,
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
        alert("Failed to create task");
      }
    } catch (err) {
      console.error("Task creation error:", err);
      alert("Error creating task");
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
    <div className="space-y-6">
      <PageHeader
        title="Upload Community Survey"
        description="Turn raw survey files into reliable, prioritized action signals."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Zone */}
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/30">
          <CardContent className="p-8">
            <div
              className={`flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${dragActive
                ? "border-indigo-400 bg-indigo-50"
                : file
                  ? "border-emerald-300 bg-emerald-50/30"
                  : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />

              {file ? (
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                    {file.name.endsWith(".pdf") ? (
                      <FileText className="h-8 w-8 text-emerald-600" />
                    ) : (
                      <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        setAnalysis(null);
                        setStatus("idle");
                      }}
                    >
                      <X className="mr-1 h-3 w-3" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                    <Upload className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-700">
                      Drag & drop your survey file
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      CSV, PDF, DOCX, or TXT files up to 10MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                  >
                    Browse files
                  </Button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {file && status !== "done" && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Choose AI Model</label>
                  <Select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value as "gemini" | "groq")}
                  >
                    <option value="gemini">Google Gemini 2.5 Flash</option>
                    <option value="groq">Groq LLaMA 3 70B (Fast)</option>
                  </Select>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={status === "uploading" || status === "analyzing"}
                  className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  size="lg"
                >
                  {status === "uploading" || status === "analyzing" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {status === "uploading"
                        ? "Uploading..."
                        : `${aiProvider === "gemini" ? "Gemini" : "Groq"} AI is analyzing...`}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Upload & Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supported Formats + Instructions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formatCards.map((format) => (
                <div
                  key={format.title}
                  className={`flex items-start gap-3 rounded-xl p-3 ${format.classes}`}
                >
                  <format.icon className={`mt-0.5 h-5 w-5 ${format.iconClass}`} />
                  <div>
                    <p className="font-medium text-slate-900">{format.title}</p>
                    <p className="text-sm text-slate-500">{format.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-amber-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <Brain className="h-5 w-5" />
                Powered by {aiProvider === "gemini" ? "Google Gemini" : "Groq LLaMA"}
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Our AI reads your survey data, identifies the top 3 urgent
                community problems, scores their urgency, and recommends
                targeted interventions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Results */}
      {status === "done" && analysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Analysis Complete
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Top Problems */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-rose-500" />
                  Top Community Problems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.topProblems?.map((problem, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-800">
                        {problem}
                      </p>
                    </div>
                    {analysis.urgencyScores?.[problem] && (
                      <Badge
                        className={`${getUrgencyColor(
                          analysis.urgencyScores[problem]
                        )} border text-xs`}
                      >
                        {analysis.urgencyScores[problem]}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {analysis.summary}
                </p>
                {analysis.totalResponses && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-50 p-3">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-indigo-700">
                      ~{analysis.totalResponses} responses analyzed
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.recommendedActions?.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-slate-700">{action}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recommended Tasks to officially create */}
          {analysis.recommendedTasks && analysis.recommendedTasks.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
                Actionable Tasks
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {analysis.recommendedTasks.map((task, i) => (
                  <Card key={i} className="flex flex-col border-indigo-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold text-indigo-900">{task.title}</CardTitle>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {task.requiredSkills.map(s => (
                          <Badge key={s} variant="secondary" className="text-[10px] py-0 bg-indigo-50 text-indigo-600 border-indigo-100">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                      <p className="text-sm text-slate-600 line-clamp-3">{task.description}</p>
                      <div className="mt-3 flex items-center text-xs text-slate-400">
                        <Target className="h-3 w-3 mr-1" />
                        {task.location}
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0">
                      <Button
                        size="sm"
                        variant={createdTaskIndices.includes(i) ? "secondary" : "default"}
                        disabled={createdTaskIndices.includes(i)}
                        className="w-full rounded-xl"
                        onClick={() => createTask(task, i)}
                      >
                        {createdTaskIndices.includes(i) ? (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Created
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" /> Create Task
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analyzing state */}
      {status === "analyzing" && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
              <Brain className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
            </div>
            <p className="mt-4 text-lg font-semibold text-indigo-800">
              {aiProvider === "gemini" ? "Gemini 2.5" : "Groq LLaMA 3"} is analyzing your survey...
            </p>
            <p className="mt-1 text-sm text-indigo-600">
              Identifying urgent problems and recommending actions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
