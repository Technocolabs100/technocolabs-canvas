import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type ChatMessage = { id: string; role: "user" | "bot"; text: string };

const SUGGESTED = [
  "What services do you offer?",
  "How fast can you start a project?",
  "Share your contact email",
];

// change this to move the launcher up/down
const LAUNCHER_BOTTOM_REM = 14; // 7rem ≈ tailwind bottom-28

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: id(), role: "bot", text: "Hi! I’m your assistant from Technocolabs 👋\nHow can I help today?" },
  ]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const botReply = useMemo(
    () => (qRaw: string) => {
      const q = qRaw.toLowerCase();
      if (q.includes("service") || q.includes("offer"))
        return "We build AI/ML, Data Science, Web & Mobile apps, BI dashboards, plus consulting & training. Want a quick link to our services?";
      if (q.includes("time") || q.includes("start"))
        return "We can usually kick off within 1–2 weeks after scope alignment. For urgent timelines, we can often start sooner.";
      if (q.includes("price") || q.includes("cost") || q.includes("budget"))
        return "Pricing depends on scope. We do fixed-bid for well-defined projects and retainers for long-term work. Share a bit about your project?";
      if (q.includes("email") || q.includes("contact"))
        return "You can reach us at contact@technocolabs.com — or leave your details here and we’ll reply in 1–2 business days.";
      if (q.includes("intern") || q.includes("career"))
        return "We run mentored internships and full-time roles. Check the Careers page or tell me your skillset to suggest a track.";
      if (q.includes("hello") || q.includes("hi")) return "Hello! How can I help you today?";
      return "Got it. Could you share a tiny bit more detail so I can point you to the best next step?";
    },
    []
  );

  async function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value) return;
    setInput("");
    push({ role: "user", text: value });
    setTyping(true);
    await new Promise((r) => setTimeout(r, 500));
    push({ role: "bot", text: botReply(value) });
    setTyping(false);
  }

  function push(m: Omit<ChatMessage, "id">) {
    setMessages((prev) => [...prev, { id: id(), ...m }]);
  }

  function id() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  return (
    <>
      {/* Floating launcher (uses inline bottom style so it's always positioned) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 z-[1000] inline-flex items-center gap-2 rounded-full bg-[#1e90ff] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40"
        style={{ bottom: `${LAUNCHER_BOTTOM_REM}rem` }}
        aria-label="Open chat"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:block">Chat</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center sm:justify-end">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} aria-hidden />

          {/* card */}
          <div className="relative m-3 sm:m-6 w-[min(100%,420px)] rounded-2xl border border-white/10 bg-[#0a2540] text-white shadow-2xl">
            {/* header */}
            <div className="flex items-center justify-between gap-4 rounded-t-2xl border-b border-white/10 bg-[#0e2a4c] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1e90ff]/20 grid place-items-center">
                  <MessageCircle className="h-4 w-4 text-[#1e90ff]" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Technocolabs Assistant</div>
                  <div className="text-xs text-white/70">Typically replies instantly</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="max-h-[55vh] overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow " +
                      (m.role === "user" ? "bg-[#1e90ff] text-white" : "bg-white/10 text-white")
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/10 px-3 py-2 text-sm text-white">
                    <span className="inline-flex items-center gap-1 opacity-80">
                      <Dot /> <Dot /> <Dot />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* quick suggestions */}
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* input */}
            <form
              className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-[#1e90ff]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-[#1e90ff] px-3 py-2 text-sm font-semibold shadow hover:shadow-lg disabled:opacity-60"
                disabled={!input.trim()}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Dot() {
  return (
    <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-white/80">
      <span className="absolute inset-0 animate-ping rounded-full bg-white/70"></span>
    </span>
  );
}
