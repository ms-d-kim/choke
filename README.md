# Choke

**AI supply-chain bottleneck → beneficiary tracker, with an investor lens.**

The thesis: in the AI buildout, value accrues to whoever owns the bottleneck.
Choke makes that legible — it tracks the physical chokepoints (memory, packaging,
power), maps who benefits and who's pressured when each one tightens, and lets you
re-shade a portfolio **directionally** under a chosen workload trend.

> **Directional, not predictive.** Choke shows the *direction* a trend pushes each
> chokepoint and a book's exposure to it — colors and words, never point-estimate
> returns. That discipline is the whole point.

## What's inside

- **Bottleneck cards** — HBM, CoWoS advanced packaging, and datacenter power. Each
  carries a status (tight/easing/loose), a 1–5 severity, the mechanism, real cited
  evidence (Oct 2025–May 2026), a long/cost-pressured/watch beneficiary map, and
  forward catalysts.
- **Scenario explorer** — pick a workload trend (test-time compute, long context /
  KV cache, agentic) and every chokepoint re-shades by how much that trend tightens
  it. The heat row surfaces the most-stressed chokepoint first.
- **Portfolio sensitivity** — a preset "AI Infra Long" book re-shades directionally:
  per-position lean, a *share-of-book* composition bar (not a return), and named
  drivers/risks grounded in the card data.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · deployed on Vercel.
All content is static seed data in [`/data`](./data) — no database.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project structure

```
data/            # types + seed content (bottlenecks, trends, portfolio)
lib/scenario.ts  # the directional engine (re-shade + portfolio impact)
lib/visuals.ts   # the status color system (tight=red · easing=amber · loose=green)
components/      # cards, scenario bar, portfolio panel, header
app/             # App Router entry
```

## On the data

Numbers are paraphrased from secondary reporting of company disclosures; every claim
links to its source. Verbatim quotes are kept short. The seed set is curated, not
exhaustive — Choke is a reasoning layer on top of the supply chain, not a real-time
data feed.

## How AI was used

Built with Claude Code. Claude scaffolded the app, wrote the data model and the
directional engine, and built the UI.

---

MS&E 435 final project.
