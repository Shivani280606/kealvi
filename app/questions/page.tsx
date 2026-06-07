import QuestionsList from "../questions-list";
import { getQuestionsPage } from "@/lib/questions";

export default async function QuestionsPage() {
  const data = await getQuestionsPage(
    0,
    10
  );

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Questions
      </h1>

      <QuestionsList
        initialQuestions={
          data.questions
        }
        initialHasMore={
          data.hasMore
        }
      />
    </main>
  );
}