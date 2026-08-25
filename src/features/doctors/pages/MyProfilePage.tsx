import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "../../auth/store/auth.store";
import { ROUTES } from "../../../app/routes/routes";
import { doctorProfileService } from "../services/doctorProfile.service";
import { ProfileTab } from "../components/tabs/ProfileTab";
import { AvailabilityScheduleTab } from "../components/tabs/AvailabilityScheduleTab";
import { ScheduleExceptionsTab } from "../components/tabs/ScheduleExceptionsTab";
import { DailyAvailabilityTab } from "../components/tabs/DailyAvailabilityTab";
import { MonthlyCalendarTab } from "../components/tabs/MonthlyCalendarTab";
import { AppointmentsTab } from "../components/tabs/AppointmentsTab";
import { AssignedPatientsTab } from "../components/tabs/AssignedPatientsTab";
import { PP, RB } from "../constants/doctors.constants";
import type { DoctorRecord } from "../types/doctors.types";

type MyProfileTab =
  | "profile"
  | "schedule"
  | "exceptions"
  | "daily"
  | "calendar"
  | "appointments"
  | "patients";

const MY_PROFILE_TABS: Array<{ id: MyProfileTab; label: string }> = [
  { id: "profile", label: "Personal Details" },
  { id: "schedule", label: "Weekly Schedule" },
  { id: "exceptions", label: "Exceptions" },
  { id: "daily", label: "Availability" },
  { id: "calendar", label: "Monthly Calendar" },
  { id: "appointments", label: "Appointments" },
  { id: "patients", label: "Assigned Patients" },
];

export function MyProfilePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorRecord | null>(null);
  const isDoctor = String(user?.role ?? "").toUpperCase() === "DOCTOR";
  const doctorId =
    user?.doctorId ?? user?.doctorProfile?.doctorId ?? user?.id ?? null;

  const [isLoading, setIsLoading] = useState(
    () => isDoctor && doctorId !== null && doctorId !== undefined,
  );
  const [activeTab, setActiveTab] = useState<MyProfileTab>("profile");

  const [prevProfileKey, setPrevProfileKey] = useState<string>("");
  const profileKey = `${isDoctor}_${doctorId}`;
  if (profileKey !== prevProfileKey) {
    setPrevProfileKey(profileKey);
    setIsLoading(isDoctor && doctorId !== null && doctorId !== undefined);
  }

  useEffect(() => {
    let cancelled = false;
    if (!isDoctor || doctorId === null || doctorId === undefined) {
      return;
    }
    doctorProfileService
      .getDoctorProfile(doctorId)
      .then((record) => {
        if (!cancelled) setDoctor(record);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          console.error(
            "Failed to load profile:",
            err instanceof Error ? err.message : err,
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isDoctor, doctorId]);

  const handleSaveProfile = async (updated: DoctorRecord) => {
    try {
      const refreshed = await doctorProfileService.updateDoctor(updated);
      setDoctor(refreshed || updated);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setDoctor(updated);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9] flex items-center justify-center"
        style={{ fontFamily: RB }}
      >
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <span className="w-4 h-4 border-2 border-[#0D47A1] border-t-transparent rounded-full animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!isDoctor) {
    return (
      <div
        className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm space-y-5 text-center">
          <h2
            className="text-lg font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Access Denied
          </h2>
          <p className="text-xs text-[#64748B]">
            This page is only available to doctors.
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div
        className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
        style={{ fontFamily: RB }}
      >
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm space-y-5 text-center">
          <h2
            className="text-lg font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Profile Not Found
          </h2>
          <p className="text-xs text-[#64748B]">
            Unable to load your doctor profile.
          </p>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = true;
  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button
            aria-label="Previous"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-[#64748B]" />
          </button>
          <div className="flex-1">
            <h1
              className="text-lg font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              My Profile
            </h1>
            <p className="text-xs text-[#64748B]">
              {doctor.name} · {doctor.department}
            </p>
          </div>
        </div>

        <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
          {MY_PROFILE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#0D47A1] text-[#0D47A1]"
                  : "border-transparent text-[#64748B] hover:text-[#111827]"
              }`}
              style={{ fontFamily: PP }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4">
          {activeTab === "profile" && (
            <ProfileTab
              doctor={doctor}
              isOwnProfile={isOwnProfile}
              canEdit={true}
              onSave={handleSaveProfile}
            />
          )}
          {activeTab === "schedule" && (
            <AvailabilityScheduleTab doctor={doctor} canEdit={true} />
          )}
          {activeTab === "exceptions" && (
            <ScheduleExceptionsTab doctor={doctor} canEdit={true} />
          )}
          {activeTab === "daily" && (
            <DailyAvailabilityTab doctor={doctor} canEdit={false} />
          )}
          {activeTab === "calendar" && (
            <MonthlyCalendarTab doctor={doctor} canEdit={false} />
          )}
          {activeTab === "appointments" && (
            <AppointmentsTab
              doctor={doctor}
              canEdit={false}
              isOwnProfile={isOwnProfile}
            />
          )}
          {activeTab === "patients" && (
            <AssignedPatientsTab
              doctor={doctor}
              canEdit={false}
              isOwnProfile={isOwnProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
