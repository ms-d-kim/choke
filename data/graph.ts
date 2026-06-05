// data/graph.ts
//
// Curated value-chain network for the Obsidian-style force graph.
// Chokepoint node ids match bottleneck ids, so a scenario's impacts re-shade
// the graph directly. Company set is curated for readability, not exhaustive.

import type { GraphLink, GraphNode } from "./types";

export const graphNodes: GraphNode[] = [
  {
    id: "ai-compute",
    label: "AI COMPUTE",
    name: "AI accelerator buildout",
    type: "hub",
    blurb: "The demand sink every physical chokepoint constrains.",
  },

  // chokepoints
  { id: "hbm", label: "HBM", name: "High-Bandwidth Memory", type: "chokepoint", blurb: "Memory stacked beside the accelerator." },
  { id: "cowos", label: "CoWoS", name: "CoWoS Advanced Packaging", type: "chokepoint", blurb: "Bonds die + HBM into a shippable part." },
  { id: "datacenter-power", label: "POWER", name: "Datacenter Power & Grid", type: "chokepoint", blurb: "Energizing the campus — the new binding constraint." },

  // HBM names
  { id: "skhynix", label: "000660", name: "SK Hynix", type: "company", role: "long", chokepoint: "hbm" },
  { id: "mu", label: "MU", name: "Micron", type: "company", role: "long", chokepoint: "hbm" },
  { id: "samsung", label: "005930", name: "Samsung", type: "company", role: "watch", chokepoint: "hbm" },

  // CoWoS names
  { id: "tsm", label: "TSM", name: "TSMC", type: "company", role: "long", chokepoint: "cowos" },
  { id: "nvda", label: "NVDA", name: "NVIDIA", type: "company", role: "long", chokepoint: "cowos" },
  { id: "asx", label: "ASX", name: "ASE Technology", type: "company", role: "long", chokepoint: "cowos" },
  { id: "amd", label: "AMD", name: "AMD", type: "company", role: "watch", chokepoint: "cowos" },
  { id: "intc", label: "INTC", name: "Intel", type: "company", role: "watch", chokepoint: "cowos" },

  // Power names
  { id: "gev", label: "GEV", name: "GE Vernova", type: "company", role: "long", chokepoint: "datacenter-power" },
  { id: "vrt", label: "VRT", name: "Vertiv", type: "company", role: "long", chokepoint: "datacenter-power" },
  { id: "ceg", label: "CEG", name: "Constellation", type: "company", role: "long", chokepoint: "datacenter-power" },
  { id: "be", label: "BE", name: "Bloom Energy", type: "company", role: "long", chokepoint: "datacenter-power" },
];

export const graphLinks: GraphLink[] = [
  // the chain
  { source: "hbm", target: "cowos", kind: "feeds", label: "stacked by" },
  { source: "cowos", target: "ai-compute", kind: "feeds", label: "packages" },
  { source: "datacenter-power", target: "ai-compute", kind: "energizes", label: "energizes" },

  // suppliers / beneficiaries → chokepoint
  { source: "skhynix", target: "hbm", kind: "supplies" },
  { source: "mu", target: "hbm", kind: "supplies" },
  { source: "samsung", target: "hbm", kind: "supplies" },
  { source: "tsm", target: "cowos", kind: "supplies" },
  { source: "nvda", target: "cowos", kind: "supplies" },
  { source: "asx", target: "cowos", kind: "supplies" },
  { source: "amd", target: "cowos", kind: "supplies" },
  { source: "intc", target: "cowos", kind: "supplies" },
  { source: "gev", target: "datacenter-power", kind: "supplies" },
  { source: "vrt", target: "datacenter-power", kind: "supplies" },
  { source: "ceg", target: "datacenter-power", kind: "supplies" },
  { source: "be", target: "datacenter-power", kind: "supplies" },
];
