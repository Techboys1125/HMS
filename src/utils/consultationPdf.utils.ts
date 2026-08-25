/**
 * Consultation Details PDF / Print Document Generator Utility
 * Generates an official OPD Consultation Record & Prescription PDF file for download or printing.
 */

export interface PrintableConsultationData {
  id: string
  visitDate: string
  completionTime?: string
  patientName: string
  mrn: string
  age: number | string
  gender: string
  bloodGroup?: string
  allergies?: string[]
  doctorName: string
  doctorSpecialty?: string
  department: string
  visitType: string
  chiefComplaint: string
  vitals?: {
    height?: string
    weight?: string
    bmi?: string
    temperature?: string
    bp?: string
    pulse?: string
    respiratoryRate?: string
    spo2?: string
    bloodSugar?: string
  }
  clinicalExamination?: string
  provisionalDiagnosis?: string
  finalDiagnosis?: string
  icdCode?: string
  medicines?: Array<{
    id?: string
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
  investigations?: string[]
  investigationRemarks?: string
  symptoms?: string
  assessment?: string
  advice?: string
  lifestyleRecommendations?: string
  followupRequired?: string
  nextVisitDate?: string
  followupNotes?: string
  status?: string
}

export function downloadConsultationPdf(data: PrintableConsultationData): void {
  const encId = String(data.id || "ENC-1001")
  const patName = data.patientName || "Patient"
  const mrn = data.mrn || "MRN-000000"
  const ageStr = `${data.age || "—"} yrs / ${data.gender || "—"}`
  const provDx = data.provisionalDiagnosis && data.provisionalDiagnosis !== "Recorded" ? data.provisionalDiagnosis : ""
  const finalDx = data.finalDiagnosis && data.finalDiagnosis !== "Recorded" ? data.finalDiagnosis : (data.provisionalDiagnosis || data.assessment || "Diagnosis Recorded")
  const icd = data.icdCode && data.icdCode !== "—" ? data.icdCode : ""
  const blood = data.bloodGroup && data.bloodGroup !== "N/A" ? data.bloodGroup : "Not Specified"
  const docName = data.doctorName || "Doctor"
  const dept = data.department || "OPD"
  const dateStr = data.visitDate || new Date().toLocaleDateString("en-GB")
  const timeStr = data.completionTime || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const visitType = data.visitType || "First Visit"
  const complaint = data.chiefComplaint || "None recorded"
  const exam = data.clinicalExamination || "Normal physical and systemic examination findings."
  const advice = data.advice || "Follow doctor advice and complete medication course."
  const diet = data.lifestyleRecommendations || "Maintain balanced diet and hydration."
  const nextVisit = data.nextVisitDate || "—"
  const followupNotes = data.followupNotes || "—"

  const meds = Array.isArray(data.medicines) ? data.medicines : []
  const tests = Array.isArray(data.investigations) ? data.investigations : []
  const vitals = data.vitals || {}

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Consultation_Record_${encId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1E293B; margin: 0; padding: 24px; background: #FFF; }
    .container { max-width: 800px; margin: 0 auto; border: 2px solid #0D47A1; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 20px; }
    .hospital-title { font-size: 22px; font-weight: 800; color: #0D47A1; text-transform: uppercase; margin: 0; }
    .hospital-sub { font-size: 11px; color: #64748B; margin-top: 4px; }
    .badge { background: #0D47A1; color: #FFF; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; font-family: monospace; }
    .section-title { font-size: 12px; font-weight: 800; color: #0D47A1; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px; margin-top: 24px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12px; }
    .field-label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px; }
    .field-value { font-weight: 700; color: #0F172A; }
    .vitals-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; }
    .vitals-card { background: #FFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px; text-align: center; }
    .vitals-val { font-size: 13px; font-weight: 800; color: #0D47A1; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
    th { background: #F1F5F9; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 10px; padding: 8px 12px; text-align: left; border-bottom: 1px solid #E2E8F0; }
    td { padding: 10px 12px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
    .rx-name { font-weight: 800; color: #0F172A; }
    .tag { display: inline-block; background: #F3E8FF; color: #6B21A8; border: 1px solid #E9D5FF; border-radius: 12px; padding: 4px 10px; font-weight: 700; font-size: 11px; margin-right: 6px; margin-bottom: 6px; }
    .notes-box { background: #F8FAFC; border-left: 4px solid #0D47A1; border-radius: 4px; padding: 12px; font-size: 12px; color: #334155; }
    .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #E2E8F0; display: flex; justify-between: space-between; align-items: flex-end; font-size: 11px; color: #64748B; }
    .sig-box { text-align: right; }
    .sig-line { width: 160px; border-bottom: 1px solid #94A3B8; margin-bottom: 6px; display: inline-block; }
    @media print {
      body { padding: 0; background: #FFF; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="hospital-title">SafeHands Hospital</h1>
        <div class="hospital-sub">Outpatient Department (OPD) · Clinical Consultation Summary & Prescription</div>
      </div>
      <div class="badge">${encId}</div>
    </div>

    <!-- Patient & Encounter Info -->
    <div class="section-title">Patient & Encounter Information</div>
    <div class="grid">
      <div>
        <div class="field-label">Patient Name</div>
        <div class="field-value">${patName}</div>
      </div>
      <div>
        <div class="field-label">Medical Record No. (MRN)</div>
        <div class="field-value" style="font-family: monospace; color: #0D47A1;">${mrn}</div>
      </div>
      <div>
        <div class="field-label">Age / Gender</div>
        <div class="field-value">${ageStr}</div>
      </div>
      <div>
        <div class="field-label">Blood Group</div>
        <div class="field-value" style="color: #DC2626;">${blood}</div>
      </div>
      <div>
        <div class="field-label">Attending Doctor</div>
        <div class="field-value">${docName}</div>
      </div>
      <div>
        <div class="field-label">Department</div>
        <div class="field-value">${dept}</div>
      </div>
      <div>
        <div class="field-label">Visit Date & Time</div>
        <div class="field-value">${dateStr} (${timeStr})</div>
      </div>
      <div>
        <div class="field-label">Visit Type</div>
        <div class="field-value">${visitType}</div>
      </div>
      <div>
        <div class="field-label">Chief Complaint</div>
        <div class="field-value" style="color: #1E293B;">"${complaint}"</div>
      </div>
    </div>

    <!-- Vitals -->
    <div class="section-title">Patient Vitals Snapshot</div>
    <div class="vitals-grid">
      <div class="vitals-card">
        <div class="field-label">Height</div>
        <div class="vitals-val">${vitals.height || "—"}</div>
      </div>
      <div class="vitals-card">
        <div class="field-label">Weight</div>
        <div class="vitals-val">${vitals.weight || "—"}</div>
      </div>
      <div class="vitals-card">
        <div class="field-label">BMI</div>
        <div class="vitals-val">${vitals.bmi || "—"}</div>
      </div>
      <div class="vitals-card">
        <div class="field-label">BP</div>
        <div class="vitals-val" style="color: #DC2626;">${vitals.bp || "—"}</div>
      </div>
      <div class="vitals-card">
        <div class="field-label">Pulse</div>
        <div class="vitals-val">${vitals.pulse || "—"}</div>
      </div>
      <div class="vitals-card">
        <div class="field-label">Temp</div>
        <div class="vitals-val">${vitals.temperature || "—"}</div>
      </div>
      <div class="vitals-card">
        <div class="field-label">SpO₂</div>
        <div class="vitals-val" style="color: #16A34A;">${vitals.spo2 || "—"}</div>
      </div>
      <div class="vitals-card">
        <div class="field-label">Blood Sugar</div>
        <div class="vitals-val">${vitals.bloodSugar || "—"}</div>
      </div>
    </div>

    <!-- Diagnosis & Examination -->
    <div class="section-title">Clinical Examination & Diagnosis</div>
    <div class="notes-box">
      ${provDx ? `<div style="margin-bottom: 6px;"><strong>Provisional Diagnosis:</strong> <span style="font-weight: 700; color: #475569;">${provDx}</span></div>` : ''}
      <div style="margin-bottom: 6px;"><strong>Diagnosis / Clinical Assessment:</strong> <span style="font-weight: 800; color: #0D47A1; font-size: 13px;">${finalDx}</span> ${icd ? `<span style="background: #EFF6FF; color: #1D4ED8; font-weight: bold; font-family: monospace; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">ICD Code: ${icd}</span>` : ''}</div>
      <div><strong>Examination Findings:</strong> ${exam}</div>
    </div>

    <!-- Prescribed Medications (Rx) -->
    <div class="section-title">Prescribed Medications (Rx)</div>
    ${meds.length === 0 ? '<p style="font-size: 12px; color: #64748B; italic;">No medications prescribed for this encounter.</p>' : `
      <table>
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
            <th>Special Instructions</th>
          </tr>
        </thead>
        <tbody>
          ${meds.map(m => `
            <tr>
              <td class="rx-name">${m.name}</td>
              <td>${m.dosage}</td>
              <td style="color: #0D47A1; font-weight: 700;">${m.frequency}</td>
              <td>${m.duration}</td>
              <td style="color: #64748B; font-style: italic;">${m.instructions || "After food"}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `}

    <!-- Recommended Investigations -->
    ${tests.length > 0 ? `
      <div class="section-title">Recommended Diagnostic Investigations</div>
      <div>
        ${tests.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    ` : ''}

    <!-- Advice & Follow-up -->
    <div class="section-title">Clinical Advice & Follow-up Instructions</div>
    <div class="grid" style="grid-template-columns: 1fr 1fr;">
      <div class="notes-box">
        <div style="font-weight: 700; color: #0D47A1; margin-bottom: 4px;">General & Lifestyle Advice:</div>
        <div>${advice}</div>
        <div style="margin-top: 6px; font-size: 11px; color: #475569;">${diet}</div>
      </div>
      <div class="notes-box" style="background: #FFFBEB; border-left-color: #D97706;">
        <div style="font-weight: 700; color: #B45309; margin-bottom: 4px;">Next Recommended Follow-Up:</div>
        <div style="font-size: 14px; font-weight: 800; color: #B45309;">${nextVisit}</div>
        <div style="margin-top: 4px; font-size: 11px; color: #78350F;">${followupNotes}</div>
      </div>
    </div>

    <!-- Sign-off Footer -->
    <div class="footer">
      <div>
        <div>Generated on: ${new Date().toLocaleString('en-GB')}</div>
        <div style="font-size: 10px; margin-top: 2px;">Official OPD Consultation Record · SafeHands HMS</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div style="font-weight: 700; color: #0F172A;">${docName}</div>
        <div style="font-size: 10px; color: #64748B;">Attending Physician / Doctor Signature</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  } else {
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url;
    a.download = `Consultation_Record_${encId}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
