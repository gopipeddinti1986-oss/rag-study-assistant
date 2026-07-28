import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { generateNotes } from "../api/api";
import { BookOpen, Sparkles, Copy, Download, Check, RefreshCw } from "lucide-react";

function Notes() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await generateNotes();
      setNotes(response.notes || "No notes generated.");
    } catch (error) {
      console.error(error);
      setNotes("Failed to generate AI study notes. Make sure documents are uploaded.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([notes], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "AI_Study_Notes.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activePage="notes" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar max-w-5xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
                <BookOpen className="w-3.5 h-3.5" /> Sprint 7 Structured Notes
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">AI Study Summary Notes</h1>
              <p className="text-xs text-slate-400">Automated key takeaways, formulas, definitions, and chapter summaries.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadNotes}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition border border-slate-700/60"
                title="Regenerate Notes"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={handleCopy}
                disabled={loading || !notes}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition border border-slate-700/60"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={loading || !notes}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Export Notes</span>
              </button>
            </div>
          </div>

          {/* Notes Content Card */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Synthesizing study notes from document vector chunks...</p>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
              <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap text-slate-200">
                {notes}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Notes;