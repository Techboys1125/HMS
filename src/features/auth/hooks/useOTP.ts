import { useState, useRef, useEffect } from "react";
import { authService } from "../services/auth.service";

export function useOTP(
  email?: string,
  onVerified?: (resetToken: string) => void
) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const verify = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit OTP code");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.verifyResetOTP({
        email: email || "",
        otp: code,
      });

      const resetToken =
        res.data?.resetToken ||
        (res as unknown as Record<string, string>).resetToken ||
        "reset-token-ok";

      if (onVerified) {
        onVerified(resetToken);
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP code");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!email) return false;
    setLoading(true);
    setError(null);
    try {
      await authService.resendVerificationOTP(email);
      setTimer(60);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    timer,
    loading,
    error,
    refs,
    verify,
    verifyOTP: verify,
    resendOTP,
    setError,
  };
}
