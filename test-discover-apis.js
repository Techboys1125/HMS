const API_BASE = "http://192.168.1.44:8081";

let authToken = null;
let encounterId = null;
let prescriptionId = null;

async function login(email, password) {
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    authToken = data?.data?.accessToken || data?.accessToken;
    console.log(`✓ Login successful for ${email}`);
    return true;
  }
  console.log(`✗ Login failed: ${data?.message}`);
  return false;
}

async function api(method, url, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (authToken) options.headers["Authorization"] = `Bearer ${authToken}`;
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${url}`, options);
  const data = await response.json().catch(() => null);
  return { status: response.status, ok: response.ok, data };
}

function log(label, result) {
  const icon = result.ok ? "✓" : "✗";
  console.log(`\n${icon} ${label} [${result.status}]`);
  console.log(`  ${JSON.stringify(result.data, null, 2).substring(0, 600)}`);
}

async function run() {
  console.log("=== Prescription API Test Suite ===");
  console.log("API Base: " + API_BASE + "\n");

  // 1. Login as doctor
  console.log("--- 1. Authentication ---");
  await login("thangam@gmail.com", "123456789");

  // 2. Get user profile
  console.log("\n--- 2. User Profile ---");
  const profile = await api("GET", "/api/v1/auth/me");
  log("GET /api/v1/auth/me", profile);

  // 3. Find appointment with encounter
  console.log("\n--- 3. Find Existing Encounter ---");
  const appts = await api("GET", "/api/v1/appointments?page=0&size=20");
  
  if (appts.ok && appts.data?.data?.content) {
    for (const apt of appts.data.data.content) {
      if (apt.encounterId) {
        encounterId = apt.encounterId;
        console.log(`  Found encounter ${encounterId} from appointment ${apt.id}`);
        break;
      }
    }
    if (!encounterId) {
      // Try first appointment with CHECKED_IN or similar status
      for (const apt of appts.data.data.content) {
        console.log(`  Apt ${apt.id}: status=${apt.status}, encounterId=${apt.encounterId || 'none'}`);
      }
    }
  }

  // 4. Try to create encounter from appointment
  console.log("\n--- 4. Create Encounter from Appointment ---");
  if (!encounterId) {
    const createEnc = await api("POST", "/api/v1/encounters", { appointmentId: 1289 });
    log("POST /api/v1/encounters { appointmentId: 1289 }", createEnc);
    
    if (createEnc.ok && createEnc.data) {
      encounterId = createEnc.data?.data?.encounterId || createEnc.data?.encounterId;
      console.log(`  → Created encounter ID: ${encounterId}`);
    }
  }

  if (!encounterId) {
    console.log("\n  ✗ No encounter available. Cannot test prescription flow.");
    return;
  }

  // 5. Create prescription for encounter
  console.log("\n--- 5. Create Prescription ---");
  const createRx = await api("POST", `/api/v1/encounters/${encounterId}/prescription`, {
    outcome: "MEDICATION_PRESCRIBED"
  });
  log(`POST /api/v1/encounters/${encounterId}/prescription`, createRx);
  
  if (createRx.ok && createRx.data) {
    const rxData = createRx.data?.data || createRx.data;
    prescriptionId = rxData?.id || rxData?.prescriptionId;
    console.log(`  → Created prescription ID: ${prescriptionId}`);
  }

  if (!prescriptionId) {
    console.log("\n  ✗ No prescription created. Cannot test remaining endpoints.");
    return;
  }

  // 6. Add medication to prescription
  console.log("\n--- 6. Add Medication ---");
  const addMed = await api("POST", `/api/v1/prescriptions/${prescriptionId}/medications`, {
    medicineName: "Paracetamol",
    strength: "500mg",
    form: "TABLET",
    route: "ORAL",
    doseValue: 1,
    doseUnit: "TABLET",
    frequencyCode: "TID",
    durationValue: 5,
    durationUnit: "DAY",
  });
  log(`POST /api/v1/prescriptions/${prescriptionId}/medications`, addMed);

  // 7. Save advice to prescription
  console.log("\n--- 7. Save Advice ---");
  const saveAdvice = await api("PUT", `/api/v1/prescriptions/${prescriptionId}/advice`, {
    generalAdvice: "Take rest for 5 days. Stay hydrated.",
    dietAdvice: "Light diet. Avoid spicy food.",
    precautions: "Avoid heavy physical activity.",
  });
  log(`PUT /api/v1/prescriptions/${prescriptionId}/advice`, saveAdvice);

  // 8. Validate prescription
  console.log("\n--- 8. Validate Prescription ---");
  const validate = await api("POST", `/api/v1/prescriptions/${prescriptionId}/validate`);
  log(`POST /api/v1/prescriptions/${prescriptionId}/validate`, validate);

  // 9. Finalize prescription
  console.log("\n--- 9. Finalize Prescription ---");
  const finalize = await api("POST", `/api/v1/prescriptions/${prescriptionId}/finalize`, {
    confirmation: true
  });
  log(`POST /api/v1/prescriptions/${prescriptionId}/finalize`, finalize);

  // 10. Finalization check on encounter
  console.log("\n--- 10. Encounter Finalization Check ---");
  const finCheck = await api("GET", `/api/v1/encounters/${encounterId}/finalization-check`);
  log(`GET /api/v1/encounters/${encounterId}/finalization-check`, finCheck);

  // 11. Read back prescription
  console.log("\n--- 11. Read Prescription Back ---");
  const readRx = await api("GET", `/api/v1/patient/prescriptions/${prescriptionId}`);
  log(`GET /api/v1/patient/prescriptions/${prescriptionId}`, readRx);
}

run().catch(console.error);
