import React, { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { TextField } from "../components/TextField";
import logoImage from "../../../assets/safehandshospital_logo.webp";
import { useHospitalBranding } from "../../settings/hooks/useHospitalBranding";

interface ResetPasswordPageProps {
  onSuccess?: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  onSuccess = () => {},
}) => {
  const { logoUrl } = useHospitalBranding();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Logo */}
      <div className="flex items-center">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
          <img
            src={logoUrl || logoImage}
            alt="Hospital Logo"
            className="h-9 w-auto object-contain"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#1E293B] tracking-tight">
          Set New Password
        </h2>
        <p className="text-sm sm:text-base text-text-muted font-body mt-1">
          Your new password must be different from previous passwords.
        </p>

        {error && (
          <div className="w-full p-3.5 mt-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-600 font-medium shadow-sm flex items-center gap-2.5 transition-opacity fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          placeholder="Enter new password"
          Icon={Lock}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-[#1E293B] transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          autoFocus
        />

        <TextField
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Re-enter new password"
          Icon={Lock}
        />

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="w-full py-3.5 px-6 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-semibold text-sm sm:text-base rounded-xl shadow-md transition-colors transition-transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};
