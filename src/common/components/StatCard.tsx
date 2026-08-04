import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  iconBgColor = "bg-blue-50",
  iconColor = "text-[#0D47A1]",
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-xs text-[#64748B] font-medium">{title}</div>
        <div className="text-2xl font-bold text-[#111827] mt-0.5 font-heading">
          {value}
        </div>
        {description && (
          <div className="text-[11px] text-[#64748B] font-medium mt-1">
            {description}
          </div>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
