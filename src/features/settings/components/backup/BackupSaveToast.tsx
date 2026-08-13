import { Check } from "lucide-react";

interface BackupSaveToastProps {
  message: string | null;
}

export function BackupSaveToast({ message }: BackupSaveToastProps) {
  if (!message) return null;
  return (
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
      <Check size={16} /> {message}
    </div>
  );
}
