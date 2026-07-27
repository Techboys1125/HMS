import { useState } from 'react'
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Save,
  RotateCcw,
  BarChart2,
  PieChart as PieChartIcon,
  Check,
  X,
  Sliders
} from 'lucide-react'

const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

export function NotificationCommunicationWorkspace() {
  void RB
  // Section 01: Channels
  const [channels, setChannels] = useState([
    { id: 'c1', name: 'In-App Notifications', desc: 'Real-time bell alerts & toast popups inside HMS workspace', enabled: true, isDefault: true, icon: Bell },
    { id: 'c2', name: 'Email Notifications', desc: 'HTML formatted transactional emails for appointments and billing alerts', enabled: true, isDefault: false, icon: Mail },
    { id: 'c3', name: 'SMS Notifications', desc: 'Instant SMS text messages via Twilio/SMS Gateway', enabled: true, isDefault: false, icon: MessageSquare },
    { id: 'c4', name: 'Push Notifications', desc: 'Mobile app push alerts to iOS/Android patient & doctor apps', enabled: true, isDefault: false, icon: Smartphone },
  ])

  // Section 02: Role-based preferences
  const rolesList = ['Hospital Admin', 'Doctor', 'Receptionist', 'Accountant', 'Nurse', 'Patient Portal']
  const [rolePreferences, setRolePreferences] = useState<Record<string, Record<string, boolean>>>({
    'Hospital Admin': { inApp: true, email: true, sms: true, push: true, critical: true, appointment: true, billing: true, system: true },
    Doctor: { inApp: true, email: true, sms: false, push: true, critical: true, appointment: true, billing: false, system: true },
    Receptionist: { inApp: true, email: false, sms: false, push: false, critical: true, appointment: true, billing: true, system: true },
    Accountant: { inApp: true, email: true, sms: false, push: false, critical: true, appointment: false, billing: true, system: true },
    Nurse: { inApp: true, email: false, sms: false, push: true, critical: true, appointment: true, billing: false, system: true },
    'Patient Portal': { inApp: true, email: true, sms: true, push: true, critical: true, appointment: true, billing: true, system: false },
  })

  const toggleRolePreference = (role: string, col: string) => {
    setRolePreferences(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [col]: !prev[role][col],
      },
    }))
  }

  // Section 03: Reminders
  const [reminderConfig, setReminderConfig] = useState({
    appointmentReminderTime: '24 Hours Before',
    billingReminderTime: '3 Days',
    followupReminderTime: '1 Week',
    enableAutoReminders: true,
  })

  // Section 04: Templates
  const [templates] = useState([
    { id: 't1', name: 'Appointment Confirmation', category: 'Appointment', channel: 'SMS & Email', status: 'Active', lastUpdated: 'Today, 09:00' },
    { id: 't2', name: 'Appointment Reminder', category: 'Appointment', channel: 'SMS & Push', status: 'Active', lastUpdated: 'Yesterday, 14:30' },
    { id: 't3', name: 'Consultation Completed', category: 'Clinical', channel: 'In-App & Email', status: 'Active', lastUpdated: '2 days ago' },
    { id: 't4', name: 'Prescription Ready', category: 'Pharmacy', channel: 'Push & SMS', status: 'Active', lastUpdated: '3 days ago' },
    { id: 't5', name: 'Invoice Generated', category: 'Billing', channel: 'Email & In-App', status: 'Active', lastUpdated: '1 week ago' },
    { id: 't6', name: 'Payment Received', category: 'Billing', channel: 'SMS & Email', status: 'Active', lastUpdated: '1 week ago' },
    { id: 't7', name: 'System Maintenance Alert', category: 'System', channel: 'In-App Banner', status: 'Active', lastUpdated: '2 weeks ago' },
    { id: 't8', name: 'Security Alert', category: 'Security', channel: 'Email & SMS', status: 'Active', lastUpdated: '1 month ago' },
  ])

  // Section 05: Communication Rules
  const [commRules, setCommRules] = useState({
    autoApptConfirmation: true,
    instantInvoiceAfterPay: true,
    prescriptionNotif: true,
    systemMaintenanceAlerts: true,
    criticalSecurityAlerts: true,
  })

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isTemplateEditMode, setIsTemplateEditMode] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [saveToast, setSaveToast] = useState<string | null>(null)

  const handleToggleChannel = (id: string, field: 'enabled' | 'isDefault') => {
    setChannels(prev =>
      prev.map(c => {
        if (c.id === id) {
          if (field === 'isDefault') {
            return { ...c, isDefault: true }
          }
          return { ...c, [field]: !c[field] }
        }
        if (field === 'isDefault') {
          return { ...c, isDefault: false }
        }
        return c
      })
    )
  }

  const handleSave = () => {
    setSaveToast('Notification & Communication preferences saved successfully!')
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
              Notification & Communication Configuration
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Configure system-wide notification delivery channels, communication preferences, reminder templates, and alert rules.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowPreviewModal(true)}
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
              <Eye size={14} /> Preview Notification
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
              <RotateCcw size={14} /> Reset
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
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Notification Channels</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={18} style={{ color: '#0D47A1' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              4 Active
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>In-App, Email, SMS, Push</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
                Operational
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Active Templates</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} style={{ color: '#009688' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              {templates.length} Templates
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>HTML & Text Standard</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#009688', background: '#E0F2F1', padding: '1px 6px', borderRadius: '4px' }}>
                Ready
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Reminder Rules</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sliders size={18} style={{ color: '#2E7D32' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              Auto Cron
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>24h & 3d Lead Time</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
                Automated
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Delivery Rate</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} style={{ color: '#B45309' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              99.8%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Success Delivery</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '4px' }}>
                Optimal
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 01: NOTIFICATION CHANNELS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} style={{ color: '#0D47A1' }} /> Section 01: Delivery Channels Configuration
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {channels.map(ch => {
              const IconC = ch.icon
              return (
                <div key={ch.id} style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px', opacity: ch.enabled ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconC size={18} style={{ color: '#0D47A1' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{ch.name}</div>
                        {ch.isDefault && <span style={{ fontSize: '10px', color: '#009688', fontWeight: 600 }}>Default Channel</span>}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ch.enabled}
                      onChange={() => handleToggleChannel(ch.id, 'enabled')}
                      style={{ accentColor: '#0D47A1', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 12px 0' }}>{ch.desc}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '8px', fontSize: '11px' }}>
                    <span style={{ color: '#64748B' }}>Set as Primary Channel</span>
                    <input
                      type="radio"
                      name="primaryChannel"
                      checked={ch.isDefault}
                      onChange={() => handleToggleChannel(ch.id, 'isDefault')}
                      style={{ accentColor: '#0D47A1', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* SECTION 02: ROLE-BASED NOTIFICATION PREFERENCES TABLE */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} style={{ color: '#009688' }} /> Section 02: Role-Based Delivery Preferences Matrix
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E5E7EB', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '10px 12px' }}>Role</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>In-App</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Email</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>SMS</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Push</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Critical Alerts</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Appt Alerts</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Billing Alerts</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>System Alerts</th>
                </tr>
              </thead>
              <tbody>
                {rolesList.map(role => {
                  const prefs = rolePreferences[role] || {}
                  return (
                    <tr key={role} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#111827' }}>{role}</td>
                      {['inApp', 'email', 'sms', 'push', 'critical', 'appointment', 'billing', 'system'].map(col => (
                        <td key={col} style={{ padding: '8px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={!!prefs[col]}
                            onChange={() => toggleRolePreference(role, col)}
                            style={{ accentColor: '#009688', width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 03: REMINDER CONFIGURATION */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} style={{ color: '#0D47A1' }} /> Section 03: Automated Lead Time Reminders
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Appointment Reminder Lead Time</label>
              <select
                value={reminderConfig.appointmentReminderTime}
                onChange={e => setReminderConfig(prev => ({ ...prev, appointmentReminderTime: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>24 Hours Before</option>
                <option>12 Hours Before</option>
                <option>6 Hours Before</option>
                <option>2 Hours Before</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Billing Due Reminder Lead Time</label>
              <select
                value={reminderConfig.billingReminderTime}
                onChange={e => setReminderConfig(prev => ({ ...prev, billingReminderTime: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>1 Day</option>
                <option>3 Days</option>
                <option>7 Days</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Clinical Follow-up Reminder Lead Time</label>
              <select
                value={reminderConfig.followupReminderTime}
                onChange={e => setReminderConfig(prev => ({ ...prev, followupReminderTime: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>1 Week</option>
                <option>2 Weeks</option>
                <option>1 Month</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Enable Automated Background Reminder Service</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Triggers cron job for sending automated SMS/Email reminders</div>
            </div>
            <input
              type="checkbox"
              checked={reminderConfig.enableAutoReminders}
              onChange={e => setReminderConfig(prev => ({ ...prev, enableAutoReminders: e.target.checked }))}
              style={{ accentColor: '#0D47A1', width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* SECTION 04: NOTIFICATION TEMPLATES DATA TABLE */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Master Communication Templates ({templates.length})
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Standard HTML / Text Specs</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>Name</th>
                  <th style={{ padding: '12px 16px' }}>Description</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Last Updated</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0D47A1' }}>
                      <div>{t.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Category: {t.category}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      Delivery Channel: <strong style={{ color: '#009688' }}>{t.channel}</strong>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: '#E8F5E9', color: '#2E7D32' }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '12px' }}>{t.lastUpdated}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedTemplate(t)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #0D47A1',
                          background: '#FFFFFF',
                          color: '#0D47A1',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 05: COMMUNICATION RULES */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} style={{ color: '#009688' }} /> Section 05: Automated Communication Triggers
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {[
              { label: 'Send Appointment Confirmation Automatically', sub: 'Triggers immediately upon booking confirmation', key: 'autoApptConfirmation' },
              { label: 'Send Invoice Immediately After Payment', sub: 'Dispatches PDF invoice receipt via email & SMS', key: 'instantInvoiceAfterPay' },
              { label: 'Send Prescription Notification', sub: 'Alerts patient as soon as doctor signs e-prescription', key: 'prescriptionNotif' },
              { label: 'Send System Maintenance Alerts', sub: 'Broadcasts scheduled downtime alerts to all staff', key: 'systemMaintenanceAlerts' },
              { label: 'Send Critical Security & Audit Alerts', sub: 'Dispatches emergency SMS alerts to Super Admin', key: 'criticalSecurityAlerts' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{item.sub}</div>
                </div>
                <input
                  type="checkbox"
                  checked={(commRules as any)[item.key]}
                  onChange={e => setCommRules(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ accentColor: '#009688', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 06: NOTIFICATION ANALYTICS CHARTS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: '#0D47A1' }} /> Delivery Channel Volume & Success Rate
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Pie Chart Mock */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PieChartIcon size={14} style={{ color: '#009688' }} /> Notifications Dispatched by Channel
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '120px' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'conic-gradient(#0D47A1 0% 50%, #009688 50% 80%, #F59E0B 80% 95%, #9C27B0 95% 100%)' }} />
                <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#0D47A1', fontWeight: 600 }}>■ SMS Alerts (50%)</span>
                  <span style={{ color: '#009688', fontWeight: 600 }}>■ Email (30%)</span>
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>■ In-App (15%)</span>
                  <span style={{ color: '#9C27B0', fontWeight: 600 }}>■ Mobile Push (5%)</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Mock */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Channel Delivery Success Rate</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { channel: 'In-App Bell', rate: 99.9, color: '#0D47A1' },
                  { channel: 'Email Notifications', rate: 99.5, color: '#009688' },
                  { channel: 'SMS Gateway', rate: 98.8, color: '#F59E0B' },
                  { channel: 'Mobile Push', rate: 97.4, color: '#EF4444' },
                ].map((c, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>{c.channel}</span>
                      <span style={{ fontWeight: 600 }}>{c.rate}% Delivered</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${c.rate}%`, height: '100%', background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 07: CONFIGURATION WORKFLOW PREVIEW */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} style={{ color: '#0D47A1' }} /> Section 07: Automated Communication Lifecycle Flow
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { step: '1. Appt Booked', sub: 'SMS & Email Sent' },
              { step: '2. 24h Reminder', sub: 'Push Alert' },
              { step: '3. Check-In', sub: 'Queue Token' },
              { step: '4. Consult Done', sub: 'Rx Ready Alert' },
              { step: '5. Invoice Created', sub: 'Email Receipt' },
              { step: '6. Payment Done', sub: 'Final Confirmation' },
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

      {/* ─── REUSABLE HMS RIGHT DRAWER FOR TEMPLATE DETAILS (VIEW & EDIT) ─── */}
      {selectedTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 100,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              width: '540px',
              height: '100%',
              boxSizing: 'border-box',
              boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            {/* DRAWER HEADER */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontFamily: PP, fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {selectedTemplate.name}
                  </h3>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: '#E8F5E9', color: '#2E7D32' }}>
                    {selectedTemplate.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Category: <strong>{selectedTemplate.category}</strong> • Channel: {selectedTemplate.channel}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsTemplateEditMode(!isTemplateEditMode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #009688',
                    background: isTemplateEditMode ? '#009688' : '#FFFFFF',
                    color: isTemplateEditMode ? '#FFFFFF' : '#009688',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Edit2 size={14} /> {isTemplateEditMode ? 'Cancel Edit' : 'Edit'}
                </button>
                <button onClick={() => { setSelectedTemplate(null); setIsTemplateEditMode(false) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', padding: '4px' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* DRAWER CONTENT */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Group 1: Template Information */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  General Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Template Name</label>
                    {isTemplateEditMode ? (
                      <input
                        type="text"
                        defaultValue={selectedTemplate.name}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#111827' }}>{selectedTemplate.name}</span>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Category</label>
                    {isTemplateEditMode ? (
                      <input
                        type="text"
                        defaultValue={selectedTemplate.category}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: '#009688' }}>{selectedTemplate.category}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Group 2: Operational Content Card */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  Configuration & Content Payload
                </h4>
                <div style={{ fontSize: '12px', marginBottom: '12px' }}>
                  <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Delivery Channel Scope</label>
                  {isTemplateEditMode ? (
                    <input
                      type="text"
                      defaultValue={selectedTemplate.channel}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 600, color: '#111827' }}>{selectedTemplate.channel}</span>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', color: '#64748B', fontSize: '11px', marginBottom: '2px' }}>Message Body Preview</label>
                  {isTemplateEditMode ? (
                    <textarea
                      rows={4}
                      defaultValue={`Dear {{patient_name}}, your appointment with {{doctor_name}} is confirmed for {{time}} at Room {{room}}.`}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  ) : (
                    <div style={{ fontSize: '12px', color: '#374151', background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', lineHeight: '1.5' }}>
                      Dear <strong>Sarah Mitchell</strong>, your OPD appointment with <strong>Dr. Arjun Mehta</strong> is scheduled for <strong>Tomorrow at 09:30 AM</strong>. Room: <strong>Suite 104</strong>.
                    </div>
                  )}
                </div>
              </div>

              {/* Group 3: Related Statistics */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <h4 style={{ fontFamily: PP, fontSize: '13px', fontWeight: 700, color: '#0D47A1', margin: '0 0 12px 0' }}>
                  Related Statistics
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Last Updated</span>
                    <span style={{ color: '#475569' }}>{selectedTemplate.lastUpdated}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Dispatch Success</span>
                    <span style={{ fontWeight: 700, color: '#2E7D32' }}>99.8% Rate</span>
                  </div>
                </div>
              </div>

            </div>

            {/* DRAWER STICKY FOOTER */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => { setSelectedTemplate(null); setIsTemplateEditMode(false) }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#64748B', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              {isTemplateEditMode && (
                <button
                  onClick={() => { setSelectedTemplate(null); setIsTemplateEditMode(false) }}
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(13,71,161,0.2)' }}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SAMPLE NOTIFICATION PREVIEW MODAL */}
      {showPreviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '550px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, margin: 0, color: '#111827' }}>
                Sample Notification Dispatch Preview
              </h3>
              <button onClick={() => setShowPreviewModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#0D47A1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>St. Jude HMS - Appointment Reminder</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>To: patient.mitchell@example.com</div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5', background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Dear Sarah Mitchell,</p>
                <p style={{ margin: '0 0 8px 0' }}>
                  This is an automated reminder that your OPD Cardiology appointment with <strong>Dr. Arjun Mehta</strong> is scheduled for <strong>Tomorrow at 09:30 AM</strong>.
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>
                  Token Number: <strong>OPD-102</strong> | Consultation Room: <strong>Suite 104</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowPreviewModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                Close Preview
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
