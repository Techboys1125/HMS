import React from "react";
import { AlertCircle } from "lucide-react";

interface TextFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  Icon?: React.ElementType;
  rightElement?: React.ReactNode;
  hint?: string;
  autoFocus?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  Icon,
  rightElement,
  hint,
  autoFocus,
}) => {
  const hasError = !!error;
  return (
    <div className="space-y-3 w-full relative">
      <label className="block text-xs sm:text-sm font-heading font-bold text-[#1E293B] tracking-wide">
        {label}
      </label>
      <div className="relative w-full group">
        {Icon && (
          <Icon
            size={22}
            className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${hasError
              ? "text-red-500"
              : "text-[#0D47A1]/70 group-focus-within:text-[#0D47A1]"
              }`}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full py-5.5 text-base font-body rounded-2xl border outline-none transition-all duration-200 placeholder:text-slate-400 ${Icon ? "pl-14 sm:pl-16" : "pl-6"
            } ${rightElement ? "pr-14 sm:pr-16" : "pr-6"} ${hasError
              ? "border-red-500 bg-red-50/70 text-red-900 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100/70 focus:bg-white focus:border-[#0D47A1] focus:ring-4 focus:ring-[#0D47A1]/15 shadow-2xs"
            }`}
        />
        {rightElement && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {hasError && (
        <div className="absolute -bottom-4 left-1 flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      {hint && !hasError && (
        <span className="absolute -bottom-4 left-1 text-xs text-text-muted font-body">
          {hint}
        </span>
      )}
    </div>
  );
};
