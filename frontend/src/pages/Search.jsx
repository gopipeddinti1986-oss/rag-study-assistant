import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { semanticSearch } from "../api/api";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { Search as SearchIcon, Mic, MicOff, FileText, Sparkles, Copy, Check, ExternalLink } from "lucide-react";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const navigate = useNavigate();

  const { isListening, toggleListening } = useVoiceInput((transcript) => {
    setQuery(transcript);
  });

  const handleSearch = async (textToSearch) => {
    const q = textToSearch || query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const data = await semanticSearch(q);
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (index, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activePage="search" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar max-w-6xl mx-auto w-full">
          
          {/* Google Style Search Header */}
          <div className="text-center space-y-3 pt-4 pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              <SearchIcon className="w-3.5 h-3.5" /> Vector Semantic Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Google-Style Document Search
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
              Search across all your uploaded PDFs, DOCX, and TXT files instantly using dense vector embeddings.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 focus-within:border-purple-500/80 transition">
              
              <SearchIcon className="w-5 h-5 text-slate-400 shrink-0" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={isListening ? "Listening to your query..." : "Search key concepts, terms, or questions..."}
                className="bg-transparent text-sm text-white outline-none flex-1 placeholder:text-slate-500"
              />

              {/* Mic Dictation */}
              <button
                onClick={toggleListening}
                title={isListening ? "Stop voice search" : "Voice search"}
                className={`p-2.5 rounded-xl border transition ${
                  isListening
                    ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                    : "bg-slate-800 text-slate-400 hover:text-white border-slate-700"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Search Submit */}
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-500/25 disabled:opacity-40 shrink-0 flex items-center gap-1.5"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Search</span>
                )}
              </button>
            </div>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Scanning ChromaDB collection vectors...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 px-1">
                Found {results.length} relevant vector chunks for <span className="text-purple-400">"{query}"</span>
              </div>

              {results.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 rounded-3xl p-5 md:p-6 transition shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{item.filename}</div>
                        <div className="text-[11px] text-purple-400 font-mono">Page {item.page}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(index, item.text)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs transition border border-slate-700/60"
                        title="Copy snippet"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold border border-indigo-500/30 transition"
                      >
                        <span>Ask AI</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 whitespace-pre-wrap font-sans">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          ) : query && !loading ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No vector matches found for "{query}". Try uploading more documents or adjusting search keywords.
            </div>
          ) : null}

        </main>
      </div>
    </div>
  );
}

export default Search;