import { useEffect, useState, useRef } from "react";
import "./App.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import IntroScreen from "./IntroScreen";

const API = "http://127.0.0.1:8000";
const PIE_COLORS = ["#3b82f6", "#ef4444"];

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const [subscriptions, setSubscriptions] = useState([]);
  const [baselineKpis, setBaselineKpis] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [insights, setInsights] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const topRef = useRef(null);

  /* ---------------- INTRO ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetch(`${API}/subscriptions`)
      .then((res) => res.json())
      .then((rows) => {
        setSubscriptions(rows);
        return fetch(`${API}/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rows),
        });
      })
      .then((res) => res.json())
      .then((data) => {
        setBaselineKpis(data.kpis);
        setKpis(data.kpis);
        setMonthlyData(data.monthly_mrr);
        setInsights(data.insights);
      });
  }, []);

  /* ---------------- HELPERS ---------------- */
  const handleCellChange = (rowIndex, column, value) => {
    const updated = [...subscriptions];
    updated[rowIndex] = { ...updated[rowIndex], [column]: value };
    setSubscriptions(updated);
  };

  const handleDeleteRow = (rowIndex) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== rowIndex));
  };

  const applyChanges = () => {
    fetch(`${API}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscriptions),
    })
      .then((res) => res.json())
      .then((data) => {
        setKpis(data.kpis);
        setMonthlyData(data.monthly_mrr);
        setInsights(data.insights);
        setShowPopup(true);
      });
  };

  const closePopup = () => {
    setShowPopup(false);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const delta = (current, base) => {
    if (!baselineKpis) return "–";
    const diff = current - base;
    if (diff === 0) return "– 0";
    return diff > 0
      ? `▲ ${diff.toLocaleString()}`
      : `▼ ${Math.abs(diff).toLocaleString()}`;
  };

  /* ---------------- PIE DATA ---------------- */
  const pieData =
    kpis && baselineKpis
      ? [
          { name: "Active", value: kpis.active_subscriptions },
          {
            name: "Churned",
            value: kpis.total_subscriptions - kpis.active_subscriptions,
          },
        ]
      : [];

  if (showIntro) return <IntroScreen />;

  /* ---------------- DASHBOARD ---------------- */
  return (
    <div className="container" ref={topRef}>
      <h1>AI Business Intelligence Dashboard</h1>
      <p className="mode-label">
        Baseline Mode — Live KPIs computed from subscriptions.csv
      </p>

      {/* KPI CARDS */}
      <div className="kpi-row">
        <div className="kpi-card">
          <h3>Total MRR</h3>
          <p>₹ {kpis?.total_mrr.toLocaleString()}</p>
          <small>{delta(kpis.total_mrr, baselineKpis.total_mrr)}</small>
        </div>

        <div className="kpi-card">
          <h3>Churn Rate</h3>
          <p>{kpis?.churn_rate_percent}%</p>
          <small>
            {delta(
              kpis.churn_rate_percent,
              baselineKpis.churn_rate_percent
            )}
          </small>
        </div>

        <div className="kpi-card">
          <h3>Total Subscriptions</h3>
          <p>{kpis?.total_subscriptions}</p>
          <small>
            {delta(
              kpis.total_subscriptions,
              baselineKpis.total_subscriptions
            )}
          </small>
        </div>

        <div className="kpi-card">
          <h3>Active Subscriptions</h3>
          <p>{kpis?.active_subscriptions}</p>
          <small>
            {delta(
              kpis.active_subscriptions,
              baselineKpis.active_subscriptions
            )}
          </small>
        </div>
      </div>

      {/* CHARTS */}
      <div className="chart-grid">
        <div className="chart-container">
          <h2>Monthly MRR Signal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mrr_amount"
                stroke="#3b82f6"
                strokeWidth={3}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Subscription Health</h2>
          <div className="pie-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI ANALYSIS */}
      <div className="chart-container">
        <h2>AI Business Analysis</h2>
        <ul>
          {insights.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>

      {/* TABLE */}
      <div className="chart-container table-wrap">
        <h2>Simulation Control Panel</h2>

        <table>
          <thead>
            <tr>
              {subscriptions[0] &&
                Object.keys(subscriptions[0]).map((k) => (
                  <th key={k}>{k}</th>
                ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((row, i) => (
              <tr key={i}>
                {Object.keys(row).map((k) => (
                  <td key={k}>
                    <input
                      value={row[k]}
                      onChange={(e) =>
                        handleCellChange(i, k, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteRow(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="apply-btn" onClick={applyChanges}>
          Apply Changes
        </button>
      </div>

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Simulation Applied</h3>
            <p>KPI metrics updated successfully.</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
