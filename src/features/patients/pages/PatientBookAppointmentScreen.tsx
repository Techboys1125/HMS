import { useState, useEffect } from "react";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Stethoscope,
  FileText,
  Clock,
  CheckCircle2,
  Building2,
  Star,
  Info,
  Check,
} from "lucide-react";
import type { PatientAppointment } from "../types/patient.types";
import type { DoctorSummary } from "../../appointments/types/appointment.types";
import { PP, RB } from "../constants/patient.mock";
import { appointmentService } from "../../appointments/services/appointment.service";

export function PatientBookAppointmentScreen({
  onBack,
  onAppointmentBooked,
  onViewDetails,
}: {
  onBack?: () => void;
  onAppointmentBooked?: (newAppt: PatientAppointment) => void;
  onViewDetails?: (appt: PatientAppointment) => void;
}) {
  // Form State
  const [selectedDept, setSelectedDept] = useState("Cardiology");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("2025-03-30");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:30 AM");
  const [visitType, setVisitType] = useState<"New Consultation" | "Follow-up">(
    "New Consultation",
  );
  const [chiefComplaint, setChiefComplaint] = useState(
    "Mild chest tightness and fatigue after physical exertion for past 2 days.",
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    "No known drug allergies. Currently taking daily multivitamins.",
  );

  // Status & Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<PatientAppointment | null>(
    null,
  );
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);

  useEffect(() => {
    appointmentService.listDoctors().then((data) => {
      setDoctors(data);
    }).catch(() => {});
  }, []);

  const mappedDoctors = doctors.map((d) => ({
    id: String(d.id),
    name: d.name,
    qualification: d.qualification || "",
    specialization: d.specialty || "",
    department: d.departmentName || d.department || "",
    consultationFee: d.consultationFee ? `$${Number(d.consultationFee).toFixed(2)}` : "$0.00",
    avatar: d.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .replace("Dr", "")
      .trim()
      .slice(0, 2)
      .toUpperCase() || d.name.slice(0, 2).toUpperCase(),
    availableToday: true,
    availability: "Available Today",
    rating: "0",
    reviewCount: 0,
    experience: "",
  }));

  // Filtered Doctors by Department & Specialty
  const availableDoctors = mappedDoctors.filter((doc) => {
    if (selectedDept !== "All" && doc.department !== selectedDept) return false;
    if (
      selectedSpecialty !== "All Specialties" &&
      doc.specialization !== selectedSpecialty
    )
      return false;
    return true;
  });

  // Selected Doctor Object
  const selectedDoctor =
    mappedDoctors.find((d) => d.id === selectedDoctorId) ||
    availableDoctors[0] ||
    mappedDoctors[0];

  // Specialties mapping by department
  const departmentSpecialties: Record<string, string[]> = {
    Cardiology: [
      "All Specialties",
      "Senior Interventional Cardiologist",
      "Cardiac Electrophysiology",
      "Pediatric Cardiology",
    ],
    "General Medicine": [
      "All Specialties",
      "Senior Physician & Diabetologist",
      "Internal Medicine",
      "Endocrinology",
    ],
    Neurology: [
      "All Specialties",
      "Consultant Neurologist",
      "Neurovascular",
      "Spine Neurology",
    ],
    Gynecology: [
      "All Specialties",
      "Senior Gynecologist & Obstetrician",
      "Maternal-Fetal Medicine",
      "Gynae Oncology",
    ],
    Pediatrics: [
      "All Specialties",
      "Consultant Pediatrician",
      "Neonatology",
      "Pediatric Cardiology",
    ],
    Orthopedics: [
      "All Specialties",
      "Joint Replacement & Spine Surgeon",
      "Sports Medicine",
      "Spine Surgery",
    ],
  };

  const currentSpecialties = departmentSpecialties[selectedDept] || [
    "All Specialties",
  ];

  // Calendar dates generator for March 2025
  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2025-03-${dayNum < 10 ? "0" + dayNum : dayNum}`;
    const isToday = dayNum === 24;
    const isAvailable = dayNum >= 24 && dayNum !== 27 && dayNum !== 28;
    return {
      dayNum,
      dateStr,
      isToday,
      isAvailable,
      dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][(i + 6) % 7],
    };
  });

  // Submit Handler
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `APT-2025-00${Math.floor(Math.random() * 90) + 10}`;
      const newAppt: PatientAppointment = {
        id: generatedId,
        date: selectedDate,
        time: selectedTimeSlot,
        doctor: selectedDoctor?.name || "Not Selected",
        specialty: selectedDoctor
          ? selectedDoctor.specialization
          : "Senior Cardiologist",
        department: selectedDept,
        visitType:
          visitType === "New Consultation" ? "In-Person OPD" : "Follow-up OPD",
        status: "Scheduled",
        roomLocation:
          selectedDept === "Cardiology"
            ? "Wing A, OPD Room 102"
            : "Wing B, OPD Room 204",
        reason: chiefComplaint,
        notes: additionalNotes,
        consultationStatus: "Scheduled",
        prescriptionStatus: "Pending Consultation",
        billingStatus: `Pending (${selectedDoctor ? selectedDoctor.consultationFee : "$65.00"})`,
        billingAmount: selectedDoctor
          ? selectedDoctor.consultationFee
          : "$65.00",
      };

      setConfirmedAppt(newAppt);
      setIsSubmitting(false);
      setShowSuccessView(true);

      if (onAppointmentBooked) {
        onAppointmentBooked(newAppt);
      }
    }, 600);
  };

  // Success Confirmation View
  if (showSuccessView && confirmedAppt) {
    return (
      <div
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Appointment Confirmation
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1">
              <span>Patient Portal</span>
              <ChevronRight size={13} className="text-slate-400" />
              <span>Appointments</span>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="font-semibold text-[#111827]">Confirmation</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={15} /> Back to My Appointments
          </button>
        </div>

        {/* Confirmation Container Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#66BB6A] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <h2
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Appointment Booked Successfully!
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Your OPD appointment has been registered with the Healthcare
              Operations Center.
            </p>
            <div className="inline-block mt-3 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full font-mono text-xs font-bold text-[#0D47A1]">
              Appointment ID: {confirmedAppt.id}
            </div>
          </div>

          {/* Details Summary Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-[#E5E7EB] text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D47A1] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {selectedDoctor ? selectedDoctor.avatar : "AM"}
                </div>
                <div>
                  <h4
                    className="font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {confirmedAppt.doctor}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    {confirmedAppt.specialty} · {confirmedAppt.department}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1]">
                {confirmedAppt.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Appointment Date
                </span>
                <span className="font-semibold text-[#111827]">
                  {confirmedAppt.date}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Time Slot
                </span>
                <span className="font-bold text-[#0D47A1]">
                  {confirmedAppt.time}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Visit Type
                </span>
                <span className="font-medium text-slate-700">
                  {confirmedAppt.visitType}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Hospital OPD Location
                </span>
                <span className="font-medium text-slate-700">
                  {confirmedAppt.roomLocation}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Consultation Fee
                </span>
                <span className="font-bold text-[#009688]">
                  {confirmedAppt.billingAmount} (OPD Counter)
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Chief Complaint
                </span>
                <span className="font-medium text-slate-700 truncate block">
                  {confirmedAppt.reason}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onViewDetails) onViewDetails(confirmedAppt);
                else if (onBack) onBack();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              View Appointment Details
            </button>
            <button
              type="button"
              onClick={() => {
                if (onBack) onBack();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#64748B] text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Return to My Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Book Appointment
          </h1>
          <p
            className="text-xs text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Choose a doctor, preferred date and available time slot.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-1.5">
            <span>Patient Portal</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span>Appointments</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="font-semibold text-[#111827]">
              Book Appointment
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={15} /> Cancel Booking
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN LAYOUT ── */}
      <form
        onSubmit={handleConfirmBooking}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Workspace (8 Cols): 5 Form Sections */}
        <div className="lg:col-span-8 space-y-6">
          {/* ── SECTION 01: DEPARTMENT SELECTION ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h2
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Department Selection
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                  style={{ fontFamily: PP }}
                >
                  Select Department *
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setSelectedSpecialty("All Specialties");
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                >
                  <option value="Cardiology">
                    Cardiology (Heart & Vascular)
                  </option>
                  <option value="General Medicine">
                    General Medicine (OPD)
                  </option>
                  <option value="Neurology">Neurology (Brain & Spine)</option>
                  <option value="Gynecology">Gynecology & Obstetrics</option>
                  <option value="Pediatrics">Pediatrics (Child Care)</option>
                  <option value="Orthopedics">
                    Orthopedics (Bones & Joints)
                  </option>
                </select>
              </div>

              <div>
                <label
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                  style={{ fontFamily: PP }}
                >
                  Filter Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                >
                  {currentSpecialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── SECTION 02: DOCTOR SELECTION ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h2
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Doctor Selection
                </h2>
              </div>
              <span className="text-xs text-[#64748B]">
                {availableDoctors.length} Doctors Available
              </span>
            </div>

            {availableDoctors.length === 0 ? (
              /* Empty State */
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <Stethoscope size={32} className="mx-auto text-slate-400" />
                <h4
                  className="text-xs font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  No doctors available
                </h4>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  No doctors available for the selected department or date.
                  Please select another date or department.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDept("Cardiology");
                    setSelectedSpecialty("All Specialties");
                  }}
                  className="mt-2 text-xs font-bold text-[#0D47A1] hover:underline"
                >
                  Reset Department Selection
                </button>
              </div>
            ) : (
              /* Doctor Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDoctors.map((doc) => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                        isSelected
                          ? "border-[#0D47A1] bg-blue-50/40 shadow-sm ring-2 ring-[#0D47A1]/20"
                          : "border-[#E5E7EB] bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#0D47A1] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                          {doc.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3
                              className="text-xs font-bold text-[#111827] truncate"
                              style={{ fontFamily: PP }}
                            >
                              {doc.name}
                            </h3>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                              <Star
                                size={11}
                                className="fill-amber-500 text-amber-500"
                              />{" "}
                              {doc.rating} ({doc.reviewCount})
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] truncate">
                            {doc.qualification}
                          </p>
                          <p className="text-[11px] font-semibold text-[#0D47A1] truncate mt-0.5">
                            {doc.specialization}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-[#64748B] block text-[10px]">
                            Experience
                          </span>
                          <span className="font-semibold text-slate-700">
                            {doc.experience}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#64748B] block text-[10px]">
                            Consultation Fee
                          </span>
                          <span className="font-bold text-[#009688]">
                            {doc.consultationFee}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            doc.availableToday
                              ? "bg-emerald-50 text-[#66BB6A]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {doc.availability}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoctorId(doc.id);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            isSelected
                              ? "bg-[#0D47A1] text-white shadow-sm"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                          style={{ fontFamily: PP }}
                        >
                          {isSelected ? "✓ Selected" : "Select Doctor"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── SECTION 03: APPOINTMENT DATE ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h2
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Appointment Date
                </h2>
              </div>
              <span className="text-xs font-bold text-[#0D47A1]">
                March 2025
              </span>
            </div>

            {/* Reusable Calendar Component */}
            <div className="space-y-3">
              <div
                className="flex items-center justify-between px-2 text-xs font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#0D47A1]" /> March 2025
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="p-1 text-slate-300 rounded hover:bg-slate-100"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-slate-600 rounded hover:bg-slate-100"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#64748B] uppercase tracking-wider py-1 border-y border-slate-100">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.slice(0, 14).map((day) => {
                  const isSelected = selectedDate === day.dateStr;
                  return (
                    <button
                      key={day.dayNum}
                      type="button"
                      disabled={!day.isAvailable}
                      onClick={() => setSelectedDate(day.dateStr)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all flex flex-col items-center justify-center gap-0.5 min-h-[46px] ${
                        isSelected
                          ? "bg-[#0D47A1] text-white shadow-sm font-bold ring-2 ring-[#0D47A1]/20"
                          : day.isAvailable
                            ? "bg-slate-50 text-[#111827] hover:bg-blue-50 hover:text-[#0D47A1] border border-slate-200"
                            : "bg-slate-100/60 text-slate-300 border border-slate-100 cursor-not-allowed line-through"
                      }`}
                    >
                      <span className="text-[10px] opacity-75">
                        {day.dayName}
                      </span>
                      <span>{day.dayNum}</span>
                      {day.isToday && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[#64748B] pt-2 px-1 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-md bg-[#0D47A1]" />{" "}
                  Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-md bg-[#009688]" /> Today
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-md bg-slate-50 border border-slate-200" />{" "}
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-md bg-slate-100 border border-slate-100" />{" "}
                  Unavailable
                </span>
              </div>
            </div>
          </div>

          {/* ── SECTION 04: AVAILABLE TIME SLOTS ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                  4
                </div>
                <h2
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Available Time Slots
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#0D47A1] flex items-center gap-1">
                <Clock size={13} /> {selectedTimeSlot} Selected
              </span>
            </div>

            <div className="space-y-4">
              {/* Morning Slots */}
              <div>
                <span
                  className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2"
                  style={{ fontFamily: PP }}
                >
                  Morning
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { time: "09:00 AM", available: true },
                    { time: "09:30 AM", available: true },
                    { time: "10:00 AM", available: false },
                    { time: "10:30 AM", available: true },
                    { time: "11:00 AM", available: true },
                  ].map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between ${
                          isSelected
                            ? "bg-[#0D47A1] text-white shadow-sm ring-2 ring-[#0D47A1]/20"
                            : slot.available
                              ? "bg-slate-50 text-[#111827] border border-[#E5E7EB] hover:bg-blue-50 hover:border-blue-200"
                              : "bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed line-through"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && (
                          <Check size={14} className="text-white" />
                        )}
                        {!slot.available && (
                          <span className="text-[9px] no-underline">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div>
                <span
                  className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2"
                  style={{ fontFamily: PP }}
                >
                  Afternoon
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { time: "02:00 PM", available: true },
                    { time: "02:30 PM", available: true },
                    { time: "03:00 PM", available: true },
                    { time: "03:30 PM", available: false },
                  ].map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between ${
                          isSelected
                            ? "bg-[#0D47A1] text-white shadow-sm ring-2 ring-[#0D47A1]/20"
                            : slot.available
                              ? "bg-slate-50 text-[#111827] border border-[#E5E7EB] hover:bg-blue-50 hover:border-blue-200"
                              : "bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed line-through"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && (
                          <Check size={14} className="text-white" />
                        )}
                        {!slot.available && (
                          <span className="text-[9px] no-underline">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evening Slots */}
              <div>
                <span
                  className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2"
                  style={{ fontFamily: PP }}
                >
                  Evening
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { time: "04:30 PM", available: true },
                    { time: "05:00 PM", available: true },
                    { time: "05:30 PM", available: true },
                  ].map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between ${
                          isSelected
                            ? "bg-[#0D47A1] text-white shadow-sm ring-2 ring-[#0D47A1]/20"
                            : slot.available
                              ? "bg-slate-50 text-[#111827] border border-[#E5E7EB] hover:bg-blue-50 hover:border-blue-200"
                              : "bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed line-through"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && (
                          <Check size={14} className="text-white" />
                        )}
                        {!slot.available && (
                          <span className="text-[9px] no-underline">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 05: VISIT DETAILS ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                5
              </div>
              <h2
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Visit Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Visit Type */}
              <div>
                <label
                  className="block text-xs font-bold text-[#111827] mb-2"
                  style={{ fontFamily: PP }}
                >
                  Visit Type *
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setVisitType("New Consultation")}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      visitType === "New Consultation"
                        ? "border-[#0D47A1] bg-blue-50 text-[#0D47A1] shadow-sm"
                        : "border-[#E5E7EB] bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Building2 size={15} /> New Consultation
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType("Follow-up")}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      visitType === "Follow-up"
                        ? "border-[#0D47A1] bg-blue-50 text-[#0D47A1] shadow-sm"
                        : "border-[#E5E7EB] bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Stethoscope size={15} /> Follow-up
                  </button>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <label
                  className="block text-xs font-bold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  Chief Complaint *
                </label>
                <textarea
                  rows={3}
                  required
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Describe your symptoms, main health concern or reason for booking..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
              </div>

              {/* Optional Notes */}
              <div>
                <label
                  className="block text-xs font-bold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  Optional Notes
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any ongoing medications, allergies, or special assistance required..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (4 Cols): Selected Doctor, Summary, Important Info */}
        <div className="lg:col-span-4 space-y-4">
          {/* CARD 01: SELECTED DOCTOR */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <Stethoscope size={15} className="text-[#0D47A1]" /> Selected
              Doctor
            </h3>

            {selectedDoctor ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0D47A1] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                    {selectedDoctor.avatar}
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {selectedDoctor.name}
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      {selectedDoctor.qualification}
                    </p>
                    <p className="text-[11px] font-semibold text-[#0D47A1] mt-0.5">
                      {selectedDoctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-blue-100">
                  <div>
                    <span className="text-[#64748B] text-[10px] block">
                      Department
                    </span>
                    <span className="font-semibold text-slate-700">
                      {selectedDoctor.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">
                      Consultation Fee
                    </span>
                    <span className="font-bold text-[#009688]">
                      {selectedDoctor.consultationFee}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#64748B]">No doctor selected.</p>
            )}
          </div>

          {/* CARD 02: APPOINTMENT SUMMARY */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <FileText size={15} className="text-[#009688]" /> Appointment
              Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#111827]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Department:</span>
                <span className="font-bold">{selectedDept}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Doctor:</span>
                <span className="font-bold text-[#0D47A1]">
                  {selectedDoctor ? selectedDoctor.name : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Date:</span>
                <span className="font-semibold">{selectedDate}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Time:</span>
                <span className="font-bold text-[#0D47A1]">
                  {selectedTimeSlot}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Visit Type:</span>
                <span className="font-medium text-slate-700">{visitType}</span>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm font-bold">
                <span className="text-[#111827]" style={{ fontFamily: PP }}>
                  Estimated Fee:
                </span>
                <span className="text-[#009688]" style={{ fontFamily: PP }}>
                  {selectedDoctor ? selectedDoctor.consultationFee : "$65.00"}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 03: IMPORTANT INFORMATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <Info size={15} className="text-[#F59E0B]" /> Important
              Information
            </h3>

            <ul className="space-y-2 text-xs text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0 mt-1.5" />
                <span>Arrive 15 minutes early</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0 mt-1.5" />
                <span>Bring previous prescriptions if applicable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0 mt-1.5" />
                <span>Carry a valid ID</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0 mt-1.5" />
                <span>
                  Cancellation policy: Free cancellation up to 2 hours before
                  schedule
                </span>
              </li>
            </ul>
          </div>

          {/* Sticky Actions Card / Footer */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
              style={{ fontFamily: PP }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> Confirm Appointment
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (onBack) onBack();
              }}
              className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
