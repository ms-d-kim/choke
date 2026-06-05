"use client";

import { ArrowDownRight, ArrowUpRight, Loader2, TriangleAlert } from "lucide-react";
import type { Scenario, ScenarioActor } from "@/data";
import { Panel, PanelHeader } from "@/components/terminal";

export function ScenarioReadout({
  scenario,
  loading,
}: {
  scenario: Scenario | null;
  loading: boolean;
}) {
  return (
    <Panel className="flex flex-col overflow-hidden lg:h-[480px]">
      <PanelHeader
        title="Scenario Readout"
        right={
          scenario && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {scenario.origin === "model" ? "simulated" : "preset"}
            </span>
          )
        }
      />
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
        {loading ? (
          <div className="flex items-center gap-2 font-mono text-xs text-amber">
            <Loader2 className="size-3.5 animate-spin" /> reasoning through the chain…
          </div>
        ) : !scenario ? (
          <p className="text-sm text-muted-foreground">
            Pick a workload, fire an event, or type any{" "}
            <span className="text-amber">what-if</span> in the console. The graph
            and the book re-shade to the propagation.
          </p>
        ) : (
          <>
            <div>
              <div className="term-label mb-1">{scenario.label}</div>
              {scenario.narrative && (
                <p className="text-sm leading-relaxed text-foreground/85">
                  {scenario.narrative}
                </p>
              )}
            </div>

            <ActorList
              label="Beneficiaries"
              tone="text-loose"
              icon={<ArrowUpRight className="size-3 text-loose" />}
              actors={scenario.beneficiaries}
            />
            <ActorList
              label="Pressured"
              tone="text-tight"
              icon={<ArrowDownRight className="size-3 text-tight" />}
              actors={scenario.pressured}
            />

            {scenario.risks && scenario.risks.length > 0 && (
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <TriangleAlert className="size-3 text-easing" />
                  <span className="term-label">What would change the call</span>
                </div>
                <ul className="space-y-1 text-xs leading-snug text-foreground/75">
                  {scenario.risks.map((r, i) => (
                    <li key={i}>— {r}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="border-t border-border pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Directional · no return estimates
            </p>
          </>
        )}
      </div>
    </Panel>
  );
}

function ActorList({
  label,
  tone,
  icon,
  actors,
}: {
  label: string;
  tone: string;
  icon: React.ReactNode;
  actors?: ScenarioActor[];
}) {
  if (!actors || actors.length === 0) return null;
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5">
        {icon}
        <span className={`font-mono text-[10px] font-semibold uppercase tracking-[0.15em] ${tone}`}>
          {label}
        </span>
      </div>
      <ul className="space-y-1.5">
        {actors.map((a, i) => (
          <li key={i} className="text-xs leading-snug">
            <span className="flex items-baseline gap-1.5">
              <span className="font-medium text-foreground/90">{a.name}</span>
              {a.ticker && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  {a.ticker}
                </span>
              )}
            </span>
            <span className="text-muted-foreground">{a.why}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
