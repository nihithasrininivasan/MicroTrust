from fastapi import FastAPI, HTTPException
from typing import Dict, Any, List
from database import ProductionDB
from signal_manager import SignalManager
from fastapi.responses import HTMLResponse

app = FastAPI(title="MicroTrust Intelligence Layer API")

# Initialize Manager with ProductionDB
db = ProductionDB()
manager = SignalManager(db)

@app.get("/", response_class=HTMLResponse)
def read_root():
    conn = manager._get_conn()
    cursor = conn.cursor()
    
    # Get counts for the dashboard
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM behavior_signals")
    signal_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM scores")
    score_count = cursor.fetchone()[0]
    conn.close()

    html_content = f"""
    <html>
        <head>
            <title>MicroTrust Portable Dashboard</title>
            <style>
                body {{ font-family: sans-serif; margin: 40px; background: #f4f7f6; }}
                .card {{ background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }}
                h1 {{ color: #2c3e50; }}
                .stat {{ font-size: 24px; font-weight: bold; color: #3498db; }}
                a {{ color: #3498db; text-decoration: none; }}
            </style>
        </head>
        <body>
            <h1>🗄️ MicroTrust Portable Engine (Senior Infra)</h1>
            <div class="card">
                <p><strong>Status:</strong> <span style="color: green;">Online (Senior Logic Active)</span></p>
                <p><strong>Database:</strong> Local Production-Grade SQLite</p>
                <p><strong>Features:</strong> Indices, Constraints, Trust Aggregation, Versioning</p>
            </div>
            <div style="display: flex; gap: 20px;">
                <div class="card" style="flex: 1;">
                    <h3>Users</h3>
                    <div class="stat">{user_count}</div>
                    <p><a href="/users">View JSON Data</a></p>
                </div>
                <div class="card" style="flex: 1;">
                    <h3>Behavior Signals</h3>
                    <div class="stat">{signal_count}</div>
                </div>
                <div class="card" style="flex: 1;">
                    <h3>MicroTrust Scores</h3>
                    <div class="stat">{score_count}</div>
                </div>
            </div>
            <div class="card">
                <h3>Developer Tools</h3>
                <ul>
                    <li><a href="/docs">Interactive API Documentation</a></li>
                </ul>
            </div>
        </body>
    </html>
    """
    return html_content

@app.get("/users")
def get_all_users():
    conn = manager._get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return users

@app.get("/score/{user_id}")
def get_user_score(user_id: int):
    score = manager.get_latest_score(user_id)
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    return score

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
