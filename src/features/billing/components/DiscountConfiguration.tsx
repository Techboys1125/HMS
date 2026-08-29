import { Percent } from "lucide-react";
import { PP } from "../constants/billing.constants";
import type { DiscountConfiguration as DiscConfig } from "../types/billing.types";

interface DiscountConfigurationProps {
  discountConfig: DiscConfig;
  setDiscountConfig: (updater: (prev: DiscConfig) => DiscConfig) => void;
}

export function DiscountConfiguration({
  discountConfig,
  setDiscountConfig,
}: DiscountConfigurationProps) {
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
        <Percent size={18} style={{ color: "#009688" }} /> Section 04:
        Concession & Discount Policies
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Maximum Concession Cap (%)
            <input
              aria-label="Input field"
              type="number"
              value={discountConfig.maxDiscountPct}
              onChange={(e) =>
                setDiscountConfig((prev) => ({
                  ...prev,
                  maxDiscountPct: parseFloat(e.target.value) || 0,
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
          </span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Authorized Approval Roles
            <input
              aria-label="Input field"
              type="text"
              value={discountConfig.authorizedRoles}
              onChange={(e) =>
                setDiscountConfig((prev) => ({
                  ...prev,
                  authorizedRoles: e.target.value,
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
          </span>
        </div>

        <div
          style={{
            background: "#F8FAFC",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "fit-content",
            marginTop: "18px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Approval Workflow Required
            </div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>
              Require admin sign-off above 10% discount
            </div>
          </div>
          <input
            aria-label="Toggle option"
            type="checkbox"
            checked={discountConfig.approvalRequired}
            onChange={(e) =>
              setDiscountConfig((prev) => ({
                ...prev,
                approvalRequired: e.target.checked,
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
      </div>
    </div>
  );
}
