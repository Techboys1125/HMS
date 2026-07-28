// React imports
import {
  Activity, AlertTriangle,
  Calendar, CheckSquare, Clock,
  ClipboardList, FileText,
  Pill, Plus, Receipt,
  Server, Settings, Shield, TrendingDown,
  TrendingUp, UserPlus, Users, Download,
  Building2, Database, HardDrive,
  Globe, DollarSign, Wifi, Star,
  Bell, Stethoscope, CreditCard,
  BarChart2, User, Search
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip
} from 'recharts'

const PP = 'Poppins, system-ui, sans-serif'
const RB = 'Roboto, system-ui, sans-serif'

// ─── Mini Shared Components ────────────────────────────────────────────────
function DKpi({ title, value, sub, trend, up, data, color, gid, Icon }: {
  title: string; value: string; sub: string; trend: string; up: boolean;
  data: { v: number }[]; color: string; gid: string; Icon: React.ElementType
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-[#64748B] mb-1" style={{ fontFamily: RB }}>{title}</div>
          <div className={`${value.length > 12 ? 'text-base' : value.length > 8 ? 'text-lg' : 'text-xl'} font-bold text-[#111827] leading-tight truncate`} style={{ fontFamily: PP }}>{value}</div>
          <div className="text-xs text-slate-400 mt-1 truncate" style={{ fontFamily: RB }}>{sub}</div>
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + '18' }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${gid})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-[#66BB6A]' : 'text-[#EF4444]'}`}
        style={{ fontFamily: RB }}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
  )
}

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

function SH({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>{title}</div>
        {sub && <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>{sub}</div>}
      </div>
      {action}
    </div>
  )
}

export function AlertRow({ level, msg, time, sub }: { level: 'critical' | 'warning' | 'info'; msg: string; time: string; sub?: string }) {
  const cfg = {
    critical: { bg: 'bg-red-50 border-red-100', icon: 'text-[#EF4444]', text: 'text-red-800', sub: 'text-red-600' },
    warning: { bg: 'bg-amber-50 border-amber-100', icon: 'text-[#F59E0B]', text: 'text-amber-800', sub: 'text-amber-600' },
    info: { bg: 'bg-blue-50 border-blue-100', icon: 'text-[#0D47A1]', text: 'text-blue-800', sub: 'text-blue-600' },
  }[level]
  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${cfg.bg}`}>
      <AlertTriangle size={13} className={`${cfg.icon} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-medium ${cfg.text} leading-snug`} style={{ fontFamily: RB }}>{msg}</div>
        {sub && <div className={`text-[10px] mt-0.5 ${cfg.sub}`} style={{ fontFamily: RB }}>{sub}</div>}
      </div>
      <span className="text-[10px] text-slate-400 shrink-0" style={{ fontFamily: RB }}>{time}</span>
    </div>
  )
}


function ProgressBar({ label, value, total, color, sub }: { label: string; value: number; total: number; color: string; sub?: string }) {
  const pct = Math.round((value / total) * 100)
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
          <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {sub && <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>{sub}</span>}
          <span className="font-mono text-xs font-semibold text-[#64748B]">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ─── 01 SUPER ADMIN DASHBOARD ──────────────────────────────────────────────
const HOSPITALS = [
  { name: 'City General Hospital', city: 'New York', units: 450, staff: 312, status: 'active', plan: 'Enterprise' },
  { name: 'St. Mary Medical Center', city: 'Los Angeles', units: 280, staff: 198, status: 'active', plan: 'Professional' },
  { name: 'Green Valley Clinic', city: 'Chicago', units: 120, staff: 87, status: 'active', plan: 'Standard' },
  { name: 'Sunrise Healthcare', city: 'Houston', units: 340, staff: 241, status: 'active', plan: 'Enterprise' },
  { name: 'Metro Health Institute', city: 'Phoenix', units: 210, staff: 163, status: 'inactive', plan: 'Standard' },
  { name: 'Harbor Point Hospital', city: 'Philadelphia', units: 380, staff: 279, status: 'active', plan: 'Professional' },
]

const SA_AUDIT = [
  { user: 'Admin Kumar', action: 'Modified hospital settings for City General', time: '2m ago', type: 'settings' },
  { user: 'System', action: 'Automated backup completed successfully', time: '18m ago', type: 'system' },
  { user: 'Admin Sharma', action: 'Created new user account — Dr. R. Kapoor', time: '32m ago', type: 'user' },
  { user: 'Admin Kumar', action: 'Assigned Admin role to J. Williams', time: '1h ago', type: 'role' },
  { user: 'System', action: 'License renewed for Harbor Point Hospital', time: '2h ago', type: 'license' },
]

const ROLE_DIST = [
  { label: 'Patients', count: 550, color: '#4DB6AC' },
  { label: 'Nurses', count: 689, color: '#009688' },
  { label: 'Doctors', count: 342, color: '#0D47A1' },
  { label: 'Receptionists', count: 156, color: '#66BB6A' },
  { label: 'Accountants', count: 87, color: '#F59E0B' },
  { label: 'Admins', count: 23, color: '#EF4444' },
]

const SYS_METRICS = [
  { label: 'CPU Usage', value: 42, color: '#009688', icon: Server },
  { label: 'Memory', value: 67, color: '#0D47A1', icon: HardDrive },
  { label: 'Disk Space', value: 38, color: '#66BB6A', icon: Database },
  { label: 'Network I/O', value: 24, color: '#F59E0B', icon: Wifi },
]

export function SuperAdminDashboard() {
  const totalUsers = ROLE_DIST.reduce((s, r) => s + r.count, 0)
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DKpi title="Total Hospitals" value="12" sub="10 active · 2 inactive" trend="+2 this quarter" up={true} data={[{ v: 8 }, { v: 9 }, { v: 9 }, { v: 10 }, { v: 11 }, { v: 11 }, { v: 12 }]} color="#0D47A1" gid="sa1" Icon={Building2} />
        <DKpi title="Total Users" value="1,847" sub="Across all facilities" trend="+124 this month" up={true} data={[{ v: 1600 }, { v: 1650 }, { v: 1690 }, { v: 1720 }, { v: 1770 }, { v: 1810 }, { v: 1847 }]} color="#009688" gid="sa2" Icon={Users} />
        <DKpi title="Active Sessions" value="284" sub="Right now" trend="+12% peak hours" up={true} data={[{ v: 180 }, { v: 210 }, { v: 195 }, { v: 240 }, { v: 270 }, { v: 260 }, { v: 284 }]} color="#0D47A1" gid="sa3" Icon={Globe} />
        <DKpi title="System Uptime" value="99.94%" sub="Last 30 days" trend="0 incidents today" up={true} data={[{ v: 99.8 }, { v: 99.9 }, { v: 99.7 }, { v: 99.9 }, { v: 100 }, { v: 99.9 }, { v: 99.94 }]} color="#66BB6A" gid="sa4" Icon={Server} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Hospital Network */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Hospital Network</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>All registered facilities</div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-xs font-medium hover:bg-[#0c3d8a] transition-colors" style={{ fontFamily: PP }}>
              <Plus size={12} /> Add Hospital
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Hospital', 'Location', 'Units', 'Staff', 'Plan', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {HOSPITALS.map(h => (
                <tr key={h.name} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Building2 size={13} className="text-[#0D47A1]" />
                      </div>
                      <span className="text-sm font-medium text-[#111827] truncate max-w-[180px]" style={{ fontFamily: RB }}>{h.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{h.city}</td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-[#111827]">{h.units}</td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-[#111827]">{h.staff}</td>
                  <td className="px-5 py-3"><Chip label={h.plan} variant={h.plan === 'Enterprise' ? 'info' : h.plan === 'Professional' ? 'teal' : 'default'} /></td>
                  <td className="px-5 py-3"><Chip label={h.status === 'active' ? 'Active' : 'Inactive'} variant={h.status === 'active' ? 'success' : 'error'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* System Health */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="System Health" sub="Real-time metrics" />
            <div className="space-y-4">
              {SYS_METRICS.map(m => (
                <div key={m.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: m.color + '15' }}>
                    <m.icon size={14} style={{ color: m.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{m.label}</span>
                      <span className="font-mono text-xs font-semibold" style={{ color: m.value > 80 ? '#EF4444' : m.color }}>{m.value}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse" />
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>All systems operational · DB: Healthy</span>
            </div>
          </div>

          {/* License */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="License Status" />
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Seats Used</span>
                <span className="font-mono text-xs font-bold text-[#0D47A1]">847 / 1,000</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#0D47A1]" style={{ width: '84.7%' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB]">
                <div className="text-[10px] text-[#64748B] mb-1" style={{ fontFamily: RB }}>Expires</div>
                <div className="text-xs font-semibold text-[#111827]" style={{ fontFamily: PP }}>Dec 31, 2025</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div className="text-[10px] text-[#0D47A1] mb-1" style={{ fontFamily: RB }}>Plan</div>
                <div className="text-xs font-semibold text-[#0D47A1]" style={{ fontFamily: PP }}>Enterprise+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: User Distribution + Audit Log */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* User Distribution */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="User Role Distribution" sub={`${totalUsers.toLocaleString()} total users`} />
          <div className="space-y-3">
            {ROLE_DIST.map(r => (
              <ProgressBar key={r.label} label={r.label} value={r.count} total={totalUsers} color={r.color} sub={`${r.count.toLocaleString()} users`} />
            ))}
          </div>
        </div>
        {/* Audit Log */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Recent Audit Events" sub="Platform activity log" action={
            <button className="text-xs text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>View All</button>
          } />
          <div>
            {SA_AUDIT.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#E5E7EB] last:border-0">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${a.type === 'system' ? 'bg-green-50' : a.type === 'role' ? 'bg-purple-50' : 'bg-blue-50'
                  }`}>
                  {a.type === 'system' && <Server size={11} className="text-[#66BB6A]" />}
                  {a.type === 'role' && <Shield size={11} className="text-violet-600" />}
                  {a.type === 'user' && <Users size={11} className="text-[#0D47A1]" />}
                  {a.type === 'settings' && <Settings size={11} className="text-[#009688]" />}
                  {a.type === 'license' && <Star size={11} className="text-[#F59E0B]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[#111827] leading-snug" style={{ fontFamily: RB }}>
                    <span className="font-semibold">{a.user}</span> — {a.action}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0" style={{ fontFamily: RB }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 02 HOSPITAL ADMIN DASHBOARD ───────────────────────────────────────────
// Section 01: Appointment Flow Today (Line Chart)
const HA_APPT_FLOW = [
  { hour: '8 AM', completed: 8 },
  { hour: '9 AM', completed: 18 },
  { hour: '10 AM', completed: 32 },
  { hour: '11 AM', completed: 48 },
  { hour: '12 PM', completed: 62 },
  { hour: '1 PM', completed: 74 },
  { hour: '2 PM', completed: 86 },
  { hour: '3 PM', completed: 104 },
  { hour: '4 PM', completed: 122 },
  { hour: '5 PM', completed: 142 },
]

// Section 02: Patient Status Distribution (Pie Chart)
const HA_STATUS_DIST = [
  { name: 'Waiting', value: 24, color: '#F59E0B' },
  { name: 'In Consultation', value: 16, color: '#009688' },
  { name: 'Completed', value: 142, color: '#66BB6A' },
  { name: 'Cancelled', value: 12, color: '#EF4444' },
]

// Section 03: Department Workload (Horizontal Bar Chart)
const HA_DEPT_WORKLOAD = [
  { dept: 'General OPD', appts: 48 },
  { dept: 'Cardiology', appts: 34 },
  { dept: 'Orthopedics', appts: 26 },
  { dept: 'Pediatrics', appts: 22 },
  { dept: 'Neurology', appts: 18 },
  { dept: 'Gynecology', appts: 16 },
]

// Section 04: Doctor Availability (Stacked Card)
const HA_DOC_AVAILABILITY = [
  { status: 'Available', count: 10, color: '#66BB6A' },
  { status: 'In Consultation', count: 6, color: '#009688' },
  { status: 'On Break', count: 2, color: '#F59E0B' },
  { status: 'Leave', count: 6, color: '#EF4444' },
]

// Section 05: Today's Appointment Timeline
const HA_TIMELINE = [
  { time: '08:00 AM', patient: 'Helen Brooks', doctor: 'Dr. Priya Sharma', dept: 'General OPD', status: 'Completed', token: 'T-001', room: 'OPD-3', stage: 'Discharged' },
  { time: '08:30 AM', patient: 'Alex Monroe', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'Completed', token: 'T-002', room: 'OPD-1', stage: 'Discharged' },
  { time: '09:00 AM', patient: 'Sarah Mitchell', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'In Consultation', token: 'T-003', room: 'OPD-1', stage: 'Doctor Review' },
  { time: '09:30 AM', patient: 'James Thornton', doctor: 'Dr. Priya Sharma', dept: 'General OPD', status: 'Waiting', token: 'T-004', room: 'Waiting Hall A', stage: 'Vitals Recorded' },
  { time: '10:00 AM', patient: 'Emma Reyes', doctor: 'Dr. Sarah Patel', dept: 'Gynecology', status: 'In Consultation', token: 'T-005', room: 'OPD-5', stage: 'Examination' },
  { time: '10:30 AM', patient: 'Robert Chen', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'Scheduled', token: 'T-006', room: 'OPD-1', stage: 'Checked In' },
  { time: '11:00 AM', patient: 'Aisha Kumar', doctor: 'Dr. Raj Kapoor', dept: 'Neurology', status: 'Scheduled', token: 'T-007', room: 'OPD-4', stage: 'Registered' },
  { time: '11:30 AM', patient: 'David Walsh', doctor: 'Dr. Chen Wei', dept: 'Orthopedics', status: 'Cancelled', token: 'T-008', room: 'N/A', stage: 'Patient Cancelled' },
]

// Section 06: Revenue Collection Summary (Donut Chart)
const HA_REVENUE_DIST = [
  { name: 'Cash', value: 8400, color: '#0D47A1' },
  { name: 'Card', value: 11200, color: '#009688' },
  { name: 'UPI', value: 4200, color: '#4DB6AC' },
  { name: 'Other', value: 1000, color: '#64748B' },
]

// Section 09: Quick Department Summary Table
const HA_DEPT_SUMMARY_TABLE = [
  { dept: 'General OPD', appts: 48, completed: 36, waiting: 8, doctors: 6, status: 'Normal' },
  { dept: 'Cardiology', appts: 34, completed: 24, waiting: 6, doctors: 4, status: 'Busy' },
  { dept: 'Orthopedics', appts: 26, completed: 18, waiting: 4, doctors: 3, status: 'Normal' },
  { dept: 'Pediatrics', appts: 22, completed: 18, waiting: 2, doctors: 3, status: 'Normal' },
  { dept: 'Neurology', appts: 18, completed: 12, waiting: 3, doctors: 2, status: 'Delayed' },
  { dept: 'Gynecology', appts: 16, completed: 14, waiting: 1, doctors: 2, status: 'Normal' },
]

const HA_STATUS_COLOR: Record<string, string> = {
  'Completed': '#66BB6A',
  'In Consultation': '#009688',
  'Waiting': '#F59E0B',
  'Scheduled': '#0D47A1',
  'Cancelled': '#EF4444',
}

const HA_QUICK_ACTIONS = [
  { label: 'View Patients', Icon: Users, color: '#0D47A1', nav: 'patients' },
  { label: 'View Queue', Icon: Clock, color: '#009688', nav: 'appointments' },
  { label: 'Appointment Management', Icon: Calendar, color: '#0D47A1', nav: 'appointments' },
  { label: 'Operational Reports', Icon: BarChart2, color: '#64748B', nav: 'reports' },
]

export function HospitalAdminDashboard() {
  const totalRevenue = HA_REVENUE_DIST.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: '#F1F5F9' }}>

      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Quick Actions</span>
        {HA_QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}>
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
        </div>
      </div>

      {/* ── KPI Row — 5 Phase 1 Operational Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi title="Today's OPD Patients" value="238" sub="Active visits today" trend="+14 vs Yesterday" up={true} data={[{ v: 195 }, { v: 205 }, { v: 210 }, { v: 218 }, { v: 224 }, { v: 230 }, { v: 238 }]} color="#0D47A1" gid="ha1" Icon={Users} />
        <DKpi title="Today's Appointments" value="142" sub="Scheduled visits" trend="+8% vs Yesterday" up={true} data={[{ v: 98 }, { v: 115 }, { v: 108 }, { v: 132 }, { v: 119 }, { v: 138 }, { v: 142 }]} color="#009688" gid="ha2" Icon={Calendar} />
        <DKpi title="Today's Revenue" value="$24.8K" sub="Gross Collections" trend="+12% vs Yesterday" up={true} data={[{ v: 18 }, { v: 21 }, { v: 19 }, { v: 24 }, { v: 22 }, { v: 23 }, { v: 24.8 }]} color="#66BB6A" gid="ha3" Icon={DollarSign} />
        <DKpi title="New Patient Registrations" value="47" sub="Registered Today" trend="+9 vs Yesterday" up={true} data={[{ v: 32 }, { v: 38 }, { v: 35 }, { v: 41 }, { v: 44 }, { v: 45 }, { v: 47 }]} color="#F59E0B" gid="ha4" Icon={UserPlus} />
        <DKpi title="Doctors Available Today" value="18 / 24" sub="Available / Total" trend="18 Active on Duty" up={true} data={[{ v: 14 }, { v: 16 }, { v: 15 }, { v: 17 }, { v: 16 }, { v: 18 }, { v: 18 }]} color="#0D47A1" gid="ha5" Icon={Stethoscope} />
      </div>

      {/* ── Analytics Grid 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 01: Appointment Flow Today (Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Appointment Flow Today</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Completed appointments movement by hour · Today (8 AM - 5 PM)</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontFamily: RB }}>Current Period: Today</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={HA_APPT_FLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(val: unknown) => [`${val} Completed`, 'Appointments']}
              />
              <Area type="monotone" dataKey="completed" stroke="#0D47A1" strokeWidth={2.5} fill="url(#flowGrad)" dot={{ r: 3, fill: '#0D47A1' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]" style={{ fontFamily: RB }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0D47A1]" /> Peak Patient Flow: 3 PM - 4 PM (18 appts/hr)
            </span>
            <span className="font-semibold text-[#111827]">Total Cumulative: 142 Completed</span>
          </div>
        </div>

        {/* Section 02: Patient Status Distribution (Pie / Donut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Patient Status Distribution" sub="Current OPD Workflow Status" />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={HA_STATUS_DIST} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Patients`, 'Count']}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                {HA_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {HA_STATUS_DIST.map(s => (
              <div key={s.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-[#64748B] text-[11px]">{s.name}</span>
                </div>
                <span className="font-bold text-[#111827]">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-center text-[#64748B]" style={{ fontFamily: RB }}>
            Period: Today · 194 Total Recorded Visits
          </div>
        </div>

      </div>

      {/* ── Analytics Grid 2 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 03: Department Workload (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Department Workload" sub="Today's Scheduled Appointments" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={HA_DEPT_WORKLOAD} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Appointments`, 'Volume']}
              />
              <Bar dataKey="appts" fill="#0D47A1" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between" style={{ fontFamily: RB }}>
            <span>Busiest: General OPD (48 appts)</span>
            <span className="font-semibold text-[#0D47A1]">164 Total Appts</span>
          </div>
        </div>

        {/* Section 04: Doctor Availability (Stacked Card) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Doctor Availability" sub="Current Staffing Overview (24 Doctors)" />
          <div className="space-y-3 my-auto">
            {HA_DOC_AVAILABILITY.map(d => {
              const pct = Math.round((d.count / 24) * 100)
              return (
                <div key={d.status}>
                  <div className="flex items-center justify-between text-xs mb-1" style={{ fontFamily: RB }}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="font-medium text-[#111827]">{d.status}</span>
                    </div>
                    <span className="font-semibold text-[#111827]">{d.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: d.color }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between" style={{ fontFamily: RB }}>
            <span>Available + In Consult: 16 Active</span>
            <span className="font-semibold text-[#66BB6A]">66.7% On Duty</span>
          </div>
        </div>

        {/* Section 06: Revenue Collection Summary (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Revenue Collection Summary" sub="Collection Method Distribution" />
          <div className="flex items-center justify-center relative py-2">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={HA_REVENUE_DIST} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                  formatter={(v: unknown) => [`$${v}`, 'Amount']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                  {HA_REVENUE_DIST.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {HA_REVENUE_DIST.map(r => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-[#64748B]">{r.name}:</span>
                <span className="font-bold text-[#111827]">${r.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs font-semibold text-center text-[#0D47A1]" style={{ fontFamily: PP }}>
            Total Gross Collections: ${totalRevenue.toLocaleString()}
          </div>
        </div>

      </div>

      {/* ── Section 05: Today's Appointment Timeline ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Appointment Timeline</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Real-time patient flow tracker · {HA_TIMELINE.length} tracked records
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ fontFamily: RB }}>
            {['Completed', 'In Consultation', 'Waiting', 'Scheduled', 'Cancelled'].map(st => (
              <div key={st} className="flex items-center gap-1 text-[#64748B]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: HA_STATUS_COLOR[st] }} />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {['Time', 'Token', 'Patient', 'Doctor', 'Department', 'Room', 'Current Stage', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {HA_TIMELINE.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{a.time}</td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-600">{a.token}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Av name={a.patient} size="sm" />
                      <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{a.patient}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{a.doctor}</td>
                  <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{a.dept}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[10px] font-semibold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">{a.room}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#111827] font-medium" style={{ fontFamily: RB }}>{a.stage}</td>
                  <td className="px-5 py-3">
                    <Chip label={a.status} variant={a.status === 'Completed' ? 'success' : a.status === 'In Consultation' ? 'teal' : a.status === 'Waiting' ? 'warning' : a.status === 'Cancelled' ? 'error' : 'info'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 09: Quick Department Summary ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Quick Department Summary</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Phase 1 OPD department status & staffing</div>
          </div>
          <button className="text-xs text-[#0D47A1] font-semibold hover:underline" style={{ fontFamily: RB }}>View Detailed Analytics →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {['Department', 'Appointments', 'Completed', 'Waiting', 'Doctors Available', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {HA_DEPT_SUMMARY_TABLE.map(d => (
              <tr key={d.dept} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-xs font-medium text-[#111827]" style={{ fontFamily: PP }}>{d.dept}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#111827]">{d.appts}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#66BB6A]">{d.completed}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#F59E0B]">{d.waiting}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#0D47A1]">{d.doctors}</td>
                <td className="px-5 py-3">
                  <Chip label={d.status} variant={d.status === 'Normal' ? 'success' : d.status === 'Busy' ? 'warning' : 'error'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// ─── 03 DOCTOR DASHBOARD (CLINICAL OPERATIONS CENTER) ─────────────────────

// Section 01: Consultation Progress Throughout the Day (Line Chart)
const DOC_HOURLY_PROGRESS = [
  { hour: '08 AM', completed: 2, remaining: 26 },
  { hour: '09 AM', completed: 5, remaining: 23 },
  { hour: '10 AM', completed: 9, remaining: 19 },
  { hour: '11 AM', completed: 14, remaining: 14 },
  { hour: '12 PM', completed: 17, remaining: 11 },
  { hour: '01 PM', completed: 18, remaining: 10 },
  { hour: '02 PM', completed: 20, remaining: 8 },
  { hour: '03 PM', completed: 23, remaining: 5 },
  { hour: '04 PM', completed: 26, remaining: 2 },
  { hour: '05 PM', completed: 28, remaining: 0 },
]

// Section 02: Patient Consultation Status (Donut Chart)
const DOC_PATIENT_STATUS_DIST = [
  { name: 'Waiting', value: 4, color: '#F59E0B' },
  { name: 'In Consultation', value: 1, color: '#009688' },
  { name: 'Completed', value: 21, color: '#66BB6A' },
  { name: 'Cancelled', value: 2, color: '#EF4444' },
]

// Section 03: Appointment Timeline (Clinical details without billing)
const DOC_APPT_TIMELINE = [
  { time: '08:30 AM', name: 'Alex Monroe', age: 45, gender: 'M', visitType: 'Follow-up Visit', room: 'OPD-1', token: 'TK-101', status: 'Completed' },
  { time: '09:00 AM', name: 'Sarah Mitchell', age: 34, gender: 'F', visitType: 'Emergency OPD', room: 'OPD-1', token: 'TK-102', status: 'In Consultation' },
  { time: '09:30 AM', name: 'James Thornton', age: 58, gender: 'M', visitType: 'General Consultation', room: 'OPD-1', token: 'TK-103', status: 'Waiting' },
  { time: '10:00 AM', name: 'Robert Chen', age: 62, gender: 'M', visitType: 'Review Visit', room: 'OPD-1', token: 'TK-104', status: 'Ready' },
  { time: '10:30 AM', name: 'Marcus Brown', age: 50, gender: 'M', visitType: 'Follow-up Visit', room: 'OPD-1', token: 'TK-105', status: 'Scheduled' },
  { time: '11:00 AM', name: 'Aisha Kumar', age: 29, gender: 'F', visitType: 'General Consultation', room: 'OPD-1', token: 'TK-106', status: 'Scheduled' },
  { time: '11:30 AM', name: 'David Walsh', age: 41, gender: 'M', visitType: 'Review Visit', room: 'N/A', token: 'TK-107', status: 'Cancelled' },
]

// Section 05: Consultation Types (Horizontal Bar Chart)
const DOC_CONSULTATION_TYPES = [
  { type: 'General Consultation', count: 12 },
  { type: 'Follow-up Visit', count: 8 },
  { type: 'Review Visit', count: 5 },
  { type: 'Emergency OPD', count: 3 },
]

// Section 06: Prescriptions Issued Today (Pie Chart)
const DOC_PRESCRIPTION_SUMMARY = [
  { category: 'New Prescription', count: 12, color: '#0D47A1' },
  { category: 'Repeat Prescription', count: 6, color: '#009688' },
  { category: 'Medication Updated', count: 4, color: '#4DB6AC' },
  { category: 'No Medication', count: 2, color: '#94A3B8' },
]





// Section 09: Today's Performance Summary (Statistics Table)
const DOC_PERFORMANCE_METRICS = [
  { metric: 'Appointments Scheduled', today: '28', yesterday: '24', status: 'Optimal' },
  { metric: 'Patients Consulted', today: '21', yesterday: '18', status: 'Ahead (+16.7%)' },
  { metric: 'Average Consultation Time', today: '14.2 mins', yesterday: '15.8 mins', status: 'Efficient (-1.6 mins)' },
  { metric: 'Prescriptions Issued', today: '22', yesterday: '19', status: 'Normal' },
  { metric: 'Follow-up Cases', today: '8', yesterday: '6', status: 'On Track' },
  { metric: 'Cancelled Consultations', today: '2', yesterday: '3', status: 'Low' },
]

const DOC_STATUS_CHIP: Record<string, 'success' | 'teal' | 'warning' | 'error' | 'info' | 'default'> = {
  'Completed': 'success',
  'In Consultation': 'teal',
  'Waiting': 'warning',
  'Ready': 'info',
  'Scheduled': 'default',
  'Cancelled': 'error',
}

const DOC_QUICK_ACTIONS = [
  { label: 'Start Consultation', Icon: Stethoscope, color: '#009688' },
  { label: 'Open Patient Record', Icon: FileText, color: '#0D47A1' },
  { label: 'Write Prescription', Icon: Pill, color: '#0D47A1' },
  { label: 'Add Clinical Note', Icon: ClipboardList, color: '#009688' },
]

export function DoctorDashboard() {
  const rxTotal = DOC_PRESCRIPTION_SUMMARY.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: '#F1F5F9' }}>

      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Clinical Actions</span>
        {DOC_QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#009688]/40 hover:text-[#009688] hover:bg-teal-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}>
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── KPI Row — 5 Clinical KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi title="Today's Appointments" value="28" sub="Scheduled Patients Today" trend="+4 vs Yesterday" up={true} data={[{ v: 22 }, { v: 25 }, { v: 23 }, { v: 27 }, { v: 24 }, { v: 26 }, { v: 28 }]} color="#0D47A1" gid="doc1" Icon={Calendar} />
        <DKpi title="Patients Consulted" value="21" sub="Completed Consultations" trend="75% Progress Today" up={true} data={[{ v: 8 }, { v: 12 }, { v: 15 }, { v: 17 }, { v: 19 }, { v: 20 }, { v: 21 }]} color="#66BB6A" gid="doc2" Icon={CheckSquare} />
        <DKpi title="Pending Consultations" value="4" sub="Remaining Queue" trend="Avg Wait: 14 mins" up={false} data={[{ v: 10 }, { v: 9 }, { v: 8 }, { v: 7 }, { v: 6 }, { v: 5 }, { v: 4 }]} color="#F59E0B" gid="doc3" Icon={Clock} />
        <DKpi title="Prescriptions Issued" value="22" sub="Today's Prescriptions" trend="+3 vs Yesterday" up={true} data={[{ v: 14 }, { v: 16 }, { v: 17 }, { v: 19 }, { v: 20 }, { v: 21 }, { v: 22 }]} color="#009688" gid="doc4" Icon={Pill} />
        <DKpi title="Consultation Revenue" value="$4,200" sub="Earnings Today" trend="+$600 vs Yesterday" up={true} data={[{ v: 2800 }, { v: 3100 }, { v: 3300 }, { v: 3600 }, { v: 3900 }, { v: 4000 }, { v: 4200 }]} color="#0D47A1" gid="doc5" Icon={DollarSign} />
      </div>

      {/* ── Active Patient Banner (Clinical Workstation) ── */}
      <div className="rounded-2xl border-2 border-[#009688]/30 p-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e6f9ff 100%)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#009688] animate-pulse" />
          <span className="text-xs font-bold text-[#009688] uppercase tracking-wide" style={{ fontFamily: PP }}>Active Patient Consultation</span>
          <span className="ml-auto font-mono text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>Started 09:00 AM · Token TK-102</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap xl:flex-nowrap">
          <Av name="Sarah Mitchell" size="lg" />
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>Sarah Mitchell</span>
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>(34 Yrs / F)</span>
            </div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Visit Type: Emergency OPD · Room: OPD-1</div>
            <div className="flex items-center gap-2 mt-2">
              <Chip label="In Consultation" variant="teal" />
              <span className="text-[11px] font-medium text-[#EF4444] bg-red-50 px-2 py-0.5 rounded border border-red-100" style={{ fontFamily: RB }}>High Risk: Acute Chest Pain</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm" style={{ fontFamily: PP }}>
              <FileText size={13} /> Clinical Notes
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm" style={{ fontFamily: PP }}>
              <Pill size={13} /> Prescribe
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#0D47A1] text-[#0D47A1] text-xs font-semibold hover:bg-blue-50 transition-colors" style={{ fontFamily: PP }}>
              <CheckSquare size={13} /> Complete Visit
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Clinical Analytics Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 01: Today's Consultation Progress (Large Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Consultation Progress Throughout the Day</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Monitors consultation pace and completed patients per hour</div>
            </div>
            <span className="text-[10px] font-semibold text-[#009688] bg-teal-50 px-2 py-0.5 rounded-full" style={{ fontFamily: RB }}>Pace: 2.8 Patients/Hour</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={DOC_HOURLY_PROGRESS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="docProgressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#009688" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#009688" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(val: unknown, name: unknown) => [
                  `${val} Patients`,
                  name === 'completed' ? 'Completed Consultations' : 'Remaining Queue'
                ]}
              />
              <Area type="monotone" dataKey="completed" stroke="#009688" strokeWidth={2.5} fill="url(#docProgressGrad)" dot={{ r: 3, fill: '#009688' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]" style={{ fontFamily: RB }}>
            <span>Target completion by 05:00 PM</span>
            <span className="font-semibold text-[#111827]">21 Completed · 4 Remaining Queue</span>
          </div>
        </div>

        {/* Section 02: Today's Patient Status (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Patient Consultation Status" sub="Current OPD Workflow Breakdown" />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={DOC_PATIENT_STATUS_DIST} layout="vertical" margin={{ top: 0, right: 15, left: 10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Patients`, 'Count']}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                {DOC_PATIENT_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {DOC_PATIENT_STATUS_DIST.map(s => (
              <div key={s.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-[#64748B] text-[11px]">{s.name}</span>
                </div>
                <span className="font-bold text-[#111827]">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-center text-[#64748B]" style={{ fontFamily: RB }}>
            28 Total Appointments Today
          </div>
        </div>

      </div>

      {/* ── Section 03 & 04: Appointment Timeline & Patient Queue Summary ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 03: Appointment Timeline (No Billing Info) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Clinical Appointment Timeline</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Doctor consultation schedule and current patient status</div>
            </div>
            <span className="text-xs font-medium text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg" style={{ fontFamily: RB }}>Room OPD-1</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-slate-50/50">
                  {['Time', 'Token', 'Patient Name', 'Age / Gender', 'Visit Type', 'Room', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DOC_APPT_TIMELINE.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{a.time}</td>
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-600">{a.token}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Av name={a.name} size="sm" />
                        <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{a.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{a.age} Yrs / {a.gender}</td>
                    <td className="px-5 py-3 text-xs text-[#111827]" style={{ fontFamily: RB }}>{a.visitType}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-[10px] font-semibold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">{a.room}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Chip label={a.status} variant={DOC_STATUS_CHIP[a.status] || 'default'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]" style={{ fontFamily: RB }}>
            <span>Showing 7 of 28 scheduled appointments</span>
            <button className="text-[#0D47A1] font-semibold hover:underline">View Full Schedule →</button>
          </div>
        </div>

        {/* Section 04: Patient Queue Summary (Reusable Card) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Patient Queue Summary" sub="Real-time OPD Live Queue" />

          <div className="space-y-3">
            {/* Current Patient */}
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
              <div className="text-[10px] font-bold text-[#009688] uppercase tracking-wider mb-1" style={{ fontFamily: PP }}>Current Patient</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Sarah Mitchell</div>
                  <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Emergency OPD · Room OPD-1</div>
                </div>
                <Chip label="In Progress" variant="teal" />
              </div>
            </div>

            {/* Next Patient */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-[10px] font-bold text-[#0D47A1] uppercase tracking-wider mb-1" style={{ fontFamily: PP }}>Next Patient</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>James Thornton</div>
                  <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Token TK-103 · General Consultation</div>
                </div>
                <Chip label="Waiting" variant="warning" />
              </div>
            </div>

            {/* Queue Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>Remaining Queue</div>
                <div className="text-base font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>4</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>Avg Wait Time</div>
                <div className="text-base font-bold text-[#F59E0B] mt-0.5" style={{ fontFamily: PP }}>14 m</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>Est. Completion</div>
                <div className="text-base font-bold text-[#009688] mt-0.5" style={{ fontFamily: PP }}>04:45 PM</div>
              </div>
            </div>
          </div>

          <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm" style={{ fontFamily: PP }}>
            <Stethoscope size={13} /> Call Next Patient (TK-103)
          </button>
        </div>

      </div>

      {/* ── Section 05 & 06: Consultation Categories & Prescription Summary ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Section 05: Today's Consultation Categories (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Consultation Types" sub="Today's Workload Distribution by Category" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={DOC_CONSULTATION_TYPES} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={130} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Patients`, 'Volume']}
              />
              <Bar dataKey="count" fill="#0D47A1" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 pt-3 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between" style={{ fontFamily: RB }}>
            <span>Most Common: General Consultation (12)</span>
            <span className="font-semibold text-[#0D47A1]">28 Total Consultations</span>
          </div>
        </div>

        {/* Section 06: Prescription Summary (Pie Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Prescriptions Issued Today" sub="Summary of Today's Prescription Activity" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={DOC_PRESCRIPTION_SUMMARY} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Prescriptions`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                {DOC_PRESCRIPTION_SUMMARY.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {DOC_PRESCRIPTION_SUMMARY.map(p => (
              <div key={p.category} className="flex items-center justify-between">
                <span className="text-[#64748B] text-[11px]">{p.category}:</span>
                <span className="font-bold text-[#111827]">{p.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs font-semibold text-center text-[#009688]" style={{ fontFamily: PP }}>
            Total Prescriptions Issued: {rxTotal}
          </div>
        </div>

      </div>

      {/* ── Section 09: Today's Performance Summary ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Clinical Performance Summary</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Doctor efficiency & daily consultation statistics</div>
          </div>
          <button className="text-xs text-[#0D47A1] font-semibold hover:underline" style={{ fontFamily: RB }}>Export Summary Report →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {['Metric', 'Today', 'Yesterday', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DOC_PERFORMANCE_METRICS.map(m => (
              <tr key={m.metric} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-xs font-medium text-[#111827]" style={{ fontFamily: PP }}>{m.metric}</td>
                <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{m.today}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#64748B]">{m.yesterday}</td>
                <td className="px-5 py-3">
                  <Chip label={m.status} variant={m.status.includes('Ahead') || m.status.includes('Efficient') ? 'success' : m.status.includes('Low') ? 'info' : 'default'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// ─── 04 RECEPTION DASHBOARD (FRONT DESK OPERATIONS CENTER) ─────────────────

// Section 01: Patient Registration Trend (Large Line Chart)
const REC_REGISTRATION_TREND = [
  { hour: '08 AM', registered: 4, walkins: 2 },
  { hour: '09 AM', registered: 9, walkins: 5 },
  { hour: '10 AM', registered: 15, walkins: 8 },
  { hour: '11 AM', registered: 22, walkins: 11 },
  { hour: '12 PM', registered: 27, walkins: 14 },
  { hour: '01 PM', registered: 30, walkins: 15 },
  { hour: '02 PM', registered: 33, walkins: 17 },
  { hour: '03 PM', registered: 35, walkins: 18 },
  { hour: '04 PM', registered: 37, walkins: 19 },
  { hour: '05 PM', registered: 38, walkins: 20 },
]

// Section 02: Today's Appointment Status (Donut Chart)
const REC_APPT_STATUS_DIST = [
  { name: 'Scheduled', value: 45, color: '#0D47A1' },
  { name: 'Checked In', value: 89, color: '#4DB6AC' },
  { name: 'Completed', value: 48, color: '#66BB6A' },
  { name: 'Cancelled', value: 8, color: '#EF4444' },
  { name: 'No Show', value: 4, color: '#F59E0B' },
]

// Section 03: Current Patient Queue
const REC_FRONTDESK_QUEUE = [
  { token: 'TK-084', name: 'Helen Brooks', doctor: 'Dr. Priya Sharma', dept: 'General OPD', time: '08:00 AM', pos: 'Q-01', status: 'Completed' },
  { token: 'TK-085', name: 'Alex Monroe', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', time: '08:30 AM', pos: 'Q-02', status: 'Completed' },
  { token: 'TK-086', name: 'Sarah Mitchell', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', time: '09:00 AM', pos: 'Q-03', status: 'In Consultation' },
  { token: 'TK-087', name: 'James Thornton', doctor: 'Dr. Priya Sharma', dept: 'General OPD', time: '09:15 AM', pos: 'Q-04', status: 'Waiting' },
  { token: 'TK-088', name: 'Emma Reyes', doctor: 'Dr. Sunita Patel', dept: 'Gynecology', time: '09:30 AM', pos: 'Q-05', status: 'Checked In' },
  { token: 'TK-089', name: 'Robert Chen', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', time: '10:00 AM', pos: 'Q-06', status: 'Ready' },
  { token: 'TK-090', name: 'Aisha Kumar', doctor: 'Dr. Rajesh Kapoor', dept: 'Neurology', time: '10:15 AM', pos: 'Q-07', status: 'Scheduled' },
  { token: 'TK-091', name: 'David Walsh', doctor: 'Dr. Chen Wei', dept: 'Orthopedics', time: '10:30 AM', pos: 'N/A', status: 'Cancelled' },
]

// Section 04: Doctor Availability (Summary Cards)
const REC_DOCTOR_AVAILABILITY = [
  { name: 'Dr. Priya Sharma', dept: 'General OPD', status: 'Available', color: '#66BB6A' },
  { name: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'In Consultation', color: '#009688' },
  { name: 'Dr. Sunita Patel', dept: 'Gynecology', status: 'Available', color: '#66BB6A' },
  { name: 'Dr. Rajesh Kapoor', dept: 'Neurology', status: 'Unavailable', color: '#EF4444' },
]

// Section 05: Department Patient Distribution (Horizontal Bar Chart)
const REC_DEPT_DISTRIBUTION = [
  { dept: 'General OPD', count: 48 },
  { dept: 'Cardiology', count: 34 },
  { dept: 'Orthopedics', count: 26 },
  { dept: 'Pediatrics', count: 22 },
  { dept: 'Neurology', count: 18 },
  { dept: 'Gynecology', count: 16 },
]

// Section 06: Registration Categories (Pie Chart)
const REC_REGISTRATION_TYPES = [
  { category: 'New Patient', count: 18, color: '#0D47A1' },
  { category: 'Returning Patient', count: 12, color: '#009688' },
  { category: 'Walk-In', count: 6, color: '#4DB6AC' },
  { category: 'Follow-Up', count: 2, color: '#F59E0B' },
]

// Section 09: Reception Performance Summary (Statistics Table)
const REC_PERFORMANCE_METRICS = [
  { metric: 'Patients Registered', today: '38', yesterday: '32', status: 'Optimal (+18.7%)' },
  { metric: 'Appointments Booked', today: '142', yesterday: '130', status: 'Ahead (+9.2%)' },
  { metric: 'Patients Checked In', today: '89', yesterday: '79', status: 'Normal' },
  { metric: 'Appointments Rescheduled', today: '6', yesterday: '8', status: 'Reduced (-25%)' },
  { metric: 'Billing Initiated', today: '45', yesterday: '38', status: 'Efficient' },
  { metric: 'Cancelled Appointments', today: '8', yesterday: '10', status: 'Low' },
]

const REC_STATUS_CHIP: Record<string, 'success' | 'teal' | 'warning' | 'error' | 'info' | 'default'> = {
  'Completed': 'success',
  'In Consultation': 'teal',
  'Waiting': 'warning',
  'Checked In': 'info',
  'Ready': 'info',
  'Scheduled': 'default',
  'Cancelled': 'error',
}

// Quick Actions strictly aligned with requirements
const REC_QUICK_ACTIONS = [
  { label: 'Register Patient', Icon: UserPlus, color: '#0D47A1', action: 'register' },
  { label: 'Book Appointment', Icon: Calendar, color: '#009688', action: 'appointment' },
  { label: 'Check Patient In', Icon: CheckSquare, color: '#4DB6AC', action: 'checkin' },
  { label: 'View Queue', Icon: Clock, color: '#F59E0B', action: 'queue' },
  { label: 'Start Billing', Icon: CreditCard, color: '#0D47A1', action: 'billing' },
  { label: 'Search Patient', Icon: Search, color: '#64748B', action: 'search' },
]

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
  onCheckInClick?: (token?: string, mrn?: string) => void
  userRole?: string
  onNavigateNav?: (nav: string) => void
  onPatientSelect?: (mrn: string) => void
  onEditPatient?: (mrn: string) => void
  onCreateInvoiceClick?: () => void
}) {
  const regTotal = REC_REGISTRATION_TYPES.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: '#F1F5F9' }}>

      {/* ── QUICK ACTIONS ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Front Desk Quick Actions ({userRole})</span>
        {REC_QUICK_ACTIONS.map(({ label, Icon, color, action }) => (
          <button
            key={label}
            onClick={() => {
              if (action === 'register' && onRegisterPatient) onRegisterPatient()
              else if (action === 'search' && onPatientSearch) onPatientSearch()
              else if (action === 'billing' && onCreateInvoiceClick) onCreateInvoiceClick()
              else if (action === 'billing' && onNavigateNav) onNavigateNav('billing')
              else if (action === 'appointment' && onNavigateNav) onNavigateNav('appointments')
              else if (action === 'queue' && onNavigateNav) onNavigateNav('checkin')
              else if (action === 'checkin' && onNavigateNav) onNavigateNav('checkin')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}>
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
        </div>
      </div>

      {/* ── KPI Row — 5 Reception KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi title="Today's Registrations" value="38" sub="New Patients Registered Today" trend="+14% vs Yesterday" up={true} data={[{ v: 24 }, { v: 28 }, { v: 31 }, { v: 35 }, { v: 32 }, { v: 38 }]} color="#0D47A1" gid="rec1" Icon={UserPlus} />
        <DKpi title="Today's Appointments" value="142" sub="Appointments Scheduled Today" trend="63% Completion Progress" up={true} data={[{ v: 110 }, { v: 125 }, { v: 130 }, { v: 128 }, { v: 138 }, { v: 142 }]} color="#009688" gid="rec2" Icon={Calendar} />
        <DKpi title="Patients Waiting" value="18" sub="Current Waiting Queue" trend="Avg Wait: 14 mins" up={false} data={[{ v: 12 }, { v: 15 }, { v: 22 }, { v: 19 }, { v: 21 }, { v: 18 }]} color="#F59E0B" gid="rec3" Icon={Clock} />
        <DKpi title="Billing Pending" value="12" sub="Patients Waiting for Billing" trend="-3 vs Yesterday" up={true} data={[{ v: 18 }, { v: 15 }, { v: 14 }, { v: 16 }, { v: 13 }, { v: 12 }]} color="#EF4444" gid="rec4" Icon={CreditCard} />
        <DKpi title="Check-ins Completed" value="89" sub="Patients Successfully Checked In" trend="Today's Progress" up={true} data={[{ v: 50 }, { v: 62 }, { v: 71 }, { v: 79 }, { v: 84 }, { v: 89 }]} color="#4DB6AC" gid="rec5" Icon={CheckSquare} />
      </div>

      {/* ── Section 01 & 02: Registration Trend & Appointment Status ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 01: Patient Registration Trend (Large Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Patient Registrations Throughout the Day</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Shows new patient registrations by hour (08 AM - 05 PM)</div>
            </div>
            <span className="text-[10px] font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontFamily: RB }}>Today: 38 Registrations</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={REC_REGISTRATION_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="recRegGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(val: unknown, name: unknown) => [
                  `${val} Patients`,
                  name === 'registered' ? 'Registered Patients' : 'Walk-in Patients'
                ]}
              />
              <Area type="monotone" dataKey="registered" stroke="#0D47A1" strokeWidth={2.5} fill="url(#recRegGrad)" dot={{ r: 3, fill: '#0D47A1' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]" style={{ fontFamily: RB }}>
            <span>Workload Peak: 11 AM - 12 PM (7 registrations/hr)</span>
            <span className="font-semibold text-[#111827]">38 Registered Patients Today</span>
          </div>
        </div>

        {/* Section 02: Appointment Status (Donut / Status Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Today's Appointment Status" sub="Current Appointment Progress" />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={REC_APPT_STATUS_DIST} layout="vertical" margin={{ top: 0, right: 15, left: 10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Patients`, 'Count']}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={13}>
                {REC_APPT_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-3 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {REC_APPT_STATUS_DIST.map(s => (
              <div key={s.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-[#64748B] text-[11px]">{s.name}</span>
                </div>
                <span className="font-bold text-[#111827]">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-center text-[#64748B]" style={{ fontFamily: RB }}>
            194 Total Appointments Scheduled Today
          </div>
        </div>

      </div>

      {/* ── Section 03: Current Patient Queue Table ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Current Patient Queue</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Monitor current front desk queue and patient arrivals</div>
          </div>
          <span className="text-xs font-semibold text-[#009688] bg-teal-50 px-2.5 py-1 rounded-lg" style={{ fontFamily: RB }}>18 Patients Waiting</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {['Token', 'Patient Name', 'Doctor', 'Department', 'Appt Time', 'Queue Position', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {REC_FRONTDESK_QUEUE.map((q, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{q.token}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Av name={q.name} size="sm" />
                      <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{q.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{q.doctor}</td>
                  <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{q.dept}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{q.time}</td>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#009688]">{q.pos}</td>
                  <td className="px-5 py-3">
                    <Chip label={q.status} variant={REC_STATUS_CHIP[q.status] || 'default'} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {q.status === 'Scheduled' ? (
                        <button
                          onClick={() => onCheckInClick?.(q.token, 'MRN-REG')}
                          className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                          style={{ fontFamily: PP }}
                        >
                          Check-In
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Logged</span>
                      )}
                      <button
                        onClick={() => onPatientSelect?.('MRN-892101')}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEditPatient?.('MRN-892101')}
                        className="px-2 py-1 rounded-lg border border-[#E5E7EB] text-slate-600 text-[11px] font-medium hover:bg-slate-50 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 04, 05 & 06: Doctor Availability & Distribution & Registration Categories ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 04: Doctor Availability (Summary Cards) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Doctor Availability" sub="Help Reception Assign Appointments Efficiently" />
          <div className="space-y-2.5 my-auto">
            {REC_DOCTOR_AVAILABILITY.map(d => (
              <div key={d.name} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50">
                <div>
                  <div className="text-xs font-semibold text-[#111827]" style={{ fontFamily: PP }}>{d.name}</div>
                  <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>{d.dept}</div>
                </div>
                <Chip label={d.status} variant={d.status === 'Available' ? 'success' : d.status === 'In Consultation' ? 'teal' : 'error'} />
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 text-xs text-[#64748B] text-center" style={{ fontFamily: RB }}>
            Real-time Roster Status
          </div>
        </div>

        {/* Section 05: Department Patient Distribution (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Patients by Department" sub="Today's Registered Patient Distribution" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={REC_DEPT_DISTRIBUTION} layout="vertical" margin={{ top: 0, right: 20, left: 15, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Patients`, 'Volume']}
              />
              <Bar dataKey="count" fill="#0D47A1" radius={[0, 4, 4, 0]} barSize={13} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 pt-2 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between" style={{ fontFamily: RB }}>
            <span>Busiest: General OPD (48)</span>
            <span className="font-semibold text-[#0D47A1]">164 Total Patients</span>
          </div>
        </div>

        {/* Section 06: Registration Category Summary (Pie Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Registration Categories" sub="Understand Registration Mix Today" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={REC_REGISTRATION_TYPES} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Registrations`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                {REC_REGISTRATION_TYPES.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {REC_REGISTRATION_TYPES.map(r => (
              <div key={r.category} className="flex items-center justify-between">
                <span className="text-[#64748B] text-[11px]">{r.category}:</span>
                <span className="font-bold text-[#111827]">{r.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs font-semibold text-center text-[#0D47A1]" style={{ fontFamily: PP }}>
            Total Registrations: {regTotal}
          </div>
        </div>

      </div>

      {/* ── Section 09: Reception Performance Summary ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Reception Performance Summary</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Front desk operational statistics and daily efficiency metrics</div>
          </div>
          <button className="text-xs text-[#0D47A1] font-semibold hover:underline" style={{ fontFamily: RB }}>Export Operational Summary →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {['Metric', 'Today', 'Yesterday', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {REC_PERFORMANCE_METRICS.map(m => (
              <tr key={m.metric} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-xs font-medium text-[#111827]" style={{ fontFamily: PP }}>{m.metric}</td>
                <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{m.today}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#64748B]">{m.yesterday}</td>
                <td className="px-5 py-3">
                  <Chip label={m.status} variant={m.status.includes('Ahead') || m.status.includes('Optimal') || m.status.includes('Efficient') ? 'success' : m.status.includes('Low') ? 'info' : 'default'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// ─── 05 NURSE DASHBOARD (CLINICAL SUPPORT OPERATIONS CENTER) ─────────────

// Section 01: Vitals Recording Progress (Large Line Chart)
const NURSE_VITALS_PROGRESS = [
  { hour: '08 AM', assisted: 5 },
  { hour: '09 AM', assisted: 12 },
  { hour: '10 AM', assisted: 18 },
  { hour: '11 AM', assisted: 25 },
  { hour: '12 PM', assisted: 31 },
  { hour: '01 PM', assisted: 36 },
  { hour: '02 PM', assisted: 42 },
  { hour: '03 PM', assisted: 47 },
  { hour: '04 PM', assisted: 51 },
  { hour: '05 PM', assisted: 54 },
]

// Section 02: Patient Preparation Status (Donut Chart)
const NURSE_PREP_STATUS_DIST = [
  { name: 'Waiting for Vitals', value: 8, color: '#F59E0B' },
  { name: 'Vitals Completed', value: 14, color: '#009688' },
  { name: 'Ready for Consultation', value: 18, color: '#0D47A1' },
  { name: 'Consultation Completed', value: 24, color: '#66BB6A' },
]

// Section 03: Current Nursing Queue Table
const NURSE_QUEUES = [
  { token: 'T-101', patient: 'Sarah Mitchell', doctor: 'Dr. A. Mehta', dept: 'Cardiology', apptTime: '09:15 AM', vitalsStatus: 'Completed', consultStatus: 'Ready', priority: 'High' },
  { token: 'T-102', patient: 'James Thornton', doctor: 'Dr. P. Sharma', dept: 'General OPD', apptTime: '09:30 AM', vitalsStatus: 'Waiting', consultStatus: 'Waiting', priority: 'Normal' },
  { token: 'T-103', patient: 'Emma Reyes', doctor: 'Dr. R. Kapoor', dept: 'Pediatrics', apptTime: '09:45 AM', vitalsStatus: 'Completed', consultStatus: 'Vitals Completed', priority: 'Normal' },
  { token: 'T-104', patient: 'Robert Chen', doctor: 'Dr. A. Mehta', dept: 'Cardiology', apptTime: '10:00 AM', vitalsStatus: 'Waiting', consultStatus: 'Waiting', priority: 'High' },
  { token: 'T-105', patient: 'Aisha Kumar', doctor: 'Dr. S. Nair', dept: 'Gynecology', apptTime: '10:15 AM', vitalsStatus: 'Completed', consultStatus: 'Ready', priority: 'Normal' },
  { token: 'T-106', patient: 'Marcus Brown', doctor: 'Dr. V. Rao', dept: 'Orthopedics', apptTime: '10:30 AM', vitalsStatus: 'Completed', consultStatus: 'Completed', priority: 'Normal' },
  { token: 'T-107', patient: 'Nina Patel', doctor: 'Dr. K. Verma', dept: 'Neurology', apptTime: '10:45 AM', vitalsStatus: 'Waiting', consultStatus: 'Waiting', priority: 'Normal' },
]

// Section 05: Patient Distribution by Department (Horizontal Bar Chart)
const NURSE_DEPT_DIST = [
  { department: 'General OPD', assisted: 18 },
  { department: 'Cardiology', assisted: 14 },
  { department: 'Orthopedics', assisted: 10 },
  { department: 'Pediatrics', assisted: 8 },
  { department: 'Neurology', assisted: 5 },
  { department: 'Gynecology', assisted: 9 },
]

// Section 06: Vitals Completion Summary (Pie / Bar Chart)
const NURSE_VITALS_STATUS_DIST = [
  { name: 'Completed', count: 42, color: '#66BB6A' },
  { name: 'Pending', count: 8, color: '#F59E0B' },
  { name: 'Delayed', count: 3, color: '#EF4444' },
  { name: 'Not Required', count: 5, color: '#64748B' },
]

// Section 09: Today's Nursing Performance (Statistics Table)
const NURSE_PERFORMANCE_METRICS = [
  { metric: 'Patients Assisted', today: '64', yesterday: '58', status: 'Ahead (+10.3%)' },
  { metric: 'Vitals Recorded', today: '54', yesterday: '49', status: 'Optimal (+10.2%)' },
  { metric: 'Patients Prepared', today: '48', yesterday: '44', status: 'Ahead (+9.1%)' },
  { metric: 'Doctor Assistance', today: '36', yesterday: '32', status: 'High (+12.5%)' },
  { metric: 'Average Preparation Time', today: '6.5 min', yesterday: '7.2 min', status: 'Faster (-9.7%)' },
  { metric: 'Completed Tasks', today: '52', yesterday: '46', status: 'Optimal (+13.0%)' },
]

const NURSE_STATUS_CHIP: Record<string, 'success' | 'warning' | 'info' | 'error' | 'teal' | 'default'> = {
  'Completed': 'success',
  'Ready': 'teal',
  'Vitals Completed': 'info',
  'Waiting': 'warning',
  'High': 'error',
  'Normal': 'default',
}

const NURSE_QUICK_ACTIONS = [
  { label: 'Record Vitals', Icon: Activity, color: '#009688', action: 'vitals' },
  { label: 'View Patient Queue', Icon: Users, color: '#0D47A1', action: 'queue' },
  { label: 'Prepare Patient', Icon: UserPlus, color: '#4DB6AC', action: 'prep' },
  { label: 'Assist Consultation', Icon: Stethoscope, color: '#66BB6A', action: 'assist' },
  { label: 'Search Patient', Icon: Search, color: '#64748B', action: 'search' },
  { label: 'View Assigned Patients', Icon: ClipboardList, color: '#F59E0B', action: 'assigned' },
]

export function NurseDashboard({
  onRecordVitalsClick,
  onViewQueueClick,
  onNavigateNav,
}: {
  onRecordVitalsClick?: () => void
  onViewQueueClick?: () => void
  onNavigateNav?: (nav: string) => void
}) {
  const totalPrepPatients = NURSE_PREP_STATUS_DIST.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: '#F1F5F9' }}>

      {/* ── HEADER & QUICK ACTIONS ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Clinical Support Quick Actions</span>
        {NURSE_QUICK_ACTIONS.map(({ label, Icon, color, action }) => (
          <button
            key={label}
            onClick={() => {
              if (action === 'vitals' && onRecordVitalsClick) onRecordVitalsClick()
              else if (action === 'queue' && onViewQueueClick) onViewQueueClick()
              else if (action === 'vitals' && onNavigateNav) onNavigateNav('patient-queue')
              else if (action === 'queue' && onNavigateNav) onNavigateNav('patient-queue')
              else if (action === 'prep' && onNavigateNav) onNavigateNav('patient-queue')
              else if (action === 'assist' && onNavigateNav) onNavigateNav('appointments')
              else if (action === 'search' && onNavigateNav) onNavigateNav('patient-search')
              else if (action === 'assigned' && onNavigateNav) onNavigateNav('patients')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}>
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── KPI Row — 5 Clinical Support KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi title="Patients Assigned Today" value="64" sub="Assigned for Nursing Assistance" trend="+8.5% vs Yesterday" up={true} data={[{ v: 48 }, { v: 52 }, { v: 55 }, { v: 58 }, { v: 60 }, { v: 64 }]} color="#0D47A1" gid="nr1" Icon={Users} />
        <DKpi title="Vitals Recorded" value="54" sub="Completed Vital Signs" trend="84.4% Today's Progress" up={true} data={[{ v: 35 }, { v: 40 }, { v: 42 }, { v: 48 }, { v: 50 }, { v: 54 }]} color="#009688" gid="nr2" Icon={Activity} />
        <DKpi title="Waiting for Vitals" value="8" sub="Pending Nursing Assessment" trend="Current Queue Count" up={false} data={[{ v: 14 }, { v: 12 }, { v: 11 }, { v: 10 }, { v: 9 }, { v: 8 }]} color="#F59E0B" gid="nr3" Icon={Clock} />
        <DKpi title="Doctor Assistance" value="36" sub="Consultations Assisted Today" trend="92.3% Completion Rate" up={true} data={[{ v: 22 }, { v: 26 }, { v: 28 }, { v: 31 }, { v: 34 }, { v: 36 }]} color="#66BB6A" gid="nr4" Icon={Stethoscope} />
        <DKpi title="Completed Nursing Tasks" value="52" sub="Daily Nursing Activities" trend="89.6% Progress" up={true} data={[{ v: 30 }, { v: 36 }, { v: 40 }, { v: 44 }, { v: 48 }, { v: 52 }]} color="#4DB6AC" gid="nr5" Icon={CheckSquare} />
      </div>

      {/* ── Main Clinical Operations Grid 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 01: Vitals Recording Progress (Large Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Vitals Recorded Throughout the Day</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Monitors hourly patient vital recordings (08 AM - 05 PM)</div>
            </div>
            <span className="text-[10px] font-semibold text-[#009688] bg-teal-50 px-2 py-0.5 rounded-full" style={{ fontFamily: RB }}>Completed: 54 Vitals</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={NURSE_VITALS_PROGRESS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="nurseVitalsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#009688" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#009688" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(val: unknown) => [`${val} Patients`, 'Completed Vitals']}
              />
              <Area type="monotone" dataKey="assisted" stroke="#009688" strokeWidth={2.5} fill="url(#nurseVitalsGrad)" dot={{ r: 3, fill: '#009688' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]" style={{ fontFamily: RB }}>
            <span>Peak Nursing Workload: 10 AM - 11 AM (13 Vitals Processed)</span>
            <span className="font-semibold text-[#111827]">54 Total Recorded</span>
          </div>
        </div>

        {/* Section 02: Patient Preparation Status (Donut / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Patient Preparation Status" sub="Quick Understanding of Patient Readiness" />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={NURSE_PREP_STATUS_DIST} layout="vertical" margin={{ top: 0, right: 15, left: 10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={115} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Patients`, 'Count']}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={13}>
                {NURSE_PREP_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-3 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {NURSE_PREP_STATUS_DIST.map(m => (
              <div key={m.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                  <span className="text-[#64748B] text-[10px]">{m.name}</span>
                </div>
                <span className="font-bold text-[#111827]">{m.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-center text-[#64748B]" style={{ fontFamily: RB }}>
            Total Patients in Pipeline: {totalPrepPatients}
          </div>
        </div>

      </div>

      {/* ── Section 03: Current Nursing Queue Table ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Current Nursing Queue</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Monitor patients requiring vital recording and consultation support</div>
          </div>
          <span className="text-xs font-semibold text-[#009688] bg-teal-50 px-2.5 py-1 rounded-lg" style={{ fontFamily: RB }}>8 Waiting for Vitals</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {['Token', 'Patient Name', 'Assigned Doctor', 'Department', 'Appointment Time', 'Vitals Status', 'Consultation Status', 'Priority'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {NURSE_QUEUES.map((q, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{q.token}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Av name={q.patient} size="sm" />
                      <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{q.patient}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#111827]" style={{ fontFamily: RB }}>{q.doctor}</td>
                  <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{q.dept}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{q.apptTime}</td>
                  <td className="px-5 py-3">
                    <Chip label={q.vitalsStatus} variant={NURSE_STATUS_CHIP[q.vitalsStatus] || 'default'} />
                  </td>
                  <td className="px-5 py-3">
                    <Chip label={q.consultStatus} variant={NURSE_STATUS_CHIP[q.consultStatus] || 'default'} />
                  </td>
                  <td className="px-5 py-3">
                    <Chip label={q.priority} variant={NURSE_STATUS_CHIP[q.priority] || 'default'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 04, 05 & 06: Doctor Assistance, Dept Distribution & Vitals Summary ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 04: Doctor Assistance Summary (Reusable Summary Cards) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Doctor Assistance Summary" sub="Real-time Nursing Support Metrics" />
          <div className="space-y-3 my-auto">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-blue-100 bg-blue-50/50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Doctors Assisted Today</span>
              <span className="text-sm font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>8 Doctors</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-teal-100 bg-teal-50/50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Patients Prepared</span>
              <span className="text-sm font-bold text-[#009688]" style={{ fontFamily: PP }}>48 Patients</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Average Preparation Time</span>
              <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>6.5 Mins</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-green-100 bg-green-50/50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Current Active Consultations</span>
              <span className="text-sm font-bold text-[#66BB6A]" style={{ fontFamily: PP }}>12 Active</span>
            </div>
          </div>
          <div className="mt-3 pt-2 text-xs text-[#64748B] text-center" style={{ fontFamily: RB }}>
            Optimal nursing support flow across OPD consultations
          </div>
        </div>

        {/* Section 05: Patient Distribution by Department (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Patients Assisted by Dept" sub="Nursing Workload Distribution" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={NURSE_DEPT_DIST} layout="vertical" margin={{ top: 0, right: 20, left: 15, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="department" type="category" tick={{ fontSize: 10, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={85} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Patients`, 'Assisted']}
              />
              <Bar dataKey="assisted" fill="#0D47A1" radius={[0, 4, 4, 0]} barSize={13} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 pt-2 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between" style={{ fontFamily: RB }}>
            <span>Highest Workload: General OPD</span>
            <span className="font-semibold text-[#0D47A1]">64 Total Assisted</span>
          </div>
        </div>

        {/* Section 06: Vitals Completion Summary (Pie / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Vitals Recording Status" sub="Quick Overview of Vitals Task Completion" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={NURSE_VITALS_STATUS_DIST} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Patients`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                {NURSE_VITALS_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {NURSE_VITALS_STATUS_DIST.map(r => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-[#64748B] text-[11px]">{r.name}:</span>
                <span className="font-bold text-[#111827]">{r.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs font-semibold text-center text-[#009688]" style={{ fontFamily: PP }}>
            Total Vitals Logged Today: 58
          </div>
        </div>

      </div>

      {/* ── Section 09: Today's Nursing Performance ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Nursing Performance</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Clinical support operations & vitals assessment metrics</div>
          </div>
          <button className="text-xs text-[#0D47A1] font-semibold hover:underline" style={{ fontFamily: RB }}>Export Nursing Summary →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {['Metric', 'Today', 'Yesterday', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {NURSE_PERFORMANCE_METRICS.map(m => (
              <tr key={m.metric} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-xs font-medium text-[#111827]" style={{ fontFamily: PP }}>{m.metric}</td>
                <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{m.today}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#64748B]">{m.yesterday}</td>
                <td className="px-5 py-3">
                  <Chip label={m.status} variant={m.status.includes('Ahead') || m.status.includes('Optimal') || m.status.includes('High') || m.status.includes('Faster') ? 'success' : 'warning'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// ─── 06 ACCOUNTANT DASHBOARD (FINANCIAL OPERATIONS CENTER) ────────────────
// Section 01: Revenue Collection Trend (Large Line Chart)
const ACC_REVENUE_TREND = [
  { hour: '08 AM', revenue: 1250, invoices: 4 },
  { hour: '09 AM', revenue: 3400, invoices: 9 },
  { hour: '10 AM', revenue: 6200, invoices: 15 },
  { hour: '11 AM', revenue: 9800, invoices: 22 },
  { hour: '12 PM', revenue: 14500, invoices: 31 },
  { hour: '01 PM', revenue: 17200, invoices: 36 },
  { hour: '02 PM', revenue: 20800, invoices: 42 },
  { hour: '03 PM', revenue: 23500, invoices: 48 },
  { hour: '04 PM', revenue: 26100, invoices: 53 },
  { hour: '05 PM', revenue: 28450, invoices: 58 },
]

// Section 02: Payment Method Distribution (Donut Chart)
const ACC_PAYMENT_METHODS_DIST = [
  { name: 'Cash', value: 8400, color: '#009688' },
  { name: 'Card', value: 11650, color: '#0D47A1' },
  { name: 'UPI', value: 5800, color: '#4DB6AC' },
  { name: 'Bank Transfer', value: 2200, color: '#66BB6A' },
  { name: 'Other', value: 400, color: '#F59E0B' },
]

// Section 03: Today's Billing Transactions Table
const ACC_BILLING_TRANSACTIONS = [
  { invoice: 'INV-847', patient: 'Sarah Mitchell', type: 'Consultation Fee', amount: 488.00, method: 'Card', status: 'Paid', time: '09:20 AM' },
  { invoice: 'INV-848', patient: 'James Thornton', type: 'Registration Fee', amount: 228.00, method: 'Cash', status: 'Pending', time: '09:45 AM' },
  { invoice: 'INV-849', patient: 'Emma Reyes', type: 'Follow-up Consultation', amount: 320.00, method: 'UPI', status: 'Paid', time: '10:12 AM' },
  { invoice: 'INV-850', patient: 'Robert Chen', type: 'Consultation Fee', amount: 395.00, method: 'Card', status: 'Partial', time: '10:30 AM' },
  { invoice: 'INV-851', patient: 'Marcus Brown', type: 'Other Charges', amount: 175.00, method: 'Cash', status: 'Paid', time: '11:00 AM' },
  { invoice: 'INV-852', patient: 'Aisha Kumar', type: 'Consultation Fee', amount: 290.00, method: 'Bank Transfer', status: 'Paid', time: '11:15 AM' },
  { invoice: 'INV-853', patient: 'David Walsh', type: 'Registration Fee', amount: 150.00, method: 'None', status: 'Cancelled', time: '11:40 AM' },
]

// Section 05: Revenue by Billing Category (Horizontal Bar Chart)
const ACC_REVENUE_CATEGORIES = [
  { category: 'Consultation Fee', amount: 14850 },
  { category: 'Registration Fee', amount: 6240 },
  { category: 'Follow-up Consultation', amount: 5120 },
  { category: 'Other Charges', amount: 2240 },
]

// Section 06: Invoice Status Distribution (Pie / Bar Chart)
const ACC_INVOICE_STATUS_DIST = [
  { name: 'Paid', count: 42, color: '#66BB6A' },
  { name: 'Pending', count: 12, color: '#F59E0B' },
  { name: 'Partial', count: 3, color: '#0D47A1' },
  { name: 'Cancelled', count: 1, color: '#EF4444' },
]

// Section 09: Today's Financial Summary (Statistics Table)
const ACC_FINANCIAL_SUMMARY_METRICS = [
  { metric: 'Invoices Generated', today: '58', yesterday: '52', status: 'Optimal (+11.5%)' },
  { metric: 'Payments Received', today: '45', yesterday: '41', status: 'Ahead (+9.7%)' },
  { metric: 'Pending Bills', today: '12', yesterday: '15', status: 'Reduced (-20.0%)' },
  { metric: 'Collected Revenue', today: '$28,450.00', yesterday: '$25,120.00', status: 'High (+13.2%)' },
  { metric: 'Refund Requests', today: '3', yesterday: '2', status: 'Under Review' },
  { metric: 'Cancelled Bills', today: '1', yesterday: '2', status: 'Low' },
]

const ACC_TRANSACTION_STATUS_CHIP: Record<string, 'success' | 'warning' | 'info' | 'error' | 'teal' | 'default'> = {
  'Paid': 'success',
  'Pending': 'warning',
  'Partial': 'info',
  'Cancelled': 'error',
}

// Quick Actions strictly aligned with requirements
const ACC_QUICK_ACTIONS = [
  { label: 'Create Invoice', Icon: Receipt, color: '#0D47A1', action: 'create' },
  { label: 'Receive Payment', Icon: CreditCard, color: '#009688', action: 'collect' },
  { label: 'Billing Report', Icon: BarChart2, color: '#4DB6AC', action: 'report' },
  { label: 'Search Invoice', Icon: Search, color: '#64748B', action: 'search' },
  { label: 'View Pending Bills', Icon: Clock, color: '#F59E0B', action: 'pending' },
  { label: 'Daily Revenue', Icon: DollarSign, color: '#66BB6A', action: 'revenue' },
]
export function AccountantDashboard({
  onCreateInvoiceClick,
  onCollectPaymentClick,
  onNavigateNav,
}: {
  onCreateInvoiceClick?: () => void
  onCollectPaymentClick?: (invoiceNo?: string) => void
  onNavigateNav?: (nav: string) => void
}) {
  const totalInvoices = ACC_INVOICE_STATUS_DIST.reduce((acc, curr) => acc + curr.count, 0)
  const totalPaymentValue = ACC_PAYMENT_METHODS_DIST.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: '#F1F5F9' }}>

      {/* ── HEADER & QUICK ACTIONS ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Financial Quick Actions</span>
        {ACC_QUICK_ACTIONS.map(({ label, Icon, color, action }) => (
          <button
            key={label}
            onClick={() => {
              if (action === 'create' && onCreateInvoiceClick) onCreateInvoiceClick()
              else if (action === 'collect' && onCollectPaymentClick) onCollectPaymentClick()
              else if (action === 'create' && onNavigateNav) onNavigateNav('billing')
              else if (action === 'collect' && onNavigateNav) onNavigateNav('billing')
              else if (action === 'pending' && onNavigateNav) onNavigateNav('billing')
              else if (action === 'report' && onNavigateNav) onNavigateNav('reports')
              else if (action === 'revenue' && onNavigateNav) onNavigateNav('reports')
              else if (action === 'search' && onNavigateNav) onNavigateNav('billing')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}>
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── KPI Row — 5 Financial Operations KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi title="Today's Revenue" value="$28,450" sub="Total Amount Collected Today" trend="+13.2% vs Yesterday" up={true} data={[{ v: 18000 }, { v: 21000 }, { v: 24000 }, { v: 22000 }, { v: 25120 }, { v: 28450 }]} color="#0D47A1" gid="acc1" Icon={DollarSign} />
        <DKpi title="Invoices Generated" value="58" sub="Today's Billing Count" trend="+11.5% Billing Volume" up={true} data={[{ v: 40 }, { v: 45 }, { v: 48 }, { v: 52 }, { v: 50 }, { v: 58 }]} color="#009688" gid="acc2" Icon={Receipt} />
        <DKpi title="Pending Payments" value="$8,450" sub="12 Outstanding Bills" trend="Avg Due: $704.16" up={false} data={[{ v: 11000 }, { v: 9800 }, { v: 10500 }, { v: 9200 }, { v: 9000 }, { v: 8450 }]} color="#F59E0B" gid="acc3" Icon={Clock} />
        <DKpi title="Payments Received" value="45" sub="Completed Payments Today" trend="77.5% Collection Rate" up={true} data={[{ v: 30 }, { v: 35 }, { v: 38 }, { v: 41 }, { v: 42 }, { v: 45 }]} color="#66BB6A" gid="acc4" Icon={CheckSquare} />
        <DKpi title="Refund Requests" value="3" sub="Pending Refund Requests" trend="1 Approved Today" up={false} data={[{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 3 }]} color="#EF4444" gid="acc5" Icon={Download} />
      </div>

      {/* ── Main Financial Operations Grid 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 01: Revenue Collection Trend (Large Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Revenue Collection Throughout the Day</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Monitors hourly revenue collection flow (08 AM - 05 PM)</div>
            </div>
            <span className="text-[10px] font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontFamily: RB }}>Today: $28,450.00</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={ACC_REVENUE_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="accRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(val: unknown) => `$${Number(val) / 1000}k`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(val: unknown, name: unknown) => [
                  name === 'revenue' ? `$${Number(val).toLocaleString()}.00` : `${val} Invoices`,
                  name === 'revenue' ? 'Revenue Collected' : 'Invoices Generated'
                ]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0D47A1" strokeWidth={2.5} fill="url(#accRevGrad)" dot={{ r: 3, fill: '#0D47A1' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]" style={{ fontFamily: RB }}>
            <span>Peak Collection Hour: 11 AM - 12 PM ($4,700 Collected)</span>
            <span className="font-semibold text-[#111827]">58 Invoices Processed</span>
          </div>
        </div>

        {/* Section 02: Payment Method Distribution (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Payments by Method" sub="Understand Payment Method Distribution" />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={ACC_PAYMENT_METHODS_DIST} layout="vertical" margin={{ top: 0, right: 15, left: 10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={85} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`$${Number(v).toLocaleString()}.00`, 'Amount Collected']}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={13}>
                {ACC_PAYMENT_METHODS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-3 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {ACC_PAYMENT_METHODS_DIST.map(m => (
              <div key={m.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                  <span className="text-[#64748B] text-[11px]">{m.name}</span>
                </div>
                <span className="font-bold text-[#111827]">${(m.value / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-center text-[#64748B]" style={{ fontFamily: RB }}>
            Total Collected: ${totalPaymentValue.toLocaleString()}.00
          </div>
        </div>

      </div>

      {/* ── Section 03: Today's Billing Transactions Table ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Billing Transactions</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Real-time invoice management and billing activity tracking</div>
          </div>
          <span className="text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg" style={{ fontFamily: RB }}>58 Invoices Today</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {['Invoice No', 'Patient Name', 'Bill Type', 'Amount', 'Payment Method', 'Status', 'Generated Time', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ACC_BILLING_TRANSACTIONS.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{t.invoice}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Av name={t.patient} size="sm" />
                      <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{t.patient}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{t.type}</td>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#111827]">${t.amount.toFixed(2)}</td>
                  <td className="px-5 py-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{t.method}</td>
                  <td className="px-5 py-3">
                    <Chip label={t.status} variant={ACC_TRANSACTION_STATUS_CHIP[t.status] || 'default'} />
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{t.time}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {t.status === 'Pending' || t.status === 'Partial' ? (
                        <button
                          onClick={() => onCollectPaymentClick?.(t.invoice)}
                          className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                          style={{ fontFamily: PP }}
                        >
                          Collect
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Logged</span>
                      )}
                      <button
                        onClick={() => onCreateInvoiceClick?.()}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 04, 05 & 06: Pending Summary, Revenue Categories & Invoice Status ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 04: Pending Payment Summary (Reusable Summary Card) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Pending Payment Summary" sub="Outstanding Collections Overview" />
          <div className="space-y-3 my-auto">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-100 bg-amber-50/50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Pending Bills Count</span>
              <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>12 Bills</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-red-100 bg-red-50/50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Pending Outstanding Amount</span>
              <span className="text-sm font-bold text-[#EF4444]" style={{ fontFamily: PP }}>$8,450.00</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Overdue Bills (&gt;3 Days)</span>
              <span className="text-sm font-bold text-[#F59E0B]" style={{ fontFamily: PP }}>4 Bills</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Average Due Amount</span>
              <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>$704.16</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-teal-100 bg-teal-50/50">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Today's Collections Progress</span>
              <span className="text-sm font-bold text-[#009688]" style={{ fontFamily: PP }}>$28,450.00</span>
            </div>
          </div>
          <div className="mt-3 pt-2 text-xs text-[#64748B] text-center" style={{ fontFamily: RB }}>
            Critical operational metrics for revenue recovery
          </div>
        </div>

        {/* Section 05: Revenue by Billing Category (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Revenue by Billing Type" sub="Revenue Breakdown by Category" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ACC_REVENUE_CATEGORIES} layout="vertical" margin={{ top: 0, right: 20, left: 25, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `$${Number(v) / 1000}k`} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`$${Number(v).toLocaleString()}.00`, 'Collected Amount']}
              />
              <Bar dataKey="amount" fill="#0D47A1" radius={[0, 4, 4, 0]} barSize={13} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 pt-2 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between" style={{ fontFamily: RB }}>
            <span>Top Source: Consultation Fee</span>
            <span className="font-semibold text-[#0D47A1]">$28,450 Total</span>
          </div>
        </div>

        {/* Section 06: Invoice Status Distribution (Pie / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Invoice Status Distribution" sub="Quick Overview of Billing Completion" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ACC_INVOICE_STATUS_DIST} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Invoices`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                {ACC_INVOICE_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {ACC_INVOICE_STATUS_DIST.map(r => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-[#64748B] text-[11px]">{r.name}:</span>
                <span className="font-bold text-[#111827]">{r.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs font-semibold text-center text-[#0D47A1]" style={{ fontFamily: PP }}>
            Total Invoices Today: {totalInvoices}
          </div>
        </div>

      </div>

      {/* ── Section 09: Today's Financial Summary ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Financial Summary</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Financial operational statistics and daily collection performance</div>
          </div>
          <button className="text-xs text-[#0D47A1] font-semibold hover:underline" style={{ fontFamily: RB }}>Export Financial Summary →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {['Metric', 'Today', 'Yesterday', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ACC_FINANCIAL_SUMMARY_METRICS.map(m => (
              <tr key={m.metric} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-xs font-medium text-[#111827]" style={{ fontFamily: PP }}>{m.metric}</td>
                <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{m.today}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#64748B]">{m.yesterday}</td>
                <td className="px-5 py-3">
                  <Chip label={m.status} variant={m.status.includes('Ahead') || m.status.includes('Optimal') || m.status.includes('High') ? 'success' : m.status.includes('Low') ? 'info' : 'warning'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// ─── 07 PATIENT PORTAL (PERSONAL HEALTHCARE DASHBOARD) ───────────────────

// Section 01: My Appointment Timeline Data
const PAT_APPOINTMENT_TIMELINE = [
  { date: 'Mar 15, 2025', time: '10:30 AM', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'Upcoming' },
  { date: 'Mar 12, 2025', time: '09:15 AM', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'Completed' },
  { date: 'Feb 20, 2025', time: '11:00 AM', doctor: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'Completed' },
  { date: 'Feb 05, 2025', time: '02:30 PM', doctor: 'Dr. Priya Sharma', dept: 'General OPD', status: 'Cancelled' },
  { date: 'Jan 08, 2025', time: '10:00 AM', doctor: 'Dr. Priya Sharma', dept: 'General OPD', status: 'Completed' },
]

// Section 02: Consultation History Trend (Line Chart)
const PAT_CONSULTATION_TREND = [
  { month: 'Oct', visits: 1 },
  { month: 'Nov', visits: 0 },
  { month: 'Dec', visits: 1 },
  { month: 'Jan', visits: 1 },
  { month: 'Feb', visits: 2 },
  { month: 'Mar', visits: 2 },
]

// Section 03: Prescription Summary (Pie / Bar Chart)
const PAT_PRESCRIPTION_SUMMARY = [
  { name: 'Active', count: 3, color: '#009688' },
  { name: 'Completed', count: 5, color: '#66BB6A' },
  { name: 'Expired', count: 2, color: '#EF4444' },
]

// Section 04: Billing Summary (Donut / Bar Chart)
const PAT_BILLING_SUMMARY = [
  { name: 'Paid', amount: 370.60, color: '#66BB6A' },
  { name: 'Pending', amount: 142.60, color: '#F59E0B' },
]

// Section 05: Recent Prescriptions Table
const PAT_RECENT_PRESCRIPTIONS = [
  { rxId: 'RX-9042', doctor: 'Dr. Arjun Mehta', date: 'Mar 12, 2025', medsCount: 3, status: 'Active' },
  { rxId: 'RX-8812', doctor: 'Dr. Arjun Mehta', date: 'Feb 20, 2025', medsCount: 2, status: 'Active' },
  { rxId: 'RX-8510', doctor: 'Dr. Priya Sharma', date: 'Jan 08, 2025', medsCount: 1, status: 'Completed' },
  { rxId: 'RX-8204', doctor: 'Dr. Arjun Mehta', date: 'Dec 14, 2024', medsCount: 2, status: 'Expired' },
]

// Section 06: Recent Bills Table
const PAT_RECENT_BILLS = [
  { invoice: 'INV-847', date: 'Mar 12, 2025', amount: 97.60, status: 'Unpaid' },
  { invoice: 'INV-831', date: 'Feb 20, 2025', amount: 45.00, status: 'Pending' },
  { invoice: 'INV-810', date: 'Jan 08, 2025', amount: 28.00, status: 'Paid' },
  { invoice: 'INV-790', date: 'Dec 14, 2024', amount: 200.00, status: 'Paid' },
]

const PAT_STATUS_CHIP: Record<string, 'success' | 'warning' | 'info' | 'error' | 'teal' | 'default'> = {
  'Upcoming': 'teal',
  'Confirmed': 'success',
  'Completed': 'success',
  'Active': 'success',
  'Paid': 'success',
  'Unpaid': 'error',
  'Pending': 'warning',
  'Cancelled': 'error',
  'Expired': 'error',
  'Downloaded': 'info',
  'Success': 'success',
}

const PAT_QUICK_ACTIONS = [
  { label: 'Book Appointment', Icon: Calendar, color: '#009688', action: 'book' },
  { label: 'View Appointments', Icon: Clock, color: '#0D47A1', action: 'appts' },
  { label: 'View Prescriptions', Icon: Pill, color: '#4DB6AC', action: 'prescriptions' },
  { label: 'View Bills', Icon: Receipt, color: '#F59E0B', action: 'bills' },
  { label: 'Download Invoice', Icon: Download, color: '#66BB6A', action: 'download' },
  { label: 'Update Profile', Icon: User, color: '#64748B', action: 'profile' },
]

export function PatientDashboard({
  onBookAppointmentClick,
  onViewBillsClick,
  onNavigateNav,
}: {
  onBookAppointmentClick?: () => void
  onViewBillsClick?: () => void
  onNavigateNav?: (nav: string) => void
}) {
  const totalBillsAmount = PAT_BILLING_SUMMARY.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: '#F1F5F9' }}>

      {/* ── HEADER & QUICK ACTIONS ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Personal Healthcare Actions</span>
        {PAT_QUICK_ACTIONS.map(({ label, Icon, color, action }) => (
          <button
            key={label}
            onClick={() => {
              if (action === 'book' && onBookAppointmentClick) onBookAppointmentClick()
              else if (action === 'bills' && onViewBillsClick) onViewBillsClick()
              else if (action === 'book' && onNavigateNav) onNavigateNav('appointments')
              else if (action === 'appts' && onNavigateNav) onNavigateNav('appointments')
              else if (action === 'prescriptions' && onNavigateNav) onNavigateNav('prescriptions')
              else if (action === 'bills' && onNavigateNav) onNavigateNav('billing')
              else if (action === 'download' && onNavigateNav) onNavigateNav('billing')
              else if (action === 'profile' && onNavigateNav) onNavigateNav('settings')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}>
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── KPI Row — 5 Personal Healthcare KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi title="Upcoming Appointment" value="Mar 15, 10:30 AM" sub="Dr. Arjun Mehta (Cardiology)" trend="Confirmed Slot" up={true} data={[{ v: 1 }, { v: 1 }, { v: 2 }, { v: 1 }, { v: 1 }, { v: 1 }]} color="#0D47A1" gid="pt1" Icon={Calendar} />
        <DKpi title="Active Prescriptions" value="3 Active" sub="Metoprolol, Aspirin..." trend="All Meds Refilled" up={true} data={[{ v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 3 }, { v: 3 }]} color="#009688" gid="pt2" Icon={Pill} />
        <DKpi title="Outstanding Bills" value="$142.60" sub="2 Pending Invoices" trend="Due Mar 15 & Mar 20" up={false} data={[{ v: 200 }, { v: 180 }, { v: 160 }, { v: 150 }, { v: 142.6 }, { v: 142.6 }]} color="#F59E0B" gid="pt3" Icon={Receipt} />
        <DKpi title="Completed Consultations" value="7 OPD Visits" sub="Recent: Mar 12, 2025" trend="Stable Angina Review" up={true} data={[{ v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }]} color="#66BB6A" gid="pt4" Icon={Stethoscope} />
        <DKpi title="Health Notifications" value="3 Unread" sub="1 Reminder, 1 Bill, 1 Rx" trend="Action Required" up={false} data={[{ v: 5 }, { v: 4 }, { v: 2 }, { v: 4 }, { v: 3 }, { v: 3 }]} color="#EF4444" gid="pt5" Icon={Bell} />
      </div>

      {/* ── Main Personal Healthcare Grid 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Section 01: My Appointment Timeline */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="My Appointment Timeline" sub="View Appointment History & Future Appointments" action={
            <button onClick={() => onBookAppointmentClick?.()} className="text-xs text-[#0D47A1] font-semibold hover:underline" style={{ fontFamily: PP }}>+ Book New</button>
          } />
          <div className="space-y-3.5 my-auto">
            {PAT_APPOINTMENT_TIMELINE.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-slate-50 hover:bg-white transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-[#0D47A1] font-bold text-xs">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{item.doctor} · <span className="text-[#64748B] font-normal">{item.dept}</span></div>
                    <div className="text-[11px] text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>{item.date} at <span className="font-mono font-semibold text-[#0D47A1]">{item.time}</span></div>
                  </div>
                </div>
                <Chip label={item.status} variant={PAT_STATUS_CHIP[item.status] || 'default'} />
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-50 text-xs text-[#64748B] text-center" style={{ fontFamily: RB }}>
            Next Visit: <span className="font-semibold text-[#0D47A1]">Dr. Arjun Mehta on Sat, Mar 15, 2025 (10:30 AM)</span>
          </div>
        </div>

        {/* Section 02: Consultation History Trend (Line Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Consultation History" sub="Monthly OPD Visit Frequency" />
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={PAT_CONSULTATION_TREND} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="patVisitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Visits`, 'Consultations']}
              />
              <Area type="monotone" dataKey="visits" stroke="#0D47A1" strokeWidth={2.5} fill="url(#patVisitGrad)" dot={{ r: 3, fill: '#0D47A1' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 pt-2 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between" style={{ fontFamily: RB }}>
            <span>Total OPD Visits: 7 Visits</span>
            <span className="font-semibold text-[#0D47A1]">Avg 1.2/Month</span>
          </div>
        </div>

      </div>

      {/* ── Section 03 & 04: Prescription Summary & Billing Summary Charts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Section 03: Prescription Summary (Pie / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Prescription Status" sub="Quick Overview of Medication Status" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={PAT_PRESCRIPTION_SUMMARY} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`${v} Prescriptions`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={26}>
                {PAT_PRESCRIPTION_SUMMARY.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            {PAT_PRESCRIPTION_SUMMARY.map(p => (
              <div key={p.name} className="text-center p-1.5 rounded-lg bg-slate-50">
                <span className="text-[10px] text-[#64748B] block">{p.name}</span>
                <span className="font-bold text-[#111827]">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 04: Billing Summary (Donut / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Billing Overview" sub="Display Personal Payment Status" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={PAT_BILLING_SUMMARY} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `$${v}`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#111827', fontFamily: RB }} axisLine={false} tickLine={false} width={70} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`$${Number(v).toFixed(2)}`, 'Amount']}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={16}>
                {PAT_BILLING_SUMMARY.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 text-xs" style={{ fontFamily: RB }}>
            <span className="text-[#64748B]">Total Billing History: ${totalBillsAmount.toFixed(2)}</span>
            <span className="font-bold text-[#F59E0B]">$142.60 Pending Due</span>
          </div>
        </div>

      </div>

      {/* ── Section 05: Recent Prescriptions Table ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Recent Prescriptions</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Issued medical prescriptions and active orders</div>
          </div>
          <span className="text-xs font-semibold text-[#009688] bg-teal-50 px-2.5 py-1 rounded-lg" style={{ fontFamily: RB }}>3 Active Meds</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {['Prescription ID', 'Prescribing Doctor', 'Issued Date', 'Medicine Count', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PAT_RECENT_PRESCRIPTIONS.map((rx, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{rx.rxId}</td>
                  <td className="px-5 py-3 text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{rx.doctor}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{rx.date}</td>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#111827]">{rx.medsCount} Medicines</td>
                  <td className="px-5 py-3">
                    <Chip label={rx.status} variant={PAT_STATUS_CHIP[rx.status] || 'default'} />
                  </td>
                  <td className="px-5 py-3">
                    <button className="px-3 py-1 rounded-lg bg-blue-50 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-100 transition-colors" style={{ fontFamily: PP }}>
                      View Prescription
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 06: Recent Bills Table ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Recent Bills</div>
            <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Personal billing statements & payment history</div>
          </div>
          <button onClick={() => onViewBillsClick?.()} className="text-xs text-[#0D47A1] font-semibold hover:underline" style={{ fontFamily: RB }}>Pay Pending Bills →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {['Invoice Number', 'Visit Date', 'Amount', 'Payment Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PAT_RECENT_BILLS.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">{b.invoice}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{b.date}</td>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#111827]">${b.amount.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <Chip label={b.status} variant={PAT_STATUS_CHIP[b.status] || 'default'} />
                  </td>
                  <td className="px-5 py-3">
                    <button className="px-3 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors" style={{ fontFamily: PP }}>
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
  )
}
