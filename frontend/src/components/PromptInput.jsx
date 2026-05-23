import React, { useState } from "react";

const PromptInput = ({ onPromptSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "[PromptInput] Form submitted with prompt:",
      prompt.trim() || "(Empty - will use AI suggestions)",
    );
    onPromptSubmit(prompt);
    setPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Describe Your Chart Requirements{" "}
        <span className="text-sm text-gray-500">(Optional)</span>
      </label>
      <div className="flex gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Create a line chart showing monthly sales trends... (Leave empty for AI suggestions)"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        {isLoading ? "⏳ Generating..." : "✨ Generate Charts"}
      </button>
      {!prompt.trim() && (
        <p className="mt-2 text-xs text-blue-600">
          💡 Tip: Leave empty for AI to suggest multiple charts
        </p>
      )}
    </form>
  );
};

export default PromptInput;
