import { AlertCircle, Check } from "lucide-react";

interface FeedbackToastsProps {
  success: string | null;
  error: string | null;
}

export function FeedbackToasts({ success, error }: FeedbackToastsProps) {
  return (
    <>
      {/* SAVE TOAST NOTIFICATION */}
      {success && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            background: "#2E7D32",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 90,
          }}
        >
          <Check size={16} /> {success}
        </div>
      )}

      {/* ERROR TOAST NOTIFICATION */}
      {error && (
        <div
          style={{
            position: "fixed",
            bottom: "128px",
            right: "24px",
            background: "#C62828",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 90,
          }}
        >
          <AlertCircle size={16} /> {error}
        </div>
      )}
    </>
  );
}
