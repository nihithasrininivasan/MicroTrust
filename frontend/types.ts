
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
  email?: string;
  phone?: string;
  age?: string;
  address?: string;
  category: 'Street Vendor' | 'Gig Worker' | 'Domestic Worker' | 'Micro-Entrepreneur' | string;
  score: number;
  communityScore: number;
  history: { date: string; score: number }[];
  breakdown: ScoreBreakdown;
  isConsentGiven: boolean;
  kycStatus?: 'None' | 'Pending' | 'Verified';
  monthlyIncome?: number;
  upiTransactions?: number;
  endorsementCount?: number;
  scoreRange?: string;
  riskLevel?: string;
}

export interface Endorsement {
  id: string;
  name: string;
  score: number;
  status: 'Pending' | 'Verified';
  type: string;
  strength: number;
  duration: number;
}

export interface CommunityReference {
  name: string;
  role: string;
  phone: string;
  strength?: number;
  duration?: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  userId: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    monthlyIncome: number;
    upiTransactions: number;
  };
}

export interface ScoreResponse {
  status: number;
  score: number;
  scoreRange: string;
  riskLevel: string;
  calculatedAt: string;
  validTill: string;
  breakdown: ScoreBreakdown;
}

export interface RewardItem {
  id: string;
  title: string;
  provider: string;
  value: string;
  icon: string;
  scoreNeeded: number;
}
