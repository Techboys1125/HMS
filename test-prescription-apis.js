const API_BASE = "http://192.168.1.44:8081";

let receptionistToken = null;
let doctorToken = null;
let encounterId = null;
let prescriptionId = null;
let appointmentId = null;

async function login(email, password) {
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    return data?.data?.accessToken || data?.accessToken;
  }
  console.log(`  ✗ Login failed for ${email}: ${data?.message}`);
  return null;
}

async function api(token, method, url, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${url}`, options);
  const data = await response.json().catch(() => null);
  return { status: response.status, ok: response.ok, data };
}

function log(label, result) {
  const icon = result.ok ? "✓" : "✗";
  console.log(`\n${icon} ${label} [${result.status}]`);
  const snippet = JSON.stringify(result.data, null, 2);
  console.log(`  ${snippet.substring(0, 1500)}`);
}

const results = [];
function record(name, result) {
  results.push({ name, ok: result.ok, status: result.status });
}

async function run() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  PRESCRIPTION WORKFLOW API TEST SUITE (v4)           ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  // ─── PHASE 1: AUTH ───
  console.log("═══ PHASE 1: AUTHENTICATION ═══");
  receptionistToken = await login("receptionist@gmail.com", "Reception@123");
  doctorToken = await login("thangam@gmail.com", "123456789");
  if (!receptionistToken || !doctorToken) {
    console.log("Cannot proceed. Exiting.");
    return;
  }

  // ─── PHASE 2: CREATE APPOINTMENT FOR TODAY ───
  console.log("\n═══ PHASE 2: CREATE TODAY'S APPOINTMENT ═══");
  const today = new Date().toISOString().split("T")[0];
  const createApt = await api(receptionistToken, "POST", "/api/v1/appointments", {
    mrn: "MRN-2026526598",
    doctorId: 1368,
    appointmentDate: today,
    startTime: "11:30",
    endTime: "11:45",
    appointmentType: "CONSULTATION",
    reason: "API test - prescription workflow v4",
    symptoms: "Test symptoms",
  });
  record("POST /appointments (create)", createApt);
  log(`POST /api/v1/appointments`, createApt);
  
  if (createApt.ok && createApt.data) {
    const aptData = createApt.data?.data || createApt.data;
    appointmentId = aptData?.appointmentId || aptData?.id;
    console.log(`  → Appointment ID: ${appointmentId}`);
  }

  if (!appointmentId) {
    console.log("  Cannot proceed. Exiting.");
    return;
  }

  // ─── PHASE 3: RECEPTION CHECK-IN ───
  console.log("\n═══ PHASE 3: RECEPTION CHECK-IN ═══");
  const checkin = await api(receptionistToken, "PATCH", `/api/v1/reception/appointments/${appointmentId}/check-in`);
  record("PATCH /reception/appointments/{id}/check-in", checkin);
  log(`PATCH /api/v1/reception/appointments/${appointmentId}/check-in`, checkin);

  // ─── PHASE 4: DOCTOR CALLS PATIENT ───
  console.log("\n═══ PHASE 4: DOCTOR CALLS PATIENT ═══");
  const call = await api(doctorToken, "PATCH", `/api/v1/queue/${appointmentId}/call`);
  record("PATCH /queue/{id}/call", call);
  log(`PATCH /api/v1/queue/${appointmentId}/call`, call);

  // ─── PHASE 5: START CONSULTATION ───
  console.log("\n═══ PHASE 5: START CONSULTATION ═══");
  const startStatus = await api(doctorToken, "PATCH", `/api/v1/appointments/${appointmentId}/status`, {
    status: "IN_CONSULTATION"
  });
  record("PATCH /appointments/{id}/status (IN_CONSULTATION)", startStatus);
  log(`PATCH /api/v1/appointments/${appointmentId}/status`, startStatus);

  // ─── PHASE 6: CREATE ENCOUNTER ───
  console.log("\n═══ PHASE 6: CREATE ENCOUNTER ═══");
  const createEnc = await api(doctorToken, "POST", "/api/v1/encounters", { appointmentId });
  record("POST /encounters", createEnc);
  log(`POST /api/v1/encounters { appointmentId: ${appointmentId} }`, createEnc);

  if (createEnc.ok && createEnc.data) {
    const encData = createEnc.data?.data || createEnc.data;
    encounterId = encData?.encounterId || encData?.id;
    console.log(`  → Encounter ID: ${encounterId}`);
  }

  if (!encounterId) {
    console.log("\n  ✗ Cannot continue without encounter.");
    return;
  }

  // ─── PHASE 7: PRESCRIPTION WORKFLOW ───
  console.log("\n═══ PHASE 7: PRESCRIPTION WORKFLOW ═══");

  // 7a. Create prescription
  console.log("\n─── 7a. POST /encounters/{id}/prescription ───");
  const createRx = await api(doctorToken, "POST", `/api/v1/encounters/${encounterId}/prescription`, {
    outcome: "MEDICATION_PRESCRIBED"
  });
  record("POST /encounters/{id}/prescription", createRx);
  log(`POST /api/v1/encounters/${encounterId}/prescription`, createRx);

  if (createRx.ok && createRx.data) {
    const rxData = createRx.data?.data || createRx.data;
    prescriptionId = rxData?.id || rxData?.prescriptionId;
    console.log(`  → Prescription ID: ${prescriptionId}`);
  }

  if (!prescriptionId) {
    console.log("  ✗ No prescription created.");
    return;
  }

  // 7b. Add medication (with FREE_TEXT source)
  console.log("\n─── 7b. POST /prescriptions/{id}/medications (1st) ───");
  const addMed1 = await api(doctorToken, "POST", `/api/v1/prescriptions/${prescriptionId}/medications`, {
    source: "FREE_TEXT",
    medicineName: "Amoxicillin",
    strength: "500mg",
    form: "CAPSULE",
    route: "ORAL",
    doseValue: 1,
    doseUnit: "CAPSULE",
    frequencyCode: "TID",
    durationValue: 7,
    durationUnit: "DAY",
  });
  record("POST /prescriptions/{id}/medications (1st)", addMed1);
  log(`POST /api/v1/prescriptions/${prescriptionId}/medications`, addMed1);

  // 7c. Add second medication
  console.log("\n─── 7c. POST /prescriptions/{id}/medications (2nd) ───");
  const addMed2 = await api(doctorToken, "POST", `/api/v1/prescriptions/${prescriptionId}/medications`, {
    source: "FREE_TEXT",
    medicineName: "Paracetamol",
    strength: "650mg",
    form: "TABLET",
    route: "ORAL",
    doseValue: 1,
    doseUnit: "TABLET",
    frequencyCode: "QID",
    durationValue: 5,
    durationUnit: "DAY",
  });
  record("POST /prescriptions/{id}/medications (2nd)", addMed2);
  log(`POST /api/v1/prescriptions/${prescriptionId}/medications (2nd)`, addMed2);

  // 7d. Save advice
  console.log("\n─── 7d. PUT /prescriptions/{id}/advice ───");
  const saveAdvice = await api(doctorToken, "PUT", `/api/v1/prescriptions/${prescriptionId}/advice`, {
    generalAdvice: "Complete the full course of antibiotics. Rest for 3 days.",
    dietAdvice: "Drink plenty of fluids. Avoid dairy products while on antibiotics.",
    precautions: "Do not skip doses. Take medications after food.",
  });
  record("PUT /prescriptions/{id}/advice", saveAdvice);
  log(`PUT /api/v1/prescriptions/${prescriptionId}/advice`, saveAdvice);

  // 7e. Validate prescription
  console.log("\n─── 7e. POST /prescriptions/{id}/validate ───");
  const validate = await api(doctorToken, "POST", `/api/v1/prescriptions/${prescriptionId}/validate`);
  record("POST /prescriptions/{id}/validate", validate);
  log(`POST /api/v1/prescriptions/${prescriptionId}/validate`, validate);

  // 7f. Read back prescription (GET from encounter)
  console.log("\n─── 7f. GET /encounters/{id}/prescription ───");
  const readRx = await api(doctorToken, "GET", `/api/v1/encounters/${encounterId}/prescription`);
  record("GET /encounters/{id}/prescription", readRx);
  log(`GET /api/v1/encounters/${encounterId}/prescription`, readRx);

  // 7g. Finalize prescription
  console.log("\n─── 7g. POST /prescriptions/{id}/finalize ───");
  const finalize = await api(doctorToken, "POST", `/api/v1/prescriptions/${prescriptionId}/finalize`, {
    confirmation: true
  });
  record("POST /prescriptions/{id}/finalize", finalize);
  log(`POST /api/v1/prescriptions/${prescriptionId}/finalize`, finalize);

  // 7h. Encounter finalization check
  console.log("\n─── 7h. GET /encounters/{id}/finalization-check ───");
  const finCheck = await api(doctorToken, "GET", `/api/v1/encounters/${encounterId}/finalization-check`);
  record("GET /encounters/{id}/finalization-check", finCheck);
  log(`GET /api/v1/encounters/${encounterId}/finalization-check`, finCheck);

  // ─── SUMMARY ───
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║  FINAL TEST RESULTS                                 ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  results.forEach((r, i) => {
    console.log(`  ${r.ok ? "✓" : "✗"} ${i + 1}. [${r.status}] ${r.name}`);
  });
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n  Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
}

run().catch(console.error);
