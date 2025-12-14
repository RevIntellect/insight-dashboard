import { useState, useEffect } from "react";
import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";
import { Globe, Users, Clock, FileText, MousePointer, Eye, ArrowLeft, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { ga4Service } from "@/services/ga4Service";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WebsiteTrafficDashboardProps {
  onBack: () => void;
}

export function WebsiteTrafficDashboard({ onBack }: WebsiteTrafficDashboardProps) {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: metrics = [], isLoading, refetch } = useQuery({
    queryKey: ['ga4-metrics'],
    queryFn: () => ga4Service.getMetrics(),
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: credentials } = useQuery({
    queryKey: ['ga4-credentials'],
    queryFn: () => ga4Service.getCredentials(),
  });

  const handleSync = async () => {
    if (!credentials?.property_id) {
      toast({
        title: "Configuration Required",
        description: "Please configure your Google Analytics credentials first. Check the API Requirements document for setup instructions.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      await ga4Service.syncAllData(credentials.property_id);
      await refetch();
      toast({
        title: "Sync Complete",
        description: "GA4 data has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync GA4 data",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSessions = metrics.reduce((sum, m) => sum + m.sessions, 0);
  const totalUsers = metrics.reduce((sum, m) => sum + m.users, 0);
  const totalPageviews = metrics.reduce((sum, m) => sum + m.pageviews, 0);
  const totalNewUsers = metrics.reduce((sum, m) => sum + m.new_users, 0);
  const avgBounceRate = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.bounce_rate, 0) / metrics.length
    : 0;
  const avgSessionDuration = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.avg_session_duration, 0) / metrics.length
    : 0;
  const pagesPerSession = totalSessions > 0 ? totalPageviews / totalSessions : 0;
  const newUserPercentage = totalUsers > 0 ? (totalNewUsers / totalUsers) * 100 : 0;

  const chartData = metrics
    .slice(0, 30)
    .reverse()
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions: m.sessions,
      users: m.users,
      pageviews: m.pageviews,
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Website Traffic</h1>
            <p className="text-muted-foreground mt-1">Google Analytics 4 data overview</p>
          </div>
        </div>
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Data'}
        </Button>
      </div>

      {!credentials && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Google Analytics is not configured. Please set up your GA4 credentials to see real data.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Sessions"
          value={isLoading ? "Loading..." : formatNumber(totalSessions)}
          change="+18.2%"
          icon={Globe}
        />
        <KPICard
          title="Unique Users"
          value={isLoading ? "Loading..." : formatNumber(totalUsers)}
          change="+15.8%"
          icon={Users}
        />
        <KPICard
          title="Avg. Session Duration"
          value={isLoading ? "Loading..." : formatDuration(avgSessionDuration)}
          change="+0:24"
          icon={Clock}
        />
        <KPICard
          title="Pages per Session"
          value={isLoading ? "Loading..." : pagesPerSession.toFixed(1)}
          change="+0.4"
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Bounce Rate"
          value={isLoading ? "Loading..." : `${avgBounceRate.toFixed(1)}%`}
          change="-3.2%"
          icon={MousePointer}
        />
        <KPICard
          title="New Users"
          value={isLoading ? "Loading..." : `${newUserPercentage.toFixed(1)}%`}
          change="+2.1%"
          icon={Users}
        />
        <KPICard
          title="Pageviews"
          value={isLoading ? "Loading..." : formatNumber(totalPageviews)}
          change="+22.5%"
          icon={Eye}
        />
        <KPICard
          title="Exit Rate"
          value="38.2%"
          change="-1.8%"
          icon={Globe}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Traffic Trends (Last 30 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="sessions" stackId="1" stroke="hsl(155, 70%, 45%)" fill="hsl(155, 70%, 45%)" fillOpacity={0.6} />
              <Area type="monotone" dataKey="users" stackId="2" stroke="hsl(220, 70%, 55%)" fill="hsl(220, 70%, 55%)" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Engagement Metrics">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="pageviews" stroke="hsl(220, 70%, 55%)" strokeWidth={2} />
              <Line type="monotone" dataKey="sessions" stroke="hsl(155, 70%, 45%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
