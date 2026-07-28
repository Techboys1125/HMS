import { useState } from "react";
import { Calendar, Search, UserPlus } from "lucide-react";
import type { ScreenPatientSearchResult } from "../types/patient.types";
import { PP, RB } from "../constants/patient.mock";

export function PatientSearchScreen({
  onPatientSelect,
  onRegisterClick,
  onBookAppointmentClick,
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

  return (
    <div
      className="w-full min-h-screen flex flex-col p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* ── HEADER & BREADCRUMB & PRIMARY ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span>Reception</span>
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

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {onRegisterClick && (
            <button
              onClick={onRegisterClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <UserPlus size={15} />
              Register Patient
            </button>
          )}
          {onBookAppointmentClick && (
            <button
              onClick={() =>
                onBookAppointmentClick(
                  selectedPatient ? selectedPatient.mrn : "",
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

      {/* ── PATIENTS TABLE & CONTENT LAYOUT ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-12 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Patient Search Results
            </h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1]">
              {filteredPatients.length} Patients Found
            </span>
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
                  <th className="px-4 py-3">MRN</th>
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">Age/Gender</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Blood Group</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#111827]">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient.mrn}
                      onClick={() => setSelectedPatientId(patient.mrn)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedPatientId === patient.mrn ? "bg-blue-50/40" : ""}`}
                    >
                      <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                        {patient.mrn}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-[#111827]">
                        {patient.name}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {patient.age} yrs · {patient.gender}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-500">
                        {patient.mobile}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-[#009688]">
                        {patient.bloodGroup}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onPatientSelect) onPatientSelect(patient.mrn);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      No matching patient records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
