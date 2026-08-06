import { useState, useMemo, useEffect } from "react";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { usePermissions } from "../../../permissions";
import { useConsultation } from "../hooks/useConsultation";
import { useEncounter } from "../hooks/useEncounter";
import { useVitals } from "../hooks/useVitals";
import { useDiagnosis } from "../hooks/useDiagnosis";
import type { ConsultationFormData, MedicineItem } from "../types/consultation";
import { ConsultationHeader } from "../components/ConsultationHeader";
import { PatientSummaryCard } from "../components/PatientSummaryCard";
import { VitalsCard } from "../components/VitalsCard";
import { ConsultationForm } from "../components/ConsultationForm";
import { DiagnosisForm } from "../components/DiagnosisForm";
import { MedicineTable } from "../components/MedicineTable";
import { InvestigationTable } from "../components/InvestigationTable";
import { FollowupForm } from "../components/FollowupForm";
import { ConsultationFooter } from "../components/ConsultationFooter";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

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
  const { can } = usePermissions();
  const { selectedAppointment, selectedConsultation } = useConsultation();
  const { selectedEncounter, finalizeConsultation } = useEncounter();

  // Encounter ID logic
  const activeEncounterId = selectedEncounter?.encounterId || "ENC-1001";
  const activeAppointmentId = selectedAppointment?.id || "APT-1001";

  // Vitals hook
  const { loadVitals, saveVitals } = useVitals(activeEncounterId);
  const { addDiagnosis } = useDiagnosis(activeEncounterId);

  // Collapsible section card states
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
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

  // Form Data State
  const [formData, setFormData] = useState<ConsultationFormData>({
    visitDate: "",
    doctorName: selectedAppointment?.doctor || "Dr. Arjun Mehta",
    department: selectedAppointment?.department || "Cardiology",
    visitType: selectedAppointment?.visitType === "Follow-up"
      ? "Follow-up"
      : "New Consultation",
    chiefComplaint:
      selectedAppointment?.chiefComplaint ||
      selectedConsultation?.chiefComplaint ||
      "Severe chest tightness radiating to left shoulder with acute dyspnea",
    durationOfSymptoms: "3 days",
    // Vitals
    height: "168",
    weight: "72",
    temperature: "37.2",
    bp: "145/92",
    pulse: "88",
    respiratoryRate: "18",
    spo2: "97",
    bloodSugar: "110",
    // Examination
    clinicalExamination:
      "Chest wall non-tender. S1 S2 heard normal. No gallop or murmurs. Bilateral vesicular breath sounds.",
    provisionalDiagnosis: "Acute Coronary Syndrome / Angina Pectoris",
    finalDiagnosis: "Angina Pectoris, unspecified",
    icdCode: "I20.9",
    medicines: [
      {
        id: "1",
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "Once Daily",
        duration: "30 Days",
        instructions: "Take after breakfast",
      },
      {
        id: "2",
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice Daily",
        duration: "30 Days",
        instructions: "Take with meals",
      },
    ],
    investigations: {
      cbc: true,
      ecg: true,
      xray: false,
      ultrasound: false,
      other: false,
    },
    customInvestigation: "2D Echocardiogram & Trop-I STAT",
    investigationRemarks:
      "Perform 12-lead ECG immediately and check Troponin-I level.",
    symptoms:
      "Substernal chest pressure, exertional shortness of breath, mild diaphoresis.",
    assessment:
      "High cardiovascular risk profile. Borderline hypertension and elevated BP.",
    advice:
      "Strict low sodium diet. Avoid strenuous activity. Continue cardiac medications as prescribed.",
    lifestyleRecommendations:
      "Daily 30 min light walking after 1 week. Smoking cessation & stress management.",
    followupRequired: true,
    nextVisitDate: "",
    followupNotes:
      "Review ECG & Troponin reports. Adjust anti-hypertensive dosage if required.",
  });

  // Load and sync vitals values, and initialize dynamic dates in a side effect on component mount
  useEffect(() => {
    let active = true;

    // Set today's date and next follow-up date dynamically inside a microtask
    Promise.resolve().then(() => {
      if (!active) return;
      const todayStr = new Date().toISOString().split("T")[0];
      const nextVisitStr = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        visitDate: todayStr,
        nextVisitDate: nextVisitStr,
      }));
    });

    loadVitals().then((data) => {
      if (active && data) {
        setFormData((prev) => ({
          ...prev,
          height: data.height ? data.height.replace(" cm", "") : prev.height,
          weight: data.weight ? data.weight.replace(" kg", "") : prev.weight,
          temperature: data.temp
            ? data.temp.replace(" °C", "").replace("°C", "")
            : prev.temperature,
          bp: data.bp ? data.bp.replace(" mmHg", "") : prev.bp,
          pulse: data.pulse ? data.pulse.replace(" bpm", "") : prev.pulse,
          respiratoryRate: data.respiratoryRate
            ? data.respiratoryRate.replace(" /min", "")
            : prev.respiratoryRate,
          spo2: data.spo2
            ? data.spo2.replace(" %", "").replace("%", "")
            : prev.spo2,
          bloodSugar: data.bloodSugar
            ? data.bloodSugar.replace(" mg/dL", "")
            : prev.bloodSugar,
        }));
      }
    });

    return () => {
      active = false;
    };
  }, [loadVitals]);

  // Auto-calculated BMI
  const calculatedBmi = useMemo(() => {
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return "--";
  }, [formData.height, formData.weight]);

  // UI States
  const [showToast, setShowToast] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // Add Medicine Row
  const handleAddMedicine = () => {
    const newMed: MedicineItem = {
      id: Date.now().toString(),
      name: "",
      dosage: "5mg",
      frequency: "Once Daily",
      duration: "7 Days",
      instructions: "After Meals",
    };
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, newMed],
    }));
  };

  // Update Medicine Row
  const handleUpdateMedicine = (
    id: string,
    field: keyof MedicineItem,
    val: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m) =>
        m.id === id ? { ...m, [field]: val } : m,
      ),
    }));
  };

  // Remove Medicine Row
  const handleRemoveMedicine = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((m) => m.id !== id),
    }));
  };

  const handleFieldChange = <K extends keyof ConsultationFormData>(
    field: K,
    val: ConsultationFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleVitalsChange = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  // Save Draft Action
  const handleSaveDraft = async () => {
    setIsDraftSaved(true);
    try {
      // Record vitals and draft diagnosis in backend
      await saveVitals({
        height: formData.height + " cm",
        weight: formData.weight + " kg",
        temp: formData.temperature + "°C",
        bp: formData.bp,
        pulse: formData.pulse + " bpm",
        spo2: formData.spo2 + "%",
        respiratoryRate: formData.respiratoryRate,
        bloodSugar: formData.bloodSugar,
      });
      setTimeout(() => setIsDraftSaved(false), 2500);
    } catch {
      setTimeout(() => setIsDraftSaved(false), 2500);
    }
  };

  // Finalize & Complete Consultation flow
  const handleFinalize = async () => {
    const errors: string[] = [];
    if (!formData.chiefComplaint.trim())
      errors.push("Chief Complaint is required.");
    if (!formData.finalDiagnosis.trim())
      errors.push("Final Diagnosis is required.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationErrors([]);
    setShowToast(true);

    try {
      // 1. Submit diagnosis to backend
      if (can("DIAGNOSIS_CREATE") && formData.icdCode) {
        await addDiagnosis(formData.icdCode, formData.finalDiagnosis);
      }

      // 2. Finalize encounter & Complete appointment in backend
      if (can("CONSULTATION_FINALIZE")) {
        await finalizeConsultation(activeEncounterId, activeAppointmentId);
      }

      setTimeout(() => {
        setShowToast(false);
        if (onCompleteSuccess) onCompleteSuccess();
        else if (onBack) onBack();
      }, 2000);
    } catch (err) {
      console.error("Failed to complete finalization:", err);
      setShowToast(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {/* SUCCESS TOAST */}
      {showToast && (
        <div
          className="fixed top-5 right-5 z-50 bg-[#66BB6A] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4"
          style={{ fontFamily: PP }}
        >
          <CheckCircle2 size={20} />
          <div>
            <div className="font-bold text-sm">
              Consultation completed successfully.
            </div>
            <div className="text-xs text-white/95">
              Encounter records saved & finalized.
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <ConsultationHeader
        roleLabel="Doctor"
        pageTitle="Start Outpatient Consultation"
        subtitle="Record symptoms, evaluate vitals, diagnosis, prescribe medicines and finalize session."
        breadcrumbs={[{ label: "Workspace", active: true }]}
        actions={
          onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              Back
            </button>
          )
        }
      />

      <div className="p-6 space-y-6 flex-1">
        {/* VALIDATION ERRORS */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-700">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: PP }}>
                Please correct the following errors before finalization:
              </div>
              <ul
                className="list-disc pl-5 mt-1.5 text-xs space-y-1"
                style={{ fontFamily: RB }}
              >
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* PATIENT SUMMARY CARD */}
        <PatientSummaryCard
          patientName={selectedAppointment?.patientName || "Sarah Mitchell"}
          mrn={selectedAppointment?.mrn || "MRN-2024-001"}
          age={selectedAppointment?.age || 34}
          gender={selectedAppointment?.gender || "Female"}
          bloodGroup="A+"
          allergies={["Penicillin", "Aspirin"]}
          phone={selectedAppointment?.phone || "+1 (555) 234-5678"}
          primaryDoctor="Dr. Arjun Mehta"
          opdRoom="OPD Room 104"
          visitType={formData.visitType}
          appointmentTime={selectedAppointment?.appointmentTime || "09:00 AM"}
          extraDetails={
            onViewHistory && (
              <button
                type="button"
                onClick={() => onViewHistory(selectedAppointment?.mrn)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-bold rounded-xl border border-blue-100 transition-colors"
                style={{ fontFamily: PP }}
              >
                View History
              </button>
            )
          }
        />

        {/* ── COLLAPSIBLE clinical SECTIONS ── */}
        <div className="grid grid-cols-1 gap-6">
          {/* SECTION 1: Patient Vitals */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("vitals")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span
                  className="font-bold text-sm text-slate-800"
                  style={{ fontFamily: PP }}
                >
                  Vitals Recording
                </span>
              </div>
              <ChevronDown
                className={`text-slate-400 transition-transform ${collapsedSections.vitals ? "-rotate-90" : ""}`}
                size={18}
              />
            </button>

            {!collapsedSections.vitals && (
              <VitalsCard
                isEditable
                values={{
                  height: formData.height,
                  weight: formData.weight,
                  bp: formData.bp,
                  pulse: formData.pulse,
                  temp: formData.temperature,
                  spo2: formData.spo2,
                  respiratoryRate: formData.respiratoryRate,
                  bloodSugar: formData.bloodSugar,
                  bmi: calculatedBmi,
                }}
                onChange={handleVitalsChange}
              />
            )}
          </div>

          {/* SECTION 2: Chief Complaint & Symptoms */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("clinicalNotes")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span
                  className="font-bold text-sm text-slate-800"
                  style={{ fontFamily: PP }}
                >
                  Clinical Symptoms & SOAP
                </span>
              </div>
              <ChevronDown
                className={`text-slate-400 transition-transform ${collapsedSections.clinicalNotes ? "-rotate-90" : ""}`}
                size={18}
              />
            </button>

            {!collapsedSections.clinicalNotes && (
              <ConsultationForm
                values={{
                  chiefComplaint: formData.chiefComplaint,
                  durationOfSymptoms: formData.durationOfSymptoms,
                  clinicalExamination: formData.clinicalExamination,
                  symptoms: formData.symptoms,
                  assessment: formData.assessment,
                  advice: formData.advice,
                  lifestyleRecommendations: formData.lifestyleRecommendations,
                }}
                onChange={handleFieldChange}
              />
            )}
          </div>

          {/* SECTION 3: Diagnosis Form */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("examination")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span
                  className="font-bold text-sm text-slate-800"
                  style={{ fontFamily: PP }}
                >
                  Diagnoses & ICD Codes
                </span>
              </div>
              <ChevronDown
                className={`text-slate-400 transition-transform ${collapsedSections.examination ? "-rotate-90" : ""}`}
                size={18}
              />
            </button>

            {!collapsedSections.examination && (
              <DiagnosisForm
                provisionalDiagnosis={formData.provisionalDiagnosis}
                finalDiagnosis={formData.finalDiagnosis}
                icdCode={formData.icdCode}
                onChange={handleFieldChange}
              />
            )}
          </div>

          {/* SECTION 4: Prescriptions Table */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("prescription")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span
                  className="font-bold text-sm text-slate-800"
                  style={{ fontFamily: PP }}
                >
                  SOAP Prescriptions
                </span>
              </div>
              <ChevronDown
                className={`text-slate-400 transition-transform ${collapsedSections.prescription ? "-rotate-90" : ""}`}
                size={18}
              />
            </button>

            {!collapsedSections.prescription && (
              <MedicineTable
                medicines={formData.medicines}
                onAdd={handleAddMedicine}
                onUpdate={handleUpdateMedicine}
                onRemove={handleRemoveMedicine}
              />
            )}
          </div>

          {/* SECTION 5: Investigations */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("investigation")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span
                  className="font-bold text-sm text-slate-800"
                  style={{ fontFamily: PP }}
                >
                  Investigations Recommendations
                </span>
              </div>
              <ChevronDown
                className={`text-slate-400 transition-transform ${collapsedSections.investigation ? "-rotate-90" : ""}`}
                size={18}
              />
            </button>

            {!collapsedSections.investigation && (
              <InvestigationTable
                values={formData.investigations}
                customInvestigation={formData.customInvestigation}
                remarks={formData.investigationRemarks}
                onChange={handleFieldChange}
              />
            )}
          </div>

          {/* SECTION 6: Followup Form */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("followup")}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span
                  className="font-bold text-sm text-slate-800"
                  style={{ fontFamily: PP }}
                >
                  Follow-up Scheduling
                </span>
              </div>
              <ChevronDown
                className={`text-slate-400 transition-transform ${collapsedSections.followup ? "-rotate-90" : ""}`}
                size={18}
              />
            </button>

            {!collapsedSections.followup && (
              <FollowupForm
                required={formData.followupRequired}
                nextVisitDate={formData.nextVisitDate}
                notes={formData.followupNotes}
                onChange={handleFieldChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <ConsultationFooter
        onCancel={onBack || (() => {})}
        onSaveDraft={handleSaveDraft}
        onFinalize={handleFinalize}
        isSavingDraft={isDraftSaved}
      />
    </div>
  );
}

export default StartConsultationPage;
