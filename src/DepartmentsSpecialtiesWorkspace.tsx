import { useState } from 'react'
import {
  Building,
  Plus,
  Search,
  RefreshCw,
  Download,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  ChevronRight,
  Stethoscope,
  Network,
  BarChart2,
  X
} from 'lucide-react'

const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

interface Department {
  id: string
  code: string
  name: string
  specialty: string
  head: string
  doctorsCount: number
  consultationRooms: number
  status: 'Active' | 'Inactive'
  lastUpdated: string
  description: string
  workingHours: string
  createdDate: string
}

export function DepartmentsSpecialtiesWorkspace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All')
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Mock Departments Data
  const [departments] = useState<Department[]>([
    {
      id: '1',
      code: 'DEP-CARD-01',
      name: 'Cardiology Department',
      specialty: 'Cardiology & Cardiovascular Surgery',
      head: 'Dr. Arjun Mehta (MD, FACC)',
      doctorsCount: 18,
      consultationRooms: 8,
      status: 'Active',
      lastUpdated: 'Today, 10:30 AM',
      description: 'Comprehensive cardiac care unit equipped with advanced cath lab and electrophysiology monitoring.',
      workingHours: '24/7 Operational',
      createdDate: '15 Jan 2020',
    },
    {
      id: '2',
      code: 'DEP-NEUR-02',
      name: 'Neurology Department',
      specialty: 'Neurology & Neurosurgery',
      head: 'Dr. Rajesh Kapoor (DM, MCh)',
      doctorsCount: 14,
      consultationRooms: 6,
      status: 'Active',
      lastUpdated: 'Yesterday, 14:15',
      description: 'Specialized neuro-critical care unit for stroke management, epilepsy, and brain surgery.',
      workingHours: 'Mon - Sat: 08:00 AM - 08:00 PM',
      createdDate: '10 Feb 2020',
    },
    {
      id: '3',
      code: 'DEP-PED-03',
      name: 'Pediatrics Department',
      specialty: 'Pediatrics & Neonatology (NICU)',
      head: 'Dr. Sunita Patel (MD, DCH)',
      doctorsCount: 12,
      consultationRooms: 5,
      status: 'Active',
      lastUpdated: '2 days ago',
      description: 'Dedicated pediatric OPD and Level-3 NICU facility for infants and child healthcare.',
      workingHours: '24/7 Emergency / OPD 09:00 AM - 06:00 PM',
      createdDate: '01 Mar 2020',
    },
    {
      id: '4',
      code: 'DEP-ORTH-04',
      name: 'Orthopedics Department',
      specialty: 'Orthopedics & Joint Replacement',
      head: 'Dr. Vikram Shah (MS Ortho)',
      doctorsCount: 15,
      consultationRooms: 7,
      status: 'Active',
      lastUpdated: '3 days ago',
      description: 'Trauma care, robotic knee replacement, and sports medicine rehabilitation center.',
      workingHours: 'Mon - Sat: 09:00 AM - 07:00 PM',
      createdDate: '20 Apr 2020',
    },
    {
      id: '5',
      code: 'DEP-DERM-05',
      name: 'Dermatology Department',
      specialty: 'Dermatology & Cosmetology',
      head: 'Dr. Priya Sharma (MD Derm)',
      doctorsCount: 8,
      consultationRooms: 4,
      status: 'Inactive',
      lastUpdated: '1 week ago',
      description: 'Skin disease diagnostic clinic, laser treatments, and aesthetic clinical procedures.',
      workingHours: 'Mon - Fri: 10:00 AM - 05:00 PM',
      createdDate: '12 Jun 2021',
    },
    {
      id: '6',
      code: 'DEP-GYN-06',
      name: 'Gynecology & Obstetrics',
      specialty: 'Gynecology & Fetal Medicine',
      head: 'Dr. Ananya Roy (MD, DGO)',
      doctorsCount: 16,
      consultationRooms: 6,
      status: 'Active',
      lastUpdated: 'Yesterday, 09:00',
      description: 'High-risk pregnancy monitoring, maternity suites, and minimally invasive laparoscopic surgery.',
      workingHours: '24/7 Maternity / OPD 08:00 AM - 08:00 PM',
      createdDate: '10 Aug 2020',
    },
  ])

  // Mock Specialties Card Grid Data
  const specialties = [
    { name: 'Cardiology', doctors: 18, department: 'Cardiology Department', icon: Activity, color: '#EF4444' },
    { name: 'Neurology', doctors: 14, department: 'Neurology Department', icon: Network, color: '#F59E0B' },
    { name: 'Orthopedics', doctors: 15, department: 'Orthopedics Department', icon: Building, color: '#0D47A1' },
    { name: 'Pediatrics', doctors: 12, department: 'Pediatrics Department', icon: Users, color: '#009688' },
    { name: 'Dermatology', doctors: 8, department: 'Dermatology Department', icon: Stethoscope, color: '#9C27B0' },
    { name: 'ENT & Head Neck', doctors: 9, department: 'ENT Department', icon: Stethoscope, color: '#4DB6AC' },
    { name: 'General Medicine', doctors: 22, department: 'General Medicine OPD', icon: Activity, color: '#0D47A1' },
    { name: 'Gynecology', doctors: 16, department: 'Gynecology & Obstetrics', icon: Users, color: '#E91E63' },
    { name: 'Radiology', doctors: 11, department: 'Imaging & Radiology', icon: BarChart2, color: '#607D8B' },
  ]

  // KPI calculations
  const totalDepts = departments.length
  const activeDepts = departments.filter(d => d.status === 'Active').length
  const inactiveDepts = totalDepts - activeDepts
  const totalSpecialties = specialties.length

  // Filter Logic
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatusFilter === 'All' || dept.status === selectedStatusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ─── SECTION: SUB-HEADER ACTIONS ───────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ fontFamily: PP, fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Departments & Specialties Management
          </h2>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
            Manage medical departments, specialty consultation units, doctor allocations, and hospital organizational hierarchy.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {}}
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
            onClick={() => {}}
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
            onClick={() => setIsAddModalOpen(true)}
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
            <Plus size={14} /> Add Department
          </button>
        </div>
      </div>

      {/* ─── TOP KPI CARDS (4 CARDS) ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Total Departments</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={18} style={{ color: '#0D47A1' }} />
            </div>
          </div>
          <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
            {totalDepts}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Hospital Units</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
              +2 this year
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Medical Specialties</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={18} style={{ color: '#009688' }} />
            </div>
          </div>
          <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
            {totalSpecialties}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Specialized Care</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#009688', background: '#E0F2F1', padding: '1px 6px', borderRadius: '4px' }}>
              100% Covered
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Active Departments</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} style={{ color: '#2E7D32' }} />
            </div>
          </div>
          <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
            {activeDepts}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Operational OPDs</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
              Optimal
            </span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Inactive Departments</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={18} style={{ color: '#B45309' }} />
            </div>
          </div>
          <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
            {inactiveDepts}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Maintenance / Review</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '4px' }}>
              Review Needed
            </span>
          </div>
        </div>
      </div>

      {/* ─── QUICK ACTIONS CARDS ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { title: 'Add Department', desc: 'Create a new medical department unit', icon: Plus, action: () => setIsAddModalOpen(true) },
          { title: 'Add Specialty', desc: 'Define new specialty consultation branch', icon: Stethoscope, action: () => {} },
          { title: 'View Structure', desc: 'Inspect hospital organizational hierarchy', icon: Network, action: () => {} },
          { title: 'Export List', desc: 'Download CSV/Excel department roster', icon: Download, action: () => {} },
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
            placeholder="Search by department name, code, or HOD..."
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
            value={selectedTypeFilter}
            onChange={e => setSelectedTypeFilter(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', background: '#FFFFFF', color: '#374151' }}
          >
            <option value="All">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', background: '#FFFFFF', color: '#374151' }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedTypeFilter('All')
              setSelectedStatusFilter('All')
            }}
            style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F8FAFC', color: '#64748B', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT SECTIONS ───────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px' }}>
        
        {/* SECTION 01: DEPARTMENTS DATA TABLE */}
          
          {/* SECTION 01: DEPARTMENTS DATA TABLE */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                Hospital Departments Roster ({filteredDepartments.length})
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Real-time Unit Sync</span>
            </div>

            {filteredDepartments.length === 0 ? (
              /* EMPTY STATE */
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <Building size={48} style={{ color: '#94A3B8', marginBottom: '12px' }} />
                <h4 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
                  No departments configured
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
                  Click "Add Department" to create your first hospital department unit.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  + Add Department
                </button>
              </div>
            ) : (
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
                    {filteredDepartments.map((dept) => (
                      <tr key={dept.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0D47A1' }}>
                          <div>{dept.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>{dept.code} • {dept.head}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569', maxWidth: '300px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {dept.description}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: dept.status === 'Active' ? '#E8F5E9' : '#FEF3C7', color: dept.status === 'Active' ? '#2E7D32' : '#B45309' }}>
                            {dept.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '12px' }}>{dept.lastUpdated}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedDept(dept)}
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
            )}
          </div>

          {/* SECTION 03: MEDICAL SPECIALTIES CARDS GRID */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={18} style={{ color: '#009688' }} /> Medical Specialties Catalog
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {specialties.map((sp, idx) => {
                const IconC = sp.icon
                return (
                  <div key={idx} style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconC size={16} style={{ color: sp.color }} />
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 600, background: '#E8F5E9', color: '#2E7D32', padding: '2px 6px', borderRadius: '4px' }}>
                          Active
                        </span>
                      </div>
                      <h4 style={{ fontFamily: PP, fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
                        {sp.name}
                      </h4>
                      <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>
                        Dept: {sp.department}
                      </p>
                    </div>

                    <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#0D47A1' }}>{sp.doctors} Doctors</span>
                      <button style={{ border: 'none', background: 'transparent', color: '#0D47A1', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                        Details →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SECTION 04: DEPARTMENT HIERARCHY ORG CHART */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={18} style={{ color: '#0D47A1' }} /> Department Organizational Hierarchy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              {/* Level 1: Hospital */}
              <div style={{ background: '#0D47A1', color: '#FFFFFF', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, fontFamily: PP, fontSize: '14px', boxShadow: '0 2px 4px rgba(13,71,161,0.2)' }}>
                🏥 St. Jude General Hospital (Master Facility Node)
              </div>
              <div style={{ width: '2px', height: '16px', background: '#CBD5E1' }} />

              {/* Level 2: Medical Services */}
              <div style={{ background: '#009688', color: '#FFFFFF', padding: '8px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>
                Medical & Clinical Services Directorate
              </div>
              <div style={{ width: '2px', height: '16px', background: '#CBD5E1' }} />

              {/* Level 3: Department Nodes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#111827' }}>Clinical OPD & Inpatient</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Cardiology, Neuro, Ortho</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#111827' }}>Surgical Services</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>OT, Anesthesia, Trauma</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#111827' }}>Diagnostic & Support</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Radiology, Pathology</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 05: DEPARTMENT STATISTICS CHARTS */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} style={{ color: '#009688' }} /> Department Operational Statistics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Doctor Distribution Bar Mock */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Doctor Allocation per Department</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { dept: 'General Medicine', count: 22, color: '#0D47A1' },
                    { dept: 'Cardiology', count: 18, color: '#EF4444' },
                    { dept: 'Gynecology', count: 16, color: '#E91E63' },
                    { dept: 'Orthopedics', count: 15, color: '#009688' },
                  ].map((d, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                        <span>{d.dept}</span>
                        <span style={{ fontWeight: 600 }}>{d.count} Docs</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(d.count / 25) * 100}%`, height: '100%', background: d.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Utilization Pie Mock */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>OPD Consultation Utilization</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '120px' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'conic-gradient(#0D47A1 0% 40%, #009688 40% 70%, #F59E0B 70% 90%, #EF4444 90% 100%)' }} />
                  <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: '#0D47A1', fontWeight: 600 }}>■ Cardiology (40%)</span>
                    <span style={{ color: '#009688', fontWeight: 600 }}>■ Gen Medicine (30%)</span>
                    <span style={{ color: '#F59E0B', fontWeight: 600 }}>■ Pediatrics (20%)</span>
                    <span style={{ color: '#EF4444', fontWeight: 600 }}>■ Emergency (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </div>

      {/* ─── SECTION 02: REUSABLE HMS RIGHT DRAWER (VIEW & EDIT MODES) ─────── */}
      {selectedDept && (
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
                    {selectedDept.name}
                  </h3>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: selectedDept.status === 'Active' ? '#E8F5E9' : '#FEF3C7', color: selectedDept.status === 'Active' ? '#2E7D32' : '#B45309' }}>
                    {selectedDept.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Code: <strong>{selectedDept.code}</strong> • HOD: {selectedDept.head}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #009688',
                    background: isEditMode ? '#009688' : '#FFFFFF',
                    color: isEditMode ? '#FFFFFF' : '#009688',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Edit2 size={14} /> {isEditMode ? 'Cancel Edit' : 'Edit'}
                </button>
                <button onClick={() => { setSelectedDept(null); setIsEditMode(false) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', padding: '4px' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* DRAWER CONTENT */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Group 1: General Information Card */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  General Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Department Name</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        defaultValue={selectedDept.name}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#111827' }}>{selectedDept.name}</span>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Medical Specialty</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        defaultValue={selectedDept.specialty}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#009688' }}>{selectedDept.specialty}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Group 2: Operational Information Card */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  Operational & Clinical Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Head of Department (HOD)</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        defaultValue={selectedDept.head}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#111827' }}>{selectedDept.head}</span>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Working Hours</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        defaultValue={selectedDept.workingHours}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 500, color: '#475569' }}>{selectedDept.workingHours}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Operational Description</label>
                  {isEditMode ? (
                    <textarea
                      rows={3}
                      defaultValue={selectedDept.description}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  ) : (
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.4' }}>{selectedDept.description}</p>
                  )}
                </div>
              </div>

              {/* Group 3: Related Statistics Card */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  Related Statistics & Capacity
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Assigned Physicians</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{selectedDept.doctorsCount} Doctors</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Consultation OPD Suites</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{selectedDept.consultationRooms} Rooms</span>
                  </div>
                </div>
              </div>

            </div>

            {/* DRAWER STICKY FOOTER */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => { setSelectedDept(null); setIsEditMode(false) }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#64748B', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              {isEditMode && (
                <button
                  onClick={() => { setSelectedDept(null); setIsEditMode(false) }}
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(13,71,161,0.2)' }}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD DEPARTMENT MODAL */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, margin: 0, color: '#111827' }}>
                Add New Hospital Department
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Department Name *</label>
                <input type="text" placeholder="e.g. Nephrology Department" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Department Code *</label>
                <input type="text" placeholder="e.g. DEP-NEPH-07" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Medical Specialty *</label>
                <input type="text" placeholder="e.g. Nephrology & Renal Care" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button onClick={() => setIsAddModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => setIsAddModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Create Unit</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
