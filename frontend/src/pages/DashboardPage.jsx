import React, { useEffect } from "react";
import ChartCard from "../components/ChartCard";

const DashboardPage = ({ chartsData, onBackClick }) => {
  useEffect(() => {
    if (chartsData) {
      console.log("[DashboardPage] Charts data received:");
      console.log("[DashboardPage] Dashboard ID:", chartsData.dashboard_id);
      console.log("[DashboardPage] Dataset ID:", chartsData.dataset_id);
      console.log(
        "[DashboardPage] Dataset Columns:",
        chartsData.dataset_columns,
      );
      console.log(
        `[DashboardPage] Total Charts: ${chartsData.charts?.length || 0}`,
      );

      if (chartsData.charts) {
        chartsData.charts.forEach((chart, index) => {
          console.log(`[DashboardPage] Chart ${index + 1}:`);
          console.log(`  - Type: ${chart.type}`);
          console.log(`  - Title: ${chart.title}`);
          console.log(`  - X-Axis: ${chart.xAxis || "N/A"}`);
          console.log(`  - Y-Axis: ${chart.yAxis || "N/A"}`);
          console.log(`  - Data Points: ${chart.data?.length || 0}`);
          if (chart.data && chart.data.length > 0) {
            console.log(`  - Sample Data:`, chart.data[0]);
          }
        });
      }
    }
  }, [chartsData]);

  if (!chartsData) {
    console.log("[DashboardPage] No charts data available");
    return null;
  }

  const { charts = [], dataset_columns: datasetColumns = [] } = chartsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <button
            onClick={onBackClick}
            className="mb-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back to Upload
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Dashboard
          </h1>
          <p className="text-gray-600">Your AI-generated charts</p>
        </div>

        {datasetColumns.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Dataset Columns
            </h2>
            <div className="flex flex-wrap gap-2">
              {datasetColumns.map((col, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {charts.length > 0 ? (
          <div className="grid gap-8">
            {charts.map((chart, idx) => (
              <ChartCard key={idx} chart={chart} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No charts generated</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
