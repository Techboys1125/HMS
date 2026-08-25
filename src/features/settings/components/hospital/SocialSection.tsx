import { Share2 } from "lucide-react";
import type { HospitalInformationForm } from "../../types/settings.types";

const PP = "'Poppins', system-ui, sans-serif";

interface SocialSectionProps {
  form: HospitalInformationForm;
  errors: Record<string, string>;
  onChange: (field: string, value: string | boolean | number) => void;
}

export function SocialSection({ form, onChange }: SocialSectionProps) {
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
        <Share2 size={18} style={{ color: "#009688" }} /> Section 06: Hospital
        Social & Communication Channels
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
            Official WhatsApp Business Number
          
          <input aria-label="Input field"
            type="text"
            value={form.whatsapp}
            onChange={(e) => onChange("whatsapp", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
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
            Facebook Page URL
          
          <input aria-label="Input field"
            type="text"
            value={form.facebook}
            onChange={(e) => onChange("facebook", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
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
            LinkedIn Organization Page
          
          <input aria-label="Input field"
            type="text"
            value={form.linkedin}
            onChange={(e) => onChange("linkedin", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
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
            Instagram Profile
          
          <input aria-label="Input field"
            type="text"
            value={form.instagram}
            onChange={(e) => onChange("instagram", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
        </div>
      </div>
    </div>
  );
}
