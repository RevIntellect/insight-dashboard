import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./DateRangePicker";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
    </div>
  );
}
