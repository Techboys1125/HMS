import { useState, useEffect } from "react";
import { ChevronRight, Search, RefreshCw, UserPlus } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { patientApi } from "../api/patientApi";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import { can } from "../utils/patientPermissions";
import type { Role } from "../utils/patientPermissions";
import { PatientTable } from "../components/PatientTable";
import { PatientFilters } from "../components/PatientFilters";
import { PatientProfilePage } from "./PatientProfilePage";
import { RegisterPatientScreen } from "./RegisterPatientScreen";
import { EditPatientScreen } from "./EditPatientScreen";

export function PatientListPage({ currentRole, onNavigate }: { currentRole: Role; onNavigate?: (path: string) => void }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [activePatients, setActivePatients] = useState(0);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [registering, setRegistering] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientApi.listPatients();
      const records = response.items.map(mapApiPatientToPatientRecord);
      setPatients(records);
      setTotalPatients(response.total);
      setActivePatients(records.filter((p) => p.status === "ACTIVE").length);
    } catch (err) {
      console.warn("Failed to fetch patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.mrn?.toLowerCase().includes(q) ||
      p.fullName?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.mobileNumber?.toLowerCase().includes(q)
    );
  });

  const canRegister = can(currentRole, "register");
  const canEdit = can(currentRole, "editProfile");
  const canView = can(currentRole, "viewProfile");

  if (viewingPatient) {
    return (
      <PatientProfilePage
        patient={viewingPatient}
        currentRole={currentRole}
        onBack={() => setViewingPatient(null)}
      />
    );
  }

  if (registering) {
    return (
      <RegisterPatientScreen
        onBack={() => setRegistering(false)}
        onSuccess={(p) => {
          setRegistering(false);
          fetchPatients();
          setViewingPatient(p);
        }}
      />
    );
  }

  if (editingPatient) {
    return (
      <EditPatientScreen
        patient={editingPatient}
        onBack={() => setEditingPatient(null)}
        onSuccess={(p) => {
          setEditingPatient(null);
          fetchPatients();
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Management</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Patients</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Patient List</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button onClick={fetchPatients} className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm">
            <RefreshCw size={13} className={loading ? "animate-spin text-[#0D47A1]" : ""} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
          {canRegister && (
            <button onClick={() => setRegistering(true)} className="px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm shrink-0">
              <UserPlus size={15} /> Register Patient
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="text-xs text-[#64748B] font-medium">Total Patients</div>
          <div className="text-2xl font-bold text-[#111827] mt-0.5">{totalPatients}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="text-xs text-[#64748B] font-medium">Active</div>
          <div className="text-2xl font-bold text-[#009688] mt-0.5">{activePatients}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="text-xs text-[#64748B] font-medium">Search</div>
          <div className="mt-1">
            <input type="text" placeholder="Search MRN, name, phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]" />
          </div>
        </div>
      </div>

      <PatientFilters />

      <PatientTable
        patients={filteredPatients}
        isLoading={loading}
        onView={(p) => setViewingPatient(p)}
        onEdit={canEdit ? ((p) => setEditingPatient(p)) : undefined}
        canEdit={canEdit}
        canView={canView}
      />
    </div>
  );
}