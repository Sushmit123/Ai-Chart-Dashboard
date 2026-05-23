import React, { useState } from "react";

const FileUpload = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("[FileUpload] File selected:");
      console.log(`  - Name: ${file.name}`);
      console.log(`  - Type: ${file.type}`);
      console.log(`  - Size: ${(file.size / 1024).toFixed(2)} KB`);

      const allowedTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(file.type)) {
        console.error("[FileUpload] ✗ Invalid file type:", file.type);
        alert("Please upload a CSV or Excel file");
        return;
      }

      console.log("[FileUpload] ✓ File type validated");
      setFileName(file.name);
      setPreview(`📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload CSV or Excel File
      </label>
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-600">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">CSV or Excel files</p>
        </label>
      </div>
      {preview && (
        <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-green-700">
          {preview}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
