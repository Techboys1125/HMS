import React from "react";
import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "There are no records matching your current filter criteria.",
}) => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
      <ClipboardList className="text-slate-300 mb-2" size={48} />
      <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
      <p className="text-xs text-[#64748B] max-w-xs mt-1">{description}</p>
    </div>
  );
};

export default EmptyState;
