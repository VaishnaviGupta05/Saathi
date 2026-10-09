import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saathi — a little home for your thoughts",
  description: "A personal diary for your words, moods, and little moments."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
