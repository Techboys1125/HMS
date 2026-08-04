import React, { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  User,
  FileText,
  Heart,
  Check,
} from "lucide-react";
import type { AppointmentRecord } from "../../appointments";
import { vitalsService } from "../services/vitals.service";

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

interface RecordPatientVitalsFormProps {
  activeApt: AppointmentRecord;
  onBack: () => void;
  onPatientSelect?: (id: number | string) => void;
  onMarkReady: (aptId: string) => void;
}

export const RecordPatientVitalsForm: React.FC<
  RecordPatientVitalsFormProps
> = ({ activeApt, onBack, onPatientSelect, onMarkReady }) => {
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

      await vitalsService.submitVitals(activeApt.id, payload);
      triggerToast("Vitals recorded successfully!", "success");
      onMarkReady(String(activeApt.id));
    } catch {
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

        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          style={{ fontFamily: PP }}
        >
          <ArrowLeft size={14} /> Back to Center
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
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#64748B] hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            onClick={handleSaveVitals}
            className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <Check size={14} /> Save Vitals
          </button>
        </div>
      </div>
    </div>
  );
};
