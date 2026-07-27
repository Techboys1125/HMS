import { useState, useMemo } from 'react'
import {
  Shield, Lock, CheckCircle2, Download, Edit3, Camera, FileText, ChevronRight,
  Eye, EyeOff, X, Award, Laptop, Smartphone
} from 'lucide-react'

// --- Typography Tokens ---
const PP = 'Poppins, sans-serif'
const RB = 'Roboto, sans-serif'

// --- Types ---
export type UserRole = 'Hospital Admin' | 'Doctor' | 'Receptionist' | 'Accountant' | 'Nurse' | 'Patient Portal User'

interface MyProfileManagementProps {
  currentRole?: UserRole
  onLogout?: () => void
  onNavigateToModule?: (module: string) => void
}

// Role-based profiles dataset
const MOCK_PROFILES: Record<UserRole, {
  fullName: string
  employeeId: string
  department: string
  designation: string
  email: string
  phone: string
  joinedDate: string
  lastLogin: string
  avatar: string
  gender: string
  dob: string
  bloodGroup: string
  address: string
  city: string
  state: string
  country: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
  professionalInfo: Record<string, string>
  documents: { name: string; status: 'Verified' | 'Pending'; id: string }[]
  recentActivities: { title: string; date: string; desc: string }[]
}> = {
  'Hospital Admin': {
    fullName: 'Dr. Vikramaditya Roy',
    employeeId: 'ADM-2024-001',
    department: 'Hospital Administration',
    designation: 'Chief Medical Administrator',
    email: 'vikram.roy@safehands.org',
    phone: '+91 98765 43210',
    joinedDate: '15 Jan 2020',
    lastLogin: 'Today, 09:42 AM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    gender: 'Male',
    dob: '12 Aug 1980',
    bloodGroup: 'O+',
    address: '45 Hospital Avenue, Suite 400',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    emergencyName: 'Sunita Roy',
    emergencyPhone: '+91 98765 00112',
    emergencyRelation: 'Spouse',
    professionalInfo: {
      'Employee ID': 'ADM-2024-001',
      'Department': 'Hospital Administration',
      'Designation': 'Chief Administrator',
      'Reporting Manager': 'Governing Board',
      'Office Location': 'Admin Block, 4th Floor',
      'Employment Type': 'Full-Time Permanent',
      'Joining Date': '15 Jan 2020'
    },
    documents: [
      { id: 'DOC-01', name: 'Hospital Admin ID Card', status: 'Verified' },
      { id: 'DOC-02', name: 'Executive Appointment Letter', status: 'Verified' },
      { id: 'DOC-03', name: 'Organization Access Authorization', status: 'Verified' }
    ],
    recentActivities: [
      { title: 'Logged In', date: 'Today, 09:42 AM', desc: 'Secure credential authentication from IP 192.168.1.4' },
      { title: 'Updated Security Policy', date: 'Yesterday, 04:15 PM', desc: 'Modified role permissions for Receptionist group' },
      { title: 'Reviewed Monthly Audits', date: '24 Jul 2026', desc: 'Approved financial audit report for Q2' }
    ]
  },
  'Doctor': {
    fullName: 'Dr. Arjun Mehta',
    employeeId: 'DOC-2024-101',
    department: 'Cardiology OPD',
    designation: 'Senior Interventional Cardiologist',
    email: 'arjun.mehta@safehands.org',
    phone: '+91 98200 11223',
    joinedDate: '10 Mar 2021',
    lastLogin: 'Today, 08:30 AM',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    gender: 'Male',
    dob: '04 May 1982',
    bloodGroup: 'A+',
    address: '12 Doctor Quarters, Medical Enclave',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    emergencyName: 'Ananya Mehta',
    emergencyPhone: '+91 98200 99887',
    emergencyRelation: 'Spouse',
    professionalInfo: {
      'Doctor ID': 'DOC-2024-101',
      'Department': 'Cardiology OPD',
      'Specialization': 'Interventional Cardiology',
      'Medical License Number': 'MCI-88942-A',
      'Experience': '14 Years',
      'Consultation Type': 'OPD & Emergency Call',
      'Joining Date': '10 Mar 2021'
    },
    documents: [
      { id: 'DOC-01', name: 'State Medical Council License', status: 'Verified' },
      { id: 'DOC-02', name: 'Cardiology Specialist Certificate', status: 'Verified' },
      { id: 'DOC-03', name: 'Hospital Consultant ID', status: 'Verified' }
    ],
    recentActivities: [
      { title: 'Prescription Submitted', date: 'Today, 11:20 AM', desc: 'Finalized Rx-8092 for Patient Sarah Mitchell' },
      { title: 'OPD Consultation Started', date: 'Today, 09:00 AM', desc: 'Checked in 12 OPD patients' },
      { title: 'Updated Schedule', date: '25 Jul 2026', desc: 'Adjusted evening OPD timings for next week' }
    ]
  },
  'Receptionist': {
    fullName: 'Priya Sharma',
    employeeId: 'REC-2024-042',
    department: 'Front Desk Operations',
    designation: 'Senior Reception Executive',
    email: 'priya.sharma@safehands.org',
    phone: '+91 97110 55443',
    joinedDate: '01 Jun 2022',
    lastLogin: 'Today, 07:45 AM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    gender: 'Female',
    dob: '18 Nov 1994',
    bloodGroup: 'B+',
    address: '88 Green Park Enclave',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    emergencyName: 'Rajesh Sharma',
    emergencyPhone: '+91 97110 00011',
    emergencyRelation: 'Father',
    professionalInfo: {
      'Employee ID': 'REC-2024-042',
      'Reception Desk': 'Main Lobby Counter 2',
      'Shift': 'Morning (07:00 AM – 03:00 PM)',
      'Reporting Manager': 'Front Desk Manager',
      'Front Desk Counter': 'Desk #02 (OPD Registration)',
      'Employment Type': 'Full-Time',
      'Joining Date': '01 Jun 2022'
    },
    documents: [
      { id: 'DOC-01', name: 'Reception Staff ID', status: 'Verified' },
      { id: 'DOC-02', name: 'Employment Offer Letter', status: 'Verified' }
    ],
    recentActivities: [
      { title: 'Patient Registered', date: 'Today, 10:15 AM', desc: 'Registered new patient Emma Reyes (P-90823)' },
      { title: 'Token Generated', date: 'Today, 08:30 AM', desc: 'Issued OPD Token #14 for Cardiology queue' },
      { title: 'Logged In', date: 'Today, 07:45 AM', desc: 'Desk #02 terminal session initialized' }
    ]
  },
  'Accountant': {
    fullName: 'Ramesh Patel',
    employeeId: 'ACC-2024-018',
    department: 'Finance & Billing',
    designation: 'Lead Billing Accountant',
    email: 'ramesh.patel@safehands.org',
    phone: '+91 98980 77665',
    joinedDate: '12 Sep 2021',
    lastLogin: 'Today, 09:10 AM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    gender: 'Male',
    dob: '22 Feb 1987',
    bloodGroup: 'AB+',
    address: '104 Commerce Tower, Central Market',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    emergencyName: 'Kavita Patel',
    emergencyPhone: '+91 98980 11223',
    emergencyRelation: 'Spouse',
    professionalInfo: {
      'Employee ID': 'ACC-2024-018',
      'Finance Department': 'Billing & Financial Reconciliation',
      'Shift': 'General (09:00 AM – 06:00 PM)',
      'Reporting Manager': 'Finance Director',
      'Accounting Access Level': 'Level 3 Senior Accountant',
      'Employment Type': 'Full-Time',
      'Joining Date': '12 Sep 2021'
    },
    documents: [
      { id: 'DOC-01', name: 'Finance Staff ID Card', status: 'Verified' },
      { id: 'DOC-02', name: 'Financial System Authorization', status: 'Verified' }
    ],
    recentActivities: [
      { title: 'Invoice Generated', date: 'Today, 11:00 AM', desc: 'Compiled OPD billing INV-1095' },
      { title: 'Payment Collected', date: 'Today, 10:20 AM', desc: 'Reconciled ₹1,645 UPI payment' },
      { title: 'Daily Revenue Compiled', date: 'Yesterday, 06:00 PM', desc: 'Finalized daily collection audit' }
    ]
  },
  'Nurse': {
    fullName: 'Sister Mary Joseph',
    employeeId: 'NRS-2024-055',
    department: 'OPD Nursing Care',
    designation: 'Senior Ward Nurse Specialist',
    email: 'mary.joseph@safehands.org',
    phone: '+91 98112 33445',
    joinedDate: '18 Nov 2021',
    lastLogin: 'Today, 07:15 AM',
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=150&auto=format&fit=crop&q=80',
    gender: 'Female',
    dob: '30 Oct 1989',
    bloodGroup: 'O-',
    address: '56 Nurses Hostel Enclave',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    emergencyName: 'Joseph Thomas',
    emergencyPhone: '+91 98112 99887',
    emergencyRelation: 'Brother',
    professionalInfo: {
      'Nurse ID': 'NRS-2024-055',
      'Assigned Ward': 'Cardiology OPD Triage Station',
      'Department': 'Nursing Care',
      'Shift': 'Day Shift (07:00 AM – 03:00 PM)',
      'Supervisor': 'Head Nursing Superintendent',
      'Employment Type': 'Full-Time',
      'Joining Date': '18 Nov 2021'
    },
    documents: [
      { id: 'DOC-01', name: 'State Nursing Council License', status: 'Verified' },
      { id: 'DOC-02', name: 'Nursing Officer ID', status: 'Verified' }
    ],
    recentActivities: [
      { title: 'Vitals Recorded', date: 'Today, 10:30 AM', desc: 'Logged BP & Pulse for Patient Robert Chen' },
      { title: 'Clinical Alert Managed', date: 'Today, 09:15 AM', desc: 'Flushed IV line and alerted attending doctor' },
      { title: 'Logged In', date: 'Today, 07:15 AM', desc: 'Triage station terminal logged in' }
    ]
  },
  'Patient Portal User': {
    fullName: 'Rahul Kumar',
    employeeId: 'PAT-892101',
    department: 'Patient Health Portal',
    designation: 'Registered Patient',
    email: 'rahul.kumar@example.com',
    phone: '+91 98765 43210',
    joinedDate: '12 Jan 2024',
    lastLogin: 'Today, 10:15 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gender: 'Male',
    dob: '15 Aug 1988',
    bloodGroup: 'B+',
    address: 'Flat 402, Sunshine Heights, M.G. Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    emergencyName: 'Sunita Kumar',
    emergencyPhone: '+91 98765 43211',
    emergencyRelation: 'Mother',
    professionalInfo: {
      'Patient UHID': 'UHID-892101',
      'Portal Access': 'Primary Family Account',
      'Linked Family Profiles': '4 Linked Profiles',
      'Primary Care Physician': 'Dr. Arjun Mehta',
      'Insurance Provider': 'Star Health Care (Pol #88902)',
      'Account Type': 'Verified Self Portal',
      'Registration Date': '12 Jan 2024'
    },
    documents: [
      { id: 'DOC-01', name: 'Patient Aadhar Card copy', status: 'Verified' },
      { id: 'DOC-02', name: 'Health Insurance Policy Card', status: 'Verified' }
    ],
    recentActivities: [
      { title: 'Appointment Booked', date: 'Today, 10:30 AM', desc: 'Booked Cardiology follow-up with Dr. Arjun Mehta' },
      { title: 'Prescription Viewed', date: 'Yesterday, 04:20 PM', desc: 'Downloaded e-prescription Rx-8092' },
      { title: 'Profile Switched', date: '25 Jul 2026', desc: 'Switched viewing profile to Sunita Kumar (Mother)' }
    ]
  }
}

export function MyProfileManagement({
  currentRole = 'Hospital Admin',
  onLogout: _onLogout,
  onNavigateToModule: _onNavigateToModule
}: MyProfileManagementProps) {
  void _onLogout; void _onNavigateToModule;
  // Load initial profile data based on role
  const profileData = useMemo(() => MOCK_PROFILES[currentRole] || MOCK_PROFILES['Hospital Admin'], [currentRole])

  // Form State
  const [formData, setFormData] = useState({
    firstName: profileData.fullName.split(' ')[0],
    lastName: profileData.fullName.split(' ').slice(1).join(' '),
    email: profileData.email,
    phone: profileData.phone,
    gender: profileData.gender,
    dob: profileData.dob,
    bloodGroup: profileData.bloodGroup,
    address: profileData.address,
    city: profileData.city,
    state: profileData.state,
    country: profileData.country,
    emergencyName: profileData.emergencyName,
    emergencyPhone: profileData.emergencyPhone,
    emergencyRelation: profileData.emergencyRelation
  })

  // Profile Settings States
  const [accPrefs, setAccPrefs] = useState({
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12 Hour',
    timezone: 'GMT +05:30 (India Standard Time)'
  })

  // Role-specific Notification Preferences
  const [roleNotifPrefs, setRoleNotifPrefs] = useState({
    email: true,
    appointment: true,
    billing: true,
    system: true,
    consultation: true,
    prescription: true,
    staff: true,
    reports: true,
    registration: true,
    queue: true,
  })

  // Privacy & Security Settings
  const [secSettings, setSecSettings] = useState({
    twoFactor: false,
  })

  // Accessibility Settings
  const [accessSettings, setAccessSettings] = useState({
    theme: 'Light',
    fontSize: 'Medium',
    compactMode: false,
  })

  // Session Preferences
  const [sessionPrefs, setSessionPrefs] = useState({
    autoLogout: '30 Minutes',
    keepLoggedIn: true,
  })

  // Connected Devices
  const [devices, setDevices] = useState([
    { id: 'DEV-1', device: 'Windows PC (Workstation)', browser: 'Chrome 126.0', os: 'Windows 11 Pro', lastActive: 'Active Now', current: true },
    { id: 'DEV-2', device: 'iPhone 15 Pro (Mobile App)', browser: 'Safari Mobile', os: 'iOS 17.5', lastActive: '2 hours ago', current: false },
    { id: 'DEV-[#3]', device: 'iPad Air (Clinical Tablet)', browser: 'Mobile Chrome', os: 'iPadOS 17.4', lastActive: 'Yesterday, 04:30 PM', current: false },
  ])

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Modals & Edit Mode
  const [isEditing, setIsEditing] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' })
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false)

  const handleSaveProfile = () => {
    setIsEditing(false)
    showToast('Profile information updated successfully!')
  }

  const handleSaveProfileSettings = () => {
    showToast('Profile Settings Updated Successfully')
  }

  const handleResetPreferences = () => {
    setAccPrefs({
      language: 'English',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12 Hour',
      timezone: 'GMT +05:30 (India Standard Time)'
    })
    setRoleNotifPrefs({
      email: true,
      appointment: true,
      billing: true,
      system: true,
      consultation: true,
      prescription: true,
      staff: true,
      reports: true,
      registration: true,
      queue: true,
    })
    setSecSettings({ twoFactor: false })
    setAccessSettings({ theme: 'Light', fontSize: 'Medium', compactMode: false })
    setSessionPrefs({ autoLogout: '30 Minutes', keepLoggedIn: true })
    showToast('Preferences Reset to Default Values')
  }

  const handleSignOutDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id))
    showToast('Device signed out successfully')
  }

  const handleLogoutOtherDevices = () => {
    setDevices(prev => prev.filter(d => d.current))
    showToast('Logged out from all other active devices')
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passForm.newPass !== passForm.confirm) {
      showToast('Error: New passwords do not match!')
      return
    }
    setPasswordModalOpen(false)
    setPassForm({ current: '', newPass: '', confirm: '' })
    showToast('Password updated successfully!')
  }

  // Dynamic Role-based Activity Summary KPIs
  const activityKpis = useMemo(() => {
    switch (currentRole) {
      case 'Doctor':
        return [
          { label: 'Patients Today', value: '14', trend: '+2 vs yesterday', color: 'text-[#0D47A1]' },
          { label: 'Consultations', value: '142', trend: 'This Month', color: 'text-[#009688]' },
          { label: 'Prescriptions', value: '138', trend: 'Submitted', color: 'text-purple-600' },
          { label: 'Follow-ups', value: '18', trend: 'Pending', color: 'text-amber-600' }
        ]
      case 'Receptionist':
        return [
          { label: 'Registrations', value: '28', trend: 'Today', color: 'text-[#0D47A1]' },
          { label: 'Appointments', value: '54', trend: 'Booked Today', color: 'text-[#009688]' },
          { label: 'Queue Tokens', value: '48', trend: 'Issued', color: 'text-purple-600' },
          { label: 'Patients Checked In', value: '42', trend: 'At Front Desk', color: 'text-emerald-600' }
        ]
      case 'Accountant':
        return [
          { label: 'Invoices', value: '64', trend: 'Generated Today', color: 'text-[#0D47A1]' },
          { label: 'Payments', value: '₹1.42L', trend: 'Collected Today', color: 'text-[#009688]' },
          { label: 'Revenue', value: '₹42.8L', trend: 'This Month', color: 'text-purple-600' },
          { label: 'Refund Requests', value: '2', trend: 'Pending Approval', color: 'text-amber-600' }
        ]
      case 'Nurse':
        return [
          { label: 'Assigned Patients', value: '12', trend: 'Ward Station 2', color: 'text-[#0D47A1]' },
          { label: 'Vitals Recorded', value: '34', trend: 'Today', color: 'text-[#009688]' },
          { label: 'Clinical Alerts', value: '3', trend: 'Actioned', color: 'text-red-600' },
          { label: 'Medication Tasks', value: '16', trend: 'Completed', color: 'text-purple-600' }
        ]
      case 'Patient Portal User':
        return [
          { label: 'Upcoming Appointments', value: '2', trend: 'Next: 28 Jul', color: 'text-[#0D47A1]' },
          { label: 'Active Prescriptions', value: '4', trend: 'Refills Available', color: 'text-[#009688]' },
          { label: 'Linked Profiles', value: '4', trend: 'Family Account', color: 'text-purple-600' },
          { label: 'Pending Bills', value: '₹450', trend: 'Due in 5 days', color: 'text-amber-600' }
        ]
      case 'Hospital Admin':
      default:
        return [
          { label: 'Users Managed', value: '184', trend: 'Active Accounts', color: 'text-[#0D47A1]' },
          { label: 'Reports Generated', value: '42', trend: 'This Month', color: 'text-[#009688]' },
          { label: 'Audits Reviewed', value: '128', trend: 'Logs Cleared', color: 'text-purple-600' },
          { label: 'System Logins', value: '1.2k', trend: 'This Week', color: 'text-emerald-600' }
        ]
    }
  }, [currentRole])

  return (
    <div style={{ fontFamily: RB }} className="w-full flex-1 bg-[#F1F5F9] p-6 text-[#111827] pb-36">
      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span>Hospital</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium text-[#0D47A1]">My Profile</span>
          </div>
          {/* Page Title */}
          <h1 style={{ fontFamily: PP }} className="text-2xl font-bold tracking-tight text-[#111827]">
            My Profile
          </h1>
          <p className="text-sm text-[#64748B]">
            Manage your personal information, professional details, account preferences, security settings, and activity.
          </p>
        </div>

        {/* Top Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold shadow-sm transition ${
              isEditing ? 'border-[#0D47A1] bg-blue-50 text-[#0D47A1]' : 'border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Editing Profile...' : 'Edit Profile'}
          </button>

          <button
            onClick={() => setPasswordModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#111827] shadow-sm hover:bg-slate-50 transition"
          >
            <Lock className="w-4 h-4 text-[#0D47A1]" />
            Change Password
          </button>

          <button
            onClick={() => alert('Downloading User Profile Document...')}
            className="flex items-center gap-1.5 rounded-lg bg-[#0D47A1] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0b3882] transition"
          >
            <Download className="w-4 h-4" />
            Download Profile
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="w-full space-y-6">
        {/* MAIN CONTENT */}
        <div className="w-full space-y-6">
          {/* SECTION 01: PROFILE HEADER CARD */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Photo */}
              <div className="relative group">
                <img
                  src={profileData.avatar}
                  alt={profileData.fullName}
                  className="h-24 w-24 rounded-2xl object-cover border-2 border-[#0D47A1]/20 shadow-md"
                />
                <button
                  onClick={() => alert('Upload new profile photo...')}
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[#0D47A1] text-white shadow-md hover:bg-[#0b3882] transition"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Identity Info */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 style={{ fontFamily: PP }} className="text-xl font-bold text-[#111827]">
                    {profileData.fullName}
                  </h2>
                  <span className="rounded-full bg-[#0D47A1]/10 px-2.5 py-0.5 text-xs font-bold text-[#0D47A1]">
                    {currentRole}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    Active Account
                  </span>
                </div>

                <p className="text-xs font-medium text-[#64748B]">
                  {profileData.designation} • <span className="text-[#009688]">{profileData.department}</span>
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#64748B] pt-1">
                  <span>ID: <strong className="text-[#111827]">{profileData.employeeId}</strong></span>
                  <span>Joined: <strong className="text-[#111827]">{profileData.joinedDate}</strong></span>
                  <span>Last Login: <strong className="text-[#111827]">{profileData.lastLogin}</strong></span>
                </div>

                {/* Quick Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#0D47A1]">
                    <Shield className="w-3.5 h-3.5" /> Verified Employee
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-[#009688]">
                    <Award className="w-3.5 h-3.5" /> Authorized Clinical User
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 02: PERSONAL INFORMATION */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 style={{ fontFamily: PP }} className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                Personal Information
              </h3>
              <span className="text-xs text-[#64748B]">
                {isEditing ? 'Editing Mode Active' : 'Read-Only Mode'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div>
                <label className="block text-[#64748B] font-medium mb-1">First Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Gender</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Date of Birth</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Blood Group</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#64748B] font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">City</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[#64748B] font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] disabled:bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                />
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            <h4 style={{ fontFamily: PP }} className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Contact Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.emergencyName}
                  onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Emergency Phone</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.emergencyPhone}
                  onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Relationship</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.emergencyRelation}
                  onChange={e => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 03: PROFESSIONAL INFORMATION (ROLE DYNAMIC) */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 style={{ fontFamily: PP }} className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                Professional Information ({currentRole})
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#64748B]">
                System Assigned
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              {Object.entries(profileData.professionalInfo).map(([key, val]) => (
                <div key={key} className="rounded-xl border border-[#E5E7EB] bg-slate-50/60 p-3">
                  <span className="block text-[11px] text-[#64748B] font-medium mb-0.5">{key}</span>
                  <span className="font-bold text-[#111827]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* NEW SECTION: PROFILE SETTINGS                                 */}
          {/* ============================================================ */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div>
                <h3 style={{ fontFamily: PP }} className="text-base font-bold text-[#111827]">
                  Profile Settings
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                  Configure your account preferences, notifications, security, accessibility, and active sessions.
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-[#0D47A1] rounded-full text-xs font-semibold" style={{ fontFamily: PP }}>
                {currentRole}
              </span>
            </div>

            {/* 1. ACCOUNT PREFERENCES */}
            <div className="space-y-4">
              <h4 style={{ fontFamily: PP }} className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
                Account Preferences
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                {/* Preferred Language */}
                <div>
                  <label className="block text-[#64748B] font-medium mb-1">Preferred Language</label>
                  <select
                    value={accPrefs.language}
                    onChange={e => setAccPrefs({ ...accPrefs, language: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                    style={{ fontFamily: RB }}
                  >
                    <option value="English">English (Default)</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-[#64748B] font-medium mb-1">Date Format</label>
                  <select
                    value={accPrefs.dateFormat}
                    onChange={e => setAccPrefs({ ...accPrefs, dateFormat: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                    style={{ fontFamily: RB }}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Default)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Time Format */}
                <div>
                  <label className="block text-[#64748B] font-medium mb-1">Time Format</label>
                  <select
                    value={accPrefs.timeFormat}
                    onChange={e => setAccPrefs({ ...accPrefs, timeFormat: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                    style={{ fontFamily: RB }}
                  >
                    <option value="12 Hour">12 Hour (AM/PM)</option>
                    <option value="24 Hour">24 Hour (Military)</option>
                  </select>
                </div>

                {/* Timezone (Read Only) */}
                <div>
                  <label className="block text-[#64748B] font-medium mb-1">Timezone (Hospital Default)</label>
                  <input
                    type="text"
                    readOnly
                    value={accPrefs.timezone}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-slate-100 px-3 py-2 text-[#64748B] font-medium cursor-not-allowed"
                    style={{ fontFamily: RB }}
                  />
                </div>
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* 2. NOTIFICATION PREFERENCES (ROLE RELEVANT TOGGLES) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 style={{ fontFamily: PP }} className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
                  Notification Preferences ({currentRole})
                </h4>
                <span className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>
                  Displaying notifications relevant to your role
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                {/* Global Email */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                  <div>
                    <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Email Notifications</div>
                    <div className="text-[10px] text-[#64748B]">Primary email alerts</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roleNotifPrefs.email}
                      onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, email: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                  </label>
                </div>

                {/* Doctor Specific Toggles */}
                {currentRole === 'Doctor' && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Appointment Notifications</div>
                        <div className="text-[10px] text-[#64748B]">OPD bookings & cancels</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.appointment}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, appointment: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Consultation Alerts</div>
                        <div className="text-[10px] text-[#64748B]">Queue & vital updates</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.consultation}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, consultation: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Prescription Alerts</div>
                        <div className="text-[10px] text-[#64748B]">Refill & order updates</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.prescription}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, prescription: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>
                  </>
                )}

                {/* Hospital Admin Toggles */}
                {currentRole === 'Hospital Admin' && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>System Notifications</div>
                        <div className="text-[10px] text-[#64748B]">Security & backup alerts</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.system}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, system: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Staff Notifications</div>
                        <div className="text-[10px] text-[#64748B]">User onboard & role updates</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.staff}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, staff: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Reports Notifications</div>
                        <div className="text-[10px] text-[#64748B]">Daily audit summaries</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.reports}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, reports: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>
                  </>
                )}

                {/* Receptionist Toggles */}
                {currentRole === 'Receptionist' && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Appointments</div>
                        <div className="text-[10px] text-[#64748B]">New slot bookings</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.appointment}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, appointment: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Registration</div>
                        <div className="text-[10px] text-[#64748B]">New patient intakes</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.registration}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, registration: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Queue Alerts</div>
                        <div className="text-[10px] text-[#64748B]">Token call numbers</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.queue}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, queue: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>
                  </>
                )}

                {/* Accountant Toggles */}
                {currentRole === 'Accountant' && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Billing Notifications</div>
                        <div className="text-[10px] text-[#64748B]">Invoice & payment alerts</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.billing}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, billing: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Reports Notifications</div>
                        <div className="text-[10px] text-[#64748B]">Daily revenue totals</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.reports}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, reports: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>
                  </>
                )}

                {/* Nurse Toggles */}
                {currentRole === 'Nurse' && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Vitals & Clinical Alerts</div>
                        <div className="text-[10px] text-[#64748B]">Abnormal patient vitals</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.consultation}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, consultation: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Queue & Ward Call</div>
                        <div className="text-[10px] text-[#64748B]">Doctor call-ins</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.queue}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, queue: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>
                  </>
                )}

                {/* Patient Portal User Toggles */}
                {currentRole === 'Patient Portal User' && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Appointments</div>
                        <div className="text-[10px] text-[#64748B]">Reminders & status</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.appointment}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, appointment: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Bills & Payments</div>
                        <div className="text-[10px] text-[#64748B]">Receipts & invoices</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.billing}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, billing: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                      <div>
                        <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Prescriptions</div>
                        <div className="text-[10px] text-[#64748B]">e-Rx readiness alerts</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleNotifPrefs.prescription}
                          onChange={e => setRoleNotifPrefs({ ...roleNotifPrefs, prescription: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* 3. PRIVACY & SECURITY */}
            <div className="space-y-4">
              <h4 style={{ fontFamily: PP }} className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
                Privacy & Security
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                {/* Change Password */}
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 space-y-2">
                  <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Change Password</div>
                  <div className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Last updated 12 days ago</div>
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="w-full py-2 bg-[#0D47A1] text-white rounded-lg font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    Change Password
                  </button>
                </div>

                {/* Two Factor Authentication */}
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Two-Factor Auth</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${secSettings.twoFactor ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {secSettings.twoFactor ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>SMS / Authenticator 2FA</div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-[#64748B]">Toggle Status</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={secSettings.twoFactor}
                        onChange={e => setSecSettings({ ...secSettings, twoFactor: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                    </label>
                  </div>
                </div>

                {/* Recent Login Activity */}
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 space-y-2">
                  <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Recent Login Activity</div>
                  <div className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Inspect IP & device audit logs</div>
                  <button
                    onClick={() => setShowLoginHistoryModal(true)}
                    className="w-full py-2 bg-white border border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-slate-100 transition-all"
                    style={{ fontFamily: PP }}
                  >
                    View Log History
                  </button>
                </div>

                {/* Logout From Other Devices */}
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 space-y-2">
                  <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Logout Other Devices</div>
                  <div className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Sign out from 2 active sessions</div>
                  <button
                    onClick={handleLogoutOtherDevices}
                    className="w-full py-2 bg-slate-100 border border-[#E5E7EB] text-[#111827] rounded-lg font-semibold hover:bg-slate-200 transition-all"
                    style={{ fontFamily: PP }}
                  >
                    Logout Other Devices
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* 4. ACCESSIBILITY */}
            <div className="space-y-4">
              <h4 style={{ fontFamily: PP }} className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
                Accessibility
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                {/* Theme */}
                <div>
                  <label className="block text-[#64748B] font-medium mb-1">Theme Mode</label>
                  <select
                    value={accessSettings.theme}
                    onChange={e => setAccessSettings({ ...accessSettings, theme: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                    style={{ fontFamily: RB }}
                  >
                    <option value="Light">Light Mode (Default)</option>
                    <option value="Dark">Dark Mode</option>
                    <option value="System Default">System Default</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-[#64748B] font-medium mb-1">Font Size</label>
                  <select
                    value={accessSettings.fontSize}
                    onChange={e => setAccessSettings({ ...accessSettings, fontSize: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                    style={{ fontFamily: RB }}
                  >
                    <option value="Small">Small (Compact UI)</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="Large">Large (High Contrast)</option>
                  </select>
                </div>

                {/* Compact Mode Toggle */}
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Compact Table Mode</div>
                    <div className="text-[10px] text-[#64748B]">High-density row padding</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessSettings.compactMode}
                      onChange={e => setAccessSettings({ ...accessSettings, compactMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* 5. SESSION PREFERENCES */}
            <div className="space-y-4">
              <h4 style={{ fontFamily: PP }} className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
                Session Preferences
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                {/* Auto Logout */}
                <div>
                  <label className="block text-[#64748B] font-medium mb-1">Inactivity Auto Logout</label>
                  <select
                    value={sessionPrefs.autoLogout}
                    onChange={e => setSessionPrefs({ ...sessionPrefs, autoLogout: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-3 py-2 text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none font-medium"
                    style={{ fontFamily: RB }}
                  >
                    <option value="15 Minutes">15 Minutes Inactivity</option>
                    <option value="30 Minutes">30 Minutes Inactivity</option>
                    <option value="1 Hour">1 Hour Inactivity</option>
                  </select>
                </div>

                {/* Keep Me Logged In Toggle */}
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Keep Me Logged In</div>
                    <div className="text-[10px] text-[#64748B]">Persist auth session on this device</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sessionPrefs.keepLoggedIn}
                      onChange={e => setSessionPrefs({ ...sessionPrefs, keepLoggedIn: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]" />
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* 6. CONNECTED DEVICES TABLE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 style={{ fontFamily: PP }} className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
                  Connected Devices
                </h4>
                <span className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>
                  Currently active hardware sessions
                </span>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] overflow-hidden bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E5E7EB] font-bold text-[#64748B] uppercase tracking-wider text-[10px]" style={{ fontFamily: PP }}>
                      <th className="py-3 px-4">Device</th>
                      <th className="py-3 px-4">Browser</th>
                      <th className="py-3 px-4">Operating System</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]" style={{ fontFamily: RB }}>
                    {devices.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#111827] flex items-center gap-2">
                          {d.device.includes('iPhone') ? <Smartphone size={14} className="text-[#0D47A1]" /> : <Laptop size={14} className="text-[#0D47A1]" />}
                          {d.device}
                          {d.current && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                              Current Session
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#64748B]">{d.browser}</td>
                        <td className="py-3 px-4 text-[#64748B]">{d.os}</td>
                        <td className="py-3 px-4 text-[#64748B] font-mono">{d.lastActive}</td>
                        <td className="py-3 px-4 text-right">
                          {!d.current ? (
                            <button
                              onClick={() => handleSignOutDevice(d.id)}
                              className="px-2.5 py-1 bg-red-50 text-[#EF4444] rounded-lg font-semibold hover:bg-red-100 transition-colors text-[11px]"
                              style={{ fontFamily: PP }}
                            >
                              Sign Out Device
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#64748B] italic">Active</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* 7. ACCOUNT ACTIONS (SAVE & RESET BUTTONS) */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetPreferences}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 text-[#64748B] rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all border border-[#E5E7EB]"
                style={{ fontFamily: PP }}
              >
                Reset Preferences
              </button>
              <button
                type="button"
                onClick={handleSaveProfileSettings}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm shadow-[#0D47A1]/20 active:scale-[0.98]"
                style={{ fontFamily: PP }}
              >
                Update Preferences
              </button>
            </div>
          </div>

          {/* SECTION 07: ACTIVITY SUMMARY (KPIS) */}
          <div className="space-y-3">
            <h3 style={{ fontFamily: PP }} className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              Activity Summary Overview
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {activityKpis.map((kpi, idx) => (
                <div key={idx} className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                  <span className="text-xs font-medium text-[#64748B]">{kpi.label}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span style={{ fontFamily: PP }} className={`text-2xl font-bold ${kpi.color}`}>
                      {kpi.value}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {kpi.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 08: RECENT ACTIVITY TIMELINE */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
            <h3 style={{ fontFamily: PP }} className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-3">
              Recent Activity Audit Timeline
            </h3>

            {profileData.recentActivities.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#64748B]">
                No recent account activity recorded.
              </div>
            ) : (
              <div className="space-y-4 relative pl-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {profileData.recentActivities.map((act, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-5 top-1 h-3 w-3 rounded-full bg-[#0D47A1] border-2 border-white ring-2 ring-blue-100" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: PP }} className="text-xs font-bold text-[#111827]">
                          {act.title}
                        </span>
                        <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md">
                          {act.date}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#64748B]">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 09: DOCUMENTS */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
            <h3 style={{ fontFamily: PP }} className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-3">
              Verified Documents & Authorization Credentials
            </h3>

            {profileData.documents.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#64748B]">
                No documents uploaded.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {profileData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-3.5 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0D47A1]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span style={{ fontFamily: PP }} className="text-xs font-bold text-[#111827] block">
                          {doc.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" /> {doc.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => alert(`Viewing document ${doc.name}`)}
                        className="rounded-lg p-1.5 text-[#0D47A1] hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading document ${doc.name}`)}
                        className="rounded-lg p-1.5 text-[#64748B] hover:bg-slate-100"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="sticky bottom-0 -mx-6 -mb-36 mt-6 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            Logged in as <strong className="text-[#111827]">{profileData.fullName}</strong> ({currentRole})
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => alert('Downloading official Profile Summary PDF...')}
              className="rounded-xl border border-[#0D47A1] text-[#0D47A1] px-4 py-2 text-xs font-semibold hover:bg-blue-50 transition"
            >
              Download PDF
            </button>
            <button
              onClick={handleSaveProfile}
              className="rounded-xl bg-[#0D47A1] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0b3882] transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 style={{ fontFamily: PP }} className="text-base font-bold text-[#111827]">
                Change Account Password
              </h3>
              <button onClick={() => setPasswordModalOpen(false)} className="rounded-lg p-1 text-[#64748B] hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passForm.current}
                    onChange={e => setPassForm({ ...passForm, current: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 pr-10 text-[#111827] focus:border-[#0D47A1] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passForm.newPass}
                  onChange={e => setPassForm({ ...passForm, newPass: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#0D47A1] focus:outline-none"
                />
              </div>

              <div className="border-t border-[#E5E7EB] pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="rounded-xl border border-[#E5E7EB] px-4 py-2 font-semibold text-[#64748B] hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0D47A1] px-4 py-2 font-semibold text-white hover:bg-[#0b3882] transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showLoginHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 style={{ fontFamily: PP }} className="text-base font-bold text-[#111827]">
                Recent Login Activity History
              </h3>
              <button onClick={() => setShowLoginHistoryModal(false)} className="rounded-lg p-1 text-[#64748B] hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
              {[
                { date: 'Today, 09:42 AM', ip: '192.168.1.4', device: 'Chrome on Windows 11 Pro', location: 'Mumbai, India', status: 'Success' },
                { date: 'Yesterday, 08:15 AM', ip: '192.168.1.4', device: 'Chrome on Windows 11 Pro', location: 'Mumbai, India', status: 'Success' },
                { date: '25 Jul 2026, 04:30 PM', ip: '172.16.0.22', device: 'Safari Mobile on iPhone 15', location: 'Mumbai, India', status: 'Success' },
                { date: '24 Jul 2026, 11:10 AM', ip: '192.168.1.4', device: 'Chrome on Windows 11 Pro', location: 'Mumbai, India', status: 'Success' },
              ].map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{log.device}</div>
                    <div className="text-[11px] text-[#64748B]">{log.date} · IP {log.ip} · {log.location}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E5E7EB] pt-3 flex justify-end">
              <button
                onClick={() => setShowLoginHistoryModal(false)}
                className="px-4 py-2 bg-slate-100 border border-[#E5E7EB] text-[#111827] rounded-xl text-xs font-semibold hover:bg-slate-200"
                style={{ fontFamily: PP }}
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="fixed bottom-16 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#66BB6A] shrink-0" />
          <span className="text-xs font-semibold" style={{ fontFamily: PP }}>
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
