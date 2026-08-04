/**
 * PatientInfoCard – Displays core patient details in a card layout
 */
import { User, Phone, Mail, Calendar, Droplets, Heart } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP } from "../../doctors/constants/doctors.constants";

interface PatientInfoCardProps {
  patient: Patient;
  compact?: boolean;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-[#64748B]" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-slate-400">{label}</div>
        <div className="text-xs font-medium text-[#111827] truncate">
          {value}
        </div>
      </div>
    </div>
  );
}

export function PatientInfoCard({
  patient,
  compact = false,
}: PatientInfoCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <h4
        className="text-xs font-bold text-[#111827] mb-3"
        style={{ fontFamily: PP }}
      >
        Patient Information
      </h4>
      <div
        className={
          compact
            ? "space-y-1"
            : "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1"
        }
      >
        <InfoRow icon={User} label="Full Name" value={patient.fullName} />
        <InfoRow
          icon={Calendar}
          label="Date of Birth"
          value={patient.dateOfBirth}
        />
        <InfoRow icon={Phone} label="Mobile" value={patient.mobileNumber} />
        <InfoRow icon={Mail} label="Email" value={patient.email} />
        <InfoRow
          icon={Droplets}
          label="Blood Group"
          value={patient.bloodGroup}
        />
        <InfoRow
          icon={Heart}
          label="Marital Status"
          value={patient.maritalStatus}
        />
      </div>
    </div>
  );
}
