import React from "react";
import { ClipboardList } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface ExaminationCardProps {
  findings: string;
  general?: string;
  physical?: string;
}

export const ExaminationCard: React.FC<ExaminationCardProps> = ({
  findings,
  general,
  physical,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
          <ClipboardList size={15} className="text-[#009688]" />
        </div>
        <div>
          <div
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wide"
            style={{ fontFamily: PP }}
          >
            Clinical Examination
          </div>
          <div
            className="text-sm font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Physical Findings
          </div>
        </div>
      </div>

      {findings || general || physical ? (
        <div
          className="space-y-2 text-sm text-slate-600 leading-relaxed"
          style={{ fontFamily: RB }}
        >
          {findings && <p>{findings}</p>}
          {general && (
            <p>
              <strong className="text-slate-800" style={{ fontFamily: PP }}>
                General Exam:
              </strong>{" "}
              {general}
            </p>
          )}
          {physical && (
            <p>
              <strong className="text-slate-800" style={{ fontFamily: PP }}>
                Systemic Exam:
              </strong>{" "}
              {physical}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">
          No examination details recorded
        </p>
      )}
    </div>
  );
};

export default ExaminationCard;
