import React from "react";

const PP = "'Poppins', system-ui, sans-serif";

interface TabItem {
  id: string;
  label: string;
  count: number;
}

interface ConsultationTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const ConsultationTabs: React.FC<ConsultationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex items-center gap-2 border-b border-[#E5E7EB] overflow-x-auto pb-1">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all shrink-0 ${
              isActive
                ? "border-[#0D47A1] text-[#0D47A1] bg-white shadow-sm"
                : "border-transparent text-[#64748B] hover:text-[#111827] hover:bg-white/50"
            }`}
            style={{ fontFamily: PP }}
          >
            <span>{t.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive
                  ? "bg-blue-100 text-[#0D47A1]"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ConsultationTabs;
