import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Receipt,
  Phone,
  UserCheck,
  Activity,
  Calendar,
  Stethoscope,
  Pill,
  AlertTriangle,
  FileText,
  Droplets,
  UserX,
  Printer,
  CheckCircle2,
} from "lucide-react";

import { PP, RB } from "../constants/patient.mock";
import { Avatar } from "../components/Avatar";
import { StatusBadge } from "../components/StatusBadges";
import {
  EditPatientInformationDrawer,
  ProfileBookApptDrawer,
  ProfileApptDetailsDrawer,
  ProfileInvoiceDrawer,
  ProfileDocDrawer,
  ProfileVisitDetailsDrawer,
} from "../components/PatientDrawers";

export function PatientProfileScreen({
  onBack,
  onEdit,
  role = "admin",
  onStartConsultation,
  onRecordVitals,
  onCheckIn,
}: {
  onBack: () => void;
  onEdit?: () => void;
  onViewTimeline?: () => void;
  role?: "super-admin" | "admin" | "receptionist" | "doctor" | "nurse" | string;
  onStartConsultation?: () => void;
  onRecordVitals?: () => void;
  onCheckIn?: () => void;
  patientData?: Record<string, unknown>;
  patientMrn?: string;
}) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Slide-over Drawers State
  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  // Visit History Filters State
  const [visitSearch, setVisitSearch] = useState("");
  const [visitDoctorFilter, setVisitDoctorFilter] = useState("All Doctors");
  const [visitDeptFilter, setVisitDeptFilter] = useState("All Departments");
  const [visitDateFilter, setVisitDateFilter] = useState("All Time");

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Dynamic Tabs by Role
  const getTabsForRole = (r: string) => {
    if (r === "receptionist") {
      return [
        { id: "overview", label: "Overview" },
        { id: "appointments", label: "Appointments" },
        { id: "visit-history", label: "Visit History" },
        { id: "documents", label: "Documents" },
      ];
    }
    if (r === "doctor") {
      return [
        { id: "overview", label: "Overview" },
        { id: "visit-history", label: "Visit History" },
        { id: "prescriptions", label: "Prescriptions" },
        { id: "consultation-notes", label: "Consultation Notes" },
        { id: "documents", label: "Documents" },
      ];
    }
    if (r === "nurse") {
      return [
        { id: "overview", label: "Overview" },
        { id: "visit-history", label: "Visit History" },
        { id: "medical-history", label: "Medical History" },
        { id: "current-prescription", label: "Current Prescription" },
      ];
    }
    // Hospital Admin / Super Admin (Default)
    return [
      { id: "overview", label: "Overview" },
      { id: "appointments", label: "Appointments" },
      { id: "visit-history", label: "Visit History" },
      { id: "prescriptions", label: "Prescriptions" },
      { id: "billing-payments", label: "Billing & Payments" },
      { id: "documents", label: "Documents" },
      { id: "activity-timeline", label: "Activity Timeline" },
    ];
  };

  const tabs = getTabsForRole(role);

  const timeline = [
    {
      time: "Today, 09:15 AM",
      event: "Checked in — OPD Wing A",
      user: "Reception",
      dept: "Front Desk",
    },
    {
      time: "Today, 09:20 AM",
      event: "Vitals recorded (BP: 138/88, Temp: 98.6°F)",
      user: "Nurse R. Singh",
      dept: "Triage",
    },
    {
      time: "Today, 09:45 AM",
      event: "Consultation started with Dr. A. Mehta",
      user: "Dr. A. Mehta",
      dept: "Cardiology",
    },
    {
      time: "Yesterday, 02:30 PM",
      event: "Follow-up appointment booked online",
      user: "System Auto",
      dept: "Portal",
    },
    {
      time: "Feb 14, 2024, 11:00 AM",
      event: "Invoice #INV-10189 cleared ($220.00)",
      user: "Billing Dept",
      dept: "Accounts",
    },
  ];

  // Mock Data for Tabs
  const mockAppointments = [
    {
      id: "APT-1024",
      doctor: "Dr. A. Mehta",
      department: "Cardiology",
      date: "March 15, 2024",
      time: "10:30 AM",
      type: "Follow-up Visit",
      status: "Scheduled",
      notes: "Routine hypertension review and ECG assessment.",
    },
    {
      id: "APT-1018",
      doctor: "Dr. P. Sharma",
      department: "General Medicine",
      date: "March 28, 2024",
      time: "02:00 PM",
      type: "OPD Consultation",
      status: "Scheduled",
      notes: "Diabetes HbA1c review.",
    },
    {
      id: "APT-0982",
      doctor: "Dr. A. Mehta",
      department: "Cardiology",
      date: "March 12, 2024",
      time: "09:45 AM",
      type: "OPD Consultation",
      status: "Completed",
      notes: "Initial chest pain intake completed.",
    },
  ];

  const mockVisits = [
    {
      id: "VIS-2024-001",
      date: "March 12, 2024",
      time: "09:45 AM",
      doctor: "Dr. A. Mehta",
      department: "Cardiology",
      diagnosis: "Primary Essential Hypertension",
      treatmentSummary: "Oral anti-hypertensive daily (Lisinopril 10mg)",
      rxStatus: "Issued",
      billingStatus: "Paid",
      chiefComplaint:
        "Patient presented with headache and elevated BP readings.",
    },
    {
      id: "VIS-2024-002",
      date: "February 10, 2024",
      time: "11:15 AM",
      doctor: "Dr. P. Sharma",
      department: "General Medicine",
      diagnosis: "Type 2 Diabetes Mellitus",
      treatmentSummary: "Dietary control & Metformin 500mg BD",
      rxStatus: "Issued",
      billingStatus: "Paid",
      chiefComplaint: "Routine blood sugar checkup and fatigue.",
    },
    {
      id: "VIS-2023-089",
      date: "November 14, 2023",
      time: "02:30 PM",
      doctor: "Dr. R. Kapoor",
      department: "Neurology",
      diagnosis: "Mild Bronchial Asthma",
      treatmentSummary: "Inhaler PRN during seasonal exacerbation",
      rxStatus: "Pending",
      billingStatus: "Paid",
      chiefComplaint: "Wheezing and chest tightness.",
    },
    {
      id: "VIS-2023-045",
      date: "August 05, 2023",
      time: "10:00 AM",
      doctor: "Dr. S. Patel",
      department: "Gynecology",
      diagnosis: "Routine Health Screening",
      treatmentSummary: "Normal vitals, general wellness guidance",
      rxStatus: "Pending",
      billingStatus: "Not Paid",
      chiefComplaint: "Annual physical checkup.",
    },
  ];

  const mockPrescriptions = [
    {
      id: "Rx-2024-089",
      doctor: "Dr. A. Mehta",
      date: "March 12, 2024",
      status: "Active",
      meds: [
        {
          name: "Lisinopril 10mg",
          dosage: "1 Tab OD (Morning)",
          duration: "30 Days",
          instructions: "Take after food",
        },
        {
          name: "Atorvastatin 20mg",
          dosage: "1 Tab HS (Night)",
          duration: "30 Days",
          instructions: "Take at bedtime",
        },
      ],
    },
    {
      id: "Rx-2024-042",
      doctor: "Dr. P. Sharma",
      date: "February 10, 2024",
      status: "Completed",
      meds: [
        {
          name: "Metformin 500mg",
          dosage: "1 Tab BD (Morning/Night)",
          duration: "60 Days",
          instructions: "Take with meals",
        },
      ],
    },
  ];

  const mockInvoices = [
    {
      id: "INV-10245",
      date: "March 12, 2024",
      description: "OPD Cardiology Consultation & ECG Fee",
      amount: 125.0,
      status: "Unpaid",
      dueDate: "March 17, 2024",
    },
    {
      id: "INV-10189",
      date: "February 10, 2024",
      description: "General Consultation & Lab Profile Fee",
      amount: 220.0,
      status: "Paid",
      dueDate: "February 15, 2024",
    },
  ];

  const mockDocuments = [
    {
      id: "DOC-001",
      title: "Prescription PDF — Mar 12, 2024",
      category: "Prescription PDF",
      date: "March 12, 2024",
      doctor: "Dr. A. Mehta",
      size: "1.2 MB",
    },
    {
      id: "DOC-002",
      title: "Cardiology Consultation Summary",
      category: "Consultation Summary",
      date: "March 12, 2024",
      doctor: "Dr. A. Mehta",
      size: "2.4 MB",
    },
    {
      id: "DOC-003",
      title: "Medical Fitness Certificate",
      category: "Medical Certificate",
      date: "February 10, 2024",
      doctor: "Dr. P. Sharma",
      size: "850 KB",
    },
    {
      id: "DOC-004",
      title: "Patient Registration & Intake Form",
      category: "Registration Documents",
      date: "March 12, 2024",
      doctor: "Front Desk",
      size: "1.8 MB",
    },
  ];

  const filteredVisits = mockVisits.filter((v) => {
    const matchesSearch =
      !visitSearch ||
      v.id.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.doctor.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.department.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.diagnosis.toLowerCase().includes(visitSearch.toLowerCase());
    const matchesDoctor =
      visitDoctorFilter === "All Doctors" || v.doctor === visitDoctorFilter;
    const matchesDept =
      visitDeptFilter === "All Departments" || v.department === visitDeptFilter;
    return matchesSearch && matchesDoctor && matchesDept;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
      {/* Toast Feedback Notification Banner */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 border border-slate-700"
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
        patientName="Sarah Mitchell"
        onSuccess={triggerToast}
      />

      <EditPatientInformationDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
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
              onClick={onBack}
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
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Patient Management
            </button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-[#111827]">Sarah Mitchell</span>
          </div>
        </div>

        {/* Patient Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name="Sarah Mitchell" size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2
                  className="text-lg font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Sarah Mitchell
                </h2>
                <span className="text-[10px] font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  PT-2024-001
                </span>
                <StatusBadge status="Active" />
              </div>
              <div
                className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-1"
                style={{ fontFamily: RB }}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck size={14} className="text-slate-400" /> 34 Y /
                  Female
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Droplets size={14} className="text-red-500" /> Blood O+
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone size={14} className="text-slate-400" /> +1 (555)
                  234-5678
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                <span>Reg: Mar 12, 2024</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1">
                  <Stethoscope size={13} className="text-[#009688]" /> Dr. A.
                  Mehta (Cardiology)
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
                    onEdit ? onEdit() : setIsEditDrawerOpen(true)
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
                  <Receipt size={14} className="text-amber-600" /> View Billing
                </button>
                <button
                  onClick={() =>
                    triggerToast("Preparing patient profile print view...")
                  }
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Printer size={14} className="text-slate-500" /> Print Profile
                </button>
              </>
            )}

            {/* Receptionist Actions */}
            {role === "receptionist" && (
              <>
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
                    if (onCheckIn) onCheckIn();
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
                  <Printer size={14} className="text-slate-500" /> Print Patient
                  Card
                </button>
              </>
            )}

            {/* Doctor Actions */}
            {role === "doctor" && (
              <>
                <button
                  onClick={() => {
                    triggerToast("Starting OPD Consultation workspace...");
                    if (onStartConsultation) onStartConsultation();
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
                  <Pill size={14} className="text-teal-600" /> View Prescription
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
                    if (onRecordVitals) onRecordVitals();
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
                  onClick={() => setActiveTab("current-prescription")}
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
              12
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Last Visit
            </div>
            <div className="text-xs font-bold text-[#111827] mt-1">
              Mar 12, 2024
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Upcoming
            </div>
            <div className="text-xs font-bold text-[#0D47A1] mt-1">
              Mar 15, 2024
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
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[420px]"
          style={{ fontFamily: RB }}
        >
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
                        sarah.m@example.com
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
                    {mockPrescriptions[0].meds.map((m, idx) => (
                      <div
                        key={idx}
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
                      <td className="px-3.5 py-3 font-medium text-slate-700">
                        March 12, 2024
                      </td>
                      <td className="px-3.5 py-3 font-bold text-[#111827]">
                        Primary Essential Hypertension
                      </td>
                      <td className="px-3.5 py-3 font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        I10
                      </td>
                      <td className="px-3.5 py-3 text-slate-600">
                        Oral anti-hypertensive daily (Lisinopril 10mg)
                      </td>
                      <td className="px-3.5 py-3 text-slate-700 font-medium">
                        Dr. A. Mehta
                      </td>
                      <td className="px-3.5 py-3">
                        <StatusBadge status="Active" />
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="px-3.5 py-3 font-medium text-slate-700">
                        Feb 10, 2024
                      </td>
                      <td className="px-3.5 py-3 font-bold text-[#111827]">
                        Type 2 Diabetes Mellitus
                      </td>
                      <td className="px-3.5 py-3 font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        E11.9
                      </td>
                      <td className="px-3.5 py-3 text-slate-600">
                        Dietary control &amp; Metformin 500mg BD
                      </td>
                      <td className="px-3.5 py-3 text-slate-700 font-medium">
                        Dr. P. Sharma
                      </td>
                      <td className="px-3.5 py-3">
                        <StatusBadge status="Active" />
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="px-3.5 py-3 font-medium text-slate-700">
                        Nov 14, 2023
                      </td>
                      <td className="px-3.5 py-3 font-bold text-[#111827]">
                        Mild Bronchial Asthma
                      </td>
                      <td className="px-3.5 py-3 font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        J45.20
                      </td>
                      <td className="px-3.5 py-3 text-slate-600">
                        Inhaler PRN during seasonal exacerbation
                      </td>
                      <td className="px-3.5 py-3 text-slate-700 font-medium">
                        Dr. R. Kapoor
                      </td>
                      <td className="px-3.5 py-3">
                        <StatusBadge status="Discharged" />
                      </td>
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
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              v.rxStatus === "Issued"
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
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
                      {rx.meds.map((m, idx) => (
                        <div
                          key={idx}
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
                        <div className="font-bold text-[#111827] text-xs">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {doc.category} • {doc.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-1.5 rounded-lg border border-[#0D47A1] text-[#0D47A1] bg-blue-50/50 hover:bg-blue-50 text-[11px] font-bold"
                      >
                        Preview Drawer
                      </button>
                      <button
                        onClick={() =>
                          triggerToast(`Downloading ${doc.title}...`)
                        }
                        className="p-1.5 text-slate-400 hover:text-[#0D47A1]"
                        title="Download PDF"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. ACTIVITY TIMELINE TAB */}
          {activeTab === "activity-timeline" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Patient Activity Timeline
                  </h3>
                  <p className="text-xs text-slate-500">
                    Complete chronological audit trail of clinical and
                    administrative events.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  5 Logged Events
                </span>
              </div>

              <div className="space-y-4">
                {timeline.map((t, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold shrink-0">
                        <Activity size={15} />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 my-2" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#111827] text-sm">
                          {t.event}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {t.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <span className="font-medium text-slate-700">
                          Staff / Actor: {t.user}
                        </span>
                        <span>•</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-[10px] font-semibold text-slate-600">
                          {t.dept}
                        </span>
                      </div>
                    </div>
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
