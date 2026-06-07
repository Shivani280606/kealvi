export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Kealvi
        </h1>

        <span className="text-sm text-gray-500">
          Live Q&A & Polls
        </span>
      </div>
    </header>
  );
}