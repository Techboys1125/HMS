import React from "react";
import { Search } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface InvestigationTableProps {
  values: {
    cbc: boolean;
    ecg: boolean;
    xray: boolean;
    ultrasound: boolean;
    other: boolean;
  };
  customInvestigation: string;
  remarks: string;
  onChange: (
    field: string,
    val: string | InvestigationTableProps["values"],
  ) => void;
}

const INVESTIGATION_OPTIONS: {
  key: keyof InvestigationTableProps["values"];
  label: string;
}[] = [
  { key: "cbc", label: "Complete Blood Count (CBC)" },
  { key: "ecg", label: "12-Lead Electrocardiogram (ECG)" },
  { key: "xray", label: "Chest X-Ray (PA View)" },
  { key: "ultrasound", label: "Abdomen / Pelvis Ultrasound" },
  { key: "other", label: "Other Diagnostics (Specify below)" },
];

export const InvestigationTable: React.FC<InvestigationTableProps> = ({
  values,
  customInvestigation,
  remarks,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Search size={16} className="text-[#0D47A1]" />
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Investigation Recommendations
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {INVESTIGATION_OPTIONS.map((opt) => (
          <label
            key={opt.key}
            className="flex items-start gap-2.5 p-3 border border-[#E5E7EB] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={values[opt.key]}
              onChange={(e) => {
                const updated = { ...values, [opt.key]: e.target.checked };
                onChange("investigations", updated);
              }}
              className="mt-0.5 rounded border-[#E5E7EB] text-[#0D47A1] focus:ring-[#0D47A1]/20 w-4 h-4"
            />
            <span
              className="text-xs font-semibold text-slate-700"
              style={{ fontFamily: PP }}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span
            className="block text-[11px] font-semibold text-[#64748B] mb-1"
            style={{ fontFamily: PP }}
          >
            Custom Investigation Details (If 'Other' selected)
            <input
              aria-label="Input field"
              type="text"
              value={customInvestigation}
              disabled={!values.other}
              onChange={(e) => onChange("customInvestigation", e.target.value)}
              placeholder="e.g. 2D Echocardiogram, Troponin-I STAT"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors disabled:bg-slate-100 disabled:text-slate-400"
              style={{ fontFamily: RB }}
            />
          </span>
        </div>
        <div>
          <span
            className="block text-[11px] font-semibold text-[#64748B] mb-1"
            style={{ fontFamily: PP }}
          >
            Clinical Remarks & Instructions
            <input
              aria-label="Input field"
              type="text"
              value={remarks}
              onChange={(e) => onChange("investigationRemarks", e.target.value)}
              placeholder="e.g. Perform Troponin test immediately and report result."
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              style={{ fontFamily: RB }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvestigationTable;
