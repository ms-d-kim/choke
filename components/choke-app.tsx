"use client";

import { useState } from "react";
import {
  bottlenecks,
  defaultPortfolio,
  trends,
  workloads,
  type Direction,
  type Scenario,
  type WorkloadProfile,
} from "@/data";
import { scenarioFromTrend, scenarioFromWorkload } from "@/lib/scenario";
import { SiteHeader } from "@/components/site-header";
import { WorkloadLens } from "@/components/workload-lens";
import { ScenarioConsole } from "@/components/scenario-console";
import { ValueChainGraph } from "@/components/value-chain-graph";
import { ScenarioReadout } from "@/components/scenario-readout";
import { BottleneckCard } from "@/components/bottleneck-card";
import { PortfolioPanel } from "@/components/portfolio-panel";
import { AnalystChat } from "@/components/analyst-chat";
import { Panel, PanelHeader } from "@/components/terminal";

export function ChokeApp() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function runWorkload(w: WorkloadProfile) {
    setError(null);
    setScenario(scenarioFromWorkload(w));
  }

  function runTrend(trendId: string) {
    const t = trends.find((x) => x.id === trendId);
    if (!t) return;
    setError(null);
    setScenario(scenarioFromTrend(t));
  }

  async function runSimulate(prompt: string, label?: string) {
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

  function onGraphSelect() {
    document
      .getElementById("board")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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

        <div id="map" className="grid scroll-mt-14 gap-3 lg:h-[520px] lg:grid-cols-[1.7fr_1fr]">
          <Panel className="flex flex-col overflow-hidden">
            <PanelHeader
              title="Value-Chain Map"
              sub="drag · hover to trace · re-shades to scenario"
            />
            <div className="min-h-[420px] flex-1 p-1">
              <ValueChainGraph
                impacts={impacts}
                loading={loading}
                onSelect={onGraphSelect}
              />
            </div>
          </Panel>
          <ScenarioReadout scenario={scenario} loading={loading} />
        </div>

        <section id="board" className="scroll-mt-14">
          <div className="mb-2 flex items-center justify-between">
            <span className="term-label">Chokepoint Board</span>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {bottlenecks.length} tracked
              {scenario ? ` · ${scenario.label}` : ""}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {bottlenecks.map((b) => (
              <BottleneckCard key={b.id} card={b} scenario={scenario} />
            ))}
          </div>
        </section>

        <div id="port" className="scroll-mt-14">
          <PortfolioPanel portfolio={defaultPortfolio} scenario={scenario} />
        </div>

        <div id="chat" className="scroll-mt-14">
          <AnalystChat />
        </div>

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
        CHOKE shows the <em>direction</em>{" "}a scenario pushes each chokepoint and
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
