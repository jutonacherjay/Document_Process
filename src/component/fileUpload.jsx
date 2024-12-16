import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvFilePath, setCsvFilePath] = useState(null);
  const [excelFilePath, setExcelFilePath] = useState(null);

  const handleFileUpload = (e, fileType) => {
    if (fileType === "csv") {
      setCsvFile(e.target.files[0]);
    } else if (fileType === "xlsx") {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!csvFile || !excelFile) {
      alert("Please upload both files.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("excelFile", excelFile);

    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/process-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCsvFilePath(response.data.processedCSV);
      setExcelFilePath(response.data.processedExcel);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("An error occurred while processing the files.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Document Processor</h1>

      {/* File Upload Section */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between gap-8 mb-6">
        {/* Left Input (CSV) */}
        <div className="bg-white shadow-lg p-6 rounded-lg w-full sm:w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload CSV File</h2>
          <div className="border-dashed border-2 border-gray-300 p-8 rounded-lg flex flex-col items-center justify-center space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e, "csv")}
              className="hidden"
              id="csvFileInput"
            />
            <label
              htmlFor="csvFileInput"
              className="cursor-pointer text-gray-700 font-medium text-lg hover:text-blue-500"
            >
              Drag & Drop or Click to Upload CSV
            </label>
            {csvFile && (
              <div className="text-gray-600 mt-2">
                <strong>File Selected: </strong> {csvFile.name}
              </div>
            )}
          </div>
        </div>

        {/* Right Input (Excel) */}
        <div className="bg-white shadow-lg p-6 rounded-lg w-full sm:w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Excel File</h2>
          <div className="border-dashed border-2 border-gray-300 p-8 rounded-lg flex flex-col items-center justify-center space-y-4">
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => handleFileUpload(e, "xlsx")}
              className="hidden"
              id="excelFileInput"
            />
            <label
              htmlFor="excelFileInput"
              className="cursor-pointer text-gray-700 font-medium text-lg hover:text-blue-500"
            >
              Drag & Drop or Click to Upload Excel
            </label>
            {excelFile && (
              <div className="text-gray-600 mt-2">
                <strong>File Selected: </strong> {excelFile.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={handleSubmit}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1116 0A8 8 0 014 12z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          "Process Files"
        )}
      </button>

      {/* Download Buttons Section */}
      {csvFilePath && excelFilePath && (
        <div className="mt-8 w-full max-w-4xl flex flex-col sm:flex-row justify-between gap-8">
          <a
            href={`http://127.0.0.1:8000/download-file/${csvFilePath}`}
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
          >
            Download Processed CSV
          </a>
          <a
            href={`http://127.0.0.1:8000/download-file/${excelFilePath}`}
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
          >
            Download Processed Excel
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
