const API_BASE = "http://192.168.1.44:8081";

let doctorToken = null;

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
  console.log(`  ${snippet.substring(0, 2000)}`);
}

const results = [];
function record(name, result) {
  results.push({ name, ok: result.ok, status: result.status });
}

async function run() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  DOCTOR PATIENTS API TEST SUITE                      ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  // ─── PHASE 1: AUTH ───
  console.log("═══ PHASE 1: AUTHENTICATION (Doctor) ═══");
  doctorToken = await login("thangam@gmail.com", "123456789");
  if (!doctorToken) {
    console.log("Cannot proceed. Exiting.");
    return;
  }
  console.log("  ✓ Doctor login successful");

  // ─── PHASE 2: GET USER PROFILE ───
  console.log("\n═══ PHASE 2: GET USER PROFILE ═══");
  const profile = await api(doctorToken, "GET", "/api/v1/auth/me");
  record("GET /api/v1/auth/me", profile);
  log("GET /api/v1/auth/me", profile);

  // ─── PHASE 3: GET DOCTOR PATIENTS ───
  console.log("\n═══ PHASE 3: GET DOCTOR PATIENTS ═══");

  // Test 3a: Get all patients (no params)
  console.log("\n─── 3a. GET /api/v1/doctor/patients (no params) ───");
  const patientsNoParams = await api(doctorToken, "GET", "/api/v1/doctor/patients");
  record("GET /api/v1/doctor/patients (no params)", patientsNoParams);
  log("GET /api/v1/doctor/patients (no params)", patientsNoParams);

  // Test 3b: Get patients with pagination
  console.log("\n─── 3b. GET /api/v1/doctor/patients?page=0&size=5 ───");
  const patientsPage = await api(doctorToken, "GET", "/api/v1/doctor/patients?page=0&size=5");
  record("GET /api/v1/doctor/patients?page=0&size=5", patientsPage);
  log("GET /api/v1/doctor/patients?page=0&size=5", patientsPage);

  // Test 3c: Get patients with search query
  console.log("\n─── 3c. GET /api/v1/doctor/patients?search=test ───");
  const patientsSearch = await api(doctorToken, "GET", "/api/v1/doctor/patients?search=test");
  record("GET /api/v1/doctor/patients?search=test", patientsSearch);
  log("GET /api/v1/doctor/patients?search=test", patientsSearch);

  // Test 3d: Get patients with different query param
  console.log("\n─── 3d. GET /api/v1/doctor/patients?query=MRN ───");
  const patientsQuery = await api(doctorToken, "GET", "/api/v1/doctor/patients?query=MRN");
  record("GET /api/v1/doctor/patients?query=MRN", patientsQuery);
  log("GET /api/v1/doctor/patients?query=MRN", patientsQuery);

  // ─── PHASE 4: COMPARE WITH GENERAL PATIENTS ENDPOINT ───
  console.log("\n═══ PHASE 4: COMPARE WITH GENERAL PATIENTS ENDPOINT ═══");
  const generalPatients = await api(doctorToken, "GET", "/api/v1/patients?page=0&size=5");
  record("GET /api/v1/patients?page=0&size=5 (general)", generalPatients);
  log("GET /api/v1/patients?page=0&size=5 (general)", generalPatients);

  // ─── PHASE 5: TEST WITHOUT AUTH ───
  console.log("\n═══ PHASE 5: TEST WITHOUT AUTHORIZATION ═══");
  const noAuth = await api(null, "GET", "/api/v1/doctor/patients");
  record("GET /api/v1/doctor/patients (no auth)", noAuth);
  log("GET /api/v1/doctor/patients (no auth)", noAuth);

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
