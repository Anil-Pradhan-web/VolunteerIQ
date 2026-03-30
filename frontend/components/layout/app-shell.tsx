import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { GeminiChat } from "@/components/chat/gemini-chat";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#f8fafc] p-4 font-sans text-slate-900 lg:p-6 flex justify-center">
      <div className="w-full max-w-[1600px] grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="flex flex-col space-y-6 overflow-hidden">
          <Header />
          <section className="flex-1 pb-10">{children}</section>
        </main>
      </div>
      {/* Floating AI Chat Widget — available on all dashboard pages */}
      <GeminiChat />
    </div>
  );
}
