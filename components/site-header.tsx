import { statusMeta } from "@/lib/visuals";
import { cn } from "@/lib/utils";
import { bottlenecks, trends, type Status } from "@/data";

export function SiteHeader() {
  return (
    <header>
      {/* top bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-lg font-bold tracking-tight">
              CHOKE
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:inline">
              bottleneck → beneficiary
            </span>
          </div>
          <Legend />
        </div>
      </div>

      {/* hero / thesis */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          AI supply-chain bottleneck tracker · investor lens
        </p>
        <h1 className="mt-3 max-w-3xl text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          Value accrues to whoever owns the bottleneck.
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Choke tracks the physical chokepoints of the AI buildout — memory,
          packaging, power — maps who benefits and who&apos;s pressured when each
          one tightens, and lets you re-shade a book directionally under a chosen
          workload trend.
        </p>
        <StatStrip />
      </div>
    </header>
  );
}

function StatStrip() {
  const sources = bottlenecks.reduce((n, b) => n + b.evidence.length, 0);
  const names = bottlenecks.reduce(
    (n, b) =>
      n + b.longCandidates.length + b.shortCandidates.length + b.watchList.length,
    0,
  );
  const stats = [
    { label: "Chokepoints", value: bottlenecks.length },
    { label: "Names mapped", value: names },
    { label: "Sources cited", value: sources },
    { label: "Scenarios", value: trends.length },
  ];
  return (
    <dl className="mt-6 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-3 border-t border-border pt-5 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {s.label}
          </dt>
          <dd className="mt-0.5 font-mono text-2xl font-semibold tabular-nums">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Legend() {
  const order: Status[] = ["tight", "easing", "loose"];
  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-3 md:flex">
        {order.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
          >
            <span className={cn("h-2 w-2 rounded-full", statusMeta[s].dot)} />
            {statusMeta[s].label}
          </span>
        ))}
      </div>
      <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        directional · not predictive
      </span>
    </div>
  );
}
