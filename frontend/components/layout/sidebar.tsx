"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ClipboardList, 
  Folder, 
  HeartHandshake, 
  HelpCircle, 
  LayoutDashboard, 
  Settings, 
  Users2,
  FileText
} from "lucide-react";

import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/volunteers", label: "Volunteers", icon: Users2 },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/impact", label: "Impact Reports", icon: FileText },
  { href: "/donations", label: "Donations", icon: HeartHandshake }
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/support", label: "Support", icon: HelpCircle }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-6 flex h-[calc(100vh-48px)] w-full flex-col rounded-[24px] bg-white px-5 py-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 lg:w-[280px]">
      <div className="mb-10 flex items-center gap-3 px-3 cursor-pointer">
        <img src="/logo.png" alt="VolunteerIQ Logo" className="h-[42px] w-[42px] rounded-xl object-cover shadow-sm ring-1 ring-slate-900/5" />
        <p className="font-display text-2xl font-bold tracking-tight text-slate-900">VolunteerIQ</p>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <nav className="space-y-1.5">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-[22px] w-[22px]", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="space-y-1.5 pb-4">
          <div className="mb-4 h-px w-full bg-slate-100" />
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-[22px] w-[22px]", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
