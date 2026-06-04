import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const {
      optionId,
      voterId,
    } = await req.json();

    const { id: pollId } =
      await params;

    if (!optionId || !voterId) {
      return NextResponse.json(
        {
          error:
            "Missing optionId or voterId",
        },
        { status: 400 }
      );
    }

    // Remove existing vote
    const {
      error: deleteError,
    } = await supabase
      .from("poll_votes")
      .delete()
      .eq("poll_id", pollId)
      .eq("voter_id", voterId);

    if (deleteError) {
      console.error(
        "DELETE ERROR:",
        deleteError
      );

      return NextResponse.json(
        {
          error:
            deleteError.message,
        },
        { status: 500 }
      );
    }

    // Insert new vote
    const {
      error: insertError,
    } = await supabase
      .from("poll_votes")
      .insert({
        poll_id: pollId,
        option_id: optionId,
        voter_id: voterId,
      });

    if (insertError) {
      console.error(
        "INSERT ERROR:",
        insertError
      );

      return NextResponse.json(
        {
          error:
            insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(
      "VOTE ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to vote",
      },
      { status: 500 }
    );
  }
}