import { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  UserPlus,
  Search,
  CheckCircle2,
  Printer,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { PatientSummary, Department } from "../types/appointment.types";
import { PP, RB } from "../constants/appointment.constants";
import type { BookAppointmentScreenProps } from "../types/appointment-screen.types";
import { appointmentService } from "../services/appointment.service";
import { patientsApi } from "../../patients/api/patient.api";
import { departmentsApi } from "../../users/api/departments.api";
import { doctorsApi } from "../../doctors/api/doctors.api";
import type { DoctorDailySlot } from "../../doctors/types/doctors.types";

export function BookAppointmentScreen({
  role = "receptionist",
  onBack,
  onConfirmSuccess,
  onRegisterNewPatientClick,
  onViewPatientProfileClick,
  onPatientSelect,
  initialMrn,
  onBookSuccess,
}: BookAppointmentScreenProps) {
  // Section 01: Patient Search state
  const [patientQuery, setPatientQuery] = useState(initialMrn || "");
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(
    null,
  );
  const [patientDatabase, setPatientDatabase] = useState<PatientSummary[]>([]);

  // Patient search dropdown options
  const searchedPatients = useMemo(() => {
    if (!patientQuery.trim()) return patientDatabase;
    const q = patientQuery.toLowerCase();
    return patientDatabase.filter(
      (p) =>
        (p.name || "Unknown Patient").toLowerCase().includes(q) ||
        (p.mrn || "").toLowerCase().includes(q) ||
        (p.phone || "").includes(q) ||
        String(p.id).toLowerCase().includes(q),
    );
  }, [patientQuery, patientDatabase]);

  // Section 02: Department & Doctor Selection
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDocKey, setSelectedDocKey] = useState("");

  const [doctorsList, setDoctorsList] = useState<
    {
      key: string;
      doctorId: number | string;
      name: string;
      dept: string;
      spec: string;
      fee: number;
      availability: string;
      exp: string;
    }[]
  >([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const filteredDoctors = useMemo(() => {
    if (!selectedDept) return [];
    return doctorsList.filter((d) => {
      if (selectedSpecialty && d.spec !== selectedSpecialty) return false;
      return true;
    });
  }, [doctorsList, selectedDept, selectedSpecialty]);

  const currentDoctor = useMemo(() => {
    if (!selectedDept || !selectedDocKey) return null;
    return doctorsList.find((d) => d.key === selectedDocKey) || null;
  }, [doctorsList, selectedDept, selectedDocKey]);

  const specialties = useMemo(() => {
    if (!selectedDept) return [];
    return Array.from(new Set(doctorsList.map((d) => d.spec).filter(Boolean)));
  }, [doctorsList, selectedDept]);

  useEffect(() => {
    if (role === "patient") {
      patientsApi
        .getMyPatients()
        .then((data) => {
          const mapped: PatientSummary[] = data.map((p) => ({
            id: p.id ?? "",
            mrn: p.mrn,
            name: p.fullName || p.patientName || p.name || "Unknown Patient",
            age: p.age || 0,
            gender: p.gender || "",
            phone: p.phone || p.mobileNumber || "",
            bloodGroup: p.bloodGroup || "",
            emergencyContact: p.emergencyContact
              ? `${p.emergencyContact.name || p.emergencyContact.contactName || ""} (${p.emergencyContact.relationship || ""})`
              : "",
            assignedDoctor: p.assignedDoctor || "",
          }));
          setPatientDatabase(mapped);
          if (initialMrn) {
            const found = mapped.find(
              (p) =>
                p.mrn?.toLowerCase() === initialMrn.toLowerCase() ||
                String(p.id).toLowerCase() === initialMrn.toLowerCase(),
            );
            if (found) setSelectedPatient(found);
            else if (mapped.length > 0) setSelectedPatient(mapped[0]);
          } else if (mapped.length > 0) {
            setSelectedPatient(mapped[0]);
          }
        })
        .catch(() => {});
    } else {
      patientsApi
        .getAll()
        .then((data) => {
          const mapped: PatientSummary[] = data.map((p) => ({
            id: p.id ?? "",
            mrn: p.mrn,
            name: p.fullName || p.patientName || p.name || "Unknown Patient",
            age: p.age || 0,
            gender: p.gender || "",
            phone: p.phone || p.mobileNumber || "",
            bloodGroup: p.bloodGroup || "",
            emergencyContact: p.emergencyContact
              ? `${p.emergencyContact.name || p.emergencyContact.contactName || ""} (${p.emergencyContact.relationship || ""})`
              : "",
            assignedDoctor: p.assignedDoctor || "",
          }));
          setPatientDatabase(mapped);
          if (initialMrn) {
            const found = mapped.find(
              (p) =>
                p.mrn?.toLowerCase() === initialMrn.toLowerCase() ||
                String(p.id).toLowerCase() === initialMrn.toLowerCase(),
            );
            if (found) setSelectedPatient(found);
          }
          if (!selectedPatient && mapped.length > 0 && !initialMrn) {
            setSelectedPatient(mapped[0]);
          }
        })
        .catch(() => {});
    }
  }, [initialMrn, role]);

  useEffect(() => {
    departmentsApi
      .getDepartmentLookup(true)
      .then((lookupList) => {
        if (lookupList && lookupList.length > 0) {
          const mapped = lookupList.map((d) => ({
            id: d.departmentId,
            departmentName: d.departmentName,
          }));
          setDepartments(mapped);
        } else {
          departmentsApi.getDepartments({ activeOnly: true }).then((list) => {
            const mapped = list
              .map((d) => ({
                id: d.departmentId ?? d.id ?? "",
                departmentName: d.departmentName || d.name || "",
              }))
              .filter((d) => d.departmentName);
            if (mapped.length > 0) setDepartments(mapped as Department[]);
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDept) {
      setDoctorsList([]);
      setSelectedDocKey("");
      setSelectedSpecialty("");
      setIsLoadingDoctors(false);
      return;
    }

    setIsLoadingDoctors(true);
    const matchedDept = departments.find(
      (d) => d.departmentName === selectedDept || String(d.id) === selectedDept,
    );
    const deptId = matchedDept ? matchedDept.id : undefined;

    appointmentService
      .listDoctors(deptId)
      .then((data) => {
        const targetDeptName = selectedDept.trim().toLowerCase();
        const targetDeptId =
          deptId !== undefined && deptId !== null ? String(deptId) : "";

        // Strictly filter doctors belonging to the selected department
        const matchingDoctors = data.filter((d) => {
          if (!d.name || !d.name.trim()) return false;

          const docDeptId =
            d.departmentId !== undefined && d.departmentId !== null
              ? String(d.departmentId)
              : "";
          const docDeptName = (d.departmentName || d.department || "")
            .trim()
            .toLowerCase();

          if (targetDeptId && docDeptId) {
            return docDeptId === targetDeptId;
          }
          if (docDeptName && targetDeptName) {
            return (
              docDeptName === targetDeptName ||
              docDeptName.includes(targetDeptName) ||
              targetDeptName.includes(docDeptName)
            );
          }
          // If department info is not returned, keep doctors returned by listDoctors(deptId) if deptId was passed
          return Boolean(deptId);
        });

        const mapped = matchingDoctors.map((d) => {
          const uniqueKey = d.id ? String(d.id) : `${d.name}-${Math.random()}`;
          return {
            key: uniqueKey,
            doctorId: d.id,
            name: d.name,
            dept: d.departmentName || d.department || selectedDept,
            spec: d.specialty || "",
            fee:
              typeof d.consultationFee === "number"
                ? d.consultationFee
                : Number(d.consultationFee) || 0,
            availability: "Available Today",
            exp: d.qualification || "",
          };
        });
        setDoctorsList(mapped);
        if (mapped.length > 0) {
          setSelectedDocKey(mapped[0].key);
          setSelectedSpecialty(mapped[0].spec || "");
        } else {
          setSelectedDocKey("");
          setSelectedSpecialty("");
        }
      })
      .catch((err) => {
        console.warn("Failed to load doctors for department from API:", err);
        setDoctorsList([]);
        setSelectedDocKey("");
        setSelectedSpecialty("");
      })
      .finally(() => {
        setIsLoadingDoctors(false);
      });
  }, [selectedDept, departments]);

  const handleDeptChange = (dept: string) => {
    setSelectedDept(dept);
    setSelectedSpecialty("");
    setSelectedDocKey("");
    setDoctorsList([]);
  };

  const availableDates = useMemo(() => {
    const dates = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.getDay();
      const isSunday = dayOfWeek === 0;

      const dateStr = date.toISOString().split("T")[0];
      let label = `${date.getDate()} ${months[date.getMonth()]}`;
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";

      dates.push({
        date: dateStr,
        day: daysOfWeek[dayOfWeek],
        label,
        isAvailable: !isSunday,
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayDay = new Date().getDay();
    if (todayDay === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }
    return todayStr;
  });

  const [apiSlots, setApiSlots] = useState<DoctorDailySlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    if (!currentDoctor || !currentDoctor.doctorId || !selectedDate) {
      setApiSlots([]);
      return;
    }
    setIsLoadingSlots(true);
    doctorsApi
      .getDailyAvailability(currentDoctor.doctorId, selectedDate)
      .then((res) => {
        if (res && res.slots) {
          setApiSlots(res.slots);
        } else {
          setApiSlots([]);
        }
      })
      .catch(() => {
        setApiSlots([]);
      })
      .finally(() => {
        setIsLoadingSlots(false);
      });
  }, [currentDoctor, selectedDate]);

  const formatSlotTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;
    let hour = parseInt(parts[0], 10);
    const minute = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    const strHour = hour < 10 ? `0${hour}` : `${hour}`;
    return `${strHour}:${minute} ${ampm}`;
  };

  const isTimeSlotPassed = (slotTimeStr: string, targetDateStr: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (targetDateStr !== todayStr) return false;

    let hour = 0;
    let minute = 0;

    if (slotTimeStr.includes("AM") || slotTimeStr.includes("PM")) {
      const cleanTime = slotTimeStr.replace(/(AM|PM)/i, "").trim();
      const parts = cleanTime.split(":");
      hour = parseInt(parts[0] || "0", 10);
      minute = parseInt(parts[1] || "0", 10);
      if (slotTimeStr.toUpperCase().includes("PM") && hour < 12) {
        hour += 12;
      }
      if (slotTimeStr.toUpperCase().includes("AM") && hour === 12) {
        hour = 0;
      }
    } else {
      const parts = slotTimeStr.split(":");
      hour = parseInt(parts[0] || "0", 10);
      minute = parseInt(parts[1] || "0", 10);
    }

    const now = new Date();
    const slotDateTime = new Date();
    slotDateTime.setHours(hour, minute, 0, 0);

    return slotDateTime.getTime() <= now.getTime();
  };

  const dynamicTimeSlotGroups = useMemo(() => {
    if (apiSlots.length === 0) {
      const defaultSlots = {
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

      const filterGroup = (group: { time: string; available: boolean }[]) =>
        group.map((slot) => ({
          ...slot,
          available:
            slot.available && !isTimeSlotPassed(slot.time, selectedDate),
        }));

      return {
        morning: filterGroup(defaultSlots.morning),
        afternoon: filterGroup(defaultSlots.afternoon),
        evening: filterGroup(defaultSlots.evening),
      };
    }

    const morning: { time: string; available: boolean }[] = [];
    const afternoon: { time: string; available: boolean }[] = [];
    const evening: { time: string; available: boolean }[] = [];

    apiSlots.forEach((slot) => {
      const timeStr = slot.startTime;
      const parts = timeStr.split(":");
      const hour = parseInt(parts[0], 10);
      const formatted = formatSlotTime(timeStr);
      const statusUpper = (slot.status || "").toUpperCase();
      const available =
        (statusUpper === "AVAILABLE" || statusUpper === "OPEN" || statusUpper === "FREE") &&
        !isTimeSlotPassed(formatted, selectedDate);

      if (hour < 12) {
        morning.push({ time: formatted, available });
      } else if (hour >= 12 && hour < 16) {
        afternoon.push({ time: formatted, available });
      } else {
        evening.push({ time: formatted, available });
      }
    });

    return { morning, afternoon, evening };
  }, [apiSlots, selectedDate]);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:30 AM");

  useEffect(() => {
    const groups = [
      dynamicTimeSlotGroups.morning,
      dynamicTimeSlotGroups.afternoon,
      dynamicTimeSlotGroups.evening,
    ];
    for (const group of groups) {
      const avail = group.find((s) => s.available);
      if (avail) {
        setSelectedTimeSlot(avail.time);
        return;
      }
    }
    if (dynamicTimeSlotGroups.morning.length > 0) {
      setSelectedTimeSlot(dynamicTimeSlotGroups.morning[0].time);
    }
  }, [dynamicTimeSlotGroups]);

  const [visitType, setVisitType] = useState<"New Consultation" | "Follow-up">(
    "New Consultation",
  );
  const [chiefComplaint, setChiefComplaint] = useState(
    "Chest tightness and occasional breathlessness during walking.",
  );
  const [remarks, setRemarks] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedAptId, setConfirmedAptId] = useState("");
  const [notificationPrefs] = useState<{
    sms: boolean;
    email: boolean;
  }>({ sms: true, email: true });
  void notificationPrefs;

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selectedPatient || !currentDoctor) return;
    setIsBooking(true);
    setBookingError(null);

    const convertTo24Hour = (time12h: string): string => {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }

      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    try {
      const payload = {
        mrn: selectedPatient.mrn || "",
        doctorId: currentDoctor.doctorId,
        appointmentDate: selectedDate,
        startTime: convertTo24Hour(selectedTimeSlot),
        appointmentType:
          visitType === "New Consultation" ? "CONSULTATION" : "FOLLOW_UP",
        reason: chiefComplaint,
        symptoms: remarks,
      };

      const createdRecord = await appointmentService.bookAppointment(payload);
      setConfirmedAptId(String(createdRecord.id));
      setShowSuccessModal(true);

      if (onBookSuccess) onBookSuccess(createdRecord);
      if (onConfirmSuccess) onConfirmSuccess(String(createdRecord.id));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to book appointment.";
      setBookingError(msg);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-12 space-y-6">
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
                  {role === "patient"
                    ? "Active Patient (Read Only)"
                    : "Patient Search & Selection"}
                </h2>
              </div>
              <span className="text-xs text-red-500 font-semibold">
                * Required
              </span>
            </div>

            {role !== "patient" && (
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
            )}

            {patientQuery.trim() !== "" && (
              <div className="max-h-48 overflow-y-auto border border-[#E5E7EB] rounded-xl divide-y divide-gray-100 bg-white shadow-lg">
                {searchedPatients.length > 0 ? (
                  searchedPatients.map((p, idx) => (
                    <div
                      key={p.id || p.mrn || `patient-search-${idx}-${p.name}`}
                      onClick={() => {
                        setSelectedPatient(p);
                        setPatientQuery("");
                        if (onPatientSelect && p.mrn) onPatientSelect(p.mrn);
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

            {selectedPatient ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {(selectedPatient.name ?? "Patient")
                      .split(" ")
                      .filter(Boolean)
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Select Department *
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#009688] font-medium"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept, idx) => (
                    <option
                      key={dept.id || dept.departmentName || idx}
                      value={dept.departmentName}
                    >
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  disabled={!selectedDept}
                  onChange={(e) => {
                    const newSpec = e.target.value;
                    setSelectedSpecialty(newSpec);
                    setSelectedDocKey("");
                    const specDocs = doctorsList.filter(
                      (d) => !newSpec || d.spec === newSpec,
                    );
                    if (specDocs.length > 0) setSelectedDocKey(specDocs[0].key);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs text-[#111827] focus:outline-none focus:border-[#009688] font-medium ${
                    !selectedDept
                      ? "bg-slate-100 border-[#E5E7EB] text-slate-400 cursor-not-allowed"
                      : "bg-slate-50 border-[#E5E7EB]"
                  }`}
                >
                  {!selectedDept ? (
                    <option value="">Select Department First</option>
                  ) : (
                    <>
                      <option value="">All Specialties</option>
                      {specialties.map((spec, idx) => (
                        <option key={spec || idx} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-[#111827]">
                Available Doctors *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {!selectedDept ? (
                  <div className="col-span-full p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-1">
                    <span className="font-semibold text-slate-700">
                      No Department Selected
                    </span>
                    <span>
                      Please select a department above to view available
                      doctors.
                    </span>
                  </div>
                ) : isLoadingDoctors ? (
                  <div className="col-span-full p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center gap-2">
                    <RefreshCw
                      size={14}
                      className="animate-spin text-[#009688]"
                    />{" "}
                    Fetching doctors from database...
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="col-span-full p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No doctors found in database for {selectedDept}.
                  </div>
                ) : (
                  filteredDoctors.map((doc) => {
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
                          {doc.name
                            .replace("Dr. ", "")
                            .slice(0, 2)
                            .toUpperCase()}
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
                            {doc.dept} {doc.spec ? `· ${doc.spec}` : ""}
                          </p>
                          {doc.exp && (
                            <p className="text-[10px] text-slate-500 mt-1">
                              {doc.exp}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

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

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-[#111827]">
                Select Time Slot *
              </label>

              {isLoadingSlots ? (
                <div className="flex items-center gap-2 py-6 text-xs text-slate-400">
                  <RefreshCw size={14} className="animate-spin text-teal-600" />{" "}
                  Loading availability slots...
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      Morning Session
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {dynamicTimeSlotGroups.morning.map((slot) => {
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

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      Afternoon Session
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {dynamicTimeSlotGroups.afternoon.map((slot) => {
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

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      Evening Session
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {dynamicTimeSlotGroups.evening.map((slot) => {
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
                </>
              )}
            </div>
          </div>

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
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-4 rounded-2xl shadow-lg flex items-center justify-between z-10">
        {bookingError && (
          <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#EF4444] font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={14} /> {bookingError}
          </div>
        )}
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
          disabled={!selectedPatient || !currentDoctor || isBooking}
          className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: PP }}
        >
          {isBooking ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          {isBooking ? "Booking..." : "Confirm Appointment"}
        </button>
      </div>

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
                  {currentDoctor?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Department</span>
                <span className="text-slate-600">
                  {currentDoctor?.dept || "N/A"}
                </span>
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
