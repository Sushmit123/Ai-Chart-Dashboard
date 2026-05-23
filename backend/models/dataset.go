package models

// DataPoint represents a single data point in a chart
type DataPoint struct {
	Name  string                 `json:"name"`
	Data  map[string]interface{} `json:"data"`
}

// ParsedDataset represents the parsed file with columns and rows
type ParsedDataset struct {
	Columns []string `json:"columns"`
	Rows    []map[string]interface{} `json:"rows"`
}
