import React from "react";
import {
  X,
  Shield,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { UserRecord } from "../pages/UserManagement";
import RoleBadge from "../../../common/components/RoleBadge";
import { StatusBadge } from "../../../common/components/StatusBadge";
import UserAvatar from "../../../common/components/UserAvatar";

const PP = "Poppins, sans-serif";

interface StatusChangeDialogProps {
  statusDialogUser: {
    user: UserRecord;
    action: "Activate" | "Suspend" | "Deactivate";
  } | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const StatusChangeDialog: React.FC<StatusChangeDialogProps> = ({
  statusDialogUser,
  onClose,
  onConfirm,
}) => {
  if (!statusDialogUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5E7EB] animate-scale-in">
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm flex items-center gap-2">
            <Shield size={16} className="text-[#0D47A1]" /> Administrative
            Account Control
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-body">
          <p className="text-slate-500 leading-relaxed">
            Are you sure you want to perform the action{" "}
            <strong>{statusDialogUser.action}</strong> on the account belonging
            to{" "}
            <strong className="text-slate-900">
              {statusDialogUser.user.fullName} ({statusDialogUser.user.empId})
            </strong>
            ?
          </p>

          {statusDialogUser.action === "Deactivate" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2.5 text-red-800">
              <AlertTriangle
                size={18}
                className="shrink-0 text-red-600 mt-0.5"
              />
              <p className="leading-relaxed">
                This action will immediately deactivate the user account and
                revoke their active session. They will be logged out and unable
                to log back in until re-activated.
              </p>
            </div>
          )}

          {statusDialogUser.action === "Activate" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex gap-2.5 text-green-800">
              <CheckCircle2
                size={18}
                className="shrink-0 text-green-600 mt-0.5"
              />
              <p className="leading-relaxed">
                This action will re-activate the user account and restore their
                system login privileges.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-xl font-semibold hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-xl font-bold transition-colors cursor-pointer ${
                statusDialogUser.action === "Deactivate"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Confirm{" "}
              {statusDialogUser.action === "Deactivate"
                ? "Deactivate"
                : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UserDetailsDrawerProps {
  user: UserRecord | null;
  fullDetail: any;
  onClose: () => void;
  onEdit: (user: UserRecord) => void;
  deptName?: string;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  user,
  fullDetail,
  onClose,
  onEdit,
  deptName,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in-from-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block">
              STAFF FILE SUMMARY
            </span>
            <h3 className="font-bold text-[#1E293B] text-base leading-tight mt-0.5">
              Auditing record fields for {user.empId}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#64748B] font-medium leading-relaxed">
          {/* Card Top */}
          <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
            <UserAvatar name={user.fullName} size="lg" />
            <div className="space-y-1">
              <h4
                className="font-bold text-[#1E293B] text-base"
                style={{ fontFamily: PP }}
              >
                {user.fullName}
              </h4>
              <span className="text-slate-400 block">@{user.username}</span>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          {/* Details Sections */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <span className="text-slate-400 font-bold block mb-1">
                Employee ID
              </span>
              <span className="text-[#1E293B] font-bold font-mono">
                {user.empId}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">
                Department
              </span>
              <span className="text-[#1E293B] font-bold">
                {deptName || user.department}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">
                Internal Database Key
              </span>
              <span className="text-[#1E293B] font-bold font-mono">
                {user.id}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">
                Gender
              </span>
              <span className="text-[#1E293B] font-bold">
                {fullDetail?.gender || "MALE"}
              </span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Contact Details */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#1E293B] text-xs font-heading">
              Contact Details
            </h5>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <span className="text-slate-400 font-bold block mb-1">
                  Email Address
                </span>
                <span className="text-[#1E293B] font-bold">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-1">
                  Contact Number
                </span>
                <span className="text-[#1E293B] font-bold font-mono">
                  {fullDetail?.mobile || user.phone}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Security & Access */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#1E293B] text-xs font-heading">
              Security Details
            </h5>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <span className="text-slate-400 font-bold block mb-1">
                  Last Logged Session
                </span>
                <span className="text-[#1E293B] font-bold">
                  {user.lastLogin}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-1">
                  Two-Factor Authentication
                </span>
                <span
                  className={`font-bold block mt-1 ${user.twoFactor ? "text-green-500" : "text-slate-400"}`}
                >
                  {user.twoFactor ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-150 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-250 text-slate-700 bg-white hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Close file
          </button>
          <button
            onClick={() => {
              onEdit(user);
              onClose();
            }}
            className="px-4 py-2.5 bg-[#0D47A1] hover:bg-[#0c3d8a] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Edit Staff File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
