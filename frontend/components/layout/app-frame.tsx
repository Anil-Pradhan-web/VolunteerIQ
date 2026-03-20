"use client";

import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showShell = pathname !== "/";

  if (!showShell) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
