/**
 * Common Appointment Slip PDF / Print Receipt Generator Utility
 * Can be used across all screens (Patient Portal, Book Appointment, Reception, OPD)
 */

export interface PrintableAppointmentData {
  id?: string | number;
  appointmentNumber?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  patientPhone?: string;
  mrn?: string;
  doctor?: string;
  doctorName?: string;
  department?: string;
  specialty?: string;
  date?: string;
  appointmentDate?: string;
  time?: string;
  startTime?: string;
  visitType?: string;
  status?: string;
  roomLocation?: string;
  opdRoom?: string;
  reason?: string;
  chiefComplaint?: string;
  notes?: string;
  remarks?: string;
}

export function downloadAppointmentSlipPdf(
  appt: PrintableAppointmentData,
): void {
  const aptId = String(appt.id || appt.appointmentNumber || "APT-REC");
  const patName = appt.patientName || "Patient";
  const docName = appt.doctor || appt.doctorName || "Doctor";
  const dept = appt.department || "General Medicine";
  const dateStr =
    appt.date || appt.appointmentDate || new Date().toISOString().split("T")[0];
  const timeStr = appt.time || appt.startTime || "09:00 AM";
  const visitType = appt.visitType || "In-Person OPD";
  const room = appt.roomLocation || appt.opdRoom || "Wing A, OPD Room 102";
  const reason = appt.reason || appt.chiefComplaint || "General Consultation";
  const notes = appt.notes || appt.remarks || "No additional remarks";
  const mrn = appt.mrn || "MRN-2026";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Appointment Slip - ${aptId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827; margin: 0; padding: 24px; background: #fff; }
    .slip-container { max-width: 680px; margin: 0 auto; border: 2px solid #0D47A1; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px; margin-bottom: 24px; }
    .hospital-title { font-size: 20px; font-weight: 800; color: #0D47A1; text-transform: uppercase; margin: 0; }
    .hospital-sub { font-size: 11px; color: #64748B; margin-top: 4px; }
    .badge { background: #0D47A1; color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; font-family: monospace; }
    .section-title { font-size: 11px; font-weight: 800; color: #0D47A1; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; margin-bottom: 12px; margin-top: 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 13px; }
    .field-label { font-size: 11px; color: #64748B; margin-bottom: 2px; }
    .field-value { font-weight: 700; color: #111827; }
    .highlight-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-top: 16px; }
    .instructions { font-size: 11px; color: #475569; margin-top: 24px; background: #EFF6FF; border-left: 4px solid #0D47A1; padding: 12px; border-radius: 4px; }
    .footer { margin-top: 32px; text-align: center; font-size: 10px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 16px; }
    @media print {
      body { padding: 0; }
      .slip-container { border: 1px solid #ccc; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="slip-container">
    <div class="header">
      <div>
        <h1 class="hospital-title">SafeHands Hospital</h1>
        <div class="hospital-sub">OPD Medical Center · City Campus · Tel: +1 (800) 555-0199</div>
      </div>
      <div class="badge">${aptId}</div>
    </div>

    <div class="section-title">Patient Details</div>
    <div class="grid">
      <div>
        <div class="field-label">Patient Name</div>
        <div class="field-value">${patName}</div>
      </div>
      <div>
        <div class="field-label">Medical Record Number (MRN)</div>
        <div class="field-value" style="font-family: monospace;">${mrn}</div>
      </div>
    </div>

    <div class="section-title">Appointment Schedule & Doctor Details</div>
    <div class="grid">
      <div>
        <div class="field-label">Attending Doctor</div>
        <div class="field-value">${docName}</div>
      </div>
      <div>
        <div class="field-label">Department / Specialty</div>
        <div class="field-value">${dept}</div>
      </div>
      <div>
        <div class="field-label">Appointment Date</div>
        <div class="field-value">${dateStr}</div>
      </div>
      <div>
        <div class="field-label">Scheduled Time</div>
        <div class="field-value" style="color: #0D47A1;">${timeStr}</div>
      </div>
      <div>
        <div class="field-label">Visit Type</div>
        <div class="field-value">${visitType}</div>
      </div>
      <div>
        <div class="field-label">Hospital Location</div>
        <div class="field-value">${room}</div>
      </div>
    </div>

    <div class="section-title">Visit Details</div>
    <div class="highlight-box">
      <div style="margin-bottom: 10px;">
        <div class="field-label">Chief Complaint / Reason for Visit</div>
        <div class="field-value" style="font-weight: 600;">${reason}</div>
      </div>
      <div>
        <div class="field-label">Remarks & Clinical Notes</div>
        <div class="field-value" style="font-size: 12px; font-weight: 400; color: #334155;">${notes}</div>
      </div>
    </div>

    <div class="instructions">
      <strong>Patient Instructions:</strong>
      <ul style="margin: 4px 0 0 0; padding-left: 16px;">
        <li>Please arrive 15 minutes prior to your scheduled time slot.</li>
        <li>Present this appointment slip at the OPD reception counter upon arrival.</li>
        <li>Bring any past prescription or diagnostic report files if applicable.</li>
      </ul>
    </div>

    <div class="footer">
      This is an official system-generated appointment receipt from SafeHands HMS Patient Portal.
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
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Appointment_Slip_${aptId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
