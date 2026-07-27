import { useState } from 'react'
import {
  Search, Plus, Filter, Download, RefreshCw, ChevronLeft, ChevronRight,
  MoreVertical, Eye, Edit, Receipt, X, Phone, UserCheck, ChevronDown,
  Activity, Calendar, Stethoscope, Pill, AlertTriangle, FileText, Clock,
  Mail, MapPin, Droplets, Users, UserPlus, UserX, User,
  Printer, CheckCircle2,  XCircle,
  Building2, CreditCard, Lock, Key, ShieldCheck, Save,
  TrendingUp, Star, Info, Check, AlertCircle
} from 'lucide-react'

// --- Shared Types & Data ---
export type Patient = {
  id: string
  name: string
  age: number
  gender: 'M' | 'F' | 'Other'
  mobile: string
  doctor: string
  department: string
  visitType: string
  regDate: string
  status: 'Active' | 'Inactive' | 'Discharged' | 'Admitted'
  photo?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  lastVisit?: {
    date: string
    doctor: string
    reason: string
  }
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: 'PT-2024-001',
    name: 'Sarah Mitchell',
    age: 34,
    gender: 'F',
    mobile: '+1 (555) 234-5678',
    doctor: 'Dr. A. Mehta',
    department: 'Cardiology',
    visitType: 'OPD',
    regDate: '2024-03-12',
    status: 'Active',
    emergencyContact: { name: 'David Mitchell', relationship: 'Spouse', phone: '+1 (555) 345-6789' },
    lastVisit: { date: '2024-03-12', doctor: 'Dr. A. Mehta', reason: 'Routine Chest Pain Checkup' }
  },
  {
    id: 'PT-2024-002',
    name: 'James Thornton',
    age: 67,
    gender: 'M',
    mobile: '+1 (555) 987-6543',
    doctor: 'Dr. P. Sharma',
    department: 'General Medicine',
    visitType: 'OPD',
    regDate: '2024-03-12',
    status: 'Active',
    emergencyContact: { name: 'Eleanor Thornton', relationship: 'Daughter', phone: '+1 (555) 876-1234' },
    lastVisit: { date: '2024-03-10', doctor: 'Dr. P. Sharma', reason: 'Diabetes HbA1c Review' }
  },
  {
    id: 'PT-2024-003',
    name: 'Emma Reyes',
    age: 28,
    gender: 'F',
    mobile: '+1 (555) 456-7890',
    doctor: 'Dr. S. Patel',
    department: 'Gynecology',
    visitType: 'OPD',
    regDate: '2024-03-11',
    status: 'Admitted',
    emergencyContact: { name: 'Carlos Reyes', relationship: 'Husband', phone: '+1 (555) 432-1098' },
    lastVisit: { date: '2024-03-11', doctor: 'Dr. S. Patel', reason: 'Prenatal Consultation' }
  },
  {
    id: 'PT-2024-004',
    name: 'Robert Chen',
    age: 52,
    gender: 'M',
    mobile: '+1 (555) 123-4567',
    doctor: 'Dr. A. Mehta',
    department: 'Cardiology',
    visitType: 'OPD',
    regDate: '2024-03-10',
    status: 'Discharged',
    emergencyContact: { name: 'Grace Chen', relationship: 'Wife', phone: '+1 (555) 234-9876' },
    lastVisit: { date: '2024-03-05', doctor: 'Dr. A. Mehta', reason: 'Hypertension Follow-up' }
  },
  {
    id: 'PT-2024-005',
    name: 'Aisha Kumar',
    age: 41,
    gender: 'F',
    mobile: '+1 (555) 876-5432',
    doctor: 'Dr. R. Kapoor',
    department: 'Neurology',
    visitType: 'OPD',
    regDate: '2024-03-10',
    status: 'Active',
    emergencyContact: { name: 'Rajesh Kumar', relationship: 'Brother', phone: '+1 (555) 654-3210' },
    lastVisit: { date: '2024-03-08', doctor: 'Dr. R. Kapoor', reason: 'Migraine Workup' }
  },
  {
    id: 'PT-2024-006',
    name: 'David Walsh',
    age: 38,
    gender: 'M',
    mobile: '+1 (555) 345-6780',
    doctor: 'Dr. P. Sharma',
    department: 'General Medicine',
    visitType: 'OPD',
    regDate: '2024-03-09',
    status: 'Inactive',
    emergencyContact: { name: 'Rachel Walsh', relationship: 'Spouse', phone: '+1 (555) 789-0123' },
    lastVisit: { date: '2023-11-14', doctor: 'Dr. P. Sharma', reason: 'Lower Back Pain Evaluation' }
  },
  {
    id: 'PT-2024-007',
    name: 'Lily Anderson',
    age: 55,
    gender: 'F',
    mobile: '+1 (555) 678-9012',
    doctor: 'Dr. S. Patel',
    department: 'Endocrinology',
    visitType: 'OPD',
    regDate: '2024-03-08',
    status: 'Active',
    emergencyContact: { name: 'Mark Anderson', relationship: 'Son', phone: '+1 (555) 890-1234' },
    lastVisit: { date: '2024-03-01', doctor: 'Dr. S. Patel', reason: 'Thyroid Hormone Lab Panel' }
  },
  {
    id: 'PT-2024-008',
    name: 'Marcus Brown',
    age: 71,
    gender: 'M',
    mobile: '+1 (555) 789-0123',
    doctor: 'Dr. A. Mehta',
    department: 'Cardiology',
    visitType: 'OPD',
    regDate: '2024-03-07',
    status: 'Inactive',
    emergencyContact: { name: 'Linda Brown', relationship: 'Wife', phone: '+1 (555) 901-2345' },
    lastVisit: { date: '2023-09-20', doctor: 'Dr. A. Mehta', reason: 'Post-Op Checkup' }
  }
]

const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

// --- Components ---
function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-[#0D47A1]', 'bg-[#009688]', 'bg-violet-600', 'bg-rose-500', 'bg-amber-600']
  const color = colors[name.charCodeAt(0) % colors.length]
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}>
      {initials}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const c = status === 'Active' ? { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-[#66BB6A]' }
    : status === 'Admitted' ? { bg: 'bg-blue-50', text: 'text-[#0D47A1]', dot: 'bg-[#0D47A1]' }
      : status === 'Inactive' ? { bg: 'bg-slate-100', text: 'text-[#64748B]', dot: 'bg-[#64748B]' }
        : { bg: 'bg-amber-50', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' } // Discharged
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}

export function RegisterPatientDrawer({
  isOpen,
  onClose,
  onSaveSuccess
}: {
  isOpen: boolean
  onClose: () => void
  onSaveSuccess?: (patient: Patient) => void
}) {
  const [formData, setFormData] = useState({
    patientId: 'PT-2024-009',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '' as 'Male' | 'Female' | 'Other' | '',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    emergencyName: '',
    emergencyNumber: '',
    relationship: 'Spouse',
    knownAllergies: '',
    existingConditions: '',
    assignedDoctor: 'Dr. A. Mehta',
    regDate: new Date().toISOString().split('T')[0],
    status: 'Active' as 'Active' | 'Inactive' | 'Admitted' | 'Discharged'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const validate = (data = formData) => {
    const errs: Record<string, string> = {}
    if (!data.firstName.trim()) errs.firstName = 'First name is required.'
    if (!data.lastName.trim()) errs.lastName = 'Last name is required.'
    if (!data.dob) errs.dob = 'Date of birth is required.'
    if (!data.gender) errs.gender = 'Gender selection is required.'
    if (!data.phone.trim()) errs.phone = 'Phone number is required.'
    else if (!/^[+\d\s()-]{7,15}$/.test(data.phone.trim())) errs.phone = 'Invalid phone number format.'
    if (!data.emergencyName.trim()) errs.emergencyName = 'Emergency contact name is required.'
    if (!data.emergencyNumber.trim()) errs.emergencyNumber = 'Emergency contact number is required.'
    if (!data.relationship) errs.relationship = 'Relationship is required.'
    return errs
  }

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    if (touched[field]) {
      setErrors(validate(updated))
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(validate())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = {
      firstName: true,
      lastName: true,
      dob: true,
      gender: true,
      phone: true,
      emergencyName: true,
      emergencyNumber: true,
      relationship: true
    }
    setTouched(allTouched)
    const errs = validate()
    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      return
    }

    // Auto calculate age from DOB
    let age = 30
    if (formData.dob) {
      const birth = new Date(formData.dob)
      const now = new Date()
      age = now.getFullYear() - birth.getFullYear()
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`
    const newPt: Patient = {
      id: formData.patientId || `PT-2024-00${Math.floor(Math.random() * 90 + 10)}`,
      name: fullName,
      age: age > 0 ? age : 30,
      gender: formData.gender === 'Female' ? 'F' : formData.gender === 'Male' ? 'M' : 'Other',
      mobile: formData.phone,
      doctor: formData.assignedDoctor,
      department: formData.assignedDoctor === 'Dr. A. Mehta' ? 'Cardiology'
        : formData.assignedDoctor === 'Dr. P. Sharma' ? 'General Medicine'
          : formData.assignedDoctor === 'Dr. S. Patel' ? 'Gynecology' : 'Neurology',
      visitType: 'OPD',
      regDate: formData.regDate,
      status: formData.status,
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.relationship,
        phone: formData.emergencyNumber
      },
      lastVisit: {
        date: formData.regDate,
        doctor: formData.assignedDoctor,
        reason: 'Initial OPD Intake & Patient Registration'
      }
    }

    setSuccessMessage(`Patient ${fullName} registered successfully! (ID: ${newPt.id})`)
    setTimeout(() => {
      setSuccessMessage(null)
      if (onSaveSuccess) onSaveSuccess(newPt)
      onClose()
    }, 1400)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

          {/* Header */}
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <UserPlus size={20} className="text-blue-100" />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight" style={{ fontFamily: PP }}>Register Patient</h2>
                <p className="text-xs text-blue-200" style={{ fontFamily: RB }}>Hospital Admin • Patient Management</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]/40" style={{ fontFamily: RB }} noValidate>

            {/* SUCCESS BANNER NOTIFICATION */}
            {successMessage && (
              <div className="bg-[#111827] text-white text-xs px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 border border-slate-700">
                <CheckCircle2 size={18} className="text-[#66BB6A] shrink-0" />
                <span className="font-medium flex-1">{successMessage}</span>
              </div>
            )}

            {/* SECTION 1: BASIC INFORMATION */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D47A1]" style={{ fontFamily: PP }}>
                  Basic Information
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">* Required fields</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Patient ID (Auto Generated) */}
                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Patient ID <span className="text-slate-400 font-normal">(Auto Generated)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.patientId}
                      readOnly
                      disabled
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl text-[#0D47A1] font-mono font-bold outline-none cursor-not-allowed"
                    />
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg font-semibold shrink-0">Auto Generated</span>
                  </div>
                </div>

                {/* First Name */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    placeholder="Enter first name"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-[#111827] outline-none transition-all ${touched.firstName && errors.firstName ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' : 'border-gray-200 focus:border-[#0D47A1]'
                      }`}
                  />
                  {touched.firstName && errors.firstName && (
                    <span className="text-[11px] text-[#EF4444] mt-1 block">{errors.firstName}</span>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Enter last name"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-[#111827] outline-none transition-all ${touched.lastName && errors.lastName ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' : 'border-gray-200 focus:border-[#0D47A1]'
                      }`}
                  />
                  {touched.lastName && errors.lastName && (
                    <span className="text-[11px] text-[#EF4444] mt-1 block">{errors.lastName}</span>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => handleChange('dob', e.target.value)}
                    onBlur={() => handleBlur('dob')}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-[#111827] outline-none transition-all ${touched.dob && errors.dob ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' : 'border-gray-200 focus:border-[#0D47A1]'
                      }`}
                  />
                  {touched.dob && errors.dob && (
                    <span className="text-[11px] text-[#EF4444] mt-1 block">{errors.dob}</span>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e => handleChange('gender', e.target.value)}
                    onBlur={() => handleBlur('gender')}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-[#111827] outline-none transition-all ${touched.gender && errors.gender ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' : 'border-gray-200 focus:border-[#0D47A1]'
                      }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {touched.gender && errors.gender && (
                    <span className="text-[11px] text-[#EF4444] mt-1 block">{errors.gender}</span>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="e.g. +1 (555) 234-5678"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-[#111827] outline-none transition-all ${touched.phone && errors.phone ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' : 'border-gray-200 focus:border-[#0D47A1]'
                      }`}
                  />
                  {touched.phone && errors.phone && (
                    <span className="text-[11px] text-[#EF4444] mt-1 block">{errors.phone}</span>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="e.g. patient@email.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Address</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={e => handleChange('address', e.target.value)}
                    placeholder="Enter street address, city, state, zip..."
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] resize-none"
                  />
                </div>

                {/* Emergency Contact Name */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Emergency Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={e => handleChange('emergencyName', e.target.value)}
                    onBlur={() => handleBlur('emergencyName')}
                    placeholder="e.g. David Mitchell"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-[#111827] outline-none transition-all ${touched.emergencyName && errors.emergencyName ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' : 'border-gray-200 focus:border-[#0D47A1]'
                      }`}
                  />
                  {touched.emergencyName && errors.emergencyName && (
                    <span className="text-[11px] text-[#EF4444] mt-1 block">{errors.emergencyName}</span>
                  )}
                </div>

                {/* Emergency Contact Number */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Emergency Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyNumber}
                    onChange={e => handleChange('emergencyNumber', e.target.value)}
                    onBlur={() => handleBlur('emergencyNumber')}
                    placeholder="e.g. +1 (555) 345-6789"
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-[#111827] outline-none transition-all ${touched.emergencyNumber && errors.emergencyNumber ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' : 'border-gray-200 focus:border-[#0D47A1]'
                      }`}
                  />
                  {touched.emergencyNumber && errors.emergencyNumber && (
                    <span className="text-[11px] text-[#EF4444] mt-1 block">{errors.emergencyNumber}</span>
                  )}
                </div>

                {/* Relationship */}
                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={e => handleChange('relationship', e.target.value)}
                    onBlur={() => handleBlur('relationship')}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-xl text-[#111827] outline-none transition-all ${touched.relationship && errors.relationship ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' : 'border-gray-200 focus:border-[#0D47A1]'
                      }`}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                  {touched.relationship && errors.relationship && (
                    <span className="text-[11px] text-[#EF4444] mt-1 block">{errors.relationship}</span>
                  )}
                </div>

              </div>
            </div>

            {/* SECTION 2: MEDICAL INFORMATION */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#009688]" style={{ fontFamily: PP }}>
                  Medical Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Known Allergies */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Known Allergies</label>
                  <input
                    type="text"
                    value={formData.knownAllergies}
                    onChange={e => handleChange('knownAllergies', e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts, Latex, None"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                  />
                </div>

                {/* Existing Medical Conditions */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Existing Medical Conditions</label>
                  <input
                    type="text"
                    value={formData.existingConditions}
                    onChange={e => handleChange('existingConditions', e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes, Asthma, None"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                  />
                </div>

                {/* Assigned Doctor */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Assigned Doctor</label>
                  <select
                    value={formData.assignedDoctor}
                    onChange={e => handleChange('assignedDoctor', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#009688]"
                  >
                    <option value="Dr. A. Mehta">Dr. A. Mehta (Cardiology)</option>
                    <option value="Dr. P. Sharma">Dr. P. Sharma (General Medicine)</option>
                    <option value="Dr. S. Patel">Dr. S. Patel (Gynecology)</option>
                    <option value="Dr. R. Kapoor">Dr. R. Kapoor (Neurology)</option>
                  </select>
                </div>

                {/* Registration Date (Auto) */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Registration Date <span className="text-slate-400 font-normal">(Auto)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.regDate}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl text-slate-500 outline-none cursor-not-allowed font-medium"
                  />
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>

              </div>
            </div>

            {/* BUTTONS FOOTER */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 rounded-xl bg-[#0D47A1] text-white font-bold text-xs hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <UserPlus size={16} /> Register Patient
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export function EditPatientInformationDrawer({
  isOpen,
  onClose,
  patient,
  onSaveSuccess
}: {
  isOpen: boolean
  onClose: () => void
  patient?: Patient | null
  onSaveSuccess?: (updatedPatient: Patient) => void
}) {
  const [formData, setFormData] = useState({
    firstName: patient?.name ? patient.name.split(' ')[0] : 'Sarah',
    lastName: patient?.name ? patient.name.split(' ').slice(1).join(' ') : 'Mitchell',
    dob: '1990-05-14',
    gender: (patient?.gender === 'M' ? 'Male' : patient?.gender === 'F' ? 'Female' : 'Other') as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    phone: patient?.mobile || '+1 (555) 234-5678',
    email: 'sarah.mitchell@example.com',
    address: '123 Healthcare Ave, NY 10001',
    emergencyName: patient?.emergencyContact?.name || 'David Mitchell',
    emergencyNumber: patient?.emergencyContact?.phone || '+1 (555) 345-6789',
    relationship: patient?.emergencyContact?.relationship || 'Spouse',
    patientCategory: 'General' as 'General' | 'Senior Citizen' | 'Corporate' | 'VIP' | 'Emergency'
  })

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`
    const updatedPt: Patient = {
      id: patient?.id || 'PT-2024-001',
      name: fullName,
      age: patient?.age || 34,
      gender: formData.gender === 'Female' ? 'F' : formData.gender === 'Male' ? 'M' : 'Other',
      mobile: formData.phone,
      doctor: patient?.doctor || 'Dr. A. Mehta',
      department: patient?.department || 'Cardiology',
      visitType: patient?.visitType || 'OPD',
      regDate: patient?.regDate || '2024-03-12',
      status: patient?.status || 'Active',
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.relationship,
        phone: formData.emergencyNumber
      },
      lastVisit: patient?.lastVisit
    }

    setSuccessMessage(`Patient demographic info for ${fullName} updated successfully!`)
    setTimeout(() => {
      setSuccessMessage(null)
      if (onSaveSuccess) onSaveSuccess(updatedPt)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Edit size={18} className="text-blue-100" />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight" style={{ fontFamily: PP }}>Edit Patient Information</h2>
                <p className="text-xs text-blue-200" style={{ fontFamily: RB }}>MRN: {patient?.id || 'PT-2024-001'} • Demographic &amp; Contact Update</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]/40" style={{ fontFamily: RB }}>
            
            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} className="text-[#66BB6A] shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Read-only Notice */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-[#0D47A1] flex items-start gap-2.5">
              <Info size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Demographic Update Boundary</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Allows editing demographic &amp; emergency details ONLY. Clinical records, consultations, prescriptions, and vitals are locked.
                </span>
              </div>
            </div>

            {/* Demographic Fields */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                Demographic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>
            </div>

            {/* Emergency Contact & Category */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                Emergency Contact &amp; Category
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.emergencyNumber}
                    onChange={e => setFormData({ ...formData, emergencyNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Patient Category</label>
                  <select
                    value={formData.patientCategory}
                    onChange={e => setFormData({ ...formData, patientCategory: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="General">General</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Corporate">Corporate</option>
                    <option value="VIP">VIP</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 rounded-xl bg-[#0D47A1] text-white font-bold text-xs hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export function PatientListScreen({
  onPatientSelect,
  onViewTimeline,
  onViewMedicalHistory,
  onViewAppointments,
  onGenerateBill
}: {
  onRegisterClick: () => void;
  onPatientSelect: (id: string) => void;
  onViewTimeline?: () => void;
  onViewMedicalHistory?: () => void;
  onViewAppointments?: () => void;
  onGenerateBill?: () => void;
}) {
  const [patientsList, setPatientsList] = useState<Patient[]>(MOCK_PATIENTS)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [drawerPatient, setDrawerPatient] = useState<Patient | null>(null)
  const [isRegisterDrawerOpen, setIsRegisterDrawerOpen] = useState(false)
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [doctorFilter, setDoctorFilter] = useState('All')
  const [regDateFilter, setRegDateFilter] = useState('All')

  // Filtered Patients computation
  const filteredPatients = patientsList.filter(p => {
    // Search matching: Patient ID, Patient Name, Phone Number
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch = !q || p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.mobile.toLowerCase().includes(q)

    const matchesGender = genderFilter === 'All' || p.gender === (genderFilter === 'Male' ? 'M' : genderFilter === 'Female' ? 'F' : 'Other')
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter
    const matchesDoctor = doctorFilter === 'All' || p.doctor === doctorFilter

    // Reg Date filter basic match
    let matchesRegDate = true
    if (regDateFilter === 'Today') {
      matchesRegDate = p.regDate === '2024-03-12'
    } else if (regDateFilter === 'This Month') {
      matchesRegDate = p.regDate.startsWith('2024-03')
    }

    return matchesSearch && matchesGender && matchesStatus && matchesDoctor && matchesRegDate
  })

  const hasActiveFilters = searchQuery !== '' || genderFilter !== 'All' || statusFilter !== 'All' || doctorFilter !== 'All' || regDateFilter !== 'All'

  const resetFilters = () => {
    setSearchQuery('')
    setGenderFilter('All')
    setStatusFilter('All')
    setDoctorFilter('All')
    setRegDateFilter('All')
  }

  const handleRegisterOpen = () => {
    setIsRegisterDrawerOpen(true)
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F1F5F9]">
      {/* Quick Patient Details Right Drawer */}
      <PatientQuickDetailsDrawer
        patient={drawerPatient}
        onClose={() => setDrawerPatient(null)}
        onPatientSelect={onPatientSelect}
        onViewTimeline={onViewTimeline}
      />

      {/* Reusable Register Patient Slide-Over Drawer */}
      <RegisterPatientDrawer
        isOpen={isRegisterDrawerOpen}
        onClose={() => setIsRegisterDrawerOpen(false)}
        onSaveSuccess={(newPt) => {
          setPatientsList([newPt, ...patientsList])
        }}
      />

      <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Management</h1>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
              <span>Hospital Admin</span>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="font-semibold text-[#111827]">Patient Management</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsLoading(!isLoading)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${isLoading ? 'bg-blue-50 border-[#0D47A1] text-[#0D47A1]' : 'border-[#E5E7EB] bg-white text-[#64748B] hover:bg-slate-50'}`}
              style={{ fontFamily: RB }}
              title="Toggle Skeleton Loading State"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Loading...' : 'Simulate Loading'}</span>
            </button>

            <button
              onClick={handleRegisterOpen}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Plus size={16} /> Register Patient
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm animate-pulse space-y-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200" />
                  <div className="w-1/2 h-3 bg-slate-200 rounded" />
                  <div className="w-2/3 h-6 bg-slate-200 rounded" />
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Total Patients Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider block" style={{ fontFamily: PP }}>Total Patients</span>
                  <div className="text-2xl font-bold text-[#111827] mt-1" style={{ fontFamily: PP }}>1,428</div>
                  <div className="flex items-center gap-1 text-[11px] text-[#66BB6A] font-semibold mt-1" style={{ fontFamily: RB }}>
                    <TrendingUp size={13} /> +8% from last month
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D47A1] flex items-center justify-center shrink-0">
                  <Users size={22} />
                </div>
              </div>

              {/* New Registrations Today */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider block" style={{ fontFamily: PP }}>New Registrations Today</span>
                  <div className="text-2xl font-bold text-[#111827] mt-1" style={{ fontFamily: PP }}>24</div>
                  <div className="flex items-center gap-1 text-[11px] text-[#009688] font-semibold mt-1" style={{ fontFamily: RB }}>
                    <UserPlus size={13} /> 6 pending check-in
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#009688] flex items-center justify-center shrink-0">
                  <UserPlus size={22} />
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider block" style={{ fontFamily: PP }}>Upcoming Appointments</span>
                  <div className="text-2xl font-bold text-[#111827] mt-1" style={{ fontFamily: PP }}>38</div>
                  <div className="flex items-center gap-1 text-[11px] text-purple-600 font-semibold mt-1" style={{ fontFamily: RB }}>
                    <Calendar size={13} /> 12 morning slots
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Calendar size={22} />
                </div>
              </div>

              {/* Inactive Patients */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider block" style={{ fontFamily: PP }}>Inactive Patients</span>
                  <div className="text-2xl font-bold text-[#111827] mt-1" style={{ fontFamily: PP }}>112</div>
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B] font-semibold mt-1" style={{ fontFamily: RB }}>
                    <Clock size={13} /> &gt; 6 months inactive
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#64748B] flex items-center justify-center shrink-0">
                  <UserX size={22} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">

            {/* Search Input (Search by Patient ID, Patient Name, Phone Number) */}
            <div className="relative flex-1 min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Patient ID, Patient Name, or Phone Number..."
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#F1F5F9]/60 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#64748B] outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                style={{ fontFamily: RB }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Filter Selectors */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">

              {/* Gender Filter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
                <span className="text-[#64748B]">Gender:</span>
                <select
                  value={genderFilter}
                  onChange={e => setGenderFilter(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
                >
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
                <span className="text-[#64748B]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

              {/* Assigned Doctor Filter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
                <span className="text-[#64748B]">Doctor:</span>
                <select
                  value={doctorFilter}
                  onChange={e => setDoctorFilter(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
                >
                  <option value="All">All Doctors</option>
                  <option value="Dr. A. Mehta">Dr. A. Mehta</option>
                  <option value="Dr. P. Sharma">Dr. P. Sharma</option>
                  <option value="Dr. S. Patel">Dr. S. Patel</option>
                  <option value="Dr. R. Kapoor">Dr. R. Kapoor</option>
                </select>
              </div>

              {/* Registration Date Filter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F1F5F9]/60 text-xs text-[#111827]">
                <span className="text-[#64748B]">Reg Date:</span>
                <select
                  value={regDateFilter}
                  onChange={e => setRegDateFilter(e.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-[#0D47A1]"
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1.5 text-xs text-[#EF4444] font-semibold hover:bg-red-50 rounded-xl transition-colors shrink-0"
                >
                  Clear Filters
                </button>
              )}
            </div>

          </div>
        </div>

        {/* MAIN TABLE & CONTENT WORKSPACE */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">

          {isLoading ? (
            /* SKELETON TABLE LOADING STATE */
            <div className="p-6 space-y-4 animate-pulse">
              <div className="h-10 bg-slate-100 rounded-xl w-full" />
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-slate-50 rounded-xl w-full flex items-center justify-between px-4">
                  <div className="w-20 h-4 bg-slate-200 rounded" />
                  <div className="w-32 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-4 bg-slate-200 rounded" />
                  <div className="w-28 h-4 bg-slate-200 rounded" />
                  <div className="w-24 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-6 bg-slate-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (

            /* EMPTY STATE */
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center mb-4 shadow-inner">
                <Users size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
                No patients found.
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mb-6" style={{ fontFamily: RB }}>
                We couldn't find any patient records matching your current search query or applied filters.
              </p>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Reset Search &amp; Filters
                  </button>
                )}
                <button
                  onClick={handleRegisterOpen}
                  className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Plus size={14} /> Register Patient
                </button>
              </div>
            </div>

          ) : (

            /* PATIENT TABLE */
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F1F5F9]/80 border-b border-[#E5E7EB]">
                    {['Patient ID', 'Patient Name', 'Age', 'Gender', 'Phone', 'Assigned Doctor', 'Registration Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: PP }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map(p => (
                    <tr
                      key={p.id}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer group ${selectedPatientId === p.id ? 'bg-blue-50/60' : ''}`}
                      onClick={() => { setSelectedPatientId(p.id); setDrawerPatient(p); }}
                    >
                      {/* 1. Patient ID */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{p.id}</span>
                      </td>

                      {/* 2. Patient Name */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.name} size="sm" />
                          <div>
                            <span className="text-xs font-bold text-[#111827] block" style={{ fontFamily: PP }}>{p.name}</span>
                            <span className="text-[11px] text-[#64748B] block">{p.visitType} Intake</span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Age */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">{p.age} Y</td>

                      {/* 4. Gender */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {p.gender === 'F' ? 'Female' : p.gender === 'M' ? 'Male' : 'Other'}
                      </td>

                      {/* 5. Phone */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-mono">{p.mobile}</td>

                      {/* 6. Assigned Doctor */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <UserCheck size={14} className="text-[#009688]" />
                          <span className="font-medium text-[#111827]">{p.doctor}</span>
                        </div>
                      </td>

                      {/* 7. Registration Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600">{p.regDate}</td>

                      {/* 8. Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={p.status} />
                      </td>

                      {/* 9. Actions (5 row actions menu) */}
                      <td className="px-4 py-3.5 whitespace-nowrap relative" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedPatientId(p.id); setDrawerPatient(p); }}
                            className="p-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Quick Drawer View"
                          >
                            <Eye size={15} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setActiveActionMenuId(activeActionMenuId === p.id ? null : p.id)}
                              className="p-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                              title="Row Actions"
                            >
                              <MoreVertical size={15} />
                            </button>

                            {/* Dropdown Action Menu */}
                            {activeActionMenuId === p.id && (
                              <div className="absolute right-0 top-8 z-30 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-150">
                                {/* 1. View Profile */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    onPatientSelect(p.id);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                >
                                  <User size={14} className="text-[#0D47A1]" /> View Profile
                                </button>

                                {/* 2. Edit Patient */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    setDrawerPatient(p);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                >
                                  <Edit size={14} className="text-slate-500" /> Edit Patient
                                </button>

                                {/* 3. View Medical History */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    if (onViewMedicalHistory) onViewMedicalHistory();
                                    else onPatientSelect(p.id);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                >
                                  <FileText size={14} className="text-[#009688]" /> View Medical History
                                </button>

                                {/* 4. View Appointments */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    if (onViewAppointments) onViewAppointments();
                                    else if (onViewTimeline) onViewTimeline();
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0D47A1] flex items-center gap-2 font-medium transition-colors"
                                >
                                  <Calendar size={14} className="text-purple-600" /> View Appointments
                                </button>

                                {/* 5. Generate Bill */}
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    if (onGenerateBill) onGenerateBill();
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-[#66BB6A]/10 hover:text-[#66BB6A] flex items-center gap-2 font-medium transition-colors border-t border-gray-100 mt-1 pt-2"
                                >
                                  <Receipt size={14} className="text-amber-600" /> Generate Bill
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

          {/* TABLE FOOTER / PAGINATION */}
          {!isLoading && filteredPatients.length > 0 && (
            <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2 text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                <span>Showing</span>
                <span className="font-semibold text-[#111827]">{filteredPatients.length}</span>
                <span>of</span>
                <span className="font-semibold text-[#111827]">{patientsList.length}</span>
                <span>patients</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50 rounded-lg font-medium transition-colors" disabled>Previous</button>
                <button className="w-7 h-7 flex items-center justify-center bg-[#0D47A1] text-white rounded-lg text-xs font-semibold">1</button>
                <button className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">Next</button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}



export function RegisterPatientScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBack} className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Register Patient</h1>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 pl-8" style={{ fontFamily: RB }}>
            <span>Dashboard</span>
            <ChevronRight size={14} className="text-slate-300" />
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Patients</button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Register Patient</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <form className="p-6 md:p-8 space-y-8" onSubmit={e => e.preventDefault()}>

            {/* 1. Personal Information */}
            <section>
              <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Patient ID <span className="text-red-500">*</span></label>
                  <input type="text" value="PT-2024-006" disabled className="w-full px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-500 font-mono outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter full name" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Age</label>
                  <input type="number" placeholder="Auto-calculated" className="w-full px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none placeholder:text-slate-400" readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Blood Group</label>
                    <select className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                      <option value="">Select</option>
                      <option>A+</option><option>A-</option>
                      <option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option>
                      <option>AB+</option><option>AB-</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Contact Information */}
            <section>
              <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" placeholder="patient@example.com" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Residential Address</label>
                  <textarea rows={2} placeholder="Full address" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400 resize-none" />
                </div>
              </div>
            </section>

            {/* 3. Emergency Contact */}
            <section>
              <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Contact Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Full name" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                  <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Relationship <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                    <option value="">Select</option>
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Child</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 4. Medical Information */}
              <section>
                <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Medical Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Allergies</label>
                    <input type="text" placeholder="e.g. Penicillin, Peanuts (comma separated)" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Existing Medical Conditions</label>
                    <textarea rows={3} placeholder="e.g. Hypertension, Diabetes" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all placeholder:text-slate-400 resize-none" />
                  </div>
                </div>
              </section>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button type="button" onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="reset" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Reset
              </button>
              <button type="button" className="px-5 py-2.5 rounded-xl border border-[#0D47A1] text-sm font-medium text-[#0D47A1] hover:bg-blue-50 transition-colors">
                Save & Continue
              </button>
              <button type="button" onClick={onBack} className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-sm font-medium hover:bg-[#0c3d8a] transition-colors shadow-sm">
                Save Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function EditPatientScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBack} className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Edit Patient</h1>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 pl-8" style={{ fontFamily: RB }}>
            <span>Dashboard</span>
            <ChevronRight size={14} className="text-slate-300" />
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Patients</button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Edit Patient</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <form className="p-6 md:p-8 space-y-8" onSubmit={e => e.preventDefault()}>

            {/* 1. Personal Information */}
            <section>
              <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Patient ID <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="PT-2024-006" disabled className="w-full px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-500 font-mono outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="Sarah Mitchell" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" defaultValue="1990-05-14" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Age</label>
                  <input type="number" defaultValue={34} className="w-full px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none" readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                    <select defaultValue="Female" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Blood Group</label>
                    <select defaultValue="A+" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                      <option value="">Select</option>
                      <option>A+</option><option>A-</option>
                      <option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option>
                      <option>AB+</option><option>AB-</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Contact Information */}
            <section>
              <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" defaultValue="+1 (555) 234-5678" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" defaultValue="sarah.mitchell@example.com" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Residential Address</label>
                  <textarea rows={2} defaultValue="123 Maple Street, Apt 4B, New York, NY 10001" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all resize-none" />
                </div>
              </div>
            </section>

            {/* 3. Emergency Contact */}
            <section>
              <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Contact Name <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="John Mitchell" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                  <input type="tel" defaultValue="+1 (555) 987-6543" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Relationship <span className="text-red-500">*</span></label>
                  <select defaultValue="Spouse" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all">
                    <option value="">Select</option>
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Child</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 4. Medical Information */}
              <section>
                <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>Medical Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Allergies</label>
                    <input type="text" defaultValue="Penicillin, Aspirin" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Existing Medical Conditions</label>
                    <textarea rows={3} defaultValue="Mild Hypertension" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition-all resize-none" />
                  </div>
                </div>
              </section>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button type="reset" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Reset Changes
              </button>
              <button type="button" onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={onBack} className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-sm font-medium hover:bg-[#0c3d8a] transition-colors shadow-sm">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// --- Patient Profile Drawers ---

function ProfileBookApptDrawer({ isOpen, onClose, patientName, onSuccess }: { isOpen: boolean; onClose: () => void; patientName: string; onSuccess: (msg: string) => void }) {
  const [doctor, setDoctor] = useState('Dr. A. Mehta')
  const [date, setDate] = useState('2024-03-15')
  const [slot, setSlot] = useState('10:30 AM')
  const [type, setType] = useState('OPD Consultation')

  if (!isOpen) return null

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess(`Appointment booked with ${doctor} for ${patientName} on ${date} at ${slot}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-blue-100" />
              <h2 className="text-base font-bold" style={{ fontFamily: PP }}>Book Appointment Drawer</h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"><X size={20} /></button>
          </div>
          <form onSubmit={handleBook} className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F1F5F9]/30 text-xs" style={{ fontFamily: RB }}>
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Patient</label>
                <input type="text" value={patientName} readOnly disabled className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-slate-600 font-semibold" />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Assigned Doctor</label>
                <select value={doctor} onChange={e => setDoctor(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1]">
                  <option>Dr. A. Mehta (Cardiology)</option>
                  <option>Dr. P. Sharma (General Medicine)</option>
                  <option>Dr. S. Patel (Gynecology)</option>
                  <option>Dr. R. Kapoor (Neurology)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1]" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Time Slot</label>
                  <select value={slot} onChange={e => setSlot(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1]">
                    <option>09:30 AM</option>
                    <option>10:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:15 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Visit Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1]">
                  <option>OPD Consultation</option>
                  <option>Follow-up Visit</option>
                  <option>Routine Checkup</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-700 font-semibold hover:bg-slate-50">Cancel</button>
              <button type="submit" className="flex-[2] py-2.5 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-[#0c3d8a] shadow-sm">Confirm Booking</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function ProfileApptDetailsDrawer({ appt, onClose, onAction }: { appt: any | null; onClose: () => void; onAction: (msg: string) => void }) {
  if (!appt) return null
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-blue-100" />
              <h2 className="text-base font-bold" style={{ fontFamily: PP }}>Appointment Details Drawer</h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"><X size={20} /></button>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F1F5F9]/30 text-xs" style={{ fontFamily: RB }}>
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">{appt.id}</span>
                <StatusBadge status={appt.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Doctor</span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">{appt.doctor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Department</span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">{appt.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date &amp; Time</span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">{appt.date} • {appt.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Visit Type</span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">{appt.type}</span>
                </div>
              </div>
              {appt.notes && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-slate-400 block text-[11px] mb-1">Clinical Notes</span>
                  <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-gray-100">{appt.notes}</p>
                </div>
              )}
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => { onAction(`Reschedule request initiated for appointment ${appt.id}`); onClose(); }}
                className="w-full py-2.5 rounded-xl border border-[#0D47A1] text-[#0D47A1] bg-blue-50/50 hover:bg-blue-50 font-semibold"
              >
                Reschedule Appointment
              </button>
              <button
                onClick={() => { onAction(`Appointment ${appt.id} has been cancelled.`); onClose(); }}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 font-semibold"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileInvoiceDrawer({ invoice, onClose, onPay }: { invoice: any | null; onClose: () => void; onPay: (msg: string) => void }) {
  if (!invoice) return null
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Receipt size={18} className="text-blue-100" />
              <h2 className="text-base font-bold" style={{ fontFamily: PP }}>Invoice Drawer</h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"><X size={20} /></button>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F1F5F9]/30 text-xs" style={{ fontFamily: RB }}>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0D47A1]">{invoice.id}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Issued: {invoice.date}</span>
                </div>
                <StatusBadge status={invoice.status} />
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider">Itemized Line Items</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#111827]">{invoice.description}</div>
                    <div className="text-[11px] text-slate-500">Consultation &amp; Diagnostics Intake</div>
                  </div>
                  <span className="font-bold text-[#111827] text-sm">${invoice.amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-[#111827]">
                <span>Total Amount Due</span>
                <span className="text-red-600">${invoice.amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              {invoice.status !== 'Paid' && (
                <button
                  onClick={() => { onPay(`Payment of $${invoice.amount.toFixed(2)} for ${invoice.id} processed successfully!`); onClose(); }}
                  className="w-full py-3 rounded-xl bg-[#66BB6A] hover:bg-green-600 text-white font-bold shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  Pay Invoice Now
                </button>
              )}
              <button
                onClick={() => { onPay(`Downloading Invoice ${invoice.id}.pdf...`); onClose(); }}
                className="w-full py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                Download PDF Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileDocDrawer({ doc, onClose, onDownload }: { doc: any | null; onClose: () => void; onDownload: (msg: string) => void }) {
  if (!doc) return null
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-blue-100" />
              <h2 className="text-base font-bold" style={{ fontFamily: PP }}>Document Preview Drawer</h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"><X size={20} /></button>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F1F5F9]/30 text-xs" style={{ fontFamily: RB }}>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold shrink-0">
                  PDF
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] text-sm">{doc.title}</h3>
                  <span className="text-[11px] text-slate-500">{doc.category} • {doc.date}</span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>File Size:</span>
                  <span className="font-semibold text-[#111827]">{doc.size || '1.2 MB'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Issuing Doctor / Staff:</span>
                  <span className="font-semibold text-[#111827]">{doc.doctor || 'Dr. A. Mehta'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Security Status:</span>
                  <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">Verified Record</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-gray-200 text-center text-slate-500 py-8">
                <FileText size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="font-medium text-xs">Document Preview Ready</p>
                <p className="text-[11px] text-slate-400 mt-1">Official electronic healthcare document copy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-700 font-semibold hover:bg-slate-50">Close</button>
              <button
                onClick={() => { onDownload(`Downloading ${doc.title}...`); onClose(); }}
                className="flex-[2] py-2.5 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-[#0c3d8a] shadow-sm flex items-center justify-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileVisitDetailsDrawer({ visit, onClose, onPrint }: { visit: any | null; onClose: () => void; onPrint: (msg: string) => void }) {
  if (!visit) return null
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Stethoscope size={18} className="text-blue-100" />
              <div>
                <h2 className="text-base font-bold leading-tight" style={{ fontFamily: PP }}>Visit Summary Details</h2>
                <span className="text-[11px] text-blue-100 font-mono">{visit.id}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"><X size={20} /></button>
          </div>

          <div className="flex-1 p-6 space-y-5 overflow-y-auto bg-[#F1F5F9]/30 text-xs" style={{ fontFamily: RB }}>

            {/* Visit & Doctor Info */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>Visit &amp; Doctor Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Visit Date &amp; Time</span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">{visit.date} • {visit.time || '09:45 AM'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Attending Doctor</span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">{visit.doctor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Department / Clinic</span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">{visit.department} (OPD Wing A)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Visit Type</span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">OPD Consultation</span>
                </div>
              </div>
            </div>

            {/* Symptoms & Diagnosis */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-[#009688] uppercase tracking-wider" style={{ fontFamily: PP }}>Symptoms &amp; Diagnosis</h3>
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Chief Complaints / Symptoms</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-gray-100">{visit.chiefComplaint || 'Patient presented with headache and elevated blood pressure readings.'}</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <span className="text-slate-400 block text-[11px] mb-1">Clinical Diagnosis</span>
                <span className="font-bold text-[#111827] text-sm block">{visit.diagnosis}</span>
              </div>
            </div>

            {/* Treatment Notes & Prescriptions */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider" style={{ fontFamily: PP }}>Treatment &amp; Prescription Summary</h3>
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Treatment Notes</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-gray-100">{visit.treatmentSummary}</p>
              </div>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Prescription Status</span>
                <span className="px-2.5 py-0.5 rounded-md font-semibold text-green-700 bg-green-50 border border-green-100 text-[11px]">{visit.rxStatus || 'Issued (Rx-2024-089)'}</span>
              </div>
            </div>

            {/* Billing Summary & Documents */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider" style={{ fontFamily: PP }}>Billing &amp; Visit Documents</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Billing Invoice</span>
                  <span className="font-semibold text-[#111827]">Invoice #INV-10245 ($125.00)</span>
                </div>
                <StatusBadge status={visit.billingStatus || 'Paid'} />
              </div>
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <span className="text-slate-400 block text-[11px]">Associated Documents</span>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-gray-100 text-[#0D47A1] font-semibold">
                  <FileText size={14} /> Consultation_Summary_{visit.id}.pdf (1.4 MB)
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-700 font-semibold hover:bg-slate-50">Close</button>
              <button
                onClick={() => { onPrint(`Printing Visit Summary for ${visit.id}...`); }}
                className="flex-[2] py-2.5 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-[#0c3d8a] shadow-sm flex items-center justify-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} /> Print Visit Summary
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export function PatientProfileScreen({
  onBack,
  onEdit,
  role = 'admin',
  onStartConsultation,
  onRecordVitals,
  onCheckIn,
}: {
  onBack: () => void
  onEdit?: () => void
  onViewTimeline?: () => void
  role?: 'super-admin' | 'admin' | 'receptionist' | 'doctor' | 'nurse' | string
  onStartConsultation?: () => void
  onRecordVitals?: () => void
  onCheckIn?: () => void
  patientData?: any
}) {
  const [activeTab, setActiveTab] = useState<string>('overview')

  // Slide-over Drawers State
  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false)
  const [isRegisterDrawerOpen, setIsRegisterDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null)
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null)
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false)

  // Visit History Filters State
  const [visitSearch, setVisitSearch] = useState('')
  const [visitDoctorFilter, setVisitDoctorFilter] = useState('All Doctors')
  const [visitDeptFilter, setVisitDeptFilter] = useState('All Departments')
  const [visitDateFilter, setVisitDateFilter] = useState('All Time')

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Dynamic Tabs by Role
  const getTabsForRole = (r: string) => {
    if (r === 'receptionist') {
      return [
        { id: 'overview', label: 'Overview' },
        { id: 'appointments', label: 'Appointments' },
        { id: 'visit-history', label: 'Visit History' },
        { id: 'documents', label: 'Documents' },
      ]
    }
    if (r === 'doctor') {
      return [
        { id: 'overview', label: 'Overview' },
        { id: 'visit-history', label: 'Visit History' },
        { id: 'medical-history', label: 'Medical History' },
        { id: 'prescriptions', label: 'Prescriptions' },
        { id: 'consultation-notes', label: 'Consultation Notes' },
        { id: 'documents', label: 'Documents' },
      ]
    }
    if (r === 'nurse') {
      return [
        { id: 'overview', label: 'Overview' },
        { id: 'visit-history', label: 'Visit History' },
        { id: 'medical-history', label: 'Medical History' },
        { id: 'current-prescription', label: 'Current Prescription' },
      ]
    }
    // Hospital Admin / Super Admin (Default)
    return [
      { id: 'overview', label: 'Overview' },
      { id: 'appointments', label: 'Appointments' },
      { id: 'medical-history', label: 'Medical History' },
      { id: 'visit-history', label: 'Visit History' },
      { id: 'prescriptions', label: 'Prescriptions' },
      { id: 'billing-payments', label: 'Billing & Payments' },
      { id: 'documents', label: 'Documents' },
      { id: 'activity-timeline', label: 'Activity Timeline' },
    ]
  }

  const tabs = getTabsForRole(role)

  const timeline = [
    { time: 'Today, 09:15 AM', event: 'Checked in — OPD Wing A', user: 'Reception', dept: 'Front Desk' },
    { time: 'Today, 09:20 AM', event: 'Vitals recorded (BP: 138/88, Temp: 98.6°F)', user: 'Nurse R. Singh', dept: 'Triage' },
    { time: 'Today, 09:45 AM', event: 'Consultation started with Dr. A. Mehta', user: 'Dr. A. Mehta', dept: 'Cardiology' },
    { time: 'Yesterday, 02:30 PM', event: 'Follow-up appointment booked online', user: 'System Auto', dept: 'Portal' },
    { time: 'Feb 14, 2024, 11:00 AM', event: 'Invoice #INV-10189 cleared ($220.00)', user: 'Billing Dept', dept: 'Accounts' }
  ]

  // Mock Data for Tabs
  const mockAppointments = [
    { id: 'APT-1024', doctor: 'Dr. A. Mehta', department: 'Cardiology', date: 'March 15, 2024', time: '10:30 AM', type: 'Follow-up Visit', status: 'Scheduled', notes: 'Routine hypertension review and ECG assessment.' },
    { id: 'APT-1018', doctor: 'Dr. P. Sharma', department: 'General Medicine', date: 'March 28, 2024', time: '02:00 PM', type: 'OPD Consultation', status: 'Scheduled', notes: 'Diabetes HbA1c review.' },
    { id: 'APT-0982', doctor: 'Dr. A. Mehta', department: 'Cardiology', date: 'March 12, 2024', time: '09:45 AM', type: 'OPD Consultation', status: 'Completed', notes: 'Initial chest pain intake completed.' },
  ]

  const mockVisits = [
    { id: 'VIS-2024-001', date: 'March 12, 2024', time: '09:45 AM', doctor: 'Dr. A. Mehta', department: 'Cardiology', diagnosis: 'Primary Essential Hypertension', treatmentSummary: 'Oral anti-hypertensive daily (Lisinopril 10mg)', rxStatus: 'Issued', billingStatus: 'Paid', chiefComplaint: 'Patient presented with headache and elevated BP readings.' },
    { id: 'VIS-2024-002', date: 'February 10, 2024', time: '11:15 AM', doctor: 'Dr. P. Sharma', department: 'General Medicine', diagnosis: 'Type 2 Diabetes Mellitus', treatmentSummary: 'Dietary control & Metformin 500mg BD', rxStatus: 'Issued', billingStatus: 'Paid', chiefComplaint: 'Routine blood sugar checkup and fatigue.' },
    { id: 'VIS-2023-089', date: 'November 14, 2023', time: '02:30 PM', doctor: 'Dr. R. Kapoor', department: 'Neurology', diagnosis: 'Mild Bronchial Asthma', treatmentSummary: 'Inhaler PRN during seasonal exacerbation', rxStatus: 'Completed', billingStatus: 'Paid', chiefComplaint: 'Wheezing and chest tightness.' },
    { id: 'VIS-2023-045', date: 'August 05, 2023', time: '10:00 AM', doctor: 'Dr. S. Patel', department: 'Gynecology', diagnosis: 'Routine Health Screening', treatmentSummary: 'Normal vitals, general wellness guidance', rxStatus: 'None', billingStatus: 'Paid', chiefComplaint: 'Annual physical checkup.' }
  ]

  const mockPrescriptions = [
    {
      id: 'Rx-2024-089', doctor: 'Dr. A. Mehta', date: 'March 12, 2024', status: 'Active', meds: [
        { name: 'Lisinopril 10mg', dosage: '1 Tab OD (Morning)', duration: '30 Days', instructions: 'Take after food' },
        { name: 'Atorvastatin 20mg', dosage: '1 Tab HS (Night)', duration: '30 Days', instructions: 'Take at bedtime' }
      ]
    },
    {
      id: 'Rx-2024-042', doctor: 'Dr. P. Sharma', date: 'February 10, 2024', status: 'Completed', meds: [
        { name: 'Metformin 500mg', dosage: '1 Tab BD (Morning/Night)', duration: '60 Days', instructions: 'Take with meals' }
      ]
    }
  ]

  const mockInvoices = [
    { id: 'INV-10245', date: 'March 12, 2024', description: 'OPD Cardiology Consultation & ECG Fee', amount: 125.00, status: 'Unpaid', dueDate: 'March 17, 2024' },
    { id: 'INV-10189', date: 'February 10, 2024', description: 'General Consultation & Lab Profile Fee', amount: 220.00, status: 'Paid', dueDate: 'February 15, 2024' }
  ]

  const mockDocuments = [
    { id: 'DOC-001', title: 'Prescription PDF — Mar 12, 2024', category: 'Prescription PDF', date: 'March 12, 2024', doctor: 'Dr. A. Mehta', size: '1.2 MB' },
    { id: 'DOC-002', title: 'Cardiology Consultation Summary', category: 'Consultation Summary', date: 'March 12, 2024', doctor: 'Dr. A. Mehta', size: '2.4 MB' },
    { id: 'DOC-003', title: 'Medical Fitness Certificate', category: 'Medical Certificate', date: 'February 10, 2024', doctor: 'Dr. P. Sharma', size: '850 KB' },
    { id: 'DOC-004', title: 'Patient Registration & Intake Form', category: 'Registration Documents', date: 'March 12, 2024', doctor: 'Front Desk', size: '1.8 MB' }
  ]

  const filteredVisits = mockVisits.filter(v => {
    const matchesSearch = !visitSearch ||
      v.id.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.doctor.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.department.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.diagnosis.toLowerCase().includes(visitSearch.toLowerCase());
    const matchesDoctor = visitDoctorFilter === 'All Doctors' || v.doctor === visitDoctorFilter;
    const matchesDept = visitDeptFilter === 'All Departments' || v.department === visitDeptFilter;
    return matchesSearch && matchesDoctor && matchesDept;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">

      {/* Toast Feedback Notification Banner */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 border border-slate-700" style={{ fontFamily: RB }}>
          <CheckCircle2 size={16} className="text-[#66BB6A] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* DRAWERS */}
      <ProfileBookApptDrawer isOpen={isBookDrawerOpen} onClose={() => setIsBookDrawerOpen(false)} patientName="Sarah Mitchell" onSuccess={triggerToast} />
      <RegisterPatientDrawer isOpen={isRegisterDrawerOpen} onClose={() => setIsRegisterDrawerOpen(false)} onSaveSuccess={() => triggerToast('New patient registered successfully.')} />
      <EditPatientInformationDrawer isOpen={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)} onSaveSuccess={() => triggerToast('Demographic information updated.')} />
      <ProfileApptDetailsDrawer appt={selectedAppt} onClose={() => setSelectedAppt(null)} onAction={triggerToast} />
      <ProfileInvoiceDrawer invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} onPay={triggerToast} />
      <ProfileDocDrawer doc={selectedDoc} onClose={() => setSelectedDoc(null)} onDownload={triggerToast} />
      <ProfileVisitDetailsDrawer visit={selectedVisit} onClose={() => setSelectedVisit(null)} onPrint={triggerToast} />

      <div className="w-full space-y-6">

        {/* Header & Breadcrumbs */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBack} className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Profile</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-8" style={{ fontFamily: RB }}>
            <span>{role === 'receptionist' ? 'Receptionist' : role === 'doctor' ? 'Doctor' : role === 'nurse' ? 'Nurse' : 'Hospital Admin'}</span>
            <ChevronRight size={13} className="text-slate-300" />
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Patient Management</button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-[#111827]">Sarah Mitchell</span>
          </div>
        </div>

        {/* Patient Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name="Sarah Mitchell" size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>Sarah Mitchell</h2>
                <span className="text-[10px] font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">PT-2024-001</span>
                <StatusBadge status="Active" />
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-1" style={{ fontFamily: RB }}>
                <span className="flex items-center gap-1.5 font-medium"><UserCheck size={14} className="text-slate-400" /> 34 Y / Female</span>
                <span className="flex items-center gap-1.5 font-medium"><Droplets size={14} className="text-red-500" /> Blood O+</span>
                <span className="flex items-center gap-1.5 font-medium"><Phone size={14} className="text-slate-400" /> +1 (555) 234-5678</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                <span>Reg: Mar 12, 2024</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1"><Stethoscope size={13} className="text-[#009688]" /> Dr. A. Mehta (Cardiology)</span>
              </div>
            </div>
          </div>

          {/* PATIENT-SPECIFIC TOOLBAR ACTIONS DYNAMIC BY ROLE */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Hospital Admin Actions */}
            {(role === 'admin' || role === 'super-admin') && (
              <>
                <button
                  onClick={() => (onEdit ? onEdit() : setIsEditDrawerOpen(true))}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Edit size={14} className="text-slate-500" /> Edit Patient Information
                </button>
                <button
                  onClick={() => setIsBookDrawerOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={14} /> Book Appointment
                </button>
                <button
                  onClick={() => setActiveTab('billing-payments')}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Receipt size={14} className="text-amber-600" /> View Billing
                </button>
                <button
                  onClick={() => triggerToast('Preparing patient profile print view...')}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Printer size={14} className="text-slate-500" /> Print Profile
                </button>
              </>
            )}

            {/* Receptionist Actions */}
            {role === 'receptionist' && (
              <>
                <button
                  onClick={() => setIsRegisterDrawerOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <UserPlus size={14} /> Register Patient
                </button>
                <button
                  onClick={() => setIsEditDrawerOpen(true)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Edit size={14} className="text-slate-500" /> Edit Demographics
                </button>
                <button
                  onClick={() => setIsBookDrawerOpen(true)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Calendar size={14} className="text-blue-600" /> Book Appointment
                </button>
                <button
                  onClick={() => {
                    triggerToast('OPD Check-in confirmed.')
                    if (onCheckIn) onCheckIn()
                  }}
                  className="px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-[#009688] text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5"
                >
                  <UserCheck size={14} /> Check-In
                </button>
                <button
                  onClick={() => triggerToast('Printing Patient Identity Card...')}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Printer size={14} className="text-slate-500" /> Print Patient Card
                </button>
              </>
            )}

            {/* Doctor Actions */}
            {role === 'doctor' && (
              <>
                <button
                  onClick={() => {
                    triggerToast('Starting OPD Consultation workspace...')
                    if (onStartConsultation) onStartConsultation()
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors shadow-sm flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Stethoscope size={14} /> Start Consultation
                </button>
                <button
                  onClick={() => setActiveTab('visit-history')}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Activity size={14} className="text-blue-600" /> View Consultation History
                </button>
                <button
                  onClick={() => setActiveTab('prescriptions')}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Pill size={14} className="text-teal-600" /> View Prescription
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <FileText size={14} className="text-slate-500" /> View Documents
                </button>
              </>
            )}

            {/* Nurse Actions */}
            {role === 'nurse' && (
              <>
                <button
                  onClick={() => {
                    triggerToast('Opening Vitals recording modal...')
                    if (onRecordVitals) onRecordVitals()
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#66BB6A] text-white text-xs font-bold hover:bg-green-600 transition-colors shadow-sm flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Activity size={14} /> Record Vitals
                </button>
                <button
                  onClick={() => setActiveTab('visit-history')}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Stethoscope size={14} className="text-teal-600" /> View Consultation
                </button>
                <button
                  onClick={() => setActiveTab('current-prescription')}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Pill size={14} className="text-emerald-600" /> View Current Prescription
                </button>
              </>
            )}

            {/* MORE ACTIONS DROPDOWN (Admin / Super Admin Only) */}
            {(role === 'admin' || role === 'super-admin') && (
              <div className="relative">
                <button
                  onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <MoreVertical size={16} />
                </button>
                {isMoreActionsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 p-1.5 text-xs animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => { triggerToast('Exporting medical record PDF...'); setIsMoreActionsOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                    >
                      <Download size={14} className="text-[#0D47A1]" /> Export Medical Record
                    </button>
                    <button
                      onClick={() => { triggerToast('SMS appointment reminder sent to patient.'); setIsMoreActionsOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                    >
                      <Phone size={14} className="text-[#009688]" /> Send SMS Reminder
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { triggerToast('Patient record archived.'); setIsMoreActionsOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                    >
                      <UserX size={14} className="text-red-500" /> Archive Patient
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Total Visits</div>
            <div className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>12</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Last Visit</div>
            <div className="text-xs font-bold text-[#111827] mt-1">Mar 12, 2024</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Upcoming</div>
            <div className="text-xs font-bold text-[#0D47A1] mt-1">Mar 15, 2024</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Active Scripts</div>
            <div className="text-xl font-bold text-[#009688]" style={{ fontFamily: PP }}>3</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Outstanding</div>
            <div className="text-xl font-bold text-red-600" style={{ fontFamily: PP }}>$125</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Allergies</div>
            <div className="text-xl font-bold text-amber-600" style={{ fontFamily: PP }}>3</div>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex overflow-x-auto gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === tab.id
                ? 'bg-[#0D47A1] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
              style={{ fontFamily: PP }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CENTER WORKSPACE CONTENT CONTAINER (Dynamic tab content) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[420px]" style={{ fontFamily: RB }}>

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Patient Information & Emergency Contact */}
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D47A1]" style={{ fontFamily: PP }}>
                    Patient Information &amp; Emergency Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Full Address</span>
                      <span className="font-semibold text-[#111827] mt-0.5 block">123 Healthcare Ave, NY 10001</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Email Address</span>
                      <span className="font-semibold text-[#111827] mt-0.5 block">sarah.m@example.com</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Emergency Contact Person</span>
                      <span className="font-semibold text-[#111827] mt-0.5 block">David Mitchell (Spouse)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Emergency Phone</span>
                      <span className="font-semibold text-[#111827] mt-0.5 block">+1 (555) 345-6789</span>
                    </div>
                  </div>
                </div>

                {/* Known Allergies & Conditions */}
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#009688]" style={{ fontFamily: PP }}>
                    Known Allergies &amp; Medical Conditions
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block font-medium mb-1.5">Known Allergies</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-1">
                          <AlertTriangle size={12} /> Penicillin (Severe)
                        </span>
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-1">
                          <AlertTriangle size={12} /> Peanuts (Moderate)
                        </span>
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-100">
                          Latex (Mild)
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block font-medium mb-1.5">Existing Medical Conditions</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-lg border border-blue-100">
                          Primary Hypertension
                        </span>
                        <span className="px-2.5 py-1 bg-teal-50 text-[#009688] text-xs font-semibold rounded-lg border border-teal-100">
                          Type 2 Diabetes
                        </span>
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-100">
                          Bronchial Asthma
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600" style={{ fontFamily: PP }}>Recent Appointments Summary</h3>
                    <button onClick={() => setActiveTab('appointments')} className="text-xs font-bold text-[#0D47A1] hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {mockAppointments.slice(0, 2).map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div>
                          <div className="font-bold text-[#111827] text-xs">{a.doctor}</div>
                          <div className="text-[11px] text-slate-500">{a.department} • {a.date}</div>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600" style={{ fontFamily: PP }}>Active Prescriptions Summary</h3>
                    <button onClick={() => setActiveTab('prescriptions')} className="text-xs font-bold text-[#0D47A1] hover:underline">View All</button>
                  </div>
                  <div className="space-y-2">
                    {mockPrescriptions[0].meds.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex items-center gap-2.5">
                          <Pill size={14} className="text-[#009688]" />
                          <div>
                            <div className="font-bold text-[#111827] text-xs">{m.name}</div>
                            <div className="text-[11px] text-slate-500">{m.dosage} • {m.duration}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Appointments</h3>
                  <p className="text-xs text-slate-500">Upcoming scheduled visits and historical appointment records.</p>
                </div>
                <button
                  onClick={() => setIsBookDrawerOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Plus size={14} /> Book Appointment
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500" style={{ fontFamily: PP }}>Upcoming Visits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockAppointments.filter(a => a.status === 'Scheduled').map(a => (
                    <div key={a.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">{a.id}</span>
                          <StatusBadge status={a.status} />
                        </div>
                        <div className="font-bold text-[#111827] text-xs">{a.doctor}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{a.department} • {a.date} at {a.time}</div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => setSelectedAppt(a)}
                          className="px-3 py-1.5 rounded-lg border border-[#0D47A1] text-[#0D47A1] bg-blue-50/50 hover:bg-blue-50 text-[11px] font-bold"
                        >
                          Details Drawer
                        </button>
                        <button
                          onClick={() => triggerToast(`Reschedule request initiated for ${a.id}`)}
                          className="px-3 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg text-center"
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-4" style={{ fontFamily: PP }}>Appointment History</h4>
                <div className="space-y-2">
                  {mockAppointments.filter(a => a.status === 'Completed').map(a => (
                    <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Calendar size={15} className="text-slate-400" />
                        <div>
                          <span className="font-bold text-[#111827]">{a.doctor}</span>
                          <span className="text-slate-500 ml-2">({a.department} • {a.date})</span>
                        </div>
                      </div>
                      <StatusBadge status="Completed" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. MEDICAL HISTORY TAB */}
          {activeTab === 'medical-history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Clinical Medical History</h3>
                  <p className="text-xs text-slate-500">Timeline of past diagnoses, treatments, and attending doctors.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100">
                      {['Visit Date', 'Diagnosis', 'ICD Code', 'Treatment Plan', 'Attending Doctor', 'Status'].map(h => (
                        <th key={h} className="px-3.5 py-3 font-bold text-slate-500 uppercase tracking-wider" style={{ fontFamily: PP }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-blue-50/30">
                      <td className="px-3.5 py-3 font-medium text-slate-700">March 12, 2024</td>
                      <td className="px-3.5 py-3 font-bold text-[#111827]">Primary Essential Hypertension</td>
                      <td className="px-3.5 py-3 font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">I10</td>
                      <td className="px-3.5 py-3 text-slate-600">Oral anti-hypertensive daily (Lisinopril 10mg)</td>
                      <td className="px-3.5 py-3 text-slate-700 font-medium">Dr. A. Mehta</td>
                      <td className="px-3.5 py-3"><StatusBadge status="Active" /></td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="px-3.5 py-3 font-medium text-slate-700">Feb 10, 2024</td>
                      <td className="px-3.5 py-3 font-bold text-[#111827]">Type 2 Diabetes Mellitus</td>
                      <td className="px-3.5 py-3 font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">E11.9</td>
                      <td className="px-3.5 py-3 text-slate-600">Dietary control &amp; Metformin 500mg BD</td>
                      <td className="px-3.5 py-3 text-slate-700 font-medium">Dr. P. Sharma</td>
                      <td className="px-3.5 py-3"><StatusBadge status="Active" /></td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="px-3.5 py-3 font-medium text-slate-700">Nov 14, 2023</td>
                      <td className="px-3.5 py-3 font-bold text-[#111827]">Mild Bronchial Asthma</td>
                      <td className="px-3.5 py-3 font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">J45.20</td>
                      <td className="px-3.5 py-3 text-slate-600">Inhaler PRN during seasonal exacerbation</td>
                      <td className="px-3.5 py-3 text-slate-700 font-medium">Dr. R. Kapoor</td>
                      <td className="px-3.5 py-3"><StatusBadge status="Discharged" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. VISIT HISTORY TAB (PHASE 1 CORE) */}
          {activeTab === 'visit-history' && (
            <div className="space-y-6">

              {/* Header & Filter Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Visit History</h3>
                  <p className="text-xs text-slate-500">Comprehensive log of outpatient consultations, diagnoses, and treatments.</p>
                </div>

                {/* SEARCH & FILTERS BAR */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Visit ID, Doctor..."
                      value={visitSearch}
                      onChange={e => setVisitSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0D47A1] focus:bg-white"
                    />
                  </div>
                  <select
                    value={visitDoctorFilter}
                    onChange={e => setVisitDoctorFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#0D47A1]"
                  >
                    <option>All Doctors</option>
                    <option>Dr. A. Mehta</option>
                    <option>Dr. P. Sharma</option>
                    <option>Dr. R. Kapoor</option>
                    <option>Dr. S. Patel</option>
                  </select>
                  <select
                    value={visitDeptFilter}
                    onChange={e => setVisitDeptFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#0D47A1]"
                  >
                    <option>All Departments</option>
                    <option>Cardiology</option>
                    <option>General Medicine</option>
                    <option>Neurology</option>
                    <option>Gynecology</option>
                  </select>
                  <select
                    value={visitDateFilter}
                    onChange={e => setVisitDateFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#0D47A1]"
                  >
                    <option>All Time</option>
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                  </select>
                </div>
              </div>

              {/* VISIT METRICS STRIP */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Logged Visits</span>
                    <span className="text-base font-bold text-[#0D47A1]">{mockVisits.length} Visits</span>
                  </div>
                  <Stethoscope size={18} className="text-[#0D47A1]" />
                </div>
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Active Treatments</span>
                    <span className="text-base font-bold text-[#009688]">2 Active</span>
                  </div>
                  <Pill size={18} className="text-[#009688]" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Last Visit Date</span>
                    <span className="text-xs font-bold text-[#111827]">March 12, 2024</span>
                  </div>
                  <Calendar size={18} className="text-slate-500" />
                </div>
              </div>

              {/* VISIT TABLE (9 EXACT COLUMNS) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200">
                      {['Visit Date', 'Visit ID', 'Doctor', 'Department', 'Diagnosis', 'Treatment Summary', 'Prescription Status', 'Billing Status', 'Actions'].map(h => (
                        <th key={h} className="px-3.5 py-3 font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: PP }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVisits.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          No visit records found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredVisits.map(v => (
                        <tr key={v.id} className="hover:bg-blue-50/30 transition-colors">
                          {/* 1. Visit Date */}
                          <td className="px-3.5 py-3 whitespace-nowrap font-medium text-slate-700">{v.date}</td>

                          {/* 2. Visit ID */}
                          <td className="px-3.5 py-3 whitespace-nowrap font-mono font-bold text-[#0D47A1]">
                            <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{v.id}</span>
                          </td>

                          {/* 3. Doctor */}
                          <td className="px-3.5 py-3 whitespace-nowrap font-semibold text-[#111827]">{v.doctor}</td>

                          {/* 4. Department */}
                          <td className="px-3.5 py-3 whitespace-nowrap text-slate-600">{v.department}</td>

                          {/* 5. Diagnosis */}
                          <td className="px-3.5 py-3 font-semibold text-[#111827]">{v.diagnosis}</td>

                          {/* 6. Treatment Summary */}
                          <td className="px-3.5 py-3 text-slate-600 max-w-xs truncate">{v.treatmentSummary}</td>

                          {/* 7. Prescription Status */}
                          <td className="px-3.5 py-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                              {v.rxStatus}
                            </span>
                          </td>

                          {/* 8. Billing Status */}
                          <td className="px-3.5 py-3 whitespace-nowrap">
                            <StatusBadge status={v.billingStatus} />
                          </td>

                          {/* 9. Actions */}
                          <td className="px-3.5 py-3 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedVisit(v)}
                              className="px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1"
                              style={{ fontFamily: PP }}
                            >
                              <Eye size={12} /> View Visit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* 5. PRESCRIPTIONS TAB */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescription List</h3>
                  <p className="text-xs text-slate-500">Issued medications, dosage schedules, and prescribing consultants.</p>
                </div>
              </div>

              <div className="space-y-4">
                {mockPrescriptions.map(rx => (
                  <div key={rx.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Pill size={16} className="text-[#009688]" />
                        <span className="font-mono text-xs font-bold text-[#0D47A1]">{rx.id}</span>
                        <span className="text-xs text-slate-500">• Prescribed by {rx.doctor} on {rx.date}</span>
                      </div>
                      <button
                        onClick={() => triggerToast(`Downloading prescription ${rx.id}.pdf...`)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Download size={13} /> Download PDF
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {rx.meds.map((m, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-gray-100 space-y-1">
                          <div className="font-bold text-[#111827]">{m.name}</div>
                          <div className="text-slate-600">Dosage: <span className="font-semibold text-slate-800">{m.dosage}</span></div>
                          <div className="text-slate-500 text-[11px]">Duration: {m.duration} • Instructions: {m.instructions}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. BILLING & PAYMENTS TAB */}
          {activeTab === 'billing-payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Billing &amp; Payments</h3>
                  <p className="text-xs text-slate-500">Itemized invoices, outstanding balances, and payment records.</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Total Outstanding Balance</span>
                  <span className="text-base font-bold text-red-600">$125.00</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500" style={{ fontFamily: PP }}>Invoices</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100">
                        {['Invoice #', 'Issue Date', 'Description', 'Amount', 'Due Date', 'Status', 'Action'].map(h => (
                          <th key={h} className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {mockInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-blue-50/30">
                          <td className="px-3 py-3 font-mono font-bold text-[#0D47A1]">{inv.id}</td>
                          <td className="px-3 py-3 text-slate-600">{inv.date}</td>
                          <td className="px-3 py-3 font-semibold text-[#111827]">{inv.description}</td>
                          <td className="px-3 py-3 font-bold text-[#111827]">${inv.amount.toFixed(2)}</td>
                          <td className="px-3 py-3 text-slate-500">{inv.dueDate}</td>
                          <td className="px-3 py-3"><StatusBadge status={inv.status} /></td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a]"
                            >
                              Invoice Drawer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-4" style={{ fontFamily: PP }}>Payment History</h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#111827]">Receipt #RCT-9082</div>
                    <div className="text-slate-500">Paid via Credit Card (Visa •••• 4242) on Feb 14, 2024</div>
                  </div>
                  <span className="font-bold text-[#66BB6A]">$350.00</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Documents</h3>
                  <p className="text-xs text-slate-500">Medical certificates, consultation summaries, and intake forms.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {mockDocuments.map(doc => (
                  <div key={doc.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold shrink-0">
                        PDF
                      </div>
                      <div>
                        <div className="font-bold text-[#111827] text-xs">{doc.title}</div>
                        <div className="text-[11px] text-slate-500">{doc.category} • {doc.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-1.5 rounded-lg border border-[#0D47A1] text-[#0D47A1] bg-blue-50/50 hover:bg-blue-50 text-[11px] font-bold"
                      >
                        Preview Drawer
                      </button>
                      <button
                        onClick={() => triggerToast(`Downloading ${doc.title}...`)}
                        className="p-1.5 text-slate-400 hover:text-[#0D47A1]"
                        title="Download PDF"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. ACTIVITY TIMELINE TAB */}
          {activeTab === 'activity-timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Activity Timeline</h3>
                  <p className="text-xs text-slate-500">Complete chronological audit trail of clinical and administrative events.</p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  5 Logged Events
                </span>
              </div>

              <div className="space-y-4">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-white transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold shrink-0">
                        <Activity size={15} />
                      </div>
                      {i < timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 my-2" />}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#111827] text-sm">{t.event}</span>
                        <span className="text-[11px] text-slate-400">{t.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <span className="font-medium text-slate-700">Staff / Actor: {t.user}</span>
                        <span>•</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-[10px] font-semibold text-slate-600">{t.dept}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}


export function MedicalHistoryScreen({ onBack }: { onBack: () => void }) {
  const historyData = [
    {
      id: 'VIS-2024-001',
      date: 'March 12, 2024',
      time: '10:30 AM',
      department: 'Cardiology',
      doctor: 'Dr. Arjun Mehta',
      diagnosis: 'Mild Hypertension, R/O Angina',
      notes: 'Patient reported occasional chest tightness after exertion. BP is elevated (145/92). Advised lifestyle changes and prescribed medication to manage blood pressure. Follow-up in 2 weeks.',
      prescriptions: ['Amlodipine 5mg OD', 'Atorvastatin 20mg HS'],
    },
    {
      id: 'VIS-2023-089',
      date: 'December 4, 2023',
      time: '02:15 PM',
      department: 'General Medicine',
      doctor: 'Dr. Priya Sharma',
      diagnosis: 'Acute Bronchitis',
      notes: 'Presenting with productive cough, mild fever, and fatigue for 4 days. Auscultation reveals bilateral rhonchi. Prescribed antibiotics and symptomatic relief.',
      prescriptions: ['Amoxicillin 500mg TDS', 'Paracetamol 500mg SOS', 'Cough Syrup 10ml BD'],
    },
    {
      id: 'VIS-2023-045',
      date: 'July 18, 2023',
      time: '11:00 AM',
      department: 'Cardiology',
      doctor: 'Dr. Arjun Mehta',
      diagnosis: 'Annual Cardiac Check-up',
      notes: 'Routine check-up. ECG normal. TMT negative for ischemia. Lipid profile shows borderline high LDL. Advised diet control and regular aerobic exercise.',
      prescriptions: ['Rosuvastatin 10mg OD (if diet control fails)'],
    }
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header & Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBack} className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Medical History</h1>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 pl-8" style={{ fontFamily: RB }}>
            <span>Dashboard</span>
            <ChevronRight size={14} className="text-slate-300" />
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Patients</button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Medical History</span>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search history..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <select className="w-full appearance-none pl-9 pr-8 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors">
                <option value="">All Dates</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last 1 Year</option>
              </select>
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative w-full md:w-auto">
              <select className="w-full appearance-none pl-9 pr-8 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors">
                <option value="">All Doctors</option>
                <option>Dr. Arjun Mehta</option>
                <option>Dr. Priya Sharma</option>
              </select>
              <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 md:pl-8 space-y-8 pb-8">
          {/* Vertical Line */}
          <div className="absolute top-4 bottom-0 left-[35px] md:left-[43px] w-px bg-gray-200 -z-10" />

          {historyData.map((visit) => (
            <div key={visit.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-6 md:-left-8 top-5 w-4 h-4 rounded-full bg-[#0D47A1] ring-4 ring-[#F1F5F9] shadow-sm" />

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Visit Header */}
                <div className="px-6 py-4 border-b border-gray-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#111827]">{visit.date}</span>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5"><Clock size={12} /> {visit.time}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden md:block" />
                    <div>
                      <div className="text-sm font-semibold text-[#0D47A1]">{visit.department}</div>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5"><Stethoscope size={12} /> {visit.doctor}</span>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-medium text-slate-400 bg-white px-2.5 py-1 rounded-md border border-gray-100 self-start md:self-auto">
                    {visit.id}
                  </div>
                </div>

                {/* Visit Content */}
                <div className="p-6 space-y-5">
                  {/* Diagnosis */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2" style={{ fontFamily: PP }}>
                      <Activity size={14} className="text-[#009688]" /> Diagnosis
                    </h4>
                    <div className="text-sm font-semibold text-[#111827] bg-[#009688]/10 text-[#009688] px-3 py-1.5 rounded-lg inline-block">
                      {visit.diagnosis}
                    </div>
                  </div>

                  {/* Doctor Notes */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2" style={{ fontFamily: PP }}>
                      <FileText size={14} className="text-[#0D47A1]" /> Clinical Notes
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-gray-100">
                      {visit.notes}
                    </p>
                  </div>

                  {/* Prescriptions */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2" style={{ fontFamily: PP }}>
                      <Pill size={14} className="text-[#9C27B0]" /> Prescriptions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {visit.prescriptions.map((med, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-slate-700 shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#9C27B0]" />
                          {med}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Patient Visit History Screen ──────────────────────────────────────────

export type VisitRecord = {
  id: string
  visitDate: string
  visitTime: string
  department: string
  doctor: string
  chiefComplaint: string
  diagnosis: string
  prescriptionIssued: boolean
  prescriptionCount: number
  prescriptions: string[]
  status: 'Completed' | 'Follow-up Required' | 'In Progress' | 'Cancelled'
  vitals: { bp: string; hr: string; temp: string; spo2: string }
  clinicalNotes: string
}

const MOCK_VISIT_HISTORY: VisitRecord[] = [
  {
    id: 'VIS-2024-001',
    visitDate: 'Mar 12, 2024',
    visitTime: '10:30 AM',
    department: 'Cardiology',
    doctor: 'Dr. Arjun Mehta',
    chiefComplaint: 'Chest tightness & exertion fatigue',
    diagnosis: 'Mild Hypertension, R/O Angina',
    prescriptionIssued: true,
    prescriptionCount: 2,
    prescriptions: ['Amlodipine 5mg - 1 Tab OD (Morning)', 'Atorvastatin 20mg - 1 Tab HS (Night)'],
    status: 'Completed',
    vitals: { bp: '145/92 mmHg', hr: '88 bpm', temp: '37.2 °C', spo2: '97%' },
    clinicalNotes: 'Patient reported occasional chest tightness after mild exertion. BP elevated at 145/92 mmHg. EKG shows normal sinus rhythm. Prescribed BP management regime and scheduled follow-up in 14 days.'
  },
  {
    id: 'VIS-2024-002',
    visitDate: 'Feb 28, 2024',
    visitTime: '02:15 PM',
    department: 'General Medicine',
    doctor: 'Dr. Priya Sharma',
    chiefComplaint: 'Productive cough, fever (4 days)',
    diagnosis: 'Acute Bronchitis',
    prescriptionIssued: true,
    prescriptionCount: 3,
    prescriptions: ['Amoxicillin 500mg - 1 Cap TDS (7 Days)', 'Paracetamol 500mg - 1 Tab SOS', 'Benadryl Cough Syrup - 10ml BD'],
    status: 'Completed',
    vitals: { bp: '122/80 mmHg', hr: '76 bpm', temp: '38.1 °C', spo2: '98%' },
    clinicalNotes: 'Presenting with productive cough, fever, and generalized fatigue for 4 days. Auscultation reveals bilateral rhonchi. Prescribed course of antibiotics and supportive therapy.'
  },
  {
    id: 'VIS-2024-003',
    visitDate: 'Jan 15, 2024',
    visitTime: '11:00 AM',
    department: 'Cardiology',
    doctor: 'Dr. Arjun Mehta',
    chiefComplaint: 'Routine annual cardiac review',
    diagnosis: 'Annual Cardiac Check-up',
    prescriptionIssued: true,
    prescriptionCount: 1,
    prescriptions: ['Rosuvastatin 10mg - 1 Tab HS'],
    status: 'Completed',
    vitals: { bp: '130/84 mmHg', hr: '72 bpm', temp: '36.8 °C', spo2: '99%' },
    clinicalNotes: 'Routine annual check-up. ECG normal. Treadmill test negative for inducible ischemia. Lipid profile shows borderline high LDL. Advised low-cholesterol diet and regular aerobic exercise.'
  },
  {
    id: 'VIS-2023-098',
    visitDate: 'Nov 20, 2023',
    visitTime: '09:45 AM',
    department: 'Neurology',
    doctor: 'Dr. Rajesh Kapoor',
    chiefComplaint: 'Occasional tension headaches',
    diagnosis: 'Tension Headache, Stress',
    prescriptionIssued: true,
    prescriptionCount: 2,
    prescriptions: ['Naproxen 250mg - 1 Tab SOS', 'Multivitamin B-Complex - 1 Cap OD'],
    status: 'Follow-up Required',
    vitals: { bp: '125/82 mmHg', hr: '78 bpm', temp: '36.9 °C', spo2: '98%' },
    clinicalNotes: 'Bilateral tight band-like headache reported during work stress. No focal neurological deficits. Advised stress management, hydration, and posture correction.'
  },
  {
    id: 'VIS-2023-074',
    visitDate: 'Aug 10, 2023',
    visitTime: '04:00 PM',
    department: 'Orthopedics',
    doctor: 'Dr. Sunita Patel',
    chiefComplaint: 'Right knee stiffness after prolonged sitting',
    diagnosis: 'Early Osteoarthritis Knee',
    prescriptionIssued: false,
    prescriptionCount: 0,
    prescriptions: [],
    status: 'Completed',
    vitals: { bp: '118/76 mmHg', hr: '70 bpm', temp: '36.7 °C', spo2: '99%' },
    clinicalNotes: 'Mild crepitus in right knee joint. Physical examination shows joint sensitivity. Referred to physiotherapy for quadriceps strengthening. No oral NSAIDs required at present.'
  }
]

export function PatientVisitHistoryScreen({ onBack, embedded = false }: { onBack?: () => void; embedded?: boolean }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Modals state
  const [summaryVisit, setSummaryVisit] = useState<VisitRecord | null>(null)
  const [prescriptionVisit, setPrescriptionVisit] = useState<VisitRecord | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Filtered visits
  const filteredVisits = MOCK_VISIT_HISTORY.filter(visit => {
    const matchesSearch =
      visit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDoctor = !doctorFilter || visit.doctor === doctorFilter
    const matchesDepartment = !departmentFilter || visit.department === departmentFilter
    const matchesStatus = !statusFilter || visit.status === statusFilter

    return matchesSearch && matchesDoctor && matchesDepartment && matchesStatus
  })

  return (
    <div className={`flex-1 overflow-y-auto ${embedded ? 'p-0' : 'p-6 bg-[#F1F5F9]'}`}>
      <div className="w-full space-y-6">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} className="text-[#66BB6A]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header & Breadcrumb (Only show full header when standalone) */}
        {!embedded && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {onBack && (
                  <button onClick={onBack} className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Visit History</h1>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 pl-8" style={{ fontFamily: RB }}>
                <span>Dashboard</span>
                <ChevronRight size={14} className="text-slate-300" />
                <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Patients</button>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="font-medium text-[#111827]">Visit History</span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('Visit history document printed successfully.')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Printer size={15} className="text-slate-500" />
                <span>Print</span>
              </button>
              <button
                onClick={() => showToast('Exporting visit history CSV... Download started.')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D47A1] text-white text-sm font-medium hover:bg-[#0c3d8a] transition-colors shadow-sm"
              >
                <Download size={15} />
                <span>Export Visit History</span>
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by Visit ID, Doctor, or Diagnosis..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl text-[#111827] placeholder-slate-400 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                style={{ fontFamily: RB }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Embedded Export & Print Controls if embedded */}
            {embedded && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => showToast('Visit history document printed successfully.')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Printer size={14} className="text-slate-500" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => showToast('Exporting visit history CSV... Download started.')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D47A1] text-white text-xs font-medium hover:bg-[#0c3d8a] transition-colors shadow-sm"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Selects */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors cursor-pointer"
              >
                <option value="">All Visit Dates</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last 1 Year</option>
              </select>
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Doctor Filter */}
            <div className="relative">
              <select
                value={doctorFilter}
                onChange={e => setDoctorFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors cursor-pointer"
              >
                <option value="">All Doctors</option>
                <option value="Dr. Arjun Mehta">Dr. Arjun Mehta</option>
                <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
                <option value="Dr. Rajesh Kapoor">Dr. Rajesh Kapoor</option>
                <option value="Dr. Sunita Patel">Dr. Sunita Patel</option>
              </select>
              <Stethoscope size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors cursor-pointer"
              >
                <option value="">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
              <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="In Progress">In Progress</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Visits Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ fontFamily: RB }}>
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 pl-6">Visit ID</th>
                  <th className="py-3.5 px-4">Visit Date</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Doctor</th>
                  <th className="py-3.5 px-4">Chief Complaint</th>
                  <th className="py-3.5 px-4">Diagnosis</th>
                  <th className="py-3.5 px-4">Rx Issued</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVisits.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No OPD visit records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="py-4 px-4 pl-6 font-mono text-xs font-semibold text-[#0D47A1]">
                        {visit.id}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#111827]">{visit.visitDate}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={11} /> {visit.visitTime}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                        {visit.department}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-[#111827] flex items-center gap-1.5">
                          <Stethoscope size={13} className="text-[#0D47A1]" />
                          {visit.doctor}
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-xs truncate text-slate-600 text-xs" title={visit.chiefComplaint}>
                        {visit.chiefComplaint}
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-50 text-[#009688] border border-teal-100 text-xs font-semibold truncate max-w-[180px]">
                          {visit.diagnosis}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {visit.prescriptionIssued ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            <Pill size={12} /> Yes ({visit.prescriptionCount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-slate-400 bg-slate-100">
                            No Rx
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={visit.status} />
                      </td>
                      <td className="py-4 px-4 pr-6 text-right whitespace-nowrap relative">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSummaryVisit(visit)}
                            title="View Consultation Summary"
                            className="p-1.5 rounded-lg border border-gray-200 bg-white text-slate-600 hover:text-[#0D47A1] hover:border-[#0D47A1] transition-colors"
                          >
                            <FileText size={14} />
                          </button>
                          {visit.prescriptionIssued && (
                            <button
                              onClick={() => setPrescriptionVisit(visit)}
                              title="View Prescription"
                              className="p-1.5 rounded-lg border border-gray-200 bg-white text-slate-600 hover:text-[#009688] hover:border-[#009688] transition-colors"
                            >
                              <Pill size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => showToast(`Printing Visit Summary for ${visit.id}...`)}
                            title="Print Visit Summary"
                            className="p-1.5 rounded-lg border border-gray-200 bg-white text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Printer size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-[#111827]">1</span> to <span className="font-semibold text-[#111827]">{filteredVisits.length}</span> of <span className="font-semibold text-[#111827]">{MOCK_VISIT_HISTORY.length}</span> visits
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#0D47A1] text-white font-semibold flex items-center justify-center shadow-sm">
                1
              </button>
              <button
                disabled
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Visits Timeline Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Recent Visits Timeline</h3>
              <p className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: RB }}>Chronological medical touchpoints for this patient</p>
            </div>
            <span className="text-xs font-semibold text-[#0D47A1] bg-blue-50 px-3 py-1 rounded-full">
              {MOCK_VISIT_HISTORY.length} Total Encounters
            </span>
          </div>

          <div className="relative pl-6 space-y-8">
            <div className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-gray-200" />
            {MOCK_VISIT_HISTORY.map((visit, index) => (
              <div key={visit.id} className="relative flex items-start gap-4 group">
                {/* Milestone Dot */}
                <div className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 ring-[#F1F5F9] ${index === 0 ? 'bg-[#0D47A1]' : 'bg-[#009688]'
                  }`} />

                <div className="flex-1 bg-slate-50/70 hover:bg-slate-50 p-4 rounded-xl border border-gray-100 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#111827]">{visit.visitDate}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {visit.visitTime}</span>
                      <span className="font-mono text-[10px] font-medium text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">{visit.id}</span>
                    </div>
                    <StatusBadge status={visit.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 mb-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">DOCTOR & DEPT</span>
                      <span className="font-semibold text-[#111827]">{visit.doctor}</span> ({visit.department})
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">CHIEF COMPLAINT</span>
                      <span className="font-medium text-slate-700">{visit.chiefComplaint}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">DIAGNOSIS</span>
                      <span className="font-semibold text-[#009688]">{visit.diagnosis}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                    {visit.clinicalNotes}
                  </p>

                  {/* Actions Bar */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {visit.prescriptionIssued && (
                        <span className="text-[11px] font-medium text-purple-700 flex items-center gap-1">
                          <Pill size={13} /> {visit.prescriptionCount} Medication(s) Prescribed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSummaryVisit(visit)}
                        className="text-xs font-semibold text-[#0D47A1] hover:underline"
                      >
                        View Summary
                      </button>
                      {visit.prescriptionIssued && (
                        <>
                          <span className="text-slate-300">•</span>
                          <button
                            onClick={() => setPrescriptionVisit(visit)}
                            className="text-xs font-semibold text-[#009688] hover:underline"
                          >
                            View Rx
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Modal: View Consultation Summary ── */}
      {summaryVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#009688] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} />
                <div>
                  <h3 className="text-base font-bold" style={{ fontFamily: PP }}>OPD Consultation Summary</h3>
                  <div className="text-xs text-teal-100">Visit Ref: {summaryVisit.id}</div>
                </div>
              </div>
              <button
                onClick={() => setSummaryVisit(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto" style={{ fontFamily: RB }}>
              {/* Visit Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-gray-100 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Date & Time</div>
                  <div className="font-bold text-[#111827] mt-0.5">{summaryVisit.visitDate}</div>
                  <div className="text-slate-500">{summaryVisit.visitTime}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Attending Doctor</div>
                  <div className="font-bold text-[#0D47A1] mt-0.5">{summaryVisit.doctor}</div>
                  <div className="text-slate-500">{summaryVisit.department}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Status</div>
                  <div className="mt-1"><StatusBadge status={summaryVisit.status} /></div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Patient</div>
                  <div className="font-bold text-[#111827] mt-0.5">Sarah Mitchell</div>
                  <div className="text-slate-500">PT-2024-006</div>
                </div>
              </div>

              {/* Vitals Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vitals Recorded</h4>
                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100">
                    <span className="text-slate-400 block text-[10px]">BLOOD PRESSURE</span>
                    <span className="font-bold text-[#111827]">{summaryVisit.vitals.bp}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100">
                    <span className="text-slate-400 block text-[10px]">HEART RATE</span>
                    <span className="font-bold text-[#111827]">{summaryVisit.vitals.hr}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100">
                    <span className="text-slate-400 block text-[10px]">TEMP</span>
                    <span className="font-bold text-[#111827]">{summaryVisit.vitals.temp}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100">
                    <span className="text-slate-400 block text-[10px]">SPO2</span>
                    <span className="font-bold text-[#111827]">{summaryVisit.vitals.spo2}</span>
                  </div>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Chief Complaint</h4>
                <div className="text-sm font-semibold text-[#111827] bg-slate-50 p-3 rounded-xl border border-gray-100">
                  {summaryVisit.chiefComplaint}
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Diagnosis</h4>
                <div className="text-sm font-bold text-[#009688] bg-teal-50 p-3 rounded-xl border border-teal-100">
                  {summaryVisit.diagnosis}
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Notes & Remarks</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                  {summaryVisit.clinicalNotes}
                </p>
              </div>

              {/* Prescriptions Brief */}
              {summaryVisit.prescriptionIssued && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prescribed Medications</h4>
                  <div className="space-y-1.5">
                    {summaryVisit.prescriptions.map((med: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-slate-800">
                        <Pill size={14} className="text-purple-600 shrink-0" />
                        <span>{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  showToast(`Printed Consultation Summary for ${summaryVisit.id}`)
                  setSummaryVisit(null)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Printer size={14} /> Print Summary
              </button>
              <button
                onClick={() => setSummaryVisit(null)}
                className="px-4 py-2 rounded-lg bg-[#0D47A1] text-white text-xs font-medium hover:bg-[#0c3d8a] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: View Prescription Details ── */}
      {prescriptionVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#009688] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Pill size={20} />
                <div>
                  <h3 className="text-base font-bold" style={{ fontFamily: PP }}>OPD Prescription</h3>
                  <div className="text-xs text-teal-100">Rx Ref: {prescriptionVisit.id}</div>
                </div>
              </div>
              <button
                onClick={() => setPrescriptionVisit(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5" style={{ fontFamily: RB }}>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 text-xs">
                <div>
                  <span className="text-slate-400 block">PATIENT</span>
                  <span className="font-bold text-[#111827]">Sarah Mitchell (PT-2024-006)</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">PRESCRIBING DOCTOR</span>
                  <span className="font-bold text-[#0D47A1]">{prescriptionVisit.doctor}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Prescribed Medications</h4>
                <div className="space-y-2.5">
                  {prescriptionVisit.prescriptions.map((med: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-purple-950">{med}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Take strictly after meals as advised.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800">
                <span className="font-bold">Instructions:</span> Finish prescribed course. Contact hospital helpline if adverse reactions occur.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  showToast(`Prescription printed for ${prescriptionVisit.id}`)
                  setPrescriptionVisit(null)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Printer size={14} /> Print Rx
              </button>
              <button
                onClick={() => setPrescriptionVisit(null)}
                className="px-4 py-2 rounded-lg bg-[#009688] text-white text-xs font-medium hover:bg-[#00796b] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


// ─── Patient Quick Details Drawer ──────────────────────────────────────────

export function PatientQuickDetailsDrawer({
  patient,
  onClose,
  onPatientSelect,
  onEdit,
}: {
  patient: Patient | null
  onClose: () => void
  onPatientSelect: (id: string) => void
  onEdit?: () => void
  onViewTimeline?: () => void
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  if (!patient) return null

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

          {/* Header */}
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar name={patient.name} size="md" />
              <div>
                <h2 className="text-base font-bold leading-tight" style={{ fontFamily: PP }}>{patient.name}</h2>
                <div className="flex items-center gap-2 text-xs text-blue-200 mt-0.5" style={{ fontFamily: RB }}>
                  <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">{patient.id}</span>
                  <span>• {patient.age} Y / {patient.gender === 'F' ? 'Female' : 'Male'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

            {/* Toast feedback */}
            {toastMsg && (
              <div className="bg-[#111827] text-white text-xs px-3.5 py-2.5 rounded-xl shadow flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#66BB6A]" />
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Section 1: Patient Summary */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: PP }}>
                  Patient Summary
                </span>
                <StatusBadge status={patient.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Phone</span>
                  <span className="font-semibold text-[#111827] flex items-center gap-1 mt-0.5">
                    <Phone size={12} className="text-slate-400" /> {patient.mobile}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Registration Date</span>
                  <span className="font-medium text-slate-700 mt-0.5 block">{patient.regDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">+1 (555) 987-6543</span>
                </div>
              </div>
            </div>

            {/* Section 2: Latest Appointment */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5" style={{ fontFamily: PP }}>
                  <Calendar size={14} className="text-[#0D47A1]" /> Latest Appointment
                </span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">OPD Slot</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#111827]">March 12, 2024 • 10:30 AM</div>
                  <div className="text-slate-500 mt-0.5">{patient.department} • Follow-up Consultation</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                  Completed
                </span>
              </div>
            </div>

            {/* Section 3: Assigned Doctor */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5" style={{ fontFamily: PP }}>
                  <Stethoscope size={14} className="text-[#009688]" /> Assigned Doctor
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-sm shrink-0">
                  Dr
                </div>
                <div className="text-xs flex-1">
                  <div className="font-bold text-[#111827]">{patient.doctor}</div>
                  <div className="text-slate-500">Senior Consultant • {patient.department} Wing</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Ext. 4082 • dr.mehta@hospital.org</div>
                </div>
              </div>
            </div>

            {/* Section 4: Outstanding Bills */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5" style={{ fontFamily: PP }}>
                  <Receipt size={14} className="text-red-500" /> Outstanding Bills
                </span>
                <span className="text-xs font-bold text-red-600">$125.00</span>
              </div>

              <div className="flex items-center justify-between text-xs bg-red-50/50 p-2.5 rounded-xl border border-red-100">
                <div>
                  <div className="font-semibold text-slate-800">OPD Consultation & ECG Fee</div>
                  <div className="text-[11px] text-slate-500">Inv #INV-10245 • Mar 12, 2024</div>
                </div>
                <span className="text-[10px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">Due in 5d</span>
              </div>
            </div>

            {/* Section 5: Recent Prescription */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5" style={{ fontFamily: PP }}>
                  <Pill size={14} className="text-purple-600" /> Recent Prescription
                </span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Rx-2024-089</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-between font-medium text-slate-700">
                  <span>Amlodipine 5mg</span>
                  <span className="text-[11px] text-slate-500">1 Tab OD (Morning)</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-between font-medium text-slate-700">
                  <span>Atorvastatin 20mg</span>
                  <span className="text-[11px] text-slate-500">1 Tab HS (Night)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Actions Footer */}
          <div className="p-4 bg-white border-t border-gray-100 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  if (onEdit) onEdit();
                  triggerToast(`Opening edit form for ${patient.name}`);
                }}
                className="py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Edit size={13} className="text-slate-500" /> Edit
              </button>
              <button
                onClick={() => triggerToast(`Appointment booking initiated for ${patient.name}`)}
                className="py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Calendar size={13} className="text-[#0D47A1]" /> Book Appt
              </button>
              <button
                onClick={() => triggerToast(`Generating bill invoice for ${patient.name}`)}
                className="py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Receipt size={13} className="text-amber-600" /> Gen Bill
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                style={{ fontFamily: PP }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onPatientSelect(patient.id);
                }}
                className="flex-[2] py-2.5 px-4 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Eye size={15} /> View Full Profile
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const TIMELINE_EVENTS = [
  { id: 1, event: 'Patient Registered', date: 'Oct 24, 2024', time: '09:00 AM', doctor: 'Reception', dept: 'Front Desk', status: 'Completed', color: 'text-[#0D47A1] bg-blue-50', icon: UserCheck },
  { id: 2, event: 'Appointment Booked', date: 'Oct 24, 2024', time: '09:15 AM', doctor: 'Dr. A. Mehta', dept: 'Cardiology', status: 'Completed', color: 'text-[#009688] bg-teal-50', icon: Calendar },
  { id: 3, event: 'Consultation Completed', date: 'Oct 25, 2024', time: '10:30 AM', doctor: 'Dr. A. Mehta', dept: 'Cardiology', status: 'Completed', color: 'text-[#4DB6AC] bg-teal-50', icon: Stethoscope },
  { id: 4, event: 'Prescription Issued', date: 'Oct 25, 2024', time: '10:45 AM', doctor: 'Dr. A. Mehta', dept: 'Pharmacy', status: 'Completed', color: 'text-violet-600 bg-violet-50', icon: Pill },
  { id: 5, event: 'Bill Generated', date: 'Oct 25, 2024', time: '11:00 AM', doctor: 'Billing Staff', dept: 'Billing', status: 'Pending', color: 'text-amber-600 bg-amber-50', icon: FileText },
  { id: 6, event: 'Payment Completed', date: 'Oct 25, 2024', time: '11:30 AM', doctor: 'Billing Staff', dept: 'Billing', status: 'Completed', color: 'text-[#66BB6A] bg-green-50', icon: Receipt },
]

function TimelineStatusBadge({ status }: { status: string }) {
  const isCompleted = status === 'Completed'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  )
}

export function PatientTimelineScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBack} className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Timeline</h1>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 pl-8" style={{ fontFamily: RB }}>
            <span>Dashboard</span>
            <ChevronRight size={14} className="text-slate-300" />
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Patients</button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Timeline</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search events..." className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors placeholder:text-slate-400" style={{ fontFamily: RB }} />
          </div>
          <div className="flex items-center gap-2">
            <input type="date" className="px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors" />
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-100" />

            <div className="space-y-8">
              {TIMELINE_EVENTS.map((event) => (
                <div key={event.id} className="relative flex items-start gap-6">
                  {/* Timeline Dot */}
                  <div className={`w-14 h-14 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 z-10 ${event.color}`}>
                    <event.icon size={22} />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>{event.event}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1" style={{ fontFamily: RB }}>
                          <span className="flex items-center gap-1"><Calendar size={14} /> {event.date}</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {event.time}</span>
                        </div>
                      </div>
                      <TimelineStatusBadge status={event.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50 mt-3">
                      <div>
                        <span className="block text-xs font-medium text-slate-400 mb-0.5 uppercase tracking-wide">Doctor/Staff</span>
                        <span className="text-sm font-medium text-[#111827]">{event.doctor}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-slate-400 mb-0.5 uppercase tracking-wide">Department</span>
                        <span className="text-sm font-medium text-[#111827]">{event.dept}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PATIENT APPOINTMENTS CENTER SCREEN ───────────────────────────────────

export type PatientAppointment = {
  id: string
  date: string
  time: string
  doctor: string
  specialty: string
  department: string
  visitType: 'In-Person OPD' | 'Follow-up OPD'
  status: 'Confirmed' | 'Scheduled' | 'In-Progress' | 'Completed' | 'Cancelled' | 'Pending'
  roomLocation: string
  reason: string
  notes: string
  consultationStatus: string
  prescriptionStatus: string
  billingStatus: string
  billingAmount: string
}

const INITIAL_PATIENT_APPOINTMENTS: PatientAppointment[] = [
  {
    id: 'APT-2025-001',
    date: '2025-03-15',
    time: '10:30 AM',
    doctor: 'Dr. Arjun Mehta',
    specialty: 'Senior Cardiologist',
    department: 'Cardiology',
    visitType: 'In-Person OPD',
    status: 'Confirmed',
    roomLocation: 'Wing A, OPD Room 204',
    reason: 'Follow-up for chest tightness and blood pressure monitoring',
    notes: 'Patient requested morning slot. Routine ECG pre-check scheduled.',
    consultationStatus: 'Scheduled',
    prescriptionStatus: 'Pending Consultation',
    billingStatus: 'Paid ($97.60)',
    billingAmount: '$97.60',
  },
  {
    id: 'APT-2025-002',
    date: '2025-03-22',
    time: '02:00 PM',
    doctor: 'Dr. Priya Sharma',
    specialty: 'Endocrinologist',
    department: 'General Medicine',
    visitType: 'Follow-up OPD',
    status: 'Scheduled',
    roomLocation: 'Wing A, OPD Room 202',
    reason: 'Diabetes HbA1c 3-month review and medication adjustment',
    notes: 'Please report to Reception 10 minutes prior to session.',
    consultationStatus: 'Scheduled',
    prescriptionStatus: 'N/A',
    billingStatus: 'Pending ($45.00)',
    billingAmount: '$45.00',
  },
  {
    id: 'APT-2025-003',
    date: '2025-03-28',
    time: '11:15 AM',
    doctor: 'Dr. Rajesh Kapoor',
    specialty: 'Neurologist',
    department: 'Neurology',
    visitType: 'In-Person OPD',
    status: 'Pending',
    roomLocation: 'Wing B, Room 108',
    reason: 'Migraine evaluation & EEG test review',
    notes: 'Awaiting hospital admin confirmation for doctor schedule.',
    consultationStatus: 'Pending',
    prescriptionStatus: 'N/A',
    billingStatus: 'Unpaid ($120.00)',
    billingAmount: '$120.00',
  },
  {
    id: 'APT-2025-004',
    date: '2025-03-12',
    time: '09:00 AM',
    doctor: 'Dr. Arjun Mehta',
    specialty: 'Senior Cardiologist',
    department: 'Cardiology',
    visitType: 'In-Person OPD',
    status: 'Completed',
    roomLocation: 'Wing A, OPD Room 204',
    reason: 'Chest pain evaluation',
    notes: 'ECG and lipid panel ordered. Prescribed Metoprolol 25mg.',
    consultationStatus: 'Completed',
    prescriptionStatus: 'Issued (Rx-8910)',
    billingStatus: 'Paid ($97.60)',
    billingAmount: '$97.60',
  },
  {
    id: 'APT-2025-005',
    date: '2025-02-20',
    time: '03:30 PM',
    doctor: 'Dr. Arjun Mehta',
    specialty: 'Senior Cardiologist',
    department: 'Cardiology',
    visitType: 'In-Person OPD',
    status: 'Completed',
    roomLocation: 'Wing A, OPD Room 204',
    reason: 'Routine cardiac checkup',
    notes: 'Normal cardiac rhythm observed. Stable progress.',
    consultationStatus: 'Completed',
    prescriptionStatus: 'Issued (Rx-8421)',
    billingStatus: 'Paid ($85.00)',
    billingAmount: '$85.00',
  },
  {
    id: 'APT-2025-006',
    date: '2025-01-18',
    time: '10:00 AM',
    doctor: 'Dr. Sunita Patel',
    specialty: 'Gynecologist',
    department: 'Gynecology',
    visitType: 'In-Person OPD',
    status: 'Cancelled',
    roomLocation: 'Wing C, Room 302',
    reason: 'Annual wellness exam',
    notes: 'Cancelled by patient due to emergency travel.',
    consultationStatus: 'Cancelled',
    prescriptionStatus: 'N/A',
    billingStatus: 'Refunded ($50.00)',
    billingAmount: '$0.00',
  },
]

// ─── PATIENT PORTAL: BOOK APPOINTMENT WORKSPACE ─────────────────────────────

export interface BookingDoctor {
  id: string
  name: string
  qualification: string
  specialization: string
  department: string
  experience: string
  consultationFee: string
  availability: string
  rating: string
  reviewCount: number
  avatar: string
  availableToday: boolean
}

export const MOCK_BOOKING_DOCTORS: BookingDoctor[] = [
  {
    id: 'DOC-1',
    name: 'Dr. Arjun Mehta',
    qualification: 'MD, DM (Cardiology), FACC',
    specialization: 'Senior Interventional Cardiologist',
    department: 'Cardiology',
    experience: '12+ Years Exp.',
    consultationFee: '$65.00',
    availability: 'Available Today (6 Slots)',
    rating: '4.9',
    reviewCount: 128,
    avatar: 'AM',
    availableToday: true,
  },
  {
    id: 'DOC-2',
    name: 'Dr. Priya Sharma',
    qualification: 'MD (General Medicine), DNB',
    specialization: 'Senior Physician & Diabetologist',
    department: 'General Medicine',
    experience: '9+ Years Exp.',
    consultationFee: '$50.00',
    availability: 'Available Today (8 Slots)',
    rating: '4.8',
    reviewCount: 94,
    avatar: 'PS',
    availableToday: true,
  },
  {
    id: 'DOC-3',
    name: 'Dr. Rajesh Kapoor',
    qualification: 'MD, DM (Neurology)',
    specialization: 'Consultant Neurologist',
    department: 'Neurology',
    experience: '15+ Years Exp.',
    consultationFee: '$80.00',
    availability: 'Available Tomorrow (4 Slots)',
    rating: '4.9',
    reviewCount: 156,
    avatar: 'RK',
    availableToday: false,
  },
  {
    id: 'DOC-4',
    name: 'Dr. Sunita Patel',
    qualification: 'MS (Obs & Gynae)',
    specialization: 'Senior Gynecologist & Obstetrician',
    department: 'Gynecology',
    experience: '10+ Years Exp.',
    consultationFee: '$60.00',
    availability: 'Available Today (5 Slots)',
    rating: '4.7',
    reviewCount: 82,
    avatar: 'SP',
    availableToday: true,
  },
  {
    id: 'DOC-5',
    name: 'Dr. Vikram Sen',
    qualification: 'MD (Pediatrics)',
    specialization: 'Consultant Pediatrician',
    department: 'Pediatrics',
    experience: '8+ Years Exp.',
    consultationFee: '$55.00',
    availability: 'Available Today (7 Slots)',
    rating: '4.9',
    reviewCount: 110,
    avatar: 'VS',
    availableToday: true,
  },
  {
    id: 'DOC-6',
    name: 'Dr. Ananya Roy',
    qualification: 'MS (Orthopedics)',
    specialization: 'Joint Replacement & Spine Surgeon',
    department: 'Orthopedics',
    experience: '11+ Years Exp.',
    consultationFee: '$75.00',
    availability: 'Available Today (4 Slots)',
    rating: '4.8',
    reviewCount: 75,
    avatar: 'AR',
    availableToday: true,
  },
]

export function PatientBookAppointmentScreen({
  onBack,
  onAppointmentBooked,
  onViewDetails
}: {
  onBack?: () => void
  onAppointmentBooked?: (newAppt: PatientAppointment) => void
  onViewDetails?: (appt: PatientAppointment) => void
}) {
  // Form State
  const [selectedDept, setSelectedDept] = useState('Cardiology')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties')
  const [selectedDoctorId, setSelectedDoctorId] = useState('DOC-1')
  const [selectedDate, setSelectedDate] = useState('2025-03-30')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:30 AM')
  const [visitType, setVisitType] = useState<'New Consultation' | 'Follow-up'>('New Consultation')
  const [chiefComplaint, setChiefComplaint] = useState('Mild chest tightness and fatigue after physical exertion for past 2 days.')
  const [additionalNotes, setAdditionalNotes] = useState('No known drug allergies. Currently taking daily multivitamins.')

  // Status & Success state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedAppt, setConfirmedAppt] = useState<PatientAppointment | null>(null)
  const [showSuccessView, setShowSuccessView] = useState(false)

  // Filtered Doctors by Department & Specialty
  const availableDoctors = MOCK_BOOKING_DOCTORS.filter(doc => {
    if (selectedDept !== 'All' && doc.department !== selectedDept) return false
    if (selectedSpecialty !== 'All Specialties' && doc.specialization !== selectedSpecialty) return false
    return true
  })

  // Selected Doctor Object
  const selectedDoctor = MOCK_BOOKING_DOCTORS.find(d => d.id === selectedDoctorId) || availableDoctors[0] || MOCK_BOOKING_DOCTORS[0]

  // Specialties mapping by department
  const departmentSpecialties: Record<string, string[]> = {
    'Cardiology': ['All Specialties', 'Senior Interventional Cardiologist', 'Cardiac Electrophysiology', 'Pediatric Cardiology'],
    'General Medicine': ['All Specialties', 'Senior Physician & Diabetologist', 'Internal Medicine', 'Endocrinology'],
    'Neurology': ['All Specialties', 'Consultant Neurologist', 'Neurovascular', 'Spine Neurology'],
    'Gynecology': ['All Specialties', 'Senior Gynecologist & Obstetrician', 'Maternal-Fetal Medicine', 'Gynae Oncology'],
    'Pediatrics': ['All Specialties', 'Consultant Pediatrician', 'Neonatology', 'Pediatric Cardiology'],
    'Orthopedics': ['All Specialties', 'Joint Replacement & Spine Surgeon', 'Sports Medicine', 'Spine Surgery'],
  }

  const currentSpecialties = departmentSpecialties[selectedDept] || ['All Specialties']

  // Calendar dates generator for March 2025
  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1
    const dateStr = `2025-03-${dayNum < 10 ? '0' + dayNum : dayNum}`
    const isToday = dayNum === 24
    const isAvailable = dayNum >= 24 && dayNum !== 27 && dayNum !== 28
    return {
      dayNum,
      dateStr,
      isToday,
      isAvailable,
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(i + 6) % 7]
    }
  })

  // Submit Handler
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const generatedId = `APT-2025-00${Math.floor(Math.random() * 90) + 10}`
      const newAppt: PatientAppointment = {
        id: generatedId,
        date: selectedDate,
        time: selectedTimeSlot,
        doctor: selectedDoctor ? selectedDoctor.name : 'Dr. Arjun Mehta',
        specialty: selectedDoctor ? selectedDoctor.specialization : 'Senior Cardiologist',
        department: selectedDept,
        visitType: visitType === 'New Consultation' ? 'In-Person OPD' : 'Follow-up OPD',
        status: 'Scheduled',
        roomLocation: selectedDept === 'Cardiology' ? 'Wing A, OPD Room 102' : 'Wing B, OPD Room 204',
        reason: chiefComplaint,
        notes: additionalNotes,
        consultationStatus: 'Scheduled',
        prescriptionStatus: 'Pending Consultation',
        billingStatus: `Pending (${selectedDoctor ? selectedDoctor.consultationFee : '$65.00'})`,
        billingAmount: selectedDoctor ? selectedDoctor.consultationFee : '$65.00',
      }

      setConfirmedAppt(newAppt)
      setIsSubmitting(false)
      setShowSuccessView(true)

      if (onAppointmentBooked) {
        onAppointmentBooked(newAppt)
      }
    }, 600)
  }

  // Success Confirmation View
  if (showSuccessView && confirmedAppt) {
    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Appointment Confirmation</h1>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1">
              <span>Patient Portal</span>
              <ChevronRight size={13} className="text-slate-400" />
              <span>Appointments</span>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="font-semibold text-[#111827]">Confirmation</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack()
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={15} /> Back to My Appointments
          </button>
        </div>

        {/* Confirmation Container Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
          
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#66BB6A] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
              Appointment Booked Successfully!
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Your OPD appointment has been registered with the Healthcare Operations Center.
            </p>
            <div className="inline-block mt-3 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full font-mono text-xs font-bold text-[#0D47A1]">
              Appointment ID: {confirmedAppt.id}
            </div>
          </div>

          {/* Details Summary Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-[#E5E7EB] text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D47A1] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {selectedDoctor ? selectedDoctor.avatar : 'AM'}
                </div>
                <div>
                  <h4 className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{confirmedAppt.doctor}</h4>
                  <p className="text-[11px] text-[#64748B]">{confirmedAppt.specialty} · {confirmedAppt.department}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1]">
                {confirmedAppt.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[#64748B] block text-[11px]">Appointment Date</span>
                <span className="font-semibold text-[#111827]">{confirmedAppt.date}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Time Slot</span>
                <span className="font-bold text-[#0D47A1]">{confirmedAppt.time}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Visit Type</span>
                <span className="font-medium text-slate-700">{confirmedAppt.visitType}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Hospital OPD Location</span>
                <span className="font-medium text-slate-700">{confirmedAppt.roomLocation}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Consultation Fee</span>
                <span className="font-bold text-[#009688]">{confirmedAppt.billingAmount} (OPD Counter)</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Chief Complaint</span>
                <span className="font-medium text-slate-700 truncate block">{confirmedAppt.reason}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onViewDetails) onViewDetails(confirmedAppt)
                else if (onBack) onBack()
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              View Appointment Details
            </button>
            <button
              type="button"
              onClick={() => {
                if (onBack) onBack()
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#64748B] text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Return to My Appointments
            </button>
          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Book Appointment</h1>
          <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            Choose a doctor, preferred date and available time slot.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-1.5">
            <span>Patient Portal</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span>Appointments</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="font-semibold text-[#111827]">Book Appointment</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack()
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={15} /> Cancel Booking
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN LAYOUT ── */}
      <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Workspace (8 Cols): 5 Form Sections */}
        <div className="lg:col-span-8 space-y-6">

          {/* ── SECTION 01: DEPARTMENT SELECTION ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Department Selection
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5" style={{ fontFamily: PP }}>
                  Select Department *
                </label>
                <select
                  value={selectedDept}
                  onChange={e => {
                    setSelectedDept(e.target.value)
                    setSelectedSpecialty('All Specialties')
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                >
                  <option value="Cardiology">Cardiology (Heart & Vascular)</option>
                  <option value="General Medicine">General Medicine (OPD)</option>
                  <option value="Neurology">Neurology (Brain & Spine)</option>
                  <option value="Gynecology">Gynecology & Obstetrics</option>
                  <option value="Pediatrics">Pediatrics (Child Care)</option>
                  <option value="Orthopedics">Orthopedics (Bones & Joints)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5" style={{ fontFamily: PP }}>
                  Filter Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={e => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                >
                  {currentSpecialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── SECTION 02: DOCTOR SELECTION ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Doctor Selection
                </h2>
              </div>
              <span className="text-xs text-[#64748B]">
                {availableDoctors.length} Doctors Available
              </span>
            </div>

            {availableDoctors.length === 0 ? (
              /* Empty State */
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <Stethoscope size={32} className="mx-auto text-slate-400" />
                <h4 className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>No doctors available</h4>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  No doctors available for the selected department or date. Please select another date or department.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDept('Cardiology')
                    setSelectedSpecialty('All Specialties')
                  }}
                  className="mt-2 text-xs font-bold text-[#0D47A1] hover:underline"
                >
                  Reset Department Selection
                </button>
              </div>
            ) : (
              /* Doctor Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDoctors.map(doc => {
                  const isSelected = selectedDoctorId === doc.id
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                        isSelected
                          ? 'border-[#0D47A1] bg-blue-50/40 shadow-sm ring-2 ring-[#0D47A1]/20'
                          : 'border-[#E5E7EB] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#0D47A1] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                          {doc.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="text-xs font-bold text-[#111827] truncate" style={{ fontFamily: PP }}>
                              {doc.name}
                            </h3>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                              <Star size={11} className="fill-amber-500 text-amber-500" /> {doc.rating} ({doc.reviewCount})
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] truncate">{doc.qualification}</p>
                          <p className="text-[11px] font-semibold text-[#0D47A1] truncate mt-0.5">{doc.specialization}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-[#64748B] block text-[10px]">Experience</span>
                          <span className="font-semibold text-slate-700">{doc.experience}</span>
                        </div>
                        <div>
                          <span className="text-[#64748B] block text-[10px]">Consultation Fee</span>
                          <span className="font-bold text-[#009688]">{doc.consultationFee}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          doc.availableToday ? 'bg-emerald-50 text-[#66BB6A]' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {doc.availability}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDoctorId(doc.id)
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-[#0D47A1] text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          style={{ fontFamily: PP }}
                        >
                          {isSelected ? '✓ Selected' : 'Select Doctor'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── SECTION 03: APPOINTMENT DATE ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Appointment Date
                </h2>
              </div>
              <span className="text-xs font-bold text-[#0D47A1]">March 2025</span>
            </div>

            {/* Reusable Calendar Component */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#0D47A1]" /> March 2025</span>
                <div className="flex items-center gap-1">
                  <button type="button" disabled className="p-1 text-slate-300 rounded hover:bg-slate-100"><ChevronLeft size={15} /></button>
                  <button type="button" className="p-1 text-slate-600 rounded hover:bg-slate-100"><ChevronRight size={15} /></button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#64748B] uppercase tracking-wider py-1 border-y border-slate-100">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.slice(0, 14).map(day => {
                  const isSelected = selectedDate === day.dateStr
                  return (
                    <button
                      key={day.dayNum}
                      type="button"
                      disabled={!day.isAvailable}
                      onClick={() => setSelectedDate(day.dateStr)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all flex flex-col items-center justify-center gap-0.5 min-h-[46px] ${
                        isSelected
                          ? 'bg-[#0D47A1] text-white shadow-sm font-bold ring-2 ring-[#0D47A1]/20'
                          : day.isAvailable
                          ? 'bg-slate-50 text-[#111827] hover:bg-blue-50 hover:text-[#0D47A1] border border-slate-200'
                          : 'bg-slate-100/60 text-slate-300 border border-slate-100 cursor-not-allowed line-through'
                      }`}
                    >
                      <span className="text-[10px] opacity-75">{day.dayName}</span>
                      <span>{day.dayNum}</span>
                      {day.isToday && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[#64748B] pt-2 px-1 flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-md bg-[#0D47A1]" /> Selected</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-md bg-[#009688]" /> Today</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-md bg-slate-50 border border-slate-200" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-md bg-slate-100 border border-slate-100" /> Unavailable</span>
              </div>
            </div>
          </div>

          {/* ── SECTION 04: AVAILABLE TIME SLOTS ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                  4
                </div>
                <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Available Time Slots
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#0D47A1] flex items-center gap-1">
                <Clock size={13} /> {selectedTimeSlot} Selected
              </span>
            </div>

            <div className="space-y-4">
              {/* Morning Slots */}
              <div>
                <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2" style={{ fontFamily: PP }}>
                  Morning
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { time: '09:00 AM', available: true },
                    { time: '09:30 AM', available: true },
                    { time: '10:00 AM', available: false },
                    { time: '10:30 AM', available: true },
                    { time: '11:00 AM', available: true },
                  ].map(slot => {
                    const isSelected = selectedTimeSlot === slot.time
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0D47A1] text-white shadow-sm ring-2 ring-[#0D47A1]/20'
                            : slot.available
                            ? 'bg-slate-50 text-[#111827] border border-[#E5E7EB] hover:bg-blue-50 hover:border-blue-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed line-through'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && <Check size={14} className="text-white" />}
                        {!slot.available && <span className="text-[9px] no-underline">Booked</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div>
                <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2" style={{ fontFamily: PP }}>
                  Afternoon
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { time: '02:00 PM', available: true },
                    { time: '02:30 PM', available: true },
                    { time: '03:00 PM', available: true },
                    { time: '03:30 PM', available: false },
                  ].map(slot => {
                    const isSelected = selectedTimeSlot === slot.time
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0D47A1] text-white shadow-sm ring-2 ring-[#0D47A1]/20'
                            : slot.available
                            ? 'bg-slate-50 text-[#111827] border border-[#E5E7EB] hover:bg-blue-50 hover:border-blue-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed line-through'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && <Check size={14} className="text-white" />}
                        {!slot.available && <span className="text-[9px] no-underline">Booked</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Evening Slots */}
              <div>
                <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2" style={{ fontFamily: PP }}>
                  Evening
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { time: '04:30 PM', available: true },
                    { time: '05:00 PM', available: true },
                    { time: '05:30 PM', available: true },
                  ].map(slot => {
                    const isSelected = selectedTimeSlot === slot.time
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0D47A1] text-white shadow-sm ring-2 ring-[#0D47A1]/20'
                            : slot.available
                            ? 'bg-slate-50 text-[#111827] border border-[#E5E7EB] hover:bg-blue-50 hover:border-blue-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed line-through'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && <Check size={14} className="text-white" />}
                        {!slot.available && <span className="text-[9px] no-underline">Booked</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ── SECTION 05: VISIT DETAILS ── */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs">
                5
              </div>
              <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Visit Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Visit Type */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>
                  Visit Type *
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setVisitType('New Consultation')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      visitType === 'New Consultation'
                        ? 'border-[#0D47A1] bg-blue-50 text-[#0D47A1] shadow-sm'
                        : 'border-[#E5E7EB] bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 size={15} /> New Consultation
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType('Follow-up')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      visitType === 'Follow-up'
                        ? 'border-[#0D47A1] bg-blue-50 text-[#0D47A1] shadow-sm'
                        : 'border-[#E5E7EB] bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Stethoscope size={15} /> Follow-up
                  </button>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
                  Chief Complaint *
                </label>
                <textarea
                  rows={3}
                  required
                  value={chiefComplaint}
                  onChange={e => setChiefComplaint(e.target.value)}
                  placeholder="Describe your symptoms, main health concern or reason for booking..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
                  Optional Notes
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Any ongoing medications, allergies, or special assistance required..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Panel (4 Cols): Selected Doctor, Summary, Important Info */}
        <div className="lg:col-span-4 space-y-4">

          {/* CARD 01: SELECTED DOCTOR */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
              <Stethoscope size={15} className="text-[#0D47A1]" /> Selected Doctor
            </h3>

            {selectedDoctor ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0D47A1] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                    {selectedDoctor.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{selectedDoctor.name}</h4>
                    <p className="text-[11px] text-[#64748B]">{selectedDoctor.qualification}</p>
                    <p className="text-[11px] font-semibold text-[#0D47A1] mt-0.5">{selectedDoctor.specialization}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-blue-100">
                  <div>
                    <span className="text-[#64748B] text-[10px] block">Department</span>
                    <span className="font-semibold text-slate-700">{selectedDoctor.department}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">Consultation Fee</span>
                    <span className="font-bold text-[#009688]">{selectedDoctor.consultationFee}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#64748B]">No doctor selected.</p>
            )}
          </div>

          {/* CARD 02: APPOINTMENT SUMMARY */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
              <FileText size={15} className="text-[#009688]" /> Appointment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#111827]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Department:</span>
                <span className="font-bold">{selectedDept}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Doctor:</span>
                <span className="font-bold text-[#0D47A1]">{selectedDoctor ? selectedDoctor.name : '-'}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Date:</span>
                <span className="font-semibold">{selectedDate}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Time:</span>
                <span className="font-bold text-[#0D47A1]">{selectedTimeSlot}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[#64748B]">Visit Type:</span>
                <span className="font-medium text-slate-700">{visitType}</span>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm font-bold">
                <span className="text-[#111827]" style={{ fontFamily: PP }}>Estimated Fee:</span>
                <span className="text-[#009688]" style={{ fontFamily: PP }}>
                  {selectedDoctor ? selectedDoctor.consultationFee : '$65.00'}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 03: IMPORTANT INFORMATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
              <Info size={15} className="text-[#F59E0B]" /> Important Information
            </h3>

            <ul className="space-y-2 text-xs text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0 mt-1.5" />
                <span>Arrive 15 minutes early</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0 mt-1.5" />
                <span>Bring previous prescriptions if applicable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0 mt-1.5" />
                <span>Carry a valid ID</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0 mt-1.5" />
                <span>Cancellation policy: Free cancellation up to 2 hours before schedule</span>
              </li>
            </ul>
          </div>

          {/* Sticky Actions Card / Footer */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
              style={{ fontFamily: PP }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> Confirm Appointment
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (onBack) onBack()
              }}
              className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>

      </form>

    </div>
  )
}

// ─── PATIENT PORTAL: CANCEL APPOINTMENT CONFIRMATION DIALOG ─────────────────────

export interface PatientCancelAppointmentDialogProps {
  appointment: PatientAppointment | null
  isOpen: boolean
  onClose: () => void
  onConfirmCancel: (id: string, reason: string, comments: string) => void
  onBookNewAppointment?: () => void
}

export function PatientCancelAppointmentDialog({
  appointment,
  isOpen,
  onClose,
  onConfirmCancel,
  onBookNewAppointment
}: PatientCancelAppointmentDialogProps) {
  const [reason, setReason] = useState('')
  const [comments, setComments] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  if (!isOpen || !appointment) return null

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) {
      setValidationError('Please select a cancellation reason.')
      return
    }
    setValidationError(null)
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessDialog(true)
      onConfirmCancel(appointment.id, reason, comments)
    }, 300)
  }

  const handleCloseAll = () => {
    setReason('')
    setComments('')
    setValidationError(null)
    setShowSuccessDialog(false)
    onClose()
  }

  // Success Dialog View
  if (showSuccessDialog) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 max-sm:items-end">
        <div className="w-full max-w-md bg-white rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100 p-6 space-y-5 text-center animate-in zoom-in-95 duration-200" style={{ fontFamily: RB }}>
          
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#66BB6A] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
              Appointment Cancelled Successfully
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Your appointment <span className="font-mono font-bold text-[#0D47A1]">{appointment.id}</span> has been cancelled.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Doctor:</span>
              <span className="font-semibold text-[#111827]">{appointment.doctor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Date & Time:</span>
              <span className="font-semibold text-[#111827]">{appointment.date} @ {appointment.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Reason:</span>
              <span className="font-medium text-red-600">{reason}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            {onBookNewAppointment && (
              <button
                type="button"
                onClick={() => {
                  handleCloseAll()
                  onBookNewAppointment()
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Book New Appointment
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseAll}
              className="w-full sm:flex-1 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Back to My Appointments
            </button>
          </div>

        </div>
      </div>
    )
  }

  // Confirmation Modal View
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 max-sm:items-end">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200" style={{ fontFamily: RB }}>
        
        {/* Header - Solid Danger Banner Theme matching Reschedule Appointment header style */}
        <div className="p-5 bg-[#EF4444] flex items-start gap-3.5 text-white shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: PP }}>
              Cancel Appointment
            </h2>
            <p className="text-xs text-red-50 mt-0.5">
              Are you sure you want to cancel this appointment?
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCancelSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[80vh] bg-slate-50/50">

          {/* Appointment Summary Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0D47A1]">{appointment.id}</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                appointment.status === 'Confirmed' ? 'bg-green-50 text-[#66BB6A]' : 'bg-blue-50 text-[#0D47A1]'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" /> {appointment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-[#64748B] text-[10px] block">Doctor Name</span>
                <span className="font-bold text-[#111827]">{appointment.doctor}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block">Department</span>
                <span className="font-semibold text-slate-700">{appointment.department}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block">Appointment Date</span>
                <span className="font-semibold text-[#111827]">{appointment.date}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block">Appointment Time</span>
                <span className="font-semibold text-[#0D47A1]">{appointment.time}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block">Visit Type</span>
                <span className="font-medium text-slate-600">{appointment.visitType}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Reason Select */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
              Cancellation Reason *
            </label>
            <select
              value={reason}
              onChange={e => {
                setReason(e.target.value)
                if (e.target.value) setValidationError(null)
              }}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-xl outline-none focus:border-[#0D47A1] transition-colors ${
                validationError ? 'border-red-500 bg-red-50/20' : 'border-[#E5E7EB]'
              }`}
            >
              <option value="">Select Cancellation Reason</option>
              <option value="Personal Reason">Personal Reason</option>
              <option value="Feeling Better">Feeling Better</option>
              <option value="Schedule Conflict">Schedule Conflict</option>
              <option value="Booked by Mistake">Booked by Mistake</option>
              <option value="Doctor Change Request">Doctor Change Request</option>
              <option value="Other">Other</option>
            </select>
            {validationError && (
              <p className="text-[11px] text-[#EF4444] font-semibold mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {validationError}
              </p>
            )}
          </div>

          {/* Optional Comments */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
              Additional Comments (Optional)
            </label>
            <textarea
              rows={2}
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Add additional comments (optional)"
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] transition-colors text-[#111827]"
            />
          </div>

          {/* Information Alert Card */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800" style={{ fontFamily: PP }}>
              <Info size={14} className="text-amber-600" /> Information Guidelines
            </div>
            <ul className="space-y-0.5 text-[11px] text-amber-800/90 pl-1">
              <li>• Cancelled appointments cannot be restored.</li>
              <li>• You can book another appointment anytime.</li>
              <li>• Hospital cancellation policy may apply.</li>
            </ul>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleCloseAll}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={13} className="animate-spin" /> Cancelling...
                </>
              ) : (
                <>
                  <XCircle size={14} /> Cancel Appointment
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

// ─── PATIENT PORTAL: RESCHEDULE APPOINTMENT DIALOG ─────────────────────────────

export interface PatientRescheduleAppointmentDialogProps {
  appointment: PatientAppointment | null
  isOpen: boolean
  onClose: () => void
  onConfirmReschedule: (id: string, newDate: string, newTime: string, reason: string, notes: string) => void
  onViewDetails?: (appt: PatientAppointment) => void
}

export function PatientRescheduleAppointmentDialog({
  appointment,
  isOpen,
  onClose,
  onConfirmReschedule,
  onViewDetails
}: PatientRescheduleAppointmentDialogProps) {
  const [selectedDate, setSelectedDate] = useState('2025-03-30')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:30 AM')
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  if (!isOpen || !appointment) return null

  // Mock available dates for March 2025
  const calendarDays = [
    { day: 23, isCurrentMonth: true, isAvailable: false, isToday: false, isCurrentAppt: false },
    { day: 24, isCurrentMonth: true, isAvailable: true, isToday: false, isCurrentAppt: false, fullDate: '2025-03-24' },
    { day: 25, isCurrentMonth: true, isAvailable: true, isToday: false, isCurrentAppt: false, fullDate: '2025-03-25' },
    { day: 26, isCurrentMonth: true, isAvailable: true, isToday: false, isCurrentAppt: false, fullDate: '2025-03-26' },
    { day: 27, isCurrentMonth: true, isAvailable: true, isToday: true, isCurrentAppt: true, fullDate: '2025-03-27' },
    { day: 28, isCurrentMonth: true, isAvailable: true, isToday: false, isCurrentAppt: false, fullDate: '2025-03-28' },
    { day: 29, isCurrentMonth: true, isAvailable: false, isToday: false, isCurrentAppt: false, fullDate: '2025-03-29' },
    { day: 30, isCurrentMonth: true, isAvailable: true, isToday: false, isCurrentAppt: false, fullDate: '2025-03-30' },
    { day: 31, isCurrentMonth: true, isAvailable: true, isToday: false, isCurrentAppt: false, fullDate: '2025-03-31' },
    { day: 1, isCurrentMonth: false, isAvailable: true, isToday: false, isCurrentAppt: false, fullDate: '2025-04-01' },
    { day: 2, isCurrentMonth: false, isAvailable: true, isToday: false, isCurrentAppt: false, fullDate: '2025-04-02' },
  ]

  const timeSlots = {
    morning: [
      { time: '09:00 AM', status: 'available' },
      { time: '09:30 AM', status: 'booked' },
      { time: '10:00 AM', status: 'available' },
      { time: '10:30 AM', status: 'available', isRecommended: true },
      { time: '11:00 AM', status: 'booked' },
      { time: '11:30 AM', status: 'available' },
    ],
    afternoon: [
      { time: '02:00 PM', status: 'available' },
      { time: '02:30 PM', status: 'available' },
      { time: '03:00 PM', status: 'booked' },
      { time: '03:30 PM', status: 'available' },
    ],
    evening: [
      { time: '04:30 PM', status: 'available' },
      { time: '05:00 PM', status: 'available' },
      { time: '05:30 PM', status: 'booked' },
    ]
  }

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) {
      setValidationError('Please select a new appointment date.')
      return
    }
    if (!selectedTimeSlot) {
      setValidationError('Please select a new time slot.')
      return
    }
    if (!rescheduleReason) {
      setValidationError('Please select a reason for rescheduling.')
      return
    }

    setValidationError(null)
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessDialog(true)
      onConfirmReschedule(appointment.id, selectedDate, selectedTimeSlot, rescheduleReason, additionalNotes)
    }, 400)
  }

  const handleCloseAll = () => {
    setRescheduleReason('')
    setAdditionalNotes('')
    setValidationError(null)
    setShowSuccessDialog(false)
    onClose()
  }

  // Success State View
  if (showSuccessDialog) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 max-sm:items-end">
        <div className="w-full max-w-md bg-white rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100 p-6 space-y-5 text-center animate-in zoom-in-95 duration-200" style={{ fontFamily: RB }}>
          
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#66BB6A] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
              Appointment Rescheduled Successfully
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Your appointment <span className="font-mono font-bold text-[#0D47A1]">{appointment.id}</span> has been updated successfully.
            </p>
          </div>

          {/* New Details Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-[#64748B]">Doctor & Dept:</span>
              <span className="font-bold text-[#111827]">{appointment.doctor} ({appointment.department})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">New Date:</span>
              <span className="font-bold text-[#0D47A1]">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">New Time:</span>
              <span className="font-bold text-[#009688]">{selectedTimeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Reason:</span>
              <span className="font-medium text-slate-700">{rescheduleReason}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                const updatedAppt = { ...appointment, date: selectedDate, time: selectedTimeSlot }
                handleCloseAll()
                if (onViewDetails) onViewDetails(updatedAppt)
              }}
              className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              View Appointment Details
            </button>
            <button
              type="button"
              onClick={handleCloseAll}
              className="w-full sm:flex-1 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              Back to My Appointments
            </button>
          </div>

        </div>
      </div>
    )
  }

  // Dialog Form View
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 max-sm:items-end">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200" style={{ fontFamily: RB }}>
        
        {/* Header - Teal Theme matching Image 2 */}
        <div className="p-5 bg-[#009688] flex items-start gap-3.5 text-white shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
            <Calendar size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: PP }}>
              Reschedule Appointment
            </h2>
            <p className="text-xs text-teal-50 mt-0.5">
              Choose a new appointment date and available time slot.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRescheduleSubmit} className="flex-1 overflow-y-auto p-5 bg-slate-50/40 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Main Section (8 cols) */}
            <div className="lg:col-span-8 space-y-5">

              {/* SECTION 01: Current Appointment Info Card */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: PP }}>
                    <Info size={14} className="text-[#009688]" /> Current Appointment Details
                  </span>
                  <span className="font-mono text-xs font-bold text-[#009688]">{appointment.id}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[#64748B] text-[10px] block">Doctor</span>
                    <span className="font-bold text-[#111827]">{appointment.doctor}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">Department</span>
                    <span className="font-semibold text-slate-700">{appointment.department}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">Current Date & Time</span>
                    <span className="font-semibold text-[#009688]">{appointment.date} @ {appointment.time}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 02: Select New Date (Calendar) */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Select New Date *
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#009688] font-bold">
                    <button type="button" className="p-1 hover:bg-slate-100 rounded-lg"><ChevronLeft size={16} /></button>
                    <span>March 2025</span>
                    <button type="button" className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight size={16} /></button>
                  </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-[#64748B] py-1">{d}</div>
                  ))}
                  {calendarDays.map((item, idx) => {
                    const isSelected = selectedDate === item.fullDate
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!item.isAvailable}
                        onClick={() => item.fullDate && setSelectedDate(item.fullDate)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-all relative ${
                          isSelected
                            ? 'bg-[#009688] text-white shadow-sm font-bold'
                            : item.isCurrentAppt
                            ? 'border-2 border-dashed border-[#009688] text-[#009688] font-bold bg-teal-50/50'
                            : item.isAvailable
                            ? 'hover:bg-slate-100 text-[#111827]'
                            : 'opacity-30 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {item.day}
                        {item.isToday && !isSelected && (
                          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#009688]" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* SECTION 03: Available Time Slots */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>
                  Available Time Slots * ({selectedDate})
                </h3>

                {/* Morning */}
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">Morning Slots</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.morning.map(s => {
                      const isSelected = selectedTimeSlot === s.time
                      const isBooked = s.status === 'booked'
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(s.time)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center relative ${
                            isSelected
                              ? 'bg-[#009688] text-white border-[#009688] shadow-sm font-bold'
                              : isBooked
                              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30'
                          }`}
                        >
                          {s.time}
                          {s.isRecommended && !isSelected && (
                            <span className="absolute -top-1.5 -right-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">Rec</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Afternoon */}
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">Afternoon Slots</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.afternoon.map(s => {
                      const isSelected = selectedTimeSlot === s.time
                      const isBooked = s.status === 'booked'
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(s.time)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            isSelected
                              ? 'bg-[#009688] text-white border-[#009688] shadow-sm font-bold'
                              : isBooked
                              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30'
                          }`}
                        >
                          {s.time}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Evening */}
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] block mb-1.5">Evening Slots</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.evening.map(s => {
                      const isSelected = selectedTimeSlot === s.time
                      const isBooked = s.status === 'booked'
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(s.time)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            isSelected
                              ? 'bg-[#009688] text-white border-[#009688] shadow-sm font-bold'
                              : isBooked
                              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-teal-300 hover:bg-teal-50/30'
                          }`}
                        >
                          {s.time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 04: Reason for Rescheduling */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
                    Reschedule Reason *
                  </label>
                  <select
                    value={rescheduleReason}
                    onChange={e => {
                      setRescheduleReason(e.target.value)
                      if (e.target.value) setValidationError(null)
                    }}
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl outline-none focus:border-[#009688] focus:bg-white transition-colors ${
                      validationError ? 'border-red-500 bg-red-50/20' : 'border-[#E5E7EB]'
                    }`}
                  >
                    <option value="">Select Reason</option>
                    <option value="Patient Request">Patient Request</option>
                    <option value="Personal Reason">Personal Reason</option>
                    <option value="Schedule Conflict">Schedule Conflict</option>
                    <option value="Doctor Requested">Doctor Requested</option>
                    <option value="Travel">Travel</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* SECTION 05: Additional Remarks */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
                    Additional Remarks <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={e => setAdditionalNotes(e.target.value)}
                    placeholder="Provide additional notes..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#009688] focus:bg-white transition-colors text-[#111827]"
                  />
                </div>
              </div>

            </div>

            {/* Right Summary Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-4">

              {/* UPDATED SCHEDULE PREVIEW CARD (Image 2 style) */}
              <div className="bg-[#E0F2F1]/60 border border-[#B2DFDB] p-4 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#B2DFDB] pb-2">
                  <h3 className="text-[11px] font-bold text-[#00796B] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    UPDATED SCHEDULE PREVIEW
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#B2DFDB] text-[#004D40]">
                    Scheduled
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#00796B] text-[10px] block font-medium">Patient</span>
                    <span className="font-bold text-[#111827]">Sarah Mitchell</span>
                  </div>

                  <div>
                    <span className="text-[#00796B] text-[10px] block font-medium">Doctor</span>
                    <span className="font-bold text-[#111827]">{appointment.doctor} ({appointment.department})</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#B2DFDB]/60">
                    <div>
                      <span className="text-[#00796B] text-[10px] block font-medium">New Date</span>
                      <span className="font-bold text-[#00796B]">{selectedDate}</span>
                    </div>
                    <div>
                      <span className="text-[#00796B] text-[10px] block font-medium">New Time Slot</span>
                      <span className="font-bold text-[#00796B]">{selectedTimeSlot}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* INFORMATION GUIDELINE ALERT CARD (Image 2 style) */}
              <div className="p-3.5 bg-[#E3F2FD]/80 border border-[#BBDEFB] rounded-2xl text-xs text-[#0D47A1] flex items-start gap-2 shadow-xs">
                <Info size={16} className="text-[#0D47A1] shrink-0 mt-0.5" />
                <span className="text-[11px] font-medium leading-relaxed">
                  The previous appointment slot will be released after confirming the new appointment schedule.
                </span>
              </div>

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <AlertCircle size={14} /> {validationError}
                </div>
              )}

            </div>

          </div>

          {/* Footer Actions (Image 2 style) */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 shrink-0 bg-white p-3 rounded-b-2xl">
            <button
              type="button"
              onClick={handleCloseAll}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796B] transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={13} className="animate-spin" /> Confirming...
                </>
              ) : (
                <>
                  Confirm Reschedule
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export function PatientAppointmentsScreen() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>(INITIAL_PATIENT_APPOINTMENTS)
  const [viewMode, setViewMode] = useState<'list' | 'book'>('list')
  const [cancellingAppt, setCancellingAppt] = useState<PatientAppointment | null>(null)
  const [reschedulingAppt, setReschedulingAppt] = useState<PatientAppointment | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [doctorFilter, setDoctorFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [visitTypeFilter, setVisitTypeFilter] = useState('All')
  const [dateRangeFilter, setDateRangeFilter] = useState('All')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Drawer states
  const [showBookDrawer, setShowBookDrawer] = useState(false)
  const [editingAppt, setEditingAppt] = useState<PatientAppointment | null>(null)
  const [selectedDetailsAppt, setSelectedDetailsAppt] = useState<PatientAppointment | null>(null)

  // Form states for booking drawer
  const [formDept, setFormDept] = useState('Cardiology')
  const [formDoctor, setFormDoctor] = useState('Dr. Arjun Mehta')
  const [formDate, setFormDate] = useState('2025-03-30')
  const [formTime, setFormTime] = useState('10:30 AM')
  const [formType, setFormType] = useState<'In-Person OPD' | 'Follow-up OPD'>('In-Person OPD')
  const [formReason, setFormReason] = useState('')
  const [formNotes, setFormNotes] = useState('')

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  if (viewMode === 'book') {
    return (
      <PatientBookAppointmentScreen
        onBack={() => setViewMode('list')}
        onAppointmentBooked={(newAppt) => {
          setAppointments([newAppt, ...appointments])
          triggerToast(`New appointment ${newAppt.id} booked successfully!`)
        }}
        onViewDetails={(appt) => {
          setSelectedDetailsAppt(appt)
          setViewMode('list')
        }}
      />
    )
  }

  // Summary counts
  const totalCount = appointments.length
  const upcomingAppointments = appointments.filter(a => ['Confirmed', 'Scheduled', 'In-Progress', 'Pending'].includes(a.status))
  const upcomingCount = upcomingAppointments.length
  const completedCount = appointments.filter(a => a.status === 'Completed').length
  const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length

  // Next Appointment Snapshot
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null

  // Filtered Appointments
  const filteredAppointments = appointments.filter(appt => {
    // Tab Filter
    if (activeTab === 'upcoming' && !['Confirmed', 'Scheduled', 'In-Progress', 'Pending'].includes(appt.status)) return false
    if (activeTab === 'completed' && appt.status !== 'Completed') return false
    if (activeTab === 'cancelled' && appt.status !== 'Cancelled') return false

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const match =
        appt.id.toLowerCase().includes(q) ||
        appt.doctor.toLowerCase().includes(q) ||
        appt.department.toLowerCase().includes(q) ||
        appt.reason.toLowerCase().includes(q)
      if (!match) return false
    }

    // Dropdown Filters
    if (deptFilter !== 'All' && appt.department !== deptFilter) return false
    if (doctorFilter !== 'All' && appt.doctor !== doctorFilter) return false
    if (statusFilter !== 'All' && appt.status !== statusFilter) return false
    if (visitTypeFilter !== 'All' && appt.visitType !== visitTypeFilter) return false

    return true
  })

  // Handlers
  const handleOpenBookDrawer = (apptToReschedule?: PatientAppointment) => {
    if (apptToReschedule) {
      setEditingAppt(apptToReschedule)
      setFormDept(apptToReschedule.department)
      setFormDoctor(apptToReschedule.doctor)
      setFormDate(apptToReschedule.date)
      setFormTime(apptToReschedule.time)
      setFormType(apptToReschedule.visitType as any)
      setFormReason(apptToReschedule.reason)
      setFormNotes(apptToReschedule.notes)
    } else {
      setEditingAppt(null)
      setFormDept('Cardiology')
      setFormDoctor('Dr. Arjun Mehta')
      setFormDate('2025-03-30')
      setFormTime('10:30 AM')
      setFormType('In-Person OPD')
      setFormReason('')
      setFormNotes('')
    }
    setShowBookDrawer(true)
  }

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAppt) {
      setAppointments(prev =>
        prev.map(a =>
          a.id === editingAppt.id
            ? {
              ...a,
              department: formDept,
              doctor: formDoctor,
              date: formDate,
              time: formTime,
              visitType: formType,
              reason: formReason || a.reason,
              notes: formNotes || a.notes,
              status: 'Scheduled',
            }
            : a
        )
      )
      triggerToast(`Appointment ${editingAppt.id} successfully rescheduled for ${formDate} at ${formTime}!`)
    } else {
      const newAppt: PatientAppointment = {
        id: `APT-2025-00${appointments.length + 1}`,
        date: formDate,
        time: formTime,
        doctor: formDoctor,
        specialty: formDept === 'Cardiology' ? 'Senior Cardiologist' : 'Specialist',
        department: formDept,
        visitType: formType,
        status: 'Scheduled',
        roomLocation: formType === 'Follow-up OPD' ? 'Wing A, OPD Room 202' : 'Wing A, OPD Room 102',
        reason: formReason || 'General Consultation',
        notes: formNotes || 'Booked via Patient Portal',
        consultationStatus: 'Scheduled',
        prescriptionStatus: 'Pending Consultation',
        billingStatus: 'Pending ($65.00)',
        billingAmount: '$65.00',
      }
      setAppointments([newAppt, ...appointments])
      triggerToast(`New appointment ${newAppt.id} booked successfully!`)
    }
    setShowBookDrawer(false)
  }

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'Cancelled', consultationStatus: 'Cancelled' } : a))
    )
    triggerToast(`Appointment ${id} has been cancelled.`)
  }

  const handleResetFilters = () => {
    setDeptFilter('All')
    setDoctorFilter('All')
    setStatusFilter('All')
    setVisitTypeFilter('All')
    setDateRangeFilter('All')
    setSearchQuery('')
    setActiveTab('all')
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>

      {/* Toast Feedback Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>My Appointments</h1>
          <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            Manage your upcoming and previous appointments.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-1.5">
            <span>Patient Portal</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="font-medium text-[#111827]">Appointments</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setViewMode('book')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Plus size={15} /> Book Appointment
          </button>
        </div>
      </div>

      {/* ── 2. SUMMARY KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 01: Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Upcoming Appointments</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{upcomingCount}</div>
            <div className="text-[11px] text-[#0D47A1] font-semibold mt-1 flex items-center gap-1">
              <Clock size={12} /> Scheduled & Confirmed
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1] shrink-0">
            <Calendar size={22} />
          </div>
        </div>

        {/* Card 02: Completed Appointments */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-teal-200 transition-colors">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Completed Appointments</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{completedCount}</div>
            <div className="text-[11px] text-[#009688] font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> Past Consultations
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688] shrink-0">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Card 03: Cancelled Appointments */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-red-200 transition-colors">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Cancelled Appointments</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{cancelledCount}</div>
            <div className="text-[11px] text-[#EF4444] font-semibold mt-1 flex items-center gap-1">
              <XCircle size={12} /> Cancelled Requests
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-[#EF4444] shrink-0">
            <XCircle size={22} />
          </div>
        </div>

        {/* Card 04: Next Appointment */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-purple-200 transition-colors">
          <div className="truncate pr-2">
            <div className="text-xs text-[#64748B] font-medium">Next Appointment</div>
            {nextAppointment ? (
              <>
                <div className="text-sm font-bold text-[#111827] mt-0.5 truncate" style={{ fontFamily: PP }}>
                  {nextAppointment.doctor}
                </div>
                <div className="text-[11px] text-[#0D47A1] font-semibold mt-1 truncate">
                  {nextAppointment.date} · {nextAppointment.time}
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-[#64748B] mt-1">None Scheduled</div>
                <div className="text-[11px] text-[#0D47A1] font-medium mt-0.5">Click to book</div>
              </>
            )}
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Stethoscope size={22} />
          </div>
        </div>

      </div>

      {/* ── 3. MAIN CONTENT LAYOUT (8 COLS LEFT, 4 COLS RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (8 cols): Search, Filters, Tabs & List */}
        <div className="lg:col-span-8 space-y-4">

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Doctor Name, Appointment ID, Department..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>

            {/* Filter Dropdowns & Controls */}
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1 text-xs text-[#64748B] font-medium">
                <Filter size={13} />
                <span>Filters:</span>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Department Filter */}
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>

              {/* Visit Type Filter */}
              <select
                value={visitTypeFilter}
                onChange={e => setVisitTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Visit Types</option>
                <option value="In-Person OPD">In-Person OPD</option>
                <option value="Follow-up OPD">Follow-up OPD</option>
                <option value="Routine Checkup">Routine Checkup</option>
              </select>

              {/* Date Range Filter */}
              <select
                value={dateRangeFilter}
                onChange={e => setDateRangeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Date Ranges</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>

              {/* Reset Filters Action */}
              {(deptFilter !== 'All' || doctorFilter !== 'All' || statusFilter !== 'All' || visitTypeFilter !== 'All' || dateRangeFilter !== 'All' || searchQuery || activeTab !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#0D47A1] font-semibold hover:underline px-2 py-1 flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-0.5 overflow-x-auto">
            {[
              { id: 'all', label: 'All', count: totalCount },
              { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
              { id: 'completed', label: 'Completed', count: completedCount },
              { id: 'cancelled', label: 'Cancelled', count: cancelledCount },
            ].map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-0.5 whitespace-nowrap ${isActive
                    ? 'border-[#0D47A1] text-[#0D47A1]'
                    : 'border-transparent text-[#64748B] hover:text-[#111827]'
                    }`}
                  style={{ fontFamily: PP }}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-blue-50 text-[#0D47A1]' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Main Appointment Workspace */}
          {filteredAppointments.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-[#0D47A1]">
                <Calendar size={32} />
              </div>
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>No appointments found</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                No appointments found. You don't have any appointments matching your search criteria.
              </p>
              <button
                onClick={() => setViewMode('book')}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm inline-flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Plus size={14} /> Book Appointment
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table (Hidden on mobile/tablet) */}
              <div className="hidden md:block bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                    <thead>
                      <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[#64748B] uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-3.5 font-bold">Appointment ID</th>
                        <th className="px-4 py-3.5 font-bold">Doctor</th>
                        <th className="px-4 py-3.5 font-bold">Department</th>
                        <th className="px-4 py-3.5 font-bold">Date</th>
                        <th className="px-4 py-3.5 font-bold">Time</th>
                        <th className="px-4 py-3.5 font-bold">Visit Type</th>
                        <th className="px-4 py-3.5 font-bold">Status</th>
                        <th className="px-4 py-3.5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                      {filteredAppointments.map(appt => {
                        const isUpcoming = ['Confirmed', 'Scheduled', 'Pending'].includes(appt.status)
                        return (
                          <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                            {/* Appointment ID */}
                            <td className="px-4 py-4 font-mono font-bold text-[#0D47A1]">
                              {appt.id}
                            </td>

                            {/* Doctor */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-xs shrink-0 border border-blue-100">
                                  {appt.doctor.split(' ').map(n => n[0]).join('').replace('D', '').replace('r', '').replace('.', '') || 'DR'}
                                </div>
                                <div>
                                  <div className="font-bold text-[#111827]">{appt.doctor}</div>
                                  <div className="text-[11px] text-[#64748B]">{appt.specialty}</div>
                                </div>
                              </div>
                            </td>

                            {/* Department */}
                            <td className="px-4 py-4 text-slate-700 font-medium">
                              {appt.department}
                            </td>

                            {/* Appointment Date */}
                            <td className="px-4 py-4 font-medium text-[#111827]">
                              {appt.date}
                            </td>

                            {/* Appointment Time */}
                            <td className="px-4 py-4 text-[#0D47A1] font-semibold">
                              {appt.time}
                            </td>

                            {/* Visit Type */}
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${appt.visitType === 'Follow-up OPD' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                <Building2 size={12} />
                                {appt.visitType}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${appt.status === 'Confirmed' ? 'bg-green-50 text-[#66BB6A]' :
                                appt.status === 'Scheduled' ? 'bg-blue-50 text-[#0D47A1]' :
                                  appt.status === 'Pending' ? 'bg-amber-50 text-[#F59E0B]' :
                                    appt.status === 'Completed' ? 'bg-teal-50 text-[#009688]' :
                                      'bg-red-50 text-[#EF4444]'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${appt.status === 'Confirmed' ? 'bg-[#66BB6A]' :
                                  appt.status === 'Scheduled' ? 'bg-[#0D47A1]' :
                                    appt.status === 'Pending' ? 'bg-[#F59E0B]' :
                                      appt.status === 'Completed' ? 'bg-[#009688]' :
                                        'bg-[#EF4444]'
                                  }`} />
                                {appt.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {/* View Details */}
                                <button
                                  onClick={() => setSelectedDetailsAppt(appt)}
                                  className="p-1.5 text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Appointment Details"
                                >
                                  <Eye size={15} />
                                </button>

                                {/* Reschedule */}
                                {isUpcoming && (
                                  <button
                                    onClick={() => setReschedulingAppt(appt)}
                                    className="p-1.5 text-slate-500 hover:text-[#009688] hover:bg-teal-50 rounded-lg transition-colors"
                                    title="Reschedule Appointment"
                                  >
                                    <Calendar size={15} />
                                  </button>
                                )}

                                {/* Cancel */}
                                {isUpcoming && (
                                  <button
                                    onClick={() => setCancellingAppt(appt)}
                                    className="p-1.5 text-slate-400 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                                    title="Cancel Appointment"
                                  >
                                    <XCircle size={15} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
                  <div className="text-xs text-[#64748B]">
                    Showing <span className="font-bold text-[#111827]">{filteredAppointments.length}</span> of {totalCount} appointments
                  </div>
                  <div className="flex items-center gap-1">
                    <button disabled className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium">Previous</button>
                    <button className="w-7 h-7 bg-[#0D47A1] text-white rounded-lg text-xs font-bold">1</button>
                    <button disabled className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium">Next</button>
                  </div>
                </div>
              </div>

              {/* Mobile / Tablet Cards View */}
              <div className="md:hidden space-y-3">
                {filteredAppointments.map(appt => {
                  const isUpcoming = ['Confirmed', 'Scheduled', 'Pending'].includes(appt.status)
                  return (
                    <div key={appt.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-sm border border-blue-100">
                            {appt.doctor.split(' ').map(n => n[0]).join('').replace('D', '').replace('r', '').replace('.', '') || 'DR'}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{appt.doctor}</h4>
                            <div className="text-[11px] text-[#64748B]">{appt.department} · {appt.specialty}</div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${appt.status === 'Confirmed' ? 'bg-green-50 text-[#66BB6A]' :
                          appt.status === 'Scheduled' ? 'bg-blue-50 text-[#0D47A1]' :
                            appt.status === 'Completed' ? 'bg-teal-50 text-[#009688]' :
                              'bg-red-50 text-[#EF4444]'
                          }`}>
                          {appt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[#64748B] text-[10px] block">Appointment ID</span>
                          <span className="font-mono font-bold text-[#0D47A1]">{appt.id}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[#64748B] text-[10px] block">Date & Time</span>
                          <span className="font-semibold text-[#111827]">{appt.date} ({appt.time})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 font-medium">{appt.visitType}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedDetailsAppt(appt)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                          >
                            Details
                          </button>
                          {isUpcoming && (
                            <>
                              <button
                                onClick={() => setReschedulingAppt(appt)}
                                className="px-3 py-1.5 bg-blue-50 text-[#0D47A1] text-xs font-bold rounded-xl hover:bg-blue-100"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => setCancellingAppt(appt)}
                                className="px-3 py-1.5 bg-red-50 text-[#EF4444] text-xs font-bold rounded-xl hover:bg-red-100"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

        </div>

        {/* Right Column (4 cols - Context Panel) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Card 1: Next Appointment Snapshot */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
                <Clock size={15} className="text-[#0D47A1]" /> Next Appointment
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-[#0D47A1] font-bold">Upcoming</span>
            </div>

            {nextAppointment ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-slate-50 border border-blue-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0D47A1] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                    {nextAppointment.doctor.split(' ').map(n => n[0]).join('').replace('D', '').replace('r', '').replace('.', '') || 'DR'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{nextAppointment.doctor}</h4>
                    <p className="text-[11px] text-[#64748B]">{nextAppointment.specialty} · {nextAppointment.department}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#111827] pt-2 border-t border-blue-100/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Date & Time:</span>
                    <span className="font-bold text-[#0D47A1]">{nextAppointment.date} @ {nextAppointment.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Location:</span>
                    <span className="font-semibold text-slate-700">{nextAppointment.roomLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Visit Type:</span>
                    <span className="font-medium text-[#009688]">{nextAppointment.visitType}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDetailsAppt(nextAppointment)}
                    className="flex-1 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setReschedulingAppt(nextAppointment)}
                    className="flex-1 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <Calendar size={28} className="mx-auto text-slate-400" />
                <p className="text-xs text-[#64748B]">You have no upcoming appointments scheduled.</p>
                <button
                  onClick={() => handleOpenBookDrawer()}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                  style={{ fontFamily: PP }}
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Appointment Statistics */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
              <TrendingUp size={15} className="text-[#009688]" /> Appointment Overview
            </h3>

            <div className="space-y-3">
              {/* Upcoming Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-[#64748B]">Upcoming & Confirmed</span>
                  <span className="font-bold text-[#0D47A1]">{upcomingCount} ({totalCount > 0 ? Math.round((upcomingCount / totalCount) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0D47A1] h-full rounded-full" style={{ width: `${totalCount > 0 ? (upcomingCount / totalCount) * 100 : 0}%` }} />
                </div>
              </div>

              {/* Completed Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-[#64748B]">Completed Consultations</span>
                  <span className="font-bold text-[#009688]">{completedCount} ({totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#009688] h-full rounded-full" style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} />
                </div>
              </div>

              {/* Cancelled Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-[#64748B]">Cancelled Requests</span>
                  <span className="font-bold text-[#EF4444]">{cancelledCount} ({totalCount > 0 ? Math.round((cancelledCount / totalCount) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#EF4444] h-full rounded-full" style={{ width: `${totalCount > 0 ? (cancelledCount / totalCount) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: PP }}>
              <Activity size={15} className="text-[#F59E0B]" /> Quick Actions
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setViewMode('book')}
                className="w-full p-3 rounded-xl bg-blue-50 border border-blue-100 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-between"
                style={{ fontFamily: PP }}
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} /> Book New Appointment
                </span>
                <ChevronRight size={15} />
              </button>

              <button
                onClick={() => {
                  if (nextAppointment) setSelectedDetailsAppt(nextAppointment)
                  else triggerToast('No upcoming appointment to view details.')
                }}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Eye size={16} /> View Next Appointment Details
                </span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── 4. RIGHT DRAWER: BOOK / RESCHEDULE APPOINTMENT ── */}
      {showBookDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowBookDrawer(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

              {/* Drawer Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-base font-bold" style={{ fontFamily: PP }}>
                    {editingAppt ? `Reschedule ${editingAppt.id}` : 'Book New Appointment'}
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">Select doctor, date & available slot</p>
                </div>
                <button onClick={() => setShowBookDrawer(false)} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleSaveAppointment} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

                {/* 1. Department */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-3">
                  <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    1. Select Department
                  </label>
                  <select
                    value={formDept}
                    onChange={e => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Cardiology">Cardiology (Heart & Vascular)</option>
                    <option value="General Medicine">General Medicine (OPD)</option>
                    <option value="Neurology">Neurology (Brain & Spine)</option>
                    <option value="Gynecology">Gynecology & Obstetrics</option>
                    <option value="Pediatrics">Pediatrics (Child Care)</option>
                  </select>
                </div>

                {/* 2. Doctor */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-3">
                  <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    2. Select Doctor
                  </label>
                  <select
                    value={formDoctor}
                    onChange={e => setFormDoctor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Dr. Arjun Mehta">Dr. Arjun Mehta — Senior Cardiologist (10 yrs exp)</option>
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma — Endocrinologist (8 yrs exp)</option>
                    <option value="Dr. Rajesh Kapoor">Dr. Rajesh Kapoor — Neurologist (12 yrs exp)</option>
                    <option value="Dr. Sunita Patel">Dr. Sunita Patel — Gynecologist (9 yrs exp)</option>
                  </select>
                </div>

                {/* 3. Visit Type, Date & Time Slots */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-4">
                  <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    3. Visit Type & Date Selection
                  </label>

                  {/* Visit Type Toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormType('In-Person OPD')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${formType === 'In-Person OPD'
                        ? 'border-[#0D47A1] bg-blue-50 text-[#0D47A1]'
                        : 'border-[#E5E7EB] bg-slate-50 text-slate-600'
                        }`}
                    >
                      <Building2 size={14} /> In-Person OPD
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType('Follow-up OPD')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${formType === 'Follow-up OPD'
                        ? 'border-[#0D47A1] bg-blue-50 text-[#0D47A1]'
                        : 'border-[#E5E7EB] bg-slate-50 text-slate-600'
                        }`}
                    >
                      <Stethoscope size={14} /> Follow-up OPD
                    </button>
                  </div>

                  {/* Date Input */}
                  <div>
                    <span className="block text-[11px] text-[#64748B] mb-1 font-medium">Select Preferred Date</span>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <span className="block text-[11px] text-[#64748B] mb-2 font-medium">Available Time Slots</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM', '04:15 PM', '05:00 PM'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormTime(t)}
                          className={`py-1.5 rounded-lg border text-xs font-semibold text-center transition-colors ${formTime === t
                            ? 'border-[#0D47A1] bg-[#0D47A1] text-white shadow-sm'
                            : 'border-[#E5E7EB] bg-slate-50 text-[#111827] hover:bg-slate-100'
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Reason for Visit & Notes */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-3">
                  <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    4. Clinical Reason & Symptoms
                  </label>

                  <div>
                    <span className="block text-[11px] text-[#64748B] mb-1 font-medium">Reason for Visit *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Routine follow-up, BP check, Chest tightness..."
                      value={formReason}
                      onChange={e => setFormReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] text-[#64748B] mb-1 font-medium">Additional Notes</span>
                    <textarea
                      rows={2}
                      placeholder="Any symptoms, ongoing medications, or special requests..."
                      value={formNotes}
                      onChange={e => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                </div>

                {/* Appointment Summary Card */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                  <div className="text-xs font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>Appointment Summary</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B]">
                    <div>Doctor: <span className="font-semibold text-[#111827]">{formDoctor}</span></div>
                    <div>Dept: <span className="font-semibold text-[#111827]">{formDept}</span></div>
                    <div>Date: <span className="font-semibold text-[#111827]">{formDate}</span></div>
                    <div>Time: <span className="font-semibold text-[#111827]">{formTime}</span></div>
                    <div>Type: <span className="font-semibold text-[#111827]">{formType}</span></div>
                    <div>Consultation Fee: <span className="font-bold text-[#009688]">$65.00</span></div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    {editingAppt ? 'Confirm Reschedule' : 'Confirm Appointment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookDrawer(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#64748B] hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* ── 5. RIGHT DRAWER: APPOINTMENT DETAILS ── */}
      {selectedDetailsAppt && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedDetailsAppt(null)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

              {/* Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-base font-bold" style={{ fontFamily: PP }}>Appointment Details</h2>
                  <span className="font-mono text-xs text-blue-200">{selectedDetailsAppt.id}</span>
                </div>
                <button onClick={() => setSelectedDetailsAppt(null)} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              {/* Details Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

                {/* Doctor & Location Info */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0D47A1] font-bold flex items-center justify-center text-sm shrink-0">
                      AM
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>{selectedDetailsAppt.doctor}</h3>
                      <div className="text-xs text-[#64748B]">{selectedDetailsAppt.specialty} · {selectedDetailsAppt.department}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Appointment Date</span>
                      <span className="font-semibold text-[#111827]">{selectedDetailsAppt.date}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Appointment Time</span>
                      <span className="font-semibold text-[#0D47A1]">{selectedDetailsAppt.time}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Visit Type</span>
                      <span className="font-medium text-slate-700">{selectedDetailsAppt.visitType}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Hospital Location</span>
                      <span className="font-medium text-slate-700">{selectedDetailsAppt.roomLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badges Section */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Status Overview
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">Appointment Status</span>
                      <span className="font-bold text-[#66BB6A]">{selectedDetailsAppt.status}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">Consultation Status</span>
                      <span className="font-bold text-[#0D47A1]">{selectedDetailsAppt.consultationStatus}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">Prescription Status</span>
                      <span className="font-medium text-slate-700">{selectedDetailsAppt.prescriptionStatus}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                      <span className="text-[#64748B] text-[11px] block">Billing Status</span>
                      <span className="font-bold text-amber-600">{selectedDetailsAppt.billingStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Visit Reason & Clinical Notes */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Reason & Notes
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block font-medium">Reason for Visit</span>
                    <p className="text-xs text-[#111827] mt-0.5 font-medium">{selectedDetailsAppt.reason}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                    <span className="text-[#64748B] text-[11px] block font-medium">Doctor / Staff Notes</span>
                    <p className="text-xs text-slate-600 mt-0.5">{selectedDetailsAppt.notes}</p>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
                <button
                  onClick={() => triggerToast(`Downloading slip for ${selectedDetailsAppt.id}...`)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={15} /> Download Appointment Slip
                </button>
                <button
                  onClick={() => {
                    const apptToReschedule = selectedDetailsAppt
                    setSelectedDetailsAppt(null)
                    setReschedulingAppt(apptToReschedule)
                  }}
                  className="px-4 py-2.5 rounded-xl border border-blue-200 text-xs font-bold text-[#0D47A1] bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={15} /> Reschedule
                </button>
                <button
                  onClick={() => {
                    const apptToCancel = selectedDetailsAppt
                    setSelectedDetailsAppt(null)
                    setCancellingAppt(apptToCancel)
                  }}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-xs font-bold text-[#EF4444] bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <XCircle size={15} /> Cancel
                </button>
                <button
                  onClick={() => setSelectedDetailsAppt(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── CANCEL APPOINTMENT CONFIRMATION DIALOG ── */}
      <PatientCancelAppointmentDialog
        appointment={cancellingAppt}
        isOpen={!!cancellingAppt}
        onClose={() => setCancellingAppt(null)}
        onConfirmCancel={(id) => {
          handleCancelAppointment(id)
        }}
        onBookNewAppointment={() => {
          setCancellingAppt(null)
          setViewMode('book')
        }}
      />

      {/* ── RESCHEDULE APPOINTMENT DIALOG ── */}
      <PatientRescheduleAppointmentDialog
        appointment={reschedulingAppt}
        isOpen={!!reschedulingAppt}
        onClose={() => setReschedulingAppt(null)}
        onConfirmReschedule={(id, newDate, newTime) => {
          setAppointments(prev =>
            prev.map(a => (a.id === id ? { ...a, date: newDate, time: newTime, status: 'Scheduled' } : a))
          )
          triggerToast(`Appointment ${id} rescheduled to ${newDate} at ${newTime}!`)
        }}
        onViewDetails={(appt) => {
          setSelectedDetailsAppt(appt)
        }}
      />

    </div>
  )
}

// ─── PATIENT MEDICAL RECORDS WORKSPACE SCREEN ─────────────────────────────

export type MedicalVisitRecord = {
  id: string
  date: string
  time: string
  doctor: string
  specialty: string
  department: string
  diagnosis: string
  prescriptions: string[]
  notes: string
  status: 'Completed' | 'Follow-up Required' | 'In-Progress'
}

export type PrescriptionRecord = {
  id: string
  doctor: string
  department: string
  issueDate: string
  status: 'Active' | 'Expired' | 'Refilled'
  medicines: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }[]
  diagnosis: string
  followUpDate: string
}

const MOCK_VISIT_RECORDS: MedicalVisitRecord[] = [
  {
    id: 'VIS-2024-001',
    date: 'March 12, 2024',
    time: '10:30 AM',
    department: 'Cardiology',
    doctor: 'Dr. Arjun Mehta',
    specialty: 'Senior Cardiologist',
    diagnosis: 'Mild Hypertension, R/O Angina',
    notes: 'Patient reported occasional chest tightness after exertion. BP is elevated (145/92). Advised lifestyle changes and prescribed medication to manage blood pressure. Follow-up in 2 weeks.',
    prescriptions: ['Amlodipine 5mg OD', 'Atorvastatin 20mg HS'],
    status: 'Completed',
  },
  {
    id: 'VIS-2023-089',
    date: 'December 04, 2023',
    time: '02:15 PM',
    department: 'General Medicine',
    doctor: 'Dr. Priya Sharma',
    specialty: 'Endocrinologist',
    diagnosis: 'Acute Bronchitis & Type 2 Diabetes Review',
    notes: 'Presenting with productive cough, mild fever, and fatigue for 4 days. Auscultation reveals bilateral rhonchi. Prescribed antibiotics and symptomatic relief.',
    prescriptions: ['Amoxicillin 500mg TDS', 'Paracetamol 500mg SOS', 'Cough Syrup 10ml BD'],
    status: 'Completed',
  },
  {
    id: 'VIS-2023-045',
    date: 'July 18, 2023',
    time: '11:00 AM',
    department: 'Cardiology',
    doctor: 'Dr. Arjun Mehta',
    specialty: 'Senior Cardiologist',
    diagnosis: 'Annual Cardiac Check-up',
    notes: 'Routine check-up. ECG normal. TMT negative for ischemia. Lipid profile shows borderline high LDL. Advised diet control and regular aerobic exercise.',
    prescriptions: ['Rosuvastatin 10mg OD'],
    status: 'Completed',
  },
]

const MOCK_PRESCRIPTION_RECORDS: PrescriptionRecord[] = [
  {
    id: 'RX-8910',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    issueDate: '2024-03-12',
    status: 'Active',
    diagnosis: 'Mild Hypertension',
    followUpDate: '2024-04-05',
    medicines: [
      {
        name: 'Amlodipine 5mg',
        dosage: '1 Tablet OD (Once Daily)',
        frequency: 'Morning after breakfast',
        duration: '30 Days',
        instructions: 'Take regularly at 9 AM. Monitor BP weekly.',
      },
      {
        name: 'Atorvastatin 20mg',
        dosage: '1 Tablet HS (At Bedtime)',
        frequency: 'Night before sleep',
        duration: '30 Days',
        instructions: 'Avoid grapefruit juice while taking this medication.',
      },
    ],
  },
  {
    id: 'RX-8421',
    doctor: 'Dr. Priya Sharma',
    department: 'General Medicine',
    issueDate: '2023-12-04',
    status: 'Expired',
    diagnosis: 'Acute Bronchitis',
    followUpDate: '2023-12-18',
    medicines: [
      {
        name: 'Amoxicillin 500mg',
        dosage: '1 Capsule TDS (Three times daily)',
        frequency: 'Every 8 hours',
        duration: '7 Days',
        instructions: 'Complete full 7-day antibiotic course even if symptoms resolve.',
      },
      {
        name: 'Paracetamol 500mg',
        dosage: '1 Tablet SOS (As needed)',
        frequency: 'Max 3 tablets daily',
        duration: '5 Days',
        instructions: 'Take only if fever exceeds 100°F.',
      },
    ],
  },
  {
    id: 'RX-7732',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    issueDate: '2023-07-18',
    status: 'Refilled',
    diagnosis: 'Hyperlipidemia',
    followUpDate: '2023-10-18',
    medicines: [
      {
        name: 'Rosuvastatin 10mg',
        dosage: '1 Tablet OD',
        frequency: 'Nightly',
        duration: '90 Days',
        instructions: 'Repeat lipid profile test prior to next follow-up.',
      },
    ],
  },
]

export function PatientMedicalRecordsScreen({ }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'visits' | 'prescriptions'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Drawer states
  const [selectedRx, setSelectedRx] = useState<PrescriptionRecord | null>(null)
  const [selectedVisit, setSelectedVisit] = useState<MedicalVisitRecord | null>(null)

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Filtered Visits
  const filteredVisits = MOCK_VISIT_RECORDS.filter(v => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const match =
        v.id.toLowerCase().includes(q) ||
        v.doctor.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        v.diagnosis.toLowerCase().includes(q)
      if (!match) return false
    }
    if (doctorFilter !== 'All' && v.doctor !== doctorFilter) return false
    if (deptFilter !== 'All' && v.department !== deptFilter) return false
    return true
  })

  // Filtered Prescriptions
  const filteredPrescriptions = MOCK_PRESCRIPTION_RECORDS.filter(rx => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const match =
        rx.id.toLowerCase().includes(q) ||
        rx.doctor.toLowerCase().includes(q) ||
        rx.department.toLowerCase().includes(q) ||
        rx.diagnosis.toLowerCase().includes(q) ||
        rx.medicines.some(m => m.name.toLowerCase().includes(q))
      if (!match) return false
    }
    if (doctorFilter !== 'All' && rx.doctor !== doctorFilter) return false
    if (statusFilter !== 'All' && rx.status !== statusFilter) return false
    return true
  })

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Medical Records</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Patient Portal</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Medical Records</span>
          </div>
        </div>

        <button
          onClick={() => triggerToast('Generating complete Medical History Report PDF...')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm self-start md:self-auto"
          style={{ fontFamily: PP }}
        >
          <Download size={14} /> Download Medical Report
        </button>
      </div>

      {/* ── 2. SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Total Visits</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>12</div>
            <div className="text-[11px] text-[#0D47A1] font-medium mt-1">OPD & Follow-up visits</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
            <Activity size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Active Prescriptions</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>3</div>
            <div className="text-[11px] text-[#009688] font-medium mt-1">Ongoing medications</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
            <Pill size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Known Allergies</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>2</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Penicillin, Peanuts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Primary Doctor</div>
            <div className="text-sm font-bold text-[#111827] mt-1" style={{ fontFamily: PP }}>Dr. Arjun Mehta</div>
            <div className="text-[11px] text-[#0D47A1] font-medium">Cardiology Lead</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
            <UserCheck size={20} />
          </div>
        </div>
      </div>

      {/* ── 3. TAB NAVIGATION ── */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-0.5">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'visits', label: 'Visit History', count: MOCK_VISIT_RECORDS.length },
          { id: 'prescriptions', label: 'Prescriptions', count: MOCK_PRESCRIPTION_RECORDS.length },
        ].map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-0.5 ${isActive
                ? 'border-[#0D47A1] text-[#0D47A1]'
                : 'border-transparent text-[#64748B] hover:text-[#111827]'
                }`}
              style={{ fontFamily: PP }}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-blue-50 text-[#0D47A1]' : 'bg-slate-100 text-slate-500'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── 4. TAB CONTENTS ── */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Patient Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Summary</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-[#009688]">ID: P-9821</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[#64748B] text-[11px] block">Blood Group</span>
                <span className="text-base font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>O Rh Positive (O+)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[#64748B] text-[11px] block">Age & Gender</span>
                <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>34 Yrs / Female</span>
              </div>
            </div>

            <div className="space-y-3 text-xs pt-2">
              <div>
                <span className="text-[#64748B] text-[11px] block font-medium">Primary Doctor</span>
                <span className="font-semibold text-[#111827]">Dr. Arjun Mehta (Cardiology)</span>
              </div>

              <div>
                <span className="text-[#64748B] text-[11px] block font-medium mb-1">Known Allergies</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-[#EF4444] border border-red-100 flex items-center gap-1">
                    <AlertTriangle size={11} /> Penicillin
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-[#F59E0B] border border-amber-100">
                    Peanuts
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                    Latex
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] text-[11px] block font-medium mb-1">Current Medical Conditions</span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
                    <span>Mild Essential Hypertension (Diagnosed Mar 2024)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
                    <span>Type 2 Diabetes Mellitus — Managed via Diet & Meds</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#111827] pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
              Recent Medical Activity Timeline
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">

              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#0D47A1] ring-4 ring-blue-50 flex items-center justify-center text-white text-[10px]">
                  <Activity size={10} />
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>Cardiology Follow-Up Visit</span>
                    <span className="text-[11px] text-[#64748B]">Mar 12, 2024</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Doctor: <span className="font-medium text-[#111827]">Dr. Arjun Mehta</span> · Diagnosis: Mild Hypertension</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-[#0D47A1]">Rx Issued</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-[#66BB6A]">Completed</span>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#009688] ring-4 ring-teal-50 flex items-center justify-center text-white text-[10px]">
                  <FileText size={10} />
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>Cardiology Routine Clinical Consultation</span>
                    <span className="text-[11px] text-[#64748B]">Feb 28, 2024</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Doctor: <span className="font-medium text-[#111827]">Dr. Arjun Mehta</span> · Routine vital check & blood pressure review</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-[#009688]">Consultation Verified</span>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50 flex items-center justify-center text-white text-[10px]">
                  <Pill size={10} />
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>General Medicine Checkup & Bronchitis Rx</span>
                    <span className="text-[11px] text-[#64748B]">Dec 04, 2023</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Doctor: <span className="font-medium text-[#111827]">Dr. Priya Sharma</span> · Prescribed Amoxicillin 500mg</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">Completed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: VISIT HISTORY */}
      {activeTab === 'visits' && (
        <div className="space-y-4">

          {/* Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Doctor, Department, Diagnosis..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
              </select>

              <select
                value={doctorFilter}
                onChange={e => setDoctorFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Doctors</option>
                <option value="Dr. Arjun Mehta">Dr. Arjun Mehta</option>
                <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
              </select>
            </div>
          </div>

          {/* Visits Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3.5 font-bold">Visit Date</th>
                    <th className="px-4 py-3.5 font-bold">Doctor</th>
                    <th className="px-4 py-3.5 font-bold">Department</th>
                    <th className="px-4 py-3.5 font-bold">Diagnosis</th>
                    <th className="px-4 py-3.5 font-bold">Prescriptions</th>
                    <th className="px-4 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                  {filteredVisits.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#111827]">{v.date}</div>
                        <div className="text-[11px] text-[#64748B] font-mono">{v.id}</div>
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#111827]">{v.doctor}</td>
                      <td className="px-4 py-4 text-slate-600">{v.department}</td>
                      <td className="px-4 py-4 font-medium text-slate-800">{v.diagnosis}</td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {v.prescriptions.map((p, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-[#0D47A1]">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-[#66BB6A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
                          {v.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedVisit(v)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
                          style={{ fontFamily: PP }}
                        >
                          <Eye size={13} /> View Summary
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">

          {/* Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Prescription ID, Doctor, Medicine..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Refilled">Refilled</option>
              </select>
            </div>
          </div>

          {/* Prescriptions Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3.5 font-bold">Prescription ID</th>
                    <th className="px-4 py-3.5 font-bold">Doctor</th>
                    <th className="px-4 py-3.5 font-bold">Prescribed Medicines</th>
                    <th className="px-4 py-3.5 font-bold">Issue Date</th>
                    <th className="px-4 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                  {filteredPrescriptions.map(rx => (
                    <tr key={rx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#0D47A1]">
                        {rx.id}
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#111827]">
                        {rx.doctor}
                        <div className="text-[11px] text-[#64748B] font-normal">{rx.department}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {rx.medicines.map((m, idx) => (
                            <div key={idx} className="font-bold text-[#111827] text-xs">
                              {m.name} <span className="text-[#64748B] font-normal text-[11px]">({m.dosage})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-700 font-medium">
                        {rx.issueDate}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${rx.status === 'Active' ? 'bg-teal-50 text-[#009688]' :
                          rx.status === 'Refilled' ? 'bg-blue-50 text-[#0D47A1]' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${rx.status === 'Active' ? 'bg-[#009688]' :
                            rx.status === 'Refilled' ? 'bg-[#0D47A1]' :
                              'bg-slate-400'
                            }`} />
                          {rx.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRx(rx)}
                            className="p-1.5 text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Prescription Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => triggerToast(`Downloading Prescription PDF for ${rx.id}...`)}
                            className="p-1.5 text-slate-500 hover:text-[#009688] hover:bg-teal-50 rounded-lg transition-colors"
                            title="Download Prescription PDF"
                          >
                            <Download size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ── 5. RIGHT DRAWER: PRESCRIPTION / VISIT DETAILS ── */}
      {(selectedRx || selectedVisit) && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => {
              setSelectedRx(null)
              setSelectedVisit(null)
            }}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

              {/* Drawer Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-base font-bold" style={{ fontFamily: PP }}>
                    {selectedRx ? `Prescription ${selectedRx.id}` : `Visit Summary — ${selectedVisit?.id}`}
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">Clinical details & dosage schedule</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRx(null)
                    setSelectedVisit(null)
                  }}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

                {/* Doctor & Department Banner */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
                  <div className="text-xs text-[#64748B] font-medium">Consulting Physician</div>
                  <div className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    {selectedRx ? selectedRx.doctor : selectedVisit?.doctor}
                  </div>
                  <div className="text-xs text-[#0D47A1] font-semibold">
                    {selectedRx ? selectedRx.department : selectedVisit?.department} Department
                  </div>
                </div>

                {/* Diagnosis Info */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2">
                  <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Clinical Diagnosis
                  </div>
                  <p className="text-xs text-[#111827] font-semibold">
                    {selectedRx ? selectedRx.diagnosis : selectedVisit?.diagnosis}
                  </p>
                  {selectedVisit && (
                    <p className="text-xs text-slate-600 pt-2 border-t border-gray-50">{selectedVisit.notes}</p>
                  )}
                </div>

                {/* Prescribed Medicines Schedule */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Medicines & Dosage Schedule
                  </div>

                  {selectedRx ? (
                    <div className="space-y-3">
                      {selectedRx.medicines.map((m, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#111827]">{m.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#009688]">{m.duration}</span>
                          </div>
                          <div className="text-xs text-slate-700">Dosage: <span className="font-semibold">{m.dosage}</span></div>
                          <div className="text-xs text-slate-600">Timing: {m.frequency}</div>
                          <div className="text-[11px] text-slate-500 italic">Note: {m.instructions}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedVisit?.prescriptions.map((p, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] text-xs font-bold">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Follow up Date */}
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#64748B] block font-medium">Recommended Follow-up</span>
                    <span className="font-bold text-[#009688]">
                      {selectedRx ? selectedRx.followUpDate : '2 Weeks post consultation'}
                    </span>
                  </div>
                  <Calendar size={18} className="text-[#009688]" />
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
                <button
                  onClick={() => triggerToast(`Downloading PDF report...`)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={15} /> Download PDF
                </button>
                <button
                  onClick={() => {
                    setSelectedRx(null)
                    setSelectedVisit(null)
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── PATIENT BILLING & PAYMENTS WORKSPACE SCREEN ──────────────────────────

export type PatientInvoice = {
  id: string
  date: string
  dueDate: string
  doctor: string
  department: string
  amount: string
  numericAmount: number
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partial'
  patientPayable: string
  items: {
    description: string
    category: string
    cost: string
  }[]
  paymentRef?: string
  paymentDate?: string
  paymentMethod?: string
}

export type PaymentHistoryRecord = {
  id: string
  date: string
  time: string
  amount: string
  method: string
  referenceNumber: string
  invoiceId: string
  status: 'Completed' | 'Processing'
}

const INITIAL_INVOICES: PatientInvoice[] = [
  {
    id: 'INV-2024-001',
    date: '2024-03-12',
    dueDate: '2024-03-26',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    amount: '$97.60',
    numericAmount: 97.60,
    status: 'Paid',
    patientPayable: '$97.60',
    paymentRef: 'TXN-98214-88A',
    paymentDate: '2024-03-12 11:30 AM',
    paymentMethod: 'Visa Credit Card **** 4242',
    items: [
      { description: 'Cardiology Specialist OPD Consultation', category: 'Consultation', cost: '$65.00' },
      { description: 'Routine 12-Lead ECG Screening', category: 'Diagnostics', cost: '$25.00' },
      { description: 'Pharmacy Prescription (Amlodipine + Atorvastatin)', category: 'Pharmacy', cost: '$57.60' },
    ],
  },
  {
    id: 'INV-2024-002',
    date: '2024-03-22',
    dueDate: '2024-04-05',
    doctor: 'Dr. Priya Sharma',
    department: 'General Medicine',
    amount: '$45.00',
    numericAmount: 45.00,
    status: 'Pending',
    patientPayable: '$45.00',
    items: [
      { description: 'General OPD Consultation', category: 'Consultation', cost: '$45.00' },
      { description: 'Electronic Health Record Processing', category: 'Administrative', cost: '$20.00' },
    ],
  },
  {
    id: 'INV-2024-003',
    date: '2024-03-28',
    dueDate: '2024-04-11',
    doctor: 'Dr. Rajesh Kapoor',
    department: 'Neurology',
    amount: '$120.00',
    numericAmount: 120.00,
    status: 'Pending',
    patientPayable: '$120.00',
    items: [
      { description: 'Neurology Comprehensive Evaluation', category: 'Consultation', cost: '$100.00' },
      { description: 'EEG Test Preliminary Screening', category: 'Diagnostics', cost: '$80.00' },
    ],
  },
  {
    id: 'INV-2023-089',
    date: '2023-12-04',
    dueDate: '2023-12-18',
    doctor: 'Dr. Priya Sharma',
    department: 'General Medicine',
    amount: '$85.00',
    numericAmount: 85.00,
    status: 'Paid',
    patientPayable: '$85.00',
    paymentRef: 'TXN-84102-12C',
    paymentDate: '2023-12-04 03:00 PM',
    paymentMethod: 'Mastercard Debit **** 1092',
    items: [
      { description: 'General OPD Consultation & Physical Exam', category: 'Consultation', cost: '$60.00' },
      { description: 'Acute Bronchitis Medication Package', category: 'Pharmacy', cost: '$65.00' },
    ],
  },
  {
    id: 'INV-2023-045',
    date: '2023-07-18',
    dueDate: '2023-08-01',
    doctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    amount: '$210.00',
    numericAmount: 210.00,
    status: 'Paid',
    patientPayable: '$210.00',
    paymentRef: 'TXN-71930-99F',
    paymentDate: '2023-07-18 12:15 PM',
    paymentMethod: 'Apple Pay / Digital Wallet',
    items: [
      { description: 'Annual Cardiac Health Checkup Package', category: 'Checkup', cost: '$250.00' },
      { description: 'Treadmill Stress Test (TMT)', category: 'Diagnostics', cost: '$110.00' },
    ],
  },
]

const PAYMENT_HISTORY_RECORDS: PaymentHistoryRecord[] = [
  {
    id: 'PAY-2024-001',
    date: 'Mar 12, 2024',
    time: '11:30 AM',
    amount: '$97.60',
    method: 'Visa Credit Card **** 4242',
    referenceNumber: 'TXN-98214-88A',
    invoiceId: 'INV-2024-001',
    status: 'Completed',
  },
  {
    id: 'PAY-2023-089',
    date: 'Dec 04, 2023',
    time: '03:00 PM',
    amount: '$85.00',
    method: 'Mastercard Debit **** 1092',
    referenceNumber: 'TXN-84102-12C',
    invoiceId: 'INV-2023-089',
    status: 'Completed',
  },
  {
    id: 'PAY-2023-045',
    date: 'Jul 18, 2023',
    time: '12:15 PM',
    amount: '$210.00',
    method: 'Apple Pay / Digital Wallet',
    referenceNumber: 'TXN-71930-99F',
    invoiceId: 'INV-2023-045',
    status: 'Completed',
  },
]

export function PatientBillingScreen() {
  const [invoices, setInvoices] = useState<PatientInvoice[]>(INITIAL_INVOICES)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Drawer states
  const [selectedInvoice, setSelectedInvoice] = useState<PatientInvoice | null>(null)

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Summary Card Calculations
  const totalBillsCount = invoices.length
  const paidTotal = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.numericAmount, 0)
  const pendingTotal = invoices
    .filter(i => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.numericAmount, 0)
  const lastPayment = invoices.find(i => i.status === 'Paid')

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const match =
        inv.id.toLowerCase().includes(q) ||
        inv.doctor.toLowerCase().includes(q) ||
        inv.department.toLowerCase().includes(q) ||
        inv.amount.toLowerCase().includes(q)
      if (!match) return false
    }
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false
    if (dateFilter !== 'All') {
      if (dateFilter === '2024' && !inv.date.startsWith('2024')) return false
      if (dateFilter === '2023' && !inv.date.startsWith('2023')) return false
    }
    return true
  })

  const handlePayInvoice = (inv: PatientInvoice) => {
    setInvoices(prev =>
      prev.map(i =>
        i.id === inv.id
          ? {
            ...i,
            status: 'Paid',
            paymentRef: `TXN-${Math.floor(10000 + Math.random() * 90000)}-ONLINE`,
            paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            paymentMethod: 'Instant Card Payment',
          }
          : i
      )
    )
    setSelectedInvoice(null)
    triggerToast(`Payment of ${inv.amount} for ${inv.id} completed successfully!`)
  }

  const handlePayAllPending = () => {
    setInvoices(prev =>
      prev.map(i =>
        i.status === 'Pending' || i.status === 'Overdue'
          ? {
            ...i,
            status: 'Paid',
            paymentRef: `TXN-${Math.floor(10000 + Math.random() * 90000)}-ALL`,
            paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            paymentMethod: 'Instant Online Pay',
          }
          : i
      )
    )
    triggerToast(`Paid all pending balances ($${pendingTotal.toFixed(2)}) successfully!`)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Billing & Payments</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Patient Portal</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Billing & Payments</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => triggerToast('Downloading annual billing statement PDF...')}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            Download Statement
          </button>
          {pendingTotal > 0 && (
            <button
              onClick={handlePayAllPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
              style={{ fontFamily: PP }}
            >
              <CreditCard size={14} /> Pay Pending (${pendingTotal.toFixed(2)})
            </button>
          )}
        </div>
      </div>

      {/* ── 2. SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Total Bills</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{totalBillsCount} Invoices</div>
            <div className="text-[11px] text-[#0D47A1] font-medium mt-1">Hospital Services & OPD</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
            <Receipt size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Paid Amount</div>
            <div className="text-2xl font-bold text-[#66BB6A] mt-0.5" style={{ fontFamily: PP }}>
              ${paidTotal.toFixed(2)}
            </div>
            <div className="text-[11px] text-[#66BB6A] font-medium mt-1">Cleared invoices</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#66BB6A]">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Pending Amount</div>
            <div className="text-2xl font-bold text-amber-600 mt-0.5" style={{ fontFamily: PP }}>
              ${pendingTotal.toFixed(2)}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Due within 14 days</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Last Payment</div>
            <div className="text-lg font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>
              {lastPayment ? lastPayment.amount : '$0.00'}
            </div>
            <div className="text-[11px] text-[#009688] font-medium mt-0.5">
              {lastPayment ? lastPayment.date : 'No payment'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* ── 3. SEARCH & FILTERS TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Invoice Number (e.g. INV-2024-001), Doctor..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Filter size={13} />
            <span>Filter:</span>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
          >
            <option value="All">All Dates</option>
            <option value="2024">Year 2024</option>
            <option value="2023">Year 2023</option>
          </select>
        </div>
      </div>

      {/* ── 4. MAIN INVOICES TABLE ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Billing & Invoices History</h2>
          <span className="text-xs text-[#64748B]">{filteredInvoices.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
            <thead>
              <tr className="bg-slate-50 border-b border-[#E5E7EB] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5 font-bold">Invoice Number</th>
                <th className="px-4 py-3.5 font-bold">Bill Date</th>
                <th className="px-4 py-3.5 font-bold">Doctor & Specialty</th>
                <th className="px-4 py-3.5 font-bold">Department</th>
                <th className="px-4 py-3.5 font-bold">Amount</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  {/* Invoice Number */}
                  <td className="px-5 py-4 font-mono font-bold text-[#0D47A1]">
                    {inv.id}
                  </td>

                  {/* Bill Date */}
                  <td className="px-4 py-4">
                    <div className="font-semibold text-[#111827]">{inv.date}</div>
                    <div className="text-[11px] text-[#64748B]">Due: {inv.dueDate}</div>
                  </td>

                  {/* Doctor */}
                  <td className="px-4 py-4 font-semibold text-[#111827]">
                    {inv.doctor}
                  </td>

                  {/* Department */}
                  <td className="px-4 py-4 text-slate-600">
                    {inv.department}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4 font-bold text-[#111827] text-sm">
                    {inv.amount}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${inv.status === 'Paid' ? 'bg-green-50 text-[#66BB6A]' :
                      inv.status === 'Pending' ? 'bg-amber-50 text-[#F59E0B]' :
                        'bg-red-50 text-[#EF4444]'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'Paid' ? 'bg-[#66BB6A]' :
                        inv.status === 'Pending' ? 'bg-[#F59E0B]' :
                          'bg-[#EF4444]'
                        }`} />
                      {inv.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
                        style={{ fontFamily: PP }}
                      >
                        <Eye size={13} /> View Bill
                      </button>

                      <button
                        onClick={() => triggerToast(`Downloading invoice PDF for ${inv.id}...`)}
                        className="p-1.5 text-slate-500 hover:text-[#009688] hover:bg-teal-50 rounded-lg transition-colors"
                        title="Download Invoice PDF"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. PAYMENT HISTORY TIMELINE CARD SECTION ── */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Payment History Timeline</h2>
          <span className="text-xs text-[#009688] font-semibold flex items-center gap-1">
            <CheckCircle2 size={13} /> Verified Transactions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYMENT_HISTORY_RECORDS.map(rec => (
            <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#0D47A1]">{rec.referenceNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#66BB6A]">{rec.status}</span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>{rec.amount}</span>
                <span className="text-xs text-[#64748B]">{rec.date}</span>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 pt-1 border-t border-slate-200/60">
                <div>Method: <span className="font-medium text-[#111827]">{rec.method}</span></div>
                <div>Invoice: <span className="font-mono font-medium text-slate-700">{rec.invoiceId}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. RIGHT DRAWER: INVOICE & BILL DETAILS ── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

              {/* Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-base font-bold" style={{ fontFamily: PP }}>Invoice Breakdown</h2>
                  <span className="font-mono text-xs text-blue-200">{selectedInvoice.id}</span>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

                {/* Invoice Summary Card */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs text-[#64748B] block">Invoice Date</span>
                      <span className="font-semibold text-[#111827] text-xs">{selectedInvoice.date}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#64748B] block text-right">Payment Status</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${selectedInvoice.status === 'Paid' ? 'text-[#66BB6A]' : 'text-amber-600'
                        }`}>
                        {selectedInvoice.status}
                      </span>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[#64748B] text-[11px] block">Patient Name & ID</span>
                      <span className="font-bold text-[#111827]">Sarah Mitchell (P-9821)</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">Payment Type</span>
                      <span className="font-medium text-slate-700">Direct Patient Account</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">Doctor</span>
                      <span className="font-medium text-slate-700">{selectedInvoice.doctor}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">Department</span>
                      <span className="font-medium text-slate-700">{selectedInvoice.department}</span>
                    </div>
                  </div>
                </div>

                {/* Itemized Bill Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Itemized Services Breakdown
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {selectedInvoice.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#111827]">{item.description}</div>
                          <div className="text-[10px] text-[#64748B]">{item.category}</div>
                        </div>
                        <div className="font-bold text-[#111827]">{item.cost}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#111827] font-bold text-sm pt-1">
                      <span>Total Patient Amount</span>
                      <span className="text-[#0D47A1]" style={{ fontFamily: PP }}>{selectedInvoice.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Reference if Paid */}
                {selectedInvoice.paymentRef && (
                  <div className="p-4 rounded-2xl bg-green-50/80 border border-green-100 text-xs space-y-1">
                    <div className="font-bold text-[#66BB6A] flex items-center gap-1.5" style={{ fontFamily: PP }}>
                      <CheckCircle2 size={15} /> Payment Completed
                    </div>
                    <div className="text-slate-600">Ref: <span className="font-mono font-medium text-slate-900">{selectedInvoice.paymentRef}</span></div>
                    <div className="text-slate-600">Method: {selectedInvoice.paymentMethod}</div>
                    <div className="text-slate-500 text-[11px]">{selectedInvoice.paymentDate}</div>
                  </div>
                )}

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
                {selectedInvoice.status === 'Pending' && (
                  <button
                    onClick={() => handlePayInvoice(selectedInvoice)}
                    className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    <CreditCard size={15} /> Pay {selectedInvoice.amount} Now
                  </button>
                )}
                <button
                  onClick={() => triggerToast(`Downloading invoice PDF for ${selectedInvoice.id}...`)}
                  className={`py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827] hover:bg-slate-50 ${selectedInvoice.status === 'Pending' ? 'px-3' : 'flex-1'
                    }`}
                  style={{ fontFamily: PP }}
                >
                  Download Invoice
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── PATIENT PROFILE CENTER WORKSPACE SCREEN ─────────────────────────────

export function PatientProfileCenterScreen() {
  const [activeTab, setActiveTab] = useState<'info' | 'edit' | 'password'>('info')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Profile Data State
  const [profileData, setProfileData] = useState({
    name: 'Sarah Mitchell',
    patientId: 'P-9821',
    email: 'sarah.mitchell@example.com',
    phone: '+1 (555) 234-5678',
    dob: '1990-06-14',
    gender: 'Female',
    bloodGroup: 'O Rh Positive (O+)',
    address: '742 Evergreen Terrace, Apt 4B, Springfield, IL 62704',
    emergencyName: 'Robert Mitchell',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+1 (555) 876-5432',
  })

  // Edit Form Draft State
  const [editForm, setEditForm] = useState({ ...profileData })

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileData({ ...editForm })
    triggerToast('Profile information updated successfully!')
    setActiveTab('info')
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      triggerToast('Please enter your current password.')
      return
    }
    if (newPassword.length < 8) {
      triggerToast('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      triggerToast('New password and confirmation do not match.')
      return
    }
    triggerToast('Password changed successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setActiveTab('info')
  }

  // Password Strength Score
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' }
    let score = 0
    if (pass.length >= 8) score += 33
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 33
    if (/[^A-Za-z0-9]/.test(pass)) score += 34
    if (score <= 33) return { score: 33, label: 'Weak', color: 'bg-[#EF4444]' }
    if (score <= 66) return { score: 66, label: 'Medium', color: 'bg-[#F59E0B]' }
    return { score: 100, label: 'Strong', color: 'bg-[#66BB6A]' }
  }

  const passStrength = getPasswordStrength(newPassword)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>My Profile</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Patient Portal</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">My Profile</span>
          </div>
        </div>
      </div>

      {/* ── 2. PROFILE HEADER BANNER ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#0D47A1] text-white font-bold text-xl flex items-center justify-center shadow-md" style={{ fontFamily: PP }}>
              SM
            </div>
            <button
              onClick={() => triggerToast('Upload avatar picture...')}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#E5E7EB] text-[#0D47A1] flex items-center justify-center shadow-sm hover:bg-blue-50 transition-colors"
              title="Change Profile Picture"
            >
              <Edit size={12} />
            </button>
          </div>

          {/* Profile Basic Info */}
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>{profileData.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#66BB6A] border border-green-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" /> Active Patient
              </span>
            </div>
            <div className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Patient ID: <strong className="text-[#111827]">{profileData.patientId}</strong></span>
              <span>Email: <strong className="text-[#111827]">{profileData.email}</strong></span>
              <span>Phone: <strong className="text-[#111827]">{profileData.phone}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditForm({ ...profileData })
            setActiveTab('edit')
          }}
          className="px-4 py-2 rounded-xl bg-blue-50 text-[#0D47A1] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          style={{ fontFamily: PP }}
        >
          <Edit size={14} /> Edit Profile
        </button>
      </div>

      {/* ── 3. MAIN WORKSPACE WITH RIGHT PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left / Center Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-0.5">
            {[
              { id: 'info', label: 'Personal Information' },
              { id: 'edit', label: 'Edit Profile' },
              { id: 'password', label: 'Change Password' },
            ].map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-0.5 ${isActive
                    ? 'border-[#0D47A1] text-[#0D47A1]'
                    : 'border-transparent text-[#64748B] hover:text-[#111827]'
                    }`}
                  style={{ fontFamily: PP }}
                >
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* TAB 1: PERSONAL INFORMATION (Read-only cards) */}
          {activeTab === 'info' && (
            <div className="space-y-4">

              {/* Basic Details */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                  Basic Personal Details
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Full Name</span>
                    <span className="font-semibold text-[#111827]">{profileData.name}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Date of Birth</span>
                    <span className="font-semibold text-[#111827]">{profileData.dob} (34 Yrs)</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Gender</span>
                    <span className="font-semibold text-[#111827]">{profileData.gender}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Blood Group</span>
                    <span className="font-bold text-[#0D47A1]">{profileData.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Primary Language</span>
                    <span className="font-semibold text-[#111827]">English</span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                  Contact Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Phone Number</span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                      <Phone size={13} className="text-[#0D47A1]" /> {profileData.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Email Address</span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                      <Mail size={13} className="text-[#0D47A1]" /> {profileData.email}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#64748B] text-[11px] block">Residential Address</span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1.5 mt-0.5">
                      <MapPin size={13} className="text-[#0D47A1] shrink-0" /> {profileData.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                  Emergency Contact
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Contact Name</span>
                    <span className="font-semibold text-[#111827]">{profileData.emergencyName}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Relationship</span>
                    <span className="font-semibold text-[#111827]">{profileData.emergencyRelation}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Emergency Phone</span>
                    <span className="font-semibold text-red-600">{profileData.emergencyPhone}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: EDIT PROFILE FORM */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-[#111827] pb-3 border-b border-gray-100" style={{ fontFamily: PP }}>
                Edit Personal & Contact Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#111827] font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editForm.dob}
                    onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#111827] font-semibold mb-1">Residential Address *</label>
                  <input
                    type="text"
                    required
                    value={editForm.address}
                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={editForm.emergencyName}
                    onChange={e => setEditForm({ ...editForm, emergencyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.emergencyPhone}
                    onChange={e => setEditForm({ ...editForm, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Save size={14} /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-[#111827] pb-3 border-b border-gray-100 flex items-center gap-2" style={{ fontFamily: PP }}>
                <Key size={16} className="text-[#0D47A1]" /> Change Portal Password
              </h2>

              <div className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="block text-[#111827] font-semibold mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#64748B]">Password Strength</span>
                      <span className="font-bold text-[#111827]">{passStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passStrength.color}`}
                        style={{ width: `${passStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[#111827] font-semibold mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Lock size={14} /> Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right Panel: Quick Account Information */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
              Quick Account Information
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-[#64748B] text-[11px] block">Last Portal Login</span>
                <span className="font-semibold text-[#111827]">Today at 10:42 AM</span>
                <span className="text-[10px] text-slate-500 block">IP: 192.168.1.45 (Springfield, IL)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-[#64748B] text-[11px] block">Account Status</span>
                <span className="font-bold text-[#66BB6A] flex items-center gap-1">
                  <ShieldCheck size={14} /> Verified & Active
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-[#64748B] text-[11px] block">Portal Created Date</span>
                <span className="font-semibold text-[#111827]">January 15, 2023</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-[#64748B] text-[11px] block">Two-Factor Authentication</span>
                <span className="font-semibold text-[#0D47A1]">Enabled (SMS Verification)</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => triggerToast('Downloading encrypted account data archive...')}
                className="w-full py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Download Profile Data
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

// ─── RECEPTION PATIENT REGISTRATION SCREEN ───
export function ReceptionPatientRegistrationScreen({
  onBack,
  onBookAppointment,
  onViewProfile,
}: {
  onBack: () => void
  onBookAppointment?: (mrn: string) => void
  onViewProfile?: (mrn: string) => void
}) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    age: '',
    mobile: '',
    email: '',
    bloodGroup: '',
    maritalStatus: '',
    aadhaar: '',
    photo: null as string | null,
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    emergencyName: '',
    relationship: '',
    emergencyMobile: '',
    altContact: '',
    registrationType: 'New Patient',
    patientCategory: 'General',
    allergies: '',
    chronicDiseases: '',
    specialNotes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [generatedMrn, setGeneratedMrn] = useState('')

  // Recent Registrations Mock Data
  const recentRegistrations = [
    { name: 'Aisha Kumar', mrn: 'MRN-892105', time: '10:11 AM' },
    { name: 'Michael Vance', mrn: 'MRN-892109', time: '10:05 AM' },
    { name: 'Diana Prince', mrn: 'MRN-892110', time: '09:48 AM' },
  ]

  // Automatically calculate age from DOB
  const handleDobChange = (dobValue: string) => {
    let calculatedAge = ''
    if (dobValue) {
      const birthDate = new Date(dobValue)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      calculatedAge = age >= 0 ? age.toString() : ''
    }
    setFormData(prev => ({ ...prev, dob: dobValue, age: calculatedAge }))
    if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }))
  }

  // Handle Input Changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle Photo Upload Mock
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!formData.gender) newErrors.gender = 'Gender selection is required'
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required'
    } else if (!/^\+?[0-9]{10,14}$/.test(formData.mobile.replace(/[\s-]/g, ''))) {
      newErrors.mobile = 'Enter a valid mobile number'
    }
    if (!formData.registrationType) newErrors.registrationType = 'Registration Type is required'
    if (!formData.patientCategory) newErrors.patientCategory = 'Patient Category is required'

    // Duplicate Check Mock Validation
    if (formData.mobile === '9876543210' || formData.mobile === '+91 9876543210') {
      newErrors.mobile = 'Patient already registered with this mobile number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const newMrn = `MRN-${Math.floor(100000 + Math.random() * 900000)}`
      setGeneratedMrn(newMrn)
      setShowSuccessDialog(true)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9] relative flex flex-col min-h-screen pb-24" style={{ fontFamily: RB }}>
      
      {/* ── HEADER & BREADCRUMBS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Reception Management</button>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">Patient Registration</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Register New Patient</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Create a new patient record for hospital services.</p>
        </div>

        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-200 transition-all" 
          style={{ fontFamily: PP }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </div>

      {/* ── TWO-COLUMN ENTERPRISE WORKSPACE ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN: REGISTRATION FORM (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">

          {/* SECTION 01: Personal Information */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
              <User size={16} className="text-[#0D47A1]" /> Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Full Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border ${errors.fullName ? 'border-[#EF4444]' : 'border-[#E5E7EB]'} text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all`}
                />
                {errors.fullName && <p className="text-[11px] text-[#EF4444] mt-1 font-medium">{errors.fullName}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Gender <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border ${errors.gender ? 'border-[#EF4444]' : 'border-[#E5E7EB]'} text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-[11px] text-[#EF4444] mt-1 font-medium">{errors.gender}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => handleDobChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              {/* Age (Auto calculated) */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Age <span className="text-slate-400 font-normal">(Auto calculated)</span>
                </label>
                <input
                  type="text"
                  value={formData.age}
                  readOnly
                  placeholder="Auto-calculated from DOB"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-xs text-[#64748B] font-mono focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Mobile Number <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={e => handleChange('mobile', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border ${errors.mobile ? 'border-[#EF4444]' : 'border-[#E5E7EB]'} text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all`}
                />
                {errors.mobile && <p className="text-[11px] text-[#EF4444] mt-1 font-medium">{errors.mobile}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={e => handleChange('bloodGroup', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Marital Status</label>
                <select
                  value={formData.maritalStatus}
                  onChange={e => handleChange('maritalStatus', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {/* Aadhaar / National ID */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Aadhaar / National ID <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  value={formData.aadhaar}
                  onChange={e => handleChange('aadhaar', e.target.value)}
                  placeholder="12-digit Aadhaar Number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] font-mono focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              {/* Photo Upload */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Patient Photograph Upload <span className="text-slate-400 font-normal">(Optional)</span></label>
                <div className="flex items-center gap-4">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-[#E5E7EB]" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-[#E5E7EB] flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                  )}
                  <label className="cursor-pointer px-4 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-all">
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {formData.photo && (
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, photo: null }))} className="text-xs text-[#EF4444] font-semibold hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 02: Address Information */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
              <MapPin size={16} className="text-[#0D47A1]" /> Address Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Address Line 1</label>
                <input
                  type="text"
                  value={formData.address1}
                  onChange={e => handleChange('address1', e.target.value)}
                  placeholder="House/Flat No., Building, Street Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Address Line 2 <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  value={formData.address2}
                  onChange={e => handleChange('address2', e.target.value)}
                  placeholder="Locality, Landmark"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  placeholder="City Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => handleChange('state', e.target.value)}
                  placeholder="State Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={e => handleChange('pincode', e.target.value)}
                  placeholder="6-digit Pincode"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] font-mono focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={e => handleChange('country', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 03: Emergency Contact */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
              <Phone size={16} className="text-[#0D47A1]" /> Emergency Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={e => handleChange('emergencyName', e.target.value)}
                  placeholder="Full name of emergency contact"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Relationship</label>
                <select
                  value={formData.relationship}
                  onChange={e => handleChange('relationship', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                >
                  <option value="">Select Relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.emergencyMobile}
                  onChange={e => handleChange('emergencyMobile', e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Alternative Contact Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input
                  type="tel"
                  value={formData.altContact}
                  onChange={e => handleChange('altContact', e.target.value)}
                  placeholder="Landline or Secondary Mobile"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 04: Registration Details */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
              <FileText size={16} className="text-[#0D47A1]" /> Registration Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* MRN Read Only */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">MRN (Auto-generated)</label>
                <input
                  type="text"
                  value="MRN-892112 (Will be generated on submit)"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-xs text-[#0D47A1] font-mono font-bold cursor-not-allowed"
                />
              </div>

              {/* Registration Date */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Registration Date</label>
                <input
                  type="text"
                  value="2026-07-24 (Today)"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-xs text-[#64748B] font-mono cursor-not-allowed"
                />
              </div>

              {/* Registered By */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Registered By</label>
                <input
                  type="text"
                  value="Front Desk Receptionist (Current User)"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-xs text-[#64748B] font-semibold cursor-not-allowed"
                />
              </div>

              {/* Patient Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Patient Category <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={formData.patientCategory}
                  onChange={e => handleChange('patientCategory', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all font-semibold"
                >
                  <option value="General">General</option>
                  <option value="VIP">VIP</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              {/* Registration Type Radio Buttons */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#111827] mb-2">
                  Registration Type <span className="text-[#EF4444]">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="registrationType"
                      value="New Patient"
                      checked={formData.registrationType === 'New Patient'}
                      onChange={e => handleChange('registrationType', e.target.value)}
                      className="w-4 h-4 text-[#0D47A1] focus:ring-[#0D47A1]"
                    />
                    New Patient Registration
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="registrationType"
                      value="Existing Patient Update"
                      checked={formData.registrationType === 'Existing Patient Update'}
                      onChange={e => handleChange('registrationType', e.target.value)}
                      className="w-4 h-4 text-[#0D47A1] focus:ring-[#0D47A1]"
                    />
                    Existing Patient Re-registration / Update
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 05: Medical Alerts */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-[#0D47A1] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2" style={{ fontFamily: PP }}>
              <AlertTriangle size={16} className="text-[#F59E0B]" /> Medical Alerts & Notes
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Known Allergies</label>
                <textarea
                  rows={2}
                  value={formData.allergies}
                  onChange={e => handleChange('allergies', e.target.value)}
                  placeholder="e.g. Penicillin, Peanuts, Latex"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Chronic Diseases</label>
                <textarea
                  rows={2}
                  value={formData.chronicDiseases}
                  onChange={e => handleChange('chronicDiseases', e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">Special Notes <span className="text-slate-400 font-normal">(Optional)</span></label>
                <textarea
                  rows={2}
                  value={formData.specialNotes}
                  onChange={e => handleChange('specialNotes', e.target.value)}
                  placeholder="e.g. Requires wheelchair assistance, prefers afternoon slots"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">

          {/* CARD 01: Registration Summary */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Registration Summary
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Patient Name</span>
                <span className="font-bold text-[#111827]">{formData.fullName || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">MRN</span>
                <span className="font-mono font-bold text-[#0D47A1]">Auto-generated</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Registration Date</span>
                <span className="font-mono text-[#111827]">2026-07-24</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Registration Type</span>
                <span className="font-semibold text-[#009688]">{formData.registrationType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-[#64748B]">Patient Category</span>
                <span className="font-semibold text-[#111827]">{formData.patientCategory}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#66BB6A]">
                  Active Draft
                </span>
              </div>
            </div>
          </div>

          {/* CARD 02: Hospital Registration Guidelines */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: PP }}>
              <Info size={15} className="text-[#0D47A1]" /> Registration Guidelines
            </h3>
            <ul className="space-y-2 text-xs text-[#64748B] list-disc list-inside leading-relaxed">
              <li>Verify patient identity with government ID.</li>
              <li>Verify mobile number to avoid duplicate entries.</li>
              <li>Ensure mandatory fields (*) are completed.</li>
              <li>MRN is generated automatically upon submission.</li>
            </ul>
          </div>

          {/* CARD 03: Recent Registrations */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Recent Registrations
            </h3>
            <div className="divide-y divide-gray-100">
              {recentRegistrations.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#111827]">{item.name}</div>
                    <div className="text-[10px] font-mono text-[#0D47A1]">{item.mrn}</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </form>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 shadow-lg z-30 flex items-center justify-end gap-3 px-8">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
          style={{ fontFamily: PP }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-md flex items-center gap-2"
          style={{ fontFamily: PP }}
        >
          <UserPlus size={16} /> Register Patient & Generate MRN
        </button>
      </div>

      {/* ── SUCCESS DIALOG MODAL ── */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mb-1">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Registered Successfully</h3>
              <p className="text-xs text-[#64748B]">New patient master record created in HMS.</p>
            </div>

            {/* Generated Details Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[#64748B]">Generated MRN</span>
                <span className="font-mono text-base font-bold text-[#0D47A1]">{generatedMrn}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Patient Name</span>
                <span className="font-bold text-[#111827]">{formData.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Registration Date</span>
                <span className="font-mono text-[#111827]">2026-07-24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Status</span>
                <span className="font-bold text-[#66BB6A]">Active Master Profile</span>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowSuccessDialog(false)
                  if (onBookAppointment) onBookAppointment(generatedMrn)
                  else onBack()
                }}
                className="w-full py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Calendar size={15} /> Book Appointment Now
              </button>
              <button
                onClick={() => {
                  setShowSuccessDialog(false)
                  if (onViewProfile) onViewProfile(generatedMrn)
                  else onBack()
                }}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-all"
                style={{ fontFamily: PP }}
              >
                View Patient Profile
              </button>
              <button
                onClick={() => {
                  setShowSuccessDialog(false)
                  setFormData({
                    fullName: '', gender: '', dob: '', age: '', mobile: '', email: '',
                    bloodGroup: '', maritalStatus: '', aadhaar: '', photo: null,
                    address1: '', address2: '', city: '', state: '', pincode: '', country: 'India',
                    emergencyName: '', relationship: '', emergencyMobile: '', altContact: '',
                    registrationType: 'New Patient', patientCategory: 'General',
                    allergies: '', chronicDiseases: '', specialNotes: '',
                  })
                }}
                className="w-full py-2 rounded-xl text-xs text-[#64748B] font-medium hover:bg-slate-50 transition-all"
              >
                Register Another Patient
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── RECEPTION PATIENT SEARCH SCREEN ───
export type PatientSearchResult = {
  mrn: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  mobile: string
  bloodGroup: string
  regDate: string
  status: 'Active' | 'Inactive' | 'Registered' | 'Scheduled' | 'Checked-In' | 'Completed'
  regType: 'New Patient' | 'Existing Patient Update'
  lastVisit?: {
    date: string
    doctor: string
    department: string
    status: string
  }
  upcomingAppointment?: {
    date: string
    time: string
    doctor: string
    department: string
    status: string
  }
}
type ChipVariant = 'success' | 'warning' | 'error' | 'info' | 'teal' | 'default'

function Av({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const palette = ['bg-[#0D47A1]', 'bg-[#009688]', 'bg-violet-600', 'bg-rose-500', 'bg-amber-600']
  const bg = palette[name.charCodeAt(0) % palette.length]
  const sz = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }[size]
  return (
    <div className={`${sz} ${bg} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ fontFamily: PP }}>
      {initials}
    </div>
  )
}

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

export function PatientSearchScreen({
  onBack,
  onPatientSelect,
  onRegisterClick,
  onBookAppointmentClick,
  onCheckInClick,
  userRole = 'Receptionist',
}: {
  onBack?: () => void
  onPatientSelect?: (mrn: string) => void
  onRegisterClick?: () => void
  onBookAppointmentClick?: (mrn: string) => void
  onCheckInClick?: (mrn: string) => void
  userRole?: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [regTypeFilter, setRegTypeFilter] = useState('All Types')
  const [genderFilter, setGenderFilter] = useState('All Genders')
  const [regDateFilter, setRegDateFilter] = useState('All Dates')
  const [selectedPatientId, setSelectedPatientId] = useState<string>('MRN-892101')

  const [patients] = useState<PatientSearchResult[]>([
    {
      mrn: 'MRN-892101',
      name: 'Sarah Mitchell',
      age: 34,
      gender: 'Female',
      mobile: '+91 98765 43210',
      bloodGroup: 'A+',
      regDate: '2026-03-12',
      status: 'Checked-In',
      regType: 'New Patient',
      lastVisit: { date: '2026-06-15', doctor: 'Dr. Arjun Mehta', department: 'Cardiology', status: 'Completed' },
      upcomingAppointment: { date: '2026-07-24', time: '09:00 AM', doctor: 'Dr. Arjun Mehta', department: 'Cardiology', status: 'In Queue' },
    },
    {
      mrn: 'MRN-892102',
      name: 'James Thornton',
      age: 67,
      gender: 'Male',
      mobile: '+91 98765 43211',
      bloodGroup: 'O+',
      regDate: '2026-02-10',
      status: 'Scheduled',
      regType: 'Existing Patient Update',
      lastVisit: { date: '2026-05-20', doctor: 'Dr. Priya Sharma', department: 'General OPD', status: 'Completed' },
      upcomingAppointment: { date: '2026-07-24', time: '09:15 AM', doctor: 'Dr. Priya Sharma', department: 'General OPD', status: 'Scheduled' },
    },
    {
      mrn: 'MRN-892103',
      name: 'Emma Reyes',
      age: 28,
      gender: 'Female',
      mobile: '+91 98765 43212',
      bloodGroup: 'B+',
      regDate: '2026-05-01',
      status: 'Active',
      regType: 'New Patient',
      lastVisit: { date: '2026-05-01', doctor: 'Dr. Sunita Patel', department: 'Gynecology', status: 'Completed' },
      upcomingAppointment: { date: '2026-07-25', time: '10:00 AM', doctor: 'Dr. Sunita Patel', department: 'Gynecology', status: 'Confirmed' },
    },
    {
      mrn: 'MRN-892104',
      name: 'Robert Chen',
      age: 52,
      gender: 'Male',
      mobile: '+91 98765 43213',
      bloodGroup: 'AB+',
      regDate: '2025-11-18',
      status: 'Registered',
      regType: 'Existing Patient Update',
      lastVisit: { date: '2026-04-10', doctor: 'Dr. Arjun Mehta', department: 'Cardiology', status: 'Completed' },
    },
    {
      mrn: 'MRN-892105',
      name: 'Aisha Kumar',
      age: 41,
      gender: 'Female',
      mobile: '+91 98765 43214',
      bloodGroup: 'O-',
      regDate: '2026-07-24',
      status: 'Registered',
      regType: 'New Patient',
      upcomingAppointment: { date: '2026-07-24', time: '10:15 AM', doctor: 'Dr. Rajesh Kapoor', department: 'Neurology', status: 'Scheduled' },
    },
    {
      mrn: 'MRN-892106',
      name: 'David Walsh',
      age: 38,
      gender: 'Male',
      mobile: '+91 98765 43215',
      bloodGroup: 'A-',
      regDate: '2025-08-30',
      status: 'Inactive',
      regType: 'Existing Patient Update',
      lastVisit: { date: '2025-10-12', doctor: 'Dr. Priya Sharma', department: 'General OPD', status: 'Completed' },
    },
  ])

  // Filter Logic
  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase().trim()
    const matchSearch = q === '' ||
      p.mrn.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.mobile.includes(q)

    const matchStatus = statusFilter === 'All Statuses' || p.status === statusFilter
    const matchType = regTypeFilter === 'All Types' || p.regType === regTypeFilter
    const matchGender = genderFilter === 'All Genders' || p.gender === genderFilter
    const matchDate = regDateFilter === 'All Dates' || (regDateFilter === 'Today' && p.regDate === '2026-07-24')

    return matchSearch && matchStatus && matchType && matchGender && matchDate
  })

  const selectedPatient = patients.find(p => p.mrn === selectedPatientId) || filteredPatients[0]

  const resetFilters = () => {
    setSearchQuery('')
    setStatusFilter('All Statuses')
    setRegTypeFilter('All Types')
    setGenderFilter('All Genders')
    setRegDateFilter('All Dates')
  }

  const getStatusChipVariant = (status: string): ChipVariant => {
    switch (status) {
      case 'Active': return 'success'
      case 'Checked-In': return 'info'
      case 'Scheduled': return 'teal'
      case 'Registered': return 'info'
      case 'Completed': return 'success'
      case 'Inactive': return 'default'
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
            <span className="font-semibold text-[#0D47A1]">Patient Search</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Search</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Search and manage existing patient records.</p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {userRole !== 'admin' && userRole !== 'Hospital Admin' && userRole !== 'Super Admin' && (
            <button 
              onClick={onRegisterClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm" 
              style={{ fontFamily: PP }}
            >
              <UserPlus size={15} />
              Register New Patient
            </button>
          )}
          <button 
            onClick={() => onBookAppointmentClick && selectedPatient ? onBookAppointmentClick(selectedPatient.mrn) : null}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-sm" 
            style={{ fontFamily: PP }}
          >
            <Calendar size={15} />
            Book Appointment
          </button>
        </div>
      </div>

      {/* ── GLOBAL ENTERPRISE SEARCH & FILTER BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by MRN, Patient Name, Mobile Number or Appointment ID..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all shadow-inner"
            style={{ fontFamily: RB }}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Registered</option>
              <option>Scheduled</option>
              <option>Checked-In</option>
              <option>Completed</option>
            </select>

            <select
              value={regTypeFilter}
              onChange={e => setRegTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Types</option>
              <option>New Patient</option>
              <option>Existing Patient Update</option>
            </select>

            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Genders</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <select
              value={regDateFilter}
              onChange={e => setRegDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] font-medium focus:outline-none"
            >
              <option>All Dates</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl text-xs text-[#EF4444] font-semibold hover:bg-red-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Result Counter Summary */}
          <div className="text-xs text-[#64748B] font-medium">
            Found <span className="font-bold text-[#0D47A1]">{filteredPatients.length}</span> patient records
          </div>
        </div>
      </div>

      {/* ── ENTERPRISE LAYOUT GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN: ENTERPRISE DATA TABLE (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Matching Patient Records</h2>
                <p className="text-xs text-[#64748B]">Click on any row to view complete record details in the context panel</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]" style={{ fontFamily: PP }}>
                    <th className="px-4 py-3">Photo</th>
                    <th className="px-4 py-3">MRN</th>
                    <th className="px-4 py-3">Patient Name</th>
                    <th className="px-4 py-3">Age / Gender</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Blood Group</th>
                    <th className="px-4 py-3">Last Visit</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(p => {
                      const isSelected = selectedPatientId === p.mrn
                      return (
                        <tr 
                          key={p.mrn} 
                          onClick={() => setSelectedPatientId(p.mrn)}
                          className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60 font-medium' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <Av name={p.name} size="sm" />
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">{p.mrn}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-[#111827]">{p.name}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{p.age} yrs · {p.gender}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{p.mobile}</td>
                          <td className="px-4 py-3 font-semibold text-[#009688]">{p.bloodGroup}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{p.lastVisit?.date || '—'}</td>
                          <td className="px-4 py-3">
                            <Chip label={p.status} variant={getStatusChipVariant(p.status)} />
                          </td>
                          <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => onPatientSelect && onPatientSelect(p.mrn)}
                                title="View Patient Profile"
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                              >
                                Profile
                              </button>
                              <button 
                                onClick={() => onBookAppointmentClick && onBookAppointmentClick(p.mrn)}
                                title="Book Appointment"
                                className="px-2 py-1 rounded-lg bg-teal-50 text-[#009688] text-[11px] font-semibold hover:bg-teal-100 transition-colors"
                              >
                                Book
                              </button>
                              {p.status === 'Scheduled' && (
                                <button 
                                  onClick={() => onCheckInClick && onCheckInClick(p.mrn)}
                                  title="Check-In Patient"
                                  className="px-2 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                                >
                                  Check-In
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={32} className="text-slate-300" />
                          <p className="text-sm font-semibold text-[#111827]">No patient records match your search.</p>
                          <p className="text-xs text-slate-400">Complete the required patient information to generate a new MRN.</p>
                          <button 
                            onClick={onRegisterClick}
                            className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all flex items-center gap-1.5" 
                            style={{ fontFamily: PP }}
                          >
                            <UserPlus size={15} /> Register New Patient
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
              <span>Showing 1-{filteredPatients.length} of {filteredPatients.length} records</span>
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

          {selectedPatient ? (
            <>
              {/* CARD 01: Selected Patient Summary */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
                  Selected Patient Summary
                </h3>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                  <Av name={selectedPatient.name} size="lg" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">{selectedPatient.name}</h4>
                    <span className="font-mono text-xs font-bold text-[#0D47A1]">{selectedPatient.mrn}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-[#64748B] block">Age / Gender</span>
                    <span className="font-bold text-[#111827]">{selectedPatient.age} yrs · {selectedPatient.gender}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50">
                    <span className="text-[10px] text-[#64748B] block">Blood Group</span>
                    <span className="font-bold text-[#009688]">{selectedPatient.bloodGroup}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 col-span-2">
                    <span className="text-[10px] text-[#64748B] block">Mobile Number</span>
                    <span className="font-mono font-bold text-[#111827]">{selectedPatient.mobile}</span>
                  </div>
                </div>
              </div>

              {/* CARD 02: Recent Visit */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between" style={{ fontFamily: PP }}>
                  <span>Recent Visit</span>
                  <Activity size={15} className="text-[#0D47A1]" />
                </h3>
                {selectedPatient.lastVisit ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Last Consultation</span>
                      <span className="font-mono font-bold text-[#111827]">{selectedPatient.lastVisit.date}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Doctor</span>
                      <span className="font-semibold text-[#111827]">{selectedPatient.lastVisit.doctor}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Department</span>
                      <span className="text-slate-600">{selectedPatient.lastVisit.department}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B]">Visit Status</span>
                      <span className="font-semibold text-[#66BB6A]">{selectedPatient.lastVisit.status}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-2">No previous consultation history recorded.</p>
                )}
              </div>

              {/* CARD 03: Upcoming Appointment */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between" style={{ fontFamily: PP }}>
                  <span>Upcoming Appointment</span>
                  <Calendar size={15} className="text-[#009688]" />
                </h3>
                {selectedPatient.upcomingAppointment ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Appointment Date</span>
                      <span className="font-mono font-bold text-[#0D47A1]">{selectedPatient.upcomingAppointment.date}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Time Slot</span>
                      <span className="font-mono font-bold text-[#009688]">{selectedPatient.upcomingAppointment.time}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Doctor</span>
                      <span className="font-semibold text-[#111827]">{selectedPatient.upcomingAppointment.doctor}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B]">Status</span>
                      <Chip label={selectedPatient.upcomingAppointment.status} variant="teal" />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-2">No upcoming appointments booked for today.</p>
                )}
              </div>

              {/* CARD 04: Quick Actions */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-2.5">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
                  Quick Actions
                </h3>
                <button 
                  onClick={() => onPatientSelect && onPatientSelect(selectedPatient.mrn)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-semibold text-[#0D47A1] transition-colors"
                >
                  View Profile <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => onBookAppointmentClick && onBookAppointmentClick(selectedPatient.mrn)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-[#009688] transition-colors"
                >
                  Book Appointment <ChevronRight size={14} />
                </button>
                <button 
                  onClick={onRegisterClick}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#111827] transition-colors"
                >
                  Register New Patient <ChevronRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm text-center text-xs text-slate-400">
              Select a patient from the search results to inspect record details.
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

// ─── RECEPTION PATIENT PROFILE SCREEN (RECEPTIONIST VIEW) ────────────────────
export interface ReceptionPatientProfileScreenProps {
  onBack?: () => void
  onEditPatient?: () => void
  onBookAppointment?: (mrn?: string) => void
  onCheckInClick?: (token?: string, mrn?: string) => void
  patientMrn?: string
  userRole?: string
}

export function ReceptionPatientProfileScreen({
  onBack,
  onEditPatient,
  onBookAppointment,
  onCheckInClick,
  patientMrn = 'MRN-892101',
}: ReceptionPatientProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'visits' | 'medical-history' | 'billing' | 'documents'>('overview')

  // Patient Mock Profile Data
  const patient = {
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    name: 'Sarah Mitchell',
    mrn: patientMrn,
    age: 34,
    gender: 'Female',
    dob: '1990-06-14',
    maritalStatus: 'Married',
    bloodGroup: 'Blood O+',
    mobile: '+1 (555) 234-5678',
    email: 'sarah.m@example.com',
    emergencyContact: '+1 (555) 345-6789 (Spouse: David Mitchell)',
    address: '123 Healthcare Ave, Apt 4B, NY 10001',
    category: 'Regular Outpatient',
    status: 'Active',
    regDate: 'Mar 12, 2024',
    registrationType: 'Desk Registration',
    assignedDoctor: 'Dr. A. Mehta',
    department: 'Cardiology',
  }

  // Appointment History Mock (Reception Scope)
  const appointmentHistory = [
    { id: 'APT-1024', doctor: 'Dr. A. Mehta', dept: 'Cardiology', date: 'March 15, 2024', time: '10:30 AM', type: 'Follow-up Visit', status: 'Scheduled' },
    { id: 'APT-1018', doctor: 'Dr. P. Sharma', dept: 'General Medicine', date: 'March 28, 2024', time: '02:00 PM', type: 'OPD Consultation', status: 'Scheduled' },
    { id: 'APT-0982', doctor: 'Dr. A. Mehta', dept: 'Cardiology', date: 'March 12, 2024', time: '09:45 AM', type: 'OPD Consultation', status: 'Completed' },
  ]

  // Visit History Mock (Operational Only - No clinical diagnosis details)
  const visitHistory = [
    { id: 'VIS-2024-001', date: 'March 12, 2024', doctor: 'Dr. A. Mehta', dept: 'Cardiology', status: 'Completed' },
    { id: 'VIS-2024-002', date: 'February 10, 2024', doctor: 'Dr. P. Sharma', dept: 'General Medicine', status: 'Completed' },
    { id: 'VIS-2023-089', date: 'November 14, 2023', doctor: 'Dr. R. Kapoor', dept: 'Neurology', status: 'Completed' },
  ]

  // Billing Summary Mock (Read-Only)
  const billingSummary = [
    { invoiceNo: 'INV-10245', appointment: 'APT-1024', date: 'March 12, 2024', amount: '$125.00', status: 'Pending' },
    { invoiceNo: 'INV-10189', appointment: 'APT-0982', date: 'February 10, 2024', amount: '$220.00', status: 'Paid' },
  ]

  // Timeline Events Mock
  const timelineEvents = [
    { time: 'Today, 09:15 AM', title: 'Patient Checked-In', desc: 'Checked in at Reception Counter 02 by Staff Mark', icon: UserCheck, color: 'text-[#009688] bg-teal-50' },
    { time: 'Today, 08:30 AM', title: 'Appointment Booked', desc: 'Booked APT-1024 for Dr. A. Mehta', icon: Calendar, color: 'text-[#0D47A1] bg-blue-50' },
    { time: '2024-03-12, 10:30 AM', title: 'Completed Visit', desc: 'General OPD Visit with Dr. P. Sharma', icon: CheckCircle2, color: 'text-[#66BB6A] bg-green-50' },
    { time: '2024-03-12, 09:00 AM', title: 'Registration Created', desc: 'Initial Master Patient Registration created', icon: FileText, color: 'text-slate-600 bg-slate-100' },
  ]

  const getStatusChipVariant = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'info'
      case 'Checked-In': return 'teal'
      case 'Waiting': return 'warning'
      case 'Completed': return 'success'
      case 'Cancelled': return 'error'
      case 'Paid': return 'success'
      case 'Pending': return 'warning'
      default: return 'default'
    }
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'appointments' as const, label: 'Appointments' },
    { id: 'visits' as const, label: 'Visit History' },
    { id: 'medical-history' as const, label: 'Medical History' },
    { id: 'billing' as const, label: 'Billing' },
    { id: 'documents' as const, label: 'Documents' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      <div className="w-full space-y-6">

        {/* ── HEADER & BREADCRUMBS (MATCHES HOSPITAL ADMIN PATIENT PROFILE) ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBack} className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Profile</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-8" style={{ fontFamily: RB }}>
            <span>Reception Management</span>
            <ChevronRight size={13} className="text-slate-300" />
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Patient Search</button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-[#111827]">{patient.name}</span>
          </div>
        </div>

        {/* ── REUSABLE PATIENT HERO HEADER (MATCHES HOSPITAL ADMIN PATIENT PROFILE HERO) ── */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name={patient.name} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>{patient.name}</h2>
                <span className="text-[10px] font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{patient.mrn}</span>
                <StatusBadge status={patient.status} />
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-1" style={{ fontFamily: RB }}>
                <span className="flex items-center gap-1.5 font-medium"><UserCheck size={14} className="text-slate-400" /> {patient.age} Y / {patient.gender}</span>
                <span className="flex items-center gap-1.5 font-medium"><Droplets size={14} className="text-red-500" /> {patient.bloodGroup}</span>
                <span className="flex items-center gap-1.5 font-medium"><Phone size={14} className="text-slate-400" /> {patient.mobile}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                <span>Reg: {patient.regDate}</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1"><Stethoscope size={13} className="text-[#009688]" /> {patient.assignedDoctor} ({patient.department})</span>
              </div>
            </div>
          </div>

          {/* RECEPTION-SPECIFIC QUICK ACTION BUTTONS IN HERO */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onBookAppointment?.(patient.mrn)}
              className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Calendar size={14} /> Book Appointment
            </button>
            <button
              onClick={() => onCheckInClick?.(undefined, patient.mrn)}
              className="px-3.5 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <UserCheck size={14} /> Patient Check-In
            </button>
            <button
              onClick={onEditPatient}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Edit size={14} className="text-slate-500" /> Edit Patient Information
            </button>
            <button
              onClick={() => alert(`Printing official Patient Card for ${patient.name} (${patient.mrn})...`)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Printer size={14} className="text-slate-500" /> Print Patient Card
            </button>
          </div>
        </div>

        {/* ── KPI SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Total Visits</div>
            <div className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>12</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Last Visit</div>
            <div className="text-xs font-bold text-[#111827] mt-1">Mar 12, 2024</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Upcoming</div>
            <div className="text-xs font-bold text-[#0D47A1] mt-1">Mar 15, 2024</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Active Queue</div>
            <div className="text-xl font-bold text-[#009688]" style={{ fontFamily: PP }}>TK-086</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Billing Status</div>
            <div className="text-xs font-bold text-green-600 mt-1">Cleared</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">Category</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Regular OPD</div>
          </div>
        </div>

        {/* ── THREE-COLUMN LAYOUT (DESKTOP) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* LEFT COLUMN: PATIENT SUMMARY CARD (COMPACT) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between" style={{ fontFamily: PP }}>
                <span>Patient Summary</span>
                <User size={15} className="text-[#0D47A1]" />
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#64748B] block text-[11px]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{patient.mrn}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Age &amp; Gender</span>
                  <span className="text-[#111827]">{patient.age} Yrs · {patient.gender}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Blood Group</span>
                  <span className="font-semibold text-[#111827]">{patient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Mobile Number</span>
                  <span className="font-mono text-[#111827]">{patient.mobile}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Primary OPD Department</span>
                  <span className="font-semibold text-[#111827]">{patient.department}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Assigned Doctor</span>
                  <span className="font-semibold text-[#111827]">{patient.assignedDoctor}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Current Status</span>
                  <StatusBadge status={patient.status} />
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: REUSABLE PATIENT PROFILE TABS (6 COLS) */}
          <div className="xl:col-span-6 space-y-6">

            {/* TAB NAVIGATION BAR */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex overflow-x-auto gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'bg-[#0D47A1] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  style={{ fontFamily: PP }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* DYNAMIC TAB CONTENT CONTAINER */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[420px]" style={{ fontFamily: RB }}>

              {/* TAB 01: OVERVIEW (CONTAINS DETAILED PERSONAL INFO, EMERGENCY CONTACT, REGISTRATION DETAILS) */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Detailed Personal Information & Emergency Contact */}
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D47A1]" style={{ fontFamily: PP }}>
                        Personal &amp; Emergency Contact Details
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Date of Birth &amp; Marital Status</span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">{patient.dob} ({patient.age} Yrs) · {patient.maritalStatus}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Residential Address</span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">{patient.address}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Email Address</span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">{patient.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Emergency Contact Person &amp; Phone</span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">{patient.emergencyContact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Master Registration Details */}
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#009688]" style={{ fontFamily: PP }}>
                        Registration &amp; Reception Details
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Registration Date</span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">{patient.regDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Registration Type</span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">{patient.registrationType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Patient Category</span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">{patient.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Primary Care Department</span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">{patient.department} ({patient.assignedDoctor})</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Recent Appointments Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600" style={{ fontFamily: PP }}>Recent Appointments Summary</h3>
                      <button onClick={() => setActiveTab('appointments')} className="text-xs font-bold text-[#0D47A1] hover:underline">View All</button>
                    </div>
                    <div className="space-y-2">
                      {appointmentHistory.slice(0, 2).map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                          <div>
                            <div className="font-bold text-[#111827] text-xs">{a.doctor}</div>
                            <div className="text-[11px] text-slate-500">{a.dept} • {a.date} ({a.time})</div>
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 02: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Appointment History</h3>
                    <button
                      onClick={() => onBookAppointment?.(patient.mrn)}
                      className="px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-all flex items-center gap-1"
                      style={{ fontFamily: PP }}
                    >
                      <Calendar size={14} /> Book Appointment
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]" style={{ fontFamily: PP }}>
                          <th className="px-3 py-2.5">Appt ID</th>
                          <th className="px-3 py-2.5">Doctor</th>
                          <th className="px-3 py-2.5">Department</th>
                          <th className="px-3 py-2.5">Date &amp; Time</th>
                          <th className="px-3 py-2.5">Status</th>
                          <th className="px-3 py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#111827]">
                        {appointmentHistory.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-3 font-mono font-bold text-[#0D47A1]">{item.id}</td>
                            <td className="px-3 py-3 font-semibold">{item.doctor}</td>
                            <td className="px-3 py-3 text-slate-600">{item.dept}</td>
                            <td className="px-3 py-3 font-mono text-slate-500">{item.date} · {item.time}</td>
                            <td className="px-3 py-3"><Chip label={item.status} variant={getStatusChipVariant(item.status)} /></td>
                            <td className="px-3 py-3 text-right">
                              {item.status === 'Scheduled' ? (
                                <button
                                  onClick={() => onCheckInClick?.(item.id, patient.mrn)}
                                  className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                                >
                                  Check-In
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium">View Only</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 03: VISIT HISTORY */}
              {activeTab === 'visits' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Patient Visit History</h3>
                      <p className="text-[11px] text-[#64748B]">Operational visit timeline log</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-semibold">Reception Scope</span>
                  </div>
                  <div className="space-y-3">
                    {visitHistory.map((visit) => (
                      <div key={visit.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#111827]" style={{ fontFamily: PP }}>{visit.doctor} ({visit.dept})</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">Visit ID: {visit.id} · Date: {visit.date}</div>
                        </div>
                        <Chip label={visit.status} variant="success" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 04: MEDICAL HISTORY (READ-ONLY OPERATIONAL SCOPE) */}
              {activeTab === 'medical-history' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Medical History Overview</h3>
                    <span className="text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">Operational View</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="font-semibold text-[#111827]">Primary Clinical Profile</div>
                    <p className="text-slate-600 leading-relaxed">No active critical alerts logged. Operational medical record flags indicate regular OPD checkups with Cardiology and General OPD.</p>
                  </div>
                </div>
              )}

              {/* TAB 05: BILLING */}
              {activeTab === 'billing' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Billing &amp; Payment Records</h3>
                    <span className="text-[10px] bg-[#0D47A1]/10 text-[#0D47A1] px-2 py-0.5 rounded font-bold">Read-Only</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]" style={{ fontFamily: PP }}>
                          <th className="px-3 py-2.5">Invoice No</th>
                          <th className="px-3 py-2.5">Appointment</th>
                          <th className="px-3 py-2.5">Date</th>
                          <th className="px-3 py-2.5">Amount</th>
                          <th className="px-3 py-2.5">Payment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#111827]">
                        {billingSummary.map((inv, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-3 font-mono font-bold text-[#0D47A1]">{inv.invoiceNo}</td>
                            <td className="px-3 py-3 font-mono text-slate-600">{inv.appointment}</td>
                            <td className="px-3 py-3 font-mono text-slate-500">{inv.date}</td>
                            <td className="px-3 py-3 font-bold text-[#111827]">{inv.amount}</td>
                            <td className="px-3 py-3"><Chip label={inv.status} variant={getStatusChipVariant(inv.status)} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 06: DOCUMENTS */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Patient Documents &amp; Records</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-gray-200 bg-slate-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#0D47A1]" />
                        <div>
                          <div className="font-bold text-[#111827]">Patient Registration Form</div>
                          <div className="text-[11px] text-slate-500">March 12, 2024 · 1.8 MB</div>
                        </div>
                      </div>
                      <button onClick={() => alert('Downloading Registration Document...')} className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[#0D47A1] font-semibold text-[11px] hover:bg-blue-50">Download</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN: CONTEXT PANEL (3 COLS) */}
          <div className="xl:col-span-3 space-y-6">

            {/* CARD 01: Patient Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
                Patient Summary
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{patient.mrn}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Registration Date</span>
                  <span className="font-mono text-slate-700">{patient.regDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Registration Type</span>
                  <span className="text-slate-700">{patient.registrationType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Status</span>
                  <StatusBadge status={patient.status} />
                </div>
              </div>
            </div>

            {/* CARD 02: Quick Actions (RECEPTION ROLE ACTIONS) */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-2.5">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
                Quick Actions
              </h3>
              <button
                onClick={() => onBookAppointment?.(patient.mrn)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-[#009688] transition-colors"
              >
                Book Appointment <ChevronRight size={14} />
              </button>
              <button
                onClick={() => onCheckInClick?.(undefined, patient.mrn)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-[#009688] transition-colors"
              >
                Patient Check-In <ChevronRight size={14} />
              </button>
              <button
                onClick={onEditPatient}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-semibold text-[#0D47A1] transition-colors"
              >
                Edit Patient Information <ChevronRight size={14} />
              </button>
              <button
                onClick={() => alert(`Printing official Patient Card for ${patient.name}...`)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#111827] transition-colors"
              >
                Print Patient Card <ChevronRight size={14} />
              </button>
            </div>

            {/* CARD 03: Recent Reception Activity */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between" style={{ fontFamily: PP }}>
                <span>Recent Reception Activity</span>
                <Clock size={15} className="text-[#0D47A1]" />
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineEvents.map((ev, idx) => {
                  const IconComp = ev.icon
                  return (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${ev.color}`}>
                        <IconComp size={10} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{ev.title}</div>
                        <p className="text-xs text-[#64748B] mt-0.5">{ev.desc}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">{ev.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CARD 04: Today's Appointment */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between" style={{ fontFamily: PP }}>
                <span>Today's Appointment</span>
                <Calendar size={15} className="text-[#009688]" />
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Assigned Doctor</span>
                  <span className="font-semibold text-[#111827]">{patient.assignedDoctor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Department</span>
                  <span className="text-slate-600">{patient.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-[#64748B]">Date &amp; Time</span>
                  <span className="font-mono text-[#0D47A1]">Today · 09:00 AM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Status</span>
                  <StatusBadge status="Scheduled" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATIENT ROLE — My Prescriptions Screen (`PatientPrescriptionsScreen`)
// ═══════════════════════════════════════════════════════════════════════════════

export interface PatientPrescriptionItem {
  id: string
  consultationId: string
  consultationDate: string
  doctorName: string
  department: string
  diagnosisSummary: string
  medicines: Array<{
    name: string
    strength: string
    route: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }>
  followupDate: string
  status: 'Issued' | 'Completed' | 'Archived'
  downloadCount?: number
}

export function PatientPrescriptionsScreen({
  onViewDetails
}: {
  onViewDetails?: (rxId: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedDateRange, setSelectedDateRange] = useState('All')
  const [selectedPrescription, setSelectedPrescription] = useState<PatientPrescriptionItem | null>(null)
  const [printModalPrescription, setPrintModalPrescription] = useState<PatientPrescriptionItem | null>(null)
  const [fullViewPrescription, setFullViewPrescription] = useState<PatientPrescriptionItem | null>(null)
  const [isLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Patient Mock Prescriptions Data (Only Patient's Own Prescriptions)
  const patientPrescriptionsData: PatientPrescriptionItem[] = [
    {
      id: 'RX-2026-0891',
      consultationId: 'CNS-1001',
      consultationDate: '24 Jul 2026',
      doctorName: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      diagnosisSummary: 'Angina Pectoris, unspecified (ICD: I20.9)',
      followupDate: '31 Jul 2026',
      status: 'Issued',
      medicines: [
        { name: 'Amlodipine', strength: '5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', instructions: 'Take after breakfast' },
        { name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '30 Days', instructions: 'Take with morning & evening meals' },
        { name: 'Atorvastatin', strength: '20mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Nightly (HS)', duration: '30 Days', instructions: 'Take before sleeping' },
        { name: 'Aspirin', strength: '75mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', instructions: 'Take after lunch' }
      ]
    },
    {
      id: 'RX-2026-0412',
      consultationId: 'CNS-0842',
      consultationDate: '10 Apr 2026',
      doctorName: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      diagnosisSummary: 'Essential (primary) hypertension (ICD: I10)',
      followupDate: '10 Jul 2026',
      status: 'Completed',
      medicines: [
        { name: 'Amlodipine', strength: '5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '90 Days', instructions: 'Take after breakfast' },
        { name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '90 Days', instructions: 'Take with meals' },
        { name: 'Atorvastatin', strength: '10mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Nightly (HS)', duration: '90 Days', instructions: 'Take at bedtime' }
      ]
    },
    {
      id: 'RX-2025-1108',
      consultationId: 'CNS-0512',
      consultationDate: '15 Nov 2025',
      doctorName: 'Dr. Priya Sharma',
      department: 'General Medicine',
      diagnosisSummary: 'Type 2 diabetes mellitus without complications (ICD: E11.9)',
      followupDate: '15 Feb 2026',
      status: 'Completed',
      medicines: [
        { name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '90 Days', instructions: 'Take immediately with meals' },
        { name: 'Amlodipine', strength: '2.5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '90 Days', instructions: 'Take after breakfast' }
      ]
    },
    {
      id: 'RX-2024-0210',
      consultationId: 'CNS-0105',
      consultationDate: '14 Feb 2024',
      doctorName: 'Dr. Priya Sharma',
      department: 'General Medicine',
      diagnosisSummary: 'Acute upper respiratory infection (ICD: J06.9)',
      followupDate: '21 Feb 2024',
      status: 'Archived',
      medicines: [
        { name: 'Amoxicillin', strength: '500mg', route: 'Oral', dosage: '1 Capsule', frequency: 'Thrice Daily (TDS)', duration: '7 Days', instructions: 'Complete full course' },
        { name: 'Paracetamol', strength: '650mg', route: 'Oral', dosage: '1 Tablet', frequency: 'PRN fever', duration: '5 Days', instructions: 'Take as needed for fever' }
      ]
    }
  ]

  // Search & Filter Logic
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedStatus('All')
    setSelectedDateRange('All')
  }

  const filteredPrescriptions = patientPrescriptionsData.filter(rx => {
    const query = searchTerm.toLowerCase()
    const matchesSearch =
      rx.id.toLowerCase().includes(query) ||
      rx.doctorName.toLowerCase().includes(query) ||
      rx.department.toLowerCase().includes(query) ||
      rx.diagnosisSummary.toLowerCase().includes(query) ||
      rx.medicines.some(m => m.name.toLowerCase().includes(query))

    const matchesStatus = selectedStatus === 'All' || rx.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // KPI Calculations
  const totalPrescriptionsCount = patientPrescriptionsData.length
  const recentPrescriptionsCount = patientPrescriptionsData.filter(r => r.status === 'Issued').length
  const upcomingFollowupsCount = patientPrescriptionsData.filter(r => r.followupDate && new Date(r.followupDate) >= new Date('2026-07-24')).length
  const downloadedCount = 3 // Mock metric

  // Helper for Status Chips
  const renderStatusChip = (status: 'Issued' | 'Completed' | 'Archived') => {
    switch (status) {
      case 'Issued':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />Issued</span>
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />Completed</span>
      case 'Archived':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Archived</span>
    }
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20" style={{ fontFamily: RB }}>
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. BREADCRUMB & PAGE HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Patient Portal</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">My Prescriptions</span>
            </div>
            <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
              My Prescriptions
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              View and download prescriptions issued by your doctors during your visits.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ── 2. KPI CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-[#64748B] font-medium" style={{ fontFamily: RB }}>Total Prescriptions</div>
              <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{totalPrescriptionsCount}</div>
              <div className="text-[11px] text-[#0D47A1] font-medium mt-1" style={{ fontFamily: RB }}>Lifetime issued prescriptions</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
              <Pill size={20} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-[#64748B] font-medium" style={{ fontFamily: RB }}>Active Prescriptions</div>
              <div className="text-2xl font-bold text-[#009688] mt-0.5" style={{ fontFamily: PP }}>{recentPrescriptionsCount}</div>
              <div className="text-[11px] text-[#009688] font-medium mt-1" style={{ fontFamily: RB }}>Currently active medications</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
              <Activity size={20} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-[#64748B] font-medium" style={{ fontFamily: RB }}>Upcoming Follow-ups</div>
              <div className="text-2xl font-bold text-amber-600 mt-0.5" style={{ fontFamily: PP }}>{upcomingFollowupsCount}</div>
              <div className="text-[11px] text-amber-600 font-medium mt-1" style={{ fontFamily: RB }}>Scheduled doctor reviews</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-[#64748B] font-medium" style={{ fontFamily: RB }}>Downloaded PDF Reports</div>
              <div className="text-2xl font-bold text-slate-700 mt-0.5" style={{ fontFamily: PP }}>{downloadedCount}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1" style={{ fontFamily: RB }}>Exported document copies</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Download size={20} />
            </div>
          </div>
        </div>

        {/* ── 3. SEARCH & FILTER BAR ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>
              Search &amp; Filter My Prescriptions
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#0D47A1] font-semibold hover:underline"
              style={{ fontFamily: PP }}
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
            <div className="col-span-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Search Keywords</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rx ID, Doctor, Department, or Medicine..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Prescription Status</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Issued">Issued</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Date Range</label>
              <select
                value={selectedDateRange}
                onChange={e => setSelectedDateRange(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
              >
                <option value="All">All Time</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last 1 Year">Last 1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── 4. PRESCRIPTIONS ENTERPRISE TABLE / CARD GRID ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Prescription Records ({filteredPrescriptions.length})
              </h3>
            </div>
          </div>

          {isLoading ? (
            /* Loading Skeleton */
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="animate-pulse flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/6" />
                </div>
              ))}
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <Pill size={40} className="mx-auto text-slate-300 mb-3" />
              <h4 className="text-base font-bold text-slate-700" style={{ fontFamily: PP }}>No prescriptions available</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto" style={{ fontFamily: RB }}>
                You have no prescription records matching your current filter criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 text-[10px] font-bold text-slate-500 uppercase" style={{ fontFamily: PP }}>
                      <th className="p-3">Prescription ID</th>
                      <th className="p-3">Consultation Date</th>
                      <th className="p-3">Prescribing Doctor</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Medicines</th>
                      <th className="p-3">Follow-up Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPrescriptions.map(rx => (
                      <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#0D47A1]">
                          <button
                            onClick={() => setSelectedPrescription(rx)}
                            className="hover:underline text-left"
                          >
                            {rx.id}
                          </button>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{rx.consultationDate}</td>
                        <td className="p-3 font-bold text-[#111827]" style={{ fontFamily: PP }}>{rx.doctorName}</td>
                        <td className="p-3 text-slate-600">{rx.department}</td>
                        <td className="p-3 font-semibold text-[#009688]">
                          {rx.medicines.length} Medication{rx.medicines.length > 1 ? 's' : ''}
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{rx.followupDate}</td>
                        <td className="p-3">{renderStatusChip(rx.status)}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (onViewDetails) {
                                  onViewDetails(rx.id)
                                } else {
                                  setSelectedPrescription(rx)
                                }
                              }}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                              style={{ fontFamily: PP }}
                              title="View Details"
                            >
                              <Eye size={13} /> View
                            </button>
                            <button
                              onClick={() => setPrintModalPrescription(rx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Print Prescription"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              onClick={() => triggerToast(`Downloaded PDF for ${rx.id}`)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                              title="Download PDF"
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

              {/* Mobile Card Layout */}
              <div className="block md:hidden divide-y divide-gray-100">
                {filteredPrescriptions.map(rx => (
                  <div key={rx.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0D47A1] text-sm">{rx.id}</span>
                      {renderStatusChip(rx.status)}
                    </div>

                    <div className="space-y-1 text-xs" style={{ fontFamily: RB }}>
                      <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{rx.doctorName} ({rx.department})</div>
                      <div className="text-slate-500">Date: {rx.consultationDate} • Follow-up: {rx.followupDate}</div>
                      <div className="text-[#009688] font-semibold">{rx.medicines.length} Prescribed Medications</div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="px-3 py-1.5 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-lg flex items-center gap-1"
                        style={{ fontFamily: PP }}
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => setPrintModalPrescription(rx)}
                        className="px-3 py-1.5 bg-teal-50 text-[#009688] text-xs font-semibold rounded-lg flex items-center gap-1"
                        style={{ fontFamily: PP }}
                      >
                        <Printer size={13} /> Print
                      </button>
                      <button
                        onClick={() => triggerToast(`Downloaded PDF for ${rx.id}`)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                        style={{ fontFamily: PP }}
                      >
                        <Download size={13} /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 5. RIGHT SLIDE-OVER DRAWER (Quick Preview) ── */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescription Quick Preview</h3>
                  {renderStatusChip(selectedPrescription.status)}
                </div>
                <span className="font-mono text-xs font-bold text-[#0D47A1]">{selectedPrescription.id}</span>
              </div>

              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs" style={{ fontFamily: RB }}>
              {/* Doctor & Dept */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Prescribing Doctor</span>
                  <span className="font-bold text-[#111827] text-sm" style={{ fontFamily: PP }}>{selectedPrescription.doctorName}</span>
                  <span className="text-[#0D47A1] block font-medium">{selectedPrescription.department}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Consultation Date</span>
                  <span className="font-medium text-slate-700">{selectedPrescription.consultationDate}</span>
                </div>
              </div>

              {/* Diagnosis Summary */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Diagnosis Summary</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-slate-800 font-medium">
                  {selectedPrescription.diagnosisSummary}
                </p>
              </div>

              {/* Medicines List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#009688] uppercase" style={{ fontFamily: PP }}>
                    Prescribed Medicines ({selectedPrescription.medicines.length})
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedPrescription.medicines.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-gray-100 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{m.name} {m.strength}</span>
                        <span className="font-mono text-[10px] bg-blue-100 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{m.route}</span>
                      </div>
                      <div className="text-slate-600 flex justify-between">
                        <span>Dosage: {m.dosage}</span>
                        <span className="font-semibold text-[#0D47A1]">{m.frequency}</span>
                      </div>
                      <div className="text-slate-500 italic text-[11px] pt-1 border-t border-gray-100">
                        Instruction: {m.instructions} ({m.duration})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Followup Date */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                <span className="text-[10px] font-bold text-amber-800 uppercase" style={{ fontFamily: PP }}>Follow-up Review Date</span>
                <span className="font-bold text-amber-900">{selectedPrescription.followupDate}</span>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-gray-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setFullViewPrescription(selectedPrescription)
                  setSelectedPrescription(null)
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Eye size={14} /> View Full
              </button>
              <button
                onClick={() => triggerToast(`Downloaded PDF for ${selectedPrescription.id}`)}
                className="px-3.5 py-2 rounded-xl border border-[#0D47A1] text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Download size={14} /> PDF
              </button>
              <button
                onClick={() => {
                  setPrintModalPrescription(selectedPrescription)
                  setSelectedPrescription(null)
                }}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. PRINT PREVIEW MODAL ── */}
      {printModalPrescription && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Print Prescription Document</h3>
              <button onClick={() => setPrintModalPrescription(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3 text-xs" style={{ fontFamily: RB }}>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>HMS Medical Center</span>
                <span className="font-mono text-slate-500">{printModalPrescription.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Doctor:</strong> {printModalPrescription.doctorName}</div>
                <div><strong>Date:</strong> {printModalPrescription.consultationDate}</div>
              </div>
              <div><strong>Diagnosis:</strong> {printModalPrescription.diagnosisSummary}</div>
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold mb-1">Medicines ({printModalPrescription.medicines.length}):</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {printModalPrescription.medicines.map((m, idx) => (
                    <li key={idx}>{m.name} {m.strength} — {m.frequency} ({m.instructions})</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintModalPrescription(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                style={{ fontFamily: RB }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPrintModalPrescription(null)
                  triggerToast(`Prescription ${printModalPrescription.id} sent to printer`)
                  window.print()
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
                style={{ fontFamily: PP }}
              >
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. FULL READ-ONLY VIEW MODAL ── */}
      {fullViewPrescription && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>Full Prescription Details</h3>
                {renderStatusChip(fullViewPrescription.status)}
              </div>
              <button onClick={() => setFullViewPrescription(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-gray-200 space-y-4 text-xs" style={{ fontFamily: RB }}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Hospital</span>
                  <span className="font-bold text-[#0D47A1] text-sm">HMS Hospital &amp; Medical Research Center</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Prescription ID</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{fullViewPrescription.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Attending Doctor</span>
                  <span className="font-bold text-[#111827]">{fullViewPrescription.doctorName}</span>
                  <span className="text-[10px] text-slate-500 block">{fullViewPrescription.department}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Consultation ID</span>
                  <span className="font-mono font-medium text-slate-700">{fullViewPrescription.consultationId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Date</span>
                  <span className="font-medium text-slate-700">{fullViewPrescription.consultationDate}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Clinical Diagnosis</span>
                <p className="p-2.5 bg-white rounded-lg border border-gray-200 text-slate-800 font-medium">
                  {fullViewPrescription.diagnosisSummary}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#009688] uppercase block mb-2" style={{ fontFamily: PP }}>
                  Prescribed Medications ({fullViewPrescription.medicines.length})
                </span>
                <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-gray-200">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase border-b border-gray-200" style={{ fontFamily: PP }}>
                      <th className="p-2">Medicine</th>
                      <th className="p-2">Route</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fullViewPrescription.medicines.map((m, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold text-[#111827]">{m.name} {m.strength}</td>
                        <td className="p-2 text-slate-600">{m.route}</td>
                        <td className="p-2 text-slate-700">{m.dosage}</td>
                        <td className="p-2 font-semibold text-[#0D47A1]">{m.frequency}</td>
                        <td className="p-2 text-slate-600">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex justify-between items-center">
                <span className="text-[10px] font-bold text-amber-800 uppercase" style={{ fontFamily: PP }}>Next Follow-up Review</span>
                <span className="font-bold text-amber-900">{fullViewPrescription.followupDate}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFullViewPrescription(null)}
                className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-slate-700 hover:bg-slate-50"
                style={{ fontFamily: PP }}
              >
                Close
              </button>
              <button
                onClick={() => triggerToast(`Downloaded PDF for ${fullViewPrescription.id}`)}
                className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
                style={{ fontFamily: PP }}
              >
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATIENT ROLE — Prescription Details Screen (`PatientPrescriptionDetailsScreen`)
// ═══════════════════════════════════════════════════════════════════════════════

export function PatientPrescriptionDetailsScreen({
  prescriptionId = 'RX-2026-0891',
  onBack
}: {
  prescriptionId?: string
  onBack?: () => void
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [printModalOpen, setPrintModalOpen] = useState(false)

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Prescription Record data matching Patient scope
  const rxRecord = {
    id: prescriptionId,
    consultationId: 'CNS-1001',
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-892101',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    photo: '',
    consultationDate: '24 Jul 2026',
    issuedDate: '24 Jul 2026, 09:42 AM',
    status: 'Issued' as 'Issued' | 'Completed' | 'Archived',
    doctorName: 'Dr. Arjun Mehta',
    doctorSpecialty: 'Interventional Cardiology',
    department: 'Cardiology',
    mobileNumber: '+1 (555) 234-5678',
    lastConsultationDate: '24 Jul 2026',
    allergies: ['Penicillin', 'Aspirin'],
    knownConditions: ['Hypertension', 'Borderline Type 2 Diabetes'],

    // Section 01: Diagnosis Summary
    chiefComplaint: 'Severe chest tightness radiating to left shoulder with acute dyspnea on exertion.',
    clinicalFindings: 'Chest wall non-tender. S1 and S2 heart sounds heard normal. No murmurs or gallop rhythm. BP 145/92 mmHg, HR 88 bpm.',
    finalDiagnosis: 'Angina Pectoris, unspecified',
    icdCode: 'I20.9 — Angina Pectoris, unspecified',
    doctorNotes: 'Patient presented with acute exertional chest discomfort. Electrocardiogram (ECG) performed in clinic. High cardiovascular risk profile noted. Prescribed anti-hypertensive and lipid lowering therapy.',

    // Section 02: Medicines List
    medicines: [
      { id: '1', name: 'Amlodipine', strength: '5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', quantity: '30 Tabs', instructions: 'Take after breakfast with full glass of water' },
      { id: '2', name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '30 Days', quantity: '60 Tabs', instructions: 'Take immediately with morning & evening meals' },
      { id: '3', name: 'Atorvastatin', strength: '20mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Nightly (HS)', duration: '30 Days', quantity: '30 Tabs', instructions: 'Take before sleeping' },
      { id: '4', name: 'Aspirin', strength: '75mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', quantity: '30 Tabs', instructions: 'Take after lunch' }
    ],

    // Section 03: General Advice
    dietAdvice: 'Strict low-sodium (< 2g/day), low saturated fat diet. Increase fiber intake and fresh vegetables.',
    lifestyleAdvice: 'Smoking cessation strictly advised. Avoid stress and maintain regular sleep hygiene (7-8 hours).',
    exerciseAdvice: 'Daily light 20-30 min walking after 1 week. Avoid strenuous physical weight lifting until follow-up.',
    specialInstructions: 'If chest pain recurs or intensifies, use sublingual GTN spray immediately and report to ER.',

    // Section 04: Follow-up Details
    followupRequired: 'Yes',
    nextVisitDate: '31 Jul 2026',
    followupNotes: 'Review ECG & Troponin-I laboratory reports. Re-evaluate blood pressure control and adjust anti-hypertensive dosage if needed.'
  }

  // Timeline Events
  const activityTimeline = [
    { title: 'Consultation Completed', date: '24 Jul 2026, 09:30 AM', status: 'done', desc: 'OPD Consultation completed by Dr. Arjun Mehta' },
    { title: 'Prescription Issued', date: '24 Jul 2026, 09:42 AM', status: 'done', desc: 'Official digital prescription signed & issued' },
    { title: 'Prescription Viewed', date: '24 Jul 2026, 10:15 AM', status: 'done', desc: 'Viewed via Patient Portal' },
    { title: 'Prescription Downloaded', date: '24 Jul 2026, 10:18 AM', status: 'done', desc: 'PDF downloaded by patient' }
  ]

  // Status Chip Renderer
  const renderStatusChip = (st: 'Issued' | 'Completed' | 'Archived') => {
    switch (st) {
      case 'Issued':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />Issued</span>
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />Completed</span>
      case 'Archived':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Archived</span>
    }
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20" style={{ fontFamily: RB }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce" style={{ fontFamily: RB }}>
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      {/* ── BREADCRUMB & PAGE HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Patient Portal</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>My Prescriptions</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">Prescription Details</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Prescription Details
              </h1>
              {renderStatusChip(rxRecord.status)}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              View your prescription, medicines and follow-up instructions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <ChevronLeft size={14} />
                Back to My Prescriptions
              </button>
            )}
            <button
              onClick={() => setPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#009688] hover:bg-teal-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Printer size={14} />
              Print Prescription
            </button>
            <button
              onClick={() => triggerToast(`Downloaded PDF for ${rxRecord.id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── PATIENT HERO HEADER (Reused) ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Av name={rxRecord.patientName} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{rxRecord.patientName}</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{rxRecord.mrn}</span>
                <span className="font-mono text-[10px] bg-emerald-50 text-[#009688] px-2 py-0.5 rounded font-bold">{rxRecord.id}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                <span>{rxRecord.age} yrs / {rxRecord.gender}</span>
                <span>•</span>
                <span>Blood Group: <strong className="text-[#111827]">{rxRecord.bloodGroup}</strong></span>
                <span>•</span>
                <span>Doctor: <strong className="text-[#111827]">{rxRecord.doctorName} ({rxRecord.department})</strong></span>
                <span>•</span>
                <span>Consultation Date: <strong className="text-[#111827]">{rxRecord.consultationDate}</strong></span>
              </div>
            </div>

            {/* Allergy alert badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0" style={{ fontFamily: PP }}>
              <AlertTriangle size={13} />
              <span>Allergies: {rxRecord.allergies.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE CONTENT: 3-COLUMN LAYOUT ── */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT PANEL (Col-span-3): Patient Summary ── */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Patient Summary
              </h3>

              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">{rxRecord.mrn}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Mobile Number</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {rxRecord.mobileNumber}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Blood Group</span>
                  <span className="font-bold text-slate-800">{rxRecord.bloodGroup}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Primary Doctor</span>
                  <span className="font-semibold text-slate-800">{rxRecord.doctorName}</span>
                  <span className="text-[10px] text-slate-500 block">{rxRecord.department}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Last Consultation Date</span>
                  <span className="font-medium text-slate-700">{rxRecord.lastConsultationDate}</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Known Allergies</span>
                  <div className="flex flex-wrap gap-1">
                    {rxRecord.allergies.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-semibold" style={{ fontFamily: PP }}>
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CENTER CONTENT (Col-span-6): Prescription Details ── */}
          <div className="lg:col-span-6 space-y-5">

            {/* SECTION 01: Diagnosis Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs">01</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Diagnosis Summary</h3>
              </div>

              <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Chief Complaint</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-800 font-medium border border-gray-100">{rxRecord.chiefComplaint}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Clinical Findings</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-700 border border-gray-100">{rxRecord.clinicalFindings}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Final Diagnosis</span>
                    <p className="p-2.5 bg-blue-50/50 rounded-xl font-bold text-[#111827] border border-blue-100">{rxRecord.finalDiagnosis}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>ICD-10 Code</span>
                    <p className="p-2.5 bg-blue-50 text-[#0D47A1] rounded-xl font-mono font-bold border border-blue-100">{rxRecord.icdCode}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Doctor Notes</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-700 italic border border-gray-100">{rxRecord.doctorNotes}</p>
                </div>
              </div>
            </div>

            {/* SECTION 02: Medicine List Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">02</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescribed Medications</h3>
                </div>
                <span className="text-xs font-bold text-[#009688] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                  Total: {rxRecord.medicines.length} Medicines
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 text-[10px] font-bold text-slate-500 uppercase" style={{ fontFamily: PP }}>
                      <th className="p-2">Medicine Name</th>
                      <th className="p-2">Strength</th>
                      <th className="p-2">Route</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Duration</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rxRecord.medicines.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-2 font-bold text-[#111827]" style={{ fontFamily: PP }}>{m.name}</td>
                        <td className="p-2 text-slate-700">{m.strength}</td>
                        <td className="p-2 text-slate-600 font-mono text-[10px]">{m.route}</td>
                        <td className="p-2 font-medium">{m.dosage}</td>
                        <td className="p-2 font-semibold text-[#0D47A1]">{m.frequency}</td>
                        <td className="p-2 text-slate-600">{m.duration}</td>
                        <td className="p-2 font-mono font-medium">{m.quantity}</td>
                        <td className="p-2 text-slate-600 italic text-[11px]">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 03: General Advice */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">03</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>General Advice &amp; Care Plan</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs" style={{ fontFamily: RB }}>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Diet Advice</span>
                  <p className="text-slate-700">{rxRecord.dietAdvice}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Lifestyle Advice</span>
                  <p className="text-slate-700">{rxRecord.lifestyleAdvice}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Exercise Advice</span>
                  <p className="text-slate-700">{rxRecord.exerciseAdvice}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1" style={{ fontFamily: PP }}>Special Instructions</span>
                  <p className="text-amber-900 font-medium">{rxRecord.specialInstructions}</p>
                </div>
              </div>
            </div>

            {/* SECTION 04: Follow-up Details */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">04</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Follow-up Instructions</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Follow-up Required</span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {rxRecord.followupRequired}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Next Visit Date</span>
                  <span className="font-bold text-[#111827] text-sm mt-0.5 block">{rxRecord.nextVisitDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Time Frame</span>
                  <span className="text-slate-600 mt-0.5 block">In 7 Days</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Follow-up Notes</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-xs text-slate-700" style={{ fontFamily: RB }}>
                  {rxRecord.followupNotes}
                </p>
              </div>
            </div>

            {/* SECTION 05: Prescription Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">05</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescription Technical Summary</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Prescription ID</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{rxRecord.id}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Consultation ID</span>
                  <span className="font-mono font-semibold text-slate-700">{rxRecord.consultationId}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Issued Date</span>
                  <span className="text-slate-700">{rxRecord.issuedDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Total Medicines</span>
                  <span className="font-bold text-[#009688]">{rxRecord.medicines.length} Medicines</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT CONTEXT PANEL (Col-span-3) ── */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* CARD 01: Quick Actions */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Quick Actions
              </h4>

              <button
                onClick={() => triggerToast(`Downloaded PDF for ${rxRecord.id}`)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <span className="flex items-center gap-2"><Download size={14} /> Download PDF</span>
                <ChevronRight size={13} />
              </button>

              <button
                onClick={() => setPrintModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold transition-colors"
                style={{ fontFamily: PP }}
              >
                <span className="flex items-center gap-2"><Printer size={14} /> Print Prescription</span>
                <ChevronRight size={13} />
              </button>

              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-2"><ChevronLeft size={14} /> Back to My Prescriptions</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>

            {/* CARD 02: Prescription Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-2.5">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Prescription Summary
              </h4>

              <div className="space-y-2.5 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Issued By</span>
                  <span className="font-semibold text-slate-800">{rxRecord.doctorName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Issue Date</span>
                  <span className="text-slate-700">24 Jul 2026</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status</span>
                  <div>{renderStatusChip(rxRecord.status)}</div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Next Follow-up</span>
                  <span className="font-bold text-amber-700">{rxRecord.nextVisitDate}</span>
                </div>
              </div>
            </div>

            {/* CARD 03: Activity Timeline */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Activity Timeline
              </h4>

              <div className="space-y-3 text-xs relative pl-4 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
                {activityTimeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-[#0D47A1] border border-white" />
                    <div>
                      <div className="font-semibold text-slate-800" style={{ fontFamily: PP }}>{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.date}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* PRINT PREVIEW MODAL */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Print Prescription Document</h3>
              <button onClick={() => setPrintModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3 text-xs" style={{ fontFamily: RB }}>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>HMS Hospital &amp; Medical Research Center</span>
                <span className="font-mono text-slate-500">{rxRecord.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Patient:</strong> {rxRecord.patientName}</div>
                <div><strong>MRN:</strong> {rxRecord.mrn}</div>
                <div><strong>Doctor:</strong> {rxRecord.doctorName}</div>
                <div><strong>Date:</strong> {rxRecord.consultationDate}</div>
              </div>
              <div><strong>Diagnosis:</strong> {rxRecord.finalDiagnosis}</div>
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold mb-1">Medicines ({rxRecord.medicines.length}):</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {rxRecord.medicines.map((m) => (
                    <li key={m.id}>{m.name} {m.strength} — {m.frequency} ({m.instructions})</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                style={{ fontFamily: RB }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPrintModalOpen(false)
                  triggerToast(`Prescription ${rxRecord.id} sent to printer`)
                  window.print()
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
                style={{ fontFamily: PP }}
              >
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




