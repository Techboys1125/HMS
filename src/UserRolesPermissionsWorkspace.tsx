import { useState } from 'react'
import {
  Shield,
  Plus,
  Search,
  RefreshCw,
  Download,
  Eye,
  Edit2,
  Copy,
  ChevronRight,
  Lock,
  Grid,
  BarChart2,
  PieChart as PieChartIcon,
  Check,
  X,
  Sliders
} from 'lucide-react'

const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

interface RoleItem {
  id: string
  name: string
  description: string
  usersCount: number
  modules: string[]
  permissionLevel: 'Full Access' | 'High Access' | 'Medium Access' | 'Limited Access' | 'Self Service'
  status: 'Active' | 'Inactive'
  lastUpdated: string
  isSystem: boolean
  defaultDashboard: string
  createdDate: string
}

export function UserRolesPermissionsWorkspace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoleType, setSelectedRoleType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null)
  const [isRoleEditMode, setIsRoleEditMode] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [saveToast, setSaveToast] = useState<string | null>(null)

  // Roles Data (HMS Phase 1 System & Custom Roles)
  const [roles] = useState<RoleItem[]>([
    {
      id: 'r1',
      name: 'Super Admin',
      description: 'Master system controller with unrestricted access across all hospital nodes & server configs.',
      usersCount: 3,
      modules: ['Dashboard', 'Patients', 'Doctors', 'Appointments', 'Consultation', 'Billing', 'Reports', 'Audit Logs', 'Notifications', 'Settings', 'My Profile'],
      permissionLevel: 'Full Access',
      status: 'Active',
      lastUpdated: 'Today, 08:30 AM',
      isSystem: true,
      defaultDashboard: 'Super Admin Dashboard',
      createdDate: '01 Jan 2020',
    },
    {
      id: 'r2',
      name: 'Hospital Admin',
      description: 'Full administrative control over hospital operations, staff assignments, and configurations.',
      usersCount: 8,
      modules: ['Dashboard', 'Patients', 'Doctors', 'Appointments', 'Consultation', 'Billing', 'Reports', 'Audit Logs', 'Notifications', 'Settings', 'My Profile'],
      permissionLevel: 'Full Access',
      status: 'Active',
      lastUpdated: 'Yesterday, 14:20',
      isSystem: true,
      defaultDashboard: 'Hospital Admin Dashboard',
      createdDate: '15 Jan 2020',
    },
    {
      id: 'r3',
      name: 'Doctor (Physician / Specialist)',
      description: 'Access clinical modules, OPD consultations, e-prescriptions, and patient medical histories.',
      usersCount: 145,
      modules: ['Dashboard', 'Appointments', 'Consultation', 'Prescriptions', 'Reports', 'Notifications', 'My Profile'],
      permissionLevel: 'High Access',
      status: 'Active',
      lastUpdated: '2 days ago',
      isSystem: true,
      defaultDashboard: 'Doctor Clinical Dashboard',
      createdDate: '15 Jan 2020',
    },
    {
      id: 'r4',
      name: 'Receptionist (Front Desk)',
      description: 'Manage patient registration, check-ins, queue management, and initial bill collection.',
      usersCount: 24,
      modules: ['Dashboard', 'Patients', 'Appointments', 'Reception Queue', 'Billing (Collect)', 'Notifications', 'My Profile'],
      permissionLevel: 'Medium Access',
      status: 'Active',
      lastUpdated: '3 days ago',
      isSystem: true,
      defaultDashboard: 'Reception Dashboard',
      createdDate: '20 Feb 2020',
    },
    {
      id: 'r5',
      name: 'Accountant / Billing Admin',
      description: 'Manage financial ledgers, invoice generation, payment processing, tax rates, and revenue reports.',
      usersCount: 12,
      modules: ['Dashboard', 'Billing', 'Payments', 'Financial Reports', 'Notifications', 'My Profile'],
      permissionLevel: 'High Access',
      status: 'Active',
      lastUpdated: 'Yesterday, 11:00',
      isSystem: true,
      defaultDashboard: 'Accountant Dashboard',
      createdDate: '01 Mar 2020',
    },
    {
      id: 'r6',
      name: 'Nurse (Patient Care)',
      description: 'Record patient vitals, triage OPD queue, manage bed allocations, and assist consultations.',
      usersCount: 68,
      modules: ['Dashboard', 'Appointments', 'Consultation (Assisting)', 'Vitals Record', 'Notifications', 'My Profile'],
      permissionLevel: 'Medium Access',
      status: 'Active',
      lastUpdated: '5 days ago',
      isSystem: true,
      defaultDashboard: 'Nurse Dashboard',
      createdDate: '10 Mar 2020',
    },
    {
      id: 'r7',
      name: 'Patient Portal User',
      description: 'Access personal health records, prescription downloads, appointment bookings, and my bills.',
      usersCount: 14820,
      modules: ['Dashboard', 'My Appointments', 'My Prescriptions', 'My Bills', 'Notifications', 'My Profile'],
      permissionLevel: 'Self Service',
      status: 'Active',
      lastUpdated: 'Continuous',
      isSystem: true,
      defaultDashboard: 'Patient Personal Portal',
      createdDate: '01 Apr 2020',
    },
  ])

  // Permission Matrix State
  const matrixModules = ['Dashboard', 'Patients', 'Doctors', 'Appointments', 'Consultation', 'Billing', 'Reports', 'Audit Logs', 'Notifications', 'Settings', 'My Profile']
  const matrixRoles = ['Hospital Admin', 'Doctor', 'Receptionist', 'Accountant', 'Nurse', 'Patient Portal']

  const [permissionState, setPermissionState] = useState<Record<string, Record<string, { view: boolean; edit: boolean; delete: boolean; approve: boolean }>>>({
    'Hospital Admin': {
      Dashboard: { view: true, edit: true, delete: true, approve: true },
      Patients: { view: true, edit: true, delete: true, approve: true },
      Doctors: { view: true, edit: true, delete: true, approve: true },
      Appointments: { view: true, edit: true, delete: true, approve: true },
      Consultation: { view: true, edit: true, delete: true, approve: true },
      Billing: { view: true, edit: true, delete: true, approve: true },
      Reports: { view: true, edit: true, delete: true, approve: true },
      'Audit Logs': { view: true, edit: false, delete: false, approve: true },
      Notifications: { view: true, edit: true, delete: true, approve: true },
      Settings: { view: true, edit: true, delete: true, approve: true },
      'My Profile': { view: true, edit: true, delete: false, approve: true },
    },
    Doctor: {
      Dashboard: { view: true, edit: false, delete: false, approve: false },
      Patients: { view: true, edit: true, delete: false, approve: true },
      Doctors: { view: true, edit: false, delete: false, approve: false },
      Appointments: { view: true, edit: true, delete: false, approve: true },
      Consultation: { view: true, edit: true, delete: false, approve: true },
      Billing: { view: false, edit: false, delete: false, approve: false },
      Reports: { view: true, edit: false, delete: false, approve: false },
      'Audit Logs': { view: false, edit: false, delete: false, approve: false },
      Notifications: { view: true, edit: false, delete: false, approve: false },
      Settings: { view: false, edit: false, delete: false, approve: false },
      'My Profile': { view: true, edit: true, delete: false, approve: false },
    },
    Receptionist: {
      Dashboard: { view: true, edit: false, delete: false, approve: false },
      Patients: { view: true, edit: true, delete: false, approve: false },
      Doctors: { view: true, edit: false, delete: false, approve: false },
      Appointments: { view: true, edit: true, delete: true, approve: true },
      Consultation: { view: false, edit: false, delete: false, approve: false },
      Billing: { view: true, edit: true, delete: false, approve: false },
      Reports: { view: false, edit: false, delete: false, approve: false },
      'Audit Logs': { view: false, edit: false, delete: false, approve: false },
      Notifications: { view: true, edit: false, delete: false, approve: false },
      Settings: { view: false, edit: false, delete: false, approve: false },
      'My Profile': { view: true, edit: true, delete: false, approve: false },
    },
    Accountant: {
      Dashboard: { view: true, edit: false, delete: false, approve: false },
      Patients: { view: true, edit: false, delete: false, approve: false },
      Doctors: { view: false, edit: false, delete: false, approve: false },
      Appointments: { view: false, edit: false, delete: false, approve: false },
      Consultation: { view: false, edit: false, delete: false, approve: false },
      Billing: { view: true, edit: true, delete: true, approve: true },
      Reports: { view: true, edit: true, delete: false, approve: true },
      'Audit Logs': { view: false, edit: false, delete: false, approve: false },
      Notifications: { view: true, edit: false, delete: false, approve: false },
      Settings: { view: false, edit: false, delete: false, approve: false },
      'My Profile': { view: true, edit: true, delete: false, approve: false },
    },
    Nurse: {
      Dashboard: { view: true, edit: false, delete: false, approve: false },
      Patients: { view: true, edit: true, delete: false, approve: false },
      Doctors: { view: true, edit: false, delete: false, approve: false },
      Appointments: { view: true, edit: false, delete: false, approve: false },
      Consultation: { view: true, edit: true, delete: false, approve: false },
      Billing: { view: false, edit: false, delete: false, approve: false },
      Reports: { view: false, edit: false, delete: false, approve: false },
      'Audit Logs': { view: false, edit: false, delete: false, approve: false },
      Notifications: { view: true, edit: false, delete: false, approve: false },
      Settings: { view: false, edit: false, delete: false, approve: false },
      'My Profile': { view: true, edit: true, delete: false, approve: false },
    },
    'Patient Portal': {
      Dashboard: { view: true, edit: false, delete: false, approve: false },
      Patients: { view: false, edit: false, delete: false, approve: false },
      Doctors: { view: true, edit: false, delete: false, approve: false },
      Appointments: { view: true, edit: true, delete: true, approve: false },
      Consultation: { view: false, edit: false, delete: false, approve: false },
      Billing: { view: true, edit: false, delete: false, approve: false },
      Reports: { view: false, edit: false, delete: false, approve: false },
      'Audit Logs': { view: false, edit: false, delete: false, approve: false },
      Notifications: { view: true, edit: false, delete: false, approve: false },
      Settings: { view: false, edit: false, delete: false, approve: false },
      'My Profile': { view: true, edit: true, delete: false, approve: false },
    },
  })

  const toggleMatrixPermission = (role: string, module: string, perm: 'view' | 'edit' | 'delete' | 'approve') => {
    setPermissionState(prev => {
      const currentRoleObj = prev[role] || {}
      const currentModObj = currentRoleObj[module] || { view: false, edit: false, delete: false, approve: false }
      return {
        ...prev,
        [role]: {
          ...currentRoleObj,
          [module]: {
            ...currentModObj,
            [perm]: !currentModObj[perm],
          },
        },
      }
    })
  }

  // Filter Roles
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'All' || role.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // KPI Numbers
  const totalRoles = roles.length
  const systemRoles = roles.filter(r => r.isSystem).length
  const customRoles = roles.filter(r => !r.isSystem).length
  const totalPermissionsSets = 44

  const handleSaveChanges = () => {
    setSaveToast('Role & Permission matrix changes saved successfully!')
    setTimeout(() => setSaveToast(null), 3000)
  }

  // Use handleSaveChanges to suppress unused warning
  void handleSaveChanges

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ─── SECTION: SUB-HEADER ACTIONS ───────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ fontFamily: PP, fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
            User Roles & Permissions Configuration
          </h2>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
            Manage access permissions, module visibility, and role-based privileges for every Hospital Management System user.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => { }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#64748B',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={() => { }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#009688',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#0D47A1',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(13,71,161,0.2)',
            }}
          >
            <Plus size={14} /> Create Role
          </button>
        </div>
      </div>

      {/* ─── TOP KPI CARDS (4 CARDS) ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Total Roles</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} style={{ color: '#0D47A1' }} />
            </div>
          </div>
          <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
            {totalRoles}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>System & Custom</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
              Active
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>System Default Roles</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} style={{ color: '#009688' }} />
            </div>
          </div>
          <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
            {systemRoles}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Phase-1 Protected</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#009688', background: '#E0F2F1', padding: '1px 6px', borderRadius: '4px' }}>
              Core
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Custom Hospital Roles</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={18} style={{ color: '#2E7D32' }} />
            </div>
          </div>
          <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
            {customRoles}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>User Defined</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
              Configurable
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Active Permission Sets</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Grid size={18} style={{ color: '#B45309' }} />
            </div>
          </div>
          <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
            {totalPermissionsSets}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Module Rules</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '4px' }}>
              Enforced
            </span>
          </div>
        </div>
      </div>

      {/* ─── QUICK ACTIONS CARDS ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { title: 'Create New Role', desc: 'Define new privilege level & scope', icon: Plus, action: () => setIsCreateModalOpen(true) },
          { title: 'Permission Matrix', desc: 'Inspect grid-wide access levels', icon: Grid, action: () => { } },
          { title: 'Clone Role', desc: 'Duplicate existing role permissions', icon: Copy, action: () => { } },
          { title: 'Export Config', desc: 'Download role rules in JSON/CSV', icon: Download, action: () => { } },
        ].map((qa, i) => {
          const IconC = qa.icon
          return (
            <div
              key={i}
              onClick={qa.action}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconC size={18} style={{ color: '#0D47A1' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{qa.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{qa.desc}</div>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: '#94A3B8' }} />
            </div>
          )
        })}
      </div>

      {/* ─── SEARCH & FILTER BAR ─────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search role name, description, or access level..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '13px',
              boxSizing: 'border-box',
              fontFamily: RB,
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedRoleType}
            onChange={e => setSelectedRoleType(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', background: '#FFFFFF', color: '#374151' }}
          >
            <option value="All">All Role Types</option>
            <option value="System">System Default Roles</option>
            <option value="Custom">Custom Hospital Roles</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', background: '#FFFFFF', color: '#374151' }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedRoleType('All')
              setSelectedStatus('All')
            }}
            style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F8FAFC', color: '#64748B', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT SECTIONS ───────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px' }}>

        {/* SECTION 01: ROLES DATA TABLE */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Role Definitions Roster ({filteredRoles.length})
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>RBAC Security Protocol v4.2</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>Name</th>
                  <th style={{ padding: '12px 16px' }}>Description</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Last Updated</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0D47A1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {r.isSystem && <Lock size={12} style={{ color: '#009688' }} />}
                        {r.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                        {r.usersCount.toLocaleString()} Users • {r.permissionLevel}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748B', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.description}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: r.status === 'Active' ? '#E8F5E9' : '#FEF3C7', color: r.status === 'Active' ? '#2E7D32' : '#B45309' }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '12px' }}>
                      {r.lastUpdated}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedRole(r)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #0D47A1',
                          background: '#FFFFFF',
                          color: '#0D47A1',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 02: PERMISSION MATRIX GRID */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Grid size={18} style={{ color: '#0D47A1' }} /> Master Role-Permission Matrix
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                Configure granular View, Edit, Delete, and Approval permissions per role across all 11 HMS core modules.
              </p>
            </div>
            <span style={{ fontSize: '11px', color: '#009688', fontWeight: 600, background: '#E0F2F1', padding: '4px 10px', borderRadius: '6px' }}>
              Toggle Interactive
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E5E7EB', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>HMS Module</th>
                  {matrixRoles.map(role => (
                    <th key={role} style={{ padding: '10px 8px', textAlign: 'center', minWidth: '100px' }}>
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixModules.map(module => (
                  <tr key={module} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#111827' }}>
                      {module}
                    </td>
                    {matrixRoles.map(role => {
                      const perm = permissionState[role]?.[module] || { view: false, edit: false, delete: false, approve: false }
                      return (
                        <td key={role} style={{ padding: '8px 4px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '4px', background: '#F8FAFC', padding: '4px 6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <button
                              onClick={() => toggleMatrixPermission(role, module, 'view')}
                              title="View Permission"
                              style={{
                                border: 'none',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: perm.view ? '#E8F5E9' : '#FFFFFF',
                                color: perm.view ? '#2E7D32' : '#94A3B8',
                              }}
                            >
                              V
                            </button>
                            <button
                              onClick={() => toggleMatrixPermission(role, module, 'edit')}
                              title="Edit Permission"
                              style={{
                                border: 'none',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: perm.edit ? '#E3F2FD' : '#FFFFFF',
                                color: perm.edit ? '#0D47A1' : '#94A3B8',
                              }}
                            >
                              E
                            </button>
                            <button
                              onClick={() => toggleMatrixPermission(role, module, 'delete')}
                              title="Delete Permission"
                              style={{
                                border: 'none',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: perm.delete ? '#FEE2E2' : '#FFFFFF',
                                color: perm.delete ? '#DC2626' : '#94A3B8',
                              }}
                            >
                              D
                            </button>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 04: MODULE ACCESS OVERVIEW CARDS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} style={{ color: '#009688' }} /> Module Access Matrix Overview
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {[
              { module: 'Billing & Financials', allowed: ['Hospital Admin', 'Accountant', 'Receptionist (Collect Only)'], blocked: ['Doctor', 'Nurse', 'Patient Portal'], summary: 'Strict financial ledger controls & invoice creation' },
              { module: 'Clinical Consultations', allowed: ['Hospital Admin', 'Doctor', 'Nurse (Assisting)'], blocked: ['Accountant', 'Receptionist', 'Patient Portal'], summary: 'HIPAA protected EMR & e-prescription entry' },
              { module: 'Audit Logs & Governance', allowed: ['Super Admin', 'Hospital Admin'], blocked: ['Doctor', 'Nurse', 'Accountant', 'Receptionist'], summary: 'Immutable system access activity tracking' },
              { module: 'Patient Personal Portal', allowed: ['Patient Portal User', 'Hospital Admin'], blocked: ['Other External Roles'], summary: 'Personal health record view & appointment booking' },
            ].map((m, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontFamily: PP, fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{m.module}</h4>
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>RBAC Rule</span>
                </div>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 10px 0' }}>{m.summary}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: '#2E7D32', fontWeight: 700 }}>Allowed Roles: </span>
                    <span style={{ color: '#111827' }}>{m.allowed.join(', ')}</span>
                  </div>
                  <div>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>Blocked Roles: </span>
                    <span style={{ color: '#64748B' }}>{m.blocked.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 05: PERMISSION ANALYTICS CHARTS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: '#0D47A1' }} /> Role & Permission Analytics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Donut Chart Mock: Users by Role */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PieChartIcon size={14} style={{ color: '#009688' }} /> Active Staff Users by Role
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '120px' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'conic-gradient(#0D47A1 0% 55%, #009688 55% 80%, #F59E0B 80% 90%, #9C27B0 90% 100%)' }} />
                <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#0D47A1', fontWeight: 600 }}>■ Doctors (145)</span>
                  <span style={{ color: '#009688', fontWeight: 600 }}>■ Nurses (68)</span>
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>■ Receptionists (24)</span>
                  <span style={{ color: '#9C27B0', fontWeight: 600 }}>■ Accountants (12)</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Mock: Module Access Distribution */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Module Privilege Distribution</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { module: 'Patients Module', roles: 6, color: '#0D47A1' },
                  { module: 'Appointments Module', roles: 6, color: '#009688' },
                  { module: 'Billing Module', roles: 3, color: '#F59E0B' },
                  { module: 'Settings Module', roles: 2, color: '#EF4444' },
                ].map((b, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>{b.module}</span>
                      <span style={{ fontWeight: 600 }}>{b.roles} Roles Granted</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(b.roles / 6) * 100}%`, height: '100%', background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 03: ROLE DETAILS DRAWER (VIEW & EDIT MODES) ─────────── */}
      {selectedRole && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 100,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              width: '540px',
              height: '100%',
              boxSizing: 'border-box',
              boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            {/* DRAWER HEADER */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontFamily: PP, fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {selectedRole.name}
                  </h3>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: selectedRole.status === 'Active' ? '#E8F5E9' : '#FEF3C7', color: selectedRole.status === 'Active' ? '#2E7D32' : '#B45309' }}>
                    {selectedRole.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Access Level: <strong>{selectedRole.permissionLevel}</strong> • {selectedRole.usersCount.toLocaleString()} Accounts
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsRoleEditMode(!isRoleEditMode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #009688',
                    background: isRoleEditMode ? '#009688' : '#FFFFFF',
                    color: isRoleEditMode ? '#FFFFFF' : '#009688',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Edit2 size={14} /> {isRoleEditMode ? 'Cancel Edit' : 'Edit'}
                </button>
                <button onClick={() => { setSelectedRole(null); setIsRoleEditMode(false) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', padding: '4px' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* DRAWER CONTENT */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Group 1: General Information */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  General Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Role Title</label>
                    {isRoleEditMode ? (
                      <input
                        type="text"
                        defaultValue={selectedRole.name}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#111827' }}>{selectedRole.name}</span>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Permission Tier</label>
                    {isRoleEditMode ? (
                      <select
                        defaultValue={selectedRole.permissionLevel}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', background: '#FFFFFF' }}
                      >
                        <option>Full Access</option>
                        <option>Clinical Access</option>
                        <option>Operational</option>
                        <option>Financial</option>
                      </select>
                    ) : (
                      <span style={{ fontWeight: 600, color: '#009688' }}>{selectedRole.permissionLevel}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Role Description</label>
                  {isRoleEditMode ? (
                    <textarea
                      rows={2}
                      defaultValue={selectedRole.description}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  ) : (
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.4' }}>{selectedRole.description}</p>
                  )}
                </div>
              </div>

              {/* Group 2: Configuration Details */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  Configuration Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Default Dashboard</label>
                    {isRoleEditMode ? (
                      <input
                        type="text"
                        defaultValue={selectedRole.defaultDashboard}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#111827' }}>{selectedRole.defaultDashboard}</span>
                    )}
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Created Date</span>
                    <span style={{ color: '#475569' }}>{selectedRole.createdDate}</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '4px' }}>Accessible System Modules ({selectedRole.modules.length})</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedRole.modules.map((m, i) => (
                      <span key={i} style={{ fontSize: '11px', background: '#E3F2FD', color: '#0D47A1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Group 3: Related Statistics */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  Related Statistics
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Active User Accounts</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{selectedRole.usersCount.toLocaleString()} Accounts</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>System Protected</span>
                    <span style={{ fontWeight: 600, color: selectedRole.isSystem ? '#2E7D32' : '#64748B' }}>{selectedRole.isSystem ? 'Yes (Built-in)' : 'No (Custom)'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* DRAWER STICKY FOOTER */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => { setSelectedRole(null); setIsRoleEditMode(false) }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#64748B', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              {isRoleEditMode && (
                <button
                  onClick={() => { setSelectedRole(null); setIsRoleEditMode(false) }}
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(13,71,161,0.2)' }}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE ROLE MODAL */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, margin: 0, color: '#111827' }}>
                Create Custom Role Definition
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Role Name *</label>
                <input type="text" placeholder="e.g. Clinical Research Coordinator" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Role Description *</label>
                <textarea rows={3} placeholder="Describe duties and permission scope..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', fontFamily: RB }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Default Landing Dashboard</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}>
                  <option>Hospital Admin Dashboard</option>
                  <option>Doctor Clinical Dashboard</option>
                  <option>Nurse Dashboard</option>
                  <option>Reception Dashboard</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button onClick={() => setIsCreateModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => setIsCreateModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Create Role</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAVE TOAST NOTIFICATION */}
      {saveToast && (
        <div style={{ position: 'fixed', bottom: '80px', right: '24px', background: '#2E7D32', color: '#FFFFFF', padding: '12px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 90 }}>
          <Check size={16} /> {saveToast}
        </div>
      )}

    </div>
  )
}
