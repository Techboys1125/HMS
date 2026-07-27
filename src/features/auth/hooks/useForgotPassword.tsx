import { useState } from "react";
import { authService } from "../services/auth.service";
import { forgotPasswordSchema } from "../validation/login.schema";
import { ZodError } from "zod";

export const useForgotPassword = (onNext: (email: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const sendResetLink = async (email: string) => {
    try {
      setLoading(true);
      setError("");
      forgotPasswordSchema.parse({ email });

      await authService.forgotPassword({ email });
      setSent(true);
      onNext(email);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        setError(e.issues[0]?.message || "Please enter a valid email");
      } else if (e instanceof Error) {
        setError(e.message || "Failed to send reset instructions");
      } else {
        setError("Failed to send reset instructions");
      }
    } finally {
      setLoading(false);
    }
  };

  return { sendResetLink, loading, error, sent };
};
