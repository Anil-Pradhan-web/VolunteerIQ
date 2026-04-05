"use client";

import { Bell, ChevronDown, LogOut, Search, X, Building2, Users2, ClipboardList, CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Search suggestions per page context
const SEARCH_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Task Operations", href: "/tasks", icon: "📋" },
  { label: "Survey Intelligence", href: "/upload", icon: "📄" },
  { label: "Volunteer Network", href: "/volunteers", icon: "👥" },
  { label: "My Profile", href: "/volunteer/profile", icon: "👤" },
];

export function Header() {
  const { profile, user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Project dropdown state
  const [projectOpen, setProjectOpen] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);

  // Bell notifications state
  const [bellOpen, setBellOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // Prefer real Google user data over backend dev-mode profile
  const displayName = user?.displayName || profile?.name || "User";
  const displayRole = profile?.role === "ngo_admin" ? "NGO Administrator" : "Volunteer Personnel";
  const photoURL =
    user?.photoURL ||
    `https://api.dicebear.com/7.x/notionists/svg?seed=${displayName}&backgroundColor=e2e8f0`;

  const routeMeta: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": { title: "Dashboard", subtitle: "Track live operations, tasks, and community priorities." },
    "/tasks": { title: "Task Operations", subtitle: "Create and monitor assignments with clear accountability." },
    "/upload": { title: "Survey Intelligence", subtitle: "Upload survey files and analyze urgent needs with AI." },
    "/volunteers": { title: "Volunteer Network", subtitle: "Find the right people by skills, location, and availability." },
    "/volunteer/profile": { title: "My Profile", subtitle: "Keep your profile accurate for better task matching." },
  };

  const activeMeta =
    routeMeta[pathname] ||
    (pathname.startsWith("/tasks/")
      ? { title: "Task Details", subtitle: "Review assignment context and status." }
      : { title: "VolunteerIQ", subtitle: "Secure coordination workspace." });

  // Filtered search results
  const filteredLinks = searchQuery.trim()
    ? SEARCH_LINKS.filter((l) =>
        l.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_LINKS;

  // Fetch stats for notification panel
  useEffect(() => {
    if (!bellOpen || stats) return;
    const fetchStats = async () => {
      try {
        let headers: Record<string, string> = {};
        if (user) {
          const token = await user.getIdToken();
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/api/dashboard/default-ngo`, { headers });
        if (res.ok) setStats(await res.json());
      } catch (e) {}
    };
    fetchStats();
  }, [bellOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) setProjectOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchSelect = (href: string) => {
    setSearchQuery("");
    setSearchFocused(false);
    router.push(href);
  };

  const notifications = stats
    ? [
        stats.open_tasks > 0 && {
          icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
          bg: "bg-rose-50",
          text: `${stats.open_tasks} open task${stats.open_tasks > 1 ? "s" : ""} need attention`,
          sub: "Volunteer assignment pending",
          href: "/tasks",
        },
        stats.total_volunteers > 0 && {
          icon: <Users2 className="h-4 w-4 text-indigo-500" />,
          bg: "bg-indigo-50",
          text: `${stats.total_volunteers} volunteer${stats.total_volunteers > 1 ? "s" : ""} registered`,
          sub: "Active in the network",
          href: "/volunteers",
        },
        stats.completed_tasks > 0 && {
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
          bg: "bg-emerald-50",
          text: `${stats.completed_tasks} task${stats.completed_tasks > 1 ? "s" : ""} completed`,
          sub: "Great community impact!",
          href: "/tasks",
        },
      ].filter(Boolean)
    : [];

  const unreadCount = notifications.length;

  return (
    <header className="flex flex-col gap-4 pb-2 pt-1 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">{activeMeta.title}</h1>
        <p className="text-sm text-slate-500">{activeMeta.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex items-center gap-3">

          {/* ── SEARCH ── */}
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              className="h-10 w-full rounded-xl border-slate-200 bg-white pl-10 pr-8 text-sm shadow-sm placeholder:text-slate-400 sm:w-64 focus-visible:ring-indigo-500"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Search Dropdown */}
            {searchFocused && (
              <div className="absolute top-12 left-0 z-50 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/60">
                <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {searchQuery ? "Results" : "Quick Navigation"}
                </p>
                {filteredLinks.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-slate-400">No pages found.</p>
                ) : (
                  filteredLinks.map((link) => (
                    <button
                      key={link.href}
                      onMouseDown={() => handleSearchSelect(link.href)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-indigo-50 hover:text-indigo-700 ${
                        pathname === link.href ? "bg-indigo-50 text-indigo-700" : "text-slate-700"
                      }`}
                    >
                      <span className="text-base">{link.icon}</span>
                      {link.label}
                      {pathname === link.href && (
                        <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-indigo-400">Current</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ── PROJECT DROPDOWN ── */}
          <div className="relative" ref={projectRef}>
            <button
              onClick={() => setProjectOpen((p) => !p)}
              className={`flex h-10 items-center justify-between gap-3 rounded-xl border px-3 text-sm font-medium shadow-sm transition-colors ${
                projectOpen
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Project
              <ChevronDown className={`h-4 w-4 transition-transform ${projectOpen ? "rotate-180 text-indigo-400" : "text-slate-400"}`} />
            </button>

            {projectOpen && (
              <div className="absolute top-12 right-0 z-50 w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60">
                <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Default NGO</p>
                    <p className="text-xs text-slate-500">default-ngo · Active Workspace</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {[
                    { icon: <ClipboardList className="h-4 w-4" />, label: "Task Board", href: "/tasks" },
                    { icon: <Users2 className="h-4 w-4" />, label: "Volunteer Network", href: "/volunteers" },
                    { icon: <MapPin className="h-4 w-4" />, label: "Live Operations", href: "/dashboard" },
                  ].map((item) => (
                    <button
                      key={item.href}
                      onClick={() => { setProjectOpen(false); router.push(item.href); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span className="text-slate-400">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                    Solution Challenge 2026 · Team ClutchCode
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3">

          {/* ── BELL NOTIFICATIONS ── */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setBellOpen((b) => !b)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
                bellOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-black/5"
              }`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {bellOpen && (
              <div className="absolute top-12 right-0 z-50 w-80 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                  <p className="text-sm font-bold text-slate-900">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                      {unreadCount} Active
                    </span>
                  )}
                </div>

                <div className="p-2 max-h-80 overflow-y-auto">
                  {!stats ? (
                    <div className="py-8 text-center">
                      <div className="h-5 w-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">All clear!</p>
                      <p className="text-xs text-slate-400">No pending actions.</p>
                    </div>
                  ) : (
                    notifications.map((n: any, i) => (
                      <button
                        key={i}
                        onClick={() => { setBellOpen(false); router.push(n.href); }}
                        className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50"
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${n.bg}`}>
                          {n.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">{n.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.sub}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-50 px-4 py-2.5">
                  <button
                    onClick={() => { setBellOpen(false); router.push("/dashboard"); }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View full dashboard →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── USER PROFILE ── */}
          <div className="flex items-center gap-3 rounded-full hover:bg-black/5 p-1 pr-2 transition">
            <img
              src={photoURL}
              alt={displayName}
              className="h-9 w-9 rounded-full bg-slate-200 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="hidden text-left sm:block">
              <p className="text-[13.5px] font-semibold leading-none text-slate-900">{displayName}</p>
              <p className="text-[12px] mt-1.5 text-slate-500 leading-none">{displayRole}</p>
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
