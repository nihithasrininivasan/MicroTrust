import sqlite3
try:
    conn = sqlite3.connect("test_direct.db")
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)")
    cursor.execute("INSERT INTO test (name) VALUES ('Sarvesh')")
    conn.commit()
    cursor.execute("SELECT * FROM test")
    print(f"Direct sqlite3 test: {cursor.fetchone()}")
    conn.close()
except Exception as e:
    print(f"Direct sqlite3 error: {e}")
