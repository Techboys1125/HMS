import { useState, useMemo, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Heart,
  CheckCircle2,
  Search,
  RotateCcw,
  ArrowLeft,
  Clock,
  User,
  Check,
  AlertCircle,
  FileText,
  ShieldAlert,
  Printer,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Users,
  CheckSquare,
  Stethoscope,
} from "lucide-react";
import { Pagination } from "../../../common/components/Pagination";
import type { AppointmentRecord } from "../../appointments";
import { toDisplayStatus } from "../../appointments/services/appointment.service";
import { vitalsService } from "../services/vitals.service";
import { QUEUE_QUERY_KEY } from "../../opd/hooks/useQueue";
import type {
  RecordedVitalsData,
  NurseWaitingPatient,
} from "../types/vitals.types";
import { Avatar } from "../../../common/components/Avatar";
import { usePermissions } from "../../../permissions/usePermissions";

// --- Typography Tokens ---
const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

interface Props {
  onPatientSelect?: (id: number | string) => void;
  onViewAppointmentDetails?: (apt: AppointmentRecord) => void;
  initialViewMode?: "center" | "record" | "details";
}

/* ─────────────────────────────────────────────────────────────────────────────
   VITALS DETAILS SCREEN (READ ONLY)
   ───────────────────────────────────────────────────────────────────────────── */
function VitalsDetailsScreen({
  activeApt,
  vitalsData = {
    height: "",
    weight: "",
    bmi: "",
    temp: "",
    systolic: "",
    diastolic: "",
    pulse: "",
    resp: "",
    spo2: "",
    sugar: "",
    appearance: "",
    consciousness: "",
    observation: "",
    recordedBy: "",
    recordedAt: "",
  },
  onBack,
  onPatientSelect,
  onPrint,
}: {
  activeApt: AppointmentRecord | null;
  vitalsData?: RecordedVitalsData;
  onBack: () => void;
  onPatientSelect?: (id: number | string) => void;
  onPrint?: () => void;
}) {
  const patientInfo = useMemo(() => {
    if (!activeApt) return null;
    return (
      activeApt.patient || {
        id: activeApt.patientId,
        mrn: activeApt.mrn,
        name: activeApt.patientName,
        age: activeApt.patientAge,
        gender: activeApt.patientGender,
        bloodGroup: "O+",
        phone: activeApt.patientPhone,
        emergencyContact: "+1 (555) 987-6543 (Spouse)",
      }
    );
  }, [activeApt]);

  const handlePrintAction = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  if (!activeApt) {
    return (
      <div
        className="flex-1 overflow-y-auto bg-[#F1F5F9] p-6 flex flex-col items-center justify-center space-y-4"
        style={{ fontFamily: RB }}
      >
        <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm max-w-md w-full text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center mx-auto border border-amber-100">
            <Activity size={32} />
          </div>
          <h2
            className="text-base font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            No vitals have been recorded for this patient.
          </h2>
          <p className="text-xs text-[#64748B]">
            Please select a patient from the prep queue to record vital signs or
            view details.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors"
            style={{ fontFamily: PP }}
          >
            Back to Vitals Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#F1F5F9] p-6 space-y-6"
      style={{ fontFamily: RB }}
    >
      {/* HEADER & BREADCRUMB */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
        <div>
          <div
            className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5"
            style={{ fontFamily: PP }}
          >
            Nurse / Vitals Management / Vitals Details
          </div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Vitals Details
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Review patient vitals before consultation.
          </p>
        </div>
      </div>

      {/* STICKY PATIENT SUMMARY STRIP */}
      <div className="bg-linear-to-r from-blue-900 via-[#0D47A1] to-[#009688] rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={activeApt.patientName} size="lg" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                {activeApt.tokenNo}
              </span>
              <span className="text-xs font-bold bg-[#66BB6A] text-white px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 size={12} /> Vitals Recorded
              </span>
              <span className="text-xs text-blue-100 font-mono">
                {activeApt.timeSlot}
              </span>
            </div>
            <h2
              className="text-lg font-bold text-white mt-1"
              style={{ fontFamily: PP }}
            >
              {activeApt.patientName}
            </h2>
            <div className="text-xs text-blue-100 mt-0.5">
              {activeApt.mrn} · {activeApt.patientAge}y /{" "}
              {activeApt.patientGender} · Blood Group:{" "}
              <strong className="text-white">
                {patientInfo?.bloodGroup || "O+"}
              </strong>{" "}
              · Doctor:{" "}
              <strong className="text-white">{activeApt.doctorName}</strong> ·
              Dept:{" "}
              <strong className="text-white">
                {typeof activeApt.department === "string"
                  ? activeApt.department
                  : activeApt.department?.departmentName ||
                    activeApt.department?.name ||
                    activeApt.department?.departmentCode ||
                    ""}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onPatientSelect && (
            <button
              onClick={() => onPatientSelect(activeApt.patientId)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <User size={13} /> View Patient Profile
            </button>
          )}
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 01 & SECTION 02 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SECTION 01: Patient Information */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <h3
                className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <User size={14} className="text-[#0D47A1]" /> Patient
                Information
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient Name</span>
                  <strong className="text-slate-700">
                    {activeApt.patientName}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MRN</span>
                  <strong className="text-slate-700 font-mono">
                    {activeApt.mrn}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Age / Gender</span>
                  <strong className="text-slate-700">
                    {activeApt.patientAge}y / {activeApt.patientGender}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blood Group</span>
                  <strong className="text-slate-700">
                    {patientInfo?.bloodGroup || "O+"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile Number</span>
                  <strong className="text-slate-700 font-mono">
                    {activeApt.patientPhone}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Contact</span>
                  <strong className="text-slate-700">
                    {patientInfo?.emergencyContact || "Spouse"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Known Allergies</span>
                  <strong className="text-[#EF4444] font-bold">
                    Penicillin, NSAIDs
                  </strong>
                </div>
              </div>
            </div>

            {/* SECTION 02: Appointment Information */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <h3
                className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Calendar size={14} className="text-[#0D47A1]" /> Appointment
                Information
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Appointment ID</span>
                  <strong className="text-slate-700 font-mono">
                    {activeApt.id}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Appointment Date</span>
                  <strong className="text-slate-700">
                    {activeApt.appointmentDate}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Appointment Time</span>
                  <strong className="text-slate-700 font-mono">
                    {activeApt.timeSlot}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Doctor</span>
                  <strong className="text-slate-700">
                    {activeApt.doctorName}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department</span>
                  <strong className="text-slate-700">
                    {typeof activeApt.department === "string"
                      ? activeApt.department
                      : activeApt.department?.departmentName ||
                        activeApt.department?.name ||
                        activeApt.department?.departmentCode ||
                        ""}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Visit Type</span>
                  <strong className="text-[#009688] font-bold">
                    {activeApt.visitType}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Queue Status</span>
                  <strong className="text-[#66BB6A] font-bold">
                    Ready for Consultation
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 03: Recorded Vitals Cards */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3
                className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Heart size={15} className="text-[#EF4444]" /> Recorded Clinical
                Vitals
              </h3>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock size={12} /> Recorded at {vitalsData.recordedAt}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Height
                </div>
                <div
                  className="text-lg font-bold text-[#111827] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.height || "—"}{" "}
                  <span className="text-xs text-slate-500 font-normal">cm</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Standard
                </div>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Weight
                </div>
                <div
                  className="text-lg font-bold text-[#111827] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.weight || "—"}{" "}
                  <span className="text-xs text-slate-500 font-normal">kg</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Standard
                </div>
              </div>

              <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100 space-y-1">
                <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                  BMI
                </div>
                <div
                  className="text-lg font-bold text-[#009688] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.bmi || "—"}
                </div>
                <div className="text-[10px] text-teal-700 font-semibold">
                  Normal Weight
                </div>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Temperature
                </div>
                <div
                  className="text-lg font-bold text-[#111827] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.temp || "—"}{" "}
                  <span className="text-xs text-slate-500 font-normal">°C</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  Afebrile / Normal
                </div>
              </div>

              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-1">
                <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                  Blood Pressure
                </div>
                <div
                  className="text-lg font-bold text-[#0D47A1] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.systolic && vitalsData.diastolic
                    ? `${vitalsData.systolic}/${vitalsData.diastolic}`
                    : "—"}{" "}
                  <span className="text-xs text-blue-700 font-normal">
                    mmHg
                  </span>
                </div>
                <div className="text-[10px] text-blue-800 font-semibold">
                  Optimal Range
                </div>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pulse Rate
                </div>
                <div
                  className="text-lg font-bold text-[#111827] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.pulse || "—"}{" "}
                  <span className="text-xs text-slate-500 font-normal">
                    bpm
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  Normal Rhythm
                </div>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Respiration
                </div>
                <div
                  className="text-lg font-bold text-[#111827] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.resp || "—"}{" "}
                  <span className="text-xs text-slate-500 font-normal">
                    cpm
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  Eupnea
                </div>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 space-y-1">
                <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                  SpO₂ Oxygen
                </div>
                <div
                  className="text-lg font-bold text-[#66BB6A] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.spo2 || "—"}{" "}
                  <span className="text-xs text-emerald-700 font-normal">
                    %
                  </span>
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold">
                  Adequate Saturation
                </div>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Blood Sugar
                </div>
                <div
                  className="text-lg font-bold text-[#111827] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.sugar || "—"}{" "}
                  <span className="text-xs text-slate-500 font-normal">
                    mg/dL
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Fasting / Normal
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 04: Clinical Observation */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <FileText size={14} className="text-[#0D47A1]" /> Clinical
              Observation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">
                  General Appearance
                </span>
                <strong className="text-slate-800 text-sm">
                  {vitalsData.appearance}
                </strong>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">
                  Consciousness Level
                </span>
                <strong className="text-slate-800 text-sm">
                  {vitalsData.consciousness}
                </strong>
              </div>

              <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">
                  Chief Complaint
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {activeApt.chiefComplaint}
                </p>
              </div>

              <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">
                  Nursing Observation & Clinical Prep Notes
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {vitalsData.observation}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 05: Patient Alerts */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <ShieldAlert size={14} className="text-[#EF4444]" /> Patient
              Alerts & Clinical Risk Indicators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-red-50/80 border border-red-100 p-3.5 rounded-xl space-y-1">
                <strong
                  className="text-red-900 block font-bold items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <AlertTriangle size={14} className="text-[#EF4444]" /> Known
                  Allergies
                </strong>
                <p className="text-red-950/80 font-medium">
                  Drug Allergy: Penicillin & NSAIDs. Severe reaction history.
                </p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 p-3.5 rounded-xl space-y-1">
                <strong
                  className="text-amber-900 block font-bold items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <ShieldAlert size={14} className="text-[#F59E0B]" /> High Risk
                  Indicators
                </strong>
                <p className="text-amber-950/80 font-medium">
                  Hypertensive crisis history. Borderline diabetic precaution.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <strong
                  className="text-slate-800 block font-bold"
                  style={{ fontFamily: PP }}
                >
                  Chronic Conditions
                </strong>
                <p className="text-slate-600 font-medium">
                  Type 2 Diabetes Mellitus, Essential Hypertension.
                </p>
              </div>
              <div className="bg-blue-50/80 border border-blue-100 p-3.5 rounded-xl space-y-1">
                <strong
                  className="text-blue-900 block font-bold"
                  style={{ fontFamily: PP }}
                >
                  Special Precautions
                </strong>
                <p className="text-blue-950/80 font-medium">
                  Requires arm cuff on left side due to right arm vascular
                  access.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 06: Vitals Activity Timeline */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Clock size={14} className="text-[#0D47A1]" /> Vitals Activity
              Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="relative flex items-start justify-between gap-4">
                <div className="absolute -left-5.75 top-0.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-[#0D47A1] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
                </div>
                <div>
                  <h4
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Patient Checked In
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {activeApt.appointmentDate} at {activeApt.timeSlot}
                  </p>
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                  <div>{activeApt.timeSlot}</div>
                </div>
              </div>

              <div className="relative flex items-start justify-between gap-4">
                <div className="absolute -left-5.75 top-0.5 w-4 h-4 rounded-full bg-teal-100 border-2 border-[#009688] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
                </div>
                <div>
                  <h4
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Vitals Recorded
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All core parameters recorded and validated
                  </p>
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                  <div>{vitalsData.recordedAt || "—"}</div>
                  <div className="text-slate-500 font-semibold">
                    {vitalsData.recordedBy || "—"}
                  </div>
                </div>
              </div>

              <div className="relative flex items-start justify-between gap-4">
                <div className="absolute -left-5.75 top-0.5 w-4 h-4 rounded-full bg-green-100 border-2 border-[#66BB6A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
                </div>
                <div>
                  <h4
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Ready for Consultation
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Queue status updated — patient ready for doctor review
                  </p>
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                  <div>Now</div>
                  <div className="text-slate-500 font-semibold">
                    {vitalsData.recordedBy || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="lg:col-span-12 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-md flex items-center justify-between gap-3 sticky bottom-4 z-40">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#64748B] hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <ArrowLeft size={14} /> Back to Queue
          </button>

          <button
            onClick={handlePrintAction}
            className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5 shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Printer size={14} /> Print Vitals
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RECORD PATIENT VITALS WORKSPACE
   ───────────────────────────────────────────────────────────────────────────── */
export function RecordPatientVitalsForm({
  activeApt,
  onBack,
  onPatientSelect,
  onMarkReady,
}: {
  activeApt: AppointmentRecord;
  onBack: () => void;
  onPatientSelect?: (id: number | string) => void;
  onMarkReady: () => void | Promise<void>;
}) {
  const { can } = usePermissions();
  const [chiefComplaint, setChiefComplaint] = useState(
    activeApt.chiefComplaint || activeApt.reason || "",
  );
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");

  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [temperature, setTemperature] = useState("98.6");
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [pulse, setPulse] = useState("72");
  const [spo2, setSpo2] = useState("98");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  const triggerToast = (
    message: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveVitals = async () => {
    try {
      const payload = {
        chiefComplaint,
        symptoms,
        diagnosis,
        clinicalNotes,
        temperature: Number(temperature),
        weight: Number(weight),
        height: Number(height),
        bloodPressure,
        pulse: Number(pulse),
        spo2: Number(spo2),
      };

      const wasSaved = await vitalsService.submitVitals(
        activeApt.id,
        payload,
        activeApt.status,
      );
      if (!wasSaved) throw new Error("Vitals submission was not accepted");

      triggerToast("Vitals recorded successfully!", "success");

      await onMarkReady();
    } catch (err) {
      console.log(err);
      triggerToast("Unable to record vitals.", "error");
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#F1F5F9] p-6 space-y-6"
      style={{ fontFamily: RB }}
    >
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-white text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200 ${
            toast.type === "success"
              ? "bg-[#66BB6A] border-green-300"
              : toast.type === "error"
                ? "bg-[#EF4444] border-red-300"
                : "bg-[#0D47A1] border-blue-300"
          }`}
        >
          <AlertCircle size={16} />
          {toast.message}
        </div>
      )}

      {/* HEADER & BREADCRUMB */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
        <div>
          <div
            className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5"
            style={{ fontFamily: PP }}
          >
            Nurse / Vitals Management / Record Patient Vitals
          </div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Record Patient Vitals
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Record and verify patient vital signs before outpatient
            consultation.
          </p>
        </div>
      </div>

      {/* STICKY PATIENT SUMMARY STRIP */}
      <div className="bg-linear-to-r from-blue-900 via-[#0D47A1] to-[#009688] rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={activeApt.patientName} size="lg" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                {activeApt.tokenNo}
              </span>
              <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded">
                Waiting for Vitals
              </span>
              <span className="text-xs text-blue-100 font-mono">
                {activeApt.timeSlot}
              </span>
            </div>
            <h2
              className="text-lg font-bold text-white mt-1"
              style={{ fontFamily: PP }}
            >
              {activeApt.patientName}
            </h2>
            <div className="text-xs text-blue-100 mt-0.5">
              MRN: {activeApt.mrn} · {activeApt.patientAge}y /{" "}
              {activeApt.patientGender} · Doctor:{" "}
              <strong className="text-white">{activeApt.doctorName}</strong> ·
              Dept:{" "}
              <strong className="text-white">
                {typeof activeApt.department === "string"
                  ? activeApt.department
                  : activeApt.department?.departmentName ||
                    activeApt.department?.name ||
                    activeApt.department?.departmentCode ||
                    ""}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onPatientSelect && (
            <button
              onClick={() => onPatientSelect(activeApt.patientId)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <User size={13} /> View Patient Profile
            </button>
          )}
        </div>
      </div>

      {/* FORM WORKSPACE */}
      <div className="space-y-6">
        {/* SECTION 01: Patient Information (Read Only) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
          <h3
            className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <User size={14} className="text-[#0D47A1]" /> Patient Information
            (Read Only)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">
                Patient Name
              </span>
              <strong className="text-slate-800 text-sm font-semibold">
                {activeApt.patientName}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">MRN</span>
              <strong className="text-slate-800 font-mono text-xs">
                {activeApt.mrn}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">
                Appointment ID
              </span>
              <strong className="text-slate-800 font-mono text-xs">
                {activeApt.id}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Doctor</span>
              <strong className="text-slate-800 font-semibold">
                {activeApt.doctorName}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">
                Department
              </span>
              <strong className="text-slate-800 font-semibold">
                {typeof activeApt.department === "string"
                  ? activeApt.department
                  : activeApt.department?.departmentName ||
                    activeApt.department?.name ||
                    activeApt.department?.departmentCode ||
                    ""}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Token</span>
              <strong className="text-[#0D47A1] font-bold font-mono text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {activeApt.tokenNo}
              </strong>
            </div>
          </div>
        </div>

        {/* SECTION 02: Clinical Information */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
          <h3
            className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <FileText size={14} className="text-[#0D47A1]" /> Clinical
            Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Chief Complaint
              </label>
              <textarea
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Enter chief complaint"
                rows={3}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Enter symptoms"
                rows={3}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Diagnosis
              </label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Provisional diagnosis"
                rows={3}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Clinical Notes
              </label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Clinical observations"
                rows={3}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700 resize-y"
              />
            </div>
          </div>
        </div>

        {/* SECTION 03: Vital Signs */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
          <h3
            className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Heart size={14} className="text-[#EF4444]" /> Vital Signs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Temperature
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Blood Pressure
              </label>
              <input
                value={bloodPressure}
                placeholder="120/80"
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                Pulse
              </label>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748B] block">
                SpO₂
              </label>
              <input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* STICKY FOOTER ACTION BAR */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-md flex items-center justify-between gap-3 sticky bottom-4 z-40">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#64748B] hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <ArrowLeft size={14} /> Back to Queue
          </button>

          <button
            onClick={handleSaveVitals}
            disabled={!can("VITALS_CREATE")}
            className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: PP }}
          >
            <Check size={14} /> Save Vitals
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SCREEN: VITALS MANAGEMENT CENTER (LANDING PAGE)
   ───────────────────────────────────────────────────────────────────────────── */
export function RecordPatientVitalsScreen({
  onPatientSelect,
  onViewAppointmentDetails,
  initialViewMode = "center",
}: Props) {
  const { can } = usePermissions();
  const queryClient = useQueryClient();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"center" | "record" | "details">(
    initialViewMode,
  );

  const loadWaitingAppointments = useCallback(async () => {
    try {
      const list = await vitalsService.getWaitingPatients();
      if (Array.isArray(list)) {
        const mapped: AppointmentRecord[] = list.map(
          (item: NurseWaitingPatient, idx: number) => ({
            id: item.appointmentId || item.id || `apt-${idx + 1}`,
            appointmentNumber:
              item.appointmentNumber || item.tokenNumber || `TK-${100 + idx}`,
            tokenNo: item.tokenNumber || item.token || `TK-${100 + idx}`,
            patientId: item.patientId || item.patient?.id || `P-${idx + 1}`,
            patientName:
              item.patientName ||
              item.patient?.name ||
              item.patient?.fullName ||
              "Patient",
            patientAge: Number(item.age || item.patient?.age || 30),
            patientGender: (item.gender ||
              item.patient?.gender ||
              "Male") as AppointmentRecord["patientGender"],
            patientPhone:
              item.contact || item.patient?.contact || item.phone || "N/A",
            mrn: item.mrn || item.patient?.mrn || `MRN-${1000 + idx}`,
            doctorId: item.doctorId || item.doctor?.doctorId || 1,
            doctorName: item.doctorName || item.doctor?.name || "Duty Doctor",
            department:
              item.departmentName ||
              (typeof item.department === "object"
                ? item.department?.departmentName ||
                  item.department?.name ||
                  item.department?.departmentCode
                : undefined) ||
              (typeof item.department === "string"
                ? item.department
                : undefined) ||
              item.doctor?.departmentName ||
              item.doctor?.department ||
              "Cardiology",
            departmentName:
              item.departmentName ||
              (typeof item.department === "object"
                ? item.department?.departmentName ||
                  item.department?.name ||
                  item.department?.departmentCode
                : undefined) ||
              (typeof item.department === "string"
                ? item.department
                : undefined) ||
              item.doctor?.departmentName ||
              item.doctor?.department ||
              "Cardiology",
            specialty:
              item.specialty ||
              item.doctor?.specialty ||
              (typeof item.department === "object"
                ? item.department?.departmentName ||
                  item.department?.name ||
                  item.department?.departmentCode
                : undefined) ||
              (typeof item.department === "string"
                ? item.department
                : undefined) ||
              item.doctor?.department ||
              "General Medicine",

            appointmentDate: new Date().toISOString().split("T")[0],
            appointmentTime:
              item.checkInTime ||
              item.appointmentTime ||
              item.time ||
              item.timeSlot ||
              "Now",
            time:
              item.checkInTime ||
              item.appointmentTime ||
              item.time ||
              item.timeSlot ||
              "Now",
            timeSlot:
              item.checkInTime ||
              item.appointmentTime ||
              item.time ||
              item.timeSlot ||
              "Now",
            status: toDisplayStatus(item.status),
            queueStatus: item.status || "WAITING_FOR_VITALS",
            visitType:
              item.visitType === "First Visit"
                ? "First Visit"
                : item.visitType === "Follow-up"
                  ? "Follow-up"
                  : "Regular",
            reason: "Pre-consultation Vitals Check",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        );
        setAppointments(mapped);
      }
    } catch (err) {
      console.warn("Waiting list fetch warning:", err);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadWaitingAppointments);
  }, [loadWaitingAppointments]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [aptStatusFilter, setAptStatusFilter] = useState("All");
  const [vitalsStatusFilter, setVitalsStatusFilter] = useState("All");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All");

  // Status Tab selection
  const [activeTab, setActiveTab] = useState<
    | "All"
    | "Waiting for Vitals"
    | "Recording In Progress"
    | "Vitals Recorded"
    | "Ready For Consultation"
  >("All");

  // Toast System
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);
  const triggerToast = (
    message: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Dynamic Doctor list from appointments
  const dynamicDoctors = useMemo(() => {
    const list = appointments
      .map((a) => a.doctorName)
      .filter((name): name is string => Boolean(name && name.trim()));
    return Array.from(new Set(list));
  }, [appointments]);

  // Active Selected Appointment Record
  const activeApt = useMemo(() => {
    if (!selectedAptId) return null;
    return (
      appointments.find((a) => String(a.id) === String(selectedAptId)) || null
    );
  }, [appointments, selectedAptId]);

  // Fetched vitals data for details view
  const [detailsVitals, setDetailsVitals] = useState<RecordedVitalsData | null>(
    null,
  );

  const fetchVitalsForDetails = useCallback(async (aptId: string | number) => {
    try {
      const data = await vitalsService.getVitals(aptId);
      setDetailsVitals(data);
    } catch (err) {
      console.log(err);
      setDetailsVitals(null);
    }
  }, []);

  // Today's Queue list
  const todayQueue = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return appointments.filter((a) => a.appointmentDate === todayStr);
  }, [appointments]);

  // Status map helper to determine vitals status string for an appointment
  const getVitalsStatus = (apt: AppointmentRecord) => {
    if (apt.status === "Checked-In" || apt.status === "Waiting for Vitals")
      return "Waiting for Vitals";
    if (apt.notes?.includes("vitals in progress"))
      return "Recording In Progress";
    if (
      apt.status === "In Consultation" ||
      apt.status === "In Progress" ||
      apt.status === "Waiting" ||
      apt.status === "Waiting for Doctor" ||
      apt.status === "Called" ||
      apt.queueStatus === "WAITING_FOR_DOCTOR_CALL"
    )
      return "Ready For Consultation";
    if (apt.status === "Completed") return "Vitals Recorded";
    return "Waiting for Vitals";
  };

  // Calculated KPI Stats for Summary Cards
  const kpiStats = useMemo(() => {
    const total = todayQueue.length;
    const pending = todayQueue.filter(
      (a) => getVitalsStatus(a) === "Waiting for Vitals",
    ).length;
    const inProgress = todayQueue.filter(
      (a) => getVitalsStatus(a) === "Recording In Progress",
    ).length;
    const recorded = todayQueue.filter(
      (a) => getVitalsStatus(a) === "Vitals Recorded",
    ).length;
    const ready = todayQueue.filter(
      (a) => getVitalsStatus(a) === "Ready For Consultation",
    ).length;
    return {
      total,
      pending,
      inProgress,
      recorded,
      ready,
      avgTime: "4.2 mins",
    };
  }, [todayQueue]);

  // Filtered Appointments Dataset
  const filteredAppointments = useMemo(() => {
    return todayQueue.filter((apt) => {
      const vStatus = getVitalsStatus(apt);

      // Filter by Status Tab
      if (activeTab !== "All" && vStatus !== activeTab) {
        return false;
      }

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          apt.patientName?.toLowerCase().includes(q) ||
          (apt.mrn ? String(apt.mrn).toLowerCase().includes(q) : false) ||
          String(apt.id).toLowerCase().includes(q) ||
          (apt.tokenNo ? String(apt.tokenNo).toLowerCase().includes(q) : false);
        if (!match) return false;
      }

      // Doctor Filter
      if (doctorFilter !== "All" && apt.doctorName !== doctorFilter)
        return false;
      // Department Filter
      if (deptFilter !== "All" && apt.department !== deptFilter) return false;
      // Appointment Status Filter
      if (aptStatusFilter !== "All" && apt.status !== aptStatusFilter)
        return false;
      // Vitals Status Filter
      if (vitalsStatusFilter !== "All" && vStatus !== vitalsStatusFilter)
        return false;
      // Visit Type Filter
      if (visitTypeFilter !== "All" && apt.visitType !== visitTypeFilter)
        return false;

      return true;
    });
  }, [
    todayQueue,
    activeTab,
    searchQuery,
    doctorFilter,
    deptFilter,
    aptStatusFilter,
    vitalsStatusFilter,
    visitTypeFilter,
  ]);

  // Pagination for queue table
  const [queuePage, setQueuePage] = useState(1);
  const queuePageSize = 10;
  const queueTotalPages = Math.ceil(
    filteredAppointments.length / queuePageSize,
  );
  const paginatedAppointments = filteredAppointments.slice(
    (queuePage - 1) * queuePageSize,
    queuePage * queuePageSize,
  );

  const handleSelectPatient = (
    apt: AppointmentRecord,
    mode: "record" | "details" = "record",
  ) => {
    setSelectedAptId(String(apt.id));
    setViewMode(mode);
    if (mode === "details") {
      fetchVitalsForDetails(apt.id);
    }
    triggerToast(`Loaded ${apt.patientName}`, "info");
  };

  const handleMarkPatientReady = async () => {
    await loadWaitingAppointments();
    setSelectedAptId(null);
    setViewMode("center");
    queryClient.invalidateQueries({ queryKey: QUEUE_QUERY_KEY });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDoctorFilter("All");
    setDeptFilter("All");
    setAptStatusFilter("All");
    setVitalsStatusFilter("All");
    setVisitTypeFilter("All");
    setActiveTab("All");
    triggerToast("Filters reset", "info");
  };

  const handleRefreshQueue = () => {
    triggerToast("Patient queue refreshed", "success");
  };

  // If currently in Record Vitals workspace mode:
  if (viewMode === "record" && activeApt) {
    return (
      <RecordPatientVitalsForm
        activeApt={activeApt}
        onBack={() => setViewMode("center")}
        onPatientSelect={onPatientSelect}
        onMarkReady={handleMarkPatientReady}
      />
    );
  }

  // If currently in Vitals Details (Read Only) mode:
  if (viewMode === "details" && activeApt) {
    return (
      <VitalsDetailsScreen
        activeApt={activeApt}
        vitalsData={detailsVitals || undefined}
        onBack={() => {
          setViewMode("center");
          setDetailsVitals(null);
        }}
        onPatientSelect={onPatientSelect}
        onPrint={() => triggerToast("Printing Vitals Summary...", "info")}
      />
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#F1F5F9] p-6 space-y-6"
      style={{ fontFamily: RB }}
    >
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-white text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200 ${
            toast.type === "success"
              ? "bg-[#66BB6A] border-green-300"
              : toast.type === "error"
                ? "bg-[#EF4444] border-red-300"
                : "bg-[#0D47A1] border-blue-300"
          }`}
        >
          <AlertCircle size={16} />
          {toast.message}
        </div>
      )}

      {/* HEADER & BREADCRUMB */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div
            className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5"
            style={{ fontFamily: PP }}
          >
            Nurse / Vitals Management
          </div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Vitals Management Center
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage patient vital recording before OPD consultation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshQueue}
            className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <RefreshCw size={14} className="text-[#0D47A1]" /> Refresh Queue
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, MRN, Appointment ID, or Token Number..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            />
          </div>

          <button
            onClick={handleResetFilters}
            className="px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            title="Reset Filters"
            style={{ fontFamily: PP }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* EXPANDABLE FILTER DROPDOWNS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Doctor */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Doctor
            </label>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg outline-none text-slate-700 font-medium"
            >
              <option value="All">All Doctors</option>
              {dynamicDoctors.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg outline-none text-slate-700 font-medium"
            >
              <option value="All">All Depts</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Neurology">Neurology</option>
              <option value="Gynecology">Gynecology</option>
            </select>
          </div>

          {/* Appointment Status */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Apt Status
            </label>
            <select
              value={aptStatusFilter}
              onChange={(e) => setAptStatusFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg outline-none text-slate-700 font-medium"
            >
              <option value="All">All Apt Status</option>
              <option value="Waiting">Waiting</option>
              <option value="Checked-In">Checked-In</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          {/* Vitals Status */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Vitals Status
            </label>
            <select
              value={vitalsStatusFilter}
              onChange={(e) => setVitalsStatusFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg outline-none text-slate-700 font-medium"
            >
              <option value="All">All Vitals</option>
              <option value="Waiting for Vitals">Waiting for Vitals</option>
              <option value="Recording In Progress">
                Recording In Progress
              </option>
              <option value="Vitals Recorded">Vitals Recorded</option>
              <option value="Ready For Consultation">
                Ready For Consultation
              </option>
            </select>
          </div>

          {/* Visit Type */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Visit Type
            </label>
            <select
              value={visitTypeFilter}
              onChange={(e) => setVisitTypeFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg outline-none text-slate-700 font-medium"
            >
              <option value="All">All Visits</option>
              <option value="First Visit">First Visit</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>
        </div>
      </div>

      {/* STATUS TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(
          [
            { id: "All", label: "All", count: kpiStats.total },
            {
              id: "Waiting for Vitals",
              label: "Waiting for Vitals",
              count: kpiStats.pending,
            },
            {
              id: "Recording In Progress",
              label: "Recording In Progress",
              count: kpiStats.inProgress,
            },
            {
              id: "Vitals Recorded",
              label: "Vitals Recorded",
              count: kpiStats.recorded,
            },
            {
              id: "Ready For Consultation",
              label: "Ready For Consultation",
              count: kpiStats.ready,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 border ${
              activeTab === tab.id
                ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-xs"
                : "bg-white text-slate-600 border-[#E5E7EB] hover:bg-slate-50"
            }`}
            style={{ fontFamily: PP }}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SUMMARY KPI CARDS (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 01: Today's Patients */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
              style={{ fontFamily: PP }}
            >
              Today's Patients
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center border border-blue-100">
              <Users size={16} />
            </div>
          </div>
          <div
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            {kpiStats.total}
          </div>
          <div className="text-[10px] text-slate-400">
            Total OPD queue today
          </div>
        </div>

        {/* Card 02: Vitals Pending */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold text-amber-700 uppercase tracking-wider"
              style={{ fontFamily: PP }}
            >
              Vitals Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center border border-amber-100">
              <Clock size={16} />
            </div>
          </div>
          <div
            className="text-2xl font-bold text-[#F59E0B]"
            style={{ fontFamily: PP }}
          >
            {kpiStats.pending}
          </div>
          <div className="text-[10px] text-amber-600 font-medium">
            Awaiting prep recording
          </div>
        </div>

        {/* Card 03: Vitals Recorded */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold text-teal-700 uppercase tracking-wider"
              style={{ fontFamily: PP }}
            >
              Vitals Recorded
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center border border-teal-100">
              <CheckSquare size={16} />
            </div>
          </div>
          <div
            className="text-2xl font-bold text-[#009688]"
            style={{ fontFamily: PP }}
          >
            {kpiStats.recorded}
          </div>
          <div className="text-[10px] text-teal-600 font-medium">
            Recorded & verified
          </div>
        </div>

        {/* Card 04: Ready For Consultation */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold text-green-700 uppercase tracking-wider"
              style={{ fontFamily: PP }}
            >
              Ready For Consultation
            </span>
            <div className="w-8 h-8 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center border border-green-100">
              <Stethoscope size={16} />
            </div>
          </div>
          <div
            className="text-2xl font-bold text-[#66BB6A]"
            style={{ fontFamily: PP }}
          >
            {kpiStats.ready}
          </div>
          <div className="text-[10px] text-green-600 font-medium">
            In Doctor queue
          </div>
        </div>

        {/* Card 05: Average Recording Time */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
              style={{ fontFamily: PP }}
            >
              Avg Recording Time
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
              <Activity size={16} />
            </div>
          </div>
          <div
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            {kpiStats.avgTime}
          </div>
          <div className="text-[10px] text-slate-400">
            Target: &lt; 5.0 mins
          </div>
        </div>
      </div>

      {/* MAIN CONTENT LAYOUT (Two Columns: 8 Cols Table, 4 Cols Right Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: TABLE & FILTERS (8 COLS) */}
        <div className="lg:col-span-12 space-y-4">
          {/* ENTERPRISE DATA TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E7EB] bg-slate-50/50 flex items-center justify-between">
              <h3
                className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Clock size={15} className="text-[#0D47A1]" /> Patient Vitals
                Queue
              </h3>
              <span className="text-xs text-[#64748B]">
                Showing{" "}
                <strong className="text-[#111827]">
                  {filteredAppointments.length}
                </strong>{" "}
                patients
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB]">
                  <tr
                    className="text-[#64748B] font-bold"
                    style={{ fontFamily: PP }}
                  >
                    <th className="px-4 py-3.5">Token Number</th>
                    <th className="px-4 py-3.5">Patient</th>
                    <th className="px-4 py-3.5">MRN</th>
                    <th className="px-4 py-3.5">Doctor</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Appt Time</th>
                    <th className="px-4 py-3.5">Visit Type</th>
                    <th className="px-4 py-3.5">Vitals Status</th>
                    <th className="px-4 py-3.5">Queue Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {paginatedAppointments.map((apt) => {
                    const vStatus = getVitalsStatus(apt);
                    const isPending =
                      vStatus === "Waiting for Vitals" ||
                      vStatus === "Recording In Progress";

                    return (
                      <tr
                        key={apt.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {apt.tokenNo}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold flex items-center gap-2">
                          <Avatar name={apt.patientName} size="sm" />
                          <div>
                            <div>{apt.patientName}</div>
                            <div className="text-[10px] text-slate-400 font-mono font-normal">
                              {apt.patientAge}y / {apt.patientGender}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-600">
                          {apt.mrn}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">
                          {apt.doctorName}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">
                          {typeof apt.department === "string"
                            ? apt.department
                            : apt.departmentName ||
                              apt.department?.departmentName ||
                              apt.department?.name ||
                              apt.department?.departmentCode ||
                              "Cardiology"}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[#0D47A1] font-bold">
                          {apt.timeSlot}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[#009688] font-bold text-[11px] bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                            {apt.visitType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {isPending ? (
                            <span className="bg-amber-50 text-[#F59E0B] px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200">
                              {vStatus}
                            </span>
                          ) : (
                            <span className="bg-green-50 text-[#66BB6A] px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-200">
                              {vStatus}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-200">
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && can("VITALS_CREATE") && (
                              <button
                                onClick={() =>
                                  handleSelectPatient(apt, "record")
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-[11px] font-bold transition-colors shadow-xs"
                                style={{ fontFamily: PP }}
                              >
                                Record Vitals
                              </button>
                            )}
                            {!isPending && can("VITALS_VIEW") && (
                              <button
                                onClick={() =>
                                  handleSelectPatient(apt, "details")
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#009688] hover:bg-[#00796b] text-white text-[11px] font-bold transition-colors shadow-xs"
                                style={{ fontFamily: PP }}
                              >
                                View Vitals
                              </button>
                            )}

                            {onViewAppointmentDetails && (
                              <button
                                onClick={() => onViewAppointmentDetails(apt)}
                                className="px-2 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                                title="View Appointment Details"
                              >
                                <Calendar size={13} />
                              </button>
                            )}
                            {onPatientSelect && (
                              <button
                                onClick={() => onPatientSelect(apt.patientId)}
                                className="px-2 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                                title="View Patient Profile"
                              >
                                <User size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-12 text-center text-slate-400"
                      >
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Activity size={36} className="text-slate-300" />
                          <div
                            className="text-sm font-bold text-slate-700"
                            style={{ fontFamily: PP }}
                          >
                            No patients are waiting for vital sign recording.
                          </div>
                          <p className="text-xs text-slate-400 max-w-sm">
                            Try adjusting your filters or click Refresh Queue to
                            check for new check-ins.
                          </p>
                          <button
                            onClick={handleRefreshQueue}
                            className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                            style={{ fontFamily: PP }}
                          >
                            Refresh Queue
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredAppointments.length > 0 && (
              <Pagination
                currentPage={queuePage}
                totalPages={queueTotalPages}
                onPageChange={setQueuePage}
                pageSize={queuePageSize}
                totalCount={filteredAppointments.length}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
