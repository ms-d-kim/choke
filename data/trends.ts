// data/trends.ts
//
// Workload trends. Each trend pushes every bottleneck's *tightness* by a
// direction (how much more/less binding the constraint gets). Directional only.

import type { WorkloadTrend } from "./types";

export const trends: WorkloadTrend[] = [
  {
    id: "test-time-compute",
    name: "Test-time compute",
    shortName: "Test-time compute",
    description:
      "Models spend far more compute at inference time (long reasoning chains), raising per-query memory bandwidth and sustained power draw.",
    impacts: [
      {
        bottleneckId: "hbm",
        tightnessPush: "positive",
        why: "More bandwidth consumed per query as reasoning chains grow.",
      },
      {
        bottleneckId: "cowos",
        tightnessPush: "positive",
        why: "More accelerators needed to serve the reasoning load.",
      },
      {
        bottleneckId: "datacenter-power",
        tightnessPush: "strong_positive",
        why: "Sustained high-utilization inference raises continuous power draw.",
      },
    ],
  },
  {
    id: "long-context-kv",
    name: "Long context / KV cache growth",
    shortName: "Long context",
    description:
      "Larger context windows blow up the KV cache, which is HBM-resident — capacity and bandwidth both scale with context length × batch.",
    impacts: [
      {
        bottleneckId: "hbm",
        tightnessPush: "strong_positive",
        why: "KV cache lives in HBM; capacity and bandwidth scale with context.",
      },
      {
        bottleneckId: "cowos",
        tightnessPush: "positive",
        why: "More HBM stacks per package to hold the larger cache.",
      },
      {
        bottleneckId: "datacenter-power",
        tightnessPush: "positive",
        why: "Bigger working sets lift power per token served.",
      },
    ],
  },
  {
    id: "agentic",
    name: "Agentic workflows",
    shortName: "Agentic",
    description:
      "Multi-step, multi-call agents multiply tokens and inference passes per user task, amplifying throughput demand across the stack.",
    note:
      "Also lifts managed-inference providers (e.g. Baseten) as a beneficiary class.",
    impacts: [
      {
        bottleneckId: "datacenter-power",
        tightnessPush: "strong_positive",
        why: "Throughput multiplies sustained power demand.",
      },
      {
        bottleneckId: "hbm",
        tightnessPush: "positive",
        why: "More inference passes consume more bandwidth.",
      },
      {
        bottleneckId: "cowos",
        tightnessPush: "positive",
        why: "More accelerators to serve concurrent agent calls.",
      },
    ],
  },
];
