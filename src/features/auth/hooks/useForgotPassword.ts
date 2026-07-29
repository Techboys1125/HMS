import { useState } from "react";
import { authService } from "../services/auth.service";
import { forgotPasswordSchema } from "../validation/login.schema";

export function useForgotPassword(onSendOTP?: (email: string) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendResetLink = async (email: string) => {
    const valErr = forgotPasswordSchema({ email });
    if (valErr) {
      setError(valErr);
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.forgotPassword({ email });
      if (onSendOTP) {
        onSendOTP(email);
      }
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset email";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sendResetLink, requestOTP: sendResetLink, loading, error, setError };
}
