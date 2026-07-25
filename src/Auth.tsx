import { useState, useRef, useEffect } from 'react'
import {
  Eye, EyeOff, Mail, Lock, ArrowLeft, Check,
  Shield, AlertCircle, Home,
  Ban, Search, ChevronRight, Smartphone,
  RefreshCw, WifiOff
} from 'lucide-react'

export type AuthScreen =
  | 'login' | 'forgot' | 'otp' | 'reset' | 'success'
  | 'session-expired' | 'access-denied' | '404' | '500'

const RB = 'Roboto, system-ui, sans-serif'
const PP = 'Poppins, system-ui, sans-serif'

// ─── Left Branding Panel ───────────────────────────────────────────────────
function BrandingPanel() {
  return (
    <div
      className="hidden lg:flex flex-col relative overflow-hidden"
      style={{
        width: '40%',
        minWidth: 380,
        background: 'linear-gradient(145deg, #083a84 0%, #0D47A1 45%, #1565C0 100%)',
      }}
    >
      {/* Cross pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hms-pat" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
            <rect x="19" y="7" width="6" height="30" rx="3" fill="white" fillOpacity="0.045" />
            <rect x="7" y="19" width="30" height="6" rx="3" fill="white" fillOpacity="0.045" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hms-pat)" />
      </svg>

      {/* Ambient glow circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 65%)' }} />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,150,136,0.18) 0%, transparent 65%)' }} />
      <div className="absolute top-1/2 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(77,182,172,0.1) 0%, transparent 65%)' }} />

      <div className="relative z-10 flex flex-col h-full px-10 py-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/20"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="8.5" y="1" width="5" height="20" rx="2.5" fill="white" />
              <rect x="1" y="8.5" width="20" height="5" rx="2.5" fill="white" />
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-none" style={{ fontFamily: PP }}>Safe Hands</div>
            <div className="text-xs font-medium mt-0.5" style={{ fontFamily: RB, color: 'rgba(255,255,255,0.55)' }}>
              Hospital &amp; Research Center
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center py-8">
          <HospitalIllustration />
        </div>

        {/* Tagline */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-2xl leading-snug mb-3" style={{ fontFamily: PP }}>
            Care You Can Trust,<br />Health We Protect
          </h2>
          <p className="text-sm leading-relaxed" style={{ fontFamily: RB, color: 'rgba(255,255,255,0.6)' }}>
            A comprehensive hospital management system built for modern healthcare teams. Efficient, secure, and patient-centric.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-3 mb-8">
          {[
            'Secure Patient Management',
            'Appointment Scheduling',
            'Billing &amp; Payments',
            'Clinical Workflows',
            'Analytics &amp; Reports',
          ].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(0,150,136,0.25)', border: '1px solid rgba(77,182,172,0.35)' }}>
                <Check size={10} strokeWidth={3} style={{ color: '#4DB6AC' }} />
              </div>
              <span className="text-sm" style={{ fontFamily: RB, color: 'rgba(255,255,255,0.72)' }}
                dangerouslySetInnerHTML={{ __html: f }} />
            </div>
          ))}
        </div>

        {/* Footer badges */}
        <div className="border-t pt-5 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <Shield size={13} style={{ color: '#4DB6AC' }} />
            <span className="text-xs" style={{ fontFamily: RB, color: 'rgba(255,255,255,0.5)' }}>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A] animate-pulse" />
            <span className="text-xs" style={{ fontFamily: RB, color: 'rgba(255,255,255,0.5)' }}>All Systems Operational</span>
          </div>
        </div>

        {/* Version */}
        <div className="mt-4 text-center">
          <span className="text-xs" style={{ fontFamily: RB, color: 'rgba(255,255,255,0.3)' }}>MediCore HMS v2.0.1</span>
        </div>
      </div>
    </div>
  )
}

function HospitalIllustration() {
  return (
    <svg viewBox="0 0 280 220" fill="none" className="w-full max-w-xs">
      {/* ECG trace */}
      <path d="M 10 160 L 50 160 L 62 130 L 74 190 L 86 110 L 98 160 L 270 160"
        stroke="white" strokeOpacity="0.12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Glow rings */}
      <circle cx="140" cy="105" r="80" fill="white" fillOpacity="0.03" />
      <circle cx="140" cy="105" r="58" fill="white" fillOpacity="0.04" />

      {/* Building base */}
      <rect x="72" y="95" width="136" height="95" rx="4" fill="white" fillOpacity="0.09" />
      <rect x="72" y="95" width="136" height="95" rx="4" stroke="white" strokeOpacity="0.18" strokeWidth="1" />

      {/* Building top bar */}
      <rect x="60" y="82" width="160" height="16" rx="4" fill="white" fillOpacity="0.13" />

      {/* Flag pole + flag */}
      <line x1="140" y1="82" x2="140" y2="52" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M140 52 L158 58 L140 64 Z" fill="white" fillOpacity="0.35" />

      {/* Medical cross */}
      <rect x="127" y="100" width="26" height="8" rx="3" fill="white" fillOpacity="0.45" />
      <rect x="133" y="94" width="14" height="20" rx="3" fill="white" fillOpacity="0.45" />

      {/* Windows — left column */}
      <rect x="84" y="112" width="20" height="18" rx="2" fill="white" fillOpacity="0.14" />
      <rect x="84" y="142" width="20" height="18" rx="2" fill="white" fillOpacity="0.14" />
      {/* Windows — right column */}
      <rect x="176" y="112" width="20" height="18" rx="2" fill="white" fillOpacity="0.14" />
      <rect x="176" y="142" width="20" height="18" rx="2" fill="white" fillOpacity="0.14" />

      {/* Door */}
      <rect x="127" y="158" width="26" height="32" rx="3" fill="white" fillOpacity="0.18" />

      {/* Ground */}
      <rect x="30" y="190" width="220" height="2" rx="1" fill="white" fillOpacity="0.08" />

      {/* Trees */}
      <ellipse cx="52" cy="178" rx="14" ry="10" fill="white" fillOpacity="0.07" />
      <line x1="52" y1="188" x2="52" y2="195" stroke="white" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="228" cy="178" rx="14" ry="10" fill="white" fillOpacity="0.07" />
      <line x1="228" y1="188" x2="228" y2="195" stroke="white" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />

      {/* Floating sparkles */}
      {([[42, 50], [238, 38], [252, 130], [28, 120]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <line x1="-4" y1="0" x2="4" y2="0" stroke="white" strokeOpacity="0.25" strokeWidth="1" strokeLinecap="round" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="white" strokeOpacity="0.25" strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}

      {/* Orbiting dots */}
      <circle cx="42" cy="105" r="3" fill="white" fillOpacity="0.12" />
      <circle cx="238" cy="105" r="3" fill="white" fillOpacity="0.12" />
    </svg>
  )
}

// ─── Shared Form Components ────────────────────────────────────────────────
function TextField({
  label, type = 'text', value, onChange, error, placeholder,
  Icon, rightElement, hint, autoFocus = false
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; Icon?: React.ElementType;
  rightElement?: React.ReactNode; hint?: string; autoFocus?: boolean
}) {
  const hasError = !!error
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#111827]" style={{ fontFamily: PP }}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${hasError ? 'text-[#EF4444]' : 'text-slate-400'}`} />
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full py-3 text-sm rounded-xl border outline-none transition-all ${Icon ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-11' : 'pr-4'} ${hasError
              ? 'border-[#EF4444] bg-red-50 text-red-900 placeholder-red-300 focus:border-[#EF4444] focus:ring-2 focus:ring-red-100'
              : 'border-[#E5E7EB] bg-white text-[#111827] placeholder-slate-400 focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50'
            }`}
          style={{ fontFamily: RB }}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {hasError && (
        <div className="flex items-center gap-1.5">
          <AlertCircle size={12} className="text-[#EF4444] shrink-0" />
          <span className="text-xs text-[#EF4444]" style={{ fontFamily: RB }}>{error}</span>
        </div>
      )}
      {hint && !hasError && (
        <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>{hint}</span>
      )}
    </div>
  )
}

function PrimaryBtn({ label, loading = false, disabled = false, onClick }: {
  label: string; loading?: boolean; disabled?: boolean; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all ${disabled || loading
          ? 'bg-slate-300 cursor-not-allowed'
          : 'bg-[#0D47A1] hover:bg-[#0c3d8a] active:scale-[0.98] shadow-sm'
        }`}
      style={{ fontFamily: PP, boxShadow: disabled || loading ? 'none' : '0 2px 12px rgba(13,71,161,0.25)' }}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {label}
    </button>
  )
}

function GhostBtn({ label, onClick, Icon }: { label: string; onClick?: () => void; Icon?: React.ElementType }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-[#0D47A1] font-medium hover:underline transition-colors"
      style={{ fontFamily: PP }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  )
}

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-2xl w-full border border-[#E5E7EB]"
      style={{ maxWidth: 448, padding: '40px', boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}
    >
      {children}
    </div>
  )
}

function CardLogo() {
  return (
    <div className="flex items-center gap-2.5 mb-8">
      <div className="w-9 h-9 rounded-xl bg-[#0D47A1] flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="7" y="1" width="4" height="16" rx="2" fill="white" />
          <rect x="1" y="7" width="16" height="4" rx="2" fill="white" />
        </svg>
      </div>
      <div>
        <div className="text-sm font-bold text-[#111827] leading-none" style={{ fontFamily: PP }}>Safe Hands Hospital</div>
        <div className="text-[10px] text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>Healthcare Management System</div>
      </div>
    </div>
  )
}

// ─── 01 Login ──────────────────────────────────────────────────────────────
const DEMO_EMAIL = 'admin@safehands.org'
const DEMO_PASSWORD = 'demo12'

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function LoginScreen({ onLogin, onForgot }: { onLogin: () => void; onForgot: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})

  const fillDemo = () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setErrors({})
  }

  const submit = () => {
    const e: typeof errors = {}
    if (!email) e.email = 'Email address is required'
    else if (!validateEmail(email)) e.email = 'Please enter a valid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (Object.keys(e).length) { setErrors(e); return }

    setLoading(true)
    setErrors({})
    setTimeout(() => {
      setLoading(false)
      if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        setErrors({ form: 'Incorrect email or password. Please use the demo credentials below.' })
        return
      }
      onLogin()
    }, 900)
  }

  return (
    <AuthCard>
      <CardLogo />
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#111827] leading-tight" style={{ fontFamily: PP }}>Welcome back</h1>
        <p className="text-sm text-[#64748B] mt-1" style={{ fontFamily: RB }}>Sign in to your account to continue</p>
      </div>

      {/* Demo credentials banner */}
      <button
        onClick={fillDemo}
        className="w-full mb-5 flex items-start gap-3 p-3.5 rounded-xl border border-dashed border-[#0D47A1]/40 bg-blue-50/60 hover:bg-blue-50 hover:border-[#0D47A1]/60 transition-all text-left group"
      >
        <div className="w-8 h-8 rounded-lg bg-[#0D47A1] flex items-center justify-center shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <rect x="7" y="1" width="4" height="16" rx="2" fill="white" />
            <rect x="1" y="7" width="16" height="4" rx="2" fill="white" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#0D47A1] uppercase tracking-wide" style={{ fontFamily: PP }}>Demo Credentials</span>
            <span className="text-[10px] bg-[#0D47A1] text-white px-1.5 py-0.5 rounded font-semibold" style={{ fontFamily: RB }}>Click to fill</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>
              <span className="text-[10px] text-[#64748B] block" style={{ fontFamily: RB }}>Email</span>
              <span className="font-mono text-xs font-semibold text-[#111827]">{DEMO_EMAIL}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block" style={{ fontFamily: RB }}>Password</span>
              <span className="font-mono text-xs font-semibold text-[#111827] tracking-widest">
                {showPw ? DEMO_PASSWORD : '••••••'}
              </span>
            </div>
          </div>
        </div>
        <ChevronRight size={14} className="text-[#0D47A1] shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {errors.form && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={15} className="text-[#EF4444] shrink-0 mt-0.5" />
          <span className="text-sm text-red-700" style={{ fontFamily: RB }}>{errors.form}</span>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="space-y-4">
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={v => { setEmail(v); setErrors(p => ({ ...p, email: undefined })) }}
            placeholder="admin@safehands.org"
            Icon={Mail}
            error={errors.email}
          />
          <TextField
            label="Password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={v => { setPassword(v); setErrors(p => ({ ...p, password: undefined })) }}
            placeholder="Enter your password"
            Icon={Lock}
            error={errors.password}
            rightElement={
              <button type="button" onClick={() => setShowPw(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between mt-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setRemember(v => !v)}
              className={`w-4 h-4 rounded flex items-center justify-center border transition-all cursor-pointer ${remember ? 'bg-[#0D47A1] border-[#0D47A1]' : 'border-gray-300'}`}
            >
              {remember && <Check size={10} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm text-[#64748B]" style={{ fontFamily: RB }}>Remember me</span>
          </label>
          <button type="button" onClick={onForgot} className="text-sm text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>
            Forgot password?
          </button>
        </div>

        <PrimaryBtn label={loading ? 'Signing in…' : 'Sign In'} loading={loading} onClick={submit} />
      </form>

      <div className="mt-5 flex items-center justify-center gap-2">
        <Shield size={12} className="text-[#009688]" />
        <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
          Secure login · All data encrypted in transit
        </span>
      </div>

      <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex items-center justify-center gap-4">
        <button className="text-xs text-[#64748B] hover:text-[#0D47A1] transition-colors" style={{ fontFamily: RB }}>Privacy Policy</button>
        <span className="text-slate-300">·</span>
        <button className="text-xs text-[#64748B] hover:text-[#0D47A1] transition-colors" style={{ fontFamily: RB }}>Terms &amp; Conditions</button>
        <span className="text-slate-300">·</span>
        <span className="text-xs text-slate-400" style={{ fontFamily: RB }}>v2.0.1</span>
      </div>
    </AuthCard>
  )
}

// ─── 02 Forgot Password ────────────────────────────────────────────────────
function ForgotScreen({ onBack, onNext }: { onBack: () => void; onNext: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoad] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = () => {
    if (!email) { setError('Email address is required'); return }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return }
    setError('')
    setLoad(true)
    setTimeout(() => { setLoad(false); setSent(true) }, 1000)
  }

  return (
    <AuthCard>
      <CardLogo />
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0D47A1] mb-6 transition-colors font-medium" style={{ fontFamily: RB }}>
        <ArrowLeft size={15} /> Back to Sign In
      </button>

      {!sent ? (
        <>
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Lock size={22} className="text-[#0D47A1]" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] leading-tight" style={{ fontFamily: PP }}>Forgot password?</h1>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed" style={{ fontFamily: RB }}>
              No worries. Enter your registered email address and we'll send a password reset link.
            </p>
          </div>
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={v => { setEmail(v); setError('') }}
            placeholder="doctor@safehands.org"
            Icon={Mail}
            error={error}
            autoFocus
          />
          <div className="mt-6 space-y-3">
            <PrimaryBtn label={loading ? 'Sending link…' : 'Send Reset Link'} loading={loading} onClick={submit} />
          </div>
          <div className="mt-5 flex items-start gap-2 p-3.5 bg-slate-50 rounded-xl border border-[#E5E7EB]">
            <Shield size={14} className="text-[#009688] shrink-0 mt-0.5" />
            <p className="text-xs text-[#64748B] leading-relaxed" style={{ fontFamily: RB }}>
              For security, reset links expire after 15 minutes. Contact your administrator if you don't receive an email.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <Check size={28} className="text-[#66BB6A]" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>Check your email</h2>
            <p className="text-sm text-[#64748B] leading-relaxed mb-1" style={{ fontFamily: RB }}>
              We've sent a reset link to
            </p>
            <span className="text-sm font-semibold text-[#0D47A1]" style={{ fontFamily: PP }}>{email}</span>
            <p className="text-xs text-[#64748B] mt-3 leading-relaxed" style={{ fontFamily: RB }}>
              Didn't receive it? Check your spam folder or{' '}
              <button onClick={() => setSent(false)} className="text-[#0D47A1] font-medium hover:underline">try again</button>.
            </p>
            <div className="mt-6">
              <button onClick={() => onNext(email)} className="w-full flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl border border-[#0D47A1] text-[#0D47A1] text-sm font-semibold hover:bg-blue-50 transition-colors" style={{ fontFamily: PP }}>
                Enter OTP <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </AuthCard>
  )
}

// ─── 03 OTP Verification ───────────────────────────────────────────────────
function OTPScreen({ email, onBack, onVerify }: { email: string; onBack: () => void; onVerify: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [loading, setLoad] = useState(false)
  const [error, setError] = useState('')
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer <= 0) return
    const t = setInterval(() => setTimer(v => v > 0 ? v - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [timer])

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const next = [...otp]
    next[i] = v.slice(-1)
    setOtp(next)
    setError('')
    if (v && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      refs.current[5]?.focus()
    }
    e.preventDefault()
  }

  const resend = () => { setOtp(['', '', '', '', '', '']); setTimer(30); setError(''); refs.current[0]?.focus() }

  const verify = () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter all 6 digits'); return }
    setLoad(true)
    setTimeout(() => {
      setLoad(false)
      if (code === '123456') { onVerify(); return }
      setError('Invalid OTP. Use 123456 for demo.')
    }, 1000)
  }

  const filled = otp.join('').length === 6

  return (
    <AuthCard>
      <CardLogo />
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0D47A1] mb-6 transition-colors font-medium" style={{ fontFamily: RB }}>
        <ArrowLeft size={15} /> Back
      </button>

      {/* Shield illustration */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <Smartphone size={32} className="text-[#0D47A1]" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#009688] flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
        </div>
      </div>

      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-[#111827] leading-tight mb-2" style={{ fontFamily: PP }}>Verify your identity</h1>
        <p className="text-sm text-[#64748B] leading-relaxed" style={{ fontFamily: RB }}>
          Enter the 6-digit code sent to<br />
          <span className="font-semibold text-[#111827]">{email || 'your email address'}</span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex gap-2.5 justify-center mb-3" onPaste={handlePaste}>
        {otp.map((v, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={v}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-11 h-13 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all ${error
                ? 'border-[#EF4444] bg-red-50 text-red-800'
                : v
                  ? 'border-[#0D47A1] bg-blue-50 text-[#0D47A1]'
                  : 'border-[#E5E7EB] bg-white text-[#111827] focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50'
              }`}
            style={{ fontFamily: PP, height: 52 }}
          />
        ))}
      </div>

      {error && (
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <AlertCircle size={13} className="text-[#EF4444]" />
          <span className="text-xs text-[#EF4444]" style={{ fontFamily: RB }}>{error}</span>
        </div>
      )}

      {/* Timer + Resend */}
      <div className="text-center mb-6">
        {timer > 0 ? (
          <p className="text-sm text-[#64748B]" style={{ fontFamily: RB }}>
            Resend code in{' '}
            <span className="font-mono font-semibold text-[#0D47A1]">00:{String(timer).padStart(2, '0')}</span>
          </p>
        ) : (
          <button onClick={resend} className="text-sm text-[#0D47A1] font-medium hover:underline" style={{ fontFamily: RB }}>
            Resend OTP
          </button>
        )}
      </div>

      <PrimaryBtn label={loading ? 'Verifying…' : 'Verify OTP'} loading={loading} disabled={!filled} onClick={verify} />

      <p className="text-center text-xs text-[#64748B] mt-4" style={{ fontFamily: RB }}>
        Tip: use <span className="font-mono font-semibold text-[#0D47A1]">123456</span> for demo
      </p>
    </AuthCard>
  )
}

// ─── 04 Reset Password ─────────────────────────────────────────────────────
const PW_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

const STRENGTH_CONFIG = [
  { label: 'Weak', color: '#EF4444' },
  { label: 'Weak', color: '#EF4444' },
  { label: 'Fair', color: '#F59E0B' },
  { label: 'Good', color: '#009688' },
  { label: 'Strong', color: '#66BB6A' },
]

function ResetScreen({ onSubmit }: { onSubmit: () => void }) {
  const [pw, setPw] = useState('')
  const [cpw, setCpw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [loading, setLoad] = useState(false)
  const [errors, setErrors] = useState<{ pw?: string; cpw?: string }>({})

  const score = PW_RULES.filter(r => r.test(pw)).length
  const config = STRENGTH_CONFIG[score]

  const submit = () => {
    const e: typeof errors = {}
    if (!pw) e.pw = 'New password is required'
    else if (score < 3) e.pw = 'Password is too weak'
    if (!cpw) e.cpw = 'Please confirm your password'
    else if (pw !== cpw) e.cpw = 'Passwords do not match'
    if (Object.keys(e).length) { setErrors(e); return }
    setLoad(true)
    setTimeout(() => { setLoad(false); onSubmit() }, 1200)
  }

  return (
    <AuthCard>
      <CardLogo />
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <Lock size={22} className="text-[#0D47A1]" />
        </div>
        <h1 className="text-2xl font-bold text-[#111827] leading-tight" style={{ fontFamily: PP }}>Create new password</h1>
        <p className="text-sm text-[#64748B] mt-2" style={{ fontFamily: RB }}>
          Your new password must be different from previous passwords.
        </p>
      </div>

      <div className="space-y-4">
        <TextField
          label="New Password"
          type={showPw ? 'text' : 'password'}
          value={pw}
          onChange={v => { setPw(v); setErrors(p => ({ ...p, pw: undefined })) }}
          placeholder="Create a strong password"
          Icon={Lock}
          error={errors.pw}
          rightElement={
            <button onClick={() => setShowPw(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Strength meter */}
        {pw.length > 0 && (
          <div>
            <div className="flex gap-1 mb-1.5">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="h-1 flex-1 rounded-full transition-all"
                  style={{ background: i < score ? config.color : '#E5E7EB' }} />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: config.color, fontFamily: PP }}>
                {config.label}
              </span>
              <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>{score}/4</span>
            </div>
          </div>
        )}

        {/* Rules */}
        <div className="space-y-1.5">
          {PW_RULES.map(r => {
            const passed = r.test(pw)
            return (
              <div key={r.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${passed ? 'bg-[#66BB6A]' : 'bg-gray-100'}`}>
                  {passed ? <Check size={9} className="text-white" strokeWidth={3} /> : <span className="w-1 h-1 rounded-full bg-gray-400" />}
                </div>
                <span className={`text-xs transition-colors ${passed ? 'text-[#66BB6A] font-medium' : 'text-[#64748B]'}`} style={{ fontFamily: RB }}>
                  {r.label}
                </span>
              </div>
            )
          })}
        </div>

        <TextField
          label="Confirm Password"
          type={showCpw ? 'text' : 'password'}
          value={cpw}
          onChange={v => { setCpw(v); setErrors(p => ({ ...p, cpw: undefined })) }}
          placeholder="Re-enter your password"
          Icon={Lock}
          error={errors.cpw}
          rightElement={
            <button onClick={() => setShowCpw(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
              {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
      </div>

      <div className="mt-6">
        <PrimaryBtn label={loading ? 'Resetting…' : 'Reset Password'} loading={loading} onClick={submit} />
      </div>
    </AuthCard>
  )
}

// ─── 05 Reset Success ──────────────────────────────────────────────────────
function SuccessScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <AuthCard>
      <CardLogo />
      <div className="text-center py-4">
        {/* Animated success ring */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg viewBox="0 0 96 96" className="w-24 h-24">
            <circle cx="48" cy="48" r="44" fill="#f0fdf4" stroke="#66BB6A" strokeWidth="2" />
            <circle cx="48" cy="48" r="36" fill="#dcfce7" />
            <path d="M 30 48 L 43 61 L 66 35" stroke="#66BB6A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>Password reset!</h1>
        <p className="text-sm text-[#64748B] leading-relaxed mb-2" style={{ fontFamily: RB }}>
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
        <div className="flex items-center justify-center gap-1.5 mb-8 mt-4">
          <Shield size={13} className="text-[#009688]" />
          <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Secure reset completed at {new Date().toLocaleTimeString()}</span>
        </div>
        <PrimaryBtn label="Go to Sign In" onClick={onLogin} />
      </div>
    </AuthCard>
  )
}

// ─── 06 Session Expired ────────────────────────────────────────────────────
function SessionExpiredScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <AuthCard>
      <CardLogo />
      <div className="text-center py-4">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg viewBox="0 0 96 96" className="w-24 h-24">
            <circle cx="48" cy="48" r="44" fill="#fef9ee" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="48" cy="48" r="36" fill="#fef3c7" />
            <circle cx="48" cy="48" r="16" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            <line x1="48" y1="36" x2="48" y2="48" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="48" y1="48" x2="55" y2="55" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 62 28 L 70 22 M 62 22 L 70 28" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>Session Expired</h1>
        <p className="text-sm text-[#64748B] leading-relaxed mb-5" style={{ fontFamily: RB }}>
          Your session has expired due to inactivity. For your security, you've been automatically signed out.
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-7 text-left">
          <div className="text-xs font-semibold text-amber-800 mb-2" style={{ fontFamily: PP }}>Why did this happen?</div>
          <ul className="space-y-1">
            {['No activity detected for 30 minutes', 'Security policy automatically signed you out', 'All unsaved changes may have been lost'].map(r => (
              <li key={r} className="flex items-start gap-2 text-xs text-amber-700" style={{ fontFamily: RB }}>
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <PrimaryBtn label="Sign In Again" onClick={onLogin} />
      </div>
    </AuthCard>
  )
}

// ─── 07 Access Denied ─────────────────────────────────────────────────────
function AccessDeniedScreen({ onBack, onContact }: { onBack: () => void; onContact: () => void }) {
  return (
    <AuthCard>
      <CardLogo />
      <div className="text-center py-4">
        <div className="w-24 h-24 mx-auto mb-6">
          <svg viewBox="0 0 96 96" className="w-24 h-24">
            <circle cx="48" cy="48" r="44" fill="#fff5f5" stroke="#EF4444" strokeWidth="2" />
            <circle cx="48" cy="48" r="36" fill="#fee2e2" />
            <path d="M 48 28 L 60 48 L 48 58 L 36 48 Z" fill="#EF4444" fillOpacity="0.15" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round" />
            <rect x="44" y="36" width="8" height="14" rx="2" fill="#EF4444" />
            <circle cx="48" cy="55" r="3" fill="#EF4444" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>Access Denied</h1>
        <p className="text-sm text-[#64748B] leading-relaxed mb-2" style={{ fontFamily: RB }}>
          You don't have permission to access this module. Your role may not include the required privileges.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full mb-7">
          <Ban size={12} className="text-[#EF4444]" />
          <span className="text-xs text-red-700 font-medium" style={{ fontFamily: RB }}>Insufficient permissions</span>
        </div>
        <div className="flex flex-col gap-3">
          <PrimaryBtn label="Go Back" onClick={onBack} />
          <button
            onClick={onContact}
            className="w-full flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
            style={{ fontFamily: PP }}
          >
            Contact Administrator
          </button>
        </div>
      </div>
    </AuthCard>
  )
}

// ─── 08 404 ────────────────────────────────────────────────────────────────
function NotFoundScreen({ onHome }: { onHome: () => void }) {
  return (
    <AuthCard>
      <CardLogo />
      <div className="text-center py-4">
        <div className="mb-6">
          <svg viewBox="0 0 160 100" className="w-48 mx-auto">
            {/* 404 text */}
            <text x="80" y="58" textAnchor="middle" fontSize="52" fontWeight="800"
              fill="#0D47A1" fillOpacity="0.08" fontFamily="Poppins, sans-serif">404</text>
            <text x="80" y="55" textAnchor="middle" fontSize="48" fontWeight="800"
              fill="#0D47A1" fillOpacity="0.12" fontFamily="Poppins, sans-serif">404</text>
            {/* Magnifying glass */}
            <circle cx="68" cy="44" r="18" fill="none" stroke="#0D47A1" strokeWidth="3" strokeOpacity="0.3" />
            <circle cx="68" cy="44" r="18" fill="#EFF6FF" />
            <line x1="81" y1="57" x2="96" y2="72" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.3" />
            <Search size={16} className="text-[#0D47A1]" style={{ transform: 'translate(60px, 36px)' }} />
            <text x="68" y="49" textAnchor="middle" fontSize="12" fill="#0D47A1" fillOpacity="0.6">?</text>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>Page not found</h1>
        <p className="text-sm text-[#64748B] leading-relaxed mb-7" style={{ fontFamily: RB }}>
          The page you're looking for doesn't exist or has been moved. Please check the URL or return to the home screen.
        </p>
        <PrimaryBtn label="Return to Home" onClick={onHome} />
        <div className="mt-4">
          <GhostBtn label="Contact Support" onClick={() => { }} />
        </div>
      </div>
    </AuthCard>
  )
}

// ─── 09 Server Error ───────────────────────────────────────────────────────
function ServerErrorScreen({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  const [retrying, setRetrying] = useState(false)
  const retry = () => {
    setRetrying(true)
    setTimeout(() => setRetrying(false), 2000)
    onRetry()
  }
  return (
    <AuthCard>
      <CardLogo />
      <div className="text-center py-4">
        <div className="mb-6">
          <svg viewBox="0 0 120 100" className="w-40 mx-auto">
            {/* Server stack */}
            <rect x="20" y="15" width="80" height="22" rx="4" fill="#EFF6FF" stroke="#0D47A1" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="34" cy="26" r="4" fill="#0D47A1" fillOpacity="0.2" />
            <rect x="45" y="22" width="30" height="3" rx="1.5" fill="#0D47A1" fillOpacity="0.15" />
            <rect x="20" y="44" width="80" height="22" rx="4" fill="#EFF6FF" stroke="#0D47A1" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="34" cy="55" r="4" fill="#0D47A1" fillOpacity="0.2" />
            <rect x="45" y="51" width="30" height="3" rx="1.5" fill="#0D47A1" fillOpacity="0.15" />
            {/* Warning icon */}
            <circle cx="90" cy="26" r="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="90" y="30" textAnchor="middle" fontSize="10" fill="#F59E0B" fontWeight="bold">!</text>
            {/* Lightning */}
            <path d="M 55 73 L 50 85 L 57 85 L 52 97 L 70 79 L 62 79 L 67 67 Z"
              fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2" style={{ fontFamily: PP }}>Server Error</h1>
        <p className="text-sm text-[#64748B] leading-relaxed mb-2" style={{ fontFamily: RB }}>
          Something went wrong on our end. Our team has been notified and is working to fix this.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full mb-7">
          <WifiOff size={12} className="text-[#F59E0B]" />
          <span className="text-xs text-amber-700 font-medium" style={{ fontFamily: RB }}>Error 500 · Internal Server Error</span>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={retry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all bg-[#0D47A1] hover:bg-[#0c3d8a]"
            style={{ fontFamily: PP, boxShadow: '0 2px 12px rgba(13,71,161,0.25)' }}
          >
            {retrying ? <RefreshCw size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            {retrying ? 'Retrying…' : 'Retry'}
          </button>
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
            style={{ fontFamily: PP }}
          >
            <Home size={14} /> Go Home
          </button>
        </div>
        <p className="text-xs text-[#64748B] mt-5" style={{ fontFamily: RB }}>
          Need help?{' '}
          <button className="text-[#0D47A1] font-medium hover:underline">Contact Support</button>
        </p>
      </div>
    </AuthCard>
  )
}

// ─── Demo Navigator ────────────────────────────────────────────────────────
const DEMO_SCREENS: { id: AuthScreen; label: string }[] = [
  { id: 'login', label: 'Login' },
  { id: 'forgot', label: 'Forgot PW' },
  { id: 'otp', label: 'OTP' },
  { id: 'reset', label: 'Reset PW' },
  { id: 'success', label: 'PW Success' },
  { id: 'session-expired', label: 'Expired' },
  { id: 'access-denied', label: 'Access Denied' },
  { id: '404', label: '404' },
  { id: '500', label: '500' },
]

function DemoNav({ current, onSelect }: { current: AuthScreen; onSelect: (s: AuthScreen) => void }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-white/90 border border-gray-200 rounded-2xl px-3 py-2 shadow-lg"
        style={{ backdropFilter: 'blur(8px)' }}>
        <span className="text-[10px] font-semibold text-slate-400 mr-1 uppercase tracking-wide" style={{ fontFamily: RB }}>Demo:</span>
        {DEMO_SCREENS.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${current === s.id
                ? 'bg-[#0D47A1] text-white'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            style={{ fontFamily: RB }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Auth Root ─────────────────────────────────────────────────────────────
export default function AuthApp({ onLogin }: { onLogin: () => void }) {
  const [screen, setScreen] = useState<AuthScreen>('login')
  const [email, setEmail] = useState('')

  const goTo = (s: AuthScreen) => setScreen(s)

  const renderScreen = () => {
    switch (screen) {
      case 'login': return <LoginScreen onLogin={onLogin} onForgot={() => goTo('forgot')} />
      case 'forgot': return <ForgotScreen onBack={() => goTo('login')} onNext={e => { setEmail(e); goTo('otp') }} />
      case 'otp': return <OTPScreen email={email} onBack={() => goTo('forgot')} onVerify={() => goTo('reset')} />
      case 'reset': return <ResetScreen onSubmit={() => goTo('success')} />
      case 'success': return <SuccessScreen onLogin={() => goTo('login')} />
      case 'session-expired': return <SessionExpiredScreen onLogin={() => goTo('login')} />
      case 'access-denied': return <AccessDeniedScreen onBack={() => goTo('login')} onContact={() => { }} />
      case '404': return <NotFoundScreen onHome={() => goTo('login')} />
      case '500': return <ServerErrorScreen onRetry={() => { }} onHome={() => goTo('login')} />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <BrandingPanel />

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <div className="w-full flex items-start justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
          <div className="w-full flex items-center justify-center">
            {renderScreen()}
          </div>
        </div>
      </div>

      <DemoNav current={screen} onSelect={setScreen} />
    </div>
  )
}
