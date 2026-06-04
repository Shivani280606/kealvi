import QuestionsList from "./questions-list";
import PollsList from "./polls-list";
import VoteChart from "./VoteChart";

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

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-10">
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