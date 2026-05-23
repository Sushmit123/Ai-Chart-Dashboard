import React from "react";
import ChartCard from "./ChartCard";

/* ── Animated loading state ─────────────────────────────── */
const LoadingState = () => {
  const steps = [
    { label: "Reading your data file…", delay: 0 },
    { label: "AI is understanding your data…", delay: 800 },
    { label: "Picking the best chart types…", delay: 2000 },
    { label: "Building your dashboard…", delay: 4000 },
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const timers = steps.map((s, i) =>
      setTimeout(() => setActiveStep(i), s.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-spinner" />

      <div className="loading-dots">
        <span /><span /><span />
      </div>

      <div style={{ textAlign: "center" }}>
        <p className="loading-title">🤖 AI is working on it…</p>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
          This may take 30–60 seconds with a local model
        </p>
      </div>

      <ul className="loading-steps">
        {steps.map((s, i) => (
          <li key={i}>
            <span className={`step-dot ${i <= activeStep ? "active" : ""}`} />
            <span style={{ color: i <= activeStep ? "#94a3b8" : "#334155" }}>
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ── Welcome / empty state ──────────────────────────────── */
const WelcomeState = () => (
  <div className="welcome-state">
    <div className="welcome-icon">📊</div>
    <h2>Your charts will appear here</h2>
    <p>Upload a CSV or Excel file on the left, then click "Generate Charts" and the AI will create a dashboard for you automatically.</p>
  </div>
);

/* ── Main panel ─────────────────────────────────────────── */
const DashboardPanel = ({ chartsData, isLoading }) => {
  const [activeTab, setActiveTab] = React.useState("dashboard");

  if (isLoading) return (
    <main className="dashboard-panel">
      <LoadingState />
    </main>
  );

  if (!chartsData) return (
    <main className="dashboard-panel">
      <WelcomeState />
    </main>
  );

  const { charts = [], dataset_columns: columns = [], chart_count, insights = [], story = "" } = chartsData;

  return (
    <main className="dashboard-panel">
      {/* Header */}
      <div className="dash-header">
        <h1>📊 Your Analysis</h1>
        <p>
          AI has processed your data and generated multiple views for you.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📈 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === "insights" ? "active" : ""}`}
          onClick={() => setActiveTab("insights")}
        >
          💡 AI Insights
        </button>
        <button 
          className={`tab-btn ${activeTab === "story" ? "active" : ""}`}
          onClick={() => setActiveTab("story")}
        >
          📖 Story Mode
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "dashboard" && (
          <div className="tab-pane fade-in">
             <div style={{ marginBottom: 20 }}>
                <p style={{ color: "#64748b", fontSize: 13 }}>
                  {chart_count || charts.length} chart{charts.length !== 1 ? "s" : ""} generated automatically
                  {columns.length > 0 && ` · ${columns.length} columns detected`}
                </p>
                {columns.length > 0 && (
                  <div className="column-tags">
                    {columns.map((col, i) => (
                      <span key={i} className="col-tag">{col}</span>
                    ))}
                  </div>
                )}
             </div>

            {charts.length > 0 ? (
              <div className="charts-grid">
                {charts.map((chart, idx) => (
                  <ChartCard key={idx} chart={chart} index={idx} />
                ))}
              </div>
            ) : (
              <p style={{ color: "#64748b", textAlign: "center", paddingTop: 60 }}>
                No charts were returned. Try a different prompt.
              </p>
            )}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="tab-pane fade-in">
            <div className="insights-container">
              <h2 className="section-title">Key Findings</h2>
              {insights.length > 0 ? (
                <ul className="insights-list">
                  {insights.map((insight, i) => (
                    <li key={i} className="insight-item">
                      <span className="insight-bullet">✨</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-insights">
                   <p>No specific insights were generated for this dataset.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "story" && (
          <div className="tab-pane fade-in">
            <div className="story-container">
              <h2 className="section-title">Data Summary</h2>
              {story ? (
                <div className="story-content">
                  <div className="story-bubble">
                     <p>{story}</p>
                  </div>
                </div>
              ) : (
                <div className="empty-insights">
                  <p>AI did not generate a summary story for this analysis.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPanel;
