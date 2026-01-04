"use client";

import { useState } from "react";
import { Search, Play } from "lucide-react";

const SESSIONS = [
  { id: "math", label: "Mathematics" },
  { id: "cs", label: "Computer Science" },
  { id: "physics", label: "Physics" },
  { id: "history", label: "History" },
  { id: "design", label: "System Design" },
];

export function StudySessionStart() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filteredSessions = SESSIONS.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleStart = () => {
    if (!selected) return;
    alert(`Starting session: ${SESSIONS.find(s => s.id === selected)?.label}`);
    // Add your actual start logic here (e.g., router.push or API call)
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-3">Start Session</h2>
      
      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
        <input
          type="text"
          placeholder="Find a subject..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* List */}
      <div className="max-h-[120px] overflow-y-auto space-y-1 mb-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setSelected(session.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selected === session.id
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {session.label}
            </button>
          ))
        ) : (
          <p className="text-xs text-center text-zinc-400 py-2">No subjects found</p>
        )}
      </div>

      <button
        disabled={!selected}
        onClick={handleStart}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-medium transition-all"
      >
        <Play size={16} fill="currentColor" />
        Start Focus
      </button>
    </div>
  );
}