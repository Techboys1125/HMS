import { useEffect, useState } from "react";
import {
  Search,
  ChevronRight,
  Activity,
  Calendar,
  Users,
  UserPlus,
} from "lucide-react";
import type {

  ChipVariant
} from "../types/patient.types";
import {
  PP,
  RB,
  
} from "../constants/patient.mock";
import { Av, Chip } from "../components/Avatar";

export function PatientSearchScreen({
  onBack,
  onPatientSelect,
  onRegisterClick,
  onBookAppointmentClick,
  onCheckInClick,
  userRole = "Receptionist",
}: {
  onBack?: () => void;
  onPatientSelect?: (mrn: string) => void;
  onRegisterClick?: () => void;
  onBookAppointmentClick?: (mrn: string) => void;
  onCheckInClick?: (mrn: string) => void;
  userRole?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [regTypeFilter, setRegTypeFilter] = useState("All Types");
  const [genderFilter, setGenderFilter] = useState("All Genders");
  const [regDateFilter, setRegDateFilter] = useState("All Dates");
  const [selectedPatientId, setSelectedPatientId] =
    useState<string>("MRN-892101");

  const [patients] = useState<ScreenPatientSearchResult[]>([
    {
      mrn: "MRN-892101",
      name: "Sarah Mitchell",
      age: 34,
      gender: "Female",
      mobile: "+91 98765 43210",
      bloodGroup: "A+",
      regDate: "2026-03-12",
      status: "Checked-In",
      regType: "New Patient",
      lastVisit: {
        date: "2026-06-15",
        doctor: "Dr. Arjun Mehta",
        department: "Cardiology",
        status: "Completed",
      },
      upcomingAppointment: {
        date: "2026-07-24",
        time: "09:00 AM",
        doctor: "Dr. Arjun Mehta",
        department: "Cardiology",
        status: "In Queue",
      },
    },
    {
      mrn: "MRN-892102",
      name: "James Thornton",
      age: 67,
      gender: "Male",
      mobile: "+91 98765 43211",
      bloodGroup: "O+",
      regDate: "2026-02-10",
      status: "Scheduled",
      regType: "Existing Patient Update",
      lastVisit: {
        date: "2026-05-20",
        doctor: "Dr. Priya Sharma",
        department: "General OPD",
        status: "Completed",
      },
      upcomingAppointment: {
        date: "2026-07-24",
        time: "09:15 AM",
        doctor: "Dr. Priya Sharma",
        department: "General OPD",
        status: "Scheduled",
      },
    },
    {
      mrn: "MRN-892103",
      name: "Emma Reyes",
      age: 28,
      gender: "Female",
      mobile: "+91 98765 43212",
      bloodGroup: "B+",
      regDate: "2026-05-01",
      status: "Active",
      regType: "New Patient",
      lastVisit: {
        date: "2026-05-01",
        doctor: "Dr. Sunita Patel",
        department: "Gynecology",
        status: "Completed",
      },
      upcomingAppointment: {
        date: "2026-07-25",
        time: "10:00 AM",
        doctor: "Dr. Sunita Patel",
        department: "Gynecology",
        status: "Confirmed",
      },
    },
    {
      mrn: "MRN-892104",
      name: "Robert Chen",
      age: 52,
      gender: "Male",
      mobile: "+91 98765 43213",
      bloodGroup: "AB+",
      regDate: "2025-11-18",
      status: "Registered",
      regType: "Existing Patient Update",
      lastVisit: {
        date: "2026-04-10",
        doctor: "Dr. Arjun Mehta",
        department: "Cardiology",
        status: "Completed",
      },
    },
    {
      mrn: "MRN-892105",
      name: "Aisha Kumar",
      age: 41,
      gender: "Female",
      mobile: "+91 98765 43214",
      bloodGroup: "O-",
      regDate: "2026-07-24",
      status: "Registered",
      regType: "New Patient",
      upcomingAppointment: {
        date: "2026-07-24",
        time: "10:15 AM",
        doctor: "Dr. Rajesh Kapoor",
        department: "Neurology",
        status: "Scheduled",
      },
    },
    {
      mrn: "MRN-892106",
      name: "David Walsh",
      age: 38,
      gender: "Male",
      mobile: "+91 98765 43215",
      bloodGroup: "A-",
      regDate: "2025-08-30",
      status: "Inactive",
      regType: "Existing Patient Update",
      lastVisit: {
        date: "2025-10-12",
        doctor: "Dr. Priya Sharma",
        department: "General OPD",
        status: "Completed",
      },
    },
  ]);

  // Filter Logic
  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      q === "" ||
      p.mrn.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.mobile.includes(q);

    const matchStatus =
      statusFilter === "All Statuses" || p.status === statusFilter;
    const matchType =
      regTypeFilter === "All Types" || p.regType === regTypeFilter;
    const matchGender =
      genderFilter === "All Genders" || p.gender === genderFilter;
    const matchDate =
      regDateFilter === "All Dates" ||
      (regDateFilter === "Today" && p.regDate === "2026-07-24");

    return matchSearch && matchStatus && matchType && matchGender && matchDate;
  });

  const selectedPatient =
    patients.find((p) => p.mrn === selectedPatientId) || filteredPatients[0];

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Statuses");
    setRegTypeFilter("All Types");
    setGenderFilter("All Genders");
    setRegDateFilter("All Dates");
  };

  const getStatusChipVariant = (status: string): ChipVariant => {
    switch (status) {
      case "Active":
        return "success";
      case "Checked-In":
        return "info";
      case "Scheduled":
        return "teal";
      case "Registered":
        return "info";
      case "Completed":
        return "success";
      case "Inactive":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* ── HEADER & BREADCRUMBS & PRIMARY ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Reception Management
            </button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">Patient Search</span>
          </div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Patient Search
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Search and manage existing patient records.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {userRole !== "admin" &&
            userRole !== "Hospital Admin" &&
            userRole !== "Super Admin" && (
              <button
                onClick={onRegisterClick}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <UserPlus size={15} />
                Register New Patient
              </button>
            )}
          <button
            onClick={() =>
              onBookAppointmentClick && selectedPatient
                ? onBookAppointmentClick(selectedPatient.mrn)
                : null
            }
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Calendar size={15} />
            Book Appointment
          </button>
        </div>
      </div>

      {/* ── GLOBAL ENTERPRISE SEARCH & FILTER BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by MRN, Patient Name, Mobile Number or Appointment ID..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
            style={{ fontFamily: RB }}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Registered</option>
              <option>Scheduled</option>
              <option>Checked-In</option>
              <option>Completed</option>
            </select>

            <select
              value={regTypeFilter}
              onChange={(e) => setRegTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Types</option>
              <option>New Patient</option>
              <option>Existing Patient Update</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Genders</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <select
              value={regDateFilter}
              onChange={(e) => setRegDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Dates</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl text-xs text-[#EF4444] font-semibold hover:bg-red-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Result Counter Summary */}
          <div className="text-xs text-[#64748B] font-medium">
            Found{" "}
            <span className="font-bold text-[#0D47A1]">
              {filteredPatients.length}
            </span>{" "}
            patient records
          </div>
        </div>
      </div>

      {/* ── ENTERPRISE LAYOUT GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ENTERPRISE DATA TABLE (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Matching Patient Records
                </h2>
                <p className="text-xs text-[#64748B]">
                  Click on any row to view complete record details in the
                  context panel
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table
                className="w-full text-left text-xs"
                style={{ fontFamily: RB }}
              >
                <thead>
                  <tr
                    className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]"
                    style={{ fontFamily: PP }}
                  >
                    <th className="px-4 py-3">Photo</th>
                    <th className="px-4 py-3">MRN</th>
                    <th className="px-4 py-3">Patient Name</th>
                    <th className="px-4 py-3">Age / Gender</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Blood Group</th>
                    <th className="px-4 py-3">Last Visit</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p) => {
                      const isSelected = selectedPatientId === p.mrn;
                      return (
                        <tr
                          key={p.mrn}
                          onClick={() => setSelectedPatientId(p.mrn)}
                          className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${isSelected ? "bg-blue-50/60 font-medium" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <Av name={p.name} size="sm" />
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">
                            {p.mrn}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-[#111827]">
                              {p.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {p.age} yrs · {p.gender}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-500">
                            {p.mobile}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#009688]">
                            {p.bloodGroup}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-500">
                            {p.lastVisit?.date || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Chip
                              label={p.status}
                              variant={getStatusChipVariant(p.status)}
                            />
                          </td>
                          <td
                            className="px-4 py-3 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  onPatientSelect && onPatientSelect(p.mrn)
                                }
                                title="View Patient Profile"
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                              >
                                Profile
                              </button>
                              <button
                                onClick={() =>
                                  onBookAppointmentClick &&
                                  onBookAppointmentClick(p.mrn)
                                }
                                title="Book Appointment"
                                className="px-2 py-1 rounded-lg bg-teal-50 text-[#009688] text-[11px] font-semibold hover:bg-teal-100 transition-colors"
                              >
                                Book
                              </button>
                              {p.status === "Scheduled" && (
                                <button
                                  onClick={() =>
                                    onCheckInClick && onCheckInClick(p.mrn)
                                  }
                                  title="Check-In Patient"
                                  className="px-2 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                                >
                                  Check-In
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={32} className="text-slate-300" />
                          <p className="text-sm font-semibold text-[#111827]">
                            No patient records match your search.
                          </p>
                          <p className="text-xs text-slate-400">
                            Complete the required patient information to
                            generate a new MRN.
                          </p>
                          <button
                            onClick={onRegisterClick}
                            className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center gap-1.5"
                            style={{ fontFamily: PP }}
                          >
                            <UserPlus size={15} /> Register New Patient
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#64748B]">
              <span>
                Showing 1-{filteredPatients.length} of {filteredPatients.length}{" "}
                records
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] disabled:opacity-50 hover:bg-slate-50"
                  disabled
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white font-semibold">
                  1
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">
          {selectedPatient ? (
            <>
              {/* CARD 01: Selected Patient Summary */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
                <h3
                  className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
                  style={{ fontFamily: PP }}
                >
                  Selected Patient Summary
                </h3>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                  <Av name={selectedPatient.name} size="lg" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">
                      {selectedPatient.name}
                    </h4>
                    <span className="font-mono text-xs font-bold text-[#0D47A1]">
                      {selectedPatient.mrn}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-[#64748B] block">
                      Age / Gender
                    </span>
                    <span className="font-bold text-[#111827]">
                      {selectedPatient.age} yrs · {selectedPatient.gender}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50">
                    <span className="text-[10px] text-[#64748B] block">
                      Blood Group
                    </span>
                    <span className="font-bold text-[#009688]">
                      {selectedPatient.bloodGroup}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 col-span-2">
                    <span className="text-[10px] text-[#64748B] block">
                      Mobile Number
                    </span>
                    <span className="font-mono font-bold text-[#111827]">
                      {selectedPatient.mobile}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 02: Recent Visit */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                <h3
                  className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between"
                  style={{ fontFamily: PP }}
                >
                  <span>Recent Visit</span>
                  <Activity size={15} className="text-[#0D47A1]" />
                </h3>
                {selectedPatient.lastVisit ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Last Consultation</span>
                      <span className="font-mono font-bold text-[#111827]">
                        {selectedPatient.lastVisit.date}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Doctor</span>
                      <span className="font-semibold text-[#111827]">
                        {selectedPatient.lastVisit.doctor}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Department</span>
                      <span className="text-slate-600">
                        {selectedPatient.lastVisit.department}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B]">Visit Status</span>
                      <span className="font-semibold text-[#66BB6A]">
                        {selectedPatient.lastVisit.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-2">
                    No previous consultation history recorded.
                  </p>
                )}
              </div>

              {/* CARD 03: Upcoming Appointment */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                <h3
                  className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between"
                  style={{ fontFamily: PP }}
                >
                  <span>Upcoming Appointment</span>
                  <Calendar size={15} className="text-[#009688]" />
                </h3>
                {selectedPatient.upcomingAppointment ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Appointment Date</span>
                      <span className="font-mono font-bold text-[#0D47A1]">
                        {selectedPatient.upcomingAppointment.date}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Time Slot</span>
                      <span className="font-mono font-bold text-[#009688]">
                        {selectedPatient.upcomingAppointment.time}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Doctor</span>
                      <span className="font-semibold text-[#111827]">
                        {selectedPatient.upcomingAppointment.doctor}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B]">Status</span>
                      <Chip
                        label={selectedPatient.upcomingAppointment.status}
                        variant="teal"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-2">
                    No upcoming appointments booked for today.
                  </p>
                )}
              </div>

              {/* CARD 04: Quick Actions */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-2.5">
                <h3
                  className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
                  style={{ fontFamily: PP }}
                >
                  Quick Actions
                </h3>
                <button
                  onClick={() =>
                    onPatientSelect && onPatientSelect(selectedPatient.mrn)
                  }
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-semibold text-[#0D47A1] transition-colors"
                >
                  View Profile <ChevronRight size={14} />
                </button>
                <button
                  onClick={() =>
                    onBookAppointmentClick &&
                    onBookAppointmentClick(selectedPatient.mrn)
                  }
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-[#009688] transition-colors"
                >
                  Book Appointment <ChevronRight size={14} />
                </button>
                <button
                  onClick={onRegisterClick}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#111827] transition-colors"
                >
                  Register New Patient <ChevronRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm text-center text-xs text-slate-400">
              Select a patient from the search results to inspect record
              details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
