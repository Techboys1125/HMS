import { useState, useEffect } from "react";
import { ChevronLeft, Search, Filter } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import { PatientBillingTab } from "../components/tabs/BillingTab";

export function AccountantPatientBillingPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    patientsApi
      .listPatients({ status: "ACTIVE" })
      .then((response) => {
        if (!cancelled) {
          setPatients(response.items.map(mapApiPatientToPatientRecord));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = patients.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.mrn?.toLowerCase().includes(q) ||
      p.fullName?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });

  if (selectedPatient) {
    return (
      <div
        className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => setSelectedPatient(null)}
            className="flex items-center gap-2 text-xs text-[#64748B] hover:text-[#0D47A1] transition-colors"
          >
            <ChevronLeft size={16} /> Back to list
          </button>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 mb-4">
            <h2
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {selectedPatient.fullName}
            </h2>
            <p className="text-xs text-[#64748B]">
              MRN: {selectedPatient.mrn} · {selectedPatient.gender} ·{" "}
              {selectedPatient.age} yrs
            </p>
          </div>
          <PatientBillingTab
            patient={selectedPatient}
            canEdit={true}
            isOwnProfile={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1
            className="text-lg font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Patient Billing
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search MRN, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
            Loading patients...
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((patient) => (
              <div
                key={patient.mrn}
                onClick={() => setSelectedPatient(patient)}
                className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                    {patient.fullName?.charAt(0) || "P"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">
                      {patient.fullName}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      MRN: {patient.mrn} · {patient.gender} · {patient.age} yrs
                    </div>
                  </div>
                </div>
                <Filter size={14} className="text-[#0D47A1]" />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-xs text-[#64748B]">
                No patients found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
