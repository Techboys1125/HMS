const API_BASE = "http://192.168.1.44:8081";

async function login(email, password) {
  const r = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  return d?.data?.accessToken;
}

async function api(token, method, url, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (token) opts.headers["Authorization"] = "Bearer " + token;
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(API_BASE + url, opts);
  const d = await r.json().catch(function() { return null; });
  return { status: r.status, ok: r.ok, data: d };
}

async function run() {
  var doctorToken = await login("thangam@gmail.com", "123456789");
  
  // Test PUT vitals with encounter 618
  console.log("=== Test PUT /encounters/618/vitals ===");
  var r1 = await api(doctorToken, "PUT", "/api/v1/encounters/618/vitals", {
    temperature: 98.6, bloodPressureSystolic: 120, bloodPressureDiastolic: 80,
    heartRate: 72, respiratoryRate: 16, oxygenSaturation: 98, weight: 70, height: 170,
  });
  console.log(JSON.stringify(r1, null, 2));

  // Test PUT clinical-notes with consultation 153
  console.log("\n=== Test PUT /consultations/153/clinical-notes ===");
  var r2 = await api(doctorToken, "PUT", "/api/v1/consultations/153/clinical-notes", {
    subjective: "Patient reports chest pain for 3 days",
    objective: "Vitals stable, chest tenderness on palpation",
    assessment: "Musculoskeletal chest pain",
    plan: "NSAIDs and follow-up in 1 week",
  });
  console.log(JSON.stringify(r2, null, 2));
}

run().catch(console.error);
