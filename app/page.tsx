import Link from "next/link";
import ExecutiveSummary from "./ExecutiveSummary";

import { getQuestionsPage } from "@/lib/questions";
import { getPollsPage } from "@/lib/polls";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function Page() {
  const { questions } =
    await getQuestionsPage(
      0,
      PAGE_SIZE
    );

  const { polls } =
    await getPollsPage(
      0,
      PAGE_SIZE
    );

  const totalQuestions =
    questions.length;

  const totalVotes =
    questions.reduce(
      (sum, q) => sum + q.votes,
      0
    );

  const totalPolls =
    polls.length;

  const featuredQuestions =
    questions.filter(
      (q: any) => q.is_featured
    ).length;

  return (
    <main className="mx-auto max-w-5xl p-6">

      <h1 className="mb-8 text-4xl font-bold">
        Kealvi Dashboard
      </h1>

      <ExecutiveSummary
        totalQuestions={
          totalQuestions
        }
        totalVotes={
          totalVotes
        }
        totalPolls={
          totalPolls
        }
        featuredQuestions={
          featuredQuestions
        }
      />

      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-semibold">
          Explore
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Link
            href="/summary"
            className="rounded-xl border bg-white p-8 shadow hover:shadow-lg transition"
          >
            <div className="text-5xl mb-4">
              📊
            </div>

            <h3 className="text-xl font-bold">
              Summary
            </h3>

            <p className="mt-2 text-gray-600">
              Executive overview of all activity.
            </p>
          </Link>

          <Link
            href="/questions"
            className="rounded-xl border bg-white p-8 shadow hover:shadow-lg transition"
          >
            <div className="text-5xl mb-4">
              ❓
            </div>

            <h3 className="text-xl font-bold">
              Questions
            </h3>

            <p className="mt-2 text-gray-600">
              Browse and vote on questions.
            </p>
          </Link>

          <Link
            href="/polls"
            className="rounded-xl border bg-white p-8 shadow hover:shadow-lg transition"
          >
            <div className="text-5xl mb-4">
              🗳️
            </div>

            <h3 className="text-xl font-bold">
              Polls
            </h3>

            <p className="mt-2 text-gray-600">
              Participate in live polls.
            </p>
          </Link>

          <Link
            href="/analytics"
            className="rounded-xl border bg-white p-8 shadow hover:shadow-lg transition"
          >
            <div className="text-5xl mb-4">
              📈
            </div>

            <h3 className="text-xl font-bold">
              Analytics
            </h3>

            <p className="mt-2 text-gray-600">
              Charts and voting insights.
            </p>
          </Link>

          <Link
            href="/leaderboard"
            className="rounded-xl border bg-white p-8 shadow hover:shadow-lg transition"
          >
            <div className="text-5xl mb-4">
              🏆
            </div>

            <h3 className="text-xl font-bold">
              Leaderboard
            </h3>

            <p className="mt-2 text-gray-600">
              Top voted questions and rankings.
            </p>
          </Link>

        </div>
      </section>

    </main>
  );
}