import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PP, RB } from "../constants/patient.mock";

export function EditPatientScreen({ onBack }: { onBack: () => void; patientMrn?: string }) {
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
              Edit Patient
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
            <span className="font-medium text-[#111827]">Edit Patient</span>
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
                    defaultValue="PT-2024-006"
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
                    defaultValue="Sarah Mitchell"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    defaultValue="1990-05-14"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    defaultValue={34}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      defaultValue="Female"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                    >
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
                    <select
                      defaultValue="A+"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                    >
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
                    defaultValue="+1 (555) 234-5678"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="sarah.mitchell@example.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    defaultValue="123 Maple Street, Apt 4B, New York, NY 10001"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all resize-none"
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
                    defaultValue="John Mitchell"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 987-6543"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    defaultValue="Spouse"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                  >
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
                      defaultValue="Penicillin, Aspirin"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Existing Medical Conditions
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Mild Hypertension"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all resize-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="reset"
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset Changes
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-sm font-medium hover:bg-[#0c3d8a] transition-colors shadow-sm"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}