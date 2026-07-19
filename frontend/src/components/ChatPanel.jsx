function ChatPanel() {
  return (
    <section className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-[420px]">
      <h2 className="text-2xl font-semibold mb-4">
        🤖 AI Chat
      </h2>

      <div className="flex-1 border rounded-lg p-4 overflow-y-auto bg-gray-50">
        <div className="bg-blue-100 text-blue-900 p-3 rounded-lg w-fit max-w-xs">
          👋 Hello! Upload a PDF to start asking questions.
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Ask a question..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg transition">
          Send
        </button>
      </div>
    </section>
  );
}

export default ChatPanel;