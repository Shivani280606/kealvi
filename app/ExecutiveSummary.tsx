type Props = {
  totalQuestions: number;
  totalVotes: number;
  totalPolls: number;
  featuredQuestions: number;
};

export default function ExecutiveSummary({
  totalQuestions,
  totalVotes,
  totalPolls,
  featuredQuestions,
}: Props) {
  const cards = [
    {
      title: "Questions",
      value: totalQuestions,
      icon: "❓",
    },
    {
      title: "Votes",
      value: totalVotes,
      icon: "👍",
    },
    {
      title: "Polls",
      value: totalPolls,
      icon: "📊",
    },
    {
      title: "Featured",
      value: featuredQuestions,
      icon: "📌",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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