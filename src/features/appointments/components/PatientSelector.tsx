import React, { useEffect, useState } from "react";
import {
  User,
  Users,
  PlusCircle,
  CheckCircle2,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { appointmentsApi } from "../api/appointments.api";
import type { LinkedPatient } from "../types/appointment.types";

const PP = "Poppins, sans-serif";

interface PatientSelectorProps {
  selectedPatientId: string | number | null;
  onSelectPatient: (patient: LinkedPatient) => void;
  onAddNewFamilyMember?: () => void;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
  selectedPatientId,
  onSelectPatient,
  onAddNewFamilyMember,
}) => {
  const [patients, setPatients] = useState<LinkedPatient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchLinkedPatients = async () => {
      setLoading(true);
      try {
        const res = await appointmentsApi.getLinkedPatients();
        if (!cancelled) {
          if (res.data && res.data.length > 0) {
            setPatients(res.data);
            if (!selectedPatientId) {
              const selfPatient =
                res.data.find((p) => p.relationship === "SELF") || res.data[0];
              onSelectPatient(selfPatient);
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch linked patients:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchLinkedPatients();

    return () => {
      cancelled = true;
    };
  }, [selectedPatientId, onSelectPatient]);

  const getRelationshipBadge = (rel: string) => {
    switch (rel?.toUpperCase()) {
      case "SELF":
        return "bg-blue-100 text-[#0D47A1] border-blue-200";
      case "FATHER":
      case "MOTHER":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "CHILD":
      case "SON":
      case "DAUGHTER":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 animate-pulse text-xs text-slate-500 flex items-center gap-2">
        <Users size={16} className="text-[#0D47A1]" />
        Loading linked patient profiles...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
          style={{ fontFamily: PP }}
        >
          <Heart size={14} className="text-rose-500" />
          Who is this appointment for? *
        </label>
        <span className="text-[10px] text-slate-400 font-medium">
          User ≠ Patient Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {patients.map((p) => {
          const isSelected =
            String(selectedPatientId) === String(p.patientId) ||
            String(selectedPatientId) === String(p.id);
          return (
            <div
              key={p.id}
              onClick={() => onSelectPatient(p)}
              className={`p-3.5 rounded-xl border transition-colors cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-50/70 border-[#0D47A1] ring-2 ring-blue-100 shadow-sm"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? "bg-[#0D47A1] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.relationship === "SELF" ? (
                      <User size={15} />
                    ) : (
                      <Users size={15} />
                    )}
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold text-slate-900"
                      style={{ fontFamily: PP }}
                    >
                      {p.fullName}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      ID: {p.patientId || p.id}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 size={16} className="text-[#0D47A1] shrink-0" />
                )}
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold border ${getRelationshipBadge(p.relationship)}`}
                >
                  {p.relationship}
                </span>
                {p.gender && (
                  <span className="text-slate-400 font-medium">{p.gender}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Family Member Action */}
        {onAddNewFamilyMember && (
          <button
            type="button"
            onClick={onAddNewFamilyMember}
            className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/40 hover:border-blue-300 text-slate-600 hover:text-[#0D47A1] transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer min-h-22.5"
          >
            <PlusCircle size={18} />
            <span className="text-xs font-bold" style={{ fontFamily: PP }}>
              + Add Family Member
            </span>
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
        <ShieldCheck size={12} className="text-[#66BB6A]" />
        Appointments will be issued directly to the selected patient's official
        hospital record.
      </p>
    </div>
  );
};

export default PatientSelector;
