import { useEffect, useState } from "react";
import { getBookmarks, deleteBookmark } from "../api/api";
import { Bookmark, Trash2, Copy, Check, HelpCircle } from "lucide-react";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const data = await getBookmarks();
      setBookmarks(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBookmark(id);
      loadBookmarks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading saved bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5" /> Bookmarked Answers
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Saved Study QA</h1>
          <p className="text-xs text-slate-400">Your collection of bookmarked AI answers for quick review.</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Saved Bookmarks</h3>
          <p className="text-xs text-slate-400">Bookmark answers during AI chat sessions to view them here later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-4 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white leading-snug">{b.question}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(b.id, b.answer)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs transition border border-slate-700/60"
                    title="Copy Answer"
                  >
                    {copiedId === b.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 text-xs md:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {b.answer}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Bookmarks;