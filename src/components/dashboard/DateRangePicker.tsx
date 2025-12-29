import * as React from "react";
import { format, subDays, subMonths, subQuarters, subYears, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, addMonths, addQuarters, addYears } from "date-fns";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PresetKey = 
  | "custom"
  | "all-time"
  | "today"
  | "yesterday"
  | "last-7-days"
  | "last-30-days"
  | "last-365-days"
  | "this-month"
  | "next-month"
  | "last-month"
  | "month-to-date"
  | "this-quarter"
  | "next-quarter"
  | "last-quarter"
  | "quarter-to-date"
  | "this-year"
  | "next-year"
  | "last-year";

interface Preset {
  key: PresetKey;
  label: string;
  getRange: () => DateRange;
}

const today = new Date();

const presets: Preset[] = [
  {
    key: "custom",
    label: "Custom Date Range",
    getRange: () => ({ from: subDays(today, 30), to: today }),
  },
  {
    key: "all-time",
    label: "All Time",
    getRange: () => ({ from: new Date(2020, 0, 1), to: today }),
  },
  {
    key: "today",
    label: "Today",
    getRange: () => ({ from: today, to: today }),
  },
  {
    key: "yesterday",
    label: "Yesterday",
    getRange: () => ({ from: subDays(today, 1), to: subDays(today, 1) }),
  },
  {
    key: "last-7-days",
    label: "Last 7 Days",
    getRange: () => ({ from: subDays(today, 7), to: today }),
  },
  {
    key: "last-30-days",
    label: "Last 30 Days",
    getRange: () => ({ from: subDays(today, 30), to: today }),
  },
  {
    key: "last-365-days",
    label: "Last 365 Days",
    getRange: () => ({ from: subDays(today, 365), to: today }),
  },
  {
    key: "this-month",
    label: "This Month",
    getRange: () => ({ from: startOfMonth(today), to: endOfMonth(today) }),
  },
  {
    key: "next-month",
    label: "Next Month",
    getRange: () => ({ from: startOfMonth(addMonths(today, 1)), to: endOfMonth(addMonths(today, 1)) }),
  },
  {
    key: "last-month",
    label: "Last Month",
    getRange: () => ({ from: startOfMonth(subMonths(today, 1)), to: endOfMonth(subMonths(today, 1)) }),
  },
  {
    key: "month-to-date",
    label: "Month to Date",
    getRange: () => ({ from: startOfMonth(today), to: today }),
  },
  {
    key: "this-quarter",
    label: "This Quarter",
    getRange: () => ({ from: startOfQuarter(today), to: endOfQuarter(today) }),
  },
  {
    key: "next-quarter",
    label: "Next Quarter",
    getRange: () => ({ from: startOfQuarter(addQuarters(today, 1)), to: endOfQuarter(addQuarters(today, 1)) }),
  },
  {
    key: "last-quarter",
    label: "Last Quarter",
    getRange: () => ({ from: startOfQuarter(subQuarters(today, 1)), to: endOfQuarter(subQuarters(today, 1)) }),
  },
  {
    key: "quarter-to-date",
    label: "Quarter to Date",
    getRange: () => ({ from: startOfQuarter(today), to: today }),
  },
  {
    key: "this-year",
    label: "This Year",
    getRange: () => ({ from: startOfYear(today), to: endOfYear(today) }),
  },
  {
    key: "next-year",
    label: "Next Year",
    getRange: () => ({ from: startOfYear(addYears(today, 1)), to: endOfYear(addYears(today, 1)) }),
  },
  {
    key: "last-year",
    label: "Last Year",
    getRange: () => ({ from: startOfYear(subYears(today, 1)), to: endOfYear(subYears(today, 1)) }),
  },
];

interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = React.useState<PresetKey>("last-365-days");
  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(
    dateRange ?? presets.find(p => p.key === "last-365-days")?.getRange()
  );
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset.key);
    if (preset.key === "custom") {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
      const range = preset.getRange();
      setInternalRange(range);
      onDateRangeChange?.(range);
      setOpen(false);
    }
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setInternalRange(range);
    onDateRangeChange?.(range);
  };

  const getDisplayLabel = () => {
    const preset = presets.find(p => p.key === selectedPreset);
    if (preset && preset.key !== "custom") {
      return preset.label;
    }
    if (internalRange?.from) {
      if (internalRange.to) {
        return `${format(internalRange.from, "MMM d, yyyy")} - ${format(internalRange.to, "MMM d, yyyy")}`;
      }
      return format(internalRange.from, "MMM d, yyyy");
    }
    return "Select date range";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal gap-2",
            !internalRange && "text-muted-foreground",
            className
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Date Filter: {getDisplayLabel()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-popover" align="start" sideOffset={8}>
        <div className="flex">
          {/* Presets List */}
          <div className="border-r border-border max-h-[400px] overflow-y-auto">
            <div className="flex flex-col py-2">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left min-w-[180px]",
                    selectedPreset === preset.key && "bg-muted"
                  )}
                >
                  <span>{preset.label}</span>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      selectedPreset === preset.key
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {selectedPreset === preset.key && (
                      <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calendar (shown when custom is selected) */}
          {showCalendar && (
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={internalRange?.from}
                selected={internalRange}
                onSelect={handleCalendarSelect}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
              <div className="flex justify-between px-2 pt-2 border-t border-border mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const todayRange = { from: today, to: today };
                    setInternalRange(todayRange);
                    onDateRangeChange?.(todayRange);
                  }}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInternalRange(undefined);
                    onDateRangeChange?.(undefined);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
