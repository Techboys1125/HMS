import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  User,
  AlertTriangle,
  CheckCircle2,
  Save,
  Printer,
  Download,
  FileText,
  Plus,
  Copy,
  Trash2,
  X,
  Edit3,
} from "lucide-react";
import type { EditableMedicine, RxStatus } from "../types/doctors.types";
import { FREQUENCY_OPTIONS, ROUTE_OPTIONS, COMMON_MEDICINES, PP, RB } from "../constants/doctors.constants";
import { Card } from "./Card";
import { Avatar } from "./Avatar";

export function DoctorEditPrescriptionScreen({
  prescriptionId = "RX-2026-0888",
  onBack,
  onSaveSuccess,
  onIssueSuccess,
  onViewConsultation,
  onViewPatientProfile,
}: {
  prescriptionId?: string;
  onBack?: () => void;
  onSaveSuccess?: () => void;
  onIssueSuccess?: () => void;
  onViewConsultation?: (consultId: string) => void;
  onViewPatientProfile?: (mrn: string) => void;
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const patientData = {
    patientName: "James Thornton",
    mrn: "MRN-772102",
    age: 67,
    gender: "Male",
    bloodGroup: "O+",
    consultationId: "CNS-1004",
    prescriptionId: prescriptionId,
    consultationDate: "24 Jul 2026",
    doctorName: "Dr. Arjun Mehta",
    department: "Cardiology",
    mobileNumber: "+1 (555) 889-1029",
    visitDate: "24 Jul 2026",
    allergies: ["Sulfa Drugs"],
    knownConditions: ["Hypertension", "Dyslipidemia"],
  };

  const [status, setStatus] = useState<RxStatus>("Draft");
  const [chiefComplaint, setChiefComplaint] = useState("Bilateral ankle swelling and mild morning headaches for 2 weeks.");
  const [clinicalFindings, setClinicalFindings] = useState("BP 152/94 mmHg, HR 76 bpm. Mild pedal edema (+1). S1 S2 normal.");
  const [finalDiagnosis, setFinalDiagnosis] = useState("Essential Hypertension (I10)");
  const [icdCode, setIcdCode] = useState("I10 — Essential (primary) Hypertension");
  const [clinicalNotes, setClinicalNotes] = useState("Adjusting antihypertensive therapy. Routine renal function tests advised in 2 weeks.");

  const [medicines, setMedicines] = useState<EditableMedicine[]>([
    { id: "1", name: "Ramipril", strength: "2.5mg", route: "Oral", dosage: "1 Tablet", frequency: "Once Daily", duration: "30 Days", quantity: "30 Tabs", instructions: "Take in the morning after breakfast" },
    { id: "2", name: "Hydrochlorothiazide", strength: "12.5mg", route: "Oral", dosage: "1 Tablet", frequency: "Once Daily", duration: "30 Days", quantity: "30 Tabs", instructions: "Take in the morning" },
  ]);

  const [dietAdvice, setDietAdvice] = useState("Low salt intake (< 2g/day), restrict caffeine and canned foods.");
  const [lifestyleAdvice, setLifestyleAdvice] = useState("Daily BP monitoring twice daily (morning & evening). Log readings.");
  const [exerciseAdvice, setExerciseAdvice] = useState("Moderate 30-min brisk walking 5 days a week.");
  const [specialInstructions, setSpecialInstructions] = useState("If experiencing severe dizziness or SBP > 180 mmHg, contact clinic immediately.");

  const [followupRequired, setFollowupRequired] = useState("Yes");
  const [nextVisitDate, setNextVisitDate] = useState("2026-08-07");
  const [followupNotes, setFollowupNotes] = useState("Review home BP log and serum electrolytes.");

  const revisionInfo = {
    prescriptionId: prescriptionId,
    createdBy: "Dr. Arjun Mehta",
    createdDate: "24 Jul 2026, 08:30 AM",
    lastModifiedBy: "Dr. Arjun Mehta",
    lastModifiedDate: "24 Jul 2026, 11:15 AM",
    revisionNumber: 2,
    currentStatus: status,
  };

  const handleAddMedicine = () => {
    const newMed: EditableMedicine = {
      id: Date.now().toString(),
      name: "",
      strength: "5mg",
      route: "Oral",
      dosage: "1 Tablet",
      frequency: "Once Daily",
      duration: "30 Days",
      quantity: "30 Tabs",
      instructions: "Take after meals",
    };
    setMedicines((prev) => [...prev, newMed]);
  };

  const handleMedicineChange = (id: string, field: keyof EditableMedicine, value: string) => {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
    if (errors[`med_${id}_${field}`]) {
      setErrors((prev) => { const copy = { ...prev }; delete copy[`med_${id}_${field}`]; return copy; });
    }
  };

  const handleDuplicateMedicine = (med: EditableMedicine) => {
    const dup: EditableMedicine = { ...med, id: Date.now().toString(), name: `${med.name} (Copy)` };
    setMedicines((prev) => [...prev, dup]);
    showToast(`Duplicated ${med.name || "Medicine row"}`);
  };

  const handleDeleteMedicine = (id: string) => {
    if (medicines.length === 1) { showToast("Prescription must contain at least one medicine"); return; }
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!finalDiagnosis.trim()) errs.diagnosis = "Diagnosis is required";
    medicines.forEach((m, idx) => {
      if (!m.name.trim()) errs[`med_${m.id}_name`] = `Medicine #${idx + 1} name required`;
      if (!m.dosage.trim()) errs[`med_${m.id}_dosage`] = `Dosage required`;
      if (!m.frequency.trim()) errs[`med_${m.id}_frequency`] = `Frequency required`;
      if (!m.duration.trim()) errs[`med_${m.id}_duration`] = `Duration required`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) { showToast("Please fix required validation errors before saving"); return; }
    showToast(`Prescription ${prescriptionId} saved successfully!`);
    onSaveSuccess?.();
  };

  const handleIssuePrescription = () => {
    if (!validateForm()) { showToast("Please fix required validation errors before issuing"); return; }
    setStatus("Issued");
    showToast(`Prescription ${prescriptionId} finalized & issued!`);
    onIssueSuccess?.();
  };

  const renderStatusChip = (st: RxStatus) => {
    switch (st) {
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" style={{ fontFamily: PP }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Draft
          </span>
        );
      case "Issued":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" /> Issued
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200" style={{ fontFamily: PP }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" /> Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200" style={{ fontFamily: PP }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> Cancelled
          </span>
        );
      case "Archived":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" style={{ fontFamily: PP }}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Archived
          </span>
        );
    }
  };

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {toastMsg && (
        <div className="fixed bottom-16 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce" style={{ fontFamily: RB }}>
          <CheckCircle2 size={15} className="text-[#66BB6A]" /> {toastMsg}
        </div>
      )}

      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>Prescriptions</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">Edit Prescription</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Edit Prescription</h1>
              {renderStatusChip(status)}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Review and update prescription before saving changes.</p>
          </div>
          <div className="flex items-center gap-2">
            {onBack && (
              <button onClick={onBack} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm" style={{ fontFamily: PP }}>Cancel</button>
            )}
            <button onClick={handleSaveChanges} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#0D47A1] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm" style={{ fontFamily: PP }}><Save size={14} /> Save Changes</button>
            {status === "Draft" && (
              <button onClick={handleIssuePrescription} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009688] hover:bg-[#00827a] text-white text-xs font-semibold transition-all shadow-sm" style={{ fontFamily: PP }}><CheckCircle2 size={14} /> Issue Prescription</button>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Avatar name={patientData.patientName} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{patientData.patientName}</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{patientData.mrn}</span>
                <span className="font-mono text-[10px] bg-emerald-50 text-[#009688] px-2 py-0.5 rounded font-bold">{patientData.prescriptionId}</span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{patientData.consultationId}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                <span>{patientData.age} yrs / {patientData.gender}</span>
                <span>•</span>
                <span>Blood Group: <strong className="text-[#111827]">{patientData.bloodGroup}</strong></span>
                <span>•</span>
                <span>Consultation Date: <strong className="text-[#111827]">{patientData.consultationDate}</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0" style={{ fontFamily: PP }}>
              <AlertTriangle size={13} /> <span>Allergies: {patientData.allergies.join(", ")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onViewPatientProfile?.(patientData.mrn)} className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors" style={{ fontFamily: PP }}>Patient Profile</button>
            <button onClick={() => onViewConsultation?.(patientData.consultationId)} className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors" style={{ fontFamily: PP }}>View Consultation</button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <User size={16} className="text-[#0D47A1]" />
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Patient Summary</h3>
              </div>
              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">{patientData.mrn}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Mobile Number</span>
                  <span className="font-semibold text-slate-700">{patientData.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Attending Doctor</span>
                  <span className="font-semibold text-slate-800">{patientData.doctorName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Department</span>
                  <span className="font-medium text-slate-700">{patientData.department}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Visit Date</span>
                  <span className="font-medium text-slate-700">{patientData.visitDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Blood Group</span>
                  <span className="font-bold text-[#111827]">{patientData.bloodGroup}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Allergies</span>
                  <div className="flex flex-wrap gap-1">
                    {patientData.allergies.map((a) => (
                      <span key={a} className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-semibold" style={{ fontFamily: PP }}>⚠ {a}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Known Conditions</span>
                  <div className="flex flex-wrap gap-1">
                    {patientData.knownConditions.map((c) => (
                      <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium" style={{ fontFamily: RB }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs">01</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Diagnosis Summary (Editable)</h3>
              </div>
              <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Chief Complaint</label>
                  <textarea rows={2} value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Clinical Findings</label>
                  <textarea rows={2} value={clinicalFindings} onChange={(e) => setClinicalFindings(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Final Diagnosis <span className="text-red-500">*</span></label>
                    <input type="text" value={finalDiagnosis} onChange={(e) => { setFinalDiagnosis(e.target.value); if (errors.diagnosis) setErrors((prev) => ({ ...prev, diagnosis: "" })); }} className={`w-full px-3 py-2 border rounded-xl bg-slate-50 outline-none focus:bg-white text-slate-800 ${errors.diagnosis ? "border-red-500" : "border-gray-200 focus:border-[#0D47A1]"}`} />
                    {errors.diagnosis && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.diagnosis}</span>}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>ICD Code</label>
                    <input type="text" value={icdCode} onChange={(e) => setIcdCode(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Clinical Notes</label>
                  <textarea rows={2} value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800" />
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">02</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescribed Medicines ({medicines.length})</h3>
                </div>
                <button onClick={handleAddMedicine} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#009688] hover:bg-[#00827a] text-white text-xs font-semibold transition-colors" style={{ fontFamily: PP }}><Plus size={13} /> + Add Medicine</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: PP }}>
                      <th className="px-3 py-3">Medicine Name *</th>
                      <th className="px-2 py-3 w-20">Strength</th>
                      <th className="px-2 py-3 w-24">Route</th>
                      <th className="px-2 py-3 w-24">Dosage *</th>
                      <th className="px-2 py-3 w-32">Frequency *</th>
                      <th className="px-2 py-3 w-24">Duration *</th>
                      <th className="px-2 py-3 w-20">Qty</th>
                      <th className="px-3 py-3">Instructions</th>
                      <th className="px-2 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-[#111827]" style={{ fontFamily: RB }}>
                    {medicines.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-2">
                          <input type="text" list="medicine-suggestions" value={m.name} onChange={(e) => handleMedicineChange(m.id, "name", e.target.value)} placeholder="Medicine Name" className={`w-full px-2.5 py-1.5 border rounded-lg bg-white outline-none text-xs ${errors[`med_${m.id}_name`] ? "border-red-500" : "border-gray-200 focus:border-[#0D47A1]"}`} />
                        </td>
                        <td className="px-2 py-2">
                          <input type="text" value={m.strength} onChange={(e) => handleMedicineChange(m.id, "strength", e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white outline-none text-xs" />
                        </td>
                        <td className="px-2 py-2">
                          <select value={m.route} onChange={(e) => handleMedicineChange(m.id, "route", e.target.value)} className="w-full px-1.5 py-1.5 border border-gray-200 rounded-lg bg-white outline-none text-xs">
                            {ROUTE_OPTIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input type="text" value={m.dosage} onChange={(e) => handleMedicineChange(m.id, "dosage", e.target.value)} className={`w-full px-2 py-1.5 border rounded-lg bg-white outline-none text-xs ${errors[`med_${m.id}_dosage`] ? "border-red-500" : "border-gray-200 focus:border-[#0D47A1]"}`} />
                        </td>
                        <td className="px-2 py-2">
                          <select value={m.frequency} onChange={(e) => handleMedicineChange(m.id, "frequency", e.target.value)} className={`w-full px-1.5 py-1.5 border rounded-lg bg-white outline-none text-xs ${errors[`med_${m.id}_frequency`] ? "border-red-500" : "border-gray-200 focus:border-[#0D47A1]"}`}>
                            {FREQUENCY_OPTIONS.map((f) => (<option key={f} value={f}>{f}</option>))}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input type="text" value={m.duration} onChange={(e) => handleMedicineChange(m.id, "duration", e.target.value)} className={`w-full px-2 py-1.5 border rounded-lg bg-white outline-none text-xs ${errors[`med_${m.id}_duration`] ? "border-red-500" : "border-gray-200 focus:border-[#0D47A1]"}`} />
                        </td>
                        <td className="px-2 py-2">
                          <input type="text" value={m.quantity} onChange={(e) => handleMedicineChange(m.id, "quantity", e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white outline-none text-xs font-mono" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={m.instructions} onChange={(e) => handleMedicineChange(m.id, "instructions", e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white outline-none text-xs" />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleDuplicateMedicine(m)} className="p-1 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded" title="Duplicate Row"><Copy size={13} /></button>
                            <button onClick={() => handleDeleteMedicine(m.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded" title="Delete Row"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <datalist id="medicine-suggestions">
                {COMMON_MEDICINES.map((med) => (<option key={med} value={med} />))}
              </datalist>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">03</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>General Advice (Editable)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Diet Advice</label>
                  <textarea rows={2} value={dietAdvice} onChange={(e) => setDietAdvice(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Lifestyle Advice</label>
                  <textarea rows={2} value={lifestyleAdvice} onChange={(e) => setLifestyleAdvice(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Exercise Advice</label>
                  <textarea rows={2} value={exerciseAdvice} onChange={(e) => setExerciseAdvice(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Special Instructions</label>
                  <textarea rows={2} value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-amber-50/50 outline-none focus:border-amber-500 focus:bg-white text-amber-900" />
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">04</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Follow-up Details (Editable)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-3" style={{ fontFamily: RB }}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Follow-up Required</label>
                  <select value={followupRequired} onChange={(e) => setFollowupRequired(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Next Visit Date</label>
                  <input type="date" value={nextVisitDate} onChange={(e) => setNextVisitDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800 font-medium" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Follow-up Notes</label>
                <textarea rows={2} value={followupNotes} onChange={(e) => setFollowupNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800" />
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">05</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Revision Information</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Prescription ID</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{revisionInfo.prescriptionId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Created By</span>
                  <span className="font-semibold text-slate-700">{revisionInfo.createdBy}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Created Date</span>
                  <span className="text-slate-600">{revisionInfo.createdDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Revision Number</span>
                  <span className="font-bold text-[#0D47A1]">v{revisionInfo.revisionNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Last Modified By</span>
                  <span className="font-semibold text-slate-700">{revisionInfo.lastModifiedBy}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Last Modified Date</span>
                  <span className="text-slate-600">{revisionInfo.lastModifiedDate}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Current Status</span>
                  <div>{renderStatusChip(status)}</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Quick Actions</h4>
              <div className="space-y-2">
                <button onClick={handleSaveChanges} className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors" style={{ fontFamily: PP }}>
                  <span className="flex items-center gap-2"><Save size={14} /> Save Changes</span><ChevronRight size={13} />
                </button>
                {status === "Draft" && (
                  <button onClick={handleIssuePrescription} className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold transition-colors" style={{ fontFamily: PP }}>
                    <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Issue Prescription</span><ChevronRight size={13} />
                  </button>
                )}
                <button onClick={() => setPrintModalOpen(true)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors" style={{ fontFamily: RB }}>
                  <span className="flex items-center gap-2"><Printer size={14} /> Print Preview</span><ChevronRight size={13} />
                </button>
                <button onClick={() => showToast(`Downloaded PDF for ${prescriptionId}`)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors" style={{ fontFamily: RB }}>
                  <span className="flex items-center gap-2"><Download size={14} /> Download PDF</span><ChevronRight size={13} />
                </button>
                <button onClick={() => onViewConsultation?.(patientData.consultationId)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors" style={{ fontFamily: RB }}>
                  <span className="flex items-center gap-2"><FileText size={14} /> View Consultation</span><ChevronRight size={13} />
                </button>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Prescription Summary</h4>
              <div className="space-y-2.5 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-semibold text-slate-800">{patientData.doctorName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Department</span>
                  <span className="font-medium text-slate-700">{patientData.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Medicines</span>
                  <span className="font-bold text-[#009688]">{medicines.length} Medicines</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Follow-up Date</span>
                  <span className="font-bold text-[#111827]">{nextVisitDate}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Current Status</span>
                  <div>{renderStatusChip(status)}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Revision Timeline</h4>
              <div className="space-y-3">
                {[
                  { title: "Prescription Created", time: "08:30 AM", date: "24 Jul 2026" },
                  { title: "Medicine Updated", time: "10:15 AM", date: "24 Jul 2026" },
                  { title: "Advice Modified", time: "10:45 AM", date: "24 Jul 2026" },
                  { title: "Follow-up Updated", time: "11:00 AM", date: "24 Jul 2026" },
                  { title: "Prescription Saved", time: "11:15 AM", date: "24 Jul 2026" },
                  { title: "Prescription Issued", time: "Pending Issue", date: "Today", isPending: status === "Draft" },
                ].map((ev, i, arr) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${ev.isPending ? "bg-amber-400" : "bg-[#009688]"}`} />
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#111827]" style={{ fontFamily: PP }}>{ev.title}</div>
                      <div className="text-[10px] text-slate-400" style={{ fontFamily: RB }}>{ev.date} · {ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] px-6 py-3 shadow-lg flex items-center justify-between">
        <div>
          {onBack && (
            <button onClick={onBack} className="px-4 py-2 rounded-xl border border-gray-300 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors" style={{ fontFamily: RB }}>Cancel</button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSaveChanges} className="px-5 py-2 rounded-xl border border-[#0D47A1] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5" style={{ fontFamily: PP }}><Save size={14} /> Save Changes</button>
          {status === "Draft" && (
            <button onClick={handleIssuePrescription} className="px-5 py-2 rounded-xl bg-[#009688] hover:bg-[#00827a] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5" style={{ fontFamily: PP }}><CheckCircle2 size={14} /> Issue Prescription</button>
          )}
        </div>
      </div>

      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-[#0D47A1]" />
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Print Prescription Preview</h3>
              </div>
              <button onClick={() => setPrintModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 mb-5 text-xs text-slate-700 space-y-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-[#0D47A1]">HMS Hospital & Research Center</span>
                <span className="font-mono text-slate-500">{prescriptionId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Patient:</strong> {patientData.patientName}</div>
                <div><strong>MRN:</strong> {patientData.mrn}</div>
                <div><strong>Doctor:</strong> {patientData.doctorName}</div>
                <div><strong>Date:</strong> {patientData.consultationDate}</div>
              </div>
              <div><strong>Diagnosis:</strong> {finalDiagnosis}</div>
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold mb-1">Medicines ({medicines.length}):</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {medicines.map((m) => (<li key={m.id}>{m.name} {m.strength} — {m.frequency} ({m.instructions})</li>))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPrintModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl" style={{ fontFamily: RB }}>Cancel</button>
              <button onClick={() => { setPrintModalOpen(false); showToast(`Prescription ${prescriptionId} sent to printer`); }} className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]" style={{ fontFamily: PP }}>Print Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
