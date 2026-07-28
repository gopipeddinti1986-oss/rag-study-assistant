import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, LogOut, Activity, BookOpen, ShieldCheck } from "lucide-react";
import { getAdminStats } from "../api/api";

function Header() {
  const { logout } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const userEmail = localStorage.getItem("user_email") || "Student";
  const userName = localStorage.getItem("user_name") || userEmail.split("@")[0];

  const handleOpenStats = async () => {
    setStatsModalOpen(true);
    try {
      setLoadingStats(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <>
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between text-slate-900 dark:text-white sticky top-0 z-30 transition-colors duration-200">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight flex items-center gap-2">
              RAG Study Assistant
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold">
                Sprint 7 Complete
              </span>
            </div>
            <div className="text-xs text-slate-400">AI-Powered Academic Workspace</div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Admin / System Stats */}
          <button
            onClick={handleOpenStats}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">System Stats</span>
          </button>

          {/* User Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-medium text-slate-200 capitalize">{userName}</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 dark:text-indigo-400 transition border border-slate-700/50"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-medium transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Stats Modal */}
      {statsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6 text-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="text-lg font-bold">System Diagnostics & Stats</h3>
                  <p className="text-xs text-slate-400">Sprint 7 Admin Overview</p>
                </div>
              </div>
              <button
                onClick={() => setStatsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {loadingStats ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div>Fetching platform metrics...</div>
              </div>
            ) : stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="text-xs text-slate-400">My Uploaded Docs</div>
                    <div className="text-2xl font-black text-indigo-400 mt-1">
                      {stats.stats?.documents_count ?? 0}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="text-xs text-slate-400">My Vector Chunks</div>
                    <div className="text-2xl font-black text-purple-400 mt-1">
                      {stats.stats?.vector_chunks_count ?? 0}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="text-xs text-slate-400">Questions Asked</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {stats.stats?.questions_asked_count ?? 0}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">SQLite Database Status</span>
                    <span className="font-semibold text-emerald-400">{stats.stats?.database_status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">ChromaDB Vector Store</span>
                    <span className="font-semibold text-purple-400">{stats.stats?.chromadb_status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Total Registered Users</span>
                    <span className="font-semibold text-indigo-300">{stats.stats?.total_users}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Total System Queries</span>
                    <span className="font-semibold text-slate-200">{stats.stats?.total_chats_system}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-rose-400 py-6">Could not load statistics.</div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStatsModalOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
