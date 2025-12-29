import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subMonths, subQuarters, subYears, addMonths, addQuarters, addYears } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
}

type PresetKey = 
  | "custom"
  | "all-time"
  | "today"
  | "yesterday"
  | "last-7"
  | "last-30"
  | "last-365"
  | "this-month"
  | "next-month"
  | "last-month"
  | "mtd"
  | "this-quarter"
  | "next-quarter"
  | "last-quarter"
  | "qtd"
  | "this-year"
  | "next-year"
  | "last-year"
  | "ytd"

interface Preset {
  key: PresetKey
  label: string
  getRange: () => DateRange
}

const presets: Preset[] = [
  {
    key: "custom",
    label: "Custom Date Range",
    getRange: () => ({ from: new Date(), to: new Date() }),
  },
  {
    key: "all-time",
    label: "All Time",
    getRange: () => ({ from: new Date(2020, 0, 1), to: new Date() }),
  },
  {
    key: "today",
    label: "Today",
    getRange: () => ({ from: new Date(), to: new Date() }),
  },
  {
    key: "yesterday",
    label: "Yesterday",
    getRange: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }),
  },
  {
    key: "last-7",
    label: "Last 7 Days",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    key: "last-30",
    label: "Last 30 Days",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    key: "last-365",
    label: "Last 365 Days",
    getRange: () => ({ from: subDays(new Date(), 364), to: new Date() }),
  },
  {
    key: "this-month",
    label: "This Month",
    getRange: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
  },
  {
    key: "next-month",
    label: "Next Month",
    getRange: () => ({ from: startOfMonth(addMonths(new Date(), 1)), to: endOfMonth(addMonths(new Date(), 1)) }),
  },
  {
    key: "last-month",
    label: "Last Month",
    getRange: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }),
  },
  {
    key: "mtd",
    label: "Month to Date",
    getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }),
  },
  {
    key: "this-quarter",
    label: "This Quarter",
    getRange: () => ({ from: startOfQuarter(new Date()), to: endOfQuarter(new Date()) }),
  },
  {
    key: "next-quarter",
    label: "Next Quarter",
    getRange: () => ({ from: startOfQuarter(addQuarters(new Date(), 1)), to: endOfQuarter(addQuarters(new Date(), 1)) }),
  },
  {
    key: "last-quarter",
    label: "Last Quarter",
    getRange: () => ({ from: startOfQuarter(subQuarters(new Date(), 1)), to: endOfQuarter(subQuarters(new Date(), 1)) }),
  },
  {
    key: "qtd",
    label: "Quarter to Date",
    getRange: () => ({ from: startOfQuarter(new Date()), to: new Date() }),
  },
  {
    key: "this-year",
    label: "This Year",
    getRange: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }),
  },
  {
    key: "next-year",
    label: "Next Year",
    getRange: () => ({ from: startOfYear(addYears(new Date(), 1)), to: endOfYear(addYears(new Date(), 1)) }),
  },
  {
    key: "last-year",
    label: "Last Year",
    getRange: () => ({ from: startOfYear(subYears(new Date(), 1)), to: endOfYear(subYears(new Date(), 1)) }),
  },
  {
    key: "ytd",
    label: "Year to Date",
    getRange: () => ({ from: startOfYear(new Date()), to: new Date() }),
  },
]

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = React.useState<PresetKey>("last-365")
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    // Initialize with Last 365 Days
    if (!dateRange) {
      const preset = presets.find(p => p.key === "last-365")
      if (preset) {
        onDateRangeChange(preset.getRange())
      }
    }
  }, [])

  const handlePresetClick = (preset: Preset) => {
    setSelectedPreset(preset.key)
    onDateRangeChange(preset.getRange())
    if (preset.key !== "custom") {
      setIsOpen(false)
    }
  }

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setSelectedPreset("custom")
    onDateRangeChange(range)
  }

  const getDisplayLabel = () => {
    const preset = presets.find(p => p.key === selectedPreset)
    return preset?.label || "Select Date Range"
  }

  const getDateDisplay = () => {
    if (!dateRange?.from) return ""
    if (!dateRange.to) return format(dateRange.from, "MMM d, yyyy")
    return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal h-9 gap-2",
            !dateRange && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Date Filter:</span>
          <span className="font-medium">{getDisplayLabel()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex flex-col sm:flex-row">
          {/* Presets List */}
          <div className="border-b sm:border-b-0 sm:border-r border-border p-2 sm:w-48 max-h-80 overflow-y-auto">
            {presets.map((preset) => (
              <button
                key={preset.key}
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  selectedPreset === preset.key
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          {/* Calendar */}
          <div className="p-3">
            <div className="text-sm font-medium text-muted-foreground mb-2 text-center">
              {getDateDisplay()}
            </div>
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
