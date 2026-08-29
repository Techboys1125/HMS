import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Printer,
  Eye,
  Download,
  ChevronRight,
  MoreVertical,
  X,
  FileText,
  Copy,
  ArrowLeft,
} from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import { useBillingList } from "../hooks/useBilling";
import { BillingStatusBadge } from "../components/BillingStatusBadge";
import { useAuthStore } from "../../auth/store/auth.store";
import { mapApiBillToInvoiceRecord } from "../utils/billing.utils";

interface PaymentHistoryRecord {
  receiptNo: string;
  invoiceId: string;
  paymentDate: string;
  patientName: string;
  mrn: string;
  mobile: string;
  doctorName: string;
  department: string;
  paymentMethod: string;
  referenceNo: string;
  invoiceAmount: number;
  amountPaid: number;
  balance: number;
  collectedBy: string;
  status: string;
  remarks: string;
}

export function PaymentHistoryPage() {
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user)?.role;
  const isUnauthorizedRole = ["DOCTOR", "NURSE", "PATIENT"].includes(
    String(role).toUpperCase(),
  );

  const { data: billsData, isLoading } = useBillingList(
    isUnauthorizedRole ? { enabled: false } : { page: 0, size: 200 },
  );
  const invoices = useMemo(
    () => (billsData?.bills || []).map(mapApiBillToInvoiceRecord),
    [billsData],
  );

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedMethod, setSelectedMethod] = useState<string>("All");
  const [selectedCashier, setSelectedCashier] = useState<string>("All");
  const [dateRange, setDateRange] = useState<string>("This Month");

  // Drawer State
  const [selectedDrawerPayment, setSelectedDrawerPayment] =
    useState<PaymentHistoryRecord | null>(null);
  const [showMoreMenuId, setShowMoreMenuId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Map invoices into ledger records
  const payments = useMemo((): PaymentHistoryRecord[] => {
    return invoices.flatMap((inv) => {
      if (inv.paidAmount <= 0 && inv.paymentStatus === "Pending") return [];
      return [
        {
          receiptNo: inv.billNumber || inv.id,
          invoiceId: inv.id,
          paymentDate: inv.invoiceDate,
          patientName: inv.patientName,
          mrn: inv.mrn,
          mobile: inv.mobile,
          doctorName: inv.doctorName,
          department: inv.department,
          paymentMethod: inv.paymentMethod,
          referenceNo: inv.notes || "",
          invoiceAmount: inv.invoiceAmount,
          amountPaid: inv.paidAmount,
          balance: inv.balance,
          collectedBy: inv.collectedBy,
          status: inv.paymentStatus,
          remarks: "",
        },
      ];
    });
  }, [invoices]);

  // Filtering
  const filteredPayments = useMemo(() => {
    return payments.filter((pay) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pay.receiptNo.toLowerCase().includes(q) ||
        pay.invoiceId.toLowerCase().includes(q) ||
        pay.patientName.toLowerCase().includes(q) ||
        pay.mrn.toLowerCase().includes(q) ||
        pay.mobile.includes(searchQuery);
      const matchesStatus =
        selectedStatus === "All" || pay.status === selectedStatus;
      const matchesMethod =
        selectedMethod === "All" || pay.paymentMethod === selectedMethod;
      const matchesCashier =
        selectedCashier === "All" || pay.collectedBy === selectedCashier;
      return matchesSearch && matchesStatus && matchesMethod && matchesCashier;
    });
  }, [payments, searchQuery, selectedStatus, selectedMethod, selectedCashier]);

  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage) || 1;
  const displayedPayments = filteredPayments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedMethod("All");
    setSelectedCashier("All");
    setDateRange("This Month");
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 mb-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all cursor-pointer"
            style={{ fontFamily: RB }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div
            className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium"
            style={{ fontFamily: RB }}
          >
            <button
              type="button"
              className="hover:text-[#0D47A1] cursor-pointer"
              onClick={() => navigate("/billing")}
            >
              Home
            </button>
            <ChevronRight size={12} />
            <button
              type="button"
              className="hover:text-[#0D47A1] cursor-pointer"
              onClick={() => navigate("/billing")}
            >
              Billing & Payment
            </button>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">
              Payment History
            </span>
          </div>
          <h1
            className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight"
            style={{ fontFamily: PP }}
          >
            Payment History Ledger
          </h1>
          <p
            className="text-xs md:text-sm text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Review all payment transactions, receipts and payment records.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print Report</span>
          </button>
          <button
            onClick={() => console.log("Exporting Payment History...")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-colors shadow-sm active:scale-95"
            style={{ fontFamily: PP }}
          >
            <Download size={15} />
            Export Payment History
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs"
          style={{ fontFamily: RB }}
        >
          <div className="md:col-span-2 relative">
            <Search
              className="absolute left-3.5 top-2.5 text-slate-400"
              size={16}
            />
            <input
              aria-label="Input field"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Receipt No, Invoice ID, Patient Name, MRN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
            />
          </div>
          <div>
            <select
              aria-label="Select option"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-semibold text-slate-700 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
            >
              <option value="Today">Today's Transactions</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
          <div>
            <select
              aria-label="Select option"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-semibold text-slate-700 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1 border-t border-slate-100"
          style={{ fontFamily: RB }}
        >
          <div>
            <select
              aria-label="Select option"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium text-slate-700"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="Cash">Cash</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <select
              aria-label="Select option"
              value={selectedCashier}
              onChange={(e) => setSelectedCashier(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium text-slate-700"
            >
              <option value="All">All Cashiers / Users</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-5 py-2 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-blue-900 transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN TABLE */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              TRANSACTION LEDGER ({filteredPayments.length} Records)
            </h3>
            <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Complete record of receipts and collected payments
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D47A1] mx-auto" />
            <p className="text-xs text-slate-500">Loading payment records...</p>
          </div>
        ) : displayedPayments.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <h4
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              No payment transactions found
            </h4>
            <p
              className="text-xs text-[#64748B] max-w-sm mx-auto"
              style={{ fontFamily: RB }}
            >
              Adjust filters or search for another receipt number, patient name
              or transaction reference.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900"
              style={{ fontFamily: PP }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table
              className="w-full text-left border-collapse text-xs"
              style={{ fontFamily: RB }}
            >
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Patient & MRN</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Inv Amount</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4">Cashier</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedPayments.map((p) => (
                  <tr
                    key={p.receiptNo}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#0D47A1]">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {p.invoiceId}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {p.paymentDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="font-bold text-[#111827] block"
                        style={{ fontFamily: PP }}
                      >
                        {p.patientName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {p.mrn}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {p.doctorName}
                    </td>
                    <td className="py-3 px-4 font-medium">{p.paymentMethod}</td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      ₹{p.invoiceAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#66BB6A]">
                      ₹{p.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[#EF4444]">
                      {p.balance > 0 ? `₹${p.balance.toLocaleString()}` : "₹0"}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {p.collectedBy}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <BillingStatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedDrawerPayment(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/billing/invoice/${p.invoiceId}`)
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Print Receipt"
                        >
                          <Printer size={14} />
                        </button>
                        <div className="relative">
                          <button
                            aria-label="Action"
                            onClick={() =>
                              setShowMoreMenuId(
                                showMoreMenuId === p.receiptNo
                                  ? null
                                  : p.receiptNo,
                              )
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {showMoreMenuId === p.receiptNo && (
                            <div
                              className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-[#E5E7EB] shadow-lg py-1 z-30 text-left text-xs"
                              style={{ fontFamily: RB }}
                            >
                              <button
                                onClick={() => {
                                  navigate(`/billing/invoice/${p.invoiceId}`);
                                  setShowMoreMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-[#111827] hover:bg-slate-50 flex items-center gap-2"
                              >
                                <FileText
                                  size={13}
                                  className="text-slate-400"
                                />
                                View Invoice
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(p.referenceNo);
                                  setShowMoreMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-[#111827] hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Copy size={13} className="text-slate-400" />
                                Copy Txn Reference
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-600"
          style={{ fontFamily: RB }}
        >
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              aria-label="Select option"
              value={rowsPerPage}
              onChange={(e) => {
                const v = Number(e.currentTarget.value);
                setRowsPerPage(Number.isFinite(v) && v > 0 ? v : 10);
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-400">
              Showing {(currentPage - 1) * rowsPerPage + 1} -{" "}
              {Math.min(currentPage * rowsPerPage, filteredPayments.length)} of{" "}
              {filteredPayments.length}
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT DETAILS DRAWER */}
      {selectedDrawerPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end transition-opacity duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-5 transition-transform duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold uppercase tracking-wider">
                  Payment Ledger Record
                </span>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {selectedDrawerPayment.receiptNo}
                </h3>
              </div>
              <button
                aria-label="Close"
                onClick={() => setSelectedDrawerPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs"
              style={{ fontFamily: RB }}
            >
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Collected Amount
                </span>
                <span
                  className="text-lg font-bold text-[#66BB6A]"
                  style={{ fontFamily: PP }}
                >
                  ₹{selectedDrawerPayment.amountPaid.toLocaleString()}
                </span>
              </div>
              <BillingStatusBadge status={selectedDrawerPayment.status} />
            </div>
            <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-100 bg-white">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Invoice ID
                  </span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {selectedDrawerPayment.invoiceId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Payment Date
                  </span>
                  <span className="font-medium text-[#111827]">
                    {selectedDrawerPayment.paymentDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Payment Mode
                  </span>
                  <span className="font-semibold text-slate-700">
                    {selectedDrawerPayment.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Transaction Reference
                  </span>
                  <span className="font-mono text-slate-600 text-[11px]">
                    {selectedDrawerPayment.referenceNo}
                  </span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-bold text-[#111827]">
                    {selectedDrawerPayment.patientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MRN:</span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {selectedDrawerPayment.mrn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Attending Doctor:</span>
                  <span className="text-slate-700">
                    {selectedDrawerPayment.doctorName}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
                  <span className="text-slate-600">Collected By:</span>
                  <span className="text-[#111827]">
                    {selectedDrawerPayment.collectedBy}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold block text-slate-700">Remarks:</span>
                {selectedDrawerPayment.remarks}
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  navigate(
                    `/billing/invoice/${selectedDrawerPayment.invoiceId}`,
                  );
                  setSelectedDrawerPayment(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900"
                style={{ fontFamily: PP }}
              >
                View Full Invoice Details
              </button>
              <button
                onClick={() => setSelectedDrawerPayment(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM STICKY BAR */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <button
          onClick={() => navigate("/billing")}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
        >
          Back to Billing Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
          style={{ fontFamily: PP }}
        >
          <Printer size={15} /> Print Report
        </button>
      </div>
    </div>
  );
}
