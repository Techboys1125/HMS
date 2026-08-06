import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { MedicineItem } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface MedicineTableProps {
  medicines: MedicineItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof MedicineItem, val: string) => void;
  onRemove: (id: string) => void;
}

export const MedicineTable: React.FC<MedicineTableProps> = ({
  medicines = [],
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
            <Plus size={15} className="text-[#009688]" />
          </div>
          <div>
            <h3
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Prescribe Medications
            </h3>
            <p
              className="text-[10px] text-slate-400"
              style={{ fontFamily: RB }}
            >
              Add and configure medications to prescribe in this session
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white hover:bg-[#0a3880] text-xs font-semibold shadow-sm transition-all"
          style={{ fontFamily: PP }}
        >
          <Plus size={14} /> Add Medicine
        </button>
      </div>

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
              <th className="py-3 px-4 text-center">Remove</th>
            </tr>
          </thead>
          <tbody
            className="divide-y divide-[#E5E7EB] text-xs text-slate-700"
            style={{ fontFamily: RB }}
          >
            {medicines.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 text-center text-slate-400 italic"
                >
                  No medicines added yet. Click "Add Medicine" to prescribe.
                </td>
              </tr>
            ) : (
              medicines.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50/30 transition-colors"
                >
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => onUpdate(m.id, "name", e.target.value)}
                      placeholder="Enter drug name"
                      className="w-full px-2.5 py-1.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0D47A1]"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={m.dosage}
                      onChange={(e) => onUpdate(m.id, "dosage", e.target.value)}
                      placeholder="e.g. 5mg"
                      className="w-40 px-2.5 py-1.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0D47A1]"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <select
                      value={m.frequency}
                      onChange={(e) =>
                        onUpdate(m.id, "frequency", e.target.value)
                      }
                      className="px-2.5 py-1.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0D47A1]"
                    >
                      <option value="Once Daily">Once Daily</option>
                      <option value="Twice Daily">Twice Daily</option>
                      <option value="Thrice Daily">Thrice Daily</option>
                      <option value="Four Times Daily">Four Times Daily</option>
                      <option value="Once Nightly">Once Nightly</option>
                      <option value="As Needed (PRN)">As Needed (PRN)</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={m.duration}
                      onChange={(e) =>
                        onUpdate(m.id, "duration", e.target.value)
                      }
                      placeholder="e.g. 7 Days"
                      className="w-32 px-2.5 py-1.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0D47A1]"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={m.instructions}
                      onChange={(e) =>
                        onUpdate(m.id, "instructions", e.target.value)
                      }
                      placeholder="e.g. Take after meals"
                      className="w-full px-2.5 py-1.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0D47A1]"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onRemove(m.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineTable;
