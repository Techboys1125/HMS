import { useState } from "react";
import {
  Search,
  Download,
  ChevronRight,
  Eye,
  X,
  Activity,
  Calendar,
  Pill,
  Printer,
  CheckCircle2,
} from "lucide-react";
import type { PatientPrescriptionItem } from "../types/patient.types";
import { PP, RB } from "../constants/patient.mock";

export function PatientPrescriptionsScreen({
  onViewDetails,
}: {
  onViewDetails?: (rxId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState("All");
  const [selectedPrescription, setSelectedPrescription] =
    useState<PatientPrescriptionItem | null>(null);
  const [printModalPrescription, setPrintModalPrescription] =
    useState<PatientPrescriptionItem | null>(null);
  const [fullViewPrescription, setFullViewPrescription] =
    useState<PatientPrescriptionItem | null>(null);
  const [isLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Patient Mock Prescriptions Data (Only Patient's Own Prescriptions)
  const patientPrescriptionsData: PatientPrescriptionItem[] = [
    {
      id: "RX-2026-0891",
      consultationId: "CNS-1001",
      consultationDate: "24 Jul 2026",
      doctorName: "Dr. Arjun Mehta",
      department: "Cardiology",
      diagnosisSummary: "Angina Pectoris, unspecified (ICD: I20.9)",
      followupDate: "31 Jul 2026",
      status: "Issued",
      medicines: [
        {
          name: "Amlodipine",
          strength: "5mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Once Daily (OD)",
          duration: "30 Days",
          instructions: "Take after breakfast",
        },
        {
          name: "Metformin",
          strength: "500mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Twice Daily (BD)",
          duration: "30 Days",
          instructions: "Take with morning & evening meals",
        },
        {
          name: "Atorvastatin",
          strength: "20mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Once Nightly (HS)",
          duration: "30 Days",
          instructions: "Take before sleeping",
        },
        {
          name: "Aspirin",
          strength: "75mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Once Daily (OD)",
          duration: "30 Days",
          instructions: "Take after lunch",
        },
      ],
    },
    {
      id: "RX-2026-0412",
      consultationId: "CNS-0842",
      consultationDate: "10 Apr 2026",
      doctorName: "Dr. Arjun Mehta",
      department: "Cardiology",
      diagnosisSummary: "Essential (primary) hypertension (ICD: I10)",
      followupDate: "10 Jul 2026",
      status: "Completed",
      medicines: [
        {
          name: "Amlodipine",
          strength: "5mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Once Daily (OD)",
          duration: "90 Days",
          instructions: "Take after breakfast",
        },
        {
          name: "Metformin",
          strength: "500mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Twice Daily (BD)",
          duration: "90 Days",
          instructions: "Take with meals",
        },
        {
          name: "Atorvastatin",
          strength: "10mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Once Nightly (HS)",
          duration: "90 Days",
          instructions: "Take at bedtime",
        },
      ],
    },
    {
      id: "RX-2025-1108",
      consultationId: "CNS-0512",
      consultationDate: "15 Nov 2025",
      doctorName: "Dr. Priya Sharma",
      department: "General Medicine",
      diagnosisSummary:
        "Type 2 diabetes mellitus without complications (ICD: E11.9)",
      followupDate: "15 Feb 2026",
      status: "Completed",
      medicines: [
        {
          name: "Metformin",
          strength: "500mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Twice Daily (BD)",
          duration: "90 Days",
          instructions: "Take immediately with meals",
        },
        {
          name: "Amlodipine",
          strength: "2.5mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "Once Daily (OD)",
          duration: "90 Days",
          instructions: "Take after breakfast",
        },
      ],
    },
    {
      id: "RX-2024-0210",
      consultationId: "CNS-0105",
      consultationDate: "14 Feb 2024",
      doctorName: "Dr. Priya Sharma",
      department: "General Medicine",
      diagnosisSummary: "Acute upper respiratory infection (ICD: J06.9)",
      followupDate: "21 Feb 2024",
      status: "Archived",
      medicines: [
        {
          name: "Amoxicillin",
          strength: "500mg",
          route: "Oral",
          dosage: "1 Capsule",
          frequency: "Thrice Daily (TDS)",
          duration: "7 Days",
          instructions: "Complete full course",
        },
        {
          name: "Paracetamol",
          strength: "650mg",
          route: "Oral",
          dosage: "1 Tablet",
          frequency: "PRN fever",
          duration: "5 Days",
          instructions: "Take as needed for fever",
        },
      ],
    },
  ];

  // Search & Filter Logic
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedDateRange("All");
  };

  const filteredPrescriptions = patientPrescriptionsData.filter((rx) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      rx.id.toLowerCase().includes(query) ||
      rx.doctorName.toLowerCase().includes(query) ||
      rx.department.toLowerCase().includes(query) ||
      rx.diagnosisSummary.toLowerCase().includes(query) ||
      rx.medicines.some((m) => m.name.toLowerCase().includes(query));

    const matchesStatus =
      selectedStatus === "All" || rx.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalPrescriptionsCount = patientPrescriptionsData.length;
  const recentPrescriptionsCount = patientPrescriptionsData.filter(
    (r) => r.status === "Issued",
  ).length;
  const upcomingFollowupsCount = patientPrescriptionsData.filter(
    (r) => r.followupDate && new Date(r.followupDate) >= new Date("2026-07-24"),
  ).length;
  const downloadedCount = 3; // Mock metric

  // Helper for Status Chips
  const renderStatusChip = (status: "Issued" | "Completed" | "Archived") => {
    switch (status) {
      case "Issued":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
            Issued
          </span>
        );
      case "Completed":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
            Completed
          </span>
        );
      case "Archived":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Archived
          </span>
        );
    }
  };

  return (
    <div
      className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20"
      style={{ fontFamily: RB }}
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. BREADCRUMB & PAGE HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div
              className="flex items-center gap-2 text-xs text-[#64748B] mb-1"
              style={{ fontFamily: RB }}
            >
              <span>Patient Portal</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">
                My Prescriptions
              </span>
            </div>
            <h1
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              My Prescriptions
            </h1>
            <p
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              View and download prescriptions issued by your doctors during your
              visits.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ── 2. KPI CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div
                className="text-xs text-[#64748B] font-medium"
                style={{ fontFamily: RB }}
              >
                Total Prescriptions
              </div>
              <div
                className="text-2xl font-bold text-[#111827] mt-0.5"
                style={{ fontFamily: PP }}
              >
                {totalPrescriptionsCount}
              </div>
              <div
                className="text-[11px] text-[#0D47A1] font-medium mt-1"
                style={{ fontFamily: RB }}
              >
                Lifetime issued prescriptions
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
              <Pill size={20} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div
                className="text-xs text-[#64748B] font-medium"
                style={{ fontFamily: RB }}
              >
                Active Prescriptions
              </div>
              <div
                className="text-2xl font-bold text-[#009688] mt-0.5"
                style={{ fontFamily: PP }}
              >
                {recentPrescriptionsCount}
              </div>
              <div
                className="text-[11px] text-[#009688] font-medium mt-1"
                style={{ fontFamily: RB }}
              >
                Currently active medications
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
              <Activity size={20} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div
                className="text-xs text-[#64748B] font-medium"
                style={{ fontFamily: RB }}
              >
                Upcoming Follow-ups
              </div>
              <div
                className="text-2xl font-bold text-amber-600 mt-0.5"
                style={{ fontFamily: PP }}
              >
                {upcomingFollowupsCount}
              </div>
              <div
                className="text-[11px] text-amber-600 font-medium mt-1"
                style={{ fontFamily: RB }}
              >
                Scheduled doctor reviews
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div
                className="text-xs text-[#64748B] font-medium"
                style={{ fontFamily: RB }}
              >
                Downloaded PDF Reports
              </div>
              <div
                className="text-2xl font-bold text-slate-700 mt-0.5"
                style={{ fontFamily: PP }}
              >
                {downloadedCount}
              </div>
              <div
                className="text-[11px] text-slate-500 font-medium mt-1"
                style={{ fontFamily: RB }}
              >
                Exported document copies
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Download size={20} />
            </div>
          </div>
        </div>

        {/* ── 3. SEARCH & FILTER BAR ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider"
              style={{ fontFamily: PP }}
            >
              Search &amp; Filter My Prescriptions
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#0D47A1] font-semibold hover:underline"
              style={{ fontFamily: PP }}
            >
              Reset Filters
            </button>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs"
            style={{ fontFamily: RB }}
          >
            <div className="col-span-1 sm:col-span-2">
              <label
                className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                style={{ fontFamily: PP }}
              >
                Search Keywords
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-2.5 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Rx ID, Doctor, Department, or Medicine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <div>
              <label
                className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                style={{ fontFamily: PP }}
              >
                Prescription Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Issued">Issued</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label
                className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                style={{ fontFamily: PP }}
              >
                Date Range
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
              >
                <option value="All">All Time</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last 1 Year">Last 1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── 4. PRESCRIPTIONS ENTERPRISE TABLE / CARD GRID ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Prescription Records ({filteredPrescriptions.length})
              </h3>
            </div>
          </div>

          {isLoading ? (
            /* Loading Skeleton */
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse flex items-center justify-between py-3 border-b border-gray-100"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/6" />
                </div>
              ))}
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <Pill size={40} className="mx-auto text-slate-300 mb-3" />
              <h4
                className="text-base font-bold text-slate-700"
                style={{ fontFamily: PP }}
              >
                No prescriptions available
              </h4>
              <p
                className="text-xs text-slate-500 mt-1 max-w-sm mx-auto"
                style={{ fontFamily: RB }}
              >
                You have no prescription records matching your current filter
                criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table
                  className="w-full text-left border-collapse text-xs"
                  style={{ fontFamily: RB }}
                >
                  <thead>
                    <tr
                      className="bg-slate-50 border-b border-gray-200 text-[10px] font-bold text-slate-500 uppercase"
                      style={{ fontFamily: PP }}
                    >
                      <th className="p-3">Prescription ID</th>
                      <th className="p-3">Consultation Date</th>
                      <th className="p-3">Prescribing Doctor</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Medicines</th>
                      <th className="p-3">Follow-up Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPrescriptions.map((rx) => (
                      <tr
                        key={rx.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="p-3 font-mono font-bold text-[#0D47A1]">
                          <button
                            onClick={() => setSelectedPrescription(rx)}
                            className="hover:underline text-left"
                          >
                            {rx.id}
                          </button>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">
                          {rx.consultationDate}
                        </td>
                        <td
                          className="p-3 font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {rx.doctorName}
                        </td>
                        <td className="p-3 text-slate-600">{rx.department}</td>
                        <td className="p-3 font-semibold text-[#009688]">
                          {rx.medicines.length} Medication
                          {rx.medicines.length > 1 ? "s" : ""}
                        </td>
                        <td className="p-3 text-slate-700 font-medium">
                          {rx.followupDate}
                        </td>
                        <td className="p-3">{renderStatusChip(rx.status)}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (onViewDetails) {
                                  onViewDetails(rx.id);
                                } else {
                                  setSelectedPrescription(rx);
                                }
                              }}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                              style={{ fontFamily: PP }}
                              title="View Details"
                            >
                              <Eye size={13} /> View
                            </button>
                            <button
                              onClick={() => setPrintModalPrescription(rx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Print Prescription"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              onClick={() =>
                                triggerToast(`Downloaded PDF for ${rx.id}`)
                              }
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden divide-y divide-gray-100">
                {filteredPrescriptions.map((rx) => (
                  <div key={rx.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0D47A1] text-sm">
                        {rx.id}
                      </span>
                      {renderStatusChip(rx.status)}
                    </div>

                    <div
                      className="space-y-1 text-xs"
                      style={{ fontFamily: RB }}
                    >
                      <div
                        className="font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {rx.doctorName} ({rx.department})
                      </div>
                      <div className="text-slate-500">
                        Date: {rx.consultationDate} • Follow-up:{" "}
                        {rx.followupDate}
                      </div>
                      <div className="text-[#009688] font-semibold">
                        {rx.medicines.length} Prescribed Medications
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="px-3 py-1.5 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-lg flex items-center gap-1"
                        style={{ fontFamily: PP }}
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => setPrintModalPrescription(rx)}
                        className="px-3 py-1.5 bg-teal-50 text-[#009688] text-xs font-semibold rounded-lg flex items-center gap-1"
                        style={{ fontFamily: PP }}
                      >
                        <Printer size={13} /> Print
                      </button>
                      <button
                        onClick={() =>
                          triggerToast(`Downloaded PDF for ${rx.id}`)
                        }
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                        style={{ fontFamily: PP }}
                      >
                        <Download size={13} /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 5. RIGHT SLIDE-OVER DRAWER (Quick Preview) ── */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className="text-base font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Prescription Quick Preview
                  </h3>
                  {renderStatusChip(selectedPrescription.status)}
                </div>
                <span className="font-mono text-xs font-bold text-[#0D47A1]">
                  {selectedPrescription.id}
                </span>
              </div>

              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div
              className="p-5 space-y-5 overflow-y-auto flex-1 text-xs"
              style={{ fontFamily: RB }}
            >
              {/* Doctor & Dept */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Prescribing Doctor
                  </span>
                  <span
                    className="font-bold text-[#111827] text-sm"
                    style={{ fontFamily: PP }}
                  >
                    {selectedPrescription.doctorName}
                  </span>
                  <span className="text-[#0D47A1] block font-medium">
                    {selectedPrescription.department}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Consultation Date
                  </span>
                  <span className="font-medium text-slate-700">
                    {selectedPrescription.consultationDate}
                  </span>
                </div>
              </div>

              {/* Diagnosis Summary */}
              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Diagnosis Summary
                </span>
                <p className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-slate-800 font-medium">
                  {selectedPrescription.diagnosisSummary}
                </p>
              </div>

              {/* Medicines List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-bold text-[#009688] uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Prescribed Medicines (
                    {selectedPrescription.medicines.length})
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedPrescription.medicines.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-gray-100 space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className="font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {m.name} {m.strength}
                        </span>
                        <span className="font-mono text-[10px] bg-blue-100 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                          {m.route}
                        </span>
                      </div>
                      <div className="text-slate-600 flex justify-between">
                        <span>Dosage: {m.dosage}</span>
                        <span className="font-semibold text-[#0D47A1]">
                          {m.frequency}
                        </span>
                      </div>
                      <div className="text-slate-500 italic text-[11px] pt-1 border-t border-gray-100">
                        Instruction: {m.instructions} ({m.duration})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Followup Date */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                <span
                  className="text-[10px] font-bold text-amber-800 uppercase"
                  style={{ fontFamily: PP }}
                >
                  Follow-up Review Date
                </span>
                <span className="font-bold text-amber-900">
                  {selectedPrescription.followupDate}
                </span>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-gray-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setFullViewPrescription(selectedPrescription);
                  setSelectedPrescription(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Eye size={14} /> View Full
              </button>
              <button
                onClick={() =>
                  triggerToast(`Downloaded PDF for ${selectedPrescription.id}`)
                }
                className="px-3.5 py-2 rounded-xl border border-[#0D47A1] text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Download size={14} /> PDF
              </button>
              <button
                onClick={() => {
                  setPrintModalPrescription(selectedPrescription);
                  setSelectedPrescription(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. PRINT PREVIEW MODAL ── */}
      {printModalPrescription && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Print Prescription Document
              </h3>
              <button
                onClick={() => setPrintModalPrescription(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div
              className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3 text-xs"
              style={{ fontFamily: RB }}
            >
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span
                  className="font-bold text-[#0D47A1]"
                  style={{ fontFamily: PP }}
                >
                  HMS Medical Center
                </span>
                <span className="font-mono text-slate-500">
                  {printModalPrescription.id}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong>Doctor:</strong> {printModalPrescription.doctorName}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {printModalPrescription.consultationDate}
                </div>
              </div>
              <div>
                <strong>Diagnosis:</strong>{" "}
                {printModalPrescription.diagnosisSummary}
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold mb-1">
                  Medicines ({printModalPrescription.medicines.length}):
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {printModalPrescription.medicines.map((m, idx) => (
                    <li key={idx}>
                      {m.name} {m.strength} — {m.frequency} ({m.instructions})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintModalPrescription(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                style={{ fontFamily: RB }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPrintModalPrescription(null);
                  triggerToast(
                    `Prescription ${printModalPrescription.id} sent to printer`,
                  );
                  window.print();
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
                style={{ fontFamily: PP }}
              >
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. FULL READ-ONLY VIEW MODAL ── */}
      {fullViewPrescription && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <h3
                  className="text-lg font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Full Prescription Details
                </h3>
                {renderStatusChip(fullViewPrescription.status)}
              </div>
              <button
                onClick={() => setFullViewPrescription(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="p-5 bg-slate-50 rounded-xl border border-gray-200 space-y-4 text-xs"
              style={{ fontFamily: RB }}
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Hospital
                  </span>
                  <span className="font-bold text-[#0D47A1] text-sm">
                    HMS Hospital &amp; Medical Research Center
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Prescription ID
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {fullViewPrescription.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Attending Doctor
                  </span>
                  <span className="font-bold text-[#111827]">
                    {fullViewPrescription.doctorName}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {fullViewPrescription.department}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Consultation ID
                  </span>
                  <span className="font-mono font-medium text-slate-700">
                    {fullViewPrescription.consultationId}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase block"
                    style={{ fontFamily: PP }}
                  >
                    Date
                  </span>
                  <span className="font-medium text-slate-700">
                    {fullViewPrescription.consultationDate}
                  </span>
                </div>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-slate-400 uppercase block mb-1"
                  style={{ fontFamily: PP }}
                >
                  Clinical Diagnosis
                </span>
                <p className="p-2.5 bg-white rounded-lg border border-gray-200 text-slate-800 font-medium">
                  {fullViewPrescription.diagnosisSummary}
                </p>
              </div>

              <div>
                <span
                  className="text-[10px] font-bold text-[#009688] uppercase block mb-2"
                  style={{ fontFamily: PP }}
                >
                  Prescribed Medications (
                  {fullViewPrescription.medicines.length})
                </span>
                <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-gray-200">
                  <thead>
                    <tr
                      className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase border-b border-gray-200"
                      style={{ fontFamily: PP }}
                    >
                      <th className="p-2">Medicine</th>
                      <th className="p-2">Route</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fullViewPrescription.medicines.map((m, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold text-[#111827]">
                          {m.name} {m.strength}
                        </td>
                        <td className="p-2 text-slate-600">{m.route}</td>
                        <td className="p-2 text-slate-700">{m.dosage}</td>
                        <td className="p-2 font-semibold text-[#0D47A1]">
                          {m.frequency}
                        </td>
                        <td className="p-2 text-slate-600">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex justify-between items-center">
                <span
                  className="text-[10px] font-bold text-amber-800 uppercase"
                  style={{ fontFamily: PP }}
                >
                  Next Follow-up Review
                </span>
                <span className="font-bold text-amber-900">
                  {fullViewPrescription.followupDate}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFullViewPrescription(null)}
                className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-slate-700 hover:bg-slate-50"
                style={{ fontFamily: PP }}
              >
                Close
              </button>
              <button
                onClick={() =>
                  triggerToast(`Downloaded PDF for ${fullViewPrescription.id}`)
                }
                className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
                style={{ fontFamily: PP }}
              >
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
