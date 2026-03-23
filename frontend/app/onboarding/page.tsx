"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, HandHeart, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const roles = [
  {
    id: "volunteer" as const,
    title: "Volunteer",
    desc: "I want to contribute my skills and time to help communities in need.",
    icon: HandHeart,
    color: "indigo",
    features: [
      "Get matched to tasks based on your skills",
      "Track your impact and contributions",
      "Connect with NGOs near you",
    ],
  },
  {
    id: "ngo_admin" as const,
    title: "NGO Admin",
    desc: "I manage an organization and need to coordinate volunteers for our missions.",
    icon: Building2,
    color: "emerald",
    features: [
      "Upload community surveys for AI analysis",
      "Create tasks and find best volunteers",
      "Dashboard with real-time operations overview",
    ],
  },
];

export default function OnboardingPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"volunteer" | "ngo_admin" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/volunteers/${profile?.uid}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile?.name || user.displayName || "User",
          email: profile?.email || user.email || "",
          role: selectedRole,
          skills: [],
          availability: [],
          location: "",
        }),
      });

      if (res.ok) {
        if (selectedRole === "ngo_admin") {
          router.push("/dashboard");
        } else {
          router.push("/volunteer/profile");
        }
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-emerald-50/20 px-4">
      {/* Background glow */}
      <div className="absolute left-[30%] top-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-indigo-400/10 blur-[120px]" />
      <div className="absolute right-[20%] bottom-[10%] -z-10 h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-1.5 text-sm font-medium text-indigo-600 shadow-sm">
            <Sparkles className="h-4 w-4" /> Welcome to VolunteerIQ
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How will you use the platform?
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Choose your role to get a personalized experience. You can change this later in settings.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`group relative flex flex-col rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                  isSelected
                    ? role.color === "indigo"
                      ? "border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100/50"
                      : "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100/50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className={`absolute right-4 top-4 ${
                    role.color === "indigo" ? "text-indigo-600" : "text-emerald-600"
                  }`}>
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                )}

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    isSelected
                      ? role.color === "indigo"
                        ? "bg-indigo-100"
                        : "bg-emerald-100"
                      : "bg-slate-100 group-hover:bg-slate-200/70"
                  } transition-colors`}
                >
                  <Icon
                    className={`h-7 w-7 ${
                      isSelected
                        ? role.color === "indigo"
                          ? "text-indigo-600"
                          : "text-emerald-600"
                        : "text-slate-500"
                    }`}
                  />
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {role.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500">{role.desc}</p>

                <ul className="mt-5 space-y-2.5">
                  {role.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <div
                        className={`mt-0.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                          isSelected
                            ? role.color === "indigo"
                              ? "bg-indigo-400"
                              : "bg-emerald-400"
                            : "bg-slate-300"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
            size="lg"
            className={`h-14 rounded-full px-10 text-base font-medium shadow-lg transition-all ${
              selectedRole
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] shadow-indigo-200/50"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Setting up...
              </>
            ) : (
              <>
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
