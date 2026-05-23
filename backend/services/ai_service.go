package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

type OllamaRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

type OllamaResponse struct {
	Response string `json:"response"`
}

func CallOllamaMistral(prompt string) (string, error) {
	log.Println("[AI Service] Calling Ollama Mistral with prompt...")
	log.Printf("[AI Service] Prompt length: %d characters\n", len(prompt))

	requestBody := OllamaRequest{
		Model:  "mistral",
		Prompt: prompt,
		Stream: false,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		log.Printf("[AI Service] Error marshaling request: %v\n", err)
		return "", err
	}

	log.Println("[AI Service] Sending HTTP POST request to Ollama...")
	resp, err := http.Post(
		"http://localhost:11434/api/generate",
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		log.Printf("[AI Service] HTTP Error: %v\n", err)
		return "", fmt.Errorf("failed to call Ollama: %w", err)
	}
	defer resp.Body.Close()

	log.Printf("[AI Service] Response Status: %d\n", resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("[AI Service] Error reading response body: %v\n", err)
		return "", err
	}

	var ollamaResp OllamaResponse
	err = json.Unmarshal(body, &ollamaResp)
	if err != nil {
		log.Printf("[AI Service] Error parsing response JSON: %v\n", err)
		
		return "", err
	}

	log.Printf("[AI Service] Response received: %d characters\n", len(ollamaResp.Response))
	log.Printf("[AI Service] First 200 chars: %.200s\n", ollamaResp.Response)

	return ollamaResp.Response, nil
}

func BuildChartPrompt(columns []string, userPrompt string) string {
	columnsStr := ""
	for i, col := range columns {
		columnsStr += fmt.Sprintf("%d. %s\n", i+1, col)
	}

	log.Println("[AI Service] Building chart prompt...")
	log.Printf("[AI Service] User prompt: %s\n", userPrompt)
	log.Println("[AI Service] Available columns:")
	for _, col := range columns {
		log.Printf("  - %s\n", col)
	}

	// Different prompt based on whether user provided requirement
	if userPrompt == "" {
		log.Println("[AI Service] No user prompt - generating AI suggestions for multiple charts")
		return fmt.Sprintf(`You are an expert data visualization and data analyst assistant. Given these dataset columns, perform a comprehensive analysis and suggest useful charts, insights, and a compelling narrative story.

Available columns:
%s

Generate a single JSON object with the following structure:
{
  "charts": [
    {
      "type": "line" | "bar" | "pie" | "scatter",
      "title": "Descriptive Chart Title",
      "xAxis": "column name (for line/bar/scatter)",
      "yAxis": "column name (for line/bar/scatter)",
      "dataColumns": ["column1", "column2", "..."],
      "description": "A brief explanation of why this chart was chosen and what it intends to show to the user."
    }
  ],
  "insights": [
    "A concise, high-level data insight bullet point (e.g., 'Region X generates 40%% of total sales')",
    "Another meaningful insight..."
  ],
  "story": "A cohesive narrative summary of the data findings, formatted in simple markdown."
}

IMPORTANT RULES:
1. Generate 3-5 different charts.
2. Provide 4-6 concise bullet-point insights.
3. Write a short, engaging 'story' or summary that ties the findings together.
4. Each chart MUST have a 'description' field explaining its purpose.
5. Return ONLY a valid JSON object, no additional conversational text.
6. Don't include accurate "data" field values - just specify the structure.
`, columnsStr)
	}

	// User provided a specific requirement
	log.Println("[AI Service] Using user's chart requirement")
	return fmt.Sprintf(`You are an expert data visualization and data analyst assistant. Based on the user's requirements and the available data columns, provide appropriate chart configurations, specific insights, and a summary story.

Available columns:
%s

User requirement: %s

Generate a single JSON object with the following structure:
{
  "charts": [
    {
      "type": "line" | "bar" | "pie" | "scatter",
      "title": "Descriptive Chart Title",
      "xAxis": "column name (for line/bar/scatter)",
      "yAxis": "column name (for line/bar/scatter)",
      "dataColumns": ["column1", "column2", "..."],
      "description": "A brief explanation of how this chart addresses the user's requirement."
    }
  ],
  "insights": [
    "Insight relevant to the user requirement...",
    "Another related insight..."
  ],
  "story": "A summary narrative focused on answering the user's request."
}

IMPORTANT RULES:
1. Generate charts and analysis specifically addressing the user's requirement.
2. Provide 3-5 concise bullet-point insights.
3. Each chart MUST have a 'description' field.
4. Return ONLY a valid JSON object, no additional conversational text.
`, columnsStr, userPrompt)
}

func ParseChartConfig(response string) ([]map[string]interface{}, []string, string, error) {
	log.Println("[AI Service] Parsing comprehensive analysis from AI response...")
	log.Printf("[AI Service] Response preview: %.500s\n", response)

	type AIResult struct {
		Charts   []map[string]interface{} `json:"charts"`
		Insights []string                 `json:"insights"`
		Story    string                   `json:"story"`
	}

	var result AIResult

	// Try to find JSON object in the response
	startIdx := strings.Index(response, "{")
	endIdx := strings.LastIndex(response, "}")

	if startIdx != -1 && endIdx != -1 && endIdx > startIdx {
		jsonStr := response[startIdx : endIdx+1]
		err := json.Unmarshal([]byte(jsonStr), &result)
		if err == nil {
			log.Printf("[AI Service] Successfully parsed %d charts, %d insights\n", len(result.Charts), len(result.Insights))
			return result.Charts, result.Insights, result.Story, nil
		}
		log.Printf("[AI Service] Failed to parse extracted JSON: %v\n", err)
	}

	// Fallback: return default chart configuration
	log.Println("[AI Service] Using fallback chart configuration")
	fallbackCharts := []map[string]interface{}{
		{
			"type":        "bar",
			"title":       "Data Overview",
			"xAxis":       "Category",
			"yAxis":       "Value",
			"dataColumns": []string{},
			"description": "Basic overview of the dataset categories and values.",
		},
	}
	fallbackInsights := []string{"AI was unable to generate specific insights.", "Please try a more specific prompt."}
	fallbackStory := "The data analysis is pending or could not be generated at this time."

	return fallbackCharts, fallbackInsights, fallbackStory, nil
}
