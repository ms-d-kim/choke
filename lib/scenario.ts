// lib/scenario.ts
//
// The directional engine. A unified Scenario (preset workload trend, preset
// event, or a free-text "what if") carries a per-chokepoint tightness push.
// Everything downstream — graph nodes, card deltas, portfolio — reads it.
// Still no return math anywhere.

import {
  bottlenecks,
  trends,
  type BottleneckCard,
  type Direction,
  type Portfolio,
  type PortfolioImpact,
  type PositionImpact,
  type Scenario,
  type ScenarioActor,
  type ScenarioImpact,
  type WorkloadTrend,
} from "@/data";

export const DIRECTION_SCORE: Record<Direction, number> = {
  strong_positive: 2,
  positive: 1,
  neutral: 0,
  negative: -1,
  strong_negative: -2,
};

export const bottleneckById: Record<string, BottleneckCard> = Object.fromEntries(
  bottlenecks.map((b) => [b.id, b]),
);

export const trendById: Record<string, WorkloadTrend> = Object.fromEntries(
  trends.map((t) => [t.id, t]),
);

const LEVER_LABEL: Record<string, string> = {
  hbm: "HBM",
  cowos: "Packaging",
  "datacenter-power": "Power",
};
const LEVER_ORDER = ["hbm", "cowos", "datacenter-power"];

export type Motion = "tighten" | "ease" | "none";

export function motionOf(push: Direction): Motion {
  const s = DIRECTION_SCORE[push];
  return s > 0 ? "tighten" : s < 0 ? "ease" : "none";
}

export function pushFor(
  scenario: Scenario | null | undefined,
  bottleneckId: string,
): ScenarioImpact | undefined {
  return scenario?.impacts.find((i) => i.bottleneckId === bottleneckId);
}

function motionPhrase(push: Direction): string {
  switch (push) {
    case "strong_positive":
      return "tightens sharply";
    case "positive":
      return "tightens";
    case "neutral":
      return "is roughly stable";
    case "negative":
      return "eases";
    case "strong_negative":
      return "eases sharply";
  }
}

// ── Build a Scenario from a hardcoded workload trend (instant preset) ────────

export function scenarioFromTrend(trend: WorkloadTrend): Scenario {
  const impacts: ScenarioImpact[] = trend.impacts.map((i) => ({
    bottleneckId: i.bottleneckId,
    push: i.tightnessPush,
    why: i.why,
  }));
  return {
    id: trend.id,
    label: trend.shortName,
    kind: "workload",
    description: trend.description,
    note: trend.note,
    impacts,
    narrative: trend.description,
    beneficiaries: deriveActors(impacts, "long"),
    pressured: deriveActors(impacts, "pressured"),
    origin: "preset",
  };
}

function deriveActors(
  impacts: ScenarioImpact[],
  side: "long" | "pressured",
): ScenarioActor[] {
  const tightened = impacts
    .filter((i) => DIRECTION_SCORE[i.push] > 0)
    .sort((a, b) => DIRECTION_SCORE[b.push] - DIRECTION_SCORE[a.push]);
  const out: ScenarioActor[] = [];
  const seen = new Set<string>();
  for (const i of tightened) {
    const b = bottleneckById[i.bottleneckId];
    if (!b) continue;
    const pool = side === "long" ? b.longCandidates : b.shortCandidates;
    for (const p of pool.slice(0, side === "long" ? 2 : 1)) {
      if (seen.has(p.name)) continue;
      seen.add(p.name);
      out.push({
        name: p.name,
        ticker: p.ticker,
        why: `${b.shortName} tightens — ${p.thesis}`,
      });
    }
  }
  return out;
}

// ── Portfolio re-shade (directional only) ───────────────────────────────────

export function computePortfolioImpact(
  portfolio: Portfolio,
  scenario: Scenario,
): PortfolioImpact {
  const positionImpacts: PositionImpact[] = portfolio.positions.map((p) => {
    const b = bottleneckById[p.primaryBottleneck];
    const impact = pushFor(scenario, p.primaryBottleneck);
    const push: Direction = impact?.push ?? "neutral";
    const reasoning = impact
      ? `${b.shortName} ${motionPhrase(push)} under ${scenario.label.toLowerCase()} — ${impact.why}`
      : `${b.shortName} is largely unaffected by ${scenario.label.toLowerCase()}.`;
    return {
      ticker: p.ticker,
      name: p.name,
      weight: p.weight,
      direction: push,
      primaryBottleneck: p.primaryBottleneck,
      primaryBottleneckName: b.shortName,
      reasoning,
    };
  });

  let pos = 0;
  let neg = 0;
  let neu = 0;
  for (const pi of positionImpacts) {
    const s = DIRECTION_SCORE[pi.direction];
    if (s > 0) pos += pi.weight;
    else if (s < 0) neg += pi.weight;
    else neu += pi.weight;
  }

  const netDirection =
    pos - neg >= 15 ? "positive" : neg - pos >= 15 ? "negative" : "balanced";

  return {
    trendId: scenario.id,
    positionImpacts,
    summary: {
      leansPositivePct: pos,
      leansNegativePct: neg,
      neutralPct: neu,
      netDirection,
      drivers: buildDrivers(positionImpacts),
      risks: buildRisks(positionImpacts),
    },
  };
}

function buildDrivers(impacts: PositionImpact[]): string[] {
  const byLever: Record<string, string[]> = {};
  for (const pi of impacts) {
    const s = DIRECTION_SCORE[pi.direction];
    if (s > 0) {
      const lever = LEVER_LABEL[pi.primaryBottleneck] ?? pi.primaryBottleneckName;
      (byLever[lever] ??= []).push(pi.ticker);
    }
  }
  return LEVER_ORDER.map((id) => LEVER_LABEL[id])
    .filter((lever) => byLever[lever]?.length)
    .map((lever) => `${lever} via ${byLever[lever].join(", ")}`);
}

function buildRisks(impacts: PositionImpact[]): string[] {
  const risks: string[] = [];
  const leverWeight: Record<string, number> = {};
  const leverTickers: Record<string, string[]> = {};
  for (const pi of impacts) {
    if (DIRECTION_SCORE[pi.direction] > 0) {
      const id = pi.primaryBottleneck;
      leverWeight[id] = (leverWeight[id] ?? 0) + pi.weight;
      (leverTickers[id] ??= []).push(pi.ticker);
    }
  }
  const dominant = Object.entries(leverWeight).sort((a, b) => b[1] - a[1])[0];
  if (dominant) {
    const [id, weight] = dominant;
    const lever = LEVER_LABEL[id] ?? id;
    const easeCatalyst = bottleneckById[id]?.forwardCatalysts.find(
      (c) => c.effect === "loosens",
    );
    const tail = easeCatalyst ? ` (e.g. ${easeCatalyst.event.toLowerCase()})` : "";
    risks.push(
      `Concentration — ~${weight}% of the book leans on ${lever} (${leverTickers[id].join(", ")}); a faster-than-expected easing${tail} would erode that edge.`,
    );
  }
  const negatives = impacts.filter((pi) => DIRECTION_SCORE[pi.direction] < 0);
  if (negatives.length) {
    risks.push(
      `Pressure on ${negatives.map((p) => p.ticker).join(", ")} as their primary bottleneck eases.`,
    );
  }
  return risks;
}
