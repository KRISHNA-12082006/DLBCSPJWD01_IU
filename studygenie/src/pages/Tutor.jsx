// Import hooks and markdown renderer
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

// LocalStorage key for persisting chat
const CHATLOG_KEY = "studygenie_tutor_chatlog";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/ai/chat`;

/**
 * Tutor component provides an AI-powered academic Q&A chat.
 * Frontend sends chat history to backend, backend calls AI API.
 * @component 
 * @returns {JSX.Element} Tutor page
 */
export default function Tutor() {
  // State for chat log, input text, and loading status
  const [chatLog, setChatLog] = useState(() => {
    const saved = localStorage.getItem(CHATLOG_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Save chat log to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CHATLOG_KEY, JSON.stringify(chatLog));
  }, [chatLog]);

  // Scroll to bottom on mount and load saved chat
  useEffect(() => {
    const saved = localStorage.getItem(CHATLOG_KEY);
    if (saved) setChatLog(JSON.parse(saved));

    // Scroll after short delay
    setTimeout(() => {
      const endElem = document.getElementById("end");
      if (endElem) endElem.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  }, []);

  // Clear chat history and localStorage
  const handleClearChat = () => {
    setChatLog([]);
    localStorage.removeItem(CHATLOG_KEY);
  };

  // Submit question to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Ignore empty input

    // Add user's question to chat log
    const updatedLog = [...chatLog, { role: "user", content: input }];
    setChatLog(updatedLog);
    setInput("");
    setLoading(true);

    try {
      // Send chat log to backend, backend calls AI API
      const res = await axios.post(API_URL, { updatedLog });

      // Extract AI reply from response
      const aiReply =
        res.data?.choices?.[0]?.message?.content ||
        res.data?.result ||
        "[No response]";

      // Add AI's response to chat log
      setChatLog([...updatedLog, { role: "assistant", content: aiReply }]);
    } catch (err) {
      // Show error message if backend/AI call fails
      setChatLog([
        ...updatedLog,
        {
          role: "assistant",
          content: `[Error contacting AI: ${
            err.response?.data?.error || err.message
          }]`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 sm:px-8 pt-20 pb-10 flex flex-col">
      {/* Header */}
      <header className="text-center space-y-2 mb-4">
        <h2 className="text-3xl font-bold">🎓 AI Academic Tutor</h2>
        <p className="text-gray-400">Ask questions on any academic subject</p>
        <button
          onClick={handleClearChat}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
        >
          Clear Chat
        </button>
      </header>

      {/* Sticky Input */}
      <div className="sticky top-18 z-10 p-4 rounded-xl backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Type your question..."
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>

      {/* Chat messages */}
      <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-4 space-y-4 overflow-y-auto">
        {chatLog.length ? (
          chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded max-w-[80%] ${
                msg.role === "user"
                  ? "bg-yellow-500 text-black ml-auto"
                  : "bg-cyan-500 text-black mr-auto"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">Start by asking a question!</p>
        )}

        {loading && (
          <p className="text-center text-gray-400 italic">AI is thinking...</p>
        )}
      </div>
      <div id="end"></div>
    </main>
  );
}
