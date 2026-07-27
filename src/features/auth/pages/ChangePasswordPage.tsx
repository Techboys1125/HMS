import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { TextField } from "../components/TextField";
import { authService } from "../services/auth.service";
import logoImage from "../../../assets/safehandshospital_logo.webp";

interface ChangePasswordPageProps {
  onSuccess: () => void;
}

export const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to change password");
      } else {
        setError("Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Logo */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
          <img
            src={logoImage}
            alt="Safe Hands Logo"
            className="h-9 w-auto object-contain"
          />
        </div>
        <div>
          <h3 className="font-heading font-bold text-base text-[#1E293B] leading-none">
            Safe Hands Hospital
          </h3>
          <p className="text-xs text-text-muted font-body mt-0.5">
            Staff Account Activation
          </p>
        </div>
      </div>

      {/* Alert Notice for Forced Password Change */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-heading font-semibold block text-sm mb-0.5 text-amber-900">
            Password Change Required
          </strong>
          You logged in with a temporary password. Please set a new password to
          activate your staff account.
        </div>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#1E293B] tracking-tight">
          Change Password
        </h2>
        <p className="text-sm sm:text-base text-text-muted font-body mt-1">
          Create a new secure password for your account.
        </p>

        {error && (
          <div className="w-full p-3.5 mt-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-600 font-medium shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Current / Temporary Password"
          type={showPassword ? "text" : "password"}
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Admin@123"
          Icon={Lock}
          autoFocus
        />

        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={setNewPassword}
          placeholder="DoctorNewPassword@123"
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
        />

        <TextField
          label="Confirm New Password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Re-enter new password"
          Icon={Lock}
        />

        <button
          type="submit"
          disabled={
            loading || !currentPassword || !newPassword || !confirmPassword
          }
          className="w-full py-3.5 px-6 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-semibold text-sm sm:text-base rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating Password...
            </>
          ) : (
            "Change Password & Activate Account"
          )}
        </button>
      </form>
    </div>
  );
};
