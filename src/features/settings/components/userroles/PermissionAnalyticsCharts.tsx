import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";

export function PermissionAnalyticsCharts() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{
          fontFamily: PP,
          fontSize: "16px",
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <BarChart2 size={18} style={{ color: "#0D47A1" }} /> Role &
        Permission Analytics
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        {/* Donut Chart Mock: Users by Role */}
        <div
          style={{
            background: "#F8FAFC",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #E2E8F0",
          }}
        >
          <h4
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 12px 0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <PieChartIcon size={14} style={{ color: "#009688" }} /> Active
            Staff Users by Role
          </h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              height: "120px",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background:
                  "conic-gradient(#0D47A1 0% 55%, #009688 55% 80%, #F59E0B 80% 90%, #9C27B0 90% 100%)",
              }}
            />
            <div
              style={{
                fontSize: "11px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ color: "#0D47A1", fontWeight: 600 }}>
                ■ Doctors (145)
              </span>
              <span style={{ color: "#009688", fontWeight: 600 }}>
                ■ Nurses (68)
              </span>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                ■ Receptionists (24)
              </span>
              <span style={{ color: "#9C27B0", fontWeight: 600 }}>
                ■ Accountants (12)
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart Mock: Module Access Distribution */}
        <div
          style={{
            background: "#F8FAFC",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #E2E8F0",
          }}
        >
          <h4
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 12px 0",
            }}
          >
            Module Privilege Distribution
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {[
              { module: "Patients Module", roles: 6, color: "#0D47A1" },
              { module: "Appointments Module", roles: 6, color: "#009688" },
              { module: "Billing Module", roles: 3, color: "#F59E0B" },
              { module: "Settings Module", roles: 2, color: "#EF4444" },
            ].map((b) => (
              <div key={b.module}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  <span>{b.module}</span>
                  <span style={{ fontWeight: 600 }}>
                    {b.roles} Roles Granted
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#E2E8F0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(b.roles / 6) * 100}%`,
                      height: "100%",
                      background: b.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
