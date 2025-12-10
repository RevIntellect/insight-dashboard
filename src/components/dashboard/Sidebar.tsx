import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Cloud,
  Linkedin,
  Search,
  Mail,
  TrendingUp,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "executive", label: "Executive Summary", icon: LayoutDashboard },
  { id: "marketing-cloud", label: "Marketing Cloud", icon: Cloud },
  { id: "linkedin", label: "LinkedIn Organic", icon: Linkedin },
  { id: "linkedin-ads", label: "LinkedIn Ads", icon: Target },
  { id: "google-ads", label: "Google Ads", icon: TrendingUp },
  { id: "seo", label: "SEO", icon: Search },
  { id: "email", label: "Email Marketing", icon: Mail },
  { id: "direct-mail", label: "Direct Mail", icon: BarChart3 },
];

const bottomItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">Analytics Hub</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <div className="text-xs font-medium text-sidebar-muted uppercase tracking-wider px-3 mb-2">
          Dashboards
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeSection === item.id
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeSection === item.id
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
