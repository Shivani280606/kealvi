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
      is_featured,
      votes(count)
    `)
    .order("is_featured", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const rows = (data ?? []).map((q: any) => ({
    id: q.id,
    body: q.body,
    author: q.author,
    is_featured: q.is_featured,
    votes: q.votes?.[0]?.count ?? 0,
  }));

  return {
    questions: rows,
    hasMore: rows.length === limit,
  };
}

export async function getQuestionCount() {
  const { count, error } =
    await supabase
      .from("questions")
      .select("*", {
        count: "exact",
        head: true,
      });

  if (error) throw error;

  return count ?? 0;
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
      is_featured,
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
    is_featured: row.is_featured,
    votes: row.votes?.[0]?.count ?? 0,
  }));
}