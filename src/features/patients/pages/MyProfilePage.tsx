import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User } from "lucide-react";
import type { Patient } from "../types/patient.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import { can } from "../utils/patientPermissions";
import type { Role } from "../utils/patientPermissions";
import { FamilyMembersTab } from "../components/tabs/FamilyMembersTab";
import { PatientAppointmentsTab } from "../components/tabs/AppointmentsTab";
import { PatientQueueTab } from "../components/tabs/QueueTab";
import { PatientPrescriptionsTab } from "../components/tabs/PrescriptionsTab";
import { PatientBillingTab } from "../components/tabs/BillingTab";
import { PatientProfileTab } from "../components/tabs/ProfileTab";
import { PatientMedicalRecordsTab } from "../components/tabs/MedicalRecordsTab";
import { PatientReportsTab } from "../components/tabs/ReportsTab";
import { PatientProfileHeader } from "../components/PatientProfileHeader";
import { SwitchAccountDialog } from "../components/SwitchAccountDialog";
import { useSwitchAccount } from "../hooks/useSwitchAccount";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import { usePatientPortal } from "../context/usePatientPortal";
import { ROUTES } from "../../../app/routes/routes";

type MyProfileTabId =
  | "profile"
  | "family"
  | "appointments"
  | "queue"
  | "prescriptions"
  | "billing"
  | "medicalRecords"
  | "reports";

const MY_PROFILE_TABS: Array<{ id: MyProfileTabId; label: string }> = [
  { id: "profile", label: "Profile" },
  { id: "family", label: "Family" },
  { id: "appointments", label: "Appointments" },
  { id: "queue", label: "Queue" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "medicalRecords", label: "Medical Records" },
  { id: "billing", label: "Billing" },
  { id: "reports", label: "Reports" },
];

export function MyProfilePage({
  currentRole,
  mrn,
}: {
  currentRole: Role;
  mrn: string;
}) {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MyProfileTabId>("profile");
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [prevEffectiveMrn, setPrevEffectiveMrn] = useState<string | null>(null);

  const { activeMrn, switchToFamilyMember, switchToPrimary } =
    useSwitchAccount(mrn);
  const portal = usePatientPortal();
  const { data: familyMembers } = useFamilyMembers(mrn);
  const effectiveMrn = activeMrn || mrn;

  if (effectiveMrn !== prevEffectiveMrn) {
    setPrevEffectiveMrn(effectiveMrn);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .getPatientByMrn(effectiveMrn)
      .then((data) => {
        if (!cancelled) setPatient(mapApiPatientToPatientRecord(data));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [effectiveMrn]);

  const isOwn = true;
  const isFamilyMember = effectiveMrn !== mrn;

  const visibleTabs = MY_PROFILE_TABS.filter((tab) => {
    switch (tab.id) {
      case "profile":
        return can(currentRole, "viewProfile", isOwn);
      case "family":
        return can(currentRole, "manageFamilyMembers", isOwn);
      case "appointments":
        return can(currentRole, "viewAppointments", isOwn);
      case "queue":
        return can(currentRole, "viewQueue", isOwn);
      case "prescriptions":
        return can(currentRole, "viewPrescriptions", isOwn);
      case "medicalRecords":
        return can(currentRole, "viewMedicalRecords", isOwn);
      case "billing":
        return can(currentRole, "viewBilling", isOwn);
      case "reports":
        return can(currentRole, "viewReports", isOwn);
      default:
        return false;
    }
  });

  if (loading) {
    return (
      <div
        className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        <div className="flex items-center justify-center p-12">
          <div className="text-xs text-[#64748B]">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div
        className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        <div className="max-w-4xl mx-auto text-center py-12">
          <User size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-lg font-bold text-[#111827] mb-2">
            Profile Not Found
          </h2>
          <p className="text-xs text-[#64748B]">
            Unable to load your patient profile.
          </p>
        </div>
      </div>
    );
  }

  const tabContent = (() => {
    switch (activeTab) {
      case "profile":
        return (
          <PatientProfileTab
            patient={patient}
            isOwnProfile={isOwn}
            canEdit={can(currentRole, "editProfile", isOwn)}
            onSave={async (updated) => {
              await patientsApi.updatePatient(effectiveMrn, {
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
              portal?.refresh();
            }}
          />
        );
      case "family":
        return (
          <FamilyMembersTab
            patient={patient}
            canEdit={can(currentRole, "manageFamilyMembers", isOwn)}
            onAddFamilyMember={() => navigate(ROUTES.FAMILY_MEMBERS)}
          />
        );
      case "appointments":
        return (
          <PatientAppointmentsTab
            patient={patient}
            canEdit={can(currentRole, "manageAppointments", isOwn)}
            isOwnProfile={isOwn}
          />
        );
      case "queue":
        return (
          <PatientQueueTab
            patient={patient}
            canEdit={false}
            isOwnProfile={isOwn}
          />
        );
      case "prescriptions":
        return (
          <PatientPrescriptionsTab
            patient={patient}
            canEdit={can(currentRole, "editPrescriptions", isOwn)}
            isOwnProfile={isOwn}
          />
        );
      case "medicalRecords":
        return (
          <PatientMedicalRecordsTab
            patient={patient}
            canEdit={can(currentRole, "editMedicalRecords", isOwn)}
            isOwnProfile={isOwn}
          />
        );
      case "billing":
        return (
          <PatientBillingTab
            patient={patient}
            canEdit={can(currentRole, "manageBilling", isOwn)}
            isOwnProfile={isOwn}
          />
        );
      case "reports":
        return (
          <PatientReportsTab
            patient={patient}
            canEdit={false}
            isOwnProfile={isOwn}
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
        {/* Profile Header with Switch Account */}
        <PatientProfileHeader
          patient={patient}
          currentRole={currentRole}
          showSwitchAccount={can(currentRole, "switchAccount", isOwn)}
          onSwitchAccount={() => setShowSwitchDialog(true)}
          isFamilyMember={isFamilyMember}
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

      {/* Switch Account Dialog */}
      <SwitchAccountDialog
        isOpen={showSwitchDialog}
        onClose={() => setShowSwitchDialog(false)}
        familyMembers={familyMembers || []}
        activeMrn={effectiveMrn}
        primaryMrn={mrn}
        onSwitchToMember={(member) => {
          switchToFamilyMember(member);
          portal?.refresh();
        }}
        onSwitchToPrimary={() => {
          switchToPrimary();
          portal?.refresh();
        }}
      />
    </div>
  );
}
