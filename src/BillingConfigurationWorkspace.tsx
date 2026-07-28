import { useState } from 'react'
import {
  CreditCard,
  Percent,
  Receipt,
  FileText,
  Save,
  RotateCcw,
  Eye,
  QrCode,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart2,
  Check,
  X
} from 'lucide-react'

const PP = "'Poppins', system-ui, sans-serif"
const RB = "'Roboto', system-ui, sans-serif"

export function BillingConfigurationWorkspace() {
  void RB
  // Section 01: Invoice Configuration
  const [invoiceConfig, setInvoiceConfig] = useState({
    prefix: 'INV-',
    startingNumber: 1001,
    autoGenerate: true,
    allowManual: false,
  })

  // Section 02: Tax Configuration
  const [taxConfig, setTaxConfig] = useState({
    enableTax: true,
    defaultPercentage: 18,
    taxName: 'GST (Goods & Services Tax)',
    applyTaxTo: 'All Services',
    showBreakdown: true,
  })

  // Section 03: Payment Methods Configuration
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'p1', name: 'Cash', enabled: true, isDefault: true, reqRef: false, icon: DollarSign },
    { id: 'p2', name: 'UPI / QR Code', enabled: true, isDefault: false, reqRef: true, icon: QrCode },
    { id: 'p3', name: 'Credit Card', enabled: true, isDefault: false, reqRef: true, icon: CreditCard },
    { id: 'p4', name: 'Debit Card', enabled: true, isDefault: false, reqRef: true, icon: CreditCard },
    { id: 'p5', name: 'Net Banking', enabled: true, isDefault: false, reqRef: true, icon: FileText },
    { id: 'p6', name: 'Health Insurance / TPA', enabled: true, isDefault: false, reqRef: true, icon: Receipt },
  ])

  // Section 04: Discount Configuration
  const [discountConfig, setDiscountConfig] = useState({
    allowDiscounts: true,
    maxDiscountPct: 20,
    approvalRequired: true,
    authorizedRoles: 'Hospital Admin & Chief Accountant',
  })

  // Section 05: Receipt & Print Configuration
  const [receiptConfig, setReceiptConfig] = useState({
    showLogo: true,
    showQrCode: true,
    showPaymentSummary: true,
    showTaxDetails: true,
    showTerms: true,
    footerNotes: 'Thank you for choosing St. Jude Hospital. Wishing you a speedy recovery! Payment once settled is subject to official refund policy.',
  })

  // Section 06: Billing Rules
  const [billingRules, setBillingRules] = useState({
    allowPartial: true,
    allowAdvance: true,
    allowRefunds: true,
    allowCancellation: true,
    gracePeriodDays: 7,
  })

  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [saveToast, setSaveToast] = useState<string | null>(null)

  const handleTogglePayment = (id: string, field: 'enabled' | 'isDefault' | 'reqRef') => {
    setPaymentMethods(prev =>
      prev.map(p => {
        if (p.id === id) {
          if (field === 'isDefault') {
            return { ...p, isDefault: true }
          }
          return { ...p, [field]: !p[field] }
        }
        if (field === 'isDefault') {
          return { ...p, isDefault: false }
        }
        return p
      })
    )
  }

  const handleSave = () => {
    setSaveToast('Billing & Financial Configuration saved successfully!')
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
              Billing & Financial Configuration
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Configure invoice numbering rules, payment channels, taxation, discounts, receipt templates, and financial policies.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowInvoiceModal(true)}
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
              <Eye size={14} /> Preview Invoice
            </button>
            <button
              onClick={() => { }}
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
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Invoice Series</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} style={{ color: '#0D47A1' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              {invoiceConfig.prefix}{invoiceConfig.startingNumber}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Auto-Incremental</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
                Active
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Payment Methods</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} style={{ color: '#009688' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              {paymentMethods.filter(p => p.enabled).length} Active
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Cash, UPI, Cards, TPA</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#009688', background: '#E0F2F1', padding: '1px 6px', borderRadius: '4px' }}>
                Enabled
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Tax Rules</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Percent size={18} style={{ color: '#2E7D32' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              {taxConfig.defaultPercentage}% GST
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>All Services</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#2E7D32', background: '#E8F5E9', padding: '1px 6px', borderRadius: '4px' }}>
                Configured
              </span>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Receipt Template</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Receipt size={18} style={{ color: '#B45309' }} />
              </div>
            </div>
            <div style={{ fontFamily: PP, fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              Standard
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>With QR & Tax</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '4px' }}>
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 01: INVOICE CONFIGURATION */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} style={{ color: '#0D47A1' }} /> Section 01: Invoice Series & Numbering Rules
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Invoice Prefix</label>
              <input
                type="text"
                value={invoiceConfig.prefix}
                onChange={e => setInvoiceConfig(prev => ({ ...prev, prefix: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Starting Invoice Number</label>
              <input
                type="number"
                value={invoiceConfig.startingNumber}
                onChange={e => setInvoiceConfig(prev => ({ ...prev, startingNumber: parseInt(e.target.value) || 1001 }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Live Format Preview</label>
              <div style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '13px', fontWeight: 700, color: '#0D47A1', boxSizing: 'border-box' }}>
                {invoiceConfig.prefix}{invoiceConfig.startingNumber}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Auto-Generate Invoice Number</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>System automatically increments number on bill creation</div>
              </div>
              <input
                type="checkbox"
                checked={invoiceConfig.autoGenerate}
                onChange={e => setInvoiceConfig(prev => ({ ...prev, autoGenerate: e.target.checked }))}
                style={{ accentColor: '#0D47A1', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Allow Manual Invoice Number Entry</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Permit authorized accountants to override invoice sequence</div>
              </div>
              <input
                type="checkbox"
                checked={invoiceConfig.allowManual}
                onChange={e => setInvoiceConfig(prev => ({ ...prev, allowManual: e.target.checked }))}
                style={{ accentColor: '#0D47A1', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 02: TAX CONFIGURATION */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Percent size={18} style={{ color: '#009688' }} /> Section 02: Tax & Compliance Settings
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Official Tax Label Name</label>
              <input
                type="text"
                value={taxConfig.taxName}
                onChange={e => setTaxConfig(prev => ({ ...prev, taxName: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Default Tax Percentage (%)</label>
              <input
                type="number"
                value={taxConfig.defaultPercentage}
                onChange={e => setTaxConfig(prev => ({ ...prev, defaultPercentage: parseFloat(e.target.value) || 0 }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Apply Tax To Scope</label>
              <select
                value={taxConfig.applyTaxTo}
                onChange={e => setTaxConfig(prev => ({ ...prev, applyTaxTo: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>All Services</option>
                <option>Consultation & OPD</option>
                <option>Registration & Badges</option>
                <option>Diagnostic & Lab Services</option>
                <option>Pharmacy Products</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Enable Automated Tax Calculation</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Apply tax rate automatically during invoice generation</div>
              </div>
              <input
                type="checkbox"
                checked={taxConfig.enableTax}
                onChange={e => setTaxConfig(prev => ({ ...prev, enableTax: e.target.checked }))}
                style={{ accentColor: '#009688', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Show Tax Breakdown on Receipt</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Display CGST/SGST itemized breakdown on invoice print</div>
              </div>
              <input
                type="checkbox"
                checked={taxConfig.showBreakdown}
                onChange={e => setTaxConfig(prev => ({ ...prev, showBreakdown: e.target.checked }))}
                style={{ accentColor: '#009688', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 03: PAYMENT METHODS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} style={{ color: '#0D47A1' }} /> Section 03: Payment Methods & Gateway Rules
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {paymentMethods.map(pm => {
              const IconC = pm.icon
              return (
                <div key={pm.id} style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px', opacity: pm.enabled ? 1 : 0.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconC size={18} style={{ color: '#0D47A1' }} />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{pm.name}</span>
                    </div>
                    {pm.isDefault && (
                      <span style={{ fontSize: '10px', fontWeight: 600, background: '#E3F2FD', color: '#0D47A1', padding: '2px 6px', borderRadius: '4px' }}>
                        Default
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Enable Payment Method</span>
                      <input
                        type="checkbox"
                        checked={pm.enabled}
                        onChange={() => handleTogglePayment(pm.id, 'enabled')}
                        style={{ accentColor: '#0D47A1', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Set as Default Option</span>
                      <input
                        type="radio"
                        name="defaultPayment"
                        checked={pm.isDefault}
                        onChange={() => handleTogglePayment(pm.id, 'isDefault')}
                        style={{ accentColor: '#0D47A1', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Txn Ref / Cheque No Req.</span>
                      <input
                        type="checkbox"
                        checked={pm.reqRef}
                        onChange={() => handleTogglePayment(pm.id, 'reqRef')}
                        disabled={!pm.enabled}
                        style={{ accentColor: '#0D47A1', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* SECTION 04: DISCOUNT CONFIGURATION */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Percent size={18} style={{ color: '#009688' }} /> Section 04: Concession & Discount Policies
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Maximum Concession Cap (%)</label>
              <input
                type="number"
                value={discountConfig.maxDiscountPct}
                onChange={e => setDiscountConfig(prev => ({ ...prev, maxDiscountPct: parseFloat(e.target.value) || 0 }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Authorized Approval Roles</label>
              <input
                type="text"
                value={discountConfig.authorizedRoles}
                onChange={e => setDiscountConfig(prev => ({ ...prev, authorizedRoles: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'fit-content', marginTop: '18px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Approval Workflow Required</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Require admin sign-off above 10% discount</div>
              </div>
              <input
                type="checkbox"
                checked={discountConfig.approvalRequired}
                onChange={e => setDiscountConfig(prev => ({ ...prev, approvalRequired: e.target.checked }))}
                style={{ accentColor: '#009688', width: '16px', height: '16px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 05: RECEIPT & PRINT CONFIGURATION */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={18} style={{ color: '#0D47A1' }} /> Section 05: Receipt Template Layout & Print Options
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Show Hospital Logo', key: 'showLogo' },
              { label: 'Show Payment QR', key: 'showQrCode' },
              { label: 'Show Payment Summary', key: 'showPaymentSummary' },
              { label: 'Show Tax Breakdown', key: 'showTaxDetails' },
              { label: 'Show Terms & Notes', key: 'showTerms' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={(receiptConfig as any)[item.key]}
                  onChange={e => setReceiptConfig(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ accentColor: '#0D47A1', marginBottom: '4px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#111827', display: 'block' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Official Receipt Footer Terms & Notes</label>
            <textarea
              rows={3}
              value={receiptConfig.footerNotes}
              onChange={e => setReceiptConfig(prev => ({ ...prev, footerNotes: e.target.value }))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '12px', boxSizing: 'border-box', fontFamily: RB }}
            />
          </div>
        </div>

        {/* SECTION 06: BILLING RULES */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} style={{ color: '#009688' }} /> Section 06: General Financial & Credit Rules
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Allow Partial Payments', key: 'allowPartial' },
              { label: 'Allow Advance Deposit', key: 'allowAdvance' },
              { label: 'Allow Refund Requests', key: 'allowRefunds' },
              { label: 'Allow Bill Cancellation', key: 'allowCancellation' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{item.label}</span>
                <input
                  type="checkbox"
                  checked={(billingRules as any)[item.key]}
                  onChange={e => setBillingRules(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ accentColor: '#009688', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>

          <div style={{ width: '50%' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Grace Period for Pending Payments (Days)</label>
            <input
              type="number"
              value={billingRules.gracePeriodDays}
              onChange={e => setBillingRules(prev => ({ ...prev, gracePeriodDays: parseInt(e.target.value) || 0 }))}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* SECTION 07: BILLING ANALYTICS CHARTS */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: '#0D47A1' }} /> Financial Revenue & Tax Analytics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Pie Chart Mock */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PieChartIcon size={14} style={{ color: '#009688' }} /> Invoices by Payment Method
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '120px' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'conic-gradient(#0D47A1 0% 45%, #009688 45% 75%, #F59E0B 75% 90%, #9C27B0 90% 100%)' }} />
                <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#0D47A1', fontWeight: 600 }}>■ UPI / Online (45%)</span>
                  <span style={{ color: '#009688', fontWeight: 600 }}>■ Cards (30%)</span>
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>■ Cash (15%)</span>
                  <span style={{ color: '#9C27B0', fontWeight: 600 }}>■ Insurance (10%)</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Mock */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Revenue Share by Service Type</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { service: 'OPD Consultation', share: 45, color: '#0D47A1' },
                  { service: 'Lab & Diagnostics', share: 30, color: '#009688' },
                  { service: 'Pharmacy Medicine', share: 15, color: '#F59E0B' },
                  { service: 'IPD Bed Charges', share: 10, color: '#EF4444' },
                ].map((s, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>{s.service}</span>
                      <span style={{ fontWeight: 600 }}>{s.share}% Share</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.share}%`, height: '100%', background: s.color }} />
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
            <Eye size={18} style={{ color: '#0D47A1' }} /> Section 08: Billing & Payment Processing Workflow
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { step: '1. Patient Reg', sub: 'ID Verification' },
              { step: '2. Consultation', sub: 'Service Entry' },
              { step: '3. Auto Invoice', sub: `${invoiceConfig.prefix}1001` },
              { step: '4. Collect Pay', sub: 'Cash/UPI/Card' },
              { step: '5. Print Receipt', sub: 'Tax & QR Included' },
              { step: '6. Settlement', sub: 'Ledger Closed' },
            ].map((st, i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: '110px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0D47A1', background: '#E3F2FD', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px' }}>
                  {st.step}
                </div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>{st.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SAMPLE INVOICE PREVIEW MODAL */}
      {showInvoiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: PP, fontSize: '16px', fontWeight: 700, margin: 0, color: '#111827' }}>
                Sample Official Invoice & Receipt Layout
              </h3>
              <button onClick={() => setShowInvoiceModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0D47A1', paddingBottom: '10px' }}>
                <div>
                  <div style={{ fontFamily: PP, fontSize: '16px', fontWeight: 800, color: '#0D47A1' }}>ST. JUDE GENERAL HOSPITAL</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>777 Healthcare Blvd, Medical District</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: PP, fontSize: '14px', fontWeight: 700, color: '#111827' }}>INVOICE #{invoiceConfig.prefix}{invoiceConfig.startingNumber}</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Date: 26 Jul 2026</div>
                </div>
              </div>

              <div style={{ margin: '14px 0', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', padding: '6px 0' }}>
                  <span>OPD Consultation Charge (Cardiology)</span>
                  <span style={{ fontWeight: 600 }}>$150.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', padding: '6px 0' }}>
                  <span>ECG Diagnostic Screening</span>
                  <span style={{ fontWeight: 600 }}>$50.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#64748B' }}>
                  <span>Subtotal</span>
                  <span>$200.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#009688', fontWeight: 600 }}>
                  <span>{taxConfig.taxName} ({taxConfig.defaultPercentage}%)</span>
                  <span>+$36.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #111827', fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                  <span>Total Amount Paid</span>
                  <span style={{ color: '#0D47A1' }}>$236.00</span>
                </div>
              </div>

              <div style={{ fontSize: '10px', color: '#64748B', fontStyle: 'italic', borderTop: '1px dashed #CBD5E1', paddingTop: '8px' }}>
                {receiptConfig.footerNotes}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowInvoiceModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0D47A1', color: '#FFFFFF', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
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
