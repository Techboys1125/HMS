import React from "react";
import { ClipboardList } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface ConsultationFormProps {
  values: {
    chiefComplaint: string;
    durationOfSymptoms: string;
    clinicalExamination: string;
    symptoms: string;
    assessment: string;
    advice: string;
    lifestyleRecommendations: string;
  };
  onChange: (field: string, val: string) => void;
}

const CONSULTATION_FIELDS: {
  key: keyof ConsultationFormProps["values"];
  label: string;
  sub: string;
  color: string;
}[] = [
  {
    key: "chiefComplaint",
    label: "Chief Complaint",
    sub: "Primary symptom / reason for visit",
    color: "bg-red-500",
  },
  {
    key: "durationOfSymptoms",
    label: "Duration of Symptoms",
    sub: "Onset and course",
    color: "bg-orange-500",
  },
  {
    key: "symptoms",
    label: "Subjective Notes (Symptoms)",
    sub: "Patient's detailed account of illness",
    color: "bg-blue-600",
  },
  {
    key: "clinicalExamination",
    label: "Objective Notes (Examination)",
    sub: "Clinical physical exam findings",
    color: "bg-[#009688]",
  },
  {
    key: "assessment",
    label: "Clinical Assessment",
    sub: "Clinical impression and differential diagnosis",
    color: "bg-amber-500",
  },
  {
    key: "advice",
    label: "General Advice",
    sub: "Specific guidance, warning signs, rest recommendations",
    color: "bg-[#66BB6A]",
  },
  {
    key: "lifestyleRecommendations",
    label: "Lifestyle & Dietary Recommendations",
    sub: "Salt restriction, exercise limitations, hydration",
    color: "bg-purple-500",
  },
];

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  values,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <ClipboardList size={16} className="text-[#0D47A1]" />
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          SOAP Notes & Clinical Advice
        </h3>
      </div>

      <div className="space-y-4">
        {CONSULTATION_FIELDS.map((f) => {
          const isShort =
            f.key === "chiefComplaint" || f.key === "durationOfSymptoms";
          return (
            <div key={f.key} className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-3.5 rounded-full ${f.color}`} />
                <div>
                  <span
                    className="block text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {f.label}
                  </span>
                  <span
                    className="block text-[10px] text-slate-400"
                    style={{ fontFamily: RB }}
                  >
                    {f.sub}
                  </span>
                </div>
              </div>

              {isShort ? (
                <input
                  type="text"
                  value={values[f.key] || ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder={`Enter ${f.label.toLowerCase()}...`}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                  style={{ fontFamily: RB }}
                />
              ) : (
                <textarea
                  value={values[f.key] || ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder={`Enter details for ${f.label.toLowerCase()}...`}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors resize-none"
                  style={{ fontFamily: RB }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsultationForm;
