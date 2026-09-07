import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  Brain,
  Building2,
  PlayCircle,
  RefreshCcw,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { AnimatedCounter } from "@/components/AnimatedCounter";
import { monthlyRevenue } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POSFlow AI — AI-Powered POS & Inventory Management" },
      {
        name: "description",
        content:
          "POSFlow AI unifies point of sale, inventory tracking, low-stock alerts and AI demand forecasting for retail stores, pharmacies and warehouses.",
      },
      { property: "og:title", content: "POSFlow AI — AI-Powered POS & Inventory Management" },
      {
        property: "og:description",
        content:
          "Process sales, prevent stockouts and forecast demand with intelligent automation and smart reordering.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Boxes,
    title: "Smart Inventory Tracking",
    body: "Live stock counts across every aisle, shelf and warehouse bin with instant valuation.",
  },
  {
    icon: Brain,
    title: "AI Demand Forecasting",
    body: "Seasonality, trend and velocity models predict next week and next month demand.",
  },
  {
    icon: Bell,
    title: "Low Stock Alerts",
    body: "Healthy, low and critical thresholds trigger alerts before a shelf ever runs dry.",
  },
  {
    icon: RefreshCcw,
    title: "Smart Reordering",
    body: "An always-on agent recommends order quantities with confidence scores.",
  },
  {
    icon: ShoppingCart,
    title: "POS Billing System",
    body: "Barcode and SKU search, discounts, taxes and instant receipts in one terminal.",
  },
  {
    icon: Truck,
    title: "Supplier Management",
    body: "Track suppliers, lead times, order history and spend from a single record.",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    body: "Daily, weekly and monthly revenue growth plus product performance breakdowns.",
  },
  {
    icon: Building2,
    title: "Multi-Store Support",
    body: "Roll up several locations, compare performance and transfer stock between them.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
          <span className="flex size-9 items-center justify-center rounded-xl gradient-primary font-display text-sm font-bold text-primary-foreground">
            PF
          </span>
          <span className="font-display text-lg font-bold text-secondary">POSFlow AI</span>
          <nav className="ml-8 hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-secondary">
              Features
            </a>
            <a href="#intelligence" className="transition hover:text-secondary">
              AI Engine
            </a>
            <a href="#metrics" className="transition hover:text-secondary">
              Results
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/auth"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-accent"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-105"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-40" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
              <Sparkles className="size-3.5" /> Built for inventory teams
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-secondary sm:text-5xl lg:text-6xl">
              AI-Powered POS &amp; Inventory Management
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Manage inventory, process sales, prevent stockouts, and forecast demand with
              intelligent automation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-105"
              >
                Start Free Trial <ArrowRight className="size-4" />
              </Link>
              <a
                href="#intelligence"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-accent"
              >
                <PlayCircle className="size-4" /> Watch Demo
              </a>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                { k: "Forecast accuracy", v: 94, s: "%" },
                { k: "Stockouts avoided", v: 3200, s: "+" },
                { k: "Stores live", v: 780, s: "" },
              ].map((it) => (
                <div key={it.k} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <dt className="text-xs text-muted-foreground">{it.k}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-secondary">
                    <AnimatedCounter value={it.v} suffix={it.s} />
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <HeroPreview />
        </div>
      </section>

      <section id="features" className="border-y border-border bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="max-w-2xl font-display text-3xl font-bold text-secondary sm:text-4xl">
            Everything a retail operation needs, in one workspace
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            From the register to the stockroom, POSFlow AI keeps every number in sync and every
            decision informed.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.06, duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-secondary transition group-hover:gradient-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-secondary">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="intelligence" className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-secondary sm:text-4xl">
              The Smart Reorder Agent never sleeps
            </h2>
            <p className="mt-4 text-muted-foreground">
              POSFlow AI continuously reads sales velocity, seasonality and supplier lead times, then
              tells your team exactly what to order and when.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Arabica Coffee Beans will run out in 6 days — reorder 200 units (confidence 93%)",
                "Ceylon Black Tea is critical — 8 units left against a 25-unit reorder point",
                "Pharmacy category demand rises 18% next month — pre-order early",
              ].map((line) => (
                <li
                  key={line}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-secondary shadow-card"
                >
                  <Brain className="mt-0.5 size-4 shrink-0 text-primary" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border bg-card p-6 shadow-float"
          >
            <p className="text-sm font-semibold text-secondary">Revenue vs cost — last 6 months</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                  />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="cost" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="metrics" className="border-t border-border gradient-brown py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-secondary-foreground">
              Start selling smarter today
            </h2>
            <p className="mt-2 max-w-xl text-secondary-foreground/80">
              Free 14-day trial with full demo inventory, POS terminal and forecasting engine.
            </p>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Start Free Trial <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 POSFlow AI. Smart POS &amp; inventory management.</p>
          <p>Yellow, brown and white — built for the shop floor.</p>
        </div>
      </footer>
    </div>
  );
}

function HeroPreview() {
  const spark = monthlyRevenue.map((m) => ({ month: m.month, revenue: m.revenue }));
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative"
    >
      <div className="rounded-3xl border border-border bg-card p-5 shadow-float">
        <div className="flex items-center justify-between">
          <p className="font-display font-semibold text-secondary">Store overview</p>
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
            Live
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { k: "Products", v: 1284 },
            { k: "Revenue", v: 84350, p: "$" },
            { k: "Low stock", v: 6 },
          ].map((it) => (
            <div key={it.k} className="rounded-2xl surface-soft p-3">
              <p className="text-xs text-muted-foreground">{it.k}</p>
              <p className="mt-1 font-display text-lg font-bold text-secondary">
                <AnimatedCounter value={it.v} prefix={it.p ?? ""} />
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-40 rounded-2xl border border-border p-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark}>
              <defs>
                <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" hide />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary-deep)"
                strokeWidth={2}
                fill="url(#heroFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute -left-4 bottom-8 hidden w-56 rounded-2xl border border-border bg-card p-4 shadow-float sm:block"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI prediction
        </p>
        <p className="mt-1 text-sm font-semibold text-secondary">
          Coffee Beans: 240 units needed next month
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Confidence 93%</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
        className="absolute -right-3 -top-6 hidden w-48 rounded-2xl border border-border bg-card p-4 shadow-float sm:block"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Low stock alert
        </p>
        <p className="mt-1 text-sm font-semibold text-secondary">Ceylon Black Tea — 8 left</p>
      </motion.div>
    </motion.div>
  );
}
