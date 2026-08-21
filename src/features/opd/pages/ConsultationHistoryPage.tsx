import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Plus, Eye, ArrowLeft } from "lucide-react";
import { usePermissions } from "../../../permissions/usePermissions";
import type { TimelineConsultationItem } from "../types/consultation";
import { formatTime } from "../../../lib/time-utils";
import { consultationApi } from "../api/consultationApi";

// Reusable Components
import { ConsultationHeader } from "../components/ConsultationHeader";
import { PatientSummaryCard } from "../components/PatientSummaryCard";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function ConsultationHistoryPage({
  role: overrideRole,
  patientId,
  onBack,
  onStartNewConsultation,
  onViewFullConsultation,
}: {
  patientId?: string;
  role?: "doctor" | "admin" | "nurse";
  onBack?: () => void;
  onStartNewConsultation?: () => void;
  onViewFullConsultation?: (consultationId: string) => void;
  onPatientSelect?: (patientId: string) => void;
}) {
  const { role: userRole } = usePermissions();
  const currentRole =
    overrideRole || (userRole ? userRole.toLowerCase() : "doctor");

  const isReadOnly =
    currentRole === "admin" ||
    currentRole === "nurse" ||
    currentRole === "patient";

  // State for historical consultations from API
  const [historicalConsultations, setHistoricalConsultations] = useState<TimelineConsultationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch consultation history from API
  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the consultation queue API to fetch completed consultations
        const queueData = await consultationApi.getConsultationQueue();
        if (!cancelled) {
          const completedConsultations = (queueData || []).filter(
            (item: Record<string, unknown>) => 
              String(item.status || "").toUpperCase() === "COMPLETED"
          );
          
          // Map API data to TimelineConsultationItem format
          const mapped: TimelineConsultationItem[] = completedConsultations.map((item: Record<string, unknown>) => ({
            id: String(item.consultationId || item.id || ""),
            date: String(item.appointmentDate || item.date || ""),
            time: String(item.startTime || item.time || ""),
            doctor: String(item.doctorName || item.doctor?.name || ""),
            department: String(item.departmentName || item.department || ""),
            visitType: String(item.visitType || item.appointmentType || "First Visit"),
            status: "Completed",
            chiefComplaint: String(item.chiefComplaint || item.reason || ""),
            diagnosis: String(item.diagnosis || ""),
            icdCode: String(item.icdCode || ""),
            medicinesCount: Number(item.medicinesCount || 0),
            investigationsCount: Number(item.investigationsCount || 0),
            followupStatus: String(item.followupStatus || ""),
            nextFollowupDate: String(item.nextFollowupDate || ""),
            vitals: item.vitals as TimelineConsultationItem["vitals"],
            medicines: item.medicines as TimelineConsultationItem["medicines"],
            investigations: item.investigations as string[],
            examinationFindings: String(item.examinationFindings || ""),
            clinicalNotes: String(item.clinicalNotes || ""),
          }));
          
          setHistoricalConsultations(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to fetch consultation history";
          console.error("Failed to fetch consultation history:", err);
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  // Search & Filter States
  const [searchQuery] = useState("");
  const [filterDoctor] = useState("All");
  const [filterDepartment] = useState("All");
  const [filterVisitType] = useState("All");
  const [filterStatus] = useState("All");

  // Expanded Timeline Cards State
  const [expandedCardIds, setExpandedCardIds] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Timeline
  const filteredTimeline = useMemo(() => {
    return historicalConsultations.filter((item) => {
      if (filterDoctor !== "All" && item.doctor !== filterDoctor) return false;
      if (filterDepartment !== "All" && item.department !== filterDepartment)
        return false;
      if (filterVisitType !== "All" && item.visitType !== filterVisitType)
        return false;
      if (filterStatus !== "All" && item.status !== filterStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(q);
        const matchDx = item.diagnosis.toLowerCase().includes(q);
        const matchDate = item.date.toLowerCase().includes(q);
        const matchMeds = item.medicines?.some((m) =>
          m.name.toLowerCase().includes(q),
        ) || false;
        const matchDoc = item.doctor.toLowerCase().includes(q);
        if (!matchId && !matchDx && !matchDate && !matchMeds && !matchDoc)
          return false;
      }
      return true;
    });
  }, [
    historicalConsultations,
    searchQuery,
    filterDoctor,
    filterDepartment,
    filterVisitType,
    filterStatus,
  ]);

  const breadcrumbRoleLabel =
    currentRole === "admin"
      ? "Hospital Admin"
      : currentRole === "nurse"
        ? "Nurse"
        : "Doctor";

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in">
          {toastMsg}
        </div>
      )}
      {/* HEADER */}
      <ConsultationHeader
        roleLabel={breadcrumbRoleLabel}
        pageTitle="Consultation History"
        subtitle={
          isReadOnly
            ? "Review patient's previous consultation records."
            : "Review previous consultations, diagnoses and treatments."
        }
        breadcrumbs={[{ label: "History", active: true }]}
        statusBadge={
          isReadOnly && (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0D47A1] border border-blue-200"
              style={{ fontFamily: PP }}
            >
              {currentRole === "admin"
                ? "Hospital Admin (Read Only)"
                : "Nurse (Read Only)"}
            </span>
          )
        }
        actions={
          <>
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}

            {isReadOnly ? (
              <>
                <button
                  onClick={() => alert("Printing Medical History")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  Print History
                </button>
                <button
                  onClick={() => alert("Exporting Consultation History PDF")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  Download PDF
                </button>
              </>
            ) : (
              onStartNewConsultation && (
                <button
                  onClick={onStartNewConsultation}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Plus size={15} />
                  Start New Consultation
                </button>
              )
            )}
          </>
        }
      />

      <div className="p-6 space-y-6 flex-1">
        {/* PATIENT SUMMARY - Show loading or empty state */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0D47A1] border-t-transparent mx-auto mb-3"></div>
            <p className="text-sm text-slate-600" style={{ fontFamily: RB }}>
              Loading consultation history...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 text-center">
            <p className="text-sm text-red-600" style={{ fontFamily: RB }}>
              {error}
            </p>
          </div>
        ) : (
          <PatientSummaryCard
            patientName=""
            mrn=""
            age={0}
            gender=""
            bloodGroup=""
            allergies={[]}
            phone=""
            totalVisitsCount={historicalConsultations.length}
            lastVisitDate=""
          />
        )}

        {/* TIMELINE LIST */}
        <div className="space-y-4">
          {isLoading && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0D47A1] border-t-transparent mx-auto mb-3"></div>
              <p className="text-sm text-slate-600" style={{ fontFamily: RB }}>
                Loading consultations...
              </p>
            </div>
          )}
          {!isLoading && filteredTimeline.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 text-center">
              <p className="text-sm text-slate-600" style={{ fontFamily: RB }}>
                No consultation history found.
              </p>
            </div>
          )}
          {!isLoading && filteredTimeline.map((item) => {
            const isExpanded = !!expandedCardIds[item.id];
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#0D47A1] font-bold">
                      <span>
                        {item.date} · {formatTime(item.time)}
                      </span>
                      <span className="font-mono bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                        {item.id}
                      </span>
                    </div>
                    <div
                      className="text-sm font-bold text-slate-800 mt-1"
                      style={{ fontFamily: PP }}
                    >
                      {item.diagnosis} (ICD: {item.icdCode})
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Doctor: {item.doctor} ({item.department}) ·{" "}
                      {item.visitType}
                    </div>
                  </div>
                  <ChevronDown
                    className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    size={18}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-4 text-xs text-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong
                          className="block text-slate-400 uppercase font-semibold text-[10px] mb-1"
                          style={{ fontFamily: PP }}
                        >
                          Chief Complaint
                        </strong>
                        <p
                          className="text-slate-700 font-medium"
                          style={{ fontFamily: RB }}
                        >
                          {item.chiefComplaint}
                        </p>
                      </div>
                      <div>
                        <strong
                          className="block text-slate-400 uppercase font-semibold text-[10px] mb-1"
                          style={{ fontFamily: PP }}
                        >
                          Vitals Readings
                        </strong>
                        <p className="text-slate-700 font-mono">
                          BP: {item.vitals.bp} mmHg | Heart Rate:{" "}
                          {item.vitals.pulse} | Temp: {item.vitals.temp} | SpO₂:{" "}
                          {item.vitals.spo2}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-50 pt-3">
                      <strong
                        className="block text-slate-400 uppercase font-semibold text-[10px] mb-1.5"
                        style={{ fontFamily: PP }}
                      >
                        Prescribed Medicines
                      </strong>
                      <div className="space-y-1">
                        {item.medicines.map((m) => (
                          <div
                            key={m.name}
                            className="flex gap-2"
                          >
                            <span className="font-bold text-slate-800">
                              • {m.name}
                            </span>
                            <span className="text-slate-500 font-mono">
                              {m.dosage} - {m.freq} ({m.duration})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {item.investigations.length > 0 && (
                      <div className="border-t border-slate-50 pt-3">
                        <strong
                          className="block text-slate-400 uppercase font-semibold text-[10px] mb-1.5"
                          style={{ fontFamily: PP }}
                        >
                          Recommended Investigations
                        </strong>
                        <div className="flex flex-wrap gap-1.5">
                          {item.investigations.map((inv) => (
                            <span
                              key={inv}
                              className="px-2 py-0.5 bg-blue-50 text-[#0D47A1] rounded font-semibold border border-blue-100"
                            >
                              {inv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.clinicalNotes && (
                      <div className="border-t border-slate-50 pt-3">
                        <strong
                          className="block text-slate-400 uppercase font-semibold text-[10px] mb-1"
                          style={{ fontFamily: PP }}
                        >
                          Clinical Advice & Summary
                        </strong>
                        <p
                          className="text-slate-600 leading-relaxed"
                          style={{ fontFamily: RB }}
                        >
                          {item.clinicalNotes}
                        </p>
                      </div>
                    )}

                    {!isReadOnly && onViewFullConsultation && (
                      <div className="border-t border-slate-100 pt-3 flex justify-end">
                        <button
                          onClick={() => onViewFullConsultation(item.id)}
                          className="px-3 py-1.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white font-semibold rounded-lg flex items-center gap-1"
                          style={{ fontFamily: PP }}
                        >
                          <Eye size={12} />
                          View Full Details
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ConsultationHistoryPage;
