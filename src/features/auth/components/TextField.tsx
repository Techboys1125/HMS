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
    <div className="space-y-1.5 w-full relative">
      <label className="block text-xs font-heading font-bold text-[#1E293B] tracking-wide">
        {label}
      </label>
      <div className="relative w-full group">
        {Icon && (
          <Icon
            size={18}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              hasError
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
          className={`w-full py-2.5 text-xs sm:text-sm font-body rounded-xl border outline-none transition-colors duration-200 placeholder:text-slate-400 [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden ${
            Icon ? "pl-10 sm:pl-11" : "pl-3.5"
          } ${rightElement ? "pr-10 sm:pr-11" : "pr-3.5"} ${
            hasError
              ? "border-red-500 bg-red-50/70 text-red-900 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100/70 focus:bg-white focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15 shadow-2xs"
          }`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {hasError && (
        <div className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {hint && !hasError && (
        <span className="mt-1 block text-xs text-text-muted font-body">
          {hint}
        </span>
      )}
    </div>
  );
};
