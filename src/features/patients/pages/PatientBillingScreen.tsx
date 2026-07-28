import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronRight,
  Eye,
  Receipt,
  X,
  Clock,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import type { PatientInvoice } from "../types/patient.types";
import { PP, RB, INITIAL_INVOICES, PAYMENT_HISTORY_RECORDS } from "../constants/patient.mock";

export function PatientBillingScreen() {
  const [invoices, setInvoices] = useState<PatientInvoice[]>(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Drawer states
  const [selectedInvoice, setSelectedInvoice] = useState<PatientInvoice | null>(
    null,
  );

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Summary Card Calculations
  const totalBillsCount = invoices.length;
  const paidTotal = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.numericAmount, 0);
  const pendingTotal = invoices
    .filter((i) => i.status === "Pending" || i.status === "Overdue")
    .reduce((sum, i) => sum + i.numericAmount, 0);
  const lastPayment = invoices.find((i) => i.status === "Paid");

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        inv.id.toLowerCase().includes(q) ||
        inv.doctor.toLowerCase().includes(q) ||
        inv.department.toLowerCase().includes(q) ||
        inv.amount.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== "All" && inv.status !== statusFilter) return false;
    if (dateFilter !== "All") {
      if (dateFilter === "2024" && !inv.date.startsWith("2024")) return false;
      if (dateFilter === "2023" && !inv.date.startsWith("2023")) return false;
    }
    return true;
  });

  const handlePayInvoice = (inv: PatientInvoice) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === inv.id
          ? {
            ...i,
            status: "Paid",
            paymentRef: `TXN-${Math.floor(10000 + Math.random() * 90000)}-ONLINE`,
            paymentDate: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 16),
            paymentMethod: "Instant Card Payment",
          }
          : i,
      ),
    );
    setSelectedInvoice(null);
    triggerToast(
      `Payment of ${inv.amount} for ${inv.id} completed successfully!`,
    );
  };

  const handlePayAllPending = () => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.status === "Pending" || i.status === "Overdue"
          ? {
            ...i,
            status: "Paid",
            paymentRef: `TXN-${Math.floor(10000 + Math.random() * 90000)}-ALL`,
            paymentDate: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 16),
            paymentMethod: "Instant Online Pay",
          }
          : i,
      ),
    );
    triggerToast(
      `Paid all pending balances ($${pendingTotal.toFixed(2)}) successfully!`,
    );
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Billing & Payments
          </h1>
          <div
            className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1"
            style={{ fontFamily: RB }}
          >
            <span>Patient Portal</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">
              Billing & Payments
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              triggerToast("Downloading annual billing statement PDF...")
            }
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            Download Statement
          </button>
          {pendingTotal > 0 && (
            <button
              onClick={handlePayAllPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              <CreditCard size={14} /> Pay Pending (${pendingTotal.toFixed(2)})
            </button>
          )}
        </div>
      </div>

      {/* ── 2. SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Total Bills
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {totalBillsCount} Invoices
            </div>
            <div className="text-[11px] text-[#0D47A1] font-medium mt-1">
              Hospital Services & OPD
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
            <Receipt size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Paid Amount
            </div>
            <div
              className="text-2xl font-bold text-[#66BB6A] mt-0.5"
              style={{ fontFamily: PP }}
            >
              ${paidTotal.toFixed(2)}
            </div>
            <div className="text-[11px] text-[#66BB6A] font-medium mt-1">
              Cleared invoices
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#66BB6A]">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Pending Amount
            </div>
            <div
              className="text-2xl font-bold text-amber-600 mt-0.5"
              style={{ fontFamily: PP }}
            >
              ${pendingTotal.toFixed(2)}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              Due within 14 days
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">
              Last Payment
            </div>
            <div
              className="text-lg font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {lastPayment ? lastPayment.amount : "$0.00"}
            </div>
            <div className="text-[11px] text-[#009688] font-medium mt-0.5">
              {lastPayment ? lastPayment.date : "No payment"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* ── 3. SEARCH & FILTERS TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Invoice Number (e.g. INV-2024-001), Doctor..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Filter size={13} />
            <span>Filter:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
          >
            <option value="All">All Dates</option>
            <option value="2024">Year 2024</option>
            <option value="2023">Year 2023</option>
          </select>
        </div>
      </div>

      {/* ── 4. MAIN INVOICES TABLE ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
          <h2
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Billing & Invoices History
          </h2>
          <span className="text-xs text-[#64748B]">
            {filteredInvoices.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-xs"
            style={{ fontFamily: RB }}
          >
            <thead>
              <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5 font-bold">Invoice Number</th>
                <th className="px-4 py-3.5 font-bold">Bill Date</th>
                <th className="px-4 py-3.5 font-bold">Doctor & Specialty</th>
                <th className="px-4 py-3.5 font-bold">Department</th>
                <th className="px-4 py-3.5 font-bold">Amount</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Invoice Number */}
                  <td className="px-5 py-4 font-mono font-bold text-[#0D47A1]">
                    {inv.id}
                  </td>

                  {/* Bill Date */}
                  <td className="px-4 py-4">
                    <div className="font-semibold text-[#111827]">
                      {inv.date}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Due: {inv.dueDate}
                    </div>
                  </td>

                  {/* Doctor */}
                  <td className="px-4 py-4 font-semibold text-[#111827]">
                    {inv.doctor}
                  </td>

                  {/* Department */}
                  <td className="px-4 py-4 text-slate-600">{inv.department}</td>

                  {/* Amount */}
                  <td className="px-4 py-4 font-bold text-[#111827] text-sm">
                    {inv.amount}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${inv.status === "Paid"
                          ? "bg-green-50 text-[#66BB6A]"
                          : inv.status === "Pending"
                            ? "bg-amber-50 text-[#F59E0B]"
                            : "bg-red-50 text-[#EF4444]"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${inv.status === "Paid"
                            ? "bg-[#66BB6A]"
                            : inv.status === "Pending"
                              ? "bg-[#F59E0B]"
                              : "bg-[#EF4444]"
                          }`}
                      />
                      {inv.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
                        style={{ fontFamily: PP }}
                      >
                        <Eye size={13} /> View Bill
                      </button>

                      <button
                        onClick={() =>
                          triggerToast(
                            `Downloading invoice PDF for ${inv.id}...`,
                          )
                        }
                        className="p-1.5 text-slate-500 hover:text-[#009688] hover:bg-teal-50 rounded-lg transition-colors"
                        title="Download Invoice PDF"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. PAYMENT HISTORY TIMELINE CARD SECTION ── */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Payment History Timeline
          </h2>
          <span className="text-xs text-[#009688] font-semibold flex items-center gap-1">
            <CheckCircle2 size={13} /> Verified Transactions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYMENT_HISTORY_RECORDS.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#0D47A1]">
                  {rec.referenceNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#66BB6A]">
                  {rec.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {rec.amount}
                </span>
                <span className="text-xs text-[#64748B]">{rec.date}</span>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 pt-1 border-t border-slate-200/60">
                <div>
                  Method:{" "}
                  <span className="font-medium text-[#111827]">
                    {rec.method}
                  </span>
                </div>
                <div>
                  Invoice:{" "}
                  <span className="font-mono font-medium text-slate-700">
                    {rec.invoiceId}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. RIGHT DRAWER: INVOICE & BILL DETAILS ── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedInvoice(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
              {/* Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2
                    className="text-base font-bold"
                    style={{ fontFamily: PP }}
                  >
                    Invoice Breakdown
                  </h2>
                  <span className="font-mono text-xs text-blue-200">
                    {selectedInvoice.id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div
                className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50"
                style={{ fontFamily: RB }}
              >
                {/* Invoice Summary Card */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs text-[#64748B] block">
                        Invoice Date
                      </span>
                      <span className="font-semibold text-[#111827] text-xs">
                        {selectedInvoice.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[#64748B] block text-right">
                        Payment Status
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold ${selectedInvoice.status === "Paid"
                            ? "text-[#66BB6A]"
                            : "text-amber-600"
                          }`}
                      >
                        {selectedInvoice.status}
                      </span>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[#64748B] text-[11px] block">
                        Patient Name & ID
                      </span>
                      <span className="font-bold text-[#111827]">
                        Sarah Mitchell (P-9821)
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">
                        Payment Type
                      </span>
                      <span className="font-medium text-slate-700">
                        Direct Patient Account
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">
                        Doctor
                      </span>
                      <span className="font-medium text-slate-700">
                        {selectedInvoice.doctor}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">
                        Department
                      </span>
                      <span className="font-medium text-slate-700">
                        {selectedInvoice.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Itemized Bill Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div
                    className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                    style={{ fontFamily: PP }}
                  >
                    Itemized Services Breakdown
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {selectedInvoice.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-2.5 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-[#111827]">
                            {item.description}
                          </div>
                          <div className="text-[10px] text-[#64748B]">
                            {item.category}
                          </div>
                        </div>
                        <div className="font-bold text-[#111827]">
                          {item.cost}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#111827] font-bold text-sm pt-1">
                      <span>Total Patient Amount</span>
                      <span
                        className="text-[#0D47A1]"
                        style={{ fontFamily: PP }}
                      >
                        {selectedInvoice.amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Reference if Paid */}
                {selectedInvoice.paymentRef && (
                  <div className="p-4 rounded-2xl bg-green-50/80 border border-green-100 text-xs space-y-1">
                    <div
                      className="font-bold text-[#66BB6A] flex items-center gap-1.5"
                      style={{ fontFamily: PP }}
                    >
                      <CheckCircle2 size={15} /> Payment Completed
                    </div>
                    <div className="text-slate-600">
                      Ref:{" "}
                      <span className="font-mono font-medium text-slate-900">
                        {selectedInvoice.paymentRef}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Method: {selectedInvoice.paymentMethod}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {selectedInvoice.paymentDate}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
                {selectedInvoice.status === "Pending" && (
                  <button
                    onClick={() => handlePayInvoice(selectedInvoice)}
                    className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    <CreditCard size={15} /> Pay {selectedInvoice.amount} Now
                  </button>
                )}
                <button
                  onClick={() =>
                    triggerToast(
                      `Downloading invoice PDF for ${selectedInvoice.id}...`,
                    )
                  }
                  className={`py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827] hover:bg-slate-50 ${selectedInvoice.status === "Pending" ? "px-3" : "flex-1"
                    }`}
                  style={{ fontFamily: PP }}
                >
                  Download Invoice
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}