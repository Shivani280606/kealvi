import { NextResponse } from "next/server";

// ⚠️ Replace this with your real DB later
import { questions } from "@/lib/questionsStore";

export async function POST(req, { params }) {
  const { voterId } = await req.json();
  const id = params.id;

  const question = questions.find((q) => q.id === id);

  if (!question) {
    return NextResponse.json(
      { error: "Question not found" },
      { status: 404 }
    );
  }

  if (!question.voters) {
    question.voters = [];
  }

  let action = "removed";

  // 🟡 TOGGLE LOGIC (important)
  if (question.voters.includes(voterId)) {
    question.voters = question.voters.filter((v) => v !== voterId);
    question.votes = Math.max(0, question.votes - 1);
    action = "removed";
  } else {
    question.voters.push(voterId);
    question.votes += 1;
    action = "added";
  }

  return NextResponse.json({
    action,
    votes: question.votes,
    voters: question.voters,
  });
}