import { useState } from "react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { patientsApi } from "../api/patient.api";
import { can } from "../utils/patientPermissions";
import type { Role } from "../utils/patientPermissions";
import { PatientProfileTab } from "../components/tabs/ProfileTab";
import { FamilyMembersTab } from "../components/tabs/FamilyMembersTab";
import { PatientAppointmentsTab } from "../components/tabs/AppointmentsTab";
import { PatientQueueTab } from "../components/tabs/QueueTab";
import { PatientPrescriptionsTab } from "../components/tabs/PrescriptionsTab";
import { PatientBillingTab } from "../components/tabs/BillingTab";
import { PatientMedicalRecordsTab } from "../components/tabs/MedicalRecordsTab";
import { PatientReportsTab } from "../components/tabs/ReportsTab";
import { PatientProfileHeader } from "../components/PatientProfileHeader";

type PatientTabId =
  | "profile"
  | "family"
  | "appointments"
  | "queue"
  | "prescriptions"
  | "medicalRecords"
  | "billing"
  | "reports";

interface PatientProfilePageProps {
  patient: Patient;
  currentRole: Role;
  onBack: () => void;
  onBookAppointment?: (mrn?: string) => void;
  onEdit?: () => void;
}

const TAB_CONFIG: Array<{ id: PatientTabId; label: string }> = [
  { id: "profile", label: "Profile" },
  { id: "family", label: "Family Members" },
  { id: "appointments", label: "Appointments" },
  { id: "queue", label: "Queue" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "medicalRecords", label: "Medical Records" },
  { id: "billing", label: "Billing" },
  { id: "reports", label: "Reports" },
];

export function PatientProfilePage({
  patient,
  currentRole,
  onBack,
  onBookAppointment,
  onEdit,
}: PatientProfilePageProps) {
  const [activeTab, setActiveTab] = useState<PatientTabId>("profile");
  const isOwnRecord = currentRole === "PATIENT";

  const visibleTabs = TAB_CONFIG.filter((tab) => {
    switch (tab.id) {
      case "profile":
        return can(currentRole, "viewProfile", isOwnRecord);
      case "family":
        return can(currentRole, "manageFamilyMembers", isOwnRecord);
      case "appointments":
        return can(currentRole, "viewAppointments", isOwnRecord);
      case "queue":
        return can(currentRole, "viewQueue", isOwnRecord);
      case "prescriptions":
        return can(currentRole, "viewPrescriptions", isOwnRecord);
      case "medicalRecords":
        return can(currentRole, "viewMedicalRecords", isOwnRecord);
      case "billing":
        return can(currentRole, "viewBilling", isOwnRecord);
      case "reports":
        return can(currentRole, "viewReports", isOwnRecord);
      default:
        return false;
    }
  });

  const tabContent = (() => {
    switch (activeTab) {
      case "profile":
        return (
          <PatientProfileTab
            patient={patient}
            isOwnProfile={isOwnRecord}
            canEdit={can(currentRole, "editProfile", isOwnRecord)}
            onSave={async (updated) => {
              await patientsApi.updatePatient(patient.mrn, {
                fullName: updated.fullName || updated.name || "",
                mobileNumber:
                  updated.mobileNumber || updated.phone || updated.mobile || "",
                email: updated.email,
                gender: updated.gender,
                dateOfBirth: updated.dateOfBirth || updated.dob,
                address:
                  typeof updated.address === "string" ? updated.address : "",
                bloodGroup: updated.bloodGroup,
                maritalStatus: updated.maritalStatus,
                knownAllergies: (updated.knownAllergies || []).join(", "),
                chronicDiseases: (updated.chronicDiseases || []).join(", "),
                specialNotes: updated.specialNotes,
                emergencyContact: updated.emergencyContact
                  ? typeof updated.emergencyContact === "string"
                    ? updated.emergencyContact
                    : [
                        updated.emergencyContact.name ||
                          updated.emergencyContact.contactName ||
                          "",
                        updated.emergencyContact.relationship || "",
                        updated.emergencyContact.phone ||
                          updated.emergencyContact.contactNumber ||
                          updated.emergencyContact.mobile ||
                          updated.emergencyContact.mobileNumber ||
                          "",
                      ]
                        .filter(Boolean)
                        .join(", ")
                  : "",
              });
            }}
          />
        );
      case "family":
        return (
          <FamilyMembersTab
            patient={patient}
            canEdit={can(currentRole, "manageFamilyMembers", isOwnRecord)}
          />
        );
      case "appointments":
        return (
          <PatientAppointmentsTab
            patient={patient}
            canEdit={can(currentRole, "manageAppointments", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      case "queue":
        return (
          <PatientQueueTab
            patient={patient}
            canEdit={false}
            isOwnProfile={isOwnRecord}
          />
        );
      case "prescriptions":
        return (
          <PatientPrescriptionsTab
            patient={patient}
            canEdit={can(currentRole, "editPrescriptions", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      case "medicalRecords":
        return (
          <PatientMedicalRecordsTab
            patient={patient}
            canEdit={can(currentRole, "editMedicalRecords", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      case "billing":
        return (
          <PatientBillingTab
            patient={patient}
            canEdit={can(currentRole, "manageBilling", isOwnRecord)}
            isOwnProfile={isOwnRecord}
          />
        );
      case "reports":
        return (
          <PatientReportsTab
            patient={patient}
            canEdit={false}
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
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Profile Header */}
        <PatientProfileHeader
          patient={patient}
          currentRole={currentRole}
          onBack={onBack}
          onEdit={
            can(currentRole, "editProfile", isOwnRecord) ? onEdit : undefined
          }
          onBookAppointment={
            can(currentRole, "manageAppointments", isOwnRecord) &&
            onBookAppointment
              ? () => onBookAppointment(patient.mrn)
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
