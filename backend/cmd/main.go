package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/sushmit/ai-chart-dashboard/config"
	"github.com/sushmit/ai-chart-dashboard/routes"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "github.com/sushmit/ai-chart-dashboard/docs"
)

// @title AI Chart Dashboard API
// @version 1.0
// @description API for generating charts from data using AI
// @host localhost:8080
// @BasePath /api
// @schemes http

func main() {
	// Initialize database
	err := config.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer config.DB.Close()

	// Create Gin router
	router := gin.Default()

	// Swagger route
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	// Setup routes
	routes.SetupRoutes(router)

	// Start server
	port := ":8080"
	fmt.Printf("Server running on http://localhost%s\n", port)
	fmt.Printf("Swagger docs available at http://localhost%s/swagger/index.html\n", port)
	if err := router.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
