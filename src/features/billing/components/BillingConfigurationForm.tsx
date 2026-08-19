import { useState } from "react";
import {
  CreditCard,
  Percent,
  Receipt,
  FileText,
  Save,
  RotateCcw,
  Eye,
} from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import type { BillingConfiguration } from "../types/billing.types";
import { InvoiceConfiguration } from "./InvoiceConfiguration";
import { PaymentMethodConfiguration } from "./PaymentMethodConfiguration";
import { DiscountConfiguration } from "./DiscountConfiguration";
import { ReceiptConfiguration } from "./ReceiptConfiguration";
import { BillingRuleConfiguration } from "./BillingRuleConfiguration";

interface BillingConfigurationFormProps {
  initialConfig: BillingConfiguration;
  onSave: (config: BillingConfiguration) => void;
  onReset?: () => void;
}

export function BillingConfigurationForm({
  initialConfig,
  onSave,
  onReset,
}: BillingConfigurationFormProps) {
  // Section 01: Invoice Configuration
  const [invoiceConfig, setInvoiceConfig] = useState(initialConfig.invoice);

  // Section 02: Tax Configuration
  const [taxConfig, setTaxConfig] = useState(initialConfig.tax);

  // Section 03: Payment Methods Configuration
  const [paymentMethods, setPaymentMethods] = useState(
    initialConfig.paymentMethods,
  );

  // Section 04: Discount Configuration
  const [discountConfig, setDiscountConfig] = useState(initialConfig.discount);

  // Section 05: Receipt & Print Configuration
  const [receiptConfig, setReceiptConfig] = useState(initialConfig.receipt);

  // Section 06: Billing Rules
  const [billingRules, setBillingRules] = useState(initialConfig.rules);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleTogglePayment = (
    id: string,
    field: "enabled" | "isDefault" | "reqRef",
  ) => {
    setPaymentMethods((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (field === "isDefault") {
            return { ...p, isDefault: true };
          }
          return { ...p, [field]: !p[field] };
        }
        if (field === "isDefault") {
          return { ...p, isDefault: false };
        }
        return p;
      }),
    );
  };

  const handleSave = () => {
    const updatedConfig: BillingConfiguration = {
      invoice: invoiceConfig,
      tax: taxConfig,
      paymentMethods: paymentMethods,
      discount: discountConfig,
      receipt: receiptConfig,
      rules: billingRules,
    };
    onSave(updatedConfig);
    setSaveToast("Billing & Financial Configuration saved successfully!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleResetForm = () => {
    if (onReset) {
      onReset();
    } else {
      setInvoiceConfig(initialConfig.invoice);
      setTaxConfig(initialConfig.tax);
      setPaymentMethods(initialConfig.paymentMethods);
      setDiscountConfig(initialConfig.discount);
      setReceiptConfig(initialConfig.receipt);
      setBillingRules(initialConfig.rules);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
      }}
    >
      {/* SUB-HEADER ACTION BAR */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: PP,
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Billing & Financial Configuration
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#64748B",
              margin: "2px 0 0 0",
              fontFamily: RB,
            }}
          >
            Configure invoice numbering rules, payment channels, taxation,
            discounts, receipt templates, and financial policies.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setShowInvoiceModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              color: "#0D47A1",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Eye size={14} /> Preview Invoice
          </button>
          <button
            onClick={handleResetForm}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              color: "#64748B",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: "#0D47A1",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
            }}
          >
            <Save size={14} /> Save Configuration
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS (4 CARDS) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
            >
              Invoice Series
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#E3F2FD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={18} style={{ color: "#0D47A1" }} />
            </div>
          </div>
          <div
            style={{
              fontFamily: PP,
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {invoiceConfig.prefix}
            {invoiceConfig.startingNumber}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              Auto-Incremental
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#2E7D32",
                background: "#E8F5E9",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              Active
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
            >
              Payment Methods
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#E0F2F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CreditCard size={18} style={{ color: "#009688" }} />
            </div>
          </div>
          <div
            style={{
              fontFamily: PP,
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {paymentMethods.filter((p) => p.enabled).length} Active
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              Cash, UPI, Cards, TPA
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#009688",
                background: "#E0F2F1",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              Enabled
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
            >
              Tax Rules
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#E8F5E9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Percent size={18} style={{ color: "#2E7D32" }} />
            </div>
          </div>
          <div
            style={{
              fontFamily: PP,
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {taxConfig.defaultPercentage}% GST
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              All Services
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#2E7D32",
                background: "#E8F5E9",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              Configured
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
            >
              Receipt Template
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Receipt size={18} style={{ color: "#B45309" }} />
            </div>
          </div>
          <div
            style={{
              fontFamily: PP,
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Standard
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              With QR & Tax
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#B45309",
                background: "#FEF3C7",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              Ready
            </span>
          </div>
        </div>
      </div>

      {/* RENDER FORMS */}
      <InvoiceConfiguration
        invoiceConfig={invoiceConfig}
        setInvoiceConfig={setInvoiceConfig}
        taxConfig={taxConfig}
        setTaxConfig={setTaxConfig}
      />

      <PaymentMethodConfiguration
        paymentMethods={paymentMethods}
        onTogglePayment={handleTogglePayment}
      />

      <DiscountConfiguration
        discountConfig={discountConfig}
        setDiscountConfig={setDiscountConfig}
      />

      <ReceiptConfiguration
        receiptConfig={receiptConfig}
        setReceiptConfig={setReceiptConfig}
      />

      <BillingRuleConfiguration
        billingRules={billingRules}
        setBillingRules={setBillingRules}
      />

      {/* SAVE TOAST */}
      {saveToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#2E7D32",
            color: "#FFFFFF",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          {saveToast}
        </div>
      )}

      {/* PREVIEW INVOICE MODAL SIMULATOR */}
      {showInvoiceModal && (
        <div
          onClick={() => setShowInvoiceModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              width: "480px",
              padding: "24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          >
            <h4
              style={{ fontFamily: PP, margin: "0 0 16px 0", fontSize: "16px" }}
            >
              Invoice Layout Preview
            </h4>
            <div
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "16px",
                background: "#F8FAFC",
                fontSize: "12px",
                fontFamily: RB,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <strong>[Hospital Name]</strong>
                  <div style={{ fontSize: "10px", color: "#64748B" }}>
                    OPD Receipt
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>
                    {invoiceConfig.prefix}
                    {invoiceConfig.startingNumber}
                  </strong>
                  <div style={{ fontSize: "10px", color: "#64748B" }}>
                    Date: N/A
                  </div>
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px solid #E2E8F0",
                  paddingTop: "12px",
                  marginBottom: "12px",
                }}
              >
                <div>Patient: [Patient Name]</div>
                <div>MRN: [MRN]</div>
              </div>
              <table
                style={{ width: "100%", textAlign: "left", fontSize: "11px" }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #CBD5E1" }}>
                    <th>Service</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>OPD Consultation</td>
                    <td style={{ textAlign: "right" }}>₹1,000</td>
                  </tr>
                  {taxConfig.enableTax && (
                    <tr>
                      <td>
                        {taxConfig.taxName} ({taxConfig.defaultPercentage}%)
                      </td>
                      <td style={{ textAlign: "right" }}>
                        ₹{1000 * (taxConfig.defaultPercentage / 100)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div
                style={{
                  borderTop: "1px dashed #CBD5E1",
                  marginTop: "12px",
                  paddingTop: "12px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                Grand Total: ₹
                {1000 +
                  (taxConfig.enableTax
                    ? 1000 * (taxConfig.defaultPercentage / 100)
                    : 0)}
              </div>
            </div>
            <button
              onClick={() => setShowInvoiceModal(false)}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "10px",
                border: "none",
                background: "#0D47A1",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingConfigurationForm;
