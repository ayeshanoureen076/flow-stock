import { cn } from "@/lib/utils";

const ICONS: Record<string, string> = {
  Beverages: "☕",
  Grocery: "🫙",
  Pharmacy: "💊",
  Household: "🧼",
  "Personal Care": "🧴",
  Snacks: "🍪",
};

export function ProductThumb({
  name,
  category,
  accent = "primary",
  className,
}: {
  name: string;
  category: string;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      aria-label={name}
      role="img"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-lg",
        accent === "primary" ? "bg-accent" : "surface-soft",
        className,
      )}
    >
      <span aria-hidden>{ICONS[category] ?? "📦"}</span>
    </div>
  );
}
