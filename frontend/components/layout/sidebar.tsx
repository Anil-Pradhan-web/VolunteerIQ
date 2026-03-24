"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ClipboardList, 
  LayoutDashboard, 
  Upload,
  Users2,
  UserCircle
} from "lucide-react";

import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/volunteers", label: "Volunteers", icon: Users2 },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/upload", label: "Upload Survey", icon: Upload },
  { href: "/volunteer/profile", label: "My Profile", icon: UserCircle },
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
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-[22px] w-[22px]", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-4 pb-2 text-xs text-slate-400">
          Trusted coordination workspace for NGO operations.
        </p>
      </div>
    </aside>
  );
}
