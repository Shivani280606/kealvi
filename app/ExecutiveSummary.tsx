type Props = {
  totalQuestions: number;
  totalQuestionVotes: number;
  totalPolls: number;
  totalPollVotes: number;
  featuredQuestions: number;
};

export default function ExecutiveSummary({
  totalQuestions,
  totalQuestionVotes,
  totalPolls,
  totalPollVotes,
  featuredQuestions,
}: Props) {
  const cards = [
    {
      title: "Questions",
      value: totalQuestions,
      icon: "❓",
    },
    {
      title: "Question Votes",
      value: totalQuestionVotes,
      icon: "👍",
    },
    {
      title: "Polls",
      value: totalPolls,
      icon: "📊",
    },
    {
      title: "Poll Votes",
      value: totalPollVotes,
      icon: "🗳️",
    },
    {
      title: "Featured",
      value: featuredQuestions,
      icon: "📌",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
        >
          <div className="text-2xl">
            {card.icon}
          </div>

          <p className="mt-2 text-sm text-gray-400">
            {card.title}
          </p>

          <p className="mt-1 text-3xl font-bold">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}