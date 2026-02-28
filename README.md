# MicroTrust

> **Production-grade behavioral trust scoring engine** — built on SQLite with ML-ready signal versioning, community trust aggregation, and a FastAPI intelligence layer.

---

## Architecture

```
db engineer/
├── app.py                  # FastAPI entry point (Intelligence Layer API)
├── database.py             # SQLite engine — ProductionDB (pooling, indices, constraints)
├── signal_manager.py       # All DB operations: users, signals, endorsements, scores
├── models.py               # Typed Python dataclasses mirroring the SQLite schema
├── init_db.py              # One-time DB initialization script
├── microtrust_v2.db        # Production SQLite database
│
├── ml-service/             # FastAPI ML scoring microservice
│   ├── app/
│   │   ├── main.py         # ML service entry point
│   │   ├── routes/score.py # POST /score endpoint
│   │   └── models/score.py # Pydantic request/response models
│   └── pipeline/
│       └── scoring_pipeline.py  # Core scoring logic (risk bucketing)
│
├── backend/                # Node.js relay/gateway service
│   ├── server.js           # Entry point
│   └── src/
│       ├── app.js
│       ├── routes/         # score.routes.js
│       ├── services/       # mlClient.service.js
│       └── middleware/     # errorHandler.js
│
├── tests/                  # Verification & integration test suite
│   ├── verify_schema.py    # Inspect production DB schema and row counts
│   ├── verify_db_comprehensive.py  # Full logic tests on temp DB
│   └── test_manager.py     # Integration tests against live production DB
│
├── docker/                 # Dockerfiles
│   ├── backend.Dockerfile
│   └── ml.Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Database Schema

| Table | Key Columns | Constraints |
|---|---|---|
| `users` | `firebase_uid`, `phone_number`, `aadhaar_hash` | UNIQUE on all 3 |
| `behavior_signals` | `user_id`, `signal_key`, `signal_value`, `timestamp` | FK → users |
| `community_trust` | `endorser_id`, `recipient_id`, `endorsement_type` | UNIQUE(endorser, recipient) — blocks trust farming |
| `scores` | `user_id`, `microtrust_score`, `repayment_probability`, `shap_explanations` | FK → users |

**Performance Indices:** `ix_signals_user_key_ts`, `ix_trust_recipient`, `ix_scores_user_latest`, `ix_users_firebase`

---

## Running Locally

### 1. Install dependencies
```bash
pip install fastapi uvicorn
```

### 2. Initialize the database
```bash
python init_db.py
```

### 3. Start the API server
```bash
python app.py
# → http://127.0.0.1:8000
```

### 4. Start the ML microservice
```bash
cd ml-service
uvicorn app.main:app --port 8001 --reload
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Live dashboard (HTML) |
| `GET` | `/health` | Engine status + DB counts |
| `GET` | `/users` | All registered users |
| `GET` | `/score/{user_id}` | Latest MicroTrust score |
| `GET` | `/trust/{user_id}` | Community trust network weight |
| `GET` | `/docs` | Interactive Swagger UI |

---

## Running Tests

```bash
# Schema + row counts on production DB
python tests/verify_schema.py

# Full logic tests (temp DB, zero side effects)
python tests/verify_db_comprehensive.py

# Integration tests against live production DB
python tests/test_manager.py
```

---

## Key Features

- **Signal Versioning** — Correlated subquery returns only the latest value per `signal_key`, enabling accurate ML feature snapshots over time.
- **Trust Farming Prevention** — `UNIQUE(endorser_id, recipient_id)` constraint at the DB level blocks duplicate endorsements.
- **Weighted Trust Aggregation** — Network trust weight is the sum of normalized endorser scores (`score / 900`), rewarding high-quality networks.
- **Production Indices** — Composite indices on `(user_id, signal_key, timestamp DESC)` and `(user_id, created_at DESC)` for fast versioned lookups.