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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading, errors } = usePatientRegister(onSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      fullName,
      email,
      mobile,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="w-full flex flex-col justify-between space-y-6">
      {/* Top Header Logo — Fixed layout same as Login Page */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logoUrl || logoImage}
            alt="Hospital Logo"
            className="h-12 w-auto object-contain filter drop-shadow-xs"
          />
        </div>
      </div>

      {/* Center Section: Titles & Form */}
      <div className="space-y-6 my-auto">
        <div>
          <h2 className="text-3xl sm:text-2xl lg:text-4xl font-heading font-extrabold text-[#1E293B] tracking-tight">
            Create Account
          </h2>
          <p className="text-base sm:text-lg text-text-muted font-body mt-2">
            Register an account to access medical records & book appointments
          </p>

          {/* Form Errors */}
          {errors.form && (
            <div className="w-full p-4 mt-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-600 font-medium shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-5 h-5.5 text-red-500 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}
        </div>

        {/* Registration Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-4.5 pt-1">
          {/* Full Name (Full Width) */}
          <TextField
            label="Full Name"
            type="text"
            value={fullName}
            onChange={setFullName}
            placeholder="Enter your full name"
            Icon={UserIcon}
            error={errors.fullName}
            autoFocus
          />

          {/* Email & Mobile Grid (2-Column) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your Email"
              Icon={Mail}
              error={errors.email}
            />

            <TextField
              label="Mobile Number"
              type="tel"
              value={mobile}
              onChange={setMobile}
              placeholder="10-digit mobile number"
              Icon={Phone}
              error={errors.mobile}
            />
          </div>

          {/* Password & Confirm Password Grid (2-Column) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Create password"
              Icon={Lock}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-[#1E293B] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <TextField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm password"
              Icon={Lock}
              error={errors.confirmPassword}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5.5 sm:py-6 px-8 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-bold text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-colors transition-transform active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 mt-8 sm:mt-10"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Register Account"
            )}
          </button>
        </form>
      </div>

      {/* Bottom Footer Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="text-center text-sm sm:text-base text-text-muted">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onGoToLogin}
            className="font-bold text-[#0D47A1] hover:underline transition-colors"
          >
            Sign In here
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-text-muted font-body">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Secure registration · All data encrypted in transit</span>
        </div>
      </div>
    </div>
  );
};
