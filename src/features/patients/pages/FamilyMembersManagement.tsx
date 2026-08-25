import { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Clock,
  Calendar,
  CreditCard,
  Pill,
  ChevronRight,
  Eye,
  UserX,
  AlertCircle,
  X,
  CheckCircle2,
  Stethoscope,
  ExternalLink,
  User,
  Loader2,
} from "lucide-react";
import type { FamilyMember } from "../types/family.types";
import { apiClient } from "../../../lib/axios";
import { ROUTES } from "../../../app/routes/routes";
const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export type { FamilyMember } from "../types/family.types";

export type LinkActivity = {
  id: string;
  date: string;
  time: string;
  activity: string;
  status: "Completed" | "Pending" | "Updated";
};

function calculateAge(dob?: string, ageVal?: number): number {
  if (typeof ageVal === "number" && ageVal > 0) return ageVal;
  if (!dob) return 0;
  try {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return 0;
    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      computedAge--;
    }
    return Math.max(0, computedAge);
  } catch {
    return 0;
  }
}

function normalizeRelationship(rel?: string): FamilyMember["relationship"] {
  if (!rel) return "Other";
  const lower = rel.toLowerCase();
  if (lower === "self") return "Self";
  if (lower === "spouse") return "Spouse";
  if (lower === "mother") return "Mother";
  if (lower === "father") return "Father";
  if (lower === "son") return "Son";
  if (lower === "daughter") return "Daughter";
  if (lower === "brother") return "Brother";
  if (lower === "sister") return "Sister";
  if (lower === "guardian") return "Guardian";
  if (lower === "grandparent") return "Grandparent";
  return "Other";
}

type FilterState = {
  searchTerm: string;
  relFilter: string;
  statusFilter: string;
};

type FilterAction = {
  type: "SET_FIELD";
  field: keyof FilterState;
  value: string;
};
const filterReducer = (
  state: FilterState,
  action: FilterAction,
): FilterState => ({
  ...state,
  [action.field]: action.value,
});

type DrawerState = {
  viewDrawerMember: FamilyMember | null;
  editRelMember: FamilyMember | null;
  editFormRel: FamilyMember["relationship"];
  editDisplayName: string;
  isPrimary: boolean;
  isEmergency: boolean;
  relFormError: string | null;
  toastMessage: string | null;
  removeDialogMember: FamilyMember | null;
  removeFromDrawer: boolean;
};

type DrawerAction =
  | { type: "OPEN_VIEW_DRAWER"; member: FamilyMember }
  | { type: "CLOSE_VIEW_DRAWER" }
  | { type: "OPEN_EDIT_DRAWER"; member: FamilyMember }
  | { type: "CLOSE_EDIT_DRAWER" }
  | {
      type: "SET_EDIT_FIELD";
      field: "editFormRel";
      value: FamilyMember["relationship"];
    }
  | { type: "SET_EDIT_FIELD"; field: "editDisplayName"; value: string }
  | { type: "SET_EDIT_FIELD"; field: "isPrimary"; value: boolean }
  | { type: "SET_EDIT_FIELD"; field: "isEmergency"; value: boolean }
  | { type: "SET_REL_FORM_ERROR"; error: string | null }
  | { type: "OPEN_REMOVE_DIALOG"; member: FamilyMember; fromDrawer: boolean }
  | { type: "CLOSE_REMOVE_DIALOG" }
  | { type: "SHOW_TOAST"; message: string }
  | { type: "CLEAR_TOAST" };

const drawerReducer = (
  state: DrawerState,
  action: DrawerAction,
): DrawerState => {
  switch (action.type) {
    case "OPEN_VIEW_DRAWER":
      return { ...state, viewDrawerMember: action.member };
    case "CLOSE_VIEW_DRAWER":
      return { ...state, viewDrawerMember: null, removeFromDrawer: false };
    case "OPEN_EDIT_DRAWER": {
      const norm = normalizeRelationship(action.member.relationship);
      return {
        ...state,
        editRelMember: action.member,
        editFormRel: norm,
        editDisplayName: action.member.patientName || "",
        isPrimary: norm === "Self",
        isEmergency: false,
        relFormError: null,
      };
    }
    case "CLOSE_EDIT_DRAWER":
      return {
        ...state,
        editRelMember: null,
        editFormRel: "Mother",
        editDisplayName: "",
        isPrimary: false,
        isEmergency: false,
        relFormError: null,
      };
    case "SET_EDIT_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_REL_FORM_ERROR":
      return { ...state, relFormError: action.error };
    case "OPEN_REMOVE_DIALOG":
      return {
        ...state,
        removeDialogMember: action.member,
        removeFromDrawer: action.fromDrawer,
      };
    case "CLOSE_REMOVE_DIALOG":
      return { ...state, removeDialogMember: null, removeFromDrawer: false };
    case "SHOW_TOAST":
      return { ...state, toastMessage: action.message };
    case "CLEAR_TOAST":
      return { ...state, toastMessage: null };
    default:
      return state;
  }
};

interface FamilyMembersManagementProps {
  familyMembers?: FamilyMember[];
  activeFamilyMember?: FamilyMember;
  onSwitchProfile?: (member: FamilyMember) => void;
  onAddFamilyMember?: (newMember?: Partial<FamilyMember>) => void;
  onRemoveFamilyMember?: (id: string) => void;
  onUpdateRelationship?: (
    id: string,
    relationship: FamilyMember["relationship"],
    updatedMemberData?: Record<string, unknown>,
  ) => void;
  onNavigateTab?: (tabId: string) => void;
}

const formatMemberDisplayName = (
  member?: FamilyMember | null,
  primaryMember?: FamilyMember | null,
): string => {
  if (!member) return "Patient";
  const isSelf = String(member.relationship || "").toUpperCase() === "SELF";
  const name = member.patientName || member.name || "Patient";
  if (isSelf) return name;
  const primaryName = primaryMember?.patientName || primaryMember?.name || "";
  const normRel = normalizeRelationship(member.relationship);
  if (name.includes(`(${normRel})`)) return name;
  if (
    primaryName &&
    name.toLowerCase().trim() === primaryName.toLowerCase().trim()
  ) {
    return `${name} (${normRel})`;
  }
  return name;
};

export function FamilyMembersManagement({
  familyMembers = [],
  activeFamilyMember = familyMembers[0],
  onSwitchProfile,
  onAddFamilyMember,
  onRemoveFamilyMember,
  onNavigateTab,
}: FamilyMembersManagementProps = {}) {
  const navigate = useNavigate();
  const [filters, dispatch] = useReducer(filterReducer, {
    searchTerm: "",
    relFilter: "All",
    statusFilter: "All",
  });
  const setFilter = (field: keyof FilterState, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  const handleNavigateProfile = (member: FamilyMember) => {
    onSwitchProfile?.(member);
    drawerDispatch({ type: "CLOSE_VIEW_DRAWER" });
    if (onNavigateTab) {
      onNavigateTab("profile");
    } else {
      navigate(`/patients/profile/${member.mrn}`);
    }
  };

  const handleNavigateAppointments = (member: FamilyMember) => {
    onSwitchProfile?.(member);
    drawerDispatch({ type: "CLOSE_VIEW_DRAWER" });
    if (onNavigateTab) {
      onNavigateTab("appointments");
    } else {
      navigate(ROUTES.PATIENT_APPOINTMENTS);
    }
  };

  const handleNavigatePrescriptions = (member: FamilyMember) => {
    onSwitchProfile?.(member);
    drawerDispatch({ type: "CLOSE_VIEW_DRAWER" });
    if (onNavigateTab) {
      onNavigateTab("prescriptions");
    } else {
      navigate(ROUTES.PATIENT_PRESCRIPTIONS);
    }
  };

  const handleNavigateBills = (member: FamilyMember) => {
    onSwitchProfile?.(member);
    drawerDispatch({ type: "CLOSE_VIEW_DRAWER" });
    if (onNavigateTab) {
      onNavigateTab("bills");
    } else {
      navigate(ROUTES.PATIENT_BILLING);
    }
  };

  // Drawer & Dialog states
  const [drawerState, drawerDispatch] = useReducer(drawerReducer, {
    viewDrawerMember: null,
    editRelMember: null,
    editFormRel: "Mother",
    editDisplayName: "",
    isPrimary: false,
    isEmergency: false,
    relFormError: null,
    toastMessage: null,
    removeDialogMember: null,
    removeFromDrawer: false,
  });
  const {
    viewDrawerMember,
    toastMessage,
    removeDialogMember,
    removeFromDrawer,
  } = drawerState;

  // Dynamic state for View Drawer Modal APIs
  const [modalData, setModalData] = useState<{
    basicInfo?: Record<string, unknown>;
    dashboard?: Record<string, unknown>;
    appointments?: unknown[];
    prescriptions?: Record<string, unknown>;
    bills?: unknown[];
    consultations?: Record<string, unknown>;
    loading: boolean;
  }>({ loading: false });

  useEffect(() => {
    let cancelled = false;

    async function loadMemberModalData() {
      if (!viewDrawerMember?.mrn) {
        setModalData({ loading: false });
        return;
      }
      setModalData((prev) => ({ ...prev, loading: true }));
      const mrn = viewDrawerMember.mrn;

      Promise.allSettled([
        apiClient.get(`/api/v1/patients/${encodeURIComponent(mrn)}`),
        apiClient.get(
          `/api/v1/patients/me/dashboard?mrn=${encodeURIComponent(mrn)}`,
        ),
        apiClient.get(
          `/api/v1/patients/me/appointments?mrn=${encodeURIComponent(mrn)}`,
        ),
        apiClient.get(
          `/api/v1/patients/me/prescriptions/summary?mrn=${encodeURIComponent(mrn)}`,
        ),
        apiClient.get(
          `/api/v1/patients/me/bills?mrn=${encodeURIComponent(mrn)}`,
        ),
        apiClient.get(
          `/api/v1/patients/me/consultations/history?mrn=${encodeURIComponent(mrn)}`,
        ),
      ]).then(([basicRes, dashRes, aptsRes, rxRes, billsRes, historyRes]) => {
        if (cancelled) return;
        const basic =
          basicRes.status === "fulfilled"
            ? (basicRes.value.data as { data?: unknown })?.data
            : null;
        const dash =
          dashRes.status === "fulfilled"
            ? (dashRes.value.data as { data?: unknown })?.data
            : null;
        const apts =
          aptsRes.status === "fulfilled"
            ? (aptsRes.value.data as { data?: unknown })?.data
            : null;
        const rx =
          rxRes.status === "fulfilled"
            ? (rxRes.value.data as { data?: unknown })?.data
            : null;
        const bills =
          billsRes.status === "fulfilled"
            ? (billsRes.value.data as { data?: unknown })?.data
            : null;
        const history =
          historyRes.status === "fulfilled"
            ? (historyRes.value.data as { data?: unknown })?.data
            : null;

        setModalData({
          basicInfo:
            basic && typeof basic === "object"
              ? (basic as Record<string, unknown>)
              : undefined,
          dashboard:
            dash && typeof dash === "object"
              ? (dash as Record<string, unknown>)
              : undefined,
          appointments: Array.isArray((apts as { items?: unknown[] })?.items)
            ? (apts as { items: unknown[] }).items
            : Array.isArray(apts)
              ? apts
              : undefined,
          prescriptions:
            rx && typeof rx === "object"
              ? (rx as Record<string, unknown>)
              : undefined,
          bills: Array.isArray(bills) ? bills : undefined,
          consultations:
            history && typeof history === "object"
              ? (history as Record<string, unknown>)
              : undefined,
          loading: false,
        });
      });
    }

    loadMemberModalData();

    return () => {
      cancelled = true;
    };
  }, [viewDrawerMember?.mrn]);

  // Top Summary Metrics
  const totalLinked = familyMembers.length;
  const upcomingApts = familyMembers.reduce(
    (acc, m) => acc + m.upcomingAppointmentsCount,
    0,
  );
  const pendingBills = familyMembers.reduce(
    (acc, m) => acc + m.pendingBillsCount,
    0,
  );
  const activeRx = familyMembers.reduce(
    (acc, m) => acc + m.activePrescriptionsCount,
    0,
  );

  // Filtered List (Case-insensitive matching for relationship & status)
  const filteredMembers = familyMembers.filter((m) => {
    const matchesSearch =
      m.patientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      m.mrn.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      m.relationship.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      m.registeredMobile.includes(filters.searchTerm);
    const matchesRel =
      filters.relFilter === "All" ||
      m.relationship.toLowerCase() === filters.relFilter.toLowerCase();
    const matchesStatus =
      filters.statusFilter === "All" ||
      m.verificationStatus.toLowerCase() === filters.statusFilter.toLowerCase();
    return matchesSearch && matchesRel && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9] text-[#111827]">
      {/* ── SCREEN HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 text-xs text-[#64748B] mb-1"
            style={{ fontFamily: RB }}
          >
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="hover:text-[#0D47A1] transition-colors font-medium cursor-pointer"
            >
              Patient Portal
            </button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#111827]">Family Members</span>
          </div>
          <h1
            className="text-2xl font-bold text-[#111827] tracking-tight"
            style={{ fontFamily: PP }}
          >
            Family Members
          </h1>
          <p
            className="text-sm text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Manage linked family members using your Patient Portal account.
          </p>
        </div>

        <button
          onClick={() => onAddFamilyMember?.()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D47A1] text-white rounded-xl text-sm font-semibold hover:bg-[#0c3d8a] transition-colors shadow-sm shadow-[#0D47A1]/20 active:scale-[0.98] shrink-0"
          style={{ fontFamily: PP }}
        >
          <UserPlus size={16} />
          Add Family Member
        </button>
      </div>

      {/* ── TOP SUMMARY CARDS (KPIs) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Total Linked Profiles
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {totalLinked}
            </div>
            <div
              className="text-[11px] text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Linked Family Members
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Upcoming Visits
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {upcomingApts}
            </div>
            <div
              className="text-[11px] text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Across Linked Members
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Pending Bills
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {pendingBills}
            </div>
            <div
              className="text-[11px] text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Across Linked Members
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Active Prescription
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#66BB6A]">
              <Pill size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {activeRx}
            </div>
            <div
              className="text-[11px] text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Across Linked Members
            </div>
          </div>
        </div>

        {/* Card 5 */}
        {/*   <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Pending Verif.
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-[#EF4444]">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {pendingVerif}
            </div>
            <div
              className="text-[11px] text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Profiles Awaiting Approval
            </div>
          </div>
        </div> */}
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"
          />
          <input
            aria-label="Input field"
            type="text"
            value={filters.searchTerm}
            onChange={(e) => setFilter("searchTerm", e.target.value)}
            placeholder="Search by Name, MRN, Mobile, Rel..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#64748B] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            style={{ fontFamily: RB }}
          />
          {filters.searchTerm && (
            <button
              aria-label="Close"
              onClick={() => setFilter("searchTerm", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#64748B]" />
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Filters:
            </span>
          </div>

          {/* Relationship Filter */}
          <select
            aria-label="Select option"
            value={filters.relFilter}
            onChange={(e) => setFilter("relFilter", e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#111827] outline-none focus:border-[#0D47A1]"
            style={{ fontFamily: RB }}
          >
            <option value="All">All Relationships</option>
            <option value="Self">Self</option>
            <option value="Mother">Mother</option>
            <option value="Father">Father</option>
            <option value="Spouse">Spouse</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Grandfather">Grandfather</option>
            <option value="Grandmother">Grandmother</option>
            <option value="Guardian">Guardian</option>
            <option value="Other">Other</option>
          </select>

          {/* Status Filter */}
          <select
            aria-label="Select option"
            value={filters.statusFilter}
            onChange={(e) => setFilter("statusFilter", e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#111827] outline-none focus:border-[#0D47A1]"
            style={{ fontFamily: RB }}
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── MAIN TABLE ── */}
      {filteredMembers.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-[#0D47A1]">
            <Users size={32} />
          </div>
          <h3
            className="text-lg font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            No Family Members Linked
          </h3>
          <p
            className="text-sm text-[#64748B] mt-1 max-w-sm mx-auto"
            style={{ fontFamily: RB }}
          >
            You haven't linked any family members matching your filters yet.
            Link your parents, spouse, or children for easy access.
          </p>
          <button
            onClick={() => onAddFamilyMember?.()}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D47A1] text-white rounded-xl text-sm font-semibold hover:bg-[#0c3d8a] transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <UserPlus size={16} />
            Add Family Member
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="bg-slate-50 border-b border-[#E5E7EB] text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
                  style={{ fontFamily: PP }}
                >
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">MRN</th>
                  <th className="py-3.5 px-4">Relationship</th>
                  <th className="py-3.5 px-4">Age / Gender</th>
                  <th className="py-3.5 px-4">Registered Mobile</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Appointment</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredMembers.map((m) => {
                  const isCurrentActive = activeFamilyMember?.id === m.id;
                  const computedMemberAge = m.dateOfBirth
                    ? calculateAge(m.dateOfBirth, m.age)
                    : m.age > 0
                      ? m.age
                      : 0;
                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isCurrentActive ? "bg-blue-50/30" : ""}`}
                    >
                      {/* Avatar + Patient Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-[#0D47A1] text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {m.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            {isCurrentActive && (
                              <span
                                className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#66BB6A] ring-2 ring-white rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                                title="Currently Active Profile"
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          <div>
                            <div
                              className="text-sm font-bold text-[#111827] flex items-center gap-1.5"
                              style={{ fontFamily: PP }}
                            >
                              {formatMemberDisplayName(
                                m,
                                activeFamilyMember || familyMembers[0],
                              )}
                              {isCurrentActive && (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-[#0D47A1] rounded-md">
                                  Active Profile
                                </span>
                              )}
                            </div>
                            <div
                              className="text-xs text-[#64748B]"
                              style={{ fontFamily: RB }}
                            >
                              ID: {m.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* MRN */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-semibold text-[#111827] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          {m.mrn}
                        </span>
                      </td>

                      {/* Relationship */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            m.relationship === "Self"
                              ? "text-[#0D47A1] bg-blue-50 border-blue-100"
                              : m.relationship === "Spouse"
                                ? "text-rose-700 bg-rose-50 border-rose-100"
                                : m.relationship === "Son" ||
                                    m.relationship === "Daughter"
                                  ? "text-purple-700 bg-purple-50 border-purple-100"
                                  : m.relationship === "Father" ||
                                      m.relationship === "Mother"
                                    ? "text-amber-700 bg-amber-50 border-amber-100"
                                    : "text-emerald-700 bg-emerald-50 border-emerald-100"
                          }`}
                          style={{ fontFamily: PP }}
                        >
                          {m.relationship || "Other"}
                        </span>
                      </td>

                      {/* Age / Gender */}
                      <td
                        className="py-3.5 px-4 text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      >
                        {computedMemberAge > 0
                          ? `${computedMemberAge} yrs`
                          : "0 yrs"}{" "}
                        · {m.gender || "Other"}
                      </td>

                      {/* Registered Mobile */}
                      <td
                        className="py-3.5 px-4 text-xs text-[#64748B] font-mono"
                        style={{ fontFamily: RB }}
                      >
                        {m.registeredMobile}
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {m.verificationStatus === "Verified" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-100">
                            <CheckCircle2 size={12} />
                            Verified
                          </span>
                        )}
                        {m.verificationStatus === "Pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#F59E0B] border border-amber-100">
                            <Clock size={12} />
                            Pending
                          </span>
                        )}
                        {m.verificationStatus === "Inactive" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#64748B] border border-slate-200">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Last Appointment */}
                      <td
                        className="py-3.5 px-4 text-xs text-[#64748B]"
                        style={{ fontFamily: RB }}
                      >
                        {m.lastAppointment || "No visits on record"}
                      </td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 shrink-0">
                          {/* Active Profile Badge / Set Active Button (Fixed width 110px) */}
                          {isCurrentActive ? (
                            <span
                              className="w-27.5 h-7 inline-flex items-center justify-center gap-1 bg-blue-50 text-[#0D47A1] rounded-lg text-xs font-bold border border-[#0D47A1] shrink-0 text-center"
                              style={{ fontFamily: PP }}
                            >
                              <CheckCircle2
                                size={13}
                                className="text-[#0D47A1] shrink-0"
                              />
                              Active Profile
                            </span>
                          ) : onSwitchProfile ? (
                            <button
                              onClick={() => onSwitchProfile(m)}
                              className="w-27.5 h-7 inline-flex items-center justify-center bg-white border border-[#0D47A1] text-[#0D47A1] hover:bg-blue-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 text-center"
                              style={{ fontFamily: PP }}
                            >
                              Set Active
                            </button>
                          ) : (
                            <div className="w-27.5 shrink-0" />
                          )}

                          {/* Remove Link */}
                          {m.relationship !== "Self" ? (
                            <button
                              onClick={() =>
                                drawerDispatch({
                                  type: "OPEN_REMOVE_DIALOG",
                                  member: m,
                                  fromDrawer: false,
                                })
                              }
                              className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                              title="Remove Link"
                            >
                              <UserX size={15} />
                            </button>
                          ) : (
                            <div className="w-7 h-7 shrink-0" />
                          )}

                          {/* View Details (Placed Last) */}
                          <button
                            onClick={() =>
                              drawerDispatch({
                                type: "OPEN_VIEW_DRAWER",
                                member: m,
                              })
                            }
                            className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0D47A1] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                            title="View Profile Details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── RECENT LINK ACTIVITY SECTION ── */}

      {/* ══════════════════════════════════════════════════════════════════
          ── FAMILY MEMBER DETAILS DRAWER (VIEW) ──
          ══════════════════════════════════════════════════════════════════ */}
      {viewDrawerMember && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden transition-transform duration-200">
            {/* ── Drawer Header ── */}
            <div className="p-5 border-b border-[#E5E7EB] bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-sm font-bold text-[#64748B] uppercase tracking-wider"
                  style={{ fontFamily: PP }}
                >
                  Family Member Details
                </h3>
                <button
                  aria-label="Close"
                  onClick={() => drawerDispatch({ type: "CLOSE_VIEW_DRAWER" })}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white font-bold flex items-center justify-center text-sm">
                  {viewDrawerMember.patientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-base font-bold text-[#111827] truncate"
                    style={{ fontFamily: PP }}
                  >
                    {viewDrawerMember.patientName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-[#64748B] bg-white px-2 py-0.5 rounded border border-slate-200">
                      {viewDrawerMember.mrn}
                    </span>
                    <span
                      className="text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"
                      style={{ fontFamily: PP }}
                    >
                      {viewDrawerMember.relationship}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        viewDrawerMember.verificationStatus === "Verified"
                          ? "bg-emerald-50 text-[#66BB6A] border border-emerald-100"
                          : viewDrawerMember.verificationStatus === "Pending"
                            ? "bg-amber-50 text-[#F59E0B] border border-amber-100"
                            : "bg-slate-100 text-[#64748B] border border-slate-200"
                      }`}
                    >
                      {viewDrawerMember.verificationStatus === "Verified" && (
                        <CheckCircle2 size={10} />
                      )}
                      {viewDrawerMember.verificationStatus === "Pending" && (
                        <Clock size={10} />
                      )}
                      {viewDrawerMember.verificationStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Drawer Content ── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section: Basic Information */}
              <div>
                <h4
                  className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3"
                  style={{ fontFamily: PP }}
                >
                  Basic Information
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">MRN:</span>
                    <span className="font-mono font-semibold text-[#111827]">
                      {viewDrawerMember.mrn}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Age / Gender:</span>
                    <span className="font-semibold text-[#111827]">
                      {viewDrawerMember.age > 0
                        ? `${viewDrawerMember.age} yrs`
                        : viewDrawerMember.dateOfBirth
                          ? `${calculateAge(viewDrawerMember.dateOfBirth, viewDrawerMember.age)} yrs`
                          : "0 yrs"}{" "}
                      · {viewDrawerMember.gender || "Other"}
                    </span>
                  </div>
                  {viewDrawerMember.bloodGroup && (
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Blood Group:</span>
                      <span className="font-semibold text-[#EF4444]">
                        {viewDrawerMember.bloodGroup}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Registered Mobile:</span>
                    <span className="font-mono font-semibold text-[#111827]">
                      {viewDrawerMember.registeredMobile}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Relationship:</span>
                    <span className="font-semibold text-[#0D47A1]">
                      {viewDrawerMember.relationship}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Verification Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        viewDrawerMember.verificationStatus === "Verified"
                          ? "bg-emerald-100 text-[#66BB6A]"
                          : viewDrawerMember.verificationStatus === "Pending"
                            ? "bg-amber-100 text-[#F59E0B]"
                            : "bg-slate-100 text-[#64748B]"
                      }`}
                    >
                      {viewDrawerMember.verificationStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section: Clinical Summary (KPI Cards) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4
                    className="text-xs font-bold text-[#64748B] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Clinical Summary
                  </h4>
                  {modalData.loading && (
                    <Loader2
                      size={12}
                      className="animate-spin text-[#0D47A1]"
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={14} className="text-[#009688]" />
                      <span
                        className="text-[10px] text-[#64748B] font-semibold"
                        style={{ fontFamily: PP }}
                      >
                        Upcoming Appointments
                      </span>
                    </div>
                    <div
                      className="text-lg font-bold text-[#009688]"
                      style={{ fontFamily: PP }}
                    >
                      {modalData.appointments
                        ? modalData.appointments.length
                        : viewDrawerMember.upcomingAppointmentsCount}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard size={14} className="text-[#F59E0B]" />
                      <span
                        className="text-[10px] text-[#64748B] font-semibold"
                        style={{ fontFamily: PP }}
                      >
                        Pending Bills
                      </span>
                    </div>
                    <div
                      className="text-lg font-bold text-[#F59E0B]"
                      style={{ fontFamily: PP }}
                    >
                      ₹{viewDrawerMember.pendingBillsAmount}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Stethoscope size={14} className="text-[#0D47A1]" />
                      <span
                        className="text-[10px] text-[#64748B] font-semibold"
                        style={{ fontFamily: PP }}
                      >
                        Last Consultation
                      </span>
                    </div>
                    <div
                      className="text-sm font-bold text-[#0D47A1]"
                      style={{ fontFamily: PP }}
                    >
                      {viewDrawerMember.lastConsultationDate ||
                        viewDrawerMember.lastAppointment ||
                        "—"}
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} className="text-[#66BB6A]" />
                      <span
                        className="text-[10px] text-[#64748B] font-semibold"
                        style={{ fontFamily: PP }}
                      >
                        Primary Doctor
                      </span>
                    </div>
                    <div
                      className="text-sm font-bold text-[#66BB6A] truncate"
                      style={{ fontFamily: PP }}
                    >
                      {viewDrawerMember.primaryDoctor || "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Recent Records */}
              <div>
                <h4
                  className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3"
                  style={{ fontFamily: PP }}
                >
                  Recent Records
                </h4>
                <div className="space-y-2">
                  <div
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        (e.currentTarget as HTMLElement).click();
                      }
                    }}
                    role="button"
                    className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleNavigateAppointments(viewDrawerMember)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0D47A1] shrink-0">
                      <Calendar size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Last Visit
                      </div>
                      <div className="text-[#64748B] truncate">
                        {viewDrawerMember.lastAppointment ||
                          "No visits on record"}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  <div
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        (e.currentTarget as HTMLElement).click();
                      }
                    }}
                    role="button"
                    className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleNavigateAppointments(viewDrawerMember)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#009688] shrink-0">
                      <Stethoscope size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Latest Appointment
                      </div>
                      <div className="text-[#64748B] truncate">
                        {viewDrawerMember.upcomingAppointmentsCount > 0
                          ? `${viewDrawerMember.upcomingAppointmentsCount} upcoming`
                          : "No upcoming appointments"}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  <div
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        (e.currentTarget as HTMLElement).click();
                      }
                    }}
                    role="button"
                    className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() =>
                      handleNavigatePrescriptions(viewDrawerMember)
                    }
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#66BB6A] shrink-0">
                      <Pill size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Active Prescriptions
                      </div>
                      <div className="text-[#64748B] truncate">
                        {viewDrawerMember.activePrescriptionsCount} active
                        medicines on file
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  <div
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        (e.currentTarget as HTMLElement).click();
                      }
                    }}
                    role="button"
                    className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleNavigateBills(viewDrawerMember)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#F59E0B] shrink-0">
                      <CreditCard size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Latest Bill
                      </div>
                      <div className="text-[#64748B] truncate">
                        {viewDrawerMember.latestBillId
                          ? `${viewDrawerMember.latestBillId} · ₹${viewDrawerMember.latestBillAmount}`
                          : "No bills on record"}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Section: Portal Actions */}
              <div>
                <h4
                  className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3"
                  style={{ fontFamily: PP }}
                >
                  Portal Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavigateProfile(viewDrawerMember)}
                    className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <ExternalLink size={14} />
                    Open Full Profile
                  </button>
                  <button
                    onClick={() => handleNavigateAppointments(viewDrawerMember)}
                    className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#009688] hover:bg-teal-50 hover:border-teal-200 transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <Calendar size={14} />
                    View Appointments
                  </button>
                  <button
                    onClick={() =>
                      handleNavigatePrescriptions(viewDrawerMember)
                    }
                    className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#66BB6A] hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <Pill size={14} />
                    View Prescriptions
                  </button>
                  <button
                    onClick={() => handleNavigateBills(viewDrawerMember)}
                    className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#F59E0B] hover:bg-amber-50 hover:border-amber-200 transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <CreditCard size={14} />
                    View Bills
                  </button>
                </div>
              </div>
            </div>

            {/* ── Drawer Footer ── */}
            <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => drawerDispatch({ type: "CLOSE_VIEW_DRAWER" })}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
                  style={{ fontFamily: PP }}
                >
                  Close
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigateProfile(viewDrawerMember)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-[#0c3d8a] transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <ExternalLink size={14} />
                    Open Full Profile
                  </button>
                </div>
              </div>
              {viewDrawerMember.relationship !== "Self" && (
                <button
                  onClick={() => {
                    drawerDispatch({
                      type: "OPEN_REMOVE_DIALOG",
                      member: viewDrawerMember,
                      fromDrawer: true,
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-xl text-xs font-semibold text-[#EF4444] hover:bg-red-50 transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <UserX size={14} />
                  Remove Family Member
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── REMOVE FAMILY MEMBER CONFIRMATION DIALOG ── */}
      {removeDialogMember && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-150">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 max-w-md w-full shadow-2xl space-y-4">
            {/* HEADER */}
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#EF4444] flex items-center justify-center font-bold shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Remove Family Member
                </h3>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Confirm removing linked family member
                </p>
              </div>
            </div>

            {/* BODY: PATIENT SUMMARY CARD */}
            <div className="p-3.5 bg-slate-50 border border-[#E5E7EB] rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {removeDialogMember.patientName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold text-[#111827] truncate"
                    style={{ fontFamily: PP }}
                  >
                    {removeDialogMember.patientName}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-[#0D47A1] text-[10px] font-bold rounded-full">
                    {removeDialogMember.relationship}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#64748B]">
                  {removeDialogMember.mrn}
                </div>
              </div>
            </div>

            {/* CONFIRMATION MESSAGE */}
            <div
              className="space-y-1 text-xs text-[#64748B] leading-relaxed"
              style={{ fontFamily: RB }}
            >
              <p>
                Are you sure you want to remove this linked family member from
                your Patient Portal account?
              </p>
              <p>
                This action only removes the relationship from your account. It
                will <strong>NOT</strong> delete the patient's hospital record
                or medical history.
              </p>
            </div>

            {/* WARNING BOX */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-[#F59E0B]">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span
                style={{ fontFamily: RB }}
                className="text-[#854D0E] font-medium"
              >
                This action can be reversed later by sending a new link request.
              </span>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
              <button
                onClick={() => {
                  drawerDispatch({ type: "CLOSE_REMOVE_DIALOG" });
                }}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const name = removeDialogMember.patientName;
                  onRemoveFamilyMember?.(
                    removeDialogMember.mrn || removeDialogMember.id,
                  );
                  drawerDispatch({ type: "CLOSE_REMOVE_DIALOG" });
                  if (removeFromDrawer) {
                    drawerDispatch({ type: "CLOSE_VIEW_DRAWER" });
                  }
                  drawerDispatch({
                    type: "SHOW_TOAST",
                    message: `Family member ${name} removed successfully.`,
                  });
                  setTimeout(
                    () => drawerDispatch({ type: "CLEAR_TOAST" }),
                    3000,
                  );
                }}
                className="px-5 py-2 bg-[#EF4444] text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <UserX size={14} />
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 transition-transform duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#66BB6A] shrink-0" />
          <span className="text-xs font-semibold" style={{ fontFamily: PP }}>
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
