import React from "react";
import { Pill } from "lucide-react";
import type { MedicineItem } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface PrescriptionCardProps {
  medicines?: MedicineItem[];
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  medicines = [],
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Pill size={15} className="text-[#009688]" />
          </div>
          <div>
            <h3
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Prescription details
            </h3>
            <p
              className="text-[10px] text-slate-400"
              style={{ fontFamily: RB }}
            >
              Medications prescribed in this session
            </p>
          </div>
        </div>
      </div>

      {medicines.length === 0 ? (
        <div
          className="p-6 text-center text-xs text-slate-400 italic"
          style={{ fontFamily: RB }}
        >
          No medications prescribed.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="bg-slate-50 border-b border-[#E5E7EB] text-[10px] font-bold text-[#64748B] uppercase tracking-wider"
                style={{ fontFamily: PP }}
              >
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-4">Dosage</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Instructions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y divide-[#E5E7EB] text-xs text-slate-700"
              style={{ fontFamily: RB }}
            >
              {medicines.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {m.name}
                  </td>
                  <td className="py-3 px-4 font-mono">{m.dosage}</td>
                  <td className="py-3 px-4">{m.frequency}</td>
                  <td className="py-3 px-4">{m.duration}</td>
                  <td className="py-3 px-4 text-slate-500 italic">
                    {m.instructions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrescriptionCard;
