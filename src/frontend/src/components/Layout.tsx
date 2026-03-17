import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Coins,
  Gift,
  History,
  Info,
  Leaf,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserPoints } from "../hooks/useQueries";

const navItems = [
  { path: "/submit", label: "Waste to Points", icon: Leaf },
  { path: "/redeem", label: "Redeem Points", icon: Gift },
  { path: "/history", label: "Transactions", icon: History },
  { path: "/about", label: "About", icon: Info },
];

export default function Layout() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: points } = useUserPoints();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isLoggedIn = !!identity;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar shrink-0 border-r border-sidebar-border">
        <SidebarContent
          currentPath={currentPath}
          isLoggedIn={isLoggedIn}
          points={points ?? BigInt(0)}
          onLogin={login}
          onLogout={clear}
          loginStatus={loginStatus}
        />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar shadow-green-lg md:hidden"
          >
            <SidebarContent
              currentPath={currentPath}
              isLoggedIn={isLoggedIn}
              points={points ?? BigInt(0)}
              onLogin={login}
              onLogout={clear}
              loginStatus={loginStatus}
              onClose={() => setMobileOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {mobileOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-sidebar-primary" />
            <span className="font-display font-700 text-sidebar-foreground text-lg">
              WasteToWealth
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <Badge className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                <Coins className="w-3 h-3 mr-1" />
                {points?.toString() ?? "0"} pts
              </Badge>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-sidebar-foreground p-1"
              data-ocid="nav.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  currentPath,
  isLoggedIn,
  points,
  onLogin,
  onLogout,
  loginStatus,
  onClose,
}: {
  currentPath: string;
  isLoggedIn: boolean;
  points: bigint;
  onLogin: () => void;
  onLogout: () => void;
  loginStatus: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-green">
            <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-sidebar-foreground text-base leading-tight">
              WasteToWealth
            </div>
            <div className="text-sidebar-foreground/50 text-xs">
              Earn from recycling
            </div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Points balance */}
      {isLoggedIn && (
        <div className="mx-4 mb-4 p-3 rounded-xl bg-sidebar-accent border border-sidebar-border">
          <div className="text-sidebar-foreground/60 text-xs mb-1">
            Your Balance
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-sidebar-primary" />
            <span className="font-display font-bold text-sidebar-primary text-2xl">
              {points.toString()}
            </span>
            <span className="text-sidebar-foreground/60 text-sm">pts</span>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              data-ocid="nav.link"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Login/logout */}
      <div className="p-4 border-t border-sidebar-border">
        {isLoggedIn ? (
          <Button
            variant="ghost"
            className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent justify-start gap-2"
            onClick={onLogout}
            data-ocid="auth.button"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        ) : (
          <Button
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 gap-2"
            onClick={onLogin}
            disabled={loginStatus === "logging-in"}
            data-ocid="auth.button"
          >
            <LogIn className="w-4 h-4" />
            {loginStatus === "logging-in" ? "Connecting..." : "Sign In"}
          </Button>
        )}
        {isLoggedIn && (
          <p className="text-sidebar-foreground/40 text-xs mt-2 text-center truncate">
            Connected
          </p>
        )}
      </div>
    </div>
  );
}
