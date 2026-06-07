import VoteChart from "../VoteChart";
import { getQuestionsPage } from "@/lib/questions";

export default async function AnalyticsPage() {
  const data =
    await getQuestionsPage(0, 50);

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Analytics
      </h1>

      <VoteChart
        questions={data.questions}
      />

    </main>
  );
}