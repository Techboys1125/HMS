import { useState, useMemo } from "react";
import {
  ChevronRight,
  UserPlus,
  Search,
  Calendar as CalendarIcon,
  CheckCircle2,
  Printer,
  UserCheck,
} from "lucide-react";
import type { PatientSummary } from "../types/appointment.types";
import { PP, RB, PATIENT_DATABASE } from "../constants/appointment.constants";
import type { ReceptionBookAppointmentScreenProps } from "../types/appointment-screen.types";

export function ReceptionBookAppointmentScreen({
  onBack,
  onConfirmSuccess,
  onRegisterNewPatientClick,
  onViewPatientProfileClick,
  initialMrn,
}: ReceptionBookAppointmentScreenProps) {
  // Section 01: Patient Search state
  const [patientQuery, setPatientQuery] = useState(initialMrn || "");
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(
    () => {
      if (initialMrn) {
        return (
          PATIENT_DATABASE.find(
            (p) =>
              p.mrn?.toLowerCase() === initialMrn.toLowerCase() ||
              String(p.id).toLowerCase() === initialMrn.toLowerCase(),
          ) || PATIENT_DATABASE[0]
        );
      }
      return PATIENT_DATABASE[0]; // default pre-selected patient for smooth demo
    },
  );

  // Patient search dropdown options
  const searchedPatients = useMemo(() => {
    if (!patientQuery.trim()) return PATIENT_DATABASE;
    const q = patientQuery.toLowerCase();
    return PATIENT_DATABASE.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.mrn || "").toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        String(p.id).toLowerCase().includes(q),
    );
  }, [patientQuery]);

  // Section 02: Department & Doctor Selection
  const [selectedDept, setSelectedDept] = useState("Cardiology");
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    "Interventional Cardiology",
  );
  const [selectedDocKey, setSelectedDocKey] = useState("Dr. Arjun Mehta");

  const doctorsList = [
    {
      key: "Dr. Arjun Mehta",
      name: "Dr. Arjun Mehta",
      dept: "Cardiology",
      spec: "Interventional Cardiology",
      exp: "14 Yrs Exp",
      fee: 800,
      availability: "Available Today (09:00 AM - 04:00 PM)",
    },
    {
      key: "Dr. Priya Sharma",
      name: "Dr. Priya Sharma",
      dept: "General OPD",
      spec: "Internal Medicine",
      exp: "10 Yrs Exp",
      fee: 500,
      availability: "Available Today (08:30 AM - 02:00 PM)",
    },
    {
      key: "Dr. Sunita Patel",
      name: "Dr. Sunita Patel",
      dept: "Gynecology",
      spec: "Obstetrics & Gynae",
      exp: "12 Yrs Exp",
      fee: 700,
      availability: "Available Today (10:00 AM - 05:00 PM)",
    },
    {
      key: "Dr. Rajesh Kapoor",
      name: "Dr. Rajesh Kapoor",
      dept: "Neurology",
      spec: "Clinical Neurology",
      exp: "18 Yrs Exp",
      fee: 1000,
      availability: "Available Today (11:00 AM - 03:00 PM)",
    },
  ];

  const filteredDoctors = doctorsList.filter(
    (d) => selectedDept === "All Departments" || d.dept === selectedDept,
  );
  const currentDoctor =
    doctorsList.find((d) => d.key === selectedDocKey) || doctorsList[0];

  // Section 03: Appointment Date Selection (Calendar)
  const [selectedDate, setSelectedDate] = useState("2026-07-24");
  const availableDates = [
    { date: "2026-07-24", day: "Fri", label: "Today", isAvailable: true },
    { date: "2026-07-25", day: "Sat", label: "Tomorrow", isAvailable: true },
    { date: "2026-07-27", day: "Mon", label: "27 Jul", isAvailable: true },
    { date: "2026-07-28", day: "Tue", label: "28 Jul", isAvailable: true },
    { date: "2026-07-29", day: "Wed", label: "29 Jul", isAvailable: false },
    { date: "2026-07-30", day: "Thu", label: "30 Jul", isAvailable: true },
  ];

  // Section 04: Time Slots Grid
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:30 AM");
  const timeSlotGroups = {
    morning: [
      { time: "09:00 AM", available: true },
      { time: "09:30 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "10:30 AM", available: true },
      { time: "11:00 AM", available: true },
    ],
    afternoon: [
      { time: "12:00 PM", available: true },
      { time: "12:30 PM", available: false },
      { time: "01:00 PM", available: true },
      { time: "02:00 PM", available: true },
    ],
    evening: [
      { time: "04:00 PM", available: true },
      { time: "04:30 PM", available: true },
      { time: "05:00 PM", available: false },
    ],
  };

  // Section 05: Visit Details
  const [visitType, setVisitType] = useState<"New Consultation" | "Follow-up">(
    "New Consultation",
  );
  const [chiefComplaint, setChiefComplaint] = useState(
    "Chest tightness and occasional breathlessness during walking.",
  );
  const [remarks, setRemarks] = useState("");

  // Modal & Confirmation State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedAptId, setConfirmedAptId] = useState("");
  const [notificationSent, setNotificationSent] = useState<{
    sms: boolean;
    email: boolean;
  }>({ sms: true, email: true });

  // Confirm Appointment Handler
  const handleConfirm = () => {
    if (!selectedPatient) return;
    const newAptId = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedAptId(newAptId);
    setShowSuccessModal(true);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* ── HEADER & BREADCRUMBS ── */}
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
              Appointment Booking
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Book Appointment
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Search a patient, select a doctor and confirm an appointment.
          </p>
        </div>

        {/* Header Action Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRegisterNewPatientClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0D47A1] text-xs font-semibold hover:bg-blue-100 transition-all"
            style={{ fontFamily: PP }}
          >
            <UserPlus size={14} /> Register New Patient
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: APPOINTMENT BOOKING FORM (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">
          {/* SECTION 01: PATIENT SEARCH */}
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
                  Patient Search & Selection
                </h2>
              </div>
              <span className="text-xs text-red-500 font-semibold">
                * Required
              </span>
            </div>

            {/* Patient Search Input */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="Search patient by MRN, Patient Name, Mobile Number or Appointment ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Instant Search Results Dropdown List */}
            {patientQuery.trim() !== "" && (
              <div className="max-h-48 overflow-y-auto border border-[#E5E7EB] rounded-xl divide-y divide-gray-100 bg-white shadow-lg">
                {searchedPatients.length > 0 ? (
                  searchedPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPatient(p);
                        setPatientQuery("");
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-[10px]">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#111827]">{p.name}</p>
                          <p className="text-[11px] text-[#64748B]">
                            {p.gender} · {p.age} yrs · {p.phone}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#0D47A1]">
                        {p.mrn}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching patient records found.
                    <button
                      onClick={onRegisterNewPatientClick}
                      className="ml-2 text-[#0D47A1] font-bold underline"
                    >
                      Register New Patient
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Selected Patient Card Display */}
            {selectedPatient ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {selectedPatient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#111827]">
                        {selectedPatient.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0D47A1] text-[10px] font-mono font-bold">
                        {selectedPatient.mrn}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {selectedPatient.age} yrs · {selectedPatient.gender} ·
                      Blood Group:{" "}
                      <span className="font-semibold text-[#009688]">
                        {selectedPatient.bloodGroup}
                      </span>{" "}
                      · Mobile:{" "}
                      <span className="font-mono">{selectedPatient.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      onViewPatientProfileClick &&
                      onViewPatientProfileClick(selectedPatient.mrn || "")
                    }
                    className="flex-1 md:flex-none px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors"
                  >
                    View Patient Profile
                  </button>
                  <button
                    type="button"
                    onClick={onRegisterNewPatientClick}
                    className="flex-1 md:flex-none px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Register New Patient
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400">
                Search for a patient to begin booking an appointment.
              </div>
            )}
          </div>

          {/* SECTION 02: DEPARTMENT & DOCTOR SELECTION */}
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
                  Department & Doctor Selection
                </h2>
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Select Department *
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#009688]"
                >
                  <option>Cardiology</option>
                  <option>General OPD</option>
                  <option>Gynecology</option>
                  <option>Neurology</option>
                  <option>Dermatology</option>
                  <option>Orthopedics</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Specialty *
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#009688]"
                >
                  <option>Interventional Cardiology</option>
                  <option>Internal Medicine</option>
                  <option>Obstetrics & Gynae</option>
                  <option>Clinical Neurology</option>
                </select>
              </div>
            </div>

            {/* Doctor Cards Selection */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-[#111827]">
                Available Doctors *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDoctors.map((doc) => {
                  const isSelected = selectedDocKey === doc.key;
                  return (
                    <div
                      key={doc.key}
                      onClick={() => setSelectedDocKey(doc.key)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-[#009688] bg-teal-50/50 shadow-sm ring-1 ring-[#009688]"
                          : "border-[#E5E7EB] bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.name.replace("Dr. ", "").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[#111827] truncate">
                            {doc.name}
                          </h4>
                          <span className="font-bold text-[#0D47A1]">
                            ₹{doc.fee}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B]">
                          {doc.dept} · {doc.spec}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
                          {doc.availability}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 03 & 04: CALENDAR DATE & TIME SLOTS */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-5">
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
                  Appointment Date & Time Slot
                </h2>
              </div>
            </div>

            {/* Date Selector Row */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-2">
                Select Date *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.date;
                  return (
                    <button
                      key={item.date}
                      type="button"
                      disabled={!item.isAvailable}
                      onClick={() => setSelectedDate(item.date)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        !item.isAvailable
                          ? "opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed"
                          : isSelected
                            ? "bg-[#0D47A1] border-[#0D47A1] text-white shadow-sm font-bold"
                            : "bg-white border-[#E5E7EB] text-[#111827] hover:border-blue-300"
                      }`}
                    >
                      <span className="block text-[10px] uppercase opacity-80">
                        {item.day}
                      </span>
                      <span className="block text-xs font-bold mt-0.5">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Grid */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-[#111827]">
                Select Time Slot *
              </label>

              {/* Morning Slots */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Morning Session
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {timeSlotGroups.morning.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                          !slot.available
                            ? "bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed"
                            : isSelected
                              ? "bg-[#009688] text-white border-[#009688] font-bold shadow-sm"
                              : "bg-slate-50 text-[#111827] border-[#E5E7EB] hover:bg-teal-50 hover:border-teal-300"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Afternoon Session
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {timeSlotGroups.afternoon.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                          !slot.available
                            ? "bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed"
                            : isSelected
                              ? "bg-[#009688] text-white border-[#009688] font-bold shadow-sm"
                              : "bg-slate-50 text-[#111827] border-[#E5E7EB] hover:bg-teal-50 hover:border-teal-300"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evening Slots */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  Evening Session
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {timeSlotGroups.evening.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                          !slot.available
                            ? "bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed"
                            : isSelected
                              ? "bg-[#009688] text-white border-[#009688] font-bold shadow-sm"
                              : "bg-slate-50 text-[#111827] border-[#E5E7EB] hover:bg-teal-50 hover:border-teal-300"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 05: VISIT DETAILS */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs"
                  style={{ fontFamily: PP }}
                >
                  04
                </div>
                <h2
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Visit Details
                </h2>
              </div>
            </div>

            {/* Visit Type Radio Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-2">
                Visit Type *
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                  <input
                    type="radio"
                    name="visitType"
                    checked={visitType === "New Consultation"}
                    onChange={() => setVisitType("New Consultation")}
                    className="accent-[#0D47A1]"
                  />
                  <span>New Consultation</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                  <input
                    type="radio"
                    name="visitType"
                    checked={visitType === "Follow-up"}
                    onChange={() => setVisitType("Follow-up")}
                    className="accent-[#0D47A1]"
                  />
                  <span>Follow-up Visit</span>
                </label>
              </div>
            </div>

            {/* Chief Complaint */}
            <div className="text-xs">
              <label className="block font-semibold text-[#111827] mb-1">
                Chief Complaint / Symptoms *
              </label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Describe patient's primary symptoms or reason for visit..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              />
            </div>

            {/* Remarks */}
            <div className="text-xs">
              <label className="block font-semibold text-[#111827] mb-1">
                Receptionist Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add optional notes for OPD staff..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL & SUMMARY (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">
          {/* CARD 01: Patient Summary Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
              style={{ fontFamily: PP }}
            >
              Patient Summary
            </h3>
            {selectedPatient ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Patient Name</span>
                  <span className="font-bold text-[#111827]">
                    {selectedPatient.name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {selectedPatient.mrn}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Age / Gender</span>
                  <span className="text-[#111827]">
                    {selectedPatient.age} yrs · {selectedPatient.gender}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Mobile Number</span>
                  <span className="font-mono text-[#111827]">
                    {selectedPatient.phone}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">
                No patient selected.
              </p>
            )}
          </div>

          {/* CARD 02: Doctor Summary Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
              style={{ fontFamily: PP }}
            >
              Doctor Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Consulting Doctor</span>
                <span className="font-bold text-[#111827]">
                  {currentDoctor.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Department</span>
                <span className="text-[#111827]">{currentDoctor.dept}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Specialization</span>
                <span className="text-[#111827]">{currentDoctor.spec}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Consultation Fee</span>
                <span className="font-bold text-[#0D47A1]">
                  ₹{currentDoctor.fee}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 03: Appointment Booking Summary */}
          <div className="bg-white rounded-2xl border border-[#0D47A1] p-5 shadow-sm space-y-3 bg-gradient-to-b from-blue-50/40 to-white">
            <h3
              className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider border-b border-blue-100 pb-2 flex items-center justify-between"
              style={{ fontFamily: PP }}
            >
              <span>Appointment Summary</span>
              <CalendarIcon size={14} />
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Appointment Date</span>
                <span className="font-mono font-bold text-[#111827]">
                  {selectedDate}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Time Slot</span>
                <span className="font-mono font-bold text-[#009688]">
                  {selectedTimeSlot}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Visit Type</span>
                <span className="font-semibold text-[#111827]">
                  {visitType}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Fee Payable</span>
                <span className="font-bold text-base text-[#0D47A1]">
                  ₹{currentDoctor.fee}
                </span>
              </div>
              <div className="flex justify-between py-1 pt-1">
                <span className="text-[#64748B]">Booking Status</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0D47A1] font-bold text-[10px]">
                  Scheduled
                </span>
              </div>
            </div>
          </div>

          {/* CARD 04: Quick Communications Toggle Actions */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2"
              style={{ fontFamily: PP }}
            >
              Notification Preferences
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 cursor-pointer">
                <span className="font-medium text-[#111827]">
                  Send SMS Notification
                </span>
                <input
                  type="checkbox"
                  checked={notificationSent.sms}
                  onChange={(e) =>
                    setNotificationSent((prev) => ({
                      ...prev,
                      sms: e.target.checked,
                    }))
                  }
                  className="accent-[#009688] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 cursor-pointer">
                <span className="font-medium text-[#111827]">
                  Send Email Confirmation
                </span>
                <input
                  type="checkbox"
                  checked={notificationSent.email}
                  onChange={(e) =>
                    setNotificationSent((prev) => ({
                      ...prev,
                      email: e.target.checked,
                    }))
                  }
                  className="accent-[#009688] w-4 h-4"
                />
              </label>
            </div>
          </div>
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
          onClick={handleConfirm}
          disabled={!selectedPatient}
          className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: PP }}
        >
          <CheckCircle2 size={16} /> Confirm Appointment
        </button>
      </div>

      {/* ── SUCCESS DIALOG MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mb-1">
                <CheckCircle2 size={36} />
              </div>
              <h3
                className="text-xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Appointment Booked Successfully
              </h3>
              <p className="text-xs text-[#64748B]">
                OPD appointment slot confirmed in HMS queue.
              </p>
            </div>

            {/* Confirmed Details Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[#64748B]">Appointment ID</span>
                <span className="font-mono text-base font-bold text-[#0D47A1]">
                  {confirmedAptId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Patient</span>
                <span className="font-bold text-[#111827]">
                  {selectedPatient?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Doctor</span>
                <span className="font-semibold text-[#111827]">
                  {currentDoctor.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Department</span>
                <span className="text-slate-600">{currentDoctor.dept}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Date & Slot</span>
                <span className="font-mono font-bold text-[#009688]">
                  {selectedDate} at {selectedTimeSlot}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Status</span>
                <span className="font-bold text-[#66BB6A]">Scheduled</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  alert(`Printing Appointment Slip for ${confirmedAptId}...`);
                }}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} /> Print Appointment Slip
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onConfirmSuccess) onConfirmSuccess(confirmedAptId);
                  else if (onBack) onBack();
                }}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-teal-50 text-xs font-semibold text-[#009688] hover:bg-teal-100 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <UserCheck size={15} /> Patient Check-In
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                }}
                className="w-full py-2 rounded-xl text-xs text-[#64748B] font-medium hover:bg-slate-50 transition-all text-center"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
