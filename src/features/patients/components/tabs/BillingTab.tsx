import { useState, useEffect } from "react";
import { DollarSign, FileText, ChevronRight, Eye, Printer } from "lucide-react";
import type { Patient, ApiPatientInvoice } from "../../types/patient.types";
import type { InvoiceRecord } from "../../../billing/types/billing.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { patientsApi } from "../../api/patient.api";
import { InvoiceDetailsDrawer } from "../../../billing/components/InvoiceDetailsDrawer";
import { mapApiInvoiceToInvoiceRecord } from "../../../billing/utils/billing.utils";

export interface BillingTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

export function PatientBillingTab({ patient }: BillingTabProps) {
  const [invoices, setInvoices] = useState<ApiPatientInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevMrn, setPrevMrn] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(
    null,
  );

  if (patient.mrn !== prevMrn) {
    setPrevMrn(patient.mrn);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .getBilling(patient.mrn)
      .then((data) => {
        if (!cancelled) setInvoices(data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patient.mrn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading billing data...
      </div>
    );
  }

  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const handleOpenInvoice = (apiInv: ApiPatientInvoice) => {
    const record = mapApiInvoiceToInvoiceRecord(
      apiInv,
      patient.fullName || patient.name || "Patient",
      patient.mrn,
    );
    setSelectedInvoice(record);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Billing &amp; Payments
        </h3>
        <span className="text-[11px] text-[#64748B]">
          {safeInvoices.length} invoices
        </span>
      </div>

      {safeInvoices.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">
          No billing records found.
        </div>
      ) : (
        <div className="space-y-2">
          {safeInvoices.map((invoice) => {
            const billId = invoice.invoiceNumber || String(invoice.id);
            const status = invoice.status || "Pending";
            const amountNum =
              typeof invoice.amount === "number"
                ? invoice.amount
                : parseFloat(String(invoice.amount || "0").replace(/[^0-9.]/g, "")) || 0;

            return (
              <div
                key={invoice.id}
                onClick={() => handleOpenInvoice(invoice)}
                className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111827]">
                      {billId}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      {invoice.date || "—"} · {status}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-xs font-bold text-[#111827] mr-1">
                    <DollarSign size={13} className="text-[#009688]" />
                    <span>{amountNum.toLocaleString()}</span>
                  </div>

                  {/* View & Print Action Buttons */}
                  <div
                    className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleOpenInvoice(invoice)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                      title="View Invoice"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => {
                        handleOpenInvoice(invoice);
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
      )}

      {/* Invoice Details & Receipt Drawer */}
      <InvoiceDetailsDrawer
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPrint={() => window.print()}
      />
    </div>
  );
}
