"use client";

import { TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { computePortfolioImpact } from "@/lib/scenario";
import { netDirectionMeta, pnlMeta } from "@/lib/visuals";
import type { Portfolio, Scenario } from "@/data";

export function PortfolioPanel({
  portfolio,
  scenario,
}: {
  portfolio: Portfolio;
  scenario: Scenario | null;
}) {
  return (
    <section className="rounded-xl border border-border bg-card/50 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Portfolio sensitivity
          </h2>
          <p className="mt-1 text-lg font-semibold tracking-tight">
            {portfolio.name}
          </p>
          {portfolio.description && (
            <p className="text-sm text-muted-foreground">
              {portfolio.description}
            </p>
          )}
        </div>
        <span className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Directional · no return estimates
        </span>
      </div>

      {scenario ? (
        <PortfolioImpactView portfolio={portfolio} scenario={scenario} />
      ) : (
        <BaselineView portfolio={portfolio} />
      )}
    </section>
  );
}

function BaselineView({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-sm text-muted-foreground">
        Select a scenario above to re-shade the book by directional exposure.
      </p>
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {portfolio.positions.map((p) => (
          <li
            key={p.ticker}
            className="flex items-center justify-between rounded-md border border-border bg-secondary/30 px-3 py-2"
          >
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-medium">{p.ticker}</span>
              <span className="text-xs text-muted-foreground">{p.name}</span>
            </span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {p.weight}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PortfolioImpactView({
  portfolio,
  scenario,
}: {
  portfolio: Portfolio;
  scenario: Scenario;
}) {
  const result = computePortfolioImpact(portfolio, scenario);
  const net = netDirectionMeta[result.summary.netDirection];
  const { leansPositivePct, neutralPct, leansNegativePct } = result.summary;

  return (
    <div className="mt-4 border-t border-border pt-4">
      {/* Headline */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold",
            net.chip,
          )}
        >
          {net.label}
        </span>
        <span className="text-sm text-muted-foreground">
          to {scenario.label.toLowerCase()}
        </span>
      </div>

      {/* Composition bar — share of book, NOT a return */}
      <div className="mt-4">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>Share of weighted book by lean</span>
          <span>not a return estimate</span>
        </div>
        <div className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          {leansPositivePct > 0 && (
            <div className="h-full bg-loose" style={{ width: `${leansPositivePct}%` }} />
          )}
          {neutralPct > 0 && (
            <div
              className="h-full bg-muted-foreground/40"
              style={{ width: `${neutralPct}%` }}
            />
          )}
          {leansNegativePct > 0 && (
            <div className="h-full bg-tight" style={{ width: `${leansNegativePct}%` }} />
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tabular-nums">
          <LegendDot className="bg-loose" label="positive" value={leansPositivePct} />
          <LegendDot
            className="bg-muted-foreground/40"
            label="neutral"
            value={neutralPct}
          />
          <LegendDot className="bg-tight" label="negative" value={leansNegativePct} />
        </div>
      </div>

      {/* Position rows */}
      <ul className="mt-4 flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border">
        {result.positionImpacts.map((pi) => {
          const m = pnlMeta(pi.direction);
          return (
            <li
              key={pi.ticker}
              className="flex items-start gap-3 bg-secondary/20 px-3 py-2.5"
            >
              <span className={cn("mt-1 h-8 w-1 shrink-0 rounded-full", m.bar)} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-sm font-semibold">
                      {pi.ticker}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {pi.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      · {pi.primaryBottleneckName}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      {pi.weight}%
                    </span>
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[11px] font-medium",
                        m.chip,
                      )}
                    >
                      {m.label}
                    </span>
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  {pi.reasoning}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Drivers + risks */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <SummaryBlock
          icon={<TrendingUp className="size-3.5 text-loose" />}
          label="Primary drivers"
          items={result.summary.drivers}
          tone="text-foreground/80"
        />
        <SummaryBlock
          icon={<AlertTriangle className="size-3.5 text-easing" />}
          label="Primary risks"
          items={result.summary.risks}
          tone="text-foreground/80"
        />
      </div>
    </div>
  );
}

function LegendDot({
  className,
  label,
  value,
}: {
  className: string;
  label: string;
  value: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full", className)} />
      <span>
        {label} {value}%
      </span>
    </span>
  );
}

function SummaryBlock({
  icon,
  label,
  items,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  tone: string;
}) {
  if (!items.length) return null;
  return (
    <div className="rounded-md border border-border bg-secondary/20 px-3 py-2.5">
      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <ul className={cn("flex flex-col gap-1 text-xs leading-snug", tone)}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
