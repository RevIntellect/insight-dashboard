import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";
import { InsightsCard } from "./InsightsCard";
import { DollarSign, Users, TrendingUp, Percent, Clock, FileText, MousePointer, Eye } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const sessionsUsersData = [
  { month: "Jan", sessions: 12000, users: 8500 },
  { month: "Feb", sessions: 13500, users: 9200 },
  { month: "Mar", sessions: 15000, users: 10500 },
  { month: "Apr", sessions: 14200, users: 9800 },
  { month: "May", sessions: 16500, users: 11200 },
  { month: "Jun", sessions: 18200, users: 12100 },
];

const revenueData = [
  { quarter: "Q1", revenue: 95000 },
  { quarter: "Q2", revenue: 120000 },
  { quarter: "Q3", revenue: 145000 },
  { quarter: "Q4 (Proj)", revenue: 175000 },
];

const trafficSourceData = [
  { name: "Organic Search", value: 35, color: "hsl(155, 70%, 45%)" },
  { name: "Paid Search", value: 25, color: "hsl(280, 65%, 55%)" },
  { name: "Email", value: 20, color: "hsl(220, 70%, 55%)" },
  { name: "Social", value: 12, color: "hsl(38, 90%, 55%)" },
  { name: "Direct", value: 8, color: "hsl(0, 72%, 55%)" },
];

const bounceRateData = [
  { month: "Jan", rate: 45 },
  { month: "Feb", rate: 42 },
  { month: "Mar", rate: 38 },
  { month: "Apr", rate: 35 },
  { month: "May", rate: 33 },
  { month: "Jun", rate: 30 },
];

const insights = [
  { text: "Q3 exceeded targets by 8.2%", type: "success" as const },
  { text: "Web & Ads driving 48% of conversions", type: "info" as const },
  { text: "Customer lifetime value up 22%", type: "warning" as const },
];

export function ExecutiveDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Executive Summary & KPI Dashboard</h1>
        <p className="text-muted-foreground mt-1">Year-to-date performance overview</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="YTD Revenue"
          value="$627K"
          change="+15.8% YoY"
          icon={DollarSign}
        />
        <KPICard
          title="Customer Acquisition"
          value="3,847"
          change="+12.3% YoY"
          icon={Users}
        />
        <KPICard
          title="Marketing ROI"
          value="425%"
          change="+32% YoY"
          icon={TrendingUp}
        />
        <KPICard
          title="Revenue Growth"
          value="18.2%"
          change="+3.1pp"
          icon={Percent}
        />
      </div>

      {/* Second Row KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <KPICard title="Revenue" value="$62.5K" change="+12.5%" icon={DollarSign} />
        <KPICard title="Leads" value="1,250" change="+11.6%" icon={Users} />
        <KPICard title="Sessions" value="18.2K" change="+8.3%" icon={Eye} />
        <KPICard title="Users" value="12.1K" change="+7.2%" icon={Users} />
        <KPICard title="New User %" value="66.5%" change="+2.1%" icon={Percent} />
        <KPICard title="Conversion Rate" value="3.8%" change="+0.4%" icon={MousePointer} />
        <KPICard title="Avg Duration" value="3:24" change="+0:18" icon={Clock} />
        <KPICard title="Pages/Session" value="4.2" change="+0.3" icon={FileText} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sessions & Users over Time">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sessionsUsersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="hsl(155, 70%, 45%)"
                strokeWidth={2}
                dot={{ fill: "hsl(155, 70%, 45%)", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(220, 70%, 55%)"
                strokeWidth={2}
                dot={{ fill: "hsl(220, 70%, 55%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quarterly Revenue Growth">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`$${(value as number).toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(155, 70%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Traffic by Source">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={trafficSourceData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${value}%`}
                labelLine={false}
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Bounce Rate Trend">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bounceRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${value}%`, "Bounce Rate"]}
              />
              <Bar dataKey="rate" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <InsightsCard insights={insights} />
      </div>
    </div>
  );
}
