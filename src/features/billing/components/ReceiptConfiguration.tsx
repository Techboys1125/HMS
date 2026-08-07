import { Receipt } from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import type { ReceiptConfiguration as RecConfig } from "../types/billing.types";

interface ReceiptConfigurationProps {
  receiptConfig: RecConfig;
  setReceiptConfig: (updater: (prev: RecConfig) => RecConfig) => void;
}

export function ReceiptConfiguration({
  receiptConfig,
  setReceiptConfig,
}: ReceiptConfigurationProps) {
  const items = [
    { label: "Show Hospital Logo", key: "showLogo" },
    { label: "Show Payment QR", key: "showQrCode" },
    { label: "Show Payment Summary", key: "showPaymentSummary" },
    { label: "Show Tax Breakdown", key: "showTaxDetails" },
    { label: "Show Terms & Notes", key: "showTerms" },
  ];

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
        <Receipt size={18} style={{ color: "#0D47A1" }} /> Section 05:
        Receipt Template Layout & Print Options
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#F8FAFC",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              textAlign: "center",
            }}
          >
            <input
              type="checkbox"
              checked={(receiptConfig as unknown as Record<string, boolean>)[item.key]}
              onChange={(e) =>
                setReceiptConfig((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked,
                }))
              }
              style={{
                accentColor: "#0D47A1",
                marginBottom: "4px",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#111827",
                display: "block",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
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
          Official Receipt Footer Terms & Notes
        </label>
        <textarea
          rows={3}
          value={receiptConfig.footerNotes}
          onChange={(e) =>
            setReceiptConfig((prev) => ({
              ...prev,
              footerNotes: e.target.value,
            }))
          }
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            fontSize: "12px",
            boxSizing: "border-box",
            fontFamily: RB,
          }}
        />
      </div>
    </div>
  );
}

export default ReceiptConfiguration;
