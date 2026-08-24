import { apiClient, API_BASE_URL } from "../lib/axios";
import { getToken } from "../lib/cookie-token-storage";

/**
 * Common Download & Export Utilities for HMS Backend APIs
 * Handles binary file downloads (PDF, Excel, CSV) and printable HTML popups for:
 * - e-Prescriptions (/api/v1/prescriptions/{id}/print-output & reprint)
 * - Billing Receipts (/api/v1/billing/{id}/receipt)
 * - Queue Token Slips (/api/v1/reception/appointments/{id}/token)
 * - Administrative Reports PDF / Excel / CSV Exports
 */

/**
 * Download a binary file (PDF, Excel, CSV) from a backend endpoint
 */
export async function downloadFileFromApi(
  endpointUrl: string,
  filename: string,
): Promise<boolean> {
  try {
    const fullUrl = endpointUrl.startsWith("http")
      ? endpointUrl
      : `${API_BASE_URL}${endpointUrl.startsWith("/") ? "" : "/"}${endpointUrl}`;

    const token = getToken("accessToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, { headers });
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error(`Failed to download file from ${endpointUrl}:`, error);
    return false;
  }
}

/**
 * Print or Download e-Prescription Output
 * Endpoint: GET /api/v1/prescriptions/{prescriptionId}/print-output
 */
export async function printPrescriptionOutput(
  prescriptionId: string | number,
): Promise<boolean> {
  try {
    const res = await apiClient.get(
      `/api/v1/prescriptions/${prescriptionId}/print-output`,
    );
    const data = (res.data as Record<string, unknown>)?.data || res.data || {};
    const dObj = data as Record<string, unknown>;
    const pObj = (dObj.patient as Record<string, unknown>) || {};
    const docObj = (dObj.doctor as Record<string, unknown>) || {};

    const rxId = String(dObj.prescriptionId || dObj.id || `RX-${prescriptionId}`);
    const hospital = String(dObj.hospitalName || "SafeHands Super Speciality Hospital");
    const patientName = String(pObj.fullName || dObj.patientName || "Patient");
    const mrn = String(pObj.mrn || dObj.mrn || "MRN-0000");
    const ageGender = `${pObj.age || "—"} Y / ${pObj.gender || "—"}`;
    const bloodGroup = String(pObj.bloodGroup || "O+");
    const doctorName = String(docObj.fullName || dObj.doctorName || "Attending Physician");
    const docReg = String(docObj.registrationNumber || "MED-REG-88901");
    const dept = String(docObj.department || dObj.department || "OPD");
    const issuedAt = String(dObj.issuedAt || new Date().toLocaleString("en-GB"));

    const meds = Array.isArray(dObj.medications)
      ? dObj.medications
      : Array.isArray(dObj.medicines)
      ? dObj.medicines
      : [];

    const advice = (dObj.advice as Record<string, string>) || {};

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Prescription_${rxId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; margin: 0; padding: 24px; background: #FFF; }
    .container { max-width: 800px; margin: 0 auto; border: 2px solid #0D47A1; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: 800; color: #0D47A1; text-transform: uppercase; margin: 0; }
    .sub { font-size: 11px; color: #64748B; margin-top: 4px; }
    .badge { background: #0D47A1; color: #FFF; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; font-family: monospace; }
    .section-title { font-size: 11px; font-weight: 800; color: #0D47A1; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px; margin-top: 20px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12px; }
    .label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px; }
    .val { font-weight: 700; color: #0F172A; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
    th { background: #F1F5F9; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 10px; padding: 8px 12px; text-align: left; border-bottom: 1px solid #E2E8F0; }
    td { padding: 10px 12px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
    .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748B; }
    @media print { body { padding: 0; } .container { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="title">${hospital}</h1>
        <div class="sub">Official e-Prescription & OPD Record</div>
      </div>
      <div class="badge">${rxId}</div>
    </div>

    <div class="section-title">Patient & Doctor Information</div>
    <div class="grid">
      <div><div class="label">Patient Name</div><div class="val">${patientName}</div></div>
      <div><div class="label">MRN</div><div class="val" style="font-family: monospace; color: #0D47A1;">${mrn}</div></div>
      <div><div class="label">Age / Gender</div><div class="val">${ageGender}</div></div>
      <div><div class="label">Blood Group</div><div class="val" style="color: #DC2626;">${bloodGroup}</div></div>
      <div><div class="label">Attending Doctor</div><div class="val">${doctorName} (${docReg})</div></div>
      <div><div class="label">Department / Date</div><div class="val">${dept} · ${issuedAt}</div></div>
    </div>

    <div class="section-title">Prescribed Medications (Rx)</div>
    <table>
      <thead>
        <tr>
          <th>Medicine Name</th>
          <th>Dosage</th>
          <th>Frequency</th>
          <th>Duration</th>
          <th>Instructions</th>
        </tr>
      </thead>
      <tbody>
        ${
          meds.length === 0
            ? '<tr><td colspan="5" style="text-align: center; color: #94A3B8;">No medications listed.</td></tr>'
            : meds
                .map(
                  (m: Record<string, unknown>) => `
          <tr>
            <td style="font-weight: 700;">${m.medicineName || m.name || "Medication"}</td>
            <td>${m.dosage || m.dose || "1 tab"}</td>
            <td style="color: #0D47A1; font-weight: 700;">${m.frequency || "Once daily"}</td>
            <td>${m.duration || "5 days"}</td>
            <td style="color: #64748B; font-style: italic;">${m.instructions || "After food"}</td>
          </tr>
        `,
                )
                .join("")
        }
      </tbody>
    </table>

    ${
      advice.general || advice.diet || advice.precautions
        ? `
      <div class="section-title">Doctor's Advice & Instructions</div>
      <div style="background: #F8FAFC; border-left: 4px solid #0D47A1; padding: 12px; border-radius: 4px; font-size: 12px;">
        ${advice.general ? `<div><strong>General:</strong> ${advice.general}</div>` : ""}
        ${advice.diet ? `<div style="margin-top: 4px;"><strong>Diet:</strong> ${advice.diet}</div>` : ""}
        ${advice.precautions ? `<div style="margin-top: 4px;"><strong>Precautions:</strong> ${advice.precautions}</div>` : ""}
      </div>
    `
        : ""
    }

    <div class="footer">
      <div>Issued Date: ${issuedAt}</div>
      <div style="text-align: right;">
        <div style="border-bottom: 1px solid #94A3B8; width: 140px; margin-bottom: 4px; display: inline-block;"></div>
        <div style="font-weight: 700;">${doctorName}</div>
        <div>Doctor Signature</div>
      </div>
    </div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };</script>
</body>
</html>
    `;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
    } else {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Prescription_${rxId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    return true;
  } catch (error) {
    console.error("Failed to fetch prescription print output:", error);
    return false;
  }
}

/**
 * Reprint Prescription (Emits audit log)
 * Endpoint: POST /api/v1/prescriptions/{prescriptionId}/reprint
 */
export async function reprintPrescription(
  prescriptionId: string | number,
): Promise<boolean> {
  try {
    await apiClient.post(`/api/v1/prescriptions/${prescriptionId}/reprint`);
    return await printPrescriptionOutput(prescriptionId);
  } catch (error) {
    console.error("Failed to reprint prescription:", error);
    return false;
  }
}

/**
 * Print Billing Payment Receipt Slip
 * Endpoint: GET /api/v1/billing/{billId}/receipt
 */
export async function printBillingReceipt(
  billId: string | number,
): Promise<boolean> {
  try {
    const res = await apiClient.get(`/api/v1/billing/${billId}/receipt`);
    const dObj = ((res.data as Record<string, unknown>)?.data || res.data || {}) as Record<string, unknown>;

    const receiptId = String(dObj.receiptId || `RCT-${billId}`);
    const invNo = String(dObj.invoiceNumber || `INV-${billId}`);
    const patName = String(dObj.patientName || "Patient");
    const mrn = String(dObj.mrn || "MRN-0000");
    const docName = String(dObj.doctorName || "Attending Doctor");
    const paymentDate = dObj.paymentDate
      ? new Date(String(dObj.paymentDate)).toLocaleString("en-GB")
      : new Date().toLocaleString("en-GB");
    const paymentMode = String(dObj.paymentMode || "Cash / Card");
    const total = Number(dObj.totalAmount || 0).toFixed(2);
    const discount = Number(dObj.discountAmount || 0).toFixed(2);
    const paid = Number(dObj.paidAmount || 0).toFixed(2);
    const balance = Number(dObj.balanceDue || 0).toFixed(2);
    const status = String(dObj.paymentStatus || "PAID");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Receipt_${receiptId}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #1E293B; margin: 0; padding: 24px; }
    .receipt { max-width: 500px; margin: 0 auto; border: 2px solid #0D47A1; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .title { font-size: 18px; font-weight: 800; color: #0D47A1; text-transform: uppercase; margin: 0; text-align: center; }
    .sub { font-size: 11px; color: #64748B; text-align: center; margin-top: 4px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 16px; }
    .row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px; }
    .label { color: #64748B; }
    .val { font-weight: 700; color: #0F172A; }
    .total-box { background: #F8FAFC; border-top: 2px border-bottom: 2px dashed #CBD5E1; padding: 12px 0; margin: 16px 0; }
    .footer { text-align: center; font-size: 10px; color: #94A3B8; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="title">SafeHands Hospital</div>
    <div class="sub">Official Payment Receipt · ${receiptId}</div>

    <div class="row"><span class="label">Invoice No:</span><span class="val">${invNo}</span></div>
    <div class="row"><span class="label">Patient Name:</span><span class="val">${patName} (${mrn})</span></div>
    <div class="row"><span class="label">Doctor:</span><span class="val">${docName}</span></div>
    <div class="row"><span class="label">Payment Date:</span><span class="val">${paymentDate}</span></div>
    <div class="row"><span class="label">Payment Mode:</span><span class="val">${paymentMode}</span></div>

    <div class="total-box">
      <div class="row"><span class="label">Total Amount:</span><span class="val">₹${total}</span></div>
      <div class="row"><span class="label">Discount:</span><span class="val">₹${discount}</span></div>
      <div class="row" style="font-size: 14px; font-weight: 800; color: #16A34A;"><span class="label" style="color: #16A34A;">Amount Paid:</span><span>₹${paid}</span></div>
      <div class="row"><span class="label">Balance Due:</span><span class="val">₹${balance}</span></div>
      <div class="row"><span class="label">Status:</span><span class="val" style="color: #66BB6A;">${status}</span></div>
    </div>

    <div class="footer">Thank you for choosing SafeHands Hospital.</div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };</script>
</body>
</html>
    `;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
    }
    return true;
  } catch (error) {
    console.error("Failed to print billing receipt:", error);
    return false;
  }
}

/**
 * Print Queue Token Slip
 * Endpoint: GET /api/v1/reception/appointments/{appointmentId}/token
 */
export async function printQueueTokenSlip(
  appointmentId: string | number,
): Promise<boolean> {
  try {
    const res = await apiClient.get(
      `/api/v1/reception/appointments/${appointmentId}/token`,
    );
    const dObj = ((res.data as Record<string, unknown>)?.data || res.data || {}) as Record<string, unknown>;

    const tokenNum = String(dObj.tokenNumber || dObj.token || "CARD-001");
    const queueNo = dObj.queueNumber || 1;
    const patName = String(dObj.patientName || "Patient");
    const docName = String(dObj.doctorName || "Doctor");
    const dateStr = String(dObj.appointmentDate || new Date().toLocaleDateString("en-GB"));
    const timeStr = String(dObj.appointmentTime || "10:00 AM");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Token_${tokenNum}</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; margin: 0; }
    .token-card { max-width: 320px; margin: 0 auto; border: 2px solid #0D47A1; border-radius: 16px; padding: 24px; background: #FFF; }
    .hospital { font-size: 16px; font-weight: 800; color: #0D47A1; text-transform: uppercase; }
    .sub { font-size: 10px; color: #64748B; margin-bottom: 16px; }
    .token-box { background: #F0F9FF; border: 2px solid #0D47A1; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .token-num { font-size: 32px; font-weight: 900; color: #0D47A1; font-family: monospace; }
    .pos { font-size: 12px; font-weight: 700; color: #0369A1; margin-top: 4px; }
    .info { font-size: 12px; color: #334155; margin-top: 6px; text-align: left; }
  </style>
</head>
<body>
  <div class="token-card">
    <div class="hospital">SafeHands Hospital</div>
    <div class="sub">OPD Queue Token Slip</div>

    <div class="token-box">
      <div style="font-size: 10px; text-transform: uppercase; color: #64748B; font-weight: 700;">YOUR TOKEN NUMBER</div>
      <div class="token-num">${tokenNum}</div>
      <div class="pos">Queue Position: #${queueNo}</div>
    </div>

    <div class="info">
      <div><strong>Patient:</strong> ${patName}</div>
      <div style="margin-top: 4px;"><strong>Doctor:</strong> ${docName}</div>
      <div style="margin-top: 4px;"><strong>Visit Time:</strong> ${dateStr} at ${timeStr}</div>
    </div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };</script>
</body>
</html>
    `;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
    }
    return true;
  } catch (error) {
    console.error("Failed to print queue token slip:", error);
    return false;
  }
}

/**
 * Backend Report Export Endpoints Configuration
 */
export const REPORT_EXPORT_ENDPOINTS = {
  DOCTOR_PERFORMANCE_PDF: "/api/v1/admin/reports/doctors/performance/export/pdf",
  DOCTOR_PERFORMANCE_EXCEL: "/api/v1/admin/reports/doctors/performance/export/excel",
  COLLECTION_RATE_PDF: "/api/v1/admin/reports/collection-rate/export/pdf",
  COLLECTION_RATE_EXCEL: "/api/v1/admin/reports/collection-rate/export/excel",
  ACCOUNTANT_FINANCIAL_CSV: "/api/v1/accountant/reports/export/csv",
};
