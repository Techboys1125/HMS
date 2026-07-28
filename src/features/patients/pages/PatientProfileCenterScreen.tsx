import { useState } from "react";
import {
  ChevronRight,
  Edit,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  Key,
  ShieldCheck,
  Save,
} from "lucide-react";
import { PP, RB } from "../constants/patient.mock";


export function PatientProfileCenterScreen() {
  const [activeTab, setActiveTab] = useState<"info" | "edit" | "password">(
    "info",
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    name: "Sarah Mitchell",
    patientId: "P-9821",
    email: "sarah.mitchell@example.com",
    phone: "+1 (555) 234-5678",
    dob: "1990-06-14",
    gender: "Female",
    bloodGroup: "O Rh Positive (O+)",
    address: "742 Evergreen Terrace, Apt 4B, Springfield, IL 62704",
    emergencyName: "Robert Mitchell",
    emergencyRelation: "Spouse",
    emergencyPhone: "+1 (555) 876-5432",
  });

  // Edit Form Draft State
  const [editForm, setEditForm] = useState({ ...profileData });

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    triggerToast("Profile information updated successfully!");
    setActiveTab("info");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
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
    triggerToast("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setActiveTab("info");
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
            <span>Patient Portal</span>
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
              SM
            </div>
            <button
              onClick={() => triggerToast("Upload avatar picture...")}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#E5E7EB] text-[#0D47A1] flex items-center justify-center shadow-sm hover:bg-blue-50 transition-colors"
              title="Change Profile Picture"
            >
              <Edit size={12} />
            </button>
          </div>

          {/* Profile Basic Info */}
          <div>
            <div className="flex items-center gap-2.5">
              <h2
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {profileData.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#66BB6A] border border-green-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />{" "}
                Active Patient
              </span>
            </div>
            <div className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                Patient ID:{" "}
                <strong className="text-[#111827]">
                  {profileData.patientId}
                </strong>
              </span>
              <span>
                Email:{" "}
                <strong className="text-[#111827]">{profileData.email}</strong>
              </span>
              <span>
                Phone:{" "}
                <strong className="text-[#111827]">{profileData.phone}</strong>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditForm({ ...profileData });
            setActiveTab("edit");
          }}
          className="px-4 py-2 rounded-xl bg-blue-50 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          style={{ fontFamily: PP }}
        >
          <Edit size={14} /> Edit Profile
        </button>
      </div>

      {/* ── 3. MAIN WORKSPACE WITH RIGHT PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Center Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
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
                  onClick={() => setActiveTab(tab.id as "info" | "edit" | "password")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-0.5 ${isActive
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
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Date of Birth
                    </span>
                    <span className="font-semibold text-[#111827]">
                      {profileData.dob} (34 Yrs)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Gender
                    </span>
                    <span className="font-semibold text-[#111827]">
                      {profileData.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Blood Group
                    </span>
                    <span className="font-bold text-[#0D47A1]">
                      {profileData.bloodGroup}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Primary Language
                    </span>
                    <span className="font-semibold text-[#111827]">
                      English
                    </span>
                  </div>
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
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Phone Number
                    </span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                      <Phone size={13} className="text-[#0D47A1]" />{" "}
                      {profileData.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Email Address
                    </span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                      <Mail size={13} className="text-[#0D47A1]" />{" "}
                      {profileData.email}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#64748B] text-[11px] block">
                      Residential Address
                    </span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                      <MapPin size={13} className="text-[#0D47A1] shrink-0" />{" "}
                      {profileData.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <div
                  className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100"
                  style={{ fontFamily: PP }}
                >
                  Emergency Contact
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Contact Name
                    </span>
                    <span className="font-semibold text-[#111827]">
                      {profileData.emergencyName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Relationship
                    </span>
                    <span className="font-semibold text-[#111827]">
                      {profileData.emergencyRelation}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">
                      Emergency Phone
                    </span>
                    <span className="font-semibold text-red-600">
                      {profileData.emergencyPhone}
                    </span>
                  </div>
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
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={editForm.emergencyName}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        emergencyName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.emergencyPhone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        emergencyPhone: e.target.value,
                      })
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
                <Key size={16} className="text-[#0D47A1]" /> Change Portal
                Password
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

        {/* Right Panel: Quick Account Information */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h2
              className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100"
              style={{ fontFamily: PP }}
            >
              Quick Account Information
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-[#64748B] text-[11px] block">
                  Last Portal Login
                </span>
                <span className="font-semibold text-[#111827]">
                  Today at 10:42 AM
                </span>
                <span className="text-[10px] text-slate-500 block">
                  IP: 192.168.1.45 (Springfield, IL)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-[#64748B] text-[11px] block">
                  Account Status
                </span>
                <span className="font-bold text-[#66BB6A] flex items-center gap-1">
                  <ShieldCheck size={14} /> Verified & Active
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-[#64748B] text-[11px] block">
                  Portal Created Date
                </span>
                <span className="font-semibold text-[#111827]">
                  January 15, 2023
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-[#64748B] text-[11px] block">
                  Two-Factor Authentication
                </span>
                <span className="font-semibold text-[#0D47A1]">
                  Enabled (SMS Verification)
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() =>
                  triggerToast("Downloading encrypted account data archive...")
                }
                className="w-full py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Download Profile Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}