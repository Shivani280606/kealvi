import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { voterId } = await req.json();
  const { id } = await params;

  const { error } = await supabase
    .from("votes")
    .insert({
      question_id: id,
      voter_id: voterId,
    });

  if (error) {
    // duplicate vote
    if (error.code === "23505") {
      const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("question_id", id);

      return Response.json({
        votes: count ?? 0,
      });
    }

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const { count } = await supabase
    .from("votes")
    .select("*", { count: "exact", head: true })
    .eq("question_id", id);

  return Response.json({
    votes: count ?? 0,
  });
}