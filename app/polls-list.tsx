"use client";

import { useState } from "react";
import { getVoterId } from "@/lib/voter";

export default function PollsList({
  initialPolls,
}: {
  initialPolls: any[];
  initialHasMore: boolean;
}) {
  const [question, setQuestion] =
    useState("");

  const [options, setOptions] =
    useState(["", ""]);

  const [loading, setLoading] =
    useState(false);

  async function createPoll() {
    const cleanOptions =
      options.filter((o) => o.trim());

    if (!question.trim()) {
      alert("Enter a question");
      return;
    }

    if (cleanOptions.length < 2) {
      alert(
        "At least 2 options are required"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/polls",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            body: question,
            options: cleanOptions,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Failed creating poll"
        );
        return;
      }

      location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "Unexpected create poll error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function vote(
    pollId: string,
    optionId: string
  ) {
    try {
      const res = await fetch(
        `/api/polls/${pollId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            optionId,
            voterId:
              getVoterId(),
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Vote failed"
        );
        return;
      }

      location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "Unexpected vote error"
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* CREATE POLL */}

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-4 text-xl">
          Create Poll
        </h2>

        <input
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          placeholder="Question"
          className="mb-3 w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-white"
        />

        {options.map(
          (option, index) => (
            <input
              key={index}
              value={option}
              onChange={(e) => {
                const next = [
                  ...options,
                ];

                next[index] =
                  e.target.value;

                setOptions(next);
              }}
              placeholder={`Option ${
                index + 1
              }`}
              className="mb-2 w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-white"
            />
          )
        )}

        <div className="flex gap-2">
          <button
            onClick={() =>
              setOptions([
                ...options,
                "",
              ])
            }
            className="rounded border border-white/10 px-3 py-2"
          >
            + Option
          </button>

          <button
            onClick={createPoll}
            disabled={loading}
            className="rounded bg-blue-500 px-4 py-2"
          >
            {loading
              ? "Creating..."
              : "Create Poll"}
          </button>
        </div>
      </div>

      {/* POLLS */}

      {initialPolls.map(
        (poll: any) => {
          const totalVotes =
            poll.poll_options.reduce(
              (
                sum: number,
                option: any
              ) =>
                sum +
                (option.votes ?? 0),
              0
            );

          return (
            <div
              key={poll.id}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <h3 className="mb-4 text-lg font-medium">
                {poll.body}
              </h3>

              <div className="space-y-3">
                {poll.poll_options.map(
                  (
                    option: any
                  ) => {
                    const votes =
                      option.votes ?? 0;

                    const percent =
                      totalVotes > 0
                        ? (
                            (votes /
                              totalVotes) *
                            100
                          ).toFixed(
                            1
                          )
                        : "0";

                    return (
                      <button
                        key={
                          option.id
                        }
                        onClick={() =>
                          vote(
                            poll.id,
                            option.id
                          )
                        }
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
                      >
                        <div className="flex justify-between">
                          <span>
                            {
                              option.option_text
                            }
                          </span>

                          <span>
                            {votes} vote
                            {votes !== 1
                              ? "s"
                              : ""}
                            {" • "}
                            {percent}%
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                            }}
                          />
                        </div>
                      </button>
                    );
                  }
                )}

                <p className="pt-2 text-xs text-gray-400">
                  Total votes:{" "}
                  {totalVotes}
                </p>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}