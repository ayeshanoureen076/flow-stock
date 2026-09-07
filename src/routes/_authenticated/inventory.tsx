import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Archive, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { ProductThumb } from "@/components/ProductThumb";
import { StatusPill } from "@/components/StatusPill";
import { CATEGORIES, currency, stockStatus, type Product } from "@/lib/demo-data";
import { useStore } from "@/lib/pos-store";

export const Route = createFileRoute("/_authenticated/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Management — POSFlow AI" },
      {
        name: "description",
        content:
          "Search, filter, add, edit and archive products with live stock status, pricing and supplier details.",
      },
      { property: "og:title", content: "Inventory Management — POSFlow AI" },
      {
        property: "og:description",
        content: "Full product catalogue control with stock health at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InventoryPage,
});

type Draft = {
  name: string;
  sku: string;
  category: string;
  quantity: string;
  reorderPoint: string;
  purchasePrice: string;
  sellingPrice: string;
  supplierId: string;
  dailyVelocity: string;
};

const emptyDraft: Draft = {
  name: "",
  sku: "",
  category: CATEGORIES[0] as string,
  quantity: "0",
  reorderPoint: "20",
  purchasePrice: "0",
  sellingPrice: "0",
  supplierId: "",
  dailyVelocity: "3",
};

function InventoryPage() {
  const { products, suppliers, addProduct, updateProduct, deleteProduct, archiveProduct } =
    useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [addedAfter, setAddedAfter] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const rows = useMemo(
    () =>
      products.filter((p) => {
        if (query && !`${p.name} ${p.sku} ${p.barcode}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        if (category !== "all" && p.category !== category) return false;
        if (supplierFilter !== "all" && p.supplierId !== supplierFilter) return false;
        if (status !== "all" && stockStatus(p) !== status) return false;
        if (addedAfter && p.addedAt < addedAfter) return false;
        return true;
      }),
    [products, query, category, supplierFilter, status, addedAfter],
  );

  return (
    <>
      <PageHeader
        title="Inventory management"
        subtitle="Every SKU, its stock health, margins and supplier — filterable in one table."
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="size-4" /> Add product
          </button>
        }
      />

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card md:grid-cols-5">
        <label className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, SKU or barcode"
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <Select value={category} onChange={setCategory} options={["all", ...CATEGORIES]} label="Category" />
        <Select
          value={supplierFilter}
          onChange={setSupplierFilter}
          options={["all", ...suppliers.map((s) => s.id)]}
          labels={Object.fromEntries(suppliers.map((s) => [s.id, s.name]))}
          label="Supplier"
        />
        <Select
          value={status}
          onChange={setStatus}
          options={["all", "Healthy", "Low Stock", "Critical Stock"]}
          label="Status"
        />
        <label className="md:col-span-5 md:max-w-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Added after
          </span>
          <input
            type="date"
            value={addedAfter}
            onChange={(e) => setAddedAfter(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="surface-soft text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Purchase</th>
              <th className="px-4 py-3">Selling</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-border transition hover:bg-muted"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductThumb name={p.name} category={p.category} accent={p.accent} />
                    <div>
                      <p className="font-semibold text-secondary">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.archived ? "Archived · " : ""}Barcode {p.barcode}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3 font-semibold text-secondary">{p.quantity}</td>
                <td className="px-4 py-3">{currency(p.purchasePrice)}</td>
                <td className="px-4 py-3">{currency(p.sellingPrice)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {suppliers.find((s) => s.id === p.supplierId)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={stockStatus(p)} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <IconButton label="Edit product" onClick={() => setEditing(p)}>
                      <Pencil className="size-4" />
                    </IconButton>
                    <IconButton
                      label="Archive product"
                      onClick={() => {
                        archiveProduct(p.id);
                        toast.success(p.archived ? "Product restored" : "Product archived");
                      }}
                    >
                      <Archive className="size-4" />
                    </IconButton>
                    <IconButton
                      label="Delete product"
                      onClick={() => {
                        deleteProduct(p.id);
                        toast.success("Product deleted");
                      }}
                    >
                      <Trash2 className="size-4" />
                    </IconButton>
                  </div>
                </td>
              </motion.tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                  No products match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {creating || editing ? (
        <ProductDialog
          initial={
            editing
              ? {
                  name: editing.name,
                  sku: editing.sku,
                  category: editing.category,
                  quantity: String(editing.quantity),
                  reorderPoint: String(editing.reorderPoint),
                  purchasePrice: String(editing.purchasePrice),
                  sellingPrice: String(editing.sellingPrice),
                  supplierId: editing.supplierId,
                  dailyVelocity: String(editing.dailyVelocity),
                }
              : { ...emptyDraft, supplierId: suppliers[0]?.id ?? "" }
          }
          suppliers={suppliers.map((s) => ({ id: s.id, name: s.name }))}
          title={editing ? "Edit product" : "Add product"}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={(draft) => {
            const payload = {
              name: draft.name,
              sku: draft.sku,
              category: draft.category,
              quantity: Number(draft.quantity),
              reorderPoint: Number(draft.reorderPoint),
              purchasePrice: Number(draft.purchasePrice),
              sellingPrice: Number(draft.sellingPrice),
              supplierId: draft.supplierId,
              dailyVelocity: Number(draft.dailyVelocity),
              addedAt: new Date().toISOString().slice(0, 10),
            };
            if (editing) {
              updateProduct(editing.id, payload);
              toast.success("Product updated");
            } else {
              addProduct(payload);
              toast.success("Product added");
            }
            setEditing(null);
            setCreating(false);
          }}
        />
      ) : null}
    </>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="rounded-lg border border-border p-2 text-secondary transition hover:bg-accent"
    >
      {children}
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
  labels,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
  label: string;
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "all" ? "All" : (labels?.[o] ?? o)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProductDialog({
  initial,
  suppliers,
  title,
  onClose,
  onSave,
}: {
  initial: Draft;
  suppliers: { id: string; name: string }[];
  title: string;
  onClose: () => void;
  onSave: (draft: Draft) => void;
}) {
  const [draft, setDraft] = useState<Draft>(initial);
  const set = (key: keyof Draft) => (v: string) => setDraft((d) => ({ ...d, [key]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-float"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-secondary">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog">
            <X className="size-5 text-secondary" />
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Text label="Product name" value={draft.name} onChange={set("name")} />
          <Text label="SKU" value={draft.sku} onChange={set("sku")} />
          <Select label="Category" value={draft.category} onChange={set("category")} options={CATEGORIES} />
          <Select
            label="Supplier"
            value={draft.supplierId}
            onChange={set("supplierId")}
            options={suppliers.map((s) => s.id)}
            labels={Object.fromEntries(suppliers.map((s) => [s.id, s.name]))}
          />
          <Text label="Quantity" value={draft.quantity} onChange={set("quantity")} type="number" />
          <Text label="Reorder point" value={draft.reorderPoint} onChange={set("reorderPoint")} type="number" />
          <Text label="Purchase price" value={draft.purchasePrice} onChange={set("purchasePrice")} type="number" />
          <Text label="Selling price" value={draft.sellingPrice} onChange={set("sellingPrice")} type="number" />
          <Text
            label="Avg units sold / day"
            value={draft.dailyVelocity}
            onChange={set("dailyVelocity")}
            type="number"
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            className="rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Save product
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
