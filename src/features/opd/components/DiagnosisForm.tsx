import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { DiagnosisItem } from "../types/diagnosis";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

const DEFAULT_ICD_CODES: DiagnosisItem[] = [];

interface DiagnosisFormProps {
  provisionalDiagnosis: string;
  finalDiagnosis: string;
  icdCode: string;
  onChange: (field: string, val: string) => void;
  // Multiple diagnoses support callback
  onAddDiagnosis?: (code: string, label: string) => void;
  icdCodes?: DiagnosisItem[];
}

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({
  provisionalDiagnosis,
  finalDiagnosis,
  icdCode,
  onChange,
  onAddDiagnosis,
  icdCodes = DEFAULT_ICD_CODES,
}) => {
  const [icdSearchQuery, setIcdSearchQuery] = useState("");
  const [showIcdDropdown, setShowIcdDropdown] = useState(false);

  const filteredIcdCodes = useMemo(() => {
    if (!icdSearchQuery.trim()) return icdCodes;
    const q = icdSearchQuery.toLowerCase();
    return icdCodes.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q),
    );
  }, [icdSearchQuery, icdCodes]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Search size={16} className="text-[#0D47A1]" />
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Diagnosis & Assessment
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-[11px] font-semibold text-[#64748B] mb-1"
            style={{ fontFamily: PP }}
          >
            Provisional Diagnosis
          </label>
          <input
            type="text"
            value={provisionalDiagnosis}
            onChange={(e) => onChange("provisionalDiagnosis", e.target.value)}
            placeholder="e.g. Suspected Angina / Acute Coronary Syndrome"
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            style={{ fontFamily: RB }}
          />
        </div>

        <div>
          <label
            className="block text-[11px] font-semibold text-[#64748B] mb-1"
            style={{ fontFamily: PP }}
          >
            Final Diagnosis
          </label>
          <input
            type="text"
            value={finalDiagnosis}
            onChange={(e) => onChange("finalDiagnosis", e.target.value)}
            placeholder="e.g. Angina Pectoris, unspecified"
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            style={{ fontFamily: RB }}
          />
        </div>
      </div>

      {/* ICD-10 Search Bar */}
      <div className="relative">
        <label
          className="block text-[11px] font-semibold text-[#64748B] mb-1"
          style={{ fontFamily: PP }}
        >
          Search & Select ICD-10 Code
        </label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={icdSearchQuery}
            onChange={(e) => {
              setIcdSearchQuery(e.target.value);
              setShowIcdDropdown(true);
            }}
            onFocus={() => setShowIcdDropdown(true)}
            placeholder="Search ICD-10 by code or description..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            style={{ fontFamily: RB }}
          />
        </div>

        {/* Selected Code Indicator */}
        {icdCode && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Selected Code:
            </span>
            <span className="font-mono text-xs font-bold text-[#0D47A1] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
              {icdCode}
            </span>
          </div>
        )}

        {/* ICD Dropdown */}
        {showIcdDropdown && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto">
            {filteredIcdCodes.length === 0 ? (
              <div className="p-3 text-xs text-slate-400 italic">
                No matching codes found
              </div>
            ) : (
              filteredIcdCodes.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    onChange("icdCode", item.code);
                    if (onAddDiagnosis) {
                      onAddDiagnosis(item.code, item.label);
                    }
                    setShowIcdDropdown(false);
                    setIcdSearchQuery("");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs border-b border-slate-50 last:border-0"
                >
                  <span className="font-mono font-bold text-[#0D47A1] mr-2">
                    {item.code}
                  </span>
                  <span className="text-slate-600">
                    {item.label.split(" — ")[1]}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisForm;
