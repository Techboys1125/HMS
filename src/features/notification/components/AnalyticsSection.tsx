import { BarChart2, PieChart as PieChartIcon } from "lucide-react";
import { PP, DELIVERY_ANALYTICS } from "../constants/notifications.constants";

export function AnalyticsSection() {
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
        <BarChart2 size={18} style={{ color: "#0D47A1" }} /> Delivery Channel
        Volume & Success Rate
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
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
            <PieChartIcon size={14} style={{ color: "#009688" }} />{" "}
            Notifications Dispatched by Channel
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
                  "conic-gradient(#0D47A1 0% 50%, #009688 50% 80%, #F59E0B 80% 95%, #9C27B0 95% 100%)",
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
                ■ SMS Alerts (50%)
              </span>
              <span style={{ color: "#009688", fontWeight: 600 }}>
                ■ Email (30%)
              </span>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                ■ In-App (15%)
              </span>
              <span style={{ color: "#9C27B0", fontWeight: 600 }}>
                ■ Mobile Push (5%)
              </span>
            </div>
          </div>
        </div>

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
            Channel Delivery Success Rate
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {DELIVERY_ANALYTICS.map((c) => (
              <div key={c.channel}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                >
                  <span>{c.channel}</span>
                  <span style={{ fontWeight: 600 }}>
                    {c.rate}% Delivered
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
                      width: `${c.rate}%`,
                      height: "100%",
                      background: c.color,
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
