
import React, { useState, useEffect } from 'react';
import { Language, Endorsement, CommunityReference } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import { Users, UserCheck, ShieldPlus, MessageSquare, AlertTriangle, X, Shield, Phone, User as UserIcon, CheckCircle2, Briefcase, ArrowUpRight, BarChart3, Info, Star, Loader2, Trash2 } from 'lucide-react';

interface Props {
  lang: Language;
  userId?: string;
}

const TrustNetwork: React.FC<Props> = ({ lang, userId }) => {
  const t = translations[lang];
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAntiGaming, setShowAntiGaming] = useState(false);
  const [selectedEndorsement, setSelectedEndorsement] = useState<Endorsement | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [newRef, setNewRef] = useState<CommunityReference>({ name: '', role: 'Supplier', phone: '', strength: 3, duration: '1-6 Months' });

  const communityStrength = endorsements.length > 0
    ? Math.round((endorsements.filter(e => e.status === 'Verified').length / Math.max(5, endorsements.length)) * 100)
    : 0;

  // ── Load endorsements from API ────────────────────────────────────────
  useEffect(() => {
    const loadEndorsements = async () => {
      try {
        const data = await api.listEndorsements();
        setEndorsements(data.endorsements || []);
      } catch {
        // If no endorsements yet, that's fine
        setEndorsements([]);
      } finally {
        setLoading(false);
      }
    };
    loadEndorsements();
  }, []);

  // ── Add Reference via API ─────────────────────────────────────────────
  const handleAddReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRef.name || !newRef.phone) return;

    setSubmitting(true);
    setError('');
    try {
      const data = await api.createEndorsement({
        name: newRef.name,
        type: newRef.role,
        phone: newRef.phone,
        strength: newRef.strength || 3,
        duration: 0,
      });

      setEndorsements(prev => [data.endorsement, ...prev]);
      setShowAddForm(false);
      setNewRef({ name: '', role: 'Supplier', phone: '', strength: 3, duration: '1-6 Months' });
    } catch (err: any) {
      setError(err.message || 'Failed to add reference');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete Endorsement ────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await api.deleteEndorsement(id);
      setEndorsements(prev => prev.filter(e => e.id !== id));
      setSelectedEndorsement(null);
    } catch {
      // Silent fail
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#EA580C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      {/* Endorser Detail Modal */}
      {selectedEndorsement && (
        <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="nm-flat rounded-t-[40px] sm:rounded-[40px] p-8 space-y-8 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setSelectedEndorsement(null)} className="absolute top-6 right-6 text-[#6B6B6B] hover:text-[#EA580C] transition-colors">
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="w-24 h-24 nm-inset rounded-[32px] flex items-center justify-center text-3xl font-bold text-[#EA580C]">
                {selectedEndorsement.name[0]}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">{selectedEndorsement.name}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] font-black text-[#EA580C] uppercase tracking-widest bg-[#EA580C]/10 px-3 py-1 rounded-full">
                    {selectedEndorsement.type}
                  </span>
                  {selectedEndorsement.status === 'Verified' && (
                    <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase">
                      <CheckCircle2 size={12} /> Verified
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="nm-inset p-5 rounded-3xl text-center space-y-1">
                <p className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest">Trust Score</p>
                <p className="text-2xl font-bold text-[#1C1C1C] tabular-nums">{selectedEndorsement.score || '--'}</p>
              </div>
              <div className="nm-inset p-5 rounded-3xl text-center space-y-2">
                <p className="text-[9px] font-black text-[#6B6B6B] uppercase tracking-widest">Endorsement Strength</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={14} fill={star <= selectedEndorsement.strength ? "#EA580C" : "none"} className={star <= selectedEndorsement.strength ? "text-[#EA580C]" : "text-gray-200"} />
                  ))}
                </div>
              </div>
            </div>

            <div className="nm-flat-sm p-6 rounded-[32px] space-y-4">
              <h4 className="text-[10px] font-black text-[#1C1C1C] uppercase tracking-widest border-b border-[#F1F1F1] pb-2">Reference Parameters</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#6B6B6B]">Stability Duration</span>
                  <span className="text-xs font-bold text-[#1C1C1C]">{selectedEndorsement.duration || '0'} Months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#6B6B6B]">Verification Method</span>
                  <span className="text-xs font-bold text-[#1C1C1C]">Reciprocal OTP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#6B6B6B]">Network Context</span>
                  <span className="text-xs font-bold text-[#1C1C1C]">{selectedEndorsement.type} Network</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(selectedEndorsement.id)}
                className="w-14 h-14 nm-flat rounded-2xl flex items-center justify-center text-[#D66A5E] nm-pressed transition-nm"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setSelectedEndorsement(null)}
                className="flex-1 nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg"
              >
                Back to Network
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Gaming Modal */}
      {showAntiGaming && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95">
          <div className="nm-flat rounded-[40px] p-8 space-y-6 w-full max-w-sm max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setShowAntiGaming(false)} className="absolute top-6 right-6 text-[#6B6B6B] hover:text-[#EA580C] transition-colors">
              <X size={24} />
            </button>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <Shield size={28} />
                <h2 className="text-xl font-bold tracking-tight">How we prevent gaming</h2>
              </div>
              <p className="text-sm text-[#1C1C1C] font-bold leading-tight bg-amber-50 p-4 rounded-2xl border border-amber-100">
                "Trust in MicroTrust isn't based on a single endorsement — it emerges from patterns across the user's network."
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { title: "1. Multi-Signal Verification", desc: "One reference has small weight. We collectively analyze consistency across 3+ verified contacts to detect real reputation." },
                  { title: "2. Reciprocal Confirmation", desc: "Suppliers must confirm your relationship via a secure OTP link. Fake users need real phone cooperation, increasing friction." },
                  { title: "3. Graph-Based Trust", desc: "We track how many others reference the same person. 'Ramesh Store' mentioned by 15 vendors is a high-credibility anchor." },
                  { title: "4. Progressive Weighting", desc: "Not all trust is equal. Endorsements are tiered (Low/Med/High) based on verification strength and the endorser's own score." },
                  { title: "5. Behavior Cross-Check", desc: "Claims are compared against transaction data. If you claim a 'supplier' but have no recurring payments, trust weight drops." },
                  { title: "6. Fraud Flags", desc: "System flags rapid additions (e.g. 5 in 1 hour), shared phone numbers, or new accounts endorsing each other." }
                ].map((item, i) => (
                  <div key={i} className="nm-inset p-4 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-[#EA580C] uppercase tracking-widest">{item.title}</p>
                    <p className="text-[11px] text-[#1C1C1C] leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowAntiGaming(false)} className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg">Understood</button>
          </div>
        </div>
      )}

      {/* Add Reference Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95">
          <form onSubmit={handleAddReference} className="nm-flat rounded-[40px] p-8 space-y-6 w-full max-w-sm relative shadow-2xl">
            <button type="button" onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-[#6B6B6B]">
              <X size={24} />
            </button>
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 nm-orange rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
                <ShieldPlus size={32} />
              </div>
              <h2 className="text-xl font-bold text-[#1C1C1C]">{t.addReference}</h2>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium text-center bg-red-50 py-2 rounded-xl">{error}</p>
            )}

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              <div className="nm-inset p-4 rounded-2xl flex items-center gap-3">
                <UserIcon size={18} className="text-[#6B6B6B]" />
                <input
                  placeholder="Reference Name (e.g. Ramesh Store)"
                  className="bg-transparent outline-none w-full text-sm font-bold"
                  value={newRef.name}
                  onChange={e => setNewRef({ ...newRef, name: e.target.value })}
                  required
                />
              </div>
              <div className="nm-inset p-4 rounded-2xl flex items-center gap-3">
                <Briefcase size={18} className="text-[#6B6B6B]" />
                <select
                  className="bg-transparent outline-none w-full text-sm font-bold text-[#1C1C1C]"
                  value={newRef.role}
                  onChange={e => setNewRef({ ...newRef, role: e.target.value })}
                >
                  <option value="Local Shop Owner">Local Shop Owner</option>
                  <option value="Employer">Employer</option>
                  <option value="Supplier">Supplier</option>
                  <option value="SHG Member">SHG Member</option>
                  <option value="Regular Customer">Regular Customer</option>
                </select>
              </div>
              <div className="nm-inset p-4 rounded-2xl flex items-center gap-3">
                <Phone size={18} className="text-[#6B6B6B]" />
                <input
                  placeholder="Phone Number"
                  type="tel"
                  className="bg-transparent outline-none w-full text-sm font-bold"
                  value={newRef.phone}
                  onChange={e => setNewRef({ ...newRef, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest px-1">Relationship Stability</p>
                <div className="nm-inset p-1 rounded-2xl flex">
                  {['<1mo', '1-6mo', '1yr+'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNewRef({ ...newRef, duration: d })}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${newRef.duration === d ? 'nm-flat text-[#EA580C]' : 'text-[#6B6B6B]'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full nm-orange text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Adding...</> : 'Generate Invite OTP'}
            </button>
          </form>
        </div>
      )}

      {/* Community Strength Score Display */}
      <section className="nm-flat rounded-[32px] p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">{t.commStrength}</h2>
            <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-widest">Network Consistency Score</p>
          </div>
          <div className="w-16 h-16 nm-inset rounded-full flex items-center justify-center">
            <span className="text-xl font-black text-[#EA580C]">{communityStrength}%</span>
          </div>
        </div>

        <div className="h-4 nm-inset rounded-full p-1 relative z-10">
          <div
            className="h-full bg-gradient-to-r from-[#EA580C] to-[#D97706] rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${communityStrength}%` }}
          ></div>
        </div>

        <p className="text-[11px] text-[#6B6B6B] font-medium leading-relaxed italic border-l-2 border-[#EA580C]/20 pl-4">
          Weighted by verified references, relationship duration, and endorser credibility.
        </p>
      </section>

      {/* Endorsements List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-sm text-[#1C1C1C] tracking-tight">{t.endorsements}</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-[10px] nm-flat-sm text-[#EA580C] px-4 py-2 rounded-full font-bold flex items-center gap-2 uppercase tracking-widest transition-nm nm-pressed"
          >
            <ShieldPlus size={14} />
            Add Reference
          </button>
        </div>

        {endorsements.length === 0 ? (
          <div className="nm-inset rounded-3xl p-8 text-center space-y-3">
            <Users size={32} className="text-[#6B6B6B] mx-auto" />
            <p className="text-xs text-[#6B6B6B] font-medium">No references yet. Add your first community reference to start building your trust network.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {endorsements.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelectedEndorsement(e)}
                className="nm-flat rounded-3xl p-5 flex items-center justify-between transition-nm hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 nm-inset rounded-2xl flex items-center justify-center font-bold text-sm text-[#EA580C]`}>
                    {e.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#1C1C1C]">{e.name}</p>
                      {e.status === 'Verified' && <CheckCircle2 size={12} className="text-emerald-500" />}
                    </div>
                    <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-tighter mt-0.5">
                      {e.type} • {e.status === 'Verified' ? `Stability: ${e.duration}mo` : 'Awaiting OTP'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {e.status === 'Verified' ? (
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <div key={star} className={`w-1.5 h-1.5 rounded-full ${star <= e.strength ? 'bg-[#EA580C]' : 'bg-gray-200'}`}></div>
                        ))}
                      </div>
                      <span className="text-[8px] font-black text-[#6B6B6B] uppercase">Strength</span>
                    </div>
                  ) : (
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full font-black uppercase tracking-widest">
                      {t.pending}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Anti-Gaming Banner */}
      <div
        onClick={() => setShowAntiGaming(true)}
        className="nm-inset rounded-3xl p-6 space-y-4 cursor-pointer hover:bg-amber-50/50 transition-all group border border-amber-100/20"
      >
        <div className="flex items-center justify-between text-amber-600">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <h3 className="font-bold text-sm tracking-tight">Security & Trust Design</h3>
          </div>
          <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
        <p className="text-[#6B6B6B] text-[11px] leading-relaxed font-medium">
          Our algorithm filters out fake endorsements using reciprocal OTP confirmations and graph-based consistency signals.
        </p>
      </div>
    </div>
  );
};

export default TrustNetwork;
