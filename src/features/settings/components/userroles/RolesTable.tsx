import { useState } from "react";
import { Eye, Lock, Shield, Filter, RotateCcw } from "lucide-react";
import { ROLES, type RoleItem } from "../../constants/userroles.constants";
import { RoleDetailsDrawer } from "./RoleDetailsDrawer";
import {
  DataTable,
  type Column,
} from "../../../../common/components/DataTable";

const PP = "'Poppins', system-ui, sans-serif";

export function RolesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleType, setSelectedRoleType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

  const filteredRoles = ROLES.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedRoleType === "All" ||
      (selectedRoleType === "System" && role.isSystem) ||
      (selectedRoleType === "Custom" && !role.isSystem);
    const matchesStatus =
      selectedStatus === "All" || role.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns: Column<RoleItem>[] = [
    {
      key: "name",
      label: "ROLE NAME",
      sortable: true,
      getValue: (r) => r.name,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5 font-bold text-[#0D47A1]">
            {r.isSystem && <Lock size={12} className="text-[#009688]" />}
            <span>{r.name}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            {r.usersCount.toLocaleString()} Users &bull; {r.permissionLevel}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "DESCRIPTION",
      sortable: true,
      getValue: (r) => r.description,
      render: (r) => (
        <span
          className="text-slate-600 max-w-xs truncate block"
          title={r.description}
        >
          {r.description}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      sortable: true,
      getValue: (r) => r.status,
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            r.status === "Active"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "lastUpdated",
      label: "LAST UPDATED",
      sortable: true,
      getValue: (r) => r.lastUpdated,
      render: (r) => (
        <span className="text-slate-400 text-xs font-mono">
          {r.lastUpdated}
        </span>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      sortable: false,
      align: "right",
      render: (r) => (
        <button
          onClick={() => setSelectedRole(r)}
          className="px-3 py-1.5 rounded-lg border border-[#0D47A1] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
          style={{ fontFamily: PP }}
        >
          <Eye size={14} /> View Details
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable<RoleItem>
        data={filteredRoles}
        columns={columns}
        getRowId={(r) => r.id}
        title="Role Definitions Roster"
        subtitle="RBAC Security Protocol v4.2 &bull; Role definitions and module permission mappings."
        headerBadge={
          <span className="text-xs font-semibold text-[#0D47A1] bg-blue-50 px-3 py-1 rounded-xl border border-blue-100 font-mono">
            Showing {filteredRoles.length} of {ROLES.length} Roles
          </span>
        }
        searchable={true}
        searchPlaceholder=" Search Role Name or Description..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        toolbar={
          <div className="bg-slate-50/80 border border-[#E5E7EB] rounded-xl p-2.5 space-y-2 shadow-2xs text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                <Shield size={13} className="text-slate-400" />
                <span className="text-slate-400 text-[11px]">Role Type:</span>
                <select
                  aria-label="Role type filter"
                  value={selectedRoleType}
                  onChange={(e) => setSelectedRoleType(e.target.value)}
                  className="bg-transparent font-semibold text-[#0D47A1] outline-none cursor-pointer text-xs"
                >
                  <option value="All">All Types</option>
                  <option value="System">System Default Roles</option>
                  <option value="Custom">Custom Hospital Roles</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                <Filter size={13} className="text-slate-400" />
                <span className="text-slate-400 text-[11px]">Status:</span>
                <select
                  aria-label="Status filter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent font-semibold text-[#0D47A1] outline-none cursor-pointer text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {(selectedRoleType !== "All" ||
                selectedStatus !== "All" ||
                searchTerm) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRoleType("All");
                    setSelectedStatus("All");
                  }}
                  className="px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs shrink-0 ml-auto"
                  style={{ fontFamily: PP }}
                >
                  <RotateCcw size={12} /> Clear Filters
                </button>
              )}
            </div>
          </div>
        }
        emptyTitle="No roles found"
        emptySubtitle="No role definitions match your search query or selected filter criteria."
        pagination={true}
      />

      {selectedRole && (
        <RoleDetailsDrawer
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </>
  );
}
