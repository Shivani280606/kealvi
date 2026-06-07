import { supabase } from "@/lib/supabase";

export async function getPollsPage(
  offset: number,
  limit: number
) {
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

  (votes ?? []).forEach((vote) => {
    voteCounts[vote.option_id] =
      (voteCounts[vote.option_id] ?? 0) + 1;
  });

  const pollsWithVotes = polls.map((poll: any) => ({
    ...poll,
    poll_options: poll.poll_options.map(
      (option: any) => ({
        ...option,
        votes:
          voteCounts[option.id] ?? 0,
      })
    ),
  }));

  console.log("VOTES:", voteCounts);
console.log(
  "POLLS:",
  JSON.stringify(pollsWithVotes, null, 2)
);
  
  return {
    polls: pollsWithVotes,
    hasMore:
      (polls?.length ?? 0) === limit,
  };
}

export async function getPollVoteCount() {
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