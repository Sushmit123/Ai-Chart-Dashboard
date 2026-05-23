package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sushmit/ai-chart-dashboard/models"
	"github.com/sushmit/ai-chart-dashboard/repositories"
	"github.com/sushmit/ai-chart-dashboard/services"
)

// GenerateDashboard godoc
// @Summary Generate charts from uploaded file
// @Description Upload a CSV or Excel file and optionally provide a prompt to generate charts
// @Tags dashboard
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "CSV or Excel file"
// @Param prompt formData string false "Chart requirement prompt (optional - if empty, AI will suggest charts)"
// @Success 200 {object} map[string]interface{} "Dashboard generated successfully"
// @Failure 400 {object} map[string]string "Bad request"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /dashboard/generate [post]
func GenerateDashboard(c *gin.Context) {
	log.Println("\n========== [Dashboard Controller] GenerateDashboard Started ==========")

	// Get uploaded file
	file, err := c.FormFile("file")
	if err != nil {
		log.Printf("[Dashboard Controller] ERROR: No file provided: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}
	log.Printf("[Dashboard Controller] File received: %s (Size: %d bytes)\n", file.Filename, file.Size)

	// Get prompt from form (optional)
	prompt := c.PostForm("prompt")
	log.Printf("[Dashboard Controller] Prompt received: %q (Optional)\n", prompt)

	if prompt == "" {
		log.Println("[Dashboard Controller] Prompt is empty - AI will suggest multiple charts")
	} else {
		log.Printf("[Dashboard Controller] User requirement: %s\n", prompt)
	}

	// Process the file
	log.Println("[Dashboard Controller] Processing file...")
	dataset, filePath, err := services.ProcessFile(file)
	if err != nil {
		log.Printf("[Dashboard Controller] ERROR: Failed to process file: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to process file: %v", err)})
		return
	}

	log.Printf("[Dashboard Controller] File processed successfully\n")
	log.Printf("[Dashboard Controller] Dataset columns: %v\n", dataset.Columns)
	log.Printf("[Dashboard Controller] Dataset rows: %d\n", len(dataset.Rows))

	// Save dataset to database
	log.Println("[Dashboard Controller] Saving dataset to database...")
	datasetID, err := repositories.SaveDataset(file.Filename, filePath, dataset.Columns, len(dataset.Rows))
	if err != nil {
		log.Printf("[Dashboard Controller] ERROR: Failed to save dataset: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save dataset"})
		return
	}
	log.Printf("[Dashboard Controller] Dataset saved with ID: %d\n", datasetID)

	// Build prompt for AI
	log.Println("[Dashboard Controller] Building AI prompt...")
	aiPrompt := services.BuildChartPrompt(dataset.Columns, prompt)

	// Call Ollama Mistral API
	log.Println("[Dashboard Controller] Calling AI service to generate charts...")
	aiResponse, err := services.CallOllamaMistral(aiPrompt)
	if err != nil {
		log.Printf("[Dashboard Controller] WARNING: AI API error: %v\n", err)
		log.Println("[Dashboard Controller] Using default chart suggestions as fallback...")
		aiResponse = `[
			{
				"type": "bar",
				"title": "Data Overview",
				"xAxis": "Category",
				"yAxis": "Value",
				"dataColumns": []
			},
			{
				"type": "line",
				"title": "Trend Analysis",
				"xAxis": "Date",
				"yAxis": "Value",
				"dataColumns": []
			}
		]`
	} else {
		log.Println("[Dashboard Controller] AI response received successfully")
	}

	// Parse chart configuration from AI response
	log.Println("[Dashboard Controller] Parsing comprehensive AI response...")
	charts, insights, story, err := services.ParseChartConfig(aiResponse)
	if err != nil {
		log.Printf("[Dashboard Controller] ERROR: Failed to parse AI response: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response"})
		return
	}

	log.Printf("[Dashboard Controller] Successfully parsed %d charts and %d insights\n", len(charts), len(insights))
	for i, chart := range charts {
		log.Printf("[Dashboard Controller] Chart %d: Type=%v, Title=%v\n", i+1, chart["type"], chart["title"])
	}

	// Populate actual data for each chart
	log.Println("[Dashboard Controller] Populating chart data from dataset...")
	for i, chart := range charts {
		dataColumns, ok := chart["dataColumns"].([]interface{})
		var columnNames []string
		if ok {
			for _, col := range dataColumns {
				if colStr, ok := col.(string); ok {
					columnNames = append(columnNames, colStr)
				}
			}
		}

		// If no specific columns defined, try to infer from chart
		if len(columnNames) == 0 {
			xAxis, _ := chart["xAxis"].(string)
			yAxis, _ := chart["yAxis"].(string)
			if xAxis != "" {
				columnNames = append(columnNames, xAxis)
			}
			if yAxis != "" {
				columnNames = append(columnNames, yAxis)
			}
		}

		chartData := populateChartData(dataset, columnNames)
		chart["data"] = chartData
		log.Printf("[Dashboard Controller] Chart %d populated with %d data points\n", i+1, len(chartData))
	}

	// Save dashboard to database
	log.Println("[Dashboard Controller] Saving dashboard to database...")
	// For simplicity, we can store insights and story inside the same config or separate fields
	// Let's store them in a way that GetDashboard can retrieve them later
	fullConfig := map[string]interface{}{
		"charts":   charts,
		"insights": insights,
		"story":    story,
	}
	dashboardID, err := repositories.SaveDashboard(datasetID, prompt, fullConfig)
	if err != nil {
		log.Printf("[Dashboard Controller] ERROR: Failed to save dashboard: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save dashboard"})
		return
	}
	log.Printf("[Dashboard Controller] Dashboard saved with ID: %d\n", dashboardID)

	// Convert charts to proper format
	log.Printf("[Dashboard Controller] Generating response with %d charts\n", len(charts))

	// Return response
	response := gin.H{
		"dataset_id":        datasetID,
		"dashboard_id":      dashboardID,
		"dataset_columns":   dataset.Columns,
		"charts":            charts,
		"insights":          insights,
		"story":             story,
		"message":           "Dashboard generated successfully",
		"chart_count":       len(charts),
		"requires_provided": prompt != "",
	}

	log.Println("[Dashboard Controller] Response prepared successfully")
	log.Printf("[Dashboard Controller] Response: %+v\n", response)
	log.Println("========== [Dashboard Controller] GenerateDashboard Completed ==========\n")

	c.JSON(http.StatusOK, response)
}

// populateChartData extracts relevant data from dataset for a specific chart
func populateChartData(dataset *models.ParsedDataset, columnNames []string) []map[string]interface{} {
	data := []map[string]interface{}{}

	if len(columnNames) == 0 {
		return data
	}

	// Limit to first 10 rows for performance
	rowLimit := len(dataset.Rows)
	if rowLimit > 10 {
		rowLimit = 10
	}

	for _, row := range dataset.Rows[:rowLimit] {
		dataPoint := make(map[string]interface{})
		for _, colName := range columnNames {
			if val, ok := row[colName]; ok {
				dataPoint[colName] = val
			}
		}
		if len(dataPoint) > 0 {
			data = append(data, dataPoint)
		}
	}

	return data
}

// GetDashboard godoc
// @Summary Get dashboard by ID
// @Description Retrieve a generated dashboard and its associated charts
// @Tags dashboard
// @Produce json
// @Param id path int true "Dashboard ID"
// @Success 200 {object} map[string]interface{} "Dashboard found"
// @Failure 404 {object} map[string]string "Dashboard not found"
// @Router /dashboard/{id} [get]
func GetDashboard(c *gin.Context) {
	dashboardID := c.Param("id")

	dashboard, err := repositories.GetDashboard(parseInt(dashboardID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dashboard not found"})
		return
	}

	columns, _ := repositories.GetDatasetColumns(dashboard.DatasetID)

	c.JSON(http.StatusOK, gin.H{
		"dashboard":        dashboard,
		"dataset_columns":  columns,
	})
}

func parseInt(s string) int {
	var i int
	fmt.Sscanf(s, "%d", &i)
	return i
}
