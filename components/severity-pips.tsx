import { cn } from "@/lib/utils";

export function SeverityPips({
  value,
  tone = "bg-tight",
  className,
}: {
  value: number;
  tone?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-[3px]", className)}
      aria-label={`Severity ${value} of 5`}
      title={`Severity ${value}/5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-3.5 w-1.5 rounded-[1px] transition-colors",
            i < value ? tone : "bg-foreground/10",
          )}
        />
      ))}
    </div>
  );
}
