import PollsList from "../polls-list";
import { getPollsPage } from "@/lib/polls";

export const dynamic = "force-dynamic";

export default async function PollsPage() {
  const data = await getPollsPage(
    0,
    10
  );

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Polls
      </h1>

      <PollsList
        initialPolls={data.polls}
        initialHasMore={
          data.hasMore
        }
      />
    </main>
  );
}