import React, { useState } from "react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { TextField } from "./TextField";
import { usePatientRegister } from "../hooks/usePatientRegister";
import type { PatientRegistrationResponse } from "../types/auth.types";
import logoImage from "../../../assets/safehandshospital_logo.webp";
import { useHospitalBranding } from "../../settings/hooks/useHospitalBranding";
import { CustomDatePicker } from "../../../components/CustomDatePicker";

interface PatientRegisterFormProps {
  onSuccess: (res: PatientRegistrationResponse) => void;
  onGoToLogin: () => void;
}

export const PatientRegisterForm: React.FC<PatientRegisterFormProps> = ({
  onSuccess,
  onGoToLogin,
}) => {
  const { logoUrl } = useHospitalBranding();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loading, errors, setErrors } = usePatientRegister(onSuccess);

  // Max DOB is today
  const todayISO = new Date().toISOString().split("T")[0];

  const handleFieldChange = (
    field: string,
    val: string,
    setter: (v: string) => void,
  ) => {
    setter(val);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    register({
      fullName,
      email: email.trim() || undefined,
      mobile,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="w-full flex flex-col justify-between space-y-3 sm:space-y-4">
      {/* Top Header Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logoUrl || logoImage}
            alt="Hospital Logo"
            className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-xs"
          />
        </div>
      </div>

      {/* Center Section: Titles & Form */}
      <div className="auth-form-space space-y-3 sm:space-y-4 my-auto">
        <div>
          <h2 className="auth-header-title text-xl sm:text-2xl font-heading font-extrabold text-[#1E293B] tracking-tight">
            Create Patient Account
          </h2>
          <p className="auth-header-subtitle text-xs sm:text-sm text-text-muted font-body mt-0.5">
            Register an account to access medical records & book appointments
          </p>

          {/* Form Errors */}
          {errors.form && (
            <div className="w-full p-2.5 mt-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium shadow-2xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}
        </div>

        {/* Registration Form Grid */}
        <form onSubmit={handleSubmit} className="auth-form-space space-y-2.5 sm:space-y-3 pt-0.5">
          {/* Full Name * */}
          <TextField
            label="Full Name *"
            type="text"
            value={fullName}
            onChange={(v) => handleFieldChange("fullName", v, setFullName)}
            placeholder="Enter your full name"
            Icon={UserIcon}
            error={errors.fullName}
            autoFocus
          />

          {/* Email & Phone Number Grid */}
          <div className="auth-form-grid grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <TextField
              label="Email *"
              type="email"
              value={email}
              onChange={(v) => handleFieldChange("email", v, setEmail)}
              placeholder="Enter your Email"
              Icon={Mail}
              error={errors.email}
            />
            <TextField
              label="Phone Number *"
              type="tel"
              value={mobile}
              onChange={(v) => handleFieldChange("mobile", v, setMobile)}
              placeholder="10-digit mobile number"
              Icon={Phone}
              error={errors.mobile}
            />
          </div>

          {/* Date of Birth & Gender Grid */}
          <div className="auth-form-grid grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* Date of Birth */}
            <CustomDatePicker
              label="Date of Birth (Optional)"
              labelClassName="block text-xs font-heading font-bold text-[#1E293B] tracking-wide mb-1.5"
              value={dateOfBirth}
              onChange={(val) =>
                handleFieldChange("dateOfBirth", val, setDateOfBirth)
              }
              maxDate={todayISO}
              error={errors.dateOfBirth}
              inputClassName="auth-input-field w-full py-2.5 px-3.5 text-xs sm:text-sm font-body rounded-xl border border-slate-200 bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100/70 focus:bg-white focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15 shadow-2xs outline-none transition-colors duration-200"
            />

            {/* Gender */}
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-heading font-bold text-[#1E293B] tracking-wide">
                Gender (Optional)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="auth-input-field w-full py-2.5 px-3.5 text-xs sm:text-sm font-body rounded-xl border border-slate-200 bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100/70 focus:bg-white focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15 shadow-2xs outline-none transition-colors duration-200"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Password * & Confirm Password * Grid */}
          <div className="auth-form-grid grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <TextField
              label="Password *"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(v) => handleFieldChange("password", v, setPassword)}
              placeholder="Create password"
              Icon={Lock}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-[#1E293B] transition-colors p-0.5 flex items-center justify-center focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <TextField
              label="Confirm Password *"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(v) =>
                handleFieldChange("confirmPassword", v, setConfirmPassword)
              }
              placeholder="Confirm password"
              Icon={Lock}
              error={errors.confirmPassword}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-text-muted hover:text-[#1E293B] transition-colors p-0.5 flex items-center justify-center focus:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              }
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn w-full py-2.5 sm:py-3 px-6 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-colors transition-transform active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Register Account"
            )}
          </button>
        </form>
      </div>

      {/* Bottom Footer Section */}
      <div className="auth-footer space-y-2 pt-2.5 border-t border-slate-100">
        <div className="text-center text-xs sm:text-sm text-text-muted">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onGoToLogin}
            className="font-bold text-[#0D47A1] hover:underline transition-colors cursor-pointer"
          >
            Sign In here
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-text-muted font-body">
          <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
          <span>Secure registration · All data encrypted in transit</span>
        </div>
      </div>
    </div>
  );
};
