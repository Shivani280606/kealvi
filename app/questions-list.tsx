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
  const [hydrated, setHydrated] = useState(false);

  const [voterId, setVoterId] = useState("");

  useEffect(() => {
    setHydrated(true);
    setVoterId(getVoterId());
  }, []);

  const totalVotes = questions.reduce(
    (sum, q) => sum + (q.votes || 0),
    0
  );

  // Search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const url = query
        ? `/api/questions?q=${encodeURIComponent(query)}`
        : `/api/questions`;

      const res = await fetch(url);
      const data = await res.json();

      setQuestions(data.questions);
      setHasMore(data.hasMore);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  async function submit() {
    if (!draft.trim()) return;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: draft,
      }),
    });

    const created = await res.json();

    setQuestions((qs) => [
      {
        ...created,
        votes: 0,
        voters: [],
      },
      ...qs,
    ]);

    setDraft("");
  }

  async function upvote(id: string) {
    const res = await fetch(`/api/questions/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voterId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    setQuestions((qs) =>
      qs.map((q) =>
        q.id === id
          ? {
              ...q,
              votes: data.votes,
              voters: data.voters ?? [],
            }
          : q
      )
    );
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

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        {hydrated
          ? "Interactive ✓"
          : "Loading interactivity…"}
      </p>

      {/* Ask Question */}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
        />

        <button
          onClick={submit}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
        >
          Ask
        </button>
      </div>

      {/* Search */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
      />

      {/* Questions */}
      <ul className="space-y-3">
        {questions.map((q) => {
          const percent =
            totalVotes > 0
              ? ((q.votes / totalVotes) * 100).toFixed(1)
              : "0";

          const myVote =
            voterId &&
            (q.voters ?? []).includes(voterId);

          return (
            <li
              key={q.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => upvote(q.id)}
                  className={`rounded-md border px-3 py-1 font-mono transition ${
                    myVote
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  ▲ {q.votes}
                </button>

                <div className="flex-1">
                  <p className="text-white">
                    {q.body}
                  </p>

                  <div className="mt-2">
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>
                      {percent}% of total votes
                    </span>

                    <span>
                      {q.votes === 0
                        ? "No votes yet"
                        : `${q.votes} vote${
                            q.votes === 1 ? "" : "s"
                          }`}
                    </span>

                    {myVote && (
                      <span className="text-blue-400">
                        ✓ You voted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}