
export type Language = 'en' | 'hi' | 'ta';

export interface ScoreBreakdown {
  consistency: number;
  billPayments: number;
  stability: number;
  trustNetwork: number;
  digitalFootprint: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age?: string;
  address?: string;
  category: 'Street Vendor' | 'Gig Worker' | 'Domestic Worker' | 'Micro-Entrepreneur' | string;
  score: number;
  communityScore: number; // New: 0-100 representation of network strength
  history: { date: string; score: number }[];
  breakdown: ScoreBreakdown;
  isConsentGiven: boolean;
  kycStatus?: 'None' | 'Pending' | 'Verified';
}

export interface Endorsement {
  id: string;
  name: string;
  score: number;
  status: 'Pending' | 'Verified';
  type: string;
  strength: number; // 1-5 scale
  duration: number; // months
}

export interface CommunityReference {
  name: string;
  role: string;
  phone: string;
  strength?: number;
  duration?: string;
}
