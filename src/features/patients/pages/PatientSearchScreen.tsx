import { useState, useMemo } from "react";
import {
  Calendar,
  Search,
  UserPlus,
  Users,
  TrendingUp,
  Clock,
  UserX,
} from "lucide-react";
import { usePatients } from "../hooks/usePatients";
import { PP, RB } from "../constants/patient.mock";
import { PatientTable } from "../components/PatientTable";
import { usePermissions } from "../../../permissions";
import type { Patient } from "../types/patient.types";

export function PatientSearchScreen({
  onPatientSelect,
  onRegisterClick,
  onBookAppointmentClick,
  onEditPatientClick,
  userRole,
}: {
  onBack?: () => void;
  onPatientSelect?: (mrn: string) => void;
  onRegisterClick?: () => void;
  onBookAppointmentClick?: (mrn: string) => void;
  onEditPatientClick?: (patient: Patient) => void;
  onCheckInClick?: (mrn: string) => void;
  userRole?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [regTypeFilter, setRegTypeFilter] = useState("All Types");
  const [genderFilter, setGenderFilter] = useState("All Genders");
  const [regDateFilter, setRegDateFilter] = useState("All Dates");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(
    null,
  );

  const permissions = usePermissions();
  const activeRole = (
    userRole ||
    permissions.role ||
    "RECEPTIONIST"
  ).toUpperCase();

  // Backend API connection
  const { data: patientsResponse, isLoading } = usePatients();
  const dbPatients = useMemo(
    () => patientsResponse?.items ?? [],
    [patientsResponse],
  );

  // Dynamic KPI Stats calculation from API patient data
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const totalPatients = dbPatients.length;
    const newRegistrationsToday = dbPatients.filter(
      (p) =>
        typeof p.registrationDate === "string" &&
        p.registrationDate.startsWith(todayStr),
    ).length;
    const activePatients = dbPatients.filter(
      (p) =>
        p.status !== "Inactive" &&
        p.status !== "INACTIVE" &&
        p.status !== "Deceased",
    ).length;
    const inactivePatients = dbPatients.filter(
      (p) =>
        p.status === "Inactive" ||
        p.status === "INACTIVE" ||
        p.status === "Deceased",
    ).length;

    return {
      totalPatients,
      newRegistrationsToday,
      activePatients,
      inactivePatients,
    };
  }, [dbPatients]);

  // Filter Logic over DB Patients
  const filteredPatients = dbPatients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const mrnStr = (p.mrn || String(p.id)).toLowerCase();
    const nameStr = (p.patientName || p.name || "").toLowerCase();
    const phoneStr = (p.phone || "").toLowerCase();

    const matchSearch =
      q === "" ||
      mrnStr.includes(q) ||
      nameStr.includes(q) ||
      phoneStr.includes(q);

    const pStatus = p.status || "ACTIVE";
    const pGender = p.gender || "MALE";
    const pRegType = p.registrationType || "WALK_IN";

    const matchStatus =
      statusFilter === "All Statuses" ||
      pStatus.toUpperCase() === statusFilter.toUpperCase().replace("-", "_");
    const matchType =
      regTypeFilter === "All Types" ||
      pRegType.toUpperCase() ===
        regTypeFilter.toUpperCase().replace(/\s+/g, "_");
    const matchGender =
      genderFilter === "All Genders" ||
      pGender.toUpperCase() === genderFilter.toUpperCase() ||
      (genderFilter === "Female" && pGender === "F") ||
      (genderFilter === "Male" && pGender === "M");
    const matchDate =
      regDateFilter === "All Dates" ||
      (regDateFilter === "Today" &&
        p.registrationDate &&
        p.registrationDate.startsWith(new Date().toISOString().split("T")[0]));

    return matchSearch && matchStatus && matchType && matchGender && matchDate;
  });

  const selectedPatient =
    dbPatients.find((p) => (p.mrn || String(p.id)) === selectedPatientId) ||
    filteredPatients[0];

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Statuses");
    setRegTypeFilter("All Types");
    setGenderFilter("All Genders");
    setRegDateFilter("All Dates");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "All Statuses" ||
    regTypeFilter !== "All Types" ||
    genderFilter !== "All Genders" ||
    regDateFilter !== "All Dates";

  // RBAC permission checks for action buttons
  const canRegister = permissions.can("PATIENT_CREATE");
  const canBook = permissions.can("APPOINTMENT_CREATE");

  // Breadcrumb label based on role
  const roleLabel =
    activeRole === "DOCTOR"
      ? "Doctor Workspace"
      : activeRole.includes("ADMIN")
        ? "Hospital Admin"
        : "Reception";

  return (
    <div
      className="w-full min-h-screen flex flex-col p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* ── HEADER & BREADCRUMB & PRIMARY ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span>{roleLabel}</span>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-[#0D47A1]">Patient Search</span>
          </div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Patient Management & Search
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Search patient records, filter by status or department, and inspect
            record details.
          </p>
        </div>

        {/* Primary Action Buttons (Governed by RBAC) */}
        <div className="flex items-center gap-2 flex-wrap">
          {canRegister && onRegisterClick && (
            <button
              onClick={onRegisterClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <UserPlus size={15} />
              Register Patient
            </button>
          )}
          {canBook && onBookAppointmentClick && (
            <button
              onClick={() =>
                onBookAppointmentClick(
                  selectedPatient
                    ? selectedPatient.mrn || String(selectedPatient.id)
                    : "",
                )
              }
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Calendar size={15} />
              Book Appointment
            </button>
          )}
        </div>
      </div>

      {/* ── KPI SUMMARY CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm animate-pulse space-y-3"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-200" />
              <div className="w-1/2 h-3 bg-slate-200 rounded" />
              <div className="w-2/3 h-6 bg-slate-200 rounded" />
            </div>
          ))
        ) : (
          <>
            {/* Total Patients */}
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
                  {stats.totalPatients}
                </div>
                <div
                  className="flex items-center gap-1 text-[11px] text-[#66BB6A] font-semibold mt-1"
                  style={{ fontFamily: RB }}
                >
                  <TrendingUp size={13} /> Active Master Records
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
                  {stats.newRegistrationsToday}
                </div>
                <div
                  className="flex items-center gap-1 text-[11px] text-[#009688] font-semibold mt-1"
                  style={{ fontFamily: RB }}
                >
                  <UserPlus size={13} /> Registered Today
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#009688] flex items-center justify-center shrink-0">
                <UserPlus size={22} />
              </div>
            </div>

            {/* Active Patients */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <span
                  className="text-xs font-medium text-[#64748B] uppercase tracking-wider block"
                  style={{ fontFamily: PP }}
                >
                  Active Patients
                </span>
                <div
                  className="text-2xl font-bold text-[#111827] mt-1"
                  style={{ fontFamily: PP }}
                >
                  {stats.activePatients}
                </div>
                <div
                  className="flex items-center gap-1 text-[11px] text-purple-600 font-semibold mt-1"
                  style={{ fontFamily: RB }}
                >
                  <Clock size={13} /> Active OPD & Care
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
                  {stats.inactivePatients}
                </div>
                <div
                  className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-1"
                  style={{ fontFamily: RB }}
                >
                  <UserX size={13} /> Archived / Inactive
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <UserX size={22} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── GLOBAL SEARCH & FILTER BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient Name, MRN, or Mobile Number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
            style={{ fontFamily: RB }}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Statuses</option>
            <option>Checked-In</option>
            <option>Scheduled</option>
            <option>Active</option>
            <option>Registered</option>
            <option>Inactive</option>
          </select>

          <select
            value={regTypeFilter}
            onChange={(e) => setRegTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Types</option>
            <option>New Patient</option>
            <option>Existing Patient Update</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Genders</option>
            <option>Female</option>
            <option>Male</option>
          </select>

          <select
            value={regDateFilter}
            onChange={(e) => setRegDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Dates</option>
            <option>Today</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-3 py-2 rounded-xl text-xs text-[#EF4444] font-semibold hover:bg-red-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* ── SINGLE COMMON PATIENT TABLE COMPONENT FOR ALL ROLES (RBAC CONTROLLED) ── */}
      <PatientTable
        patients={filteredPatients}
        totalCount={filteredPatients.length}
        isLoading={isLoading}
        selectedPatientId={selectedPatientId}
        activeActionMenuId={activeActionMenuId}
        hasActiveFilters={hasActiveFilters}
        userRole={userRole}
        onSelectRow={(p: Patient) => {
          const id = p.mrn || String(p.id);
          setSelectedPatientId(id);
          if (onPatientSelect) onPatientSelect(id);
        }}
        onToggleActionMenu={(id) => setActiveActionMenuId(id)}
        onViewProfile={(id) => {
          if (onPatientSelect) onPatientSelect(id);
        }}
        onEditPatient={(p) => {
          const id = p.mrn || String(p.id);
          if (onEditPatientClick) {
            onEditPatientClick(p);
          } else if (onPatientSelect) {
            onPatientSelect(id);
          }
        }}
        onViewMedicalHistory={(id) => {
          if (onPatientSelect) onPatientSelect(id);
        }}
        onViewAppointments={(id) => {
          if (onPatientSelect) onPatientSelect(id);
        }}
        onGenerateBill={(id) => {
          if (onPatientSelect) onPatientSelect(id);
        }}
        onResetFilters={resetFilters}
      />
    </div>
  );
}
