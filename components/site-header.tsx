import { statusMeta } from "@/lib/visuals";
import { cn } from "@/lib/utils";
import { Scramble } from "@/components/anim";
import { bottlenecks, eventPresets, trends, type Status } from "@/data";

const NAV = [
  { href: "#lens", label: "LENS" },
  { href: "#sim", label: "SIM" },
  { href: "#map", label: "MAP" },
  { href: "#chat", label: "CHAT" },
];

export function SiteHeader() {
  return (
    <header>
      {/* function bar */}
      <div className="sticky top-0 z-30 border-b border-amber/25 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-3 px-3 sm:px-4">
          <div className="flex items-center gap-3">
            <span className="rounded bg-amber px-3 py-1.5 font-mono text-xl font-bold leading-none tracking-[0.08em] text-background shadow-[0_0_22px_rgba(34,211,238,0.6)]">
              <Scramble text="BOTTLECHIP" />
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:inline">
              AI supply-chain terminal
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-xs px-2 py-1 font-mono text-[11px] tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-amber"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Legend />
            <span className="flex items-center gap-1.5 rounded-xs border border-loose/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-loose">
              <span className="size-1.5 animate-pulse rounded-full bg-loose" />
              live
            </span>
          </div>
        </div>
      </div>

      {/* thesis + stats strip */}
      <div className="border-b border-border bg-card/40">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p className="max-w-2xl text-sm leading-relaxed">
            <Scramble
              className="font-semibold text-amber"
              text="Value accrues to whoever owns the bottleneck."
            />{" "}
            <span className="text-muted-foreground">
              Map the chokepoints, simulate any scenario, watch the chain re-shade.
            </span>
          </p>
          <StatStrip />
        </div>
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
    { label: "Chokepoints", value: `${bottlenecks.length}` },
    { label: "Names", value: `${names}` },
    { label: "Sources", value: `${sources}` },
    { label: "Scenarios", value: `${trends.length + eventPresets.length}+` },
  ];
  return (
    <dl className="flex shrink-0 items-stretch divide-x divide-border border border-border">
      {stats.map((s) => (
        <div key={s.label} className="px-3 py-1">
          <dt className="term-label">{s.label}</dt>
          <dd className="font-mono text-lg font-semibold leading-tight tabular-nums text-foreground">
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
    <div className="hidden items-center gap-2.5 lg:flex">
      {order.map((s) => (
        <span
          key={s}
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          <span className={cn("size-1.5 rounded-full", statusMeta[s].dot)} />
          {statusMeta[s].label}
        </span>
      ))}
    </div>
  );
}
