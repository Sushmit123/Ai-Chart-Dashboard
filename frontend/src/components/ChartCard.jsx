import React from "react";
import ChartRenderer from "./ChartRenderer";

/* ─── Plain-English descriptions for each chart type ────── */
const CHART_INFO = {
  bar: {
    emoji: "📊",
    label: "Bar Chart",
    badgeClass: "badge-bar",
    headline: (title) => title,
    description: (x, y) =>
      `Each bar shows the total ${y || "value"} for a ${x || "category"}. The taller the bar, the bigger the number — making it super easy to spot which ${x || "group"} is highest or lowest at a glance.`,
    insight: "Great for: comparing totals side by side",
  },
  line: {
    emoji: "📈",
    label: "Line Chart",
    badgeClass: "badge-line",
    headline: (title) => title,
    description: (x, y) =>
      `The line traces how ${y || "values"} change over ${x || "time"}. A rising line means growth; a falling line means decline. Look for peaks and dips to spot your best and worst periods.`,
    insight: "Great for: spotting trends and changes over time",
  },
  pie: {
    emoji: "🥧",
    label: "Pie Chart",
    badgeClass: "badge-pie",
    headline: (title) => title,
    description: (x) =>
      `Each slice shows what share of the total belongs to each ${x || "category"}. A bigger slice = a bigger piece of the pie. All slices always add up to 100%.`,
    insight: "Great for: understanding which group dominates",
  },
  scatter: {
    emoji: "💫",
    label: "Scatter Chart",
    badgeClass: "badge-scatter",
    headline: (title) => title,
    description: (x, y) =>
      `Each dot is one record from your data — its left-right position shows ${x || "X"} and its up-down position shows ${y || "Y"}. If the dots form a diagonal, those two things are related.`,
    insight: "Great for: finding if two numbers are connected",
  },
};

const getInfo = (type) =>
  CHART_INFO[type?.toLowerCase?.()] || {
    emoji: "📌",
    label: type || "Chart",
    badgeClass: "badge-bar",
    headline: (t) => t,
    description: () => "A visual summary of your data.",
    insight: "",
  };

/* ─── Chart Card ─────────────────────────────────────────── */
const ChartCard = ({ chart, index }) => {
  const { type, title, xAxis, yAxis, data } = chart;
  const info = getInfo(type);

  return (
    <div className="chart-card" style={{ animationDelay: `${index * 0.07}s` }}>
      {/* Header */}
      <div className="chart-card-header">
        <span className={`chart-type-badge ${info.badgeClass}`}>
          {info.emoji} {info.label}
        </span>
        <h2 className="chart-title">{info.headline(title)}</h2>
        <p className="chart-plain-desc">
          {chart.description || info.description(xAxis, yAxis)}
        </p>
        {info.insight && (
          <p style={{ fontSize: 12, marginTop: 8, color: "#64748b", fontStyle: "italic" }}>
            {info.insight}
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="chart-card-body">
        <ChartRenderer config={chart} />

        {/* Mini metadata footer */}
        <div className="chart-meta">
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <strong>{data?.length || 0}</strong>&nbsp;data points
          </span>
          {xAxis && (
            <span>
              ↔ X-axis: <strong>{xAxis}</strong>
            </span>
          )}
          {yAxis && (
            <span>
              ↕ Y-axis: <strong>{yAxis}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
