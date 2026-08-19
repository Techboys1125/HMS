import { useState } from "react";
import { Sliders } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function QueueTokenSettings() {
  void RB;
  const [queueConfig, setQueueConfig] = useState({
    enableTokenSystem: true,
    autoTokenGen: true,
    queueDisplayEnabled: true,
    tokenPrefix: "OPD-",
    startTokenNo: 101,
    maxQueueSize: 200,
    queueResetTime: "00:00 AM",
  });

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
          fontSize: "15px",
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Sliders size={18} style={{ color: "#009688" }} /> Section 04: Queue
        & OPD Token Sequence Settings
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {[
          {
            label: "Enable Token System",
            sub: "Generate sequential OPD tokens",
            key: "enableTokenSystem",
          },
          {
            label: "Auto Token Generation",
            sub: "Auto assign upon check-in",
            key: "autoTokenGen",
          },
          {
            label: "Queue Display Enabled",
            sub: "Stream to waiting room TVs",
            key: "queueDisplayEnabled",
          },
        ].map((item) => (
          <div
            key={item.key}
            style={{
              background: "#F8FAFC",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "10px", color: "#64748B" }}>
                {item.sub}
              </div>
            </div>
            <input
              type="checkbox"
              checked={
                (queueConfig as unknown as Record<string, boolean>)[item.key]
              }
              onChange={(e) =>
                setQueueConfig((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked,
                }))
              }
              style={{
                accentColor: "#009688",
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Token Prefix
          </label>
          <input
            type="text"
            value={queueConfig.tokenPrefix}
            onChange={(e) =>
              setQueueConfig((prev) => ({
                ...prev,
                tokenPrefix: e.target.value,
              }))
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Starting Token No.
          </label>
          <input
            type="number"
            value={queueConfig.startTokenNo}
            onChange={(e) =>
              setQueueConfig((prev) => ({
                ...prev,
                startTokenNo: e.currentTarget.valueAsNumber || 101,
              }))
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Max Daily Queue Cap
          </label>
          <input
            type="number"
            value={queueConfig.maxQueueSize}
            onChange={(e) =>
              setQueueConfig((prev) => ({
                ...prev,
                maxQueueSize: e.currentTarget.valueAsNumber || 200,
              }))
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Daily Queue Reset Time
          </label>
          <input
            type="text"
            value={queueConfig.queueResetTime}
            onChange={(e) =>
              setQueueConfig((prev) => ({
                ...prev,
                queueResetTime: e.target.value,
              }))
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
    </div>
  );
}
