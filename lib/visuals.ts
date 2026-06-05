// lib/visuals.ts
//
// One place for the status color system so it stays consistent across cards,
// the scenario heat row, and the portfolio. Colors:
//   tight → red · easing → amber · loose → green   (see globals.css tokens)

import type { Direction, SourceType, Status } from "@/data";
import { DIRECTION_SCORE, motionOf } from "@/lib/scenario";

// Honest source-kind tags — what *type* of source each claim rests on.
export const sourceTypeMeta: Record<SourceType, { label: string; chip: string }> = {
  Earnings: { label: "EARNINGS", chip: "bg-amber/10 text-amber border-amber/30" },
  News: { label: "NEWS", chip: "bg-cyan/10 text-cyan border-cyan/30" },
  Research: { label: "RESEARCH", chip: "bg-loose/10 text-loose border-loose/30" },
  "Gov / Lab data": { label: "GOV / LAB", chip: "bg-loose/10 text-loose border-loose/30" },
  Filing: { label: "FILING", chip: "bg-amber/15 text-amber border-amber/40" },
  "Press release": { label: "PRESS", chip: "bg-secondary text-muted-foreground border-border" },
};

export const statusMeta: Record<
  Status,
  { label: string; dot: string; text: string; chip: string }
> = {
  tight: {
    label: "Tight",
    dot: "bg-tight",
    text: "text-tight",
    chip: "bg-tight/10 text-tight border-tight/30",
  },
  easing: {
    label: "Easing",
    dot: "bg-easing",
    text: "text-easing",
    chip: "bg-easing/10 text-easing border-easing/30",
  },
  loose: {
    label: "Loose",
    dot: "bg-loose",
    text: "text-loose",
    chip: "bg-loose/10 text-loose border-loose/30",
  },
};

// Tightness delta for a bottleneck under a selected trend.
// tighten → red (the constraint binds harder) · ease → green · none → muted.
export type DeltaMeta = {
  label: string; // "Tightening"
  arrows: string; // "↑↑"
  motion: "tighten" | "ease" | "none";
  text: string;
  chip: string;
  bar: string; // accent bar color
  intensity: number; // 0–2, for sizing the indicator
};

export function deltaMeta(push: Direction): DeltaMeta {
  const motion = motionOf(push);
  const intensity = Math.abs(DIRECTION_SCORE[push]);
  const strong = intensity >= 2;
  if (motion === "tighten") {
    return {
      label: strong ? "Strongly tightening" : "Tightening",
      arrows: strong ? "↑↑" : "↑",
      motion,
      text: "text-tight",
      chip: "bg-tight/10 text-tight border-tight/30",
      bar: "bg-tight",
      intensity,
    };
  }
  if (motion === "ease") {
    return {
      label: strong ? "Strongly easing" : "Easing",
      arrows: strong ? "↓↓" : "↓",
      motion,
      text: "text-loose",
      chip: "bg-loose/10 text-loose border-loose/30",
      bar: "bg-loose",
      intensity,
    };
  }
  return {
    label: "Stable",
    arrows: "→",
    motion,
    text: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground border-border",
    bar: "bg-muted-foreground/40",
    intensity: 0,
  };
}

// Directional P&L lean for a portfolio position.
// positive (benefits) → green · negative → red · neutral → muted.
export type PnlMeta = {
  label: string;
  text: string;
  chip: string;
  bar: string;
};

export function pnlMeta(direction: Direction): PnlMeta {
  switch (direction) {
    case "strong_positive":
      return {
        label: "Strongly positive",
        text: "text-loose",
        chip: "bg-loose/15 text-loose border-loose/40",
        bar: "bg-loose",
      };
    case "positive":
      return {
        label: "Positive",
        text: "text-loose",
        chip: "bg-loose/10 text-loose border-loose/30",
        bar: "bg-loose/80",
      };
    case "neutral":
      return {
        label: "Neutral",
        text: "text-muted-foreground",
        chip: "bg-muted text-muted-foreground border-border",
        bar: "bg-muted-foreground/40",
      };
    case "negative":
      return {
        label: "Negative",
        text: "text-tight",
        chip: "bg-tight/10 text-tight border-tight/30",
        bar: "bg-tight/80",
      };
    case "strong_negative":
      return {
        label: "Strongly negative",
        text: "text-tight",
        chip: "bg-tight/15 text-tight border-tight/40",
        bar: "bg-tight",
      };
  }
}

export const netDirectionMeta: Record<
  "positive" | "negative" | "balanced",
  { label: string; text: string; chip: string }
> = {
  positive: {
    label: "Leans positive",
    text: "text-loose",
    chip: "bg-loose/10 text-loose border-loose/30",
  },
  negative: {
    label: "Leans negative",
    text: "text-tight",
    chip: "bg-tight/10 text-tight border-tight/30",
  },
  balanced: {
    label: "Balanced",
    text: "text-easing",
    chip: "bg-easing/10 text-easing border-easing/30",
  },
};

export const categoryLabel: Record<string, string> = {
  memory: "Memory",
  packaging: "Packaging",
  power: "Power",
};

export const stackLayerLabel: Record<string, string> = {
  silicon: "Silicon",
  infrastructure: "Infrastructure",
};
