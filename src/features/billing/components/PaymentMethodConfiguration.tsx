import {
  CreditCard,
  DollarSign,
  QrCode,
  FileText,
  Receipt,
} from "lucide-react";
import { PP } from "../constants/billing.constants";
import type { PaymentMethodItem } from "../types/billing.types";

interface PaymentMethodConfigurationProps {
  paymentMethods: PaymentMethodItem[];
  onTogglePayment: (id: string, field: "enabled" | "isDefault" | "reqRef") => void;
}

const iconMap: Record<string, React.ElementType> = {
  DollarSign,
  QrCode,
  CreditCard,
  FileText,
  Receipt,
};

export function PaymentMethodConfiguration({
  paymentMethods,
  onTogglePayment,
}: PaymentMethodConfigurationProps) {
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
        <CreditCard size={18} style={{ color: "#0D47A1" }} /> Section 03:
        Payment Methods & Gateway Rules
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px",
        }}
      >
        {paymentMethods.map((pm) => {
          const IconC = iconMap[pm.iconName] || CreditCard;
          return (
            <div
              key={pm.id}
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                padding: "14px",
                opacity: pm.enabled ? 1 : 0.5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <IconC size={18} style={{ color: "#0D47A1" }} />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {pm.name}
                  </span>
                </div>
                {pm.isDefault && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      background: "#E3F2FD",
                      color: "#0D47A1",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    Default
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "11px",
                  marginTop: "12px",
                  borderTop: "1px solid #E2E8F0",
                  paddingTop: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#64748B" }}>Enable Payment Method</span>
                  <input
                    type="checkbox"
                    checked={pm.enabled}
                    onChange={() => onTogglePayment(pm.id, "enabled")}
                    style={{ accentColor: "#0D47A1", cursor: "pointer" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#64748B" }}>Set as Default Option</span>
                  <input
                    type="radio"
                    name="defaultPayment"
                    checked={pm.isDefault}
                    onChange={() => onTogglePayment(pm.id, "isDefault")}
                    style={{ accentColor: "#0D47A1", cursor: "pointer" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#64748B" }}>Txn Ref / Cheque No Req.</span>
                  <input
                    type="checkbox"
                    checked={pm.reqRef}
                    onChange={() => onTogglePayment(pm.id, "reqRef")}
                    disabled={!pm.enabled}
                    style={{ accentColor: "#0D47A1", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentMethodConfiguration;
