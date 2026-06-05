// narrate.mjs — generate the demo voiceover with ElevenLabs.
//
//   export ELEVENLABS_API_KEY=sk_...
//   node narrate.mjs --list           # list available voices + their ids
//   node narrate.mjs                  # write voiceover/01..06.mp3
//
// Optional env: ELEVENLABS_VOICE_ID (default "Daniel"), ELEVENLABS_MODEL.

import { writeFileSync, mkdirSync } from "node:fs";

const API = "https://api.elevenlabs.io/v1";
const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.ELEVENLABS_VOICE_ID ?? "onwK4e9ZLuTAKqWW03F9"; // Daniel
const MODEL = process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2";
const OUT = new URL("./voiceover/", import.meta.url).pathname;

if (!KEY) {
  console.error("Set ELEVENLABS_API_KEY (elevenlabs.io → Profile → API key).");
  process.exit(1);
}

if (process.argv.includes("--list")) {
  const r = await fetch(`${API}/voices`, { headers: { "xi-api-key": KEY } });
  if (!r.ok) {
    console.error(`voices: ${r.status} ${await r.text()}`);
    process.exit(1);
  }
  const j = await r.json();
  for (const v of j.voices ?? []) {
    const l = v.labels ?? {};
    console.log(`${v.voice_id}  ${v.name.padEnd(16)} ${l.accent ?? ""} ${l.description ?? ""} ${l.use_case ?? ""}`);
  }
  process.exit(0);
}

const segments = [
  { id: "01-open", text: "This is Bottlechip — an investor terminal for the physical chokepoints of the AI buildout. The thesis is simple: value accrues to whoever owns the bottleneck. Bottlechip makes that legible." },
  { id: "02-workload", text: "You start by picking a workload. Say you're looking at video generation — the heaviest workload there is. Instantly, all three chokepoints light up red and swell in size: memory, packaging, and power all tighten." },
  { id: "03-graph", text: "This is the value chain as a live graph. Bubble size shows how much each chokepoint matters under the scenario. Drag the nodes to explore — and click any one to pull up its cited evidence: the mechanism, the sources, and who benefits." },
  { id: "04-simulator", text: "But the real engine is the simulator. Let's run something that isn't pre-baked — what if Intel brings major new fab capacity online? Bottlechip reasons through it live. Packaging eases and shrinks, because Intel becomes a credible second source to TSMC. The readout names who benefits — AMD, Amkor — and who's pressured — TSMC." },
  { id: "05-freetext", text: "You can simulate anything just by typing it — a China open-source model release, an ARM server C-P-U, a Strait of Hormuz shutdown. And the grounded analyst chat answers questions while refusing to invent a price target. It's directional, never predictive." },
  { id: "06-close", text: "Bottlechip turns scattered supply-chain signals into a bottleneck-to-beneficiary decision view — built end to end with Claude Code, with a live scenario engine on Claude Sonnet. Thanks for watching." },
];

mkdirSync(OUT, { recursive: true });
for (const s of segments) {
  const r = await fetch(`${API}/text-to-speech/${VOICE}`, {
    method: "POST",
    headers: {
      "xi-api-key": KEY,
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: s.text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
    }),
  });
  if (!r.ok) {
    console.error(`✗ ${s.id}: ${r.status} ${(await r.text()).slice(0, 200)}`);
    continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(`${OUT}${s.id}.mp3`, buf);
  console.log(`✓ ${s.id}.mp3  (${(buf.length / 1024).toFixed(0)} KB)`);
}
console.log(`\nDone → ${OUT}`);
