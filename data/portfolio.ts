// data/portfolio.ts
//
// One preset book. Each position carries the bottleneck its thesis hangs on,
// so a selected trend can re-shade it directionally (never with a return number).

import type { Portfolio } from "./types";

export const portfolios: Portfolio[] = [
  {
    id: "ai-infra-long",
    name: "AI Infra Long",
    description: "Equal-ish weight book across the three physical chokepoints.",
    positions: [
      { ticker: "NVDA", name: "NVIDIA", weight: 25, primaryBottleneck: "cowos" },
      { ticker: "TSM", name: "TSMC", weight: 20, primaryBottleneck: "cowos" },
      { ticker: "MU", name: "Micron", weight: 15, primaryBottleneck: "hbm" },
      { ticker: "GEV", name: "GE Vernova", weight: 20, primaryBottleneck: "datacenter-power" },
      { ticker: "VRT", name: "Vertiv", weight: 20, primaryBottleneck: "datacenter-power" },
    ],
  },
];

export const defaultPortfolio = portfolios[0];
