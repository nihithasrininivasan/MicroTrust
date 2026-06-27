# 🏦 MicroTrust — AI-Powered Alternative Credit Scoring

> **Building financial trust beyond traditional credit history.**

MicroTrust is an AI-powered fintech platform that enables financial inclusion by evaluating **alternative behavioral financial signals** instead of relying solely on traditional credit scores.

By analyzing factors such as **transaction consistency, bill payment behavior, income stability, and digital payment patterns**, MicroTrust generates an interpretable **trust score** that helps lenders assess creditworthiness for individuals with limited or no formal credit history.

Unlike conventional credit models that rely on past debt, MicroTrust leverages everyday financial behavior to create a **fairer, more transparent, and inclusive credit evaluation system.**

---

## 🚀 Features

### 🤖 AI-Powered Credit Scoring
- Ensemble Machine Learning model combining **Logistic Regression** and **Random Forest**
- Alternative behavioral financial signal analysis
- Real-time trust score generation
- Risk classification and confidence scoring

### 📊 Explainable AI
- Transparent credit score explanations
- Behavioral risk factor analysis
- Model confidence estimation
- Human-readable financial insights

### 💻 Full-Stack Application
- Interactive frontend interface
- RESTful backend services
- Dedicated FastAPI Machine Learning microservice
- Modular, production-ready architecture

---

## 🏗️ System Architecture

```text
                 User
                  │
                  ▼
        React Frontend
                  │
                  ▼
      Node.js + Express API
                  │
                  ▼
       FastAPI ML Service
                  │
                  ▼
   Logistic Regression
           +
      Random Forest
                  │
                  ▼
   MicroTrust Score + Risk Insights
```

---

## ⚙️ Workflow

1. Users enter behavioral financial information.
2. The backend validates the request and forwards it to the ML service.
3. Ensemble ML models evaluate multiple behavioral indicators.
4. Predictions are combined to generate:
   - MicroTrust Score
   - Risk Classification
   - Model Confidence
   - Key Risk Factors
5. Results are displayed through an intuitive dashboard.

---

## 🧠 Machine Learning Pipeline

MicroTrust combines multiple supervised learning models to improve prediction robustness while maintaining interpretability.

### Logistic Regression
- Transparent probability estimation
- Explainable decision boundaries

### Random Forest
- Captures nonlinear financial behavior
- Improves predictive performance

### Ensemble Scoring
Predictions from both models are combined using probability averaging to produce a stable and reliable trust score.

### Model Evaluation

The models are evaluated using:

- ROC-AUC
- Precision
- Recall
- F1 Score

---

## 📊 Example Response

```json
{
  "microtrust_score": 742,
  "risk_bucket": "Low Risk",
  "model_confidence": 0.87,
  "top_risk_factors": [
    "low_bill_payment_regularity",
    "low_upi_consistency"
  ]
}
```

---

# 🛠️ Tech Stack

## Frontend
- React
- TypeScript

## Backend
- Node.js
- Express.js

## Machine Learning
- Python
- FastAPI
- Scikit-learn
- NumPy
- Pandas

## ML Models
- Logistic Regression
- Random Forest
- Ensemble Probability Scoring

## Infrastructure
- Docker
- Render
- REST APIs
- Microservice Architecture

---

## 📂 Project Structure

```text
microtrust/
│
├── frontend/
├── backend/
├── ml-service/
├── models/
├── docs/
└── README.md
```

---

# 🚀 Running Locally

## Clone the Repository

```bash
git clone https://github.com/yourusername/microtrust.git
cd microtrust
```

---

## Start the Machine Learning Service

```bash
cd ml-service

python -m venv .venv

source .venv/bin/activate      # Linux / macOS
# .venv\Scripts\activate       # Windows

pip install -r requirements.txt

uvicorn app.main:app --reload
```

ML API Documentation

```
http://127.0.0.1:8000/docs
```

---

## Start the Backend

```bash
cd backend

npm install

npm start
```

---

## Start the Frontend

```bash
cd frontend

npm install

npm start
```

---

# 🌍 Impact

Traditional credit systems exclude millions of individuals who lack formal borrowing histories.

MicroTrust demonstrates how **AI, explainable machine learning, and alternative financial data** can be used to build a more inclusive and transparent credit evaluation system, enabling fairer access to financial opportunities.

---

# 🔮 Future Enhancements

- Federated Learning
- Time-Series Financial Behavior Analysis
- Graph Neural Networks for Financial Relationships
- Explainable AI Dashboard
- Continuous Model Retraining Pipeline
- Cloud-Native Deployment & Monitoring

---

# 👥 Team

Developed during a fintech hackathon by a multidisciplinary team focused on **Artificial Intelligence, Machine Learning, FinTech, and Financial Inclusion**.

---

## 📄 License

This project is licensed under the **MIT License**.
