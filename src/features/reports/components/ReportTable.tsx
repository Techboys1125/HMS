import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react";
import { PP, RB } from "../constants/reports.constants";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface ReportTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onExport?: () => void;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
}

const STATUS_COLORS: Record<string, string> = {
  Completed: "bg-green-50 text-[#66BB6A]",
  Scheduled: "bg-blue-50 text-[#0D47A1]",
  Waiting: "bg-amber-50 text-[#F59E0B]",
  Cancelled: "bg-red-50 text-[#EF4444]",
  "No Show": "bg-orange-50 text-[#F97316]",
  Paid: "bg-green-50 text-[#66BB6A]",
  Pending: "bg-amber-50 text-[#F59E0B]",
  "Partially Paid": "bg-teal-50 text-[#009688]",
  Active: "bg-green-50 text-[#66BB6A]",
  "Pending Follow-up": "bg-amber-50 text-[#F59E0B]",
  Overdue: "bg-red-50 text-[#EF4444]",
  "In-Progress": "bg-teal-50 text-[#009688]",
  "New Visit": "bg-blue-50 text-[#0D47A1]",
  "Follow-up": "bg-teal-50 text-[#009688]",
  "Walk-in": "bg-purple-50 text-[#7C3AED]",
  Emergency: "bg-red-50 text-[#EF4444]",
  "Checked-In": "bg-green-50 text-[#66BB6A]",
};

export function ReportTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 8,
  searchable = true,
  searchPlaceholder = "Search records...",
  onExport,
  emptyMessage = "No data available",
  title,
  subtitle,
}: ReportTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = row[col.key];
          return val != null && String(val).toLowerCase().includes(q);
        })
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return result;
  }, [data, search, sortKey, sortDir, columns]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      {(title || searchable || onExport) && (
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between flex-wrap gap-3">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0D47A1]/40 w-48"
                  style={{ fontFamily: RB }}
                />
              </div>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
                style={{ fontFamily: RB }}
              >
                <Download size={13} /> Export
              </button>
            )}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-left text-xs font-semibold text-[#64748B] ${col.sortable ? "cursor-pointer hover:text-[#111827]" : ""}`}
                  style={{ fontFamily: RB, width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-[#0D47A1]">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-xs text-[#94A3B8]" style={{ fontFamily: RB }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col) => {
                    const val = row[col.key];
                    const isStatus = typeof val === "string" && STATUS_COLORS[val];
                    return (
                      <td key={col.key} className="px-5 py-3 text-xs" style={{ fontFamily: RB }}>
                        {col.render ? (
                          col.render(val, row)
                        ) : isStatus ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLORS[val]}`}>
                            {val}
                          </span>
                        ) : (
                          <span className="text-[#111827]">{val != null ? String(val) : "-"}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-xs" style={{ fontFamily: RB }}>
          <span className="text-[#64748B]">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                    p === page ? "bg-[#0D47A1] text-white" : "border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
