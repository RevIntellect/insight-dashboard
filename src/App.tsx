import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

// Lazy-loaded dashboard pages
const DashboardHome = lazy(() => import("@/components/dashboard/DashboardHome").then(m => ({ default: m.DashboardHome })));
const ExecutiveDashboard = lazy(() => import("@/components/dashboard/ExecutiveDashboard").then(m => ({ default: m.ExecutiveDashboard })));
const WebsiteTrafficDashboard = lazy(() => import("@/components/dashboard/WebsiteTrafficDashboard").then(m => ({ default: m.WebsiteTrafficDashboard })));
const AcquisitionDashboard = lazy(() => import("@/components/dashboard/AcquisitionDashboard").then(m => ({ default: m.AcquisitionDashboard })));
const FinancialDashboard = lazy(() => import("@/components/dashboard/FinancialDashboard").then(m => ({ default: m.FinancialDashboard })));
const LinkedInAdsDashboard = lazy(() => import("@/components/dashboard/LinkedInAdsDashboard").then(m => ({ default: m.LinkedInAdsDashboard })));
const LinkedInDashboard = lazy(() => import("@/components/dashboard/LinkedInDashboard").then(m => ({ default: m.LinkedInDashboard })));
const GoogleAdsDashboard = lazy(() => import("@/components/dashboard/GoogleAdsDashboard").then(m => ({ default: m.GoogleAdsDashboard })));
const SEODashboard = lazy(() => import("@/components/dashboard/SEODashboard").then(m => ({ default: m.SEODashboard })));
const MarketingCloudDashboard = lazy(() => import("@/components/dashboard/MarketingCloudDashboard").then(m => ({ default: m.MarketingCloudDashboard })));
const DirectMailDashboard = lazy(() => import("@/components/dashboard/DirectMailDashboard").then(m => ({ default: m.DirectMailDashboard })));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<DashboardSkeleton />}>
            <Routes>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="executive" element={<ExecutiveDashboard />} />
                <Route path="website-traffic" element={<WebsiteTrafficDashboard />} />
                <Route path="acquisition" element={<AcquisitionDashboard />} />
                <Route path="financial" element={<FinancialDashboard />} />
                <Route path="linkedin-ads" element={<LinkedInAdsDashboard />} />
                <Route path="linkedin" element={<LinkedInDashboard />} />
                <Route path="google-ads" element={<GoogleAdsDashboard />} />
                <Route path="seo" element={<SEODashboard />} />
                <Route path="marketing-cloud" element={<MarketingCloudDashboard />} />
                <Route path="direct-mail" element={<DirectMailDashboard />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
