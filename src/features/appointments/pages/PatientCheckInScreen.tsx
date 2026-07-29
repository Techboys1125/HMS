import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  Clock,
  Info,
  Search,
  UserCheck,
  CheckCircle2,
  Printer,
} from "lucide-react";
import { PP, RB } from "../constants/appointment.constants";
import { Chip } from "../components/Chip";
import type { PatientCheckInScreenProps } from "../types/appointment-screen.types";

export function PatientCheckInScreen({
  onBack,
  onCheckInSuccess,
  onViewQueueClick,
  onViewPatientProfileClick,
  initialMrn,
  initialAptId,
}: PatientCheckInScreenProps) {
  // Appointment lookup state
  const [aptSearchQuery, setAptSearchQuery] = useState(
    initialAptId || initialMrn || "",
  );

  // Mock appointments database for lookup
  const [checkInApts] = useState([
    {
      aptId: "APT-2026-8912",
      token: "TK-086",
      mrn: "MRN-892101",
      patientName: "Sarah Mitchell",
      age: 34,
      gender: "Female",
      bloodGroup: "A+",
      mobile: "+91 98765 43210",
      emergencyContact: "+91 98765 00000 (Spouse)",
      doctor: "Dr. Arjun Mehta",
      dept: "Cardiology",
      date: "2026-07-24",
      timeSlot: "09:00 AM",
      visitType: "New Consultation",
      status: "Scheduled",
    },
    {
      aptId: "APT-2026-8913",
      token: "TK-087",
      mrn: "MRN-892102",
      patientName: "James Thornton",
      age: 67,
      gender: "Male",
      bloodGroup: "O+",
      mobile: "+91 98765 43211",
      emergencyContact: "+91 98765 11111 (Daughter)",
      doctor: "Dr. Priya Sharma",
      dept: "General OPD",
      date: "2026-07-24",
      timeSlot: "09:15 AM",
      visitType: "Follow-up",
      status: "Scheduled",
    },
    {
      aptId: "APT-2026-8914",
      token: "TK-088",
      mrn: "MRN-892103",
      patientName: "Emma Reyes",
      age: 28,
      gender: "Female",
      bloodGroup: "B+",
      mobile: "+91 98765 43212",
      emergencyContact: "+91 98765 22222 (Mother)",
      doctor: "Dr. Sunita Patel",
      dept: "Gynecology",
      date: "2026-07-24",
      timeSlot: "09:30 AM",
      visitType: "New Consultation",
      status: "Checked-In",
    },
    {
      aptId: "APT-2026-8915",
      token: "TK-089",
      mrn: "MRN-892104",
      patientName: "Robert Chen",
      age: 52,
      gender: "Male",
      bloodGroup: "AB+",
      mobile: "+91 98765 43213",
      emergencyContact: "+91 98765 33333 (Wife)",
      doctor: "Dr. Arjun Mehta",
      dept: "Cardiology",
      date: "2026-07-24",
      timeSlot: "10:00 AM",
      visitType: "Follow-up",
      status: "Scheduled",
    },
    {
      aptId: "APT-2026-8916",
      token: "TK-090",
      mrn: "MRN-892105",
      patientName: "Aisha Kumar",
      age: 41,
      gender: "Female",
      bloodGroup: "O-",
      mobile: "+91 98765 43214",
      emergencyContact: "+91 98765 44444 (Brother)",
      doctor: "Dr. Rajesh Kapoor",
      dept: "Neurology",
      date: "2026-07-24",
      timeSlot: "10:15 AM",
      visitType: "New Consultation",
      status: "Scheduled",
    },
    {
      aptId: "APT-2026-8917",
      token: "TK-091",
      mrn: "MRN-892106",
      patientName: "David Walsh",
      age: 38,
      gender: "Male",
      bloodGroup: "A-",
      mobile: "+91 98765 43215",
      emergencyContact: "+91 98765 55555 (Sister)",
      doctor: "Dr. Priya Sharma",
      dept: "General OPD",
      date: "2026-07-24",
      timeSlot: "10:30 AM",
      visitType: "New Consultation",
      status: "Scheduled",
    },
    {
      aptId: "APT-2026-8918",
      token: "TK-092",
      mrn: "MRN-892107",
      patientName: "Nina Patel",
      age: 29,
      gender: "Female",
      bloodGroup: "B-",
      mobile: "+91 98765 43216",
      emergencyContact: "+91 98765 66666 (Father)",
      doctor: "Dr. Rajesh Kapoor",
      dept: "Dermatology",
      date: "2026-07-24",
      timeSlot: "11:00 AM",
      visitType: "Follow-up",
      status: "Scheduled",
    },
    {
      aptId: "APT-2026-8919",
      token: "TK-093",
      mrn: "MRN-892108",
      patientName: "Carlos Mendez",
      age: 63,
      gender: "Male",
      bloodGroup: "O+",
      mobile: "+91 98765 43217",
      emergencyContact: "+91 98765 77777 (Wife)",
      doctor: "Dr. Priya Sharma",
      dept: "General OPD",
      date: "2026-07-24",
      timeSlot: "11:30 AM",
      visitType: "New Consultation",
      status: "Scheduled",
    },
  ]);

  const [selectedApt, setSelectedApt] = useState(() => {
    if (initialAptId || initialMrn) {
      const target = (initialAptId || initialMrn || "").toLowerCase().trim();
      const found = checkInApts.find(
        (a) =>
          a.aptId.toLowerCase() === target ||
          a.mrn.toLowerCase() === target ||
          (a.token && a.token.toLowerCase() === target),
      );
      return found || checkInApts[0];
    }
    return checkInApts[0];
  });

  // Section 03 Form fields
  const [arrivalTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });
  const [consultationType, setConsultationType] = useState<
    "Appointment" | "Walk-In"
  >("Appointment");
  const [remarks, setRemarks] = useState("");

  // Generated token & queue assignment details
  const generatedToken = useMemo(
    () => `TK-08${Math.floor(6 + Math.random() * 5)}`,
    [],
  );
  const queuePosition = 3;
  const estWaitTime = "12 mins";

  // Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Search filter options
  const searchResults = useMemo(() => {
    if (!aptSearchQuery.trim()) return checkInApts;
    const q = aptSearchQuery.toLowerCase();
    return checkInApts.filter(
      (a) =>
        a.aptId.toLowerCase().includes(q) ||
        a.mrn.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.mobile.includes(q),
    );
  }, [aptSearchQuery, checkInApts]);

  // Perform Check-In
  const handlePerformCheckIn = () => {
    if (!selectedApt) return;
    setShowSuccessModal(true);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* ── HEADER & BREADCRUMB ── */}
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
            <span className="font-semibold text-[#0D47A1]">
              Patient Check-In
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Patient Check-In
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Verify appointment details and check the patient into today's
            consultation queue.
          </p>
        </div>

        {/* Quick View Queue Header Button */}
        <div>
          <button
            onClick={onViewQueueClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0D47A1] text-xs font-semibold hover:bg-blue-100 transition-all"
            style={{ fontFamily: PP }}
          >
            <Clock size={14} /> View OPD Live Queue
          </button>
        </div>
      </div>

      {/* ── INFORMATION ALERT CARD ── */}
      <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-white p-4 rounded-2xl border border-blue-100 shadow-sm flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Info size={18} />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>
            Check-In Information & Guidelines
          </h4>
          <ul className="text-slate-600 list-disc list-inside space-y-0.5 text-[11px]">
            <li>
              Check-In confirms patient physical arrival at the reception desk.
            </li>
            <li>
              A unique consultation <strong>Queue Token Number</strong> is
              automatically assigned.
            </li>
            <li>
              Patient status changes from{" "}
              <span className="font-semibold text-[#0D47A1]">Scheduled</span> to{" "}
              <span className="font-semibold text-[#009688]">Checked-In</span>.
            </li>
            <li>
              The consulting doctor will immediately see the patient in their
              live OPD waiting queue.
            </li>
          </ul>
        </div>
      </div>

      {/* ── MAIN WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CHECK-IN WORKSPACE (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">
          {/* SEARCH APPOINTMENT / PATIENT SEARCH */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Lookup Scheduled Appointment
              </h2>
              <span className="text-xs text-[#64748B]">
                Search today's bookings
              </span>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={aptSearchQuery}
                onChange={(e) => setAptSearchQuery(e.target.value)}
                placeholder="Search by Appointment ID, MRN, Patient Name or Mobile..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Instant Search Results Dropdown */}
            {aptSearchQuery.trim() !== "" && (
              <div className="max-h-48 overflow-y-auto border border-[#E5E7EB] rounded-xl divide-y divide-gray-100 bg-white shadow-lg">
                {searchResults.length > 0 ? (
                  searchResults.map((a) => (
                    <div
                      key={a.aptId}
                      onClick={() => {
                        setSelectedApt(a);
                        setAptSearchQuery("");
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <p className="font-bold text-[#111827]">
                          {a.patientName}{" "}
                          <span className="font-mono text-[11px] font-semibold text-[#0D47A1]">
                            ({a.mrn})
                          </span>
                        </p>
                        <p className="text-[11px] text-[#64748B]">
                          {a.doctor} · {a.dept} · {a.timeSlot}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {a.aptId}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching scheduled appointments found.
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedApt ? (
            <>
              {/* SECTION 01: APPOINTMENT DETAILS */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs"
                      style={{ fontFamily: PP }}
                    >
                      01
                    </div>
                    <h2
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Appointment Details
                    </h2>
                  </div>
                  <Chip
                    label={selectedApt.status}
                    variant={
                      selectedApt.status === "Scheduled"
                        ? "teal"
                        : selectedApt.status === "Checked-In"
                          ? "info"
                          : "error"
                    }
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block">
                      Appointment ID
                    </span>
                    <span className="font-mono font-bold text-[#0D47A1]">
                      {selectedApt.aptId}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block">
                      Appointment Date
                    </span>
                    <span className="font-mono font-bold text-[#111827]">
                      {selectedApt.date}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block">
                      Time Slot
                    </span>
                    <span className="font-mono font-bold text-[#009688]">
                      {selectedApt.timeSlot}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block">
                      Visit Type
                    </span>
                    <span className="font-bold text-[#111827]">
                      {selectedApt.visitType}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 02: PATIENT INFORMATION */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs"
                      style={{ fontFamily: PP }}
                    >
                      02
                    </div>
                    <h2
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Patient Master Record
                    </h2>
                  </div>
                  {onViewPatientProfileClick && (
                    <button
                      onClick={() => onViewPatientProfileClick(selectedApt.mrn)}
                      className="text-xs font-semibold text-[#0D47A1] hover:underline"
                    >
                      View Profile
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    {selectedApt.patientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#111827]">
                        {selectedApt.patientName}
                      </h3>
                      <span className="font-mono text-xs font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {selectedApt.mrn}
                      </span>
                    </div>
                    <p className="text-[#64748B]">
                      {selectedApt.age} yrs · {selectedApt.gender} · Blood
                      Group:{" "}
                      <span className="font-bold text-[#009688]">
                        {selectedApt.bloodGroup}
                      </span>
                    </p>
                    <p className="text-[#64748B]">
                      Mobile:{" "}
                      <span className="font-mono font-semibold text-[#111827]">
                        {selectedApt.mobile}
                      </span>{" "}
                      · Emergency:{" "}
                      <span className="text-slate-700">
                        {selectedApt.emergencyContact}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 03: CHECK-IN DETAILS FORM */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs"
                      style={{ fontFamily: PP }}
                    >
                      03
                    </div>
                    <h2
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Check-In Details
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Arrival Time */}
                  <div>
                    <label className="block font-semibold text-[#111827] mb-1">
                      Arrival Time (Auto-filled)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={arrivalTime}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] font-mono text-xs text-[#111827] cursor-not-allowed"
                    />
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <label className="block font-semibold text-[#111827] mb-1">
                      Consultation Category *
                    </label>
                    <div className="flex items-center gap-4 pt-1.5">
                      <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                        <input
                          type="radio"
                          name="consultationType"
                          checked={consultationType === "Appointment"}
                          onChange={() => setConsultationType("Appointment")}
                          className="accent-[#0D47A1]"
                        />
                        <span>Scheduled Appointment</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                        <input
                          type="radio"
                          name="consultationType"
                          checked={consultationType === "Walk-In"}
                          onChange={() => setConsultationType("Walk-In")}
                          className="accent-[#0D47A1]"
                        />
                        <span>Walk-In Patient</span>
                      </label>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#111827] mb-1">
                      Receptionist Check-In Remarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add optional notes for triage nurse or consulting doctor..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 04: QUEUE ASSIGNMENT PREVIEW */}
              <div className="bg-white rounded-2xl border border-[#009688] p-5 shadow-sm space-y-3 bg-gradient-to-b from-teal-50/30 to-white">
                <div className="flex items-center justify-between border-b border-teal-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg bg-teal-100 text-[#009688] flex items-center justify-center font-bold text-xs"
                      style={{ fontFamily: PP }}
                    >
                      04
                    </div>
                    <h2
                      className="text-base font-bold text-[#009688]"
                      style={{ fontFamily: PP }}
                    >
                      Queue Token Assignment
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#009688] font-bold text-[10px]">
                    Auto-Generated Queue Entry
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-teal-200">
                    <span className="text-[10px] text-[#64748B] block">
                      Assigned Doctor
                    </span>
                    <span className="font-bold text-[#111827]">
                      {selectedApt.doctor}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-teal-200">
                    <span className="text-[10px] text-[#64748B] block">
                      Department
                    </span>
                    <span className="font-semibold text-slate-700">
                      {selectedApt.dept}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-300">
                    <span className="text-[10px] text-[#009688] block">
                      Generated Token
                    </span>
                    <span className="font-mono text-base font-bold text-[#0D47A1]">
                      {generatedToken}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-teal-200">
                    <span className="text-[10px] text-[#64748B] block">
                      Est. Waiting Time
                    </span>
                    <span className="font-mono font-bold text-[#009688]">
                      {estWaitTime}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center space-y-2">
              <Clock size={36} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-[#111827]">
                No appointment selected for check-in.
              </p>
              <p className="text-xs text-slate-400">
                Search or select a scheduled appointment to begin patient
                check-in.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">
          {selectedApt ? (
            <>
              {/* CARD 01: Patient Summary */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
                  style={{ fontFamily: PP }}
                >
                  Patient Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Patient Name</span>
                    <span className="font-bold text-[#111827]">
                      {selectedApt.patientName}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">MRN</span>
                    <span className="font-mono font-bold text-[#0D47A1]">
                      {selectedApt.mrn}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Age / Gender</span>
                    <span className="text-[#111827]">
                      {selectedApt.age} yrs · {selectedApt.gender}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748B]">Blood Group</span>
                    <span className="font-bold text-[#009688]">
                      {selectedApt.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 02: Appointment Summary */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
                  style={{ fontFamily: PP }}
                >
                  Appointment Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Appointment Date</span>
                    <span className="font-mono font-bold text-[#111827]">
                      {selectedApt.date}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Time Slot</span>
                    <span className="font-mono font-bold text-[#009688]">
                      {selectedApt.timeSlot}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Consulting Doctor</span>
                    <span className="font-bold text-[#111827]">
                      {selectedApt.doctor}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Department</span>
                    <span className="text-slate-600">{selectedApt.dept}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748B]">Visit Type</span>
                    <span className="font-semibold text-[#111827]">
                      {selectedApt.visitType}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 03: Queue Summary */}
              <div className="bg-white rounded-2xl border border-[#0D47A1] p-5 shadow-sm space-y-3 bg-gradient-to-b from-blue-50/40 to-white">
                <h3
                  className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider border-b border-blue-100 pb-2 flex items-center justify-between"
                  style={{ fontFamily: PP }}
                >
                  <span>Queue Summary</span>
                  <Clock size={14} />
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-[#64748B]">Token Number</span>
                    <span className="font-mono font-bold text-[#0D47A1] text-sm">
                      {generatedToken}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-[#64748B]">Queue Position</span>
                    <span className="font-bold text-[#111827]">
                      #{queuePosition} in line
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-[#64748B]">Est. Waiting Time</span>
                    <span className="font-mono font-bold text-[#009688]">
                      {estWaitTime}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 pt-1">
                    <span className="text-[#64748B]">Current Queue Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-[#009688] font-bold text-[10px]">
                      Waiting
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 04: Quick Actions */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-2.5">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
                  style={{ fontFamily: PP }}
                >
                  Quick Actions
                </h3>
                <button
                  onClick={() =>
                    onViewPatientProfileClick &&
                    onViewPatientProfileClick(selectedApt.mrn)
                  }
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-semibold text-[#0D47A1] transition-colors"
                >
                  View Patient Profile <ChevronRight size={14} />
                </button>
                <button
                  onClick={() =>
                    alert(
                      `Printing Queue Token ${generatedToken} for ${selectedApt.patientName}...`,
                    )
                  }
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-[#009688] transition-colors"
                >
                  Print Queue Token <Printer size={14} />
                </button>
                <button
                  onClick={() =>
                    alert(
                      `Printing Appointment Slip for ${selectedApt.aptId}...`,
                    )
                  }
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#111827] transition-colors"
                >
                  Print Appointment Slip <Printer size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center text-xs text-slate-400">
              Select an appointment to inspect summary.
            </div>
          )}
        </div>
      </div>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-4 rounded-2xl shadow-lg flex items-center justify-between z-10">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-all"
          style={{ fontFamily: PP }}
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!selectedApt || selectedApt.status === "Cancelled"}
          onClick={handlePerformCheckIn}
          className="px-6 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: PP }}
        >
          <UserCheck size={16} /> Check-In Patient
        </button>
      </div>

      {/* ── SUCCESS DIALOG MODAL ── */}
      {showSuccessModal && selectedApt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-[#009688] flex items-center justify-center mb-1">
                <CheckCircle2 size={36} />
              </div>
              <h3
                className="text-xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Patient Checked-In Successfully
              </h3>
              <p className="text-xs text-[#64748B]">
                Patient assigned to today's doctor queue.
              </p>
            </div>

            {/* Confirmed Details Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[#64748B]">Queue Token</span>
                <span className="font-mono text-base font-bold text-[#0D47A1]">
                  {generatedToken}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Patient Name</span>
                <span className="font-bold text-[#111827]">
                  {selectedApt.patientName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">MRN</span>
                <span className="font-mono text-[#0D47A1]">
                  {selectedApt.mrn}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Consulting Doctor</span>
                <span className="font-semibold text-[#111827]">
                  {selectedApt.doctor}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Queue Position</span>
                <span className="font-bold text-[#111827]">
                  #{queuePosition} in line
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Est. Waiting Time</span>
                <span className="font-mono font-bold text-[#009688]">
                  {estWaitTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Status</span>
                <span className="font-bold text-[#009688]">Checked-In</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() =>
                  alert(`Printing Queue Token ${generatedToken}...`)
                }
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} /> Print Queue Token
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onViewQueueClick) onViewQueueClick();
                  else if (onCheckInSuccess) onCheckInSuccess(generatedToken);
                }}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-teal-50 text-xs font-semibold text-[#009688] hover:bg-teal-100 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Clock size={15} /> View OPD Live Queue
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                }}
                className="w-full py-2 rounded-xl text-xs text-[#64748B] font-medium hover:bg-slate-50 transition-all text-center"
              >
                Check-In Another Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
