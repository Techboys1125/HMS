import type { ChipVariant } from "../types/patient.types";
import { RB } from "../constants/patient.fonts";

const PATIENT_AVATAR_SIZES = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

const PATIENT_AVATAR_COLORS = [
  "bg-[#0D47A1]",
  "bg-[#009688]",
  "bg-violet-600",
  "bg-rose-500",
  "bg-amber-600",
];

const PATIENT_CHIP_MAP: Record<ChipVariant, string> = {
  success: "bg-green-50 text-[#66BB6A]",
  warning: "bg-amber-50 text-[#F59E0B]",
  error: "bg-red-50 text-[#EF4444]",
  info: "bg-blue-50 text-[#0D47A1]",
  teal: "bg-teal-50 text-[#009688]",
  default: "bg-slate-50 text-[#64748B]",
};

export function Avatar({
  name,
  size = "sm",
  src,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${PATIENT_AVATAR_SIZES[size].split(" ")[0]} ${PATIENT_AVATAR_SIZES[size].split(" ")[1]} rounded-full object-cover shrink-0`}
      />
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color =
    PATIENT_AVATAR_COLORS[name.charCodeAt(0) % PATIENT_AVATAR_COLORS.length];
  return (
    <div
      className={`${PATIENT_AVATAR_SIZES[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}

export function Chip({
  label,
  variant = "default",
}: {
  label: string;
  variant?: ChipVariant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PATIENT_CHIP_MAP[variant]}`}
      style={{ fontFamily: RB }}
    >
      {label}
    </span>
  );
}
