import React from "react";
import { Stethoscope, Users, HeartPulse, CreditCard } from "lucide-react";
import type { FormValues, FormErrors } from "../hooks/useCreateStaffForm";

interface RoleAccessSectionProps {
  form: FormValues;
  errors: FormErrors;
  setFieldValue: (name: string, value: unknown) => void;
}

const ROLES_CONFIG = [
  {
    id: "DOCTOR",
    label: "Doctor",
    desc: "OPD Clinical Portal & Support",
    icon: Stethoscope,
  },
  {
    id: "RECEPTIONIST",
    label: "Receptionist",
    desc: "Patient Check-in, Queue & Bookings",
    icon: Users,
  },
  {
    id: "NURSE",
    label: "Nurse",
    desc: "Outpatient care, Vitals & Queue",
    icon: HeartPulse,
  },
  {
    id: "ACCOUNTANT",
    label: "Accountant",
    desc: "Billing, Payments & Refunds",
    icon: CreditCard,
  },
];

export const RoleAccessSection: React.FC<RoleAccessSectionProps> = ({
  form,
  errors,
  setFieldValue,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
      <h3 className="text-[#0D47A1] font-heading font-bold text-sm border-b border-slate-100 pb-2">
        1. User Role & Access
      </h3>

      <div className="space-y-3">
        <label className="block text-xs font-heading font-bold text-text-body">
          System Access Role *
        </label>

        {/* Radio Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES_CONFIG.map((role) => {
            const Icon = role.icon;
            const isSelected = form.role === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setFieldValue("role", role.id)}
                className={`border rounded-2xl p-4 flex flex-col justify-between items-start gap-3 cursor-pointer transition-colors duration-200 ${
                  isSelected
                    ? "border-[#0D47A1] bg-blue-50/50 shadow-sm text-text-dark"
                    : "border-[#E5E7EB] hover:border-slate-300 bg-white hover:bg-slate-50/30"
                }`}
              >
                <div
                  className={`p-2 rounded-xl border ${
                    isSelected
                      ? "bg-[#0D47A1]/10 border-[#0D47A1]/20 text-[#0D47A1]"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {role.label}
                  </h4>
                  <p className="font-body text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5">
                    {role.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {errors.role && (
          <p className="text-red-500 text-[10px] font-semibold mt-0.5">
            {errors.role}
          </p>
        )}
      </div>
    </div>
  );
};
export default RoleAccessSection;
