
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { ShieldCheck, Lock, Building2, CheckCircle2, ArrowRight, Wallet } from 'lucide-react';

interface Props {
  lang: Language;
  onConsentComplete: () => void;
}

const ConsentFlow: React.FC<Props> = ({ lang, onConsentComplete }) => {
  const t = translations[lang];
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleApprove = () => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          onConsentComplete();
      }, 1800);
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col justify-center px-4 animate-in fade-in zoom-in-95 duration-700">
      {step === 1 ? (
        <div className="nm-flat rounded-[40px] p-10 space-y-8 text-center">
          <div className="w-24 h-24 nm-inset rounded-[32px] flex items-center justify-center mx-auto text-[#EA580C]">
            <Wallet size={48} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">{t.connectBank}</h2>
            <p className="text-[#6B6B6B] text-sm leading-relaxed px-2">{t.consentMsg}</p>
          </div>
          
          <div className="space-y-4 pt-2">
             <div className="flex items-center gap-4 text-left p-5 nm-flat-sm rounded-2xl">
                <div className="w-10 h-10 nm-inset rounded-full flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-[#1C1C1C] uppercase tracking-tighter">RBI Regulated</p>
                    <p className="text-[#6B6B6B] mt-0.5">Secure FIP connections.</p>
                </div>
             </div>
             <div className="flex items-center gap-4 text-left p-5 nm-flat-sm rounded-2xl">
                <div className="w-10 h-10 nm-inset rounded-full flex items-center justify-center text-[#EA580C]">
                  <Lock size={20} />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-[#1C1C1C] uppercase tracking-tighter">Encrypted</p>
                    <p className="text-[#6B6B6B] mt-0.5">Read-only data protection.</p>
                </div>
             </div>
          </div>

          <button 
            disabled={loading}
            onClick={handleConnect}
            className="w-full nm-orange text-white py-5 rounded-full font-bold flex items-center justify-center gap-3 nm-orange-pressed transition-nm uppercase tracking-widest text-xs mt-4"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Connect Now <ArrowRight size={18} /></>}
          </button>
        </div>
      ) : (
        <div className="nm-flat rounded-[40px] p-10 space-y-8">
          <div className="flex items-center justify-between border-b border-[#F1F1F1] pb-6">
            <h2 className="font-bold text-[#1C1C1C] tracking-tight">AA Sandbox</h2>
            <span className="bg-[#EA580C]/10 text-[#EA580C] text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Active</span>
          </div>
          
          <div className="space-y-6">
            <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Access Request</p>
            <div className="flex items-center gap-4 nm-inset p-4 rounded-3xl">
                <div className="w-12 h-12 bg-[#1C1C1C] text-white flex items-center justify-center rounded-2xl font-bold shadow-lg">SBI</div>
                <div>
                    <p className="text-sm font-bold text-[#1C1C1C]">State Bank of India</p>
                    <p className="text-[10px] text-[#6B6B6B] font-medium tracking-tight">Account XXXX4321</p>
                </div>
            </div>

            <div className="nm-flat-sm p-6 rounded-3xl space-y-3 bg-[#F6F4EF]/30">
                <p className="text-[10px] font-bold text-[#1C1C1C] uppercase tracking-widest border-b border-[#F1F1F1] pb-2">Consent Details</p>
                <ul className="text-[11px] text-[#6B6B6B] space-y-2 font-medium">
                    <li className="flex justify-between"><span>Data Period</span> <span className="text-[#1C1C1C]">90 Days</span></li>
                    <li className="flex justify-between"><span>Frequency</span> <span className="text-[#1C1C1C]">One-time</span></li>
                    <li className="flex justify-between"><span>Purpose</span> <span className="text-[#1C1C1C]">Credit Score</span></li>
                </ul>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button className="flex-1 nm-flat-sm py-4 rounded-full font-bold text-[#6B6B6B] text-xs uppercase tracking-widest nm-pressed transition-nm">Deny</button>
            <button 
              disabled={loading}
              onClick={handleApprove}
              className="flex-[2] nm-orange text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 nm-orange-pressed transition-nm text-xs uppercase tracking-widest"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><CheckCircle2 size={18} /> Approve</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentFlow;
