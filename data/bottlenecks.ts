// data/bottlenecks.ts
//
// Seed content. Every claim is paraphrased from real Oct 2025–May 2026 reporting
// of company disclosures; sources are linked. Verbatim quotes are kept <15 words.
// DO NOT invent additional quotes, numbers, or citations.

import type { BottleneckCard } from "./types";

export const bottlenecks: BottleneckCard[] = [
  // ───────────────────────────── Card 1 ─────────────────────────────
  {
    id: "hbm",
    name: "High-Bandwidth Memory",
    shortName: "HBM",
    category: "memory",
    stackLayer: "silicon",
    status: "tight",
    severity: 5,
    summary:
      "The big three (SK Hynix, Samsung, Micron) have sold out 2026 HBM supply. HBM3E dominates 2026 while HBM4 ramps — memory is sold before it's made.",
    mechanism:
      "HBM is the memory stacked next to AI accelerators. It consumes far more wafer area per bit than commodity DRAM, so as suppliers shift capacity to HBM, total DRAM output is structurally constrained — tightening both HBM and conventional DDR5 pricing. That cross-effect, HBM eating commodity DRAM capacity, is the real second-order trade.",
    evidence: [
      {
        claim:
          "SK Hynix sold out its entire 2026 memory lineup (DRAM/HBM/NAND); Q3 2025 operating profit ~₩11.4T (~$8B), up ~62% YoY.",
        sourceType: "Earnings",
        source: "SK Hynix Q3 2025 results",
        org: "Bloomberg",
        date: "2025-10-28",
        url: "https://www.bloomberg.com/news/articles/2025-10-28/sk-hynix-posts-record-profit-after-ai-boom-fuels-chip-demand",
      },
      {
        claim:
          "SK Hynix's HBM sales head said supply will stay short well into the AI buildout.",
        quote: "difficult for supply to catch up any time soon",
        sourceType: "News",
        source: "Kim Ki-tae, SK Hynix — via Reuters / TechSpot",
        org: "SK Hynix",
        date: "2025-10",
        url: "https://www.techspot.com/news/110058-sk-hynix-completely-sells-out-semiconductor-supply-ai.html",
      },
      {
        claim:
          "Micron began ahead-of-schedule HBM4 high-volume production; its entire 2026 HBM supply is already committed.",
        sourceType: "News",
        source: "Micron HBM4 ramp",
        org: "Micron / Yahoo Finance",
        date: "2026-02",
        url: "https://finance.yahoo.com/news/micron-early-hbm4-ramp-tests-071005340.html",
      },
      {
        claim:
          "SK Hynix signed a letter of intent with OpenAI to supply HBM for its compute buildout.",
        sourceType: "News",
        source: "SK Hynix–OpenAI LOI",
        org: "Benzinga",
        date: "2025-10",
        url: "https://www.benzinga.com/markets/tech/25/10/48485221",
      },
    ],
    longCandidates: [
      {
        name: "SK Hynix",
        ticker: "000660.KS",
        visibility: "public",
        thesis: "HBM share leader; 2026 sold out; primary NVIDIA supplier.",
      },
      {
        name: "Micron",
        ticker: "MU",
        visibility: "public",
        thesis: "Early HBM4 ramp + sold-out 2026 = pricing and margin tailwind.",
      },
      {
        name: "Hanmi Semiconductor",
        ticker: "042700.KQ",
        visibility: "public",
        thesis: "TC bonders for TSV/HBM stacking — picks-and-shovels.",
      },
      {
        name: "ASMPT",
        ticker: "0522.HK",
        visibility: "public",
        thesis: "Advanced bonding equipment exposure to HBM stacking.",
      },
    ],
    shortCandidates: [
      {
        name: "PC / smartphone OEMs",
        visibility: "public",
        thesis: "Commodity DRAM tightness inflates their bill of materials.",
      },
    ],
    watchList: [
      {
        name: "Samsung",
        ticker: "005930.KS",
        visibility: "public",
        thesis: "HBM4 qualification progress at NVIDIA — the swing factor.",
      },
      {
        name: "CXMT",
        visibility: "private",
        thesis: "China domestic HBM ambition; long-term supply-add risk.",
      },
    ],
    forwardCatalysts: [
      { event: "Samsung HBM4 qualification at NVIDIA", estDate: "2026 H2", effect: "loosens" },
      { event: "SK Hynix M15X fab pilot", estDate: "2026 H2", effect: "loosens" },
      { event: "HBM4E 1c-DRAM lines", estDate: "2027", effect: "loosens" },
    ],
    lastUpdated: "2026-06-04",
  },

  // ───────────────────────────── Card 2 ─────────────────────────────
  {
    id: "cowos",
    name: "CoWoS Advanced Packaging",
    shortName: "CoWoS",
    category: "packaging",
    stackLayer: "silicon",
    status: "tight",
    statusNote: "Capacity ramping fast, but demand still outpaces.",
    severity: 5,
    summary:
      "CoWoS bonds the GPU die to its HBM stacks on a silicon interposer — the step that turns fabricated dies into shippable accelerators. It's the narrowest pipe, and NVIDIA has reserved most of it.",
    mechanism:
      "Without CoWoS, a finished die can't become a functional product. TSMC is scaling CoWoS from ~35K wafers/month (late 2024) toward ~127–130K wpm by end-2026 (~4×, roughly 80% CAGR) — and reporting suggests that's still short of demand. Packaging is now considered nearly as hard and capital-intensive as fabrication itself.",
    evidence: [
      {
        claim:
          'NVIDIA is the CoWoS "anchor tenant," reportedly securing the majority (>60%) of 2025–2026 capacity.',
        sourceType: "News",
        source: "The Great Packaging Pivot",
        org: "FinancialContent",
        date: "2026-01",
        url: "https://markets.financialcontent.com/stocks/article/tokenring-2026-1-1-the-great-packaging-pivot",
      },
      {
        claim:
          "TSMC is scaling CoWoS ~35K → ~127–130K wafers/month by end-2026 (~4×) — still reportedly short of demand.",
        sourceType: "Research",
        source: "CoWoS expansion analysis",
        org: "SemiWiki / Tickeron",
        date: "2025–2026",
        url: "https://tickeron.com/blogs/taiwan-semiconductor-manufacturing-tsm-stock-review-cowos-expansion-fuels-the-ai-chip-wave-11593/",
      },
      {
        claim:
          "ASE (world's largest OSAT) expects advanced-packaging sales to roughly double in 2026; TSMC has outsourced simpler steps to ASE and Amkor.",
        sourceType: "News",
        source: "TSMC advanced packaging",
        org: "CNBC",
        date: "2026-04-08",
        url: "https://www.cnbc.com/2026/04/08/tsmc-nvidia-advanced-packaging-intel.html",
      },
      {
        claim:
          "At its May 2026 Technology Symposium, TSMC said it is rapidly expanding CoWoS + SoIC capacity amid 18 new fabs/packaging facilities worldwide.",
        sourceType: "News",
        source: "TSMC 2026 Technology Symposium",
        org: "DigiTimes",
        date: "2026-05-14",
        url: "https://www.digitimes.com/news/a20260514PD237",
      },
    ],
    longCandidates: [
      {
        name: "TSMC",
        ticker: "TSM",
        visibility: "public",
        thesis: "Owns the chokepoint; pricing power on advanced packaging.",
      },
      {
        name: "NVIDIA",
        ticker: "NVDA",
        visibility: "public",
        thesis: "Secured allocation = ships Blackwell/Rubin while rivals wait.",
      },
      {
        name: "ASE Technology",
        ticker: "ASX",
        visibility: "public",
        thesis: "OSAT; advanced-packaging sales roughly doubling in 2026.",
      },
      {
        name: "Amkor",
        ticker: "AMKR",
        visibility: "public",
        thesis: "OSAT overflow beneficiary as TSMC outsources steps.",
      },
    ],
    shortCandidates: [
      {
        name: "Accelerator challengers w/o secured CoWoS allocation",
        visibility: "public",
        thesis: "Supply-gated regardless of design wins.",
      },
    ],
    watchList: [
      {
        name: "AMD",
        ticker: "AMD",
        visibility: "public",
        thesis: "MI350/MI400 depend on CoWoS-S/SoIC; gated by incremental capacity.",
      },
      {
        name: "Intel",
        ticker: "INTC",
        visibility: "public",
        thesis: "Advanced-packaging / foundry comeback angle.",
      },
      {
        name: "Glass-substrate & panel-level packaging players",
        visibility: "public",
        thesis: "Next-gen capacity relief if qualified.",
      },
    ],
    forwardCatalysts: [
      { event: "Panel-level packaging / glass substrate qualification", estDate: "2026–27", effect: "loosens" },
      { event: "US domestic packaging (Arizona) coming online", estDate: "2026+", effect: "loosens" },
      { event: "Continued CoWoS capacity adds through 2026", estDate: "2026", effect: "loosens" },
    ],
    lastUpdated: "2026-06-04",
  },

  // ───────────────────────────── Card 3 ─────────────────────────────
  {
    id: "datacenter-power",
    name: "Datacenter Power & Grid Interconnect",
    shortName: "Power",
    category: "power",
    stackLayer: "infrastructure",
    status: "tight",
    statusNote: "Structural, multi-year.",
    severity: 5,
    summary:
      "The binding constraint has moved from the server rack to the substation. You can have chips and packaging and still not energize a campus — grid interconnection and heavy electrical gear have multi-year lead times.",
    mechanism:
      "IT hardware scales in 12–24 months; grids and heavy equipment (high-voltage transformers, turbines) take years to decades. ~2,300 GW of generation/storage sits in US interconnection queues — more than the entire installed US power capacity — with ~5-year average waits. Hyperscalers increasingly go 'bring your own power' (on-site gas, fuel cells, nuclear) to bypass the queue.",
    evidence: [
      {
        claim:
          "~2,300 GW of generation/storage sits in US interconnection queues — more than total installed US capacity — with ~5-year average waits.",
        sourceType: "Gov / Lab data",
        source: "LBNL interconnection queue data",
        org: "Lawrence Berkeley National Lab (via Hanwha)",
        date: "2026-02",
        url: "https://www.hanwhadatacenters.com/blog/data-center-grid-limitations-the-power-bottleneck/",
      },
      {
        claim:
          "Gartner projects ~40% of AI data centers will be operationally constrained by power deficits by 2027.",
        sourceType: "Research",
        source: "US Power Outlook (Gartner cited)",
        org: "Gartner / Mitsubishi Power",
        date: "2025-11",
        url: "https://power.mhi.com/regions/amer/insights/us-power-outlook-and-long-term-trends",
      },
      {
        claim:
          "PJM, the largest US grid, received ~800 interconnection requests (~220 GW) in its latest cycle, with multi-year processing.",
        sourceType: "News",
        source: "PJM interconnection strain",
        org: "TechCrunch",
        date: "2026-05-08",
        url: "https://techcrunch.com/2026/05/08/the-biggest-u-s-power-grid-is-under-strain-from-ai-and-no-one-is-happy/",
      },
      {
        claim:
          "Bring-your-own-power is accelerating: Caterpillar took a 2 GW genset order (Monarch, WV); Oracle's Project Jupiter pivoted to a 100% Bloom Energy islanded microgrid.",
        sourceType: "News",
        source: "Replacing diesel in AI-scale data centers",
        org: "DataCenterKnowledge",
        date: "2026",
        url: "https://www.datacenterknowledge.com/sustainability/replacing-diesel-in-ai-scale-data-centers-gas-engines-turbines-and-steam",
      },
    ],
    longCandidates: [
      {
        name: "GE Vernova",
        ticker: "GEV",
        visibility: "public",
        thesis: "Gas turbines + grid equipment; record backlog.",
      },
      {
        name: "Vertiv",
        ticker: "VRT",
        visibility: "public",
        thesis: "Power & thermal management infrastructure.",
      },
      {
        name: "Constellation",
        ticker: "CEG",
        visibility: "public",
        thesis: "IPP + nuclear powering data centers.",
      },
      {
        name: "Vistra",
        ticker: "VST",
        visibility: "public",
        thesis: "IPP + nuclear powering data centers.",
      },
      {
        name: "Bloom Energy",
        ticker: "BE",
        visibility: "public",
        thesis: "Fuel cells; 'speed to power' for off-grid campuses.",
      },
      {
        name: "Eaton",
        ticker: "ETN",
        visibility: "public",
        thesis: "Electrical equipment & grid buildout.",
      },
      {
        name: "Quanta Services",
        ticker: "PWR",
        visibility: "public",
        thesis: "Grid construction & electrical buildout.",
      },
    ],
    shortCandidates: [
      {
        name: "Power-constrained operators in saturated hubs",
        visibility: "public",
        thesis: "e.g. Northern Virginia — delay-driven cost/timeline risk.",
      },
    ],
    watchList: [
      {
        name: "SMR / nuclear developers",
        visibility: "public",
        thesis: "Multi-year supply relief if milestones land.",
      },
      {
        name: "Hitachi Energy / Siemens Energy",
        visibility: "public",
        thesis: "High-voltage transformer makers — supply gate.",
      },
      {
        name: "Caterpillar",
        ticker: "CAT",
        visibility: "public",
        thesis: "Gensets for BYOP campuses.",
      },
      {
        name: "Cummins",
        ticker: "CMI",
        visibility: "public",
        thesis: "Engines/gensets for off-grid power.",
      },
    ],
    forwardCatalysts: [
      { event: "PJM cluster-process reform → 1–2 yr agreements", estDate: "2026+", effect: "loosens" },
      { event: "Nuclear restarts / SMR milestones", estDate: "multi-year", effect: "loosens" },
      { event: "Transformer & turbine capacity adds", estDate: "2026+", effect: "loosens" },
      { event: "FERC interconnection reform", estDate: "2026+", effect: "loosens" },
    ],
    lastUpdated: "2026-06-04",
  },
];
