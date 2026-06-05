// data/types.ts
// Core domain types for Choke.
//
// Directional-by-design: nothing in here encodes a point-estimate return.
// We model *status*, *severity*, and *direction* only — never "this stock goes
// up X%". That discipline is the whole credibility of the tool.

export type Status = "tight" | "easing" | "loose";

export type Direction =
  | "strong_positive"
  | "positive"
  | "neutral"
  | "negative"
  | "strong_negative";

export type Category = "memory" | "packaging" | "power";
export type StackLayer = "silicon" | "infrastructure";

export type Position = {
  name: string;
  ticker?: string; // omit for private cos / baskets
  visibility: "public" | "private";
  thesis: string; // ONE line: why this name benefits / is pressured
};

export type Evidence = {
  claim: string; // paraphrased takeaway, in our words
  quote?: string; // optional, <15 words, verbatim
  source: string; // "SK Hynix Q3 2025 results" etc.
  org: string; // publisher / speaker org
  date: string; // ISO-ish
  url: string;
};

export type ForwardCatalyst = {
  event: string;
  estDate: string;
  effect: "loosens" | "tightens";
};

export type BottleneckCard = {
  id: string; // "hbm" | "cowos" | "datacenter-power"
  name: string;
  shortName: string;
  category: Category;
  stackLayer: StackLayer;
  status: Status;
  statusNote?: string; // nuance on the status
  severity: 1 | 2 | 3 | 4 | 5;
  summary: string; // 1–2 sentence TL;DR
  mechanism: string; // why it's a bottleneck (a short paragraph)
  evidence: Evidence[];
  longCandidates: Position[];
  shortCandidates: Position[]; // "cost-pressured", not fabricated shorts
  watchList: Position[];
  forwardCatalysts: ForwardCatalyst[];
  lastUpdated: string;
};

export type TrendImpact = {
  bottleneckId: string;
  // how hard this trend pushes the bottleneck's TIGHTNESS:
  tightnessPush: Direction;
  why: string;
};

export type WorkloadTrend = {
  id: string; // "test-time-compute" | "long-context-kv" | "agentic"
  name: string;
  shortName: string;
  description: string; // 1–2 sentences
  note?: string; // optional secondary beneficiary note
  impacts: TrendImpact[];
};

export type PortfolioPosition = {
  ticker: string;
  name: string;
  weight: number; // weights sum to 100
  primaryBottleneck: string; // bottleneck id this name's thesis hangs on
};

export type Portfolio = {
  id: string;
  name: string;
  description?: string;
  positions: PortfolioPosition[];
};

// ---- computed at runtime when a trend is selected — DIRECTIONAL ONLY ----

export type PositionImpact = {
  ticker: string;
  name: string;
  weight: number;
  direction: Direction; // colors + words, NO numbers
  primaryBottleneck: string; // bottleneck id
  primaryBottleneckName: string;
  reasoning: string; // 1–2 sentences, grounded in card data
};

export type PortfolioSummary = {
  leansPositivePct: number; // weighted % of book leaning positive (composition, not return)
  leansNegativePct: number;
  neutralPct: number;
  netDirection: "positive" | "negative" | "balanced";
  drivers: string[]; // named positive drivers
  risks: string[]; // named risks
};

export type PortfolioImpact = {
  trendId: string;
  positionImpacts: PositionImpact[];
  summary: PortfolioSummary;
};
