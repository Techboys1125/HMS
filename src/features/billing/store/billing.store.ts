import { useSyncExternalStore } from "react";
import type {
  InvoiceRecord,
  BillingConfiguration,
  BillingReport,
  PaymentStatus,
  PaymentMethod,
} from "../types/billing.types";
import { DEFAULT_CONFIGURATION } from "../constants/billing.constants";

export interface BillingState {
  invoices: InvoiceRecord[];
  selectedInvoice: InvoiceRecord | null;
  paymentHistory: InvoiceRecord[];
  filters: {
    searchQuery: string;
    statusFilter: string;
    methodFilter: string;
    deptFilter: string;
    doctorFilter: string;
  };
  loading: boolean;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
  reports: BillingReport | null;
  billingConfiguration: BillingConfiguration;
}

const STORAGE_KEY = "hms-billing-storage";

function loadInitialState(): BillingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        return {
          invoices: parsed.invoices || [],
          selectedInvoice: parsed.selectedInvoice || null,
          paymentHistory: parsed.paymentHistory || [],
          filters: parsed.filters || {
            searchQuery: "",
            statusFilter: "All",
            methodFilter: "All",
            deptFilter: "All",
            doctorFilter: "All",
          },
          loading: false,
          pagination: parsed.pagination || {
            currentPage: 1,
            pageSize: 10,
          },
          reports: parsed.reports || null,
          billingConfiguration: parsed.billingConfiguration || DEFAULT_CONFIGURATION,
        };
      }
    }
  } catch (e) {
    console.error("Failed to load billing state from localStorage:", e);
  }

  return {
    invoices: [],
    selectedInvoice: null,
    paymentHistory: [],
    filters: {
      searchQuery: "",
      statusFilter: "All",
      methodFilter: "All",
      deptFilter: "All",
      doctorFilter: "All",
    },
    loading: false,
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    reports: null,
    billingConfiguration: DEFAULT_CONFIGURATION,
  };
}

let currentState: BillingState = loadInitialState();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function saveState(state: BillingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save billing state to localStorage:", e);
  }
}

export const billingStoreActions = {
  getState: (): BillingState => currentState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setInvoices: (invoices: InvoiceRecord[]) => {
    currentState = { ...currentState, invoices };
    saveState(currentState);
    notify();
  },

  addInvoice: (invoice: InvoiceRecord) => {
    currentState = {
      ...currentState,
      invoices: [invoice, ...currentState.invoices],
    };
    saveState(currentState);
    notify();
  },

  updateInvoice: (invoiceId: string, fields: Partial<InvoiceRecord>) => {
    currentState = {
      ...currentState,
      invoices: currentState.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, ...fields } : inv
      ),
      selectedInvoice:
        currentState.selectedInvoice?.id === invoiceId
          ? { ...currentState.selectedInvoice, ...fields }
          : currentState.selectedInvoice,
    };
    saveState(currentState);
    notify();
  },

  setSelectedInvoice: (invoice: InvoiceRecord | null) => {
    currentState = { ...currentState, selectedInvoice: invoice };
    saveState(currentState);
    notify();
  },

  setFilters: (filters: Partial<BillingState["filters"]>) => {
    currentState = {
      ...currentState,
      filters: { ...currentState.filters, ...filters },
      pagination: { ...currentState.pagination, currentPage: 1 }, // Reset to page 1 on filter
    };
    saveState(currentState);
    notify();
  },

  setPagination: (pagination: Partial<BillingState["pagination"]>) => {
    currentState = {
      ...currentState,
      pagination: { ...currentState.pagination, ...pagination },
    };
    saveState(currentState);
    notify();
  },

  setLoading: (loading: boolean) => {
    currentState = { ...currentState, loading };
    notify();
  },

  setConfiguration: (config: BillingConfiguration) => {
    currentState = { ...currentState, billingConfiguration: config };
    saveState(currentState);
    notify();
  },

  setReports: (reports: BillingReport | null) => {
    currentState = { ...currentState, reports };
    saveState(currentState);
    notify();
  },

  resetFilters: () => {
    currentState = {
      ...currentState,
      filters: {
        searchQuery: "",
        statusFilter: "All",
        methodFilter: "All",
        deptFilter: "All",
        doctorFilter: "All",
      },
      pagination: {
        ...currentState.pagination,
        currentPage: 1,
      },
    };
    saveState(currentState);
    notify();
  },
};

export function useBillingStore<T = BillingState>(
  selector?: (state: BillingState) => T
): T {
  const snapshot = useSyncExternalStore(
    billingStoreActions.subscribe,
    billingStoreActions.getState,
    billingStoreActions.getState
  );

  return selector ? selector(snapshot) : (snapshot as unknown as T);
}
