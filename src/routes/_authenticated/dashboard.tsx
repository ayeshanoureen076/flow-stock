import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  Brain,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/PageHeader";
import { ProductThumb } from "@/components/ProductThumb";
import { StatCard } from "@/components/StatCard";
import { currency, forecast, stockStatus } from "@/lib/demo-data";
import { useStore } from "@/lib/pos-store";
import { StatusPill } from "@/components/StatusPill";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — POSFlow AI" },
      {
        name: "description",
        content: "Live KPIs for products, sales, revenue, inventory value and forecast accuracy.",
      },
      { property: "og:title", content: "POSFlow AI Dashboard" },
      { property: "og:description", content: "Live retail KPIs and AI reorder recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { products, sales, lowStock } = useStore();
  const active = products.filter((p) => !p.archived);
  const inventoryValue = active.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0);
  const totalSales = sales.length;
  const monthRevenue = sales.slice(-30).reduce((sum, s) => sum + s.total, 0);

  const dailySeries = sales.slice(-14).map((s) => ({
    date: s.date.slice(5),
    revenue: Math.round(s.total),
  }));

  const recommendations = active
    .map((p) => ({ product: p, ...forecast(p) }))
    .filter((r) => r.recommendedQty > 0)
    .sort((a, b) => a.daysToStockout - b.daysToStockout)
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title="Store dashboard"
        subtitle="A single view of stock health, sales performance and what the AI agent wants you to order next."
        action={
          <Link
            to="/pos"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <ShoppingCart className="size-4" /> Open POS
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total products" value={active.length} icon={Package} hint="Active SKUs" index={0} />
        <StatCard label="Total sales" value={totalSales} icon={ShoppingCart} hint="Completed transactions" index={1} />
        <StatCard
          label="Monthly revenue"
          value={monthRevenue}
          prefix="$"
          icon={DollarSign}
          hint="Rolling 30 days"
          index={2}
        />
        <StatCard
          label="Inventory value"
          value={inventoryValue}
          prefix="$"
          icon={Boxes}
          hint="At purchase cost"
          index={3}
        />
        <StatCard
          label="Low stock products"
          value={lowStock.length}
          icon={AlertTriangle}
          hint="Below reorder point"
          index={4}
        />
        <StatCard
          label="Forecast accuracy"
          value={93.6}
          suffix="%"
          decimals={1}
          icon={TrendingUp}
          hint="Last 30 days vs actuals"
          index={5}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-2"
        >
          <h2 className="font-display text-lg font-semibold text-secondary">Daily revenue</h2>
          <p className="text-sm text-muted-foreground">Last 14 trading days</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySeries}>
                <defs>
                  <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary-deep)"
                  strokeWidth={2.5}
                  fill="url(#dashFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-secondary">
            <Brain className="size-4 text-primary" /> Smart reorder agent
          </h2>
          <ul className="mt-4 space-y-3">
            {recommendations.map((r) => (
              <li key={r.product.id} className="rounded-xl surface-soft p-3">
                <p className="text-sm font-semibold text-secondary">{r.product.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Expected to run out in {r.daysToStockout} days. Recommended reorder quantity:{" "}
                  {r.recommendedQty} units.
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-secondary">
                  <span>Confidence {r.confidence}%</span>
                  <span>Stockout {r.stockoutDate}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/forecast"
            className="mt-4 inline-block text-sm font-semibold text-secondary underline decoration-primary decoration-2 underline-offset-4"
          >
            Open forecasting engine
          </Link>
        </motion.section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-secondary">Stock warnings</h2>
          <Link to="/inventory" className="text-sm font-semibold text-secondary">
            View inventory
          </Link>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {lowStock.slice(0, 6).map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-border p-3 transition hover:border-primary"
            >
              <ProductThumb name={p.name} category={p.category} accent={p.accent} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-secondary">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.quantity} in stock · reorder at {p.reorderPoint} · {currency(p.sellingPrice)}
                </p>
              </div>
              <StatusPill status={stockStatus(p)} className="ml-auto" />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-secondary">Sales trend by week</h2>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={Array.from({ length: 6 }, (_, i) => ({
                week: `W${i + 1}`,
                revenue: Math.round(sales.slice(i * 7, i * 7 + 7).reduce((s, x) => s + x.total, 0)),
              }))}
            >
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis fontSize={12} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
