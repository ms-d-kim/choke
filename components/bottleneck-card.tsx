"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusPill } from "@/components/status-pill";
import { SeverityPips } from "@/components/severity-pips";
import { cn } from "@/lib/utils";
import { impactFor } from "@/lib/scenario";
import {
  categoryLabel,
  deltaMeta,
  stackLayerLabel,
  statusMeta,
} from "@/lib/visuals";
import type {
  BottleneckCard as TCard,
  Evidence,
  ForwardCatalyst,
  Position,
  WorkloadTrend,
} from "@/data";

export function BottleneckCard({
  card,
  trend,
}: {
  card: TCard;
  trend?: WorkloadTrend;
}) {
  const impact = trend ? impactFor(trend, card.id) : undefined;
  const delta = impact ? deltaMeta(impact.tightnessPush) : undefined;
  const statusTone = statusMeta[card.status];

  // Top beneficiaries shown on the card face.
  const topLongs = card.longCandidates.slice(0, 4);

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col gap-0 overflow-hidden py-0 transition-colors",
        delta && delta.motion === "tighten" && "border-tight/40",
        delta && delta.motion === "ease" && "border-loose/40",
      )}
    >
      {/* left accent bar — base status, or scenario delta when a trend is live */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          delta ? delta.bar : statusTone.dot,
        )}
      />

      <CardHeader className="gap-0 px-5 pt-5 pb-0 [.border-b]:pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>{categoryLabel[card.category]}</span>
              <span className="text-foreground/25">/</span>
              <span>{stackLayerLabel[card.stackLayer]}</span>
            </div>
            <h3 className="mt-1 text-lg font-semibold leading-tight tracking-tight">
              {card.name}
            </h3>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusPill status={card.status} />
            <SeverityPips value={card.severity} tone={statusTone.dot} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 px-5 pt-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {card.summary}
        </p>

        {/* Scenario delta — appears only when a trend is selected */}
        {delta && impact && trend && (
          <div
            className={cn(
              "rounded-md border px-3 py-2 text-xs leading-relaxed",
              delta.chip,
            )}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="font-mono text-sm leading-none">
                {delta.arrows}
              </span>
              <span>{delta.label}</span>
              <span className="font-normal opacity-70">
                under {trend.shortName.toLowerCase()}
              </span>
            </div>
            <p className="mt-1 text-foreground/70">{impact.why}</p>
          </div>
        )}

        {/* Beneficiaries mini-row */}
        <div className="mt-auto">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Primary beneficiaries
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {topLongs.map((p) => (
              <span
                key={p.name}
                title={p.thesis}
                className="inline-flex items-center rounded border border-loose/25 bg-loose/5 px-1.5 py-0.5 font-mono text-[11px] text-foreground/80"
              >
                {p.ticker ?? p.name}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pt-4 pb-5">
        <Dialog>
          <DialogTrigger asChild>
            <button
              data-evidence-trigger={card.id}
              className="group flex w-full items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary"
            >
              <span>Evidence &amp; beneficiary map</span>
              <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </DialogTrigger>
          <CardDetails card={card} trend={trend} />
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function CardDetails({ card, trend }: { card: TCard; trend?: WorkloadTrend }) {
  const impact = trend ? impactFor(trend, card.id) : undefined;
  const delta = impact ? deltaMeta(impact.tightnessPush) : undefined;
  return (
    <DialogContent className="max-h-[88vh] gap-0 overflow-y-auto sm:max-w-2xl">
      <DialogHeader className="gap-2 text-left">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {categoryLabel[card.category]} · {stackLayerLabel[card.stackLayer]}
        </div>
        <DialogTitle className="flex items-center gap-3 text-xl">
          {card.name}
          <StatusPill status={card.status} />
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-foreground/70">
          {card.summary}
        </DialogDescription>
      </DialogHeader>

      {delta && impact && trend && (
        <div className={cn("mt-4 rounded-md border px-3 py-2 text-xs", delta.chip)}>
          <span className="font-mono">{delta.arrows}</span>{" "}
          <span className="font-semibold">{delta.label}</span> under{" "}
          {trend.name} — {impact.why}
        </div>
      )}

      <Section title="Why it's a bottleneck">
        <p className="text-sm leading-relaxed text-foreground/80">
          {card.mechanism}
        </p>
        {card.statusNote && (
          <p className="mt-2 text-xs italic text-muted-foreground">
            Status note: {card.statusNote}
          </p>
        )}
      </Section>

      <Section title="Evidence">
        <ul className="flex flex-col gap-3">
          {card.evidence.map((e, i) => (
            <EvidenceItem key={i} e={e} />
          ))}
        </ul>
      </Section>

      <Section title="Bottleneck → beneficiary map">
        <div className="grid gap-4 sm:grid-cols-3">
          <PositionColumn
            label="Long candidates"
            accent="text-loose"
            positions={card.longCandidates}
          />
          <PositionColumn
            label="Cost-pressured"
            accent="text-tight"
            positions={card.shortCandidates}
          />
          <PositionColumn
            label="Watch"
            accent="text-easing"
            positions={card.watchList}
          />
        </div>
      </Section>

      <Section title="Forward catalysts">
        <ul className="flex flex-col gap-1.5">
          {card.forwardCatalysts.map((c, i) => (
            <CatalystItem key={i} c={c} />
          ))}
        </ul>
      </Section>

      <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Last reviewed {card.lastUpdated}
      </p>
    </DialogContent>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <Separator className="mb-3" />
      <h4 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {title}
      </h4>
      {children}
    </section>
  );
}

function EvidenceItem({ e }: { e: Evidence }) {
  return (
    <li className="rounded-md border border-border bg-secondary/30 px-3 py-2.5">
      <p className="text-sm leading-relaxed text-foreground/85">{e.claim}</p>
      {e.quote && (
        <p className="mt-1.5 border-l-2 border-foreground/20 pl-2 text-sm italic text-foreground/70">
          &ldquo;{e.quote}&rdquo;
        </p>
      )}
      <a
        href={e.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="text-foreground/80">{e.org}</span>
        <span>·</span>
        <span>{e.date}</span>
        <span>·</span>
        <span className="underline underline-offset-2">{e.source}</span>
        <ExternalLink className="size-3" />
      </a>
    </li>
  );
}

function PositionColumn({
  label,
  accent,
  positions,
}: {
  label: string;
  accent: string;
  positions: Position[];
}) {
  if (!positions.length) return null;
  return (
    <div>
      <div
        className={cn(
          "mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest",
          accent,
        )}
      >
        {label}
      </div>
      <ul className="flex flex-col gap-2">
        {positions.map((p) => (
          <li key={p.name} className="text-xs leading-snug">
            <div className="flex items-baseline gap-1.5">
              <span className="font-medium text-foreground/90">{p.name}</span>
              {p.ticker && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  {p.ticker}
                </span>
              )}
              {p.visibility === "private" && !p.ticker && (
                <span className="rounded bg-foreground/10 px-1 font-mono text-[9px] uppercase text-muted-foreground">
                  pvt
                </span>
              )}
            </div>
            <p className="text-muted-foreground">{p.thesis}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CatalystItem({ c }: { c: ForwardCatalyst }) {
  const loosens = c.effect === "loosens";
  return (
    <li className="flex items-center justify-between gap-3 text-xs">
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "font-mono",
            loosens ? "text-loose" : "text-tight",
          )}
        >
          {loosens ? "↓" : "↑"}
        </span>
        <span className="text-foreground/80">{c.event}</span>
      </span>
      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
        {c.estDate} · {c.effect}
      </span>
    </li>
  );
}
