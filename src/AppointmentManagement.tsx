import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  Calendar, Clock, UserCheck, CheckCircle2, AlertTriangle, ChevronRight, Search,
  Filter, X, Plus, Edit, Eye, ArrowUpDown, RotateCcw, Building2,
  Zap, Ban, RefreshCw, Calendar as CalendarIcon, Printer, Stethoscope,
  User, AlertCircle, FileText, Lock, ArrowLeft, Users, PhoneCall,
  ChevronLeft, Info, UserPlus, Check
} from 'lucide-react'

// --- Typography Tokens ---
const PP = 'Poppins, sans-serif'
const RB = 'Roboto, sans-serif'

type ChipVariant = 'success' | 'warning' | 'error' | 'info' | 'teal' | 'default'

function Chip({ label, variant = 'default' }: { label: string; variant?: ChipVariant }) {
  const map: Record<ChipVariant, string> = {
    success: 'bg-green-50 text-[#66BB6A]',
    warning: 'bg-amber-50 text-[#F59E0B]',
    error: 'bg-red-50 text-[#EF4444]',
    info: 'bg-blue-50 text-[#0D47A1]',
    teal: 'bg-teal-50 text-[#009688]',
    default: 'bg-slate-50 text-[#64748B]',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[variant]}`}
      style={{ fontFamily: RB }}>{label}</span>
  )
}

// --- Types ---
export type AppointmentStatus = 'Scheduled' | 'Checked-In' | 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled'
export type VisitType = 'First Visit' | 'Follow-up' | 'Walk-In'
export type PriorityLevel = 'Normal' | 'Urgent' | 'High'
export type UserRole = 'Receptionist' | 'Admin' | 'Hospital Admin' | 'Super Admin' | 'Doctor' | 'Nurse'

export interface PatientSummary {
  id: string
  mrn: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  bloodGroup: string
  phone: string
  emergencyContact: string
  assignedDoctor?: string
}

export interface DoctorSummary {
  id: string
  name: string
  department: string
  specialty: string
  qualification: string
  consultationFee: number
  opdRoom: string
}

export interface TimelineActivity {
  id: string
  title: string
  timestamp: string
  performedBy: string
  status: AppointmentStatus
  notes?: string
}

export interface AppointmentRecord {
  id: string
  tokenNo: string
  patientId: string
  patientName: string
  patientAge: number
  patientGender: 'Male' | 'Female' | 'Other'
  patientPhone: string
  mrn: string
  doctorId: string
  doctorName: string
  doctorSpecialty: string
  department: string
  appointmentDate: string // YYYY-MM-DD
  timeSlot: string // e.g. "09:00 AM"
  visitType: VisitType
  priority: PriorityLevel
  status: AppointmentStatus
  arrivalStatus?: 'Not Arrived' | 'Arrived' | 'In Lounge' | 'Called'
  chiefComplaint: string
  waitingTimeMinutes?: number
  opdRoom: string
  createdDate: string
  cancellationReason?: string
  rescheduleReason?: string
  rescheduledCount?: number
  isWalkIn?: boolean
  notes?: string
}

// Initial Mock Patients Database
export const PATIENT_DATABASE: PatientSummary[] = [
  { id: 'PAT-2001', mrn: 'MRN-2024-001', name: 'Sarah Mitchell', age: 34, gender: 'Female', bloodGroup: 'A+', phone: '+1 (555) 234-5678', emergencyContact: '+1 (555) 987-6543 (Spouse)', assignedDoctor: 'Dr. Arjun Mehta' },
  { id: 'PAT-2002', mrn: 'MRN-2024-002', name: 'James Thornton', age: 67, gender: 'Male', bloodGroup: 'O+', phone: '+1 (555) 345-6789', emergencyContact: '+1 (555) 876-5432 (Daughter)', assignedDoctor: 'Dr. Priya Sharma' },
  { id: 'PAT-2003', mrn: 'MRN-2024-003', name: 'Emma Reyes', age: 28, gender: 'Female', bloodGroup: 'B+', phone: '+1 (555) 456-7890', emergencyContact: '+1 (555) 765-4321 (Mother)', assignedDoctor: 'Dr. Sunita Patel' },
  { id: 'PAT-2004', mrn: 'MRN-2024-004', name: 'Robert Chen', age: 52, gender: 'Male', bloodGroup: 'AB+', phone: '+1 (555) 567-8901', emergencyContact: '+1 (555) 654-3210 (Wife)', assignedDoctor: 'Dr. Arjun Mehta' },
  { id: 'PAT-2005', mrn: 'MRN-2024-005', name: 'Aisha Kumar', age: 41, gender: 'Female', bloodGroup: 'O-', phone: '+1 (555) 678-9012', emergencyContact: '+1 (555) 543-2109 (Brother)', assignedDoctor: 'Dr. Rajesh Kapoor' },
  { id: 'PAT-2006', mrn: 'MRN-2024-006', name: 'David Walsh', age: 38, gender: 'Male', bloodGroup: 'A-', phone: '+1 (555) 789-0123', emergencyContact: '+1 (555) 432-1098 (Sister)', assignedDoctor: 'Dr. Priya Sharma' },
  { id: 'PAT-2007', mrn: 'MRN-2024-007', name: 'Nina Patel', age: 29, gender: 'Female', bloodGroup: 'B-', phone: '+1 (555) 890-1234', emergencyContact: '+1 (555) 321-0987 (Father)', assignedDoctor: 'Dr. Rajesh Kapoor' },
  { id: 'PAT-2008', mrn: 'MRN-2024-008', name: 'Carlos Mendez', age: 63, gender: 'Male', bloodGroup: 'O+', phone: '+1 (555) 901-2345', emergencyContact: '+1 (555) 210-9876 (Wife)', assignedDoctor: 'Dr. Priya Sharma' },
]

// Mock Doctor Database
export const DOCTOR_DATABASE: Record<string, DoctorSummary> = {
  'Dr. Arjun Mehta': {
    id: 'DOC-1001',
    name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    specialty: 'Interventional Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology)',
    consultationFee: 150,
    opdRoom: 'OPD Room 104'
  },
  'Dr. Priya Sharma': {
    id: 'DOC-1002',
    name: 'Dr. Priya Sharma',
    department: 'General Medicine',
    specialty: 'Internal Medicine',
    qualification: 'MBBS, MD (Medicine)',
    consultationFee: 120,
    opdRoom: 'OPD Room 202'
  },
  'Dr. Rajesh Kapoor': {
    id: 'DOC-1003',
    name: 'Dr. Rajesh Kapoor',
    department: 'Neurology',
    specialty: 'Clinical Neurology',
    qualification: 'MBBS, MD, DM (Neurology)',
    consultationFee: 160,
    opdRoom: 'OPD Room 305'
  },
  'Dr. Sunita Patel': {
    id: 'DOC-1004',
    name: 'Dr. Sunita Patel',
    department: 'Gynecology',
    specialty: 'Obstetrics & Gynecology',
    qualification: 'MBBS, MS (OB-GYN)',
    consultationFee: 140,
    opdRoom: 'OPD Room 108'
  }
}

// Doctor Availability Data
const DOCTOR_AVAILABILITY_DATA: Record<string, { specialty: string; department: string; opdRoom: string; slotDuration: string; slots: { time: string; available: boolean }[] }> = {
  'Dr. Arjun Mehta': {
    specialty: 'Interventional Cardiology',
    department: 'Cardiology',
    opdRoom: 'OPD Room 104',
    slotDuration: '15 Minutes',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '09:15 AM', available: true },
      { time: '09:30 AM', available: true },
      { time: '09:45 AM', available: false },
      { time: '10:00 AM', available: true },
      { time: '10:15 AM', available: true },
      { time: '10:30 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '11:30 AM', available: false },
      { time: '02:00 PM', available: true },
      { time: '02:30 PM', available: true },
      { time: '03:00 PM', available: true },
    ]
  },
  'Dr. Priya Sharma': {
    specialty: 'Internal Medicine',
    department: 'General Medicine',
    opdRoom: 'OPD Room 202',
    slotDuration: '15 Minutes',
    slots: [
      { time: '08:30 AM', available: true },
      { time: '09:00 AM', available: false },
      { time: '09:15 AM', available: true },
      { time: '09:30 AM', available: true },
      { time: '09:45 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '10:15 AM', available: true },
      { time: '10:30 AM', available: true },
      { time: '11:00 AM', available: false },
      { time: '02:00 PM', available: true },
      { time: '02:30 PM', available: true },
    ]
  },
  'Dr. Rajesh Kapoor': {
    specialty: 'Neurology',
    department: 'Neurology',
    opdRoom: 'OPD Room 305',
    slotDuration: '20 Minutes',
    slots: [
      { time: '10:00 AM', available: true },
      { time: '10:20 AM', available: true },
      { time: '10:40 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '11:20 AM', available: false },
      { time: '02:00 PM', available: true },
      { time: '02:20 PM', available: true },
    ]
  },
  'Dr. Sunita Patel': {
    specialty: 'Obstetrics & Gynecology',
    department: 'Gynecology',
    opdRoom: 'OPD Room 108',
    slotDuration: '15 Minutes',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '09:15 AM', available: true },
      { time: '09:30 AM', available: true },
      { time: '09:45 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '10:30 AM', available: false },
      { time: '11:00 AM', available: true },
      { time: '02:00 PM', available: true },
    ]
  }
}

// Initial Mock Appointments Dataset
export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'APT-1001',
    tokenNo: 'TK-01',
    patientId: 'PAT-2001',
    patientName: 'Sarah Mitchell',
    patientAge: 34,
    patientGender: 'Female',
    patientPhone: '+1 (555) 234-5678',
    mrn: 'MRN-2024-001',
    doctorId: 'DOC-1001',
    doctorName: 'Dr. Arjun Mehta',
    doctorSpecialty: 'Interventional Cardiology',
    department: 'Cardiology',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    visitType: 'First Visit',
    priority: 'High',
    status: 'Waiting',
    arrivalStatus: 'In Lounge',
    chiefComplaint: 'Chest tightness radiating to arm, mild dyspnea',
    waitingTimeMinutes: 18,
    opdRoom: 'OPD Room 104',
    createdDate: '2026-07-20',
    notes: 'Patient arrived at reception at 08:42 AM.'
  },
  {
    id: 'APT-1002',
    tokenNo: 'TK-02',
    patientId: 'PAT-2002',
    patientName: 'James Thornton',
    patientAge: 67,
    patientGender: 'Male',
    patientPhone: '+1 (555) 345-6789',
    mrn: 'MRN-2024-002',
    doctorId: 'DOC-1002',
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'Internal Medicine',
    department: 'General Medicine',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:30 AM',
    visitType: 'Follow-up',
    priority: 'Normal',
    status: 'In Progress',
    arrivalStatus: 'Called',
    chiefComplaint: 'Routine Type-2 Diabetes quarterly review & HbA1c review',
    waitingTimeMinutes: 5,
    opdRoom: 'OPD Room 202',
    createdDate: '2026-07-21'
  },
  {
    id: 'APT-1003',
    tokenNo: 'TK-03',
    patientId: 'PAT-2003',
    patientName: 'Emma Reyes',
    patientAge: 28,
    patientGender: 'Female',
    patientPhone: '+1 (555) 456-7890',
    mrn: 'MRN-2024-003',
    doctorId: 'DOC-1004',
    doctorName: 'Dr. Sunita Patel',
    doctorSpecialty: 'Obstetrics & Gynecology',
    department: 'Gynecology',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    visitType: 'Walk-In',
    priority: 'Normal',
    status: 'Checked-In',
    arrivalStatus: 'Arrived',
    isWalkIn: true,
    chiefComplaint: 'Routine antenatal checkup (2nd trimester)',
    waitingTimeMinutes: 12,
    opdRoom: 'OPD Room 108',
    createdDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'APT-1004',
    tokenNo: 'TK-04',
    patientId: 'PAT-2004',
    patientName: 'Robert Chen',
    patientAge: 52,
    patientGender: 'Male',
    patientPhone: '+1 (555) 567-8901',
    mrn: 'MRN-2024-004',
    doctorId: 'DOC-1001',
    doctorName: 'Dr. Arjun Mehta',
    doctorSpecialty: 'Interventional Cardiology',
    department: 'Cardiology',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:30 AM',
    visitType: 'Follow-up',
    priority: 'Normal',
    status: 'Scheduled',
    arrivalStatus: 'Not Arrived',
    chiefComplaint: 'Post-angioplasty follow-up consultation',
    opdRoom: 'OPD Room 104',
    createdDate: '2026-07-21'
  },
  {
    id: 'APT-1005',
    tokenNo: 'TK-05',
    patientId: 'PAT-2005',
    patientName: 'Aisha Kumar',
    patientAge: 41,
    patientGender: 'Female',
    patientPhone: '+1 (555) 678-9012',
    mrn: 'MRN-2024-005',
    doctorId: 'DOC-1003',
    doctorName: 'Dr. Rajesh Kapoor',
    doctorSpecialty: 'Neurology',
    department: 'Neurology',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    visitType: 'First Visit',
    priority: 'Normal',
    status: 'Scheduled',
    arrivalStatus: 'Not Arrived',
    chiefComplaint: 'Persistent migraine headaches for 3 weeks',
    opdRoom: 'OPD Room 305',
    createdDate: '2026-07-22'
  },
  {
    id: 'APT-1006',
    tokenNo: 'TK-06',
    patientId: 'PAT-2006',
    patientName: 'David Walsh',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+1 (555) 789-0123',
    mrn: 'MRN-2024-006',
    doctorId: 'DOC-1002',
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'Internal Medicine',
    department: 'General Medicine',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '11:30 AM',
    visitType: 'Walk-In',
    priority: 'Normal',
    status: 'Checked-In',
    arrivalStatus: 'Arrived',
    isWalkIn: true,
    chiefComplaint: 'Lower back stiffness and muscle spasm',
    opdRoom: 'OPD Room 202',
    createdDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'APT-1007',
    tokenNo: 'TK-07',
    patientId: 'PAT-2007',
    patientName: 'Nina Patel',
    patientAge: 29,
    patientGender: 'Female',
    patientPhone: '+1 (555) 890-1234',
    mrn: 'MRN-2024-007',
    doctorId: 'DOC-1003',
    doctorName: 'Dr. Rajesh Kapoor',
    doctorSpecialty: 'Neurology',
    department: 'Neurology',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '08:30 AM',
    visitType: 'Follow-up',
    priority: 'Normal',
    status: 'Completed',
    arrivalStatus: 'Called',
    chiefComplaint: 'Tension headache follow-up',
    opdRoom: 'OPD Room 305',
    createdDate: '2026-07-19'
  },
  {
    id: 'APT-1008',
    tokenNo: 'TK-08',
    patientId: 'PAT-2008',
    patientName: 'Carlos Mendez',
    patientAge: 63,
    patientGender: 'Male',
    patientPhone: '+1 (555) 901-2345',
    mrn: 'MRN-2024-008',
    doctorId: 'DOC-1002',
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'Internal Medicine',
    department: 'General Medicine',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '08:00 AM',
    visitType: 'First Visit',
    priority: 'Normal',
    status: 'Completed',
    arrivalStatus: 'Called',
    chiefComplaint: 'Bilateral knee joint stiffness',
    opdRoom: 'OPD Room 202',
    createdDate: '2026-07-18'
  }
]

// Status Configuration Palette
const STATUS_CONFIG: Record<AppointmentStatus, { bg: string; text: string; dot: string; border: string }> = {
  'Scheduled': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400', border: 'border-slate-200' },
  'Checked-In': { bg: 'bg-blue-50', text: 'text-[#0D47A1]', dot: 'bg-[#0D47A1]', border: 'border-blue-200' },
  'Waiting': { bg: 'bg-amber-50', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]', border: 'border-amber-200' },
  'In Progress': { bg: 'bg-teal-50', text: 'text-[#009688]', dot: 'bg-[#009688]', border: 'border-teal-200' },
  'Completed': { bg: 'bg-green-50', text: 'text-[#66BB6A]', dot: 'bg-[#66BB6A]', border: 'border-green-200' },
  'Cancelled': { bg: 'bg-red-50', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]', border: 'border-red-200' },
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG['Scheduled']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`} style={{ fontFamily: PP }}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status === 'In Progress' ? 'In Consultation' : status === 'Checked-In' ? 'Checked-In' : status}
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

// ─── REUSABLE RESCHEDULE APPOINTMENT CONFIRMATION DIALOG ──────────────────────
export function RescheduleAppointmentConfirmationDialog({
  apt,
  isOpen,
  onClose,
  onConfirmReschedule
}: {
  apt: AppointmentRecord | null
  isOpen: boolean
  onClose: () => void
  onConfirmReschedule: (aptId: string, newDate: string, newTimeSlot: string, reason: string, remarks?: string) => void
}) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('Patient Request')
  const [additionalRemarks, setAdditionalRemarks] = useState('')
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 6, 1)) // July 2026
  const [errors, setErrors] = useState<Record<string, string>>({})
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && apt) {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const defaultDateStr = tomorrow.toISOString().split('T')[0]

      setSelectedDate(defaultDateStr)
      setSelectedTimeSlot('09:30 AM')
      setRescheduleReason('Patient Request')
      setAdditionalRemarks('')
      setErrors({})
    }
  }, [isOpen, apt])

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !apt) return null

  const docAvail = DOCTOR_AVAILABILITY_DATA[apt.doctorName] || DOCTOR_AVAILABILITY_DATA['Dr. Arjun Mehta']

  const handlePrevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const year = currentMonthDate.getFullYear()
  const month = currentMonthDate.getMonth()
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' })
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  const todayStr = new Date().toISOString().split('T')[0]

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!selectedDate) errs.date = 'Appointment date is required.'
    if (!selectedTimeSlot) errs.slot = 'Time slot selection is required.'
    if (!rescheduleReason) errs.reason = 'Reschedule reason is required.'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onConfirmReschedule(apt.id, selectedDate, selectedTimeSlot, rescheduleReason, additionalRemarks)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden z-10 animate-in zoom-in-95 duration-150" style={{ fontFamily: RB }}>
        {/* Header */}
        <div className="p-5 bg-[#009688] text-white flex items-start justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: PP }}>Reschedule Appointment</h3>
              <p className="text-xs text-teal-100 mt-0.5">Choose a new appointment date and available time slot.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto bg-[#F1F5F9]/30">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 text-[#EF4444] p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <span>Please fill in all mandatory required fields (*) before rescheduling.</span>
            </div>
          )}

          {/* Current Booking Details */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Booking Details</span>
              <StatusBadge status={apt.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div>
                <span className="text-[10px] text-slate-400 block">Appointment ID</span>
                <strong className="text-[#0D47A1] font-mono">{apt.id} ({apt.tokenNo})</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Patient Name</span>
                <strong className="text-[#111827]">{apt.patientName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Attending Doctor</span>
                <span className="text-slate-700 font-medium">{apt.doctorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Current Schedule</span>
                <span className="font-mono text-red-500 font-bold">{apt.appointmentDate} @ {apt.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Calendar Picker */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5" style={{ fontFamily: PP }}>
                <CalendarIcon size={14} className="text-[#009688]" /> Select New Appointment Date *
              </label>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={e => {
                  setSelectedDate(e.target.value)
                  if (errors.date) setErrors(prev => ({ ...prev, date: '' }))
                }}
                className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-[#111827] font-mono outline-none focus:border-[#009688]"
              />
            </div>

            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>
                <span>{monthName} {year}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={handlePrevMonth} className="p-1 rounded hover:bg-slate-200 text-slate-600">
                    <ChevronLeft size={14} />
                  </button>
                  <button type="button" onClick={handleNextMonth} className="p-1 rounded hover:bg-slate-200 text-slate-600">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const dayNum = i + 1
                  const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                  const isSelected = selectedDate === dayStr
                  const isCurrentAptDate = apt.appointmentDate === dayStr
                  const isPast = dayStr < todayStr
                  const isSunday = new Date(year, month, dayNum).getDay() === 0

                  const isDisabled = isPast || isSunday

                  return (
                    <button
                      key={dayStr}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedDate(dayStr)
                        if (errors.date) setErrors(prev => ({ ...prev, date: '' }))
                      }}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${isSelected
                        ? 'bg-[#009688] text-white font-bold shadow-xs'
                        : isCurrentAptDate
                          ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                          : isDisabled
                            ? 'text-slate-300 cursor-not-allowed line-through opacity-50'
                            : 'text-slate-700 bg-white hover:bg-teal-50 hover:text-[#009688] border border-slate-100'
                        }`}
                    >
                      {dayNum}
                    </button>
                  )
                })}
              </div>
            </div>
            {errors.date && <p className="text-[11px] text-[#EF4444] font-medium">{errors.date}</p>}
          </div>

          {/* Time Slot Picker */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5" style={{ fontFamily: PP }}>
                <Clock size={14} className="text-[#009688]" /> Available Time Slots *
              </label>
              <span className="text-[10px] font-mono text-teal-600 font-bold">Duration: {docAvail.slotDuration}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {docAvail.slots.map(s => {
                const isSelected = selectedTimeSlot === s.time
                const isAvailable = s.available

                return (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedTimeSlot(s.time)
                        if (errors.slot) setErrors(prev => ({ ...prev, slot: '' }))
                      }
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-mono font-semibold transition-all border text-center ${isSelected
                      ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-xs'
                      : isAvailable
                        ? 'bg-slate-50 text-slate-700 border-[#E5E7EB] hover:bg-blue-50 hover:text-[#0D47A1]'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 line-through'
                      }`}
                  >
                    {s.time}
                  </button>
                )
              })}
            </div>
            {errors.slot && <p className="text-[11px] text-[#EF4444] font-medium">{errors.slot}</p>}
          </div>

          {/* Reason & Remarks */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Reschedule Reason *
              </label>
              <select
                value={rescheduleReason}
                onChange={e => {
                  setRescheduleReason(e.target.value)
                  if (errors.reason) setErrors(prev => ({ ...prev, reason: '' }))
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-medium outline-none focus:border-[#009688]"
              >
                <option value="Patient Request">Patient Request</option>
                <option value="Doctor Unavailable">Doctor Unavailable</option>
                <option value="Scheduling Conflict">Scheduling Conflict</option>
                <option value="Hospital Operational Change">Hospital Operational Change</option>
                <option value="Administrative Adjustment">Administrative Adjustment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Additional Remarks <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Provide additional notes..."
                value={additionalRemarks}
                onChange={e => setAdditionalRemarks(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#009688] resize-none"
              />
            </div>
          </div>

          {/* Updated Schedule Preview */}
          <div className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-teal-200/60 pb-1.5">
              <span className="text-[10px] uppercase font-bold text-teal-800">Updated Schedule Preview</span>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">Scheduled</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5 text-[#111827]">
              <div>
                <span className="text-[10px] text-teal-700 block">Patient</span>
                <strong>{apt.patientName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-teal-700 block">Doctor</span>
                <strong>{apt.doctorName} ({apt.department})</strong>
              </div>
              <div>
                <span className="text-[10px] text-teal-700 block">New Date</span>
                <span className="font-mono text-[#009688] font-bold">{selectedDate || 'Select Date'}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-700 block">New Time Slot</span>
                <span className="font-mono text-[#0D47A1] font-bold">{selectedTimeSlot || 'Select Slot'}</span>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#0D47A1]">
            <Info size={15} className="text-[#0D47A1] shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              The previous appointment slot will be released after confirming the new appointment schedule.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796b] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── REUSABLE CANCEL APPOINTMENT CONFIRMATION DIALOG ─────────────────────────
export function CancelAppointmentConfirmationDialog({
  apt,
  isOpen,
  onClose,
  onConfirmCancel
}: {
  apt: AppointmentRecord | null
  isOpen: boolean
  onClose: () => void
  onConfirmCancel: (aptId: string, reason: string, remarks?: string) => void
}) {
  const [cancellationReason, setCancellationReason] = useState('Patient Request')
  const [additionalRemarks, setAdditionalRemarks] = useState('')
  const [error, setError] = useState('')
  const dropdownRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (isOpen) {
      setCancellationReason('Patient Request')
      setAdditionalRemarks('')
      setError('')
      setTimeout(() => dropdownRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !apt) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cancellationReason) {
      setError('Please select a cancellation reason.')
      return
    }
    onConfirmCancel(apt.id, cancellationReason, additionalRemarks)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden z-10 animate-in zoom-in-95 duration-150" style={{ fontFamily: RB }}>
        <div className="p-5 bg-white border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#EF4444] border border-red-100 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Cancel Appointment</h3>
              <p className="text-xs text-[#64748B] mt-0.5">This action will cancel the selected appointment.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#EF4444] p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#0D47A1] text-xs">{apt.id}</span>
              <StatusBadge status={apt.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 block">Patient Name</span>
                <strong className="text-[#111827]">{apt.patientName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Doctor</span>
                <span className="text-slate-700 font-medium">{apt.doctorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Department</span>
                <span className="text-slate-600">{apt.department}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Schedule</span>
                <span className="font-mono text-[#009688] font-bold">{apt.appointmentDate} @ {apt.timeSlot}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Cancellation Reason *
              </label>
              <select
                ref={dropdownRef}
                value={cancellationReason}
                onChange={e => {
                  setCancellationReason(e.target.value)
                  if (error) setError('')
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-medium outline-none focus:border-[#EF4444]"
              >
                <option value="Patient Request">Patient Request</option>
                <option value="Doctor Unavailable">Doctor Unavailable</option>
                <option value="Hospital Emergency">Hospital Emergency</option>
                <option value="Duplicate Appointment">Duplicate Appointment</option>
                <option value="Incorrect Booking">Incorrect Booking</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Additional Remarks <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Provide additional context or reason for cancellation..."
                value={additionalRemarks}
                onChange={e => setAdditionalRemarks(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#EF4444] resize-none"
              />
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
            <AlertTriangle size={15} className="text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Cancelling this appointment will remove it from today's appointment schedule. Historical appointment records will remain available for reporting purposes.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              Cancel Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── BOOK APPOINTMENT REUSABLE RIGHT DRAWER COMPONENT ───────────────────────
export function BookAppointmentDrawer({
  isOpen,
  onClose,
  onBookSuccess,
  onPatientSelect,
  isWalkInPreset = false
}: {
  isOpen: boolean
  onClose: () => void
  onBookSuccess: (newApt: AppointmentRecord) => void
  onPatientSelect?: (id: number | string) => void
  isWalkInPreset?: boolean
}) {
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(PATIENT_DATABASE[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [department, setDepartment] = useState('Cardiology')
  const [doctorName, setDoctorName] = useState('Dr. Arjun Mehta')
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0])
  const [timeSlot, setTimeSlot] = useState('09:30 AM')
  const [visitType, setVisitType] = useState<VisitType>(isWalkInPreset ? 'Walk-In' : 'First Visit')
  const [reasonForVisit, setReasonForVisit] = useState('')
  const [additionalNotes, _setAdditionalNotes] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  useEffect(() => {
    if (isWalkInPreset) {
      setVisitType('Walk-In')
      setAppointmentDate(new Date().toISOString().split('T')[0])
    }
  }, [isWalkInPreset, isOpen])

  const searchResults = useMemo(() => {
    if (!patientSearch) return PATIENT_DATABASE
    const q = patientSearch.toLowerCase()
    return PATIENT_DATABASE.filter(
      p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q)
    )
  }, [patientSearch])

  const docAvailability = DOCTOR_AVAILABILITY_DATA[doctorName] || DOCTOR_AVAILABILITY_DATA['Dr. Arjun Mehta']

  const handleSelectPatient = (p: PatientSummary) => {
    setSelectedPatient(p)
    setPatientSearch('')
    setIsDropdownOpen(false)
    if (errors.patient) {
      setErrors(prev => ({ ...prev, patient: '' }))
    }
  }

  const handleDoctorChange = (doc: string) => {
    setDoctorName(doc)
    const avail = DOCTOR_AVAILABILITY_DATA[doc]
    if (avail) {
      setDepartment(avail.department)
      const availableSlot = avail.slots.find(s => s.available)?.time || '09:00 AM'
      setTimeSlot(availableSlot)
    }
    if (errors.doctor) setErrors(prev => ({ ...prev, doctor: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!selectedPatient) errs.patient = 'Patient selection is required.'
    if (!department) errs.department = 'Department selection is required.'
    if (!doctorName) errs.doctor = 'Doctor selection is required.'
    if (!appointmentDate) errs.appointmentDate = 'Appointment date is required.'
    if (!timeSlot) errs.timeSlot = 'Time slot selection is required.'
    if (!reasonForVisit.trim()) errs.reasonForVisit = 'Reason for visit is required.'

    setErrors(errs)
    const hasError = Object.keys(errs).length > 0
    setShowErrorAlert(hasError)
    return !hasError
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const isWalkIn = visitType === 'Walk-In' || isWalkInPreset

    const newApt: AppointmentRecord = {
      id: `APT-${1000 + Math.floor(Math.random() * 8999)}`,
      tokenNo: `TK-${Math.floor(10 + Math.random() * 89)}`,
      patientId: selectedPatient!.id,
      patientName: selectedPatient!.name,
      patientAge: selectedPatient!.age,
      patientGender: selectedPatient!.gender,
      patientPhone: selectedPatient!.phone,
      mrn: selectedPatient!.mrn,
      doctorId: `DOC-100${doctorName.includes('Mehta') ? 1 : doctorName.includes('Sharma') ? 2 : doctorName.includes('Kapoor') ? 3 : 4}`,
      doctorName: doctorName,
      doctorSpecialty: docAvailability.specialty,
      department: department,
      appointmentDate: appointmentDate,
      timeSlot: timeSlot,
      visitType: visitType,
      priority: isWalkIn ? 'Urgent' : 'Normal',
      status: isWalkIn ? 'Checked-In' : 'Scheduled',
      arrivalStatus: isWalkIn ? 'Arrived' : 'Not Arrived',
      isWalkIn: isWalkIn,
      chiefComplaint: reasonForVisit,
      opdRoom: docAvailability.opdRoom,
      createdDate: new Date().toISOString().split('T')[0],
      notes: additionalNotes
    }

    onBookSuccess(newApt)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm shrink-0">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: PP }}>
                {isWalkInPreset ? <UserPlus size={18} /> : <Plus size={18} />}
                {isWalkInPreset ? 'Register Walk-In Patient' : 'Book Appointment'}
              </h2>
              <p className="text-xs text-blue-200 mt-0.5" style={{ fontFamily: RB }}>
                {isWalkInPreset ? 'Quick walk-in registration & immediate OPD queue assignment.' : 'Schedule a new appointment for an existing or newly registered patient.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>
            {showErrorAlert && (
              <div className="bg-red-50 border border-red-200 text-[#EF4444] p-3.5 rounded-2xl flex items-start gap-2.5 shadow-xs animate-in fade-in duration-150">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <div className="text-xs">
                  <strong className="font-bold block" style={{ fontFamily: PP }}>Validation Error</strong>
                  <span>Please fill in all mandatory required fields (*) before booking the appointment.</span>
                </div>
              </div>
            )}

            {/* Patient Search */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
                  <User size={15} className="text-[#0D47A1]" /> Section 01 — Patient Search & Info
                </h3>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Patient Search * <span className="text-[10px] text-slate-400 font-normal">(Name / MRN / Phone)</span>
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={e => {
                      setPatientSearch(e.target.value)
                      setIsDropdownOpen(true)
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Type Patient Name, MRN (MRN-2024-001) or Phone..."
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none transition-colors ${errors.patient ? 'border-[#EF4444] bg-red-50/20' : 'border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white'
                      }`}
                  />
                  {patientSearch && (
                    <button
                      type="button"
                      onClick={() => setPatientSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {errors.patient && <p className="text-[11px] text-[#EF4444] mt-1 font-medium">{errors.patient}</p>}

                {isDropdownOpen && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {searchResults.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className="p-2.5 hover:bg-blue-50/70 cursor-pointer flex items-center justify-between transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar name={p.name} size="sm" />
                          <div>
                            <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{p.name}</div>
                            <div className="text-[10px] text-slate-500">{p.id} · {p.mrn} · {p.phone}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#0D47A1] font-bold">Select</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-blue-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={selectedPatient.name} size="md" />
                      <div>
                        <span className="font-bold text-xs text-[#111827] block" style={{ fontFamily: PP }}>
                          {selectedPatient.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#0D47A1] font-bold">
                          {selectedPatient.id} · {selectedPatient.mrn}
                        </span>
                      </div>
                    </div>

                    {onPatientSelect && (
                      <button
                        type="button"
                        onClick={() => onPatientSelect(selectedPatient.id)}
                        className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] bg-white text-[11px] font-bold text-[#0D47A1] hover:bg-blue-50 transition-colors"
                      >
                        View Patient Profile
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Appointment Info */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
                  <Calendar size={15} className="text-[#0D47A1]" /> Section 02 — Schedule & Department
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Department *</label>
                  <select
                    value={department}
                    onChange={e => {
                      setDepartment(e.target.value)
                      if (errors.department) setErrors(prev => ({ ...prev, department: '' }))
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Doctor *</label>
                  <select
                    value={doctorName}
                    onChange={e => handleDoctorChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Dr. Arjun Mehta">Dr. Arjun Mehta (Cardiology)</option>
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma (General Med)</option>
                    <option value="Dr. Rajesh Kapoor">Dr. Rajesh Kapoor (Neurology)</option>
                    <option value="Dr. Sunita Patel">Dr. Sunita Patel (Gynecology)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Visit Type *</label>
                  <select
                    value={visitType}
                    onChange={e => setVisitType(e.target.value as VisitType)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="First Visit">First Visit</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Walk-In">Walk-In Registration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Reason for Visit *</label>
                <textarea
                  rows={2}
                  placeholder="Describe chief complaint or symptoms..."
                  value={reasonForVisit}
                  onChange={e => {
                    setReasonForVisit(e.target.value)
                    if (errors.reasonForVisit) setErrors(prev => ({ ...prev, reasonForVisit: '' }))
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none resize-none focus:border-[#0D47A1]"
                />
              </div>
            </div>

            {/* Time Slot */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
                  <Clock size={15} className="text-[#009688]" /> Section 03 — Time Slot & Room
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {docAvailability.slots.map(s => (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!s.available}
                    onClick={() => {
                      if (s.available) setTimeSlot(s.time)
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-semibold transition-all border text-center ${timeSlot === s.time
                      ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
                      : s.available
                        ? 'bg-slate-50 text-slate-700 border-[#E5E7EB] hover:bg-blue-50'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 line-through'
                      }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                {isWalkInPreset ? 'Register & Check-In Patient' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── EDIT APPOINTMENT REUSABLE RIGHT DRAWER COMPONENT ───────────────────────
export function EditAppointmentDrawer({
  apt,
  isOpen,
  onClose,
  onSaveSuccess,
  onRescheduleClick,
  onCancelClick,
  onPatientSelect: _onPatientSelect
}: {
  apt: AppointmentRecord | null
  isOpen: boolean
  onClose: () => void
  onSaveSuccess: (updatedApt: AppointmentRecord) => void
  onRescheduleClick: (apt: AppointmentRecord) => void
  onCancelClick: (apt: AppointmentRecord) => void
  onPatientSelect?: (id: number | string) => void
}) {
  const [department, setDepartment] = useState('Cardiology')
  const [doctorName, setDoctorName] = useState('Dr. Arjun Mehta')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [visitType, setVisitType] = useState<VisitType>('First Visit')
  const [status, setStatus] = useState<AppointmentStatus>('Scheduled')
  const [reasonForVisit, setReasonForVisit] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')

  const [_errors, setErrors] = useState<Record<string, string>>({})
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  useEffect(() => {
    if (apt) {
      setDepartment(apt.department)
      setDoctorName(apt.doctorName)
      setAppointmentDate(apt.appointmentDate)
      setTimeSlot(apt.timeSlot)
      setVisitType(apt.visitType)
      setStatus(apt.status)
      setReasonForVisit(apt.chiefComplaint)
      setAdditionalNotes(apt.notes || '')
      setErrors({})
      setShowErrorAlert(false)
    }
  }, [apt])

  if (!isOpen || !apt) return null

  const patientInfo = PATIENT_DATABASE.find(p => p.id === apt.patientId || p.name === apt.patientName) || {
    id: apt.patientId,
    mrn: apt.mrn,
    name: apt.patientName,
    age: apt.patientAge,
    gender: apt.patientGender,
    phone: apt.patientPhone,
    assignedDoctor: apt.doctorName
  }

  const docAvailability = DOCTOR_AVAILABILITY_DATA[doctorName] || DOCTOR_AVAILABILITY_DATA['Dr. Arjun Mehta']

  const handleDoctorChange = (doc: string) => {
    setDoctorName(doc)
    const avail = DOCTOR_AVAILABILITY_DATA[doc]
    if (avail) {
      setDepartment(avail.department)
      const availableSlot = avail.slots.find(s => s.available)?.time || '09:00 AM'
      setTimeSlot(availableSlot)
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!department) errs.department = 'Department selection is required.'
    if (!doctorName) errs.doctor = 'Doctor selection is required.'
    if (!appointmentDate) errs.appointmentDate = 'Appointment date is required.'
    if (!timeSlot) errs.timeSlot = 'Time slot selection is required.'
    if (!reasonForVisit.trim()) errs.reasonForVisit = 'Reason for visit is required.'

    setErrors(errs)
    const hasError = Object.keys(errs).length > 0
    setShowErrorAlert(hasError)
    return !hasError
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const updated: AppointmentRecord = {
      ...apt,
      department,
      doctorName,
      doctorSpecialty: docAvailability.specialty,
      opdRoom: docAvailability.opdRoom,
      appointmentDate,
      timeSlot,
      visitType,
      status,
      chiefComplaint: reasonForVisit,
      notes: additionalNotes
    }

    onSaveSuccess(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm shrink-0">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: PP }}>
                <Edit size={18} /> Edit Appointment — {apt.id}
              </h2>
              <p className="text-xs text-blue-200 mt-0.5" style={{ fontFamily: RB }}>
                Update appointment information and reception check-in state.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>
            {showErrorAlert && (
              <div className="bg-red-50 border border-red-200 text-[#EF4444] p-3.5 rounded-2xl flex items-start gap-2.5 shadow-xs animate-in fade-in duration-150">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <div className="text-xs">
                  <strong className="font-bold block" style={{ fontFamily: PP }}>Validation Error</strong>
                  <span>Please fill in all mandatory required fields (*) before saving changes.</span>
                </div>
              </div>
            )}

            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
                  <User size={15} className="text-[#0D47A1]" /> Patient Summary (Read Only)
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  <Lock size={10} /> Read Only
                </span>
              </div>

              <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={patientInfo.name} size="md" />
                    <div>
                      <span className="font-bold text-xs text-[#111827] block" style={{ fontFamily: PP }}>
                        {patientInfo.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#0D47A1] font-bold">
                        {patientInfo.id} · {patientInfo.mrn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Department *</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Gynecology">Gynecology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Doctor *</label>
                  <select
                    value={doctorName}
                    onChange={e => handleDoctorChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none"
                  >
                    <option value="Dr. Arjun Mehta">Dr. Arjun Mehta (Cardiology)</option>
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma (General Med)</option>
                    <option value="Dr. Rajesh Kapoor">Dr. Rajesh Kapoor (Neurology)</option>
                    <option value="Dr. Sunita Patel">Dr. Sunita Patel (Gynecology)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Time Slot *</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Status Dropdown *</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as AppointmentStatus)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1]"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Waiting">Waiting</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#111827] block" style={{ fontFamily: PP }}>Quick Actions</span>
                <span className="text-[10px] text-slate-500">Reschedule date/time or cancel appointment</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onRescheduleClick(apt)
                    onClose()
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-[#009688] text-[11px] font-bold hover:bg-teal-100 transition-colors flex items-center gap-1"
                >
                  <CalendarIcon size={12} /> Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCancelClick(apt)
                    onClose()
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50 text-[#EF4444] text-[11px] font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <Ban size={12} /> Cancel
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── APPOINTMENT DETAILS REUSABLE RIGHT DRAWER COMPONENT ─────────────────────
export function AppointmentDetailsDrawer({
  apt,
  isOpen,
  onClose,
  onEditClick,
  onPrintClick,
  onPatientSelect,
  isDetailsLoading: _isDetailsLoading = false,
  userRole = 'Receptionist',
  onStartConsultation
}: {
  apt: AppointmentRecord | null
  isOpen: boolean
  onClose: () => void
  onEditClick: (apt: AppointmentRecord) => void
  onPrintClick: (apt: AppointmentRecord) => void
  onPatientSelect?: (id: number | string) => void
  isDetailsLoading?: boolean
  userRole?: UserRole
  onStartConsultation?: (aptId?: any) => void
}) {
  const [activeTab, setActiveTab] = useState<'all' | 'patient' | 'appointment' | 'clinical' | 'alerts' | 'timeline'>('all')

  if (!isOpen || !apt) return null

  const isDoctor = userRole === 'Doctor'
  const isNurse = userRole === 'Nurse'

  const patientInfo = PATIENT_DATABASE.find(p => p.id === apt.patientId || p.name === apt.patientName) || {
    id: apt.patientId || 'P-10024',
    mrn: apt.mrn || 'MRN-2026-8891',
    name: apt.patientName,
    age: apt.patientAge || 42,
    gender: apt.patientGender || 'Female',
    bloodGroup: 'A+',
    phone: apt.patientPhone || '+1 (555) 234-5678',
    emergencyContact: '+1 (555) 987-6543 (Spouse)'
  }

  const doctorInfo = DOCTOR_DATABASE[apt.doctorName] || {
    id: apt.doctorId || 'DOC-402',
    name: apt.doctorName,
    department: apt.department,
    specialty: apt.doctorSpecialty || 'Senior Cardiology Specialist',
    qualification: 'MBBS, MD (Cardiology)',
    consultationFee: 150,
    opdRoom: apt.opdRoom || 'Room 104 - Wing A'
  }

  const timelineSteps = [
    { title: 'Appointment Booked', timestamp: `${apt.createdDate} 09:15 AM`, by: 'Receptionist Desk', status: 'completed' },
    { title: 'Patient Checked-In', timestamp: `${apt.appointmentDate} 08:42 AM`, by: 'Triage Nurse Desk', status: 'completed' },
    { title: 'Waiting in OPD Queue', timestamp: `${apt.appointmentDate} 08:50 AM`, by: 'OPD Queue System', status: 'active' },
    { title: 'Ready for Consultation', timestamp: `${apt.appointmentDate} 09:00 AM`, by: 'Dr. Arjun Mehta', status: 'upcoming' },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

          {/* STICKY HEADER */}
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm shrink-0">
            <div>
              <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider mb-0.5" style={{ fontFamily: PP }}>
                {isNurse ? 'Nurse / Appointment Management / Appointment Details' : isDoctor ? 'Doctor / Appointment Management / Appointment Details' : 'Reception / Appointment Details'}
              </div>
              <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: PP }}>
                <Eye size={18} /> Appointment Details
              </h2>
              <p className="text-xs text-blue-200 mt-0.5" style={{ fontFamily: RB }}>
                {isNurse ? 'View patient appointment information, clinical prep notes, alerts, and timeline.' : isDoctor ? 'Review appointment information before consultation.' : 'View complete appointment information and timeline activity.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isDoctor && !isNurse && (
                <button
                  type="button"
                  onClick={() => onEditClick(apt)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <Edit size={13} /> Edit
                </button>
              )}

              <button
                type="button"
                onClick={() => onPrintClick(apt)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors flex items-center gap-1"
              >
                <Printer size={13} /> Print Slip
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* TOP QUICK SUMMARY STRIP */}
          <div className="bg-slate-50 p-4 border-b border-[#E5E7EB] shrink-0 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#0D47A1]">{apt.id}</span>
                <span className="text-xs text-slate-400 font-mono">({apt.tokenNo})</span>
              </div>
              <StatusBadge status={apt.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-medium">Date</span>
                <strong className="text-[#111827]">{apt.appointmentDate}</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-medium">Time Slot</span>
                <strong className="text-[#0D47A1] font-mono">{apt.timeSlot}</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-medium">Visit Type</span>
                <span className="font-bold text-[#009688]">{apt.visitType}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-medium">Token No</span>
                <span className="font-mono font-bold text-[#0D47A1]">{apt.tokenNo}</span>
              </div>
            </div>
          </div>

          {/* NAVIGATION TABS */}
          <div className="bg-white border-b border-[#E5E7EB] px-6 flex items-center gap-4 sm:gap-6 shrink-0 text-xs font-semibold overflow-x-auto">
            {[
              { id: 'all', label: 'All Sections' },
              { id: 'patient', label: 'Patient Info' },
              { id: 'appointment', label: 'Appointment' },
              { id: 'clinical', label: 'Clinical Prep' },
              { id: 'alerts', label: 'Patient Alerts' },
              { id: 'timeline', label: 'Timeline' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? 'border-[#0D47A1] text-[#0D47A1]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                style={{ fontFamily: PP }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

            {/* SECTION 01: PATIENT INFORMATION */}
            {(activeTab === 'all' || activeTab === 'patient') && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
                    <User size={15} className="text-[#0D47A1]" /> Section 01 · Patient Information
                  </h3>
                  {onPatientSelect && (
                    <button
                      type="button"
                      onClick={() => onPatientSelect(patientInfo.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] border border-blue-100 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                      style={{ fontFamily: PP }}
                    >
                      <User size={13} /> View Patient Profile
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <Avatar name={patientInfo.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>{patientInfo.name}</h4>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      <span className="text-[#0D47A1] font-bold">{patientInfo.mrn}</span> · MRN: {patientInfo.id}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">Age & Gender</span>
                    <strong className="text-[#111827]">{patientInfo.age} yrs / {patientInfo.gender}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">Blood Group</span>
                    <strong className="text-[#0D47A1]">{patientInfo.bloodGroup}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">Mobile Number</span>
                    <strong className="text-[#111827]">{patientInfo.phone}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-2">
                    <span className="text-slate-400 text-[10px] block font-medium">Emergency Contact</span>
                    <strong className="text-[#111827]">{patientInfo.emergencyContact}</strong>
                  </div>
                  <div className="bg-red-50/70 p-2.5 rounded-xl border border-red-100 col-span-2 sm:col-span-1">
                    <span className="text-red-600 text-[10px] block font-bold">Known Allergies</span>
                    <strong className="text-red-900">Penicillin, NSAIDs, Peanuts</strong>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 02: APPOINTMENT INFORMATION */}
            {(activeTab === 'all' || activeTab === 'appointment') && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
                  <Calendar size={15} className="text-[#0D47A1]" /> Section 02 · Appointment Information
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Appointment ID</span>
                    <strong className="text-[#0D47A1] font-mono">{apt.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Appointment Date</span>
                    <strong className="text-[#111827]">{apt.appointmentDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Appointment Time</span>
                    <strong className="text-[#0D47A1] font-mono">{apt.timeSlot}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Token Number</span>
                    <strong className="text-[#0D47A1] font-mono">{apt.tokenNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Visit Type</span>
                    <span className="font-bold text-[#009688]">{apt.visitType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Status</span>
                    <StatusBadge status={apt.status} />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Booking Source</span>
                    <span className="text-slate-700 font-semibold">{(apt as any).bookingChannel || 'Reception Desk'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Created Date</span>
                    <span className="text-slate-600">{apt.createdDate}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 03: DOCTOR INFORMATION */}
            {(activeTab === 'all' || activeTab === 'appointment') && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
                  <Stethoscope size={15} className="text-[#0D47A1]" /> Section 03 · Doctor Information
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 text-[10px] block font-medium">Attending Doctor</span>
                    <strong className="text-[#111827] text-sm">{doctorInfo.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Department</span>
                    <strong className="text-[#0D47A1]">{doctorInfo.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Specialization</span>
                    <span className="text-slate-700 font-semibold">{doctorInfo.specialty}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Consultation Duration</span>
                    <span className="text-slate-700 font-semibold font-mono">15 Mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium">Room Number</span>
                    <strong className="text-[#009688]">{doctorInfo.opdRoom}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 04: CLINICAL PREPARATION */}
            {(activeTab === 'all' || activeTab === 'clinical') && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
                  <FileText size={15} className="text-[#009688]" /> Section 04 · Clinical Preparation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">Previous Visit Date</span>
                    <strong className="text-[#111827]">14 Jun 2026 (6 weeks ago)</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">Previous Diagnosis Summary</span>
                    <strong className="text-[#0D47A1]">Essential Hypertension, Mild Hyperlipidemia</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium mb-1">Current Chief Complaint</span>
                    <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-amber-950 font-medium">
                      {apt.chiefComplaint || 'Chest pain and shortness of breath upon mild exertion.'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium mb-1">Reason for Visit</span>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium">
                      Routine OPD Follow-up & Symptom Review
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium mb-1">Special Notes</span>
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-950 font-medium text-[11px]">
                      Patient reports intermittent mild headache in the mornings. Vitals recorded by Triage Nurse prior to consultation.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 05: PATIENT ALERTS */}
            {(activeTab === 'all' || activeTab === 'alerts') && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
                  <AlertTriangle size={15} className="text-[#EF4444]" /> Section 05 · Patient Alerts
                </h3>

                <div className="space-y-3">
                  {/* Alert 1: Drug Allergy */}
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={16} className="text-[#EF4444] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-red-900" style={{ fontFamily: PP }}>Drug Allergies</div>
                      <div className="text-xs text-red-700 mt-0.5 font-medium">Severe reaction to Penicillin (Anaphylaxis risk). Avoid beta-lactam antibiotics.</div>
                    </div>
                  </div>

                  {/* Alert 2: High Priority */}
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={16} className="text-[#F59E0B] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-900" style={{ fontFamily: PP }}>High Priority Alert</div>
                      <div className="text-xs text-amber-800 mt-0.5 font-medium">Hypertensive episode on last visit (BP 150/95). Monitor vitals closely.</div>
                    </div>
                  </div>

                  {/* Alert 3: Important Note */}
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                    <Info size={16} className="text-[#0D47A1] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-blue-950" style={{ fontFamily: PP }}>Important Medical Notes</div>
                      <div className="text-xs text-blue-800 mt-0.5 font-medium">Requires blood pressure tracking prior to prescribing NSAIDs or cardiac medication.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 06: APPOINTMENT TIMELINE */}
            {(activeTab === 'all' || activeTab === 'timeline') && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
                  <Clock size={15} className="text-[#0D47A1]" /> Section 06 · Appointment Timeline
                </h3>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${step.status === 'completed' ? 'border-[#66BB6A] text-[#66BB6A]' : step.status === 'active' ? 'border-[#0D47A1] text-[#0D47A1]' : 'border-slate-300'}`}>
                        {step.status === 'completed' && <Check size={10} />}
                        {step.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{step.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{step.timestamp} · {step.by}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* STICKY FOOTER ACTIONS */}
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
              style={{ fontFamily: RB }}
            >
              Close
            </button>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                type="button"
                onClick={() => onPrintClick(apt)}
                className="px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Printer size={14} /> Print Summary
              </button>

              {isNurse ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onPatientSelect?.(apt.patientId)
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <User size={14} /> View Patient Profile
                </button>
              ) : isDoctor ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onStartConsultation?.(apt.id)
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors shadow-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Stethoscope size={16} /> Start Consultation
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onEditClick(apt)
                    onClose()
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Edit size={14} /> Edit Appointment
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── DOCKABLE QUEUE WORKSPACE PANEL COMPONENT (RECEPTIONIST RBAC) ───────────
export function DockableQueueWorkspace({
  appointments,
  onUpdateStatus,
  onViewDetails,
  onBookClick: _onBookClick,
  onBackToDirectory,
  onPatientSelect,
  userRole = 'Receptionist',
  onStartConsultation
}: {
  appointments: AppointmentRecord[]
  onUpdateStatus: (aptId: string, status: AppointmentStatus, toastMsg: string) => void
  onViewDetails: (apt: AppointmentRecord) => void
  onBookClick: () => void
  onBackToDirectory: () => void
  onPatientSelect?: (id: number | string) => void
  userRole?: UserRole
  onStartConsultation?: (apt?: any) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [doctorFilter, _setDoctorFilter] = useState('All')
  const [deptFilter, _setDeptFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [visitTypeFilter, setVisitTypeFilter] = useState('All')
  const [timeFilter, setTimeFilter] = useState('All')
  const [_isLoading, setIsLoading] = useState(false)

  const isDoctor = userRole === 'Doctor'
  const isNurse = userRole === 'Nurse'

  const todayStr = new Date().toISOString().split('T')[0]
  const todayQueue = useMemo(() => {
    let list = appointments.filter(a => a.appointmentDate === todayStr)
    if (isDoctor) {
      list = list.filter(a => a.doctorName === 'Dr. Arjun Mehta')
    } else if (isNurse) {
      list = list.filter(a => a.department === 'Cardiology' || a.doctorName === 'Dr. Arjun Mehta' || a.doctorName === 'Dr. Priya Sharma')
    }
    return list
  }, [appointments, todayStr, isDoctor, isNurse])

  const waitingPatients = todayQueue.filter(a => a.status === 'Waiting' || a.status === 'Scheduled')
  const checkedInPatients = todayQueue.filter(a => a.status === 'Checked-In')
  const inConsultationPatients = todayQueue.filter(a => a.status === 'In Progress')
  const readyPatients = todayQueue.filter(a => a.status === 'In Progress' || a.status === 'Checked-In')
  const completedPatients = todayQueue.filter(a => a.status === 'Completed')

  const totalCount = todayQueue.length
  const completedCount = completedPatients.length

  // Current Patient (In Progress or first Waiting/Checked-In)
  const currentPatient = useMemo(() => {
    return readyPatients[0] || waitingPatients[0] || null
  }, [readyPatients, waitingPatients])

  // Next Patient Preview
  const nextPatient = useMemo(() => {
    if (readyPatients.length > 0) {
      return waitingPatients[0] || null
    }
    return waitingPatients[1] || null
  }, [readyPatients, waitingPatients])

  const filteredQueue = useMemo(() => {
    return todayQueue.filter(q => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const match =
          q.tokenNo.toLowerCase().includes(query) ||
          q.patientName.toLowerCase().includes(query) ||
          q.id.toLowerCase().includes(query) ||
          q.mrn.toLowerCase().includes(query)
        if (!match) return false
      }
      if (doctorFilter !== 'All' && q.doctorName !== doctorFilter) return false
      if (deptFilter !== 'All' && q.department !== deptFilter) return false
      if (statusFilter !== 'All' && q.status !== statusFilter) return false
      if (visitTypeFilter !== 'All' && q.visitType !== visitTypeFilter) return false
      if (timeFilter === 'Morning' && (q.timeSlot.includes('PM') || parseInt(q.timeSlot) >= 12)) return false
      if (timeFilter === 'Afternoon' && q.timeSlot.includes('AM')) return false
      return true
    })
  }, [todayQueue, searchQuery, doctorFilter, deptFilter, statusFilter, visitTypeFilter, timeFilter])

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setVisitTypeFilter('All')
    setTimeFilter('All')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200" style={{ fontFamily: RB }}>

      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDirectory}
            className="p-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-slate-600 transition-colors"
            title="Back to Directory"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5" style={{ fontFamily: PP }}>
              {isNurse ? 'Nurse / Appointment Management / Patient Queue' : isDoctor ? 'Doctor / Appointment Management / Queue Management' : 'Reception / Queue Workspace'}
            </div>
            <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2" style={{ fontFamily: PP }}>
              <Clock size={22} className="text-[#009688]" /> {isNurse ? 'Patient Queue' : isDoctor ? "Today's Consultation Queue" : "Today's OPD Consultation Queue"}
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              {isNurse ? "Monitor today's consultation queue." : isDoctor ? 'Monitor your patient queue and start consultations.' : 'Reception Desk Patient Flow & Token Arrival Manager'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), 500)
            }}
            className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={13} /> Refresh Queue
          </button>

          {isDoctor ? (
            <button
              onClick={() => onStartConsultation?.(currentPatient)}
              className="px-4 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors flex items-center gap-1.5 shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Stethoscope size={14} /> Start Consultation
            </button>
          ) : (
            <button
              onClick={onBackToDirectory}
              className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5 shadow-sm"
              style={{ fontFamily: PP }}
            >
              Close Queue Panel
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY KPI CARDS (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">{isNurse ? "Today's Queue" : "Today's Appointments"}</div>
            <div className="text-2xl font-bold text-[#0D47A1] mt-0.5" style={{ fontFamily: PP }}>{totalCount}</div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">Total in queue</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1] shrink-0">
            <Calendar size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Waiting Patients</div>
            <div className="text-2xl font-bold text-[#F59E0B] mt-0.5" style={{ fontFamily: PP }}>{waitingPatients.length}</div>
            <div className="text-[10px] text-amber-600 font-medium mt-1">In lounge</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B] shrink-0">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">{isNurse ? "Checked-In Patients" : "Currently In Consultation"}</div>
            <div className="text-2xl font-bold text-[#009688] mt-0.5" style={{ fontFamily: PP }}>{isNurse ? checkedInPatients.length : inConsultationPatients.length}</div>
            <div className="text-[10px] text-teal-600 font-medium mt-1">{isNurse ? "Arrived at clinic" : "Active doctor room"}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688] shrink-0">
            <UserCheck size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">{isNurse ? "Ready For Consultation" : "Completed Consultations"}</div>
            <div className="text-2xl font-bold text-[#4DB6AC] mt-0.5" style={{ fontFamily: PP }}>{isNurse ? readyPatients.length : completedCount}</div>
            <div className="text-[10px] text-teal-600 font-medium mt-1">{isNurse ? "Prepped & waiting" : "Checked out"}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50/60 flex items-center justify-center text-[#009688] shrink-0">
            <Stethoscope size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Completed Consultations</div>
            <div className="text-2xl font-bold text-[#66BB6A] mt-0.5" style={{ fontFamily: PP }}>{completedCount}</div>
            <div className="text-[10px] text-green-600 font-medium mt-1">Checked out</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#66BB6A] shrink-0">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* CURRENT PATIENT HIGHLIGHT & NEXT PATIENT PREVIEW STRIP */}
      {(isDoctor || isNurse) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* CURRENT PATIENT HIGHLIGHT CARD (8 Cols) */}
          <div className="lg:col-span-8 bg-gradient-to-r from-teal-900 via-[#009688] to-[#0D47A1] rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {currentPatient ? (
              <>
                <div className="flex items-center gap-4">
                  <Avatar name={currentPatient.patientName} size="lg" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold bg-white/20 px-2 py-0.5 rounded text-white">{currentPatient.tokenNo}</span>
                      <span className="text-xs font-semibold text-teal-100 bg-white/10 px-2 py-0.5 rounded">{currentPatient.status}</span>
                      <span className="text-xs text-teal-200 font-mono">{currentPatient.timeSlot}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1" style={{ fontFamily: PP }}>{currentPatient.patientName}</h3>
                    <div className="text-xs text-teal-100 mt-0.5">
                      {currentPatient.mrn} · {currentPatient.patientAge} yrs / {currentPatient.patientGender} · Waiting: <strong className="text-white font-mono">{currentPatient.waitingTimeMinutes || 12} mins</strong>
                    </div>
                    <div className="text-xs text-teal-100/90 mt-1.5 bg-black/10 px-3 py-1.5 rounded-xl border border-white/10">
                      <strong>Chief Complaint:</strong> {currentPatient.chiefComplaint || 'Chest pain and shortness of breath upon mild exertion.'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
                  {onPatientSelect && (
                    <button
                      onClick={() => onPatientSelect(currentPatient.patientId)}
                      className="px-4 py-2.5 rounded-xl bg-white text-[#009688] text-xs font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      style={{ fontFamily: PP }}
                    >
                      <User size={15} /> View Patient Profile
                    </button>
                  )}
                  {isDoctor && (
                    <button
                      onClick={() => onStartConsultation?.(currentPatient)}
                      className="px-4 py-2.5 rounded-xl bg-white text-[#009688] text-xs font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      style={{ fontFamily: PP }}
                    >
                      <Stethoscope size={15} /> Start Consultation
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="py-2 text-xs text-teal-100">No patient is currently active or waiting in queue.</div>
            )}
          </div>

          {/* NEXT PATIENT PREVIEW CARD (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: PP }}>
                <Clock size={14} className="text-[#0D47A1]" /> Next Patient Preview
              </span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Up Next</span>
            </div>

            {nextPatient ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{nextPatient.tokenNo}</span>
                  <span className="font-mono text-slate-500">{nextPatient.timeSlot}</span>
                </div>
                <div className="font-bold text-[#111827] text-sm" style={{ fontFamily: PP }}>{nextPatient.patientName}</div>
                <div className="text-[11px] text-slate-400">Est. Wait Time: <strong className="text-[#009688]">15 mins</strong></div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">No subsequent patients in queue today.</div>
            )}
          </div>

        </div>
      )}

      {/* WORKSPACE CONTENT: LEFT TABLE & RIGHT CONTEXT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* MAIN QUEUE COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">

          {/* SEARCH & FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by Patient Name, MRN, or Token Number…"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-2.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] text-slate-700 font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="In Progress">In Consultation</option>
                  <option value="Completed">Completed</option>
                </select>

                <select
                  value={visitTypeFilter}
                  onChange={e => setVisitTypeFilter(e.target.value)}
                  className="px-2.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] text-slate-700 font-medium"
                >
                  <option value="All">All Visit Types</option>
                  <option value="First Visit">First Visit</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Walk-In">Walk-In</option>
                </select>

                <select
                  value={timeFilter}
                  onChange={e => setTimeFilter(e.target.value)}
                  className="px-2.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] text-slate-700 font-medium"
                >
                  <option value="All">All Slots</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                </select>

                <button
                  onClick={handleResetFilters}
                  className="p-2 rounded-xl border border-[#E5E7EB] bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* MAIN QUEUE TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2" style={{ fontFamily: PP }}>
                <Clock size={16} className="text-[#0D47A1]" /> Patient Queue List
              </h3>
              <span className="text-xs text-[#64748B]">
                Showing <strong className="text-[#111827]">{filteredQueue.length}</strong> queue entries
              </span>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
                  <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                    <th className="px-4 py-3.5">Token Number</th>
                    <th className="px-4 py-3.5">Patient</th>
                    <th className="px-4 py-3.5">MRN</th>
                    <th className="px-4 py-3.5">Appointment Time</th>
                    <th className="px-4 py-3.5">Visit Type</th>
                    <th className="px-4 py-3.5">Queue Status</th>
                    <th className="px-4 py-3.5">Waiting Time</th>
                    <th className="px-4 py-3.5">Priority</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {filteredQueue.map(q => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {q.tokenNo}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-[#111827]">
                        <div className="flex items-center gap-2">
                          <Avatar name={q.patientName} size="sm" />
                          <div>
                            <div>{q.patientName}</div>
                            <div className="text-[10px] text-slate-400 font-mono font-normal">{q.patientAge}y / {q.patientGender}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-600 font-semibold">
                        {q.mrn}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[#0D47A1] font-bold">
                        {q.timeSlot}
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#009688] border border-teal-100">
                          {q.visitType}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={q.status} />
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-[#F59E0B]">
                        {q.waitingTimeMinutes ? `${q.waitingTimeMinutes} mins` : '10 mins'}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${q.priority === 'High' || q.priority === 'Urgent' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                          {q.priority || 'Normal'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewDetails(q)}
                            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-blue-50 text-[#0D47A1] transition-colors"
                            title="View Appointment Details"
                          >
                            <Eye size={14} />
                          </button>

                          {onPatientSelect && (
                            <button
                              onClick={() => onPatientSelect(q.patientId)}
                              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-teal-50 text-[#009688] transition-colors"
                              title="View Patient Profile"
                            >
                              <User size={14} />
                            </button>
                          )}

                          {isNurse ? null : isDoctor ? (
                            <button
                              onClick={() => onStartConsultation?.(q)}
                              className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-bold hover:bg-[#00796B] transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Stethoscope size={12} /> Start Consultation
                            </button>
                          ) : (
                            <>
                              {q.status === 'Scheduled' && (
                                <button
                                  onClick={() => onUpdateStatus(q.id, 'Checked-In', 'Patient checked in successfully.')}
                                  className="px-2.5 py-1 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  <CheckCircle2 size={12} /> Check-In Patient
                                </button>
                              )}

                              {(q.status === 'Checked-In' || q.status === 'Waiting') && (
                                <button
                                  onClick={() => onUpdateStatus(q.id, 'Checked-In', 'Patient called for consultation.')}
                                  className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#009688] text-[11px] font-bold border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-1"
                                >
                                  <PhoneCall size={12} /> Call Next Patient
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredQueue.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Users size={32} className="text-slate-300" />
                          <div className="text-sm font-medium text-slate-600" style={{ fontFamily: PP }}>No patients are currently waiting.</div>
                          <button
                            onClick={onBackToDirectory}
                            className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                            style={{ fontFamily: PP }}
                          >
                            View My Appointments
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT CONTEXT PANEL (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">

          {/* CARD 1: TODAY'S QUEUE SUMMARY (Doctor & Receptionist only) */}
          {!isNurse && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                <Clock size={15} className="text-[#0D47A1]" /> Today's Queue Summary
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Total Patients</span>
                  <strong className="text-sm font-bold text-[#111827]">{totalCount}</strong>
                </div>
                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-amber-700 block font-medium">Waiting</span>
                  <strong className="text-sm font-bold text-[#F59E0B]">{waitingPatients.length}</strong>
                </div>
                <div className="bg-teal-50/70 p-2.5 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-teal-700 block font-medium">In Consultation</span>
                  <strong className="text-sm font-bold text-[#009688]">{inConsultationPatients.length}</strong>
                </div>
                <div className="bg-green-50/70 p-2.5 rounded-xl border border-green-100">
                  <span className="text-[10px] text-green-700 block font-medium">Completed</span>
                  <strong className="text-sm font-bold text-[#66BB6A]">{completedCount}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Average Waiting Time</span>
                <strong className="font-mono text-[#0D47A1] font-bold">14 min</strong>
              </div>
            </div>
          )}

          {/* CARD 2: CURRENT PATIENT */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
              <User size={15} className="text-[#009688]" /> Current Active Patient
            </h3>

            {currentPatient ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <Avatar name={currentPatient.patientName} size="md" />
                  <div>
                    <strong className="text-sm text-[#111827] block" style={{ fontFamily: PP }}>{currentPatient.patientName}</strong>
                    <span className="font-mono text-[10px] text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      Token {currentPatient.tokenNo}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mb-0.5" style={{ fontFamily: PP }}>Chief Complaint</div>
                  <div className="text-xs text-amber-950 font-medium">{currentPatient.chiefComplaint || 'Chest pain and shortness of breath.'}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Waiting Duration</span>
                  <strong className="font-mono text-[#111827]">{currentPatient.waitingTimeMinutes || 12} mins</strong>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">No active patient currently being seen.</div>
            )}
          </div>

          {/* CARD 3: NEXT PATIENT (Doctor & Receptionist only) */}
          {!isNurse && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                <Users size={15} className="text-[#0D47A1]" /> Next Patient in Line
              </h3>

              {nextPatient ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#111827]" style={{ fontFamily: PP }}>{nextPatient.patientName}</strong>
                    <span className="font-mono font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{nextPatient.tokenNo}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Time: <strong className="font-mono text-slate-700">{nextPatient.timeSlot}</strong></span>
                    <span>Est. Wait: <strong className="text-[#009688]">15 mins</strong></span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">No upcoming patient in queue.</div>
              )}
            </div>
          )}

          {/* CARD 4: QUICK ACTIONS (Doctor & Receptionist only) */}
          {!isNurse && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                <Zap size={15} className="text-[#0D47A1]" /> Quick Actions
              </h3>

              <div className="space-y-2">
                {isDoctor && (
                  <button
                    onClick={() => onStartConsultation?.(currentPatient)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#009688] text-[#FFFFFF] text-xs font-bold hover:bg-[#00796B] transition-colors flex items-center justify-center gap-2 shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    <Stethoscope size={15} /> Start Consultation
                  </button>
                )}

                <button
                  onClick={onBackToDirectory}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#E5E7EB] bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={14} className="text-[#0D47A1]" /> View My Appointments
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

// ─── MAIN RECEPTIONIST APPOINTMENT MANAGEMENT CENTER SCREEN ─────────────────
// ─── MAIN RECEPTIONIST / DOCTOR / ADMIN APPOINTMENT MANAGEMENT CENTER SCREEN ─────────────────
interface Props {
  onPatientSelect?: (id: number | string) => void
  onStartConsultation?: (apt?: any) => void
  onBookAppointmentClick?: () => void
  onReceptionQueueClick?: () => void
  userRole?: UserRole
}

export function AppointmentManagementCenterScreen({ onPatientSelect, onStartConsultation, onBookAppointmentClick, onReceptionQueueClick, userRole = 'Receptionist' }: Props) {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(INITIAL_APPOINTMENTS)
  const [_isLoading, _setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'directory' | 'queue'>('directory')

  // Search & Filter state - Default Date = TODAY
  const todayDateStr = new Date().toISOString().split('T')[0]
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [doctorFilter, setDoctorFilter] = useState<string>('All')
  const [deptFilter, setDeptFilter] = useState<string>('All')
  const [dateFilter, setDateFilter] = useState<string>('Today')
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>('All')

  // Sorting - Default Appointment Time Ascending
  const [sortColumn, setSortColumn] = useState<keyof AppointmentRecord>('timeSlot')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [_queueSortAsc, _setQueueSortAsc] = useState(true)

  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Drawer States
  const [showBookDrawer, setShowBookDrawer] = useState(false)
  const [isWalkInPreset, setIsWalkInPreset] = useState(false)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [detailsApt, setDetailsApt] = useState<AppointmentRecord | null>(null)
  const [editingApt, setEditingApt] = useState<AppointmentRecord | null>(null)

  // Dialog States
  const [rescheduleApt, setRescheduleApt] = useState<AppointmentRecord | null>(null)
  const [cancelApt, setCancelApt] = useState<AppointmentRecord | null>(null)

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // --- ROLE-BASED APPOINTMENT FILTERING ---
  const roleAppointments = useMemo(() => {
    if (userRole === 'Doctor') {
      return appointments.filter(a => a.doctorName === 'Dr. Arjun Mehta')
    }
    if (userRole === 'Nurse') {
      return appointments.filter(a => a.department === 'Cardiology' || a.doctorName === 'Dr. Arjun Mehta' || a.doctorName === 'Dr. Priya Sharma')
    }
    return appointments
  }, [appointments, userRole])

  // --- SUMMARY KPI COUNTS ---
  const todayAppointments = roleAppointments.filter(a => a.appointmentDate === todayDateStr)
  const totalTodayCount = todayAppointments.length
  const checkedInCount = todayAppointments.filter(a => a.status === 'Checked-In').length
  const waitingCount = todayAppointments.filter(a => a.status === 'Waiting' || a.status === 'Checked-In').length
  const inConsultationCount = todayAppointments.filter(a => a.status === 'In Progress').length
  const completedCheckInsCount = todayAppointments.filter(a => a.status === 'Completed').length
  const walkInCount = todayAppointments.filter(a => a.visitType === 'Walk-In' || a.isWalkIn).length
  const followUpCount = roleAppointments.filter(a => a.visitType === 'Follow-up').length

  // Doctor List
  const doctorsList = useMemo(() => Array.from(new Set(appointments.map(a => a.doctorName))), [appointments])

  // --- Filtered & Sorted Appointments ---
  const filteredAppointments = useMemo(() => {
    return roleAppointments.filter(apt => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const match =
          apt.id.toLowerCase().includes(q) ||
          apt.patientName.toLowerCase().includes(q) ||
          apt.doctorName.toLowerCase().includes(q) ||
          apt.patientPhone.toLowerCase().includes(q) ||
          apt.mrn.toLowerCase().includes(q)
        if (!match) return false
      }
      if (statusFilter !== 'All' && apt.status !== statusFilter) return false
      if (doctorFilter !== 'All' && apt.doctorName !== doctorFilter) return false
      if (deptFilter !== 'All' && apt.department !== deptFilter) return false
      if (dateFilter === 'Today' && apt.appointmentDate !== todayDateStr) return false
      if (visitTypeFilter !== 'All' && apt.visitType !== visitTypeFilter) return false
      return true
    }).sort((a, b) => {
      let valA = a[sortColumn]
      let valB = b[sortColumn]
      if (typeof valA === 'string') valA = (valA as string).toLowerCase()
      if (typeof valB === 'string') valB = (valB as string).toLowerCase()
      if (valA! < valB!) return sortDirection === 'asc' ? -1 : 1
      if (valA! > valB!) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [roleAppointments, searchQuery, statusFilter, doctorFilter, deptFilter, dateFilter, visitTypeFilter, sortColumn, sortDirection, todayDateStr])

  const handleSort = (col: keyof AppointmentRecord) => {
    if (sortColumn === col) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(col)
      setSortDirection('asc')
    }
  }

  const handleBookSuccess = (newApt: AppointmentRecord) => {
    setAppointments([newApt, ...appointments])
    if (newApt.isWalkIn) {
      triggerToast(`Walk-in patient registered & checked in successfully.`)
    } else {
      triggerToast(`Appointment booked successfully.`)
    }
  }

  const handleOpenEditDrawer = (apt: AppointmentRecord) => {
    setEditingApt(apt)
    setShowEditDrawer(true)
  }

  const handleSaveEditAppointment = (updated: AppointmentRecord) => {
    setAppointments(prev => prev.map(a => (a.id === updated.id ? updated : a)))
    triggerToast(`Appointment updated successfully.`)
  }

  const handleConfirmRescheduleWithDetails = (aptId: string, newDate: string, newTimeSlot: string, reason: string, _remarks?: string) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === aptId
          ? {
            ...a,
            appointmentDate: newDate,
            timeSlot: newTimeSlot,
            status: 'Scheduled',
            arrivalStatus: 'Not Arrived',
            rescheduleReason: reason,
            rescheduledCount: (a.rescheduledCount || 0) + 1
          }
          : a
      )
    )
    triggerToast(`Appointment rescheduled successfully.`)
    setRescheduleApt(null)
  }

  const handleConfirmCancelWithDetails = (aptId: string, reason: string, _remarks?: string) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === aptId
          ? {
            ...a,
            status: 'Cancelled',
            arrivalStatus: 'Not Arrived',
            cancellationReason: reason
          }
          : a
      )
    )
    triggerToast(`Appointment cancelled successfully.`)
    setCancelApt(null)
  }

  const handleCheckInPatient = (aptId: string) => {
    setAppointments(prev =>
      prev.map(a => (a.id === aptId ? { ...a, status: 'Checked-In', arrivalStatus: 'Arrived', waitingTimeMinutes: 5 } : a))
    )
    triggerToast(`Patient checked in successfully.`)
  }

  const handleCallNextPatient = (aptId: string) => {
    setAppointments(prev =>
      prev.map(a => (a.id === aptId ? { ...a, status: 'Checked-In', arrivalStatus: 'Called' } : a))
    )
    triggerToast(`Patient called for consultation.`)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* RENDER QUEUE WORKSPACE IF IN QUEUE VIEW MODE */}
      {viewMode === 'queue' ? (
        <DockableQueueWorkspace
          appointments={appointments}
          onUpdateStatus={(id, st, msg) => {
            if (st === 'Checked-In') handleCheckInPatient(id)
            else triggerToast(msg)
          }}
          onViewDetails={(apt) => setDetailsApt(apt)}
          onBookClick={() => {
            setIsWalkInPreset(false)
            setShowBookDrawer(true)
          }}
          onBackToDirectory={() => setViewMode('directory')}
          onPatientSelect={onPatientSelect}
          userRole={userRole}
          onStartConsultation={(apt) => onStartConsultation?.(apt)}
        />
      ) : (
        <>
          {/* ── 1. PAGE HEADER & BREADCRUMB ── */}
          {userRole === 'Nurse' ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Assigned Appointments</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#009688] border border-teal-200">
                    Nurse Workspace (Read Only)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
                  <span>Nurse</span>
                  <ChevronRight size={13} className="text-slate-300" />
                  <span>Appointment Management</span>
                  <ChevronRight size={13} className="text-slate-300" />
                  <span className="font-medium text-[#111827]">Assigned Appointments</span>
                </div>
                <p className="text-xs text-[#64748B] mt-1">Monitor today's patient appointments.</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setViewMode('queue')}
                  className="px-3.5 py-2.5 rounded-xl border border-[#0D47A1] bg-blue-50 text-xs font-bold text-[#0D47A1] hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-xs"
                  style={{ fontFamily: PP }}
                >
                  <Clock size={15} /> Today's Queue
                </button>
              </div>
            </div>
          ) : userRole === 'Doctor' ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>My Appointments</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#009688] border border-teal-200">
                    Doctor Workspace
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
                  <span>Doctor</span>
                  <ChevronRight size={13} className="text-slate-300" />
                  <span className="font-medium text-[#111827]">Appointment Management</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setViewMode('queue')}
                  className="px-3.5 py-2.5 rounded-xl border border-[#0D47A1] bg-blue-50 text-xs font-bold text-[#0D47A1] hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-xs"
                  style={{ fontFamily: PP }}
                >
                  <Clock size={15} /> Today's Queue
                </button>

                <button
                  onClick={() => {
                    const nextApt = roleAppointments.find(a => a.status === 'Checked-In' || a.status === 'Waiting' || a.status === 'In Progress')
                    if (nextApt && onStartConsultation) onStartConsultation(nextApt)
                    else if (nextApt && onPatientSelect) onPatientSelect(nextApt.patientId)
                    else triggerToast('No active patient ready for consultation.')
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors flex items-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Stethoscope size={15} /> Start Consultation
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    {userRole === 'Hospital Admin' || userRole === 'Super Admin' ? 'Hospital Appointment Control Center' : 'Appointment Management'}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${userRole === 'Hospital Admin' || userRole === 'Super Admin' ? 'bg-blue-50 text-[#0D47A1] border-blue-200' : 'bg-teal-50 text-[#009688] border-teal-200'}`}>
                    {userRole === 'Hospital Admin' ? 'Hospital Admin' : userRole === 'Super Admin' ? 'Super Admin' : 'Reception Desk'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
                  <span>{userRole === 'Hospital Admin' ? 'Hospital Administration' : 'Front Desk Reception'}</span>
                  <ChevronRight size={13} className="text-slate-300" />
                  <span className="font-medium text-[#111827]">
                    {userRole === 'Hospital Admin' ? 'Enterprise Appointments & Operations' : "Today's Appointment Desk"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {userRole === 'Receptionist' && (
                  <>
                    <button
                      onClick={() => {
                        setIsWalkInPreset(true)
                        setShowBookDrawer(true)
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-teal-200 bg-teal-50 text-xs font-bold text-[#009688] hover:bg-teal-100 transition-colors flex items-center gap-1.5 shadow-xs"
                      style={{ fontFamily: PP }}
                    >
                      <UserPlus size={15} /> Register Walk-In
                    </button>

                    <button
                      onClick={() => {
                        if (onReceptionQueueClick) onReceptionQueueClick()
                        else setViewMode('queue')
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-[#009688] bg-teal-50 text-xs font-bold text-[#009688] hover:bg-teal-100 transition-colors flex items-center gap-1.5 shadow-xs"
                      style={{ fontFamily: PP }}
                    >
                      <Users size={15} /> Patient Queue
                    </button>
                  </>
                )}

                <button
                  onClick={() => setViewMode('queue')}
                  className="px-3.5 py-2.5 rounded-xl border border-[#0D47A1] bg-blue-50 text-xs font-bold text-[#0D47A1] hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-xs"
                  style={{ fontFamily: PP }}
                >
                  <Clock size={15} /> Today's Queue
                </button>

                <button
                  onClick={() => {
                    if (onBookAppointmentClick) {
                      onBookAppointmentClick()
                    } else {
                      setIsWalkInPreset(false)
                      setShowBookDrawer(true)
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Plus size={15} /> Book Appointment
                </button>
              </div>
            </div>
          )}

          {/* ── 2. SUMMARY KPI CARDS (5 CARDS) ── */}
          {userRole === 'Nurse' ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Today's Assigned Appointments</div>
                  <div className="text-2xl font-bold text-[#0D47A1] mt-0.5" style={{ fontFamily: PP }}>{totalTodayCount}</div>
                  <div className="text-[10px] text-[#0D47A1] font-medium mt-1">Assigned schedule</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                  <Calendar size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Patients Waiting</div>
                  <div className="text-2xl font-bold text-[#F59E0B] mt-0.5" style={{ fontFamily: PP }}>{waitingCount}</div>
                  <div className="text-[10px] text-amber-600 font-medium mt-1">In lounge</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
                  <Clock size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Checked-In Patients</div>
                  <div className="text-2xl font-bold text-[#0D47A1] mt-0.5" style={{ fontFamily: PP }}>{checkedInCount}</div>
                  <div className="text-[10px] text-blue-600 font-medium mt-1">Arrived at desk</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                  <UserCheck size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Ready For Consultation</div>
                  <div className="text-2xl font-bold text-[#009688] mt-0.5" style={{ fontFamily: PP }}>{checkedInCount}</div>
                  <div className="text-[10px] text-teal-600 font-medium mt-1">Vitals prepped</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
                  <Stethoscope size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Completed Consultations</div>
                  <div className="text-2xl font-bold text-[#66BB6A] mt-0.5" style={{ fontFamily: PP }}>{completedCheckInsCount}</div>
                  <div className="text-[10px] text-green-600 font-medium mt-1">Finished visits</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#66BB6A]">
                  <CheckCircle2 size={18} />
                </div>
              </div>
            </div>
          ) : userRole === 'Doctor' ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Today's Appointments</div>
                  <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{totalTodayCount}</div>
                  <div className="text-[10px] text-[#0D47A1] font-medium mt-1">My schedule today</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                  <Calendar size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Patients Waiting</div>
                  <div className="text-2xl font-bold text-[#F59E0B] mt-0.5" style={{ fontFamily: PP }}>{waitingCount}</div>
                  <div className="text-[10px] text-amber-600 font-medium mt-1">Arrived in lounge</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
                  <Clock size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">In Consultation</div>
                  <div className="text-2xl font-bold text-[#009688] mt-0.5" style={{ fontFamily: PP }}>{inConsultationCount}</div>
                  <div className="text-[10px] text-teal-600 font-medium mt-1">Active in room</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
                  <Stethoscope size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Completed Today</div>
                  <div className="text-2xl font-bold text-[#66BB6A] mt-0.5" style={{ fontFamily: PP }}>{completedCheckInsCount}</div>
                  <div className="text-[10px] text-green-600 font-medium mt-1">Finished visits</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#66BB6A]">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Follow-up Visits</div>
                  <div className="text-2xl font-bold text-[#0D47A1] mt-0.5" style={{ fontFamily: PP }}>{followUpCount}</div>
                  <div className="text-[10px] text-blue-600 font-medium mt-1">Review patients</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                  <UserCheck size={18} />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Today's Appointments</div>
                  <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{totalTodayCount}</div>
                  <div className="text-[10px] text-[#0D47A1] font-medium mt-1">Scheduled today</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                  <Calendar size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Checked-In Patients</div>
                  <div className="text-2xl font-bold text-[#0D47A1] mt-0.5" style={{ fontFamily: PP }}>{checkedInCount}</div>
                  <div className="text-[10px] text-blue-600 font-medium mt-1">Arrived at desk</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                  <UserCheck size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Waiting Patients</div>
                  <div className="text-2xl font-bold text-[#F59E0B] mt-0.5" style={{ fontFamily: PP }}>{waitingCount}</div>
                  <div className="text-[10px] text-amber-600 font-medium mt-1">In OPD lounge</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
                  <Clock size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Completed Check-Ins</div>
                  <div className="text-2xl font-bold text-[#66BB6A] mt-0.5" style={{ fontFamily: PP }}>{completedCheckInsCount}</div>
                  <div className="text-[10px] text-green-600 font-medium mt-1">Consulted & done</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#66BB6A]">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Walk-In Registrations</div>
                  <div className="text-2xl font-bold text-[#009688] mt-0.5" style={{ fontFamily: PP }}>{walkInCount}</div>
                  <div className="text-[10px] text-teal-600 font-medium mt-1">Direct OPD arrivals</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
                  <UserPlus size={18} />
                </div>
              </div>
            </div>
          )}

          {/* ── 3. SEARCH & FILTERS TOOLBAR + STATUS TABS ── */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by Patient Name, MRN, Appointment ID..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                  <CalendarIcon size={13} className="text-slate-400" />
                  <span className="text-slate-500 font-medium">Date:</span>
                  <select
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                  >
                    <option value="Today">Today Only</option>
                    <option value="All">All Dates</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                  <Filter size={13} className="text-slate-400" />
                  <span className="text-slate-500 font-medium">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Checked-In">Checked-In</option>
                    <option value="Waiting">Waiting</option>
                    <option value="In Progress">In Consultation</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {userRole !== 'Doctor' && (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                    <Stethoscope size={13} className="text-slate-400" />
                    <span className="text-slate-500 font-medium">Doctor:</span>
                    <select
                      value={doctorFilter}
                      onChange={e => setDoctorFilter(e.target.value)}
                      className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                    >
                      <option value="All">All Doctors</option>
                      {doctorsList.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                  <Building2 size={13} className="text-slate-400" />
                  <span className="text-slate-500 font-medium">Visit Type:</span>
                  <select
                    value={visitTypeFilter}
                    onChange={e => setVisitTypeFilter(e.target.value)}
                    className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                  >
                    <option value="All">All Visit Types</option>
                    <option value="First Visit">First Visit</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Walk-In">Walk-In</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('All')
                    setDoctorFilter('All')
                    setDeptFilter('All')
                    setDateFilter('Today')
                    setVisitTypeFilter('All')
                    triggerToast('Filters reset.')
                  }}
                  className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-500 hover:text-[#0D47A1] hover:bg-slate-50 transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

            </div>

            {/* STATUS TABS STRIP */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-gray-100">
              {[
                { id: 'All', label: 'All', count: roleAppointments.length },
                { id: 'Waiting', label: 'Waiting', count: roleAppointments.filter(a => a.status === 'Waiting').length },
                { id: 'Checked-In', label: 'Checked-In', count: roleAppointments.filter(a => a.status === 'Checked-In').length },
                { id: 'In Progress', label: 'In Consultation', count: roleAppointments.filter(a => a.status === 'In Progress').length },
                { id: 'Completed', label: 'Completed', count: roleAppointments.filter(a => a.status === 'Completed').length },
                { id: 'Cancelled', label: 'Cancelled', count: roleAppointments.filter(a => a.status === 'Cancelled').length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${statusFilter === tab.id
                      ? 'bg-[#0D47A1] text-white shadow-xs'
                      : 'bg-slate-50 text-[#64748B] hover:bg-slate-100 hover:text-[#111827]'
                    }`}
                  style={{ fontFamily: PP }}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-[#111827]'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── 4. MAIN WORKSPACE GRID: ENTERPRISE DATA TABLE + RIGHT CONTEXT PANEL ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Main Table Column */}
            <div className={`${userRole === 'Receptionist' ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-6`}>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Calendar size={16} className="text-[#0D47A1]" /> {userRole === 'Doctor' ? "Today's Doctor Consultation Appointments" : "Today's Reception Appointment Workload"}
                  </h3>
                  <span className="text-xs text-[#64748B]">
                    Showing <strong className="text-[#111827]">{filteredAppointments.length}</strong> appointments
                  </span>
                </div>

                {filteredAppointments.length > 0 ? (
                  <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
                        <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                          <th onClick={() => handleSort('id')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                            <div className="flex items-center gap-1">
                              <span>Appointment ID</span>
                              <ArrowUpDown size={12} className="text-slate-400" />
                            </div>
                          </th>
                          <th onClick={() => handleSort('patientName')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                            <div className="flex items-center gap-1">
                              <span>Patient</span>
                              <ArrowUpDown size={12} className="text-slate-400" />
                            </div>
                          </th>
                          <th className="px-4 py-3.5">MRN</th>
                          {userRole !== 'Doctor' && <th className="px-4 py-3.5">Doctor</th>}
                          {userRole !== 'Doctor' && <th className="px-4 py-3.5">Department</th>}
                          <th onClick={() => handleSort('timeSlot')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                            <div className="flex items-center gap-1">
                              <span>Appointment Time</span>
                              <ArrowUpDown size={12} className="text-slate-400" />
                            </div>
                          </th>
                          <th className="px-4 py-3.5">Visit Type</th>
                          <th className="px-4 py-3.5">Status</th>
                          <th className="px-4 py-3.5">Token Number</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 text-[#111827]">
                        {filteredAppointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                              {apt.id}
                            </td>

                            <td className="px-4 py-3.5">
                              <div
                                onClick={() => onPatientSelect?.(apt.patientId)}
                                className="flex items-center gap-2 cursor-pointer hover:underline"
                              >
                                <Avatar name={apt.patientName} size="sm" />
                                <div>
                                  <span className="font-bold text-[#111827] block" style={{ fontFamily: PP }}>{apt.patientName}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{apt.patientPhone}</span>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3.5 font-mono text-[#0D47A1] font-bold">
                              {apt.mrn}
                            </td>

                            {userRole !== 'Doctor' && (
                              <td className="px-4 py-3.5">
                                <div className="font-semibold text-[#111827]">{apt.doctorName}</div>
                                <div className="text-[10px] text-slate-400">{apt.opdRoom}</div>
                              </td>
                            )}

                            {userRole !== 'Doctor' && (
                              <td className="px-4 py-3.5 font-medium text-slate-700">
                                {apt.department}
                              </td>
                            )}

                            <td className="px-4 py-3.5 font-mono text-[#0D47A1] font-bold">
                              {apt.timeSlot}
                            </td>

                            <td className="px-4 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${apt.visitType === 'Walk-In' ? 'bg-teal-50 text-[#009688] border-teal-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }`}>
                                {apt.visitType}
                              </span>
                            </td>

                            <td className="px-4 py-3.5">
                              <StatusBadge status={apt.status} />
                            </td>

                            <td className="px-4 py-3.5 font-mono">
                              <span className="bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold border border-blue-100">
                                {apt.tokenNo}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setDetailsApt(apt)}
                                  className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-blue-50 text-[#0D47A1] transition-colors"
                                  title="View Appointment Details"
                                >
                                  <Eye size={14} />
                                </button>

                                {userRole === 'Nurse' ? (
                                  <>
                                    {onPatientSelect && (
                                      <button
                                        onClick={() => onPatientSelect(apt.patientId)}
                                        className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-teal-50 text-[#009688] transition-colors"
                                        title="View Patient Profile"
                                      >
                                        <User size={14} />
                                      </button>
                                    )}
                                  </>
                                ) : userRole === 'Doctor' ? (
                                  <button
                                    onClick={() => {
                                      if (onStartConsultation) onStartConsultation(apt)
                                      else if (onPatientSelect) onPatientSelect(apt.patientId)
                                      else triggerToast(`Starting consultation for ${apt.patientName}`)
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[10px] font-bold hover:bg-[#00796B] transition-colors flex items-center gap-1 shadow-xs"
                                    title="Start Consultation"
                                    style={{ fontFamily: PP }}
                                  >
                                    <Stethoscope size={13} /> Start Consultation
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleOpenEditDrawer(apt)}
                                      className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-amber-50 text-[#F59E0B] transition-colors"
                                      title="Edit Appointment"
                                    >
                                      <Edit size={14} />
                                    </button>

                                    {apt.status === 'Scheduled' && (
                                      <button
                                        onClick={() => handleCheckInPatient(apt.id)}
                                        className="px-2 py-1 rounded-lg bg-[#0D47A1] text-white text-[10px] font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1 shadow-xs"
                                        title="Check-In Patient"
                                      >
                                        <CheckCircle2 size={12} /> Check-In
                                      </button>
                                    )}

                                    {(apt.status === 'Checked-In' || apt.status === 'Waiting') && (
                                      <button
                                        onClick={() => handleCallNextPatient(apt.id)}
                                        className="px-2 py-1 rounded-lg bg-teal-50 text-[#009688] text-[10px] font-bold border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-1"
                                        title="Call Next Patient"
                                      >
                                        <PhoneCall size={12} /> Call
                                      </button>
                                    )}

                                    <button
                                      onClick={() => setRescheduleApt(apt)}
                                      className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-teal-50 text-[#009688] transition-colors"
                                      title="Reschedule Appointment"
                                    >
                                      <CalendarIcon size={14} />
                                    </button>

                                    {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                                      <button
                                        onClick={() => setCancelApt(apt)}
                                        className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-red-50 text-[#EF4444] transition-colors"
                                        title="Cancel Appointment"
                                      >
                                        <Ban size={14} />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                      <Calendar size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>No appointments scheduled today.</h3>
                      <p className="text-xs text-[#64748B]">All consultation visits for today are completed or no appointments match filters.</p>
                    </div>
                    {userRole !== 'Doctor' && (
                      <button
                        onClick={() => {
                          setIsWalkInPreset(false)
                          setShowBookDrawer(true)
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors inline-flex items-center gap-2 mt-2"
                        style={{ fontFamily: PP }}
                      >
                        <Plus size={14} /> Book Appointment
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column (1/4): RIGHT CONTEXT PANEL */}
            {userRole === 'Nurse' ? (
              <div className="space-y-6">

                {/* CARD 1: TODAY'S SCHEDULE */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Clock size={15} className="text-[#0D47A1]" /> Today's Schedule
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Assigned</span>
                      <strong className="text-sm font-bold text-[#0D47A1]">{totalTodayCount}</strong>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                      <span className="text-[10px] text-amber-700 block font-medium">Waiting</span>
                      <strong className="text-sm font-bold text-[#F59E0B]">{waitingCount}</strong>
                    </div>
                    <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                      <span className="text-[10px] text-[#0D47A1] block font-medium">Checked-In</span>
                      <strong className="text-sm font-bold text-[#0D47A1]">{checkedInCount}</strong>
                    </div>
                    <div className="bg-green-50/70 p-2.5 rounded-xl border border-green-100">
                      <span className="text-[10px] text-green-700 block font-medium">Completed</span>
                      <strong className="text-sm font-bold text-[#66BB6A]">{completedCheckInsCount}</strong>
                    </div>
                  </div>
                </div>

                {/* CARD 2: CURRENT WAITING PATIENTS */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Users size={15} className="text-[#F59E0B]" /> Current Waiting Patients
                  </h3>

                  <div className="space-y-2 text-xs">
                    {todayAppointments.filter(a => a.status === 'Waiting' || a.status === 'Checked-In').slice(0, 3).map(wp => (
                      <div key={wp.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar name={wp.patientName} size="sm" />
                          <div>
                            <strong className="text-[#111827] block" style={{ fontFamily: PP }}>{wp.patientName}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">{wp.mrn} · {wp.tokenNo}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#009688] bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{wp.timeSlot}</span>
                      </div>
                    ))}
                    {todayAppointments.filter(a => a.status === 'Waiting' || a.status === 'Checked-In').length === 0 && (
                      <div className="py-4 text-center text-xs text-slate-400">No patients waiting in lounge.</div>
                    )}
                  </div>
                </div>

                {/* CARD 3: NEXT PATIENT */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <User size={15} className="text-[#009688]" /> Next Patient
                  </h3>

                  {(() => {
                    const next = todayAppointments.find(a => a.status === 'Checked-In' || a.status === 'Waiting' || a.status === 'Scheduled')
                    if (!next) return <div className="py-4 text-center text-xs text-slate-400">No upcoming patient scheduled today.</div>
                    return (
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center gap-3">
                          <Avatar name={next.patientName} size="md" />
                          <div>
                            <strong className="text-sm text-[#111827] block" style={{ fontFamily: PP }}>{next.patientName}</strong>
                            <span className="font-mono text-[10px] text-[#0D47A1] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Token {next.tokenNo}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 pt-1">
                          <span>Doctor: <strong className="text-slate-800">{next.doctorName}</strong></span>
                          <span className="font-mono font-bold text-[#0D47A1]">{next.timeSlot}</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* CARD 4: QUICK ACTIONS */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Zap size={15} className="text-[#0D47A1]" /> Quick Actions
                  </h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => setViewMode('queue')}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-xs"
                      style={{ fontFamily: PP }}
                    >
                      <Clock size={15} /> View Queue
                    </button>

                    <button
                      onClick={() => {
                        const firstP = roleAppointments[0]
                        if (firstP && onPatientSelect) onPatientSelect(firstP.patientId)
                        else triggerToast('Select a patient from table to view profile.')
                      }}
                      className="w-full py-2 px-3 rounded-xl border border-[#E5E7EB] bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                      style={{ fontFamily: PP }}
                    >
                      <User size={14} className="text-[#009688]" /> View Patient Profile
                    </button>
                  </div>
                </div>

              </div>
            ) : userRole === 'Doctor' ? (
              <div className="space-y-6">

                {/* CARD 1: TODAY'S SCHEDULE */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Clock size={15} className="text-[#0D47A1]" /> Today's Schedule
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Total Scheduled</span>
                      <strong className="text-sm font-bold text-[#0D47A1]">{totalTodayCount}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Completed</span>
                      <strong className="text-sm font-bold text-[#66BB6A]">{completedCheckInsCount}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Waiting</span>
                      <strong className="text-sm font-bold text-[#F59E0B]">{waitingCount}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">In Progress</span>
                      <strong className="text-sm font-bold text-[#009688]">{inConsultationCount}</strong>
                    </div>
                  </div>

                  {(() => {
                    const next = todayAppointments.find(a => a.status === 'Checked-In' || a.status === 'Waiting' || a.status === 'Scheduled')
                    if (!next) return null
                    return (
                      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 mt-2 text-xs">
                        <div className="text-[10px] text-[#0D47A1] font-bold uppercase tracking-wider">Next Appointment</div>
                        <div className="flex items-center justify-between mt-1">
                          <div>
                            <strong className="text-[#111827] block" style={{ fontFamily: PP }}>{next.patientName}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">{next.tokenNo} · {next.timeSlot}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#0D47A1] border border-blue-200">
                            {next.status}
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* CARD 2: UPCOMING PATIENT */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <User size={15} className="text-[#009688]" /> Upcoming Patient
                  </h3>

                  {(() => {
                    const up = todayAppointments.find(a => a.status === 'Checked-In' || a.status === 'Waiting' || a.status === 'Scheduled')
                    if (!up) {
                      return <div className="py-6 text-center text-xs text-slate-400">No upcoming patients in queue today.</div>
                    }
                    return (
                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center gap-3 p-2.5 bg-teal-50/50 rounded-xl border border-teal-100">
                          <Avatar name={up.patientName} size="md" />
                          <div>
                            <strong className="text-sm text-[#111827] block" style={{ fontFamily: PP }}>{up.patientName}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">{up.mrn}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-slate-400 block text-[10px]">Time Slot</span>
                            <strong className="text-[#0D47A1] font-mono">{up.timeSlot}</strong>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-slate-400 block text-[10px]">Token No</span>
                            <strong className="text-[#009688] font-mono">{up.tokenNo}</strong>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2 flex items-center justify-between">
                            <span className="text-slate-400 text-[10px]">Visit Type:</span>
                            <span className="font-semibold text-slate-700">{up.visitType}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* CARD 3: QUICK ACTIONS */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Zap size={15} className="text-[#0D47A1]" /> Quick Actions
                  </h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const next = todayAppointments.find(a => a.status === 'Checked-In' || a.status === 'Waiting' || a.status === 'In Progress')
                        if (next && onStartConsultation) onStartConsultation(next)
                        else if (next && onPatientSelect) onPatientSelect(next.patientId)
                        else triggerToast('No active patient in queue')
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors flex items-center justify-center gap-2 shadow-xs"
                      style={{ fontFamily: PP }}
                    >
                      <Stethoscope size={15} /> Start Consultation
                    </button>

                    <button
                      onClick={() => setViewMode('queue')}
                      className="w-full py-2 px-3 rounded-xl border border-[#0D47A1] bg-blue-50 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock size={14} /> View Today's Queue
                    </button>
                  </div>
                </div>

              </div>
            ) : userRole !== 'Receptionist' ? (
              <div className="space-y-6">

                {/* CARD 1: TODAY'S QUEUE SUMMARY */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Clock size={15} className="text-[#0D47A1]" /> Today's Queue Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Waiting</span>
                      <strong className="text-sm font-bold text-[#F59E0B]">{waitingCount}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Checked-In</span>
                      <strong className="text-sm font-bold text-[#0D47A1]">{checkedInCount}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">In Consultation</span>
                      <strong className="text-sm font-bold text-[#009688]">
                        {todayAppointments.filter(a => a.status === 'In Progress').length}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Completed</span>
                      <strong className="text-sm font-bold text-[#66BB6A]">{completedCheckInsCount}</strong>
                    </div>
                  </div>
                </div>

                {/* CARD 2: UPCOMING APPOINTMENTS */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Calendar size={15} className="text-[#009688]" /> Upcoming Appointments Today
                  </h3>

                  <div className="space-y-2 text-xs">
                    {todayAppointments.filter(a => a.status === 'Scheduled').slice(0, 3).map(up => (
                      <div key={up.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <strong className="text-[#111827] block" style={{ fontFamily: PP }}>{up.patientName}</strong>
                          <span className="text-[10px] text-slate-400">{up.doctorName}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#0D47A1]">{up.timeSlot}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD 3: QUICK ACTIONS */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Zap size={15} className="text-[#0D47A1]" /> Reception Quick Actions
                  </h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsWalkInPreset(false)
                        setShowBookDrawer(true)
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2"
                      style={{ fontFamily: PP }}
                    >
                      <Plus size={14} /> Book Appointment
                    </button>

                    <button
                      onClick={() => {
                        setIsWalkInPreset(true)
                        setShowBookDrawer(true)
                      }}
                      className="w-full py-2 px-3 rounded-xl border border-teal-200 bg-teal-50 text-[#009688] text-xs font-bold hover:bg-teal-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus size={14} /> Register Walk-In Patient
                    </button>

                    <button
                      onClick={() => setViewMode('queue')}
                      className="w-full py-2 px-3 rounded-xl border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock size={14} className="text-[#009688]" /> View Queue Workspace
                    </button>
                  </div>
                </div>

              </div>
            ) : null}

          </div>
        </>
      )}

      {/* REUSABLE DRAWERS & DIALOGS */}
      <BookAppointmentDrawer
        isOpen={showBookDrawer}
        onClose={() => {
          setShowBookDrawer(false)
          setIsWalkInPreset(false)
        }}
        onBookSuccess={handleBookSuccess}
        onPatientSelect={onPatientSelect}
        isWalkInPreset={isWalkInPreset}
      />

      <AppointmentDetailsDrawer
        apt={detailsApt}
        isOpen={!!detailsApt}
        onClose={() => setDetailsApt(null)}
        onEditClick={(aptToEdit) => {
          setDetailsApt(null)
          handleOpenEditDrawer(aptToEdit)
        }}
        onPrintClick={(aptToPrint) => {
          triggerToast(`Printing appointment slip for ${aptToPrint.id}...`)
        }}
        onPatientSelect={onPatientSelect}
        userRole={userRole}
        onStartConsultation={() => {
          setDetailsApt(null)
          onStartConsultation?.(detailsApt || undefined)
        }}
      />

      <EditAppointmentDrawer
        apt={editingApt}
        isOpen={showEditDrawer}
        onClose={() => {
          setShowEditDrawer(false)
          setEditingApt(null)
        }}
        onSaveSuccess={handleSaveEditAppointment}
        onRescheduleClick={(aptToReschedule) => setRescheduleApt(aptToReschedule)}
        onCancelClick={(aptToCancel) => setCancelApt(aptToCancel)}
        onPatientSelect={onPatientSelect}
      />

      <RescheduleAppointmentConfirmationDialog
        apt={rescheduleApt}
        isOpen={!!rescheduleApt}
        onClose={() => setRescheduleApt(null)}
        onConfirmReschedule={handleConfirmRescheduleWithDetails}
      />

      <CancelAppointmentConfirmationDialog
        apt={cancelApt}
        isOpen={!!cancelApt}
        onClose={() => setCancelApt(null)}
        onConfirmCancel={handleConfirmCancelWithDetails}
      />

    </div>
  )
}

export { AppointmentManagementCenterScreen as AppointmentCenterScreen }

// ─── RECEPTIONIST APPOINTMENT BOOKING SCREEN ───
export interface ReceptionBookAppointmentProps {
  onBack?: () => void
  onConfirmSuccess?: (appointmentId: string) => void
  onRegisterNewPatientClick?: () => void
  onViewPatientProfileClick?: (mrn: string) => void
  initialMrn?: string
}

export function ReceptionBookAppointmentScreen({
  onBack,
  onConfirmSuccess,
  onRegisterNewPatientClick,
  onViewPatientProfileClick,
  initialMrn,
}: ReceptionBookAppointmentProps) {
  // Section 01: Patient Search state
  const [patientQuery, setPatientQuery] = useState(initialMrn || '')
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(() => {
    if (initialMrn) {
      return PATIENT_DATABASE.find(p => p.mrn.toLowerCase() === initialMrn.toLowerCase() || p.id.toLowerCase() === initialMrn.toLowerCase()) || PATIENT_DATABASE[0]
    }
    return PATIENT_DATABASE[0] // default pre-selected patient for smooth demo
  })

  // Patient search dropdown options
  const searchedPatients = useMemo(() => {
    if (!patientQuery.trim()) return PATIENT_DATABASE
    const q = patientQuery.toLowerCase()
    return PATIENT_DATABASE.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.id.toLowerCase().includes(q)
    )
  }, [patientQuery])

  // Section 02: Department & Doctor Selection
  const [selectedDept, setSelectedDept] = useState('Cardiology')
  const [selectedSpecialty, setSelectedSpecialty] = useState('Interventional Cardiology')
  const [selectedDocKey, setSelectedDocKey] = useState('Dr. Arjun Mehta')

  const doctorsList = [
    { key: 'Dr. Arjun Mehta', name: 'Dr. Arjun Mehta', dept: 'Cardiology', spec: 'Interventional Cardiology', exp: '14 Yrs Exp', fee: 800, availability: 'Available Today (09:00 AM - 04:00 PM)' },
    { key: 'Dr. Priya Sharma', name: 'Dr. Priya Sharma', dept: 'General OPD', spec: 'Internal Medicine', exp: '10 Yrs Exp', fee: 500, availability: 'Available Today (08:30 AM - 02:00 PM)' },
    { key: 'Dr. Sunita Patel', name: 'Dr. Sunita Patel', dept: 'Gynecology', spec: 'Obstetrics & Gynae', exp: '12 Yrs Exp', fee: 700, availability: 'Available Today (10:00 AM - 05:00 PM)' },
    { key: 'Dr. Rajesh Kapoor', name: 'Dr. Rajesh Kapoor', dept: 'Neurology', spec: 'Clinical Neurology', exp: '18 Yrs Exp', fee: 1000, availability: 'Available Today (11:00 AM - 03:00 PM)' },
  ]

  const filteredDoctors = doctorsList.filter(d => selectedDept === 'All Departments' || d.dept === selectedDept)
  const currentDoctor = doctorsList.find(d => d.key === selectedDocKey) || doctorsList[0]

  // Section 03: Appointment Date Selection (Calendar)
  const [selectedDate, setSelectedDate] = useState('2026-07-24')
  const availableDates = [
    { date: '2026-07-24', day: 'Fri', label: 'Today', isAvailable: true },
    { date: '2026-07-25', day: 'Sat', label: 'Tomorrow', isAvailable: true },
    { date: '2026-07-27', day: 'Mon', label: '27 Jul', isAvailable: true },
    { date: '2026-07-28', day: 'Tue', label: '28 Jul', isAvailable: true },
    { date: '2026-07-29', day: 'Wed', label: '29 Jul', isAvailable: false },
    { date: '2026-07-30', day: 'Thu', label: '30 Jul', isAvailable: true },
  ]

  // Section 04: Time Slots Grid
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:30 AM')
  const timeSlotGroups = {
    morning: [
      { time: '09:00 AM', available: true },
      { time: '09:30 AM', available: true },
      { time: '10:00 AM', available: false },
      { time: '10:30 AM', available: true },
      { time: '11:00 AM', available: true },
    ],
    afternoon: [
      { time: '12:00 PM', available: true },
      { time: '12:30 PM', available: false },
      { time: '01:00 PM', available: true },
      { time: '02:00 PM', available: true },
    ],
    evening: [
      { time: '04:00 PM', available: true },
      { time: '04:30 PM', available: true },
      { time: '05:00 PM', available: false },
    ]
  }

  // Section 05: Visit Details
  const [visitType, setVisitType] = useState<'New Consultation' | 'Follow-up'>('New Consultation')
  const [chiefComplaint, setChiefComplaint] = useState('Chest tightness and occasional breathlessness during walking.')
  const [remarks, setRemarks] = useState('')

  // Modal & Confirmation State
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmedAptId, setConfirmedAptId] = useState('')
  const [notificationSent, setNotificationSent] = useState<{ sms: boolean; email: boolean }>({ sms: true, email: true })

  // Confirm Appointment Handler
  const handleConfirm = () => {
    if (!selectedPatient) return
    const newAptId = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`
    setConfirmedAptId(newAptId)
    setShowSuccessModal(true)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      
      {/* ── HEADER & BREADCRUMBS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Reception Management</button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">Appointment Booking</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Book Appointment</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Search a patient, select a doctor and confirm an appointment.</p>
        </div>

        {/* Header Action Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRegisterNewPatientClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0D47A1] text-xs font-semibold hover:bg-blue-100 transition-all"
            style={{ fontFamily: PP }}
          >
            <UserPlus size={14} /> Register New Patient
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN: APPOINTMENT BOOKING FORM (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">

          {/* SECTION 01: PATIENT SEARCH */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>01</div>
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Search & Selection</h2>
              </div>
              <span className="text-xs text-red-500 font-semibold">* Required</span>
            </div>

            {/* Patient Search Input */}
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={patientQuery}
                onChange={e => setPatientQuery(e.target.value)}
                placeholder="Search patient by MRN, Patient Name, Mobile Number or Appointment ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Instant Search Results Dropdown List */}
            {patientQuery.trim() !== '' && (
              <div className="max-h-48 overflow-y-auto border border-[#E5E7EB] rounded-xl divide-y divide-gray-100 bg-white shadow-lg">
                {searchedPatients.length > 0 ? (
                  searchedPatients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPatient(p)
                        setPatientQuery('')
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-[10px]">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#111827]">{p.name}</p>
                          <p className="text-[11px] text-[#64748B]">{p.gender} · {p.age} yrs · {p.phone}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#0D47A1]">{p.mrn}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching patient records found. 
                    <button 
                      onClick={onRegisterNewPatientClick} 
                      className="ml-2 text-[#0D47A1] font-bold underline"
                    >
                      Register New Patient
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Selected Patient Card Display */}
            {selectedPatient ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#111827]">{selectedPatient.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0D47A1] text-[10px] font-mono font-bold">
                        {selectedPatient.mrn}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {selectedPatient.age} yrs · {selectedPatient.gender} · Blood Group: <span className="font-semibold text-[#009688]">{selectedPatient.bloodGroup}</span> · Mobile: <span className="font-mono">{selectedPatient.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => onViewPatientProfileClick && onViewPatientProfileClick(selectedPatient.mrn)}
                    className="flex-1 md:flex-none px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors"
                  >
                    View Patient Profile
                  </button>
                  <button
                    type="button"
                    onClick={onRegisterNewPatientClick}
                    className="flex-1 md:flex-none px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Register New Patient
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400">
                Search for a patient to begin booking an appointment.
              </div>
            )}
          </div>

          {/* SECTION 02: DEPARTMENT & DOCTOR SELECTION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>02</div>
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Department & Doctor Selection</h2>
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#111827] mb-1">Select Department *</label>
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#009688]"
                >
                  <option>Cardiology</option>
                  <option>General OPD</option>
                  <option>Gynecology</option>
                  <option>Neurology</option>
                  <option>Dermatology</option>
                  <option>Orthopedics</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">Specialty *</label>
                <select
                  value={selectedSpecialty}
                  onChange={e => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#009688]"
                >
                  <option>Interventional Cardiology</option>
                  <option>Internal Medicine</option>
                  <option>Obstetrics & Gynae</option>
                  <option>Clinical Neurology</option>
                </select>
              </div>
            </div>

            {/* Doctor Cards Selection */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-[#111827]">Available Doctors *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDoctors.map(doc => {
                  const isSelected = selectedDocKey === doc.key
                  return (
                    <div
                      key={doc.key}
                      onClick={() => setSelectedDocKey(doc.key)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected 
                          ? 'border-[#009688] bg-teal-50/50 shadow-sm ring-1 ring-[#009688]' 
                          : 'border-[#E5E7EB] bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[#111827] truncate">{doc.name}</h4>
                          <span className="font-bold text-[#0D47A1]">₹{doc.fee}</span>
                        </div>
                        <p className="text-[11px] text-[#64748B]">{doc.dept} · {doc.spec}</p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
                          {doc.availability}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* SECTION 03 & 04: CALENDAR DATE & TIME SLOTS */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>03</div>
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Appointment Date & Time Slot</h2>
              </div>
            </div>

            {/* Date Selector Row */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-2">Select Date *</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableDates.map(item => {
                  const isSelected = selectedDate === item.date
                  return (
                    <button
                      key={item.date}
                      type="button"
                      disabled={!item.isAvailable}
                      onClick={() => setSelectedDate(item.date)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        !item.isAvailable 
                          ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed' 
                          : isSelected
                            ? 'bg-[#0D47A1] border-[#0D47A1] text-white shadow-sm font-bold'
                            : 'bg-white border-[#E5E7EB] text-[#111827] hover:border-blue-300'
                      }`}
                    >
                      <span className="block text-[10px] uppercase opacity-80">{item.day}</span>
                      <span className="block text-xs font-bold mt-0.5">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slot Grid */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-[#111827]">Select Time Slot *</label>

              {/* Morning Slots */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Morning Session</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {timeSlotGroups.morning.map(slot => {
                    const isSelected = selectedTimeSlot === slot.time
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#009688] text-white border-[#009688] font-bold shadow-sm'
                              : 'bg-slate-50 text-[#111827] border-[#E5E7EB] hover:bg-teal-50 hover:border-teal-300'
                        }`}
                      >
                        {slot.time}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Afternoon Session</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {timeSlotGroups.afternoon.map(slot => {
                    const isSelected = selectedTimeSlot === slot.time
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#009688] text-white border-[#009688] font-bold shadow-sm'
                              : 'bg-slate-50 text-[#111827] border-[#E5E7EB] hover:bg-teal-50 hover:border-teal-300'
                        }`}
                      >
                        {slot.time}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Evening Slots */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Evening Session</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {timeSlotGroups.evening.map(slot => {
                    const isSelected = selectedTimeSlot === slot.time
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#009688] text-white border-[#009688] font-bold shadow-sm'
                              : 'bg-slate-50 text-[#111827] border-[#E5E7EB] hover:bg-teal-50 hover:border-teal-300'
                        }`}
                      >
                        {slot.time}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 05: VISIT DETAILS */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>04</div>
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Visit Details</h2>
              </div>
            </div>

            {/* Visit Type Radio Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-2">Visit Type *</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                  <input
                    type="radio"
                    name="visitType"
                    checked={visitType === 'New Consultation'}
                    onChange={() => setVisitType('New Consultation')}
                    className="accent-[#0D47A1]"
                  />
                  <span>New Consultation</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                  <input
                    type="radio"
                    name="visitType"
                    checked={visitType === 'Follow-up'}
                    onChange={() => setVisitType('Follow-up')}
                    className="accent-[#0D47A1]"
                  />
                  <span>Follow-up Visit</span>
                </label>
              </div>
            </div>

            {/* Chief Complaint */}
            <div className="text-xs">
              <label className="block font-semibold text-[#111827] mb-1">Chief Complaint / Symptoms *</label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="Describe patient's primary symptoms or reason for visit..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              />
            </div>

            {/* Remarks */}
            <div className="text-xs">
              <label className="block font-semibold text-[#111827] mb-1">Receptionist Remarks (Optional)</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Add optional notes for OPD staff..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL & SUMMARY (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">

          {/* CARD 01: Patient Summary Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Patient Summary
            </h3>
            {selectedPatient ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Patient Name</span>
                  <span className="font-bold text-[#111827]">{selectedPatient.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{selectedPatient.mrn}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Age / Gender</span>
                  <span className="text-[#111827]">{selectedPatient.age} yrs · {selectedPatient.gender}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Mobile Number</span>
                  <span className="font-mono text-[#111827]">{selectedPatient.phone}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">No patient selected.</p>
            )}
          </div>

          {/* CARD 02: Doctor Summary Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Doctor Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Consulting Doctor</span>
                <span className="font-bold text-[#111827]">{currentDoctor.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Department</span>
                <span className="text-[#111827]">{currentDoctor.dept}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Specialization</span>
                <span className="text-[#111827]">{currentDoctor.spec}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Consultation Fee</span>
                <span className="font-bold text-[#0D47A1]">₹{currentDoctor.fee}</span>
              </div>
            </div>
          </div>

          {/* CARD 03: Appointment Booking Summary */}
          <div className="bg-white rounded-2xl border border-[#0D47A1] p-5 shadow-sm space-y-3 bg-gradient-to-b from-blue-50/40 to-white">
            <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider border-b border-blue-100 pb-2 flex items-center justify-between" style={{ fontFamily: PP }}>
              <span>Appointment Summary</span>
              <CalendarIcon size={14} />
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Appointment Date</span>
                <span className="font-mono font-bold text-[#111827]">{selectedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Time Slot</span>
                <span className="font-mono font-bold text-[#009688]">{selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Visit Type</span>
                <span className="font-semibold text-[#111827]">{visitType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Fee Payable</span>
                <span className="font-bold text-base text-[#0D47A1]">₹{currentDoctor.fee}</span>
              </div>
              <div className="flex justify-between py-1 pt-1">
                <span className="text-[#64748B]">Booking Status</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0D47A1] font-bold text-[10px]">
                  Scheduled
                </span>
              </div>
            </div>
          </div>

          {/* CARD 04: Quick Communications Toggle Actions */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Notification Preferences
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 cursor-pointer">
                <span className="font-medium text-[#111827]">Send SMS Notification</span>
                <input
                  type="checkbox"
                  checked={notificationSent.sms}
                  onChange={e => setNotificationSent(prev => ({ ...prev, sms: e.target.checked }))}
                  className="accent-[#009688] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 cursor-pointer">
                <span className="font-medium text-[#111827]">Send Email Confirmation</span>
                <input
                  type="checkbox"
                  checked={notificationSent.email}
                  onChange={e => setNotificationSent(prev => ({ ...prev, email: e.target.checked }))}
                  className="accent-[#009688] w-4 h-4"
                />
              </label>
            </div>
          </div>

        </div>

      </div>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-4 rounded-2xl shadow-lg flex items-center justify-between z-10">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-all"
          style={{ fontFamily: PP }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedPatient}
          className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: PP }}
        >
          <CheckCircle2 size={16} /> Confirm Appointment
        </button>
      </div>

      {/* ── SUCCESS DIALOG MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mb-1">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Appointment Booked Successfully</h3>
              <p className="text-xs text-[#64748B]">OPD appointment slot confirmed in HMS queue.</p>
            </div>

            {/* Confirmed Details Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[#64748B]">Appointment ID</span>
                <span className="font-mono text-base font-bold text-[#0D47A1]">{confirmedAptId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Patient</span>
                <span className="font-bold text-[#111827]">{selectedPatient?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Doctor</span>
                <span className="font-semibold text-[#111827]">{currentDoctor.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Department</span>
                <span className="text-slate-600">{currentDoctor.dept}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Date & Slot</span>
                <span className="font-mono font-bold text-[#009688]">{selectedDate} at {selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Status</span>
                <span className="font-bold text-[#66BB6A]">Scheduled</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  alert(`Printing Appointment Slip for ${confirmedAptId}...`)
                }}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} /> Print Appointment Slip
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  if (onConfirmSuccess) onConfirmSuccess(confirmedAptId)
                  else if (onBack) onBack()
                }}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-teal-50 text-xs font-semibold text-[#009688] hover:bg-teal-100 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <UserCheck size={15} /> Patient Check-In
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                }}
                className="w-full py-2 rounded-xl text-xs text-[#64748B] font-medium hover:bg-slate-50 transition-all text-center"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── RECEPTIONIST PATIENT CHECK-IN SCREEN ───
export interface PatientCheckInScreenProps {
  onBack?: () => void
  onCheckInSuccess?: (tokenNo: string) => void
  onViewQueueClick?: () => void
  onViewPatientProfileClick?: (mrn: string) => void
  initialMrn?: string
  initialAptId?: string
}

export function PatientCheckInScreen({
  onBack,
  onCheckInSuccess,
  onViewQueueClick,
  onViewPatientProfileClick,
  initialMrn,
  initialAptId,
}: PatientCheckInScreenProps) {
  // Appointment lookup state
  const [aptSearchQuery, setAptSearchQuery] = useState(initialAptId || initialMrn || '')
  
  // Mock appointments database for lookup
  const [checkInApts] = useState([
    {
      aptId: 'APT-2026-8912',
      token: 'TK-086',
      mrn: 'MRN-892101',
      patientName: 'Sarah Mitchell',
      age: 34,
      gender: 'Female',
      bloodGroup: 'A+',
      mobile: '+91 98765 43210',
      emergencyContact: '+91 98765 00000 (Spouse)',
      doctor: 'Dr. Arjun Mehta',
      dept: 'Cardiology',
      date: '2026-07-24',
      timeSlot: '09:00 AM',
      visitType: 'New Consultation',
      status: 'Scheduled'
    },
    {
      aptId: 'APT-2026-8913',
      token: 'TK-087',
      mrn: 'MRN-892102',
      patientName: 'James Thornton',
      age: 67,
      gender: 'Male',
      bloodGroup: 'O+',
      mobile: '+91 98765 43211',
      emergencyContact: '+91 98765 11111 (Daughter)',
      doctor: 'Dr. Priya Sharma',
      dept: 'General OPD',
      date: '2026-07-24',
      timeSlot: '09:15 AM',
      visitType: 'Follow-up',
      status: 'Scheduled'
    },
    {
      aptId: 'APT-2026-8914',
      token: 'TK-088',
      mrn: 'MRN-892103',
      patientName: 'Emma Reyes',
      age: 28,
      gender: 'Female',
      bloodGroup: 'B+',
      mobile: '+91 98765 43212',
      emergencyContact: '+91 98765 22222 (Mother)',
      doctor: 'Dr. Sunita Patel',
      dept: 'Gynecology',
      date: '2026-07-24',
      timeSlot: '09:30 AM',
      visitType: 'New Consultation',
      status: 'Checked-In'
    },
    {
      aptId: 'APT-2026-8915',
      token: 'TK-089',
      mrn: 'MRN-892104',
      patientName: 'Robert Chen',
      age: 52,
      gender: 'Male',
      bloodGroup: 'AB+',
      mobile: '+91 98765 43213',
      emergencyContact: '+91 98765 33333 (Wife)',
      doctor: 'Dr. Arjun Mehta',
      dept: 'Cardiology',
      date: '2026-07-24',
      timeSlot: '10:00 AM',
      visitType: 'Follow-up',
      status: 'Scheduled'
    },
    {
      aptId: 'APT-2026-8916',
      token: 'TK-090',
      mrn: 'MRN-892105',
      patientName: 'Aisha Kumar',
      age: 41,
      gender: 'Female',
      bloodGroup: 'O-',
      mobile: '+91 98765 43214',
      emergencyContact: '+91 98765 44444 (Brother)',
      doctor: 'Dr. Rajesh Kapoor',
      dept: 'Neurology',
      date: '2026-07-24',
      timeSlot: '10:15 AM',
      visitType: 'New Consultation',
      status: 'Scheduled'
    },
    {
      aptId: 'APT-2026-8917',
      token: 'TK-091',
      mrn: 'MRN-892106',
      patientName: 'David Walsh',
      age: 38,
      gender: 'Male',
      bloodGroup: 'A-',
      mobile: '+91 98765 43215',
      emergencyContact: '+91 98765 55555 (Sister)',
      doctor: 'Dr. Priya Sharma',
      dept: 'General OPD',
      date: '2026-07-24',
      timeSlot: '10:30 AM',
      visitType: 'New Consultation',
      status: 'Scheduled'
    },
    {
      aptId: 'APT-2026-8918',
      token: 'TK-092',
      mrn: 'MRN-892107',
      patientName: 'Nina Patel',
      age: 29,
      gender: 'Female',
      bloodGroup: 'B-',
      mobile: '+91 98765 43216',
      emergencyContact: '+91 98765 66666 (Father)',
      doctor: 'Dr. Rajesh Kapoor',
      dept: 'Dermatology',
      date: '2026-07-24',
      timeSlot: '11:00 AM',
      visitType: 'Follow-up',
      status: 'Scheduled'
    },
    {
      aptId: 'APT-2026-8919',
      token: 'TK-093',
      mrn: 'MRN-892108',
      patientName: 'Carlos Mendez',
      age: 63,
      gender: 'Male',
      bloodGroup: 'O+',
      mobile: '+91 98765 43217',
      emergencyContact: '+91 98765 77777 (Wife)',
      doctor: 'Dr. Priya Sharma',
      dept: 'General OPD',
      date: '2026-07-24',
      timeSlot: '11:30 AM',
      visitType: 'New Consultation',
      status: 'Scheduled'
    }
  ])

  const [selectedApt, setSelectedApt] = useState(() => {
    if (initialAptId || initialMrn) {
      const target = (initialAptId || initialMrn || '').toLowerCase().trim()
      const found = checkInApts.find(a => 
        a.aptId.toLowerCase() === target || 
        a.mrn.toLowerCase() === target ||
        (a.token && a.token.toLowerCase() === target)
      )
      return found || checkInApts[0]
    }
    return checkInApts[0]
  })

  // Section 03 Form fields
  const [arrivalTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  const [consultationType, setConsultationType] = useState<'Appointment' | 'Walk-In'>('Appointment')
  const [remarks, setRemarks] = useState('')

  // Generated token & queue assignment details
  const generatedToken = useMemo(() => `TK-08${Math.floor(6 + Math.random() * 5)}`, [])
  const queuePosition = 3
  const estWaitTime = '12 mins'

  // Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Search filter options
  const searchResults = useMemo(() => {
    if (!aptSearchQuery.trim()) return checkInApts
    const q = aptSearchQuery.toLowerCase()
    return checkInApts.filter(a => 
      a.aptId.toLowerCase().includes(q) ||
      a.mrn.toLowerCase().includes(q) ||
      a.patientName.toLowerCase().includes(q) ||
      a.mobile.includes(q)
    )
  }, [aptSearchQuery, checkInApts])

  // Perform Check-In
  const handlePerformCheckIn = () => {
    if (!selectedApt) return
    setShowSuccessModal(true)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>

      {/* ── HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Reception Management</button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">Patient Check-In</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Check-In</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Verify appointment details and check the patient into today's consultation queue.</p>
        </div>

        {/* Quick View Queue Header Button */}
        <div>
          <button
            onClick={onViewQueueClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0D47A1] text-xs font-semibold hover:bg-blue-100 transition-all"
            style={{ fontFamily: PP }}
          >
            <Clock size={14} /> View OPD Live Queue
          </button>
        </div>
      </div>

      {/* ── INFORMATION ALERT CARD ── */}
      <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-white p-4 rounded-2xl border border-blue-100 shadow-sm flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Info size={18} />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>Check-In Information & Guidelines</h4>
          <ul className="text-slate-600 list-disc list-inside space-y-0.5 text-[11px]">
            <li>Check-In confirms patient physical arrival at the reception desk.</li>
            <li>A unique consultation <strong>Queue Token Number</strong> is automatically assigned.</li>
            <li>Patient status changes from <span className="font-semibold text-[#0D47A1]">Scheduled</span> to <span className="font-semibold text-[#009688]">Checked-In</span>.</li>
            <li>The consulting doctor will immediately see the patient in their live OPD waiting queue.</li>
          </ul>
        </div>
      </div>

      {/* ── MAIN WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN: CHECK-IN WORKSPACE (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">

          {/* SEARCH APPOINTMENT / PATIENT SEARCH */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Lookup Scheduled Appointment</h2>
              <span className="text-xs text-[#64748B]">Search today's bookings</span>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={aptSearchQuery}
                onChange={e => setAptSearchQuery(e.target.value)}
                placeholder="Search by Appointment ID, MRN, Patient Name or Mobile..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Instant Search Results Dropdown */}
            {aptSearchQuery.trim() !== '' && (
              <div className="max-h-48 overflow-y-auto border border-[#E5E7EB] rounded-xl divide-y divide-gray-100 bg-white shadow-lg">
                {searchResults.length > 0 ? (
                  searchResults.map(a => (
                    <div
                      key={a.aptId}
                      onClick={() => {
                        setSelectedApt(a)
                        setAptSearchQuery('')
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <p className="font-bold text-[#111827]">{a.patientName} <span className="font-mono text-[11px] font-semibold text-[#0D47A1]">({a.mrn})</span></p>
                        <p className="text-[11px] text-[#64748B]">{a.doctor} · {a.dept} · {a.timeSlot}</p>
                      </div>
                      <span className="font-mono font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{a.aptId}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching scheduled appointments found.
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedApt ? (
            <>
              {/* SECTION 01: APPOINTMENT DETAILS */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>01</div>
                    <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Appointment Details</h2>
                  </div>
                  <Chip label={selectedApt.status} variant={selectedApt.status === 'Scheduled' ? 'teal' : selectedApt.status === 'Checked-In' ? 'info' : 'error'} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block">Appointment ID</span>
                    <span className="font-mono font-bold text-[#0D47A1]">{selectedApt.aptId}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block">Appointment Date</span>
                    <span className="font-mono font-bold text-[#111827]">{selectedApt.date}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block">Time Slot</span>
                    <span className="font-mono font-bold text-[#009688]">{selectedApt.timeSlot}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block">Visit Type</span>
                    <span className="font-bold text-[#111827]">{selectedApt.visitType}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 02: PATIENT INFORMATION */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>02</div>
                    <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Master Record</h2>
                  </div>
                  {onViewPatientProfileClick && (
                    <button
                      onClick={() => onViewPatientProfileClick(selectedApt.mrn)}
                      className="text-xs font-semibold text-[#0D47A1] hover:underline"
                    >
                      View Profile
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    {selectedApt.patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#111827]">{selectedApt.patientName}</h3>
                      <span className="font-mono text-xs font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{selectedApt.mrn}</span>
                    </div>
                    <p className="text-[#64748B]">
                      {selectedApt.age} yrs · {selectedApt.gender} · Blood Group: <span className="font-bold text-[#009688]">{selectedApt.bloodGroup}</span>
                    </p>
                    <p className="text-[#64748B]">
                      Mobile: <span className="font-mono font-semibold text-[#111827]">{selectedApt.mobile}</span> · Emergency: <span className="text-slate-700">{selectedApt.emergencyContact}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 03: CHECK-IN DETAILS FORM */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>03</div>
                    <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Check-In Details</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Arrival Time */}
                  <div>
                    <label className="block font-semibold text-[#111827] mb-1">Arrival Time (Auto-filled)</label>
                    <input
                      type="text"
                      readOnly
                      value={arrivalTime}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] font-mono text-xs text-[#111827] cursor-not-allowed"
                    />
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <label className="block font-semibold text-[#111827] mb-1">Consultation Category *</label>
                    <div className="flex items-center gap-4 pt-1.5">
                      <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                        <input
                          type="radio"
                          name="consultationType"
                          checked={consultationType === 'Appointment'}
                          onChange={() => setConsultationType('Appointment')}
                          className="accent-[#0D47A1]"
                        />
                        <span>Scheduled Appointment</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                        <input
                          type="radio"
                          name="consultationType"
                          checked={consultationType === 'Walk-In'}
                          onChange={() => setConsultationType('Walk-In')}
                          className="accent-[#0D47A1]"
                        />
                        <span>Walk-In Patient</span>
                      </label>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#111827] mb-1">Receptionist Check-In Remarks (Optional)</label>
                    <textarea
                      rows={2}
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      placeholder="Add optional notes for triage nurse or consulting doctor..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 04: QUEUE ASSIGNMENT PREVIEW */}
              <div className="bg-white rounded-2xl border border-[#009688] p-5 shadow-sm space-y-3 bg-gradient-to-b from-teal-50/30 to-white">
                <div className="flex items-center justify-between border-b border-teal-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-[#009688] flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>04</div>
                    <h2 className="text-base font-bold text-[#009688]" style={{ fontFamily: PP }}>Queue Token Assignment</h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#009688] font-bold text-[10px]">
                    Auto-Generated Queue Entry
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-teal-200">
                    <span className="text-[10px] text-[#64748B] block">Assigned Doctor</span>
                    <span className="font-bold text-[#111827]">{selectedApt.doctor}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-teal-200">
                    <span className="text-[10px] text-[#64748B] block">Department</span>
                    <span className="font-semibold text-slate-700">{selectedApt.dept}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-300">
                    <span className="text-[10px] text-[#009688] block">Generated Token</span>
                    <span className="font-mono text-base font-bold text-[#0D47A1]">{generatedToken}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-teal-200">
                    <span className="text-[10px] text-[#64748B] block">Est. Waiting Time</span>
                    <span className="font-mono font-bold text-[#009688]">{estWaitTime}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center space-y-2">
              <Clock size={36} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-[#111827]">No appointment selected for check-in.</p>
              <p className="text-xs text-slate-400">Search or select a scheduled appointment to begin patient check-in.</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">

          {selectedApt ? (
            <>
              {/* CARD 01: Patient Summary */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
                  Patient Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Patient Name</span>
                    <span className="font-bold text-[#111827]">{selectedApt.patientName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">MRN</span>
                    <span className="font-mono font-bold text-[#0D47A1]">{selectedApt.mrn}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Age / Gender</span>
                    <span className="text-[#111827]">{selectedApt.age} yrs · {selectedApt.gender}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748B]">Blood Group</span>
                    <span className="font-bold text-[#009688]">{selectedApt.bloodGroup}</span>
                  </div>
                </div>
              </div>

              {/* CARD 02: Appointment Summary */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
                  Appointment Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Appointment Date</span>
                    <span className="font-mono font-bold text-[#111827]">{selectedApt.date}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Time Slot</span>
                    <span className="font-mono font-bold text-[#009688]">{selectedApt.timeSlot}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Consulting Doctor</span>
                    <span className="font-bold text-[#111827]">{selectedApt.doctor}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-[#64748B]">Department</span>
                    <span className="text-slate-600">{selectedApt.dept}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748B]">Visit Type</span>
                    <span className="font-semibold text-[#111827]">{selectedApt.visitType}</span>
                  </div>
                </div>
              </div>

              {/* CARD 03: Queue Summary */}
              <div className="bg-white rounded-2xl border border-[#0D47A1] p-5 shadow-sm space-y-3 bg-gradient-to-b from-blue-50/40 to-white">
                <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider border-b border-blue-100 pb-2 flex items-center justify-between" style={{ fontFamily: PP }}>
                  <span>Queue Summary</span>
                  <Clock size={14} />
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-[#64748B]">Token Number</span>
                    <span className="font-mono font-bold text-[#0D47A1] text-sm">{generatedToken}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-[#64748B]">Queue Position</span>
                    <span className="font-bold text-[#111827]">#{queuePosition} in line</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-[#64748B]">Est. Waiting Time</span>
                    <span className="font-mono font-bold text-[#009688]">{estWaitTime}</span>
                  </div>
                  <div className="flex justify-between py-1 pt-1">
                    <span className="text-[#64748B]">Current Queue Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-[#009688] font-bold text-[10px]">
                      Waiting
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 04: Quick Actions */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-2.5">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
                  Quick Actions
                </h3>
                <button
                  onClick={() => onViewPatientProfileClick && onViewPatientProfileClick(selectedApt.mrn)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-semibold text-[#0D47A1] transition-colors"
                >
                  View Patient Profile <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => alert(`Printing Queue Token ${generatedToken} for ${selectedApt.patientName}...`)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-[#009688] transition-colors"
                >
                  Print Queue Token <Printer size={14} />
                </button>
                <button
                  onClick={() => alert(`Printing Appointment Slip for ${selectedApt.aptId}...`)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#111827] transition-colors"
                >
                  Print Appointment Slip <Printer size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center text-xs text-slate-400">
              Select an appointment to inspect summary.
            </div>
          )}

        </div>

      </div>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-4 rounded-2xl shadow-lg flex items-center justify-between z-10">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-all"
          style={{ fontFamily: PP }}
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!selectedApt || selectedApt.status === 'Cancelled'}
          onClick={handlePerformCheckIn}
          className="px-6 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: PP }}
        >
          <UserCheck size={16} /> Check-In Patient
        </button>
      </div>

      {/* ── SUCCESS DIALOG MODAL ── */}
      {showSuccessModal && selectedApt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-[#009688] flex items-center justify-center mb-1">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Checked-In Successfully</h3>
              <p className="text-xs text-[#64748B]">Patient assigned to today's doctor queue.</p>
            </div>

            {/* Confirmed Details Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[#64748B]">Queue Token</span>
                <span className="font-mono text-base font-bold text-[#0D47A1]">{generatedToken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Patient Name</span>
                <span className="font-bold text-[#111827]">{selectedApt.patientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">MRN</span>
                <span className="font-mono text-[#0D47A1]">{selectedApt.mrn}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Consulting Doctor</span>
                <span className="font-semibold text-[#111827]">{selectedApt.doctor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Queue Position</span>
                <span className="font-bold text-[#111827]">#{queuePosition} in line</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Est. Waiting Time</span>
                <span className="font-mono font-bold text-[#009688]">{estWaitTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Status</span>
                <span className="font-bold text-[#009688]">Checked-In</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => alert(`Printing Queue Token ${generatedToken}...`)}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} /> Print Queue Token
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  if (onViewQueueClick) onViewQueueClick()
                  else if (onCheckInSuccess) onCheckInSuccess(generatedToken)
                }}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-teal-50 text-xs font-semibold text-[#009688] hover:bg-teal-100 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Clock size={15} /> View OPD Live Queue
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                }}
                className="w-full py-2 rounded-xl text-xs text-[#64748B] font-medium hover:bg-slate-50 transition-all text-center"
              >
                Check-In Another Patient
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── RECEPTION QUEUE MANAGEMENT SCREEN ───
export interface ReceptionQueueManagementScreenProps {
  onBack?: () => void
  onCheckInClick?: (token?: string, mrn?: string) => void
  onPatientSearchClick?: () => void
  onPatientSelect?: (mrn: string) => void
  onRegisterPatientClick?: () => void
  onBookAppointmentClick?: () => void
}

export function ReceptionQueueManagementScreen({
  onBack,
  onCheckInClick,
  onPatientSearchClick,
  onPatientSelect,
  onRegisterPatientClick,
  onBookAppointmentClick,
}: ReceptionQueueManagementScreenProps) {
  // Global Search state
  const [searchQuery, setSearchQuery] = useState('')

  // Filter Bar state
  const [selectedDoctor, setSelectedDoctor] = useState('All Doctors')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [, setSelectedDate] = useState('Today (2026-07-24)')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [selectedType, setSelectedType] = useState('All Types')

  // Selected Row for Right Context Panel
  const [selectedTokenId, setSelectedTokenId] = useState<string>('TK-086')

  // Dialog States
  const [noShowDialogApt, setNoShowDialogApt] = useState<any | null>(null)
  const [] = useState<any | null>(null)

  // Queue Data List
  const [queueItems, setQueueItems] = useState([
    { token: 'TK-086', name: 'Sarah Mitchell', mrn: 'MRN-892101', aptId: 'APT-2026-8912', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', apptTime: '09:00 AM', arrivalTime: '08:42 AM', waitTime: '18 min', status: 'In Consultation', type: 'Follow-up', age: 34, gender: 'Female', bloodGroup: 'A+' },
    { token: 'TK-087', name: 'James Thornton', mrn: 'MRN-892102', aptId: 'APT-2026-8913', doctor: 'Dr. Priya Sharma', dept: 'General OPD', apptTime: '09:15 AM', arrivalTime: '09:03 AM', waitTime: '12 min', status: 'Waiting', type: 'Routine', age: 67, gender: 'Male', bloodGroup: 'O+' },
    { token: 'TK-088', name: 'Emma Reyes', mrn: 'MRN-892103', aptId: 'APT-2026-8914', doctor: 'Dr. Sunita Patel', dept: 'Gynecology', apptTime: '09:30 AM', arrivalTime: '09:22 AM', waitTime: '08 min', status: 'Checked-In', type: 'New Visit', age: 28, gender: 'Female', bloodGroup: 'B+' },
    { token: 'TK-089', name: 'Robert Chen', mrn: 'MRN-892104', aptId: 'APT-2026-8915', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', apptTime: '10:00 AM', arrivalTime: '—', waitTime: '00 min', status: 'Scheduled', type: 'Emergency', age: 52, gender: 'Male', bloodGroup: 'AB+' },
    { token: 'TK-090', name: 'Aisha Kumar', mrn: 'MRN-892105', aptId: 'APT-2026-8916', doctor: 'Dr. Rajesh Kapoor', dept: 'Neurology', apptTime: '10:15 AM', arrivalTime: '10:11 AM', waitTime: '04 min', status: 'Checked-In', type: 'Consultation', age: 41, gender: 'Female', bloodGroup: 'O-' },
    { token: 'TK-091', name: 'David Walsh', mrn: 'MRN-892106', aptId: 'APT-2026-8917', doctor: 'Dr. Priya Sharma', dept: 'General OPD', apptTime: '10:30 AM', arrivalTime: '—', waitTime: '00 min', status: 'Scheduled', type: 'Routine', age: 38, gender: 'Male', bloodGroup: 'A-' },
    { token: 'TK-092', name: 'Nina Patel', mrn: 'MRN-892107', aptId: 'APT-2026-8918', doctor: 'Dr. Rajesh Kapoor', dept: 'Dermatology', apptTime: '11:00 AM', arrivalTime: '10:45 AM', waitTime: '00 min', status: 'Completed', type: 'Follow-up', age: 29, gender: 'Female', bloodGroup: 'B-' },
    { token: 'TK-093', name: 'Carlos Mendez', mrn: 'MRN-892108', aptId: 'APT-2026-8919', doctor: 'Dr. Priya Sharma', dept: 'General OPD', apptTime: '11:30 AM', arrivalTime: '—', waitTime: '00 min', status: 'No Show', type: 'Consultation', age: 63, gender: 'Male', bloodGroup: 'O+' },
  ])

  // Filter Logic
  const filteredQueue = useMemo(() => {
    return queueItems.filter(item => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch = q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.mrn.toLowerCase().includes(q) ||
        item.token.toLowerCase().includes(q) ||
        item.aptId.toLowerCase().includes(q)

      const matchDoc = selectedDoctor === 'All Doctors' || item.doctor === selectedDoctor
      const matchDept = selectedDept === 'All Departments' || item.dept === selectedDept
      const matchStatus = selectedStatus === 'All Statuses' || item.status === selectedStatus
      const matchType = selectedType === 'All Types' || item.type === selectedType

      return matchSearch && matchDoc && matchDept && matchStatus && matchType
    })
  }, [queueItems, searchQuery, selectedDoctor, selectedDept, selectedStatus, selectedType])

  const selectedItem = useMemo(() => {
    return queueItems.find(i => i.token === selectedTokenId) || filteredQueue[0] || queueItems[0]
  }, [queueItems, selectedTokenId, filteredQueue])

  // Summary KPI Metrics
  const metrics = useMemo(() => {
    const waiting = queueItems.filter(i => i.status === 'Waiting').length
    const checkedIn = queueItems.filter(i => i.status === 'Checked-In').length
    const inConsultation = queueItems.filter(i => i.status === 'In Consultation').length
    const completed = queueItems.filter(i => i.status === 'Completed').length
    const noShows = queueItems.filter(i => i.status === 'No Show').length
    return { waiting, checkedIn, inConsultation, completed, noShows }
  }, [queueItems])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedDoctor('All Doctors')
    setSelectedDept('All Departments')
    setSelectedDate('Today (2026-07-24)')
    setSelectedStatus('All Statuses')
    setSelectedType('All Types')
  }

  const handleMarkNoShow = (token: string) => {
    setQueueItems(prev => prev.map(i => i.token === token ? { ...i, status: 'No Show' } : i))
    setNoShowDialogApt(null)
  }


  const getStatusChipVariant = (status: string): ChipVariant => {
    switch (status) {
      case 'In Consultation': return 'teal'
      case 'Waiting': return 'warning'
      case 'Checked-In': return 'info'
      case 'Scheduled': return 'info'
      case 'Completed': return 'success'
      case 'No Show': return 'error'
      case 'Cancelled': return 'error'
      default: return 'default'
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      
      {/* ── HEADER & BREADCRUMBS & PRIMARY ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Reception Management</button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">Queue Management</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Reception Queue Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Monitor today's patient queue and manage patient check-ins.</p>
        </div>

        {/* Primary Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              // Trigger quick refresh
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <RefreshCw size={15} /> Refresh Queue
          </button>
          <button
            onClick={() => onCheckInClick && onCheckInClick()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <UserCheck size={15} /> Patient Check-In
          </button>
          <button
            onClick={onPatientSearchClick}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-200 transition-all"
            style={{ fontFamily: PP }}
          >
            <Search size={15} /> Patient Search
          </button>
        </div>
      </div>

      {/* ── 6 SUMMARY KPI CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 01: Waiting Patients */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <span className="text-[11px] text-[#64748B] font-medium block">Waiting Patients</span>
          <div className="text-2xl font-bold text-[#F59E0B]" style={{ fontFamily: PP }}>{metrics.waiting}</div>
          <span className="text-[10px] text-amber-600 font-medium">In lounge waiting</span>
        </div>

        {/* Card 02: Checked-In Patients */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <span className="text-[11px] text-[#64748B] font-medium block">Checked-In Patients</span>
          <div className="text-2xl font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>{metrics.checkedIn}</div>
          <span className="text-[10px] text-blue-600 font-medium">Arrived at reception</span>
        </div>

        {/* Card 03: Currently In Consultation (Read Only) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-medium">In Consultation</span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold">Read Only</span>
          </div>
          <div className="text-2xl font-bold text-[#009688]" style={{ fontFamily: PP }}>{metrics.inConsultation}</div>
          <span className="text-[10px] text-teal-600 font-medium">Active doctor room</span>
        </div>

        {/* Card 04: Completed (Read Only) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-medium">Completed</span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold">Read Only</span>
          </div>
          <div className="text-2xl font-bold text-[#66BB6A]" style={{ fontFamily: PP }}>{metrics.completed}</div>
          <span className="text-[10px] text-green-600 font-medium">Consultations done</span>
        </div>

        {/* Card 05: No Shows */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <span className="text-[11px] text-[#64748B] font-medium block">No Shows</span>
          <div className="text-2xl font-bold text-[#EF4444]" style={{ fontFamily: PP }}>{metrics.noShows}</div>
          <span className="text-[10px] text-red-600 font-medium">Missed slot today</span>
        </div>

        {/* Card 06: Average Waiting Time */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
          <span className="text-[11px] text-[#64748B] font-medium block">Avg Waiting Time</span>
          <div className="text-2xl font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>14 min</div>
          <span className="text-[10px] text-slate-400 font-medium">OPD bench target</span>
        </div>
      </div>

      {/* ── GLOBAL SEARCH & FILTER BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search queue by Patient Name, MRN, Token Number or Appointment ID..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Doctors</option>
              <option>Dr. Arjun Mehta</option>
              <option>Dr. Priya Sharma</option>
              <option>Dr. Sunita Patel</option>
              <option>Dr. Rajesh Kapoor</option>
            </select>

            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Departments</option>
              <option>Cardiology</option>
              <option>General OPD</option>
              <option>Gynecology</option>
              <option>Neurology</option>
              <option>Dermatology</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Statuses</option>
              <option>Scheduled</option>
              <option>Checked-In</option>
              <option>Waiting</option>
              <option>In Consultation</option>
              <option>Completed</option>
              <option>No Show</option>
              <option>Cancelled</option>
            </select>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Types</option>
              <option>New Visit</option>
              <option>Follow-up</option>
              <option>Routine</option>
              <option>Emergency</option>
              <option>Consultation</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl text-xs text-[#EF4444] font-semibold hover:bg-red-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="text-xs text-[#64748B] font-medium">
            Showing <span className="font-bold text-[#0D47A1]">{filteredQueue.length}</span> queue entries
          </div>
        </div>
      </div>

      {/* ── ENTERPRISE LAYOUT GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN: ENTERPRISE QUEUE TABLE (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Today's Queue Table</h2>
                <p className="text-xs text-[#64748B]">Real-time patient flow and arrival management</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]" style={{ fontFamily: PP }}>
                    <th className="px-4 py-3">Token</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">MRN</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Appt Time</th>
                    <th className="px-4 py-3">Arrival Time</th>
                    <th className="px-4 py-3">Wait Time</th>
                    <th className="px-4 py-3">Queue Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {filteredQueue.length > 0 ? (
                    filteredQueue.map(item => {
                      const isSelected = selectedTokenId === item.token
                      return (
                        <tr
                          key={item.token}
                          onClick={() => setSelectedTokenId(item.token)}
                          className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60 font-medium' : ''}`}
                        >
                          <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">{item.token}</td>
                          <td className="px-4 py-3.5 font-bold text-[#111827]">{item.name}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">{item.mrn}</td>
                          <td className="px-4 py-3.5 font-medium">{item.doctor}</td>
                          <td className="px-4 py-3.5 text-slate-600">{item.dept}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">{item.apptTime}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">{item.arrivalTime}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">{item.waitTime}</td>
                          <td className="px-4 py-3.5">
                            <Chip label={item.status} variant={getStatusChipVariant(item.status)} />
                          </td>
                          <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status === 'Scheduled' || item.status === 'Registered' ? (
                                <button
                                  onClick={() => onCheckInClick && onCheckInClick(item.token, item.mrn)}
                                  className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                                >
                                  Check-In
                                </button>
                              ) : null}

                              <button
                                onClick={() => onPatientSelect && onPatientSelect(item.mrn)}
                                title="View Patient"
                                className="px-2 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                              >
                                View
                              </button>

                              {item.status !== 'Completed' && item.status !== 'Cancelled' && item.status !== 'No Show' && (
                                <button
                                  onClick={() => setNoShowDialogApt(item)}
                                  title="Mark No Show"
                                  className="px-2 py-1 rounded-lg bg-red-50 text-[#EF4444] text-[11px] font-semibold hover:bg-red-100 transition-colors"
                                >
                                  No Show
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={32} className="text-slate-300" />
                          <p className="text-sm font-semibold text-[#111827]">No patients are currently in today's queue.</p>
                          <button
                            onClick={onPatientSearchClick}
                            className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center gap-1.5"
                            style={{ fontFamily: PP }}
                          >
                            <Search size={15} /> Patient Search
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#64748B]">
              <span>Showing 1-{filteredQueue.length} of {filteredQueue.length} queue records</span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] disabled:opacity-50 hover:bg-slate-50" disabled>Previous</button>
                <button className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white font-semibold">1</button>
                <button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">

          {/* CARD 01: Selected Patient Summary */}
          {selectedItem && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
                Selected Patient Summary
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Patient Name</span>
                  <span className="font-bold text-[#111827]">{selectedItem.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{selectedItem.mrn}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Assigned Doctor</span>
                  <span className="font-semibold text-[#111827]">{selectedItem.doctor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Department</span>
                  <span className="text-slate-600">{selectedItem.dept}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Appointment Time</span>
                  <span className="font-mono text-slate-700">{selectedItem.apptTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Current Status</span>
                  <Chip label={selectedItem.status} variant={getStatusChipVariant(selectedItem.status)} />
                </div>
              </div>
            </div>
          )}

          {/* CARD 02: Queue Statistics */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Queue Statistics
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Total Waiting</span>
                <span className="font-bold text-[#F59E0B]">{metrics.waiting}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Checked-In</span>
                <span className="font-bold text-[#0D47A1]">{metrics.checkedIn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">In Consultation</span>
                <span className="font-bold text-[#009688]">{metrics.inConsultation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Completed</span>
                <span className="font-bold text-[#66BB6A]">{metrics.completed}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">No Shows</span>
                <span className="font-bold text-[#EF4444]">{metrics.noShows}</span>
              </div>
            </div>
          </div>

          {/* CARD 03: Quick Actions */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Quick Actions
            </h3>
            <button
              onClick={onPatientSearchClick}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-semibold text-[#0D47A1] transition-colors"
            >
              Patient Search <ChevronRight size={14} />
            </button>
            <button
              onClick={() => onRegisterPatientClick?.()}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-semibold text-[#0D47A1] transition-colors"
            >
              Patient Registration <ChevronRight size={14} />
            </button>
            <button
              onClick={() => onBookAppointmentClick?.()}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-[#009688] transition-colors"
            >
              Appointment Booking <ChevronRight size={14} />
            </button>
            <button
              onClick={() => onCheckInClick && onCheckInClick()}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-[#009688] transition-colors"
            >
              Patient Check-In <ChevronRight size={14} />
            </button>
            <button
              onClick={() => {
                // Trigger quick queue refresh
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#111827] transition-colors"
            >
              Refresh Queue <ChevronRight size={14} />
            </button>
          </div>

          {/* CARD 04: Queue Alerts */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: PP }}>
              <AlertCircle size={15} className="text-[#F59E0B]" /> Queue Alerts
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <span className="font-bold block">Extended Waiting Time</span>
                <span className="text-[11px]">Robert Chen (Cardiology) has been waiting over 20 mins.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <span className="font-bold block">Upcoming Appointment Slot</span>
                <span className="text-[11px]">3 patients scheduled for 11:00 AM session.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── CONFIRMATION DIALOG: MARK NO SHOW ── */}
      {noShowDialogApt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Mark Patient as No Show?</h3>
                <p className="text-xs text-[#64748B]">This patient did not arrive for the scheduled appointment.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <p><strong>Patient:</strong> {noShowDialogApt.name} ({noShowDialogApt.mrn})</p>
              <p><strong>Doctor:</strong> {noShowDialogApt.doctor} ({noShowDialogApt.dept})</p>
              <p><strong>Time Slot:</strong> {noShowDialogApt.apptTime}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNoShowDialogApt(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMarkNoShow(noShowDialogApt.token)}
                className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-semibold hover:bg-red-600 shadow-sm"
              >
                Confirm No Show
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}