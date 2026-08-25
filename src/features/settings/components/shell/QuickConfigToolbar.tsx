import type { LucideIcon } from "lucide-react";

interface QuickConfigItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: string;
}

interface QuickConfigToolbarProps {
  items: QuickConfigItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function QuickConfigToolbar({
  items,
  activeId,
  onSelect,
}: QuickConfigToolbarProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        padding: "12px 24px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {items.map((item) => {
          const IconComp = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: isActive ? "1px solid #0D47A1" : "1px solid #E5E7EB",
                background: isActive ? "#E3F2FD" : "#F8FAFC",
                color: isActive ? "#0D47A1" : "#475569",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                transition:
                  "background-color 0.15s ease, border-color 0.15s ease",
                whiteSpace: "nowrap",
                boxShadow: isActive ? "0 1px 2px rgba(13,71,161,0.1)" : "none",
              }}
            >
              <IconComp
                size={13}
                style={{ color: isActive ? "#0D47A1" : "#64748B" }}
              />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
