import { useEffect, useRef, useState } from "react";
import { askQuestion, getConversation } from "../api/api";

function ChatPanel({
  currentConversation,
  onConversationCreated,
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Load selected conversation
  useEffect(() => {
    if (!currentConversation) {
      setMessages([]);
      return;
    }

    loadConversation(currentConversation);
  }, [currentConversation]);

  const loadConversation = async (conversationId) => {
    try {
      const data = await getConversation(conversationId);

      const history = [];

      data.forEach((chat) => {
        history.push({
          role: "user",
          text: chat.question,
        });

        history.push({
          role: "assistant",
          text: chat.answer,
        });
      });

      setMessages(history);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userQuestion = question;

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await askQuestion(
        userQuestion,
        currentConversation
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.answer,
        },
      ]);

      // New conversation created
      if (!currentConversation && onConversationCreated) {
        onConversationCreated(response.conversation_id);
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">

            <h1 className="text-4xl font-bold mb-4">
              📚 RAG Study Assistant
            </h1>

            <p className="text-gray-600 mb-8">
              Ask questions about your uploaded PDF.
            </p>

            <div className="bg-white rounded-xl shadow p-6 max-w-xl w-full">

              <p className="font-semibold mb-3">
                Try asking:
              </p>

              <ul className="space-y-2 text-gray-600">

                <li>📖 Summarize this chapter</li>

                <li>🧠 Explain this topic simply</li>

                <li>🎯 Give important interview questions</li>

                <li>📝 Make short notes</li>

              </ul>

            </div>

          </div>
        ) : (
          <>
            {messages.map((message, index) => (

              <div
                key={index}
                className={`flex mb-5 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-3xl rounded-2xl px-5 py-4 shadow ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >

                  <div className="font-semibold mb-2">

                    {message.role === "user"
                      ? "🧑 You"
                      : "🤖 AI"}

                  </div>

                  <div className="whitespace-pre-wrap">
                    {message.text}
                  </div>

                </div>

              </div>

            ))}

            {loading && (
              <div className="flex">

                <div className="bg-white rounded-xl px-5 py-4 shadow">

                  🤖 Thinking...

                </div>

              </div>
            )}

            <div ref={chatEndRef}></div>
          </>
        )}

      </div>

      {/* Input */}
      <div className="border-t bg-white p-5">

        <div className="flex gap-4">

          <input
            type="text"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
            placeholder="Ask anything about your PDF..."
            className="flex-1 border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl transition disabled:opacity-50"
          >
            Send 🚀
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatPanel;