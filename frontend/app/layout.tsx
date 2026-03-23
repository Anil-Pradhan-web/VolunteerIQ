import type { Metadata } from "next";

import { AuthProvider } from "@/lib/auth-context";
import { AppFrame } from "@/components/layout/app-frame";

import "./globals.css";

export const metadata: Metadata = {
  title: "VolunteerIQ — AI-Powered Volunteer Coordination",
  description: "Smart resource allocation for NGOs. AI-driven volunteer matching and community impact analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppFrame>{children}</AppFrame>
        </AuthProvider>
      </body>
    </html>
  );
}
