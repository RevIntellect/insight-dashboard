import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import {
  LayoutDashboard,
  Globe,
  TrendingUp,
  DollarSign,
  Linkedin,
  Target,
  Search,
  Cloud,
  Mail,
  Home,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/executive", label: "Executive Summary", icon: LayoutDashboard },
  { path: "/website-traffic", label: "Website Traffic", icon: Globe },
  { path: "/acquisition", label: "Acquisition", icon: TrendingUp },
  { path: "/financial", label: "Financial", icon: DollarSign },
  { path: "/linkedin-ads", label: "LinkedIn Ads", icon: Linkedin },
  { path: "/linkedin", label: "LinkedIn Organic", icon: Linkedin },
  { path: "/google-ads", label: "Google Ads", icon: Target },
  { path: "/seo", label: "Search Console", icon: Search },
  { path: "/marketing-cloud", label: "Marketing Cloud", icon: Cloud },
  { path: "/direct-mail", label: "Direct Mail", icon: Mail },
];

export function DashboardLayout() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen flex flex-col border-r border-sidebar-border transition-all duration-300",
          "bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]",
          collapsed ? "w-[68px]" : "w-[240px]",
          // Mobile: off-screen by default
          "max-lg:-translate-x-full max-lg:shadow-elevated",
          mobileOpen && "max-lg:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[hsl(var(--sidebar-border))]">
          {!collapsed && (
            <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity">
              <img
                src={mounted && resolvedTheme === "dark" ? logoDark : logoLight}
                alt="reLink Medical"
                className="h-8 w-auto"
              />
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-[hsl(var(--sidebar-accent))] transition-colors hidden lg:flex"
          >
            {collapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
                    : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-4 border-t border-[hsl(var(--sidebar-border))]">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--sidebar-primary))]" />
              <span className="text-xs text-[hsl(var(--sidebar-muted))]">4 sources connected</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          collapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"
        )}
      >
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
            >
              <PanelLeft className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <ThemeToggle />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">Marketing Team</p>
                <p className="text-xs text-muted-foreground">reLink Medical</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">MT</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
