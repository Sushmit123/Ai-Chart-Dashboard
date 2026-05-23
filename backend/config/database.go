package config

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() error {
	// Load .env file
	godotenv.Load()

	// Database credentials
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "postgres")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	err = DB.Ping()
	if err != nil {
		return err
	}

	fmt.Println("✓ Connected to PostgreSQL successfully")
	createTables()
	return nil
}

func createTables() {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS datasets (
			id SERIAL PRIMARY KEY,
			file_name VARCHAR(255) NOT NULL,
			file_path TEXT NOT NULL,
			columns JSONB,
			row_count INTEGER,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS dashboards (
			id SERIAL PRIMARY KEY,
			dataset_id INTEGER REFERENCES datasets(id) ON DELETE CASCADE,
			prompt TEXT,
			chart_config JSONB,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS dashboard_charts (
			id SERIAL PRIMARY KEY,
			dashboard_id INTEGER REFERENCES dashboards(id) ON DELETE CASCADE,
			chart_type VARCHAR(50),
			x_axis VARCHAR(100),
			y_axis VARCHAR(100),
			category VARCHAR(100),
			value VARCHAR(100),
			title VARCHAR(255)
		)`,
		`CREATE INDEX IF NOT EXISTS idx_dataset_id ON dashboards(dataset_id)`,
		`CREATE INDEX IF NOT EXISTS idx_dashboard_id ON dashboard_charts(dashboard_id)`,
	}

	for _, query := range queries {
		_, err := DB.Exec(query)
		if err != nil {
			fmt.Printf("Error executing query: %v\n", err)
		}
	}
	fmt.Println("✓ Database tables initialized")
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
