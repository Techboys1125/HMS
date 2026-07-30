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

export interface ReceptionBookAppointmentScreenProps {
  onBack?: () => void;
  onConfirmSuccess?: (aptId: string) => void;
  onRegisterNewPatientClick?: () => void;
  onViewPatientProfileClick?: (mrn: string) => void;
  initialMrn?: string;
}

export function ReceptionBookAppointmentScreen({
  onBack,
  onConfirmSuccess,
  onRegisterNewPatientClick,
  onViewPatientProfileClick,
  initialMrn,
}: ReceptionBookAppointmentScreenProps) {
  const [patientQuery, setPatientQuery] = useState(initialMrn || "");
  const [selectedDept, setSelectedDept] = useState("Cardiology");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Interventional Cardiology");
  const [selectedDocKey, setSelectedDocKey] = useState("Dr. Arjun Mehta");
  const [selectedDate, setSelectedDate] = useState("2026-07-24");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:30 AM");
  const [visitType, setVisitType] = useState<"New Consultation" | "Follow-up">("New Consultation");
  const [chiefComplaint, setChiefComplaint] = useState("Chest tightness and occasional breathlessness.");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedAptId, setConfirmedAptId] = useState("");

  const doctorsList = [
    { key: "Dr. Arjun Mehta", name: "Dr. Arjun Mehta", dept: "Cardiology", spec: "Interventional Cardiology", fee: 800 },
    { key: "Dr. Priya Sharma", name: "Dr. Priya Sharma", dept: "General OPD", spec: "Internal Medicine", fee: 500 },
    { key: "Dr. Sunita Patel", name: "Dr. Sunita Patel", dept: "Gynecology", spec: "Obstetrics & Gynae", fee: 700 },
  ];

  const currentDoctor = doctorsList.find((d) => d.key === selectedDocKey) || doctorsList[0];

  const handleConfirm = () => {
    const newAptId = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedAptId(newAptId);
    setShowSuccessModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9] font-body">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors cursor-pointer">
              Reception Management
            </button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">Appointment Booking</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827] font-heading">Book Appointment</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Search a patient, select a doctor and confirm an appointment slot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRegisterNewPatientClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0D47A1] text-xs font-semibold hover:bg-blue-100 transition-all cursor-pointer font-heading"
          >
            <UserPlus size={14} /> Register New Patient
          </button>
        </div>
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          {/* Section 01: Patient Search */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs font-heading">
                01
              </div>
              <h2 className="text-base font-bold text-[#111827] font-heading">Patient Search</h2>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="Search patient by MRN, Name, Phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-hidden focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Section 02: Doctor Selection */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs font-heading">
                02
              </div>
              <h2 className="text-base font-bold text-[#111827] font-heading">Doctor & Slot Selection</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#111827] mb-1">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] cursor-pointer"
                >
                  <option>Cardiology</option>
                  <option>General OPD</option>
                  <option>Gynecology</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">Doctor</label>
                <select
                  value={selectedDocKey}
                  onChange={(e) => setSelectedDocKey(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] cursor-pointer"
                >
                  {doctorsList.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.name} ({d.dept})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY PANEL */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#0D47A1] p-5 shadow-xs space-y-3 bg-gradient-to-b from-blue-50/40 to-white">
            <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider border-b border-blue-100 pb-2 flex items-center justify-between font-heading">
              <span>Booking Summary</span>
              <CalendarIcon size={14} />
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Consulting Doctor</span>
                <span className="font-bold text-[#111827]">{currentDoctor.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Department</span>
                <span className="text-slate-800">{currentDoctor.dept}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Fee Payable</span>
                <span className="font-bold text-base text-[#0D47A1]">₹{currentDoctor.fee}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full mt-3 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              <CheckCircle2 size={16} /> Confirm Appointment
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mb-1">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#111827] font-heading">
                Appointment Booked
              </h3>
              <p className="text-xs text-[#64748B]">Appointment ID: <strong className="font-mono text-[#0D47A1]">{confirmedAptId}</strong></p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onConfirmSuccess) onConfirmSuccess(confirmedAptId);
                  else if (onBack) onBack();
                }}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center justify-center gap-2 cursor-pointer font-heading"
              >
                <UserCheck size={15} /> Patient Check-In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceptionBookAppointmentScreen;
