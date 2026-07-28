import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  Shield,
  Key,
  Edit,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Building2,
  Clock,
  ArrowUpDown,
  RotateCcw,
  UserPlus,
  Check,
  Loader2,
} from "lucide-react";
import DashboardHeader from "../../dashboard/components/DashboardHeader";
import CreateStaffPage from "./CreateStaffPage";
import { usersApi } from "../api/users.api";
import type { User } from "../../auth/types/auth.types";
import type { AdminUpdateStaffData } from "../types/users.types";

// --- Typography & Design Tokens ---
const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

export type SystemRole =
  | "Super Admin"
  | "Hospital Admin"
  | "Doctor"
  | "Receptionist"
  | "Nurse"
  | "Accountant"
  | "Patient";

export type AccountStatus = "Active" | "Inactive" | "Pending" | "Suspended";

export interface UserRecord {
  id: string;
  empId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: SystemRole;
  department: string;
  status: AccountStatus;
  lastLogin: string;
  joinedDate: string;
  twoFactor: boolean;
  departmentId?: number;
}

// Map backend roles to frontend display roles
const BACKEND_TO_DISPLAY_ROLE: Record<string, SystemRole> = {
  SUPER_ADMIN: "Super Admin",
  HOSPITAL_ADMIN: "Hospital Admin",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
  NURSE: "Nurse",
  ACCOUNTANT: "Accountant",
  PATIENT: "Patient",
};

// Map frontend display statuses to backend statuses
const DISPLAY_TO_BACKEND_STATUS: Record<AccountStatus, string> = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
  Pending: "PENDING",
  Suspended: "SUSPENDED",
};

// Map backend statuses to frontend display statuses
const BACKEND_TO_DISPLAY_STATUS: Record<string, AccountStatus> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
};

// Department ID mapping helper
const DEPARTMENT_NAME_TO_ID: Record<string, number> = {
  Cardiology: 1,
  "General Medicine": 2,
  Neurology: 3,
  Administration: 4,
  "OPD Reception": 5,
  "Accounts & Billing": 6,
  "Nursing & Patient Care": 7,
  "IT & Systems": 8,
};

const DEPARTMENT_ID_TO_NAME: Record<number, string> = {
  1: "Cardiology",
  2: "General Medicine",
  3: "Neurology",
  4: "Administration",
  5: "OPD Reception",
  6: "Accounts & Billing",
  7: "Nursing & Patient Care",
  8: "IT & Systems",
};

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  const [isCreatingStaff, setIsCreatingStaff] = useState(false);

  // Main Data States
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [deptFilter, setDeptFilter] = useState<string>("All");

  // Sorting
  const [sortColumn, setSortColumn] = useState<keyof UserRecord>("empId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Drawer States
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [detailsUser, setDetailsUser] = useState<UserRecord | null>(null);

  // Dialog States
  const [resetPassUser, setResetPassUser] = useState<UserRecord | null>(null);
  const [statusDialogUser, setStatusDialogUser] = useState<{
    user: UserRecord;
    action: "Activate" | "Suspend" | "Deactivate";
  } | null>(null);

  // Loading states for actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "General Medicine",
    status: "Active" as AccountStatus,
  });

  // Fetch Users
  const fetchUsers = async () => {
    // Schedule state updates asynchronously to avoid synchronous calls inside effects
    Promise.resolve().then(() => {
      setLoading(true);
      setErrorMsg(null);
    });

    try {
      const response = await usersApi.adminGetUsers();
      if (response.success && response.data) {
        const mappedUsers: UserRecord[] = response.data.map((u: User) => {
          const roleDisplay =
            BACKEND_TO_DISPLAY_ROLE[String(u.role).toUpperCase()] || "Doctor";
          const statusDisplay =
            BACKEND_TO_DISPLAY_STATUS[String(u.status).toUpperCase()] ||
            "Active";
          const deptId = u.hospitalId || 2; // Default fallback to general medicine dept id
          const deptName = DEPARTMENT_ID_TO_NAME[deptId] || "General Medicine";

          return {
            id: String(u.id),
            empId:
              u.employeeId ||
              `EMP-${roleDisplay.substring(0, 3).toUpperCase()}-${u.id}`,
            fullName: u.fullName,
            username: u.email ? u.email.split("@")[0] : `user_${u.id}`,
            email: u.email,
            phone: u.mobile || "+1 (555) 000-0000",
            role: roleDisplay,
            department: deptName,
            departmentId: deptId,
            status: statusDisplay,
            lastLogin: "Today, 10:15 AM",
            joinedDate: "2023-11-01",
            twoFactor: false,
          };
        });
        setUsers(mappedUsers);
      } else {
        setErrorMsg(response.message || "Failed to retrieve staff list.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Error fetching staff accounts";
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const initialLoad = async () => {
      try {
        const response = await usersApi.adminGetUsers();
        if (!active) return;
        if (response.success && response.data) {
          const mappedUsers: UserRecord[] = response.data.map((u: User) => {
            const roleDisplay =
              BACKEND_TO_DISPLAY_ROLE[String(u.role).toUpperCase()] || "Doctor";
            const statusDisplay =
              BACKEND_TO_DISPLAY_STATUS[String(u.status).toUpperCase()] ||
              "Active";
            const deptId = u.hospitalId || 2;
            const deptName =
              DEPARTMENT_ID_TO_NAME[deptId] || "General Medicine";

            return {
              id: String(u.id),
              empId:
                u.employeeId ||
                `EMP-${roleDisplay.substring(0, 3).toUpperCase()}-${u.id}`,
              fullName: u.fullName,
              username: u.email ? u.email.split("@")[0] : `user_${u.id}`,
              email: u.email,
              phone: u.mobile || "+1 (555) 000-0000",
              role: roleDisplay,
              department: deptName,
              departmentId: deptId,
              status: statusDisplay,
              lastLogin: "Today, 10:15 AM",
              joinedDate: "2023-11-01",
              twoFactor: false,
            };
          });
          setUsers(mappedUsers);
        } else {
          setErrorMsg(response.message || "Failed to retrieve staff list.");
        }
      } catch (err: unknown) {
        if (!active) return;
        const errMsg =
          err instanceof Error ? err.message : "Error fetching staff accounts";
        setErrorMsg(errMsg);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initialLoad();
    return () => {
      active = false;
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Open Edit Drawer
  const handleOpenEditDrawer = (user: UserRecord) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      status: user.status,
    });
  };

  // Handle Edit User Submission (PUT /api/v1/admin/users/{userId})
  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const deptId = DEPARTMENT_NAME_TO_ID[editForm.department] || 2;
      const apiStatus = DISPLAY_TO_BACKEND_STATUS[editForm.status] || "ACTIVE";

      const payload: AdminUpdateStaffData = {
        fullName: editForm.fullName,
        email: editForm.email,
        mobile: editForm.phone,
        departmentId: deptId,
        status: apiStatus,
      };

      const response = await usersApi.adminUpdateStaff(editingUser.id, payload);
      if (response.success) {
        triggerToast(`User ${editingUser.empId} profile updated successfully!`);
        setEditingUser(null);
        fetchUsers(); // Refresh database list
      } else {
        triggerToast(response.message || "Failed to update user.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Error updating staff";
      triggerToast(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Reset Request (POST /api/v1/admin/users/{userId}/reset-password)
  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser) return;

    setIsSubmitting(true);
    try {
      const response = await usersApi.adminResetPassword(resetPassUser.id);
      if (response.success) {
        triggerToast(
          `Password reset triggered successfully for ${resetPassUser.empId}. Temporary instructions sent.`,
        );
        setResetPassUser(null);
      } else {
        triggerToast(response.message || "Failed to reset password.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Error resetting password";
      triggerToast(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Account Status Toggles (Activate / Suspend / Deactivate)
  const handleConfirmStatusChange = async () => {
    if (!statusDialogUser) return;
    const { user, action } = statusDialogUser;

    const loadingKey = `${action.toLowerCase()}-${user.id}`;
    setActionLoadingId(loadingKey);
    setStatusDialogUser(null); // Close dialog immediately

    try {
      let response;
      if (action === "Activate") {
        response = await usersApi.adminActivateUser(user.id);
      } else {
        response = await usersApi.adminDeactivateUser(
          user.id,
          `${action} triggered from dashboard`,
        );
      }

      if (response && response.success) {
        triggerToast(
          `User ${user.empId} account status successfully changed to "${action === "Activate" ? "Active" : "Inactive"}".`,
        );
        fetchUsers(); // Refresh database list
      } else {
        triggerToast(response?.message || "Failed to toggle account status.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Error changing account status";
      triggerToast(errMsg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- KPI Counts ---
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === "Active").length;
  const inactiveUsersCount = users.filter(
    (u) => u.status === "Inactive" || u.status === "Suspended",
  ).length;
  const pendingUsersCount = users.filter((u) => u.status === "Pending").length;

  // Sorting handler
  const handleSort = (col: keyof UserRecord) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  // Filtered & Sorted Users dataset
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        // Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const match =
            u.empId.toLowerCase().includes(q) ||
            u.fullName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q) ||
            u.department.toLowerCase().includes(q);
          if (!match) return false;
        }
        // Filters
        if (roleFilter !== "All" && u.role !== roleFilter) return false;
        if (statusFilter !== "All" && u.status !== statusFilter) return false;
        if (deptFilter !== "All" && u.department !== deptFilter) return false;
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortColumn] ?? "";
        let valB = b[sortColumn] ?? "";
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    users,
    searchQuery,
    roleFilter,
    statusFilter,
    deptFilter,
    sortColumn,
    sortDirection,
  ]);

  // Role badge styles
  const getRoleBadgeStyle = (role: SystemRole) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Hospital Admin":
        return "bg-blue-50 text-[#0D47A1] border-blue-200";
      case "Doctor":
        return "bg-teal-50 text-[#009688] border-teal-200";
      case "Nurse":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Receptionist":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Accountant":
        return "bg-amber-50 text-[#F59E0B] border-amber-200";
      case "Patient":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (isCreatingStaff) {
    return (
      <CreateStaffPage
        onBack={() => setIsCreatingStaff(false)}
        onSuccess={() => {
          setIsCreatingStaff(false);
          fetchUsers();
        }}
      />
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto space-y-6"
      style={{ fontFamily: RB }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. PAGE HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeader
          title="User & Role Management"
          description="Manage active clinical staff accounts, register system users, and audit roles status."
        />

        <button
          onClick={() => {
            setIsCreatingStaff(true);
            if (navigate) {
              try {
                navigate("/dashboard/admin/users/create");
              } catch (e) {
                console.log(e);
              }
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
          style={{ fontFamily: PP }}
        >
          <UserPlus size={15} /> Add User
        </button>
      </div>

      <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-200 min-h-[700px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200 w-full space-y-6 relative p-6">
        {/* ── 2. SUMMARY KPI CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-[#64748B] font-medium">
                Total Users
              </div>
              <div
                className="text-2xl font-bold text-[#111827] mt-0.5"
                style={{ fontFamily: PP }}
              >
                {totalUsersCount}
              </div>
              <div className="text-[11px] text-[#0D47A1] font-medium mt-1">
                Across all departments
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
              <Users size={20} />
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-[#64748B] font-medium">
                Active Users
              </div>
              <div
                className="text-2xl font-bold text-[#111827] mt-0.5"
                style={{ fontFamily: PP }}
              >
                {activeUsersCount}
              </div>
              <div className="text-[11px] text-[#66BB6A] font-medium mt-1">
                {totalUsersCount > 0
                  ? Math.round((activeUsersCount / totalUsersCount) * 100)
                  : 0}
                % of total system users
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#66BB6A]">
              <UserCheck size={20} />
            </div>
          </div>

          {/* Inactive Users */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-[#64748B] font-medium">
                Inactive / Suspended
              </div>
              <div
                className="text-2xl font-bold text-[#111827] mt-0.5"
                style={{ fontFamily: PP }}
              >
                {inactiveUsersCount}
              </div>
              <div className="text-[11px] text-[#EF4444] font-medium mt-1">
                Access revoked or offboarded
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#EF4444]">
              <UserX size={20} />
            </div>
          </div>

          {/* Pending Activation */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-[#64748B] font-medium">
                Pending Activation
              </div>
              <div
                className="text-2xl font-bold text-[#111827] mt-0.5"
                style={{ fontFamily: PP }}
              >
                {pendingUsersCount}
              </div>
              <div className="text-[11px] text-[#F59E0B] font-medium mt-1">
                Awaiting initial password setup
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* ── 3. SEARCH & FILTERS TOOLBAR ── */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by User Name, Employee ID, Email, Username..."
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Role Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                <Shield size={13} className="text-slate-400" />
                <span className="text-slate-500 font-medium">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Hospital Admin">Hospital Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Patient">Patient</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                <Filter size={13} className="text-slate-400" />
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                <Building2 size={13} className="text-slate-400" />
                <span className="text-slate-500 font-medium">Dept:</span>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Administration">Administration</option>
                  <option value="OPD Reception">OPD Reception</option>
                  <option value="Accounts & Billing">Accounts & Billing</option>
                  <option value="Nursing & Patient Care">
                    Nursing & Patient Care
                  </option>
                  <option value="IT & Systems">IT & Systems</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                  setDeptFilter("All");
                  triggerToast("Filters reset.");
                }}
                className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-500 hover:text-[#0D47A1] hover:bg-slate-50 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── 4. MAIN USER MANAGEMENT HMS TABLE ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-xs text-text-muted">
                Fetching staff data from API database...
              </p>
            </div>
          ) : errorMsg ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center px-4">
              <AlertTriangle className="text-red-500" size={32} />
              <h3
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Failed to Load Data
              </h3>
              <p className="text-xs text-red-650 max-w-sm">{errorMsg}</p>
              <button
                onClick={fetchUsers}
                className="mt-2 btn btn-outline-primary inline-flex items-center gap-2 text-xs py-2 px-4 border rounded-xl"
              >
                <RotateCcw size={12} />
                Retry Fetch
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
                  <tr
                    className="text-[#64748B] font-bold"
                    style={{ fontFamily: PP }}
                  >
                    <th
                      onClick={() => handleSort("empId")}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Employee ID</span>
                        <ArrowUpDown size={12} className="text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("fullName")}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Full Name</span>
                        <ArrowUpDown size={12} className="text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("role")}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Role</span>
                        <ArrowUpDown size={12} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Phone</th>
                    <th
                      onClick={() => handleSort("status")}
                      className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <ArrowUpDown size={12} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4 py-3.5">Last Login</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const initials = user.fullName
                        .split(" ")
                        .filter((n) => n.length > 0)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                            {user.empId}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-xl bg-blue-100 text-[#0D47A1] font-bold text-xs flex items-center justify-center shrink-0"
                                style={{ fontFamily: PP }}
                              >
                                {initials}
                              </div>
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
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getRoleBadgeStyle(user.role)}`}
                            >
                              <Shield size={11} /> {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700">
                            {user.department}
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            <a
                              href={`mailto:${user.email}`}
                              className="hover:text-[#0D47A1] hover:underline flex items-center gap-1"
                            >
                              <Mail
                                size={12}
                                className="text-slate-400 shrink-0"
                              />
                              <span className="truncate max-w-[160px]">
                                {user.email}
                              </span>
                            </a>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600 font-mono">
                            {user.phone}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === "Active"
                                ? "bg-green-50 text-[#66BB6A]"
                                : user.status === "Pending"
                                  ? "bg-amber-50 text-[#F59E0B]"
                                  : user.status === "Suspended"
                                    ? "bg-orange-50 text-orange-600"
                                    : "bg-red-50 text-[#EF4444]"
                                }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${user.status === "Active"
                                  ? "bg-[#66BB6A]"
                                  : user.status === "Pending"
                                    ? "bg-[#F59E0B]"
                                    : user.status === "Suspended"
                                      ? "bg-orange-500"
                                      : "bg-[#EF4444]"
                                  }`}
                              />
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                            {user.lastLogin}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* View Details */}
                              <button
                                onClick={() => setDetailsUser(user)}
                                className="p-1.5 text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="View User Details"
                              >
                                <Eye size={15} />
                              </button>

                              {/* Edit User */}
                              <button
                                onClick={() => handleOpenEditDrawer(user)}
                                className="p-1.5 text-slate-500 hover:text-[#009688] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit User Information"
                              >
                                <Edit size={15} />
                              </button>

                              {/* Reset Password */}
                              <button
                                onClick={() => {
                                  setResetPassUser(user);
                                }}
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Reset Password"
                              >
                                <Key size={15} />
                              </button>

                              {/* Status Change Toggles */}
                              {user.status === "Active" ? (
                                <button
                                  onClick={() =>
                                    setStatusDialogUser({
                                      user,
                                      action: "Suspend",
                                    })
                                  }
                                  disabled={
                                    actionLoadingId === `suspend-${user.id}`
                                  }
                                  className="p-1.5 text-slate-400 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Suspend Account"
                                >
                                  {actionLoadingId === `suspend-${user.id}` ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin text-red-500"
                                    />
                                  ) : (
                                    <UserX size={15} />
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setStatusDialogUser({
                                      user,
                                      action: "Activate",
                                    })
                                  }
                                  disabled={
                                    actionLoadingId === `activate-${user.id}`
                                  }
                                  className="p-1.5 text-slate-400 hover:text-[#66BB6A] hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                  title="Activate Account"
                                >
                                  {actionLoadingId === `activate-${user.id}` ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin text-green-500"
                                    />
                                  ) : (
                                    <UserCheck size={15} />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <Users size={32} />
                          </div>
                          <div>
                            <h3
                              className="text-sm font-bold text-[#111827]"
                              style={{ fontFamily: PP }}
                            >
                              No users found
                            </h3>
                            <p className="text-xs text-[#64748B]">
                              No user records match your search or filter
                              criteria.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
            <div className="text-xs text-[#64748B]">
              Showing{" "}
              <span className="font-bold text-[#111827]">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#111827]">{users.length}</span>{" "}
              total users
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium"
              >
                Previous
              </button>
              <button className="w-7 h-7 bg-[#0D47A1] text-white rounded-lg text-xs font-bold">
                1
              </button>
              <button
                disabled
                className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. RIGHT DRAWER: EDIT USER ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setEditingUser(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
              <div className="px-6 py-4 bg-[#009688] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2
                    className="text-base font-bold flex items-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Edit size={18} /> Edit User Details
                  </h2>
                  <p className="text-xs text-teal-100 mt-0.5">
                    Modify profile info for {editingUser.empId}
                  </p>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSaveEditUser}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F1F5F9]/50"
                style={{ fontFamily: RB }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1">
                      System Access Role (Locked)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={editingUser.role}
                      className="w-full px-3 py-2.5 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-slate-500 outline-none font-semibold cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">
                      Account Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          status: e.target.value as AccountStatus,
                        })
                      }
                      className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Department
                  </label>
                  <select
                    value={editForm.department}
                    onChange={(e) =>
                      setEditForm({ ...editForm, department: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Administration">Administration</option>
                    <option value="OPD Reception">OPD Reception</option>
                    <option value="Accounts & Billing">
                      Accounts & Billing
                    </option>
                    <option value="Nursing & Patient Care">
                      Nursing & Patient Care
                    </option>
                    <option value="IT & Systems">IT & Systems</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 border border-border text-text-muted hover:bg-slate-50 py-3 rounded-xl font-heading font-semibold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#009688] hover:bg-[#00796B] text-white py-3 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. RIGHT DRAWER: VIEW DETAILS ── */}
      {detailsUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setDetailsUser(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2
                    className="text-base font-bold flex items-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Eye size={18} /> Staff Profile Overview
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Auditing record fields for {detailsUser.empId}
                  </p>
                </div>
                <button
                  onClick={() => setDetailsUser(null)}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50"
                style={{ fontFamily: RB }}
              >
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 text-center flex flex-col items-center shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0D47A1] font-bold text-lg flex items-center justify-center mb-3">
                    {detailsUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <h3
                    className="font-bold text-base text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {detailsUser.fullName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    @{detailsUser.username}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleBadgeStyle(detailsUser.role)}`}
                    >
                      {detailsUser.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${detailsUser.status === "Active"
                        ? "bg-green-50 text-[#66BB6A]"
                        : "bg-red-50 text-red-500"
                        }`}
                    >
                      {detailsUser.status}
                    </span>
                  </div>
                </div>

                {/* Database Fields */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-4">
                  <h4 className="font-heading text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Account Registry Metadata
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">
                        Employee Reference ID
                      </span>
                      <span className="font-bold text-slate-900 mt-1 block font-mono">
                        {detailsUser.empId}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        Department Unit
                      </span>
                      <span className="font-bold text-slate-900 mt-1 block">
                        {detailsUser.department}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        System UUID
                      </span>
                      <span className="font-semibold text-slate-700 mt-1 block font-mono">
                        {detailsUser.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        Database Created At
                      </span>
                      <span className="font-bold text-slate-900 mt-1 block">
                        {detailsUser.joinedDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        Email Address
                      </span>
                      <span className="font-bold text-slate-900 mt-1 block">
                        {detailsUser.email}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        Mobile Contact
                      </span>
                      <span className="font-bold text-slate-900 mt-1 block font-mono">
                        {detailsUser.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Metrics */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-4">
                  <h4 className="font-heading text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Access & Security Settings
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">
                        Last Login Timestamp
                      </span>
                      <span className="font-bold text-slate-900 mt-1 block">
                        {detailsUser.lastLogin}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        2FA Multi-Factor Auth
                      </span>
                      <span
                        className={`font-bold mt-1 block ${detailsUser.twoFactor ? "text-green-500" : "text-slate-400"}`}
                      >
                        {detailsUser.twoFactor
                          ? "Active (MFA Enforced)"
                          : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDetailsUser(null);
                      handleOpenEditDrawer(detailsUser);
                    }}
                    className="flex-1 bg-[#0D47A1] hover:bg-[#0c3d8a] text-white py-3 rounded-xl font-heading font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setDetailsUser(null)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-heading font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Close Panel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. CONFIRM PASSWORD RESET DIALOG ── */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5E7EB] animate-scale-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm flex items-center gap-2">
                <Key size={16} className="text-amber-500" /> Administrative
                Password Reset
              </h3>
              <button
                onClick={() => setResetPassUser(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleConfirmResetPassword}
              className="p-6 space-y-4 text-xs font-body"
            >
              <p className="text-slate-500 leading-relaxed">
                You are about to trigger a password reset for{" "}
                <strong className="text-slate-900">
                  {resetPassUser.fullName} ({resetPassUser.empId})
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
                  the email: <strong>{resetPassUser.email}</strong>.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setResetPassUser(null)}
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
      )}

      {/* ── 9. CONFIRM STATUS CHANGE DIALOG ── */}
      {statusDialogUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5E7EB] animate-scale-in">
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm flex items-center gap-2">
                <Shield size={16} className="text-[#0D47A1]" /> Administrative
                Account Control
              </h3>
              <button
                onClick={() => setStatusDialogUser(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-body">
              <p className="text-slate-500 leading-relaxed">
                Are you sure you want to perform the action{" "}
                <strong>{statusDialogUser.action}</strong> on the account
                belonging to{" "}
                <strong className="text-slate-900">
                  {statusDialogUser.user.fullName} (
                  {statusDialogUser.user.empId})
                </strong>
                ?
              </p>

              {statusDialogUser.action === "Suspend" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2.5 text-red-800">
                  <AlertTriangle
                    size={18}
                    className="shrink-0 text-red-600 mt-0.5"
                  />
                  <p className="leading-relaxed">
                    This action will immediately suspend the user's active
                    session. They will be logged out and unable to log back in
                    until manually activated again.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-border mt-4">
                <button
                  onClick={() => setStatusDialogUser(null)}
                  className="px-4 py-2 border rounded-xl font-semibold hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStatusChange}
                  className={`px-4 py-2 text-white rounded-xl font-bold transition-colors cursor-pointer ${statusDialogUser.action === "Suspend"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  Confirm {statusDialogUser.action}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
