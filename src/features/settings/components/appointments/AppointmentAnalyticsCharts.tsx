import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function AppointmentAnalyticsCharts() {
  void RB;
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
        <BarChart2 size={18} style={{ color: "#0D47A1" }} /> Appointment Volume
        Analytics
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
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
            Appointments by Day of Week
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { day: "Monday", count: 142, color: "#0D47A1" },
              { day: "Tuesday", count: 128, color: "#009688" },
              { day: "Wednesday", count: 135, color: "#0D47A1" },
              { day: "Thursday", count: 119, color: "#009688" },
            ].map((item) => (
              <div key={item.day}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  <span>{item.day}</span>
                  <span style={{ fontWeight: 600 }}>{item.count} Bookings</span>
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
                      width: `${(item.count / 160) * 100}%`,
                      height: "100%",
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

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
            <PieChartIcon size={14} style={{ color: "#009688" }} /> Status
            Distribution Breakdown
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
                  "conic-gradient(#66BB6A 0% 60%, #0D47A1 60% 80%, #F59E0B 80% 92%, #EF4444 92% 100%)",
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
              <span style={{ color: "#66BB6A", fontWeight: 600 }}>
                ■ Completed (60%)
              </span>
              <span style={{ color: "#0D47A1", fontWeight: 600 }}>
                ■ Scheduled (20%)
              </span>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                ■ Waiting (12%)
              </span>
              <span style={{ color: "#EF4444", fontWeight: 600 }}>
                ■ Cancelled (8%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
