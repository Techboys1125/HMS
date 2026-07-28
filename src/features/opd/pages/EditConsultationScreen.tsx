import { useState, useMemo } from 'react'
import {
  CheckCircle2, AlertCircle, ChevronRight, ChevronDown, Plus, Trash2, Printer,
  Save, Info, Search, Edit3, ArrowLeft
} from 'lucide-react'

// --- Design System Tokens ---
const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

export interface MedicineItem {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

const ICD_CODES = [
  { code: 'I20.9', label: 'I20.9 — Angina Pectoris, unspecified' },
  { code: 'I10', label: 'I10 — Essential (primary) Hypertension' },
  { code: 'E11.9', label: 'E11.9 — Type 2 Diabetes Mellitus without complications' },
  { code: 'J06.9', label: 'J06.9 — Acute upper respiratory infection, unspecified' },
  { code: 'M25.50', label: 'M25.50 — Pain in unspecified joint' },
  { code: 'R07.9', label: 'R07.9 — Chest pain, unspecified' },
  { code: 'G43.909', label: 'G43.909 — Migraine, unspecified, not intractable' }
]

const INITIAL_MEDICINES: MedicineItem[] = [
  { id: '1', name: 'Amlodipine', dosage: '5mg', frequency: 'Once Daily', duration: '30 Days', instructions: 'Take after breakfast' },
  { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', duration: '30 Days', instructions: 'Take with meals' }
]

export function EditConsultationScreen({
  consultationId = 'CNS-1001',
  onBack,
  onUpdateSuccess,
  onViewHistory
}: {
  consultationId?: string
  onBack?: () => void
  onUpdateSuccess?: () => void
  onViewHistory?: (patientId?: string) => void
}) {
  // Collapsible section states
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    metadata: false,
    visitInfo: false,
    vitals: false,
    examination: false,
    prescription: false,
    investigation: false,
    clinicalNotes: false,
    followup: false,
    summary: false,
    revisionNotes: false,
  })

  const toggleSection = (key: string) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Consultation Form State
  const [formData, setFormData] = useState({
    consultationId: consultationId,
    status: 'Under Edit',
    createdBy: 'Dr. Arjun Mehta',
    createdDate: '24 Jul 2026, 09:00 AM',
    lastUpdatedBy: 'Dr. Arjun Mehta',
    lastUpdatedDate: '24 Jul 2026, 12:45 PM',
    revisionNumber: 2,
    visitDate: '2026-07-24',
    doctorName: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    visitType: 'First Visit' as 'New Consultation' | 'Follow-up' | 'First Visit',
    chiefComplaint: 'Severe chest tightness radiating to left shoulder with acute dyspnea',
    durationOfSymptoms: '3 days',
    height: '168',
    weight: '72',
    temperature: '37.2',
    bp: '145/92',
    pulse: '88',
    respiratoryRate: '18',
    spo2: '97',
    bloodSugar: '110',
    clinicalExamination: 'Chest wall non-tender. S1 S2 heard normal. No gallop or murmurs. Bilateral vesicular breath sounds.',
    provisionalDiagnosis: 'Acute Coronary Syndrome / Angina Pectoris',
    finalDiagnosis: 'Angina Pectoris, unspecified',
    icdCode: 'I20.9',
    medicines: INITIAL_MEDICINES,
    investigations: {
      cbc: true,
      ecg: true,
      xray: false,
      ultrasound: false,
      other: false,
    },
    customInvestigation: '2D Echocardiogram & Trop-I STAT',
    investigationRemarks: 'Perform 12-lead ECG immediately and check Troponin-I level.',
    symptoms: 'Substernal chest pressure, exertional shortness of breath, mild diaphoresis.',
    assessment: 'High cardiovascular risk profile. Borderline hypertension and elevated BP.',
    advice: 'Strict low sodium diet. Avoid strenuous activity. Continue cardiac medications as prescribed.',
    lifestyleRecommendations: 'Daily 30 min light walking after 1 week. Smoking cessation & stress management.',
    followupRequired: true,
    nextVisitDate: '2026-07-31',
    followupNotes: 'Review ECG & Troponin reports. Adjust anti-hypertensive dosage if required.',
    revisionReason: 'Updated clinical advice & adjusted anti-hypertensive dosage instructions per patient query.',
  })

  // Auto-calculated BMI
  const calculatedBmi = useMemo(() => {
    const h = parseFloat(formData.height) / 100
    const w = parseFloat(formData.weight)
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1)
    return '--'
  }, [formData.height, formData.weight])

  // UI States
  const [showToast, setShowToast] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isDraftSaved, setIsDraftSaved] = useState(false)
  const [icdSearchQuery, setIcdSearchQuery] = useState('')
  const [showIcdDropdown, setShowIcdDropdown] = useState(false)

  // Add Medicine Row
  const handleAddMedicine = () => {
    const newMed: MedicineItem = {
      id: Date.now().toString(),
      name: '',
      dosage: '5mg',
      frequency: 'Once Daily',
      duration: '7 Days',
      instructions: 'After Meals'
    }
    setFormData(prev => ({ ...prev, medicines: [...prev.medicines, newMed] }))
  }

  // Update Medicine Row
  const handleUpdateMedicine = (id: string, field: keyof MedicineItem, val: string) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map(m => m.id === id ? { ...m, [field]: val } : m)
    }))
  }

  // Remove Medicine Row
  const handleRemoveMedicine = (id: string) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter(m => m.id !== id)
    }))
  }

  // Save Draft Action
  const handleSaveDraft = () => {
    setIsDraftSaved(true)
    setTimeout(() => setIsDraftSaved(false), 2500)
  }

  // Update Consultation Action
  const handleUpdateConsultation = () => {
    const errors: string[] = []
    if (!formData.chiefComplaint.trim()) errors.push('Chief Complaint is required.')
    if (!formData.finalDiagnosis.trim()) errors.push('Final Diagnosis is required.')
    if (!formData.revisionReason.trim()) errors.push('Revision Reason is mandatory before saving changes.')

    if (errors.length > 0) {
      setValidationErrors(errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setValidationErrors([])
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      if (onUpdateSuccess) onUpdateSuccess()
      else if (onBack) onBack()
    }, 2000)
  }

  // ICD Search filter
  const filteredIcdOptions = useMemo(() => {
    if (!icdSearchQuery.trim()) return ICD_CODES
    const q = icdSearchQuery.toLowerCase()
    return ICD_CODES.filter(i => i.label.toLowerCase().includes(q) || i.code.toLowerCase().includes(q))
  }, [icdSearchQuery])

  // Count active investigations
  const activeInvestigationsCount = useMemo(() => {
    let count = Object.values(formData.investigations).filter(Boolean).length
    if (formData.customInvestigation.trim()) count++
    return count
  }, [formData.investigations, formData.customInvestigation])

  // Revision Timeline Events
  const revisionTimelineEvents = [
    { event: 'Consultation Created', user: 'Dr. Arjun Mehta', date: '24 Jul 2026', time: '09:00 AM' },
    { event: 'Diagnosis Updated', user: 'Dr. Arjun Mehta', date: '24 Jul 2026', time: '09:20 AM' },
    { event: 'Prescription Updated', user: 'Dr. Arjun Mehta', date: '24 Jul 2026', time: '09:30 AM' },
    { event: 'Follow-up Updated', user: 'Dr. Arjun Mehta', date: '24 Jul 2026', time: '09:38 AM' },
    { event: 'Revision #2 Modified', user: 'Dr. Arjun Mehta', date: '24 Jul 2026', time: '12:45 PM' },
  ]

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {/* ── SUCCESS TOAST NOTIFICATION ── */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#66BB6A] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4" style={{ fontFamily: PP }}>
          <CheckCircle2 size={20} />
          <div>
            <div className="font-bold text-sm">Consultation updated successfully.</div>
            <div className="text-xs opacity-90 font-sans" style={{ fontFamily: RB }}>Revision record #{formData.revisionNumber} saved to patient log.</div>
          </div>
        </div>
      )}

      {/* ── DRAFT TOAST NOTIFICATION ── */}
      {isDraftSaved && (
        <div className="fixed top-5 right-5 z-50 bg-[#0D47A1] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4" style={{ fontFamily: PP }}>
          <Save size={18} />
          <div className="text-xs font-semibold">Edit draft saved successfully.</div>
        </div>
      )}

      {/* ── BREADCRUMB & HEADER SECTION ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>OPD Consultation</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">Edit Consultation</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Edit Consultation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200" style={{ fontFamily: PP }}>
                Revision #{formData.revisionNumber}
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Review and update consultation details.
            </p>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <ArrowLeft size={14} />
              Cancel & Return
            </button>
          )}
        </div>
      </div>

      {/* ── STICKY TOP PATIENT SUMMARY BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="w-10 h-10 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-sm shrink-0" style={{ fontFamily: PP }}>
              SM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>Sarah Mitchell</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">MRN-2024-001</span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{formData.consultationId}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                <span>34 yrs / Female</span>
                <span>•</span>
                <span>Blood: <strong className="text-[#111827]">A+</strong></span>
                <span>•</span>
                <span>Date: <strong className="text-[#111827]">{formData.visitDate}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0" style={{ fontFamily: PP }}>
              <AlertCircle size={13} />
              <span>Allergies: Penicillin, Aspirin</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors" style={{ fontFamily: PP }}>
              View Patient Profile
            </button>
            <button
              onClick={() => onViewHistory?.('MRN-2024-001')}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Consultation History
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTAINER ── */}
      <div className="p-6 space-y-6">

        {/* VALIDATION ERROR BANNER */}
        {validationErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700" style={{ fontFamily: PP }}>
              <AlertCircle size={16} />
              Please resolve the following required fields before updating consultation:
            </div>
            <ul className="list-disc list-inside text-xs text-red-600 pl-6 space-y-0.5" style={{ fontFamily: RB }}>
              {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        {/* ── CONSULTATION METADATA CARD ── */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2" style={{ fontFamily: PP }}>
              <Info size={16} className="text-[#0D47A1]" />
              Consultation Metadata & Revision Info
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#0D47A1] rounded" style={{ fontFamily: PP }}>
              Revision #{formData.revisionNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs" style={{ fontFamily: RB }}>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Consultation ID</span>
              <p className="font-mono font-bold text-[#0D47A1]">{formData.consultationId}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Status</span>
              <p className="font-bold text-amber-700">{formData.status}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Created By</span>
              <p className="font-medium text-slate-800">{formData.createdBy}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Created Date</span>
              <p className="font-mono text-slate-600">{formData.createdDate}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Last Updated By</span>
              <p className="font-medium text-slate-800">{formData.lastUpdatedBy}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Last Updated Date</span>
              <p className="font-mono text-slate-600">{formData.lastUpdatedDate}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Revision</span>
              <p className="font-bold text-[#009688]">Rev #{formData.revisionNumber}</p>
            </div>
          </div>
        </div>

        {/* 2-COLUMN ENTERPRISE WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT WORKSPACE (70% on desktop: col-span-8) */}
          <div className="lg:col-span-8 space-y-5">

            {/* ── SECTION 01: VISIT INFORMATION ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('visitInfo')}
                className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold text-xs">01</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Visit Information</h3>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.visitInfo ? '-rotate-90' : ''}`} />
              </button>

              {!collapsedSections.visitInfo && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Visit Date</label>
                      <input
                        type="date"
                        value={formData.visitDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Doctor (Read Only)</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.doctorName}
                        className="w-full px-3 py-2 bg-gray-100 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-slate-700 cursor-not-allowed"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Department (Read Only)</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.department}
                        className="w-full px-3 py-2 bg-gray-100 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-slate-700 cursor-not-allowed"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Visit Type</label>
                      <select
                        value={formData.visitType}
                        onChange={(e) => setFormData(prev => ({ ...prev, visitType: e.target.value as 'New Consultation' | 'Follow-up' | 'First Visit' }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                        style={{ fontFamily: RB }}
                      >
                        <option value="New Consultation">New Consultation</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="First Visit">First Visit</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Duration of Symptoms</label>
                      <input
                        type="text"
                        value={formData.durationOfSymptoms}
                        onChange={(e) => setFormData(prev => ({ ...prev, durationOfSymptoms: e.target.value }))}
                        placeholder="e.g. 3 days, 2 weeks"
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>
                      Chief Complaint <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.chiefComplaint}
                      onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                      className="w-full p-3 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                      style={{ fontFamily: RB }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 02: PATIENT VITALS ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('vitals')}
                className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-xs">02</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Vitals</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium" style={{ fontFamily: RB }}>BMI: <strong className="text-[#009688] font-bold">{calculatedBmi} kg/m²</strong></span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.vitals ? '-rotate-90' : ''}`} />
                </div>
              </button>

              {!collapsedSections.vitals && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>BMI (Auto Calc)</label>
                      <input
                        type="text"
                        readOnly
                        value={`${calculatedBmi} kg/m²`}
                        className="w-full px-3 py-2 bg-teal-50 border border-teal-200 text-[#009688] font-bold rounded-xl text-xs cursor-not-allowed"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Temperature (°C)</label>
                      <input
                        type="text"
                        value={formData.temperature}
                        onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Blood Pressure</label>
                      <input
                        type="text"
                        value={formData.bp}
                        onChange={(e) => setFormData(prev => ({ ...prev, bp: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Pulse Rate (bpm)</label>
                      <input
                        type="number"
                        value={formData.pulse}
                        onChange={(e) => setFormData(prev => ({ ...prev, pulse: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Resp. Rate</label>
                      <input
                        type="number"
                        value={formData.respiratoryRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>SpO₂ (%)</label>
                      <input
                        type="number"
                        value={formData.spo2}
                        onChange={(e) => setFormData(prev => ({ ...prev, spo2: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Blood Sugar (Opt)</label>
                      <input
                        type="text"
                        value={formData.bloodSugar}
                        onChange={(e) => setFormData(prev => ({ ...prev, bloodSugar: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 03: CLINICAL EXAMINATION ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('examination')}
                className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">03</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Clinical Examination & Diagnosis</h3>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.examination ? '-rotate-90' : ''}`} />
              </button>

              {!collapsedSections.examination && (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Clinical Examination Findings</label>
                    <textarea
                      rows={2}
                      value={formData.clinicalExamination}
                      onChange={(e) => setFormData(prev => ({ ...prev, clinicalExamination: e.target.value }))}
                      className="w-full p-3 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                      style={{ fontFamily: RB }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Provisional Diagnosis</label>
                      <input
                        type="text"
                        value={formData.provisionalDiagnosis}
                        onChange={(e) => setFormData(prev => ({ ...prev, provisionalDiagnosis: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>
                        Final Diagnosis <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.finalDiagnosis}
                        onChange={(e) => setFormData(prev => ({ ...prev, finalDiagnosis: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        style={{ fontFamily: RB }}
                      />
                    </div>
                  </div>

                  <div className="relative text-xs">
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>ICD Code (Searchable)</label>
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={showIcdDropdown ? icdSearchQuery : (formData.icdCode || 'I20.9 — Angina Pectoris, unspecified')}
                        onFocus={() => setShowIcdDropdown(true)}
                        onChange={(e) => {
                          setIcdSearchQuery(e.target.value)
                          setShowIcdDropdown(true)
                        }}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#0D47A1]"
                        style={{ fontFamily: RB }}
                      />
                    </div>

                    {showIcdDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                        {filteredIcdOptions.map((opt) => (
                          <button
                            key={opt.code}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, icdCode: opt.code, finalDiagnosis: opt.label.split('—')[1]?.trim() || prev.finalDiagnosis }))
                              setShowIcdDropdown(false)
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-slate-700 font-medium flex items-center justify-between border-b border-gray-50"
                          >
                            <span>{opt.label}</span>
                            <span className="font-mono text-[10px] text-[#0D47A1] font-bold bg-blue-50 px-1.5 py-0.5 rounded">{opt.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 04: PRESCRIPTION ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('prescription')}
                className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">04</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Prescription</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontFamily: PP }}>
                    Total: {formData.medicines.length} Medicines
                  </span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.prescription ? '-rotate-90' : ''}`} />
                </div>
              </button>

              {!collapsedSections.prescription && (
                <div className="p-5 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-bold text-[#64748B] uppercase" style={{ fontFamily: PP }}>
                          <th className="py-2.5 px-3">Medicine</th>
                          <th className="py-2.5 px-3">Dosage</th>
                          <th className="py-2.5 px-3">Frequency</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3">Instructions</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {formData.medicines.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={m.name}
                                onChange={(e) => handleUpdateMedicine(m.id, 'name', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827]"
                                style={{ fontFamily: RB }}
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={m.dosage}
                                onChange={(e) => handleUpdateMedicine(m.id, 'dosage', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                                style={{ fontFamily: RB }}
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={m.frequency}
                                onChange={(e) => handleUpdateMedicine(m.id, 'frequency', e.target.value)}
                                className="w-full px-2 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                                style={{ fontFamily: RB }}
                              >
                                <option value="Once Daily">Once Daily</option>
                                <option value="Twice Daily">Twice Daily</option>
                                <option value="Thrice Daily">Thrice Daily</option>
                                <option value="PRN (As Needed)">PRN (As Needed)</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={m.duration}
                                onChange={(e) => handleUpdateMedicine(m.id, 'duration', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                                style={{ fontFamily: RB }}
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={m.instructions}
                                onChange={(e) => handleUpdateMedicine(m.id, 'instructions', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                                style={{ fontFamily: RB }}
                              />
                            </td>
                            <td className="py-2 px-3 text-right">
                              <button
                                onClick={() => handleRemoveMedicine(m.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={handleAddMedicine}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0D47A1] hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <Plus size={14} />
                    + Add Medicine
                  </button>
                </div>
              )}
            </div>

            {/* ── SECTION 05: INVESTIGATION RECOMMENDATION ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('investigation')}
                className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">05</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Investigation Recommendation</h3>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.investigation ? '-rotate-90' : ''}`} />
              </button>

              {!collapsedSections.investigation && (
                <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-2" style={{ fontFamily: PP }}>Recommended Investigations</label>
                    <div className="flex flex-wrap gap-4">
                      {(
                        [
                          { key: 'cbc', label: 'CBC (Complete Blood Count)' },
                          { key: 'ecg', label: 'ECG' },
                          { key: 'xray', label: 'Chest X-Ray' },
                          { key: 'ultrasound', label: 'Ultrasound' },
                          { key: 'other', label: 'Other' },
                        ] as const
                      ).map((item) => (
                        <label key={item.key} className="flex items-center gap-2 font-medium text-[#111827] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.investigations[item.key]}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              investigations: { ...prev.investigations, [item.key]: e.target.checked }
                            }))}
                            className="w-4 h-4 rounded text-[#0D47A1] focus:ring-[#0D47A1]"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Custom Investigation</label>
                      <input
                        type="text"
                        value={formData.customInvestigation}
                        onChange={(e) => setFormData(prev => ({ ...prev, customInvestigation: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Remarks</label>
                      <input
                        type="text"
                        value={formData.investigationRemarks}
                        onChange={(e) => setFormData(prev => ({ ...prev, investigationRemarks: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 06: CLINICAL NOTES ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('clinicalNotes')}
                className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-green-50 text-[#66BB6A] flex items-center justify-center font-bold text-xs">06</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Clinical Notes</h3>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.clinicalNotes ? '-rotate-90' : ''}`} />
              </button>

              {!collapsedSections.clinicalNotes && (
                <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Symptoms</label>
                      <textarea
                        rows={2}
                        value={formData.symptoms}
                        onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                        className="w-full p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Assessment</label>
                      <textarea
                        rows={2}
                        value={formData.assessment}
                        onChange={(e) => setFormData(prev => ({ ...prev, assessment: e.target.value }))}
                        className="w-full p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Advice</label>
                      <textarea
                        rows={2}
                        value={formData.advice}
                        onChange={(e) => setFormData(prev => ({ ...prev, advice: e.target.value }))}
                        className="w-full p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Lifestyle Recommendations</label>
                      <textarea
                        rows={2}
                        value={formData.lifestyleRecommendations}
                        onChange={(e) => setFormData(prev => ({ ...prev, lifestyleRecommendations: e.target.value }))}
                        className="w-full p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 07: FOLLOW-UP ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('followup')}
                className="w-full px-5 py-4 bg-slate-50/50 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">07</div>
                  <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Follow-up</h3>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.followup ? '-rotate-90' : ''}`} />
              </button>

              {!collapsedSections.followup && (
                <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-semibold text-[#111827]" style={{ fontFamily: PP }}>Follow-up Required</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.followupRequired}
                        onChange={(e) => setFormData(prev => ({ ...prev, followupRequired: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009688]"></div>
                    </label>
                  </div>

                  {formData.followupRequired && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Next Visit Date</label>
                        <input
                          type="date"
                          value={formData.nextVisitDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, nextVisitDate: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1" style={{ fontFamily: PP }}>Follow-up Notes</label>
                        <input
                          type="text"
                          value={formData.followupNotes}
                          onChange={(e) => setFormData(prev => ({ ...prev, followupNotes: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-[#111827]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── SECTION 08: CONSULTATION SUMMARY ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 border-b border-gray-100 pb-3" style={{ fontFamily: PP }}>
                <CheckCircle2 size={16} className="text-[#009688]" />
                Consultation Summary Preview
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Patient</span>
                  <p className="font-bold text-[#111827]">Sarah Mitchell</p>
                  <p className="text-[11px] text-slate-500">MRN-2024-001</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Doctor</span>
                  <p className="font-bold text-[#111827]">{formData.doctorName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Diagnosis</span>
                  <p className="font-bold text-[#0D47A1]">{formData.finalDiagnosis}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Prescription</span>
                  <p className="font-bold text-[#009688]">{formData.medicines.length} Medicines</p>
                  <p className="text-[11px] text-slate-500">{activeInvestigationsCount} Recommended Tests</p>
                </div>
              </div>
            </div>

            {/* ── SECTION 09: REVISION NOTES (MANDATORY FOR SAVING) ── */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('revisionNotes')}
                className="w-full px-5 py-4 bg-amber-50/60 flex items-center justify-between border-b border-amber-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">09</div>
                  <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2" style={{ fontFamily: PP }}>
                    <Edit3 size={15} />
                    Revision Notes & Change Audit Log
                  </h3>
                </div>
                <ChevronDown size={18} className={`text-amber-600 transition-transform ${collapsedSections.revisionNotes ? '-rotate-90' : ''}`} />
              </button>

              {!collapsedSections.revisionNotes && (
                <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1" style={{ fontFamily: PP }}>
                      Revision Reason <span className="text-red-500">* (Mandatory to save update)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.revisionReason}
                      onChange={(e) => setFormData(prev => ({ ...prev, revisionReason: e.target.value }))}
                      placeholder="Specify clear clinical rationale for updating this consultation..."
                      className="w-full p-3 bg-white border border-amber-300 rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Auto-Generated Changes Summary</span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold">
                        Medication dosage adjusted
                      </span>
                      <span className="px-2.5 py-1 bg-blue-50 text-[#0D47A1] border border-blue-200 rounded-lg text-[11px] font-semibold">
                        Follow-up notes updated
                      </span>
                      <span className="px-2.5 py-1 bg-teal-50 text-[#009688] border border-teal-200 rounded-lg text-[11px] font-semibold">
                        Lifestyle advice extended
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Last Modified By: <strong className="text-slate-800">{formData.lastUpdatedBy}</strong></span>
                    <span>Last Modified Date: <strong className="text-slate-800">{formData.lastUpdatedDate}</strong></span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT CONTEXT PANEL (30% on desktop: col-span-4) */}
          <div className="lg:col-span-4 space-y-5">

            {/* CARD 1: PATIENT SNAPSHOT */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Snapshot</h3>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Editing</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base" style={{ fontFamily: PP }}>
                  SM
                </div>
                <div>
                  <div className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>Sarah Mitchell</div>
                  <div className="text-xs text-slate-500" style={{ fontFamily: RB }}>34 yrs · Female · Blood A+</div>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-gray-100" style={{ fontFamily: RB }}>
                <div className="flex justify-between text-slate-600">
                  <span>Previous Visits:</span>
                  <span className="font-bold text-[#111827]">4 Visits</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Last Visit Date:</span>
                  <span className="font-bold text-[#111827]">12 Jun 2026</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Allergies:</span>
                  <span className="font-bold text-red-600">Penicillin, Aspirin</span>
                </div>
              </div>
            </div>

            {/* CARD 2: PREVIOUS CONSULTATION SUMMARY */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Previous Consultation Summary</h3>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs" style={{ fontFamily: RB }}>
                <div className="flex justify-between font-bold text-slate-800" style={{ fontFamily: PP }}>
                  <span>12 Jun 2026 — OPD</span>
                  <span className="text-[#0D47A1]">Dr. Arjun Mehta</span>
                </div>
                <div className="text-slate-600">Previous Dx: Hypertensive Crisis (Controlled)</div>
                <div className="text-slate-500 text-[11px]">3 Prescribed Meds · Follow-up Completed</div>
              </div>

              <button
                onClick={() => onViewHistory?.('MRN-2024-001')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                style={{ fontFamily: PP }}
              >
                View Consultation History
              </button>
            </div>

            {/* CARD 3: REVISION TIMELINE */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Revision Timeline</h3>
                <span className="text-[10px] font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">Audit Log</span>
              </div>

              <div className="space-y-0">
                {revisionTimelineEvents.map((evt, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0D47A1] mt-1 shrink-0" />
                      {idx < revisionTimelineEvents.length - 1 && <div className="w-px flex-1 bg-gray-200 my-0.5" />}
                    </div>
                    <div className="pb-3 flex-1">
                      <div className="font-bold text-xs text-slate-800" style={{ fontFamily: PP }}>{evt.event}</div>
                      <div className="text-[11px] text-slate-600">{evt.user}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{evt.date} · {evt.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 4: QUICK ACTIONS */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>Quick Actions</h3>

              <button
                onClick={handleUpdateConsultation}
                className="w-full py-2.5 px-4 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Save size={15} />
                Save Changes
              </button>

              <button
                onClick={() => alert(`Prescription printed for ${formData.consultationId}`)}
                className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} />
                Print Prescription
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-3 shadow-lg flex items-center justify-between">
        <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
          Editing Consultation <strong className="text-[#0D47A1]">{formData.consultationId}</strong> · Revision #{formData.revisionNumber}
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 border border-[#E5E7EB] text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
              style={{ fontFamily: PP }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 border border-[#E5E7EB] bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors"
            style={{ fontFamily: PP }}
          >
            Save Draft
          </button>
          <button
            onClick={handleUpdateConsultation}
            className="px-5 py-2 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            style={{ fontFamily: PP }}
          >
            <CheckCircle2 size={16} />
            Update Consultation
          </button>
        </div>
      </div>
    </div>
  )
}
