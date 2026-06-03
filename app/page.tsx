import QuestionsList from "./questions-list";
import VoteChart from "./VoteChart";
import { getQuestionsPage } from "@/lib/questions";

// Render on every request (no caching)
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function Page() {
  const { questions, hasMore } = await getQuestionsPage(0, PAGE_SIZE);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      
      {/* Header */}
      <h1 className="text-2xl font-medium text-white">
        Live Q&amp;A
      </h1>

      {/* 📊 Analytics Chart */}
      <VoteChart questions={questions} />

      {/* 🧾 Questions List */}
      <QuestionsList
        initialQuestions={questions}
        initialHasMore={hasMore}
      />
      
    </main>
  );
}