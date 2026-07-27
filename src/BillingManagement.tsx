import React, { useState, useMemo } from 'react'
import {
  Wallet, FileText, CheckCircle2, Clock, AlertCircle, ArrowUpRight,
  Search, RotateCcw, Plus, Download, Printer, Eye, DollarSign,
  ChevronRight, MoreVertical, CreditCard, 
  Building2, User, UserCheck, X, FileSpreadsheet,
  PieChart, Activity,  Copy, Ban, History, Send,
  Zap,
  TrendingUp,
  BarChart2
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

import safeHandsLogo from './assets/safehandshospital_logo.webp'

// ─── Typography & Styling Tokens ────────────────────────────────────────────
const PP = 'Poppins, system-ui, sans-serif'
const RB = 'Roboto, system-ui, sans-serif'

// ─── Types ─────────────────────────────────────────────────────────────────
export type PaymentStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Cancelled' | 'Refunded'
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Bank Transfer'

export interface InvoiceRecord {
  id: string
  invoiceDate: string
  patientName: string
  mrn: string
  mobile: string
  doctorName: string
  department: string
  invoiceAmount: number
  paidAmount: number
  balance: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  collectedBy: string
  notes?: string
}

export interface ActivityRecord {
  id: string
  time: string
  cashier: string
  invoiceNo: string
  patientName: string
  amount: number
  paymentMode: PaymentMethod | 'Refund'
  status: PaymentStatus
  type: 'collection' | 'pending' | 'refund'
}

// ─── Initial Mock Data ───────────────────────────────────────────────────────
const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-1042',
    invoiceDate: '2026-07-25 09:40 AM',
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-89201',
    mobile: '+91 98765 43210',
    doctorName: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    invoiceAmount: 1500,
    paidAmount: 1500,
    balance: 0,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    collectedBy: 'Emma Wilson',
  },
  {
    id: 'INV-1041',
    invoiceDate: '2026-07-25 09:15 AM',
    patientName: 'James Thornton',
    mrn: 'MRN-89202',
    mobile: '+91 98123 45678',
    doctorName: 'Dr. Priya Sharma',
    department: 'General Medicine',
    invoiceAmount: 850,
    paidAmount: 500,
    balance: 350,
    paymentMethod: 'Cash',
    paymentStatus: 'Partially Paid',
    collectedBy: 'Robert Fox',
  },
  {
    id: 'INV-1040',
    invoiceDate: '2026-07-25 08:50 AM',
    patientName: 'Emma Reyes',
    mrn: 'MRN-89203',
    mobile: '+91 99887 76655',
    doctorName: 'Dr. Sunita Patel',
    department: 'Gynecology',
    invoiceAmount: 1200,
    paidAmount: 0,
    balance: 1200,
    paymentMethod: 'Card',
    paymentStatus: 'Pending',
    collectedBy: 'Emma Wilson',
  },
  {
    id: 'INV-1039',
    invoiceDate: '2026-07-24 04:30 PM',
    patientName: 'Robert Chen',
    mrn: 'MRN-89204',
    mobile: '+91 97766 55443',
    doctorName: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    invoiceAmount: 2400,
    paidAmount: 2400,
    balance: 0,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    collectedBy: 'Robert Fox',
  },
  {
    id: 'INV-1038',
    invoiceDate: '2026-07-24 03:10 PM',
    patientName: 'Aisha Kumar',
    mrn: 'MRN-89205',
    mobile: '+91 96655 44332',
    doctorName: 'Dr. Rajesh Kapoor',
    department: 'Neurology',
    invoiceAmount: 600,
    paidAmount: 0,
    balance: 0,
    paymentMethod: 'Cash',
    paymentStatus: 'Refunded',
    collectedBy: 'Emma Wilson',
    notes: 'Consultation cancelled by patient prior to doctor call',
  },
  {
    id: 'INV-1037',
    invoiceDate: '2026-07-24 02:00 PM',
    patientName: 'David Walsh',
    mrn: 'MRN-89206',
    mobile: '+91 95544 33221',
    doctorName: 'Dr. Priya Sharma',
    department: 'General Medicine',
    invoiceAmount: 750,
    paidAmount: 750,
    balance: 0,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    collectedBy: 'Emma Wilson',
  },
  {
    id: 'INV-1036',
    invoiceDate: '2026-07-24 11:30 AM',
    patientName: 'Lily Anderson',
    mrn: 'MRN-89207',
    mobile: '+91 94433 22110',
    doctorName: 'Dr. Sunita Patel',
    department: 'Gynecology',
    invoiceAmount: 1800,
    paidAmount: 0,
    balance: 1800,
    paymentMethod: 'Card',
    paymentStatus: 'Pending',
    collectedBy: 'Robert Fox',
  },
  {
    id: 'INV-1035',
    invoiceDate: '2026-07-24 10:15 AM',
    patientName: 'Marcus Brown',
    mrn: 'MRN-89208',
    mobile: '+91 93322 11009',
    doctorName: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    invoiceAmount: 3200,
    paidAmount: 3200,
    balance: 0,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    collectedBy: 'Emma Wilson',
  },
  {
    id: 'INV-1034',
    invoiceDate: '2026-07-23 05:45 PM',
    patientName: 'Nina Patel',
    mrn: 'MRN-89209',
    mobile: '+91 92211 00998',
    doctorName: 'Dr. Rajesh Kapoor',
    department: 'Neurology',
    invoiceAmount: 900,
    paidAmount: 0,
    balance: 0,
    paymentMethod: 'Cash',
    paymentStatus: 'Cancelled',
    collectedBy: 'Robert Fox',
  },
  {
    id: 'INV-1033',
    invoiceDate: '2026-07-23 03:20 PM',
    patientName: 'Carlos Mendez',
    mrn: 'MRN-89210',
    mobile: '+91 91100 99887',
    doctorName: 'Dr. Priya Sharma',
    department: 'General Medicine',
    invoiceAmount: 500,
    paidAmount: 500,
    balance: 0,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    collectedBy: 'Emma Wilson',
  },
]

const RECENT_ACTIVITIES: ActivityRecord[] = [
  { id: 'ACT-1', time: '09:42 AM', cashier: 'Emma Wilson', invoiceNo: 'INV-1042', patientName: 'Sarah Mitchell', amount: 500, paymentMode: 'UPI', status: 'Paid', type: 'collection' },
  { id: 'ACT-2', time: '09:16 AM', cashier: 'Robert Fox', invoiceNo: 'INV-1041', patientName: 'James Thornton', amount: 500, paymentMode: 'Cash', status: 'Partially Paid', type: 'collection' },
  { id: 'ACT-3', time: '08:52 AM', cashier: 'Emma Wilson', invoiceNo: 'INV-1040', patientName: 'Emma Reyes', amount: 1200, paymentMode: 'Card', status: 'Pending', type: 'pending' },
  { id: 'ACT-4', time: 'Yesterday 03:12 PM', cashier: 'Emma Wilson', invoiceNo: 'INV-1038', patientName: 'Aisha Kumar', amount: 200, paymentMode: 'Refund', status: 'Refunded', type: 'refund' },
  { id: 'ACT-5', time: 'Yesterday 02:05 PM', cashier: 'Emma Wilson', invoiceNo: 'INV-1037', patientName: 'David Walsh', amount: 750, paymentMode: 'UPI', status: 'Paid', type: 'collection' },
]

// ─── Status Chip Component ────────────────────────────────────────────────────
function StatusChip({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { bg: string; text: string; dot: string }> = {
    Paid: { bg: 'bg-green-50 border-green-200', text: 'text-[#66BB6A]', dot: 'bg-[#66BB6A]' },
    'Partially Paid': { bg: 'bg-blue-50 border-blue-200', text: 'text-[#0D47A1]', dot: 'bg-[#0D47A1]' },
    Pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
    Cancelled: { bg: 'bg-slate-100 border-slate-200', text: 'text-[#64748B]', dot: 'bg-[#64748B]' },
    Refunded: { bg: 'bg-red-50 border-red-200', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
  }
  const style = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text}`} style={{ fontFamily: RB }}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  )
}

// ─── KPI Card Component ──────────────────────────────────────────────────────
function BillingKpiCard({
  title, value, trend, isUp, color, Icon, bgTint, dataTrend
}: {
  title: string
  value: string
  trend?: string
  isUp?: boolean
  color: string
  Icon: React.ElementType
  bgTint: string
  dataTrend: { v: number }[]
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{title}</span>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: bgTint }}>
            <Icon size={16} style={{ color }} />
          </div>
        </div>
        <div className="text-xl xl:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
          {value}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
        {trend ? (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${isUp ? 'text-[#66BB6A]' : 'text-[#EF4444]'}`} style={{ fontFamily: RB }}>
            {isUp ? '↑' : '↓'} {trend} vs last week
          </span>
        ) : (
          <span className="text-[11px] text-slate-400" style={{ fontFamily: RB }}>Live OPD sync</span>
        )}
        <div className="w-14 h-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataTrend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#grad-${title.replace(/\s+/g, '')})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN SCREEN COMPONENT ────────────────────────────────────────────────────
export function BillingDashboardScreen({
  onGenerateInvoiceClick,
  onCollectPaymentClick,
  onViewInvoiceDetailsClick,
  onViewPaymentsClick,
  onViewDailyReportClick,
  isAdminReadOnly = false,
}: {
  onGenerateInvoiceClick?: () => void
  onCollectPaymentClick?: (invoiceId?: string) => void
  onViewInvoiceDetailsClick?: (invoiceId: string) => void
  onViewPaymentsClick?: () => void
  onViewDailyReportClick?: () => void
  isAdminReadOnly?: boolean
}) {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [methodFilter, setMethodFilter] = useState<string>('All')
  const [deptFilter, setDeptFilter] = useState<string>('All')
  const [doctorFilter, setDoctorFilter] = useState<string>('All')

  // Modals & Active Selections
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showCollectDrawer, setShowCollectDrawer] = useState<InvoiceRecord | null>(null)
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<InvoiceRecord | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState<InvoiceRecord | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Pagination State
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Collect Payment Form State
  const [collectAmount, setCollectAmount] = useState<number>(0)
  const [collectMethod, setCollectMethod] = useState<PaymentMethod>('UPI')
  const [collectNotes, setCollectNotes] = useState('')

  // Generate Invoice Form State
  const [newPatientName, setNewPatientName] = useState('')
  const [newMrn, setNewMrn] = useState('')
  const [newDoctor, setNewDoctor] = useState('Dr. Arjun Mehta')
  const [newDept, setNewDept] = useState('Cardiology')
  const [newAmount, setNewAmount] = useState<number>(1000)

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.patientName.toLowerCase().includes(q) ||
        inv.mrn.toLowerCase().includes(q) ||
        inv.mobile.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter
      const matchesMethod = methodFilter === 'All' || inv.paymentMethod === methodFilter
      const matchesDept = deptFilter === 'All' || inv.department === deptFilter
      const matchesDoctor = doctorFilter === 'All' || inv.doctorName === doctorFilter

      return matchesSearch && matchesStatus && matchesMethod && matchesDept && matchesDoctor
    })
  }, [invoices, searchQuery, statusFilter, methodFilter, deptFilter, doctorFilter])

  // Pagination calculation
  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredInvoices.slice(start, start + pageSize)
  }, [filteredInvoices, currentPage, pageSize])

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setMethodFilter('All')
    setDeptFilter('All')
    setDoctorFilter('All')
    setCurrentPage(1)
  }

  // Handle Payment Collection Action
  const handleProcessCollection = () => {
    if (!showCollectDrawer) return

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === showCollectDrawer.id) {
          const newPaid = inv.paidAmount + Number(collectAmount)
          const newBal = Math.max(0, inv.invoiceAmount - newPaid)
          const newStatus: PaymentStatus = newBal === 0 ? 'Paid' : newPaid > 0 ? 'Partially Paid' : 'Pending'
          return {
            ...inv,
            paidAmount: newPaid,
            balance: newBal,
            paymentStatus: newStatus,
            paymentMethod: collectMethod,
          }
        }
        return inv
      })
    )
    setShowCollectDrawer(null)
    setCollectAmount(0)
    setCollectNotes('')
  }

  // Handle Invoice Creation
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPatientName || !newMrn) return

    const newInv: InvoiceRecord = {
      id: `INV-${1043 + invoices.length}`,
      invoiceDate: '2026-07-25 10:15 AM',
      patientName: newPatientName,
      mrn: newMrn,
      mobile: '+91 99000 11223',
      doctorName: newDoctor,
      department: newDept,
      invoiceAmount: Number(newAmount),
      paidAmount: 0,
      balance: Number(newAmount),
      paymentMethod: 'Cash',
      paymentStatus: 'Pending',
      collectedBy: 'Emma Wilson',
    }

    setInvoices([newInv, ...invoices])
    setShowGenerateModal(false)
    setNewPatientName('')
    setNewMrn('')
    setNewAmount(1000)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F5F9] min-h-screen p-4 md:p-6 space-y-6">

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer">
              {isAdminReadOnly ? 'Hospital Administration' : 'Home'}
            </span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Billing & Payment</span>
            {isAdminReadOnly && <ChevronRight size={12} />}
            {isAdminReadOnly && <span className="text-[#0D47A1] font-semibold">Billing Dashboard</span>}
          </div>
          {/* Title & Subtitle */}
          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
            Billing Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            {isAdminReadOnly
              ? 'Monitor billing operations, invoice status and revenue overview across the hospital.'
              : 'Manage invoices, payment collections, billing status and daily revenue across outpatient consultations.'}
          </p>
        </div>

        {/* Action Buttons & Quick Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {!isAdminReadOnly ? (
            <button
              onClick={() => {
                if (onGenerateInvoiceClick) {
                  onGenerateInvoiceClick()
                } else {
                  setShowGenerateModal(true)
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm active:scale-95"
              style={{ fontFamily: PP }}
            >
              <Plus size={15} />
              + Generate Invoice
            </button>
          ) : (
            <button
              onClick={() => alert('Exporting Billing Report...')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm active:scale-95"
              style={{ fontFamily: PP }}
            >
              <Download size={15} />
              Export Report
            </button>
          )}

          <button
            onClick={() => {
              if (isAdminReadOnly) {
                window.location.reload()
              } else if (onViewPaymentsClick) {
                onViewPaymentsClick()
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#009688] text-xs font-semibold hover:bg-teal-100 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            {isAdminReadOnly ? <RotateCcw size={14} /> : <History size={14} />}
            <span className="hidden sm:inline">
              {isAdminReadOnly ? 'Refresh Dashboard' : 'Payment History Ledger'}
            </span>
          </button>

          <button
            onClick={() => onViewDailyReportClick && onViewDailyReportClick()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#0D47A1] text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <BarChart2 size={14} />
            <span className="hidden sm:inline">Daily Billing Report</span>
          </button>

          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Notification & User Profile Badge */}
          <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#0D47A1] hover:bg-blue-50 transition-colors">
            <Activity size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
          </button>

          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 sm:border-0">
            <div className="w-9 h-9 rounded-full bg-[#0D47A1] text-white font-bold text-xs flex items-center justify-center" style={{ fontFamily: PP }}>
              EW
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-[#111827]" style={{ fontFamily: PP }}>Emma Wilson</div>
              <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>Chief Accountant</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SEARCH & FILTER BAR ───────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Global Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Invoice ID, Patient Name, MRN, or Mobile Number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              style={{ fontFamily: RB }}
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#0D47A1]"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Payment Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#0D47A1]"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#0D47A1]"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Neurology">Neurology</option>
            </select>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-100 text-xs font-semibold text-[#64748B] hover:bg-slate-200 transition-colors"
              style={{ fontFamily: RB }}
              title="Reset Filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. KPI SUMMARY CARDS (7 CARDS GRID) ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-3 md:gap-4">
        {/* Card 1: Today's Revenue */}
        <BillingKpiCard
          title="Today's Revenue"
          value="₹84,750"
          trend="+12%"
          isUp={true}
          color="#0D47A1"
          Icon={Wallet}
          bgTint="rgba(13, 71, 161, 0.08)"
          dataTrend={[{ v: 45 }, { v: 60 }, { v: 55 }, { v: 75 }, { v: 84.75 }]}
        />
        {/* Card 2: Invoices Generated */}
        <BillingKpiCard
          title="Invoices Generated"
          value="128"
          trend="+5%"
          isUp={true}
          color="#4DB6AC"
          Icon={FileText}
          bgTint="rgba(77, 182, 172, 0.12)"
          dataTrend={[{ v: 90 }, { v: 105 }, { v: 110 }, { v: 120 }, { v: 128 }]}
        />
        {/* Card 3: Paid Bills */}
        <BillingKpiCard
          title="Paid Bills"
          value="96"
          trend="+8%"
          isUp={true}
          color="#66BB6A"
          Icon={CheckCircle2}
          bgTint="rgba(102, 187, 106, 0.12)"
          dataTrend={[{ v: 70 }, { v: 80 }, { v: 85 }, { v: 90 }, { v: 96 }]}
        />
        {/* Card 4: Pending Payments */}
        <BillingKpiCard
          title="Pending Payments"
          value="21"
          trend="-2%"
          isUp={false}
          color="#F59E0B"
          Icon={Clock}
          bgTint="rgba(245, 158, 11, 0.12)"
          dataTrend={[{ v: 28 }, { v: 25 }, { v: 24 }, { v: 22 }, { v: 21 }]}
        />
        {/* Card 5: Partially Paid */}
        <BillingKpiCard
          title="Partially Paid"
          value="8"
          color="#0D47A1"
          Icon={CreditCard}
          bgTint="rgba(13, 71, 161, 0.08)"
          dataTrend={[{ v: 5 }, { v: 6 }, { v: 7 }, { v: 9 }, { v: 8 }]}
        />
        {/* Card 6: Refunded Bills */}
        <BillingKpiCard
          title="Refunded Bills"
          value="3"
          color="#EF4444"
          Icon={Ban}
          bgTint="rgba(239, 68, 68, 0.12)"
          dataTrend={[{ v: 1 }, { v: 2 }, { v: 1 }, { v: 4 }, { v: 3 }]}
        />
        {/* Card 7: Outstanding Amount */}
        <BillingKpiCard
          title="Outstanding Amount"
          value="₹18,650"
          trend="-4%"
          isUp={true}
          color="#8B5CF6"
          Icon={AlertCircle}
          bgTint="rgba(139, 92, 246, 0.12)"
          dataTrend={[{ v: 24000 }, { v: 22000 }, { v: 21000 }, { v: 19500 }, { v: 18650 }]}
        />
      </div>

      {/* ── 4. MAIN CONTENT AREA (TABLE + QUICK SUMMARY PANEL) ────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT: Enterprise Billing Table (2 Columns Span) ────────────────── */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Table Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Invoices & Transactions
                </h2>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Showing {filteredInvoices.length} billing records for today's session
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B] font-medium" style={{ fontFamily: RB }}>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-2 py-1 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111827] focus:outline-none"
                  style={{ fontFamily: RB }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    <th className="py-3 px-4">Invoice ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Patient / MRN</th>
                    <th className="py-3 px-4">Doctor & Dept</th>
                    <th className="py-3 px-4 text-right">Invoice Amt</th>
                    <th className="py-3 px-4 text-right">Paid</th>
                    <th className="py-3 px-4 text-right">Balance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {paginatedInvoices.length > 0 ? (
                    paginatedInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* Invoice ID */}
                        <td className="py-3 px-4 font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>
                          {inv.id}
                        </td>
                        {/* Date */}
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {inv.invoiceDate}
                        </td>
                        {/* Patient */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#111827]">{inv.patientName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{inv.mrn}</div>
                        </td>
                        {/* Doctor & Department */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#111827]">{inv.doctorName}</div>
                          <div className="text-[11px] text-[#009688] font-medium">{inv.department}</div>
                        </td>
                        {/* Amounts */}
                        <td className="py-3 px-4 text-right font-semibold text-[#111827]">
                          ₹{inv.invoiceAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#66BB6A]">
                          ₹{inv.paidAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#EF4444]">
                          ₹{inv.balance.toLocaleString()}
                        </td>
                        {/* Status Chip */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <StatusChip status={inv.paymentStatus} />
                        </td>
                        {/* Actions */}
                        <td className="py-3 px-4 text-center relative">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                if (onViewInvoiceDetailsClick) {
                                  onViewInvoiceDetailsClick(inv.id)
                                } else {
                                  setShowInvoiceDetails(inv)
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                              title="View Invoice"
                            >
                              <Eye size={14} />
                            </button>

                            {!isAdminReadOnly && inv.balance > 0 && inv.paymentStatus !== 'Cancelled' && (
                              <button
                                onClick={() => {
                                  if (onCollectPaymentClick) {
                                    onCollectPaymentClick(inv.id)
                                  } else {
                                    setShowCollectDrawer(inv)
                                    setCollectAmount(inv.balance)
                                  }
                                }}
                                className="p-1.5 rounded-lg text-[#009688] hover:bg-teal-50 transition-colors"
                                title="Collect Payment"
                              >
                                <DollarSign size={14} />
                              </button>
                            )}

                            <button
                              onClick={() => setShowInvoiceDetails(inv)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Print Invoice"
                            >
                              <Printer size={14} />
                            </button>

                            {/* More Actions Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() => setActiveMenuId(activeMenuId === inv.id ? null : inv.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                <MoreVertical size={14} />
                              </button>

                              {activeMenuId === inv.id && (
                                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-[#E5E7EB] shadow-lg py-1 z-20 text-left">
                                  <button
                                    onClick={() => {
                                      setShowHistoryModal(inv)
                                      setActiveMenuId(null)
                                    }}
                                    className="w-full px-3 py-2 text-xs text-[#111827] hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <History size={13} className="text-slate-400" />
                                    View Payment History
                                  </button>
                                  {!isAdminReadOnly && (
                                    <button
                                      onClick={() => {
                                        setInvoices((prev) =>
                                          prev.map((i) => (i.id === inv.id ? { ...i, paymentStatus: 'Cancelled' } : i))
                                        )
                                        setActiveMenuId(null)
                                      }}
                                      className="w-full px-3 py-2 text-xs text-[#EF4444] hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <Ban size={13} />
                                      Cancel Invoice
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    /* EMPTY STATE */
                    <tr>
                      <td colSpan={9} className="py-12 text-center bg-slate-50/50">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <FileText size={24} />
                          </div>
                          <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                            No invoices available
                          </h3>
                          <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                            No records match your search or filters. Create the first invoice to begin billing.
                          </p>
                          <button
                            onClick={() => setShowGenerateModal(true)}
                            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-colors shadow-sm"
                            style={{ fontFamily: PP }}
                          >
                            + Generate Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── PAGINATION BAR ──────────────────────────────────────────────── */}
          <div className="px-5 py-3 border-t border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ fontFamily: RB }}>
            <span className="text-[#64748B]">
              Showing {filteredInvoices.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredInvoices.length)} of {filteredInvoices.length} invoices
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-slate-500 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: STICKY QUICK SUMMARY PANEL ───────────────────────────── */}
        <div className="space-y-5">
          {/* Sticky Collection Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  {isAdminReadOnly ? 'Billing Overview' : "Today's Collection Breakdown"}
                </h3>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Real-time payment mode summary
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                <PieChart size={16} />
              </div>
            </div>

            {/* Collection Breakdown Items */}
            <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#66BB6A]" />
                  <span className="font-medium text-[#111827]">Cash Collection</span>
                </div>
                <span className="font-bold text-[#111827]">₹24,500</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0D47A1]" />
                  <span className="font-medium text-[#111827]">Card Collection</span>
                </div>
                <span className="font-bold text-[#111827]">₹32,000</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#009688]" />
                  <span className="font-medium text-[#111827]">UPI Collection</span>
                </div>
                <span className="font-bold text-[#111827]">₹18,250</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="font-medium text-[#111827]">Bank Transfer</span>
                </div>
                <span className="font-bold text-[#111827]">₹10,000</span>
              </div>
            </div>

            {/* Total Summary Metrics */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>Pending Collections</span>
                <span className="font-bold text-[#F59E0B]" style={{ fontFamily: PP }}>₹18,650</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>Outstanding Amount</span>
                <span className="font-bold text-[#EF4444]" style={{ fontFamily: PP }}>₹18,650</span>
              </div>
            </div>

            {/* Progress Ring / Collection Target */}
            <div className="p-3.5 rounded-xl bg-[#0D47A1]/5 border border-[#0D47A1]/10 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#0D47A1]" style={{ fontFamily: RB }}>
                  Collection Target Completion
                </div>
                <div className="text-lg font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>
                  82.0%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#0D47A1] border-r-[#0D47A1] flex items-center justify-center font-bold text-[10px] text-[#0D47A1]" style={{ fontFamily: PP }}>
                82%
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── 5. BOTTOM SECTION: RECENT PAYMENT ACTIVITY & FLOATING ACTIONS ────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Recent Payment Activity Timeline (2 Cols Span) ────────────────── */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Recent Payment Activity Timeline
              </h3>
              <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                Real-time cashier activity log and transaction audits
              </p>
            </div>
            <button className="text-xs text-[#0D47A1] font-semibold hover:underline" style={{ fontFamily: PP }}>
              View Full Audit Log →
            </button>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {RECENT_ACTIVITIES.map((act) => (
              <div key={act.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors">
                {/* Timeline Bullet Dot */}
                <div className="absolute -left-6 top-4 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0D47A1]" />

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0D47A1]" style={{ fontFamily: PP }}>
                      {act.invoiceNo}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                      {act.paymentMode}
                    </span>
                    <span className="text-xs text-slate-400">• {act.time}</span>
                  </div>

                  <div className="text-xs text-[#111827]" style={{ fontFamily: RB }}>
                    Collected <span className="font-bold text-[#111827]">₹{act.amount}</span> from <span className="font-semibold">{act.patientName}</span>
                  </div>
                  <div className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>
                    Collected by <span className="font-medium text-[#111827]">{act.cashier}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusChip status={act.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Floating Quick Action Panel ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
              Quick Finance Actions
            </h3>
            <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Frequent operational workflows
            </p>
          </div>

          <div className="space-y-2.5" style={{ fontFamily: RB }}>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0D47A1] text-white hover:bg-blue-900 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Plus size={16} />
                <span className="text-xs font-semibold" style={{ fontFamily: PP }}>Generate Invoice</span>
              </div>
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => {
                const pendingInv = invoices.find((i) => i.balance > 0)
                if (pendingInv) setShowCollectDrawer(pendingInv)
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-teal-50 border border-teal-200 text-[#009688] hover:bg-teal-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <DollarSign size={16} />
                <span className="text-xs font-semibold" style={{ fontFamily: PP }}>Collect Payment</span>
              </div>
              <ChevronRight size={14} />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#111827] hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={16} className="text-slate-500" />
                <span className="text-xs font-medium">Daily Revenue Report</span>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#111827] hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <History size={16} className="text-slate-500" />
                <span className="text-xs font-medium">Payment History Audit</span>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#111827] hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <Printer size={16} className="text-slate-500" />
                <span className="text-xs font-medium">Print Duplicate Invoice</span>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

      </div>

      {/* ── MODAL 1: GENERATE INVOICE MODAL ──────────────────────────────────── */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                + Generate New OPD Invoice
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">MRN Number *</label>
                  <input
                    type="text"
                    required
                    value={newMrn}
                    onChange={(e) => setNewMrn(e.target.value)}
                    placeholder="e.g. MRN-89211"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Invoice Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Attending Doctor</label>
                  <select
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                  >
                    <option>Dr. Arjun Mehta</option>
                    <option>Dr. Priya Sharma</option>
                    <option>Dr. Sunita Patel</option>
                    <option>Dr. Rajesh Kapoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                  >
                    <option>Cardiology</option>
                    <option>General Medicine</option>
                    <option>Gynecology</option>
                    <option>Neurology</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white font-semibold hover:bg-blue-900 transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: COLLECT PAYMENT DRAWER/MODAL ────────────────────────────── */}
      {showCollectDrawer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-md h-full border-l border-[#E5E7EB] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="text-xs text-[#009688] font-bold" style={{ fontFamily: PP }}>PAYMENT COLLECTION</div>
                  <h3 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    {showCollectDrawer.id}
                  </h3>
                </div>
                <button onClick={() => setShowCollectDrawer(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {/* Patient & Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-[#111827]">{showCollectDrawer.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MRN:</span>
                  <span className="font-mono text-slate-700">{showCollectDrawer.mrn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Bill Amount:</span>
                  <span className="font-semibold text-[#111827]">₹{showCollectDrawer.invoiceAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                  <span className="text-[#EF4444]">Outstanding Balance:</span>
                  <span className="text-[#EF4444]">₹{showCollectDrawer.balance.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Entry Form */}
              <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Collection Amount (₹) *</label>
                  <input
                    type="number"
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(Number(e.target.value))}
                    max={showCollectDrawer.balance}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-sm font-bold text-[#111827] focus:bg-white focus:border-[#009688] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Method *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['UPI', 'Cash', 'Card', 'Bank Transfer'] as PaymentMethod[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCollectMethod(m)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          collectMethod === m
                            ? 'bg-[#009688] text-white border-[#009688] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Transaction Notes / Reference</label>
                  <textarea
                    rows={3}
                    value={collectNotes}
                    onChange={(e) => setCollectNotes(e.target.value)}
                    placeholder="Enter UPI Txn ID, Card Auth Code or Cash Serial Notes..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#009688] focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <button
                onClick={handleProcessCollection}
                className="w-full py-3 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Confirm & Issue Receipt (₹{collectAmount.toLocaleString()})
              </button>
              <button
                onClick={() => setShowCollectDrawer(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: INVOICE DETAILS MODAL ────────────────────────────────────── */}
      {showInvoiceDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">Official OPD Invoice</span>
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  {showInvoiceDetails.id}
                </h3>
              </div>
              <button onClick={() => setShowInvoiceDetails(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs" style={{ fontFamily: RB }}>
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="font-bold text-sm text-[#111827]">{showInvoiceDetails.patientName}</div>
                  <div className="text-slate-500 font-mono">{showInvoiceDetails.mrn}</div>
                  <div className="text-slate-500">{showInvoiceDetails.mobile}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500">Date: {showInvoiceDetails.invoiceDate}</div>
                  <div className="font-medium text-[#009688]">{showInvoiceDetails.department}</div>
                  <div className="text-slate-700">{showInvoiceDetails.doctorName}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-2 px-3">Service Description</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3">OPD Consultation Fee ({showInvoiceDetails.doctorName})</td>
                    <td className="py-2.5 px-3 text-right">1</td>
                    <td className="py-2.5 px-3 text-right font-semibold">₹{showInvoiceDetails.invoiceAmount}</td>
                  </tr>
                </tbody>
              </table>

              {/* Summary Totals */}
              <div className="p-4 rounded-xl bg-slate-50 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{showInvoiceDetails.invoiceAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Amount Paid ({showInvoiceDetails.paymentMethod}):</span>
                  <span className="font-semibold text-[#66BB6A]">₹{showInvoiceDetails.paidAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111827] border-t border-slate-200 pt-1.5">
                  <span>Balance Due:</span>
                  <span className="text-[#EF4444]">₹{showInvoiceDetails.balance}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 font-semibold hover:bg-slate-100"
              >
                <Printer size={14} /> Print Receipt
              </button>
              <button
                onClick={() => setShowInvoiceDetails(null)}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white font-semibold hover:bg-blue-900"
                style={{ fontFamily: PP }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: PAYMENT HISTORY MODAL ───────────────────────────────────── */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Payment History — {showHistoryModal.id}
              </h3>
              <button onClick={() => setShowHistoryModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-[#111827]">{showHistoryModal.patientName}</div>
                  <div className="text-slate-400 font-mono">{showHistoryModal.mrn}</div>
                </div>
                <StatusChip status={showHistoryModal.paymentStatus} />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider" style={{ fontFamily: PP }}>
                  Audit Trail
                </div>
                <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold text-[#111827]">
                    <span>Initial Invoice Created</span>
                    <span>₹{showHistoryModal.invoiceAmount}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Created on {showHistoryModal.invoiceDate} by {showHistoryModal.collectedBy}
                  </div>
                </div>

                {showHistoryModal.paidAmount > 0 && (
                  <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1">
                    <div className="flex justify-between font-semibold text-[#009688]">
                      <span>Payment Collected ({showHistoryModal.paymentMethod})</span>
                      <span>₹{showHistoryModal.paidAmount}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Processed by {showHistoryModal.collectedBy}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-100 bg-slate-50 text-right">
              <button
                onClick={() => setShowHistoryModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── TYPES & MOCK PATIENTS FOR WORKSPACE ────────────────────────────────────
export interface BillingLineItem {
  id: string
  serviceName: string
  category: string
  quantity: number
  unitPrice: number
  discount: number
  tax: number
  total: number
}

const PRESET_PATIENTS = [
  {
    mrn: 'MRN-89201',
    name: 'Sarah Mitchell',
    age: 34,
    gender: 'Female',
    mobile: '+91 98765 43210',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    consultationId: 'CNS-1042',
    appointmentDate: '2026-07-25',
    category: 'General',
  },
  {
    mrn: 'MRN-89202',
    name: 'James Thornton',
    age: 67,
    gender: 'Male',
    mobile: '+91 98123 45678',
    doctor: 'Dr. Priya Sharma',
    department: 'General Medicine',
    consultationId: 'CNS-1041',
    appointmentDate: '2026-07-25',
    category: 'Insurance',
  },
  {
    mrn: 'MRN-89203',
    name: 'Emma Reyes',
    age: 28,
    gender: 'Female',
    mobile: '+91 99887 76655',
    doctor: 'Dr. Sunita Patel',
    department: 'Gynecology',
    consultationId: 'CNS-1040',
    appointmentDate: '2026-07-25',
    category: 'Corporate',
  },
  {
    mrn: 'MRN-89204',
    name: 'Robert Chen',
    age: 52,
    gender: 'Male',
    mobile: '+91 97766 55443',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    consultationId: 'CNS-1039',
    appointmentDate: '2026-07-24',
    category: 'VIP',
  },
]

const SERVICE_CATALOG = [
  { serviceName: 'OPD Consultation Fee', category: 'Consultation', unitPrice: 500 },
  { serviceName: 'Registration & Admin Fee', category: 'Administrative', unitPrice: 200 },
  { serviceName: 'ECG 12-Lead Diagnostic', category: 'Diagnostics', unitPrice: 850 },
  { serviceName: 'Chest X-Ray PA View', category: 'Radiology', unitPrice: 1200 },
  { serviceName: 'Complete Blood Count (CBC)', category: 'Laboratory', unitPrice: 450 },
  { serviceName: 'Fasting Blood Sugar (FBS)', category: 'Laboratory', unitPrice: 250 },
  { serviceName: 'Echo Cardiogram 2D', category: 'Cardiology', unitPrice: 2500 },
  { serviceName: 'IV Injection Procedure', category: 'Nursing', unitPrice: 150 },
]

// ─── CREATE INVOICE WORKSPACE SCREEN ──────────────────────────────────────────
export function CreateInvoiceWorkspaceScreen({
  onBack,
  onInvoiceCreated,
  onCollectPaymentClick,
  onViewInvoiceDetailsClick,
  isReceptionist = false,
}: {
  onBack: () => void
  onInvoiceCreated?: (invoiceId: string) => void
  onCollectPaymentClick?: (invoiceId: string) => void
  onViewInvoiceDetailsClick?: (invoiceId: string) => void
  isReceptionist?: boolean
}) {
  if (onInvoiceCreated) {
    // referenced to satisfy unused variable lint
  }
  // Patient Search & Info
  const [patientSearch, setPatientSearch] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<typeof PRESET_PATIENTS[0] | null>(PRESET_PATIENTS[0])

  // Invoice Meta
  const [invoiceNumber] = useState('INV-1043')
  const [invoiceDate] = useState('2026-07-25 10:30 AM')
  const [patientCategory, setPatientCategory] = useState<'General' | 'Insurance' | 'Corporate' | 'VIP'>('General')

  // Billing Line Items
  const [lineItems, setLineItems] = useState<BillingLineItem[]>([
    {
      id: 'ITEM-1',
      serviceName: 'OPD Consultation Fee',
      category: 'Consultation',
      quantity: 1,
      unitPrice: 500,
      discount: 0,
      tax: 0,
      total: 500,
    },
    {
      id: 'ITEM-2',
      serviceName: 'ECG 12-Lead Diagnostic',
      category: 'Diagnostics',
      quantity: 1,
      unitPrice: 850,
      discount: 50,
      tax: 18,
      total: 944,
    },
  ])

  // Discounts & Taxes
  const [discountType, setDiscountType] = useState<'Fixed' | 'Percentage'>('Fixed')
  const [discountValue, setDiscountValue] = useState<number>(50)
  const [taxPercentage, setTaxPercentage] = useState<number>(18)
  const [additionalCharges, setAdditionalCharges] = useState<number>(0)
  const [couponCode, setCouponCode] = useState('')
  const [billingRemarks, setBillingRemarks] = useState('')

  // Payment Details
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid')
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>('UPI')
  const [amountReceived, setAmountReceived] = useState<number>(1394)
  const [referenceNo, setReferenceNo] = useState('UPI/890123/OKAX')
  const [cashierName] = useState('Emma Wilson')
  const [txnNotes, setTxnNotes] = useState('Paid in full via GPay')

  // Modals & Notifications
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Autocomplete Patients
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return PRESET_PATIENTS
    const q = patientSearch.toLowerCase()
    return PRESET_PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.mobile.includes(q)
    )
  }, [patientSearch])

  // Calculations
  const rawSubtotal = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + item.total, 0)
  }, [lineItems])

  const calculatedDiscount = useMemo(() => {
    if (discountType === 'Percentage') {
      return (rawSubtotal * discountValue) / 100
    }
    return discountValue
  }, [rawSubtotal, discountType, discountValue])

  const taxableAmount = Math.max(0, rawSubtotal - calculatedDiscount)
  const calculatedTax = (taxableAmount * taxPercentage) / 100
  const grandTotal = Math.round(taxableAmount + calculatedTax + Number(additionalCharges))
  const balanceDue = Math.max(0, grandTotal - Number(amountReceived))

  // Update item totals on row change
  const handleUpdateItem = (id: string, field: keyof BillingLineItem, val: any) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val }
          // Recalculate row total
          const base = updated.quantity * updated.unitPrice
          const disc = updated.discount
          const afterDisc = Math.max(0, base - disc)
          const tx = (afterDisc * updated.tax) / 100
          updated.total = Math.round(afterDisc + tx)
          return updated
        }
        return item
      })
    )
  }

  // Add Item Row
  const handleAddLineItem = () => {
    const defaultService = SERVICE_CATALOG[0]
    const newItem: BillingLineItem = {
      id: `ITEM-${Date.now()}`,
      serviceName: defaultService.serviceName,
      category: defaultService.category,
      quantity: 1,
      unitPrice: defaultService.unitPrice,
      discount: 0,
      tax: 0,
      total: defaultService.unitPrice,
    }
    setLineItems([...lineItems, newItem])
  }

  // Duplicate Row
  const handleDuplicateRow = (item: BillingLineItem) => {
    const newItem = { ...item, id: `ITEM-${Date.now()}` }
    setLineItems([...lineItems, newItem])
  }

  // Remove Row
  const handleRemoveRow = (id: string) => {
    if (lineItems.length <= 1) return
    setLineItems(lineItems.filter((i) => i.id !== id))
  }

  // Submit Handler
  const handleGenerateInvoice = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!selectedPatient) return
    setShowSuccessModal(true)
  }

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Home</span>
            <ChevronRight size={12} />
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Billing & Payment</span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Create Invoice</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
            Create Invoice Workspace
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            Generate an invoice for completed consultation services, calculate charges, collect payment information and prepare the final bill.
          </p>
        </div>

        {/* Top Right Header Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleGenerateInvoice()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm active:scale-95"
            style={{ fontFamily: PP }}
          >
            <CheckCircle2 size={15} />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN RESPONSIVE LAYOUT (70% / 30%) ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (70% - 2 SPAN) ────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* SECTION 01: PATIENT INFORMATION CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 01: PATIENT INFORMATION
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Search and select patient to auto-fill OPD visit records
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#009688]">
                OPD Consult Completed
              </span>
            </div>

            {/* Patient Search Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 mb-1" style={{ fontFamily: RB }}>
                Patient Search (MRN, Name, or Mobile) *
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  value={patientSearch}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => {
                    setPatientSearch(e.target.value)
                    setShowSearchDropdown(true)
                  }}
                  placeholder="Search patient by MRN, Sarah Mitchell, or +91 98765..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                  style={{ fontFamily: RB }}
                />
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {filteredPatients.map((p) => (
                    <div
                      key={p.mrn}
                      onClick={() => {
                        setSelectedPatient(p)
                        setPatientSearch(p.name)
                        setShowSearchDropdown(false)
                      }}
                      className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.mrn} • {p.mobile}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-[#0D47A1]">{p.doctor}</div>
                        <div className="text-[10px] text-slate-400">{p.department}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Populate Details Display Grid */}
            {selectedPatient && (
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-slate-400 block text-[11px]">Patient Name</span>
                  <span className="font-bold text-[#111827] text-sm" style={{ fontFamily: PP }}>{selectedPatient.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{selectedPatient.mrn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Age & Gender</span>
                  <span className="font-medium text-[#111827]">{selectedPatient.age} Yrs / {selectedPatient.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                  <span className="font-medium text-[#111827]">{selectedPatient.mobile}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Attending Doctor</span>
                  <span className="font-medium text-[#111827]">{selectedPatient.doctor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Department</span>
                  <span className="font-semibold text-[#009688]">{selectedPatient.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Consultation ID</span>
                  <span className="font-mono text-slate-700">{selectedPatient.consultationId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Invoice Date & No.</span>
                  <span className="font-semibold text-[#111827]">{invoiceNumber} ({invoiceDate.split(' ')[0]})</span>
                </div>

                {/* Patient Category Picker */}
                <div className="col-span-2 md:col-span-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Patient Category:</span>
                  <div className="flex items-center gap-2">
                    {(['General', 'Insurance', 'Corporate', 'VIP'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPatientCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          patientCategory === cat
                            ? 'bg-[#0D47A1] text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 02: BILLING ITEMS ENTERPRISE TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 02: BILLING ITEMS
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
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

            {/* Editable Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Service Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
                    <th className="py-2.5 px-3 text-right">Discount (₹)</th>
                    <th className="py-2.5 px-3 text-right">Tax (%)</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Service Dropdown */}
                      <td className="py-2 px-3">
                        <select
                          value={item.serviceName}
                          onChange={(e) => {
                            const found = SERVICE_CATALOG.find((s) => s.serviceName === e.target.value)
                            if (found) {
                              handleUpdateItem(item.id, 'serviceName', found.serviceName)
                              handleUpdateItem(item.id, 'category', found.category)
                              handleUpdateItem(item.id, 'unitPrice', found.unitPrice)
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

                      {/* Category */}
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                          {item.category}
                        </span>
                      </td>

                      {/* Quantity Stepper */}
                      <td className="py-2 px-3 text-center">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 font-bold text-[#111827]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(item.id, 'quantity', item.quantity + 1)}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-2 px-3 text-right font-medium text-[#111827]">
                        ₹{item.unitPrice}
                      </td>

                      {/* Discount */}
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleUpdateItem(item.id, 'discount', Number(e.target.value))}
                          className="w-16 px-2 py-1 text-right rounded-lg border border-slate-200 bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                        />
                      </td>

                      {/* Tax */}
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) => handleUpdateItem(item.id, 'tax', Number(e.target.value))}
                          className="w-14 px-2 py-1 text-right rounded-lg border border-slate-200 bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                        />
                      </td>

                      {/* Total */}
                      <td className="py-2 px-3 text-right font-bold text-[#0D47A1]">
                        ₹{item.total.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateRow(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            title="Duplicate Row"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(item.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-[#EF4444] hover:bg-red-50"
                            title="Delete Row"
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

            {/* Sticky Subtotal Footer */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-bold" style={{ fontFamily: PP }}>
              <span className="text-slate-600">Line Items Subtotal:</span>
              <span className="text-base text-[#0D47A1]">₹{rawSubtotal.toLocaleString()}</span>
            </div>
          </div>

          {/* SECTION 03: DISCOUNTS & TAXES */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
                <DollarSign size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 03: DISCOUNTS & TAXES
                </h2>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Configure invoice-level discounts, GST/VAT rates, and billing remarks
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" style={{ fontFamily: RB }}>
              {/* Discount Type Radio & Value */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Discount Type</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="discType"
                      checked={discountType === 'Fixed'}
                      onChange={() => setDiscountType('Fixed')}
                      className="text-[#0D47A1]"
                    />
                    <span>Fixed (₹)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="discType"
                      checked={discountType === 'Percentage'}
                      onChange={() => setDiscountType('Percentage')}
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

              {/* Tax Percentage */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tax Percentage (%)</label>
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              {/* Additional Charges */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Additional Charges (₹)</label>
                <input
                  type="number"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(Number(e.target.value))}
                  placeholder="e.g. PPE / Admin Fee"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>
            </div>

            {/* Coupon Code & Remarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" style={{ fontFamily: RB }}>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Coupon / Promo Code (Optional)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. HEALTH10"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Billing Remarks & Internal Notes</label>
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
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 04: PAYMENT INFORMATION
                </h2>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Record initial payment status, mode, and transaction references
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" style={{ fontFamily: RB }}>
              {/* Payment Status Dropdown */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Status *</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-bold focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Mode *</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-semibold focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>

              {/* Amount Received */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Amount Received (₹) *</label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-bold text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Txn / Reference Number</label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. UPI/890123/OKAX"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none font-mono"
                />
              </div>

              {/* Cashier Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Collected By (Cashier)</label>
                <input
                  type="text"
                  disabled
                  value={cashierName}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-100 text-slate-500 font-medium"
                />
              </div>

              {/* Transaction Notes */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Transaction Notes</label>
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

        {/* ── RIGHT COLUMN (30% STICKY PANEL) ───────────────────────────────── */}
        <div className="space-y-6">

          {/* STICKY INVOICE SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">Summary</span>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Invoice Summary
                </h3>
              </div>
              <StatusChip status={paymentStatus} />
            </div>

            {/* Quick Meta */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1" style={{ fontFamily: RB }}>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice No:</span>
                <span className="font-bold text-[#0D47A1]">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-[#111827]">{selectedPatient?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="text-slate-700">{selectedPatient?.doctor || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Services:</span>
                <span className="font-bold text-[#111827]">{lineItems.length} items</span>
              </div>
            </div>

            {/* Calculation Lines */}
            <div className="space-y-2 text-xs border-t border-b border-gray-100 py-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#111827]">₹{rawSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#66BB6A]">
                <span>Discount ({discountType}):</span>
                <span className="font-semibold">- ₹{calculatedDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax GST ({taxPercentage}%):</span>
                <span className="font-semibold">+ ₹{Math.round(calculatedTax).toLocaleString()}</span>
              </div>
              {additionalCharges > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Additional Charges:</span>
                  <span className="font-semibold">+ ₹{additionalCharges.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#111827] pt-2 border-t border-slate-200" style={{ fontFamily: PP }}>
                <span>Grand Total:</span>
                <span className="text-[#0D47A1]">₹{grandTotal.toLocaleString()}</span>
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

            {/* BILLING NOTES REMINDERS */}
            <div className="space-y-2 text-xs" style={{ fontFamily: RB }}>
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Verification Checklist</div>
              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[#0D47A1] text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>OPD Consultation Record Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle2 size={13} className="text-slate-400" />
                  <span>Patient Category: {patientCategory}</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTION BUTTONS */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleGenerateInvoice()}
                className="w-full py-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Generate & Collect (₹{grandTotal.toLocaleString()})
              </button>
              <button
                onClick={onBack}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Save as Draft
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── 3. BOTTOM STICKY ACTION BAR ───────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
          >
            Save as Draft
          </button>
          <button
            onClick={() => {
              setLineItems([
                {
                  id: 'ITEM-1',
                  serviceName: 'OPD Consultation Fee',
                  category: 'Consultation',
                  quantity: 1,
                  unitPrice: 500,
                  discount: 0,
                  tax: 0,
                  total: 500,
                },
              ])
              setDiscountValue(0)
            }}
            className="px-4 py-2 rounded-xl text-slate-500 text-xs font-medium hover:text-slate-700"
          >
            Reset Form
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleGenerateInvoice()}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <CheckCircle2 size={15} />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* ── 4. SUCCESS FLOW MODAL ────────────────────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mx-auto border-2 border-green-200">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Invoice Created Successfully!
              </h3>
              <p className="text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
                Invoice <span className="font-bold text-[#0D47A1]">{invoiceNumber}</span> has been issued for <span className="font-bold">{selectedPatient?.name}</span>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-left" style={{ fontFamily: RB }}>
              <div className="flex justify-between">
                <span className="text-slate-500">Grand Total:</span>
                <span className="font-bold text-[#111827]">₹{grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-[#66BB6A]">₹{amountReceived.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <StatusChip status={paymentStatus} />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              {isReceptionist ? (
                <>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false)
                      window.print()
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Printer size={15} />
                    Print Invoice
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false)
                      if (onViewInvoiceDetailsClick) {
                        onViewInvoiceDetailsClick(invoiceNumber)
                      } else {
                        onBack()
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    View Invoice Details
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false)
                      if (onCollectPaymentClick) {
                        onCollectPaymentClick(invoiceNumber)
                      } else {
                        onBack()
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    Collect Payment
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                  >
                    Back to Reception Dashboard
                  </button>
                </>
              ) : (
                <button
                  onClick={onBack}
                  className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  Return to Billing Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── COLLECT PAYMENT WORKSPACE SCREEN ─────────────────────────────────────────
export function CollectPaymentWorkspaceScreen({
  invoiceId = 'INV-1041',
  onBack,
  onPaymentConfirmed,
}: {
  invoiceId?: string
  onBack: () => void
  onPaymentConfirmed?: (receiptId: string) => void
}) {
  // Mock Invoice Data for Collection
  const invoiceData = {
    id: invoiceId,
    invoiceDate: '2026-07-25 09:15 AM',
    patientName: 'James Thornton',
    mrn: 'MRN-89202',
    age: 67,
    gender: 'Male',
    mobile: '+91 98123 45678',
    bloodGroup: 'O+',
    patientCategory: 'Insurance',
    doctorName: 'Dr. Priya Sharma',
    department: 'General Medicine',
    consultationId: 'CNS-1041',
    invoiceAmount: 850,
    amountAlreadyPaid: 500,
    outstandingBalance: 350,
    initialStatus: 'Partially Paid' as PaymentStatus,
  }

  // Form State
  const [paymentMode, setPaymentMode] = useState<PaymentMethod | 'Cheque' | 'Wallet'>('UPI')
  const [amountReceived, setAmountReceived] = useState<number>(350)
  const [referenceNo, setReferenceNo] = useState('UPI/998120/OKAX')
  const [paymentDate] = useState('2026-07-25')
  const [cashierName] = useState('Emma Wilson')
  const [remarks, setRemarks] = useState('Final settlement balance received via GPay')

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showToast, setShowToast] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [receiptNumber] = useState('REC-9941')

  // Live Calculations
  const currentPayment = Number(amountReceived) || 0
  const totalPaidNow = invoiceData.amountAlreadyPaid + currentPayment
  const remainingBalance = Math.max(0, invoiceData.invoiceAmount - totalPaidNow)
  
  // Progress %
  const progressPercent = Math.min(100, Math.round((totalPaidNow / invoiceData.invoiceAmount) * 100))

  // Live Status Chip Calculation
  const livePaymentStatus: PaymentStatus = useMemo(() => {
    if (remainingBalance === 0) return 'Paid'
    if (totalPaidNow > 0) return 'Partially Paid'
    return 'Pending'
  }, [remainingBalance, totalPaidNow])

  // Payment Mode Icon Helper
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'UPI':
        return <Zap size={16} className="text-[#009688]" />
      case 'Card':
        return <CreditCard size={16} className="text-[#0D47A1]" />
      case 'Cash':
        return <DollarSign size={16} className="text-[#66BB6A]" />
      case 'Bank Transfer':
        return <Building2 size={16} className="text-purple-600" />
      default:
        return <FileText size={16} className="text-amber-500" />
    }
  }

  // Handle Form Submission / Validation
  const handleConfirmPayment = () => {
    const newErrors: Record<string, string> = {}

    if (!amountReceived || amountReceived <= 0) {
      newErrors.amountReceived = 'Please enter a valid amount received.'
    }

    if (['Card', 'UPI', 'Bank Transfer', 'Cheque'].includes(paymentMode) && !referenceNo.trim()) {
      newErrors.referenceNo = `Reference / Txn ID is required for ${paymentMode} transactions.`
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setShowToast(true)
    setShowSuccessModal(true)
    if (onPaymentConfirmed) onPaymentConfirmed(receiptNumber)
  }

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#66BB6A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200" style={{ fontFamily: PP }}>
          <CheckCircle2 size={16} />
          Payment collected successfully! Receipt {receiptNumber} issued.
        </div>
      )}

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Home</span>
            <ChevronRight size={12} />
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Billing & Payment</span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Collect Payment</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
            Collect Payment Workspace
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            Receive payment, verify invoice details, update payment status and generate the official receipt.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPayment}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm active:scale-95"
            style={{ fontFamily: PP }}
          >
            <CheckCircle2 size={15} />
            Confirm Payment
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN RESPONSIVE LAYOUT (70% / 30%) ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (70% SPAN) ────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* SECTION 01: INVOICE DETAILS (READ-ONLY) */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 01: INVOICE DETAILS
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Read-only summary of the target consultation bill
                  </p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-semibold text-[#0D47A1] hover:underline flex items-center gap-1"
                style={{ fontFamily: PP }}
              >
                View Full Invoice <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Read-Only Grid */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" style={{ fontFamily: RB }}>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Number</span>
                <span className="font-mono font-bold text-sm text-[#0D47A1]" style={{ fontFamily: PP }}>
                  {invoiceData.id}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Date</span>
                <span className="font-medium text-[#111827]">{invoiceData.invoiceDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Consultation ID</span>
                <span className="font-mono text-slate-700">{invoiceData.consultationId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Current Status</span>
                <StatusChip status={livePaymentStatus} />
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Doctor & Dept</span>
                <span className="font-semibold text-[#111827]">{invoiceData.doctorName}</span>
                <span className="text-[10px] text-[#009688] block">{invoiceData.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Amount</span>
                <span className="font-bold text-[#111827] text-sm">₹{invoiceData.invoiceAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Amount Already Paid</span>
                <span className="font-semibold text-[#66BB6A] text-sm">₹{invoiceData.amountAlreadyPaid.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Outstanding Balance</span>
                <span className="font-bold text-[#EF4444] text-sm">₹{invoiceData.outstandingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* SECTION 02: PATIENT INFORMATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 02: PATIENT INFORMATION
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Verified patient profile header
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#0D47A1]">
                Category: {invoiceData.patientCategory}
              </span>
            </div>

            {/* Patient Header Component */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white font-bold text-base flex items-center justify-center shrink-0" style={{ fontFamily: PP }}>
                JT
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-slate-400 block text-[11px]">Patient Name</span>
                  <span className="font-bold text-[#111827] text-sm" style={{ fontFamily: PP }}>{invoiceData.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{invoiceData.mrn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Age / Gender / Blood</span>
                  <span className="font-medium text-[#111827]">
                    {invoiceData.age} Yrs / {invoiceData.gender} ({invoiceData.bloodGroup})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                  <span className="font-medium text-[#111827]">{invoiceData.mobile}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 03: PAYMENT ENTRY */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 03: PAYMENT ENTRY
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Enter collection details and transaction reference numbers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                {getModeIcon(paymentMode)}
                <span>Mode: {paymentMode}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" style={{ fontFamily: RB }}>
              {/* Payment Mode */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Mode *</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-bold text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </div>

              {/* Amount Received */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Amount Received (₹) *</label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => {
                    setAmountReceived(Number(e.target.value))
                    if (errors.amountReceived) setErrors({ ...errors, amountReceived: '' })
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 font-bold text-sm text-[#111827] focus:bg-white focus:outline-none ${
                    errors.amountReceived ? 'border-[#EF4444]' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                  }`}
                />
                {errors.amountReceived && <span className="text-[10px] text-[#EF4444] block mt-0.5">{errors.amountReceived}</span>}
              </div>

              {/* Balance After Payment */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Balance After Payment (₹)</label>
                <input
                  type="text"
                  disabled
                  value={`₹${remainingBalance.toLocaleString()}`}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-100 text-slate-600 font-bold text-sm"
                />
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Reference / Txn Number {['Card', 'UPI', 'Bank Transfer', 'Cheque'].includes(paymentMode) ? '*' : '(Optional)'}
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => {
                    setReferenceNo(e.target.value)
                    if (errors.referenceNo) setErrors({ ...errors, referenceNo: '' })
                  }}
                  placeholder="e.g. UPI/998120/OKAX or Card Auth Code"
                  className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 font-mono text-xs text-[#111827] focus:bg-white focus:outline-none ${
                    errors.referenceNo ? 'border-[#EF4444]' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                  }`}
                />
                {errors.referenceNo && <span className="text-[10px] text-[#EF4444] block mt-0.5">{errors.referenceNo}</span>}
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Date *</label>
                <input
                  type="date"
                  disabled
                  value={paymentDate}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-100 text-slate-600 font-medium"
                />
              </div>

              {/* Collected By */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Collected By (Cashier) *</label>
                <input
                  type="text"
                  disabled
                  value={cashierName}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-100 text-slate-600 font-medium"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="text-xs" style={{ fontFamily: RB }}>
              <label className="block text-slate-700 font-semibold mb-1">Transaction Remarks</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter cashier audit remarks or settlement details..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs focus:bg-white focus:border-[#0D47A1] focus:outline-none"
              />
            </div>
          </div>

          {/* SECTION 04: PAYMENT CALCULATION & PROGRESS */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center font-bold">
                  <Activity size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 04: PAYMENT CALCULATION
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Real-time payment progress calculation
                  </p>
                </div>
              </div>

              <StatusChip status={livePaymentStatus} />
            </div>

            {/* Progress Calculation Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Invoice Total</span>
                <span className="font-bold text-[#111827] text-sm">₹{invoiceData.invoiceAmount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Previously Paid</span>
                <span className="font-semibold text-slate-700 text-sm">₹{invoiceData.amountAlreadyPaid}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-[#0D47A1] block text-[11px] font-semibold">Current Payment</span>
                <span className="font-bold text-[#0D47A1] text-sm">₹{currentPayment}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[#F59E0B] block text-[11px] font-semibold">Remaining Balance</span>
                <span className="font-bold text-[#EF4444] text-sm">₹{remainingBalance}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold" style={{ fontFamily: RB }}>
                <span className="text-slate-600">Collection Progress ({progressPercent}%)</span>
                <span className="text-[#0D47A1]">{livePaymentStatus}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[#0D47A1] to-[#009688]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 05: RECEIPT PREVIEW CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  <Printer size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 05: OFFICIAL RECEIPT PREVIEW
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Real-time print layout confirmation
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#0D47A1]">{receiptNumber}</span>
            </div>

            {/* Compact Receipt Layout */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs" style={{ fontFamily: RB }}>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div>
                  <div className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>METRO HEALTHCARE HOSPITAL</div>
                  <div className="text-[10px] text-slate-500">Official OPD Payment Receipt</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#0D47A1]">{receiptNumber}</div>
                  <div className="text-[10px] text-slate-400">{paymentDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-slate-400">Patient:</span> <span className="font-bold">{invoiceData.patientName}</span></div>
                <div><span className="text-slate-400">MRN:</span> <span className="font-mono">{invoiceData.mrn}</span></div>
                <div><span className="text-slate-400">Invoice:</span> <span className="font-mono">{invoiceData.id}</span></div>
                <div><span className="text-slate-400">Mode:</span> <span className="font-semibold">{paymentMode}</span></div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center font-bold text-xs">
                <span>Amount Collected:</span>
                <span className="text-sm text-[#66BB6A]">₹{currentPayment.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span>Cashier: {cashierName}</span>
                <span>Status: {livePaymentStatus}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (30% STICKY PANEL) ───────────────────────────────── */}
        <div className="space-y-6">

          {/* STICKY PAYMENT SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">Summary</span>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Payment Summary
                </h3>
              </div>
              <StatusChip status={livePaymentStatus} />
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs border-b border-gray-100 pb-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between text-slate-600">
                <span>Invoice Total:</span>
                <span className="font-semibold text-[#111827]">₹{invoiceData.invoiceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Previously Paid:</span>
                <span className="font-semibold text-slate-700">₹{invoiceData.amountAlreadyPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#0D47A1] font-bold">
                <span>Current Payment:</span>
                <span>+ ₹{currentPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111827] pt-2 border-t border-slate-200" style={{ fontFamily: PP }}>
                <span>Remaining Balance:</span>
                <span className="text-[#EF4444]">₹{remainingBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method & Reference Summary */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1" style={{ fontFamily: RB }}>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-bold text-[#111827]">{paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference:</span>
                <span className="font-mono text-slate-700 truncate max-w-[140px]">{referenceNo || 'None'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Confirm Payment (₹{currentPayment.toLocaleString()})
              </button>
              <button
                onClick={onBack}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── 3. BOTTOM STICKY ACTION BAR ───────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
          >
            Back to Invoice Details
          </button>
          <button
            onClick={() => {
              setAmountReceived(350)
              setReferenceNo('')
              setErrors({})
            }}
            className="px-4 py-2 rounded-xl text-slate-500 text-xs font-medium hover:text-slate-700"
          >
            Reset Payment
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPayment}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <CheckCircle2 size={15} />
            Confirm Payment
          </button>
        </div>
      </div>

      {/* ── 4. SUCCESS FLOW MODAL ────────────────────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mx-auto border-2 border-green-200">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Payment Collected Successfully!
              </h3>
              <p className="text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
                Official Receipt <span className="font-bold text-[#0D47A1]">{receiptNumber}</span> has been issued for <span className="font-bold">{invoiceData.patientName}</span>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-left" style={{ fontFamily: RB }}>
              <div className="flex justify-between">
                <span className="text-slate-500">Collected Amount:</span>
                <span className="font-bold text-[#66BB6A]">₹{currentPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-bold text-[#111827]">₹{remainingBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Updated Status:</span>
                <StatusChip status={livePaymentStatus} />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={onBack}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Return to Billing Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── INVOICE DETAILS SCREEN ───────────────────────────────────────────────────
export function InvoiceDetailsScreen({
  invoiceId = 'INV-1042',
  onBack,
  onCollectPaymentClick,
  onPrintInvoiceClick,
  onViewPatientProfile,
  onViewConsultationDetails,
  isReceptionist = false,
  isAdminReadOnly = false,
  isPatientView = false,
}: {
  invoiceId?: string
  onBack: () => void
  onCollectPaymentClick?: (invId: string) => void
  onPrintInvoiceClick?: (invId: string) => void
  onViewPatientProfile?: (mrn: string) => void
  onViewConsultationDetails?: (consultId: string) => void
  isReceptionist?: boolean
  isAdminReadOnly?: boolean
  isPatientView?: boolean
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)

  // Detailed Read-only Invoice Data
  const invoiceData = {
    id: invoiceId,
    invoiceDate: '2026-07-25 09:40 AM',
    paymentStatus: 'Paid' as PaymentStatus,
    invoiceType: 'OPD Consultation & Diagnostics',
    consultationId: 'CNS-1042',
    appointmentId: 'APT-2001',
    generatedBy: 'Emma Wilson',
    generatedDate: '2026-07-25 09:40 AM',

    // Patient
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-89201',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    mobile: '+91 98765 43210',
    patientCategory: 'General',

    // Doctor
    doctorName: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    specialization: 'Senior Cardiologist',
    consultationDate: '2026-07-25',
    appointmentTime: '09:30 AM',
    consultationStatus: 'Completed',

    // Line Items
    items: [
      { serviceName: 'OPD Consultation Fee', category: 'Consultation', qty: 1, unitPrice: 500, discount: 0, tax: 0, total: 500 },
      { serviceName: 'ECG 12-Lead Diagnostic', category: 'Diagnostics', qty: 1, unitPrice: 850, discount: 50, tax: 18, total: 944 },
      { serviceName: 'Registration & Admin Fee', category: 'Administrative', qty: 1, unitPrice: 200, discount: 0, tax: 0, total: 200 },
    ],

    // Breakdown
    subtotal: 1550,
    discountType: 'Fixed (₹50)',
    discountAmount: 50,
    taxPercentage: 18,
    taxAmount: 144,
    additionalCharges: 0,
    grandTotal: 1644,
    paidAmount: 1644,
    outstandingBalance: 0,

    // Payments
    payments: [
      { receiptNo: 'REC-9942', paymentDate: '2026-07-25 09:42 AM', mode: 'UPI' as PaymentMethod, refNo: 'UPI/894102/GPay', amount: 1644, cashier: 'Emma Wilson', status: 'Paid' as PaymentStatus },
    ],

    // Activity Timeline
    timeline: [
      { id: '1', title: 'Invoice Generated', user: 'Emma Wilson', time: '09:40 AM', desc: 'OPD Consultation bill generated for Sarah Mitchell' },
      { id: '2', title: 'Payment Collected (₹1,644)', user: 'Emma Wilson', time: '09:42 AM', desc: 'Paid via GPay UPI (Ref: UPI/894102/GPay)' },
      { id: '3', title: 'Receipt Issued (REC-9942)', user: 'System', time: '09:42 AM', desc: 'Official digital receipt generated and emailed' },
      { id: '4', title: 'Invoice Printed', user: 'Emma Wilson', time: '09:45 AM', desc: 'Physical receipt printout handed to patient' },
    ],
  }

  const progressPercent = Math.min(100, Math.round((invoiceData.paidAmount / invoiceData.grandTotal) * 100))

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>
              {isPatientView ? 'Patient Portal' : isAdminReadOnly ? 'Hospital Administration' : isReceptionist ? 'Reception Management' : 'Home'}
            </span>
            <ChevronRight size={12} />
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Billing & Payments</span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Invoice Details</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
              Invoice Details — {invoiceData.id}
            </h1>
            <StatusChip status={invoiceData.paymentStatus} />
          </div>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            {isPatientView
              ? 'View your invoice details and payment summary.'
              : isAdminReadOnly
              ? 'View complete invoice information, payment details and billing history.'
              : isReceptionist
              ? 'View invoice information, payment status and print invoice.'
              : 'Review invoice information, payment status, billing items and transaction history.'}
          </p>
        </div>

        {/* Action Buttons & Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isPatientView ? (
            <>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => {
                  if (onPrintInvoiceClick) {
                    onPrintInvoiceClick(invoiceData.id)
                  } else {
                    setShowPrintModal(true)
                  }
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                style={{ fontFamily: RB }}
              >
                <Printer size={14} />
                <span className="hidden sm:inline">Print Invoice</span>
              </button>
            </>
          ) : (
            <>
              {!isAdminReadOnly && invoiceData.outstandingBalance > 0 && (
                <button
                  onClick={() => onCollectPaymentClick && onCollectPaymentClick(invoiceData.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-sm active:scale-95"
                  style={{ fontFamily: PP }}
                >
                  <DollarSign size={15} />
                  Collect Payment
                </button>
              )}

              {isAdminReadOnly && (
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={14} />
                  Export PDF
                </button>
              )}

              <button
                onClick={() => {
                  if (onPrintInvoiceClick) {
                    onPrintInvoiceClick(invoiceData.id)
                  } else {
                    setShowPrintModal(true)
                  }
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                style={{ fontFamily: RB }}
              >
                <Printer size={14} />
                <span className="hidden sm:inline">Print Invoice</span>
              </button>

              {!isAdminReadOnly && (
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                  style={{ fontFamily: RB }}
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>
              )}
            </>
          )}

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <MoreVertical size={16} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-[#E5E7EB] shadow-lg py-1 z-30 text-left text-xs" style={{ fontFamily: RB }}>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="w-full px-3 py-2 text-[#111827] hover:bg-slate-50 flex items-center gap-2"
                >
                  <Copy size={13} className="text-slate-400" />
                  Duplicate Invoice
                </button>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="w-full px-3 py-2 text-[#111827] hover:bg-slate-50 flex items-center gap-2"
                >
                  <History size={13} className="text-slate-400" />
                  View Payment History
                </button>
                <div className="h-[1px] bg-slate-100 my-1" />
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="w-full px-3 py-2 text-[#EF4444] hover:bg-red-50 flex items-center gap-2 font-medium"
                >
                  <Ban size={13} />
                  Cancel Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN RESPONSIVE LAYOUT (70% / 30%) ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (70% SPAN) ────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* SECTION 01: INVOICE INFORMATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 01: INVOICE METADATA
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Official registration & creation timestamps
                  </p>
                </div>
              </div>
              <StatusChip status={invoiceData.paymentStatus} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" style={{ fontFamily: RB }}>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Number</span>
                <span className="font-mono font-bold text-sm text-[#0D47A1]" style={{ fontFamily: PP }}>
                  {invoiceData.id}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Date</span>
                <span className="font-medium text-[#111827]">{invoiceData.invoiceDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Type</span>
                <span className="font-semibold text-slate-700">{invoiceData.invoiceType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Generated By</span>
                <span className="font-medium text-[#111827]">{invoiceData.generatedBy}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Consultation ID</span>
                <span className="font-mono text-slate-700">{invoiceData.consultationId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Appointment ID</span>
                <span className="font-mono text-slate-700">{invoiceData.appointmentId}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[11px]">Creation Audit Timestamp</span>
                <span className="font-medium text-slate-600">{invoiceData.generatedDate}</span>
              </div>
            </div>
          </div>

          {/* SECTION 02: PATIENT INFORMATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 02: PATIENT INFORMATION
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Registered patient header details
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewPatientProfile && onViewPatientProfile(invoiceData.mrn)}
                className="text-xs font-semibold text-[#0D47A1] hover:underline flex items-center gap-1"
                style={{ fontFamily: PP }}
              >
                Open Patient Profile <ArrowUpRight size={12} />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white font-bold text-base flex items-center justify-center shrink-0" style={{ fontFamily: PP }}>
                SM
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-slate-400 block text-[11px]">Patient Name</span>
                  <span className="font-bold text-[#111827] text-sm" style={{ fontFamily: PP }}>{invoiceData.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{invoiceData.mrn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Age / Gender / Blood</span>
                  <span className="font-medium text-[#111827]">
                    {invoiceData.age} Yrs / {invoiceData.gender} ({invoiceData.bloodGroup})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                  <span className="font-medium text-[#111827]">{invoiceData.mobile}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 03: DOCTOR INFORMATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <UserCheck size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 03: DOCTOR & CONSULTATION
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Attending physician & OPD session details
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewConsultationDetails && onViewConsultationDetails(invoiceData.consultationId)}
                className="text-xs font-semibold text-[#0D47A1] hover:underline flex items-center gap-1"
                style={{ fontFamily: PP }}
              >
                View Consultation Details <ArrowUpRight size={12} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
              <div>
                <span className="text-slate-400 block text-[11px]">Doctor Name</span>
                <span className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{invoiceData.doctorName}</span>
                <span className="text-[10px] text-slate-500 block">{invoiceData.specialization}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Department</span>
                <span className="font-semibold text-[#009688]">{invoiceData.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Consultation Date & Time</span>
                <span className="font-medium text-[#111827]">{invoiceData.consultationDate} • {invoiceData.appointmentTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Consultation Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-[#66BB6A]">
                  ✓ {invoiceData.consultationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 04: BILLING ITEMS ENTERPRISE TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0D47A1]/10 text-[#0D47A1] flex items-center justify-center font-bold">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 04: BILLING ITEMS (READ-ONLY)
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Itemized charges breakdown
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Service Name</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Price (₹)</th>
                    <th className="py-2.5 px-4 text-right">Discount (₹)</th>
                    <th className="py-2.5 px-4 text-right">Tax (%)</th>
                    <th className="py-2.5 px-4 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceData.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#111827]">{item.serviceName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">{item.qty}</td>
                      <td className="py-3 px-4 text-right text-slate-700">₹{item.unitPrice}</td>
                      <td className="py-3 px-4 text-right text-slate-500">₹{item.discount}</td>
                      <td className="py-3 px-4 text-right text-slate-500">{item.tax}%</td>
                      <td className="py-3 px-4 text-right font-bold text-[#0D47A1]">₹{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal Footer */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-bold" style={{ fontFamily: PP }}>
              <span className="text-slate-600">Line Items Subtotal:</span>
              <span className="text-base text-[#0D47A1]">₹{invoiceData.subtotal.toLocaleString()}</span>
            </div>
          </div>

          {/* SECTION 05: DISCOUNT & TAX DETAILS */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
                <DollarSign size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 05: DISCOUNT & TAX BREAKDOWN
                </h2>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Itemized tax calculations and grand totals
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs" style={{ fontFamily: RB }}>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#111827]">₹{invoiceData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#66BB6A]">
                <span>Discount ({invoiceData.discountType}):</span>
                <span className="font-semibold">- ₹{invoiceData.discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax GST ({invoiceData.taxPercentage}%):</span>
                <span className="font-semibold">+ ₹{invoiceData.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111827] pt-2 border-t border-slate-200" style={{ fontFamily: PP }}>
                <span>Grand Total:</span>
                <span className="text-[#0D47A1]">₹{invoiceData.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* SECTION 06: PAYMENT HISTORY */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center font-bold">
                  <History size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 06: PAYMENT HISTORY
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Audit trail of receipts & collections
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Receipt No.</th>
                    <th className="py-2.5 px-4">Payment Date</th>
                    <th className="py-2.5 px-4">Mode</th>
                    <th className="py-2.5 px-4">Ref No.</th>
                    <th className="py-2.5 px-4 text-right">Paid (₹)</th>
                    <th className="py-2.5 px-4">Cashier</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceData.payments.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0D47A1]">{p.receiptNo}</td>
                      <td className="py-3 px-4 text-slate-600">{p.paymentDate}</td>
                      <td className="py-3 px-4 font-medium">{p.mode}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{p.refNo}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#66BB6A]">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-700">{p.cashier}</td>
                      <td className="py-3 px-4 text-center"><StatusChip status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 07: ACTIVITY TIMELINE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 07: ACTIVITY TIMELINE
                </h3>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Chronological billing event log
                </p>
              </div>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {invoiceData.timeline.map((act) => (
                <div key={act.id} className="relative p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="absolute -left-6 top-3.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0D47A1]" />
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#0D47A1]" style={{ fontFamily: PP }}>
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <div className="text-xs text-slate-700" style={{ fontFamily: RB }}>{act.desc}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Action by: {act.user}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (30% STICKY PANEL) ───────────────────────────────── */}
        <div className="space-y-6">

          {/* STICKY INVOICE SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">Summary</span>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  {isAdminReadOnly ? 'Billing Overview' : 'Invoice Summary'}
                </h3>
              </div>
              <StatusChip status={invoiceData.paymentStatus} />
            </div>

            {/* Summary Lines */}
            <div className="space-y-2 text-xs border-b border-gray-100 pb-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#111827]">₹{invoiceData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#66BB6A]">
                <span>Discount:</span>
                <span className="font-semibold">- ₹{invoiceData.discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax GST (18%):</span>
                <span className="font-semibold">+ ₹{invoiceData.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111827] pt-2 border-t border-slate-200" style={{ fontFamily: PP }}>
                <span>Grand Total:</span>
                <span className="text-[#0D47A1]">₹{invoiceData.grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-[#66BB6A]">
                <span>Amount Paid:</span>
                <span>₹{invoiceData.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#EF4444]">
                <span>Balance Due:</span>
                <span>₹{invoiceData.outstandingBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Collection Progress Card */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold" style={{ fontFamily: RB }}>
                <span className="text-slate-600">Collection Completion</span>
                <span className="text-[#66BB6A]">{progressPercent}% Paid</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-[#66BB6A]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              {isPatientView ? (
                <>
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Print Invoice
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                  >
                    Back to My Bills
                  </button>
                </>
              ) : (
                <>
                  {!isAdminReadOnly && invoiceData.outstandingBalance > 0 && (
                    <button
                      onClick={() => onCollectPaymentClick && onCollectPaymentClick(invoiceData.id)}
                      className="w-full py-3 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
                      style={{ fontFamily: PP }}
                    >
                      Collect Payment (₹{invoiceData.outstandingBalance})
                    </button>
                  )}
                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Print Receipt
                  </button>
                  {isAdminReadOnly && (
                    <button
                      onClick={() => window.print()}
                      className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                      style={{ fontFamily: PP }}
                    >
                      Export Invoice
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ── 3. BOTTOM STICKY ACTION BAR ───────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100 font-semibold"
          >
            {isPatientView ? '← Back to My Bills' : '← Back to Billing Dashboard'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isPatientView ? (
            <>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                Download PDF
              </button>
              <button
                onClick={() => setShowPrintModal(true)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Print Invoice
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowPrintModal(true)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Print Invoice
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Export Invoice
              </button>
              {!isAdminReadOnly && invoiceData.outstandingBalance > 0 && (
                <button
                  onClick={() => onCollectPaymentClick && onCollectPaymentClick(invoiceData.id)}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-all shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <DollarSign size={15} />
                  Collect Payment
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── PRINT MODAL ──────────────────────────────────────────────────────── */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Print Preview — {invoiceData.id}
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <div>
                  <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>METRO HEALTHCARE HOSPITAL</div>
                  <div className="text-slate-500 text-[10px]">123 Health Avenue, Medical District</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#0D47A1]">{invoiceData.id}</div>
                  <div className="text-[10px] text-slate-400">{invoiceData.invoiceDate}</div>
                </div>
              </div>

              <div className="flex justify-between text-xs font-bold">
                <span>Grand Total: ₹{invoiceData.grandTotal}</span>
                <StatusChip status={invoiceData.paymentStatus} />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                Close
              </button>
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                Close
              </button>
              <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold" style={{ fontFamily: PP }}>
                Print Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── INVOICE PRINT PREVIEW WORKSPACE SCREEN ──────────────────────────────────
export function InvoicePrintPreviewScreen({
  invoiceId = 'INV-1042',
  onBack,
  onViewPatientProfile,
  onViewConsultationDetails,
  isReceptionist = false,
  isPatientView = false,
}: {
  invoiceId?: string
  onBack: () => void
  onViewPatientProfile?: (mrn: string) => void
  onViewConsultationDetails?: (consultId: string) => void
  isReceptionist?: boolean
  isPatientView?: boolean
}) {
  if (onViewPatientProfile || onViewConsultationDetails) {
    // referenced to satisfy unused variable lint
  }
  // Zoom Controls
  const [zoomLevel, setZoomLevel] = useState<number>(100)

  // Print Settings Options
  const [paperSize, setPaperSize] = useState<'A4' | 'Letter'>('A4')
  const [_orientation] = useState<'Portrait' | 'Landscape'>('Portrait')
  const [margins, setMargins] = useState<'Normal' | 'Narrow' | 'Wide'>('Normal')
  const [includeLogo, setIncludeLogo] = useState(true)
  const [includeQrCode, setIncludeQrCode] = useState(true)
  const [includeNotes, setIncludeNotes] = useState(true)

  // Share & Email Dialogs
  const [showShareModal, setShowShareModal] = useState(false)
  const [emailSentToast, setEmailSentToast] = useState(false)

  // Sample Printable Data
  const printData = {
    invoiceNo: invoiceId,
    invoiceDate: '25-Jul-2026 09:40 AM',
    receiptNo: 'REC-9942',
    paymentStatus: 'Paid' as PaymentStatus,
    gstNo: 'GSTIN: 07AAAAM1234F1Z5',

    // Hospital
    hospitalName: 'Safe Hands Hospital',
    address: '123 Health Avenue, Medical District, New Delhi - 110001',
    contact: '+91 (011) 2345-6789 | contact@safehandshospital.org | www.safehandshospital.org',

    // Patient
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-89201',
    age: 34,
    gender: 'Female',
    mobile: '+91 98765 43210',
    patientCategory: 'General',
    doctorName: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    consultationId: 'CNS-1042',
    appointmentDate: '25-Jul-2026',

    // Items
    items: [
      { id: 1, serviceName: 'OPD Consultation Fee (Dr. Arjun Mehta)', qty: 1, unitPrice: 500, discount: 0, tax: 0, total: 500 },
      { id: 2, serviceName: 'ECG 12-Lead Diagnostic Test', qty: 1, unitPrice: 850, discount: 50, tax: 18, total: 944 },
      { id: 3, serviceName: 'Hospital Registration & Administrative Fee', qty: 1, unitPrice: 200, discount: 0, tax: 0, total: 200 },
    ],

    // Financials
    subtotal: 1550,
    discount: 50,
    taxGst: 144,
    additionalCharges: 0,
    grandTotal: 1644,
    amountPaid: 1644,
    balanceDue: 0,
    paymentMode: 'UPI (Google Pay)',
    referenceNo: 'UPI/894102/GPay',
    collectedBy: 'Emma Wilson (Chief Accountant)',
    paymentDate: '25-Jul-2026 09:42 AM',

    // Policy Notes
    remarks: 'Full settlement received at OPD billing counter.',
    terms: '1. All payments are non-refundable once services are rendered.\n2. Please retain this receipt for insurance reimbursement claims.\n3. This is a computer-generated tax invoice.',
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEmailPatient = () => {
    setEmailSentToast(true)
    setTimeout(() => setEmailSentToast(false), 3000)
  }

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">

      {/* Email Confirmation Toast */}
      {emailSentToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0D47A1] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200" style={{ fontFamily: PP }}>
          <Send size={16} />
          Digital Invoice PDF emailed to sarah.mitchell@example.com!
        </div>
      )}

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>
              {isPatientView ? 'Patient Portal' : isReceptionist ? 'Reception Management' : 'Home'}
            </span>
            <ChevronRight size={12} />
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Billing & Payments</span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">
              {isPatientView ? 'Print / Download Invoice' : isReceptionist ? 'Print Invoice' : 'Invoice Print Preview'}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
            {isPatientView ? 'Print / Download Invoice' : isReceptionist ? 'Print Invoice' : 'Invoice Print Preview Workspace'}
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            {isPatientView
              ? 'Preview, print or download your official hospital invoice.'
              : isReceptionist
              ? 'Preview and print the official patient invoice.'
              : 'Review the finalized invoice before printing, downloading or sharing with the patient.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            {isPatientView ? 'Back to My Bills' : 'Back to Details'}
          </button>
          {!isPatientView && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
              style={{ fontFamily: RB }}
            >
              <Send size={14} />
              <span className="hidden sm:inline">Share Invoice</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-sm active:scale-95"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} />
            Print Invoice
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN RESPONSIVE LAYOUT (70% / 30%) ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT PANEL (70% SPAN) - PRINTABLE A4 PREVIEW ──────────────────── */}
        <div className="xl:col-span-2 space-y-4">

          {/* Preview Zoom Controls Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between text-xs" style={{ fontFamily: RB }}>
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Eye size={15} className="text-[#0D47A1]" />
              <span>A4 Printable Document Surface</span>
            </div>

            {/* Zoom Steppers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-bold hover:bg-slate-100"
              >
                -
              </button>
              <span className="font-bold text-[#111827] min-w-[45px] text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-bold hover:bg-slate-100"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 ml-1"
              >
                Fit to Page
              </button>
            </div>
          </div>

          {/* Centered A4 Sheet Surface */}
          <div className="flex justify-center overflow-x-auto py-2">
            <div
              className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-8 md:p-10 space-y-6 text-xs transition-transform duration-200 max-w-[800px] w-full"
              style={{
                fontFamily: RB,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {/* HOSPITAL HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#0D47A1] pb-4">
                {includeLogo && (
                  <div className="flex items-center gap-3">
                    <img
                      src={safeHandsLogo}
                      alt="Safe Hands Hospital Logo"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs"
                    />
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-[#0D47A1] tracking-tight" style={{ fontFamily: PP }}>
                        {printData.hospitalName}
                      </h2>
                      <p className="text-[11px] text-slate-500">{printData.address}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{printData.contact}</p>
                    </div>
                  </div>
                )}
                <div className="text-right sm:self-center">
                  <div className="text-[11px] font-mono font-bold text-[#0D47A1]">{printData.gstNo}</div>
                  <div className="text-[10px] text-slate-400">NABH Accredited Tertiary Center</div>
                </div>
              </div>

              {/* DOCUMENT TITLE & META */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-[#111827] tracking-wider uppercase" style={{ fontFamily: PP }}>
                    TAX INVOICE / RECEIPT
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-[#0D47A1]">{printData.invoiceNo}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{printData.invoiceDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Receipt No</span>
                    <span className="font-mono font-bold text-slate-700">{printData.receiptNo}</span>
                  </div>
                  <StatusChip status={printData.paymentStatus} />
                </div>
              </div>

              {/* PATIENT & OPD INFORMATION GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-200 bg-white text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name</span>
                  <span className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{printData.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{printData.mrn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Age & Gender</span>
                  <span className="font-medium text-[#111827]">{printData.age} Yrs / {printData.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mobile</span>
                  <span className="font-medium text-[#111827]">{printData.mobile}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Attending Doctor</span>
                  <span className="font-semibold text-[#111827]">{printData.doctorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Department</span>
                  <span className="font-semibold text-[#009688]">{printData.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Consultation ID</span>
                  <span className="font-mono text-slate-700">{printData.consultationId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Category</span>
                  <span className="font-semibold text-[#0D47A1]">{printData.patientCategory}</span>
                </div>
              </div>

              {/* BILLING ITEMS TABLE */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase">
                      <th className="py-2.5 px-3">Service Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
                      <th className="py-2.5 px-3 text-right">Disc (₹)</th>
                      <th className="py-2.5 px-3 text-right">Tax (%)</th>
                      <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {printData.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-semibold text-[#111827]">{item.serviceName}</td>
                        <td className="py-2.5 px-3 text-center">{item.qty}</td>
                        <td className="py-2.5 px-3 text-right">₹{item.unitPrice}</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">₹{item.discount}</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">{item.tax}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#0D47A1]">₹{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAYMENT SUMMARY GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-200 py-3">
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div><span className="font-semibold text-slate-700">Payment Mode:</span> {printData.paymentMode}</div>
                  <div><span className="font-semibold text-slate-700">Reference Txn ID:</span> <span className="font-mono">{printData.referenceNo}</span></div>
                  <div><span className="font-semibold text-slate-700">Collected By:</span> {printData.collectedBy}</div>
                  <div><span className="font-semibold text-slate-700">Collection Time:</span> {printData.paymentDate}</div>
                </div>

                <div className="space-y-1.5 text-right text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#111827]">₹{printData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#66BB6A]">
                    <span>Discount:</span>
                    <span className="font-semibold">- ₹{printData.discount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax GST (18%):</span>
                    <span className="font-semibold">+ ₹{printData.taxGst}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#111827] border-t border-slate-200 pt-1.5" style={{ fontFamily: PP }}>
                    <span>Grand Total:</span>
                    <span className="text-[#0D47A1]">₹{printData.grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-[#66BB6A]">
                    <span>Amount Received:</span>
                    <span>₹{printData.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-[#EF4444]">
                    <span>Balance Due:</span>
                    <span>₹{printData.balanceDue}</span>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL NOTES & POLICIES */}
              {includeNotes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[10px] text-slate-600">
                  <div className="font-bold text-slate-700 uppercase" style={{ fontFamily: PP }}>Terms & Hospital Instructions</div>
                  <p className="whitespace-pre-line leading-relaxed">{printData.terms}</p>
                </div>
              )}

              {/* PRINT FOOTER: SIGNATURE, SEAL, QR CODE */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                {/* QR Code Verification Placeholder */}
                {includeQrCode && (
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-center text-[9px] text-slate-500 font-mono text-center p-1">
                      <div className="font-bold">QR VERIFY</div>
                      <div className="text-[7px]">SCAN TO AUDIT</div>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <div>Digitally Verified Invoice</div>
                      <div>Scan QR to verify authenticity</div>
                    </div>
                  </div>
                )}

                {/* Signature & Seal */}
                <div className="text-right space-y-1">
                  <div className="text-[11px] font-bold text-slate-700" style={{ fontFamily: PP }}>
                    {printData.collectedBy}
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-300 pt-1 w-40 ml-auto">
                    Authorized Cashier Signature & Seal
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                Thank you for choosing Safe Hands Hospital! Wishing you good health.
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (30% STICKY PANEL) - PRINT SETTINGS & ACTIONS ────── */}
        <div className="space-y-6">

          {/* STICKY INVOICE SUMMARY */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">Summary</span>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Invoice Summary
                </h3>
              </div>
              <StatusChip status={printData.paymentStatus} />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1" style={{ fontFamily: RB }}>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice No:</span>
                <span className="font-bold text-[#0D47A1]">{printData.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono text-slate-700">{printData.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-[#111827]">{printData.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="text-slate-700">{printData.doctorName}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200">
                <span className="text-slate-700">Grand Total:</span>
                <span className="text-[#0D47A1]">₹{printData.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* PRINT SETTINGS CARD */}
            <div className="space-y-3 pt-1 text-xs" style={{ fontFamily: RB }}>
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Print Configurations</div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Paper Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['A4', 'Letter'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPaperSize(s)}
                      className={`py-1.5 px-3 rounded-lg border font-semibold ${
                        paperSize === s ? 'bg-[#0D47A1] text-white border-[#0D47A1]' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Margins</label>
                <select
                  value={margins}
                  onChange={(e) => setMargins(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="Normal">Normal Margins</option>
                  <option value="Narrow">Narrow Margins</option>
                  <option value="Wide">Wide Margins</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">Include Hospital Logo</span>
                  <input
                    type="checkbox"
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                    className="accent-[#0D47A1]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">Include Verification QR Code</span>
                  <input
                    type="checkbox"
                    checked={includeQrCode}
                    onChange={(e) => setIncludeQrCode(e.target.checked)}
                    className="accent-[#0D47A1]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">Include Terms & Notes</span>
                  <input
                    type="checkbox"
                    checked={includeNotes}
                    onChange={(e) => setIncludeNotes(e.target.checked)}
                    className="accent-[#0D47A1]"
                  />
                </label>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handlePrint}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Download PDF
              </button>
              <button
                onClick={handlePrint}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Print Invoice
              </button>
              <button
                onClick={onBack}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                {isPatientView ? 'Back to My Bills' : 'Back to Invoice Details'}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── 3. BOTTOM STICKY ACTION BAR ───────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100 font-semibold"
          >
            {isPatientView ? '← Back to My Bills' : '← Back to Invoice Details'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} />
            Print Invoice
          </button>
        </div>
      </div>

      {/* ── SHARE INVOICE MODAL ──────────────────────────────────────────────── */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Share Invoice — {printData.invoiceNo}
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
              <button
                onClick={() => {
                  handleEmailPatient()
                  setShowShareModal(false)
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 text-[#111827]"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Send size={15} className="text-[#0D47A1]" />
                  <span>Send via Email to {printData.patientName}</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <button
                onClick={() => {
                  alert('WhatsApp digital link sent!')
                  setShowShareModal(false)
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-teal-50 text-[#111827]"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Zap size={15} className="text-[#009688]" />
                  <span>Send via WhatsApp ({printData.mobile})</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://metrohealthcare.org/invoice/${printData.invoiceNo}`)
                  alert('Invoice URL copied to clipboard!')
                  setShowShareModal(false)
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#111827]"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Copy size={15} className="text-slate-500" />
                  <span>Copy Secure Patient Invoice Link</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── PAYMENT HISTORY TRANSACTION LEDGER SCREEN ────────────────────────────────
export function PaymentHistoryScreen({
  onViewInvoiceDetailsClick,
  onViewPatientProfile,
  onPrintReceiptClick,
}: {
  onViewInvoiceDetailsClick?: (invId: string) => void
  onViewPatientProfile?: (mrn: string) => void
  onPrintReceiptClick?: (invId: string) => void
}) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [selectedMethod, setSelectedMethod] = useState<string>('All')
  const [selectedCashier, setSelectedCashier] = useState<string>('All')
  const [dateRange, setDateRange] = useState<string>('This Month')

  // Selected Payment Drawer State
  const [selectedDrawerPayment, setSelectedDrawerPayment] = useState<any | null>(null)
  const [showMoreMenuId, setShowMoreMenuId] = useState<string | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Sample Transaction Ledger Records
  const initialPayments = [
    {
      receiptNo: 'REC-9942',
      invoiceId: 'INV-1042',
      paymentDate: '2026-07-25 09:42 AM',
      patientName: 'Sarah Mitchell',
      mrn: 'MRN-89201',
      mobile: '+91 98765 43210',
      doctorName: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      paymentMethod: 'UPI' as PaymentMethod,
      referenceNo: 'UPI/894102/GPay',
      invoiceAmount: 1644,
      amountPaid: 1644,
      balance: 0,
      collectedBy: 'Emma Wilson',
      status: 'Paid' as PaymentStatus,
      remarks: 'Full settlement received at OPD billing counter.',
    },
    {
      receiptNo: 'REC-9941',
      invoiceId: 'INV-1041',
      paymentDate: '2026-07-25 10:15 AM',
      patientName: 'James Thornton',
      mrn: 'MRN-89202',
      mobile: '+91 98123 45678',
      doctorName: 'Dr. Priya Sharma',
      department: 'General Medicine',
      paymentMethod: 'Cash' as PaymentMethod,
      referenceNo: 'CASH-891024',
      invoiceAmount: 850,
      amountPaid: 500,
      balance: 350,
      collectedBy: 'Emma Wilson',
      status: 'Partially Paid' as PaymentStatus,
      remarks: 'Advance payment collected.',
    },
    {
      receiptNo: 'REC-9940',
      invoiceId: 'INV-1040',
      paymentDate: '2026-07-24 04:30 PM',
      patientName: 'Anita Roy',
      mrn: 'MRN-89199',
      mobile: '+91 97654 32109',
      doctorName: 'Dr. Rajesh Kumar',
      department: 'Orthopedics',
      paymentMethod: 'Card' as PaymentMethod,
      referenceNo: 'CARD/4890/HDFC',
      invoiceAmount: 2400,
      amountPaid: 2400,
      balance: 0,
      collectedBy: 'Sarah Jenkins',
      status: 'Paid' as PaymentStatus,
      remarks: 'Card swipe transaction approved.',
    },
    {
      receiptNo: 'REC-9939',
      invoiceId: 'INV-1039',
      paymentDate: '2026-07-24 02:10 PM',
      patientName: 'Robert Chen',
      mrn: 'MRN-89198',
      mobile: '+91 96543 21098',
      doctorName: 'Dr. Sunita Rao',
      department: 'Dermatology',
      paymentMethod: 'Bank Transfer' as PaymentMethod,
      referenceNo: 'NEFT/891023/SBIN',
      invoiceAmount: 1200,
      amountPaid: 1200,
      balance: 0,
      collectedBy: 'System',
      status: 'Paid' as PaymentStatus,
      remarks: 'Online portal payment auto-reconciled.',
    },
    {
      receiptNo: 'REC-9938',
      invoiceId: 'INV-1038',
      paymentDate: '2026-07-23 11:00 AM',
      patientName: 'Meera Patel',
      mrn: 'MRN-89195',
      mobile: '+91 95432 10987',
      doctorName: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      paymentMethod: 'UPI' as PaymentMethod,
      referenceNo: 'UPI/771024/Paytm',
      invoiceAmount: 3500,
      amountPaid: 0,
      balance: 3500,
      collectedBy: 'Emma Wilson',
      status: 'Pending' as PaymentStatus,
      remarks: 'Awaiting insurance clearance.',
    },
    {
      receiptNo: 'REC-9937',
      invoiceId: 'INV-1037',
      paymentDate: '2026-07-23 09:20 AM',
      patientName: 'Vikram Malhotra',
      mrn: 'MRN-89194',
      mobile: '+91 94321 09876',
      doctorName: 'Dr. Priya Sharma',
      department: 'General Medicine',
      paymentMethod: 'Cheque' as PaymentMethod,
      referenceNo: 'CHQ/001924/HDFC',
      invoiceAmount: 5000,
      amountPaid: 5000,
      balance: 0,
      collectedBy: 'Sarah Jenkins',
      status: 'Paid' as PaymentStatus,
      remarks: 'Corporate cheque cleared.',
    },
  ]

  // Filtering Logic
  const filteredPayments = initialPayments.filter((p) => {
    const matchesSearch =
      p.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobile.includes(searchQuery) ||
      p.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus
    const matchesMethod = selectedMethod === 'All' || p.paymentMethod === selectedMethod
    const matchesCashier = selectedCashier === 'All' || p.collectedBy === selectedCashier

    return matchesSearch && matchesStatus && matchesMethod && matchesCashier
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage) || 1
  const displayedPayments = filteredPayments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedStatus('All')
    setSelectedMethod('All')
    setSelectedCashier('All')
    setDateRange('This Month')
    setCurrentPage(1)
  }

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={() => onViewInvoiceDetailsClick && onViewInvoiceDetailsClick('INV-1042')}>Home</span>
            <ChevronRight size={12} />
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={() => onViewInvoiceDetailsClick && onViewInvoiceDetailsClick('INV-1042')}>Billing & Payment</span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Payment History</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
            Payment History Ledger
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            Review all payment transactions, receipts and payment records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print Transaction Report</span>
          </button>

          <button
            onClick={() => alert('Exporting Payment History ledger as CSV/Excel...')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm active:scale-95"
            style={{ fontFamily: PP }}
          >
            <Download size={15} />
            Export Payment History
          </button>
        </div>
      </div>

      {/* ── 2. SEARCH & FILTER BAR ────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>

          {/* Global Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Receipt No, Invoice ID, Patient Name, MRN, Mobile..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
            />
          </div>

          {/* Date Range Selector */}
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-semibold text-slate-700 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
            >
              <option value="Today">Today's Transactions</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Custom">Custom Date Range</option>
            </select>
          </div>

          {/* Payment Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-semibold text-slate-700 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1 border-t border-slate-100" style={{ fontFamily: RB }}>
          {/* Payment Method Dropdown */}
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium text-slate-700"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="Cash">Cash</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Collected By (Cashier) */}
          <div>
            <select
              value={selectedCashier}
              onChange={(e) => setSelectedCashier(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium text-slate-700"
            >
              <option value="All">All Cashiers / Users</option>
              <option value="Emma Wilson">Emma Wilson</option>
              <option value="Sarah Jenkins">Sarah Jenkins</option>
              <option value="System">System Automated</option>
            </select>
          </div>

          {/* Action Buttons */}
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

      {/* ── 3. MAIN PAYMENT TRANSACTION TABLE ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
              TRANSACTION LEDGER ({filteredPayments.length} Records)
            </h3>
            <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Complete record of receipts and collected payments
            </p>
          </div>
        </div>

        {displayedPayments.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <h4 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
              No payment transactions found
            </h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto" style={{ fontFamily: RB }}>
              Adjust filters or search for another receipt number, patient name or transaction reference.
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
            <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Patient & MRN</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Txn Reference</th>
                  <th className="py-3 px-4 text-right">Inv Amount (₹)</th>
                  <th className="py-3 px-4 text-right">Paid (₹)</th>
                  <th className="py-3 px-4 text-right">Balance (₹)</th>
                  <th className="py-3 px-4">Cashier</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedPayments.map((p) => (
                  <tr key={p.receiptNo} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0D47A1]">{p.receiptNo}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{p.invoiceId}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{p.paymentDate}</td>
                    <td className="py-3 px-4">
                      <span
                        onClick={() => onViewPatientProfile && onViewPatientProfile(p.mrn)}
                        className="font-bold text-[#111827] hover:text-[#0D47A1] hover:underline cursor-pointer block"
                        style={{ fontFamily: PP }}
                      >
                        {p.patientName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">{p.mrn}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{p.doctorName}</td>
                    <td className="py-3 px-4 font-medium">{p.paymentMethod}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{p.referenceNo}</td>
                    <td className="py-3 px-4 text-right text-slate-700">₹{p.invoiceAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#66BB6A]">₹{p.amountPaid.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-semibold text-[#EF4444]">
                      {p.balance > 0 ? `₹${p.balance.toLocaleString()}` : '₹0'}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{p.collectedBy}</td>
                    <td className="py-3 px-4 text-center"><StatusChip status={p.status} /></td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedDrawerPayment(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                          title="View Payment Details Drawer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onPrintReceiptClick && onPrintReceiptClick(p.invoiceId)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Print Receipt"
                        >
                          <Printer size={14} />
                        </button>

                        {/* More Actions Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setShowMoreMenuId(showMoreMenuId === p.receiptNo ? null : p.receiptNo)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {showMoreMenuId === p.receiptNo && (
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-[#E5E7EB] shadow-lg py-1 z-30 text-left text-xs" style={{ fontFamily: RB }}>
                              <button
                                onClick={() => {
                                  if (onViewInvoiceDetailsClick) onViewInvoiceDetailsClick(p.invoiceId)
                                  setShowMoreMenuId(null)
                                }}
                                className="w-full px-3 py-2 text-[#111827] hover:bg-slate-50 flex items-center gap-2"
                              >
                                <FileText size={13} className="text-slate-400" />
                                View Invoice
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(p.referenceNo)
                                  alert(`Copied Txn Ref: ${p.referenceNo}`)
                                  setShowMoreMenuId(null)
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

        {/* ── PAGINATION CONTROLS ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-600" style={{ fontFamily: RB }}>
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-400">
              Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredPayments.length)} of {filteredPayments.length}
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
            <span className="px-2">Page {currentPage} of {totalPages}</span>
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

      {/* ── 4. PAYMENT DETAILS DRAWER ────────────────────────────────────────── */}
      {selectedDrawerPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold uppercase tracking-wider">Payment Ledger Record</span>
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  {selectedDrawerPayment.receiptNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDrawerPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status & Amount Overview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs" style={{ fontFamily: RB }}>
              <div>
                <span className="text-slate-400 block text-[11px]">Collected Amount</span>
                <span className="text-lg font-bold text-[#66BB6A]" style={{ fontFamily: PP }}>
                  ₹{selectedDrawerPayment.amountPaid.toLocaleString()}
                </span>
              </div>
              <StatusChip status={selectedDrawerPayment.status} />
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-100 bg-white">
                <div>
                  <span className="text-slate-400 block text-[11px]">Invoice ID</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{selectedDrawerPayment.invoiceId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Date</span>
                  <span className="font-medium text-[#111827]">{selectedDrawerPayment.paymentDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Mode</span>
                  <span className="font-semibold text-slate-700">{selectedDrawerPayment.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Transaction Reference</span>
                  <span className="font-mono text-slate-600 text-[11px]">{selectedDrawerPayment.referenceNo}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-bold text-[#111827]">{selectedDrawerPayment.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MRN:</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{selectedDrawerPayment.mrn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Attending Doctor:</span>
                  <span className="text-slate-700">{selectedDrawerPayment.doctorName} ({selectedDrawerPayment.department})</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
                  <span className="text-slate-600">Collected By:</span>
                  <span className="text-[#111827]">{selectedDrawerPayment.collectedBy}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold block text-slate-700">Remarks:</span>
                {selectedDrawerPayment.remarks}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  if (onPrintReceiptClick) onPrintReceiptClick(selectedDrawerPayment.invoiceId)
                  setSelectedDrawerPayment(null)
                }}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900"
                style={{ fontFamily: PP }}
              >
                Print Receipt
              </button>
              <button
                onClick={() => {
                  if (onViewInvoiceDetailsClick) onViewInvoiceDetailsClick(selectedDrawerPayment.invoiceId)
                  setSelectedDrawerPayment(null)
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                View Full Invoice Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── DAILY BILLING REPORT WORKSPACE SCREEN ──────────────────────────────────
export function DailyBillingReportScreen({
  onBack,
  onViewInvoiceDetailsClick,
  onViewPatientProfile,
  isAdminReadOnly = false,
}: {
  onBack: () => void
  onViewInvoiceDetailsClick?: (invId: string) => void
  onViewPatientProfile?: (mrn: string) => void
  isAdminReadOnly?: boolean
}) {
  if (onViewPatientProfile) {
    // referenced to satisfy unused variable lint
  }
  // Filter state
  const [reportDate, setReportDate] = useState('2026-07-25')
  const [cashierFilter, setCashierFilter] = useState('All')
  const [methodFilter, setMethodFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  if (statusFilter) {
    // referenced to satisfy unused variable lint
  }
  const [deptFilter, setDeptFilter] = useState('All')

  // Top KPI Metrics
  const kpiData = {
    todayRevenue: 45850,
    invoicesGenerated: 42,
    paymentsCollected: 42350,
    pendingPayments: 3500,
    cancelledBills: 2,
    collectionRate: 92.3,
    avgInvoiceValue: 1091,
    cashTxns: 12400,
    upiTxns: 24850,
    cardTxns: 8600,
  }

  // Section 01: Revenue Summary
  const revenueSummary = {
    grossRevenue: 49350,
    netRevenue: 45850,
    collectedAmount: 42350,
    outstandingAmount: 3500,
    cancelledAmount: 3500,
    collectionPct: 92.3,
    yesterdayComparison: '+12.4% vs Yesterday (₹40,780)',
  }

  // Section 02: Payment Method Breakdown
  const paymentBreakdown = [
    { method: 'UPI / GPay / PhonePe', count: 24, amount: 24850, pct: 54.2, color: '#009688' },
    { method: 'Cash', count: 12, amount: 12400, pct: 27.0, color: '#0D47A1' },
    { method: 'Credit / Debit Card', count: 6, amount: 8600, pct: 18.8, color: '#66BB6A' },
    { method: 'Bank Transfer (NEFT)', count: 0, amount: 0, pct: 0.0, color: '#F59E0B' },
  ]

  // Section 03: Department Collection Summary
  const departmentCollections = [
    { department: 'General Medicine', invoices: 15, revenue: 15400, collected: 14200, pending: 1200, pct: 92.2 },
    { department: 'Cardiology', invoices: 12, revenue: 18500, collected: 16850, pending: 1650, pct: 91.0 },
    { department: 'Orthopedics', invoices: 6, revenue: 7800, collected: 7150, pending: 650, pct: 91.6 },
    { department: 'Pediatrics', invoices: 5, revenue: 4500, collected: 4500, pending: 0, pct: 100.0 },
    { department: 'Dermatology', invoices: 4, revenue: 3150, collected: 3150, pending: 0, pct: 100.0 },
  ]

  // Section 04: Cashier Performance
  const cashierPerformance = [
    { cashier: 'Emma Wilson', processed: 26, collectedCount: 24, amount: 28450, cancelled: 1, avgTime: '3.2 mins', status: 'Excellent' },
    { cashier: 'Sarah Jenkins', processed: 16, collectedCount: 15, amount: 17400, cancelled: 1, avgTime: '4.1 mins', status: 'Good' },
  ]

  // Section 05: Billing Timeline
  const recentActivities = [
    { time: '04:15 PM', title: 'Payment Collected (₹1,644)', desc: 'Received via UPI from Sarah Mitchell', user: 'Emma Wilson' },
    { time: '03:40 PM', title: 'Invoice Printed (INV-1041)', desc: 'OPD Bill printed for James Thornton', user: 'Emma Wilson' },
    { time: '02:20 PM', title: 'Payment Collected (₹2,400)', desc: 'Card payment processed for Anita Roy', user: 'Sarah Jenkins' },
    { time: '11:15 AM', title: 'Invoice Generated (INV-1040)', desc: 'Orthopedics consultation bill generated', user: 'Sarah Jenkins' },
  ]

  // Section 06: Top Recent Invoices
  const recentInvoices = [
    { invNo: 'INV-1042', patient: 'Sarah Mitchell', mrn: 'MRN-89201', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', amount: 1644, mode: 'UPI', status: 'Paid' as PaymentStatus, time: '04:15 PM' },
    { invNo: 'INV-1041', patient: 'James Thornton', mrn: 'MRN-89202', doctor: 'Dr. Priya Sharma', dept: 'General Medicine', amount: 850, mode: 'Cash', status: 'Partially Paid' as PaymentStatus, time: '03:40 PM' },
    { invNo: 'INV-1040', patient: 'Anita Roy', mrn: 'MRN-89199', doctor: 'Dr. Rajesh Kumar', dept: 'Orthopedics', amount: 2400, mode: 'Card', status: 'Paid' as PaymentStatus, time: '02:20 PM' },
    { invNo: 'INV-1039', patient: 'Robert Chen', mrn: 'MRN-89198', doctor: 'Dr. Sunita Rao', dept: 'Dermatology', amount: 1200, mode: 'Bank Transfer', status: 'Paid' as PaymentStatus, time: '01:05 PM' },
  ]

  const handleResetFilters = () => {
    setReportDate('2026-07-25')
    setCashierFilter('All')
    setMethodFilter('All')
    setStatusFilter('All')
    setDeptFilter('All')
  }

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>
              {isAdminReadOnly ? 'Hospital Administration' : 'Home'}
            </span>
            <ChevronRight size={12} />
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Billing & Payment</span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Daily Billing Report</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
            Daily Billing Report
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            {isAdminReadOnly
              ? 'Monitor daily billing activities, revenue collection and invoice performance across the hospital.'
              : "View today's billing collections, invoice statistics, payment summaries, and cashier performance."}
          </p>
        </div>

        {/* Action Buttons */}
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
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => alert('Exporting Daily Billing Report to Excel...')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            onClick={() => alert('Generating Daily Billing PDF Report...')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm active:scale-95"
            style={{ fontFamily: PP }}
          >
            <FileText size={15} />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── 2. FILTER BAR ────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs" style={{ fontFamily: RB }}>
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Report Date</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Cashier</label>
            <select
              value={cashierFilter}
              onChange={(e) => setCashierFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium"
            >
              <option value="All">All Cashiers</option>
              <option value="Emma Wilson">Emma Wilson</option>
              <option value="Sarah Jenkins">Sarah Jenkins</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium"
            >
              <option value="All">All Departments</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-end justify-end gap-2">
            <button
              onClick={handleResetFilters}
              className="w-1/2 md:w-auto px-3 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              onClick={() => alert('Filtering report metrics...')}
              className="w-1/2 md:w-auto px-4 py-2 rounded-xl bg-[#009688] text-white font-bold hover:bg-teal-700"
              style={{ fontFamily: PP }}
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. TOP KPI SUMMARY CARDS GRID ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Revenue</span>
            <DollarSign size={16} className="text-[#0D47A1]" />
          </div>
          <div className="text-xl font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>
            ₹{kpiData.todayRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#66BB6A] font-semibold">↑ {revenueSummary.yesterdayComparison}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Invoices Generated</span>
            <FileText size={16} className="text-slate-600" />
          </div>
          <div className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
            {kpiData.invoicesGenerated}
          </div>
          <span className="text-[10px] text-slate-400">OPD Consultation Bills</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Payments Collected</span>
            <CheckCircle2 size={16} className="text-[#66BB6A]" />
          </div>
          <div className="text-xl font-bold text-[#66BB6A]" style={{ fontFamily: PP }}>
            ₹{kpiData.paymentsCollected.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">Collected Rate: {kpiData.collectionRate}%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Payments</span>
            <Clock size={16} className="text-[#F59E0B]" />
          </div>
          <div className="text-xl font-bold text-[#F59E0B]" style={{ fontFamily: PP }}>
            ₹{kpiData.pendingPayments.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting OPD Settlement</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1 col-span-2 md:col-span-4 xl:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Invoice</span>
            <CreditCard size={16} className="text-purple-600" />
          </div>
          <div className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
            ₹{kpiData.avgInvoiceValue.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Per Patient Bill</span>
        </div>
      </div>

      {/* ── 4. TWO-COLUMN RESPONSIVE LAYOUT (70% / 30%) ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (70% SPAN) ────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* SECTION 01: REVENUE SUMMARY */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 01: REVENUE SUMMARY
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Financial collection breakdown and comparisons
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#66BB6A] bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                {revenueSummary.yesterdayComparison}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs" style={{ fontFamily: RB }}>
              <div>
                <span className="text-slate-400 block text-[10px]">Gross Revenue</span>
                <span className="font-bold text-[#111827] text-sm" style={{ fontFamily: PP }}>₹{revenueSummary.grossRevenue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Collected Amount</span>
                <span className="font-bold text-[#66BB6A] text-sm" style={{ fontFamily: PP }}>₹{revenueSummary.collectedAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Outstanding</span>
                <span className="font-bold text-[#F59E0B] text-sm">₹{revenueSummary.outstandingAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Cancelled Amount</span>
                <span className="font-bold text-[#EF4444] text-sm">₹{revenueSummary.cancelledAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Collection Rate</span>
                <span className="font-bold text-[#0D47A1] text-sm">{revenueSummary.collectionPct}%</span>
              </div>
            </div>
          </div>

          {/* SECTION 02: PAYMENT METHOD BREAKDOWN */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold">
                <CreditCard size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 02: PAYMENT METHOD BREAKDOWN
                </h2>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Collection breakdown by channel
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs" style={{ fontFamily: RB }}>
              {paymentBreakdown.map((pm, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#111827]">{pm.method}</div>
                    <div className="text-slate-400 text-[11px]">{pm.count} Transactions</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#0D47A1]" style={{ fontFamily: PP }}>₹{pm.amount.toLocaleString()}</div>
                    <div className="text-[10px] font-semibold text-slate-500">{pm.pct}% of Total</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 03: DEPARTMENT COLLECTION SUMMARY TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 03: DEPARTMENT COLLECTION SUMMARY
                </h2>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Revenue generated per medical department
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Department</th>
                    <th className="py-2.5 px-4 text-center">Invoices</th>
                    <th className="py-2.5 px-4 text-right">Revenue (₹)</th>
                    <th className="py-2.5 px-4 text-right">Collected (₹)</th>
                    <th className="py-2.5 px-4 text-right">Pending (₹)</th>
                    <th className="py-2.5 px-4 text-right">Collection %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departmentCollections.map((dept, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#111827]">{dept.department}</td>
                      <td className="py-3 px-4 text-center font-semibold">{dept.invoices}</td>
                      <td className="py-3 px-4 text-right text-slate-700">₹{dept.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#66BB6A]">₹{dept.collected.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-[#F59E0B]">₹{dept.pending.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#0D47A1]">{dept.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 04: CASHIER PERFORMANCE TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 04: CASHIER PERFORMANCE
                </h2>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Counter productivity & cashier metrics
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Cashier Name</th>
                    <th className="py-2.5 px-4 text-center">Processed</th>
                    <th className="py-2.5 px-4 text-right">Collected (₹)</th>
                    <th className="py-2.5 px-4 text-center">Cancelled</th>
                    <th className="py-2.5 px-4 text-center">Avg Time</th>
                    <th className="py-2.5 px-4 text-center">Performance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cashierPerformance.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#111827]">{c.cashier}</td>
                      <td className="py-3 px-4 text-center font-semibold">{c.processed}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#66BB6A]">₹{c.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center text-slate-500">{c.cancelled}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{c.avgTime}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          c.status === 'Excellent' ? 'bg-green-50 text-[#66BB6A]' : 'bg-blue-50 text-[#0D47A1]'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 05: RECENT BILLING ACTIVITIES TIMELINE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 05: RECENT BILLING ACTIVITIES
                </h3>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Real-time timeline of billing events
                </p>
              </div>
            </div>

            <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {recentActivities.map((act, i) => (
                <div key={i} className="relative p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="absolute -left-6 top-3.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0D47A1]" />
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs text-[#0D47A1]" style={{ fontFamily: PP }}>
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <div className="text-xs text-slate-700" style={{ fontFamily: RB }}>{act.desc}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Processed by: {act.user}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 06: TOP RECENT INVOICES TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 06: RECENT TODAY'S INVOICES
                </h3>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Top recent invoices generated today
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Invoice No</th>
                    <th className="py-2.5 px-4">Patient</th>
                    <th className="py-2.5 px-4">Doctor</th>
                    <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-4 text-center">Mode</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentInvoices.map((inv, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0D47A1]">{inv.invNo}</td>
                      <td className="py-3 px-4 font-semibold text-[#111827]">{inv.patient}</td>
                      <td className="py-3 px-4 text-slate-700">{inv.doctor}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#111827]">₹{inv.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center font-medium">{inv.mode}</td>
                      <td className="py-3 px-4 text-center"><StatusChip status={inv.status} /></td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onViewInvoiceDetailsClick && onViewInvoiceDetailsClick(inv.invNo)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0D47A1] bg-blue-50 hover:bg-blue-100"
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ── RIGHT PANEL (30% STICKY PANEL) ───────────────────────────────── */}
        <div className="space-y-6">

          {/* TODAY'S BILLING SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">Summary</span>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  {isAdminReadOnly ? 'Billing Overview' : "Today's Billing Summary"}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Updated: 04:30 PM</span>
            </div>

            <div className="space-y-2 text-xs border-b border-gray-100 pb-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between text-slate-600">
                <span>Today's Revenue:</span>
                <span className="font-bold text-[#0D47A1]">₹{kpiData.todayRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#66BB6A] font-semibold">
                <span>Total Collected:</span>
                <span>₹{kpiData.paymentsCollected.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#F59E0B] font-semibold">
                <span>Pending Amount:</span>
                <span>₹{kpiData.pendingPayments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Invoices Generated:</span>
                <span className="font-bold text-[#111827]">{kpiData.invoicesGenerated} bills</span>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold" style={{ fontFamily: RB }}>
                <span className="text-slate-600">Daily Target (₹50,000)</span>
                <span className="text-[#66BB6A]">91.7%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-[#66BB6A]"
                  style={{ width: '91.7%' }}
                />
              </div>
            </div>

            {/* Digital vs Cash ratio */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5" style={{ fontFamily: RB }}>
              <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>Digital vs Cash Ratio</div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Digital (UPI + Card):</span>
                <span className="font-bold text-[#0D47A1]">73.0% (₹33,450)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Cash Collections:</span>
                <span className="font-bold text-slate-700">27.0% (₹12,400)</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full py-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Print Daily Report
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── 5. BOTTOM STICKY ACTION BAR ───────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
          >
            ← Back to Billing Dashboard
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting Excel...')}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-medium hover:bg-slate-50"
          >
            Export Excel
          </button>
          <button
            onClick={() => alert('Exporting PDF...')}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-medium hover:bg-slate-50"
          >
            Export PDF
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} />
            Print Report
          </button>
        </div>
      </div>

    </div>
  )
}

// ─── RECEPTIONIST PAYMENT COLLECTION WORKSPACE SCREEN ────────────────────────
export function ReceptionistPaymentCollectionScreen({
  invoiceId = 'INV-1043',
  onBack,
  onViewInvoiceClick,
  onPaymentCompleted,
}: {
  invoiceId?: string
  onBack: () => void
  onViewInvoiceClick?: (invId: string) => void
  onPaymentCompleted?: (receiptNo: string) => void
}) {
  // Existing Invoice Details (Read-Only)
  const invoiceData = {
    invoiceNumber: invoiceId,
    invoiceDate: '2026-07-25 10:30 AM',
    invoiceStatus: 'Generated' as const,
    paymentStatus: 'Pending' as PaymentStatus,
    invoiceType: 'OPD Consultation',
    consultationId: 'CNS-1042',
    createdBy: 'Emma Wilson (Billing)',
    generatedTime: '2026-07-25 10:30 AM',

    // Patient Info (Read-Only)
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-89201',
    ageGender: '34 Yrs / Female',
    mobile: '+91 98765 43210',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    appointmentDate: '2026-07-25 09:00 AM',
    consultationDate: '2026-07-25 09:30 AM',

    // Financial Breakdown
    grandTotal: 1644,
    alreadyPaid: 0,
  }

  // Editable Payment Form State
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>('UPI')
  const [amountReceived, setAmountReceived] = useState<number>(1644)
  const [referenceNo, setReferenceNo] = useState('UPI/894102/GPay')
  const [remarks, setRemarks] = useState('Payment collected at Reception Desk 01')
  const cashierName = 'Sarah Jenkins (Receptionist)'

  // Verification Checklist State
  const [checkedInvoice, setCheckedInvoice] = useState(true)
  const [checkedPatient, setCheckedPatient] = useState(true)
  const [checkedMode, setCheckedMode] = useState(true)
  const [checkedAmount, setCheckedAmount] = useState(true)
  const [checkedOutstanding, setCheckedOutstanding] = useState(true)

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [receiptNo] = useState('REC-9943')

  // Calculated Outstanding
  const outstandingBalance = Math.max(0, invoiceData.grandTotal - invoiceData.alreadyPaid)
  const remainingAfterPayment = Math.max(0, outstandingBalance - Number(amountReceived))
  const isFullyPaid = remainingAfterPayment === 0 && Number(amountReceived) > 0

  const allVerificationsPassed =
    checkedInvoice && checkedPatient && checkedMode && checkedAmount && checkedOutstanding

  const handleConfirmPayment = () => {
    if (!allVerificationsPassed || Number(amountReceived) <= 0) return
    setShowSuccessModal(true)
  }

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Reception Management</span>
            <ChevronRight size={12} />
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Billing & Payment</span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Payment Collection</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
            Payment Collection
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            Collect payment for an existing invoice and issue the official receipt.
          </p>
        </div>

        {/* Primary Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: RB }}
          >
            ← Back
          </button>
          <button
            onClick={() => onViewInvoiceClick && onViewInvoiceClick(invoiceData.invoiceNumber)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0D47A1] text-xs font-semibold hover:bg-blue-100 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <FileText size={15} />
            View Invoice
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN RESPONSIVE LAYOUT (70% / 30%) ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (70% SPAN) ────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* SECTION 01: INVOICE INFORMATION (READ ONLY) */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 01: INVOICE INFORMATION
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Read-only metadata of the generated OPD invoice
                  </p>
                </div>
              </div>
              <StatusChip status={invoiceData.paymentStatus} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs" style={{ fontFamily: RB }}>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Number</span>
                <span className="font-mono font-bold text-[#0D47A1] text-sm">{invoiceData.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Date</span>
                <span className="font-semibold text-slate-800">{invoiceData.invoiceDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Type</span>
                <span className="font-semibold text-slate-800">{invoiceData.invoiceType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Consultation ID</span>
                <span className="font-mono text-slate-700">{invoiceData.consultationId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Created By</span>
                <span className="text-slate-700">{invoiceData.createdBy}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Generated Time</span>
                <span className="text-slate-700">{invoiceData.generatedTime}</span>
              </div>
            </div>
          </div>

          {/* SECTION 02: PATIENT INFORMATION (READ ONLY) */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold">
                <User size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  SECTION 02: PATIENT INFORMATION
                </h2>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Patient and consultation details attached to this bill
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs" style={{ fontFamily: RB }}>
              <div>
                <span className="text-slate-400 block text-[11px]">Patient Name</span>
                <span className="font-bold text-[#111827] text-sm" style={{ fontFamily: PP }}>{invoiceData.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">MRN</span>
                <span className="font-mono font-bold text-[#0D47A1]">{invoiceData.mrn}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Age & Gender</span>
                <span className="font-medium text-slate-800">{invoiceData.ageGender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                <span className="font-medium text-slate-800">{invoiceData.mobile}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Attending Doctor</span>
                <span className="font-semibold text-slate-800">{invoiceData.doctor}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Department</span>
                <span className="font-semibold text-[#009688]">{invoiceData.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Appointment Date</span>
                <span className="text-slate-700">{invoiceData.appointmentDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Consultation Date</span>
                <span className="text-slate-700">{invoiceData.consultationDate}</span>
              </div>
            </div>
          </div>

          {/* SECTION 03: OUTSTANDING BALANCE SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
                  <DollarSign size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 03: OUTSTANDING BALANCE
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Financial balance due for collection
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" style={{ fontFamily: RB }}>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Grand Total</span>
                <span className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>₹{invoiceData.grandTotal.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Amount Already Paid</span>
                <span className="text-lg font-bold text-[#66BB6A]" style={{ fontFamily: PP }}>₹{invoiceData.alreadyPaid.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-amber-800 font-bold block text-[11px] uppercase tracking-wider">Outstanding Balance Due</span>
                <span className="text-xl font-bold text-[#EF4444]" style={{ fontFamily: PP }}>₹{outstandingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* SECTION 04: PAYMENT ENTRY (EDITABLE FORM CARD) */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center font-bold">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 04: PAYMENT ENTRY
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Enter collection mode, amount received, and reference details
                  </p>
                </div>
              </div>
              {isFullyPaid && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-[#66BB6A] text-xs font-bold" style={{ fontFamily: PP }}>
                  <CheckCircle2 size={14} />
                  Payment Complete
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" style={{ fontFamily: RB }}>
              {/* Payment Mode */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Mode *</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-bold focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>

              {/* Amount Received */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Amount Received (₹) *</label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-bold text-[#0D47A1] focus:bg-white focus:border-[#0D47A1] focus:outline-none text-base"
                />
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Transaction Reference Number</label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. UPI/894102/GPay"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 font-mono focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              {/* Collected By (Auto Read-Only) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Collected By (Auto)</label>
                <input
                  type="text"
                  value={cashierName}
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-100 font-medium text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Payment Remarks (Optional)</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Full OPD payment collected at Reception Desk 01"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECTION 05: PAYMENT VERIFICATION CHECKLIST */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    SECTION 05: PAYMENT VERIFICATION CHECKLIST
                  </h2>
                  <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    Validate all checks before confirming payment
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs" style={{ fontFamily: RB }}>
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedInvoice}
                  onChange={(e) => setCheckedInvoice(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0D47A1] focus:ring-0"
                />
                <span className="font-semibold text-slate-700">Invoice Number Verified ({invoiceData.invoiceNumber})</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedPatient}
                  onChange={(e) => setCheckedPatient(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0D47A1] focus:ring-0"
                />
                <span className="font-semibold text-slate-700">Patient Details Verified ({invoiceData.patientName})</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedMode}
                  onChange={(e) => setCheckedMode(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0D47A1] focus:ring-0"
                />
                <span className="font-semibold text-slate-700">Payment Mode Selected ({paymentMode})</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedAmount}
                  onChange={(e) => setCheckedAmount(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0D47A1] focus:ring-0"
                />
                <span className="font-semibold text-slate-700">Amount Received Verified (₹{amountReceived.toLocaleString()})</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 sm:col-span-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedOutstanding}
                  onChange={(e) => setCheckedOutstanding(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0D47A1] focus:ring-0"
                />
                <span className="font-semibold text-slate-700">Outstanding Cleared Status Checked</span>
              </label>
            </div>
          </div>

        </div>

        {/* ── RIGHT PANEL (30% STICKY PANEL) ───────────────────────────────── */}
        <div className="space-y-6">

          {/* STICKY PAYMENT SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">Summary</span>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Payment Summary
                </h3>
              </div>
              <StatusChip status={isFullyPaid ? 'Paid' : 'Pending'} />
            </div>

            <div className="space-y-2 text-xs border-b border-gray-100 pb-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between text-slate-600">
                <span>Invoice Number:</span>
                <span className="font-mono font-bold text-[#0D47A1]">{invoiceData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Patient:</span>
                <span className="font-bold text-[#111827]">{invoiceData.patientName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Doctor:</span>
                <span className="text-slate-700">{invoiceData.doctor}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Department:</span>
                <span className="text-slate-700">{invoiceData.department}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Method:</span>
                <span className="font-semibold text-slate-800">{paymentMode}</span>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs border-b border-gray-100 pb-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between text-slate-600">
                <span>Grand Total:</span>
                <span className="font-bold text-[#111827]">₹{invoiceData.grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#66BB6A] font-semibold">
                <span>Amount Received:</span>
                <span>₹{amountReceived.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#EF4444] font-bold">
                <span>Remaining Balance:</span>
                <span>₹{remainingAfterPayment.toLocaleString()}</span>
              </div>
            </div>

            {/* Collection Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold" style={{ fontFamily: RB }}>
                <span className="text-slate-600">Collection Progress</span>
                <span className="text-[#66BB6A]">
                  {Math.round((amountReceived / invoiceData.grandTotal) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-[#66BB6A]"
                  style={{ width: `${Math.min(100, Math.round((amountReceived / invoiceData.grandTotal) * 100))}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onViewInvoiceClick && onViewInvoiceClick(invoiceData.invoiceNumber)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                View Full Invoice Details
              </button>
              <button
                disabled={!showSuccessModal}
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={14} />
                Print Official Receipt
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── 3. BOTTOM STICKY ACTION BAR ───────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirmPayment}
            disabled={!allVerificationsPassed || Number(amountReceived) <= 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 disabled:opacity-50 transition-all shadow-sm active:scale-95"
            style={{ fontFamily: PP }}
          >
            <CheckCircle2 size={15} />
            Confirm Payment (₹{amountReceived.toLocaleString()})
          </button>
        </div>
      </div>

      {/* ── 4. PAYMENT SUCCESSFUL DIALOG ──────────────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mx-auto border-2 border-green-200">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-xs font-bold text-[#66BB6A] uppercase tracking-wider">Payment Successfully Collected</span>
              <h3 className="text-lg font-bold text-[#111827] mt-1" style={{ fontFamily: PP }}>
                Receipt {receiptNo} Generated
              </h3>
              <p className="text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
                Payment of <span className="font-bold text-[#66BB6A]">₹{amountReceived.toLocaleString()}</span> has been recorded for <span className="font-bold">{invoiceData.patientName}</span>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-left" style={{ fontFamily: RB }}>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Status:</span>
                <span className="font-bold text-[#66BB6A]">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-slate-800">{paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Txn Reference:</span>
                <span className="font-mono text-slate-600">{referenceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Collected By:</span>
                <span className="text-slate-700">{cashierName}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} />
                Print Receipt
              </button>
              <button
                onClick={() => onViewInvoiceClick && onViewInvoiceClick(invoiceData.invoiceNumber)}
                className="w-full py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#009688] text-xs font-bold hover:bg-teal-100 transition-colors"
                style={{ fontFamily: PP }}
              >
                View Invoice
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  if (onPaymentCompleted) onPaymentCompleted(receiptNo)
                  onBack()
                }}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Return to Reception Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── PATIENT PORTAL "MY BILLS" WORKSPACE SCREEN ─────────────────────────────
export function PatientMyBillsScreen({
  onBack,
  onViewInvoiceDetailsClick,
  onPrintInvoiceClick,
}: {
  onBack: () => void
  onViewInvoiceDetailsClick?: (invId: string) => void
  onPrintInvoiceClick?: (invId: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Patient Details
  const patientProfile = {
    name: 'Sarah Mitchell',
    mrn: 'MRN-89201',
    totalBills: 4,
    paidBills: 3,
    pendingBills: 1,
    lastPaymentDate: '2026-07-25',
    outstandingAmount: 850,
  }

  // Patient Invoices
  const patientInvoices = [
    {
      invNo: 'INV-1042',
      consultationDate: '2026-07-25 09:30 AM',
      doctor: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      invAmount: 1644,
      paidAmount: 1644,
      outstandingAmount: 0,
      status: 'Paid' as PaymentStatus,
    },
    {
      invNo: 'INV-1041',
      consultationDate: '2026-07-20 11:15 AM',
      doctor: 'Dr. Priya Sharma',
      department: 'General Medicine',
      invAmount: 1500,
      paidAmount: 650,
      outstandingAmount: 850,
      status: 'Partially Paid' as PaymentStatus,
    },
    {
      invNo: 'INV-1038',
      consultationDate: '2026-07-10 02:30 PM',
      doctor: 'Dr. Rajesh Kumar',
      department: 'Orthopedics',
      invAmount: 2400,
      paidAmount: 2400,
      outstandingAmount: 0,
      status: 'Paid' as PaymentStatus,
    },
    {
      invNo: 'INV-1025',
      consultationDate: '2026-06-15 10:00 AM',
      doctor: 'Dr. Sunita Rao',
      department: 'Dermatology',
      invAmount: 1200,
      paidAmount: 1200,
      outstandingAmount: 0,
      status: 'Paid' as PaymentStatus,
    },
  ]

  // Filter & Sort Logic
  const filteredInvoices = patientInvoices
    .filter((inv) => {
      const matchesSearch =
        inv.invNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.consultationDate.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' || inv.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.invNo.localeCompare(a.invNo)
      } else {
        return a.invNo.localeCompare(b.invNo)
      }
    })

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setSortOrder('newest')
  }

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium" style={{ fontFamily: RB }}>
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>
              Patient Portal
            </span>
            <ChevronRight size={12} />
            <span className="hover:text-[#0D47A1] cursor-pointer" onClick={onBack}>Billing & Payments</span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">My Bills</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: PP }}>
            My Bills
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            View all your invoices, payment status and download official receipts.
          </p>
        </div>
      </div>

      {/* ── 2. WELCOME SUMMARY CARDS ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider" style={{ fontFamily: RB }}>
            Patient
          </span>
          <div className="text-sm font-bold text-[#111827] truncate" style={{ fontFamily: PP }}>
            {patientProfile.name}
          </div>
          <span className="text-[11px] font-mono text-[#0D47A1] font-bold">{patientProfile.mrn}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider" style={{ fontFamily: RB }}>
            Total Invoices
          </span>
          <div className="text-xl font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>
            {patientProfile.totalBills}
          </div>
          <span className="text-[11px] text-slate-400">Consultations & Tests</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider" style={{ fontFamily: RB }}>
            Paid Bills
          </span>
          <div className="text-xl font-bold text-[#66BB6A]" style={{ fontFamily: PP }}>
            {patientProfile.paidBills}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Fully Cleared</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider" style={{ fontFamily: RB }}>
            Pending Bills
          </span>
          <div className="text-xl font-bold text-[#F59E0B]" style={{ fontFamily: PP }}>
            {patientProfile.pendingBills}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Action Required</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider" style={{ fontFamily: RB }}>
            Outstanding Balance
          </span>
          <div className="text-xl font-bold text-[#EF4444]" style={{ fontFamily: PP }}>
            ₹{patientProfile.outstandingAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-red-500 font-medium">Due at hospital desk</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider" style={{ fontFamily: RB }}>
            Last Payment
          </span>
          <div className="text-xs font-bold text-slate-700" style={{ fontFamily: PP }}>
            {patientProfile.lastPaymentDate}
          </div>
          <span className="text-[11px] text-slate-400">Cardiology Dept</span>
        </div>
      </div>

      {/* ── 3. MAIN WORKSPACE GRID (TABLE + RIGHT SIDEBAR) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (70% TABLE AREA) ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* SEARCH & FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs" style={{ fontFamily: RB }}>
              
              {/* Search input */}
              <div className="relative">
                <label className="block text-slate-600 font-semibold mb-1">Search Invoices</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Invoice No, Doctor, Date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium placeholder-slate-400 focus:outline-none focus:border-[#0D47A1]"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Date Range</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium text-slate-700"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
                style={{ fontFamily: RB }}
              >
                <RotateCcw size={12} />
                Reset Filters
              </button>
            </div>
          </div>

          {/* MY BILLS DATA TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Your Medical Invoices ({filteredInvoices.length})
                </h3>
              </div>
            </div>

            {filteredInvoices.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <FileText size={36} className="mx-auto text-slate-300" />
                <h4 className="text-sm font-bold text-slate-700" style={{ fontFamily: PP }}>
                  No invoices available yet.
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto" style={{ fontFamily: RB }}>
                  There are no billing records matching your search query or filter selection.
                </p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900"
                  style={{ fontFamily: PP }}
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-4">Invoice No</th>
                      <th className="py-2.5 px-4">Consultation Date</th>
                      <th className="py-2.5 px-4">Doctor & Dept</th>
                      <th className="py-2.5 px-4 text-right">Invoice Amount</th>
                      <th className="py-2.5 px-4 text-right">Paid</th>
                      <th className="py-2.5 px-4 text-right">Outstanding</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((inv, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#0D47A1]">{inv.invNo}</td>
                        <td className="py-3 px-4 text-slate-600">{inv.consultationDate}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#111827]">{inv.doctor}</div>
                          <div className="text-[11px] text-slate-500">{inv.department}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#111827]">₹{inv.invAmount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#66BB6A]">₹{inv.paidAmount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#EF4444]">₹{inv.outstandingAmount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center"><StatusChip status={inv.status} /></td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onViewInvoiceDetailsClick && onViewInvoiceDetailsClick(inv.invNo)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0D47A1] bg-blue-50 hover:bg-blue-100"
                              title="View Invoice Details"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                if (onPrintInvoiceClick) onPrintInvoiceClick(inv.invNo)
                                else window.print()
                              }}
                              className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                              title="Print Invoice"
                            >
                              <Printer size={13} />
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                              title="Download PDF"
                            >
                              <Download size={13} />
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

        </div>

        {/* ── RIGHT COLUMN (30% STICKY SUMMARY PANEL) ───────────────────────── */}
        <div className="space-y-6">

          {/* PATIENT BILLING SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">Summary</span>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Billing Summary
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-xs border-b border-gray-100 pb-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between text-slate-600">
                <span>Total Bills Count:</span>
                <span className="font-bold text-[#111827]">{patientProfile.totalBills} Invoices</span>
              </div>
              <div className="flex justify-between text-[#66BB6A] font-semibold">
                <span>Paid Bills:</span>
                <span>{patientProfile.paidBills} Cleared</span>
              </div>
              <div className="flex justify-between text-[#F59E0B] font-semibold">
                <span>Pending Bills:</span>
                <span>{patientProfile.pendingBills} Pending</span>
              </div>
              <div className="flex justify-between text-[#EF4444] font-bold text-sm pt-2 border-t border-slate-100">
                <span>Outstanding Amount:</span>
                <span>₹{patientProfile.outstandingAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Last Invoice & Payment Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2" style={{ fontFamily: RB }}>
              <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>Recent Activity</div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Last Invoice:</span>
                <span className="font-mono font-bold text-[#0D47A1]">INV-1042</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Last Payment:</span>
                <span className="font-bold text-[#66BB6A]">₹1,644 (25 Jul)</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onViewInvoiceDetailsClick && onViewInvoiceDetailsClick('INV-1042')}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                View Latest Invoice (INV-1042)
              </button>
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Download Latest Invoice
              </button>
              <button
                onClick={() => {
                  if (onPrintInvoiceClick) onPrintInvoiceClick('INV-1042')
                  else window.print()
                }}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Print Latest Invoice
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── 4. BOTTOM STICKY ACTION BAR ───────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100 font-bold"
            style={{ fontFamily: PP }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

    </div>
  )
}