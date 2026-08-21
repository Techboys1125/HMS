import { useState, useCallback, useEffect } from "react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { can } from "../utils/patientPermissions";
import type { Role } from "../utils/patientPermissions";
import { OverviewTab } from "../components/tabs/OverviewTab";
import { PatientAppointmentsTab } from "../components/tabs/AppointmentsTab";
import { PatientMedicalRecordsTab } from "../components/tabs/MedicalRecordsTab";
import { VisitHistoryTab } from "../components/tabs/VisitHistoryTab";
import { PatientPrescriptionsTab } from "../components/tabs/PrescriptionsTab";
import { PatientBillingTab } from "../components/tabs/BillingTab";
import { PatientDocumentsTab } from "../components/tabs/DocumentsTab";
import { PatientProfileHeader } from "../components/PatientProfileHeader";
import { patientsApi } from "../api/patient.api";

type PatientTabId =
  | "overview"
  | "appointments"
  | "medicalHistory"
  | "visitHistory"
  | "prescriptions"
  | "billing"
  | "documents";

interface PatientProfilePageProps {
  patient: Patient;
  currentRole: Role;
  onBack: () => void;
  onBookAppointment?: (mrn?: string) => void;
  onEdit?: () => void;
}

const TAB_CONFIG: Array<{ id: PatientTabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "appointments", label: "Appointments" },
  { id: "medicalHistory", label: "Medical History" },
  { id: "visitHistory", label: "Visit History" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "billing", label: "Billing & Payments" },
  { id: "documents", label: "Documents" },
];

export function PatientProfilePage({
  patient,
  currentRole,
  onBack,
  onBookAppointment,
  onEdit,
}: PatientProfilePageProps) {
  const [activeTab, setActiveTab] = useState<PatientTabId>("overview");
  const [profileData, setProfileData] = useState<Patient>(patient);
  const isOwnRecord = currentRole === "PATIENT";

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .getPatientByMrn(patient.mrn)
      .then((detail) => {
        if (!cancelled && detail) {
          setProfileData((prev) => ({ ...prev, ...detail }));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [patient.mrn]);

  const handleNavigateToTab = useCallback((tabId: string) => {
    setActiveTab(tabId as PatientTabId);
  }, []);

  const visibleTabs = TAB_CONFIG.filter((tab) => {
    switch (tab.id) {
      case "overview":
        return can(currentRole, "viewProfile", isOwnRecord);
      case "appointments":
        return can(currentRole, "viewAppointments", isOwnRecord);
      case "medicalHistory":
        return can(currentRole, "viewMedicalRecords", isOwnRecord);
      case "visitHistory":
        return can(currentRole, "viewAppointments", isOwnRecord);
      case "prescriptions":
        return can(currentRole, "viewPrescriptions", isOwnRecord);
      case "billing":
        return can(currentRole, "viewBilling", isOwnRecord);
      case "documents":
        return can(currentRole, "viewProfile", isOwnRecord);
      default:
        return false;
    }
  });

  const currentPatient = { ...patient, ...profileData };

  const tabContent = (() => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            patient={currentPatient}
            onNavigateToTab={handleNavigateToTab}
          />
        );
      case "appointments":
        return (
          <PatientAppointmentsTab
            patient={currentPatient}
            canEdit={can(currentRole, "manageAppointments", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      case "medicalHistory":
        return (
          <PatientMedicalRecordsTab
            patient={currentPatient}
            canEdit={can(currentRole, "editMedicalRecords", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      case "visitHistory":
        return (
          <VisitHistoryTab
            patient={currentPatient}
            isOwnProfile={isOwnRecord}
          />
        );
      case "prescriptions":
        return (
          <PatientPrescriptionsTab
            patient={currentPatient}
            canEdit={can(currentRole, "editPrescriptions", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      case "billing":
        return (
          <PatientBillingTab
            patient={currentPatient}
            canEdit={can(currentRole, "manageBilling", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      case "documents":
        return (
          <PatientDocumentsTab
            patient={currentPatient}
            canEdit={can(currentRole, "editProfile", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Profile Header */}
        <PatientProfileHeader
          patient={currentPatient}
          currentRole={currentRole}
          onBack={onBack}
          onEdit={
            can(currentRole, "editProfile", isOwnRecord) ? onEdit : undefined
          }
          onBookAppointment={
            can(currentRole, "manageAppointments", isOwnRecord) &&
            onBookAppointment
              ? () => onBookAppointment(currentPatient.mrn)
              : undefined
          }
        />

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E7EB] overflow-x-auto bg-white rounded-t-2xl px-2">
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

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl rounded-t-none border border-[#E5E7EB] border-t-0 shadow-sm p-5">
          {tabContent}
        </div>
      </div>
    </div>
  );
}
