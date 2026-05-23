import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import PromptInput from "../components/PromptInput";
import { generateCharts } from "../services/api";

const UploadPage = ({ onChartsGenerated }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError("");
  };

  const handlePromptSubmit = async (prompt) => {
    if (!file) {
      setError("Please upload a file first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", prompt || ""); // Allow empty prompt

      console.log("[UploadPage] Submitting request with file:", file.name);
      console.log(
        "[UploadPage] Prompt:",
        prompt ? prompt : "(Empty - AI will suggest)",
      );

      const response = await generateCharts(formData);
      console.log("[UploadPage] Response received:", response);
      onChartsGenerated(response);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to generate charts. Make sure the backend is running.",
      );
      console.error("[UploadPage] Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
              🎨 AI Chart Dashboard
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Upload your data and describe what charts you want
            </p>

            <div className="space-y-8">
              <FileUpload onFileSelect={handleFileSelect} />
              <PromptInput
                onPromptSubmit={handlePromptSubmit}
                isLoading={isLoading}
              />

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                  ❌ {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
