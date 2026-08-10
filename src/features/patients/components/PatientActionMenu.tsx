/**
 * PatientActionMenu – Role-filtered action dropdown menu
 */
import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit3,
  Calendar,
  UserPlus,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import { can } from "../utils/patientPermissions";
import type { Role } from "../utils/patientPermissions";

interface PatientActionMenuProps {
  currentRole: Role;
  isOwnRecord?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onBookAppointment?: () => void;
  onAddFamilyMember?: () => void;
  onSwitchAccount?: () => void;
  onViewRecords?: () => void;
}

export function PatientActionMenu({
  currentRole,
  isOwnRecord = false,
  onView,
  onEdit,
  onBookAppointment,
  onAddFamilyMember,
  onSwitchAccount,
  onViewRecords,
}: PatientActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    {
      label: "View Profile",
      icon: Eye,
      action: onView,
      show: can(currentRole, "viewProfile", isOwnRecord),
    },
    {
      label: "Edit Profile",
      icon: Edit3,
      action: onEdit,
      show: can(currentRole, "editProfile", isOwnRecord),
    },
    {
      label: "Book Appointment",
      icon: Calendar,
      action: onBookAppointment,
      show: can(currentRole, "manageAppointments", isOwnRecord),
    },
    {
      label: "Add Family Member",
      icon: UserPlus,
      action: onAddFamilyMember,
      show: can(currentRole, "manageFamilyMembers", isOwnRecord),
    },
    {
      label: "Switch Account",
      icon: ArrowRightLeft,
      action: onSwitchAccount,
      show: currentRole === "PATIENT" && isOwnRecord,
    },
    {
      label: "Medical Records",
      icon: FileText,
      action: onViewRecords,
      show: can(currentRole, "viewProfile", isOwnRecord),
    },
  ].filter((a) => a.show && a.action);

  if (actions.length === 0) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <MoreVertical size={16} className="text-[#64748B]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl border border-[#E5E7EB] shadow-lg py-1.5 min-w-45 animate-[scaleIn_0.15s_ease-out]">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  action.action?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#111827] hover:bg-slate-50 transition-colors text-left"
              >
                <Icon size={13} className="text-[#64748B]" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
