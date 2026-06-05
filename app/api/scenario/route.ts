// app/api/scenario/route.ts
//
// Scenario simulator. Takes a free-text "what if" (e.g. "Intel brings new fab
// capacity online") and returns a STRUCTURED directional read across the three
// chokepoints — tighten/ease per node, narrative, beneficiaries, pressured,
// risks. Directional only: no returns, no price targets. Grounded in seed data.

import { bottlenecks, graphNodes } from "@/data";
import type { Direction, Scenario, ScenarioImpact } from "@/data";

const MODEL = process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4.6";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const CHOKEPOINT_IDS = ["hbm", "cowos", "datacenter-power"] as const;
const VALID: Direction[] = [
  "strong_positive",
  "positive",
  "neutral",
  "negative",
  "strong_negative",
];

const GROUNDING = JSON.stringify({
  chokepoints: bottlenecks.map((b) => ({
    id: b.id,
    name: b.name,
    status: b.status,
    severity: b.severity,
    mechanism: b.mechanism,
    beneficiaries: b.longCandidates.map((p) => ({ name: p.name, ticker: p.ticker })),
    costPressured: b.shortCandidates.map((p) => p.name),
    watch: b.watchList.map((p) => ({ name: p.name, ticker: p.ticker })),
  })),
  namesInGraph: graphNodes
    .filter((n) => n.type === "company")
    .map((n) => ({ name: n.name, ticker: n.label, chokepoint: n.chokepoint })),
});

const SYSTEM = `You are Bottlechip's scenario simulator for investors. Given a hypothetical event, trace how it propagates through three physical AI-buildout chokepoints — HBM (memory), CoWoS (packaging), datacenter power — and who benefits or is pressured.

Rules:
- DIRECTIONAL ONLY. Never give returns, price targets, percentages, or fabricated figures. Use tighten/ease language and the named companies from the DATA.
- "push" is the effect on that chokepoint's TIGHTNESS: positive = the constraint binds harder (tightens); negative = it eases. Reason carefully — some events ease a chokepoint (e.g. a credible second-source fab eases packaging).
- Prefer companies that appear in the DATA. You may name an obvious one that's missing, but do not invent tickers.
- Keep it grounded and concise.

Return ONLY a JSON object, no prose, exactly this shape:
{
  "label": "<= 5 word headline",
  "impacts": [
    {"bottleneckId":"hbm","push":"strong_positive|positive|neutral|negative|strong_negative","why":"one clause"},
    {"bottleneckId":"cowos","push":"...","why":"..."},
    {"bottleneckId":"datacenter-power","push":"...","why":"..."}
  ],
  "narrative":"2-4 sentence directional walk-through naming beneficiaries and pressured names",
  "beneficiaries":[{"name":"...","ticker":"... or null","why":"one clause"}],
  "pressured":[{"name":"...","ticker":"... or null","why":"one clause"}],
  "risks":["one or two directional risks / what would change the call"]
}

DATA:
${GROUNDING}`;

function coercePush(v: unknown): Direction {
  return typeof v === "string" && (VALID as string[]).includes(v)
    ? (v as Direction)
    : "neutral";
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Simulator not configured — OPENROUTER_API_KEY is not set." },
      { status: 503 },
    );
  }

  let body: { prompt?: string; label?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const prompt = (body.prompt ?? "").trim();
  if (!prompt) {
    return Response.json({ error: "Describe a scenario to simulate." }, { status: 400 });
  }

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://bottlechip.vercel.app",
        "X-Title": "Bottlechip",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        temperature: 0.3,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Simulate: ${prompt}` },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return Response.json(
        { error: `Upstream error (${res.status}).`, detail: detail.slice(0, 400) },
        { status: 502 },
      );
    }

    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(match ? match[0] : raw);
    } catch {
      return Response.json(
        { error: "Model returned unparseable output. Try rephrasing." },
        { status: 502 },
      );
    }

    // Normalize impacts → exactly one per chokepoint.
    const byId: Record<string, ScenarioImpact> = {};
    for (const it of Array.isArray(parsed.impacts) ? parsed.impacts : []) {
      const o = it as Record<string, unknown>;
      const id = String(o.bottleneckId);
      if ((CHOKEPOINT_IDS as readonly string[]).includes(id)) {
        byId[id] = {
          bottleneckId: id,
          push: coercePush(o.push),
          why: String(o.why ?? "").slice(0, 240),
        };
      }
    }
    const impacts: ScenarioImpact[] = CHOKEPOINT_IDS.map(
      (id) => byId[id] ?? { bottleneckId: id, push: "neutral", why: "Limited direct effect." },
    );

    const cleanActors = (arr: unknown): Scenario["beneficiaries"] =>
      (Array.isArray(arr) ? arr : []).slice(0, 5).map((a) => {
        const o = a as Record<string, unknown>;
        const ticker = o.ticker == null || o.ticker === "null" ? undefined : String(o.ticker);
        return { name: String(o.name ?? "").slice(0, 60), ticker, why: String(o.why ?? "").slice(0, 200) };
      });

    const scenario: Scenario = {
      id: `sim-${prompt.slice(0, 24).replace(/\W+/g, "-").toLowerCase()}`,
      label: String(parsed.label ?? body.label ?? prompt).slice(0, 60),
      kind: "custom",
      description: prompt,
      impacts,
      narrative: String(parsed.narrative ?? "").slice(0, 1200),
      beneficiaries: cleanActors(parsed.beneficiaries),
      pressured: cleanActors(parsed.pressured),
      risks: (Array.isArray(parsed.risks) ? parsed.risks : [])
        .slice(0, 3)
        .map((r) => String(r).slice(0, 240)),
      origin: "model",
    };

    return Response.json({ scenario });
  } catch (err) {
    return Response.json(
      { error: "Failed to reach the simulator.", detail: String(err).slice(0, 300) },
      { status: 502 },
    );
  }
}
