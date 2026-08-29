import React from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  badge,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
};

export default DashboardHeader;
