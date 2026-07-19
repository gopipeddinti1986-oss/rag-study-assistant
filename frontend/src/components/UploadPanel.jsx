import { useRef, useState } from "react";

function UploadPanel() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">
        📄 Upload PDF
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center gap-4">

        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          Choose PDF
        </button>

        <p className="text-gray-500 text-sm text-center px-3">
          {fileName}
        </p>

      </div>
    </section>
  );
}

export default UploadPanel;