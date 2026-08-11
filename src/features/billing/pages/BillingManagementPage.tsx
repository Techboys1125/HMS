import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../auth";
import {
  useBillingList,
  useBillingDashboard,
  billingKeys,
} from "../hooks/useBilling";
import { billingService } from "../services/billing.service";
import { BillingHeader } from "../components/BillingHeader";
import { BillingKPICards } from "../components/BillingKPICards";
import { BillingSearchBar } from "../components/BillingSearchBar";
import { BillingFilters } from "../components/BillingFilters";
import { BillingTable } from "../components/BillingTable";
import { BillingPagination } from "../components/BillingPagination";
import { mapApiBillToInvoiceRecord as mapBillToInvoice } from "../utils/billing.utils";
import { useAppointments } from "../../appointments/hooks/useAppointments";
import { PP, RB } from "../constants/billing.constants";
import { FileText } from "lucide-react";

export function BillingManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const isPatient = String(role).toUpperCase() === "PATIENT";

  // Fetch bills list from API
  const [pageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: billsData } = useBillingList(
    isPatient ? undefined : { page: currentPage - 1, size: pageSize },
  );
  const { data: dashboardData, isLoading: dashboardLoading } =
    useBillingDashboard();

  // Fetch pending billing appointments
  const pendingParams = useMemo(() => ({ status: "BILLING_PENDING" }), []);
  const { appointments: pendingAppointments } = useAppointments(
    "Receptionist",
    undefined,
    pendingParams,
  );

  const [activeTab, setActiveTab] = useState<"pending" | "register">("pending");

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      billingService.cancelBill(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  // Map API bills to InvoiceRecord format
  const allInvoices = useMemo(() => {
    if (!billsData?.bills) return [];
    return billsData.bills.map(mapBillToInvoice);
  }, [billsData]);

  // Filters & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  const filteredInvoices = useMemo(() => {
    return allInvoices.filter((inv) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.patientName.toLowerCase().includes(q) ||
        inv.mrn.toLowerCase().includes(q) ||
        inv.mobile.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || inv.paymentStatus === statusFilter;
      const matchesMethod =
        methodFilter === "All" || inv.paymentMethod === methodFilter;
      const matchesDept = deptFilter === "All" || inv.department === deptFilter;
      return matchesSearch && matchesStatus && matchesMethod && matchesDept;
    });
  }, [allInvoices, searchQuery, statusFilter, methodFilter, deptFilter]);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, currentPage, pageSize]);

  const isAdminReadOnly =
    String(role).toUpperCase() === "DOCTOR" ||
    String(role).toUpperCase() === "NURSE" ||
    isPatient;

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setMethodFilter("All");
    setDeptFilter("All");
    setCurrentPage(1);
  };

  const handleCancelInvoice = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this invoice? This action cannot be undone.",
    );
    if (!confirmed) return;
    try {
      await cancelMutation.mutateAsync({
        id,
        reason: "Cancelled by " + (user?.name || "User"),
      });
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  // Patient View
  if (isPatient) {
    return (
      <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight">
              My Bills
            </h1>
            <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
              View all your invoices, payment status and download official
              receipts.
            </p>
          </div>
        </div>

        <BillingTable
          invoices={filteredInvoices}
          isAdminReadOnly={true}
          onViewInvoiceDetailsClick={(inv) =>
            navigate(`/billing/invoice/${inv.id}`)
          }
          onCancelInvoice={handleCancelInvoice}
        />

        <BillingPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={filteredInvoices.length}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
    );
  }

  // Staff View
  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F5F9] min-h-screen p-4 md:p-6 space-y-6">
      <BillingHeader
        onGenerateInvoice={() => navigate("/billing/create")}
        onViewPayments={() => navigate("/billing/history")}
        onViewDailyReport={() => navigate("/billing/report")}
        isAdminReadOnly={isAdminReadOnly}
      />

      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <BillingSearchBar
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
          />
          <BillingFilters
            statusFilter={statusFilter}
            onStatusChange={(val) => setStatusFilter(val)}
            methodFilter={methodFilter}
            onMethodChange={(val) => setMethodFilter(val)}
            deptFilter={deptFilter}
            onDeptChange={(val) => setDeptFilter(val)}
            onReset={resetFilters}
          />
        </div>
      </div>

      <BillingKPICards
        dashboardData={dashboardData}
        invoices={filteredInvoices}
        isLoading={dashboardLoading}
      />

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "pending"
              ? "border-[#0D47A1] text-[#0D47A1]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Pending Billing ({pendingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "register"
              ? "border-[#0D47A1] text-[#0D47A1]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          OPD Billing Register ({filteredInvoices.length})
        </button>
      </div>

      {activeTab === "pending" ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#111827]">
            Pending Invoices ({pendingAppointments.length})
          </h3>
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse"
              style={{ fontFamily: RB }}
            >
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3 px-4">Appointment ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patient / MRN</th>
                  <th className="py-3 px-4">Doctor & Dept</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {pendingAppointments.length > 0 ? (
                  pendingAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td
                        className="py-3 px-4 font-bold text-[#0D47A1]"
                        style={{ fontFamily: PP }}
                      >
                        {apt.appointmentNumber || apt.id}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {apt.appointmentDate}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#111827]">
                          {apt.patientName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {apt.patientMrn || apt.mrn}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#111827]">
                          {apt.doctorName}
                        </div>
                        <div className="text-[11px] text-[#009688] font-medium">
                          {apt.departmentName || "General Medicine"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-100">
                          Billing Pending
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            navigate(
                              `/billing/create?appointmentId=${apt.id}&patientMrn=${apt.patientMrn || apt.mrn}&doctorId=${apt.doctorId}`,
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-[11px] font-semibold hover:bg-blue-900 transition-colors shadow-sm"
                        >
                          Generate Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center bg-slate-50/50"
                    >
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <FileText size={24} />
                        </div>
                        <h3
                          className="text-sm font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          No pending bills
                        </h3>
                        <p
                          className="text-xs text-slate-500"
                          style={{ fontFamily: RB }}
                        >
                          There are currently no patients waiting for invoices
                          to be generated.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#111827]">
              OPD Billing register ({filteredInvoices.length})
            </h3>
          </div>

          <BillingTable
            invoices={paginatedInvoices}
            isAdminReadOnly={isAdminReadOnly}
            onViewInvoiceDetailsClick={(inv) =>
              navigate(`/billing/invoice/${inv.id}`)
            }
            onCancelInvoice={handleCancelInvoice}
          />

          <BillingPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={filteredInvoices.length}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}
    </div>
  );
}

export default BillingManagementPage;
