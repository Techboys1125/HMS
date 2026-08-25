import { Printer } from "lucide-react";
import type {
  HospitalInformationForm,
  PrintHeaderPreview,
} from "../../types/settings.types";

const PP = "'Poppins', system-ui, sans-serif";

interface PrintHeaderPreviewModalProps {
  open: boolean;
  onClose: () => void;
  form: HospitalInformationForm;
  printHeader: PrintHeaderPreview | null;
}

export function PrintHeaderPreviewModal({
  open,
  onClose,
  form,
  printHeader,
}: PrintHeaderPreviewModalProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          maxWidth: "700px",
          width: "100%",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            borderBottom: "1px solid #E5E7EB",
            paddingBottom: "12px",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "16px",
              fontWeight: 700,
              margin: 0,
              color: "#111827",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Printer size={18} style={{ color: "#0D47A1" }} /> Official Print
            Header Template Preview
          </h3>
          <button aria-label="Close"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
              color: "#64748B",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            background: "#F8FAFC",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "2px solid #0D47A1",
              paddingBottom: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: PP,
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0D47A1",
                }}
              >
                {printHeader?.hospitalName ?? form.hospitalName}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#009688",
                  fontWeight: 600,
                }}
              >
                {printHeader?.tagline ?? form.hospitalTagline}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#64748B",
                  marginTop: "4px",
                }}
              >
                Reg:{" "}
                {printHeader?.registrationNumber ?? form.registrationNumber} |
                License: {printHeader?.licenseNumber ?? form.licenseNumber}
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: "11px",
                color: "#475569",
              }}
            >
              <div>{printHeader?.address ?? form.addressLine1}</div>
              <div>
                {printHeader?.phone ?? form.primaryPhone} |{" "}
                {printHeader?.email ?? form.officialEmail}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: "#94A3B8",
              fontSize: "13px",
              fontStyle: "italic",
            }}
          >
            [ Sample Medical Document / Invoice Content Area ]
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifySelf: "flex-end",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#0D47A1",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Printer size={14} /> Print Sample
          </button>
        </div>
      </div>
    </div>
  );
}
