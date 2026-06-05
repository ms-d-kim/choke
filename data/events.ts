// data/events.ts
//
// Preset event scenarios. Unlike workload trends (which have hardcoded impacts),
// these are handed to the model to simulate the propagation through the chain.

export type EventPreset = {
  id: string;
  label: string; // chip text
  prompt: string; // context handed to the simulator
};

export const eventPresets: EventPreset[] = [
  {
    id: "china-oss",
    label: "China OSS model release",
    prompt:
      "A major Chinese lab releases a frontier open-source model (DeepSeek-class) that drives a wave of cheaper, self-hosted inference globally.",
  },
  {
    id: "nvidia-rubin",
    label: "NVIDIA Rubin launch",
    prompt:
      "NVIDIA launches its next-gen Rubin GPU generation, with materially higher HBM stack count and advanced-packaging area required per accelerator.",
  },
  {
    id: "arm-server-cpu",
    label: "ARM ships server CPU",
    prompt:
      "ARM ships its own proprietary high-core-count server CPU, competing directly with x86 and hyperscaler custom silicon in the datacenter.",
  },
  {
    id: "hormuz",
    label: "Strait of Hormuz shutdown",
    prompt:
      "The Strait of Hormuz is shut down, spiking global energy prices and disrupting gas supply and logistics.",
  },
  {
    id: "intel-fab",
    label: "Intel fab capacity online",
    prompt:
      "Intel Foundry brings substantial new leading-edge fab and advanced-packaging capacity online, offering a credible second source to TSMC.",
  },
  {
    id: "taiwan-risk",
    label: "Taiwan supply shock",
    prompt:
      "A logistics/geopolitical shock around Taiwan disrupts TSMC fabrication and CoWoS packaging output for an extended period.",
  },
];
