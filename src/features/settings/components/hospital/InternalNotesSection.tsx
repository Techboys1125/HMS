import { Sparkles } from "lucide-react";
import type { HospitalInformationForm } from "../../types/settings.types";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface InternalNotesSectionProps {
  form: HospitalInformationForm;
  onChange: (field: string, value: string | boolean | number) => void;
}

export function InternalNotesSection({
  form,
  onChange,
}: InternalNotesSectionProps) {
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
          margin: "0 0 12px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Sparkles size={18} style={{ color: "#0D47A1" }} /> Section 07: Internal
        Administrative Notes
      </h3>
      <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 10px 0" }}>
        Internal notes regarding accreditation, licensing renewals, and master
        facility guidelines. Visible only to Super Admins and Hospital Admins.
      </p>
      <textarea aria-label="Text input"
        rows={4}
        value={form.internalNotes}
        onChange={(e) => onChange("internalNotes", e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #D1D5DB",
          fontSize: "13px",
          boxSizing: "border-box",
          fontFamily: RB,
        }}
      />
    </div>
  );
}
