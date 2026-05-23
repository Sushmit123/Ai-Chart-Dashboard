import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generateCharts = async (formData) => {
  try {
    console.log("[API Service] Starting generateCharts request...");
    console.log("[API Service] API Endpoint: POST /dashboard/generate");
    
    const formDataEntries = Array.from(formData.entries());
    for (const [key, value] of formDataEntries) {
      if (value instanceof File) {
        console.log(`[API Service] FormData - ${key}: File (${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`[API Service] FormData - ${key}: ${value || "(empty)"}`);
      }
    }

    console.log("[API Service] Sending HTTP POST request to backend...");
    const response = await api.post('/dashboard/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("[API Service] ✓ Response received successfully");
    console.log("[API Service] Response Status:", response.status);
    console.log("[API Service] Full Response Data:", JSON.stringify(response.data, null, 2));
    
    if (response.data.charts) {
      console.log(`[API Service] Charts array type: ${Array.isArray(response.data.charts) ? 'Array' : typeof response.data.charts}`);
      console.log(`[API Service] Charts generated: ${response.data.charts.length} chart(s)`);
      response.data.charts.forEach((chart, index) => {
        console.log(`[API Service]   Chart ${index + 1}:`, JSON.stringify(chart, null, 2));
      });
    }

    console.log(`[API Service] Dataset ID: ${response.data.dataset_id}`);
    console.log(`[API Service] Dashboard ID: ${response.data.dashboard_id}`);
    console.log(`[API Service] Dataset Columns: ${response.data.dataset_columns?.join(", ")}`);

    return response.data;
  } catch (error) {
    console.error("[API Service] ✗ ERROR in generateCharts");
    console.error("[API Service] Error Status:", error.response?.status);
    console.error("[API Service] Error Message:", error.response?.data?.error || error.message);
    console.error("[API Service] Full Error:", error);
    throw error;
  }
};

export default api;
