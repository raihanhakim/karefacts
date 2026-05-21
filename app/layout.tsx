import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "KareFacts - Food Label Analyzer",
  description: "Baca fakta di balik label pangan dengan analisis edukatif client-side.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
