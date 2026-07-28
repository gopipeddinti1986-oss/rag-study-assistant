import { useEffect, useRef, useState } from "react";
import { askQuestion, getConversation, addBookmark } from "../api/api";
import { useVoiceInput } from "../hooks/useVoiceInput";
import {
  Send,
  Mic,
  MicOff,
  Copy,
  Bookmark,
  FileText,
  Sparkles,
  Bot,
  User,
  Check,
  BookOpen,
  HelpCircle
} from "lucide-react";

function ChatPanel({ currentConversation, onConversationCreated }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [bookmarkedIndex, setBookmarkedIndex] = useState(null);

  const chatEndRef = useRef(null);

  // Web Speech Voice Dictation
  const { isListening, toggleListening, error: voiceError } = useVoiceInput(
    (transcript) => {
      setQuestion((prev) => (prev ? prev + " " + transcript : transcript));
    }
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!currentConversation) {
      setMessages([]);
      setQuestion("");
      setLoading(false);
      return;
    }
    loadConversation(currentConversation);
  }, [currentConversation]);

  const loadConversation = async (conversationId) => {
    try {
      const data = await getConversation(conversationId);
      const history = [];

      data.forEach((chat) => {
        if (!chat.question.trim()) return;

        history.push({
          role: "user",
          text: chat.question,
          time: new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        history.push({
          role: "assistant",
          text: chat.answer,
          question: chat.question,
          sources: chat.sources || [],
          time: new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      });

      setMessages(history);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleBookmark = async (index, questionText, answerText) => {
    try {
      await addBookmark(currentConversation, questionText, answerText);
      setBookmarkedIndex(index);
      setTimeout(() => setBookmarkedIndex(null), 2500);
    } catch (error) {
      console.error(error);
    }
  };

  const copyAnswer = async (index, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAsk = async (textToSend) => {
    const query = textToSend || question;
    if (!query.trim()) return;

    const userQuestion = query;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await askQuestion(userQuestion, currentConversation);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.answer,
          question: userQuestion,
          sources: response.sources || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (!currentConversation && onConversationCreated) {
        onConversationCreated(response.conversation_id);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong retrieving vectors or connecting to LLM. Please make sure documents are uploaded.",
          question: userQuestion,
          sources: [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "Summarize the main concepts in this document",
    "What are the key terms and definitions?",
    "Generate 3 sample exam questions from this file",
    "Explain the core theory simply with an example"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 relative">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 custom-scrollbar">
        
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto px-4">
            
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              What do you want to learn today?
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              Upload study PDFs on the left or choose a prompt below to query your knowledge base.
            </p>

            {/* Quick Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-indigo-500/40 text-left text-xs font-medium text-slate-300 hover:text-white transition shadow-sm flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition shrink-0 ml-2" />
                </button>
              ))}
            </div>

          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 md:gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant Avatar */}
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-3xl p-5 md:p-6 shadow-xl transition ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  {/* Message Meta */}
                  <div className="flex items-center justify-between gap-4 mb-2 text-xs opacity-75">
                    <span className="font-semibold tracking-wide">
                      {message.role === "user" ? "You" : "Study Assistant AI"}
                    </span>
                    <span className="text-[10px]">{message.time}</span>
                  </div>

                  {/* Body Content */}
                  <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-normal">
                    {message.text}
                  </div>

                  {/* Assistant Actions & Citations */}
                  {message.role === "assistant" && (
                    <div className="mt-5 border-t border-slate-800/80 pt-4 space-y-3">
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyAnswer(index, message.text)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 hover:text-white transition border border-slate-700/50"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleBookmark(index, message.question, message.text)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-amber-400 hover:text-amber-300 transition border border-slate-700/50"
                        >
                          {bookmarkedIndex === index ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                              <span>Saved!</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Bookmark</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Source Citations */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60 text-xs">
                          <div className="font-bold text-indigo-400 mb-1.5 flex items-center gap-1.5 text-[11px]">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Grounded Sources ({message.sources.length}):</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((src, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700/60"
                              >
                                📄 {src.filename} <span className="text-indigo-400 font-bold">(Pg {src.page})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* User Avatar */}
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-purple-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Skeleton Loading State */}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md shadow-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing vector chunks...</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded w-48 animate-pulse"></div>
                  <div className="h-3 bg-slate-800 rounded w-36 animate-pulse"></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </>
        )}

      </div>

      {/* Voice Error Banner */}
      {voiceError && (
        <div className="bg-rose-500/20 border-t border-rose-500/30 text-rose-300 text-xs px-4 py-2 text-center">
          {voiceError}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          
          {/* Voice Input Mic Button */}
          <button
            onClick={toggleListening}
            title={isListening ? "Listening... Click to stop" : "Speak to dictate question"}
            className={`p-3 rounded-2xl border transition ${
              isListening
                ? "bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30"
                : "bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Area */}
          <div className="flex-1 relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              rows={2}
              placeholder={isListening ? "Listening to your voice..." : "Ask questions grounded in your uploaded documents..."}
              className="w-full resize-none bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 custom-scrollbar"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>

        </div>
        <div className="text-[11px] text-slate-500 text-center mt-2 font-medium">
          Enter to send • Shift + Enter for new line • Click 🎤 for Voice Input
        </div>
      </div>

    </div>
  );
}

export default ChatPanel;