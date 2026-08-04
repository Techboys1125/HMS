import { useState, useEffect } from "react";
import { User, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { patientApi } from "../api/patientApi";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import { can } from "../utils/patientPermissions";
import type { Role } from "../utils/patientPermissions";
import { FamilyMembersTab } from "../components/tabs/FamilyMembersTab";
import { PatientAppointmentsTab } from "../components/tabs/AppointmentsTab";
import { PatientQueueTab } from "../components/tabs/QueueTab";
import { PatientPrescriptionsTab } from "../components/tabs/PrescriptionsTab";
import { PatientBillingTab } from "../components/tabs/BillingTab";
import { PatientProfileTab } from "../components/tabs/ProfileTab";

type MyProfileTabId = "profile" | "family" | "appointments" | "queue" | "prescriptions" | "billing";

const MY_PROFILE_TABS: Array<{ id: MyProfileTabId; label: string }> = [
  { id: "profile", label: "Profile" },
  { id: "family", label: "Family" },
  { id: "appointments", label: "Appointments" },
  { id: "queue", label: "Queue" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "billing", label: "Billing" },
];

export function MyProfilePage({ currentRole, mrn }: { currentRole: Role; mrn: string }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MyProfileTabId>("profile");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    patientApi.getPatientByMrn(mrn)
      .then((data) => { if (!cancelled) setPatient(mapApiPatientToPatientRecord(data)); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [mrn]);

  const isOwn = true;

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
        <div className="flex items-center justify-center p-12">
          <div className="text-xs text-[#64748B]">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
        <div className="max-w-4xl mx-auto text-center py-12">
          <User size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-lg font-bold text-[#111827] mb-2">Profile Not Found</h2>
          <p className="text-xs text-[#64748B]">Unable to load your patient profile.</p>
        </div>
      </div>
    );
  }

  const tabContent = (() => {
    switch (activeTab) {
      case "profile":
        return <PatientProfileTab patient={patient} isOwnProfile={isOwn} canEdit={can(currentRole, "editProfile", isOwn)} />;
      case "family":
        return <FamilyMembersTab patient={patient} canEdit={can(currentRole, "manageFamilyMembers", isOwn)} />;
      case "appointments":
        return <PatientAppointmentsTab patient={patient} canEdit={can(currentRole, "manageAppointments", isOwn)} isOwnProfile={isOwn} />;
      case "queue":
        return <PatientQueueTab patient={patient} canEdit={false} isOwnProfile={isOwn} />;
      case "prescriptions":
        return <PatientPrescriptionsTab patient={patient} canEdit={can(currentRole, "editPrescriptions", isOwn)} isOwnProfile={isOwn} />;
      case "billing":
        return <PatientBillingTab patient={patient} canEdit={can(currentRole, "manageBilling", isOwn)} isOwnProfile={isOwn} />;
      default:
        return null;
    }
  })();

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
            {patient.fullName?.charAt(0) || "P"}
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>{patient.fullName}</h1>
            <p className="text-xs text-[#64748B]">MRN: {patient.mrn} · {patient.gender} · {patient.age} yrs</p>
          </div>
        </div>

        <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
          {MY_PROFILE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#0D47A1] text-[#0D47A1]"
                  : "border-transparent text-[#64748B] hover:text-[#111827]"
              }`}
              style={{ fontFamily: PP }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4">
          {tabContent}
        </div>
      </div>
    </div>
  );
}