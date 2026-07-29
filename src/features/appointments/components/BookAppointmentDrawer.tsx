import React, { useState, useMemo, useEffect } from "react";
import {
  UserPlus,
  Plus,
  X,
  AlertCircle,
  User,
  Search,
  Calendar,
  Clock,
} from "lucide-react";
import type {
  AppointmentRecord,
  PatientSummary,
} from "../types/appointment.types";
import type { VisitType } from "../types/appointment-screen.types";
import { Avatar } from "./Avatar";
import { PP, RB, EMPTY_AVAILABILITY } from "../constants/appointment.constants";
import { appointmentService } from "../services/appointment.service";
import { useAppointments } from "../hooks/useAppointments";

export function BookAppointmentDrawer({
  isOpen,
  onClose,
  onBookSuccess,
  onPatientSelect,
  isWalkInPreset = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBookSuccess: (newApt: AppointmentRecord) => void;
  onPatientSelect?: (id: number | string) => void;
  isWalkInPreset?: boolean;
}) {
  const { appointments: liveAppointments } = useAppointments("Receptionist");
  const [patientSearch, setPatientSearch] = useState("");
  const [linkedPatients, setLinkedPatients] = useState<PatientSummary[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(
    null,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [department, setDepartment] = useState("Cardiology");
  const [doctorName, setDoctorName] = useState("Dr. Arjun Mehta");
  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [timeSlot, setTimeSlot] = useState("09:30 AM");
  const [visitType, setVisitType] = useState<VisitType>(
    isWalkInPreset ? "Walk-In" : "First Visit",
  );
  const [reasonForVisit, setReasonForVisit] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [slotOptions, setSlotOptions] = useState<
    { time: string; available: boolean }[]
  >([]);

  useEffect(() => {
    if (isWalkInPreset) {
      setVisitType("Walk-In");
      setAppointmentDate(new Date().toISOString().split("T")[0]);
    }
  }, [isWalkInPreset, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    appointmentService
      .listLinkedPatients()
      .then((patients) => {
        if (!mounted) return;
        const normalized = patients
          .map((p) => ({
            id: p.id,
            mrn: p.patientId,
            name: p.fullName,
            age: 0,
            gender: (p.gender as any) || "Other",
            bloodGroup: "",
            phone: p.mobile || "",
            emergencyContact: "",
            assignedDoctor: "",
          }))
          .map((p) => p as PatientSummary);
        setLinkedPatients(normalized);
        if (!selectedPatient && normalized.length > 0) {
          setSelectedPatient(normalized[0]);
        }
      })
      .catch(() => {
        if (mounted) setLinkedPatients([]);
      });
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!patientSearch) return linkedPatients;
    const q = patientSearch.toLowerCase();
    return linkedPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).toLowerCase().includes(q) ||
        p.phone.includes(q),
    );
  }, [patientSearch, linkedPatients]);

  const doctorMeta = useMemo(() => {
    const matched = liveAppointments.find(
      (apt) => apt.doctorName === doctorName,
    );
    return matched
      ? {
          specialty: matched.doctorSpecialty || "",
          department: matched.department || department,
          opdRoom: matched.opdRoom || "",
          slotDuration: "15 Minutes",
          slots: slotOptions,
        }
      : { ...EMPTY_AVAILABILITY, department, slots: slotOptions };
  }, [liveAppointments, doctorName, department, slotOptions]);

  const handleSelectPatient = (p: PatientSummary) => {
    setSelectedPatient(p);
    setPatientSearch("");
    setIsDropdownOpen(false);
    if (errors.patient) {
      setErrors((prev) => ({ ...prev, patient: "" }));
    }
  };

  const handleDoctorChange = async (doc: string) => {
    setDoctorName(doc);
    const matched = liveAppointments.find((apt) => apt.doctorName === doc);
    if (matched?.department) {
      setDepartment(matched.department);
    }
    if (matched?.doctorId) {
      try {
        const slots = await appointmentService.listAvailableSlots(
          matched.doctorId,
          appointmentDate,
        );
        const normalizedSlots = slots.map((slot: any) => ({
          time: slot.time || slot.startTime || slot.slotTime || "",
          available:
            slot.available ?? slot.isAvailable ?? slot.status === "AVAILABLE",
        }));
        setSlotOptions(normalizedSlots);
        const availableSlot = normalizedSlots.find((s) => s.available)?.time;
        if (availableSlot) setTimeSlot(availableSlot);
      } catch {
        setSlotOptions([]);
      }
    }
    if (errors.doctor) setErrors((prev) => ({ ...prev, doctor: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedPatient) errs.patient = "Patient selection is required.";
    if (!department) errs.department = "Department selection is required.";
    if (!doctorName) errs.doctor = "Doctor selection is required.";
    if (!appointmentDate)
      errs.appointmentDate = "Appointment date is required.";
    if (!timeSlot) errs.timeSlot = "Time slot selection is required.";
    if (!reasonForVisit.trim())
      errs.reasonForVisit = "Reason for visit is required.";

    setErrors(errs);
    const hasError = Object.keys(errs).length > 0;
    setShowErrorAlert(hasError);
    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const booked = await appointmentService.bookAppointment({
      patientId: selectedPatient!.id,
      doctorId: String(
        liveAppointments.find((apt) => apt.doctorName === doctorName)
          ?.doctorId || selectedPatient!.id,
      ),
      appointmentDate,
      startTime: timeSlot,
      appointmentType: visitType,
      reason: reasonForVisit,
      symptoms: reasonForVisit,
    });

    onBookSuccess(booked);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm shrink-0">
            <div>
              <h2
                className="text-base font-bold flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                {isWalkInPreset ? <UserPlus size={18} /> : <Plus size={18} />}
                {isWalkInPreset
                  ? "Register Walk-In Patient"
                  : "Book Appointment"}
              </h2>
              <p
                className="text-xs text-blue-200 mt-0.5"
                style={{ fontFamily: RB }}
              >
                {isWalkInPreset
                  ? "Quick walk-in registration & immediate OPD queue assignment."
                  : "Schedule a new appointment for an existing or newly registered patient."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]/50"
            style={{ fontFamily: RB }}
          >
            {showErrorAlert && (
              <div className="bg-red-50 border border-red-200 text-[#EF4444] p-3.5 rounded-2xl flex items-start gap-2.5 shadow-xs animate-in fade-in duration-150">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <div className="text-xs">
                  <strong
                    className="font-bold block"
                    style={{ fontFamily: PP }}
                  >
                    Validation Error
                  </strong>
                  <span>
                    Please fill in all mandatory required fields (*) before
                    booking the appointment.
                  </span>
                </div>
              </div>
            )}

            {/* Patient Search */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <User size={15} className="text-[#0D47A1]" /> Section 01 —
                  Patient Search & Info
                </h3>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Patient Search *{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Name / MRN / Phone)
                  </span>
                </label>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Type Patient Name, MRN (MRN-2024-001) or Phone..."
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none transition-colors ${
                      errors.patient
                        ? "border-[#EF4444] bg-red-50/20"
                        : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
                    }`}
                  />
                  {patientSearch && (
                    <button
                      type="button"
                      onClick={() => setPatientSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {errors.patient && (
                  <p className="text-[11px] text-[#EF4444] mt-1 font-medium">
                    {errors.patient}
                  </p>
                )}

                {isDropdownOpen && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className="p-2.5 hover:bg-blue-50/70 cursor-pointer flex items-center justify-between transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar name={p.name} size="sm" />
                          <div>
                            <div
                              className="font-bold text-[#111827]"
                              style={{ fontFamily: PP }}
                            >
                              {p.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {p.id} · {p.mrn} · {p.phone}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#0D47A1] font-bold">
                          Select
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-blue-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={selectedPatient.name} size="md" />
                      <div>
                        <span
                          className="font-bold text-xs text-[#111827] block"
                          style={{ fontFamily: PP }}
                        >
                          {selectedPatient.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#0D47A1] font-bold">
                          {selectedPatient.id} · {selectedPatient.mrn}
                        </span>
                      </div>
                    </div>

                    {onPatientSelect && (
                      <button
                        type="button"
                        onClick={() => onPatientSelect(selectedPatient.id)}
                        className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] bg-white text-[11px] font-bold text-[#0D47A1] hover:bg-blue-50 transition-colors"
                      >
                        View Patient Profile
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Appointment Info */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={15} className="text-[#0D47A1]" /> Section 02 —
                  Schedule & Department
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errors.department)
                        setErrors((prev) => ({ ...prev, department: "" }));
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Doctor *
                  </label>
                  <select
                    value={doctorName}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1]"
                  >
                    {(
                      Array.from(
                        new Set(
                          liveAppointments
                            .map((apt) => apt.doctorName)
                            .filter(Boolean),
                        ),
                      ) || [doctorName]
                    ).map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Visit Type *
                  </label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value as VisitType)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="First Visit">First Visit</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Walk-In">Walk-In Registration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Reason for Visit *
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe chief complaint or symptoms..."
                  value={reasonForVisit}
                  onChange={(e) => {
                    setReasonForVisit(e.target.value);
                    if (errors.reasonForVisit)
                      setErrors((prev) => ({ ...prev, reasonForVisit: "" }));
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none resize-none focus:border-[#0D47A1]"
                />
              </div>
            </div>

            {/* Time Slot */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Clock size={15} className="text-[#009688]" /> Section 03 —
                  Time Slot & Room
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {doctorMeta.slots.map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!s.available}
                    onClick={() => {
                      if (s.available) setTimeSlot(s.time);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-semibold transition-all border text-center ${
                      timeSlot === s.time
                        ? "bg-[#0D47A1] text-white border-[#0D47A1]"
                        : s.available
                          ? "bg-slate-50 text-slate-700 border-[#E5E7EB] hover:bg-blue-50"
                          : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 line-through"
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                {isWalkInPreset
                  ? "Register & Check-In Patient"
                  : "Book Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
