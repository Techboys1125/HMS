import { useState, useRef, useEffect } from "react";
import { authService } from "../services/auth.service";

export const useOTP = (
  email: string,
  onVerify: (resetToken: string) => void,
) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setInterval(() => setTimer((v) => v - 1), 1000);
      return () => clearInterval(t);
    }
  }, [timer]);

  const verify = async (code: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await authService.verifyResetOTP({
        email,
        otp: code,
      });
      if (response.data?.resetToken) {
        onVerify(response.data.resetToken);
      } else {
        setError("Invalid OTP code");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "OTP verification failed");
      } else {
        setError("OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setError("");
      await authService.resendVerificationOTP(email);
      setTimer(30);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to resend OTP");
      } else {
        setError("Failed to resend OTP");
      }
    }
  };

  return { otp, setOtp, timer, loading, error, refs, verify, resend };
};
