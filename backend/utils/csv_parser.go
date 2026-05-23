package utils

import (
	"encoding/csv"
	"io"
	"mime/multipart"

	"github.com/sushmit/ai-chart-dashboard/models"
)

func ParseCSV(file multipart.File) (*models.ParsedDataset, error) {
	reader := csv.NewReader(file)
	
	// Read header
	headers, err := reader.Read()
	if err != nil {
		return nil, err
	}

	var rows []map[string]interface{}
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		row := make(map[string]interface{})
		for i, header := range headers {
			if i < len(record) {
				row[header] = record[i]
			}
		}
		rows = append(rows, row)
	}

	return &models.ParsedDataset{
		Columns: headers,
		Rows:    rows,
	}, nil
}
