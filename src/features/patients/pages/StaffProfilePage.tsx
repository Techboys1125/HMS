import { useState, useEffect } from "react";
import {
  ChevronRight,
  Edit,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  Key,
  Save,
  Briefcase,
  BadgeCheck,
} from "lucide-react";
import { PP, RB } from "../constants/patient.fonts";
import { useAuthStore } from "../../auth";
import { usersApi } from "../../users/api/users.api";
import { authService } from "../../auth/services/auth.service";
import type { UserDetailData } from "../../users/types/users.types";
import type { Role } from "../utils/patientPermissions";

const ROLE_DISPLAY: Record<string, string> = {
  NURSE: "Nurse",
  RECEPTIONIST: "Receptionist",
  ACCOUNTANT: "Accountant",
};

const ROLE_PORTAL_LABEL: Record<string, string> = {
  NURSE: "Staff Portal",
  RECEPTIONIST: "Staff Portal",
  ACCOUNTANT: "Finance Portal",
};

interface StaffProfileData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  employeeId: string;
  role: string;
  status: string;
  userId: number | string;
}

function mapUserDetailToProfile(
  detail: UserDetailData,
  fallbackRole: string,
): StaffProfileData {
  return {
    name: detail.fullName || "Staff Member",
    email: detail.email || "",
    phone: detail.mobile || "",
    gender: detail.gender || "",
    dob: detail.dateOfBirth || "",
    address: detail.residentialAddress || "",
    employeeId: detail.employeeId || "",
    role: detail.role || fallbackRole,
    status: detail.status || "ACTIVE",
    userId: detail.userId,
  };
}

export function StaffProfilePage({ currentRole }: { currentRole: Role }) {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  const roleUpper = String(currentRole).toUpperCase();

  const [profileData, setProfileData] = useState<StaffProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"info" | "edit" | "password">(
    "info",
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
  });

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch profile data
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User ID not found");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    usersApi
      .adminGetUserById(userId)
      .then((response) => {
        if (cancelled) return;
        const data = response.data;
        if (data) {
          const mapped = mapUserDetailToProfile(data, roleUpper);
          setProfileData(mapped);
          setEditForm({
            name: mapped.name,
            email: mapped.email,
            phone: mapped.phone,
            gender: mapped.gender,
            dob: mapped.dob,
            address: mapped.address,
          });
        } else {
          // Fallback to auth user data
          setProfileData({
            name: user?.fullName || user?.name || "Staff Member",
            email: user?.email || "",
            phone: user?.mobile || user?.phone || "",
            gender: "",
            dob: "",
            address: "",
            employeeId: user?.employeeId || "",
            role: roleUpper,
            status: String(user?.status || "ACTIVE"),
            userId: userId,
          });
          setEditForm({
            name: user?.fullName || user?.name || "",
            email: user?.email || "",
            phone: user?.mobile || user?.phone || "",
            gender: "",
            dob: "",
            address: "",
          });
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("Failed to load staff profile:", err);
        // Fallback to auth user data
        setProfileData({
          name: user?.fullName || user?.name || "Staff Member",
          email: user?.email || "",
          phone: user?.mobile || user?.phone || "",
          gender: "",
          dob: "",
          address: "",
          employeeId: user?.employeeId || "",
          role: roleUpper,
          status: String(user?.status || "ACTIVE"),
          userId: userId,
        });
        setEditForm({
          name: user?.fullName || user?.name || "",
          email: user?.email || "",
          phone: user?.mobile || user?.phone || "",
          gender: "",
          dob: "",
          address: "",
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, roleUpper]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "S";
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await usersApi.adminUpdateStaff(userId, {
        fullName: editForm.name,
        email: editForm.email,
        mobile: editForm.phone,
        gender: editForm.gender || undefined,
        dateOfBirth: editForm.dob || undefined,
        residentialAddress: editForm.address || undefined,
      });

      // Refresh profile
      const response = await usersApi.adminGetUserById(userId);
      if (response.data) {
        const mapped = mapUserDetailToProfile(response.data, roleUpper);
        setProfileData(mapped);
      } else {
        setProfileData((prev) =>
          prev
            ? {
                ...prev,
                name: editForm.name,
                email: editForm.email,
                phone: editForm.phone,
                gender: editForm.gender,
                dob: editForm.dob,
                address: editForm.address,
              }
            : prev,
        );
      }

      triggerToast("Profile information updated successfully!");
      setActiveTab("info");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile";
      triggerToast(msg);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      triggerToast("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      triggerToast("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast("New password and confirmation do not match.");
      return;
    }

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      triggerToast("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("info");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to change password";
      triggerToast(msg);
    }
  };

  // Password Strength Score
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 8) score += 33;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[0-9]/.test(pass))
      score += 33;
    if (/[^A-Za-z0-9]/.test(pass)) score += 34;
    if (score <= 33) return { score: 33, label: "Weak", color: "bg-[#EF4444]" };
    if (score <= 66)
      return { score: 66, label: "Medium", color: "bg-[#F59E0B]" };
    return { score: 100, label: "Strong", color: "bg-[#66BB6A]" };
  };

  const passStrength = getPasswordStrength(newPassword);

  if (loading) {
    return (
      <div
        className="flex-1 flex items-center justify-center p-12 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#0D47A1] border-t-transparent rounded-full animate-spin mx-auto" />
          <p
            className="text-xs font-semibold text-[#64748B]"
            style={{ fontFamily: PP }}
          >
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div
        className="flex-1 flex items-center justify-center p-12 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm space-y-5 text-center">
          <h2
            className="text-lg font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Profile Not Found
          </h2>
          <p className="text-xs text-[#64748B]">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  const displayRole = ROLE_DISPLAY[roleUpper] || roleUpper;
  const portalLabel = ROLE_PORTAL_LABEL[roleUpper] || "Staff Portal";

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            My Profile
          </h1>
          <div
            className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1"
            style={{ fontFamily: RB }}
          >
            <span>{portalLabel}</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">My Profile</span>
          </div>
        </div>
      </div>

      {/* ── 2. PROFILE HEADER BANNER ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-[#0D47A1] text-white font-bold text-xl flex items-center justify-center shadow-md"
              style={{ fontFamily: PP }}
            >
              {getInitials(profileData.name)}
            </div>
          </div>

          {/* Profile Details */}
          <div>
            <h2
              className="text-lg font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {profileData.name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#0D47A1] rounded-full text-[10px] font-bold">
                <BadgeCheck size={11} />
                {displayRole}
              </span>
              {profileData.employeeId && (
                <>
                  <span>•</span>
                  <span>
                    ID:{" "}
                    <strong className="text-[#111827]">
                      {profileData.employeeId}
                    </strong>
                  </span>
                </>
              )}
              <span>•</span>
              <span>{profileData.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setEditForm({
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                gender: profileData.gender,
                dob: profileData.dob,
                address: profileData.address,
              });
              setActiveTab("edit");
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Edit size={14} /> Edit Profile
          </button>
        </div>
      </div>

      {/* ── 3. MAIN WORKSPACE ── */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-0.5">
          {[
            { id: "info", label: "Personal Information" },
            { id: "edit", label: "Edit Profile" },
            { id: "password", label: "Change Password" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "info" | "edit" | "password")
                }
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-0.5 ${
                  isActive
                    ? "border-[#0D47A1] text-[#0D47A1]"
                    : "border-transparent text-[#64748B] hover:text-[#111827]"
                }`}
                style={{ fontFamily: PP }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PERSONAL INFORMATION (Read-only cards) */}
        {activeTab === "info" && (
          <div className="space-y-4">
            {/* Basic Details */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
              <div
                className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Basic Personal Details
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#64748B] text-[11px] block">
                    Full Name
                  </span>
                  <span className="font-semibold text-[#111827]">
                    {profileData.name}
                  </span>
                </div>
                {profileData.dob && (
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Date of Birth
                    </span>
                    <span className="font-semibold text-[#111827]">
                      {profileData.dob}
                    </span>
                  </div>
                )}
                {profileData.gender && (
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Gender
                    </span>
                    <span className="font-semibold text-[#111827]">
                      {profileData.gender}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[#64748B] text-[11px] block">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#16A34A]">
                    <CheckCircle2 size={12} />
                    {profileData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
              <div
                className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Employment Details
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#64748B] text-[11px] block">Role</span>
                  <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                    <Briefcase size={13} className="text-[#0D47A1]" />{" "}
                    {displayRole}
                  </span>
                </div>
                {profileData.employeeId && (
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Employee ID
                    </span>
                    <span className="font-bold text-[#0D47A1]">
                      {profileData.employeeId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
              <div
                className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100"
                style={{ fontFamily: PP }}
              >
                Contact Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {profileData.phone && (
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Phone Number
                    </span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                      <Phone size={13} className="text-[#0D47A1]" />{" "}
                      {profileData.phone}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[#64748B] text-[11px] block">
                    Email Address
                  </span>
                  <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                    <Mail size={13} className="text-[#0D47A1]" />{" "}
                    {profileData.email}
                  </span>
                </div>
                {profileData.address && (
                  <div className="sm:col-span-2">
                    <span className="text-[#64748B] text-[11px] block">
                      Residential Address
                    </span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                      <MapPin
                        size={13}
                        className="text-[#0D47A1] shrink-0"
                      />{" "}
                      {profileData.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDIT PROFILE FORM */}
        {activeTab === "edit" && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-5"
          >
            <h2
              className="text-sm font-bold text-[#111827] pb-3 border-b border-gray-100"
              style={{ fontFamily: PP }}
            >
              Edit Personal & Contact Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>

              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>

              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>

              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Gender
                </label>
                <select
                  value={editForm.gender}
                  onChange={(e) =>
                    setEditForm({ ...editForm, gender: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editForm.dob}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dob: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#111827] font-semibold mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Save size={14} /> Save Changes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CHANGE PASSWORD */}
        {activeTab === "password" && (
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-5"
          >
            <h2
              className="text-sm font-bold text-[#111827] pb-3 border-b border-gray-100 flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <Key size={16} className="text-[#0D47A1]" /> Change Password
            </h2>

            <div className="space-y-4 max-w-md text-xs">
              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>

              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#64748B]">Password Strength</span>
                    <span className="font-bold text-[#111827]">
                      {passStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passStrength.color}`}
                      style={{ width: `${passStrength.score}%` }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Lock size={14} /> Update Password
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default StaffProfilePage;
