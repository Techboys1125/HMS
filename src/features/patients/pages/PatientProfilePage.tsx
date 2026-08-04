import { useState } from "react";
import { ChevronLeft, RefreshCw } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { can } from "../utils/patientPermissions";
import type { Role } from "../utils/patientPermissions";
import { PatientProfileTab } from "../components/tabs/ProfileTab";
import { FamilyMembersTab } from "../components/tabs/FamilyMembersTab";
import { PatientAppointmentsTab } from "../components/tabs/AppointmentsTab";
import { PatientQueueTab } from "../components/tabs/QueueTab";
import { PatientPrescriptionsTab } from "../components/tabs/PrescriptionsTab";
import { PatientBillingTab } from "../components/tabs/BillingTab";

type PatientTabId = "profile" | "family" | "appointments" | "queue" | "prescriptions" | "billing";

interface PatientProfilePageProps {
  patient: Patient;
  currentRole: Role;
  onBack: () => void;
}

const TAB_CONFIG: Array<{ id: PatientTabId; label: string }> = [
  { id: "profile", label: "Profile" },
  { id: "family", label: "Family Members" },
  { id: "appointments", label: "Appointments" },
  { id: "queue", label: "Queue" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "billing", label: "Billing" },
];

export function PatientProfilePage({ patient, currentRole, onBack }: PatientProfilePageProps) {
  const [activeTab, setActiveTab] = useState<PatientTabId>("profile");
  const isOwnRecord = true;

  const visibleTabs = TAB_CONFIG.filter((tab) => {
    switch (tab.id) {
      case "profile": return can(currentRole, "viewProfile", isOwnRecord);
      case "family": return can(currentRole, "manageFamilyMembers", isOwnRecord);
      case "appointments": return can(currentRole, "viewAppointments", isOwnRecord);
      case "queue": return can(currentRole, "viewQueue", isOwnRecord);
      case "prescriptions": return can(currentRole, "viewPrescriptions", isOwnRecord);
      case "billing": return can(currentRole, "viewBilling", isOwnRecord);
      default: return false;
    }
  });

  const tabContent = (() => {
    switch (activeTab) {
      case "profile":
        return <PatientProfileTab patient={patient} isOwnProfile={isOwnRecord} canEdit={can(currentRole, "editProfile", isOwnRecord)} />;
      case "family":
        return <FamilyMembersTab patient={patient} canEdit={can(currentRole, "manageFamilyMembers", isOwnRecord)} />;
      case "appointments":
        return <PatientAppointmentsTab patient={patient} canEdit={can(currentRole, "manageAppointments", isOwnRecord)} isOwnProfile={isOwnRecord} />;
      case "queue":
        return <PatientQueueTab patient={patient} canEdit={false} isOwnProfile={isOwnRecord} />;
      case "prescriptions":
        return <PatientPrescriptionsTab patient={patient} canEdit={can(currentRole, "editPrescriptions", isOwnRecord)} isOwnProfile={isOwnRecord} />;
      case "billing":
        return <PatientBillingTab patient={patient} canEdit={can(currentRole, "manageBilling", isOwnRecord)} isOwnProfile={isOwnRecord} />;
      default:
        return null;
    }
  })();

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft size={20} className="text-[#64748B]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>{patient.fullName}</h1>
            <p className="text-xs text-[#64748B]">MRN: {patient.mrn} · {patient.gender} · {patient.age} yrs</p>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <RefreshCw size={16} className="text-[#64748B]" />
          </button>
        </div>

        <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
          {visibleTabs.map((tab) => (
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