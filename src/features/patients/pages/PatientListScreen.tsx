import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Receipt,
  X,
  UserCheck,
  Calendar,
  FileText,
  Clock,
  Users,
  UserPlus,
  UserX,
  User,
  TrendingUp,
} from "lucide-react";
import { usePatientSearch, usePatients } from "../hooks/usePatients";
import type { ScreenPatient } from "../types/patient.types";
import { PP, RB } from "../constants/patient.mock";
import { Avatar } from "../components/Avatar";
import { PatientQuickDetailsDrawer } from "../components/PatientDrawers";
export function PatientListScreen({
  onPatientSelect,
  onViewTimeline,
  onViewMedicalHistory,
  onViewAppointments,
  onGenerateBill,
  onRegisterClick,
}: {
  onRegisterClick: () => void;
  onPatientSelect: (id: string) => void;
  onViewTimeline?: () => void;
  onViewMedicalHistory?: () => void;
  onViewAppointments?: () => void;
  onGenerateBill?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [regDateFilter, setRegDateFilter] = useState("All");

  const { data: serverPatients, isLoading } = usePatients();
  const { data: searchPatients } = usePatientSearch(searchQuery);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [drawerPatient, setDrawerPatient] = useState<ScreenPatient | null>(
    null,
  );

  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(
    null,
  );

  const stats = useMemo(() => {
    const list = (serverPatients || []) as unknown as Array<Record<string, unknown>>;
    const todayStr = new Date().toISOString().split("T")[0];

    return {
      totalPatients: list.length,
      newRegistrationsToday: list.filter(
        (p) =>
          typeof p.registrationDate === "string" &&
          p.registrationDate.startsWith(todayStr),
      ).length,
      activePatients: list.filter(
        (p) => p.status !== "Inactive" && p.status !== "Deceased",
      ).length,
      inactivePatients: list.filter(
        (p) => p.status === "Inactive" || p.status === "Deceased",
      ).length,
      duplicateCandidates: 0,
      deceasedPatients: list.filter((p) => p.status === "Deceased").length,
    };
  }, [serverPatients]);

  const sourcePatients =
    searchQuery.trim().length >= 2 && searchPatients
      ? (searchPatients as unknown as ScreenPatient[])
      : ((serverPatients || []) as unknown as ScreenPatient[]);

  const filteredPatients = sourcePatients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      String(p.id).toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.mobile.toLowerCase().includes(q);
    const matchesGender =
      genderFilter === "All" ||
      p.gender ===
      (genderFilter === "Male"
        ? "M"
        : genderFilter === "Female"
          ? "F"
          : "Other");
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesDoctor = doctorFilter === "All" || p.doctor === doctorFilter;

    // Reg Date filter basic match
    let matchesRegDate = true;
    if (regDateFilter === "Today") {
      matchesRegDate = p.regDate === "2024-03-12";
    } else if (regDateFilter === "This Month") {
      matchesRegDate = p.regDate.startsWith("2024-03");
    }

    return (
      matchesSearch &&
      matchesGender &&
      matchesStatus &&
      matchesDoctor &&
      matchesRegDate
    );
  });

  const hasActiveFilters =
    searchQuery !== "" ||
    genderFilter !== "All" ||
    statusFilter !== "All" ||
    doctorFilter !== "All" ||
    regDateFilter !== "All";

  const resetFilters = () => {
    setSearchQuery("");
    setGenderFilter("All");
    setStatusFilter("All");
    setDoctorFilter("All");
    setRegDateFilter("All");
  };

  const handleRegisterOpen = () => {
    if (onRegisterClick) {
      onRegisterClick();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F1F5F9]">
      {/* Quick Patient Details Right Drawer */}
      <PatientQuickDetailsDrawer
        patient={drawerPatient}
        onClose={() => setDrawerPatient(null)}
        onPatientSelect={onPatientSelect}
        onViewTimeline={onViewTimeline}
      />

      <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Patient Management
            </h1>
            <div
              className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1"
              style={{ fontFamily: RB }}
            >
              <span>Hospital Admin</span>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="font-semibold text-[#111827]">
                Patient Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRegisterOpen}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Plus size={16} /> Register Patient
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm animate-pulse space-y-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-200" />
                  <div className="w-1/2 h-3 bg-slate-200 rounded" />
                  <div className="w-2/3 h-6 bg-slate-200 rounded" />
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Total Patients Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span
                    className="text-xs font-medium text-[#64748B] uppercase tracking-wider block"
                    style={{ fontFamily: PP }}
                  >
                    Total Patients
                  </span>
                  <div
                    className="text-2xl font-bold text-[#111827] mt-1"
                    style={{ fontFamily: PP }}
                  >
                    {stats?.totalPatients ?? sourcePatients.length}
                  </div>
                  <div
                    className="flex items-center gap-1 text-[11px] text-[#66BB6A] font-semibold mt-1"
                    style={{ fontFamily: RB }}
                  >
                    <TrendingUp size={13} /> +8% from last month
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D47A1] flex items-center justify-center shrink-0">
                  <Users size={22} />
                </div>
              </div>

              {/* New Registrations Today */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span
                    className="text-xs font-medium text-[#64748B] uppercase tracking-wider block"
                    style={{ fontFamily: PP }}
                  >
                    New Registrations Today
                  </span>
                  <div
                    className="text-2xl font-bold text-[#111827] mt-1"
                    style={{ fontFamily: PP }}
                  >
                    {stats?.newRegistrationsToday ?? 0}
                  </div>
                  <div
                    className="flex items-center gap-1 text-[11px] text-[#009688] font-semibold mt-1"
                    style={{ fontFamily: RB }}
                  >
                    <UserPlus size={13} /> 6 pending check-in
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#009688] flex items-center justify-center shrink-0">
                  <UserPlus size={22} />
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span
                    className="text-xs font-medium text-[#64748B] uppercase tracking-wider block"
                    style={{ fontFamily: PP }}
                  >
                    Upcoming Appointments
                  </span>
                  <div
                    className="text-2xl font-bold text-[#111827] mt-1"
                    style={{ fontFamily: PP }}
                  >
                    {stats?.activePatients ?? 0}
                  </div>
                  <div
                    className="flex items-center gap-1 text-[11px] text-purple-600 font-semibold mt-1"
                    style={{ fontFamily: RB }}
                  >
                    <Calendar size={13} /> 12 morning slots
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Calendar size={22} />
                </div>
              </div>

              {/* Inactive Patients */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span
                    className="text-xs font-medium text-[#64748B] uppercase tracking-wider block"
                    style={{ fontFamily: PP }}
                  >
                    Inactive Patients
                  </span>
                  <div
                    className="text-2xl font-bold text-[#111827] mt-1"
                    style={{ fontFamily: PP }}
                  >
                    {stats?.inactivePatients ?? 0}
                  </div>
                  <div
                    className="flex items-center gap-1 text-[11px] text-[#64748B] font-semibold mt-1"
                    style={{ fontFamily: RB }}
                  >
                    <Clock size={13} /> &gt; 6 months inactive
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#64748B] flex items-center justify-center shrink-0">
                  <UserX size={22} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input (Search by Patient ID, Patient Name, Phone Number) */}
            <div className="relative flex-1 min-w-[280px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Patient ID, Patient Name, or Phone Number..."
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#F1F5F9]/60 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#64748B] outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                style={{ fontFamily: RB }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Filter Selectors */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {/* Gender Filter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
                <span className="text-[#64748B]">Gender:</span>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
                >
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
                <span className="text-[#64748B]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

              {/* Assigned Doctor Filter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
                <span className="text-[#64748B]">Doctor:</span>
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
                >
                  <option value="All">All Doctors</option>
                  <option value="Dr. A. Mehta">Dr. A. Mehta</option>
                  <option value="Dr. P. Sharma">Dr. P. Sharma</option>
                  <option value="Dr. S. Patel">Dr. S. Patel</option>
                  <option value="Dr. R. Kapoor">Dr. R. Kapoor</option>
                </select>
              </div>

              {/* Registration Date Filter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
                <span className="text-[#64748B]">Reg Date:</span>
                <select
                  value={regDateFilter}
                  onChange={(e) => setRegDateFilter(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1.5 text-xs text-[#EF4444] font-semibold hover:bg-red-50 rounded-xl transition-colors shrink-0"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MAIN TABLE & CONTENT WORKSPACE */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Table Header Section */}
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/50">
            <h2
              className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <Users size={18} className="text-[#0D47A1]" /> All Patients
            </h2>
            <div className="text-xs font-semibold text-[#64748B] bg-white px-2.5 py-1 rounded-lg border border-[#E5E7EB] shadow-sm">
              Showing {filteredPatients.length} result
              {filteredPatients.length === 1 ? "" : "s"}
            </div>
          </div>

          {isLoading ? (
            /* SKELETON TABLE LOADING STATE */
            <div className="p-6 space-y-4 animate-pulse">
              <div className="h-10 bg-slate-100 rounded-xl w-full" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-slate-50 rounded-xl w-full flex items-center justify-between px-4"
                >
                  <div className="w-20 h-4 bg-slate-200 rounded" />
                  <div className="w-32 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-4 bg-slate-200 rounded" />
                  <div className="w-28 h-4 bg-slate-200 rounded" />
                  <div className="w-24 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-6 bg-slate-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center mb-4 shadow-inner">
                <Users size={32} />
              </div>
              <h3
                className="text-lg font-bold text-[#111827] mb-1"
                style={{ fontFamily: PP }}
              >
                No patients found.
              </h3>
              <p
                className="text-xs text-[#64748B] max-w-sm mb-6"
                style={{ fontFamily: RB }}
              >
                We couldn't find any patient records matching your current
                search query or applied filters.
              </p>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Reset Search &amp; Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* PATIENT TABLE */
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F1F5F9]/80 border-b border-[#E5E7EB]">
                    {[
                      "Patient ID",
                      "Patient Name",
                      "Age",
                      "Gender",
                      "Phone",
                      "Assigned Doctor",
                      "Registration Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider whitespace-nowrap"
                        style={{ fontFamily: PP }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((p) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer group ${selectedPatientId === p.id ? "bg-blue-50/60" : ""}`}
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        setDrawerPatient(p);
                      }}
                    >
                      {/* 1. Patient ID */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                          {p.id}
                        </span>
                      </td>

                      {/* 2. Patient Name */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.name} size="sm" />
                          <div>
                            <span
                              className="text-xs font-bold text-[#111827] block"
                              style={{ fontFamily: PP }}
                            >
                              {p.name}
                            </span>
                            <span className="text-[11px] text-[#64748B] block">
                              {p.visitType} Intake
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Age */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {p.age} Y
                      </td>

                      {/* 4. Gender */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {p.gender === "F"
                          ? "Female"
                          : p.gender === "M"
                            ? "Male"
                            : "Other"}
                      </td>

                      {/* 5. Phone */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-mono">
                        {p.mobile}
                      </td>

                      {/* 6. Assigned Doctor */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <UserCheck size={14} className="text-[#009688]" />
                          <span className="font-medium text-[#111827]">
                            {p.doctor}
                          </span>
                        </div>
                      </td>

                      {/* 7. Registration Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600">
                        {p.regDate}
                      </td>

                      {/* 8. Actions (5 row actions menu) */}
                      <td
                        className="px-4 py-3.5 whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedPatientId(p.id);
                              setDrawerPatient(p);
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Quick Drawer View"
                          >
                            <Eye size={15} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveActionMenuId(
                                  activeActionMenuId === p.id ? null : p.id,
                                )
                              }
                              className="p-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                              title="Row Actions"
                            >
                              <MoreVertical size={15} />
                            </button>

                            {/* Dropdown Action Menu */}
                            {activeActionMenuId === p.id && (
                              <div className="absolute right-0 top-8 z-30 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-150">
                                {/* 1. View Profile */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    onPatientSelect(p.id);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                >
                                  <User size={14} className="text-[#0D47A1]" />{" "}
                                  View Profile
                                </button>

                                {/* 2. Edit Patient */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    setDrawerPatient(p);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                >
                                  <Edit size={14} className="text-slate-500" />{" "}
                                  Edit Patient
                                </button>

                                {/* 3. View Medical History */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    if (onViewMedicalHistory)
                                      onViewMedicalHistory();
                                    else onPatientSelect(p.id);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                >
                                  <FileText
                                    size={14}
                                    className="text-[#009688]"
                                  />{" "}
                                  View Medical History
                                </button>

                                {/* 4. View Appointments */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    if (onViewAppointments)
                                      onViewAppointments();
                                    else if (onViewTimeline) onViewTimeline();
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                >
                                  <Calendar
                                    size={14}
                                    className="text-purple-600"
                                  />{" "}
                                  View Appointments
                                </button>

                                {/* 5. Generate Bill */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    if (onGenerateBill) onGenerateBill();
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-[#66BB6A]/10 hover:text-[#66BB6A] flex items-center gap-2 font-medium transition-colors border-t border-gray-100 mt-1 pt-2"
                                >
                                  <Receipt
                                    size={14}
                                    className="text-amber-600"
                                  />{" "}
                                  Generate Bill
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE FOOTER / PAGINATION */}
          {!isLoading && filteredPatients.length > 0 && (
            <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
              <div
                className="flex items-center gap-2 text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                <span>Showing</span>
                <span className="font-semibold text-[#111827]">
                  {filteredPatients.length}
                </span>
                <span>of</span>
                <span className="font-semibold text-[#111827]">
                  {sourcePatients.length}
                </span>
                <span>patients</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                  disabled
                >
                  Previous
                </button>
                <button className="w-7 h-7 flex items-center justify-center bg-[#0D47A1] text-white rounded-lg text-xs font-semibold">
                  1
                </button>
                <button className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
