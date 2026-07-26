import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getConversations,
  deleteConversation,
} from "../api/api";

function Sidebar({
  currentConversation,
  onSelectConversation,
  onNewChat,
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleDelete = async (conversationId) => {
    const confirmDelete = window.confirm(
      "Delete this conversation?"
    );

    if (!confirmDelete) return;

    try {
      await deleteConversation(conversationId);

      if (currentConversation === conversationId) {
        onNewChat();
      }

      loadConversations();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-72 bg-slate-900 text-white flex flex-col border-r border-slate-700">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          📚 RAG AI
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Study Assistant
        </p>
      </div>

      {/* Buttons */}
      <div className="p-4 space-y-3">

        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold transition"
        >
          ➕ New Chat
        </button>

        <button
          onClick={() => navigate("/quiz")}
          className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-3 font-semibold transition"
        >
          🧠 AI Quiz
        </button>

      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">

        {loading && (
          <div className="text-center text-gray-400 mt-10">
            Loading...
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="text-center text-gray-500 mt-10 px-4">
            No conversations yet.
          </div>
        )}

        {conversations.map((chat) => (
          <div
            key={chat.conversation_id}
            className={`mx-3 mb-2 rounded-xl transition ${
              currentConversation === chat.conversation_id
                ? "bg-slate-700"
                : "hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center">

              <button
                onClick={() =>
                  onSelectConversation(chat.conversation_id)
                }
                className="flex-1 text-left px-4 py-4"
              >
                <div className="font-medium truncate">
                  {chat.title}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {new Date(
                    chat.created_at
                  ).toLocaleDateString()}
                </div>
              </button>

              <button
                onClick={() =>
                  handleDelete(chat.conversation_id)
                }
                className="px-4 text-red-400 hover:text-red-600"
              >
                🗑️
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">

        <div className="text-sm text-gray-400">
          RAG Study Assistant
        </div>

        <div className="text-xs text-gray-500 mt-1">
          Sprint 7
        </div>

      </div>

    </div>
  );
}

export default Sidebar;