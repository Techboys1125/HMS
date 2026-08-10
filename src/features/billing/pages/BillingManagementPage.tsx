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

export function BillingManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const isPatient = String(role).toUpperCase() === "PATIENT";

  // Fetch bills list from API
  const [page] = useState(0);
  const [pageSize] = useState(20);
  const {
    data: billsData,
  } = useBillingList(isPatient ? undefined : { page, size: pageSize });
  const { data: dashboardData, isLoading: dashboardLoading } =
    useBillingDashboard();

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
  const [currentPage, setCurrentPage] = useState(1);

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

      <BillingKPICards
        dashboardData={dashboardData}
        invoices={filteredInvoices}
        isLoading={dashboardLoading}
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
    </div>
  );
}

export default BillingManagementPage;
