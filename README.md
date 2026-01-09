# 🚀 AI-Driven Business Intelligence Dashboard

A full-stack **Business Intelligence (BI) simulation platform** that allows users to analyze subscription-based SaaS metrics, run real-time “what-if” simulations, and generate AI-assisted business insights.

This project is designed to demonstrate **real-world analytics engineering**, not just charts.

---

## 🔗 Live Demo

- **Frontend (Dashboard):**  
  https://ai-business-intelligence-dashboard.vercel.app

- **Backend (API):**  
  https://ai-bi-backend.onrender.com

---

## 🧠 What This Project Does

This dashboard simulates how executives and analysts evaluate SaaS business performance.

Users can:
- View **live KPIs** (MRR, churn, active subscriptions)
- Edit subscription data directly in the UI
- Delete customers to simulate churn scenarios
- Apply changes and instantly see:
  - KPI deltas vs baseline
  - Updated charts
  - AI-generated business insights

All calculations are performed **server-side**, ensuring realistic analytics behavior.

---

## 📊 Key Features

### 📌 KPI Analytics
- Total Monthly Recurring Revenue (MRR)
- Churn Rate
- Total Subscriptions
- Active Subscriptions
- Baseline vs Simulation **delta indicators**

### 📈 Visual Analytics
- Monthly MRR trend (Line Chart)
- Subscription health distribution (Pie Chart)
- Fully responsive (desktop, tablet, mobile)

### 🧪 Scenario Simulation
- Editable subscription table
- Row deletion to simulate churn
- “Apply Changes” triggers backend recalculation
- Confirmation modal + smooth UX flow

### 🤖 AI Business Insights
- Automatically generated insights based on KPI changes
- Human-readable explanations suitable for decision-makers

### 🎨 UX & UI
- Executive-style dark dashboard
- Intro splash screen
- Responsive layout
- Centered modal feedback
- Custom favicon and branding

---

## 🏗️ Architecture Overview

Frontend (React)
↓ REST API
Backend (FastAPI)
↓
CSV-based Subscription Data
↓
Real-time KPI Computation


- **Frontend:** React, Recharts, modern state management
- **Backend:** FastAPI, Pandas
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## ⚙️ Tech Stack

### Frontend
- React (Create React App)
- Recharts (Charts & Graphs)
- CSS (custom executive UI)
- Deployed on **Vercel**

### Backend
- FastAPI
- Pandas
- Uvicorn
- CSV-based data modeling
- Deployed on **Render**

---

## 🧮 Data & Logic Highlights

- KPIs are **not hardcoded**
- All metrics are calculated dynamically from subscription data
- Frontend never mutates source data permanently
- Simulations are session-based (safe & realistic)
- Backend enforces business logic

---

## 🧑‍💼 Why This Project Matters (For Recruiters)

This project demonstrates:
- Business understanding of SaaS metrics
- Full-stack development skills
- Data analytics & simulation thinking
- API design and integration
- Real production deployment experience
- Debugging real-world issues (CORS, cold starts, async loading)

This is **not a tutorial project** — it reflects how internal BI tools are built in real companies.

---

## 🛠️ Local Setup (Optional)

### Backend
``bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Frontend

cd frontend/dashboard
npm install
npm start

👤 Author

Mohammed Masood Ali

Business Analytics & Computer Applications

Focused on Data Analytics, BI Engineering, and AI-driven systems

📄 License
This project is for educational and portfolio purposes.


---

## ✅ What to do next (very simple)

1. Open your GitHub repo
2. Open `README.md`
3. **Delete everything inside**
4. **Paste the above content**
5. Save

Then push:

``bash
git add README.md
git commit -m "Add professional project README"
git push

