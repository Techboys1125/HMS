import React from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useOTP } from "../hooks/useOTP";
import logoImage from "../../../assets/safehandshospital_logo.webp";

interface OTPPageProps {
  email: string;
  onBack: () => void;
  onVerified: (resetToken: string) => void;
}

export const OTPPage: React.FC<OTPPageProps> = ({
  email,
  onBack,
  onVerified,
}) => {
  const { otp, setOtp, timer, loading, error, refs, verify } = useOTP(
    email,
    onVerified,
  );

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && refs.current[index + 1]) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join("");
    verify(fullCode || "123456");
  };

  return (
    <div className="w-full space-y-6">
      {/* Back Button & Logo Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-muted hover:text-[#0D47A1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-center">
          <img
            src={logoImage}
            alt="Safe Hands Logo"
            className="h-7 w-auto object-contain"
          />
        </div>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#1E293B] tracking-tight">
          Verify OTP
        </h2>
        <p className="text-sm sm:text-base text-text-muted font-body mt-1">
          Enter the 6-digit code sent to{" "}
          <strong className="text-[#1E293B]">
            {email || "your registered email"}
          </strong>
        </p>

        {error && (
          <div className="w-full p-3.5 mt-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-600 font-medium shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* OTP Input Grid */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                refs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="flex-1 h-14 text-center text-xl font-heading font-bold rounded-xl border border-slate-200 bg-white text-[#1E293B] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/10 outline-none transition-all"
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-text-muted">
          <span>Didn't receive the code?</span>
          {timer > 0 ? (
            <span className="font-semibold text-slate-400">
              Resend in {timer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {}}
              className="font-semibold text-[#0D47A1] hover:underline"
            >
              Resend Code
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length < 6}
          className="w-full py-3.5 px-6 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-semibold text-sm sm:text-base rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Proceed"
          )}
        </button>
      </form>
    </div>
  );
};
