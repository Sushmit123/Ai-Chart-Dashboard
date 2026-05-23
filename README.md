# AI Chart Dashboard Setup Guide

## 🎉 Recent Improvements

This project has been enhanced with the following fixes:

✅ **Optional Chart Requirements** - No longer mandatory to describe your needs  
✅ **Multiple Charts Generated** - 3-5 AI-suggested charts instead of 1  
✅ **Data Population** - Charts now contain actual data from your file (not empty arrays)  
✅ **Comprehensive Logging** - Full visibility into the generation process at every step

See [QUICK_START.md](QUICK_START.md) to test these improvements!

---

## Prerequisites

1. **Go 1.21+** - Download from https://golang.org/dl/
2. **Node.js 16+** - Download from https://nodejs.org/
3. **PostgreSQL 12+** - Download from https://www.postgresql.org/download/
4. **Ollama** - Download from https://ollama.ai/ and ensure Mistral model is available

## Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE ai_chart_db;
```

2. The backend will automatically create the required tables on startup:
   - `datasets` - Stores uploaded file metadata and columns
   - `dashboards` - Stores dashboard configurations
   - `dashboard_charts` - Stores individual chart configurations with axes

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create `.env` file from `.env.example`:

```bash
copy .env.example .env
```

3. Update `.env` with your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
APP_PORT=8080
OLLAMA_URL=http://localhost:11434
```

4. Download Go dependencies:

```bash
go mod download
```

5. Run the backend server:

```bash
go run ./cmd/main.go
```

**Or use `air` for development with hot reload:**

```bash
air
```

The backend will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Ollama Setup

1. Install Ollama from https://ollama.ai/
2. Pull the Mistral model:

```bash
ollama pull mistral
```

3. Run Ollama (it will serve on http://localhost:11434):

```bash
ollama serve
```

## API Endpoints

**Swagger Documentation:** Access the interactive API documentation at:

```
http://localhost:8080/swagger/index.html
```

### Generate Dashboard

- **POST** `/api/dashboard/generate`
- **Request**:
  - Form data with `file` (CSV or Excel) and `prompt` (string)
- **Response**:
  ```json
  {
    "dataset_id": 1,
    "dashboard_id": 1,
    "dataset_columns": ["column1", "column2"],
    "charts": [{"type": "bar", "data": [...]}]
  }
  ```

### Get Dashboard

- **GET** `/api/dashboard/:id`
- **Response**: Dashboard and dataset columns

## Supported Chart Types

- **line** - Line charts
- **bar** - Bar charts
- **pie** - Pie charts

## Example Usage

1. Upload a CSV file with data
2. Provide a prompt like "Create a line chart showing monthly sales trends"
3. The system will generate charts based on your data and prompt

## Troubleshooting

### Database Connection Error

- Ensure PostgreSQL is running on your machine
- Check `.env` file exists in the backend directory with correct credentials
- Verify the database server is accessible on the configured host and port
- Check PostgreSQL is set to use password authentication in `pg_hba.conf`

### Missing .env File

- Copy `.env.example` to `.env` in the backend directory
- Update with your PostgreSQL credentials and other settings
- Never commit `.env` to version control (it's in `.gitignore`)

### Go Module Error

- Run `go mod tidy` to clean up dependencies
- Run `go mod download` to download all dependencies
- Delete `go.sum` if corrupted and run `go mod download` again

### Ollama Connection Error

- Ensure Ollama is running and serving on port 11434
- Install Mistral model: `ollama pull mistral`
- Check OLLAMA_URL in `.env` is correct

### CORS Errors

- The backend has CORS enabled by default for all origins
- Check browser console for specific error messages

### Air Build Error

- Install air: `go install github.com/cosmtrek/air@latest`
- Ensure `.air.toml` is in the backend directory
- Delete `tmp` folder and try again

## Project Structure

```
ai-chart-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── cmd/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── utils/
│   └── go.mod
└── README.md
```

---

## 📚 Documentation

### Getting Started

- **[QUICK_START.md](QUICK_START.md)** - Start here! Step-by-step testing guide for the new features

### Understanding the Changes

- **[IMPROVEMENTS.md](IMPROVEMENTS.md)** - Complete overview of all fixes with flow diagram
- **[VISUAL_SUMMARY.md](VISUAL_SUMMARY.md)** - Visual diagrams showing what changed
- **[BEFORE_AFTER_EXAMPLES.md](BEFORE_AFTER_EXAMPLES.md)** - Real API response examples

### Debugging & Learning

- **[CONSOLE_LOG_GUIDE.md](CONSOLE_LOG_GUIDE.md)** - Complete guide to understanding console logs
- **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)** - Technical details of every code modification

### Quick Reference

- **Key Changes**: Optional prompt + Multiple charts + Data population + Logging
- **Files Modified**: 8 files (6 frontend, 2 backend)
- **New Functionality**: `populateChartData()` function in backend

---

## 🎯 Key Features (After Improvements)

### ✨ Optional Chart Requirements

- **Before**: Had to describe what charts you wanted
- **After**: Leave field empty for AI-generated suggestions

### 📊 Multiple Charts

- **Before**: Generated 1 chart
- **After**: Generates 3-5 different chart types for exploration

### 💾 Real Data in Charts

- **Before**: Charts had empty data arrays
- **After**: Charts populated with actual data from your file

### 🔍 Full Logging

- **Before**: Hard to debug
- **After**: Comprehensive logs at every step for easy debugging

---

## 🚀 Quick Test

```bash
# Terminal 1: Backend
cd backend && go run cmd/main.go

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Ollama
ollama serve

# Browser
http://localhost:5173
→ Upload file → Leave prompt empty → See 3-5 charts with data!
```

See [QUICK_START.md](QUICK_START.md) for detailed testing instructions.

---

## 💡 What to Look For

### In Browser Console (F12)

```
[FileUpload] File selected
[PromptInput] Form submitted
[API Service] Charts generated: 4 chart(s)
[DashboardPage] Total Charts: 4
```

### In Backend Terminal

```
[Dashboard Controller] GenerateDashboard Started
[Dashboard Controller] Chart 1 populated with 8 data points
[Dashboard Controller] Chart 2 populated with 8 data points
...GenerateDashboard Completed
```

### In Network Response (DevTools)

- `"data"` field in each chart should have real values
- `"chart_count"` should be 3-5
- `"requires_provided"` shows if requirement was given

See [CONSOLE_LOG_GUIDE.md](CONSOLE_LOG_GUIDE.md) for complete logging reference.

---

## 📞 Support

For detailed information about:

- **How to test the new features** → [QUICK_START.md](QUICK_START.md)
- **Full flow documentation** → [IMPROVEMENTS.md](IMPROVEMENTS.md)
- **Console debugging** → [CONSOLE_LOG_GUIDE.md](CONSOLE_LOG_GUIDE.md)
- **Code changes** → [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)
- **Visual explanations** → [VISUAL_SUMMARY.md](VISUAL_SUMMARY.md)
