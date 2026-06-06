"use client";

import { useEffect, useState } from "react";
import { getVoterId } from "@/lib/voter";

type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
  is_featured?: boolean;
};

export default function QuestionsList({
  initialQuestions,
  initialHasMore,
}: {
  initialQuestions: Question[];
  initialHasMore: boolean;
}) {
  const [questions, setQuestions] =
    useState<Question[]>(initialQuestions);

  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] =
    useState(initialHasMore);

  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const url = query
          ? `/api/questions?q=${encodeURIComponent(
              query
            )}`
          : "/api/questions";

        const res = await fetch(url);

        if (!res.ok) return;

        const data = await res.json();

        setQuestions(data.questions ?? []);
        setHasMore(data.hasMore ?? false);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  async function submit() {
    if (!draft.trim()) return;

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          body: draft,
        }),
      });

      if (!res.ok) {
        alert("Failed to create question");
        return;
      }

      const created = await res.json();

      setQuestions((qs) => [
        {
          ...created,
          votes: 0,
          is_featured: false,
        },
        ...qs,
      ]);

      setDraft("");
    } catch (err) {
      console.error(err);
    }
  }

  async function upvote(id: string) {
    try {
      const res = await fetch(
        `/api/questions/${id}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            voterId: getVoterId(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Vote failed");
        return;
      }

      setQuestions((qs) =>
        qs.map((q) =>
          q.id === id
            ? {
                ...q,
                votes: data.votes,
              }
            : q
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleFeatured(
  id: string,
  current: boolean
) {
  try {
    const res = await fetch(
      `/api/questions/${id}/feature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: !current,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to update featured status");
      return;
    }

    setQuestions((qs) =>
      qs.map((q) =>
        q.id === id
          ? {
              ...q,
              is_featured: !current,
            }
          : q
      )
    );
  } catch (err) {
    console.error(err);
  }
}

  async function loadMore() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/questions?offset=${questions.length}`
      );

      const data = await res.json();

      setQuestions((qs) => [
        ...qs,
        ...(data.questions ?? []),
      ]);

      setHasMore(data.hasMore ?? false);
    } finally {
      setLoading(false);
    }
  }

  const totalVotes = questions.reduce(
    (sum, q) => sum + q.votes,
    0
  );

  const sortedQuestions = [...questions].sort(
  (a, b) =>
    Number(b.is_featured) -
    Number(a.is_featured)
);

const featuredCount =
  questions.filter(
    (q) => q.is_featured
  ).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        {hydrated
          ? "Interactive ✓"
          : "Loading interactivity..."}
      </p>

      {/* Ask Question */}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) =>
            setDraft(e.target.value)
          }
          placeholder="Ask a question..."
          className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
        />

        <button
          onClick={submit}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
        >
          Ask
        </button>
      </div>

      {/* Search */}
      <input
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="Search questions..."
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
      />

      {/* Questions */}
      {/* Questions */}

{featuredCount >= 3 && (
  <div className="rounded-md border border-yellow-500 bg-yellow-500/10 p-3 text-sm text-yellow-300">
    Maximum 3 featured questions reached.
    Unpin a question to feature another.
  </div>
)}

<ul className="space-y-3">
        {sortedQuestions.map((q) => {
          const percentage =
            totalVotes > 0
              ? (
                  (q.votes / totalVotes) *
                  100
                ).toFixed(1)
              : "0";

          return (
            <li
              key={q.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-lg transition hover:bg-white/10"
            >
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    upvote(q.id)
                  }
                  className="rounded-md border border-white/10 bg-white/10 px-3 py-1 font-mono transition hover:bg-white/20"
                >
                  ▲ {q.votes}
                </button>

<div className="flex-1">
  <div className="mb-2 flex items-center gap-2">
    {q.is_featured && (
      <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
        📌 Featured Question
      </span>
    )}

    <button
  onClick={() =>
    toggleFeatured(
      q.id,
      !!q.is_featured
    )
  }
  disabled={
    !q.is_featured &&
    featuredCount >= 3
  }
  className={`rounded px-2 py-1 text-xs transition ${
    !q.is_featured &&
    featuredCount >= 3
      ? "cursor-not-allowed border border-gray-600 text-gray-500"
      : "border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
  }`}
>
  {q.is_featured
    ? "📌 Unpin"
    : featuredCount >= 3
    ? "Limit Reached"
    : "📍 Pin"}
</button>
  </div>

  <p className="text-white">
    {q.body}
  </p>

                  {q.author && (
                    <p className="mt-1 text-xs text-gray-500">
                      by {q.author}
                    </p>
                  )}

                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>
                      {percentage}% of all
                      votes
                    </span>

                    <span>
                      {q.votes} vote
                      {q.votes !== 1
                        ? "s"
                        : ""}
                    </span>
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
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10 disabled:opacity-50"
        >
          {loading
            ? "Loading..."
            : "Load More"}
        </button>
      )}
    </div>
  );
}