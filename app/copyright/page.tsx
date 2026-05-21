import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function CopyrightPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Copyright</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">KareFacts</h1>
          <div className="mt-6 space-y-3 text-base font-semibold leading-7 text-slate-700">
            <p>Author: raihanhakim</p>
            <p>&copy; 2026 KareFacts. Copyright by kareayamq.</p>
            <p>Seluruh nama, tampilan, dan konten KareFacts digunakan untuk kebutuhan edukatif.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
