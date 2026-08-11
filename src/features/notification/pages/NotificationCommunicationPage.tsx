import { useState, useCallback, useMemo } from "react";
import {
  CommunicationHeader,
  CommunicationKpiCards,
  CommunicationToast,
  DeliveryChannelsSection,
  RolePreferencesSection,
  ReminderConfigSection,
  TemplatesSection,
  TriggersSection,
  AnalyticsSection,
  LifecycleSection,
  TemplateDetailsDrawer,
  PreviewNotificationModal,
} from "../components";
import type { TemplateRow } from "../components/TemplatesSection";
import {
  DEFAULT_CHANNELS,
  DEFAULT_ROLE_PREFERENCES,
  DEFAULT_REMINDER_CONFIG,
} from "../constants/notifications.constants";
import {
  useNotificationTemplates,
  useNotificationRules,
  useUpdateNotificationRule,
  useUpdateNotificationTemplate,
  useSendTestNotification,
  useCurrentUserId,
  useCurrentRole,
  useUpdateNotificationPreferences,
} from "../hooks/useNotifications";
import { getNotificationPermission } from "../permissions";
import type { NotificationRule } from "../types/notifications.types";

const RULE_KEY_EVENT_PATTERNS: {
  key: string;
  matches: (eventType: string) => boolean;
}[] = [
  {
    key: "autoApptConfirmation",
    matches: (et) => et.toUpperCase().includes("APPOINTMENT"),
  },
  {
    key: "instantInvoiceAfterPay",
    matches: (et) => /INVOICE|BILL|PAYMENT/.test(et.toUpperCase()),
  },
  {
    key: "prescriptionNotif",
    matches: (et) => et.toUpperCase().includes("PRESCRIPTION"),
  },
  {
    key: "systemMaintenanceAlerts",
    matches: (et) => et.toUpperCase().includes("MAINTENANCE"),
  },
  {
    key: "criticalSecurityAlerts",
    matches: (et) => /SECURITY|AUDIT|LOGIN/.test(et.toUpperCase()),
  },
];

export function NotificationCommunicationPage() {
  const role = useCurrentRole();
  const permissions = getNotificationPermission(String(role));
  const canManage = permissions.canManageRules && permissions.canManageTemplates;
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [rolePreferences, setRolePreferences] = useState<
    Record<string, Record<string, boolean>>
  >(DEFAULT_ROLE_PREFERENCES as Record<string, Record<string, boolean>>);
  const [reminderConfig, setReminderConfig] = useState(DEFAULT_REMINDER_CONFIG);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateRow | null>(
    null,
  );
  const [isTemplateEditMode, setIsTemplateEditMode] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const { data: apiTemplates } = useNotificationTemplates();
  const { data: apiRules } = useNotificationRules();
  const updateRuleMutation = useUpdateNotificationRule();
  const updateTemplateMutation = useUpdateNotificationTemplate();
  const sendTestMutation = useSendTestNotification();
  const updatePreferences = useUpdateNotificationPreferences();
  const currentUserId = useCurrentUserId();

  const triggerToast = useCallback((msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  }, []);

  const templates = useMemo<TemplateRow[]>(() => {
    if (!apiTemplates) return [];
    return apiTemplates.map((t) => ({
      id: String(t.id),
      name: t.title,
      category: t.eventType,
      channel: `${t.priority} / ${t.language}`,
      status: t.active ? "Active" : "Inactive",
      lastUpdated: `v${t.version}`,
    }));
  }, [apiTemplates]);

  const commRules = useMemo(() => {
    const rules: Record<string, boolean> = {
      autoApptConfirmation: true,
      instantInvoiceAfterPay: true,
      prescriptionNotif: true,
      systemMaintenanceAlerts: true,
      criticalSecurityAlerts: true,
    };
    (apiRules ?? []).forEach((rule: NotificationRule) => {
      const matched = RULE_KEY_EVENT_PATTERNS.find((p) =>
        p.matches(rule.eventType),
      );
      if (matched) {
        rules[matched.key] = rule.enabled;
      }
    });
    return rules;
  }, [apiRules]);

  const ruleForKey = useCallback(
    (key: string) => {
      const pattern = RULE_KEY_EVENT_PATTERNS.find((p) => p.key === key);
      if (!pattern) return undefined;
      return (apiRules ?? []).find((r) => pattern.matches(r.eventType));
    },
    [apiRules],
  );

  const handleToggleChannel = (id: string, field: "enabled" | "isDefault") => {
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (field === "isDefault") {
            return { ...c, isDefault: true };
          }
          return { ...c, [field]: !c[field] };
        }
        if (field === "isDefault") {
          return { ...c, isDefault: false };
        }
        return c;
      }),
    );
  };

  const handleToggleRolePreference = (roleName: string, col: string) => {
    setRolePreferences((prev) => ({
      ...prev,
      [roleName]: {
        ...prev[roleName],
        [col]: !prev[roleName][col],
      },
    }));
  };

  const handleUpdateReminderConfig = (
    patch: Partial<typeof reminderConfig>,
  ) => {
    setReminderConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleToggleRule = (key: string, enabled: boolean) => {
    const rule = ruleForKey(key);
    if (rule) {
      updateRuleMutation.mutate({
        id: rule.id,
        payload: {
          id: rule.id,
          eventType: rule.eventType,
          enabled,
          priority: rule.priority,
          targetRoles: rule.targetRoles,
        },
      });
    }
  };

  const handleSaveConfiguration = async () => {
    await updatePreferences.mutateAsync({
      inAppEnabled: !!channels.find((c) => c.id === "c1")?.enabled,
      emailEnabled: !!channels.find((c) => c.id === "c2")?.enabled,
      criticalAlertsEnabled: rolePreferences[role]?.critical ?? true,
    });
    triggerToast(
      "Notification & Communication preferences saved successfully!",
    );
  };

  const handleReset = () => {
    setChannels(DEFAULT_CHANNELS);
    setRolePreferences(
      DEFAULT_ROLE_PREFERENCES as Record<string, Record<string, boolean>>,
    );
    setReminderConfig(DEFAULT_REMINDER_CONFIG);
    triggerToast("Configuration reset to defaults");
  };

  const handleSaveTemplateChanges = async () => {
    if (!selectedTemplate) return;
    const apiTemplate = apiTemplates?.find(
      (t) => String(t.id) === selectedTemplate.id,
    );
    if (apiTemplate) {
      await updateTemplateMutation.mutateAsync({
        id: apiTemplate.id,
        payload: {
          id: apiTemplate.id,
          eventType: apiTemplate.eventType,
          title: apiTemplate.title,
          body: apiTemplate.body,
          priority: apiTemplate.priority,
          language: apiTemplate.language,
          version: apiTemplate.version + 1,
          active: true,
        },
      });
    }
    setSelectedTemplate(null);
    setIsTemplateEditMode(false);
    triggerToast("Template changes saved successfully!");
  };

  const handleSendTestNotification = async () => {
    await sendTestMutation.mutateAsync({
      userId: currentUserId,
      eventType: selectedTemplate?.category ?? "APPOINTMENT_CONFIRMATION",
    });
    triggerToast("Test notification dispatched successfully!");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        <CommunicationHeader
          onPreview={() => setShowPreviewModal(true)}
          onReset={handleReset}
          onSave={handleSaveConfiguration}
        />

        <CommunicationKpiCards
          channelsCount={channels.filter((c) => c.enabled).length}
          templatesCount={templates.length}
        />

        <DeliveryChannelsSection
          channels={channels}
          onToggleChannel={handleToggleChannel}
        />

        <RolePreferencesSection
          rolePreferences={rolePreferences}
          onToggleRolePreference={handleToggleRolePreference}
        />

        <ReminderConfigSection
          reminderConfig={reminderConfig}
          onUpdateReminderConfig={handleUpdateReminderConfig}
        />

        <TemplatesSection
          templates={templates}
          onViewTemplate={(t) => {
            setSelectedTemplate(t);
            setIsTemplateEditMode(false);
          }}
        />

        <TriggersSection
          commRules={commRules}
          onToggleRule={handleToggleRule}
          readOnly={!canManage}
        />

        <AnalyticsSection />

        <LifecycleSection />
      </div>

      <TemplateDetailsDrawer
        template={selectedTemplate}
        isEditMode={isTemplateEditMode}
        readOnly={!canManage}
        onToggleEdit={() => setIsTemplateEditMode((prev) => !prev)}
        onClose={() => {
          setSelectedTemplate(null);
          setIsTemplateEditMode(false);
        }}
        onSaveChanges={handleSaveTemplateChanges}
        savePending={updateTemplateMutation.isPending}
      />

      <PreviewNotificationModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onSendTest={handleSendTestNotification}
        sending={sendTestMutation.isPending}
        canSendTest={permissions.canSendTest}
      />

      <CommunicationToast message={saveToast} />
    </div>
  );
}
