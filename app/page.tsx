import QuestionsList from "@/components/QuestionsList";

export default async function Page() {
  try {
    const res = await fetch("http://localhost:3000/api/questions", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const text = await res.text();

    const data = text
      ? JSON.parse(text)
      : {
          questions: [],
          hasMore: false,
        };

    const questions = (data.questions ?? []).map((q: any) => ({
      id: q.id,
      body: q.body,
      author: q.author ?? null,
      votes: q.votes ?? 0,
      voters: q.voters ?? [],
    }));

    return (
      <main>
        <QuestionsList
          initialQuestions={questions}
          initialHasMore={data.hasMore ?? false}
        />
      </main>
    );
  } catch (error) {
    console.error("PAGE ERROR:", error);

    return (
      <main className="p-8 text-red-500">
        <h1>Failed to load questions</h1>
        <p>Check the server console for details.</p>
      </main>
    );
  }
}