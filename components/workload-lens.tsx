"use client";

import type { WorkloadProfile } from "@/data";
import { deltaMeta } from "@/lib/visuals";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader } from "@/components/terminal";

const SHORT: Record<string, string> = {
  hbm: "HBM",
  cowos: "CoWoS",
  "datacenter-power": "PWR",
};
const ORDER = ["hbm", "cowos", "datacenter-power"];

export function WorkloadLens({
  workloads,
  selectedId,
  onSelect,
}: {
  workloads: WorkloadProfile[];
  selectedId: string | null;
  onSelect: (w: WorkloadProfile) => void;
}) {
  return (
    <Panel>
      <PanelHeader
        title="① Workload Lens"
        sub="start here — what are you building / investing in?"
      />
      <div className="p-3 sm:p-4">
        <p className="mb-3 text-sm text-muted-foreground">
          Pick an AI workload to reveal its{" "}
          <span className="text-amber">chokepoint signature</span> — which
          physical bottlenecks it stresses, and who benefits.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {workloads.map((w) => {
            const active = selectedId === w.id;
            return (
              <button
                key={w.id}
                onClick={() => onSelect(w)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col gap-1.5 border p-3 text-left transition-colors",
                  active
                    ? "border-amber bg-amber/5"
                    : "border-border bg-secondary/20 hover:border-amber/40 hover:bg-secondary/40",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {w.name}
                  </span>
                  {active && (
                    <span className="font-mono text-[9px] uppercase tracking-wider text-amber">
                      ▶ active
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-snug text-muted-foreground">
                  {w.tagline}
                </span>
                <div className="mt-1 flex items-center gap-3 border-t border-border pt-1.5">
                  {ORDER.map((id) => {
                    const im = w.impacts.find((i) => i.bottleneckId === id);
                    const d = deltaMeta(im?.tightnessPush ?? "neutral");
                    return (
                      <span
                        key={id}
                        className={cn(
                          "flex items-center gap-1 font-mono text-[10px]",
                          d.text,
                        )}
                      >
                        <span className="text-muted-foreground">{SHORT[id]}</span>
                        {d.arrows}
                      </span>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
