import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Search,
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle2,
  ChevronRight,
  Plus,
  Copy,
  X,
  AlertCircle,
} from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import { useBillingPatientSearch, useInvoice, usePayment, billingKeys } from "../hooks/useBilling";
import { billingService } from "../services/billing.service";
import { usePatient } from "../../patients/hooks/usePatients";
import { useAppointment } from "../../appointments/hooks/useAppointment";
import { BillingStatusBadge } from "../components/BillingStatusBadge";
import type {
  PaymentMethod,
  PaymentStatus,
  BillListItem,
} from "../types/billing.types";
import type { Patient } from "../../patients/types/patient.types";

interface BillingLineItem {
  id: string;
  serviceName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

const SERVICE_CATALOG = [
  {
    serviceName: "OPD Consultation Fee",
    category: "Consultation",
    unitPrice: 500,
  },
  {
    serviceName: "ECG 12-Lead Diagnostic",
    category: "Diagnostics",
    unitPrice: 850,
  },
  { serviceName: "Blood Sugar Test", category: "Lab", unitPrice: 200 },
  {
    serviceName: "CBC (Complete Blood Count)",
    category: "Lab",
    unitPrice: 350,
  },
  { serviceName: "X-Ray Chest PA View", category: "Radiology", unitPrice: 600 },
  { serviceName: "Urine Routine", category: "Lab", unitPrice: 150 },
  {
    serviceName: "EEG (Electroencephalogram)",
    category: "Diagnostics",
    unitPrice: 1200,
  },
  { serviceName: "Physiotherapy Session", category: "Therapy", unitPrice: 800 },
  {
    serviceName: "Dressing & Bandaging",
    category: "Procedure",
    unitPrice: 250,
  },
  {
    serviceName: "Injection Administration",
    category: "Procedure",
    unitPrice: 100,
  },
];

export function CreateInvoiceWorkspacePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL params for pre-population from consultation
  const urlAppointmentId = searchParams.get("appointmentId");
  const urlEncounterId = searchParams.get("encounterId");
  const urlPatientMrn = searchParams.get("patientMrn");
  const urlDoctorId = searchParams.get("doctorId");
  const urlPatientId = searchParams.get("patientId");
  const rawUrlBillId = searchParams.get("billId");
  const urlBillId = rawUrlBillId && rawUrlBillId !== "undefined" && rawUrlBillId !== "null" ? rawUrlBillId : null;

  // Patient Search
  const [patientSearch, setPatientSearch] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedBillingRecord, setSelectedBillingRecord] =
    useState<any | null>(null);

  // Load existing bill workspace if urlBillId is present
  const { data: billWorkspace, isLoading: isBillLoading } = useQuery({
    queryKey: billingKeys.detail(urlBillId || ""),
    queryFn: () => billingService.getBill(urlBillId!),
    enabled: !!urlBillId,
  });

  const isAlreadyPaidOrFinalized = useMemo(() => {
    const status = billWorkspace?.bill?.status?.toUpperCase();
    const payStatus = billWorkspace?.bill?.paymentStatus?.toUpperCase();
    return payStatus === "PAID" || status === "FINALIZED";
  }, [billWorkspace]);

  // Resolved clinical context (from selected record, URL params, or loaded billWorkspace)
  const resolvedAppointmentId =
    selectedBillingRecord?.appointmentId || urlAppointmentId || billWorkspace?.appointment?.id;
  const resolvedEncounterId =
    selectedBillingRecord?.encounterId || urlEncounterId || billWorkspace?.encounter?.id;
  const resolvedDoctorId = selectedBillingRecord?.doctorId || urlDoctorId || billWorkspace?.doctor?.id;
  const resolvedPatientMrn = selectedBillingRecord?.patientMrn || selectedBillingRecord?.mrn || urlPatientMrn || billWorkspace?.patient?.mrn;
  const resolvedPatientId = selectedBillingRecord?.patientId || urlPatientId || billWorkspace?.patient?.id;

  // Invoice Meta
  const [patientCategory, setPatientCategory] = useState<
    "General" | "Insurance" | "Corporate" | "VIP"
  >("General");

  // Billing Line Items
  const [lineItems, setLineItems] = useState<BillingLineItem[]>([
    {
      id: "ITEM-1",
      serviceName: "OPD Consultation Fee",
      category: "Consultation",
      quantity: 1,
      unitPrice: 500,
      discount: 0,
      tax: 0,
      total: 500,
    },
  ]);

  // Discounts & Taxes
  const [discountType, setDiscountType] = useState<"Fixed" | "Percentage">(
    "Fixed",
  );
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxPercentage, setTaxPercentage] = useState<number>(18);
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);
  const [billingRemarks, setBillingRemarks] = useState("");

  // Payment Details
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Pending");
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>("UPI");
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [referenceNo, setReferenceNo] = useState("");
  const [txnNotes, setTxnNotes] = useState("");

  // Modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdBillId, setCreatedBillId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API hooks — search completed consultations from /api/v1/billing/pending-billing/search
  const { data: billingSearchData } = useBillingPatientSearch(patientSearch);
  const { createBill, addBillItem, updateBillItem, deleteBillItem, applyDiscount, finalizeBill, isCreating } = useInvoice(urlBillId || undefined);
  const { receivePayment } = usePayment(urlBillId || undefined);

  // Fetch details from backend (for URL-param-based pre-population)
  const { data: patientDetails } = usePatient(resolvedPatientMrn || "");
  const { appointment } = useAppointment(String(resolvedAppointmentId || ""));
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [workspaceInitialized, setWorkspaceInitialized] = useState(false);

  // Auto-load from URL params when navigating from Pending Billing tab
  useEffect(() => {
    if (
      resolvedPatientMrn &&
      patientDetails &&
      !selectedPatient &&
      !autoLoaded
    ) {
      queueMicrotask(() => {
        setSelectedPatient(patientDetails);
        setPatientSearch(patientDetails.fullName || patientDetails.name || "");
      });
    }
  }, [patientDetails, resolvedPatientMrn, selectedPatient, autoLoaded]);

  // Pre-populate fields once when billWorkspace is loaded
  useEffect(() => {
    if (billWorkspace && !workspaceInitialized) {
      // Pre-populate items
      if (billWorkspace.items && billWorkspace.items.length > 0) {
        const mappedItems = billWorkspace.items.map((item) => ({
          id: String(item.id),
          serviceName: item.serviceName,
          category: "Consultation",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discountAmount || 0,
          tax: item.taxRate || 0,
          total: item.totalAmount,
        }));
        setLineItems(mappedItems);
      }

      // Pre-populate discount and remarks
      if (billWorkspace.bill) {
        const type = billWorkspace.bill.discountType === "PERCENTAGE" ? "Percentage" : "Fixed";
        setDiscountType(type);
        setDiscountValue(Number(billWorkspace.bill.discountValue || 0));
        setBillingRemarks(String(billWorkspace.bill.discountReason || ""));
      }

      // Pre-populate amountReceived and status
      if (billWorkspace.summary) {
        setAmountReceived(Number(billWorkspace.summary.paidAmount || 0));
        if (billWorkspace.summary.paidAmount > 0) {
          setPaymentStatus("Paid");
        } else {
          setPaymentStatus("Pending");
        }
      }
      setWorkspaceInitialized(true);
    }
  }, [billWorkspace, workspaceInitialized]);

  // Auto-set line item fee from appointment (URL param) or billing record
  useEffect(() => {
    if (autoLoaded || urlBillId) return;
    if (appointment || selectedBillingRecord) {
      const fee = Number(
        appointment?.doctor?.consultationFee ||
          appointment?.feeAmount ||
          selectedBillingRecord?.consultationFee ||
          selectedBillingRecord?.summary?.grossAmount ||
          selectedBillingRecord?.summary?.netAmount ||
          0,
      );
      queueMicrotask(() => {
        setLineItems([
          {
            id: "ITEM-1",
            serviceName: "OPD Consultation Fee",
            category: "Consultation",
            quantity: 1,
            unitPrice: fee,
            discount: 0,
            tax: 0,
            total: fee,
          },
        ]);
        setAutoLoaded(true);
      });
    }
  }, [appointment, autoLoaded, selectedBillingRecord, urlBillId]);

  // Billing-eligible patient search results (from /api/v1/billing/pending-billing)
  const filteredBills: any[] = useMemo(() => {
    if (!billingSearchData) return [];
    return billingSearchData.slice(0, 8);
  }, [billingSearchData]);

  // Calculations
  const rawSubtotal = useMemo(
    () => lineItems.reduce((acc, item) => acc + item.total, 0),
    [lineItems],
  );

  const calculatedDiscount = useMemo(() => {
    if (discountType === "Percentage")
      return (rawSubtotal * discountValue) / 100;
    return discountValue;
  }, [rawSubtotal, discountType, discountValue]);

  const taxableAmount = Math.max(0, rawSubtotal - calculatedDiscount);
  const calculatedTax = useMemo(() => {
    if (billWorkspace?.summary != null) {
      return billWorkspace.summary.taxAmount;
    }
    return (taxableAmount * taxPercentage) / 100;
  }, [billWorkspace, taxableAmount, taxPercentage]);
  const grandTotal = Math.round(
    taxableAmount + calculatedTax + Number(additionalCharges),
  );
  const balanceDue = Math.max(0, grandTotal - Number(amountReceived));

  // Update item totals on row change
  const handleUpdateItem = (
    id: string,
    field: keyof BillingLineItem,
    val: string | number,
  ) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          const base = updated.quantity * updated.unitPrice;
          const disc = updated.discount;
          const afterDisc = Math.max(0, base - disc);
          const tx = (afterDisc * updated.tax) / 100;
          updated.total = Math.round(afterDisc + tx);
          return updated;
        }
        return item;
      }),
    );
  };

  const handleAddLineItem = () => {
    const defaultService = SERVICE_CATALOG[0];
    const newItem: BillingLineItem = {
      id: `ITEM-${Date.now()}`,
      serviceName: defaultService.serviceName,
      category: defaultService.category,
      quantity: 1,
      unitPrice: defaultService.unitPrice,
      discount: 0,
      tax: 0,
      total: defaultService.unitPrice,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleDuplicateRow = (item: BillingLineItem) => {
    setLineItems([...lineItems, { ...item, id: `ITEM-${Date.now()}` }]);
  };

  const handleRemoveRow = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((i) => i.id !== id));
  };

  const handleGenerateInvoice = useCallback(async () => {
    if (!selectedPatient || !resolvedPatientMrn) return;
    if (!resolvedPatientId || !resolvedAppointmentId || !resolvedEncounterId) {
      setValidationError(
        "This billable visit is missing a patient ID, appointment ID, or encounter ID. Select the patient from the completed-consultation results.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      let billId = Number(urlBillId);

      if (!billId) {
        // Create the bill with real values from the clinical context
        const result = await createBill({
          appointmentId: Number(resolvedAppointmentId),
          encounterId: Number(resolvedEncounterId),
          patientMrn: resolvedPatientMrn || selectedPatient.mrn,
          doctorId: Number(resolvedDoctorId),
          patientId: Number(resolvedPatientId),
        });
        billId = result.billId;

        // Add line items
        for (const item of lineItems) {
          await addBillItem({
            billId,
            payload: { serviceId: item.serviceName, quantity: item.quantity },
          });
        }
      } else {
        // Sync items for existing bill
        const existingItems = billWorkspace?.items || [];
        
        // 1. Delete items that are no longer in lineItems
        for (const extItem of existingItems) {
          const stillExists = lineItems.some(
            (item) => item.serviceName === extItem.serviceName
          );
          if (!stillExists) {
            await deleteBillItem({ billId, itemId: extItem.id });
          }
        }

        // 2. Add or update items
        for (const item of lineItems) {
          const extItem = existingItems.find(
            (ext) => ext.serviceName === item.serviceName
          );
          if (extItem) {
            if (extItem.quantity !== item.quantity) {
              await updateBillItem({
                billId,
                itemId: extItem.id,
                quantity: item.quantity,
              });
            }
          } else {
            await addBillItem({
              billId,
              payload: { serviceId: item.serviceName, quantity: item.quantity },
            });
          }
        }
      }

      // Apply discount
      await applyDiscount({
        billId,
        discountType: discountType === "Percentage" ? "PERCENTAGE" : "FIXED",
        value: discountValue,
        reason: billingRemarks || "Invoice discount",
      });

      // Receive payment if amountReceived > 0
      if (amountReceived > 0) {
        await receivePayment({
          billId,
          payments: [
            {
              method: paymentMode,
              amount: amountReceived,
              referenceNumber: referenceNo || undefined,
            },
          ],
          remarks: txnNotes || undefined,
        });
      }

      // Finalize the bill
      await finalizeBill(billId);

      setCreatedBillId(String(billId));
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to create/finalize invoice:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedPatient,
    lineItems,
    calculatedDiscount,
    discountType,
    discountValue,
    billingRemarks,
    createBill,
    addBillItem,
    updateBillItem,
    deleteBillItem,
    applyDiscount,
    finalizeBill,
    receivePayment,
    resolvedAppointmentId,
    resolvedEncounterId,
    resolvedDoctorId,
    resolvedPatientMrn,
    resolvedPatientId,
    urlBillId,
    billWorkspace,
    amountReceived,
    paymentMode,
    referenceNo,
    txnNotes,
  ]);

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
              onClick={() => navigate("/billing")}
            >
              Home
            </span>
            <ChevronRight size={12} />
            <span
              className="hover:text-[#0D47A1] cursor-pointer"
              onClick={() => navigate("/billing")}
            >
              Billing & Payment
            </span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Create Invoice</span>
          </div>
          <h1
            className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight"
            style={{ fontFamily: PP }}
          >
            Create Invoice Workspace
          </h1>
          <p
            className="text-xs md:text-sm text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Generate an invoice for completed consultation services, calculate
            charges, collect payment information and prepare the final bill.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate("/billing")}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateInvoice}
            disabled={isSubmitting || isBillLoading || !selectedPatient || isAlreadyPaidOrFinalized}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            style={{ fontFamily: PP }}
          >
            <CheckCircle2 size={15} />
            {isSubmitting ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </div>

      {/* Duplicate Prevention / Already Finalized Warning Banner */}
      {isAlreadyPaidOrFinalized && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p
              className="text-xs font-semibold text-amber-700"
              style={{ fontFamily: PP }}
            >
              This consultation has already been invoiced or finalized.
            </p>
            <p
              className="text-[11px] text-amber-600 mt-1"
              style={{ fontFamily: RB }}
            >
              Invoice number: <strong>{billWorkspace?.bill?.billNumber}</strong> (Status: {billWorkspace?.bill?.paymentStatus || billWorkspace?.bill?.status}). You cannot modify or regenerate this invoice.
            </p>
          </div>
          <button
            onClick={() => navigate(`/billing/invoice/${urlBillId}`)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shadow-sm whitespace-nowrap"
            style={{ fontFamily: PP }}
          >
            View Invoice Details
          </button>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p
              className="text-xs font-semibold text-red-700"
              style={{ fontFamily: PP }}
            >
              {validationError}
            </p>
            <p
              className="text-[11px] text-red-600 mt-1"
              style={{ fontFamily: RB }}
            >
              Go back to the consultation and click{" "}
              <strong>"Generate Invoice"</strong> to pass the required context.
            </p>
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          {/* SECTION 01: PATIENT INFORMATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <div>
                  <h2
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    SECTION 01: PATIENT INFORMATION
                  </h2>
                  <p
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Search and select patient to auto-fill OPD visit records
                  </p>
                </div>
              </div>
              {selectedPatient && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#009688]">
                  OPD Consult Completed
                </span>
              )}
            </div>

            <div className="relative">
              <label
                className="block text-xs font-semibold text-slate-700 mb-1"
                style={{ fontFamily: RB }}
              >
                Patient Search (MRN, Name, or Mobile) *
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={15}
                />
                <input
                  type="text"
                  value={patientSearch}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  placeholder="Search patient by MRN, name, or mobile..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                  style={{ fontFamily: RB }}
                />
              </div>
              {showSearchDropdown && filteredBills.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-30 max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {filteredBills.map((bill: BillListItem) => (
                    <div
                      key={`${bill.billId ?? bill.id ?? bill.billNumber}-${bill.appointmentId}`}
                      onClick={() => {
                        setSelectedBillingRecord(bill);
                        setSelectedPatient(null);
                        setAutoLoaded(false);
                        setPatientSearch(bill.patientName || "");
                        setShowSearchDropdown(false);
                      }}
                      className="p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div
                            className="text-xs font-bold text-[#111827]"
                            style={{ fontFamily: PP }}
                          >
                            {bill.patientName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {bill.patientMrn}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Dr. {bill.doctorName || "N/A"}
                          </div>
                        </div>
                        <div className="text-right text-[10px] text-slate-500">
                          <div>Bill: {bill.billNumber}</div>
                          <div>APT #{bill.appointmentId || "—"}</div>
                          <div>ENC #{bill.encounterId || "—"}</div>
                          <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-amber-50 text-amber-700">
                              Ready for Billing
                            </span>
                          </div>
                          {bill.summary && (
                            <div className="font-semibold text-[#111827] mt-0.5">
                              ₹{(bill.summary.netAmount ?? 0).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedPatient && (
              <div
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs"
                style={{ fontFamily: RB }}
              >
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Patient Name
                  </span>
                  <span
                    className="font-bold text-[#111827] text-sm"
                    style={{ fontFamily: PP }}
                  >
                    {selectedPatient.fullName || selectedPatient.name || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {selectedPatient.mrn}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Age & Gender
                  </span>
                  <span className="font-medium text-[#111827]">
                    {selectedPatient.age || "N/A"} Yrs /{" "}
                    {selectedPatient.gender || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Mobile Number
                  </span>
                  <span className="font-medium text-[#111827]">
                    {selectedPatient.phone ||
                      selectedPatient.mobileNumber ||
                      "N/A"}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">
                    Patient Category:
                  </span>
                  <div className="flex items-center gap-2">
                    {(
                      ["General", "Insurance", "Corporate", "VIP"] as const
                    ).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPatientCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${patientCategory === cat ? "bg-[#0D47A1] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clinical Context (from billing record or URL params) */}
          {(selectedBillingRecord || resolvedAppointmentId) && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <h2
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  SECTION 01B: CLINICAL CONTEXT
                </h2>
              </div>
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs"
                style={{ fontFamily: RB }}
              >
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Attending Doctor
                  </span>
                  <span className="font-medium text-[#111827]">
                    {selectedBillingRecord?.doctorName ||
                      appointment?.doctorName ||
                      "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Department
                  </span>
                  <span className="font-medium text-[#111827]">
                    {appointment?.departmentName || "General Medicine"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Appointment ID
                  </span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {resolvedAppointmentId
                      ? `#${resolvedAppointmentId}`
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Consultation ID
                  </span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {selectedBillingRecord?.consultationId || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Encounter ID
                  </span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {resolvedEncounterId ? `ENC-${resolvedEncounterId}` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Consultation Date
                  </span>
                  <span className="font-medium text-[#111827]">
                    {appointment?.appointmentDate ||
                      selectedBillingRecord?.createdAt ||
                      "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Invoice No.
                  </span>
                  <span className="font-medium text-slate-500">
                    Assigned by the billing service when generated
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 02: BILLING ITEMS */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h2
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    SECTION 02: BILLING ITEMS
                  </h2>
                  <p
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Add charges, procedures, diagnostics, or consultation fees
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-xs"
                style={{ fontFamily: PP }}
              >
                <Plus size={14} /> Add Charge
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table
                className="w-full text-left border-collapse text-xs"
                style={{ fontFamily: RB }}
              >
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Service Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Discount</th>
                    <th className="py-2.5 px-3 text-right">Tax %</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <select
                          value={item.serviceName}
                          onChange={(e) => {
                            const found = SERVICE_CATALOG.find(
                              (s) => s.serviceName === e.target.value,
                            );
                            if (found) {
                              handleUpdateItem(
                                item.id,
                                "serviceName",
                                found.serviceName,
                              );
                              handleUpdateItem(
                                item.id,
                                "category",
                                found.category,
                              );
                              handleUpdateItem(
                                item.id,
                                "unitPrice",
                                found.unitPrice,
                              );
                            }
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-[#111827] focus:border-[#0D47A1] focus:outline-none"
                        >
                          {SERVICE_CATALOG.map((s) => (
                            <option key={s.serviceName} value={s.serviceName}>
                              {s.serviceName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(
                                item.id,
                                "quantity",
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 font-bold text-[#111827]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(
                                item.id,
                                "quantity",
                                item.quantity + 1,
                              )
                            }
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-[#111827]">
                        ₹{item.unitPrice}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            handleUpdateItem(
                              item.id,
                              "discount",
                              Number(e.target.value),
                            )
                          }
                          className="w-16 px-2 py-1 text-right rounded-lg border border-slate-200 bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) =>
                            handleUpdateItem(
                              item.id,
                              "tax",
                              Number(e.target.value),
                            )
                          }
                          className="w-14 px-2 py-1 text-right rounded-lg border border-slate-200 bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-[#0D47A1]">
                        ₹{item.total.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateRow(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            title="Duplicate"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(item.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-[#EF4444] hover:bg-red-50"
                            title="Delete"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-bold"
              style={{ fontFamily: PP }}
            >
              <span className="text-slate-600">Line Items Subtotal:</span>
              <span className="text-base text-[#0D47A1]">
                ₹{rawSubtotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* SECTION 03: DISCOUNTS & TAXES */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
                <DollarSign size={16} />
              </div>
              <div>
                <h2
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  SECTION 03: DISCOUNTS & TAXES
                </h2>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Configure invoice-level discounts, GST/VAT rates, and billing
                  remarks
                </p>
              </div>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
              style={{ fontFamily: RB }}
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Discount Type
                </label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="discType"
                      checked={discountType === "Fixed"}
                      onChange={() => setDiscountType("Fixed")}
                      className="text-[#0D47A1]"
                    />
                    <span>Fixed (₹)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="discType"
                      checked={discountType === "Percentage"}
                      onChange={() => setDiscountType("Percentage")}
                      className="text-[#0D47A1]"
                    />
                    <span>Percentage (%)</span>
                  </label>
                </div>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tax Percentage (%)
                </label>
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Additional Charges (₹)
                </label>
                <input
                  type="number"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(Number(e.target.value))}
                  placeholder="e.g. PPE / Admin Fee"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
              style={{ fontFamily: RB }}
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Billing Remarks & Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={billingRemarks}
                  onChange={(e) => setBillingRemarks(e.target.value)}
                  placeholder="Notes for accountant or insurance verification..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 04: PAYMENT INFORMATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FileText size={16} />
              </div>
              <div>
                <h2
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  SECTION 04: PAYMENT INFORMATION
                </h2>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Record initial payment status, mode, and transaction
                  references
                </p>
              </div>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
              style={{ fontFamily: RB }}
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Payment Status *
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as PaymentStatus)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-bold focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Payment Mode *
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) =>
                    setPaymentMode(e.target.value as PaymentMethod)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-semibold focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">
                    Bank Transfer (NEFT/IMPS)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Amount Received (₹) *
                </label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-bold text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Txn / Reference Number
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. UPI/890123/OKAX"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Transaction Notes
                </label>
                <input
                  type="text"
                  value={txnNotes}
                  onChange={(e) => setTxnNotes(e.target.value)}
                  placeholder="Optional cashier note..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - INVOICE SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">
                  Summary
                </span>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Invoice Summary
                </h3>
              </div>
              <BillingStatusBadge status={paymentStatus} />
            </div>
            <div
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
              style={{ fontFamily: RB }}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice No:</span>
                <span className="font-bold text-[#0D47A1]">
                  Assigned on generation
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-[#111827]">
                  {selectedPatient?.fullName || selectedPatient?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Services:</span>
                <span className="font-bold text-[#111827]">
                  {lineItems.length} items
                </span>
              </div>
            </div>
            <div
              className="space-y-2 text-xs border-t border-b border-gray-100 py-3"
              style={{ fontFamily: RB }}
            >
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#111827]">
                  ₹{rawSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#66BB6A]">
                <span>Discount ({discountType}):</span>
                <span className="font-semibold">
                  - ₹{calculatedDiscount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax GST ({taxPercentage}%):</span>
                <span className="font-semibold">
                  + ₹{Math.round(calculatedTax).toLocaleString()}
                </span>
              </div>
              {additionalCharges > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Additional Charges:</span>
                  <span className="font-semibold">
                    + ₹{additionalCharges.toLocaleString()}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between text-base font-bold text-[#111827] pt-2 border-t border-slate-200"
                style={{ fontFamily: PP }}
              >
                <span>Grand Total:</span>
                <span className="text-[#0D47A1]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-[#66BB6A]">
                <span>Amount Paid:</span>
                <span>₹{amountReceived.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#EF4444]">
                <span>Balance Due:</span>
                <span>₹{balanceDue.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={handleGenerateInvoice}
                disabled={isSubmitting || isBillLoading || !selectedPatient || isAlreadyPaidOrFinalized}
                className="w-full py-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-50"
                style={{ fontFamily: PP }}
              >
                {isSubmitting
                  ? "Generating..."
                  : `Generate & Collect (₹${grandTotal.toLocaleString()})`}
              </button>
              <button
                onClick={() => navigate("/billing")}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM STICKY ACTION BAR */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <button
          onClick={() => navigate("/billing")}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
        >
          Back to Billing
        </button>
        <button
          onClick={handleGenerateInvoice}
          disabled={isSubmitting || isBillLoading || !selectedPatient || isAlreadyPaidOrFinalized}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-all shadow-sm disabled:opacity-50"
          style={{ fontFamily: PP }}
        >
          <CheckCircle2 size={15} />
          {isSubmitting ? "Generating..." : "Generate Invoice"}
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mx-auto border-2 border-green-200">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Invoice Created Successfully!
              </h3>
              <p
                className="text-xs text-[#64748B] mt-1"
                style={{ fontFamily: RB }}
              >
                Invoice{" "}
                <span className="font-bold text-[#0D47A1]">
                  {createdBillId || "the billing service"}
                </span>{" "}
                has been issued.
              </p>
            </div>
            <div
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-left"
              style={{ fontFamily: RB }}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">Grand Total:</span>
                <span className="font-bold text-[#111827]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-[#66BB6A]">
                  ₹{amountReceived.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <BillingStatusBadge status={paymentStatus} />
              </div>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(
                    createdBillId
                      ? `/billing/invoice/${createdBillId}`
                      : "/billing",
                  );
                }}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                View Invoice Details
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/billing");
                }}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Back to Billing Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateInvoiceWorkspacePage;
