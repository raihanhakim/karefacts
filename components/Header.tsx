export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="text-xl font-black tracking-tight text-emerald-900">KareFacts</a>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 sm:flex">
          <a href="/#fitur" className="hover:text-emerald-700">Fitur</a>
          <a href="/analyzer" className="hover:text-emerald-700">Analisis</a>
        </nav>
        <a href="/analyzer" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200">Mulai</a>
      </div>
    </header>
  );
}
