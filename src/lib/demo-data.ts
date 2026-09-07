export type StockStatus = "Healthy" | "Low Stock" | "Critical Stock";

export type Product = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  purchasePrice: number;
  sellingPrice: number;
  supplierId: string;
  dailyVelocity: number;
  addedAt: string;
  archived: boolean;
  accent: string;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  leadTimeDays: number;
  ordersPlaced: number;
  totalSpend: number;
};

export type Sale = {
  id: string;
  date: string;
  items: number;
  total: number;
  method: "Cash" | "Card" | "Digital Wallet";
  cashier: string;
};

export const CATEGORIES = [
  "Beverages",
  "Grocery",
  "Pharmacy",
  "Household",
  "Personal Care",
  "Snacks",
];

export const suppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Golden Valley Distributors",
    email: "orders@goldenvalley.com",
    phone: "+1 (415) 220-8841",
    address: "1200 Harvest Ave, Fresno, CA",
    leadTimeDays: 4,
    ordersPlaced: 128,
    totalSpend: 184320,
  },
  {
    id: "sup-2",
    name: "Amber Foods Wholesale",
    email: "supply@amberfoods.com",
    phone: "+1 (312) 907-3320",
    address: "45 Mill Street, Chicago, IL",
    leadTimeDays: 6,
    ordersPlaced: 94,
    totalSpend: 132870,
  },
  {
    id: "sup-3",
    name: "Cocoa & Grain Traders",
    email: "hello@cocoagrain.com",
    phone: "+1 (718) 553-1190",
    address: "88 Dockside Rd, Brooklyn, NY",
    leadTimeDays: 8,
    ordersPlaced: 61,
    totalSpend: 98410,
  },
  {
    id: "sup-4",
    name: "MediCare Supplies Co.",
    email: "b2b@medicaresupplies.com",
    phone: "+1 (206) 441-7712",
    address: "310 Clinic Blvd, Seattle, WA",
    leadTimeDays: 3,
    ordersPlaced: 152,
    totalSpend: 221650,
  },
];

const p = (
  id: number,
  name: string,
  sku: string,
  category: string,
  quantity: number,
  reorderPoint: number,
  purchasePrice: number,
  sellingPrice: number,
  supplierId: string,
  dailyVelocity: number,
  addedAt: string,
): Product => ({
  id: `prd-${id}`,
  name,
  sku,
  barcode: `89${String(100000 + id * 137).slice(0, 6)}${id}`,
  category,
  quantity,
  reorderPoint,
  purchasePrice,
  sellingPrice,
  supplierId,
  dailyVelocity,
  addedAt,
  archived: false,
  accent: id % 2 === 0 ? "primary" : "brown",
});

export const products: Product[] = [
  p(1, "Arabica Coffee Beans 1kg", "BEV-ARB-1000", "Beverages", 148, 60, 12.4, 21.9, "sup-1", 9.4, "2026-01-12"),
  p(2, "Golden Honey Jar 500g", "GRO-HNY-500", "Grocery", 34, 40, 4.1, 8.75, "sup-2", 5.2, "2026-02-03"),
  p(3, "Green Cardamom 250g", "GRO-CRD-250", "Grocery", 12, 30, 7.8, 15.5, "sup-3", 3.8, "2026-01-27"),
  p(4, "Paracetamol 500mg (100 tabs)", "PHR-PCM-100", "Pharmacy", 260, 90, 2.2, 5.4, "sup-4", 14.6, "2025-11-18"),
  p(5, "Vitamin C Effervescent", "PHR-VTC-020", "Pharmacy", 48, 50, 3.6, 9.2, "sup-4", 6.1, "2026-03-09"),
  p(6, "Cocoa Powder 400g", "GRO-CCO-400", "Grocery", 96, 45, 5.3, 11.4, "sup-3", 4.4, "2026-02-21"),
  p(7, "Whole Wheat Flour 5kg", "GRO-WWF-5000", "Grocery", 72, 35, 6.9, 13.2, "sup-2", 4.9, "2026-01-04"),
  p(8, "Ceylon Black Tea 200g", "BEV-CBT-200", "Beverages", 8, 25, 3.4, 7.9, "sup-1", 3.1, "2026-04-14"),
  p(9, "Dish Cleaning Liquid 1L", "HSE-DCL-1000", "Household", 130, 50, 2.7, 6.5, "sup-2", 7.7, "2026-02-11"),
  p(10, "Laundry Powder 3kg", "HSE-LDP-3000", "Household", 41, 40, 8.1, 16.9, "sup-2", 5.6, "2026-03-22"),
  p(11, "Herbal Shampoo 400ml", "PRC-HSH-400", "Personal Care", 88, 35, 4.9, 11.2, "sup-1", 4.2, "2026-01-19"),
  p(12, "Shea Body Butter 250ml", "PRC-SBB-250", "Personal Care", 22, 28, 6.4, 14.8, "sup-3", 3.5, "2026-04-02"),
  p(13, "Salted Caramel Cookies", "SNK-SCC-300", "Snacks", 210, 70, 2.1, 5.2, "sup-2", 12.3, "2026-03-01"),
  p(14, "Roasted Almonds 500g", "SNK-RAL-500", "Snacks", 58, 45, 9.2, 18.4, "sup-3", 6.8, "2026-02-27"),
  p(15, "Sparkling Water 12-pack", "BEV-SPW-012", "Beverages", 164, 60, 5.5, 11.9, "sup-1", 10.2, "2026-01-08"),
  p(16, "Antiseptic Hand Gel 250ml", "PHR-AHG-250", "Pharmacy", 17, 40, 2.4, 6.1, "sup-4", 5.9, "2026-04-08"),
];

export const salesHistory: Sale[] = Array.from({ length: 42 }, (_, i) => {
  const date = new Date(2026, 7, 27 - i);
  const base = 2400 + Math.sin(i / 3) * 620 + (i % 7 === 0 ? 900 : 0);
  const methods: Sale["method"][] = ["Cash", "Card", "Digital Wallet"];
  return {
    id: `sale-${1000 + i}`,
    date: date.toISOString().slice(0, 10),
    items: 18 + ((i * 5) % 26),
    total: Math.round(base * 100) / 100,
    method: methods[i % 3] as Sale["method"],
    cashier: ["Ayesha", "Daniel", "Marco", "Nadia"][i % 4] as string,
  };
}).reverse();

export const monthlyRevenue = [
  { month: "Mar", revenue: 58200, cost: 36100 },
  { month: "Apr", revenue: 61400, cost: 38200 },
  { month: "May", revenue: 66980, cost: 40100 },
  { month: "Jun", revenue: 71240, cost: 42980 },
  { month: "Jul", revenue: 78610, cost: 45620 },
  { month: "Aug", revenue: 84350, cost: 48170 },
];

export const categoryPerformance = CATEGORIES.map((category, i) => ({
  category,
  units: [1840, 2610, 1490, 1120, 960, 2280][i] ?? 900,
  revenue: [24800, 31200, 19700, 14100, 12600, 21900][i] ?? 12000,
}));

export function stockStatus(product: Product): StockStatus {
  if (product.quantity <= product.reorderPoint * 0.4) return "Critical Stock";
  if (product.quantity <= product.reorderPoint) return "Low Stock";
  return "Healthy";
}

export function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

/** AI demand prediction — trend + seasonality weighted projection. */
export function forecast(product: Product) {
  const seasonalIndex = 1 + Math.sin((product.id.length + product.dailyVelocity) / 2) * 0.12;
  const trend = 1 + (product.dailyVelocity > 6 ? 0.09 : 0.03);
  const nextWeek = Math.round(product.dailyVelocity * 7 * seasonalIndex * trend);
  const nextMonth = Math.round(product.dailyVelocity * 30 * seasonalIndex * trend * 0.97);
  const daysToStockout = Math.max(
    0,
    Math.round(product.quantity / Math.max(product.dailyVelocity * seasonalIndex, 0.5)),
  );
  const supplier = suppliers.find((s) => s.id === product.supplierId);
  const leadTime = supplier?.leadTimeDays ?? 5;
  const recommendedQty = Math.max(
    0,
    Math.round((nextMonth + product.dailyVelocity * leadTime * 1.4 - product.quantity) / 10) * 10,
  );
  const confidence = Math.min(
    97,
    Math.round(72 + product.dailyVelocity * 1.8 + (product.quantity > 0 ? 4 : 0)),
  );
  const stockoutDate = new Date(2026, 7, 27 + daysToStockout).toISOString().slice(0, 10);
  return { nextWeek, nextMonth, daysToStockout, recommendedQty, confidence, stockoutDate, leadTime };
}

export function forecastSeries(product: Product) {
  return Array.from({ length: 8 }, (_, i) => {
    const week = i + 1;
    const seasonal = 1 + Math.sin(week / 2.2) * 0.14;
    const predicted = Math.round(product.dailyVelocity * 7 * seasonal * (1 + week * 0.012));
    return {
      label: `W${week}`,
      actual: week <= 4 ? Math.round(predicted * (0.92 + (week % 3) * 0.05)) : null,
      predicted,
    };
  });
}
