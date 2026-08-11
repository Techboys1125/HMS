# ============================================================
# Report Module API Test Script
# Tests all 24 report APIs across 5 user roles
# ============================================================

$BASE_URL = "http://192.168.1.44:8081"
$RESULTS_DIR = "test-results"

if (!(Test-Path $RESULTS_DIR)) { New-Item -ItemType Directory -Path $RESULTS_DIR | Out-Null }

# ─── User Credentials ─────────────────────────────────────────
$USERS = @{
    "Receptionist" = @{ Email = "receptionist@gmail.com"; Password = "Reception@123" }
    "Nurse"        = @{ Email = "nurse@gmail.com";        Password = "Nurse@123" }
    "Patient"      = @{ Email = "sarkar@gmail.com";       Password = "123456789" }
    "Accountant"   = @{ Email = "accountant@gmail.com";   Password = "Accountant@123" }
    "Doctor"       = @{ Email = "sandeep@gmail.com";      Password = "123456789" }
}

# ─── Login Function ───────────────────────────────────────────
function Login($email, $password) {
    for ($i = 0; $i -lt 3; $i++) {
        $jsonPayload = "{`"email`":`"$email`",`"password`":`"$password`"}"
        try {
            $response = curl.exe -s -X POST "$BASE_URL/api/v1/auth/login" `
                -H "Content-Type: application/json" `
                -d $jsonPayload 2>$null
            $json = $response | ConvertFrom-Json
            if ($json.data.accessToken) {
                return $json.data.accessToken
            } elseif ($json.accessToken) {
                return $json.accessToken
            }
        } catch {}
        Start-Sleep -Milliseconds 1500
    }
    return $null
}

# ─── API Test Function ────────────────────────────────────────
function Test-Api($name, $method, $path, $token) {
    $headers = @()
    if ($token) { $headers += "-H"; $headers += "Authorization: Bearer $token" }
    $headers += "-H"; $headers += "Content-Type: application/json"

    $url = "$BASE_URL$path"
    $start = Get-Date
    try {
        if ($method -eq "GET") {
            $response = curl.exe -s -w "`n%{http_code}" -X GET $url @headers 2>$null
        } else {
            $response = curl.exe -s -w "`n%{http_code}" -X $method $url @headers 2>$null
        }
        $elapsed = ((Get-Date) - $start).TotalMilliseconds
        $lines = $response -split "`n"
        $httpCode = $lines[-1].Trim()
        $body = ($lines[0..($lines.Length-2)] -join "`n").Trim()

        $status = if ($httpCode -eq "200") { "PASS" } elseif ($httpCode -eq "401") { "401" } elseif ($httpCode -eq "403") { "403" } elseif ($httpCode -eq "404") { "404" } else { "FAIL" }
        $color = switch ($status) { "PASS" { "Green" } "401" { "Yellow" } "403" { "Yellow" } default { "Red" } }

        $result = [PSCustomObject]@{
            Name     = $name
            Method   = $method
            Path     = $path
            Status   = $httpCode
            Result   = $status
            Ms       = [math]::Round($elapsed)
            Body     = $body
        }
        Write-Host "  [$status] $httpCode $($name) ($([math]::Round($elapsed))ms)" -ForegroundColor $color
        return $result
    } catch {
        Write-Host "  [ERROR] $($name): $_" -ForegroundColor Red
        return [PSCustomObject]@{ Name=$name; Method=$method; Path=$path; Status="ERR"; Result="ERROR"; Ms=0; Body=$_.Exception.Message }
    }
}

# ─── All 24 Report APIs ──────────────────────────────────────
$REPORT_APIS = @(
    @{ Name="1. Doctor Performance Summary";           Method="GET"; Path="/api/v1/admin/reports/doctors/performance?fromDate=2026-08-01&toDate=2026-08-08&page=0&size=10" }
    @{ Name="2. Daily Appointments Report";             Method="GET"; Path="/api/v1/admin/reports/hospital/appointments/daily?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="3. Daily Appointments Detail";             Method="GET"; Path="/api/v1/admin/reports/hospital/appointments/daily/details?fromDate=2026-08-01&toDate=2026-08-08&page=0&size=10" }
    @{ Name="4. Collection Rate Report";                Method="GET"; Path="/api/v1/admin/reports/hospital/collection-rate?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="5. Hospital Dashboard";                    Method="GET"; Path="/api/v1/admin/reports/hospital/dashboard?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="6. Department Consultation Volume";        Method="GET"; Path="/api/v1/admin/reports/hospital/departments/consultation-volume?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="7. Doctor Performance (Hospital Alias)";  Method="GET"; Path="/api/v1/admin/reports/hospital/doctors/performance?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="8. Invoice Register Detail";               Method="GET"; Path="/api/v1/admin/reports/hospital/invoices?fromDate=2026-08-01&toDate=2026-08-08&page=0&size=10" }
    @{ Name="9. Invoice Summary Report";                Method="GET"; Path="/api/v1/admin/reports/hospital/invoices/summary?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="10. Hospital Operational Trend";           Method="GET"; Path="/api/v1/admin/reports/hospital/operational-trend?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="11. Patient Registration Report";          Method="GET"; Path="/api/v1/admin/reports/hospital/patient-registrations?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="12. Patient Registration Detail";          Method="GET"; Path="/api/v1/admin/reports/hospital/patient-registrations/details?fromDate=2026-08-01&toDate=2026-08-08&page=0&size=10" }
    @{ Name="13. Revenue vs Collection";                Method="GET"; Path="/api/v1/admin/reports/hospital/revenue-vs-collection?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="14. Daily Revenue Report";                 Method="GET"; Path="/api/v1/admin/reports/hospital/revenue/daily?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="15. Daily Revenue Detail";                 Method="GET"; Path="/api/v1/admin/reports/hospital/revenue/daily/details?fromDate=2026-08-01&toDate=2026-08-08&page=0&size=10" }
    @{ Name="16. Report Category Share";                Method="GET"; Path="/api/v1/admin/reports/usage/category-share" }
    @{ Name="17. Most Viewed Reports";                  Method="GET"; Path="/api/v1/admin/reports/usage/most-viewed" }
    @{ Name="18. Patient Age Demographics";             Method="GET"; Path="/api/v1/admin/reports/hospital/patients/age-demographics?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="19. Patient Dashboard";                    Method="GET"; Path="/api/v1/admin/reports/hospital/patients/dashboard?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="20. Department Patient Visits";            Method="GET"; Path="/api/v1/admin/reports/hospital/patients/department-visits?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="21. Doctor Patient Workload";              Method="GET"; Path="/api/v1/admin/reports/hospital/patients/doctor-workload?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="22. Gender Breakdown";                     Method="GET"; Path="/api/v1/admin/reports/hospital/patients/gender-breakdown?fromDate=2026-08-01&toDate=2026-08-08" }
    @{ Name="23. Patient Master Register";              Method="GET"; Path="/api/v1/admin/reports/hospital/patients/register?fromDate=2026-08-01&toDate=2026-08-08&page=0&size=10" }
    @{ Name="24. Patient Registration Trend";           Method="GET"; Path="/api/v1/admin/reports/hospital/patients/registration-trend?period=7D" }
)

# ─── Main Test Execution ──────────────────────────────────────
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Report Module API Test Suite" -ForegroundColor Cyan
Write-Host "  Server: $BASE_URL" -ForegroundColor Cyan
Write-Host "  APIs: $($REPORT_APIS.Count) endpoints" -ForegroundColor Cyan
Write-Host "  Roles: $($USERS.Keys.Count) user roles" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$allResults = @()
$summary = @{}

foreach ($role in $USERS.Keys) {
    $cred = $USERS[$role]
    Write-Host "--------------------------------------------------------" -ForegroundColor Magenta
    Write-Host "  ROLE: $role ($($cred.Email))" -ForegroundColor Magenta
    Write-Host "--------------------------------------------------------" -ForegroundColor Magenta

    # Login
    Write-Host "  Logging in..." -ForegroundColor Gray
    $token = Login $cred.Email $cred.Password

    if (-not $token) {
        Write-Host "  [SKIP] Login failed - cannot test APIs for this role" -ForegroundColor Yellow
        foreach ($api in $REPORT_APIS) {
            $allResults += [PSCustomObject]@{
                Role=$role; Name=$api.Name; Method=$api.Method; Path=$api.Path
                Status="SKIP"; Result="LOGIN_FAILED"; Ms=0; Body=""
            }
        }
        $summary[$role] = @{ Total=$REPORT_APIS.Count; Pass=0; Fail=0; Auth401=0; Auth403=0; NotFound=0; Skip=$REPORT_APIS.Count }
        continue
    }
    Write-Host "  [OK] Token acquired" -ForegroundColor Green

    # Test all APIs
    $pass = 0; $fail = 0; $auth401 = 0; $auth403 = 0; $notfound = 0
    foreach ($api in $REPORT_APIS) {
        $result = Test-Api $api.Name $api.Method $api.Path $token
        $result | Add-Member -NotePropertyName "Role" -NotePropertyValue $role -Force
        $allResults += $result

        switch ($result.Result) {
            "PASS"  { $pass++ }
            "401"   { $auth401++ }
            "403"   { $auth403++ }
            "404"   { $notfound++ }
            default { $fail++ }
        }
    }

    $summary[$role] = @{
        Total    = $REPORT_APIS.Count
        Pass     = $pass
        Fail     = $fail
        Auth401  = $auth401
        Auth403  = $auth403
        NotFound = $notfound
        Skip     = 0
    }

    Write-Host "  --- $role Summary: $pass PASS / $fail FAIL / $auth401 UNAUTH / $auth403 FORBIDDEN / $notfound NOT_FOUND ---" -ForegroundColor Cyan
    Write-Host ""
}

# ─── Final Summary ────────────────────────────────────────────
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  FINAL SUMMARY" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host ("  {0,-15} {1,6} {2,6} {3,6} {4,6} {5,6} {6,6}" -f "Role","Total","Pass","Fail","401","403","404") -ForegroundColor White
Write-Host ("  {0,-15} {1,6} {2,6} {3,6} {4,6} {5,6} {6,6}" -f "-----","-----","-----","-----","-----","-----","-----") -ForegroundColor Gray

foreach ($role in $summary.Keys) {
    $s = $summary[$role]
    $passColor = if ($s.Pass -eq $s.Total) { "Green" } elseif ($s.Pass -gt 0) { "Yellow" } else { "Red" }
    Write-Host ("  {0,-15}" -f $role) -NoNewline
    Write-Host (" {0,6}" -f $s.Total) -NoNewline -ForegroundColor White
    Write-Host (" {0,6}" -f $s.Pass) -NoNewline -ForegroundColor $passColor
    Write-Host (" {0,6}" -f $s.Fail) -NoNewline -ForegroundColor $(if($s.Fail -gt 0){"Red"}else{"Gray"})
    Write-Host (" {0,6}" -f $s.Auth401) -NoNewline -ForegroundColor $(if($s.Auth401 -gt 0){"Yellow"}else{"Gray"})
    Write-Host (" {0,6}" -f $s.Auth403) -NoNewline -ForegroundColor $(if($s.Auth403 -gt 0){"Yellow"}else{"Gray"})
    Write-Host (" {0,6}" -f $s.NotFound) -NoNewline -ForegroundColor $(if($s.NotFound -gt 0){"Red"}else{"Gray"})
    Write-Host ""
}

# Export results
$csvPath = "$RESULTS_DIR/report-api-test-results.csv"
$allResults | Select-Object Role, Name, Method, Path, Status, Result, Ms | Export-Csv -Path $csvPath -NoTypeInformation
Write-Host ""
Write-Host "Results exported to: $csvPath" -ForegroundColor Gray
Write-Host ""
