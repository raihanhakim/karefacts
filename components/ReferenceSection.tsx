import { DAILY_REFERENCES, REFERENCES } from "@/lib/constants";
import Badge from "@/components/Badge";

export default function ReferenceSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-black text-slate-950">Acuan Edukatif</h2>
        <Badge tone="Edukasi">Facts first, fear less</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        KareFacts merujuk secara umum pada edukasi label pangan, informasi nilai gizi, pelabelan alergen, klaim pangan, dan anjuran konsumsi GGL. Angka acuan digunakan untuk edukasi, bukan diagnosis kesehatan.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-slate-600">Gula</p><p className="text-2xl font-black text-emerald-800">{DAILY_REFERENCES.sugar} g/hari</p></div>
        <div className="rounded-2xl bg-lime-50 p-4"><p className="text-sm text-slate-600">Natrium</p><p className="text-2xl font-black text-lime-800">{DAILY_REFERENCES.sodium} mg/hari</p></div>
        <div className="rounded-2xl bg-yellow-50 p-4"><p className="text-sm text-slate-600">Lemak total</p><p className="text-2xl font-black text-yellow-800">{DAILY_REFERENCES.totalFat} g/hari</p></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {REFERENCES.map((reference) => <Badge key={reference}>{reference}</Badge>)}
      </div>
    </section>
  );
}
