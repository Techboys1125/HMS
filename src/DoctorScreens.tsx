import { useState } from 'react'
import {
  Clock, User, ChevronRight, ChevronLeft,
  Stethoscope, FileText, Pill, Activity, Heart,
  Thermometer, Droplets, Plus, Download, Check,
  AlertTriangle, Phone, Search,
  TrendingUp, TrendingDown, ClipboardList,
  Edit3, Save, X, Eye,
  ArrowRight, Building2, CheckCircle2, Printer, ChevronDown, Trash2, Copy
} from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { AppointmentManagementCenterScreen } from './AppointmentManagement'
import safeHandsLogo from './assets/safehandshospital_logo.webp'

// ─── Design Tokens ────────────────────────────────────────────────────────────
const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

// ─── Shared Types ─────────────────────────────────────────────────────────────

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

// ─── Data ─────────────────────────────────────────────────────────────────────
const VITALS_DATA = [
  { label: 'Blood Pressure', value: '145/92', unit: 'mmHg', Icon: Activity, status: 'high', color: '#EF4444', normal: '120/80' },
  { label: 'Heart Rate', value: '88', unit: 'bpm', Icon: Heart, status: 'normal', color: '#009688', normal: '60–100' },
  { label: 'Temperature', value: '37.2', unit: '°C', Icon: Thermometer, status: 'normal', color: '#009688', normal: '36.5–37.5' },
  { label: 'SpO₂', value: '97', unit: '%', Icon: Droplets, status: 'normal', color: '#009688', normal: '>95' },
]

const MEDICATIONS = [
  { id: 1, name: 'Amlodipine', dose: '5mg', freq: 'Once daily', route: 'Oral', status: 'active', refill: '22 days' },
  { id: 2, name: 'Metformin', dose: '500mg', freq: 'Twice daily', route: 'Oral', status: 'active', refill: '15 days' },
  { id: 3, name: 'Atorvastatin', dose: '20mg', freq: 'Once nightly', route: 'Oral', status: 'active', refill: '30 days' },
  { id: 4, name: 'Aspirin', dose: '75mg', freq: 'Once daily', route: 'Oral', status: 'active', refill: '28 days' },
  { id: 5, name: 'GTN Spray', dose: '0.4mg', freq: 'PRN chest pain', route: 'Sublingual', status: 'prn', refill: '60 days' },
]



const WEEKLY_CONSULTATIONS = [
  { day: 'Mon', count: 18 }, { day: 'Tue', count: 22 }, { day: 'Wed', count: 17 },
  { day: 'Thu', count: 25 }, { day: 'Fri', count: 21 }, { day: 'Sat', count: 9 }, { day: 'Sun', count: 0 },
]

const TIMELINE = [
  { time: '08:45', event: 'Patient registered at reception', by: 'Receptionist' },
  { time: '09:00', event: 'Appointment confirmed', by: 'System' },
  { time: '09:05', event: 'Checked in — OPD Wing A', by: 'Receptionist' },
  { time: '09:12', event: 'Vitals recorded by nursing staff', by: 'Nurse R. Singh' },
  { time: '09:20', event: 'Consultation started', by: 'Dr. A. Mehta' },
]

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>{title}</h1>
        {sub && <p className="text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm shadow-slate-50 ${className}`}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — Doctor Appointments (Today's Schedule)
// ═══════════════════════════════════════════════════════════════════════════════
export function DoctorAppointmentsScreen({ onStartConsultation }: { onStartConsultation?: (id: number) => void }) {
  return (
    <AppointmentManagementCenterScreen
      userRole="Doctor"
      onStartConsultation={() => onStartConsultation?.(1)}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — Consultation Workspace
// ═══════════════════════════════════════════════════════════════════════════════
type ConsultTab = 'overview' | 'vitals' | 'soap' | 'prescription' | 'history'

const CONSULT_TABS: { id: ConsultTab; label: string; Icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', Icon: User },
  { id: 'vitals', label: 'Vitals', Icon: Activity },
  { id: 'soap', label: 'Clinical Notes', Icon: ClipboardList },
  { id: 'prescription', label: 'Prescription', Icon: Pill },
  { id: 'history', label: 'History', Icon: FileText },
]

export function DoctorConsultationScreen({ onBack }: { onBack?: () => void }) {
  const [tab, setTab] = useState<ConsultTab>('overview')
  const [soapData, setSoapData] = useState({
    subjective: 'Patient presents with severe chest pain radiating to left arm, onset 2 hours ago. Associated with diaphoresis and nausea. Pain rated 8/10.',
    objective: 'BP 145/92 mmHg, HR 88 bpm, SpO2 97%, Temp 37.2°C. Patient appears distressed. Chest wall non-tender.',
    assessment: 'R07.9 — Chest pain, unspecified. Rule out NSTEMI / ACS. Differential includes musculoskeletal and GERD.',
    plan: 'Serial ECGs, cardiac biomarkers. Aspirin 300mg stat. GTN PRN. Cardiology consult if troponin elevated. Admit for observation.',
  })

  return (
    <div className="flex-1 overflow-hidden flex bg-[#F1F5F9]">
      {/* ── Left Panel: Patient Summary ── */}
      <div className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
        <div className="p-5 border-b border-gray-50">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0D47A1] mb-4 transition-colors font-medium" style={{ fontFamily: RB }}>
              <ChevronLeft size={13} /> Back
            </button>
          )}
          {/* Active alert */}
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-teal-50 border border-teal-100 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#009688] animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-[#009688]" style={{ fontFamily: PP }}>Consultation Active</span>
          </div>
          <Avatar name="Sarah Mitchell" size="lg" />
          <div className="mt-3">
            <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>Sarah Mitchell</div>
            <div className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: RB }}>Female · 34 years · Blood A+</div>
            <div className="font-mono text-xs text-[#0D47A1] mt-1.5 bg-blue-50 px-2 py-0.5 rounded-md inline-block">MRN-2024-001</div>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1">
          {/* Allergies */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: PP }}>Allergies</div>
            <div className="flex flex-wrap gap-1.5">
              {['Penicillin', 'Aspirin'].map(a => (
                <span key={a} className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full border border-red-100 font-semibold" style={{ fontFamily: PP }}>⚠ {a}</span>
              ))}
            </div>
          </div>

          {/* Patient info */}
          <div className="space-y-2.5">
            {[
              { label: 'Phone', value: '+1 (555) 234-5678', Icon: Phone },
              { label: 'Doctor', value: 'Dr. A. Mehta', Icon: Stethoscope },
              { label: 'Room', value: 'OPD Wing A', Icon: Building2 },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={12} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide" style={{ fontFamily: PP }}>{label}</div>
                  <div className="text-xs text-slate-700 font-medium" style={{ fontFamily: RB }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Visit Timeline */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3" style={{ fontFamily: PP }}>Visit Timeline</div>
            <div className="space-y-0">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] mt-1 shrink-0" />
                    {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-gray-100 my-0.5" />}
                  </div>
                  <div className="pb-3">
                    <div className="font-mono text-[10px] text-slate-400">{t.time}</div>
                    <div className="text-[11px] text-slate-700 leading-snug" style={{ fontFamily: RB }}>{t.event}</div>
                    <div className="text-[10px] text-slate-400" style={{ fontFamily: RB }}>{t.by}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complete button */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#009688] text-white text-sm font-semibold hover:bg-[#00827a] transition-colors" style={{ fontFamily: PP }}>
            <Check size={14} /> Complete Consultation
          </button>
        </div>
      </div>

      {/* ── Right Panel: Tabbed Workspace ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Bar */}
        <div className="bg-white border-b border-gray-100 px-5 flex items-center gap-1 shrink-0">
          {CONSULT_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all -mb-px ${tab === id
                  ? 'border-[#0D47A1] text-[#0D47A1]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
                }`}
              style={{ fontFamily: PP }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-4">
              {/* Chief complaint */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={15} className="text-[#EF4444]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide" style={{ fontFamily: PP }}>Chief Complaint</div>
                    <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Chest Pain — High Priority</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: RB }}>
                  Severe chest pain radiating to left arm, onset 2 hours ago. Associated with diaphoresis and nausea. Pain rated 8/10.
                  No prior similar episodes. PMH: Hypertension, Type 2 Diabetes.
                </p>
              </Card>

              {/* Vitals snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {VITALS_DATA.map(v => (
                  <Card key={v.label} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <v.Icon size={14} style={{ color: v.color }} />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${v.status === 'high' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`} style={{ fontFamily: PP }}>
                        {v.status === 'high' ? 'HIGH' : 'OK'}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-[#111827] leading-none" style={{ fontFamily: PP }}>{v.value}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: RB }}>{v.unit}</div>
                    <div className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: RB }}>{v.label}</div>
                  </Card>
                ))}
              </div>

              {/* Known conditions */}
              <Card className="p-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>Known Conditions & PMH</div>
                <div className="flex flex-wrap gap-2">
                  {['Hypertension', 'Type 2 Diabetes', 'Hyperlipidaemia', 'Ex-smoker'].map(c => (
                    <span key={c} className="px-2.5 py-1 bg-blue-50 text-[#0D47A1] text-xs rounded-full font-medium border border-blue-100" style={{ fontFamily: RB }}>{c}</span>
                  ))}
                </div>
              </Card>

              {/* Current meds quick view */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide" style={{ fontFamily: PP }}>Current Medications</div>
                  <button onClick={() => setTab('prescription')} className="text-xs text-[#0D47A1] font-medium hover:underline flex items-center gap-1" style={{ fontFamily: RB }}>
                    Manage <ArrowRight size={11} />
                  </button>
                </div>
                <div className="space-y-2">
                  {MEDICATIONS.slice(0, 3).map(m => (
                    <div key={m.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-[#009688]/10 flex items-center justify-center shrink-0">
                        <Pill size={12} className="text-[#009688]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#111827] truncate" style={{ fontFamily: PP }}>{m.name} {m.dose}</div>
                        <div className="text-[10px] text-slate-400" style={{ fontFamily: RB }}>{m.freq} · {m.route}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${m.status === 'prn' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`} style={{ fontFamily: PP }}>
                        {m.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* VITALS */}
          {tab === 'vitals' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {VITALS_DATA.map(v => (
                  <Card key={v.label} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: v.color + '18' }}>
                        <v.Icon size={16} style={{ color: v.color }} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${v.status === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`} style={{ fontFamily: PP }}>
                        {v.status === 'high' ? '▲ HIGH' : '✓ NORMAL'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#111827] leading-none" style={{ fontFamily: PP }}>{v.value}</div>
                    <div className="text-xs text-slate-400 mt-1" style={{ fontFamily: RB }}>{v.unit} · {v.label}</div>
                    <div className="text-[10px] text-slate-300 mt-2 pt-2 border-t border-gray-50" style={{ fontFamily: RB }}>Normal: {v.normal}</div>
                  </Card>
                ))}
              </div>

              {/* Recording time */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Vitals Trend — Today</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400" style={{ fontFamily: RB }}>
                    <Clock size={11} /> Recorded at 09:12 by Nurse R. Singh
                  </div>
                </div>
                {/* BP chart */}
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { t: '08:00', sys: 138, dia: 88 }, { t: '09:12', sys: 145, dia: 92 },
                    ]} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: RB }} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[60, 180]} />
                      <Tooltip contentStyle={{ fontSize: 11, fontFamily: RB, borderRadius: 8 }} />
                      <Bar dataKey="sys" name="Systolic" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dia" name="Diastolic" fill="#0D47A1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400" style={{ fontFamily: RB }}>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#EF4444]" /> Systolic</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#0D47A1]" /> Diastolic</span>
                </div>
              </Card>

              {/* Add vitals */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Record New Vitals</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Blood Pressure', 'Heart Rate', 'Temperature', 'SpO₂'].map(field => (
                    <div key={field}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block" style={{ fontFamily: PP }}>{field}</label>
                      <input placeholder="Enter value" className="w-full px-3 py-2 text-sm border border-gray-100 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors" style={{ fontFamily: RB }} />
                    </div>
                  ))}
                </div>
                <button className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00827a] transition-colors" style={{ fontFamily: PP }}>
                  <Save size={12} /> Save Vitals
                </button>
              </Card>
            </div>
          )}

          {/* SOAP NOTES */}
          {tab === 'soap' && (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>SOAP Clinical Notes</div>
                  <button className="flex items-center gap-1.5 text-xs text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>
                    <Save size={11} /> Auto-saved
                  </button>
                </div>

                {([
                  { key: 'subjective' as const, label: 'S — Subjective', sub: "Patient's own account", color: '#0D47A1' },
                  { key: 'objective' as const, label: 'O — Objective', sub: 'Clinical findings', color: '#009688' },
                  { key: 'assessment' as const, label: 'A — Assessment', sub: 'Diagnosis & impression', color: '#F59E0B' },
                  { key: 'plan' as const, label: 'P — Plan', sub: 'Management strategy', color: '#66BB6A' },
                ] as const).map(({ key, label, sub, color }) => (
                  <div key={key} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-4 rounded-full" style={{ background: color }} />
                      <div>
                        <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{label}</div>
                        <div className="text-[10px] text-slate-400" style={{ fontFamily: RB }}>{sub}</div>
                      </div>
                    </div>
                    <textarea
                      className="w-full h-24 text-sm text-slate-700 border border-gray-100 rounded-xl p-3 resize-none bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                      style={{ fontFamily: RB }}
                      value={soapData[key]}
                      onChange={e => setSoapData(p => ({ ...p, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </Card>

              {/* ICD-10 */}
              <Card className="p-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>ICD-10 Diagnosis Codes</div>
                <div className="flex flex-col gap-2">
                  {[
                    { code: 'R07.9', desc: 'Chest Pain, Unspecified', status: 'primary' },
                    { code: 'I10', desc: 'Essential (primary) Hypertension', status: 'secondary' },
                    { code: 'E11', desc: 'Type 2 Diabetes Mellitus', status: 'secondary' },
                  ].map(d => (
                    <div key={d.code} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 bg-slate-50">
                      <span className="font-mono text-xs font-bold text-[#0D47A1]">{d.code}</span>
                      <span className="text-xs text-slate-700 flex-1" style={{ fontFamily: RB }}>{d.desc}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.status === 'primary' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`} style={{ fontFamily: PP }}>
                        {d.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 text-xs text-[#0D47A1] font-medium mt-1 hover:underline" style={{ fontFamily: RB }}>
                    <Plus size={11} /> Add Diagnosis Code
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* PRESCRIPTION */}
          {tab === 'prescription' && (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Current Medications</div>
                  <button className="flex items-center gap-1.5 text-xs text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>
                    <Plus size={11} /> Add Medication
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {MEDICATIONS.map(m => (
                    <div key={m.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-[#009688]/10 flex items-center justify-center shrink-0">
                        <Pill size={14} className="text-[#009688]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>{m.name} {m.dose}</div>
                        <div className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: RB }}>{m.freq} · {m.route}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.status === 'prn' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`} style={{ fontFamily: PP }}>
                          {m.status.toUpperCase()}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: RB }}>Refill: {m.refill}</div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#EF4444] transition-all p-1">
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* New medication form */}
              <Card className="p-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>Add New Medication</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Medication Name', 'Dose', 'Frequency', 'Route', 'Duration', 'Instructions'].map(f => (
                    <div key={f}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block" style={{ fontFamily: PP }}>{f}</label>
                      <input placeholder={f} className="w-full px-3 py-2 text-xs border border-gray-100 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors" style={{ fontFamily: RB }} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors" style={{ fontFamily: PP }}>
                    <Plus size={12} /> Add to Prescription
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00827a] transition-colors" style={{ fontFamily: PP }}>
                    <Download size={12} /> Print & Sign
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* HISTORY */}
          {tab === 'history' && (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50">
                  <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Visit History</div>
                  <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: RB }}>Previous consultations and encounters</div>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { date: '12 Jun 2026', complaint: 'Hypertension Follow-up', doctor: 'Dr. A. Mehta', outcome: 'Medication adjusted' },
                    { date: '04 Apr 2026', complaint: 'Diabetes Review', doctor: 'Dr. P. Sharma', outcome: 'HbA1c improved — 7.2%' },
                    { date: '18 Jan 2026', complaint: 'Annual Health Check', doctor: 'Dr. A. Mehta', outcome: 'All normal, lipids reviewed' },
                    { date: '22 Oct 2025', complaint: 'Chest Discomfort', doctor: 'Dr. A. Mehta', outcome: 'ECG normal, advised lifestyle mod' },
                  ].map((v, i) => (
                    <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-[#0D47A1]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>{v.complaint}</div>
                        <div className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: RB }}>{v.doctor} · {v.date}</div>
                        <div className="text-xs text-slate-400 mt-1 italic" style={{ fontFamily: RB }}>Outcome: {v.outcome}</div>
                      </div>
                      <button className="text-xs text-[#0D47A1] font-medium hover:underline shrink-0 mt-1" style={{ fontFamily: RB }}>
                        View <ChevronRight size={11} className="inline" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — Doctor My Prescriptions Management Screen (Dedicated)
// ═══════════════════════════════════════════════════════════════════════════════
export type RxStatus = 'Draft' | 'Issued' | 'Completed' | 'Cancelled' | 'Archived'

export interface PrescriptionRecord {
  id: string
  patientName: string
  mrn: string
  consultationId: string
  department: string
  consultationDate: string
  medicineCount: number
  followup: boolean
  followupDate?: string
  status: RxStatus
  doctorName: string
  diagnosis: string
  medicinesList: Array<{ name: string; dose: string; freq: string }>
}

const MY_PRESCRIPTIONS_DATA: PrescriptionRecord[] = [
  {
    id: 'RX-2026-0891',
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-892101',
    consultationId: 'CNS-1001',
    department: 'Cardiology',
    consultationDate: '24 Jul 2026',
    medicineCount: 4,
    followup: true,
    followupDate: '31 Jul 2026',
    status: 'Issued',
    doctorName: 'Dr. Arjun Mehta',
    diagnosis: 'Angina Pectoris, unspecified (I20.9)',
    medicinesList: [
      { name: 'Amlodipine', dose: '5mg', freq: 'Once Daily' },
      { name: 'Metformin', dose: '500mg', freq: 'Twice Daily' },
      { name: 'Atorvastatin', dose: '20mg', freq: 'Once Nightly' },
      { name: 'Aspirin', dose: '75mg', freq: 'Once Daily' }
    ]
  },
  {
    id: 'RX-2026-0888',
    patientName: 'James Thornton',
    mrn: 'MRN-772102',
    consultationId: 'CNS-1004',
    department: 'Cardiology',
    consultationDate: '24 Jul 2026',
    medicineCount: 2,
    followup: true,
    followupDate: '07 Aug 2026',
    status: 'Draft',
    doctorName: 'Dr. Arjun Mehta',
    diagnosis: 'Essential Hypertension (I10)',
    medicinesList: [
      { name: 'Ramipril', dose: '2.5mg', freq: 'Once Daily' },
      { name: 'Hydrochlorothiazide', dose: '12.5mg', freq: 'Once Daily Morning' }
    ]
  },
  {
    id: 'RX-2026-0872',
    patientName: 'Marcus Brown',
    mrn: 'MRN-551980',
    consultationId: 'CNS-0988',
    department: 'Cardiology',
    consultationDate: '23 Jul 2026',
    medicineCount: 3,
    followup: false,
    status: 'Completed',
    doctorName: 'Dr. Arjun Mehta',
    diagnosis: 'Type 2 Diabetes Mellitus (E11.9)',
    medicinesList: [
      { name: 'Glyburide', dose: '5mg', freq: 'Twice Daily' },
      { name: 'Metformin', dose: '1000mg', freq: 'Twice Daily' },
      { name: 'Empagliflozin', dose: '10mg', freq: 'Once Daily' }
    ]
  },
  {
    id: 'RX-2026-0865',
    patientName: 'Robert Chen',
    mrn: 'MRN-442890',
    consultationId: 'CNS-0975',
    department: 'Cardiology',
    consultationDate: '22 Jul 2026',
    medicineCount: 2,
    followup: true,
    followupDate: '05 Aug 2026',
    status: 'Issued',
    doctorName: 'Dr. Arjun Mehta',
    diagnosis: 'Hyperlipidemia, unspecified (E78.5)',
    medicinesList: [
      { name: 'Rosuvastatin', dose: '10mg', freq: 'Once Nightly' },
      { name: 'Ezetimibe', dose: '10mg', freq: 'Once Daily' }
    ]
  },
  {
    id: 'RX-2026-0850',
    patientName: 'Emma Reyes',
    mrn: 'MRN-331002',
    consultationId: 'CNS-0960',
    department: 'Cardiology',
    consultationDate: '21 Jul 2026',
    medicineCount: 5,
    followup: false,
    status: 'Cancelled',
    doctorName: 'Dr. Arjun Mehta',
    diagnosis: 'Chest Pain, unspecified (R07.9)',
    medicinesList: [
      { name: 'Pantoprazole', dose: '40mg', freq: 'Once Daily' },
      { name: 'Antacid Gel', dose: '10ml', freq: 'TID PRN' }
    ]
  },
  {
    id: 'RX-2026-0812',
    patientName: 'David Walsh',
    mrn: 'MRN-112093',
    consultationId: 'CNS-0910',
    department: 'Cardiology',
    consultationDate: '18 Jul 2026',
    medicineCount: 1,
    followup: false,
    status: 'Archived',
    doctorName: 'Dr. Arjun Mehta',
    diagnosis: 'Acute Coronary Syndrome follow up',
    medicinesList: [
      { name: 'Clopidogrel', dose: '75mg', freq: 'Once Daily' }
    ]
  }
]

export function DoctorPrescriptionsScreen({
  onNewPrescription,
  onViewPrescription,
  onEditPrescription,
  onPrintPreview,
  onViewHistory,
  onViewConsultation
}: {
  onNewPrescription?: () => void
  onViewPrescription?: (rxId: string) => void
  onEditPrescription?: (rxId: string) => void
  onPrintPreview?: (rxId: string) => void
  onViewHistory?: (mrn: string) => void
  onViewConsultation?: (consultId: string) => void
}) {
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDept, setSelectedDept] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [dateRange, setDateRange] = useState('All')

  // Interactive Table State
  const [selectedRow, setSelectedRow] = useState<PrescriptionRecord | null>(null)
  const [openMoreMenuId, setOpenMoreMenuId] = useState<string | null>(null)
  const [printModalRx, setPrintModalRx] = useState<PrescriptionRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Handle Search & Filter logic
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedDept('All')
    setSelectedStatus('All')
    setDateRange('All')
  }

  const filteredData = MY_PRESCRIPTIONS_DATA.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.consultationId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDept = selectedDept === 'All' || item.department === selectedDept
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  // Helper for Status Chip Styling
  const renderStatusChip = (status: RxStatus) => {
    switch (status) {
      case 'Draft':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Draft</span>
      case 'Issued':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />Issued</span>
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />Completed</span>
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />Cancelled</span>
      case 'Archived':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Archived</span>
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9] relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce" style={{ fontFamily: RB }}>
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium" style={{ fontFamily: RB }}>
        <span className="hover:text-[#0D47A1] cursor-pointer">Doctor</span>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="hover:text-[#0D47A1] cursor-pointer">Prescriptions</span>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="text-[#111827] font-semibold">My Prescriptions</span>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>My Prescriptions</h1>
          <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
            View, search, print and manage prescriptions issued during consultations.
          </p>
        </div>
        <button
          onClick={onNewPrescription}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm shrink-0"
          style={{ fontFamily: PP }}
        >
          <Plus size={15} /> + New Prescription
        </button>
      </div>

      {/* ── Search & Filter Bar ── */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Prescription ID, Patient Name, MRN, or Consultation ID…"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-[#111827]"
              style={{ fontFamily: RB }}
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white text-slate-700 font-medium"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0D47A1] focus:bg-white text-slate-700 font-medium"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Issued">Issued</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium" style={{ fontFamily: RB }}>Date Range:</span>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-gray-200 rounded-lg outline-none text-slate-600 font-medium"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              style={{ fontFamily: RB }}
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 300)
              }}
              className="px-4 py-1.5 text-xs bg-[#0D47A1] text-white rounded-lg font-semibold hover:bg-[#0c3d8a] transition-colors"
              style={{ fontFamily: PP }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Card>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Today's Prescriptions", count: '14', trend: '+12% vs yesterday', isUp: true, Icon: Pill, color: '#0D47A1' },
          { title: 'Issued Prescriptions', count: '184', trend: '92% completed', isUp: true, Icon: CheckCircle2, color: '#009688' },
          { title: 'Follow-up Cases', count: '42', trend: '+4 scheduled this wk', isUp: true, Icon: Clock, color: '#F59E0B' },
          { title: 'Recently Printed', count: '28', trend: '100% digital sync', isUp: true, Icon: Download, color: '#66BB6A' },
        ].map((kpi, idx) => (
          <Card key={idx} className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1" style={{ fontFamily: PP }}>{kpi.title}</div>
              <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>{kpi.count}</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1" style={{ fontFamily: RB }}>
                <TrendingUp size={12} /> {kpi.trend}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}15` }}>
              <kpi.Icon size={20} style={{ color: kpi.color }} />
            </div>
          </Card>
        ))}
      </div>

      {/* ── Prescriptions Data Table ── */}
      <Card className="overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescription Records</h2>
            <p className="text-xs text-slate-500" style={{ fontFamily: RB }}>Showing {filteredData.length} prescriptions issued by Dr. Arjun Mehta</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400" style={{ fontFamily: RB }}>Strict Doctor Scoped View</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider sticky top-0" style={{ fontFamily: PP }}>
                <th className="px-5 py-3.5">Prescription ID</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">MRN</th>
                <th className="px-5 py-3.5">Consultation ID</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Consultation Date</th>
                <th className="px-5 py-3.5">Medicines</th>
                <th className="px-5 py-3.5">Follow-up</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-[#111827]" style={{ fontFamily: RB }}>
              {isLoading ? (
                // Loading Skeleton
                [1, 2, 3, 4].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan={10} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <Pill size={22} />
                      </div>
                      <div className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>No Prescriptions Found</div>
                      <p className="text-xs text-slate-500 max-w-xs mt-1" style={{ fontFamily: RB }}>No prescription records match your current filter criteria or search query.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                        style={{ fontFamily: PP }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map(rx => (
                  <tr
                    key={rx.id}
                    onClick={() => setSelectedRow(rx)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-[#0D47A1] whitespace-nowrap">
                      {rx.id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#111827] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar name={rx.patientName} size="sm" />
                        <span>{rx.patientName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {rx.mrn}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewConsultation?.(rx.consultationId)
                        }}
                        className="hover:underline hover:text-[#0D47A1]"
                      >
                        {rx.consultationId}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {rx.department}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {rx.consultationDate}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        <Pill size={12} className="text-[#009688]" />
                        {rx.medicineCount} Medicines
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {rx.followup ? (
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          Yes ({rx.followupDate})
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {renderStatusChip(rx.status)}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {/* View Button */}
                        <button
                          onClick={() => onViewPrescription?.(rx.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                          title="View Full Prescription"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Edit Button (Only Draft or editable) */}
                        {rx.status === 'Draft' ? (
                          <button
                            onClick={() => onEditPrescription?.(rx.id)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit Draft Prescription"
                          >
                            <Edit3 size={14} />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="p-1.5 text-slate-300 cursor-not-allowed"
                            title="Only Draft prescriptions can be edited"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}

                        {/* Print Button */}
                        <button
                          onClick={() => {
                            if (onPrintPreview) {
                              onPrintPreview(rx.id)
                            } else {
                              setPrintModalRx(rx)
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Print Prescription"
                        >
                          <Printer size={14} />
                        </button>

                        {/* Download PDF Button */}
                        <button
                          onClick={() => showToast(`Downloaded PDF for ${rx.id}`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0D47A1] hover:bg-blue-50 transition-colors"
                          title="Download PDF"
                        >
                          <Download size={14} />
                        </button>

                        {/* More Menu Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMoreMenuId(openMoreMenuId === rx.id ? null : rx.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <ChevronDown size={14} />
                          </button>

                          {openMoreMenuId === rx.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 text-left">
                              <button
                                onClick={() => {
                                  setOpenMoreMenuId(null)
                                  showToast(`Duplicated prescription ${rx.id}`)
                                }}
                                className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <Plus size={13} /> Duplicate Prescription
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMoreMenuId(null)
                                  onViewHistory?.(rx.mrn)
                                }}
                                className="w-full px-3 py-2 text-xs text-[#0D47A1] hover:bg-blue-50 flex items-center gap-2 font-medium"
                              >
                                <Clock size={13} /> Prescription History
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMoreMenuId(null)
                                  onViewConsultation?.(rx.consultationId)
                                }}
                                className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <FileText size={13} /> View Consultation
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-slate-50/50 text-xs text-slate-500" style={{ fontFamily: RB }}>
          <div>Showing 1 to {filteredData.length} of {filteredData.length} entries</div>
          <div className="flex items-center gap-1">
            <button disabled className="px-2.5 py-1 rounded-md border border-gray-200 text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-2.5 py-1 rounded-md bg-[#0D47A1] text-white font-semibold">1</button>
            <button disabled className="px-2.5 py-1 rounded-md border border-gray-200 text-slate-400 cursor-not-allowed">Next</button>
          </div>
        </div>
      </Card>

      {/* ── Right Slide-over Drawer (Quick Preview) ── */}
      {selectedRow && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wide" style={{ fontFamily: PP }}>Prescription Summary</div>
                <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>{selectedRow.id}</h2>
              </div>
              <button
                onClick={() => setSelectedRow(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Patient Info Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium" style={{ fontFamily: RB }}>Patient Name</span>
                  <span className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{selectedRow.patientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium" style={{ fontFamily: RB }}>MRN</span>
                  <span className="text-xs font-mono font-semibold text-[#0D47A1]" style={{ fontFamily: RB }}>{selectedRow.mrn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium" style={{ fontFamily: RB }}>Attending Doctor</span>
                  <span className="text-xs font-semibold text-slate-800" style={{ fontFamily: RB }}>{selectedRow.doctorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium" style={{ fontFamily: RB }}>Department</span>
                  <span className="text-xs text-slate-700" style={{ fontFamily: RB }}>{selectedRow.department}</span>
                </div>
              </div>

              {/* Clinical Details */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2" style={{ fontFamily: PP }}>Clinical Diagnosis</div>
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-800 font-medium" style={{ fontFamily: RB }}>
                  {selectedRow.diagnosis}
                </div>
              </div>

              {/* Medicines Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide" style={{ fontFamily: PP }}>Prescribed Medicines ({selectedRow.medicineCount})</span>
                </div>
                <div className="space-y-2">
                  {selectedRow.medicinesList.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{m.name} <span className="font-normal text-slate-500">({m.dose})</span></div>
                        <div className="text-[11px] text-slate-500">{m.freq}</div>
                      </div>
                      <Pill size={14} className="text-[#009688]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Follow-up Date</div>
                  <div className="text-xs font-bold text-[#111827] mt-0.5" style={{ fontFamily: RB }}>{selectedRow.followupDate || 'Not required'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Prescription Status</div>
                  <div className="mt-1">{renderStatusChip(selectedRow.status)}</div>
                </div>
              </div>
            </div>

            {/* Drawer Quick Actions Footer */}
            <div className="p-4 border-t border-gray-100 bg-slate-50 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedRow(null)
                  onViewPrescription?.(selectedRow.id)
                }}
                className="flex-1 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors"
                style={{ fontFamily: PP }}
              >
                View Full Prescription
              </button>
              <button
                onClick={() => setPrintModalRx(selectedRow)}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
                style={{ fontFamily: RB }}
              >
                <Printer size={14} />
              </button>
              <button
                onClick={() => showToast(`Downloaded PDF for ${selectedRow.id}`)}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
                style={{ fontFamily: RB }}
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Print Preview Modal ── */}
      {printModalRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-[#0D47A1]" />
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Print Prescription Preview</h3>
              </div>
              <button onClick={() => setPrintModalRx(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 mb-5 text-xs text-slate-700 space-y-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-[#0D47A1]">HMS Hospital & Research Center</span>
                <span className="font-mono text-slate-500">{printModalRx.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Patient:</strong> {printModalRx.patientName}</div>
                <div><strong>MRN:</strong> {printModalRx.mrn}</div>
                <div><strong>Doctor:</strong> {printModalRx.doctorName}</div>
                <div><strong>Date:</strong> {printModalRx.consultationDate}</div>
              </div>
              <div><strong>Diagnosis:</strong> {printModalRx.diagnosis}</div>
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold mb-1">Medicines Rx:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {printModalRx.medicinesList.map((m, i) => (
                    <li key={i}>{m.name} {m.dose} — {m.freq}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPrintModalRx(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                style={{ fontFamily: RB }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPrintModalRx(null)
                  showToast(`Prescription ${printModalRx.id} sent to printer`)
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

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — Reports
// ═══════════════════════════════════════════════════════════════════════════════
export function DoctorReportsScreen() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
      <SectionHeader
        title="My Reports"
        sub="Consultation and patient outcome statistics"
        action={
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
            {(['week', 'month'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${period === p ? 'bg-[#0D47A1] text-white' : 'text-slate-500 hover:text-slate-700'}`}
                style={{ fontFamily: RB }}
              >
                This {p}
              </button>
            ))}
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Consultations', value: '112', trend: '+8%', up: true, color: '#0D47A1' },
          { label: 'Avg. Duration', value: '14m', trend: '-2m', up: true, color: '#009688' },
          { label: 'Patients Seen', value: '98', trend: '+5%', up: true, color: '#66BB6A' },
          { label: 'Follow-ups Due', value: '23', trend: '+3', up: false, color: '#F59E0B' },
        ].map(k => (
          <Card key={k.label} className="p-5">
            <div className="text-xs font-medium text-slate-400 mb-1" style={{ fontFamily: RB }}>{k.label}</div>
            <div className="text-2xl font-bold text-[#111827] leading-none" style={{ fontFamily: PP, color: k.color }}>{k.value}</div>
            <div className={`flex items-center gap-1 text-xs mt-2 font-medium ${k.up ? 'text-green-600' : 'text-amber-600'}`} style={{ fontFamily: RB }}>
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {k.trend}
              <span className="text-slate-400 font-normal">vs last {period}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Consultations chart */}
        <div className="xl:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Daily Consultations — This Week</div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-gray-100 px-2.5 py-1.5 rounded-lg" style={{ fontFamily: RB }}>
                <Download size={11} /> Export
              </button>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_CONSULTATIONS} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: RB }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, fontFamily: RB, borderRadius: 10, border: '1px solid #E5E7EB' }} />
                  <Bar dataKey="count" name="Consultations" radius={[6, 6, 0, 0]}>
                    {WEEKLY_CONSULTATIONS.map((_, i) => (
                      <Cell key={i} fill={i === 3 ? '#0D47A1' : '#DBEAFE'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Complaint breakdown */}
        <Card className="p-5">
          <div className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: PP }}>Top Complaints</div>
          <div className="space-y-3">
            {[
              { name: 'Hypertension F/U', pct: 34, color: '#0D47A1' },
              { name: 'Diabetes Review', pct: 28, color: '#009688' },
              { name: 'Chest Pain', pct: 18, color: '#EF4444' },
              { name: 'Cardiology', pct: 12, color: '#9C27B0' },
              { name: 'Other', pct: 8, color: '#94A3B8' },
            ].map(c => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-xs font-medium text-[#111827]" style={{ fontFamily: RB }}>{c.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500" style={{ fontFamily: PP }}>{c.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 5 — Doctor Prescription Details Screen (Read-Only Clinical Workspace)
// ═══════════════════════════════════════════════════════════════════════════════
export function DoctorPrescriptionDetailsScreen({
  prescriptionId = 'RX-2026-0891',
  onBack,
  onEditPrescription,
  onPrintPreview,
  onViewHistory,
  onViewConsultation,
  onViewPatientProfile
}: {
  prescriptionId?: string
  onBack?: () => void
  onEditPrescription?: (rxId: string) => void
  onPrintPreview?: (rxId: string) => void
  onViewHistory?: (mrn: string) => void
  onViewConsultation?: (consultId: string) => void
  onViewPatientProfile?: (mrn: string) => void
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [printModalOpen, setPrintModalOpen] = useState(false)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Prescription Record data matching spec
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
    status: 'Issued' as RxStatus,
    doctorName: 'Dr. Arjun Mehta',
    doctorSpecialty: 'Interventional Cardiology',
    department: 'Cardiology',
    mobileNumber: '+1 (555) 234-5678',
    visitDate: '24 Jul 2026',
    allergies: ['Penicillin', 'Aspirin'],
    knownConditions: ['Hypertension', 'Borderline Type 2 Diabetes'],
    
    // Section 01: Diagnosis Summary
    chiefComplaint: 'Severe chest tightness radiating to left shoulder with acute dyspnea on exertion.',
    clinicalFindings: 'Chest wall non-tender. S1 and S2 heart sounds heard normal. No murmurs or gallop rhythm. BP 145/92 mmHg, HR 88 bpm.',
    finalDiagnosis: 'Angina Pectoris, unspecified',
    icdCode: 'I20.9 — Angina Pectoris, unspecified',
    consultationNotes: 'Patient presented with acute exertional chest discomfort. Electrocardiogram (ECG) performed in clinic. High cardiovascular risk profile noted.',

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

  // Helper for Status Chips
  const renderStatusChip = (status: RxStatus) => {
    switch (status) {
      case 'Draft':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Draft</span>
      case 'Issued':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />Issued</span>
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />Completed</span>
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />Cancelled</span>
      case 'Archived':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Archived</span>
    }
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce" style={{ fontFamily: RB }}>
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      {/* ── HEADER & BREADCRUMB ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>Prescriptions</span>
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
              Review issued prescription and treatment recommendations.
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
                Back
              </button>
            )}
            {/* Permissions check: Doctor can Edit Draft prescription */}
            {rxRecord.status === 'Draft' ? (
              <button
                onClick={() => onEditPrescription?.(rxRecord.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Edit3 size={14} />
                Edit Prescription
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-200"
                style={{ fontFamily: PP }}
                title="Only Draft prescriptions can be edited"
              >
                <Edit3 size={14} />
                Edit Prescription
              </button>
            )}
            <button
              onClick={() => {
                if (onPrintPreview) {
                  onPrintPreview(rxRecord.id)
                } else {
                  setPrintModalOpen(true)
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#009688] hover:bg-teal-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Printer size={14} />
              Print Prescription
            </button>
            <button
              onClick={() => showToast(`Downloaded PDF for ${rxRecord.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── PATIENT HERO HEADER (Reused) ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Avatar name={rxRecord.patientName} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{rxRecord.patientName}</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{rxRecord.mrn}</span>
                <span className="font-mono text-[10px] bg-emerald-50 text-[#009688] px-2 py-0.5 rounded font-bold">{rxRecord.id}</span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{rxRecord.consultationId}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                <span>{rxRecord.age} yrs / {rxRecord.gender}</span>
                <span>•</span>
                <span>Blood Group: <strong className="text-[#111827]">{rxRecord.bloodGroup}</strong></span>
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

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewPatientProfile?.(rxRecord.mrn)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              Patient Profile
            </button>
            <button
              onClick={() => onViewConsultation?.(rxRecord.consultationId)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Consultation
            </button>
          </div>
        </div>
      </div>

      {/* ── THREE-COLUMN WORKSPACE LAYOUT ── */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT PANEL (Col-span-3): Patient Summary ── */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <User size={16} className="text-[#0D47A1]" />
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Patient Summary</h3>
              </div>

              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">{rxRecord.mrn}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Mobile Number</span>
                  <span className="font-semibold text-slate-700">{rxRecord.mobileNumber}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Department</span>
                  <span className="font-medium text-slate-700">{rxRecord.department}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Attending Doctor</span>
                  <span className="font-semibold text-slate-800">{rxRecord.doctorName}</span>
                  <span className="text-[10px] text-slate-400 block">{rxRecord.doctorSpecialty}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Visit Date</span>
                  <span className="font-medium text-slate-700">{rxRecord.visitDate}</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Allergies</span>
                  <div className="flex flex-wrap gap-1">
                    {rxRecord.allergies.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-semibold" style={{ fontFamily: PP }}>
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Known Conditions</span>
                  <div className="flex flex-wrap gap-1">
                    {rxRecord.knownConditions.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium" style={{ fontFamily: RB }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── CENTER CONTENT (Col-span-6): Prescription Information ── */}
          <div className="lg:col-span-6 space-y-5">

            {/* SECTION 01: Diagnosis Summary */}
            <Card className="p-5">
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
                    <p className="font-bold text-[#111827]" style={{ fontFamily: PP }}>{rxRecord.finalDiagnosis}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>ICD Code</span>
                    <p className="font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg inline-block">{rxRecord.icdCode}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Consultation Notes</span>
                  <p className="text-slate-600 leading-relaxed italic">{rxRecord.consultationNotes}</p>
                </div>
              </div>
            </Card>

            {/* SECTION 02: Medicine List (Reusable Enterprise Table) */}
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">02</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescribed Medicines</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#009688] border border-teal-100" style={{ fontFamily: PP }}>
                  <Pill size={12} className="inline mr-1" />
                  {rxRecord.medicines.length} Medicines
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: PP }}>
                      <th className="px-4 py-3">Medicine</th>
                      <th className="px-3 py-3">Strength</th>
                      <th className="px-3 py-3">Route</th>
                      <th className="px-3 py-3">Dosage</th>
                      <th className="px-3 py-3">Frequency</th>
                      <th className="px-3 py-3">Duration</th>
                      <th className="px-3 py-3">Quantity</th>
                      <th className="px-4 py-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-[#111827]" style={{ fontFamily: RB }}>
                    {rxRecord.medicines.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-bold text-[#111827] whitespace-nowrap" style={{ fontFamily: PP }}>
                          {m.name}
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-700 whitespace-nowrap">{m.strength}</td>
                        <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{m.route}</td>
                        <td className="px-3 py-3 text-slate-700 whitespace-nowrap">{m.dosage}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-blue-50 text-[#0D47A1] rounded font-semibold text-[11px]" style={{ fontFamily: PP }}>
                            {m.frequency}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{m.duration}</td>
                        <td className="px-3 py-3 font-mono font-medium text-slate-800 whitespace-nowrap">{m.quantity}</td>
                        <td className="px-4 py-3 text-slate-500 italic max-w-xs">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* SECTION 03: General Advice */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">03</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>General Advice & Recommendations</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" style={{ fontFamily: RB }}>
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

                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1" style={{ fontFamily: PP }}>Special Instructions</span>
                  <p className="text-amber-900 font-medium">{rxRecord.specialInstructions}</p>
                </div>
              </div>
            </Card>

            {/* SECTION 04: Follow-up Details */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">04</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Follow-up Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-3" style={{ fontFamily: RB }}>
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
            </Card>

            {/* SECTION 05: Prescription Summary */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
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
            </Card>
          </div>

          {/* ── RIGHT CONTEXT PANEL (Col-span-3) ── */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* CARD 01: Quick Actions */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Quick Actions
              </h4>

              <div className="space-y-2">
                {/* Doctor Permissions: Edit only Draft */}
                {rxRecord.status === 'Draft' ? (
                  <button
                    onClick={() => onEditPrescription?.(rxRecord.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <span className="flex items-center gap-2"><Edit3 size={14} /> Edit Prescription</span>
                    <ChevronRight size={13} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 text-slate-400 text-xs font-semibold cursor-not-allowed opacity-60"
                    style={{ fontFamily: PP }}
                    title="Issued prescriptions cannot be modified"
                  >
                    <span className="flex items-center gap-2"><Edit3 size={14} /> Edit Prescription</span>
                    <span className="text-[10px] text-slate-400 font-normal">Locked</span>
                  </button>
                )}

                <button
                  onClick={() => setPrintModalOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Printer size={14} /> Print Prescription</span>
                  <ChevronRight size={13} />
                </button>

                <button
                  onClick={() => showToast(`Downloaded PDF for ${rxRecord.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Download size={14} /> Download PDF</span>
                  <ChevronRight size={13} />
                </button>

                <button
                  onClick={() => onViewHistory?.(rxRecord.mrn)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Clock size={14} /> Prescription History</span>
                  <ChevronRight size={13} />
                </button>

                <button
                  onClick={() => onViewConsultation?.(rxRecord.consultationId)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-2"><FileText size={14} /> View Consultation</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </Card>

            {/* CARD 02: Prescription Summary */}
            <Card className="p-4">
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
                  <span className="font-medium text-slate-700">{rxRecord.issuedDate}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status</span>
                  <div>{renderStatusChip(rxRecord.status)}</div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Follow-up Date</span>
                  <span className="font-bold text-[#111827]">{rxRecord.nextVisitDate}</span>
                </div>
              </div>
            </Card>

            {/* CARD 03: Activity Timeline */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Activity Timeline
              </h4>

              <div className="space-y-3">
                {[
                  { title: 'Consultation Completed', time: '09:40 AM', date: '24 Jul 2026', done: true },
                  { title: 'Prescription Drafted', time: '09:41 AM', date: '24 Jul 2026', done: true },
                  { title: 'Prescription Issued', time: '09:42 AM', date: '24 Jul 2026', done: true },
                  { title: 'Prescription Printed', time: '09:45 AM', date: '24 Jul 2026', done: true },
                  { title: 'Prescription Downloaded', time: '09:50 AM', date: '24 Jul 2026', done: true }
                ].map((ev, i, arr) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#009688] mt-1 shrink-0" />
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#111827]" style={{ fontFamily: PP }}>{ev.title}</div>
                      <div className="text-[10px] text-slate-400" style={{ fontFamily: RB }}>{ev.date} at {ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* ── PRINT MODAL ── */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-[#0D47A1]" />
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Print Prescription Preview</h3>
              </div>
              <button onClick={() => setPrintModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 mb-5 text-xs text-slate-700 space-y-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-[#0D47A1]">HMS Hospital & Research Center</span>
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

            <div className="flex justify-end gap-2">
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
                  showToast(`Prescription ${rxRecord.id} sent to printer`)
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

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 6 — Doctor Edit Prescription Screen (Editable Clinical Workspace)
// ═══════════════════════════════════════════════════════════════════════════════
export interface EditableMedicine {
  id: string
  name: string
  strength: string
  route: string
  dosage: string
  frequency: string
  duration: string
  quantity: string
  instructions: string
}

const FREQUENCY_OPTIONS = [
  'Once Daily',
  'Twice Daily',
  'Three Times Daily',
  'Every 6 Hours',
  'Every 8 Hours',
  'SOS',
  'Custom'
]

const ROUTE_OPTIONS = [
  'Oral',
  'Injection',
  'IV',
  'Topical',
  'Eye Drops',
  'Ear Drops',
  'Nasal',
  'Inhalation'
]

const COMMON_MEDICINES = [
  'Amlodipine', 'Metformin', 'Atorvastatin', 'Aspirin', 'Ramipril',
  'Hydrochlorothiazide', 'Rosuvastatin', 'Pantoprazole', 'Clopidogrel',
  'Losartan', 'Omeprazole', 'Amoxicillin', 'Paracetamol', 'Ibuprofen'
]

export function DoctorEditPrescriptionScreen({
  prescriptionId = 'RX-2026-0888',
  onBack,
  onSaveSuccess,
  onIssueSuccess,
  onViewConsultation,
  onViewPatientProfile
}: {
  prescriptionId?: string
  onBack?: () => void
  onSaveSuccess?: () => void
  onIssueSuccess?: () => void
  onViewConsultation?: (consultId: string) => void
  onViewPatientProfile?: (mrn: string) => void
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [printModalOpen, setPrintModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Patient & Clinical Record
  const patientData = {
    patientName: 'James Thornton',
    mrn: 'MRN-772102',
    age: 67,
    gender: 'Male',
    bloodGroup: 'O+',
    consultationId: 'CNS-1004',
    prescriptionId: prescriptionId,
    consultationDate: '24 Jul 2026',
    doctorName: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    mobileNumber: '+1 (555) 889-1029',
    visitDate: '24 Jul 2026',
    allergies: ['Sulfa Drugs'],
    knownConditions: ['Hypertension', 'Dyslipidemia']
  }

  // Editable Form State
  const [status, setStatus] = useState<RxStatus>('Draft')
  const [chiefComplaint, setChiefComplaint] = useState('Bilateral ankle swelling and mild morning headaches for 2 weeks.')
  const [clinicalFindings, setClinicalFindings] = useState('BP 152/94 mmHg, HR 76 bpm. Mild pedal edema (+1). S1 S2 normal.')
  const [finalDiagnosis, setFinalDiagnosis] = useState('Essential Hypertension (I10)')
  const [icdCode, setIcdCode] = useState('I10 — Essential (primary) Hypertension')
  const [clinicalNotes, setClinicalNotes] = useState('Adjusting antihypertensive therapy. Routine renal function tests advised in 2 weeks.')

  // Editable Medicines List
  const [medicines, setMedicines] = useState<EditableMedicine[]>([
    { id: '1', name: 'Ramipril', strength: '2.5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily', duration: '30 Days', quantity: '30 Tabs', instructions: 'Take in the morning after breakfast' },
    { id: '2', name: 'Hydrochlorothiazide', strength: '12.5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily', duration: '30 Days', quantity: '30 Tabs', instructions: 'Take in the morning' }
  ])

  // General Advice Editable State
  const [dietAdvice, setDietAdvice] = useState('Low salt intake (< 2g/day), restrict caffeine and canned foods.')
  const [lifestyleAdvice, setLifestyleAdvice] = useState('Daily BP monitoring twice daily (morning & evening). Log readings.')
  const [exerciseAdvice, setExerciseAdvice] = useState('Moderate 30-min brisk walking 5 days a week.')
  const [specialInstructions, setSpecialInstructions] = useState('If experiencing severe dizziness or SBP > 180 mmHg, contact clinic immediately.')

  // Follow-up Editable State
  const [followupRequired, setFollowupRequired] = useState('Yes')
  const [nextVisitDate, setNextVisitDate] = useState('2026-08-07')
  const [followupNotes, setFollowupNotes] = useState('Review home BP log and serum electrolytes.')

  // Revision Metadata
  const revisionInfo = {
    prescriptionId: prescriptionId,
    createdBy: 'Dr. Arjun Mehta',
    createdDate: '24 Jul 2026, 08:30 AM',
    lastModifiedBy: 'Dr. Arjun Mehta',
    lastModifiedDate: '24 Jul 2026, 11:15 AM',
    revisionNumber: 2,
    currentStatus: status
  }

  // Handle Add Medicine Row
  const handleAddMedicine = () => {
    const newMed: EditableMedicine = {
      id: Date.now().toString(),
      name: '',
      strength: '5mg',
      route: 'Oral',
      dosage: '1 Tablet',
      frequency: 'Once Daily',
      duration: '30 Days',
      quantity: '30 Tabs',
      instructions: 'Take after meals'
    }
    setMedicines(prev => [...prev, newMed])
  }

  // Handle Medicine Field Change
  const handleMedicineChange = (id: string, field: keyof EditableMedicine, value: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
    if (errors[`med_${id}_${field}`]) {
      setErrors(prev => {
        const copy = { ...prev }
        delete copy[`med_${id}_${field}`]
        return copy
      })
    }
  }

  // Handle Duplicate Medicine Row
  const handleDuplicateMedicine = (med: EditableMedicine) => {
    const dup: EditableMedicine = {
      ...med,
      id: Date.now().toString(),
      name: `${med.name} (Copy)`
    }
    setMedicines(prev => [...prev, dup])
    showToast(`Duplicated ${med.name || 'Medicine row'}`)
  }

  // Handle Delete Medicine Row
  const handleDeleteMedicine = (id: string) => {
    if (medicines.length === 1) {
      showToast('Prescription must contain at least one medicine')
      return
    }
    setMedicines(prev => prev.filter(m => m.id !== id))
  }

  // Validation Logic according to spec
  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!finalDiagnosis.trim()) errs.diagnosis = 'Diagnosis is required'
    
    medicines.forEach((m, idx) => {
      if (!m.name.trim()) errs[`med_${m.id}_name`] = `Medicine #${idx + 1} name required`
      if (!m.dosage.trim()) errs[`med_${m.id}_dosage`] = `Dosage required`
      if (!m.frequency.trim()) errs[`med_${m.id}_frequency`] = `Frequency required`
      if (!m.duration.trim()) errs[`med_${m.id}_duration`] = `Duration required`
    })

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Save Handler
  const handleSaveChanges = () => {
    if (!validateForm()) {
      showToast('Please fix required validation errors before saving')
      return
    }
    showToast(`Prescription ${prescriptionId} saved successfully!`)
    onSaveSuccess?.()
  }

  // Issue Prescription Handler
  const handleIssuePrescription = () => {
    if (!validateForm()) {
      showToast('Please fix required validation errors before issuing')
      return
    }
    setStatus('Issued')
    showToast(`Prescription ${prescriptionId} finalized & issued!`)
    onIssueSuccess?.()
  }

  // Render Status Chip
  const renderStatusChip = (st: RxStatus) => {
    switch (st) {
      case 'Draft':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Draft</span>
      case 'Issued':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />Issued</span>
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />Completed</span>
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />Cancelled</span>
      case 'Archived':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Archived</span>
    }
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-16 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce" style={{ fontFamily: RB }}>
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      {/* ── BREADCRUMB & PAGE HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>Prescriptions</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">Edit Prescription</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Edit Prescription
              </h1>
              {renderStatusChip(status)}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Review and update prescription before saving changes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#0D47A1] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Save size={14} />
              Save Changes
            </button>
            {status === 'Draft' && (
              <button
                onClick={handleIssuePrescription}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009688] hover:bg-[#00827a] text-white text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <CheckCircle2 size={14} />
                Issue Prescription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── PATIENT HERO HEADER (Reused) ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Avatar name={patientData.patientName} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{patientData.patientName}</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{patientData.mrn}</span>
                <span className="font-mono text-[10px] bg-emerald-50 text-[#009688] px-2 py-0.5 rounded font-bold">{patientData.prescriptionId}</span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{patientData.consultationId}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                <span>{patientData.age} yrs / {patientData.gender}</span>
                <span>•</span>
                <span>Blood Group: <strong className="text-[#111827]">{patientData.bloodGroup}</strong></span>
                <span>•</span>
                <span>Consultation Date: <strong className="text-[#111827]">{patientData.consultationDate}</strong></span>
              </div>
            </div>

            {/* Allergy alert badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0" style={{ fontFamily: PP }}>
              <AlertTriangle size={13} />
              <span>Allergies: {patientData.allergies.join(', ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewPatientProfile?.(patientData.mrn)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              Patient Profile
            </button>
            <button
              onClick={() => onViewConsultation?.(patientData.consultationId)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Consultation
            </button>
          </div>
        </div>
      </div>

      {/* ── THREE-COLUMN WORKSPACE LAYOUT ── */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT PANEL (Col-span-3): Patient Summary ── */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <User size={16} className="text-[#0D47A1]" />
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Patient Summary</h3>
              </div>

              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">{patientData.mrn}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Mobile Number</span>
                  <span className="font-semibold text-slate-700">{patientData.mobileNumber}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Attending Doctor</span>
                  <span className="font-semibold text-slate-800">{patientData.doctorName}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Department</span>
                  <span className="font-medium text-slate-700">{patientData.department}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Visit Date</span>
                  <span className="font-medium text-slate-700">{patientData.visitDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Blood Group</span>
                  <span className="font-bold text-[#111827]">{patientData.bloodGroup}</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Allergies</span>
                  <div className="flex flex-wrap gap-1">
                    {patientData.allergies.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-semibold" style={{ fontFamily: PP }}>
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Known Conditions</span>
                  <div className="flex flex-wrap gap-1">
                    {patientData.knownConditions.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium" style={{ fontFamily: RB }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── CENTER CONTENT (Col-span-6): Editable Prescription Form ── */}
          <div className="lg:col-span-6 space-y-5">

            {/* SECTION 01: Diagnosis Summary (Editable) */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs">01</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Diagnosis Summary (Editable)</h3>
              </div>

              <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Chief Complaint</label>
                  <textarea
                    rows={2}
                    value={chiefComplaint}
                    onChange={e => setChiefComplaint(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Clinical Findings</label>
                  <textarea
                    rows={2}
                    value={clinicalFindings}
                    onChange={e => setClinicalFindings(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>
                      Final Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={finalDiagnosis}
                      onChange={e => {
                        setFinalDiagnosis(e.target.value)
                        if (errors.diagnosis) setErrors(prev => ({ ...prev, diagnosis: '' }))
                      }}
                      className={`w-full px-3 py-2 border rounded-xl bg-slate-50 outline-none focus:bg-white text-slate-800 ${errors.diagnosis ? 'border-red-500' : 'border-gray-200 focus:border-[#0D47A1]'}`}
                    />
                    {errors.diagnosis && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.diagnosis}</span>}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>ICD Code</label>
                    <input
                      type="text"
                      value={icdCode}
                      onChange={e => setIcdCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Clinical Notes</label>
                  <textarea
                    rows={2}
                    value={clinicalNotes}
                    onChange={e => setClinicalNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </Card>

            {/* SECTION 02: Medicines (Editable Enterprise Table) */}
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">02</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescribed Medicines ({medicines.length})</h3>
                </div>
                <button
                  onClick={handleAddMedicine}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#009688] hover:bg-[#00827a] text-white text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <Plus size={13} /> + Add Medicine
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: PP }}>
                      <th className="px-3 py-3">Medicine Name *</th>
                      <th className="px-2 py-3 w-20">Strength</th>
                      <th className="px-2 py-3 w-24">Route</th>
                      <th className="px-2 py-3 w-24">Dosage *</th>
                      <th className="px-2 py-3 w-32">Frequency *</th>
                      <th className="px-2 py-3 w-24">Duration *</th>
                      <th className="px-2 py-3 w-20">Qty</th>
                      <th className="px-3 py-3">Instructions</th>
                      <th className="px-2 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-[#111827]" style={{ fontFamily: RB }}>
                    {medicines.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Medicine Name (Auto-complete list) */}
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            list="medicine-suggestions"
                            value={m.name}
                            onChange={e => handleMedicineChange(m.id, 'name', e.target.value)}
                            placeholder="Medicine Name"
                            className={`w-full px-2.5 py-1.5 border rounded-lg bg-white outline-none text-xs ${errors[`med_${m.id}_name`] ? 'border-red-500' : 'border-gray-200 focus:border-[#0D47A1]'}`}
                          />
                        </td>

                        {/* Strength */}
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={m.strength}
                            onChange={e => handleMedicineChange(m.id, 'strength', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white outline-none text-xs"
                          />
                        </td>

                        {/* Route */}
                        <td className="px-2 py-2">
                          <select
                            value={m.route}
                            onChange={e => handleMedicineChange(m.id, 'route', e.target.value)}
                            className="w-full px-1.5 py-1.5 border border-gray-200 rounded-lg bg-white outline-none text-xs"
                          >
                            {ROUTE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>

                        {/* Dosage */}
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={m.dosage}
                            onChange={e => handleMedicineChange(m.id, 'dosage', e.target.value)}
                            className={`w-full px-2 py-1.5 border rounded-lg bg-white outline-none text-xs ${errors[`med_${m.id}_dosage`] ? 'border-red-500' : 'border-gray-200 focus:border-[#0D47A1]'}`}
                          />
                        </td>

                        {/* Frequency */}
                        <td className="px-2 py-2">
                          <select
                            value={m.frequency}
                            onChange={e => handleMedicineChange(m.id, 'frequency', e.target.value)}
                            className={`w-full px-1.5 py-1.5 border rounded-lg bg-white outline-none text-xs ${errors[`med_${m.id}_frequency`] ? 'border-red-500' : 'border-gray-200 focus:border-[#0D47A1]'}`}
                          >
                            {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </td>

                        {/* Duration */}
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={m.duration}
                            onChange={e => handleMedicineChange(m.id, 'duration', e.target.value)}
                            className={`w-full px-2 py-1.5 border rounded-lg bg-white outline-none text-xs ${errors[`med_${m.id}_duration`] ? 'border-red-500' : 'border-gray-200 focus:border-[#0D47A1]'}`}
                          />
                        </td>

                        {/* Quantity */}
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={m.quantity}
                            onChange={e => handleMedicineChange(m.id, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white outline-none text-xs font-mono"
                          />
                        </td>

                        {/* Instructions */}
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={m.instructions}
                            onChange={e => handleMedicineChange(m.id, 'instructions', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white outline-none text-xs"
                          />
                        </td>

                        {/* Row Actions */}
                        <td className="px-2 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleDuplicateMedicine(m)}
                              className="p-1 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded"
                              title="Duplicate Row"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteMedicine(m.id)}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                              title="Delete Row"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Datalist for Medicine Auto-complete */}
              <datalist id="medicine-suggestions">
                {COMMON_MEDICINES.map(med => <option key={med} value={med} />)}
              </datalist>
            </Card>

            {/* SECTION 03: General Advice (Editable) */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">03</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>General Advice (Editable)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Diet Advice</label>
                  <textarea
                    rows={2}
                    value={dietAdvice}
                    onChange={e => setDietAdvice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Lifestyle Advice</label>
                  <textarea
                    rows={2}
                    value={lifestyleAdvice}
                    onChange={e => setLifestyleAdvice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Exercise Advice</label>
                  <textarea
                    rows={2}
                    value={exerciseAdvice}
                    onChange={e => setExerciseAdvice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Special Instructions</label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={e => setSpecialInstructions(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-200 rounded-xl bg-amber-50/50 outline-none focus:border-amber-500 focus:bg-white text-amber-900"
                  />
                </div>
              </div>
            </Card>

            {/* SECTION 04: Follow-up (Editable) */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">04</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Follow-up Details (Editable)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-3" style={{ fontFamily: RB }}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Follow-up Required</label>
                  <select
                    value={followupRequired}
                    onChange={e => setFollowupRequired(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Next Visit Date</label>
                  <input
                    type="date"
                    value={nextVisitDate}
                    onChange={e => setNextVisitDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Follow-up Notes</label>
                <textarea
                  rows={2}
                  value={followupNotes}
                  onChange={e => setFollowupNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white text-slate-800"
                />
              </div>
            </Card>

            {/* SECTION 05: Revision Information */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">05</div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Revision Information</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Prescription ID</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{revisionInfo.prescriptionId}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Created By</span>
                  <span className="font-semibold text-slate-700">{revisionInfo.createdBy}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Created Date</span>
                  <span className="text-slate-600">{revisionInfo.createdDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Revision Number</span>
                  <span className="font-bold text-[#0D47A1]">v{revisionInfo.revisionNumber}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Last Modified By</span>
                  <span className="font-semibold text-slate-700">{revisionInfo.lastModifiedBy}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Last Modified Date</span>
                  <span className="text-slate-600">{revisionInfo.lastModifiedDate}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Current Status</span>
                  <div>{renderStatusChip(status)}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── RIGHT CONTEXT PANEL (Col-span-3) ── */}
          <div className="lg:col-span-3 space-y-4">

            {/* CARD 01: Quick Actions */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Quick Actions
              </h4>

              <div className="space-y-2">
                <button
                  onClick={handleSaveChanges}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Save size={14} /> Save Changes</span>
                  <ChevronRight size={13} />
                </button>

                {status === 'Draft' && (
                  <button
                    onClick={handleIssuePrescription}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Issue Prescription</span>
                    <ChevronRight size={13} />
                  </button>
                )}

                <button
                  onClick={() => setPrintModalOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-2"><Printer size={14} /> Print Preview</span>
                  <ChevronRight size={13} />
                </button>

                <button
                  onClick={() => showToast(`Downloaded PDF for ${prescriptionId}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-2"><Download size={14} /> Download PDF</span>
                  <ChevronRight size={13} />
                </button>

                <button
                  onClick={() => onViewConsultation?.(patientData.consultationId)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-2"><FileText size={14} /> View Consultation</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </Card>

            {/* CARD 02: Prescription Summary */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Prescription Summary
              </h4>

              <div className="space-y-2.5 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-semibold text-slate-800">{patientData.doctorName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Department</span>
                  <span className="font-medium text-slate-700">{patientData.department}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Medicines</span>
                  <span className="font-bold text-[#009688]">{medicines.length} Medicines</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Follow-up Date</span>
                  <span className="font-bold text-[#111827]">{nextVisitDate}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Current Status</span>
                  <div>{renderStatusChip(status)}</div>
                </div>
              </div>
            </Card>

            {/* CARD 03: Revision Timeline */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Revision Timeline
              </h4>

              <div className="space-y-3">
                {[
                  { title: 'Prescription Created', time: '08:30 AM', date: '24 Jul 2026' },
                  { title: 'Medicine Updated', time: '10:15 AM', date: '24 Jul 2026' },
                  { title: 'Advice Modified', time: '10:45 AM', date: '24 Jul 2026' },
                  { title: 'Follow-up Updated', time: '11:00 AM', date: '24 Jul 2026' },
                  { title: 'Prescription Saved', time: '11:15 AM', date: '24 Jul 2026' },
                  { title: 'Prescription Issued', time: 'Pending Issue', date: 'Today', isPending: status === 'Draft' }
                ].map((ev, i, arr) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${ev.isPending ? 'bg-amber-400' : 'bg-[#009688]'}`} />
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#111827]" style={{ fontFamily: PP }}>{ev.title}</div>
                      <div className="text-[10px] text-slate-400" style={{ fontFamily: RB }}>{ev.date} · {ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] px-6 py-3 shadow-lg flex items-center justify-between">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl border border-gray-300 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
              style={{ fontFamily: RB }}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveChanges}
            className="px-5 py-2 rounded-xl border border-[#0D47A1] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Save size={14} />
            Save Changes
          </button>
          {status === 'Draft' && (
            <button
              onClick={handleIssuePrescription}
              className="px-5 py-2 rounded-xl bg-[#009688] hover:bg-[#00827a] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <CheckCircle2 size={14} />
              Issue Prescription
            </button>
          )}
        </div>
      </div>

      {/* ── PRINT PREVIEW MODAL ── */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-[#0D47A1]" />
                <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>Print Prescription Preview</h3>
              </div>
              <button onClick={() => setPrintModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 mb-5 text-xs text-slate-700 space-y-3" style={{ fontFamily: RB }}>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-[#0D47A1]">HMS Hospital & Research Center</span>
                <span className="font-mono text-slate-500">{prescriptionId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Patient:</strong> {patientData.patientName}</div>
                <div><strong>MRN:</strong> {patientData.mrn}</div>
                <div><strong>Doctor:</strong> {patientData.doctorName}</div>
                <div><strong>Date:</strong> {patientData.consultationDate}</div>
              </div>
              <div><strong>Diagnosis:</strong> {finalDiagnosis}</div>
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold mb-1">Medicines ({medicines.length}):</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {medicines.map((m) => (
                    <li key={m.id}>{m.name} {m.strength} — {m.frequency} ({m.instructions})</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
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
                  showToast(`Prescription ${prescriptionId} sent to printer`)
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

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 7 — Doctor Prescription Print Preview Screen (A4 Centered Workspace)
// ═══════════════════════════════════════════════════════════════════════════════
export function DoctorPrescriptionPrintPreviewScreen({
  prescriptionId = 'RX-2026-0891',
  onBack,
  onViewConsultation
}: {
  prescriptionId?: string
  onBack?: () => void
  onViewConsultation?: (consultId: string) => void
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  
  // Print Settings State
  const [paperSize, setPaperSize] = useState('A4')
  const [orientation, setOrientation] = useState('Portrait')
  const [margins, setMargins] = useState('Standard')
  const [colorMode, setColorMode] = useState('Color')
  const [copies, setCopies] = useState(1)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Prescription Record matching spec
  const docData = {
    // Hospital Header
    hospitalName: 'Safe Hands Hospital',
    hospitalAddress: '100 Healthcare Boulevard, Suite 400, Metro Health City',
    hospitalContact: '+1 (800) 555-4671 | emergency@hmshospital.org',
    hospitalEmail: 'info@hmshospital.org',
    hospitalRegNo: 'HOSP-REG-2024-9981',

    // Document & Info
    prescriptionId: prescriptionId,
    consultationId: 'CNS-1001',
    prescriptionDate: '24 Jul 2026, 09:42 AM',
    status: 'Issued' as RxStatus,

    // Patient Info
    patientName: 'Sarah Mitchell',
    mrn: 'MRN-892101',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    mobileNumber: '+1 (555) 234-5678',

    // Doctor Info
    doctorName: 'Dr. Arjun Mehta',
    department: 'Department of Cardiology',
    medicalRegNo: 'MCI-REG-882910',

    // Diagnosis
    chiefComplaint: 'Severe chest tightness radiating to left shoulder with acute dyspnea on exertion.',
    clinicalFindings: 'Chest wall non-tender. S1 and S2 heart sounds heard normal. BP 145/92 mmHg, HR 88 bpm.',
    finalDiagnosis: 'Angina Pectoris, unspecified',
    icdCode: 'I20.9 — Angina Pectoris, unspecified',

    // Medicines Table
    medicines: [
      { id: '1', name: 'Amlodipine', strength: '5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', quantity: '30 Tabs', instructions: 'Take after breakfast with full glass of water' },
      { id: '2', name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '30 Days', quantity: '60 Tabs', instructions: 'Take immediately with morning & evening meals' },
      { id: '3', name: 'Atorvastatin', strength: '20mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Nightly (HS)', duration: '30 Days', quantity: '30 Tabs', instructions: 'Take before sleeping' },
      { id: '4', name: 'Aspirin', strength: '75mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', quantity: '30 Tabs', instructions: 'Take after lunch' }
    ],

    // Advice
    dietAdvice: 'Strict low-sodium (< 2g/day), low saturated fat diet. Increase fiber intake.',
    lifestyleAdvice: 'Smoking cessation strictly advised. Avoid stress and maintain regular sleep hygiene (7-8 hours).',
    exerciseAdvice: 'Daily light 20-30 min walking after 1 week.',
    specialInstructions: 'If chest pain recurs or intensifies, use sublingual GTN spray immediately and report to ER.',

    // Followup
    followupRequired: 'Yes',
    nextVisitDate: '31 Jul 2026',
    followupNotes: 'Review ECG & Troponin-I laboratory reports. Re-evaluate blood pressure control.'
  }

  // Handle Browser Triggered Print
  const handlePrint = () => {
    showToast(`Sending ${copies} copy (${paperSize}, ${colorMode}) of ${prescriptionId} to printer...`)
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const renderStatusChip = (st: RxStatus) => {
    switch (st) {
      case 'Draft':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Draft</span>
      case 'Issued':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />Issued</span>
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />Completed</span>
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />Cancelled</span>
      case 'Archived':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Archived</span>
    }
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-16 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce" style={{ fontFamily: RB }}>
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      {/* ── BREADCRUMB & HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>Prescriptions</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">Print Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Prescription Print Preview
              </h1>
              {renderStatusChip(docData.status)}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Preview the prescription exactly as it will appear when printed or downloaded.
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
                Back to Details
              </button>
            )}
            <button
              onClick={() => showToast(`Downloaded PDF for ${prescriptionId}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#0D47A1] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Download size={14} />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Printer size={14} />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE CONTENT WITH CENTERED A4 PAPER PREVIEW & RIGHT PANEL ── */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── CENTER / MAIN WORKSPACE (Col-span-8 / 9): Centered A4 Document ── */}
          <div className="lg:col-span-8 xl:col-span-9 flex justify-center">
            
            {/* ── A4 WHITE PAPER CONTAINER (Subtle Shadow, Exact Print Layout) ── */}
            <div
              id="printable-a4-document"
              className="w-full max-w-[800px] bg-white rounded-none sm:rounded-lg shadow-xl border border-gray-200 p-8 sm:p-10 text-slate-800 transition-all print:shadow-none print:border-none print:p-0 print:m-0"
              style={{ minHeight: '1120px' }}
            >
              {/* 1. Hospital Header */}
              <div className="flex justify-between items-start pb-4 border-b-2 border-[#0D47A1]">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <img src={safeHandsLogo} alt="Safe Hands Hospital Logo" className="w-9 h-9 object-contain rounded-lg shrink-0" />
                    <h2 className="text-lg font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>
                      {docData.hospitalName}
                    </h2>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight" style={{ fontFamily: RB }}>
                    {docData.hospitalAddress}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: RB }}>
                    {docData.hospitalContact} | {docData.hospitalEmail}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block" style={{ fontFamily: PP }}>Hospital Reg No.</span>
                  <span className="font-mono text-xs font-semibold text-slate-700">{docData.hospitalRegNo}</span>
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded bg-blue-50 text-[#0D47A1] text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: PP }}>
                    OPD Prescription
                  </div>
                </div>
              </div>

              {/* 2. Metadata Grid: Prescription & Patient Info */}
              <div className="my-5 p-4 bg-slate-50 rounded-xl border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Rx Number</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">{docData.prescriptionId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Consultation ID</span>
                  <span className="font-mono font-medium text-slate-700">{docData.consultationId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Prescription Date</span>
                  <span className="font-medium text-slate-700">{docData.prescriptionDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Status</span>
                  <span className="font-bold text-emerald-600">{docData.status}</span>
                </div>

                <div className="col-span-2 sm:col-span-4 pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Patient Name</span>
                    <span className="font-bold text-[#111827] text-sm">{docData.patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>MRN</span>
                    <span className="font-mono font-bold text-[#0D47A1]">{docData.mrn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Age / Gender</span>
                    <span className="font-medium text-slate-700">{docData.age} yrs / {docData.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Blood Group</span>
                    <span className="font-bold text-slate-800">{docData.bloodGroup}</span>
                  </div>
                </div>
              </div>

              {/* 3. Doctor Information Strip */}
              <div className="mb-5 px-4 py-2.5 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Prescribing Doctor</span>
                  <span className="font-bold text-[#111827] text-sm" style={{ fontFamily: PP }}>{docData.doctorName}</span>
                  <span className="text-[#0D47A1] ml-2 font-medium">({docData.department})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Medical Registration No.</span>
                  <span className="font-mono font-semibold text-slate-700">{docData.medicalRegNo}</span>
                </div>
              </div>

              {/* 4. Diagnosis Summary */}
              <div className="mb-6 space-y-2 text-xs" style={{ fontFamily: RB }}>
                <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider border-b border-gray-200 pb-1" style={{ fontFamily: PP }}>
                  Clinical Diagnosis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Chief Complaint</span>
                    <p className="text-slate-800 font-medium">{docData.chiefComplaint}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Clinical Findings</span>
                    <p className="text-slate-700">{docData.clinicalFindings}</p>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0" style={{ fontFamily: PP }}>Final Diagnosis:</span>
                    <span className="font-bold text-[#111827]">{docData.finalDiagnosis}</span>
                    <span className="font-mono text-[11px] bg-blue-100 text-[#0D47A1] px-2 py-0.5 rounded font-semibold ml-auto">{docData.icdCode}</span>
                  </div>
                </div>
              </div>

              {/* 5. Printable Medicine Table */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                  <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Rx — Prescribed Medications ({docData.medicines.length})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium" style={{ fontFamily: RB }}>Rx Symbol Indexed</span>
                </div>

                <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                  <thead>
                    <tr className="bg-slate-100 border-b border-gray-300 text-[10px] font-bold text-slate-700 uppercase" style={{ fontFamily: PP }}>
                      <th className="p-2">#</th>
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
                  <tbody className="divide-y divide-gray-200 text-slate-800">
                    {docData.medicines.map((m, idx) => (
                      <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                        <td className="p-2 font-mono font-bold text-slate-400 text-[11px]">{idx + 1}</td>
                        <td className="p-2 font-bold text-[#111827]" style={{ fontFamily: PP }}>{m.name}</td>
                        <td className="p-2 font-medium">{m.strength}</td>
                        <td className="p-2 text-slate-600">{m.route}</td>
                        <td className="p-2 font-medium">{m.dosage}</td>
                        <td className="p-2 font-semibold text-[#0D47A1]">{m.frequency}</td>
                        <td className="p-2">{m.duration}</td>
                        <td className="p-2 font-mono font-medium">{m.quantity}</td>
                        <td className="p-2 text-slate-600 italic text-[11px] max-w-xs">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 6. General Advice & Recommendations */}
              <div className="mb-6 space-y-2 text-xs" style={{ fontFamily: RB }}>
                <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider border-b border-gray-200 pb-1" style={{ fontFamily: PP }}>
                  General Advice & Lifestyle Instructions
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Diet Advice</span>
                    <p className="text-slate-700">{docData.dietAdvice}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Lifestyle Advice</span>
                    <p className="text-slate-700">{docData.lifestyleAdvice}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Exercise Advice</span>
                    <p className="text-slate-700">{docData.exerciseAdvice}</p>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block" style={{ fontFamily: PP }}>Special Instructions</span>
                    <p className="text-amber-900 font-medium">{docData.specialInstructions}</p>
                  </div>
                </div>
              </div>

              {/* 7. Follow-up Details */}
              <div className="mb-8 p-3 bg-slate-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Follow-up Visit</span>
                  <span className="font-bold text-[#111827] text-sm">Required — Next Visit Date: {docData.nextVisitDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Follow-up Notes</span>
                  <span className="text-slate-600 italic">{docData.followupNotes}</span>
                </div>
              </div>

              {/* 8. Doctor Signature & Hospital Seal Section */}
              <div className="pt-6 border-t border-gray-300 grid grid-cols-2 gap-6 items-end mt-12">
                {/* Hospital Seal Placeholder */}
                <div>
                  <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-full flex flex-col items-center justify-center text-center p-2 text-[9px] text-slate-400" style={{ fontFamily: PP }}>
                    <span className="font-bold uppercase tracking-widest text-[8px] text-slate-400">HMS SEAL</span>
                    <span>Official Stamp</span>
                  </div>
                </div>

                {/* Doctor Signature */}
                <div className="text-right space-y-1">
                  <div className="h-12 flex justify-end items-end pb-1">
                    <span className="font-serif italic text-lg font-bold text-[#0D47A1] border-b border-slate-400 pr-8 pl-4">
                      Dr. Arjun Mehta
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{docData.doctorName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{docData.medicalRegNo}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Date: 24 Jul 2026</div>
                </div>
              </div>

              {/* 9. Document Footer */}
              <div className="mt-8 pt-3 border-t border-gray-200 text-center text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-1" style={{ fontFamily: RB }}>
                <span>This prescription was generated electronically through the HMS Operations Center.</span>
                <span className="font-semibold text-slate-500">Page 1 of 1</span>
                <span>HMS Medical Center · Confidential</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT CONTEXT PANEL (Col-span-4 / 3): Print Actions & Settings ── */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4 print:hidden">

            {/* Card 1: Document Information */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Document Information
              </h4>

              <div className="space-y-2.5 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Prescription ID</span>
                  <span className="font-mono font-bold text-[#0D47A1]">{docData.prescriptionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Consultation ID</span>
                  {onViewConsultation ? (
                    <button
                      onClick={() => onViewConsultation(docData.consultationId)}
                      className="font-mono text-[#0D47A1] font-semibold hover:underline"
                    >
                      {docData.consultationId}
                    </button>
                  ) : (
                    <span className="font-mono text-slate-700">{docData.consultationId}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Issued Date</span>
                  <span className="text-slate-700">24 Jul 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status</span>
                  <div>{renderStatusChip(docData.status)}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Total Medicines</span>
                  <span className="font-bold text-[#009688]">{docData.medicines.length} Medicines</span>
                </div>
              </div>
            </Card>

            {/* Card 2: Quick Actions */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Quick Actions
              </h4>

              <div className="space-y-2">
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Printer size={15} /> Print Document</span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => showToast(`Downloaded PDF for ${prescriptionId}`)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Download size={15} /> Download PDF</span>
                  <ChevronRight size={14} />
                </button>

                {onBack && (
                  <button
                    onClick={onBack}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    style={{ fontFamily: RB }}
                  >
                    <span className="flex items-center gap-2"><ChevronLeft size={14} /> Back to Details</span>
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </Card>

            {/* Card 3: Print Settings */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Print Settings
              </h4>

              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Paper Size</label>
                  <select
                    value={paperSize}
                    onChange={e => setPaperSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  >
                    <option value="A4">A4 (210 x 297 mm)</option>
                    <option value="Letter">US Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Orientation</label>
                  <select
                    value={orientation}
                    onChange={e => setOrientation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  >
                    <option value="Portrait">Portrait</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Margins</label>
                  <select
                    value={margins}
                    onChange={e => setMargins(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  >
                    <option value="Standard">Standard (0.5 in)</option>
                    <option value="Narrow">Narrow (0.25 in)</option>
                    <option value="Wide">Wide (1.0 in)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Color Mode</label>
                  <select
                    value={colorMode}
                    onChange={e => setColorMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  >
                    <option value="Color">Full Color</option>
                    <option value="Black & White">Black & White / Monochromatic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Copies</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={copies}
                    onChange={e => setCopies(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  />
                </div>
              </div>
            </Card>

          </div>

        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 8 — Doctor Prescription History Screen (Read-Only 3-Column Workspace)
// ═══════════════════════════════════════════════════════════════════════════════
export function DoctorPrescriptionHistoryScreen({
  patientMrn = 'MRN-892101',
  onBack,
  onViewPrescription,
  onPrintPreview,
  onViewPatientProfile
}: {
  patientMrn?: string
  onBack?: () => void
  onViewPrescription?: (rxId: string) => void
  onPrintPreview?: (rxId: string) => void
  onViewPatientProfile?: (mrn: string) => void
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [isLoading] = useState(false)

  // Filters State
  const [searchRxId, setSearchRxId] = useState('')
  const [dateRange, setDateRange] = useState('All')
  const [selectedDoctor, setSelectedDoctor] = useState('All')
  const [selectedDept, setSelectedDept] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [medicineFilter, setMedicineFilter] = useState('')
  const [expandedRxId, setExpandedRxId] = useState<string | null>('RX-2026-0891')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleResetFilters = () => {
    setSearchRxId('')
    setDateRange('All')
    setSelectedDoctor('All')
    setSelectedDept('All')
    setSelectedStatus('All')
    setMedicineFilter('')
  }

  // Mock Patient Profile
  const patientData = {
    patientName: 'Sarah Mitchell',
    mrn: patientMrn,
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    photo: '',
    mobileNumber: '+1 (555) 234-5678',
    primaryDoctor: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    registrationDate: '12 Jan 2024',
    lastVisitDate: '24 Jul 2026',
    status: 'Active',
    allergies: ['Penicillin', 'Aspirin'],
    knownConditions: ['Hypertension', 'Borderline Type 2 Diabetes', 'Hyperlipidemia']
  }

  // Prescription Timeline Items
  const prescriptionHistoryData = [
    {
      id: 'RX-2026-0891',
      consultationId: 'CNS-1001',
      consultationDate: '24 Jul 2026, 09:42 AM',
      doctor: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      diagnosis: 'Angina Pectoris, unspecified (ICD: I20.9)',
      totalMedicines: 4,
      status: 'Issued' as RxStatus,
      medicines: [
        { name: 'Amlodipine', strength: '5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days' },
        { name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '30 Days' },
        { name: 'Atorvastatin', strength: '20mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Nightly (HS)', duration: '30 Days' },
        { name: 'Aspirin', strength: '75mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days' }
      ]
    },
    {
      id: 'RX-2026-0412',
      consultationId: 'CNS-0842',
      consultationDate: '10 Apr 2026, 11:15 AM',
      doctor: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      diagnosis: 'Essential (primary) hypertension (ICD: I10)',
      totalMedicines: 3,
      status: 'Completed' as RxStatus,
      medicines: [
        { name: 'Amlodipine', strength: '5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '90 Days' },
        { name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '90 Days' },
        { name: 'Atorvastatin', strength: '10mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Nightly (HS)', duration: '90 Days' }
      ]
    },
    {
      id: 'RX-2025-1108',
      consultationId: 'CNS-0512',
      consultationDate: '15 Nov 2025, 02:30 PM',
      doctor: 'Dr. Priya Sharma',
      department: 'General Medicine',
      diagnosis: 'Type 2 diabetes mellitus without complications (ICD: E11.9)',
      totalMedicines: 2,
      status: 'Completed' as RxStatus,
      medicines: [
        { name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '90 Days' },
        { name: 'Amlodipine', strength: '2.5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '90 Days' }
      ]
    },
    {
      id: 'RX-2024-0210',
      consultationId: 'CNS-0105',
      consultationDate: '14 Feb 2024, 10:00 AM',
      doctor: 'Dr. Priya Sharma',
      department: 'General Medicine',
      diagnosis: 'Acute upper respiratory infection (ICD: J06.9)',
      totalMedicines: 3,
      status: 'Completed' as RxStatus,
      medicines: [
        { name: 'Amoxicillin', strength: '500mg', route: 'Oral', dosage: '1 Capsule', frequency: 'Thrice Daily (TDS)', duration: '7 Days' },
        { name: 'Paracetamol', strength: '650mg', route: 'Oral', dosage: '1 Tablet', frequency: 'PRN fever/pain', duration: '5 Days' },
        { name: 'Cetirizine', strength: '10mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Nightly (HS)', duration: '7 Days' }
      ]
    }
  ]

  // Cumulative Medicine History Table Records
  const allMedicineRecords = [
    { id: 'm1', name: 'Amlodipine', strength: '5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', prescribedBy: 'Dr. Arjun Mehta', date: '24 Jul 2026', isLongTerm: true },
    { id: 'm2', name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '30 Days', prescribedBy: 'Dr. Arjun Mehta', date: '24 Jul 2026', isLongTerm: true },
    { id: 'm3', name: 'Atorvastatin', strength: '20mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Nightly (HS)', duration: '30 Days', prescribedBy: 'Dr. Arjun Mehta', date: '24 Jul 2026', isLongTerm: true },
    { id: 'm4', name: 'Aspirin', strength: '75mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '30 Days', prescribedBy: 'Dr. Arjun Mehta', date: '24 Jul 2026', isLongTerm: false },
    { id: 'm5', name: 'Amlodipine', strength: '5mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Once Daily (OD)', duration: '90 Days', prescribedBy: 'Dr. Arjun Mehta', date: '10 Apr 2026', isLongTerm: true },
    { id: 'm6', name: 'Metformin', strength: '500mg', route: 'Oral', dosage: '1 Tablet', frequency: 'Twice Daily (BD)', duration: '90 Days', prescribedBy: 'Dr. Arjun Mehta', date: '10 Apr 2026', isLongTerm: true },
    { id: 'm7', name: 'Amoxicillin', strength: '500mg', route: 'Oral', dosage: '1 Capsule', frequency: 'Thrice Daily (TDS)', duration: '7 Days', prescribedBy: 'Dr. Priya Sharma', date: '14 Feb 2024', isLongTerm: false }
  ]

  // Diagnosis History
  const diagnosisHistoryData = [
    { date: '24 Jul 2026', diagnosis: 'Angina Pectoris, unspecified', icdCode: 'I20.9', doctor: 'Dr. Arjun Mehta', department: 'Cardiology' },
    { date: '10 Apr 2026', diagnosis: 'Essential (primary) hypertension', icdCode: 'I10', doctor: 'Dr. Arjun Mehta', department: 'Cardiology' },
    { date: '15 Nov 2025', diagnosis: 'Type 2 diabetes mellitus without complications', icdCode: 'E11.9', doctor: 'Dr. Priya Sharma', department: 'General Medicine' },
    { date: '14 Feb 2024', diagnosis: 'Acute upper respiratory infection', icdCode: 'J06.9', doctor: 'Dr. Priya Sharma', department: 'General Medicine' }
  ]

  // Follow-up History
  const followupHistoryData = [
    { date: '31 Jul 2026', status: 'Scheduled', doctor: 'Dr. Arjun Mehta', outcome: 'Pending Review', notes: 'ECG & Troponin-I report review' },
    { date: '24 Jul 2026', status: 'Completed', doctor: 'Dr. Arjun Mehta', outcome: 'Adjusted Rx', notes: 'Increased Atorvastatin to 20mg' },
    { date: '10 Apr 2026', status: 'Completed', doctor: 'Dr. Arjun Mehta', outcome: 'Stable', notes: 'BP controlled at 135/85 mmHg' },
    { date: '20 Nov 2025', status: 'Completed', doctor: 'Dr. Priya Sharma', outcome: 'Stable', notes: 'HbA1c 6.4%, glucose under control' }
  ]

  // Filtering Logic
  const filteredTimeline = prescriptionHistoryData.filter(rx => {
    const matchesSearch = searchRxId === '' || rx.id.toLowerCase().includes(searchRxId.toLowerCase()) || rx.diagnosis.toLowerCase().includes(searchRxId.toLowerCase())
    const matchesDoctor = selectedDoctor === 'All' || rx.doctor === selectedDoctor
    const matchesDept = selectedDept === 'All' || rx.department === selectedDept
    const matchesStatus = selectedStatus === 'All' || rx.status === selectedStatus
    const matchesMedicine = medicineFilter === '' || rx.medicines.some(m => m.name.toLowerCase().includes(medicineFilter.toLowerCase()))

    return matchesSearch && matchesDoctor && matchesDept && matchesStatus && matchesMedicine
  })

  const renderStatusChip = (st: RxStatus) => {
    switch (st) {
      case 'Draft':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Draft</span>
      case 'Issued':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />Issued</span>
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />Completed</span>
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />Cancelled</span>
      case 'Archived':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" style={{ fontFamily: PP }}><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Archived</span>
    }
  }

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-20">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-16 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce" style={{ fontFamily: RB }}>
          <CheckCircle2 size={15} className="text-[#66BB6A]" />
          {toastMsg}
        </div>
      )}

      {/* ── BREADCRUMB & PAGE HEADER ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>Prescriptions</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">Prescription History</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Prescription History
              </h1>
              <span className="font-mono text-xs bg-blue-50 text-[#0D47A1] px-2.5 py-0.5 rounded-full font-bold">
                {prescriptionHistoryData.length} Total Records
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Review previous prescriptions, medicines and follow-up history for this patient.
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
                Back to List
              </button>
            )}
            <button
              onClick={() => showToast(`Exported full history PDF for ${patientMrn}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#0D47A1] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Download size={14} />
              Download History PDF
            </button>
            <button
              onClick={() => showToast(`Sent full prescription history for ${patientMrn} to printer`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Printer size={14} />
              Print History
            </button>
          </div>
        </div>
      </div>

      {/* ── PATIENT HERO HEADER (Reused) ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Avatar name={patientData.patientName} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{patientData.patientName}</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{patientData.mrn}</span>
                <span className="font-mono text-[10px] bg-emerald-50 text-[#009688] px-2 py-0.5 rounded font-bold">{patientData.status}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                <span>{patientData.age} yrs / {patientData.gender}</span>
                <span>•</span>
                <span>Blood Group: <strong className="text-[#111827]">{patientData.bloodGroup}</strong></span>
                <span>•</span>
                <span>Primary Doctor: <strong className="text-[#111827]">{patientData.primaryDoctor} ({patientData.department})</strong></span>
                <span>•</span>
                <span>Last Visit: <strong className="text-[#111827]">{patientData.lastVisitDate}</strong></span>
              </div>
            </div>

            {/* Allergy alert badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0" style={{ fontFamily: PP }}>
              <AlertTriangle size={13} />
              <span>Allergies: {patientData.allergies.join(', ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewPatientProfile?.(patientData.mrn)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700"
              style={{ fontFamily: PP }}
            >
              <User size={13} />
              View Full Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE CONTENT: 3-COLUMN LAYOUT ── */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT PANEL (Col-span-3): Patient Summary ── */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Patient Details
              </h3>

              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>MRN</span>
                  <span className="font-mono font-bold text-[#0D47A1] text-sm">{patientData.mrn}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Mobile Number</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {patientData.mobileNumber}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Blood Group</span>
                  <span className="font-bold text-slate-800">{patientData.bloodGroup}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Allergies</span>
                  <div className="flex flex-wrap gap-1">
                    {patientData.allergies.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-semibold" style={{ fontFamily: PP }}>
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Known Medical Conditions</span>
                  <div className="flex flex-wrap gap-1">
                    {patientData.knownConditions.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium" style={{ fontFamily: RB }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5" style={{ fontFamily: PP }}>Primary Doctor</span>
                  <span className="font-semibold text-slate-800">{patientData.primaryDoctor}</span>
                  <span className="text-[10px] text-slate-500 block">{patientData.department}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Registered</span>
                    <span className="text-[11px] text-slate-600">{patientData.registrationDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Last Visit</span>
                    <span className="text-[11px] text-slate-600">{patientData.lastVisitDate}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── CENTER CONTENT (Col-span-6): History & Timeline ── */}
          <div className="lg:col-span-6 space-y-6">

            {/* SECTION 01: History Filters */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>
                  Filter Prescription History
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#0D47A1] font-semibold hover:underline"
                  style={{ fontFamily: PP }}
                >
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Search Rx / Diagnosis</label>
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rx ID or Diagnosis..."
                      value={searchRxId}
                      onChange={e => setSearchRxId(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Medicine Name</label>
                  <input
                    type="text"
                    placeholder="Filter medicine..."
                    value={medicineFilter}
                    onChange={e => setMedicineFilter(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Date Range</label>
                  <select
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  >
                    <option value="All">All Time</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Last 6 Months">Last 6 Months</option>
                    <option value="Last 1 Year">Last 1 Year</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Prescribing Doctor</label>
                  <select
                    value={selectedDoctor}
                    onChange={e => setSelectedDoctor(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  >
                    <option value="All">All Doctors</option>
                    <option value="Dr. Arjun Mehta">Dr. Arjun Mehta</option>
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1" style={{ fontFamily: PP }}>Department</label>
                  <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-slate-700 font-medium"
                  >
                    <option value="All">All Departments</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
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
                    <option value="Draft">Draft</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* SECTION 02: Prescription Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
                  Chronological Prescription Timeline ({filteredTimeline.length})
                </h3>
              </div>

              {isLoading ? (
                /* Skeleton Loader */
                <div className="space-y-3">
                  {[1, 2].map(n => (
                    <Card key={n} className="p-4 animate-pulse space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 rounded w-2/3" />
                    </Card>
                  ))}
                </div>
              ) : filteredTimeline.length === 0 ? (
                /* Empty State */
                <Card className="p-8 text-center">
                  <Pill size={32} className="mx-auto text-slate-300 mb-2" />
                  <h4 className="text-sm font-bold text-slate-700" style={{ fontFamily: PP }}>No prescription history available</h4>
                  <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: RB }}>No records matched your search or filter parameters.</p>
                </Card>
              ) : (
                /* Timeline Cards */
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {filteredTimeline.map((rx) => {
                    const isExpanded = expandedRxId === rx.id

                    return (
                      <div key={rx.id} className="relative">
                        {/* Timeline node */}
                        <div className="absolute -left-6 top-3 w-3 h-3 rounded-full bg-[#0D47A1] border-2 border-white shadow-sm" />

                        <Card className="p-4 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#0D47A1] text-sm">{rx.id}</span>
                                {renderStatusChip(rx.status)}
                                <span className="text-xs text-slate-400 font-mono">({rx.consultationId})</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: RB }}>
                                {rx.consultationDate} • <strong className="text-slate-700">{rx.doctor}</strong> ({rx.department})
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => onViewPrescription?.(rx.id)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                style={{ fontFamily: PP }}
                              >
                                <Eye size={12} /> View Details
                              </button>
                              <button
                                onClick={() => onPrintPreview?.(rx.id)}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                                title="Print Preview"
                              >
                                <Printer size={14} />
                              </button>
                              <button
                                onClick={() => showToast(`Downloaded PDF for ${rx.id}`)}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                                title="Download PDF"
                              >
                                <Download size={14} />
                              </button>
                              <button
                                onClick={() => setExpandedRxId(isExpanded ? null : rx.id)}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                                title={isExpanded ? 'Collapse' : 'Expand'}
                              >
                                <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2 text-xs" style={{ fontFamily: RB }}>
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-slate-400 uppercase shrink-0 text-[10px]" style={{ fontFamily: PP }}>Diagnosis:</span>
                              <span className="font-semibold text-[#111827]">{rx.diagnosis}</span>
                            </div>

                            {/* Medicines snippet / expanded view */}
                            <div className="pt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-[#009688] uppercase" style={{ fontFamily: PP }}>
                                  Prescribed Medicines ({rx.medicines.length})
                                </span>
                              </div>

                              {isExpanded ? (
                                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                                  {rx.medicines.map((m, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-gray-100 last:border-none">
                                      <span className="font-bold text-slate-800" style={{ fontFamily: PP }}>{m.name} {m.strength}</span>
                                      <span className="text-slate-600">{m.frequency} ({m.duration})</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {rx.medicines.map((m, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                                      {m.name} {m.strength}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* SECTION 03: Cumulative Medicine History Table */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Pill size={16} className="text-[#009688]" />
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>
                    Cumulative Medicine History
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-medium" style={{ fontFamily: RB }}>Long-term & Recurring Tagged</span>
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
                      <th className="p-2">Prescribed By</th>
                      <th className="p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allMedicineRecords.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-2 font-bold text-[#111827]" style={{ fontFamily: PP }}>
                          <div className="flex items-center gap-1.5">
                            <span>{m.name}</span>
                            {m.isLongTerm && (
                              <span className="px-1.5 py-0.2 bg-teal-50 text-[#009688] border border-teal-200 rounded text-[9px] font-bold shrink-0" title="Identified as Long-Term Medication">
                                Long-Term
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2 text-slate-700">{m.strength}</td>
                        <td className="p-2 text-slate-600">{m.route}</td>
                        <td className="p-2 text-slate-700 font-medium">{m.dosage}</td>
                        <td className="p-2 font-semibold text-[#0D47A1]">{m.frequency}</td>
                        <td className="p-2 text-slate-600">{m.duration}</td>
                        <td className="p-2 text-slate-700">{m.prescribedBy}</td>
                        <td className="p-2 text-slate-500 font-mono text-[11px]">{m.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* SECTION 04: Diagnosis History Table */}
            <Card className="p-4">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Diagnosis History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs" style={{ fontFamily: RB }}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 text-[10px] font-bold text-slate-500 uppercase" style={{ fontFamily: PP }}>
                      <th className="p-2">Visit Date</th>
                      <th className="p-2">Diagnosis</th>
                      <th className="p-2">ICD Code</th>
                      <th className="p-2">Treating Doctor</th>
                      <th className="p-2">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {diagnosisHistoryData.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-2 font-mono text-slate-600 font-medium">{d.date}</td>
                        <td className="p-2 font-bold text-[#111827]" style={{ fontFamily: PP }}>{d.diagnosis}</td>
                        <td className="p-2 font-mono font-semibold text-[#0D47A1]">{d.icdCode}</td>
                        <td className="p-2 text-slate-700">{d.doctor}</td>
                        <td className="p-2 text-slate-500">{d.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* SECTION 05: Follow-up History */}
            <Card className="p-4">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Follow-up History
              </h3>

              <div className="space-y-2.5 text-xs" style={{ fontFamily: RB }}>
                {followupHistoryData.map((f, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827]" style={{ fontFamily: PP }}>Follow-up Date: {f.date}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${f.status === 'Scheduled' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {f.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 italic">{f.notes}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block" style={{ fontFamily: PP }}>Doctor / Outcome</span>
                      <span className="font-semibold text-slate-700">{f.doctor} • <strong className="text-[#0D47A1]">{f.outcome}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* ── RIGHT CONTEXT PANEL (Col-span-3): Clinical Summary & Quick Actions ── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Card 1: Patient Summary */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Patient Summary
              </h4>

              <div className="space-y-2.5 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Prescriptions</span>
                  <span className="font-bold text-[#0D47A1] text-sm">4 Issued</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Last Prescription Date</span>
                  <span className="text-slate-700 font-medium">24 Jul 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Current Active Medicines</span>
                  <span className="font-bold text-[#009688]">4 Medicines</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-slate-500">Total Follow-ups</span>
                  <span className="font-semibold text-slate-800">4 Recorded</span>
                </div>
              </div>
            </Card>

            {/* Card 2: Quick Actions */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Quick Actions
              </h4>

              <div className="space-y-2">
                <button
                  onClick={() => onViewPrescription?.('RX-2026-0891')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-semibold transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Eye size={15} /> View Latest Prescription</span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => showToast(`Sent full prescription history for ${patientMrn} to printer`)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Printer size={15} /> Print History</span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => showToast(`Downloaded PDF for ${patientMrn}`)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <span className="flex items-center gap-2"><Download size={15} /> Download History PDF</span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => onViewPatientProfile?.(patientMrn)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  style={{ fontFamily: RB }}
                >
                  <span className="flex items-center gap-2"><User size={14} /> Open Patient Profile</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </Card>

            {/* Card 3: Clinical Timeline Summary */}
            <Card className="p-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100" style={{ fontFamily: PP }}>
                Clinical Timeline
              </h4>

              <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>First Consultation</span>
                  <span className="font-medium text-slate-700">14 Feb 2024 (Dr. Priya Sharma)</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Latest Prescription</span>
                  <span className="font-mono font-semibold text-[#0D47A1]">RX-2026-0891 (24 Jul 2026)</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Latest Follow-up</span>
                  <span className="font-semibold text-emerald-600">31 Jul 2026 (Scheduled)</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block" style={{ fontFamily: PP }}>Most Recent Diagnosis</span>
                  <span className="font-semibold text-slate-800">Angina Pectoris (I20.9)</span>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </div>
    </div>
  )
}




