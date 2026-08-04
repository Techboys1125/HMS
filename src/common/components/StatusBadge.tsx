import { STATUS_CONFIG } from "../../constants/dashboard";

export function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] || {
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
    label: status,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
