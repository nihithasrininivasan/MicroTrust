"""
MicroTrust — Schema Inspector
Connects to the production DB and prints table counts + sample rows.
Run from project root: python tests/verify_schema.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "microtrust_v2.db")

def verify_database():
    print("--- MicroTrust Database Inspection ---")
    if not os.path.exists(DB_PATH):
        print(f"[ERROR] {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    tables = ["users", "behavior_signals", "community_trust", "scores"]
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
            count = cursor.fetchone()["count"]
            print(f"  [OK] Table '{table}': {count} rows")
            if count > 0:
                cursor.execute(f"SELECT * FROM {table} LIMIT 1")
                row = dict(cursor.fetchone())
                print(f"       Sample: {row}")
        except Exception as e:
            print(f"  [ERROR] Table '{table}': {e}")

    cursor.execute("SELECT name, type FROM sqlite_master WHERE type IN ('table','index') ORDER BY type, name")
    schema = cursor.fetchall()
    print("\n  [OK] Schema objects:")
    for row in schema:
        print(f"       {row['type']:6s}  {row['name']}")

    conn.close()
    print("\n--- Inspection Complete ---")

if __name__ == "__main__":
    verify_database()
