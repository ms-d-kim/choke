"use client";

import { useState } from "react";
import { bottlenecks, trends, defaultPortfolio } from "@/data";
import { SiteHeader } from "@/components/site-header";
import { ScenarioBar } from "@/components/scenario-bar";
import { BottleneckCard } from "@/components/bottleneck-card";
import { PortfolioPanel } from "@/components/portfolio-panel";
import { AnalystChat } from "@/components/analyst-chat";

export function ChokeApp() {
  const [selectedTrendId, setSelectedTrendId] = useState<string | null>(null);
  const trend = trends.find((t) => t.id === selectedTrendId) ?? null;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-5 px-4 pb-20 sm:px-6">
        <ScenarioBar
          trends={trends}
          selectedTrendId={selectedTrendId}
          onSelect={setSelectedTrendId}
        />

        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Live chokepoints
            </h2>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {bottlenecks.length} tracked
              {trend ? ` · scenario: ${trend.shortName}` : ""}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bottlenecks.map((b) => (
              <BottleneckCard key={b.id} card={b} trend={trend ?? undefined} />
            ))}
          </div>
        </section>

        <PortfolioPanel portfolio={defaultPortfolio} trend={trend} />

        <AnalystChat />

        <SiteFooter />
      </main>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
      <p>
        <span className="font-medium text-foreground/80">
          Directional, not predictive.
        </span>{" "}
        Choke shows the <em>direction</em> a workload trend pushes each chokepoint
        and a book&apos;s exposure to it — colors and words, never point-estimate
        returns. Evidence is curated from public Oct 2025–May 2026 reporting of
        company disclosures; every claim links to its source.
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest">
        MS&amp;E 435 · seed data, directional by design
      </p>
    </footer>
  );
}
