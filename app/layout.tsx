import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

export const metadata: Metadata = {
  title: "Kealvi",
  description: "Live Q&A, Polls and Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Header />

        <div className="pb-24">
          {children}
        </div>

        <BottomNav />
      </body>
    </html>
  );
}