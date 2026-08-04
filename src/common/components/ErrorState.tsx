import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  errorMsg?: string | null;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to Load Data",
  errorMsg = "An unexpected error occurred while fetching information.",
  onRetry,
}) => {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-3 text-center px-4">
      <AlertTriangle className="text-red-500 animate-pulse" size={32} />
      <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
      {errorMsg && <p className="text-xs text-red-650 max-w-sm">{errorMsg}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 text-xs py-2 px-4 border border-gray-300 rounded-xl bg-white hover:bg-slate-50 text-[#111827] font-semibold cursor-pointer shadow-xs"
        >
          <RotateCcw size={12} />
          Retry Fetch
        </button>
      )}
    </div>
  );
};

export default ErrorState;
