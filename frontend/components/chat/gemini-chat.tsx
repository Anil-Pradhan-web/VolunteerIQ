"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Zap,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { buildApiUrl } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Provider = "gemini" | "groq";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  provider?: Provider;
}

/* ------------------------------------------------------------------ */
/*  Quick-chip suggestions                                             */
/* ------------------------------------------------------------------ */

const QUICK_CHIPS = [
  "What are the top problems in our community?",
  "Which volunteers are available this weekend?",
  "How many tasks are pending?",
  "Summarize our latest survey findings",
  "Who has medical skills?",
];

/* ------------------------------------------------------------------ */
/*  Provider Configs                                                   */
/* ------------------------------------------------------------------ */

const PROVIDERS: Record<Provider, { label: string; sub: string; colors: string; icon: React.ReactNode }> = {
  gemini: {
    label: "Gemini",
    sub: "Google AI",
    colors: "from-blue-500 to-indigo-600",
    icon: <Sparkles className="h-3 w-3" />,
  },
  groq: {
    label: "Groq",
    sub: "Llama 3 • Fast",
    colors: "from-emerald-500 to-teal-600",
    icon: <Zap className="h-3 w-3" />,
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function GeminiChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>("gemini");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (user) {
          const token = await user.getIdToken();
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(buildApiUrl("/api/chat"), {
          method: "POST",
          headers,
          body: JSON.stringify({
            question: text.trim(),
            ngo_id: "default-ngo",
            provider,
          }),
        });

        let answer = "Sorry, I couldn't get a response. Please try again.";
        if (res.ok) {
          const data = await res.json();
          answer = data.answer || answer;
        }

        const aiMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: answer,
          timestamp: new Date(),
          provider,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error("Chat error:", err);
        const errMsg: ChatMessage = {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
          timestamp: new Date(),
          provider,
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
      }
    },
    [user, loading, provider]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const currentProvider = PROVIDERS[provider];

  return (
    <>
      {/* ═══════════ Floating Action Button ═══════════ */}
      <button
        id="gemini-chat-fab"
        onClick={() => setOpen((v) => !v)}
        className={`
          fixed bottom-6 right-6 z-[999]
          flex h-14 w-14 items-center justify-center rounded-full
          shadow-lg transition-all duration-300
          ${
            open
              ? "bg-slate-800 rotate-90 scale-90"
              : "bg-gradient-to-br from-primary to-orange-500 hover:scale-110 hover:shadow-xl"
          }
        `}
        aria-label={open ? "Close chat" : "Open AI chat"}
      >
        {open ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6 text-white" />
            <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-amber-200 animate-pulse" />
          </div>
        )}
      </button>

      {/* ═══════════ Chat Panel ═══════════ */}
      <div
        className={`
          fixed bottom-24 right-6 z-[998]
          flex flex-col
          w-[400px] max-h-[580px]
          rounded-2xl border border-slate-200/80
          bg-white/95 backdrop-blur-xl
          shadow-[0_24px_80px_rgba(0,0,0,0.18)]
          transition-all duration-300 origin-bottom-right
          ${open ? "scale-100 opacity-100 pointer-events-auto" : "scale-75 opacity-0 pointer-events-none"}
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${currentProvider.colors}`}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              VolunteerIQ AI
            </h3>
            <p className="text-[11px] text-slate-400">
              {currentProvider.label} • Ask anything about your data
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* ── Model Toggle ── */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50/50">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Model:</span>
          {(Object.keys(PROVIDERS) as Provider[]).map((key) => {
            const p = PROVIDERS[key];
            const active = provider === key;
            return (
              <button
                key={key}
                onClick={() => setProvider(key)}
                disabled={loading}
                className={`
                  flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
                  text-[11px] font-semibold
                  transition-all duration-200
                  disabled:opacity-50
                  ${
                    active
                      ? `bg-gradient-to-r ${p.colors} text-white shadow-sm`
                      : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700"
                  }
                `}
              >
                {p.icon}
                <span>{p.label}</span>
                {active && (
                  <span className="text-[9px] opacity-75 font-normal ml-0.5">
                    {p.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Messages Area ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar"
          style={{ minHeight: "240px", maxHeight: "340px" }}
        >
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-6">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${currentProvider.colors} bg-opacity-10 ring-1 ring-slate-100`}>
                <Bot className="h-7 w-7 text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  Hey! I&apos;m your AI assistant 👋
                </p>
                <p className="mt-1 text-xs text-slate-400 max-w-[260px]">
                  Ask me about volunteers, tasks, surveys, or community
                  insights. Switch between <strong>Gemini</strong> and{" "}
                  <strong>Groq</strong> above!
                </p>
              </div>

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5 justify-center px-2 mt-1">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="
                      rounded-full border border-slate-200 bg-slate-50
                      px-3 py-1.5 text-[11px] font-medium text-slate-600
                      transition-all duration-200
                      hover:border-primary/30 hover:bg-primary/5 hover:text-primary
                      active:scale-95
                    "
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${PROVIDERS[msg.provider || "gemini"].colors} mt-0.5`}>
                  {PROVIDERS[msg.provider || "gemini"].icon}
                  <span className="sr-only">{PROVIDERS[msg.provider || "gemini"].label}</span>
                </div>
              )}
              <div
                className={`
                  rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed max-w-[75%]
                  ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-br-md"
                      : "bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-md"
                  }
                `}
              >
                {msg.content}
                {msg.role === "assistant" && msg.provider && (
                  <span className="block mt-1 text-[10px] text-slate-400 font-medium">
                    via {PROVIDERS[msg.provider].label}
                  </span>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 mt-0.5">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2.5 items-start">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${currentProvider.colors}`}>
                {provider === "groq" ? (
                  <Zap className="h-3.5 w-3.5 text-white animate-pulse" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
                )}
              </div>
              <div className="rounded-2xl rounded-bl-md bg-slate-50 border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">
                    {currentProvider.label} is thinking…
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Input Bar ── */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-slate-100 px-3 py-3"
        >
          <input
            ref={inputRef}
            id="gemini-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${currentProvider.label} about your data…`}
            disabled={loading}
            className="
              flex-1 rounded-xl border border-slate-200 bg-slate-50/80
              px-3.5 py-2.5 text-sm text-slate-700
              placeholder:text-slate-400
              outline-none ring-0
              transition-all duration-200
              focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10
              disabled:opacity-50
            "
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`
              flex h-10 w-10 items-center justify-center rounded-xl
              bg-gradient-to-br ${currentProvider.colors}
              text-white shadow-md
              transition-all duration-200
              hover:shadow-lg hover:scale-105
              active:scale-95
              disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100
            `}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
