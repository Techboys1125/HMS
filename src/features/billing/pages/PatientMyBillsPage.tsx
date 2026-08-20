import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  FileText,
  ChevronRight,
  Download,
  Eye,
  Clock,
  Printer,
} from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import { useBilling } from "../hooks/useBilling";
import { useAuthStore } from "../../auth";
import { usePatientPortal } from "../../patients/context/usePatientPortal";
import { BillingStatusBadge } from "../components/BillingStatusBadge";
import { ROUTES } from "../../../app/routes/routes";

export function PatientMyBillsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const portal = usePatientPortal();
  const patientMrn = String(
    portal?.activeMrn || portal?.primaryMrn || user?.patientId || user?.mrn || user?.id || "",
  );

  const { invoices, loading: isLoading } = useBilling(patientMrn || undefined);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.patientName.toLowerCase().includes(q) ||
        inv.mrn.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || inv.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const summary = useMemo(() => {
    const totalBilled = invoices.reduce(
      (sum, inv) => sum + inv.invoiceAmount,
      0,
    );
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalPending = invoices.reduce((sum, inv) => sum + inv.balance, 0);
    return { totalBilled, totalPaid, totalPending, count: invoices.length };
  }, [invoices]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
  };

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div
            className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium"
            style={{ fontFamily: RB }}
          >
            <span
              className="hover:text-[#0D47A1] cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Home
            </span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">My Bills</span>
          </div>
          <h1
            className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight"
            style={{ fontFamily: PP }}
          >
            My Bills & Payments
          </h1>
          <p
            className="text-xs md:text-sm text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            View all your invoices, payment status and download official
            receipts.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print Summary</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Total Billed
            </span>
            <FileText size={16} className="text-[#0D47A1]" />
          </div>
          {isLoading ? (
            <div className="h-7 bg-slate-100 rounded animate-pulse" />
          ) : (
            <div
              className="text-xl font-bold text-[#0D47A1]"
              style={{ fontFamily: PP }}
            >
              ₹{summary.totalBilled.toLocaleString()}
            </div>
          )}
          <span className="text-[10px] text-slate-400">
            {summary.count} invoices
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Total Paid
            </span>
            <Clock size={16} className="text-[#66BB6A]" />
          </div>
          {isLoading ? (
            <div className="h-7 bg-slate-100 rounded animate-pulse" />
          ) : (
            <div
              className="text-xl font-bold text-[#66BB6A]"
              style={{ fontFamily: PP }}
            >
              ₹{summary.totalPaid.toLocaleString()}
            </div>
          )}
          <span className="text-[10px] text-[#66BB6A] font-medium">
            Settled
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Outstanding
            </span>
            <Clock size={16} className="text-[#F59E0B]" />
          </div>
          {isLoading ? (
            <div className="h-7 bg-slate-100 rounded animate-pulse" />
          ) : (
            <div
              className="text-xl font-bold text-[#F59E0B]"
              style={{ fontFamily: PP }}
            >
              ₹{summary.totalPending.toLocaleString()}
            </div>
          )}
          <span className="text-[10px] text-amber-600 font-medium">
            Awaiting payment
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Payment Rate
            </span>
            <FileText size={16} className="text-purple-600" />
          </div>
          {isLoading ? (
            <div className="h-7 bg-slate-100 rounded animate-pulse" />
          ) : (
            <div
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {summary.totalBilled > 0
                ? Math.round((summary.totalPaid / summary.totalBilled) * 100)
                : 100}
              %
            </div>
          )}
          <span className="text-[10px] text-slate-400">Of total billed</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTER */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
          style={{ fontFamily: RB }}
        >
          <div className="md:col-span-2 relative">
            <Search
              className="absolute left-3.5 top-2.5 text-slate-400"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Invoice No, Patient Name, MRN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-semibold text-slate-700 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-xs"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* 4. BILLS TABLE */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              MY INVOICES ({filteredInvoices.length})
            </h3>
            <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Complete record of your medical billing invoices
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D47A1] mx-auto" />
            <p className="text-xs text-slate-500">Loading your bills...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <h4
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              No invoices found
            </h4>
            <p
              className="text-xs text-[#64748B] max-w-sm mx-auto"
              style={{ fontFamily: RB }}
            >
              {searchQuery
                ? "Try adjusting your search or filters."
                : "You don't have any billing records yet."}
            </p>
            {searchQuery && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900"
                style={{ fontFamily: PP }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table
              className="w-full text-left border-collapse text-xs"
              style={{ fontFamily: RB }}
            >
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#0D47A1]">
                      {inv.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {inv.invoiceDate}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {inv.doctorName}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      ₹{inv.invoiceAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#66BB6A]">
                      ₹{inv.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[#EF4444]">
                      {inv.balance > 0
                        ? `₹${inv.balance.toLocaleString()}`
                        : "₹0"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <BillingStatusBadge status={inv.paymentStatus} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() =>
                            navigate(
                              ROUTES.PATIENT_PORTAL_BILLING_DETAIL.replace(
                                ":billId",
                                inv.id,
                              ),
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              ROUTES.PATIENT_PORTAL_BILLING_RECEIPT.replace(
                                ":billId",
                                inv.id,
                              ),
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          title="Print Receipt"
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              ROUTES.PATIENT_PORTAL_BILLING_RECEIPT.replace(
                                ":billId",
                                inv.id,
                              ),
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Download Receipt PDF"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BOTTOM STICKY BAR */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-all shadow-sm"
          style={{ fontFamily: PP }}
        >
          <Printer size={15} /> Print Summary
        </button>
      </div>
    </div>
  );
}

export default PatientMyBillsPage;
