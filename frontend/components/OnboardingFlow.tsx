
import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';
import { Phone, KeyRound, User, MapPin, Briefcase, Calendar, ShieldCheck, ArrowRight, Lock, CheckCircle2, Shield, AlertCircle, Mail, Loader2 } from 'lucide-react';

interface Props {
  lang: Language;
  onComplete: (details: Partial<UserProfile>) => void;
  onRegister?: (details: { name: string; email: string; password: string; phone: string; category: string }) => Promise<void>;
  onLogin?: (email: string, password: string) => Promise<void>;
}

const OnboardingFlow: React.FC<Props> = ({ lang, onComplete, onRegister, onLogin }) => {
  const t = translations[lang];
  const [step, setStep] = useState<'landing' | 'login' | 'email_login' | 'otp' | 'signup' | 'permissions'>('landing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Login fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  // Signup fields
  const [details, setDetails] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    address: '',
    category: 'Street Vendor' as any,
    customCategory: ''
  });

  const [permissions, setPermissions] = useState({
    bills: false,
    history: false
  });

  const handleSendOtp = () => {
    setError(null);
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    // Simulate OTP send
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    setError(null);
    if (!otp || otp.length < 4) {
      setError("Please enter the 4-digit OTP.");
      return;
    }
    // OTP verified — go to signup for new users, or try login for existing
    setStep('signup');
    setIsNewUser(true);
  };

  const handleSignupNext = () => {
    setError(null);
    if (!details.name) {
      setError("Name is required.");
      return;
    }
    if (!details.email) {
      setError("Email address is required for your account.");
      return;
    }
    if (!details.password || details.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStep('permissions');
  };

  const handleFinalSubmit = async () => {
    setError(null);
    if (!permissions.bills || !permissions.history) {
      setError("Please accept all access requests to build your score.");
      return;
    }

    setLoading(true);
    try {
      const finalCategory = details.category === 'Other' ? details.customCategory : details.category;

      if (onRegister) {
        await onRegister({
          name: details.name,
          email: details.email,
          password: details.password,
          phone: phone,
          category: finalCategory,
        });
      } else {
        onComplete({ ...details, phone, category: finalCategory, isConsentGiven: true });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Quick Login (for existing users on signup page) ───────────────────
  const handleQuickLogin = async () => {
    setError(null);
    if (!details.email || !details.password) {
      setError("Enter your email and password to log in.");
      return;
    }
    setLoading(true);
    try {
      if (onLogin) {
        await onLogin(details.email, details.password);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // STEP 1: Landing
  // ────────────────────────────────────────────────────────────────────────
  const renderLanding = () => (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 text-center py-8">
      <div className="flex flex-col items-center gap-6">
        <div className="w-24 h-24 nm-orange rounded-[32px] flex items-center justify-center shadow-xl">
          <Shield size={48} className="text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-[#1C1C1C]">MicroTrust</h1>
          <p className="text-[#EA580C] font-bold text-lg tracking-widest uppercase">{t.subtitle}</p>
        </div>
      </div>
      <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-[240px] mx-auto font-medium">
        Financial identities designed for the real builders of the economy.
      </p>

      <div className="space-y-4">
        <button onClick={() => setStep('login')} className="w-full nm-orange text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs nm-orange-pressed transition-nm flex items-center justify-center gap-3">
          Create New Account <ArrowRight size={18} />
        </button>
        <button onClick={() => setStep('email_login')} className="w-full nm-flat text-[#EA580C] py-5 rounded-full font-bold uppercase tracking-widest text-xs nm-pressed transition-nm flex items-center justify-center gap-3">
          Sign In
        </button>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // STEP 1.5: Email Login (Existing Users)
  // ────────────────────────────────────────────────────────────────────────
  const renderEmailLogin = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 nm-orange rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
          <User size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#1C1C1C]">Welcome Back</h2>
        <p className="text-[#6B6B6B] text-xs font-medium px-4">Sign in to your MicroTrust account</p>
      </div>

      {error && (
        <div className="nm-inset p-3 rounded-xl border border-red-200 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="nm-inset p-4 rounded-xl flex items-center gap-3">
          <Mail size={18} className="text-[#6B6B6B]" />
          <input
            placeholder="Email Address"
            type="email"
            value={details.email}
            onChange={e => setDetails({ ...details, email: e.target.value })}
            className="bg-transparent outline-none w-full text-sm font-bold tracking-wider"
          />
        </div>

        <div className="nm-inset p-4 rounded-xl flex items-center gap-3">
          <Lock size={18} className="text-[#6B6B6B]" />
          <input
            placeholder="Password"
            type="password"
            value={details.password}
            onChange={e => setDetails({ ...details, password: e.target.value })}
            className="bg-transparent outline-none w-full text-sm font-bold tracking-wider"
          />
        </div>
      </div>

      <button
        onClick={handleQuickLogin}
        disabled={loading || !details.email || !details.password}
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-nm flex items-center justify-center gap-2 ${details.email && details.password ? 'nm-orange text-white nm-orange-pressed' : 'nm-flat text-[#A0A0A0] cursor-not-allowed'
          }`}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Logging In...</> : <>Sign In <ArrowRight size={16} /></>}
      </button>

      <button onClick={() => { setError(null); setStep('landing'); }} className="w-full text-center text-[10px] text-[#6B6B6B] font-bold uppercase tracking-widest">
        ← Back
      </button>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // STEP 2: Phone Number Input
  // ────────────────────────────────────────────────────────────────────────
  const renderLogin = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 nm-orange rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
          <Phone size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#1C1C1C]">New Account</h2>
        <p className="text-[#6B6B6B] text-xs font-medium px-4">Enter your mobile number to get started</p>
      </div>

      {error && (
        <div className="nm-inset p-3 rounded-xl border border-red-200 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="nm-inset p-4 rounded-xl flex items-center gap-3">
          <span className="text-sm font-bold text-[#6B6B6B]">+91</span>
          <div className="w-[1px] h-6 bg-[#E0E0E0]"></div>
          <input
            placeholder={t.enterPhone}
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="bg-transparent outline-none w-full text-sm font-bold tracking-wider"
            maxLength={10}
          />
        </div>
        {phone.length === 10 && (
          <div className="flex items-center gap-2 px-2 animate-in fade-in">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase">Valid number detected</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSendOtp}
        disabled={phone.length < 10}
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-nm flex items-center justify-center gap-2 ${phone.length >= 10 ? 'nm-orange text-white nm-orange-pressed' : 'nm-flat text-[#A0A0A0] cursor-not-allowed'
          }`}
      >
        {t.sendOtp} <ArrowRight size={16} />
      </button>

      <button onClick={() => { setError(null); setStep('landing'); }} className="w-full text-center text-[10px] text-[#6B6B6B] font-bold uppercase tracking-widest">
        ← Back
      </button>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // STEP 3: OTP Verification
  // ────────────────────────────────────────────────────────────────────────
  const renderOtp = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 nm-orange rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
          <KeyRound size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#1C1C1C]">{t.verifyOtp}</h2>
        <p className="text-[#6B6B6B] text-xs font-medium px-4">
          OTP sent to +91 {phone.slice(0, 3)}***{phone.slice(7)}
        </p>
      </div>

      {error && (
        <div className="nm-inset p-3 rounded-xl border border-red-200 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={otp[i] || ''}
            className="w-14 h-14 nm-inset rounded-2xl text-center text-xl font-bold bg-transparent outline-none focus:ring-2 ring-[#EA580C]/20"
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              const newOtp = otp.split('');
              newOtp[i] = val;
              setOtp(newOtp.join(''));
              // Auto-focus next
              if (val && i < 3) {
                const next = e.target.nextElementSibling as HTMLInputElement;
                if (next) next.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !otp[i] && i > 0) {
                const prev = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                if (prev) prev.focus();
              }
            }}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-[10px] text-[#A0A0A0] font-medium">Use OTP: <span className="font-bold text-[#EA580C]">1234</span> for testing</p>
      </div>

      <button
        onClick={handleVerifyOtp}
        disabled={otp.length < 4}
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-nm flex items-center justify-center gap-2 ${otp.length >= 4 ? 'nm-orange text-white nm-orange-pressed' : 'nm-flat text-[#A0A0A0] cursor-not-allowed'
          }`}
      >
        {t.continue} <ArrowRight size={16} />
      </button>

      <button onClick={() => { setOtp(''); setStep('login'); }} className="w-full text-center text-[10px] text-[#6B6B6B] font-bold uppercase tracking-widest">
        ← Change Number
      </button>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // STEP 4: Signup Details
  // ────────────────────────────────────────────────────────────────────────
  const renderSignUp = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-[#1C1C1C]">{t.signUp}</h2>
        <p className="text-[#6B6B6B] text-xs">Complete your profile to build your trust score</p>
      </div>

      {error && (
        <div className="nm-inset p-3 rounded-xl border border-red-200 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="nm-inset p-3 rounded-xl flex items-center gap-3">
          <User size={18} className="text-[#6B6B6B]" />
          <input
            placeholder={t.name}
            value={details.name}
            onChange={e => setDetails({ ...details, name: e.target.value })}
            className="bg-transparent outline-none w-full text-sm font-medium"
          />
        </div>
        <div className="nm-inset p-3 rounded-xl flex items-center gap-3">
          <Mail size={18} className="text-[#6B6B6B]" />
          <input
            placeholder="Email Address"
            type="email"
            value={details.email}
            onChange={e => setDetails({ ...details, email: e.target.value })}
            className="bg-transparent outline-none w-full text-sm font-medium"
          />
        </div>
        <div className="nm-inset p-3 rounded-xl flex items-center gap-3">
          <Lock size={18} className="text-[#6B6B6B]" />
          <input
            placeholder="Create Password (min 6 chars)"
            type="password"
            value={details.password}
            onChange={e => setDetails({ ...details, password: e.target.value })}
            className="bg-transparent outline-none w-full text-sm font-medium"
          />
        </div>

        <div className="nm-inset p-3 rounded-xl flex items-center gap-3 opacity-60">
          <Phone size={18} className="text-[#6B6B6B]" />
          <span className="text-sm font-medium text-[#1C1C1C]">+91 {phone}</span>
          <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />
        </div>

        <div className="space-y-3">
          <div className="nm-inset p-3 rounded-xl flex items-center gap-3">
            <Briefcase size={18} className="text-[#6B6B6B]" />
            <select
              className="bg-transparent outline-none w-full text-sm font-medium text-[#1C1C1C]"
              value={details.category}
              onChange={e => setDetails({ ...details, category: e.target.value as any })}
            >
              <option value="Street Vendor">Street Vendor</option>
              <option value="Gig Worker">Gig Worker</option>
              <option value="Domestic Worker">Domestic Worker</option>
              <option value="Micro-Entrepreneur">Micro-Entrepreneur</option>
              <option value="Other">{t.other}</option>
            </select>
          </div>
          {details.category === 'Other' && (
            <div className="nm-inset p-3 rounded-xl animate-in fade-in zoom-in-95 duration-300">
              <input
                placeholder="Specify your occupation"
                value={details.customCategory}
                onChange={e => setDetails({ ...details, customCategory: e.target.value })}
                className="bg-transparent outline-none w-full text-sm font-medium"
              />
            </div>
          )}
        </div>
      </div>

      <button onClick={handleSignupNext} disabled={loading} className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs nm-orange-pressed transition-nm flex items-center justify-center gap-2">
        Next Step <ArrowRight size={16} />
      </button>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // STEP 5: Permissions / Consent
  // ────────────────────────────────────────────────────────────────────────
  const renderPermissions = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 nm-orange rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#1C1C1C]">{t.permissions}</h2>
        <p className="text-[#6B6B6B] text-sm leading-relaxed">{t.consentMsg}</p>
      </div>

      {error && (
        <div className="nm-inset p-3 rounded-xl border border-red-200 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="space-y-4">
        <label className="nm-flat-sm p-5 rounded-2xl flex items-center gap-4 cursor-pointer group transition-all hover:bg-[#EA580C]/5">
          <div
            onClick={() => setPermissions(p => ({ ...p, bills: !p.bills }))}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${permissions.bills ? 'bg-[#EA580C] text-white shadow-lg' : 'nm-inset'}`}
          >
            {permissions.bills && <CheckCircle2 size={16} />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#1C1C1C]">Bill Payments</p>
            <p className="text-[9px] text-[#6B6B6B] uppercase font-black tracking-widest mt-1">Mobile & Utility Sync</p>
          </div>
          <div className="w-10 h-10 nm-inset rounded-xl flex items-center justify-center text-[#EA580C]">
            <KeyRound size={18} />
          </div>
        </label>

        <label className="nm-flat-sm p-5 rounded-2xl flex items-center gap-4 cursor-pointer group transition-all hover:bg-[#EA580C]/5">
          <div
            onClick={() => setPermissions(p => ({ ...p, history: !p.history }))}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${permissions.history ? 'bg-[#EA580C] text-white shadow-lg' : 'nm-inset'}`}
          >
            {permissions.history && <CheckCircle2 size={16} />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#1C1C1C]">UPI Transaction History</p>
            <p className="text-[9px] text-[#6B6B6B] uppercase font-black tracking-widest mt-1">Financial Pattern Mapping</p>
          </div>
          <div className="w-10 h-10 nm-inset rounded-xl flex items-center justify-center text-[#EA580C]">
            <Phone size={18} />
          </div>
        </label>
      </div>

      <button
        onClick={handleFinalSubmit}
        disabled={loading}
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-nm flex items-center justify-center gap-2 ${permissions.bills && permissions.history
          ? 'nm-orange text-white nm-orange-pressed'
          : 'nm-flat text-[#6B6B6B] opacity-50 cursor-not-allowed'
          }`}
      >
        {loading ? <><Loader2 size={14} className="animate-spin" /> Creating Account...</> : <>{t.allowAccess} <ArrowRight size={16} /></>}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col justify-center h-full px-4 max-w-sm mx-auto">
      <div className="nm-flat rounded-[40px] p-10">
        {step === 'landing' && renderLanding()}
        {step === 'email_login' && renderEmailLogin()}
        {step === 'login' && renderLogin()}
        {step === 'otp' && renderOtp()}
        {step === 'signup' && renderSignUp()}
        {step === 'permissions' && renderPermissions()}
      </div>
    </div>
  );
};

export default OnboardingFlow;
