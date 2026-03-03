# MicroTrust

> **Production-grade behavioral trust scoring engine** — built on SQLite with ML-ready signal versioning, community trust aggregation, and a FastAPI intelligence layer.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

---

## 🏗️ Architecture

```
MicroTrust/
├── backend/                # Node.js relay/gateway service
│   ├── server.js           # Entry point
│   ├── app.js              # Express app
│   ├── routes/             # API Endpoints
│   ├── controllers/        # Business logic
│   └── models/             # Mongoose schemas
│
├── frontend/               # React / Vite SPA
│   ├── src/                # Components and Views
│   ├── public/             # Static assets
│   └── package.json        
│
├── ml-service/             # FastAPI ML scoring microservice
│   ├── app/
│   │   ├── main.py         # ML service entry point
│   │   ├── routes/score.py # POST /score endpoint
│   │   └── models/score.py # Pydantic request/response models
│   └── pipeline/
│       └── scoring_pipeline.py  # Core scoring logic
│
├── db engineer/            # Legacy Python Intelligence Layer (SQLite)
│   ├── app.py              # Legacy FastAPI entry point
│   └── database.py         # SQLite engine
│
└── tests/                  # Verification & integration test suite
```

---

## 🚀 Running the Frontend (Local)

This project contains a modern React frontend connected to the MicroTrust API.

**Prerequisites:** Node.js

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set the Environment variables:**
   Create a `.env.local` file and add your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```

*(You can also view the original prototype in AI Studio: https://ai.studio/apps/49f638a9-e818-45b9-8a31-531a300521a8)*

---

## ⚙️ Running the Backend Services (Local)

### 1. Node.js Gateway API
```bash
cd backend
npm install
npm run seed  # One-time DB seed
npm start
# http://localhost:5000
```

### 2. Python ML Microservice
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # (or .\venv\Scripts\activate on Windows)
pip install -r requirements.txt
python app/main.py
# http://localhost:8000
```

---

## 📡 API Endpoints (Gateway)

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Engine status check |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and get JWT |
| `POST` | `/api/consent` | Record data sharing consent |
| `GET` | `/api/score/:userId` | Get calculated trust score |
| `POST` | `/api/lenders/endorsement` | Match user with loan lenders |

---

## 🧪 Running Tests

```bash
# Schema + row counts on production DB
python tests/verify_schema.py

# Full logic tests (temp DB, zero side effects)
python tests/verify_db_comprehensive.py

# Integration tests against live production DB
python tests/test_manager.py
```
