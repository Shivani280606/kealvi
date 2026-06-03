import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { voterId } = await req.json();

  const { id } = await params;

  if (!voterId) {
    return NextResponse.json(
      { error: "Missing voterId" },
      { status: 400 }
    );
  }

  // Check if vote already exists
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("question_id", id)
    .eq("voter_id", voterId)
    .maybeSingle();

  let action = "added";

  if (existingVote) {
    await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id);

    action = "removed";
  } else {
    await supabase.from("votes").insert({
      question_id: id,
      voter_id: voterId,
    });
  }

  // Get updated count
  const { count } = await supabase
    .from("votes")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("question_id", id);

  return NextResponse.json({
    action,
    votes: count ?? 0,
  });
}