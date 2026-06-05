"use client";

import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusPill } from "@/components/status-pill";
import { cn } from "@/lib/utils";
import { pushFor } from "@/lib/scenario";
import {
  categoryLabel,
  deltaMeta,
  sourceTypeMeta,
  stackLayerLabel,
} from "@/lib/visuals";
import type {
  BottleneckCard as TCard,
  Evidence,
  ForwardCatalyst,
  Position,
  Scenario,
} from "@/data";

// Evidence + beneficiary map for a chokepoint — opened by clicking a graph node.
export function ChokepointDetailDialog({
  card,
  scenario,
  open,
  onOpenChange,
}: {
  card: TCard | null;
  scenario: Scenario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const impact = card && scenario ? pushFor(scenario, card.id) : undefined;
  const delta = impact ? deltaMeta(impact.push) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {card && (
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

          {delta && impact && scenario && (
            <div className={cn("mt-4 rounded-md border px-3 py-2 text-xs", delta.chip)}>
              <span className="font-mono">{delta.arrows}</span>{" "}
              <span className="font-semibold">{delta.label}</span> under{" "}
              {scenario.label} — {impact.why}
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
              <PositionColumn label="Long candidates" accent="text-loose" positions={card.longCandidates} />
              <PositionColumn label="Cost-pressured" accent="text-tight" positions={card.shortCandidates} />
              <PositionColumn label="Watch" accent="text-easing" positions={card.watchList} />
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
      )}
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
  const st = sourceTypeMeta[e.sourceType];
  return (
    <li className="rounded-md border border-border bg-secondary/30 px-3 py-2.5">
      <span
        className={cn(
          "mb-1.5 inline-flex items-center rounded-xs border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider",
          st.chip,
        )}
      >
        {st.label}
      </span>
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
      <div className={cn("mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest", accent)}>
        {label}
      </div>
      <ul className="flex flex-col gap-2">
        {positions.map((p) => (
          <li key={p.name} className="text-xs leading-snug">
            <div className="flex items-baseline gap-1.5">
              <span className="font-medium text-foreground/90">{p.name}</span>
              {p.ticker && (
                <span className="font-mono text-[10px] text-muted-foreground">{p.ticker}</span>
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
        <span className={cn("font-mono", loosens ? "text-loose" : "text-tight")}>
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
