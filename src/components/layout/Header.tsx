import { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Users,
  Check,
  Clock,
} from "lucide-react";
import safeHandsLogo from "../../assets/safehandshospital_logo.webp";
import { useAuthStore } from "../../features/auth";
import type { FamilyMember } from "../../features/patients";
import type { NavId, Role } from "../../types/app.types";
import { ROLE_LABEL, PP, RB } from "../../constants/navigation";
import { Avatar } from "../../common/components/Avatar";

export function Header({
  role,
  onLogout,
  onNavigateNav,
  activePatient,
  familyMembers = [],
  onSwitchActivePatient,
}: {
  activeNav?: NavId;
  role: Role;
  onLogout: () => void;
  onNavigateNav: (id: NavId) => void;
  activePatient?: FamilyMember;
  familyMembers?: FamilyMember[];
  onSwitchActivePatient?: (member: FamilyMember) => void;
}) {
  const user = useAuthStore((s) => s.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const currentActive =
    activePatient || (familyMembers.length > 0 ? familyMembers[0] : undefined);
  const displayName =
    role === "patient" && currentActive
      ? currentActive.patientName
      : user?.fullName || "Patient";
  const displayEmail =
    user?.email ||
    (role === "patient"
      ? "patient.portal@safehands.org"
      : "staff@safehands.org");
  const [pendingSwitchMember, setPendingSwitchMember] =
    useState<FamilyMember | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const roleLabel = ROLE_LABEL;

  const confirmSwitch = (member: FamilyMember) => {
    setIsSwitching(true);
    setTimeout(() => {
      onSwitchActivePatient?.(member);
      setIsSwitching(false);
      setPendingSwitchMember(null);
      setShowPatientSelector(false);
      setToastMsg(
        `Active patient changed successfully to ${member.patientName}`,
      );
      setTimeout(() => setToastMsg(null), 3500);
    }, 400);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 gap-5 shrink-0 z-30 relative">
      <button
        onClick={() => onNavigateNav("dashboard")}
        className="flex items-center gap-3 text-left outline-none shrink-0 group focus:outline-none"
      >
        <img
          src={safeHandsLogo}
          alt="Safe Hands Hospital Logo"
          className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
        />
        <div className="flex flex-col">
          <span
            className="text-sm font-bold text-[#111827] leading-tight"
            style={{ fontFamily: PP }}
          >
            Safe Hands
          </span>
          <span
            className="text-[10px] text-[#64748B] hidden sm:inline"
            style={{ fontFamily: RB }}
          >
            Hospital Management
          </span>
        </div>
      </button>

      <div className="flex-1 max-w-96">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search patients, appointments, records…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-gray-100 rounded-lg text-slate-700 placeholder-slate-400 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {role === "patient" && currentActive && familyMembers.length > 0 && (
          <div className="relative">
            <button
              onClick={() => {
                setShowPatientSelector((v) => !v);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 hover:bg-blue-100/60 transition-all outline-none"
            >
              <div className="w-7 h-7 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentActive.patientName[0]}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-bold text-[#111827] leading-tight"
                    style={{ fontFamily: PP }}
                  >
                    {currentActive.patientName}
                  </span>
                  <span className="px-1.5 py-0.2 bg-blue-100 text-[#0D47A1] text-[9px] font-bold rounded-full">
                    {currentActive.relationship}
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] font-mono leading-tight">
                  {currentActive.mrn}
                </div>
              </div>
              <ChevronDown size={14} className="text-[#0D47A1] ml-0.5" />
            </button>

            {showPatientSelector && (
              <div className="absolute left-0 sm:right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="border-b border-[#E5E7EB] pb-2.5 mb-2 px-1">
                  <div
                    className="text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Select Active Patient
                  </div>
                  <div
                    className="text-[11px] text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Choose whose medical records you want to view.
                  </div>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {familyMembers.map((member) => {
                    const isActive = currentActive.id === member.id;
                    const isVerified = member.verificationStatus === "Verified";

                    return (
                      <button
                        key={member.id}
                        disabled={!isVerified}
                        onClick={() => {
                          if (!isVerified) return;
                          if (isActive) {
                            setShowPatientSelector(false);
                            return;
                          }
                          setPendingSwitchMember(member);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isActive
                            ? "bg-blue-50/90 border-[#0D47A1] shadow-sm"
                            : isVerified
                              ? "bg-white border-[#E5E7EB] hover:bg-slate-50"
                              : "bg-slate-50 border-[#E5E7EB] opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isActive ? "bg-[#0D47A1] text-white" : "bg-slate-200 text-slate-700"}`}
                          >
                            {member.patientName[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-xs font-bold text-[#111827] truncate"
                                style={{ fontFamily: PP }}
                              >
                                {member.patientName}
                              </span>
                              <span className="px-1.5 py-0.2 bg-slate-100 text-[#64748B] text-[9px] font-bold rounded-full">
                                {member.relationship}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#64748B] font-mono truncate">
                              {member.mrn}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 ml-2">
                          {isActive ? (
                            <span
                              className="px-2 py-0.5 bg-[#0D47A1] text-white rounded-full text-[9px] font-bold"
                              style={{ fontFamily: PP }}
                            >
                              Currently Active
                            </span>
                          ) : isVerified ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-bold">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px] font-bold">
                              Pending
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <Clock size={12} className="text-slate-400" />
          {today}
        </div>

        <button
          onClick={() => onNavigateNav("notifications")}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
          title="Notification Center"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
        </button>

        <div className="relative pl-3 border-l border-gray-100">
          <button
            onClick={() => {
              setShowProfileMenu((v) => !v);
              setShowPatientSelector(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors outline-none"
          >
            <Avatar name={displayName} size="sm" />
            <div className="hidden xl:block text-left">
              <div
                className="text-xs font-semibold text-[#111827] leading-tight"
                style={{ fontFamily: PP }}
              >
                {displayName}
              </div>
              <div
                className="text-[10px] text-slate-400"
                style={{ fontFamily: RB }}
              >
                {roleLabel[role]}
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden xl:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-xl shadow-slate-200/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                <Avatar name={displayName} size="md" />
                <div className="min-w-0 flex-1">
                  <div
                    className="text-xs font-bold text-[#111827] truncate"
                    style={{ fontFamily: PP }}
                  >
                    {displayName}
                  </div>
                  <div
                    className="text-[11px] text-[#64748B] truncate"
                    style={{ fontFamily: RB }}
                  >
                    {roleLabel[role]}
                  </div>
                  <div className="text-[10px] text-[#0D47A1] font-medium truncate mt-0.5">
                    {displayEmail}
                  </div>
                </div>
              </div>

              <div className="py-1 border-y border-slate-100 my-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateNav("profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <User size={15} className="text-[#0D47A1]" />
                  <span>My Profile & Settings</span>
                </button>
                {role === "patient" &&
                  familyMembers.length > 0 &&
                  onSwitchActivePatient && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowPatientSelector(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    >
                      <Users size={15} className="text-[#0D47A1]" />
                      <span>Switch Patient</span>
                    </button>
                  )}
                {(role === "admin" || role === "super-admin") && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigateNav("settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Settings size={15} className="text-slate-500" />
                    <span>System Settings</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#EF4444] hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={15} className="text-[#EF4444]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {pendingSwitchMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Switch Active Patient
                </h3>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Select active viewing profile context
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {currentActive && (
                <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {currentActive.patientName?.[0] || "P"}
                    </div>
                    <div>
                      <div
                        className="text-[11px] text-[#64748B] font-semibold"
                        style={{ fontFamily: PP }}
                      >
                        Current Profile
                      </div>
                      <div
                        className="text-xs font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {currentActive.patientName}
                      </div>
                      <div className="text-[10px] text-[#64748B] font-mono">
                        {currentActive.mrn} · {currentActive.relationship}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50/80 border border-[#0D47A1]/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {pendingSwitchMember.patientName[0]}
                  </div>
                  <div>
                    <div
                      className="text-[11px] text-[#0D47A1] font-bold"
                      style={{ fontFamily: PP }}
                    >
                      New Active Profile
                    </div>
                    <div
                      className="text-xs font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {pendingSwitchMember.patientName}
                    </div>
                    <div className="text-[10px] text-[#64748B] font-mono">
                      {pendingSwitchMember.mrn} ·{" "}
                      {pendingSwitchMember.relationship}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E5E7EB]">
              <button
                onClick={() => setPendingSwitchMember(null)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmSwitch(pendingSwitchMember)}
                disabled={isSwitching}
                className="px-5 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-all shadow-sm flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                {isSwitching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Switching...</span>
                  </>
                ) : (
                  <span>Switch Patient Profile</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-200">
          <Check className="w-5 h-5 text-[#66BB6A] shrink-0" />
          <span className="text-xs font-semibold" style={{ fontFamily: PP }}>
            {toastMsg}
          </span>
        </div>
      )}
    </header>
  );
}
