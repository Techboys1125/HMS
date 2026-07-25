import { useState } from 'react'
import {
  Activity, AlertTriangle,
  Calendar, Check, CheckSquare, Clock,
  ClipboardList, FileText,
  Pill, Plus, Receipt,
  Server, Settings, Shield, TrendingDown,
  TrendingUp, UserPlus, Users, Download,
  Building2, Database, HardDrive,
  Globe, DollarSign, Wifi, Star,
  Bell, Stethoscope, CreditCard,
  ChevronRight, Heart, BarChart2, User,
  Search
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
          <div className="text-2xl font-bold text-[#111827] leading-none" style={{ fontFamily: PP }}>{value}</div>
          <div className="text-xs text-slate-400 mt-1" style={{ fontFamily: RB }}>{sub}</div>
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

function AlertRow({ level, msg, time, sub }: { level: 'critical' | 'warning' | 'info'; msg: string; time: string; sub?: string }) {
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

          {/* Security Alerts */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Security Alerts" sub="Requires attention" />
            <div className="space-y-2">
              <AlertRow level="critical" msg="Failed login attempts — 8 in 10 min" time="4m ago" sub="IP: 192.168.1.45 · User: admin@metro" />
              <AlertRow level="warning" msg="API rate limit approached (92%)" time="22m ago" sub="Endpoint: /api/v2/patients" />
              <AlertRow level="info" msg="New device login for Admin Sharma" time="1h ago" sub="Chrome · Windows · Los Angeles" />
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
const DOCTORS_AVAIL = [
  { name: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'in-consultation', patients: 8 },
  { name: 'Dr. Priya Sharma', dept: 'General', status: 'available', patients: 6 },
  { name: 'Dr. Sarah Patel', dept: 'Obstetrics', status: 'available', patients: 5 },
  { name: 'Dr. Raj Kapoor', dept: 'Neurology', status: 'available', patients: 4 },
  { name: 'Dr. Linda Walsh', dept: 'Pediatrics', status: 'on-leave', patients: 0 },
  { name: 'Dr. Chen Wei', dept: 'Orthopedics', status: 'in-consultation', patients: 7 },
]

const HA_REGS = [
  { name: 'Anika Petrov', mrn: 'MRN-011', age: 29, gender: 'F', time: '09:41' },
  { name: 'Tom Harrison', mrn: 'MRN-012', age: 55, gender: 'M', time: '09:53' },
  { name: 'Mei Lin', mrn: 'MRN-013', age: 38, gender: 'F', time: '10:12' },
  { name: 'Oscar Ruiz', mrn: 'MRN-014', age: 67, gender: 'M', time: '10:31' },
  { name: 'Fatima Al-Rashid', mrn: 'MRN-015', age: 42, gender: 'F', time: '10:48' },
]

const HA_DEPTS = [
  { name: 'OPD — General', capacity: 87, active: 22, total: 25, color: '#0D47A1' },
  { name: 'Cardiology', capacity: 68, active: 17, total: 25, color: '#EF4444' },
  { name: 'Pediatrics', capacity: 43, active: 9, total: 21, color: '#009688' },
  { name: 'Gynecology', capacity: 70, active: 14, total: 20, color: '#9C27B0' },
  { name: 'Neurology', capacity: 55, active: 11, total: 20, color: '#F59E0B' },
]

const HA_TIMELINE = [
  { time: '08:00', patient: 'Helen Brooks', complaint: 'General Check-up', doctor: 'Dr. P. Sharma', status: 'completed', room: 'OPD-3' },
  { time: '08:30', patient: 'Alex Monroe', complaint: 'Post-op Follow-up', doctor: 'Dr. A. Mehta', status: 'completed', room: 'OPD-1' },
  { time: '09:00', patient: 'Sarah Mitchell', complaint: 'Chest Pain', doctor: 'Dr. A. Mehta', status: 'in-progress', room: 'OPD-1' },
  { time: '09:30', patient: 'James Thornton', complaint: 'Diabetes Follow-up', doctor: 'Dr. P. Sharma', status: 'waiting', room: null },
  { time: '10:00', patient: 'Emma Reyes', complaint: 'Prenatal Visit', doctor: 'Dr. S. Patel', status: 'checked-in', room: 'OPD-5' },
  { time: '10:30', patient: 'Robert Chen', complaint: 'Cardiology Review', doctor: 'Dr. A. Mehta', status: 'scheduled', room: null },
  { time: '11:00', patient: 'Aisha Kumar', complaint: 'Migraine', doctor: 'Dr. R. Kapoor', status: 'scheduled', room: null },
  { time: '11:30', patient: 'David Walsh', complaint: 'Back Pain', doctor: 'Dr. P. Sharma', status: 'scheduled', room: null },
  { time: '14:00', patient: 'Lily Anderson', complaint: 'Thyroid Review', doctor: 'Dr. S. Patel', status: 'scheduled', room: null },
  { time: '14:30', patient: 'Marcus Brown', complaint: 'Hypertension F/U', doctor: 'Dr. A. Mehta', status: 'scheduled', room: null },
]

const HA_BILLS = [
  { inv: 'INV-2891', patient: 'Helen Brooks', amount: '$320', status: 'paid', type: 'OPD' },
  { inv: 'INV-2892', patient: 'Alex Monroe', amount: '$680', status: 'paid', type: 'Consultation' },
  { inv: 'INV-2893', patient: 'Sarah Mitchell', amount: '$480', status: 'pending', type: 'OPD' },
  { inv: 'INV-2894', patient: 'James Thornton', amount: '$260', status: 'pending', type: 'Consultation' },
  { inv: 'INV-2895', patient: 'Emma Reyes', amount: '$650', status: 'paid', type: 'OPD' },
]

const HA_ACTIVITY = [
  { Icon: UserPlus, action: 'New patient registered', detail: 'Fatima Al-Rashid · MRN-015', time: '6m', color: '#0D47A1' },
  { Icon: Calendar, action: 'Appointment booked', detail: 'Marcus Brown → Dr. A. Mehta', time: '14m', color: '#009688' },
  { Icon: Receipt, action: 'Bill settled', detail: 'INV-2892 · $1,250', time: '21m', color: '#66BB6A' },
  { Icon: CheckSquare, action: 'Patient checked in', detail: 'James Thornton · OPD Wing B', time: '38m', color: '#F59E0B' },
  { Icon: Stethoscope, action: 'Consultation completed', detail: 'Helen Brooks · Dr. P. Sharma', time: '52m', color: '#009688' },
  { Icon: Stethoscope, action: 'Doctor checked in', detail: 'Dr. Raj Kapoor · Neurology', time: '1h', color: '#0D47A1' },
]

const HA_ANNOUNCEMENTS = [
  { type: 'info', title: 'Staff Meeting — 3:00 PM Today', body: 'Monthly department heads review in Conference Room A.' },
  { type: 'warning', title: 'High Patient Volume — OPD', body: 'OPD General at 87% capacity. Consider adding a slot.' },
  { type: 'success', title: 'Joint Commission Audit Cleared', body: 'All departments met compliance standards. Report filed.' },
]

const HA_WEEKLY_REV = [
  { day: 'Mon', opd: 18.2, billing: 6.4 },
  { day: 'Tue', opd: 22.5, billing: 8.1 },
  { day: 'Wed', opd: 19.8, billing: 7.2 },
  { day: 'Thu', opd: 26.1, billing: 9.5 },
  { day: 'Fri', opd: 24.8, billing: 8.8 },
  { day: 'Sat', opd: 14.3, billing: 4.9 },
  { day: 'Sun', opd: 11.6, billing: 3.8 },
]

const HA_STATUS_COLOR: Record<string, string> = {
  'completed': '#66BB6A',
  'in-progress': '#009688',
  'waiting': '#F59E0B',
  'checked-in': '#0D47A1',
  'scheduled': '#CBD5E1',
}

const HA_QUICK_ACTIONS = [
  { label: 'View Patients', Icon: Users, color: '#0D47A1', nav: 'patients' },
  { label: 'View Queue', Icon: Clock, color: '#009688', nav: 'appointments' },
  { label: 'Appointment Management', Icon: Calendar, color: '#0D47A1', nav: 'appointments' },
  { label: 'Operational Reports', Icon: BarChart2, color: '#64748B', nav: 'reports' },
]

export function HospitalAdminDashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">

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

      {/* ── KPI Row — 5 cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi title="Today's Patients" value="238" sub="Active visits today" trend="+14 from yesterday" up={true} data={[{ v: 195 }, { v: 205 }, { v: 210 }, { v: 218 }, { v: 224 }, { v: 230 }, { v: 238 }]} color="#0D47A1" gid="ha1" Icon={Users} />
        <DKpi title="Today's Appointments" value="142" sub="Scheduled visits" trend="+8% vs yesterday" up={true} data={[{ v: 98 }, { v: 115 }, { v: 108 }, { v: 132 }, { v: 119 }, { v: 138 }, { v: 142 }]} color="#009688" gid="ha2" Icon={Calendar} />
        <DKpi title="Revenue Today" value="$24.8K" sub="Gross collection" trend="+12% this week" up={true} data={[{ v: 18 }, { v: 21 }, { v: 19 }, { v: 24 }, { v: 22 }, { v: 23 }, { v: 24.8 }]} color="#66BB6A" gid="ha3" Icon={DollarSign} />
        <DKpi title="Patients Registered" value="47" sub="New registrations today" trend="+9 from yesterday" up={true} data={[{ v: 32 }, { v: 38 }, { v: 35 }, { v: 41 }, { v: 44 }, { v: 45 }, { v: 47 }]} color="#F59E0B" gid="ha4" Icon={UserPlus} />
        <DKpi title="Doctors on Duty" value="18" sub="of 24 staff today" trend="3 on leave today" up={true} data={[{ v: 14 }, { v: 16 }, { v: 15 }, { v: 17 }, { v: 16 }, { v: 18 }, { v: 18 }]} color="#0D47A1" gid="ha5" Icon={Stethoscope} />
      </div>

      {/* ── Main Workspace ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Appointment Timeline */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Appointment Timeline</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                {HA_TIMELINE.length} appointments · {HA_TIMELINE.filter(a => a.status === 'completed').length} completed
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px]" style={{ fontFamily: RB }}>
              {[
                { label: 'Done', color: '#66BB6A' },
                { label: 'Active', color: '#009688' },
                { label: 'Waiting', color: '#F59E0B' },
                { label: 'Scheduled', color: '#CBD5E1' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1 text-[#64748B]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-50 overflow-y-auto" style={{ maxHeight: 380 }}>
            {HA_TIMELINE.map((a, i) => {
              const sc = HA_STATUS_COLOR[a.status] ?? '#CBD5E1'
              const isActive = a.status === 'in-progress'
              return (
                <div key={i} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${isActive ? 'bg-teal-50/40' : ''}`}>
                  <div className="font-mono text-xs font-bold text-[#0D47A1] shrink-0 w-12 text-center">{a.time}</div>
                  <div className="relative shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: sc }} />
                    {isActive && <div className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: sc }} />}
                  </div>
                  <Av name={a.patient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#111827] truncate" style={{ fontFamily: RB }}>{a.patient}</div>
                    <div className="text-xs text-[#64748B] truncate" style={{ fontFamily: RB }}>{a.complaint}</div>
                  </div>
                  <div className="text-xs text-[#64748B] shrink-0 hidden xl:block" style={{ fontFamily: RB }}>{a.doctor}</div>
                  {a.room && (
                    <span className="font-mono text-[10px] font-semibold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded shrink-0">{a.room}</span>
                  )}
                  <Chip
                    label={a.status === 'in-progress' ? 'Active' : a.status === 'checked-in' ? 'Checked In' : a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    variant={a.status === 'completed' ? 'success' : a.status === 'in-progress' ? 'teal' : a.status === 'waiting' ? 'warning' : a.status === 'checked-in' ? 'info' : 'default'}
                  />
                </div>
              )
            })}
          </div>
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Showing {HA_TIMELINE.length} of 142 appointments</span>
            <button className="text-xs text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>View full schedule →</button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Department Overview */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Department Status" sub="Current occupancy" />
            <div className="space-y-3">
              {HA_DEPTS.map(d => (
                <ProgressBar key={d.name} label={d.name} value={d.active} total={d.total}
                  color={d.capacity >= 90 ? '#EF4444' : d.capacity >= 70 ? '#F59E0B' : d.color}
                  sub={`${d.active}/${d.total}`} />
              ))}
            </div>
            {/* Consultation summary tiles */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-50">
              {[
                { label: 'Completed', value: '86', color: '#66BB6A', bg: 'bg-green-50' },
                { label: 'In Progress', value: '12', color: '#009688', bg: 'bg-teal-50' },
                { label: 'Waiting', value: '18', color: '#F59E0B', bg: 'bg-amber-50' },
                { label: 'Scheduled', value: '26', color: '#0D47A1', bg: 'bg-blue-50' },
              ].map(b => (
                <div key={b.label} className={`${b.bg} rounded-xl p-3 border border-gray-100`}>
                  <div className="text-[10px] font-medium mb-1" style={{ fontFamily: RB, color: b.color }}>{b.label}</div>
                  <div className="text-xl font-bold" style={{ fontFamily: PP, color: b.color }}>{b.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors on Duty */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Doctors On Duty" sub="Live staff status" />
            <div className="space-y-0">
              {DOCTORS_AVAIL.map(d => (
                <div key={d.name} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <Av name={d.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#111827] truncate" style={{ fontFamily: PP }}>{d.name}</div>
                    <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>{d.dept}</div>
                  </div>
                  <Chip
                    label={d.status === 'available' ? 'Free' : d.status === 'in-consultation' ? 'Busy' : 'Leave'}
                    variant={d.status === 'available' ? 'success' : d.status === 'in-consultation' ? 'teal' : 'warning'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Secondary Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recent Patient Registrations */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Recent Registrations</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>New patients today</div>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {HA_REGS.map(p => (
              <div key={p.mrn} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors">
                <Av name={p.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#111827] truncate" style={{ fontFamily: RB }}>{p.name}</div>
                  <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>{p.gender}/{p.age} · {p.mrn}</div>
                </div>
                <div className="font-mono text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded shrink-0">{p.time}</div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <button className="text-xs text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>View all registrations →</button>
          </div>
        </div>

        {/* Recent Bills */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Recent Bills</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Today's billing activity</div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50 transition-colors" style={{ fontFamily: RB }}>
              <Download size={11} /> Export
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {HA_BILLS.map(b => (
              <div key={b.inv} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Receipt size={12} className="text-[#0D47A1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#111827]" style={{ fontFamily: PP }}>{b.inv}</div>
                  <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>{b.patient} · {b.type}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#111827] mb-0.5" style={{ fontFamily: PP }}>{b.amount}</div>
                  <Chip label={b.status === 'paid' ? 'Paid' : 'Pending'} variant={b.status === 'paid' ? 'success' : 'warning'} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <button className="text-xs text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>View all bills →</button>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Activity Timeline" sub="Recent operations log" />
          <div>
            {HA_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 relative">
                {i < HA_ACTIVITY.length - 1 && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-100" />
                )}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 z-10" style={{ background: a.color + '15' }}>
                  <a.Icon size={12} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{a.action}</div>
                  <div className="text-[10px] text-[#64748B] truncate mt-0.5" style={{ fontFamily: RB }}>{a.detail}</div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 pt-0.5" style={{ fontFamily: RB }}>{a.time} ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Performance + Announcements ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Weekly Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Hospital Revenue — This Week</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>OPD Consultations · Billing breakdown ($K)</div>
            </div>
            <div className="flex items-center gap-4 text-[10px]" style={{ fontFamily: RB }}>
              {[
                { label: 'OPD', color: '#0D47A1' },
                { label: 'Billing', color: '#009688' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5 text-[#64748B]">
                  <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={HA_WEEKLY_REV} barGap={2} barCategoryGap="30%">
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} width={38} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
                formatter={(v: unknown) => [`$${v}K`, '']}
              />
              <Bar dataKey="opd" name="OPD" fill="#0D47A1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="billing" name="Billing" fill="#009688" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-50">
            {[
              { label: 'Total This Week', value: '$137.3K', up: true, trend: '+11% vs last week' },
              { label: "Today's Revenue", value: '$24.8K', up: true, trend: '+12% vs yesterday' },
              { label: 'Pending Bills', value: '$8.4K', up: false, trend: '18 unpaid invoices' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <div className="text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>{m.label}</div>
                <div className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>{m.value}</div>
                <div className={`flex items-center justify-center gap-1 text-xs font-medium mt-0.5 ${m.up ? 'text-[#66BB6A]' : 'text-[#EF4444]'}`} style={{ fontFamily: RB }}>
                  {m.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {m.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements + Critical Alerts */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex-1">
            <SH title="Announcements" />
            <div className="space-y-3">
              {HA_ANNOUNCEMENTS.map((a, i) => (
                <div key={i} className={`p-3 rounded-xl border text-xs ${a.type === 'warning' ? 'bg-amber-50 border-amber-100'
                  : a.type === 'success' ? 'bg-green-50 border-green-100'
                    : 'bg-blue-50 border-blue-100'
                  }`}>
                  <div className={`font-semibold mb-1 leading-snug ${a.type === 'warning' ? 'text-amber-800' : a.type === 'success' ? 'text-green-800' : 'text-blue-800'}`}
                    style={{ fontFamily: PP }}>{a.title}</div>
                  <div className={`leading-snug ${a.type === 'warning' ? 'text-amber-700' : a.type === 'success' ? 'text-green-700' : 'text-blue-700'}`}
                    style={{ fontFamily: RB }}>{a.body}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="System Alerts" />
            <div className="space-y-2">
              <AlertRow level="warning" msg="High appointment volume — OPD General" time="8m" sub="87% capacity · Consider adding an afternoon slot" />
              <AlertRow level="info" msg="Pending billing review — 3 invoices" time="24m" sub="INV-2893, INV-2894, INV-2896 awaiting approval" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 03 DOCTOR DASHBOARD ───────────────────────────────────────────────────
const DOC_SCHEDULE = [
  { time: '08:30', patient: 'Alex Monroe', complaint: 'Post-op Follow-up', mrn: 'MRN-091', status: 'completed' as const, room: 'OPD-1' },
  { time: '09:00', patient: 'Sarah Mitchell', complaint: 'Chest Pain', mrn: 'MRN-001', status: 'in-progress' as const, room: 'OPD-1' },
  { time: '09:30', patient: 'James Thornton', complaint: 'Diabetes Follow-up', mrn: 'MRN-002', status: 'waiting' as const, room: null },
  { time: '10:00', patient: 'Robert Chen', complaint: 'Cardiology Review', mrn: 'MRN-004', status: 'scheduled' as const, room: null },
  { time: '10:30', patient: 'Marcus Brown', complaint: 'Hypertension F/U', mrn: 'MRN-008', status: 'scheduled' as const, room: null },
  { time: '11:00', patient: 'Aisha Kumar', complaint: 'ECG Review', mrn: 'MRN-005', status: 'scheduled' as const, room: null },
  { time: '14:00', patient: 'Lily Anderson', complaint: 'Thyroid Review', mrn: 'MRN-007', status: 'scheduled' as const, room: null },
  { time: '14:30', patient: 'Nina Patel', complaint: 'Annual Check-up', mrn: 'MRN-009', status: 'scheduled' as const, room: null },
]

const PRESCRIPTIONS_PENDING = [
  { patient: 'James Thornton', drugs: 'Metformin, Glimepiride', since: '20m' },
  { patient: 'Robert Chen', drugs: 'Atorvastatin, Ramipril', since: '45m' },
  { patient: 'Aisha Kumar', drugs: 'Sumatriptan', since: '1h' },
]

const DOC_PATIENT_HISTORY = [
  { name: 'Helen Brooks', complaint: 'General Check-up', diagnosis: 'Healthy — Annual', date: 'Today 08:00', mrn: 'MRN-041' },
  { name: 'Alex Monroe', complaint: 'Post-op Follow-up', diagnosis: 'Recovery on track', date: 'Today 08:30', mrn: 'MRN-091' },
  { name: 'David Walsh', complaint: 'Back Pain', diagnosis: 'L4-L5 Disc Herniation', date: 'Yesterday', mrn: 'MRN-006' },
  { name: 'Nina Patel', complaint: 'Skin Allergy', diagnosis: 'Allergic Rhinitis', date: 'Yesterday', mrn: 'MRN-009' },
  { name: 'Carlos Mendez', complaint: 'Joint Pain', diagnosis: 'Osteoarthritis', date: '2 days ago', mrn: 'MRN-010' },
]

const DOC_FOLLOW_UPS = [
  { patient: 'James Thornton', date: 'Tomorrow 09:30', reason: 'HbA1c Review', type: 'Diabetes F/U' },
  { patient: 'Marcus Brown', date: 'Thu 14:00', reason: 'BP Med Review', type: 'Hypertension' },
  { patient: 'Aisha Kumar', date: 'Fri 11:00', reason: 'Post-treatment Check', type: 'Neurology' },
]

const DOC_DIAGNOSIS = [
  { condition: 'Cardiovascular', count: 8, color: '#EF4444' },
  { condition: 'Diabetes / Endo', count: 6, color: '#F59E0B' },
  { condition: 'Hypertension', count: 5, color: '#0D47A1' },
  { condition: 'Respiratory', count: 4, color: '#009688' },
  { condition: 'Post-operative', count: 3, color: '#66BB6A' },
  { condition: 'Other', count: 2, color: '#94A3B8' },
]

const DOC_ACTIVITIES = [
  { action: 'Consultation completed', detail: 'Alex Monroe · 28 min', time: '08:58', Icon: CheckSquare, color: '#66BB6A' },
  { action: 'Clinical notes updated', detail: 'Sarah Mitchell · Chest Pain', time: '09:10', Icon: FileText, color: '#0D47A1' },
  { action: 'Prescription signed', detail: 'James Thornton · 3 drugs', time: '09:18', Icon: Pill, color: '#009688' },
  { action: 'Referral sent', detail: 'Robert Chen → Cardiology', time: '09:32', Icon: FileText, color: '#0D47A1' },
]

const DOC_MEDICAL_ALERTS = [
  { level: 'critical' as const, msg: 'Sarah Mitchell — BP critically high', time: '4m', sub: '165/104 mmHg — immediate attention required' },
  { level: 'warning' as const, msg: 'James Thornton — BP not controlled post-visit', time: '22m', sub: '145/92 recorded by nurse — consider medication adjustment' },
  { level: 'info' as const, msg: 'Robert Chen — Vitals updated by nurse', time: '41m', sub: 'All vitals within normal range post-cardiology check' },
]

const DOC_QUICK_ACTIONS = [
  { label: 'Open Patient Record', Icon: FileText, color: '#0D47A1' },
  { label: 'Start Consultation', Icon: Stethoscope, color: '#009688' },
  { label: 'Write Prescription', Icon: Pill, color: '#0D47A1' },
  { label: 'Add Clinical Note', Icon: ClipboardList, color: '#009688' },
  { label: 'View Reports', Icon: BarChart2, color: '#64748B' },
]

type ScheduleStatus = 'completed' | 'in-progress' | 'waiting' | 'scheduled'
const STATUS_DOT: Record<ScheduleStatus, string> = {
  'completed': 'bg-[#66BB6A]',
  'in-progress': 'bg-[#009688]',
  'waiting': 'bg-[#F59E0B]',
  'scheduled': 'bg-slate-300',
}

export function DoctorDashboard() {
  const completed = DOC_SCHEDULE.filter(s => s.status === 'completed').length
  const waiting = DOC_SCHEDULE.filter(s => s.status === 'waiting').length
  const current = DOC_SCHEDULE.find(s => s.status === 'in-progress')
  const diagTotal = DOC_DIAGNOSIS.reduce((s, d) => s + d.count, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">

      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Quick Actions</span>
        {DOC_QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#009688]/40 hover:text-[#009688] hover:bg-teal-50 transition-all shadow-sm"
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

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DKpi title="Today's Appointments" value="28" sub="Total scheduled" trend="4 follow-ups added" up={true} data={[{ v: 22 }, { v: 25 }, { v: 23 }, { v: 27 }, { v: 24 }, { v: 26 }, { v: 28 }]} color="#0D47A1" gid="d1" Icon={Calendar} />
        <DKpi title="Patients Waiting" value={String(waiting)} sub="In queue right now" trend="Avg wait: 18 min" up={true} data={[{ v: 8 }, { v: 6 }, { v: 9 }, { v: 5 }, { v: 7 }, { v: 4 }, { v: waiting }]} color="#F59E0B" gid="d2" Icon={Clock} />
        <DKpi title="Completed Today" value={String(completed)} sub="Consultations done" trend={`${Math.round(completed / 28 * 100)}% of today's list`} up={true} data={[{ v: 0 }, { v: 1 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: 3 }, { v: completed }]} color="#66BB6A" gid="d3" Icon={CheckSquare} />
        <DKpi title="Follow-ups Pending" value={String(DOC_FOLLOW_UPS.length)} sub="Scheduled this week" trend="1 urgent review" up={false} data={[{ v: 6 }, { v: 5 }, { v: 5 }, { v: 4 }, { v: 4 }, { v: 4 }, { v: DOC_FOLLOW_UPS.length }]} color="#EF4444" gid="d4" Icon={Heart} />
      </div>

      {/* ── Active Consultation Banner ── */}
      {current && (
        <div className="rounded-2xl border-2 border-[#009688]/30 p-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e6f9ff 100%)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#009688] animate-pulse" />
            <span className="text-xs font-bold text-[#009688] uppercase tracking-wide" style={{ fontFamily: PP }}>Active Consultation</span>
            <span className="ml-auto font-mono text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>Started {current.time}</span>
          </div>
          <div className="flex items-center gap-4">
            <Av name={current.patient} size="lg" />
            <div className="flex-1">
              <div className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>{current.patient}</div>
              <div className="text-sm text-[#64748B]" style={{ fontFamily: RB }}>{current.complaint} · {current.mrn}</div>
              <div className="flex items-center gap-3 mt-2">
                <Chip label="In Progress" variant="teal" />
                {current.room && <span className="text-xs font-semibold text-[#009688]" style={{ fontFamily: RB }}>{current.room}</span>}
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
                <CheckSquare size={13} /> Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Workspace ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Left: Schedule + Patient History */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Today's Schedule</div>
                <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>{DOC_SCHEDULE.length} appointments · {completed} completed</div>
              </div>
              <div className="flex items-center gap-3 text-[10px]" style={{ fontFamily: RB }}>
                {(['completed', 'in-progress', 'waiting', 'scheduled'] as ScheduleStatus[]).map(s => (
                  <div key={s} className="flex items-center gap-1.5 text-[#64748B]">
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />
                    {s === 'in-progress' ? 'Active' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                  </div>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {DOC_SCHEDULE.map(a => (
                <div key={a.time + a.patient}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${a.status === 'in-progress' ? 'bg-teal-50/30' : ''}`}>
                  <div className="font-mono text-xs font-bold text-[#0D47A1] shrink-0 w-12">{a.time}</div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[a.status]}`} />
                  <Av name={a.patient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#111827] truncate" style={{ fontFamily: RB }}>{a.patient}</div>
                    <div className="text-xs text-[#64748B] truncate" style={{ fontFamily: RB }}>{a.complaint}</div>
                  </div>
                  {a.room && <span className="text-xs font-semibold text-[#009688] shrink-0" style={{ fontFamily: RB }}>{a.room}</span>}
                  <div className="shrink-0">
                    {a.status === 'completed' && <Chip label="Done" variant="success" />}
                    {a.status === 'in-progress' && <Chip label="Active" variant="teal" />}
                    {a.status === 'waiting' && <Chip label="Waiting" variant="warning" />}
                    {a.status === 'scheduled' && <Chip label="Scheduled" variant="default" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patient History */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <SH title="Recent Patient History" sub="Previously seen patients" />
            </div>
            <div className="divide-y divide-gray-50">
              {DOC_PATIENT_HISTORY.map(p => (
                <div key={p.mrn} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors">
                  <Av name={p.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#111827] truncate" style={{ fontFamily: RB }}>{p.name}</div>
                    <div className="text-xs text-[#64748B] truncate" style={{ fontFamily: RB }}>{p.complaint}</div>
                  </div>
                  <div className="text-right shrink-0 max-w-[160px]">
                    <div className="text-xs font-medium text-[#111827] truncate" style={{ fontFamily: RB }}>{p.diagnosis}</div>
                    <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>{p.date}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">

          {/* Patient Queue */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Patient Queue</div>
                <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>{waiting} waiting · Avg 18 min</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse" />
                <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Live</span>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {DOC_SCHEDULE.filter(s => ['in-progress', 'waiting', 'scheduled'].includes(s.status)).slice(0, 5).map((a, i) => (
                <div key={a.patient}
                  className={`flex items-center gap-3 px-5 py-3.5 ${a.status === 'in-progress' ? 'bg-teal-50/40' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${a.status === 'in-progress' ? 'bg-[#009688] text-white' : 'bg-slate-100 text-[#64748B]'
                    }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#111827] truncate" style={{ fontFamily: RB }}>{a.patient}</div>
                    <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>{a.time} · {a.complaint}</div>
                  </div>
                  {a.status === 'in-progress' && <Chip label="Active" variant="teal" />}
                  {a.status === 'waiting' && <Chip label="Waiting" variant="warning" />}
                  {a.status === 'scheduled' && <Chip label="Next" variant="info" />}
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-50">
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors" style={{ fontFamily: PP }}>
                <Stethoscope size={13} /> Start Next Consultation
              </button>
            </div>
          </div>

          {/* Medical Alerts */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Medical Alerts" />
            <div className="space-y-2">
              {DOC_MEDICAL_ALERTS.map((a, i) => (
                <AlertRow key={i} level={a.level} msg={a.msg} time={a.time} sub={a.sub} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Pending Prescriptions */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Pending Prescriptions" sub="Awaiting your signature" />
          <div className="space-y-2.5">
            {PRESCRIPTIONS_PENDING.map(p => (
              <div key={p.patient} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <Pill size={12} className="text-[#009688]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#111827] truncate" style={{ fontFamily: PP }}>{p.patient}</div>
                  <div className="text-[10px] text-[#64748B] truncate" style={{ fontFamily: RB }}>{p.drugs}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: RB }}>Waiting {p.since}</div>
                </div>
                <button className="text-xs text-[#0D47A1] font-semibold hover:underline shrink-0" style={{ fontFamily: PP }}>Sign</button>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#009688] text-[#009688] text-xs font-semibold hover:bg-teal-50 transition-colors" style={{ fontFamily: PP }}>
            <Pill size={13} /> Write New Prescription
          </button>
        </div>

        {/* Diagnosis Summary */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Diagnosis Summary" sub="This month's case types" />
          <div className="space-y-3">
            {DOC_DIAGNOSIS.map(d => (
              <div key={d.condition}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{d.condition}</span>
                  <span className="font-mono text-xs font-semibold text-[#64748B]">{d.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.round((d.count / diagTotal) * 100)}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Total cases this month</span>
            <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>{diagTotal}</span>
          </div>
        </div>

        {/* Today's Activities + Upcoming Follow-ups */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Today's Activities" sub="Your clinical log" />
          <div>
            {DOC_ACTIVITIES.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 relative">
                {i < DOC_ACTIVITIES.length - 1 && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-100" />
                )}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 z-10" style={{ background: a.color + '18' }}>
                  <a.Icon size={12} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{a.action}</div>
                  <div className="text-[10px] text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>{a.detail}</div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0 pt-0.5">{a.time}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 mt-1">
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-3" style={{ fontFamily: PP }}>Upcoming Follow-ups</div>
            {DOC_FOLLOW_UPS.map(f => (
              <div key={f.patient} className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[#111827] truncate" style={{ fontFamily: RB }}>{f.patient}</div>
                  <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>{f.reason}</div>
                </div>
                <span className="text-[10px] text-[#64748B] font-mono shrink-0">{f.date.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 04 RECEPTION DASHBOARD ────────────────────────────────────────────────
export function ReceptionDashboard({ 
  onRegisterPatient,
  onPatientSearch,
  onCheckInClick,
  userRole = 'Receptionist',
  onNavigateNav,
  onPatientSelect,
  onEditPatient,
}: { 
  onRegisterPatient?: () => void
  onPatientSearch?: () => void
  onCheckInClick?: (token?: string, uhid?: string) => void
  userRole?: string
  onNavigateNav?: (nav: string) => void
  onPatientSelect?: (uhid: string) => void
  onEditPatient?: (uhid: string) => void
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
              <button onClick={() => onNavigateNav?.('billing')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#009688] hover:border-[#009688] hover:bg-teal-50/50 transition-all shadow-sm" style={{ fontFamily: PP }}>
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

          {/* Today's Registrations (Moved to Right Context Panel) */}
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

          {/* Upcoming Appointments (Moved to Right Context Panel) */}
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

          {/* Recent Activities */}
          {/* <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
              Recent Activities
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Latest Registration', desc: 'Aisha Kumar (UHID-892105)', time: '10 mins ago', type: 'reg' },
                { title: 'Latest Check-In', desc: 'Emma Reyes for Dr. Sunita Patel', time: '15 mins ago', type: 'checkin' },
                { title: 'Latest Appointment', desc: 'Booked: David Walsh (10:30 AM)', time: '22 mins ago', type: 'appt' },
                { title: 'Latest Queue Update', desc: 'TK-086 moved to In Consultation', time: '28 mins ago', type: 'queue' },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-[#0D47A1] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#111827]">{act.title}</div>
                    <div className="text-[11px] text-[#64748B] truncate">{act.desc}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* CARD 04: Notifications */}
          {/* <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>
                Notifications
              </h3>
              <span className="text-[10px] font-bold text-white bg-[#EF4444] px-2 py-0.5 rounded-full">3 Alerts</span>
            </div>
            <div className="space-y-2.5">
              <AlertRow level="info" msg="Upcoming Appointments: 4 patients scheduled between 11:00 AM - 12:00 PM." time="Now" />
              <AlertRow level="warning" msg="Patients Waiting: 3 patients in General OPD waiting > 20 mins." time="5m ago" />
              <AlertRow level="critical" msg="Queue Alerts: Token TK-088 marked for priority emergency check-in." time="12m ago" />
            </div>
          </div>  */}

        </div>

      </div>

    </div>
  )
}

// ─── 05 NURSE DASHBOARD ────────────────────────────────────────────────────
const NURSE_PATIENTS = [
  { name: 'Sarah Mitchell', room: 'OPD-1', bp: '145/92', hr: '88', temp: '37.2', spo2: '97', status: 'alert', nextCheck: '10:30' },
  { name: 'James Thornton', room: 'OPD-2', bp: '132/84', hr: '76', temp: '36.8', spo2: '98', status: 'stable', nextCheck: '11:00' },
  { name: 'Emma Reyes', room: 'OPD-5', bp: '118/76', hr: '82', temp: '37.0', spo2: '99', status: 'stable', nextCheck: '11:30' },
  { name: 'Robert Chen', room: 'OPD-3', bp: '152/98', hr: '94', temp: '37.8', spo2: '95', status: 'alert', nextCheck: '10:15' },
  { name: 'Aisha Kumar', room: 'OPD-4', bp: '120/78', hr: '70', temp: '36.6', spo2: '99', status: 'stable', nextCheck: '12:00' },
]

const NURSE_TASKS = [
  { task: 'Morning vitals round — OPD Wing A', done: true },
  { task: 'Patient check-in support — Reception', done: true },
  { task: 'Vitals update — Sarah Mitchell', done: false },
  { task: 'Vitals update — Robert Chen (urgent)', done: false },
  { task: 'Handover notes — end of shift', done: false },
  { task: 'Afternoon vitals round — OPD Wing B', done: false },
]

export function NurseDashboard() {
  const [tasks, setTasks] = useState(NURSE_TASKS.map(t => ({ ...t })))
  const doneTasks = tasks.filter(t => t.done).length

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DKpi title="Assigned Patients" value="14" sub="Today's vitals queue" trend="2 check-outs today" up={true} data={[{ v: 16 }, { v: 15 }, { v: 15 }, { v: 14 }, { v: 16 }, { v: 15 }, { v: 14 }]} color="#0D47A1" gid="n1" Icon={Users} />
        <DKpi title="Vitals Pending" value="6" sub="Due this hour" trend="3 overdue — urgent" up={false} data={[{ v: 3 }, { v: 4 }, { v: 2 }, { v: 6 }, { v: 5 }, { v: 7 }, { v: 6 }]} color="#EF4444" gid="n2" Icon={Activity} />
        <DKpi title="Check-Ins Today" value="34" sub="Patients checked in" trend="+6 from avg" up={true} data={[{ v: 22 }, { v: 26 }, { v: 25 }, { v: 28 }, { v: 30 }, { v: 32 }, { v: 34 }]} color="#F59E0B" gid="n3" Icon={CheckSquare} />
        <DKpi title="Tasks Complete" value={`${doneTasks}/${tasks.length}`} sub="Today's checklist" trend={`${Math.round(doneTasks / tasks.length * 100)}% done`} up={true} data={[{ v: 1 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: doneTasks }]} color="#66BB6A" gid="n4" Icon={CheckSquare} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Patient Monitoring */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <SH title="Vitals Queue" sub="Today's vitals check status" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Patient', 'Room', 'BP', 'HR', 'Temp', 'SpO₂', 'Next Check', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {NURSE_PATIENTS.map(p => (
                  <tr key={p.name} className={`hover:bg-slate-50 transition-colors ${p.status === 'alert' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Av name={p.name} size="sm" />
                        <span className="text-sm font-medium text-[#111827] truncate max-w-[120px]" style={{ fontFamily: RB }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#64748B]">{p.room}</td>
                    <td className={`px-4 py-3 font-mono text-xs font-bold ${parseInt(p.bp) > 140 ? 'text-[#EF4444]' : 'text-[#111827]'}`}>{p.bp}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#111827]">{p.hr}</td>
                    <td className={`px-4 py-3 font-mono text-xs font-semibold ${parseFloat(p.temp) > 37.5 ? 'text-[#EF4444]' : 'text-[#111827]'}`}>{p.temp}°C</td>
                    <td className={`px-4 py-3 font-mono text-xs font-bold ${parseInt(p.spo2) < 96 ? 'text-[#EF4444]' : 'text-[#66BB6A]'}`}>{p.spo2}%</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#0D47A1] font-semibold">{p.nextCheck}</td>
                    <td className="px-4 py-3">
                      {p.status === 'alert' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#EF4444] bg-red-50 px-1.5 py-0.5 rounded-full" style={{ fontFamily: RB }}>
                          <AlertTriangle size={8} /> ALERT
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Medication + Tasks */}
        <div className="flex flex-col gap-5">
          {/* Quick Notes */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Quick Notes" sub="Clinical observations" />
            <div className="space-y-2.5">
              {[
                { note: 'Sarah Mitchell — BP elevated, re-check in 30 min', time: '09:15', color: '#EF4444' },
                { note: 'Robert Chen — SpO₂ 95%, monitor closely', time: '09:42', color: '#F59E0B' },
                { note: 'Emma Reyes — vitals normal, next check 11:30', time: '10:05', color: '#66BB6A' },
                { note: 'James Thornton — stable, afternoon check scheduled', time: '10:22', color: '#009688' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                  <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: n.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#111827] leading-snug" style={{ fontFamily: RB }}>{n.note}</div>
                    <span className="font-mono text-[10px] text-[#64748B]">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#0D47A1] text-[#0D47A1] text-xs font-semibold hover:bg-blue-50 transition-colors" style={{ fontFamily: PP }}>
              + Add Note
            </button>
          </div>

          {/* Tasks Checklist */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Today's Tasks" sub={`${doneTasks}/${tasks.length} completed`} />
            <div className="space-y-2">
              {tasks.map((t, i) => (
                <div key={i}
                  className="flex items-start gap-2.5 cursor-pointer group"
                  onClick={() => setTasks(prev => prev.map((p, j) => j === i ? { ...p, done: !p.done } : p))}>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 mt-0.5 transition-all ${t.done ? 'bg-[#0D47A1] border-[#0D47A1]' : 'border-gray-300 group-hover:border-[#0D47A1]'}`}>
                    {t.done && <Check size={9} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-xs leading-snug transition-colors ${t.done ? 'text-[#64748B] line-through' : 'text-[#111827]'}`} style={{ fontFamily: RB }}>{t.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 06 ACCOUNTANT DASHBOARD ───────────────────────────────────────────────
const TRANSACTIONS = [
  { invoice: 'INV-847', patient: 'Sarah Mitchell', service: 'OPD Consultation', amount: 488.00, status: 'paid', date: 'Today 09:20' },
  { invoice: 'INV-848', patient: 'James Thornton', service: 'Consultation + Follow-up', amount: 228.00, status: 'pending', date: 'Today 09:45' },
  { invoice: 'INV-849', patient: 'Emma Reyes', service: 'Prenatal Consultation', amount: 320.00, status: 'paid', date: 'Today 10:12' },
  { invoice: 'INV-850', patient: 'Robert Chen', service: 'Cardiology Consultation', amount: 395.00, status: 'pending', date: 'Today 10:30' },
  { invoice: 'INV-851', patient: 'Marcus Brown', service: 'BP Monitoring Consultation', amount: 175.00, status: 'paid', date: 'Today 11:00' },
  { invoice: 'INV-852', patient: 'Aisha Kumar', service: 'Neurology Consultation', amount: 290.00, status: 'paid', date: 'Today 11:15' },
]

const MONTHLY_REV = [
  { month: 'Aug', v: 18200 },
  { month: 'Sep', v: 21500 },
  { month: 'Oct', v: 19800 },
  { month: 'Nov', v: 24100 },
  { month: 'Dec', v: 22400 },
  { month: 'Jan', v: 24850 },
]

const ACC_PAYMENT_METHODS = [
  { method: 'Cash', amount: 8240, total: 27950, color: '#009688' },
  { method: 'Credit / Debit', amount: 11650, total: 27950, color: '#0D47A1' },
  { method: 'Corporate Pay', amount: 5840, total: 27950, color: '#4DB6AC' },
  { method: 'UPI / Online', amount: 2220, total: 27950, color: '#66BB6A' },
]

const ACC_ACTIVITY = [
  { Icon: Check, msg: 'Payment collected', detail: 'INV-847 · Sarah Mitchell · $488', time: '09:20', color: '#66BB6A' },
  { Icon: Receipt, msg: 'Invoice generated', detail: 'INV-848 · James Thornton · $228', time: '09:45', color: '#0D47A1' },
  { Icon: Check, msg: 'Payment collected', detail: 'INV-849 · Emma Reyes · $320', time: '10:12', color: '#66BB6A' },
  { Icon: Clock, msg: 'Invoice pending', detail: 'INV-850 · Robert Chen · $395', time: '10:30', color: '#F59E0B' },
  { Icon: Download, msg: 'Refund processed', detail: 'INV-832 · Nina Patel · $45', time: '10:55', color: '#EF4444' },
  { Icon: Receipt, msg: 'Invoice generated', detail: 'INV-853 · Aisha Kumar · $290', time: '11:15', color: '#0D47A1' },
]

const ACC_BILLING_SUMMARY = [
  { label: 'OPD Consultations', count: 28, amount: 12640, color: '#0D47A1' },
  { label: 'Follow-up Visits', count: 14, amount: 5320, color: '#009688' },
  { label: 'Specialist Visits', count: 9, amount: 4860, color: '#4DB6AC' },
  { label: 'Check-up Packages', count: 6, amount: 3240, color: '#66BB6A' },
  { label: 'Billing Adjustments', count: 3, amount: 890, color: '#F59E0B' },
]

const ACC_QUICK_ACTIONS = [
  { label: 'Generate Invoice', Icon: Receipt, color: '#0D47A1' },
  { label: 'Collect Payment', Icon: CreditCard, color: '#009688' },
  { label: 'Process Refund', Icon: Download, color: '#EF4444' },
  { label: 'Financial Reports', Icon: BarChart2, color: '#64748B' },
]

export function AccountantDashboard() {
  const totalCollected = ACC_PAYMENT_METHODS.reduce((s, m) => s + m.amount, 0)
  const billTotal = ACC_BILLING_SUMMARY.reduce((s, b) => s + b.amount, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">

      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Quick Actions</span>
        {ACC_QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}>
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm" style={{ fontFamily: PP }}>
            <Receipt size={13} /> New Invoice
          </button>
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DKpi title="Revenue Today" value="$27.9K" sub="Gross collections" trend="+12% vs yesterday" up={true} data={[{ v: 18 }, { v: 21 }, { v: 19 }, { v: 24 }, { v: 22 }, { v: 26 }, { v: 27.9 }]} color="#0D47A1" gid="ac1" Icon={DollarSign} />
        <DKpi title="Pending Payments" value="$8.4K" sub="Awaiting settlement" trend="18 invoices pending" up={false} data={[{ v: 11 }, { v: 9 }, { v: 12 }, { v: 8 }, { v: 10 }, { v: 9 }, { v: 8.4 }]} color="#F59E0B" gid="ac2" Icon={Clock} />
        <DKpi title="Collected Today" value="$16.4K" sub="Payments received" trend="+8% from morning" up={true} data={[{ v: 8 }, { v: 10 }, { v: 11 }, { v: 13 }, { v: 14 }, { v: 15 }, { v: 16.4 }]} color="#66BB6A" gid="ac3" Icon={Check} />
        <DKpi title="Refund Requests" value="3" sub="Pending review" trend="1 approved today" up={false} data={[{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 3 }, { v: 3 }]} color="#EF4444" gid="ac4" Icon={Download} />
      </div>

      {/* ── Main Workspace ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Invoice List (2/3) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Invoice List</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                {TRANSACTIONS.length} invoices today · {TRANSACTIONS.filter(t => t.status === 'paid').length} paid
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50 transition-colors" style={{ fontFamily: RB }}>
                <Download size={11} /> Export
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/60">
                {['Invoice', 'Patient', 'Service', 'Amount', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]" style={{ fontFamily: RB }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TRANSACTIONS.map(t => (
                <tr key={t.invoice} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-semibold text-[#0D47A1]">{t.invoice}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Av name={t.patient} size="sm" />
                      <span className="text-sm font-medium text-[#111827] truncate max-w-[110px]" style={{ fontFamily: RB }}>{t.patient}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-[#64748B] truncate max-w-[140px] block" style={{ fontFamily: RB }}>{t.service}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-sm font-bold text-[#111827]">${t.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Chip
                      label={t.status === 'paid' ? 'Paid' : 'Pending'}
                      variant={t.status === 'paid' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#64748B]" style={{ fontFamily: RB }}>{t.date}</td>
                  <td className="px-5 py-3.5">
                    {t.status === 'pending'
                      ? <button className="text-xs font-semibold text-[#009688] hover:underline" style={{ fontFamily: PP }}>Collect</button>
                      : <button className="text-xs font-medium text-[#64748B] hover:underline" style={{ fontFamily: RB }}>View</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Showing {TRANSACTIONS.length} of 47 invoices today</span>
            <button className="text-xs text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>View all invoices →</button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Payment Collection */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Payment Collection" sub="Today's breakdown by method" />
            <div className="text-center mb-5">
              <div className="text-3xl font-bold text-[#111827]" style={{ fontFamily: PP }}>${(totalCollected / 1000).toFixed(1)}K</div>
              <div className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Total collected today</div>
            </div>
            <div className="space-y-3">
              {ACC_PAYMENT_METHODS.map(m => (
                <div key={m.method}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                      <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{m.method}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#111827]">${(m.amount / 1000).toFixed(1)}K</span>
                      <span className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>{Math.round(m.amount / m.total * 100)}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.round(m.amount / m.total * 100)}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors" style={{ fontFamily: PP }}>
              <CreditCard size={13} /> Collect Payment
            </button>
          </div>

          {/* Billing Summary */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Billing Summary" sub="By service category" />
            <div className="space-y-0">
              {ACC_BILLING_SUMMARY.map(b => (
                <div key={b.label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: b.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#111827] truncate" style={{ fontFamily: RB }}>{b.label}</div>
                    <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>{b.count} transactions</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#111827]">${(b.amount / 1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Total</span>
              <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>${(billTotal / 1000).toFixed(1)}K</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Monthly Revenue" sub="6-month trend" />
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={MONTHLY_REV} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: RB }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v: unknown) => [`$${(Number(v) / 1000).toFixed(1)}K`, 'Revenue']}
                contentStyle={{ fontSize: 11, fontFamily: RB, border: '1px solid #E5E7EB', borderRadius: 8 }}
              />
              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                {MONTHLY_REV.map((_, i) => (
                  <Cell key={i} fill={i === MONTHLY_REV.length - 1 ? '#0D47A1' : '#E2E8F0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>This month</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>$24.9K</span>
                <span className="flex items-center gap-0.5 text-xs text-[#66BB6A] font-medium" style={{ fontFamily: RB }}>
                  <TrendingUp size={11} /> +9%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Collected', value: '$16.4K', color: '#66BB6A', bg: 'bg-green-50' },
                { label: 'Pending', value: '$8.5K', color: '#F59E0B', bg: 'bg-amber-50' },
              ].map(m => (
                <div key={m.label} className={`${m.bg} rounded-xl p-3 border border-gray-100`}>
                  <div className="text-[10px] mb-0.5" style={{ fontFamily: RB, color: m.color }}>{m.label}</div>
                  <div className="text-sm font-bold" style={{ fontFamily: PP, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Recent Transactions" sub="Today's payment activity" />
          <div>
            {ACC_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-3.5 last:pb-0 relative">
                {i < ACC_ACTIVITY.length - 1 && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-100" />
                )}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 z-10" style={{ background: a.color + '15' }}>
                  <a.Icon size={12} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{a.msg}</div>
                  <div className="text-[10px] text-[#64748B] truncate mt-0.5" style={{ fontFamily: RB }}>{a.detail}</div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0 pt-0.5">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status Summary */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Payment Status" sub="Today's collection overview" action={
            <button className="text-xs text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>View All</button>
          } />
          <div className="space-y-3 mb-4">
            {[
              { label: 'Collected', value: 16430, total: 27950, color: '#66BB6A', bg: 'bg-green-50' },
              { label: 'Pending', value: 8420, total: 27950, color: '#F59E0B', bg: 'bg-amber-50' },
              { label: 'Refunded', value: 320, total: 27950, color: '#EF4444', bg: 'bg-red-50' },
            ].map(p => (
              <ProgressBar key={p.label} label={p.label} value={p.value} total={p.total} color={p.color}
                sub={`$${(p.value / 1000).toFixed(1)}K`} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            {[
              { label: 'Invoices', value: '47', color: '#0D47A1' },
              { label: 'Paid', value: '29', color: '#66BB6A' },
              { label: 'Pending', value: '18', color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className="text-center py-2 rounded-xl bg-slate-50">
                <div className="text-sm font-bold" style={{ fontFamily: PP, color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-[#64748B]" style={{ fontFamily: RB }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-800 transition-colors" style={{ fontFamily: PP }}>
            Generate Financial Report
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── 07 PATIENT PORTAL ─────────────────────────────────────────────────────
export const PAT_PRESCRIPTIONS = [
  { drug: 'Metoprolol 25mg', freq: 'Once daily — Morning', remaining: 18, total: 30, doctor: 'Dr. A. Mehta' },
  { drug: 'Aspirin 75mg', freq: 'Once daily — Evening', remaining: 22, total: 30, doctor: 'Dr. A. Mehta' },
  { drug: 'Atorvastatin 10mg', freq: 'Once daily — Night', remaining: 7, total: 30, doctor: 'Dr. A. Mehta' },
]

export const PAT_BILLS = [
  { invoice: 'INV-847', service: 'Cardiology OPD Consultation', amount: 97.60, due: 'Due Today', status: 'unpaid' },
  { invoice: 'INV-831', service: 'General Medicine Consultation', amount: 45.00, due: 'Due Mar 20', status: 'unpaid' },
  { invoice: 'INV-810', service: 'Follow-up Checkup', amount: 28.00, due: 'Paid Mar 12', status: 'paid' },
]

export const PAT_HISTORY = [
  { date: 'Mar 12, 2025', complaint: 'Chest pain, shortness of breath', doctor: 'Dr. A. Mehta', diagnosis: 'Stable angina', status: 'completed' },
  { date: 'Feb 20, 2025', complaint: 'Routine cardiac checkup', doctor: 'Dr. A. Mehta', diagnosis: 'Normal cardiac rhythm', status: 'completed' },
  { date: 'Jan 08, 2025', complaint: 'High BP monitoring', doctor: 'Dr. P. Sharma', diagnosis: 'Hypertension stage I', status: 'completed' },
  { date: 'Dec 14, 2024', complaint: 'Annual health check', doctor: 'Dr. A. Mehta', diagnosis: 'All clear', status: 'completed' },
]

export function PatientDashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]">

      {/* ── Header & Breadcrumbs ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Welcome back, Sarah Mitchell</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Patient Portal</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors shadow-sm" style={{ fontFamily: PP }}>
            <Download size={14} className="text-[#0D47A1]" /> Download Medical Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm" style={{ fontFamily: PP }}>
            <Calendar size={14} /> Book Appointment
          </button>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Quick Actions</span>
        {[
          { label: 'Book Appointment', Icon: Calendar, color: '#009688' },
          { label: 'View Medical History', Icon: FileText, color: '#0D47A1' },
          { label: 'View Prescriptions', Icon: Pill, color: '#009688' },
          { label: 'View Bills', Icon: Receipt, color: '#F59E0B' },
          { label: 'Update Profile', Icon: User, color: '#0D47A1' },
        ].map(({ label, Icon, color }) => (
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

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Upcoming Appointment', value: 'Mar 15, 10:30 AM', sub: 'Dr. A. Mehta (Cardiology)', Icon: Calendar, color: '#0D47A1', bg: 'bg-blue-50' },
          { label: 'Outstanding Bills', value: '$142.60', sub: '2 invoices pending', Icon: Receipt, color: '#F59E0B', bg: 'bg-amber-50' },
          { label: 'Active Prescriptions', value: '3 Active', sub: 'Metoprolol, Aspirin...', Icon: Pill, color: '#009688', bg: 'bg-teal-50' },
          { label: 'Recent Visit', value: 'Mar 12, 2025', sub: 'Stable Angina Review', Icon: Stethoscope, color: '#4DB6AC', bg: 'bg-teal-50' },
          { label: 'Notifications', value: '3 New', sub: '1 Reminder, 1 Bill, 1 Rx', Icon: Bell, color: '#EF4444', bg: 'bg-red-50' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.Icon size={18} style={{ color: card.color }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium" style={{ fontFamily: RB }}>{card.label}</div>
              <div className="text-base font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{card.value}</div>
              <div className="text-[11px] text-slate-400 mt-1 truncate" style={{ fontFamily: RB }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Upcoming Appointment & Recent Notifications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Upcoming Appointment Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-[#009688]/30 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#009688]" />
                <span className="text-xs font-bold text-[#009688] uppercase tracking-wider" style={{ fontFamily: PP }}>Upcoming Appointment</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-[#66BB6A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" /> Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-gray-100 mb-4">
              <div>
                <span className="block text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Doctor</span>
                <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Dr. Arjun Mehta</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Department</span>
                <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Cardiology (OPD A)</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Appointment Date</span>
                <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Sat, Mar 15, 2025</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Appointment Time</span>
                <span className="text-sm font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>10:30 AM</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-[#0D47A1]" style={{ fontFamily: RB }}>
                <Building2 size={16} className="text-[#0D47A1]" />
                <span><strong>OPD Location:</strong> Cardiology Wing A · Room 204 (Check-in 10 mins prior)</span>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors shrink-0" style={{ fontFamily: PP }}>
                View OPD Directions
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <button className="px-4 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors" style={{ fontFamily: PP }}>
              Confirm Attendance
            </button>
            <button className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#64748B] font-medium hover:bg-slate-50 transition-colors" style={{ fontFamily: RB }}>
              Reschedule Slot
            </button>
            <button className="px-4 py-2 rounded-xl border border-[#EF4444]/30 text-xs text-[#EF4444] font-medium hover:bg-red-50 transition-colors ml-auto" style={{ fontFamily: RB }}>
              Cancel Appointment
            </button>
          </div>
        </div>

        {/* Recent Notifications Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-50">
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Recent Notifications</span>
              <span className="text-[10px] font-bold text-white bg-[#EF4444] px-2 py-0.5 rounded-full">3 New</span>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Appointment Reminder', msg: 'Cardiology follow-up with Dr. Mehta tomorrow at 10:30 AM', time: '2 hours ago', icon: Calendar, color: '#009688', bg: 'bg-teal-50' },
                { title: 'Prescription Ready', msg: 'Atorvastatin & Metoprolol refilled at Main Pharmacy', time: '5 hours ago', icon: Pill, color: '#4DB6AC', bg: 'bg-teal-50' },
                { title: 'Bill Generated', msg: 'Invoice #INV-847 for $97.60 is ready for payment', time: '1 day ago', icon: Receipt, color: '#F59E0B', bg: 'bg-amber-50' },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-slate-50 hover:bg-white transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.bg}`}>
                    <notif.icon size={15} style={{ color: notif.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{notif.title}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5 leading-snug" style={{ fontFamily: RB }}>{notif.msg}</div>
                    <div className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: RB }}>{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-3 w-full py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#0D47A1] font-semibold hover:bg-blue-50 transition-colors" style={{ fontFamily: PP }}>
            View All Notifications
          </button>
        </div>
      </div>

      {/* ── Prescriptions & Outstanding Bills ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Recent Prescriptions</h3>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Active medication orders</p>
              </div>
              <button className="text-xs text-[#0D47A1] font-semibold hover:underline flex items-center gap-1" style={{ fontFamily: RB }}>
                <Download size={12} /> Download All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3">Medicine</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Issue Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#111827]">
                  {[
                    { drug: 'Metoprolol 25mg', freq: '1 Tab OD (Morning)', doctor: 'Dr. A. Mehta', date: 'Mar 10, 2025', status: 'Active' },
                    { drug: 'Aspirin 75mg', freq: '1 Tab OD (Evening)', doctor: 'Dr. A. Mehta', date: 'Mar 10, 2025', status: 'Active' },
                    { drug: 'Atorvastatin 10mg', freq: '1 Tab HS (Night)', doctor: 'Dr. A. Mehta', date: 'Feb 20, 2025', status: 'Refill Ready' },
                    { drug: 'Amoxicillin 500mg', freq: '1 Cap TDS (5 days)', doctor: 'Dr. P. Sharma', date: 'Jan 15, 2025', status: 'Completed' },
                  ].map((rx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-[#111827]">
                        {rx.drug}
                        <span className="block text-[10px] text-slate-400 font-normal">{rx.freq}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{rx.doctor}</td>
                      <td className="px-4 py-3 text-slate-500">{rx.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${rx.status === 'Active' ? 'bg-teal-50 text-[#009688]' :
                          rx.status === 'Refill Ready' ? 'bg-amber-50 text-[#F59E0B]' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                          {rx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border-t border-gray-100 text-center">
            <button className="text-xs text-[#0D47A1] font-bold hover:underline" style={{ fontFamily: PP }}>View All Prescriptions →</button>
          </div>
        </div>

        {/* Outstanding Bills */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Outstanding Bills</h3>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Pending invoices & payment history</p>
              </div>
              <span className="text-xs font-bold text-[#F59E0B] bg-amber-50 px-2.5 py-1 rounded-full" style={{ fontFamily: PP }}>$142.60 Total Due</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#111827]">
                  {[
                    { invoice: 'INV-847', desc: 'Cardiology OPD Consultation', amount: '$97.60', due: 'Due Today', status: 'Unpaid' },
                    { invoice: 'INV-831', desc: 'General Medicine Consultation', amount: '$45.00', due: 'Mar 20, 2025', status: 'Pending' },
                    { invoice: 'INV-810', desc: 'Follow-up Checkup', amount: '$28.00', due: 'Paid Mar 12', status: 'Paid' },
                  ].map((bill, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">
                        {bill.invoice}
                        <span className="block text-[10px] font-sans font-normal text-slate-400">{bill.desc}</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[#111827]">{bill.amount}</td>
                      <td className="px-4 py-3 text-slate-500">{bill.due}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${bill.status === 'Unpaid' ? 'bg-red-50 text-[#EF4444]' :
                          bill.status === 'Pending' ? 'bg-amber-50 text-[#F59E0B]' :
                            'bg-green-50 text-[#66BB6A]'
                          }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {bill.status !== 'Paid' ? (
                          <button className="px-3 py-1 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors" style={{ fontFamily: PP }}>
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#66BB6A] font-semibold">✓ Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>2 pending invoices requiring action</span>
            <button className="px-4 py-2 rounded-xl bg-[#F59E0B] text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm" style={{ fontFamily: PP }}>
              Pay All Pending ($142.60)
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
