import { questions } from "@/lib/questionsStore";

export async function POST(req: Request, { params }: any) {
  const { voterId } = await req.json();
  const { id } = params;

  const question = questions.find((q) => q.id === id);

  if (!question) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // prevent double voting
  if (!question.voters.includes(voterId)) {
    question.voters.push(voterId);
    question.votes += 1;
  }

  return Response.json({
    votes: question.votes,
    voters: question.voters,
  });
}