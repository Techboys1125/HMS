import React, { useState, useMemo } from 'react'
import {
  Stethoscope, UserX, Search, Filter, Edit, Eye, X,
  CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft, Building2, Clock,
  ArrowUpDown, RotateCcw, UserPlus, Calendar, Award, Check,
  RefreshCw, Hash, FileCheck, User, FileText, Upload, Lock, Shield, CheckSquare,
  DollarSign, KeyRound
} from 'lucide-react'

// --- Typography Tokens ---
const PP = 'Poppins, sans-serif'
const RB = 'Roboto, sans-serif'

// --- Availability & Status Types ---
export type DoctorAvailability = 'Available Today' | 'On Duty' | 'On Call' | 'On Leave' | 'Out of Office'
export type DoctorStatus = 'Active' | 'Inactive' | 'On Leave' | 'Suspended'

export interface DoctorRecord {
  id: string
  empId: string
  regNumber: string
  name: string
  gender: 'Male' | 'Female' | 'Other'
  department: string
  specialty: string
  qualification: string
  experienceYrs: number
  consultationFee: number
  followUpFee?: number
  slotDuration?: string
  availability: DoctorAvailability
  status: DoctorStatus
  email: string
  phone: string
  address?: string
  dob?: string
  opdRoom: string
  joinedDate: string
  shiftTimings: string
  workingDays: string[]
  bio?: string
}

// --- Initial Mock Doctor Dataset ---
const INITIAL_DOCTORS: DoctorRecord[] = [
  {
    id: 'DOC-1001',
    empId: 'EMP-1001',
    regNumber: 'MCI-REG-847291',
    name: 'Dr. Arjun Mehta',
    gender: 'Male',
    department: 'Cardiology',
    specialty: 'Interventional Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experienceYrs: 14,
    consultationFee: 150,
    followUpFee: 80,
    slotDuration: '15 Minutes',
    availability: 'Available Today',
    status: 'Active',
    email: 'arjun.mehta@citygeneral.org',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Suite 104',
    dob: '1985-05-14',
    opdRoom: 'OPD Room 104',
    joinedDate: '2020-03-15',
    shiftTimings: '09:00 AM - 04:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    bio: 'Senior Interventional Cardiologist with 14+ years of expertise in coronary angioplasty, pacemaker implantations, and complex cardiovascular management.'
  },
  {
    id: 'DOC-1002',
    empId: 'EMP-1005',
    regNumber: 'MCI-REG-938102',
    name: 'Dr. Priya Sharma',
    gender: 'Female',
    department: 'General Medicine',
    specialty: 'Internal Medicine',
    qualification: 'MBBS, MD (Medicine)',
    experienceYrs: 10,
    consultationFee: 120,
    followUpFee: 60,
    slotDuration: '15 Minutes',
    availability: 'Available Today',
    status: 'Active',
    email: 'p.sharma@citygeneral.org',
    phone: '+1 (555) 678-9012',
    address: '102 Medical Plaza Blvd',
    dob: '1988-09-22',
    opdRoom: 'OPD Room 202',
    joinedDate: '2021-06-10',
    shiftTimings: '08:30 AM - 03:30 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
    bio: 'Specialist in internal medicine, metabolic disorders, hypertension management, and preventative health diagnostics.'
  },
  {
    id: 'DOC-1003',
    empId: 'EMP-1009',
    regNumber: 'MCI-REG-746201',
    name: 'Dr. Rajesh Kapoor',
    gender: 'Male',
    department: 'Neurology',
    specialty: 'Clinical Neurology',
    qualification: 'MBBS, MD, DNB (Neurology)',
    experienceYrs: 16,
    consultationFee: 180,
    followUpFee: 100,
    slotDuration: '20 Minutes',
    availability: 'On Duty',
    status: 'Active',
    email: 'r.kapoor@citygeneral.org',
    phone: '+1 (555) 012-3456',
    address: '55 Neuro Science Way',
    dob: '1982-12-01',
    opdRoom: 'OPD Room 305',
    joinedDate: '2019-01-20',
    shiftTimings: '10:00 AM - 05:00 PM',
    workingDays: ['Mon', 'Wed', 'Thu', 'Fri'],
    bio: 'Consultant Neurologist specializing in stroke management, epilepsy, neuromuscular disorders, and electroencephalography.'
  },
  {
    id: 'DOC-1004',
    empId: 'EMP-1014',
    regNumber: 'MCI-REG-654321',
    name: 'Dr. Ananya Sen',
    gender: 'Female',
    department: 'Pediatrics',
    specialty: 'Pediatric Care & Neonatology',
    qualification: 'MBBS, MD (Pediatrics)',
    experienceYrs: 8,
    consultationFee: 110,
    followUpFee: 50,
    slotDuration: '15 Minutes',
    availability: 'Available Today',
    status: 'Active',
    email: 'a.sen@citygeneral.org',
    phone: '+1 (555) 345-9876',
    address: '88 Childrens Care Ave',
    dob: '1990-04-18',
    opdRoom: 'OPD Room 112',
    joinedDate: '2022-02-14',
    shiftTimings: '09:00 AM - 02:00 PM',
    workingDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    bio: 'Dedicated pediatrician with special focus on newborn care, pediatric immunizations, and developmental growth tracking.'
  },
  {
    id: 'DOC-1005',
    empId: 'EMP-1018',
    regNumber: 'MCI-REG-543210',
    name: 'Dr. Vikramaditya Rao',
    gender: 'Male',
    department: 'Orthopedics',
    specialty: 'Orthopedic Surgery & Joint Replacement',
    qualification: 'MBBS, MS (Orthopedics), MCh',
    experienceYrs: 18,
    consultationFee: 200,
    followUpFee: 120,
    slotDuration: '30 Minutes',
    availability: 'On Call',
    status: 'Active',
    email: 'v.rao@citygeneral.org',
    phone: '+1 (555) 456-8765',
    address: '12 Ortho Joint Blvd',
    dob: '1979-08-30',
    opdRoom: 'OPD Room 401',
    joinedDate: '2017-09-01',
    shiftTimings: '11:00 AM - 06:00 PM',
    workingDays: ['Tue', 'Wed', 'Fri'],
    bio: 'Renowned orthopedic surgeon specializing in total knee/hip joint replacements, arthroscopy, and trauma management.'
  },
  {
    id: 'DOC-1006',
    empId: 'EMP-1022',
    regNumber: 'MCI-REG-432109',
    name: 'Dr. Sunita Patel',
    gender: 'Female',
    department: 'Obstetrics & Gynecology',
    specialty: 'Reproductive Health & Maternal Care',
    qualification: 'MBBS, MS (OB-GYN)',
    experienceYrs: 12,
    consultationFee: 140,
    followUpFee: 70,
    slotDuration: '15 Minutes',
    availability: 'On Leave',
    status: 'On Leave',
    email: 's.patel@citygeneral.org',
    phone: '+1 (555) 567-7654',
    address: '404 Maternal Wellness Rd',
    dob: '1986-07-11',
    opdRoom: 'OPD Room 208',
    joinedDate: '2020-11-05',
    shiftTimings: '09:00 AM - 03:00 PM',
    workingDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    bio: 'Obstetrician & Gynecologist with expertise in high-risk pregnancy care, laparoscopic gynecology, and maternal health.'
  },
  {
    id: 'DOC-1007',
    empId: 'EMP-1025',
    regNumber: 'MCI-REG-321098',
    name: 'Dr. Siddharth Verma',
    gender: 'Male',
    department: 'Dermatology',
    specialty: 'Clinical & Aesthetic Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experienceYrs: 7,
    consultationFee: 130,
    followUpFee: 65,
    slotDuration: '15 Minutes',
    availability: 'Out of Office',
    status: 'Active',
    email: 's.verma@citygeneral.org',
    phone: '+1 (555) 678-6543',
    address: '77 Skin Health Lane',
    dob: '1991-03-05',
    opdRoom: 'OPD Room 118',
    joinedDate: '2022-08-19',
    shiftTimings: '10:00 AM - 04:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Fri'],
    bio: 'Dermatologist specializing in skin disorder management, laser therapies, and aesthetic dermatology treatments.'
  },
  {
    id: 'DOC-1008',
    empId: 'EMP-1029',
    regNumber: 'MCI-REG-210987',
    name: 'Dr. Meera Krishnan',
    gender: 'Female',
    department: 'ENT',
    specialty: 'Otolaryngology & Head-Neck Surgery',
    qualification: 'MBBS, MS (ENT)',
    experienceYrs: 11,
    consultationFee: 125,
    followUpFee: 60,
    slotDuration: '15 Minutes',
    availability: 'Available Today',
    status: 'Active',
    email: 'm.krishnan@citygeneral.org',
    phone: '+1 (555) 789-5432',
    address: '99 ENT Clinic St',
    dob: '1987-11-20',
    opdRoom: 'OPD Room 215',
    joinedDate: '2021-01-12',
    shiftTimings: '08:30 AM - 02:30 PM',
    workingDays: ['Mon', 'Thu', 'Fri', 'Sat'],
    bio: 'ENT surgeon with extensive experience in endoscopic sinus surgery, audiometry evaluation, and throat care.'
  },
  {
    id: 'DOC-1009',
    empId: 'EMP-1033',
    regNumber: 'MCI-REG-109876',
    name: 'Dr. Tariq Mansoor',
    gender: 'Male',
    department: 'Ophthalmology',
    specialty: 'Cornea & Refractive Surgery',
    qualification: 'MBBS, MS (Ophthalmology)',
    experienceYrs: 9,
    consultationFee: 115,
    followUpFee: 55,
    slotDuration: '15 Minutes',
    availability: 'Available Today',
    status: 'Active',
    email: 't.mansoor@citygeneral.org',
    phone: '+1 (555) 890-4321',
    address: '33 Vision Park Circle',
    dob: '1989-06-15',
    opdRoom: 'OPD Room 310',
    joinedDate: '2022-05-01',
    shiftTimings: '09:30 AM - 04:30 PM',
    workingDays: ['Tue', 'Wed', 'Thu', 'Fri'],
    bio: 'Ophthalmic surgeon specializing in cataract phacoemulsification, glaucoma screening, and vision correction.'
  },
  {
    id: 'DOC-1010',
    empId: 'EMP-1037',
    regNumber: 'MCI-REG-987654',
    name: 'Dr. Kavita Nair',
    gender: 'Female',
    department: 'Pulmonology',
    specialty: 'Respiratory Medicine',
    qualification: 'MBBS, MD (Chest Medicine)',
    experienceYrs: 15,
    consultationFee: 160,
    followUpFee: 80,
    slotDuration: '20 Minutes',
    availability: 'On Leave',
    status: 'Inactive',
    email: 'k.nair@citygeneral.org',
    phone: '+1 (555) 901-3210',
    address: '210 Chest Medicine Plaza',
    dob: '1983-02-28',
    opdRoom: 'OPD Room 302',
    joinedDate: '2018-04-10',
    shiftTimings: '10:00 AM - 04:00 PM',
    workingDays: ['Mon', 'Wed', 'Fri'],
    bio: 'Senior Pulmonologist focusing on asthma, COPD management, sleep apnea diagnostics, and interventional pulmonology.'
  }
]

// Mock Dataset for Doctor Profile Tabs
const MOCK_DOCTOR_APPOINTMENTS = [
  { id: 'APT-1024', patientId: 'PT-2024-001', patientName: 'Sarah Mitchell', gender: 'F', age: 34, date: 'March 28, 2024', time: '10:30 AM', type: 'Follow-up Visit', status: 'Scheduled', complaint: 'Hypertension monitoring & ECG review' },
  { id: 'APT-1018', patientId: 'PT-2024-002', patientName: 'James Thornton', gender: 'M', age: 67, date: 'March 28, 2024', time: '11:15 AM', type: 'OPD Consultation', status: 'In Progress', complaint: 'Chest tightness evaluation' },
  { id: 'APT-0982', patientId: 'PT-2024-003', patientName: 'Emma Reyes', gender: 'F', age: 28, date: 'March 28, 2024', time: '02:00 PM', type: 'Routine Checkup', status: 'Scheduled', complaint: 'Post-op cardiac checkup' },
  { id: 'APT-0955', patientId: 'PT-2024-004', patientName: 'Robert Chen', gender: 'M', age: 52, date: 'March 27, 2024', time: '09:45 AM', type: 'OPD Consultation', status: 'Completed', complaint: 'Cardiology intake & vitals' },
  { id: 'APT-0912', patientId: 'PT-2024-005', patientName: 'Aisha Kumar', gender: 'F', age: 41, date: 'March 26, 2024', time: '04:00 PM', type: 'Follow-up Visit', status: 'Completed', complaint: 'BP medication adjustment' }
]

const MOCK_DOCTOR_PATIENTS = [
  { id: 'PT-2024-001', name: 'Sarah Mitchell', gender: 'Female', age: 34, lastVisit: 'March 12, 2024', status: 'Active', complaint: 'Chest Pain Checkup' },
  { id: 'PT-2024-002', name: 'James Thornton', gender: 'Male', age: 67, lastVisit: 'March 10, 2024', status: 'Active', complaint: 'Diabetes & BP Follow-up' },
  { id: 'PT-2024-004', name: 'Robert Chen', gender: 'Male', age: 52, lastVisit: 'March 05, 2024', status: 'Active', complaint: 'Hypertension Review' },
  { id: 'PT-2024-008', name: 'Marcus Brown', gender: 'Male', age: 71, lastVisit: 'Feb 20, 2024', status: 'Admitted', complaint: 'Angina Evaluation' },
  { id: 'PT-2024-012', name: 'David Walsh', gender: 'Male', age: 38, lastVisit: 'Jan 14, 2024', status: 'Inactive', complaint: 'Lower Back Pain' }
]

const MOCK_WEEKLY_SCHEDULE = [
  { day: 'Monday', available: true, startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: '15 Mins' },
  { day: 'Tuesday', available: true, startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: '15 Mins' },
  { day: 'Wednesday', available: true, startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: '15 Mins' },
  { day: 'Thursday', available: true, startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: '15 Mins' },
  { day: 'Friday', available: true, startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: '15 Mins' },
  { day: 'Saturday', available: false, startTime: '--', endTime: '--', slotDuration: '--' },
  { day: 'Sunday', available: false, startTime: '--', endTime: '--', slotDuration: '--' }
]

const MOCK_DOCTOR_TIMELINE = [
  { time: 'Today, 10:30 AM', title: 'Appointment Completed', desc: 'OPD consultation completed for Sarah Mitchell (PT-2024-001).', icon: CheckCircle2, type: 'appointment' },
  { time: 'Today, 09:15 AM', title: 'Prescription Issued', desc: 'Issued Rx-2024-104 (Lisinopril 10mg, Atorvastatin 20mg).', icon: FileText, type: 'prescription' },
  { time: 'Yesterday, 04:30 PM', title: 'Schedule Updated', desc: 'OPD Availability schedule updated for current month by Hospital Admin.', icon: Clock, type: 'schedule' },
  { time: 'Mar 20, 2024, 02:15 PM', title: 'Profile Updated', desc: 'Consultation fee and OPD Room details updated by Admin.', icon: Edit, type: 'profile' },
  { time: 'Jan 15, 2020, 09:00 AM', title: 'Doctor Registered', desc: 'Doctor onboarded into HMS under Cardiology Department (MCI-REG-847291).', icon: Stethoscope, type: 'registration' }
]

// ──────────────────────────────────────────────────────────────────────────
// REUSABLE CONFIRMATION DIALOG: DEACTIVATE DOCTOR
// ──────────────────────────────────────────────────────────────────────────
export interface DeactivateDoctorDialogProps {
  isOpen: boolean
  doctor: DoctorRecord | null
  onClose: () => void
  onConfirm: () => void
}

export function DeactivateDoctorDialog({ isOpen, doctor, onClose, onConfirm }: DeactivateDoctorDialogProps) {
  if (!isOpen || !doctor) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] p-6 space-y-4 animate-in zoom-in-95 duration-200" style={{ fontFamily: RB }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0 border border-red-200">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Deactivate Doctor</h3>
            <p className="text-xs text-[#64748B]">{doctor.name} ({doctor.id})</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to deactivate <span className="font-bold text-[#111827]">{doctor.name}</span>?
          <br /><br />
          The doctor will no longer receive new OPD appointments, but historical medical records and past consultation histories will remain available.
        </p>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// REUSABLE RIGHT DRAWER: ADD NEW DOCTOR
// ──────────────────────────────────────────────────────────────────────────
export interface AddDoctorDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (newDoctor: DoctorRecord) => void
  totalDoctorCount: number
}

export function AddDoctorDrawer({ isOpen, onClose, onSubmit, totalDoctorCount }: AddDoctorDrawerProps) {
  // --- Form State ---
  // Section 1: Personal Info
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male')
  const [dob, setDob] = useState('1985-05-14')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  // Section 2: Professional Info
  const autoEmpId = `EMP-${1040 + totalDoctorCount + 1}`
  const [regNumber, setRegNumber] = useState(`MCI-REG-${Math.floor(100000 + Math.random() * 900000)}`)
  const [qualification, setQualification] = useState('')
  const [experienceYrs, setExperienceYrs] = useState<number | ''>(5)
  const [department, setDepartment] = useState('Cardiology')
  const [specialty, setSpecialty] = useState('')
  const [bio, setBio] = useState('')

  // Section 3: Consultation Details
  const [consultationFee, setConsultationFee] = useState<number | ''>(150)
  const [followUpFee, setFollowUpFee] = useState<number | ''>(80)
  const [slotDuration, setSlotDuration] = useState('15 Minutes')

  // Section 4: Availability Schedule
  const [schedule, setSchedule] = useState([
    { day: 'Monday', available: true, startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Tuesday', available: true, startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Wednesday', available: true, startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Thursday', available: true, startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Friday', available: true, startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Saturday', available: false, startTime: '09:00 AM', endTime: '01:00 PM' },
    { day: 'Sunday', available: false, startTime: '09:00 AM', endTime: '01:00 PM' },
  ])

  // Section 5: Account & Access
  const [tempPassword, setTempPassword] = useState(`TempPass#${Math.floor(1000 + Math.random() * 9000)}`)
  const [forcePassChange, setForcePassChange] = useState(true)
  const [sendCredentialsEmail, setSendCredentialsEmail] = useState(true)

  // Validation Errors & Alert
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [alertMsg, setAlertMsg] = useState<string | null>(null)

  if (!isOpen) return null

  // Derived Username & Login Email
  const derivedUsername = email ? email.split('@')[0] : fullName ? fullName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'doctor.user'

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
    }
  }

  const handleToggleScheduleDay = (index: number) => {
    setSchedule(prev => prev.map((s, idx) => idx === index ? { ...s, available: !s.available } : s))
  }

  const handleScheduleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map((s, idx) => idx === index ? { ...s, [field]: value } : s))
  }

  const handleRegeneratePassword = () => {
    setTempPassword(`TempPass#${Math.floor(1000 + Math.random() * 9000)}`)
  }

  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Full Name is required.'
    if (!phone.trim()) errs.phone = 'Phone number is required.'
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required.'
    if (!regNumber.trim()) errs.regNumber = 'Medical registration number is required.'
    if (!qualification.trim()) errs.qualification = 'Qualification is required.'
    if (experienceYrs === '' || Number(experienceYrs) < 0) errs.experienceYrs = 'Years of experience is required.'
    if (!department) errs.department = 'Department is required.'
    if (!specialty.trim()) errs.specialty = 'Specialty is required.'
    if (consultationFee === '' || Number(consultationFee) <= 0) errs.consultationFee = 'Consultation fee is required.'

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      setAlertMsg('Please fill in all mandatory fields highlighted in red before creating the doctor profile.')
      return false
    }
    setAlertMsg(null)
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formattedName = fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`
    const activeWorkingDays = schedule.filter(s => s.available).map(s => s.day.slice(0, 3))

    const newDoctor: DoctorRecord = {
      id: `DOC-10${totalDoctorCount + 1}`,
      empId: autoEmpId,
      regNumber: regNumber,
      name: formattedName,
      gender: gender,
      department: department,
      specialty: specialty,
      qualification: qualification,
      experienceYrs: Number(experienceYrs) || 5,
      consultationFee: Number(consultationFee) || 150,
      followUpFee: Number(followUpFee) || 80,
      slotDuration: slotDuration,
      availability: 'Available Today',
      status: 'Active',
      email: email,
      phone: phone,
      address: address,
      dob: dob,
      opdRoom: `OPD Room ${101 + totalDoctorCount}`,
      joinedDate: new Date().toISOString().split('T')[0],
      shiftTimings: '09:00 AM - 04:00 PM',
      workingDays: activeWorkingDays.length > 0 ? activeWorkingDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      bio: bio || `${formattedName} is a practitioner in ${department} specializing in ${specialty}.`
    }

    onSubmit(newDoctor)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">

        {/* ── DRAWER HEADER ── */}
        <div className="p-5 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2" style={{ fontFamily: PP }}>
              <UserPlus size={18} className="text-[#0D47A1]" /> Add New Doctor
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Create a new doctor profile and system account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── DRAWER FORM BODY (SCROLLABLE) ── */}
        <form id="add-doctor-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

          {/* Validation Alert Banner */}
          {alertMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#EF4444] font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle size={16} className="shrink-0 text-[#EF4444]" />
              <span>{alertMsg}</span>
            </div>
          )}

          {/* SECTION 01: PERSONAL INFORMATION */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <User size={15} className="text-[#0D47A1]" /> Section 01: Personal Information
            </h3>

            {/* Doctor Photo Upload */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#009688] font-bold text-xl flex items-center justify-center shrink-0 border border-teal-200 overflow-hidden" style={{ fontFamily: PP }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  fullName ? fullName.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DR'
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#111827] block">Doctor Photo Upload</span>
                <p className="text-[11px] text-[#64748B]">JPEG or PNG, Max size 2MB. Reused in patient portal & OPD slips.</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 cursor-pointer transition-colors shadow-xs">
                  <Upload size={13} /> Upload Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Arjun Mehta"
                value={fullName}
                onChange={e => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: '' }) }}
                className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${errors.fullName ? 'border-[#EF4444] bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                  }`}
              />
              {errors.fullName && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.fullName}</p>}
            </div>

            {/* Gender & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: '' }) }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${errors.phone ? 'border-[#EF4444] bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                    }`}
                />
                {errors.phone && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="arjun.mehta@citygeneral.org"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }) }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${errors.email ? 'border-[#EF4444] bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                    }`}
                />
                {errors.email && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Residential Address */}
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="Street address, City, State, ZIP"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white"
              />
            </div>
          </div>

          {/* SECTION 02: PROFESSIONAL INFORMATION */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <Stethoscope size={15} className="text-[#009688]" /> Section 02: Professional Information
            </h3>

            {/* Employee ID (Auto Generated) & Medical Reg Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Employee ID <span className="text-slate-400 font-normal">(Auto Generated)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={autoEmpId}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#0D47A1] font-mono font-bold outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Medical Registration No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="MCI-REG-847291"
                  value={regNumber}
                  onChange={e => { setRegNumber(e.target.value); if (errors.regNumber) setErrors({ ...errors, regNumber: '' }) }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl font-mono text-[#111827] outline-none focus:bg-white transition-colors ${errors.regNumber ? 'border-[#EF4444] bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                    }`}
                />
                {errors.regNumber && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.regNumber}</p>}
              </div>
            </div>

            {/* Qualification & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD, DM (Cardiology)"
                  value={qualification}
                  onChange={e => { setQualification(e.target.value); if (errors.qualification) setErrors({ ...errors, qualification: '' }) }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${errors.qualification ? 'border-[#EF4444] bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                    }`}
                />
                {errors.qualification && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.qualification}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="14"
                  value={experienceYrs}
                  onChange={e => { setExperienceYrs(e.target.value === '' ? '' : Number(e.target.value)); if (errors.experienceYrs) setErrors({ ...errors, experienceYrs: '' }) }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${errors.experienceYrs ? 'border-[#EF4444] bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                    }`}
                />
                {errors.experienceYrs && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.experienceYrs}</p>}
              </div>
            </div>

            {/* Department & Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={e => { setDepartment(e.target.value); if (errors.department) setErrors({ ...errors, department: '' }) }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="ENT">ENT</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Interventional Cardiology"
                  value={specialty}
                  onChange={e => { setSpecialty(e.target.value); if (errors.specialty) setErrors({ ...errors, specialty: '' }) }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${errors.specialty ? 'border-[#EF4444] bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                    }`}
                />
                {errors.specialty && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.specialty}</p>}
              </div>
            </div>

            {/* Professional Bio */}
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Professional Bio (Optional)</label>
              <textarea
                rows={2}
                placeholder="Summary of clinical background, sub-specialty interests, and key procedures..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* SECTION 03: CONSULTATION DETAILS */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <DollarSign size={15} className="text-[#F59E0B]" /> Section 03: Consultation Details
            </h3>

            {/* Consultation Fee & Follow-up Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Consultation Fee ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="150"
                  value={consultationFee}
                  onChange={e => { setConsultationFee(e.target.value === '' ? '' : Number(e.target.value)); if (errors.consultationFee) setErrors({ ...errors, consultationFee: '' }) }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] font-bold outline-none focus:bg-white transition-colors ${errors.consultationFee ? 'border-[#EF4444] bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1]'
                    }`}
                />
                {errors.consultationFee && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.consultationFee}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Follow-up Fee ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="80"
                  value={followUpFee}
                  onChange={e => setFollowUpFee(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white"
                />
              </div>
            </div>

            {/* Appointment Slot Duration Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Appointment Slot Duration <span className="text-red-500">*</span>
              </label>
              <select
                value={slotDuration}
                onChange={e => setSlotDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white"
              >
                <option value="10 Minutes">10 Minutes</option>
                <option value="15 Minutes">15 Minutes</option>
                <option value="20 Minutes">20 Minutes</option>
                <option value="30 Minutes">30 Minutes</option>
                <option value="45 Minutes">45 Minutes</option>
                <option value="60 Minutes">60 Minutes</option>
              </select>
            </div>

            {/* Consultation Mode (Display Only - In-Person) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-[#111827] block">Consultation Mode</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D47A1]">
                <CheckSquare size={16} className="text-[#0D47A1]" />
                <span>In-Person OPD Consultations</span>
              </div>
              <p className="text-[11px] text-[#64748B]">All consultations conducted on-site in assigned OPD cabinet room.</p>
            </div>
          </div>

          {/* SECTION 04: AVAILABILITY SCHEDULE */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <Clock size={15} className="text-[#009688]" /> Section 04: Availability Schedule
            </h3>

            {/* Interactive Weekly Schedule Table */}
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-[#E5E7EB]">
                  <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                    <th className="px-3.5 py-2.5">Day</th>
                    <th className="px-3.5 py-2.5">Available</th>
                    <th className="px-3.5 py-2.5">Start Time</th>
                    <th className="px-3.5 py-2.5">End Time</th>
                    <th className="px-3.5 py-2.5">Slot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {schedule.map((item, idx) => (
                    <tr key={item.day} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold">{item.day}</td>
                      <td className="px-3.5 py-2.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={() => handleToggleScheduleDay(idx)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#009688]" />
                        </label>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <select
                          disabled={!item.available}
                          value={item.startTime}
                          onChange={e => handleScheduleTimeChange(idx, 'startTime', e.target.value)}
                          className="bg-slate-50 border border-[#E5E7EB] px-2 py-1 rounded-lg outline-none font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="08:30 AM">08:30 AM</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="09:30 AM">09:30 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                        </select>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <select
                          disabled={!item.available}
                          value={item.endTime}
                          onChange={e => handleScheduleTimeChange(idx, 'endTime', e.target.value)}
                          className="bg-slate-50 border border-[#E5E7EB] px-2 py-1 rounded-lg outline-none font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                        </select>
                      </td>
                      <td className="px-3.5 py-2.5 font-semibold text-[#0D47A1]">{slotDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 05: ACCOUNT & ACCESS */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <Lock size={15} className="text-[#0D47A1]" /> Section 05: Account & Access
            </h3>

            {/* System Role (Read Only) */}
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#64748B] block font-semibold">Assigned System Role (Read Only)</span>
                <span className="font-bold text-[#111827] text-xs flex items-center gap-1.5 mt-0.5" style={{ fontFamily: PP }}>
                  <Shield size={14} className="text-[#0D47A1]" /> Doctor
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <Lock size={12} /> Locked
              </span>
            </div>

            {/* Username & Login Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Username</label>
                <input
                  type="text"
                  readOnly
                  value={derivedUsername}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Login Email</label>
                <input
                  type="text"
                  readOnly
                  value={email || 'doctor.name@citygeneral.org'}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Temporary Password */}
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Temporary Password (Auto Generated)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={tempPassword}
                  className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#0D47A1] font-mono font-bold outline-none cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleRegeneratePassword}
                  className="px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 shrink-0"
                >
                  <RefreshCw size={13} /> Regenerate
                </button>
              </div>
            </div>

            {/* Account Checkboxes */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forcePassChange}
                  onChange={e => setForcePassChange(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-semibold text-[#111827]">Force password change on first login</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendCredentialsEmail}
                  onChange={e => setSendCredentialsEmail(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-medium text-slate-700">Send login credentials via email (optional)</span>
              </label>
            </div>
          </div>

        </form>

        {/* ── DRAWER FOOTER ── */}
        <div className="p-5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-doctor-form"
            className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm"
            style={{ fontFamily: PP }}
          >
            <UserPlus size={15} /> Create Doctor
          </button>
        </div>

      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// REUSABLE RIGHT DRAWER: EDIT DOCTOR
// ──────────────────────────────────────────────────────────────────────────
export interface EditDoctorDrawerProps {
  isOpen: boolean
  doctor: DoctorRecord | null
  onClose: () => void
  onSave: (updatedDoctor: DoctorRecord) => void
  onDeactivateClick?: (doctor: DoctorRecord) => void
  onTriggerToast?: (msg: string) => void
}

export function EditDoctorDrawer({ isOpen, doctor, onClose, onSave, onDeactivateClick, onTriggerToast }: EditDoctorDrawerProps) {
  if (!isOpen || !doctor) return null

  // --- Form State initialized with doctor props ---
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [fullName, setFullName] = useState(doctor.name)
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(doctor.gender)
  const [dob, setDob] = useState(doctor.dob || '1985-05-14')
  const [phone, setPhone] = useState(doctor.phone)
  const [email, setEmail] = useState(doctor.email)
  const [address, setAddress] = useState(doctor.address || '')

  const [regNumber, setRegNumber] = useState(doctor.regNumber)
  const [qualification, setQualification] = useState(doctor.qualification)
  const [experienceYrs, setExperienceYrs] = useState<number | ''>(doctor.experienceYrs)
  const [department, setDepartment] = useState(doctor.department)
  const [specialty, setSpecialty] = useState(doctor.specialty)
  const [bio, setBio] = useState(doctor.bio || '')

  const [consultationFee, setConsultationFee] = useState<number | ''>(doctor.consultationFee)
  const [followUpFee, setFollowUpFee] = useState<number | ''>(doctor.followUpFee || 80)
  const [slotDuration, setSlotDuration] = useState(doctor.slotDuration || '15 Minutes')

  const [accountStatus, setAccountStatus] = useState<DoctorStatus>(doctor.status)
  const [forcePassChange, setForcePassChange] = useState(true)

  // Availability Weekly Schedule State
  const [schedule, setSchedule] = useState([
    { day: 'Monday', available: doctor.workingDays.includes('Mon'), startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Tuesday', available: doctor.workingDays.includes('Tue'), startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Wednesday', available: doctor.workingDays.includes('Wed'), startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Thursday', available: doctor.workingDays.includes('Thu'), startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Friday', available: doctor.workingDays.includes('Fri'), startTime: '09:00 AM', endTime: '04:00 PM' },
    { day: 'Saturday', available: doctor.workingDays.includes('Sat'), startTime: '09:00 AM', endTime: '01:00 PM' },
    { day: 'Sunday', available: doctor.workingDays.includes('Sun'), startTime: '09:00 AM', endTime: '01:00 PM' },
  ])

  // Track modified fields for visual indicator
  const isFieldModified = (fieldName: keyof DoctorRecord, currentValue: any) => {
    return doctor[fieldName] !== currentValue
  }

  // Validation & Error Alert
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [alertMsg, setAlertMsg] = useState<string | null>(null)

  const derivedUsername = email ? email.split('@')[0] : fullName ? fullName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'doctor.user'

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
    }
  }

  const handleToggleScheduleDay = (index: number) => {
    setSchedule(prev => prev.map((s, idx) => idx === index ? { ...s, available: !s.available } : s))
  }

  const handleScheduleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map((s, idx) => idx === index ? { ...s, [field]: value } : s))
  }

  const handleResetPasswordClick = () => {
    if (onTriggerToast) {
      onTriggerToast(`Password reset link & temporary credentials sent to ${email}`)
    } else {
      alert(`Password reset link & temporary credentials sent to ${email}`)
    }
  }

  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Full Name is required.'
    if (!phone.trim()) errs.phone = 'Phone number is required.'
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required.'
    if (!regNumber.trim()) errs.regNumber = 'Medical registration number is required.'
    if (!qualification.trim()) errs.qualification = 'Qualification is required.'
    if (experienceYrs === '' || Number(experienceYrs) < 0) errs.experienceYrs = 'Years of experience is required.'
    if (!department) errs.department = 'Department is required.'
    if (!specialty.trim()) errs.specialty = 'Specialty is required.'
    if (consultationFee === '' || Number(consultationFee) <= 0) errs.consultationFee = 'Consultation fee is required.'

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      setAlertMsg('Please fill in all mandatory fields highlighted in red before saving changes.')
      return false
    }
    setAlertMsg(null)
    return true
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const activeWorkingDays = schedule.filter(s => s.available).map(s => s.day.slice(0, 3))

    const updatedDoctor: DoctorRecord = {
      ...doctor,
      name: fullName,
      gender: gender,
      dob: dob,
      phone: phone,
      email: email,
      address: address,
      regNumber: regNumber,
      qualification: qualification,
      experienceYrs: Number(experienceYrs) || doctor.experienceYrs,
      department: department,
      specialty: specialty,
      bio: bio,
      consultationFee: Number(consultationFee) || doctor.consultationFee,
      followUpFee: Number(followUpFee) || 80,
      slotDuration: slotDuration,
      status: accountStatus,
      workingDays: activeWorkingDays.length > 0 ? activeWorkingDays : doctor.workingDays
    }

    onSave(updatedDoctor)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">

        {/* ── DRAWER HEADER ── */}
        <div className="p-5 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2" style={{ fontFamily: PP }}>
              <Edit size={18} className="text-[#009688]" /> Edit Doctor — {doctor.id}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Update doctor information and availability.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── DRAWER FORM BODY (SCROLLABLE) ── */}
        <form id="edit-doctor-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

          {/* Validation Alert Banner */}
          {alertMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#EF4444] font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle size={16} className="shrink-0 text-[#EF4444]" />
              <span>{alertMsg}</span>
            </div>
          )}

          {/* SECTION 01: PERSONAL INFORMATION */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <User size={15} className="text-[#0D47A1]" /> Section 01: Personal Information
            </h3>

            {/* Doctor Photo */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-[#0D47A1] text-white font-bold text-xl flex items-center justify-center shrink-0 border border-blue-200 overflow-hidden" style={{ fontFamily: PP }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  fullName.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#111827] block">Doctor Photo</span>
                <p className="text-[11px] text-[#64748B]">Update profile photo for patient directory.</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 cursor-pointer transition-colors shadow-xs">
                  <Upload size={13} /> Change Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                {isFieldModified('name', fullName) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <input
                type="text"
                value={fullName}
                onChange={e => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: '' }) }}
                className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${isFieldModified('name', fullName) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                  } ${errors.fullName ? 'border-[#EF4444] bg-red-50/50' : 'focus:border-[#0D47A1] focus:bg-white'}`}
              />
              {errors.fullName && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.fullName}</p>}
            </div>

            {/* Gender & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('gender', gender) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white ${isFieldModified('gender', gender) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">Date of Birth</label>
                  {isFieldModified('dob', dob) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white ${isFieldModified('dob', dob) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    }`}
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('phone', phone) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: '' }) }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${isFieldModified('phone', phone) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    } ${errors.phone ? 'border-[#EF4444] bg-red-50/50' : 'focus:border-[#0D47A1] focus:bg-white'}`}
                />
                {errors.phone && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.phone}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('email', email) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }) }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${isFieldModified('email', email) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    } ${errors.email ? 'border-[#EF4444] bg-red-50/50' : 'focus:border-[#0D47A1] focus:bg-white'}`}
                />
                {errors.email && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">Residential Address</label>
                {isFieldModified('address', address) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white ${isFieldModified('address', address) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                  }`}
              />
            </div>
          </div>

          {/* SECTION 02: PROFESSIONAL INFORMATION */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <Stethoscope size={15} className="text-[#009688]" /> Section 02: Professional Information
            </h3>

            {/* Employee ID (Read Only) & Medical Reg Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Employee ID <span className="text-slate-400 font-normal">(Read Only)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={doctor.empId}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#0D47A1] font-mono font-bold outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Medical Registration No. <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('regNumber', regNumber) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="text"
                  value={regNumber}
                  onChange={e => { setRegNumber(e.target.value); if (errors.regNumber) setErrors({ ...errors, regNumber: '' }) }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl font-mono text-[#111827] outline-none transition-colors ${isFieldModified('regNumber', regNumber) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    } ${errors.regNumber ? 'border-[#EF4444] bg-red-50/50' : 'focus:border-[#0D47A1] focus:bg-white'}`}
                />
                {errors.regNumber && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.regNumber}</p>}
              </div>
            </div>

            {/* Qualification & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Qualification <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('qualification', qualification) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="text"
                  value={qualification}
                  onChange={e => { setQualification(e.target.value); if (errors.qualification) setErrors({ ...errors, qualification: '' }) }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${isFieldModified('qualification', qualification) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    } ${errors.qualification ? 'border-[#EF4444] bg-red-50/50' : 'focus:border-[#0D47A1] focus:bg-white'}`}
                />
                {errors.qualification && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.qualification}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('experienceYrs', Number(experienceYrs)) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={experienceYrs}
                  onChange={e => { setExperienceYrs(e.target.value === '' ? '' : Number(e.target.value)); if (errors.experienceYrs) setErrors({ ...errors, experienceYrs: '' }) }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${isFieldModified('experienceYrs', Number(experienceYrs)) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    } ${errors.experienceYrs ? 'border-[#EF4444] bg-red-50/50' : 'focus:border-[#0D47A1] focus:bg-white'}`}
                />
                {errors.experienceYrs && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.experienceYrs}</p>}
              </div>
            </div>

            {/* Department & Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Department <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('department', department) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <select
                  value={department}
                  onChange={e => { setDepartment(e.target.value); if (errors.department) setErrors({ ...errors, department: '' }) }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white ${isFieldModified('department', department) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    }`}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="ENT">ENT</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Specialty <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('specialty', specialty) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="text"
                  value={specialty}
                  onChange={e => { setSpecialty(e.target.value); if (errors.specialty) setErrors({ ...errors, specialty: '' }) }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${isFieldModified('specialty', specialty) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    } ${errors.specialty ? 'border-[#EF4444] bg-red-50/50' : 'focus:border-[#0D47A1] focus:bg-white'}`}
                />
                {errors.specialty && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.specialty}</p>}
              </div>
            </div>

            {/* Professional Bio */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">Professional Bio</label>
                {isFieldModified('bio', bio) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white resize-none ${isFieldModified('bio', bio) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                  }`}
              />
            </div>
          </div>

          {/* SECTION 03: CONSULTATION DETAILS */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <DollarSign size={15} className="text-[#F59E0B]" /> Section 03: Consultation Details
            </h3>

            {/* Consultation Fee & Follow-up Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Consultation Fee ($) <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified('consultationFee', Number(consultationFee)) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={e => { setConsultationFee(e.target.value === '' ? '' : Number(e.target.value)); if (errors.consultationFee) setErrors({ ...errors, consultationFee: '' }) }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-bold outline-none transition-colors ${isFieldModified('consultationFee', Number(consultationFee)) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    } ${errors.consultationFee ? 'border-[#EF4444] bg-red-50/50' : 'focus:border-[#0D47A1] focus:bg-white'}`}
                />
                {errors.consultationFee && <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.consultationFee}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">Follow-up Fee ($)</label>
                  {isFieldModified('followUpFee', Number(followUpFee)) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={followUpFee}
                  onChange={e => setFollowUpFee(e.target.value === '' ? '' : Number(e.target.value))}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white ${isFieldModified('followUpFee', Number(followUpFee)) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                    }`}
                />
              </div>
            </div>

            {/* Appointment Slot Duration Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">
                  Appointment Slot Duration <span className="text-red-500">*</span>
                </label>
                {isFieldModified('slotDuration', slotDuration) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <select
                value={slotDuration}
                onChange={e => setSlotDuration(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white ${isFieldModified('slotDuration', slotDuration) ? 'border-[#009688] bg-teal-50/20' : 'bg-slate-50 border-[#E5E7EB]'
                  }`}
              >
                <option value="10 Minutes">10 Minutes</option>
                <option value="15 Minutes">15 Minutes</option>
                <option value="20 Minutes">20 Minutes</option>
                <option value="30 Minutes">30 Minutes</option>
                <option value="45 Minutes">45 Minutes</option>
                <option value="60 Minutes">60 Minutes</option>
              </select>
            </div>

            {/* Consultation Mode (Display Only - In-Person) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-[#111827] block">Consultation Mode</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D47A1]">
                <CheckSquare size={16} className="text-[#0D47A1]" />
                <span>In-Person OPD Consultations</span>
              </div>
              <p className="text-[11px] text-[#64748B]">All consultations conducted on-site in assigned OPD cabinet room.</p>
            </div>
          </div>

          {/* SECTION 04: AVAILABILITY SCHEDULE */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <Clock size={15} className="text-[#009688]" /> Section 04: Availability Schedule
            </h3>

            {/* Interactive Weekly Schedule Table */}
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-[#E5E7EB]">
                  <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                    <th className="px-3.5 py-2.5">Day</th>
                    <th className="px-3.5 py-2.5">Available</th>
                    <th className="px-3.5 py-2.5">Start Time</th>
                    <th className="px-3.5 py-2.5">End Time</th>
                    <th className="px-3.5 py-2.5">Slot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {schedule.map((item, idx) => (
                    <tr key={item.day} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold">{item.day}</td>
                      <td className="px-3.5 py-2.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={() => handleToggleScheduleDay(idx)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#009688]" />
                        </label>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <select
                          disabled={!item.available}
                          value={item.startTime}
                          onChange={e => handleScheduleTimeChange(idx, 'startTime', e.target.value)}
                          className="bg-slate-50 border border-[#E5E7EB] px-2 py-1 rounded-lg outline-none font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="08:30 AM">08:30 AM</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="09:30 AM">09:30 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                        </select>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <select
                          disabled={!item.available}
                          value={item.endTime}
                          onChange={e => handleScheduleTimeChange(idx, 'endTime', e.target.value)}
                          className="bg-slate-50 border border-[#E5E7EB] px-2 py-1 rounded-lg outline-none font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                        </select>
                      </td>
                      <td className="px-3.5 py-2.5 font-semibold text-[#0D47A1]">{slotDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 05: ACCOUNT & ACCESS */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5" style={{ fontFamily: PP }}>
              <Lock size={15} className="text-[#0D47A1]" /> Section 05: Account & Access
            </h3>

            {/* System Role (Read Only) */}
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#64748B] block font-semibold">Assigned System Role (Read Only)</span>
                <span className="font-bold text-[#111827] text-xs flex items-center gap-1.5 mt-0.5" style={{ fontFamily: PP }}>
                  <Shield size={14} className="text-[#0D47A1]" /> Doctor
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <Lock size={12} /> Locked
              </span>
            </div>

            {/* Username & Login Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Username (Read Only)</label>
                <input
                  type="text"
                  readOnly
                  value={derivedUsername}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Login Email (Read Only)</label>
                <input
                  type="text"
                  readOnly
                  value={email}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Account Status Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">Account Status</label>
                {isFieldModified('status', accountStatus) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <select
                value={accountStatus}
                onChange={e => setAccountStatus(e.target.value as DoctorStatus)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] font-bold outline-none focus:border-[#0D47A1]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Reset Password & Force Password Change Checkbox */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#111827] block">Password & Credentials</span>
                  <span className="text-[11px] text-[#64748B]">Trigger password reset for doctor account</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetPasswordClick}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <KeyRound size={13} /> Reset Password
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-slate-200">
                <input
                  type="checkbox"
                  checked={forcePassChange}
                  onChange={e => setForcePassChange(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-medium text-xs text-[#111827]">Force password change on next login</span>
              </label>
            </div>
          </div>

        </form>

        {/* ── DRAWER FOOTER ── */}
        <div className="p-5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          {/* Secondary Action: Deactivate Doctor Button */}
          {onDeactivateClick ? (
            <button
              type="button"
              onClick={() => onDeactivateClick(doctor)}
              className="px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-[#EF4444] text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-xs"
              style={{ fontFamily: PP }}
            >
              <AlertTriangle size={14} /> Deactivate Doctor
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-doctor-form"
              className="px-6 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796b] transition-colors flex items-center gap-2 shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Check size={15} /> Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// DOCTOR PROFILE SCREEN (Comprehensive Profile Page)
// ──────────────────────────────────────────────────────────────────────────
export interface DoctorProfileScreenProps {
  doctor?: DoctorRecord
  onBack: () => void
  onEdit?: (doctor: DoctorRecord) => void
}

export function DoctorProfileScreen({ doctor = INITIAL_DOCTORS[0], onBack, onEdit }: DoctorProfileScreenProps) {
  const [docState, setDocState] = useState<DoctorRecord>(doctor)
  const [activeTab, setActiveTab] = useState<'overview' | 'professional' | 'schedule' | 'appointments' | 'patients' | 'timeline'>('overview')

  // Search & Filters within Tabs
  const [apptSearch, setApptSearch] = useState('')
  const [apptDateFilter, setApptDateFilter] = useState('All Dates')
  const [patientSearch, setPatientSearch] = useState('')

  // Modals & Drawers
  const [selectedApptDetail, setSelectedApptDetail] = useState<any | null>(null)
  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Badges helper
  const getAvailStyle = (avail: DoctorAvailability) => {
    switch (avail) {
      case 'Available Today':
        return { bg: 'bg-teal-50 text-[#009688] border-teal-200', dot: 'bg-[#009688]' }
      case 'On Duty':
        return { bg: 'bg-blue-50 text-[#0D47A1] border-blue-200', dot: 'bg-[#0D47A1]' }
      case 'On Call':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-600' }
      case 'On Leave':
        return { bg: 'bg-amber-50 text-[#F59E0B] border-amber-200', dot: 'bg-[#F59E0B]' }
      default:
        return { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' }
    }
  }

  const initials = docState.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const availStyle = getAvailStyle(docState.availability)

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return MOCK_DOCTOR_APPOINTMENTS.filter(a => {
      if (apptSearch) {
        const q = apptSearch.toLowerCase()
        const match = a.id.toLowerCase().includes(q) || a.patientName.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
        if (!match) return false
      }
      if (apptDateFilter === 'Today' && !a.date.includes('March 28')) return false
      return true
    })
  }, [apptSearch, apptDateFilter])

  // Filtered Assigned Patients
  const filteredPatients = useMemo(() => {
    return MOCK_DOCTOR_PATIENTS.filter(p => {
      if (patientSearch) {
        const q = patientSearch.toLowerCase()
        const match = p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.complaint.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [patientSearch])

  // Handlers
  const handleSaveEditDoctor = (updatedDoc: DoctorRecord) => {
    setDocState(updatedDoc)
    triggerToast(`Doctor information updated successfully.`)
    setShowEditDrawer(false)
    if (onEdit) onEdit(updatedDoc)
  }

  const handleConfirmDeactivate = () => {
    setDocState(prev => ({
      ...prev,
      status: 'Inactive',
      availability: 'Out of Office'
    }))
    triggerToast(`Doctor ${docState.name} has been deactivated.`)
    setDeactivateDialogOpen(false)
    setShowEditDrawer(false)
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

      {/* ── 1. HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Doctor Profile</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] pl-8">
            <span>Hospital Admin</span>
            <ChevronRight size={13} className="text-slate-300" />
            <button onClick={onBack} className="hover:text-[#0D47A1] transition-colors">Doctor Management</button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-[#111827]">{docState.name}</span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Skeleton Loader Toggle for Testing/Validation */}
          <button
            onClick={() => {
              setIsLoading(prev => !prev)
              triggerToast(isLoading ? 'Loaded full profile view.' : 'Simulating loading skeletons...')
            }}
            className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin text-[#0D47A1]' : ''} />
            <span>{isLoading ? 'Loading Active' : 'Simulate Loading'}</span>
          </button>

          <button
            onClick={() => setShowEditDrawer(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Edit size={14} className="text-[#0D47A1]" /> Edit Doctor
          </button>

          <button
            onClick={() => setDeactivateDialogOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-red-200 bg-red-50 text-[#EF4444] hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-sm"
            style={{ fontFamily: PP }}
          >
            <AlertTriangle size={14} /> Deactivate Doctor
          </button>
        </div>
      </div>

      {/* ── 2. DOCTOR PROFILE HEADER CARD ── */}
      {isLoading ? (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm animate-pulse flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-200 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-slate-200 rounded w-48" />
            <div className="h-4 bg-slate-200 rounded w-64" />
            <div className="h-3 bg-slate-100 rounded w-80" />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl bg-[#0D47A1] text-white font-bold text-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-md"
              style={{ fontFamily: PP }}
            >
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>{docState.name}</h2>
                <span className="text-xs font-mono font-bold text-[#0D47A1] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {docState.id}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  EMP: {docState.empId}
                </span>
                <span className="text-xs font-mono font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100 flex items-center gap-1">
                  <FileCheck size={13} /> {docState.regNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${docState.status === 'Active' ? 'bg-emerald-50 text-[#66BB6A] border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                  {docState.status}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${availStyle.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${availStyle.dot}`} />
                  {docState.availability}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                <span className="font-semibold text-[#111827]">{docState.qualification}</span>
                <span>&bull;</span>
                <span className="font-bold text-[#0D47A1]">{docState.specialty}</span>
                <span>({docState.department})</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#64748B] pt-0.5">
                <span className="flex items-center gap-1"><Award size={14} className="text-[#F59E0B]" /> {docState.experienceYrs} Years Experience</span>
                <span className="flex items-center gap-1 font-bold text-[#0D47A1]"><DollarSignIcon /> ${docState.consultationFee} Consultation Fee</span>
                <span className="flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"><Building2 size={13} /> {docState.opdRoom}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <button
              onClick={() => setActiveTab('schedule')}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-slate-700 hover:text-[#0D47A1] text-xs font-bold transition-colors flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Clock size={14} /> Schedule
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Calendar size={14} /> Appointments
            </button>
          </div>
        </div>
      )}

      {/* ── 3. TAB NAVIGATION BAR & MAIN LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Main Tabs & Tab Contents (Span 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB STRIP */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-1.5 shadow-sm flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'professional', label: 'Professional Info' },
              { id: 'schedule', label: 'Availability Schedule' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'patients', label: 'Assigned Patients' },
              { id: 'timeline', label: 'Activity Timeline' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${activeTab === tab.id
                  ? 'bg-[#0D47A1] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
                  }`}
                style={{ fontFamily: PP }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 01: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* QUICK STATISTICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] font-medium block">Today's Appointments</span>
                    <span className="text-2xl font-bold text-[#111827] mt-0.5 block" style={{ fontFamily: PP }}>8</span>
                    <span className="text-[11px] text-[#0D47A1] font-medium mt-1 block">3 Completed &bull; 5 Scheduled</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                    <Calendar size={20} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] font-medium block">Total Patients</span>
                    <span className="text-2xl font-bold text-[#111827] mt-0.5 block" style={{ fontFamily: PP }}>142</span>
                    <span className="text-[11px] text-[#009688] font-medium mt-1 block">Active clinical cases</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
                    <User size={20} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] font-medium block">Experience</span>
                    <span className="text-2xl font-bold text-[#111827] mt-0.5 block" style={{ fontFamily: PP }}>{docState.experienceYrs} Yrs</span>
                    <span className="text-[11px] text-[#F59E0B] font-medium mt-1 block">{docState.specialty}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
                    <Award size={20} />
                  </div>
                </div>
              </div>

              {/* OVERVIEW CONTENT CARDS */}
              <div className="w-full">

                {/* Card 1: Basic Information */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-3" style={{ fontFamily: PP }}>
                    <User size={16} className="text-[#0D47A1]" /> Basic Information
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Full Name</span>
                      <span className="font-bold text-[#111827]">{docState.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Gender</span>
                      <span className="font-medium text-[#111827]">{docState.gender}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Email Address</span>
                      <span className="font-semibold text-[#0D47A1]">{docState.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Contact Phone</span>
                      <span className="font-medium text-[#111827]">{docState.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">OPD Cabinet Room</span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{docState.opdRoom}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-[#64748B]">Facility Location</span>
                      <span className="font-semibold text-[#111827]">City General Main Campus</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B]">Joined HMS</span>
                      <span className="font-medium text-[#111827]">{docState.joinedDate}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 02: PROFESSIONAL INFORMATION */}
          {activeTab === 'professional' && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Professional Credentials & Attributes</h3>
                <p className="text-xs text-[#64748B]">Detailed practice specifications and registration metrics.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">Employee ID</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">{docState.empId}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">Medical Registration Number</span>
                  <span className="font-mono font-bold text-teal-700 text-sm">{docState.regNumber}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">Qualification & Degrees</span>
                  <span className="font-bold text-[#111827] text-sm">{docState.qualification}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">Department</span>
                  <span className="font-bold text-[#111827] text-sm">{docState.department}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">Clinical Specialty</span>
                  <span className="font-bold text-[#0D47A1] text-sm">{docState.specialty}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">Years of Experience</span>
                  <span className="font-bold text-[#111827] text-sm">{docState.experienceYrs} Years</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">Consultation Fee</span>
                  <span className="font-bold text-[#0D47A1] text-sm" style={{ fontFamily: PP }}>${docState.consultationFee}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[#64748B] block text-[11px]">Appointment Slot Duration</span>
                  <span className="font-bold text-[#111827] text-sm">{docState.slotDuration || '15 Minutes'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2">
                  <span className="text-[#64748B] block text-[11px]">Account Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-block mt-1 ${docState.status === 'Active' ? 'bg-emerald-50 text-[#66BB6A] border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                    {docState.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 03: AVAILABILITY SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Weekly OPD Practice Schedule</h3>
                  <p className="text-xs text-[#64748B]">Assigned OPD cabinet: <span className="font-bold text-teal-700">{docState.opdRoom}</span></p>
                </div>
                <span className="text-xs font-bold text-[#0D47A1] bg-blue-50 px-3 py-1 rounded-xl border border-blue-100 shrink-0">
                  Shift: {docState.shiftTimings}
                </span>
              </div>

              {/* Weekly Schedule Table */}
              <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-[#E5E7EB]">
                    <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                      <th className="px-4 py-3">Day</th>
                      <th className="px-4 py-3">Available</th>
                      <th className="px-4 py-3">Start Time</th>
                      <th className="px-4 py-3">End Time</th>
                      <th className="px-4 py-3">Slot Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#111827]">
                    {MOCK_WEEKLY_SCHEDULE.map(sched => (
                      <tr key={sched.day} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold">{sched.day}</td>
                        <td className="px-4 py-3">
                          {sched.available ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-[#009688] border border-teal-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#009688]" /> Available
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Not Available
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">{sched.startTime}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{sched.endTime}</td>
                        <td className="px-4 py-3 font-semibold text-[#0D47A1]">{sched.slotDuration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 04: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={apptSearch}
                    onChange={e => setApptSearch(e.target.value)}
                    placeholder="Search Appointment ID, Patient Name..."
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                  />
                  {apptSearch && (
                    <button onClick={() => setApptSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
                    <Filter size={13} className="text-slate-400" />
                    <span className="text-slate-500 font-medium">Filter Date:</span>
                    <select
                      value={apptDateFilter}
                      onChange={e => setApptDateFilter(e.target.value)}
                      className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
                    >
                      <option value="All Dates">All Dates</option>
                      <option value="Today">Today</option>
                      <option value="This Week">This Week</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Appointments Table */}
              <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB]">
                    <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                      <th className="px-4 py-3">Appointment ID</th>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#111827]">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-16" /></td>
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-28" /></td>
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-20" /></td>
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-16" /></td>
                          <td className="px-4 py-3"><div className="h-5 bg-slate-200 rounded-full w-20" /></td>
                          <td className="px-4 py-3"><div className="h-5 bg-slate-200 rounded w-16 ml-auto" /></td>
                        </tr>
                      ))
                    ) : filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Calendar size={28} className="text-slate-300" />
                            <span className="font-bold text-[#111827]" style={{ fontFamily: PP }}>No appointments found.</span>
                            <span className="text-xs text-[#64748B]">No appointments matching your current search or date filter.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map(apt => (
                        <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">{apt.id}</td>
                          <td className="px-4 py-3 font-bold text-[#111827]" style={{ fontFamily: PP }}>{apt.patientName}</td>
                          <td className="px-4 py-3 text-slate-600">{apt.date}</td>
                          <td className="px-4 py-3 text-slate-600">{apt.time}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${apt.status === 'Completed'
                              ? 'bg-emerald-50 text-[#66BB6A] border-emerald-200'
                              : apt.status === 'In Progress'
                                ? 'bg-blue-50 text-[#0D47A1] border-blue-200'
                                : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                              }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedApptDetail(apt)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0D47A1] font-bold text-xs transition-colors"
                              style={{ fontFamily: PP }}
                            >
                              View Appointment
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

          {/* TAB 05: ASSIGNED PATIENTS */}
          {activeTab === 'patients' && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
              {/* Toolbar */}
              <div className="relative max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                  placeholder="Search Patient ID, Name, Complaint..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
                {patientSearch && (
                  <button onClick={() => setPatientSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Patients Table */}
              <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB]">
                    <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                      <th className="px-4 py-3">Patient ID</th>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Gender</th>
                      <th className="px-4 py-3">Age</th>
                      <th className="px-4 py-3">Last Visit</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#111827]">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-16" /></td>
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-28" /></td>
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-12" /></td>
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-10" /></td>
                          <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-20" /></td>
                          <td className="px-4 py-3"><div className="h-5 bg-slate-200 rounded-full w-16" /></td>
                          <td className="px-4 py-3"><div className="h-5 bg-slate-200 rounded w-20 ml-auto" /></td>
                        </tr>
                      ))
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <User size={28} className="text-slate-300" />
                            <span className="font-bold text-[#111827]" style={{ fontFamily: PP }}>No assigned patients.</span>
                            <span className="text-xs text-[#64748B]">No patient records matching search criteria for this doctor.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map(pt => (
                        <tr key={pt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">{pt.id}</td>
                          <td className="px-4 py-3 font-bold text-[#111827]" style={{ fontFamily: PP }}>{pt.name}</td>
                          <td className="px-4 py-3 text-slate-600">{pt.gender}</td>
                          <td className="px-4 py-3 text-slate-600">{pt.age} Yrs</td>
                          <td className="px-4 py-3 text-slate-600">{pt.lastVisit}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${pt.status === 'Active'
                              ? 'bg-emerald-50 text-[#66BB6A] border-emerald-200'
                              : pt.status === 'Admitted'
                                ? 'bg-blue-50 text-[#0D47A1] border-blue-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                              {pt.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => triggerToast(`Viewing profile for ${pt.name} (${pt.id})...`)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0D47A1] font-bold text-xs transition-colors"
                              style={{ fontFamily: PP }}
                            >
                              View Patient Profile
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

          {/* TAB 06: ACTIVITY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Chronological Activity Log</h3>
                <p className="text-xs text-[#64748B]">Audit trajectory of consultation events, schedule changes, and registration records.</p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {MOCK_DOCTOR_TIMELINE.map((item, idx) => {
                  const IconComp = item.icon
                  return (
                    <div key={idx} className="relative flex items-start gap-4 group">
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#0D47A1] flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB] flex-1 space-y-1 hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-bold text-[#111827] text-xs flex items-center gap-1.5" style={{ fontFamily: PP }}>
                            <IconComp size={14} className="text-[#0D47A1]" /> {item.title}
                          </span>
                          <span className="text-[11px] text-[#64748B] font-mono">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: RIGHT CONTEXT PANEL */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-[#0D47A1] text-white font-bold text-base flex items-center justify-center shrink-0" style={{ fontFamily: PP }}>
                {initials}
              </div>
              <div className="truncate">
                <span className="font-bold text-[#111827] text-sm truncate block" style={{ fontFamily: PP }}>{docState.name}</span>
                <span className="text-xs text-[#0D47A1] font-semibold truncate block">{docState.specialty}</span>
                <span className="text-[11px] text-[#64748B] truncate block">{docState.department}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-[#64748B]">OPD Cabinet:</span>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{docState.opdRoom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Shift Timings:</span>
                <span className="font-medium text-[#111827]">{docState.shiftTimings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Consultation Fee:</span>
                <span className="font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>${docState.consultationFee}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: PP }}>
              <Clock size={14} className="text-[#009688]" /> Today's Upcoming Queue
            </h3>

            <div className="space-y-2.5 text-xs">
              {MOCK_DOCTOR_APPOINTMENTS.slice(0, 3).map(apt => (
                <div key={apt.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{apt.patientName}</span>
                    <span className="font-mono text-[10px] text-[#0D47A1] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{apt.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{apt.complaint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* APPOINTMENT DETAIL MODAL */}
      {selectedApptDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#0D47A1]" />
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Appointment Details</h3>
              </div>
              <button onClick={() => setSelectedApptDetail(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Appointment ID</span>
                <span className="font-mono font-bold text-[#0D47A1]">{selectedApptDetail.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Patient Name</span>
                <span className="font-bold text-[#111827]">{selectedApptDetail.patientName} ({selectedApptDetail.gender}/{selectedApptDetail.age}Y)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Date & Time</span>
                <span className="font-medium text-[#111827]">{selectedApptDetail.date} &bull; {selectedApptDetail.time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Visit Type</span>
                <span className="font-medium text-[#111827]">{selectedApptDetail.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#64748B]">Status</span>
                <span className="font-semibold text-[#66BB6A]">{selectedApptDetail.status}</span>
              </div>
              <div className="py-1">
                <span className="text-[#64748B] block text-[11px]">Chief Complaint</span>
                <p className="text-slate-700 font-medium mt-0.5">{selectedApptDetail.complaint}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApptDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                style={{ fontFamily: PP }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE EDIT DOCTOR DRAWER */}
      <EditDoctorDrawer
        isOpen={showEditDrawer}
        doctor={docState}
        onClose={() => setShowEditDrawer(false)}
        onSave={handleSaveEditDoctor}
        onDeactivateClick={() => setDeactivateDialogOpen(true)}
        onTriggerToast={triggerToast}
      />

      {/* REUSABLE DEACTIVATE DOCTOR CONFIRMATION DIALOG */}
      <DeactivateDoctorDialog
        isOpen={deactivateDialogOpen}
        doctor={docState}
        onClose={() => setDeactivateDialogOpen(false)}
        onConfirm={handleConfirmDeactivate}
      />

    </div>
  )
}

function DollarSignIcon() {
  return <span className="text-xs font-bold">$</span>
}

// ──────────────────────────────────────────────────────────────────────────
// DOCTOR MANAGEMENT CENTER SCREEN (Main Listing Screen)
// ──────────────────────────────────────────────────────────────────────────
export function DoctorManagementCenterScreen() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>(INITIAL_DOCTORS)

  // --- Search State ---
  const [searchDoctorQuery, setSearchDoctorQuery] = useState('')
  const [searchEmpIdQuery, setSearchEmpIdQuery] = useState('')
  const [searchRegNoQuery, setSearchRegNoQuery] = useState('')

  // --- Filter States ---
  const [deptFilter, setDeptFilter] = useState<string>('All')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('All')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [experienceFilter, setExperienceFilter] = useState<string>('All')

  // --- Sorting State ---
  const [sortColumn, setSortColumn] = useState<keyof DoctorRecord>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // --- Loading State Simulation ---
  const [isLoading, setIsLoading] = useState(false)

  // --- Toast Notification ---
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // --- Drawers & Modals ---
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<DoctorRecord | null>(null)
  const [quickDetailsDoctor, setQuickDetailsDoctor] = useState<DoctorRecord | null>(null)
  const [scheduleDoctor, setScheduleDoctor] = useState<DoctorRecord | null>(null)
  const [fullProfileDoctor, setFullProfileDoctor] = useState<DoctorRecord | null>(null)
  const [deactivateDialogDoctor, setDeactivateDialogDoctor] = useState<DoctorRecord | null>(null)

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // --- KPI Computation ---
  const totalDoctorsCount = doctors.length
  const availableTodayCount = doctors.filter(
    d => d.availability === 'Available Today' || d.availability === 'On Duty'
  ).length
  const onLeaveCount = doctors.filter(
    d => d.availability === 'On Leave' || d.status === 'On Leave'
  ).length
  const departmentsCoveredCount = useMemo(() => {
    const depts = new Set(doctors.map(d => d.department))
    return depts.size
  }, [doctors])

  // --- Filtered & Sorted Dataset ---
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // 1. Search Doctor Name
      if (searchDoctorQuery) {
        const q = searchDoctorQuery.toLowerCase()
        const matchName = doc.name.toLowerCase().includes(q) || doc.id.toLowerCase().includes(q)
        if (!matchName) return false
      }
      // 2. Employee ID Search
      if (searchEmpIdQuery) {
        const q = searchEmpIdQuery.toLowerCase()
        if (!doc.empId.toLowerCase().includes(q)) return false
      }
      // 3. Medical Registration Number Search
      if (searchRegNoQuery) {
        const q = searchRegNoQuery.toLowerCase()
        if (!doc.regNumber.toLowerCase().includes(q)) return false
      }
      // 4. Department Filter
      if (deptFilter !== 'All' && doc.department !== deptFilter) return false

      // 5. Specialty Filter
      if (specialtyFilter !== 'All' && doc.specialty !== specialtyFilter) return false

      // 6. Availability Filter
      if (availabilityFilter !== 'All' && doc.availability !== availabilityFilter) return false

      // 7. Status Filter
      if (statusFilter !== 'All' && doc.status !== statusFilter) return false

      // 8. Experience Filter
      if (experienceFilter !== 'All') {
        if (experienceFilter === '0-5 Years' && doc.experienceYrs > 5) return false
        if (experienceFilter === '5-10 Years' && (doc.experienceYrs < 5 || doc.experienceYrs > 10)) return false
        if (experienceFilter === '10-15 Years' && (doc.experienceYrs < 10 || doc.experienceYrs > 15)) return false
        if (experienceFilter === '15+ Years' && doc.experienceYrs < 15) return false
      }

      return true
    }).sort((a, b) => {
      const valA = a[sortColumn]
      const valB = b[sortColumn]
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA
      }
      const strA = Array.isArray(valA) ? valA.join(', ') : String(valA ?? '').toLowerCase()
      const strB = Array.isArray(valB) ? valB.join(', ') : String(valB ?? '').toLowerCase()
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [
    doctors, searchDoctorQuery, searchEmpIdQuery, searchRegNoQuery,
    deptFilter, specialtyFilter, availabilityFilter, statusFilter, experienceFilter,
    sortColumn, sortDirection
  ])

  const handleSort = (col: keyof DoctorRecord) => {
    if (sortColumn === col) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(col)
      setSortDirection('asc')
    }
  }

  // --- Reset All Filters ---
  const handleResetFilters = () => {
    setSearchDoctorQuery('')
    setSearchEmpIdQuery('')
    setSearchRegNoQuery('')
    setDeptFilter('All')
    setSpecialtyFilter('All')
    setAvailabilityFilter('All')
    setStatusFilter('All')
    setExperienceFilter('All')
    triggerToast('All search criteria and filters reset.')
  }

  // --- Handlers: Create Doctor from AddDoctorDrawer ---
  const handleAddDoctorSubmit = (newDoctor: DoctorRecord) => {
    setDoctors([newDoctor, ...doctors])
    triggerToast(`Doctor ${newDoctor.name} created successfully.`)
    setShowAddDrawer(false)
  }

  // --- Handlers: Edit Doctor ---
  const handleOpenEditDrawer = (doc: DoctorRecord) => {
    setEditingDoctor(doc)
  }

  const handleSaveEditDoctor = (updatedDoc: DoctorRecord) => {
    setDoctors(prev =>
      prev.map(d => (d.id === updatedDoc.id ? updatedDoc : d))
    )
    triggerToast(`Doctor information updated successfully.`)
    setEditingDoctor(null)
  }

  // --- Handlers: Deactivate Doctor Dialog ---
  const handleConfirmDeactivate = () => {
    if (!deactivateDialogDoctor) return
    setDoctors(prev =>
      prev.map(d => (d.id === deactivateDialogDoctor.id ? { ...d, status: 'Inactive', availability: 'Out of Office' } : d))
    )
    triggerToast(`Doctor ${deactivateDialogDoctor.name} has been deactivated.`)
    setDeactivateDialogDoctor(null)
    setEditingDoctor(null)
  }

  // --- Badges Styling ---
  const getAvailabilityBadgeStyle = (avail: DoctorAvailability) => {
    switch (avail) {
      case 'Available Today':
        return { bg: 'bg-[#E6F4F1] text-[#009688] border-teal-200', dot: 'bg-[#009688]' }
      case 'On Duty':
        return { bg: 'bg-blue-50 text-[#0D47A1] border-blue-200', dot: 'bg-[#0D47A1]' }
      case 'On Call':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-600' }
      case 'On Leave':
        return { bg: 'bg-amber-50 text-[#F59E0B] border-amber-200', dot: 'bg-[#F59E0B]' }
      case 'Out of Office':
        return { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' }
    }
  }

  const getStatusBadgeStyle = (status: DoctorStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-[#66BB6A] border-emerald-200 font-semibold'
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-200 font-semibold'
      case 'On Leave':
        return 'bg-amber-50 text-[#F59E0B] border-amber-200 font-semibold'
      case 'Suspended':
        return 'bg-red-50 text-[#EF4444] border-red-200 font-semibold'
    }
  }

  // DELEGATE TO DOCTOR PROFILE SCREEN IF SELECTED
  if (fullProfileDoctor) {
    return (
      <DoctorProfileScreen
        doctor={fullProfileDoctor}
        onBack={() => setFullProfileDoctor(null)}
        onEdit={(updatedDoc) => {
          setDoctors(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d))
        }}
      />
    )
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

      {/* ── 1. PAGE HEADER & BREADCRUMB ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Doctor Management</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Hospital Admin</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Doctor Management</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Skeleton Loader Toggle for Testing/Validation */}
          <button
            onClick={() => {
              setIsLoading(prev => !prev)
              triggerToast(isLoading ? 'Loading completed.' : 'Simulating loading skeletons...')
            }}
            className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin text-[#0D47A1]' : ''} />
            <span>{isLoading ? 'Loading Active' : 'Simulate Loading'}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => setShowAddDrawer(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm shrink-0"
            style={{ fontFamily: PP }}
          >
            <UserPlus size={15} /> Add Doctor
          </button>
        </div>
      </div>

      {/* ── 2. SUMMARY KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm animate-pulse flex items-center justify-between">
              <div className="space-y-2 flex-1 pr-4">
                <div className="h-3 bg-slate-200 rounded w-24" />
                <div className="h-6 bg-slate-300 rounded w-12" />
                <div className="h-2.5 bg-slate-200 rounded w-32" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
            </div>
          ))
        ) : (
          <>
            {/* Card 1: Total Doctors */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
              <div>
                <div className="text-xs text-[#64748B] font-medium">Total Doctors</div>
                <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{totalDoctorsCount}</div>
                <div className="text-[11px] text-[#0D47A1] font-medium mt-1 flex items-center gap-1">
                  <span>Across {departmentsCoveredCount} clinical departments</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                <Stethoscope size={20} />
              </div>
            </div>

            {/* Card 2: Available Today */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-teal-200 transition-colors">
              <div>
                <div className="text-xs text-[#64748B] font-medium">Available Today</div>
                <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{availableTodayCount}</div>
                <div className="text-[11px] text-[#009688] font-medium mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
                  <span>In OPD & Clinical consultations</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
                <CheckCircle2 size={20} />
              </div>
            </div>

            {/* Card 3: On Leave */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-amber-200 transition-colors">
              <div>
                <div className="text-xs text-[#64748B] font-medium">On Leave</div>
                <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{onLeaveCount}</div>
                <div className="text-[11px] text-[#F59E0B] font-medium mt-1 flex items-center gap-1">
                  <span>Approved leave or scheduled away</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
                <UserX size={20} />
              </div>
            </div>

            {/* Card 4: Departments Covered */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
              <div>
                <div className="text-xs text-[#64748B] font-medium">Departments Covered</div>
                <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{departmentsCoveredCount}</div>
                <div className="text-[11px] text-[#0D47A1] font-medium mt-1 flex items-center gap-1">
                  <span>Active OPD & Specialty Units</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
                <Building2 size={20} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 3. SEARCH & FILTERS TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        {/* Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchDoctorQuery}
              onChange={e => setSearchDoctorQuery(e.target.value)}
              placeholder="Search Doctor Name or ID..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            />
            {searchDoctorQuery && (
              <button onClick={() => setSearchDoctorQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative">
            <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchEmpIdQuery}
              onChange={e => setSearchEmpIdQuery(e.target.value)}
              placeholder="Filter by Employee ID (EMP-1001)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            />
            {searchEmpIdQuery && (
              <button onClick={() => setSearchEmpIdQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative">
            <FileCheck size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchRegNoQuery}
              onChange={e => setSearchRegNoQuery(e.target.value)}
              placeholder="Filter by Reg Number (MCI-REG)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            />
            {searchRegNoQuery && (
              <button onClick={() => setSearchRegNoQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
            <Building2 size={13} className="text-slate-400" />
            <span className="text-slate-500 font-medium">Department:</span>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="ENT">ENT</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="Pulmonology">Pulmonology</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
            <Stethoscope size={13} className="text-slate-400" />
            <span className="text-slate-500 font-medium">Specialty:</span>
            <select
              value={specialtyFilter}
              onChange={e => setSpecialtyFilter(e.target.value)}
              className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
            >
              <option value="All">All Specialties</option>
              <option value="Interventional Cardiology">Interventional Cardiology</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Clinical Neurology">Clinical Neurology</option>
              <option value="Pediatric Care & Neonatology">Pediatric Care & Neonatology</option>
              <option value="Orthopedic Surgery & Joint Replacement">Orthopedic Surgery</option>
              <option value="Reproductive Health & Maternal Care">Reproductive Health</option>
              <option value="Clinical & Aesthetic Dermatology">Clinical Dermatology</option>
              <option value="Otolaryngology & Head-Neck Surgery">Otolaryngology</option>
              <option value="Cornea & Refractive Surgery">Refractive Surgery</option>
              <option value="Respiratory Medicine">Respiratory Medicine</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
            <Clock size={13} className="text-slate-400" />
            <span className="text-slate-500 font-medium">Availability:</span>
            <select
              value={availabilityFilter}
              onChange={e => setAvailabilityFilter(e.target.value)}
              className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
            >
              <option value="All">All Availability</option>
              <option value="Available Today">Available Today</option>
              <option value="On Duty">On Duty</option>
              <option value="On Call">On Call</option>
              <option value="On Leave">On Leave</option>
              <option value="Out of Office">Out of Office</option>
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
            <Award size={13} className="text-slate-400" />
            <span className="text-slate-500 font-medium">Experience:</span>
            <select
              value={experienceFilter}
              onChange={e => setExperienceFilter(e.target.value)}
              className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
            >
              <option value="All">All Experience</option>
              <option value="0-5 Years">0 - 5 Years</option>
              <option value="5-10 Years">5 - 10 Years</option>
              <option value="10-15 Years">10 - 15 Years</option>
              <option value="15+ Years">15+ Years</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-500 hover:text-[#0D47A1] hover:bg-slate-50 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* ── 4. MAIN DOCTOR TABLE ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
              <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                <th onClick={() => handleSort('id')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Doctor ID</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Doctor Name</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('department')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Department</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('specialty')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Specialty</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Qualification</th>
                <th onClick={() => handleSort('experienceYrs')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Experience</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('consultationFee')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Fee ($)</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('availability')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Availability</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('status')} className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors">
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-[#111827]">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-16" /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0" />
                        <div className="space-y-1">
                          <div className="h-3 bg-slate-200 rounded w-28" />
                          <div className="h-2 bg-slate-100 rounded w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-20" /></td>
                    <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-28" /></td>
                    <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-24" /></td>
                    <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-12" /></td>
                    <td className="px-4 py-3.5"><div className="h-3 bg-slate-200 rounded w-12" /></td>
                    <td className="px-4 py-3.5"><div className="h-5 bg-slate-200 rounded-full w-24" /></td>
                    <td className="px-4 py-3.5"><div className="h-5 bg-slate-200 rounded-full w-16" /></td>
                    <td className="px-4 py-3.5"><div className="h-6 bg-slate-200 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <Stethoscope size={28} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>No doctors found.</h3>
                        <p className="text-xs text-[#64748B]">
                          No doctor records matched your search query or selected filter options.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={handleResetFilters}
                          className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                        >
                          Reset Filters
                        </button>
                        <button
                          onClick={() => setShowAddDrawer(true)}
                          className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5 shadow-sm"
                          style={{ fontFamily: PP }}
                        >
                          <UserPlus size={14} /> Add Doctor
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDoctors.map(doc => {
                  const initials = doc.name
                    .replace('Dr. ', '')
                    .split(' ')
                    .filter(n => n.length > 0)
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)

                  const availBadge = getAvailabilityBadgeStyle(doc.availability)

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td
                        onClick={() => setFullProfileDoctor(doc)}
                        className="px-4 py-3.5 font-mono font-bold text-[#0D47A1] hover:underline"
                      >
                        {doc.id}
                      </td>

                      <td
                        onClick={() => setFullProfileDoctor(doc)}
                        className="px-4 py-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl bg-teal-100 text-[#009688] font-bold text-xs flex items-center justify-center shrink-0 border border-teal-200"
                            style={{ fontFamily: PP }}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-[#111827] block group-hover:text-[#0D47A1] transition-colors" style={{ fontFamily: PP }}>
                              {doc.name}
                            </span>
                            <span className="text-[10px] text-[#64748B] font-mono">
                              EMP: {doc.empId} &bull; Reg: {doc.regNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-[#111827]">
                        {doc.department}
                      </td>

                      <td className="px-4 py-3.5 text-slate-700">
                        {doc.specialty}
                      </td>

                      <td className="px-4 py-3.5 text-[#64748B] max-w-[150px] truncate" title={doc.qualification}>
                        {doc.qualification}
                      </td>

                      <td className="px-4 py-3.5 font-medium text-[#111827]">
                        {doc.experienceYrs} Yrs
                      </td>

                      <td className="px-4 py-3.5 font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>
                        ${doc.consultationFee}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border inline-flex items-center gap-1.5 ${availBadge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${availBadge.dot}`} />
                          {doc.availability}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] border inline-block ${getStatusBadgeStyle(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setQuickDetailsDoctor(doc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                            title="View Quick Details Drawer"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => handleOpenEditDrawer(doc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                            title="Edit Doctor Profile"
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            onClick={() => setScheduleDoctor(doc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="View Schedule & Practice Hours"
                          >
                            <Calendar size={15} />
                          </button>

                          <button
                            onClick={() => setDeactivateDialogDoctor(doc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Deactivate Doctor"
                          >
                            <AlertTriangle size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredDoctors.length > 0 && (
          <div className="px-4 py-3 bg-slate-50 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
            <div>
              Showing <span className="font-bold text-[#111827]">{filteredDoctors.length}</span> of <span className="font-bold text-[#111827]">{doctors.length}</span> registered doctors
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#009688]" /> Available Today: {availableTodayCount}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> On Leave: {onLeaveCount}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. RIGHT DRAWER: QUICK DOCTOR DETAILS ── */}
      {quickDetailsDoctor && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Stethoscope size={18} className="text-[#0D47A1]" />
                  <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Quick Doctor Details</h2>
                </div>
                <button
                  onClick={() => setQuickDetailsDoctor(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB]">
                  <div
                    className="w-16 h-16 rounded-2xl bg-[#0D47A1] text-white font-bold text-xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    {quickDetailsDoctor.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="text-base font-bold text-[#111827] truncate" style={{ fontFamily: PP }}>
                      {quickDetailsDoctor.name}
                    </h3>
                    <p className="text-xs text-[#0D47A1] font-bold">{quickDetailsDoctor.specialty}</p>
                    <p className="text-[11px] text-[#64748B]">{quickDetailsDoctor.department}</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Doctor ID</span>
                    <span className="font-mono font-bold text-[#0D47A1]">{quickDetailsDoctor.id}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Employee ID</span>
                    <span className="font-mono font-semibold text-[#111827]">{quickDetailsDoctor.empId}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Registration Number</span>
                    <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {quickDetailsDoctor.regNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Department</span>
                    <span className="font-bold text-[#111827]">{quickDetailsDoctor.department}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Specialty</span>
                    <span className="font-semibold text-[#0D47A1]">{quickDetailsDoctor.specialty}</span>
                  </div>

                  <div className="py-1.5 border-b border-gray-100 space-y-1">
                    <span className="text-[#64748B] block">Qualification</span>
                    <span className="font-medium text-[#111827] block">{quickDetailsDoctor.qualification}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Experience</span>
                    <span className="font-bold text-[#111827]">{quickDetailsDoctor.experienceYrs} Years</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Consultation Fee</span>
                    <span className="font-bold text-[#0D47A1] text-sm" style={{ fontFamily: PP }}>
                      ${quickDetailsDoctor.consultationFee}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Today's Availability</span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] border font-medium ${getAvailabilityBadgeStyle(quickDetailsDoctor.availability).bg}`}>
                      {quickDetailsDoctor.availability}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">OPD Cabinet Room</span>
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {quickDetailsDoctor.opdRoom}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                    <span className="text-[#64748B]">Shift Timings</span>
                    <span className="font-medium text-[#111827]">{quickDetailsDoctor.shiftTimings}</span>
                  </div>
                </div>

                {quickDetailsDoctor.bio && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[11px] text-[#64748B] font-bold block mb-1">Clinical Overview</span>
                    <p className="text-slate-600 leading-relaxed">{quickDetailsDoctor.bio}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setQuickDetailsDoctor(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetDoc = quickDetailsDoctor
                  setQuickDetailsDoctor(null)
                  setFullProfileDoctor(targetDoc)
                }}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Eye size={14} /> View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. REUSABLE RIGHT DRAWER: ADD NEW DOCTOR ── */}
      <AddDoctorDrawer
        isOpen={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        onSubmit={handleAddDoctorSubmit}
        totalDoctorCount={doctors.length}
      />

      {/* ── 7. REUSABLE RIGHT DRAWER: EDIT DOCTOR ── */}
      <EditDoctorDrawer
        isOpen={Boolean(editingDoctor)}
        doctor={editingDoctor}
        onClose={() => setEditingDoctor(null)}
        onSave={handleSaveEditDoctor}
        onDeactivateClick={(docToDeactivate) => {
          setDeactivateDialogDoctor(docToDeactivate)
        }}
        onTriggerToast={triggerToast}
      />

      {/* ── 8. VIEW SCHEDULE MODAL ── */}
      {scheduleDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold text-sm flex items-center justify-center border border-purple-100">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>OPD Schedule & Working Hours</h3>
                  <p className="text-xs text-[#64748B]">{scheduleDoctor.name} &bull; {scheduleDoctor.opdRoom}</p>
                </div>
              </div>
              <button
                onClick={() => setScheduleDoctor(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-purple-700 font-bold text-xs block">Regular OPD Shift</span>
                  <span className="text-slate-600 text-xs">{scheduleDoctor.shiftTimings}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#64748B] text-[11px] block">Assigned Room</span>
                  <span className="font-bold text-[#111827]">{scheduleDoctor.opdRoom}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#111827] block text-xs" style={{ fontFamily: PP }}>Weekly OPD Availability Slots</span>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const isWorking = scheduleDoctor.workingDays.includes(day)
                    return (
                      <div
                        key={day}
                        className={`p-3 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 ${isWorking
                          ? 'bg-blue-50 border-blue-200 text-[#0D47A1]'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                      >
                        <span className="font-bold text-[11px] uppercase" style={{ fontFamily: PP }}>{day}</span>
                        {isWorking ? (
                          <span className="text-[10px] bg-[#0D47A1] text-white px-1.5 py-0.5 rounded font-semibold">ON</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">OFF</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-[#111827] block text-[11px]">Appointment Slot Policy</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Doctor accepts up to 20 walk-in and pre-booked OPD consultations per shift slot. Consultation duration is estimated at 15 minutes per patient.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setScheduleDoctor(null)}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                style={{ fontFamily: PP }}
              >
                Close Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. REUSABLE DEACTIVATE DOCTOR CONFIRMATION DIALOG ── */}
      <DeactivateDoctorDialog
        isOpen={Boolean(deactivateDialogDoctor)}
        doctor={deactivateDialogDoctor}
        onClose={() => setDeactivateDialogDoctor(null)}
        onConfirm={handleConfirmDeactivate}
      />

    </div>
  )
}
