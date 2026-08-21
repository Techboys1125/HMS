import { useState } from "react";
import {
  ChevronRight,
  UserCheck,
  Search,
  CheckCircle2,
  Clock,
  Printer,
} from "lucide-react";

export interface PatientCheckInScreenProps {
  onBack?: () => void;
  onConfirmSuccess?: (tokenNumber: string) => void;
  onPatientSearchClick?: () => void;
  initialTokenOrMrn?: string;
}

export function PatientCheckInScreen({
  onBack,
  onConfirmSuccess,
  onPatientSearchClick,
  initialTokenOrMrn,
}: PatientCheckInScreenProps) {
  const [searchQuery, setSearchQuery] = useState(initialTokenOrMrn || "");
  const [selectedVitals, setSelectedVitals] = useState({
    bpSystolic: "120",
    bpDiastolic: "80",
    pulse: "72",
    temp: "98.6",
    weight: "68",
    height: "172",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");

  const handleConfirmCheckIn = () => {
    const token = `TK-${100 + (window.crypto.getRandomValues(new Uint32Array(1))[0] % 900)}`;
    setGeneratedToken(token);
    setShowSuccessModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9] font-body">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors cursor-pointer"
            >
              Reception Management
            </button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">
              Patient Check-In
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827] font-heading">
            Arrival Check-In & Token Issuance
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Capture arrival timestamp, record preliminary vitals, and issue OPD
            queue tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPatientSearchClick}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer font-heading"
          >
            <Search size={15} /> Search Patient
          </button>
        </div>
      </div>

      {/* CHECK-IN FORM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          {/* Section 01: Patient & Appointment Identification */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs font-heading">
                01
              </div>
              <h2 className="text-base font-bold text-[#111827] font-heading">
                Patient & Appointment Identification
              </h2>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient by MRN, Appointment ID, Mobile Number or Token..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-hidden focus:border-[#009688] focus:bg-white transition-colors shadow-inner"
              />
            </div>

            {/* Patient Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-teal-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#009688] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  SM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#111827]">
                      Sarah Mitchell
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-[#009688] text-[10px] font-mono font-bold">
                      MRN-892101
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    34 yrs · Female · Mobile:{" "}
                    <span className="font-mono">+91 9876543210</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0D47A1] text-xs font-bold font-mono">
                  Appt: 09:00 AM
                </span>
              </div>
            </div>
          </div>

          {/* Section 02: Preliminary Vitals Capture */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs font-heading">
                02
              </div>
              <h2 className="text-base font-bold text-[#111827] font-heading">
                Preliminary Vitals Capture
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  BP Systolic (mmHg)
                </label>
                <input
                  type="text"
                  value={selectedVitals.bpSystolic}
                  onChange={(e) =>
                    setSelectedVitals({
                      ...selectedVitals,
                      bpSystolic: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  BP Diastolic (mmHg)
                </label>
                <input
                  type="text"
                  value={selectedVitals.bpDiastolic}
                  onChange={(e) =>
                    setSelectedVitals({
                      ...selectedVitals,
                      bpDiastolic: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Pulse Rate (bpm)
                </label>
                <input
                  type="text"
                  value={selectedVitals.pulse}
                  onChange={(e) =>
                    setSelectedVitals({
                      ...selectedVitals,
                      pulse: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Body Temp (°F)
                </label>
                <input
                  type="text"
                  value={selectedVitals.temp}
                  onChange={(e) =>
                    setSelectedVitals({
                      ...selectedVitals,
                      temp: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  value={selectedVitals.weight}
                  onChange={(e) =>
                    setSelectedVitals({
                      ...selectedVitals,
                      weight: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Height (cm)
                </label>
                <input
                  type="text"
                  value={selectedVitals.height}
                  onChange={(e) =>
                    setSelectedVitals({
                      ...selectedVitals,
                      height: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY PANEL */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#009688] p-5 shadow-xs space-y-3 bg-linear-to-b from-teal-50/40 to-white">
            <h3 className="text-xs font-bold text-[#009688] uppercase tracking-wider border-b border-teal-100 pb-2 flex items-center justify-between font-heading">
              <span>Arrival Summary</span>
              <Clock size={14} />
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Assigned Doctor</span>
                <span className="font-bold text-[#111827]">
                  Dr. Arjun Mehta
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Department</span>
                <span className="text-slate-800">Cardiology</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Server Timestamp</span>
                <span className="font-mono font-bold text-[#0D47A1]">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmCheckIn}
              className="w-full mt-3 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-[#00796B] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              <UserCheck size={16} /> Confirm Arrival Check-In
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-[#009688] flex items-center justify-center mb-1">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#111827] font-heading">
                Patient Checked-In
              </h3>
              <p className="text-xs text-[#64748B]">
                Token Generated:{" "}
                <strong className="font-mono text-base text-[#0D47A1]">
                  {generatedToken}
                </strong>
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onConfirmSuccess) onConfirmSuccess(generatedToken);
                  else if (onBack) onBack();
                }}
                className="w-full py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-[#00796B] transition-colors flex items-center justify-center gap-2 cursor-pointer font-heading"
              >
                <Printer size={15} /> Print Visit Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientCheckInScreen;
