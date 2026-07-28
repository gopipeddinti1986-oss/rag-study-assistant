import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getDocuments, deleteDocument } from "../api/api";
import { FolderKanban, FileText, Trash2, RefreshCw, Layers, Search, HardDrive } from "lucide-react";

function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}" and purge all its vector chunks from ChromaDB?`
    );
    if (!confirmed) return;

    setDeleting(filename);
    try {
      await deleteDocument(filename);
      setDocuments((prev) => prev.filter((doc) => doc.filename !== filename));
    } catch (err) {
      alert("Failed to delete document.");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalChunks = documents.reduce((acc, curr) => acc + (curr.chunk_count || 0), 0);

  const getExtBadge = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">PDF</span>;
    if (ext === "docx") return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">DOCX</span>;
    return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">TXT</span>;
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activePage="documents" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar max-w-5xl mx-auto w-full">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-2">
                <FolderKanban className="w-3.5 h-3.5" /> Sprint 7 Vector Index
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Document Repository</h1>
              <p className="text-xs text-slate-400">Manage uploaded PDFs, DOCX, and TXT files and clean up unused vector embeddings.</p>
            </div>

            <button
              onClick={loadDocuments}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 hover:text-white transition border border-slate-700/60 shrink-0 self-start sm:self-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh List</span>
            </button>
          </div>

          {/* Quick Metrics & Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Total Indexed Files</div>
                <div className="text-xl font-bold text-white">{documents.length}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Total Vector Chunks</div>
                <div className="text-xl font-bold text-white">{totalChunks}</div>
              </div>
            </div>

            {/* Filter Input */}
            <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center px-3 gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter by filename..."
                className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500"
              />
            </div>

          </div>

          {/* Document List */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Loading document index...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No Matching Documents</h3>
              <p className="text-xs text-slate-400">No documents found. Upload a study document on the main dashboard.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.filename}
                  className="bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 transition shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                      <FileText className="w-5 h-5 text-sky-400" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white truncate max-w-xs md:max-w-md">
                          {doc.filename}
                        </span>
                        {getExtBadge(doc.filename)}
                      </div>

                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>{doc.chunk_count} chunks indexed</span>
                        {doc.uploaded_at && doc.uploaded_at !== "—" && (
                          <>
                            <span>•</span>
                            <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(doc.filename)}
                    disabled={deleting === doc.filename}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition disabled:opacity-40 shrink-0"
                  >
                    {deleting === doc.filename ? (
                      <span>Deleting...</span>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Purge</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default DocumentManager;
