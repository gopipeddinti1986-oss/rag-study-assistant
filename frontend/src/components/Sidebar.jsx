import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getConversations, deleteConversation } from "../api/api";
import {
  MessageSquarePlus,
  FileText,
  FolderKanban,
  GitFork,
  HelpCircle,
  Layers,
  Search,
  BookOpen,
  Bookmark,
  Trash2,
  BarChart2,
  Sparkles
} from "lucide-react";

function Sidebar({
  activePage,
  setActivePage,
  currentConversation,
  onSelectConversation,
  onNewChat = () => {},
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentConversation]);

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation history?")) return;

    try {
      await deleteConversation(conversationId);
      if (currentConversation === conversationId) onNewChat();
      loadConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const navItems = [
    { label: "AI Chat & Upload", path: "/", page: "dashboard", icon: FileText, color: "text-indigo-400" },
    { label: "My Documents", path: "/documents", page: "documents", icon: FolderKanban, color: "text-sky-400" },
    { label: "Visual Mind Map", path: "/mindmap", page: "mindmap", icon: GitFork, color: "text-emerald-400" },
    { label: "AI Quiz Generator", path: "/quiz", page: "quiz", icon: HelpCircle, color: "text-amber-400" },
    { label: "3D Flashcards", path: "/flashcards", page: "flashcards", icon: Layers, color: "text-orange-400" },
    { label: "Semantic Search", path: "/search", page: "search", icon: Search, color: "text-purple-400" },
    { label: "AI Study Notes", path: "/notes", page: "notes", icon: BookOpen, color: "text-cyan-400" },
    { label: "Saved Bookmarks", path: "/bookmarks", page: "bookmarks", icon: Bookmark, color: "text-yellow-400" },
    { label: "Admin Analytics", path: "/admin", page: "admin", icon: BarChart2, color: "text-rose-400" },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex flex-col h-screen select-none shrink-0 transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-black text-lg text-white tracking-wide">RAG Study AI</h1>
          <p className="text-[11px] text-indigo-400 font-medium tracking-tight">Full Sprint 1–7 Suite</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-3.5 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            if (location.pathname !== "/") navigate("/");
          }}
          className="w-full mb-3 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition transform active:scale-95 text-sm"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>New Chat Session</span>
        </button>

        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1">
          Study Tools
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname === "/" && activePage === item.page);

          return (
            <button
              key={item.path}
              onClick={() => {
                if (setActivePage) setActivePage(item.page);
                navigate(item.path);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition duration-150 ${
                isActive
                  ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? item.color : "text-slate-400"}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Section Divider */}
        <div className="pt-4 pb-1 flex items-center justify-between px-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recent Chats</span>
          <span className="text-[10px] text-slate-600 bg-slate-800/80 px-1.5 py-0.5 rounded">{conversations.length}</span>
        </div>

        {/* Conversations History */}
        {loading ? (
          <div className="text-center text-xs text-slate-500 py-3 animate-pulse">Loading history...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-xs text-slate-600 py-4 italic">No previous chats</div>
        ) : (
          <div className="space-y-1 mt-1">
            {conversations.map((chat) => {
              const isSelected = currentConversation === chat.conversation_id;

              return (
                <div
                  key={chat.conversation_id}
                  onClick={() => {
                    if (onSelectConversation) onSelectConversation(chat.conversation_id);
                    if (location.pathname !== "/") navigate("/");
                  }}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition ${
                    isSelected
                      ? "bg-slate-800 text-indigo-300 font-semibold border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate">{chat.title || "Untitled Chat"}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(chat.conversation_id, e)}
                    title="Delete Chat"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
        ⚡ RAG Architecture v2.0
      </div>

    </aside>
  );
}

export default Sidebar;
