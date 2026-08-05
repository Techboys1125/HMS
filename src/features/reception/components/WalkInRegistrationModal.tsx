import React, { useState } from "react";
import type { WalkInRegistrationPayload } from "../types/reception.types";
import { validateWalkInRegistration } from "../validation/reception.validation";
import { UserPlus, X, CheckCircle2 } from "lucide-react";

interface WalkInRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (payload: WalkInRegistrationPayload) => Promise<void>;
  departments?: Array<{ id: string | number; name: string }>;
  doctors?: Array<{ id: string | number; name: string }>;
}

export const WalkInRegistrationModal: React.FC<
  WalkInRegistrationModalProps
> = ({
  isOpen,
  onClose,
  onRegister,
  departments = [
    { id: "1", name: "Cardiology" },
    { id: "2", name: "General Medicine" },
    { id: "3", name: "Pediatrics" },
    { id: "4", name: "Neurology" },
  ],
  doctors = [
    { id: "1", name: "Dr. Alexander Fleming" },
    { id: "2", name: "Dr. Sarah Jenkins" },
    { id: "3", name: "Dr. Michael Chen" },
  ],
}) => {
  const [form, setForm] = useState<WalkInRegistrationPayload>({
    fullName: "",
    mobile: "",
    gender: "MALE",
    age: 30,
    address: "",
    departmentId: "1",
    doctorId: "1",
    consultationFee: 500,
    visitType: "WALK_IN",
    paymentMode: "CASH",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateWalkInRegistration(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onRegister(form);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <UserPlus size={18} /> Walk-In Patient Registration & Token
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-xs font-medium"
        >
          {/* Full Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white"
              />
              {errors.fullName && (
                <p className="text-red-500 text-[10px] mt-0.5">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white"
              />
              {errors.mobile && (
                <p className="text-red-500 text-[10px] mt-0.5">
                  {errors.mobile}
                </p>
              )}
            </div>
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white cursor-pointer"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Age (Years)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={form.age || 30}
                onChange={(e) =>
                  setForm({ ...form, age: Number(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white"
              />
            </div>
          </div>

          {/* Department & Doctor Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={form.departmentId}
                onChange={(e) =>
                  setForm({ ...form, departmentId: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Assigned Doctor <span className="text-red-500">*</span>
              </label>
              <select
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white cursor-pointer"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consultation Fee & Payment Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                value={form.consultationFee}
                onChange={(e) =>
                  setForm({ ...form, consultationFee: Number(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Payment Mode
              </label>
              <select
                value={form.paymentMode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentMode: e.target
                      .value as WalkInRegistrationPayload["paymentMode"],
                  })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0D47A1] focus:bg-white cursor-pointer"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI / Digital</option>
                <option value="CARD">Card</option>
                <option value="INSURANCE">Insurance TPA</option>
                <option value="PENDING">Pay Later / Pending</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#0D47A1] hover:bg-[#0c3d8a] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 size={16} /> Register & Generate Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
