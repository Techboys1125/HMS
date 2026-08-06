import { useState, useMemo, useEffect } from "react";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { usePermissions } from "../../../permissions";
import { useConsultation } from "../hooks/useConsultation";
import { useEncounter } from "../hooks/useEncounter";
import { useVitals } from "../hooks/useVitals";
import { useDiagnosis } from "../hooks/useDiagnosis";
import type { ConsultationFormData, MedicineItem } from "../types/consultation";
import { encountersApi } from "../../encounters";
import { ConsultationHeader } from "../components/ConsultationHeader";
import { PatientSummaryCard } from "../components/PatientSummaryCard";
import { VitalsCard } from "../components/VitalsCard";
import { ConsultationForm } from "../components/ConsultationForm";
import { DiagnosisForm } from "../components/DiagnosisForm";
import { MedicineTable } from "../components/MedicineTable";
import { InvestigationTable } from "../components/InvestigationTable";
import { FollowupForm } from "../components/FollowupForm";
import { ConsultationFooter } from "../components/ConsultationFooter";
import { useNavigate } from "react-router";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

const emptyFormData: ConsultationFormData = {
  visitDate: "",
  doctorName: "",
  department: "",
  visitType: "New Consultation",
  chiefComplaint: "",
  durationOfSymptoms: "",
  height: "",
  weight: "",
  temperature: "",
  bp: "",
  pulse: "",
  respiratoryRate: "",
  spo2: "",
  bloodSugar: "",
  clinicalExamination: "",
  provisionalDiagnosis: "",
  finalDiagnosis: "",
  icdCode: "",
  medicines: [],
  investigations: { cbc: false, ecg: false, xray: false, ultrasound: false, other: false },
  customInvestigation: "",
  investigationRemarks: "",
  symptoms: "",
  assessment: "",
  advice: "",
  lifestyleRecommendations: "",
  followupRequired: false,
  nextVisitDate: "",
  followupNotes: "",
};

export function StartConsultationPage({
  onBack,
  onCompleteSuccess,
  onViewHistory,
}: {
  patientId?: string;
  onBack?: () => void;
  onCompleteSuccess?: () => void;
  onViewHistory?: (patientId?: string) => void;
  onViewPatientProfile?: (mrn?: string) => void;
}) {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { selectedAppointment, selectedConsultation } = useConsultation();
  const { selectedEncounter, selectedPrescription, finalizeConsultation } = useEncounter();

  const activeEncounterId = selectedEncounter?.encounterId;
  const activeAppointmentId = selectedAppointment?.id;
  const activePrescriptionId = selectedPrescription?.id || selectedPrescription?.prescriptionId;

  const { loadVitals, saveVitals } = useVitals(activeEncounterId);
  const { addDiagnosis } = useDiagnosis(activeEncounterId);

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    visitInfo: false,
    vitals: false,
    examination: false,
    prescription: false,
    investigation: false,
    clinicalNotes: false,
    followup: false,
    summary: false,
  });

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [formData, setFormData] = useState<ConsultationFormData>({ ...emptyFormData });

  useEffect(() => {
    let active = true;

    const todayStr = new Date().toISOString().split("T")[0];
    const nextVisitStr = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

    const dept = selectedAppointment?.departmentName ||
      (typeof selectedAppointment?.department === "string"
        ? selectedAppointment.department
        : selectedAppointment?.department?.name ||
          selectedAppointment?.department?.departmentName) || "";

    setFormData((prev) => ({
      ...prev,
      visitDate: todayStr,
      nextVisitDate: nextVisitStr,
      doctorName: selectedAppointment?.doctorName || "",
      department: dept,
      visitType: selectedAppointment?.visitType === "Follow-up" ? "Follow-up" : "New Consultation",
      chiefComplaint: selectedAppointment?.chiefComplaint || selectedConsultation?.chiefComplaint || "",
    }));

    if (activeEncounterId) {
      loadVitals().then((data) => {
        if (active && data) {
          const toStr = (v: unknown) => (v != null ? String(v) : "");
          setFormData((prev) => ({
            ...prev,
            height: data.height ? toStr(data.height).replace(" cm", "") : prev.height,
            weight: data.weight ? toStr(data.weight).replace(" kg", "") : prev.weight,
            temperature: data.temp ? toStr(data.temp).replace(" °C", "").replace("°C", "") : prev.temperature,
            bp: data.bp ? toStr(data.bp).replace(" mmHg", "") : prev.bp,
            pulse: data.pulse ? toStr(data.pulse).replace(" bpm", "") : prev.pulse,
            respiratoryRate: data.respiratoryRate ? toStr(data.respiratoryRate).replace(" /min", "") : prev.respiratoryRate,
            spo2: data.spo2 ? toStr(data.spo2).replace(" %", "").replace("%", "") : prev.spo2,
            bloodSugar: data.bloodSugar ? toStr(data.bloodSugar).replace(" mg/dL", "") : prev.bloodSugar,
          }));
        }
      });
    }

    return () => { active = false; };
  }, [selectedAppointment, selectedConsultation, activeEncounterId, loadVitals]);

  const calculatedBmi = useMemo(() => {
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return "--";
  }, [formData.height, formData.weight]);

  const [showToast, setShowToast] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const handleAddMedicine = () => {
    const newMed: MedicineItem = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "Once Daily",
      duration: "7 Days",
      instructions: "",
    };
    setFormData((prev) => ({ ...prev, medicines: [...prev.medicines, newMed] }));
  };

  const handleUpdateMedicine = (id: string, field: keyof MedicineItem, val: string) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m) => (m.id === id ? { ...m, [field]: val } : m)),
    }));
  };

  const handleRemoveMedicine = (id: string) => {
    setFormData((prev) => ({ ...prev, medicines: prev.medicines.filter((m) => m.id !== id) }));
  };

  const handleFieldChange = (field: string, val: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleVitalsChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const saveMedications = async (prescriptionId: string | number, medicines: MedicineItem[]) => {
    const validMeds = medicines.filter((m) => m.name.trim() !== "");
    if (validMeds.length === 0) return;
    await Promise.all(
      validMeds.map((med) =>
        encountersApi
          .addMedication(prescriptionId, {
            source: "FREE_TEXT",
            medicineName: med.name,
            doseValue: parseInt(med.dosage) || 500,
            doseUnit: "MG",
            frequencyCode: med.frequency || "1-0-1",
            durationValue: parseInt(med.duration) || 7,
            durationUnit: "DAYS",
            route: "ORAL",
            instructions: med.instructions || "After food",
          })
          .catch(() => null)
      )
    );
  };

  const handleSaveDraft = async () => {
    setIsDraftSaved(true);
    try {
      if (activeEncounterId) {
        await saveVitals({
          height: formData.height ? formData.height + " cm" : undefined,
          weight: formData.weight ? formData.weight + " kg" : undefined,
          temp: formData.temperature ? formData.temperature + "°C" : undefined,
          bp: formData.bp || undefined,
          pulse: formData.pulse ? formData.pulse + " bpm" : undefined,
          spo2: formData.spo2 ? formData.spo2 + "%" : undefined,
          respiratoryRate: formData.respiratoryRate || undefined,
          bloodSugar: formData.bloodSugar || undefined,
        });
      }
      if (activePrescriptionId) {
        await saveMedications(activePrescriptionId, formData.medicines);
      }
    } catch {
      // non-blocking
    } finally {
      setTimeout(() => setIsDraftSaved(false), 2500);
    }
  };

  const handleFinalize = async () => {
    const errors: string[] = [];
    if (!formData.chiefComplaint.trim()) errors.push("Chief Complaint is required.");
    if (!formData.finalDiagnosis.trim()) errors.push("Final Diagnosis is required.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationErrors([]);
    setShowToast(true);

    try {
      if (can("DIAGNOSIS_CREATE") && formData.icdCode) {
        await addDiagnosis(formData.icdCode, formData.finalDiagnosis);
      }
      if (activePrescriptionId) {
        await saveMedications(activePrescriptionId, formData.medicines);
      }
      if (can("CONSULTATION_FINALIZE") && activeEncounterId && activeAppointmentId) {
        await finalizeConsultation(activeEncounterId, activeAppointmentId, {
          generalAdvice: formData.advice,
          dietAdvice: formData.lifestyleRecommendations || "",
          precautions: formData.followupNotes || "",
        });
      }
      setTimeout(() => {
        setShowToast(false);
        if (onCompleteSuccess) onCompleteSuccess();
        else if (onBack) onBack();
        else navigate("/opd-consultation", { replace: true });
      }, 2000);
    } catch {
      setShowToast(false);
    }
  };

  const patientName = selectedAppointment?.patientName || "";
  const patientMrn = selectedAppointment?.mrn || "";
  const patientAge = selectedAppointment?.patientAge || selectedAppointment?.patient?.age;
  const patientGender = selectedAppointment?.patientGender || selectedAppointment?.patient?.gender || "";
  const patientPhone = selectedAppointment?.patientPhone || selectedAppointment?.patient?.phone || selectedAppointment?.patient?.mobile || "";

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#66BB6A] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4" style={{ fontFamily: PP }}>
          <CheckCircle2 size={20} />
          <div>
            <div className="font-bold text-sm">Consultation completed successfully.</div>
            <div className="text-xs text-white/95">Encounter records saved & finalized.</div>
          </div>
        </div>
      )}

      <ConsultationHeader
        roleLabel="Doctor"
        pageTitle="Start Outpatient Consultation"
        subtitle="Record symptoms, evaluate vitals, diagnosis, prescribe medicines and finalize session."
        breadcrumbs={[{ label: "Workspace", active: true }]}
        actions={
          onBack && (
            <button onClick={onBack} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm" style={{ fontFamily: PP }}>
              Back
            </button>
          )
        }
      />

      <div className="p-6 space-y-6 flex-1">
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-700">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: PP }}>Please correct the following errors before finalization:</div>
              <ul className="list-disc pl-5 mt-1.5 text-xs space-y-1" style={{ fontFamily: RB }}>
                {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          </div>
        )}

        <PatientSummaryCard
          patientName={patientName}
          mrn={patientMrn}
          age={patientAge || 0}
          gender={patientGender}
          bloodGroup=""
          allergies={[]}
          phone={patientPhone}
          primaryDoctor={formData.doctorName}
          opdRoom=""
          visitType={formData.visitType}
          appointmentTime={selectedAppointment?.appointmentTime || ""}
          extraDetails={
            onViewHistory && patientMrn ? (
              <button type="button" onClick={() => onViewHistory(patientMrn)} className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-bold rounded-xl border border-blue-100 transition-colors" style={{ fontFamily: PP }}>
                View History
              </button>
            ) : undefined
          }
        />

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <button onClick={() => toggleSection("vitals")} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="font-bold text-sm text-slate-800" style={{ fontFamily: PP }}>Vitals Recording</span>
              </div>
              <ChevronDown className={`text-slate-400 transition-transform ${collapsedSections.vitals ? "-rotate-90" : ""}`} size={18} />
            </button>
            {!collapsedSections.vitals && (
              <VitalsCard isEditable values={{ height: formData.height, weight: formData.weight, bp: formData.bp, pulse: formData.pulse, temp: formData.temperature, spo2: formData.spo2, respiratoryRate: formData.respiratoryRate, bloodSugar: formData.bloodSugar, bmi: calculatedBmi }} onChange={handleVitalsChange} />
            )}
          </div>

          <div className="space-y-3">
            <button onClick={() => toggleSection("clinicalNotes")} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span className="font-bold text-sm text-slate-800" style={{ fontFamily: PP }}>Clinical Symptoms & SOAP</span>
              </div>
              <ChevronDown className={`text-slate-400 transition-transform ${collapsedSections.clinicalNotes ? "-rotate-90" : ""}`} size={18} />
            </button>
            {!collapsedSections.clinicalNotes && (
              <ConsultationForm values={{ chiefComplaint: formData.chiefComplaint, durationOfSymptoms: formData.durationOfSymptoms, clinicalExamination: formData.clinicalExamination, symptoms: formData.symptoms, assessment: formData.assessment, advice: formData.advice, lifestyleRecommendations: formData.lifestyleRecommendations }} onChange={handleFieldChange} />
            )}
          </div>

          <div className="space-y-3">
            <button onClick={() => toggleSection("examination")} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span className="font-bold text-sm text-slate-800" style={{ fontFamily: PP }}>Diagnoses & ICD Codes</span>
              </div>
              <ChevronDown className={`text-slate-400 transition-transform ${collapsedSections.examination ? "-rotate-90" : ""}`} size={18} />
            </button>
            {!collapsedSections.examination && (
              <DiagnosisForm provisionalDiagnosis={formData.provisionalDiagnosis} finalDiagnosis={formData.finalDiagnosis} icdCode={formData.icdCode} onChange={handleFieldChange} />
            )}
          </div>

          <div className="space-y-3">
            <button onClick={() => toggleSection("prescription")} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="font-bold text-sm text-slate-800" style={{ fontFamily: PP }}>SOAP Prescriptions</span>
              </div>
              <ChevronDown className={`text-slate-400 transition-transform ${collapsedSections.prescription ? "-rotate-90" : ""}`} size={18} />
            </button>
            {!collapsedSections.prescription && (
              <MedicineTable medicines={formData.medicines} onAdd={handleAddMedicine} onUpdate={handleUpdateMedicine} onRemove={handleRemoveMedicine} />
            )}
          </div>

          <div className="space-y-3">
            <button onClick={() => toggleSection("investigation")} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-bold text-sm text-slate-800" style={{ fontFamily: PP }}>Investigations Recommendations</span>
              </div>
              <ChevronDown className={`text-slate-400 transition-transform ${collapsedSections.investigation ? "-rotate-90" : ""}`} size={18} />
            </button>
            {!collapsedSections.investigation && (
              <InvestigationTable values={formData.investigations} customInvestigation={formData.customInvestigation} remarks={formData.investigationRemarks} onChange={handleFieldChange} />
            )}
          </div>

          <div className="space-y-3">
            <button onClick={() => toggleSection("followup")} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-bold text-sm text-slate-800" style={{ fontFamily: PP }}>Follow-up Scheduling</span>
              </div>
              <ChevronDown className={`text-slate-400 transition-transform ${collapsedSections.followup ? "-rotate-90" : ""}`} size={18} />
            </button>
            {!collapsedSections.followup && (
              <FollowupForm required={formData.followupRequired} nextVisitDate={formData.nextVisitDate} notes={formData.followupNotes} onChange={handleFieldChange} />
            )}
          </div>
        </div>
      </div>

      <ConsultationFooter onCancel={onBack || (() => {})} onSaveDraft={handleSaveDraft} onFinalize={handleFinalize} isSavingDraft={isDraftSaved} />
    </div>
  );
}

export default StartConsultationPage;
