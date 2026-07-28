const PP = "'Poppins', system-ui, sans-serif";

export type PatientHistoryTab = {
  id: string;
  label: string;
};

/**
 * Horizontal tab bar used on patient profile / history views.
 * Design matches the original profile tab navigation.
 */
export function PatientHistoryTabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: PatientHistoryTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex overflow-x-auto gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? "bg-[#0D47A1] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
          style={{ fontFamily: PP }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
