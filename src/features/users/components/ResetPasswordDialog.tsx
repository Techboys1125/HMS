import React from "react";
import { Key, X, AlertTriangle, Loader2 } from "lucide-react";
import type { UserRecord } from "../pages/UserManagement";

interface ResetPasswordDialogProps {
  user: UserRecord | null;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  user,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5E7EB] animate-scale-in">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm flex items-center gap-2">
            <Key size={16} className="text-amber-500" /> Administrative
            Password Reset
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={onConfirm}
          className="p-6 space-y-4 text-xs font-body"
        >
          <p className="text-slate-500 leading-relaxed">
            You are about to trigger a password reset for{" "}
            <strong className="text-slate-900">
              {user.fullName} ({user.empId})
            </strong>
            . This will revoke their current password immediately.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 text-amber-800">
            <AlertTriangle
              size={18}
              className="shrink-0 text-amber-600 mt-0.5"
            />
            <p className="leading-relaxed">
              Upon submission, the user's login access will be set to
              Pending Password Setup. A password reset link will be sent to
              the email: <strong>{user.email}</strong>.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl font-semibold hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 size={12} className="animate-spin" />
              )}
              Confirm Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordDialog;
