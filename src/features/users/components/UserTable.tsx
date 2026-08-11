import React, { useState } from "react";
import {
  Mail,
  MoreVertical,
  Eye,
  Edit,
  Key,
  UserCheck,
  UserX,
} from "lucide-react";
import type { UserRecord } from "../pages/UserManagement";
import RoleBadge from "../../../common/components/RoleBadge";
import { StatusBadge } from "../../../common/components/StatusBadge";
import UserAvatar from "../../../common/components/UserAvatar";

const PP = "Poppins, sans-serif";

interface UserTableProps {
  users: UserRecord[];
  onViewDetails: (user: UserRecord) => void;
  onEdit: (user: UserRecord) => void;
  onResetPassword: (user: UserRecord) => void;
  onStatusChange: (user: UserRecord, action: "Activate" | "Deactivate") => void;
  currentUserEmail?: string;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewDetails,
  onEdit,
  onResetPassword,
  onStatusChange,
  currentUserEmail,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleActionMenu = (id: string) => {
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
    }
  };

  return (
    <div className="overflow-x-auto max-h-[600px] overflow-y-auto w-full">
      <table className="w-full border-collapse text-left text-xs bg-white">
        <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10 text-[#64748B] font-bold">
          <tr style={{ fontFamily: PP }}>
            <th className="px-4 py-3.5">Employee ID</th>
            <th className="px-4 py-3.5">Full Name</th>
            <th className="px-4 py-3.5">Role</th>
            <th className="px-4 py-3.5">Email</th>
            <th className="px-4 py-3.5">Phone</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Last Login</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-[#111827]">
          {users.map((user) => {
            const isSelf = currentUserEmail === user.email;
            return (
              <tr
                key={user?.id || user?._id || user?.key || user?.value || user?.code || user?.name || user?.title || user?.label || (typeof user === 'object' ? JSON.stringify(user) : String(user))}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                  {user.empId}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.fullName} size="sm" />
                    <div>
                      <span
                        className="font-bold text-[#111827] block"
                        style={{ fontFamily: PP }}
                      >
                        {user.fullName}
                      </span>
                      <span className="text-[10px] text-[#64748B]">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3.5 text-slate-600">
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:text-[#0D47A1] hover:underline flex items-center gap-1"
                  >
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate max-w-[160px]">{user.email}</span>
                  </a>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-mono">
                  {user.phone}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3.5 text-slate-500 font-medium">
                  {user.lastLogin}
                </td>
                <td className="px-5 py-3.5 text-right relative">
                  <button
                    onClick={() => toggleActionMenu(user.id)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-[#111827] rounded-lg transition-colors cursor-pointer"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {activeMenuId === user.id && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div className="absolute right-5 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-30 py-1.5 text-left text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                        <button
                          onClick={() => {
                            onViewDetails(user);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-semibold cursor-pointer"
                        >
                          <Eye size={13} className="text-slate-400" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => {
                            onEdit(user);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-semibold cursor-pointer"
                        >
                          <Edit size={13} className="text-slate-400" />
                          <span>Edit Info</span>
                        </button>
                        <button
                          onClick={() => {
                            onResetPassword(user);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-semibold cursor-pointer"
                        >
                          <Key size={13} className="text-slate-400" />
                          <span>Reset Password</span>
                        </button>
                        {user.status === "Active" ? (
                          <button
                            disabled={isSelf}
                            onClick={() => {
                              onStatusChange(user, "Deactivate");
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-red-50 text-red-650 flex items-center gap-2 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <UserX size={13} />
                            <span>Deactivate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onStatusChange(user, "Activate");
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-green-50 text-green-700 flex items-center gap-2 font-semibold cursor-pointer"
                          >
                            <UserCheck size={13} />
                            <span>Activate</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
