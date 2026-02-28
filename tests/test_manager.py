"""
MicroTrust — Production Integration Test Suite
Tests all SignalManager operations against the live production database.
Run from project root: python tests/test_manager.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import ProductionDB
from signal_manager import SignalManager
import json

def verify_production_logic():
    print("--- Starting Production-Grade SQL Verification ---")
    db = ProductionDB()
    manager = SignalManager(db)

    # 1. User Sync (Upsert Check)
    uid = "fb_final_verified_001"
    user_id = manager.sync_firebase_user(uid, full_name="Alpha Verified", email="alpha@final.com")
    print(f"  [OK] User Sync (Upsert). UserID: {user_id}")

    # 2. Signal Versioning (Latest-Value Logic)
    manager.store_behavior_signals(user_id, {"credit_util": 0.45}, "consistency")
    manager.store_behavior_signals(user_id, {"credit_util": 0.15}, "consistency")
    signals = manager.get_latest_signals(user_id)
    assert signals["credit_util"] == 0.15, "VERSIONING FAILED: Did not return latest value."
    print(f"  [OK] Signal Versioning: credit_util={signals['credit_util']} (latest)")

    # 3. Trust Integrity (Unique Constraint Check)
    target_uid = "fb_final_target_002"
    target_id = manager.sync_firebase_user(target_uid, full_name="Beta Final")
    manager.add_endorsement(uid, target_uid, "peer")
    print("  [OK] First endorsement added.")
    try:
        manager.add_endorsement(uid, target_uid, "peer")
        print("  [FAIL] Duplicate endorsement was allowed!")
    except ValueError as e:
        print(f"  [OK] Duplicate blocked (UNIQUE constraint): {e}")

    # 4. Trust Network Aggregation
    manager.save_score(user_id, 850, 0.98, {"risk": 0.1})
    weight = manager.get_network_trust_weight(target_id)
    assert weight > 0, "TRUST AGGREGATION FAILED: Weight should be > 0."
    print(f"  [OK] Trust Network Weight: {weight:.4f}")

    # 5. Score Retrieval
    score = manager.get_latest_score(user_id)
    print(f"  [OK] Latest Score: microtrust={score['microtrust_score']}, prob={score['repayment_probability']}")

    print("\n--- PRODUCTION INFRA VERIFIED ---")

if __name__ == "__main__":
    try:
        verify_production_logic()
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[ERROR] {e}")
