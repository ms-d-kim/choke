// scripts/validate.ts — `npm run validate`
//
// Guards the seed data: portfolio weights, full chokepoint coverage for every
// trend/workload, quote length, source types, graph integrity, and (the one that
// would have caught the FinancialContent 404) live reachability of every evidence URL.

import {
  bottlenecks,
  trends,
  workloads,
  portfolios,
  graphNodes,
  graphLinks,
} from "../data/index";

const errors: string[] = [];
const warns: string[] = [];

const bIds = new Set(bottlenecks.map((b) => b.id));
const REQUIRED = ["hbm", "cowos", "datacenter-power"];
const VALID_SOURCE_TYPES = new Set([
  "Earnings",
  "News",
  "Research",
  "Gov / Lab data",
  "Filing",
  "Press release",
]);

// 1. portfolio weights sum to 100; primary bottlenecks exist
for (const p of portfolios) {
  const sum = p.positions.reduce((n, x) => n + x.weight, 0);
  if (sum !== 100) errors.push(`Portfolio "${p.id}" weights sum to ${sum}, not 100.`);
  for (const pos of p.positions)
    if (!bIds.has(pos.primaryBottleneck))
      errors.push(`Portfolio "${p.id}" ${pos.ticker} → unknown bottleneck "${pos.primaryBottleneck}".`);
}

// 2. every trend + workload covers all chokepoints and references valid ids
function checkImpacts(label: string, ids: string[]) {
  for (const req of REQUIRED)
    if (!ids.includes(req)) errors.push(`${label} is missing an impact for "${req}".`);
  for (const id of ids)
    if (!bIds.has(id)) errors.push(`${label} references unknown bottleneck "${id}".`);
}
for (const t of trends) checkImpacts(`Trend "${t.id}"`, t.impacts.map((i) => i.bottleneckId));
for (const w of workloads) checkImpacts(`Workload "${w.id}"`, w.impacts.map((i) => i.bottleneckId));

// 3. evidence: source type, quote length, url shape — collect urls
const urls: { url: string; where: string }[] = [];
for (const b of bottlenecks) {
  for (const e of b.evidence) {
    if (!VALID_SOURCE_TYPES.has(e.sourceType))
      errors.push(`${b.id}: bad sourceType "${e.sourceType}".`);
    if (e.quote) {
      const wc = e.quote.trim().split(/\s+/).length;
      if (wc > 15) warns.push(`${b.id}: quote is ${wc} words (>15): "${e.quote}".`);
    }
    if (!/^https?:\/\//.test(e.url)) errors.push(`${b.id}: malformed url "${e.url}".`);
    else urls.push({ url: e.url, where: `${b.id} / ${e.org}` });
  }
}

// 4. graph integrity
const nIds = new Set(graphNodes.map((n) => n.id));
for (const l of graphLinks) {
  if (!nIds.has(l.source as string)) errors.push(`Graph link source "${l.source}" is not a node.`);
  if (!nIds.has(l.target as string)) errors.push(`Graph link target "${l.target}" is not a node.`);
}
for (const n of graphNodes)
  if (n.type === "company" && n.chokepoint && !bIds.has(n.chokepoint))
    errors.push(`Graph node "${n.id}" → unknown chokepoint "${n.chokepoint}".`);

// 5. URL reachability
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
async function status(u: string): Promise<number | string> {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch(u, { redirect: "follow", headers: { "user-agent": UA }, signal: ctrl.signal });
    return r.status;
  } catch (e) {
    return `ERR ${String(e).slice(0, 40)}`;
  } finally {
    clearTimeout(to);
  }
}

void (async () => {
console.log(`Checking ${urls.length} evidence URLs…`);
const results = await Promise.all(
  urls.map(async (x) => ({ ...x, st: await status(x.url) })),
);
for (const r of results) {
  const n = typeof r.st === "number" ? r.st : -1;
  const ok = n >= 200 && n < 400;
  // 401/403/429 or a network-level failure from this headless check are usually
  // bot-blocking or TLS quirks, not dead links — warn (verify in browser), don't fail.
  const uncertain = n === 401 || n === 403 || n === 429 || typeof r.st !== "number";
  const mark = ok ? "✓" : uncertain ? "?" : "✗";
  console.log(`  ${mark} ${r.st}  ${r.where}`);
  if (ok) continue;
  if (uncertain) warns.push(`URL ${r.st} (verify in browser) — ${r.where} — ${r.url}`);
  else errors.push(`URL ${r.st} — ${r.where} — ${r.url}`);
}

// report
console.log("\n" + "=".repeat(56));
if (warns.length) {
  console.log(`\n⚠️  ${warns.length} warning(s):`);
  warns.forEach((w) => console.log("   - " + w));
}
if (errors.length) {
  console.log(`\n❌ ${errors.length} error(s):`);
  errors.forEach((e) => console.log("   - " + e));
  process.exit(1);
} else {
  console.log(`\n✅ seed data valid${warns.length ? " (with warnings)" : ""}.`);
}
})();
