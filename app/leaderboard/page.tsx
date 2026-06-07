import { getQuestionsPage }
from "@/lib/questions";

export default async function LeaderboardPage() {

  const data =
    await getQuestionsPage(
      0,
      100
    );

  const sorted = [
    ...data.questions,
  ].sort(
    (a, b) => b.votes - a.votes
  );

  return (
    <main className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        🏆 Leaderboard
      </h1>

      {sorted.map(
        (question, index) => (
          <div
            key={question.id}
            className="border p-4 rounded-lg mb-3"
          >
            <div>
              #{index + 1}
            </div>

            <div>
              {question.body}
            </div>

            <div>
              👍 {question.votes}
            </div>
          </div>
        )
      )}

    </main>
  );
}