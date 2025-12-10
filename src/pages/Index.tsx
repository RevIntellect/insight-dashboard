import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";
import { MarketingCloudDashboard } from "@/components/dashboard/MarketingCloudDashboard";
import { LinkedInDashboard } from "@/components/dashboard/LinkedInDashboard";
import { LinkedInAdsDashboard } from "@/components/dashboard/LinkedInAdsDashboard";
import { GoogleAdsDashboard } from "@/components/dashboard/GoogleAdsDashboard";
import { SEODashboard } from "@/components/dashboard/SEODashboard";
import { DirectMailDashboard } from "@/components/dashboard/DirectMailDashboard";
import { Bell, Search, User } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("executive");

  const renderDashboard = () => {
    switch (activeSection) {
      case "executive":
        return <ExecutiveDashboard />;
      case "marketing-cloud":
        return <MarketingCloudDashboard />;
      case "linkedin":
        return <LinkedInDashboard />;
      case "linkedin-ads":
        return <LinkedInAdsDashboard />;
      case "google-ads":
        return <GoogleAdsDashboard />;
      case "seo":
        return <SEODashboard />;
      case "email":
        return <MarketingCloudDashboard />;
      case "direct-mail":
        return <DirectMailDashboard />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search metrics, reports..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Marketing Team</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Index;
