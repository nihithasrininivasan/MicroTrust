"""
MicroTrust — Pydantic Request / Response Models
================================================
These models define the contract for the /generate-score endpoint.
"""

from typing import List

from pydantic import BaseModel, Field


class ScoreRequest(BaseModel):
    """Input features for MicroTrust scoring."""

    upi_consistency: float = Field(
        ..., ge=0, le=1, description="UPI transaction consistency (0.0–1.0)"
    )
    bill_payment_regularity: float = Field(
        ..., ge=0, le=1, description="Bill payment regularity (0.0–1.0)"
    )
    recharge_frequency: float = Field(
        ..., ge=0, le=1, description="Mobile recharge frequency (0.0–1.0)"
    )
    income_stability: float = Field(
        ..., ge=0, le=1, description="Income stability indicator (0.0–1.0)"
    )
    community_trust_score: float = Field(
        ..., ge=0, le=1, description="Community-based trust signal (0.0–1.0)"
    )


class ScoreResponse(BaseModel):
    """Output of the MicroTrust ensemble scoring pipeline."""

    microtrust_score: int = Field(
        ..., ge=0, le=1000, description="MicroTrust score on a 0–1000 scale"
    )
    risk_bucket: str = Field(
        ..., description="Risk classification: Low, Medium, or High"
    )
    model_confidence: float = Field(
        ..., ge=0, le=1, description="Blended ensemble probability (0.0–1.0)"
    )
    top_risk_factors: List[str] = Field(
        ..., description="Top risk factors driving the score (e.g. 'low_income_stability')"
    )