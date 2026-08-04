/**
 * PatientStatusBadge – Styled status badge with color coding
 */
const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  ACTIVE: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  INACTIVE: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  DECEASED: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  DUPLICATE_CANDIDATE: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  REGISTERED: {
    bg: "bg-blue-50",
    text: "text-[#0D47A1]",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
};

export function PatientStatusBadge({ status }: { status?: string }) {
  const key = String(status || "ACTIVE").toUpperCase();
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.ACTIVE;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {key.replace(/_/g, " ")}
    </span>
  );
}
