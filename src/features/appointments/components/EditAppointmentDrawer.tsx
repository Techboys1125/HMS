import React, { useState, useEffect } from "react";
import {
  Edit,
  X,
  AlertCircle,
  User,
  Lock,
  Calendar as CalendarIcon,
  Ban,
} from "lucide-react";
import type { AppointmentRecord, DoctorSummary } from "../types/appointment.types";
import type { VisitType, AppointmentStatus } from "../types/appointment-screen.types";
import { Avatar } from "./Avatar";
import {
  PP,
  RB,
  EMPTY_AVAILABILITY,
  appointmentToPatientSummary,
} from "../constants/appointment.constants";
import { appointmentService } from "../services/appointment.service";
import { departmentsApi, type ApiDepartmentLookupItem } from "../../users/api/departments.api";

export function EditAppointmentDrawer({
  apt,
  isOpen,
  onClose,
  onSaveSuccess,
  onRescheduleClick,
  onCancelClick,
}: {
  apt: AppointmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (updatedApt: AppointmentRecord) => void;
  onRescheduleClick: (apt: AppointmentRecord) => void;
  onCancelClick: (apt: AppointmentRecord) => void;
  onPatientSelect?: (id: number | string) => void;
}) {
  const [department, setDepartment] = useState("Cardiology");
  const [doctorName, setDoctorName] = useState("Dr. Arjun Mehta");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [visitType, setVisitType] = useState<VisitType>("First Visit");
  const [status, setStatus] = useState<AppointmentStatus | string>("Scheduled");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [, setErrors] = useState<Record<string, string>>({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [departments, setDepartments] = useState<ApiDepartmentLookupItem[]>([]);

  useEffect(() => {
    departmentsApi.getDepartmentLookup(true).then((lookupList) => {
      if (lookupList && lookupList.length > 0) {
        setDepartments(lookupList);
      } else {
        departmentsApi.getDepartments({ activeOnly: true }).then((list) => {
          const lookupMapped = list.map((d) => ({
            departmentId: d.departmentId ?? d.id ?? "",
            departmentName: d.departmentName || d.name || "",
            active: true,
            specialties: [],
          }));
          setDepartments(lookupMapped);
        });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const matchedDept = departments.find((d) => d.departmentName === department);
    const deptId = matchedDept ? matchedDept.departmentId : undefined;
    appointmentService
      .listDoctors(deptId)
      .then((data) => {
        setDoctors(data);
        if (data.length > 0) {
          const currentDoc = data.find((d) => d.name === doctorName);
          if (!currentDoc) {
            setDoctorName(data[0].name);
          }
        } else {
          setDoctorName("");
        }
      })
      .catch(() => {});
  }, [department, departments]);

  useEffect(() => {
    if (apt) {
      const timer = setTimeout(() => {
        setDepartment(apt.department || "");
        setDoctorName(apt.doctorName);
        setAppointmentDate(apt.appointmentDate);
        setTimeSlot(apt.timeSlot || "");
        setVisitType((apt.visitType as VisitType) || "First Visit");
        setStatus(String(apt.status));
        setReasonForVisit(apt.chiefComplaint || "");
        setAdditionalNotes(apt.notes || "");
        setErrors({});
        setShowErrorAlert(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [apt]);

  if (!isOpen || !apt) return null;

  const patientInfo = appointmentToPatientSummary(apt);
  const docAvailability = EMPTY_AVAILABILITY;

  const handleDoctorChange = (doc: string) => {
    setDoctorName(doc);
    void doc;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updated: AppointmentRecord = {
      ...apt,
      department,
      doctorName,
      doctorSpecialty: docAvailability.specialty,
      opdRoom: docAvailability.opdRoom,
      appointmentDate,
      timeSlot,
      visitType,
      status,
      chiefComplaint: reasonForVisit,
      notes: additionalNotes,
    };

    onSaveSuccess(updated);
    onClose();
  };

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
                <Edit size={18} /> Edit Appointment — {apt.id}
              </h2>
              <p
                className="text-xs text-blue-200 mt-0.5"
                style={{ fontFamily: RB }}
              >
                Update appointment information and reception check-in state.
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
            className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50"
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
                    saving changes.
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3
                  className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <User size={15} className="text-[#0D47A1]" /> Patient Summary
                  (Read Only)
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  <Lock size={10} /> Read Only
                </span>
              </div>

              <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={patientInfo.name} size="md" />
                    <div>
                      <span
                        className="font-bold text-xs text-[#111827] block"
                        style={{ fontFamily: PP }}
                      >
                        {patientInfo.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#0D47A1] font-bold">
                        {patientInfo.id} · {patientInfo.mrn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none"
                  >
                    {departments.length === 0 && (
                      <option value="">Loading departments...</option>
                    )}
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentName}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Doctor *
                  </label>
                  <select
                    value={doctorName}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none"
                  >
                    {doctors.length === 0 && (
                      <option value="">Loading doctors...</option>
                    )}
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name} ({doc.departmentName || doc.department || ""})
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
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Time Slot *
                  </label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Status Dropdown *
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as AppointmentStatus)
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1]"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Waiting">Waiting</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span
                  className="text-xs font-bold text-[#111827] block"
                  style={{ fontFamily: PP }}
                >
                  Quick Actions
                </span>
                <span className="text-[10px] text-slate-500">
                  Reschedule date/time or cancel appointment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onRescheduleClick(apt);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-[#009688] text-[11px] font-bold hover:bg-teal-100 transition-colors flex items-center gap-1"
                >
                  <CalendarIcon size={12} /> Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCancelClick(apt);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50 text-[#EF4444] text-[11px] font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <Ban size={12} /> Cancel
                </button>
              </div>
            </div>

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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
