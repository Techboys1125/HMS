import { useState, useMemo, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { usePermissions } from "../../../permissions/usePermissions";
import { useConsultation } from "../hooks/useConsultation";
import { useEncounter } from "../hooks/useEncounter";
import { useVitals } from "../hooks/useVitals";
import { useDiagnosis } from "../hooks/useDiagnosis";
import { useInvoice } from "../../billing/hooks/useBilling";
import type { ConsultationFormData, MedicineItem } from "../types/consultation";
import { encountersApi } from "../../encounters/api/encounters.api";
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
import { EncounterPrescriptionViewModal } from "../../prescriptions/components/EncounterPrescriptionViewModal";
import { ConsultationDetailsScreen } from "../components/ConsultationDetailsScreen";
import { useNavigate, useParams } from "react-router";
import { appointmentsApi } from "../../appointments/api/appointments.api";
import { consultationService } from "../services/consultationService";

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

export function StartConsultationPage({
  patientId,
  onBack,
  onCompleteSuccess,
  onViewHistory,
  onViewPatientProfile,
}: {
  patientId?: string;
  onBack?: () => void;
  onCompleteSuccess?: () => void;
  onViewHistory?: (patientId?: string) => void;
  onViewPatientProfile?: (mrn?: string) => void;
}) {
  const navigate = useNavigate();
  const { consultationId: urlConsultationId } = useParams<{
    consultationId?: string;
  }>();
  const activeConsultationId =
    urlConsultationId ||
    patientId ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("hms-active-consultation-id")
      : null) ||
    undefined;

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

  const [restoredPatientData, setRestoredPatientData] = useState<{
    patientName?: string;
    mrn?: string;
    age?: number;
    gender?: string;
    phone?: string;
    bloodGroup?: string;
    allergies?: string[];
    doctor?: string;
    opdRoom?: string;
    visitType?: string;
    appointmentTime?: string;
  } | null>(null);
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
    if (!activeConsultationId) return;

    try {
      sessionStorage.setItem(
        "hms-active-consultation-id",
        String(activeConsultationId),
      );
    } catch {
      // ignore
    }

    const matchApptId = String(
      selectedAppointment?.id || selectedAppointment?.appointmentId || "",
    );
    const matchCnsId = String(
      selectedConsultation?.id || selectedConsultation?.appointmentId || "",
    );
    const targetIdStr = String(activeConsultationId);

    if (
      (matchApptId && matchApptId === targetIdStr) ||
      (matchCnsId && matchCnsId === targetIdStr)
    ) {
      return;
    }

    let isMounted = true;

    const loadContext = async () => {
      try {
        const res = await consultationService
          .loadFullConsultationDetails(activeConsultationId)
          .catch(() => null);
        if (!isMounted) return;

        if (res && res.consultation) {
          const c = res.consultation as Record<string, unknown>;
          const pName = String(c.patientName || "");
          const pMrn = String(c.mrn || "");
          if (pName || pMrn) {
            setRestoredPatientData({
              patientName: pName,
              mrn: pMrn,
              age: Number(c.age || 0),
              gender: String(c.gender || ""),
              phone: String(c.phone || ""),
              bloodGroup: String(c.bloodGroup || ""),
              allergies: Array.isArray(c.allergies)
                ? (c.allergies as string[])
                : [],
              doctor: String(c.doctor || c.doctorName || ""),
              opdRoom: String(c.opdRoom || ""),
              visitType: String(c.visitType || "New Consultation"),
              appointmentTime: String(c.appointmentTime || ""),
            });

            setFormData((prev) => ({
              ...prev,
              doctorName: String(c.doctor || c.doctorName || prev.doctorName),
              department: String(c.department || prev.department),
              chiefComplaint: String(c.chiefComplaint || prev.chiefComplaint),
              visitType:
                (c.visitType as "New Consultation" | "Follow-up") ||
                prev.visitType,
            }));
            return;
          }
        }

        let numericId: number | undefined;
        if (typeof activeConsultationId === "number") {
          numericId = activeConsultationId;
        } else if (typeof activeConsultationId === "string") {
          const clean = activeConsultationId
            .replace(/^BL-|^APP-|^ENC-/, "")
            .replace(/[^0-9]/g, "");
          if (clean) numericId = parseInt(clean, 10);
        }

        const idToTry = numericId || activeConsultationId;
        const apptRes = await appointmentsApi
          .getAppointmentById(idToTry)
          .catch(() => null);

        if (!isMounted) return;

        if (apptRes?.data) {
          const appt = apptRes.data;
          const patientObj = (appt.patient || {}) as Record<string, unknown>;
          const deptName =
            appt.departmentName ||
            (typeof appt.department === "string"
              ? appt.department
              : appt.department?.name || appt.department?.departmentName) ||
            "";

          setRestoredPatientData({
            patientName: appt.patientName || (patientObj.name as string) || "",
            mrn:
              appt.mrn || appt.patientMrn || (patientObj.mrn as string) || "",
            age: Number(appt.patientAge || appt.age || patientObj.age || 0),
            gender: String(
              appt.patientGender || appt.gender || patientObj.gender || "",
            ),
            phone: String(
              appt.patientPhone || appt.mobile || patientObj.phone || "",
            ),
            bloodGroup: String(patientObj.bloodGroup || ""),
            allergies: Array.isArray(patientObj.allergies)
              ? (patientObj.allergies as string[])
              : [],
            doctor: appt.doctorName || "",
            opdRoom: String(appt.opdRoom || ""),
            visitType: (appt.appointmentType ||
              appt.visitType ||
              "New Consultation") as string,
            appointmentTime: appt.appointmentTime || "",
          });

          setFormData((prev) => ({
            ...prev,
            doctorName: appt.doctorName || prev.doctorName,
            department: deptName || prev.department,
            chiefComplaint: appt.chiefComplaint || prev.chiefComplaint,
            visitType:
              appt.appointmentType === "Follow-up"
                ? "Follow-up"
                : "New Consultation",
          }));
        }
      } catch (err) {
        console.warn("Failed to load consultation context:", err);
      }
    };

    void loadContext();

    return () => {
      isMounted = false;
    };
  }, [activeConsultationId, selectedAppointment, selectedConsultation]);

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

  const handleCloseCompleteModal = () => {
    setShowCompleteModal(false);
    if (onCompleteSuccess) {
      onCompleteSuccess();
    } else if (onBack) {
      onBack();
    } else {
      navigate("/consultation", { replace: true });
    }
  };

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
          selectedAppointment?.doctorId ||
          (selectedConsultation as { doctorId?: string | number })?.doctorId;
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
        encounterId:
          activeEncounterId ||
          selectedConsultation?.encounterId ||
          selectedConsultation?.id ||
          "N/A",
        appointmentId: activeAppointmentId || selectedConsultation?.id || 0,
        patientName,
        mrn: patientMrn,
        age: patientAge ?? 0,
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

  const patientName =
    selectedAppointment?.patientName ||
    selectedConsultation?.patientName ||
    restoredPatientData?.patientName ||
    "";
  const patientMrn =
    selectedAppointment?.mrn ||
    selectedConsultation?.mrn ||
    restoredPatientData?.mrn ||
    "";
  const patientAge =
    selectedAppointment?.patientAge ||
    selectedAppointment?.patient?.age ||
    selectedConsultation?.age ||
    restoredPatientData?.age ||
    0;
  const patientGender =
    selectedAppointment?.patientGender ||
    selectedAppointment?.patient?.gender ||
    selectedConsultation?.gender ||
    restoredPatientData?.gender ||
    "";
  const patientPhone =
    selectedAppointment?.patientPhone ||
    selectedAppointment?.patient?.phone ||
    selectedAppointment?.patient?.mobile ||
    selectedConsultation?.phone ||
    restoredPatientData?.phone ||
    "";
  const patientBloodGroup =
    selectedConsultation?.bloodGroup ||
    (selectedAppointment?.patient as { bloodGroup?: string })?.bloodGroup ||
    restoredPatientData?.bloodGroup ||
    "";
  const patientAllergies =
    selectedConsultation?.allergies ||
    (selectedAppointment?.patient as { allergies?: string[] })?.allergies ||
    restoredPatientData?.allergies ||
    [];
  const primaryDoctorName =
    formData.doctorName ||
    selectedAppointment?.doctorName ||
    selectedConsultation?.doctor ||
    restoredPatientData?.doctor ||
    "";
  const opdRoomNumber =
    selectedAppointment?.opdRoom ||
    selectedConsultation?.opdRoom ||
    restoredPatientData?.opdRoom ||
    "";
  const appointmentTimeStr =
    selectedAppointment?.appointmentTime ||
    selectedConsultation?.appointmentTime ||
    restoredPatientData?.appointmentTime ||
    "";

  if (showCompleteModal && finalizedData) {
    return (
      <ConsultationDetailsScreen
        encounterId={finalizedData.encounterId}
        initialRecord={{
          id: `ENC-${finalizedData.encounterId}`,
          visitDate: finalizedData.date,
          completionTime: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          patientName: finalizedData.patientName,
          mrn: finalizedData.mrn,
          age: finalizedData.age,
          gender: finalizedData.gender,
          doctorName: finalizedData.doctor,
          department: finalizedData.department,
          visitType: finalizedData.visitType,
          chiefComplaint: finalizedData.chiefComplaint || "None recorded",
          vitals: {
            height: finalizedData.vitals?.height || "—",
            weight: finalizedData.vitals?.weight || "—",
            bmi: finalizedData.vitals?.bmi || "—",
            temperature: finalizedData.vitals?.temp || "—",
            bp: finalizedData.vitals?.bp || "—",
            pulse: finalizedData.vitals?.pulse || "—",
            respiratoryRate: finalizedData.vitals?.respiratoryRate || "—",
            spo2: finalizedData.vitals?.spo2 || "—",
            bloodSugar: finalizedData.vitals?.bloodSugar || "—",
          },
          clinicalExamination: finalizedData.clinicalExamination || "—",
          provisionalDiagnosis: formData.provisionalDiagnosis || "Recorded",
          finalDiagnosis: finalizedData.finalDiagnosis || "Recorded",
          icdCode: finalizedData.icdCode || "—",
          medicines: (finalizedData.medicines || []).map((m, idx) => ({
            id: String(m.id || idx + 1),
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            instructions: m.instructions || "After food",
          })),
          investigations: formData.customInvestigation
            ? [formData.customInvestigation]
            : [],
          investigationRemarks: formData.investigationRemarks || "—",
          symptoms: formData.symptoms || "—",
          assessment: formData.assessment || "—",
          advice: finalizedData.advice || "Follow doctor advice",
          lifestyleRecommendations: finalizedData.dietAdvice || "—",
          followupRequired: formData.followupRequired ? "Yes" : "No",
          nextVisitDate: finalizedData.nextVisitDate || "—",
          followupNotes: finalizedData.followupNotes || "—",
          status: "Completed",
          tokenNo: selectedAppointment?.tokenNumber
            ? `TK-${selectedAppointment.tokenNumber}`
            : "TK-01",
        }}
        onBack={handleCloseCompleteModal}
        onViewHistory={onViewHistory}
        onViewPatientProfile={onViewPatientProfile}
      />
    );
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {showToast && (
        <div
          className="fixed top-5 right-5 z-50 bg-[#66BB6A] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-opacity fade-in slide-in-from-top-4"
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
          className="fixed top-5 right-5 z-50 bg-red-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-opacity fade-in slide-in-from-top-4"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-colors shadow-sm"
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
          bloodGroup={patientBloodGroup}
          allergies={patientAllergies}
          phone={patientPhone}
          primaryDoctor={primaryDoctorName}
          opdRoom={opdRoomNumber}
          visitType={formData.visitType}
          appointmentTime={appointmentTimeStr}
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
