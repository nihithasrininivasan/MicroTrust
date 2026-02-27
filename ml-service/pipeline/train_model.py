"""
MicroTrust — Ensemble Model Training Script
=============================================
Generates synthetic behavioral data, trains a Logistic Regression and
a Random Forest classifier with StandardScaler preprocessing, evaluates
both on a hold-out set, persists all three model artifacts to disk,
and saves full evaluation metrics to metrics.json.

Output:
    pipeline/models/logreg_model.pkl
    pipeline/models/rf_model.pkl
    pipeline/models/scaler.pkl
    pipeline/models/metrics.json
"""

import json
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# ---------------------------------------------------------------------------
# 1. Configuration
# ---------------------------------------------------------------------------
SEED = 42
NUM_SAMPLES = 2000
FEATURE_NAMES = [
    "upi_consistency",
    "bill_payment_regularity",
    "recharge_frequency",
    "income_stability",
    "community_trust_score",
]

# Directory where model artifacts are saved
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

# ---------------------------------------------------------------------------
# 2. Synthetic Data Generation
# ---------------------------------------------------------------------------

def generate_synthetic_data(n_samples: int, seed: int) -> pd.DataFrame:
    """
    Create a synthetic dataset that mimics real-world behavioral signals.

    Each feature is drawn from a beta distribution so values naturally fall
    in [0, 1], and the binary target 'trustworthy' is derived from a
    weighted combination of features with added noise.
    """
    rng = np.random.RandomState(seed)

    data = pd.DataFrame({
        "upi_consistency":          rng.beta(5, 2, n_samples),
        "bill_payment_regularity":  rng.beta(4, 3, n_samples),
        "recharge_frequency":       rng.beta(3, 3, n_samples),
        "income_stability":         rng.beta(5, 2, n_samples),
        "community_trust_score":    rng.beta(4, 2, n_samples),
    })

    # Weighted linear combination + noise → binary label
    weights = np.array([0.25, 0.25, 0.15, 0.20, 0.15])
    weighted_sum = data[FEATURE_NAMES].values @ weights
    noise = rng.normal(0, 0.05, n_samples)
    data["trustworthy"] = (weighted_sum + noise >= 0.55).astype(int)

    return data

# ---------------------------------------------------------------------------
# 3. Metric Computation Helper
# ---------------------------------------------------------------------------

def _compute_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_prob: np.ndarray,
) -> dict:
    """
    Compute a standard suite of binary classification metrics.

    Parameters
    ----------
    y_true : array-like  — ground-truth labels
    y_pred : array-like  — hard predictions (0 or 1)
    y_prob : array-like  — predicted probabilities for the positive class

    Returns
    -------
    dict with accuracy, roc_auc, precision, recall, f1 (all rounded to 4dp)
    """
    return {
        "accuracy":  round(float(accuracy_score(y_true, y_pred)), 4),
        "roc_auc":   round(float(roc_auc_score(y_true, y_prob)), 4),
        "precision": round(float(precision_score(y_true, y_pred)), 4),
        "recall":    round(float(recall_score(y_true, y_pred)), 4),
        "f1_score":  round(float(f1_score(y_true, y_pred)), 4),
    }

# ---------------------------------------------------------------------------
# 4. Training Pipeline
# ---------------------------------------------------------------------------

def train_and_save() -> None:
    """Train LogisticRegression + RandomForest, evaluate, and persist."""

    print("=" * 60)
    print("  MicroTrust — Ensemble Model Training")
    print("=" * 60)

    # --- Data ---
    df = generate_synthetic_data(NUM_SAMPLES, SEED)
    X = df[FEATURE_NAMES].values
    y = df["trustworthy"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=y
    )
    print(f"\n📊 Dataset : {NUM_SAMPLES} samples ({X_train.shape[0]} train / {X_test.shape[0]} test)")
    print(f"   Features: {FEATURE_NAMES}")
    print(f"   Label distribution: {dict(zip(*np.unique(y, return_counts=True)))}")

    # --- Scaling ---
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # --- Logistic Regression ---
    print("\n" + "-" * 40)
    print("  Model 1: Logistic Regression")
    print("-" * 40)
    logreg = LogisticRegression(random_state=SEED, max_iter=1000)
    logreg.fit(X_train_scaled, y_train)

    y_pred_lr = logreg.predict(X_test_scaled)
    lr_probs = logreg.predict_proba(X_test_scaled)[:, 1]
    lr_accuracy = accuracy_score(y_test, y_pred_lr)
    print(f"\n✅ Test Accuracy: {lr_accuracy:.4f}")
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred_lr, target_names=["Not Trustworthy", "Trustworthy"]))

    # --- Random Forest ---
    print("-" * 40)
    print("  Model 2: Random Forest")
    print("-" * 40)
    rf = RandomForestClassifier(n_estimators=100, random_state=SEED)
    rf.fit(X_train_scaled, y_train)

    y_pred_rf = rf.predict(X_test_scaled)
    rf_probs = rf.predict_proba(X_test_scaled)[:, 1]
    rf_accuracy = accuracy_score(y_test, y_pred_rf)
    print(f"\n✅ Test Accuracy: {rf_accuracy:.4f}")
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred_rf, target_names=["Not Trustworthy", "Trustworthy"]))

    # --- Ensemble Preview (blended probability on test set) ---
    print("-" * 40)
    print("  Ensemble Preview (40% LR + 60% RF)")
    print("-" * 40)
    blended_probs = (0.4 * lr_probs) + (0.6 * rf_probs)
    blended_preds = (blended_probs >= 0.5).astype(int)
    ensemble_accuracy = accuracy_score(y_test, blended_preds)
    print(f"\n✅ Ensemble Accuracy: {ensemble_accuracy:.4f}")
    print(classification_report(y_test, blended_preds, target_names=["Not Trustworthy", "Trustworthy"]))

    # --- Persist all model artifacts ---
    os.makedirs(MODEL_DIR, exist_ok=True)

    logreg_path = os.path.join(MODEL_DIR, "logreg_model.pkl")
    rf_path = os.path.join(MODEL_DIR, "rf_model.pkl")
    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")

    joblib.dump(logreg, logreg_path)
    joblib.dump(rf, rf_path)
    joblib.dump(scaler, scaler_path)

    print(f"💾 Logistic Regression saved → {logreg_path}")
    print(f"💾 Random Forest saved       → {rf_path}")
    print(f"💾 Scaler saved              → {scaler_path}")

    # -------------------------------------------------------------------
    # 5. Compute & persist evaluation metrics
    # -------------------------------------------------------------------
    metrics = {
        "logistic_regression": _compute_metrics(y_test, y_pred_lr, lr_probs),
        "random_forest":       _compute_metrics(y_test, y_pred_rf, rf_probs),
        "ensemble":            _compute_metrics(y_test, blended_preds, blended_probs),
    }

    metrics_path = os.path.join(MODEL_DIR, "metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as fh:
        json.dump(metrics, fh, indent=2)

    print(f"📊 Metrics saved             → {metrics_path}")
    print("=" * 60)


# ---------------------------------------------------------------------------
# 6. Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    train_and_save()
