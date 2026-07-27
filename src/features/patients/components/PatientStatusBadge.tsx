
export function PatientStatusBadge({ status }: { status: string }) {
  const s = String(status || "").toUpperCase();
  let c = { bg: "bg-green-50", text: "text-green-700", dot: "bg-[#66BB6A]" };

  if (s === "ACTIVE") {
    c = { bg: "bg-green-50", text: "text-green-700", dot: "bg-[#66BB6A]" };
  } else if (s === "ADMITTED") {
    c = { bg: "bg-blue-50", text: "text-[#0D47A1]", dot: "bg-[#0D47A1]" };
  } else if (s === "INACTIVE") {
    c = { bg: "bg-slate-100", text: "text-[#64748B]", dot: "bg-[#64748B]" };
  } else if (s === "DECEASED") {
    c = { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
  } else if (s === "DUPLICATE_CANDIDATE") {
    c = { bg: "bg-amber-50", text: "text-[#F59E0B]", dot: "bg-[#F59E0B]" };
  } else if (s === "DISCHARGED") {
    c = { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" };
  }

  const label = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, " ") : "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  );
}

export { PatientStatusBadge as StatusBadge };
