import React, { useState, useMemo } from 'react'
import {
  Users, UserCheck, UserX, Search, Filter, Shield, Key, Edit, Eye, X,
  CheckCircle2, AlertTriangle, ChevronRight, Mail, Building2, Clock,
  ArrowUpDown, RotateCcw, UserPlus, Lock
} from 'lucide-react'

// --- Typography Tokens ---
const PP = 'Poppins, sans-serif'
const RB = 'Roboto, sans-serif'

// --- Approved System Roles (Phase 1 SRS) ---
export type SystemRole =
  | 'Super Admin'
  | 'Hospital Admin'
  | 'Doctor'
  | 'Receptionist'
  | 'Nurse'
  | 'Accountant'
  | 'Patient'

export type AccountStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended'

export type UserRecord = {
  id: string
  empId: string
  fullName: string
  username: string
  email: string
  phone: string
  role: SystemRole
  department: string
  status: AccountStatus
  lastLogin: string
  joinedDate: string
  twoFactor: boolean
}

// Initial Mock Users Dataset
const INITIAL_USERS: UserRecord[] = [
  {
    id: 'USR-001',
    empId: 'EMP-1001',
    fullName: 'Dr. Arjun Mehta',
    username: 'arjun.mehta',
    email: 'arjun.mehta@citygeneral.org',
    phone: '+1 (555) 234-5678',
    role: 'Doctor',
    department: 'Cardiology',
    status: 'Active',
    lastLogin: 'Today, 09:42 AM',
    joinedDate: '2023-01-15',
    twoFactor: true,
  },
  {
    id: 'USR-002',
    empId: 'EMP-1002',
    fullName: 'Sarah Jenkins',
    username: 'sjenkins',
    email: 's.jenkins@citygeneral.org',
    phone: '+1 (555) 345-6789',
    role: 'Hospital Admin',
    department: 'Administration',
    status: 'Active',
    lastLogin: 'Today, 10:15 AM',
    joinedDate: '2022-11-01',
    twoFactor: true,
  },
  {
    id: 'USR-003',
    empId: 'EMP-1003',
    fullName: 'David Ross',
    username: 'dross',
    email: 'david.ross@citygeneral.org',
    phone: '+1 (555) 456-7890',
    role: 'Accountant',
    department: 'Accounts & Billing',
    status: 'Active',
    lastLogin: 'Yesterday, 04:30 PM',
    joinedDate: '2023-03-10',
    twoFactor: false,
  },
  {
    id: 'USR-004',
    empId: 'EMP-1004',
    fullName: 'Elena Rostova',
    username: 'erostova',
    email: 'e.rostova@citygeneral.org',
    phone: '+1 (555) 567-8901',
    role: 'Receptionist',
    department: 'OPD Reception',
    status: 'Active',
    lastLogin: 'Today, 08:00 AM',
    joinedDate: '2023-05-20',
    twoFactor: true,
  },
  {
    id: 'USR-005',
    empId: 'EMP-1005',
    fullName: 'Dr. Priya Sharma',
    username: 'psharma',
    email: 'p.sharma@citygeneral.org',
    phone: '+1 (555) 678-9012',
    role: 'Doctor',
    department: 'General Medicine',
    status: 'Active',
    lastLogin: 'Today, 11:05 AM',
    joinedDate: '2023-02-01',
    twoFactor: true,
  },
  {
    id: 'USR-006',
    empId: 'EMP-1006',
    fullName: 'Nurse Hannah Abbott',
    username: 'habbott',
    email: 'h.abbott@citygeneral.org',
    phone: '+1 (555) 789-0123',
    role: 'Nurse',
    department: 'Outpatient Care',
    status: 'Active',
    lastLogin: 'Yesterday, 07:45 PM',
    joinedDate: '2023-06-12',
    twoFactor: false,
  },
  {
    id: 'USR-007',
    empId: 'EMP-1007',
    fullName: 'Robert Chen',
    username: 'rchen',
    email: 'r.chen@citygeneral.org',
    phone: '+1 (555) 890-1234',
    role: 'Super Admin',
    department: 'IT & Systems',
    status: 'Active',
    lastLogin: 'Today, 07:30 AM',
    joinedDate: '2022-08-15',
    twoFactor: true,
  },
  {
    id: 'USR-008',
    empId: 'EMP-1008',
    fullName: 'Maria Rodriguez',
    username: 'mrodriguez',
    email: 'm.rodriguez@citygeneral.org',
    phone: '+1 (555) 901-2345',
    role: 'Receptionist',
    department: 'OPD Reception',
    status: 'Pending',
    lastLogin: 'Never (Pending Activation)',
    joinedDate: '2024-03-01',
    twoFactor: false,
  },
  {
    id: 'USR-009',
    empId: 'EMP-1009',
    fullName: 'Dr. Rajesh Kapoor',
    username: 'rkapoor',
    email: 'r.kapoor@citygeneral.org',
    phone: '+1 (555) 012-3456',
    role: 'Doctor',
    department: 'Neurology',
    status: 'Active',
    lastLogin: 'Mar 21, 2025',
    joinedDate: '2023-04-18',
    twoFactor: true,
  },
  {
    id: 'USR-010',
    empId: 'EMP-1010',
    fullName: 'James Thornton',
    username: 'jthornton',
    email: 'j.thornton@citygeneral.org',
    phone: '+1 (555) 123-4567',
    role: 'Accountant',
    department: 'Accounts & Billing',
    status: 'Suspended',
    lastLogin: 'Feb 14, 2025',
    joinedDate: '2023-07-22',
    twoFactor: false,
  },
  {
    id: 'USR-011',
    empId: 'EMP-1011',
    fullName: 'Nurse Clara Oswald',
    username: 'coswald',
    email: 'c.oswald@citygeneral.org',
    phone: '+1 (555) 234-5670',
    role: 'Nurse',
    department: 'Nursing & Patient Care',
    status: 'Inactive',
    lastLogin: 'Jan 10, 2025',
    joinedDate: '2023-09-05',
    twoFactor: false,
  },
  {
    id: 'USR-012',
    empId: 'EMP-1012',
    fullName: 'Sarah Mitchell',
    username: 'smitchell_pt',
    email: 'sarah.mitchell@example.com',
    phone: '+1 (555) 234-5678',
    role: 'Patient',
    department: 'Patient Portal Access',
    status: 'Active',
    lastLogin: 'Today, 10:42 AM',
    joinedDate: '2023-01-15',
    twoFactor: false,
  },
]

export function UserManagementCenterScreen() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [deptFilter, setDeptFilter] = useState<string>('All')

  // Sorting
  const [sortColumn, setSortColumn] = useState<keyof UserRecord>('empId')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Drawer States
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const [detailsUser, setDetailsUser] = useState<UserRecord | null>(null)

  // Dialog States
  const [resetPassUser, setResetPassUser] = useState<UserRecord | null>(null)
  const [statusDialogUser, setStatusDialogUser] = useState<{ user: UserRecord; action: 'Activate' | 'Suspend' | 'Deactivate' } | null>(null)

  // Add User Form State
  const [addForm, setAddForm] = useState({
    empId: `EMP-${1000 + users.length + 1}`,
    fullName: '',
    email: '',
    phone: '',
    username: '',
    tempPassword: 'TempPass#' + Math.floor(1000 + Math.random() * 9000),
    department: 'General Medicine',
    role: 'Doctor' as SystemRole,
    status: 'Active' as AccountStatus,
  })

  // Edit User Form State (Role is locked & read-only)
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    status: 'Active' as AccountStatus,
  })

  // Password Reset Dialog State
  const [forcePassChange, setForcePassChange] = useState(true)
  const [genTempPass, setGenTempPass] = useState('TempPass#' + Math.floor(1000 + Math.random() * 9000))

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // --- KPI Counts ---
  const totalUsersCount = users.length
  const activeUsersCount = users.filter(u => u.status === 'Active').length
  const inactiveUsersCount = users.filter(u => u.status === 'Inactive' || u.status === 'Suspended').length
  const pendingUsersCount = users.filter(u => u.status === 'Pending').length

  // --- Filtered & Sorted Users ---
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const match =
          u.empId.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
        if (!match) return false
      }
      // Dropdown filters
      if (roleFilter !== 'All' && u.role !== roleFilter) return false
      if (statusFilter !== 'All' && u.status !== statusFilter) return false
      if (deptFilter !== 'All' && u.department !== deptFilter) return false
      return true
    }).sort((a, b) => {
      let valA = a[sortColumn]
      let valB = b[sortColumn]
      if (typeof valA === 'string') valA = (valA as string).toLowerCase()
      if (typeof valB === 'string') valB = (valB as string).toLowerCase()
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [users, searchQuery, roleFilter, statusFilter, deptFilter, sortColumn, sortDirection])

  const handleSort = (col: keyof UserRecord) => {
    if (sortColumn === col) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(col)
      setSortDirection('asc')
    }
  }

  // --- Handlers ---
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.fullName || !addForm.email || !addForm.username || !addForm.role) {
      triggerToast('Please fill in all required fields.')
      return
    }
    const newUser: UserRecord = {
      id: `USR-0${users.length + 1}`,
      empId: addForm.empId || `EMP-${1000 + users.length + 1}`,
      fullName: addForm.fullName,
      username: addForm.username,
      email: addForm.email,
      phone: addForm.phone || '+1 (555) 000-0000',
      role: addForm.role,
      department: addForm.department,
      status: addForm.status,
      lastLogin: 'Never (New User)',
      joinedDate: new Date().toISOString().split('T')[0],
      twoFactor: false,
    }
    setUsers([newUser, ...users])
    triggerToast(`User ${newUser.fullName} (${newUser.empId}) created successfully!`)
    setShowAddDrawer(false)
    setAddForm({
      empId: `EMP-${1000 + users.length + 2}`,
      fullName: '',
      email: '',
      phone: '',
      username: '',
      tempPassword: 'TempPass#' + Math.floor(1000 + Math.random() * 9000),
      department: 'General Medicine',
      role: 'Doctor',
      status: 'Active',
    })
  }

  const handleOpenEditDrawer = (user: UserRecord) => {
    setEditingUser(user)
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      status: user.status,
    })
  }

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setUsers(prev =>
      prev.map(u =>
        u.id === editingUser.id
          ? {
            ...u,
            fullName: editForm.fullName,
            email: editForm.email,
            phone: editForm.phone,
            department: editForm.department,
            status: editForm.status,
          }
          : u
      )
    )
    triggerToast(`User ${editingUser.empId} profile updated successfully!`)
    setEditingUser(null)
  }

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetPassUser) return
    triggerToast(`Password reset successfully for ${resetPassUser.empId}. Temporary password sent.`)
    setResetPassUser(null)
  }

  const handleConfirmStatusChange = () => {
    if (!statusDialogUser) return
    const { user, action } = statusDialogUser
    let newStatus: AccountStatus = 'Active'
    if (action === 'Suspend') newStatus = 'Suspended'
    if (action === 'Deactivate') newStatus = 'Inactive'
    if (action === 'Activate') newStatus = 'Active'

    setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u)))
    triggerToast(`User ${user.empId} account status changed to "${newStatus}".`)
    setStatusDialogUser(null)
  }

  // --- Role Badge Variant Styling ---
  const getRoleBadgeStyle = (role: SystemRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Hospital Admin':
        return 'bg-blue-50 text-[#0D47A1] border-blue-200'
      case 'Doctor':
        return 'bg-teal-50 text-[#009688] border-teal-200'
      case 'Nurse':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Receptionist':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      case 'Accountant':
        return 'bg-amber-50 text-[#F59E0B] border-amber-200'
      case 'Patient':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
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
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>User & Role Management</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Hospital Admin</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">User & Role Management</span>
          </div>
        </div>

        <button
          onClick={() => setShowAddDrawer(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm shrink-0"
          style={{ fontFamily: PP }}
        >
          <UserPlus size={15} /> Add User
        </button>
      </div>

      {/* ── 2. SUMMARY KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Users */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Total Users</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{totalUsersCount}</div>
            <div className="text-[11px] text-[#0D47A1] font-medium mt-1">Across all departments</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
            <Users size={20} />
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Active Users</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{activeUsersCount}</div>
            <div className="text-[11px] text-[#66BB6A] font-medium mt-1">
              {Math.round((activeUsersCount / totalUsersCount) * 100)}% of total system users
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#66BB6A]">
            <UserCheck size={20} />
          </div>
        </div>

        {/* Inactive Users */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Inactive / Suspended</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{inactiveUsersCount}</div>
            <div className="text-[11px] text-[#EF4444] font-medium mt-1">Access revoked or offboarded</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#EF4444]">
            <UserX size={20} />
          </div>
        </div>

        {/* Pending Activation */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Pending Activation</div>
            <div className="text-2xl font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{pendingUsersCount}</div>
            <div className="text-[11px] text-[#F59E0B] font-medium mt-1">Awaiting initial password setup</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
            <Clock size={20} />
          </div>
        </div>

      </div>

      {/* ── 3. SEARCH & FILTERS TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by User Name, Employee ID, Email, Username..."
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

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap text-xs">

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
              <Shield size={13} className="text-slate-400" />
              <span className="text-slate-500 font-medium">Role:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Hospital Admin">Hospital Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Nurse">Nurse</option>
                <option value="Accountant">Accountant</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Patient">Patient</option>
              </select>
            </div>

            {/* Status Filter */}
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
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E5E7EB] px-3 py-1.5 rounded-xl">
              <Building2 size={13} className="text-slate-400" />
              <span className="text-slate-500 font-medium">Dept:</span>
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="bg-transparent font-semibold text-[#111827] outline-none cursor-pointer"
              >
                <option value="All">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurology">Neurology</option>
                <option value="Administration">Administration</option>
                <option value="OPD Reception">OPD Reception</option>
                <option value="Accounts & Billing">Accounts & Billing</option>
                <option value="Nursing & Patient Care">Nursing & Patient Care</option>
                <option value="IT & Systems">IT & Systems</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery('')
                setRoleFilter('All')
                setStatusFilter('All')
                setDeptFilter('All')
                triggerToast('Filters reset.')
              }}
              className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-500 hover:text-[#0D47A1] hover:bg-slate-50 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* ── 4. MAIN USER MANAGEMENT HMS TABLE ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-left text-xs">

            {/* Sticky Table Header */}
            <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
              <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                <th
                  onClick={() => handleSort('empId')}
                  className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Employee ID</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('fullName')}
                  className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Full Name</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('role')}
                  className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Role</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Phone</th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-4 py-3.5 cursor-pointer hover:text-[#0D47A1] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Last Login</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-[#111827]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => {
                  const initials = user.fullName
                    .split(' ')
                    .filter(n => n.length > 0)
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Employee ID */}
                      <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">
                        {user.empId}
                      </td>

                      {/* Full Name & Username */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0D47A1] font-bold text-xs flex items-center justify-center shrink-0" style={{ fontFamily: PP }}>
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-[#111827] block" style={{ fontFamily: PP }}>
                              {user.fullName}
                            </span>
                            <span className="text-[10px] text-[#64748B]">@{user.username}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getRoleBadgeStyle(user.role)}`}>
                          <Shield size={11} /> {user.role}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        {user.department}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 text-slate-600">
                        <a href={`mailto:${user.email}`} className="hover:text-[#0D47A1] hover:underline flex items-center gap-1">
                          <Mail size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{user.email}</span>
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 text-slate-600 font-mono">
                        {user.phone}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-50 text-[#66BB6A]' :
                          user.status === 'Pending' ? 'bg-amber-50 text-[#F59E0B]' :
                            user.status === 'Suspended' ? 'bg-orange-50 text-orange-600' :
                              'bg-red-50 text-[#EF4444]'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#66BB6A]' :
                            user.status === 'Pending' ? 'bg-[#F59E0B]' :
                              user.status === 'Suspended' ? 'bg-orange-500' :
                                'bg-[#EF4444]'
                            }`} />
                          {user.status}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                        {user.lastLogin}
                      </td>

                      {/* Row Actions: View Details | Edit User | Reset Password | Activate / Suspend */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">

                          {/* View Details */}
                          <button
                            onClick={() => setDetailsUser(user)}
                            className="p-1.5 text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
                            title="View User Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => handleOpenEditDrawer(user)}
                            className="p-1.5 text-slate-500 hover:text-[#009688] hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit User Information"
                          >
                            <Edit size={15} />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setResetPassUser(user)
                              setGenTempPass('TempPass#' + Math.floor(1000 + Math.random() * 9000))
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset Password"
                          >
                            <Key size={15} />
                          </button>

                          {/* Activate / Suspend / Deactivate Toggle */}
                          {user.status === 'Active' ? (
                            <button
                              onClick={() => setStatusDialogUser({ user, action: 'Suspend' })}
                              className="p-1.5 text-slate-400 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                              title="Suspend Account"
                            >
                              <UserX size={15} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setStatusDialogUser({ user, action: 'Activate' })}
                              className="p-1.5 text-slate-400 hover:text-[#66BB6A] hover:bg-green-50 rounded-lg transition-colors"
                              title="Activate Account"
                            >
                              <UserCheck size={15} />
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                /* EMPTY STATE */
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users size={32} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>No users found</h3>
                        <p className="text-xs text-[#64748B]">No user records match your search or filter criteria.</p>
                      </div>
                      <button
                        onClick={() => setShowAddDrawer(true)}
                        className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 mt-2"
                        style={{ fontFamily: PP }}
                      >
                        <UserPlus size={14} /> Add User
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
          <div className="text-xs text-[#64748B]">
            Showing <span className="font-bold text-[#111827]">{filteredUsers.length}</span> of <span className="font-bold text-[#111827]">{users.length}</span> total users
          </div>
          <div className="flex items-center gap-1">
            <button disabled className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium">Previous</button>
            <button className="w-7 h-7 bg-[#0D47A1] text-white rounded-lg text-xs font-bold">1</button>
            <button disabled className="px-3 py-1.5 text-xs text-slate-400 bg-slate-50 rounded-lg font-medium">Next</button>
          </div>
        </div>
      </div>

      {/* ── 5. RIGHT DRAWER 1: ADD USER ── */}
      {showAddDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddDrawer(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

              {/* Drawer Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: PP }}>
                    <UserPlus size={18} /> Add New System User
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">Create user account & assign approved system role</p>
                </div>
                <button onClick={() => setShowAddDrawer(false)} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateUser} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

                {/* Employee ID & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={addForm.empId}
                      onChange={e => setAddForm({ ...addForm, empId: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Initial Status</label>
                    <select
                      value={addForm.status}
                      onChange={e => setAddForm({ ...addForm, status: e.target.value as AccountStatus })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending Activation</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Robert Vance"
                    value={addForm.fullName}
                    onChange={e => setAddForm({ ...addForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="user@hospital.org"
                      value={addForm.email}
                      onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={addForm.phone}
                      onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                </div>

                {/* Username & Temporary Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. rvance"
                      value={addForm.username}
                      onChange={e => setAddForm({ ...addForm, username: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Temp Password</label>
                    <input
                      type="text"
                      readOnly
                      value={addForm.tempPassword}
                      className="w-full px-3 py-2 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Department</label>
                  <select
                    value={addForm.department}
                    onChange={e => setAddForm({ ...addForm, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Administration">Administration</option>
                    <option value="OPD Reception">OPD Reception</option>
                    <option value="Accounts & Billing">Accounts & Billing</option>
                    <option value="Nursing & Patient Care">Nursing & Patient Care</option>
                    <option value="IT & Systems">IT & Systems</option>
                  </select>
                </div>

                {/* Role Dropdown (Required upon creation ONLY) */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Role *</label>
                  <select
                    required
                    value={addForm.role}
                    onChange={e => setAddForm({ ...addForm, role: e.target.value as SystemRole })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Hospital Admin">Hospital Admin</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    * The role is selected ONLY during user creation and cannot be changed later.
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-gray-200 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddDrawer(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. RIGHT DRAWER 2: EDIT USER (Role is Read Only) ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Edit size={18} /> Edit User — {editingUser.empId}
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">Modify editable profile fields & account status</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEditUser} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

                {/* Read Only Role Display Card */}
                <div className="bg-slate-100 p-3.5 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <span className="text-[#64748B] text-[11px] block font-semibold">Assigned Role (Read Only)</span>
                    <span className="font-bold text-[#111827] text-xs flex items-center gap-1.5 mt-0.5" style={{ fontFamily: PP }}>
                      <Shield size={14} className="text-[#0D47A1]" /> {editingUser.role}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    <Lock size={12} /> Locked
                  </span>
                </div>

                {/* Editable Field: Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>

                {/* Editable Fields: Email & Phone Number */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                </div>

                {/* Editable Fields: Department & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Department</label>
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={e => setEditForm({ ...editForm, status: e.target.value as AccountStatus })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                    style={{ fontFamily: PP }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. RIGHT DRAWER 3: USER DETAILS (Read-only Role Card) ── */}
      {detailsUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDetailsUser(null)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">

              {/* Header */}
              <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Eye size={18} /> User Details
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">{detailsUser.empId}</p>
                </div>
                <button onClick={() => setDetailsUser(null)} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50" style={{ fontFamily: RB }}>

                {/* User Header Profile Card */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0D47A1] text-white font-bold text-lg flex items-center justify-center shadow-md" style={{ fontFamily: PP }}>
                    {detailsUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>{detailsUser.fullName}</h3>
                    <div className="text-xs text-[#64748B] mt-0.5">@{detailsUser.username}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(detailsUser.role)}`}>
                        <Shield size={10} /> {detailsUser.role}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#66BB6A]">
                        {detailsUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Read-only Role Card */}
                <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm">
                  <div className="text-xs text-[#64748B] font-medium">Assigned System Role</div>
                  <div className="text-sm font-bold text-[#111827] mt-1 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Shield size={16} className="text-[#0D47A1]" />
                    <span>{detailsUser.role}</span>
                  </div>
                </div>

                {/* Employee Information */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                    Employee Information
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Employee ID</span>
                      <span className="font-mono font-bold text-[#111827]">{detailsUser.empId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Department</span>
                      <span className="font-medium text-[#111827]">{detailsUser.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Email Address</span>
                      <span className="font-medium text-[#0D47A1]">{detailsUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Phone Number</span>
                      <span className="font-mono text-[#111827]">{detailsUser.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Joined Date</span>
                      <span className="font-medium text-[#111827]">{detailsUser.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                    Account Information
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Account Status</span>
                      <span className="font-semibold text-[#66BB6A]">{detailsUser.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Two-Factor Auth</span>
                      <span className="font-semibold text-[#0D47A1]">
                        {detailsUser.twoFactor ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Last System Login</span>
                      <span className="font-medium text-slate-700">{detailsUser.lastLogin}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Summary */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                    Recent Activity Summary
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 space-y-0.5">
                      <div className="font-semibold text-[#111827]">Logged into Operations Portal</div>
                      <div className="text-[10px] text-slate-400">Timestamp: {detailsUser.lastLogin}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 space-y-0.5">
                      <div className="font-semibold text-[#111827]">Updated record for Cardiology Department</div>
                      <div className="text-[10px] text-slate-400">Mar 20, 2025 · 02:15 PM</div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      const u = detailsUser
                      setDetailsUser(null)
                      handleOpenEditDrawer(u)
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setDetailsUser(null)}
                    className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. RESET PASSWORD DIALOG ── */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setResetPassUser(null)} />
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-md w-full p-6 space-y-4 relative z-10 animate-in zoom-in-95 duration-150" style={{ fontFamily: RB }}>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0">
                <Key size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Reset User Password</h3>
                <p className="text-xs text-[#64748B]">{resetPassUser.fullName} ({resetPassUser.empId})</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#111827] font-semibold mb-1">Generated Temporary Password</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={genTempPass}
                    className="flex-1 px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl font-mono text-xs font-bold text-[#0D47A1] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setGenTempPass('TempPass#' + Math.floor(1000 + Math.random() * 9000))}
                    className="p-2 rounded-xl border border-[#E5E7EB] bg-slate-50 hover:bg-slate-100 text-slate-700"
                    title="Generate New Temporary Password"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 space-y-2 border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forcePassChange}
                    onChange={e => setForcePassChange(e.target.checked)}
                    className="rounded text-[#0D47A1] focus:ring-[#0D47A1]"
                  />
                  <span className="font-semibold text-[#111827]">Force password change at next login</span>
                </label>
                <p className="text-[11px] text-[#64748B]">User will be required to create a new password immediately upon first sign in.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={handleConfirmResetPassword}
                className="px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                Reset Password
              </button>
              <button
                onClick={() => setResetPassUser(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 9. ACTIVATE / SUSPEND / DEACTIVATE CONFIRMATION DIALOG ── */}
      {statusDialogUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setStatusDialogUser(null)} />
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-md w-full p-6 space-y-4 relative z-10 animate-in zoom-in-95 duration-150" style={{ fontFamily: RB }}>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${statusDialogUser.action === 'Activate' ? 'bg-green-50 text-[#66BB6A]' : 'bg-red-50 text-[#EF4444]'
                }`}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Confirm Account {statusDialogUser.action}
                </h3>
                <p className="text-xs text-[#64748B]">{statusDialogUser.user.fullName} ({statusDialogUser.user.empId})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {statusDialogUser.action === 'Suspend' && (
                <>Are you sure you want to <strong>suspend</strong> access for <strong>{statusDialogUser.user.fullName}</strong>? The user will be logged out and unable to sign into the system until re-activated.</>
              )}
              {statusDialogUser.action === 'Deactivate' && (
                <>Are you sure you want to <strong>deactivate</strong> account <strong>{statusDialogUser.user.empId}</strong>?</>
              )}
              {statusDialogUser.action === 'Activate' && (
                <>Are you sure you want to <strong>activate</strong> user access for <strong>{statusDialogUser.user.fullName}</strong>?</>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={handleConfirmStatusChange}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-colors shadow-sm ${statusDialogUser.action === 'Activate'
                  ? 'bg-[#66BB6A] hover:bg-green-700'
                  : 'bg-[#EF4444] hover:bg-red-700'
                  }`}
                style={{ fontFamily: PP }}
              >
                {statusDialogUser.action} Account
              </button>
              <button
                onClick={() => setStatusDialogUser(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
