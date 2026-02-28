"""
MicroTrust — FastAPI Application Entry Point
=============================================
Exposes the Intelligence Layer API with endpoints for:
  - Dashboard (HTML)
  - Health check
  - Users listing
  - User scores
  - Trust network weight
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from database import ProductionDB
from signal_manager import SignalManager

app = FastAPI(
    title="MicroTrust Intelligence Layer API",
    description="Production-grade SQLite engine with signal versioning, trust aggregation, and ML scoring.",
    version="2.0.0",
)

db = ProductionDB()
manager = SignalManager(db)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/health", tags=["System"])
def health_check():
    """Returns engine status and live DB record counts."""
    conn = manager._get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM users")
    users = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM behavior_signals")
    signals = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM scores")
    scores = cursor.fetchone()[0]
    conn.close()
    return {
        "status": "ok",
        "engine": "SQLite (Production-Grade)",
        "counts": {"users": users, "signals": signals, "scores": scores},
    }


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------

@app.get("/", response_class=HTMLResponse, tags=["Dashboard"])
def dashboard():
    """HTML dashboard showing live DB stats and API links."""
    conn = manager._get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM behavior_signals")
    signal_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM scores")
    score_count = cursor.fetchone()[0]
    conn.close()

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>MicroTrust — Engine Dashboard</title>
        <style>
            * {{ box-sizing: border-box; margin: 0; padding: 0; }}
            body {{ font-family: 'Segoe UI', sans-serif; background: #0f1117; color: #e0e0e0; padding: 40px; }}
            h1 {{ font-size: 1.8rem; color: #58a6ff; margin-bottom: 6px; }}
            p.subtitle {{ color: #8b949e; margin-bottom: 30px; font-size: 0.9rem; }}
            .grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }}
            .card {{ background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 24px; }}
            .card h3 {{ color: #8b949e; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }}
            .card .stat {{ font-size: 2.5rem; font-weight: 700; color: #58a6ff; }}
            .links {{ background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 24px; }}
            .links h3 {{ color: #8b949e; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }}
            .links a {{ display: inline-block; margin-right: 16px; color: #58a6ff; text-decoration: none; font-size: 0.9rem; }}
            .links a:hover {{ text-decoration: underline; }}
            .badge {{ display: inline-block; background: #1f6f3a; color: #56d364; border-radius: 20px; padding: 2px 12px; font-size: 0.75rem; margin-left: 10px; vertical-align: middle; }}
        </style>
    </head>
    <body>
        <h1>MicroTrust Engine <span class="badge">Online</span></h1>
        <p class="subtitle">Production-Grade SQLite &nbsp;|&nbsp; Indices &bull; Constraints &bull; Trust Aggregation &bull; Signal Versioning</p>
        <div class="grid">
            <div class="card"><h3>Users</h3><div class="stat">{user_count}</div></div>
            <div class="card"><h3>Behavior Signals</h3><div class="stat">{signal_count}</div></div>
            <div class="card"><h3>MicroTrust Scores</h3><div class="stat">{score_count}</div></div>
        </div>
        <div class="links">
            <h3>Developer Tools</h3>
            <a href="/docs">Interactive API Docs (Swagger)</a>
            <a href="/health">Health JSON</a>
            <a href="/users">Users JSON</a>
        </div>
    </body>
    </html>
    """


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

@app.get("/users", tags=["Users"])
def get_all_users():
    """Returns all registered users."""
    conn = manager._get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return users


# ---------------------------------------------------------------------------
# Scores
# ---------------------------------------------------------------------------

@app.get("/score/{user_id}", tags=["Scoring"])
def get_user_score(user_id: int):
    """Returns the latest MicroTrust score for a user."""
    score = manager.get_latest_score(user_id)
    if not score:
        raise HTTPException(status_code=404, detail=f"No score found for user_id={user_id}")
    return score


# ---------------------------------------------------------------------------
# Trust Network
# ---------------------------------------------------------------------------

@app.get("/trust/{user_id}", tags=["Trust Network"])
def get_trust_weight(user_id: int):
    """Returns the aggregated community trust weight for a user."""
    conn = manager._get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    conn.close()
    weight = manager.get_network_trust_weight(user_id)
    return {"user_id": user_id, "network_trust_weight": round(weight, 4)}


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
