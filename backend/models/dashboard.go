package models

import (
	"encoding/json"
	"time"
)

type Dataset struct {
	ID        int             `json:"id"`
	FileName  string          `json:"file_name"`
	FilePath  string          `json:"file_path"`
	Columns   json.RawMessage `json:"columns"`
	RowCount  int             `json:"row_count"`
	CreatedAt time.Time       `json:"created_at"`
}

type Dashboard struct {
	ID          int             `json:"id"`
	DatasetID   int             `json:"dataset_id"`
	Prompt      string          `json:"prompt"`
	ChartConfig json.RawMessage `json:"chart_config"`
	CreatedAt   time.Time       `json:"created_at"`
}

type DashboardChart struct {
	ID          int    `json:"id"`
	DashboardID int    `json:"dashboard_id"`
	ChartType   string `json:"chart_type"`
	XAxis       string `json:"x_axis"`
	YAxis       string `json:"y_axis"`
	Category    string `json:"category"`
	Value       string `json:"value"`
	Title       string `json:"title"`
}

type ChartConfig struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
	Title string         `json:"title,omitempty"`
}

type GenerateRequest struct {
	Prompt string `form:"prompt" binding:"required"`
	File   string `form:"file" binding:"required"`
}

type GenerateResponse struct {
	DatasetID      int              `json:"dataset_id"`
	DashboardID    int              `json:"dashboard_id"`
	DatasetColumns []string         `json:"dataset_columns"`
	Charts         []json.RawMessage `json:"charts"`
	Message        string           `json:"message"`
}
