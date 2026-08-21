import { useCallback, useMemo, useState } from "react";
import { CommunicationHeader } from "../components/CommunicationHeader";
import { CommunicationKpiCards } from "../components/CommunicationKpiCards";
import { CommunicationToast } from "../components/CommunicationToast";
import { TemplatesSection } from "../components/TemplatesSection";
import { TriggersSection } from "../components/TriggersSection";
import { TemplateDetailsDrawer } from "../components/TemplateDetailsDrawer";
import { PreviewNotificationModal } from "../components/PreviewNotificationModal";
import type { TemplateRow } from "../components/TemplatesSection";
import {
  useNotificationTemplates,
  useNotificationRules,
  useUpdateNotificationRule,
  useUpdateNotificationTemplate,
  useSendTestNotification,
  useNotificationFailures,
  useCurrentUserId,
  useCurrentRole,
} from "../hooks/useNotifications";
import { getNotificationPermission } from "../permissions/notifications.permissions";
import type { NotificationRule } from "../types/notifications.types";

const RULE_KEY_EVENT_PATTERNS: {
  key: string;
  matches: (eventType: string) => boolean;
}[] = [
  { key: "autoApptConfirmation", matches: (et) => et.toUpperCase().includes("APPOINTMENT") },
  { key: "instantInvoiceAfterPay", matches: (et) => /INVOICE|BILL|PAYMENT/.test(et.toUpperCase()) },
  { key: "prescriptionNotif", matches: (et) => et.toUpperCase().includes("PRESCRIPTION") },
  { key: "systemMaintenanceAlerts", matches: (et) => et.toUpperCase().includes("MAINTENANCE") },
  { key: "criticalSecurityAlerts", matches: (et) => /SECURITY|AUDIT|LOGIN/.test(et.toUpperCase()) },
];

export function NotificationCommunicationPage() {
  const role = useCurrentRole();
  const permissions = getNotificationPermission(String(role));
  const canManage = permissions.canManageRules && permissions.canManageTemplates;

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateRow | null>(null);
  const [isTemplateEditMode, setIsTemplateEditMode] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const {
    data: apiTemplates,
    refetch: refetchTemplates,
  } = useNotificationTemplates();
  const {
    data: apiRules,
    refetch: refetchRules,
  } = useNotificationRules();
  const { data: apiFailures, refetch: refetchFailures } =
    useNotificationFailures();
  const updateRuleMutation = useUpdateNotificationRule();
  const updateTemplateMutation = useUpdateNotificationTemplate();
  const sendTestMutation = useSendTestNotification();
  const currentUserId = useCurrentUserId();

  const triggerToast = useCallback((msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  }, []);

  const templates = useMemo<TemplateRow[]>(() => {
    return (apiTemplates ?? []).map((t) => ({
      id: String(t.id),
      name: t.title,
      category: t.eventType,
      channel: `${t.priority} / ${t.language}`,
      status: t.active ? "Active" : "Inactive",
      lastUpdated: `v${t.version}`,
      body: t.body,
      priority: t.priority,
      active: t.active,
    }));
  }, [apiTemplates]);

  const commRules = useMemo(() => {
    const rules: Record<string, boolean> = {
      autoApptConfirmation: false,
      instantInvoiceAfterPay: false,
      prescriptionNotif: false,
      systemMaintenanceAlerts: false,
      criticalSecurityAlerts: false,
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

  const enabledRulesCount = useMemo(
    () => (apiRules ?? []).filter((rule) => rule.enabled).length,
    [apiRules],
  );

  const ruleForKey = useCallback(
    (key: string) => {
      const pattern = RULE_KEY_EVENT_PATTERNS.find((p) => p.key === key);
      if (!pattern) return undefined;
      return (apiRules ?? []).find((r) => pattern.matches(r.eventType));
    },
    [apiRules],
  );

  const handleToggleRule = (key: string, enabled: boolean) => {
    const rule = ruleForKey(key);
    if (!rule) return;
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
          eventType: selectedTemplate.category || apiTemplate.eventType,
          title: selectedTemplate.name || apiTemplate.title,
          body: selectedTemplate.body || apiTemplate.body,
          priority: selectedTemplate.priority || apiTemplate.priority,
          language: apiTemplate.language,
          version: apiTemplate.version + 1,
          active: selectedTemplate.active ?? apiTemplate.active,
        },
      });
    }
    setSelectedTemplate(null);
    setIsTemplateEditMode(false);
    triggerToast("Template changes saved successfully");
  };

  const handleTemplateChange = (patch: Partial<TemplateRow>) => {
    setSelectedTemplate((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleSendTestNotification = async () => {
    await sendTestMutation.mutateAsync({
      userId: currentUserId,
      eventType: selectedTemplate?.category ?? "APPOINTMENT_BOOKED",
      payload: { doctorName: "" },
    });
    triggerToast("Test notification dispatched successfully");
  };

  const handleRefresh = async () => {
    await Promise.all([refetchTemplates(), refetchRules(), refetchFailures()]);
    triggerToast("Notification data refreshed");
  };

  const previewTemplate = useMemo<TemplateRow | null>(
    () => selectedTemplate ?? templates[0] ?? null,
    [selectedTemplate, templates],
  );

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
        <CommunicationHeader onPreview={() => setShowPreviewModal(true)} onRefresh={handleRefresh} />

        <CommunicationKpiCards
          rulesCount={enabledRulesCount}
          templatesCount={templates.length}
          failuresCount={apiFailures?.length ?? 0}
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
        onTemplateChange={handleTemplateChange}
        onSaveChanges={handleSaveTemplateChanges}
        savePending={updateTemplateMutation.isPending}
      />

      <PreviewNotificationModal
        open={showPreviewModal}
        template={previewTemplate}
        onClose={() => setShowPreviewModal(false)}
        onSendTest={handleSendTestNotification}
        sending={sendTestMutation.isPending}
        canSendTest={permissions.canSendTest}
      />

      <CommunicationToast message={saveToast} />
    </div>
  );
}
