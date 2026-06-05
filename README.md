# Bottlechip

**An investor terminal for the AI buildout's physical chokepoints.**

The thesis: value accrues to whoever owns the bottleneck. Bottlechip maps the AI
supply chain's chokepoints (HBM memory, CoWoS packaging, datacenter power) as an
interactive graph, lets you **simulate any scenario**, and re-shades the chain
**directionally**.

> **Directional, not predictive.** Bottlechip shows the *direction* a scenario pushes
> each chokepoint — colors, sizes, and words, never point-estimate returns.

**Live:** https://bottlechip.vercel.app

## The flow

1. **Workload Lens** — pick the AI workload you're building or investing in (coding
   agents, voice agents, video generation, autonomous driving, world models,
   recommenders). The terminal unfolds, re-shaped to that workload's chokepoint
   signature.
2. **Value-chain graph** — an Obsidian-style force network. Chokepoint nodes
   **re-color** (red = tightening, green = easing) and **re-size** (bigger = more
   stressed) under the scenario. Drag nodes; **click any node for its cited evidence**
   (mechanism, sources tagged + linked, beneficiary map, catalysts).
3. **Scenario console** — fire a preset pattern (test-time compute, long context,
   agentic), a preset event (China OSS model, NVIDIA Rubin, ARM server CPU, Hormuz,
   Intel fab…), or **type any what-if**. A server-side model traces the second-order
   effects across the chain; the graph updates live.
4. **Analyst chat** — ask about the chokepoints; answers are grounded in the data and
   stay directional.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · d3-force · deployed on
Vercel. Seed content is static in [`/data`](./data). The scenario simulator and chat
call Claude Sonnet 4.6 via OpenRouter (server-side; key in `OPENROUTER_API_KEY`).

## Run locally

```bash
npm install
cp .env.example .env.local   # add OPENROUTER_API_KEY for the simulator/chat
npm run dev
npm run validate             # check seed data + live evidence URLs
```

## Project structure

```
data/                # types + seed content (bottlenecks, trends, events, graph, workloads)
lib/scenario.ts      # the directional engine (re-shade impacts)
lib/visuals.ts       # the status color system + source-type tags
components/          # graph, lens, console, readout, chokepoint-detail, chat, header, anim
app/api/scenario     # scenario simulator (structured, grounded, directional)
app/api/chat         # grounded analyst chat
```

## On the data & discipline

Claims are paraphrased from public Oct 2025–May 2026 reporting of company disclosures;
every claim is tagged by source type and links out. Curated, not exhaustive — a
reasoning layer on top of the supply chain, directional by design, not investment
advice.

---

MS&E 435 final project · built with Claude Code.
