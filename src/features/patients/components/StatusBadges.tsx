export function StatusBadge({ status = "" }: { status?: string }) {
  const c =
    status === "Active" || status === "Paid"
      ? { bg: "bg-green-50", text: "text-green-700", dot: "bg-[#66BB6A]" }
      : status === "Admitted"
        ? { bg: "bg-blue-50", text: "text-[#0D47A1]", dot: "bg-[#0D47A1]" }
        : status === "Inactive"
          ? { bg: "bg-slate-100", text: "text-[#64748B]", dot: "bg-[#64748B]" }
          : status === "Not Paid"
            ? { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" }
            : {
                bg: "bg-amber-50",
                text: "text-[#F59E0B]",
                dot: "bg-[#F59E0B]",
              }; // Discharged / Fallback
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
