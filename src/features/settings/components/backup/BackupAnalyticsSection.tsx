import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";

export function BackupAnalyticsSection() {
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
        <BarChart2 size={18} style={{ color: "#0D47A1" }} /> Backup Performance
        & Health Metrics
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
            <PieChartIcon size={14} style={{ color: "#009688" }} /> Storage
            Distribution
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
                  "conic-gradient(#0D47A1 0% 50%, #009688 50% 85%, #F59E0B 85% 100%)",
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
                ■ Postgres DB (50%)
              </span>
              <span style={{ color: "#009688", fontWeight: 600 }}>
                ■ DICOM Scans (35%)
              </span>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                ■ Logs & PDFs (15%)
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
            Daily Backup Duration (Last 5 Days)
          </h4>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "12px",
              height: "110px",
              paddingTop: "10px",
            }}
          >
            {[
              { day: "22 Jul", min: "3.5m" },
              { day: "23 Jul", min: "3.7m" },
              { day: "24 Jul", min: "3.6m" },
              { day: "25 Jul", min: "3.7m" },
              { day: "26 Jul", min: "3.8m" },
            ].map((bar) => (
              <div key={bar.day} style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{
                    width: "100%",
                    background: "#0D47A1",
                    height: "60px",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    color: "#64748B",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
