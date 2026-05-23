# 🎯 Quick Console Log Reference Guide

## Where to Find Logs

### **Frontend Logs** (Browser DevTools)

- **Open**: Press `F12` or Right-click → Inspect → Console tab
- **Purpose**: See client-side execution flow
- **Auto-clears**: Each time you reload the page

### **Backend Logs** (Terminal)

- **Location**: Terminal where you run `go run cmd/main.go`
- **Purpose**: See server-side execution flow
- **Continuous**: Shows all requests as they happen

---

## 📋 Log Sequence - What to Expect

### Step 1️⃣: FILE SELECTION

**Frontend Console:**

```
[FileUpload] File selected:
  - Name: your_file.xlsx
  - Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  - Size: 456.78 KB
[FileUpload] ✓ File type validated
```

✅ **Means**: File uploaded successfully and passed validation

---

### Step 2️⃣: PROMPT SUBMISSION

**Frontend Console:**

```
[PromptInput] Form submitted with prompt: (Empty - will use AI suggestions)
```

OR

```
[PromptInput] Form submitted with prompt: Show sales by region
```

✅ **Means**: Prompt submitted (can be empty or with requirement)

---

### Step 3️⃣: UPLOAD PAGE HANDLING

**Frontend Console:**

```
[UploadPage] Submitting request with file: your_file.xlsx
[UploadPage] Prompt: (Empty - AI will suggest)
```

✅ **Means**: Frontend is preparing to send to backend

---

### Step 4️⃣: API REQUEST

**Frontend Console:**

```
[API Service] Starting generateCharts request...
[API Service] API Endpoint: POST /dashboard/generate
[API Service] FormData - file: File (your_file.xlsx, 467840 bytes)
[API Service] FormData - prompt: (empty)
[API Service] Sending HTTP POST request to backend...
```

✅ **Means**: Request sent to backend, waiting for response...

---

### Step 5️⃣: BACKEND FILE PROCESSING

**Backend Terminal:**

```
========== [Dashboard Controller] GenerateDashboard Started ==========
[Dashboard Controller] File received: your_file.xlsx (Size: 467840 bytes)
[Dashboard Controller] Prompt received: "" (Optional)
[Dashboard Controller] Prompt is empty - AI will suggest multiple charts
[Dashboard Controller] Processing file...
[Dashboard Controller] File processed successfully
[Dashboard Controller] Dataset columns: [Date Product Category Region Quantity Revenue]
[Dashboard Controller] Dataset rows: 100
```

✅ **Means**: Backend received file and parsed it successfully

---

### Step 6️⃣: DATABASE SAVE

**Backend Terminal:**

```
[Dashboard Controller] Saving dataset to database...
[Dashboard Controller] Dataset saved with ID: 5
```

✅ **Means**: Dataset stored in database

---

### Step 7️⃣: AI PROMPT BUILDING

**Backend Terminal:**

```
[Dashboard Controller] Building AI prompt...
[Dashboard Controller] Available columns:
  - Date
  - Product
  - Category
  - Region
  - Quantity
  - Revenue
[Dashboard Controller] No user prompt - generating AI suggestions for multiple charts
```

✅ **Means**: Backend is creating the AI prompt (different based on whether user provided requirement)

---

### Step 8️⃣: CALLING OLLAMA AI

**Backend Terminal:**

```
[Dashboard Controller] Calling AI service to generate charts...

[AI Service] Calling Ollama Mistral with prompt...
[AI Service] Prompt length: 1200 characters
[AI Service] Sending HTTP POST request to Ollama...
[AI Service] Response Status: 200
[AI Service] Response received: 650 characters
[AI Service] First 200 chars: [{"type":"bar","title":"Sales by Region","xAxis":"Region",...
```

✅ **Means**: AI API called successfully and returned response

❌ **Error means**: Ollama not running → Check if `ollama serve` is running

---

### Step 9️⃣: PARSING CHARTS

**Backend Terminal:**

```
[AI Service] Parsing chart configuration from AI response...
[AI Service] Successfully parsed 4 charts
[AI Service] Chart 0: Type=bar, Title=Sales by Region
[AI Service] Chart 1: Type=line, Title=Revenue Trend
[AI Service] Chart 2: Type=pie, Title=Category Distribution
[AI Service] Chart 3: Type=scatter, Title=Quantity vs Revenue

[Dashboard Controller] Successfully parsed 4 charts
```

✅ **Means**: AI response successfully converted to chart configurations (MULTIPLE CHARTS!)

---

### Step 1️⃣0️⃣: POPULATING DATA

**Backend Terminal:**

```
[Dashboard Controller] Populating chart data from dataset...
[Dashboard Controller] Chart 1 populated with 8 data points
[Dashboard Controller] Chart 2 populated with 8 data points
[Dashboard Controller] Chart 3 populated with 8 data points
[Dashboard Controller] Chart 4 populated with 8 data points
```

✅ **Means**: Actual data from your file attached to each chart

---

### Step 1️⃣1️⃣: SAVING DASHBOARD

**Backend Terminal:**

```
[Dashboard Controller] Saving dashboard to database...
[Dashboard Controller] Dashboard saved with ID: 4
[Dashboard Controller] Generating response with 4 charts
========== [Dashboard Controller] GenerateDashboard Completed ==========
```

✅ **Means**: Dashboard created and ready to send back

---

### Step 1️⃣2️⃣: RESPONSE RECEIVED

**Frontend Console:**

```
[API Service] ✓ Response received successfully
[API Service] Response Status: 200
[API Service] Response Data: {dashboard_id: 4, dataset_id: 5, ...}
[API Service] Charts generated: 4 chart(s)
[API Service]   Chart 1: Type="bar", Title="Sales by Region", Data points=8
[API Service]   Chart 2: Type="line", Title="Revenue Trend", Data points=8
[API Service]   Chart 3: Type="pie", Title="Category Distribution", Data points=8
[API Service]   Chart 4: Type="scatter", Title="Quantity vs Revenue", Data points=8
[API Service] Dataset ID: 5
[API Service] Dashboard ID: 4
[API Service] Dataset Columns: Date, Product, Category, Region, Quantity, Revenue

[UploadPage] Response received: {dashboard_id: 4, dataset_id: 5, ...}
```

✅ **Means**: Response successfully returned from backend with multiple charts

---

### Step 1️⃣3️⃣: DASHBOARD DISPLAY

**Frontend Console:**

```
[DashboardPage] Charts data received:
[DashboardPage] Dashboard ID: 4
[DashboardPage] Dataset ID: 5
[DashboardPage] Dataset Columns: Date,Product,Category,Region,Quantity,Revenue
[DashboardPage] Total Charts: 4
[DashboardPage] Chart 1:
  - Type: bar
  - Title: Sales by Region
  - X-Axis: Region
  - Y-Axis: Revenue
  - Data Points: 8
  - Sample Data: {Date: "2024-01-01", Product: "Laptop", Category: "Electronics", Region: "North", Quantity: 5, Revenue: 50000}
[DashboardPage] Chart 2:
  - Type: line
  - Title: Revenue Trend
  - X-Axis: Date
  - Y-Axis: Revenue
  - Data Points: 8
```

✅ **Means**: Dashboard component parsed data and is ready to render

---

### Step 1️⃣4️⃣: CHART RENDERING

**Frontend Console:**

```
[ChartCard] Rendering chart 1:
  Type: bar
  Title: Sales by Region
  Full Config: {type: "bar", title: "Sales by Region", xAxis: "Region", yAxis: "Revenue", data: [...], ...}
[ChartCard] Rendering chart 2:
  Type: line
  Title: Revenue Trend
  Full Config: {type: "line", title: "Revenue Trend", xAxis: "Date", yAxis: "Revenue", data: [...], ...}
```

✅ **Means**: Charts are rendered on the screen!

---

## 🔴 Common Errors & Solutions

### Error: "No charts generated"

```
[Dashboard Controller] ERROR: Failed to parse AI response: JSON parsing failed
```

**Solution**: Check if Ollama is running: `ollama serve`

---

### Error: "No file provided"

```
[API Service] ERROR: 400 Bad Request
[API Service] Error Message: No file provided
```

**Solution**: Make sure file is selected before clicking Generate

---

### Error: "Cannot read response"

```
[AI Service] ERROR: Failed to call Ollama: connection refused
```

**Solution**: Ollama is not running. In terminal, run: `ollama serve`

---

### Empty Data Array

```
[Dashboard Controller] Chart 1 populated with 0 data points
```

**Solution**: Column names in chart don't match dataset columns. Check spelling/case.

---

## 🎯 Key Indicators to Look For

### ✅ Success Indicators:

- `✓` symbol appears in logs
- Multiple `[AI Service] Chart X:` lines (means multiple charts)
- `Chart X populated with N data points` (N > 0)
- Dashboard ID and Dataset ID are shown
- Charts array is not empty

### ❌ Failure Indicators:

- `✗` symbol appears
- "ERROR" keyword in logs
- Only 1 chart generated (old behavior)
- `data: []` in charts (old behavior)
- Backend logs don't appear (means request didn't reach server)

---

## 📊 Verifying Data in Charts

### Method 1: Browser DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click Generate Charts
4. Find `/dashboard/generate` request
5. Click on it → **Response** tab
6. Look for `"data": [` elements
7. Should see actual values, not empty array

### Method 2: Console

1. In browser console, expand the response objects
2. Look for `charts` array
3. Click on each chart to expand
4. Check `data` property contains real values

### Method 3: Display Check

1. If charts show data visually → It's working!
2. If charts are blank → Data still missing (check column mapping)

---

## 📝 Example Log Trace

**Complete flow from start to finish:**

```
[FileUpload] File selected: data.xlsx (500 KB)
[FileUpload] ✓ File type validated
[PromptInput] Form submitted with prompt: (Empty - will use AI suggestions)
[UploadPage] Submitting request with file: data.xlsx
[UploadPage] Prompt: (Empty - AI will suggest)
[API Service] Starting generateCharts request...
[API Service] Sending HTTP POST request to backend...

[Backend shows: Processing file...]
[Backend shows: Calling Ollama...]
[Backend shows: Parsed 4 charts]
[Backend shows: Populated 8 data points per chart]
[Backend shows: Dashboard saved with ID: 4]

[API Service] ✓ Response received successfully
[API Service] Charts generated: 4 chart(s)
[DashboardPage] Total Charts: 4
[ChartCard] Rendering chart 1... (repeat for each chart)

✅ RESULT: 4 charts displayed on screen with real data!
```

---

## 🚀 How to Use This Guide

1. **Before running**: Open browser DevTools AND terminal with backend
2. **Upload file**: Watch frontend logs appear
3. **Submit prompt**: Watch both frontend and backend logs
4. **Wait for response**: Follow the chain of logs
5. **Charts appear**: Verify with ChartCard logs
6. **If something breaks**: Look for ERROR keyword in logs
7. **Check data**: Find `Data Points: N` where N > 0

---

## 💡 Pro Tips

- **Keep logs open**: Don't minimize console while testing
- **Use timestamps**: Backend logs show when each step happened
- **Filter logs**: Search for "[UploadPage]" or "[AI Service]" to focus
- **Copy full logs**: Right-click console → Save log for debugging
- **Clear logs**: Type `clear()` and press Enter to clean up
- **Search logs**: Ctrl+F in console to find specific messages

---
