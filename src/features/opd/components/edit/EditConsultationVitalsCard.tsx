import React from "react";
import { ChevronDown } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface EditConsultationVitalsCardProps {
  collapsed: boolean;
  onToggle: () => void;
  isEditing: boolean;
  calculatedBmi: string;
  formData: {
    height: string;
    weight: string;
    temperature: string;
    bp: string;
    pulse: string;
    spo2: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const EditConsultationVitalsCard: React.FC<
  EditConsultationVitalsCardProps
> = ({
  collapsed,
  onToggle,
  isEditing,
  calculatedBmi,
  formData,
  setFormData,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Patient Vitals
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] text-slate-500 font-medium"
            style={{ fontFamily: RB }}
          >
            BMI:{" "}
            <strong className="text-[#009688] font-bold">
              {calculatedBmi} kg/m²
            </strong>
          </span>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform ${collapsed ? "-rotate-90" : ""}`}
          />
        </div>
      </button>

      {!collapsed && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Height (cm)
              </label>
              <input
                disabled={!isEditing}
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    height: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
                style={{ fontFamily: RB }}
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Weight (kg)
              </label>
              <input
                disabled={!isEditing}
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    weight: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
                style={{ fontFamily: RB }}
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                BMI (Auto Calc)
              </label>
              <input
                disabled
                type="text"
                readOnly
                value={`${calculatedBmi} kg/m²`}
                className="w-full px-3 py-2 bg-teal-50 border border-teal-200 text-[#009688] font-bold rounded-xl text-xs cursor-not-allowed"
                style={{ fontFamily: RB }}
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Temperature (°C)
              </label>
              <input
                disabled={!isEditing}
                type="text"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    temperature: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
                style={{ fontFamily: RB }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Blood Pressure
              </label>
              <input
                disabled={!isEditing}
                type="text"
                value={formData.bp}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    bp: e.target.value,
                  }))
                }
                placeholder="120/80"
                className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
                style={{ fontFamily: RB }}
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                Pulse Rate (bpm)
              </label>
              <input
                disabled={!isEditing}
                type="number"
                value={formData.pulse}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    pulse: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
                style={{ fontFamily: RB }}
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B] mb-1"
                style={{ fontFamily: PP }}
              >
                SpO₂ (%)
              </label>
              <input
                disabled={!isEditing}
                type="number"
                value={formData.spo2}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    spo2: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] disabled:opacity-65 disabled:bg-slate-100"
                style={{ fontFamily: RB }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
