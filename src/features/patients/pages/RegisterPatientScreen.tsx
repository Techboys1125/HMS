import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Receipt,
  X,
  Phone,
  UserCheck,
  ChevronDown,
  Activity,
  Calendar,
  Stethoscope,
  Pill,
  AlertTriangle,
  FileText,
  Clock,
  Mail,
  MapPin,
  Droplets,
  Users,
  UserPlus,
  UserX,
  User,
  Printer,
  CheckCircle2,
  XCircle,
  Building2,
  CreditCard,
  Lock,
  Key,
  ShieldCheck,
  Save,
  TrendingUp,
  Star,
  Info,
  Check,
  AlertCircle,
} from "lucide-react";
import { useCreatePatient } from "../hooks/useCreatePatient";
import {
  usePatientSearch,
  usePatients,

} from "../hooks/usePatients";
import type { CreatePatientRequest } from "../types/patient.types";
import type { ScreenPatient as Patient, VisitRecord, PatientAppointment, BookingDoctor, PatientCancelAppointmentDialogProps, PatientRescheduleAppointmentDialogProps, MedicalVisitRecord, PrescriptionRecord, PatientInvoice, PaymentHistoryRecord, ScreenPatientSearchResult as PatientSearchResult, ChipVariant, ReceptionPatientProfileScreenProps, PatientPrescriptionItem } from "../types/patient.types";
import { PP, RB, MOCK_VISIT_HISTORY, TIMELINE_EVENTS, INITIAL_PATIENT_APPOINTMENTS, MOCK_BOOKING_DOCTORS, MOCK_VISIT_RECORDS, MOCK_PRESCRIPTION_RECORDS, INITIAL_INVOICES, PAYMENT_HISTORY_RECORDS } from "../constants/patient.mock";
import { Avatar, Av, Chip } from "../components/Avatar";
import { StatusBadge, TimelineStatusBadge } from "../components/StatusBadges";
import { EditPatientInformationDrawer, ProfileBookApptDrawer, ProfileApptDetailsDrawer, ProfileInvoiceDrawer, ProfileDocDrawer, ProfileVisitDetailsDrawer, PatientQuickDetailsDrawer } from "../components/PatientDrawers";
import { PatientCancelAppointmentDialog, PatientRescheduleAppointmentDialog } from "../components/PatientDialogs";
import { PatientListScreen } from "./PatientListScreen";
import { EditPatientScreen } from "./EditPatientScreen";
import { PatientProfileScreen } from "./PatientProfileScreen";
import { MedicalHistoryScreen } from "./MedicalHistoryScreen";
import { PatientVisitHistoryScreen } from "./PatientVisitHistoryScreen";
import { PatientTimelineScreen } from "./PatientTimelineScreen";
import { PatientBookAppointmentScreen } from "./PatientBookAppointmentScreen";
import { PatientAppointmentsScreen } from "./PatientAppointmentsScreen";
import { PatientMedicalRecordsScreen } from "./PatientMedicalRecordsScreen";
import { PatientBillingScreen } from "./PatientBillingScreen";
import { PatientProfileCenterScreen } from "./PatientProfileCenterScreen";
import { ReceptionPatientRegistrationScreen } from "./ReceptionPatientRegistrationScreen";
import { PatientSearchScreen } from "./PatientSearchScreen";
import { ReceptionPatientProfileScreen } from "./ReceptionPatientProfileScreen";
import { PatientPrescriptionsScreen } from "./PatientPrescriptionsScreen";
import { PatientPrescriptionDetailsScreen } from "./PatientPrescriptionDetailsScreen";

export function RegisterPatientScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-6">
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
              Register Patient
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 text-sm text-slate-500 pl-8"
            style={{ fontFamily: RB }}
          >
            <span>Dashboard</span>
            <ChevronRight size={14} className="text-slate-300" />
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Patients
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Register Patient</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <form
            className="p-6 md:p-8 space-y-8"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* 1. Personal Information */}
            <section>
              <h2
                className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Patient ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value="PT-2024-006"
                    disabled
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-500 font-mono outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="Auto-calculated"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none placeholder:text-slate-400"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Blood Group
                    </label>
                    <select className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                      <option value="">Select</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Contact Information */}
            <section>
              <h2
                className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Full address"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* 3. Emergency Contact */}
            <section>
              <h2
                className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Emergency Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                    <option value="">Select</option>
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Child</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 4. Medical Information */}
              <section>
                <h2
                  className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100"
                  style={{ fontFamily: PP }}
                >
                  Medical Information
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Allergies
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Penicillin, Peanuts (comma separated)"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Existing Medical Conditions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Hypertension, Diabetes"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="reset"
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl border border-[#0D47A1] text-sm font-medium text-[#0D47A1] hover:bg-blue-50 transition-colors"
              >
                Save & Continue
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-sm font-medium hover:bg-[#0c3d8a] transition-colors shadow-sm"
              >
                Save Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}