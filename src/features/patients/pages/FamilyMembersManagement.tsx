import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  Calendar,
  CreditCard,
  Pill,
  ChevronRight,
  Eye,
  Edit3,
  UserX,
  AlertCircle,
  X,
  CheckCircle2,
  Info,
  Stethoscope,
  ExternalLink,
  User,
} from "lucide-react";
import { INITIAL_FAMILY_MEMBERS } from "../../../mocks/familyMembers.mock";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export type FamilyMember = {
  id: string;
  patientName: string;
  mrn: string;
  relationship:
    | "Self"
    | "Mother"
    | "Father"
    | "Spouse"
    | "Son"
    | "Daughter"
    | "Brother"
    | "Sister"
    | "Grandfather"
    | "Grandmother"
    | "Guardian"
    | "Other";
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup?: string;
  registeredMobile: string;
  verificationStatus: "Verified" | "Pending" | "Inactive";
  patientStatus: "Active" | "Inactive";
  lastAppointment: string;
  avatarBg?: string;
  upcomingAppointmentsCount: number;
  pendingBillsCount: number;
  pendingBillsAmount: number;
  activePrescriptionsCount: number;
  lastConsultationDate?: string;
  primaryDoctor?: string;
  latestBillId?: string;
  latestBillAmount?: number;
};

export type LinkActivity = {
  id: string;
  date: string;
  time: string;
  activity: string;
  status: "Completed" | "Pending" | "Updated";
};

const MOCK_ACTIVITIES: LinkActivity[] = [
  {
    id: "ACT-1",
    date: "26 Jul 2026",
    time: "04:15 PM",
    activity: "Profile Switched to Sunita Kumar (Mother)",
    status: "Completed",
  },
  {
    id: "ACT-2",
    date: "25 Jul 2026",
    time: "11:20 AM",
    activity: "Verification Requested for Aarav Kumar (Son)",
    status: "Pending",
  },
  {
    id: "ACT-3",
    date: "18 Jul 2026",
    time: "09:00 AM",
    activity: "Verification Completed for Sunita Kumar (Mother)",
    status: "Completed",
  },
  {
    id: "ACT-4",
    date: "10 Jul 2026",
    time: "03:45 PM",
    activity: "Relationship Updated for Ramesh Kumar (Father)",
    status: "Updated",
  },
  {
    id: "ACT-5",
    date: "01 Jul 2026",
    time: "10:00 AM",
    activity: "Family Member Linked: Ananya Kumar (Daughter)",
    status: "Completed",
  },
];

interface FamilyMembersManagementProps {
  familyMembers?: FamilyMember[];
  activeFamilyMember?: FamilyMember;
  onSwitchProfile?: (member: FamilyMember) => void;
  onAddFamilyMember?: (newMember?: Partial<FamilyMember>) => void;
  onRemoveFamilyMember?: (id: string) => void;
  onUpdateRelationship?: (
    id: string,
    relationship: FamilyMember["relationship"],
  ) => void;
}

export function FamilyMembersManagement({
  familyMembers = INITIAL_FAMILY_MEMBERS,
  activeFamilyMember = INITIAL_FAMILY_MEMBERS[0],
  onSwitchProfile,
  onAddFamilyMember,
  onRemoveFamilyMember,
  onUpdateRelationship,
}: FamilyMembersManagementProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [relFilter, setRelFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Drawer & Dialog states
  const [viewDrawerMember, setViewDrawerMember] = useState<FamilyMember | null>(
    null,
  );
  const [editRelMember, setEditRelMember] = useState<FamilyMember | null>(null);
  const [editFormRel, setEditFormRel] =
    useState<FamilyMember["relationship"]>("Mother");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [relFormError, setRelFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [removeDialogMember, setRemoveDialogMember] =
    useState<FamilyMember | null>(null);
  const [removeFromDrawer, setRemoveFromDrawer] = useState(false);

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
  const pendingVerif = familyMembers.filter(
    (m) => m.verificationStatus === "Pending",
  ).length;

  // Filtered List
  const filteredMembers = familyMembers.filter((m) => {
    const matchesSearch =
      m.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.registeredMobile.includes(searchTerm);
    const matchesRel = relFilter === "All" || m.relationship === relFilter;
    const matchesStatus =
      statusFilter === "All" || m.verificationStatus === statusFilter;
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
            <span className="hover:text-[#0D47A1] cursor-pointer">
              Patient Portal
            </span>
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D47A1] text-white rounded-xl text-sm font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm shadow-[#0D47A1]/20 active:scale-[0.98] shrink-0"
          style={{ fontFamily: PP }}
        >
          <UserPlus size={16} />
          Add Family Member
        </button>
      </div>

      {/* ── TOP SUMMARY CARDS (KPIs) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              Active Rx
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
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
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
        </div>
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
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, MRN, Mobile, Rel..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#64748B] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            style={{ fontFamily: RB }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
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
            value={relFilter}
            onChange={(e) => setRelFilter(e.target.value)}
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D47A1] text-white rounded-xl text-sm font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm"
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
                              {m.patientName}
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
                        {m.age} yrs · {m.gender}
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
                        {m.lastAppointment}
                      </td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Drawer */}
                          <button
                            onClick={() => setViewDrawerMember(m)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0D47A1] hover:bg-slate-100 transition-colors"
                            title="View Profile Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit Relationship */}
                          <button
                            onClick={() => {
                              setEditRelMember(m);
                              setEditFormRel(m.relationship);
                              setEditDisplayName("");
                              setIsPrimary(m.relationship === "Self");
                              setIsEmergency(false);
                              setRelFormError(null);
                            }}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#009688] hover:bg-slate-100 transition-colors"
                            title="Edit Relationship"
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Active Profile Badge on current member */}
                          {isCurrentActive ? (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#0D47A1] rounded-lg text-xs font-bold border border-[#0D47A1]"
                              style={{ fontFamily: PP }}
                            >
                              <CheckCircle2
                                size={13}
                                className="text-[#0D47A1]"
                              />
                              Active Profile
                            </span>
                          ) : (
                            onSwitchProfile && (
                              <button
                                onClick={() => onSwitchProfile(m)}
                                className="px-2.5 py-1 bg-white border border-[#0D47A1] text-[#0D47A1] hover:bg-blue-50 rounded-lg text-xs font-bold transition-colors"
                                style={{ fontFamily: PP }}
                              >
                                Set Active
                              </button>
                            )
                          )}

                          {/* Remove Link */}
                          {m.relationship !== "Self" && (
                            <button
                              onClick={() => setRemoveDialogMember(m)}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 transition-colors"
                              title="Remove Link"
                            >
                              <UserX size={15} />
                            </button>
                          )}
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
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-base font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Recent Link Activity
          </h3>
          <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
            Audit log of profile switches & modifications
          </span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
          {MOCK_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="relative flex items-start justify-between gap-4 text-xs"
            >
              <div className="absolute -left-6 top-0.5 w-2.5 h-2.5 rounded-full bg-[#0D47A1] ring-4 ring-white" />
              <div>
                <div
                  className="font-semibold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {act.activity}
                </div>
                <div
                  className="text-[#64748B] mt-0.5"
                  style={{ fontFamily: RB }}
                >
                  {act.date} · {act.time}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                  act.status === "Completed"
                    ? "bg-emerald-50 text-[#66BB6A]"
                    : act.status === "Pending"
                      ? "bg-amber-50 text-[#F59E0B]"
                      : "bg-blue-50 text-[#0D47A1]"
                }`}
              >
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ── FAMILY MEMBER DETAILS DRAWER (VIEW) ──
          ══════════════════════════════════════════════════════════════════ */}
      {viewDrawerMember && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
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
                  onClick={() => setViewDrawerMember(null)}
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
                      {viewDrawerMember.age} yrs · {viewDrawerMember.gender}
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
                <h4
                  className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3"
                  style={{ fontFamily: PP }}
                >
                  Clinical Summary
                </h4>
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
                      {viewDrawerMember.upcomingAppointmentsCount}
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
                      {viewDrawerMember.lastConsultationDate || "—"}
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
                  <div className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs hover:shadow-sm transition-shadow">
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
                        {viewDrawerMember.lastAppointment}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs hover:shadow-sm transition-shadow">
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
                  <div className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs hover:shadow-sm transition-shadow">
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
                  <div className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs hover:shadow-sm transition-shadow">
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
                    className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 hover:border-blue-200 transition-all"
                    style={{ fontFamily: PP }}
                  >
                    <ExternalLink size={14} />
                    Open Full Profile
                  </button>
                  <button
                    className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#009688] hover:bg-teal-50 hover:border-teal-200 transition-all"
                    style={{ fontFamily: PP }}
                  >
                    <Calendar size={14} />
                    View Appointments
                  </button>
                  <button
                    className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#66BB6A] hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                    style={{ fontFamily: PP }}
                  >
                    <Pill size={14} />
                    View Prescriptions
                  </button>
                  <button
                    className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#F59E0B] hover:bg-amber-50 hover:border-amber-200 transition-all"
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
                  onClick={() => setViewDrawerMember(null)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
                  style={{ fontFamily: PP }}
                >
                  Close
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setViewDrawerMember(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-[#0c3d8a] transition-all"
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
                    setRemoveFromDrawer(true);
                    setRemoveDialogMember(viewDrawerMember);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-xl text-xs font-semibold text-[#EF4444] hover:bg-red-50 transition-all"
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

      {/* ── EDIT FAMILY RELATIONSHIP DRAWER ── */}
      {editRelMember && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setEditRelMember(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-[#E5E7EB] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="h-16 px-6 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3
                    className="text-base font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Edit Family Relationship
                  </h3>
                  <p
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Update relationship details for this linked family member.
                  </p>
                </div>
                <button
                  onClick={() => setEditRelMember(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#64748B] flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* PROFILE SUMMARY CARD (Read Only) */}
                <div className="p-4 bg-slate-50 border border-[#E5E7EB] rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {editRelMember.patientName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className="text-sm font-bold text-[#111827] truncate"
                          style={{ fontFamily: PP }}
                        >
                          {editRelMember.patientName}
                        </h4>
                        <span className="px-2 py-0.5 bg-blue-100 text-[#0D47A1] text-[10px] font-bold rounded-full">
                          {editRelMember.relationship}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-[#64748B]">
                        {editRelMember.mrn}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E5E7EB]">
                    <div>
                      <span className="text-[#64748B]">Age / Gender: </span>
                      <span className="font-semibold text-[#111827]">
                        {editRelMember.age} Yrs / {editRelMember.gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Mobile: </span>
                      <span className="font-semibold text-[#111827]">
                        {editRelMember.registeredMobile}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Status: </span>
                      <span
                        className={`font-semibold ${editRelMember.verificationStatus === "Verified" ? "text-emerald-600" : "text-amber-600"}`}
                      >
                        {editRelMember.verificationStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Blood Group: </span>
                      <span className="font-semibold text-[#111827]">
                        {editRelMember.bloodGroup || "O+"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RELATIONSHIP INFORMATION */}
                <div className="space-y-4">
                  <h4
                    className="text-xs font-bold text-[#64748B] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Relationship Information
                  </h4>

                  {/* Relationship Dropdown */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-[#111827] mb-1.5"
                      style={{ fontFamily: PP }}
                    >
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editFormRel}
                      onChange={(e) => {
                        setEditFormRel(
                          e.target.value as FamilyMember["relationship"],
                        );
                        setRelFormError(null);
                      }}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-[#111827] outline-none transition-colors ${
                        relFormError
                          ? "border-red-400 bg-red-50/20"
                          : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
                      }`}
                      style={{ fontFamily: RB }}
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Other">Other</option>
                    </select>
                    {relFormError && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">
                        {relFormError}
                      </p>
                    )}
                  </div>

                  {/* Display Name (Optional Nickname) */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-[#111827] mb-1.5"
                      style={{ fontFamily: PP }}
                    >
                      Display Name (Optional Nickname)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mom, Dad, Grandpa"
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                      style={{ fontFamily: RB }}
                    />
                  </div>
                </div>

                {/* PRIMARY & EMERGENCY CONTACT TOGGLES */}
                <div className="space-y-4 pt-2 border-t border-[#E5E7EB]">
                  {/* Primary Toggle */}
                  <div className="flex items-start justify-between gap-3 p-3.5 bg-slate-50 border border-[#E5E7EB] rounded-2xl">
                    <div className="space-y-0.5">
                      <div
                        className="text-xs font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Set as Primary Linked Family Member
                      </div>
                      <div
                        className="text-[11px] text-[#64748B]"
                        style={{ fontFamily: RB }}
                      >
                        Primary profile appears first in the Active Patient
                        Selector.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPrimary(!isPrimary)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isPrimary ? "bg-[#0D47A1]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isPrimary ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Emergency Toggle */}
                  <div className="flex items-start justify-between gap-3 p-3.5 bg-slate-50 border border-[#E5E7EB] rounded-2xl">
                    <div className="space-y-0.5">
                      <div
                        className="text-xs font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Mark as Emergency Contact
                      </div>
                      <div
                        className="text-[11px] text-[#64748B]"
                        style={{ fontFamily: RB }}
                      >
                        Used only for quick identification inside Patient
                        Portal.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEmergency(!isEmergency)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEmergency ? "bg-[#009688]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isEmergency ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* INFO BOX */}
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-[#0D47A1]">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <span style={{ fontFamily: RB }}>
                    Changing the relationship will not affect the patient's
                    medical records.
                  </span>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button
                  onClick={() => setEditRelMember(null)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
                  style={{ fontFamily: PP }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!editFormRel) {
                      setRelFormError("Relationship is required");
                      return;
                    }
                    onUpdateRelationship?.(editRelMember.id, editFormRel);
                    setToastMessage("Relationship updated successfully.");
                    setEditRelMember(null);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="px-5 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REMOVE FAMILY MEMBER CONFIRMATION DIALOG ── */}
      {removeDialogMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
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
                  setRemoveDialogMember(null);
                  setRemoveFromDrawer(false);
                }}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const name = removeDialogMember.patientName;
                  onRemoveFamilyMember?.(removeDialogMember.id);
                  setRemoveDialogMember(null);
                  if (removeFromDrawer) {
                    setViewDrawerMember(null);
                    setRemoveFromDrawer(false);
                  }
                  setToastMessage(
                    `Family member ${name} removed successfully.`,
                  );
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-5 py-2 bg-[#EF4444] text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-all shadow-sm flex items-center gap-1.5"
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#66BB6A] shrink-0" />
          <span className="text-xs font-semibold" style={{ fontFamily: PP }}>
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
