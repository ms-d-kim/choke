"use client";

import { useState } from "react";
import {
  trends,
  workloads,
  type Direction,
  type Scenario,
  type WorkloadProfile,
} from "@/data";
import {
  bottleneckById,
  scenarioFromTrend,
  scenarioFromWorkload,
} from "@/lib/scenario";
import { SiteHeader } from "@/components/site-header";
import { WorkloadLens } from "@/components/workload-lens";
import { ScenarioConsole } from "@/components/scenario-console";
import { ValueChainGraph } from "@/components/value-chain-graph";
import { ScenarioReadout } from "@/components/scenario-readout";
import { ChokepointDetailDialog } from "@/components/chokepoint-detail";
import { AnalystChat } from "@/components/analyst-chat";
import { Panel, PanelHeader } from "@/components/terminal";

export function ChokeApp() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Progressive disclosure: nothing below the lens shows until a workload is picked.
  const [started, setStarted] = useState(false);
  // Which chokepoint's evidence dialog is open (opened by clicking a graph node).
  const [detailId, setDetailId] = useState<string | null>(null);

  function runWorkload(w: WorkloadProfile) {
    setError(null);
    setStarted(true);
    setScenario(scenarioFromWorkload(w));
    if (!started) {
      // first reveal — bring the map into view
      setTimeout(() => {
        document
          .getElementById("map")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }

  function runTrend(trendId: string) {
    const t = trends.find((x) => x.id === trendId);
    if (!t) return;
    setError(null);
    setStarted(true);
    setScenario(scenarioFromTrend(t));
  }

  async function runSimulate(prompt: string, label?: string) {
    setStarted(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, label }),
      });
      const data = await res.json();
      if (!res.ok) setError(data?.error ?? "Simulation failed.");
      else setScenario(data.scenario);
    } catch {
      setError("Couldn't reach the simulator.");
    } finally {
      setLoading(false);
    }
  }

  function clearScenario() {
    setScenario(null);
    setError(null);
  }

  const impacts: Record<string, Direction> | undefined = scenario
    ? Object.fromEntries(scenario.impacts.map((i) => [i.bottleneckId, i.push]))
    : undefined;

  function onGraphSelect(chokepointId: string) {
    setDetailId(chokepointId);
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-3 px-3 pt-3 pb-16 sm:px-4">
        <div id="lens" className="scroll-mt-14">
          <WorkloadLens
            workloads={workloads}
            selectedId={scenario?.id ?? null}
            onSelect={runWorkload}
          />
        </div>

        {started && (
          <div className="animate-in fade-in space-y-3 duration-500">
            {/* 2 — the map appears, sized + shaded to the workload */}
            <div id="map" className="grid scroll-mt-14 gap-3 lg:grid-cols-[1.7fr_1fr]">
              <Panel className="flex h-[480px] flex-col overflow-hidden">
                <PanelHeader
                  title="Value-Chain Map"
                  sub="bubble size = impact · drag · click a node for evidence"
                />
                <div className="relative min-h-0 flex-1">
                  <ValueChainGraph
                    impacts={impacts}
                    loading={loading}
                    onSelect={onGraphSelect}
                  />
                </div>
              </Panel>
              <ScenarioReadout scenario={scenario} loading={loading} />
            </div>

            {/* 3 — stress-test it: patterns, events, free-text → map updates live */}
            <div id="sim" className="scroll-mt-14">
              <ScenarioConsole
                scenario={scenario}
                loading={loading}
                error={error}
                onTrend={runTrend}
                onSimulate={runSimulate}
                onClear={clearScenario}
              />
            </div>

            <div id="chat" className="scroll-mt-14">
              <AnalystChat />
            </div>
          </div>
        )}

        <ChokepointDetailDialog
          card={detailId ? (bottleneckById[detailId] ?? null) : null}
          scenario={scenario}
          open={detailId !== null}
          onOpenChange={(o) => {
            if (!o) setDetailId(null);
          }}
        />

        <SiteFooter />
      </main>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
      <p>
        <span className="font-semibold text-amber">
          Directional, not predictive.
        </span>{" "}
        Bottlechip shows the <em>direction</em>{" "}a scenario pushes each chokepoint
        and
        a book&apos;s exposure — colors and words, never point-estimate returns. Seed
        evidence is curated from public Oct 2025–May 2026 reporting; every claim is
        tagged by source type and links out.
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em]">
        MS&amp;E 435 · seed data · directional by design
      </p>
    </footer>
  );
}
