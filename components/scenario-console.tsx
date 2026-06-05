"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { bottlenecks, eventPresets, trends, type Scenario } from "@/data";
import { DIRECTION_SCORE, pushFor } from "@/lib/scenario";
import { deltaMeta } from "@/lib/visuals";
import { cn } from "@/lib/utils";
import { Chip, Panel, PanelHeader } from "@/components/terminal";

export function ScenarioConsole({
  scenario,
  loading,
  error,
  onTrend,
  onSimulate,
  onClear,
}: {
  scenario: Scenario | null;
  loading: boolean;
  error: string | null;
  onTrend: (trendId: string) => void;
  onSimulate: (prompt: string, label?: string) => void;
  onClear: () => void;
}) {
  const [input, setInput] = useState("");

  const ranked = scenario
    ? [...bottlenecks].sort(
        (a, b) =>
          DIRECTION_SCORE[pushFor(scenario, b.id)?.push ?? "neutral"] -
          DIRECTION_SCORE[pushFor(scenario, a.id)?.push ?? "neutral"],
      )
    : bottlenecks;

  return (
    <Panel>
      <PanelHeader
        title="② Scenario Console"
        sub="now stress-test it — the map updates live"
        right={
          scenario ? (
            <button
              onClick={onClear}
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-amber"
            >
              <X className="size-3" /> clear
            </button>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              baseline
            </span>
          )
        }
      />

      <div className="space-y-3 p-3 sm:p-4">
        {/* command line */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !loading) onSimulate(input.trim());
          }}
        >
          <div className="flex items-center gap-2 border border-input bg-background px-2 py-1.5 focus-within:border-amber/60">
            <span className="font-mono text-xs font-semibold text-amber">RUN ▸</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="what if… e.g. ARM ships a proprietary server CPU"
              className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xs border border-amber bg-amber px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-primary-foreground disabled:opacity-40"
            >
              Run
            </button>
          </div>
        </form>

        {/* presets */}
        <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-3">
          <span className="term-label pt-1">Patterns</span>
          <div className="flex flex-wrap gap-1.5">
            {trends.map((t) => (
              <Chip
                key={t.id}
                active={scenario?.id === t.id}
                onClick={() => onTrend(t.id)}
              >
                {t.shortName}
              </Chip>
            ))}
          </div>
          <span className="term-label pt-1">Events</span>
          <div className="flex flex-wrap gap-1.5">
            {eventPresets.map((e) => (
              <Chip
                key={e.id}
                active={scenario?.description === e.prompt}
                onClick={() => onSimulate(e.prompt, e.label)}
                title={e.prompt}
              >
                {e.label}
              </Chip>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 border border-amber/30 bg-amber/5 px-3 py-2 font-mono text-xs text-amber">
            <Loader2 className="size-3.5 animate-spin" />
            Simulating propagation across the value chain…
          </div>
        )}
        {error && (
          <div className="border border-tight/30 bg-tight/10 px-3 py-2 font-mono text-xs text-tight">
            {error}
          </div>
        )}

        {/* heat row */}
        {scenario && !loading && (
          <div className="grid gap-2 sm:grid-cols-3">
            {ranked.map((b) => {
              const impact = pushFor(scenario, b.id);
              const delta = deltaMeta(impact?.push ?? "neutral");
              return (
                <div
                  key={b.id}
                  className={cn("border px-3 py-2", delta.chip)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {b.shortName}
                    </span>
                    <span className="font-mono text-base leading-none">
                      {delta.arrows}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] font-medium uppercase tracking-wide">
                    {delta.label}
                  </div>
                  {impact?.why && (
                    <p className="mt-1 text-[11px] leading-snug text-foreground/70">
                      {impact.why}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Panel>
  );
}
