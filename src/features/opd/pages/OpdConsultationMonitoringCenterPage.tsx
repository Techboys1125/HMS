import { useState, useMemo } from "react";
import {
  Users,
  Clock,
  Eye,
  Building2,
  UserCheck,
  BarChart2,
} from "lucide-react";
import type { ConsultationStatus, VisitType } from "../types/consultation";

// Reusable Components
import { ConsultationHeader } from "../components/ConsultationHeader";
import { ConsultationToolbar } from "../components/ConsultationToolbar";
import { ConsultationTabs } from "../components/ConsultationTabs";
import { ConsultationStatusBadge } from "../components/ConsultationStatusBadge";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface AdminConsultationRecord {
  id: string;
  tokenNo: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  doctor: string;
  department: string;
  appointmentTime: string;
  visitType: VisitType;
  status: ConsultationStatus;
  duration: string;
  chiefComplaint: string;
  opdRoom: string;
  date: string;
}

const FALLBACK_ADMIN_CONSULTATIONS: AdminConsultationRecord[] = [
  {
    id: "CNS-1001",
    tokenNo: "TK-01",
    patientName: "Sarah Mitchell",
    mrn: "MRN-2024-001",
    age: 34,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "09:00 AM",
    visitType: "First Visit",
    status: "In Progress",
    duration: "18 mins (Active)",
    chiefComplaint: "Chest tightness radiating to left shoulder",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1002",
    tokenNo: "TK-02",
    patientName: "James Thornton",
    mrn: "MRN-2024-002",
    age: 67,
    gender: "Male",
    phone: "+1 (555) 345-6789",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "09:30 AM",
    visitType: "Follow-up",
    status: "Waiting",
    duration: "12 mins wait",
    chiefComplaint: "Post-angioplasty routine checkup",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1003",
    tokenNo: "TK-03",
    patientName: "Emma Reyes",
    mrn: "MRN-2024-003",
    age: 28,
    gender: "Female",
    phone: "+1 (555) 456-7890",
    doctor: "Dr. Priya Sharma",
    department: "General Medicine",
    appointmentTime: "10:00 AM",
    visitType: "Walk-In",
    status: "Waiting",
    duration: "5 mins wait",
    chiefComplaint: "Acute palpitation episodes",
    opdRoom: "OPD Room 202",
    date: new Date().toISOString().split("T")[0],
  },
];

export function OpdConsultationMonitoringCenterPage({
  onViewDetails,
  onNavigateReports,
}: {
  onViewDetails?: (consultationId: string) => void;
  onViewHistory?: (patientId?: string) => void;
  onPatientSelect?: (patientId: string) => void;
  onNavigateReports?: () => void;
}) {
  // --- States ---
  const [consultations] = useState<AdminConsultationRecord[]>(
    FALLBACK_ADMIN_CONSULTATIONS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [, setIsLoading] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVisitType, setFilterVisitType] = useState("All");

  // --- Filtering Logic ---
  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      if (activeTab !== "All" && item.status !== activeTab) return false;
      if (filterStatus !== "All" && item.status !== filterStatus) return false;
      if (filterVisitType !== "All" && item.visitType !== filterVisitType)
        return false;
      if (filterDepartment !== "All" && item.department !== filterDepartment)
        return false;
      if (filterDoctor !== "All" && item.doctor !== filterDoctor) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.patientName.toLowerCase().includes(q);
        const matchMrn = item.mrn.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchDoc = item.doctor.toLowerCase().includes(q);
        if (!matchName && !matchMrn && !matchId && !matchDoc) return false;
      }

      return true;
    });
  }, [
    consultations,
    activeTab,
    filterStatus,
    filterVisitType,
    filterDepartment,
    filterDoctor,
    searchQuery,
  ]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDate(new Date().toISOString().split("T")[0]);
    setFilterDoctor("All");
    setFilterDepartment("All");
    setFilterStatus("All");
    setFilterVisitType("All");
    setActiveTab("All");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      All: consultations.length,
      Waiting: consultations.filter((c) => c.status === "Waiting").length,
      "In Progress": consultations.filter((c) => c.status === "In Progress")
        .length,
      Completed: consultations.filter((c) => c.status === "Completed").length,
      "Follow-up Scheduled": consultations.filter(
        (c) => c.status === "Follow-up Scheduled",
      ).length,
      Cancelled: consultations.filter((c) => c.status === "Cancelled").length,
    };
  }, [consultations]);

  const doctorWorkload = [
    {
      name: "Dr. Arjun Mehta",
      dept: "Cardiology",
      assigned: 5,
      completed: 2,
      waiting: 2,
      status: "In OPD Room 104",
    },
    {
      name: "Dr. Priya Sharma",
      dept: "General Medicine",
      assigned: 2,
      completed: 1,
      waiting: 1,
      status: "In OPD Room 202",
    },
    {
      name: "Dr. Rajesh Kapoor",
      dept: "Neurology",
      assigned: 2,
      completed: 0,
      waiting: 1,
      status: "In OPD Room 305",
    },
  ];

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans">
      <ConsultationHeader
        roleLabel="Hospital Admin"
        pageTitle="Operational Monitoring Dashboard"
        subtitle="Monitor hospital consultation flows and queue statistics."
        breadcrumbs={[]}
        actions={
          <button
            onClick={() => onNavigateReports?.()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-sm font-semibold transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <BarChart2 size={16} />
            Analytics Reports
          </button>
        }
      />

      <div className="p-6 space-y-6 flex-1">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Total Visits Today
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {consultations.length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Average Waiting Time
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                14 mins
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Completion Rate
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center">
                <UserCheck size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                94.2%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Total Revenue (OPD)
              </span>
              <div className="w-9 h-9 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center">
                <Building2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                $1,240.00
              </div>
            </div>
          </div>
        </div>

        {/* Doctor workload & list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <ConsultationToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterDate={filterDate}
              onDateChange={setFilterDate}
              filterDoctor={filterDoctor}
              onDoctorChange={setFilterDoctor}
              filterDepartment={filterDepartment}
              onDepartmentChange={setFilterDepartment}
              filterStatus={filterStatus}
              onStatusChange={setFilterStatus}
              filterVisitType={filterVisitType}
              onVisitTypeChange={setFilterVisitType}
              onReset={handleResetFilters}
              onApply={handleRefresh}
              resultCount={filteredConsultations.length}
            />

            <ConsultationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={[
                { id: "All", label: "All Sessions", count: tabCounts.All },
                { id: "Waiting", label: "Waiting", count: tabCounts.Waiting },
                {
                  id: "In Progress",
                  label: "In Progress",
                  count: tabCounts["In Progress"],
                },
                {
                  id: "Completed",
                  label: "Completed",
                  count: tabCounts.Completed,
                },
                {
                  id: "Follow-up Scheduled",
                  label: "Follow-up",
                  count: tabCounts["Follow-up Scheduled"],
                },
                {
                  id: "Cancelled",
                  label: "Cancelled",
                  count: tabCounts.Cancelled,
                },
              ]}
            />

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className="bg-slate-50 border-b border-[#E5E7EB] text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      <th className="py-3.5 px-4">Consultation ID</th>
                      <th className="py-3.5 px-4">Patient</th>
                      <th className="py-3.5 px-4">MRN</th>
                      <th className="py-3.5 px-4">Assigned Doctor</th>
                      <th className="py-3.5 px-4">Department</th>
                      <th className="py-3.5 px-4">Visit Duration</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y divide-[#E5E7EB] text-xs"
                    style={{ fontFamily: RB }}
                  >
                    {filteredConsultations.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0D47A1]">
                          {item.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#111827]">
                          {item.patientName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {item.mrn}
                        </td>
                        <td className="py-3.5 px-4 text-slate-800">
                          {item.doctor}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.department}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {item.duration}
                        </td>
                        <td className="py-3.5 px-4">
                          <ConsultationStatusBadge status={item.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onViewDetails?.(item.id)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors inline-block"
                            title="Audit Consultation"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <h3
                className="text-sm font-bold text-[#111827] border-b border-gray-100 pb-3"
                style={{ fontFamily: PP }}
              >
                Doctor Workload & Status
              </h3>
              <div className="space-y-4">
                {doctorWorkload.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2"
                  >
                    <div
                      className="flex justify-between font-bold text-xs text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      <span>{doc.name}</span>
                      <span className="text-[10px] text-[#0D47A1]">
                        {doc.dept}
                      </span>
                    </div>
                    <div
                      className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 font-semibold"
                      style={{ fontFamily: RB }}
                    >
                      <div>Assigned: {doc.assigned}</div>
                      <div>Done: {doc.completed}</div>
                      <div>Wait: {doc.waiting}</div>
                    </div>
                    <div className="text-[10px] text-slate-400 italic">
                      Current Room: {doc.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpdConsultationMonitoringCenterPage;
