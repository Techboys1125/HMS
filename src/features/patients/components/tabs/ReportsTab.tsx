/**
 * ReportsTab – Patient Profile Tab for Reports
 * Future-ready tab with Billing, Visit, and Prescription report summaries
 */
import { BarChart2, FileText, DollarSign, Calendar, Pill } from "lucide-react";
import type { Patient } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { usePatientBilling } from "../../hooks/useBilling";
import { usePatientAppointments } from "../../hooks/useAppointments";
import { usePrescriptions } from "../../hooks/usePrescriptions";

export interface ReportsTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

function ReportCard({
  icon: Icon,
  title,
  color,
  stats,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  stats: Array<{ label: string; value: string | number }>;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: color + "18" }}
        >
          <Icon size={15} style={{ color }} />
        </div>
        <h4
          className="text-xs font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          {title}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-50 rounded-lg px-2.5 py-2">
            <div className="text-[10px] text-slate-400">{stat.label}</div>
            <div className="text-sm font-bold text-[#111827]">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PatientReportsTab({ patient }: ReportsTabProps) {
  const { summary: billingSummary, isLoading: billingLoading } =
    usePatientBilling(patient.mrn);
  const { data: appointments, isLoading: appointmentsLoading } =
    usePatientAppointments(patient.mrn);
  const { data: prescriptions, isLoading: prescriptionsLoading } =
    usePrescriptions(patient.mrn);

  const isLoading =
    billingLoading || appointmentsLoading || prescriptionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading reports...
      </div>
    );
  }

  const apptList = Array.isArray(appointments) ? appointments : [];
  const rxList = Array.isArray(prescriptions) ? prescriptions : [];

  const completedAppointments = apptList.filter(
    (a) => a.status === "Completed",
  ).length;
  const cancelledAppointments = apptList.filter(
    (a) => a.status === "Cancelled",
  ).length;
  const activeRx = rxList.filter(
    (r) => r.status === "Issued" || r.status === "Active",
  ).length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Reports
        </h3>
        <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
          <BarChart2 size={12} />
          <span>Summary Overview</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Billing Report */}
        <ReportCard
          icon={DollarSign}
          title="Billing Report"
          color="#009688"
          stats={[
            {
              label: "Total Billed",
              value: formatCurrency(billingSummary.totalBilled),
            },
            {
              label: "Total Paid",
              value: formatCurrency(billingSummary.totalPaid),
            },
            {
              label: "Pending",
              value: formatCurrency(billingSummary.totalPending),
            },
            { label: "Invoices", value: billingSummary.invoiceCount },
          ]}
        />

        {/* Visit Report */}
        <ReportCard
          icon={Calendar}
          title="Visit Report"
          color="#0D47A1"
          stats={[
            { label: "Total Visits", value: apptList.length },
            { label: "Completed", value: completedAppointments },
            { label: "Cancelled", value: cancelledAppointments },
            {
              label: "Upcoming",
              value:
                apptList.length - completedAppointments - cancelledAppointments,
            },
          ]}
        />

        {/* Prescription Report */}
        <ReportCard
          icon={Pill}
          title="Prescription Report"
          color="#7C3AED"
          stats={[
            { label: "Total Prescriptions", value: rxList.length },
            { label: "Active", value: activeRx },
            { label: "Completed", value: rxList.length - activeRx },
            {
              label: "Avg Medicines",
              value:
                rxList.length > 0
                  ? Math.round(
                      rxList.reduce(
                        (sum, r) => sum + (r.medicineCount || 0),
                        0,
                      ) / rxList.length,
                    )
                  : 0,
            },
          ]}
        />
      </div>

      <div className="bg-slate-50 border border-[#E5E7EB] rounded-xl p-4 text-center">
        <FileText size={20} className="mx-auto text-slate-300 mb-2" />
        <p className="text-xs text-[#64748B]">
          Detailed report export will be available in a future update.
        </p>
      </div>
    </div>
  );
}
