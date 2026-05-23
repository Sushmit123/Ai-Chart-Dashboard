package utils

import (
	"fmt"
	"mime/multipart"

	"github.com/sushmit/ai-chart-dashboard/models"
	"github.com/xuri/excelize/v2"
)

func ParseExcel(file multipart.File) (*models.ParsedDataset, error) {
	f, err := excelize.OpenReader(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	sheetName := f.GetSheetName(0)
	if sheetName == "" {
		return nil, fmt.Errorf("no sheet found")
	}

	rows, err := f.GetRows(sheetName)
	if err != nil {
		return nil, err
	}

	if len(rows) == 0 {
		return nil, fmt.Errorf("empty Excel file")
	}

	headers := rows[0]
	var dataRows []map[string]interface{}

	for _, row := range rows[1:] {
		dataRow := make(map[string]interface{})
		for i, header := range headers {
			if i < len(row) {
				dataRow[header] = row[i]
			}
		}
		dataRows = append(dataRows, dataRow)
	}

	return &models.ParsedDataset{
		Columns: headers,
		Rows:    dataRows,
	}, nil
}
