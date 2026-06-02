"use client";

import { useEffect, useState } from "react";

type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
  voters: string[];
};

export function useQuestionsSync(initialData: Question[]) {
  const [questions, setQuestions] = useState(initialData);

  async function refresh() {
    const res = await fetch("/api/questions");
    const data = await res.json();
    setQuestions(data.questions);
  }

  // 🔥 auto-sync every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { questions, setQuestions, refresh };
}