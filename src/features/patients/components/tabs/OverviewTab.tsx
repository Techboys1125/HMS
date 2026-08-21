import { useState, useEffect } from "react";
import { AlertTriangle, Activity } from "lucide-react";
import type { Patient } from "../../types/patient.types";
import type { ApiPatientAppointment } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { patientsApi } from "../../api/patient.api";

interface OverviewTabProps {
  patient: Patient;
  onNavigateToTab?: (tabId: string) => void;
}

function parseAllergies(patient: Patient): string[] {
  const raw: unknown = patient.knownAllergies ?? patient.allergies;

  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.filter(
      (a): a is string => typeof a === "string" && a.trim().length > 0,
    );
  }

  if (typeof raw === "string") {
    return raw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}

function parseConditions(patient: Patient): string[] {
  const raw: unknown = patient.chronicDiseases ?? patient.medicalHistory;

  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.filter(
      (c): c is string => typeof c === "string" && c.trim().length > 0,
    );
  }

  if (typeof raw === "string") {
    return raw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}

function parseAddress(patient: Patient): string {
  const addr = patient.address;
  if (!addr) return "N/A";
  if (typeof addr === "string") return addr.trim() || "N/A";
  const parts = [
    addr.addressLine1 ?? addr.street ?? addr.streetAddress,
    addr.addressLine2,
    addr.city,
    addr.state,
    addr.pincode ?? addr.postalCode ?? addr.zipCode,
    addr.country,
  ].filter((p) => typeof p === "string" && p.trim().length > 0);
  return parts.length > 0 ? (parts as string[]).join(", ") : "N/A";
}

function parseEmergencyName(patient: Patient): string {
  if (patient.emergencyContact) {
    const ec = patient.emergencyContact;
    return ec.name || ec.contactName || "N/A";
  }
  return "N/A";
}

function parseEmergencyPhone(patient: Patient): string {
  if (patient.emergencyContact) {
    const ec = patient.emergencyContact;
    return (
      ec.phone || ec.contactNumber || ec.mobile || ec.mobileNumber || "N/A"
    );
  }
  return "N/A";
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function parseNumericAmount(val?: string | number): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[^0-9.-]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

const APPT_STATUS_STYLE: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-[#66BB6A] border-emerald-200",
  Scheduled: "bg-blue-50 text-[#0D47A1] border-blue-200",
  "In Progress": "bg-sky-50 text-sky-700 border-sky-200",
  Completed: "bg-gray-50 text-gray-600 border-gray-200",
  Cancelled: "bg-red-50 text-[#EF4444] border-red-200",
  Pending: "bg-amber-50 text-[#F59E0B] border-amber-200",
  "Checked-In": "bg-teal-50 text-[#009688] border-teal-200",
  "Waiting for Vitals": "bg-purple-50 text-purple-700 border-purple-200",
  "Waiting for Doctor": "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export function OverviewTab({ patient, onNavigateToTab }: OverviewTabProps) {
  const [patientDetail, setPatientDetail] = useState<Patient>(patient);
  const [appointments, setAppointments] = useState<ApiPatientAppointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<
    import("../../types/patient.types").ApiPatientPrescription[]
  >([]);
  const [activeScripts, setActiveScripts] = useState(0);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prevMrn, setPrevMrn] = useState<string | null>(null);

  if (patient.mrn !== prevMrn) {
    setPrevMrn(patient.mrn);
    setPatientDetail(patient);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [apptResult, scriptResult, billingResult, patientResult] =
          await Promise.allSettled([
            patientsApi.getAppointments(patient.mrn),
            patientsApi.getPrescriptions(patient.mrn),
            patientsApi.getBilling(patient.mrn),
            patientsApi.getPatientByMrn(patient.mrn),
          ]);

        if (cancelled) return;

        if (patientResult.status === "fulfilled" && patientResult.value) {
          setPatientDetail((prev) => ({ ...prev, ...patientResult.value }));
        }

        const appts =
          apptResult.status === "fulfilled" && Array.isArray(apptResult.value)
            ? apptResult.value
            : [];
        const scripts =
          scriptResult.status === "fulfilled" &&
          Array.isArray(scriptResult.value)
            ? scriptResult.value
            : [];
        const billing =
          billingResult.status === "fulfilled" &&
          Array.isArray(billingResult.value)
            ? billingResult.value
            : [];

        setAppointments(appts);
        setPrescriptions(scripts);

        const activeCount = scripts.filter(
          (s) =>
            !s.status ||
            ["Active", "Issued", "active", "issued"].includes(s.status),
        ).length;
        setActiveScripts(activeCount);

        const outstanding = billing.reduce((sum, inv) => {
          const status = (inv.status ?? "").toLowerCase();
          if (
            status === "pending" ||
            status === "overdue" ||
            status === "partial"
          ) {
            return sum + parseNumericAmount(inv.amount);
          }
          return sum;
        }, 0);
        setOutstandingAmount(outstanding);
      } catch {
        // silently fail; data stays at defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [patient.mrn]);

  const currentPatient = { ...patient, ...patientDetail };
  const allergies = parseAllergies(currentPatient);
  const conditions = parseConditions(currentPatient);
  const address = parseAddress(currentPatient);
  const emergencyName = parseEmergencyName(currentPatient);
  const emergencyPhone = parseEmergencyPhone(currentPatient);
  const email =
    currentPatient.email ||
    ((currentPatient as Record<string, unknown>).userEmail as string) ||
    "N/A";

  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const completedAppointments = safeAppointments.filter(
    (a) => (a.status ?? "").toLowerCase() === "completed",
  );
  const totalVisits =
    currentPatient.totalVisits ??
    currentPatient.visitCount ??
    safeAppointments.length;

  const lastVisit =
    (currentPatient.lastVisit ?? currentPatient.lastVisitDate)
      ? formatDate(currentPatient.lastVisit ?? currentPatient.lastVisitDate)
      : completedAppointments.length > 0
        ? formatDate(
            completedAppointments[completedAppointments.length - 1].date ??
              completedAppointments[completedAppointments.length - 1]
                .appointmentDate,
          )
        : safeAppointments.length > 0
          ? formatDate(safeAppointments[0].date)
          : "N/A";

  const upcoming = safeAppointments.filter((a) => {
    const s = (a.status ?? "").toLowerCase();
    return (
      s === "scheduled" ||
      s === "confirmed" ||
      s === "pending" ||
      s === "checked-in" ||
      s === "waiting for vitals" ||
      s === "waiting for doctor"
    );
  });

  const recentAppointments = safeAppointments
    .toSorted((a, b) => {
      const da = a.date ?? a.appointmentDate ?? "";
      const db = b.date ?? b.appointmentDate ?? "";
      return da > db ? -1 : da < db ? 1 : 0;
    })
    .slice(0, 3);

  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : [];
  const activePrescriptions = safePrescriptions.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="flex items-center gap-3 text-xs text-[#64748B]">
          <div className="w-5 h-5 border-2 border-[#0D47A1] border-t-transparent rounded-full animate-spin" />
          Loading overview...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ fontFamily: PP }}>
      {/* Stats Row */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Total Visits",
            value: totalVisits,
            color: "text-[#0D47A1]",
            bg: "bg-blue-50",
          },
          {
            label: "Last Visit",
            value: lastVisit,
            color: "text-[#009688]",
            bg: "bg-teal-50",
            small: true,
          },
          {
            label: "Upcoming",
            value: upcoming.length,
            color: "text-[#F59E0B]",
            bg: "bg-amber-50",
          },
          {
            label: "Active Scripts",
            value: activeScripts,
            color: "text-[#009688]",
            bg: "bg-teal-50",
          },
          {
            label: "Outstanding",
            value:
              outstandingAmount > 0
                ? `$${outstandingAmount.toLocaleString()}`
                : "$0",
            color: "text-[#EF4444]",
            bg: "bg-red-50",
          },
          {
            label: "Allergies",
            value: allergies.length,
            color: "text-[#EF4444]",
            bg: "bg-red-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-[#E5E7EB] rounded-xl p-3 flex flex-col items-center justify-center text-center`}
          >
            <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wide">
              {stat.label}
            </span>
            <span
              className={`text-lg font-bold ${stat.color} mt-0.5 ${stat.small ? "text-sm" : ""}`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Row: Patient Info & Allergies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Patient Information & Emergency Contact */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <h3 className="text-sm font-bold text-[#111827] mb-3">
            Patient Information &amp; Emergency Contact
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start">
              <span className="w-36 shrink-0 text-[#64748B]">Full Address</span>
              <span className="text-[#111827] font-medium">{address}</span>
            </div>
            <div className="flex items-start">
              <span className="w-36 shrink-0 text-[#64748B]">Email</span>
              <span className="text-[#111827] font-medium">{email}</span>
            </div>
            <div className="flex items-start">
              <span className="w-36 shrink-0 text-[#64748B]">
                Emergency Contact
              </span>
              <span className="text-[#111827] font-medium">
                {emergencyName}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-36 shrink-0 text-[#64748B]">
                Emergency Phone
              </span>
              <span className="text-[#111827] font-medium">
                {emergencyPhone}
              </span>
            </div>
          </div>
        </div>

        {/* Known Allergies & Medical Conditions */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <h3 className="text-sm font-bold text-[#111827] mb-3">
            Known Allergies &amp; Medical Conditions
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-[#64748B] uppercase tracking-wide font-medium">
                Allergies
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {allergies.length > 0 ? (
                  allergies.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200"
                    >
                      <AlertTriangle size={11} />
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-[#64748B]">
                    No known allergies
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] uppercase tracking-wide font-medium">
                Medical Conditions
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {conditions.length > 0 ? (
                  conditions.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      <Activity size={11} />
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-[#64748B]">
                    No conditions recorded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Recent Appointments & Active Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Appointments Summary */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">
              Recent Appointments Summary
            </h3>
            <button
              onClick={() => onNavigateToTab?.("appointments")}
              className="text-[11px] font-medium text-[#0D47A1] hover:text-[#1565C0] transition-colors"
            >
              View All
            </button>
          </div>
          {recentAppointments.length === 0 ? (
            <div className="text-center py-6 text-[11px] text-[#64748B]">
              No recent appointments found.
            </div>
          ) : (
            <div className="space-y-2">
              {recentAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between bg-slate-50/50 border border-[#E5E7EB] rounded-lg p-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center text-[10px] font-bold">
                      {typeof appt.doctor === "string"
                        ? appt.doctor?.charAt(0) || "D"
                        : "D"}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#111827]">
                        {typeof appt.doctor === "string"
                          ? appt.doctor || "—"
                          : appt.doctorName || "—"}
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        {formatDate(appt.date ?? appt.appointmentDate)} ·{" "}
                        {appt.time ?? appt.startTime ?? "—"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${
                      APPT_STATUS_STYLE[appt.status ?? ""] ||
                      "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {appt.status ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Prescriptions Summary */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#111827]">
              Active Prescriptions Summary
            </h3>
            <button
              onClick={() => onNavigateToTab?.("prescriptions")}
              className="text-[11px] font-medium text-[#0D47A1] hover:text-[#1565C0] transition-colors"
            >
              View All
            </button>
          </div>
          {activePrescriptions.length === 0 ? (
            <div className="text-center py-6 text-[11px] text-[#64748B]">
              No active prescriptions found.
            </div>
          ) : (
            <div className="space-y-2">
              {activePrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="flex items-center justify-between bg-slate-50/50 border border-[#E5E7EB] rounded-lg p-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-[10px] font-bold">
                      Rx
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#111827]">
                        {rx.doctorName || "Doctor"} ·{" "}
                        {rx.medicineCount ||
                          (Array.isArray(rx.medicines)
                            ? rx.medicines.length
                            : 1)}{" "}
                        meds
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        {formatDate(rx.date)} ·{" "}
                        {rx.department || "General Medicine"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${
                      (rx.status ?? "").toLowerCase() === "active" ||
                      (rx.status ?? "").toLowerCase() === "issued"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-blue-50 text-[#0D47A1] border-blue-200"
                    }`}
                  >
                    {rx.status ?? "Issued"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
