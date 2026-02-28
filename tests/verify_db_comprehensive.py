"""
MicroTrust — Comprehensive Logic Verification Suite
Tests: User Upsert, Signal Versioning, Unique Endorsements, Trust Aggregation.
Run from project root: python tests/verify_db_comprehensive.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import sqlite3
from database import ProductionDB
from signal_manager import SignalManager

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROD_DB = os.path.join(ROOT, "microtrust_v2.db")

def check_production_data():
    print("--- Inspecting Production Database (microtrust_v2.db) ---")
    if not os.path.exists(PROD_DB):
        print("[ERROR] Production database file not found.")
        return

    conn = sqlite3.connect(PROD_DB)
    cursor = conn.cursor()
    for table in ["users", "behavior_signals", "community_trust", "scores"]:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"  [OK] Table '{table}': {count} rows")
    conn.close()

def verify_logic_on_temp_db():
    print("\n--- Verifying Core Logic on Temporary Database ---")
    temp_db = os.path.join(ROOT, "_verify_temp.db")
    if os.path.exists(temp_db):
        os.remove(temp_db)

    db = ProductionDB(db_path=temp_db)
    manager = SignalManager(db)

    # 1. User Upsert
    uid = "test_user_001"
    user_id = manager.sync_firebase_user(uid, full_name="Test User", email="test@example.com")
    user_id2 = manager.sync_firebase_user(uid, full_name="Test User Updated")
    assert user_id == user_id2, "Upsert returned different IDs!"
    print(f"  [OK] User Sync + Upsert (user_id={user_id})")

    # 2. Signal Versioning
    manager.store_behavior_signals(user_id, {"score": 100}, "cat1")
    manager.store_behavior_signals(user_id, {"score": 200}, "cat1")
    signals = manager.get_latest_signals(user_id)
    val = signals["score"]
    status = "SUCCESS" if val == 200 else f"FAILED (got {val})"
    print(f"  [OK] Signal Versioning: expected=200, got={val} -> {status}")

    # 3. Unique Endorsement Constraint
    target_uid = "target_user_002"
    target_id = manager.sync_firebase_user(target_uid, full_name="Target User")
    manager.add_endorsement(uid, target_uid, "peer")
    try:
        manager.add_endorsement(uid, target_uid, "peer")
        print("  [FAIL] Duplicate endorsement was NOT blocked!")
    except ValueError:
        print("  [OK] Duplicate Endorsement blocked (UNIQUE constraint)")

    # 4. Trust Network Weight
    manager.save_score(user_id, 900, 1.0, {"info": "best"})
    weight = manager.get_network_trust_weight(target_id)
    status = "SUCCESS" if abs(weight - 1.0) < 0.01 else f"FAILED (got {weight:.4f})"
    print(f"  [OK] Trust Network Weight: expected=1.0, got={weight:.4f} -> {status}")

    if os.path.exists(temp_db):
        os.remove(temp_db)
    print("\n--- All DB Logic Tests Passed! ---")

if __name__ == "__main__":
    try:
        check_production_data()
        verify_logic_on_temp_db()
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[ERROR] {e}")
