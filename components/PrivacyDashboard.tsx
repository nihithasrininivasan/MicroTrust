
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { ShieldCheck, Eye, Trash2, Clock, CheckCircle2, Info, Lock, EyeOff } from 'lucide-react';

interface Props {
  lang: Language;
}

const PrivacyDashboard: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);

  const logs = [
    { activity: 'Score Generation', timestamp: '2m ago', app: 'Reputation Engine' },
    { activity: 'Data Extraction', timestamp: '1h ago', app: 'Account Aggregator' },
    { activity: 'KYC Verified', timestamp: '3h ago', app: 'Identity Module' },
  ];

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      {/* Policy Hero */}
      <section className="nm-flat rounded-[32px] p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 nm-inset rounded-2xl flex items-center justify-center text-[#EA580C]">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1C1C1C] tracking-tight">{t.privacy}</h2>
            <p className="text-[10px] text-[#EA580C] font-bold uppercase tracking-[0.2em]">DPDP Act 2023 Compliant</p>
          </div>
        </div>
        
        <div className="space-y-4">
           <div className="flex gap-4 p-4 nm-inset rounded-2xl">
              <EyeOff size={20} className="text-[#EA580C] shrink-0" />
              <p className="text-[11px] text-[#1C1C1C] font-medium leading-relaxed">
                <strong>Zero Scraping Policy:</strong> We do not scrape contacts, SMS, or social media. Your identity is built only on data you explicitly share via verified channels.
              </p>
           </div>
           <div className="flex gap-4 p-4 nm-inset rounded-2xl">
              <Lock size={20} className="text-[#EA580C] shrink-0" />
              <p className="text-[11px] text-[#1C1C1C] font-medium leading-relaxed">
                <strong>Portable Identity:</strong> You own your trust score. It is portable across banks and fintechs on the MicroTrust network.
              </p>
           </div>
        </div>
      </section>

      {/* Access Logs */}
      <section className="nm-flat rounded-[32px] p-8 space-y-6">
        <h3 className="font-bold text-sm text-[#1C1C1C] flex items-center gap-3 tracking-tight">
            <Clock size={18} className="text-[#6B6B6B]" />
            Data Usage Ledger
        </h3>
        <div className="space-y-6">
          {logs.map((log, i) => (
            <div key={i} className="flex justify-between items-center group">
               <div className="flex gap-4">
                 <div className="w-1.5 h-1.5 bg-[#EA580C] rounded-full mt-1.5 shadow-[0_0_8px_rgba(234,88,12,0.5)]"></div>
                 <div className="text-xs">
                    <p className="font-bold text-[#1C1C1C] tracking-tight">{log.activity}</p>
                    <p className="text-[10px] text-[#6B6B6B] font-medium">{log.app}</p>
                 </div>
               </div>
               <span className="text-[10px] font-bold text-[#6B6B6B] tabular-nums">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Deletion Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2 text-[#D66A5E]">
          <Info size={16} />
          <h3 className="font-bold text-xs uppercase tracking-widest">Right to be Forgotten</h3>
        </div>
        
        <div className="nm-flat rounded-[32px] p-8 space-y-6 border border-[#D66A5E]/10">
          <p className="text-[#6B6B6B] text-xs leading-relaxed font-medium">
            Erasing your profile is permanent. All historical credit reputation and community verified signals will be lost.
          </p>
          
          {!showDeletionConfirm ? (
            <button 
              onClick={() => setShowDeletionConfirm(true)}
              className="w-full nm-flat-sm text-[#D66A5E] py-4 rounded-full font-bold flex items-center justify-center gap-3 text-xs uppercase tracking-widest transition-nm nm-pressed"
            >
              <Trash2 size={16} />
              {t.deleteData}
            </button>
          ) : (
            <div className="space-y-4 p-6 nm-inset rounded-3xl animate-in zoom-in-95 duration-300">
               <p className="text-xs font-bold text-[#D66A5E] text-center tracking-tight uppercase">Confirm Permanent Erasure</p>
               <div className="flex gap-4">
                  <button onClick={() => setShowDeletionConfirm(false)} className="flex-1 nm-flat-sm text-[#6B6B6B] font-bold text-[10px] uppercase tracking-widest py-3 rounded-2xl">Back</button>
                  <button onClick={() => setShowDeletionConfirm(false)} className="flex-1 bg-[#D66A5E] text-white font-bold text-[10px] uppercase tracking-widest py-3 rounded-2xl shadow-lg active:scale-95 transition-all">Erase All</button>
               </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PrivacyDashboard;
