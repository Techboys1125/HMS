/**
 * SwitchAccountDialog – Modal for switching between patient and family member accounts
 * Only available for PATIENT role
 */
import { useState } from "react";
import { X, ArrowRightLeft, User, CheckCircle2 } from "lucide-react";
import type { FamilyMember } from "../types/family.types";
import { PP, RB } from "../../doctors/constants/doctors.constants";

interface SwitchAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
  activeMrn: string;
  primaryMrn: string;
  onSwitchToMember: (member: FamilyMember) => void;
  onSwitchToPrimary: () => void;
  isLoading?: boolean;
}

export function SwitchAccountDialog({
  isOpen,
  onClose,
  familyMembers,
  activeMrn,
  primaryMrn,
  onSwitchToMember,
  onSwitchToPrimary,
}: SwitchAccountDialogProps) {
  const [switching, setSwitching] = useState(false);

  if (!isOpen) return null;

  const handleSwitch = async (member: FamilyMember) => {
    setSwitching(true);
    try {
      onSwitchToMember(member);
      onClose();
    } finally {
      setSwitching(false);
    }
  };

  const handleSwitchToPrimary = async () => {
    setSwitching(true);
    try {
      onSwitchToPrimary();
      onClose();
    } finally {
      setSwitching(false);
    }
  };

  const isPrimaryActive = activeMrn === primaryMrn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-[scaleIn_0.25s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D47A1]/8 flex items-center justify-center">
              <ArrowRightLeft size={15} className="text-[#0D47A1]" />
            </div>
            <div>
              <h3
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Switch Account
              </h3>
              <p
                className="text-[11px] text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                View records for a family member
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Account List */}
        <div className="px-6 py-4 space-y-2 max-h-80 overflow-y-auto">
          {/* Primary (Self) account */}
          <button
            onClick={handleSwitchToPrimary}
            disabled={isPrimaryActive || switching}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              isPrimaryActive
                ? "bg-blue-50 border-[#0D47A1]/20 ring-1 ring-[#0D47A1]/10"
                : "bg-white border-[#E5E7EB] hover:bg-slate-50 hover:border-[#0D47A1]/30"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                isPrimaryActive
                  ? "bg-[#0D47A1] text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#111827]">
                My Account (Self)
              </div>
              <div className="text-[11px] text-[#64748B]">
                MRN: {primaryMrn}
              </div>
            </div>
            {isPrimaryActive && (
              <CheckCircle2 size={16} className="text-[#0D47A1] shrink-0" />
            )}
          </button>

          {/* Family Members */}
          {familyMembers.length === 0 ? (
            <div className="text-center py-4 text-xs text-[#64748B]">
              No family members found.
            </div>
          ) : (
            familyMembers.map((member) => {
              const memberMrn = member.mrn || String(member.id);
              const isActive = memberMrn === activeMrn;
              return (
                <button
                  key={member.id}
                  onClick={() => handleSwitch(member)}
                  disabled={isActive || switching}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    isActive
                      ? "bg-blue-50 border-[#0D47A1]/20 ring-1 ring-[#0D47A1]/10"
                      : "bg-white border-[#E5E7EB] hover:bg-slate-50 hover:border-[#0D47A1]/30"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      isActive
                        ? "bg-[#0D47A1] text-white"
                        : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    {member.name?.charAt(0) || "F"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#111827]">
                      {member.name || member.fullName || "—"}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      {member.relationship || "—"}{" "}
                      {memberMrn ? `· MRN: ${memberMrn}` : ""}
                    </div>
                  </div>
                  {isActive && (
                    <CheckCircle2
                      size={16}
                      className="text-[#0D47A1] shrink-0"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E5E7EB] bg-slate-50/50 rounded-b-2xl">
          <p className="text-[10px] text-slate-400 text-center">
            Switching accounts will reload all data including appointments,
            prescriptions, and billing.
          </p>
        </div>
      </div>
    </div>
  );
}
