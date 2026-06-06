import QuestionsList from "./questions-list";
import PollsList from "./polls-list";
import VoteChart from "./VoteChart";
import ExecutiveSummary from "./ExecutiveSummary";

import { getQuestionsPage } from "@/lib/questions";
import { getPollsPage } from "@/lib/polls";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function Page() {
  const {
    questions,
    hasMore: questionsHasMore,
  } = await getQuestionsPage(
    0,
    PAGE_SIZE
  );

  const {
    polls,
    hasMore: pollsHasMore,
  } = await getPollsPage(
    0,
    PAGE_SIZE
  );

  // Executive Summary Metrics
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
    <main className="mx-auto max-w-3xl p-6 space-y-10">

      {/* Executive Summary Dashboard */}

      <section>
        <h1 className="mb-6 text-3xl font-bold">
          Executive Summary Dashboard
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
      </section>

      {/* Q&A SECTION */}

      <section>
        <h1 className="mb-6 text-3xl font-bold">
          Live Q&A
        </h1>

        <VoteChart
          questions={questions}
        />

        <div className="mt-6">
          <QuestionsList
            initialQuestions={
              questions
            }
            initialHasMore={
              questionsHasMore
            }
          />
        </div>
      </section>

      {/* POLLS SECTION */}

      <section>
        <h2 className="mb-6 text-3xl font-bold">
          Live Polls
        </h2>

        <PollsList
          initialPolls={polls}
          initialHasMore={
            pollsHasMore
          }
        />
      </section>
    </main>
  );
}