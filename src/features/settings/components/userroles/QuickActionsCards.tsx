import { useState } from "react";
import { Plus, Grid, Copy, Download, ChevronRight } from "lucide-react";
import { CreateRoleModal } from "./CreateRoleModal";

export function QuickActionsCards() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {[
          {
            title: "Create New Role",
            desc: "Define new privilege level & scope",
            icon: Plus,
            action: () => setIsCreateModalOpen(true),
          },
          {
            title: "Permission Matrix",
            desc: "Inspect grid-wide access levels",
            icon: Grid,
            action: () => {},
          },
          {
            title: "Clone Role",
            desc: "Duplicate existing role permissions",
            icon: Copy,
            action: () => {},
          },
          {
            title: "Export Config",
            desc: "Download role rules in JSON/CSV",
            icon: Download,
            action: () => {},
          },
        ].map((qa) => {
          const IconC = qa.icon;
          return (
            <div
              key={qa.title}
              onClick={qa.action}
              style={{
                background: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                padding: "14px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "#F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconC size={18} style={{ color: "#0D47A1" }} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {qa.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748B" }}>
                    {qa.desc}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "#94A3B8" }} />
            </div>
          );
        })}
      </div>

      {isCreateModalOpen && (
        <CreateRoleModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
