import { useState, useMemo, useEffect, useRef } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Printer,
  X,
  FileText,
  Pill,
  User,
  Stethoscope,
  Calendar,
  Info,
} from "lucide-react";
import { usePermissions } from "../../../permissions";
import { useConsultation } from "../hooks/useConsultation";
import { useEncounter } from "../hooks/useEncounter";
import { useVitals } from "../hooks/useVitals";
import { useDiagnosis } from "../hooks/useDiagnosis";
import { useInvoice } from "../../billing/hooks/useBilling";
import type { ConsultationFormData, MedicineItem } from "../types/consultation";
import { encountersApi, type Prescription } from "../../encounters";
import { consultationApi } from "../api/consultationApi";
import { ConsultationHeader } from "../components/ConsultationHeader";
import { PatientSummaryCard } from "../components/PatientSummaryCard";
import { VitalsCard } from "../components/VitalsCard";
import { ConsultationForm } from "../components/ConsultationForm";
import { DiagnosisForm } from "../components/DiagnosisForm";
import { MedicineTable } from "../components/MedicineTable";
import { InvestigationTable } from "../components/InvestigationTable";
import { FollowupForm } from "../components/FollowupForm";
import { ConsultationFooter } from "../components/ConsultationFooter";
import { EncounterPrescriptionViewModal } from "../../prescriptions";
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
  investigations: {
    cbc: false,
    ecg: false,
    xray: false,
    ultrasound: false,
    other: false,
  },
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

const TODAY_STR = new Date().toISOString().split("T")[0];
const NEXT_VISIT_STR = new Date(Date.now() + 7 * 86400000)
  .toISOString()
  .split("T")[0];

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
  const { selectedEncounter, selectedPrescription, finalizeConsultation } =
    useEncounter();

  const { createBill } = useInvoice();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const activeEncounterId =
    selectedEncounter?.encounterId || selectedConsultation?.encounterId;
  const activeAppointmentId =
    selectedAppointment?.id || selectedConsultation?.id;
  const activePrescriptionId = selectedPrescription?.id;

  const { loadVitals, saveVitals } = useVitals(activeEncounterId);
  const { addDiagnosis } = useDiagnosis(activeEncounterId);

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

  const todayStr = TODAY_STR;
  const nextVisitStr = NEXT_VISIT_STR;

  const dept =
    selectedAppointment?.departmentName ||
    (typeof selectedAppointment?.department === "string"
      ? selectedAppointment.department
      : selectedAppointment?.department?.name ||
        selectedAppointment?.department?.departmentName) ||
    "";

  const [formData, setFormData] = useState<ConsultationFormData>({
    ...emptyFormData,
    visitDate: todayStr,
    nextVisitDate: nextVisitStr,
    doctorName: selectedAppointment?.doctorName || "",
    department: dept,
    visitType:
      selectedAppointment?.visitType === "Follow-up"
        ? "Follow-up"
        : "New Consultation",
    chiefComplaint:
      selectedAppointment?.chiefComplaint ||
      selectedConsultation?.chiefComplaint ||
      "",
  });

  useEffect(() => {
    if (!activeEncounterId) return;

    let active = true;

    loadVitals().then((data) => {
      if (active && data) {
        const toStr = (v: unknown) => (v != null ? String(v) : "");
        setFormData((prev) => ({
          ...prev,
          height: data.height
            ? toStr(data.height).replace(" cm", "")
            : prev.height,
          weight: data.weight
            ? toStr(data.weight).replace(" kg", "")
            : prev.weight,
          temperature: data.temp
            ? toStr(data.temp).replace(" °C", "").replace("°C", "")
            : prev.temperature,
          bp: data.bp ? toStr(data.bp).replace(" mmHg", "") : prev.bp,
          pulse: data.pulse
            ? toStr(data.pulse).replace(" bpm", "")
            : prev.pulse,
          respiratoryRate: data.respiratoryRate
            ? toStr(data.respiratoryRate).replace(" /min", "")
            : prev.respiratoryRate,
          spo2: data.spo2
            ? toStr(data.spo2).replace(" %", "").replace("%", "")
            : prev.spo2,
          bloodSugar: data.bloodSugar
            ? toStr(data.bloodSugar).replace(" mg/dL", "")
            : prev.bloodSugar,
        }));
      }
    });

    return () => {
      active = false;
    };
  }, [activeEncounterId, loadVitals]);

  const calculatedBmi = useMemo(() => {
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return "--";
  }, [formData.height, formData.weight]);

  const [showToast, setShowToast] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const createdBillIdRef = useRef<string | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<Prescription | null>(
    null,
  );
  const [isLoadingPrescription, setIsLoadingPrescription] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState<string | null>(
    null,
  );
  const [finalizedData, setFinalizedData] = useState<{
    date: string;
    patientName: string;
    mrn: string;
    age: number | string;
    gender: string;
    phone: string;
    encounterId: string | number;
    appointmentId?: string | number;
    doctor: string;
    department: string;
    visitType: string;
    vitals: {
      height: string;
      weight: string;
      bp: string;
      pulse: string;
      temp: string;
      spo2: string;
      respiratoryRate?: string;
      bloodSugar?: string;
      bmi: string;
    };
    chiefComplaint: string;
    clinicalExamination?: string;
    finalDiagnosis: string;
    icdCode?: string;
    medicines: MedicineItem[];
    advice?: string;
    dietAdvice?: string;
    nextVisitDate?: string;
    followupNotes?: string;
  } | null>(null);

  const [viewPrescriptionEncounterId, setViewPrescriptionEncounterId] =
    useState<string | number | null>(null);

  const handleAddMedicine = () => {
    const newMed: MedicineItem = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "Once Daily",
      duration: "7 Days",
      instructions: "",
    };
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, newMed],
    }));
  };

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

  const handleRemoveMedicine = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((m) => m.id !== id),
    }));
  };

  const handleViewPrescription = () => {
    const encId =
      finalizedData?.encounterId ||
      activeEncounterId ||
      selectedConsultation?.encounterId ||
      selectedConsultation?.id;
    if (encId) {
      setViewPrescriptionEncounterId(encId);
    }
  };

  const handleFieldChange = (field: string, val: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleVitalsChange = (field: string, val: string) => {
    const fieldMap: Record<string, string> = {
      temp: "temperature",
    };
    const actualField = fieldMap[field] || field;
    setFormData((prev) => ({ ...prev, [actualField]: val }));
  };

  const saveMedications = async (
    prescriptionId: string | number,
    medicines: MedicineItem[],
  ) => {
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
          .catch(() => null),
      ),
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
      if (selectedConsultation?.id) {
        await consultationApi.saveClinicalNotes(selectedConsultation.id, {
          subjective: formData.symptoms || formData.chiefComplaint,
          objective: formData.clinicalExamination,
          assessment: formData.assessment,
          plan: formData.advice,
        });
      }
    } catch {
      // non-blocking
    } finally {
      setTimeout(() => setIsDraftSaved(false), 2500);
    }
  };

  const handleFinalize = async () => {
    if (isFinalizing) return;
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
    setIsFinalizing(true);
    setShowToast(true);

    try {
      if (can("DIAGNOSIS_CREATE") && activeEncounterId) {
        try {
          await addDiagnosis(
            formData.icdCode || "R69",
            formData.finalDiagnosis ||
              "Documented clinical conclusion/assessment",
            activeEncounterId,
          );
        } catch (diagErr) {
          console.warn("Non-blocking diagnosis save warning:", diagErr);
          triggerToast("Warning: Diagnosis could not be saved. Please retry.");
        }
      }
      if (activePrescriptionId) {
        try {
          await saveMedications(activePrescriptionId, formData.medicines);
        } catch (medErr) {
          console.warn("Non-blocking medication save warning:", medErr);
          triggerToast(
            "Warning: Prescription could not be saved. Please retry.",
          );
        }
      }
      if (selectedConsultation?.id) {
        try {
          await consultationApi.saveClinicalNotes(selectedConsultation.id, {
            subjective: formData.symptoms || formData.chiefComplaint,
            objective: formData.clinicalExamination,
            assessment: formData.assessment,
            plan: formData.advice,
          });
        } catch (notesErr) {
          console.warn("Non-blocking clinical notes warning:", notesErr);
        }
      }
      if (can("CONSULTATION_FINALIZE")) {
        const encId =
          activeEncounterId ||
          selectedConsultation?.encounterId ||
          selectedConsultation?.id ||
          "";
        const aptId = activeAppointmentId || selectedConsultation?.id || 0;
        await finalizeConsultation(encId, aptId, {
          generalAdvice: formData.advice,
          dietAdvice: formData.lifestyleRecommendations || "",
          precautions: formData.followupNotes || "",
        });

        const patientMrn =
          selectedAppointment?.mrn || selectedConsultation?.mrn || "";
        const doctorId =
          selectedAppointment?.doctorId || selectedConsultation?.doctorId;
        if (encId && aptId && patientMrn && doctorId) {
          try {
            const bill = await createBill({
              appointmentId: Number(aptId),
              encounterId: Number(encId),
              patientMrn,
              doctorId: Number(doctorId),
            });
            createdBillIdRef.current = String(bill.billId);
          } catch (billErr) {
            console.warn("Auto bill creation warning:", billErr);
          }
        }
      }

      setFinalizedData({
        encounterId: activeEncounterId,
        appointmentId: activeAppointmentId,
        patientName,
        mrn: patientMrn,
        age: patientAge,
        gender: patientGender,
        phone: patientPhone,
        doctor: formData.doctorName,
        department: formData.department,
        visitType: formData.visitType,
        date: formData.visitDate,
        vitals: {
          height: formData.height,
          weight: formData.weight,
          temp: formData.temperature,
          bp: formData.bp,
          pulse: formData.pulse,
          spo2: formData.spo2,
          respiratoryRate: formData.respiratoryRate,
          bloodSugar: formData.bloodSugar,
          bmi: calculatedBmi,
        },
        chiefComplaint: formData.chiefComplaint,
        clinicalExamination: formData.clinicalExamination,
        finalDiagnosis: formData.finalDiagnosis,
        icdCode: formData.icdCode,
        medicines: formData.medicines,
        advice: formData.advice,
        dietAdvice: formData.lifestyleRecommendations,
        followupNotes: formData.followupNotes,
        nextVisitDate: formData.nextVisitDate,
      });

      setShowToast(false);
      setShowCompleteModal(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to finalize consultation";
      console.error("Error finalizing consultation:", err);
      triggerToast(errorMessage);
      setShowToast(false);
      setIsFinalizing(false);
    }
  };

  const patientName = selectedAppointment?.patientName || "";
  const patientMrn = selectedAppointment?.mrn || "";
  const patientAge =
    selectedAppointment?.patientAge || selectedAppointment?.patient?.age;
  const patientGender =
    selectedAppointment?.patientGender ||
    selectedAppointment?.patient?.gender ||
    "";
  const patientPhone =
    selectedAppointment?.patientPhone ||
    selectedAppointment?.patient?.phone ||
    selectedAppointment?.patient?.mobile ||
    "";

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
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
      {toastMsg && !showToast && (
        <div
          className="fixed top-5 right-5 z-50 bg-red-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4"
          style={{ fontFamily: PP }}
        >
          <AlertCircle size={20} />
          <div className="font-bold text-sm">{toastMsg}</div>
        </div>
      )}

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
                {validationErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
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
              <button
                type="button"
                onClick={() => onViewHistory(patientMrn)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-bold rounded-xl border border-blue-100 transition-colors"
                style={{ fontFamily: PP }}
              >
                View History
              </button>
            ) : undefined
          }
        />

        <div className="grid grid-cols-1 gap-6">
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

      <ConsultationFooter
        onCancel={onBack || (() => {})}
        onSaveDraft={handleSaveDraft}
        onFinalize={handleFinalize}
        isSavingDraft={isDraftSaved}
        isFinalizing={isFinalizing}
      />

      {/* Render ConsultationCompleteModal if showCompleteModal is true */}
      {showCompleteModal && finalizedData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto flex justify-center items-start p-4 py-8">
          {/* Modal Container */}
          <div
            id="printable-consultation-modal"
            className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl border border-slate-100 flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-200 my-auto"
          >
            {/* Stylesheet for printing */}
            <style>{`
              @media print {
                body {
                  background: white !important;
                  color: black !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                body > :not(#printable-consultation-modal) {
                  display: none !important;
                }
                #printable-consultation-modal {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  box-shadow: none !important;
                  border: none !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .no-print {
                  display: none !important;
                }
                .print-page-break {
                  page-break-inside: avoid;
                }
              }
            `}</style>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-2xl text-emerald-600">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-slate-800"
                    style={{ fontFamily: PP }}
                  >
                    Consultation Finalized
                  </h2>
                  <p className="text-xs text-slate-500">
                    The encounter has been completed and saved successfully.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  if (onCompleteSuccess) onCompleteSuccess();
                  else if (onBack) onBack();
                  else {
                    if (createdBillIdRef.current) {
                      navigate(
                        `/billing/create?billId=${createdBillIdRef.current}`,
                        { replace: true },
                      );
                    } else {
                      const aptId =
                        activeAppointmentId || selectedConsultation?.id || "";
                      const encId =
                        activeEncounterId ||
                        selectedConsultation?.encounterId ||
                        "";
                      const patientId =
                        selectedAppointment?.patientId ||
                        selectedConsultation?.patientId ||
                        "";
                      const patientMrn =
                        selectedAppointment?.mrn ||
                        selectedConsultation?.mrn ||
                        "";
                      const doctorId =
                        selectedAppointment?.doctorId ||
                        selectedConsultation?.doctorId ||
                        "";
                      const query = new URLSearchParams();
                      if (createdBillIdRef.current) {
                        navigate(
                          `/billing/create?billId=${createdBillIdRef.current}`,
                          { replace: true },
                        );
                      } else {
                        if (aptId) query.set("appointmentId", String(aptId));
                        if (encId) query.set("encounterId", String(encId));
                        if (patientId)
                          query.set("patientId", String(patientId));
                        if (patientMrn)
                          query.set("patientMrn", String(patientMrn));
                        if (doctorId) query.set("doctorId", String(doctorId));
                        navigate(`/billing/create?${query.toString()}`, {
                          replace: true,
                        });
                      }
                    }
                  }
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Printable Content Wrapper */}
            <div className="space-y-6 flex-1">
              {/* Receipt Header for Print */}
              <div className="hidden print:flex items-center justify-between border-b-2 border-[#0D47A1] pb-4 mb-4">
                <div>
                  <h1
                    className="text-2xl font-black text-[#0D47A1] tracking-tight uppercase"
                    style={{ fontFamily: PP }}
                  >
                    METROPOLITAN HEALTH HOSPITAL
                  </h1>
                  <p className="text-xs text-slate-500">
                    123 Healthcare Boulevard, Medical District
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-base font-bold text-slate-800">
                    OPD VISIT SUMMARY
                  </h2>
                  <p className="text-xs text-slate-500">
                    Date: {finalizedData.date}
                  </p>
                </div>
              </div>

              {/* Patient & Encounter Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Details */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Name:</span>
                    <span className="font-bold text-slate-800">
                      {finalizedData.patientName}
                    </span>
                    <span className="text-slate-500">MRN:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {finalizedData.mrn}
                    </span>
                    <span className="text-slate-500">Age / Gender:</span>
                    <span className="font-bold text-slate-800">
                      {finalizedData.age} Years / {finalizedData.gender}
                    </span>
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-bold text-slate-800">
                      {finalizedData.phone}
                    </span>
                  </div>
                </div>

                {/* Encounter Details */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Encounter Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Encounter ID:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ENC-{finalizedData.encounterId}
                    </span>
                    <span className="text-slate-500">Doctor Name:</span>
                    <span className="font-bold text-slate-800">
                      {finalizedData.doctor}
                    </span>
                    <span className="text-slate-500">Department:</span>
                    <span className="font-bold text-slate-800">
                      {finalizedData.department}
                    </span>
                    <span className="text-slate-500">Visit Type:</span>
                    <span className="font-bold text-slate-800">
                      {finalizedData.visitType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-page-break">
                <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Symptoms & SOAP Notes
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">
                        Chief Complaint:
                      </span>
                      <span className="text-slate-600 block bg-slate-50 p-2 rounded-lg mt-1">
                        {finalizedData.chiefComplaint || "None"}
                      </span>
                    </div>
                    {finalizedData.clinicalExamination && (
                      <div>
                        <span className="font-bold text-slate-700 block">
                          Clinical Examination:
                        </span>
                        <span className="text-slate-600 block bg-slate-50 p-2 rounded-lg mt-1">
                          {finalizedData.clinicalExamination}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Diagnosis
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">
                        Final Diagnosis:
                      </span>
                      <span className="text-slate-600 block bg-slate-50 p-2 rounded-lg mt-1 font-semibold">
                        {finalizedData.finalDiagnosis}
                      </span>
                    </div>
                    {finalizedData.icdCode && (
                      <div>
                        <span className="font-bold text-slate-700 block">
                          ICD-10 Code:
                        </span>
                        <span className="font-mono text-[#0D47A1] block bg-blue-50 p-2 rounded-lg mt-1">
                          {finalizedData.icdCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Prescribed Medications */}
              {finalizedData.medicines &&
                finalizedData.medicines.length > 0 && (
                  <div className="border border-slate-100 rounded-2xl p-5 space-y-3 print-page-break">
                    <h3
                      className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Prescribed Medications (Rx)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-medium">
                            <th className="py-2 pr-4 font-bold text-slate-500">
                              Medicine
                            </th>
                            <th className="py-2 px-4 font-bold text-slate-500">
                              Dosage
                            </th>
                            <th className="py-2 px-4 font-bold text-slate-500">
                              Frequency
                            </th>
                            <th className="py-2 px-4 font-bold text-slate-500">
                              Duration
                            </th>
                            <th className="py-2 pl-4 font-bold text-slate-500">
                              Instructions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {finalizedData.medicines.map((med: MedicineItem) => (
                            <tr
                              key={med.id || med.name}
                              className="text-slate-700"
                            >
                              <td className="py-2.5 pr-4 font-bold text-slate-800">
                                {med.name}
                              </td>
                              <td className="py-2.5 px-4">{med.dosage}</td>
                              <td className="py-2.5 px-4">{med.frequency}</td>
                              <td className="py-2.5 px-4">{med.duration}</td>
                              <td className="py-2.5 pl-4 text-slate-500 italic">
                                {med.instructions || "After food"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Advice and follow up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-page-break">
                <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    General & Diet Advice
                  </h3>
                  <div className="space-y-2 text-xs">
                    {finalizedData.advice && (
                      <div>
                        <span className="font-bold text-slate-700 block">
                          General Advice:
                        </span>
                        <span className="text-slate-600 block mt-1">
                          {finalizedData.advice}
                        </span>
                      </div>
                    )}
                    {finalizedData.dietAdvice && (
                      <div>
                        <span className="font-bold text-slate-700 block">
                          Diet & Lifestyle:
                        </span>
                        <span className="text-slate-600 block mt-1">
                          {finalizedData.dietAdvice}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <h3
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Follow-up Instructions
                  </h3>
                  <div className="space-y-2 text-xs">
                    {finalizedData.nextVisitDate && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100/50">
                        <span className="font-bold text-amber-800 block">
                          Next Recommended Visit:
                        </span>
                        <span className="text-amber-700 block font-semibold mt-1">
                          {finalizedData.nextVisitDate}
                        </span>
                      </div>
                    )}
                    {finalizedData.followupNotes && (
                      <div>
                        <span className="font-bold text-slate-700 block">
                          Precautions:
                        </span>
                        <span className="text-slate-600 block mt-1">
                          {finalizedData.followupNotes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Signature Line for Print */}
              <div className="hidden print:block pt-16 border-t border-slate-100 text-right">
                <div className="inline-block border-t border-slate-400 pt-2 w-48 text-center">
                  <p className="text-xs font-bold text-slate-800">
                    {finalizedData.doctor}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Authorized Signature
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 no-print">
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  if (onCompleteSuccess) onCompleteSuccess();
                  else if (onBack) onBack();
                  else {
                    if (createdBillIdRef.current) {
                      navigate(
                        `/billing/create?billId=${createdBillIdRef.current}`,
                        { replace: true },
                      );
                    } else {
                      const aptId =
                        activeAppointmentId || selectedConsultation?.id || "";
                      const encId =
                        activeEncounterId ||
                        selectedConsultation?.encounterId ||
                        "";
                      const patientId =
                        selectedAppointment?.patientId ||
                        selectedConsultation?.patientId ||
                        "";
                      const patientMrn =
                        selectedAppointment?.mrn ||
                        selectedConsultation?.mrn ||
                        "";
                      const doctorId =
                        selectedAppointment?.doctorId ||
                        selectedConsultation?.doctorId ||
                        "";
                      const query = new URLSearchParams();
                      if (aptId) query.set("appointmentId", String(aptId));
                      if (encId) query.set("encounterId", String(encId));
                      if (patientId) query.set("patientId", String(patientId));
                      if (patientMrn)
                        query.set("patientMrn", String(patientMrn));
                      if (doctorId) query.set("doctorId", String(doctorId));
                      navigate(`/billing/create?${query.toString()}`, {
                        replace: true,
                      });
                    }
                  }
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleViewPrescription}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#009688] hover:bg-[#00796B] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  style={{ fontFamily: PP }}
                >
                  <FileText size={14} />
                  View Prescription
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  style={{ fontFamily: PP }}
                >
                  <Printer size={14} />
                  Print Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      <EncounterPrescriptionViewModal
        encounterId={viewPrescriptionEncounterId}
        isOpen={Boolean(viewPrescriptionEncounterId)}
        onClose={() => setViewPrescriptionEncounterId(null)}
      />
    </div>
  );
}

export default StartConsultationPage;
