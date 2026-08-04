/**
 * PatientInsuranceCard – Displays insurance/coverage information
 */
import { Shield } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP } from "../../doctors/constants/doctors.constants";

interface PatientInsuranceCardProps {
  patient: Patient;
}

export function PatientInsuranceCard({ patient }: PatientInsuranceCardProps) {
  const insurance = patient.insuranceDetails;

  if (!insurance || (!insurance.provider && !insurance.policyNumber)) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <h4
          className="text-xs font-bold text-[#111827] mb-2"
          style={{ fontFamily: PP }}
        >
          Insurance
        </h4>
        <div className="text-xs text-[#64748B] text-center py-3">
          No insurance details on file.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Shield size={13} className="text-emerald-600" />
        </div>
        <h4
          className="text-xs font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Insurance
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {insurance.provider && (
          <div className="bg-slate-50 rounded-lg px-2.5 py-2">
            <div className="text-[10px] text-slate-400">Provider</div>
            <div className="text-xs font-medium text-[#111827]">
              {insurance.provider}
            </div>
          </div>
        )}
        {insurance.policyNumber && (
          <div className="bg-slate-50 rounded-lg px-2.5 py-2">
            <div className="text-[10px] text-slate-400">Policy Number</div>
            <div className="text-xs font-medium text-[#111827] font-mono">
              {insurance.policyNumber}
            </div>
          </div>
        )}
        {insurance.validUntil && (
          <div className="bg-slate-50 rounded-lg px-2.5 py-2">
            <div className="text-[10px] text-slate-400">Valid Until</div>
            <div className="text-xs font-medium text-[#111827]">
              {insurance.validUntil}
            </div>
          </div>
        )}
        {insurance.coverageType && (
          <div className="bg-slate-50 rounded-lg px-2.5 py-2">
            <div className="text-[10px] text-slate-400">Coverage</div>
            <div className="text-xs font-medium text-[#111827]">
              {insurance.coverageType}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
