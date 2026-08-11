import { useState, useEffect, useMemo } from "react";
import { Edit, X, Check, Loader2, AlertTriangle } from "lucide-react";
import { usersApi } from "../api/users.api";
import { departmentsApi } from "../api/departments.api";
import type {
  BackendAvailabilityItem,
  UserDetailData,
  AdminUpdateStaffData,
  ScheduleException,
} from "../types/users.types";

const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

export interface EditableStaffUser {
  id: string;
  empId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
}

export interface EditStaffUserDrawerProps {
  user: EditableStaffUser | null;
  onClose: () => void;
  onSaved: () => void;
}

const DEFAULT_DEPARTMENTS = [
  "Cardiology",
  "General Medicine",
  "Neurology",
  "Administration",
  "OPD Reception",
  "Accounts & Billing",
  "Nursing & Patient Care",
  "IT & Systems",
];

const DEFAULT_AVAILABILITY: BackendAvailabilityItem[] = [
  { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: "TUESDAY", startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: "WEDNESDAY", startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: "THURSDAY", startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: "FRIDAY", startTime: "09:00", endTime: "17:00" },
];

const createInitialForm = (
  user: EditableStaffUser | null,
  departments: { id: number | string; name: string }[],
  deptNameToId: Record<string, number>,
) => {
  if (!user) {
    return {
      fullName: "",
      email: "",
      phone: "",
      gender: "MALE",
      dateOfBirth: "",
      residentialAddress: "",
      professionalBio: "",
      medicalRegistrationNumber: "",
      qualification: "",
      yearsOfExperience: 0,
      primaryDepartmentId: 2,
      primarySpecialtyId: 1,
      consultationFee: 500,
      followUpFee: 300,
      slotDurationMinutes: 15,
      availability: DEFAULT_AVAILABILITY,
      scheduleExceptions: [] as ScheduleException[],
      department: "General Medicine",
      status: "Active",
    };
  }
  return {
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: "MALE",
    dateOfBirth: "",
    residentialAddress: "",
    professionalBio: "",
    medicalRegistrationNumber: "",
    qualification: "",
    yearsOfExperience: 0,
    primaryDepartmentId:
      deptNameToId[user.department] ??
      (departments.length ? Number(departments[0].id) : 2),
    primarySpecialtyId: 1,
    consultationFee: 500,
    followUpFee: 300,
    slotDurationMinutes: 15,
    availability: DEFAULT_AVAILABILITY,
    scheduleExceptions: [] as ScheduleException[],
    department: user.department || "General Medicine",
    status: user.status || "Active",
  };
};

export function EditStaffUserDrawer({
  user,
  onClose,
  onSaved,
}: EditStaffUserDrawerProps) {
  const [departments, setDepartments] = useState<
    { id: number | string; name: string }[]
  >([]);

  const deptNameToId = useMemo(() => {
    const map: Record<string, number> = {};
    departments.forEach((d) => {
      map[d.name] = Number(d.id);
    });
    return map;
  }, [departments]);

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [form, setForm] = useState(() =>
    createInitialForm(user, departments, deptNameToId),
  );

  const [prevUserId, setPrevUserId] = useState<string | null>(null);

  if (user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    setSaveError(null);
    setIsLoadingDetail(true);
    setForm(createInitialForm(user, departments, deptNameToId));
  }

  // Fetch departments (mirrors UserManagement approach)
  useEffect(() => {
    departmentsApi
      .getDepartmentLookup(true)
      .then((lookupList) => {
        if (lookupList && lookupList.length > 0) {
          const mapped = lookupList.map((d) => ({
            id: d.departmentId,
            name: d.departmentName,
          }));
          if (mapped.length > 0) setDepartments(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Reset + prefill whenever a new user opens the drawer
  useEffect(() => {
    if (!user) return;

    usersApi
      .adminGetUserById(user.id)
      .then((response) => {
        if (!response.success || !response.data) return;
        const detail: UserDetailData = response.data;
        const profile = detail.doctorProfile;
        setForm((prev) => ({
          ...prev,
          gender: detail.gender || "MALE",
          dateOfBirth: detail.dateOfBirth || "",
          residentialAddress: detail.residentialAddress || "",
          professionalBio: detail.professionalBio || "",
          medicalRegistrationNumber: profile?.medicalRegistrationNumber || "",
          qualification: profile?.qualification || "",
          yearsOfExperience: profile?.yearsOfExperience || 0,
          primaryDepartmentId:
            profile?.primaryDepartment?.departmentId ||
            deptNameToId[user.department] ||
            (departments.length > 0 ? Number(departments[0].id) : 2),
          primarySpecialtyId: profile?.primarySpecialty?.specialtyId || 1,
          consultationFee: profile?.consultationFee ?? 500,
          followUpFee: profile?.followUpFee ?? 300,
          slotDurationMinutes: profile?.slotDurationMinutes || 15,
          availability:
            profile?.availability && profile.availability.length > 0
              ? profile.availability
              : DEFAULT_AVAILABILITY,
          scheduleExceptions: profile?.scheduleExceptions || [],
        }));
      })
      .catch(() => {})
      .finally(() => setIsLoadingDetail(false));
  }, [departments, deptNameToId, user, user?.id]);

  if (!user) return null;

  const isDoctor = user.role === "Doctor";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setSaveError(null);
    try {
      const deptId =
        form.primaryDepartmentId ||
        deptNameToId[form.department] ||
        (departments.length > 0 ? Number(departments[0].id) : 2);
      const apiStatus =
        form.status.toUpperCase() === "ACTIVE"
          ? "ACTIVE"
          : form.status.toUpperCase() === "SUSPENDED"
            ? "SUSPENDED"
            : form.status.toUpperCase() === "PENDING"
              ? "PENDING"
              : "INACTIVE";
      const changeReason = `Updated staff details via ${
        isDoctor ? "Doctor" : "User"
      } Management`;

      const payload: AdminUpdateStaffData = {
        fullName: form.fullName,
        email: form.email,
        mobile: form.phone,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        residentialAddress: form.residentialAddress,
        professionalBio: form.professionalBio,
        medicalRegistrationNumber: form.medicalRegistrationNumber,
        qualification: form.qualification,
        yearsOfExperience: Number(form.yearsOfExperience),
        primaryDepartmentId: deptId,
        secondaryDepartmentIds: [],
        primarySpecialtyId: form.primarySpecialtyId || 1,
        secondarySpecialtyIds: [],
        consultationFee: Number(form.consultationFee),
        followUpFee: Number(form.followUpFee),
        slotDurationMinutes: Number(form.slotDurationMinutes),
        availability: form.availability,
        scheduleExceptions: form.scheduleExceptions,
        departmentId: deptId,
        status: apiStatus,
        changeReason: changeReason,
      };

      const response = await usersApi.adminUpdateStaff(user.id, payload);
      if (response.success) {
        onSaved();
      } else {
        setSaveError(response.message || "Failed to update staff profile.");
      }
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Error updating staff profile.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAvailability = (
    index: number,
    key: "startTime" | "endTime",
    value: string,
  ) => {
    setForm((prev) => {
      const next = [...prev.availability];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, availability: next };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#009688] text-white flex items-center justify-between shadow-sm">
            <div>
              <h2
                className="text-base font-bold flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Edit size={18} /> Edit {isDoctor ? "Doctor" : "User"} Details
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                Modify profile info for {user.empId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F1F5F9]/50"
            style={{ fontFamily: RB }}
          >
            {saveError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#EF4444] font-semibold flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {isLoadingDetail && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <Loader2 size={14} className="animate-spin" /> Fetching current
                profile data...
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1">
                  System Access Role (Locked)
                </label>
                <input
                  type="text"
                  readOnly
                  value={user.role}
                  className="w-full px-3 py-2.5 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-slate-500 outline-none font-semibold cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Account Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
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
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Department
              </label>
              <select
                value={form.department}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department: e.target.value,
                    primaryDepartmentId:
                      deptNameToId[e.target.value] ||
                      (departments.length > 0 ? Number(departments[0].id) : 2),
                  })
                }
                className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688]"
              >
                {(departments.length > 0
                  ? departments.map((d) => d.name)
                  : DEFAULT_DEPARTMENTS
                ).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Doctor Clinical Profile Inputs if Doctor */}
            {isDoctor && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-[#009688] uppercase tracking-wider">
                  Doctor Clinical Profile & Fees
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">
                      Reg Number
                    </label>
                    <input
                      type="text"
                      value={form.medicalRegistrationNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          medicalRegistrationNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#009688]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={form.qualification}
                      onChange={(e) =>
                        setForm({ ...form, qualification: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#009688]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">
                      Experience (Yrs)
                    </label>
                    <input
                      type="number"
                      value={form.yearsOfExperience}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          yearsOfExperience: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#009688]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">
                      Consult Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={form.consultationFee}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          consultationFee: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#009688]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">
                      Followup Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={form.followUpFee}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          followUpFee: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#009688]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Slot Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={form.slotDurationMinutes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        slotDurationMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#009688]"
                  />
                </div>

                {/* Pre-populated Schedule & Availability Editor */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#111827]">
                      Doctor Weekly Availability Schedule
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      HH:mm Format
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {form.availability.map((item, index) => (
                      <div
                        key={item?.id || item?._id || item?.key || item?.value || item?.code || item?.name || item?.title || item?.label || (typeof item === 'object' ? JSON.stringify(item) : String(item))}
                        className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <span className="w-20 font-bold text-slate-700">
                          {item.dayOfWeek}
                        </span>
                        <input
                          type="text"
                          value={item.startTime}
                          placeholder="09:00"
                          onChange={(e) =>
                            updateAvailability(
                              index,
                              "startTime",
                              e.target.value,
                            )
                          }
                          className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-center"
                        />
                        <span className="text-slate-400 font-bold">-</span>
                        <input
                          type="text"
                          value={item.endTime}
                          placeholder="17:00"
                          onChange={(e) =>
                            updateAvailability(index, "endTime", e.target.value)
                          }
                          className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-border text-text-muted hover:bg-slate-50 py-3 rounded-xl font-heading font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoadingDetail}
                className="flex-1 bg-[#009688] hover:bg-[#00796B] text-white py-3 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
