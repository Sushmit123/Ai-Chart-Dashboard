package repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/sushmit/ai-chart-dashboard/config"
	"github.com/sushmit/ai-chart-dashboard/models"
)

func SaveDataset(fileName, filePath string, columns []string, rowCount int) (int, error) {
	columnsJSON, _ := json.Marshal(columns)

	var id int
	err := config.DB.QueryRow(
		"INSERT INTO datasets (file_name, file_path, columns, row_count) VALUES ($1, $2, $3, $4) RETURNING id",
		fileName, filePath, string(columnsJSON), rowCount,
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("failed to save dataset: %w", err)
	}

	return id, nil
}

func SaveDashboard(datasetID int, prompt string, chartConfig interface{}) (int, error) {
	chartJSON, _ := json.Marshal(chartConfig)

	var id int
	err := config.DB.QueryRow(
		"INSERT INTO dashboards (dataset_id, prompt, chart_config) VALUES ($1, $2, $3) RETURNING id",
		datasetID, prompt, string(chartJSON),
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("failed to save dashboard: %w", err)
	}

	return id, nil
}

func SaveDashboardChart(dashboardID int, chartType, xAxis, yAxis, category, value, title string) (int, error) {
	var id int
	err := config.DB.QueryRow(
		"INSERT INTO dashboard_charts (dashboard_id, chart_type, x_axis, y_axis, category, value, title) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
		dashboardID, chartType, xAxis, yAxis, category, value, title,
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("failed to save dashboard chart: %w", err)
	}

	return id, nil
}

func GetDashboard(dashboardID int) (*models.Dashboard, error) {
	var dashboard models.Dashboard

	err := config.DB.QueryRow(
		"SELECT id, dataset_id, prompt, chart_config, created_at FROM dashboards WHERE id = $1",
		dashboardID,
	).Scan(&dashboard.ID, &dashboard.DatasetID, &dashboard.Prompt, &dashboard.ChartConfig, &dashboard.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("dashboard not found")
		}
		return nil, err
	}

	return &dashboard, nil
}

func GetDashboardCharts(dashboardID int) ([]models.DashboardChart, error) {
	rows, err := config.DB.Query(
		"SELECT id, dashboard_id, chart_type, x_axis, y_axis, category, value, title FROM dashboard_charts WHERE dashboard_id = $1",
		dashboardID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var charts []models.DashboardChart
	for rows.Next() {
		var chart models.DashboardChart
		err := rows.Scan(&chart.ID, &chart.DashboardID, &chart.ChartType, &chart.XAxis, &chart.YAxis, &chart.Category, &chart.Value, &chart.Title)
		if err != nil {
			return nil, err
		}
		charts = append(charts, chart)
	}

	return charts, nil
}

func GetDatasetColumns(datasetID int) ([]string, error) {
	var columnsJSON string

	err := config.DB.QueryRow(
		"SELECT columns FROM datasets WHERE id = $1",
		datasetID,
	).Scan(&columnsJSON)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("dataset not found")
		}
		return nil, err
	}

	var columns []string
	json.Unmarshal([]byte(columnsJSON), &columns)

	return columns, nil
}
