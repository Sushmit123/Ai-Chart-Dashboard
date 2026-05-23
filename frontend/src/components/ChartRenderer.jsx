import React from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
  ScatterChart, Scatter,
} from "recharts";

/* Vibrant palette for dark background */
const COLORS = [
  "#A7C7E7", "#C1E1C1", "#FDFD96", "#FFD1DC",
  "#C3B1E1", "#FFCBA4", "#B5EAD7", "#FFDAC1",
];

/* Custom dark tooltip */
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid rgba(99,102,241,0.15)",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 13,
      color: "#334155",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    }}>
      {label && <p style={{ color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#818cf8" }}>
          {p.name}: <strong>{Number(p.value).toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

const axisStyle = { fontSize: 11, fill: "#64748b" };
const gridProps = { stroke: "rgba(0,0,0,0.05)", strokeDasharray: "3 3" };

/* ─────────────────────────────────────────────────────────── */
const ChartRenderer = ({ config }) => {
  if (!config || !config.data || config.data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#475569" }}>
        No data available to display
      </div>
    );
  }

  const { type, data, xAxis, yAxis } = config;

  const yAxes = React.useMemo(() => yAxis ? yAxis.split(/[,|]/).map(s => s.trim()).filter(Boolean) : [], [yAxis]);

  /* Parse string numbers → actual numbers */
  const parsed = React.useMemo(() => {
    return data.map((item) => {
      const out = {};
      Object.keys(item).forEach((k) => {
        const v = item[k];
        out[k] = v !== null && v !== undefined && v !== "" && !isNaN(v) ? parseFloat(v) : v;
      });
      return out;
    });
  }, [data]);

  /* Pie: count category occurrences or use yAxis if available */
  const pieData = React.useMemo(() => {
    if (type?.toLowerCase() !== "pie") return [];
    
    const pY = yAxes[0];
    const hasYAxisData = pY && parsed.length > 0 && pY in parsed[0];
    
    if (hasYAxisData) {
      return parsed.map(item => ({
        name: item[xAxis || Object.keys(item)[0]],
        value: Number(item[pY]) || 0
      }));
    }

    const catKey = xAxis || (parsed.length > 0 ? Object.keys(parsed[0])[0] : "");
    const counts = {};
    parsed.forEach((item) => {
      const cat = item[catKey];
      if (cat !== undefined && cat !== null) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [type, xAxis, yAxes, parsed]);

  /* Bar: aggregate duplicate categories */
  const barData = React.useMemo(() => {
    if (type?.toLowerCase() !== "bar" || !xAxis || yAxes.length === 0) return parsed;
    const agg = [];
    const seen = {};
    parsed.forEach((item) => {
      const key = item[xAxis];
      if (seen[key] !== undefined) {
        yAxes.forEach(y => {
          if (item[y] !== undefined) {
             agg[seen[key]][y] = (agg[seen[key]][y] || 0) + (Number(item[y]) || 0);
          }
        });
      } else {
        seen[key] = agg.length;
        agg.push({ ...item });
      }
    });
    return agg;
  }, [type, xAxis, yAxes, parsed]);

  const numFmt = (v) => typeof v === "number" ? v.toLocaleString() : v;

  switch (type?.toLowerCase()) {

    /* ── LINE ─────────────────────────────────────────────── */
    case "line":
      return (
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={parsed} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={xAxis} tick={axisStyle} angle={-35} textAnchor="end" height={80} />
            <YAxis tick={axisStyle} tickFormatter={numFmt} width={70} />
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
            {yAxes.map((y, i) => (
              <Line
                key={y}
                type="monotone"
                dataKey={y}
                name={y}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2.5}
                dot={{ fill: COLORS[i % COLORS.length], r: 4 }}
                activeDot={{ r: 6, fill: "#fff" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );

    /* ── BAR ──────────────────────────────────────────────── */
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={xAxis} tick={axisStyle} angle={-35} textAnchor="end" height={80} />
            <YAxis tick={axisStyle} tickFormatter={numFmt} width={70} />
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
            {yAxes.map((y, i) => (
              <Bar key={y} dataKey={y} name={y} radius={[6, 6, 0, 0]} maxBarSize={60} fill={yAxes.length > 1 ? COLORS[i % COLORS.length] : undefined}>
                {yAxes.length === 1 && barData.map((_, j) => (
                  <Cell key={j} fill={COLORS[j % COLORS.length]} />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    /* ── PIE ──────────────────────────────────────────────── */
    case "pie":
      return (
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={40}
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              labelLine={{ stroke: "#475569" }}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      );

    /* ── SCATTER ──────────────────────────────────────────── */
    case "scatter":
      const scY = yAxes[0] || yAxis;
      return (
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid {...gridProps} />
            <XAxis
              type="number"
              dataKey={xAxis}
              name={xAxis}
              tick={axisStyle}
              tickFormatter={numFmt}
              label={{ value: xAxis, position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey={scY}
              name={scY}
              tick={axisStyle}
              tickFormatter={numFmt}
              width={70}
              label={{ value: scY, angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(99,102,241,0.3)" }} />
            <Scatter name={`${xAxis} vs ${scY}`} data={parsed} fill={COLORS[3]} opacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div style={{ textAlign: "center", color: "#f87171", padding: 40 }}>
          Chart type "{type}" is not supported yet.
        </div>
      );
  }
};

export default ChartRenderer;
