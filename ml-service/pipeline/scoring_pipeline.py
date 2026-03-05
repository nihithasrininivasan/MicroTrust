"""
MicroTrust — Ensemble Scoring Pipeline
========================================
Loads a trained LogisticRegression, RandomForestClassifier, and
StandardScaler from disk, blends their predicted probabilities using a
weighted average (40% LR + 60% RF), and returns a 0–1000 MicroTrust
score with risk bucket classification, model confidence, and
explainability via the top risk factors driving the score.
"""

import os
from typing import Any, Dict, List

import numpy as np
import joblib

# ---------------------------------------------------------------------------
# 1. Resolve model artifact paths (relative to this file)
# ---------------------------------------------------------------------------
_MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
_LOGREG_PATH = os.path.join(_MODEL_DIR, "logreg_model.pkl")
_RF_PATH = os.path.join(_MODEL_DIR, "rf_model.pkl")
_SCALER_PATH = os.path.join(_MODEL_DIR, "scaler.pkl")

# ---------------------------------------------------------------------------
# 2. Load all models once at import time for fast inference
# ---------------------------------------------------------------------------
try:
    _logreg_model = joblib.load(_LOGREG_PATH)
    _rf_model = joblib.load(_RF_PATH)
    _scaler = joblib.load(_SCALER_PATH)
except Exception as e:
    print(f"⚠️  Failed to load pre-trained models: {e}")
    print("   Retraining models with current package versions...")
    from pipeline.train_model import train_and_save
    train_and_save()
    _logreg_model = joblib.load(_LOGREG_PATH)
    _rf_model = joblib.load(_RF_PATH)
    _scaler = joblib.load(_SCALER_PATH)
    print("✅ Models retrained and loaded successfully")

# Ensemble blend weights
LOGREG_WEIGHT = 0.4
RF_WEIGHT = 0.6

# Feature order must match the order used during training
FEATURE_ORDER = [
    "upi_consistency",
    "bill_payment_regularity",
    "recharge_frequency",
    "income_stability",
    "community_trust_score",
]

# Number of top risk factors to surface in the API response
_TOP_K_RISK_FACTORS = 2

# ---------------------------------------------------------------------------
# 3. Explainability helper
# ---------------------------------------------------------------------------

def _extract_top_risk_factors(
    raw_values: np.ndarray,
    feature_names: List[str],
    top_k: int = _TOP_K_RISK_FACTORS,
) -> List[str]:
    """
    Identify the features that contribute *least* to a trustworthy prediction,
    making them the most impactful risk factors for the user.

    Logic
    -----
    1. Retrieve the global feature importances learned by the Random Forest.
    2. Multiply each importance by the user's raw (unscaled) input value.
       → A low input value on a high-importance feature yields a low
         impact score, signalling risk.
    3. Sort ascending by impact score so the weakest contributors come first.
    4. Return the top-k feature names prefixed with "low_".
    """
    # Global importances from the trained Random Forest
    rf_importances = _rf_model.feature_importances_

    # Per-user impact: importance × raw input value
    impact_scores = rf_importances * raw_values.flatten()

    # Map feature_name → impact_score
    impact_map = {
        name: impact for name, impact in zip(feature_names, impact_scores)
    }

    # Sort ascending — lowest impact = highest risk
    sorted_factors = sorted(impact_map.items(), key=lambda item: item[1])

    # Format the top-k weakest contributors as "low_<feature_name>"
    return [f"low_{name}" for name, _ in sorted_factors[:top_k]]

# ---------------------------------------------------------------------------
# 4. Public scoring function
# ---------------------------------------------------------------------------

def score(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Score a single user using the ensemble pipeline.

    Parameters
    ----------
    features : dict
        Must contain keys matching FEATURE_ORDER. Values should be numeric
        floats in the range [0, 1].

    Returns
    -------
    dict
        {
            "microtrust_score":  int        (0–1000),
            "risk_bucket":       str        ("Low" | "Medium" | "High"),
            "model_confidence":  float      (0.0–1.0, rounded to 4 decimals),
            "top_risk_factors":  list[str]  (top risk explanations)
        }
    """

    # --- Convert input dict → ordered numpy array ---
    feature_values = np.array(
        [[features[f] for f in FEATURE_ORDER]], dtype=np.float64
    )

    # --- Scale using the persisted StandardScaler ---
    scaled = _scaler.transform(feature_values)

    # --- Get probability of class 1 (trustworthy) from each model ---
    logreg_prob = _logreg_model.predict_proba(scaled)[0][1]
    rf_prob = _rf_model.predict_proba(scaled)[0][1]

    # --- Blend probabilities (weighted average) ---
    final_prob = (LOGREG_WEIGHT * logreg_prob) + (RF_WEIGHT * rf_prob)

    # --- Map blended probability to 0–1000 MicroTrust score ---
    microtrust_score = int(final_prob * 1000)

    # --- Classify into risk bucket ---
    if microtrust_score >= 750:
        risk_bucket = "Low"
    elif microtrust_score >= 500:
        risk_bucket = "Medium"
    else:
        risk_bucket = "High"

    # --- Explainability: identify weakest contributing features ---
    top_risk_factors = _extract_top_risk_factors(feature_values, FEATURE_ORDER)

    return {
        "microtrust_score": microtrust_score,
        "risk_bucket": risk_bucket,
        "model_confidence": round(final_prob, 4),
        "top_risk_factors": top_risk_factors,
    }
