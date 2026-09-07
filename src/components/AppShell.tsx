import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Boxes,
  Brain,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/pos-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/pos", label: "POS Terminal", icon: ShoppingCart },
  { to: "/forecast", label: "AI Forecasting", icon: Brain },
  { to: "/analytics", label: "Sales Analytics", icon: BarChart3 },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { lowStock, settings } = useStore();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/85 hover:bg-sidebar-accent",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
            {item.to === "/notifications" && lowStock.length > 0 ? (
              <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {lowStock.length}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar lg:flex">
        <Link to="/" className="flex items-center gap-2 border-b border-sidebar-border px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-xl gradient-primary font-display text-sm font-bold text-primary-foreground">
            PF
          </span>
          <span className="font-display text-lg font-bold text-sidebar-foreground">POSFlow AI</span>
        </Link>
        {nav}
        <button
          onClick={signOut}
          className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </aside>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-secondary/40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-64 flex-col bg-sidebar"
            >
              <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-5">
                <span className="font-display text-lg font-bold text-sidebar-foreground">
                  POSFlow AI
                </span>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="size-5 text-sidebar-foreground" />
                </button>
              </div>
              {nav}
              <button
                onClick={signOut}
                className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5 text-secondary" />
          </button>
          <p className="truncate text-sm font-semibold text-secondary">{settings.storeName}</p>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/notifications" className="relative" aria-label="Notifications">
              <Bell className="size-5 text-secondary" />
              {lowStock.length > 0 ? (
                <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-primary" />
              ) : null}
            </Link>
            <span className="flex size-9 items-center justify-center rounded-full gradient-brown font-display text-xs font-bold text-secondary-foreground">
              AI
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
