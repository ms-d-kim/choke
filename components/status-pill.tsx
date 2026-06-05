import { cn } from "@/lib/utils";
import { statusMeta } from "@/lib/visuals";
import type { Status } from "@/data";

export function StatusPill({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const m = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase",
        m.chip,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
