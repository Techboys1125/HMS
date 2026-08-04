import { useState, useEffect } from "react";
import type { Patient } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { patientsApi } from "../../api/patient.api";

export interface QueueTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

export function PatientQueueTab({ patient }: QueueTabProps) {
  const [queueData, setQueueData] = useState<{
    queueStatus: string;
    position?: number;
    token?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    patientsApi
      .getPatientQueue(patient.mrn)
      .then((data) => {
        if (!cancelled) setQueueData(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patient.mrn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading queue status...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3
        className="text-sm font-bold text-[#111827]"
        style={{ fontFamily: PP }}
      >
        Queue Status
      </h3>

      {queueData ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Status</span>
            <span className="text-xs font-bold text-[#111827] capitalize">
              {queueData.queueStatus || "—"}
            </span>
          </div>
          {queueData.position && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Position</span>
              <span className="text-xs font-bold text-[#0D47A1]">
                #{queueData.position}
              </span>
            </div>
          )}
          {queueData.token && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Token</span>
              <span className="text-xs font-mono font-bold text-[#111827]">
                {queueData.token}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-[#64748B]">
          No queue data available.
        </div>
      )}
    </div>
  );
}
