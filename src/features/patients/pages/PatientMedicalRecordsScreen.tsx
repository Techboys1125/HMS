import { useState, useEffect } from "react";
import { appointmentsApi } from "../../appointments/api/appointments.api";
import { patientsApi } from "../api/patient.api";
import { usePatientPortal } from "../context/PatientPortalContext";
import type { FamilyMember } from "./FamilyMembersManagement";
import {
  Search,
  Download,
  ChevronRight,
  Eye,
  X,
  UserCheck,
  Activity,
  Calendar,
  Pill,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import type {
  MedicalVisitRecord,
  PrescriptionRecord,
} from "../types/patient.types";
import { PP, RB } from "../constants/patient.mock";
import { Pagination } from "../../../common/components/Pagination";

export function PatientMedicalRecordsScreen({
  activePatient: propActivePatient,
}: {
  activePatient?: FamilyMember;
}) {
  const portal = usePatientPortal();
  const activePatient = propActivePatient ?? portal?.activePatient;
  const [activeTab, setActiveTab] = useState<"visits" | "prescriptions">(
    "visits",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [visitRecords, setVisitRecords] = useState<MedicalVisitRecord[]>([]);
  const [prescriptionRecords, setPrescriptionRecords] = useState<
    PrescriptionRecord[]
  >([]);

  useEffect(() => {
    appointmentsApi
      .getAppointments(
        activePatient?.id || activePatient?.mrn
          ? { patientId: activePatient.id || activePatient.mrn }
          : undefined,
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        const data = res?.data || res;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];
        if (list && list.length > 0) {
          const mapped: MedicalVisitRecord[] = list.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any, idx: number) => ({
              id: String(a.appointmentId || a.id || `VIS-${idx}`),
              date: a.appointmentDate || a.date || "",
              time: a.startTime || a.time || "",
              department:
                a.departmentName ||
                (a.department && typeof a.department === "object"
                  ? a.department.departmentName ||
                    a.department.name ||
                    "General OPD"
                  : String(a.department || "General OPD")),
              doctor:
                a.doctorName ||
                (a.doctor && typeof a.doctor === "object"
                  ? a.doctor.name || a.doctor.fullName || "Consultant"
                  : String(a.doctor || "Consultant")),
              specialty: a.departmentName || "Specialist",
              diagnosis: a.reason || a.symptoms || "OPD Consultation",
              notes: a.symptoms || "Consultation completed.",
              prescriptions: [] as string[],
              status: (a.status === "COMPLETED" || a.status === "Completed"
                ? "Completed"
                : a.status === "In-Progress" || a.status === "IN_PROGRESS"
                  ? "In-Progress"
                  : a.status === "Follow-up Required" ||
                      a.status === "FOLLOW_UP"
                    ? "Follow-up Required"
                    : "Completed") as
                "Completed" | "In-Progress" | "Follow-up Required",
            }),
          );
          setVisitRecords(mapped);
        } else {
          setVisitRecords([]);
        }
      })
      .catch(() => setVisitRecords([]));
  }, [activePatient]);

  useEffect(() => {
    const mrn = activePatient?.mrn;
    if (!mrn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrescriptionRecords([]);
      return;
    }

    let cancelled = false;
    patientsApi
      .getPrescriptions(mrn)
      .then((records) => {
        if (cancelled) return;
        setPrescriptionRecords(
          records.map((record) => {
            const rawStatus = String(record.status || "ACTIVE").toUpperCase();
            return {
              id: String(record.id),
              doctor: record.doctorName || "Doctor",
              department: record.department || "—",
              issueDate: record.date || "—",
              status: rawStatus.includes("REFILL")
                ? "Refilled"
                : rawStatus.includes("EXPIRED") ||
                    rawStatus.includes("ARCHIVED")
                  ? "Expired"
                  : "Active",
              medicines: (record.medicines || []).map((medicine) => ({
                name: medicine.name,
                dosage: medicine.dosage || "—",
                frequency: medicine.frequency || "",
                duration: medicine.duration || "",
                instructions: medicine.instructions || "",
              })),
              diagnosis: record.diagnosis || "—",
              followUpDate: record.followUpDate || "—",
            };
          }),
        );
      })
      .catch(() => {
        if (!cancelled) setPrescriptionRecords([]);
      });

    return () => {
      cancelled = true;
    };
  }, [activePatient?.mrn]);

  // Drawer states
  const [selectedRx, setSelectedRx] = useState<PrescriptionRecord | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<MedicalVisitRecord | null>(
    null,
  );

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered Visits
  const filteredVisits = visitRecords.filter((v) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        v.id.toLowerCase().includes(q) ||
        v.doctor.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        v.diagnosis.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (doctorFilter !== "All" && v.doctor !== doctorFilter) return false;
    if (deptFilter !== "All" && v.department !== deptFilter) return false;
    return true;
  });

  // Filtered Prescriptions
  const filteredPrescriptions = prescriptionRecords.filter((rx) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        rx.id.toLowerCase().includes(q) ||
        rx.doctor.toLowerCase().includes(q) ||
        rx.department.toLowerCase().includes(q) ||
        rx.diagnosis.toLowerCase().includes(q) ||
        rx.medicines.some((m) => m.name.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (doctorFilter !== "All" && rx.doctor !== doctorFilter) return false;
    if (statusFilter !== "All" && rx.status !== statusFilter) return false;
    return true;
  });

  // Pagination for visits
  const [visitsPage, setVisitsPage] = useState(1);
  const visitsPageSize = 10;
  const visitsTotalPages = Math.ceil(filteredVisits.length / visitsPageSize);
  const paginatedVisits = filteredVisits.slice(
    (visitsPage - 1) * visitsPageSize,
    visitsPage * visitsPageSize,
  );

  // Pagination for prescriptions
  const [prescriptionsPage, setPrescriptionsPage] = useState(1);
  const prescriptionsPageSize = 10;
  const prescriptionsTotalPages = Math.ceil(
    filteredPrescriptions.length / prescriptionsPageSize,
  );
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (prescriptionsPage - 1) * prescriptionsPageSize,
    prescriptionsPage * prescriptionsPageSize,
  );

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Medical Records
          </h1>
          <div
            className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1"
            style={{ fontFamily: RB }}
          >
            <span>Patient Portal</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Medical Records</span>
          </div>
        </div>

        <button
          onClick={() =>
            triggerToast("Generating complete Medical History Report PDF...")
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm self-start md:self-auto"
          style={{ fontFamily: PP }}
        >
          <Download size={14} /> Download Medical Report
        </button>
      </div>

      {/* ── 2. SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Total Visits
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {visitRecords.length}
            </div>
            <div className="text-[11px] text-[#0D47A1] font-medium mt-1">
              OPD & Follow-up visits
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
            <Activity size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Active Prescriptions
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {
                prescriptionRecords.filter((rx) => rx.status === "Active")
                  .length
              }
            </div>
            <div className="text-[11px] text-[#009688] font-medium mt-1">
              Ongoing medications
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
            <Pill size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Known Allergies
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {activePatient?.knownAllergies?.length || 0}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              {activePatient?.knownAllergies?.join(", ") ||
                "No known allergies"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Primary Doctor
            </div>
            <div
              className="text-sm font-bold text-[#111827] mt-1"
              style={{ fontFamily: PP }}
            >
              {visitRecords[0]?.doctor || "Not assigned"}
            </div>
            <div className="text-[11px] text-[#0D47A1] font-medium">
              {visitRecords[0]?.department || "No recent consultation"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
            <UserCheck size={20} />
          </div>
        </div>
      </div>

      {/* ── 3. TAB NAVIGATION ── */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-0.5">
        {[
          {
            id: "visits",
            label: "Visit History",
            count: visitRecords.length,
          },
          {
            id: "prescriptions",
            label: "Prescriptions",
            count: prescriptionRecords.length,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "visits" | "prescriptions")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-0.5 ${
                isActive
                  ? "border-[#0D47A1] text-[#0D47A1]"
                  : "border-transparent text-[#64748B] hover:text-[#111827]"
              }`}
              style={{ fontFamily: PP }}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive
                      ? "bg-blue-50 text-[#0D47A1]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 4. TAB CONTENTS ── */}

      {/* TAB 2: VISIT HISTORY */}
      {activeTab === "visits" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Doctor, Department, Diagnosis..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
              </select>

              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Doctors</option>
                <option value="Dr. Arjun Mehta">Dr. Arjun Mehta</option>
                <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
              </select>
            </div>
          </div>

          {/* Visits Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="w-full text-left text-xs"
                style={{ fontFamily: RB }}
              >
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3.5 font-bold">Visit Date</th>
                    <th className="px-4 py-3.5 font-bold">Doctor</th>
                    <th className="px-4 py-3.5 font-bold">Department</th>
                    <th className="px-4 py-3.5 font-bold">Diagnosis</th>
                    <th className="px-4 py-3.5 font-bold">Prescriptions</th>
                    <th className="px-4 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                  {paginatedVisits.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#111827]">{v.date}</div>
                        <div className="text-[11px] text-[#64748B] font-mono">
                          {v.id}
                        </div>
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#111827]">
                        {v.doctor}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {v.department}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-800">
                        {v.diagnosis}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {v.prescriptions.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-[#0D47A1]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-[#66BB6A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
                          {v.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedVisit(v)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
                          style={{ fontFamily: PP }}
                        >
                          <Eye size={13} /> View Summary
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={visitsPage}
              totalPages={visitsTotalPages}
              onPageChange={setVisitsPage}
              pageSize={visitsPageSize}
              totalCount={filteredVisits.length}
            />
          </div>
        </div>
      )}

      {/* TAB 3: PRESCRIPTIONS */}
      {activeTab === "prescriptions" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Prescription ID, Doctor, Medicine..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Refilled">Refilled</option>
              </select>
            </div>
          </div>

          {/* Prescriptions Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="w-full text-left text-xs"
                style={{ fontFamily: RB }}
              >
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3.5 font-bold">Prescription ID</th>
                    <th className="px-4 py-3.5 font-bold">Doctor</th>
                    <th className="px-4 py-3.5 font-bold">
                      Prescribed Medicines
                    </th>
                    <th className="px-4 py-3.5 font-bold">Issue Date</th>
                    <th className="px-4 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                  {paginatedPrescriptions.map((rx: PrescriptionRecord) => (
                    <tr
                      key={rx.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-[#0D47A1]">
                        {rx.id}
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#111827]">
                        {rx.doctor}
                        <div className="text-[11px] text-[#64748B] font-normal">
                          {rx.department}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {rx.medicines.map(
                            (
                              m: { name: string; dosage?: string },
                              idx: number,
                            ) => (
                              <div
                                key={idx}
                                className="font-bold text-[#111827] text-xs"
                              >
                                {m.name}{" "}
                                <span className="text-[#64748B] font-normal text-[11px]">
                                  ({m.dosage})
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-700 font-medium">
                        {rx.issueDate}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            rx.status === "Active"
                              ? "bg-teal-50 text-[#009688]"
                              : rx.status === "Refilled"
                                ? "bg-blue-50 text-[#0D47A1]"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              rx.status === "Active"
                                ? "bg-[#009688]"
                                : rx.status === "Refilled"
                                  ? "bg-[#0D47A1]"
                                  : "bg-slate-400"
                            }`}
                          />
                          {rx.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRx(rx)}
                            className="p-1.5 text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Prescription Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() =>
                              triggerToast(
                                `Downloading Prescription PDF for ${rx.id}...`,
                              )
                            }
                            className="p-1.5 text-slate-500 hover:text-[#009688] hover:bg-teal-50 rounded-lg transition-colors"
                            title="Download Prescription PDF"
                          >
                            <Download size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={prescriptionsPage}
              totalPages={prescriptionsTotalPages}
              onPageChange={setPrescriptionsPage}
              pageSize={prescriptionsPageSize}
              totalCount={filteredPrescriptions.length}
            />
          </div>
        </div>
      )}

      {/* ── 5. RIGHT DRAWER: PRESCRIPTION / VISIT DETAILS ── */}
      {(selectedRx || selectedVisit) && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => {
              setSelectedRx(null);
              setSelectedVisit(null);
            }}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2
                    className="text-base font-bold"
                    style={{ fontFamily: PP }}
                  >
                    {selectedRx
                      ? `Prescription ${selectedRx.id}`
                      : `Visit Summary — ${selectedVisit?.id}`}
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Clinical details & dosage schedule
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRx(null);
                    setSelectedVisit(null);
                  }}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div
                className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50"
                style={{ fontFamily: RB }}
              >
                {/* Doctor & Department Banner */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
                  <div className="text-xs text-[#64748B] font-medium">
                    Consulting Physician
                  </div>
                  <div
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {selectedRx ? selectedRx.doctor : selectedVisit?.doctor}
                  </div>
                  <div className="text-xs text-[#0D47A1] font-semibold">
                    {selectedRx
                      ? selectedRx.department
                      : selectedVisit?.department}{" "}
                    Department
                  </div>
                </div>

                {/* Diagnosis Info */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
                  <div
                    className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Clinical Diagnosis
                  </div>
                  <p className="text-xs text-[#111827] font-semibold">
                    {selectedRx
                      ? selectedRx.diagnosis
                      : selectedVisit?.diagnosis}
                  </p>
                  {selectedVisit && (
                    <p className="text-xs text-slate-600 pt-2 border-t border-gray-50">
                      {selectedVisit.notes}
                    </p>
                  )}
                </div>

                {/* Prescribed Medicines Schedule */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div
                    className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Medicines & Dosage Schedule
                  </div>

                  {selectedRx ? (
                    <div className="space-y-3">
                      {selectedRx.medicines.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#111827]">
                              {m.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#009688]">
                              {m.duration}
                            </span>
                          </div>
                          <div className="text-xs text-slate-700">
                            Dosage:{" "}
                            <span className="font-semibold">{m.dosage}</span>
                          </div>
                          <div className="text-xs text-slate-600">
                            Timing: {m.frequency}
                          </div>
                          <div className="text-[11px] text-slate-500 italic">
                            Note: {m.instructions}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedVisit?.prescriptions.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] text-xs font-bold"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Follow up Date */}
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#64748B] block font-medium">
                      Recommended Follow-up
                    </span>
                    <span className="font-bold text-[#009688]">
                      {selectedRx
                        ? selectedRx.followUpDate
                        : "2 Weeks post consultation"}
                    </span>
                  </div>
                  <Calendar size={18} className="text-[#009688]" />
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
                <button
                  onClick={() => triggerToast(`Downloading PDF report...`)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={15} /> Download PDF
                </button>
                <button
                  onClick={() => {
                    setSelectedRx(null);
                    setSelectedVisit(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
