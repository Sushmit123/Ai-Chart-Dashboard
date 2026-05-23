package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sushmit/ai-chart-dashboard/controllers"
)

func SetupRoutes(router *gin.Engine) {
	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API routes
	api := router.Group("/api")
	{
		dashboard := api.Group("/dashboard")
		{
			dashboard.POST("/generate", controllers.GenerateDashboard)
			dashboard.GET("/:id", controllers.GetDashboard)
		}
	}
}
