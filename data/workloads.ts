// data/workloads.ts
//
// Application AI workloads — the first-engagement lens. Each carries a directional
// "chokepoint signature" (how hard it stresses HBM / CoWoS / power). Directional
// characterizations, not fabricated numbers.

import type { WorkloadProfile } from "./types";

export const workloads: WorkloadProfile[] = [
  {
    id: "coding-agents",
    name: "Coding agents",
    tagline: "Whole-repo context · many tool calls",
    description:
      "Coding agents hold entire repositories in context and fire many tool calls per task — the KV cache balloons in HBM, reasoning runs long, and the inference fleet scales.",
    impacts: [
      { bottleneckId: "hbm", tightnessPush: "strong_positive", why: "Whole-repo context + long reasoning = a large HBM-resident KV cache." },
      { bottleneckId: "cowos", tightnessPush: "positive", why: "More accelerators to serve agent fleets." },
      { bottleneckId: "datacenter-power", tightnessPush: "positive", why: "Sustained multi-call inference lifts power draw." },
    ],
  },
  {
    id: "voice-agents",
    name: "Voice agents",
    tagline: "Always-on · low-latency · high concurrency",
    description:
      "Real-time voice agents need always-on, low-latency inference across many concurrent streams — sustained power and memory bandwidth are the binding costs.",
    impacts: [
      { bottleneckId: "datacenter-power", tightnessPush: "strong_positive", why: "Always-on real-time serving at high concurrency." },
      { bottleneckId: "hbm", tightnessPush: "positive", why: "Bandwidth for many simultaneous low-latency streams." },
      { bottleneckId: "cowos", tightnessPush: "positive", why: "Accelerators for concurrent sessions." },
    ],
  },
  {
    id: "video-gen",
    name: "Video generation",
    tagline: "Diffusion over long sequences — the heaviest",
    description:
      "Video generation is the most resource-hungry workload — enormous compute and memory per clip stress all three chokepoints, with packaging and power the gating constraints.",
    impacts: [
      { bottleneckId: "cowos", tightnessPush: "strong_positive", why: "Largest dies + most HBM stacks per accelerator." },
      { bottleneckId: "hbm", tightnessPush: "strong_positive", why: "Massive activations and state per frame." },
      { bottleneckId: "datacenter-power", tightnessPush: "strong_positive", why: "Compute-bound; enormous sustained draw." },
    ],
  },
  {
    id: "autonomous-driving",
    name: "Autonomous driving",
    tagline: "Edge inference + world-model training",
    description:
      "Autonomous driving splits between massive simulation/training clusters and edge inference on specialized silicon; the datacenter side tightens HBM and power as world-model training scales.",
    impacts: [
      { bottleneckId: "datacenter-power", tightnessPush: "positive", why: "Large training and simulation clusters." },
      { bottleneckId: "hbm", tightnessPush: "positive", why: "Multimodal world-model training." },
      { bottleneckId: "cowos", tightnessPush: "neutral", why: "Edge inference runs on specialized silicon, easing datacenter packaging pull." },
    ],
  },
  {
    id: "world-models",
    name: "World models",
    tagline: "Frontier scale · long rollouts",
    description:
      "World models push the frontier of scale — giant parameter counts and long simulated rollouts make all three chokepoints bind, with HBM capacity and power the hardest limits.",
    impacts: [
      { bottleneckId: "hbm", tightnessPush: "strong_positive", why: "Giant weights + long rollout state live in HBM." },
      { bottleneckId: "cowos", tightnessPush: "strong_positive", why: "Frontier models need the most advanced packaging." },
      { bottleneckId: "datacenter-power", tightnessPush: "strong_positive", why: "Simulation and training are compute-bound." },
    ],
  },
  {
    id: "recommenders",
    name: "Recommenders / ranking",
    tagline: "Huge embeddings · high-QPS serving",
    description:
      "Recommenders run enormous embedding tables at very high QPS — memory capacity and serving power dominate; advanced packaging is less of a gate than for frontier training.",
    impacts: [
      { bottleneckId: "hbm", tightnessPush: "positive", why: "Large embedding tables served at high QPS." },
      { bottleneckId: "datacenter-power", tightnessPush: "positive", why: "High-QPS serving draw." },
      { bottleneckId: "cowos", tightnessPush: "neutral", why: "Less packaging-gated than frontier training." },
    ],
  },
];
