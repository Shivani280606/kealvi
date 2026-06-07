import { supabase } from "@/lib/supabase";
import { unstable_noStore as noStore } from "next/cache";

export async function getPollsPage(
  offset: number,
  limit: number
) {
  noStore();

  const { data: polls, error } = await supabase
    .from("polls")
    .select(`
      id,
      body,
      author,
      created_at,
      poll_options (
        id,
        option_text
      )
    `)
    .order("created_at", {
      ascending: false,
    })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  if (!polls) {
    return {
      polls: [],
      hasMore: false,
    };
  }

  const { data: votes } = await supabase
    .from("poll_votes")
    .select("option_id");

  const voteCounts: Record<string, number> = {};

  (votes ?? []).forEach((vote: any) => {
    const key = String(
      vote.option_id
    );

    voteCounts[key] =
      (voteCounts[key] ?? 0) + 1;
  });

  const pollsWithVotes = polls.map(
    (poll: any) => ({
      ...poll,
      poll_options:
        poll.poll_options.map(
          (option: any) => ({
            ...option,
            votes:
              voteCounts[
                String(option.id)
              ] ?? 0,
          })
        ),
    })
  );

  return {
    polls: pollsWithVotes,
    hasMore:
      (polls?.length ?? 0) === limit,
  };
}

export async function getPollVoteCount() {
  noStore();

  const { count, error } =
    await supabase
      .from("poll_votes")
      .select("*", {
        count: "exact",
        head: true,
      });

  if (error) throw error;

  return count ?? 0;
}