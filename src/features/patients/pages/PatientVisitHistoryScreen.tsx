import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  Activity,
  Calendar,
  Stethoscope,
  Pill,
  FileText,
  Clock,
  Printer,
  CheckCircle2,
} from "lucide-react";
import type { VisitRecord } from "../types/patient.types";
import { PP, RB, MOCK_VISIT_HISTORY } from "../constants/patient.mock";
import { StatusBadge } from "../components/StatusBadges";

export function PatientVisitHistoryScreen({
  onBack,
  embedded = false,
}: {
  onBack?: () => void;
  embedded?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals state
  const [summaryVisit, setSummaryVisit] = useState<VisitRecord | null>(null);
  const [prescriptionVisit, setPrescriptionVisit] =
    useState<VisitRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered visits
  const filteredVisits = MOCK_VISIT_HISTORY.filter((visit) => {
    const matchesSearch =
      visit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoctor = !doctorFilter || visit.doctor === doctorFilter;
    const matchesDepartment =
      !departmentFilter || visit.department === departmentFilter;
    const matchesStatus = !statusFilter || visit.status === statusFilter;

    return matchesSearch && matchesDoctor && matchesDepartment && matchesStatus;
  });

  return (
    <div
      className={`flex-1 overflow-y-auto ${embedded ? "p-0" : "p-6 bg-[#F1F5F9]"}`}
    >
      <div className="w-full space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} className="text-[#66BB6A]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header & Breadcrumb (Only show full header when standalone) */}
        {!embedded && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h1
                  className="text-xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Patient Visit History
                </h1>
              </div>
              <div
                className="flex items-center gap-1.5 text-sm text-slate-500 pl-8"
                style={{ fontFamily: RB }}
              >
                <span>Dashboard</span>
                <ChevronRight size={14} className="text-slate-300" />
                <button
                  onClick={onBack}
                  className="hover:text-[#0D47A1] transition-colors"
                >
                  Patients
                </button>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="font-medium text-[#111827]">
                  Visit History
                </span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  showToast("Visit history document printed successfully.")
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Printer size={15} className="text-slate-500" />
                <span>Print</span>
              </button>
              <button
                onClick={() =>
                  showToast("Exporting visit history CSV... Download started.")
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D47A1] text-white text-sm font-medium hover:bg-[#0c3d8a] transition-colors shadow-sm"
              >
                <Download size={15} />
                <span>Export Visit History</span>
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Visit ID, Doctor, or Diagnosis..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl text-[#111827] placeholder-slate-400 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                style={{ fontFamily: RB }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Embedded Export & Print Controls if embedded */}
            {embedded && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    showToast("Visit history document printed successfully.")
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Printer size={14} className="text-slate-500" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() =>
                    showToast(
                      "Exporting visit history CSV... Download started.",
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D47A1] text-white text-xs font-medium hover:bg-[#0c3d8a] transition-colors shadow-sm"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Selects */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors cursor-pointer"
              >
                <option value="">All Visit Dates</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last 1 Year</option>
              </select>
              <Calendar
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Doctor Filter */}
            <div className="relative">
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors cursor-pointer"
              >
                <option value="">All Doctors</option>
                <option value="Dr. Arjun Mehta">Dr. Arjun Mehta</option>
                <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
                <option value="Dr. Rajesh Kapoor">Dr. Rajesh Kapoor</option>
                <option value="Dr. Sunita Patel">Dr. Sunita Patel</option>
              </select>
              <Stethoscope
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors cursor-pointer"
              >
                <option value="">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
              <Activity
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="In Progress">In Progress</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Filter
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Main Visits Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse"
              style={{ fontFamily: RB }}
            >
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 pl-6">Visit ID</th>
                  <th className="py-3.5 px-4">Visit Date</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Doctor</th>
                  <th className="py-3.5 px-4">Chief Complaint</th>
                  <th className="py-3.5 px-4">Diagnosis</th>
                  <th className="py-3.5 px-4">Rx Issued</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVisits.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-slate-400"
                    >
                      No OPD visit records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredVisits.map((visit) => (
                    <tr
                      key={visit.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="py-4 px-4 pl-6 font-mono text-xs font-semibold text-[#0D47A1]">
                        {visit.id}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#111827]">
                          {visit.visitDate}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {visit.visitTime}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                        {visit.department}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-[#111827] flex items-center gap-1.5">
                          <Stethoscope size={13} className="text-[#0D47A1]" />
                          {visit.doctor}
                        </div>
                      </td>
                      <td
                        className="py-4 px-4 max-w-xs truncate text-slate-600 text-xs"
                        title={visit.chiefComplaint}
                      >
                        {visit.chiefComplaint}
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-50 text-[#009688] border border-teal-100 text-xs font-semibold truncate max-w-[180px]">
                          {visit.diagnosis}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {visit.prescriptionIssued ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            <Pill size={12} /> Yes ({visit.prescriptionCount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-slate-400 bg-slate-100">
                            No Rx
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={visit.status} />
                      </td>
                      <td className="py-4 px-4 pr-6 text-right whitespace-nowrap relative">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSummaryVisit(visit)}
                            title="View Consultation Summary"
                            className="p-1.5 rounded-lg border border-gray-200 bg-white text-slate-600 hover:text-[#0D47A1] hover:border-[#0D47A1] transition-colors"
                          >
                            <FileText size={14} />
                          </button>
                          {visit.prescriptionIssued && (
                            <button
                              onClick={() => setPrescriptionVisit(visit)}
                              title="View Prescription"
                              className="p-1.5 rounded-lg border border-gray-200 bg-white text-slate-600 hover:text-[#009688] hover:border-[#009688] transition-colors"
                            >
                              <Pill size={14} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              showToast(
                                `Printing Visit Summary for ${visit.id}...`,
                              )
                            }
                            title="Print Visit Summary"
                            className="p-1.5 rounded-lg border border-gray-200 bg-white text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Printer size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-[#111827]">1</span> to{" "}
              <span className="font-semibold text-[#111827]">
                {filteredVisits.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#111827]">
                {MOCK_VISIT_HISTORY.length}
              </span>{" "}
              visits
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#0D47A1] text-white font-semibold flex items-center justify-center shadow-sm">
                1
              </button>
              <button
                disabled
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Visits Timeline Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Recent Visits Timeline
              </h3>
              <p
                className="text-xs text-slate-500 mt-0.5"
                style={{ fontFamily: RB }}
              >
                Chronological medical touchpoints for this patient
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0D47A1] bg-blue-50 px-3 py-1 rounded-full">
              {MOCK_VISIT_HISTORY.length} Total Encounters
            </span>
          </div>

          <div className="relative pl-6 space-y-8">
            <div className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-gray-200" />
            {MOCK_VISIT_HISTORY.map((visit, index) => (
              <div
                key={visit.id}
                className="relative flex items-start gap-4 group"
              >
                {/* Milestone Dot */}
                <div
                  className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 ring-[#F1F5F9] ${index === 0 ? "bg-[#0D47A1]" : "bg-[#009688]"
                    }`}
                />

                <div className="flex-1 bg-slate-50/70 hover:bg-slate-50 p-4 rounded-xl border border-gray-100 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#111827]">
                        {visit.visitDate}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {visit.visitTime}
                      </span>
                      <span className="font-mono text-[10px] font-medium text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">
                        {visit.id}
                      </span>
                    </div>
                    <StatusBadge status={visit.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 mb-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        DOCTOR & DEPT
                      </span>
                      <span className="font-semibold text-[#111827]">
                        {visit.doctor}
                      </span>{" "}
                      ({visit.department})
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        CHIEF COMPLAINT
                      </span>
                      <span className="font-medium text-slate-700">
                        {visit.chiefComplaint}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        DIAGNOSIS
                      </span>
                      <span className="font-semibold text-[#009688]">
                        {visit.diagnosis}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                    {visit.clinicalNotes}
                  </p>

                  {/* Actions Bar */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {visit.prescriptionIssued && (
                        <span className="text-[11px] font-medium text-purple-700 flex items-center gap-1">
                          <Pill size={13} /> {visit.prescriptionCount}{" "}
                          Medication(s) Prescribed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSummaryVisit(visit)}
                        className="text-xs font-semibold text-[#0D47A1] hover:underline"
                      >
                        View Summary
                      </button>
                      {visit.prescriptionIssued && (
                        <>
                          <span className="text-slate-300">•</span>
                          <button
                            onClick={() => setPrescriptionVisit(visit)}
                            className="text-xs font-semibold text-[#009688] hover:underline"
                          >
                            View Rx
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal: View Consultation Summary ── */}
      {summaryVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#009688] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} />
                <div>
                  <h3
                    className="text-base font-bold"
                    style={{ fontFamily: PP }}
                  >
                    OPD Consultation Summary
                  </h3>
                  <div className="text-xs text-teal-100">
                    Visit Ref: {summaryVisit.id}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSummaryVisit(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
              style={{ fontFamily: RB }}
            >
              {/* Visit Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-gray-100 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Date & Time</div>
                  <div className="font-bold text-[#111827] mt-0.5">
                    {summaryVisit.visitDate}
                  </div>
                  <div className="text-slate-500">{summaryVisit.visitTime}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">
                    Attending Doctor
                  </div>
                  <div className="font-bold text-[#0D47A1] mt-0.5">
                    {summaryVisit.doctor}
                  </div>
                  <div className="text-slate-500">
                    {summaryVisit.department}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Status</div>
                  <div className="mt-1">
                    <StatusBadge status={summaryVisit.status} />
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Patient</div>
                  <div className="font-bold text-[#111827] mt-0.5">
                    Sarah Mitchell
                  </div>
                  <div className="text-slate-500">PT-2024-006</div>
                </div>
              </div>

              {/* Vitals Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Vitals Recorded
                </h4>
                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100">
                    <span className="text-slate-400 block text-[10px]">
                      BLOOD PRESSURE
                    </span>
                    <span className="font-bold text-[#111827]">
                      {summaryVisit.vitals.bp}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100">
                    <span className="text-slate-400 block text-[10px]">
                      HEART RATE
                    </span>
                    <span className="font-bold text-[#111827]">
                      {summaryVisit.vitals.hr}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100">
                    <span className="text-slate-400 block text-[10px]">
                      TEMP
                    </span>
                    <span className="font-bold text-[#111827]">
                      {summaryVisit.vitals.temp}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100">
                    <span className="text-slate-400 block text-[10px]">
                      SPO2
                    </span>
                    <span className="font-bold text-[#111827]">
                      {summaryVisit.vitals.spo2}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Chief Complaint
                </h4>
                <div className="text-sm font-semibold text-[#111827] bg-slate-50 p-3 rounded-xl border border-gray-100">
                  {summaryVisit.chiefComplaint}
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Diagnosis
                </h4>
                <div className="text-sm font-bold text-[#009688] bg-teal-50 p-3 rounded-xl border border-teal-100">
                  {summaryVisit.diagnosis}
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Clinical Notes & Remarks
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                  {summaryVisit.clinicalNotes}
                </p>
              </div>

              {/* Prescriptions Brief */}
              {summaryVisit.prescriptionIssued && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Prescribed Medications
                  </h4>
                  <div className="space-y-1.5">
                    {summaryVisit.prescriptions.map(
                      (med: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-slate-800"
                        >
                          <Pill
                            size={14}
                            className="text-purple-600 shrink-0"
                          />
                          <span>{med}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  showToast(
                    `Printed Consultation Summary for ${summaryVisit.id}`,
                  );
                  setSummaryVisit(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Printer size={14} /> Print Summary
              </button>
              <button
                onClick={() => setSummaryVisit(null)}
                className="px-4 py-2 rounded-lg bg-[#0D47A1] text-white text-xs font-medium hover:bg-[#0c3d8a] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: View Prescription Details ── */}
      {prescriptionVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#009688] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Pill size={20} />
                <div>
                  <h3
                    className="text-base font-bold"
                    style={{ fontFamily: PP }}
                  >
                    OPD Prescription
                  </h3>
                  <div className="text-xs text-teal-100">
                    Rx Ref: {prescriptionVisit.id}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPrescriptionVisit(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5" style={{ fontFamily: RB }}>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 text-xs">
                <div>
                  <span className="text-slate-400 block">PATIENT</span>
                  <span className="font-bold text-[#111827]">
                    Sarah Mitchell (PT-2024-006)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">
                    PRESCRIBING DOCTOR
                  </span>
                  <span className="font-bold text-[#0D47A1]">
                    {prescriptionVisit.doctor}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Prescribed Medications
                </h4>
                <div className="space-y-2.5">
                  {prescriptionVisit.prescriptions.map(
                    (med: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-3"
                      >
                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-purple-950">
                            {med}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Take strictly after meals as advised.
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800">
                <span className="font-bold">Instructions:</span> Finish
                prescribed course. Contact hospital helpline if adverse
                reactions occur.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  showToast(`Prescription printed for ${prescriptionVisit.id}`);
                  setPrescriptionVisit(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Printer size={14} /> Print Rx
              </button>
              <button
                onClick={() => setPrescriptionVisit(null)}
                className="px-4 py-2 rounded-lg bg-[#009688] text-white text-xs font-medium hover:bg-[#00796b] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
