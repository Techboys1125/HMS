import { useState } from "react";
import {
  Eye,
  Edit,
  Printer,
  X,
  User,
  Calendar,
  Stethoscope,
  FileText,
  AlertTriangle,
  Info,
  Clock,
  Check,
  CheckCircle2,
} from "lucide-react";
import type { AppointmentRecord } from "../types/appointment.types";
import type { UserRole } from "../types/appointment-screen.types";
import { StatusBadge } from "./StatusBadge";
import { Avatar } from "./Avatar";
import {
  PP,
  RB,
  appointmentToPatientSummary,
} from "../constants/appointment.constants";
import { appointmentService } from "../services/appointment.service";

export function AppointmentDetailsDrawer({
  apt,
  isOpen,
  onClose,
  onEditClick,
  onPrintClick,
  onPatientSelect,
  isDetailsLoading,
  userRole = "Receptionist",
  onStartConsultation,
  onCheckInSuccess,
  onError,
}: {
  apt: AppointmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (apt: AppointmentRecord) => void;
  onPrintClick: (apt: AppointmentRecord) => void;
  onPatientSelect?: (id: number | string) => void;
  isDetailsLoading?: boolean;
  userRole?: UserRole;
  onStartConsultation?: (aptId?: string | number) => void;
  onCheckInSuccess?: (token?: string) => void;
  onError?: (message: string) => void;
}) {
  void isDetailsLoading;
  const [activeTab, setActiveTab] = useState<
    "all" | "patient" | "appointment" | "clinical" | "alerts" | "timeline"
  >("all");
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  if (!isOpen || !apt) return null;

  const isDoctor = userRole === "Doctor";
  const isNurse = userRole === "Nurse";
  const canCheckIn =
    !isDoctor &&
    !isNurse &&
    (userRole === "Receptionist" ||
      userRole === "Hospital Admin" ||
      userRole === "Admin" ||
      userRole === "Super Admin");
  const showCheckInButton =
    canCheckIn &&
    (apt.status === "Booked" ||
      apt.status === "Scheduled" ||
      apt.status === "BOOKED");

  const handleCheckIn = async () => {
    if (!apt) return;
    setIsCheckingIn(true);
    try {
      const res = await appointmentService.receptionCheckIn(apt.id);
      const tokenNo =
        (res as unknown as { tokenNumber?: string })?.tokenNumber ||
        `TK-${apt.id}`;
      onCheckInSuccess?.(tokenNo);
      onClose();
    } catch (err) {
      const error = err as Error | null | undefined;
      const msg = error?.message || "Check-in is only allowed on the appointment date.";
      onError?.(msg);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const patientInfo = appointmentToPatientSummary(apt);

  const doctorInfo = apt.doctor || {
    id: apt.doctorId || "DOC-402",
    name: apt.doctorName,
    department:
      typeof apt.department === "string"
        ? apt.department
        : apt.department?.departmentName ||
          apt.department?.name ||
          apt.department?.departmentCode ||
          "",
    specialty: apt.doctorSpecialty || "Senior Cardiology Specialist",
    qualification: "MBBS, MD (Cardiology)",
    consultationFee: 150,
    opdRoom: apt.opdRoom || "Room 104 - Wing A",
  };

  const timelineSteps = [
    {
      title: "Appointment Booked",
      timestamp: `${apt.createdDate} 09:15 AM`,
      by: "Receptionist Desk",
      status: "completed",
    },
    {
      title: "Patient Checked-In",
      timestamp: `${apt.appointmentDate} 08:42 AM`,
      by: "Triage Nurse Desk",
      status: "completed",
    },
    {
      title: "Waiting in OPD Queue",
      timestamp: `${apt.appointmentDate} 08:50 AM`,
      by: "OPD Queue System",
      status: "active",
    },
    {
      title: "Ready for Consultation",
      timestamp: `${apt.appointmentDate} 09:00 AM`,
      by: "Dr. Arjun Mehta",
      status: "upcoming",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          {/* STICKY HEADER */}
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm shrink-0">
            <div>
              <div
                className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider mb-0.5"
                style={{ fontFamily: PP }}
              >
                {isNurse
                  ? "Nurse / Appointment Management / Appointment Details"
                  : isDoctor
                    ? "Doctor / Appointment Management / Appointment Details"
                    : "Reception / Appointment Details"}
              </div>
              <h2
                className="text-base font-bold flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Eye size={18} /> Appointment Details
              </h2>
              <p
                className="text-xs text-blue-200 mt-0.5"
                style={{ fontFamily: RB }}
              >
                {isNurse
                  ? "View patient appointment information, clinical prep notes, alerts, and timeline."
                  : isDoctor
                    ? "Review appointment information before consultation."
                    : "View complete appointment information and timeline activity."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isDoctor && !isNurse && (
                <button
                  type="button"
                  onClick={() => onEditClick(apt)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <Edit size={13} /> Edit
                </button>
              )}

              <button
                type="button"
                onClick={() => onPrintClick(apt)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors flex items-center gap-1"
              >
                <Printer size={13} /> Print Slip
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* TOP QUICK SUMMARY STRIP */}
          <div className="bg-slate-50 p-4 border-b border-[#E5E7EB] shrink-0 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#0D47A1]">
                  {apt.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({apt.tokenNo})
                </span>
              </div>
              <StatusBadge status={apt.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Date
                </span>
                <strong className="text-[#111827]">
                  {apt.appointmentDate}
                </strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Time Slot
                </span>
                <strong className="text-[#0D47A1] font-mono">
                  {apt.timeSlot}
                </strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Visit Type
                </span>
                <span className="font-bold text-[#009688]">
                  {apt.visitType}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Token No
                </span>
                <span className="font-mono font-bold text-[#0D47A1]">
                  {apt.tokenNo}
                </span>
              </div>
            </div>
          </div>

          {/* NAVIGATION TABS */}
          <div className="bg-white border-b border-[#E5E7EB] px-6 flex items-center gap-4 sm:gap-6 shrink-0 text-xs font-semibold overflow-x-auto">
            {(
              [
                { id: "all", label: "All Sections" },
                { id: "patient", label: "Patient Info" },
                { id: "appointment", label: "Appointment" },
                { id: "clinical", label: "Clinical Prep" },
                { id: "alerts", label: "Patient Alerts" },
                { id: "timeline", label: "Timeline" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#0D47A1] text-[#0D47A1]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
                style={{ fontFamily: PP }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SCROLLABLE CONTENT */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50"
            style={{ fontFamily: RB }}
          >
            {/* SECTION 01: PATIENT INFORMATION */}
            {(activeTab === "all" || activeTab === "patient") && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
                  <h3
                    className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <User size={15} className="text-[#0D47A1]" /> Section 01 ·
                    Patient Information
                  </h3>
                  {onPatientSelect && (
                    <button
                      type="button"
                      onClick={() => onPatientSelect(patientInfo.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] border border-blue-100 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                      style={{ fontFamily: PP }}
                    >
                      <User size={13} /> View Patient Profile
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <Avatar name={patientInfo.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {patientInfo.name}
                    </h4>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      <span className="text-[#0D47A1] font-bold">
                        {patientInfo.mrn}
                      </span>{" "}
                      · MRN: {patientInfo.id}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Age & Gender
                    </span>
                    <strong className="text-[#111827]">
                      {patientInfo.age} yrs / {patientInfo.gender}
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Blood Group
                    </span>
                    <strong className="text-[#0D47A1]">
                      {patientInfo.bloodGroup}
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Mobile Number
                    </span>
                    <strong className="text-[#111827]">
                      {patientInfo.phone}
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-2">
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Emergency Contact
                    </span>
                    <strong className="text-[#111827]">
                      {patientInfo.emergencyContact}
                    </strong>
                  </div>
                  <div className="bg-red-50/70 p-2.5 rounded-xl border border-red-100 col-span-2 sm:col-span-1">
                    <span className="text-red-600 text-[10px] block font-bold">
                      Known Allergies
                    </span>
                    <strong className="text-red-900">
                      Penicillin, NSAIDs, Peanuts
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 02: APPOINTMENT INFORMATION */}
            {(activeTab === "all" || activeTab === "appointment") && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={15} className="text-[#0D47A1]" /> Section 02 ·
                  Appointment Information
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Appointment ID
                    </span>
                    <strong className="text-[#0D47A1] font-mono">
                      {apt.id}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Appointment Date
                    </span>
                    <strong className="text-[#111827]">
                      {apt.appointmentDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Appointment Time
                    </span>
                    <strong className="text-[#0D47A1] font-mono">
                      {apt.timeSlot}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Token Number
                    </span>
                    <strong className="text-[#0D47A1] font-mono">
                      {apt.tokenNo}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Visit Type
                    </span>
                    <span className="font-bold text-[#009688]">
                      {apt.visitType}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Status
                    </span>
                    <StatusBadge status={apt.status} />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Booking Source
                    </span>
                    <span className="text-slate-700 font-semibold">
                      {(apt as AppointmentRecord & { bookingChannel?: string })
                        .bookingChannel || "Reception Desk"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Created Date
                    </span>
                    <span className="text-slate-600">{apt.createdDate}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 03: DOCTOR INFORMATION */}
            {(activeTab === "all" || activeTab === "appointment") && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Stethoscope size={15} className="text-[#0D47A1]" /> Section
                  03 · Doctor Information
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Attending Doctor
                    </span>
                    <strong className="text-[#111827] text-sm">
                      {doctorInfo.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Department
                    </span>
                    <strong className="text-[#0D47A1]">
                      {doctorInfo.department}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Specialization
                    </span>
                    <span className="text-slate-700 font-semibold">
                      {doctorInfo.specialty}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Consultation Duration
                    </span>
                    <span className="text-slate-700 font-semibold font-mono">
                      15 Mins
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Room Number
                    </span>
                    <strong className="text-[#009688]">
                      {doctorInfo.opdRoom}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 04: CLINICAL PREPARATION */}
            {(activeTab === "all" || activeTab === "clinical") && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <FileText size={15} className="text-[#009688]" /> Section 04 ·
                  Clinical Preparation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Previous Visit Date
                    </span>
                    <strong className="text-[#111827]">
                      14 Jun 2026 (6 weeks ago)
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">
                      Previous Diagnosis Summary
                    </span>
                    <strong className="text-[#0D47A1]">
                      Essential Hypertension, Mild Hyperlipidemia
                    </strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium mb-1">
                      Current Chief Complaint
                    </span>
                    <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-amber-950 font-medium">
                      {apt.chiefComplaint ||
                        "Chest pain and shortness of breath upon mild exertion."}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium mb-1">
                      Reason for Visit
                    </span>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium">
                      Routine OPD Follow-up & Symptom Review
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium mb-1">
                      Special Notes
                    </span>
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-950 font-medium text-[11px]">
                      Patient reports intermittent mild headache in the
                      mornings. Vitals recorded by Triage Nurse prior to
                      consultation.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 05: PATIENT ALERTS */}
            {(activeTab === "all" || activeTab === "alerts") && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <AlertTriangle size={15} className="text-[#EF4444]" /> Section
                  05 · Patient Alerts
                </h3>

                <div className="space-y-3">
                  {/* Alert 1: Drug Allergy */}
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle
                      size={16}
                      className="text-[#EF4444] mt-0.5 shrink-0"
                    />
                    <div>
                      <div
                        className="text-xs font-bold text-red-900"
                        style={{ fontFamily: PP }}
                      >
                        Drug Allergies
                      </div>
                      <div className="text-xs text-red-700 mt-0.5 font-medium">
                        Severe reaction to Penicillin (Anaphylaxis risk). Avoid
                        beta-lactam antibiotics.
                      </div>
                    </div>
                  </div>

                  {/* Alert 2: High Priority */}
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle
                      size={16}
                      className="text-[#F59E0B] mt-0.5 shrink-0"
                    />
                    <div>
                      <div
                        className="text-xs font-bold text-amber-900"
                        style={{ fontFamily: PP }}
                      >
                        High Priority Alert
                      </div>
                      <div className="text-xs text-amber-800 mt-0.5 font-medium">
                        Hypertensive episode on last visit (BP 150/95). Monitor
                        vitals closely.
                      </div>
                    </div>
                  </div>

                  {/* Alert 3: Important Note */}
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                    <Info
                      size={16}
                      className="text-[#0D47A1] mt-0.5 shrink-0"
                    />
                    <div>
                      <div
                        className="text-xs font-bold text-blue-950"
                        style={{ fontFamily: PP }}
                      >
                        Important Medical Notes
                      </div>
                      <div className="text-xs text-blue-800 mt-0.5 font-medium">
                        Requires blood pressure tracking prior to prescribing
                        NSAIDs or cardiac medication.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 06: APPOINTMENT TIMELINE */}
            {(activeTab === "all" || activeTab === "timeline") && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Clock size={15} className="text-[#0D47A1]" /> Section 06 ·
                  Appointment Timeline
                </h3>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineSteps.map((step) => (
                    <div key={step.title} className="relative">
                      <div
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${step.status === "completed" ? "border-[#66BB6A] text-[#66BB6A]" : step.status === "active" ? "border-[#0D47A1] text-[#0D47A1]" : "border-slate-300"}`}
                      >
                        {step.status === "completed" && <Check size={10} />}
                        {step.status === "active" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
                        )}
                      </div>
                      <div>
                        <div
                          className="text-xs font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {step.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {step.timestamp} · {step.by}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STICKY FOOTER ACTIONS */}
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
              style={{ fontFamily: RB }}
            >
              Close
            </button>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                type="button"
                onClick={() => onPrintClick(apt)}
                className="px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Printer size={14} /> Print Summary
              </button>

              {isNurse ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPatientSelect?.(apt.patientId);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <User size={14} /> View Patient Profile
                </button>
              ) : isDoctor ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartConsultation?.(apt.id);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors shadow-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Stethoscope size={16} /> Start Consultation
                </button>
              ) : showCheckInButton ? (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="py-2.5 px-4 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ fontFamily: PP }}
                >
                  <CheckCircle2 size={14} />{" "}
                  {isCheckingIn ? "Checking In..." : "Check-In Patient"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onEditClick(apt);
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Edit size={14} /> Edit Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
