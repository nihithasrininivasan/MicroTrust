
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { translations } from '../translations';
import { User, Mail, MapPin, Briefcase, Calendar, ChevronRight, LogOut, Settings, ShieldPlus, CheckCircle2, ShieldCheck, X, Info, Phone } from 'lucide-react';

interface Props {
  user: UserProfile;
  lang: Language;
  onLogout?: () => void;
}

const ProfilePage: React.FC<Props> = ({ user, lang, onLogout }) => {
  const t = translations[lang];
  const [kycStatus, setKycStatus] = useState<'None' | 'Pending' | 'Verified'>(user.kycStatus || 'None');
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycStep, setKycStep] = useState(1);

  const startKyc = () => {
    setShowKycModal(true);
    setKycStep(1);
  };

  const handleVerify = () => {
    setKycStep(2);
    setTimeout(() => {
      setKycStatus('Verified');
      setKycStep(3);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      {/* KYC Modal */}
      {showKycModal && (
        <div className="fixed inset-0 z-[110] bg-black/20 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95">
          <div className="nm-flat rounded-[40px] p-8 space-y-6 w-full max-w-sm relative shadow-2xl">
            <button onClick={() => setShowKycModal(false)} className="absolute top-6 right-6 text-[#6B6B6B]">
              <X size={24} />
            </button>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 nm-orange rounded-2xl flex items-center justify-center mx-auto text-white">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-xl font-bold">{t.kycTitle}</h2>
            </div>

            {kycStep === 1 && (
              <div className="space-y-6">
                <p className="text-sm text-[#6B6B6B] text-center font-medium">Verify your identity to unlock premium lending rates and badges.</p>
                <div className="nm-inset p-4 rounded-2xl flex items-center gap-3">
                  <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-widest">Aadhaar</span>
                  <input placeholder="XXXX XXXX 4321" className="bg-transparent outline-none w-full text-sm font-bold" />
                </div>
                <button onClick={handleVerify} className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">{t.verifyNow}</button>
              </div>
            )}

            {kycStep === 2 && (
              <div className="py-8 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-widest">Verifying Identity...</p>
              </div>
            )}

            {kycStep === 3 && (
              <div className="space-y-6 animate-in zoom-in-95">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                  <p className="font-bold text-[#1C1C1C]">Verification Successful</p>
                </div>
                <p className="text-xs text-[#6B6B6B] text-center font-medium">Your profile now carries a "Verified Identity" Trust Signal.</p>
                <button onClick={() => setShowKycModal(false)} className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Header */}
      <section className="flex flex-col items-center pt-4">
        <div className="w-28 h-28 nm-flat rounded-[40px] p-2 flex items-center justify-center relative mb-4">
          <div className="w-full h-full bg-[#EA580C] rounded-[32px] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name ? user.name[0].toUpperCase() : '?'}
          </div>
          {kycStatus === 'Verified' && (
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-[#F6F4EF]">
              <CheckCircle2 size={20} />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">{user.name}</h2>
        <p className="text-[#6B6B6B] text-xs font-bold uppercase tracking-[0.2em] mt-1">{user.category}</p>
        {user.scoreRange && (
          <span className="text-[9px] mt-2 bg-[#EA580C]/10 text-[#EA580C] px-3 py-1 rounded-full font-black uppercase tracking-widest">
            {user.scoreRange} • Score {user.score}
          </span>
        )}
      </section>

      {/* KYC Status Card */}
      <section className="nm-flat rounded-[32px] p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 nm-inset rounded-2xl flex items-center justify-center ${kycStatus === 'Verified' ? 'text-emerald-500' : 'text-[#EA580C]'}`}>
            <ShieldPlus size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest">{t.kycStatus}</p>
            <p className="text-sm font-bold text-[#1C1C1C]">{kycStatus === 'Verified' ? 'Identity Verified' : 'Not Verified'}</p>
          </div>
        </div>
        {kycStatus !== 'Verified' && (
          <button onClick={startKyc} className="text-[10px] nm-orange text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest shadow-sm">Verify</button>
        )}
      </section>

      {/* Account Details Card */}
      <section className="nm-flat rounded-[32px] p-8 space-y-6">
        <h3 className="font-bold text-sm text-[#1C1C1C] uppercase tracking-widest border-b border-[#F1F1F1] pb-3">Account Details</h3>

        <div className="space-y-5">
          {user.email && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 nm-inset rounded-xl flex items-center justify-center text-[#6B6B6B]">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-tighter">Email</p>
                <p className="text-sm font-bold text-[#1C1C1C]">{user.email}</p>
              </div>
            </div>
          )}

          {user.phone && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 nm-inset rounded-xl flex items-center justify-center text-[#6B6B6B]">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-tighter">Phone</p>
                <p className="text-sm font-bold text-[#1C1C1C]">{user.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 nm-inset rounded-xl flex items-center justify-center text-[#6B6B6B]">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-tighter">{t.address}</p>
              <p className="text-sm font-bold text-[#1C1C1C]">{user.address || 'New Delhi, India'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 nm-inset rounded-xl flex items-center justify-center text-[#6B6B6B]">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-tighter">{t.occupation}</p>
              <p className="text-sm font-bold text-[#1C1C1C]">{user.category}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Policy Section */}
      <section className="nm-flat rounded-[32px] p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Info size={18} className="text-[#EA580C]" />
          <h3 className="font-bold text-sm text-[#1C1C1C] uppercase tracking-widest">{t.transparency}</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[
            { title: "No Chat Storage", desc: "We never read or store your personal messages." },
            { title: "No Data Scraping", desc: "No social media or contact list scraping." },
            { title: "Structured Only", desc: "Only verified relationship types impact your score." },
            { title: "User Control", desc: "You decide who to add and can remove them any time." }
          ].map((policy, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[10px] font-black text-[#1C1C1C] uppercase tracking-tight">{policy.title}</p>
              <p className="text-[9px] text-[#6B6B6B] leading-tight font-medium">{policy.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Settings Options */}
      <section className="space-y-4">
        <div className="nm-flat rounded-3xl p-2">
          <button className="w-full flex items-center justify-between p-4 rounded-2xl transition-nm hover:bg-[#EA580C]/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 nm-inset rounded-xl flex items-center justify-center text-[#EA580C]">
                <Mail size={18} />
              </div>
              <span className="text-sm font-bold text-[#1C1C1C]">Notification Settings</span>
            </div>
            <ChevronRight size={18} className="text-[#6B6B6B]" />
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full nm-flat-sm text-[#D66A5E] py-4 rounded-full font-bold flex items-center justify-center gap-3 text-xs uppercase tracking-widest nm-pressed transition-nm mt-4"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
