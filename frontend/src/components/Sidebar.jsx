import React, { useState, useRef } from "react";
import { generateCharts } from "../services/api";

const Sidebar = ({
  onChartsGenerated,
  isLoading,
  setIsLoading,
  error,
  setError,
  hasCharts,
  onReset,
}) => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    const allowed = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    // also allow by extension for browsers that miss the mime
    const extOk = f.name.endsWith(".csv") || f.name.endsWith(".xlsx");
    if (!allowed.includes(f.type) && !extOk) {
      setError("Please upload a CSV or Excel (.xlsx) file.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a file first."); return; }
    setIsLoading(true);
    setError("");
    onChartsGenerated(null);     // clear old charts while loading
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prompt", prompt || "");
      const res = await generateCharts(fd);
      onChartsGenerated(res);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate charts. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPrompt("");
    setError("");
    onReset();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Falcon Logo" style={{ height: "36px", borderRadius: "8px", objectFit: "contain" }} />
        <div>
          <span>ChartAI</span>
          <small>Powered by Ollama</small>
        </div>
      </div>

      {/* Step 1: Upload */}
      <div>
        <p className="prompt-label">① Upload your data file</p>
        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          <span className="drop-icon">📁</span>
          <p>
            <strong>Click to browse</strong> or drag &amp; drop
          </p>
          <p style={{ fontSize: 11, marginTop: 4, color: "#475569" }}>
            Supports CSV &amp; Excel files
          </p>
        </div>

        {file && (
          <div className="file-badge" style={{ marginTop: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {file.name}&nbsp;
            <span style={{ color: "#64748b", fontWeight: 400 }}>({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}
      </div>

      {/* Step 2: Prompt */}
      <div>
        <p className="prompt-label">② What do you want to see? <span style={{ color: "#475569", textTransform: "none", letterSpacing: 0 }}>(Optional)</span></p>
        <textarea
          className="prompt-textarea"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          placeholder="e.g. Show me sales by region and a monthly trend line…  OR leave empty and AI will decide!"
        />
        <p className="tip-text" style={{ marginTop: 6 }}>
          💡 Leave empty — the AI will pick the best charts automatically
        </p>
      </div>

      {/* Generate */}
      {error && <div className="error-box">⚠️ {error}</div>}

      <button
        className="btn-generate"
        onClick={handleSubmit}
        disabled={isLoading || !file}
      >
        {isLoading ? (
          <>
            <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Analysing data…
          </>
        ) : (
          <>✨ Generate Charts</>
        )}
      </button>

      {hasCharts && (
        <button className="btn-reset" onClick={handleReset}>
          ↩ Upload a different file
        </button>
      )}

      {/* footer */}
      <div style={{ marginTop: "auto", paddingTop: 12 }}>
        <p className="tip-text">
          Your data stays local — nothing is sent to external servers.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
