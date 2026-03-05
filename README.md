MicroTrust — AI-Powered Alternative Credit Scoring

MicroTrust is an AI-driven platform that enables financial inclusion for individuals without traditional credit history. By analyzing alternative behavioral signals such as transaction consistency, bill payment patterns, and income stability, MicroTrust generates a trust-based credit score that helps lenders evaluate creditworthiness beyond conventional systems.

Unlike traditional credit models that rely on past debt, MicroTrust evaluates everyday financial behavior to build a fairer and more inclusive credit system.

Live Product Experience

MicroTrust is designed as a complete user-facing platform, allowing users or financial institutions to generate a trust score directly through an intuitive interface.

Users can:

Enter behavioral financial signals through the app

Generate a MicroTrust Score instantly

View risk classification and model confidence

Understand which behaviors influenced their score

This transforms complex machine learning predictions into a clear, transparent financial trust profile.

Demo Flow

The platform works through the following pipeline:

User Interface (Frontend App)
        ↓
Node.js Backend API
        ↓
Python ML Scoring Service
        ↓
MicroTrust Score + Risk Insights

A user enters behavioral signals through the frontend interface, which are processed by the backend and evaluated by the AI scoring engine to produce an interpretable credit score.

Core Features
Full Product Interface

MicroTrust includes a fully functional frontend application that allows users to interact with the scoring system in a simple and intuitive way.

Users can:

Input behavioral financial indicators

Generate a trust score instantly

View risk classification and explanations

This makes the platform accessible to both lenders and individuals.

AI Ensemble Credit Scoring Engine

The platform uses an ensemble machine learning model combining:

Logistic Regression
Provides interpretable probability estimates and transparent decision logic.

Random Forest
Captures complex nonlinear relationships between financial behavior signals.

The models are combined using probability averaging to produce a robust and stable credit risk prediction.

Explainable AI

MicroTrust provides transparency by returning key behavioral factors that influenced the score.

Example response:

{
  "microtrust_score": 742,
  "risk_bucket": "Low Risk",
  "model_confidence": 0.87,
  "top_risk_factors": [
    "low_bill_payment_regularity",
    "low_upi_consistency"
  ]
}

This allows both lenders and users to understand why a score was assigned.

Model Evaluation

The system evaluates model performance using standard machine learning metrics:

ROC-AUC – Measures how well the model distinguishes between reliable and risky users.

F1 Score – Balances precision and recall to ensure fair classification.

Our ensemble model achieves strong performance with a ROC-AUC above 0.9, demonstrating effective risk prediction.

Technology Stack
Frontend

Flutter / React Native (or specify your framework)

Responsive UI for interactive scoring experience

Backend

Node.js

Express.js

REST API architecture

Machine Learning Service

Python

FastAPI

Scikit-learn

NumPy

Pandas

ML Models

Logistic Regression

Random Forest

Ensemble probability scoring

Infrastructure

Microservice architecture

Cloud deployment (Render)

Running the Project Locally

Clone the repository:

git clone <repo-url>
cd microtrust
Start the ML Scoring Service
cd ml-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

The ML API will be available at:

http://127.0.0.1:8000/docs
Start the Backend Server
cd backend
npm install
npm start
Start the Frontend App
cd frontend
npm install
npm start

The application interface will launch locally, allowing users to interact with the MicroTrust scoring system.

Impact

MicroTrust aims to bridge the gap between the informal economy and formal financial systems by transforming everyday financial behavior into measurable trust signals.

By leveraging AI, explainable models, and alternative financial data, MicroTrust enables fairer access to credit for underserved populations.

Team

Built by a team of engineers focused on AI, fintech, and financial inclusion.
