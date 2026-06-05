"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Who benefits if long-context inference scales?",
  "What would actually ease the HBM bottleneck?",
  "Why is power the binding constraint, not chips?",
];

export function AnalystChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
      } else {
        setMessages([...next, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("Couldn't reach the analyst. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <section className="rounded-xl border border-border bg-card/50 p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-muted-foreground" />
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Ask the analyst
        </h2>
        <span className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          grounded · directional
        </span>
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "mt-4 flex flex-col gap-3 overflow-y-auto",
          empty ? "" : "max-h-80",
        )}
      >
        {empty && (
          <p className="text-sm text-muted-foreground">
            Ask about the chokepoints, beneficiaries, or how a workload trend
            propagates. Answers are grounded in the card data and stay
            directional — no price targets.
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              m.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "border border-border bg-secondary/40 text-foreground/90",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                analyzing
                <span className="inline-flex gap-0.5">
                  <Dot delay="0ms" />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {empty && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:bg-secondary"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-tight/30 bg-tight/10 px-3 py-2 text-xs text-tight">
          {error}
        </p>
      )}

      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a chokepoint or scenario…"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/30"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground text-background transition-opacity disabled:opacity-40"
          aria-label="Send"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>
    </section>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-1 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: delay }}
    />
  );
}
