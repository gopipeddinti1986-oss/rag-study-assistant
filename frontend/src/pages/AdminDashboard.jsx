import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getAdminStats } from "../api/api";
import { BarChart2, ShieldCheck, Database, FileText, Layers, MessageSquare, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activePage="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar max-w-5xl mx-auto w-full">
          
          <div className="border-b border-slate-800 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Sprint 7 Admin Dashboard
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">System Metrics & Admin Analytics</h1>
            <p className="text-xs text-slate-400">Database health status, vector storage breakdown, and query activity.</p>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Aggregating platform metrics...</p>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">My Documents</span>
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mt-3">
                    {stats.stats?.documents_count ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Uploaded & indexed</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Vector Chunks</span>
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mt-3">
                    {stats.stats?.vector_chunks_count ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">ChromaDB embeddings</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">My Questions</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mt-3">
                    {stats.stats?.questions_asked_count ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Queries processed</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">System Users</span>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mt-3">
                    {stats.stats?.total_users ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Registered accounts</div>
                </div>

              </div>

              {/* Status Details */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Infrastructure Diagnostics</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="font-semibold text-slate-300">SQLite Database Engine</div>
                    <div className="flex justify-between text-slate-400">
                      <span>Status:</span>
                      <span className="text-emerald-400 font-bold">{stats.stats?.database_status}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Total System Queries:</span>
                      <span className="text-white font-mono">{stats.stats?.total_chats_system}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="font-semibold text-slate-300">ChromaDB Vector Store</div>
                    <div className="flex justify-between text-slate-400">
                      <span>Isolation Mode:</span>
                      <span className="text-purple-400 font-bold">Per-User Collection</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Collection Key:</span>
                      <span className="text-indigo-300 font-mono">{stats.user_email?.replace("@", "_").replace(".", "_")}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center text-rose-400 py-12">Failed to load admin stats.</div>
          )}

        </main>
      </div>
    </div>
  );
}
