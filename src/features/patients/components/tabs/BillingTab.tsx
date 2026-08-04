import { useState, useEffect } from "react";
import { CreditCard, DollarSign, FileText } from "lucide-react";
import type { Patient, ApiPatientInvoice } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { patientApi } from "../../api/patientApi";

export interface BillingTabProps {
  patient: Patient;
  canEdit: boolean;
  isOwnProfile: boolean;
}

export function PatientBillingTab({ patient, canEdit, isOwnProfile }: BillingTabProps) {
  const [invoices, setInvoices] = useState<ApiPatientInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    patientApi.getBilling(patient.mrn)
      .then((data) => { if (!cancelled) setInvoices(data || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [patient.mrn]);

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">Loading billing data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Billing</h3>
        <span className="text-[11px] text-[#64748B]">{invoices.length} invoices</span>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">No billing records found.</div>
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
                  <FileText size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827]">{invoice.invoiceNumber || invoice.id}</div>
                  <div className="text-[11px] text-[#64748B]">{invoice.date || "—"} · {invoice.status || "—"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-[#009688]" />
                <span className="text-xs font-bold text-[#111827]">{invoice.amount || "—"}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}