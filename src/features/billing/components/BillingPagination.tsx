import { RB } from "../constants/billing.constants";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function BillingPagination({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      className="px-5 py-3 border-t border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      style={{ fontFamily: RB }}
    >
      <span className="text-[#64748B]">
        Showing {startItem} to {endItem} of {totalCount} invoices
      </span>

      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          Previous
        </button>
        <span className="px-3 py-1 text-slate-500 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
