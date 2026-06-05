// app/api/chat/route.ts
//
// Grounded analyst chat via OpenRouter (OpenAI-compatible). The card/trend/
// portfolio data is injected as a system context; the model is hard-constrained
// to stay directional (no returns). Key lives only in OPENROUTER_API_KEY
// (server-side env), never on the client.

import { bottlenecks, trends, defaultPortfolio } from "@/data";

const MODEL = process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4.6";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type ChatMessage = { role: "user" | "assistant"; content: string };

// Compact, model-readable snapshot of the seed data.
const GROUNDING = JSON.stringify(
  {
    bottlenecks: bottlenecks.map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category,
      stackLayer: b.stackLayer,
      status: b.status,
      severity: b.severity,
      summary: b.summary,
      mechanism: b.mechanism,
      evidence: b.evidence.map((e) => ({
        claim: e.claim,
        quote: e.quote,
        org: e.org,
        date: e.date,
      })),
      longCandidates: b.longCandidates.map((p) => ({ name: p.name, ticker: p.ticker, thesis: p.thesis })),
      costPressured: b.shortCandidates.map((p) => ({ name: p.name, thesis: p.thesis })),
      watchList: b.watchList.map((p) => ({ name: p.name, ticker: p.ticker, thesis: p.thesis })),
      forwardCatalysts: b.forwardCatalysts,
    })),
    workloadTrends: trends.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      note: t.note,
      impacts: t.impacts,
    })),
    presetPortfolio: {
      name: defaultPortfolio.name,
      positions: defaultPortfolio.positions,
    },
  },
  null,
  0,
);

const SYSTEM_PROMPT = `You are the analyst assistant for Bottlechip, an AI supply-chain bottleneck → beneficiary tracker built for investors.

Hard rules:
- Answer ONLY from the DATA provided below. If the data doesn't cover it, say so plainly — do not invent companies, numbers, or sources.
- You are DIRECTIONAL, not predictive. NEVER give point-estimate returns, price targets, percentage moves, or any fabricated figure. Speak in status (tight / easing / loose), severity (1–5), and direction (tightening / easing, positive / negative lean).
- If asked to predict a return, price, or "how much," decline and reframe directionally: which chokepoint is involved, who benefits or is pressured, and what would change the call.
- Be concise and investor-toned — at most 3 short sentences of plain prose. Do NOT use markdown headers, tables, bullet lists, or emoji; write in flowing prose. Name chokepoints and beneficiaries explicitly; cite one evidence source by org when it strengthens the point.
- This is research tooling, not investment advice.

DATA (the only ground truth you may use):
${GROUNDING}`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Chat is not configured — OPENROUTER_API_KEY is not set." },
      { status: 503 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12); // keep recent turns

  if (!history.length || history[history.length - 1].role !== "user") {
    return Response.json({ error: "Expected a trailing user message." }, { status: 400 });
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
        max_tokens: 320,
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return Response.json(
        { error: `Upstream error (${res.status}).`, detail: detail.slice(0, 500) },
        { status: 502 },
      );
    }

    const data = await res.json();
    const reply: string =
      data?.choices?.[0]?.message?.content?.trim() || "(no response)";

    return Response.json({ reply });
  } catch (err) {
    return Response.json(
      { error: "Failed to reach the model.", detail: String(err).slice(0, 300) },
      { status: 502 },
    );
  }
}
