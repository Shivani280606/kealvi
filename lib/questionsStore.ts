export type Option = {
  id: string;
  text: string;
  votes: number;
  voters: string[];
};

export type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
  voters: string[];
  options: Option[];
};

// 🧠 In-memory DB
let questions: Question[] = [
  {
    id: "1",
    body: "Best South Indian food?",
    author: null,
    votes: 0,
    voters: [],
    options: [
      { id: "o1", text: "Dosa", votes: 0, voters: [] },
      { id: "o2", text: "Biryani", votes: 0, voters: [] },
      { id: "o3", text: "Idli", votes: 0, voters: [] },
    ],
  },
];

// ✅ IMPORTANT: export the actual variable (fixes your import error)
export { questions };