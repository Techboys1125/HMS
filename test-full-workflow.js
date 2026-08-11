const API_BASE = "http://192.168.1.44:8081";

async function login(email, password) {
  for (let i = 0; i < 3; i++) {
    var r = await fetch(API_BASE + "/api/v1/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });
    var d = await r.json();
    if (d && d.data && d.data.accessToken) return d.data.accessToken;
    await new Promise((res) => setTimeout(res, 1000));
  }
  return null;
}

async function api(token, method, url, body) {
  var opts = { method: method, headers: { "Content-Type": "application/json" } };
  if (token) opts.headers["Authorization"] = "Bearer " + token;
  if (body) opts.body = JSON.stringify(body);
  var r = await fetch(API_BASE + url, opts);
  var d = await r.json().catch(function() { return null; });
  return { status: r.status, ok: r.ok, data: d };
}

var results = [];
function record(name, r) { results.push({ name: name, ok: r.ok, status: r.status }); }
function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

async function run() {
  console.log("=== FULL OPD WORKFLOW TEST (v2) ===\n");

  var doctorToken = await login("sandeep@gmail.com", "123456789");
  await delay(3500);
  var nurseToken = await login("nurse@gmail.com", "Nurse@123");
  await delay(3500);
  var adminToken = await login("receptionist@gmail.com", "Reception@123");
  await delay(3500);
  var accountantToken = await login("accountant@gmail.com", "Accountant@123");
  await delay(3500);

  console.log("Tokens: ", { doctorToken: !!doctorToken, nurseToken: !!nurseToken, adminToken: !!adminToken, accountantToken: !!accountantToken });

  var today = new Date().toISOString().split("T")[0];
  const scheduleRes = await api(adminToken, "GET", `/api/v1/doctors/1374/schedule?date=${today}`);
  let startTime = "10:00";
  let endTime = "10:15";
  if (scheduleRes.ok && Array.isArray(scheduleRes.data?.data) && scheduleRes.data.data.length > 0) {
    const avail = scheduleRes.data.data.find(s => s.available || s.isAvailable) || scheduleRes.data.data[0];
    startTime = avail.startTime || avail.slotTime || "10:00";
    endTime = avail.endTime || "10:15";
  }

  // 1. Book appointment
  var r1 = await api(adminToken, "POST", "/api/v1/appointments", {
    mrn: "MRN-2026526598", doctorId: 1374,
    appointmentDate: today, startTime: startTime, endTime: endTime,
    appointmentType: "CONSULTATION", reason: "Workflow test v2", symptoms: "Test",
  });
  console.log("Booking response: ", JSON.stringify(r1, null, 2));
  record("1. Book appointment", r1);
  var aptId = r1.ok && r1.data && r1.data.data && r1.data.data.id;
  if (!aptId) { console.log("FAIL - no aptId"); return; }

  // 2. Check-in
  var r2 = await api(adminToken, "PATCH", "/api/v1/reception/appointments/" + aptId + "/check-in");
  record("2. Check-in", r2);

  // 3. Nurse vitals
  var r3 = await api(nurseToken, "POST", "/api/v1/nurse/appointments/" + aptId + "/vitals", {
    temperature: 98.6, bloodPressureSystolic: 120, bloodPressureDiastolic: 80,
    heartRate: 72, respiratoryRate: 16, oxygenSaturation: 98, weight: 70, height: 170,
  });
  record("3. Nurse vitals", r3);

  // 4. Doctor call
  var r4 = await api(doctorToken, "PATCH", "/api/v1/queue/" + aptId + "/call");
  record("4. Doctor call", r4);

  // 5. Start consultation
  var r5 = await api(doctorToken, "PATCH", "/api/v1/appointments/" + aptId + "/status", { status: "IN_CONSULTATION" });
  record("5. Start consultation", r5);

  // 6. Create encounter
  var r6 = await api(doctorToken, "POST", "/api/v1/encounters", { appointmentId: aptId });
  record("6. Create encounter", r6);
  var encId = r6.ok && r6.data && r6.data.encounterId;
  if (!encId) { console.log("FAIL - no encId"); return; }

  // 7. Initialize consultation (chief complaint)
  var r7 = await api(doctorToken, "POST", "/api/v1/encounters/" + encId + "/consultation", {
    chiefComplaint: "Chest pain and shortness of breath"
  });
  record("7. Initialize consultation", r7);
  var cnsId = r7.ok && r7.data && r7.data.id;
  console.log("  Consultation ID: " + cnsId);

  // 8. Add diagnosis
  var r8 = await api(doctorToken, "POST", "/api/v1/encounters/" + encId + "/diagnoses", {
    diagnosisCode: "R07.9", diagnosisName: "Chest pain, unspecified",
  });
  record("8. Add diagnosis", r8);

  // 9. Create prescription
  var r9 = await api(doctorToken, "POST", "/api/v1/encounters/" + encId + "/prescription", { outcome: "MEDICATION_PRESCRIBED" });
  record("9. Create prescription", r9);
  var rxId = r9.ok && r9.data && r9.data.id;
  console.log("  Prescription ID: " + rxId);
  if (!rxId) { console.log("FAIL - no rxId"); return; }

  // 10. Add medication
  var r10 = await api(doctorToken, "POST", "/api/v1/prescriptions/" + rxId + "/medications", {
    source: "FREE_TEXT", medicineName: "Amoxicillin", strength: "500mg",
    form: "CAPSULE", route: "ORAL", doseValue: 1, doseUnit: "CAPSULE",
    frequencyCode: "TID", durationValue: 7, durationUnit: "DAY",
  });
  record("10. Add medication", r10);

  // 11. Save advice
  var r11 = await api(doctorToken, "PUT", "/api/v1/prescriptions/" + rxId + "/advice", {
    generalAdvice: "Complete full course.", dietAdvice: "Drink fluids.", precautions: "Take after food.",
  });
  record("11. Save advice", r11);

  // 12. Validate
  var r12 = await api(doctorToken, "POST", "/api/v1/prescriptions/" + rxId + "/validate");
  record("12. Validate prescription", r12);

  // 13. Finalize prescription
  var r13 = await api(doctorToken, "POST", "/api/v1/prescriptions/" + rxId + "/finalize", { confirmation: true });
  record("13. Finalize prescription", r13);

  // 14. Prescription resolution
  var r14 = await api(doctorToken, "POST", "/api/v1/encounters/" + encId + "/prescription-resolution", { outcome: "PRESCRIPTION_CREATED" });
  record("14. Prescription resolution", r14);

  // 15. Finalization check
  var r15 = await api(doctorToken, "GET", "/api/v1/encounters/" + encId + "/finalization-check");
  record("15. Finalization check", r15);

  // 16. Finalize encounter
  var r16 = await api(doctorToken, "POST", "/api/v1/encounters/" + encId + "/finalize", { confirmation: true });
  record("16. Finalize encounter", r16);

  // 17. Complete appointment (or finalize consultation)
  var r17 = await api(doctorToken, "PATCH", "/api/v1/doctor/appointments/" + aptId + "/complete");
  console.log("r17 complete response: ", JSON.stringify(r17, null, 2));
  record("17. Complete appointment", r17);

  // 18. Read prescription back
  var r18 = await api(doctorToken, "GET", "/api/v1/encounters/" + encId + "/prescription");
  record("18. Read prescription", r18);

  // 19. Create invoice (Accountant)
  var r19 = await api(accountantToken, "POST", "/api/v1/billing", {
    appointmentId: aptId,
    encounterId: encId,
    patientMrn: "MRN-2026526598",
    doctorId: 1374
  });
  record("19. Create bill", r19);
  var billId = r19.ok && r19.data && r19.data.data && r19.data.data.billId;
  console.log("  Bill ID: " + billId);
  if (!billId) { console.log("FAIL - no billId"); return; }

  // 20. Add bill item
  var r20 = await api(accountantToken, "POST", "/api/v1/billing/" + billId + "/items", {
    serviceId: "OPD Consultation Fee",
    quantity: 1
  });
  record("20. Add bill item", r20);

  // 21. Finalize bill
  var r21 = await api(accountantToken, "PATCH", "/api/v1/billing/" + billId + "/finalize");
  record("21. Finalize bill", r21);

  // 22. Receive payment
  var r22 = await api(accountantToken, "POST", "/api/v1/billing/" + billId + "/payments", {
    payments: [{ method: "UPI", amount: 500, referenceNumber: "UPI-987654" }],
    remarks: "Test payment workflow"
  });
  console.log("r22 receive payment response: ", JSON.stringify(r22, null, 2));
  record("22. Receive payment", r22);

  // SUMMARY
  console.log("\n=== RESULTS ===");
  results.forEach(function(r, i) { console.log("  " + (r.ok ? "OK" : "FAIL") + " " + (i+1) + ". [" + r.status + "] " + r.name); });
  var passed = results.filter(function(r) { return r.ok; }).length;
  console.log("\nTotal: " + results.length + " | Passed: " + passed + " | Failed: " + (results.length - passed));
}

run().catch(console.error);
