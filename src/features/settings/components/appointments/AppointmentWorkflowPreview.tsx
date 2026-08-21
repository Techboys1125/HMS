import { Eye } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function AppointmentWorkflowPreview() {
  void RB;
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
        <Eye size={18} style={{ color: "#0D47A1" }} /> Section 08: Configured
        Appointment Lifecycle Flow
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#F8FAFC",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {[
          { step: "1. Patient Booking", sub: "Online / Walk-in" },
          { step: "2. Staff Approval", sub: "Auto / Manual" },
          { step: "3. Token Generated", sub: "Prefix OPD-" },
          { step: "4. Check-In Vitals", sub: "Triage Room" },
          { step: "5. Consultation", sub: "15 Mins Slot" },
          { step: "6. Complete / Bill", sub: "Discharge" },
        ].map((st) => (
          <div
            key={st.step}
            style={{ textAlign: "center", flex: 1, minWidth: "110px" }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#0D47A1",
                background: "#E3F2FD",
                padding: "6px 8px",
                borderRadius: "6px",
                marginBottom: "4px",
              }}
            >
              {st.step}
            </div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>{st.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
