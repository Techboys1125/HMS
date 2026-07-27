import { useState } from 'react'
import {
  Lock,
  Key,
  ShieldCheck,
  Smartphone,
  Eye,
  Save,
  RotateCcw,
  AlertCircle,
  BarChart2,
  PieChart as PieChartIcon,
  Check,
  X,
  ShieldAlert,
  Shield
} from 'lucide-react'

const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

export function SecuritySettingsWorkspace() {
  void RB
  // Section 01: Authentication Settings
  const [authConfig, setAuthConfig] = useState({
    enable2FA: true,
    requireEmailVerification: true,
    requirePasswordChangeFirstLogin: true,
    allowMultipleDevices: true,
    allowRememberMe: false,
    enableCaptchaFailedLogins: true,
  })

  // Section 02: Password Policy
  const [passPolicy, setPassPolicy] = useState({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    expiryDays: '90 Days',
    historyCount: '5 Passwords',
  })

  // Section 03: Session Management
  const [sessionConfig, setSessionConfig] = useState({
    autoLogoutMinutes: '15 Minutes',
    timeoutWarning: true,
    allowConcurrent: false,
    maxConcurrentSessions: 1,
  })

  // Section 04: Login Protection
  const [loginProtection, setLoginProtection] = useState({
    maxFailedAttempts: 5,
    lockDuration: '30 Minutes',
    notifyAdminOnLock: true,
  })

  // Section 05: Access Restrictions
  const [accessRestrictions, setAccessRestrictions] = useState({
    restrictWorkingHours: false,
    restrictDepartment: true,
    restrictIpAddress: true,
    restrictExternalAccess: false,
    emergencyOverride: true,
  })

  // Section 06: Security Event Logs Data
  const [securityEvents] = useState([
    { id: 'e1', event: 'Failed Login Attempt', category: 'Authentication', severity: 'High', triggeredBy: 'Unknown IP (192.168.1.105)', datetime: 'Today, 18:22', status: 'Blocked' },
    { id: 'e2', event: 'Password Reset Request', category: 'Account Security', severity: 'Low', triggeredBy: 'Dr. Arjun Mehta', datetime: 'Today, 14:10', status: 'Completed' },
    { id: 'e3', event: 'Role Permission Modified', category: 'RBAC Policy', severity: 'Medium', triggeredBy: 'Super Admin', datetime: 'Yesterday, 16:45', status: 'Audited' },
    { id: 'e4', event: 'New Unrecognized Device Login', category: 'Authentication', severity: 'High', triggeredBy: 'Sarah Jenkins (Admin)', datetime: 'Yesterday, 11:30', status: '2FA Verified' },
    { id: 'e5', event: 'Account Lock Triggered', category: 'Protection', severity: 'Critical', triggeredBy: 'Nurse Practitioner #42', datetime: '2 days ago', status: 'Locked' },
    { id: 'e6', event: 'Security Policy Updated', category: 'Governance', severity: 'Medium', triggeredBy: 'Super Admin', datetime: '3 days ago', status: 'Active' },
  ])

  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [saveToast, setSaveToast] = useState<string | null>(null)

  const handleSave = () => {
    setSaveToast('Security Policies & Authentication Rules updated successfully!')
    setTimeout(() => setSaveToast(null), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px' }}>
      
      {/* MAIN CONTENT SECTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        
        {/* SUB-HEADER ACTION BAR */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <h2 style={{ fontFamily: PP, fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
              System Security & Access Controls
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Configure authentication, password policies, session management, account protection and system security rules.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {}}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#0D47A1',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ShieldAlert size={14} /> Security Audit
            </button>
            <button
              onClick={() => {}}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#64748B',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} /> Reset Policies
            </button>
            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#0D47A1',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(13,71,161,0.2)',
              }}
            >
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </div>

        {/* TOP KPI CARDS (4 CARDS) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Security Score</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} style={{ color: '#0D47A1' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#009688' }}>
              96 / 100
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>HIPAA Compliant</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
                Protected
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Password Policy</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={18} style={{ color: '#009688' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              Strict (12 Chars)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>90 Days Expiry</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#009688', background: '#E0F2F1', padding: '1px 6px', borderRadius: '4px' }}>
                Enforced
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Active Sessions</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={18} style={{ color: '#2E7D32' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              42 Active
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Auto 15m Timeout</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
                Monitored
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Failed Logins Today</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={18} style={{ color: '#B45309' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              3 Attempts
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Max Cap 5</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '4px' }}>
                Safe Limit
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 01: AUTHENTICATION SETTINGS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} style={{ color: '#0D47A1' }} /> Section 01: Authentication & Multi-Factor Security
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {[
              { label: 'Enable Two-Factor Authentication (2FA)', sub: 'Require SMS / Authenticator app OTP for all staff accounts', key: 'enable2FA' },
              { label: 'Require Official Email Verification', sub: 'Mandatory email token verification during user onboarding', key: 'requireEmailVerification' },
              { label: 'Require Password Change on First Login', sub: 'Forces staff to replace temporary admin passwords', key: 'requirePasswordChangeFirstLogin' },
              { label: 'Allow Multiple Concurrent Device Logins', sub: 'Permits single user session across mobile & desktop', key: 'allowMultipleDevices' },
              { label: 'Allow "Remember Me" Option', sub: 'Permits persistent browser login tokens for 14 days', key: 'allowRememberMe' },
              { label: 'Enable CAPTCHA After Failed Logins', sub: 'Triggers Google reCAPTCHA after 3 consecutive errors', key: 'enableCaptchaFailedLogins' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{item.sub}</div>
                </div>
                <input
                  type="checkbox"
                  checked={(authConfig as any)[item.key]}
                  onChange={e => setAuthConfig(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ accentColor: '#0D47A1', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 02: PASSWORD POLICY */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} style={{ color: '#009688' }} /> Section 02: Password Complexity & Expiry Rules
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Require Uppercase (A-Z)', key: 'requireUppercase' },
              { label: 'Require Lowercase (a-z)', key: 'requireLowercase' },
              { label: 'Require Number (0-9)', key: 'requireNumber' },
              { label: 'Require Symbol (!@#)', key: 'requireSpecialChar' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={(passPolicy as any)[item.key]}
                  onChange={e => setPassPolicy(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ accentColor: '#009688', marginBottom: '4px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#111827', display: 'block' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Minimum Password Length</label>
              <input
                type="number"
                value={passPolicy.minLength}
                onChange={e => setPassPolicy(prev => ({ ...prev, minLength: parseInt(e.target.value) || 8 }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password Expiry Duration</label>
              <select
                value={passPolicy.expiryDays}
                onChange={e => setPassPolicy(prev => ({ ...prev, expiryDays: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>30 Days</option>
                <option>60 Days</option>
                <option>90 Days</option>
                <option>180 Days</option>
                <option>Never</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password History Restriction</label>
              <select
                value={passPolicy.historyCount}
                onChange={e => setPassPolicy(prev => ({ ...prev, historyCount: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>Remember Last 3 Passwords</option>
                <option>Remember Last 5 Passwords</option>
                <option>Remember Last 10 Passwords</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 03: SESSION MANAGEMENT */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} style={{ color: '#0D47A1' }} /> Section 03: Session Timeout & Inactivity Rules
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Auto Logout After Inactivity</label>
              <select
                value={sessionConfig.autoLogoutMinutes}
                onChange={e => setSessionConfig(prev => ({ ...prev, autoLogoutMinutes: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>10 Minutes</option>
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>60 Minutes</option>
              </select>
            </div>

            <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'fit-content', marginTop: '18px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Session Timeout Warning</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Show 60s countdown toast before logout</div>
              </div>
              <input
                type="checkbox"
                checked={sessionConfig.timeoutWarning}
                onChange={e => setSessionConfig(prev => ({ ...prev, timeoutWarning: e.target.checked }))}
                style={{ accentColor: '#0D47A1', cursor: 'pointer' }}
              />
            </div>

            <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'fit-content', marginTop: '18px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Allow Concurrent Sessions</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Permit simultaneous login sessions</div>
              </div>
              <input
                type="checkbox"
                checked={sessionConfig.allowConcurrent}
                onChange={e => setSessionConfig(prev => ({ ...prev, allowConcurrent: e.target.checked }))}
                style={{ accentColor: '#0D47A1', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 04: LOGIN PROTECTION */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: '#EF4444' }} /> Section 04: Brute-Force & Lockout Protection
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Max Failed Login Attempts</label>
              <input
                type="number"
                value={loginProtection.maxFailedAttempts}
                onChange={e => setLoginProtection(prev => ({ ...prev, maxFailedAttempts: parseInt(e.target.value) || 3 }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Account Lock Duration</label>
              <select
                value={loginProtection.lockDuration}
                onChange={e => setLoginProtection(prev => ({ ...prev, lockDuration: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
                <option>24 Hours</option>
                <option>Manual Admin Unlock Only</option>
              </select>
            </div>

            <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'fit-content', marginTop: '18px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Notify Admin After Account Lock</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Send instant alert email to Super Admin</div>
              </div>
              <input
                type="checkbox"
                checked={loginProtection.notifyAdminOnLock}
                onChange={e => setLoginProtection(prev => ({ ...prev, notifyAdminOnLock: e.target.checked }))}
                style={{ accentColor: '#EF4444', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 05: ACCESS RESTRICTIONS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} style={{ color: '#009688' }} /> Section 05: Network & IP Access Restrictions
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Restrict Login by Working Hours', sub: 'Deny staff logins outside shift hours', key: 'restrictWorkingHours' },
              { label: 'Restrict Login by Department Node', sub: 'Allow access only from hospital IP subnet', key: 'restrictDepartment' },
              { label: 'Restrict Login by IP Whitelist', sub: 'Enforce static IP binding for admin consoles', key: 'restrictIpAddress' },
              { label: 'Restrict External Internet Access', sub: 'Block public web access to clinical EMR', key: 'restrictExternalAccess' },
              { label: 'Emergency Access Override', sub: 'Allow Chief Medical Officer emergency bypass', key: 'emergencyOverride' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{item.label}</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>{item.sub}</div>
                </div>
                <input
                  type="checkbox"
                  checked={(accessRestrictions as any)[item.key]}
                  onChange={e => setAccessRestrictions(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ accentColor: '#009688', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 06: SECURITY EVENT OVERVIEW DATA TABLE */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Recent Security Audit Events ({securityEvents.length})
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>SIEM Real-Time Stream</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>Event</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Severity</th>
                  <th style={{ padding: '12px 16px' }}>Triggered By</th>
                  <th style={{ padding: '12px 16px' }}>Date & Time</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {securityEvents.map(ev => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0D47A1' }}>{ev.event}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{ev.category}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: ev.severity === 'Critical' || ev.severity === 'High' ? '#FEE2E2' : '#FEF3C7', color: ev.severity === 'Critical' || ev.severity === 'High' ? '#DC2626' : '#B45309' }}>
                        {ev.severity}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 500 }}>{ev.triggeredBy}</td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '12px' }}>{ev.datetime}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: '#E8F5E9', color: '#2E7D32' }}>
                        {ev.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => setSelectedEvent(ev)} style={{ border: 'none', background: 'transparent', color: '#0D47A1', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 07: SECURITY ANALYTICS CHARTS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: '#0D47A1' }} /> Threat Analytics & Login Trends
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Donut Chart Mock */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PieChartIcon size={14} style={{ color: '#009688' }} /> Security Events by Category
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '120px' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'conic-gradient(#0D47A1 0% 50%, #009688 50% 75%, #F59E0B 75% 90%, #EF4444 90% 100%)' }} />
                <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#0D47A1', fontWeight: 600 }}>■ Auth Events (50%)</span>
                  <span style={{ color: '#009688', fontWeight: 600 }}>■ RBAC Changes (25%)</span>
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>■ Password Resets (15%)</span>
                  <span style={{ color: '#EF4444', fontWeight: 600 }}>■ Lockouts (10%)</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Mock */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Login Attempt Volume (Success vs Failed)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Successful Logins', count: 1482, color: '#009688' },
                  { label: '2FA Verification Success', count: 1420, color: '#0D47A1' },
                  { label: 'Failed Password Attempts', count: 14, color: '#F59E0B' },
                  { label: 'IP Lockouts Enforced', count: 2, color: '#EF4444' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>{item.label}</span>
                      <span style={{ fontWeight: 600 }}>{item.count} Events</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(item.count / 1500) * 100}%`, height: '100%', background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 08: CONFIGURATION WORKFLOW PREVIEW */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} style={{ color: '#0D47A1' }} /> Section 08: User Authentication Security Flow
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { step: '1. User Login', sub: 'Creds Check' },
              { step: '2. Authentication', sub: 'BCrypt Match' },
              { step: '3. 2FA Verification', sub: 'OTP Challenge' },
              { step: '4. Role Validation', sub: 'RBAC Policy' },
              { step: '5. Session Created', sub: '15m Auto Expire' },
              { step: '6. Dashboard Access', sub: 'Secure EMR' },
            ].map((st, i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: '100px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0D47A1', background: '#E3F2FD', padding: '6px 4px', borderRadius: '6px', marginBottom: '4px' }}>
                  {st.step}
                </div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>{st.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, margin: 0, color: '#111827' }}>
                Security Audit Log Details
              </h3>
              <button onClick={() => setSelectedEvent(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Event Name</span>
                <span style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#0D47A1' }}>{selectedEvent.event}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Triggered By / Source IP</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{selectedEvent.triggeredBy}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Category & Severity</span>
                <span style={{ fontWeight: 600, color: '#009688' }}>{selectedEvent.category} • {selectedEvent.severity}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Timestamp</span>
                <span style={{ color: '#475569' }}>{selectedEvent.datetime}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setSelectedEvent(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE TOAST */}
      {saveToast && (
        <div style={{ position: 'fixed', bottom: '80px', right: '24px', background: '#2E7D32', color: '#FFFFFF', padding: '12px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 90 }}>
          <Check size={16} /> {saveToast}
        </div>
      )}

    </div>
  )
}
