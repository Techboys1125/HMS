import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Printer,
  Download,
  Edit3,
  Loader2,
} from "lucide-react";
import { encountersApi } from "../../encounters/api/encounters.api";
import { consultationApi } from "../api/consultationApi";
import { patientsApi } from "../../patients/api/patient.api";
import { doctorsApi } from "../../doctors/api/doctors.api";
import { vitalsApi } from "../../vitals/api/vitals.api";
import { downloadConsultationPdf } from "../../../utils/consultationPdf.utils";

// --- Design System Tokens ---
const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export interface ConsultationRecordData {
  id: string;
  appointmentId?: string | number;
  createdDate?: string;
  completedDate?: string;
  duration?: string;
  visitDate: string;
  completionTime: string;
  patientName: string;
  mrn: string;
  age: number | string;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  doctorName: string;
  doctorSpecialty: string;
  department: string;
  visitType: string;
  chiefComplaint: string;
  durationOfSymptoms: string;
  vitals: {
    height: string;
    weight: string;
    bmi: string;
    temperature: string;
    bp: string;
    pulse: string;
    respiratoryRate: string;
    spo2: string;
    bloodSugar: string;
  };
  clinicalExamination: string;
  provisionalDiagnosis: string;
  finalDiagnosis: string;
  icdCode: string;
  medicines: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  investigations: string[];
  investigationRemarks: string;
  symptoms: string;
  assessment: string;
  advice: string;
  lifestyleRecommendations: string;
  followupRequired: string;
  nextVisitDate: string;
  followupNotes: string;
  consultationFee: string;
  status: string;
  tokenNo: string;
}

interface ConsultationDetailsScreenProps {
  consultationId?: string;
  encounterId?: string | number;
  initialRecord?: Partial<ConsultationRecordData>;
  onBack?: () => void;
  onEditConsultation?: (id: string) => void;
  onViewHistory?: (patientId?: string) => void;
  onViewPatientProfile?: (mrn: string) => void;
}

const unwrapApiData = (response: unknown): any => {
  if (!response) return null;
  const obj = response as Record<string, unknown>;
  return obj.data ?? response;
};

const asRecord = (value: unknown): Record<string, any> => {
  return value && typeof value === "object"
    ? (value as Record<string, any>)
    : {};
};

const asArray = (value: unknown): any[] => {
  return Array.isArray(value) ? value : [];
};

const formatVitalValue = (val: unknown, unit: string) => {
  if (!val || val === "—" || val === "N/A" || val === "") return "—";
  const str = String(val).trim();
  if (!str || str === "—") return "—";
  if (str.toLowerCase().includes(unit.toLowerCase())) return str;
  return `${str} ${unit}`;
};

const formatDateTime = (value?: string | null) => {
  if (!value || value === "—") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const handlePrint = () => {
  window.print();
};

export function ConsultationDetailsScreen({
  consultationId,
  encounterId,
  initialRecord,
  onBack,
  onEditConsultation,
  onViewHistory,
  onViewPatientProfile,
}: ConsultationDetailsScreenProps) {
  const [loading, setLoading] = useState<boolean>(!initialRecord);
  const [record, setRecord] = useState<ConsultationRecordData>(() => {
    return {
      id: consultationId || String(encounterId || ""),
      appointmentId: initialRecord?.appointmentId || "",
      createdDate: initialRecord?.createdDate || "",
      completedDate: initialRecord?.completedDate || "",
      duration: initialRecord?.duration || "",
      status: initialRecord?.status || "Completed",
      tokenNo: initialRecord?.tokenNo || "",
      visitDate:
        initialRecord?.visitDate ||
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      completionTime:
        initialRecord?.completionTime || "",
      patientName: initialRecord?.patientName || "",
      mrn: initialRecord?.mrn || "",
      age: initialRecord?.age || "—",
      gender: initialRecord?.gender || "—",
      bloodGroup: initialRecord?.bloodGroup || "—",
      allergies: initialRecord?.allergies || [],
      doctorName: initialRecord?.doctorName || "",
      doctorSpecialty: initialRecord?.doctorSpecialty || "",
      department: initialRecord?.department || "",
      visitType: initialRecord?.visitType || "First Visit",
      chiefComplaint: initialRecord?.chiefComplaint || "",
      durationOfSymptoms: initialRecord?.durationOfSymptoms || "—",
      vitals: {
        height: formatVitalValue(initialRecord?.vitals?.height, "cm"),
        weight: formatVitalValue(initialRecord?.vitals?.weight, "kg"),
        bmi: formatVitalValue(initialRecord?.vitals?.bmi, "kg/m²"),
        temperature: formatVitalValue(initialRecord?.vitals?.temperature, "°C"),
        bp: formatVitalValue(initialRecord?.vitals?.bp, "mmHg"),
        pulse: formatVitalValue(initialRecord?.vitals?.pulse, "bpm"),
        respiratoryRate: formatVitalValue(
          initialRecord?.vitals?.respiratoryRate,
          "/min",
        ),
        spo2: formatVitalValue(initialRecord?.vitals?.spo2, "%"),
        bloodSugar: formatVitalValue(
          initialRecord?.vitals?.bloodSugar,
          "mg/dL",
        ),
      },
      clinicalExamination: initialRecord?.clinicalExamination || "",
      provisionalDiagnosis: initialRecord?.provisionalDiagnosis || "",
      finalDiagnosis: initialRecord?.finalDiagnosis || "",
      icdCode: initialRecord?.icdCode || "",
      medicines: initialRecord?.medicines || [],
      investigations: initialRecord?.investigations || [],
      investigationRemarks: initialRecord?.investigationRemarks || "",
      symptoms: initialRecord?.symptoms || "",
      assessment: initialRecord?.assessment || "",
      advice: initialRecord?.advice || "",
      lifestyleRecommendations: initialRecord?.lifestyleRecommendations || "",
      followupRequired: initialRecord?.followupRequired || "",
      nextVisitDate: initialRecord?.nextVisitDate || "",
      followupNotes: initialRecord?.followupNotes || "",
      consultationFee: initialRecord?.consultationFee || "",
    };
  });

  // Collapsible sections state
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

  // Fetch real API data if encounterId or consultationId is provided
  // Fetch real API data if encounterId or consultationId is provided
  // Fetch real API data if encounterId or consultationId is provided
  useEffect(() => {
    let isMounted = true;
    const targetEncId = encounterId || consultationId;
    if (!targetEncId) return;

    async function loadRealEncounterData() {
      try {
        setLoading(true);
        const encIdNum = Number(targetEncId) || 0;
        if (encIdNum <= 0) return;

        // 1. Load workspace context (patient, appointment, vitals, consultation notes, diagnoses)
        const workspaceResponse = await consultationApi.getWorkspace(encIdNum).catch(() => null);
        const workspaceData = asRecord(unwrapApiData(workspaceResponse));
        if (!workspaceData || Object.keys(workspaceData).length === 0) {
          console.warn(`Workspace not found for encounter ${encIdNum}`);
          return;
        }

        console.log("CONSULTATION WORKSPACE:", workspaceData);
        console.log("WORKSPACE VITALS:", workspaceData?.vitals);

        const encSub = asRecord(workspaceData.encounter);
        const apptSub = asRecord(workspaceData.appointment);
        const patSub = asRecord(workspaceData.patient);
        const docSub = asRecord(workspaceData.doctor);

        const realEncounterId = Number(encSub.encounterId || encSub.id || encIdNum);
        const realAppointmentId = Number(apptSub.id || apptSub.appointmentId || encSub.appointmentId || 0);

        // 2. Fetch Consultation / Clinical Notes
        let consultationData = asRecord(workspaceData.consultation);
        if (!consultationData.id && realEncounterId > 0) {
          try {
            const consultationRes = await consultationApi.getConsultation(realEncounterId).catch(() => null);
            if (consultationRes) {
              consultationData = asRecord(unwrapApiData(consultationRes));
            }
          } catch (e) {
            console.warn("Could not fetch consultation notes:", e);
          }
        }

        // 3. Fetch Diagnoses
        let diagnosesData = asArray(workspaceData.diagnoses);
        if (realEncounterId > 0) {
          try {
            const diagnosisRes = await encountersApi.getDiagnoses(realEncounterId).catch(() => null);
            const diagList = unwrapApiData(diagnosisRes);
            if (Array.isArray(diagList) && diagList.length > 0) {
              diagnosesData = diagList;
            }
          } catch (e) {
            console.warn("Could not fetch diagnoses:", e);
          }
        }

        // 4. Fetch Prescription Directly
        let prescriptionData: Record<string, any> | null = null;
        if (realEncounterId > 0) {
          try {
            const rxRes = await encountersApi.getPrescriptionByEncounterId(realEncounterId).catch(() => null);
            if (rxRes) {
              prescriptionData = asRecord(unwrapApiData(rxRes));
            }
          } catch (e) {
            console.warn("Could not fetch prescription:", e);
          }
        }

        // 5. Fetch Patient Blood Group if MRN present
        let fetchedBloodGroup: string | null = null;
        const targetMrn = (patSub.mrn as string) || initialRecord?.mrn;
        if (targetMrn && targetMrn !== "MRN-000000") {
          try {
            const patRes = await patientsApi.getPatientByMrn(targetMrn).catch(() => null);
            const p = asRecord(unwrapApiData(patRes));
            if (p?.bloodGroup) {
              fetchedBloodGroup = String(p.bloodGroup);
            }
          } catch (e) {
            console.warn("Could not fetch patient details for blood group:", e);
          }
        }

        // 6. Fetch Doctor Profile if doctor details missing
        let fetchedDoctor: Record<string, any> | null = null;
        const targetDocId = apptSub.doctorId || encSub.doctorId || docSub.id || docSub.doctorId;
        if (targetDocId && !docSub.name && !docSub.fullName && !encSub.doctorName && !apptSub.doctorName) {
          try {
            const docRes = await doctorsApi.getById(String(targetDocId)).catch(() => null);
            if (docRes) {
              fetchedDoctor = asRecord(unwrapApiData(docRes));
            }
          } catch (e) {
            console.warn("Could not fetch doctor details for doctorId:", targetDocId, e);
          }
        }

        // 7. Fetch Vitals Fallback if workspace vitals missing
        let fetchedVitals = asRecord(workspaceData.vitals);
        if (!fetchedVitals.height && !fetchedVitals.weight && !fetchedVitals.temperature) {
          try {
            const encVitalsRes = await vitalsApi.getVitalsByEncounterId(realEncounterId).catch(() => null);
            const encVData = asRecord(unwrapApiData(encVitalsRes));
            if (encVData.height || encVData.weight || encVData.temperature || encVData.pulse) {
              fetchedVitals = encVData;
            } else if (realAppointmentId > 0) {
              const nurseVRes = await vitalsApi.getVitals(realAppointmentId).catch(() => null);
              const nurseVData = asRecord(unwrapApiData(nurseVRes));
              if (nurseVData.height || nurseVData.weight || nurseVData.temperature || nurseVData.pulse) {
                fetchedVitals = nurseVData;
              }
            }
          } catch (e) {
            console.warn("Could not fetch vitals via fallback:", e);
          }
        }

        if (isMounted) {
          const rawV = fetchedVitals;
          const h = rawV.height ?? rawV.heightCm ?? rawV.height_cm ?? null;
          const w = rawV.weight ?? rawV.weightKg ?? rawV.weight_kg ?? null;
          const temp = rawV.temperature ?? rawV.temperatureC ?? rawV.temp ?? null;
          const temperatureUnit = String(rawV.temperatureUnit || "FAHRENHEIT");
          const sys = rawV.bpSystolic ?? rawV.bloodPressureSystolic ?? rawV.systolicBp;
          const dia = rawV.bpDiastolic ?? rawV.bloodPressureDiastolic ?? rawV.diastolicBp;
          const bp = rawV.bloodPressure || rawV.bp || (sys != null && dia != null ? `${sys}/${dia}` : null);
          const pulse = rawV.pulse ?? rawV.heartRate ?? rawV.pulseBpm ?? null;
          const resp = rawV.respiratoryRate ?? rawV.respRate ?? null;
          const spo2 = rawV.spo2 ?? rawV.oxygenSaturation ?? rawV.spo2Percent ?? null;
          const sugar = rawV.bloodSugar ?? rawV.sugar ?? rawV.bloodSugarMgDl ?? null;
          const bmiCalc = rawV.bmi ?? (h && w && Number(h) > 0 && Number(w) > 0 ? (Number(w) / Math.pow(Number(h) / 100, 2)).toFixed(1) : null);

          // Diagnosis Extraction
          const primaryDiag =
            diagnosesData.find((d) => (d.diagnosisType === "PRIMARY" || d.type === "PRIMARY") && d.active !== false) ||
            diagnosesData.find((d) => d.active !== false) ||
            diagnosesData[0] ||
            null;

          // Prescription Extraction
          const rxRoot = asRecord(prescriptionData?.data || prescriptionData);
          const rxAdvice = asRecord(rxRoot.advice);
          const medicationList = asArray(rxRoot.medications || rxRoot.items);
          const meds = medicationList.map((m: Record<string, any>, idx: number) => ({
            id: String(m.medicationId || m.prescriptionItemId || m.id || idx + 1),
            name: String(m.medicineName || m.medicationName || m.drugName || "Medication"),
            dosage: String(m.dose?.value ? `${m.dose.value} ${m.dose.unit || ""}`.trim() : m.dosage || m.strength || "—"),
            frequency: String(m.frequency?.display || m.frequencyCode || m.frequency || "—"),
            duration: String(m.duration?.value ? `${m.duration.value} ${m.duration.unit || ""}`.trim() : m.duration || "—"),
            instructions: String(m.instructions || m.specialInstructions || "—"),
          }));

          // Investigations Extraction
          const rawInvestigations = workspaceData.investigations || workspaceData.orders || workspaceData.labOrders || workspaceData.radiologyOrders || [];
          const investigations = asArray(rawInvestigations).map((item: any) => {
            if (typeof item === "string") return item;
            return item.testName || item.investigationName || item.name || item.displayName || item.testCode || "";
          }).filter(Boolean);

          const clinicalExamText = [consultationData.generalExamination, consultationData.physicalExamination].filter(Boolean).join("\n") || String(consultationData.examinationNotes || "");

          setRecord((prev) => {
            const realDoctorName = String(
              encSub.doctorName || encSub.doctor || apptSub.doctorName || apptSub.doctor || docSub.name || docSub.fullName || fetchedDoctor?.name || fetchedDoctor?.fullName || prev.doctorName || ""
            );
            const realDepartment = String(
              encSub.department || apptSub.department || docSub.department || docSub.departmentName || fetchedDoctor?.department || fetchedDoctor?.departmentName || prev.department || ""
            );
            const realDoctorSpecialty = String(
              encSub.doctorSpecialty || docSub.specialty || fetchedDoctor?.specialty || fetchedDoctor?.specialization || prev.doctorSpecialty || ""
            );

            const followUpReq = rxAdvice.followUpRequired ?? consultationData.followUpRequired ?? consultationData.followupRequired;
            const followUpDt = rxAdvice.followUpDate ?? consultationData.followUpDate ?? consultationData.nextVisitDate;
            const followUpNt = rxAdvice.followUpNotes ?? consultationData.followUpNotes ?? consultationData.followUpInstructions;

            return {
              ...prev,
              id: String(realEncounterId).startsWith("ENC-") ? String(realEncounterId) : `ENC-${realEncounterId}`,
              appointmentId: realAppointmentId || prev.appointmentId,
              doctorName: realDoctorName || prev.doctorName,
              doctorSpecialty: realDoctorSpecialty || prev.doctorSpecialty,
              department: realDepartment || prev.department,
              visitType: String(encSub.visitType || apptSub.visitType || apptSub.appointmentType || prev.visitType || ""),
              patientName: String(patSub.fullName || patSub.name || prev.patientName || ""),
              mrn: String(patSub.mrn || prev.mrn || ""),
              age: patSub.age != null ? Number(patSub.age) : prev.age,
              gender: String(patSub.gender || prev.gender || ""),
              status: String(apptSub.status || encSub.status || prev.status || "Completed"),
              tokenNo: String(apptSub.queueNumber || apptSub.tokenNo || apptSub.tokenNumber || prev.tokenNo || ""),
              visitDate: String(apptSub.appointmentDate || encSub.visitDate || prev.visitDate || ""),
              createdDate: String(encSub.createdAt || encSub.createdDate || prev.createdDate || ""),
              completedDate: String(encSub.completedAt || encSub.completedDate || prev.completedDate || ""),
              completionTime: String(encSub.completedAt || prev.completionTime || ""),

              chiefComplaint: String(consultationData.chiefComplaint || encSub.chiefComplaint || apptSub.chiefComplaint || prev.chiefComplaint || ""),
              durationOfSymptoms: String(consultationData.durationOfSymptoms || prev.durationOfSymptoms || ""),

              bloodGroup: fetchedBloodGroup || String(patSub.bloodGroup || prev.bloodGroup || "—"),
              allergies: Array.isArray(patSub.allergies) ? (patSub.allergies as string[]) : prev.allergies,

              medicines: meds,
              vitals: {
                height: formatVitalValue(h, "cm"),
                weight: formatVitalValue(w, "kg"),
                bmi: formatVitalValue(bmiCalc, "kg/m²"),
                temperature: temp != null ? formatVitalValue(temp, temperatureUnit === "CELSIUS" ? "°C" : "°F") : "—",
                bp: formatVitalValue(bp, "mmHg"),
                pulse: formatVitalValue(pulse, "bpm"),
                respiratoryRate: formatVitalValue(resp, "/min"),
                spo2: formatVitalValue(spo2, "%"),
                bloodSugar: formatVitalValue(sugar, "mg/dL"),
              },

              clinicalExamination: clinicalExamText || prev.clinicalExamination || "",
              provisionalDiagnosis: String(consultationData.provisionalDiagnosis || primaryDiag?.diagnosisName || prev.provisionalDiagnosis || ""),
              finalDiagnosis: String(consultationData.finalDiagnosis || primaryDiag?.diagnosisName || consultationData.assessmentSummary || prev.finalDiagnosis || ""),
              icdCode: String(primaryDiag?.diagnosisCode || consultationData.icdCode || prev.icdCode || ""),

              investigations,
              investigationRemarks: String(workspaceData.investigationRemarks || consultationData.investigationRemarks || prev.investigationRemarks || ""),

              symptoms: String(consultationData.historyOfPresentIllness || consultationData.subjective || prev.symptoms || ""),
              assessment: String(consultationData.assessmentSummary || consultationData.assessment || prev.assessment || ""),
              advice: String(consultationData.advice || prev.advice || ""),
              lifestyleRecommendations: String(rxAdvice.diet || consultationData.lifestyleRecommendations || prev.lifestyleRecommendations || ""),

              followupRequired: followUpReq === true ? "Yes" : followUpReq === false ? "No" : String(followUpReq || ""),
              nextVisitDate: String(followUpDt || ""),
              followupNotes: String(followUpNt || ""),
            };
          });
        }
      } catch (err) {
        console.error("Error loading consultation details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRealEncounterData();
    return () => {
      isMounted = false;
    };
  }, [encounterId, consultationId, initialRecord?.mrn]);

  const patientInitials = (record.patientName || "PT")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const navigate = useNavigate();

  const handleDownloadPdf = () => {
    downloadConsultationPdf(record);
  };

  const handleViewPatientProfile = () => {
    if (onViewPatientProfile) {
      onViewPatientProfile(record.mrn);
    }
    navigate(`/patients?search=${encodeURIComponent(record.mrn)}`);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#F1F5F9] p-12 flex flex-col items-center justify-center min-h-100">
        <Loader2 size={32} className="animate-spin text-[#0D47A1] mb-3" />
        <p
          className="text-sm font-semibold text-slate-600"
          style={{ fontFamily: PP }}
        >
          Loading Consultation Details...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {/* ── BREADCRUMB & HEADER SECTION ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 no-print">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Consultation Details
              </h1>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-[#66BB6A] border border-green-200"
                style={{ fontFamily: PP }}
              >
                {record.status}
              </span>
            </div>
            <p
              className="text-sm text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Review completed consultation records.
            </p>
          </div>
        </div>
      </div>

      {/* ── STICKY PATIENT SUMMARY BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Patient Info Group */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <div
              className="w-10 h-10 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-sm shrink-0"
              style={{ fontFamily: PP }}
            >
              {patientInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {record.patientName}
                </span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                  {record.mrn}
                </span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {record.id}
                </span>
              </div>
              <div
                className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                <span>
                  {record.age} yrs / {record.gender}
                </span>
                <span>•</span>
                <span>
                  Blood:{" "}
                  <strong className="text-[#111827]">
                    {record.bloodGroup}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Token:{" "}
                  <strong className="text-[#0D47A1]">{record.tokenNo}</strong>
                </span>
                <span>•</span>
                <span>
                  Doctor: <strong className="text-[#111827]">{record.doctorName || "—"}</strong>
                </span>
                {record.department && (
                  <>
                    <span>•</span>
                    <span>
                      Department: <strong className="text-[#0D47A1]">{record.department}</strong>
                    </span>
                  </>
                )}
                <span>•</span>
                <span>
                  Date:{" "}
                  <strong className="text-[#111827]">{record.visitDate}</strong>
                </span>
              </div>
            </div>

            {/* Allergy Indicator */}
            {record.allergies.length > 0 && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0"
                style={{ fontFamily: PP }}
              >
                <AlertCircle size={13} />
                <span>Allergies: {record.allergies.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleViewPatientProfile}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Patient Profile
            </button>
            <button
              onClick={() => onViewHistory?.(record.mrn)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Consultation History
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT CONTAINER ── */}
      <div className="p-6 space-y-6">
        <div className="w-full space-y-5">
          {/* ── ADMINISTRATIVE & OPERATIONAL RECORD METADATA HEADER ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <h3
                  className="text-sm font-bold text-slate-800"
                  style={{ fontFamily: PP }}
                >
                  Administrative & Operational Record Metadata
                </h3>
              </div>
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase"
                style={{ fontFamily: PP }}
              >
                READ-ONLY AUDIT MODE
              </span>
            </div>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-4 text-xs pt-1"
              style={{ fontFamily: RB }}
            >
              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Consultation ID
                </span>
                <p className="font-mono font-bold text-[#0D47A1] text-xs">
                  {record.id.startsWith("ENC-") || record.id.startsWith("CNS-")
                    ? record.id
                    : `CNS-${record.id}`}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Appointment ID
                </span>
                <p className="font-mono font-bold text-slate-700 text-xs">
                  {String(record.appointmentId || record.id).startsWith("APT-")
                    ? record.appointmentId || record.id
                    : `APT-${record.appointmentId || record.id}`}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Doctor
                </span>
                <p className="font-semibold text-slate-800 text-xs">
                  {record.doctorName || "—"}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Department
                </span>
                <p className="font-semibold text-slate-700 text-xs">
                  {record.department || "—"}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Visit Type
                </span>
                <p className="font-semibold text-blue-600 text-xs">
                  {record.visitType || "—"}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Status
                </span>
                <p className="font-bold text-emerald-600 text-xs">
                  {record.status || "—"}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Created Date
                </span>
                <p className="font-semibold text-slate-700 text-xs">
                  {formatDateTime(record.createdDate || record.visitDate)}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Completed Date
                </span>
                <p className="font-semibold text-slate-700 text-xs">
                  {formatDateTime(record.completedDate || record.completionTime)}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Duration
                </span>
                <p className="font-bold text-blue-900 text-xs">
                  {record.duration || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ── SECTION 01: VISIT INFORMATION ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("visitInfo")}
              className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 no-print"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Visit Information
                </h3>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${collapsedSections.visitInfo ? "-rotate-90" : ""}`}
              />
            </button>

            {!collapsedSections.visitInfo && (
              <div
                className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs"
                style={{ fontFamily: RB }}
              >
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Consultation ID
                  </span>
                  <p className="font-mono font-bold text-[#0D47A1] text-sm mt-0.5">
                    {record.id}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Visit Date
                  </span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">
                    {record.visitDate}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Doctor
                  </span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">
                    {record.doctorName}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Department
                  </span>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {record.department}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Visit Type
                  </span>
                  <p className="mt-0.5">
                    <span
                      className="px-2 py-0.5 bg-blue-50 text-[#0D47A1] font-semibold text-[11px] rounded"
                      style={{ fontFamily: PP }}
                    >
                      {record.visitType}
                    </span>
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Duration of Symptoms
                  </span>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {record.durationOfSymptoms}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-3 pt-2 border-t border-gray-100">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Chief Complaint
                  </span>
                  <p className="font-semibold text-[#111827] text-sm mt-0.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{record.chiefComplaint}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION 02: PATIENT VITALS ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("vitals")}
              className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 no-print"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Patient Vitals
                </h3>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${collapsedSections.vitals ? "-rotate-90" : ""}`}
              />
            </button>

            {!collapsedSections.vitals && (
              <div
                className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs"
                style={{ fontFamily: RB }}
              >
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div
                    className="text-[10px] text-slate-400 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Height
                  </div>
                  <div className="font-bold text-slate-800 text-sm mt-1">
                    {record.vitals.height}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div
                    className="text-[10px] text-slate-400 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Weight
                  </div>
                  <div className="font-bold text-slate-800 text-sm mt-1">
                    {record.vitals.weight}
                  </div>
                </div>
                <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl">
                  <div
                    className="text-[10px] text-teal-600 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    BMI
                  </div>
                  <div className="font-bold text-[#009688] text-sm mt-1">
                    {record.vitals.bmi}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div
                    className="text-[10px] text-slate-400 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Temperature
                  </div>
                  <div className="font-bold text-slate-800 text-sm mt-1">
                    {record.vitals.temperature}
                  </div>
                </div>
                <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
                  <div
                    className="text-[10px] text-red-600 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Blood Pressure
                  </div>
                  <div className="font-bold text-red-700 text-sm mt-1">
                    {record.vitals.bp}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div
                    className="text-[10px] text-slate-400 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Pulse Rate
                  </div>
                  <div className="font-bold text-slate-800 text-sm mt-1">
                    {record.vitals.pulse}
                  </div>
                </div>
                <div className="p-3 bg-fuchsia-50/50 border border-fuchsia-100 rounded-xl">
                  <div
                    className="text-[10px] text-fuchsia-700 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Blood Sugar
                  </div>
                  <div className="font-bold text-fuchsia-800 text-sm mt-1">
                    {record.vitals.bloodSugar || "—"}
                  </div>
                </div>
                <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl">
                  <div
                    className="text-[10px] text-green-600 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    SpO₂
                  </div>
                  <div className="font-bold text-green-700 text-sm mt-1">
                    {record.vitals.spo2}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div
                    className="text-[10px] text-slate-400 font-bold uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Respiratory Rate
                  </div>
                  <div className="font-bold text-slate-800 text-sm mt-1">
                    {record.vitals.respiratoryRate || "—"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION 03: CLINICAL EXAMINATION ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("examination")}
              className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 no-print"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Clinical Examination & Diagnosis
                </h3>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${collapsedSections.examination ? "-rotate-90" : ""}`}
              />
            </button>

            {!collapsedSections.examination && (
              <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Clinical Examination Findings
                  </span>
                  <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {record.clinicalExamination}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span
                      className="text-[10px] font-bold text-slate-400 uppercase"
                      style={{ fontFamily: PP }}
                    >
                      Provisional Diagnosis
                    </span>
                    <p className="font-semibold text-slate-800 text-sm mt-1">
                      {record.provisionalDiagnosis}
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold text-slate-400 uppercase"
                      style={{ fontFamily: PP }}
                    >
                      Final Diagnosis
                    </span>
                    <p className="font-bold text-[#0D47A1] text-sm mt-1">
                      {record.finalDiagnosis}
                    </p>
                  </div>
                </div>

                {record.icdCode && record.icdCode !== "—" && (
                  <div className="pt-2 border-t border-gray-100">
                    <span
                      className="text-[10px] font-bold text-slate-400 uppercase"
                      style={{ fontFamily: PP }}
                    >
                      ICD Code
                    </span>
                    <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="font-mono font-bold text-[#0D47A1]">
                        {record.icdCode}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── SECTION 04: PRESCRIPTION ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("prescription")}
              className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 no-print"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Prescription
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-bold text-[#009688] bg-teal-50 px-2.5 py-0.5 rounded-full"
                  style={{ fontFamily: PP }}
                >
                  Total: {record.medicines.length} Prescribed Medications
                </span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform ${collapsedSections.prescription ? "-rotate-90" : ""}`}
                />
              </div>
            </button>

            {!collapsedSections.prescription && (
              <div className="p-5">
                {record.medicines.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                    No medications prescribed for this encounter.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr
                          className="bg-slate-50 border-b border-gray-100 text-[11px] font-bold text-[#64748B] uppercase"
                          style={{ fontFamily: PP }}
                        >
                          <th className="py-2.5 px-4">Medicine</th>
                          <th className="py-2.5 px-4">Dosage</th>
                          <th className="py-2.5 px-4">Frequency</th>
                          <th className="py-2.5 px-4">Duration</th>
                          <th className="py-2.5 px-4">Instructions</th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y divide-gray-100"
                        style={{ fontFamily: RB }}
                      >
                        {record.medicines.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td
                              className="py-3 px-4 font-bold text-[#111827]"
                              style={{ fontFamily: PP }}
                            >
                              {m.name}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-700">
                              {m.dosage}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-blue-50 text-[#0D47A1] rounded font-semibold text-[11px]">
                                {m.frequency}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-700">
                              {m.duration}
                            </td>
                            <td className="py-3 px-4 text-slate-600 italic">
                              {m.instructions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── SECTION 05: INVESTIGATION RECOMMENDATION ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("investigation")}
              className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 no-print"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                  05
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Investigation Recommendation
                </h3>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${collapsedSections.investigation ? "-rotate-90" : ""}`}
              />
            </button>

            {!collapsedSections.investigation && (
              <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Recommended Investigations
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {record.investigations.length === 0 ? (
                      <span className="text-slate-500 italic">
                        None recommended
                      </span>
                    ) : (
                      record.investigations.map((inv) => (
                        <span
                          key={inv}
                          className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-bold text-xs"
                          style={{ fontFamily: PP }}
                        >
                          {inv}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {record.investigationRemarks &&
                  record.investigationRemarks !== "—" && (
                    <div>
                      <span
                        className="text-[10px] font-bold text-slate-400 uppercase"
                        style={{ fontFamily: PP }}
                      >
                        Remarks
                      </span>
                      <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        {record.investigationRemarks}
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* ── SECTION 06: CLINICAL NOTES ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("clinicalNotes")}
              className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 no-print"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-50 text-[#66BB6A] flex items-center justify-center font-bold text-xs">
                  06
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Clinical Notes
                </h3>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${collapsedSections.clinicalNotes ? "-rotate-90" : ""}`}
              />
            </button>

            {!collapsedSections.clinicalNotes && (
              <div
                className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
                style={{ fontFamily: RB }}
              >
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Symptoms
                  </span>
                  <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {record.symptoms}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Assessment
                  </span>
                  <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {record.assessment}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Advice
                  </span>
                  <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {record.advice}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Lifestyle Recommendations
                  </span>
                  <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {record.lifestyleRecommendations}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION 07: FOLLOW-UP ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("followup")}
              className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 no-print"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  07
                </div>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Follow-up
                </h3>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${collapsedSections.followup ? "-rotate-90" : ""}`}
              />
            </button>

            {!collapsedSections.followup && (
              <div
                className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
                style={{ fontFamily: RB }}
              >
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Follow-up Required
                  </span>
                  <p className="font-bold text-slate-800 mt-1">
                    {record.followupRequired}
                  </p>
                </div>
                {record.nextVisitDate &&
                  record.nextVisitDate !== "—" &&
                  record.nextVisitDate !== "None" &&
                  record.nextVisitDate !== "" && (
                    <div>
                      <span
                        className="text-[10px] font-bold text-slate-400 uppercase"
                        style={{ fontFamily: PP }}
                      >
                        Next Visit Date
                      </span>
                      <p className="font-bold text-[#0D47A1] text-sm mt-1">
                        {formatDateTime(record.nextVisitDate)}
                      </p>
                    </div>
                  )}
                <div className="sm:col-span-3 border-t border-gray-100 pt-2">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Follow-up Notes
                  </span>
                  <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {record.followupNotes || "None recorded"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION 08: CONSULTATION SUMMARY ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 space-y-4">
            <h3
              className="text-sm font-bold text-[#111827] flex items-center gap-2 border-b border-gray-100 pb-3"
              style={{ fontFamily: PP }}
            >
              <CheckCircle2 size={16} className="text-[#66BB6A]" />
              Consultation Final Summary
            </h3>

            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs"
              style={{ fontFamily: RB }}
            >
              <div>
                <span
                  className="text-[10px] text-slate-400 uppercase font-bold"
                  style={{ fontFamily: PP }}
                >
                  Patient
                </span>
                <p className="font-bold text-[#111827]">{record.patientName || "—"}</p>
                <p className="text-[11px] text-slate-500">{record.mrn}</p>
              </div>
              <div>
                <span
                  className="text-[10px] text-slate-400 uppercase font-bold"
                  style={{ fontFamily: PP }}
                >
                  Doctor
                </span>
                <p className="font-bold text-[#111827]">{record.doctorName || "—"}</p>
                {record.department && (
                  <p className="text-[11px] text-slate-500">
                    {record.department}
                  </p>
                )}
              </div>
              <div>
                <span
                  className="text-[10px] text-slate-400 uppercase font-bold"
                  style={{ fontFamily: PP }}
                >
                  Final Diagnosis
                </span>
                <p className="font-bold text-[#0D47A1]">
                  {record.finalDiagnosis || "—"}
                </p>
              </div>
              <div>
                <span
                  className="text-[10px] text-slate-400 uppercase font-bold"
                  style={{ fontFamily: PP }}
                >
                  Prescription & Tests
                </span>
                <p className="font-bold text-[#009688]">
                  {record.medicines.length} Medicines
                </p>
                <p className="text-[11px] text-slate-500">
                  {record.investigations.length} Recommended Tests
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-4">
                {record.nextVisitDate &&
                  record.nextVisitDate !== "—" &&
                  record.nextVisitDate !== "None" &&
                  record.nextVisitDate !== "" && (
                    <span>
                      Follow-up Date:{" "}
                      <strong className="text-[#111827]">
                        {record.nextVisitDate}
                      </strong>
                    </span>
                  )}
                <span>
                  Completed Time:{" "}
                  <strong className="text-slate-700">
                    {record.completionTime || "—"}
                  </strong>
                </span>
              </div>
              <span
                className="px-3 py-1 bg-green-50 text-[#66BB6A] border border-green-200 rounded-full font-bold text-[11px]"
                style={{ fontFamily: PP }}
              >
                Status: {record.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-3 shadow-lg flex items-center justify-between no-print">
        <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
          Consultation Record <strong className="text-[#0D47A1]">{record.id}</strong> · {record.patientName}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => (onBack ? onBack() : navigate(-1))}
            className="px-4 py-2 border border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            Back
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-[#E5E7EB] bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} className="text-[#009688]" />
            Print Prescription
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 border border-[#E5E7EB] bg-blue-50 text-[#0D47A1] hover:bg-blue-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Download size={15} />
            Download PDF
          </button>
          <button
            onClick={() => onEditConsultation?.(record.id)}
            className="px-5 py-2 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            style={{ fontFamily: PP }}
          >
            <Edit3 size={15} />
            Edit Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
