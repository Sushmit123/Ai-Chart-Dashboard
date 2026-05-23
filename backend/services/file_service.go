package services

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/sushmit/ai-chart-dashboard/models"
	"github.com/sushmit/ai-chart-dashboard/utils"
)

func ProcessFile(file *multipart.FileHeader) (*models.ParsedDataset, string, error) {
	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return nil, "", err
	}
	defer src.Close()

	// Create uploads directory if it doesn't exist
	uploadDir := "uploads"
	os.MkdirAll(uploadDir, os.ModePerm)

	// Save the file
	filePath := filepath.Join(uploadDir, file.Filename)
	dst, err := os.Create(filePath)
	if err != nil {
		return nil, "", err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return nil, "", err
	}

	// Reset file pointer for parsing
	src.Seek(0, 0)

	// Parse based on file extension
	var dataset *models.ParsedDataset

	if strings.HasSuffix(strings.ToLower(file.Filename), ".csv") {
		dataset, err = utils.ParseCSV(src)
	} else if strings.HasSuffix(strings.ToLower(file.Filename), ".xlsx") {
		// For Excel, we need to reopen the file
		src, _ = file.Open()
		dataset, err = utils.ParseExcel(src)
	} else {
		return nil, "", fmt.Errorf("unsupported file format")
	}

	if err != nil {
		return nil, "", err
	}

	return dataset, filePath, nil
}
