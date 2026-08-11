import type { QuickFilterItem } from "../types/notifications.types";

export interface NotificationQuickFiltersProps {
  filters: QuickFilterItem[];
  counts: Record<string, number>;
  selected: string;
  onSelect: (id: string) => void;
}

export function NotificationQuickFilters({
  filters,
  counts,
  selected,
  onSelect,
}: NotificationQuickFiltersProps) {
  return (
    <div>
      <div className="flex items-center overflow-x-auto gap-3 pb-2 scrollbar-none">
        {filters.map((item) => {
          const IconComp = item.icon as React.ElementType;
          const count = counts[item.id] || 0;
          const isActive = selected === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition text-xs font-semibold shadow-sm ${
                isActive
                  ? "border-[#0D47A1] bg-[#0D47A1] text-white"
                  : "border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50"
              }`}
            >
              <IconComp
                className={`w-4 h-4 ${isActive ? "text-white" : "text-[#0D47A1]"}`}
              />
              <span>{item.title}</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-[#64748B]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
