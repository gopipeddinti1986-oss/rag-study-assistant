import { useRef, useState } from "react";
import { uploadPDF } from "../api/api";

function UploadPanel() {
  // Reference to hidden file input
  const fileInputRef = useRef(null);

  // States
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Choose PDF
  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setMessage("");
    }
  }

  // Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  // Drag Leave
  const handleDragLeave = () => {
    setDragActive(false);
  };

  // Drop File
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setMessage("");
    }
  };

  // Upload PDF
  async function handleUpload() {
    if (!selectedFile) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      const result = await uploadPDF(selectedFile);

      console.log("Backend Response:", result);

      setMessage(result.message);
    } catch (error) {
      console.log("========== UPLOAD ERROR ==========");
      console.log(error);

      if (error.response) {
        console.log("Response Data:", error.response.data);
        console.log("Response Status:", error.response.status);
      }

      if (error.request) {
        console.log("Request:", error.request);
      }

      console.log("Error Message:", error.message);

      setMessage("Upload Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        📄 Upload PDF
      </h2>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2
          border-dashed
          rounded-xl
          p-8
          flex
          flex-col
          items-center
          gap-5
          transition-all
          duration-300
          ${
            dragActive
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300"
          }
        `}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* No File Selected */}
        {!selectedFile ? (
          <>
            <div className="text-center">
              <div className="text-6xl mb-3">
                {dragActive ? "📥" : "📄"}
              </div>

              <h3 className="text-xl font-semibold">
                {dragActive
                  ? "Drop your PDF here"
                  : "Drag & Drop your PDF here"}
              </h3>

              <p className="text-gray-500 mt-2">
                or
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Choose PDF
            </button>

            <p className="text-sm text-gray-400">
              Supported format: PDF
            </p>
          </>
        ) : (
          <>
            {/* File Selected */}
            <div className="text-center">
              <div className="text-5xl mb-2">
                ✅
              </div>

              <h3 className="font-semibold text-lg break-all">
                {fileName}
              </h3>

              <p className="text-green-600 text-sm mt-2">
                Ready to upload
              </p>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
              >
                Change PDF
              </button>

              <button
                onClick={handleUpload}
                disabled={loading}
                className={`px-5 py-3 rounded-lg text-white transition ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "⏳ Uploading..." : "Upload PDF"}
              </button>
            </div>
          </>
        )}

        {/* Upload Status */}
        {message && (
          <p
            className={`font-medium text-center ${
              message === "Upload Failed"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

export default UploadPanel;