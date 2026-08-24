import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { TextField } from "./TextField";
import { useLogin } from "../hooks/useLogin";
import type { LoginResponse } from "../types/auth.types";
import logoImage from "../../../assets/safehandshospital_logo.webp";
import { useHospitalBranding } from "../../settings/hooks/useHospitalBranding";

interface LoginFormProps {
  onSuccess: (response: LoginResponse) => void;
  onForgotPassword: () => void;
  onGoToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  onGoToRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, errors } = useLogin(onSuccess);
  const { logoUrl } = useHospitalBranding();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password, remember });
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
            Welcome back
          </h2>
          <p className="auth-header-subtitle text-xs sm:text-sm text-text-muted font-body mt-0.5">
            Sign in to your account to access clinical services
          </p>

          {/* Form Error Message */}
          {errors.form && (
            <div className="w-full p-2.5 mt-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium shadow-2xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="auth-form-space space-y-2.5 sm:space-y-3 pt-0.5">
          {/* Email Field */}
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email address"
            Icon={Mail}
            error={errors.email}
            autoFocus
          />

          {/* Password Field */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            Icon={Lock}
            error={errors.password}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-[#1E293B] transition-colors p-0.5"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Options Row: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-text-muted font-medium select-none mb-0">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="font-semibold text-[#0D47A1] hover:underline transition-colors text-xs sm:text-sm"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn w-full py-2.5 sm:py-3 px-6 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-colors transition-transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      {/* Bottom Footer Section */}
      <div className="auth-footer space-y-2 pt-2.5 border-t border-slate-100">
        <div className="text-center text-xs sm:text-sm text-text-muted">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onGoToRegister}
            className="font-bold text-[#0D47A1] hover:underline transition-colors cursor-pointer"
          >
            Register here
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-text-muted font-body">
          <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
          <span>Secure login · All data encrypted in transit</span>
        </div>
      </div>
    </div>
  );
};
