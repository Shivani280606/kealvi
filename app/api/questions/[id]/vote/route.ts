import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { voteQuestion } from "@/lib/memory-store";

export const dynamic = "force-dynamic";

// Naive voting: just bump a number on the question. There's no record of WHO
// voted, so nothing stops one person clicking 50 times. That flaw is exactly
// what motivates arcing to a separate `votes` table next.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (supabase) {
    // NAIVE read-then-write. Looks perfectly reasonable: read the current
    // count, add one, write it back. The bug: between the read and the write
    // there's a gap, and two concurrent votes can both read the same value
    // and both write value+1 — so one vote silently vanishes (a lost update).
    const { data: current, error: readErr } = await supabase
      .from("questions")
      .select("votes")
      .eq("id", id)
      .single();

    if (readErr) {
      return NextResponse.json({ error: readErr.message }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("questions")
      .update({ votes: current.votes + 1 })
      .eq("id", id)
      .select("votes")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ votes: data.votes });
  }

  // Fallback: in-memory store.
  const q = voteQuestion(id);
  if (!q) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ votes: q.votes });
}
