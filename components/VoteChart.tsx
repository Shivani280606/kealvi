"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Question = {
  id: string;
  body: string;
  votes: number;
};

export default function VoteChart({
  questions,
}: {
  questions: Question[];
}) {
  const data = questions.map((q) => ({
    name:
      q.body.length > 20
        ? q.body.slice(0, 20) + "..."
        : q.body,
    votes: q.votes,
  }));

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-sm text-gray-300 mb-3">
        Live Vote Distribution
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="votes" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}