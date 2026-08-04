import React, { useMemo } from "react";
import {
  Activity,
  ArrowLeft,
  Printer,
  CheckCircle2,
  User,
  Heart,
  Clock,
  FileText,
  ShieldAlert,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import type { AppointmentRecord } from "../../appointments";
import type { RecordedVitalsData } from "../types/vitals.types";

const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

function Avatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  }[size];

  return (
    <div
      className={`${sizeClass} rounded-full bg-[#0D47A1]/10 text-[#0D47A1] font-bold flex items-center justify-center border border-[#0D47A1]/20 shrink-0`}
    >
      {initials}
    </div>
  );
}

interface VitalsDetailsScreenProps {
  activeApt: AppointmentRecord | null;
  vitalsData?: RecordedVitalsData;
  onBack: () => void;
  onPatientSelect?: (id: number | string) => void;
  onPrint?: () => void;
}

export const VitalsDetailsScreen: React.FC<VitalsDetailsScreenProps> = ({
  activeApt,
  vitalsData = {
    height: "172",
    weight: "68",
    bmi: "23.0",
    temp: "36.8",
    systolic: "120",
    diastolic: "80",
    pulse: "72",
    resp: "16",
    spo2: "98",
    sugar: "96",
    pain: 2,
    appearance: "Normal / Healthy",
    consciousness: "Alert & Oriented",
    observation:
      "Patient is comfortable. No acute respiratory distress noted. Pre-consultation prep completed.",
    recordedBy: "Nurse Clara Oswald (RN-402)",
    recordedAt: "Today, 08:50 AM",
  },
  onBack,
  onPatientSelect,
  onPrint,
}) => {
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
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors cursor-pointer"
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
            Vitals Details (Read Only)
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Review patient vitals before consultation.
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          style={{ fontFamily: PP }}
        >
          <ArrowLeft size={14} /> Back to Queue
        </button>
      </div>

      {/* STICKY PATIENT SUMMARY STRIP */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0D47A1] to-[#009688] rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
                  {vitalsData.height}{" "}
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
                  {vitalsData.weight}{" "}
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
                  {vitalsData.bmi}
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
                  {vitalsData.temp}{" "}
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
                  {vitalsData.systolic}/{vitalsData.diastolic}{" "}
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
                  {vitalsData.pulse}{" "}
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
                  {vitalsData.resp}{" "}
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
                  {vitalsData.spo2}{" "}
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
                  {vitalsData.sugar}{" "}
                  <span className="text-xs text-slate-500 font-normal">
                    mg/dL
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Fasting / Normal
                </div>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100 space-y-1">
                <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                  Pain Score
                </div>
                <div
                  className="text-lg font-bold text-[#F59E0B] font-mono"
                  style={{ fontFamily: PP }}
                >
                  {vitalsData.pain}{" "}
                  <span className="text-xs text-amber-700 font-normal">
                    / 10
                  </span>
                </div>
                <div className="text-[10px] text-amber-800 font-semibold">
                  Mild Discomfort
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
                  className="text-red-900 block font-bold flex items-center gap-1.5"
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
                  className="text-amber-900 block font-bold flex items-center gap-1.5"
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
                <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-[#0D47A1] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
                </div>
                <div>
                  <h4
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Vitals Recording Started
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Patient arrived at OPD prep station 02
                  </p>
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                  <div>Today, 08:42 AM</div>
                  <div className="text-slate-500 font-semibold">
                    {vitalsData.recordedBy}
                  </div>
                </div>
              </div>

              <div className="relative flex items-start justify-between gap-4">
                <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-teal-100 border-2 border-[#009688] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
                </div>
                <div>
                  <h4
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Vitals Saved
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All 8 core parameters recorded and validated
                  </p>
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                  <div>Today, 08:48 AM</div>
                  <div className="text-slate-500 font-semibold">
                    {vitalsData.recordedBy}
                  </div>
                </div>
              </div>

              <div className="relative flex items-start justify-between gap-4">
                <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-green-100 border-2 border-[#66BB6A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
                </div>
                <div>
                  <h4
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Patient Marked Ready
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Queue status updated to Ready for Consultation
                  </p>
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                  <div>Today, 08:50 AM</div>
                  <div className="text-slate-500 font-semibold">
                    {vitalsData.recordedBy}
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
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#64748B] hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            onClick={handlePrintAction}
            className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <Printer size={14} /> Print Vitals
          </button>
        </div>
      </div>
    </div>
  );
};
