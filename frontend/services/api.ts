const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token Management ────────────────────────────────────────────────────
function getToken(): string | null {
    return localStorage.getItem('microtrust_token');
}

function setToken(token: string): void {
    localStorage.setItem('microtrust_token', token);
}

function clearToken(): void {
    localStorage.removeItem('microtrust_token');
    localStorage.removeItem('microtrust_userId');
}

function getUserId(): string | null {
    return localStorage.getItem('microtrust_userId');
}

function setUserId(userId: string): void {
    localStorage.setItem('microtrust_userId', userId);
}

// ── Auth-aware fetch helper ─────────────────────────────────────────────
async function authFetch(url: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        clearToken();
        throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json();
}

// ── API Methods ─────────────────────────────────────────────────────────
export const api = {
    // ── Auth ────────────────────────────────────────────────────────────
    async login(email: string, password: string = 'SecurePassword123!') {
        const data = await authFetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            setToken(data.token);
            setUserId(data.userId);
        }
        return data;
    },

    async register(details: {
        email: string;
        password: string;
        name: string;
        phone: string;
        monthlyIncome?: number;
        upiTransactions?: number;
    }) {
        const data = await authFetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(details),
        });
        if (data.token) {
            setToken(data.token);
            setUserId(data.userId);
        }
        return data;
    },

    async getProfile() {
        return authFetch(`${API_BASE_URL}/auth/profile`);
    },

    async deleteAccount() {
        const data = await authFetch(`${API_BASE_URL}/auth/account`, {
            method: 'DELETE',
        });
        clearToken();
        return data;
    },

    // ── Score ───────────────────────────────────────────────────────────
    async getScore(userId: string) {
        return authFetch(`${API_BASE_URL}/score/${userId}`);
    },

    async getScoreHistory(userId: string) {
        return authFetch(`${API_BASE_URL}/score/${userId}/history`);
    },

    // ── Consent ─────────────────────────────────────────────────────────
    async giveConsent(consentGiven: boolean, consentType: string = 'credit_data_access') {
        return authFetch(`${API_BASE_URL}/consent`, {
            method: 'POST',
            body: JSON.stringify({ consentGiven, consentType }),
        });
    },

    async getConsentStatus() {
        return authFetch(`${API_BASE_URL}/consent/status`);
    },

    // ── Endorsements ────────────────────────────────────────────────────
    async listEndorsements() {
        return authFetch(`${API_BASE_URL}/endorsements`);
    },

    async createEndorsement(details: {
        name: string;
        type?: string;
        phone?: string;
        strength?: number;
        duration?: number;
    }) {
        return authFetch(`${API_BASE_URL}/endorsements`, {
            method: 'POST',
            body: JSON.stringify(details),
        });
    },

    async deleteEndorsement(id: string) {
        return authFetch(`${API_BASE_URL}/endorsements/${id}`, {
            method: 'DELETE',
        });
    },

    // ── Lenders ─────────────────────────────────────────────────────────
    async getMatchingLenders(loanAmount: number) {
        return authFetch(`${API_BASE_URL}/lenders/endorsement`, {
            method: 'POST',
            body: JSON.stringify({ loanAmount }),
        });
    },

    // ── Rewards ─────────────────────────────────────────────────────────
    async listRewards() {
        return authFetch(`${API_BASE_URL}/rewards`);
    },

    // ── Helpers ─────────────────────────────────────────────────────────
    getToken,
    setToken,
    clearToken,
    getUserId,
    setUserId,
};
