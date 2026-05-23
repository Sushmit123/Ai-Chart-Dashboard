# Swagger/OpenAPI Documentation

The backend includes Swagger/OpenAPI documentation for all API endpoints.

## Access Swagger UI

Once the backend is running, visit:

```
http://localhost:8080/swagger/index.html
```

This provides an interactive UI where you can:

- View all API endpoints
- See request/response schemas
- Test endpoints directly from the browser

## Regenerate Swagger Docs (if needed)

If you modify the API endpoints or add new ones with swagger comments, regenerate the docs:

1. Install swag CLI (only need to do this once):

```bash
go install github.com/swaggo/swag/cmd/swag@latest
```

2. Generate/update swagger docs:

```bash
swag init -g cmd/main.go
```

This will update the docs/ folder with the latest swagger files.

## Swagger Annotations

All controller functions have swagger comments like:

```go
// GenerateDashboard godoc
// @Summary Generate charts from uploaded file
// @Description Upload a CSV or Excel file...
// @Tags dashboard
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "CSV or Excel file"
// @Success 200 {object} map[string]interface{} "Success response"
// @Router /dashboard/generate [post]
func GenerateDashboard(c *gin.Context) {
    // ...
}
```

When you add new endpoints, include similar comments above the function.
