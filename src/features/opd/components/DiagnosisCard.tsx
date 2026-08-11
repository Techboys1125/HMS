import React from "react";
import { Activity } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface DiagnosisCardProps {
  provisionalDiagnosis?: string;
  finalDiagnosis?: string;
  icdCode?: string;
  diagnosesList?: Array<{ code: string; desc: string; type?: string }>;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({
  provisionalDiagnosis,
  finalDiagnosis,
  icdCode,
  diagnosesList = [],
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Activity size={15} className="text-indigo-600" />
        </div>
        <div>
          <div
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wide"
            style={{ fontFamily: PP }}
          >
            Diagnosis Details
          </div>
          <div
            className="text-sm font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            ICD-10 Assessment
          </div>
        </div>
      </div>

      {diagnosesList.length > 0 ? (
        <div className="space-y-2">
          {diagnosesList.map((d) => (
            <div
              key={d.code}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 bg-slate-50"
            >
              <span className="font-mono text-xs font-bold text-[#0D47A1]">
                {d.code}
              </span>
              <span
                className="text-xs text-slate-700 flex-1"
                style={{ fontFamily: RB }}
              >
                {d.desc}
              </span>
              {d.type && (
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    d.type === "primary"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                  style={{ fontFamily: PP }}
                >
                  {d.type.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5"
              style={{ fontFamily: PP }}
            >
              Provisional Diagnosis
            </span>
            <span className="text-slate-700" style={{ fontFamily: RB }}>
              {provisionalDiagnosis || "None recorded"}
            </span>
          </div>
          <div>
            <span
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5"
              style={{ fontFamily: PP }}
            >
              Final Diagnosis
            </span>
            <span className="text-slate-700" style={{ fontFamily: RB }}>
              {finalDiagnosis || "None recorded"}
              {icdCode && (
                <span className="block font-mono text-xs text-[#0D47A1] font-bold mt-1 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                  {icdCode}
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisCard;
