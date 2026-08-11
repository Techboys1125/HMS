import { useState, useMemo } from "react";
import {
  Calendar,
  Search,
  UserPlus,
  Users,
  TrendingUp,
  Clock,
  UserX,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Droplets,
  Phone,
  Stethoscope,
  Edit,
  Receipt,
  Printer,
  Activity,
  Pill,
  FileText,
  MoreVertical,
  Download,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { usePatients, useDoctorPatients } from "../hooks/usePatients";
import { PP, RB } from "../constants/patient.mock";
import { PatientTable } from "../components/PatientTable";
import { usePermissions } from "../../../permissions";
import type { Patient, ScreenPatient } from "../types/patient.types";
import { RegisterPatientScreen } from "./RegisterPatientScreen";
import { BookAppointmentDrawer } from "../../appointments/components/BookAppointmentDrawer";
import {
  DeactivatePatientDialog,
  ActivatePatientDialog,
} from "../components/PatientStatusDialogs";
import { patientsApi } from "../api/patient.api";
import { Avatar } from "../components/Avatar";
import { StatusBadge } from "../components/StatusBadges";
import {
  ProfileBookApptDrawer,
  ProfileApptDetailsDrawer,
  ProfileInvoiceDrawer,
  ProfileDocDrawer,
  ProfileVisitDetailsDrawer,
  EditPatientInformationDrawer,
  RegisterPatientDrawer,
} from "../components/PatientDrawers";

interface ApptDetail {
  id?: string;
  status?: string;
  doctor?: string;
  department?: string;
  date?: string;
  time?: string;
  type?: string;
  notes?: string;
}

interface InvoiceDetail {
  id?: string;
  date?: string;
  status?: string;
  description?: string;
  amount?: number;
  [key: string]: unknown;
}

interface DocDetail {
  title?: string;
  category?: string;
  date?: string;
  size?: string;
  doctor?: string;
  [key: string]: unknown;
}

interface VisitDetail {
  id?: string;
  date?: string;
  time?: string;
  doctor?: string;
  department?: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatmentSummary?: string;
  rxStatus?: string;
  billingStatus?: string;
}

const mockAppointments = [
  {
    id: "APT-1024",
    doctor: "Dr. A. Mehta",
    department: "Cardiology",
    date: "2024-03-15",
    time: "10:30 AM",
    status: "Scheduled",
  },
  {
    id: "APT-1018",
    doctor: "Dr. P. Sharma",
    department: "General Medicine",
    date: "2024-03-28",
    time: "02:00 PM",
    status: "Scheduled",
  },
  {
    id: "APT-0982",
    doctor: "Dr. A. Mehta",
    department: "Cardiology",
    date: "2024-03-12",
    time: "09:45 AM",
    status: "Completed",
  },
];

const mockPrescriptions = [
  {
    id: "RX-89201",
    doctor: "Dr. A. Mehta",
    date: "2024-03-12",
    meds: [
      {
        name: "Lisinopril 10mg",
        dosage: "1 tablet daily",
        duration: "30 days",
        instructions: "Take in the morning with water",
      },
      {
        name: "Metformin 500mg",
        dosage: "1 tablet twice daily",
        duration: "60 days",
        instructions: "Take with meals",
      },
      {
        name: "Atorvastatin 20mg",
        dosage: "1 tablet at bedtime",
        duration: "30 days",
        instructions: "Avoid grapefruit juice",
      },
    ],
  },
];

const mockInvoices = [
  {
    id: "INV-80901",
    date: "2024-03-12",
    description: "Cardiology OPD Consultation & ECG Test Fee",
    amount: 125.0,
    dueDate: "2024-03-26",
    status: "Pending",
  },
  {
    id: "INV-80842",
    date: "2024-02-10",
    description: "General OPD Consultation & Blood Profile",
    amount: 220.0,
    dueDate: "2024-02-24",
    status: "Paid",
  },
];

const mockDocuments = [
  {
    id: "DOC-001",
    name: "Patient Registration Form.pdf",
    title: "Patient Registration Form.pdf",
    date: "Mar 12, 2024",
    size: "1.8 MB",
  },
  {
    id: "DOC-002",
    name: "ECG Report Summary.pdf",
    title: "ECG Report Summary.pdf",
    date: "Mar 12, 2024",
    size: "2.4 MB",
  },
  {
    id: "DOC-003",
    name: "Lab Results - Blood Profile.pdf",
    title: "Lab Results - Blood Profile.pdf",
    date: "Feb 10, 2024",
    size: "1.2 MB",
  },
];

const mockVisits = [
  {
    id: "VIS-2024-001",
    date: "2024-03-12",
    doctor: "Dr. A. Mehta",
    department: "Cardiology",
    diagnosis: "Primary Essential Hypertension",
    treatmentSummary: "Oral anti-hypertensive daily (Lisinopril 10mg)",
    rxStatus: "Issued",
    billingStatus: "Paid",
  },
  {
    id: "VIS-2024-002",
    date: "2024-02-10",
    doctor: "Dr. P. Sharma",
    department: "General Medicine",
    diagnosis: "Type 2 Diabetes Mellitus",
    treatmentSummary: "Dietary control & Metformin 500mg BD",
    rxStatus: "Issued",
    billingStatus: "Paid",
  },
  {
    id: "VIS-2023-089",
    date: "2023-11-14",
    doctor: "Dr. R. Kapoor",
    department: "Neurology",
    diagnosis: "Mild Bronchial Asthma",
    treatmentSummary: "Inhaler PRN during seasonal exacerbation",
    rxStatus: "Pending",
    billingStatus: "Paid",
  },
  {
    id: "VIS-2023-045",
    date: "2023-08-05",
    doctor: "Dr. S. Patel",
    department: "Gynecology",
    diagnosis: "Routine Health Screening",
    treatmentSummary: "Normal vitals, general wellness guidance",
    rxStatus: "Pending",
    billingStatus: "Not Paid",
  },
];

export function PatientSearchScreen({
  onPatientSelect,
  onRegisterClick,
  onBookAppointmentClick,
  onEditPatientClick,
  userRole,
}: {
  onBack?: () => void;
  onPatientSelect?: (mrn: string) => void;
  onRegisterClick?: () => void;
  onBookAppointmentClick?: (mrn: string) => void;
  onEditPatientClick?: (patient: Patient) => void;
  onCheckInClick?: (mrn: string) => void;
  userRole?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [regTypeFilter, setRegTypeFilter] = useState("All Types");
  const [genderFilter, setGenderFilter] = useState("All Genders");
  const [regDateFilter, setRegDateFilter] = useState("All Dates");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(
    null,
  );
  const [registering, setRegistering] = useState(false);
  const [showBookDrawer, setShowBookDrawer] = useState(false);
  const [deactivatePatient, setDeactivatePatient] = useState<Patient | null>(
    null,
  );
  const [activatePatient, setActivatePatient] = useState<Patient | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Viewing Patient Profile/Details states
  const [viewingPatientMrn, setViewingPatientMrn] = useState<string | null>(
    null,
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false);
  const [isRegisterDrawerOpen, setIsRegisterDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<ApptDetail | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(
    null,
  );
  const [selectedDoc, setSelectedDoc] = useState<DocDetail | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<VisitDetail | null>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Visit history search/filters
  const [visitSearch, setVisitSearch] = useState("");
  const [visitDoctorFilter, setVisitDoctorFilter] = useState("All Doctors");
  const [visitDeptFilter, setVisitDeptFilter] = useState("All Departments");
  const [visitDateFilter, setVisitDateFilter] = useState("All Time");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "appointments", label: "Appointments" },
    { id: "medical-history", label: "Medical History" },
    { id: "visit-history", label: "Visit History" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "billing-payments", label: "Billing & Payments" },
    { id: "documents", label: "Documents" },
  ];

  const filteredVisits = useMemo(() => {
    return mockVisits.filter((v) => {
      const q = visitSearch.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        v.id.toLowerCase().includes(q) ||
        v.doctor.toLowerCase().includes(q) ||
        v.diagnosis.toLowerCase().includes(q);

      const matchDoctor =
        visitDoctorFilter === "All Doctors" || v.doctor === visitDoctorFilter;
      const matchDept =
        visitDeptFilter === "All Departments" ||
        v.department === visitDeptFilter;

      return matchSearch && matchDoctor && matchDept;
    });
  }, [visitSearch, visitDoctorFilter, visitDeptFilter]);

  const permissions = usePermissions();
  const activeRole = (
    userRole ||
    permissions.role ||
    "RECEPTIONIST"
  ).toUpperCase();

  // Backend API connection - use different hook for Doctor role
  const isDoctorRole = activeRole === "DOCTOR";

  const { data: generalPatientsResponse, isLoading: isGeneralLoading } =
    usePatients(undefined, { enabled: !isDoctorRole });
  const { data: doctorPatientsResponse, isLoading: isDoctorLoading } =
    useDoctorPatients(undefined, { enabled: isDoctorRole });

  const patientsResponse = isDoctorRole
    ? doctorPatientsResponse
    : generalPatientsResponse;
  const isLoading = isDoctorRole ? isDoctorLoading : isGeneralLoading;

  const dbPatients = useMemo(
    () => patientsResponse?.items ?? [],
    [patientsResponse],
  );

  // Dynamic KPI Stats calculation from API patient data
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const totalPatients = dbPatients.length;
    const newRegistrationsToday = dbPatients.filter(
      (p) =>
        typeof p.registrationDate === "string" &&
        p.registrationDate.startsWith(todayStr),
    ).length;
    const activePatients = dbPatients.filter(
      (p) =>
        p.status !== "Inactive" &&
        p.status !== "INACTIVE" &&
        p.status !== "Deceased",
    ).length;
    const inactivePatients = dbPatients.filter(
      (p) =>
        p.status === "Inactive" ||
        p.status === "INACTIVE" ||
        p.status === "Deceased",
    ).length;

    return {
      totalPatients,
      newRegistrationsToday,
      activePatients,
      inactivePatients,
    };
  }, [dbPatients]);

  // Filter Logic over DB Patients
  const filteredPatients = dbPatients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const mrnStr = (p.mrn || String(p.id)).toLowerCase();
    const nameStr = (p.patientName || p.name || "").toLowerCase();
    const phoneStr = (p.phone || "").toLowerCase();

    const matchSearch =
      q === "" ||
      mrnStr.includes(q) ||
      nameStr.includes(q) ||
      phoneStr.includes(q);

    const pStatus = p.status || "ACTIVE";
    const pGender = p.gender || "MALE";
    const pRegType = p.registrationType || "WALK_IN";

    const matchStatus =
      statusFilter === "All Statuses" ||
      pStatus.toUpperCase() === statusFilter.toUpperCase().replace("-", "_");
    const matchType =
      regTypeFilter === "All Types" ||
      pRegType.toUpperCase() ===
        regTypeFilter.toUpperCase().replace(/\s+/g, "_");
    const matchGender =
      genderFilter === "All Genders" ||
      pGender.toUpperCase() === genderFilter.toUpperCase() ||
      (genderFilter === "Female" && pGender === "F") ||
      (genderFilter === "Male" && pGender === "M");
    const matchDate =
      regDateFilter === "All Dates" ||
      (regDateFilter === "Today" &&
        p.registrationDate &&
        p.registrationDate.startsWith(new Date().toISOString().split("T")[0]));

    // Only show patients to the doctor after vitals have been completed
    const matchDoctorVisibility =
      !isDoctorRole ||
      (pStatus !== "WAITING_FOR_VITALS" &&
        pStatus !== "CHECKED_IN" &&
        pStatus !== "SCHEDULED");

    return (
      matchSearch &&
      matchStatus &&
      matchType &&
      matchGender &&
      matchDate &&
      matchDoctorVisibility
    );
  });

  const selectedPatient =
    dbPatients.find((p) => (p.mrn || String(p.id)) === selectedPatientId) ||
    filteredPatients[0];

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Statuses");
    setRegTypeFilter("All Types");
    setGenderFilter("All Genders");
    setRegDateFilter("All Dates");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "All Statuses" ||
    regTypeFilter !== "All Types" ||
    genderFilter !== "All Genders" ||
    regDateFilter !== "All Dates";

  // RBAC permission checks for action buttons
  const canRegister =
    permissions.can("PATIENT_CREATE") ||
    activeRole === "RECEPTIONIST" ||
    activeRole.includes("ADMIN");
  const canBook =
    permissions.can("APPOINTMENT_CREATE") ||
    activeRole === "RECEPTIONIST" ||
    activeRole.includes("ADMIN") ||
    activeRole === "DOCTOR";

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      setRegistering(true);
    }
  };

  const handleBookClick = () => {
    const targetMrn = selectedPatient
      ? selectedPatient.mrn || String(selectedPatient.id)
      : "";
    if (onBookAppointmentClick) {
      onBookAppointmentClick(targetMrn);
    } else {
      setShowBookDrawer(true);
    }
  };

  const handleConfirmActivate = async () => {
    if (!activatePatient) return;
    setIsUpdatingStatus(true);
    try {
      const targetId = (activatePatient.mrn || activatePatient.id) as
        string | number;
      await patientsApi.update(targetId, { status: "ACTIVE" });
      setActivatePatient(null);
    } catch (err) {
      console.warn("Failed to activate patient:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivatePatient) return;
    setIsUpdatingStatus(true);
    try {
      const targetId = (deactivatePatient.mrn || deactivatePatient.id) as
        string | number;
      await patientsApi.update(targetId, { status: "INACTIVE" });
      setDeactivatePatient(null);
    } catch (err) {
      console.warn("Failed to deactivate patient:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (registering) {
    return (
      <RegisterPatientScreen
        onBack={() => setRegistering(false)}
        onViewProfile={(mrn) => {
          setRegistering(false);
          if (onPatientSelect) onPatientSelect(mrn);
        }}
      />
    );
  }

  if (viewingPatientMrn) {
    const currentDetailedPatient = dbPatients.find(
      (p) => (p.mrn || String(p.id)) === viewingPatientMrn,
    );
    const detailedPatientName =
      currentDetailedPatient?.fullName ||
      currentDetailedPatient?.name ||
      "Sarah Mitchell";
    const detailedPatientMrn =
      currentDetailedPatient?.mrn ||
      String(currentDetailedPatient?.id || "PT-2024-001");
    const detailedPatientAge = currentDetailedPatient?.age || 34;
    const detailedPatientGender = currentDetailedPatient?.gender || "Female";
    const detailedPatientBloodGroup =
      currentDetailedPatient?.bloodGroup || "O+";
    const detailedPatientPhone =
      currentDetailedPatient?.phone ||
      currentDetailedPatient?.mobileNumber ||
      "+1 (555) 234-5678";
    const detailedPatientStatus = currentDetailedPatient?.status || "Active";
    const detailedPatientAssignedDoctor =
      currentDetailedPatient?.assignedDoctor || "Dr. A. Mehta";
    const detailedPatientVisitCount =
      currentDetailedPatient?.visitCount ||
      currentDetailedPatient?.totalVisits ||
      12;
    const detailedPatientLastVisit =
      currentDetailedPatient?.lastVisitDate ||
      currentDetailedPatient?.lastVisit ||
      "Mar 12, 2024";
    const detailedPatientNextAppointment =
      currentDetailedPatient?.nextAppointmentDate || "N/A";

    const role = activeRole.toLowerCase().replace("_", "-");

    const handleBackDetails = () => {
      setViewingPatientMrn(null);
    };

    const mapToScreenPatient = (
      p: Patient | undefined,
    ): ScreenPatient | null => {
      if (!p) return null;
      return {
        id: String(p.id ?? p.mrn),
        name: p.fullName || p.name || "",
        age: p.age || 0,
        gender:
          p.gender === "MALE" || p.gender === "M"
            ? "M"
            : p.gender === "FEMALE" || p.gender === "F"
              ? "F"
              : "Other",
        mobile: p.phone || p.mobileNumber || p.mobile || "",
        doctor: p.assignedDoctor || "",
        department: "",
        visitType: "",
        regDate: p.registrationDate || "",
        status:
          p.status === "ACTIVE" || p.status === "Active"
            ? "Active"
            : p.status === "INACTIVE" || p.status === "Inactive"
              ? "Inactive"
              : "Discharged",
        photo: p.photo || p.photoUrl,
        emergencyContact: p.emergencyContact
          ? {
              name:
                p.emergencyContact.name || p.emergencyContact.contactName || "",
              relationship: p.emergencyContact.relationship || "",
              phone:
                p.emergencyContact.phone ||
                p.emergencyContact.contactNumber ||
                p.emergencyContact.mobile ||
                "",
            }
          : undefined,
      };
    };

    return (
      <div
        className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        {/* Toast Feedback Notification Banner */}
        {toastMsg && (
          <div
            className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2"
            style={{ fontFamily: RB }}
          >
            <CheckCircle2 size={16} className="text-[#66BB6A] shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* DRAWERS */}
        <ProfileBookApptDrawer
          isOpen={isBookDrawerOpen}
          onClose={() => setIsBookDrawerOpen(false)}
          patientName={detailedPatientName}
          onSuccess={triggerToast}
        />
        <RegisterPatientDrawer
          isOpen={isRegisterDrawerOpen}
          onClose={() => setIsRegisterDrawerOpen(false)}
          onSaveSuccess={() =>
            triggerToast("New patient registered successfully.")
          }
        />
        <EditPatientInformationDrawer
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
          patient={mapToScreenPatient(currentDetailedPatient)}
          onSaveSuccess={() => triggerToast("Demographic information updated.")}
        />
        <ProfileApptDetailsDrawer
          appt={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onAction={triggerToast}
        />
        <ProfileInvoiceDrawer
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPay={triggerToast}
        />
        <ProfileDocDrawer
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDownload={triggerToast}
        />
        <ProfileVisitDetailsDrawer
          visit={selectedVisit}
          onClose={() => setSelectedVisit(null)}
          onPrint={triggerToast}
        />

        <div className="w-full space-y-6">
          {/* Header & Breadcrumbs */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={handleBackDetails}
                className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h1
                className="text-xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Patient Profile
              </h1>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs text-slate-500 pl-8"
              style={{ fontFamily: RB }}
            >
              <span>
                {role === "receptionist"
                  ? "Receptionist"
                  : role === "doctor"
                    ? "Doctor"
                    : role === "nurse"
                      ? "Nurse"
                      : "Hospital Admin"}
              </span>
              <ChevronRight size={13} className="text-slate-300" />
              <button
                onClick={handleBackDetails}
                className="hover:text-[#0D47A1] transition-colors"
              >
                Patient Management
              </button>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="font-semibold text-[#111827]">
                {detailedPatientName}
              </span>
            </div>
          </div>

          {/* Patient Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Avatar name={detailedPatientName} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h2
                    className="text-lg font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {detailedPatientName}
                  </h2>
                  <span className="text-[10px] font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {detailedPatientMrn}
                  </span>
                  <StatusBadge status={detailedPatientStatus} />
                </div>
                <div
                  className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-1"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <UserCheck size={14} className="text-slate-400" />{" "}
                    {detailedPatientAge} Y / {detailedPatientGender}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Droplets size={14} className="text-red-500" /> Blood{" "}
                    {detailedPatientBloodGroup}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone size={14} className="text-slate-400" />{" "}
                    {detailedPatientPhone}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                  <span>Reg: Mar 12, 2024</span>
                  <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1">
                    <Stethoscope size={13} className="text-[#009688]" />{" "}
                    {detailedPatientAssignedDoctor}
                  </span>
                </div>
              </div>
            </div>

            {/* PATIENT-SPECIFIC TOOLBAR ACTIONS DYNAMIC BY ROLE */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Hospital Admin Actions */}
              {(role === "admin" || role === "super-admin") && (
                <>
                  <button
                    onClick={() =>
                      onEditPatientClick
                        ? onEditPatientClick(
                            currentDetailedPatient || ({} as Patient),
                          )
                        : setIsEditDrawerOpen(true)
                    }
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Edit size={14} className="text-slate-500" /> Edit Patient
                    Information
                  </button>
                  <button
                    onClick={() => setIsBookDrawerOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                    style={{ fontFamily: PP }}
                  >
                    <Calendar size={14} /> Book Appointment
                  </button>
                  <button
                    onClick={() => setActiveTab("billing-payments")}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Receipt size={14} className="text-amber-600" /> View
                    Billing
                  </button>
                  <button
                    onClick={() =>
                      triggerToast("Preparing patient profile print view...")
                    }
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Printer size={14} className="text-slate-500" /> Print
                    Profile
                  </button>
                </>
              )}

              {/* Receptionist Actions */}
              {role === "receptionist" && (
                <>
                  <button
                    onClick={() => setIsRegisterDrawerOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                    style={{ fontFamily: PP }}
                  >
                    <UserPlus size={14} /> Register Patient
                  </button>
                  <button
                    onClick={() => setIsEditDrawerOpen(true)}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Edit size={14} className="text-slate-500" /> Edit
                    Demographics
                  </button>
                  <button
                    onClick={() => setIsBookDrawerOpen(true)}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Calendar size={14} className="text-blue-600" /> Book
                    Appointment
                  </button>
                  <button
                    onClick={() => {
                      triggerToast("OPD Check-in confirmed.");
                    }}
                    className="px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-[#009688] text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5"
                  >
                    <UserCheck size={14} /> Check-In
                  </button>
                  <button
                    onClick={() =>
                      triggerToast("Printing Patient Identity Card...")
                    }
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Printer size={14} className="text-slate-500" /> Print
                    Patient Card
                  </button>
                </>
              )}

              {/* Doctor Actions */}
              {role === "doctor" && (
                <>
                  <button
                    onClick={() => {
                      triggerToast("Starting OPD Consultation workspace...");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors shadow-sm flex items-center gap-1.5"
                    style={{ fontFamily: PP }}
                  >
                    <Stethoscope size={14} /> Start Consultation
                  </button>
                  <button
                    onClick={() => setActiveTab("visit-history")}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Activity size={14} className="text-blue-600" /> View
                    Consultation History
                  </button>
                  <button
                    onClick={() => setActiveTab("prescriptions")}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Pill size={14} className="text-teal-600" /> View
                    Prescription
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <FileText size={14} className="text-slate-500" /> View
                    Documents
                  </button>
                </>
              )}

              {/* Nurse Actions */}
              {role === "nurse" && (
                <>
                  <button
                    onClick={() => {
                      triggerToast("Opening Vitals recording modal...");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#66BB6A] text-white text-xs font-bold hover:bg-green-600 transition-colors shadow-sm flex items-center gap-1.5"
                    style={{ fontFamily: PP }}
                  >
                    <Activity size={14} /> Record Vitals
                  </button>
                  <button
                    onClick={() => setActiveTab("visit-history")}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Stethoscope size={14} className="text-teal-600" /> View
                    Consultation
                  </button>
                  <button
                    onClick={() => setActiveTab("prescriptions")}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Pill size={14} className="text-emerald-600" /> View Current
                    Prescription
                  </button>
                </>
              )}

              {/* MORE ACTIONS DROPDOWN (Admin / Super Admin Only) */}
              {(role === "admin" || role === "super-admin") && (
                <div className="relative">
                  <button
                    onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
                    className="p-2 rounded-xl border border-gray-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {isMoreActionsOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 p-1.5 text-xs animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => {
                          triggerToast("Exporting medical record PDF...");
                          setIsMoreActionsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                      >
                        <Download size={14} className="text-[#0D47A1]" /> Export
                        Medical Record
                      </button>
                      <button
                        onClick={() => {
                          triggerToast(
                            "SMS appointment reminder sent to patient.",
                          );
                          setIsMoreActionsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                      >
                        <Phone size={14} className="text-[#009688]" /> Send SMS
                        Reminder
                      </button>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          triggerToast("Patient record archived.");
                          setIsMoreActionsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                      >
                        <UserX size={14} className="text-red-500" /> Archive
                        Patient
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-[11px] text-slate-500 font-medium mb-0.5">
                Total Visits
              </div>
              <div
                className="text-xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {detailedPatientVisitCount}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-[11px] text-slate-500 font-medium mb-0.5">
                Last Visit
              </div>
              <div className="text-xs font-bold text-[#111827] mt-1">
                {detailedPatientLastVisit}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-[11px] text-slate-500 font-medium mb-0.5">
                Upcoming
              </div>
              <div className="text-xs font-bold text-[#0D47A1] mt-1">
                {detailedPatientNextAppointment}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-[11px] text-slate-500 font-medium mb-0.5">
                Active Scripts
              </div>
              <div
                className="text-xl font-bold text-[#009688]"
                style={{ fontFamily: PP }}
              >
                3
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-[11px] text-slate-500 font-medium mb-0.5">
                Outstanding
              </div>
              <div
                className="text-xl font-bold text-red-600"
                style={{ fontFamily: PP }}
              >
                $125
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="text-[11px] text-slate-500 font-medium mb-0.5">
                Allergies
              </div>
              <div
                className="text-xl font-bold text-amber-600"
                style={{ fontFamily: PP }}
              >
                3
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION BAR */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex overflow-x-auto gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#0D47A1] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                style={{ fontFamily: PP }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CENTER WORKSPACE CONTENT CONTAINER (Dynamic tab content) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-105" style={{ fontFamily: RB }}>

            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Information & Emergency Contact */}
                  <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                    <h3
                      className="text-xs font-bold uppercase tracking-wider text-[#0D47A1]"
                      style={{ fontFamily: PP }}
                    >
                      Patient Information &amp; Emergency Contact
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          Full Address
                        </span>
                        <span className="font-semibold text-[#111827] mt-0.5 block">
                          123 Healthcare Ave, NY 10001
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          Email Address
                        </span>
                        <span className="font-semibold text-[#111827] mt-0.5 block">
                          {currentDetailedPatient?.email ||
                            "sarah.m@example.com"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          Emergency Contact Person
                        </span>
                        <span className="font-semibold text-[#111827] mt-0.5 block">
                          David Mitchell (Spouse)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          Emergency Phone
                        </span>
                        <span className="font-semibold text-[#111827] mt-0.5 block">
                          +1 (555) 345-6789
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Known Allergies & Conditions */}
                  <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                    <h3
                      className="text-xs font-bold uppercase tracking-wider text-[#009688]"
                      style={{ fontFamily: PP }}
                    >
                      Known Allergies &amp; Medical Conditions
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500 text-[11px] block font-medium mb-1.5">
                          Known Allergies
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-1">
                            <AlertTriangle size={12} /> Penicillin (Severe)
                          </span>
                          <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-1">
                            <AlertTriangle size={12} /> Peanuts (Moderate)
                          </span>
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-100">
                            Latex (Mild)
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block font-medium mb-1.5">
                          Existing Medical Conditions
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-lg border border-blue-100">
                            Primary Hypertension
                          </span>
                          <span className="px-2.5 py-1 bg-teal-50 text-[#009688] text-xs font-semibold rounded-lg border border-teal-100">
                            Type 2 Diabetes
                          </span>
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-100">
                            Bronchial Asthma
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-slate-600"
                        style={{ fontFamily: PP }}
                      >
                        Recent Appointments Summary
                      </h3>
                      <button
                        onClick={() => setActiveTab("appointments")}
                        className="text-xs font-bold text-[#0D47A1] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {mockAppointments.slice(0, 2).map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm"
                        >
                          <div>
                            <div className="font-bold text-[#111827] text-xs">
                              {a.doctor}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {a.department} • {a.date}
                            </div>
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-slate-600"
                        style={{ fontFamily: PP }}
                      >
                        Active Prescriptions Summary
                      </h3>
                      <button
                        onClick={() => setActiveTab("prescriptions")}
                        className="text-xs font-bold text-[#0D47A1] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {mockPrescriptions[0].meds.map((m) => (
                        <div
                          key={m.name}
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm"
                        >
                          <div className="flex items-center gap-2.5">
                            <Pill size={14} className="text-[#009688]" />
                            <div>
                              <div className="font-bold text-[#111827] text-xs">
                                {m.name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {m.dosage} • {m.duration}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. APPOINTMENTS TAB */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Patient Appointments
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upcoming scheduled visits and historical appointment
                      records.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBookDrawerOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                    style={{ fontFamily: PP }}
                  >
                    <Plus size={14} /> Book Appointment
                  </button>
                </div>

                <div className="space-y-3">
                  <h4
                    className="text-xs font-bold uppercase tracking-wider text-slate-500"
                    style={{ fontFamily: PP }}
                  >
                    Upcoming Visits
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockAppointments
                      .filter((a) => a.status === "Scheduled")
                      .map((a) => (
                        <div
                          key={a.id}
                          className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">
                                {a.id}
                              </span>
                              <StatusBadge status={a.status} />
                            </div>
                            <div className="font-bold text-[#111827] text-xs">
                              {a.doctor}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {a.department} • {a.date} at {a.time}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => setSelectedAppt(a)}
                              className="px-3 py-1.5 rounded-lg border border-[#0D47A1] text-[#0D47A1] bg-blue-50/50 hover:bg-blue-50 text-[11px] font-bold"
                            >
                              Details Drawer
                            </button>
                            <button
                              onClick={() =>
                                triggerToast(
                                  `Reschedule request initiated for ${a.id}`,
                                )
                              }
                              className="px-3 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg text-center"
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  <h4
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-4"
                    style={{ fontFamily: PP }}
                  >
                    Appointment History
                  </h4>
                  <div className="space-y-2">
                    {mockAppointments
                      .filter((a) => a.status === "Completed")
                      .map((a) => (
                        <div
                          key={a.id}
                          className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar size={15} className="text-slate-400" />
                            <div>
                              <span className="font-bold text-[#111827]">
                                {a.doctor}
                              </span>
                              <span className="text-slate-500 ml-2">
                                ({a.department} • {a.date})
                              </span>
                            </div>
                          </div>
                          <StatusBadge status="Completed" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. MEDICAL HISTORY TAB */}
            {activeTab === "medical-history" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Clinical Medical History
                    </h3>
                    <p className="text-xs text-slate-500">
                      Timeline of past diagnoses, treatments, and attending
                      doctors.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100">
                        {[
                          "Visit Date",
                          "Diagnosis",
                          "ICD Code",
                          "Treatment Plan",
                          "Attending Doctor",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3.5 py-3 font-bold text-slate-500 uppercase tracking-wider"
                            style={{ fontFamily: PP }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr className="hover:bg-blue-50/30">
                        <td className="px-3.5 py-3 font-medium text-slate-700">March 12, 2024</td>
                        <td className="px-3.5 py-3 font-bold text-[#111827]">Primary Essential Hypertension</td>
                        <td className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">I10</td>
                        <td className="px-3.5 py-3 text-slate-600">Oral anti-hypertensive daily (Lisinopril 10mg)</td>
                        <td className="px-3.5 py-3 text-slate-700 font-medium">Dr. A. Mehta</td>
                        <td className="px-3.5 py-3"><StatusBadge status="Active" /></td>
                      </tr>
                      <tr className="hover:bg-blue-50/30">
                        <td className="px-3.5 py-3 font-medium text-slate-700">Feb 10, 2024</td>
                        <td className="px-3.5 py-3 font-bold text-[#111827]">Type 2 Diabetes Mellitus</td>
                        <td className="px-3.5 py-3 font-mono text-blue-700 bg-blue-50 rounded">E11.9</td>
                        <td className="px-3.5 py-3 text-slate-600">Dietary control &amp; Metformin 500mg BD</td>
                        <td className="px-3.5 py-3 text-slate-700 font-medium">Dr. P. Sharma</td>
                        <td className="px-3.5 py-3"><StatusBadge status="Active" /></td>
                      </tr>
                      <tr className="hover:bg-blue-50/30">
                        <td className="px-3.5 py-3 font-medium text-slate-700">Nov 14, 2023</td>
                        <td className="px-3.5 py-3 font-bold text-[#111827]">Mild Bronchial Asthma</td>
                        <td className="px-3.5 py-3 font-mono text-blue-700 bg-blue-50 rounded">J45.20</td>
                        <td className="px-3.5 py-3 text-slate-600">Inhaler PRN during seasonal exacerbation</td>
                        <td className="px-3.5 py-3 text-slate-700 font-medium">Dr. R. Kapoor</td>
                        <td className="px-3.5 py-3"><StatusBadge status="Discharged" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. VISIT HISTORY TAB (PHASE 1 CORE) */}
            {activeTab === "visit-history" && (
              <div className="space-y-6">
                {/* Header & Filter Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Patient Visit History
                    </h3>
                    <p className="text-xs text-slate-500">
                      Comprehensive log of outpatient consultations, diagnoses,
                      and treatments.
                    </p>
                  </div>

                  {/* SEARCH & FILTERS BAR */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="Search Visit ID, Doctor..."
                        value={visitSearch}
                        onChange={(e) => setVisitSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0D47A1] focus:bg-white"
                      />
                    </div>
                    <select
                      value={visitDoctorFilter}
                      onChange={(e) => setVisitDoctorFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#0D47A1]"
                    >
                      <option>All Doctors</option>
                      <option>Dr. A. Mehta</option>
                      <option>Dr. P. Sharma</option>
                      <option>Dr. R. Kapoor</option>
                      <option>Dr. S. Patel</option>
                    </select>
                    <select
                      value={visitDeptFilter}
                      onChange={(e) => setVisitDeptFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#0D47A1]"
                    >
                      <option>All Departments</option>
                      <option>Cardiology</option>
                      <option>General Medicine</option>
                      <option>Neurology</option>
                      <option>Gynecology</option>
                    </select>
                    <select
                      value={visitDateFilter}
                      onChange={(e) => setVisitDateFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#0D47A1]"
                    >
                      <option>All Time</option>
                      <option>Last 3 Months</option>
                      <option>Last 6 Months</option>
                    </select>
                  </div>
                </div>

                {/* VISIT METRICS STRIP */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        Total Logged Visits
                      </span>
                      <span className="text-base font-bold text-[#0D47A1]">
                        {mockVisits.length} Visits
                      </span>
                    </div>
                    <Stethoscope size={18} className="text-[#0D47A1]" />
                  </div>
                  <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        Active Treatments
                      </span>
                      <span className="text-base font-bold text-[#009688]">
                        2 Active
                      </span>
                    </div>
                    <Pill size={18} className="text-[#009688]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        Last Visit Date
                      </span>
                      <span className="text-xs font-bold text-[#111827]">
                        March 12, 2024
                      </span>
                    </div>
                    <Calendar size={18} className="text-slate-500" />
                  </div>
                </div>

                {/* VISIT TABLE (9 EXACT COLUMNS) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200">
                        {[
                          "Visit Date",
                          "Visit ID",
                          "Doctor",
                          "Department",
                          "Diagnosis",
                          "Treatment Summary",
                          "Prescription Status",
                          "Billing Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3.5 py-3 font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap"
                            style={{ fontFamily: PP }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredVisits.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            className="py-8 text-center text-slate-400"
                          >
                            No visit records found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredVisits.map((v) => (
                          <tr
                            key={v.id}
                            className="hover:bg-blue-50/30 transition-colors"
                          >
                            {/* 1. Visit Date */}
                            <td className="px-3.5 py-3 whitespace-nowrap font-medium text-slate-700">
                              {v.date}
                            </td>

                            {/* 2. Visit ID */}
                            <td className="px-3.5 py-3 whitespace-nowrap font-mono font-bold text-[#0D47A1]">
                              <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {v.id}
                              </span>
                            </td>

                            {/* 3. Doctor */}
                            <td className="px-3.5 py-3 whitespace-nowrap font-semibold text-[#111827]">
                              {v.doctor}
                            </td>

                            {/* 4. Department */}
                            <td className="px-3.5 py-3 whitespace-nowrap text-slate-600">
                              {v.department}
                            </td>

                            {/* 5. Diagnosis */}
                            <td className="px-3.5 py-3 font-semibold text-[#111827]">
                              {v.diagnosis}
                            </td>

                            {/* 6. Treatment Summary */}
                            <td className="px-3.5 py-3 text-slate-600 max-w-xs truncate">
                              {v.treatmentSummary}
                            </td>

                            {/* 7. Prescription Status */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                                {v.rxStatus}
                              </span>
                            </td>

                            {/* 8. Billing Status */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <StatusBadge status={v.billingStatus} />
                            </td>

                            {/* 9. Actions */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedVisit(v)}
                                className="px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1"
                                style={{ fontFamily: PP }}
                              >
                                <Eye size={12} /> View Visit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. PRESCRIPTIONS TAB */}
            {activeTab === "prescriptions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Prescription List
                    </h3>
                    <p className="text-xs text-slate-500">
                      Issued medications, dosage schedules, and prescribing
                      consultants.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockPrescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                          <Pill size={16} className="text-[#009688]" />
                          <span className="font-mono text-xs font-bold text-[#0D47A1]">
                            {rx.id}
                          </span>
                          <span className="text-xs text-slate-500">
                            • Prescribed by {rx.doctor} on {rx.date}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            triggerToast(
                              `Downloading prescription ${rx.id}.pdf...`,
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Download size={13} /> Download PDF
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {rx.meds.map((m) => (
                          <div
                            key={m.name}
                            className="p-3 bg-slate-50 rounded-xl border border-gray-100 space-y-1"
                          >
                            <div className="font-bold text-[#111827]">
                              {m.name}
                            </div>
                            <div className="text-slate-600">
                              Dosage:{" "}
                              <span className="font-semibold text-slate-800">
                                {m.dosage}
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              Duration: {m.duration} • Instructions:{" "}
                              {m.instructions}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. BILLING & PAYMENTS TAB */}
            {activeTab === "billing-payments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Billing &amp; Payments
                    </h3>
                    <p className="text-xs text-slate-500">
                      Itemized invoices, outstanding balances, and payment
                      records.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">
                      Total Outstanding Balance
                    </span>
                    <span className="text-base font-bold text-red-600">
                      $125.00
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4
                    className="text-xs font-bold uppercase tracking-wider text-slate-500"
                    style={{ fontFamily: PP }}
                  >
                    Invoices
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-100">
                          {[
                            "Invoice #",
                            "Issue Date",
                            "Description",
                            "Amount",
                            "Due Date",
                            "Status",
                            "Action",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {mockInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-blue-50/30">
                            <td className="px-3 py-3 font-mono font-bold text-[#0D47A1]">
                              {inv.id}
                            </td>
                            <td className="px-3 py-3 text-slate-600">
                              {inv.date}
                            </td>
                            <td className="px-3 py-3 font-semibold text-[#111827]">
                              {inv.description}
                            </td>
                            <td className="px-3 py-3 font-bold text-[#111827]">
                              ${inv.amount.toFixed(2)}
                            </td>
                            <td className="px-3 py-3 text-slate-500">
                              {inv.dueDate}
                            </td>
                            <td className="px-3 py-3">
                              <StatusBadge status={inv.status} />
                            </td>
                            <td className="px-3 py-3">
                              <button
                                onClick={() => setSelectedInvoice(inv)}
                                className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a]"
                              >
                                Invoice Drawer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-4"
                    style={{ fontFamily: PP }}
                  >
                    Payment History
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#111827]">
                        Receipt #RCT-9082
                      </div>
                      <div className="text-slate-500">
                        Paid via Credit Card (Visa •••• 4242) on Feb 14, 2024
                      </div>
                    </div>
                    <span className="font-bold text-[#66BB6A]">$350.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Patient Documents
                    </h3>
                    <p className="text-xs text-slate-500">
                      Medical certificates, consultation summaries, and intake
                      forms.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {mockDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold shrink-0">
                          PDF
                        </div>
                        <div>
                          <div className="font-bold text-[#111827]">
                            {doc.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {doc.date} • {doc.size}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          triggerToast(`Downloading ${doc.name}...`)
                        }
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-[#0D47A1] font-bold hover:bg-blue-50 transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Breadcrumb label based on role
  const roleLabel =
    activeRole === "DOCTOR"
      ? "Doctor Workspace"
      : activeRole.includes("ADMIN")
        ? "Hospital Admin"
        : "Reception";

  return (
    <div
      className="w-full min-h-screen flex flex-col p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* ── HEADER & BREADCRUMB & PRIMARY ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span>{roleLabel}</span>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-[#0D47A1]">Patient Search</span>
          </div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Patient Management & Search
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Search patient records, filter by status or department, and inspect
            record details.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {canBook && (
            <button
              onClick={handleBookClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-sm cursor-pointer"
              style={{ fontFamily: PP }}
            >
              <Calendar size={15} />
              Book Appointment
            </button>
          )}
          {canRegister && (
            <button
              onClick={handleRegisterClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm cursor-pointer"
              style={{ fontFamily: PP }}
            >
              <UserPlus size={15} />
              Register Patient
            </button>
          )}
        </div>
      </div>

      {/* ── KPI SUMMARY CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm animate-pulse space-y-3"
            >
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden group hover:border-[#0D47A1]/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Total DB Patients
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className="text-2xl font-extrabold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {stats.totalPatients}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                  <TrendingUp size={11} /> Live DB
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Full registered patient base
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  New Registrations
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Clock size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className="text-2xl font-extrabold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {stats.newRegistrationsToday}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Today
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Registered on current date
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden group hover:border-teal-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Active Patients
                </span>
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className="text-2xl font-extrabold text-[#009688]"
                  style={{ fontFamily: PP }}
                >
                  {stats.activePatients}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Active status records
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Inactive Records
                </span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                  <UserX size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className="text-2xl font-extrabold text-slate-600"
                  style={{ fontFamily: PP }}
                >
                  {stats.inactivePatients}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Inactive or archived
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── FILTERS & SEARCH BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by MRN, Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select
            value={regTypeFilter}
            onChange={(e) => setRegTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Types</option>
            <option>Walk-In</option>
            <option>Online</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Genders</option>
            <option>Female</option>
            <option>Male</option>
          </select>

          <select
            value={regDateFilter}
            onChange={(e) => setRegDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Dates</option>
            <option>Today</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-3 py-2 rounded-xl text-xs text-[#EF4444] font-semibold hover:bg-red-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* ── SINGLE COMMON PATIENT TABLE COMPONENT FOR ALL ROLES (RBAC CONTROLLED) ── */}
      <PatientTable
        patients={filteredPatients}
        totalCount={filteredPatients.length}
        isLoading={isLoading}
        selectedPatientId={selectedPatientId}
        activeActionMenuId={activeActionMenuId}
        hasActiveFilters={hasActiveFilters}
        userRole={userRole}
        onSelectRow={(p: Patient) => {
          const id = p.mrn || String(p.id);
          setSelectedPatientId(id);
          setViewingPatientMrn(id);
          if (onPatientSelect) onPatientSelect(id);
        }}
        onToggleActionMenu={(id) => setActiveActionMenuId(id)}
        onViewProfile={(id) => {
          setViewingPatientMrn(id);
          if (onPatientSelect) onPatientSelect(id);
        }}
        onEditPatient={(p) => {
          const id = p.mrn || String(p.id);
          if (onEditPatientClick) {
            onEditPatientClick(p);
          } else if (onPatientSelect) {
            onPatientSelect(id);
          }
        }}
        onBookAppointment={(p) => {
          const id = p.mrn || String(p.id);
          setSelectedPatientId(id);
          if (onBookAppointmentClick) {
            onBookAppointmentClick(id);
          } else {
            setShowBookDrawer(true);
          }
        }}
        onActivatePatient={(p) => setActivatePatient(p)}
        onDeactivatePatient={(p) => setDeactivatePatient(p)}
        onViewMedicalHistory={(id) => {
          if (onPatientSelect) onPatientSelect(id);
        }}
        onViewAppointments={(id) => {
          if (onPatientSelect) onPatientSelect(id);
        }}
        onGenerateBill={(id) => {
          if (onPatientSelect) onPatientSelect(id);
        }}
        onResetFilters={resetFilters}
      />

      <BookAppointmentDrawer
        isOpen={showBookDrawer}
        onClose={() => setShowBookDrawer(false)}
        onBookSuccess={() => {
          setShowBookDrawer(false);
        }}
      />

      <DeactivatePatientDialog
        isOpen={!!deactivatePatient}
        patient={deactivatePatient}
        onClose={() => setDeactivatePatient(null)}
        onConfirm={handleConfirmDeactivate}
        isDeactivating={isUpdatingStatus}
      />

      <ActivatePatientDialog
        isOpen={!!activatePatient}
        patient={activatePatient}
        onClose={() => setActivatePatient(null)}
        onConfirm={handleConfirmActivate}
        isActivating={isUpdatingStatus}
      />
    </div>
  );
}
