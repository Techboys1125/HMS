import { Mail } from "lucide-react";
import type { ReminderConfig } from "../types/notifications.types";
import { PP } from "../constants/notifications.constants";

export interface ReminderConfigSectionProps {
  reminderConfig: ReminderConfig;
  onUpdateReminderConfig: (patch: Partial<ReminderConfig>) => void;
}

export function ReminderConfigSection({
  reminderConfig,
  onUpdateReminderConfig,
}: ReminderConfigSectionProps) {
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
        <Mail size={18} style={{ color: "#0D47A1" }} /> Section 03:
        Automated Lead Time Reminders
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
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
            Appointment Reminder Lead Time
          </label>
          <select
            value={reminderConfig.appointmentReminderTime}
            onChange={(e) =>
              onUpdateReminderConfig({ appointmentReminderTime: e.target.value })
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          >
            <option>24 Hours Before</option>
            <option>12 Hours Before</option>
            <option>6 Hours Before</option>
            <option>2 Hours Before</option>
          </select>
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
            Billing Due Reminder Lead Time
          </label>
          <select
            value={reminderConfig.billingReminderTime}
            onChange={(e) =>
              onUpdateReminderConfig({ billingReminderTime: e.target.value })
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          >
            <option>1 Day</option>
            <option>3 Days</option>
            <option>7 Days</option>
          </select>
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
            Clinical Follow-up Reminder Lead Time
          </label>
          <select
            value={reminderConfig.followupReminderTime}
            onChange={(e) =>
              onUpdateReminderConfig({ followupReminderTime: e.target.value })
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          >
            <option>1 Week</option>
            <option>2 Weeks</option>
            <option>1 Month</option>
          </select>
        </div>
      </div>

      <div
        style={{
          background: "#F8FAFC",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>
            Enable Automated Background Reminder Service
          </div>
          <div style={{ fontSize: "11px", color: "#64748B" }}>
            Triggers cron job for sending automated SMS/Email reminders
          </div>
        </div>
        <input
          type="checkbox"
          checked={reminderConfig.enableAutoReminders}
          onChange={(e) =>
            onUpdateReminderConfig({ enableAutoReminders: e.target.checked })
          }
          style={{
            accentColor: "#0D47A1",
            width: "18px",
            height: "18px",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}
