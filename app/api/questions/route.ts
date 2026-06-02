import { supabase } from "@/lib/supabase";
import { getQuestionsPage, searchQuestions } from "@/lib/questions";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    // 🔍 SEARCH MODE
    if (q) {
      const questions = (await searchQuestions(q, PAGE_SIZE)) ?? [];
      return Response.json({ questions, hasMore: false });
    }

    // 📦 PAGINATION MODE
    const offset = Number(searchParams.get("offset") ?? 0);

    const result = (await getQuestionsPage(offset, PAGE_SIZE)) ?? {
      questions: [],
      hasMore: false,
    };

    return Response.json({
      questions: result.questions ?? [],
      hasMore: result.hasMore ?? false,
    });
  } catch (err: any) {
    console.error("GET /questions error:", err);
    return Response.json(
      { questions: [], hasMore: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const bodyData = await req.json().catch(() => null);

    if (!bodyData?.body) {
      return Response.json(
        { error: "Missing question body" },
        { status: 400 }
      );
    }

    const { body, author } = bodyData;

    const { data, error } = await supabase
      .from("questions")
      .insert({
        body,
        author: author ?? null,
        votes: 0,
        voters: [],
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err: any) {
    console.error("POST /questions error:", err);
    return Response.json(
      { error: "Server crashed" },
      { status: 500 }
    );
  }
}