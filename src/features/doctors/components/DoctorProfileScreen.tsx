import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  Award,
  Building2,
  ChevronLeft,
  ChevronRight,
  Edit,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Search,
  Filter,
  X,
  User,
  FileCheck,
} from "lucide-react";
import type {
  DoctorRecord,
  DoctorAvailability,
  DoctorAppointment,
} from "../types/doctors.types";
import {
  INITIAL_DOCTORS,
  MOCK_DOCTOR_APPOINTMENTS,
  MOCK_DOCTOR_PATIENTS,
  MOCK_WEEKLY_SCHEDULE,
  MOCK_DOCTOR_TIMELINE,
  PP,
  RB,
} from "../constants/doctors.constants";
import { EditDoctorDrawer } from "./EditDoctorDrawer";
import { DeactivateDoctorDialog } from "./DeactivateDoctorDialog";

import { doctorsService } from "../services/doctors.service";
import type { ApiScheduleExceptionItem } from "../types/doctors.types";

export interface DoctorProfileScreenProps {
  doctor?: DoctorRecord;
  onBack: () => void;
  onEdit?: (doctor: DoctorRecord) => void;
}

function DollarSignIcon() {
  return <span className="text-xs font-bold">$</span>;
}

export function DoctorProfileScreen({
  doctor = INITIAL_DOCTORS[0],
  onBack,
  onEdit,
}: DoctorProfileScreenProps) {
  const [docState, setDocState] = useState<DoctorRecord>(doctor);
  const [scheduleExceptions, setScheduleExceptions] = useState<ApiScheduleExceptionItem[]>(
    doctor.scheduleExceptions || []
  );
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "professional"
    | "schedule"
    | "appointments"
    | "patients"
    | "timeline"
  >("overview");

  const fetchExceptions = async () => {
    const numericDocId = docState.doctorId || (docState.userId ? docState.userId : docState.id.replace("DOC-", ""));
    if (numericDocId) {
      try {
        const exceptions = await doctorsService.getScheduleExceptions(numericDocId);
        if (exceptions && exceptions.length > 0) {
          setScheduleExceptions(exceptions);
        }
      } catch (err) {
        console.warn("Failed to fetch schedule exceptions:", err);
      }
    }
  };

  useEffect(() => {
    fetchExceptions();
  }, [docState.id]);

  const [apptSearch, setApptSearch] = useState("");
  const [apptDateFilter, setApptDateFilter] = useState("All Dates");
  const [patientSearch, setPatientSearch] = useState("");

  const [selectedApptDetail, setSelectedApptDetail] =
    useState<DoctorAppointment | null>(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getAvailStyle = (avail: DoctorAvailability) => {
    switch (avail) {
      case "Available Today":
        return {
          bg: "bg-teal-50 text-[#009688] border-teal-200",
          dot: "bg-[#009688]",
        };
      case "On Duty":
        return {
          bg: "bg-blue-50 text-[#0D47A1] border-blue-200",
          dot: "bg-[#0D47A1]",
        };
      case "On Call":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-600",
        };
      case "On Leave":
        return {
          bg: "bg-amber-50 text-[#F59E0B] border-amber-200",
          dot: "bg-[#F59E0B]",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  const initials = docState.name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const availStyle = getAvailStyle(docState.availability);

  const filteredAppointments = useMemo(() => {
    return MOCK_DOCTOR_APPOINTMENTS.filter((a) => {
      if (apptSearch) {
        const q = apptSearch.toLowerCase();
        const match =
          a.id.toLowerCase().includes(q) ||
          a.patientName.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (apptDateFilter === "Today" && !a.date.includes("March 28"))
        return false;
      return true;
    });
  }, [apptSearch, apptDateFilter]);

  const filteredPatients = useMemo(() => {
    return MOCK_DOCTOR_PATIENTS.filter((p) => {
      if (patientSearch) {
        const q = patientSearch.toLowerCase();
        const match =
          p.id.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.complaint.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [patientSearch]);

  const handleSaveEditDoctor = (updatedDoc: DoctorRecord) => {
    setDocState(updatedDoc);
    triggerToast("Doctor information updated successfully.");
    setShowEditDrawer(false);
    if (onEdit) onEdit(updatedDoc);
  };

  const handleConfirmDeactivate = () => {
    setDocState((prev) => ({
      ...prev,
      status: "Inactive" as const,
      availability: "Out of Office" as const,
    }));
    triggerToast(`Doctor ${docState.name} has been deactivated.`);
    setDeactivateDialogOpen(false);
    setShowEditDrawer(false);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Doctor Profile
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] pl-8">
            <span>Hospital Admin</span>
            <ChevronRight size={13} className="text-slate-300" />
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Doctor Management
            </button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-[#111827]">
              {docState.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setIsLoading((prev) => !prev);
              triggerToast(
                isLoading
                  ? "Loaded full profile view."
                  : "Simulating loading skeletons...",
              );
            }}
            className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw
              size={13}
              className={isLoading ? "animate-spin text-[#0D47A1]" : ""}
            />
            <span>{isLoading ? "Loading Active" : "Simulate Loading"}</span>
          </button>

          <button
            onClick={() => setShowEditDrawer(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Edit size={14} className="text-[#0D47A1]" /> Edit Doctor
          </button>

          <button
            onClick={() => setDeactivateDialogOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-red-200 bg-red-50 text-[#EF4444] hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-sm"
            style={{ fontFamily: PP }}
          >
            <AlertTriangle size={14} /> Deactivate Doctor
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm animate-pulse flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-200 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-slate-200 rounded w-48" />
            <div className="h-4 bg-slate-200 rounded w-64" />
            <div className="h-3 bg-slate-100 rounded w-80" />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl bg-[#0D47A1] text-white font-bold text-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-md"
              style={{ fontFamily: PP }}
            >
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2
                  className="text-xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {docState.name}
                </h2>
                <span className="text-xs font-mono font-bold text-[#0D47A1] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {docState.id}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  EMP: {docState.empId}
                </span>
                <span className="text-xs font-mono font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100 flex items-center gap-1">
                  <FileCheck size={13} /> {docState.regNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    docState.status === "Active"
                      ? "bg-emerald-50 text-[#66BB6A] border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {docState.status}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${availStyle.bg}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${availStyle.dot}`}
                  />
                  {docState.availability}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                <span className="font-semibold text-[#111827]">
                  {docState.qualification}
                </span>
                <span>&bull;</span>
                <span className="font-bold text-[#0D47A1]">
                  {docState.specialty}
                </span>
                <span>({docState.department})</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#64748B] pt-0.5">
                <span className="flex items-center gap-1">
                  <Award size={14} className="text-[#F59E0B]" />{" "}
                  {docState.experienceYrs} Years Experience
                </span>
                <span className="flex items-center gap-1 font-bold text-[#0D47A1]">
                  <DollarSignIcon /> ${docState.consultationFee} Consultation
                  Fee
                </span>
                <span className="flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  <Building2 size={13} /> {docState.opdRoom}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <button
              onClick={() => setActiveTab("schedule")}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-slate-700 hover:text-[#0D47A1] text-xs font-bold transition-colors flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Clock size={14} /> Schedule
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Calendar size={14} /> Appointments
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "overview", label: "Overview" },
                { id: "professional", label: "Professional Info" },
                { id: "schedule", label: "Availability Schedule" },
                { id: "appointments", label: "Appointments" },
                { id: "patients", label: "Assigned Patients" },
                { id: "timeline", label: "Activity Timeline" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? "bg-[#0D47A1] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#111827] hover:bg-slate-50"
                }`}
                style={{ fontFamily: PP }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] font-medium block">
                      Today's Appointments
                    </span>
                    <span
                      className="text-2xl font-bold text-[#111827] mt-0.5 block"
                      style={{ fontFamily: PP }}
                    >
                      8
                    </span>
                    <span className="text-[11px] text-[#0D47A1] font-medium mt-1 block">
                      3 Completed &bull; 5 Scheduled
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                    <Calendar size={20} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] font-medium block">
                      Total Patients
                    </span>
                    <span
                      className="text-2xl font-bold text-[#111827] mt-0.5 block"
                      style={{ fontFamily: PP }}
                    >
                      142
                    </span>
                    <span className="text-[11px] text-[#009688] font-medium mt-1 block">
                      Active clinical cases
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
                    <User size={20} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] font-medium block">
                      Experience
                    </span>
                    <span
                      className="text-2xl font-bold text-[#111827] mt-0.5 block"
                      style={{ fontFamily: PP }}
                    >
                      {docState.experienceYrs} Yrs
                    </span>
                    <span className="text-[11px] text-[#F59E0B] font-medium mt-1 block">
                      {docState.specialty}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
                    <Award size={20} />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3
                    className="text-sm font-bold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-3"
                    style={{ fontFamily: PP }}
                  >
                    <User size={16} className="text-[#0D47A1]" /> Basic
                    Information
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Full Name</span>
                      <span className="font-bold text-[#111827]">
                        {docState.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Gender</span>
                      <span className="font-medium text-[#111827]">
                        {docState.gender}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Email Address</span>
                      <span className="font-semibold text-[#0D47A1]">
                        {docState.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Contact Phone</span>
                      <span className="font-medium text-[#111827]">
                        {docState.phone}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">OPD Cabinet Room</span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {docState.opdRoom}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Facility Location</span>
                      <span className="font-semibold text-[#111827]">
                        City General Main Campus
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B]">Joined HMS</span>
                      <span className="font-medium text-[#111827]">
                        {docState.joinedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "professional" && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-6">
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Professional Credentials & Attributes
                </h3>
                <p className="text-xs text-[#64748B]">
                  Detailed practice specifications and registration metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">
                    Employee ID
                  </span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">
                    {docState.empId}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">
                    Medical Registration Number
                  </span>
                  <span className="font-mono font-bold text-teal-700 text-sm">
                    {docState.regNumber}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">
                    Qualification & Degrees
                  </span>
                  <span className="font-bold text-[#111827] text-sm">
                    {docState.qualification}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">
                    Department
                  </span>
                  <span className="font-bold text-[#111827] text-sm">
                    {docState.department}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">
                    Clinical Specialty
                  </span>
                  <span className="font-bold text-[#0D47A1] text-sm">
                    {docState.specialty}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">
                    Years of Experience
                  </span>
                  <span className="font-bold text-[#111827] text-sm">
                    {docState.experienceYrs} Years
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">
                    Consultation Fee
                  </span>
                  <span
                    className="font-bold text-[#0D47A1] text-sm"
                    style={{ fontFamily: PP }}
                  >
                    ${docState.consultationFee}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">
                    Appointment Slot Duration
                  </span>
                  <span className="font-bold text-[#111827] text-sm">
                    {docState.slotDuration || "15 Minutes"}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2">
                  <span className="text-[#64748B] block text-[11px]">
                    Account Status
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-block mt-1 ${
                      docState.status === "Active"
                        ? "bg-emerald-50 text-[#66BB6A] border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {docState.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3
                    className="text-base font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Weekly OPD Practice Schedule
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Assigned OPD cabinet:{" "}
                    <span className="font-bold text-teal-700">
                      {docState.opdRoom}
                    </span>
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0D47A1] bg-blue-50 px-3 py-1 rounded-xl border border-blue-100 shrink-0">
                  Shift: {docState.shiftTimings}
                </span>
              </div>

              <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-[#E5E7EB]">
                    <tr
                      className="text-[#64748B] font-bold"
                      style={{ fontFamily: PP }}
                    >
                      <th className="px-4 py-3">Day</th>
                      <th className="px-4 py-3">Available</th>
                      <th className="px-4 py-3">Start Time</th>
                      <th className="px-4 py-3">End Time</th>
                      <th className="px-4 py-3">Slot Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#111827]">
                    {MOCK_WEEKLY_SCHEDULE.map((sched) => (
                      <tr
                        key={sched.day}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-bold">{sched.day}</td>
                        <td className="px-4 py-3">
                          {sched.available ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-[#009688] border border-teal-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#009688]" />{" "}
                              Available
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />{" "}
                              Not Available
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {sched.startTime}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {sched.endTime}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#0D47A1]">
                          {sched.slotDuration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {scheduleExceptions.length > 0 && (
                <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Schedule Exceptions & Leave Overrides
                  </h4>
                  <div className="space-y-2">
                    {scheduleExceptions.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#111827] block">
                            {ex.exceptionDate || `${ex.startDate || ''} - ${ex.endDate || ''}`}
                          </span>
                          <span className="text-[#64748B] text-[11px]">{ex.reason}</span>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md border border-amber-300">
                          {ex.exceptionType || "Holiday Exception"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={apptSearch}
                    onChange={(e) => setApptSearch(e.target.value)}
                    placeholder="Search Appointment ID, Patient Name..."
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                  />
                  {apptSearch && (
                    <button
                      onClick={() => setApptSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                    <Filter size={13} className="text-slate-400" />
                    <span className="text-slate-500 font-medium">
                      Filter Date:
                    </span>
                    <select
                      value={apptDateFilter}
                      onChange={(e) => setApptDateFilter(e.target.value)}
                      className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                    >
                      <option value="All Dates">All Dates</option>
                      <option value="Today">Today</option>
                      <option value="This Week">This Week</option>
                      <option value="This Month">This Month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB]">
                    <tr
                      className="text-[#64748B] font-bold"
                      style={{ fontFamily: PP }}
                    >
                      <th className="px-4 py-3">Appointment ID</th>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#111827]">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-28" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-20" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-slate-200 rounded-full w-20" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-slate-200 rounded w-16 ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : filteredAppointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Calendar size={28} className="text-slate-300" />
                            <span
                              className="font-bold text-[#111827]"
                              style={{ fontFamily: PP }}
                            >
                              No appointments found.
                            </span>
                            <span className="text-xs text-[#64748B]">
                              No appointments matching your current search or
                              date filter.
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr
                          key={apt.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">
                            {apt.id}
                          </td>
                          <td
                            className="px-4 py-3 font-bold text-[#111827]"
                            style={{ fontFamily: PP }}
                          >
                            {apt.patientName}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {apt.date}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {apt.time}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                apt.status === "Completed"
                                  ? "bg-emerald-50 text-[#66BB6A] border-emerald-200"
                                  : apt.status === "In Progress"
                                    ? "bg-blue-50 text-[#0D47A1] border-blue-200"
                                    : "bg-amber-50 text-[#F59E0B] border-amber-200"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedApptDetail(apt)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0D47A1] font-bold text-xs transition-colors"
                              style={{ fontFamily: PP }}
                            >
                              View Appointment
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
              <div className="relative max-w-md">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search Patient ID, Name, Complaint..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
                {patientSearch && (
                  <button
                    onClick={() => setPatientSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB]">
                    <tr
                      className="text-[#64748B] font-bold"
                      style={{ fontFamily: PP }}
                    >
                      <th className="px-4 py-3">Patient ID</th>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Gender</th>
                      <th className="px-4 py-3">Age</th>
                      <th className="px-4 py-3">Last Visit</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#111827]">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-28" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-12" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-10" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 bg-slate-200 rounded w-20" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-slate-200 rounded-full w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-slate-200 rounded w-20 ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <User size={28} className="text-slate-300" />
                            <span
                              className="font-bold text-[#111827]"
                              style={{ fontFamily: PP }}
                            >
                              No assigned patients.
                            </span>
                            <span className="text-xs text-[#64748B]">
                              No patient records matching search criteria for
                              this doctor.
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((pt) => (
                        <tr
                          key={pt.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">
                            {pt.id}
                          </td>
                          <td
                            className="px-4 py-3 font-bold text-[#111827]"
                            style={{ fontFamily: PP }}
                          >
                            {pt.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {pt.gender}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {pt.age} Yrs
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {pt.lastVisit}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                pt.status === "Active"
                                  ? "bg-emerald-50 text-[#66BB6A] border-emerald-200"
                                  : pt.status === "Admitted"
                                    ? "bg-blue-50 text-[#0D47A1] border-blue-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {pt.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() =>
                                triggerToast(
                                  `Viewing profile for ${pt.name} (${pt.id})...`,
                                )
                              }
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0D47A1] font-bold text-xs transition-colors"
                              style={{ fontFamily: PP }}
                            >
                              View Patient Profile
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-6">
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Chronological Activity Log
                </h3>
                <p className="text-xs text-[#64748B]">
                  Audit trajectory of consultation events, schedule changes, and
                  registration records.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {MOCK_DOCTOR_TIMELINE.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className="relative flex items-start gap-4 group"
                    >
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#0D47A1] flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB] flex-1 space-y-1 hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span
                            className="font-bold text-[#111827] text-xs flex items-center gap-1.5"
                            style={{ fontFamily: PP }}
                          >
                            <IconComp size={14} className="text-[#0D47A1]" />{" "}
                            {item.title}
                          </span>
                          <span className="text-[11px] text-[#64748B] font-mono">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div
                className="w-12 h-12 rounded-xl bg-[#0D47A1] text-white font-bold text-base flex items-center justify-center shrink-0"
                style={{ fontFamily: PP }}
              >
                {initials}
              </div>
              <div className="truncate">
                <span
                  className="font-bold text-[#111827] text-sm truncate block"
                  style={{ fontFamily: PP }}
                >
                  {docState.name}
                </span>
                <span className="text-xs text-[#0D47A1] font-semibold truncate block">
                  {docState.specialty}
                </span>
                <span className="text-[11px] text-[#64748B] truncate block">
                  {docState.department}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-[#64748B]">OPD Cabinet:</span>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {docState.opdRoom}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Shift Timings:</span>
                <span className="font-medium text-[#111827]">
                  {docState.shiftTimings}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Consultation Fee:</span>
                <span
                  className="font-bold text-[#0D47A1]"
                  style={{ fontFamily: PP }}
                >
                  ${docState.consultationFee}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Clock size={14} className="text-[#009688]" /> Today's Upcoming
              Queue
            </h3>

            <div className="space-y-2.5 text-xs">
              {MOCK_DOCTOR_APPOINTMENTS.slice(0, 3).map((apt) => (
                <div
                  key={apt.id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {apt.patientName}
                    </span>
                    <span className="font-mono text-[10px] text-[#0D47A1] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                      {apt.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {apt.complaint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedApptDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#0D47A1]" />
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Appointment Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedApptDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Appointment ID</span>
                <span className="font-mono font-bold text-[#0D47A1]">
                  {selectedApptDetail.id}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Patient Name</span>
                <span className="font-bold text-[#111827]">
                  {selectedApptDetail.patientName} ({selectedApptDetail.gender}/
                  {selectedApptDetail.age}Y)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Date & Time</span>
                <span className="font-medium text-[#111827]">
                  {selectedApptDetail.date} &bull; {selectedApptDetail.time}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Visit Type</span>
                <span className="font-medium text-[#111827]">
                  {selectedApptDetail.type}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Status</span>
                <span className="font-semibold text-[#66BB6A]">
                  {selectedApptDetail.status}
                </span>
              </div>
              <div className="py-1">
                <span className="text-[#64748B] block text-[11px]">
                  Chief Complaint
                </span>
                <p className="text-[#111827] mt-0.5">
                  {selectedApptDetail.complaint}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApptDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                style={{ fontFamily: PP }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <EditDoctorDrawer
        isOpen={showEditDrawer}
        doctor={docState}
        onClose={() => setShowEditDrawer(false)}
        onSave={handleSaveEditDoctor}
        onDeactivateClick={() => setDeactivateDialogOpen(true)}
        onTriggerToast={triggerToast}
      />

      <DeactivateDoctorDialog
        isOpen={deactivateDialogOpen}
        doctor={docState}
        onClose={() => setDeactivateDialogOpen(false)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
