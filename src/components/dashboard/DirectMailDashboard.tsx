import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";
import { DashboardHeader } from "./DashboardHeader";
import { Eye, Users, Percent, MousePointer, DollarSign, TrendingUp, Clock, Mail, Target } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const responseRateTrendData = [
  { month: "Jan", responseRate: 4.8, sessions: 1100 },
  { month: "Feb", responseRate: 5.0, sessions: 1180 },
  { month: "Mar", responseRate: 5.2, sessions: 1250 },
  { month: "Apr", responseRate: 5.3, sessions: 1300 },
  { month: "May", responseRate: 5.4, sessions: 1340 },
  { month: "Jun", responseRate: 5.5, sessions: 1375 },
];

const campaignROIData = [
  { campaign: "Spring Promo", roi: 380, revenue: 18500 },
  { campaign: "Customer Win-back", roi: 290, revenue: 14200 },
  { campaign: "New Customer", roi: 320, revenue: 16800 },
  { campaign: "VIP Exclusive", roi: 420, revenue: 13500 },
];

export function DirectMailDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader title="Direct Mail" subtitle="QR codes and vanity URLs tracked in GA4" />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <KPICard title="Sessions / Visits" value="1,375" change="+7.8%" icon={Eye} />
        <KPICard title="Users" value="1,240" change="+7.2%" icon={Users} />
        <KPICard title="New Users %" value="68.5%" change="+1.5%" icon={Percent} />
        <KPICard title="Conversion Rate" value="6.2%" change="+0.5%" icon={MousePointer} />
        <KPICard title="Total Conversions" value="85" change="+8.9%" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <KPICard title="Revenue Generated" value="$63K" change="+12.5%" icon={DollarSign} />
        <KPICard title="Cost per Conversion" value="$58.82" change="-$4.15" isPositive />
        <KPICard title="ROI" value="315%" change="+18%" icon={TrendingUp} />
        <KPICard title="Bounce Rate" value="35.8%" change="-1.5%" isPositive icon={Percent} />
        <KPICard title="Avg Session Duration" value="3:45" change="+0:22" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard title="Mail Pieces Sent" value="25,000" change="+2,500" icon={Mail} />
        <KPICard title="Response Rate" value="5.5%" change="+0.4%" icon={Target} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Response Rate & Sessions Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={responseRateTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="responseRate" name="Response Rate (%)" stroke="hsl(155, 70%, 45%)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="sessions" name="Sessions" stroke="hsl(220, 70%, 55%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Campaign ROI & Revenue">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={campaignROIData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="campaign" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Legend />
              <Bar yAxisId="left" dataKey="roi" name="ROI (%)" fill="hsl(155, 70%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="hsl(220, 70%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
