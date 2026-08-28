import { FileText, Percent } from "lucide-react";
import { PP } from "../constants/billing.constants";
import type {
  InvoiceConfiguration as InvConfig,
  TaxConfiguration as TaxConfig,
} from "../types/billing.types";

interface InvoiceConfigurationProps {
  invoiceConfig: InvConfig;
  setInvoiceConfig: (updater: (prev: InvConfig) => InvConfig) => void;
  taxConfig: TaxConfig;
  setTaxConfig: (updater: (prev: TaxConfig) => TaxConfig) => void;
}

export function InvoiceConfiguration({
  invoiceConfig,
  setInvoiceConfig,
  taxConfig,
  setTaxConfig,
}: InvoiceConfigurationProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* SECTION 01: INVOICE CONFIGURATION */}
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
          <FileText size={18} style={{ color: "#0D47A1" }} /> Section 01:
          Invoice Series & Numbering Rules
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
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
              Invoice Prefix
              <input
                aria-label="Input field"
                type="text"
                value={invoiceConfig.prefix}
                onChange={(e) =>
                  setInvoiceConfig((prev) => ({
                    ...prev,
                    prefix: e.target.value,
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
              Starting Invoice Number
              <input
                aria-label="Input field"
                type="number"
                value={invoiceConfig.startingNumber}
                onChange={(e) =>
                  setInvoiceConfig((prev) => ({
                    ...prev,
                    startingNumber: e.currentTarget.valueAsNumber || 1001,
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
              Live Format Preview
            </span>
            <div
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                fontSize: "13px",
                fontWeight: 700,
                color: "#0D47A1",
                boxSizing: "border-box",
              }}
            >
              {invoiceConfig.prefix}
              {invoiceConfig.startingNumber}
            </div>
          </div>
        </div>

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
              padding: "12px 14px",
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
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Auto-Generate Invoice Number
              </div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                System automatically increments number on bill creation
              </div>
            </div>
            <input
              aria-label="Toggle option"
              type="checkbox"
              checked={invoiceConfig.autoGenerate}
              onChange={(e) =>
                setInvoiceConfig((prev) => ({
                  ...prev,
                  autoGenerate: e.target.checked,
                }))
              }
              style={{
                accentColor: "#0D47A1",
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
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
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Allow Manual Invoice Number Entry
              </div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                Permit authorized accountants to override invoice sequence
              </div>
            </div>
            <input
              aria-label="Toggle option"
              type="checkbox"
              checked={invoiceConfig.allowManual}
              onChange={(e) =>
                setInvoiceConfig((prev) => ({
                  ...prev,
                  allowManual: e.target.checked,
                }))
              }
              style={{
                accentColor: "#0D47A1",
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 02: TAX CONFIGURATION */}
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
          <Percent size={18} style={{ color: "#009688" }} /> Section 02: Tax &
          Compliance Settings
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
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
              Official Tax Label Name
              <input
                aria-label="Input field"
                type="text"
                value={taxConfig.taxName}
                onChange={(e) =>
                  setTaxConfig((prev) => ({ ...prev, taxName: e.target.value }))
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
              Default Tax Percentage (%)
              <input
                aria-label="Input field"
                type="number"
                value={taxConfig.defaultPercentage}
                onChange={(e) =>
                  setTaxConfig((prev) => ({
                    ...prev,
                    defaultPercentage: parseFloat(e.target.value) || 0,
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
              Apply Tax To Scope
              <select
                aria-label="Select option"
                value={taxConfig.applyTaxTo}
                onChange={(e) =>
                  setTaxConfig((prev) => ({
                    ...prev,
                    applyTaxTo: e.target.value,
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
              >
                <option>All Services</option>
                <option>Consultation & OPD</option>
                <option>Registration & Badges</option>
                <option>Diagnostic & Lab Services</option>
                <option>Pharmacy Products</option>
              </select>
            </span>
          </div>
        </div>

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
              padding: "12px 14px",
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
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Enable Automated Tax Calculation
              </div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                Apply tax rate automatically during invoice generation
              </div>
            </div>
            <input
              aria-label="Toggle option"
              type="checkbox"
              checked={taxConfig.enableTax}
              onChange={(e) =>
                setTaxConfig((prev) => ({
                  ...prev,
                  enableTax: e.target.checked,
                }))
              }
              style={{
                accentColor: "#009688",
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
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
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Show Tax Breakdown on Receipt
              </div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                Display CGST/SGST itemized breakdown on invoice print
              </div>
            </div>
            <input
              aria-label="Toggle option"
              type="checkbox"
              checked={taxConfig.showBreakdown}
              onChange={(e) =>
                setTaxConfig((prev) => ({
                  ...prev,
                  showBreakdown: e.target.checked,
                }))
              }
              style={{
                accentColor: "#009688",
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
