import ExecutiveSummary from "../ExecutiveSummary";

import {
  getQuestionsPage,
  getQuestionCount,
} from "@/lib/questions";

import {
  getPollsPage,
  getPollVoteCount,
} from "@/lib/polls";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;

export default async function SummaryPage() {
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
    await getQuestionCount();

  const totalQuestionVotes =
    questions.reduce(
      (sum, q) => sum + q.votes,
      0
    );

  const totalPolls =
    polls.length;

  const totalPollVotes =
    await getPollVoteCount();

  const featuredQuestions =
    questions.filter(
      (q: any) => q.is_featured
    ).length;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Executive Summary
      </h1>

      <ExecutiveSummary
        totalQuestions={
          totalQuestions
        }
        totalQuestionVotes={
          totalQuestionVotes
        }
        totalPolls={
          totalPolls
        }
        totalPollVotes={
          totalPollVotes
        }
        featuredQuestions={
          featuredQuestions
        }
      />
    </main>
  );
}