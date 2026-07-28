import { useRef, useState } from "react";
import { uploadPDF, createConversation } from "../api/api";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, FileCode, Sparkles } from "lucide-react";

function UploadPanel({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [statusType, setStatusType] = useState("info"); // success, error, info
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;

    const allowed = [".pdf", ".docx", ".txt"];
    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (!allowed.includes(ext)) {
      setMessage("Please select a PDF, DOCX, or TXT file.");
      setStatusType("error");
      return false;
    }

    setSelectedFile(file);
    setMessage("");
    return true;
  };

  const handleFileChange = (event) => {
    validateFile(event.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    validateFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please choose a study file first.");
      setStatusType("error");
      return;
    }

    setUploading(true);
    setMessage("Processing text & embeddings...");
    setStatusType("info");

    try {
      const response = await uploadPDF(selectedFile);

      setMessage(`'${response.filename}' uploaded successfully! (${response.chunks} vector chunks indexed)`);
      setStatusType("success");

      // Create new chat conversation session
      const conversation = await createConversation();

      if (onUploadSuccess) {
        onUploadSuccess(conversation.conversation_id);
      }

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Make sure backend service is running.");
      setStatusType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors">
      
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Upload Study Documents</h2>
          <p className="text-xs text-slate-400">Index PDF, DOCX, or TXT for AI RAG analysis & OCR</p>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-5 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-indigo-500 bg-indigo-500/15 scale-[1.01]"
            : "border-slate-700/80 hover:border-indigo-500/50 bg-slate-800/30 hover:bg-slate-800/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-14 h-14 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-indigo-400 group-hover:scale-110 transition">
          <FileCode className="w-7 h-7" />
        </div>

        <div className="text-sm font-semibold text-slate-200">
          {dragging ? "Drop document here" : "Click to browse or Drag & Drop"}
        </div>

        <div className="text-xs text-slate-500 mt-1">
          Supports <span className="text-indigo-400 font-medium">PDF, DOCX, TXT</span> (Max 50MB)
        </div>
      </div>

      {/* Selected File Card */}
      {selectedFile && (
        <div className="mt-4 bg-slate-800/70 border border-slate-700/70 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="font-semibold text-xs text-white truncate max-w-[200px]">
                {selectedFile.name}
              </div>
              <div className="text-[11px] text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1"
          >
            Remove
          </button>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="mt-5 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-2xl py-3 text-xs tracking-wide transition shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Indexing Vector Embeddings...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Process & Start Chat</span>
          </>
        )}
      </button>

      {/* Status Message */}
      {message && (
        <div
          className={`mt-4 rounded-2xl p-3.5 text-xs flex items-center gap-2.5 border ${
            statusType === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : statusType === "error"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
              : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
          }`}
        >
          {statusType === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}

export default UploadPanel;