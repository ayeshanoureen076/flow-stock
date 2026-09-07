import type { StockStatus } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function StatusPill({ status, className }: { status: StockStatus; className?: string }) {
  const styles: Record<StockStatus, string> = {
    Healthy: "bg-accent text-secondary border-border",
    "Low Stock": "bg-primary/25 text-secondary border-primary",
    "Critical Stock": "bg-destructive/10 text-destructive border-destructive/40",
  };
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
