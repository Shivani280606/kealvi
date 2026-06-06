import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const { featured } =
      await request.json();

    // Allow at most 3 featured questions
    if (featured) {
      const { count, error: countError } =
        await supabase
          .from("questions")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("is_featured", true);

      if (countError) {
        return NextResponse.json(
          {
            error:
              countError.message,
          },
          {
            status: 500,
          }
        );
      }

      if ((count ?? 0) >= 3) {
        return NextResponse.json(
          {
            error:
              "Maximum 3 featured questions allowed",
          },
          {
            status: 400,
          }
        );
      }
    }

    const { data, error } =
      await supabase
        .from("questions")
        .update({
          is_featured: featured,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to update question",
      },
      {
        status: 500,
      }
    );
  }
}