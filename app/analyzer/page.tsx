import Header from "@/components/Header";
import LabelForm from "@/components/LabelForm";

export default async function AnalyzerPage({ searchParams }: { searchParams: Promise<{ sample?: string }> }) {
  const params = await searchParams;
  const sampleRequest = params.sample === "1" ? 1 : 0;

  return (
    <main id="top" className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 rounded-[2rem] border-2 border-emerald-900 bg-[#FFF8E7] p-5 shadow-xl shadow-emerald-900/10">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Step 1 / Step 2</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">Cek label pangan kamu</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Upload label atau isi manual. Setelah klik Analisis Label, hasilnya tampil sebagai dashboard compact seperti belakang kemasan.</p>
        </div>
        <LabelForm sampleRequest={sampleRequest} />
      </div>
    </main>
  );
}
