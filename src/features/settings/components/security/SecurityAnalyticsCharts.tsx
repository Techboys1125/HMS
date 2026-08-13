import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";

export function SecurityAnalyticsCharts() {
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
        <BarChart2 size={18} style={{ color: "#0D47A1" }} /> Threat
        Analytics & Login Trends
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        {/* Donut Chart Mock */}
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
            <PieChartIcon size={14} style={{ color: "#009688" }} /> Security
            Events by Category
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
                  "conic-gradient(#0D47A1 0% 50%, #009688 50% 75%, #F59E0B 75% 90%, #EF4444 90% 100%)",
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
                ■ Auth Events (50%)
              </span>
              <span style={{ color: "#009688", fontWeight: 600 }}>
                ■ RBAC Changes (25%)
              </span>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                ■ Password Resets (15%)
              </span>
              <span style={{ color: "#EF4444", fontWeight: 600 }}>
                ■ Lockouts (10%)
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart Mock */}
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
            Login Attempt Volume (Success vs Failed)
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Successful Logins", count: 1482, color: "#009688" },
              {
                label: "2FA Verification Success",
                count: 1420,
                color: "#0D47A1",
              },
              {
                label: "Failed Password Attempts",
                count: 14,
                color: "#F59E0B",
              },
              { label: "IP Lockouts Enforced", count: 2, color: "#EF4444" },
            ].map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>
                    {item.count} Events
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
                      width: `${(item.count / 1500) * 100}%`,
                      height: "100%",
                      background: item.color,
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
