import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-8 pt-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-emerald-900/70">
      <Link href="/copyright" className="underline-offset-4 hover:underline">&copy; 2026 KareFacts. Copyright by kareayamq.</Link>
    </footer>
  );
}
