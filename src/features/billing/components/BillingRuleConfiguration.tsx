import { FileText } from "lucide-react";
import { PP } from "../constants/billing.constants";
import type { BillingRuleConfiguration as RuleConfig } from "../types/billing.types";

interface BillingRuleConfigurationProps {
  billingRules: RuleConfig;
  setBillingRules: (updater: (prev: RuleConfig) => RuleConfig) => void;
}

const RULE_CONFIG_ITEMS = [
  { label: "Allow Partial Payments", key: "allowPartial" },
  { label: "Allow Advance Deposit", key: "allowAdvance" },
  { label: "Allow Refund Requests", key: "allowRefunds" },
  { label: "Allow Bill Cancellation", key: "allowCancellation" },
];

export function BillingRuleConfiguration({
  billingRules,
  setBillingRules,
}: BillingRuleConfigurationProps) {
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
        <FileText size={18} style={{ color: "#009688" }} /> Section 06: General
        Financial & Credit Rules
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {RULE_CONFIG_ITEMS.map((item) => (
          <div
            key={item.key}
            style={{
              background: "#F8FAFC",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              {item.label}
            </span>
            <input aria-label="Toggle option"
              type="checkbox"
              checked={
                (billingRules as unknown as Record<string, boolean>)[item.key]
              }
              onChange={(e) =>
                setBillingRules((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked,
                }))
              }
              style={{ accentColor: "#009688", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>

      <div style={{ width: "50%" }}>
        <span
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          Grace Period for Pending Payments (Days)
        
        <input aria-label="Input field"
          type="number"
          value={billingRules.gracePeriodDays}
          onChange={(e) =>
            setBillingRules((prev) => ({
              ...prev,
              gracePeriodDays: e.currentTarget.valueAsNumber || 0,
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
        /></span>
      </div>
    </div>
  );
}

export default BillingRuleConfiguration;
