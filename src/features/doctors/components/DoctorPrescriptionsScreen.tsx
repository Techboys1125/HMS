import { useState } from "react";
import {
  ChevronRight,
  Plus,
  Search,
  Pill,
  TrendingUp,
  Clock,
  Download,
  Eye,
  Edit3,
  Printer,
  ChevronDown,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";
import type { PrescriptionRecord, RxStatus } from "../types/doctors.types";
import { MY_PRESCRIPTIONS_DATA, PP, RB } from "../constants/doctors.constants";
import { Card } from "./Card";
import { Avatar } from "./Avatar";

export function DoctorPrescriptionsScreen({
  onNewPrescription,
  onViewPrescription,
  onEditPrescription,
  onPrintPreview,
  onViewHistory,
  onViewConsultation,
}: {
  onNewPrescription?: () => void;
  onViewPrescription?: (rxId: string) => void;
  onEditPrescription?: (rxId: string) => void;
  onPrintPreview?: (rxId: string) => void;
  onViewHistory?: (mrn: string) => void;
  onViewConsultation?: (consultId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [selectedRow, setSelectedRow] = useState<PrescriptionRecord | null>(
    null,
  );
  const [openMoreMenuId, setOpenMoreMenuId] = useState<string | null>(null);
  const [printModalRx, setPrintModalRx] = useState<PrescriptionRecord | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDept("All");
    setSelectedStatus("All");
    setDateRange("All");
  };

  const filteredData = MY_PRESCRIPTIONS_DATA.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.consultationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDept === "All" || item.department === selectedDept;
    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const renderStatusChip = (status: RxStatus) => {
    switch (status) {
      case "Draft":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Draft
          </span>
        );
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
      case "Cancelled":
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200"
            style={{ fontFamily: PP }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Cancelled
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
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9] relative">
      {toastMsg && (
        <div
          className="fixed bottom-5 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce"
          style={{ fontFamily: RB }}
        >
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      <div
        className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium"
        style={{ fontFamily: RB }}
      >
        <span className="hover:text-[#0D47A1] cursor-pointer">Doctor</span>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="hover:text-[#0D47A1] cursor-pointer">
          Prescriptions
        </span>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-[#111827] font-semibold">My Prescriptions</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
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
            View, search, print and manage prescriptions issued during
            consultations.
          </p>
        </div>
        <button
          onClick={onNewPrescription}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm shrink-0"
          style={{ fontFamily: PP }}
        >
          <Plus size={15} /> + New Prescription
        </button>
      </div>

      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="md:col-span-2 relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Prescription ID, Patient Name, MRN, or Consultation ID…"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-[#111827]"
              style={{ fontFamily: RB }}
            />
          </div>
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white text-slate-700 font-medium"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white text-slate-700 font-medium"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Issued">Issued</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span
              className="text-xs text-slate-400 font-medium"
              style={{ fontFamily: RB }}
            >
              Date Range:
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-gray-200 rounded-lg outline-none text-slate-600 font-medium"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              style={{ fontFamily: RB }}
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 300);
              }}
              className="px-4 py-1.5 text-xs bg-[#0D47A1] text-white rounded-lg font-semibold hover:bg-[#0c3d8a] transition-colors"
              style={{ fontFamily: PP }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Today's Prescriptions",
            count: "14",
            trend: "+12% vs yesterday",
            isUp: true,
            Icon: Pill,
            color: "#0D47A1",
          },
          {
            title: "Issued Prescriptions",
            count: "184",
            trend: "92% completed",
            isUp: true,
            Icon: CheckCircle2,
            color: "#009688",
          },
          {
            title: "Follow-up Cases",
            count: "42",
            trend: "+4 scheduled this wk",
            isUp: true,
            Icon: Clock,
            color: "#F59E0B",
          },
          {
            title: "Recently Printed",
            count: "28",
            trend: "100% digital sync",
            isUp: true,
            Icon: Download,
            color: "#66BB6A",
          },
        ].map((kpi, idx) => (
          <Card key={idx} className="p-4 flex items-center justify-between">
            <div>
              <div
                className="text-xs font-semibold text-slate-500 mb-1"
                style={{ fontFamily: PP }}
              >
                {kpi.title}
              </div>
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {kpi.count}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1"
                style={{ fontFamily: RB }}
              >
                <TrendingUp size={12} /> {kpi.trend}
              </div>
            </div>
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${kpi.color}15` }}
            >
              <kpi.Icon size={20} style={{ color: kpi.color }} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <div>
            <h2
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Prescription Records
            </h2>
            <p className="text-xs text-slate-500" style={{ fontFamily: RB }}>
              Showing {filteredData.length} prescriptions issued by Dr. Arjun
              Mehta
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400" style={{ fontFamily: RB }}>
              Strict Doctor Scoped View
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="bg-slate-50/80 border-b border-gray-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider sticky top-0"
                style={{ fontFamily: PP }}
              >
                <th className="px-5 py-3.5">Prescription ID</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">MRN</th>
                <th className="px-5 py-3.5">Consultation ID</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Consultation Date</th>
                <th className="px-5 py-3.5">Medicines</th>
                <th className="px-5 py-3.5">Follow-up</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y divide-gray-100 text-xs text-[#111827]"
              style={{ fontFamily: RB }}
            >
              {isLoading ? (
                [1, 2, 3, 4].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan={10} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <Pill size={22} />
                      </div>
                      <div
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        No Prescriptions Found
                      </div>
                      <p
                        className="text-xs text-slate-500 max-w-xs mt-1"
                        style={{ fontFamily: RB }}
                      >
                        No prescription records match your current filter
                        criteria or search query.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                        style={{ fontFamily: PP }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((rx) => (
                  <tr
                    key={rx.id}
                    onClick={() => setSelectedRow(rx)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-[#0D47A1] whitespace-nowrap">
                      {rx.id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#111827] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar name={rx.patientName} size="sm" />
                        <span>{rx.patientName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {rx.mrn}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewConsultation?.(rx.consultationId);
                        }}
                        className="hover:underline hover:text-[#0D47A1]"
                      >
                        {rx.consultationId}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {rx.department}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {rx.consultationDate}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        <Pill size={12} className="text-[#009688]" />
                        {rx.medicineCount} Medicines
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {rx.followup ? (
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          Yes ({rx.followupDate})
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {renderStatusChip(rx.status)}
                    </td>
                    <td
                      className="px-5 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewPrescription?.(rx.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                          title="View Full Prescription"
                        >
                          <Eye size={14} />
                        </button>
                        {rx.status === "Draft" ? (
                          <button
                            onClick={() => onEditPrescription?.(rx.id)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit Draft Prescription"
                          >
                            <Edit3 size={14} />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="p-1.5 text-slate-300 cursor-not-allowed"
                            title="Only Draft prescriptions can be edited"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (onPrintPreview) {
                              onPrintPreview(rx.id);
                            } else {
                              setPrintModalRx(rx);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Print Prescription"
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          onClick={() =>
                            showToast(`Downloaded PDF for ${rx.id}`)
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                          title="Download PDF"
                        >
                          <Download size={14} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMoreMenuId(
                                openMoreMenuId === rx.id ? null : rx.id,
                              )
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <ChevronDown size={14} />
                          </button>
                          {openMoreMenuId === rx.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 text-left">
                              <button
                                onClick={() => {
                                  setOpenMoreMenuId(null);
                                  showToast(`Duplicated prescription ${rx.id}`);
                                }}
                                className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <Plus size={13} /> Duplicate Prescription
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMoreMenuId(null);
                                  onViewHistory?.(rx.mrn);
                                }}
                                className="w-full px-3 py-2 text-xs text-[#0D47A1] hover:bg-blue-50 flex items-center gap-2 font-medium"
                              >
                                <Clock size={13} /> Prescription History
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMoreMenuId(null);
                                  onViewConsultation?.(rx.consultationId);
                                }}
                                className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <FileText size={13} /> View Consultation
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-slate-50/50 text-xs text-slate-500"
          style={{ fontFamily: RB }}
        >
          <div>
            Showing 1 to {filteredData.length} of {filteredData.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-2.5 py-1 rounded-md border border-gray-200 text-slate-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-2.5 py-1 rounded-md bg-[#0D47A1] text-white font-semibold">
              1
            </button>
            <button
              disabled
              className="px-2.5 py-1 rounded-md border border-gray-200 text-slate-400 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {selectedRow && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div
                  className="text-xs font-bold text-[#0D47A1] uppercase tracking-wide"
                  style={{ fontFamily: PP }}
                >
                  Prescription Summary
                </div>
                <h2
                  className="text-lg font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {selectedRow.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRow(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs text-slate-500 font-medium"
                    style={{ fontFamily: RB }}
                  >
                    Patient Name
                  </span>
                  <span
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {selectedRow.patientName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs text-slate-500 font-medium"
                    style={{ fontFamily: RB }}
                  >
                    MRN
                  </span>
                  <span
                    className="text-xs font-mono font-semibold text-[#0D47A1]"
                    style={{ fontFamily: RB }}
                  >
                    {selectedRow.mrn}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs text-slate-500 font-medium"
                    style={{ fontFamily: RB }}
                  >
                    Attending Doctor
                  </span>
                  <span
                    className="text-xs font-semibold text-slate-800"
                    style={{ fontFamily: RB }}
                  >
                    {selectedRow.doctorName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs text-slate-500 font-medium"
                    style={{ fontFamily: RB }}
                  >
                    Department
                  </span>
                  <span
                    className="text-xs text-slate-700"
                    style={{ fontFamily: RB }}
                  >
                    {selectedRow.department}
                  </span>
                </div>
              </div>

              <div>
                <div
                  className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2"
                  style={{ fontFamily: PP }}
                >
                  Clinical Diagnosis
                </div>
                <div
                  className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-800 font-medium"
                  style={{ fontFamily: RB }}
                >
                  {selectedRow.diagnosis}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold text-slate-400 uppercase tracking-wide"
                    style={{ fontFamily: PP }}
                  >
                    Prescribed Medicines ({selectedRow.medicineCount})
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedRow.medicinesList.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div
                          className="font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {m.name}{" "}
                          <span className="font-normal text-slate-500">
                            ({m.dose})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {m.freq}
                        </div>
                      </div>
                      <Pill size={14} className="text-[#009688]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                  <div
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Follow-up Date
                  </div>
                  <div
                    className="text-xs font-bold text-[#111827] mt-0.5"
                    style={{ fontFamily: RB }}
                  >
                    {selectedRow.followupDate || "Not required"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                  <div
                    className="text-[10px] font-bold text-slate-400 uppercase"
                    style={{ fontFamily: PP }}
                  >
                    Prescription Status
                  </div>
                  <div className="mt-1">
                    {renderStatusChip(selectedRow.status)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-slate-50 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedRow(null);
                  onViewPrescription?.(selectedRow.id);
                }}
                className="flex-1 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors"
                style={{ fontFamily: PP }}
              >
                View Full Prescription
              </button>
              <button
                onClick={() => setPrintModalRx(selectedRow)}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
                style={{ fontFamily: RB }}
              >
                <Printer size={14} />
              </button>
              <button
                onClick={() =>
                  showToast(`Downloaded PDF for ${selectedRow.id}`)
                }
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
                style={{ fontFamily: RB }}
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {printModalRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-[#0D47A1]" />
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Print Prescription Preview
                </h3>
              </div>
              <button
                onClick={() => setPrintModalRx(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="p-4 bg-slate-50 rounded-xl border border-gray-200 mb-5 text-xs text-slate-700 space-y-3"
              style={{ fontFamily: RB }}
            >
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-[#0D47A1]">
                  HMS Hospital & Research Center
                </span>
                <span className="font-mono text-slate-500">
                  {printModalRx.id}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong>Patient:</strong> {printModalRx.patientName}
                </div>
                <div>
                  <strong>MRN:</strong> {printModalRx.mrn}
                </div>
                <div>
                  <strong>Doctor:</strong> {printModalRx.doctorName}
                </div>
                <div>
                  <strong>Date:</strong> {printModalRx.consultationDate}
                </div>
              </div>
              <div>
                <strong>Diagnosis:</strong> {printModalRx.diagnosis}
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold mb-1">Medicines Rx:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {printModalRx.medicinesList.map((m, i) => (
                    <li key={i}>
                      {m.name} {m.dose} — {m.freq}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPrintModalRx(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                style={{ fontFamily: RB }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPrintModalRx(null);
                  showToast(`Prescription ${printModalRx.id} sent to printer`);
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
    </div>
  );
}
