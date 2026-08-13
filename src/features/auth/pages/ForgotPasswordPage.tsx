import React, { useState } from "react";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { TextField } from "../components/TextField";
import { useForgotPassword } from "../hooks/useForgotPassword";
import logoImage from "../../../assets/safehandshospital_logo.webp";
import { useHospitalBranding } from "../../settings/hooks/useHospitalBranding";

interface ForgotPasswordPageProps {
  onBackToLogin?: () => void;
  onSendOTP?: (email: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onBackToLogin = () => {},
  onSendOTP = () => {},
}) => {
  const { logoUrl } = useHospitalBranding();
  const [email, setEmail] = useState("");
  const { sendResetLink, loading, error } = useForgotPassword(onSendOTP);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendResetLink(email);
  };

  return (
    <div className="w-full space-y-6">
      {/* Back Button & Direct Logo Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-[#0D47A1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </button>
        <img
          src={logoUrl || logoImage}
          alt="Hospital Logo"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1E293B] tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-base sm:text-lg text-text-muted font-body mt-2">
          Enter your registered email address and we'll send you a 6-digit
          verification OTP.
        </p>

        {error && (
          <div className="w-full p-4 mt-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-600 font-medium shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email address"
          Icon={Mail}
          autoFocus
        />

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-4 px-6 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-semibold text-base sm:text-lg rounded-2xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending OTP...
            </>
          ) : (
            "Send Verification Code"
          )}
        </button>
      </form>

      <div className="pt-2 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-text-muted font-body">
        <ShieldCheck className="w-4 h-4 text-secondary" />
        <span>Secure password recovery</span>
      </div>
    </div>
  );
};
