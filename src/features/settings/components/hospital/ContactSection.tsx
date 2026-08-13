import { Phone, Clock } from "lucide-react";
import type { HospitalInformationForm } from "../../types/settings.types";

const PP = "'Poppins', system-ui, sans-serif";

interface ContactSectionProps {
  form: HospitalInformationForm;
  errors: Record<string, string>;
  onChange: (field: string, value: string | boolean | number) => void;
}

export function ContactSection({
  form,
  errors,
  onChange,
}: ContactSectionProps) {
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
        <Phone size={18} style={{ color: "#009688" }} /> Section 02: Hospital
        Contact Information
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
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
            Primary Phone Number *
          </label>
          <input
            type="text"
            value={form.primaryPhone}
            onChange={(e) => onChange("primaryPhone", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: `1px solid ${errors.primaryPhone ? "#EF4444" : "#D1D5DB"}`,
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
          {errors.primaryPhone && (
            <span
              style={{
                fontSize: "11px",
                color: "#EF4444",
                marginTop: "4px",
                display: "block",
              }}
            >
              {errors.primaryPhone}
            </span>
          )}
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
            Secondary Phone Number
          </label>
          <input
            type="text"
            value={form.secondaryPhone}
            onChange={(e) => onChange("secondaryPhone", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
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
            Emergency Contact Hotline (24/7)
          </label>
          <input
            type="text"
            value={form.emergencyPhone}
            onChange={(e) => onChange("emergencyPhone", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
              color: "#EF4444",
              fontWeight: 600,
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
            Official Email Address *
          </label>
          <input
            type="email"
            value={form.officialEmail}
            onChange={(e) => onChange("officialEmail", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: `1px solid ${errors.officialEmail ? "#EF4444" : "#D1D5DB"}`,
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
          {errors.officialEmail && (
            <span
              style={{
                fontSize: "11px",
                color: "#EF4444",
                marginTop: "4px",
                display: "block",
              }}
            >
              {errors.officialEmail}
            </span>
          )}
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
            Official Website URL
          </label>
          <input
            type="text"
            value={form.website}
            onChange={(e) => onChange("website", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: `1px solid ${errors.website ? "#EF4444" : "#D1D5DB"}`,
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
          {errors.website && (
            <span
              style={{
                fontSize: "11px",
                color: "#EF4444",
                marginTop: "4px",
                display: "block",
              }}
            >
              {errors.website}
            </span>
          )}
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
            Support / Helpdesk Email
          </label>
          <input
            type="email"
            value={form.supportEmail}
            onChange={(e) => onChange("supportEmail", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "60%",
          }}
        >
          <Clock size={16} style={{ color: "#64748B" }} />
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              OPD & General Working Hours
            </label>
            <input
              type="text"
              value={form.workingHours}
              onChange={(e) => onChange("workingHours", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#F8FAFC",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #E2E8F0",
          }}
        >
          <input
            type="checkbox"
            id="is24x7"
            checked={form.is24x7}
            onChange={(e) => onChange("is24x7", e.target.checked)}
            style={{
              accentColor: "#009688",
              width: "16px",
              height: "16px",
              cursor: "pointer",
            }}
          />
          <div>
            <label
              htmlFor="is24x7"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#111827",
                cursor: "pointer",
                display: "block",
              }}
            >
              24x7 Emergency & Trauma Care Unit
            </label>
            <span style={{ fontSize: "11px", color: "#64748B" }}>
              Badge display on all print headers & portals
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
