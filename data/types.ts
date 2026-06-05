// data/types.ts
// Core domain types for Bottlechip.
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

// Honest classification of the *kind* of source. Our seed set is secondary
// reporting of disclosures — so it is News / Research / Gov-Lab / Earnings,
// never an "SEC filing" we don't actually have.
export type SourceType =
  | "Earnings"
  | "News"
  | "Research"
  | "Gov / Lab data"
  | "Filing"
  | "Press release";

export type Evidence = {
  claim: string; // paraphrased takeaway, in our words
  quote?: string; // optional, <15 words, verbatim
  sourceType: SourceType; // is this a filing? news? research? earnings?
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

// Application-level AI workloads — the user's first-engagement lens.
// "If you're building / investing in X, here's the chokepoint signature."
export type WorkloadProfile = {
  id: string;
  name: string;
  tagline: string; // short descriptor for the tile
  description: string; // narrative shown in the readout
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

// ---- Unified scenario (preset workload OR simulated event/custom) ----

export type ScenarioImpact = {
  bottleneckId: string;
  push: Direction; // tightnessPush on this chokepoint
  why: string;
};

export type ScenarioActor = {
  name: string;
  ticker?: string;
  why: string;
};

export type Scenario = {
  id: string;
  label: string; // short headline, e.g. "Long context" or "China OSS model release"
  kind: "workload" | "event" | "custom";
  description?: string;
  note?: string;
  impacts: ScenarioImpact[];
  narrative?: string; // directional walk-through (model scenarios)
  beneficiaries?: ScenarioActor[];
  pressured?: ScenarioActor[];
  risks?: string[];
  origin: "preset" | "model";
};

// ---- Value-chain graph (Obsidian-style force network) ----

export type GraphNodeType = "hub" | "chokepoint" | "company";
export type GraphRole = "long" | "watch" | "pressured" | "core";

export type GraphNode = {
  id: string;
  label: string; // short on-node label (ticker or abbrev)
  name: string; // full name
  type: GraphNodeType;
  role?: GraphRole;
  chokepoint?: string; // for companies: which chokepoint they hang off
  blurb?: string;
};

export type GraphLink = {
  source: string;
  target: string;
  kind: "supplies" | "feeds" | "energizes";
  label?: string;
};
