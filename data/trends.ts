// data/trends.ts
//
// Technical workload "patterns". Each has a DISTINCT chokepoint signature so the
// graph re-sizes meaningfully between them:
//   test-time  → power-dominant   (Power big · HBM med · CoWoS small)
//   long-ctx   → memory-dominant  (HBM big · CoWoS med · Power small)
//   agentic    → throughput+chips (Power big · CoWoS big · HBM med)
// Directional only.

import type { WorkloadTrend } from "./types";

export const trends: WorkloadTrend[] = [
  {
    id: "test-time-compute",
    name: "Test-time compute",
    shortName: "Test-time compute",
    description:
      "Models spend far more compute at inference (long reasoning chains), raising sustained power draw and per-query bandwidth.",
    impacts: [
      {
        bottleneckId: "datacenter-power",
        tightnessPush: "strong_positive",
        why: "Sustained high-utilization inference is the dominant new draw.",
      },
      {
        bottleneckId: "hbm",
        tightnessPush: "positive",
        why: "Long reasoning chains lift memory bandwidth per query.",
      },
      {
        bottleneckId: "cowos",
        tightnessPush: "neutral",
        why: "Uses existing accelerators harder rather than adding packaging demand.",
      },
    ],
  },
  {
    id: "long-context-kv",
    name: "Long context / KV cache growth",
    shortName: "Long context",
    description:
      "Larger context windows blow up the KV cache, which is HBM-resident — capacity and bandwidth scale with context length × batch.",
    impacts: [
      {
        bottleneckId: "hbm",
        tightnessPush: "strong_positive",
        why: "The KV cache lives in HBM — the binding constraint by far.",
      },
      {
        bottleneckId: "cowos",
        tightnessPush: "positive",
        why: "More HBM stacks per package to hold the larger cache.",
      },
      {
        bottleneckId: "datacenter-power",
        tightnessPush: "neutral",
        why: "Memory-bound; not primarily a power story.",
      },
    ],
  },
  {
    id: "agentic",
    name: "Agentic workflows",
    shortName: "Agentic",
    description:
      "Multi-step, multi-call agents multiply inference passes and concurrency per task, amplifying throughput and accelerator demand.",
    note:
      "Also lifts managed-inference providers (e.g. Baseten) as a beneficiary class.",
    impacts: [
      {
        bottleneckId: "datacenter-power",
        tightnessPush: "strong_positive",
        why: "Throughput from many calls multiplies sustained power demand.",
      },
      {
        bottleneckId: "cowos",
        tightnessPush: "strong_positive",
        why: "Concurrent agents need many more accelerators — heavy packaging pull.",
      },
      {
        bottleneckId: "hbm",
        tightnessPush: "positive",
        why: "More inference passes consume more bandwidth.",
      },
    ],
  },
];
