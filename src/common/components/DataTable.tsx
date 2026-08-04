import React from "react";
import { ArrowUpDown } from "lucide-react";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: keyof T;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  errorMsg?: string | null;
  onRetry?: () => void;
  sortColumn?: keyof T | string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: any) => void;
  rowKeyAccessor: (row: T, index: number) => string;
  maxHeight?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  errorMsg = null,
  onRetry,
  sortColumn,
  onSort,
  rowKeyAccessor,
  maxHeight = "max-h-[600px]",
}: DataTableProps<T>) {
  if (loading) {
    return <Loader message="Fetching records from database..." />;
  }

  if (errorMsg) {
    return <ErrorState errorMsg={errorMsg} onRetry={onRetry} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={`overflow-x-auto overflow-y-auto ${maxHeight} w-full`}>
      <table className="w-full border-collapse text-left text-xs bg-white">
        <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10 text-[#64748B] font-bold">
          <tr>
            {columns.map((col, idx) => {
              const isSortable = col.sortable && onSort && col.sortKey;
              return (
                <th
                  key={idx}
                  onClick={() => isSortable && onSort(col.sortKey)}
                  className={`px-4 py-3.5 ${
                    isSortable ? "cursor-pointer hover:text-[#0D47A1] select-none" : ""
                  } ${col.className || ""}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {isSortable && (
                      <ArrowUpDown
                        size={12}
                        className={
                          sortColumn === col.sortKey
                            ? "text-[#0D47A1]"
                            : "text-slate-400"
                        }
                      />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-[#111827]">
          {data.map((row, rIdx) => (
            <tr
              key={rowKeyAccessor(row, rIdx)}
              className="hover:bg-slate-50/80 transition-colors"
            >
              {columns.map((col, cIdx) => {
                const cellVal =
                  typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode);

                return (
                  <td key={cIdx} className={`px-4 py-3.5 ${col.className || ""}`}>
                    {cellVal}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
