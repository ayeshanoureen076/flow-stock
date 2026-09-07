import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import {
  products as demoProducts,
  salesHistory as demoSales,
  suppliers as demoSuppliers,
  stockStatus,
  type Product,
  type Sale,
  type Supplier,
} from "./demo-data";

export type Settings = {
  storeName: string;
  currencyCode: string;
  taxRate: number;
  lowStockAlerts: boolean;
  reorderAlerts: boolean;
  dailyDigest: boolean;
};

type Store = {
  products: Product[];
  suppliers: Supplier[];
  sales: Sale[];
  settings: Settings;
  addProduct: (p: Omit<Product, "id" | "archived" | "accent" | "barcode">) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  archiveProduct: (id: string) => void;
  addSupplier: (s: Omit<Supplier, "id" | "ordersPlaced" | "totalSpend">) => void;
  updateSupplier: (id: string, patch: Partial<Supplier>) => void;
  recordSale: (sale: Omit<Sale, "id">, lines: { productId: string; qty: number }[]) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  lowStock: Product[];
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(demoSuppliers);
  const [sales, setSales] = useState<Sale[]>(demoSales);
  const [settings, setSettings] = useState<Settings>({
    storeName: "POSFlow Retail — Downtown",
    currencyCode: "USD",
    taxRate: 8.5,
    lowStockAlerts: true,
    reorderAlerts: true,
    dailyDigest: false,
  });

  const addProduct: Store["addProduct"] = useCallback((data) => {
    setProducts((prev) => [
      {
        ...data,
        id: `prd-${Date.now()}`,
        barcode: String(8900000000 + prev.length * 977),
        archived: false,
        accent: prev.length % 2 === 0 ? "primary" : "brown",
      },
      ...prev,
    ]);
  }, []);

  const updateProduct: Store["updateProduct"] = useCallback((id, patch) => {
    setProducts((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const deleteProduct: Store["deleteProduct"] = useCallback((id) => {
    setProducts((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const archiveProduct: Store["archiveProduct"] = useCallback((id) => {
    setProducts((prev) => prev.map((it) => (it.id === id ? { ...it, archived: !it.archived } : it)));
  }, []);

  const addSupplier: Store["addSupplier"] = useCallback((data) => {
    setSuppliers((prev) => [
      { ...data, id: `sup-${Date.now()}`, ordersPlaced: 0, totalSpend: 0 },
      ...prev,
    ]);
  }, []);

  const updateSupplier: Store["updateSupplier"] = useCallback((id, patch) => {
    setSuppliers((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const recordSale: Store["recordSale"] = useCallback((sale, lines) => {
    setSales((prev) => [...prev, { ...sale, id: `sale-${Date.now()}` }]);
    setProducts((prev) =>
      prev.map((prod) => {
        const line = lines.find((l) => l.productId === prod.id);
        return line ? { ...prod, quantity: Math.max(0, prod.quantity - line.qty) } : prod;
      }),
    );
  }, []);

  const updateSettings: Store["updateSettings"] = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<Store>(
    () => ({
      products,
      suppliers,
      sales,
      settings,
      addProduct,
      updateProduct,
      deleteProduct,
      archiveProduct,
      addSupplier,
      updateSupplier,
      recordSale,
      updateSettings,
      lowStock: products.filter((it) => !it.archived && stockStatus(it) !== "Healthy"),
    }),
    [
      products,
      suppliers,
      sales,
      settings,
      addProduct,
      updateProduct,
      deleteProduct,
      archiveProduct,
      addSupplier,
      updateSupplier,
      recordSale,
      updateSettings,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
