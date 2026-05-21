import Disclaimer from "@/components/Disclaimer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

const features = ["Fact Check Gula, Garam, Lemak", "Deteksi Potensi Alergen", "Cek Klaim Produk", "Edukasi Konsumsi", "Ringkasan Fakta Label"];
const audiences = ["Anak Teknologi Pangan", "Mahasiswa Gizi", "UMKM Pangan", "Konsumen umum"];

export default function Home() {
  return (
    <main id="top" className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <Hero />
        <div className="mb-8"><Disclaimer /></div>
        <section id="fitur" className="grid gap-4 py-8 md:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Fitur utama</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => <div key={feature} className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-950">{feature}</div>)}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Cocok untuk</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {audiences.map((audience) => <span key={audience} className="rounded-full bg-lime-100 px-4 py-2 text-sm font-bold text-lime-900">{audience}</span>)}
            </div>
            <h3 className="mt-7 text-xl font-black text-slate-950">Cara Kerja</h3>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-700">
              {['Masukkan data label', 'KareFacts membaca angka dan komposisi', 'Hasil analisis muncul dalam bentuk fakta edukatif'].map((step, index) => <p key={step} className="rounded-2xl bg-slate-50 p-4"><span className="mr-2 text-emerald-700">{index + 1}.</span>{step}</p>)}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
