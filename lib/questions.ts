import { supabase } from "@/lib/supabase";

export async function getQuestionsPage(
  offset: number,
  limit: number
) {
  const { data, error } = await supabase
    .from("questions")
    .select(`
      id,
      body,
      author,
      created_at,
      votes(count)
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit);

  if (error) throw error;

  const rows = (data ?? []).map((q: any) => ({
    id: q.id,
    body: q.body,
    author: q.author,
    votes: q.votes?.[0]?.count ?? 0,
    voters: [],
  }));

  return {
    questions: rows.slice(0, limit),
    hasMore: rows.length > limit,
  };
}

export async function searchQuestions(
  q: string,
  limit: number
) {
  const { data, error } = await supabase
    .from("questions")
    .select(`
      id,
      body,
      author,
      created_at,
      votes(count)
    `)
    .textSearch("body", q, {
      type: "websearch",
      config: "english",
    })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    body: row.body,
    author: row.author,
    votes: row.votes?.[0]?.count ?? 0,
    voters: [],
  }));
}