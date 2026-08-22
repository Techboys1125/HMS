import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import { RB, PP } from "../constants/appointment.constants";
import { getTodayDateString } from "../../../lib/time-utils";

interface AppointmentDatePickerFilterProps {
  selectedDate: string; // YYYY-MM-DD or ""
  onChange: (date: string) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function AppointmentDatePickerFilter({
  selectedDate,
  onChange,
}: AppointmentDatePickerFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse currently selected date or default to today
  const todayStr = getTodayDateString();
  const activeDate = selectedDate ? new Date(selectedDate) : new Date();

  const [viewYear, setViewYear] = useState<number>(activeDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(activeDate.getMonth());
  const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);

  // Keep view month/year in sync if selectedDate changes externally
  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate);
    if (selectedDate) {
      const d = new Date(selectedDate);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format YYYY-MM-DD to DD-MM-YYYY for display input box
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "All Dates";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Calendar grid calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Previous month trailing days
  const prevMonthDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }> = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const pDay = daysInPrevMonth - i;
    const pMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const pYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const mStr = String(pMonth + 1).padStart(2, "0");
    const dStr = String(pDay).padStart(2, "0");
    prevMonthDays.push({
      day: pDay,
      isCurrentMonth: false,
      dateStr: `${pYear}-${mStr}-${dStr}`,
    });
  }

  // Current month days
  const currentMonthDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }> = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(viewMonth + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    currentMonthDays.push({
      day: d,
      isCurrentMonth: true,
      dateStr: `${viewYear}-${mStr}-${dStr}`,
    });
  }

  // Next month leading days to fill 35 or 42 grid cells
  const totalGridCells =
    prevMonthDays.length + currentMonthDays.length <= 35 ? 35 : 42;
  const remainingCells =
    totalGridCells - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }> = [];
  for (let n = 1; n <= remainingCells; n++) {
    const nMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const mStr = String(nMonth + 1).padStart(2, "0");
    const dStr = String(n).padStart(2, "0");
    nextMonthDays.push({
      day: n,
      isCurrentMonth: false,
      dateStr: `${nYear}-${mStr}-${dStr}`,
    });
  }

  const allCalendarDays = [
    ...prevMonthDays,
    ...currentMonthDays,
    ...nextMonthDays,
  ];

  const handleSelectDay = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleTodayClick = () => {
    onChange(todayStr);
    const d = new Date(todayStr);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setIsOpen(false);
  };

  const handleClearClick = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-xs"
      style={{ fontFamily: RB }}
    >
      {/* Label above */}
      <span className="block text-[11px] font-bold text-[#64748B] mb-1">
        Date
      </span>

      {/* Input Box Trigger */}
      <div
        onClick={handleToggleOpen}
        className="flex items-center justify-between gap-3 px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#0D47A1] shadow-xs transition-colors w-44"
      >
        <span className="font-semibold text-[#111827]">
          {formatDisplayDate(selectedDate)}
        </span>
        <CalendarIcon size={15} className="text-slate-400 shrink-0" />
      </div>

      {/* Popover Calendar Picker */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-4 w-72 animate-in zoom-in-95 duration-150">
          {/* Month / Year Header & Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div
              className="flex items-center gap-1 font-bold text-sm text-[#111827]"
              style={{ fontFamily: PP }}
            >
              <span>
                {MONTH_NAMES[viewMonth]}, {viewYear}
              </span>
              <span className="text-[10px] text-slate-400">▼</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 text-slate-500 hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors"
                title="Previous Month"
              >
                <ArrowUp size={15} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 text-slate-500 hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors"
                title="Next Month"
              >
                <ArrowDown size={15} />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 text-center font-bold text-[11px] text-slate-500 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {allCalendarDays.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              const isToday = todayStr === item.dateStr;

              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => handleSelectDay(item.dateStr)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg font-semibold transition-colors ${
                    isSelected
                      ? "bg-[#333333] text-white shadow-xs"
                      : isToday
                        ? "bg-blue-50 text-[#0D47A1] border border-blue-200"
                        : item.isCurrentMonth
                          ? "text-[#111827] hover:bg-slate-100"
                          : "text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 px-1 text-xs">
            <button
              type="button"
              onClick={handleClearClick}
              className="text-[#0D47A1] font-bold hover:underline"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleTodayClick}
              className="text-[#0D47A1] font-bold hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
