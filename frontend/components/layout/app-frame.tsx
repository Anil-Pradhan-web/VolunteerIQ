"use client";

import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";

const NO_SHELL_ROUTES = ["/", "/login"];

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showShell = !NO_SHELL_ROUTES.includes(pathname);

  if (!showShell) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
