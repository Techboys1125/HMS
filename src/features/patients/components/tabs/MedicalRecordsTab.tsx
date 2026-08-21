/**
 * MedicalRecordsTab – Patient Profile Tab for Medical Records
 * Displays prescriptions + billing from real backend endpoints
 * Sub-tabs: Timeline | Prescriptions | Billing
 */
import { useState } from "react";
import {
  FileText,
  Clock,
  ChevronRight,
  CreditCard,
  Pill,
  AlertTriangle,
  Eye,
  Printer,
} from "lucide-react";
import type { Patient } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import type {
  PrescriptionSummary,
  BillingSummaryRecord,
  MedicalHistoryEntry,
} from "../../types/medicalRecord.types";
import type { InvoiceRecord } from "../../../billing/types/billing.types";
import { PrescriptionDetailsModal } from "./PrescriptionDetailsModal";
import { InvoiceDetailsDrawer } from "../../../billing/components/InvoiceDetailsDrawer";
import { mapApiInvoiceToInvoiceRecord } from "../../../billing/utils/billing.utils";

export interface MedicalRecordsTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

type MedicalSubTab = "timeline" | "prescriptions" | "billing";

const SUB_TABS: Array<{
  id: MedicalSubTab;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "prescriptions", label: "Prescriptions", icon: Pill },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const STATUS_STYLE: Record<string, string> = {
  FINALIZED: "bg-emerald-50 text-[#66BB6A] border-emerald-200",
  ISSUED: "bg-emerald-50 text-[#66BB6A] border-emerald-200",
  Completed: "bg-emerald-50 text-[#66BB6A] border-emerald-200",
  DRAFT: "bg-amber-50 text-[#F59E0B] border-amber-200",
  PENDING: "bg-amber-50 text-[#F59E0B] border-amber-200",
  CANCELLED: "bg-red-50 text-[#EF4444] border-red-200",
  PAID: "bg-emerald-50 text-[#66BB6A] border-emerald-200",
  UNPAID: "bg-red-50 text-[#EF4444] border-red-200",
  PARTIALLY_PAID: "bg-amber-50 text-[#F59E0B] border-amber-200",
  Active: "bg-blue-50 text-[#0D47A1] border-blue-200",
};

/* ─── Timeline View ─── */
function TimelineView({
  entries,
  onSelectPrescription,
  onSelectBill,
}: {
  entries: MedicalHistoryEntry[];
  onSelectPrescription: (id: string) => void;
  onSelectBill: (id: string | number) => void;
}) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#64748B]">
        No medical history found.
      </div>
    );
  }

  const iconMap: Record<string, React.ElementType> = {
    prescription: Pill,
    billing: CreditCard,
  };

  const colorMap: Record<string, string> = {
    prescription: "bg-emerald-50 text-emerald-700",
    billing: "bg-sky-50 text-sky-700",
  };

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const Icon = iconMap[entry.type] || FileText;
        const colorCls = colorMap[entry.type] || "bg-slate-50 text-slate-600";
        const handleClick = () => {
          if (entry.type === "prescription") {
            onSelectPrescription(String(entry.id));
          } else if (entry.type === "billing") {
            onSelectBill(entry.id);
          }
        };

        return (
          <div
            key={`${entry.type}-${entry.id}`}
            onClick={handleClick}
            className="flex items-start gap-3 bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
          >
            <div
              className={`w-8 h-8 rounded-full ${colorCls} flex items-center justify-center shrink-0 mt-0.5`}
            >
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-bold text-[#111827] truncate">
                  {entry.title}
                </div>
                {entry.status && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${STATUS_STYLE[entry.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                  >
                    {entry.status}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                {entry.description}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                {entry.date && <span>{entry.date}</span>}
                {entry.doctorName && <span>· {entry.doctorName}</span>}
                {entry.department && <span>· {entry.department}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity self-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                title="View Details"
              >
                <Eye size={14} />
              </button>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Prescriptions View ─── */
function PrescriptionsView({
  records,
  onSelectPrescription,
}: {
  records: PrescriptionSummary[];
  onSelectPrescription: (id: string) => void;
}) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#64748B]">
        No prescription records found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {records.map((rx) => {
        const status = rx.prescriptionStatus || "FINALIZED";
        return (
          <div
            key={rx.prescriptionId}
            onClick={() => onSelectPrescription(rx.prescriptionId)}
            className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Pill size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-[#111827]">
                  {rx.doctor?.doctorName || "Doctor"}
                </div>
                <div className="text-[11px] text-[#64748B]">
                  {rx.visitDateTime || rx.createdAt || "—"} ·{" "}
                  {rx.department?.departmentName || "General"}
                </div>
                {rx.diagnosis?.primaryDiagnosis && (
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {rx.diagnosis.primaryDiagnosis}
                    {rx.diagnosis.icd10Code && (
                      <span className="text-[10px] text-slate-400 ml-1">
                        ({rx.diagnosis.icd10Code})
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  {rx.medications?.totalMedicines != null && (
                    <span className="text-[10px] text-slate-400">
                      {rx.medications.totalMedicines} medication(s)
                    </span>
                  )}
                  {rx.medications?.highRiskMedicine && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600">
                      <AlertTriangle size={10} /> High-risk
                    </span>
                  )}
                  {rx.followUp?.required && (
                    <span className="text-[10px] text-blue-500">
                      Follow-up: {rx.followUp.followUpDate || "Scheduled"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_STYLE[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {status}
              </span>
              <div
                className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onSelectPrescription(rx.prescriptionId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                  title="View Prescription"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => {
                    onSelectPrescription(rx.prescriptionId);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Print Prescription"
                >
                  <Printer size={15} />
                </button>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Billing View ─── */
function BillingView({
  records,
  onSelectBill,
}: {
  records: BillingSummaryRecord[];
  onSelectBill: (bill: BillingSummaryRecord) => void;
}) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#64748B]">
        No billing records found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {records.map((bill) => {
        const payStatus = bill.paymentStatus || bill.billStatus || "PENDING";
        return (
          <div
            key={bill.billId}
            onClick={() => onSelectBill(bill)}
            className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <CreditCard size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-[#111827]">
                  {bill.billNumber || `Bill #${bill.billId}`}
                </div>
                <div className="text-[11px] text-[#64748B]">
                  {bill.date || "—"}
                  {bill.doctor && <span> · {bill.doctor}</span>}
                </div>
                {bill.amount != null && (
                  <div className="text-xs font-bold text-[#111827] mt-0.5">
                    ₹{bill.amount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_STYLE[payStatus] || "bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {payStatus}
              </span>
              <div
                className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onSelectBill(bill)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                  title="View Invoice"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => {
                    onSelectBill(bill);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Print Invoice / Receipt"
                >
                  <Printer size={15} />
                </button>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─── */
export function PatientMedicalRecordsTab({ patient }: MedicalRecordsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<MedicalSubTab>("timeline");
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    string | null
  >(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(
    null,
  );

  const { data: medicalSummary, isLoading } = useMedicalRecords(patient.mrn);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading medical records...
      </div>
    );
  }

  const summary = medicalSummary || {
    prescriptions: [],
    billing: { bills: [] },
    timeline: [],
    totalVisits: 0,
  };

  const handleSelectBill = (bill: BillingSummaryRecord | string | number) => {
    const b =
      typeof bill === "object"
        ? bill
        : summary.billing.bills.find(
            (item) => String(item.billId) === String(bill),
          ) || {
            billId: bill,
            billNumber: String(bill),
            date: new Date().toISOString().split("T")[0],
            amount: 0,
          };

    const invoiceRecord = mapApiInvoiceToInvoiceRecord(
      {
        id: b.billId,
        invoiceNumber: b.billNumber,
        date: b.date,
        status: b.paymentStatus || b.billStatus,
        amount: b.amount,
      },
      patient.fullName || patient.name || "Patient",
      patient.mrn,
    );
    setSelectedInvoice(invoiceRecord);
  };

  const subTabContent = (() => {
    switch (activeSubTab) {
      case "timeline":
        return (
          <TimelineView
            entries={summary.timeline}
            onSelectPrescription={(id) => setSelectedPrescriptionId(id)}
            onSelectBill={(id) => handleSelectBill(id)}
          />
        );
      case "prescriptions":
        return (
          <PrescriptionsView
            records={summary.prescriptions}
            onSelectPrescription={(id) => setSelectedPrescriptionId(id)}
          />
        );
      case "billing":
        return (
          <BillingView
            records={summary.billing.bills}
            onSelectBill={(b) => handleSelectBill(b)}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Medical Records
        </h3>
        <span className="text-[11px] text-[#64748B]">
          {summary.totalVisits} visit(s) · {summary.billing.bills.length} bill(s)
        </span>
      </div>

      {/* Billing summary cards */}
      {summary.billing.summary && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <div className="text-[10px] text-slate-400">Total Bills</div>
            <div className="text-xs font-bold text-[#111827]">
              {summary.billing.summary.totalBills ?? 0}
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg px-3 py-2">
            <div className="text-[10px] text-slate-400">Paid</div>
            <div className="text-xs font-bold text-emerald-700">
              ₹{(summary.billing.summary.totalPaid ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg px-3 py-2">
            <div className="text-[10px] text-slate-400">Outstanding</div>
            <div className="text-xs font-bold text-amber-700">
              ₹{(summary.billing.summary.totalOutstanding ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                activeSubTab === tab.id
                  ? "bg-[#0D47A1] text-white"
                  : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
              }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {subTabContent}

      {/* Prescription Detail & Print Modal */}
      <PrescriptionDetailsModal
        prescriptionId={selectedPrescriptionId}
        patient={patient}
        isOpen={Boolean(selectedPrescriptionId)}
        onClose={() => setSelectedPrescriptionId(null)}
      />

      {/* Invoice Details & Receipt Drawer */}
      <InvoiceDetailsDrawer
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPrint={() => window.print()}
      />
    </div>
  );
}
