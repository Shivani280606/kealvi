import { supabase } from "@/lib/supabase";
import { getQuestionsPage, searchQuestions } from "@/lib/questions";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim();

    if (q) {
      const questions = await searchQuestions(q, PAGE_SIZE);

      return Response.json({
        questions,
        hasMore: false,
      });
    }

    const offset = Number(searchParams.get("offset") ?? 0);

    const result = await getQuestionsPage(
      offset,
      PAGE_SIZE
    );

    return Response.json({
      questions: result.questions,
      hasMore: result.hasMore,
    });
  } catch (err: any) {
    console.error("GET /questions error:", err);

    return Response.json(
      {
        questions: [],
        hasMore: false,
        error: err.message,
      },
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
      })
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}