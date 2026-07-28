import { useState, useMemo } from 'react'
import {
  Stethoscope, Users, Clock, CheckCircle2, Calendar, Search, Filter,
  RotateCcw, Plus, Eye, MoreVertical, Printer, Activity,
  ArrowUpRight, X,
  ChevronRight
} from 'lucide-react'

// --- Design System Tokens ---
const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

// --- Types ---
export type ConsultationStatus = 'Waiting' | 'In Progress' | 'Completed' | 'Follow-up Scheduled' | 'Cancelled'
export type VisitType = 'First Visit' | 'Follow-up' | 'Walk-In'

export interface ConsultationRecord {
  id: string
  tokenNo: string
  patientName: string
  mrn: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  phone: string
  doctor: string
  department: string
  appointmentTime: string
  visitType: VisitType
  status: ConsultationStatus
  chiefComplaint: string
  opdRoom: string
  date: string
  vitals?: {
    bp: string
    pulse: string
    temp: string
    spo2: string
  }
}

// Initial Mock Dataset
const INITIAL_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'CNS-1001',
    tokenNo: 'TK-01',
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-2024-001',
    age: 34,
    gender: 'Female',
    phone: '+1 (555) 234-5678',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    appointmentTime: '09:00 AM',
    visitType: 'First Visit',
    status: 'In Progress',
    chiefComplaint: 'Chest pain radiating to left arm with diaphoresis',
    opdRoom: 'OPD Room 104',
    date: new Date().toISOString().split('T')[0],
    vitals: { bp: '145/92', pulse: '88 bpm', temp: '37.2°C', spo2: '97%' }
  },
  {
    id: 'CNS-1002',
    tokenNo: 'TK-02',
    patientName: 'James Thornton',
    mrn: 'MRN-2024-002',
    age: 67,
    gender: 'Male',
    phone: '+1 (555) 345-6789',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    appointmentTime: '09:30 AM',
    visitType: 'Follow-up',
    status: 'Waiting',
    chiefComplaint: 'Post-angioplasty routine checkup & medication review',
    opdRoom: 'OPD Room 104',
    date: new Date().toISOString().split('T')[0],
    vitals: { bp: '130/82', pulse: '74 bpm', temp: '36.8°C', spo2: '98%' }
  },
  {
    id: 'CNS-1003',
    tokenNo: 'TK-03',
    patientName: 'Emma Reyes',
    mrn: 'MRN-2024-003',
    age: 28,
    gender: 'Female',
    phone: '+1 (555) 456-7890',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    appointmentTime: '10:00 AM',
    visitType: 'Walk-In',
    status: 'Waiting',
    chiefComplaint: 'Acute palpitation episodes during moderate exercise',
    opdRoom: 'OPD Room 104',
    date: new Date().toISOString().split('T')[0],
    vitals: { bp: '124/78', pulse: '92 bpm', temp: '36.6°C', spo2: '99%' }
  },
  {
    id: 'CNS-1004',
    tokenNo: 'TK-04',
    patientName: 'Robert Chen',
    mrn: 'MRN-2024-004',
    age: 52,
    gender: 'Male',
    phone: '+1 (555) 567-8901',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    appointmentTime: '08:30 AM',
    visitType: 'Follow-up',
    status: 'Completed',
    chiefComplaint: 'Hypertension evaluation and ECG review',
    opdRoom: 'OPD Room 104',
    date: new Date().toISOString().split('T')[0],
    vitals: { bp: '128/84', pulse: '70 bpm', temp: '36.7°C', spo2: '98%' }
  },
  {
    id: 'CNS-1005',
    tokenNo: 'TK-05',
    patientName: 'Aisha Kumar',
    mrn: 'MRN-2024-005',
    age: 41,
    gender: 'Female',
    phone: '+1 (555) 678-9012',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    appointmentTime: '10:30 AM',
    visitType: 'First Visit',
    status: 'Waiting',
    chiefComplaint: 'Shortness of breath on exertion and mild edema',
    opdRoom: 'OPD Room 104',
    date: new Date().toISOString().split('T')[0],
    vitals: { bp: '138/88', pulse: '82 bpm', temp: '37.0°C', spo2: '96%' }
  },
  {
    id: 'CNS-1006',
    tokenNo: 'TK-06',
    patientName: 'David Walsh',
    mrn: 'MRN-2024-006',
    age: 38,
    gender: 'Male',
    phone: '+1 (555) 789-0123',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    appointmentTime: '11:00 AM',
    visitType: 'Follow-up',
    status: 'Follow-up Scheduled',
    chiefComplaint: 'Lipid profile review and lifestyle modification plan',
    opdRoom: 'OPD Room 104',
    date: new Date().toISOString().split('T')[0],
    vitals: { bp: '122/80', pulse: '68 bpm', temp: '36.5°C', spo2: '99%' }
  },
  {
    id: 'CNS-1007',
    tokenNo: 'TK-07',
    patientName: 'Nina Patel',
    mrn: 'MRN-2024-007',
    age: 29,
    gender: 'Female',
    phone: '+1 (555) 890-1234',
    doctor: 'Dr. Priya Sharma',
    department: 'General Medicine',
    appointmentTime: '11:30 AM',
    visitType: 'First Visit',
    status: 'Cancelled',
    chiefComplaint: 'Patient called to reschedule due to work emergency',
    opdRoom: 'OPD Room 202',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'CNS-1008',
    tokenNo: 'TK-08',
    patientName: 'Carlos Mendez',
    mrn: 'MRN-2024-008',
    age: 63,
    gender: 'Male',
    phone: '+1 (555) 901-2345',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    appointmentTime: '08:00 AM',
    visitType: 'Follow-up',
    status: 'Completed',
    chiefComplaint: 'Aortic valve surveillance ultrasound review',
    opdRoom: 'OPD Room 104',
    date: new Date().toISOString().split('T')[0],
    vitals: { bp: '134/86', pulse: '76 bpm', temp: '36.6°C', spo2: '97%' }
  }
]

// Status configuration map for chips
const STATUS_CONFIG: Record<ConsultationStatus, { bg: string; text: string; dot: string; border: string }> = {
  'Waiting': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
  'In Progress': { bg: 'bg-teal-50', text: 'text-[#009688]', dot: 'bg-[#009688]', border: 'border-teal-200' },
  'Completed': { bg: 'bg-green-50', text: 'text-[#66BB6A]', dot: 'bg-[#66BB6A]', border: 'border-green-200' },
  'Follow-up Scheduled': { bg: 'bg-blue-50', text: 'text-[#0D47A1]', dot: 'bg-[#0D47A1]', border: 'border-blue-200' },
  'Cancelled': { bg: 'bg-red-50', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]', border: 'border-red-200' }
}

function StatusChip({ status }: { status: ConsultationStatus }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG['Waiting']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`} style={{ fontFamily: PP }}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'In Progress' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  )
}

function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-[#0D47A1]', 'bg-[#009688]', 'bg-violet-600', 'bg-rose-500', 'bg-amber-600']
  const color = colors[name.charCodeAt(0) % colors.length]
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`} style={{ fontFamily: PP }}>
      {initials}
    </div>
  )
}

export function OpdConsultationCenterScreen({
  onStartConsultation,
  onViewDetails,
  onViewHistory,
  onNavigateAppointments
}: {
  onStartConsultation?: (consultationId?: string) => void
  onViewDetails?: (consultationId: string) => void
  onViewHistory?: (patientId?: string) => void
  onNavigateAppointments?: () => void
}) {
  // --- States ---
  const [consultations] = useState<ConsultationRecord[]>(INITIAL_CONSULTATIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(false)

  // Filters
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0])
  const [filterDoctor, setFilterDoctor] = useState('Dr. Arjun Mehta')
  const [filterDepartment, setFilterDepartment] = useState('Cardiology')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterVisitType, setFilterVisitType] = useState('All')

  // Drawer / Modals state
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null)
  const [activeModal, setActiveModal] = useState<'details' | 'history' | 'print' | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // --- Filtering Logic ---
  const filteredConsultations = useMemo(() => {
    return consultations.filter(item => {
      // Tab filter
      if (activeTab !== 'All' && item.status !== activeTab) return false
      // Status filter
      if (filterStatus !== 'All' && item.status !== filterStatus) return false
      // Visit Type filter
      if (filterVisitType !== 'All' && item.visitType !== filterVisitType) return false
      // Department filter
      if (filterDepartment !== 'All' && item.department !== filterDepartment) return false
      // Doctor filter
      if (filterDoctor !== 'All' && item.doctor !== filterDoctor) return false

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.patientName.toLowerCase().includes(q)
        const matchMrn = item.mrn.toLowerCase().includes(q)
        const matchId = item.id.toLowerCase().includes(q)
        const matchPhone = item.phone.toLowerCase().includes(q)
        if (!matchName && !matchMrn && !matchId && !matchPhone) return false
      }

      return true
    })
  }, [consultations, activeTab, filterStatus, filterVisitType, filterDepartment, filterDoctor, searchQuery])

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setFilterDate(new Date().toISOString().split('T')[0])
    setFilterDoctor('Dr. Arjun Mehta')
    setFilterDepartment('Cardiology')
    setFilterStatus('All')
    setFilterVisitType('All')
    setActiveTab('All')
  }

  // Simulation of loading state refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }

  // Tab count indicators
  const tabCounts = useMemo(() => {
    return {
      All: consultations.length,
      Waiting: consultations.filter(c => c.status === 'Waiting').length,
      'In Progress': consultations.filter(c => c.status === 'In Progress').length,
      Completed: consultations.filter(c => c.status === 'Completed').length,
      'Follow-up Scheduled': consultations.filter(c => c.status === 'Follow-up Scheduled').length,
      Cancelled: consultations.filter(c => c.status === 'Cancelled').length,
    }
  }, [consultations])

  // Current Patient & Next Patient for Right Context Panel
  const currentPatient = consultations.find(c => c.status === 'In Progress')
  const nextPatient = consultations.find(c => c.status === 'Waiting')

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans">
      {/* ── BREADCRUMB & HEADER SECTION ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">OPD Consultation Management</span>
            </div>
            <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
              OPD Consultation Management
            </h1>
            <p className="text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Manage outpatient consultations and patient visits efficiently.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateAppointments?.()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-sm font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Clock size={16} className="text-[#0D47A1]" />
              Today's Queue
            </button>
            <button
              onClick={() => onStartConsultation?.(nextPatient?.id || currentPatient?.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-sm font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Plus size={16} />
              + Start Consultation
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* ── SUMMARY KPI CARDS ── */}
        <div className="grid grid-[#F1F5F9] grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 01: Today's Consultations */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Today's Consultations</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                <Stethoscope size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>{consultations.length}</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium" style={{ fontFamily: RB }}>
                <ArrowUpRight size={12} />
                <span>+12% vs yesterday</span>
              </div>
            </div>
          </div>

          {/* Card 02: Waiting Patients */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Waiting Patients</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>{tabCounts.Waiting}</div>
              <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-1 font-medium" style={{ fontFamily: RB }}>
                <Activity size={12} />
                <span>Avg wait: 14 mins</span>
              </div>
            </div>
          </div>

          {/* Card 03: Consultations In Progress */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>In Progress</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center">
                <Activity size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>{tabCounts['In Progress']}</div>
              <div className="flex items-center gap-1 text-[11px] text-[#009688] mt-1 font-medium" style={{ fontFamily: RB }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#009688] animate-pulse" />
                <span>1 Active Session</span>
              </div>
            </div>
          </div>

          {/* Card 04: Completed Consultations */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Completed</span>
              <div className="w-9 h-9 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>{tabCounts.Completed}</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium" style={{ fontFamily: RB }}>
                <ArrowUpRight size={12} />
                <span>94% efficiency rate</span>
              </div>
            </div>
          </div>

          {/* Card 05: Follow-up Cases */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Follow-up Cases</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>{tabCounts['Follow-up Scheduled']}</div>
              <div className="flex items-center gap-1 text-[11px] text-purple-600 mt-1 font-medium" style={{ fontFamily: RB }}>
                <Calendar size={12} />
                <span>Scheduled this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT: 3-COLUMN ENTERPRISE GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT & CENTER CONTENT (Columns 1-8 or 1-9 depending on screen size) */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* SEARCH AND FILTER BAR */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              {/* Global Search Component */}
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Patient Name, MRN, Consultation ID or Mobile Number..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all"
                  style={{ fontFamily: RB }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Reusable Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
                {/* Consultation Date */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Date</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                    style={{ fontFamily: RB }}
                  />
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Doctor</label>
                  <select
                    value={filterDoctor}
                    onChange={(e) => setFilterDoctor(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Doctors</option>
                    <option value="Dr. Arjun Mehta">Dr. Arjun Mehta (Logged in)</option>
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
                    <option value="Dr. Rajesh Kapoor">Dr. Rajesh Kapoor</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Departments</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Waiting">Waiting</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Visit Type */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Visit Type</label>
                  <select
                    value={filterVisitType}
                    onChange={(e) => setFilterVisitType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Visit Types</option>
                    <option value="First Visit">First Visit</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Walk-In">Walk-In</option>
                  </select>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Showing <span className="font-semibold text-[#111827]">{filteredConsultations.length}</span> consultations
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:text-[#111827] hover:bg-slate-50 transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <RotateCcw size={13} />
                    Reset Filters
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#009688] text-xs font-semibold text-white hover:bg-[#00827a] transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <Filter size={13} />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* CONSULTATION STATUS TABS */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] overflow-x-auto pb-1">
              {[
                { id: 'All', label: 'All', count: tabCounts.All },
                { id: 'Waiting', label: 'Waiting', count: tabCounts.Waiting },
                { id: 'In Progress', label: 'In Progress', count: tabCounts['In Progress'] },
                { id: 'Completed', label: 'Completed', count: tabCounts.Completed },
                { id: 'Follow-up Scheduled', label: 'Follow-up Scheduled', count: tabCounts['Follow-up Scheduled'] },
                { id: 'Cancelled', label: 'Cancelled', count: tabCounts.Cancelled },
              ].map((t) => {
                const isActive = activeTab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all shrink-0 ${isActive
                        ? 'border-[#0D47A1] text-[#0D47A1] bg-white shadow-sm'
                        : 'border-transparent text-[#64748B] hover:text-[#111827] hover:bg-white/50'
                      }`}
                    style={{ fontFamily: PP }}
                  >
                    <span>{t.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-blue-100 text-[#0D47A1]' : 'bg-slate-200 text-slate-600'
                      }`}>
                      {t.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* MAIN ENTERPRISE TABLE OR SKELETON / EMPTY STATE */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              {isLoading ? (
                /* LOADING SKELETON STATE */
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : filteredConsultations.length === 0 ? (
                /* EMPTY STATE */
                <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <Stethoscope size={32} />
                  </div>
                  <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    No consultations found.
                  </h3>
                  <p className="text-xs text-[#64748B] max-w-sm mt-1 mb-6" style={{ fontFamily: RB }}>
                    There are no matching consultation records for the selected filters. You can start a new consultation or clear filters.
                  </p>
                  <button
                    onClick={() => onStartConsultation?.()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D47A1] text-white text-xs font-semibold rounded-xl hover:bg-[#0a3880] transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <Plus size={14} />
                    Start Consultation
                  </button>
                </div>
              ) : (
                /* ENTERPRISE DATA TABLE */
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[11px] font-bold text-[#64748B] uppercase tracking-wider" style={{ fontFamily: PP }}>
                          <th className="py-3.5 px-4">Consultation ID</th>
                          <th className="py-3.5 px-4">Patient</th>
                          <th className="py-3.5 px-4">MRN</th>
                          <th className="py-3.5 px-4">Age / Gender</th>
                          <th className="py-3.5 px-4">Doctor</th>
                          <th className="py-3.5 px-4">Department</th>
                          <th className="py-3.5 px-4">Appointment Time</th>
                          <th className="py-3.5 px-4">Visit Type</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB] text-xs" style={{ fontFamily: RB }}>
                        {filteredConsultations.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                            {/* Consultation ID */}
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0D47A1]">
                              <div className="flex items-center gap-1.5">
                                <span>{item.id}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">{item.tokenNo}</span>
                              </div>
                            </td>

                            {/* Patient */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={item.patientName} size="sm" />
                                <div>
                                  <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{item.patientName}</div>
                                  <div className="text-[11px] text-slate-500">{item.phone}</div>
                                </div>
                              </div>
                            </td>

                            {/* MRN */}
                            <td className="py-3.5 px-4 font-mono text-slate-700">{item.mrn}</td>

                            {/* Age / Gender */}
                            <td className="py-3.5 px-4 text-slate-700">{item.age} yrs / {item.gender}</td>

                            {/* Doctor */}
                            <td className="py-3.5 px-4 font-medium text-slate-800">{item.doctor}</td>

                            {/* Department */}
                            <td className="py-3.5 px-4 text-slate-600">{item.department}</td>

                            {/* Appointment Time */}
                            <td className="py-3.5 px-4 font-medium text-slate-800">{item.appointmentTime}</td>

                            {/* Visit Type */}
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md ${item.visitType === 'First Visit' ? 'bg-blue-50 text-blue-700' :
                                  item.visitType === 'Walk-In' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                                }`} style={{ fontFamily: PP }}>
                                {item.visitType}
                              </span>
                            </td>

                            {/* Consultation Status */}
                            <td className="py-3.5 px-4">
                              <StatusChip status={item.status} />
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right relative">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onStartConsultation?.(item.id)}
                                  className="px-2.5 py-1.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white rounded-lg text-[11px] font-semibold transition-colors"
                                  style={{ fontFamily: PP }}
                                >
                                  Open Consultation
                                </button>

                                <button
                                  onClick={() => {
                                    if (onViewDetails) {
                                      onViewDetails(item.id)
                                    } else {
                                      setSelectedRecord(item)
                                      setActiveModal('details')
                                    }
                                  }}
                                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={15} />
                                </button>

                                <div className="relative inline-block text-left">
                                  <button
                                    onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                                    className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                  >
                                    <MoreVertical size={15} />
                                  </button>

                                  {openDropdownId === item.id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 text-left">
                                      <button
                                        onClick={() => {
                                          if (onViewHistory) {
                                            onViewHistory(item.mrn)
                                          } else {
                                            setSelectedRecord(item)
                                            setActiveModal('history')
                                          }
                                          setOpenDropdownId(null)
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        style={{ fontFamily: RB }}
                                      >
                                        <RotateCcw size={14} className="text-[#0D47A1]" />
                                        View Consultation History
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedRecord(item)
                                          setActiveModal('print')
                                          setOpenDropdownId(null)
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        style={{ fontFamily: RB }}
                                      >
                                        <Printer size={14} className="text-[#009688]" />
                                        Print Consultation Summary
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

                  {/* PAGINATION BAR */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                    <div>
                      Showing <span className="font-semibold text-[#111827]">1</span> to <span className="font-semibold text-[#111827]">{filteredConsultations.length}</span> of <span className="font-semibold text-[#111827]">{consultations.length}</span> consultations
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg bg-white text-slate-400 cursor-not-allowed text-xs font-medium">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 bg-[#0D47A1] text-white rounded-lg text-xs font-semibold">
                        1
                      </button>
                      <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg bg-white text-slate-400 cursor-not-allowed text-xs font-medium">
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT CONTEXT PANEL: TODAY'S OVERVIEW ── */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">

            {/* SECTION 1: CURRENT QUEUE */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2" style={{ fontFamily: PP }}>
                  <Activity size={16} className="text-[#009688]" />
                  Current Queue
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-[#009688]" style={{ fontFamily: PP }}>Live</span>
              </div>

              {/* Current Patient */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2" style={{ fontFamily: PP }}>Current Patient</div>
                {currentPatient ? (
                  <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111827]" style={{ fontFamily: PP }}>{currentPatient.patientName}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded">{currentPatient.tokenNo}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{currentPatient.mrn} · {currentPatient.age}y / {currentPatient.gender}</div>
                    <div className="text-[11px] text-slate-700 italic bg-white/70 p-2 rounded-lg border border-teal-100/50">
                      "{currentPatient.chiefComplaint}"
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">No active consultation</div>
                )}
              </div>

              {/* Next Patient */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2" style={{ fontFamily: PP }}>Next Patient</div>
                {nextPatient ? (
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111827]" style={{ fontFamily: PP }}>{nextPatient.patientName}</span>
                      <span className="text-[10px] font-mono text-slate-500">{nextPatient.appointmentTime}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{nextPatient.mrn} · {nextPatient.visitType}</div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">No patient in waiting queue</div>
                )}
              </div>

              {/* Average Consultation Time */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium" style={{ fontFamily: RB }}>Average Consultation Time</span>
                <span className="font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>14 mins</span>
              </div>
            </div>

            {/* SECTION 2: QUICK ACTIONS */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Quick Actions
              </h3>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onStartConsultation?.()}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50 text-[#0D47A1] hover:bg-blue-100 text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2">
                    <Stethoscope size={15} />
                    Start Consultation
                  </span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => onNavigateAppointments?.()}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 text-[#111827] hover:bg-slate-100 text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2">
                    <Clock size={15} className="text-[#009688]" />
                    View Today's Queue
                  </span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => onNavigateAppointments?.()}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 text-[#111827] hover:bg-slate-100 text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2">
                    <Calendar size={15} className="text-purple-600" />
                    Appointment Center
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* SECTION 3: MY SCHEDULE */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  My Schedule
                </h3>
                <span className="text-xs text-[#0D47A1] font-semibold" style={{ fontFamily: PP }}>OPD Wing A</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium" style={{ fontFamily: RB }}>Upcoming Appointments</span>
                  <span className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{tabCounts.Waiting} remaining</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium" style={{ fontFamily: RB }}>Next Consultation Time</span>
                  <span className="font-bold text-[#009688]" style={{ fontFamily: PP }}>{nextPatient?.appointmentTime || 'N/A'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MODALS / DRAWERS ── */}

      {/* 1. View Details Modal */}
      {activeModal === 'details' && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-gray-100 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded font-bold">{selectedRecord.id}</span>
                <h3 className="text-lg font-bold text-[#111827] mt-1" style={{ fontFamily: PP }}>Consultation Details</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Patient Name</span>
                  <p className="font-bold text-slate-800 text-sm">{selectedRecord.patientName}</p>
                  <p className="text-slate-500">{selectedRecord.mrn} ({selectedRecord.age}y / {selectedRecord.gender})</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Status</span>
                  <div><StatusChip status={selectedRecord.status} /></div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Chief Complaint</span>
                <p className="text-slate-700 font-medium mt-0.5">{selectedRecord.chiefComplaint}</p>
              </div>

              {selectedRecord.vitals && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Recorded Vitals</span>
                  <div className="grid grid-cols-4 gap-2 mt-1.5">
                    <div className="p-2 bg-blue-50 rounded-lg text-center">
                      <div className="text-[9px] text-blue-600 font-bold">BP</div>
                      <div className="font-bold text-slate-800">{selectedRecord.vitals.bp}</div>
                    </div>
                    <div className="p-2 bg-teal-50 rounded-lg text-center">
                      <div className="text-[9px] text-teal-600 font-bold">PULSE</div>
                      <div className="font-bold text-slate-800">{selectedRecord.vitals.pulse}</div>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg text-center">
                      <div className="text-[9px] text-amber-600 font-bold">TEMP</div>
                      <div className="font-bold text-slate-800">{selectedRecord.vitals.temp}</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg text-center">
                      <div className="text-[9px] text-green-600 font-bold">SpO2</div>
                      <div className="font-bold text-slate-800">{selectedRecord.vitals.spo2}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                style={{ fontFamily: PP }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModal(null)
                  onStartConsultation?.(selectedRecord.id)
                }}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0a3880]"
                style={{ fontFamily: PP }}
              >
                Open Consultation Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. View Consultation History Modal */}
      {activeModal === 'history' && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>Consultation History</h3>
                <p className="text-xs text-slate-500">{selectedRecord.patientName} · {selectedRecord.mrn}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {[
                { date: '2026-07-24', type: 'First Visit', dx: 'Angina pectoris suspect', doctor: 'Dr. Arjun Mehta' },
                { date: '2026-06-10', type: 'Follow-up', dx: 'Hypertension stage 1', doctor: 'Dr. Arjun Mehta' },
                { date: '2026-04-15', type: 'Routine Checkup', dx: 'Normal ECG', doctor: 'Dr. Priya Sharma' },
              ].map((h, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800" style={{ fontFamily: PP }}>
                    <span>{h.date} — {h.type}</span>
                    <span className="text-[#0D47A1]">{h.doctor}</span>
                  </div>
                  <div className="text-slate-600">Diagnosis: {h.dx}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                style={{ fontFamily: PP }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Print Consultation Summary Modal */}
      {activeModal === 'print' && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>Print Summary</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-700">
              <p className="font-bold text-[#0D47A1]">Hospital Management System — OPD Visit Summary</p>
              <p>Patient: {selectedRecord.patientName} ({selectedRecord.mrn})</p>
              <p>Consultation ID: {selectedRecord.id}</p>
              <p>Doctor: {selectedRecord.doctor} ({selectedRecord.department})</p>
              <p>Date: {selectedRecord.date}</p>
              <p className="text-slate-500 italic mt-2">Ready to send to connected hospital receipt printer.</p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-gray-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Summary printed for ${selectedRecord.id}`)
                  setActiveModal(null)
                }}
                className="px-4 py-2 bg-[#009688] text-white text-xs font-semibold rounded-xl hover:bg-[#00827a] flex items-center gap-1.5"
              >
                <Printer size={14} />
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
