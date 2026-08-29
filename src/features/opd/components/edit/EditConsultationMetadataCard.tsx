import React from "react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface EditConsultationMetadataCardProps {
  consultationId: string;
  appointmentId?: string | number;
  doctorName: string;
  department: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedBy: string;
  lastUpdatedDate: string;
  revisionNumber: number;
}

export const EditConsultationMetadataCard: React.FC<
  EditConsultationMetadataCardProps
> = ({
  consultationId,
  appointmentId,
  doctorName,
  department,
  status,
  createdBy,
  createdDate,
  lastUpdatedBy,
  lastUpdatedDate,
  revisionNumber,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <h3
            className="text-sm font-bold text-slate-800"
            style={{ fontFamily: PP }}
          >
            Consultation Metadata & Revision Info
          </h3>
        </div>
        <span
          className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-50 text-amber-700 border border-amber-200 uppercase"
          style={{ fontFamily: PP }}
        >
          REVISION MODE (v{revisionNumber})
        </span>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 text-xs pt-1"
        style={{ fontFamily: RB }}
      >
        <div>
          <span
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            style={{ fontFamily: PP }}
          >
            Consultation ID
          </span>
          <p className="font-mono font-bold text-[#0D47A1] text-xs">
            {consultationId.startsWith("ENC-") ||
            consultationId.startsWith("CNS-")
              ? consultationId
              : `CNS-${consultationId}`}
          </p>
        </div>

        <div>
          <span
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            style={{ fontFamily: PP }}
          >
            Appointment ID
          </span>
          <p className="font-mono font-bold text-slate-700 text-xs">
            {appointmentId &&
            String(appointmentId) !== "0" &&
            String(appointmentId) !== ""
              ? String(appointmentId).startsWith("APT-")
                ? appointmentId
                : `APT-${appointmentId}`
              : "—"}
          </p>
        </div>

        <div>
          <span
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            style={{ fontFamily: PP }}
          >
            Doctor
          </span>
          <p className="font-semibold text-slate-800 text-xs">
            {doctorName || "—"}
          </p>
        </div>

        <div>
          <span
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            style={{ fontFamily: PP }}
          >
            Department
          </span>
          <p className="font-semibold text-slate-800 text-xs">
            {department || "—"}
          </p>
        </div>

        <div>
          <span
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            style={{ fontFamily: PP }}
          >
            Status
          </span>
          <span
            className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#66BB6A] border border-green-200"
            style={{ fontFamily: PP }}
          >
            {status}
          </span>
        </div>

        <div>
          <span
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            style={{ fontFamily: PP }}
          >
            Created By / Date
          </span>
          <p className="font-medium text-slate-700 truncate">{createdBy}</p>
          <p className="text-[11px] text-slate-500">{createdDate}</p>
        </div>

        <div>
          <span
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            style={{ fontFamily: PP }}
          >
            Last Updated By / Date
          </span>
          <p className="font-medium text-slate-700 truncate">{lastUpdatedBy}</p>
          <p className="text-[11px] text-slate-500">{lastUpdatedDate}</p>
        </div>

        <div>
          <span
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
            style={{ fontFamily: PP }}
          >
            Revision #
          </span>
          <p className="font-bold text-amber-700 text-xs">v{revisionNumber}</p>
        </div>
      </div>
    </div>
  );
};
