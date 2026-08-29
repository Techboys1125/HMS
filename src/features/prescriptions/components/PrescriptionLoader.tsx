import React from "react";

export const PrescriptionLoader: React.FC = () => {
  return (
    <div className="p-6 space-y-4">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="animate-pulse flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/6" />
        </div>
      ))}
    </div>
  );
};
