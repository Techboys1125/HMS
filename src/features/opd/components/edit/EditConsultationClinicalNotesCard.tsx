import React from "react";
import { ChevronDown } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface EditConsultationClinicalNotesCardProps {
  collapsed: boolean;
  onToggle: () => void;
  isEditing: boolean;
  formData: {
    symptoms: string;
    assessment: string;
    advice: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: (action: any) => void;
}

export const EditConsultationClinicalNotesCard: React.FC<
  EditConsultationClinicalNotesCardProps
> = ({ collapsed, onToggle, isEditing, formData, setFormData }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-green-50 text-[#66BB6A] flex items-center justify-center font-bold text-xs">
            06
          </div>
          <h3
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Clinical Notes
          </h3>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${collapsed ? "-rotate-90" : ""}`}
        />
      </button>

      {!collapsed && (
        <div
          className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
          style={{ fontFamily: RB }}
        >
          <div>
            <label
              className="block text-[11px] font-semibold text-[#64748B] mb-1 uppercase"
              style={{ fontFamily: PP }}
            >
              Symptoms
            </label>
            <textarea
              disabled={!isEditing}
              rows={2}
              value={formData.symptoms}
              onChange={(e) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setFormData((prev: any) => ({
                  ...prev,
                  symptoms: e.target.value,
                }))
              }
              className="w-full p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label
              className="block text-[11px] font-semibold text-[#64748B] mb-1 uppercase"
              style={{ fontFamily: PP }}
            >
              Assessment
            </label>
            <textarea
              disabled={!isEditing}
              rows={2}
              value={formData.assessment}
              onChange={(e) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setFormData((prev: any) => ({
                  ...prev,
                  assessment: e.target.value,
                }))
              }
              className="w-full p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label
              className="block text-[11px] font-semibold text-[#64748B] mb-1 uppercase"
              style={{ fontFamily: PP }}
            >
              Advice
            </label>
            <textarea
              disabled={!isEditing}
              rows={2}
              value={formData.advice}
              onChange={(e) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setFormData((prev: any) => ({
                  ...prev,
                  advice: e.target.value,
                }))
              }
              className="w-full p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};
