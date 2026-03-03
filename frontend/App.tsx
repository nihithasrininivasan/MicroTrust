
import React, { useState } from 'react';
import { UserProfile, Language } from './types';
import { translations } from './translations';
import ScoreDashboard from './components/ScoreDashboard';
import OnboardingFlow from './components/OnboardingFlow';
import TrustNetwork from './components/TrustNetwork';
import PrivacyDashboard from './components/PrivacyDashboard';
import ProfilePage from './components/ProfilePage';
import LanguageSelector from './components/LanguageSelector';
import RewardsPage from './components/RewardsPage';
import { LayoutDashboard, Users, Shield, Award, User, Bell, X, CheckCircle } from 'lucide-react';

// Fix: Added missing communityScore property to comply with UserProfile type definition
const initialUser: UserProfile = {
  id: 'u-123',
  name: 'Sunil Kumar',
  category: 'Street Vendor',
  score: 685,
  communityScore: 45,
  isConsentGiven: false,
  history: [
    { date: 'Jan 2026', score: 620 },
    { date: 'Feb 2026', score: 645 },
    { date: 'Mar 2026', score: 685 },
  ],
  breakdown: {
    consistency: 78,
    billPayments: 92,
    stability: 65,
    trustNetwork: 45,
    digitalFootprint: 55,
  }
};

const mockNotifications = [
  { id: 1, type: 'endorsement', text: 'Ramesh Kirana endorsed your consistency.', time: '2h ago', icon: <Users size={14}/> },
  { id: 2, type: 'score', text: 'Score increased by +12 points today!', time: '1d ago', icon: <Award size={14}/> },
  { id: 3, type: 'system', text: 'Weekly report is now available.', time: '2d ago', icon: <Bell size={14}/> },
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'network' | 'privacy' | 'builder' | 'profile' | 'rewards'>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  const t = translations[lang];

  const handleOnboardingComplete = (details: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...details, isConsentGiven: true }));
  };

  const renderContent = () => {
    if (!user.isConsentGiven) {
      return <OnboardingFlow lang={lang} onComplete={handleOnboardingComplete} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <ScoreDashboard user={user} lang={lang} />;
      case 'network':
        return <TrustNetwork lang={lang} />;
      case 'privacy':
        return <PrivacyDashboard lang={lang} />;
      case 'profile':
        return <ProfilePage user={user} lang={lang} />;
      case 'rewards':
        return <RewardsPage user={user} lang={lang} onBack={() => setActiveTab('builder')} />;
      case 'builder':
        return (
          <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            {/* Main Score Builder Hero */}
            <section className="nm-flat rounded-[32px] p-8 text-center space-y-6">
              <div className="w-20 h-20 nm-orange rounded-[28px] flex items-center justify-center mx-auto text-white shadow-lg">
                <Award size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">{t.builder}</h2>
                <p className="text-[#6B6B6B] text-xs font-bold uppercase tracking-widest">Current Level: Silver</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest px-1">
                  <span>Silver</span>
                  <span>75% to Gold</span>
                </div>
                <div className="h-4 nm-inset rounded-full p-1 relative">
                  <div className="h-full bg-gradient-to-r from-[#EA580C] to-[#D97706] rounded-full shadow-inner transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('rewards')}
                className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] nm-orange-pressed transition-nm flex items-center justify-center gap-2"
              >
                View Quests & Rewards
              </button>
            </section>

            {/* Weekly Insights Section */}
            <section className="nm-flat rounded-[32px] p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#1C1C1C] uppercase tracking-widest">{t.weeklyReport}</h3>
                  <span className="text-[9px] bg-[#EA580C]/10 text-[#EA580C] px-3 py-1 rounded-full font-black uppercase tracking-widest">Live</span>
               </div>
               
               <div className="nm-inset p-5 rounded-2xl space-y-4">
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-[#EA580C] uppercase tracking-tighter">What went wrong</p>
                     <p className="text-xs text-[#1C1C1C] font-medium leading-relaxed">• Late payment on mobile recharge detected Thursday.</p>
                  </div>
                  <div className="w-full h-[1px] bg-[#E0E0E0]"></div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">How you improved</p>
                     <p className="text-xs text-[#1C1C1C] font-medium leading-relaxed">• Consistent UPI transfers maintained for 6 consecutive days.</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest px-1">Weekly Performance</p>
                  <div className="flex items-end justify-between gap-1 h-20 px-2">
                     {[45, 60, 55, 30, 80, 70, 90].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#EA580C]/20 rounded-t-lg relative group overflow-hidden">
                           <div className="absolute bottom-0 w-full bg-[#EA580C] transition-all duration-500 rounded-t-lg" style={{ height: `${h}%` }}></div>
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-[#6B6B6B] uppercase px-1">
                     <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
               </div>
            </section>
          </div>
        );
      default:
        return <ScoreDashboard user={user} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col max-w-md mx-auto relative overflow-x-hidden">
      
      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute top-20 right-6 left-6 nm-flat rounded-[32px] p-6 space-y-6 shadow-2xl animate-in slide-in-from-top-4 duration-300 max-w-sm mx-auto">
            <div className="flex items-center justify-between border-b border-[#F1F1F1] pb-4">
              <h3 className="font-bold text-sm tracking-tight text-[#1C1C1C] uppercase tracking-widest">Activity Feed</h3>
              <button onClick={() => setShowNotifications(false)} className="w-8 h-8 nm-flat rounded-full flex items-center justify-center text-[#6B6B6B] nm-pressed transition-nm">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {mockNotifications.map(n => (
                <div key={n.id} className="flex gap-4 p-4 nm-inset rounded-2xl group transition-all">
                  <div className="w-10 h-10 nm-flat rounded-xl flex items-center justify-center text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white transition-all">
                    {n.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-bold text-[#1C1C1C] leading-tight">{n.text}</p>
                    <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-tighter">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#F6F4EF]/90 backdrop-blur-md px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 nm-orange rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="text-white" size={24} />
            </div>
            <h1 className="font-bold text-xl text-[#1C1C1C] tracking-tight">MicroTrust</h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector current={lang} onChange={setLang} />
          {user.isConsentGiven && (
            <button 
              onClick={() => setShowNotifications(true)}
              className="w-10 h-10 nm-flat rounded-xl flex items-center justify-center relative nm-pressed transition-nm cursor-pointer"
            >
                <Bell size={20} className="text-[#1C1C1C]" />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EA580C] rounded-full border-2 border-[#F6F4EF]"></div>
            </button>
          )}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 px-6 pt-2 pb-12 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Tab Bar */}
      {user.isConsentGiven && activeTab !== 'rewards' && (
        <nav className="fixed bottom-6 left-6 right-6 max-w-md mx-auto z-50">
          <div className="nm-flat rounded-[28px] px-2 py-2 flex justify-between items-center bg-white/50 backdrop-blur-sm shadow-xl">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-[#EA580C] text-white shadow-lg scale-105' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'}`}
            >
              <LayoutDashboard size={18} />
              <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Home</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('network')}
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${activeTab === 'network' ? 'bg-[#EA580C] text-white shadow-lg scale-105' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'}`}
            >
              <Users size={18} />
              <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Network</span>
            </button>

            <button 
              onClick={() => setActiveTab('builder')}
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${activeTab === 'builder' ? 'bg-[#EA580C] text-white shadow-lg scale-105' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'}`}
            >
              <Award size={18} />
              <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Build</span>
            </button>

            <button 
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${activeTab === 'privacy' ? 'bg-[#EA580C] text-white shadow-lg scale-105' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'}`}
            >
              <Shield size={18} />
              <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Privacy</span>
            </button>

            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-[#EA580C] text-white shadow-lg scale-105' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'}`}
            >
              <User size={18} />
              <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Me</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
