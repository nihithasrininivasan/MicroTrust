from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, unique=True, index=True)
    full_name = Column(String)
    email = Column(String, index=True)
    photo_url = Column(String)
    aadhaar_hash = Column(String, unique=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

    # Relationships
    signals = relationship("BehaviorSignal", back_populates="user")
    scores = relationship("Score", back_populates="user")
    endorsements_given = relationship("TrustEndorsement", foreign_keys="TrustEndorsement.endorser_id", back_populates="endorser")
    endorsements_received = relationship("TrustEndorsement", foreign_keys="TrustEndorsement.recipient_id", back_populates="recipient")

class BehaviorSignal(Base):
    """
    Extracted behavioral features for ML scoring.
    """
    __tablename__ = "behavior_signals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category = Column(String)  # e.g., 'consistency', 'income', 'bills'
    signal_key = Column(String, index=True)  # e.g., 'txn_frequency_30d'
    signal_value = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="signals")

    __table_args__ = (
        Index("ix_signals_user_key_ts", "user_id", "signal_key", "timestamp", postgresql_using="btree"),
    )

class TrustEndorsement(Base):
    """
    Tier 1 (Merchant) and Tier 2 (Peer) endorsements.
    """
    __tablename__ = "community_trust"

    id = Column(Integer, primary_key=True, index=True)
    endorser_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    endorsement_type = Column(String)  # 'peer' or 'merchant'
    weight = Column(Float, default=1.0) # Adjusted by endorser score
    created_at = Column(DateTime, default=datetime.utcnow)

    endorser = relationship("User", foreign_keys=[endorser_id], back_populates="endorsements_given")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="endorsements_received")

    __table_args__ = (
        UniqueConstraint("endorser_id", "recipient_id", name="uq_endorser_recipient"),
    )

class Score(Base):
    """
    Calculated MicroTrust scores.
    """
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    microtrust_score = Column(Integer)  # 300-900
    repayment_probability = Column(Float) # 0.0 - 1.0 from LightGBM
    shap_explanations = Column(JSON) # Waterfall chart data
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scores")

    __table_args__ = (
        Index("ix_scores_user_latest", "user_id", "created_at"),
    )

class ConsentLog(Base):
    __tablename__ = "consent_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    aa_name = Column(String)
    consent_status = Column(String)  # 'active', 'revoked', 'expired'
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
