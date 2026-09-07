import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, CreditCard, Minus, Plus, Printer, Search, Trash2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { ProductThumb } from "@/components/ProductThumb";
import { currency, type Sale } from "@/lib/demo-data";
import { useStore } from "@/lib/pos-store";

export const Route = createFileRoute("/_authenticated/pos")({
  head: () => ({
    meta: [
      { title: "POS Terminal — POSFlow AI" },
      {
        name: "description",
        content:
          "Fast checkout with barcode and SKU search, discounts, taxes, multiple payment methods and instant receipts.",
      },
      { property: "og:title", content: "POS Terminal — POSFlow AI" },
      { property: "og:description", content: "Ring up sales in seconds and print receipts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PosPage,
});

type Line = { productId: string; name: string; price: number; qty: number };
type Receipt = {
  id: string;
  lines: Line[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  method: Sale["method"];
  at: string;
};

const METHODS: { key: Sale["method"]; icon: typeof Banknote }[] = [
  { key: "Cash", icon: Banknote },
  { key: "Card", icon: CreditCard },
  { key: "Digital Wallet", icon: Wallet },
];

function PosPage() {
  const { products, settings, recordSale } = useStore();
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [discountPct, setDiscountPct] = useState(0);
  const [method, setMethod] = useState<Sale["method"]>("Card");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const results = useMemo(() => {
    const list = products.filter((p) => !p.archived);
    if (!query.trim()) return list.slice(0, 12);
    const q = query.toLowerCase();
    return list
      .filter((p) => `${p.name} ${p.sku} ${p.barcode}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [products, query]);

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discount = (subtotal * discountPct) / 100;
  const tax = ((subtotal - discount) * settings.taxRate) / 100;
  const total = subtotal - discount + tax;

  function addLine(productId: string, name: string, price: number) {
    setLines((prev) => {
      const hit = prev.find((l) => l.productId === productId);
      if (hit) return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { productId, name, price, qty: 1 }];
    });
  }

  function setQty(productId: string, delta: number) {
    setLines((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  }

  function checkout() {
    if (lines.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    const sale = {
      date: new Date().toISOString().slice(0, 10),
      items: lines.reduce((s, l) => s + l.qty, 0),
      total: Math.round(total * 100) / 100,
      method,
      cashier: "Ayesha",
    };
    recordSale(
      sale,
      lines.map((l) => ({ productId: l.productId, qty: l.qty })),
    );
    setReceipt({
      id: `INV-${Date.now().toString().slice(-6)}`,
      lines,
      subtotal,
      discount,
      tax,
      total,
      method,
      at: new Date().toLocaleString("en-US"),
    });
    setLines([]);
    setDiscountPct(0);
    toast.success("Sale completed");
  }

  return (
    <>
      <PageHeader
        title="POS terminal"
        subtitle="Search by name, SKU or barcode, build the cart, apply discounts and take payment."
      />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <label className="relative block">
            <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Scan barcode or search product / SKU"
              className="w-full rounded-xl border border-input bg-card py-3 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addLine(p.id, p.name, p.sellingPrice)}
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:border-primary"
              >
                <ProductThumb name={p.name} category={p.category} accent={p.accent} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-secondary">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currency(p.sellingPrice)} · {p.quantity} left
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-lg font-semibold text-secondary">Cart</h2>
            <ul className="mt-3 space-y-2">
              <AnimatePresence>
                {lines.map((l) => (
                  <motion.li
                    key={l.productId}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="flex items-center gap-2 rounded-xl surface-soft p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-secondary">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{currency(l.price)} each</p>
                    </div>
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setQty(l.productId, -1)}
                      className="rounded-lg border border-border p-1.5 text-secondary"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-secondary">{l.qty}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setQty(l.productId, 1)}
                      className="rounded-lg border border-border p-1.5 text-secondary"
                    >
                      <Plus className="size-3.5" />
                    </button>
                    <button
                      aria-label="Remove item"
                      onClick={() => setQty(l.productId, -l.qty)}
                      className="rounded-lg border border-border p-1.5 text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {lines.length === 0 ? (
                <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Cart is empty — tap a product to add it.
                </li>
              ) : null}
            </ul>

            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Discount %
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <dl className="mt-4 space-y-1.5 text-sm">
              <Row label="Subtotal" value={currency(subtotal)} />
              <Row label={`Discount (${discountPct}%)`} value={`- ${currency(discount)}`} />
              <Row label={`Tax (${settings.taxRate}%)`} value={currency(tax)} />
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <dt className="font-display text-base font-bold text-secondary">Total</dt>
                <dd className="font-display text-xl font-bold text-secondary">{currency(total)}</dd>
              </div>
            </dl>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition ${
                    method === m.key
                      ? "border-primary bg-accent text-secondary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <m.icon className="size-4" />
                  {m.key}
                </button>
              ))}
            </div>

            <button
              onClick={checkout}
              className="mt-4 w-full rounded-xl gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Charge {currency(total)}
            </button>
          </div>

          {receipt ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-secondary">Receipt</h2>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-secondary"
                >
                  <Printer className="size-3.5" /> Print invoice
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {receipt.id} · {receipt.at} · {receipt.method}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {receipt.lines.map((l) => (
                  <li key={l.productId} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {l.qty} × {l.name}
                    </span>
                    <span className="font-semibold text-secondary">{currency(l.qty * l.price)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1 border-t border-border pt-2 text-sm">
                <Row label="Subtotal" value={currency(receipt.subtotal)} />
                <Row label="Discount" value={`- ${currency(receipt.discount)}`} />
                <Row label="Tax" value={currency(receipt.tax)} />
                <Row label="Paid" value={currency(receipt.total)} />
              </dl>
            </motion.div>
          ) : null}
        </section>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-secondary">{value}</dd>
    </div>
  );
}
