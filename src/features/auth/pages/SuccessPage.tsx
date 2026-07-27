import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface SuccessPageProps {
  title?: string;
  message?: string;
  onContinue: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  title = "Password Reset Successfully!",
  message = "Your password has been updated. You can now sign in with your new password.",
  onContinue,
}) => {
  return (
    <div className="w-full space-y-6 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-green flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1E293B] tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 font-body mt-2 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3.5 px-6 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-heading font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
      >
        Continue to Sign In <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
