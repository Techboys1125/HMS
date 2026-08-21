import { useRef, useState } from "react";
import { HospitalInformationPage } from "./HospitalInformationPage";
import { UserRolesPermissionsPage } from "./UserRolesPermissionsPage";
import { AppointmentConfigurationPage } from "./AppointmentConfigurationPage";
import { BillingConfigurationPage } from "../../billing/pages/BillingConfigurationPage";
import { NotificationCommunicationPage } from "../../notification/pages/NotificationCommunicationPage";
import { SecuritySettingsPage } from "./SecuritySettingsPage";
import { BackupMaintenancePage } from "./BackupMaintenancePage";
import { SettingsPageHeader } from "../components/shell/SettingsPageHeader";
import { QuickConfigToolbar } from "../components/shell/QuickConfigToolbar";
import {
  GeneralSettingsContent,
  type GeneralSettingsContentHandle,
} from "../components/shell/GeneralSettingsContent";
import { BottomActionBar } from "../components/shell/BottomActionBar";
import {
  Building2,
  Shield,
  Calendar,
  CreditCard,
  Bell,
  Lock,
  Database,
  Sliders,
} from "lucide-react";

const RB = "'Roboto', system-ui, sans-serif";

interface SettingsPageProps {
  onNavigate?: (screen: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  void onNavigate;
  const [activeMenu, setActiveMenu] = useState<string>("general");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const generalSettingsRef = useRef<GeneralSettingsContentHandle>(null);

  // Quick Configuration Toolbar items
  const quickConfigCards = [
    {
      id: "general",
      title: "General",
      description: "System overview & status",
      icon: Sliders,
      status: "Overview",
    },
    {
      id: "hospital-info",
      title: "Hospital Information",
      description: "Branding, contact & address",
      icon: Building2,
      status: "Configured",
    },
    {
      id: "roles-permissions",
      title: "User Roles & Permissions",
      description: "RBAC & matrix policies",
      icon: Shield,
      status: "Configured",
    },
    {
      id: "appointments",
      title: "Appointment Configuration",
      description: "Slot timing & token rules",
      icon: Calendar,
      status: "Pending",
    },
    {
      id: "billing",
      title: "Billing Configuration",
      description: "Invoice, tax & payments",
      icon: CreditCard,
      status: "Configured",
    },
    {
      id: "notifications",
      title: "Notification & Communication",
      description: "SMS, email & templates",
      icon: Bell,
      status: "Configured",
    },
    {
      id: "security",
      title: "Security Settings",
      description: "2FA, passwords & SIEM",
      icon: Lock,
      status: "Configured",
    },
    {
      id: "backup",
      title: "Backup & Maintenance",
      description: "DB dumps & health check",
      icon: Database,
      status: "Configured",
    },
  ];

  const handleSave = (message?: string) => {
    setSaveStatus(message ?? "Settings saved successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Keep browser click events out of the human-readable status string.
  const handleButtonSave = () => handleSave();

  const handleCancel = () => {
    setActiveMenu("general");
    setSaveStatus(null);
  };

  const openResetModal = () => {
    generalSettingsRef.current?.openResetModal();
  };

  const activeTitle =
    quickConfigCards.find((q) => q.id === activeMenu)?.title ||
    "Settings Workspace";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1,
        background: "#F1F5F9",
        fontFamily: RB,
      }}
    >
      {/* ─── PAGE HEADER ────────────────────────────────────────────────── */}
      <SettingsPageHeader onReset={openResetModal} onSave={handleButtonSave} />

      {/* ─── HORIZONTAL QUICK CONFIGURATION TOOLBAR ────────────────────── */}
      <QuickConfigToolbar
        items={quickConfigCards}
        activeId={activeMenu}
        onSelect={setActiveMenu}
      />

      {/* ─── SINGLE FULL-WIDTH WORKSPACE CONTENT AREA ───────────────────── */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Render Active Settings Workspace Full Width */}
        <div style={{ width: "100%", transition: "opacity 0.2s ease-in-out" }}>
          {activeMenu === "general" ? (
            <GeneralSettingsContent
              ref={generalSettingsRef}
              onSave={handleSave}
            />
          ) : activeMenu === "hospital-info" ? (
            <HospitalInformationPage />
          ) : activeMenu === "roles-permissions" ? (
            <UserRolesPermissionsPage />
          ) : activeMenu === "appointments" ? (
            <AppointmentConfigurationPage />
          ) : activeMenu === "billing" ? (
            <BillingConfigurationPage />
          ) : activeMenu === "notifications" ? (
            <NotificationCommunicationPage />
          ) : activeMenu === "security" ? (
            <SecuritySettingsPage />
          ) : activeMenu === "backup" ? (
            <BackupMaintenancePage />
          ) : null}
        </div>
      </div>

      {/* ─── BOTTOM STICKY ACTION BAR ────────────────────────────────────── */}
      <BottomActionBar
        saveStatus={saveStatus}
        activeTitle={activeTitle}
        onCancel={handleCancel}
        onSave={handleButtonSave}
        onReset={openResetModal}
      />
    </div>
  );
}
