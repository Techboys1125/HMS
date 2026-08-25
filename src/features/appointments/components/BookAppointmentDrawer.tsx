import { X } from "lucide-react";
import type { AppointmentRecord } from "../types/appointment.types";
import { BookAppointmentScreen } from "../pages/BookAppointmentScreen";

export function BookAppointmentDrawer({
  isOpen,
  onClose,
  onBookSuccess,
  onPatientSelect,
  onRegisterNewPatientClick,
  isWalkInPreset = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBookSuccess: (newApt: AppointmentRecord) => void;
  onPatientSelect?: (id: number | string) => void;
  onRegisterNewPatientClick?: () => void;
  isWalkInPreset?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#F1F5F9] w-screen h-screen flex flex-col transition-opacity duration-200">
      {/* Header Bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            {isWalkInPreset
              ? "Register Walk-In Appointment"
              : "Book New Appointment"}
          </h2>
          <p className="text-xs text-[#64748B]">
            Complete OPD appointment booking flow
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close Full Screen"
        >
          <X size={20} />
        </button>
      </div>

      {/* Full Screen BookAppointmentScreen View */}
      <div className="flex-1 overflow-y-auto">
        <BookAppointmentScreen
          role="receptionist"
          onBack={onClose}
          onRegisterNewPatientClick={() => {
            onClose();
            if (onRegisterNewPatientClick) onRegisterNewPatientClick();
          }}
          onBookSuccess={(apt: AppointmentRecord) => {
            if (onBookSuccess) onBookSuccess(apt);
            onClose();
          }}
          onPatientSelect={(mrn: string) => {
            if (onPatientSelect) onPatientSelect(mrn);
          }}
        />
      </div>
    </div>
  );
}

export default BookAppointmentDrawer;
