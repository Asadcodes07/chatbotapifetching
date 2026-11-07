
import { useState } from "react";
import axios from "axios";

function App() {
  const [userQuery, setUserQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const query = userQuery.trim();
    if (!query || loading) return;

    setConversation((prev) => [
      ...prev,
      { role: "user", content: query },
    ]);

    setUserQuery("");
    setLoading(true);
    setError("");

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      const apiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful software engineer named ASAD HAYAT.
Answer in 1 to 2 concise lines.
Only answer software engineering questions.
For unrelated questions, politely refuse and explain your specialization.
User question: ${query}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const reply =
        apiRes.data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("") || "No reply received.";

      setConversation((prev) => [
        ...prev,
        { role: "ai", content: reply },
      ]);
    } catch (err) {
      setError(
        "Unable to get a reply. Check your API key or connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold shadow-lg shadow-indigo-600/20">
              A
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Asad AI
              </h1>
              <p className="text-xs text-slate-400">
                Software Engineering Assistant
              </p>
            </div>
          </div>

          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
            AI Assistant
          </span>
        </header>

        {/* Chat Area */}
        <main className="flex flex-1 flex-col py-8">
          {conversation.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-4xl ring-1 ring-indigo-400/20">
                ✦
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How can I help you?
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                Ask questions about React, JavaScript, APIs,
                or full-stack web development.
              </p>

              <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                {[
                  "What is React?",
                  "Explain JavaScript functions",
                  "What is an API?",
                  "How does Node.js work?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setUserQuery(suggestion)}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-sm text-slate-300 transition hover:border-indigo-500 hover:bg-slate-800"
                  >
                    {suggestion}
                    <span className="float-right text-indigo-400">
                      ↗
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "ai" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold">
                      A
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[80%] ${
                      message.role === "user"
                        ? "rounded-br-sm bg-indigo-600 text-white"
                        : "rounded-bl-sm border border-slate-800 bg-slate-900 text-slate-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                    A
                  </div>

                  <span className="animate-pulse">
                    Asad AI is thinking...
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="mx-auto mt-4 max-w-3xl text-sm text-red-400"
            >
              {error}
            </p>
          )}
        </main>

        {/* Input Form */}
        <footer className="sticky bottom-0 bg-slate-950 pb-5 pt-3">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-2 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <input
                type="text"
                name="userQuery"
                id="userQuery"
                value={userQuery}
                placeholder="Ask a software engineering question..."
                onChange={(e) => setUserQuery(e.target.value)}
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !userQuery.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              Asad AI · Software Engineering Assistant
            </p>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default App;
