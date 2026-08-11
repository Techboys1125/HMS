import React from "react";
import { Pill } from "lucide-react";

export const PrescriptionMedicineTable: React.FC<{
  medicines: {
    name: string;
    strength?: string;
    dosage?: string;
    doseValue?: string;
    frequency?: string;
    frequencyCode?: string;
    duration?: string;
    durationValue?: string;
  }[];
}> = ({ medicines }) => {
  return (
    <div className="space-y-2">
      {medicines.map((m) => (
        <div
          key={m.name}
          className="p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs bg-white"
        >
          <div>
            <div className="font-bold text-[#111827]">
              {m.name}{" "}
              {m.strength && (
                <span className="font-normal text-slate-500">
                  ({m.strength})
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              {m.dosage || m.doseValue} • {m.frequency || m.frequencyCode} •{" "}
              {m.duration || m.durationValue}
            </div>
          </div>
          <Pill size={14} className="text-[#009688]" />
        </div>
      ))}
    </div>
  );
};

export default PrescriptionMedicineTable;
