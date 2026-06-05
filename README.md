# CHOKE

**An investor terminal for the AI buildout's physical chokepoints.**

The thesis: value accrues to whoever owns the bottleneck. CHOKE maps the AI supply
chain's chokepoints (HBM memory, CoWoS packaging, datacenter power) as an interactive
graph, lets you **simulate any scenario**, and re-shades the chokepoints, the
beneficiary map, and a sample book **directionally**.

> **Directional, not predictive.** CHOKE shows the *direction* a scenario pushes each
> chokepoint and a book's exposure — colors and words, never point-estimate returns.

**Live:** https://choke-one.vercel.app

## What's inside

- **Value-chain graph** — an Obsidian-style force network (chokepoints + key names)
  that you can drag and hover to trace relationships. Chokepoint nodes re-shade red
  (tightening) / green (easing) under a scenario.
- **Scenario simulator** — pick a workload trend, fire a preset event (China OSS model,
  NVIDIA Rubin, ARM server CPU, Hormuz shutdown, Intel fab…), or **type any what-if**.
  A server-side model traces the second-order effects across the chain and returns a
  per-chokepoint directional read + named beneficiaries / pressured + "what would
  change the call."
- **Chokepoint board** — cards for HBM, CoWoS, datacenter power: status, severity,
  mechanism, cited evidence **tagged by source type** (earnings / news / research /
  gov-lab), and a long / cost-pressured / watch map.
- **Portfolio sensitivity** — a preset book re-shades directionally: per-position lean,
  a *share-of-book* composition bar (not a return), named drivers/risks.
- **Grounded analyst chat** — ask about the chokepoints; answers are grounded in the
  card data and stay directional.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · d3-force · deployed on
Vercel. Seed content is static in [`/data`](./data) — no database. The simulator and
chat call Claude Sonnet 4.6 via OpenRouter (server-side; key in `OPENROUTER_API_KEY`).

## Run locally

```bash
npm install
cp .env.example .env.local         # add OPENROUTER_API_KEY for the simulator/chat
npm run dev
```

## Project structure

```
data/            # types + seed content (bottlenecks, trends, events, graph, portfolio)
lib/scenario.ts  # the directional engine (re-shade + portfolio impact)
lib/visuals.ts   # the status color system + source-type tags
components/       # graph, scenario console, readout, cards, portfolio, chat, header
app/api/scenario # scenario simulator (structured, grounded, directional)
app/api/chat      # grounded analyst chat
```

## On the data & discipline

Claims are paraphrased from public Oct 2025–May 2026 reporting of company disclosures;
every claim is tagged by source type and links out. The seed set is curated, not
exhaustive. CHOKE is a reasoning layer on top of the supply chain — directional by
design, not investment advice.

---

MS&E 435 final project · built with Claude Code.
