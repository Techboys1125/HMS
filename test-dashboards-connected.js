const API_BASE = "http://192.168.1.44:8081";

const ROLES = [
  {
    name: "Receptionist",
    email: "receptionist@gmail.com",
    pass: "Reception@123",
    endpoints: ["/api/v1/reception/queue", "/api/v1/doctors", "/api/v1/appointments"]
  },
  {
    name: "Nurse",
    email: "nurse@gmail.com",
    pass: "Nurse@123",
    endpoints: ["/api/v1/appointments", "/api/v1/doctors"]
  },
  {
    name: "Patient",
    email: "sarkar@gmail.com",
    pass: "123456789",
    endpoints: ["/api/v1/appointments", "/api/v1/doctors"]
  },
  {
    name: "Accountant",
    email: "accountant@gmail.com",
    pass: "Accountant@123",
    endpoints: ["/api/v1/billing/dashboard", "/api/v1/billing"]
  },
  {
    name: "Doctor",
    email: "sandeep@gmail.com",
    pass: "123456789",
    endpoints: ["/api/v1/doctor/appointments", "/api/v1/doctors"]
  }
];

async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function login(email, password) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.data?.accessToken) {
        return data.data.accessToken;
      }
    } catch (e) {}
    await delay(3000);
  }
  return null;
}

async function api(token, url) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json().catch(() => null);
    const count = Array.isArray(data?.data?.content || data?.data)
      ? (data.data.content || data.data).length
      : 1;
    return { status: res.status, ok: res.ok, count };
  } catch (e) {
    return { status: 500, ok: false, count: 0 };
  }
}

async function run() {
  console.log("========================================================");
  console.log("  HMS ALL ROLE DASHBOARDS CONNECTIVITY TEST");
  console.log("  Server: " + API_BASE);
  console.log("========================================================\n");

  const results = [];

  for (let i = 0; i < ROLES.length; i++) {
    const role = ROLES[i];
    if (i > 0) {
      console.log(`[+] Waiting 18s for auth rate-limit window...`);
      await delay(18000);
    }

    console.log(`[+] Testing Role: ${role.name} (${role.email})...`);
    const token = await login(role.email, role.pass);

    if (!token) {
      console.log(`  └─ [FAIL] Authentication rate-limited or failed for ${role.name}`);
      results.push({ role: role.name, auth: "FAIL", status: "N/A" });
      continue;
    }

    console.log(`  └─ [OK] Authenticated successfully.`);
    let rolePassed = true;

    for (const ep of role.endpoints) {
      const res = await api(token, ep);
      const icon = res.ok ? "✓" : "x";
      console.log(`     ${icon} GET ${ep} -> [${res.status}] (Records: ${res.count})`);
      if (!res.ok) rolePassed = false;
    }

    results.push({ role: role.name, auth: "PASS", status: rolePassed ? "CONNECTED" : "PARTIAL" });
    console.log("");
  }

  console.log("========================================================");
  console.log("  SUMMARY DASHBOARD STATUS");
  console.log("========================================================");
  console.table(results);
}

run();
