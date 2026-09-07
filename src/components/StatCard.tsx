import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { AnimatedCounter } from "./AnimatedCounter";

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  decimals,
  icon: Icon,
  hint,
  index = 0,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  hint?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-secondary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-secondary">
        <AnimatedCounter
          value={value}
          prefix={prefix ?? ""}
          suffix={suffix ?? ""}
          decimals={decimals ?? 0}
        />
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </motion.div>
  );
}
