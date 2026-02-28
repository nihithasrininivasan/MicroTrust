"""
MicroTrust — Data Models (Typed Dataclasses)
============================================
These mirror the SQLite schema in database.py and are used as
typed data containers / return types throughout the application.
No SQLAlchemy dependency — works entirely with the raw sqlite3 engine.
"""
from dataclasses import dataclass, field
from typing import Optional, Dict, Any
from datetime import datetime


@dataclass
class User:
    """Represents a row in the `users` table."""
    id: int
    firebase_uid: str
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    photo_url: Optional[str] = None
    aadhaar_hash: Optional[str] = None
    is_active: bool = True
    created_at: Optional[str] = None
    last_login: Optional[str] = None

    @classmethod
    def from_row(cls, row: dict) -> "User":
        return cls(**{k: row[k] for k in row.keys() if k in cls.__dataclass_fields__})


@dataclass
class BehaviorSignal:
    """Represents a row in the `behavior_signals` table."""
    id: int
    user_id: int
    category: Optional[str] = None
    signal_key: Optional[str] = None
    signal_value: Optional[float] = None
    timestamp: Optional[str] = None

    @classmethod
    def from_row(cls, row: dict) -> "BehaviorSignal":
        return cls(**{k: row[k] for k in row.keys() if k in cls.__dataclass_fields__})


@dataclass
class TrustEndorsement:
    """Represents a row in the `community_trust` table."""
    id: int
    endorser_id: int
    recipient_id: int
    endorsement_type: Optional[str] = None
    weight: float = 1.0
    created_at: Optional[str] = None

    @classmethod
    def from_row(cls, row: dict) -> "TrustEndorsement":
        return cls(**{k: row[k] for k in row.keys() if k in cls.__dataclass_fields__})


@dataclass
class Score:
    """Represents a row in the `scores` table."""
    id: int
    user_id: int
    microtrust_score: Optional[int] = None       # Range: 300–900
    repayment_probability: Optional[float] = None  # Range: 0.0–1.0 from ML model
    shap_explanations: Optional[Dict[str, Any]] = field(default=None)  # SHAP waterfall data
    created_at: Optional[str] = None

    @classmethod
    def from_row(cls, row: dict) -> "Score":
        import json
        data = {k: row[k] for k in row.keys() if k in cls.__dataclass_fields__}
        if isinstance(data.get("shap_explanations"), str):
            try:
                data["shap_explanations"] = json.loads(data["shap_explanations"])
            except (json.JSONDecodeError, TypeError):
                pass
        return cls(**data)
