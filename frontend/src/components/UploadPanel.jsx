import { useRef, useState } from "react";
import { uploadPDF } from "../api/api";

function UploadPanel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("❌ Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("⚠️ Please choose a PDF first.");
      return;
    }

    setUploading(true);

    try {
      const response = await uploadPDF(selectedFile);

      setMessage(
        `✅ ${response.filename} uploaded successfully!`
      );
    } catch (error) {
      console.error(error);

      setMessage("❌ Upload failed.");
    }

    setUploading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-2">
        📄 Upload PDF
      </h2>

      <p className="text-gray-500 mb-6">
        Upload a study material PDF and chat with it using AI.
      </p>

      <div
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition"
        onClick={() => fileInputRef.current.click()}
      >

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="text-5xl mb-3">
          📚
        </div>

        <div className="text-lg font-semibold">

          Click here to choose a PDF

        </div>

        <div className="text-gray-500 mt-2">

          Supported format: PDF

        </div>

      </div>

      {selectedFile && (

        <div className="mt-6 bg-gray-100 rounded-xl p-4">

          <div className="font-semibold">

            Selected File

          </div>

          <div className="mt-2">

            📄 {selectedFile.name}

          </div>

          <div className="text-gray-500 text-sm">

            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB

          </div>

        </div>

      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 transition disabled:opacity-50"
      >
        {uploading
          ? "Uploading..."
          : "Upload PDF"}
      </button>

      {message && (

        <div
          className={`mt-5 rounded-xl p-4 ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>

      )}

    </div>
  );
}

export default UploadPanel;