
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserProfile, Language } from '../types';
import { translations } from '../translations';

import { Zap, TrendingUp, Info, Share2, ArrowUpRight, BarChart3 } from 'lucide-react';

interface Props {
  user: UserProfile;
  lang: Language;
}

const ScoreDashboard: React.FC<Props> = ({ user, lang }) => {
  const t = translations[lang];
  const [advice] = useState<string>('• Maintain consistent daily UPI transactions\n• Pay mobile and utility bills on time\n• Add trusted community references to your network');

  const scoreData = [
    { value: Math.max(0, user.score - 300) },
    { value: Math.max(0, 900 - user.score) }
  ];

  const getScoreColor = (score: number) => {
    if (score < 550) return '#D66A5E';
    if (score < 650) return '#EA580C';
    if (score < 750) return '#D97706';
    return '#10B981';
  };

  const getScoreLabel = (score: number) => {
    if (score < 550) return 'Poor';
    if (score < 650) return 'Average';
    if (score < 750) return 'Good';
    return 'Excellent';
  };



  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      {/* Main Score Card */}
      <section className="nm-flat rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#EA580C]/20"></div>
        <h2 className="text-[#6B6B6B] font-bold text-xs uppercase tracking-[0.2em] mb-6">{t.creditScore}</h2>

        <div className="relative h-56 w-56 mx-auto mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scoreData}
                innerRadius={75}
                outerRadius={95}
                startAngle={220}
                endAngle={-40}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={getScoreColor(user.score)} />
                <Cell fill="#F1F1F1" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-[#1C1C1C] tabular-nums tracking-tighter">{user.score}</span>
            <span className="text-[10px] text-[#EA580C] font-bold uppercase tracking-widest mt-1 px-3 py-1 bg-[#EA580C]/10 rounded-full">
              {getScoreLabel(user.score)}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button className="flex-1 nm-orange text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 nm-orange-pressed transition-nm text-sm uppercase tracking-wider">
            <Share2 size={16} />
            Share
          </button>
          <button className="w-14 h-14 nm-flat rounded-full flex items-center justify-center text-[#EA580C] nm-pressed transition-nm">
            <ArrowUpRight size={24} />
          </button>
        </div>
      </section>

      {/* Score Tier Guide */}
      <section className="nm-flat rounded-3xl p-6 space-y-4">
        <h3 className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest flex items-center gap-2">
          <BarChart3 size={16} /> {t.scoreGuide}
        </h3>
        <div className="space-y-3">
          {[
            { range: '300-550', label: 'Poor', color: 'bg-[#D66A5E]', desc: 'High risk. Focus on consistency.' },
            { range: '550-650', label: 'Average', color: 'bg-[#EA580C]', desc: 'Developing. Building patterns.' },
            { range: '650-750', label: 'Good', color: 'bg-[#D97706]', desc: 'Reliable. Eligible for micro-loans.' },
            { range: '750-900', label: 'Excellent', color: 'bg-[#10B981]', desc: 'Elite. Premium rewards unlocked.' },
          ].map((tier, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-2 h-10 rounded-full ${tier.color}`}></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#1C1C1C]">{tier.label}</p>
                  <span className="text-[9px] font-bold text-[#6B6B6B]">{tier.range}</span>
                </div>
                <p className="text-[10px] text-[#6B6B6B] font-medium">{tier.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Advice - Enhanced Spacing */}
      <section className="nm-flat rounded-3xl p-7 space-y-5">
        <div className="flex items-center gap-3 text-[#EA580C]">
          <div className="w-9 h-9 nm-inset rounded-xl flex items-center justify-center">
            <Zap size={18} fill="#EA580C" className="text-[#EA580C]" />
          </div>
          <h3 className="font-bold text-sm tracking-tight uppercase tracking-widest">Financial Insights</h3>
        </div>

        {(
          <div className="text-[#1C1C1C] text-sm leading-relaxed font-medium space-y-4">
            {advice ? advice.split('\n').map((line, idx) => (
              <div key={idx} className="flex gap-4 items-start animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 150}ms` }}>
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#EA580C] shrink-0 shadow-[0_0_8px_rgba(234,88,12,0.4)]"></span>
                <span className="leading-relaxed flex-1">{line.replace('•', '').trim()}</span>
              </div>
            )) : "Complete your profile to receive AI-powered financial advisory."}
          </div>
        )}
      </section>

      {/* Factors Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-sm text-[#1C1C1C] flex items-center gap-2 tracking-tight">
            <Info size={16} className="text-[#6B6B6B]" />
            Identity Factors
          </h3>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase">Live Data</span>
        </div>
        <div className="nm-flat rounded-3xl p-6 space-y-6">
          {Object.entries(user.breakdown).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                <span>{t.factors[key as keyof typeof t.factors]}</span>
                <span className="text-[#1C1C1C]">{value as number}%</span>
              </div>
              <div className="h-3 nm-inset rounded-full p-0.5">
                <div
                  className="h-full bg-[#EA580C] rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${value as number}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ScoreDashboard;
