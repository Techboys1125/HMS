import { useState } from 'react'
import {
  ChevronRight, ArrowLeft, Printer, FileText, Download, Activity,
  User, CheckCircle2, AlertTriangle, Info, Clock, Layers,
  Shield, Check, Building2, Mail, Phone, ExternalLink,
  Server, Database
} from 'lucide-react'
import type { AuditRecord, AuditCategory, AuditSeverity, AuditStatus } from './AuditLogsManagement'

// Typography Tokens
const PP = 'Poppins, sans-serif'
const RB = 'Roboto, sans-serif'

interface AuditLogDetailsWorkspaceProps {
  record: AuditRecord
  onBack: () => void
  onNavigateCategory?: (category: AuditCategory) => void
  onNavigateRelatedModule?: (module: string, recordId?: string) => void
}

export function AuditLogDetailsWorkspace({
  record,
  onBack,
  onNavigateCategory,
  onNavigateRelatedModule
}: AuditLogDetailsWorkspaceProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Helper Badge Renderers
  const renderSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Critical
          </span>
        )
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Warning
          </span>
        )
      case 'Success':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Success
          </span>
        )
      case 'Information':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Information
          </span>
        )
    }
  }

  const renderStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case 'Failed':
      case 'Blocked':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-200">
            {status}
          </span>
        )
      case 'Warning':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            {status}
          </span>
        )
      case 'Success':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {status}
          </span>
        )
    }
  }

  // Related Audit Logs Snapshot (10 Related Audit Records)
  const relatedAuditLogs = [
    { id: 'LOG-18964', time: '11:45:00 AM', module: 'Authentication', action: 'User Login Success', user: 'Dr. Arjun Mehta', severity: 'Success' as AuditSeverity, status: 'Success' as AuditStatus },
    { id: 'LOG-18963', time: '11:38:02 AM', module: 'Billing', action: 'Cancelled Invoice Deleted', user: 'Sarah Jenkins', severity: 'Critical' as AuditSeverity, status: 'Success' as AuditStatus },
    { id: 'LOG-18962', time: '11:30:45 AM', module: 'Patient Management', action: 'Patient Details Modified', user: 'Elena Rostova', severity: 'Information' as AuditSeverity, status: 'Success' as AuditStatus },
    { id: 'LOG-18961', time: '11:15:30 AM', module: 'Prescription', action: 'Prescription Issued', user: 'Dr. Priya Sharma', severity: 'Success' as AuditSeverity, status: 'Success' as AuditStatus },
    { id: 'LOG-18960', time: '11:02:18 AM', module: 'Authentication', action: 'Multiple Failed Login Attempts', user: 'admin_root', severity: 'Critical' as AuditSeverity, status: 'Failed' as AuditStatus },
    { id: 'LOG-18959', time: '10:55:40 AM', module: 'Reports', action: 'Automated Report Backup', user: 'System Automated Job', severity: 'Information' as AuditSeverity, status: 'Success' as AuditStatus },
    { id: 'LOG-18958', time: '10:48:12 AM', module: 'Appointments', action: 'Appointment Rescheduled', user: 'David Ross', severity: 'Information' as AuditSeverity, status: 'Success' as AuditStatus },
    { id: 'LOG-18957', time: '10:30:00 AM', module: 'Doctor Management', action: 'Doctor Consultation Fee Updated', user: 'Sarah Jenkins', severity: 'Warning' as AuditSeverity, status: 'Success' as AuditStatus },
    { id: 'LOG-18956', time: '10:15:22 AM', module: 'Consultation', action: 'OPD Consultation Closed', user: 'Dr. Arjun Mehta', severity: 'Success' as AuditSeverity, status: 'Success' as AuditStatus },
    { id: 'LOG-18955', time: '09:50:11 AM', module: 'Appointments', action: 'Draft Appointment Cancelled', user: 'Elena Rostova', severity: 'Warning' as AuditSeverity, status: 'Success' as AuditStatus }
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]" style={{ fontFamily: RB }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-gray-700 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* WORKSPACE HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="hover:text-gray-700 cursor-pointer" onClick={onBack}>Hospital</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="hover:text-gray-700 cursor-pointer" onClick={onBack}>Audit Logs</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-800">Audit Log Details</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                title="Back to Audit Logs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: PP }}>
                    Audit Log Details
                  </h1>
                  <span className="px-3 py-1 bg-blue-50 text-blue-900 font-mono font-bold rounded-lg border border-blue-200 text-xs">
                    {record.id}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Complete audit trail and event information for administrative verification.
                </p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Audit Logs
            </button>
            <button
              onClick={() => showToast('Printing audit log details...')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              Print
            </button>
            <button
              onClick={() => showToast('Exporting Audit Details PDF...')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-red-600" />
              Export PDF
            </button>
            <button
              onClick={() => showToast('Exporting JSON raw payload...')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm"
              style={{ backgroundColor: '#0D47A1' }}
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* WORKSPACE CONTENT LAYOUT: 70% SCROLLABLE WORKSPACE & 30% STICKY RIGHT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT 70% — SCROLLABLE CONTENT WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">

          {/* SECTION 1: AUDIT EVENT SUMMARY */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
                  Section 1: Audit Event Summary
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {renderSeverityBadge(record.severity)}
                {renderStatusBadge(record.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Audit ID</span>
                <span className="font-mono font-bold text-gray-900 text-xs mt-0.5 block">{record.id}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Event ID</span>
                <span className="font-mono font-bold text-blue-900 text-xs mt-0.5 block">EVT-{record.id.replace('LOG-', '')}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Category</span>
                <span className="font-semibold text-gray-800 text-xs mt-0.5 block">{record.category}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Module</span>
                <span className="font-bold text-blue-900 text-xs mt-0.5 block">{record.module}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Screen Name</span>
                <span className="font-medium text-gray-700 text-xs mt-0.5 block">{record.module} Workspace</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Timestamp</span>
                <span className="font-mono font-bold text-gray-900 text-xs mt-0.5 block">{record.timestamp}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Generated By</span>
                <span className="font-bold text-gray-900 text-xs mt-0.5 block">{record.user}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Department</span>
                <span className="font-medium text-gray-700 text-xs mt-0.5 block">{record.department}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">User Role</span>
                <span className="font-semibold text-gray-800 text-xs mt-0.5 block">{record.userRole}</span>
              </div>
            </div>

            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Action Performed</span>
              <div className="p-3 bg-blue-50 text-blue-950 font-bold rounded-xl border border-blue-100 text-sm">
                {record.action}
              </div>
            </div>

            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Full Event Description</span>
              <p className="p-3.5 bg-gray-50 text-gray-800 text-xs rounded-xl leading-relaxed border border-gray-200">
                {record.description}
              </p>
            </div>
          </div>

          {/* SECTION 2: USER INFORMATION */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-teal-700" />
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
                Section 2: User Information
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-gray-200">
              <div className="w-14 h-14 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-lg border-2 border-blue-200 shadow-sm">
                {record.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">{record.user}</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-semibold text-[11px]">
                    {record.userRole}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-600 pt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    {record.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {record.user.toLowerCase().replace(/\s+/g, '.')}@citygeneral.org
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    +1 (555) 019-2831
                  </span>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[11px] block">
                  Status: Active
                </span>
                <span className="text-[11px] text-gray-400 mt-1 block">Last Login: Today 09:12 AM</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: ACTIVITY INFORMATION */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Layers className="w-5 h-5 text-purple-700" />
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
                Section 3: Activity Information
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Action Performed</span>
                <span className="font-bold text-gray-900 text-xs mt-0.5 block">{record.action}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Module</span>
                <span className="font-bold text-blue-900 text-xs mt-0.5 block">{record.module}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Related Record ID</span>
                <span className="font-mono font-bold text-purple-700 text-xs mt-0.5 block">{record.recordId || record.id}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">IP Address</span>
                <span className="font-mono text-gray-700 text-xs mt-0.5 block">{record.ipAddress}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Device Type</span>
                <span className="font-medium text-gray-800 text-xs mt-0.5 block">{record.device}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Browser</span>
                <span className="font-medium text-gray-800 text-xs mt-0.5 block">{record.browser}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Auth Method</span>
                <span className="font-semibold text-emerald-700 text-xs mt-0.5 block">OAuth 2.0 + MFA</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Session ID</span>
                <span className="font-mono text-gray-600 text-[11px] mt-0.5 block truncate">SES-90218-AF892</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Network</span>
                <span className="font-medium text-gray-700 text-xs mt-0.5 block">Hospital Internal VLAN-10</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: AUDIT TIMELINE */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Clock className="w-5 h-5 text-indigo-700" />
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
                Section 4: Audit Timeline
              </h2>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {[
                { title: 'Event Generated', time: '11:45:00.000 AM', desc: `Audit trigger initialized for action: ${record.action}`, status: 'Completed' },
                { title: 'User Authenticated', time: '11:45:00.120 AM', desc: `Token validated for ${record.user} (${record.userRole})`, status: 'Completed' },
                { title: 'Screen Opened', time: '11:45:00.250 AM', desc: `User navigated to ${record.module} Workspace`, status: 'Completed' },
                { title: 'Action Executed', time: '11:45:00.410 AM', desc: record.description, status: 'Completed' },
                { title: 'Database Updated', time: '11:45:00.580 AM', desc: `Database transaction committed for record ${record.recordId || record.id}`, status: 'Completed' },
                { title: 'Audit Recorded', time: '11:45:00.720 AM', desc: `Immutable audit record ${record.id} written to vault log stream`, status: 'Completed' },
                { title: 'Notification Triggered', time: '11:45:00.850 AM', desc: 'Real-time websocket audit notification dispatched to Admin dashboard', status: 'Completed' }
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 text-xs">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">{step.title}</span>
                      <span className="font-mono text-gray-400 text-[11px]">{step.time}</span>
                    </div>
                    <p className="text-gray-600 text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: DATA COMPARISON (SHOW ONLY WHEN APPLICABLE: DATA CHANGES) */}
          {record.category === 'Data Changes' && record.fieldChanged && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Database className="w-5 h-5 text-teal-700" />
                <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
                  Section 5: Data Comparison (Field Modifications)
                </h2>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-700">
                  Modified Field: <span className="font-bold text-blue-900">{record.fieldChanged}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LEFT: Previous Value (Light Red) */}
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <span className="text-xs font-bold text-red-700 block mb-1">Previous Value (Before)</span>
                    <div className="font-mono text-xs text-red-900 font-bold bg-white p-3 rounded-lg border border-red-200">
                      {record.oldValue || 'N/A'}
                    </div>
                  </div>

                  {/* RIGHT: Updated Value (Light Green) */}
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-700 block mb-1">Updated Value (After)</span>
                    <div className="font-mono text-xs text-emerald-900 font-bold bg-white p-3 rounded-lg border border-emerald-200">
                      {record.newValue || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: RELATED RECORDS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <ExternalLink className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
                Section 6: Related Records
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Patient: P-10024 (Robert Chen)', type: 'Patient' },
                { label: 'Appointment: APT-8821', type: 'Appointment' },
                { label: 'Doctor: Dr. Arjun Mehta', type: 'Doctor' },
                { label: 'Consultation: CON-9041', type: 'Consultation' },
                { label: 'Invoice: INV-2026-0892', type: 'Invoice' },
                { label: 'Prescription: RX-49201', type: 'Prescription' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    showToast(`Navigating to ${chip.label}...`)
                    if (onNavigateRelatedModule) onNavigateRelatedModule(chip.type)
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-xs rounded-xl border border-blue-200 transition-colors"
                >
                  <span>{chip.label}</span>
                  <ExternalLink className="w-3 h-3 text-blue-600" />
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 7: TECHNICAL INFORMATION */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Server className="w-5 h-5 text-gray-700" />
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
                Section 7: Technical Information
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">IP Address</span>
                <span className="font-mono font-bold text-gray-900 text-xs mt-0.5 block">{record.ipAddress}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Operating System</span>
                <span className="font-medium text-gray-800 text-xs mt-0.5 block">Windows 11 Enterprise</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Device Type</span>
                <span className="font-medium text-gray-800 text-xs mt-0.5 block">{record.device}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">MAC Address</span>
                <span className="font-mono text-gray-600 text-xs mt-0.5 block">00:1A:2B:3C:4D:XX (Masked)</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Hospital Branch</span>
                <span className="font-semibold text-blue-900 text-xs mt-0.5 block">Main Campus (Building A)</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Session Duration</span>
                <span className="font-mono text-gray-700 text-xs mt-0.5 block">{record.sessionDuration || 'Active (2h 15m)'}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Login Method</span>
                <span className="font-semibold text-emerald-700 text-xs mt-0.5 block">SAML 2.0 Single Sign-On</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Timezone</span>
                <span className="font-mono text-gray-600 text-xs mt-0.5 block">UTC-05:00 (EST)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 30% — STICKY RIGHT INFORMATION PANEL */}
        <div className="lg:col-span-4 space-y-4 sticky top-6">
          
          {/* Card 1: Audit Summary */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Audit Summary
            </h4>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Audit ID</span>
                <span className="font-mono font-bold text-gray-900">{record.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold text-gray-800">{record.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Severity</span>
                <span>{renderSeverityBadge(record.severity)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <span>{renderStatusBadge(record.status)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Module</span>
                <span className="font-bold text-blue-900">{record.module}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Generated By</span>
                <span className="font-bold text-gray-900">{record.user}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Timestamp</span>
                <span className="font-mono text-gray-700">{record.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Risk Assessment */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Risk Assessment
            </h4>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={record.severity === 'Critical' ? '#EF4444' : '#66BB6A'}
                    strokeWidth="3"
                    strokeDasharray={record.severity === 'Critical' ? '30 100' : '95 100'}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xs font-bold text-gray-900">
                    {record.severity === 'Critical' ? 'High' : 'Low'}
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-gray-900">Risk Level: {record.severity === 'Critical' ? 'High' : 'Low'}</div>
                <div className="text-gray-600">Type: {record.action}</div>
                <div className="text-gray-600">Affected: {record.recordId || 'Module State'}</div>
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Valid
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Navigation */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2" style={{ fontFamily: PP }}>
              Quick Navigation
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={onBack}
                className="w-full text-left px-3 py-2 bg-blue-50 text-blue-900 font-semibold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-between"
              >
                <span>Back to Audit Logs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              {(
                [
                  'Login History',
                  'User Activities',
                  'Data Changes',
                  'Deleted Records',
                  'System Logs'
                ] as AuditCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (onNavigateCategory) onNavigateCategory(cat)
                    onBack()
                  }}
                  className="w-full text-left px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Card 4: Audit Integrity */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center justify-between" style={{ fontFamily: PP }}>
              <span>Audit Integrity</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                Verified
              </span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Hash Validation</span>
                <span className="font-mono text-emerald-700 font-bold">SHA-256 Valid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vault Signature</span>
                <span className="font-mono text-gray-700 text-[11px]">SIG-89012-OK</span>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-[11px] font-medium flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Record cryptographically sealed and verified tamper-evident.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM PANEL: RELATED AUDIT EVENTS */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: PP }}>
              Bottom Panel: Related Audit Events
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest 10 related audit records from the system log stream.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            10 Related Records
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Performed By</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-800">
              {relatedAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-3.5 font-mono text-gray-500">{log.time}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-700">
                      {log.module}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-blue-950">{log.action}</td>
                  <td className="p-3.5 font-bold text-gray-900">{log.user}</td>
                  <td className="p-3.5">{renderSeverityBadge(log.severity)}</td>
                  <td className="p-3.5">{renderStatusBadge(log.status)}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => showToast(`Opening audit record ${log.id}...`)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM ACTION BAR (STICKY FOOTER) */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 px-6 py-3 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Last Updated: Today 11:52 AM</span>
        </div>

        {/* Center */}
        <div className="text-xs font-semibold text-gray-700">
          Audit Record <span className="text-blue-900 font-bold">{record.id}</span> (1 of 18,964 Records)
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => showToast('Printing audit details workspace...')}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Print
          </button>
          <button
            onClick={() => showToast('Exporting Audit Details...')}
            className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm"
            style={{ backgroundColor: '#0D47A1' }}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
