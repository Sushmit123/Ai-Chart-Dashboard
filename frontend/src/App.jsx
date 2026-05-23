import React, { useState } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import DashboardPanel from "./components/DashboardPanel";

function App() {
  const [chartsData, setChartsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="app-layout">
      <Sidebar
        onChartsGenerated={setChartsData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        error={error}
        setError={setError}
        hasCharts={!!chartsData}
        onReset={() => setChartsData(null)}
      />
      <DashboardPanel chartsData={chartsData} isLoading={isLoading} />
    </div>
  );
}

export default App;
