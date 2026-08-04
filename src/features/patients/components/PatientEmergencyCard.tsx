/**
 * PatientEmergencyCard – Displays emergency contact details
 */
import { AlertTriangle, Phone, User, Heart } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP } from "../../doctors/constants/doctors.constants";

interface PatientEmergencyCardProps {
  patient: Patient;
}

export function PatientEmergencyCard({ patient }: PatientEmergencyCardProps) {
  const ec = patient.emergencyContact;
  if (!ec || !ec.name) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <h4
          className="text-xs font-bold text-[#111827] mb-2"
          style={{ fontFamily: PP }}
        >
          Emergency Contact
        </h4>
        <div className="text-xs text-[#64748B] text-center py-3">
          No emergency contact on file.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
          <AlertTriangle size={13} className="text-amber-600" />
        </div>
        <h4
          className="text-xs font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Emergency Contact
        </h4>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User size={12} className="text-[#64748B]" />
          <span className="text-xs text-[#111827] font-medium">{ec.name}</span>
        </div>
        {ec.relationship && (
          <div className="flex items-center gap-2">
            <Heart size={12} className="text-[#64748B]" />
            <span className="text-xs text-[#64748B]">{ec.relationship}</span>
          </div>
        )}
        {ec.mobileNumber && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-[#64748B]" />
            <span className="text-xs text-[#111827] font-mono">
              {ec.mobileNumber}
            </span>
          </div>
        )}
        {ec.alternativeMobileNumber && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-slate-400" />
            <span className="text-xs text-[#64748B] font-mono">
              {ec.alternativeMobileNumber}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
