import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../auth/store/auth.store";
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
import { PP, RB } from "../constants/billing.constants";

export function BillingManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const isPatient = String(role).toUpperCase() === "PATIENT";

  // Fetch bills list from API
  const [pageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  const [activeTab, setActiveTab] = useState<
    | "all"
    | "ready_for_billing"
    | "pending_payment"
    | "partially_paid"
    | "paid"
    | "refunded"
  >("all");

  const queryParams = useMemo(() => {
    if (isPatient) return undefined;
    const params: Record<string, string | number | boolean | undefined> = {
      page: currentPage - 1,
      size: pageSize,
      sortBy: "createdAt",
      direction: "desc",
      search: searchQuery || undefined,
    };

    if (activeTab === "ready_for_billing") {
      params.status = "READY_FOR_BILLING";
      params.paymentStatus = "UNPAID";
    } else if (activeTab === "pending_payment") {
      params.status = "FINALIZED";
      params.paymentStatus = "UNPAID";
    } else if (activeTab === "partially_paid") {
      params.paymentStatus = "PARTIALLY_PAID";
    } else if (activeTab === "paid") {
      params.paymentStatus = "PAID";
    } else if (activeTab === "refunded") {
      params.paymentStatus = "REFUNDED";
    }

    if (statusFilter !== "All" && activeTab === "all") {
      params.paymentStatus = statusFilter.toUpperCase().replace(" ", "_");
    }
    if (methodFilter !== "All") {
      params.paymentMethod = methodFilter.toUpperCase().replace(" ", "_");
    }
    return params;
  }, [
    isPatient,
    currentPage,
    pageSize,
    searchQuery,
    activeTab,
    statusFilter,
    methodFilter,
  ]);

  const { data: billsData, isLoading: listLoading } = useBillingList(
    isPatient ? undefined : queryParams,
  );
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

  const totalCount = billsData?.totalElements || 0;

  const normalizedRole = String(role).toUpperCase();
  const isAdminReadOnly =
    normalizedRole === "DOCTOR" ||
    normalizedRole === "NURSE" ||
    normalizedRole === "ACCOUNTANT" ||
    isPatient;
  const canCancelInvoice = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ADMIN"].includes(
    normalizedRole,
  );

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
          invoices={allInvoices}
          isAdminReadOnly={true}
          onViewInvoiceDetailsClick={(inv) =>
            navigate(`/billing/invoice/${inv.id}`)
          }
          onCancelInvoice={canCancelInvoice ? handleCancelInvoice : undefined}
          onViewPaymentHistory={(inv) =>
            navigate(`/billing/history?billId=${encodeURIComponent(inv.id)}`)
          }
          onPrintInvoice={(inv) => navigate(`/billing/invoice/${inv.id}/print`)}
        />

        <BillingPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
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
        invoices={allInvoices}
        isLoading={dashboardLoading}
      />

      {/* Unified status tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        {(
          [
            { id: "all", label: "All" },
            { id: "ready_for_billing", label: "Pending" },
            { id: "pending_payment", label: "Unpaid Invoices" },
            { id: "partially_paid", label: "Partially Paid" },
            { id: "paid", label: "Paid" },
            { id: "refunded", label: "Refunded" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#0D47A1] text-[#0D47A1]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            {activeTab === "all"
              ? "All Billing Records"
              : activeTab === "ready_for_billing"
                ? "Pending (Completed, Billable Patients)"
                : activeTab === "pending_payment"
                  ? "Unpaid Invoices"
                  : activeTab === "partially_paid"
                    ? "Partially Paid Invoices"
                    : activeTab === "paid"
                      ? "Fully Paid Invoices"
                      : "Refunded Invoices"}
          </h3>
        </div>

        {listLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D47A1] mx-auto mb-3" />
            <p className="text-xs text-slate-500" style={{ fontFamily: RB }}>
              Loading bills...
            </p>
          </div>
        ) : (
          <>
            <BillingTable
              invoices={allInvoices}
              isAdminReadOnly={isAdminReadOnly}
              onViewInvoiceDetailsClick={(inv) =>
                navigate(`/billing/invoice/${inv.id}`)
              }
              onCollectPaymentClick={(inv) =>
                navigate(`/billing/collect-payment/${inv.id}`)
              }
              onGenerateInvoiceClick={(inv) => {
                const billIdParam =
                  inv.id && inv.id !== "undefined"
                    ? `billId=${encodeURIComponent(inv.id)}&`
                    : "";
                navigate(
                  `/billing/create?${billIdParam}appointmentId=${encodeURIComponent(String(inv.appointmentId ?? ""))}&encounterId=${encodeURIComponent(String(inv.encounterId ?? ""))}&patientId=${encodeURIComponent(String(inv.patientId ?? ""))}&patientMrn=${encodeURIComponent(inv.mrn)}&doctorId=${encodeURIComponent(String(inv.doctorId ?? ""))}`,
                );
              }}
              onCancelInvoice={
                canCancelInvoice ? handleCancelInvoice : undefined
              }
              onViewPaymentHistory={(inv) =>
                navigate(
                  `/billing/history?billId=${encodeURIComponent(inv.id)}`,
                )
              }
              onPrintInvoice={(inv) =>
                navigate(`/billing/invoice/${inv.id}/print`)
              }
            />

            <BillingPagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default BillingManagementPage;
