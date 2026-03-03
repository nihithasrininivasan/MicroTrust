
import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';
import { Phone, KeyRound, User, MapPin, Briefcase, Calendar, ShieldCheck, ArrowRight, Lock, CheckCircle2, Shield, AlertCircle } from 'lucide-react';

interface Props {
  lang: Language;
  onComplete: (details: Partial<UserProfile>) => void;
}

const OnboardingFlow: React.FC<Props> = ({ lang, onComplete }) => {
  const t = translations[lang];
  const [step, setStep] = useState<'landing' | 'login' | 'otp' | 'signup' | 'permissions'>('landing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState({
    name: '',
    age: '',
    address: '',
    category: 'Street Vendor' as any,
    customCategory: ''
  });

  const [permissions, setPermissions] = useState({
    bills: false,
    history: false
  });

  const handleNext = () => {
    setError(null);

    if (step === 'signup') {
      if (!details.name || !details.age || !details.address || (details.category === 'Other' && !details.customCategory)) {
        setError("All fields are required to proceed.");
        return;
      }
    }

    if (step === 'permissions') {
      if (!permissions.bills || !permissions.history) {
        setError("Please accept all access requests to build your score.");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step === 'landing') setStep('login');
      else if (step === 'login') setStep('otp');
      else if (step === 'otp') setStep('signup');
      else if (step === 'signup') setStep('permissions');
      else {
        const finalCategory = details.category === 'Other' ? details.customCategory : details.category;
        onComplete({ ...details, category: finalCategory, isConsentGiven: true });
      }
    }, 800);
  };

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
      <button onClick={handleNext} className="w-full nm-orange text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs nm-orange-pressed transition-nm flex items-center justify-center gap-3">
        {t.getStarted} <ArrowRight size={18} />
      </button>
    </div>
  );

  const renderLogin = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 nm-orange rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
          <Phone size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#1C1C1C]">{t.login}</h2>
        <p className="text-[#6B6B6B] text-sm">{t.phoneNumber}</p>
      </div>
      <div className="nm-inset p-4 rounded-2xl flex items-center gap-3">
        <span className="text-[#6B6B6B] font-bold">+91</span>
        <input 
          type="tel" 
          placeholder="99999 99999" 
          className="bg-transparent outline-none w-full font-bold text-[#1C1C1C]"
          maxLength={10}
        />
      </div>
      <button onClick={handleNext} disabled={loading} className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs nm-orange-pressed transition-nm">
        {loading ? "..." : "Request OTP"}
      </button>
    </div>
  );

  const renderOtp = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 nm-orange rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
          <KeyRound size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#1C1C1C]">{t.enterOtp}</h2>
        <p className="text-[#6B6B6B] text-sm">Sent to +91 ******4321</p>
      </div>
      <div className="flex justify-between gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="nm-inset w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-[#1C1C1C]">
            -
          </div>
        ))}
      </div>
      <button onClick={handleNext} disabled={loading} className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs nm-orange-pressed transition-nm">
        {loading ? "..." : t.verify}
      </button>
    </div>
  );

  const renderSignUp = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-[#1C1C1C]">{t.signUp}</h2>
        <p className="text-[#6B6B6B] text-xs">Essential details for your profile</p>
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
            onChange={e => setDetails({...details, name: e.target.value})}
            className="bg-transparent outline-none w-full text-sm font-medium"
          />
        </div>
        <div className="nm-inset p-3 rounded-xl flex items-center gap-3">
          <Calendar size={18} className="text-[#6B6B6B]" />
          <input 
            placeholder={t.age}
            type="number"
            value={details.age}
            onChange={e => setDetails({...details, age: e.target.value})}
            className="bg-transparent outline-none w-full text-sm font-medium"
          />
        </div>
        <div className="nm-inset p-3 rounded-xl flex items-center gap-3">
          <MapPin size={18} className="text-[#6B6B6B]" />
          <input 
            placeholder={t.address}
            value={details.address}
            onChange={e => setDetails({...details, address: e.target.value})}
            className="bg-transparent outline-none w-full text-sm font-medium"
          />
        </div>
        <div className="space-y-3">
          <div className="nm-inset p-3 rounded-xl flex items-center gap-3">
            <Briefcase size={18} className="text-[#6B6B6B]" />
            <select 
              className="bg-transparent outline-none w-full text-sm font-medium text-[#1C1C1C]"
              value={details.category}
              onChange={e => setDetails({...details, category: e.target.value as any})}
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
                onChange={e => setDetails({...details, customCategory: e.target.value})}
                className="bg-transparent outline-none w-full text-sm font-medium"
              />
            </div>
          )}
        </div>
      </div>
      <button onClick={handleNext} disabled={loading} className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs nm-orange-pressed transition-nm">
        {loading ? "..." : "Next Step"}
      </button>
    </div>
  );

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
            onClick={() => setPermissions(p => ({...p, bills: !p.bills}))}
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
            onClick={() => setPermissions(p => ({...p, history: !p.history}))}
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
        onClick={handleNext} 
        disabled={loading} 
        className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-nm flex items-center justify-center gap-2 ${
          permissions.bills && permissions.history 
          ? 'nm-orange text-white nm-orange-pressed' 
          : 'nm-flat text-[#6B6B6B] opacity-50 cursor-not-allowed'
        }`}
      >
        {loading ? "..." : <>{t.allowAccess} <ArrowRight size={16}/></>}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col justify-center h-full px-4 max-w-sm mx-auto">
      <div className="nm-flat rounded-[40px] p-10">
        {step === 'landing' && renderLanding()}
        {step === 'login' && renderLogin()}
        {step === 'otp' && renderOtp()}
        {step === 'signup' && renderSignUp()}
        {step === 'permissions' && renderPermissions()}
      </div>
    </div>
  );
};

export default OnboardingFlow;
