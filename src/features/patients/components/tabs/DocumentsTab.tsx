/**
 * DocumentsTab – Patient Profile Tab for Document Management
 * Placeholder tab for future document upload and management
 */
import { FileText, Upload } from "lucide-react";
import type { Patient } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";

export interface DocumentsTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

export function PatientDocumentsTab({ canEdit }: DocumentsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Patient Documents
        </h3>
        {canEdit && (
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-white rounded-lg cursor-not-allowed opacity-50"
            style={{ backgroundColor: "#0D47A1", fontFamily: PP }}
            disabled
          >
            <Upload size={12} />
            Upload Document
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[#E5E7EB] rounded-xl bg-slate-50">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <FileText size={22} className="text-slate-300" />
        </div>
        <p
          className="text-sm font-semibold text-[#111827] mb-1"
          style={{ fontFamily: PP }}
        >
          No documents uploaded yet.
        </p>
        <p className="text-xs text-[#64748B]">
          Documents will be available here once uploaded.
        </p>
      </div>
    </div>
  );
}
