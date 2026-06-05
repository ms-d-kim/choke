"use client";

import { bottlenecks, type WorkloadTrend } from "@/data";
import { cn } from "@/lib/utils";
import { DIRECTION_SCORE, impactFor } from "@/lib/scenario";
import { deltaMeta } from "@/lib/visuals";

export function ScenarioBar({
  trends,
  selectedTrendId,
  onSelect,
}: {
  trends: WorkloadTrend[];
  selectedTrendId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const trend = trends.find((t) => t.id === selectedTrendId) ?? null;

  // Order the heat row so the most-stressed chokepoint surfaces first.
  const ranked = trend
    ? [...bottlenecks].sort((a, b) => {
        const sa = DIRECTION_SCORE[impactFor(trend, a.id)?.tightnessPush ?? "neutral"];
        const sb = DIRECTION_SCORE[impactFor(trend, b.id)?.tightnessPush ?? "neutral"];
        return sb - sa;
      })
    : bottlenecks;

  return (
    <section className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Scenario explorer
            </h2>
            <span className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              pick a workload trend
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Each trend re-shades every chokepoint by how much it tightens.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <TrendButton
            id="baseline"
            active={selectedTrendId === null}
            onClick={() => onSelect(null)}
          >
            Baseline
          </TrendButton>
          {trends.map((t) => (
            <TrendButton
              key={t.id}
              id={t.id}
              active={selectedTrendId === t.id}
              onClick={() => onSelect(t.id)}
            >
              {t.shortName}
            </TrendButton>
          ))}
        </div>
      </div>

      {trend && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-sm leading-relaxed text-foreground/80">
            <span className="font-medium text-foreground">{trend.name}.</span>{" "}
            {trend.description}
          </p>
          {trend.note && (
            <p className="mt-1 text-xs text-muted-foreground">{trend.note}</p>
          )}

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {ranked.map((b) => {
              const impact = impactFor(trend, b.id);
              const delta = deltaMeta(impact?.tightnessPush ?? "neutral");
              return (
                <div
                  key={b.id}
                  className={cn(
                    "rounded-md border px-3 py-2.5",
                    delta.chip,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {b.shortName}
                    </span>
                    <span className="font-mono text-base leading-none">
                      {delta.arrows}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs font-medium">{delta.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function TrendButton({
  id,
  active,
  onClick,
  children,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-trend={id}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-foreground/30 bg-foreground text-background"
          : "border-border bg-secondary/40 text-foreground/80 hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
