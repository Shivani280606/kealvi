import QuestionsList from "@/components/QuestionsList";

export default async function Page() {
  // wherever you fetch questions from (Supabase / API / etc.)
  const res = await fetch("http://localhost:3000/api/questions", {
    cache: "no-store",
  });

  const data = await res.json();

  // ✅ FIX: normalize data so voters ALWAYS exists
  const questions = (data.questions ?? []).map((q: any) => ({
    id: q.id,
    body: q.body,
    author: q.author ?? null,
    votes: q.votes ?? 0,
    voters: q.voters ?? [], // 🔥 IMPORTANT FIX
  }));

  const hasMore = data.hasMore ?? false;

  return (
    <main>
      <QuestionsList
        initialQuestions={questions}
        initialHasMore={hasMore}
      />
    </main>
  );
}