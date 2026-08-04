import { useState } from "react";
import type { NavId, Role } from "../../types/app.types";
import { ROLE_LABEL, ROLE_NAV_GROUPS, PP, RB } from "../../constants/navigation";
import { usePermissions } from "../../permissions";

const navItemPermissions: Record<string, string> = {
  dashboard: "DASHBOARD_VIEW",
  patients: "PATIENT_VIEW",
  doctors: "DOCTOR_VIEW",
  appointments: "APPOINTMENT_VIEW",
  reception: "QUEUE_VIEW",
  checkin: "QUEUE_VIEW",
  consultation: "OPD_VIEW",
  vitals: "VITALS_CREATE",
  prescriptions: "PRESCRIPTION_VIEW",
  billing: "BILLING_VIEW",
  reports: "REPORT_VIEW",
  "hospital-management": "DASHBOARD_VIEW",
  "user-management": "USER_VIEW",
  "audit-logs": "USER_VIEW",
  "family-members": "FAMILY_MEMBER_VIEW",
  "queue-status": "QUEUE_VIEW",
  notifications: "NOTIFICATION_VIEW",
  settings: "DASHBOARD_VIEW",
  profile: "PROFILE_VIEW",
  "medical-history": "MEDICAL_HISTORY_VIEW",
  "bills-payments": "BILLING_VIEW",
};

export function NavRail({
  active,
  onSelect,
  role,
  theme = "light",
  onThemeToggle,
}: {
  active: NavId;
  onSelect: (id: NavId) => void;
  role: Role;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { can } = usePermissions();
  const dk = theme === "dark";

  const bg = dk ? "#0F172A" : "#FFFFFF";
  const border = dk ? "#1E293B" : "#E5E7EB";
  const textSec = dk ? "#94A3B8" : "#64748B";
  const groupLbl = dk ? "#475569" : "#94A3B8";
  const hoverBg = dk ? "rgba(255,255,255,0.06)" : "#F8FAFC";
  const hoverText = dk ? "#F1F5F9" : "#111827";
  const activeBg = "#0D47A1";
  const activeText = "#FFFFFF";
  const divider = dk ? "#1E293B" : "#E5E7EB";
  const rolePill = dk ? "rgba(13,71,161,0.35)" : "rgba(219,234,254,0.9)";
  const roleTxt = dk ? "#93C5FD" : "#0D47A1";
  const themeBtnBg = dk ? "rgba(255,255,255,0.08)" : "#F1F5F9";

  const navGroups = (ROLE_NAV_GROUPS[role] || []).map((group) => {
    const filteredItems = group.items.filter((item) => {
      const required = navItemPermissions[item.id];
      if (!required) return true;
      return can(required);
    });
    return {
      ...group,
      items: filteredItems,
    };
  }).filter((group) => group.items.length > 0);

  return (
    <nav
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="relative flex flex-col shrink-0 z-20 overflow-hidden"
      style={{
        width: expanded ? 260 : 72,
        transition: "width 240ms cubic-bezier(0.4,0,0.2,1)",
        background: bg,
        borderRight: `1px solid ${border}`,
      }}
    >
      <div
        className="shrink-0 overflow-hidden"
        style={{
          padding: expanded ? "14px 16px" : "14px 12px",
          minHeight: 64,
          borderBottom: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="w-full">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: rolePill,
              justifyContent: expanded ? "flex-start" : "center",
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 animate-pulse"
              style={{ background: roleTxt }}
            />
            <span
              className="text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-200"
              style={{
                fontFamily: PP,
                color: roleTxt,
                opacity: expanded ? 1 : 0,
                width: expanded ? "auto" : 0,
              }}
            >
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2">
        {navGroups.map((group, gi) => (
          <div key={group.id} className={gi > 0 ? "mt-1" : ""}>
            <div
              className="overflow-hidden"
              style={{
                maxHeight: expanded ? 28 : 0,
                opacity: expanded ? 1 : 0,
                transition: "max-height 200ms ease, opacity 160ms",
              }}
            >
              <div className="px-3 pt-2 pb-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ fontFamily: PP, color: groupLbl }}
                >
                  {group.label}
                </span>
              </div>
            </div>

            {group.items.map(({ id, Icon, label, badge }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  title={!expanded ? label : undefined}
                  className="relative flex items-center rounded-xl w-full transition-all duration-150 mb-0.5 group/navitem"
                  style={{
                    gap: expanded ? 10 : 0,
                    padding: expanded ? "9px 12px" : "9px 0",
                    justifyContent: expanded ? "flex-start" : "center",
                    background: isActive ? activeBg : "transparent",
                    color: isActive ? activeText : textSec,
                    boxShadow: isActive
                      ? "0 1px 4px rgba(13,71,161,0.25)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color =
                        hoverText;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        textSec;
                    }
                  }}
                >
                  {isActive && !expanded && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                  )}

                  <div className="relative shrink-0 flex items-center justify-center w-8 h-8">
                    <Icon size={18} />
                    {!!badge && !expanded && (
                      <span
                        className="absolute top-0 right-0 w-[14px] h-[14px] bg-[#EF4444] text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none"
                        style={{ fontFamily: PP }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>

                  {expanded && (
                    <span
                      className="text-[13px] font-medium whitespace-nowrap flex-1 text-left truncate"
                      style={{ fontFamily: RB }}
                    >
                      {label}
                    </span>
                  )}

                  {!!badge && expanded && (
                    <span
                      className="shrink-0 min-w-[18px] h-[18px] bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none"
                      style={{ fontFamily: PP }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}

            {gi < navGroups.length - 1 && (
              <div
                className="my-2 mx-1"
                style={{ borderBottom: `1px solid ${divider}` }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className="shrink-0 p-3"
        style={{ borderTop: `1px solid ${border}` }}
      >
        <button
          onClick={onThemeToggle}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-left"
          style={{
            background: themeBtnBg,
            color: textSec,
            fontFamily: RB,
            fontSize: 11,
            justifyContent: expanded ? "flex-start" : "center",
          }}
          title={dk ? "Switch to Light" : "Switch to Dark"}
        >
          {dk ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {expanded && <span>{dk ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </div>
    </nav>
  );
}
