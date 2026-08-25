import { Search } from "lucide-react";

const RB = "'Roboto', system-ui, sans-serif";

interface RolesFilterBarProps {
  searchTerm: string;
  selectedRoleType: string;
  selectedStatus: string;
  setSearchTerm: (value: string) => void;
  setSelectedRoleType: (value: string) => void;
  setSelectedStatus: (value: string) => void;
}

export function RolesFilterBar({
  searchTerm,
  selectedRoleType,
  selectedStatus,
  setSearchTerm,
  setSelectedRoleType,
  setSelectedStatus,
}: RolesFilterBarProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94A3B8",
          }}
        />
        <input aria-label="Search role name, description, or access level..."
          type="text"
          placeholder="Search role name, description, or access level..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 12px 9px 36px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            fontSize: "13px",
            boxSizing: "border-box",
            fontFamily: RB,
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <select aria-label="Select option"
          value={selectedRoleType}
          onChange={(e) => setSelectedRoleType(e.target.value)}
          style={{
            padding: "9px 12px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            fontSize: "13px",
            background: "#FFFFFF",
            color: "#374151",
          }}
        >
          <option value="All">All Role Types</option>
          <option value="System">System Default Roles</option>
          <option value="Custom">Custom Hospital Roles</option>
        </select>

        <select aria-label="Select option"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: "9px 12px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            fontSize: "13px",
            background: "#FFFFFF",
            color: "#374151",
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedRoleType("All");
            setSelectedStatus("All");
          }}
          style={{
            padding: "9px 14px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#F8FAFC",
            color: "#64748B",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
