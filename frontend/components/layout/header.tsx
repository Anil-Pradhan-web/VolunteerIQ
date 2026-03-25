"use client";

import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { profile, user, signOut } = useAuth();
  const pathname = usePathname();

  // Prefer real Google user data over backend dev-mode profile
  const displayName = user?.displayName || profile?.name || "User";
  const displayRole = profile?.role === "ngo_admin" ? "NGO Administrator" : "Volunteer Personnel";
  const photoURL =
    user?.photoURL ||
    `https://api.dicebear.com/7.x/notionists/svg?seed=${displayName}&backgroundColor=e2e8f0`;

  const routeMeta: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Track live operations, tasks, and community priorities."
    },
    "/tasks": {
      title: "Task Operations",
      subtitle: "Create and monitor assignments with clear accountability."
    },
    "/upload": {
      title: "Survey Intelligence",
      subtitle: "Upload survey files and analyze urgent needs with AI."
    },
    "/volunteers": {
      title: "Volunteer Network",
      subtitle: "Find the right people by skills, location, and availability."
    },
    "/volunteer/profile": {
      title: "My Profile",
      subtitle: "Keep your profile accurate for better task matching."
    }
  };

  const activeMeta =
    routeMeta[pathname] ||
    (pathname.startsWith("/tasks/")
      ? { title: "Task Details", subtitle: "Review assignment context and status." }
      : { title: "VolunteerIQ", subtitle: "Secure coordination workspace." });

  return (
    <header className="flex flex-col gap-4 pb-2 pt-1 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
          {activeMeta.title}
        </h1>
        <p className="text-sm text-slate-500">{activeMeta.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-10 w-full rounded-xl border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm placeholder:text-slate-400 sm:w-64 focus-visible:ring-indigo-500"
              placeholder="Search..."
            />
          </div>
          <button className="flex h-10 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50">
            Project <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-black/5 transition">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-50"></span>
          </button>

          <div className="flex items-center gap-3 rounded-full hover:bg-black/5 p-1 pr-2 transition">
            <img
              src={photoURL}
              alt={displayName}
              className="h-9 w-9 rounded-full bg-slate-200 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="hidden text-left sm:block">
              <p className="text-[13.5px] font-semibold leading-none text-slate-900">
                {displayName}
              </p>
              <p className="text-[12px] mt-1.5 text-slate-500 leading-none">
                {displayRole}
              </p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
