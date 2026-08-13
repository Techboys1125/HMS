export type BillingAction =
  | "view_dashboard"
  | "view_bills"
  | "generate_invoice"
  | "edit_invoice"
  | "cancel_invoice"
  | "refund_invoice"
  | "collect_payment"
  | "view_reports"
  | "export_reports"
  | "manage_configuration"
  | "view_history"
  | "view_daily_report";

export function checkBillingPermission(
  role: string | undefined,
  action: BillingAction,
): boolean {
  if (!role) return false;
  const r = String(role).toUpperCase();

  switch (r) {
    case "SUPER_ADMIN":
    case "HOSPITAL_ADMIN":
    case "ADMIN":
      // Full Billing Access
      return true;

    case "ACCOUNTANT":
      // Financial review and reconciliation only; operational collection is
      // performed by Reception or an administrator.
      return [
        "view_dashboard",
        "view_bills",
        "view_reports",
        "export_reports",
        "view_history",
        "view_daily_report",
      ].includes(action);

    case "RECEPTIONIST": {
      // Receptionist owns the operational invoice and collection workflow.
      const receptionistAllowed: BillingAction[] = [
        "view_bills",
        "generate_invoice",
        "collect_payment",
        "view_history",
      ];
      return receptionistAllowed.includes(action);
    }

    case "PATIENT": {
      // Patient permissions
      const patientAllowed: BillingAction[] = ["view_bills", "view_history"];
      return patientAllowed.includes(action);
    }

    default:
      return false;
  }
}
