import { Shield, Lock, Sliders, Grid } from "lucide-react";
import { ROLES } from "../../constants/userroles.constants";

const PP = "'Poppins', system-ui, sans-serif";

export function UserRolesKpiCards() {
  const totalRoles = ROLES.length;
  const systemRoles = ROLES.filter((r) => r.isSystem).length;
  const customRoles = ROLES.filter((r) => !r.isSystem).length;
  const totalPermissionsSets = 44;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Total Roles
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E3F2FD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={18} style={{ color: "#0D47A1" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {totalRoles}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            System & Custom
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#2E7D32",
              background: "#E8F5E9",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Active
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            System Default Roles
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E0F2F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={18} style={{ color: "#009688" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {systemRoles}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            Phase-1 Protected
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#009688",
              background: "#E0F2F1",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Core
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Custom Hospital Roles
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#E8F5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sliders size={18} style={{ color: "#2E7D32" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {customRoles}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            User Defined
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#2E7D32",
              background: "#E8F5E9",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Configurable
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
          >
            Active Permission Sets
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid size={18} style={{ color: "#B45309" }} />
          </div>
        </div>
        <div
          style={{
            fontFamily: PP,
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {totalPermissionsSets}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            Module Rules
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#B45309",
              background: "#FEF3C7",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Enforced
          </span>
        </div>
      </div>
    </div>
  );
}
