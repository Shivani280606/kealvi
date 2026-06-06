import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    // get option ids
    const { data: options } =
      await supabase
        .from("poll_options")
        .select("id")
        .eq("poll_id", id);

    const optionIds =
      options?.map((o) => o.id) ?? [];

    if (optionIds.length > 0) {
      await supabase
        .from("poll_votes")
        .delete()
        .in("option_id", optionIds);
    }

    await supabase
      .from("poll_options")
      .delete()
      .eq("poll_id", id);

    const { error } =
      await supabase
        .from("polls")
        .delete()
        .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}