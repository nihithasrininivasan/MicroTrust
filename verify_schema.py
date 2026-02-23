import sqlite3
import json

def verify_database():
    print("--- MicroTrust Database Inspection ---")
    conn = sqlite3.connect("microtrust_v2.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    tables = ["users", "behavior_signals", "community_trust", "scores"]
    
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
            count = cursor.fetchone()["count"]
            print(f"Table '{table}': {count} rows found.")
            
            if count > 0:
                cursor.execute(f"SELECT * FROM {table} LIMIT 1")
                row = dict(cursor.fetchone())
                print(f"  Sample Row: {row}")
        except Exception as e:
            print(f"Error checking table '{table}': {e}")
            
    conn.close()
    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    verify_database()
