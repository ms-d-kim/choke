// lib/scenario.ts
//
// The directional engine. Given a selected workload trend, it (a) tells each
// bottleneck card how much that trend pushes its tightness, and (b) re-shades a
// portfolio directionally. There is deliberately NO return math anywhere here.

import {
  bottlenecks,
  trends,
  type BottleneckCard,
  type Direction,
  type Portfolio,
  type PortfolioImpact,
  type PositionImpact,
  type TrendImpact,
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

// Short lever label used in portfolio drivers/risks.
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

export function impactFor(
  trend: WorkloadTrend | undefined,
  bottleneckId: string,
): TrendImpact | undefined {
  return trend?.impacts.find((i) => i.bottleneckId === bottleneckId);
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

// ── Portfolio re-shade (directional only) ───────────────────────────────────

export function computePortfolioImpact(
  portfolio: Portfolio,
  trend: WorkloadTrend,
): PortfolioImpact {
  const positionImpacts: PositionImpact[] = portfolio.positions.map((p) => {
    const b = bottleneckById[p.primaryBottleneck];
    const impact = impactFor(trend, p.primaryBottleneck);
    const push: Direction = impact?.tightnessPush ?? "neutral";
    // These are long beneficiaries: a tighter primary bottleneck is a tailwind,
    // so the position's directional lean tracks the bottleneck's tightness push.
    const reasoning = impact
      ? `${b.shortName} ${motionPhrase(push)} under ${trend.shortName.toLowerCase()} — ${impact.why}`
      : `${b.shortName} is largely unaffected by ${trend.shortName.toLowerCase()}.`;
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
    trendId: trend.id,
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
    if (DIRECTION_SCORE[pi.direction] > 0) {
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

  // Concentration: which lever carries the most book weight on the positive side.
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

  // Any position that actually leans negative under the trend.
  const negatives = impacts.filter((pi) => DIRECTION_SCORE[pi.direction] < 0);
  if (negatives.length) {
    risks.push(
      `Pressure on ${negatives.map((p) => p.ticker).join(", ")} as their primary bottleneck eases.`,
    );
  }

  return risks;
}
