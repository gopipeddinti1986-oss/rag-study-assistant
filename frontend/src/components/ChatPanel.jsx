import { useState } from "react";
import { askQuestion } from "../api/api";

function ChatPanel() {
  // User question
  const [question, setQuestion] = useState("");

  // AI answer
  const [answer, setAnswer] = useState(
    "👋 Hello! Upload a PDF and ask any question."
  );

  // Source citations
  const [sources, setSources] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Send question to backend
  async function handleSend() {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    try {
      setLoading(true);

      const result = await askQuestion(question);

      console.log("Backend Response:", result);

      setAnswer(result.answer);
      setSources(result.sources || []);

      setQuestion("");
    } catch (error) {
      console.error(error);

      setAnswer("❌ Failed to get response from AI.");
      setSources([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-[500px]">

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">
        🤖 AI Chat
      </h2>

      {/* Chat Window */}
      <div className="flex-1 border rounded-lg p-4 overflow-y-auto bg-gray-50">

        {loading ? (
          <div className="flex items-center justify-center h-full">

            <div className="flex items-center gap-3 bg-blue-100 text-blue-900 px-5 py-4 rounded-lg shadow">

              <div className="w-5 h-5 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

              <span className="font-medium">
                🤖 AI is analyzing your document...
              </span>

            </div>

          </div>
        ) : (

          <div className="bg-blue-100 text-blue-900 p-4 rounded-lg shadow">

            <p className="whitespace-pre-wrap">
              {answer}
            </p>

            {sources.length > 0 && (
              <div className="mt-4 border-t pt-3">

                <h3 className="font-semibold text-blue-700 mb-2">
                  📄 Sources
                </h3>

                {sources.map((source, index) => (
                  <p
                    key={index}
                    className="text-sm text-gray-700"
                  >
                    • {source.filename} (Page {source.page})
                  </p>
                ))}

              </div>
            )}

          </div>

        )}

      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-2">

        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              handleSend();
            }
          }}
          disabled={loading}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-5 rounded-lg text-white transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🤖 Analyzing..." : "Send"}
        </button>

      </div>

    </section>
  );
}

export default ChatPanel;