print("AI Business Intelligence Backend Started")

from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ BASIC ENDPOINTS ------------------

@app.get("/")
def root():
    return {"message": "AI Business Intelligence API running"}

@app.get("/kpis")
def get_kpis():
    summary = pd.read_csv("../data/kpi_summary.csv")
    return summary.to_dict(orient="records")[0]

@app.get("/monthly-mrr")
def get_monthly_mrr():
    monthly = pd.read_csv("../data/kpi_monthly_mrr.csv")
    return monthly.to_dict(orient="records")

@app.get("/insights")
def get_insights():
    summary = pd.read_csv("../data/kpi_summary.csv")
    monthly = pd.read_csv("../data/kpi_monthly_mrr.csv")

    latest = monthly.iloc[-1]
    previous = monthly.iloc[-2]

    insights = []

    if latest["mrr_amount"] > previous["mrr_amount"]:
        insights.append(
            f"Monthly recurring revenue increased from {int(previous['mrr_amount'])} to {int(latest['mrr_amount'])}, indicating revenue growth."
        )
    else:
        insights.append(
            "Monthly recurring revenue declined compared to the previous month, suggesting potential churn or reduced upgrades."
        )

    churn_rate = summary.loc[0, "churn_rate_percent"]

    if churn_rate > 10:
        insights.append(
            f"Churn rate is {churn_rate:.2f}%, which is relatively high and may require retention strategies."
        )
    else:
        insights.append(
            f"Churn rate is {churn_rate:.2f}%, indicating healthy customer retention."
        )

    return {"insights": insights}

@app.get("/favicon.ico")
def favicon():
    return {}

# ------------------ RAW DATA PREVIEW ------------------

@app.get("/subscriptions")
def get_subscriptions():
    try:
        df = pd.read_csv("../data/subscriptions.csv")

        df.columns = [col.strip() for col in df.columns]
        df = df.fillna("")
        df = df.astype(str)

        return df.head(50).to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}

# ------------------ SIMULATION ENGINE ------------------

@app.post("/simulate")
def simulate_kpis(payload: list = Body(...)):
    df = pd.DataFrame(payload)

    # 🔹 REMOVE DELETED ROWS (empty subscription_id)
    if "subscription_id" in df.columns:
        df = df[df["subscription_id"].astype(str).str.strip() != ""]

    # 🔹 ENSURE NUMERIC COLUMNS
    for col in ["mrr_amount", "churn_flag"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    # ---------------- KPI CALCULATIONS ----------------

    total_subscriptions = len(df)

    # 🔹 DERIVED CHURN LOGIC (IMPORTANT FIX)
    if "churn_flag" in df.columns:
        churned = (
            (df["churn_flag"] == 1) |
            (df["mrr_amount"] == 0)
        ).sum()
    else:
        churned = (df["mrr_amount"] == 0).sum()

    active = total_subscriptions - churned
    total_mrr = df["mrr_amount"].sum()
    churn_rate = (
        (churned / total_subscriptions) * 100
        if total_subscriptions > 0 else 0
    )

    kpis = {
        "total_subscriptions": int(total_subscriptions),
        "active_subscriptions": int(active),
        "churned_subscriptions": int(churned),
        "total_mrr": round(float(total_mrr), 2),
        "churn_rate_percent": round(float(churn_rate), 2),
    }

    # ---------------- MONTHLY MRR ----------------

    monthly_mrr = []
    if "start_date" in df.columns:
        df["start_date"] = pd.to_datetime(df["start_date"], errors="coerce")
        monthly_mrr = (
            df.groupby(df["start_date"].dt.to_period("M"))["mrr_amount"]
            .sum()
            .reset_index()
        )
        monthly_mrr["month"] = monthly_mrr["start_date"].astype(str)
        monthly_mrr = monthly_mrr[["month", "mrr_amount"]]
        monthly_mrr = monthly_mrr.to_dict(orient="records")

    # ---------------- AI INSIGHTS (SIMULATED) ----------------

    insights = []

    insights.append(
        f"After simulation, total MRR is ₹{int(total_mrr):,}, reflecting the impact of edited subscription values."
    )

    if churn_rate > 10:
        insights.append(
            f"Simulated churn rate is {churn_rate:.2f}%, which may negatively impact revenue growth."
        )
    else:
        insights.append(
            f"Simulated churn rate is {churn_rate:.2f}%, indicating healthy retention under this scenario."
        )

    if active < total_subscriptions:
        insights.append(
            f"Active subscriptions reduced to {active}, directly affecting recurring revenue stability."
        )

    return {
        "kpis": kpis,
        "monthly_mrr": monthly_mrr,
        "insights": insights
    }
