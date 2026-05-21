import BarcodeAccent from "@/components/BarcodeAccent";
import PackagingShell from "@/components/PackagingShell";
import StickerBadge from "@/components/StickerBadge";

export default function Hero() {
  return (
    <section className="halftone-pattern grid gap-8 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
      <div>
        <div className="flex flex-wrap gap-2"><StickerBadge tone="emerald">Food Label Analyzer</StickerBadge><StickerBadge tone="yellow" rotate="right">Facts First</StickerBadge></div>
        <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">KareFacts</h1>
        <p className="mt-3 text-2xl font-black text-emerald-700">Baca fakta di balik label pangan.</p>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
          Upload label makanan atau isi manual, lalu KareFacts bantu baca angka gizi, klaim, komposisi, dan hal yang perlu kamu notice.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href="/analyzer" className="rounded-2xl border-2 border-emerald-900 bg-emerald-600 px-6 py-4 text-center font-black text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200">Mulai Cek Label</a>
          <a href="/analyzer?sample=1" className="rounded-2xl border-2 border-slate-900 bg-yellow-300 px-6 py-4 text-center font-black text-slate-950 shadow-md shadow-yellow-200 hover:bg-yellow-200 focus:outline-none focus:ring-4 focus:ring-yellow-200">Coba Contoh Produk</a>
        </div>
      </div>
      <PackagingShell>
        <div className="flex flex-wrap gap-2"><StickerBadge tone="mint">Smart Label Reader</StickerBadge><StickerBadge tone="orange" rotate="right">No Fear, Just Facts</StickerBadge></div>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-emerald-800">Back of pack, but smarter</p>
        <p className="mt-3 text-4xl font-black leading-tight text-slate-950">Open facts like opening a snack pack.</p>
        <div className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-4">
          <p className="border-b-4 border-slate-900 pb-2 text-xl font-black uppercase">Nutrition Facts-ish</p>
          {['Gula', 'Natrium', 'Lemak', 'Alergen'].map((item) => <div key={item} className="flex justify-between border-b border-slate-200 py-2 text-sm font-black"><span>{item}</span><span>Check</span></div>)}
        </div>
        <div className="mt-4 max-w-40"><BarcodeAccent /></div>
      </PackagingShell>
    </section>
  );
}
