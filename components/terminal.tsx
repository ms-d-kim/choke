import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("border border-border bg-card", className)}>
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  sub,
  right,
  accent = true,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-1.5">
      <div className="flex items-baseline gap-2 truncate">
        <span
          className={cn(
            "font-mono text-xs font-semibold uppercase tracking-[0.12em]",
            accent ? "text-amber" : "text-foreground",
          )}
        >
          {title}
        </span>
        {sub && (
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {sub}
          </span>
        )}
      </div>
      {right}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-xs border px-2.5 py-1 font-mono text-xs transition-colors",
        active
          ? "border-amber bg-amber text-primary-foreground"
          : "border-border bg-secondary/50 text-foreground/80 hover:border-amber/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
