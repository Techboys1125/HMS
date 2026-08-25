import { X } from "lucide-react";
import type { NotificationSettings } from "../types/notifications.types";
import { PP } from "../constants/notifications.constants";

export interface NotificationSettingsDrawerProps {
  open: boolean;
  currentRole: string;
  settings: NotificationSettings;
  updateSetting: (key: keyof NotificationSettings, value: boolean) => void;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
}

export function NotificationSettingsDrawer({
  open,
  currentRole,
  settings,
  updateSetting,
  onClose,
  onSave,
  saving,
}: NotificationSettingsDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between h-full transition-transform duration-200">
        <div>
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-5">
            <div>
              <h3
                style={{ fontFamily: PP }}
                className="text-lg font-bold text-[#111827]"
              >
                Notification Settings
              </h3>
              <p className="text-xs text-[#64748B]">
                Configure channel preferences and module alert triggers for{" "}
                {currentRole}.
              </p>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="rounded-lg p-1 text-[#64748B] hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <h4
              style={{ fontFamily: PP }}
              className="font-semibold text-[#0D47A1] uppercase tracking-wider text-[11px]"
            >
              Module Alerts
            </h4>

            <div className="flex items-center justify-between">
              <span>Appointment Notifications</span>
              <input
                aria-label="Toggle option"
                type="checkbox"
                checked={settings.appointmentNotifs}
                onChange={(e) =>
                  updateSetting("appointmentNotifs", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Patient Registration & Records</span>
              <input
                aria-label="Toggle option"
                type="checkbox"
                checked={settings.patientNotifs}
                onChange={(e) =>
                  updateSetting("patientNotifs", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Billing & Payments Alerts</span>
              <input
                aria-label="Toggle option"
                type="checkbox"
                checked={settings.billingNotifs}
                onChange={(e) =>
                  updateSetting("billingNotifs", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Reports & Analytics</span>
              <input
                aria-label="Toggle option"
                type="checkbox"
                checked={settings.reportsNotifs}
                onChange={(e) =>
                  updateSetting("reportsNotifs", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Security & Audit Alerts</span>
              <input
                aria-label="Toggle option"
                type="checkbox"
                checked={settings.securityAlerts}
                onChange={(e) =>
                  updateSetting("securityAlerts", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
            </div>

            <hr className="border-[#E5E7EB]" />

            <h4
              style={{ fontFamily: PP }}
              className="font-semibold text-[#0D47A1] uppercase tracking-wider text-[11px]"
            >
              Channels & Audio
            </h4>

            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input
                aria-label="Toggle option"
                type="checkbox"
                checked={settings.emailNotifs}
                onChange={(e) => updateSetting("emailNotifs", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <input
                aria-label="Toggle option"
                type="checkbox"
                checked={settings.pushNotifs}
                onChange={(e) => updateSetting("pushNotifs", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Sound Alerts</span>
              <input
                aria-label="Toggle option"
                type="checkbox"
                checked={settings.soundAlerts}
                onChange={(e) => updateSetting("soundAlerts", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-[#0D47A1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0b3882] transition disabled:opacity-60"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
