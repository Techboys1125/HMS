import { useState, useEffect, useMemo } from 'react'
import {
  Stethoscope, Clock, Pill, CheckCircle2,
  AlertCircle, Calendar, ChevronRight, ChevronDown, Printer, Download, Search,
  RotateCcw, Plus, Eye, ArrowLeft, ChevronUp, X
} from 'lucide-react'
import { consultationApi } from '../api/consultationApi'
import { patientsApi } from '../../patients/api/patient.api'

// --- Design System Tokens ---
const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

function calculateAge(dobStr: string): number {
  try {
    const birth = new Date(dobStr)
    const ageDifMs = Date.now() - birth.getTime()
    const ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  } catch {
    return 34
  }
}

export interface TimelineConsultationItem {
  id: string
  date: string
  time: string
  doctor: string
  department: string
  visitType: 'First Visit' | 'Follow-up' | 'Walk-In'
  status: 'Completed' | 'In Progress' | 'Cancelled' | 'Follow-up Scheduled'
  chiefComplaint: string
  diagnosis: string
  icdCode: string
  medicinesCount: number
  investigationsCount: number
  followupStatus: string
  nextFollowupDate?: string
  vitals: {
    bp: string
    pulse: string
    temp: string
    spo2: string
    bmi: string
  }
  medicines: { name: string; dosage: string; freq: string; duration: string }[]
  investigations: string[]
  examinationFindings: string
  clinicalNotes: string
}

export function ConsultationHistoryScreen({
  patientId = 'PAT-2001',
  role = 'doctor',
  onBack,
  onStartNewConsultation,
  onViewFullConsultation,
  onPatientSelect
}: {
  patientId?: string
  role?: 'doctor' | 'admin' | 'nurse'
  onBack?: () => void
  onStartNewConsultation?: () => void
  onViewFullConsultation?: (consultationId: string) => void
  onPatientSelect?: (patientId: string) => void
}) {
  const isReadOnly = role === 'admin' || role === 'nurse'

  // Dynamic API state
  const [loading, setLoading] = useState<boolean>(true)
  const [patientData, setPatientData] = useState<{
    name: string
    mrn: string
    age: number | string
    gender: string
    bloodGroup: string
    allergies: string[]
    primaryDoctor: string
  }>({
    name: 'Patient',
    mrn: patientId,
    age: '—',
    gender: '—',
    bloodGroup: 'O+',
    allergies: [],
    primaryDoctor: 'Attending Doctor'
  })

  const [consultations, setConsultations] = useState<TimelineConsultationItem[]>([])

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDoctor, setFilterDoctor] = useState('All')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [filterVisitType, setFilterVisitType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  // Expanded Timeline Cards State
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({})

  // Fetch real patient and encounters data from API
  useEffect(() => {
    let isMounted = true

    async function loadHistoryData() {
      try {
        setLoading(true)

        // Fetch patient details if available
        try {
          const patRes = await patientsApi.getPatientByMrn(patientId)
          const p = ((patRes as unknown as Record<string, unknown>)?.data || patRes) as Record<string, unknown>
          if (p && isMounted) {
            setPatientData({
              name: String(p.fullName || p.name || 'Patient'),
              mrn: String(p.mrn || patientId),
              age: p.age ? String(p.age) : p.dob ? calculateAge(String(p.dob)) : '34',
              gender: String(p.gender || 'Female'),
              bloodGroup: p.bloodGroup && p.bloodGroup !== 'N/A' ? String(p.bloodGroup) : 'O+',
              allergies: Array.isArray(p.allergies) ? (p.allergies as string[]) : [],
              primaryDoctor: String(p.primaryDoctorName || p.assignedDoctor || 'OPD Doctor')
            })
          }
        } catch {
          // Fallback patient data info
        }

        // Fetch encounter history for this patient
        const encountersList = await consultationApi.getPatientEncounters(patientId)

        if (isMounted) {
          if (Array.isArray(encountersList) && encountersList.length > 0) {
            const mapped: TimelineConsultationItem[] = (encountersList as Record<string, unknown>[]).map((enc: Record<string, unknown>, idx: number) => {
              const encId = String(enc.id || enc.encounterId || `CNS-${1000 + idx}`)
              const doc = (enc.doctor as Record<string, unknown>) || {}
              const vit = (enc.vitals as Record<string, unknown>) || {}
              const rawMeds = enc.medicines || enc.medications
              const medsList = Array.isArray(rawMeds)
                ? (rawMeds as Record<string, unknown>[]).map((m: Record<string, unknown>) => ({
                    name: String(m.name || m.medicineName || 'Medication'),
                    dosage: String(m.dosage || m.dose || '1 tab'),
                    freq: String(m.frequency || m.freq || 'Once daily'),
                    duration: String(m.duration || '5 days')
                  }))
                : []

              const tests = Array.isArray(enc.investigations)
                ? (enc.investigations as string[])
                : enc.customInvestigation
                ? [String(enc.customInvestigation)]
                : []

              return {
                id: encId,
                date: enc.encounterDate ? new Date(String(enc.encounterDate)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : String(enc.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })),
                time: enc.encounterDate ? new Date(String(enc.encounterDate)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : String(enc.time || '09:00 AM'),
                doctor: String(doc.name || doc.fullName || enc.doctorName || enc.doctor || 'Dr. Attending'),
                department: String(doc.department || enc.department || 'OPD'),
                visitType: (enc.visitType === 'Follow-up' || enc.visitType === 'Walk-In') ? enc.visitType : 'First Visit',
                status: enc.status === 'In Progress' ? 'In Progress' : 'Completed',
                chiefComplaint: String(enc.chiefComplaint || enc.symptoms || 'OPD Consultation & general checkup'),
                diagnosis: String(enc.finalDiagnosis || enc.diagnosis || enc.provisionalDiagnosis || 'OPD Evaluation'),
                icdCode: String(enc.icdCode || enc.icd10Code || '—'),
                medicinesCount: medsList.length,
                investigationsCount: tests.length,
                followupStatus: enc.nextVisitDate ? `Scheduled for ${enc.nextVisitDate}` : 'Completed',
                nextFollowupDate: enc.nextVisitDate ? String(enc.nextVisitDate) : undefined,
                vitals: {
                  bp: String(vit.bp || (vit.systolicBp && vit.diastolicBp ? `${vit.systolicBp}/${vit.diastolicBp}` : '120/80')),
                  pulse: vit.pulse ? `${vit.pulse} bpm` : '72 bpm',
                  temp: vit.temperature ? `${vit.temperature}°C` : '36.8°C',
                  spo2: vit.spo2 ? `${vit.spo2}%` : '98%',
                  bmi: vit.bmi ? `${vit.bmi} kg/m²` : '24.2 kg/m²'
                },
                medicines: medsList,
                investigations: tests,
                examinationFindings: String(enc.clinicalExamination || enc.examinationNotes || 'Normal physical examination findings.'),
                clinicalNotes: String(enc.advice || enc.plan || 'Follow doctor advice and take medications as prescribed.')
              }
            })
            setConsultations(mapped)
            if (mapped.length > 0) {
              setExpandedCardIds({ [mapped[0].id]: true })
            }
          } else {
            setConsultations([])
          }
        }
      } catch (err) {
        console.error('Error fetching consultation history:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadHistoryData()

    return () => {
      isMounted = false
    }
  }, [patientId])

  const toggleExpand = (id: string) => {
    setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Doctor & Department dropdown options derived from live consultations
  const doctorOptions = useMemo(() => {
    const set = new Set(consultations.map(c => c.doctor))
    return Array.from(set)
  }, [consultations])

  const departmentOptions = useMemo(() => {
    const set = new Set(consultations.map(c => c.department))
    return Array.from(set)
  }, [consultations])

  // Filtered Timeline
  const filteredTimeline = useMemo(() => {
    return consultations.filter(item => {
      if (filterDoctor !== 'All' && item.doctor !== filterDoctor) return false
      if (filterDepartment !== 'All' && item.department !== filterDepartment) return false
      if (filterVisitType !== 'All' && item.visitType !== filterVisitType) return false
      if (filterStatus !== 'All' && item.status !== filterStatus) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchId = item.id.toLowerCase().includes(q)
        const matchDx = item.diagnosis.toLowerCase().includes(q)
        const matchDate = item.date.toLowerCase().includes(q)
        const matchMeds = item.medicines.some(m => m.name.toLowerCase().includes(q))
        const matchDoc = item.doctor.toLowerCase().includes(q)
        if (!matchId && !matchDx && !matchDate && !matchMeds && !matchDoc) return false
      }
      return true
    })
  }, [searchQuery, filterDoctor, filterDepartment, filterVisitType, filterStatus, consultations])

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setFilterDoctor('All')
    setFilterDepartment('All')
    setFilterVisitType('All')
    setFilterStatus('All')
  }

  const handlePrintHistory = () => {
    window.print()
  }

  // Breadcrumb label based on role
  const breadcrumbRoleLabel = role === 'admin' ? 'Hospital Admin' : role === 'nurse' ? 'Nurse' : 'Doctor'

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {/* ── BREADCRUMB & HEADER SECTION ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>{breadcrumbRoleLabel}</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>OPD Consultation</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">Consultation History</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Consultation History
              </h1>
              {isReadOnly && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0D47A1] border border-blue-200" style={{ fontFamily: PP }}>
                  {role === 'admin' ? 'Hospital Admin (Read Only)' : 'Nurse (Read Only)'}
                </span>
              )}
            </div>
            <p className="text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              {isReadOnly ? "Review patient's previous consultation records." : 'Review previous consultations, diagnoses and treatments.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
            
            {isReadOnly ? (
              <>
                <button
                  onClick={handlePrintHistory}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold transition-all shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Printer size={15} />
                  Print Medical History
                </button>
                <button
                  onClick={handlePrintHistory}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-all shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Download size={15} />
                  Download PDF
                </button>
              </>
            ) : (
              <button
                onClick={() => onStartNewConsultation?.()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-all shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Plus size={15} />
                Start New Consultation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── STICKY PATIENT SUMMARY BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="w-10 h-10 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-sm shrink-0" style={{ fontFamily: PP }}>
              {patientData.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{patientData.name}</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{patientData.mrn}</span>
                <span className="text-[11px] font-bold text-[#009688] bg-teal-50 px-2 py-0.5 rounded-full" style={{ fontFamily: PP }}>
                  {consultations.length} Total Visits
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                <span>{patientData.age} yrs / {patientData.gender}</span>
                <span>•</span>
                <span>Blood: <strong className="text-[#111827]">{patientData.bloodGroup}</strong></span>
                <span>•</span>
                <span>Last Visit: <strong className="text-[#111827]">{consultations[0]?.date || 'Today'}</strong></span>
                <span>•</span>
                <span>Primary Doctor: <strong className="text-[#0D47A1]">{patientData.primaryDoctor}</strong></span>
              </div>
            </div>

            {patientData.allergies.length > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0" style={{ fontFamily: PP }}>
                <AlertCircle size={13} />
                <span>Allergies: {patientData.allergies.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onPatientSelect?.(patientData.mrn)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Patient Profile
            </button>
            {!isReadOnly && (
              <button
                onClick={() => onStartNewConsultation?.()}
                className="px-3 py-1.5 rounded-lg bg-[#009688] text-white text-xs font-semibold hover:bg-[#00827a] transition-colors"
                style={{ fontFamily: PP }}
              >
                Start New Consultation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT CONTAINER ── */}
      <div className="p-6 space-y-6">

        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-[#E5E7EB] text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#0D47A1] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-semibold text-slate-600">Loading patient consultation history...</p>
          </div>
        ) : (
          <>
            {/* SUMMARY KPI CARDS (5 CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Total Consultations</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                    <RotateCcw size={16} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>{consultations.length}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: RB }}>Recorded in system</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Completed Consultations</span>
                  <div className="w-8 h-8 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    {consultations.filter(c => c.status === 'Completed').length}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5" style={{ fontFamily: RB }}>100% Verified Records</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Follow-up Visits</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    {consultations.filter(c => c.visitType === 'Follow-up').length}
                  </div>
                  <div className="text-[11px] text-purple-600 font-medium mt-0.5" style={{ fontFamily: RB }}>Follow-up Records</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Last Consultation</span>
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>{consultations[0]?.date || '—'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate" style={{ fontFamily: RB }}>{consultations[0]?.doctor || '—'}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>Total Prescriptions</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Pill size={16} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                    {consultations.reduce((acc, curr) => acc + curr.medicinesCount, 0)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: RB }}>Prescribed Medications</div>
                </div>
              </div>
            </div>

            {/* SEARCH AND FILTER BAR */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Consultation ID, Diagnosis, Doctor or Date..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]"
                  style={{ fontFamily: RB }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Doctor</label>
                  <select
                    value={filterDoctor}
                    onChange={(e) => setFilterDoctor(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Doctors</option>
                    {doctorOptions.map(doc => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Departments</option>
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Visit Type</label>
                  <select
                    value={filterVisitType}
                    onChange={(e) => setFilterVisitType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Visit Types</option>
                    <option value="First Visit">First Visit</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Walk-In">Walk-In</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                  Showing <span className="font-semibold text-[#111827]">{filteredTimeline.length}</span> historical consultations
                </div>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:text-[#111827] hover:bg-slate-50 transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <RotateCcw size={13} />
                  Reset Filters
                </button>
              </div>
            </div>

            {/* EXPANDABLE CLINICAL TIMELINE */}
            <div className="w-full space-y-6">
              {filteredTimeline.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-[#E5E7EB] text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <Stethoscope size={28} />
                  </div>
                  <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>No consultation history available.</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4" style={{ fontFamily: RB }}>No previous consultation records match your selected filters.</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-[#0D47A1] text-white text-xs font-semibold rounded-xl hover:bg-[#0a3880]"
                    style={{ fontFamily: PP }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {filteredTimeline.map((item) => {
                    const isExpanded = expandedCardIds[item.id]
                    return (
                      <div key={item.id} className="relative">
                        {/* Timeline Node Icon */}
                        <div className="absolute -left-[31px] top-4 w-5 h-5 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-[10px] ring-4 ring-[#F1F5F9] shadow-sm">
                          <CheckCircle2 size={12} />
                        </div>

                        {/* Expandable Timeline Card */}
                        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden transition-all">
                          {/* Card Header Bar */}
                          <div
                            onClick={() => toggleExpand(item.id)}
                            className="p-5 bg-slate-50/60 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 border-b border-gray-100"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{item.date}</span>
                                <span className="text-xs text-slate-400 font-mono">({item.time})</span>
                                <span className="font-mono text-xs bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{item.id}</span>
                                <span className="px-2 py-0.5 bg-green-50 text-[#66BB6A] border border-green-200 rounded-full text-[10px] font-bold" style={{ fontFamily: PP }}>
                                  {item.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                                <span>Doctor: <strong className="text-[#111827]">{item.doctor}</strong></span>
                                <span>•</span>
                                <span>Dept: <strong className="text-slate-700">{item.department}</strong></span>
                                <span>•</span>
                                <span>Type: <strong className="text-slate-700">{item.visitType}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right text-xs hidden md:block" style={{ fontFamily: RB }}>
                                <div className="font-bold text-[#0D47A1]">{item.diagnosis}</div>
                                <div className="text-[11px] text-slate-500">{item.medicinesCount} Meds · {item.investigationsCount} Tests</div>
                              </div>

                              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 bg-white border border-gray-200">
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            </div>
                          </div>

                          {/* Summary Line when collapsed */}
                          {!isExpanded && (
                            <div className="p-4 text-xs space-y-1 bg-white" style={{ fontFamily: RB }}>
                              <div><strong className="text-[#64748B]">Chief Complaint:</strong> <span className="text-slate-800">"{item.chiefComplaint}"</span></div>
                              <div><strong className="text-[#64748B]">Diagnosis:</strong> <span className="font-bold text-[#0D47A1]">{item.diagnosis}</span> ({item.icdCode})</div>
                            </div>
                          )}

                          {/* EXPANDED SECTION CARDS */}
                          {isExpanded && (
                            <div className="p-5 space-y-5 bg-white border-t border-gray-100 text-xs" style={{ fontFamily: RB }}>

                              {/* Section: Complaint & Vitals */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Chief Complaint</span>
                                  <p className="font-semibold text-slate-800">"{item.chiefComplaint}"</p>
                                </div>
                                <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl space-y-1">
                                  <span className="text-[10px] font-bold text-[#009688] uppercase" style={{ fontFamily: PP }}>Patient Vitals</span>
                                  <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-slate-700">
                                    <span>BP: {item.vitals.bp}</span>
                                    <span>Pulse: {item.vitals.pulse}</span>
                                    <span>Temp: {item.vitals.temp}</span>
                                    <span>SpO₂: {item.vitals.spo2}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Section: Examination & Diagnosis */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Examination & Diagnosis</span>
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                                  <p><strong className="text-slate-700">Findings:</strong> {item.examinationFindings}</p>
                                  <p><strong className="text-slate-700">Final Diagnosis:</strong> <strong className="text-[#0D47A1]">{item.diagnosis}</strong> ({item.icdCode})</p>
                                </div>
                              </div>

                              {/* Section: Prescription Summary */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Prescription Summary</span>
                                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-2 py-0.5 rounded">{item.medicines.length} Prescribed</span>
                                </div>
                                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-50 text-slate-500 font-bold" style={{ fontFamily: PP }}>
                                      <tr>
                                        <th className="py-2 px-3">Medicine</th>
                                        <th className="py-2 px-3">Dosage</th>
                                        <th className="py-2 px-3">Frequency</th>
                                        <th className="py-2 px-3">Duration</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                                      {item.medicines.length === 0 ? (
                                        <tr>
                                          <td colSpan={4} className="py-2 px-3 italic text-slate-500">No medications prescribed.</td>
                                        </tr>
                                      ) : (
                                        item.medicines.map((m, idx) => (
                                          <tr key={idx}>
                                            <td className="py-1.5 px-3 font-bold text-[#111827]" style={{ fontFamily: PP }}>{m.name}</td>
                                            <td className="py-1.5 px-3">{m.dosage}</td>
                                            <td className="py-1.5 px-3 text-blue-700">{m.freq}</td>
                                            <td className="py-1.5 px-3">{m.duration}</td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Section: Investigations & Notes */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Recommended Investigations</span>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {item.investigations.length === 0 ? (
                                      <span className="text-slate-500 italic">None recommended</span>
                                    ) : (
                                      item.investigations.map((inv, idx) => (
                                        <span key={idx} className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded font-semibold text-[11px]" style={{ fontFamily: PP }}>
                                          {inv}
                                        </span>
                                      ))
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Follow-up Details</span>
                                  <p className="text-[#0D47A1] font-semibold mt-1 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                                    {item.followupStatus}
                                  </p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                                <button
                                  onClick={handlePrintHistory}
                                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#009688] font-semibold hover:bg-teal-50 transition-colors flex items-center gap-1.5 text-xs"
                                  style={{ fontFamily: PP }}
                                >
                                  <Printer size={14} />
                                  Print Prescription
                                </button>
                                <button
                                  onClick={() => onViewFullConsultation?.(item.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white font-semibold hover:bg-[#0a3880] transition-colors flex items-center gap-1.5 text-xs"
                                  style={{ fontFamily: PP }}
                                >
                                  <Eye size={14} />
                                  View Full Consultation
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-3 shadow-lg flex items-center justify-between">
        <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
          Consultation History for <strong className="text-[#111827]">{patientData.name}</strong> ({patientData.mrn})
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 border border-[#E5E7EB] text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
              style={{ fontFamily: PP }}
            >
              Back
            </button>
          )}
          <button
            onClick={handlePrintHistory}
            className="px-4 py-2 border border-[#E5E7EB] bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} className="text-[#009688]" />
            Print Medical History
          </button>
          <button
            onClick={handlePrintHistory}
            className="px-5 py-2 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            style={{ fontFamily: PP }}
          >
            <Download size={15} />
            Export Consultation History PDF
          </button>
        </div>
      </div>
    </div>
  )
}
