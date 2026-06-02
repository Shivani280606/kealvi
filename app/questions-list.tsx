"use client";

import { useState, useEffect } from "react";
import { getVoterId } from "@/lib/voter";

type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
  voters: string[];
};

type FloatingVote = {
  id: string;
  key: number;
};

export default function QuestionsList({
  initialQuestions,
  initialHasMore,
}: {
  initialQuestions: Question[];
  initialHasMore: boolean;
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [voterId, setVoterId] = useState("");

  const [floatingVotes, setFloatingVotes] = useState<FloatingVote[]>([]);

  useEffect(() => {
    setVoterId(getVoterId());
  }, []);

  const totalVotes = questions.reduce((sum, q) => sum + q.votes, 0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data.questions);
      setHasMore(data.hasMore);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const id = setTimeout(async () => {
      const url = query
        ? `/api/questions?q=${encodeURIComponent(query)}`
        : `/api/questions`;

      const res = await fetch(url);
      const data = await res.json();

      setQuestions(data.questions);
      setHasMore(data.hasMore);
    }, 300);

    return () => clearTimeout(id);
  }, [query]);

  async function submit() {
    if (!draft.trim()) return;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft }),
    });

    const created = await res.json();

    setQuestions((qs) => [
      { ...created, votes: 0, voters: [] },
      ...qs,
    ]);

    setDraft("");
  }

  async function upvote(id: string) {
    setFloatingVotes((prev) => [
      ...prev,
      { id, key: Date.now() },
    ]);

    const res = await fetch(`/api/questions/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId }),
    });

    const data = await res.json();
    if (!res.ok) return;

    setQuestions((qs) =>
      qs.map((q) =>
        q.id === id
          ? {
              ...q,
              votes: data.votes,
              voters: data.voters,
            }
          : q
      )
    );

    setTimeout(() => {
      setFloatingVotes((prev) =>
        prev.filter((f) => f.id !== id)
      );
    }, 700);
  }

  async function loadMore() {
    setLoading(true);

    const res = await fetch(
      `/api/questions?offset=${questions.length}`
    );

    const data = await res.json();

    setQuestions((qs) => [...qs, ...data.questions]);
    setHasMore(data.hasMore);

    setLoading(false);
  }

  // 🧠 NEW: CLEAN VOTE TEXT SYSTEM
  function getVoteText(q: Question) {
    const voters = q.voters ?? [];
    const total = q.votes ?? 0;

    const iVoted = voters.includes(voterId);
    const others = Math.max(voters.length - (iVoted ? 1 : 0), 0);

    if (total === 0) return "No votes yet";

    if (iVoted) {
      if (others === 0) return "Only you voted";
      if (others === 1) return "You + 1 other voted";
      return `You + ${others} others voted`;
    }

    return `${total} people voted`;
  }

  // 🧠 OPTIONAL: avatar initials (for future UI upgrade)
  function getAvatar(name: string) {
    return name?.slice(0, 2).toUpperCase();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        🔴 Live Poll + Floating Animations
      </p>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
        />

        <button
          onClick={submit}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
        >
          Ask
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
      />

      {/* LIST */}
      <ul className="space-y-3">
        {questions.map((q) => {
          const percent =
            totalVotes > 0
              ? (q.votes / totalVotes) * 100
              : 0;

          const iVoted = q.voters?.includes(voterId);

          return (
            <li
              key={q.id}
              className="relative rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 overflow-hidden"
            >
              {/* FLOATING +1 */}
              {floatingVotes
                .filter((f) => f.id === q.id)
                .map((f) => (
                  <span
                    key={f.key}
                    className="absolute text-green-400 font-bold pointer-events-none"
                    style={{
                      left: "50px",
                      top: "10px",
                      animation: "floatUp 0.7s ease-out forwards",
                    }}
                  >
                    +1
                  </span>
                ))}

              {/* TOP ROW */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => upvote(q.id)}
                  className={`px-3 py-1 rounded-md border transition ${
                    iVoted
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  ▲ {q.votes}
                </button>

                <span className="text-white">{q.body}</span>
              </div>

              {/* BAR */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${percent}%`,
                    transition: "width 0.6s ease-out",
                  }}
                />
              </div>

              {/* META (UPDATED 👇) */}
              <div className="flex justify-between text-xs text-gray-400">
                <span>{percent.toFixed(1)}% support</span>

                <span>{getVoteText(q)}</span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* LOAD MORE */}
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}