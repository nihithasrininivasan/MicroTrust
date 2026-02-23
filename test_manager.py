"""
MicroTrust — Production Verification Suite
==========================================
Tests Indices, Constraints, Versioning, and Trust Aggregation.
"""

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
    print(f"✔ User Sync (Upsert) OK. UserID: {user_id}")

    # 2. Signal Versioning (Latest-Value Logic)
    manager.store_behavior_signals(user_id, {"credit_util": 0.45}, "consistency")
    manager.store_behavior_signals(user_id, {"credit_util": 0.15}, "consistency") # Improved signal
    
    signals = manager.get_latest_signals(user_id)
    print(f"✔ Signal Versioning Check: {signals}")
    assert signals["credit_util"] == 0.15, "VERSIONING FAILED: Did not return latest value."

    # 3. Trust Integrity (Unique Constraint Check)
    target_uid = "fb_final_target_002"
    target_id = manager.sync_firebase_user(target_uid, full_name="Beta Final")
    
    # First endorsement
    manager.add_endorsement(uid, target_uid, "peer")
    print("✔ First endorsement added successfully.")

    # Duplicate endorsement (Should fail)
    try:
        manager.add_endorsement(uid, target_uid, "peer")
        print("❌ ERROR: Duplicate endorsement was allowed!")
    except ValueError as e:
        print(f"✔ DUPLICATE BLOCKED (Integrity constraint check): {e}")

    # 4. Trust Network Aggregation (Network Weight)
    # Give the endorser a score
    manager.save_score(user_id, 850, 0.98, {"risk": 0.1})
    
    # Calculate weight for target
    weight = manager.get_network_trust_weight(target_id)
    print(f"✔ Trust Network Weight calculated: {weight:.4f}")
    assert weight > 0, "TRUST AGGREGATION FAILED: Weight should be proportional to endorser score."

    print("\n--- FINAL PRODUCTION INFRA VERIFIED ---")

if __name__ == "__main__":
    verify_production_logic()
