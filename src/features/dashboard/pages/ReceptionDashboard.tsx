import { useState } from 'react'
import {
  Users, Calendar, Clock, BarChart2, UserPlus, Stethoscope, CreditCard, Search, ChevronRight, Activity, Receipt, CheckSquare
} from 'lucide-react'
import {
  DKpi, Av, Chip, SH, PP, RB, type ChipVariant
} from '../components/DashboardShared'

export function ReceptionDashboard({ 
  onRegisterPatient,
  onPatientSearch,
  onCheckInClick,
  userRole = 'Receptionist',
  onNavigateNav,
  onPatientSelect,
  onEditPatient,
  onCreateInvoiceClick,
}: { 
  onRegisterPatient?: () => void
  onPatientSearch?: () => void
  onCheckInClick?: (token?: string, uhid?: string) => void
  userRole?: string
  onNavigateNav?: (nav: string) => void
  onPatientSelect?: (uhid: string) => void
  onEditPatient?: (uhid: string) => void
  onCreateInvoiceClick?: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('Today (2026-07-24)')
  const [selectedDoctor, setSelectedDoctor] = useState('All Doctors')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')

  const [queueList, setQueueList] = useState([
    { token: 'TK-086', name: 'Sarah Mitchell', uhid: 'UHID-892101', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', time: '09:00 AM', type: 'Follow-up', status: 'In Consultation', wait: '18 min' },
    { token: 'TK-087', name: 'James Thornton', uhid: 'UHID-892102', doctor: 'Dr. Priya Sharma', dept: 'General OPD', time: '09:15 AM', type: 'Routine', status: 'Waiting', wait: '12 min' },
    { token: 'TK-088', name: 'Emma Reyes', uhid: 'UHID-892103', doctor: 'Dr. Sunita Patel', dept: 'Gynecology', time: '09:30 AM', type: 'New Visit', status: 'Checked-In', wait: '08 min' },
    { token: 'TK-089', name: 'Robert Chen', uhid: 'UHID-892104', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', time: '10:00 AM', type: 'Emergency', status: 'Waiting', wait: '22 min' },
    { token: 'TK-090', name: 'Aisha Kumar', uhid: 'UHID-892105', doctor: 'Dr. Rajesh Kapoor', dept: 'Neurology', time: '10:15 AM', type: 'Consultation', status: 'Registered', wait: '04 min' },
    { token: 'TK-091', name: 'David Walsh', uhid: 'UHID-892106', doctor: 'Dr. Priya Sharma', dept: 'General OPD', time: '10:30 AM', type: 'Routine', status: 'Scheduled', wait: '00 min' },
    { token: 'TK-092', name: 'Nina Patel', uhid: 'UHID-892107', doctor: 'Dr. Rajesh Kapoor', dept: 'Dermatology', time: '11:00 AM', type: 'Follow-up', status: 'Completed', wait: '00 min' },
    { token: 'TK-093', name: 'Carlos Mendez', uhid: 'UHID-892108', doctor: 'Dr. Priya Sharma', dept: 'General OPD', time: '11:30 AM', type: 'Consultation', status: 'Cancelled', wait: '00 min' },
  ])

  const [todaysRegs] = useState([
    { name: 'Aisha Kumar', uhid: 'UHID-892105', time: '10:11 AM', type: 'Walk-In Registration' },
    { name: 'Michael Vance', uhid: 'UHID-892109', time: '10:05 AM', type: 'Online Self-Reg' },
    { name: 'Diana Prince', uhid: 'UHID-892110', time: '09:48 AM', type: 'Emergency Intake' },
    { name: 'Karan Malhotra', uhid: 'UHID-892111', time: '09:30 AM', type: 'Kiosk Check-In' },
  ])

  const [upcomingApps] = useState([
    { patient: 'Lily Anderson', doctor: 'Dr. Sunita Patel', time: '11:45 AM', dept: 'Gynecology' },
    { patient: 'Marcus Brown', doctor: 'Dr. Arjun Mehta', time: '12:15 PM', dept: 'Cardiology' },
    { patient: 'Siddharth Rao', doctor: 'Dr. Rajesh Kapoor', time: '01:00 PM', dept: 'Neurology' },
    { patient: 'Ananya Roy', doctor: 'Dr. Priya Sharma', time: '01:30 PM', dept: 'General OPD' },
  ])

  const getStatusVariant = (status: string): ChipVariant => {
    switch (status) {
      case 'In Consultation': return 'teal'
      case 'Waiting': return 'warning'
      case 'Checked-In': return 'info'
      case 'Registered': return 'info'
      case 'Scheduled': return 'default'
      case 'Completed': return 'success'
      case 'Cancelled': return 'error'
      case 'No Show': return 'error'
      default: return 'default'
    }
  }

  const handleCheckIn = (token: string) => {
    setQueueList(prev => prev.map(q => q.token === token ? { ...q, status: 'Checked-In' } : q))
  }

  const filteredQueue = queueList.filter(item => {
    const matchSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.token.toLowerCase().includes(searchQuery.toLowerCase())
    const matchDoctor = selectedDoctor === 'All Doctors' || item.doctor === selectedDoctor
    const matchDept = selectedDept === 'All Departments' || item.dept === selectedDept
    const matchStatus = selectedStatus === 'All Statuses' || item.status === selectedStatus
    return matchSearch && matchDoctor && matchDept && matchStatus
  })

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      
      {/* ── HEADER & BREADCRUMB & PRIMARY ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span>Reception</span>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0D47A1]">Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Reception Dashboard</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Monitor patient registrations, appointments and today's reception activities.</p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={onRegisterPatient}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm" 
            style={{ fontFamily: PP }}
          >
            <UserPlus size={15} />
            Register Patient
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-sm" style={{ fontFamily: PP }}>
            <Calendar size={15} />
            Book Appointment
          </button>
          <button 
            onClick={onPatientSearch}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-[#E5E7EB] text-[#111827] text-xs font-semibold hover:bg-slate-200 transition-all" 
            style={{ fontFamily: PP }}
          >
            <Search size={15} />
            Patient Search
          </button>
        </div>
      </div>

      {/* ── GLOBAL SEARCH & FILTER BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Reusable Search Component */}
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Patient Name, UHID, Mobile Number, or Appointment ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1] focus:bg-white transition-all"
            style={{ fontFamily: RB }}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <select 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>Today (2026-07-24)</option>
            <option>Tomorrow</option>
            <option>Yesterday</option>
          </select>

          <select 
            value={selectedDoctor} 
            onChange={e => setSelectedDoctor(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
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
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
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
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs text-[#64748B] focus:outline-none font-medium"
          >
            <option>All Statuses</option>
            <option>Registered</option>
            <option>Scheduled</option>
            <option>Checked-In</option>
            <option>Waiting</option>
            <option>In Consultation</option>
            <option>Completed</option>
            <option>Cancelled</option>
            <option>No Show</option>
          </select>

          <button 
            onClick={() => {
              setSearchQuery('')
              setSelectedDate('Today (2026-07-24)')
              setSelectedDoctor('All Doctors')
              setSelectedDept('All Departments')
              setSelectedStatus('All Statuses')
            }}
            className="px-3 py-2 rounded-xl text-xs text-[#EF4444] font-semibold hover:bg-red-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* ── QUICK ACTIONS BAR (TOP BAR ABOVE KPI CARDS) ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]" style={{ fontFamily: PP }}>
          Quick Actions
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {userRole === 'admin' || userRole === 'Hospital Admin' || userRole === 'Super Admin' ? (
            <>
              <button onClick={() => onNavigateNav?.('patients')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:border-[#0D47A1] hover:bg-blue-50/50 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <Users size={15} className="text-[#0D47A1]" />
                View Patients
              </button>
              <button onClick={() => onNavigateNav?.('appointments')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#009688] hover:border-[#009688] hover:bg-teal-50/50 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <Clock size={15} className="text-[#009688]" />
                View Queue
              </button>
              <button onClick={() => onNavigateNav?.('appointments')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:border-[#0D47A1] hover:bg-blue-50/50 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <Calendar size={15} className="text-[#0D47A1]" />
                Appointment Management
              </button>
              <button onClick={() => onNavigateNav?.('reports')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:border-[#64748B] hover:bg-slate-100 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <BarChart2 size={15} className="text-[#64748B]" />
                Operational Reports
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onRegisterPatient?.()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:border-[#0D47A1] hover:bg-blue-50/50 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <UserPlus size={15} className="text-[#0D47A1]" />
                Register Patient
              </button>
              <button onClick={() => onNavigateNav?.('appointments')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#009688] hover:border-[#009688] hover:bg-teal-50/50 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <Calendar size={15} className="text-[#009688]" />
                Book Appointment
              </button>
              <button onClick={() => onNavigateNav?.('doctors')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:border-[#0D47A1] hover:bg-blue-50/50 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <Stethoscope size={15} className="text-[#0D47A1]" />
                Doctor Management
              </button>
              <button onClick={() => onCreateInvoiceClick ? onCreateInvoiceClick() : onNavigateNav?.('billing')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#009688] hover:border-[#009688] hover:bg-teal-50/50 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <CreditCard size={15} className="text-[#009688]" />
                Billing
              </button>
              <button onClick={() => onNavigateNav?.('reports')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:border-[#64748B] hover:bg-slate-100 transition-all shadow-sm" style={{ fontFamily: PP }}>
                <BarChart2 size={15} className="text-[#64748B]" />
                Reports
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── SUMMARY KPI CARDS (6 CARDS) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <DKpi title="Today's Registrations" value="38" sub="Total registrations" trend="+14% vs yesterday" up={true} data={[{ v: 24 }, { v: 28 }, { v: 31 }, { v: 35 }, { v: 32 }, { v: 38 }]} color="#0D47A1" gid="rec1" Icon={UserPlus} />
        <DKpi title="Today's Appointments" value="142" sub="Booked visits" trend="+8% vs avg" up={true} data={[{ v: 110 }, { v: 125 }, { v: 130 }, { v: 128 }, { v: 138 }, { v: 142 }]} color="#009688" gid="rec2" Icon={Calendar} />
        <DKpi title="Waiting Patients" value="18" sub="Pending consultation" trend="Avg wait: 14 min" up={false} data={[{ v: 12 }, { v: 15 }, { v: 22 }, { v: 19 }, { v: 21 }, { v: 18 }]} color="#F59E0B" gid="rec3" Icon={Clock} />
        <DKpi title="Checked-In Patients" value="89" sub="Arrived & ready" trend="63% of total" up={true} data={[{ v: 50 }, { v: 62 }, { v: 71 }, { v: 79 }, { v: 84 }, { v: 89 }]} color="#4DB6AC" gid="rec4" Icon={CheckSquare} />
        <DKpi title="Completed Visits" value="48" sub="Consultations done" trend="34% overall" up={true} data={[{ v: 20 }, { v: 28 }, { v: 35 }, { v: 40 }, { v: 45 }, { v: 48 }]} color="#66BB6A" gid="rec5" Icon={Activity} />
        <DKpi title="Pending Payments" value="12" sub="Pending billing (Read Only)" trend="Read-Only view" up={true} data={[{ v: 18 }, { v: 15 }, { v: 14 }, { v: 16 }, { v: 13 }, { v: 12 }]} color="#EF4444" gid="rec6" Icon={Receipt} />
      </div>

      {/* ── THREE-COLUMN ENTERPRISE DASHBOARD CONTENT ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT & CENTER MAIN CONTENT (8 COLS) */}
        <div className="xl:col-span-8 space-y-6">

          {/* MAIN SECTION: TODAY'S PATIENT QUEUE (Enterprise Data Table) */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Today's Patient Queue</h2>
                <p className="text-xs text-[#64748B]">Real-time operational queue and check-in status</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1]">
                {filteredQueue.length} Patients Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]" style={{ fontFamily: PP }}>
                    <th className="px-4 py-3">Token</th>
                    <th className="px-4 py-3">Patient Name</th>
                    <th className="px-4 py-3">UHID</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Appt Time</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Wait Time</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {filteredQueue.length > 0 ? (
                    filteredQueue.map(item => (
                      <tr key={item.token} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-[#0D47A1]">{item.token}</td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-[#111827]">{item.name}</div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">{item.uhid}</td>
                        <td className="px-4 py-3.5 font-medium">{item.doctor}</td>
                        <td className="px-4 py-3.5 text-slate-600">{item.dept}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">{item.time}</td>
                        <td className="px-4 py-3.5 text-slate-600">{item.type}</td>
                        <td className="px-4 py-3.5">
                          <Chip label={item.status} variant={getStatusVariant(item.status)} />
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">{item.wait}</td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status === 'Scheduled' || item.status === 'Registered' ? (
                              <button 
                                onClick={() => {
                                  handleCheckIn(item.token)
                                  if (onCheckInClick) onCheckInClick(item.token, item.uhid)
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                              >
                                Check-In
                              </button>
                            ) : null}
                            <button 
                              onClick={() => onPatientSelect ? onPatientSelect(item.uhid) : null}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => onEditPatient ? onEditPatient(item.uhid) : null}
                              className="px-2 py-1 rounded-lg border border-[#E5E7EB] text-slate-600 text-[11px] font-medium hover:bg-slate-50 transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Clock size={32} className="text-slate-300" />
                          <p className="text-sm font-semibold text-[#111827]">No appointments available today.</p>
                          <p className="text-xs text-slate-400">Try adjusting your filters or register a new patient.</p>
                          <button className="mt-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all" style={{ fontFamily: PP }}>
                            Register Patient
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#64748B]">
              <span>Showing 1-{filteredQueue.length} of {filteredQueue.length} queue entries</span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] disabled:opacity-50 hover:bg-slate-50" disabled>Previous</button>
                <button className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white font-semibold">1</button>
                <button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50">Next</button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT CONTEXT PANEL (4 COLS) */}
        <div className="xl:col-span-4 space-y-6">

          {/* Today's Registrations */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 flex flex-col justify-between">
            <div>
              <SH title="Today's Registrations" sub="Recently created patient profiles" />
              <div className="divide-y divide-gray-100">
                {todaysRegs.map(reg => (
                  <div key={reg.uhid} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <Av name={reg.name} size="sm" />
                      <div>
                        <div className="text-xs font-bold text-[#111827]">{reg.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{reg.uhid}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-[#0D47A1]">{reg.time}</div>
                      <div className="text-[10px] text-slate-500">{reg.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-4 w-full py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors" style={{ fontFamily: PP }}>
              View All Registrations →
            </button>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 flex flex-col justify-between">
            <div>
              <SH title="Upcoming Appointments" sub="Next scheduled consultations" />
              <div className="divide-y divide-gray-100">
                {upcomingApps.map((app, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#009688] font-bold text-xs">
                        <Calendar size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827]">{app.patient}</div>
                        <div className="text-[11px] text-slate-500">{app.doctor}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#009688]">{app.time}</div>
                      <div className="text-[10px] text-slate-400">{app.dept}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-4 w-full py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#009688] hover:bg-teal-50 transition-colors" style={{ fontFamily: PP }}>
              View Master Schedule →
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}
