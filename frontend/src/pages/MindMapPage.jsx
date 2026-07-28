import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MindMapTree from "../components/MindMapTree";
import { getMindMap } from "../api/api";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { GitFork, Sparkles, Mic, MicOff, Search } from "lucide-react";

export default function MindMapPage() {
  const [topic, setTopic] = useState("");
  const [mindMapData, setMindMapData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isListening, toggleListening } = useVoiceInput((transcript) => {
    setTopic(transcript);
  });

  const fetchMindMap = async (targetTopic = "") => {
    try {
      setLoading(true);
      const res = await getMindMap(targetTopic || topic);
      setMindMapData(res.mindmap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMindMap();
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activePage="mindmap" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <GitFork className="w-4 h-4" /> Sprint 7 Visual Mind Map
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Interactive Chapter Mind Map
                </h1>
                <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                  Automated visual concept trees extracted from your uploaded study documents with topic focus and voice dictation.
                </p>
              </div>

              {/* Topic Focus Search */}
              <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 w-full md:w-auto">
                <button
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition ${
                    isListening
                      ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                      : "bg-slate-800 text-slate-400 hover:text-white border-slate-700"
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchMindMap()}
                  placeholder="Focus topic (e.g. Deadlock)..."
                  className="bg-transparent text-xs text-white outline-none px-2 w-48 md:w-64"
                />

                <button
                  onClick={() => fetchMindMap()}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mind Map Tree Container */}
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Synthesizing visual concept tree from vector embeddings...</p>
            </div>
          ) : (
            <MindMapTree data={mindMapData} />
          )}

        </main>
      </div>
    </div>
  );
}
