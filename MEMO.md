# Bottlechip — Final Project Memo

**MS&E 435 · Option 2 (Build)**

**Live demo:** https://choke-one.vercel.app · **Video:** https://youtu.be/KaA5OqBeEB4
**Code:** https://github.com/ms-d-kim/choke

*Bottlechip is an investor terminal for the AI buildout's physical chokepoints — HBM
memory, CoWoS packaging, and datacenter power. Pick the AI workload you care about, or
simulate any scenario, and watch the value chain re-color and re-size directionally,
with the beneficiaries and pressured names called out and every claim one click from its
source.*

---

## Why what you built is useful
The course thesis is that **value accrues to whoever owns the bottleneck.** That's true,
but the evidence for it is scattered across earnings calls, OSAT capacity notes, grid
interconnection queues, and geopolitics. Bottlechip compresses all of that into a single
**bottleneck → beneficiary decision view**, and adds a **scenario engine** that traces
the second-order effects of any event through the chain — directionally, with cited
evidence, in one click. It turns a vague hunch ("this probably tightens memory") into a
traceable, sourced, visual map.

## Who the ideal user is
A **generalist or thematic investor / analyst** — hedge fund, crossover, corp dev, or
sell-side — who has to reason quickly about AI-infrastructure second-order effects but
doesn't own a semiconductor PhD. Secondary users: founders and operators mapping their
own supply exposure, and journalists who want a structured mental model of the AI value
chain.

## Why they'll find it valuable / what problem it solves
**The problem:** an investor hears "China just dropped an open-source frontier model" and
has to reason manually — what does that do to HBM? to packaging? to power? to the names I
hold? Answering it means stitching together a dozen scattered, fast-moving sources.

**What Bottlechip does about it:**
- **Pick a workload** (coding agents, video generation, world models…) and the graph
  instantly shows that workload's chokepoint signature — which physical bottlenecks it
  stresses, sized by how much.
- **Simulate any scenario** — preset patterns/events *or* free-text — and a server-side
  model propagates it across the chain in seconds, re-coloring and re-sizing the graph
  and naming who benefits and who's pressured.
- **Click any node** for its mechanism and **cited evidence**, tagged by source type
  (earnings / news / research / gov data) and linked out — auditable, not a black box.
- **Directional, never predictive.** It deals in direction, color, and named drivers —
  never a fabricated return or price target. That discipline is exactly how a thoughtful
  PM reasons *before* building a model, and it's what keeps the tool credible.

The differentiation vs. existing status dashboards (e.g. Silicon Analysts) is the
**reasoning layer**: a bottleneck→beneficiary graph that re-shapes to *any* event, with
the evidence built into the nodes. We don't out-data the dashboards — we out-reason them.

## How you might monetize it
- **Prosumer SaaS ($30–100/mo):** individual analysts / retail-pro — unlimited scenario
  simulations plus alerts when a chokepoint's status flips.
- **Fund / team seats ($500–2k/seat/yr):** shared watchlists, the desk's own names run
  through the simulator, collaboration.
- **Data / API:** license the bottleneck→beneficiary graph and the scenario engine to
  other research and fintech tools.
- **Premium research:** human-curated deep-dives sitting behind the directional layer.

The wedge is the **simulator** — sticky and repeat-use; the moat is the **curated graph +
sourced evidence**. Marginal cost is low: static seed data and one server-side LLM call
per simulation.

---

## How AI was used
Built **end-to-end with Claude Code (Claude Opus)** — scaffolding, the TypeScript data
model, the directional scenario engine, the d3-force graph, the UI, and the animations.
At runtime, the **scenario simulator and analyst chat call Claude Sonnet 4.6 via
OpenRouter** (server-side, key never exposed), with the seed data injected as context and
the model hard-constrained to stay directional — no returns, no price targets. Stack:
Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · d3-force · Vercel. The demo voiceover
was generated with the **ElevenLabs** API. Evidence was researched against real Oct
2025–May 2026 reporting and hand-verified; the AI did **not** fabricate citations.

## Honest limitation
Curated seed data (3 chokepoints, ~12 graph names), not a live feed — a reasoning layer
on top of the supply chain. Directional by design, not investment advice.
