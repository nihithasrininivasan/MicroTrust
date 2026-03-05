
import React, { useState, useEffect } from 'react';
import { UserProfile, Language, RewardItem } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import { ChevronLeft, Ticket, Zap, Gift, ShoppingBag, ArrowRight, Star, Loader2 } from 'lucide-react';

interface Props {
   user: UserProfile;
   lang: Language;
   onBack: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
   electricity: <Zap size={20} />,
   shopping: <ShoppingBag size={20} />,
   gift: <Gift size={20} />,
   ticket: <Ticket size={20} />,
   star: <Star size={20} />,
};

const RewardsPage: React.FC<Props> = ({ user, lang, onBack }) => {
   const t = translations[lang];
   const [rewards, setRewards] = useState<RewardItem[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const loadRewards = async () => {
         try {
            const data = await api.listRewards();
            setRewards(data.rewards || []);
         } catch {
            // Fallback to empty
            setRewards([]);
         } finally {
            setLoading(false);
         }
      };
      loadRewards();
   }, []);

   const unlockedCount = rewards.filter(r => user.score >= r.scoreNeeded).length;

   if (loading) {
      return (
         <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#EA580C]" />
         </div>
      );
   }

   return (
      <div className="space-y-8 pb-24 animate-in slide-in-from-right-8 duration-500">
         <header className="flex items-center gap-4">
            <button onClick={onBack} className="w-10 h-10 nm-flat rounded-full flex items-center justify-center text-[#6B6B6B] nm-pressed transition-all">
               <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-[#1C1C1C] tracking-tight">{t.rewards}</h2>
         </header>

         <section className="nm-flat rounded-[32px] p-8 space-y-4 text-center">
            <div className="w-16 h-16 nm-inset rounded-[24px] flex items-center justify-center mx-auto text-[#EA580C]">
               <Ticket size={32} />
            </div>
            <div>
               <p className="text-2xl font-bold text-[#1C1C1C]">{unlockedCount} Offers Unlocked</p>
               <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-widest mt-1">Based on score of {user.score}</p>
            </div>
         </section>

         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-[0.2em] px-2">{t.cashbacks}</h3>
            {rewards.length === 0 ? (
               <div className="nm-inset rounded-3xl p-8 text-center">
                  <p className="text-xs text-[#6B6B6B] font-medium">No rewards available right now. Check back later!</p>
               </div>
            ) : (
               rewards.map((r, i) => {
                  const isLocked = user.score < r.scoreNeeded;
                  return (
                     <div key={r.id || i} className={`nm-flat rounded-3xl p-5 flex items-center justify-between transition-all ${isLocked ? 'opacity-50 grayscale' : 'hover:scale-[1.02]'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center nm-inset ${isLocked ? 'text-gray-400' : 'text-[#EA580C]'}`}>
                              {iconMap[r.icon] || <Gift size={20} />}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-[#1C1C1C]">{r.title}</p>
                              <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-tighter">{r.provider}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           {isLocked ? (
                              <div className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-full">Score {r.scoreNeeded}</div>
                           ) : (
                              <div className="flex flex-col items-end gap-1">
                                 <span className="text-sm font-bold text-emerald-600">{r.value}</span>
                                 <button className="text-[8px] font-black text-[#EA580C] uppercase flex items-center gap-1 border-b border-[#EA580C]/20">Redeem <ArrowRight size={10} /></button>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })
            )}
         </div>
      </div>
   );
};

export default RewardsPage;
