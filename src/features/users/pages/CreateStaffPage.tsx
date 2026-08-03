import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../app/routes/routes";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Shield,
} from "lucide-react";
import DashboardHeader from "../../dashboard/components/DashboardHeader";
import { useCreateStaffForm } from "../hooks/useCreateStaffForm";

// Sections
import { PersonalInfoSection } from "../components/PersonalInfoSection";
import { RoleAccessSection } from "../components/RoleAccessSection";
import { ConsultationDetailsSection } from "../components/ConsultationDetailsSection";
import { AvailabilityScheduleSection } from "../components/AvailabilityScheduleSection";
import { ReviewInfoSection } from "../components/ReviewInfoSection";

const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

interface CreateStaffPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export const CreateStaffPage: React.FC<CreateStaffPageProps> = ({
  onBack,
  onSuccess,
}) => {
  const navigate = useNavigate();

  // Toast state
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const {
    form,
    errors,
    isSubmitting,
    empIdPreview,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    setFieldValue,
    setNestedFieldValue,
    validateField,
    copyMondayHoursToWeekdays,
    handleSaveStaff,
  } = useCreateStaffForm(triggerToast, onSuccess, onBack);

  // Stepper helper
  const getSteps = () => {
    if (form.role === "DOCTOR") {
      return [
        { label: "Role & Access", step: 1 },
        { label: "Employment Information", step: 2 },
        { label: "Professional Information", step: 3 },
        { label: "Recheck Info", step: 4 },
      ];
    }
    return [
      { label: "Role & Access", step: 1 },
      { label: "Employment Information", step: 2 },
      { label: "Recheck Info", step: 3 },
    ];
  };

  const stepsList = getSteps();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (navigate) {
      navigate(ROUTES.USER_MANAGEMENT);
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto space-y-6 pb-20 relative"
      style={{ fontFamily: RB }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in ${
            toast.type === "error" ? "bg-[#EF4444]" : "bg-[#111827]"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle size={16} className="text-white" />
          ) : (
            <CheckCircle2 size={16} className="text-[#66BB6A]" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <button
          onClick={handleBackClick}
          className="hover:text-[#0D47A1] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Staff Registry
        </button>
      </div>

      <DashboardHeader
        title="Add New Staff Member"
        description="Register system users, manage clinicians qualifications, and assign operations role."
      />

      {/* Single Stepper Container Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
        {/* Step Indicator Header Banner */}
        <div className="bg-slate-50 border-b border-[#E5E7EB] px-6 py-5">
          <div className="flex items-center justify-between relative">
            {/* Background Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />

            {stepsList.map((st) => {
              const isCompleted = currentStep > st.step;
              const isActive = currentStep === st.step;

              return (
                <div
                  key={st.step}
                  className="flex flex-col items-center z-10 relative select-none"
                >
                  {/* Step Bubble */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs border transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#66BB6A] border-[#66BB6A] text-white"
                        : isActive
                          ? "bg-[#0D47A1] border-[#0D47A1] text-white shadow-sm ring-4 ring-blue-50"
                          : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : st.step}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-[10px] font-heading font-bold mt-2 tracking-wide uppercase transition-colors duration-300 hidden sm:inline ${
                      isActive
                        ? "text-[#0D47A1]"
                        : isCompleted
                          ? "text-[#66BB6A]"
                          : "text-slate-400"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body - Scrollable Slide Content */}
        <div className="p-8 flex-1 space-y-6">
          {/* Step 1: System Role & Access */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <RoleAccessSection
                form={form}
                errors={errors}
                setFieldValue={setFieldValue}
              />
            </div>
          )}

          {/* Step 2: Personal & Employment Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <PersonalInfoSection
                form={form}
                errors={errors}
                setFieldValue={setFieldValue}
                validateField={validateField}
                empIdPreview={empIdPreview}
              />
            </div>
          )}

          {/* Step 3 (Doctor): Consultation details & Availability schedule combined */}
          {form.role === "DOCTOR" && currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <ConsultationDetailsSection
                form={form}
                errors={errors}
                setFieldValue={setFieldValue}
              />
              <AvailabilityScheduleSection
                form={form}
                errors={errors}
                setFieldValue={setFieldValue}
                setNestedFieldValue={setNestedFieldValue}
                copyMondayHoursToWeekdays={copyMondayHoursToWeekdays}
              />
            </div>
          )}

          {/* Step 4 (Doctor) or Step 3 (Others): Recheck/Review Information */}
          {((form.role === "DOCTOR" && currentStep === 4) ||
            (form.role !== "DOCTOR" && currentStep === 3)) && (
            <div className="animate-fade-in">
              <ReviewInfoSection form={form} empIdPreview={empIdPreview} />
            </div>
          )}
        </div>

        {/* Stepper Wizard Footer Controls */}
        <div className="bg-slate-50 border-t border-[#E5E7EB] px-8 py-4 flex items-center justify-between">
          {/* Back Button */}
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{ fontFamily: PP }}
          >
            {currentStep > 1 ? (
              <>
                <ArrowLeft size={14} /> Back
              </>
            ) : (
              <>
                <X size={14} /> Cancel
              </>
            )}
          </button>

          {/* Right Preview/Help Message */}
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
            <Shield size={11} />
            Step {currentStep} of {totalSteps} —{" "}
            {stepsList[currentStep - 1]?.label}
          </span>

          {/* Next / Submit Button */}
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              style={{ fontFamily: PP }}
            >
              Next Step <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveStaff}
              disabled={isSubmitting || !form.role}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                isSubmitting || !form.role
                  ? "bg-slate-350 cursor-not-allowed"
                  : "bg-[#66BB6A] hover:bg-[#52a656]"
              }`}
              style={{ fontFamily: PP }}
            >
              {isSubmitting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              Save Staff Member
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStaffPage;
