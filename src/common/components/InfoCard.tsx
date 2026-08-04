import React from "react";

interface InfoItem {
  label: string;
  value: React.ReactNode;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
  icon?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, items, icon }) => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        {icon}
        <h3 className="font-bold text-[#1E293B] text-sm font-heading">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col space-y-1">
            <span className="text-[#64748B] font-medium">{item.label}</span>
            <span className="text-[#1E293B] font-bold leading-relaxed">
              {item.value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
