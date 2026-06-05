# Bottlechip — demo video script (≈2:00)

**Setup:** record the screen at https://bottlechip.vercel.app (1440-wide window, dark
room, full-screen browser). Generate the voiceover with ElevenLabs (`narrate.mjs`),
then drop the audio under the screen recording in iMovie / CapCut / Descript and nudge
the cuts to match. Record the on-screen actions roughly to the timings below.

> **On the live AI bits (simulator + chat):** they're real, so a take may return a
> slightly different read. That's honest — just narrate what's on screen. For a
> guaranteed take, run the scenario once before recording so the result is cached in
> your session.

## Clip timings (generated with the "Daniel" voice — 1:56 total)

| # | File | Length | Starts at |
|---|---|---|---|
| 1 | `01-open.mp3` | 0:15 | 0:00 |
| 2 | `02-workload.mp3` | 0:17 | 0:15 |
| 3 | `03-graph.mp3` | 0:19 | 0:32 |
| 4 | `04-simulator.mp3` | 0:28 | 0:51 |
| 5 | `05-freetext.mp3` | 0:21 | 1:19 |
| 6 | `06-close.mp3` | 0:15 | 1:40 |

Import the 6 clips in order; start each scene's on-screen action at its "Starts at"
time. For one combined file: `brew install ffmpeg`, then concat in the voiceover dir.

---

## Narration + on-screen cues

**[0:00 — Open]** · *on the BOTTLECHIP landing (just the Workload Lens)*
> This is Bottlechip — an investor terminal for the physical chokepoints of the AI
> buildout. The thesis is simple: value accrues to whoever owns the bottleneck.
> Bottlechip makes that legible.

**[0:15 — Workload Lens]** · *click "Video generation"*
> You start by picking a workload. Say you're looking at video generation — the heaviest
> workload there is. Instantly, all three chokepoints light up red and swell in size:
> memory, packaging, and power all tighten.

**[0:32 — Graph]** · *drag a node or two; click a chokepoint to open its evidence*
> This is the value chain as a live graph. Bubble size shows how much each chokepoint
> matters under the scenario. Drag the nodes to explore — and click any one to pull up
> its cited evidence: the mechanism, the sources, and who benefits.

**[0:51 — Simulator]** · *fire the "Intel fab capacity online" event chip*
> But the real engine is the simulator. Let's run something that isn't pre-baked — what
> if Intel brings major new fab capacity online? Bottlechip reasons through it live.
> Packaging eases and shrinks, because Intel becomes a credible second source to TSMC.
> The readout names who benefits — AMD, Amkor — and who's pressured — TSMC.

**[1:19 — Free-text + chat]** · *type a what-if (e.g. Hormuz), then scroll to the chat*
> You can simulate anything just by typing it — a China open-source model release, an
> ARM server CPU, a Strait of Hormuz shutdown. And the grounded analyst chat answers
> questions while refusing to invent a price target. It's directional, never predictive.

**[1:40 — Close]** · *pull back to the full terminal*
> Bottlechip turns scattered supply-chain signals into a bottleneck-to-beneficiary
> decision view — built end to end with Claude Code, with a live scenario engine on
> Claude Sonnet. Thanks for watching.

---

## Voiceover generation (ElevenLabs)

```bash
export ELEVENLABS_API_KEY=sk_...
node narrate.mjs --list                       # optional: pick a voice
export ELEVENLABS_VOICE_ID=onwK4e9ZLuTAKqWW03F9  # "Daniel" (default)
node narrate.mjs                              # → voiceover/01..06.mp3
```
