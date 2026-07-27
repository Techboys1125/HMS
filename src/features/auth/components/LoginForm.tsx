import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  AlertCircle
} from "lucide-react";
import { TextField } from "./TextField";
import { useLogin } from "../hooks/useLogin";
import type { LoginResponse } from "../types/auth.types";
import logoImage from "../../../assets/safehandshospital_logo.webp";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password, remember });
  };

  return (
    <div className="w-full flex flex-col justify-between space-y-6">
      {/* Top Header Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src={logoImage}
            alt="Safe Hands Logo"
            className="h-11 w-auto object-contain filter drop-shadow-xs"
          />
          <div>
            <h3 className="font-heading font-bold text-lg text-[#1E293B] leading-none">
              Safe Hands Hospital
            </h3>
            <p className="text-xs sm:text-sm text-text-muted font-body mt-1">
              Healthcare Management System
            </p>
          </div>
        </div>
      </div>

      {/* Center Section: Titles & Form */}
      <div className="space-y-6 my-auto">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-heading font-extrabold text-[#1E293B] tracking-tight">
            Welcome back
          </h2>
          <p className="text-base sm:text-lg text-text-muted font-body mt-2">
            Sign in to your account to access clinical services
          </p>

          {/* Form Error Message */}
          {errors.form && (
            <div className="w-full p-4 mt-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-600 font-medium shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
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
                className="text-text-muted hover:text-[#1E293B] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          {/* Options Row: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm sm:text-base pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-text-muted font-medium select-none mb-0">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4.5 h-4.5 rounded-md border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="font-semibold text-[#0D47A1] hover:underline transition-all"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5.5 sm:py-6 px-8 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-bold text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 sm:mt-10"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

      </div>

      {/* Bottom Footer Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="text-center text-sm sm:text-base text-text-muted">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onGoToRegister}
            className="font-bold text-[#0D47A1] hover:underline transition-all"
          >
            Register here
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-text-muted font-body">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Secure login · All data encrypted in transit</span>
        </div>
      </div>
    </div>
  );
};
