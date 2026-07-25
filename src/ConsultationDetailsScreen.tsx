import { useState } from 'react'
import {
  CheckCircle2, AlertCircle, ChevronRight, ChevronDown, Printer, Download, Edit3,
  ArrowLeft
} from 'lucide-react'

// --- Design System Tokens ---
const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

export function ConsultationDetailsScreen({
  consultationId = 'CNS-1001',
  onBack,
  onEditConsultation,
  onViewHistory,
  onViewPatientProfile
}: {
  consultationId?: string
  onBack?: () => void
  onEditConsultation?: (id: string) => void
  onViewHistory?: (patientId?: string) => void
  onViewPatientProfile?: (uhid: string) => void
}) {
  // Collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    visitInfo: false,
    vitals: false,
    examination: false,
    prescription: false,
    investigation: false,
    clinicalNotes: false,
    followup: false,
    summary: false,
  })

  const toggleSection = (key: string) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Read-only Consultation Record Data
  const record = {
    id: consultationId,
    visitDate: '24 Jul 2026',
    completionTime: '09:42 AM',
    patientName: 'Sarah Mitchell',
    uhid: 'MRN-2024-001',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    allergies: ['Penicillin', 'Aspirin'],
    doctorName: 'Dr. Arjun Mehta',
    doctorSpecialty: 'Interventional Cardiology',
    department: 'Cardiology',
    visitType: 'First Visit',
    chiefComplaint: 'Severe chest tightness radiating to left shoulder with acute dyspnea',
    durationOfSymptoms: '3 days',
    // Vitals
    vitals: {
      height: '168 cm',
      weight: '72 kg',
      bmi: '25.5 kg/m²',
      temperature: '37.2 °C',
      bp: '145/92 mmHg',
      pulse: '88 bpm',
      respiratoryRate: '18 /min',
      spo2: '97 %',
      bloodSugar: '110 mg/dL',
    },
    // Examination
    clinicalExamination: 'Chest wall non-tender. Normal S1 and S2 heart sounds. No murmurs or gallop rhythm. Bilateral vesicular breath sounds.',
    provisionalDiagnosis: 'Acute Coronary Syndrome / Angina Pectoris',
    finalDiagnosis: 'Angina Pectoris, unspecified',
    icdCode: 'I20.9 — Angina Pectoris, unspecified',
    // Prescriptions
    medicines: [
      { id: '1', name: 'Amlodipine', dosage: '5mg', frequency: 'Once Daily', duration: '30 Days', instructions: 'Take after breakfast' },
      { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', duration: '30 Days', instructions: 'Take with meals' }
    ],
    // Investigations
    investigations: ['CBC', 'ECG', '2D Echocardiogram & Trop-I STAT'],
    investigationRemarks: 'Perform 12-lead ECG immediately and monitor Troponin-I levels.',
    // Clinical Notes
    symptoms: 'Substernal chest pressure, exertional shortness of breath, mild diaphoresis.',
    assessment: 'High cardiovascular risk profile. Borderline hypertension.',
    advice: 'Strict low sodium diet. Avoid heavy physical exertion. Continue cardiac regimen.',
    lifestyleRecommendations: 'Daily 30 min light walking after 1 week. Stress reduction and smoking cessation.',
    // Followup
    followupRequired: 'Yes',
    nextVisitDate: '31 Jul 2026',
    followupNotes: 'Review ECG & Troponin reports. Adjust anti-hypertensive dosage if required.',
    // Fee & Status
    consultationFee: '$150.00',
    status: 'Completed',
    tokenNo: 'TK-01'
  }

  // Vertical Timeline Items
  const timelineEvents = [
    { title: 'Appointment Scheduled', date: '24 Jul 2026', time: '08:30 AM', status: 'Scheduled', badgeColor: 'bg-slate-100 text-slate-700' },
    { title: 'Patient Checked-In', date: '24 Jul 2026', time: '08:50 AM', status: 'Checked-In', badgeColor: 'bg-blue-50 text-blue-700' },
    { title: 'Consultation Started', date: '24 Jul 2026', time: '09:00 AM', status: 'In Progress', badgeColor: 'bg-teal-50 text-[#009688]' },
    { title: 'Vitals Recorded', date: '24 Jul 2026', time: '09:05 AM', status: 'Vitals Recorded', badgeColor: 'bg-teal-50 text-[#009688]' },
    { title: 'Diagnosis Completed', date: '24 Jul 2026', time: '09:20 AM', status: 'Diagnosis Completed', badgeColor: 'bg-indigo-50 text-indigo-700' },
    { title: 'Prescription Added', date: '24 Jul 2026', time: '09:30 AM', status: 'Prescription Added', badgeColor: 'bg-purple-50 text-purple-700' },
    { title: 'Follow-up Scheduled', date: '24 Jul 2026', time: '09:38 AM', status: 'Follow-up Scheduled', badgeColor: 'bg-amber-50 text-amber-700' },
    { title: 'Consultation Completed', date: '24 Jul 2026', time: '09:42 AM', status: 'Completed', badgeColor: 'bg-green-50 text-[#66BB6A]' },
  ]

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans relative pb-24">
      {/* ── BREADCRUMB & HEADER SECTION ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1" style={{ fontFamily: RB }}>
              <span>Doctor</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>OPD Consultation</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">Consultation Details</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Consultation Details
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-[#66BB6A] border border-green-200" style={{ fontFamily: PP }}>
                Completed
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              Review completed consultation records.
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
            <button
              onClick={() => alert(`Prescription document printed for ${record.id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#009688] hover:bg-teal-50 text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Printer size={14} />
              Print Prescription
            </button>
            <button
              onClick={() => onEditConsultation?.(record.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Edit3 size={14} />
              Edit Consultation
            </button>
          </div>
        </div>
      </div>

      {/* ── STICKY PATIENT SUMMARY BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Patient Info Group */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="w-10 h-10 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-sm shrink-0" style={{ fontFamily: PP }}>
              SM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{record.patientName}</span>
                <span className="font-mono text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">{record.uhid}</span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{record.id}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                <span>{record.age} yrs / {record.gender}</span>
                <span>•</span>
                <span>Blood: <strong className="text-[#111827]">{record.bloodGroup}</strong></span>
                <span>•</span>
                <span>Token: <strong className="text-[#0D47A1]">{record.tokenNo}</strong></span>
                <span>•</span>
                <span>Date: <strong className="text-[#111827]">{record.visitDate}</strong></span>
              </div>
            </div>

            {/* Allergy Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-semibold shrink-0" style={{ fontFamily: PP }}>
              <AlertCircle size={13} />
              <span>Allergies: {record.allergies.join(', ')}</span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewPatientProfile?.(record.uhid)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Patient Profile
            </button>
            <button
              onClick={() => onViewHistory?.(record.uhid)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              View Consultation History
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT CONTAINER ── */}
      <div className="p-6 space-y-6">

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
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs" style={{ fontFamily: RB }}>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Consultation ID</span>
                    <p className="font-mono font-bold text-[#0D47A1] text-sm mt-0.5">{record.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Visit Date</span>
                    <p className="font-semibold text-slate-800 text-sm mt-0.5">{record.visitDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Doctor</span>
                    <p className="font-semibold text-slate-800 text-sm mt-0.5">{record.doctorName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Department</span>
                    <p className="font-medium text-slate-700 mt-0.5">{record.department}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Visit Type</span>
                    <p className="mt-0.5">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#0D47A1] font-semibold text-[11px] rounded" style={{ fontFamily: PP }}>
                        {record.visitType}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Duration of Symptoms</span>
                    <p className="font-medium text-slate-700 mt-0.5">{record.durationOfSymptoms}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-3 pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Chief Complaint</span>
                    <p className="font-semibold text-[#111827] text-sm mt-0.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{record.chiefComplaint}"
                    </p>
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
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.vitals ? '-rotate-90' : ''}`} />
              </button>

              {!collapsedSections.vitals && (
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs" style={{ fontFamily: RB }}>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Height</div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{record.vitals.height}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Weight</div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{record.vitals.weight}</div>
                  </div>
                  <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl">
                    <div className="text-[10px] text-teal-600 font-bold uppercase" style={{ fontFamily: PP }}>BMI</div>
                    <div className="font-bold text-[#009688] text-sm mt-1">{record.vitals.bmi}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Temperature</div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{record.vitals.temperature}</div>
                  </div>
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
                    <div className="text-[10px] text-red-600 font-bold uppercase" style={{ fontFamily: PP }}>Blood Pressure</div>
                    <div className="font-bold text-red-700 text-sm mt-1">{record.vitals.bp}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Pulse Rate</div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{record.vitals.pulse}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Resp. Rate</div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{record.vitals.respiratoryRate}</div>
                  </div>
                  <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl">
                    <div className="text-[10px] text-green-600 font-bold uppercase" style={{ fontFamily: PP }}>SpO₂</div>
                    <div className="font-bold text-green-700 text-sm mt-1">{record.vitals.spo2}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold uppercase" style={{ fontFamily: PP }}>Blood Sugar</div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{record.vitals.bloodSugar}</div>
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
                <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Clinical Examination Findings</span>
                    <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      {record.clinicalExamination}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Provisional Diagnosis</span>
                      <p className="font-semibold text-slate-800 text-sm mt-1">{record.provisionalDiagnosis}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Final Diagnosis</span>
                      <p className="font-bold text-[#0D47A1] text-sm mt-1">{record.finalDiagnosis}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>ICD Code</span>
                    <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="font-mono font-bold text-[#0D47A1]">{record.icdCode}</span>
                    </div>
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
                  <span className="text-[11px] font-bold text-[#009688] bg-teal-50 px-2.5 py-0.5 rounded-full" style={{ fontFamily: PP }}>
                    Total: {record.medicines.length} Prescribed Medications
                  </span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${collapsedSections.prescription ? '-rotate-90' : ''}`} />
                </div>
              </button>

              {!collapsedSections.prescription && (
                <div className="p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-bold text-[#64748B] uppercase" style={{ fontFamily: PP }}>
                          <th className="py-2.5 px-4">Medicine</th>
                          <th className="py-2.5 px-4">Dosage</th>
                          <th className="py-2.5 px-4">Frequency</th>
                          <th className="py-2.5 px-4">Duration</th>
                          <th className="py-2.5 px-4">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100" style={{ fontFamily: RB }}>
                        {record.medicines.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-[#111827]" style={{ fontFamily: PP }}>{m.name}</td>
                            <td className="py-3 px-4 font-semibold text-slate-700">{m.dosage}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-blue-50 text-[#0D47A1] rounded font-semibold text-[11px]">
                                {m.frequency}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-700">{m.duration}</td>
                            <td className="py-3 px-4 text-slate-600 italic">{m.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Recommended Investigations</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {record.investigations.map((inv, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-bold text-xs" style={{ fontFamily: PP }}>
                          {inv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Remarks</span>
                    <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      {record.investigationRemarks}
                    </p>
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
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" style={{ fontFamily: RB }}>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Symptoms</span>
                    <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">{record.symptoms}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Assessment</span>
                    <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">{record.assessment}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Advice</span>
                    <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">{record.advice}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Lifestyle Recommendations</span>
                    <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">{record.lifestyleRecommendations}</p>
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
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs" style={{ fontFamily: RB }}>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Follow-up Required</span>
                    <p className="font-bold text-slate-800 mt-1">{record.followupRequired}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Next Visit Date</span>
                    <p className="font-bold text-[#0D47A1] text-sm mt-1">{record.nextVisitDate}</p>
                  </div>
                  <div className="sm:col-span-3 border-t border-gray-100 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase" style={{ fontFamily: PP }}>Follow-up Notes</span>
                    <p className="font-medium text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">{record.followupNotes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 08: CONSULTATION SUMMARY ── */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 border-b border-gray-100 pb-3" style={{ fontFamily: PP }}>
                <CheckCircle2 size={16} className="text-[#66BB6A]" />
                Consultation Final Summary
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs" style={{ fontFamily: RB }}>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Patient</span>
                  <p className="font-bold text-[#111827]">{record.patientName}</p>
                  <p className="text-[11px] text-slate-500">{record.uhid}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Doctor</span>
                  <p className="font-bold text-[#111827]">{record.doctorName}</p>
                  <p className="text-[11px] text-slate-500">{record.department}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Final Diagnosis</span>
                  <p className="font-bold text-[#0D47A1]">{record.finalDiagnosis}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold" style={{ fontFamily: PP }}>Prescription & Tests</span>
                  <p className="font-bold text-[#009688]">{record.medicines.length} Medicines</p>
                  <p className="text-[11px] text-slate-500">{record.investigations.length} Recommended Tests</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-4">
                  <span>Follow-up Date: <strong className="text-[#111827]">{record.nextVisitDate}</strong></span>
                  <span>Fee Paid: <strong className="text-[#0D47A1]">{record.consultationFee}</strong></span>
                  <span>Completed Time: <strong className="text-slate-700">{record.completionTime}</strong></span>
                </div>
                <span className="px-3 py-1 bg-green-50 text-[#66BB6A] border border-green-200 rounded-full font-bold text-[11px]" style={{ fontFamily: PP }}>
                  Status: Completed
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT CONTEXT PANEL (30% on desktop: col-span-4) */}
          <div className="lg:col-span-4 space-y-5">

            {/* CARD 1: PATIENT SNAPSHOT */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Patient Snapshot</h3>
                <span className="text-[10px] font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">Recorded</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-base" style={{ fontFamily: PP }}>
                  SM
                </div>
                <div>
                  <div className="font-bold text-sm text-[#111827]" style={{ fontFamily: PP }}>{record.patientName}</div>
                  <div className="text-xs text-slate-500" style={{ fontFamily: RB }}>{record.age} yrs · {record.gender} · Blood {record.bloodGroup}</div>
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
                  <span className="font-bold text-red-600">{record.allergies.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* CARD 2: DOCTOR INFORMATION */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Doctor Information</h3>

              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#009688] text-white flex items-center justify-center font-bold text-xs" style={{ fontFamily: PP }}>
                  AM
                </div>
                <div>
                  <div className="font-bold text-xs text-[#111827]" style={{ fontFamily: PP }}>{record.doctorName}</div>
                  <div className="text-[11px] text-slate-500" style={{ fontFamily: RB }}>{record.doctorSpecialty}</div>
                  <div className="text-[10px] text-[#0D47A1] font-semibold mt-0.5">{record.department}</div>
                </div>
              </div>
            </div>

            {/* CARD 3: CONSULTATION TIMELINE */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Consultation Timeline</h3>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">Finalized</span>
              </div>

              <div className="space-y-0">
                {timelineEvents.map((evt, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${idx === timelineEvents.length - 1 ? 'bg-[#66BB6A]' : 'bg-[#0D47A1]'} mt-1 shrink-0`} />
                      {idx < timelineEvents.length - 1 && <div className="w-px flex-1 bg-gray-200 my-0.5" />}
                    </div>
                    <div className="pb-3.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800" style={{ fontFamily: PP }}>{evt.title}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${evt.badgeColor}`} style={{ fontFamily: PP }}>
                          {evt.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {evt.date} · {evt.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 4: QUICK ACTIONS */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>Quick Actions</h3>

              <button
                onClick={() => alert(`Prescription printed for ${record.id}`)}
                className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-[#009688] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} />
                Print Prescription
              </button>

              <button
                onClick={() => alert(`Downloading Consultation Record PDF (${record.id})`)}
                className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Download size={15} />
                Download Consultation PDF
              </button>

              <button
                onClick={() => onEditConsultation?.(record.id)}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Edit3 size={15} />
                Edit Consultation
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ── STICKY FOOTER ACTION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-3 shadow-lg flex items-center justify-between">
        <div className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
          Consultation Record <strong className="text-[#0D47A1]">{record.id}</strong> · {record.patientName}
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
            onClick={() => alert(`Prescription printed for ${record.id}`)}
            className="px-4 py-2 border border-[#E5E7EB] bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} className="text-[#009688]" />
            Print Prescription
          </button>
          <button
            onClick={() => alert(`Downloading Consultation Record PDF (${record.id})`)}
            className="px-4 py-2 border border-[#E5E7EB] bg-blue-50 text-[#0D47A1] hover:bg-blue-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Download size={15} />
            Download PDF
          </button>
          <button
            onClick={() => onEditConsultation?.(record.id)}
            className="px-5 py-2 bg-[#0D47A1] hover:bg-[#0a3880] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            style={{ fontFamily: PP }}
          >
            <Edit3 size={15} />
            Edit Consultation
          </button>
        </div>
      </div>
    </div>
  )
}
